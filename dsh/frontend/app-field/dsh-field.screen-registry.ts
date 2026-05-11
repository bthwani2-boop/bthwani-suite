import type { DshFieldRouteId } from './dsh-field.routes';

export type DshFieldScreenRegistryItem = {
  readonly screenId: string;
  readonly routeId: DshFieldRouteId;
  readonly surfaceId: 'app-field';
  readonly ownerKind: 'app' | 'service' | 'integration';
  readonly ownerId: 'app-field' | 'dsh' | 'wlt.dsh';
  readonly serviceId?: 'dsh' | 'wlt';
  readonly linkedServiceId?: 'wlt';
  readonly ownerPath: string;
  readonly componentName: string;
  readonly screenKind: 'TAB_ROOT' | 'SCREEN_ENTRY' | 'FLOW_STEP' | 'MODAL' | 'SHEET';
  readonly flowId?: string;
  readonly requiredStates: readonly ('loading' | 'empty' | 'error' | 'success' | 'offline' | 'disabled' | 'retry' | 'blocked')[];
  readonly analytics: {
    readonly screenView: string;
  };
  readonly fallbackRouteId?: DshFieldRouteId;
  readonly releaseCriticality: 'P0' | 'P1' | 'P2';
  readonly status: 'TBD' | 'UNPROVEN' | 'VERIFIED' | 'CLOSED' | 'DEPRECATED';
};

export const dshFieldScreenRegistry = [
  {
    screenId: 'field.dsh.stores.list',
    routeId: 'dsh-field-stores',
    surfaceId: 'app-field',
    ownerKind: 'service',
    ownerId: 'dsh',
    serviceId: 'dsh',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldStoresScreen.tsx',
    componentName: 'DshFieldStoresScreen',
    screenKind: 'TAB_ROOT',
    flowId: 'dsh.field.stores',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline'],
    analytics: { screenView: 'field_dsh_stores_list_view' },
    fallbackRouteId: 'dsh-field-stores',
    releaseCriticality: 'P0',
    status: 'VERIFIED',
  },
  {
    screenId: 'field.dsh.store.onboarding',
    routeId: 'dsh-field-onboarding',
    surfaceId: 'app-field',
    ownerKind: 'service',
    ownerId: 'dsh',
    serviceId: 'dsh',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldStoreOnboardingScreen.tsx',
    componentName: 'DshFieldStoreOnboardingScreen',
    screenKind: 'FLOW_STEP',
    flowId: 'dsh.field.onboarding',
    requiredStates: ['success', 'disabled'],
    analytics: { screenView: 'field_dsh_store_onboarding_view' },
    fallbackRouteId: 'dsh-field-stores',
    releaseCriticality: 'P0',
    status: 'VERIFIED',
  },
  {
    screenId: 'field.dsh.store.visit',
    routeId: 'dsh-field-visit',
    surfaceId: 'app-field',
    ownerKind: 'service',
    ownerId: 'dsh',
    serviceId: 'dsh',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldStoreVisitScreen.tsx',
    componentName: 'DshFieldStoreVisitScreen',
    screenKind: 'FLOW_STEP',
    flowId: 'dsh.field.visit',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline', 'disabled'],
    analytics: { screenView: 'field_dsh_store_visit_view' },
    fallbackRouteId: 'dsh-field-onboarding',
    releaseCriticality: 'P0',
    status: 'VERIFIED',
  },
  {
    screenId: 'field.dsh.account.home',
    routeId: 'dsh-field-account',
    surfaceId: 'app-field',
    ownerKind: 'app',
    ownerId: 'app-field',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldProfileHomeScreen.tsx',
    componentName: 'DshFieldProfileHomeScreen',
    screenKind: 'SCREEN_ENTRY',
    flowId: 'dsh.field.account',
    requiredStates: ['success'],
    analytics: { screenView: 'field_dsh_account_home_view' },
    fallbackRouteId: 'dsh-field-stores',
    releaseCriticality: 'P1',
    status: 'VERIFIED',
  },
  {
    screenId: 'field.dsh.account.profile',
    routeId: 'dsh-field-profile',
    surfaceId: 'app-field',
    ownerKind: 'app',
    ownerId: 'app-field',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldProfileScreen.tsx',
    componentName: 'DshFieldProfileScreen',
    screenKind: 'FLOW_STEP',
    flowId: 'dsh.field.account',
    requiredStates: ['success'],
    analytics: { screenView: 'field_dsh_account_profile_view' },
    fallbackRouteId: 'dsh-field-account',
    releaseCriticality: 'P2',
    status: 'VERIFIED',
  },
  {
    screenId: 'field.dsh.stores.history',
    routeId: 'dsh-field-history',
    surfaceId: 'app-field',
    ownerKind: 'service',
    ownerId: 'dsh',
    serviceId: 'dsh',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldStoresHistoryScreen.tsx',
    componentName: 'DshFieldStoresHistoryScreen',
    screenKind: 'FLOW_STEP',
    flowId: 'dsh.field.history',
    requiredStates: ['empty', 'success'],
    analytics: { screenView: 'field_dsh_stores_history_view' },
    fallbackRouteId: 'dsh-field-account',
    releaseCriticality: 'P2',
    status: 'VERIFIED',
  },
  {
    screenId: 'field.dsh.finance.overview',
    routeId: 'dsh-field-finance',
    surfaceId: 'app-field',
    ownerKind: 'integration',
    ownerId: 'wlt.dsh',
    serviceId: 'dsh',
    linkedServiceId: 'wlt',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldFinanceScreen.tsx',
    componentName: 'DshFieldFinanceScreen',
    screenKind: 'FLOW_STEP',
    flowId: 'dsh.field.finance',
    requiredStates: ['loading', 'error', 'success', 'offline'],
    analytics: { screenView: 'field_dsh_finance_overview_view' },
    fallbackRouteId: 'dsh-field-account',
    releaseCriticality: 'P1',
    status: 'VERIFIED',
  },
] as const satisfies readonly DshFieldScreenRegistryItem[];
