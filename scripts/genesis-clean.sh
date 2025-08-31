
#!/bin/bash
set -euo pipefail

TIMESTAMP=$(date "+%Y%m%d-%H%M%S")
ARCHIVE_DIR=".archive/${TIMESTAMP}"
mkdir -p "${ARCHIVE_DIR}"

# Move backups and temporary files to .archive
mv *_backup_*/ "${ARCHIVE_DIR}/" || true
mv temp_extract/ "${ARCHIVE_DIR}/" || true
mv .repl-backups/ "${ARCHIVE_DIR}/" || true
mv attached_assets/ "${ARCHIVE_DIR}/" || true

# Zip the full project snapshot (excluding node_modules and .git)
zip -r "${ARCHIVE_DIR}/estatecommand-snapshot-${TIMESTAMP}.zip" ./ -x "node_modules/*" ".git/*"

# Remove known junk and legacy files
rm -rf dist build .cache .vite coverage || true
find src/components -name "Sidebar*.old*" -o -name "sidebar-old*" -o -name "Sidebar__*" -exec rm -rf {} +
find src/styles -name "nav.css__*" -o -name "*old*.css" -exec rm -rf {} + 

echo "Cleanup complete. Archived to: ${ARCHIVE_DIR}"
