import { PlatformVarsRegistry } from './platform/PlatformVarsProvider';

export type DshFieldDocumentKind =
  | 'commercial_registration'
  | 'tax_certificate'
  | 'identity_proof'
  | 'storefront_photo'
  | 'interior_photo';

export type DshFieldDocumentStatus = 'pending' | 'approved' | 'rejected';

export type DshCreateFieldDocumentRequest = {
  readonly document_kind: DshFieldDocumentKind;
  readonly media_key: string;
};

export type DshFieldDocumentRecord = {
  readonly id: string;
  readonly store_id: string;
  readonly document_kind: DshFieldDocumentKind;
  readonly media_key: string;
  readonly status: DshFieldDocumentStatus;
  readonly created_at: string;
  readonly updated_at: string;
};

export type DshFieldDocumentFetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export type DshFieldDocumentOfflineError = { readonly kind: 'offline' };
export type DshFieldDocumentHttpError = {
  readonly kind: 'http';
  readonly status: number;
  readonly body: string;
};
export type DshFieldDocumentError = DshFieldDocumentOfflineError | DshFieldDocumentHttpError;

export interface DshFieldDocumentClient {
  createFieldDocument(storeId: string, req: DshCreateFieldDocumentRequest): Promise<DshFieldDocumentRecord>;
}

export function isDshFieldDocumentOfflineError(err: unknown): err is DshFieldDocumentOfflineError {
  return typeof err === 'object' && err !== null && (err as { kind?: unknown }).kind === 'offline';
}

export function resolveDshFieldDocumentBaseUrl(): string | null {
  return PlatformVarsRegistry.get('dshApiBaseUrl');
}

export function createDshFieldDocumentHttpClient(
  baseUrl: string | null,
  fetchFn?: DshFieldDocumentFetchFn,
): DshFieldDocumentClient {
  return {
    createFieldDocument: async (storeId, req) => {
      const transport = fetchFn ?? globalThis.fetch?.bind(globalThis);
      const cleanStoreId = storeId.trim();

      if (!baseUrl || !transport || !cleanStoreId) {
        throw { kind: 'offline' } satisfies DshFieldDocumentOfflineError;
      }

      const response = await transport(`${baseUrl.replace(/\/$/, '')}/stores/${encodeURIComponent(cleanStoreId)}/documents`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (!response.ok) {
        throw {
          kind: 'http',
          status: response.status,
          body: await response.text(),
        } satisfies DshFieldDocumentHttpError;
      }

      return response.json() as Promise<DshFieldDocumentRecord>;
    },
  };
}
