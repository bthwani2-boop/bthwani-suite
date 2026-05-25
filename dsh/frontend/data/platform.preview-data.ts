/**
 * UI_PREVIEW_ONLY: Control-panel platform configuration preview fixtures.
 * Merged from: cp-appearance.preview.ts + cp-providers.preview.ts + cp-services.preview.ts
 * Owner: dsh/frontend/data
 */
import type {
  AppearanceRecord,
  ProviderRecord,
  ServiceRecord,
} from '../shared/dsh-cp-platform.contract';

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
