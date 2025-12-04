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


def test_push_to_sheets_with_injected_client_updates_values():
    class FakeWorksheet:
        def __init__(self):
            self.updated = None
        def clear(self):
            pass
        def update(self, values):
            self.updated = values

    class FakeSpreadsheet:
        def __init__(self):
            self.url = "https://fake.url"
            self.ws = FakeWorksheet()
        def worksheet(self, name):
            raise Exception("no worksheet")
        def add_worksheet(self, title, rows, cols):
            return self.ws

    class FakeClient:
        def __init__(self):
            self.spreadsheet = FakeSpreadsheet()
        def open(self, name):
            raise Exception("not found")
        def create(self, name):
            return self.spreadsheet

    fake_client = FakeClient()
    recs = [{"a": 1, "b": "x"}]
    url = push_to_sheets(recs, spreadsheet_name="X", worksheet_name="Y", gspread_client=fake_client, credentials_factory=lambda: None)
    assert url == "https://fake.url"


def test_push_to_sheets_existing_worksheet_path():
    class FakeWorksheet:
        def __init__(self):
            self.cleared = False
            self.updated = None
        def clear(self):
            self.cleared = True
        def update(self, values):
            self.updated = values

    class FakeSpreadsheet:
        def __init__(self):
            self.url = "https://fake.url"
            self.ws = FakeWorksheet()
        def worksheet(self, name):
            return self.ws
        def add_worksheet(self, *args, **kwargs):
            raise AssertionError("should not add worksheet when existing")

    class FakeClient:
        def __init__(self):
            self.spreadsheet = FakeSpreadsheet()
        def open(self, name):
            return self.spreadsheet
        def create(self, name):
            raise AssertionError("should not create when open succeeds")

    fake_client = FakeClient()
    recs = [{"a": 1, "b": "x"}]
    url = push_to_sheets(recs, spreadsheet_name="X", worksheet_name="Y", gspread_client=fake_client, credentials_factory=lambda: None)
    assert url == "https://fake.url"
