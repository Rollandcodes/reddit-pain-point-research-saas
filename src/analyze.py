"""Basic heuristics to convert raw Reddit items into canonical pain-point schema.

This module provides functions to transform raw Reddit post data into a structured
schema suitable for pain-point analysis. It includes category inference based on
keywords, severity rating heuristics, and text summarization.

Schema Output Fields:
    - date: ISO 8601 timestamp of the post
    - subreddit: Name of the subreddit
    - post_title: Title of the Reddit post
    - post_url: Full URL to the Reddit post
    - comment_or_content: The selftext/body content of the post
    - pain_summary: Truncated summary of the post content
    - category: Inferred category (Pricing, Bugs, Feature, Performance, Other)
    - severity_rating: Integer 1-5 indicating pain severity
    - notes: Reserved field for additional annotations

Migration Note:
    As of v2.0, the schema includes additional fields from downstream processing
    (pain_score, suggested_*, competition_level, etc.). These are added by
    other modules (scoring.py, solution_generator.py, competitor_detector.py).
"""
from typing import List, Dict

# Keyword categories used for automatic classification
KEYWORD_CATEGORIES = {
    "pricing": ["price", "pricing", "cost", "expensive", "subscription"],
    "bugs": ["bug", "error", "crash", "broken"],
    "feature": ["feature", "missing", "would be nice", "need"],
    "performance": ["slow", "latency", "lag", "performance"],
}

def _infer_category(text: str) -> str:
    """Infer the pain-point category from text content.

    Analyzes the text for keywords to determine the most likely category.
    Categories are checked in order: pricing, bugs, feature, performance.

    Args:
        text: The text content to analyze (title + body).

    Returns:
        One of: 'Pricing', 'Bugs', 'Feature', 'Performance', or 'Other'.
    """
    t = text.lower()
    for cat, kws in KEYWORD_CATEGORIES.items():
        for k in kws:
            if k in t:
                return cat.capitalize()
    return "Other"


def _infer_severity(text: str) -> int:
    """Infer the severity rating based on emotional intensity.

    Analyzes text for emotional keywords to determine pain severity.
    Higher severity indicates more urgent or blocking issues.

    Args:
        text: The text content to analyze.

    Returns:
        Integer 1-5:
            5 - Critical (urgent, blocking, can't/cannot)
            4 - Major (breaking, serious)
            3 - Moderate (annoying, frustrating)
            2 - Default (no strong indicators)
    """
    t = text.lower()
    if any(x in t for x in ["urgent", "critical", "blocking", "can't", "cannot"]):
        return 5
    if any(x in t for x in ["major", "breaking", "serious"]):
        return 4
    if any(x in t for x in ["annoy", "annoying", "frustrat"]):
        return 3
    return 2


def _summarize(text: str, max_chars: int = 200) -> str:
    """Create a truncated summary of the text.

    If the text exceeds max_chars, it is truncated at the last complete
    word boundary and an ellipsis is appended.

    Args:
        text: The text to summarize.
        max_chars: Maximum character length (default: 200).

    Returns:
        The summarized text, or empty string if input is None/empty.
    """
    if not text:
        return ""
    t = text.strip()
    if len(t) <= max_chars:
        return t
    return t[:max_chars].rsplit(" ", 1)[0] + "..."


def transform_to_schema(items: List[Dict]) -> List[Dict]:
    """Transform raw Reddit items into the canonical pain-point schema.

    Processes a list of raw Reddit post data and converts each into a
    structured record with inferred category, severity, and summary.

    Args:
        items: List of raw Reddit items. Each item should contain:
            - title: Post title
            - selftext: Post body content
            - subreddit: Subreddit name
            - date: ISO 8601 timestamp
            - full_link: URL to the post

    Returns:
        List of structured records with the following fields:
            - date: Original timestamp
            - subreddit: Subreddit name
            - post_title: Post title
            - post_url: Full URL
            - comment_or_content: Post body
            - pain_summary: Truncated summary
            - category: Inferred category
            - severity_rating: 1-5 severity score
            - notes: Empty string (for user annotations)
    """
    records = []
    for it in items:
        content = (it.get("title", "") or "") + "\n" + (it.get("selftext", "") or "")
        summary = _summarize(content)
        category = _infer_category(content)
        severity = _infer_severity(content)
        records.append({
            "date": it.get("date"),
            "subreddit": it.get("subreddit"),
            "post_title": it.get("title"),
            "post_url": it.get("full_link"),
            "comment_or_content": it.get("selftext"),
            "pain_summary": summary,
            "category": category,
            "severity_rating": severity,
            "notes": "",
        })
    return records
