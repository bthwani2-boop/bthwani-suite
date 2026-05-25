import { mapLoyaltyProgramToClientBenefits, mapSubscriptionPlansToClientCards, type CommercialEntitlement, type CommercialEarningRule, type CommercialProgram, type CommercialRedemptionRule, type LoyaltyClientBenefits, type LoyaltyClientMetric, type LoyaltyClientSection, type LoyaltyReward, type LoyaltyTier, type SubscriptionClientCard, type SubscriptionPlan } from '../shared/commercial.preview-contract';

// -----------------------------------------------------------------------------
// Loyalty and subscription source records
// -----------------------------------------------------------------------------
// Semantic color tokens — stored as token strings; resolution happens at adapter/render boundary only.

/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source.
 */
export const loyaltyStoreDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'preview-only display values / not accounting source',
} as const;

export type LoyaltyStatus = 'active' | 'draft' | 'paused' | 'archived';
export type LoyaltyAudience = 'all' | 'client' | 'operations';
export type LoyaltyLane = 'subscription' | 'loyalty' | 'coupon';

export type LoyaltyRecord = {
  id: string;
  title: string;
  subtitle: string;
  status: LoyaltyStatus;
  audience: LoyaltyAudience;
  lane: LoyaltyLane;
  routeTarget: string;
  ctaLabel: string;
  highlight: string;
  metricValue: string;
  accentColor: string;
  impressions: number;
  clicks: number;
};

const LOYALTY_STORE_KEY = '__BTHWANI_DSH_LOYALTY_STORE__';

const seededLoyaltyItems: LoyaltyRecord[] = [
  {
    id: 'loyalty-subscription-pro',
    title: 'اشتراك برو بلس',
    subtitle: 'مزايا الاشتراك، الأولوية، وسرعة التسليم تظهر من نفس ملكية التسويق.',
    status: 'active',
    lane: 'subscription',
    audience: 'client',
    routeTarget: 'subscription',
    ctaLabel: 'مراجعة الاشتراك',
    highlight: 'مرتبط بمسار الاشتراك الحقيقي',
    metricValue: '٢,٨٤٠ عضو نشط',
    accentColor: 'danger',
    impressions: 33000,
    clicks: 1910,
  },
  {
    id: 'loyalty-points-welcome',
    title: 'نقاط الترحيب',
    subtitle: 'احصل على ٥٠٠ نقطة عند أول طلب لك عبر التطبيق.',
    status: 'active',
    lane: 'loyalty',
    audience: 'client',
    routeTarget: 'loyalty',
    ctaLabel: 'عرض النقاط',
    highlight: 'عرض محدود',
    metricValue: '١٥,٠٠٠ مستفيد',
    accentColor: 'brandStrong',
    impressions: 45000,
    clicks: 5200,
  }
];

function getLoyaltyGlobalStore(): typeof globalThis & { [LOYALTY_STORE_KEY]?: LoyaltyRecord[] } {
  return globalThis as typeof globalThis & { [LOYALTY_STORE_KEY]?: LoyaltyRecord[] };
}

function getLoyaltyMutableStore(): LoyaltyRecord[] {
  const scope = getLoyaltyGlobalStore();
  if (!scope[LOYALTY_STORE_KEY]) {
    scope[LOYALTY_STORE_KEY] = seededLoyaltyItems.map((item) => ({ ...item }));
  }
  return scope[LOYALTY_STORE_KEY] ?? [];
}

function setLoyaltyMutableStore(next: LoyaltyRecord[]) {
  getLoyaltyGlobalStore()[LOYALTY_STORE_KEY] = next.map((item) => ({ ...item }));
}

export function getLoyaltyItems(): LoyaltyRecord[] {
  return getLoyaltyMutableStore();
}

export function getLoyaltyKpis() {
  const items = getLoyaltyItems();
  const active = items.filter((item) => item.status === 'active');
  return {
    total: items.length,
    active: active.length,
    subscriptions: items.filter(item => item.lane === 'subscription').length,
    points: items.filter(item => item.lane === 'loyalty').length,
    impressions: active.reduce((sum, item) => sum + item.impressions, 0),
    clicks: active.reduce((sum, item) => sum + item.clicks, 0),
  };
}

