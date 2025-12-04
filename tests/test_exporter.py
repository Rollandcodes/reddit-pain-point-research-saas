import os
import tempfile
from src.exporter import write_csv, write_excel


def test_write_csv_creates_file():
    records = [{"a": 1, "b": "x"}, {"a": 2, "b": "y"}]
    with tempfile.TemporaryDirectory() as td:
        out_path = os.path.join(td, "out.csv")
        path = write_csv(records, path=out_path)
        assert os.path.exists(path)
        assert path.endswith(".csv")


def test_write_excel_creates_file():
    records = [{"a": 1, "b": "x"}, {"a": 2, "b": "y"}]
    with tempfile.TemporaryDirectory() as td:
        out_path = os.path.join(td, "out.xlsx")
        path = write_excel(records, path=out_path)
        assert os.path.exists(path)
        assert path.endswith(".xlsx")
