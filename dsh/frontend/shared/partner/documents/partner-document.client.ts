// dsh/frontend/shared/partner/documents/partner-document.client.ts
// Authority: shared/partner/documents — HTTP client for store documents backend API.
// No JSX. No ui-kit. No Tamagui.

import { PlatformVarsRegistry } from '../../platform/platform-vars';
import type {
  PartnerCreateDocumentRequest,
  PartnerDocumentRecord,
  PartnerDocumentOfflineError,
  PartnerDocumentHttpError,
} from './partner-document.types';

export type PartnerDocumentFetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export interface PartnerDocumentClient {
  createDocument(storeId: string, req: PartnerCreateDocumentRequest): Promise<PartnerDocumentRecord>;
}

export function isPartnerDocumentOfflineError(err: unknown): err is PartnerDocumentOfflineError {
  return typeof err === 'object' && err !== null && (err as { kind?: unknown }).kind === 'offline';
}

export function resolvePartnerDocumentBaseUrl(): string | null {
  return PlatformVarsRegistry.get('dshApiBaseUrl');
}

export function createPartnerDocumentHttpClient(
  baseUrl: string | null,
  fetchFn?: PartnerDocumentFetchFn,
): PartnerDocumentClient {
  return {
    createDocument: async (storeId, req) => {
      const transport = fetchFn ?? globalThis.fetch?.bind(globalThis);
      const cleanStoreId = storeId.trim();

      if (!baseUrl || !transport || !cleanStoreId) {
        throw { kind: 'offline' } satisfies PartnerDocumentOfflineError;
      }

      const clientId = (PlatformVarsRegistry.get('dshClientId') ?? 'field-agent-dev').trim() || 'field-agent-dev';
      const response = await transport(`${baseUrl.replace(/\/$/, '')}/stores/${encodeURIComponent(cleanStoreId)}/documents`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Client-Id': clientId,
          'X-Actor-Type': 'field',
        },
        body: JSON.stringify(req),
      });

      if (!response.ok) {
        throw {
          kind: 'http',
          status: response.status,
          body: await response.text(),
        } satisfies PartnerDocumentHttpError;
      }

      return response.json() as Promise<PartnerDocumentRecord>;
    },
  };
}
