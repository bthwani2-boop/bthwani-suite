// Canonical location: dsh/frontend/app-field/field.surface-model.ts
// Authority: dsh/frontend/app-field — consolidated orchestration model & helpers for field surface.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import {
  createPartnerDocumentHttpClient,
  resolvePartnerDocumentBaseUrl,
  type PartnerDocumentKind,
} from '../shared/stores';
import {
  createPartnerStoreOnboardingHttpClient,
  resolvePartnerStoreOnboardingBaseUrl,
  resolveOnboardingStoreStatus,
  resolveOnboardingStoreStatusLabel,
  resolveOnboardingStoreStatusTone,
  resolveOnboardingStoreLifecycleLabel,
  resolveOnboardingStoreNextActionLabel,
  isOnboardingStoreReadOnly,
  createEmptyDraft,
  getPartnerRequiredMissingItems,
  resolvePartnerSectionSummaries,
  resolvePartnerCompletionPercent,
  touchOnboardingStoreDraft,
  submitOnboardingStoreForReview,
  createManualOnboardingStore,
  matchesOnboardingStoreFilter,
  type PartnerOnboardingFilter,
} from '../shared/stores';
import {
  createDshFieldVisitHttpClient,
  resolveDshFieldVisitBaseUrl,
} from '../shared/dsh-field-visit-client';
import type {
  FieldStoreFile,
  DshFieldNavigationCommand,
  DshFieldRouteState,
  FieldLeadStatus,
  FieldLeadFilter,
  DshFieldStoreVisitValues,
  DshFieldStoreVisitErrors,
} from './dsh-field.routes';
import { usePartnerOnboardingDraftModel } from '../shared/stores/partner-onboarding-draft.model';
import { usePartnerReadinessEscalationModel } from '../shared/stores/partner-readiness-escalation.model';
import { usePartnerReadinessModel } from '../shared/stores/partner-readiness.model';

export type { PartnerReadinessEscalationState, PartnerEscalationTargetModel } from '../shared/stores';
export {
  createEmptyDraft,
  getPartnerRequiredMissingItems,
  resolvePartnerSectionSummaries,
  resolvePartnerCompletionPercent,
};

// ─── Visit Validation ─────────────────────────────────────────────────────────
export function validateVisitFields(values: DshFieldStoreVisitValues): DshFieldStoreVisitErrors {
  const errors: DshFieldStoreVisitErrors = {};
  if (!values.visitSummary.trim()) errors.visitSummary = 'اكتب ملخص الزيارة قبل الإرسال.';
  return errors;
}

export function hasVisitErrors(errors: DshFieldStoreVisitErrors): boolean {
  return Object.keys(errors).length > 0;
}

// ─── Store Lifecycle Helpers ──────────────────────────────────────────────────
export function resolveFieldStoreStatus(store: FieldStoreFile): FieldLeadStatus {
  const status = resolveOnboardingStoreStatus(store);
  if (status === 'new-lead') return 'new-lead';
  if (status === 'offer-pending-approval') return 'offer-pending-approval';
  if (status === 'offer-approved') return 'offer-approved';
  if (status === 'follow-up-required') return 'follow-up-required';
  if (status === 'ready-for-onboarding') return 'ready-for-onboarding';
  if (status === 'submitted') return 'submitted';
  return 'new-lead';
}

export function resolveFieldStoreStatusLabel(store: FieldStoreFile): string {
  return resolveOnboardingStoreStatusLabel(store);
}

export function resolveFieldStoreStatusTone(store: FieldStoreFile) {
  return resolveOnboardingStoreStatusTone(store);
}

export function resolveFieldStoreLifecycleLabel(store: FieldStoreFile): string {
  return resolveOnboardingStoreLifecycleLabel(store);
}

export function resolveFieldStoreNextActionLabel(store: FieldStoreFile): string {
  return resolveOnboardingStoreNextActionLabel(store);
}

export function isFieldStoreReadOnly(store: FieldStoreFile): boolean {
  return isOnboardingStoreReadOnly(store);
}

export function matchesFieldStoreFilter(store: FieldStoreFile, filter: FieldLeadFilter): boolean {
  return matchesOnboardingStoreFilter(store, filter as PartnerOnboardingFilter);
}

