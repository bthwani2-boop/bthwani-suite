export type DshOrderRow = {
  id: string;
  customer: string;
  route: string;
  amount: string;
  eta: string;
  statusLabel: string;
  statusTone: 'brand' | 'success' | 'warning' | 'danger';
  createdLabel: string;
  destinationLabel: string;
  captainLabel: string;
  notes: string;
};

export type DshOrderArrivalTimeline = {
  arrived: boolean;
  arrivedLabel: string;
  ringCount: number;
  lastRingLabel: string;
  acknowledged: boolean;
  acknowledgedLabel: string;
  cooldownLabel: string;
  blockReason: string;
};

export type DshOrderActionPlan = {
  primaryLabel: string;
  primaryDescription: string;
  secondaryLabel: string;
  secondaryDescription: string;
  supportLabel: string;
  supportDescription: string;
};

export const sampleDshOrders: ReadonlyArray<DshOrderRow> = [
  {
    id: 'ORD-24018',
    customer: 'عميل مباشر',
    route: 'المخزن المركزي → حي النخيل',
    amount: '62.00 SAR',
    eta: '14 دقيقة',
    statusLabel: 'جديد',
    statusTone: 'brand',
    createdLabel: '10:14 صباحًا',
    destinationLabel: 'حي النخيل - شارع 4',
    captainLabel: 'لم يعيّن بعد',
    notes: 'طلب يحتاج فتح تعيين سريع من queue الأساسية.',
  },
  {
    id: 'ORD-24019',
    customer: 'عميل تجريبي',
    route: 'المخزن الشرقي → شارع 12',
    amount: '48.50 SAR',
    eta: '22 دقيقة',
    statusLabel: 'مؤكد',
    statusTone: 'success',
    createdLabel: '10:26 صباحًا',
    destinationLabel: 'شارع 12 - برج الماسة',
    captainLabel: 'كابتن سامر',
    notes: 'الطلب مؤكد ويتحرك ضمن ETA طبيعي.',
  },
  {
    id: 'ORD-24020',
    customer: 'عميل استرداد',
    route: 'المخزن الغربي → المنطقة الصناعية',
    amount: '91.75 SAR',
    eta: '31 دقيقة',
    statusLabel: 'بحاجة مراجعة',
    statusTone: 'warning',
    createdLabel: '10:41 صباحًا',
    destinationLabel: 'المنطقة الصناعية - بوابة 3',
    captainLabel: 'قيد الفحص',
    notes: 'العنوان واضح لكن الطلب يتطلب تأكيد قدرة الكابتن قبل الإسناد.',
  },
  {
    id: 'ORD-24021',
    customer: 'عميل VIP',
    route: 'المركز الرئيس → الطريق الساحلي',
    amount: '124.00 SAR',
    eta: '41 دقيقة',
    statusLabel: 'معلق',
    statusTone: 'danger',
    createdLabel: '10:55 صباحًا',
    destinationLabel: 'الطريق الساحلي - بوابة المرسى',
    captainLabel: 'تم إيقاف الإسناد',
    notes: 'الطلب موقوف حتى مراجعة سبب التعليق والتصعيد التشغيلي.',
  },
] as const;

