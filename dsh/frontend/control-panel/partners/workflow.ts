import type { DshCanonicalPublishStage, DshCanonicalSource } from '../../shared/dshStoreProductCardModel';
import type { DshFulfillmentDeliveryMode } from '../../app-client/contracts/dsh-client-binding.contracts';

export type DshPartnerIntakeSource = 'app-field' | 'app-partner';
export type DshPartnerIntakeQueue = 'offer-approval' | 'partner-review' | 'marketing-review';

export type DshPartnerIntakeItem = {
  id: string;
  storeName: string;
  categoryLabel: string;
  source: DshPartnerIntakeSource;
  queue: DshPartnerIntakeQueue;
  ownerLabel: string;
  fieldStatusLabel: string;
  note: string;
  nextStep: string;
  submittedAt: string;
  canonicalStoreId?: string;
  canonicalProductId?: string;
  canonicalStage?: DshCanonicalPublishStage;
  canonicalSource?: DshCanonicalSource;
};

export type DshPartnerIntakeMetric = {
  id: string;
  label: string;
  value: number;
  description: string;
};

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
  {
    id: 'field-saha',
    storeName: 'محمصة الساحة',
    categoryLabel: 'مقاهٍ ومحمصات',
    source: 'app-field',
    queue: 'offer-approval',
    ownerLabel: 'الميداني',
    fieldStatusLabel: 'Offer Pending Approval',
    note: 'العرض أرسله المندوب من شاشة الميدان ويحتاج قرار الشركاء الأول.',
    nextStep: 'عند الاعتماد يعود للمندوب Offer Approved لبدء الزيارة.',
    submittedAt: 'اليوم 09:40',
  },
  {
    id: 'field-shorouq',
    storeName: 'بوفيه الشروق',
    categoryLabel: 'بوفيهات',
    source: 'app-field',
    queue: 'offer-approval',
    ownerLabel: 'الميداني',
    fieldStatusLabel: 'Offer Pending Approval',
    note: 'المتجر يحتاج اعتماد أو رفض أو تعديل العرض قبل المتابعة.',
    nextStep: 'التعديل التفصيلي للعرض عند الحاجة قبل المتابعة.',
    submittedAt: 'اليوم 10:05',
  },
  {
    id: 'field-wadi',
    storeName: 'مقهى الوادي',
    categoryLabel: 'مقاهٍ',
    source: 'app-field',
    queue: 'partner-review',
    ownerLabel: 'الميداني',
    fieldStatusLabel: 'Partner Review',
    note: 'المندوب أرسل الطلب بعد فتح نموذج الإضافة، والملف الآن داخل مراجعة الشركاء.',
    nextStep: 'بعد الموافقة يُجهز كود الشريك ثم ينتقل الطلب للمراجعة التسويقية.',
    submittedAt: 'اليوم 11:20',
  },
  {
    id: 'field-nokhba',
    storeName: 'تمور النخبة',
    categoryLabel: 'مواد غذائية',
    source: 'app-field',
    queue: 'marketing-review',
    ownerLabel: 'الشركاء',
    fieldStatusLabel: 'Offer Approved',
    note: 'تم اعتماد الشركاء واكتملت جاهزية الإضافة، والطلب ينتظر التسويق النهائي.',
    nextStep: 'المراجعة التسويقية النهائية قبل الإطلاق.',
    submittedAt: 'اليوم 12:15',
    canonicalStoreId: 'canonical-store-field-lead-5',
    canonicalProductId: 'canonical-product-field-lead-5-featured',
    canonicalStage: 'marketing-review',
    canonicalSource: 'app-field',
  },
];

// UI_PREVIEW_ONLY — commission and settlement figures are WLT-owned, not authoritative here
export type DshPartnerFulfillmentMode = DshFulfillmentDeliveryMode;

export type DshPartnerModeAgreement = {
  mode: DshPartnerFulfillmentMode;
  modeLabel: string;
  enabled: boolean;
  /** UI_PREVIEW_ONLY — actual rate lives in WLT commission engine */
  commissionRatePreview: string;
  settlementBasis: string;
  operationalReadiness: 'ready' | 'pending' | 'unavailable';
  validityLabel: string;
  negotiationNote?: string;
};

