# CI/CD Pipeline Setup

This repository uses GitHub Actions for continuous integration and deployment.

## Workflows

### 1. Test & Lint (`test.yml`)

**Triggers:**
- Push to any branch
- Pull requests to `main` or `develop`

**Jobs:**
- **test**: Runs Next.js application tests
  - Installs dependencies
  - Generates Prisma client
  - Runs ESLint
  - Type checks TypeScript
  - Builds the application
  - Uploads build artifacts

- **python-tests**: Runs Python backend tests
  - Installs Python dependencies
  - Runs pytest tests

**Status Badge:**
```markdown
![Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Test%20%26%20Lint/badge.svg)
```

### 2. Deploy to Production (`deploy.yml`)

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Jobs:**
- **deploy**: Deploys to Vercel production
  - Installs Vercel CLI
  - Pulls environment variables
  - Builds project
  - Deploys to production

**Note:** This workflow should be run after tests pass. Consider adding a dependency on the test workflow.

## Required Secrets

### For Testing Workflow

The following secrets are optional but recommended for full test coverage:

- `DATABASE_URL` - PostgreSQL connection string (for Prisma generation)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `NEXT_PUBLIC_APP_URL` - Application URL

### For Deployment Workflow

The following secrets are **required** for deployment:

- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

## Setting Up Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with its corresponding value

### Getting Vercel Credentials

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel login`
3. Run `vercel link` in your project directory
4. Get your credentials:
   - **VERCEL_TOKEN**: 
     - Go to [Vercel Settings](https://vercel.com/account/tokens)
     - Create a new token
   - **VERCEL_ORG_ID**: 
     - Run `vercel whoami` or check `.vercel/project.json`
   - **VERCEL_PROJECT_ID**: 
     - Check `.vercel/project.json` after running `vercel link`

## Workflow Status

You can check workflow status:
- In the **Actions** tab of your GitHub repository
- Via status badges in your README
- Via GitHub API

## Customization

### Adding More Test Steps

Edit `.github/workflows/test.yml` to add:
- Unit tests (if you add a test framework)
- E2E tests
- Security scanning
- Performance testing

### Changing Deployment Target

To deploy to a different platform, modify `.github/workflows/deploy.yml`:
- **Netlify**: Use `netlify-cli`
- **AWS**: Use AWS deployment actions
- **Railway**: Use Railway CLI
- **Custom**: Add your deployment commands

### Adding Pre-deployment Checks

You can make deployment depend on tests by adding:

```yaml
jobs:
  deploy:
    needs: test  # Wait for test job to complete
    if: github.ref == 'refs/heads/main'
```

## Troubleshooting

### Build Fails

1. Check build logs in GitHub Actions
2. Verify all environment variables are set
3. Ensure Prisma schema is valid
4. Check Node.js version compatibility

### Deployment Fails

1. Verify Vercel credentials are correct
2. Check Vercel project settings
3. Ensure environment variables are set in Vercel dashboard
4. Check Vercel build logs

### Tests Fail

1. Run tests locally: `npm run lint && npm run build`
2. Check TypeScript errors: `npx tsc --noEmit`
3. Verify Prisma client is generated
4. Check Python tests: `pytest tests/ -v`

## Best Practices

1. **Always run tests before deployment**
   - Consider adding `needs: test` to deploy job

2. **Use branch protection rules**
   - Require status checks to pass
   - Require pull request reviews

3. **Monitor workflow runs**
   - Set up notifications for failed workflows
   - Review logs regularly

4. **Keep secrets secure**
   - Never commit secrets to repository
   - Rotate secrets regularly
   - Use least privilege principle

5. **Optimize workflow speed**
   - Use caching (already implemented)
   - Run jobs in parallel when possible
   - Only run necessary jobs per event

## Next Steps

1. Set up required secrets in GitHub
2. Test workflows by creating a pull request
3. Configure branch protection rules
4. Add status badges to README
5. Set up deployment notifications

