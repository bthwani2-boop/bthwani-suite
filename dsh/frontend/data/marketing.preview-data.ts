import { ApprovalRecord, ApprovalStage, getAllApprovalRecords, getCatalogQueueRecords, getClientVisibleRecords as _getClientVisible, moveApprovalRecordToStage, upsertApprovalRecord } from '../shared/workflow';

// -----------------------------------------------------------------------------
// Marketing banners
// -----------------------------------------------------------------------------
const bannerPalette = {
  white: 'white',
  black: 'black',
  brand: 'brand',
  brandStrong: 'brandStrong',
  accentOrange: 'accentOrange',
  accentBlue: 'accentBlue',
  ink: 'ink',
  danger: 'danger',
  success: 'success',
  info: 'info',
  warning: 'warning',
} as const;

/**
 * DEV_ONLY data fixture: not runtime truth, not backend/API/binding source.
 */
export const bannerStoreDataContract = {
  dataKind: 'DEV_ONLY_FIXTURE',
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

const BANNER_STORE_KEY = '__BTHWANI_DSH_MARKETING_BANNERS__';

const seededBanners: MarketingBannerRecord[] = [
  {
    id: 'banner-restaurant-premium',
    title: 'وجبات عائلية',
    subtitle: 'وفر 40% على منيو العائلة اليوم من أفضل المطاعم المختارة',
    imageUrl: 'dsh.banner.home.promo-1.v1',
    mediaKey: 'dsh.banner.home.promo-1.v1',
    accentColor: bannerPalette.accentOrange,
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
    offerBadgeColor: bannerPalette.danger,
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
    accentColor: bannerPalette.success,
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
    offerBadgeColor: bannerPalette.info,
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
    accentColor: bannerPalette.accentBlue,
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
    offerBadgeColor: bannerPalette.accentBlue,
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
    accentColor: bannerPalette.warning,
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
    offerBadgeColor: bannerPalette.accentOrange,
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
    accentColor: bannerPalette.success,
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
    offerBadgeColor: bannerPalette.warning,
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
    accentColor: bannerPalette.ink,
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
    offerBadgeColor: bannerPalette.danger,
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
    accentColor: bannerPalette.accentOrange,
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
    offerBadgeColor: bannerPalette.danger,
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
    accentColor: bannerPalette.accentBlue,
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
    offerBadgeColor: bannerPalette.accentOrange,
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

function getBannerGlobalStore(): typeof globalThis & { [BANNER_STORE_KEY]?: MarketingBannerRecord[] } {
  return globalThis as typeof globalThis & { [BANNER_STORE_KEY]?: MarketingBannerRecord[] };
}

function getBannerMutableStore(): MarketingBannerRecord[] {
  const scope = getBannerGlobalStore();
  if (!Array.isArray(scope[BANNER_STORE_KEY]) || scope[BANNER_STORE_KEY]?.length === 0) {
    scope[BANNER_STORE_KEY] = seededBanners.map((item) => ({ ...item }));
  }
  return scope[BANNER_STORE_KEY] ?? [];
}

function setBannerMutableStore(next: MarketingBannerRecord[]) {
  getBannerGlobalStore()[BANNER_STORE_KEY] = next;
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
  return [...getBannerMutableStore()].sort((left, right) => left.position - right.position);
}

export function getMarketingBannerKpis() {
  const items = getMarketingBannerItems();
  const total = items.length;
  const published = items.filter((item) => item.status === 'published').length;
  const drafts = items.filter((item) => item.status === 'draft').length;
  const live = items.filter((item) => isMarketingBannerLive(item)).length;
  const impressions = items.reduce((sum, item) => sum + item.impressions, 0);
  const clicks = items.reduce((sum, item) => sum + item.clicks, 0);
  const ctrVal = impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) + '%' : '0%';
  return {
    total: { value: total },
    published: { value: published },
    drafts: { value: drafts },
    live: { value: live },
    impressions: { value: impressions },
    clicks: { value: clicks },
    ctr: { value: ctrVal },
  };
}

export type MarketingBannerSummary = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  status: MarketingBannerStatus;
  actionType: MarketingBannerActionType;
  impressions: number;
  clicks: number;
  position: number;
};

export function getMarketingBannerSummaries(options: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}) {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 5;
  let items = getMarketingBannerItems();

  if (options.search) {
    const q = options.search.toLowerCase();
    items = items.filter(i => i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q));
  }
  if (options.status && options.status !== 'all') {
    items = items.filter(i => i.status === options.status);
  }

  const total = items.length;
  const start = (page - 1) * pageSize;
  const paginated = items.slice(start, start + pageSize);

  return {
    items: paginated as MarketingBannerSummary[],
    total,
  };
}

export function getMarketingBannerDetail(id: string): MarketingBannerRecord | null {
  return getMarketingBannerItems().find(i => i.id === id) ?? null;
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
    imageUrl: item.imageUrl?.trim() || existing?.imageUrl || existing?.mediaKey || '',
    mediaKey: item.mediaKey?.trim() || existing?.mediaKey,
    accentColor: item.accentColor?.trim() || existing?.accentColor || bannerPalette.brand,
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
    setBannerMutableStore(current.map((entry) => (entry.id === nextEntry.id ? nextEntry : entry)));
  } else {
    setBannerMutableStore([...current, nextEntry]);
  }
  return nextEntry;
}

export function toggleMarketingBannerStatus(id: string) {
  const current = getMarketingBannerItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    return { ...item, status: (item.status === 'published' ? 'draft' : 'published') as MarketingBannerStatus, updatedAt: new Date().toISOString() };
  });
  setBannerMutableStore(next);
  return next.find((item) => item.id === id) ?? null;
}

export function duplicateMarketingBannerItem(id: string) {
  const source = getMarketingBannerItems().find((item) => item.id === id);
  if (!source) return null;
  return upsertMarketingBannerItem({ ...source, id: undefined, title: `${source.title} · نسخة`, status: 'draft', position: source.position + 1 });
}

export function removeMarketingBannerItem(id: string) {
  setBannerMutableStore(getMarketingBannerItems().filter((item) => item.id !== id));
}

export function recordMarketingBannerClick(id: string) {
  const current = getMarketingBannerItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    return { ...item, clicks: item.clicks + 1, updatedAt: new Date().toISOString() };
  });
  setBannerMutableStore(next);
}

export function recordMarketingBannerImpression(id: string) {
  const current = getMarketingBannerItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    return { ...item, impressions: item.impressions + 1, updatedAt: new Date().toISOString() };
  });
  setBannerMutableStore(next);
}

// -----------------------------------------------------------------------------
// Marketing campaigns
// -----------------------------------------------------------------------------
/**
 * DEV_ONLY data fixture: not runtime truth, not backend/API/binding source.
 */
export const campaignStoreDataContract = {
  dataKind: 'DEV_ONLY_FIXTURE',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'preview-only local display / not runtime UTC source',
  moneySemantics: 'not_applicable',
} as const;

export type CampaignStatus = 'draft' | 'pending' | 'published' | 'paused' | 'archived';
export type CampaignGoal = 'awareness' | 'conversion' | 'retention' | 'acquisition';
export type CampaignAudience = 'all' | 'client' | 'operations' | 'targeted';
export type CampaignChannel = 'banner' | 'promo' | 'video' | 'ticker' | 'store-card';
export type CampaignPlacement = 'hero' | 'feed' | 'floating' | 'banner';
export type CampaignPriority = 'low' | 'normal' | 'high' | 'critical';
export type CampaignTargetType = 'home' | 'stores' | 'store' | 'category' | 'subcategory' | 'product' | 'offer' | 'campaign' | 'search' | 'custom';

export type CampaignRecord = {
  id: string;
  title: string;
  subtitle: string;
  status: CampaignStatus;
  priority: CampaignPriority;
  goal: CampaignGoal;
  audience: CampaignAudience;
  channels: CampaignChannel[];
  placement: CampaignPlacement;
  targetType: CampaignTargetType;
  targetId: string;
  linkedBannerId?: string;
  linkedVideoId?: string;
  linkedOfferId?: string;
  linkedLoyaltyBenefitId?: string;
  startDate?: string;
  endDate?: string;
  impressions: number;
  clicks: number;
};

const CAMPAIGN_STORE_KEY = '__BTHWANI_DSH_CAMPAIGN_STORE__';

