"""Reintentos comunes para las llamadas HTTP (429 y 5xx)."""
from __future__ import annotations

import time
from typing import Any, Callable

RETRYABLE = {429, 500, 502, 503, 504}


def request_with_retry(
    send: Callable[[], Any],
    *,
    attempts: int = 3,
    base_delay: float = 2.0,
    sleep: Callable[[float], None] = time.sleep,
) -> Any:
    """Ejecuta `send()` y reintenta con espera exponencial si la respuesta es reintentable.

    Devuelve la última respuesta (también si sigue fallando): el llamador
    decide qué hacer con el código de estado.
    """
    response = send()
    for attempt in range(1, attempts):
        if response.status_code not in RETRYABLE:
            return response
        sleep(base_delay * (2 ** (attempt - 1)))
        response = send()
    return response
