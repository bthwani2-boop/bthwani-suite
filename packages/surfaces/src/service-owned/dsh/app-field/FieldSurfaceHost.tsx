import React from 'react';
import { BackHandler, Platform } from 'react-native';
import { Box } from '@bthwani/ui-kit';
import { FieldAccountHomeScreen } from './account/FieldAccountHomeScreen';
import { FieldHistoryScreen } from './account/FieldHistoryScreen';
import { FieldProfileScreen } from './account/FieldProfileScreen';
import { FieldSupportScreen } from './account/FieldSupportScreen';
import { FieldCommissionsScreen } from './commissions/FieldCommissionsScreen';
import { DshFieldStoreActivationRequestScreen, type DshFieldStoreActivationRequestValues } from './store-activation/screens/DshFieldStoreActivationRequestScreen';
import { readFieldStoresLocal, writeFieldStoresLocal } from './onboarding/FieldOnboardingStorage';
import { FieldPartnerOnboardingScreen } from './onboarding/FieldPartnerOnboardingScreen';
import { DshFieldStoreGeoPinScreen, type DshFieldStoreGeoPinValues } from './geo-pin/screens/DshFieldStoreGeoPinScreen';
import { DshFieldStoreVisitLogScreen, type DshFieldStoreVisitLogValues } from './visit-log/screens/DshFieldStoreVisitLogScreen';
import { FieldSettingsScreen } from './settings/FieldSettingsScreen';
import { FieldStoresHomeScreen } from './stores/FieldStoresHomeScreen';
import { createManualFieldStore, submitFieldStoreForReview, type FieldStoreFile } from './stores/fieldStoreModel';

type FieldRoute =
  | { kind: 'stores' }
  | { kind: 'activation-request'; storeId: string }
  | { kind: 'onboarding'; storeId: string }
  | { kind: 'geo-pin'; storeId: string }
  | { kind: 'visit-log'; storeId: string }
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

  if (left.kind === 'activation-request' && right.kind === 'activation-request') {
    return left.storeId === right.storeId;
  }

  if (left.kind === 'onboarding' && right.kind === 'onboarding') {
    return left.storeId === right.storeId;
  }

  if (left.kind === 'geo-pin' && right.kind === 'geo-pin') {
    return left.storeId === right.storeId;
  }

  if (left.kind === 'visit-log' && right.kind === 'visit-log') {
    return left.storeId === right.storeId;
  }

  return true;
}