export type DshPartnerFulfillmentAgreement = {
  partnerId: string;
  storeName: string;
  categoryLabel: string;
  modes: readonly DshPartnerModeAgreement[];
};

export const PARTNER_FULFILLMENT_AGREEMENTS: readonly DshPartnerFulfillmentAgreement[] = [
  {
    partnerId: 'partner-saha',
    storeName: 'محمصة الساحة',
    categoryLabel: 'مقاهٍ ومحمصات',
    modes: [
      { mode: 'bthwani_delivery', modeLabel: 'توصيل بثواني', enabled: true, commissionRatePreview: 'UI_PREVIEW_ONLY', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready', validityLabel: 'ساري', negotiationNote: 'الاتفاق الافتراضي' },
      { mode: 'partner_delivery', modeLabel: 'توصيل المتجر', enabled: false, commissionRatePreview: 'UI_PREVIEW_ONLY', settlementBasis: 'غير مفعّل', operationalReadiness: 'unavailable', validityLabel: 'غير مفعّل' },
      { mode: 'pickup', modeLabel: 'استلام بنفسي', enabled: true, commissionRatePreview: 'UI_PREVIEW_ONLY', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready', validityLabel: 'ساري' },
    ],
  },
  {
    partnerId: 'partner-shorouq',
    storeName: 'بوفيه الشروق',
    categoryLabel: 'بوفيهات',
    modes: [
      { mode: 'bthwani_delivery', modeLabel: 'توصيل بثواني', enabled: true, commissionRatePreview: 'UI_PREVIEW_ONLY', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready', validityLabel: 'ساري' },
      { mode: 'partner_delivery', modeLabel: 'توصيل المتجر', enabled: true, commissionRatePreview: 'UI_PREVIEW_ONLY', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'pending', validityLabel: 'قيد التفعيل', negotiationNote: 'يحتاج تأكيد جاهزية موصل المتجر' },
      { mode: 'pickup', modeLabel: 'استلام بنفسي', enabled: false, commissionRatePreview: 'UI_PREVIEW_ONLY', settlementBasis: 'غير مفعّل', operationalReadiness: 'unavailable', validityLabel: 'غير مفعّل' },
    ],
  },
  {
    partnerId: 'partner-zawya',
    storeName: 'مخبز الزاوية',
    categoryLabel: 'مخابز',
    modes: [
      { mode: 'bthwani_delivery', modeLabel: 'توصيل بثواني', enabled: true, commissionRatePreview: 'UI_PREVIEW_ONLY', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready', validityLabel: 'ساري' },
      { mode: 'partner_delivery', modeLabel: 'توصيل المتجر', enabled: true, commissionRatePreview: 'UI_PREVIEW_ONLY', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready', validityLabel: 'ساري', negotiationNote: 'موصل المتجر جاهز' },
      { mode: 'pickup', modeLabel: 'استلام بنفسي', enabled: true, commissionRatePreview: 'UI_PREVIEW_ONLY', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready', validityLabel: 'ساري', negotiationNote: 'الاتفاق الكامل للأوضاع الثلاثة' },
    ],
  },
  {
    partnerId: 'partner-nokhba',
    storeName: 'تمور النخبة',
    categoryLabel: 'مواد غذائية',
    modes: [
      { mode: 'bthwani_delivery', modeLabel: 'توصيل بثواني', enabled: true, commissionRatePreview: 'UI_PREVIEW_ONLY', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready', validityLabel: 'ساري' },
      { mode: 'partner_delivery', modeLabel: 'توصيل المتجر', enabled: false, commissionRatePreview: 'UI_PREVIEW_ONLY', settlementBasis: 'غير مفعّل', operationalReadiness: 'unavailable', validityLabel: 'غير مفعّل' },
      { mode: 'pickup', modeLabel: 'استلام بنفسي', enabled: true, commissionRatePreview: 'UI_PREVIEW_ONLY', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready', validityLabel: 'ساري' },
    ],
  },
] as const;

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
    title: 'المراجعة التسويقية',
    description: 'بعد موافقة الشركاء ينتقل الطلب إلى المراجعة التسويقية النهائية ثم يدخل مسار الإطلاق.',
  },
] as const;
