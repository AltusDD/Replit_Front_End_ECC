set -e
if git ls-files | grep -E 'src/(ui|components)/Sidebar(\\.old|_backup|)?\\.tsx' ; then
  echo "❌ Deprecated Sidebar present"; exit 1; fi
if git ls-files | grep -Ei 'nav.?config(\\.ts|\\.tsx)$' | grep -v 'src/config/navigation.ts' ; then
  echo "❌ Duplicate nav config present"; exit 1; fi
