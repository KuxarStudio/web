"""Carga y validación de projects.yaml.

El registro de proyectos es la única fuente de verdad: añadir un juego, app o
herramienta nueva es añadir un bloque en el YAML, sin tocar código. Con `paused: true` un proyecto se conserva en el YAML pero el
agente lo ignora por completo (sus páginas pasan a contar para el estudio).
"""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml


class ConfigError(ValueError):
    """projects.yaml mal formado (el mensaje dice qué y dónde)."""


@dataclass(frozen=True)
class Project:
    id: str
    name: str
    prefixes: tuple[str, ...]
    key_pages: tuple[str, ...] = ()
    questions: dict[str, tuple[str, ...]] = field(default_factory=dict)
    competitors: tuple[str, ...] = ()
    brand_terms: tuple[str, ...] = ()
    evidence_prompt: str | None = None
    outreach_ideas: tuple[str, ...] = ()
    store_url: str | None = None


@dataclass(frozen=True)
class Settings:
    window_days: int = 28
    gsc_lag_days: int = 3
    quick_win_min_position: float = 8.0
    quick_win_max_position: float = 20.0
    min_impressions: int = 5
    max_jobs: int = 8
    citations_enabled: bool = True
    citations_max_queries: int = 30
    citations_model: str = "gemini-flash-latest"
    citations_delay_seconds: float = 4.0


@dataclass(frozen=True)
class Config:
    domain: str
    gsc_property: str
    languages: tuple[str, ...]
    settings: Settings
    projects: tuple[Project, ...]

    def project_for_path(self, path: str) -> Project | None:
        """Proyecto dueño de una ruta: gana el prefijo más largo."""
        best: tuple[int, Project] | None = None
        for project in self.projects:
            for prefix in project.prefixes:
                if path.startswith(prefix) and (best is None or len(prefix) > best[0]):
                    best = (len(prefix), project)
        return best[1] if best else None


def _require(data: dict[str, Any], key: str, where: str) -> Any:
    if key not in data or data[key] in (None, ""):
        raise ConfigError(f"{where}: falta '{key}'")
    return data[key]


def _paths(values: Any, where: str) -> tuple[str, ...]:
    if not isinstance(values, list) or not values:
        raise ConfigError(f"{where}: debe ser una lista no vacía de rutas")
    for value in values:
        if not isinstance(value, str) or not value.startswith("/"):
            raise ConfigError(f"{where}: la ruta {value!r} debe empezar por '/'")
    return tuple(values)


def parse_config(raw: dict[str, Any]) -> Config:
    if not isinstance(raw, dict):
        raise ConfigError("projects.yaml debe ser un mapa")
    site = _require(raw, "site", "raíz")
    domain = str(_require(site, "domain", "site")).lower().removeprefix("www.")
    gsc_property = str(_require(site, "gsc_property", "site"))
    languages = tuple(site.get("languages") or ("es", "en"))

    settings_raw = raw.get("settings") or {}
    known = Settings.__dataclass_fields__.keys()
    unknown = set(settings_raw) - set(known)
    if unknown:
        raise ConfigError(f"settings: claves desconocidas {sorted(unknown)}")
    settings = Settings(**settings_raw)

    projects: list[Project] = []
    seen: set[str] = set()
    for index, item in enumerate(_require(raw, "projects", "raíz")):
        where = f"projects[{index}]"
        pid = str(_require(item, "id", where))
        if pid in seen:
            raise ConfigError(f"{where}: id duplicado '{pid}'")
        seen.add(pid)
        where = f"projects[{pid}]"
        if item.get("paused"):
            # Proyecto aparcado: no entra en el informe, ni en las consultas de IA, ni en los trabajos.
            continue
        questions_raw = item.get("questions") or {}
        bad_langs = set(questions_raw) - set(languages)
        if bad_langs:
            raise ConfigError(f"{where}.questions: idiomas no declarados {sorted(bad_langs)}")
        name = str(_require(item, "name", where))
        projects.append(
            Project(
                id=pid,
                name=name,
                prefixes=_paths(item.get("prefixes"), f"{where}.prefixes"),
                key_pages=_paths(item["key_pages"], f"{where}.key_pages") if item.get("key_pages") else (),
                questions={lang: tuple(qs) for lang, qs in questions_raw.items()},
                competitors=tuple(d.lower().removeprefix("www.") for d in item.get("competitors") or ()),
                brand_terms=tuple(item.get("brand_terms") or (name,)),
                evidence_prompt=item.get("evidence_prompt"),
                outreach_ideas=tuple(item.get("outreach_ideas") or ()),
                store_url=item.get("store_url"),
            )
        )
    return Config(domain, gsc_property, languages, settings, tuple(projects))


def load_config(path: str | Path) -> Config:
    with open(path, encoding="utf-8") as handle:
        return parse_config(yaml.safe_load(handle))
