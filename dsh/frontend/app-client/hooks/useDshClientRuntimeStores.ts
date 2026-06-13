import React from 'react';
import {
  resolveDshDiscoveryStoresBridge,
  type DshDiscoveryStoresBridgeResult,
} from 'dsh-discovery-stores-bridge';
import {
  clientVisibleDiscoveryStores as initialDiscoveryStores,
  clientVisibleHomeStores as initialHomeStores,
} from '../dsh-client.navigation-bridge';
import { resolveDshDiscoveryStoresRuntimeConfig } from 'dsh-discovery-stores-runtime-config';
import { isDshDiscoveryStoresOfflineError } from 'dsh-discovery-stores-transport';
import { getDshDiscoveryStoresRuntimeClient } from '../../shared';

export function useDshClientRuntimeStores() {
  const [runtimeBridge, setRuntimeBridge] = React.useState<DshDiscoveryStoresBridgeResult>(() =>
    resolveDshDiscoveryStoresBridge({
      initialHomeStores: initialHomeStores,
      initialDiscoveryStores: initialDiscoveryStores,
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
        initialHomeStores: initialHomeStores,
        initialDiscoveryStores: initialDiscoveryStores,
        state: 'loading',
      }),
    );

    const client = getDshDiscoveryStoresRuntimeClient(config);

    client.listDiscoveryStores().then((response) => {
      if (cancelled) return;
      setRuntimeBridge(
        resolveDshDiscoveryStoresBridge({
          response,
          initialHomeStores: initialHomeStores,
          initialDiscoveryStores: initialDiscoveryStores,
        }),
      );
    }).catch((err: unknown) => {
      console.warn("listDiscoveryStores failed with:", err);
      if (cancelled) return;
      const bridgeState = isDshDiscoveryStoresOfflineError(err) ? 'offline' : 'error';
      setRuntimeBridge(
        resolveDshDiscoveryStoresBridge({
          initialHomeStores: initialHomeStores,
          initialDiscoveryStores: initialDiscoveryStores,
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
