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

const STORE_KEY = '__BTHWANI_DSH_LOYALTY_STORE__';

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
    accentColor: '#dc2626',
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
    accentColor: '#8b5cf6',
    impressions: 45000,
    clicks: 5200,
  }
];

function getGlobalStore(): typeof globalThis & { [STORE_KEY]?: LoyaltyRecord[] } {
  return globalThis as typeof globalThis & { [STORE_KEY]?: LoyaltyRecord[] };
}

function getMutableStore(): LoyaltyRecord[] {
  const scope = getGlobalStore();
  if (!scope[STORE_KEY]) {
    scope[STORE_KEY] = seededLoyaltyItems.map((item) => ({ ...item }));
  }
  return scope[STORE_KEY] ?? [];
}

function setMutableStore(next: LoyaltyRecord[]) {
  getGlobalStore()[STORE_KEY] = next.map((item) => ({ ...item }));
}

export function getLoyaltyItems(): LoyaltyRecord[] {
  return getMutableStore();
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
    accentColor: item.accentColor?.trim() || existing?.accentColor || '#0A2F5C',
    impressions: item.impressions ?? existing?.impressions ?? 0,
    clicks: item.clicks ?? existing?.clicks ?? 0,
  };

  const next = existing
    ? current.map((entry) => (entry.id === nextEntry.id ? nextEntry : entry))
    : [nextEntry, ...current];

  setMutableStore(next);
  return nextEntry;
}

export function removeLoyaltyItem(id: string) {
  setMutableStore(getLoyaltyItems().filter((item) => item.id !== id));
}

// --- NEW COMMERCIAL OWNERSHIP MODELS (PHASE 1) ---

export type LoyaltyProgram = {
  id: string;
  name: string;
  description: string;
  currencyLabel: string;
};

export type LoyaltyTier = {
  id: string;
  programId: string;
  name: string;
  minimumPoints: number;
  benefits: string[];
};

export type LoyaltyReward = {
  id: string;
  programId: string;
  title: string;
  pointsCost: number;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  monthlyFee: number;
  features: string[];
};

export type Entitlement = {
  id: string;
  userId?: string;
  type: 'tier' | 'subscription' | 'reward';
  referenceId: string;
  status: 'active' | 'expired';
};

export type EarningRule = {
  id: string;
  description: string;
  pointsMultiplier: number;
};

export type RedemptionRule = {
  id: string;
  description: string;
  pointsValue: number;
};

export function getLoyaltyPrograms(): LoyaltyProgram[] {
  return [
    { id: 'prog-1', name: 'نقاط بثواني', description: 'برنامج الولاء العام للتطبيق', currencyLabel: 'نقطة' }
  ];
}

export function getSubscriptionPlans(): SubscriptionPlan[] {
  return [
    { id: 'sub-pro', name: 'بثواني برو', monthlyFee: 39, features: ['توصيل مجاني', 'عروض حصرية'] }
  ];
}

export function getLoyaltyTiers(): LoyaltyTier[] {
  return [
    { id: 'tier-silver', programId: 'prog-1', name: 'فضي', minimumPoints: 0, benefits: [] },
    { id: 'tier-gold', programId: 'prog-1', name: 'ذهبي', minimumPoints: 1000, benefits: ['دعم سريع'] }
  ];
}

export function getLoyaltyRewards(): LoyaltyReward[] {
  return [
    { id: 'rew-1', programId: 'prog-1', title: 'كوبون خصم 10 ريال', pointsCost: 1000 }
  ];
}

export function getEntitlements(): Entitlement[] {
  return [];
}
