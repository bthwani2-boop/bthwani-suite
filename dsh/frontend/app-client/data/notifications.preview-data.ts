export type DshNotificationFixture = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
  actionTarget: 'benefits' | 'tracking' | 'orders-list' | 'search';
};

/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source
 */
export const dshNotificationsFixturesDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  timezoneSemantics: 'preview-only local display / not runtime UTC source',
} as const;

export const dshNotificationsFixtures: DshNotificationFixture[] = [
  {
    id: 'notif-1',
    title: 'تحديث الاشتراك',
    subtitle: 'تمت مزامنة باقة بثواني برو داخل DSH بنجاح.',
    meta: '2026-04-18 12:40:22',
    badgeLabel: 'اشتراك',
    actionTarget: 'benefits',
  },
  {
    id: 'notif-2',
    title: 'طلب #3770204 جاهز للمتابعة',
    subtitle: 'مطعم القلعة أنهى التجهيز ونقل الطلب مباشرة إلى التتبع.',
    meta: '2026-04-16 12:30:47',
    badgeLabel: 'طلب',
    actionTarget: 'tracking',
  },
];