export function resolveFieldFilterCounts(stores: readonly FieldStoreFile[]): Record<FieldLeadFilter, number> {
  return {
    all: stores.length,
    today: stores.filter((s) => matchesFieldStoreFilter(s, 'today')).length,
    ready: stores.filter((s) => matchesFieldStoreFilter(s, 'ready')).length,
    'follow-up': stores.filter((s) => matchesFieldStoreFilter(s, 'follow-up')).length,
    pending: stores.filter((s) => matchesFieldStoreFilter(s, 'pending')).length,
    submitted: stores.filter((s) => matchesFieldStoreFilter(s, 'submitted')).length,
    done: stores.filter((s) => matchesFieldStoreFilter(s, 'done')).length,
  };
}

export function touchFieldStoreDraft(store: FieldStoreFile, note?: string): FieldStoreFile {
  return touchOnboardingStoreDraft(store, note);
}

export function submitFieldStoreForReview(store: FieldStoreFile): FieldStoreFile {
  return submitOnboardingStoreForReview(store);
}

export function createManualFieldStore(): FieldStoreFile {
  return createManualOnboardingStore();
}

// ─── Navigation Model ─────────────────────────────────────────────────────────
function isSameRoute(left: DshFieldRouteState, right: DshFieldRouteState): boolean {
  if (left.kind !== right.kind) return false;
  if (left.kind === 'visit' && right.kind === 'visit') {
    return left.backendStoreId === right.backendStoreId;
  }
  if (left.kind === 'onboarding' && right.kind === 'onboarding') {
    return left.storeId === right.storeId;
  }
  if (left.kind === 'readiness-escalation' && right.kind === 'readiness-escalation') {
    return left.storeId === right.storeId;
  }
  if (left.kind === 'document-upload' && right.kind === 'document-upload') {
    return left.storeId === right.storeId;
  }
  return true;
}

function resolveCommandRoute(command?: DshFieldNavigationCommand): DshFieldRouteState | null {
  if (!command) return null;
  if (command.target === 'visit') {
    return command.storeId ? { kind: 'visit', backendStoreId: command.storeId } : { kind: 'stores' };
  }
  if (command.target === 'onboarding' || command.target === 'readiness-escalation' || command.target === 'document-upload' || command.target === 'products-upload') {
    return command.storeId ? { kind: command.target, storeId: command.storeId } : { kind: 'stores' };
  }
  return { kind: command.target };
}

export function resolveFieldBottomActiveId(route: DshFieldRouteState): string {
  if (route.kind === 'stores') return 'tasks';
  if (route.kind === 'history') return 'history';
  if (route.kind === 'finance') return 'finance';
  if (['account', 'profile', 'onboarding', 'visit', 'readiness-escalation', 'products-upload'].includes(route.kind)) return 'profile';
  return '';
}

export function canFieldShowBottomNav(route: DshFieldRouteState): boolean {
  return route.kind === 'stores' || route.kind === 'history' || route.kind === 'finance' || route.kind === 'account';
}

export function useFieldNavigationModel({ command }: { command: DshFieldNavigationCommand | undefined }) {
  const [routeStack, setRouteStack] = React.useState<DshFieldRouteState[]>([{ kind: 'stores' }]);

  const route = routeStack[routeStack.length - 1] ?? { kind: 'stores' };

  React.useEffect(() => {
    if (typeof command?.token !== 'number') return;
    const nextRoute = resolveCommandRoute(command);
    if (nextRoute) setRouteStack([nextRoute]);
  }, [command?.token]);

  const pushRoute = React.useCallback((nextRoute: DshFieldRouteState) => {
    setRouteStack((current) => {
      const activeRoute = current[current.length - 1];
      return activeRoute && isSameRoute(activeRoute, nextRoute) ? current : [...current, nextRoute];
    });
  }, []);

  const popRoute = React.useCallback(() => {
    setRouteStack((current) => (current.length > 1 ? current.slice(0, -1) : current));
  }, []);

  const resetToStores = React.useCallback(() => setRouteStack([{ kind: 'stores' }]), []);

  return { route, routeStack, pushRoute, popRoute, resetToStores };
}

// ─── Field Runtime Actions Hook ──────────────────────────────────────────────
export type DshFieldVisitDraftValues = {
  readonly visitSummary: string;
  readonly followUpAction: string;
};

