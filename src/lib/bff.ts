export type WorkOrderPayload = {
  propertyId: string;
  summary: string;
  priority?: 'low'|'normal'|'high';
};

export type NoticePayload = {
  leaseId: string;
  template: 'renewal' | 'termination' | 'violation' | 'custom';
  customMessage?: string;
};

export type MessagePayload = {
  tenantId: string;
  message: string;
  urgent?: boolean;
};

export type TransferPayload = {
  ownerId: string;
  transferTo: string;
  effective?: string;
};

async function postJson<T>(url: string, body: any): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(body),
    credentials: 'include'
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export async function createWorkOrder(input: WorkOrderPayload): Promise<{ ok: boolean; workOrderId?: string; }> {
  return postJson<{ ok: boolean; workOrderId?: string; }>('/api/bff/work-orders/create', input);
}

export async function sendNotice(input: NoticePayload): Promise<{ ok: boolean; noticeId?: string; }> {
  return postJson<{ ok: boolean; noticeId?: string; }>('/api/bff/notices/send', input);
}

export async function sendMessage(input: MessagePayload): Promise<{ ok: boolean; messageId?: string; }> {
  return postJson<{ ok: boolean; messageId?: string; }>('/api/bff/messages/send', input);
}

export async function transferOwnership(input: TransferPayload): Promise<{ ok: boolean; transferId?: string; }> {
  return postJson<{ ok: boolean; transferId?: string; }>('/api/bff/ownership/transfer', input);
}