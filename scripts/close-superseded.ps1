# scripts/close-superseded.ps1
# Requires: GitHub CLI (gh). Login first: gh auth login
Param(
  [string]$Owner = "AltusDD",
  [string]$Repo  = "Replit_Front_End_ECC",
  [int]$Canonical = 29,
  [int[]]$Superseded = @(26,27,28,22),   # add more if needed
  [int]$TimeoutSeconds = 900,
  [int]$PollIntervalSeconds = 10,
  [switch]$DeleteBranches
)

function Require-GH {
  if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "GitHub CLI (gh) is required. Install and run 'gh auth login'."; exit 1
  }
  $authed = gh auth status 2>$null
  if (-not $authed) { Write-Error "Not authenticated. Run 'gh auth login'."; exit 1 }
}
Require-GH

$start = Get-Date
Write-Host "⏳ Waiting for PR #$Canonical to be merged (timeout ${TimeoutSeconds}s)..."
while ($true) {
  try {
    $pr = gh pr view $Canonical --repo "$Owner/$Repo" --json state,merged --jq "{state:.state, merged:.merged}" | ConvertFrom-Json
  } catch {
    Write-Error "Cannot read PR #$Canonical."; exit 1
  }

  if ($pr.merged -eq $true) { break }
  if ($pr.state -eq "CLOSED") {
    Write-Host "ℹ PR #$Canonical was closed without merging. Aborting cleanup."; exit 0
  }

  if ((New-TimeSpan -Start $start -End (Get-Date)).TotalSeconds -ge $TimeoutSeconds) {
    Write-Host "⌛ Timeout reached without merge; exiting."; exit 0
  }
  Start-Sleep -Seconds $PollIntervalSeconds
}

$comment = "Closing as **superseded by #$Canonical** (canonical guardrails/KPI/CodeQL)."
foreach ($n in $Superseded) {
  Write-Host "🔒 Closing PR #$n..."
  gh pr comment $n --repo "$Owner/$Repo" -b $comment
  gh pr close   $n --repo "$Owner/$Repo" -d

  if ($DeleteBranches) {
    try {
      $meta = gh pr view $n --repo "$Owner/$Repo" --json headRefName,headRepositoryOwner,headRepository --jq "{ref:.headRefName, owner:.headRepositoryOwner.login, sameRepo:(.headRepository.name == \"$Repo\")}" | ConvertFrom-Json
      if ($meta.sameRepo -and $meta.ref) {
        Write-Host "🧹 Deleting branch '${meta.ref}' (same repo)..."
        gh api -X DELETE "repos/$Owner/$Repo/git/refs/heads/$($meta.ref)" 2>$null
      } else {
        Write-Host "🧹 Skipping branch delete (fork or unknown)."
      }
    } catch {
      Write-Host "⚠ Branch deletion failed (non-fatal)."
    }
  }
}
Write-Host "✅ Done. Superseded PRs closed."