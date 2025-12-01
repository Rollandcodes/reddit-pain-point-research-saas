"""Generic Browse.ai runner helper.

This module provides a small wrapper that triggers a Browse.ai run by POSTing
to a user-provided run endpoint (stored in `BROWSEAI_RUN_URL`) using the
`BROWSEAI_API_KEY` for auth. Because Browse.ai APIs/exports may vary by setup,
the runner is intentionally generic: it POSTs the payload and returns the JSON
response. If the response contains a `status` field and a `status_url`, the
runner will poll until completion.

You must provide two repository secrets (or env vars):
- `BROWSEAI_RUN_URL` (the full run endpoint URL provided by Browse.ai)
- `BROWSEAI_API_KEY` (your Browse.ai API key/token)

See README for instructions on creating a run endpoint in Browse.ai.
"""
import os
import time
from typing import Any, Dict, Optional
import requests


def run_browseai_job(run_url: str, api_key: str, payload: Optional[Dict] = None, timeout: int = 300) -> Dict[str, Any]:
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
    run_url = os.environ.get("BROWSEAI_RUN_URL")
    api_key = os.environ.get("BROWSEAI_API_KEY")
    if not run_url or not api_key:
        raise EnvironmentError("BROWSEAI_RUN_URL and BROWSEAI_API_KEY must be set in environment")
    return run_browseai_job(run_url=run_url, api_key=api_key, payload=payload, timeout=timeout)
