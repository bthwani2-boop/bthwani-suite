import type { AppearanceRecord, ProviderRecord, ServiceRecord, DshPlatformVarRecord, DshPlatformProviderControlRecord, DshPlatformScopeLayer, DshPlatformSimulationScenario, DshPlatformAuditEntry } from '../shared/dsh-cp-platform.contract';
import type { AdminRole, MockAdminUser, PlatformPermission } from '../shared/dsh-cp-administration.contract';
import type { DshSurfaceId } from '../shared/dsh-flow-registry';
import type { DshCrossSurfaceClosureItem } from '../shared/dshCrossSurfaceClosureMap';
import type { Phase12FixtureLocation } from '../../types';

// -----------------------------------------------------------------------------
// Platform records
// -----------------------------------------------------------------------------
/**
 * UI_PREVIEW_ONLY: Control-panel platform configuration preview fixtures.
 * Merged from: cp-appearance.preview.ts + cp-providers.preview.ts + cp-services.preview.ts
 * Owner: dsh/frontend/data
 */

export const dshPlatformPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'not_applicable',
} as const;

// --- Appearance ---

export const PREVIEW_APPEARANCE_RECORDS: readonly AppearanceRecord[] = [
  {
    id: 'platform-global-identity',
    label: 'Platform Global Identity',
    owner: 'DesignSystem',
    status: 'preview-only',
    scope: 'Global',
    risk: 'visual-identity',
    currentPreviewValue: 'BThwani 2026 Core',
    proposedPreviewValue: 'BThwani 2026 Core',
    effectSummary: 'الهوية المركزية للمنصة، لا يتم تغييرها محليًا.',
    auditRollbackHint: 'Platform core is immutable from service level.',
    centralColorSystemNote: 'التحكم المستقبلي يطبّق على كل التطبيقات والأسطح عبر النظام المركزي.',
    reason: 'Central Brand Enforcement',
    evidence: 'Brand Guidelines 2026',
    rollbackTarget: 'None',
  },
  {
    id: 'app-client-color-application',
    label: 'App Client Color Application',
    owner: 'AppShell',
    status: 'preview-only',
    scope: 'App',
    risk: 'medium',
    currentPreviewValue: 'Standard Tokens',
    proposedPreviewValue: 'Client App Context',
    effectSummary: 'تطبيق ألوان الهوية المركزية داخل تطبيق العميل.',
    auditRollbackHint: 'Rollback to Standard Tokens. Owner: AppShell.',
    centralColorSystemNote: 'أي تطبيق يستهلك tokens معتمدة فقط. لا يسمح بإدخال hex حر أو إنشاء نظام ألوان محلي.',
  },
  {
    id: 'control-panel-color-application',
    label: 'Control Panel Color Application',
    owner: 'Platform',
    status: 'contract-needed',
    scope: 'Platform',
    risk: 'visual-identity',
    currentPreviewValue: 'Global Tokens',
    proposedPreviewValue: 'High Contrast Operations Dashboard',
    effectSummary: 'استهلاك الـ tokens المركزية وتطبيق تباين أعلى لعمليات Control Panel.',
    auditRollbackHint: 'Requires DesignSystem approval. Rollback to Global Tokens.',
    centralColorSystemNote: 'أي override لا يعني نظام ألوان محلي. يجب استخدام Design System Tokens.',
    reason: 'Operational dashboard readability',
    evidence: 'UX Research Ticket 502',
    rollbackTarget: 'Global Tokens',
  },
];

// --- Providers ---

/** Masked credential placeholder — never show real keys */
const MASKED = '●●●●●●●●●●●●●';

export const PREVIEW_PROVIDER_RECORDS: readonly ProviderRecord[] = [
  { id: 'provider-maps-primary', label: 'مزود الخرائط', category: 'الخرائط', selectedProvider: 'Google Maps Platform', maskedCredential: MASKED, environment: 'production', status: 'active', owner: 'Platform', priority: 1, fallbackProvider: 'Mapbox', lastTestResult: 'pass', rollbackTarget: 'Mapbox', activationNote: 'يستخدم لتحديد المواقع والتتبع' },
  { id: 'provider-sms-primary', label: 'مزود SMS', category: 'الرسائل SMS', selectedProvider: 'Twilio', maskedCredential: MASKED, environment: 'production', status: 'active', owner: 'Platform', priority: 1, fallbackProvider: 'Unifonic', lastTestResult: 'pass', rollbackTarget: 'Unifonic', evidence: 'SMS Integration #S-001', activationNote: 'يستخدم لرسائل التحقق والإشعارات النصية' },
  { id: 'provider-payment-primary', label: 'مزود الدفع', category: 'الدفع', selectedProvider: 'Telr', maskedCredential: MASKED, environment: 'production', status: 'active', owner: 'Platform', priority: 1, fallbackProvider: 'Checkout.com', lastTestResult: 'pass', rollbackTarget: 'Checkout.com', evidence: 'Payment Integration #P-001', activationNote: 'معالجة الدفع الآمن للعملاء' },
  { id: 'provider-hosting-primary', label: 'مزود الاستضافة', category: 'البنية التحتية', selectedProvider: 'AWS', maskedCredential: MASKED, environment: 'production', status: 'active', owner: 'Platform', priority: 1, fallbackProvider: 'GCP', lastTestResult: 'pass', rollbackTarget: 'GCP', activationNote: 'استضافة خوادم المنصة وقواعد البيانات' },
  { id: 'provider-storage-primary', label: 'مزود التخزين', category: 'التخزين السحابي', selectedProvider: 'Firebase Storage', maskedCredential: MASKED, environment: 'production', status: 'active', owner: 'Platform', priority: 1, fallbackProvider: 'AWS S3', lastTestResult: 'pass', rollbackTarget: 'AWS S3', activationNote: 'تخزين الصور والمستندات' },
  { id: 'provider-email-primary', label: 'مزود البريد', category: 'البريد الإلكتروني', selectedProvider: 'Mailgun', maskedCredential: MASKED, environment: 'production', status: 'active', owner: 'Platform', priority: 1, fallbackProvider: 'SendGrid', lastTestResult: 'pass', rollbackTarget: 'SendGrid', activationNote: 'إرسال الفواتير والتنبيهات عبر البريد' },
  { id: 'provider-push-primary', label: 'مزود الإشعارات', category: 'الإشعارات الفورية', selectedProvider: 'Firebase Cloud Messaging', maskedCredential: MASKED, environment: 'production', status: 'active', owner: 'Platform', priority: 1, fallbackProvider: 'OneSignal', lastTestResult: 'pass', rollbackTarget: 'OneSignal', activationNote: 'إشعارات التطبيق' },
];

// --- Services ---