const sampleDshOrderArrivalTimeline: Readonly<Record<string, DshOrderArrivalTimeline>> = {
  'ORD-24018': {
    arrived: false,
    arrivedLabel: 'لم يصل بعد',
    ringCount: 0,
    lastRingLabel: 'لا توجد رنة',
    acknowledged: false,
    acknowledgedLabel: 'لم يؤكد العميل بعد',
    cooldownLabel: 'متاح الآن',
    blockReason: 'لا يوجد منع حالي',
  },
  'ORD-24019': {
    arrived: true,
    arrivedLabel: 'وصل 10:42 صباحًا',
    ringCount: 1,
    lastRingLabel: 'آخر رنة 10:43 صباحًا',
    acknowledged: true,
    acknowledgedLabel: 'العميل أكد الوصول 10:44 صباحًا',
    cooldownLabel: 'انتهى التبريد',
    blockReason: 'لا يوجد منع حالي',
  },
  'ORD-24020': {
    arrived: true,
    arrivedLabel: 'وصل 10:58 صباحًا',
    ringCount: 2,
    lastRingLabel: 'آخر رنة 11:01 صباحًا',
    acknowledged: false,
    acknowledgedLabel: 'لا يوجد إقرار من العميل',
    cooldownLabel: 'تبريد حتى 11:04 صباحًا',
    blockReason: 'بانتظار مراجعة التشغيل قبل إعادة الرن',
  },
  'ORD-24021': {
    arrived: false,
    arrivedLabel: 'الوصول متوقف',
    ringCount: 0,
    lastRingLabel: 'معلّق',
    acknowledged: false,
    acknowledgedLabel: 'لا يوجد إقرار',
    cooldownLabel: 'غير متاح',
    blockReason: 'الطلب معلق ويتطلب تصعيدًا تشغيليًا قبل أي محاولة جديدة',
  },
} as const;

export function getSampleDshOrder(orderId: string) {
  return sampleDshOrders.find((order) => order.id === orderId);
}

export function getSampleDshOrderArrivalTimeline(orderId: string) {
  return sampleDshOrderArrivalTimeline[orderId];
}

export function getSampleDshOrderActionPlan(orderId: string): DshOrderActionPlan {
  const order = getSampleDshOrder(orderId);

  if (order?.statusTone === 'brand') {
    return {
      primaryLabel: 'افتح مساحة العمليات',
      primaryDescription: 'الطلب جديد ويحتاج دخولًا سريعًا إلى workspace التشغيلية قبل تنفيذ أي إجراء أعمق.',
      secondaryLabel: 'راجع queue الطلبات',
      secondaryDescription: 'الرجوع إلى القائمة مفيد لمقارنة هذا الطلب مع بقية الحالات المفتوحة.',
      supportLabel: 'صعّد إلى الدعم',
      supportDescription: 'يبقى الدعم مسارًا احتياطيًا إذا تعطل القرار أو تغيّرت المعطيات.',
    };
  }

  if (order?.statusTone === 'warning') {
    return {
      primaryLabel: 'افتح مساحة العمليات',
      primaryDescription: 'هذه الحالة تحتاج قرار ops واضح قبل إعادة الرن أو الاستمرار في الإسناد.',
      secondaryLabel: 'ارجع إلى الطلبات للمقارنة',
      secondaryDescription: 'يساعدك الرجوع إلى queue على قياس أولوية هذه المراجعة مقابل بقية الطلبات.',
      supportLabel: 'حوّل إلى الدعم',
      supportDescription: 'الدعم مناسب عندما تصبح المراجعة غير قابلة للحسم من داخل هذا السطح.',
    };
  }

  if (order?.statusTone === 'danger') {
    return {
      primaryLabel: 'افتح مساحة العمليات',
      primaryDescription: 'الطلب معلق، وأفضل إجراء أولي هو العودة إلى workspace الكاملة لقرار تشغيلي أوسع.',
      secondaryLabel: 'افتح queue الطلبات',
      secondaryDescription: 'يوفر الرجوع إلى القائمة رؤية أشمل على الحالات الحرجة المجاورة.',
      supportLabel: 'افتح الدعم فورًا',
      supportDescription: 'التصعيد مناسب هنا لأنه يختصر الطريق عند استمرار التعليق أو غياب حل مباشر.',
    };
  }

  return {
    primaryLabel: 'افتح مساحة العمليات',
    primaryDescription: 'الطلب مستقر نسبيًا، لكن surface الحالي يوجهك إلى workspace كإجراء رئيسي متوافق مع العقد.',
    secondaryLabel: 'ارجع إلى قائمة الطلبات',
    secondaryDescription: 'الرجوع إلى القائمة يسهّل متابعة queue والانتقال إلى طلب آخر عند الحاجة.',
    supportLabel: 'افتح الدعم',
    supportDescription: 'الدعم يبقى مسارًا ثانويًا عند وجود احتياج بشري أو تشغيلي خاص.',
  };
}