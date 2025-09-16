#!/bin/bash

echo "🔧 Owner Transfer Verification Script"
echo "===================================="

# Run the migration
echo "📦 Running migration..."
npx tsx tools/ownerTransfer.migrate.ts

if [ $? -ne 0 ]; then
    echo "❌ Migration failed!"
    exit 1
fi

echo "✅ Migration completed successfully"
echo ""

# Print schema summary
echo "📋 Schema Summary:"
echo "=================="

if [ -z "$DATABASE_URL" ] && [ -z "$SUPABASE_DB_URL" ]; then
    echo "❌ No DATABASE_URL or SUPABASE_DB_URL found"
    exit 1
else
    echo "✅ DATABASE_URL is present"
fi

echo ""
echo "📊 Table Structure:"
psql "${DATABASE_URL:-$SUPABASE_DB_URL}" -c "\d owner_transfers" 2>/dev/null || echo "⚠️  Could not describe owner_transfers table"
psql "${DATABASE_URL:-$SUPABASE_DB_URL}" -c "\d owner_transfer_audit" 2>/dev/null || echo "⚠️  Could not describe owner_transfer_audit table"

# Test API endpoints if transfer ID exists
if [ -f "tools/.last_transfer_id" ]; then
    TRANSFER_ID=$(cat tools/.last_transfer_id)
    echo ""
    echo "🧪 Testing API with transfer ID: $TRANSFER_ID"
    echo "============================================="
    
    # Test GET endpoint
    echo "📥 GET /api/owner-transfer/$TRANSFER_ID"
    curl -s "http://localhost:8787/api/owner-transfer/$TRANSFER_ID" | jq . 2>/dev/null || curl -s "http://localhost:8787/api/owner-transfer/$TRANSFER_ID"
    echo ""
    
    # Test POST audit endpoint
    echo "📤 POST /api/owner-transfer/$TRANSFER_ID/audit"
    curl -s -X POST "http://localhost:8787/api/owner-transfer/$TRANSFER_ID/audit" \
        -H "Content-Type: application/json" \
        -d '{"action": "test_verification", "actor": "verification_script", "detail": {"timestamp": "'$(date -Iseconds)'"}}' | \
        jq . 2>/dev/null || curl -s -X POST "http://localhost:8787/api/owner-transfer/$TRANSFER_ID/audit" \
        -H "Content-Type: application/json" \
        -d '{"action": "test_verification", "actor": "verification_script", "detail": {"timestamp": "'$(date -Iseconds)'"}}'
    echo ""
else
    echo "ℹ️  No .last_transfer_id found - no API testing"
fi

echo ""
echo "🎉 Verification completed!"
echo "========================="
echo "Database: $([ -n "$DATABASE_URL" ] && echo "DATABASE_URL" || echo "SUPABASE_DB_URL") ✓"
echo "Migration: ✓"
echo "$([ -f "tools/.last_transfer_id" ] && echo "Seeded transfer: $(cat tools/.last_transfer_id) ✓" || echo "No seed data")"