// Top-level platform services only: DSH, KNZ, WLT, AMN, ARB, MRF, KWD, SND, ESF.
// Sub-capabilities (عونك, شي إن, Store Pickup, Scheduled Orders) are NOT here —
// they are DSH-internal capabilities controlled via Platform > Vars and Platform > Rollouts.
export const PREVIEW_SERVICE_RECORDS: readonly ServiceRecord[] = [
  { id: 'service-dsh', label: 'DSH — خدمات التوصيل واللوجستية', description: 'الخدمة العليا لكل عمليات التوصيل والكباتن والشركاء. تتضمن قدرات داخلية كعونك وشي إن.', owner: 'Platform', status: 'live', clientVisibility: 'visible', scope: 'Global', risk: 'critical', effectSummary: 'الخدمة مفعلة عالميًا وظاهرة للعملاء.', auditRollbackHint: 'الرجوع إلى internal-only يتطلب موافقة Platform Governor.', reason: 'الخدمة الأساسية للمنصة', evidence: 'Platform Approval 001', rollbackTarget: 'internal-only' },
  { id: 'service-wlt', label: 'WLT — المحافظ والمالية', description: 'المالك المالي لجميع التسويات ومحافظ الكباتن والمتاجر. API داخلي فقط.', owner: 'Platform', status: 'live', clientVisibility: 'hidden', scope: 'Global', risk: 'critical', effectSummary: 'مفعلة كـ API داخلي — لا واجهة مباشرة للعملاء.', auditRollbackHint: 'إيقاف WLT يجمد كل التسويات والمحافظ.', reason: 'صاحب القرار المالي للمنصة', evidence: 'Platform Approval 002', rollbackTarget: 'internal-only' },
  { id: 'service-amn', label: 'AMN — الأمن والتحقق', description: 'خدمة الهوية والتحقق من المستخدمين والكباتن والشركاء.', owner: 'Platform', status: 'internal-only', clientVisibility: 'hidden', scope: 'Global', risk: 'high', effectSummary: 'مقررة — قيد الإضافة.', auditRollbackHint: 'لم تُضَف بعد.', rollbackTarget: 'paused' },
  { id: 'service-knz', label: 'KNZ — [قيد التعريف]', description: 'خدمة مقررة في خارطة المنصة — لم يُحدَّد نطاقها بعد.', owner: 'Platform', status: 'paused', clientVisibility: 'hidden', scope: 'Global', risk: 'low', effectSummary: 'مقررة — لم تُضَف بعد.', auditRollbackHint: 'لم تُضَف بعد.', rollbackTarget: 'paused' },
  { id: 'service-arb', label: 'ARB — [قيد التعريف]', description: 'خدمة مقررة في خارطة المنصة — لم يُحدَّد نطاقها بعد.', owner: 'Platform', status: 'paused', clientVisibility: 'hidden', scope: 'Global', risk: 'low', effectSummary: 'مقررة — لم تُضَف بعد.', auditRollbackHint: 'لم تُضَف بعد.', rollbackTarget: 'paused' },
  { id: 'service-mrf', label: 'MRF — [قيد التعريف]', description: 'خدمة مقررة في خارطة المنصة — لم يُحدَّد نطاقها بعد.', owner: 'Platform', status: 'paused', clientVisibility: 'hidden', scope: 'Global', risk: 'low', effectSummary: 'مقررة — لم تُضَف بعد.', auditRollbackHint: 'لم تُضَف بعد.', rollbackTarget: 'paused' },
  { id: 'service-kwd', label: 'KWD — [قيد التعريف]', description: 'خدمة مقررة في خارطة المنصة — لم يُحدَّد نطاقها بعد.', owner: 'Platform', status: 'paused', clientVisibility: 'hidden', scope: 'Global', risk: 'low', effectSummary: 'مقررة — لم تُضَف بعد.', auditRollbackHint: 'لم تُضَف بعد.', rollbackTarget: 'paused' },
  { id: 'service-snd', label: 'SND — [قيد التعريف]', description: 'خدمة مقررة في خارطة المنصة — لم يُحدَّد نطاقها بعد.', owner: 'Platform', status: 'paused', clientVisibility: 'hidden', scope: 'Global', risk: 'low', effectSummary: 'مقررة — لم تُضَف بعد.', auditRollbackHint: 'لم تُضَف بعد.', rollbackTarget: 'paused' },
  { id: 'service-esf', label: 'ESF — [قيد التعريف]', description: 'خدمة مقررة في خارطة المنصة — لم يُحدَّد نطاقها بعد.', owner: 'Platform', status: 'paused', clientVisibility: 'hidden', scope: 'Global', risk: 'low', effectSummary: 'مقررة — لم تُضَف بعد.', auditRollbackHint: 'لم تُضَف بعد.', rollbackTarget: 'paused' },
];

// -----------------------------------------------------------------------------
// Administration preview
// -----------------------------------------------------------------------------
export const ADMIN_ROLES: readonly AdminRole[] = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    arabicName: 'المسؤول الأعلى',
    description: 'صلاحيات كاملة بلا قيود — الصلاحية الأعلى في المنصة',
    permissions: [
      'view-platform', 'request-change', 'approve-change', 'apply-demo',
      'rollback', 'manage-providers', 'manage-appearance', 'manage-services', 'view-audit',
    ],
    tone: 'danger',
  },
  {
    id: 'platform-governor',
    name: 'Platform Governor',
    arabicName: 'حاكم المنصة',
    description: 'يرى ويتحكم في Platform بالكامل بما فيها الإيقاف والتشغيل وتغيير المتغيرات السيادية',
    permissions: [
      'view-platform', 'request-change', 'approve-change', 'apply-demo',
      'rollback', 'manage-providers', 'manage-appearance', 'manage-services', 'view-audit',
    ],
    tone: 'brand',
  },
  {
    id: 'platform-approver',
    name: 'Platform Approver',
    arabicName: 'معتمد Platform',
    description: 'يعتمد الطلبات الواردة من المشغلين ويملك صلاحية التراجع (Rollback)',
    permissions: ['view-platform', 'approve-change', 'rollback', 'view-audit'],
    tone: 'warning',
  },
  {
    id: 'platform-operator',
    name: 'Platform Operator',
    arabicName: 'مشغّل Platform',
    description: 'يطلب التغييرات وينفذ الإجراءات التجريبية بعد الاعتماد',
    permissions: ['view-platform', 'request-change', 'apply-demo', 'view-audit'],
    tone: 'success',
  },
  {
    id: 'finance-approver',
    name: 'Finance Approver',
    arabicName: 'معتمد مالي',
    description: 'يعتمد التغييرات المالية الحساسة فقط (رصيد المحافظ، التسويات، المتغيرات المالية)',
    permissions: ['view-platform', 'approve-change', 'view-audit'],
    tone: 'warning',
  },
  {
    id: 'viewer',
    name: 'Viewer',
    arabicName: 'مراقب',
    description: 'يرى Platform والسجل فقط بلا صلاحية تعديل أو اعتماد',
    permissions: ['view-platform', 'view-audit'],
    tone: 'default',
  },
];

