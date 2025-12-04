import pytest
from unittest.mock import patch, Mock
from src.browseai_runner import run_browseai_job


def test_run_browseai_job_poll_exception_then_success():
    with patch("src.browseai_runner.requests.post") as mock_post, \
         patch("src.browseai_runner.requests.get") as mock_get:
        post_resp = Mock()
        post_resp.raise_for_status.return_value = None
        post_resp.json.return_value = {"status": "running", "status_url": "https://status"}
        mock_post.return_value = post_resp

        # First GET raises, second returns completed
        def side_effect(*args, **kwargs):
            if not hasattr(side_effect, "called"):
                side_effect.called = True
                raise Exception("temporary")
            resp = Mock()
            resp.raise_for_status.return_value = None
            resp.json.return_value = {"status": "completed", "result": {"done": True}}
            return resp

        mock_get.side_effect = side_effect

        out = run_browseai_job("https://run", "sk", timeout=5)
        assert out.get("result", {}).get("done") is True
