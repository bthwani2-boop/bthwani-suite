// dsh/frontend/shared/stores/readiness/partner-readiness.model.ts
// Authority: dsh/frontend/shared/stores — shared DSH stores/onboarding/review domain.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { OnboardingStoreFile } from './partner-onboarding-draft.model';
import {
  resolvePartnerCompletionPercent,
  isOnboardingStoreReadOnly,
  resolveOnboardingStoreStatus,
  resolveOnboardingStoreStatusLabel,
  resolveOnboardingStoreStatusTone,
  resolveOnboardingStoreLifecycleLabel,
  resolveOnboardingStoreNextActionLabel,
} from './partner-onboarding.lifecycle';

export function usePartnerReadinessModel(store: OnboardingStoreFile | null) {
  return React.useMemo(() => {
    if (!store) {
      return {
        completionPercent: 0,
        readOnly: false,
        status: 'new-lead' as const,
        statusLabel: '',
        statusTone: 'default' as const,
        lifecycleLabel: '',
        nextActionLabel: '',
      };
    }

    return {
      completionPercent: resolvePartnerCompletionPercent(store.draft),
      readOnly: isOnboardingStoreReadOnly(store),
      status: resolveOnboardingStoreStatus(store),
      statusLabel: resolveOnboardingStoreStatusLabel(store),
      statusTone: resolveOnboardingStoreStatusTone(store),
      lifecycleLabel: resolveOnboardingStoreLifecycleLabel(store),
      nextActionLabel: resolveOnboardingStoreNextActionLabel(store),
    };
  }, [store]);
}