export const PLATFORM_PERMISSIONS: readonly PlatformPermission[] = [
  { id: 'view-platform', name: 'رؤية Platform', scope: 'كل التبويبات' },
  { id: 'request-change', name: 'طلب تغيير', scope: 'Vars, Services, Providers, Appearance' },
  { id: 'approve-change', name: 'اعتماد تغيير', scope: 'بعد طلب من مشغّل' },
  { id: 'apply-demo', name: 'تطبيق Demo / محاكاة', scope: 'وضع المحاكاة المحلي' },
  { id: 'rollback', name: 'Rollback', scope: 'التراجع عن آخر تغيير' },
  { id: 'manage-providers', name: 'إدارة المزودين', scope: 'Providers workspace' },
  { id: 'manage-appearance', name: 'إدارة المظهر', scope: 'Appearance workspace' },
  { id: 'manage-services', name: 'إدارة الخدمات', scope: 'Services workspace' },
  { id: 'view-audit', name: 'رؤية السجل', scope: 'Audit workspace' },
];

export const MOCK_USERS: readonly MockAdminUser[] = [
  { id: 'u1', name: 'أحمد الشريف', email: 'ahmed.sharif@bthwani.com', roleId: 'platform-governor', status: 'active', lastAccess: 'منذ ساعة' },
  { id: 'u2', name: 'فاطمة القحطاني', email: 'fatima.q@bthwani.com', roleId: 'platform-approver', status: 'active', lastAccess: 'منذ 3 ساعات' },
  { id: 'u3', name: 'خالد النعماني', email: 'khalid.n@bthwani.com', roleId: 'platform-operator', status: 'active', lastAccess: 'منذ 30 دقيقة' },
  { id: 'u4', name: 'ريم السعدي', email: 'reem.s@bthwani.com', roleId: 'finance-approver', status: 'active', lastAccess: 'منذ يوم' },
  { id: 'u5', name: 'سامي العمري', email: 'sami.a@bthwani.com', roleId: 'viewer', status: 'pending', lastAccess: 'لم يسجل دخول بعد' },
];

// -----------------------------------------------------------------------------
// Geo heatmap preview
// -----------------------------------------------------------------------------
/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source.
 */
export const geoHeatmapPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'not_applicable',
} as const;

export type GeoHeatmapZone = {
  id: string;
  name: string;
  demandOrders: number;
  activeCaptains: number;
  idleCaptains: number;
  supplyDemandGap: number;
  delayedPickups: number;
  slaRisk: 'منخفض' | 'متوسط' | 'مرتفع' | 'حرج';
  storePressure: 'منخفض' | 'متوسط' | 'مرتفع' | 'حرج';
  recommendedAction: string;
  expectedImpact: string;
  ownerSurface: DshSurfaceId;
  confidence: 'عالية' | 'متوسطة' | 'منخفضة';
  filterKey: 'orders' | 'captains' | 'stores' | 'sla' | 'peak';
  severity: 'best' | 'warning' | 'danger' | 'brand';
};

export const GEO_HEATMAP_ZONES: readonly GeoHeatmapZone[] = [
  {
    id: 'N-01',
    name: 'شمال الرياض',
    demandOrders: 42,
    activeCaptains: 6,
    idleCaptains: 1,
    supplyDemandGap: 8,
    delayedPickups: 5,
    slaRisk: 'حرج',
    storePressure: 'مرتفع',
    recommendedAction: 'انقل كباتن من الجنوب وفعّل حافز المنطقة فورًا',
    expectedImpact: 'خفض التأخير 18٪ خلال 30 دقيقة',
    ownerSurface: 'control-panel',
    confidence: 'عالية',
    filterKey: 'peak',
    severity: 'danger',
  },
  {
    id: 'E-02',
    name: 'شرق الرياض',
    demandOrders: 31,
    activeCaptains: 5,
    idleCaptains: 2,
    supplyDemandGap: 4,
    delayedPickups: 2,
    slaRisk: 'مرتفع',
    storePressure: 'متوسط',
    recommendedAction: 'وسّع الاستقبال مؤقتًا واحتفظ بنطاق ضيق',
    expectedImpact: 'تخفيف الضغط 12٪',
    ownerSurface: 'control-panel',
    confidence: 'عالية',
    filterKey: 'orders',
    severity: 'warning',
  },
  {
    id: 'C-03',
    name: 'وسط الرياض',
    demandOrders: 18,
    activeCaptains: 8,
    idleCaptains: 4,
    supplyDemandGap: -2,
    delayedPickups: 0,
    slaRisk: 'منخفض',
    storePressure: 'منخفض',
    recommendedAction: 'انقل الفائض إلى الشمال عند الحاجة',
    expectedImpact: 'رفع التغطية للمناطق المضغوطة',
    ownerSurface: 'control-panel',
    confidence: 'متوسطة',
    filterKey: 'captains',
    severity: 'best',
  },
  {
    id: 'S-04',
    name: 'جنوب الرياض',
    demandOrders: 12,
    activeCaptains: 9,
    idleCaptains: 5,
    supplyDemandGap: -6,
    delayedPickups: 0,
    slaRisk: 'منخفض',
    storePressure: 'منخفض',
    recommendedAction: 'حافظ على السعة الحالية وراقب التحويلات',
    expectedImpact: 'استقرار الخدمة مع فائض متاح',
    ownerSurface: 'control-panel',
    confidence: 'متوسطة',
    filterKey: 'stores',
    severity: 'brand',
  },
];

// -----------------------------------------------------------------------------
// Recommendation preview
// -----------------------------------------------------------------------------
export type DshRecommendationSeverity = 'critical' | 'high' | 'medium' | 'low';
export type DshRecommendationConfidence = 'high' | 'medium' | 'low';

export type DshUnifiedRecommendation = {
  id: string;
  surface: string;
  sourceSurface?: DshSurfaceId;
  affectedSurface?: DshSurfaceId;
  actor?: DshActor;
  lifecycleStep?: DshLifecycleStep;
  entityId?: string;
  entityLabel?: string;
  status?: string;
  risk?: string;
  severity: DshRecommendationSeverity;
  confidence: DshRecommendationConfidence;
  affectedEntity: string;
  reason: string;
  evidence: string;
  nextAction: string;
  owner: string;
  expectedImpact: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  counterpartRouteHint?: string;
  runtimeBindingStatus?: DshRuntimeBindingStatus;
  counterpartLinks?: readonly DshCounterpartLink[];
};

export function getDshRecommendationConfidenceLabel(confidence: DshRecommendationConfidence) {
  if (confidence === 'high') {
    return 'ثقة عالية';
  }

  if (confidence === 'medium') {
    return 'ثقة متوسطة';
  }

  return 'ثقة منخفضة';
}

export function getDshRecommendationSeverityLabel(severity: DshRecommendationSeverity) {
  if (severity === 'critical') {
    return 'حرج';
  }

  if (severity === 'high') {
    return 'مرتفع';
  }

  if (severity === 'medium') {
    return 'متوسط';
  }

  return 'منخفض';
}