export function useFieldRuntimeActions() {
  const partnerStoreOnboardingClient = React.useMemo(
    () => createPartnerStoreOnboardingHttpClient(resolvePartnerStoreOnboardingBaseUrl()),
    [],
  );
  const fieldVisitClient = React.useMemo(
    () => createDshFieldVisitHttpClient(resolveDshFieldVisitBaseUrl()),
    [],
  );
  const partnerDocumentClient = React.useMemo(
    () => createPartnerDocumentHttpClient(resolvePartnerDocumentBaseUrl()),
    [],
  );

  const createStoreFromDraft = React.useCallback(
    (store: FieldStoreFile) => {
      const name = (store.draft.basics.storeName || store.name).trim();
      const address = (store.draft.location.addressLine || store.location).trim();
      const categoryId = (store.draft.classification.mainCategory || store.category).trim();

      const contactNumber = store.draft.basics.ownerPhone.trim() || undefined;
      const openingHours = store.draft.offer.operatingHours.trim() || undefined;
      const catalogSummary = store.draft.products.sampleCatalogNote.trim() || undefined;

      return partnerStoreOnboardingClient.createStore({
        name: name || store.name,
        address: address || store.location,
        category_id: categoryId || undefined,
        supports_pickup: false,
        supports_partner_delivery: true,
        contact_number: contactNumber,
        opening_hours: openingHours,
        catalog_summary: catalogSummary,
      });
    },
    [partnerStoreOnboardingClient],
  );

  const submitVisit = React.useCallback(
    (storeId: string, values: DshFieldVisitDraftValues) =>
      fieldVisitClient.createFieldVisit(storeId, {
        visit_summary: values.visitSummary.trim(),
        follow_up_action: values.followUpAction.trim() || 'متابعة',
        evidence_media_keys: [],
        location_confidence: 'manual_confirmed',
      }),
    [fieldVisitClient],
  );

  const submitDocument = React.useCallback(
    (storeId: string, kind: string, uploadedRef: string) =>
      partnerDocumentClient.createDocument(storeId, {
        document_kind: kind as PartnerDocumentKind,
        media_key: uploadedRef,
      }),
    [partnerDocumentClient],
  );

  return {
    createStoreFromDraft,
    submitVisit,
    submitDocument,
  } as const;
}

// ─── Visit Model Hook ─────────────────────────────────────────────────────────
type FieldRuntime = ReturnType<typeof useFieldRuntimeActions>;
type PatchStore = (storeId: string, updater: (store: FieldStoreFile) => FieldStoreFile) => void;
type PushRoute = (route: DshFieldRouteState) => void;

export function useFieldVisitModel({
  fieldRuntime,
  patchStore,
  pushRoute,
}: {
  fieldRuntime: FieldRuntime;
  patchStore: PatchStore;
  pushRoute: PushRoute;
}) {
  const [visitValues, setVisitValues] = React.useState<Record<string, DshFieldStoreVisitValues>>({});
  const [visitErrors, setVisitErrors] = React.useState<Record<string, DshFieldStoreVisitErrors>>({});

  const handleVisitValueChange = React.useCallback(
    (storeId: string, values: DshFieldStoreVisitValues, field: keyof DshFieldStoreVisitValues, value: string) => {
      setVisitValues((current) => ({ ...current, [storeId]: { ...values, [field]: value } }));
      setVisitErrors((current) => {
        const next = { ...current[storeId] };
        delete next[field];
        return { ...current, [storeId]: next };
      });
    },
    [],
  );

  const handleVisitSubmit = React.useCallback(
    (store: FieldStoreFile, fallbackValues: DshFieldStoreVisitValues) => {
      const nextValues = visitValues[store.id] ?? fallbackValues;
      const nextErrors = validateVisitFields(nextValues);
      if (hasVisitErrors(nextErrors)) {
        setVisitErrors((current) => ({ ...current, [store.id]: nextErrors }));
        return;
      }
      if (!store.backendStoreId) {
        throw new Error('لا يمكن تسجيل زيارة ميدانية قبل تأكيد المتجر الخلفي وحصوله على معرّف معتمد (backendStoreId غير متوفر).');
      }
      patchStore(store.id, (s) => ({ ...s, syncStatus: 'syncing' as const }));
      void fieldRuntime.submitVisit(store.backendStoreId, nextValues).then(() => {
        patchStore(store.id, (s) => ({ ...s, syncStatus: 'backend' as const }));
      }).catch((err) => {
        console.error('[field:submit-visit] Error submitting visit:', err);
        patchStore(store.id, (s) => ({ ...s, syncStatus: 'sync-failed' as const }));
      });
      patchStore(store.id, (current) => ({
        ...current,
        lifecycleNote: nextValues.visitSummary.trim() || current.lifecycleNote,
        reviewFeedback: nextValues.followUpAction.trim() || current.reviewFeedback,
        lastUpdatedLabel: 'الآن',
      }));
      pushRoute({ kind: 'history' });
    },
    [fieldRuntime, patchStore, pushRoute, visitValues],
  );

  return { visitValues, visitErrors, handleVisitValueChange, handleVisitSubmit };
}

