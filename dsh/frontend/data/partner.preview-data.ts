/**
 * CENTRAL DSH DOMAIN PARTNER PREVIEW DATA — SINGLE SOURCE OF TRUTH
 * Owner: dsh/frontend/data (central DSH domain preview data owner)
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source
 */

export type PartnerTeamRole = 'owner' | 'supervisor' | 'staff' | 'courier';
export type PartnerTeamStatus = 'active' | 'paused' | 'invited' | 'blocked' | 'review-needed';

export type PartnerTeamMember = {
  id: string;
  name: string;
  role: PartnerTeamRole;
  roleLabel: 'مالك' | 'مشرف' | 'موظف' | 'موصل';
  status: PartnerTeamStatus;
  statusLabel: 'نشط' | 'موقوف' | 'مدعو' | 'محظور' | 'قيد المراجعة';
  branchAssignment: string;
  permissionsSummary: string;
  deliveryAssignment: string;
  inviteLifecycle: string;
  operationalImpact: string;
  auditNote: string;
  inlineActionLabel: string;
};

export type PartnerCoverageZoneStatus = 'active' | 'pending' | 'blocked';

export type PartnerCoverageZone = {
  id: string;
  name: string;
  status: PartnerCoverageZoneStatus;
  statusLabel: 'نشطة' | 'قيد المراجعة' | 'محجوبة';
  branchRelation: string;
  serviceModeRelation: string;
  policySummary: string;
  policyReason: string;
  operationalImpact: string;
  pricingReference: string;
  commissionReference: string;
  payoutReference: string;
  reviewActionLabel: string;
  auditNote: string;
};

export const partnerTeamPreviewMembers: readonly PartnerTeamMember[] = [
  {
    id: 'owner',
    name: 'خالد',
    role: 'owner',
    roleLabel: 'مالك',
    status: 'active',
    statusLabel: 'نشط',
    branchAssignment: 'الفرع الحالي',
    permissionsSummary: 'صلاحيات كاملة على الفرع والفريق والاعتماد النهائي.',
    deliveryAssignment: 'لا يوجد',
    inviteLifecycle: 'اعتماد مالك مباشر',
    operationalImpact: 'لا يُعطَّل محليًا في هذا السطح.',
    auditNote: 'UI_PREVIEW_ONLY · CONTRACT_TBD · مالك الفرع ظاهر محليًا فقط.',
    inlineActionLabel: 'عرض الدور',
  },
  {
    id: 'supervisor',
    name: 'سارة',
    role: 'supervisor',
    roleLabel: 'مشرف',
    status: 'active',
    statusLabel: 'نشط',
    branchAssignment: 'إسناد الفرع الحالي',
    permissionsSummary: 'إدارة الطلبات والورديات وإشراف الفريق.',
    deliveryAssignment: 'إشراف على التوصيل عند الحاجة',
    inviteLifecycle: 'مفعل ويعمل الآن',
    operationalImpact: 'تعطيله يوقف المتابعة التشغيلية للفرع.',
    auditNote: 'UI_PREVIEW_ONLY · هذا المشرف هو مرجع الحظر الأخير في هذا العرض.',
    inlineActionLabel: 'تعطيل',
  },
  {
    id: 'staff-paused',
    name: 'مروان',
    role: 'staff',
    roleLabel: 'موظف',
    status: 'paused',
    statusLabel: 'موقوف',
    branchAssignment: 'فرع الدعم / الوردية السابقة',
    permissionsSummary: 'التجهيز والطلبات والتحديثات التشغيلية الخفيفة.',
    deliveryAssignment: 'لا يوجد',
    inviteLifecycle: 'موقوف مؤقتًا بعد مراجعة داخلية',
    operationalImpact: 'إعادة التفعيل تعيد الوصول إلى تنفيذ الطلبات.',
    auditNote: 'CONTRACT_TBD · إعادة التفعيل تحتاج ربطًا مركزيًا لاحقًا.',
    inlineActionLabel: 'إعادة تفعيل',
  },
  {
    id: 'courier-invited',
    name: 'عمر',
    role: 'courier',
    roleLabel: 'موصل',
    status: 'invited',
    statusLabel: 'مدعو',
    branchAssignment: 'نطاق التوصيل الخاص بالفرع',
    permissionsSummary: 'تسليم فقط ضمن أوضاع التوصيل الداخلي.',
    deliveryAssignment: 'مرتبط بتوصيل المتجر',
    inviteLifecycle: 'الدعوة مرسلة وتنتظر القبول',
    operationalImpact: 'قبوله يفتح الإسناد الداخلي للتوصيل.',
    auditNote: 'UI_PREVIEW_ONLY · دعوة الموصل هنا محلية حتى تتصل الصلاحيات.',
    inlineActionLabel: 'إعادة إرسال الدعوة',
  },
  {
    id: 'staff-review',
    name: 'رهف',
    role: 'staff',
    roleLabel: 'موظف',
    status: 'review-needed',
    statusLabel: 'قيد المراجعة',
    branchAssignment: 'الفرع الحالي',
    permissionsSummary: 'صلاحيات مقترحة بانتظار مراجعة تشغيلية.',
    deliveryAssignment: 'لا يوجد',
    inviteLifecycle: 'بانتظار اعتماد الصلاحيات',
    operationalImpact: 'لا يظهر في المسار التشغيلي الكامل قبل الاعتماد.',
    auditNote: 'CONTRACT_TBD · حالة المراجعة تحتاج ربطًا مركزيًا.',
    inlineActionLabel: 'طلب مراجعة',
  },
  {
    id: 'courier-blocked',
    name: 'فهد',
    role: 'courier',
    roleLabel: 'موصل',
    status: 'blocked',
    statusLabel: 'محظور',
    branchAssignment: 'موقوف حتى رفع الحظر المركزي',
    permissionsSummary: 'تسليم فقط مع قفل تشغيلي حتى المراجعة.',
    deliveryAssignment: 'موقوف عن الإسناد',
    inviteLifecycle: 'محجوب بقرار مركزي',
    operationalImpact: 'الحظر يمنع إسناد الطلبات لهذا الموصل.',
    auditNote: 'UI_PREVIEW_ONLY · لا يمكن تغيير هذا الحظر داخل الشريك.',
    inlineActionLabel: 'إعادة تفعيل',
  },
];

