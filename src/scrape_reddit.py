"""Simple Pushshift-based Reddit submissions fetcher for demo purposes."""
from typing import List, Dict, Optional
import requests
from datetime import datetime, UTC

PUSHSHIFT_SUBMISSION_URL = "https://api.pushshift.io/reddit/search/submission/"

def _fetch_submissions(subreddit: str, size: int = 25, query: Optional[str] = None) -> List[Dict]:
    params = {"subreddit": subreddit, "size": size, "sort": "desc", "sort_type": "created_utc"}
    if query:
        params["q"] = query
    resp = requests.get(PUSHSHIFT_SUBMISSION_URL, params=params, timeout=20)
    resp.raise_for_status()
    data = resp.json().get("data", [])
    return data

def get_submissions(subreddits: List[str], keywords: Optional[List[str]] = None, limit_per_sub: int = 25) -> List[Dict]:
    """Return a list of submissions normalized to a small raw schema.

    Each item contains: created_utc, subreddit, title, permalink, selftext, full_link
    """
    results = []
    for sub in subreddits:
        try:
            data = _fetch_submissions(sub, size=limit_per_sub)
        except Exception:
            data = []
        for item in data:
            results.append({
                "created_utc": item.get("created_utc"),
                "date": datetime.fromtimestamp(item.get("created_utc", 0), UTC).isoformat().replace("+00:00", "Z") if item.get("created_utc") else None,
                "subreddit": item.get("subreddit"),
                "title": item.get("title", ""),
                "permalink": item.get("permalink", ""),
                "full_link": item.get("full_link") or ("https://reddit.com" + item.get("permalink", "")),
                "selftext": item.get("selftext", ""),
                "id": item.get("id"),
            })

    # Optionally filter by keywords (very simple): keep items that contain any keyword in title or selftext
    if keywords:
        kw_lower = [k.lower() for k in keywords]
        filtered = []
        for r in results:
            text = (r.get("title", "") + " " + r.get("selftext", "")).lower()
            if any(k in text for k in kw_lower):
                filtered.append(r)
        return filtered

    return results
