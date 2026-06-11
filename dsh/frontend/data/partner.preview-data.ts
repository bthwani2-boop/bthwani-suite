/**
 * CENTRAL DSH DOMAIN PARTNER PREVIEW DATA — SINGLE SOURCE OF TRUTH
 * Owner: dsh/frontend/data (central DSH domain preview data owner)
 * DEV_ONLY data fixture: not runtime truth, not backend/API/binding source
 */

import type {
  DshPartnerIntakeMetric,
  DshPartnerIntakeItem,
  DshPartnerFulfillmentAgreement
} from '../control-panel/partners/workflow';

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
    auditNote: 'CONTRACT_TBD · مالك الفرع ظاهر محليًا فقط.',
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
    auditNote: 'DEV_ONLY · هذا المشرف هو مرجع الحظر الأخير في هذا العرض.',
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
    auditNote: 'DEV_ONLY · دعوة الموصل هنا محلية حتى تتصل الصلاحيات.',
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
    auditNote: 'DEV_ONLY · لا يمكن تغيير هذا الحظر داخل الشريك.',
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
    auditNote: 'DEV_ONLY · التفعيل هنا مرئي فقط حتى يثبت الارتباط المركزي.',
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
    auditNote: 'DEV_ONLY · لا يوجد تجاوز محلي لهذا القرار.',
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

export type PartnerComplaint = {
  id: string;
  partnerId: string;
  category: string;
  submittedAt: string;
  status: 'open' | 'investigating' | 'resolved';
  severity: 'low' | 'medium' | 'high';
  description: string;
  relatedOrderId?: string;
  assignedTo?: string;
};

export const PARTNER_COMPLAINTS_DATA: PartnerComplaint[] = [
  {
    id: 'cmp-001',
    partnerId: 'partner-saha',
    category: 'تأخير استلام المندوب',
    submittedAt: 'منذ ساعتين',
    status: 'open',
    severity: 'high',
    description: 'المندوب لم يصل لاستلام الطلب لأكثر من 45 دقيقة مما أدى إلى تلف الوجبة.',
    relatedOrderId: 'ORD-88219-A',
  },
  {
    id: 'cmp-002',
    partnerId: 'partner-zawya',
    category: 'مشكلة مالية/تسوية',
    submittedAt: 'أمس 14:20',
    status: 'investigating',
    severity: 'medium',
    description: 'يوجد فارق في تسوية الأسبوع الماضي بمقدار 150 ريال لم يتم احتسابه ضمن التحويل البنكي.',
    assignedTo: 'فريق المالية',
  },
  {
    id: 'cmp-003',
    partnerId: 'partner-shorouq',
    category: 'سلوك مندوب',
    submittedAt: 'منذ 3 أيام',
    status: 'resolved',
    severity: 'low',
    description: 'تم التعامل بأسلوب غير احترافي من قبل المندوب عند استلام الطلب.',
    relatedOrderId: 'ORD-77112-B',
  },
];

export type PartnerModificationRequest = {
  id: string;
  partnerId: string;
  type: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  risk: 'neutral' | 'warning' | 'danger';
  changes: { field: string; old: string; new: string }[];
  reason: string;
};

export const PARTNER_MODIFICATION_REQUESTS: PartnerModificationRequest[] = [
  {
    id: 'mod-001',
    partnerId: 'partner-shorouq',
    type: 'تحديث بيانات بنكية (IBAN)',
    submittedAt: 'اليوم 08:30',
    status: 'pending',
    risk: 'danger',
    changes: [
      { field: 'الآيبان', old: 'SA123456789...', new: 'SA987654321...' },
      { field: 'اسم المستفيد', old: 'بوفيه الشروق', new: 'شركة الشروق لتقديم الإعاشة' },
    ],
    reason: 'يتطلب التحقق من الحساب البنكي لتجنب رفض الحوالات المالية. يصنف الإجراء عالي الخطورة.',
  },
  {
    id: 'mod-002',
    partnerId: 'partner-saha',
    type: 'تغيير أوقات العمل',
    submittedAt: 'أمس 22:15',
    status: 'pending',
    risk: 'warning',
    changes: [
      { field: 'الدوام (من)', old: '06:00', new: '07:00' },
      { field: 'الدوام (إلى)', old: '23:00', new: '01:00' },
    ],
    reason: 'تحديث تشغيلي يؤثر على استقبال الطلبات. التحقق الآلي سليم.',
  },
  {
    id: 'mod-003',
    partnerId: 'partner-zawya',
    type: 'تحديث شعار وهوية',
    submittedAt: 'منذ يومين',
    status: 'pending',
    risk: 'neutral',
    changes: [
      { field: 'الشعار', old: 'logo-v1.png', new: 'logo-v2.png' },
    ],
    reason: 'يتطلب مراجعة بسيطة من فريق الكتالوج لضمان الجودة قبل الاعتماد.',
  },
];

