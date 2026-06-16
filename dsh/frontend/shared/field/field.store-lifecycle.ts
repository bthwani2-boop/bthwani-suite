// dsh/frontend/shared/field/field.store-lifecycle.ts
// Authority: shared/field — field filter matching and delegates onboarding logic to shared/partner/onboarding.
// No JSX. No ui-kit. No Tamagui.

import type {
  FieldStoreFile,
  FieldLeadStatus,
  FieldLeadFilter,
} from './field.types';
import {
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
} from '../partner/onboarding';

export {
  createEmptyDraft,
  getPartnerRequiredMissingItems,
  resolvePartnerSectionSummaries,
  resolvePartnerCompletionPercent,
};

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
  const status = resolveFieldStoreStatus(store);
  if (filter === 'all') return true;
  if (filter === 'today') return store.nextVisitLabel.includes('اليوم');
  if (filter === 'ready') return status === 'ready-for-onboarding';
  if (filter === 'follow-up') return status === 'follow-up-required';
  if (filter === 'pending') return status === 'new-lead' || status === 'offer-pending-approval';
  if (filter === 'submitted') return status === 'submitted';
  if (filter === 'done') return status === 'offer-approved';
  return true;
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
