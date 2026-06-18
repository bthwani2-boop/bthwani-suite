export const REFUND_OWNERSHIP_POLICY = {
  owner: 'wlt',
  dshRole: 'read-only-status',
  allowedDshOperations: ['view-status', 'view-reason', 'view-amount'] as const,
  forbiddenDshOperations: ['create', 'approve', 'reject', 'cancel'] as const,
  wltOperations: ['create-refund', 'approve-refund', 'reject-refund', 'process-refund'] as const,
} as const;
