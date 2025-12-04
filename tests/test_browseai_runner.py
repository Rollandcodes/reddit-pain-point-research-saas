import os
import pytest
from unittest.mock import patch, Mock

from src.browseai_runner import validate_environment, run_browseai_job, run_from_env


def test_validate_environment_missing_vars_raises():
    with patch.dict(os.environ, {"BROWSEAI_RUN_URL": "", "BROWSEAI_API_KEY": ""}, clear=True):
        with pytest.raises(EnvironmentError):
            validate_environment()


def test_validate_environment_ok():
    with patch.dict(os.environ, {"BROWSEAI_RUN_URL": "https://x", "BROWSEAI_API_KEY": "sk"}, clear=True):
        assert validate_environment() is True


def test_run_browseai_job_immediate_return():
    with patch("src.browseai_runner.requests.post") as mock_post:
        resp = Mock()
        resp.raise_for_status.return_value = None
        resp.json.return_value = {"result": {"ok": True}}
        mock_post.return_value = resp

        out = run_browseai_job("https://run", "sk", payload={"p": 1})
        assert out == {"result": {"ok": True}}


def test_run_browseai_job_polls_to_completion():
    # First POST returns async run info; subsequent GET completes
    with patch("src.browseai_runner.requests.post") as mock_post, \
         patch("src.browseai_runner.requests.get") as mock_get:
        post_resp = Mock()
        post_resp.raise_for_status.return_value = None
        post_resp.json.return_value = {"status": "running", "status_url": "https://status"}
        mock_post.return_value = post_resp

        get_resp = Mock()
        get_resp.raise_for_status.return_value = None
        # First poll returns running, second poll returns completed
        get_resp.json.side_effect = [
            {"status": "running"},
            {"status": "completed", "result": {"done": True}},
        ]
        mock_get.return_value = get_resp

        out = run_browseai_job("https://run", "sk", payload={"p": 1}, timeout=5)
        assert out.get("result", {}).get("done") is True


def test_run_browseai_job_failure_raises_runtimeerror():
    with patch("src.browseai_runner.requests.post") as mock_post, \
         patch("src.browseai_runner.requests.get") as mock_get:
        post_resp = Mock()
        post_resp.raise_for_status.return_value = None
        post_resp.json.return_value = {"status": "running", "status_url": "https://status"}
        mock_post.return_value = post_resp

        get_resp = Mock()
        get_resp.raise_for_status.return_value = None
        get_resp.json.return_value = {"status": "failed", "error": "x"}
        mock_get.return_value = get_resp

        with pytest.raises(RuntimeError):
            run_browseai_job("https://run", "sk", timeout=2)


def test_run_browseai_job_timeout_raises():
    with patch("src.browseai_runner.requests.post") as mock_post, \
         patch("src.browseai_runner.requests.get") as mock_get:
        post_resp = Mock()
        post_resp.raise_for_status.return_value = None
        post_resp.json.return_value = {"status": "running", "status_url": "https://status"}
        mock_post.return_value = post_resp

        get_resp = Mock()
        get_resp.raise_for_status.return_value = None
        get_resp.json.return_value = {"status": "running"}
        mock_get.return_value = get_resp

        with pytest.raises(TimeoutError):
            run_browseai_job("https://run", "sk", timeout=1)


def test_run_from_env_calls_run_browseai_job():
    with patch.dict(os.environ, {"BROWSEAI_RUN_URL": "https://run", "BROWSEAI_API_KEY": "sk"}, clear=True):
        with patch("src.browseai_runner.run_browseai_job") as mock_run:
            mock_run.return_value = {"ok": True}
            out = run_from_env(payload={"x": 1}, timeout=3)
            assert out == {"ok": True}
            mock_run.assert_called_once()
"""Smoke tests for browseai_runner module."""
import os
import pytest
from unittest.mock import patch, MagicMock
from src.browseai_runner import run_browseai_job, run_from_env, validate_environment


