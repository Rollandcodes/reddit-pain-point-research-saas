from unittest.mock import patch, Mock
from src.scrape_reddit import get_submissions


def test_get_submissions_normalizes_fields():
    fake_item = {
        "created_utc": 1700000000,
        "subreddit": "SaaS",
        "title": "Test title",
        "permalink": "/r/SaaS/comments/abc/test/",
        "full_link": "https://reddit.com/r/SaaS/comments/abc/test/",
        "selftext": "Body",
        "id": "abc",
    }
    with patch("src.scrape_reddit.requests.get") as mock_get:
        resp = Mock()
        resp.raise_for_status.return_value = None
        resp.json.return_value = {"data": [fake_item]}
        mock_get.return_value = resp

        out = get_submissions(["SaaS"], keywords=None, limit_per_sub=1)
        assert len(out) == 1
        rec = out[0]
        assert rec["subreddit"] == "SaaS"
        assert rec["title"] == "Test title"
        assert rec["full_link"].startswith("https://reddit.com")
        assert rec["date"].endswith("Z")


def test_get_submissions_keyword_filtering():
    items = [
        {"created_utc": 1700000000, "subreddit": "SaaS", "title": "Alpha", "selftext": "x", "permalink": "/p/1", "id": "1"},
        {"created_utc": 1700000001, "subreddit": "SaaS", "title": "Beta", "selftext": "contains keyword", "permalink": "/p/2", "id": "2"},
    ]
    with patch("src.scrape_reddit.requests.get") as mock_get:
        resp = Mock()
        resp.raise_for_status.return_value = None
        resp.json.return_value = {"data": items}
        mock_get.return_value = resp

        out = get_submissions(["SaaS"], keywords=["keyword"], limit_per_sub=2)
        assert len(out) == 1
        assert out[0]["title"] == "Beta"


def test_get_submissions_handles_fetch_exception():
    # Simulate requests.get raising to cover exception path
    with patch("src.scrape_reddit.requests.get", side_effect=Exception("network")):
        out = get_submissions(["SaaS"], keywords=None, limit_per_sub=1)
        assert isinstance(out, list)
        assert len(out) == 0
