/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source.
 */
export const bannerStoreDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'preview-only local display / not runtime UTC source',
  moneySemantics: 'not_applicable',
} as const;

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
  readonly templateId?: string;
  readonly offerBadgeText?: string;
  readonly offerBadgeColor?: string;
  readonly offerBadgePosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  readonly partnerLogoUrl?: string;
  readonly partnerLogoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  readonly overlayImageUrl?: string;
  readonly overlayPosition?: 'center' | 'bottom' | 'top' | 'fill';
  readonly overlayOpacity?: number;
  readonly titlePlacement?: 'top' | 'center' | 'bottom';
  readonly subtitlePlacement?: 'top' | 'center' | 'bottom';
  readonly ctaPlacement?: 'top' | 'center' | 'bottom' | 'left' | 'right';
  readonly imageFit?: 'cover' | 'contain';
  readonly motionStyle?: MarketingBannerMotionStyle;
  readonly autoplayEnabled?: boolean;
  readonly autoplayIntervalMs?: number;
  readonly pauseOnInteraction?: boolean;
  readonly publishStage?: string;
  readonly mediaPolicy?: string;
};

export type MarketingBannerActionType =
  | 'main_category'
  | 'sub_category'
  | 'store'
  | 'store_category'
  | 'product'
  | 'external'
  | 'subscription';

export type MarketingBannerAudience = 'home' | 'stores' | 'client' | 'all';
export type MarketingBannerStatus = 'draft' | 'published';
export type MarketingBannerMotionStyle = 'slide' | 'soft-parallax' | 'subtle-fade' | 'snap-focus';

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
  // Template fields
  templateId?: string;
  offerBadgeText?: string;
  offerBadgeColor?: string;
  offerBadgePosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  partnerLogoUrl?: string;
  partnerLogoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  overlayImageUrl?: string;
  overlayPosition?: 'center' | 'bottom' | 'top' | 'fill';
  overlayOpacity?: number;
  titlePlacement?: 'top' | 'center' | 'bottom';
  subtitlePlacement?: 'top' | 'center' | 'bottom';
  ctaPlacement?: 'top' | 'center' | 'bottom' | 'left' | 'right';
  imageFit?: 'cover' | 'contain';
  motionStyle?: MarketingBannerMotionStyle;
  autoplayEnabled?: boolean;
  autoplayIntervalMs?: number;
  pauseOnInteraction?: boolean;
};

const STORE_KEY = '__BTHWANI_DSH_MARKETING_BANNERS__';

/**
 * Creates a Premium 2027 4:5 SVG Banner (800x1000)
 */
