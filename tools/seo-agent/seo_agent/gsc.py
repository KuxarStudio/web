"""Cliente mínimo de Google Search Console (solo lectura) por REST."""
from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import date
from typing import Any
from urllib.parse import quote

from .http import request_with_retry

SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"
API = "https://www.googleapis.com/webmasters/v3"
ROW_LIMIT = 25_000
TIMEOUT = 30


class GscError(RuntimeError):
    """Fallo al hablar con Search Console (mensaje legible, sin credenciales)."""


@dataclass(frozen=True)
class Row:
    page: str
    query: str | None
    clicks: float
    impressions: float
    ctr: float
    position: float


class SearchConsole:
    def __init__(self, session: Any, property_id: str):
        self._session = session
        self._site = quote(property_id, safe="")
        self.property_id = property_id

    @classmethod
    def from_service_account_json(cls, raw_json: str, property_id: str) -> "SearchConsole":
        # Import local: las pruebas inyectan una sesión falsa y no necesitan google-auth.
        from google.auth.transport.requests import AuthorizedSession
        from google.oauth2 import service_account

        try:
            info = json.loads(raw_json)
            credentials = service_account.Credentials.from_service_account_info(info, scopes=[SCOPE])
        except (ValueError, KeyError) as error:
            raise GscError("GSC_SERVICE_ACCOUNT_JSON no es un JSON de cuenta de servicio válido") from error
        return cls(AuthorizedSession(credentials), property_id)

    def _describe(self, response: Any) -> str:
        try:
            message = response.json().get("error", {}).get("message", "")
        except ValueError:
            message = ""
        return f"HTTP {response.status_code}" + (f": {message}" if message else "")

    def query(self, start: date, end: date, dimensions: list[str]) -> list[Row]:
        """searchAnalytics.query paginado. `dimensions` en el orden de las claves devueltas."""
        url = f"{API}/sites/{self._site}/searchAnalytics/query"
        rows: list[Row] = []
        start_row = 0
        while True:
            body = {
                "startDate": start.isoformat(),
                "endDate": end.isoformat(),
                "dimensions": dimensions,
                "rowLimit": ROW_LIMIT,
                "startRow": start_row,
            }
            response = request_with_retry(lambda: self._session.post(url, json=body, timeout=TIMEOUT))
            if response.status_code != 200:
                hint = ""
                if response.status_code == 403:
                    hint = " (¿está la cuenta de servicio añadida como usuario en la propiedad de Search Console?)"
                raise GscError(f"searchAnalytics.query falló: {self._describe(response)}{hint}")
            batch = response.json().get("rows", [])
            for item in batch:
                keys = item.get("keys", [])
                rows.append(
                    Row(
                        page=keys[dimensions.index("page")],
                        query=keys[dimensions.index("query")] if "query" in dimensions else None,
                        clicks=float(item.get("clicks", 0)),
                        impressions=float(item.get("impressions", 0)),
                        ctr=float(item.get("ctr", 0)),
                        position=float(item.get("position", 0)),
                    )
                )
            if len(batch) < ROW_LIMIT:
                return rows
            start_row += ROW_LIMIT

    def sitemaps(self) -> list[dict[str, Any]]:
        url = f"{API}/sites/{self._site}/sitemaps"
        response = request_with_retry(lambda: self._session.get(url, timeout=TIMEOUT))
        if response.status_code != 200:
            raise GscError(f"sitemaps.list falló: {self._describe(response)}")
        return response.json().get("sitemap", [])
