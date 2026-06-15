export const DSH_SHARED_TOPICS = [
  'full-stack',
  'catalog',
  'marketing',
  'notifications',
  'support',
  'field',
  'partner',
  'operations',
  'products',
  'orders',
  'stores',
  'cart',
  'checkout',
  'captain',
  'delivery',
  'finance-boundary',
  'presentation-models',
  'identity-access',
  'discovery',
  'platform',
  'control-panel',
  'media',
  'runtime',
] as const;

export type DshSharedTopicId = (typeof DSH_SHARED_TOPICS)[number];

export const BTHWANI_FULL_STACK_CAPABILITIES = [
  'foundation',
  'actor-auth-permissions',
  'catalog-store',
  'media-runtime',
  'cart-checkout',
  'order-lifecycle',
  'captain-delivery',
  'partner-operations',
  'field-readiness',
  'support-escalation',
  'wlt-finance-read-model',
  'control-panel-governance',
  'notifications',
] as const;

export type BthwaniFullStackCapabilityId = (typeof BTHWANI_FULL_STACK_CAPABILITIES)[number];

export const BTHWANI_FULL_STACK_SURFACES = [
  'backend',
  'openapi',
  'shared',
  'control-panel',
  'app-client',
  'app-partner',
  'app-captain',
  'app-field',
  'wlt',
  'media',
  'guards',
  'evidence',
] as const;

export type BthwaniFullStackSurfaceId = (typeof BTHWANI_FULL_STACK_SURFACES)[number];

export function isBthwaniFullStackCapabilityId(value: string): value is BthwaniFullStackCapabilityId {
  return (BTHWANI_FULL_STACK_CAPABILITIES as readonly string[]).includes(value);
}
