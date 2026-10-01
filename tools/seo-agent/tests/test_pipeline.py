"""Flujo completo con servicios falsos: informe, correo y snapshot."""
import argparse
import json
from datetime import date
from pathlib import Path

import pytest

from seo_agent import cli
from seo_agent.cli import windows
from seo_agent.mail import MailError, send_report
from seo_agent.store import load_previous, save_snapshot

ROOT = Path(__file__).resolve().parents[1]


def args(tmp_path, **kw):
    base = dict(config=str(ROOT / "projects.yaml"), data_dir=str(tmp_path / "data"), out_dir=str(tmp_path / "out"), dry_run=False, no_citations=True)
    base.update(kw)
    return argparse.Namespace(**base)


def test_windows_apply_lag_and_do_not_overlap():
    (start, end), (pstart, pend) = windows(date(2026, 10, 5), 28, 3)
    assert end == date(2026, 10, 2) and (end - start).days == 27
    assert pend == start.fromordinal(start.toordinal() - 1) and (pend - pstart).days == 27


def test_dry_run_without_credentials_still_produces_report(tmp_path, capsys):
    code = cli.run(args(tmp_path, dry_run=True), env={}, today=date(2026, 10, 5))
    assert code == 0
    html = (tmp_path / "out" / "report.html").read_text()
    assert "Falta GSC_SERVICE_ACCOUNT_JSON" in html and "Trabajos para la semana" in html
    assert not (tmp_path / "data").exists()  # dry-run no guarda histórico


def test_send_failure_returns_error_and_keeps_snapshot_unsaved(tmp_path, monkeypatch):
    def boom(*a, **k):
        raise MailError("Resend respondió HTTP 403")

    monkeypatch.setattr(cli, "send_report", boom)
    code = cli.run(args(tmp_path), env={"RESEND_API_KEY": "k"}, today=date(2026, 10, 5))
    assert code == 1 and not (tmp_path / "data").exists()


def test_citations_disabled_in_config_skips_without_calling_gemini(tmp_path, monkeypatch):
    def boom(*a, **k):
        raise AssertionError("no debe llamar a Gemini")

    monkeypatch.setattr(cli, "run_citations", boom)
    cfg = tmp_path / "p.yaml"
    cfg.write_text(
        "site: {domain: x.com, gsc_property: 'sc-domain:x.com'}\n"
        "settings: {citations_enabled: false}\n"
        "projects: [{id: a, name: A, prefixes: ['/']}]\n"
    )
    code = cli.run(args(tmp_path, config=str(cfg), dry_run=True, no_citations=False), env={"GEMINI_API_KEY": "k"}, today=date(2026, 10, 5))
    assert code == 0
    assert "desactivado" in (tmp_path / "out" / "report.txt").read_text()


def test_missing_resend_key_fails(tmp_path):
    assert cli.run(args(tmp_path), env={}, today=date(2026, 10, 5)) == 1


def test_success_sends_and_saves_snapshot(tmp_path, monkeypatch):
    sent = {}
    monkeypatch.setattr(cli, "send_report", lambda key, **kw: sent.update(kw, key=key) or "id1")
    env = {"RESEND_API_KEY": "k", "SEO_REPORT_TO": "yo@example.com"}
    assert cli.run(args(tmp_path), env=env, today=date(2026, 10, 5)) == 0
    assert sent["to"] == "yo@example.com" and sent["sender"].endswith("<seo@kuxarstudio.com>")
    snap = json.loads((tmp_path / "data" / "snapshots" / "2026-10-05.json").read_text())
    assert snap["date"] == "2026-10-05"
    assert load_previous(tmp_path / "data", date(2026, 10, 12))["date"] == "2026-10-05"


def test_invalid_config_returns_2(tmp_path):
    bad = tmp_path / "bad.yaml"
    bad.write_text("site: {}\n")
    assert cli.run(args(tmp_path, config=str(bad)), env={}, today=date(2026, 10, 5)) == 2


def test_snapshot_store_ignores_same_day_and_future(tmp_path):
    save_snapshot(tmp_path, date(2026, 10, 12), {"date": "x"})
    assert load_previous(tmp_path, date(2026, 10, 12)) is None
    assert load_previous(tmp_path, date(2026, 10, 13)) == {"date": "x"}


class R:
    def __init__(self, status, body=None):
        self.status_code, self._b = status, body or {}

    def json(self):
        return self._b


class S:
    def __init__(self, r):
        self.r, self.calls = r, []

    def post(self, url, headers=None, json=None, timeout=None):
        self.calls.append((url, headers, json))
        return self.r


def test_mail_sends_user_agent_and_never_leaks_key_in_error():
    ok = S(R(200, {"id": "abc"}))
    assert send_report("SECRET", sender="a <a@x.com>", to="b@x.com", subject="s", html="h", text="t", session=ok) == "abc"
    assert ok.calls[0][1]["User-Agent"].startswith("kuxar-seo-agent")
    bad = S(R(403, {"message": "domain not verified"}))
    with pytest.raises(MailError) as err:
        send_report("SECRET", sender="a", to="b", subject="s", html="h", text="t", session=bad)
    assert "SECRET" not in str(err.value) and "verificado" in str(err.value)
