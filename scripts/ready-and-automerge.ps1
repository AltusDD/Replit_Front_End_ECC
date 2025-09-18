# scripts/ready-and-automerge.ps1
# Requires: GitHub CLI (gh). Login first: gh auth login
Param(
  [string]$Owner = "AltusDD",
  [string]$Repo  = "Replit_Front_End_ECC",
  [int]$Pr       = 29,
  [ValidateSet("merge","squash","rebase")][string]$Method = "squash"
)

function Require-GH {
  if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "GitHub CLI (gh) is required. Install and run 'gh auth login'."; exit 1
  }
  $authed = gh auth status 2>$null
  if (-not $authed) { Write-Error "Not authenticated. Run 'gh auth login'."; exit 1 }
}

Require-GH

# Sanity: PR exists?
try {
  $state = gh pr view $Pr --repo "$Owner/$Repo" --json state --jq .state
} catch {
  Write-Error "PR #$Pr not found in $Owner/$Repo."; exit 1
}
if ($state -eq "MERGED") { Write-Host "PR #$Pr already merged."; exit 0 }

gh pr ready $Pr --repo $Owner/$Repo
gh pr merge $Pr --$Method --auto --repo $Owner/$Repo
Write-Host "✔ PR #$Pr marked ready; auto-merge ($Method) enabled."