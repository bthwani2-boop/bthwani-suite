import type { CaptainAvailabilityStatus, CaptainGpsStatus } from './captain-service.types';

export type CaptainAvailabilityMeta = {
  label: string;
  description: string;
  chipTone: 'success' | 'warning' | 'default';
  orderBadgeLabel: string;
};

export type CaptainGpsStatusMeta = {
  label: string;
  description: string;
  chipTone: 'success' | 'warning' | 'default';
};

export const availabilityStatusMeta: Record<CaptainAvailabilityStatus, CaptainAvailabilityMeta> = {
  available: {
    label: 'متاح',
    description: 'جاهز الآن لاستقبال الطلبات والتنقل مباشرة إلى مناطق الطلب.',
    chipTone: 'success',
    orderBadgeLabel: 'نشط',
  },
  unavailable: {
    label: 'غير متاح',
    description: 'تم إيقاف استقبال الطلبات مؤقتًا حتى إعادة التفعيل.',
    chipTone: 'warning',
    orderBadgeLabel: 'موقوف',
  },
  break: {
    label: 'استراحة',
    description: 'استراحة قصيرة — استئناف الاستقبال عند التفعيل.',
    chipTone: 'warning',
    orderBadgeLabel: 'استراحة',
  },
  'planned-leave': {
    label: 'إجازة مخططة',
    description: 'إدارة الإجازات مرتبطة بعمليات الأسطول.',
    chipTone: 'default',
    orderBadgeLabel: 'إجازة',
  },
};

export const gpsStatusMeta: Record<CaptainGpsStatus, CaptainGpsStatusMeta> = {
  ready: {
    label: 'GPS جاهز',
    description: 'إشارة الموقع مستقرة ويمكن عرض الخريطة بثقة.',
    chipTone: 'success',
  },
  limited: {
    label: 'GPS محدود',
    description: 'الإشارة متاحة جزئيًا — دقة الموقع منخفضة.',
    chipTone: 'warning',
  },
  offline: {
    label: 'GPS دون اتصال',
    description: 'تعذر تحديث الموقع الآن. لا تحديثات موقع حتى تعود الإشارة.',
    chipTone: 'warning',
  },
  disabled: {
    label: 'GPS معطل',
    description: 'الموقع مغلق من الجهاز ويحتاج تفعيل الإذن من إعدادات الهاتف قبل استخدام الخريطة.',
    chipTone: 'default',
  },
};

export type MapHeatZone = {
  id: string;
  size: number;
  color: string;
  label: string;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export function getCaptainAvailabilityMeta(status: CaptainAvailabilityStatus): CaptainAvailabilityMeta {
  return availabilityStatusMeta[status];
}

export function getCaptainGpsStatusMeta(status: CaptainGpsStatus): CaptainGpsStatusMeta {
  return gpsStatusMeta[status];
}
