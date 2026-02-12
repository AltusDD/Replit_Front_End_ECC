# Replit ↔ GitHub Sync Guide

## Overview

This repository is actively developed in **Replit** and synced to **GitHub**. This guide explains how to maintain proper synchronization between the two environments.

## Current Status

⚠️ **Important**: Sync from Replit to GitHub is **MANUAL** - it requires explicit git commands.

Last GitHub sync: Check `git log` for the most recent commit date.

## Why Manual Sync?

Replit provides a development environment with:
- Live preview and hot reload
- Integrated database access
- Secrets management
- Real-time collaboration

However, changes made in Replit **DO NOT automatically push to GitHub**. Developers must manually commit and push changes.

## Sync Workflow (Replit → GitHub)

### Daily Workflow

When working in Replit, follow these steps regularly:

```bash
# 1. Check current status
git status

# 2. Review changes
git diff

# 3. Add files to staging
git add .

# 4. Commit with descriptive message
git commit -m "feat: your descriptive commit message"

# 5. Push to GitHub
git push origin main
```

### Best Practices

1. **Commit Frequently**: Commit after completing each logical unit of work
2. **Descriptive Messages**: Use [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation changes
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

3. **Push Regularly**: Push to GitHub at least daily, ideally after each commit
4. **Pull Before Push**: Always pull latest changes before starting work:
   ```bash
   git pull origin main
   ```

## Sync Workflow (GitHub → Replit)

To get latest changes from GitHub into Replit:

```bash
# Pull latest changes
git pull origin main

# If there are conflicts, resolve them and then:
git add .
git commit -m "chore: merge latest changes from GitHub"
git push origin main
```

## Automated Verification

### Check Sync Status

Run this command in Replit Shell to check sync status:

```bash
npm run sync:check
```

This will show:
- Uncommitted changes
- Unpushed commits
- Days since last push

### Pre-Commit Checks

The repository includes automated checks that run before commits:
- Code linting
- Type checking
- Build verification

## Common Issues

### Issue 1: Uncommitted Changes Piling Up

**Symptoms**: `git status` shows many modified files
**Solution**: 
```bash
git add .
git commit -m "chore: sync uncommitted changes"
git push origin main
```

### Issue 2: Merge Conflicts

**Symptoms**: `git pull` reports conflicts
**Solution**:
1. Review conflicted files: `git status`
2. Edit files to resolve conflicts (look for `<<<<<<<`, `=======`, `>>>>>>>`)
3. Mark as resolved: `git add <file>`
4. Complete merge: `git commit`
5. Push: `git push origin main`

### Issue 3: Forgotten to Push

**Symptoms**: Local commits but GitHub is outdated
**Solution**:
```bash
# See unpushed commits
git log origin/main..HEAD

# Push them
git push origin main
```

## Continuous Integration

The repository has GitHub Actions workflows that run on every push:
- **CodeQL**: Security scanning
- **Verify**: Linting, type checking, and build
- **Deploy**: Deploy to Azure (on main branch)

These workflows help ensure code quality and catch issues early.

## Data Sync vs Code Sync

Note: This guide covers **code synchronization**. For **data synchronization**:
- **DoorLoop Owners**: Automated via GitHub Action (runs every 6 hours)
- **Database**: Managed separately through Supabase
- **File Uploads**: Stored in Google Cloud Storage

## Quick Reference Card

| Task | Command |
|------|---------|
| Check status | `git status` |
| View changes | `git diff` |
| Commit all | `git add . && git commit -m "message"` |
| Push to GitHub | `git push origin main` |
| Pull from GitHub | `git pull origin main` |
| View recent commits | `git log --oneline -10` |
| View unpushed commits | `git log origin/main..HEAD` |

## Monitoring Sync Health

### In Replit

Add this to your Replit startup to see sync status:

```bash
# Add to .bashrc or run manually
echo "🔄 Git Sync Status:"
echo "  Branch: $(git branch --show-current)"
echo "  Uncommitted files: $(git status --short | wc -l)"
echo "  Unpushed commits: $(git log origin/main..HEAD --oneline | wc -l)"
echo "  Last commit: $(git log -1 --format=%cr)"
```

### In GitHub

Check the repository's commit history:
- Navigate to: https://github.com/AltusDD/Replit_Front_End_ECC/commits/main
- Recent commits indicate active sync
- Gaps indicate sync issues

## Support

If you encounter sync issues:
1. Check this guide first
2. Run `npm run sync:check`
3. Review git status and logs
4. Contact the team if stuck

## Appendix: Setting Up Replit for First Time

When cloning this repository in Replit:

1. **Import from GitHub**: Use Replit's "Import from GitHub" feature
2. **Configure Secrets**: Add required environment variables in Replit Secrets
3. **Install Dependencies**: Run `npm install`
4. **Verify Setup**: Run `npm run dev`
5. **Configure Git**: 
   ```bash
   git config user.name "Your Name"
   git config user.email "your.email@example.com"
   ```
6. **Test Push Access**: Make a small change and push to verify access

## Last Updated

This guide was last updated: 2025-10-19

Check for updates regularly as sync processes may evolve.