// --- Cross-surface journey fixtures (merged from cp-journey-fixtures.ts) ---

/**
 * UI_PREVIEW_ONLY: Cross-surface journey closure examples.
 * These link Client, Partner, Captain, Field and Operations.
 */
export const DSH_CROSS_SURFACE_JOURNEYS: readonly DshUnifiedRecommendation[] = [
  {
    id: 'journey-discovery',
    surface: 'app-client',
    sourceSurface: 'app-client',
    affectedSurface: 'control-panel',
    actor: 'client',
    lifecycleStep: 'discovery',
    entityId: 'CAT-DISCOVERY',
    entityLabel: 'اكتشاف المتاجر',
    status: 'نشط',
    risk: 'نقص تنوع',
    severity: 'low',
    confidence: 'high',
    affectedEntity: 'واجهة العميل الرئيسية',
    reason: 'يتم عرض المتاجر بناءً على الموقع الجغرافي النشط.',
    evidence: '١٥ متجرًا متاحًا في النطاق الحالي.',
    nextAction: 'تحديث الكتالوج المركزي',
    owner: 'إدارة الكتالوج',
    expectedImpact: 'زيادة نسبة النقر بـ ٢٪',
    primaryActionLabel: 'فتح الكتالوج',
    secondaryActionLabel: 'تعديل الفئات',
    counterpartRouteHint: '/catalogs',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
  },
  {
    id: 'journey-checkout',
    surface: 'app-client',
    sourceSurface: 'app-client',
    affectedSurface: 'control-panel',
    actor: 'client',
    lifecycleStep: 'checkout',
    entityId: 'ORD-CLIENT-101',
    entityLabel: 'طلب عميل معلق',
    status: 'بانتظار تأكيد الإسناد',
    risk: 'تأخير محتمل',
    severity: 'high',
    confidence: 'high',
    affectedEntity: 'نورة الفهد',
    reason: 'الطلب تجاوز وقت الإسناد التلقائي بسبب نقص الكباتن في المنطقة.',
    evidence: 'لا يوجد كباتن متاحين ضمن نطاق ٢ كم.',
    nextAction: 'فتح الإسناد اليدوي في لوحة التحكم',
    owner: 'مركز العمليات',
    expectedImpact: 'تقليل وقت الانتظار بـ ٥ دقائق',
    primaryActionLabel: 'فتح الإسناد',
    secondaryActionLabel: 'تنبيه المنطقة',
    counterpartRouteHint: '/operations?workspace=dispatch-assignment&orderId=ORD-CLIENT-101',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
  },
  {
    id: 'journey-partner-prep',
    surface: 'app-partner',
    sourceSurface: 'app-partner',
    affectedSurface: 'control-panel',
    actor: 'partner',
    lifecycleStep: 'partner-preparation',
    entityId: 'PRT-902',
    entityLabel: 'متجر الرياض المركزي',
    status: 'ضغط مرتفع',
    risk: 'تأخير في التحضير',
    severity: 'medium',
    confidence: 'medium',
    affectedEntity: 'قائمة الطلبات الجارية',
    reason: 'المتجر لديه ١٥ طلبًا قيد التحضير وسعة المطبخ محدودة.',
    evidence: 'متوسط وقت التحضير زاد بنسبة ٣٠٪.',
    nextAction: 'تقليل نصف قطر الاستلام للمتجر',
    owner: 'إدارة الشركاء',
    expectedImpact: 'موازنة الأحمال ومنع تراكم الطلبات',
    primaryActionLabel: 'تعديل النطاق',
    secondaryActionLabel: 'تواصل مع المتجر',
    counterpartRouteHint: '/partners?id=PRT-902',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
  },
  {
    id: 'journey-captain-pickup',
    surface: 'app-captain',
    sourceSurface: 'app-captain',
    affectedSurface: 'control-panel',
    actor: 'captain',
    lifecycleStep: 'pickup',
    entityId: 'CPT-NASSER',
    entityLabel: 'الكابتن ناصر',
    status: 'عائق عند الاستلام',
    risk: 'توقف المسار',
    severity: 'critical',
    confidence: 'high',
    affectedEntity: 'طلب 8822',
    reason: 'الكابتن وصل للمتجر لكن الطلب غير موجود في النظام المحلي للمتجر.',
    evidence: 'رسالة خطأ في الربط التقني للمتجر.',
    nextAction: 'تصعيد الدعم التقني لحل تعارض النظام',
    owner: 'الدعم التشغيلي',
    expectedImpact: 'استئناف المسار خلال ١٠ دقائق',
    primaryActionLabel: 'فتح تذكرة دعم',
    secondaryActionLabel: 'إعادة إسناد الطلب',
    counterpartRouteHint: '/operations?workspace=audit-support-sla&issueId=CPT-NASSER-8822',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
  },
  {
    id: 'journey-field-visit',
    surface: 'app-field',
    sourceSurface: 'app-field',
    affectedSurface: 'control-panel',
    actor: 'field',
    lifecycleStep: 'visit',
    entityId: 'FLD-SALEH',
    entityLabel: 'المندوب صالح',
    status: 'زيارة ميدانية نشطة',
    risk: 'تأخير تفعيل',
    severity: 'medium',
    confidence: 'high',
    affectedEntity: 'متجر واحة التمور',
    reason: 'المندوب يقوم بالتحقق من جاهزية المتجر وتدريب الطاقم.',
    evidence: 'تم رفع ٤ صور إثبات جاهزية.',
    nextAction: 'مراجعة الأدلة واعتماد المتجر',
    owner: 'إدارة العمليات الميدانية',
    expectedImpact: 'تفعيل المتجر وبدء استقبال الطلبات',
    primaryActionLabel: 'مراجعة الزيارة',
    secondaryActionLabel: 'تواصل مع المندوب',
    counterpartRouteHint: '/operations?workspace=partner-stores&storeId=OASIS-01',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
  },
  {
    id: 'journey-onboarding',
    surface: 'app-field',
    sourceSurface: 'app-field',
    affectedSurface: 'control-panel',
    actor: 'field',
    lifecycleStep: 'onboarding',
    entityId: 'ONB-998',
    entityLabel: 'تهيئة شريك جديد',
    status: 'بانتظار البيانات',
    risk: 'عدم اكتمال الملف',
    severity: 'low',
    confidence: 'medium',
    affectedEntity: 'مطعم مذاق الشرق',
    reason: 'المتجر لم يرفع السجل التجاري أو لقطة القائمة.',
    evidence: 'حقول البيانات الإلزامية فارغة.',
    nextAction: 'إرسال تنبيه للمتجر عبر التطبيق',
    owner: 'فريق التفعيل',
    expectedImpact: 'إكمال الطلب خلال ٢٤ ساعة',
    primaryActionLabel: 'فتح ملف الشريك',
    secondaryActionLabel: 'إرسال تنبيه',
    counterpartRouteHint: '/partners?onboardingId=ONB-998',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
  },
  {
    id: 'journey-delivery-tracking',
    surface: 'app-captain',
    sourceSurface: 'app-captain',
    affectedSurface: 'app-client',
    actor: 'captain',
    lifecycleStep: 'delivery',
    entityId: 'ORD-DLV-554',
    entityLabel: 'توصيل جارٍ',
    status: 'في الطريق للعميل',
    risk: 'تأخير طفيف',
    severity: 'low',
    confidence: 'high',
    affectedEntity: 'أحمد سعيد',
    reason: 'الكابتن يتحرك باتجاه موقع العميل بعد استلام الطلب بنجاح.',
    evidence: 'موقع GPS حي وتحديث حالة مباشر.',
    nextAction: 'متابعة الوصول وتسليم الإثبات',
    owner: 'نظام التتبع',
    expectedImpact: 'تحديث وقت الوصول المتوقع',
    primaryActionLabel: 'فتح التتبع',
    secondaryActionLabel: 'تواصل مع العميل',
    counterpartRouteHint: '/app-client/orders?id=ORD-DLV-554',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
  },
];

