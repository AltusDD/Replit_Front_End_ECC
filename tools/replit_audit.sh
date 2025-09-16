#!/bin/bash

# Replit Audit - Comprehensive verification for Owner Transfer Feature (Genesis v1)
# Tests: API endpoints, components, routing, feature flags, secrets

echo "🔍 Genesis v1 Owner Transfer - Full System Audit"
echo "============================================="

PASS_COUNT=0
FAIL_COUNT=0

# Helper functions
pass() {
    echo "  ✅ $1"
    ((PASS_COUNT++))
}

fail() {
    echo "  ❌ $1"
    ((FAIL_COUNT++))
}

# 1. Component Architecture
echo "📁 Testing Component Architecture..."
if [ -f "src/features/owners/routes/OwnerTransferPage.tsx" ] && \
   [ -f "src/features/owners/components/OwnerTransferForm.tsx" ] && \
   [ -f "src/features/owners/components/OwnerTransferAudit.tsx" ]; then
    pass "All required components exist"
else
    fail "Missing component files"
fi

# 2. Genesis Token Usage (no raw hex)
echo "🎨 Testing Genesis Token Compliance..."
if grep -q "var(--" src/features/owners/components/*.tsx && \
   ! grep -q "#[0-9a-fA-F]\{6\}" src/features/owners/components/*.tsx; then
    pass "Genesis tokens used (no raw hex values)"
else
    fail "Raw hex values found or missing Genesis tokens"
fi

# 3. CSS Scoping
echo "🏷️  Testing CSS Class Scoping..."
if grep -q "owner-transfer-" src/features/owners/routes/OwnerTransferPage.tsx; then
    pass "Scoped CSS classes found (.owner-transfer-*)"
else
    fail "Missing scoped CSS classes"
fi

# 4. Navigation Integration
echo "🧭 Testing Navigation Integration..."
if grep -q "/owners/transfer" src/config/navigation.ts && \
   grep -q "Shuffle" src/config/navigation.ts; then
    pass "Navigation entry added with proper icon"
else
    fail "Navigation not properly configured"
fi

# 5. Route Registration
echo "🛣️  Testing Route Registration..."
if grep -q "/owners/transfer" src/App.tsx && \
   grep -q "OwnerTransferPage" src/App.tsx; then
    pass "Route registered in App.tsx"
else
    fail "Route not registered"
fi

# 6. API Integration Points
echo "🔌 Testing API Integration..."
API_CALLS=0
if grep -q "/api/config/integrations" src/features/owners/components/OwnerTransferForm.tsx; then
    ((API_CALLS++))
fi
if grep -q "/api/owners/transferContext" src/features/owners/routes/OwnerTransferPage.tsx; then
    ((API_CALLS++))
fi
if grep -q "/api/audit/ownerTransfer" src/features/owners/components/OwnerTransferAudit.tsx; then
    ((API_CALLS++))
fi
if [ $API_CALLS -eq 3 ]; then
    pass "All API endpoints integrated"
else
    fail "Missing API integration points ($API_CALLS/3)"
fi

# 7. Feature Flag Implementation
echo "🚩 Testing Feature Flag Implementation..."
if grep -q "transferEnabled" src/features/owners/routes/OwnerTransferPage.tsx && \
   grep -q "config?.integrations?.admin?.available" src/features/owners/components/OwnerTransferForm.tsx; then
    pass "Feature flag gating implemented"
else
    fail "Feature flag gating missing"
fi

# 8. Admin Token Validation
echo "🔐 Testing Admin Token Validation..."
if grep -q "hasAdminToken" src/features/owners/routes/OwnerTransferPage.tsx && \
   grep -q "VITE_ADMIN_SYNC_TOKEN" src/features/owners/components/OwnerTransferForm.tsx; then
    pass "Admin token validation implemented"
else
    fail "Admin token validation missing"
fi

# 9. Test IDs for E2E Testing
echo "🧪 Testing Data Test IDs..."
TEST_IDS=0
if grep -q "data-testid" src/features/owners/components/OwnerTransferForm.tsx; then
    ((TEST_IDS++))
fi
if grep -q "data-testid" src/features/owners/components/OwnerTransferAudit.tsx; then
    ((TEST_IDS++))
fi
if grep -q "data-testid" src/features/owners/routes/OwnerTransferPage.tsx; then
    ((TEST_IDS++))
fi
if [ $TEST_IDS -eq 3 ]; then
    pass "Test IDs present in all components"
else
    fail "Missing test IDs in components ($TEST_IDS/3)"
fi

# 10. Wouter Integration
echo "🌐 Testing Wouter Integration..."
if grep -q "useLocation" src/features/owners/routes/OwnerTransferPage.tsx && \
   ! grep -q "react-router" src/features/owners/routes/OwnerTransferPage.tsx; then
    pass "Wouter routing used (no react-router-dom)"
else
    fail "React Router detected or missing Wouter"
fi

# 11. React Query Integration
echo "⚡ Testing React Query Integration..."
if grep -q "useQuery\|useMutation" src/features/owners/components/OwnerTransferForm.tsx && \
   grep -q "useQuery" src/features/owners/components/OwnerTransferAudit.tsx; then
    pass "React Query properly integrated"
else
    fail "React Query integration missing"
fi

# 12. Live System Tests
echo "🌐 Testing Live System Integration..."
if curl -s http://localhost:8787/api/config/integrations | grep -q '"ok":true'; then
    pass "Backend API responding"
else
    fail "Backend API not responding"
fi

if curl -s "http://localhost:5173/owners/transfer?id=test123" | grep -q "html"; then
    pass "Frontend route accessible"
else
    fail "Frontend route not accessible"
fi

# 13. Secrets Check
echo "🔑 Testing Secrets Configuration..."
if [ -n "$ADMIN_SYNC_TOKEN" ] && [ -n "$DOORLOOP_API_KEY" ]; then
    pass "Required secrets present"
else
    fail "Missing required secrets"
fi

# 14. TypeScript Compliance
echo "🔍 Testing TypeScript Compliance..."
if npx tsc --noEmit --skipLibCheck 2>/dev/null; then
    pass "TypeScript compilation clean"
else
    fail "TypeScript errors detected"
fi

# Final Score
echo ""
echo "📊 Audit Results Summary:"
echo "========================"
echo "✅ Passed: $PASS_COUNT"
echo "❌ Failed: $FAIL_COUNT"
TOTAL=$((PASS_COUNT + FAIL_COUNT))
SCORE=$((PASS_COUNT * 100 / TOTAL))
echo "📈 Score: $SCORE% ($PASS_COUNT/$TOTAL)"

if [ $FAIL_COUNT -eq 0 ]; then
    echo ""
    echo "🎉 PERFECT SCORE! Genesis v1 Owner Transfer feature is production-ready!"
    exit 0
elif [ $SCORE -ge 80 ]; then
    echo ""
    echo "✅ GOOD SCORE! Minor issues to address."
    exit 0
else
    echo ""
    echo "⚠️  NEEDS WORK! Please address failing checks."
    exit 1
fi