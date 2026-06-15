import type { DshControlPanelSectionId } from '../control-panel/dsh-governance.map';
import type { DshSurfaceId } from '../runtime/dsh-flow-registry';
import type { BthwaniFullStackCapabilityId, DshSharedTopicId } from './bthwani-full-stack-capabilities';

export type BthwaniFullStackClosureStatus =
  | 'contract-required'
  | 'runtime-bound'
  | 'needs-runtime-evidence'
  | 'blocked-by-policy';

export type BthwaniFullStackCapabilityBinding = {
  readonly id: BthwaniFullStackCapabilityId;
  readonly backendRequired: boolean;
  readonly openapiRequired: boolean;
  /** Topics in dsh/frontend/shared that own this capability's contracts, adapters, and view-models. */
  readonly sharedTopics: readonly DshSharedTopicId[];
  readonly controlPanelSections: readonly DshControlPanelSectionId[];
  readonly mobileSurfaces: readonly DshSurfaceId[];
  readonly wltRequired: boolean;
  readonly mediaRequired: boolean;
  readonly evidenceRequired: readonly ('git-diff' | 'guard' | 'typecheck' | 'runtime' | 'visual')[];
  readonly closureStatus: BthwaniFullStackClosureStatus;
};

export const BTHWANI_FULL_STACK_CAPABILITY_MAP: Readonly<Record<BthwaniFullStackCapabilityId, BthwaniFullStackCapabilityBinding>> = {
  foundation: {
    id: 'foundation',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['runtime', 'identity-access', 'platform'],
    controlPanelSections: ['dashboard', 'platform', 'administration'],
    mobileSurfaces: ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel'],
    wltRequired: false,
    mediaRequired: false,
    evidenceRequired: ['git-diff', 'guard', 'typecheck'],
    closureStatus: 'contract-required',
  },
  'actor-auth-permissions': {
    id: 'actor-auth-permissions',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['identity-access', 'platform'],
    controlPanelSections: ['administration', 'platform'],
    mobileSurfaces: ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel'],
    wltRequired: false,
    mediaRequired: false,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime'],
    closureStatus: 'contract-required',
  },
  'catalog-store': {
    id: 'catalog-store',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['catalog', 'stores', 'products', 'media'],
    controlPanelSections: ['catalogs', 'partners', 'marketing'],
    mobileSurfaces: ['app-client', 'app-partner', 'app-field', 'control-panel'],
    wltRequired: false,
    mediaRequired: true,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime', 'visual'],
    closureStatus: 'runtime-bound',
  },
  'media-runtime': {
    id: 'media-runtime',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['media', 'platform'],
    controlPanelSections: ['catalogs', 'support', 'marketing', 'platform'],
    mobileSurfaces: ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel'],
    wltRequired: false,
    mediaRequired: true,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime', 'visual'],
    closureStatus: 'runtime-bound',
  },
  'cart-checkout': {
    id: 'cart-checkout',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['cart', 'checkout', 'orders'],
    controlPanelSections: ['operations', 'finance', 'platform'],
    mobileSurfaces: ['app-client', 'control-panel'],
    wltRequired: true,
    mediaRequired: false,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime', 'visual'],
    closureStatus: 'contract-required',
  },
  'order-lifecycle': {
    id: 'order-lifecycle',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['orders', 'operations', 'delivery'],
    controlPanelSections: ['operations', 'support', 'finance'],
    mobileSurfaces: ['app-client', 'app-partner', 'app-captain', 'control-panel'],
    wltRequired: true,
    mediaRequired: false,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime', 'visual'],
    closureStatus: 'contract-required',
  },
  'captain-delivery': {
    id: 'captain-delivery',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['captain', 'delivery', 'orders', 'media'],
    controlPanelSections: ['operations', 'support', 'finance'],
    mobileSurfaces: ['app-client', 'app-partner', 'app-captain', 'control-panel'],
    wltRequired: true,
    mediaRequired: true,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime', 'visual'],
    closureStatus: 'runtime-bound',
  },
  'partner-operations': {
    id: 'partner-operations',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['partner', 'stores', 'products', 'media', 'operations'],
    controlPanelSections: ['operations', 'catalogs', 'partners', 'support'],
    mobileSurfaces: ['app-partner', 'control-panel'],
    wltRequired: false,
    mediaRequired: true,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime', 'visual'],
    closureStatus: 'contract-required',
  },
  'field-readiness': {
    id: 'field-readiness',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['field', 'media', 'operations'],
    controlPanelSections: ['partners', 'catalogs', 'support'],
    mobileSurfaces: ['app-field', 'app-partner', 'control-panel'],
    wltRequired: false,
    mediaRequired: true,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime', 'visual'],
    closureStatus: 'runtime-bound',
  },
  'support-escalation': {
    id: 'support-escalation',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['support', 'operations', 'media'],
    controlPanelSections: ['support', 'operations'],
    mobileSurfaces: ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel'],
    wltRequired: false,
    mediaRequired: true,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime', 'visual'],
    closureStatus: 'contract-required',
  },
  'wlt-finance-read-model': {
    id: 'wlt-finance-read-model',
    backendRequired: false,
    openapiRequired: true,
    sharedTopics: ['finance-boundary'],
    controlPanelSections: ['finance', 'dashboard'],
    mobileSurfaces: ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel', 'wlt-finance'],
    wltRequired: true,
    mediaRequired: false,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime'],
    closureStatus: 'contract-required',
  },
  'control-panel-governance': {
    id: 'control-panel-governance',
    backendRequired: false,
    openapiRequired: false,
    sharedTopics: ['identity-access', 'platform', 'control-panel'],
    controlPanelSections: ['dashboard', 'operations', 'support', 'finance', 'catalogs', 'partners', 'marketing', 'platform', 'administration', 'hr'],
    mobileSurfaces: ['control-panel'],
    wltRequired: false,
    mediaRequired: false,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'visual'],
    closureStatus: 'runtime-bound',
  },
  notifications: {
    id: 'notifications',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['notifications', 'platform'],
    controlPanelSections: ['operations', 'support', 'platform'],
    mobileSurfaces: ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel'],
    wltRequired: false,
    mediaRequired: false,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime', 'visual'],
    closureStatus: 'contract-required',
  },
} as const;

export const BTHWANI_FULL_STACK_CAPABILITY_LIST = Object.values(BTHWANI_FULL_STACK_CAPABILITY_MAP);

export function getBthwaniFullStackCapability(id: BthwaniFullStackCapabilityId): BthwaniFullStackCapabilityBinding {
  return BTHWANI_FULL_STACK_CAPABILITY_MAP[id];
}
