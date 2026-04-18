export type MarketingGrowthFamily = 'campaign' | 'promotion' | 'subscription' | 'shorts';
export type MarketingGrowthStatus = 'draft' | 'published' | 'paused';
export type MarketingGrowthAudience = 'all' | 'client' | 'operations';
export type MarketingGrowthRouteTarget = 'home' | 'categories-list' | 'promo-apply' | 'subscription-family-get' | 'entitlements-get';

export type MarketingGrowthRecord = {
  id: string;
  title: string;
  subtitle: string;
  family: MarketingGrowthFamily;
  status: MarketingGrowthStatus;
  audience: MarketingGrowthAudience;
  routeTarget: MarketingGrowthRouteTarget;
  ctaLabel: string;
  highlight: string;
  metricValue: string;
  accentColor: string;
  impressions: number;
  clicks: number;
};

const STORE_KEY = '__BTHWANI_DSH_MARKETING_GROWTH__';

const seededGrowthItems: MarketingGrowthRecord[] = [
  {
    id: 'growth-campaign-ramadan',
    title: 'حملة رمضان المحلية',
    subtitle: 'توجيه المستخدم إلى المتاجر والفئات الحية مع إبقاء العرض داخل المسار الفعلي.',
    family: 'campaign',
    status: 'published',
    audience: 'client',
    routeTarget: 'home',
    ctaLabel: 'استكشف العروض',
    highlight: 'ظهور في الرئيسية + قائمة المتاجر',
    metricValue: '١٢٥ ألف مشاهدة',
    accentColor: '#f97316',
    impressions: 125000,
    clicks: 3240,
  },
  {
    id: 'growth-promo-welcome',
    title: 'كوبون الترحيب',
    subtitle: 'ينتقل مباشرة إلى مسار تطبيق الكوبون داخل الدفع بدل عرض صامت أو معزول.',
    family: 'promotion',
    status: 'published',
    audience: 'client',
    routeTarget: 'promo-apply',
    ctaLabel: 'تطبيق الخصم',
    highlight: 'مرتبط مباشرة بمسار الدفع',
    metricValue: '٤,٥٢٠ استخدام',
    accentColor: '#8b5cf6',
    impressions: 54000,
    clicks: 4520,
  },
  {
    id: 'growth-subscription-pro',
    title: 'اشتراك برو بلس',
    subtitle: 'مزايا الاشتراك، الأولوية، وسرعة التسليم تظهر من نفس ملكية التسويق.',
    family: 'subscription',
    status: 'published',
    audience: 'client',
    routeTarget: 'subscription-family-get',
    ctaLabel: 'مراجعة الاشتراك',
    highlight: 'مرتبط بمسار الاشتراك الحقيقي',
    metricValue: '٢,٨٤٠ عضو نشط',
    accentColor: '#dc2626',
    impressions: 33000,
    clicks: 1910,
  },
  {
    id: 'growth-shorts-spotlight',
    title: 'مواضع الشورتات',
    subtitle: 'مساحة ترويجية قصيرة لدفع فئات موسمية ومنتجات حية داخل التطبيق.',
    family: 'shorts',
    status: 'draft',
    audience: 'client',
    routeTarget: 'categories-list',
    ctaLabel: 'فتح الفئات',
    highlight: 'جاهز للنشر الموسمي',
    metricValue: '٣ مواضع جاهزة',
    accentColor: '#0f766e',
    impressions: 12000,
    clicks: 610,
  },
];

function getGlobalStore(): typeof globalThis & { [STORE_KEY]?: MarketingGrowthRecord[] } {
  return globalThis as typeof globalThis & { [STORE_KEY]?: MarketingGrowthRecord[] };
}

function getMutableStore(): MarketingGrowthRecord[] {
  const scope = getGlobalStore();
  if (!scope[STORE_KEY]) {
    scope[STORE_KEY] = seededGrowthItems.map((item) => ({ ...item }));
  }

  return scope[STORE_KEY] ?? [];
}

