import os
import tempfile
from src.pdf_reporter import generate_report, _generate_html_content


def test_generate_report_creates_html_file():
    records = [{
        "pain_summary": "Example",
        "category": "feature",
        "pain_score": 80,
        "revenue_potential_score": 70,
        "competition_level": "Medium",
        "suggested_product_idea": "Idea",
        "estimated_market_size": 1000,
        "estimated_target_audience": 300,
        "recommended_pricing": "$99/mo",
        "estimated_arr_potential": "$10,000",
        "suggested_features": "a, b",
        "suggested_mvp": "mvp",
        "suggested_marketing_angle": "angle",
    }]

    with tempfile.TemporaryDirectory() as td:
        path = generate_report(records, output_dir=td)
        assert os.path.exists(path)
        with open(path, "r", encoding="utf-8") as f:
            html = f.read()
            assert "Validation Report" in html


def test_generate_html_content_non_empty():
    html = _generate_html_content([])
    assert isinstance(html, str)
    assert "<!DOCTYPE html>" in html
