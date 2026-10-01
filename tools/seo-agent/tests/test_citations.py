from pathlib import Path

from seo_agent.citations import normalize_domain, parse_response, run_citations, source_domain
from seo_agent.config import load_config

CFG = load_config(Path(__file__).resolve().parents[1] / "projects.yaml")
KAKU = next(p for p in CFG.projects if p.id == "kaku")


def payload(domains, text="Kaku! es una app", queries=("mejor app hiragana",)):
    return {
        "candidates": [
            {
                "content": {"parts": [{"text": text}]},
                "groundingMetadata": {
                    "webSearchQueries": list(queries),
                    "groundingChunks": [
                        {"web": {"uri": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/abc", "title": d}} for d in domains
                    ],
                },
            }
        ]
    }


class FakeResponse:
    def __init__(self, status=200, body=None):
        self.status_code = status
        self._body = body or {}

    def json(self):
        return self._body


class FakeSession:
    def __init__(self, responses):
        self.responses = list(responses)
        self.calls = []

    def post(self, url, headers=None, json=None, timeout=None):
        self.calls.append((url, headers, json))
        return self.responses.pop(0) if self.responses else FakeResponse(200, payload([]))


def test_source_domain_uses_title_for_google_redirects():
    chunk = {"web": {"uri": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/x", "title": "www.Skritter.com"}}
    assert source_domain(chunk) == "skritter.com"
    assert source_domain({"web": {"uri": "https://www.tofugu.com/a", "title": "x"}}) == "tofugu.com"
    assert source_domain({"web": {"uri": "https://vertexaisearch.cloud.google.com/x", "title": "sin dominio"}}) is None


def test_parse_detects_own_and_competitors():
    c = parse_response(payload(["skritter.com", "kuxarstudio.com"]), KAKU, "es", "q", "kuxarstudio.com")
    assert c.own_cited and c.competitors_cited == ["skritter.com"] and c.brand_mentioned
    assert c.search_queries == ["mejor app hiragana"]


def test_parse_not_cited():
    c = parse_response(payload(["tofugu.com"], text="Prueba Skritter"), KAKU, "en", "q", "kuxarstudio.com")
    assert not c.own_cited and not c.brand_mentioned


def test_run_skipped_without_key():
    run = run_citations(CFG, None)
    assert run.status == "skipped"


def test_run_ok_respects_max_and_sends_google_search_tool():
    from dataclasses import replace

    cfg = replace(CFG, settings=replace(CFG.settings, citations_max_queries=2))
    session = FakeSession([])
    run = run_citations(cfg, "KEY", session=session, sleep=lambda s: None)
    assert len(run.items) == 2 and "Límite" in run.message
    url, headers, body = session.calls[0]
    assert headers["x-goog-api-key"] == "KEY" and body["tools"] == [{"google_search": {}}]


def test_run_unavailable_when_grounding_not_in_free_tier():
    err = FakeResponse(403, {"error": {"message": "Grounding with Google Search is not available on the free tier."}})
    run = run_citations(CFG, "KEY", session=FakeSession([err]), sleep=lambda s: None)
    assert run.status == "unavailable" and "facturación" in run.message


def test_run_unavailable_on_402_prepay_depleted():
    err = FakeResponse(402, {"error": {"message": "Your prepayment credits are depleted."}})
    session = FakeSession([err])
    run = run_citations(CFG, "KEY", session=session, sleep=lambda s: None)
    assert run.status == "unavailable" and "saldo" in run.message and len(session.calls) == 1


def test_run_stops_after_three_consecutive_errors():
    errs = [FakeResponse(500, {"error": {"message": "boom"}}) for _ in range(20)]
    run = run_citations(CFG, "KEY", session=FakeSession(errs), sleep=lambda s: None)
    assert run.status == "error" and sum(1 for i in run.items if i.status == "error") == 3


def test_normalize_domain():
    assert normalize_domain(" WWW.Example.com ") == "example.com"
