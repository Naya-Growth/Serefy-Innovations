[CmdletBinding(SupportsShouldProcess = $true)]
param(
  [Parameter(Mandatory = $true)]
  [string]$Match,

  [string]$SshHost = "nivi"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$needle = $Match.Trim()
if ($needle.Length -lt 6) {
  throw "Match must be at least 6 characters so a key is not removed accidentally."
}

if ($needle -match "[`r`n]") {
  throw "Match must be a single-line string."
}

$encodedNeedle = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($needle))
$remoteScriptTemplate = @'
set -euo pipefail
needle=$(printf '%s' '__ENCODED_NEEDLE__' | base64 -d)
auth=/home/webdev/.ssh/authorized_keys
backup="/home/webdev/.ssh/authorized_keys.bak.$(date -u +%Y%m%dT%H%M%SZ)"

sudo test -f "$auth"
before=$(sudo wc -l < "$auth")
sudo cp "$auth" "$backup"
sudo awk -v needle="$needle" 'index($0, needle) == 0 { print }' "$backup" | sudo tee "$auth" >/dev/null
sudo chown webdev:webdev "$auth"
sudo chmod 600 "$auth"
sudo sshd -t
after=$(sudo wc -l < "$auth")

echo "authorized_keys lines before=$before after=$after backup=$backup"
if [ "$before" = "$after" ]; then
  echo "No webdev key matched: $needle"
else
  echo "Removed matching webdev key line(s)."
fi
'@

$remoteScript = $remoteScriptTemplate.Replace("__ENCODED_NEEDLE__", $encodedNeedle)

$target = "${SshHost}:/home/webdev/.ssh/authorized_keys"
if ($PSCmdlet.ShouldProcess($target, "revoke restricted webdev deploy key matching '$needle'")) {
  $remoteScript | ssh $SshHost "bash -s"
}
