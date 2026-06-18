import type { DshRoleId } from '../identity-access/dsh-role-permission.model';

export type AdminRoleId = DshRoleId;
export type PlatformPermissionId = string;

export type AdminUserStatus = 'active' | 'pending' | 'suspended';

export type AdminRoleTone =
  | 'default'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type AdminPermission = {
  readonly id: PlatformPermissionId;
  readonly name: string;
  readonly scope: string;
  readonly description?: string;
};

export type AdminRole = {
  readonly id: AdminRoleId;
  readonly name: string;
  readonly arabicName: string;
  readonly description: string;
  readonly tone: AdminRoleTone;
  readonly permissions: ReadonlyArray<PlatformPermissionId>;
};

export type DshAdminUser = {
  readonly id: PlatformPermissionId;
  readonly name: string;
  readonly email: string;
  readonly roleId: AdminRoleId;
  readonly status: AdminUserStatus;
  readonly lastAccess: string;
};
