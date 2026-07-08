[CmdletBinding(SupportsShouldProcess = $true)]
param(
  [Parameter(Mandatory = $true)]
  [string]$PublicKeyFile,

  [string]$SshHost = "nivi"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $PublicKeyFile)) {
  throw "Public key file not found: $PublicKeyFile"
}

$publicKey = (Get-Content -Raw -LiteralPath $PublicKeyFile).Trim()

if ($publicKey -match "[`r`n]") {
  throw "Public key file must contain exactly one key line."
}

if ($publicKey -notmatch "^ssh-ed25519\s+[A-Za-z0-9+/=]+(\s+.+)?$") {
  throw "Only one ssh-ed25519 public key line is accepted."
}

$encodedKey = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($publicKey))
$remoteScriptTemplate = @'
set -euo pipefail
key=$(printf '%s' '__ENCODED_KEY__' | base64 -d)

case "$key" in
  ssh-ed25519\ *) ;;
  *)
    echo "Only ssh-ed25519 keys are accepted." >&2
    exit 2
    ;;
esac

sudo install -d -o webdev -g webdev -m 700 /home/webdev/.ssh
sudo touch /home/webdev/.ssh/authorized_keys
sudo chown webdev:webdev /home/webdev/.ssh/authorized_keys
sudo chmod 600 /home/webdev/.ssh/authorized_keys

if sudo grep -qxF "$key" /home/webdev/.ssh/authorized_keys; then
  echo "webdev key already present."
else
  printf '%s\n' "$key" | sudo tee -a /home/webdev/.ssh/authorized_keys >/dev/null
  echo "webdev key added."
fi

sudo chown webdev:webdev /home/webdev/.ssh/authorized_keys
sudo chmod 600 /home/webdev/.ssh/authorized_keys
sudo sshd -t
'@

$remoteScript = $remoteScriptTemplate.Replace("__ENCODED_KEY__", $encodedKey)

$target = "${SshHost}:/home/webdev/.ssh/authorized_keys"
if ($PSCmdlet.ShouldProcess($target, "grant restricted webdev deploy key")) {
  $remoteScript | ssh $SshHost "bash -s"
}

Write-Host "Developer test command: ssh -n -T webdev serefy"