// -----------------------------------------------------------------------------
// Platform vars preview
// -----------------------------------------------------------------------------
// DSH operational vars — human labels first, technical keys are secondary metadata.
// Captain eligibility = WALLET BALANCE THRESHOLD owned by WLT, consumed by DSH.
// It is NOT a rating score. Values are in YER (ريال يمني).
export const DSH_PLATFORM_OPERATIONAL_VARS: readonly DshPlatformVarRecord[] = [
  {
    id: 'captain-wallet-balance-threshold',
    key: 'VAR_DSH_CAPTAIN_MIN_WALLET_BALANCE',
    label: 'حد رصيد محفظة الكابتن للأهلية — الحد الأدنى لاستقبال الطلبات',
    owner: 'WLT',
    status: 'ready-for-binding',
    scope: 'Global',
    risk: 'financial',
    currentPreviewValue: '10,000 ريال',
    proposedPreviewValue: '15,000 ريال',
    effectSummary: 'رفع الحد يقلل عدد الكباتن المؤهلين لاستقبال الطلبات. خفضه يزيدهم. WLT هو المالك المالي؛ DSH هو المستهلك التشغيلي.',
    auditRollbackHint: 'الرجوع إلى 10,000 ريال إذا انخفض توفر الكباتن تحت حد السلامة التشغيلية.',
    precedenceNote: 'Vars candidate — captain eligibility threshold: WLT policy · ينطبق عالميًا. يمكن تخصيص قيمة مختلفة على مستوى المدينة أو المنطقة لاحقًا.',
    affectedSurfaces: ['غرفة القيادة', 'لوحة الإسناد', 'مالية DSH'],
    auditRequired: true,
    mutationAllowed: false,
  },
  {
    id: 'dsh-visibility-sanaa',
    key: 'VAR_DSH_VISIBILITY_REGION_SANAA',
    label: 'ظهور DSH في محافظة صنعاء',
    owner: 'DSH',
    status: 'ready-for-binding',
    scope: 'Region',
    risk: 'high',
    currentPreviewValue: 'مفعّل',
    proposedPreviewValue: 'مفعّل مع القيود',
    effectSummary: 'إظهار خدمات DSH للعملاء في محافظة صنعاء كمنطقة إطلاق.',
    auditRollbackHint: 'يتم التراجع إلى hidden في حالة وجود مشاكل تشغيلية.',
    precedenceNote: 'Region override يتجاوز الإعداد العالمي.',
    affectedSurfaces: ['تطبيق العميل', 'لوحة التحكم'],
    auditRequired: true,
    mutationAllowed: false,
  },
  {
    id: 'partner-accept-timeout',
    key: 'VAR_DSH_PARTNER_ACCEPTANCE_TIMEOUT_SECS',
    label: 'مهلة قبول الشريك للطلب',
    owner: 'DSH',
    status: 'contract-needed',
    scope: 'Global',
    risk: 'low',
    currentPreviewValue: '90 ثانية',
    proposedPreviewValue: '60 ثانية',
    effectSummary: 'تسريع دورة الطلب عن طريق تقليل وقت استجابة الشريك.',
    auditRollbackHint: 'التراجع إلى 90 ثانية إذا زادت نسبة إلغاء الشركاء.',
    precedenceNote: 'يمكن تخصيصه لاحقًا على مستوى Category.',
    affectedSurfaces: ['تطبيق الشريك', 'الطلبات الحية', 'غرفة القيادة'],
    auditRequired: true,
    mutationAllowed: false,
  },
  {
    id: 'dispatch-radius',
    key: 'VAR_DSH_DISPATCH_SEARCH_RADIUS_KM',
    label: 'نصف قطر البحث عن الكباتن (Dispatch Radius)',
    owner: 'DSH',
    status: 'ready-for-binding',
    scope: 'Zone',
    risk: 'medium',
    currentPreviewValue: '3.5 كم',
    proposedPreviewValue: '5.0 كم',
    effectSummary: 'توسيع نطاق البحث عن كباتن في المناطق ذات التغطية المنخفضة.',
    auditRollbackHint: 'الرجوع إلى 3.5 كم إذا زادت أوقات التوصيل.',
    precedenceNote: 'Zone override يتجاوز إعداد المدينة.',
    affectedSurfaces: ['لوحة الإسناد', 'الخريطة الحرارية', 'غرفة القيادة'],
    auditRequired: true,
    mutationAllowed: false,
  },
  {
    id: 'partner-settlement-time',
    key: 'VAR_DSH_PARTNER_SETTLEMENT_SCHEDULE',
    label: 'موعد تسويات الشركاء',
    owner: 'DSH',
    status: 'ready-for-binding',
    scope: 'Global',
    risk: 'high',
    currentPreviewValue: 'كل أحد 10:00 ص',
    proposedPreviewValue: 'يومياً 10:00 ص',
    effectSummary: 'تسوية أسرع للشركاء لزيادة التدفق النقدي.',
    auditRollbackHint: 'التراجع للدورة الأسبوعية يتطلب إشعار مسبق للشركاء.',
    precedenceNote: 'سياسة مالية وتشغيلية تغطي جميع الشركاء.',
    affectedSurfaces: ['مالية DSH', 'الشركاء', 'غرفة القيادة'],
    auditRequired: true,
    mutationAllowed: false,
  },
] as const;

