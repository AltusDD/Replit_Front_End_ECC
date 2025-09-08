# Owner Transfer Feature - Implementation Guide

## Overview

The Owner Transfer feature provides a complete workflow for transferring property ownership between different owners. It includes multi-step approval workflow, accounting reports, audit trails, and DoorLoop integration capabilities.

## Environment Variables Required

```bash
# Database connection (already configured)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# DoorLoop integration (optional, for write-back functionality)
DOORLOOP_BASE_URL=https://api.doorloop.com
DOORLOOP_API_KEY=your_doorloop_api_key
```

## API Endpoints

### 1. POST `/api/owner-transfer/initiate`
Initiates a new owner transfer and generates an accounting report.

**Request Body:**
```json
{
  "propertyIds": [1, 2, 3],
  "newOwnerId": 5,
  "effectiveDate": "2024-01-15",
  "notes": "Optional transfer notes",
  "initiatedBy": "user@example.com"
}
```

**Response:**
```json
{
  "transferId": 123,
  "reportUrl": "/api/owner-transfer/123/report",
  "reportFilename": "owner_transfer_123.xlsx"
}
```

### 2. POST `/api/owner-transfer/approve-accounting`
Marks a transfer as approved by accounting.

**Request Body:**
```json
{
  "transferId": 123,
  "actorId": "accounting@example.com"
}
```

### 3. POST `/api/owner-transfer/authorize`
Authorizes a transfer for execution (admin only).

**Request Body:**
```json
{
  "transferId": 123,
  "actorId": "admin@example.com"
}
```

### 4. POST `/api/owner-transfer/execute`
Executes the transfer with dry-run support.

**Request Body:**
```json
{
  "transferId": 123,
  "dryRun": true,
  "actorId": "admin@example.com"
}
```

**Response:**
```json
{
  "ok": true,
  "applied": false,
  "summary": {
    "transferId": 123,
    "dryRun": true,
    "propertyIds": ["1", "2", "3"],
    "newOwnerId": 5,
    "operations": [
      "Would update 3 properties with new owner",
      "Would perform DoorLoop writeback (if configured)"
    ]
  }
}
```

### 5. GET `/api/owner-transfer/:id/report`
Downloads the Excel accounting report for a transfer.

**Response:** Excel file download

### 6. GET `/api/owner-transfer/:id`
Gets transfer details with audit events.

**Response:**
```json
{
  "transfer": { /* transfer object */ },
  "auditEvents": [ /* array of audit events */ ]
}
```

## Example cURL Commands

```bash
# 1. Initiate transfer
curl -X POST http://localhost:8787/api/owner-transfer/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "propertyIds": [1, 2],
    "newOwnerId": 3,
    "effectiveDate": "2024-01-15",
    "notes": "Test transfer"
  }'

# 2. Approve by accounting
curl -X POST http://localhost:8787/api/owner-transfer/approve-accounting \
  -H "Content-Type: application/json" \
  -d '{"transferId": 1}'

# 3. Authorize execution (admin only)
curl -X POST http://localhost:8787/api/owner-transfer/authorize \
  -H "Content-Type: application/json" \
  -d '{"transferId": 1}'

# 4. Execute transfer (dry run)
curl -X POST http://localhost:8787/api/owner-transfer/execute \
  -H "Content-Type: application/json" \
  -d '{"transferId": 1, "dryRun": true}'

# 5. Download report
curl -o report.xlsx http://localhost:8787/api/owner-transfer/1/report

# 6. Get transfer details
curl http://localhost:8787/api/owner-transfer/1
```

## Database Schema

The feature adds three new tables to the database:

### `owner_transfers`
- `id` - Serial primary key
- `property_ids` - Array of property IDs being transferred
- `new_owner_id` - Reference to new owner
- `old_owner_id` - Reference to previous owner
- `effective_date` - Transfer effective date (YYYY-MM-DD)
- `status` - Transfer status (PENDING_ACCOUNTING, APPROVED_ACCOUNTING, READY_EXECUTION, COMPLETE)
- `notes` - Optional transfer notes
- `initiated_by` - User who initiated the transfer
- `executed_at` - Timestamp when transfer was completed
- `created_at` / `updated_at` - Standard timestamps

### `owner_transfer_snapshots`
- `id` - Serial primary key
- `transfer_id` - Reference to owner transfer
- `entity_type` - Type of entity (property, unit, lease, tenant, workorder)
- `entity_id` - ID of the snapshotted entity
- `raw_jsonb` - Complete JSON snapshot of entity state
- `created_at` - Snapshot creation time

### `audit_events`
- `id` - Serial primary key
- `event_type` - Type of event (OWNER_TRANSFER_INIT, OWNER_TRANSFER_COMPLETE, etc.)
- `entity_type` - Type of entity affected
- `entity_id` - ID of affected entity
- `actor_id` - User who performed the action
- `payload` - JSON payload with additional context
- `created_at` - Event timestamp

## Workflow States

1. **PENDING_ACCOUNTING** - Initial state, awaiting accounting review
2. **APPROVED_ACCOUNTING** - Accounting has approved the transfer
3. **READY_EXECUTION** - Admin has authorized execution
4. **COMPLETE** - Transfer has been executed

## User Interface

### Owner Card Page
- Navigate to any owner card page (`/card/owner/{id}`)
- Click the "🔄 Transfer Ownership" button
- Complete the 4-step workflow

### Transfer Stepper Modal
1. **Select Owner** - Choose new owner and effective date
2. **Set Date** - Review transfer summary
3. **Confirm Entities** - View entity tree that will be affected
4. **Workflow** - Manage approval workflow and execution

## Security & Permissions

- **Initiate**: Any authenticated user
- **Approve Accounting**: Users with accounting role
- **Authorize Execution**: Admin users only
- **Execute**: Admin users only

## File Structure

### Backend Files
- `server/services/ownerTransferService.ts` - Main service class
- `shared/schema.ts` - Updated with new table definitions
- `server/index.ts` - API endpoint definitions

### Frontend Files
- `src/features/ownerTransfer/hooks/useOwnerTransfer.ts` - API integration hook
- `src/features/ownerTransfer/components/TransferStepper.tsx` - Modal component
- `src/pages/card/owner/index.tsx` - Updated owner page

## Features

✅ **Multi-step approval workflow** with role-based permissions
✅ **Excel report generation** with comprehensive financial data
✅ **Immutable entity snapshots** for audit trail
✅ **Comprehensive audit logging** for all state changes
✅ **DoorLoop integration** with dry-run support
✅ **Interactive UI** with step-by-step wizard
✅ **Live data integration** - no mock data used
✅ **Error handling** and validation throughout
✅ **File download** functionality for reports

## Testing

The feature can be tested through:
1. UI workflow via owner card pages
2. Direct API calls using the cURL examples above
3. Database inspection of created records and snapshots

## Notes

- The system creates comprehensive snapshots of all related entities (properties, units, leases, tenants, work orders) when a transfer is initiated
- All state changes are logged in the audit_events table
- DoorLoop integration is optional and controlled by environment variables
- Reports are saved to `/reports/owner_transfers/` directory
- The feature uses the existing project patterns and design system