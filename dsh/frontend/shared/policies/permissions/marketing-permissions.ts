// Canonical location: dsh/frontend/shared/policies/permissions/marketing-permissions.ts
// Authority: dsh/frontend/shared/policies — moved from control-panel/marketing/marketing-permissions.contract.ts
// Defines roles and permissions for marketing actions across DSH.

export type MarketingRole = 'viewer' | 'editor' | 'approver' | 'publisher';

export type MarketingPermission =
  | 'marketing.view'
  | 'marketing.edit'
  | 'marketing.approve'
  | 'marketing.publish'
  | 'marketing.delete';

export const ROLE_PERMISSIONS: Record<MarketingRole, MarketingPermission[]> = {
  viewer: ['marketing.view'],
  editor: ['marketing.view', 'marketing.edit'],
  approver: ['marketing.view', 'marketing.approve'],
  publisher: ['marketing.view', 'marketing.edit', 'marketing.approve', 'marketing.publish', 'marketing.delete'],
};

// Simulated auth context hook since global DSH auth context is not yet injected.
// Default to 'publisher' to keep current visual parity, but allows switching for tests.
export function useMarketingPermissions(simulatedRole: MarketingRole = 'publisher') {
  const hasPermission = (permission: MarketingPermission) => {
    return ROLE_PERMISSIONS[simulatedRole].includes(permission);
  };

  return { role: simulatedRole, hasPermission };
}
