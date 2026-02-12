# Quick Setup - Add GitHub Secrets

Your Cloudflare Account ID: `f624070c3a55e6217189fda7ae8d4454`

## Add Secrets to GitHub

1. Go to: https://github.com/Nelson211-0ss/progratecapitalventures/settings/secrets/actions
2. Click **"New repository secret"**

### Add First Secret:
- Name: `CLOUDFLARE_API_TOKEN`
- Value: [Use the same token from your Atlas Uganda Explorers project]
- Click **"Add secret"**

### Add Second Secret:
- Click **"New repository secret"** again
- Name: `CLOUDFLARE_ACCOUNT_ID`
- Value: `f624070c3a55e6217189fda7ae8d4454`
- Click **"Add secret"**

## That's It!

Once secrets are added, every push to `main` will automatically deploy to:
- https://prograte-capital-ventures.pages.dev
- https://progratecapital.com