export function FieldSurfaceHost() {
  const [stores, setStores] = React.useState<FieldStoreFile[]>(() => readFieldStoresLocal());
  const [routeStack, setRouteStack] = React.useState<FieldRoute[]>([{ kind: 'stores' }]);
  const [activationRequests, setActivationRequests] = React.useState<Record<string, DshFieldStoreActivationRequestValues>>({});
  const [geoPinValues, setGeoPinValues] = React.useState<Record<string, DshFieldStoreGeoPinValues>>({});
  const [visitLogValues, setVisitLogValues] = React.useState<Record<string, DshFieldStoreVisitLogValues>>({});

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
    setActivationRequests((current) => ({
      ...current,
      [nextStore.id]: {
        storeName: nextStore.name,
        ownerName: '',
        ownerPhone: '',
        city: nextStore.location,
        zone: '',
        activationNote: '',
      },
    }));
    pushRoute({ kind: 'activation-request', storeId: nextStore.id });
  }, [pushRoute]);

  const handleLogout = React.useCallback(() => {
    setRouteStack([{ kind: 'stores' }]);
  }, []);

  const activeStore = route.kind === 'onboarding' ? stores.find((store) => store.id === route.storeId) ?? null : null;
  const activeActivationRequest = route.kind === 'activation-request' ? stores.find((store) => store.id === route.storeId) ?? null : null;
  const activeGeoPinStore = route.kind === 'geo-pin' ? stores.find((store) => store.id === route.storeId) ?? null : null;
  const activeVisitLogStore = route.kind === 'visit-log' ? stores.find((store) => store.id === route.storeId) ?? null : null;

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

  if (route.kind === 'activation-request' && activeActivationRequest) {
    const values = activationRequests[activeActivationRequest.id] ?? {
      storeName: activeActivationRequest.name,
      ownerName: '',
      ownerPhone: '',
      city: activeActivationRequest.location,
      zone: '',
      activationNote: '',
    };

    content = (
      <DshFieldStoreActivationRequestScreen
        values={values}
        onRetry={popRoute}
        onChange={(field, value) => {
          setActivationRequests((current) => ({
            ...current,
            [activeActivationRequest.id]: {
              ...values,
              [field]: value,
            },
          }));
        }}
        onSubmit={() => {
          const nextValues = activationRequests[activeActivationRequest.id] ?? values;

          updateStore(activeActivationRequest.id, (store) => ({
            ...store,
            name: nextValues.storeName.trim() || store.name,
            location: nextValues.city.trim() || store.location,
            draft: {
              ...store.draft,
              basics: {
                ...store.draft.basics,
                storeName: nextValues.storeName,
                ownerName: nextValues.ownerName,
                ownerPhone: nextValues.ownerPhone,
              },
              location: {
                ...store.draft.location,
                city: nextValues.city,
                zone: nextValues.zone,
              },
              review: {
                ...store.draft.review,
                fieldNotes: nextValues.activationNote ?? store.draft.review.fieldNotes,
              },
              lastSavedLabel: 'الآن',
            },
            lastUpdatedLabel: 'الآن',
            lifecycleNote: 'تم تسجيل طلب التفعيل الميداني.',
          }));

          pushRoute({ kind: 'onboarding', storeId: activeActivationRequest.id });
        }}
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
        onSubmitReview={() => {
          updateStore(activeStore.id, submitFieldStoreForReview);
          pushRoute({ kind: 'geo-pin', storeId: activeStore.id });
        }}
      />
    );
  }

  if (route.kind === 'geo-pin' && activeGeoPinStore) {
    const values = geoPinValues[activeGeoPinStore.id] ?? {
      latitude: activeGeoPinStore.draft.location.latitude,
      longitude: activeGeoPinStore.draft.location.longitude,
      landmark: activeGeoPinStore.draft.location.landmark,
      accuracyMeters: '',
    };

    content = (
      <DshFieldStoreGeoPinScreen
        values={values}
        onRetry={popRoute}
        onChange={(field, value) => {
          setGeoPinValues((current) => ({
            ...current,
            [activeGeoPinStore.id]: {
              ...values,
              [field]: value,
            },
          }));
        }}
        onCapturePin={() => {
          setGeoPinValues((current) => ({
            ...current,
            [activeGeoPinStore.id]: {
              ...values,
              accuracyMeters: '12',
            },
          }));
        }}
        onConfirmPin={() => {
          const nextValues = geoPinValues[activeGeoPinStore.id] ?? values;

          updateStore(activeGeoPinStore.id, (store) => ({
            ...store,
            draft: {
              ...store.draft,
              location: {
                ...store.draft.location,
                latitude: nextValues.latitude,
                longitude: nextValues.longitude,
                landmark: nextValues.landmark,
              },
              lastSavedLabel: 'الآن',
            },
            lastUpdatedLabel: 'الآن',
            lifecycleNote: 'تم تثبيت نقطة الموقع الميداني.',
          }));

          pushRoute({ kind: 'visit-log', storeId: activeGeoPinStore.id });
        }}
      />
    );
  }

  if (route.kind === 'visit-log' && activeVisitLogStore) {
    const values = visitLogValues[activeVisitLogStore.id] ?? {
      visitSummary: '',
      followUpAction: '',
    };

    content = (
      <DshFieldStoreVisitLogScreen
        values={values}
        onRetry={popRoute}
        onChange={(field, value) => {
          setVisitLogValues((current) => ({
            ...current,
            [activeVisitLogStore.id]: {
              ...values,
              [field]: value,
            },
          }));
        }}
        onSubmit={() => {
          const nextValues = visitLogValues[activeVisitLogStore.id] ?? values;

          updateStore(activeVisitLogStore.id, (store) => ({
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