const seededCampaigns: CampaignRecord[] = [
  {
    id: 'camp-ramadan',
    title: 'حملة رمضان الكبرى',
    subtitle: 'تسليط الضوء على متاجر التمور والمقاضي الرمضانية',
    status: 'published',
    priority: 'high',
    goal: 'awareness',
    audience: 'all',
    channels: ['banner', 'promo'],
    placement: 'hero',
    targetType: 'home',
    targetId: '',
    linkedBannerId: 'banner-ramadan-1',
    impressions: 150000,
    clicks: 12000,
  },
  {
    id: 'camp-summer',
    title: 'عروض الصيف',
    subtitle: 'ترويج للمنتجات الصيفية بخصومات حصرية',
    status: 'draft',
    priority: 'normal',
    goal: 'conversion',
    audience: 'client',
    channels: ['video', 'store-card'],
    placement: 'feed',
    targetType: 'category',
    targetId: 'summer-items',
    impressions: 0,
    clicks: 0,
  }
];

function getCampaignGlobalStore(): typeof globalThis & { [CAMPAIGN_STORE_KEY]?: CampaignRecord[] } {
  return globalThis as typeof globalThis & { [CAMPAIGN_STORE_KEY]?: CampaignRecord[] };
}

function getCampaignMutableStore(): CampaignRecord[] {
  const scope = getCampaignGlobalStore();
  if (!scope[CAMPAIGN_STORE_KEY]) {
    scope[CAMPAIGN_STORE_KEY] = seededCampaigns.map((item) => ({ ...item }));
  }
  return scope[CAMPAIGN_STORE_KEY] ?? [];
}

function setCampaignMutableStore(next: CampaignRecord[]) {
  getCampaignGlobalStore()[CAMPAIGN_STORE_KEY] = next.map((item) => ({ ...item }));
}

export function getCampaignItems(): CampaignRecord[] {
  return getCampaignMutableStore();
}

export function getCampaignKpis() {
  const items = getCampaignItems();
  const total = items.length;
  const live = items.filter(item => item.status === 'published').length;
  const pending = items.filter(item => item.status === 'pending').length;
  const impressions = items.reduce((sum, item) => sum + item.impressions, 0);
  return {
    total: { value: total },
    live: { value: live },
    pending: { value: pending },
    impressions: { value: impressions },
  };
}

export type CampaignSummary = {
  id: string;
  title: string;
  subtitle: string;
  status: CampaignStatus;
  priority: CampaignPriority;
  goal: CampaignGoal;
  channels: CampaignChannel[];
  impressions: number;
  clicks: number;
};

export function getCampaignSummaries(options: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}) {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 5;
  let items = getCampaignItems();

  if (options.search) {
    const q = options.search.toLowerCase();
    items = items.filter(i => i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q));
  }
  if (options.status && options.status !== 'all') {
    items = items.filter(i => i.status === options.status);
  }

  const total = items.length;
  const start = (page - 1) * pageSize;
  const paginated = items.slice(start, start + pageSize);

  return {
    items: paginated as CampaignSummary[],
    total,
  };
}

export function getCampaignDetail(id: string): CampaignRecord | null {
  return getCampaignItems().find(i => i.id === id) ?? null;
}

export function upsertCampaignItem(item: Partial<CampaignRecord>) {
  const current = getCampaignItems();
  const nextId = item.id ?? `campaign-${Date.now()}`;
  const existing = current.find(entry => entry.id === nextId);

  const nextEntry: CampaignRecord = {
    id: nextId,
    title: item.title?.trim() || existing?.title || 'حملة تسويقية جديدة',
    subtitle: item.subtitle?.trim() || existing?.subtitle || 'وصف الحملة',
    status: item.status ?? existing?.status ?? 'draft',
    priority: item.priority ?? existing?.priority ?? 'normal',
    goal: item.goal ?? existing?.goal ?? 'awareness',
    audience: item.audience ?? existing?.audience ?? 'all',
    channels: item.channels ?? existing?.channels ?? [],
    placement: item.placement ?? existing?.placement ?? 'hero',
    targetType: item.targetType ?? existing?.targetType ?? 'home',
    targetId: item.targetId ?? existing?.targetId ?? '',
    linkedBannerId: item.linkedBannerId ?? existing?.linkedBannerId,
    linkedVideoId: item.linkedVideoId ?? existing?.linkedVideoId,
    linkedOfferId: item.linkedOfferId ?? existing?.linkedOfferId,
    linkedLoyaltyBenefitId: item.linkedLoyaltyBenefitId ?? existing?.linkedLoyaltyBenefitId,
    startDate: item.startDate ?? existing?.startDate,
    endDate: item.endDate ?? existing?.endDate,
    impressions: item.impressions ?? existing?.impressions ?? 0,
    clicks: item.clicks ?? existing?.clicks ?? 0,
  };

  const next = existing
    ? current.map(entry => (entry.id === nextEntry.id ? nextEntry : entry))
    : [nextEntry, ...current];

  setCampaignMutableStore(next);
  return nextEntry;
}

export function toggleCampaignStatus(id: string) {
  const current = getCampaignItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    return { ...item, status: item.status === 'published' ? ('paused' as const) : ('published' as const) };
  });
  setCampaignMutableStore(next);
}

export function duplicateCampaignItem(id: string) {
  const source = getCampaignItems().find(item => item.id === id);
  if (!source) return null;
  return upsertCampaignItem({
    ...source,
    id: undefined,
    title: `${source.title} — نسخة`,
    status: 'draft',
  });
}

export function removeCampaignItem(id: string) {
  setCampaignMutableStore(getCampaignItems().filter(item => item.id !== id));
}

// -----------------------------------------------------------------------------
// Home promos
// -----------------------------------------------------------------------------
const promoPalette = { white: 'white', brandStrong: 'brandStrong' } as const;

/**
 * DEV_ONLY data fixture: not runtime truth, not backend/API/binding source.
 */
export const promoStoreDataContract = {
  dataKind: 'DEV_ONLY_FIXTURE',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'preview-only local display / not runtime UTC source',
  moneySemantics: 'not_applicable',
} as const;

/**
 * Full lifecycle: draft → eligible → active → exhausted/expired/paused/archived
 * `published` is kept as a deprecated alias for `active` (backward compat).
 */
export type HomePromoStatus =
  | 'draft'
  | 'eligible'
  | 'active'
  | 'exhausted'
  | 'expired'
  | 'paused'
  | 'archived'
  | 'published'; // @deprecated — use 'active'

export type HomePromoRecord = {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  ctaText?: string;
  accentColor?: string;
  imageUrl?: string;
  thumbnail?: string;
  targetType: string;
  targetId: string;
  targetLabel: string;
  status: HomePromoStatus;
  order: number;
  audienceScope?: 'all' | 'guest' | 'customer' | 'premium';
  placement: 'home-promo';
  updatedAt: string;
};

const PROMO_STORE_KEY = '__BTHWANI_DSH_HOME_PROMOS__';

const seededPromos: HomePromoRecord[] = [
  {
    id: 'promo-pro-subs',
    title: 'توصيل برو',
    subtitle: 'توصيل شبه مجاني لكل طلباتك!',
    badgeText: '',
    ctaText: 'اشترك الآن!',
    accentColor: promoPalette.white,
    imageUrl: 'dsh.banner.home.promo-7.v1',
    thumbnail: '',
    targetType: 'subscription',
    targetId: 'entitlements-get',
    targetLabel: 'اشتراك برو',
    status: 'published',
    order: 1,
    audienceScope: 'all',
    placement: 'home-promo',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'promo-organic-fresh',
    title: 'أسواق العليا الطازجة',
    subtitle: 'منتجات عضوية طازجة يومياً',
    badgeText: '',
    ctaText: 'تسوق الآن',
    accentColor: promoPalette.white,
    imageUrl: 'dsh.banner.home.promo-4.v1',
    thumbnail: '',
    targetType: 'store',
    targetId: 'store-1002',
    targetLabel: 'أسواق العليا',
    status: 'published',
    order: 2,
    audienceScope: 'all',
    placement: 'home-promo',
    updatedAt: new Date().toISOString(),
  }
];

function getPromoGlobalStore(): typeof globalThis & { [PROMO_STORE_KEY]?: HomePromoRecord[] } {
  return globalThis as typeof globalThis & { [PROMO_STORE_KEY]?: HomePromoRecord[] };
}

function getPromoMutableStore(): HomePromoRecord[] {
  const scope = getPromoGlobalStore();
  if (!Array.isArray(scope[PROMO_STORE_KEY]) || scope[PROMO_STORE_KEY]?.length === 0) {
    scope[PROMO_STORE_KEY] = seededPromos.map((item) => ({ ...item }));
  }
  return scope[PROMO_STORE_KEY] ?? [];
}

function setPromoMutableStore(next: HomePromoRecord[]) {
  getPromoGlobalStore()[PROMO_STORE_KEY] = next;
}

export function getHomePromoItems(): HomePromoRecord[] {
  return [...getPromoMutableStore()].sort((left, right) => left.order - right.order);
}

export type HomePromoSummary = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  status: HomePromoStatus;
  targetType: string;
  order: number;
};

