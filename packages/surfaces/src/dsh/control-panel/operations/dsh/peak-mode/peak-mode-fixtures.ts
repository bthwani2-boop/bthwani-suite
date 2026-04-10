export type DshPeakModePressureLane = {
  zoneLabel: string;
  loadLabel: string;
  captainCapacityLabel: string;
  queueLabel: string;
  recommendationLabel: string;
  note: string;
  tone: 'brand' | 'success' | 'warning' | 'danger';
};

export type DshPeakModePolicy = {
  label: string;
  statusLabel: string;
  description: string;
};

export type DshPeakModeSummary = {
  activeZones: number;
  pressureZones: number;
  flexCaptains: number;
  protectedQueues: number;
};

export const dshPeakModeSummary: DshPeakModeSummary = {
  activeZones: 5,
  pressureZones: 2,
  flexCaptains: 11,
  protectedQueues: 3,
};

export const dshPeakModePolicies: ReadonlyArray<DshPeakModePolicy> = [
  {
    label: 'تعدد الطلبات',
    statusLabel: 'مقترح فقط',
    description: 'السطح الحالي يوضح أين يكون تفعيل السعة المنطقية مناسبًا، لكنه لا يبدّل runtime state فعليًا.',
  },
  {
    label: 'حماية queue الحساسة',
    statusLabel: 'محمي',
    description: 'الطلبات الحرجة أو المحجوبة تبقى خارج أي توسيع سعة حتى لا يتحول peak mode إلى إخفاء للمشكلة.',
  },
  {
    label: 'العودة إلى workspace',
    statusLabel: 'إجباري',
    description: 'العقد يفرض أن يكون open operations workspace هو المخرج الرئيسي بعد قراءة القرار.',
  },
] as const;

export const dshPeakModePressureLanes: ReadonlyArray<DshPeakModePressureLane> = [
  {
    zoneLabel: 'حي النخيل',
    loadLabel: 'ضغط مرتفع',
    captainCapacityLabel: '4 كباتن مرنون',
    queueLabel: '12 طلبًا مفتوحًا',
    recommendationLabel: 'مرشح لتوسيع السعة',
    note: 'هذه المنطقة تناسب peak mode لأن البدائل جاهزة والضغط مؤقت لا هيكلي.',
    tone: 'warning',
  },
  {
    zoneLabel: 'الطريق الساحلي',
    loadLabel: 'ضغط حرج',
    captainCapacityLabel: 'fallback محدود',
    queueLabel: '7 طلبات مع تعثرات',
    recommendationLabel: 'لا تفعّل قبل مراجعة أعمق',
    note: 'الضغط هنا قد يخفي مشكلة تشغيلية أعمق، لذلك لا يجب تقديم toggle مباشر من هذا السطح.',
    tone: 'danger',
  },
  {
    zoneLabel: 'شارع 12',
    loadLabel: 'ضغط قابل للإدارة',
    captainCapacityLabel: '3 كباتن مرنون',
    queueLabel: '5 طلبات نشطة',
    recommendationLabel: 'مراقبة فقط',
    note: 'تكفي المراقبة حاليًا دون توسيع سعة أو تصعيد.',
    tone: 'brand',
  },
  {
    zoneLabel: 'المنطقة الصناعية',
    loadLabel: 'مستقر',
    captainCapacityLabel: 'احتياطي متاح',
    queueLabel: '3 طلبات',
    recommendationLabel: 'جاهز عند الحاجة',
    note: 'هذه المنطقة تحمل سعة احتياطية لكنها لا تحتاج تفعيلًا فوريًا.',
    tone: 'success',
  },
] as const;