function createBannerDataUrl(background: string, accent: string, title: string, subtitle: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
      <defs>
        <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="${background}" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="10" flood-opacity="0.2"/>
        </filter>
      </defs>
      <rect width="800" height="1000" rx="60" fill="url(#bg)" />

      <!-- Abstract Shapes -->
      <circle cx="700" cy="150" r="200" fill="#ffffff" fill-opacity="0.08" />
      <circle cx="100" cy="850" r="250" fill="#000000" fill-opacity="0.05" />

      <!-- Premium Gloss -->
      <rect x="0" y="0" width="800" height="400" fill="#ffffff" fill-opacity="0.03" transform="skewY(-10)" />

      <!-- Composition placeholders -->
      <rect x="60" y="80" width="120" height="120" rx="60" fill="#ffffff" fill-opacity="0.9" filter="url(#shadow)" />
      <text x="120" y="152" font-family="Arial, sans-serif" font-size="40" text-anchor="middle" fill="${accent}">✨</text>

      <rect x="60" y="600" width="680" height="340" rx="40" fill="#000000" fill-opacity="0.15" />

      <text x="400" y="700" font-family="Arial, sans-serif" font-size="64" font-weight="900" text-anchor="middle" fill="#ffffff">${title}</text>
      <text x="400" y="780" font-family="Arial, sans-serif" font-size="32" font-weight="600" text-anchor="middle" fill="#ffffff" fill-opacity="0.9">${subtitle}</text>

      <rect x="250" y="850" width="300" height="70" rx="35" fill="#ffffff" filter="url(#shadow)" />
      <text x="400" y="895" font-family="Arial, sans-serif" font-size="28" font-weight="800" text-anchor="middle" fill="${accent}">اطلب الآن</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const seededBanners: MarketingBannerRecord[] = [
  {
    id: 'banner-restaurant-premium',
    title: 'وجبات عائلية',
    subtitle: 'وفر 40% على منيو العائلة اليوم من أفضل المطاعم المختارة',
    imageUrl: 'dsh.banner.home.promo-1.v1',
    mediaKey: 'dsh.banner.home.promo-1.v1',
    accentColor: '#FF500D',
    audience: 'all',
    status: 'published',
    actionType: 'main_category',
    actionTarget: 'restaurants',
    ctaLabel: 'اكتشف المطاعم',
    partnerName: 'مطاعم مختارة',
    position: 1,
    clicks: 452,
    impressions: 3200,
    updatedAt: new Date().toISOString(),
    templateId: 'restaurant_promo',
    offerBadgeText: 'خصم 40%',
    offerBadgeColor: '#ef4444',
    offerBadgePosition: 'top-right',
    partnerLogoUrl: 'dsh.store.hadda.cover.v1',
    partnerLogoPosition: 'top-left',
    titlePlacement: 'bottom',
    imageFit: 'cover',
    motionStyle: 'snap-focus',
    autoplayEnabled: true,
    autoplayIntervalMs: 4200,
    pauseOnInteraction: true,
  },
  {
    id: 'banner-grocery-express',
    title: 'مقاضي بلمح البصر',
    subtitle: 'توصيل خلال 20 دقيقة من أقرب فرع إليك بجودة عالية',
    imageUrl: 'dsh.banner.home.promo-2.v1',
    mediaKey: 'dsh.banner.home.promo-2.v1',
    accentColor: '#16a34a',
    audience: 'all',
    status: 'published',
    actionType: 'store',
    actionTarget: 'store-1001',
    ctaLabel: 'اطلب الآن',
    partnerName: 'أسواق النور',
    position: 2,
    clicks: 210,
    impressions: 1500,
    updatedAt: new Date().toISOString(),
    templateId: 'grocery_express',
    offerBadgeText: 'توصيل سريع',
    offerBadgeColor: '#3b82f6',
    offerBadgePosition: 'top-right',
    partnerLogoUrl: 'dsh.store.hittin.cover.v1',
    partnerLogoPosition: 'top-left',
    titlePlacement: 'bottom',
    imageFit: 'cover',
    motionStyle: 'slide',
    autoplayEnabled: true,
    autoplayIntervalMs: 4000,
    pauseOnInteraction: true,
  },
  {
    id: 'banner-subscription-pro',
    title: 'بثواني برو',
    subtitle: 'توصيل مجاني غير محدود لجميع طلباتك واستمتع بمزايا حصرية',
    imageUrl: 'dsh.banner.home.promo-3.v1',
    mediaKey: 'dsh.banner.home.promo-3.v1',
    accentColor: '#6366f1',
    audience: 'all',
    status: 'published',
    actionType: 'subscription',
    actionTarget: 'entitlements-get',
    ctaLabel: 'اشترك الآن',
    partnerName: 'بثواني برو',
    position: 3,
    clicks: 850,
    impressions: 5400,
    updatedAt: new Date().toISOString(),
    templateId: 'subscription_premium',
    offerBadgeText: 'أسبوع مجاني',
    offerBadgeColor: '#8b5cf6',
    offerBadgePosition: 'top-right',
    partnerLogoUrl: 'dsh.product.pasta.v1',
    partnerLogoPosition: 'top-left',
    titlePlacement: 'center',
    imageFit: 'cover',
    motionStyle: 'subtle-fade',
    autoplayEnabled: true,
    autoplayIntervalMs: 5200,
    pauseOnInteraction: true,
  },
  {
    id: 'banner-offers-showcase',
    title: 'عروض اليوم',
    subtitle: 'اكتشف المتاجر ذات العروض النشطة وادخل مباشرة إلى العرض المناسب',
    imageUrl: 'dsh.banner.home.promo-2.v1',
    mediaKey: 'dsh.banner.home.promo-2.v1',
    accentColor: '#F59E0B',
    audience: 'all',
    status: 'published',
    actionType: 'external',
    actionTarget: 'offers',
    actionExtra: 'store-1001',
    ctaLabel: 'شاهد العروض',
    partnerName: 'عروض مختارة',
    position: 4,
    clicks: 188,
    impressions: 980,
    updatedAt: new Date().toISOString(),
    templateId: 'offers_showcase',
    offerBadgeText: 'عرض نشط',
    offerBadgeColor: '#EA580C',
    offerBadgePosition: 'top-right',
    partnerLogoUrl: 'dsh.store.hadda.cover.v1',
    partnerLogoPosition: 'top-left',
    titlePlacement: 'center',
    imageFit: 'cover',
    motionStyle: 'soft-parallax',
    autoplayEnabled: true,
    autoplayIntervalMs: 4700,
    pauseOnInteraction: true,
  },
  {
    id: 'banner-store-exclusive',
    title: 'أسواق العليا الطازجة',
    subtitle: 'منتجات عضوية طازجة يومياً بأفضل الأسعار المتاحة',
    imageUrl: 'dsh.banner.home.promo-4.v1',
    mediaKey: 'dsh.banner.home.promo-4.v1',
    accentColor: '#10b981',
    audience: 'all',
    status: 'published',
    actionType: 'store',
    actionTarget: 'store-1002',
    ctaLabel: 'تسوق الآن',
    partnerName: 'أسواق العليا',
    position: 5,
    clicks: 120,
    impressions: 800,
    updatedAt: new Date().toISOString(),
    templateId: 'store_exclusive',
    offerBadgeText: 'جديد',
    offerBadgeColor: '#F59E0B',
    offerBadgePosition: 'top-right',
    partnerLogoUrl: 'dsh.store.malqa.cover.v1',
    partnerLogoPosition: 'top-left',
    titlePlacement: 'bottom',
    imageFit: 'cover',
    motionStyle: 'slide',
    autoplayEnabled: true,
    autoplayIntervalMs: 4300,
    pauseOnInteraction: true,
  },
  {
    id: 'banner-electronics-offer',
    title: 'عروض الإلكترونيات',
    subtitle: 'أحدث الأجهزة بأسعار تنافسية وضمان حقيقي لجميع المنتجات',
    imageUrl: 'dsh.banner.home.promo-5.v1',
    mediaKey: 'dsh.banner.home.promo-5.v1',
    accentColor: '#334155',
    audience: 'all',
    status: 'published',
    actionType: 'main_category',
    actionTarget: 'electronics',
    ctaLabel: 'مشاهدة العروض',
    partnerName: 'عالم التقنية',
    position: 6,
    clicks: 340,
    impressions: 2100,
    updatedAt: new Date().toISOString(),
    templateId: 'electronics_offer',
    offerBadgeText: 'عرض مؤقت',
    offerBadgeColor: '#EF4444',
    offerBadgePosition: 'top-right',
    partnerLogoUrl: 'dsh.product.choco.v1',
    partnerLogoPosition: 'top-left',
    titlePlacement: 'bottom',
    imageFit: 'cover',
    motionStyle: 'snap-focus',
    autoplayEnabled: true,
    autoplayIntervalMs: 4100,
    pauseOnInteraction: true,
  },
  {
    id: 'banner-sweets-category',
    title: 'حلويات وعصائر',
    subtitle: 'اكتشف الحلا الطازج مع تجربة بصرية أوضح وبنقرة واحدة',
    imageUrl: 'dsh.banner.home.promo-6.v1',
    mediaKey: 'dsh.banner.home.promo-6.v1',
    accentColor: '#EA580C',
    audience: 'all',
    status: 'published',
    actionType: 'sub_category',
    actionTarget: 'sweets_juices',
    actionExtra: 'sweets_juices_sweets',
    ctaLabel: 'استكشف الحلويات',
    partnerName: 'الحلا المختار',
    position: 7,
    clicks: 95,
    impressions: 620,
    updatedAt: new Date().toISOString(),
    templateId: 'sweets_category',
    offerBadgeText: 'طازج اليوم',
    offerBadgeColor: '#FB7185',
    offerBadgePosition: 'top-right',
    partnerLogoUrl: 'dsh.product.croissant.v1',
    partnerLogoPosition: 'top-left',
    titlePlacement: 'center',
    imageFit: 'cover',
    motionStyle: 'subtle-fade',
    autoplayEnabled: true,
    autoplayIntervalMs: 4600,
    pauseOnInteraction: true,
  },
  {
    id: 'banner-product-spotlight',
    title: 'طبق مختار بعناية',
    subtitle: 'منتج تجريبي يختبر مظهر الصورة والربط المباشر في نفس المسار',
    imageUrl: 'dsh.banner.home.promo-7.v1',
    mediaKey: 'dsh.banner.home.promo-7.v1',
    accentColor: '#0A2F5C',
    audience: 'all',
    status: 'published',
    actionType: 'product',
    actionTarget: 'item-pasta-1',
    actionExtra: 'store-1003',
    ctaLabel: 'افتح المنتج',
    partnerName: 'المطبخ المختار',
    position: 8,
    clicks: 203,
    impressions: 1490,
    updatedAt: new Date().toISOString(),
    templateId: 'product_spotlight',
    offerBadgeText: 'منتج مميز',
    offerBadgeColor: '#F97316',
    offerBadgePosition: 'top-right',
    partnerLogoUrl: 'dsh.product.pasta.v1',
    partnerLogoPosition: 'top-left',
    titlePlacement: 'bottom',
    imageFit: 'cover',
    motionStyle: 'soft-parallax',
    autoplayEnabled: true,
    autoplayIntervalMs: 4400,
    pauseOnInteraction: true,
  },
];

function getGlobalStore(): typeof globalThis & { [STORE_KEY]?: MarketingBannerRecord[] } {
  return globalThis as typeof globalThis & { [STORE_KEY]?: MarketingBannerRecord[] };
}

function getMutableStore(): MarketingBannerRecord[] {
  const scope = getGlobalStore();
  if (!Array.isArray(scope[STORE_KEY]) || scope[STORE_KEY]?.length === 0) {
    scope[STORE_KEY] = seededBanners.map((item) => ({ ...item }));
  }
  return scope[STORE_KEY] ?? [];
}

function setMutableStore(next: MarketingBannerRecord[]) {
  getGlobalStore()[STORE_KEY] = next;
}

export function computeMarketingBannerQuality(item: Partial<MarketingBannerRecord>): number {
  let score = 0;
  if (item.title?.trim() && item.title.length > 5) score += 20;
  if (item.subtitle?.trim() && item.subtitle.length > 10) score += 20;
  if (item.imageUrl?.trim()) score += 20;
  if (item.actionType && (item.actionType !== 'external' || item.actionTarget?.trim())) score += 15;
  if (item.actionTarget?.trim() || item.actionType === 'subscription') score += 15;
  if (item.ctaLabel?.trim()) score += 5;
  if (item.accentColor?.trim()) score += 5;
  return Math.min(100, score);
}

export function isMarketingBannerLive(item: MarketingBannerRecord, now = new Date()): boolean {
  if (item.status !== 'published') return false;
  const hour = now.getHours();
  if (typeof item.scheduleStartHour === 'number' && hour < item.scheduleStartHour) return false;
  if (typeof item.scheduleEndHour === 'number' && hour > item.scheduleEndHour) return false;
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
    impressions: items.reduce((sum, item) => sum + item.impressions, 0),
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
    imageUrl: item.imageUrl || item.mediaKey,
    accentColor: item.accentColor,
    ctaLabel: item.ctaLabel,
    templateId: item.templateId,
    offerBadgeText: item.offerBadgeText,
    offerBadgeColor: item.offerBadgeColor,
    offerBadgePosition: item.offerBadgePosition,
    partnerLogoUrl: item.partnerLogoUrl,
    partnerLogoPosition: item.partnerLogoPosition,
    overlayImageUrl: item.overlayImageUrl,
    overlayPosition: item.overlayPosition,
    overlayOpacity: item.overlayOpacity,
    titlePlacement: item.titlePlacement,
    subtitlePlacement: item.subtitlePlacement,
    ctaPlacement: item.ctaPlacement,
    imageFit: item.imageFit,
    motionStyle: item.motionStyle,
    autoplayEnabled: item.autoplayEnabled,
    autoplayIntervalMs: item.autoplayIntervalMs,
    pauseOnInteraction: item.pauseOnInteraction,
    publishStage: item.status === 'published' ? 'published-preview' : 'draft',
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
    imageUrl: item.imageUrl?.trim() || existing?.imageUrl || existing?.mediaKey || createBannerDataUrl(item.accentColor?.trim() || '#f97316', '#ea580c', item.title?.trim() || 'بنر جديد', item.subtitle?.trim() || 'أضف النص هنا'),
    mediaKey: item.mediaKey?.trim() || existing?.mediaKey,
    accentColor: item.accentColor?.trim() || existing?.accentColor || '#f97316',
    audience: item.audience || existing?.audience || 'all',
    status: item.status || existing?.status || 'draft',
    actionType: item.actionType || existing?.actionType || 'external',
    actionTarget: item.actionTarget?.trim() || existing?.actionTarget || 'stores',
    actionExtra: item.actionExtra?.trim() || existing?.actionExtra || '',
    ctaLabel: item.ctaLabel?.trim() || existing?.ctaLabel || 'افتح الآن',
    partnerName: item.partnerName?.trim() || existing?.partnerName || 'التسويق',
    position: Number.isFinite(Number(item.position)) ? Number(item.position) : existing?.position || current.length + 1,
    clicks: existing?.clicks ?? 0,
    impressions: existing?.impressions ?? 0,
    scheduleStartHour: typeof item.scheduleStartHour === 'number' ? item.scheduleStartHour : existing?.scheduleStartHour,
    scheduleEndHour: typeof item.scheduleEndHour === 'number' ? item.scheduleEndHour : existing?.scheduleEndHour,
    updatedAt: new Date().toISOString(),
    templateId: item.templateId || existing?.templateId,
    offerBadgeText: item.offerBadgeText || existing?.offerBadgeText,
    offerBadgeColor: item.offerBadgeColor || existing?.offerBadgeColor,
    offerBadgePosition: item.offerBadgePosition || existing?.offerBadgePosition,
    partnerLogoUrl: item.partnerLogoUrl || existing?.partnerLogoUrl,
    partnerLogoPosition: item.partnerLogoPosition || existing?.partnerLogoPosition,
    overlayImageUrl: item.overlayImageUrl || existing?.overlayImageUrl,
    overlayPosition: item.overlayPosition || existing?.overlayPosition,
    overlayOpacity: item.overlayOpacity || existing?.overlayOpacity,
    titlePlacement: item.titlePlacement || existing?.titlePlacement,
    subtitlePlacement: item.subtitlePlacement || existing?.subtitlePlacement,
    ctaPlacement: item.ctaPlacement || existing?.ctaPlacement,
    imageFit: item.imageFit || existing?.imageFit,
    motionStyle: item.motionStyle || existing?.motionStyle || 'slide',
    autoplayEnabled: typeof item.autoplayEnabled === 'boolean' ? item.autoplayEnabled : existing?.autoplayEnabled ?? true,
    autoplayIntervalMs: typeof item.autoplayIntervalMs === 'number' ? item.autoplayIntervalMs : existing?.autoplayIntervalMs ?? 4500,
    pauseOnInteraction: typeof item.pauseOnInteraction === 'boolean' ? item.pauseOnInteraction : existing?.pauseOnInteraction ?? true,
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
    if (item.id !== id) return item;
    return { ...item, status: item.status === 'published' ? 'draft' : 'published', updatedAt: new Date().toISOString() };
  });
  setMutableStore(next);
  return next.find((item) => item.id === id) ?? null;
}

export function duplicateMarketingBannerItem(id: string) {
  const source = getMarketingBannerItems().find((item) => item.id === id);
  if (!source) return null;
  return upsertMarketingBannerItem({ ...source, id: undefined, title: `${source.title} · نسخة`, status: 'draft', position: source.position + 1 });
}

export function removeMarketingBannerItem(id: string) {
  setMutableStore(getMarketingBannerItems().filter((item) => item.id !== id));
}

export function recordMarketingBannerClick(id: string) {
  const current = getMarketingBannerItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    return { ...item, clicks: item.clicks + 1, updatedAt: new Date().toISOString() };
  });
  setMutableStore(next);
}

export function recordMarketingBannerImpression(id: string) {
  const current = getMarketingBannerItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    return { ...item, impressions: item.impressions + 1, updatedAt: new Date().toISOString() };
  });
  setMutableStore(next);
}
