// dsh/frontend/shared/partner/readiness/partner-readiness.client.ts
// Authority: shared/partner/readiness — HTTP client for store readiness approvals/escalations API.
// No JSX. No ui-kit. No Tamagui.

import { PlatformVarsRegistry } from '../platform/platform-vars';

export type CreatePartnerReadinessEscalationRequest = {
  readonly field_agent_id?: string;
  readonly reason: string;
  readonly target_team: 'partner-management' | 'control-panel' | 'marketing';
};

export type PartnerReadinessEscalationRecord = {
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

export type UpdatePartnerReadinessEscalationRequest = {
  readonly status: 'info_requested' | 'resolved' | 'rejected';
  readonly operator_note?: string;
};

export type ListPartnerReadinessEscalationsResponse = {
  readonly escalations: readonly PartnerReadinessEscalationRecord[];
  readonly pagination: {
    readonly limit: number;
    readonly offset: number;
    readonly total: number;
  };
};

export type CreatePartnerReadinessApprovalRequest = {
  readonly operator_id?: string;
  readonly decision: 'approved' | 'rejected';
  readonly reason?: string;
};

export type PartnerReadinessApprovalRecord = {
  readonly id: string;
  readonly store_id: string;
  readonly operator_id?: string;
  readonly decision: 'approved' | 'rejected';
  readonly reason?: string;
  readonly created_at: string;
};

export interface PartnerReadinessClient {
  createReadinessEscalation(storeId: string, req: CreatePartnerReadinessEscalationRequest): Promise<PartnerReadinessEscalationRecord>;
  listReadinessEscalations(status?: string, limit?: number, offset?: number): Promise<ListPartnerReadinessEscalationsResponse>;
  updateReadinessEscalation(id: string, req: UpdatePartnerReadinessEscalationRequest): Promise<PartnerReadinessEscalationRecord>;
  createReadinessApproval(storeId: string, req: CreatePartnerReadinessApprovalRequest): Promise<PartnerReadinessApprovalRecord>;
  getLatestReadinessApproval(storeId: string): Promise<PartnerReadinessApprovalRecord>;

  // Deprecated/Legacy compatibility mappings
  createFieldReadinessEscalation(storeId: string, req: CreatePartnerReadinessEscalationRequest): Promise<PartnerReadinessEscalationRecord>;
  listFieldReadinessEscalations(status?: string, limit?: number, offset?: number): Promise<ListPartnerReadinessEscalationsResponse>;
  updateFieldReadinessEscalation(id: string, req: UpdatePartnerReadinessEscalationRequest): Promise<PartnerReadinessEscalationRecord>;
  createFieldReadinessApproval(storeId: string, req: CreatePartnerReadinessApprovalRequest): Promise<PartnerReadinessApprovalRecord>;
  getLatestFieldReadinessApproval(storeId: string): Promise<PartnerReadinessApprovalRecord>;
}

export function resolvePartnerReadinessBaseUrl(): string | null {
  return PlatformVarsRegistry.get('dshApiBaseUrl');
}

export function createPartnerReadinessHttpClient(
  baseUrl: string | null,
  fetchFn?: (input: string, init?: RequestInit) => Promise<Response>,
): PartnerReadinessClient {
  const transport = fetchFn ?? globalThis.fetch?.bind(globalThis);
  const client: PartnerReadinessClient = {
    createReadinessEscalation: async (storeId, req) => {
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
    listReadinessEscalations: async (status, limit = 20, offset = 0) => {
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
    updateReadinessEscalation: async (id, req) => {
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
    createReadinessApproval: async (storeId, req) => {
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
    getLatestReadinessApproval: async (storeId) => {
      if (!baseUrl || !transport) throw new Error('offline');
      const cleanUrl = baseUrl.replace(/\/$/, '');
      const response = await transport(`${cleanUrl}/stores/${encodeURIComponent(storeId)}/readiness-approvals/latest`);
      if (!response.ok) {
        throw new Error(`Failed to get latest readiness approval: ${response.statusText}`);
      }
      return response.json();
    },

    // Legacy delegators
    createFieldReadinessEscalation: (storeId, req) => client.createReadinessEscalation(storeId, req),
    listFieldReadinessEscalations: (status, limit, offset) => client.listReadinessEscalations(status, limit, offset),
    updateFieldReadinessEscalation: (id, req) => client.updateReadinessEscalation(id, req),
    createFieldReadinessApproval: (storeId, req) => client.createReadinessApproval(storeId, req),
    getLatestFieldReadinessApproval: (storeId) => client.getLatestReadinessApproval(storeId),
  };
  return client;
}

// Legacy/Deprecated backwards-compatibility aliases
export type FieldReadinessEscalationRecord = PartnerReadinessEscalationRecord;
export type FieldReadinessApprovalRecord = PartnerReadinessApprovalRecord;
export type CreateFieldReadinessEscalationRequest = CreatePartnerReadinessEscalationRequest;
export type UpdateFieldReadinessEscalationRequest = UpdatePartnerReadinessEscalationRequest;
export type ListFieldReadinessEscalationsResponse = ListPartnerReadinessEscalationsResponse;
export type CreateFieldReadinessApprovalRequest = CreatePartnerReadinessApprovalRequest;