class TestValidateEnvironment:
    """Tests for validate_environment function."""

    def test_missing_run_url(self):
        """Test that missing BROWSEAI_RUN_URL raises error."""
        with patch.dict(os.environ, {"BROWSEAI_API_KEY": "test_key"}, clear=True):
            with pytest.raises(EnvironmentError) as exc_info:
                validate_environment()
            assert "BROWSEAI_RUN_URL" in str(exc_info.value)

    def test_missing_api_key(self):
        """Test that missing BROWSEAI_API_KEY raises error."""
        with patch.dict(os.environ, {"BROWSEAI_RUN_URL": "http://test.url"}, clear=True):
            with pytest.raises(EnvironmentError) as exc_info:
                validate_environment()
            assert "BROWSEAI_API_KEY" in str(exc_info.value)

    def test_empty_run_url(self):
        """Test that empty BROWSEAI_RUN_URL raises error."""
        with patch.dict(os.environ, {"BROWSEAI_RUN_URL": "", "BROWSEAI_API_KEY": "test_key"}, clear=True):
            with pytest.raises(EnvironmentError) as exc_info:
                validate_environment()
            assert "BROWSEAI_RUN_URL" in str(exc_info.value)

    def test_empty_api_key(self):
        """Test that empty BROWSEAI_API_KEY raises error."""
        with patch.dict(os.environ, {"BROWSEAI_RUN_URL": "http://test.url", "BROWSEAI_API_KEY": ""}, clear=True):
            with pytest.raises(EnvironmentError) as exc_info:
                validate_environment()
            assert "BROWSEAI_API_KEY" in str(exc_info.value)

    def test_valid_environment(self):
        """Test that valid environment passes validation."""
        with patch.dict(os.environ, {"BROWSEAI_RUN_URL": "http://test.url", "BROWSEAI_API_KEY": "test_key"}, clear=True):
            # Should not raise
            result = validate_environment()
            assert result is True


class TestRunBrowseaiJob:
    """Tests for run_browseai_job function."""

    @patch("src.browseai_runner.requests.post")
    def test_successful_immediate_response(self, mock_post):
        """Test successful Browse.ai job with immediate response (no polling)."""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"data": [{"id": 1, "title": "Test"}]}
        mock_post.return_value = mock_response

        result = run_browseai_job("http://test.url", "test_key")
        assert result == {"data": [{"id": 1, "title": "Test"}]}

    @patch("src.browseai_runner.requests.post")
    def test_request_error_raised(self, mock_post):
        """Test that HTTP errors are raised."""
        mock_response = MagicMock()
        mock_response.raise_for_status.side_effect = Exception("HTTP Error")
        mock_post.return_value = mock_response

        with pytest.raises(Exception) as exc_info:
            run_browseai_job("http://test.url", "test_key")
        assert "HTTP Error" in str(exc_info.value)


class TestRunFromEnv:
    """Tests for run_from_env function."""

    def test_missing_env_vars(self):
        """Test that missing environment variables raise error."""
        with patch.dict(os.environ, {"BROWSEAI_RUN_URL": "", "BROWSEAI_API_KEY": ""}, clear=False):
            # Clear the specific keys we're testing
            env_backup = {
                "BROWSEAI_RUN_URL": os.environ.pop("BROWSEAI_RUN_URL", None),
                "BROWSEAI_API_KEY": os.environ.pop("BROWSEAI_API_KEY", None),
            }
            try:
                with pytest.raises(EnvironmentError):
                    run_from_env()
            finally:
                # Restore any existing values
                for key, val in env_backup.items():
                    if val is not None:
                        os.environ[key] = val

    @patch("src.browseai_runner.run_browseai_job")
    def test_calls_run_browseai_job(self, mock_run):
        """Test that run_from_env calls run_browseai_job with correct params."""
        mock_run.return_value = {"data": []}
        with patch.dict(os.environ, {"BROWSEAI_RUN_URL": "http://test.url", "BROWSEAI_API_KEY": "test_key"}):
            result = run_from_env(payload={"test": "data"}, timeout=100)
            mock_run.assert_called_once_with(
                run_url="http://test.url",
                api_key="test_key",
                payload={"test": "data"},
                timeout=100,
            )
