# Quick Start: Replit ↔ GitHub Sync

## TL;DR - For Busy Developers

```bash
# Check if you need to sync
npm run sync:check

# Sync your work to GitHub
git add . && git commit -m "your message" && git push origin main

# Get latest from GitHub
git pull origin main
```

## One-Sentence Answer to Your Questions

1. **Are we syncing from Replit?** → Yes, but it's **manual** (requires `git push`)
2. **When was the last sync?** → September 24, 2025 (check with `git log`)
3. **Should we be pushing to Git?** → **YES!** Push daily or after each feature

## Essential Commands

| What You Want | Command |
|---------------|---------|
| Check sync status | `npm run sync:check` |
| Commit changes | `git add . && git commit -m "message"` |
| Push to GitHub | `git push origin main` |
| Get latest code | `git pull origin main` |
| See recent commits | `git log --oneline -10` |
| See what changed | `git status` |

## Daily Routine (30 seconds)

### Morning (Before Coding)
```bash
git pull origin main
```

### After Each Feature/Fix
```bash
git add .
git commit -m "feat: what you did"
git push origin main
```

### End of Day
```bash
npm run sync:check
# If it shows uncommitted work, commit and push
```

## Warning Signs

🔴 **BAD**: 
- You haven't pushed in 7+ days
- `git status` shows dozens of changed files
- GitHub issues labeled "sync-reminder" appear

🟢 **GOOD**:
- You push daily or after each feature
- `npm run sync:check` shows no issues
- GitHub has recent commits

## What's Automated vs Manual

### ✅ Automated (Happens Automatically)
- GitHub Actions run on every push
- Daily monitoring creates issues if stale (7+ days)
- DoorLoop data sync (every 6 hours)

### 🔧 Manual (You Must Do)
- Committing changes: `git commit`
- Pushing to GitHub: `git push`
- Pulling updates: `git pull`

## Need Help?

1. Quick check: `npm run sync:check`
2. Full guides:
   - [REPLIT_SYNC_GUIDE.md](./REPLIT_SYNC_GUIDE.md) - Complete sync guide
   - [REPLIT_SETUP.md](./REPLIT_SETUP.md) - Developer setup
   - [SYNC_STATUS.md](./SYNC_STATUS.md) - Current status
   - [SYNC_WORKFLOW.md](./SYNC_WORKFLOW.md) - Visual diagram

## Common Mistakes to Avoid

❌ Don't: Work for days without committing  
✅ Do: Commit after each logical change

❌ Don't: Commit but forget to push  
✅ Do: Push immediately after committing

❌ Don't: Ignore `npm run sync:check` warnings  
✅ Do: Address sync issues same day

❌ Don't: Commit secrets/API keys  
✅ Do: Use Replit Secrets for sensitive data

## Emergency: "I Haven't Synced in Weeks"

```bash
# 1. See what you've changed
git status

# 2. Review the changes
git diff

# 3. Commit everything
git add .
git commit -m "sync: backlog from [start date] to [end date]"

# 4. Push to GitHub
git push origin main

# 5. Verify it worked
npm run sync:check
```

## Setup Once (If First Time)

```bash
# Configure git identity
git config user.name "Your Name"
git config user.email "your@email.com"

# Test push access
git pull origin main
# Make a small change
git add .
git commit -m "test: verify sync access"
git push origin main
```

## Reminder System (Optional)

Want daily reminders? Add to Replit shell:

```bash
echo "source tools/sync_reminder.sh" >> ~/.bashrc
```

## Monitoring

### In Replit
- Run `npm run sync:check` daily

### On GitHub
- Visit: https://github.com/AltusDD/Replit_Front_End_ECC/commits/main
- Should see recent commits (within 7 days)

### GitHub Actions
- Visit: https://github.com/AltusDD/Replit_Front_End_ECC/actions
- Check "Check Replit Sync Status" workflow

## File Sizes & Load Times

All scripts are lightweight:
- `sync_check.sh`: Runs in ~1 second
- `npm run sync:check`: Instant feedback
- GitHub Action: Runs automatically in background

---

**Remember**: Sync is your friend. Do it daily! 🚀

Last Updated: 2025-10-19
