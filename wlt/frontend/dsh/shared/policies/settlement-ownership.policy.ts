export const SETTLEMENT_OWNERSHIP_POLICY = {
  owner: 'wlt',
  dshRole: 'read-only-status',
  allowedDshOperations: ['view-summary', 'view-cycle', 'view-net-amount'] as const,
  forbiddenDshOperations: ['create', 'modify', 'cancel', 'override-net-amount'] as const,
  wltOperations: ['create-settlement', 'calculate-net', 'process-settlement', 'close-cycle'] as const,
} as const;
