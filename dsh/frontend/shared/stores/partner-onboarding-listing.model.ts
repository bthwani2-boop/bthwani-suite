// dsh/frontend/shared/stores/onboarding/partner-onboarding-listing.model.ts
// Authority: dsh/frontend/shared/stores — shared DSH stores/onboarding/review domain.
// No JSX. No ui-kit. No Tamagui.

import type { OnboardingStoreFile } from './partner-onboarding-draft.model';
import type { PartnerOnboardingFilter } from './partner-onboarding.types';
import { resolveOnboardingStoreStatus } from './partner-onboarding.lifecycle';

export function matchesOnboardingStoreFilter(store: OnboardingStoreFile, filter: PartnerOnboardingFilter): boolean {
  const status = resolveOnboardingStoreStatus(store);
  if (filter === 'all') return true;
  if (filter === 'today') return store.nextVisitLabel.includes('اليوم');
  if (filter === 'ready') return status === 'ready-for-onboarding';
  if (filter === 'follow-up') return status === 'follow-up-required';
  if (filter === 'pending') return status === 'new-lead' || status === 'offer-pending-approval';
  if (filter === 'submitted') return status === 'submitted';
  if (filter === 'done') return status === 'offer-approved';
  return true;
}

export function resolveFilteredOnboardingStores(
  stores: readonly OnboardingStoreFile[],
  activeFilter: PartnerOnboardingFilter,
  searchQuery: string,
): OnboardingStoreFile[] {
  const query = searchQuery.trim().toLowerCase();

  return stores.filter((store) => {
    if (!matchesOnboardingStoreFilter(store, activeFilter)) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = `${store.name} ${store.category} ${store.location}`.toLowerCase();
    return haystack.includes(query);
  });
}

export function resolvePriorityOnboardingStore(
  filteredStores: readonly OnboardingStoreFile[],
  stores: readonly OnboardingStoreFile[],
): OnboardingStoreFile | null {
  return filteredStores.find((store) => matchesOnboardingStoreFilter(store, 'ready'))
    ?? filteredStores[0]
    ?? stores.find((store) => matchesOnboardingStoreFilter(store, 'today'))
    ?? stores[0]
    ?? null;
}
