# GitHub Secrets & Actions — Quick Guide

This file documents how to add the required secrets for Browse.ai and Google Sheets using the `gh` CLI.

Prereqs:
- `gh` CLI installed and authenticated (`gh auth login`).

Add Browse.ai secrets:

```powershell
gh secret set BROWSEAI_RUN_URL --body 'https://api.browse.ai/your/run/endpoint'
gh secret set BROWSEAI_API_KEY --body 'sk_live_...'
gh secret set SUBREDDITS --body 'SaaS,startups'
```

Add Google service account JSON (two options):

Raw JSON:
```powershell
gh secret set GOOGLE_SERVICE_ACCOUNT_JSON --body (Get-Content 'C:\path\to\service-account.json' -Raw)
```

Base64-encoded (recommended for multiline safety):
```powershell
$bytes = [System.IO.File]::ReadAllBytes('C:\path\to\service-account.json')
$b64 = [Convert]::ToBase64String($bytes)
gh secret set GOOGLE_SERVICE_ACCOUNT_JSON --body $b64
```

Notes:
- Do NOT paste secrets into chat or commit them to the repository.
- The workflow `/.github/workflows/scrape.yml` will read these secrets and run the scrape.
- The Action uploads the `output/` directory as an artifact so you can download the generated CSV/XLSX from the run page.
