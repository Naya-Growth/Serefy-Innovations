# Serefy Frontend Deploy SOP

Deployment is allowed only after CTO approval and only after the approved change is on `main`.

## Path 1: GitHub Actions Deploy

Use this as the normal path.

1. Merge or push the approved commit to `main`.
2. Open GitHub Actions.
3. Check the `Deploy Production` workflow.
4. The run must be green.
5. Confirm the workflow printed all three production URLs as serving the deployed commit.

The workflow deploys through the restricted `webdev` SSH user. It does not need `nivi` SSH, Hostinger, DNS, or VPS shell access.

Manual workflow dispatch is also allowed from GitHub Actions if the CTO asks for it. Use `main` unless the CTO gives an exact commit SHA.

## Path 2: Direct Webdev Deploy

Use this only when the CTO approves a fallback deploy.

```bash
git switch main
git pull --ff-only
git status --short
```

`git status --short` must print nothing.

Check restricted SSH:

```bash
ssh -n -T webdev serefy
```

Expected result: no shell opens, and it says no deploy archive was received.

Deploy:

```bash
npm run deploy:webdev
```

The script will:

- refuse a dirty working tree
- refuse any branch except `main`
- refuse local code that is not identical to `origin/main`
- install dependencies
- run tests, asset checks, typecheck, and build
- stamp `dist/serefy-deploy.json`
- upload only the static `dist/` archive
- switch the live release
- verify all public URLs serve the deployed marker and built assets

## Public Verification

After either deploy path:

```bash
curl -L https://serefyinnovations.com/serefy-deploy.json
curl -L https://www.serefyinnovations.com/serefy-deploy.json
curl -L https://serefy-innovations.preview.nayagrowth.com/serefy-deploy.json
```

The `sha` should match the approved GitHub commit.

Open:

- https://serefyinnovations.com/
- https://www.serefyinnovations.com/
- https://serefy-innovations.preview.nayagrowth.com/

Hard refresh if the browser looks old.

## CTO VPS Health Check

Interns do not need this access. The CTO or authorized operator can run it before/after deployment:

```bash
ssh nivi "printf 'loadavg: '; cat /proc/loadavg; top -bn1 | grep '%Cpu' || true; awk '/^cpu / {total=0; for(i=2;i<=11;i++) total+=\$i; printf \"steal: %.2f%%\\n\", (\$9*100)/total}' /proc/stat; docker inspect serefy-innovations-preview --format 'status={{.State.Status}} health={{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}} restart={{.RestartCount}} image={{.Config.Image}}'"
```

Stop deployment if CPU steal is high, load is abnormal, the container is unhealthy, or the CTO says to pause.

## Rollback

Interns do not perform rollback.

If a deploy is bad, send the CTO:

```text
What happened:
GitHub run link or terminal output:
Commit SHA:
Screenshots:
```
