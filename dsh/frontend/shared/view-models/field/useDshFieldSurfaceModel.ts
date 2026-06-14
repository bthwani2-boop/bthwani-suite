import React from 'react';
import {
  applyFieldDocumentUploadToStore,
  useFieldRuntimeActions,
} from '../../runtime/use-field-runtime-actions';
import {
  createManualFieldStore,
  submitFieldStoreForReview,
  touchFieldStoreDraft,
  type FieldStoreFile,
} from '../../contracts/field-store-model';
import type {
  DshFieldNavigationCommand,
  DshFieldRouteState,
} from '../../contracts/field-surface-model';
import type {
  DshFieldStoreVisitErrors,
  DshFieldStoreVisitValues,
} from '../../contracts/dsh-field-visit.contract';
import type { DshFieldDocumentKind } from '../../api';

export type DshFieldReadinessEscalationState = 'ready' | 'loading' | 'pending-response' | 'error' | 'offline';

export type DshFieldEscalationTargetModel = {
  readonly id: string;
  readonly label: string;
  readonly isSelected: boolean;
};

const DEFAULT_ESCALATION_TARGET = 'partner-management';
const ESCALATION_TARGETS = [
  { id: 'partner-management', label: 'قسم الشركاء (Partner Management)' },
  { id: 'control-panel', label: 'لوحة التحكم المركزية (Control Panel)' },
  { id: 'marketing', label: 'فريق التسويق (Marketing)' },
] as const;

function isSameRoute(left: DshFieldRouteState, right: DshFieldRouteState) {
  if (left.kind !== right.kind) return false;
  if (
    (left.kind === 'onboarding' || left.kind === 'visit' || left.kind === 'readiness-escalation' || left.kind === 'document-upload') &&
    (right.kind === 'onboarding' || right.kind === 'visit' || right.kind === 'readiness-escalation' || right.kind === 'document-upload')
  ) {
    return left.storeId === right.storeId;
  }
  return true;
}

function resolveCommandRoute(command?: DshFieldNavigationCommand): DshFieldRouteState | null {
  if (!command) return null;
  if (
    command.target === 'onboarding' ||
    command.target === 'visit' ||
    command.target === 'readiness-escalation' ||
    command.target === 'document-upload'
  ) {
    return command.storeId ? { kind: command.target, storeId: command.storeId } : { kind: 'stores' };
  }
  return { kind: command.target };
}

function resolveBottomActiveId(route: DshFieldRouteState) {
  if (route.kind === 'stores') return 'tasks';
  if (route.kind === 'history') return 'history';
  if (route.kind === 'finance') return 'finance';
  if (['account', 'profile', 'onboarding', 'visit', 'readiness-escalation'].includes(route.kind)) return 'profile';
  return '';
}

function canShowBottomNav(route: DshFieldRouteState) {
  return route.kind === 'stores' || route.kind === 'history' || route.kind === 'finance' || route.kind === 'account';
}

export function resolveFieldDocumentDraftMediaKey(kind: string, timeSource: () => number = Date.now) {
  return `field.doc.${kind}.${timeSource().toString().slice(-4)}`;
}