export function upsertLoyaltyItem(item: Partial<LoyaltyRecord>) {
  const current = getLoyaltyItems();
  const nextId = item.id ?? `loyalty-${Date.now()}`;
  const existing = current.find((entry) => entry.id === nextId);

  const nextEntry: LoyaltyRecord = {
    id: nextId,
    title: item.title?.trim() || existing?.title || 'برنامج ولاء جديد',
    subtitle: item.subtitle?.trim() || existing?.subtitle || 'وصف البرنامج',
    status: item.status ?? existing?.status ?? 'draft',
    audience: item.audience ?? existing?.audience ?? 'client',
    lane: item.lane ?? existing?.lane ?? 'loyalty',
    routeTarget: item.routeTarget ?? existing?.routeTarget ?? 'loyalty',
    ctaLabel: item.ctaLabel?.trim() || existing?.ctaLabel || 'فتح',
    highlight: item.highlight?.trim() || existing?.highlight || '',
    metricValue: item.metricValue?.trim() || existing?.metricValue || '0',
    accentColor: item.accentColor?.trim() || existing?.accentColor || 'brandStrong',
    impressions: item.impressions ?? existing?.impressions ?? 0,
    clicks: item.clicks ?? existing?.clicks ?? 0,
  };

  const next = existing
    ? current.map((entry) => (entry.id === nextEntry.id ? nextEntry : entry))
    : [nextEntry, ...current];

  setLoyaltyMutableStore(next);
  return nextEntry;
}

export function removeLoyaltyItem(id: string) {
  setLoyaltyMutableStore(getLoyaltyItems().filter((item) => item.id !== id));
}

// ---------------------------------------------------------------------------
// Commercial domain types — sourced from commercial.preview-contract.ts
// Aliases maintained for backward compatibility of consumer imports.
// ---------------------------------------------------------------------------

export type LoyaltyProgram = CommercialProgram;
export type { LoyaltyTier, LoyaltyReward, SubscriptionPlan };
export type Entitlement = CommercialEntitlement;
export type EarningRule = CommercialEarningRule;
export type RedemptionRule = CommercialRedemptionRule;

export function getLoyaltyPrograms(): LoyaltyProgram[] {
  return [
    { id: 'prog-1', name: 'نقاط بثواني', type: 'loyalty', description: 'برنامج الولاء العام للتطبيق', currencyLabel: 'نقطة', status: 'active' },
  ];
}

export function getSubscriptionPlans(): SubscriptionPlan[] {
  return [
    { id: 'sub-pro', name: 'بثواني برو', monthlyFee: 1000, weeklyFee: 500, features: ['توصيل مجاني', 'عروض حصرية'], status: 'active', tier: 'monthly' },
    { id: 'sub-weekly', name: 'برو أسبوع', monthlyFee: 500, weeklyFee: 500, features: ['توصيل مجاني'], status: 'active', tier: 'weekly' },
    { id: 'sub-family', name: 'برو عائلي', monthlyFee: 2000, features: ['توصيل مجاني', 'عروض حصرية', 'حزمة عائلية'], status: 'active', tier: 'family' },
  ];
}

export function getLoyaltyTiers(): LoyaltyTier[] {
  return [
    { id: 'tier-silver', programId: 'prog-1', name: 'فضي', minimumPoints: 0, benefits: [] },
    { id: 'tier-gold', programId: 'prog-1', name: 'ذهبي', minimumPoints: 1000, benefits: [{ id: 'b-1', label: 'دعم سريع', description: 'استجابة أسرع من فريق الدعم' }] },
  ];
}

export function getLoyaltyRewards(): LoyaltyReward[] {
  return [
    { id: 'rew-1', programId: 'prog-1', title: 'كوبون خصم 10 ريال', pointsCost: 1000, status: 'active', description: 'خصم مباشر على طلبك القادم' },
    { id: 'rew-2', programId: 'prog-1', title: 'توصيل مجاني', pointsCost: 500, status: 'active', description: 'صالح لمدة 7 أيام' },
    { id: 'rew-3', programId: 'prog-1', title: 'خصم 20%', pointsCost: 1500, status: 'active', description: 'الأكثر استخدامًا' },
  ];
}

export function getEntitlements(): Entitlement[] {
  return [
    { id: 'ent-pro-active', type: 'subscription', referenceId: 'sub-pro', status: 'active', source: 'subscription' },
    { id: 'ent-tier-gold', type: 'loyalty-tier', referenceId: 'tier-gold', status: 'active', source: 'loyalty' },
    { id: 'ent-reward-1', type: 'loyalty-reward', referenceId: 'rew-1', status: 'active', source: 'loyalty' },
  ];
}

