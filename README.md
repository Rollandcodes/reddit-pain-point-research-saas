# PainPointRadar Research SaaS

> Transform Reddit discussions into structured Excel/CSV pain-point data for SaaS founders

## ðŸ“‹ Project Overview

**Product Name:** PainPointRadar Research Service

**Value Proposition:** A web scraping and data analysis service that transforms Reddit discussions into structured Excel/CSV pain-point data for SaaS founders. Uses Browse.ai automation to help entrepreneurs validate their SaaS ideas through real user feedback.

**Target Market:**
- First-time founders
- SaaS entrepreneurs
- Product managers validating ideas

**Pricing:**
- Early bird: $20 (first 3 clients)
- Regular: $50

**Delivery Time:** 24-48 hours

## 🚀 Features

- Automated Reddit scraping using Browse.ai
- Scrapes 25 Reddit posts per run
- Structured data output in Excel/CSV format
- Pain point categorization by severity (1-5 scale)
- Analysis includes:
  - Date
  - Subreddit
  - Post Title
  - Post URL
  - Comment/Content
  - Pain Summary
  - Category
  - Severity Rating
  - Notes

## 📊 Exporter Field List

The output CSV/Excel files contain the following fields:

### Core Fields (from analyze.py)
| Field | Description |
|-------|-------------|
| `date` | ISO 8601 timestamp of the post |
| `subreddit` | Name of the subreddit |
| `post_title` | Title of the Reddit post |
| `post_url` | Full URL to the Reddit post |
| `comment_or_content` | The selftext/body content of the post |
| `pain_summary` | Truncated summary of the post content |
| `category` | Inferred category (Pricing, Bugs, Feature, Performance, Other) |
| `severity_rating` | Integer 1-5 indicating pain severity |
| `notes` | Reserved field for additional annotations |

### Extended Fields (from downstream processing)
| Field | Description |
|-------|-------------|
| `pain_score` | 0-100 composite pain score |
| `suggested_product_idea` | AI-generated product idea |
| `suggested_features` | Recommended features |
| `suggested_mvp` | MVP approach |
| `suggested_pricing_model` | Recommended pricing |
| `suggested_target_users` | Target user segments |
| `suggested_marketing_angle` | Marketing approach |
| `competition_level` | High/Medium/Low competition |
| `ph_score` | ProductHunt competitor score |
| `github_score` | GitHub competitor score |
| `reddit_score` | Reddit competitor score |
| `revenue_potential_score` | Revenue potential rating |
| `estimated_market_size` | Market size estimate |
| `estimated_target_audience` | Target audience size |
| `recommended_pricing` | Pricing recommendation |
| `estimated_arr_potential` | Annual recurring revenue potential |

### Schema Migration Note

> **v2.0 Schema Changes:** The extended fields (pain_score, suggested_*, competition_level, etc.) 
> are added by downstream modules (scoring.py, solution_generator.py, competitor_detector.py, 
> revenue_estimator.py). If you're upgrading from v1.x, ensure your integrations handle these 
> additional fields.

## ðŸ”— Key Resources

### Browse.ai Scraper
- **Status:** Active âœ…
- **Capability:** Scrapes 25 Reddit posts per run
- **Cost:** Free tier


### Browse.ai Configuration

To configure Browse.ai for automated scraping, set the following environment variables:

```bash
# Required for Browse.ai integration
export BROWSEAI_RUN_URL="https://api.browse.ai/v2/robots/{robotId}/runs"
export BROWSEAI_API_KEY="sk_live_xxxxx"
```

The module validates these variables on startup. If not set, the pipeline falls back to Pushshift API.

```python
from src.browseai_runner import validate_environment, run_from_env

# Validate configuration
try:
    validate_environment()
    print("Browse.ai configured correctly!")
except EnvironmentError as e:
    print(f"Configuration error: {e}")

# Run a job
result = run_from_env(payload={"subreddits": ["SaaS"], "limit": 25})
```
### Data Template
- Structured Google Sheets template
- Contains 11 analyzed pain points (1 sample + 10 real)
- Ready-to-use format for client delivery

## ðŸ’¡ Use Cases

1. **SaaS Idea Validation:** Find real problems people are discussing
2. **Market Research:** Understand pain points in specific niches
3. **Product Development:** Identify features users actually need
4. **Competitor Analysis:** See what frustrations exist with current solutions

## ðŸ“Š Deliverables

Clients receive:
- Excel/CSV file with structured pain-point data
- Categorized and severity-rated insights
- Actionable pain summaries
- Source links for verification

## ðŸ› ï¸ Tech Stack

- **Web Scraping:** Browse.ai
- **Data Processing:** Python
- **Data Storage:** Google Sheets
- **Output Format:** Excel/CSV

## 🖥️ Demo & Quick Start

### Running the Pipeline

```bash
# Install dependencies
pip install -r requirements.txt

# Run the pipeline with default settings (fetches from SaaS, startups subreddits)
python -m src.main --subreddits SaaS,startups --limit 5

# Run with custom subreddits and limits
python -m src.main --subreddits ProductManagement,entrepreneur --limit 10

# Run with keywords filter
python -m src.main --subreddits SaaS --keywords "pricing,expensive" --limit 25
```

### Running the Demo Integration

```bash
# Run full demo (pipeline + Flask dashboard)
python demo_integration.py

# Run only the pipeline (no server)
python demo_integration.py --no-server
```

### Running the Dashboard Only

```bash
# Start the Flask dashboard (assumes output/ exists)
cd dashboard && python app.py

# Access the dashboard at http://localhost:5000
```

### Running Tests

```bash
# Install test dependencies
pip install pytest

# Run all tests
python -m pytest tests/ -v

# Run specific test file
python -m pytest tests/test_analyze.py -v
```

## ðŸ“ License

MIT License - see the [LICENSE](LICENSE) file for details

## ðŸ‘¤ Author

**Rolland Muhanguzi**
- LinkedIn: [Rolland Muhanguzi](https://www.linkedin.com/in/rolland-muhanguzi-507b6136a/)
- GitHub: [@Rollandcodes](https://github.com/Rollandcodes)
- Email: muhanguzirollands@gmail.com

## ðŸŽ¯ Project Status

**Status:** Active Development
**Last Updated:** November 30, 2025

---
<!-- Fixed Vercel deployment - set Root Directory to app -->

*Helping entrepreneurs validate SaaS ideas through real user feedback from Reddit discussions.*

