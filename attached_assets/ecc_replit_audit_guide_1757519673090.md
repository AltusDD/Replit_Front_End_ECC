# ECC_Replit_Full_Audit_Guide.md

## 🎯 Goal
Enable a full audit of all Replit Agent actions (past and current) to:
- Detect what *was done*, *what was skipped*, and *what drifted*.
- Auto-report mismatches between your prompts and actual code results.
- Guide you in producing a high-quality, fix-everything Replit prompt (Genesis grade).

---

## 🔍 What This Covers

- 📋 Parsing previous Replit task `.md` files
- 🧠 Extracting your intent vs code reality
- 🧰 Running verifications (code, shell, UI, API)
- 🧨 Flagging drift or missing work
- 🛠 Options for remediating (automated vs safe prompts)

---

## 🛠 Shell Script: Full Agent Audit
Paste and run this in Replit:

```bash
#!/bin/bash

mkdir -p tools
cat > tools/replit_audit.sh <<'EOF'
#!/bin/bash
set -e

echo "[ECC AUDIT] Starting Full Replit Agent Audit..."

# 1. Check Enhancer Mounts
find src/features -name "*Enhancer.tsx" | while read f; do
  name=$(basename "$f")
  grep -q "$name" src/boot/mountEnhancer.tsx && echo "✅ Mounted: $name" || echo "❌ Unmounted: $name"
done

# 2. Check Public Index Bootloader
if grep -q 'script type="module"' public/index.html; then
  echo "✅ index.html script module present"
else
  echo "❌ index.html missing script module fallback"
fi

# 3. Validate API Integration Flags
curl -s http://localhost:3000/api/config/integrations | jq '.' || echo "❌ /api/config/integrations failed"

# 4. Check Feature Flags in Enhancers
rg 'if.*features?.*\.' src/features | grep -v node_modules || echo "🔍 No feature flag checks found"

# 5. Uncommitted Files
git status --short || echo "✅ All changes committed"

# 6. Grep for ECC UI Signature
rg 'ECC Enhancer Active' src || echo "❌ ECC UI Signature missing"

# 7. Check Common Entry Routes
for path in lease property unit tenant owner; do
  if rg "/card/$path/" src/features; then
    echo "✅ Route $path found in UI"
  else
    echo "❌ Route $path missing"
  fi
  curl -sf "http://localhost:3000/card/$path/testid" >/dev/null && echo "✅ $path route served" || echo "⚠️ $path route unreachable"
done

# 8. Secrets Visibility
for key in M365_TOKEN DROPBOX_KEY DOORLOOP_API CORELOGIC_TOKEN; do
  if [[ -z "${!key}" ]]; then echo "🔒 $key MISSING"; else echo "✅ $key present"; fi
done

echo "[✔] ECC Replit Audit Complete"
EOF

chmod +x tools/replit_audit.sh
bash tools/replit_audit.sh
```

---

## 🧠 What This Tells You

After running:
- You’ll see what enhancer files are unmounted.
- Whether the boot script was injected.
- Which UI blocks are unreachable or unstylized.
- What integrations are disabled by missing secrets.
- If Replit committed anything it changed.

---

## 🤖 Can Replit Fix This Automatically?

### ⚠️ Partial Automation Is Safe — But Not Full Auto-Correction
Replit Agent **can**:
- Remount unmounted enhancers
- Reinject boot script
- Patch missing fallback guards

But it **should not blindly re-edit** all files without:
- Controlled prompts
- Manual QA after shell verification

---

## 📣 How to Write a Genesis-Grade Prompt from Audit

```md
## Task
Fix all outstanding issues found in audit:

- Mount all enhancers found in `src/features` but not listed in `mountEnhancer.tsx`
- Inject script module bootloader into `public/index.html` if missing
- Add visual fallback for enhancer loads that return 404
- Include feature flag gates for planner, dropbox, etc.

## Shell patch must:
- Re-run `tools/replit_audit.sh` and verify fixes
- Recommit changes and show diff summary

## QA
- Screenshot of each /card/* route
- curl output from /api/config/integrations
- Audit report output pasted
```

---

## ✅ Pro Tips

- Always keep a `tools/replit_task.md` for each change.
- Use the audit script before and after major prompts.
- Keep git clean between prompts to isolate drift.
- Combine `audit.sh + guard.sh + verify.sh` for full CI loop.

---

End of ECC_Replit_Full_Audit_Guide.md

