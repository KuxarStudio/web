from datetime import date

import pytest

from seo_agent.gsc import GscError, SearchConsole


class FakeResponse:
    def __init__(self, status=200, payload=None):
        self.status_code = status
        self._payload = payload or {}

    def json(self):
        return self._payload


class FakeSession:
    def __init__(self, responses):
        self.responses = list(responses)
        self.calls = []

    def post(self, url, json=None, timeout=None):
        self.calls.append((url, json))
        return self.responses.pop(0)

    def get(self, url, timeout=None):
        self.calls.append((url, None))
        return self.responses.pop(0)


def test_query_parses_rows_and_encodes_property():
    session = FakeSession(
        [FakeResponse(payload={"rows": [{"keys": ["https://kuxarstudio.com/kaku/", "kaku app"], "clicks": 2, "impressions": 40, "ctr": 0.05, "position": 11.2}]})]
    )
    gsc = SearchConsole(session, "sc-domain:kuxarstudio.com")
    rows = gsc.query(date(2026, 9, 1), date(2026, 9, 28), ["page", "query"])
    assert rows[0].page.endswith("/kaku/") and rows[0].query == "kaku app" and rows[0].position == 11.2
    url, body = session.calls[0]
    assert "sc-domain%3Akuxarstudio.com" in url
    assert body["dimensions"] == ["page", "query"] and body["startDate"] == "2026-09-01"


def test_query_without_query_dimension():
    session = FakeSession([FakeResponse(payload={"rows": [{"keys": ["https://kuxarstudio.com/"], "clicks": 1, "impressions": 10, "ctr": 0.1, "position": 3}]})])
    rows = SearchConsole(session, "p").query(date(2026, 9, 1), date(2026, 9, 2), ["page"])
    assert rows[0].query is None


def test_empty_response_is_empty_list():
    assert SearchConsole(FakeSession([FakeResponse(payload={})]), "p").query(date(2026, 9, 1), date(2026, 9, 2), ["page"]) == []


def test_403_gives_actionable_hint():
    session = FakeSession([FakeResponse(403, {"error": {"message": "User does not have sufficient permission"}})])
    with pytest.raises(GscError, match="cuenta de servicio añadida como usuario"):
        SearchConsole(session, "p").query(date(2026, 9, 1), date(2026, 9, 2), ["page"])


def test_pagination(monkeypatch):
    import seo_agent.gsc as gsc_module

    monkeypatch.setattr(gsc_module, "ROW_LIMIT", 2)
    row = lambda n: {"keys": [f"https://kuxarstudio.com/{n}/"], "clicks": 1, "impressions": 1, "ctr": 1, "position": 1}
    session = FakeSession([FakeResponse(payload={"rows": [row(1), row(2)]}), FakeResponse(payload={"rows": [row(3)]})])
    rows = SearchConsole(session, "p").query(date(2026, 9, 1), date(2026, 9, 2), ["page"])
    assert len(rows) == 3
    assert session.calls[1][1]["startRow"] == 2


def test_retries_on_429(monkeypatch):
    monkeypatch.setattr("seo_agent.http.time.sleep", lambda s: None)
    session = FakeSession([FakeResponse(429), FakeResponse(payload={"rows": []})])
    assert SearchConsole(session, "p").query(date(2026, 9, 1), date(2026, 9, 2), ["page"]) == []
    assert len(session.calls) == 2


def test_invalid_service_account_json():
    with pytest.raises(GscError, match="JSON de cuenta de servicio"):
        SearchConsole.from_service_account_json("no es json", "p")
