import pytest
from unittest.mock import patch, Mock
from src.competitor_detector import detect_competitors


def test_detect_competitors_low_competition_with_minimal_signals():
    records = [{"pain_summary": "simple note", "post_title": "simple note"}]
    with patch("src.competitor_detector.requests.get") as mock_get:
        mock_resp = Mock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {"total_count": 0}
        mock_get.return_value = mock_resp
        out = detect_competitors(records)
    rec = out[0]
    assert rec["competition_level"] in {"Low", "Medium", "High"}
    assert rec["ph_score"] >= 1
    assert rec["github_score"] == 1  # since total_count <= 10
    assert rec["reddit_score"] == 1


def test_detect_competitors_high_competition_when_github_count_large():
    records = [{"pain_summary": "saas platform optimization integration", "post_title": "saas platform"}]
    with patch("src.competitor_detector.requests.get") as mock_get:
        mock_resp = Mock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {"total_count": 1000}
        mock_get.return_value = mock_resp
        out = detect_competitors(records)
    rec = out[0]
    # GitHub score should be high (3), Reddit 2 due to keywords, PH 2 due to common keywords
    assert rec["github_score"] == 3
    assert rec["reddit_score"] == 2
    assert rec["ph_score"] == 2
    assert rec["competition_level"] in {"Medium", "High"}


def test_detect_competitors_handles_network_errors():
    records = [{"pain_summary": "tool app", "post_title": "tool"}]
    with patch("src.competitor_detector.requests.get", side_effect=Exception("timeout")):
        out = detect_competitors(records)
    rec = out[0]
    # On exception, github_score should default to 1
    assert rec["github_score"] == 1
    # ProductHunt heuristic still applies
    assert rec["ph_score"] == 2