// ─── Main Surface Model Hook ─────────────────────────────────────────────────
export function useDshFieldSurfaceModel(command?: DshFieldNavigationCommand) {
  const fieldRuntime = useFieldRuntimeActions();

  const { route, routeStack, pushRoute, popRoute, resetToStores } = useFieldNavigationModel({ command });

  const pushOnboardingRoute = React.useCallback((nextRoute: { kind: string; storeId?: string; backendStoreId?: string }) => {
    if (nextRoute.kind === 'onboarding' && nextRoute.storeId) {
      pushRoute({ kind: 'onboarding', storeId: nextRoute.storeId });
      return;
    }
    if (nextRoute.kind === 'visit') {
      const backendStoreId = nextRoute.backendStoreId ?? nextRoute.storeId;
      pushRoute(backendStoreId ? { kind: 'visit', backendStoreId } : { kind: 'stores' });
      return;
    }
    if (nextRoute.kind === 'readiness-escalation' && nextRoute.storeId) {
      pushRoute({ kind: 'readiness-escalation', storeId: nextRoute.storeId });
      return;
    }
    if (nextRoute.kind === 'document-upload' && nextRoute.storeId) {
      pushRoute({ kind: 'document-upload', storeId: nextRoute.storeId });
      return;
    }
    if (nextRoute.kind === 'products-upload' && nextRoute.storeId) {
      pushRoute({ kind: 'products-upload', storeId: nextRoute.storeId });
      return;
    }
    if (
      nextRoute.kind === 'stores' ||
      nextRoute.kind === 'account' ||
      nextRoute.kind === 'profile' ||
      nextRoute.kind === 'history' ||
      nextRoute.kind === 'finance'
    ) {
      pushRoute({ kind: nextRoute.kind });
      return;
    }
    pushRoute({ kind: 'stores' });
  }, [pushRoute]);

  const draftModel = usePartnerOnboardingDraftModel({ onboardingRuntime: fieldRuntime, pushRoute: pushOnboardingRoute });
  const visitModel = useFieldVisitModel({ fieldRuntime, patchStore: draftModel.patchStore, pushRoute });
  const escalationModel = usePartnerReadinessEscalationModel({ patchStore: draftModel.patchStore });

  const activeStore = React.useMemo(() => {
    if (route.kind === 'visit') {
      return draftModel.stores.find((s) => s.backendStoreId === route.backendStoreId) ?? null;
    }
    if (!('storeId' in route)) return null;
    return draftModel.stores.find((s) => s.id === route.storeId) ?? null;
  }, [route, draftModel.stores]);

  const readiness = usePartnerReadinessModel(activeStore);

  React.useEffect(() => {
    if ((('storeId' in route) || route.kind === 'visit') && !activeStore) {
      resetToStores();
    }
  }, [activeStore, route, resetToStores]);

  return {
    model: {
      route,
      routeStackDepth: routeStack.length,
      stores: draftModel.stores,
      activeStore,
      visitValues: visitModel.visitValues,
      visitErrors: visitModel.visitErrors,
      readinessEscalationStateByStore: escalationModel.readinessEscalationStateByStore,
      readiness,
      bottomNav: {
        activeId: resolveFieldBottomActiveId(route),
        visible: canFieldShowBottomNav(route),
      },
    },
    actions: {
      pushRoute,
      popRoute,
      resetToStores,
      patchStore: draftModel.patchStore,
      handleCreateStore: draftModel.handleCreateStore,
      handleSaveDraft: draftModel.handleSaveDraft,
      handleSubmitReview: draftModel.handleSubmitReview,
      handleVisitValueChange: visitModel.handleVisitValueChange,
      handleVisitSubmit: visitModel.handleVisitSubmit,
      handleDocumentUpload: draftModel.handleDocumentUpload,
      resolveEscalationTargets: escalationModel.resolveEscalationTargets,
      handleEscalationTargetSelect: escalationModel.handleEscalationTargetSelect,
      handleEscalationSubmit: escalationModel.handleEscalationSubmit,
      handleEscalationRetry: escalationModel.handleEscalationRetry,
    },
  } as const;
}
