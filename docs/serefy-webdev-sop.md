# Serefy Website Deploy SOP

Use this only from the `Serefy-Innovations` repo.

## First-time setup

1. Install Node.js 22.
2. Generate your deploy key:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/serefy_webdev_ed25519 -N "" -C "bhavya-serefy-webdev"
```

3. Send this public key to Suyash:

```bash
cat ~/.ssh/serefy_webdev_ed25519.pub
```

4. After Suyash confirms the key is added, put this in `~/.ssh/config`:

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
ssh -T webdev
```

It should not open a shell. It may print `No deploy archive received`.

## Make the website live

Preferred path when GitHub push is blocked: use `npm run deploy:webdev`.
Normal repo path: push/merge to `main`; GitHub Actions will deploy the same
static release flow and verify the public URLs.

1. Open a terminal in the repo.
2. Pull the latest code:

```bash
git pull
```

3. Deploy:

```bash
npm run deploy:webdev
```

The script installs dependencies, runs tests, checks assets, typechecks, builds the site, uploads the static build, switches the live release, and smoke-checks the server.

## GitHub Actions deploy path

When a change reaches `main`, the `Deploy Production` workflow:

1. Builds the site.
2. Uploads the static archive to the VPS.
3. Calls the same server-side release switcher used by `webdev`.
4. Checks that all three public hostnames serve the exact built asset files and
   deployment marker for that commit.

If the workflow is green but your browser looks old, hard refresh first
(`Ctrl+Shift+R`). If it still looks old, send the workflow run link to Suyash.

## After deploy

Open these URLs:

- https://serefyinnovations.com/
- https://www.serefyinnovations.com/
- https://serefy-innovations.preview.nayagrowth.com/

If the script fails, stop and send the full terminal output to Suyash. Do not keep retrying with random changes.
