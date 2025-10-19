# Replit Development Setup

This document provides instructions for developers working in Replit.

## Initial Setup

### 1. Configure Git Identity

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 2. Verify Git Remote

```bash
git remote -v
# Should show:
# origin  https://github.com/AltusDD/Replit_Front_End_ECC (fetch)
# origin  https://github.com/AltusDD/Replit_Front_End_ECC (push)
```

### 3. Set Up Sync Reminder (Optional)

To get daily reminders about syncing to GitHub, add this to your Replit shell config:

```bash
# Run this once
echo "source tools/sync_reminder.sh" >> ~/.bashrc
```

This will show a reminder once per day when you open a shell.

## Daily Development Workflow

### Morning Routine

```bash
# 1. Pull latest changes from GitHub
git pull origin main

# 2. Check sync status
npm run sync:check

# 3. Start development server
npm run dev
```

### During Development

Commit changes frequently (after each logical unit of work):

```bash
# Check what you've changed
git status
git diff

# Stage and commit
git add .
git commit -m "feat: describe what you did"

# Push to GitHub
git push origin main
```

### End of Day Routine

```bash
# 1. Check for uncommitted changes
npm run sync:check

# 2. Commit any remaining work
git add .
git commit -m "wip: end of day checkpoint"
git push origin main
```

## Using Replit's Git UI

Replit has a built-in Git UI accessible from the left sidebar:

1. Click the **Git** icon (branch symbol)
2. Review changed files
3. Stage files you want to commit
4. Write a commit message
5. Click **Commit & Push**

⚠️ **Note**: Always use meaningful commit messages following [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

## Environment Variables

Configure these in **Replit Secrets** (🔐 icon in left sidebar):

### Required Secrets

```bash
# Database
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# External APIs
DOORLOOP_API_KEY=your_doorloop_key
DOORLOOP_BASE_URL=https://api.doorloop.com/v1

# Admin
ADMIN_SYNC_TOKEN=your_admin_token

# Google Maps (for map features)
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
```

### Optional Secrets

```bash
# Azure (for function deployments)
AZURE_FUNCTIONAPP_PUBLISH_PROFILE=your_publish_profile

# Additional integrations
M365_TOKEN=your_m365_token
DROPBOX_KEY=your_dropbox_key
CORELOGIC_TOKEN=your_corelogic_token
```

## Common Replit Commands

### Development

```bash
# Start dev server (with hot reload)
npm run dev

# Run only frontend
npm run dev:web

# Run only backend API
npm run dev:api

# Check sync status
npm run sync:check

# Run guardrails (code quality checks)
npm run guardrail

# Build for production
npm run build
```

### Git Operations

```bash
# Quick sync (commit everything)
git add . && git commit -m "your message" && git push

# View recent commits
git log --oneline -10

# View uncommitted changes
git status

# View detailed changes
git diff

# Discard changes to a file
git checkout -- filename

# Create a new branch
git checkout -b feature/your-feature-name
```

### Database

```bash
# Run database migrations (if needed)
npm run migrate

# Run owner sync (from DoorLoop)
npm run sync:owners
```

## Troubleshooting

### Problem: "Permission denied" when pushing

**Solution**: Verify your GitHub credentials in Replit:
1. Go to Replit Account Settings
2. Navigate to "Connected services"
3. Reconnect GitHub with proper permissions

### Problem: Merge conflicts

**Solution**:
```bash
# Pull latest and resolve conflicts
git pull origin main

# Edit files to resolve conflicts (look for <<<<<<, =======, >>>>>>>)

# Mark conflicts as resolved
git add .
git commit -m "chore: resolve merge conflicts"
git push origin main
```

### Problem: "Your branch is ahead/behind"

**Solution**:
```bash
# If ahead: push your commits
git push origin main

# If behind: pull remote changes
git pull origin main
```

### Problem: Accidentally committed secrets

**Solution**:
```bash
# Remove from git history (be careful!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/file" \
  --prune-empty --tag-name-filter cat -- --all

# Then force push (requires force push permissions)
git push origin --force --all
```

⚠️ **Better**: Use Replit Secrets for all sensitive data, never commit them.

## Best Practices

### ✅ Do's

- ✅ Commit frequently (small, logical changes)
- ✅ Push to GitHub at least daily
- ✅ Write descriptive commit messages
- ✅ Pull before starting work each day
- ✅ Use Replit Secrets for sensitive data
- ✅ Run `npm run sync:check` regularly
- ✅ Test your changes before committing
- ✅ Run `npm run guardrail` before pushing

### ❌ Don'ts

- ❌ Don't commit sensitive data (API keys, passwords)
- ❌ Don't push broken code
- ❌ Don't leave changes uncommitted for days
- ❌ Don't force push without team coordination
- ❌ Don't work on main branch for experimental changes
- ❌ Don't commit node_modules or build artifacts
- ❌ Don't skip the guardrail checks

## Automated Checks

When you push to GitHub, automated checks run:

1. **CodeQL**: Security scanning
2. **Verify**: Linting and type checking
3. **Build**: Ensures code compiles
4. **Deploy**: Deploys to Azure (main branch only)

View results at: https://github.com/AltusDD/Replit_Front_End_ECC/actions

## Sync Monitoring

GitHub will automatically:
- ✅ Check for stale syncs (no commits > 7 days)
- ✅ Create reminder issues if needed
- ✅ Close reminder issues when syncs resume

## Resources

- 📖 [Full Sync Guide](./REPLIT_SYNC_GUIDE.md)
- 🔧 [Main README](./README.md)
- 🏗️ [Repo Organization](./docs/ecc_repo_organization.md)
- 🔄 [Merge README](./README.merge.md)
- 📝 [Replit Documentation](./replit.md)

## Getting Help

If you encounter issues:

1. Check this guide and the sync guide
2. Run `npm run sync:check` for diagnostics
3. Review recent commits: https://github.com/AltusDD/Replit_Front_End_ECC/commits/main
4. Check GitHub Actions: https://github.com/AltusDD/Replit_Front_End_ECC/actions
5. Ask the team in your communication channel

## Quick Reference Card

Print or bookmark this:

```
📋 REPLIT DAILY CHECKLIST
═══════════════════════════

Morning:
  □ git pull origin main
  □ npm run sync:check
  □ npm run dev

During Work:
  □ git add . && git commit -m "message"
  □ git push origin main
  □ (Repeat after each logical change)

End of Day:
  □ npm run sync:check
  □ Commit any pending changes
  □ git push origin main

Important Commands:
  npm run sync:check    - Check sync status
  npm run dev          - Start development
  npm run guardrail    - Code quality check
  git status           - See changes
  git log --oneline -5 - Recent commits
```

---

Last Updated: 2025-10-19