export const partnerCoveragePreviewZones: readonly PartnerCoverageZone[] = [
  {
    id: 'yasmin',
    name: 'الياسمين',
    status: 'active',
    statusLabel: 'نشطة',
    branchRelation: 'مرتبطة بالفرع الحالي',
    serviceModeRelation: 'توصيل المتجر + استلام بنفسك',
    policySummary: 'المنطقة تحت سياسة geofence مركزية وتقبل الطلبات ضمن القواعد الحالية.',
    policyReason: 'لا يوجد تعارض حالي مع سياسة التغطية أو السعة.',
    operationalImpact: 'تخدم الطلبات مباشرة ولا تحتاج تدخلًا تشغيليًا إضافيًا.',
    pricingReference: 'WLT/Finance',
    commissionReference: 'Control Panel',
    payoutReference: 'WLT/Finance',
    reviewActionLabel: 'طلب مراجعة',
    auditNote: 'UI_PREVIEW_ONLY · التفعيل هنا مرئي فقط حتى يثبت الارتباط المركزي.',
  },
  {
    id: 'nada',
    name: 'الندى',
    status: 'pending',
    statusLabel: 'قيد المراجعة',
    branchRelation: 'مرتبطة بفرع الندى على مستوى النطاق',
    serviceModeRelation: 'توصيل المتجر بانتظار الاعتماد',
    policySummary: 'المنطقة تحتاج مراجعة geofence قبل الفتح الكامل.',
    policyReason: 'الضبط المركزي لم يثبت بعد لهذه الحدود.',
    operationalImpact: 'تبقى الطلبات محدودة حتى اعتماد السياسة.',
    pricingReference: 'WLT/Finance',
    commissionReference: 'Control Panel',
    payoutReference: 'WLT/Finance',
    reviewActionLabel: 'طلب مراجعة',
    auditNote: 'CONTRACT_TBD · الشريك يطلب المراجعة ولا يغيّر السياسة محليًا.',
  },
  {
    id: 'yarmouk',
    name: 'اليرموك',
    status: 'blocked',
    statusLabel: 'محجوبة',
    branchRelation: 'فرع مساند فقط بعد رفع الحظر',
    serviceModeRelation: 'توصيل بثواني مؤجل حتى الاعتماد',
    policySummary: 'المنطقة محجوبة وفق السياسة المركزية الحالية.',
    policyReason: 'سعة أو جغرافيا أو قرار تشغيلي يمنع الفتح الآن.',
    operationalImpact: 'لا تظهر للعميل حتى يرفع Control Panel الحظر.',
    pricingReference: 'Control Panel + WLT/Finance',
    commissionReference: 'WLT/Finance',
    payoutReference: 'WLT/Finance',
    reviewActionLabel: 'طلب مراجعة',
    auditNote: 'UI_PREVIEW_ONLY · لا يوجد تجاوز محلي لهذا القرار.',
  },
];

export const dshPartnerAnalyticsPreview = {
  storeFavoritesCount: 847,
  productFavoritesCount: 2340,
  followersCount: 1200,
  totalRatings: 318,
  averageRating: 4.9,
  topOrderedProduct: { name: 'علبة تمر فاخر', ordersCount: 214 },
  topFavoritedProduct: { name: 'تمر المجدول الملكي', favoritesCount: 189 },
  topViewedProduct: { name: 'تمر الأمبر الذهبي', viewsCount: 1080 },
  opportunityProduct: {
    name: 'تمر المجدول الملكي',
    favoritesCount: 189,
    ordersCount: 22,
    insight: 'مفضّل كثيرًا لكنه لم يتحول لطلبات كافية. فرصة عرض قصير.',
  },
  smartRecommendation: 'فعّل خصمًا قصيرًا 15٪ على المنتج الأعلى حفظًا لمدة 3 أيام.',
} as const;
