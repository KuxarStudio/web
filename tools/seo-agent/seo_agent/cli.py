"""Orquestación: Search Console → citaciones de IA → trabajos → informe → correo → histórico.

Uso:
    python -m seo_agent run --dry-run          # genera out/report.html y NO envía correo
    python -m seo_agent run                     # envía el correo y guarda el snapshot
Variables de entorno: GSC_SERVICE_ACCOUNT_JSON, GEMINI_API_KEY, RESEND_API_KEY,
SEO_REPORT_TO (destinatario) y SEO_REPORT_FROM (remitente, opcional).
"""
from __future__ import annotations

import argparse
import logging
import os
import sys
from datetime import date, timedelta
from pathlib import Path

from .analysis import build_stats, make_jobs
from .citations import CitationRun, run_citations
from .config import ConfigError, load_config
from .gsc import GscError, SearchConsole
from .mail import MailError, send_report
from .report import ReportInput, build_report
from .store import load_previous, save_snapshot

log = logging.getLogger("seo_agent")
DEFAULT_FROM = "Kuxar SEO <seo@kuxarstudio.com>"
DEFAULT_TO = "admin@kuxarstudio.com"


def windows(today: date, days: int, lag: int) -> tuple[tuple[date, date], tuple[date, date]]:
    end = today - timedelta(days=lag)
    start = end - timedelta(days=days - 1)
    prev_end = start - timedelta(days=1)
    prev_start = prev_end - timedelta(days=days - 1)
    return (start, end), (prev_start, prev_end)


def run(args: argparse.Namespace, env: dict[str, str] | None = None, today: date | None = None) -> int:
    env = dict(os.environ) if env is None else env
    today = today or date.today()
    try:
        cfg = load_config(args.config)
    except (ConfigError, OSError) as error:
        log.error("Configuración inválida: %s", error)
        return 2

    window, prev_window = windows(today, cfg.settings.window_days, cfg.settings.gsc_lag_days)
    warnings: list[str] = []
    cur_pages = prev_pages = cur_queries = []
    sitemaps = None

    # 1) Search Console. Si falla, seguimos y lo contamos en el informe.
    gsc_json = env.get("GSC_SERVICE_ACCOUNT_JSON")
    if not gsc_json:
        warnings.append("Falta GSC_SERVICE_ACCOUNT_JSON: sin datos de Search Console esta semana.")
    else:
        try:
            gsc = SearchConsole.from_service_account_json(gsc_json, cfg.gsc_property)
            cur_pages = gsc.query(*window, ["page"])
            prev_pages = gsc.query(*prev_window, ["page"])
            cur_queries = gsc.query(*window, ["page", "query"])
            try:
                sitemaps = gsc.sitemaps()
            except GscError as error:
                warnings.append(f"No se pudo leer la lista de sitemaps: {error}")
        except GscError as error:
            warnings.append(f"Search Console: {error}")
            log.error("Search Console: %s", error)

    # 2) Citaciones de IA (opcional).
    citation_run: CitationRun | None = None
    if args.no_citations:
        pass
    elif not cfg.settings.citations_enabled:
        citation_run = CitationRun("skipped", "Módulo de citaciones desactivado (citations_enabled: false en projects.yaml).")
    else:
        citation_run = run_citations(cfg, env.get("GEMINI_API_KEY"))
        log.info("Citaciones: %s (%d resultados)", citation_run.status, len(citation_run.items))

    # 3) Análisis, trabajos e informe.
    stats, quick_wins = build_stats(cfg, cur_pages, prev_pages, cur_queries)
    jobs = make_jobs(cfg, stats, quick_wins, citation_run.items if citation_run else None, today)
    report = build_report(
        ReportInput(
            today=today,
            window=window,
            previous_window=prev_window,
            stats=stats,
            quick_wins=quick_wins,
            jobs=jobs,
            citation_run=citation_run,
            sitemaps=sitemaps,
            warnings=warnings,
            previous_snapshot=load_previous(Path(args.data_dir), today),
        )
    )

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "report.html").write_text(report.html, encoding="utf-8")
    (out_dir / "report.txt").write_text(report.text, encoding="utf-8")
    log.info("Informe escrito en %s", out_dir)

    if args.dry_run:
        print(report.text)
        return 0

    api_key = env.get("RESEND_API_KEY")
    if not api_key:
        log.error("Falta RESEND_API_KEY: no se puede enviar el informe.")
        return 1
    try:
        message_id = send_report(
            api_key,
            sender=env.get("SEO_REPORT_FROM") or DEFAULT_FROM,
            to=env.get("SEO_REPORT_TO") or DEFAULT_TO,
            subject=report.subject,
            html=report.html,
            text=report.text,
        )
    except MailError as error:
        log.error("%s", error)
        return 1
    log.info("Correo enviado (id %s)", message_id)

    # El snapshot se guarda solo tras enviar: si el correo falla, la semana se puede repetir.
    save_snapshot(Path(args.data_dir), today, report.snapshot)
    return 0


def main(argv: list[str] | None = None) -> int:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    parser = argparse.ArgumentParser(prog="seo_agent")
    sub = parser.add_subparsers(dest="command", required=True)
    run_parser = sub.add_parser("run", help="genera y envía el informe semanal")
    run_parser.add_argument("--config", default="projects.yaml")
    run_parser.add_argument("--data-dir", default="data", help="carpeta del histórico (snapshots/)")
    run_parser.add_argument("--out-dir", default="out")
    run_parser.add_argument("--dry-run", action="store_true", help="no envía correo ni guarda histórico")
    run_parser.add_argument("--no-citations", action="store_true", help="omite el módulo de citaciones de IA")
    args = parser.parse_args(argv)
    return run(args)


if __name__ == "__main__":
    sys.exit(main())