export type PartnerPerformanceMetric = {
  id: string;
  kpis: { onTime: string; cancelRate: string; rating: string };
  capacity: string;
  disputes: number;
  compliance: 'high' | 'medium' | 'danger';
};

export const PARTNER_PERFORMANCE_METRICS: PartnerPerformanceMetric[] = [
  { id: 'partner-saha', kpis: { onTime: '98%', cancelRate: '0.5%', rating: '4.8/5' }, capacity: 'مستقر', disputes: 0, compliance: 'high' },
  { id: 'partner-shorouq', kpis: { onTime: '85%', cancelRate: '3.2%', rating: '4.1/5' }, capacity: 'ضغط مرتفع', disputes: 2, compliance: 'medium' },
  { id: 'partner-zawya', kpis: { onTime: '95%', cancelRate: '1.0%', rating: '4.5/5' }, capacity: 'مستقر', disputes: 0, compliance: 'high' },
  { id: 'partner-nokhba', kpis: { onTime: '90%', cancelRate: '2.5%', rating: '4.3/5' }, capacity: 'مستقر', disputes: 1, compliance: 'medium' },
];

export type PartnerDispute = {
  id: string;
  partnerId: string;
  type: string;
  status: string;
  date: string;
  sla: string;
};

export const PARTNER_DISPUTES_DATA: PartnerDispute[] = [
  { id: 'disp-001', partnerId: 'partner-shorouq', type: 'إلغاء طلب متأخر', status: 'مفتوح', date: 'اليوم 10:30', sla: 'تحذير 4 ساعات' },
  { id: 'disp-002', partnerId: 'partner-shorouq', type: 'اعتراض على تقييم', status: 'قيد المراجعة', date: 'أمس 14:00', sla: 'ضمن الوقت' },
  { id: 'disp-003', partnerId: 'partner-nokhba', type: 'نزاع تسوية مالية', status: 'مفتوح', date: 'اليوم 09:15', sla: 'تحذير 8 ساعات' },
];

export type PartnerVisibilityEvent = {
  id: string;
  partnerId: string;
  date: string;
  eventType: 'activated' | 'deactivated_by_partner' | 'deactivated_by_admin' | 'catalog_hidden';
  reason: string;
  actionBy: string;
};

export const PARTNER_VISIBILITY_TIMELINE_DATA: PartnerVisibilityEvent[] = [
  { id: 'vis-001', partnerId: 'partner-saha', date: '2025-01-10 09:00', eventType: 'activated', reason: 'اكمال التسجيل واعتماد المستندات', actionBy: 'النظام' },
  { id: 'vis-002', partnerId: 'partner-saha', date: '2025-06-15 14:30', eventType: 'deactivated_by_partner', reason: 'إغلاق مؤقت للصيانة', actionBy: 'الشريك' },
  { id: 'vis-003', partnerId: 'partner-saha', date: '2025-06-16 10:00', eventType: 'activated', reason: 'انتهاء فترة الصيانة', actionBy: 'الشريك' },
  { id: 'vis-004', partnerId: 'partner-shorouq', date: '2025-10-05 11:20', eventType: 'activated', reason: 'اعتماد المستندات وتفعيل الحساب', actionBy: 'مدير الشركاء' },
  { id: 'vis-005', partnerId: 'partner-shorouq', date: '2026-02-12 16:45', eventType: 'deactivated_by_admin', reason: 'تجاوز حد الشكاوى المسموح به - إيقاف مؤقت', actionBy: 'فريق الامتثال' },
  { id: 'vis-006', partnerId: 'partner-shorouq', date: '2026-02-15 09:10', eventType: 'activated', reason: 'تعهد من الشريك بإصلاح الخلل وإعادة التفعيل', actionBy: 'فريق الامتثال' },
  { id: 'vis-007', partnerId: 'partner-zawya', date: '2026-03-20 08:00', eventType: 'activated', reason: 'تفعيل المتجر', actionBy: 'النظام' },
  { id: 'vis-008', partnerId: 'partner-nokhba', date: '2026-04-01 13:15', eventType: 'catalog_hidden', reason: 'إخفاء الكتالوج لعدم توفر أسعار صحيحة', actionBy: 'مدير الكتالوج' },
  { id: 'vis-009', partnerId: 'partner-nokhba', date: '2026-04-03 10:00', eventType: 'activated', reason: 'تحديث الكتالوج وإعادة التفعيل', actionBy: 'النظام' },
];

