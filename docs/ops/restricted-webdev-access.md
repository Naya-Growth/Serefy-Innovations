# Restricted Webdev Access

Use this when granting a developer Serefy deploy access without giving VPS,
database, GitHub secret, or `nivi` shell access.

The server account is `webdev`. SSH is restricted by
`/etc/ssh/sshd_config.d/91-webdev-restricted.conf` with
`ForceCommand /usr/local/sbin/webdev-deploy-router`. For Serefy, the only
command developers need is:

```bash
ssh -n -T webdev serefy
```

It should not open a shell. If no archive is sent, the expected response is
`No deploy archive received`.

## Developer Setup

Ask the developer to create a dedicated key:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/serefy_webdev_ed25519 -N "" -C "neeraj-serefy-webdev-YYYYMMDD"
cat ~/.ssh/serefy_webdev_ed25519.pub
```

They should send only the `.pub` line. Do not ask for or accept private keys.

After access is granted, they add this SSH config:

```text
Host webdev
  HostName 93.127.199.24
  User webdev
  Port 22
  IdentityFile ~/.ssh/serefy_webdev_ed25519
  IdentitiesOnly yes
  RequestTTY no
```

Then they test:

```bash
ssh -n -T webdev serefy
```

## Grant Access

Save the public key line into a local file, then run from this repo:

```powershell
pwsh ./scripts/grant-webdev-access.ps1 -PublicKeyFile ./.local/neeraj-serefy-webdev.pub
```

The script:

- accepts only a single `ssh-ed25519` public key line
- connects through `ssh nivi`
- appends the key only if it is not already present
- restores `/home/webdev/.ssh` ownership and file modes
- runs `sshd -t` before exiting

## Revoke Access

Use a unique key comment or enough of the public key body:

```powershell
pwsh ./scripts/revoke-webdev-access.ps1 -Match "neeraj-serefy-webdev-YYYYMMDD"
```

The script creates a timestamped backup beside `authorized_keys` before it
removes matching lines.

## Deploy Rights

This access only permits restricted static deploy targets routed by
`webdev-deploy-router`. It does not grant:

- `nivi` SSH
- VPS shell access
- database access
- GitHub secrets
- GitHub Actions admin rights
- DNS or Hostinger access

Normal deployment stays GitHub Actions on `main`. Direct `webdev` deploy is a
fallback only when the CTO approves it or Actions minutes are blocked.
