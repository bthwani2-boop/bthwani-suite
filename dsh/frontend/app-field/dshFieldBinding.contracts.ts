import type { DshFieldSurfaceId } from './field-state.preview-data';

export type DshFieldBindingContract = {
  surfaceId: DshFieldSurfaceId;
  bindingName: string;
  description: string;
};

export type DshFieldBindingContracts = readonly DshFieldBindingContract[];

export const DSH_FIELD_BINDING_CONTRACTS: DshFieldBindingContracts = [
  { surfaceId: 'stores', bindingName: 'stores-binding', description: 'Store list and selection bridge.' },
  { surfaceId: 'onboarding', bindingName: 'onboarding-binding', description: 'Draft and review bridge.' },
  { surfaceId: 'visits', bindingName: 'visit-binding', description: 'Visit evidence bridge.' },
  { surfaceId: 'finance', bindingName: 'finance-binding', description: 'Finance and payout bridge.' },
  { surfaceId: 'profile', bindingName: 'profile-binding', description: 'Profile read bridge.' },
] as const;