export function getHomePromoSummaries(options: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}) {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 5;
  let items = getHomePromoItems();

  if (options.search) {
    const q = options.search.toLowerCase();
    items = items.filter(i => i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q));
  }
  if (options.status && options.status !== 'all') {
    items = items.filter(i => i.status === options.status);
  }

  const total = items.length;
  const start = (page - 1) * pageSize;
  const paginated = items.slice(start, start + pageSize);

  return {
    items: paginated as HomePromoSummary[],
    total,
  };
}

export function getHomePromoDetail(id: string): HomePromoRecord | null {
  return getHomePromoItems().find(i => i.id === id) ?? null;
}

export function getPublishedHomePromos(): HomePromoRecord[] {
  return getHomePromoItems().filter((item) => item.status === 'active' || item.status === 'published');
}

export function isPromoClientVisible(status: HomePromoStatus): boolean {
  return status === 'active' || status === 'published';
}

export function upsertHomePromoItem(item: Partial<HomePromoRecord>) {
  const current = getHomePromoItems();
  const existing = item.id ? current.find((entry) => entry.id === item.id) : undefined;
  const nextId = item.id ?? `home-promo-${Date.now()}`;

  const nextEntry: HomePromoRecord = {
    id: nextId,
    title: item.title || existing?.title || 'برومو جديد',
    subtitle: item.subtitle || existing?.subtitle || 'وصف مختصر للبرومو',
    badgeText: item.badgeText || existing?.badgeText || '',
    ctaText: item.ctaText || existing?.ctaText || 'افتح الآن',
    accentColor: item.accentColor || existing?.accentColor || promoPalette.brandStrong,
    imageUrl: item.imageUrl || existing?.imageUrl || '',
    thumbnail: item.thumbnail || existing?.thumbnail || '',
    targetType: item.targetType || existing?.targetType || 'custom',
    targetId: item.targetId || existing?.targetId || '',
    targetLabel: item.targetLabel || existing?.targetLabel || 'وجهة مخصصة',
    status: item.status || existing?.status || 'draft' as HomePromoStatus,
    order: typeof item.order === 'number' ? item.order : existing?.order || current.length + 1,
    audienceScope: item.audienceScope || existing?.audienceScope || 'all',
    placement: 'home-promo',
    updatedAt: new Date().toISOString(),
  };

  if (existing) {
    setPromoMutableStore(current.map((entry) => (entry.id === nextEntry.id ? nextEntry : entry)));
  } else {
    setPromoMutableStore([...current, nextEntry]);
  }
  return nextEntry;
}

export function removeHomePromoItem(id: string) {
  setPromoMutableStore(getHomePromoItems().filter((item) => item.id !== id));
}

export function toggleHomePromoStatus(id: string) {
  const current = getHomePromoItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    const nextStatus: HomePromoStatus =
      item.status === 'active' || item.status === 'published' ? 'paused'
      : item.status === 'paused' ? 'active'
      : item.status === 'eligible' ? 'active'
      : 'active';
    return { ...item, status: nextStatus, updatedAt: new Date().toISOString() };
  });
  setPromoMutableStore(next);
}

// -----------------------------------------------------------------------------
// Marketing videos
// -----------------------------------------------------------------------------
/**
 * DEV_ONLY data fixture: not runtime truth, not backend/API/binding source.
 */
export const videoStoreDataContract = {
  dataKind: 'DEV_ONLY_FIXTURE',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'not_applicable',
} as const;

export type MarketingVideoStatus = 'published' | 'draft' | 'review' | 'paused';
export type MarketingVideoAudience = 'all' | 'client' | 'operations';
export type MarketingVideoSource = 'marketing' | 'partner';
export type MarketingVideoTargetType =
  | 'home'
  | 'stores'
  | 'store'
  | 'category'
  | 'subcategory'
  | 'product'
  | 'offer'
  | 'campaign'
  | 'search'
  | 'custom'
  | 'loyalty';

export type MarketingVideoRecord = {
  id: string;
  title: string;
  subtitle: string;
  status: MarketingVideoStatus;
  audience: MarketingVideoAudience;
  source: MarketingVideoSource;
  videoUrl: string;
  posterUrl: string;
  durationSeconds: number;
  mute: boolean;
  autoplay: boolean;
  loop: boolean;
  ctaLabel: string;
  highlight: string;
  targetType: MarketingVideoTargetType;
  targetId: string;
  targetExtra?: string;
  order: number;
  impressions: number;
  clicks: number;
  reviewState: 'none' | 'pending' | 'approved' | 'rejected';
};

const VIDEO_STORE_KEY = '__BTHWANI_DSH_MARKETING_VIDEO__';

const seededVideoItems: MarketingVideoRecord[] = [
  {
    id: 'video-launch-2026',
    title: 'إطلاق الهوية الجديدة 2026',
    subtitle: 'عرض مرئي للتحول الرقمي في BThwani وتجربة المستخدم المطورة.',
    status: 'published',
    audience: 'all',
    source: 'marketing',
    videoUrl: 'PREVIEW_VIDEO_PLACEHOLDER',
    posterUrl: 'PREVIEW_POSTER_PLACEHOLDER',
    durationSeconds: 15,
    mute: true,
    autoplay: true,
    loop: true,
    ctaLabel: 'اكتشف المزيد',
    highlight: 'إطلاق رسمي',
    targetType: 'home',
    targetId: 'home',
    order: 1,
    impressions: 45000,
    clicks: 1200,
    reviewState: 'approved',
  },
  {
    id: 'video-partner-food-promo',
    title: 'أشهى المأكولات مع شريكنا الذهبي',
    subtitle: 'فيديو ترويجي لقائمة الطعام الجديدة بخصومات حصرية لمستخدمي DSH.',
    status: 'published',
    audience: 'client',
    source: 'partner',
    videoUrl: 'PREVIEW_VIDEO_PLACEHOLDER',
    posterUrl: 'PREVIEW_POSTER_PLACEHOLDER',
    durationSeconds: 10,
    mute: false,
    autoplay: false,
    loop: false,
    ctaLabel: 'اطلب الآن',
    highlight: 'عرض محدود',
    targetType: 'store',
    targetId: 'store-1001',
    order: 2,
    impressions: 28000,
    clicks: 3400,
    reviewState: 'approved',
  },
  {
    id: 'video-category-fresh',
    title: 'عالم المنتجات الطازجة',
    subtitle: 'جولة سريعة في قسم الخضروات والفواكه الطازجة.',
    status: 'draft',
    audience: 'client',
    source: 'marketing',
    videoUrl: 'PREVIEW_VIDEO_PLACEHOLDER',
    posterUrl: 'PREVIEW_POSTER_PLACEHOLDER',
    durationSeconds: 12,
    mute: true,
    autoplay: true,
    loop: true,
    ctaLabel: 'تسوق الطازج',
    highlight: 'طبيعي 100%',
    targetType: 'category',
    targetId: 'grocery',
    targetExtra: 'fresh',
    order: 3,
    impressions: 0,
    clicks: 0,
    reviewState: 'none',
  },
  {
    id: 'video-loyalty-intro',
    title: 'انضم لنظام الولاء الجديد',
    subtitle: 'شرح مبسط لكيفية جمع النقاط واستبدالها بمكافآت حقيقية.',
    status: 'published',
    audience: 'all',
    source: 'marketing',
    videoUrl: 'PREVIEW_VIDEO_PLACEHOLDER',
    posterUrl: 'PREVIEW_POSTER_PLACEHOLDER',
    durationSeconds: 20,
    mute: false,
    autoplay: false,
    loop: false,
    ctaLabel: 'تعرف على المزايا',
    highlight: 'نظام النقاط',
    targetType: 'loyalty',
    targetId: 'entitlements-get',
    order: 4,
    impressions: 15000,
    clicks: 890,
    reviewState: 'approved',
  },
  {
    id: 'video-fashion-trends',
    title: 'أحدث صيحات الموضة 2026',
    subtitle: 'استكشف تشكيلة الربيع الجديدة من كبرى العلامات التجارية.',
    status: 'review',
    audience: 'client',
    source: 'partner',
    videoUrl: 'PREVIEW_VIDEO_PLACEHOLDER',
    posterUrl: 'PREVIEW_POSTER_PLACEHOLDER',
    durationSeconds: 18,
    mute: true,
    autoplay: true,
    loop: true,
    ctaLabel: 'تسوق المجموعة',
    highlight: 'وصل حديثاً',
    targetType: 'category',
    targetId: 'fashion',
    order: 5,
    impressions: 0,
    clicks: 0,
    reviewState: 'pending',
  }
];

function getVideoGlobalStore(): typeof globalThis & { [VIDEO_STORE_KEY]?: MarketingVideoRecord[] } {
  return globalThis as typeof globalThis & { [VIDEO_STORE_KEY]?: MarketingVideoRecord[] };
}