export function getEarningRules(): EarningRule[] {
  return [
    { id: 'earn-1', programId: 'prog-1', description: 'نقاط على كل طلب', pointsMultiplier: 1, appliesTo: 'all' },
    { id: 'earn-2', programId: 'prog-1', description: 'نقاط مضاعفة للشركاء المختارين', pointsMultiplier: 2, appliesTo: 'partner' },
  ];
}

export function getRedemptionRules(): RedemptionRule[] {
  return [
    { id: 'redeem-1', programId: 'prog-1', description: 'استبدال نقاط بخصم ريال', pointsValue: 100, discountValue: 1, discountType: 'fixed' },
    { id: 'redeem-2', programId: 'prog-1', description: 'استبدال نقاط بتوصيل مجاني', pointsValue: 500, discountType: 'free-delivery' },
  ];
}

// -----------------------------------------------------------------------------
// Client subscription adapters
// -----------------------------------------------------------------------------
/**
 * UI_PREVIEW_ONLY — commercial subscriptions + loyalty consumer adapter.
 * Merged from: loyalty-commercial.preview-data.ts + subscriptions-commercial.preview-data.ts
 * Derives display fixtures from shared stores; NOT a source of truth.
 */

export const dshSubscriptionsPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'preview-only display values / not accounting source',
} as const;

// --- Loyalty ---

export type LoyaltyBenefitMode = 'loyalty';

export type LoyaltyBenefitItem = {
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
};

export type LoyaltyMetricFixture = LoyaltyClientMetric;
export type LoyaltySectionFixture = LoyaltyClientSection;
export type LoyaltyRewardsFixture = LoyaltyClientBenefits;

export const loyaltyBenefitSurfaceItems: Record<LoyaltyBenefitMode, LoyaltyBenefitItem[]> = {
  loyalty: [
    { title: 'loyalty-points-client-balance', subtitle: 'عرض الرصيد الحالي لنقاط الولاء.', meta: 'الرصيد', badgeLabel: 'مباشر' },
    { title: 'loyalty-points-redeem', subtitle: 'استبدال النقاط داخل نفس السطح.', meta: 'استبدال', badgeLabel: 'مباشر' },
    { title: 'loyalty-points-client-history', subtitle: 'مراجعة سجل الكسب والاستبدال.', meta: 'السجل', badgeLabel: 'مراجعة' },
    { title: 'entitlements-get', subtitle: 'التحقق من الاستحقاقات المتاحة.', meta: 'المزايا', badgeLabel: 'تحقق' },
  ],
};

export const loyaltyBenefitKeyValues: Record<LoyaltyBenefitMode, Array<{ label: string; value: string }>> = {
  loyalty: [
    { label: 'الرصيد', value: 'loyalty-points-client-balance' },
    { label: 'الاستبدال', value: 'loyalty-points-redeem' },
    { label: 'السجل', value: 'loyalty-points-client-history' },
  ],
};

function buildLoyaltyRewardsFixture(): LoyaltyRewardsFixture {
  const programs = getLoyaltyPrograms();
  const rewards = getLoyaltyRewards();
  const tiers = getLoyaltyTiers();
  const program = programs[0];
  if (!program) {
    return {
      title: 'الولاء والمكافآت',
      subtitle: 'لا يوجد برنامج ولاء نشط.',
      note: 'بيانات معاينة للولاء.',
      metrics: [],
      sections: [],
    };
  }
  return mapLoyaltyProgramToClientBenefits(program.name, rewards, tiers);
}

export const loyaltyRewardsFixture: LoyaltyRewardsFixture = buildLoyaltyRewardsFixture();

// --- Subscriptions ---

export type SubscriptionPlanCard = SubscriptionClientCard;

export const subscriptionHeroCopy = {
  eyebrow: 'بثواني برو',
  title: 'الاشتراكات',
  subtitle: 'دفع وتبديل وإدارة من نفس الصفحة.',
  note: 'العائلة حزمة داخل بثواني برو وليست منتجاً منفصلاً.',
} as const;

export const subscriptionPlanCards: SubscriptionPlanCard[] = mapSubscriptionPlansToClientCards(getSubscriptionPlans());

export function selectDshClientSubscriptionsPreview(customerId?: string) {
  void customerId;
  return {
    hero: subscriptionHeroCopy,
    plans: subscriptionPlanCards,
    loyaltyRewards: loyaltyRewardsFixture,
    benefits: loyaltyBenefitSurfaceItems.loyalty,
  };
}
