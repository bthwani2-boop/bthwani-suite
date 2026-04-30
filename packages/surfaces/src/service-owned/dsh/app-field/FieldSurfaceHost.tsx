import React from 'react';
import { BackHandler, Platform } from 'react-native';
import { Box } from '@bthwani/ui-kit';
import { FieldAccountHomeScreen } from './account/FieldAccountHomeScreen';
import { FieldHistoryScreen } from './account/FieldHistoryScreen';
import { FieldProfileScreen } from './account/FieldProfileScreen';
import { FieldSupportScreen } from './account/FieldSupportScreen';
import { FieldCommissionsScreen } from './commissions/FieldCommissionsScreen';
import { FieldPartnerOnboardingScreen } from './onboarding/FieldPartnerOnboardingScreen';
import { readFieldStoresLocal, writeFieldStoresLocal } from './onboarding/FieldOnboardingStorage';
import { FieldSettingsScreen } from './settings/FieldSettingsScreen';
import { FieldStoresHomeScreen } from './stores/FieldStoresHomeScreen';
import { createManualFieldStore, submitFieldStoreForReview, type FieldStoreFile } from './stores/fieldStoreModel';

type FieldRoute =
  | { kind: 'stores' }
  | { kind: 'onboarding'; storeId: string }
  | { kind: 'account' }
  | { kind: 'profile' }
  | { kind: 'history' }
  | { kind: 'commissions' }
  | { kind: 'settings' }
  | { kind: 'support' };

function isSameRoute(left: FieldRoute, right: FieldRoute) {
  if (left.kind !== right.kind) {
    return false;
  }

  if (left.kind === 'onboarding' && right.kind === 'onboarding') {
    return left.storeId === right.storeId;
  }

  return true;
}

export function FieldSurfaceHost() {
  const [stores, setStores] = React.useState<FieldStoreFile[]>(() => readFieldStoresLocal());
  const [routeStack, setRouteStack] = React.useState<FieldRoute[]>([{ kind: 'stores' }]);

  const route = routeStack[routeStack.length - 1] ?? { kind: 'stores' };

  React.useEffect(() => {
    writeFieldStoresLocal(stores);
  }, [stores]);

  const pushRoute = React.useCallback((nextRoute: FieldRoute) => {
    setRouteStack((current) => {
      const activeRoute = current[current.length - 1];
      return activeRoute && isSameRoute(activeRoute, nextRoute) ? current : [...current, nextRoute];
    });
  }, []);

  const popRoute = React.useCallback(() => {
    setRouteStack((current) => (current.length > 1 ? current.slice(0, -1) : current));
  }, []);

  React.useEffect(() => {
    if (Platform.OS !== 'android') {
      return undefined;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (routeStack.length > 1) {
        popRoute();
        return true;
      }

      return false;
    });

    return () => subscription.remove();
  }, [popRoute, routeStack.length]);

  const updateStore = React.useCallback((storeId: string, updater: (store: FieldStoreFile) => FieldStoreFile) => {
    setStores((current) => current.map((store) => (store.id === storeId ? updater(store) : store)));
  }, []);

  const handleCreateStore = React.useCallback(() => {
    const nextStore = createManualFieldStore();
    setStores((current) => [nextStore, ...current]);
    pushRoute({ kind: 'onboarding', storeId: nextStore.id });
  }, [pushRoute]);

  const handleLogout = React.useCallback(() => {
    setRouteStack([{ kind: 'stores' }]);
  }, []);

  const activeStore = route.kind === 'onboarding' ? stores.find((store) => store.id === route.storeId) ?? null : null;

  let content: React.ReactNode = null;

  if (route.kind === 'stores') {
    content = (
      <FieldStoresHomeScreen
        stores={stores}
        onOpenStore={(storeId) => pushRoute({ kind: 'onboarding', storeId })}
        onOpenAccount={() => pushRoute({ kind: 'account' })}
        onCreateStore={handleCreateStore}
      />
    );
  }

  if (route.kind === 'onboarding' && activeStore) {
    content = (
      <FieldPartnerOnboardingScreen
        store={activeStore}
        onBack={popRoute}
        onStoreChange={(updater) => updateStore(activeStore.id, updater)}
        onSaveDraft={() =>
          updateStore(activeStore.id, (store) => ({
            ...store,
            lastUpdatedLabel: 'الآن',
            draft: {
              ...store.draft,
              lastSavedLabel: 'الآن',
            },
          }))
        }
        onSubmitReview={() => updateStore(activeStore.id, submitFieldStoreForReview)}
      />
    );
  }

  if (route.kind === 'account') {
    content = (
      <FieldAccountHomeScreen
        stores={stores}
        onBack={popRoute}
        onOpenProfile={() => pushRoute({ kind: 'profile' })}
        onOpenHistory={() => pushRoute({ kind: 'history' })}
        onOpenCommissions={() => pushRoute({ kind: 'commissions' })}
        onOpenSettings={() => pushRoute({ kind: 'settings' })}
        onOpenSupport={() => pushRoute({ kind: 'support' })}
        onLogout={handleLogout}
      />
    );
  }

  if (route.kind === 'profile') {
    content = <FieldProfileScreen onBack={popRoute} />;
  }

  if (route.kind === 'history') {
    content = <FieldHistoryScreen stores={stores} onBack={popRoute} />;
  }

  if (route.kind === 'commissions') {
    content = <FieldCommissionsScreen stores={stores} onBack={popRoute} />;
  }

  if (route.kind === 'settings') {
    content = <FieldSettingsScreen onBack={popRoute} />;
  }

  if (route.kind === 'support') {
    content = <FieldSupportScreen onBack={popRoute} />;
  }

  return <Box style={{ flex: 1 }} background="background">{content}</Box>;
}

export default FieldSurfaceHost;