function getVideoMutableStore(): MarketingVideoRecord[] {
  const scope = getVideoGlobalStore();
  if (!scope[VIDEO_STORE_KEY]) {
    scope[VIDEO_STORE_KEY] = seededVideoItems.map((item) => ({ ...item }));
  }
  return scope[VIDEO_STORE_KEY] ?? [];
}

function setVideoMutableStore(next: MarketingVideoRecord[]) {
  getVideoGlobalStore()[VIDEO_STORE_KEY] = next.map((item) => ({ ...item }));
}

export function getMarketingVideoItems(): MarketingVideoRecord[] {
  return [...getVideoMutableStore()].sort((a, b) => a.order - b.order);
}

export function getLiveMarketingVideoItems(audience: MarketingVideoAudience | 'all' = 'all'): MarketingVideoRecord[] {
  return getMarketingVideoItems().filter((item) => {
    if (item.status !== 'published') return false;
    return audience === 'all' || item.audience === 'all' || item.audience === audience;
  });
}

export function getMarketingVideoKpis() {
  const items = getMarketingVideoItems();
  const live = items.filter((item) => item.status === 'published');
  return {
    total: { value: items.length },
    live: { value: live.length },
    draft: { value: items.filter((item) => item.status === 'draft').length },
    review: { value: items.filter((item) => item.status === 'review').length },
    impressions: { value: live.reduce((sum, item) => sum + item.impressions, 0) },
    clicks: { value: live.reduce((sum, item) => sum + item.clicks, 0) },
  };
}

export type MarketingVideoSummary = {
  id: string;
  title: string;
  subtitle: string;
  status: MarketingVideoStatus;
  audience: MarketingVideoAudience;
  videoUrl: string;
  posterUrl: string;
  order: number;
  durationSeconds: number;
  targetType: MarketingVideoTargetType;
  source: MarketingVideoSource;
};

export function getMarketingVideoSummaries(options: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}) {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 5;
  let items = getMarketingVideoItems();

  if (options.search) {
    const q = options.search.toLowerCase();
    items = items.filter(i => i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q));
  }
  if (options.status && options.status !== 'all') {
    items = items.filter(i => i.status === options.status);
  }

  const total = items.length;
  const start = (page - 1) * pageSize;
  const paginated = items.slice(start, start + pageSize);

  return {
    items: paginated as MarketingVideoSummary[],
    total,
  };
}

export function getMarketingVideoDetail(id: string): MarketingVideoRecord | null {
  return getMarketingVideoItems().find(i => i.id === id) ?? null;
}

export function upsertMarketingVideoItem(item: Partial<MarketingVideoRecord>) {
  const current = getMarketingVideoItems();
  const nextId = item.id ?? `video-${Date.now()}`;
  const existing = current.find((entry) => entry.id === nextId);

  const nextEntry: MarketingVideoRecord = {
    id: nextId,
    title: item.title?.trim() || existing?.title || 'فيديو جديد',
    subtitle: item.subtitle?.trim() || existing?.subtitle || 'وصف الفيديو التسويقي',
    status: item.status ?? existing?.status ?? 'draft',
    audience: item.audience ?? existing?.audience ?? 'client',
    source: item.source ?? existing?.source ?? 'marketing',
    videoUrl: item.videoUrl?.trim() || existing?.videoUrl || '',
    posterUrl: item.posterUrl?.trim() || existing?.posterUrl || '',
    durationSeconds: item.durationSeconds ?? existing?.durationSeconds ?? 0,
    mute: item.mute ?? existing?.mute ?? true,
    autoplay: item.autoplay ?? existing?.autoplay ?? true,
    loop: item.loop ?? existing?.loop ?? true,
    ctaLabel: item.ctaLabel?.trim() || existing?.ctaLabel || 'فتح',
    highlight: item.highlight?.trim() || existing?.highlight || '',
    targetType: item.targetType ?? existing?.targetType ?? 'home',
    targetId: item.targetId?.trim() || existing?.targetId || 'home',
    targetExtra: item.targetExtra?.trim() || existing?.targetExtra,
    order: item.order ?? existing?.order ?? current.length + 1,
    impressions: item.impressions ?? existing?.impressions ?? 0,
    clicks: item.clicks ?? existing?.clicks ?? 0,
    reviewState: item.reviewState ?? existing?.reviewState ?? 'none',
  };

  const next = existing
    ? current.map((entry) => (entry.id === nextEntry.id ? nextEntry : entry))
    : [nextEntry, ...current];

  setVideoMutableStore(next);
  return nextEntry;
}

export function toggleMarketingVideoStatus(id: string) {
  const current = getMarketingVideoItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    const nextStatus: MarketingVideoStatus = item.status === 'published' ? 'paused' : 'published';
    return { ...item, status: nextStatus };
  });
  setVideoMutableStore(next);
}

export function duplicateMarketingVideoItem(id: string) {
  const source = getMarketingVideoItems().find((item) => item.id === id);
  if (!source) return null;
  return upsertMarketingVideoItem({
    ...source,
    id: undefined,
    title: `${source.title} — نسخة`,
    status: 'draft',
    impressions: 0,
    clicks: 0,
  });
}

export function removeMarketingVideoItem(id: string) {
  setVideoMutableStore(getMarketingVideoItems().filter((item) => item.id !== id));
}

// -----------------------------------------------------------------------------
// Marketing growth
// -----------------------------------------------------------------------------
const _BRAND = 'brand' as const;

/**
 * LEGACY COMPATIBILITY:
 * 'promotion', 'subscription', 'shorts' are marked for migration.
 * Please use campaign-store.ts or partner-offer-store.ts for new commercial data ownership.
 */
/**
 * DEV_ONLY data fixture: not runtime truth, not backend/API/binding source.
 */
export const growthStoreDataContract = {
  dataKind: 'DEV_ONLY_FIXTURE',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'not_applicable',
} as const;

export type MarketingGrowthFamily = 'campaign' | /* @deprecated moved to partner-offer-store */ 'promotion' | /* @deprecated moved to loyalty-store */ 'subscription' | /* @deprecated moved to video-store */ 'shorts';
export type MarketingGrowthSource = 'marketing' | 'partner';
export type MarketingGrowthStatus = 'draft' | 'pending-marketing' | 'published' | 'paused';
export type MarketingGrowthAudience = 'all' | 'client' | 'operations';
export type MarketingGrowthRouteTarget =
  | 'home'
  | 'promo-apply'
  | 'main_category'
  | 'sub_category'
  | 'store'
// --- LEGACY COMPATIBILITY EXPORTS ---
// These are kept strictly for type compatibility across the monolithic application
// until all older consumers are fully migrated to their new respective stores.
// DO NOT use these for new commercial features.
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

const GROWTH_STORE_KEY = '__BTHWANI_DSH_MARKETING_GROWTH__';

const seededGrowthItems: MarketingGrowthRecord[] = [];

function getGrowthGlobalStore(): typeof globalThis & { [GROWTH_STORE_KEY]?: MarketingGrowthRecord[] } {
  return globalThis as typeof globalThis & { [GROWTH_STORE_KEY]?: MarketingGrowthRecord[] };
}

function getGrowthMutableStore(): MarketingGrowthRecord[] {
  const scope = getGrowthGlobalStore();
  if (!scope[GROWTH_STORE_KEY]) {
    scope[GROWTH_STORE_KEY] = seededGrowthItems.map((item) => ({ ...item }));
  }
  return scope[GROWTH_STORE_KEY] ?? [];
}

function setGrowthMutableStore(next: MarketingGrowthRecord[]) {
  getGrowthGlobalStore()[GROWTH_STORE_KEY] = next.map((item) => ({ ...item }));
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
  return sortGrowthItems(getGrowthMutableStore());
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
    accentColor: item.accentColor?.trim() || existing?.accentColor || _BRAND,
    impressions: item.impressions ?? existing?.impressions ?? 0,
    clicks: item.clicks ?? existing?.clicks ?? 0,
  };

  const next = existing
    ? current.map((entry) => (entry.id === nextEntry.id ? nextEntry : entry))
    : [nextEntry, ...current];

  setGrowthMutableStore(next);
  return nextEntry;
}

export function approveMarketingGrowthItem(id: string) {
  const current = getMarketingGrowthItems();
  const next = current.map((item) => (item.id === id ? { ...item, status: 'published' as const } : item));
  setGrowthMutableStore(next);
}

export function pauseMarketingGrowthItem(id: string) {
  const current = getMarketingGrowthItems();
  const next = current.map((item) => (item.id === id ? { ...item, status: 'paused' as const } : item));
  setGrowthMutableStore(next);
}

export function submitMarketingGrowthItem(id: string) {
  const current = getMarketingGrowthItems();
  const next = current.map((item) => (item.id === id ? { ...item, status: 'pending-marketing' as const } : item));
  setGrowthMutableStore(next);
}