// WLT financial bridge vars — DSH reads these as display/decision context only.
// WLT remains financial source-of-truth. DSH cannot roll back WLT financial data.
export const DSH_PLATFORM_WLT_FINANCIAL_BRIDGE_VARS: readonly DshPlatformVarRecord[] = [
  {
    id: 'delivery-base-fee',
    key: 'WLT_FEES_DELIVERY_BASE_FEE_YER',
    label: 'رسم التوصيل الأساسي (جسر WLT)',
    owner: 'WLT',
    status: 'contract-needed',
    scope: 'City',
    risk: 'financial',
    currentPreviewValue: '2,200 ريال — معاينة عرض فقط',
    proposedPreviewValue: '2,500 ريال — محاكاة موسم الذروة',
    effectSummary: 'يعكس تأثير الرسوم على قرار الإطلاق. الحقيقة المالية وعقودها داخل WLT فقط.',
    auditRollbackHint: 'لا rollback مالي من DSH. فقط أعد العرض إلى baseline المعروض من WLT.',
    precedenceNote: 'DSH يقرأ bridge city-level؛ WLT يبقى صاحب source-of-truth.',
    affectedSurfaces: ['مالية DSH', 'غرفة القيادة', 'تطبيق العميل'],
    auditRequired: true,
    mutationAllowed: false,
  },
  {
    id: 'platform-commission-rate',
    key: 'WLT_COMMISSION_PLATFORM_RATE',
    label: 'نسبة عمولة المنصة (جسر WLT)',
    owner: 'WLT',
    status: 'ready-for-binding',
    scope: 'Category',
    risk: 'financial',
    currentPreviewValue: '12% لفئة الإلكترونيات',
    proposedPreviewValue: '13% لفئة الإلكترونيات عالية الهامش',
    effectSummary: 'يبيّن كيف تتبدل قراءة الربحية داخل DSH بدون نقل الملكية المالية من WLT.',
    auditRollbackHint: 'أي rollback يعني إعادة قراءة preview من عقد WLT المعتمد.',
    precedenceNote: 'CONTRACT_TBD — commission policy owner: WLT · Category commission لا تُعتمد داخل DSH؛ فقط تُعرض بترتيبها القادم من WLT.',
    affectedSurfaces: ['مالية DSH', 'الشركاء', 'غرفة القيادة'],
    auditRequired: true,
    mutationAllowed: false,
  },
  {
    id: 'cod-reserve-floor',
    key: 'WLT_COD_RESERVE_FLOOR',
    label: 'حد الرصيد الضامن لطلبات الدفع عند الاستلام (COD)',
    owner: 'WLT',
    status: 'ready-for-binding',
    scope: 'Region',
    risk: 'financial',
    currentPreviewValue: '150,000 ريال — ضمان إقليمي',
    proposedPreviewValue: '175,000 ريال — للمناطق عالية المخاطر',
    effectSummary: 'يكشف أثر تشديد الضمان على تغطية المناطق. القرار المالي يبقى لدى WLT.',
    auditRollbackHint: 'استرجاع baseline الضامن يتم من WLT ledger وليس من شاشة Platform.',
    precedenceNote: 'READ_ONLY_POLICY_MAP — COD limits: WLT policy · Region floor يصل كجسر مرئي؛ DSH لا يملك كسره.',
    affectedSurfaces: ['مالية DSH', 'لوحة الإسناد', 'غرفة القيادة'],
    auditRequired: true,
    mutationAllowed: false,
  },
  {
    id: 'refund-auto-approval-cap',
    key: 'WLT_REFUNDS_AUTO_APPROVAL_CAP',
    label: 'سقف الاسترداد الآلي بدون مراجعة (جسر WLT)',
    owner: 'WLT',
    status: 'contract-needed',
    scope: 'Global',
    risk: 'financial',
    currentPreviewValue: '8,000 ريال — الحد الآلي العالمي',
    proposedPreviewValue: '5,000 ريال — مسار تجريبي أكثر تحفظًا',
    effectSummary: 'يوضح كيف يتغير مسار الدعم والتصعيد عند خفض سقف الموافقة الآلية.',
    auditRollbackHint: 'الرجوع يعني إعادة سقف WLT baseline وإخفاء السيناريو المقترح.',
    precedenceNote: 'READ_ONLY_POLICY_MAP — refund windows: WLT policy · Global financial guard من WLT يهيمن على أي عرض تشغيلي داخل DSH.',
    affectedSurfaces: ['مالية DSH', 'الدعم والتصعيد', 'غرفة القيادة'],
    auditRequired: true,
    mutationAllowed: false,
  },
  {
    id: 'partner-settlement-cycle',
    key: 'WLT_SETTLEMENT_CYCLE_PARTNER',
    label: 'دورة تسوية الشريك (جسر WLT)',
    owner: 'WLT',
    status: 'ready-for-binding',
    scope: 'Service',
    risk: 'financial',
    currentPreviewValue: 'T+7 — مرجع تسوية الخدمة',
    proposedPreviewValue: 'T+5 — لشركاء الخدمة عالية الجدارة',
    effectSummary: 'يعطي فريق Platform تصورًا زمنيًا لتأثير التسوية دون أي ادعاء truth محاسبي.',
    auditRollbackHint: 'العودة إلى T+7 تتم عبر عقد WLT وليس عبر زر داخل DSH.',
    precedenceNote: 'READ_ONLY_POLICY_MAP — settlement cadence: WLT policy / Vars candidate · Service settlement cycle يُقرأ من WLT فقط ويُستخدم داخل DSH كإشارة قرار.',
    affectedSurfaces: ['مالية DSH', 'الشركاء', 'غرفة القيادة'],
    auditRequired: true,
    mutationAllowed: false,
  },
  {
    id: 'captain-payout-cadence',
    key: 'WLT_PAYOUT_CADENCE_CAPTAIN',
    label: 'دورة صرف الكابتن (جسر WLT)',
    owner: 'WLT',
    status: 'contract-needed',
    scope: 'Service',
    risk: 'financial',
    currentPreviewValue: 'غير محدد — NOT_RUNTIME_BOUND',
    proposedPreviewValue: 'T+3 عند اعتماد عقد WLT',
    effectSummary: 'دورة صرف الكابتن (bthwani_delivery) غير مربوطة runtime حتى يُكتمل عقد WLT. store_courier_mode ليس captain payout.',
    auditRollbackHint: 'لا rollback مالي من DSH؛ الصرف مقفل حتى يعتمد WLT الدورة رسميًا.',
    precedenceNote: 'NOT_RUNTIME_BOUND — payout cadence: WLT policy / Vars candidate · WLT يملك دورة الصرف؛ DSH preview فقط.',
    affectedSurfaces: ['مالية DSH', 'تطبيق الكابتن', 'غرفة القيادة'],
    auditRequired: true,
    mutationAllowed: false,
  },
] as const;

