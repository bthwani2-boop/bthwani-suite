type DshHomeGetPromo = {
  readonly id?: string;
  readonly title?: string;
  readonly subtitle?: string;
  readonly description?: string;
  readonly icon?: string;
  readonly imageUrl?: string;
  readonly image?: string;
  readonly href?: string;
  readonly ctaLabel?: string;
  readonly ctaHref?: string;
  readonly badge?: string;
  readonly tone?: string;
  readonly actionType?: MarketingBannerActionType;
  readonly actionTarget?: string;
  readonly actionExtra?: string;
  readonly mediaKey?: string;
  readonly accentColor?: string;
};
export type MarketingBannerActionType =
  | 'main_category'
  | 'sub_category'
  | 'store'
  | 'store_category'
  | 'product'
  | 'external'
  | 'subscription';
export type MarketingBannerAudience = 'home' | 'stores' | 'all';
export type MarketingBannerStatus = 'draft' | 'published';

export type MarketingBannerRecord = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  mediaKey?: string;
  accentColor?: string;
  audience: MarketingBannerAudience;
  status: MarketingBannerStatus;
  actionType: MarketingBannerActionType;
  actionTarget?: string;
  actionExtra?: string;
  ctaLabel?: string;
  partnerName?: string;
  position: number;
  clicks: number;
  impressions: number;
  scheduleStartHour?: number;
  scheduleEndHour?: number;
  updatedAt: string;
};

const STORE_KEY = '__BTHWANI_DSH_MARKETING_BANNERS__';

