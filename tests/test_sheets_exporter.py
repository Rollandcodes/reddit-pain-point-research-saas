import base64
import os
import pytest
from unittest.mock import patch

from src.sheets_exporter import _decode_sa_json, push_to_sheets


def test_decode_sa_json_accepts_raw_json():
    raw = '{"key":"value"}'
    out = _decode_sa_json(raw)
    assert out == raw


def test_decode_sa_json_accepts_base64():
    raw = '{"key":"value"}'
    b64 = base64.b64encode(raw.encode("utf-8")).decode("utf-8")
    out = _decode_sa_json(b64)
    assert out == raw


def test_push_to_sheets_raises_when_libs_missing():
    # Force gspread/Credentials to None by reloading module with failure
    with patch("src.sheets_exporter.gspread", None), patch("src.sheets_exporter.Credentials", None):
        with pytest.raises(RuntimeError):
            push_to_sheets([], spreadsheet_name="X", worksheet_name="Y")


def test_push_to_sheets_raises_when_env_missing():
    # Simulate libs present but missing env
    with patch("src.sheets_exporter.gspread", object()), patch("src.sheets_exporter.Credentials", object()), \
         patch.dict(os.environ, {}, clear=True):
        with pytest.raises(EnvironmentError):
            push_to_sheets([], spreadsheet_name="X", worksheet_name="Y")
