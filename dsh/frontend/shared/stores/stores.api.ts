import type { operations } from '../contracts/openapi/dsh-openapi.types';
import { PlatformVarsRegistry } from '../platform/platform-vars';

export const DSH_DISCOVERY_STORES_PATH = '/stores' as const;

type ListDiscoveryStoresOperation = operations['listDiscoveryStores'];
type GetDiscoveryStoreOperation = operations['getDiscoveryStore'];

export type DshListDiscoveryStoresQuery = NonNullable<ListDiscoveryStoresOperation['parameters']['query']>;
export type DshListDiscoveryStoresResponse =
  ListDiscoveryStoresOperation['responses'][200]['content']['application/json'];

export type DshGetDiscoveryStoreResponse =
  GetDiscoveryStoreOperation['responses'][200]['content']['application/json'];

export type DshDiscoveryStoresRequest = {
  method: 'GET';
  path: string;
  query?: DshListDiscoveryStoresQuery;
};

export type DshDiscoveryStoresTransport = (
  request: DshDiscoveryStoresRequest,
) => Promise<DshListDiscoveryStoresResponse | DshGetDiscoveryStoreResponse>;

export type DshDiscoveryStoresTypedClient = {
  listDiscoveryStores(query?: DshListDiscoveryStoresQuery): Promise<DshListDiscoveryStoresResponse>;
  getDiscoveryStore(id: string): Promise<DshGetDiscoveryStoreResponse>;
};

export function createDshDiscoveryStoresTypedClient(
  transport: DshDiscoveryStoresTransport,
): DshDiscoveryStoresTypedClient {
  return {
    listDiscoveryStores(query?: DshListDiscoveryStoresQuery) {
      return transport({
        method: 'GET',
        path: DSH_DISCOVERY_STORES_PATH,
        query,
      }) as Promise<DshListDiscoveryStoresResponse>;
    },
    getDiscoveryStore(id: string) {
      return transport({
        method: 'GET',
        path: `/stores/${id}`,
      }) as Promise<DshGetDiscoveryStoreResponse>;
    },
  };
}

export type DshFetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export type DshDiscoveryStoresOfflineError = { readonly kind: 'offline' };
export type DshDiscoveryStoresHttpError = {
  readonly kind: 'http';
  readonly status: number;
  readonly body: string;
};
export type DshDiscoveryStoresTransportError =
  | DshDiscoveryStoresOfflineError
  | DshDiscoveryStoresHttpError;

export function isDshDiscoveryStoresOfflineError(
  err: unknown,
): err is DshDiscoveryStoresOfflineError {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { kind?: unknown }).kind === 'offline'
  );
}

function buildHttpTransport(
  config: DshDiscoveryStoresRuntimeConfig,
  fetchFn: DshFetchFn,
): DshDiscoveryStoresTransport {
  return async (request) => {
    const url = new URL(request.path, config.baseUrl);

    if (request.query) {
      for (const [key, value] of Object.entries(request.query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    let response: Response;

    try {
      response = await fetchFn(url.toString(), {
        method: request.method,
        headers: { Accept: 'application/json' },
      });
    } catch {
      const offlineErr: DshDiscoveryStoresOfflineError = { kind: 'offline' };
      throw offlineErr;
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      const httpErr: DshDiscoveryStoresHttpError = {
        kind: 'http',
        status: response.status,
        body,
      };
      throw httpErr;
    }

    return response.json();
  };
}

export type DshDiscoveryStoresRuntimeConfig = {
  readonly baseUrl: string;
};

export function resolveDshDiscoveryStoresRuntimeConfig(): DshDiscoveryStoresRuntimeConfig | null {
  const raw = PlatformVarsRegistry.get('dshApiBaseUrl');

  if (!raw || raw.trim() === '') {
    return null;
  }

  return { baseUrl: raw.trim() };
}

export function createDshDiscoveryStoresClient(
  config: DshDiscoveryStoresRuntimeConfig,
  fetchFn: DshFetchFn = globalThis.fetch,
): DshDiscoveryStoresTypedClient {
  const transport = buildHttpTransport(config, fetchFn);
  return createDshDiscoveryStoresTypedClient(transport);
}
