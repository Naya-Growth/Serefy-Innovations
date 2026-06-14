# Serefy Innovations Ops README

This repo controls the public Serefy Innovations website.

Production URLs:

- https://serefyinnovations.com/
- https://www.serefyinnovations.com/
- https://serefy-innovations.preview.nayagrowth.com/

Source branch:

- `main`

Approved deploy paths:

1. GitHub Actions: push or merge the approved commit to `main`. The `Deploy Production` workflow builds the site, deploys through restricted `webdev` SSH, and verifies the public release marker.
2. Direct webdev deploy: after CTO approval, run `npm run deploy:webdev` from a clean, synced `main` checkout. This uses the same restricted server-side release switcher.

The direct deploy path is only a fallback for billing/Actions outages or urgent CTO-approved updates. It is not a replacement for GitHub version control.

Intern rules:

- Do not deploy without CTO approval.
- Do not deploy from any branch except `main`.
- Do not deploy from a dirty laptop.
- Do not ask for or use `nivi` SSH, Hostinger access, DNS access, `.env` files, private keys, database credentials, or API tokens.
- Every website change must be committed and pushed to GitHub before deployment.

Docs to read:

- `docs/ops/intern-workflow.md`
- `docs/ops/frontend-deploy.md`
- `docs/serefy-webdev-sop.md`
