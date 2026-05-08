export type MarketingGrowthFamily = 'campaign' | 'promotion';
export type MarketingGrowthSource = 'marketing' | 'partner';
export type MarketingGrowthStatus = 'draft' | 'pending-marketing' | 'published' | 'paused';
export type MarketingGrowthAudience = 'all' | 'client' | 'operations';
export type MarketingGrowthRouteTarget =
  | 'home'
  | 'promo-apply'
  | 'main_category'
  | 'sub_category'
  | 'store'
  | 'store_category'
  | 'product'
  | 'search';

export type MarketingGrowthRecord = {
  id: string;
  title: string;
  subtitle: string;
  family: MarketingGrowthFamily;
  status: MarketingGrowthStatus;
  audience: MarketingGrowthAudience;
  source: MarketingGrowthSource;
  routeTarget: MarketingGrowthRouteTarget;
  routeTargetId?: string;
  routeTargetExtra?: string;
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
    source: 'marketing',
    routeTarget: 'main_category',
    routeTargetId: 'restaurants',
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
    source: 'marketing',
    routeTarget: 'store',
    routeTargetId: 'store-1001',
    ctaLabel: 'تطبيق الخصم',
    highlight: 'مرتبط مباشرة بمسار الدفع',
    metricValue: '٤,٥٢٠ استخدام',
    accentColor: '#8b5cf6',
    impressions: 54000,
    clicks: 4520,
  }
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
    const leftWeight = left.status === 'published' ? 0 : left.status === 'pending-marketing' ? 1 : left.status === 'draft' ? 2 : 3;
    const rightWeight = right.status === 'published' ? 0 : right.status === 'pending-marketing' ? 1 : right.status === 'draft' ? 2 : 3;
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
    if (item.status !== 'published') return false;
    return audience === 'all' || item.audience === 'all' || item.audience === audience;
  });
}

export function getMarketingGrowthKpis() {
  const items = getMarketingGrowthItems();
  const live = items.filter((item) => item.status === 'published');
  return {
    total: items.length,
    live: live.length,
    pendingMarketing: items.filter((item) => item.status === 'pending-marketing').length,
    promotions: live.length,
    impressions: live.reduce((sum, item) => sum + item.impressions, 0),
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
    source: item.source ?? existing?.source ?? 'marketing',
    routeTarget: item.routeTarget ?? existing?.routeTarget ?? 'home',
    routeTargetId: item.routeTargetId?.trim() || existing?.routeTargetId,
    routeTargetExtra: item.routeTargetExtra?.trim() || existing?.routeTargetExtra,
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

export function approveMarketingGrowthItem(id: string) {
  const current = getMarketingGrowthItems();
  const next = current.map((item) => (item.id === id ? { ...item, status: 'published' as const } : item));
  setMutableStore(next);
}

export function pauseMarketingGrowthItem(id: string) {
  const current = getMarketingGrowthItems();
  const next = current.map((item) => (item.id === id ? { ...item, status: 'paused' as const } : item));
  setMutableStore(next);
}

export function submitMarketingGrowthItem(id: string) {
  const current = getMarketingGrowthItems();
  const next = current.map((item) => (item.id === id ? { ...item, status: 'pending-marketing' as const } : item));
  setMutableStore(next);
}

export function toggleMarketingGrowthStatus(id: string) {
  const current = getMarketingGrowthItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    const nextStatus: MarketingGrowthStatus = item.status === 'published' ? 'paused' : 'published';
    return { ...item, status: nextStatus };
  });
  setMutableStore(next);
}

export function duplicateMarketingGrowthItem(id: string) {
  const source = getMarketingGrowthItems().find((item) => item.id === id);
  if (!source) return null;
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