export function toggleMarketingGrowthStatus(id: string) {
  const current = getMarketingGrowthItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    const nextStatus: MarketingGrowthStatus = item.status === 'published' ? 'paused' : 'published';
    return { ...item, status: nextStatus };
  });
  setGrowthMutableStore(next);
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
  setGrowthMutableStore(getMarketingGrowthItems().filter((item) => item.id !== id));
}

// --- NEW GROWTH INTELLIGENCE MODELS (PHASE 1) ---

export type GrowthRecommendationType = 'opportunity' | 'gap' | 'risk';

export type GrowthRecommendation = {
  id: string;
  type: GrowthRecommendationType;
  title: string;
  description: string;
  nextAction: string;
  actionTargetTab: 'partners' | 'campaigns' | 'loyalty' | 'video' | 'ticker';
  owner: string;
  source: string;
  affectedSurface: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: 'low' | 'medium' | 'high';
  linkedRecordId?: string;
};

export function getGrowthRecommendations(): GrowthRecommendation[] {
  return [
    {
      id: 'rec-1',
      type: 'opportunity',
      title: 'عرض شريك جاهز ولم يدخل حملة',
      description: 'يوجد عرض "خصم 20%" جاهز للتسويق، يمكن ربطه بحملة لزيادة التفاعل.',
      nextAction: 'ربط بحملة',
      actionTargetTab: 'campaigns',
      owner: 'عروض الشركاء',
      source: 'محرك التسويق',
      affectedSurface: 'واجهة الرئيسية',
      severity: 'medium',
      confidence: 'high',
      linkedRecordId: 'offer-1',
    },
    {
      id: 'rec-2',
      type: 'gap',
      title: 'فيديو جاهز بدون حملة',
      description: 'فيديو "إطلاق الهوية الجديدة" معتمد لكن لم يتم ربطه بحملة ترويجية.',
      nextAction: 'إنشاء حملة',
      actionTargetTab: 'campaigns',
      owner: 'استوديو الفيديو',
      source: 'محرك المحتوى',
      affectedSurface: 'تبويب الفيديوهات',
      severity: 'high',
      confidence: 'high',
      linkedRecordId: 'video-launch-2026',
    },
    {
      id: 'rec-3',
      type: 'risk',
      title: 'تضارب شارات بطاقة المتجر',
      description: 'متجر يعرض شارة توصيل مجاني ولكن العرض موقوف في الكتالوج.',
      nextAction: 'مراجعة عروض الشركاء',
      actionTargetTab: 'partners',
      owner: 'مزامنة الكتالوج',
      source: 'فاحص التطابق',
      affectedSurface: 'بطاقة المتجر',
      severity: 'critical',
      confidence: 'high',
    },
    {
      id: 'rec-4',
      type: 'opportunity',
      title: 'ميزة بثواني برو معطلة للمشتركين',
      description: 'يوجد مشتركين في باقة برو لم تفعل لهم الاستحقاقات.',
      nextAction: 'مراجعة الولاء',
      actionTargetTab: 'loyalty',
      owner: 'محرك الولاء',
      source: 'مزامنة الاشتراكات',
      affectedSurface: 'صفحة الدفع',
      severity: 'high',
      confidence: 'high',
    },
    {
      id: 'rec-5',
      type: 'risk',
      title: 'شارة تجارية يتيمة (Orphaned Badge)',
      description: 'تم اكتشاف شارة "خصم 50%" نشطة في البطاقة ولكن لا يوجد سجل عرض مرتبط في النظام.',
      nextAction: 'إزالة أو تصحيح العرض',
      actionTargetTab: 'partners',
      owner: 'فاحص التطابق',
      source: 'نظام التدقيق التجاري',
      affectedSurface: 'تطبيق العميل',
      severity: 'critical',
      confidence: 'high',
    },
    {
      id: 'rec-6',
      type: 'risk',
      title: 'عرض منشور لا يظهر في البطاقة',
      description: 'عرض "توصيل مجاني" في حالة النشر ولكن تم حجبه بسبب تضارب مع ميزة بثواني برو.',
      nextAction: 'حل تضارب المصادر',
      actionTargetTab: 'campaigns',
      owner: 'منسق الحملات',
      source: 'محرك القواعد',
      affectedSurface: 'بطاقة المتجر',
      severity: 'medium',
      confidence: 'high',
    }
  ];
}

// -----------------------------------------------------------------------------
// Marketing ticker
// -----------------------------------------------------------------------------
/**
 * DEV_ONLY data fixture: not runtime truth, not backend/API/binding source.
 * Seed data merged from news-ticker-fixtures.ts.
 */
export const newsTickerStoreDataContract = {
  dataKind: 'DEV_ONLY_FIXTURE',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'preview-only local display / not runtime UTC source',
  moneySemantics: 'not_applicable',
} as const;

export type MarketingNewsTickerLocale = 'ar' | 'en';

export type MarketingNewsTickerKind = 'platform' | 'order' | 'promo' | 'partner';
export type MarketingNewsTickerSeverity = 'info' | 'success' | 'warning' | 'danger';
export type MarketingNewsTickerStatus = 'draft' | 'published' | 'paused' | 'scheduled';

export type MarketingNewsTickerItem = {
  id: string;
  shortLabel?: string;
  message: string;
  kind: MarketingNewsTickerKind;
  severity: MarketingNewsTickerSeverity;
  status: MarketingNewsTickerStatus;
  source: MarketingNewsTickerSource;
  audience: MarketingNewsTickerAudience;
  deliveryMode: MarketingNewsTickerDeliveryMode;
  priority: MarketingNewsTickerPriority;
  openHour: number;
  closeHour: number;
  cooldownMinutes: number;
  repeatGapMinutes: number;
  actionTarget: string;
  actionPayload?: Record<string, unknown>;
  lastShownAt?: string | null;
};

export type MarketingNewsTickerPreview = {
  isOpen: boolean;
  statusLabel: string;
  message: string;
  windowLabel: string;
};

export type MarketingNewsTickerSource = 'operations' | 'customer' | 'marketing' | 'system' | 'partner';
export type MarketingNewsTickerAudience = 'all' | 'home' | 'order' | 'stores' | 'client' | 'operations';
export type MarketingNewsTickerDeliveryMode = 'auto' | 'manual' | 'pinned';
export type MarketingNewsTickerPriority = 'critical' | 'high' | 'normal' | 'low';
export type MarketingTickerPlanLane = 'automatic' | 'manual' | 'pinned';
export type MarketingTickerPlanState = 'active' | 'queued' | 'suppressed';
export type MarketingTickerPlanReason = 'outside-window' | 'cooldown' | 'duplicate' | 'draft' | 'audience';

export type MarketingTickerPlanEntry = {
  item: MarketingNewsTickerItem;
  lane: MarketingTickerPlanLane;
  state: MarketingTickerPlanState;
  score: number;
  reason?: MarketingTickerPlanReason;
};

export type MarketingTickerPlan = {
  activeEntry: MarketingTickerPlanEntry | null;
  activeItem: MarketingNewsTickerItem | null;
  automaticEntries: MarketingTickerPlanEntry[];
  manualEntries: MarketingTickerPlanEntry[];
  suppressedEntries: MarketingTickerPlanEntry[];
  totalCount: number;
  automaticCount: number;
  manualCount: number;
  pinnedCount: number;
  suppressedCount: number;
};

const sourceRank: Record<MarketingNewsTickerSource, number> = {
  customer: 5,
  operations: 4,
  marketing: 3,
  partner: 2,
  system: 1,
};

const priorityRank: Record<MarketingNewsTickerPriority, number> = {
  critical: 4,
  high: 3,
  normal: 2,
  low: 1,
};

const deliveryRank: Record<MarketingNewsTickerDeliveryMode, number> = {
  pinned: 3,
  auto: 2,
  manual: 1,
};

const sourceLabelByLocale: Record<MarketingNewsTickerLocale, Record<MarketingNewsTickerSource, string>> = {
  ar: {
    operations: 'العمليات',
    customer: 'العميل',
    marketing: 'التسويق',
    partner: 'الشريك',
    system: 'النظام',
  },
  en: {
    operations: 'العمليات',
    customer: 'العميل',
    marketing: 'التسويق',
    partner: 'الشريك',
    system: 'النظام',
  },
};

const audienceLabelByLocale: Record<MarketingNewsTickerLocale, Record<MarketingNewsTickerAudience, string>> = {
  ar: {
    all: 'الكل',
    home: 'الرئيسية',
    order: 'الطلب النشط',
    stores: 'المتاجر',
    client: 'العملاء',
    operations: 'العمليات',
  },
  en: {
    all: 'الكل',
    home: 'الرئيسية',
    order: 'الطلب النشط',
    stores: 'المتاجر',
    client: 'العملاء',
    operations: 'العمليات',
  },
};

