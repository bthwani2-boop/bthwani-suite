import { PlatformVarsRegistry } from './platform/platform-vars';

export type DshFieldVisitRequest = {
  readonly visit_summary: string;
  readonly follow_up_action: string;
  readonly evidence_media_keys: readonly string[];
  readonly location_confidence: 'manual_confirmed' | 'gps_confirmed' | 'low_confidence';
};

export type DshFieldVisitResponse = {
  readonly id?: string;
  readonly store_id?: string;
  readonly created_at?: string;
};

export type DshFieldVisitFetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export interface DshFieldVisitClient {
  createFieldVisit(storeId: string, req: DshFieldVisitRequest): Promise<DshFieldVisitResponse>;
}

export function resolveDshFieldVisitBaseUrl(): string | null {
  return PlatformVarsRegistry.get('dshApiBaseUrl');
}

export function createDshFieldVisitHttpClient(
  baseUrl: string | null,
  fetchFn?: DshFieldVisitFetchFn,
): DshFieldVisitClient {
  return {
    createFieldVisit: async (storeId, req) => {
      const transport = fetchFn ?? globalThis.fetch?.bind(globalThis);

      if (!baseUrl || !transport) {
        throw { kind: 'offline', reason: 'missing_base_url_or_fetch' };
      }

      const clientId = (PlatformVarsRegistry.get('dshClientId') ?? 'field-agent-dev').trim() || 'field-agent-dev';
      const url = `${baseUrl.replace(/\/$/, '')}/stores/${encodeURIComponent(storeId)}/field-visits`;

      let response: Response;
      try {
        response = await transport(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Client-Id': clientId,
            'X-Actor-Type': 'field',
          },
          body: JSON.stringify(req),
        });
      } catch {
        throw { kind: 'offline', reason: 'network_request_failed', baseUrl };
      }

      if (!response.ok) {
        throw {
          kind: 'http',
          status: response.status,
          body: await response.text(),
        };
      }

      return response.json() as Promise<DshFieldVisitResponse>;
    },
  };
}
