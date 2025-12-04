import pytest
from src.revenue_estimator import estimate_revenue_potential


def test_estimate_revenue_potential_basic_fields_present():
    records = [{
        "pain_score": 80,
        "competition_level": "Medium",
        "severity_rating": 4,
        "subreddit": "startups",
    }]
    out = estimate_revenue_potential(records)
    rec = out[0]
    assert "revenue_potential_score" in rec
    assert isinstance(rec["revenue_potential_score"], int)
    assert "estimated_market_size" in rec
    assert "estimated_target_audience" in rec
    assert "recommended_pricing" in rec
    assert "estimated_arr_potential" in rec


def test_estimate_revenue_potential_pricing_tier_by_score():
    # High score -> $199, mid -> $99, low -> $49
    high = [{"pain_score": 95, "competition_level": "Low", "severity_rating": 4, "subreddit": "startups"}]
    mid = [{"pain_score": 60, "competition_level": "Medium", "severity_rating": 3, "subreddit": "SaaS"}]
    low = [{"pain_score": 30, "competition_level": "High", "severity_rating": 2, "subreddit": "ProductManagement"}]

    high_out = estimate_revenue_potential(high)[0]
    mid_out = estimate_revenue_potential(mid)[0]
    low_out = estimate_revenue_potential(low)[0]

    assert high_out["recommended_pricing"] in {"$199/mo", "$99/mo"}
    assert mid_out["recommended_pricing"] in {"$99/mo", "$49/mo"}
    assert low_out["recommended_pricing"] == "$49/mo"


def test_estimate_revenue_potential_target_audience_scales_with_severity():
    # Severity affects target percentage: 4+ -> 50%, 3 -> 30%, else 10%
    base = {
        "pain_score": 50,
        "competition_level": "Medium",
        "severity_rating": 4,
        "subreddit": "SaaS",
    }

    rec4 = estimate_revenue_potential([base.copy()])[0]
    base["severity_rating"] = 3
    rec3 = estimate_revenue_potential([base.copy()])[0]
    base["severity_rating"] = 2
    rec2 = estimate_revenue_potential([base.copy()])[0]

    # audience sizes per subreddit map: SaaS=500000
    assert rec4["estimated_target_audience"] == int(500000 * 0.5)
    assert rec3["estimated_target_audience"] == int(500000 * 0.3)
    assert rec2["estimated_target_audience"] == int(500000 * 0.1)
