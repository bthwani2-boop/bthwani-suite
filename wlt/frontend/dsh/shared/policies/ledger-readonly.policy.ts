export const LEDGER_READONLY_POLICY = {
  dshRole: 'read-only',
  wltRole: 'write-authority',
  allowedOperations: ['list', 'get-by-id'] as const,
  forbiddenOperations: ['create', 'update', 'delete', 'reconcile'] as const,
} as const;
