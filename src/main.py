"""Minimal CLI to run a Pushshift-based scrape + analysis + export pipeline."""
import argparse
from dotenv import load_dotenv
from src.scrape_reddit import get_submissions
from src.analyze import transform_to_schema
from src.exporter import write_csv, write_excel
from src.browseai_runner import run_from_env
import os


def _parse_subreddits(value: str):
    if not value:
        return []
    parts = [p.strip() for p in value.split(",") if p.strip()]
    # accept forms like 'r/SaaS' or 'SaaS'
    parts = [p[2:] if p.lower().startswith("r/") else p for p in parts]
    return parts


def main():
    load_dotenv()
    parser = argparse.ArgumentParser(description="Reddit pain-point research demo")
    parser.add_argument("--subreddits", default="SaaS,startups", help="Comma-separated subreddit names (no r/) or with r/")
    parser.add_argument("--keywords", default="", help="Comma-separated keywords to filter (optional)")
    parser.add_argument("--limit", type=int, default=25, help="Number of posts to fetch per subreddit")
    args = parser.parse_args()

    subs = _parse_subreddits(args.subreddits)
    kw = [k.strip() for k in args.keywords.split(",") if k.strip()] if args.keywords else None

    print(f"Fetching up to {args.limit} posts per subreddit for: {subs}")

    # If Browse.ai run endpoint is configured, prefer using it. The Browse.ai
    # run endpoint is expected to accept a JSON payload and return JSON with
    # either the results directly or a `status_url` that this helper can poll.
    raw = []
    try:
        if os.environ.get("BROWSEAI_RUN_URL") and os.environ.get("BROWSEAI_API_KEY"):
            print("Detected Browse.ai configuration, triggering Browse.ai run...")
            payload = {"subreddits": subs, "keywords": kw or [], "limit": args.limit}
            resp = run_from_env(payload=payload, timeout=300)
            # Expect `resp` to contain a list of items in `data` or `results`.
            raw = resp.get("data") or resp.get("results") or []
            print(f"Browse.ai run returned {len(raw)} items (raw)")
    except Exception as e:
        print(f"Browse.ai run failed or not usable: {e}. Falling back to Pushshift.")

    if not raw:
        raw = get_submissions(subs, keywords=kw, limit_per_sub=args.limit)
    print(f"Fetched {len(raw)} raw items")

    records = transform_to_schema(raw)
    print(f"Transformed to {len(records)} structured records")

    out_csv = write_csv(records)
    out_xlsx = write_excel(records)
    print(f"Wrote CSV -> {out_csv}")
    print(f"Wrote Excel -> {out_xlsx}")

    # Optionally push to Google Sheets if service account JSON provided
    if os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON"):
        try:
            url = write_excel and None
            from src.exporter import push_to_google_sheets
            sheet_url = push_to_google_sheets(records)
            if sheet_url:
                print(f"Pushed results to Google Sheets: {sheet_url}")
            else:
                print("Pushed results to Google Sheets (URL not returned)")
        except Exception as e:
            print(f"Failed to push to Google Sheets: {e}")


if __name__ == "__main__":
    main()
