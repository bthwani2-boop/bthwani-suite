// dsh/frontend/shared/partner/readiness/partner-readiness-escalation.model.ts
// Authority: shared/partner/readiness — onboarding readiness escalations state and actions.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { OnboardingStoreFile } from '../onboarding/partner-onboarding-draft.model';
import { touchOnboardingStoreDraft } from '../onboarding/partner-onboarding.lifecycle';

export type PartnerReadinessEscalationState = 'ready' | 'loading' | 'pending-response' | 'error' | 'offline';

export type PartnerEscalationTargetModel = {
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

type PatchStore = (storeId: string, updater: (store: OnboardingStoreFile) => OnboardingStoreFile) => void;

export function usePartnerReadinessEscalationModel({ patchStore }: { patchStore: PatchStore }) {
  const [selectedEscalationTargetByStore, setSelectedEscalationTargetByStore] =
    React.useState<Record<string, string>>({});
  const [readinessEscalationStateByStore, setReadinessEscalationStateByStore] =
    React.useState<Record<string, PartnerReadinessEscalationState>>({});

  const resolveEscalationTargets = React.useCallback(
    (storeId: string): readonly PartnerEscalationTargetModel[] => {
      const selectedTargetId = selectedEscalationTargetByStore[storeId] ?? DEFAULT_ESCALATION_TARGET;
      return ESCALATION_TARGETS.map((t) => ({ ...t, isSelected: t.id === selectedTargetId }));
    },
    [selectedEscalationTargetByStore],
  );

  const handleEscalationTargetSelect = React.useCallback((storeId: string, targetId: string) => {
    setSelectedEscalationTargetByStore((current) => ({ ...current, [storeId]: targetId }));
  }, []);

  const handleEscalationSubmit = React.useCallback(
    (store: OnboardingStoreFile, reason: string) => {
      const targets = resolveEscalationTargets(store.id);
      const selectedTargetId = selectedEscalationTargetByStore[store.id] ?? DEFAULT_ESCALATION_TARGET;
      const target = targets.find((t) => t.id === selectedTargetId);
      const label = target?.label ?? 'قسم الشركاء (Partner Management)';
      patchStore(store.id, (current) =>
        touchOnboardingStoreDraft(
          {
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
          },
          `تم تصعيد عائق الجاهزية إلى ${label}.`,
        ),
      );
      setReadinessEscalationStateByStore((current) => ({ ...current, [store.id]: 'pending-response' }));
    },
    [patchStore, resolveEscalationTargets, selectedEscalationTargetByStore],
  );

  const handleEscalationRetry = React.useCallback((storeId: string) => {
    setReadinessEscalationStateByStore((current) => ({ ...current, [storeId]: 'ready' }));
  }, []);

  return {
    readinessEscalationStateByStore,
    resolveEscalationTargets,
    handleEscalationTargetSelect,
    handleEscalationSubmit,
    handleEscalationRetry,
  };
}
