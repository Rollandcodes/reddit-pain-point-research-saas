"""Push records to Google Sheets using a service account JSON available via env.

This module accepts the `GOOGLE_SERVICE_ACCOUNT_JSON` env var which may contain
either the raw JSON content or a base64-encoded JSON. It writes the JSON to a
temporary file and uses `gspread` + `google.oauth2.service_account` to authorize
and push a pandas DataFrame as a sheet.
"""
import os
import json
import base64
import tempfile
from typing import List, Dict, Optional
import pandas as pd

try:
    import gspread
    from google.oauth2.service_account import Credentials
except Exception:
    gspread = None
    Credentials = None

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
]


def _decode_sa_json(env_value: str) -> str:
    env_value = env_value.strip()
    # Heuristic: if it starts with '{' assume raw JSON, otherwise base64
    if env_value.startswith("{"):
        return env_value
    try:
        raw = base64.b64decode(env_value).decode("utf-8")
        return raw
    except Exception:
        # Last resort: assume raw
        return env_value


def push_to_sheets(
    records: List[Dict],
    spreadsheet_name: str = "Reddit Pain Points",
    worksheet_name: str = "Sheet1",
    gspread_client=None,
    credentials_factory=None,
) -> Optional[str]:
    """Push records to Google Sheets.

    Accepts optional injected `gspread_client` and `credentials_factory` for testability.
    When omitted, uses real libraries and environment configuration.
    """
    if gspread_client is None or credentials_factory is None:
        # Validate libs present
        if gspread is None or Credentials is None:
            raise RuntimeError("gspread/google-auth libraries are not installed")

        sa_env = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON")
        if not sa_env:
            raise EnvironmentError("GOOGLE_SERVICE_ACCOUNT_JSON not set in environment")

        sa_json = _decode_sa_json(sa_env)

        # write to temp file
        with tempfile.NamedTemporaryFile(mode="w", delete=False, suffix=".json") as f:
            f.write(sa_json)
            sa_path = f.name

        creds = Credentials.from_service_account_file(sa_path, scopes=SCOPES)
        gspread_client = gspread.authorize(creds)
    else:
        # Use injected credentials/client without touching env or filesystem
        pass

    df = pd.DataFrame(records)

    # Try to open existing spreadsheet or create a new one
    sh = None
    try:
        sh = gspread_client.open(spreadsheet_name)
    except Exception:
        sh = gspread_client.create(spreadsheet_name)

    # Try to open or add worksheet
    try:
        try:
            ws = sh.worksheet(worksheet_name)
        except Exception:
            ws = sh.add_worksheet(title=worksheet_name, rows=str(max(100, len(df) + 10)), cols=str(max(10, len(df.columns))))

        # Clear and set values
        ws.clear()
        # Convert df to list of lists with header
        values = [list(df.columns)] + df.fillna("").astype(str).values.tolist()
        ws.update(values)
    except Exception as e:
        raise RuntimeError(f"Failed to write to Google Sheets: {e}")

    # Return spreadsheet URL if available
    try:
        return sh.url
    except Exception:
        return None
