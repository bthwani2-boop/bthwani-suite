export type WorkspaceSurfaceId =
  | 'control-panel'
  | 'webapp'
  | 'website'
  | 'app-client'
  | 'app-partner'
  | 'app-captain'
  | 'app-field';

export type WorkspaceSurfaceSpec = {
  id: WorkspaceSurfaceId;
  label: string;
  summary: string;
  kind: 'web' | 'public' | 'mobile';
  port: number;
};

export const workspaceSurfaceOrder: WorkspaceSurfaceId[] = [
  'control-panel',
  'webapp',
  'website',
  'app-client',
  'app-partner',
  'app-captain',
  'app-field',
];

export const workspaceSurfaceCatalog: Record<WorkspaceSurfaceId, WorkspaceSurfaceSpec> = {
  'control-panel': {
    id: 'control-panel',
    label: 'Control Panel',
    summary: 'مساحة تشغيل وإشراف فعلية لبدء استقبال شاشات العمليات لاحقاً.',
    kind: 'web',
    port: 4100,
  },
  webapp: {
    id: 'webapp',
    label: 'Web App',
    summary: 'قشرة ويب تشغيلية عامة قابلة لتوسيع المسارات والشاشات لاحقاً.',
    kind: 'public',
    port: 4101,
  },
  website: {
    id: 'website',
    label: 'Website',
    summary: 'قشرة موقع عامة قابلة لتوسيع الصفحات والمحتوى تدريجياً.',
    kind: 'public',
    port: 4102,
  },
  'app-client': {
    id: 'app-client',
    label: 'Client App',
    summary: 'تصفح فعلي لمسار العميل مع جاهزية مباشرة لاستقبال الشاشات اللاحقة.',
    kind: 'mobile',
    port: 4200,
  },
  'app-partner': {
    id: 'app-partner',
    label: 'Partner App',
    summary: 'تصفح فعلي لمسار الشريك مع فصل واضح بين القشرة الحالية والمنطق المؤجل.',
    kind: 'mobile',
    port: 4201,
  },
  'app-captain': {
    id: 'app-captain',
    label: 'Captain App',
    summary: 'قشرة تنفيذ ميداني قابلة للتصفح الآن وتوسيع الشاشات لاحقاً.',
    kind: 'mobile',
    port: 4202,
  },
  'app-field': {
    id: 'app-field',
    label: 'Field App',
    summary: 'قشرة تشغيل ميدانية خفيفة قابلة للتصفح وإضافة الشاشات عند فتح المرحلة.',
    kind: 'mobile',
    port: 4203,
  },
};

export function getWorkspaceSurfaceSpec(surfaceId: string): WorkspaceSurfaceSpec {
  if (surfaceId in workspaceSurfaceCatalog) {
    return workspaceSurfaceCatalog[surfaceId as WorkspaceSurfaceId];
  }

  return {
    id: 'webapp',
    label: surfaceId,
    summary: 'قشرة تصفح عامة غير مصنفة بعد.',
    kind: 'public',
    port: 4300,
  };
}

export function getWorkspaceSurfaceUrl(surfaceId: string): string {
  const spec = getWorkspaceSurfaceSpec(surfaceId);

  return `http://localhost:${spec.port}`;
}