#!/bin/bash

# Replit Daily Sync Reminder
# Add this to your Replit .bashrc to get reminded about syncing

# Only show on interactive shells
if [ -t 1 ]; then
  # Check if we've shown the reminder today
  REMINDER_FILE=".local/state/last_sync_reminder"
  TODAY=$(date +%Y-%m-%d)
  
  mkdir -p "$(dirname "$REMINDER_FILE")"
  
  if [ ! -f "$REMINDER_FILE" ] || [ "$(cat "$REMINDER_FILE" 2>/dev/null)" != "$TODAY" ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo "🔄 REPLIT SYNC REMINDER"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "Don't forget to push your changes to GitHub!"
    echo ""
    echo "Quick sync:"
    echo "  git add . && git commit -m 'your message' && git push"
    echo ""
    echo "Check sync status:"
    echo "  npm run sync:check"
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo ""
    
    # Mark reminder as shown for today
    echo "$TODAY" > "$REMINDER_FILE"
  fi
fi
