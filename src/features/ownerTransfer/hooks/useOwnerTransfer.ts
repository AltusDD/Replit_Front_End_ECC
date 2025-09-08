// Owner Transfer Hook - API interactions for owner transfer functionality
import { useState } from 'react';
import { fetchJSON } from '../../../utils/net';
import { z } from 'zod';
import type { OwnerTransfer, AuditEvent } from '../../../../shared/schema';

// Validation schemas (matching backend)
const InitiateTransferSchema = z.object({
  propertyIds: z.array(z.number()).min(1, 'At least one property must be selected'),
  newOwnerId: z.number().positive('New owner ID is required'),
  effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  notes: z.string().optional(),
  initiatedBy: z.string().optional(),
});

const ApproveAccountingSchema = z.object({
  transferId: z.number().positive(),
  actorId: z.string().optional(),
});

const AuthorizeExecutionSchema = z.object({
  transferId: z.number().positive(),
  actorId: z.string().optional(),
});

const ExecuteTransferSchema = z.object({
  transferId: z.number().positive(),
  dryRun: z.boolean().default(true),
  actorId: z.string().optional(),
});

// Types for inputs
export type InitiateTransferInput = z.infer<typeof InitiateTransferSchema>;
export type ApproveAccountingInput = z.infer<typeof ApproveAccountingSchema>;
export type AuthorizeExecutionInput = z.infer<typeof AuthorizeExecutionSchema>;
export type ExecuteTransferInput = z.infer<typeof ExecuteTransferSchema>;

// API response types
export interface InitiateTransferResponse {
  transferId: number;
  reportUrl: string;
  reportFilename: string;
}

export interface ExecuteTransferResponse {
  ok: boolean;
  applied: boolean;
  summary: {
    transferId: number;
    dryRun: boolean;
    propertyIds: string[];
    newOwnerId: number;
    operations: string[];
  };
}

export interface TransferDetailsResponse {
  transfer: OwnerTransfer;
  auditEvents: AuditEvent[];
}

// Hook state types
export interface OwnerTransferState {
  loading: boolean;
  error: string | null;
}

// Permission checking (placeholder for now)
export function canAuthorize(): boolean {
  // TODO: Implement proper role checking based on user context
  // For now, return true to allow testing
  return true;
}

export function useOwnerTransfer() {
  const [state, setState] = useState<OwnerTransferState>({
    loading: false,
    error: null,
  });

  // Helper to handle API calls with consistent error handling
  const makeApiCall = async <T>(
    apiCall: () => Promise<T>,
    errorContext: string
  ): Promise<T | null> => {
    setState({ loading: true, error: null });
    
    try {
      const result = await apiCall();
      setState({ loading: false, error: null });
      return result;
    } catch (error: any) {
      const errorMessage = error?.message || `Failed to ${errorContext}`;
      setState({ loading: false, error: errorMessage });
      console.error(`Owner Transfer Error (${errorContext}):`, error);
      return null;
    }
  };

  // Initiate transfer
  const initiateTransfer = async (input: InitiateTransferInput): Promise<InitiateTransferResponse | null> => {
    // Validate input
    try {
      InitiateTransferSchema.parse(input);
    } catch (e: any) {
      setState({ loading: false, error: e.errors?.[0]?.message || 'Invalid input data' });
      return null;
    }

    return makeApiCall(
      async () => {
        const response = await fetch('/api/owner-transfer/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return response.json() as InitiateTransferResponse;
      },
      'initiate transfer'
    );
  };

  // Mark approved by accounting
  const approveAccounting = async (input: ApproveAccountingInput): Promise<boolean> => {
    try {
      ApproveAccountingSchema.parse(input);
    } catch (e: any) {
      setState({ loading: false, error: e.errors?.[0]?.message || 'Invalid input data' });
      return false;
    }

    const result = await makeApiCall(
      async () => {
        const response = await fetch('/api/owner-transfer/approve-accounting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return response.json() as { ok: boolean; message: string };
      },
      'approve by accounting'
    );

    return result?.ok || false;
  };

  // Authorize execution
  const authorizeExecution = async (input: AuthorizeExecutionInput): Promise<boolean> => {
    try {
      AuthorizeExecutionSchema.parse(input);
    } catch (e: any) {
      setState({ loading: false, error: e.errors?.[0]?.message || 'Invalid input data' });
      return false;
    }

    const result = await makeApiCall(
      async () => {
        const response = await fetch('/api/owner-transfer/authorize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return response.json() as { ok: boolean; message: string };
      },
      'authorize execution'
    );

    return result?.ok || false;
  };

  // Execute transfer
  const executeTransfer = async (input: ExecuteTransferInput): Promise<ExecuteTransferResponse | null> => {
    try {
      ExecuteTransferSchema.parse(input);
    } catch (e: any) {
      setState({ loading: false, error: e.errors?.[0]?.message || 'Invalid input data' });
      return null;
    }

    return makeApiCall(
      async () => {
        const response = await fetch('/api/owner-transfer/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return response.json() as ExecuteTransferResponse;
      },
      'execute transfer'
    );
  };

  // Get transfer details
  const getTransferDetails = async (transferId: number): Promise<TransferDetailsResponse | null> => {
    if (!transferId || transferId <= 0) {
      setState({ loading: false, error: 'Invalid transfer ID' });
      return null;
    }

    return makeApiCall(
      () => fetchJSON<TransferDetailsResponse>(`/api/owner-transfer/${transferId}`),
      'get transfer details'
    );
  };

  // Download report
  const downloadReport = async (transferId: number): Promise<void> => {
    try {
      setState({ loading: true, error: null });
      
      const response = await fetch(`/api/owner-transfer/${transferId}/report`);
      if (!response.ok) {
        throw new Error(`Failed to download report: ${response.statusText}`);
      }

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `owner_transfer_${transferId}.xlsx`;
      if (contentDisposition) {
        const matches = /filename="([^"]+)"/.exec(contentDisposition);
        if (matches) {
          filename = matches[1];
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setState({ loading: false, error: null });
    } catch (error: any) {
      setState({ loading: false, error: error.message || 'Failed to download report' });
    }
  };

  return {
    ...state,
    initiateTransfer,
    approveAccounting,
    authorizeExecution,
    executeTransfer,
    getTransferDetails,
    downloadReport,
    canAuthorize: canAuthorize(),
  };
}