import React from 'react';
import {
  resolveDshDiscoveryStoresBridge,
  type DshDiscoveryStoresBridgeResult,
} from '../shared/dsh-discovery-stores-bridge';
import {
  clientVisibleDiscoveryPreviewStores,
  clientVisibleHomePreviewStores,
} from '../dsh-client.navigation-bridge';
import { resolveDshDiscoveryStoresRuntimeConfig } from '../shared/dsh-discovery-stores-runtime-config';
import { createDshDiscoveryStoresClient, isDshDiscoveryStoresOfflineError } from '../shared/dsh-discovery-stores-transport';

export function useDshClientRuntimeStores() {
  const [runtimeBridge, setRuntimeBridge] = React.useState<DshDiscoveryStoresBridgeResult>(() =>
    resolveDshDiscoveryStoresBridge({
      previewHomeStores: clientVisibleHomePreviewStores,
      previewDiscoveryStores: clientVisibleDiscoveryPreviewStores,
    }),
  );

  const [homeRetryToken, setHomeRetryToken] = React.useState(0);

  const clientDiscoveryStoresBridge = runtimeBridge;
  const clientVisibleDiscoveryStores = runtimeBridge.discoveryStores;
  const clientVisibleHomeStores = runtimeBridge.homeStores;

  React.useEffect(() => {
    const config = resolveDshDiscoveryStoresRuntimeConfig();

    if (!config) {
      return undefined;
    }

    let cancelled = false;

    setRuntimeBridge(
      resolveDshDiscoveryStoresBridge({
        previewHomeStores: clientVisibleHomePreviewStores,
        previewDiscoveryStores: clientVisibleDiscoveryPreviewStores,
        state: 'loading',
      }),
    );

    const client = createDshDiscoveryStoresClient(config);

    client.listDiscoveryStores().then((response) => {
      if (cancelled) return;
      setRuntimeBridge(
        resolveDshDiscoveryStoresBridge({
          response,
          previewHomeStores: clientVisibleHomePreviewStores,
          previewDiscoveryStores: clientVisibleDiscoveryPreviewStores,
        }),
      );
    }).catch((err: unknown) => {
      console.warn("listDiscoveryStores failed with:", err);
      if (cancelled) return;
      const bridgeState = isDshDiscoveryStoresOfflineError(err) ? 'offline' : 'error';
      setRuntimeBridge(
        resolveDshDiscoveryStoresBridge({
          previewHomeStores: clientVisibleHomePreviewStores,
          previewDiscoveryStores: clientVisibleDiscoveryPreviewStores,
          state: bridgeState,
        }),
      );
    });

    return () => {
      cancelled = true;
    };
  }, [homeRetryToken]);

  return {
    runtimeBridge,
    setRuntimeBridge,
    homeRetryToken,
    setHomeRetryToken,
    clientDiscoveryStoresBridge,
    clientVisibleDiscoveryStores,
    clientVisibleHomeStores,
  };
}
