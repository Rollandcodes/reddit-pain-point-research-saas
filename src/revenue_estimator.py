"""Estimate revenue potential based on market factors."""
from typing import List, Dict

def estimate_revenue_potential(records: List[Dict]) -> List[Dict]:
    """Estimate market potential and revenue opportunity (0-100 score)."""
    
    for rec in records:
        pain_score = rec.get("pain_score", 50)
        competition = rec.get("competition_level", "Medium")
        severity = rec.get("severity_rating", 3)
        
        subreddit_map = {
            "SaaS": 500000,
            "startups": 1000000,
            "ProductManagement": 300000,
        }
        sub = rec.get("subreddit", "")
        audience_size = subreddit_map.get(sub, 100000)
        
        market_score = (pain_score * 0.4) + (min(audience_size / 10000, 100) * 0.3) + (severity * 5 * 0.2)
        
        competition_multiplier = {
            "Low": 1.0,
            "Medium": 0.8,
            "High": 0.6,
        }.get(competition, 0.8)
        
        revenue_score = int(market_score * competition_multiplier)
        
        if severity >= 4:
            target_pct = 0.5
        elif severity >= 3:
            target_pct = 0.3
        else:
            target_pct = 0.1
        
        target_audience = int(audience_size * target_pct)
        
        if revenue_score >= 75:
            pricing_tier = "$199/mo"
            arr_potential = int(target_audience * 199 * 0.05)
        elif revenue_score >= 50:
            pricing_tier = "$99/mo"
            arr_potential = int(target_audience * 99 * 0.03)
        else:
            pricing_tier = "$49/mo"
            arr_potential = int(target_audience * 49 * 0.02)
        
        rec["revenue_potential_score"] = min(revenue_score, 100)
        rec["estimated_market_size"] = audience_size
        rec["estimated_target_audience"] = target_audience
        rec["recommended_pricing"] = pricing_tier
        rec["estimated_arr_potential"] = f"${arr_potential:,}"
    
    return records
