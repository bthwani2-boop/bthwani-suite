import type { DshDiscoveryStore } from '../../shared/dshStoreProductCardModel';
import type { DshHomeGetStore } from '../contracts/dsh-home-types';
import type { DshListDiscoveryStoresResponse } from './dsh-discovery-stores-client';
import {
  mapDiscoveryStoresResponseToDiscoveryStores,
  mapDiscoveryStoresResponseToHomeStores,
} from './dsh-discovery-stores-mappers';

export type DshDiscoveryStoresBridgeState = 'ready' | 'empty' | 'error' | 'offline' | 'loading';
export type DshDiscoveryStoresBridgeSource = 'openapi-response' | 'preview-fallback';

export type DshDiscoveryStoresBridgeInput = {
  response?: DshListDiscoveryStoresResponse;
  previewHomeStores: DshHomeGetStore[];
  previewDiscoveryStores: DshDiscoveryStore[];
  state?: DshDiscoveryStoresBridgeState;
};

export type DshDiscoveryStoresBridgeResult = {
  source: DshDiscoveryStoresBridgeSource;
  state: DshDiscoveryStoresBridgeState;
  homeStores: DshHomeGetStore[];
  discoveryStores: DshDiscoveryStore[];
  fallbackReason?: 'NO_RUNTIME_RESPONSE' | 'RUNTIME_NOT_READY';
};

export function resolveDshDiscoveryStoresBridge(
  input: DshDiscoveryStoresBridgeInput,
): DshDiscoveryStoresBridgeResult {
  if (input.response) {
    const homeStores = mapDiscoveryStoresResponseToHomeStores(input.response);
    const discoveryStores = mapDiscoveryStoresResponseToDiscoveryStores(input.response);

    return {
      source: 'openapi-response',
      state: homeStores.length > 0 ? 'ready' : 'empty',
      homeStores,
      discoveryStores,
    };
  }

  const hasPreviewStores = input.previewHomeStores.length > 0 || input.previewDiscoveryStores.length > 0;

  return {
    source: 'preview-fallback',
    state: input.state ?? (hasPreviewStores ? 'ready' : 'empty'),
    homeStores: input.previewHomeStores,
    discoveryStores: input.previewDiscoveryStores,
    fallbackReason: input.state && input.state !== 'ready' ? 'RUNTIME_NOT_READY' : 'NO_RUNTIME_RESPONSE',
  };
}