function setMutableStore(next: MarketingGrowthRecord[]) {
  getGlobalStore()[STORE_KEY] = next.map((item) => ({ ...item }));
}

function sortGrowthItems(items: MarketingGrowthRecord[]) {
  return [...items].sort((left, right) => {
    const leftWeight = left.status === 'published' ? 0 : left.status === 'draft' ? 1 : 2;
    const rightWeight = right.status === 'published' ? 0 : right.status === 'draft' ? 1 : 2;
    if (leftWeight !== rightWeight) {
      return leftWeight - rightWeight;
    }
    return left.title.localeCompare(right.title, 'ar');
  });
}

export function getMarketingGrowthItems(): MarketingGrowthRecord[] {
  return sortGrowthItems(getMutableStore());
}

export function getLiveMarketingGrowthItems(audience: MarketingGrowthAudience | 'all' = 'all'): MarketingGrowthRecord[] {
  return getMarketingGrowthItems().filter((item) => {
    if (item.status !== 'published') {
      return false;
    }

    return audience === 'all' || item.audience === 'all' || item.audience === audience;
  });
}

export function getMarketingGrowthKpis() {
  const items = getMarketingGrowthItems();
  const live = items.filter((item) => item.status === 'published');

  return {
    total: items.length,
    live: live.length,
    subscriptions: live.filter((item) => item.family === 'subscription').length,
    promotions: live.filter((item) => item.family === 'promotion' || item.family === 'campaign').length,
    clicks: live.reduce((sum, item) => sum + item.clicks, 0),
  };
}

export function upsertMarketingGrowthItem(item: Partial<MarketingGrowthRecord>) {
  const current = getMarketingGrowthItems();
  const nextId = item.id ?? `marketing-growth-${Date.now()}`;
  const existing = current.find((entry) => entry.id === nextId);

  const nextEntry: MarketingGrowthRecord = {
    id: nextId,
    title: item.title?.trim() || existing?.title || 'برنامج تسويقي جديد',
    subtitle: item.subtitle?.trim() || existing?.subtitle || 'أضف وصفًا واضحًا للمسار الترويجي.',
    family: item.family ?? existing?.family ?? 'campaign',
    status: item.status ?? existing?.status ?? 'draft',
    audience: item.audience ?? existing?.audience ?? 'client',
    routeTarget: item.routeTarget ?? existing?.routeTarget ?? 'home',
    ctaLabel: item.ctaLabel?.trim() || existing?.ctaLabel || 'فتح الآن',
    highlight: item.highlight?.trim() || existing?.highlight || 'مهيأ للنشر',
    metricValue: item.metricValue?.trim() || existing?.metricValue || 'بدون بيانات',
    accentColor: item.accentColor?.trim() || existing?.accentColor || '#f97316',
    impressions: item.impressions ?? existing?.impressions ?? 0,
    clicks: item.clicks ?? existing?.clicks ?? 0,
  };

  const next = existing
    ? current.map((entry) => (entry.id === nextEntry.id ? nextEntry : entry))
    : [nextEntry, ...current];

  setMutableStore(next);
  return nextEntry;
}

export function toggleMarketingGrowthStatus(id: string) {
  const current = getMarketingGrowthItems();
  const next = current.map((item) => {
    if (item.id !== id) {
      return item;
    }

    return {
      ...item,
      status: item.status === 'published' ? 'paused' : 'published',
    } satisfies MarketingGrowthRecord;
  });

  setMutableStore(next);
}

export function duplicateMarketingGrowthItem(id: string) {
  const source = getMarketingGrowthItems().find((item) => item.id === id);
  if (!source) {
    return null;
  }

  return upsertMarketingGrowthItem({
    ...source,
    id: undefined,
    title: `${source.title} — نسخة`,
    status: 'draft',
  });
}

export function removeMarketingGrowthItem(id: string) {
  setMutableStore(getMarketingGrowthItems().filter((item) => item.id !== id));
}
