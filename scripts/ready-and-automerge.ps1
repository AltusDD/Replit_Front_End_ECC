Param(
  [string]$Owner = "AltusDD",
  [string]$Repo  = "Replit_Front_End_ECC",
  [int]$Pr       = 29
)

gh pr ready $Pr --repo $Owner/$Repo
# Auto-merge (squash) once all required checks are green
gh pr merge $Pr --squash --auto --repo $Owner/$Repo
Write-Host "✔ PR #$Pr marked ready; auto-merge (squash) enabled."