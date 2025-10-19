
## Replit ↔ GitHub Synchronization

⚠️ **IMPORTANT**: This repository is actively developed in Replit and must be manually synced to GitHub.

### Quick Sync

```bash
# Check sync status
npm run sync:check

# Commit and push changes
git add .
git commit -m "your commit message"
git push origin main
```

### Best Practices

- **Commit frequently**: After completing each logical unit of work
- **Push daily**: Keep GitHub up-to-date with your Replit workspace
- **Check sync status**: Run `npm run sync:check` regularly
- **Pull before starting**: Always `git pull origin main` before starting work

📖 **Full sync guide**: See [REPLIT_SYNC_GUIDE.md](./REPLIT_SYNC_GUIDE.md) for detailed instructions, troubleshooting, and best practices.

## Recovery & Cleanup

The project includes a backup and cleanup script for maintenance. When changes are made, a snapshot of the project can be taken and stored in the `.archive/` folder with a timestamp. This ensures there is no data loss, and the project can be rolled back easily.

### How to Roll Back
To roll back, decompress the desired ZIP archive from `.archive/` back into the project root.

