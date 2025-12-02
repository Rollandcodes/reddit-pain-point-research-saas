"""PainPointRadar Backend API - FastAPI application for Render deployment.

This module provides a REST API for the PainPointRadar SaaS platform,
offering endpoints for pain-point analysis, scanning, and report generation.

Render Configuration:
    - Build Command: pip install -r backend/requirements.txt
    - Start Command: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
"""
import os
from typing import List, Optional
from datetime import datetime

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Import pipeline modules
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.analyze import transform_to_schema
from src.scoring import calculate_pain_score
from src.solution_generator import generate_solutions
from src.competitor_detector import detect_competitors
from src.revenue_estimator import estimate_revenue_potential

# =============================================================================
# FastAPI App Configuration
# =============================================================================

app = FastAPI(
    title="PainPointRadar API",
    description="AI-powered Reddit pain-point analysis for SaaS founders and product managers",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",
        "https://*.netlify.app",
        "https://*.render.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# Pydantic Models
# =============================================================================

class HealthResponse(BaseModel):
    status: str = "ok"
    timestamp: str
    version: str = "1.0.0"


class RedditItem(BaseModel):
    """Raw Reddit post data input."""
    title: str
    selftext: Optional[str] = ""
    subreddit: str
    date: str
    full_link: str


class PainPoint(BaseModel):
    """Processed pain-point record."""
    date: Optional[str]
    subreddit: Optional[str]
    post_title: Optional[str]
    post_url: Optional[str]
    comment_or_content: Optional[str]
    pain_summary: Optional[str]
    category: Optional[str]
    severity_rating: Optional[int]
    pain_score: Optional[int] = None
    competition_level: Optional[str] = None
    suggested_product_idea: Optional[str] = None
    revenue_potential_score: Optional[int] = None
    notes: Optional[str] = ""


class AnalyzeRequest(BaseModel):
    """Request body for analyze endpoint."""
    items: List[RedditItem]
    include_solutions: bool = True
    include_competitors: bool = True
    include_revenue: bool = True


class AnalyzeResponse(BaseModel):
    """Response from analyze endpoint."""
    success: bool
    count: int
    pain_points: List[PainPoint]
    summary: dict


class ScanRequest(BaseModel):
    """Request for scanning subreddits."""
    subreddits: List[str] = Field(default=["SaaS", "startups"])
    limit: int = Field(default=50, ge=1, le=500)
    keywords: Optional[List[str]] = None


# =============================================================================
# API Endpoints
# =============================================================================

@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - redirects to docs."""
    return {"message": "PainPointRadar API", "docs": "/docs"}


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint for Render."""
    return HealthResponse(
        status="ok",
        timestamp=datetime.utcnow().isoformat(),
        version="1.0.0",
    )


@app.post("/api/analyze", response_model=AnalyzeResponse, tags=["Analysis"])
async def analyze_pain_points(request: AnalyzeRequest):
    """Analyze Reddit posts and extract pain-points with scoring.
    
    This endpoint takes raw Reddit post data and returns:
    - Categorized pain-points (Pricing, Bugs, Feature, Performance, Other)
    - Severity ratings (1-5)
    - Pain scores (0-100)
    - Solution suggestions
    - Competition analysis
    - Revenue potential estimates
    """
    try:
        # Convert Pydantic models to dicts
        items = [item.model_dump() for item in request.items]
        
        # Run pipeline
        records = transform_to_schema(items)
        records = calculate_pain_score(records)
        
        if request.include_solutions:
            records = generate_solutions(records)
        
        if request.include_competitors:
            records = detect_competitors(records)
        
        if request.include_revenue:
            records = estimate_revenue_potential(records)
        
        # Sort by pain_score descending
        records.sort(key=lambda x: x.get("pain_score", 0), reverse=True)
        
        # Generate summary
        summary = {
            "total_analyzed": len(records),
            "avg_pain_score": sum(r.get("pain_score", 0) for r in records) / len(records) if records else 0,
            "categories": {},
            "top_opportunity": records[0].get("pain_summary", "N/A") if records else "N/A",
        }
        
        for rec in records:
            cat = rec.get("category", "Other")
            summary["categories"][cat] = summary["categories"].get(cat, 0) + 1
        
        return AnalyzeResponse(
            success=True,
            count=len(records),
            pain_points=[PainPoint(**r) for r in records],
            summary=summary,
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/categories", tags=["Reference"])
async def get_categories():
    """Get available pain-point categories."""
    return {
        "categories": [
            {"name": "Pricing", "description": "Cost, pricing, subscription issues"},
            {"name": "Bugs", "description": "Errors, crashes, broken functionality"},
            {"name": "Feature", "description": "Missing features, feature requests"},
            {"name": "Performance", "description": "Speed, latency, performance issues"},
            {"name": "Other", "description": "General feedback and other issues"},
        ]
    }


@app.get("/api/demo", tags=["Demo"])
async def demo_analysis():
    """Run a demo analysis with sample data."""
    sample_items = [
        {
            "title": "The pricing is way too expensive for startups",
            "selftext": "I can't believe how much they charge. It's urgent we find an alternative.",
            "subreddit": "SaaS",
            "date": "2025-01-01T10:00:00Z",
            "full_link": "https://reddit.com/r/SaaS/demo1",
        },
        {
            "title": "Bug causing crashes on mobile",
            "selftext": "The app keeps crashing. This is a serious issue blocking our workflow.",
            "subreddit": "startups",
            "date": "2025-01-02T11:00:00Z",
            "full_link": "https://reddit.com/r/startups/demo2",
        },
        {
            "title": "Missing feature: export to PDF",
            "selftext": "Would be nice if we could export reports to PDF format.",
            "subreddit": "ProductManagement",
            "date": "2025-01-03T12:00:00Z",
            "full_link": "https://reddit.com/r/ProductManagement/demo3",
        },
    ]
    
    records = transform_to_schema(sample_items)
    records = calculate_pain_score(records)
    records = generate_solutions(records)
    records = detect_competitors(records)
    records = estimate_revenue_potential(records)
    records.sort(key=lambda x: x.get("pain_score", 0), reverse=True)
    
    return {
        "success": True,
        "message": "Demo analysis completed",
        "count": len(records),
        "pain_points": records,
    }


# =============================================================================
# Run with Uvicorn (for local development)
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
