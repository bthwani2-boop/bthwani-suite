import type { DshFieldRoute } from './dsh-field.types';

export type DshFieldRouteId =
  | 'dsh-field-stores'
  | 'dsh-field-onboarding'
  | 'dsh-field-visit'
  | 'dsh-field-account'
  | 'dsh-field-profile'
  | 'dsh-field-history'
  | 'dsh-field-finance';

export type DshFieldLegacyRoute = DshFieldRoute;

export type DshFieldRouteRecord = {
  readonly routeId: DshFieldRouteId;
  readonly legacyRoute: DshFieldLegacyRoute;
  readonly screenId: string;
  readonly ownerPath: string;
};

export const dshFieldRoutes = [
  {
    routeId: 'dsh-field-stores',
    legacyRoute: 'stores',
    screenId: 'field.dsh.stores.list',
    ownerPath: 'dsh/frontend/app-field/DshFieldStoresScreen.tsx',
  },
  {
    routeId: 'dsh-field-onboarding',
    legacyRoute: 'onboarding',
    screenId: 'field.dsh.store.onboarding',
    ownerPath: 'dsh/frontend/app-field/DshFieldStoreOnboardingScreen.tsx',
  },
  {
    routeId: 'dsh-field-visit',
    legacyRoute: 'visit',
    screenId: 'field.dsh.store.visit',
    ownerPath: 'dsh/frontend/app-field/DshFieldStoreVisitScreen.tsx',
  },
  {
    routeId: 'dsh-field-account',
    legacyRoute: 'account',
    screenId: 'field.dsh.account.home',
    ownerPath: 'dsh/frontend/app-field/DshFieldProfileHomeScreen.tsx',
  },
  {
    routeId: 'dsh-field-profile',
    legacyRoute: 'profile',
    screenId: 'field.dsh.account.profile',
    ownerPath: 'dsh/frontend/app-field/DshFieldProfileScreen.tsx',
  },
  {
    routeId: 'dsh-field-history',
    legacyRoute: 'history',
    screenId: 'field.dsh.stores.history',
    ownerPath: 'dsh/frontend/app-field/DshFieldStoresHistoryScreen.tsx',
  },
  {
    routeId: 'dsh-field-finance',
    legacyRoute: 'finance',
    screenId: 'field.dsh.finance.overview',
    ownerPath: 'dsh/frontend/app-field/DshFieldFinanceScreen.tsx',
  },
] as const satisfies readonly DshFieldRouteRecord[];
