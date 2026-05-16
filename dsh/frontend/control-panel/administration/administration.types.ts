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

export type MockAdminUser = {
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
