// Owner Transfer Service - Complete property ownership transfer system
import { z } from 'zod';
import ExcelJS from 'exceljs';
import { SupabaseClient } from '@supabase/supabase-js';
import { 
  ownerTransfers, 
  ownerTransferSnapshots, 
  auditEvents,
  properties,
  units,
  leases,
  tenants,
  owners,
  workorders,
  type InsertOwnerTransfer,
  type InsertOwnerTransferSnapshot,
  type InsertAuditEvent,
  type OwnerTransfer
} from '../../shared/schema';
import { eq, inArray } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

// Validation schemas
export const InitiateTransferSchema = z.object({
  propertyIds: z.array(z.number()).min(1, 'At least one property must be selected'),
  newOwnerId: z.number().positive('New owner ID is required'),
  effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  notes: z.string().optional(),
  initiatedBy: z.string().optional(),
});

export const ApproveAccountingSchema = z.object({
  transferId: z.number().positive(),
  actorId: z.string().optional(),
});

export const AuthorizeExecutionSchema = z.object({
  transferId: z.number().positive(),
  actorId: z.string().optional(),
});

export const ExecuteTransferSchema = z.object({
  transferId: z.number().positive(),
  dryRun: z.boolean().default(true),
  actorId: z.string().optional(),
});

export type InitiateTransferInput = z.infer<typeof InitiateTransferSchema>;
export type ApproveAccountingInput = z.infer<typeof ApproveAccountingSchema>;
export type AuthorizeExecutionInput = z.infer<typeof AuthorizeExecutionSchema>;
export type ExecuteTransferInput = z.infer<typeof ExecuteTransferSchema>;

export class OwnerTransferService {
  private db: SupabaseClient;
  private reportsDir: string;

