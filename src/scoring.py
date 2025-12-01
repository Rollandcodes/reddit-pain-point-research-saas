"""Pain-Point Scoring: Calculate a 0-100 score based on intensity, mentions, and signals."""
from typing import List, Dict

def _count_emotional_intensity(text: str) -> int:
    """Rate emotional intensity (1-5) based on keywords."""
    text_lower = text.lower()
    if any(x in text_lower for x in ["urgent", "critical", "blocking", "can't", "cannot", "impossible"]):
        return 5
    if any(x in text_lower for x in ["breaking", "serious", "frustrated", "annoyed"]):
        return 4
    if any(x in text_lower for x in ["annoying", "issue", "problem", "trouble"]):
        return 3
    if any(x in text_lower for x in ["need", "want", "wish", "would be nice"]):
        return 2
    return 1

def _detect_buying_signals(text: str) -> int:
    """Detect buying intent signals (0-5)."""
    text_lower = text.lower()
    signals = 0
    if any(x in text_lower for x in ["would pay", "willing to pay", "worth", "pricing", "cost", "subscription"]):
        signals += 2
    if any(x in text_lower for x in ["looking for", "anyone using", "recommendation", "tool", "software", "app"]):
        signals += 2
    if any(x in text_lower for x in ["vs", "comparison", "alternative", "competitor", "switch"]):
        signals += 1
    return min(signals, 5)

def calculate_pain_score(records: List[Dict], subreddit_popularity: Dict[str, int] = None) -> List[Dict]:
    """Calculate pain-point score (0-100) based on multiple factors."""
    if not subreddit_popularity:
        subreddit_popularity = {
            "SaaS": 500000,
            "startups": 1000000,
            "ProductManagement": 300000,
        }
    
    category_counts = {}
    for rec in records:
        key = (rec.get("category"), rec.get("subreddit"))
        category_counts[key] = category_counts.get(key, 0) + 1
    
    max_mentions = max(category_counts.values()) if category_counts else 1
    
    for rec in records:
        severity = rec.get("severity_rating", 2)
        content = rec.get("pain_summary", "") + " " + rec.get("comment_or_content", "")
        
        emotional = _count_emotional_intensity(content) * 4
        buying = _detect_buying_signals(content) * 4
        severity_points = (severity - 1) * 5
        
        sub = rec.get("subreddit", "")
        sub_size = subreddit_popularity.get(sub, 100000)
        subreddit_points = min((sub_size / 1000000) * 20, 20)
        
        key = (rec.get("category"), rec.get("subreddit"))
        mentions = category_counts.get(key, 1)
        recurrence_points = (mentions / max_mentions) * 20
        
        pain_score = int(emotional + buying + severity_points + subreddit_points + recurrence_points)
        rec["pain_score"] = min(pain_score, 100)
    
    return records
