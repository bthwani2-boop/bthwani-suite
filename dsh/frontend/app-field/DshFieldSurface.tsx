import React from 'react';
import { BackHandler, Platform } from 'react-native';
import { Box } from '@bthwani/ui-kit';
import { DshFieldFinanceScreen } from './screens/DshFieldFinanceScreen';
import { DshFieldProfileHomeScreen } from './screens/DshFieldProfileHomeScreen';
import { DshFieldProfileScreen } from './screens/DshFieldProfileScreen';
import { DshFieldStoreOnboardingScreen } from './screens/DshFieldStoreOnboardingScreen';
import { DshFieldStoreVisitScreen, type DshFieldStoreVisitValues } from './screens/DshFieldStoreVisitScreen';
import { DshFieldStoresHistoryScreen } from './screens/DshFieldStoresHistoryScreen';
import { DshFieldStoresScreen } from './screens/DshFieldStoresScreen';
import { readFieldStoresLocal, writeFieldStoresLocal } from './data/field-onboarding.storage';
import {
  createManualFieldStore,
  submitFieldStoreForReview,
  type FieldStoreFile,
} from './data/field-stores.preview-data';
import type { DshFieldNavigationCommand, DshFieldRouteState, DshFieldSurfaceProps } from './dsh-field.types';

function isSameRoute(left: DshFieldRouteState, right: DshFieldRouteState) {
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

function resolveCommandRoute(command?: DshFieldNavigationCommand): DshFieldRouteState | null {
  if (!command) {
    return null;
  }

  if (command.target === 'onboarding' || command.target === 'visit') {
    return command.storeId ? { kind: command.target, storeId: command.storeId } : { kind: 'stores' };
  }

  return { kind: command.target };
}

export function DshFieldSurface({ command, onExit }: DshFieldSurfaceProps = {}) {
  const [stores, setStores] = React.useState<FieldStoreFile[]>(() => readFieldStoresLocal());
  const [routeStack, setRouteStack] = React.useState<DshFieldRouteState[]>([{ kind: 'stores' }]);
  const [visitValues, setVisitValues] = React.useState<Record<string, DshFieldStoreVisitValues>>({});

  const route = routeStack[routeStack.length - 1] ?? { kind: 'stores' };
  const activeStore = route.kind === 'onboarding' || route.kind === 'visit'
    ? stores.find((store) => store.id === route.storeId) ?? null
    : null;

  React.useEffect(() => {
    writeFieldStoresLocal(stores);
  }, [stores]);

  React.useEffect(() => {
    if (typeof command?.token !== 'number') {
      return;
    }

    const nextRoute = resolveCommandRoute(command);

    if (nextRoute) {
      setRouteStack([nextRoute]);
    }
  }, [command]);

  React.useEffect(() => {
    if ((route.kind === 'onboarding' || route.kind === 'visit') && !activeStore) {
      setRouteStack([{ kind: 'stores' }]);
    }
  }, [activeStore, route.kind]);

  const pushRoute = React.useCallback((nextRoute: DshFieldRouteState) => {
    setRouteStack((current) => {
      const activeRoute = current[current.length - 1];
      return activeRoute && isSameRoute(activeRoute, nextRoute) ? current : [...current, nextRoute];
    });
  }, []);

  const popRoute = React.useCallback(() => {
    setRouteStack((current) => {
      if (current.length > 1) {
        return current.slice(0, -1);
      }

      return current;
    });
  }, []);

  const resetToStores = React.useCallback(() => {
    setRouteStack([{ kind: 'stores' }]);
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

      if (onExit) {
        onExit();
        return true;
      }

      return false;
    });

    return () => subscription.remove();
  }, [onExit, popRoute, routeStack.length]);

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

  const renderStoresScreen = React.useCallback(() => (
    <DshFieldStoresScreen
      stores={stores}
      onOpenStore={(storeId) => pushRoute({ kind: 'onboarding', storeId })}
      onOpenAccount={() => pushRoute({ kind: 'account' })}
      onCreateStore={handleCreateStore}
    />
  ), [handleCreateStore, pushRoute, stores]);

  let content: React.ReactNode = renderStoresScreen();

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

          resetToStores();
        }}
      />
    );
  }

  if (route.kind === 'account') {
    content = (
      <DshFieldProfileHomeScreen
        stores={stores}
        onBack={popRoute}
        onOpenProfile={() => pushRoute({ kind: 'profile' })}
        onOpenHistory={() => pushRoute({ kind: 'history' })}
        onOpenFinance={() => pushRoute({ kind: 'finance' })}
        onLogout={resetToStores}
      />
    );
  }

  if (route.kind === 'profile') {
    content = <DshFieldProfileScreen onBack={popRoute} />;
  }

  if (route.kind === 'history') {
    content = <DshFieldStoresHistoryScreen stores={stores} onBack={popRoute} />;
  }

  if (route.kind === 'finance') {
    content = <DshFieldFinanceScreen stores={stores} onBack={popRoute} />;
  }

  return (
    <Box style={{ flex: 1 }} background="background">
      {content}
    </Box>
  );
}

export default DshFieldSurface;
