export type DshCreateFieldVisitRequest = {
  readonly field_agent_id?: string;
  readonly visit_summary: string;
  readonly follow_up_action: string;
  readonly evidence_media_keys?: readonly string[];
  readonly location_confidence?: string;
};

export type DshCreateFieldVisitResponse = {
  readonly id: string;
  readonly store_id: string;
  readonly field_agent_id?: string;
  readonly visit_summary: string;
  readonly follow_up_action: string;
  readonly evidence_media_keys?: readonly string[];
  readonly location_confidence?: string;
  readonly status: 'submitted';
  readonly created_at: string;
};

export type DshFieldVisitFetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export type DshFieldVisitOfflineError = { readonly kind: 'offline' };
export type DshFieldVisitHttpError = {
  readonly kind: 'http';
  readonly status: number;
  readonly body: string;
};
export type DshFieldVisitError = DshFieldVisitOfflineError | DshFieldVisitHttpError;

export interface DshFieldVisitClient {
  createFieldVisit(storeId: string, req: DshCreateFieldVisitRequest): Promise<DshCreateFieldVisitResponse>;
}

export function isDshFieldVisitOfflineError(err: unknown): err is DshFieldVisitOfflineError {
  return typeof err === 'object' && err !== null && (err as { kind?: unknown }).kind === 'offline';
}

export function resolveDshFieldVisitBaseUrl(): string | null {
  if (typeof process === 'undefined') return null;
  const env = (process as { env?: Record<string, string | undefined> }).env;
  const raw = env?.EXPO_PUBLIC_DSH_API_BASE_URL ?? env?.NEXT_PUBLIC_DSH_API_BASE_URL;
  return raw?.trim() || null;
}

export function createDshFieldVisitHttpClient(
  baseUrl: string | null,
  fetchFn?: DshFieldVisitFetchFn,
): DshFieldVisitClient {
  return {
    createFieldVisit: async (storeId, req) => {
      const transport = fetchFn ?? globalThis.fetch?.bind(globalThis);
      const cleanStoreId = storeId.trim();

      if (!baseUrl || !transport || !cleanStoreId) {
        throw { kind: 'offline' } satisfies DshFieldVisitOfflineError;
      }

      const response = await transport(`${baseUrl.replace(/\/$/, '')}/stores/${encodeURIComponent(cleanStoreId)}/field-visits`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (!response.ok) {
        throw {
          kind: 'http',
          status: response.status,
          body: await response.text(),
        } satisfies DshFieldVisitHttpError;
      }

      return response.json() as Promise<DshCreateFieldVisitResponse>;
    },
  };
}
