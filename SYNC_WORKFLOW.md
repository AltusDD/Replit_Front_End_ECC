# Replit ↔ GitHub Sync Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    REPLIT DEVELOPMENT ENVIRONMENT                    │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Developer Working on Code                                  │    │
│  │  • Edit files in Replit IDE                                │    │
│  │  • Test with npm run dev                                   │    │
│  │  • Preview in Replit's web view                           │    │
│  └────────────────┬───────────────────────────────────────────┘    │
│                   │                                                  │
│                   ▼                                                  │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Check Sync Status                                         │    │
│  │  $ npm run sync:check                                      │    │
│  │  Shows: uncommitted changes, unpushed commits, etc.       │    │
│  └────────────────┬───────────────────────────────────────────┘    │
│                   │                                                  │
│                   ▼                                                  │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Git Operations (MANUAL)                                   │    │
│  │  $ git add .                                               │    │
│  │  $ git commit -m "feat: description"                      │    │
│  │  $ git push origin main                                    │    │
│  └────────────────┬───────────────────────────────────────────┘    │
│                   │                                                  │
└───────────────────┼──────────────────────────────────────────────────┘
                    │
                    │ PUSH (Manual)
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         GITHUB REPOSITORY                            │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Main Branch                                               │    │
│  │  • Receives commits from Replit                           │    │
│  │  • Source of truth for production                         │    │
│  └────────────────┬───────────────────────────────────────────┘    │
│                   │                                                  │
│                   ▼                                                  │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  GitHub Actions Workflows                                  │    │
│  │  • CodeQL (security scanning)                             │    │
│  │  • Verify (linting, type checking, build)                │    │
│  │  • Deploy (Azure Functions)                              │    │
│  │  • Sync Check (daily monitoring) ← NEW!                  │    │
│  └────────────────┬───────────────────────────────────────────┘    │
│                   │                                                  │
│                   ▼                                                  │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Automated Monitoring                                      │    │
│  │  • Checks for commits daily                               │    │
│  │  • Creates issue if no commits for 7+ days               │    │
│  │  • Auto-closes issue when commits resume                 │    │
│  └────────────────┬───────────────────────────────────────────┘    │
│                   │                                                  │
└───────────────────┼──────────────────────────────────────────────────┘
                    │
                    │ PULL (Manual - before starting work)
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    REPLIT (Sync from GitHub)                        │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  $ git pull origin main                                    │    │
│  │  Gets latest changes from GitHub                          │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

## Key Points

### ✅ What Happens Automatically

1. **GitHub Actions run on every push**:
   - Security scanning (CodeQL)
   - Code quality checks (ESLint, TypeScript)
   - Build verification
   - Deployment to Azure

2. **Daily sync monitoring**:
   - Checks if repository is stale (7+ days without commits)
   - Creates GitHub issues as reminders
   - Auto-closes issues when syncs resume

3. **Data syncs** (separate from code):
   - DoorLoop owners sync (every 6 hours)
   - Database operations (Supabase)

### ❌ What Requires Manual Action

1. **Committing changes in Replit**:
   - `git add .`
   - `git commit -m "message"`
   - `git push origin main`

2. **Pulling updates from GitHub**:
   - `git pull origin main`
   - (Do this before starting work each day)

3. **Resolving merge conflicts**:
   - If changes conflict, must manually resolve

## Daily Developer Workflow

```
Morning:
┌─────────────┐
│ git pull    │ ← Get latest from GitHub
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ npm run dev      │ ← Start development
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│ Make code changes    │ ← Write code
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ npm run sync:check   │ ← Check status
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────┐
│ git add . && git commit      │ ← Commit work
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────┐
│ git push origin main │ ← Push to GitHub
└──────────────────────┘
       │
       └──► Repeat for each feature/fix
```

## Sync Health Indicators

### 🟢 Healthy Sync
- Commits to GitHub daily or at least weekly
- No uncommitted changes pile up
- Regular use of `npm run sync:check`
- No sync-reminder issues on GitHub

### 🟡 Needs Attention
- 3-7 days without commits
- Small amount of uncommitted changes
- Occasional sync reminder issues

### 🔴 Sync Problem
- 7+ days without commits
- Many uncommitted changes
- Multiple sync reminder issues
- Developers not aware of sync status

## Monitoring Points

1. **In Replit**: Run `npm run sync:check` daily
2. **On GitHub**: Check commit history weekly
3. **GitHub Issues**: Respond to sync-reminder issues
4. **GitHub Actions**: Review workflow runs

## Support Resources

- 📖 [REPLIT_SYNC_GUIDE.md](./REPLIT_SYNC_GUIDE.md) - Full sync guide
- 🔧 [REPLIT_SETUP.md](./REPLIT_SETUP.md) - Developer setup
- 📊 [SYNC_STATUS.md](./SYNC_STATUS.md) - Current status & action items
- 🛠️ `npm run sync:check` - Automated status check

---

**Key Takeaway**: Sync is MANUAL but now has TOOLS and MONITORING to prevent gaps.