export const dshPartnerIntakeMetrics: ReadonlyArray<DshPartnerIntakeMetric> = [
  {
    id: 'metric-offer-pending',
    label: 'Offer Pending Approval',
    value: 2,
    description: 'طلبات تحتاج اعتماد العرض من الشركاء قبل أن يعود للمندوب Offer Approved.',
  },
  {
    id: 'metric-partner-review',
    label: 'Partner Review',
    value: 1,
    description: 'طلبات وصلت بعد الإرسال من الميدان وتنتظر مراجعة الشركاء.',
  },
  {
    id: 'metric-marketing-review',
    label: 'جاهز للتسويق',
    value: 1,
    description: 'طلبات اجتازت الشركاء وتنتظر المراجعة التسويقية النهائية قبل الإطلاق.',
  },
];

export const dshPartnerIntakeItems: ReadonlyArray<DshPartnerIntakeItem> = [
  Object.assign({ id: 'field-saha' }, {
    storeName: 'محمصة الساحة',
    categoryLabel: 'مقاهٍ ومحمصات',
    source: 'app-field' as const,
    queue: 'offer-approval' as const,
    ownerLabel: 'الميداني',
    fieldStatusLabel: 'Offer Pending Approval',
    note: 'العرض أرسله المندوب من شاشة الميدان ويحتاج قرار الشركاء الأول.',
    nextStep: 'عند الاعتماد يعود للمندوب Offer Approved لبدء الزيارة.',
    submittedAt: 'اليوم 09:40',
  }),
  Object.assign({ id: 'field-shorouq' }, {
    storeName: 'بوفيه الشروق',
    categoryLabel: 'بوفيهات',
    source: 'app-field' as const,
    queue: 'offer-approval' as const,
    ownerLabel: 'الميداني',
    fieldStatusLabel: 'Offer Pending Approval',
    note: 'المتجر يحتاج اعتماد أو رفض أو تعديل العرض قبل المتابعة.',
    nextStep: 'التعديل التفصيلي للعرض عند الحاجة قبل المتابعة.',
    submittedAt: 'اليوم 10:05',
  }),
  Object.assign({ id: 'field-wadi' }, {
    storeName: 'مقهى الوادي',
    categoryLabel: 'مقاهٍ',
    source: 'app-field' as const,
    queue: 'partner-review' as const,
    ownerLabel: 'الميداني',
    fieldStatusLabel: 'Partner Review',
    note: 'المندوب أرسل الطلب بعد فتح نموذج الإضافة، والملف الآن داخل مراجعة الشركاء.',
    nextStep: 'بعد الموافقة يُجهز كود الشريك ثم ينتقل الطلب للمراجعة التسويقية.',
    submittedAt: 'اليوم 11:20',
  }),
  Object.assign({ id: 'canonical-store-field-lead-5' }, {
    storeName: 'تمور النخبة',
    categoryLabel: 'مواد غذائية',
    source: 'app-field' as const,
    queue: 'marketing-review' as const,
    ownerLabel: 'الشركاء',
    fieldStatusLabel: 'Offer Approved',
    note: 'تم اعتماد الشركاء واكتملت جاهزية الإضافة، والطلب ينتظر التسويق النهائي.',
    nextStep: 'المراجعة التسويقية النهائية قبل الإطلاق.',
    submittedAt: 'اليوم 12:15',
    canonicalStoreId: 'canonical-store-field-lead-5',
    canonicalProductId: 'canonical-product-field-lead-5-featured',
    canonicalStage: 'marketing-review' as const,
    canonicalSource: 'app-field' as const,
  }),
];

