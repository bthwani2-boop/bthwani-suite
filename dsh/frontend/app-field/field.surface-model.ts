// Canonical location: dsh/frontend/shared/field/field.surface-model.ts
// Authority: dsh/frontend/shared/field — thin orchestration shell for field surface.
// Wires topic models (navigation from field, draft/visit/escalation from partner) together.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import { useFieldRuntimeActions } from './use-field-runtime-actions';
import type { DshFieldNavigationCommand } from './dsh-field.types';
import {
  useFieldNavigationModel,
  resolveFieldBottomActiveId,
  canFieldShowBottomNav,
} from './field-navigation.model';
import { usePartnerOnboardingDraftModel } from '../shared/partner/onboarding/partner-onboarding-draft.model';
import { useFieldVisitModel } from './field-visit.model';
import { usePartnerReadinessEscalationModel } from '../shared/partner/readiness/partner-readiness-escalation.model';
import { usePartnerReadinessModel } from '../shared/partner/readiness/partner-readiness.model';

export type { PartnerReadinessEscalationState, PartnerEscalationTargetModel } from '../shared/partner/readiness';

export function useDshFieldSurfaceModel(command?: DshFieldNavigationCommand) {
  const fieldRuntime = useFieldRuntimeActions();

  // navModel first — pushRoute is stable (useCallback [], []) so safe to pass to draftModel
  const { route, routeStack, pushRoute, popRoute, resetToStores } = useFieldNavigationModel({ command });

  // draftModel receives stable pushRoute from navModel
  const draftModel = usePartnerOnboardingDraftModel({ onboardingRuntime: fieldRuntime, pushRoute });
  const visitModel = useFieldVisitModel({ fieldRuntime, patchStore: draftModel.patchStore, pushRoute });
  const escalationModel = usePartnerReadinessEscalationModel({ patchStore: draftModel.patchStore });

  // activeStore derived in shell — avoids circular dep (navModel used to take stores)
  const activeStore = React.useMemo(() => {
    if (route.kind === 'visit') {
      return draftModel.stores.find((s) => s.backendStoreId === route.backendStoreId) ?? null;
    }
    if (!('storeId' in route)) return null;
    return draftModel.stores.find((s) => s.id === route.storeId) ?? null;
  }, [route, draftModel.stores]);

  const readiness = usePartnerReadinessModel(activeStore);

  // Guard: if current route points to a deleted storeId, fall back to stores list
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
