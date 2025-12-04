import pytest
from src.scoring import calculate_pain_score, _count_emotional_intensity, _detect_buying_signals


def test_count_emotional_intensity_levels():
    assert _count_emotional_intensity("This is urgent and blocking") == 5
    assert _count_emotional_intensity("Serious breaking issue, very frustrated") == 4
    assert _count_emotional_intensity("annoying problem and issue") == 3
    assert _count_emotional_intensity("would be nice, I wish") == 2
    assert _count_emotional_intensity("minor note with no signals") == 1


def test_detect_buying_signals_levels():
    # Pricing/subscription keywords contribute +2
    assert _detect_buying_signals("willing to pay, pricing and subscription details") >= 2
    # Discovery/tool keywords contribute +2
    assert _detect_buying_signals("looking for a tool or software app") >= 2
    assert _detect_buying_signals("comparison vs competitor switch") >= 1
    assert _detect_buying_signals("no buying intent here") == 0


def test_calculate_pain_score_basic():
    records = [
        {
            "category": "bugs",
            "subreddit": "startups",
            "severity_rating": 4,
            "pain_summary": "urgent blocking bug",
            "comment_or_content": "we would pay for a fix",
        },
        {
            "category": "bugs",
            "subreddit": "startups",
            "severity_rating": 3,
            "pain_summary": "annoying issue",
            "comment_or_content": "looking for a tool",
        },
    ]

    out = calculate_pain_score(records)
    assert len(out) == 2
    for rec in out:
        assert "pain_score" in rec
        assert isinstance(rec["pain_score"], int)
        assert 0 <= rec["pain_score"] <= 100

    # First record has stronger signals and should score higher
    assert out[0]["pain_score"] >= out[1]["pain_score"]


def test_calculate_pain_score_recurrence_effect():
    # Multiple mentions in same (category, subreddit) should increase recurrence_points
    records = []
    for i in range(5):
        records.append({
            "category": "feature",
            "subreddit": "SaaS",
            "severity_rating": 2,
            "pain_summary": "issue {}".format(i),
            "comment_or_content": "no strong signals",
        })
    # A single different category/subreddit pair
    records.append({
        "category": "feature",
        "subreddit": "ProductManagement",
        "severity_rating": 2,
        "pain_summary": "another",
        "comment_or_content": "no strong signals",
    })

    out = calculate_pain_score(records)
    # The repeated pair should have higher recurrence_points hence generally higher scores
    repeated_scores = [r["pain_score"] for r in out[:-1]]
    single_score = out[-1]["pain_score"]
    assert min(repeated_scores) >= single_score
