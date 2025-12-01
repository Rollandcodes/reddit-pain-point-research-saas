# Reddit Pain-Point Research — Developer README (Minimal Demo)

This is a minimal runnable demo for the "Reddit Pain-Point Research" service.

Quick start (Windows PowerShell):

```powershell
python -m pip install -r requirements.txt
python -m src.main --subreddits SaaS,startups --limit 5
```

What it does:
- Uses Pushshift public API to fetch recent Reddit submissions for the specified subreddits.
- Applies simple heuristics to create a canonical schema: date, subreddit, post_title, post_url, comment_or_content, pain_summary, category, severity_rating, notes.
- Exports `output/sample_output.csv` and `output/sample_output.xlsx`.

Notes:
- This demo avoids third-party paid services (Browse.ai) so you can run it locally without API keys. For production you may prefer Browse.ai or PRAW.
- To push to Google Sheets, add the service account JSON path to `GOOGLE_SERVICE_ACCOUNT_JSON` and implement the integration.