// Provider control vars — preview/reference context only, no live provider switching.
export const DSH_PLATFORM_PROVIDER_CONTROL_VARS: readonly DshPlatformProviderControlRecord[] = [
  {
    id: 'provider-maps-availability',
    key: 'VAR_PROVIDER_MAPS_AVAILABILITY_MODE',
    label: 'تحكم مزود الخرائط — وضع التوفر',
    owner: 'Provider',
    status: 'ready-for-binding',
    scope: 'City',
    risk: 'high',
    currentPreviewValue: 'priority=P1 · mode=active-passive',
    proposedPreviewValue: 'priority=P0 · mode=weighted-active',
    effectSummary: 'يحاكي تحسين توازن التوفر بين مزود الخرائط الرئيسي والاحتياطي داخل المدينة.',
    auditRollbackHint: 'اعتمد rollback target الظاهر فقط؛ لا تبديل فعلي في هذه المرحلة.',
    precedenceNote: 'future WLT/payment provider candidate · City provider policy تظهر للعرض فقط ولا تتحول إلى switch فعلي.',
    affectedSurfaces: ['الخريطة الحرارية', 'لوحة الإسناد', 'غرفة القيادة'],
    auditRequired: true,
    mutationAllowed: false,
    providerId: 'provider.maps.google',
    capability: 'availability-sync',
    priority: 'P1',
    fallback: 'provider.maps.mapbox',
    mode: 'active-passive',
    testResult: 'آخر اختبار: أخضر على صنعاء مع fallback غير مفعّل.',
    rollbackTarget: 'provider.maps.mapbox snapshot',
  },
  {
    id: 'provider-sms-failover',
    key: 'VAR_PROVIDER_SMS_FAILOVER_MODE',
    label: 'تحكم مزود SMS — وضع Failover',
    owner: 'Provider',
    status: 'contract-needed',
    scope: 'Global',
    risk: 'medium',
    currentPreviewValue: 'guarded mode مع escalation يدوي',
    proposedPreviewValue: 'guarded mode + auto-fallback بعد محاولتين',
    effectSummary: 'يرسم أثر تقليل الاحتكاك عند فشل إرسال SMS.',
    auditRollbackHint: 'إذا ارتفعت طلبات المراجعة، يُعرض rollback target فقط.',
    precedenceNote: 'future WLT/payment provider candidate · Provider behavior يبقى حالة مرجعية حتى تثبت مسار الاختبار.',
    affectedSurfaces: ['تطبيق العميل', 'تطبيق الشريك', 'الدعم والتصعيد'],
    auditRequired: true,
    mutationAllowed: false,
    providerId: 'provider.sms.unifonic',
    capability: 'failover-routing',
    priority: 'P1',
    fallback: 'manual-review-lane',
    mode: 'guarded',
    testResult: 'آخر اختبار: أصفر، latency مرتفعة على بعض المسارات.',
    rollbackTarget: 'manual-review-lane baseline',
  },
] as const;

export const DSH_PLATFORM_SCOPE_PRECEDENCE: readonly DshPlatformScopeLayer[] = [
  {
    id: 'scope-store',
    scope: 'Store',
    order: 1,
    title: 'Store final override',
    description: 'آخر طبقة precedence وتلتقط التباينات المحلية للجاهزية والتغطية.',
    ownerGuard: 'DSH يملك readiness المحلي، لكن لا يملك أي ledger أو settlement local truth.',
    note: 'Store هو أول كسر فعّال في التسلسل الافتراضي عندما يثبت override محلي.',
  },
  {
    id: 'scope-subcategory',
    scope: 'Subcategory',
    order: 2,
    title: 'Subcategory override',
    description: 'طبقة أدق لمتطلبات narrow routing أو provider scoring.',
    ownerGuard: 'تظهر كتحليل أدق لكنها لا تصبح binding بدون عقود مثبتة.',
    note: 'Subcategory يتقدم على Category عند تفعيل override أدق.',
  },
  {
    id: 'scope-category',
    scope: 'Category',
    order: 3,
    title: 'Category routing',
    description: 'تخصيصات متعلقة بنوع الخدمة أو المسارات الخاصة.',
    ownerGuard: 'أنماط التوصيل التشغيلية DSH-owned، أما أي عمولة أو رسوم فـ WLT-owned.',
    note: 'Category يكسر Service إذا كانت القاعدة مقصودة لفئة محددة.',
  },
  {
    id: 'scope-zone',
    scope: 'Zone',
    order: 4,
    title: 'Zone pressure control',
    description: 'مناسب للإسناد والاختناق وإدارة الحمل الدقيق.',
    ownerGuard: 'DSH يملك zone operations؛ Provider control في هذا المستوى مرجعي فقط.',
    note: 'Zone يكسر City عند وجود ضغط تشغيلي موثق أو override محلي.',
  },
  {
    id: 'scope-city',
    scope: 'City',
    order: 5,
    title: 'City override',
    description: 'طبقة تخص المدن ذات متطلبات readiness أو pricing مختلفة.',
    ownerGuard: 'يمكن لـ DSH عرضها تشغيليًا، لكن الماليات تظل WLT حتى في مستوى المدينة.',
    note: 'City يكسر Region في السياسات المحلية المؤكدة.',
  },
  {
    id: 'scope-region',
    scope: 'Region',
    order: 6,
    title: 'Regional control',
    description: 'ضبط كثافة التشغيل أو الضمان المالي بحسب الإقليم.',
    ownerGuard: 'الضبط الإقليمي المالي يعرض كجسر فقط إذا كان المصدر WLT.',
    note: 'Region يسبق Service وGlobal عندما يوجد تخصيص مثبت على مستوى الإقليم.',
  },
  {
    id: 'scope-service',
    scope: 'Service',
    order: 7,
    title: 'Service policy',
    description: 'تخصيص حسب الخدمة مثل DSH delivery أو تحضر الكابتن.',
    ownerGuard: 'DSH يملك الخدمة التشغيلية؛ WLT يملك أي خدمة ذات أثر مالي.',
    note: 'طبقة Service تُعد baseline مرنًا قبل Global.',
  },
  {
    id: 'scope-global',
    scope: 'Global',
    order: 8,
    title: 'Global baseline',
    description: 'الخط الأساسي الأعلى الذي يفرض guardrails العامة قبل أي تخصيص أدق.',
    ownerGuard: 'الحراس المالية العالمية تبقى لدى WLT، أما الحراس التشغيلية العامة فتبقى لدى DSH.',
    note: 'Global يبقى مرئيًا دائمًا حتى عندما تكسره طبقة أدق من المالك نفسه.',
  },
] as const;

