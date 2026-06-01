export type HrWorkspaceId = 'team' | 'readiness' | 'roles' | 'requests' | 'policies';

export type HrWorkspaceMeta = {
  id: HrWorkspaceId;
  label: string;
  runtimeStatus: 'blocked-api-later';
  disabledReason: string;
};

export const HR_WORKSPACE_REGISTRY: readonly HrWorkspaceMeta[] = [
  {
    id: 'team',
    label: 'فريق التشغيل',
    runtimeStatus: 'blocked-api-later',
    disabledReason: 'لا يوجد API أو قاعدة بيانات HR في هذه المرحلة.',
  },
  {
    id: 'readiness',
    label: 'الجاهزية والحضور',
    runtimeStatus: 'blocked-api-later',
    disabledReason: 'لا توجد بيانات جاهزية متاحة من backend HR.',
  },
  {
    id: 'roles',
    label: 'أدوار HR',
    runtimeStatus: 'blocked-api-later',
    disabledReason: 'الأدوار محجوبة حتى ربط backend HR.',
  },
  {
    id: 'requests',
    label: 'طلبات الموارد البشرية',
    runtimeStatus: 'blocked-api-later',
    disabledReason: 'طلبات HR التجريبية غير مفعلة كبيانات runtime.',
  },
  {
    id: 'policies',
    label: 'سياسات الموظفين',
    runtimeStatus: 'blocked-api-later',
    disabledReason: 'السياسات غير متاحة في Preview.',
  },
];
