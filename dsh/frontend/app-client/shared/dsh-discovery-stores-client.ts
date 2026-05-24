import type { operations } from '../contracts/dsh-openapi.types';

export const DSH_DISCOVERY_STORES_PATH = '/stores' as const;

type ListDiscoveryStoresOperation = operations['listDiscoveryStores'];

export type DshListDiscoveryStoresQuery = NonNullable<ListDiscoveryStoresOperation['parameters']['query']>;
export type DshListDiscoveryStoresResponse =
  ListDiscoveryStoresOperation['responses'][200]['content']['application/json'];

export type DshDiscoveryStoresRequest = {
  method: 'GET';
  path: typeof DSH_DISCOVERY_STORES_PATH;
  query?: DshListDiscoveryStoresQuery;
};

export type DshDiscoveryStoresTransport = (
  request: DshDiscoveryStoresRequest,
) => Promise<DshListDiscoveryStoresResponse>;

export type DshDiscoveryStoresTypedClient = {
  listDiscoveryStores(query?: DshListDiscoveryStoresQuery): Promise<DshListDiscoveryStoresResponse>;
};

export function createDshDiscoveryStoresTypedClient(
  transport: DshDiscoveryStoresTransport,
): DshDiscoveryStoresTypedClient {
  return {
    listDiscoveryStores(query) {
      return transport({
        method: 'GET',
        path: DSH_DISCOVERY_STORES_PATH,
        query,
      });
    },
  };
}