const priorityLabelByLocale: Record<MarketingNewsTickerLocale, Record<MarketingNewsTickerPriority, string>> = {
  ar: {
    critical: 'حرج',
    high: 'عالٍ',
    normal: 'عادي',
    low: 'منخفض',
  },
  en: {
    critical: 'حرج',
    high: 'عالٍ',
    normal: 'عادي',
    low: 'منخفض',
  },
};

const deliveryLabelByLocale: Record<MarketingNewsTickerLocale, Record<MarketingNewsTickerDeliveryMode, string>> = {
  ar: {
    auto: 'تلقائي',
    manual: 'يدوي',
    pinned: 'مثبّت',
  },
  en: {
    auto: 'تلقائي',
    manual: 'يدوي',
    pinned: 'مثبّت',
  },
};

const planReasonLabelByLocale: Record<MarketingNewsTickerLocale, Record<MarketingTickerPlanReason, string>> = {
  ar: {
    'outside-window': 'خارج نافذة العرض',
    cooldown: 'ضمن فترة التهدئة',
    duplicate: 'مكرر',
    draft: 'مسودة',
    audience: 'الجمهور غير مطابق',
  },
  en: {
    'outside-window': 'خارج نافذة العرض',
    cooldown: 'ضمن فترة التهدئة',
    duplicate: 'مكرر',
    draft: 'مسودة',
    audience: 'الجمهور غير مطابق',
  },
};

const statusLabelByLocale: Record<MarketingNewsTickerLocale, Record<MarketingNewsTickerStatus, string>> = {
  ar: {
    draft: 'مسودة',
    published: 'منشور',
    paused: 'متوقف',
    scheduled: 'مجدول',
  },
  en: {
    draft: 'مسودة',
    published: 'منشور',
    paused: 'متوقف',
    scheduled: 'مجدول',
  },
};

const kindLabelByLocale: Record<MarketingNewsTickerLocale, Record<MarketingNewsTickerKind, string>> = {
  ar: {
    platform: 'المنصة',
    order: 'الطلب',
    promo: 'عرض',
    partner: 'الشريك',
  },
  en: {
    platform: 'المنصة',
    order: 'الطلب',
    promo: 'عرض',
    partner: 'الشريك',
  },
};

const targetLabelByLocale: Record<MarketingNewsTickerLocale, Record<string, string>> = {
  ar: {
    home: 'الرئيسية',
    orders: 'الطلبات',
    tracking: 'التتبع',
    promo: 'عرض',
  },
  en: {
    home: 'الرئيسية',
    orders: 'الطلبات',
    tracking: 'التتبع',
    promo: 'عرض',
  },
};

// Seed data (inlined from news-ticker-fixtures.ts)
export const dshMarketingNewsTickerSeed: MarketingNewsTickerItem[] = [
  {
    id: 'ticker-1',
    message: 'تمت مراجعة طلبك وسيتم تحديثك في كل مرحلة مهمة.',
    kind: 'order',
    severity: 'success',
    status: 'published',
    source: 'operations',
    audience: 'client',
    deliveryMode: 'auto',
    priority: 'critical',
    openHour: 8,
    closeHour: 23,
    cooldownMinutes: 25,
    repeatGapMinutes: 90,
    actionTarget: 'tracking',
  },
  {
    id: 'ticker-2',
    message: 'طلبك قيد التحضير الآن، وسنرسل لك التحديث عند انتقاله للمرحلة التالية.',
    kind: 'order',
    severity: 'info',
    status: 'published',
    source: 'customer',
    audience: 'client',
    deliveryMode: 'auto',
    priority: 'high',
    openHour: 8,
    closeHour: 23,
    cooldownMinutes: 20,
    repeatGapMinutes: 60,
    actionTarget: 'orders',
    lastShownAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: 'ticker-3',
    message: 'طلبك في الطريق، ويمكنك متابعة المسار أو التواصل عند الحاجة.',
    kind: 'order',
    severity: 'success',
    status: 'published',
    source: 'customer',
    audience: 'client',
    deliveryMode: 'auto',
    priority: 'high',
    openHour: 9,
    closeHour: 23,
    cooldownMinutes: 20,
    repeatGapMinutes: 60,
    actionTarget: 'tracking',
  },
  {
    id: 'ticker-4',
    message: 'خصم 20% لمدة 3 ساعات على المطعم المحدد اليوم.',
    kind: 'promo',
    severity: 'success',
    status: 'draft',
    source: 'marketing',
    audience: 'client',
    deliveryMode: 'manual',
    priority: 'normal',
    openHour: 9,
    closeHour: 12,
    cooldownMinutes: 45,
    repeatGapMinutes: 180,
    actionTarget: 'promo',
  },
  {
    id: 'ticker-5',
    message: 'قد تكون هناك صيانة مجدولة مساء اليوم، مع بقاء المسارات محفوظة للعودة إليها.',
    kind: 'platform',
    severity: 'warning',
    status: 'published',
    source: 'system',
    audience: 'all',
    deliveryMode: 'pinned',
    priority: 'critical',
    openHour: 18,
    closeHour: 23,
    cooldownMinutes: 60,
    repeatGapMinutes: 240,
    actionTarget: 'home',
  },
];

let store = dshMarketingNewsTickerSeed.map((item) => ({ ...item }));
let nextTickerId = store.length + 1;

function normalizeHour(value: number) {
  const hour = Math.floor(Number(value));
  if (!Number.isFinite(hour)) {
    return 0;
  }

  return Math.max(0, Math.min(23, hour));
}

function formatHour(hour: number) {
  return `${String(normalizeHour(hour)).padStart(2, '0')}:00`;
}

function isWithinOperatingHours(now: Date, openHour: number, closeHour: number) {
  const currentHour = now.getHours();

  if (openHour === closeHour) {
    return true;
  }

  if (openHour < closeHour) {
    return currentHour >= openHour && currentHour < closeHour;
  }

  return currentHour >= openHour || currentHour < closeHour;
}

function normalizeSource(value?: MarketingNewsTickerSource): MarketingNewsTickerSource {
  return value ?? 'marketing';
}

function normalizeAudience(value?: MarketingNewsTickerAudience): MarketingNewsTickerAudience {
  return value ?? 'all';
}

function normalizeDeliveryMode(value?: MarketingNewsTickerDeliveryMode): MarketingNewsTickerDeliveryMode {
  return value ?? 'manual';
}

function normalizePriority(value?: MarketingNewsTickerPriority): MarketingNewsTickerPriority {
  return value ?? 'normal';
}

function normalizeMinutes(value: number | string | undefined, fallback: number) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return Math.max(0, Math.floor(numericValue));
}

function minutesSince(now: Date, timestamp?: string | null) {
  if (!timestamp) {
    return Number.POSITIVE_INFINITY;
  }

  return (now.getTime() - new Date(timestamp).getTime()) / 60000;
}

function shouldApplyCooldown(now: Date, item: MarketingNewsTickerItem) {
  if (!item.lastShownAt) {
    return false;
  }

  return minutesSince(now, item.lastShownAt) < item.cooldownMinutes;
}

function getTickerFingerprint(item: MarketingNewsTickerItem) {
  return [item.source, item.audience, item.message.trim().toLowerCase()].join('::');
}

function resolveLane(item: MarketingNewsTickerItem): MarketingTickerPlanLane {
  if (item.deliveryMode === 'manual') {
    return 'manual';
  }

  if (item.deliveryMode === 'pinned') {
    return 'pinned';
  }

  return 'automatic';
}

function resolveEligibilityReason(now: Date, item: MarketingNewsTickerItem, audience: MarketingNewsTickerAudience) {
  if (item.status !== 'published') {
    return 'draft' as const;
  }

  if (!(audience === 'all' || item.audience === 'all' || item.audience === audience)) {
    return 'audience' as const;
  }

  if (!isWithinOperatingHours(now, item.openHour, item.closeHour) && item.deliveryMode !== 'manual') {
    return 'outside-window' as const;
  }

  if (shouldApplyCooldown(now, item) && item.deliveryMode !== 'manual') {
    return 'cooldown' as const;
  }

  return undefined;
}

function resolveScore(item: MarketingNewsTickerItem) {
  return (
    deliveryRank[item.deliveryMode] * 100 +
    priorityRank[item.priority] * 10 +
    sourceRank[item.source]
  );
}

function cloneTicker(item: MarketingNewsTickerItem): MarketingNewsTickerItem {
  return { ...item };
}

