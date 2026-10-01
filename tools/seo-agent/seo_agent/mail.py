"""Envío del informe con Resend (API REST)."""
from __future__ import annotations

from typing import Any

import requests

from . import USER_AGENT
from .http import request_with_retry

ENDPOINT = "https://api.resend.com/emails"


class MailError(RuntimeError):
    pass


def send_report(
    api_key: str,
    *,
    sender: str,
    to: str,
    subject: str,
    html: str,
    text: str,
    session: Any = None,
) -> str:
    """Envía el correo y devuelve el id de Resend. Lanza MailError con un mensaje claro si falla."""
    http = session or requests.Session()
    # User-Agent propio: Resend está detrás de Cloudflare y bloquea el de requests por defecto.
    headers = {"Authorization": f"Bearer {api_key}", "User-Agent": USER_AGENT, "Content-Type": "application/json"}
    body = {"from": sender, "to": [to], "subject": subject, "html": html, "text": text}
    response = request_with_retry(lambda: http.post(ENDPOINT, headers=headers, json=body, timeout=30))
    if response.status_code // 100 != 2:
        try:
            detail = response.json().get("message", "")
        except ValueError:
            detail = ""
        hint = ""
        if response.status_code in (401, 403):
            hint = " (revisa RESEND_API_KEY y que el dominio del remitente esté verificado en Resend)"
        raise MailError(f"Resend respondió HTTP {response.status_code}: {detail}{hint}")
    return str(response.json().get("id", ""))
