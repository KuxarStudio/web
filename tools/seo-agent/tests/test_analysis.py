from datetime import date
from pathlib import Path

from seo_agent.analysis import aggregate, build_stats, make_jobs
from seo_agent.config import load_config
from seo_agent.gsc import Row

CFG = load_config(Path(__file__).resolve().parents[1] / "projects.yaml")
U = "https://kuxarstudio.com"


def row(path, impressions, clicks=0, position=5.0, query=None):
    return Row(U + path, query, clicks, impressions, clicks / impressions if impressions else 0, position)


def test_aggregate_weights_position_by_impressions():
    m = aggregate([row("/a/", 100, 10, 2.0), row("/b/", 300, 3, 6.0)])
    assert m.impressions == 400 and m.clicks == 13
    assert round(m.position, 2) == 5.0


def test_aggregate_empty():
    assert aggregate([]).impressions == 0


def test_stats_split_by_project_and_language():
    cur = [row("/kaku/", 100, 5), row("/en/kaku/", 40, 1), row("/parte/", 10), row("/", 50)]
    prev = [row("/kaku/", 50)]
    stats, _ = build_stats(CFG, cur, prev, [])
    assert stats["kaku"].current.impressions == 140
    assert stats["kaku"].previous.impressions == 50
    assert stats["kaku"].by_lang["en"].impressions == 40
    assert stats["studio"].current.impressions == 50
    assert stats["kaku"].key_pages_without_impressions == []
    assert stats["parte"].key_pages_without_impressions == ["/en/parte/"]


def test_quick_wins_only_in_position_window_with_enough_impressions():
    queries = [
        row("/kaku/", 80, 1, 12.0, "app escribir hiragana"),
        row("/kaku/", 80, 9, 3.0, "kaku app"),       # ya arriba
        row("/kaku/", 2, 0, 12.0, "poco volumen"),   # pocas impresiones
        row("/kaku/", 60, 0, 35.0, "muy abajo"),
    ]
    _, wins = build_stats(CFG, [], [], queries)
    assert [w.query for w in wins] == ["app escribir hiragana"]
    assert wins[0].project_id == "kaku"


def test_jobs_flag_missing_language_and_missing_indexing():
    cur = [row("/kaku/", 100, 5)]  # sin EN, y sin nada de parte
    stats, wins = build_stats(CFG, cur, [], [])
    jobs = make_jobs(CFG, stats, wins, None, date(2026, 10, 12))
    kinds = {(j.project_id, j.kind) for j in jobs}
    assert ("kaku", "idioma") in kinds
    assert ("parte", "indexacion") in kinds


def test_jobs_respect_max_and_are_sorted():
    queries = [row("/kaku/", 100 - i, 0, 10.0, f"q{i}") for i in range(10)]
    stats, wins = build_stats(CFG, [], [], queries)
    jobs = make_jobs(CFG, stats, wins, None, date(2026, 10, 12))
    assert len(jobs) <= CFG.settings.max_jobs
    assert [j.priority for j in jobs] == sorted(j.priority for j in jobs)


def test_evidence_job_rotates_by_week_and_outreach_only_first_week_of_month():
    stats, wins = build_stats(CFG, [row("/", 10)], [], [])
    w1 = make_jobs(CFG, stats, wins, None, date(2026, 10, 12))
    w2 = make_jobs(CFG, stats, wins, None, date(2026, 10, 19))
    ev1 = next(j for j in w1 if j.kind == "evidencia")
    ev2 = next(j for j in w2 if j.kind == "evidencia")
    assert ev1.project_id != ev2.project_id
    assert not any(j.kind == "enlaces" for j in w1)
    assert any(j.kind == "enlaces" for j in make_jobs(CFG, stats, wins, None, date(2026, 10, 5)))
