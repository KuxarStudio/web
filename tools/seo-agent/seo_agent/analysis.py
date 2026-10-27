"""Análisis de Search Console por proyecto y generación de los trabajos de la semana.

Todo es función pura sobre datos ya descargados: así se prueba sin red.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from urllib.parse import urlparse

from .config import Config, Project
from .gsc import Row


LANG_NAMES = {"es": "español", "en": "inglés"}


@dataclass(frozen=True)
class Metrics:
    clicks: float = 0.0
    impressions: float = 0.0
    ctr: float = 0.0
    position: float = 0.0  # media ponderada por impresiones; 0 = sin datos


def aggregate(rows: list[Row]) -> Metrics:
    impressions = sum(r.impressions for r in rows)
    clicks = sum(r.clicks for r in rows)
    if impressions <= 0:
        return Metrics(clicks=clicks)
    position = sum(r.position * r.impressions for r in rows) / impressions
    return Metrics(clicks, impressions, clicks / impressions, position)


def path_of(url: str) -> str:
    return urlparse(url).path or "/"


def lang_of_path(path: str) -> str:
    return "en" if path == "/en" or path.startswith("/en/") else "es"


@dataclass
class ProjectStats:
    project: Project
    current: Metrics = field(default_factory=Metrics)
    previous: Metrics = field(default_factory=Metrics)
    by_lang: dict[str, Metrics] = field(default_factory=dict)
    top_queries: list[dict] = field(default_factory=list)
    key_pages_without_impressions: list[str] = field(default_factory=list)


@dataclass(frozen=True)
class QuickWin:
    project_id: str
    path: str
    query: str
    position: float
    impressions: float
    clicks: float


@dataclass(frozen=True)
class Job:
    project_id: str
    kind: str  # quick-win | indexacion | idioma | citacion | evidencia | enlaces
    title: str
    detail: str
    priority: int  # menor = antes


def build_stats(
    cfg: Config,
    cur_pages: list[Row],
    prev_pages: list[Row],
    cur_queries: list[Row],
) -> tuple[dict[str, ProjectStats], list[QuickWin]]:
    """Reparte las filas de GSC entre proyectos (prefijo más largo) y calcula métricas."""
    by_project_cur: dict[str, list[Row]] = {p.id: [] for p in cfg.projects}
    by_project_prev: dict[str, list[Row]] = {p.id: [] for p in cfg.projects}
    by_project_lang: dict[str, dict[str, list[Row]]] = {p.id: {} for p in cfg.projects}
    seen_paths: dict[str, set[str]] = {p.id: set() for p in cfg.projects}

    for row in cur_pages:
        path = path_of(row.page)
        project = cfg.project_for_path(path)
        if not project:
            continue
        by_project_cur[project.id].append(row)
        by_project_lang[project.id].setdefault(lang_of_path(path), []).append(row)
        if row.impressions > 0:
            seen_paths[project.id].add(path)
    for row in prev_pages:
        project = cfg.project_for_path(path_of(row.page))
        if project:
            by_project_prev[project.id].append(row)

    queries_by_project: dict[str, dict[str, list[Row]]] = {p.id: {} for p in cfg.projects}
    quick_wins: list[QuickWin] = []
    lo, hi = cfg.settings.quick_win_min_position, cfg.settings.quick_win_max_position
    for row in cur_queries:
        if not row.query:
            continue
        path = path_of(row.page)
        project = cfg.project_for_path(path)
        if not project:
            continue
        queries_by_project[project.id].setdefault(row.query, []).append(row)
        if lo <= row.position <= hi and row.impressions >= cfg.settings.min_impressions:
            quick_wins.append(QuickWin(project.id, path, row.query, row.position, row.impressions, row.clicks))
    quick_wins.sort(key=lambda w: (-w.impressions, w.position))

    stats: dict[str, ProjectStats] = {}
    for project in cfg.projects:
        top = []
        for query, rows in queries_by_project[project.id].items():
            metrics = aggregate(rows)
            top.append(
                {"query": query, "impressions": metrics.impressions, "clicks": metrics.clicks, "position": metrics.position}
            )
        top.sort(key=lambda q: (-q["impressions"], -q["clicks"]))
        stats[project.id] = ProjectStats(
            project=project,
            current=aggregate(by_project_cur[project.id]),
            previous=aggregate(by_project_prev[project.id]),
            by_lang={lang: aggregate(rows) for lang, rows in by_project_lang[project.id].items()},
            top_queries=top[:5],
            key_pages_without_impressions=[p for p in project.key_pages if p not in seen_paths[project.id]],
        )
    return stats, quick_wins


def _week_pick(items: list, week: int):
    return items[week % len(items)] if items else None


def make_jobs(
    cfg: Config,
    stats: dict[str, ProjectStats],
    quick_wins: list[QuickWin],
    citations: list | None,
    today: date,
) -> list[Job]:
    """Trabajos sugeridos para la próxima semana, de más a menos prioritarios.

    Reglas (cada una cubre una de las 8 tareas del flujo):
      - quick-win: consultas en posición 8-20 → reforzar esa página (tarea 6).
      - indexacion / idioma: páginas clave sin impresiones (tareas 1 y 6).
      - citacion: preguntas de compra donde la IA cita a otros y no a nosotros (tareas 2, 3 y 5).
      - evidencia: un dato real que aportar, rotando de proyecto cada semana (tarea 4).
      - enlaces: una vez al mes, buscar sitios a los que mostrar la página (tarea 7).
    """
    jobs: list[Job] = []
    names = {p.id: p.name for p in cfg.projects}

    for win in quick_wins[:3]:
        jobs.append(
            Job(
                win.project_id,
                "quick-win",
                f"Reforzar {win.path} para «{win.query}»",
                f"Sale en posición {win.position:.1f} con {win.impressions:.0f} impresiones. "
                "Añade una respuesta directa a esa pregunta, con pasos y un ejemplo real, y enlázala desde páginas relacionadas.",
                10,
            )
        )

    for pid, st in stats.items():
        missing = st.key_pages_without_impressions
        if not missing:
            continue
        by_lang = {lang: m for lang, m in st.by_lang.items() if m.impressions > 0}
        if by_lang and len(by_lang) < len(cfg.languages):
            absent = ", ".join(LANG_NAMES.get(l, l) for l in sorted(set(cfg.languages) - set(by_lang)))
            jobs.append(
                Job(
                    pid,
                    "idioma",
                    f"{names[pid]}: sin impresiones en {absent}",
                    "Revisa que la versión traducida esté indexada (hreflang, sitemap) y que el título y la descripción respondan a lo que se busca en ese idioma.",
                    20,
                )
            )
        else:
            jobs.append(
                Job(
                    pid,
                    "indexacion",
                    f"{names[pid]}: sin impresiones en Google",
                    f"Páginas sin datos: {', '.join(missing)}. Pide la indexación en Search Console (Inspección de URLs) y comprueba que el sitemap las incluye.",
                    30,
                )
            )

    for item in citations or []:
        if item.status == "ok" and not item.own_cited and item.domains:
            jobs.append(
                Job(
                    item.project_id,
                    "citacion",
                    f"Responder «{item.question}»",
                    f"La IA cita a {', '.join(item.domains[:3])} y no a nosotros. Crea o mejora una página que conteste esa pregunta con pasos y un ejemplo real.",
                    25,
                )
            )

    week = today.isocalendar().week
    with_evidence = [p for p in cfg.projects]
    chosen = _week_pick(with_evidence, week)
    if chosen:
        prompt = chosen.evidence_prompt or (
            f"¿Qué test, número o ejemplo real de {chosen.name} puedes compartir esta semana? Algo medido de verdad, no una opinión."
        )
        if chosen.differentiator:
            prompt = f"{prompt} Diferenciador a demostrar: {chosen.differentiator}"
        jobs.append(Job(chosen.id, "evidencia", f"{chosen.name}: aporta un dato propio", prompt, 40))

    if today.day <= 7:
        target = _week_pick([p for p in cfg.projects if p.outreach_ideas] or list(cfg.projects), week)
        ideas = ", ".join(target.outreach_ideas) if target and target.outreach_ideas else "directorios y listas del sector"
        jobs.append(
            Job(
                target.id,
                "enlaces",
                f"{target.name}: pide 3 enlaces",
                f"Busca 3 sitios donde encaje de verdad (ideas: {ideas}) y enséñales qué aporta tu página. Nada de envíos masivos.",
                50,
            )
        )

    jobs.sort(key=lambda j: j.priority)
    return jobs[: cfg.settings.max_jobs]
