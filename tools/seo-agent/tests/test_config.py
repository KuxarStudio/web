from pathlib import Path

import pytest

from seo_agent.config import ConfigError, load_config, parse_config

ROOT = Path(__file__).resolve().parents[1]


def test_real_projects_yaml_is_valid():
    cfg = load_config(ROOT / "projects.yaml")
    assert cfg.gsc_property == "sc-domain:kuxarstudio.com"
    assert {p.id for p in cfg.projects} >= {"studio", "kaku", "parte", "pdf-blender"}


def test_longest_prefix_wins():
    cfg = load_config(ROOT / "projects.yaml")
    assert cfg.project_for_path("/kaku/").id == "kaku"
    assert cfg.project_for_path("/en/kaku/").id == "kaku"
    assert cfg.project_for_path("/en/parte/").id == "parte"
    assert cfg.project_for_path("/devlog/nadir-log-001-nace-el-protocolo/").id == "nadir"
    assert cfg.project_for_path("/devlog/").id == "studio"
    assert cfg.project_for_path("/en/").id == "studio"
    assert cfg.project_for_path("/portfolio/").id == "studio"


def _base():
    return {
        "site": {"domain": "x.com", "gsc_property": "sc-domain:x.com"},
        "projects": [{"id": "a", "name": "A", "prefixes": ["/"]}],
    }


def test_duplicate_ids_rejected():
    raw = _base()
    raw["projects"].append({"id": "a", "name": "B", "prefixes": ["/b/"]})
    with pytest.raises(ConfigError, match="duplicado"):
        parse_config(raw)


def test_prefix_must_start_with_slash():
    raw = _base()
    raw["projects"][0]["prefixes"] = ["kaku/"]
    with pytest.raises(ConfigError, match="debe empezar por '/'"):
        parse_config(raw)


def test_unknown_setting_rejected():
    raw = _base()
    raw["settings"] = {"window_dayz": 7}
    with pytest.raises(ConfigError, match="desconocidas"):
        parse_config(raw)


def test_question_language_must_be_declared():
    raw = _base()
    raw["projects"][0]["questions"] = {"fr": ["bonjour"]}
    with pytest.raises(ConfigError, match="idiomas no declarados"):
        parse_config(raw)


def test_paused_project_is_ignored():
    raw = _base()
    raw["projects"].append({"id": "b", "name": "B", "prefixes": ["/b/"], "paused": True})
    cfg = parse_config(raw)
    assert [p.id for p in cfg.projects] == ["a"]
    assert cfg.project_for_path("/b/x/").id == "a"


def test_blindnote_is_paused_in_real_config():
    cfg = load_config(ROOT / "projects.yaml")
    assert "blindnote" not in {p.id for p in cfg.projects}