export const DSH_PLATFORM_SIMULATION_PREVIEW: readonly DshPlatformSimulationScenario[] = [
  {
    id: 'sim-captain-wallet-threshold',
    title: 'محاكاة رفع حد رصيد محفظة الكابتن للأهلية',
    owner: 'WLT',
    scope: 'Global',
    relatedKeys: ['VAR_DSH_CAPTAIN_MIN_WALLET_BALANCE'],
    expectedImpact: 'انخفاض عدد الكباتن المؤهلين بنسبة متوقعة 8-12% في المناطق ذات الرصيد المنخفض.',
    guardrail: 'التغيير يحتاج موافقة WLT (المالك المالي) وDSH (المستهلك التشغيلي) معًا.',
    blockedReason: 'Demo Mode فقط: لا تطبيق مباشر ولا تعديل مالي حقيقي في هذه المرحلة.',
  },
  {
    id: 'sim-peak-zone-capacity',
    title: 'محاكاة رفع سعة الإسناد في Zone الذروة',
    owner: 'DSH',
    scope: 'Zone',
    relatedKeys: ['VAR_DSH_DISPATCH_SEARCH_RADIUS_KM'],
    expectedImpact: 'زيادة throughput المتوقع مع تقليل الحاجة لتحويل يدوي في المناطق المكتظة.',
    guardrail: 'يجب ألا تتجاوز SLA الالتقاط baseline الحالي قبل أي انتقال لمرحلة binding.',
    blockedReason: 'Demo Mode فقط: لا تطبيق مباشر في هذه المرحلة.',
  },
  {
    id: 'sim-wlt-fee-city',
    title: 'محاكاة تعديل رسم التوصيل عبر جسر WLT',
    owner: 'WLT',
    scope: 'City',
    relatedKeys: ['WLT_FEES_DELIVERY_BASE_FEE_YER', 'WLT_SETTLEMENT_CYCLE_PARTNER'],
    expectedImpact: 'تغيير واضح في صورة الربحية والطلب المتوقع داخل منصة DSH فقط.',
    guardrail: 'أي أثر مالي حقيقي يحتاج اعتماد WLT ولا يخرج من preview bridge.',
    blockedReason: 'DSH لا يملك تطبيق الرسوم؛ الواجهة تعرض الأثر فقط.',
  },
] as const;

export const DSH_PLATFORM_AUDIT_PREVIEW: readonly DshPlatformAuditEntry[] = [
  {
    id: 'audit-captain-wallet',
    title: 'Snapshot قبل تعديل حد رصيد محفظة الكابتن للأهلية',
    actor: 'WLT Finance + DSH Platform',
    event: 'wallet balance threshold change request',
    targetKey: 'VAR_DSH_CAPTAIN_MIN_WALLET_BALANCE',
    stateLabel: 'طلب اعتماد',
    evidenceHint: 'التقط عدد الكباتن المؤهلين الحاليين وSLA التوافر قبل تغيير الحد.',
    rollbackHint: 'أعد الحد إلى 10,000 ريال إذا انخفض توفر الكباتن تحت الحد الآمن.',
  },
  {
    id: 'audit-zone-capacity',
    title: 'Snapshot قبل تغيير نصف قطر البحث عن الكباتن',
    actor: 'DSH Platform reviewer',
    event: 'dispatch radius change request',
    targetKey: 'VAR_DSH_DISPATCH_SEARCH_RADIUS_KM',
    stateLabel: 'طلب اعتماد',
    evidenceHint: 'التقط baseline للسعة وSLA قبل أي مرحلة binding.',
    rollbackHint: 'أعد baseline zone-capacity إذا ارتفع زمن الالتقاط أو زادت التحويلات اليدوية.',
  },
  {
    id: 'audit-wlt-fee-bridge',
    title: 'مراجعة جسر رسوم التوصيل (WLT bridge)',
    actor: 'WLT finance owner',
    event: 'bridge comparison requested',
    targetKey: 'WLT_FEES_DELIVERY_BASE_FEE_YER',
    stateLabel: 'مراجعة عقد',
    evidenceHint: 'قارن المعروض داخل DSH مع contract snapshot القادم من WLT.',
    rollbackHint: 'rollback هنا يعني إعادة العرض إلى current preview value الواردة من WLT.',
  },
] as const;

// -----------------------------------------------------------------------------
// Control panel fixture locations
// -----------------------------------------------------------------------------
/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source.
 */
export const dshControlPanelFixtureLocationsDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'preview-only local display / not runtime UTC source',
  moneySemantics: 'not_applicable',
} as const;

export const dshControlPanelFixtureLocations: Phase12FixtureLocation[] = [
  {
    candidateId: 'dsh_ops_orders_board',
    canonicalTarget: 'dsh_ops_orders_board',
    surface: 'control-panel',
    phase: 'Phase 12',
    mode: 'fixtures-only',
    dataKind: 'UI_PREVIEW_ONLY',
    timezoneSemantics: 'preview-only local display / not runtime UTC source',
    location: 'dsh/frontend/control-panel/dsh_ops_orders_board/fixtures',
    status: 'declared',
  },
  {
    candidateId: 'dsh_ops_order_detail_exception_workspace',
    canonicalTarget: 'dsh_ops_order_detail_exception_workspace',
    surface: 'control-panel',
    phase: 'Phase 12',
    mode: 'fixtures-only',
    dataKind: 'UI_PREVIEW_ONLY',
    timezoneSemantics: 'preview-only local display / not runtime UTC source',
    location: 'dsh/frontend/control-panel/dsh_ops_order_detail_exception_workspace/fixtures',
    status: 'declared',
  },
  {
    candidateId: 'dsh_ops_peak_mode_control',
    canonicalTarget: 'dsh_ops_peak_mode_control',
    surface: 'control-panel',
    phase: 'Phase 12',
    mode: 'fixtures-only',
    dataKind: 'UI_PREVIEW_ONLY',
    timezoneSemantics: 'preview-only local display / not runtime UTC source',
    location: 'dsh/frontend/control-panel/dsh_ops_peak_mode_control/fixtures',
    status: 'declared',
  },
  {
    candidateId: 'dsh_proxy_requests_list',
    canonicalTarget: 'dsh_proxy_requests_list',
    surface: 'control-panel',
    phase: 'Phase 12',
    mode: 'fixtures-only',
    dataKind: 'UI_PREVIEW_ONLY',
    timezoneSemantics: 'preview-only local display / not runtime UTC source',
    location: 'dsh/frontend/control-panel/dsh_proxy_requests_list/fixtures',
    status: 'declared',
  },
  {
    candidateId: 'dsh_proxy_request_review_workspace',
    canonicalTarget: 'dsh_proxy_request_review_workspace',
    surface: 'control-panel',
    phase: 'Phase 12',
    mode: 'fixtures-only',
    dataKind: 'UI_PREVIEW_ONLY',
    timezoneSemantics: 'preview-only local display / not runtime UTC source',
    location: 'dsh/frontend/control-panel/dsh_proxy_request_review_workspace/fixtures',
    status: 'declared',
  },
];

export function selectDshControlPanelPlatformPreview() {
  return {
    appearance: PREVIEW_APPEARANCE_RECORDS,
    providers: PREVIEW_PROVIDER_RECORDS,
    services: PREVIEW_SERVICE_RECORDS,
    vars: DSH_PLATFORM_OPERATIONAL_VARS,
    providerControls: DSH_PLATFORM_PROVIDER_CONTROL_VARS,
    recommendations: DSH_CROSS_SURFACE_JOURNEYS,
    geoZones: GEO_HEATMAP_ZONES,
    admins: MOCK_USERS,
  };
}
