"""Generic Browse.ai runner helper.

This module provides a small wrapper that triggers a Browse.ai run by POSTing
to a user-provided run endpoint (stored in `BROWSEAI_RUN_URL`) using the
`BROWSEAI_API_KEY` for auth. Because Browse.ai APIs/exports may vary by setup,
the runner is intentionally generic: it POSTs the payload and returns the JSON
response. If the response contains a `status` field and a `status_url`, the
runner will poll until completion.

Environment Variables Required:
    BROWSEAI_RUN_URL: The full run endpoint URL provided by Browse.ai.
        Example: 'https://api.browse.ai/v2/robots/{robotId}/runs'
    BROWSEAI_API_KEY: Your Browse.ai API key/token for authentication.
        Example: 'sk_live_xxxxx'

See README for instructions on creating a run endpoint in Browse.ai.

Example Usage:
    >>> from src.browseai_runner import run_from_env, validate_environment
    >>> # First, validate that environment is properly configured
    >>> validate_environment()
    True
    >>> # Then run the job
    >>> result = run_from_env(payload={"url": "https://example.com"})
"""
import os
import time
from typing import Any, Dict, Optional
import requests


def validate_environment() -> bool:
    """Validate that required environment variables are set and non-empty.

    Raises:
        EnvironmentError: If BROWSEAI_RUN_URL or BROWSEAI_API_KEY is missing or empty.
            The error message will indicate which variable is missing.

    Returns:
        True if all required environment variables are properly set.
    """
    run_url = os.environ.get("BROWSEAI_RUN_URL", "").strip()
    api_key = os.environ.get("BROWSEAI_API_KEY", "").strip()

    missing = []
    if not run_url:
        missing.append("BROWSEAI_RUN_URL")
    if not api_key:
        missing.append("BROWSEAI_API_KEY")

    if missing:
        raise EnvironmentError(
            f"Missing or empty required environment variable(s): {', '.join(missing)}. "
            f"Please set these in your environment or .env file. "
            f"See README for configuration instructions."
        )
    return True


def run_browseai_job(run_url: str, api_key: str, payload: Optional[Dict] = None, timeout: int = 300) -> Dict[str, Any]:
    """Execute a Browse.ai job by POSTing to the run endpoint.

    Args:
        run_url: The Browse.ai run endpoint URL.
        api_key: The Browse.ai API key for authentication.
        payload: Optional JSON payload to send with the request.
        timeout: Maximum seconds to wait for async job completion (default: 300).

    Returns:
        The JSON response from Browse.ai, either immediately or after polling.

    Raises:
        requests.HTTPError: If the HTTP request fails.
        RuntimeError: If the Browse.ai run fails.
        TimeoutError: If the run does not complete within the timeout period.
    """
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = payload or {}
    resp = requests.post(run_url, json=payload, headers=headers, timeout=30)
    resp.raise_for_status()
    data = resp.json()

    # If response indicates async run, try to poll
    start = time.time()
    # Common fields: 'status', 'status_url', 'run_id', 'result' - be flexible
    status = data.get("status")
    status_url = data.get("status_url") or data.get("statusUrl")
    # If no polling required, return immediately
    if not status or not status_url:
        return data

    while time.time() - start < timeout:
        try:
            sresp = requests.get(status_url, headers=headers, timeout=30)
            sresp.raise_for_status()
            sdata = sresp.json()
        except Exception:
            time.sleep(2)
            continue

        st = sdata.get("status") or sdata.get("state")
        if st and st.lower() in ("completed", "finished", "done"):
            return sdata
        if st and st.lower() in ("failed", "error"):
            raise RuntimeError(f"Browse.ai run failed: {sdata}")

        time.sleep(2)

    raise TimeoutError("Timed out waiting for Browse.ai run to complete")


def run_from_env(payload: Optional[Dict] = None, timeout: int = 300) -> Dict[str, Any]:
    """Run a Browse.ai job using environment variables for configuration.

    This is a convenience wrapper around run_browseai_job that reads
    credentials from environment variables.

    Args:
        payload: Optional JSON payload to send with the request.
        timeout: Maximum seconds to wait for async job completion (default: 300).

    Returns:
        The JSON response from Browse.ai.

    Raises:
        EnvironmentError: If required environment variables are missing or empty.
        requests.HTTPError: If the HTTP request fails.
        RuntimeError: If the Browse.ai run fails.
        TimeoutError: If the run does not complete within the timeout period.
    """
    validate_environment()
    run_url = os.environ.get("BROWSEAI_RUN_URL")
    api_key = os.environ.get("BROWSEAI_API_KEY")
    return run_browseai_job(run_url=run_url, api_key=api_key, payload=payload, timeout=timeout)
