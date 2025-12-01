"""Export canonical schema records to CSV and Excel files."""
from typing import List, Dict
import os
import pandas as pd

DEFAULT_OUTPUT_DIR = "output"

def _ensure_output_dir(path: str):
    os.makedirs(path, exist_ok=True)

def write_csv(records: List[Dict], path: str = None):
    _ensure_output_dir(DEFAULT_OUTPUT_DIR)
    out = path or os.path.join(DEFAULT_OUTPUT_DIR, "sample_output.csv")
    df = pd.DataFrame(records)
    df.to_csv(out, index=False)
    return out

def write_excel(records: List[Dict], path: str = None):
    _ensure_output_dir(DEFAULT_OUTPUT_DIR)
    out = path or os.path.join(DEFAULT_OUTPUT_DIR, "sample_output.xlsx")
    df = pd.DataFrame(records)
    df.to_excel(out, index=False)
    return out


def push_to_google_sheets(records: List[Dict], spreadsheet_name: str = "Reddit Pain Points", worksheet_name: str = "Sheet1") -> str:
    """Push records to Google Sheets if `GOOGLE_SERVICE_ACCOUNT_JSON` is set.

    Returns the spreadsheet URL when successful.
    """
    try:
        from src.sheets_exporter import push_to_sheets
    except Exception as e:
        raise RuntimeError("Google Sheets support not available (missing dependencies)") from e

    url = push_to_sheets(records, spreadsheet_name=spreadsheet_name, worksheet_name=worksheet_name)
    return url