function createBannerDataUrl(background: string, accent: string, title: string, subtitle: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="680" viewBox="0 0 1200 680">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${background}" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.08" />
        </linearGradient>
      </defs>
      <rect width="1200" height="680" rx="44" fill="url(#bg)" />
      <circle cx="1060" cy="120" r="110" fill="#ffffff" fill-opacity="0.16" />
      <circle cx="980" cy="540" r="160" fill="#ffffff" fill-opacity="0.10" />
      <rect x="68" y="68" width="320" height="58" rx="29" fill="${accent}" fill-opacity="0.92" />
      <text x="228" y="107" font-family="Arial, sans-serif" font-size="30" font-weight="700" text-anchor="middle" fill="#ffffff">${title}</text>
      <text x="80" y="236" font-family="Arial, sans-serif" font-size="60" font-weight="800" fill="#ffffff">${subtitle}</text>
      <rect x="80" y="300" width="420" height="14" rx="7" fill="#ffffff" fill-opacity="0.42" />
      <rect x="80" y="332" width="320" height="14" rx="7" fill="#ffffff" fill-opacity="0.30" />
      <rect x="80" y="412" width="240" height="72" rx="36" fill="#ffffff" fill-opacity="0.22" />
      <text x="200" y="458" font-family="Arial, sans-serif" font-size="28" font-weight="700" text-anchor="middle" fill="#ffffff">انقر للمتابعة</text>
      <rect x="84" y="516" width="1020" height="96" rx="48" fill="#000000" fill-opacity="0.08" />
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const seededBanners: MarketingBannerRecord[] = [
  {
    id: 'marketing-banner-hero',
    title: 'تخفيضات',
    subtitle: 'خصم 30% على أول طلب',
    imageUrl: createBannerDataUrl('#f97316', '#2563eb', 'تخفيضات', 'خصم 30% على أول طلب'),
    mediaKey: 'dsh.banner.home.promo-1.v1',
    accentColor: '#f97316',
    audience: 'all',
    status: 'published',
    actionType: 'main_category',
    actionTarget: 'restaurants',
    ctaLabel: 'اطلب الآن',
    partnerName: 'DSH',
    position: 1,
    clicks: 124,
    impressions: 920,
    scheduleStartHour: 8,
    scheduleEndHour: 23,
    updatedAt: '2026-04-16T08:00:00.000Z',
  },
  {
    id: 'marketing-banner-store-category',
    title: 'فئة داخل متجر',
    subtitle: 'انتقل مباشرة إلى فئة فرعية داخل متجر نشط',
    imageUrl: createBannerDataUrl('#7c3aed', '#0f172a', 'فئة داخل متجر', 'دخول مباشر للفئة الفرعية'),
    mediaKey: 'dsh.banner.home.promo-4.v1',
    accentColor: '#7c3aed',
    audience: 'all',
    status: 'published',
    actionType: 'store_category',
    actionTarget: 'store-1001',
    actionExtra: 'fresh',
    ctaLabel: 'افتح الفئة',
    partnerName: 'مطعم القلعة',
    position: 3,
    clicks: 31,
    impressions: 280,
    scheduleStartHour: 8,
    scheduleEndHour: 23,
    updatedAt: '2026-04-16T08:00:00.000Z',
  },
  {
    id: 'marketing-banner-stores',
    title: 'متجر مباشر',
    subtitle: 'افتح المتجر ثم تابع إلى القائمة',
    imageUrl: createBannerDataUrl('#1d4ed8', '#0f172a', 'متجر مباشر', 'تابع الطلب من نفس المسار'),
    mediaKey: 'dsh.banner.home.promo-2.v1',
    accentColor: '#1d4ed8',
    audience: 'stores',
    status: 'published',
    actionType: 'store',
    actionTarget: 'store-1001',
    ctaLabel: 'افتح المتجر',
    partnerName: 'مطعم القلعة',
    position: 2,
    clicks: 88,
    impressions: 610,
    scheduleStartHour: 8,
    scheduleEndHour: 23,
    updatedAt: '2026-04-16T08:00:00.000Z',
  },
  {
    id: 'marketing-banner-benefits',
    title: 'اشتراك مميز',
    subtitle: 'اعرض فوائد الاشتراك مباشرة',
    imageUrl: createBannerDataUrl('#dc2626', '#f59e0b', 'اشتراك مميز', 'أولوية وتوصيل أسرع'),
    mediaKey: 'dsh.banner.home.promo-3.v1',
    accentColor: '#dc2626',
    audience: 'home',
    status: 'published',
    actionType: 'subscription',
    ctaLabel: 'اعرف المزيد',
    partnerName: 'BThwani Pro',
    position: 4,
    clicks: 47,
    impressions: 410,
    scheduleStartHour: 8,
    scheduleEndHour: 23,
    updatedAt: '2026-04-16T08:00:00.000Z',
  },
  {
    id: 'marketing-banner-product',
    title: 'منتج مباشر',
    subtitle: 'افتح المنتج الجاهز للتفاعل',
    imageUrl: createBannerDataUrl('#0ea5e9', '#0f172a', 'منتج مباشر', 'انتقال مباشر إلى المنتج'),
    mediaKey: 'dsh.banner.home.promo-5.v1',
    accentColor: '#0ea5e9',
    audience: 'all',
    status: 'published',
    actionType: 'product',
    actionTarget: 'item-apple-1',
    actionExtra: 'store-1001',
    ctaLabel: 'افتح المنتج',
    partnerName: 'شريك منشور',
    position: 5,
    clicks: 18,
    impressions: 190,
    scheduleStartHour: 8,
    scheduleEndHour: 23,
    updatedAt: '2026-04-16T08:00:00.000Z',
  },
  {
    id: 'marketing-banner-draft',
    title: 'فئات الموسم',
    subtitle: 'استكشف الفئات المختارة هذا الأسبوع',
    imageUrl: createBannerDataUrl('#0f766e', '#14b8a6', 'فئات الموسم', 'انتقال مختصر إلى الفئات'),
    mediaKey: 'dsh.banner.home.promo-4.v1',
    accentColor: '#0f766e',
    audience: 'all',
    status: 'draft',
    actionType: 'external',
    actionTarget: 'DshStoresList',
    ctaLabel: 'افتح الاستكشاف',
    partnerName: 'التسويق',
    position: 6,
    clicks: 0,
    impressions: 0,
    updatedAt: '2026-04-16T08:00:00.000Z',
  },
];

const seededBannerMediaKeysById: Record<string, string> = {
  'marketing-banner-hero': 'dsh.banner.home.promo-1.v1',
  'marketing-banner-store-category': 'dsh.banner.home.promo-4.v1',
  'marketing-banner-stores': 'dsh.banner.home.promo-2.v1',
  'marketing-banner-benefits': 'dsh.banner.home.promo-3.v1',
  'marketing-banner-product': 'dsh.banner.home.promo-5.v1',
  'marketing-banner-draft': 'dsh.banner.home.promo-4.v1',
};

function getGlobalStore(): typeof globalThis & { [STORE_KEY]?: MarketingBannerRecord[] } {
  return globalThis as typeof globalThis & { [STORE_KEY]?: MarketingBannerRecord[] };
}

function getMutableStore(): MarketingBannerRecord[] {
  const scope = getGlobalStore();
  if (!Array.isArray(scope[STORE_KEY]) || scope[STORE_KEY]?.length === 0) {
    scope[STORE_KEY] = seededBanners.map((item) => ({ ...item }));
  } else {
    scope[STORE_KEY] = scope[STORE_KEY].map((item) => ({
      ...item,
      mediaKey: item.mediaKey?.trim() || seededBannerMediaKeysById[item.id] || item.mediaKey,
    }));
  }

  return scope[STORE_KEY] ?? [];
}

function setMutableStore(next: MarketingBannerRecord[]) {
  getGlobalStore()[STORE_KEY] = next;
}

export function computeMarketingBannerQuality(item: Partial<MarketingBannerRecord>): number {
  let score = 0;

  if (item.title?.trim()) score += 20;
  if (item.subtitle?.trim()) score += 20;
  if (item.imageUrl?.trim()) score += 20;
  if (item.actionType) score += 10;
  if (!item.actionType || item.actionType === 'subscription' || item.actionTarget?.trim()) score += 15;
  if (item.ctaLabel?.trim()) score += 10;
  if (item.accentColor?.trim()) score += 5;

  return Math.min(100, score);
}

export function isMarketingBannerLive(item: MarketingBannerRecord, now = new Date()): boolean {
  if (item.status !== 'published') {
    return false;
  }

  const hour = now.getHours();
  if (typeof item.scheduleStartHour === 'number' && hour < item.scheduleStartHour) {
    return false;
  }

  if (typeof item.scheduleEndHour === 'number' && hour > item.scheduleEndHour) {
    return false;
  }

  return true;
}

export function getMarketingBannerItems(): MarketingBannerRecord[] {
  return [...getMutableStore()].sort((left, right) => left.position - right.position);
}

export function getMarketingBannerKpis() {
  const items = getMarketingBannerItems();
  return {
    total: items.length,
    published: items.filter((item) => item.status === 'published').length,
    drafts: items.filter((item) => item.status === 'draft').length,
    live: items.filter((item) => isMarketingBannerLive(item)).length,
    clicks: items.reduce((sum, item) => sum + item.clicks, 0),
  };
}

export function mapMarketingBannerToPromo(item: MarketingBannerRecord): DshHomeGetPromo {
  return {
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    icon: item.partnerName ? '✨' : '🔥',
    actionType: item.actionType,
    actionTarget: item.actionTarget,
    actionExtra: item.actionExtra,
    mediaKey: item.mediaKey,
    imageUrl: item.imageUrl,
    accentColor: item.accentColor,
  };
}

export function getPublishedMarketingHomePromos(audience: MarketingBannerAudience | 'all' = 'all'): DshHomeGetPromo[] {
  return getMarketingBannerItems()
    .filter((item) => isMarketingBannerLive(item))
    .filter((item) => audience === 'all' || item.audience === 'all' || item.audience === audience)
    .map(mapMarketingBannerToPromo);
}

export function upsertMarketingBannerItem(item: Partial<MarketingBannerRecord>) {
  const current = getMarketingBannerItems();
  const existing = item.id ? current.find((entry) => entry.id === item.id) : undefined;
  const nextId = item.id ?? `marketing-banner-${Date.now()}`;
  const nextEntry: MarketingBannerRecord = {
    id: nextId,
    title: item.title?.trim() || existing?.title || 'بنر جديد',
    subtitle: item.subtitle?.trim() || existing?.subtitle || 'أضف نصًا مختصرًا وواضحًا هنا',
    imageUrl: item.imageUrl?.trim() || existing?.imageUrl || createBannerDataUrl(item.accentColor?.trim() || '#f97316', '#1d4ed8', item.title?.trim() || 'بنر جديد', item.subtitle?.trim() || 'أضف النص هنا'),
    mediaKey: item.mediaKey?.trim() || existing?.mediaKey,
    accentColor: item.accentColor?.trim() || existing?.accentColor || '#f97316',
    audience: item.audience || existing?.audience || 'all',
    status: item.status || existing?.status || 'draft',
    actionType: item.actionType || existing?.actionType || 'external',
    actionTarget: item.actionTarget?.trim() || existing?.actionTarget || 'DshStoresList',
    actionExtra: item.actionExtra?.trim() || existing?.actionExtra || '',
    ctaLabel: item.ctaLabel?.trim() || existing?.ctaLabel || 'افتح الآن',
    partnerName: item.partnerName?.trim() || existing?.partnerName || 'التسويق',
    position: Number.isFinite(Number(item.position)) ? Number(item.position) : existing?.position || current.length + 1,
    clicks: existing?.clicks ?? 0,
    impressions: existing?.impressions ?? 0,
    scheduleStartHour: typeof item.scheduleStartHour === 'number' ? item.scheduleStartHour : existing?.scheduleStartHour,
    scheduleEndHour: typeof item.scheduleEndHour === 'number' ? item.scheduleEndHour : existing?.scheduleEndHour,
    updatedAt: new Date().toISOString(),
  };

  if (existing) {
    setMutableStore(current.map((entry) => (entry.id === nextEntry.id ? nextEntry : entry)));
  } else {
    setMutableStore([...current, nextEntry]);
  }

  return nextEntry;
}

export function toggleMarketingBannerStatus(id: string) {
  const current = getMarketingBannerItems();
  const next = current.map((item) => {
    if (item.id !== id) {
      return item;
    }

    return {
      ...item,
      status: item.status === 'published' ? 'draft' : 'published',
      updatedAt: new Date().toISOString(),
    } satisfies MarketingBannerRecord;
  });

  setMutableStore(next);
  return next.find((item) => item.id === id) ?? null;
}

export function duplicateMarketingBannerItem(id: string) {
  const source = getMarketingBannerItems().find((item) => item.id === id);
  if (!source) {
    return null;
  }

  return upsertMarketingBannerItem({
    ...source,
    id: undefined,
    title: `${source.title} · نسخة`,
    status: 'draft',
    position: source.position + 1,
  });
}

export function removeMarketingBannerItem(id: string) {
  setMutableStore(getMarketingBannerItems().filter((item) => item.id !== id));
}

export function recordMarketingBannerClick(id: string) {
  const current = getMarketingBannerItems();
  const next = current.map((item) => {
    if (item.id !== id) {
      return item;
    }

    return {
      ...item,
      clicks: item.clicks + 1,
      updatedAt: new Date().toISOString(),
    } satisfies MarketingBannerRecord;
  });

  setMutableStore(next);
}

export function recordMarketingBannerImpression(id: string) {
  const current = getMarketingBannerItems();
  const next = current.map((item) => {
    if (item.id !== id) {
      return item;
    }

    return {
      ...item,
      impressions: item.impressions + 1,
      updatedAt: new Date().toISOString(),
    } satisfies MarketingBannerRecord;
  });

  setMutableStore(next);
}
