export type MarketingGrowthFamily = 'campaign' | 'promotion' | 'subscription' | 'shorts';
export type MarketingGrowthSource = 'marketing' | 'partner';
export type MarketingGrowthStatus = 'draft' | 'pending-marketing' | 'published' | 'paused';
export type MarketingGrowthAudience = 'all' | 'client' | 'operations';
export type MarketingGrowthRouteTarget =
  | 'home'
  | 'categories-list'
  | 'promo-apply'
  | 'subscription-family-get'
  | 'entitlements-get'
  | 'main_category'
  | 'sub_category'
  | 'store'
  | 'store_category'
  | 'product'
  | 'subscription'
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
  videoUrl?: string;
  posterUrl?: string;
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
  },
  {
    id: 'growth-subscription-pro',
    title: 'اشتراك برو بلس',
    subtitle: 'مزايا الاشتراك، الأولوية، وسرعة التسليم تظهر من نفس ملكية التسويق.',
    family: 'subscription',
    status: 'published',
    audience: 'client',
    source: 'marketing',
    routeTarget: 'subscription',
    ctaLabel: 'مراجعة الاشتراك',
    highlight: 'مرتبط بمسار الاشتراك الحقيقي',
    metricValue: '٢,٨٤٠ عضو نشط',
    accentColor: '#dc2626',
    impressions: 33000,
    clicks: 1910,
  },
  {
    id: 'growth-shorts-partner-teaser',
    title: 'فيديو الشريك قيد المراجعة',
    subtitle: 'تم رفعه من تطبيق الشريك وينتظر اعتماد التسويق قبل الظهور للعميل.',
    family: 'shorts',
    status: 'pending-marketing',
    audience: 'client',
    source: 'partner',
    routeTarget: 'product',
    routeTargetId: 'item-apple-1',
    routeTargetExtra: 'store-1001',
    ctaLabel: 'راجع الفيديو',
    highlight: 'بانتظار موافقة التسويق',
    metricValue: 'مرفق جديد',
    accentColor: '#0f766e',
    impressions: 12000,
    clicks: 610,
  },
  {
    id: 'growth-shorts-marketing-launch',
    title: 'فيديو إطلاق من التسويق',
    subtitle: 'تم رفعه من لوحة التحكم ويظهر للعميل فقط بعد الاعتماد النهائي.',
    family: 'shorts',
    status: 'published',
    audience: 'client',
    source: 'marketing',
    routeTarget: 'sub_category',
    routeTargetId: 'grocery_vegetables_fruits',
    ctaLabel: 'شاهد الآن',
    highlight: 'مباشر بعد الاعتماد',
    metricValue: 'معتمد للعرض',
    accentColor: '#f97316',
    videoUrl: 'marketing/shorts/launch.mp4',
    posterUrl: 'marketing/shorts/launch.jpg',
    impressions: 18000,
    clicks: 870,
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
    if (item.status !== 'published') {
      return false;
    }

    return audience === 'all' || item.audience === 'all' || item.audience === audience;
  });
}

export function getPendingMarketingGrowthItems(audience: MarketingGrowthAudience | 'all' = 'all'): MarketingGrowthRecord[] {
  return getMarketingGrowthItems().filter((item) => {
    if (item.status !== 'pending-marketing') {
      return false;
    }

    return audience === 'all' || item.audience === 'all' || item.audience === audience;
  });
}

export function getMarketingGrowthKpis() {
  const items = getMarketingGrowthItems();
  const live = items.filter((item) => item.status === 'published');
  const pendingMarketing = items.filter((item) => item.status === 'pending-marketing');

  return {
    total: items.length,
    live: live.length,
    pendingMarketing: pendingMarketing.length,
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
    source: item.source ?? existing?.source ?? 'marketing',
    routeTarget: item.routeTarget ?? existing?.routeTarget ?? 'home',
    routeTargetId: item.routeTargetId?.trim() || existing?.routeTargetId,
    routeTargetExtra: item.routeTargetExtra?.trim() || existing?.routeTargetExtra,
    ctaLabel: item.ctaLabel?.trim() || existing?.ctaLabel || 'فتح الآن',
    highlight: item.highlight?.trim() || existing?.highlight || 'مهيأ للنشر',
    metricValue: item.metricValue?.trim() || existing?.metricValue || 'بدون بيانات',
    accentColor: item.accentColor?.trim() || existing?.accentColor || '#f97316',
    videoUrl: item.videoUrl?.trim() || existing?.videoUrl,
    posterUrl: item.posterUrl?.trim() || existing?.posterUrl,
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
  const next = current.map((item) => {
    if (item.id !== id) {
      return item;
    }

    return {
      ...item,
      status: 'published',
    } satisfies MarketingGrowthRecord;
  });

  setMutableStore(next);
}

export function pauseMarketingGrowthItem(id: string) {
  const current = getMarketingGrowthItems();
  const next = current.map((item) => {
    if (item.id !== id) {
      return item;
    }

    return {
      ...item,
      status: 'paused',
    } satisfies MarketingGrowthRecord;
  });

  setMutableStore(next);
}

export function submitMarketingGrowthItem(id: string) {
  const current = getMarketingGrowthItems();
  const next = current.map((item) => {
    if (item.id !== id) {
      return item;
    }

    return {
      ...item,
      status: 'pending-marketing',
    } satisfies MarketingGrowthRecord;
  });

  setMutableStore(next);
}

export function toggleMarketingGrowthStatus(id: string) {
  const current = getMarketingGrowthItems();
  const next = current.map((item) => {
    if (item.id !== id) {
      return item;
    }

    const nextStatus: MarketingGrowthStatus = item.status === 'published' ? 'paused' : 'published';

    return {
      ...item,
      status: nextStatus,
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
