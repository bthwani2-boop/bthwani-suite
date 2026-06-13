export const WLT_DSH_FORBIDDEN_RUNTIME_TOKENS = [
  'client-demo',
  'mock-topup-ref',
  'dsh-client-runtime-payment',
  'preview',
  'Preview',
  'demo',
  'fixture',
  'fake',
  'stub',
] as const;

export type WltDshForbiddenRuntimeToken = (typeof WLT_DSH_FORBIDDEN_RUNTIME_TOKENS)[number];
