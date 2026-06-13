import { PlatformVarsRegistry } from '../platform/platform-vars';

export type DshCreateFieldStoreRequest = {
  readonly name: string;
  readonly address: string;
  readonly category_id?: string;
  readonly supports_pickup: boolean;
  readonly supports_partner_delivery: boolean;
};

export type DshCreateFieldStoreResponse = {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly category_id?: string;
  readonly publish_stage: string;
  readonly created_at: string;
};

export type DshFieldStoreOnboardingFetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export type DshFieldStoreOnboardingOfflineError = { readonly kind: 'offline' };
export type DshFieldStoreOnboardingHttpError = {
  readonly kind: 'http';
  readonly status: number;
  readonly body: string;
};
export type DshFieldStoreOnboardingError =
  | DshFieldStoreOnboardingOfflineError
  | DshFieldStoreOnboardingHttpError;

export interface DshFieldStoreOnboardingClient {
  createFieldStore(req: DshCreateFieldStoreRequest): Promise<DshCreateFieldStoreResponse>;
}

export function isDshFieldStoreOnboardingOfflineError(
  err: unknown,
): err is DshFieldStoreOnboardingOfflineError {
  return typeof err === 'object' && err !== null && (err as { kind?: unknown }).kind === 'offline';
}

export function resolveDshFieldStoreOnboardingBaseUrl(): string | null {
  return PlatformVarsRegistry.get('dshApiBaseUrl');
}

export function createDshFieldStoreOnboardingHttpClient(
  baseUrl: string | null,
  fetchFn?: DshFieldStoreOnboardingFetchFn,
): DshFieldStoreOnboardingClient {
  return {
    createFieldStore: async (req) => {
      const transport = fetchFn ?? globalThis.fetch?.bind(globalThis);

      if (!baseUrl || !transport) {
        throw { kind: 'offline' } satisfies DshFieldStoreOnboardingOfflineError;
      }

      const response = await transport(`${baseUrl.replace(/\/$/, '')}/stores`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (!response.ok) {
        throw {
          kind: 'http',
          status: response.status,
          body: await response.text(),
        } satisfies DshFieldStoreOnboardingHttpError;
      }

      return response.json() as Promise<DshCreateFieldStoreResponse>;
    },
  };
}
