export type DshReassignCandidate = {
  deliveryId: string;
  orderId: string;
  currentCaptain: string;
  fallbackCaptain: string;
  reasonLabel: string;
  priorityLabel: string;
  statusLabel: string;
  note: string;
  tone: 'brand' | 'success' | 'warning' | 'danger';
};

export type DshReassignSummary = {
  activeCases: number;
  urgentCases: number;
  blockedCases: number;
  readyFallbacks: number;
};

export const dshReassignSummary: DshReassignSummary = {
  activeCases: 6,
  urgentCases: 2,
  blockedCases: 1,
  readyFallbacks: 4,
};

export const dshReassignCandidates: ReadonlyArray<DshReassignCandidate> = [
  {
    deliveryId: 'DEL-8102',
    orderId: 'ORD-24020',
    currentCaptain: 'كابتن ميداني',
    fallbackCaptain: 'كابتن نواف',
    reasonLabel: 'ازدحام مروري',
    priorityLabel: 'عاجلة',
    statusLabel: 'يحتاج قرار الآن',
    note: 'الأقرب أن ينتقل القرار إلى fallback جاهز خلال نافذة قصيرة.',
    tone: 'warning',
  },
  {
    deliveryId: 'DEL-8103',
    orderId: 'ORD-24021',
    currentCaptain: 'إسناد موقوف',
    fallbackCaptain: 'غير محدد',
    reasonLabel: 'تعليق تشغيلي',
    priorityLabel: 'عاجلة',
    statusLabel: 'محجوب',
    note: 'هذه الحالة تحتاج workspace أوسع أو دعم قبل أي نقل فعلي.',
    tone: 'danger',
  },
  {
    deliveryId: 'DEL-8104',
    orderId: 'ORD-24019',
    currentCaptain: 'كابتن سامر',
    fallbackCaptain: 'كابتن راشد',
    reasonLabel: 'طلب العميل',
    priorityLabel: 'عادية',
    statusLabel: 'fallback جاهز',
    note: 'القرار واضح ويمكن تتبعه من operations workspace بدون إدخال runtime الآن.',
    tone: 'success',
  },
  {
    deliveryId: 'DEL-8105',
    orderId: 'ORD-24018',
    currentCaptain: 'لم يعيّن بعد',
    fallbackCaptain: 'كابتن سريع',
    reasonLabel: 'عدم توفر كابتن',
    priorityLabel: 'عادية',
    statusLabel: 'مرشح',
    note: 'هذه الحالة مناسبة كقرار queue مبكر قبل أن تتحول إلى تعثر.',
    tone: 'brand',
  },
] as const;