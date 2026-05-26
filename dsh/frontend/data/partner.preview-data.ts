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

export type PartnerInventoryDetail = {
  id: string;
  name?: string;
  sku: string;
  gtin?: string;
  barcode?: string;
  manufacturerCode?: string;
  internalNote?: string;
  preparationNote?: string;
};

export const CENTRAL_PRODUCT_DETAIL_LOOKUP: Record<string, PartnerInventoryDetail> = {
  // store-1001 items
  'item-apple-1': { id: 'item-apple-1', sku: 'BTH-GRO-FR-001', gtin: '6281000000012', barcode: '6281000000012', manufacturerCode: 'MFR-SL-44' },
  'item-milk-1': { id: 'item-milk-1', sku: 'BTH-GRO-DA-001', gtin: '6280001000445', barcode: '6280001000445', manufacturerCode: 'MFR-DA-01' },
  'item-bread-1': { id: 'item-bread-1', sku: 'BTH-GRO-BK-001', gtin: '6280001000308', barcode: '6280001000308', manufacturerCode: 'MFR-SA-03' },
  'item-yogurt-1': { id: 'item-yogurt-1', sku: 'BTH-GRO-DA-002', gtin: '6280001000112', barcode: '6280001000112', manufacturerCode: 'MFR-DA-02' },
  'item-croissant-2': { id: 'item-croissant-2', sku: 'BTH-BAK-001', gtin: '6280001000551', barcode: '6280001000551', manufacturerCode: 'MFR-BKR-05' },
  'item-chicken-2': { id: 'item-chicken-2', sku: 'BTH-RES-001', gtin: '6280001000148', barcode: '6280001000148', manufacturerCode: 'MFR-CH-14' },
  'item-salad-2': { id: 'item-salad-2', sku: 'BTH-RES-SL-001', gtin: '6280001000223', barcode: '6280001000223', manufacturerCode: 'MFR-SD-22' },
  'item-choco-2': { id: 'item-choco-2', sku: 'BTH-SWT-001', gtin: '6280001000552', barcode: '6280001000552', manufacturerCode: 'MFR-BKR-05', internalNote: 'يرجى تحديث صورة المنتج بدقة أعلى.' },
  // store-1002 items
  'item-croissant-1': { id: 'item-croissant-1', sku: 'BTH-BAK-002', gtin: '6280001000188', barcode: '6280001000188', manufacturerCode: 'MFR-BKR-06' },
  'item-cake-1': { id: 'item-cake-1', sku: 'BTH-SWT-002', gtin: '6280001000902', barcode: '6280001000902', manufacturerCode: 'MFR-DR-90' },
  'item-roll-1': { id: 'item-roll-1', sku: 'BTH-BAK-003', gtin: '6280001000317', barcode: '6280001000317', manufacturerCode: 'MFR-BK-31' },
  'item-choco-1': { id: 'item-choco-1', sku: 'BTH-SWT-003', gtin: '6280001000419', barcode: '6280001000419', manufacturerCode: 'MFR-SW-41' },
  // store-1003 items
  'item-pasta-1': { id: 'item-pasta-1', sku: 'BTH-RES-003', gtin: '6280001000225', barcode: '6280001000225', manufacturerCode: 'MFR-SD-22' },
  'item-salad-1': { id: 'item-salad-1', sku: 'BTH-RES-SL-002', gtin: '6280001000227', barcode: '6280001000227', manufacturerCode: 'MFR-SD-23' },
  'item-chicken-1': { id: 'item-chicken-1', sku: 'BTH-RES-002', gtin: '6280001000018', barcode: '6280001000018', manufacturerCode: 'MFR-CL-01' },
  // canonical field-lead-5
  'canonical-product-field-lead-5-featured': { id: 'canonical-product-field-lead-5-featured', name: 'علبة تمر فاخر', sku: 'LEAD5-DATES-BOX', gtin: '6280001055001', barcode: '6280001055001', manufacturerCode: 'FIELD-LEAD5-01', internalNote: 'منتج ميداني افتتاحي — بانتظار مراجعة التسويق.' },
  // LEGACY_WORKFLOW_PREVIEW_ONLY: Kept for previewing legacy approval states and simulation screens.
  // Consumers: InventoryCatalogScreen, ControlPanelDshCatalogScreen, PartnerHubScreen.
  // Reason: Required to populate partner/marketing lists for workflow verification.
  'prd-restaurant-burger': { id: 'prd-restaurant-burger', sku: 'BTH-RES-002', gtin: '6280001000019', barcode: '6280001000019', manufacturerCode: 'MFR-CL-01' },
  'prd-restaurant-chicken': { id: 'prd-restaurant-chicken', sku: 'BTH-RES-001', gtin: '6280001000149', barcode: '6280001000149', manufacturerCode: 'MFR-CH-14' },
  'prd-restaurant-pasta': { id: 'prd-restaurant-pasta', sku: 'BTH-RES-003', gtin: '6280001000224', barcode: '6280001000224', manufacturerCode: 'MFR-SD-22', internalNote: 'مراجعة أولية من الميداني.' },
  'prd-sweets-juice': { id: 'prd-sweets-juice', sku: 'BTH-SWT-002', gtin: '6280001000903', barcode: '6280001000903', manufacturerCode: 'MFR-DR-90' },
  'prd-grocery-bread': { id: 'prd-grocery-bread', sku: 'BTH-GRO-BK-003', gtin: '6280001000309', barcode: '6280001000309', manufacturerCode: 'MFR-SA-03' },
  'prd-grocery-apple': { id: 'prd-grocery-apple', sku: 'BTH-GRO-FR-001', gtin: '6280001000441', barcode: '6280001000441', manufacturerCode: 'MFR-SL-44' },
  'prd-sweets-cake': { id: 'prd-sweets-cake', sku: 'BTH-SWT-001', gtin: '6280001000553', barcode: '6280001000553', manufacturerCode: 'MFR-BKR-05', internalNote: 'يرجى تحديث صورة المنتج بدقة أعلى.' },
  'prd-dates-box': { id: 'prd-dates-box', sku: 'BTH-DAT-001', gtin: '6280001055009', barcode: '6280001000995', manufacturerCode: 'MFR-SW-99', internalNote: 'نسبة الخصم عالية جداً وتؤثر على هامش الربح.' },
  'prd-honey-jar': { id: 'prd-honey-jar', sku: 'BTH-DAT-002', gtin: '6280001001022', barcode: '6280001001022', manufacturerCode: 'MFR-DR-102' },
};
