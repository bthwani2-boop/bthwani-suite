import type { FieldLeadStatus, FieldOnboardingDraft, FieldStoreFile } from '../stores/dshFieldStoresModel';

export type DshFieldSurfaceId = 'stores' | 'onboarding' | 'visits' | 'finance' | 'profile';

export type DshFieldSurfaceState = {
  surfaceId: DshFieldSurfaceId;
  storeCount: number;
  readyStoreCount: number;
  lastKnownStatus?: FieldLeadStatus;
};

export type DshFieldStateModel = {
  stores: readonly FieldStoreFile[];
  onboardingDraft?: FieldOnboardingDraft;
  surfaceState: DshFieldSurfaceState;
};
