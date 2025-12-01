"""Basic heuristics to convert raw Reddit items into canonical pain-point schema."""
from typing import List, Dict

KEYWORD_CATEGORIES = {
    "pricing": ["price", "pricing", "cost", "expensive", "subscription"],
    "bugs": ["bug", "error", "crash", "broken"],
    "feature": ["feature", "missing", "would be nice", "need"],
    "performance": ["slow", "latency", "lag", "performance"],
}

def _infer_category(text: str) -> str:
    t = text.lower()
    for cat, kws in KEYWORD_CATEGORIES.items():
        for k in kws:
            if k in t:
                return cat.capitalize()
    return "Other"

def _infer_severity(text: str) -> int:
    t = text.lower()
    if any(x in t for x in ["urgent", "critical", "blocking", "can't", "cannot"]):
        return 5
    if any(x in t for x in ["major", "breaking", "serious"]):
        return 4
    if any(x in t for x in ["annoy", "annoying", "frustrat"]):
        return 3
    return 2

def _summarize(text: str, max_chars: int = 200) -> str:
    if not text:
        return ""
    t = text.strip()
    if len(t) <= max_chars:
        return t
    return t[:max_chars].rsplit(" ", 1)[0] + "..."

def transform_to_schema(items: List[Dict]) -> List[Dict]:
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
