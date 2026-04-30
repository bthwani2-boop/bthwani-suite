export const serviceMeta = {
  id: 'demo-service',
  name: { en: 'Demo Service', ar: 'خدمة نموذجية' },
  description: { en: 'Demo service for governance templates', ar: 'خدمة نموذجية لقوالب الحوكمة' },
  icon: '📦',
  category: 'example',
  status: 'draft',
  owner: 'REPLACE_WITH_OWNER_HANDLE',
  supportedSurfaces: ['app-client', 'control-panel', 'webapp'],
} as const;

export type ServiceMeta = typeof serviceMeta;
