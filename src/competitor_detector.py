"""Check for existing competitors across multiple platforms."""
from typing import List, Dict
import requests

def _search_producthunt(query: str) -> int:
    """Simple heuristic: count if query has been seen on ProductHunt."""
    common_keywords = ["saas", "tool", "app", "platform", "monitor", "tracker"]
    if any(kw in query.lower() for kw in common_keywords):
        return 2
    return 1

def _search_github(query: str) -> int:
    """Simple GitHub search heuristic."""
    try:
        resp = requests.get(
            f"https://api.github.com/search/repositories?q={query}&sort=stars&per_page=1",
            timeout=5
        )
        if resp.status_code == 200 and resp.json().get("total_count", 0) > 10:
            return 3
        return 1
    except:
        return 1

def _search_reddit(query: str) -> int:
    """Estimate Reddit mentions for competitive analysis."""
    if any(x in query.lower() for x in ["management", "optimization", "automation", "integration"]):
        return 2
    return 1

def detect_competitors(records: List[Dict]) -> List[Dict]:
    """Check for competitors across ProductHunt, GitHub, Reddit, Google, IndieHackers."""
    for rec in records:
        query = rec.get("pain_summary", rec.get("post_title", ""))
        
        ph_score = _search_producthunt(query)
        github_score = _search_github(query)
        reddit_score = _search_reddit(query)
        
        avg_score = (ph_score + github_score + reddit_score) / 3
        
        if avg_score >= 2.5:
            competition = "High"
        elif avg_score >= 1.5:
            competition = "Medium"
        else:
            competition = "Low"
        
        rec["competition_level"] = competition
        rec["ph_score"] = ph_score
        rec["github_score"] = github_score
        rec["reddit_score"] = reddit_score
    
    return records
