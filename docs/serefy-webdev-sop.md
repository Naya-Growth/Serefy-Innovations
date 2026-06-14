# Serefy Website Deploy SOP

Use this only from the `Serefy-Innovations` repo.

Read these first:

- `docs/ops/README.md`
- `docs/ops/intern-workflow.md`
- `docs/ops/frontend-deploy.md`

## First-Time SSH Setup

1. Install Node.js 22.
2. Generate your deploy key:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/serefy_webdev_ed25519 -N "" -C "bhavya-serefy-webdev"
```

3. Send this public key to the CTO:

```bash
cat ~/.ssh/serefy_webdev_ed25519.pub
```

4. After the CTO confirms the key is added, put this in `~/.ssh/config`:

```text
Host webdev
  HostName 93.127.199.24
  User webdev
  Port 22
  IdentityFile ~/.ssh/serefy_webdev_ed25519
  IdentitiesOnly yes
  RequestTTY no
```

5. Confirm this works:

```bash
ssh -n -T webdev serefy
```

It should not open a shell. It should print `No deploy archive received`.

## Make The Website Live

Normal path: push or merge the approved commit to `main`; GitHub Actions will deploy through restricted `webdev` SSH and verify the public URLs.

Fallback path: after CTO approval, use `npm run deploy:webdev`.

1. Open a terminal in the repo.
2. Pull the latest code:

```bash
git switch main
git pull --ff-only
git status --short
```

`git status --short` must print nothing.

3. Deploy:

```bash
npm run deploy:webdev
```

The script refuses dirty or unsynced code, installs dependencies, runs tests, checks assets, typechecks, builds the site, uploads the static build, switches the live release, and verifies the public release marker.

## GitHub Actions deploy path

When a change reaches `main`, the `Deploy Production` workflow:

1. Builds the site.
2. Uploads the static archive through the restricted `webdev` SSH user.
3. Calls the same server-side release switcher used by direct deploys.
4. Checks that all three public hostnames serve the exact built asset files and
   deployment marker for that commit.

If the workflow is green but your browser looks old, hard refresh first
(`Ctrl+Shift+R`). If it still looks old, send the workflow run link to the CTO.

## After deploy

Open these URLs:

- https://serefyinnovations.com/
- https://www.serefyinnovations.com/
- https://serefy-innovations.preview.nayagrowth.com/

If the script fails, stop and send the full terminal output to the CTO. Do not keep retrying with random changes.
