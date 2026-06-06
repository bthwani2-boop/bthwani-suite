export type CreateFieldReadinessEscalationRequest = {
  readonly field_agent_id?: string;
  readonly reason: string;
  readonly target_team: 'partner-management' | 'control-panel' | 'marketing';
};

export type FieldReadinessEscalationRecord = {
  readonly id: string;
  readonly store_id: string;
  readonly field_agent_id?: string;
  readonly reason: string;
  readonly target_team: 'partner-management' | 'control-panel' | 'marketing';
  readonly status: 'escalated' | 'info_requested' | 'resolved' | 'rejected';
  readonly operator_note?: string;
  readonly created_at: string;
  readonly updated_at: string;
};

export type UpdateFieldReadinessEscalationRequest = {
  readonly status: 'info_requested' | 'resolved' | 'rejected';
  readonly operator_note?: string;
};

export type ListFieldReadinessEscalationsResponse = {
  readonly escalations: readonly FieldReadinessEscalationRecord[];
  readonly pagination: {
    readonly limit: number;
    readonly offset: number;
    readonly total: number;
  };
};

export type CreateFieldReadinessApprovalRequest = {
  readonly operator_id?: string;
  readonly decision: 'approved' | 'rejected';
  readonly reason?: string;
};

export type FieldReadinessApprovalRecord = {
  readonly id: string;
  readonly store_id: string;
  readonly operator_id?: string;
  readonly decision: 'approved' | 'rejected';
  readonly reason?: string;
  readonly created_at: string;
};

export interface DshFieldReadinessClient {
  createFieldReadinessEscalation(storeId: string, req: CreateFieldReadinessEscalationRequest): Promise<FieldReadinessEscalationRecord>;
  listFieldReadinessEscalations(status?: string, limit?: number, offset?: number): Promise<ListFieldReadinessEscalationsResponse>;
  updateFieldReadinessEscalation(id: string, req: UpdateFieldReadinessEscalationRequest): Promise<FieldReadinessEscalationRecord>;
  createFieldReadinessApproval(storeId: string, req: CreateFieldReadinessApprovalRequest): Promise<FieldReadinessApprovalRecord>;
  getLatestFieldReadinessApproval(storeId: string): Promise<FieldReadinessApprovalRecord>;
}

export function resolveDshFieldReadinessBaseUrl(): string | null {
  if (typeof process !== 'undefined') {
    const env = (process as { env?: Record<string, string | undefined> }).env;
    const raw = env?.EXPO_PUBLIC_DSH_API_BASE_URL ?? env?.NEXT_PUBLIC_DSH_API_BASE_URL;
    if (raw?.trim()) return raw.trim();
  }
  return null;
}

export function createDshFieldReadinessHttpClient(
  baseUrl: string | null,
  fetchFn?: (input: string, init?: RequestInit) => Promise<Response>,
): DshFieldReadinessClient {
  return {
    createFieldReadinessEscalation: async (storeId, req) => {
      const transport = fetchFn ?? globalThis.fetch?.bind(globalThis);
      if (!baseUrl || !transport) throw new Error('offline');
      const cleanUrl = baseUrl.replace(/\/$/, '');
      const response = await transport(`${cleanUrl}/stores/${encodeURIComponent(storeId)}/readiness-escalations`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (!response.ok) {
        throw new Error(`Failed to create readiness escalation: ${response.statusText}`);
      }
      return response.json();
    },
    listFieldReadinessEscalations: async (status, limit = 20, offset = 0) => {
      const transport = fetchFn ?? globalThis.fetch?.bind(globalThis);
      if (!baseUrl || !transport) throw new Error('offline');
      const cleanUrl = baseUrl.replace(/\/$/, '');
      let url = `${cleanUrl}/readiness-escalations?limit=${limit}&offset=${offset}`;
      if (status) {
        url += `&status=${encodeURIComponent(status)}`;
      }
      const response = await transport(url);
      if (!response.ok) {
        throw new Error(`Failed to list readiness escalations: ${response.statusText}`);
      }
      return response.json();
    },
    updateFieldReadinessEscalation: async (id, req) => {
      const transport = fetchFn ?? globalThis.fetch?.bind(globalThis);
      if (!baseUrl || !transport) throw new Error('offline');
      const cleanUrl = baseUrl.replace(/\/$/, '');
      const response = await transport(`${cleanUrl}/readiness-escalations/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (!response.ok) {
        throw new Error(`Failed to update readiness escalation: ${response.statusText}`);
      }
      return response.json();
    },
    createFieldReadinessApproval: async (storeId, req) => {
      const transport = fetchFn ?? globalThis.fetch?.bind(globalThis);
      if (!baseUrl || !transport) throw new Error('offline');
      const cleanUrl = baseUrl.replace(/\/$/, '');
      const response = await transport(`${cleanUrl}/stores/${encodeURIComponent(storeId)}/readiness-approvals`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (!response.ok) {
        throw new Error(`Failed to create readiness approval: ${response.statusText}`);
      }
      return response.json();
    },
    getLatestFieldReadinessApproval: async (storeId) => {
      const transport = fetchFn ?? globalThis.fetch?.bind(globalThis);
      if (!baseUrl || !transport) throw new Error('offline');
      const cleanUrl = baseUrl.replace(/\/$/, '');
      const response = await transport(`${cleanUrl}/stores/${encodeURIComponent(storeId)}/readiness-approvals/latest`);
      if (!response.ok) {
        throw new Error(`Failed to get latest readiness approval: ${response.statusText}`);
      }
      return response.json();
    },
  };
}
