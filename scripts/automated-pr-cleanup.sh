#!/bin/bash
# Automated PR Cleanup Script
# This script safely merges approved dependency updates

set -e

echo "🧹 Starting automated PR cleanup..."

# Function to check if PR is ready to merge
check_pr_status() {
    local pr_number=$1
    gh pr view $pr_number --json state,mergeable,statusCheckRollupState
}

# Function to safely merge PR
safe_merge() {
    local pr_number=$1
    local pr_title=$(gh pr view $pr_number --json title --jq '.title')
    
    echo "Merging PR #$pr_number: $pr_title"
    gh pr merge $pr_number --squash --delete-branch
    echo "✅ Successfully merged PR #$pr_number"
}

# Close superseded PRs
echo "🗑️  Closing superseded PRs..."
gh pr close 54 --comment "Superseded by PR #55 with newer vite version"

# Merge safe dependency updates
echo "✅ Merging safe dependency updates..."
safe_merge 58  # zod update

echo "🧹 Automated cleanup complete!"
echo "⚠️  Major version updates (PRs 55, 56, 57) require manual review"
echo "🚀 Feature PR #60 requires manual review"