  constructor(supabaseClient: SupabaseClient) {
    this.db = supabaseClient;
    this.reportsDir = path.join(process.cwd(), 'reports', 'owner_transfers');
    
    // Ensure reports directory exists
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  async initiateTransfer(input: InitiateTransferInput): Promise<{ transferId: number }> {
    try {
      // Validate input
      const validated = InitiateTransferSchema.parse(input);

      // Check if properties exist and get their current owners
      const { data: existingProperties, error: propertiesError } = await this.db
        .from('properties')
        .select('id, name, owner_id')
        .in('id', validated.propertyIds);

      if (propertiesError) throw new Error(`Failed to fetch properties: ${propertiesError.message}`);
      if (!existingProperties || existingProperties.length !== validated.propertyIds.length) {
        throw new Error('One or more properties not found');
      }

      // Check if new owner exists
      const { data: newOwner, error: ownerError } = await this.db
        .from('owners')
        .select('id, name, company')
        .eq('id', validated.newOwnerId)
        .single();

      if (ownerError) throw new Error(`New owner not found: ${ownerError.message}`);

      // Determine old owner (assuming all properties have the same owner)
      const oldOwnerId = existingProperties[0]?.owner_id;

      // Create transfer record
      const { data: transfer, error: transferError } = await this.db
        .from('owner_transfers')
        .insert({
          property_ids: validated.propertyIds.map(String),
          new_owner_id: validated.newOwnerId,
          old_owner_id: oldOwnerId,
          effective_date: validated.effectiveDate,
          status: 'PENDING_ACCOUNTING',
          notes: validated.notes,
          initiated_by: validated.initiatedBy,
        })
        .select('id')
        .single();

      if (transferError) throw new Error(`Failed to create transfer: ${transferError.message}`);

      const transferId = transfer.id;

      // Log audit event
      await this.logAuditEvent({
        event_type: 'OWNER_TRANSFER_INIT',
        entity_type: 'owner_transfer',
        entity_id: String(transferId),
        actor_id: validated.initiatedBy,
        payload: JSON.stringify({
          propertyIds: validated.propertyIds,
          newOwnerId: validated.newOwnerId,
          oldOwnerId,
          effectiveDate: validated.effectiveDate,
        }),
      });

      // Build entity snapshots
      await this.buildEntitySnapshots(transferId, validated.propertyIds);

      // Log snapshot completion
      await this.logAuditEvent({
        event_type: 'OWNER_TRANSFER_SNAPSHOTS_COMPLETE',
        entity_type: 'owner_transfer',
        entity_id: String(transferId),
        actor_id: validated.initiatedBy,
        payload: JSON.stringify({ snapshotCount: 'completed' }),
      });

      return { transferId };
    } catch (error) {
      await this.logAuditEvent({
        event_type: 'OWNER_TRANSFER_ERROR',
        entity_type: 'owner_transfer',
        entity_id: 'unknown',
        actor_id: input.initiatedBy,
        payload: JSON.stringify({ error: error.message, step: 'initiate' }),
      });
      throw error;
    }
  }

  private async buildEntitySnapshots(transferId: number, propertyIds: number[]) {
    try {
      const snapshots: InsertOwnerTransferSnapshot[] = [];

      // Snapshot properties
      const { data: propertiesData } = await this.db
        .from('properties')
        .select('*')
        .in('id', propertyIds);

      if (propertiesData) {
        propertiesData.forEach(prop => {
          snapshots.push({
            transfer_id: transferId,
            entity_type: 'property',
            entity_id: String(prop.id),
            raw_jsonb: JSON.stringify(prop),
          });
        });
      }

      // Snapshot units for these properties
      const { data: unitsData } = await this.db
        .from('units')
        .select('*')
        .in('property_id', propertyIds);

      if (unitsData) {
        unitsData.forEach(unit => {
          snapshots.push({
            transfer_id: transferId,
            entity_type: 'unit',
            entity_id: String(unit.id),
            raw_jsonb: JSON.stringify(unit),
          });
        });
      }

      // Snapshot leases for these properties
      const { data: leasesData } = await this.db
        .from('leases')
        .select('*')
        .in('property_id', propertyIds);

      if (leasesData) {
        leasesData.forEach(lease => {
          snapshots.push({
            transfer_id: transferId,
            entity_type: 'lease',
            entity_id: String(lease.id),
            raw_jsonb: JSON.stringify(lease),
          });
        });

        // Get tenant IDs from leases and snapshot tenants
        const tenantIds = leasesData
          .filter(lease => lease.tenants && Array.isArray(lease.tenants))
          .flatMap(lease => lease.tenants)
          .filter((id): id is string => typeof id === 'string');

        if (tenantIds.length > 0) {
          const { data: tenantsData } = await this.db
            .from('tenants')
            .select('*')
            .in('id', tenantIds);

          if (tenantsData) {
            tenantsData.forEach(tenant => {
              snapshots.push({
                transfer_id: transferId,
                entity_type: 'tenant',
                entity_id: String(tenant.id),
                raw_jsonb: JSON.stringify(tenant),
              });
            });
          }
        }
      }

      // Snapshot workorders for these properties
      const { data: workordersData } = await this.db
        .from('workorders')
        .select('*')
        .in('property_id', propertyIds);

      if (workordersData) {
        workordersData.forEach(wo => {
          snapshots.push({
            transfer_id: transferId,
            entity_type: 'workorder',
            entity_id: String(wo.id),
            raw_jsonb: JSON.stringify(wo),
          });
        });
      }

      // Insert snapshots in chunks to avoid timeouts
      const chunkSize = 100;
      for (let i = 0; i < snapshots.length; i += chunkSize) {
        const chunk = snapshots.slice(i, i + chunkSize);
        const { error } = await this.db
          .from('owner_transfer_snapshots')
          .insert(chunk);
        
        if (error) throw new Error(`Failed to insert snapshots: ${error.message}`);
      }
    } catch (error) {
      await this.logAuditEvent({
        event_type: 'OWNER_TRANSFER_ERROR',
        entity_type: 'owner_transfer',
        entity_id: String(transferId),
        payload: JSON.stringify({ error: error.message, step: 'snapshots' }),
      });
      throw error;
    }
  }

  async generateAccountingReport(transferId: number): Promise<{ buffer: Buffer; filename: string }> {
    try {
      // Get transfer details
      const { data: transfer, error: transferError } = await this.db
        .from('owner_transfers')
        .select('*, new_owner:owners!new_owner_id(name, company), old_owner:owners!old_owner_id(name, company)')
        .eq('id', transferId)
        .single();

      if (transferError) throw new Error(`Transfer not found: ${transferError.message}`);

      const workbook = new ExcelJS.Workbook();
      const effectiveDate = new Date(transfer.effective_date);

      // Summary Sheet
      const summarySheet = workbook.addWorksheet('Summary');
      summarySheet.columns = [
        { header: 'Item', key: 'item', width: 30 },
        { header: 'Value', key: 'value', width: 40 },
      ];

      summarySheet.addRows([
        { item: 'Transfer ID', value: transferId },
        { item: 'Effective Date', value: transfer.effective_date },
        { item: 'Old Owner', value: (transfer as any).old_owner?.company || (transfer as any).old_owner?.name || 'Unknown' },
        { item: 'New Owner', value: (transfer as any).new_owner?.company || (transfer as any).new_owner?.name || 'Unknown' },
        { item: 'Property Count', value: transfer.property_ids?.length || 0 },
        { item: 'Status', value: transfer.status },
        { item: 'Created', value: new Date(transfer.created_at).toLocaleDateString() },
      ]);

      // Income Sheet (placeholder - would need actual financial data)
      const incomeSheet = workbook.addWorksheet('Income');
      incomeSheet.columns = [
        { header: 'Date', key: 'date', width: 12 },
        { header: 'Property', key: 'property', width: 20 },
        { header: 'Unit', key: 'unit', width: 15 },
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
      ];

      // Expenses Sheet (placeholder)
      const expensesSheet = workbook.addWorksheet('Expenses');
      expensesSheet.columns = [
        { header: 'Date', key: 'date', width: 12 },
        { header: 'Property', key: 'property', width: 20 },
        { header: 'Category', key: 'category', width: 15 },
        { header: 'Description', key: 'description', width: 30 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
      ];

      // Pending Items Sheet
      const pendingSheet = workbook.addWorksheet('Pending');
      pendingSheet.columns = [
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Property', key: 'property', width: 20 },
        { header: 'Description', key: 'description', width: 30 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Due Date', key: 'due_date', width: 12 },
      ];

      // Tenants Sheet
      const tenantsSheet = workbook.addWorksheet('Tenants');
      tenantsSheet.columns = [
        { header: 'Property', key: 'property', width: 20 },
        { header: 'Unit', key: 'unit', width: 15 },
        { header: 'Tenant Name', key: 'tenant_name', width: 25 },
        { header: 'Lease Start', key: 'lease_start', width: 12 },
        { header: 'Lease End', key: 'lease_end', width: 12 },
        { header: 'Monthly Rent', key: 'rent', width: 15 },
        { header: 'Balance Due', key: 'balance', width: 15 },
      ];

      // Get actual tenant data from snapshots
      const { data: snapshots } = await this.db
        .from('owner_transfer_snapshots')
        .select('*')
        .eq('transfer_id', transferId);

      if (snapshots) {
        const leaseSnapshots = snapshots.filter(s => s.entity_type === 'lease');
        const propertySnapshots = snapshots.filter(s => s.entity_type === 'property');
        const unitSnapshots = snapshots.filter(s => s.entity_type === 'unit');

        leaseSnapshots.forEach(snapshot => {
          try {
            const lease = JSON.parse(snapshot.raw_jsonb);
            const property = propertySnapshots.find(p => JSON.parse(p.raw_jsonb).id === lease.property_id);
            const unit = unitSnapshots.find(u => JSON.parse(u.raw_jsonb).id === lease.unit_id);
            
            const propertyName = property ? JSON.parse(property.raw_jsonb).name || 'Unknown' : 'Unknown';
            const unitName = unit ? JSON.parse(unit.raw_jsonb).name || 'Unknown' : 'Unknown';

            tenantsSheet.addRow({
              property: propertyName,
              unit: unitName,
              tenant_name: lease.tenant_name || lease.tenants?.[0] || 'Unknown',
              lease_start: lease.start || lease.start_date || '',
              lease_end: lease.end || lease.end_date || '',
              rent: lease.rent || 0,
              balance: lease.totalBalanceDue || lease.balance_due || lease.outstanding_balance || 0,
            });
          } catch (error) {
            console.error('Error parsing lease snapshot:', error);
          }
        });
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const filename = `owner_transfer_${transferId}.xlsx`;
      const filepath = path.join(this.reportsDir, filename);

      // Save file to disk
      fs.writeFileSync(filepath, buffer);

      // Log audit event
      await this.logAuditEvent({
        event_type: 'OWNER_TRANSFER_REPORT_BUILT',
        entity_type: 'owner_transfer',
        entity_id: String(transferId),
        payload: JSON.stringify({ filename, filepath }),
      });

      return { buffer: Buffer.from(buffer), filename };
    } catch (error) {
      await this.logAuditEvent({
        event_type: 'OWNER_TRANSFER_ERROR',
        entity_type: 'owner_transfer',
        entity_id: String(transferId),
        payload: JSON.stringify({ error: error.message, step: 'report_generation' }),
      });
      throw error;
    }
  }

  async markApprovedByAccounting(input: ApproveAccountingInput): Promise<void> {
    try {
      const validated = ApproveAccountingSchema.parse(input);

      const { error } = await this.db
        .from('owner_transfers')
        .update({ 
          status: 'APPROVED_ACCOUNTING',
          updated_at: new Date().toISOString(),
        })
        .eq('id', validated.transferId)
        .eq('status', 'PENDING_ACCOUNTING'); // Ensure we're in the right state

      if (error) throw new Error(`Failed to approve transfer: ${error.message}`);

      await this.logAuditEvent({
        event_type: 'OWNER_TRANSFER_APPROVE_ACCOUNTING',
        entity_type: 'owner_transfer',
        entity_id: String(validated.transferId),
        actor_id: validated.actorId,
        payload: JSON.stringify({ approved_at: new Date().toISOString() }),
      });
    } catch (error) {
      await this.logAuditEvent({
        event_type: 'OWNER_TRANSFER_ERROR',
        entity_type: 'owner_transfer',
        entity_id: String(input.transferId),
        actor_id: input.actorId,
        payload: JSON.stringify({ error: error.message, step: 'approve_accounting' }),
      });
      throw error;
    }
  }

  async authorizeExecution(input: AuthorizeExecutionInput): Promise<void> {
    try {
      const validated = AuthorizeExecutionSchema.parse(input);

      const { error } = await this.db
        .from('owner_transfers')
        .update({ 
          status: 'READY_EXECUTION',
          updated_at: new Date().toISOString(),
        })
        .eq('id', validated.transferId)
        .eq('status', 'APPROVED_ACCOUNTING'); // Ensure we're in the right state

      if (error) throw new Error(`Failed to authorize transfer: ${error.message}`);

      await this.logAuditEvent({
        event_type: 'OWNER_TRANSFER_AUTHORIZED',
        entity_type: 'owner_transfer',
        entity_id: String(validated.transferId),
        actor_id: validated.actorId,
        payload: JSON.stringify({ authorized_at: new Date().toISOString() }),
      });
    } catch (error) {
      await this.logAuditEvent({
        event_type: 'OWNER_TRANSFER_ERROR',
        entity_type: 'owner_transfer',
        entity_id: String(input.transferId),
        actor_id: input.actorId,
        payload: JSON.stringify({ error: error.message, step: 'authorize_execution' }),
      });
      throw error;
    }
  }

  async executeTransfer(input: ExecuteTransferInput): Promise<{ applied: boolean; summary: any }> {
    try {
      const validated = ExecuteTransferSchema.parse(input);

      // Get transfer details
      const { data: transfer, error: transferError } = await this.db
        .from('owner_transfers')
        .select('*')
        .eq('id', validated.transferId)
        .single();

      if (transferError) throw new Error(`Transfer not found: ${transferError.message}`);

      const summary: any = {
        transferId: validated.transferId,
        dryRun: validated.dryRun,
        propertyIds: transfer.property_ids,
        newOwnerId: transfer.new_owner_id,
        operations: [],
      };

      if (!validated.dryRun) {
        // Update properties in ECC database
        const { error: updateError } = await this.db
          .from('properties')
          .update({ 
            owner_id: transfer.new_owner_id,
            updated_at: new Date().toISOString(),
          })
          .in('id', transfer.property_ids.map(Number));

        if (updateError) throw new Error(`Failed to update properties: ${updateError.message}`);

        summary.operations.push(`Updated ${transfer.property_ids.length} properties with new owner`);

        // DoorLoop integration (if configured)
        if (process.env.DOORLOOP_API_KEY && process.env.DOORLOOP_BASE_URL) {
          await this.performDoorLoopWriteback(transfer, summary);
        } else {
          summary.operations.push('DoorLoop integration skipped (no API credentials)');
        }

        // Mark transfer as complete
        const { error: completeError } = await this.db
          .from('owner_transfers')
          .update({ 
            status: 'COMPLETE',
            executed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', validated.transferId);

        if (completeError) throw new Error(`Failed to mark transfer complete: ${completeError.message}`);

        await this.logAuditEvent({
          event_type: 'OWNER_TRANSFER_COMPLETE',
          entity_type: 'owner_transfer',
          entity_id: String(validated.transferId),
          actor_id: validated.actorId,
          payload: JSON.stringify(summary),
        });

        return { applied: true, summary };
      } else {
        // Dry run - just return what would be done
        summary.operations.push(`Would update ${transfer.property_ids.length} properties with new owner`);
        summary.operations.push('Would perform DoorLoop writeback (if configured)');
        
        await this.logAuditEvent({
          event_type: 'OWNER_TRANSFER_DRY_RUN',
          entity_type: 'owner_transfer',
          entity_id: String(validated.transferId),
          actor_id: validated.actorId,
          payload: JSON.stringify(summary),
        });

        return { applied: false, summary };
      }
    } catch (error) {
      await this.logAuditEvent({
        event_type: 'OWNER_TRANSFER_ERROR',
        entity_type: 'owner_transfer',
        entity_id: String(input.transferId),
        actor_id: input.actorId,
        payload: JSON.stringify({ error: error.message, step: 'execute_transfer' }),
      });
      throw error;
    }
  }

  private async performDoorLoopWriteback(transfer: OwnerTransfer, summary: any) {
    // DoorLoop API integration would go here
    // This is a placeholder for the actual implementation
    const idempotencyKey = `transfer-${transfer.id}-${new Date().toISOString().split('T')[0]}`;
    
    await this.logAuditEvent({
      event_type: 'OWNER_TRANSFER_WRITEBACK',
      entity_type: 'owner_transfer',
      entity_id: String(transfer.id),
      payload: JSON.stringify({
        doorloop_operation: 'update_property_owner',
        idempotency_key: idempotencyKey,
        properties: transfer.property_ids,
        new_owner: transfer.new_owner_id,
      }),
    });

    summary.operations.push(`DoorLoop writeback initiated with key: ${idempotencyKey}`);
  }

  private async logAuditEvent(event: Omit<InsertAuditEvent, 'created_at'>): Promise<void> {
    try {
      await this.db.from('audit_events').insert({
        ...event,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Don't throw here to avoid breaking the main operation
    }
  }

  async getTransferById(transferId: number): Promise<OwnerTransfer | null> {
    const { data, error } = await this.db
      .from('owner_transfers')
      .select('*')
      .eq('id', transferId)
      .single();

    if (error) return null;
    return data;
  }

  async getAuditEvents(transferId: number, limit: number = 10): Promise<any[]> {
    const { data, error } = await this.db
      .from('audit_events')
      .select('*')
      .eq('entity_id', String(transferId))
      .eq('entity_type', 'owner_transfer')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return [];
    return data || [];
  }
}