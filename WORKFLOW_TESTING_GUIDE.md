# Testing the GitHub Actions Workflow

This guide walks you through triggering and monitoring the automated Reddit Pain-Point Research workflow.

## Step 1: Add Repository Secrets (Required)

Before running the workflow, add these secrets to your GitHub repo (the workflow will use Pushshift by default if Browse.ai secrets are missing, so this step is optional but recommended for full testing).

### Option A: Using `gh` CLI (Fastest)

```powershell
# Navigate to your repo
cd C:\Users\muhan\reddit-pain-point-research-saas

# Add optional Browse.ai secrets (workflow will use Pushshift if missing)
gh secret set BROWSEAI_RUN_URL --body 'https://api.browse.ai/your/endpoint'
gh secret set BROWSEAI_API_KEY --body 'sk_live_YOUR_KEY'

# Add target subreddits
gh secret set SUBREDDITS --body 'SaaS,startups'

# Verify secrets were added
gh secret list
```

### Option B: Using GitHub UI

1. Go to: https://github.com/Rollandcodes/reddit-pain-point-research-saas
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret (BROWSEAI_RUN_URL, BROWSEAI_API_KEY, SUBREDDITS)

---

## Step 2: Trigger the Workflow Manually

### Option A: Using `gh` CLI

```powershell
gh workflow run scrape.yml --repo Rollandcodes/reddit-pain-point-research-saas
```

You should see output like:
```
✓ Created workflow_dispatch event for scrape.yml at main
```

### Option B: Using GitHub UI

1. Go to: https://github.com/Rollandcodes/reddit-pain-point-research-saas/actions
2. Click **Scheduled Reddit Pain-Point Scrape** workflow
3. Click **Run workflow** → **Run workflow** (keep default branch as `main`)

---

## Step 3: Monitor the Workflow Run

### Real-time Monitoring (CLI)

```powershell
# Watch the latest workflow run
gh run list --repo Rollandcodes/reddit-pain-point-research-saas --limit 1 --json status,conclusion,name,createdAt

# Get detailed output
gh run view --repo Rollandcodes/reddit-pain-point-research-saas <RUN_ID>

# Stream logs
gh run view --repo Rollandcodes/reddit-pain-point-research-saas <RUN_ID> --log
```

### Via GitHub UI

1. Go to: https://github.com/Rollandcodes/reddit-pain-point-research-saas/actions
2. Click the latest **Scheduled Reddit Pain-Point Scrape** run
3. Click **Set up Python** (or any step) to see logs in real-time
4. Look for:
   - ✅ "Fetching up to 25 posts per subreddit"
   - ✅ "Calculating pain-point scores"
   - ✅ "Generating suggested solutions"
   - ✅ "Detecting competitors"
   - ✅ "Estimating revenue potential"
   - ✅ "Generating validation report"
   - ✅ "Wrote CSV/Excel/Report"

---

## Step 4: Download Results

After the workflow completes successfully:

### Via CLI

```powershell
# List artifacts from the latest run
gh run list --repo Rollandcodes/reddit-pain-point-research-saas --limit 1

# Download artifact (replace <RUN_ID> with actual ID)
gh run download <RUN_ID> -D ./downloaded_artifacts --repo Rollandcodes/reddit-pain-point-research-saas
```

### Via GitHub UI

1. Go to the completed workflow run
2. Scroll down to **Artifacts** section
3. Click **reddit-painpoint-output** to download
4. Extract the ZIP file to get:
   - `sample_output.csv` — Enhanced with pain scores, solutions, competitors, revenue
   - `sample_output.xlsx` — Same data in Excel format
   - `validation_report.html` — Beautiful investor-ready report

---

## Step 5: Inspect the Output Files

### Open the Report

```powershell
# On Windows
start ./downloaded_artifacts/output/validation_report.html

# On Mac/Linux
open ./downloaded_artifacts/output/validation_report.html
```

**The report should show:**
- 📊 Executive summary with average pain scores
- 🎯 Top 10 pain-points ranked by score
- 💡 Suggested solutions with market sizing
- 🏆 Competitive landscape analysis
- 💰 Revenue potential estimates

### Inspect CSV Data

```powershell
# Open in Excel or PowerShell
Import-Csv ./downloaded_artifacts/output/sample_output.csv | Select-Object -First 5 | Format-Table

# Or use Python
python -c "import pandas as pd; df = pd.read_csv('./downloaded_artifacts/output/sample_output.csv'); print(df.head())"
```

**Expected columns:**
- `date`, `subreddit`, `post_title`, `post_url`, `comment_or_content`
- `pain_summary`, `category`, `severity_rating`, `notes`
- `pain_score` (0-100)
- `suggested_product_idea`, `suggested_features`, `suggested_mvp`, `suggested_pricing_model`, `suggested_target_users`, `suggested_marketing_angle`
- `competition_level`, `ph_score`, `github_score`, `reddit_score`
- `revenue_potential_score`, `estimated_market_size`, `estimated_target_audience`, `recommended_pricing`, `estimated_arr_potential`

---

## Troubleshooting

### Workflow Failed

Check the logs:
```powershell
gh run view --repo Rollandcodes/reddit-pain-point-research-saas <RUN_ID> --log
```

**Common issues:**
- **"No module named 'requests'"** — Dependencies not installed (GitHub Actions should install them)
- **"Pushshift API timeout"** — Reddit API is slow; workflow will retry or use cached data
- **"Competition detector failed"** — GitHub API rate limit; gracefully degrades to heuristics

### No Artifacts

1. Ensure the workflow ran to completion (not failed/cancelled)
2. Check that `output/` directory was created with files
3. Verify the "Upload outputs as artifact" step succeeded

### CSV/Excel Empty

1. Ensure Pushshift returned data (check logs: "Fetched N raw items")
2. Verify all 5 features ran without errors
3. Check the workflow logs for any exceptions

---

## Next Steps

1. ✅ **Run the workflow** (follow Step 2 above)
2. ✅ **Monitor execution** (follow Step 3)
3. ✅ **Download results** (follow Step 4)
4. ✅ **Inspect outputs** (follow Step 5)
5. 🚀 **Iterate:** Adjust subreddits, keywords, and limits as needed
6. 🚀 **Schedule:** Workflow runs daily at 6:00 UTC; or manually dispatch anytime

---

## Advanced: Customize the Workflow

Want to change the schedule or add more features?

Edit `.github/workflows/scrape.yml`:

```yaml
on:
  schedule:
    - cron: '0 6 * * *'       # Daily at 6:00 UTC
    # - cron: '0 */6 * * *'   # Every 6 hours
    # - cron: '0 9 * * MON'   # Weekly on Monday at 9:00 UTC
  workflow_dispatch:           # Manual trigger always available
```

Then commit and push:
```powershell
git add .github/workflows/scrape.yml
git commit -m "chore: update workflow schedule"
git push origin main
```

---

## Success Criteria ✅

Your workflow test is successful when you can:
- [ ] Trigger the workflow via CLI or UI
- [ ] See all 5 features run (scoring → solutions → competitors → revenue → report)
- [ ] Download artifacts containing CSV, Excel, and HTML report
- [ ] Open the HTML report and see pain scores, solutions, competitors, and revenue estimates
- [ ] Confirm data matches the number of posts fetched from Reddit

**You're done!** 🎉
