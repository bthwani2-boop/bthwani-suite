import React from 'react';
import { BackHandler, Platform } from 'react-native';
import { Box } from '@bthwani/ui-kit';
import { FieldAccountHomeScreen } from './account/FieldAccountHomeScreen';
import { FieldHistoryScreen } from './account/FieldHistoryScreen';
import { DshFieldFinanceScreen } from './finance';
import { DshFieldStoreOnboardingScreen, readFieldStoresLocal, writeFieldStoresLocal } from './onboarding';
import { DshFieldStoreVisitScreen, type DshFieldStoreVisitValues } from './visits';
import { FieldSettingsScreen } from './settings/FieldSettingsScreen';
import { DshFieldStoresScreen } from './stores';
import { DshFieldProfileScreen } from './profile';
import { createManualFieldStore, submitFieldStoreForReview, type FieldStoreFile } from './stores/fieldStoreModel';

type FieldRoute =
  | { kind: 'stores' }
  | { kind: 'onboarding'; storeId: string }
  | { kind: 'visit'; storeId: string }
  | { kind: 'account' }
  | { kind: 'profile' }
  | { kind: 'history' }
  | { kind: 'finance' }
  | { kind: 'settings' };

function isSameRoute(left: FieldRoute, right: FieldRoute) {
  if (left.kind !== right.kind) {
    return false;
  }

  if (left.kind === 'onboarding' && right.kind === 'onboarding') {
    return left.storeId === right.storeId;
  }

  if (left.kind === 'visit' && right.kind === 'visit') {
    return left.storeId === right.storeId;
  }

  return true;
}

export function FieldSurfaceHost() {
  const [stores, setStores] = React.useState<FieldStoreFile[]>(() => readFieldStoresLocal());
  const [routeStack, setRouteStack] = React.useState<FieldRoute[]>([{ kind: 'stores' }]);
  const [visitValues, setVisitValues] = React.useState<Record<string, DshFieldStoreVisitValues>>({});

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

    setStores((current) => [
      {
        ...nextStore,
        draft: {
          ...nextStore.draft,
          basics: {
            ...nextStore.draft.basics,
            storeName: nextStore.name,
          },
          location: {
            ...nextStore.draft.location,
            city: nextStore.location,
          },
        },
      },
      ...current,
    ]);

    pushRoute({ kind: 'onboarding', storeId: nextStore.id });
  }, [pushRoute]);

  const handleLogout = React.useCallback(() => {
    setRouteStack([{ kind: 'stores' }]);
  }, []);

  const activeStore = route.kind === 'onboarding' || route.kind === 'visit' ? stores.find((store) => store.id === route.storeId) ?? null : null;

  let content: React.ReactNode = null;

  if (route.kind === 'stores') {
    content = (
      <DshFieldStoresScreen
        stores={stores}
        onOpenStore={(storeId) => pushRoute({ kind: 'onboarding', storeId })}
        onOpenAccount={() => pushRoute({ kind: 'account' })}
        onCreateStore={handleCreateStore}
      />
    );
  }

  if (route.kind === 'onboarding' && activeStore) {
    content = (
      <DshFieldStoreOnboardingScreen
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
        onSubmitReview={() => {
          updateStore(activeStore.id, submitFieldStoreForReview);
          pushRoute({ kind: 'visit', storeId: activeStore.id });
        }}
      />
    );
  }

  if (route.kind === 'visit' && activeStore) {
    const values = visitValues[activeStore.id] ?? {
      visitSummary: '',
      followUpAction: '',
    };

    content = (
      <DshFieldStoreVisitScreen
        values={values}
        onRetry={popRoute}
        onChange={(field, value) => {
          setVisitValues((current) => ({
            ...current,
            [activeStore.id]: {
              ...values,
              [field]: value,
            },
          }));
        }}
        onSubmit={() => {
          const nextValues = visitValues[activeStore.id] ?? values;

          updateStore(activeStore.id, (store) => ({
            ...store,
            lifecycleNote: nextValues.visitSummary || store.lifecycleNote,
            reviewFeedback: nextValues.followUpAction || store.reviewFeedback,
            lastUpdatedLabel: 'الآن',
          }));

          setRouteStack([{ kind: 'stores' }]);
        }}
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
        onOpenFinance={() => pushRoute({ kind: 'finance' })}
        onOpenSettings={() => pushRoute({ kind: 'settings' })}
        onLogout={handleLogout}
      />
    );
  }

  if (route.kind === 'profile') {
    content = <DshFieldProfileScreen onBack={popRoute} />;
  }

  if (route.kind === 'history') {
    content = <FieldHistoryScreen stores={stores} onBack={popRoute} />;
  }

  if (route.kind === 'finance') {
    content = <DshFieldFinanceScreen stores={stores} onBack={popRoute} />;
  }

  if (route.kind === 'settings') {
    content = <FieldSettingsScreen onBack={popRoute} />;
  }

  return <Box style={{ flex: 1 }} background="background">{content}</Box>;
}

export default FieldSurfaceHost;
