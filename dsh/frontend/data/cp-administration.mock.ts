import type { AdminRole, MockAdminUser, PlatformPermission } from '../control-panel/administration/administration.types';

export const ADMIN_ROLES: readonly AdminRole[] = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    arabicName: 'المسؤول الأعلى',
    description: 'صلاحيات كاملة بلا قيود — الصلاحية الأعلى في المنصة',
    permissions: [
      'view-platform', 'request-change', 'approve-change', 'apply-demo',
      'rollback', 'manage-providers', 'manage-appearance', 'manage-services', 'view-audit',
    ],
    tone: 'danger',
  },
  {
    id: 'platform-governor',
    name: 'Platform Governor',
    arabicName: 'حاكم المنصة',
    description: 'يرى ويتحكم في Platform بالكامل بما فيها الإيقاف والتشغيل وتغيير المتغيرات السيادية',
    permissions: [
      'view-platform', 'request-change', 'approve-change', 'apply-demo',
      'rollback', 'manage-providers', 'manage-appearance', 'manage-services', 'view-audit',
    ],
    tone: 'brand',
  },
  {
    id: 'platform-approver',
    name: 'Platform Approver',
    arabicName: 'معتمد Platform',
    description: 'يعتمد الطلبات الواردة من المشغلين ويملك صلاحية التراجع (Rollback)',
    permissions: ['view-platform', 'approve-change', 'rollback', 'view-audit'],
    tone: 'warning',
  },
  {
    id: 'platform-operator',
    name: 'Platform Operator',
    arabicName: 'مشغّل Platform',
    description: 'يطلب التغييرات وينفذ الإجراءات التجريبية بعد الاعتماد',
    permissions: ['view-platform', 'request-change', 'apply-demo', 'view-audit'],
    tone: 'success',
  },
  {
    id: 'finance-approver',
    name: 'Finance Approver',
    arabicName: 'معتمد مالي',
    description: 'يعتمد التغييرات المالية الحساسة فقط (رصيد المحافظ، التسويات، المتغيرات المالية)',
    permissions: ['view-platform', 'approve-change', 'view-audit'],
    tone: 'warning',
  },
  {
    id: 'viewer',
    name: 'Viewer',
    arabicName: 'مراقب',
    description: 'يرى Platform والسجل فقط بلا صلاحية تعديل أو اعتماد',
    permissions: ['view-platform', 'view-audit'],
    tone: 'default',
  },
];

export const PLATFORM_PERMISSIONS: readonly PlatformPermission[] = [
  { id: 'view-platform', name: 'رؤية Platform', scope: 'كل التبويبات' },
  { id: 'request-change', name: 'طلب تغيير', scope: 'Vars, Services, Providers, Appearance' },
  { id: 'approve-change', name: 'اعتماد تغيير', scope: 'بعد طلب من مشغّل' },
  { id: 'apply-demo', name: 'تطبيق Demo / محاكاة', scope: 'وضع المحاكاة المحلي' },
  { id: 'rollback', name: 'Rollback', scope: 'التراجع عن آخر تغيير' },
  { id: 'manage-providers', name: 'إدارة المزودين', scope: 'Providers workspace' },
  { id: 'manage-appearance', name: 'إدارة المظهر', scope: 'Appearance workspace' },
  { id: 'manage-services', name: 'إدارة الخدمات', scope: 'Services workspace' },
  { id: 'view-audit', name: 'رؤية السجل', scope: 'Audit workspace' },
];

export const MOCK_USERS: readonly MockAdminUser[] = [
  { id: 'u1', name: 'أحمد الشريف', email: 'ahmed.sharif@bthwani.com', roleId: 'platform-governor', status: 'active', lastAccess: 'منذ ساعة' },
  { id: 'u2', name: 'فاطمة القحطاني', email: 'fatima.q@bthwani.com', roleId: 'platform-approver', status: 'active', lastAccess: 'منذ 3 ساعات' },
  { id: 'u3', name: 'خالد النعماني', email: 'khalid.n@bthwani.com', roleId: 'platform-operator', status: 'active', lastAccess: 'منذ 30 دقيقة' },
  { id: 'u4', name: 'ريم السعدي', email: 'reem.s@bthwani.com', roleId: 'finance-approver', status: 'active', lastAccess: 'منذ يوم' },
  { id: 'u5', name: 'سامي العمري', email: 'sami.a@bthwani.com', roleId: 'viewer', status: 'pending', lastAccess: 'لم يسجل دخول بعد' },
];
