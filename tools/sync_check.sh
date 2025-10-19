#!/bin/bash

# Replit ↔ GitHub Sync Status Checker
# Run this to check if your Replit workspace is in sync with GitHub

set -e

echo "🔄 Replit ↔ GitHub Sync Status Check"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track issues
ISSUES=0

# 1. Check current branch
echo "📍 Current Branch"
BRANCH=$(git branch --show-current)
echo "  Branch: ${BLUE}${BRANCH}${NC}"
if [ "$BRANCH" != "main" ]; then
  echo "  ${YELLOW}⚠️  You're not on 'main' branch${NC}"
  ((ISSUES++))
else
  echo "  ${GREEN}✅ On main branch${NC}"
fi
echo ""

# 2. Check for uncommitted changes
echo "📝 Uncommitted Changes"
UNCOMMITTED=$(git status --short | wc -l)
if [ "$UNCOMMITTED" -gt 0 ]; then
  echo "  ${RED}❌ $UNCOMMITTED files have uncommitted changes${NC}"
  echo ""
  echo "  Modified files:"
  git status --short | head -10
  if [ "$UNCOMMITTED" -gt 10 ]; then
    echo "  ... and $((UNCOMMITTED - 10)) more"
  fi
  ((ISSUES++))
else
  echo "  ${GREEN}✅ No uncommitted changes${NC}"
fi
echo ""

# 3. Check for unpushed commits
echo "📤 Unpushed Commits"
# Fetch latest from remote
git fetch origin --quiet 2>/dev/null || echo "  ${YELLOW}⚠️  Could not fetch from remote${NC}"

UNPUSHED=$(git log origin/$BRANCH..$BRANCH --oneline 2>/dev/null | wc -l)
if [ "$UNPUSHED" -gt 0 ]; then
  echo "  ${RED}❌ $UNPUSHED commits waiting to be pushed${NC}"
  echo ""
  echo "  Unpushed commits:"
  git log origin/$BRANCH..$BRANCH --oneline --format="    %h %s" | head -10
  if [ "$UNPUSHED" -gt 10 ]; then
    echo "    ... and $((UNPUSHED - 10)) more"
  fi
  ((ISSUES++))
else
  echo "  ${GREEN}✅ All commits are pushed${NC}"
fi
echo ""

# 4. Check last commit date
echo "🕒 Last Commit"
LAST_COMMIT_DATE=$(git log -1 --format=%cd --date=relative)
LAST_COMMIT_DAYS=$(git log -1 --format=%cd --date=short)
LAST_COMMIT_MSG=$(git log -1 --format=%s)
echo "  Date: ${BLUE}${LAST_COMMIT_DATE}${NC} (${LAST_COMMIT_DAYS})"
echo "  Message: ${LAST_COMMIT_MSG}"

# Check if it's been too long
DAYS_SINCE=$(( ($(date +%s) - $(git log -1 --format=%ct)) / 86400 ))
if [ "$DAYS_SINCE" -gt 7 ]; then
  echo "  ${YELLOW}⚠️  It's been ${DAYS_SINCE} days since last commit${NC}"
  ((ISSUES++))
elif [ "$DAYS_SINCE" -gt 3 ]; then
  echo "  ${YELLOW}⚠️  It's been ${DAYS_SINCE} days since last commit - consider syncing${NC}"
fi
echo ""

# 5. Check if local is behind remote
echo "📥 Remote Changes"
BEHIND=$(git log $BRANCH..origin/$BRANCH --oneline 2>/dev/null | wc -l)
if [ "$BEHIND" -gt 0 ]; then
  echo "  ${YELLOW}⚠️  Your local branch is ${BEHIND} commits behind remote${NC}"
  echo "  Run: ${BLUE}git pull origin $BRANCH${NC}"
  ((ISSUES++))
else
  echo "  ${GREEN}✅ Up to date with remote${NC}"
fi
echo ""

# 6. Summary
echo "📊 Summary"
echo "=========="
if [ "$ISSUES" -eq 0 ]; then
  echo "${GREEN}✅ Everything is in sync!${NC}"
  echo ""
  echo "Your Replit workspace is fully synchronized with GitHub."
else
  echo "${RED}❌ Found $ISSUES sync issue(s)${NC}"
  echo ""
  echo "📖 Quick fixes:"
  
  if [ "$UNCOMMITTED" -gt 0 ]; then
    echo "  • Commit changes: ${BLUE}git add . && git commit -m 'your message'${NC}"
  fi
  
  if [ "$UNPUSHED" -gt 0 ]; then
    echo "  • Push commits: ${BLUE}git push origin $BRANCH${NC}"
  fi
  
  if [ "$BEHIND" -gt 0 ]; then
    echo "  • Pull updates: ${BLUE}git pull origin $BRANCH${NC}"
  fi
  
  echo ""
  echo "📚 For detailed help, see: REPLIT_SYNC_GUIDE.md"
fi
echo ""

# 7. Recommendations
echo "💡 Recommendations"
echo "=================="
echo "  • Commit changes at least daily"
echo "  • Push to GitHub after each commit"
echo "  • Pull from GitHub before starting work"
echo "  • Run this check: ${BLUE}npm run sync:check${NC}"
echo ""

exit $ISSUES
