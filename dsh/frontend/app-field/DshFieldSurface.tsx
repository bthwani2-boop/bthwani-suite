import React from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { useAppFieldAppearance } from '../../../app-field/shell/appearance';
import { BottomNavBar, useTheme } from '@bthwani/ui-kit';
import { DshFieldFinanceScreen } from './screens/DshFieldFinanceScreen';
import { DshFieldProfileHomeScreen } from './screens/DshFieldProfileHomeScreen';
import { DshFieldProfileScreen } from './screens/DshFieldProfileScreen';
import { DshFieldReadinessEscalationScreen } from './screens/DshFieldReadinessEscalationScreen';
import { DshFieldStoreOnboardingScreen } from './screens/DshFieldStoreOnboardingScreen';
import {
  DshFieldStoreVisitScreen,
  type DshFieldStoreVisitErrors,
  type DshFieldStoreVisitValues,
  type DshFieldVisitEvidenceItem,
} from './screens/DshFieldStoreVisitScreen';
import { DshFieldStoresHistoryScreen } from './screens/DshFieldStoresHistoryScreen';
import { DshFieldStoresScreen } from './screens/DshFieldStoresScreen';
import { DshFieldDocumentUploadScreen } from './screens/DshFieldDocumentUploadScreen';
import { readFieldStoresLocal, writeFieldStoresLocal } from './storage/field-onboarding.storage';
import {
  createManualFieldStore,
  submitFieldStoreForReview,
  touchFieldStoreDraft,
  type FieldStoreFile,
} from '../data/stores.preview-data';
import {
  createDshFieldVisitHttpClient,
  createDshFieldStoreOnboardingHttpClient,
  createDshFieldDocumentHttpClient,
  resolveDshFieldVisitBaseUrl,
  resolveDshFieldStoreOnboardingBaseUrl,
  resolveDshFieldDocumentBaseUrl,
  PlatformVarsProvider,
  FeatureFlagProvider,
} from '../shared';
import type { DshFieldNavigationCommand, DshFieldRouteState, DshFieldSurfaceProps } from './dsh-field.types';
import {
  getFieldRouteForLifecycle,
} from './dsh-field.navigation-bridge';

type DshFieldReadinessEscalationState = NonNullable<React.ComponentProps<typeof DshFieldReadinessEscalationScreen>['state']>;

const DEFAULT_FIELD_ESCALATION_TARGET_ID = 'partner-management';
const FIELD_VISIT_EVIDENCE_ITEMS: readonly DshFieldVisitEvidenceItem[] = [
  {
    id: 'field.visit.front-signage.v1',
    title: 'صورة الواجهة',
    subtitle: 'إثبات الزيارة من مدخل المتجر الرئيسي.',
    statusLabel: 'محتفظ به',
    capturedAtLabel: '10:14 ص',
  },
  {
    id: 'field.visit.owner-availability.v1',
    title: 'ملاحظة توافر المالك',
    subtitle: 'تأكيد ساعات العمل والجاهزية للخطوة التالية.',
    statusLabel: 'مسجل',
    capturedAtLabel: '10:19 ص',
  },
];

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

export function DshFieldSurface(props: DshFieldSurfaceProps) {
  return (
    <PlatformVarsProvider>
      <FeatureFlagProvider>
        <DshFieldSurfaceInner {...props} />
      </FeatureFlagProvider>
    </PlatformVarsProvider>
  );
}

