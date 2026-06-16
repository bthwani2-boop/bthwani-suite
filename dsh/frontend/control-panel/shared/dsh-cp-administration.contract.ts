/**
 * SCAFFOLD: DSH Control Panel administration workspace shared types.
 * Moved here from dsh/frontend/control-panel/administration/administration.types to
 * correct the dependency direction: archived seed data must not import from
 * dsh/frontend/control-panel.
 *
 * Owner: dsh/frontend/shared
 * Not a runtime binding — not API/backend source.
 * UI-only RBAC preview — no runtime auth, no backend RBAC binding.
 */

export const dshCpAdministrationContractMeta = {
  dataKind: 'SCAFFOLD_PENDING_RBAC_BINDING',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
} as const;

export type AdminRoleId =
  | 'super-admin'
  | 'platform-governor'
  | 'platform-approver'
  | 'platform-operator'
  | 'finance-approver'
  | 'viewer';

export type PlatformPermissionId =
  | 'view-platform'
  | 'request-change'
  | 'approve-change'
  | 'apply-demo'
  | 'rollback'
  | 'manage-providers'
  | 'manage-appearance'
  | 'manage-services'
  | 'view-audit';

export type AdminUserStatus = 'active' | 'pending' | 'suspended';

export type AdminRole = {
  id: AdminRoleId;
  name: string;
  arabicName: string;
  description: string;
  permissions: readonly PlatformPermissionId[];
  tone: 'brand' | 'warning' | 'danger' | 'success' | 'default';
};

export type DshAdminUser = {
  id: string;
  name: string;
  email: string;
  roleId: AdminRoleId;
  status: AdminUserStatus;
  lastAccess: string;
};

export type PlatformPermission = {
  id: PlatformPermissionId;
  name: string;
  scope: string;
};