function normalizeTicker(item: MarketingNewsTickerItem): MarketingNewsTickerItem {
  return {
    ...item,
    source: normalizeSource(item.source),
    audience: normalizeAudience(item.audience),
    deliveryMode: normalizeDeliveryMode(item.deliveryMode),
    priority: normalizePriority(item.priority),
    openHour: normalizeHour(item.openHour),
    closeHour: normalizeHour(item.closeHour),
    cooldownMinutes: normalizeMinutes(item.cooldownMinutes, 30),
    repeatGapMinutes: normalizeMinutes(item.repeatGapMinutes, 60),
    lastShownAt: item.lastShownAt ?? null,
    message: item.message.trim() || 'رسالة شريط جديدة',
  };
}

export function getMarketingTickerItems(audience?: MarketingNewsTickerAudience): ReadonlyArray<MarketingNewsTickerItem> {
  if (!audience || audience === 'all') {
    return store.map(cloneTicker);
  }
  return store.filter(item => item.audience === 'all' || item.audience === audience).map(cloneTicker);
}

export function createMarketingTickerDraft(overrides: Partial<MarketingNewsTickerItem> = {}): MarketingNewsTickerItem {
  return {
    id: `ticker-${nextTickerId++}`,
    message: 'رسالة شريط جديدة',
    kind: 'order',
    severity: 'info',
    status: 'draft',
    source: 'customer',
    audience: 'client',
    deliveryMode: 'manual',
    priority: 'normal',
    openHour: 8,
    closeHour: 23,
    cooldownMinutes: 30,
    repeatGapMinutes: 60,
    actionTarget: 'home',
    lastShownAt: null,
    ...overrides,
  };
}

export function upsertMarketingTickerItem(item: MarketingNewsTickerItem): MarketingNewsTickerItem {
  const normalized = normalizeTicker(item);
  const index = store.findIndex((entry) => entry.id === normalized.id);

  if (index >= 0) {
    store = store.map((entry) => (entry.id === normalized.id ? normalized : entry));
  } else {
    store = [...store, normalized];
  }

  return cloneTicker(normalized);
}

export function toggleMarketingTickerStatus(id: string): MarketingNewsTickerItem | null {
  let updatedItem: MarketingNewsTickerItem | null = null;

  store = store.map((entry) => {
    if (entry.id !== id) {
      return entry;
    }

    // Requirement: draft/paused/scheduled -> published, published -> paused
    const nextStatus: MarketingNewsTickerStatus = entry.status === 'published' ? 'paused' : 'published';

    updatedItem = {
      ...entry,
      status: nextStatus,
    };

    return updatedItem;
  });

  return updatedItem ? cloneTicker(updatedItem) : null;
}

export function pauseAllMarketingTickers(): void {
  store = store.map((entry) => {
    if (entry.status === 'published' || entry.status === 'scheduled') {
      return { ...entry, status: 'paused' };
    }
    return entry;
  });
}

export function toggleMarketingTickerPinned(id: string): MarketingNewsTickerItem | null {
  let updatedItem: MarketingNewsTickerItem | null = null;

  store = store.map((entry) => {
    if (entry.id !== id) {
      return entry;
    }

    updatedItem = {
      ...entry,
      deliveryMode: entry.deliveryMode === 'pinned' ? 'auto' : 'pinned',
    };

    return updatedItem;
  });

  return updatedItem ? cloneTicker(updatedItem) : null;
}

export function removeMarketingTickerItem(id: string): void {
  store = store.filter((entry) => entry.id !== id);
}

export function markMarketingTickerDisplayed(id: string, now: Date = new Date()): MarketingNewsTickerItem | null {
  let updatedItem: MarketingNewsTickerItem | null = null;

  store = store.map((entry) => {
    if (entry.id !== id) {
      return entry;
    }

    updatedItem = {
      ...entry,
      lastShownAt: now.toISOString(),
    };

    return updatedItem;
  });

  return updatedItem ? cloneTicker(updatedItem) : null;
}

export function buildMarketingTickerPlan(
  now: Date,
  audience: MarketingNewsTickerAudience = 'all',
  items: ReadonlyArray<MarketingNewsTickerItem> = store,
): MarketingTickerPlan {
  const normalizedItems = items.map(normalizeTicker);
  const orderedItems = [...normalizedItems].sort((left, right) => {
    const laneDelta = deliveryRank[right.deliveryMode] - deliveryRank[left.deliveryMode];
    if (laneDelta !== 0) {
      return laneDelta;
    }

    const priorityDelta = priorityRank[right.priority] - priorityRank[left.priority];
    if (priorityDelta !== 0) {
      return priorityDelta;
    }

    return sourceRank[right.source] - sourceRank[left.source];
  });

  const automaticEntries: MarketingTickerPlanEntry[] = [];
  const manualEntries: MarketingTickerPlanEntry[] = [];
  const suppressedEntries: MarketingTickerPlanEntry[] = [];
  const activeFingerprints = new Set<string>();
  let activeEntry: MarketingTickerPlanEntry | null = null;

  orderedItems.forEach((item) => {
    const lane = resolveLane(item);
    const score = resolveScore(item);
    const eligibilityReason = resolveEligibilityReason(now, item, audience);
    const fingerprint = getTickerFingerprint(item);

    const entry: MarketingTickerPlanEntry = {
      item,
      lane,
      state: 'queued',
      score,
      reason: eligibilityReason,
    };

    if (lane === 'manual') {
      if (eligibilityReason) {
        entry.state = 'suppressed';
        suppressedEntries.push(entry);
      } else {
        manualEntries.push(entry);
      }

      return;
    }

    if (eligibilityReason) {
      entry.state = 'suppressed';
      suppressedEntries.push(entry);
      return;
    }

    if (activeFingerprints.has(fingerprint)) {
      entry.state = 'suppressed';
      entry.reason = 'duplicate';
      suppressedEntries.push(entry);
      return;
    }

    activeFingerprints.add(fingerprint);

    if (!activeEntry) {
      entry.state = 'active';
      activeEntry = entry;
    }

    automaticEntries.push(entry);
  });

  const activeItem = activeEntry ? (activeEntry as MarketingTickerPlanEntry).item : null;

  return {
    activeEntry,
    activeItem,
    automaticEntries,
    manualEntries,
    suppressedEntries,
    totalCount: normalizedItems.length,
    automaticCount: automaticEntries.length,
    manualCount: manualEntries.length,
    pinnedCount: normalizedItems.filter((item) => item.deliveryMode === 'pinned').length,
    suppressedCount: suppressedEntries.length,
  };
}

export function resolveMarketingTickerPreviewForItem(
  now: Date,
  item: MarketingNewsTickerItem,
  locale: MarketingNewsTickerLocale,
): MarketingNewsTickerPreview {
  const isOpen = item.status === 'published' && isWithinOperatingHours(now, item.openHour, item.closeHour);
  const isEnglish = locale === 'en';

  return {
    isOpen,
    statusLabel: item.status === 'published'
      ? isOpen
        ? isEnglish
          ? 'Live'
          : 'مباشر'
        : isEnglish
          ? 'Scheduled'
          : 'مجدول'
      : isEnglish
        ? 'Draft'
        : 'مسودة',
    message: item.message.trim() || (isEnglish ? 'New ticker message' : 'رسالة شريط جديدة'),
    windowLabel: `${formatHour(item.openHour)} - ${formatHour(item.closeHour)}`,
  };
}

export function resolveMarketingTickerSourceLabel(locale: MarketingNewsTickerLocale, source: MarketingNewsTickerSource) {
  return sourceLabelByLocale[locale][source];
}

export function resolveMarketingTickerAudienceLabel(locale: MarketingNewsTickerLocale, audience: MarketingNewsTickerAudience) {
  return audienceLabelByLocale[locale][audience];
}

export function resolveMarketingTickerPriorityLabel(locale: MarketingNewsTickerLocale, priority: MarketingNewsTickerPriority) {
  return priorityLabelByLocale[locale][priority];
}

export function resolveMarketingTickerDeliveryLabel(locale: MarketingNewsTickerLocale, deliveryMode: MarketingNewsTickerDeliveryMode) {
  return deliveryLabelByLocale[locale][deliveryMode];
}

export function resolveMarketingTickerPlanReasonLabel(locale: MarketingNewsTickerLocale, reason?: MarketingTickerPlanReason) {
  if (!reason) {
    return 'مؤهل';
  }

  return planReasonLabelByLocale[locale][reason] || planReasonLabelByLocale['ar'][reason];
}

export function resolveMarketingTickerStatusLabel(locale: MarketingNewsTickerLocale, status: MarketingNewsTickerStatus) {
  return statusLabelByLocale[locale][status];
}

export function resolveMarketingTickerKindLabel(locale: MarketingNewsTickerLocale, kind: MarketingNewsTickerKind) {
  return kindLabelByLocale[locale][kind];
}

export function resolveMarketingTickerTargetLabel(locale: MarketingNewsTickerLocale, target: string) {
  return targetLabelByLocale[locale][target] || target;
}

