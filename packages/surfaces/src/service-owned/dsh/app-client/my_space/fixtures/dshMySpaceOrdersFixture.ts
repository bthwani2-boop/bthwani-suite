export type DshMySpaceOrderFilterId = 'all' | 'active' | 'delivery' | 'pickup';

export type DshMySpaceOrderStatusTone = 'brand' | 'success' | 'warning' | 'danger';

export type DshMySpaceOrderMetric = {
  label: string;
  value: string;
  helperText: string;
  tone: 'brand' | 'info' | 'warning' | 'success';
};

export type DshMySpaceOrderFilter = {
  id: DshMySpaceOrderFilterId;
  label: string;
  summary: string;
};

export type DshMySpaceQuickActionKind = 'orders' | 'tracking' | 'repeat';

export type DshMySpaceQuickAction = {
  id: string;
  label: string;
  summary: string;
  actionLabel: string;
  kind: DshMySpaceQuickActionKind;
};

export type DshMySpaceOrder = {
  id: string;
  title: string;
  summary: string;
  fulfillmentId: 'delivery' | 'pickup';
  fulfillmentLabel: string;
  statusId: 'active' | 'completed' | 'ready' | 'cancelled';
  statusLabel: string;
  statusTone: DshMySpaceOrderStatusTone;
  orderNumber: string;
  placedAt: string;
  totalLabel: string;
  statusTrailLabel: string;
};

export const dshMySpaceOrderMetrics: DshMySpaceOrderMetric[] = [
  {
    label: 'الطلبات هذا الشهر',
    value: '12',
    helperText: 'ثلاثة منها جاهزة للتكرار',
    tone: 'brand',
  },
  {
    label: 'الطلب النشط',
    value: '1',
    helperText: 'يظهر الآن في التتبع',
    tone: 'warning',
  },
  {
    label: 'جاهز للتكرار',
    value: '6',
    helperText: 'طلبات مكتملة يمكن إعادة فتحها',
    tone: 'success',
  },
  {
    label: 'قيد المراجعة',
    value: '2',
    helperText: 'حالتان تحتاجان متابعة سريعة',
    tone: 'info',
  },
];

export const dshMySpaceOrderFilters: DshMySpaceOrderFilter[] = [
  {
    id: 'all',
    label: 'الكل',
    summary: 'جميع الطلبات في عرض واحد',
  },
  {
    id: 'active',
    label: 'النشط',
    summary: 'آخر طلب يحتاج متابعة الآن',
  },
  {
    id: 'delivery',
    label: 'توصيل',
    summary: 'الطلبات التي تتحرك إلى العنوان',
  },
  {
    id: 'pickup',
    label: 'استلام بنفسي',
    summary: 'الطلبات الجاهزة أو المحجوزة للاستلام',
  },
];

export const dshMySpaceQuickActions: DshMySpaceQuickAction[] = [
  {
    id: 'recent',
    label: 'الطلبات الحديثة',
    summary: 'افتح أحدث الطلبات المسجلة فورًا',
    actionLabel: 'فتح',
    kind: 'orders',
  },
  {
    id: 'active',
    label: 'الطلب النشط',
    summary: 'انتقل مباشرة إلى التتبع الحالي',
    actionLabel: 'تتبع',
    kind: 'tracking',
  },
  {
    id: 'history',
    label: 'سجل الطلبات',
    summary: 'استعرض الطلبات السابقة بسرعة',
    actionLabel: 'فتح',
    kind: 'orders',
  },
  {
    id: 'tracking',
    label: 'التتبع',
    summary: 'عرض المسار الحالي للطلب الجاري',
    actionLabel: 'تتبع',
    kind: 'tracking',
  },
];

export const dshMySpaceOrdersFixture: DshMySpaceOrder[] = [
  {
    id: 'active-order',
    title: 'مطعم القلعة',
    summary: 'الطلب النشط يظهر الآن في التتبع مع تكرار جاهز بعد الإغلاق.',
    fulfillmentId: 'delivery',
    fulfillmentLabel: 'توصيل',
    statusId: 'active',
    statusLabel: 'جاري التوصيل',
    statusTone: 'brand',
    orderNumber: '#3770204',
    placedAt: '26 مارس 2026 · 17:35',
    totalLabel: '13,450 ر.ي',
    statusTrailLabel: 'في الطريق',
  },
  {
    id: 'completed-order',
    title: 'مقهى الدانة',
    summary: 'طلب مكتمل مع تقييم ظاهر وإعادة طلب مباشرة من البطاقة.',
    fulfillmentId: 'delivery',
    fulfillmentLabel: 'توصيل',
    statusId: 'completed',
    statusLabel: 'تم التسليم',
    statusTone: 'success',
    orderNumber: '#3770118',
    placedAt: '25 مارس 2026 · 19:05',
    totalLabel: '28,900 ر.ي',
    statusTrailLabel: 'مكتمل · 4.9/5',
  },
  {
    id: 'pickup-order',
    title: 'أفران السهول',
    summary: 'استلام بنفسي مع حالة جاهزة للاسترجاع دون ضياع المسار.',
    fulfillmentId: 'pickup',
    fulfillmentLabel: 'استلام بنفسي',
    statusId: 'ready',
    statusLabel: 'جاهز للاستلام',
    statusTone: 'warning',
    orderNumber: '#3769982',
    placedAt: '24 مارس 2026 · 12:20',
    totalLabel: '56,100 ر.ي',
    statusTrailLabel: 'جاهز الآن',
  },
];