function DshFieldSurfaceInner({ command, onExit }: DshFieldSurfaceProps = {}) {
  const { theme } = useTheme();
  const {
    hydrated: appearanceHydrated,
    mode: appearanceMode,
    setMode: setAppearanceMode,
  } = useAppFieldAppearance();
  const [stores, setStores] = React.useState<FieldStoreFile[]>(() => readFieldStoresLocal());
  const [routeStack, setRouteStack] = React.useState<DshFieldRouteState[]>([{ kind: 'stores' }]);
  const [visitValues, setVisitValues] = React.useState<Record<string, DshFieldStoreVisitValues>>({});
  const [visitErrors, setVisitErrors] = React.useState<Record<string, DshFieldStoreVisitErrors>>({});
  const [selectedEscalationTargetByStore, setSelectedEscalationTargetByStore] = React.useState<Record<string, string>>({});
  const [readinessEscalationStateByStore, setReadinessEscalationStateByStore] = React.useState<Record<string, DshFieldReadinessEscalationState>>({});
  const fieldStoreOnboardingClient = React.useMemo(
    () => createDshFieldStoreOnboardingHttpClient(resolveDshFieldStoreOnboardingBaseUrl()),
    [],
  );
  const fieldVisitClient = React.useMemo(
    () => createDshFieldVisitHttpClient(resolveDshFieldVisitBaseUrl()),
    [],
  );
  const fieldDocumentClient = React.useMemo(
    () => createDshFieldDocumentHttpClient(resolveDshFieldDocumentBaseUrl()),
    [],
  );

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
        onUploadDocument={(storeId) => pushRoute({ kind: 'document-upload', storeId })}
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
          const name = (activeStore.draft.basics.storeName || activeStore.name).trim();
          const address = (activeStore.draft.location.addressLine || activeStore.location).trim();
          const categoryId = (activeStore.draft.classification.mainCategory || activeStore.category).trim();

          void fieldStoreOnboardingClient.createFieldStore({
            name: name || activeStore.name,
            address: address || activeStore.location,
            category_id: categoryId || undefined,
            supports_pickup: false,
            supports_partner_delivery: true,
          }).catch(() => {
            // Keep the field workflow usable offline; runtime evidence validates the API path.
          });

          updateStore(activeStore.id, submitFieldStoreForReview);
          pushRoute({ kind: 'visit', storeId: activeStore.id });
        }}
        onEscalate={() => pushRoute({ kind: 'readiness-escalation', storeId: activeStore.id })}
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
        errors={visitErrors[activeStore.id]}
        evidenceItems={FIELD_VISIT_EVIDENCE_ITEMS}
        onRetry={popRoute}
        onChange={(field, value) => {
          setVisitValues((current) => ({
            ...current,
            [activeStore.id]: {
              ...values,
              [field]: value,
            },
          }));
          setVisitErrors((current) => {
            const nextStoreErrors = { ...current[activeStore.id] };
            delete nextStoreErrors[field];
            return {
              ...current,
              [activeStore.id]: nextStoreErrors,
            };
          });
        }}
        onSubmit={() => {
          const nextValues = visitValues[activeStore.id] ?? values;
          const nextErrors: DshFieldStoreVisitErrors = {};

          if (!nextValues.visitSummary.trim()) {
            nextErrors.visitSummary = 'اكتب ملخص الزيارة قبل الإرسال.';
          }
          if (!nextValues.followUpAction.trim()) {
            nextErrors.followUpAction = 'حدد خطوة المتابعة قبل الإرسال.';
          }
          if (nextErrors.visitSummary || nextErrors.followUpAction) {
            setVisitErrors((current) => ({ ...current, [activeStore.id]: nextErrors }));
            return;
          }

          void fieldVisitClient.createFieldVisit(activeStore.id, {
            visit_summary: nextValues.visitSummary.trim(),
            follow_up_action: nextValues.followUpAction.trim(),
            evidence_media_keys: FIELD_VISIT_EVIDENCE_ITEMS.map((item) => item.id),
            location_confidence: 'manual_confirmed',
          }).catch(() => {
            // Keep the field visit workflow usable offline; runtime evidence validates the API path.
          });

          updateStore(activeStore.id, (store) => ({
            ...store,
            lifecycleNote: nextValues.visitSummary.trim() || store.lifecycleNote,
            reviewFeedback: nextValues.followUpAction.trim() || store.reviewFeedback,
            lastUpdatedLabel: 'الآن',
          }));

          // SSoT: visit_completed → history (via dsh-field.navigation-bridge)
          const visitCompletedRoute = getFieldRouteForLifecycle('visit_completed').primaryRoute;
          pushRoute({ kind: visitCompletedRoute as DshFieldRouteState['kind'] });
        }}
      />
    );
  }

  if (route.kind === 'account') {
    content = (
      <DshFieldProfileHomeScreen
        stores={stores}
        appearanceHydrated={appearanceHydrated}
        appearanceMode={appearanceMode}
        onAppearanceModeChange={setAppearanceMode}
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

  if (route.kind === 'document-upload' && activeStore) {
    content = (
      <DshFieldDocumentUploadScreen
        storeId={activeStore.id}
        onBack={popRoute}
        onSubmit={async (kind, mediaKey) => {
          await fieldDocumentClient.createFieldDocument(activeStore.id, {
            document_kind: kind,
            media_key: mediaKey,
          });

          // Update store draft documents status to 'uploaded'
          updateStore(activeStore.id, (store) => {
            const docs = { ...store.draft.documents };
            if (kind === 'commercial_registration') {
              docs.commercialRegistrationStatus = 'uploaded';
              docs.commercialRegistrationRef = mediaKey;
            } else if (kind === 'identity_proof') {
              docs.ownerIdStatus = 'uploaded';
              docs.ownerIdRef = mediaKey;
            } else if (kind === 'tax_certificate') {
              docs.tradeLicenseStatus = 'uploaded';
              docs.tradeLicenseRef = mediaKey;
            } else if (kind === 'storefront_photo') {
              store.draft.photos.storefrontPhotoRef = mediaKey;
            } else if (kind === 'interior_photo') {
              store.draft.photos.interiorPhotoRef = mediaKey;
            }
            return {
              ...store,
              lastUpdatedLabel: 'الآن',
              draft: {
                ...store.draft,
                documents: docs,
              },
            };
          });
        }}
      />
    );
  }

  if (route.kind === 'readiness-escalation' && activeStore) {
    const selectedEscalationTargetId = selectedEscalationTargetByStore[activeStore.id] ?? DEFAULT_FIELD_ESCALATION_TARGET_ID;
    const readinessEscalationState = readinessEscalationStateByStore[activeStore.id] ?? 'ready';
    const escalationTargets = [
      { id: 'partner-management', label: 'قسم الشركاء (Partner Management)' },
      { id: 'control-panel', label: 'لوحة التحكم المركزية (Control Panel)' },
      { id: 'marketing', label: 'فريق التسويق (Marketing)' },
    ].map((target) => ({
      ...target,
      isSelected: target.id === selectedEscalationTargetId,
    }));

    content = (
      <DshFieldReadinessEscalationScreen
        state={readinessEscalationState}
        storeName={activeStore.name}
        missingRequirements={[
          'التحقق من إعداد موصل المتجر إذا طلب الشريك تفعيل توصيل المتجر (partner_delivery)',
        ]}
        escalationTargets={escalationTargets}
        onSelectTarget={(targetId) => {
          setSelectedEscalationTargetByStore((current) => ({
            ...current,
            [activeStore.id]: targetId,
          }));
        }}
        onSubmit={(reason) => {
          const selectedTarget = escalationTargets.find((target) => target.id === selectedEscalationTargetId);
          const selectedTargetLabel = selectedTarget?.label ?? 'قسم الشركاء (Partner Management)';

          updateStore(activeStore.id, (store) =>
            touchFieldStoreDraft({
              ...store,
              lockedStatus: 'follow-up-required',
              statusNoteOverride: `بانتظار رد ${selectedTargetLabel}`,
              reviewFeedback: reason.trim() || store.reviewFeedback,
              draft: {
                ...store.draft,
                review: {
                  ...store.draft.review,
                  partnerReviewNote: reason.trim() || store.draft.review.partnerReviewNote,
                },
              },
            }, `تم تصعيد عائق الجاهزية إلى ${selectedTargetLabel}.`),
          );

          setReadinessEscalationStateByStore((current) => ({
            ...current,
            [activeStore.id]: 'pending-response',
          }));
        }}
        onBack={popRoute}
        onRetry={() => {
          setReadinessEscalationStateByStore((current) => ({
            ...current,
            [activeStore.id]: 'ready',
          }));
        }}
      />
    );
  }

  let fieldBottomActiveId = '';
  if (route.kind === 'stores') {
    fieldBottomActiveId = 'tasks';
  } else if (route.kind === 'history') {
    fieldBottomActiveId = 'history';
  } else if (route.kind === 'finance') {
    fieldBottomActiveId = 'finance';
  } else if (
    route.kind === 'account' ||
    route.kind === 'profile' ||
    route.kind === 'onboarding' ||
    route.kind === 'visit' ||
    route.kind === 'readiness-escalation'
  ) {
    fieldBottomActiveId = 'profile';
  }

  const fieldBottomNavBar = (
    <BottomNavBar
      activeId={fieldBottomActiveId}
      direction="rtl"
      launcherLabel="إضافة"
      launcherIcon="add-circle-outline"
      onLauncherPress={handleCreateStore}
      onSelect={(id: string) => {
        if (id === 'tasks') resetToStores();
        if (id === 'history') pushRoute({ kind: 'history' });
        if (id === 'finance') pushRoute({ kind: 'finance' });
        if (id === 'profile') pushRoute({ kind: 'account' });
      }}
      items={[
        { id: 'tasks', label: 'المهام', icon: 'list-outline', activeIcon: 'list' },
        { id: 'history', label: 'السجل', icon: 'time-outline', activeIcon: 'time' },
        { id: 'finance', label: 'المالية', icon: 'cash-outline', activeIcon: 'cash' },
        { id: 'profile', label: 'حسابي', icon: 'person-outline', activeIcon: 'person' },
      ]}
    />
  );

  const showBottomNav =
    route.kind === 'stores' ||
    route.kind === 'history' ||
    route.kind === 'finance' ||
    route.kind === 'account';

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface, position: 'relative' }}>
      <View style={{ flex: 1, paddingBottom: showBottomNav ? 80 : 0 }}>
        {content}
      </View>
      {showBottomNav && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
          {fieldBottomNavBar}
        </View>
      )}
    </View>
  );
}

export default DshFieldSurface;
