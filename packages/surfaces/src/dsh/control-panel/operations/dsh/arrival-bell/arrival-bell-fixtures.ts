export type DshArrivalBellLane = {
  orderId: string;
  actorLabel: string;
  statusLabel: string;
  etaLabel: string;
  ringLabel: string;
  actionHint: string;
  tone: 'brand' | 'success' | 'warning' | 'danger';
};

export type DshArrivalBellSummary = {
  activeArrivals: number;
  awaitingAcknowledgement: number;
  blockedRings: number;
  resolvedToday: number;
};

export const dshArrivalBellSummary: DshArrivalBellSummary = {
  activeArrivals: 7,
  awaitingAcknowledgement: 3,
  blockedRings: 2,
  resolvedToday: 18,
};

export const dshArrivalBellCaptainLane: ReadonlyArray<DshArrivalBellLane> = [
  {
    orderId: 'ORD-24019',
    actorLabel: 'كابتن سامر',
    statusLabel: 'وصل وسجل الوصول',
    etaLabel: 'منذ 2 د',
    ringLabel: 'رنة واحدة',
    actionHint: 'بانتظار إقرار العميل أو متابعة workspace.',
    tone: 'success',
  },
  {
    orderId: 'ORD-24020',
    actorLabel: 'كابتن ميداني',
    statusLabel: 'وصل لكن الرن مقيّد',
    etaLabel: 'منذ 5 د',
    ringLabel: '2 رنات',
    actionHint: 'يوجد cooldown نشط ويتطلب قرار ops قبل إعادة الرن.',
    tone: 'warning',
  },
  {
    orderId: 'ORD-24021',
    actorLabel: 'إسناد موقوف',
    statusLabel: 'الوصول متعثر',
    etaLabel: 'غير متاح',
    ringLabel: 'لا توجد محاولات',
    actionHint: 'هذه حالة تصعيد ولا يجب تحويلها إلى CTA تشغيلي كاذب.',
    tone: 'danger',
  },
] as const;

export const dshArrivalBellCustomerLane: ReadonlyArray<DshArrivalBellLane> = [
  {
    orderId: 'ORD-24019',
    actorLabel: 'العميل أكد الوصول',
    statusLabel: 'أنا قادم',
    etaLabel: '10:44 صباحًا',
    ringLabel: 'تم الإقرار',
    actionHint: 'يمكن متابعة بقية queue مع بقاء الحالة مرئية.',
    tone: 'success',
  },
  {
    orderId: 'ORD-24018',
    actorLabel: 'لم يصل إشعار بعد',
    statusLabel: 'بانتظار أول رنة',
    etaLabel: '14 دقيقة',
    ringLabel: '0 رنات',
    actionHint: 'الحالة مبكرة ولا تحتاج دعمًا أو تصعيدًا بعد.',
    tone: 'brand',
  },
  {
    orderId: 'ORD-24020',
    actorLabel: 'لا يوجد إقرار',
    statusLabel: 'يحتاج متابعة',
    etaLabel: '11:04 صباحًا',
    ringLabel: '2 رنات',
    actionHint: 'هذه الحالة تستدعي الرجوع إلى workspace الكاملة لتقرير الخطوة التالية.',
    tone: 'warning',
  },
] as const;