export const PARTNER_FULFILLMENT_AGREEMENTS: readonly DshPartnerFulfillmentAgreement[] = [
  Object.assign({ partnerId: 'partner-saha' }, {
    storeName: 'محمصة الساحة',
    categoryLabel: 'مقاهٍ ومحمصات',
    modes: [
      { mode: 'bthwani_delivery' as const, modeLabel: 'توصيل بثواني', enabled: true, commissionRatePreview: 'RATE_NOT_SET', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready' as const, validityLabel: 'ساري', negotiationNote: 'الاتفاق الافتراضي' },
      { mode: 'partner_delivery' as const, modeLabel: 'توصيل المتجر', enabled: false, commissionRatePreview: 'RATE_NOT_SET', settlementBasis: 'غير مفعّل', operationalReadiness: 'unavailable' as const, validityLabel: 'غير مفعّل' },
      { mode: 'pickup' as const, modeLabel: 'استلام بنفسي', enabled: true, commissionRatePreview: 'RATE_NOT_SET', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready' as const, validityLabel: 'ساري' },
    ],
  }),
  Object.assign({ partnerId: 'partner-shorouq' }, {
    storeName: 'بوفيه الشروق',
    categoryLabel: 'بوفيهات',
    modes: [
      { mode: 'bthwani_delivery' as const, modeLabel: 'توصيل بثواني', enabled: true, commissionRatePreview: 'RATE_NOT_SET', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready' as const, validityLabel: 'ساري' },
      { mode: 'partner_delivery' as const, modeLabel: 'توصيل المتجر', enabled: true, commissionRatePreview: 'RATE_NOT_SET', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'pending' as const, validityLabel: 'قيد التفعيل', negotiationNote: 'يحتاج تأكيد جاهزية موصل المتجر' },
      { mode: 'pickup' as const, modeLabel: 'استلام بنفسي', enabled: false, commissionRatePreview: 'RATE_NOT_SET', settlementBasis: 'غير مفعّل', operationalReadiness: 'unavailable' as const, validityLabel: 'غير مفعّل' },
    ],
  }),
  Object.assign({ partnerId: 'partner-zawya' }, {
    storeName: 'مخبز الزاوية',
    categoryLabel: 'مخابز',
    modes: [
      { mode: 'bthwani_delivery' as const, modeLabel: 'توصيل بثواني', enabled: true, commissionRatePreview: 'RATE_NOT_SET', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready' as const, validityLabel: 'ساري' },
      { mode: 'partner_delivery' as const, modeLabel: 'توصيل المتجر', enabled: true, commissionRatePreview: 'RATE_NOT_SET', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready' as const, validityLabel: 'ساري', negotiationNote: 'موصل المتجر جاهز' },
      { mode: 'pickup' as const, modeLabel: 'استلام بنفسي', enabled: true, commissionRatePreview: 'RATE_NOT_SET', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready' as const, validityLabel: 'ساري', negotiationNote: 'الاتفاق الكامل للأوضاع الثلاثة' },
    ],
  }),
  Object.assign({ partnerId: 'partner-nokhba' }, {
    storeName: 'تمور النخبة',
    categoryLabel: 'مواد غذائية',
    modes: [
      { mode: 'bthwani_delivery' as const, modeLabel: 'توصيل بثواني', enabled: true, commissionRatePreview: 'RATE_NOT_SET', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready' as const, validityLabel: 'ساري' },
      { mode: 'partner_delivery' as const, modeLabel: 'توصيل المتجر', enabled: false, commissionRatePreview: 'RATE_NOT_SET', settlementBasis: 'غير مفعّل', operationalReadiness: 'unavailable' as const, validityLabel: 'غير مفعّل' },
      { mode: 'pickup' as const, modeLabel: 'استلام بنفسي', enabled: true, commissionRatePreview: 'RATE_NOT_SET', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready' as const, validityLabel: 'ساري' },
    ],
  }),
];

export const dshPartnerApprovalLanes = [
  {
    id: 'lane-offer-pending',
    title: 'Offer Pending Approval',
    description: 'الطلب يصل من app-field لاعتماد العرض أو رفضه أو تعديله قبل أي زيارة جديدة.',
  },
  {
    id: 'lane-offer-approved',
    title: 'Offer Approved',
    description: 'بعد الاعتماد يعود الوضع للمندوب كي يبدأ الزيارة أو يكمل الجاهزية.',
  },
  {
    id: 'lane-partner-review',
    title: 'Partner Review',
    description: 'بعد الإرسال من نموذج الإضافة ينتقل الطلب إلى مراجعة الشركاء داخل لوحة التحكم.',
  },
  {
    id: 'lane-marketing',
    title: 'مراجعة التسويق',
    description: 'بعد موافقة الشركاء ينتقل الطلب إلى المراجعة التسويقية النهائية ثم يدخل مسار الإطلاق.',
  },
] as const;
