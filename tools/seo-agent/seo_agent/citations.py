"""¿Qué webs nombra la IA al responder una pregunta de compra? (Gemini + búsqueda de Google).

Ojo: la búsqueda con Google ("grounding") NO está en el nivel gratuito de la API
de Gemini. Si la clave no tiene facturación, el módulo lo detecta, lo cuenta en
el informe y el resto del agente sigue funcionando.
"""
from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Any, Callable
from urllib.parse import urlparse

import requests

from . import USER_AGENT
from .config import Config, Project
from .http import request_with_retry

ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
TIMEOUT = 60
UNAVAILABLE_HINTS = ("grounding", "billing", "free tier", "not supported", "not available", "permission", "api key")


@dataclass
class Citation:
    project_id: str
    lang: str
    question: str
    status: str  # ok | error
    domains: list[str] = field(default_factory=list)
    search_queries: list[str] = field(default_factory=list)
    own_cited: bool = False
    brand_mentioned: bool = False
    competitors_cited: list[str] = field(default_factory=list)
    error: str | None = None


@dataclass
class CitationRun:
    status: str  # ok | skipped | unavailable | error
    message: str = ""
    items: list[Citation] = field(default_factory=list)


def normalize_domain(value: str) -> str:
    return value.lower().strip().removeprefix("www.")


def source_domain(chunk: dict[str, Any]) -> str | None:
    """Dominio de una fuente. La API devuelve una redirección de Google y pone el dominio en `title`."""
    web = chunk.get("web") or {}
    host = urlparse(web.get("uri", "")).netloc
    title = (web.get("title") or "").strip()
    if host.endswith("vertexaisearch.cloud.google.com") or not host:
        return normalize_domain(title) if "." in title else None
    return normalize_domain(host)


def parse_response(payload: dict[str, Any], project: Project, lang: str, question: str, own_domain: str) -> Citation:
    candidate = (payload.get("candidates") or [{}])[0]
    text = " ".join(part.get("text", "") for part in (candidate.get("content") or {}).get("parts", []))
    meta = candidate.get("groundingMetadata") or {}
    domains: list[str] = []
    for chunk in meta.get("groundingChunks") or []:
        domain = source_domain(chunk)
        if domain and domain not in domains:
            domains.append(domain)
    own = any(d == own_domain or d.endswith("." + own_domain) for d in domains)
    competitors = [d for d in domains if any(d == c or d.endswith("." + c) for c in project.competitors)]
    lowered = text.lower()
    brand = any(term.lower() in lowered for term in project.brand_terms) or own_domain in lowered
    return Citation(
        project_id=project.id,
        lang=lang,
        question=question,
        status="ok",
        domains=domains,
        search_queries=list(meta.get("webSearchQueries") or []),
        own_cited=own,
        brand_mentioned=brand,
        competitors_cited=competitors,
    )


def run_citations(
    cfg: Config,
    api_key: str | None,
    *,
    session: Any = None,
    sleep: Callable[[float], None] = time.sleep,
) -> CitationRun:
    if not api_key:
        return CitationRun("skipped", "Falta GEMINI_API_KEY: módulo de citaciones omitido.")
    http = session or requests.Session()
    url = ENDPOINT.format(model=cfg.settings.citations_model)
    headers = {"x-goog-api-key": api_key, "User-Agent": USER_AGENT, "Content-Type": "application/json"}
    run = CitationRun("ok")
    consecutive_errors = 0
    asked = 0

    for project in cfg.projects:
        for lang, questions in project.questions.items():
            for question in questions:
                if asked >= cfg.settings.citations_max_queries:
                    run.message = f"Límite de {cfg.settings.citations_max_queries} consultas por semana alcanzado."
                    return run
                if asked:
                    sleep(cfg.settings.citations_delay_seconds)
                asked += 1
                body = {"contents": [{"parts": [{"text": question}]}], "tools": [{"google_search": {}}]}
                response = request_with_retry(
                    lambda: http.post(url, headers=headers, json=body, timeout=TIMEOUT), sleep=sleep
                )
                if response.status_code == 200:
                    consecutive_errors = 0
                    run.items.append(parse_response(response.json(), project, lang, question, cfg.domain))
                    continue

                try:
                    detail = response.json().get("error", {}).get("message", "")
                except ValueError:
                    detail = ""
                error = f"HTTP {response.status_code}" + (f": {detail[:200]}" if detail else "")
                if response.status_code in (400, 401, 403, 404) and any(h in detail.lower() for h in UNAVAILABLE_HINTS):
                    return CitationRun(
                        "unavailable",
                        "Gemini rechazó la búsqueda con Google (suele ser que el proyecto no tiene facturación activa; "
                        f"el nivel gratuito no la incluye). Detalle: {error}",
                        run.items,
                    )
                consecutive_errors += 1
                run.items.append(Citation(project.id, lang, question, "error", error=error))
                if response.status_code == 429 or consecutive_errors >= 3:
                    run.status = "error"
                    run.message = f"Se detuvo tras errores seguidos. Último: {error}"
                    return run
    return run
