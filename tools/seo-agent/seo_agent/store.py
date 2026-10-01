"""Histórico semanal: un JSON por ejecución en data/snapshots/AAAA-MM-DD.json.

En producción `data/` es la rama `seo-data` del repo (ver el workflow): así el
histórico no toca `main` ni dispara el despliegue de la web.
"""
from __future__ import annotations

import json
from datetime import date
from pathlib import Path
from typing import Any


def snapshots_dir(data_dir: Path) -> Path:
    return data_dir / "snapshots"


def save_snapshot(data_dir: Path, day: date, snapshot: dict[str, Any]) -> Path:
    folder = snapshots_dir(data_dir)
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / f"{day.isoformat()}.json"
    path.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return path


def load_previous(data_dir: Path, before: date) -> dict[str, Any] | None:
    """Último snapshot anterior a `before` (None si es la primera ejecución)."""
    folder = snapshots_dir(data_dir)
    if not folder.is_dir():
        return None
    candidates = sorted(p for p in folder.glob("*.json") if p.stem < before.isoformat())
    if not candidates:
        return None
    try:
        return json.loads(candidates[-1].read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None