export function useDshFieldSurfaceModel(command?: DshFieldNavigationCommand) {
  const [stores, setStores] = React.useState<FieldStoreFile[]>([]);
  const [routeStack, setRouteStack] = React.useState<DshFieldRouteState[]>([{ kind: 'stores' }]);
  const [visitValues, setVisitValues] = React.useState<Record<string, DshFieldStoreVisitValues>>({});
  const [visitErrors, setVisitErrors] = React.useState<Record<string, DshFieldStoreVisitErrors>>({});
  const [selectedEscalationTargetByStore, setSelectedEscalationTargetByStore] = React.useState<Record<string, string>>({});
  const [readinessEscalationStateByStore, setReadinessEscalationStateByStore] =
    React.useState<Record<string, DshFieldReadinessEscalationState>>({});
  const fieldRuntime = useFieldRuntimeActions();

  const route = routeStack[routeStack.length - 1] ?? { kind: 'stores' };
  const activeStore = ('storeId' in route)
    ? stores.find((store) => store.id === route.storeId) ?? null
    : null;

  React.useEffect(() => {
    if ('storeId' in route && !activeStore) {
      setRouteStack([{ kind: 'stores' }]);
      return;
    }
    if (typeof command?.token !== 'number') return;
    const nextRoute = resolveCommandRoute(command);
    if (nextRoute) setRouteStack([nextRoute]);
  }, [activeStore, command, route]);

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

  const patchStore = React.useCallback((storeId: string, updater: (store: FieldStoreFile) => FieldStoreFile) => {
    setStores((current) => current.map((store) => (store.id === storeId ? updater(store) : store)));
  }, []);

  const handleCreateStore = React.useCallback(() => {
    const nextStore = createManualFieldStore();
    setStores((current) => [{
      ...nextStore,
      draft: {
        ...nextStore.draft,
        basics: { ...nextStore.draft.basics, storeName: nextStore.name },
        location: { ...nextStore.draft.location, city: nextStore.location },
      },
    }, ...current]);
    pushRoute({ kind: 'onboarding', storeId: nextStore.id });
  }, [pushRoute]);

  const handleSaveDraft = React.useCallback((storeId: string) => {
    patchStore(storeId, (store) => ({
      ...store,
      lastUpdatedLabel: 'الآن',
      draft: { ...store.draft, lastSavedLabel: 'الآن' },
    }));
  }, [patchStore]);

  const handleSubmitReview = React.useCallback((store: FieldStoreFile) => {
    void fieldRuntime.createStoreFromDraft(store).catch(() => {});
    patchStore(store.id, submitFieldStoreForReview);
    pushRoute({ kind: 'visit', storeId: store.id });
  }, [fieldRuntime, patchStore, pushRoute]);

  const handleVisitValueChange = React.useCallback((storeId: string, values: DshFieldStoreVisitValues, field: keyof DshFieldStoreVisitValues, value: string) => {
    setVisitValues((current) => ({ ...current, [storeId]: { ...values, [field]: value } }));
    setVisitErrors((current) => {
      const next = { ...current[storeId] };
      delete next[field];
      return { ...current, [storeId]: next };
    });
  }, []);

  const handleVisitSubmit = React.useCallback((store: FieldStoreFile, fallbackValues: DshFieldStoreVisitValues) => {
    const nextValues = visitValues[store.id] ?? fallbackValues;
    const nextErrors: DshFieldStoreVisitErrors = {};
    if (!nextValues.visitSummary.trim()) nextErrors.visitSummary = 'اكتب ملخص الزيارة قبل الإرسال.';
    if (!nextValues.followUpAction.trim()) nextErrors.followUpAction = 'حدد خطوة المتابعة قبل الإرسال.';
    if (nextErrors.visitSummary || nextErrors.followUpAction) {
      setVisitErrors((current) => ({ ...current, [store.id]: nextErrors }));
      return;
    }
    void fieldRuntime.submitVisit(store.id, nextValues).catch(() => {});
    patchStore(store.id, (current) => ({
      ...current,
      lifecycleNote: nextValues.visitSummary.trim() || current.lifecycleNote,
      reviewFeedback: nextValues.followUpAction.trim() || current.reviewFeedback,
      lastUpdatedLabel: 'الآن',
    }));
    pushRoute({ kind: 'history' });
  }, [fieldRuntime, patchStore, pushRoute, visitValues]);

  const handleDocumentUpload = React.useCallback(async (store: FieldStoreFile, kind: DshFieldDocumentKind, uploadedRef: string) => {
    await fieldRuntime.submitDocument(store.id, kind, uploadedRef);
    patchStore(store.id, (current) => applyFieldDocumentUploadToStore(current, kind, uploadedRef));
  }, [fieldRuntime, patchStore]);

  const resolveEscalationTargets = React.useCallback((storeId: string): readonly DshFieldEscalationTargetModel[] => {
    const selectedTargetId = selectedEscalationTargetByStore[storeId] ?? DEFAULT_ESCALATION_TARGET;
    return ESCALATION_TARGETS.map((target) => ({ ...target, isSelected: target.id === selectedTargetId }));
  }, [selectedEscalationTargetByStore]);

  const handleEscalationTargetSelect = React.useCallback((storeId: string, targetId: string) => {
    setSelectedEscalationTargetByStore((current) => ({ ...current, [storeId]: targetId }));
  }, []);

  const handleEscalationSubmit = React.useCallback((store: FieldStoreFile, reason: string) => {
    const targets = resolveEscalationTargets(store.id);
    const selectedTargetId = selectedEscalationTargetByStore[store.id] ?? DEFAULT_ESCALATION_TARGET;
    const target = targets.find((item) => item.id === selectedTargetId);
    const label = target?.label ?? 'قسم الشركاء (Partner Management)';
    patchStore(store.id, (current) => touchFieldStoreDraft({
      ...current,
      lockedStatus: 'follow-up-required',
      statusNoteOverride: `بانتظار رد ${label}`,
      reviewFeedback: reason.trim() || current.reviewFeedback,
      draft: {
        ...current.draft,
        review: {
          ...current.draft.review,
          partnerReviewNote: reason.trim() || current.draft.review.partnerReviewNote,
        },
      },
    }, `تم تصعيد عائق الجاهزية إلى ${label}.`));
    setReadinessEscalationStateByStore((current) => ({ ...current, [store.id]: 'pending-response' }));
  }, [patchStore, resolveEscalationTargets, selectedEscalationTargetByStore]);

  const handleEscalationRetry = React.useCallback((storeId: string) => {
    setReadinessEscalationStateByStore((current) => ({ ...current, [storeId]: 'ready' }));
  }, []);

  return {
    model: {
      route,
      routeStackDepth: routeStack.length,
      stores,
      activeStore,
      visitValues,
      visitErrors,
      readinessEscalationStateByStore,
      bottomNav: {
        activeId: resolveBottomActiveId(route),
        visible: canShowBottomNav(route),
      },
    },
    actions: {
      pushRoute,
      popRoute,
      resetToStores,
      patchStore,
      handleCreateStore,
      handleSaveDraft,
      handleSubmitReview,
      handleVisitValueChange,
      handleVisitSubmit,
      handleDocumentUpload,
      resolveEscalationTargets,
      handleEscalationTargetSelect,
      handleEscalationSubmit,
      handleEscalationRetry,
    },
  } as const;
}
