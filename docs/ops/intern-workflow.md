# Serefy Intern Workflow

Use this for normal Serefy website changes.

## First Setup

```bash
git clone git@github.com:RSuyash/Serefy-Innovations.git
cd Serefy-Innovations
git switch main
git pull --ff-only
npm ci --prefer-offline --include=optional
```

Check restricted deploy access:

```bash
ssh -n -T webdev serefy
```

Expected result: it should not open a server shell. It should say no deploy archive was received. That means restricted deploy access is working.

## Make a Change

```bash
git switch main
git pull --ff-only
git switch -c intern/short-change-name
```

Edit the files, then check your work:

```bash
npm test
npm run verify:assets
npm run lint
npm run build
git status --short
git diff
```

Commit and push:

```bash
git add <only-your-files>
git commit -m "clear short message"
git push -u origin intern/short-change-name
```

Then send the CTO:

```text
Branch:
What changed:
Files changed:
Checks passed:
Deploy needed: yes/no
```

## Preserve Local Work

If you already changed files locally, do not run deploy.

First check:

```bash
git status --short
```

Best option: save your work on a branch.

```bash
git switch -c intern/save-my-work
git add <only-your-files>
git commit -m "wip: preserve local Serefy work"
git push -u origin intern/save-my-work
```

If the work is not ready to commit, stash it:

```bash
git stash push -u -m "wip before Serefy sync"
git switch main
git pull --ff-only
git switch -c intern/short-change-name
git stash pop
```

If `git stash pop` shows conflicts, stop and ask the CTO.

## What Not To Do

- Do not edit directly on `main` unless the CTO explicitly asks.
- Do not deploy from your feature branch.
- Do not force push.
- Do not commit `.env`, private keys, credentials, `node_modules`, or build output.
- Do not use `ssh nivi` or hosting panel access.
