import type { operations } from '../contracts/dsh-openapi.types';

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
  query?: any;
};

export type DshDiscoveryStoresTransport = (
  request: DshDiscoveryStoresRequest,
) => Promise<any>;

export type DshDiscoveryStoresTypedClient = {
  listDiscoveryStores(query?: DshListDiscoveryStoresQuery): Promise<DshListDiscoveryStoresResponse>;
  getDiscoveryStore(id: string): Promise<DshGetDiscoveryStoreResponse>;
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
    getDiscoveryStore(id) {
      return transport({
        method: 'GET',
        path: `/stores/${id}`,
      });
    },
  };
}
