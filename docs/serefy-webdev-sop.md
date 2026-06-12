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

## After deploy

Open these URLs:

- https://serefyinnovations.com/
- https://www.serefyinnovations.com/
- https://serefy-innovations.preview.nayagrowth.com/

If the script fails, stop and send the full terminal output to Suyash. Do not keep retrying with random changes.
