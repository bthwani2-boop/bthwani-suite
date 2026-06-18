export const PAYOUT_OWNERSHIP_POLICY = {
  owner: 'wlt',
  dshRole: 'read-only-reference',
  allowedDshOperations: ['view-decision', 'view-amount', 'view-captain-id'] as const,
  forbiddenDshOperations: ['approve-payout', 'reject-payout', 'modify-amount'] as const,
  wltOperations: ['create-payout-decision', 'approve-payout', 'reject-payout', 'process-payout'] as const,
} as const;
