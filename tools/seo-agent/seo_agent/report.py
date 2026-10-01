"""Construye el informe semanal (HTML + texto plano) y el snapshot para el histórico."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from html import escape
from typing import Any

from .analysis import Job, Metrics, ProjectStats, QuickWin, aggregate
from .citations import CitationRun


@dataclass
class ReportInput:
    today: date
    window: tuple[date, date]
    previous_window: tuple[date, date]
    stats: dict[str, ProjectStats]
    quick_wins: list[QuickWin]
    jobs: list[Job]
    citation_run: CitationRun | None = None
    sitemaps: list[dict[str, Any]] | None = None
    warnings: list[str] = field(default_factory=list)
    previous_snapshot: dict[str, Any] | None = None


@dataclass
class Report:
    subject: str
    html: str
    text: str
    snapshot: dict[str, Any]


def _total(stats: dict[str, ProjectStats], attr: str) -> Metrics:
    from .gsc import Row

    rows = []
    for st in stats.values():
        m: Metrics = getattr(st, attr)
        if m.impressions or m.clicks:
            rows.append(Row("", None, m.clicks, m.impressions, m.ctr, m.position))
    return aggregate(rows)


def _delta(cur: float, prev: float) -> str:
    if prev <= 0:
        return "nuevo" if cur > 0 else "—"
    change = (cur - prev) / prev * 100
    return f"{change:+.0f}%"


def _num(value: float) -> str:
    return f"{value:,.0f}".replace(",", ".")


def _pos(value: float) -> str:
    return f"{value:.1f}" if value > 0 else "—"


def _pct(value: float) -> str:
    return f"{value * 100:.1f}%".replace(".", ",")


def citation_summary(run: CitationRun | None) -> dict[str, dict[str, int]]:
    summary: dict[str, dict[str, int]] = {}
    if not run:
        return summary
    for item in run.items:
        if item.status != "ok":
            continue
        entry = summary.setdefault(item.project_id, {"asked": 0, "own": 0, "brand": 0})
        entry["asked"] += 1
        entry["own"] += int(item.own_cited)
        entry["brand"] += int(item.brand_mentioned)
    return summary


def build_snapshot(inp: ReportInput) -> dict[str, Any]:
    total = _total(inp.stats, "current")
    return {
        "date": inp.today.isoformat(),
        "window": [inp.window[0].isoformat(), inp.window[1].isoformat()],
        "total": {"clicks": total.clicks, "impressions": total.impressions, "position": total.position},
        "projects": {
            pid: {"clicks": st.current.clicks, "impressions": st.current.impressions, "position": st.current.position}
            for pid, st in inp.stats.items()
        },
        "citations": citation_summary(inp.citation_run),
    }


# ---------------------------------------------------------------- texto plano
def _text(inp: ReportInput, subject: str) -> str:
    total, prev = _total(inp.stats, "current"), _total(inp.stats, "previous")
    out = [subject, "=" * len(subject), ""]
    out.append(f"Periodo: {inp.window[0]} a {inp.window[1]} (frente a {inp.previous_window[0]} a {inp.previous_window[1]})")
    if inp.warnings:
        out += ["", "AVISOS"] + [f"- {w}" for w in inp.warnings]
    out += [
        "",
        "RESUMEN DE LA WEB",
        f"Clics {_num(total.clicks)} ({_delta(total.clicks, prev.clicks)}) · Impresiones {_num(total.impressions)} "
        f"({_delta(total.impressions, prev.impressions)}) · Posición media {_pos(total.position)}",
        "",
        "POR PROYECTO",
    ]
    for pid, st in inp.stats.items():
        langs = " · ".join(f"{l.upper()} {_num(m.impressions)}" for l, m in sorted(st.by_lang.items()))
        out.append(
            f"- {st.project.name}: {_num(st.current.clicks)} clics, {_num(st.current.impressions)} impr. "
            f"({_delta(st.current.impressions, st.previous.impressions)}), pos. {_pos(st.current.position)}"
            + (f" [{langs}]" if langs else "")
        )
    if inp.quick_wins:
        out += ["", "OPORTUNIDADES RÁPIDAS (posición 8-20)"]
        out += [f"- «{w.query}» en {w.path}: pos. {w.position:.1f}, {_num(w.impressions)} impr." for w in inp.quick_wins[:10]]
    run = inp.citation_run
    out += ["", "CITACIONES DE IA"]
    if not run or run.status in ("skipped", "unavailable"):
        out.append(run.message if run else "Módulo no ejecutado.")
    else:
        for pid, entry in citation_summary(run).items():
            out.append(f"- {inp.stats[pid].project.name}: nos citó en {entry['own']} de {entry['asked']} preguntas")
        if run.message:
            out.append(run.message)
    if inp.sitemaps is not None:
        out += ["", "SITEMAPS"]
        for sm in inp.sitemaps:
            out.append(f"- {sm.get('path')}: {sm.get('errors', 0)} errores, {sm.get('warnings', 0)} avisos")
    out += ["", "TRABAJOS PARA LA SEMANA QUE VIENE"]
    out += [f"{i}. {j.title}\n   {j.detail}" for i, j in enumerate(inp.jobs, 1)] or ["- Nada urgente."]
    return "\n".join(out) + "\n"


# ------------------------------------------------------------------------ HTML
_CSS = {
    "body": "margin:0;padding:0;background:#f4f4f2;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#15171a;",
    "wrap": "max-width:640px;margin:0 auto;padding:20px 16px;",
    "card": "background:#ffffff;border-radius:12px;padding:18px 20px;margin:0 0 14px;",
    "h1": "font-size:20px;margin:0 0 4px;",
    "h2": "font-size:15px;margin:0 0 10px;",
    "muted": "color:#5d6470;font-size:13px;",
    "table": "width:100%;border-collapse:collapse;font-size:13px;",
    "th": "text-align:left;color:#5d6470;font-weight:600;padding:6px 6px 6px 0;border-bottom:1px solid #e6e6e2;",
    "td": "padding:7px 6px 7px 0;border-bottom:1px solid #f0f0ec;vertical-align:top;",
    "warn": "background:#fff4e5;border-radius:12px;padding:12px 16px;margin:0 0 14px;font-size:13px;color:#7a4a00;",
}


def _tag(tag: str, content: str, style: str = "", **attrs: str) -> str:
    extra = "".join(f' {k}="{escape(v)}"' for k, v in attrs.items())
    return f'<{tag} style="{_CSS.get(style, style)}"{extra}>{content}</{tag}>'


def _html(inp: ReportInput, subject: str) -> str:
    total, prev = _total(inp.stats, "current"), _total(inp.stats, "previous")
    e = escape
    parts: list[str] = []
    parts.append(
        _tag(
            "div",
            _tag("h1", e(subject), "h1")
            + _tag("div", e(f"{inp.window[0]} → {inp.window[1]} · frente a los 28 días anteriores"), "muted"),
            "card",
        )
    )
    for warning in inp.warnings:
        parts.append(_tag("div", e(warning), "warn"))

    parts.append(
        _tag(
            "div",
            _tag("h2", "Resumen de la web", "h2")
            + _tag(
                "div",
                e(
                    f"{_num(total.clicks)} clics ({_delta(total.clicks, prev.clicks)}) · "
                    f"{_num(total.impressions)} impresiones ({_delta(total.impressions, prev.impressions)}) · "
                    f"posición media {_pos(total.position)} · CTR {_pct(total.ctr)}"
                ),
                "font-size:14px;",
            ),
            "card",
        )
    )

    head = "".join(_tag("th", e(h), "th") for h in ("Proyecto", "Clics", "Impr.", "Δ impr.", "Pos.", "Idiomas"))
    body = ""
    for st in inp.stats.values():
        langs = " · ".join(f"{l.upper()} {_num(m.impressions)}" for l, m in sorted(st.by_lang.items())) or "—"
        cells = [
            e(st.project.name),
            _num(st.current.clicks),
            _num(st.current.impressions),
            _delta(st.current.impressions, st.previous.impressions),
            _pos(st.current.position),
            langs,
        ]
        body += "<tr>" + "".join(_tag("td", e(c) if i else f"<b>{c}</b>", "td") for i, c in enumerate(cells)) + "</tr>"
    parts.append(
        _tag("div", _tag("h2", "Por proyecto", "h2") + _tag("table", f"<tr>{head}</tr>{body}", "table"), "card")
    )

    if inp.quick_wins:
        rows = "".join(
            "<tr>"
            + _tag("td", f"«{e(w.query)}»<br>" + _tag("span", e(w.path), "muted"), "td")
            + _tag("td", f"{w.position:.1f}", "td")
            + _tag("td", _num(w.impressions), "td")
            + "</tr>"
            for w in inp.quick_wins[:10]
        )
        parts.append(
            _tag(
                "div",
                _tag("h2", "Oportunidades rápidas (posición 8-20)", "h2")
                + _tag(
                    "table",
                    "<tr>" + "".join(_tag("th", h, "th") for h in ("Consulta", "Pos.", "Impr.")) + f"</tr>{rows}",
                    "table",
                ),
                "card",
            )
        )

    run = inp.citation_run
    cit = _tag("h2", "Qué webs cita la IA", "h2")
    if not run or run.status in ("skipped", "unavailable"):
        cit += _tag("div", e(run.message if run else "Módulo no ejecutado."), "muted")
    else:
        summary = citation_summary(run)
        previous = (inp.previous_snapshot or {}).get("citations", {})
        lines = ""
        for pid, entry in summary.items():
            was = previous.get(pid)
            trend = f" (antes {was['own']}/{was['asked']})" if was else ""
            domains: dict[str, int] = {}
            for item in run.items:
                if item.project_id == pid and item.status == "ok":
                    for d in item.domains:
                        domains[d] = domains.get(d, 0) + 1
            top = ", ".join(f"{d} ({n})" for d, n in sorted(domains.items(), key=lambda kv: -kv[1])[:4]) or "sin fuentes"
            lines += _tag(
                "div",
                f"<b>{e(inp.stats[pid].project.name)}</b>: nos citó en {entry['own']} de {entry['asked']}{e(trend)}"
                + _tag("div", e(f"Fuentes más citadas: {top}"), "muted"),
                "margin:0 0 8px;font-size:13px;",
            )
        searches = sorted({q for item in run.items for q in item.search_queries})[:8]
        cit += lines or _tag("div", "Sin resultados esta semana.", "muted")
        if searches:
            cit += _tag("div", e("Búsquedas que hizo la IA: " + "; ".join(searches)), "muted")
        if run.message:
            cit += _tag("div", e(run.message), "muted")
    parts.append(_tag("div", cit, "card"))

    if inp.sitemaps is not None:
        sm = "".join(
            _tag("div", e(f"{s.get('path')}: {s.get('errors', 0)} errores, {s.get('warnings', 0)} avisos"), "font-size:13px;")
            for s in inp.sitemaps
        ) or _tag("div", "No hay sitemaps enviados.", "muted")
        parts.append(_tag("div", _tag("h2", "Sitemaps", "h2") + sm, "card"))

    jobs = "".join(
        _tag(
            "li",
            f"<b>{e(j.title)}</b>" + _tag("div", e(j.detail), "muted"),
            "margin:0 0 10px;",
        )
        for j in inp.jobs
    ) or _tag("li", "Nada urgente.", "muted")
    parts.append(_tag("div", _tag("h2", "Trabajos para la semana que viene", "h2") + _tag("ol", jobs, "padding-left:20px;margin:0;"), "card"))

    return (
        '<!doctype html><html lang="es"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1"></head>'
        f'<body style="{_CSS["body"]}"><div style="{_CSS["wrap"]}">{"".join(parts)}</div></body></html>'
    )


def build_report(inp: ReportInput) -> Report:
    total = _total(inp.stats, "current")
    subject = f"SEO Kuxar · semana del {inp.today.isoformat()} · {_num(total.clicks)} clics, {_num(total.impressions)} impresiones"
    return Report(subject, _html(inp, subject), _text(inp, subject), build_snapshot(inp))
