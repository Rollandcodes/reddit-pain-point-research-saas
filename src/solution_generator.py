"""AI-powered solution generator based on pain-point data."""
from typing import List, Dict

SOLUTION_TEMPLATES = {
    "pricing": {
        "idea": "SaaS platform for cost optimization",
        "features": ["Cost analyzer", "Budget tracker", "Alternative finder", "ROI calculator"],
        "mvp": "Browser extension that compares prices across vendors",
        "pricing_model": "Freemium ($0-29/mo for basic, $99+/mo for enterprise)",
        "target_users": "Finance teams, procurement managers, cost-conscious founders",
        "marketing": "Position as 'Save 30% on SaaS costs' on ProductHunt and indie communities",
    },
    "bugs": {
        "idea": "Debugging & error tracking platform",
        "features": ["Real-time error alerts", "Stack trace analysis", "Team collaboration", "Integration hub"],
        "mvp": "Slack bot that aggregates and analyzes error logs",
        "pricing_model": "Pay-per-error ($0.01 per logged error, min $99/mo)",
        "target_users": "DevOps teams, startups, backend engineers",
        "marketing": "Target r/devops, ProductHunt, and developer communities",
    },
    "feature": {
        "idea": "Feature request management & prioritization tool",
        "features": ["Vote-based prioritization", "User feedback collection", "Roadmap visualization", "Integration with Slack"],
        "mvp": "Spreadsheet sync tool that auto-prioritizes based on user votes",
        "pricing_model": "Subscription ($49-199/mo based on requests/month)",
        "target_users": "Product managers, SaaS founders, design teams",
        "marketing": "Target ProductHunt and product management communities",
    },
    "performance": {
        "idea": "Performance monitoring & optimization SaaS",
        "features": ["Real-time monitoring", "Bottleneck detection", "Recommendations", "Benchmarking"],
        "mvp": "CLI tool for local performance profiling",
        "pricing_model": "SaaS + premium support ($79-499/mo)",
        "target_users": "Developers, DevOps, performance engineers",
        "marketing": "HackerNews, GitHub, developer blogs",
    },
    "Other": {
        "idea": "Market validation & research platform",
        "features": ["Problem identification", "Market sizing", "Competitor research", "Automated reports"],
        "mvp": "CLI that aggregates Reddit + ProductHunt insights",
        "pricing_model": "Subscription ($29-299/mo based on reports)",
        "target_users": "Founders, product managers, investors",
        "marketing": "Indie Hackers, Twitter, founder communities",
    }
}

def generate_solutions(records: List[Dict]) -> List[Dict]:
    """Generate product ideas and solutions for top pain-points."""
    for rec in records:
        category = rec.get("category", "Other")
        template = SOLUTION_TEMPLATES.get(category, SOLUTION_TEMPLATES["Other"])
        
        rec["suggested_product_idea"] = template["idea"]
        rec["suggested_features"] = ", ".join(template["features"])
        rec["suggested_mvp"] = template["mvp"]
        rec["suggested_pricing_model"] = template["pricing_model"]
        rec["suggested_target_users"] = template["target_users"]
        rec["suggested_marketing_angle"] = template["marketing"]
    
    return records