// -----------------------------------------------------------------------------
// Marketing media review
// -----------------------------------------------------------------------------
// =====================================================================
// marketing-review-store.ts — DSH Media & Product Review SSOT v2
// الأنواع المسموحة: product | product-media | category-suggestion | store | media-conflict
// لا تشمل: partner-offer | banner | promo | video — لها مسارات مستقلة
// يعمل الآن فوق shared workflow store فعليًا
// =====================================================================

export type MediaPolicyKind =
  | 'catalog-owned-media'
  | 'partner-owned-exception'
  | 'media-conflict'
  | 'restaurant-exception';

export type MediaReviewRecord = ApprovalRecord & {
  /** رابط الصورة/الوسيط — LTR دائماً */
  mediaKey?: string;
  /** نوع السياسة الإعلامية */
  mediaPolicy: MediaPolicyKind;
  /** المالك التالي بعد الاعتماد */
  nextOwner: 'control-panel-catalog' | 'app-partner' | 'control-panel-marketing';
  /** ملاحظة النظام */
  systemNote?: string;
};

// =====================================================================
// Mappers
// =====================================================================

function mapToMediaReview(r: ApprovalRecord): MediaReviewRecord {
  return {
    ...r,
    mediaKey: r.metadata?.mediaKey,
    mediaPolicy: (r.metadata?.mediaPolicy as MediaPolicyKind) || 'catalog-owned-media',
    nextOwner: (r.metadata?.nextOwner as MediaReviewRecord['nextOwner']) || 'control-panel-catalog',
    systemNote: r.metadata?.systemNote || r.metadata?.requiredFix || r.metadata?.rejectionReason,
  };
}

function appendMarketingSystemNote(currentNote: string | undefined, nextNote: string): string {
  if (!currentNote?.trim()) {
    return nextNote;
  }

  if (currentNote.includes(nextNote)) {
    return currentNote;
  }

  return `${nextNote} — ${currentNote}`;
}

// =====================================================================
// Selectors
// =====================================================================

export function getMediaReviewItems(): MediaReviewRecord[] {
  const entityTypes: string[] = ['product', 'product-media', 'category-suggestion', 'store'];
  const stages: string[] = ['marketing-review', 'marketing-approved', 'needs-fix', 'catalog-adopted', 'rejected'];

  return getAllApprovalRecords()
    .filter(r =>
      entityTypes.indexOf(r.entityType) >= 0 &&
      stages.indexOf(r.stage) >= 0
    )
    .map(mapToMediaReview);
}

export function getMediaReviewItem(id: string): MediaReviewRecord | undefined {
  const records = getAllApprovalRecords();
  let r: ApprovalRecord | undefined = undefined;
  for (let i = 0; i < records.length; i++) {
    if (records[i].id === id) {
      r = records[i];
      break;
    }
  }
  return r ? mapToMediaReview(r) : undefined;
}

export function getMediaReviewKpis() {
  const items = getMediaReviewItems();
  return {
    pending: items.filter(r => r.stage === 'marketing-review').length,
    approved: items.filter(r => r.stage === 'marketing-approved').length,
    needsFix: items.filter(r => r.stage === 'needs-fix').length,
    catalogReady: items.filter(r => r.stage === 'catalog-adopted').length,
    conflicts: items.filter(r => r.mediaPolicy === 'media-conflict').length,
  };
}

// =====================================================================
// Mutations — delegate to shared workflow store
// =====================================================================

export function approveMediaReviewItem(id: string): void {
  moveApprovalRecordToStage(id, 'marketing-approved', 'control-panel-marketing', 'اعتماد تسويقي');
  // Update next owner in metadata
  const item = getMediaReviewItem(id);
  if (item) {
    upsertApprovalRecord({
      id,
      metadata: {
        ...item.metadata,
        nextOwner: 'control-panel-catalog',
        systemNote: appendMarketingSystemNote(item.systemNote, 'تم اعتماد العنصر تسويقياً مع توثيق قرار المرور إلى الكتالوج.'),
      }
    });
  }
}

export function requestMediaFix(id: string, note?: string): void {
  moveApprovalRecordToStage(id, 'needs-fix', 'control-panel-marketing', 'طلب تعديل');
  const item = getMediaReviewItem(id);
  if (item) {
    upsertApprovalRecord({
      id,
      metadata: {
        ...item.metadata,
        nextOwner: 'app-partner',
        systemNote: appendMarketingSystemNote(item.systemNote, note || 'أُعيد العنصر للشريك مع ملاحظة مراجعة واضحة قبل أي ظهور جديد.'),
      }
    });
  }
}

export function rejectMediaReviewItem(id: string): void {
  moveApprovalRecordToStage(id, 'rejected', 'control-panel-marketing', 'رفض');
  const item = getMediaReviewItem(id);
  if (item) {
    upsertApprovalRecord({
      id,
      metadata: {
        ...item.metadata,
        nextOwner: 'app-partner',
        systemNote: appendMarketingSystemNote(item.systemNote, 'تم رفض العنصر تسويقياً مع حفظ مبرر يمنع ظهوره على العميل.'),
      }
    });
  }
}

export function sendMediaToCatalog(id: string): void {
  moveApprovalRecordToStage(id, 'catalog-adopted', 'control-panel-marketing', 'إرسال للكتالوج');
  const item = getMediaReviewItem(id);
  if (item) {
    upsertApprovalRecord({
      id,
      metadata: {
        ...item.metadata,
        nextOwner: 'control-panel-catalog',
        systemNote: appendMarketingSystemNote(item.systemNote, 'تم تمرير العنصر من التسويق إلى الكتالوج لتثبيت الظهور النهائي.'),
      }
    });
  }
}

export function upsertMediaReviewItem(record: Partial<MediaReviewRecord> & { id: string }): void {
  const { mediaKey, mediaPolicy, nextOwner, systemNote, ...rest } = record;
  const metadata = {
    ...rest.metadata,
    ...(mediaKey && { mediaKey }),
    ...(mediaPolicy && { mediaPolicy }),
    ...(nextOwner && { nextOwner }),
    ...(systemNote && { systemNote }),
  };
  upsertApprovalRecord({ ...rest, metadata });
}

// Legacy compat — kept for existing MarketingReviewQueue import
export { getMediaReviewItems as getMarketingReviewItems };

// -----------------------------------------------------------------------------
// Catalog adoption
// -----------------------------------------------------------------------------
// =====================================================================
// catalog-adoption-store.ts — Compatibility layer over shared workflow store
// يعرض الآن بيانات من الـ global store بدل قائمة ثابتة
// =====================================================================

/**
 * يعيد كل العناصر المؤهلة لبوابة الكتالوج:
 * marketing-approved | catalog-adopted | client-visible | needs-fix | rejected
 */
export function getCatalogAdoptionItems(): ApprovalRecord[] {
  return getCatalogQueueRecords();
}

/**
 * يعيد فقط العناصر الظاهرة للعميل
 */
export function getClientVisibleItems(): ApprovalRecord[] {
  return _getClientVisible();
}

// ── Shared Mutations ─────────────────────────────────────────────────

export function adoptCatalogCentral(id: string): void {
  moveApprovalRecordToStage(id, 'catalog-adopted', 'control-panel-catalog', 'اعتماد مركزي');
}

export function adoptCatalogException(id: string): void {
  moveApprovalRecordToStage(id, 'catalog-adopted', 'control-panel-catalog', 'استثناء شريك');
}

export function activateClientVisible(id: string): void {
  moveApprovalRecordToStage(id, 'client-visible', 'control-panel-catalog', 'تفعيل للعميل');
}

export function returnToMarketing(id: string): void {
  moveApprovalRecordToStage(id, 'marketing-review', 'control-panel-catalog', 'إعادة للتسويق');
}

export function rejectFromCatalog(id: string): void {
  moveApprovalRecordToStage(id, 'rejected', 'control-panel-catalog', 'رفض من الكتالوج');
}

// Legacy compat — kept for any direct reference to the old array
export const catalogAdoptionRecords: ApprovalRecord[] = [];

export function selectDshClientMarketingPreview() {
  return {
    banners: getMarketingBannerItems(),
    promos: getPublishedHomePromos(),
    videos: getLiveMarketingVideoItems('client'),
    ticker: getMarketingTickerItems('client'),
    growth: getLiveMarketingGrowthItems('client'),
  };
}

export function selectDshControlPanelMarketingPreview() {
  return {
    banners: getMarketingBannerItems(),
    campaigns: getCampaignItems(),
    promos: getHomePromoItems(),
    videos: getMarketingVideoItems(),
    growth: getMarketingGrowthItems(),
    ticker: getMarketingTickerItems(),
    reviewQueue: getMediaReviewItems(),
    catalogAdoption: getCatalogAdoptionItems(),
  };
}
