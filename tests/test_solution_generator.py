import pytest
from src.solution_generator import generate_solutions, SOLUTION_TEMPLATES


def test_generate_solutions_maps_known_categories():
    records = [
        {"category": cat, "pain_summary": f"{cat} related"}
        for cat in ["pricing", "bugs", "feature", "performance"]
    ]
    out = generate_solutions(records)
    assert len(out) == len(records)
    for rec in out:
        template = SOLUTION_TEMPLATES.get(rec["category"], SOLUTION_TEMPLATES["Other"])
        assert rec["suggested_product_idea"] == template["idea"]
        assert rec["suggested_features"] == ", ".join(template["features"])
        assert rec["suggested_mvp"] == template["mvp"]
        assert rec["suggested_pricing_model"] == template["pricing_model"]
        assert rec["suggested_target_users"] == template["target_users"]
        assert rec["suggested_marketing_angle"] == template["marketing"]


def test_generate_solutions_defaults_to_other():
    records = [{"category": "unknown", "pain_summary": "something"}]
    out = generate_solutions(records)
    template = SOLUTION_TEMPLATES["Other"]
    rec = out[0]
    assert rec["suggested_product_idea"] == template["idea"]
    assert rec["suggested_features"] == ", ".join(template["features"])