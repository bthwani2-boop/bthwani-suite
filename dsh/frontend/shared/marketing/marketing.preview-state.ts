import {
  ApprovalRecord,
  ApprovalStage,
  getAllApprovalRecords,
  getCatalogQueueRecords,
  getClientVisibleRecords as _getClientVisible,
  moveApprovalRecordToStage,
  upsertApprovalRecord,
} from '../../app-partner/domain/partner.workflow';

import type {
  PartnerOfferRecord,
  PartnerOfferStatus,
  PartnerOfferType,
  PartnerOfferSource,
} from '../../app-partner/domain/dsh-partner-offer-types';


import type {
  MarketingBannerRecord,
  MarketingBannerStatus,
  MarketingBannerMotionStyle,
  MarketingBannerActionType,
  MarketingBannerAudience,
  CampaignRecord,
  CampaignStatus,
  CampaignGoal,
  CampaignAudience,
  CampaignChannel,
  CampaignPlacement,
  CampaignPriority,
  CampaignTargetType,
  HomePromoRecord,
  HomePromoStatus,
  MarketingVideoRecord,
  MarketingVideoStatus,
  MarketingVideoAudience,
  MarketingVideoSource,
  MarketingVideoTargetType,
} from './marketing.types';

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

export const bannerStoreDataContract = {
  dataKind: 'DEV_ONLY_FIXTURE',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'preview-only local display / not runtime UTC source',
  moneySemantics: 'not_applicable',
} as const;

const BANNER_STORE_KEY = '__BTHWANI_DSH_MARKETING_BANNERS__';

const seededBanners: MarketingBannerRecord[] = [];

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
export const campaignStoreDataContract = {
  dataKind: 'DEV_ONLY_FIXTURE',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'preview-only local display / not runtime UTC source',
  moneySemantics: 'not_applicable',
} as const;

const CAMPAIGN_STORE_KEY = '__BTHWANI_DSH_CAMPAIGN_STORE__';

const seededCampaigns: CampaignRecord[] = [];

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

export const promoStoreDataContract = {
  dataKind: 'DEV_ONLY_FIXTURE',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'preview-only local display / not runtime UTC source',
  moneySemantics: 'not_applicable',
} as const;

const PROMO_STORE_KEY = '__BTHWANI_DSH_HOME_PROMOS__';

const seededPromos: HomePromoRecord[] = [];

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
export const videoStoreDataContract = {
  dataKind: 'DEV_ONLY_FIXTURE',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'not_applicable',
} as const;

const VIDEO_STORE_KEY = '__BTHWANI_DSH_MARKETING_VIDEO__';

const seededVideoItems: MarketingVideoRecord[] = [];

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
    subtitle: item.subtitle?.trim() || existing?.subtitle || 'وصف الفيديو الترويجي',
    status: item.status ?? existing?.status ?? 'draft',
    audience: item.audience ?? existing?.audience ?? 'client',
    source: item.source ?? existing?.source ?? 'marketing',
    videoUrl: item.videoUrl?.trim() || existing?.videoUrl || '',
    posterUrl: item.posterUrl?.trim() || existing?.posterUrl || '',
    durationSeconds: item.durationSeconds ?? existing?.durationSeconds ?? 0,
    mute: item.mute ?? existing?.mute ?? true,
    autoplay: item.autoplay ?? existing?.autoplay ?? true,
    loop: item.loop ?? existing?.loop ?? true,
    ctaLabel: item.ctaLabel?.trim() || existing?.ctaLabel || 'افتح',
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

export const growthStoreDataContract = {
  dataKind: 'DEV_ONLY_FIXTURE',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'not_applicable',
} as const;

export type MarketingGrowthFamily = 'campaign' | 'promotion' | 'subscription' | 'shorts';
export type MarketingGrowthSource = 'marketing' | 'partner';
export type MarketingGrowthStatus = 'draft' | 'pending-marketing' | 'published' | 'paused';
export type MarketingGrowthAudience = 'all' | 'client' | 'operations';
export type MarketingGrowthRouteTarget =
  | 'home'
  | 'promo-apply'
  | 'main_category'
  | 'sub_category'
  | 'store'
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
    subtitle: item.subtitle?.trim() || existing?.subtitle || 'أضف وصفاً واضحاً للمسار الترويجي.',
    family: item.family ?? existing?.family ?? 'campaign',
    status: item.status ?? existing?.status ?? 'draft',
    audience: item.audience ?? existing?.audience ?? 'client',
    source: item.source ?? existing?.source ?? 'marketing',
    routeTarget: item.routeTarget ?? existing?.routeTarget ?? 'home',
    routeTargetId: item.routeTargetId?.trim() || existing?.routeTargetId,
    routeTargetExtra: item.routeTargetExtra?.trim() || existing?.routeTargetExtra,
    ctaLabel: item.ctaLabel?.trim() || existing?.ctaLabel || 'افتح الآن',
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

// -----------------------------------------------------------------------------
// News Ticker
// -----------------------------------------------------------------------------
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
    operations: 'Operations',
    customer: 'Customer',
    marketing: 'Marketing',
    partner: 'Partner',
    system: 'System',
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
    all: 'All',
    home: 'Home',
    order: 'Active Order',
    stores: 'Stores',
    client: 'Clients',
    operations: 'Operations',
  },
};

const priorityLabelByLocale: Record<MarketingNewsTickerLocale, Record<MarketingNewsTickerPriority, string>> = {
  ar: {
    critical: 'حرج',
    high: 'عالي',
    normal: 'عادي',
    low: 'منخفض',
  },
  en: {
    critical: 'Critical',
    high: 'High',
    normal: 'Normal',
    low: 'Low',
  },
};

const deliveryLabelByLocale: Record<MarketingNewsTickerLocale, Record<MarketingNewsTickerDeliveryMode, string>> = {
  ar: {
    auto: 'تلقائي',
    manual: 'يدوي',
    pinned: 'مثبت',
  },
  en: {
    auto: 'Auto',
    manual: 'Manual',
    pinned: 'Pinned',
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
    'outside-window': 'Outside View Window',
    cooldown: 'Within Cooldown',
    duplicate: 'Duplicate',
    draft: 'Draft',
    audience: 'Audience Mismatch',
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
    draft: 'Draft',
    published: 'Published',
    paused: 'Paused',
    scheduled: 'Scheduled',
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
    platform: 'Platform',
    order: 'Order',
    promo: 'Promo',
    partner: 'Partner',
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
    home: 'Home',
    orders: 'Orders',
    tracking: 'Tracking',
    promo: 'Promo',
  },
};

export const dshMarketingNewsTickerSeed: MarketingNewsTickerItem[] = [];

let tickerStore = dshMarketingNewsTickerSeed.map((item) => ({ ...item }));
let nextTickerId = tickerStore.length + 1;

function normalizeHour(value: number) {
  const hour = Math.floor(Number(value));
  if (!Number.isFinite(hour)) return 0;
  return Math.max(0, Math.min(23, hour));
}

function formatHour(hour: number) {
  return `${String(normalizeHour(hour)).padStart(2, '0')}:00`;
}

function isWithinOperatingHours(now: Date, openHour: number, closeHour: number) {
  const currentHour = now.getHours();
  if (openHour === closeHour) return true;
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
  if (!Number.isFinite(numericValue)) return fallback;
  return Math.max(0, Math.floor(numericValue));
}

function minutesSince(now: Date, timestamp?: string | null) {
  if (!timestamp) return Number.POSITIVE_INFINITY;
  return (now.getTime() - new Date(timestamp).getTime()) / 60000;
}

function shouldApplyCooldown(now: Date, item: MarketingNewsTickerItem) {
  if (!item.lastShownAt) return false;
  return minutesSince(now, item.lastShownAt) < item.cooldownMinutes;
}

function getTickerFingerprint(item: MarketingNewsTickerItem) {
  return [item.source, item.audience, item.message.trim().toLowerCase()].join('::');
}

function resolveLane(item: MarketingNewsTickerItem): MarketingTickerPlanLane {
  if (item.deliveryMode === 'manual') return 'manual';
  if (item.deliveryMode === 'pinned') return 'pinned';
  return 'automatic';
}

function resolveEligibilityReason(now: Date, item: MarketingNewsTickerItem, audience: MarketingNewsTickerAudience) {
  if (item.status !== 'published') return 'draft' as const;
  if (!(audience === 'all' || item.audience === 'all' || item.audience === audience)) return 'audience' as const;
  if (!isWithinOperatingHours(now, item.openHour, item.closeHour) && item.deliveryMode !== 'manual') return 'outside-window' as const;
  if (shouldApplyCooldown(now, item) && item.deliveryMode !== 'manual') return 'cooldown' as const;
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
  if (!audience || audience === 'all') return tickerStore.map(cloneTicker);
  return tickerStore.filter(item => item.audience === 'all' || item.audience === audience).map(cloneTicker);
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
  const index = tickerStore.findIndex((entry) => entry.id === normalized.id);
  if (index >= 0) {
    tickerStore = tickerStore.map((entry) => (entry.id === normalized.id ? normalized : entry));
  } else {
    tickerStore = [...tickerStore, normalized];
  }
  return cloneTicker(normalized);
}

export function toggleMarketingTickerStatus(id: string): MarketingNewsTickerItem | null {
  let updatedItem: MarketingNewsTickerItem | null = null;
  tickerStore = tickerStore.map((entry) => {
    if (entry.id !== id) return entry;
    const nextStatus: MarketingNewsTickerStatus = entry.status === 'published' ? 'paused' : 'published';
    updatedItem = { ...entry, status: nextStatus };
    return updatedItem;
  });
  return updatedItem ? cloneTicker(updatedItem) : null;
}

export function pauseAllMarketingTickers(): void {
  tickerStore = tickerStore.map((entry) => {
    if (entry.status === 'published' || entry.status === 'scheduled') {
      return { ...entry, status: 'paused' };
    }
    return entry;
  });
}

export function toggleMarketingTickerPinned(id: string): MarketingNewsTickerItem | null {
  let updatedItem: MarketingNewsTickerItem | null = null;
  tickerStore = tickerStore.map((entry) => {
    if (entry.id !== id) return entry;
    updatedItem = { ...entry, deliveryMode: entry.deliveryMode === 'pinned' ? 'auto' : 'pinned' };
    return updatedItem;
  });
  return updatedItem ? cloneTicker(updatedItem) : null;
}

export function removeMarketingTickerItem(id: string): void {
  tickerStore = tickerStore.filter((entry) => entry.id !== id);
}

export function markMarketingTickerDisplayed(id: string, now: Date = new Date()): MarketingNewsTickerItem | null {
  let updatedItem: MarketingNewsTickerItem | null = null;
  tickerStore = tickerStore.map((entry) => {
    if (entry.id !== id) return entry;
    updatedItem = { ...entry, lastShownAt: now.toISOString() };
    return updatedItem;
  });
  return updatedItem ? cloneTicker(updatedItem) : null;
}

export function buildMarketingTickerPlan(
  now: Date,
  audience: MarketingNewsTickerAudience = 'all',
  items: ReadonlyArray<MarketingNewsTickerItem> = tickerStore,
): MarketingTickerPlan {
  const normalizedItems = items.map(normalizeTicker);
  const orderedItems = [...normalizedItems].sort((left, right) => {
    const laneDelta = deliveryRank[right.deliveryMode] - deliveryRank[left.deliveryMode];
    if (laneDelta !== 0) return laneDelta;
    const priorityDelta = priorityRank[right.priority] - priorityRank[left.priority];
    if (priorityDelta !== 0) return priorityDelta;
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
  if (!reason) return 'مؤهل';
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
// Marketing Media Review
// -----------------------------------------------------------------------------
export type MediaPolicyKind =
  | 'catalog-owned-media'
  | 'partner-owned-exception'
  | 'media-conflict'
  | 'restaurant-exception';

export type MediaReviewRecord = ApprovalRecord & {
  mediaKey?: string;
  mediaPolicy: MediaPolicyKind;
  nextOwner: 'control-panel-catalog' | 'app-partner' | 'control-panel-marketing';
  systemNote?: string;
};

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
  if (!currentNote?.trim()) return nextNote;
  if (currentNote.includes(nextNote)) return currentNote;
  return `${nextNote} — ${currentNote}`;
}

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

export function approveMediaReviewItem(id: string): void {
  moveApprovalRecordToStage(id, 'marketing-approved', 'control-panel-marketing', 'اعتماد تسويقي');
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

export { getMediaReviewItems as getMarketingReviewItems };

// -----------------------------------------------------------------------------
// Catalog adoption
// -----------------------------------------------------------------------------
export function getCatalogAdoptionItems(): ApprovalRecord[] {
  return getCatalogQueueRecords();
}

export function getClientVisibleItems(): ApprovalRecord[] {
  return _getClientVisible();
}

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

// -----------------------------------------------------------------------------
// Partner Offers / Promo Intent candidates
// -----------------------------------------------------------------------------
export type PartnerOfferSummary = {
  id: string;
  title: string;
  status: PartnerOfferStatus;
  partnerName: string;
};

const OFFER_STORE_KEY = '__BTHWANI_DSH_PARTNER_OFFERS__';

const seededOffers: PartnerOfferRecord[] = [];

function getOfferGlobalStore(): typeof globalThis & { [OFFER_STORE_KEY]?: PartnerOfferRecord[] } {
  return globalThis as typeof globalThis & { [OFFER_STORE_KEY]?: PartnerOfferRecord[] };
}

function getOfferMutableStore(): PartnerOfferRecord[] {
  const scope = getOfferGlobalStore();
  if (!scope[OFFER_STORE_KEY]) {
    scope[OFFER_STORE_KEY] = seededOffers.map((item) => ({ ...item }));
  }
  return scope[OFFER_STORE_KEY] ?? [];
}

function setOfferMutableStore(next: PartnerOfferRecord[]) {
  getOfferGlobalStore()[OFFER_STORE_KEY] = next.map((item) => ({ ...item }));
}

export function getPartnerOfferItems(): PartnerOfferRecord[] {
  return getOfferMutableStore();
}

export function getPartnerOfferSummaries(options: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}) {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 5;
  let items = getPartnerOfferItems();

  if (options.search) {
    const q = options.search.toLowerCase();
    items = items.filter(i => i.title.toLowerCase().includes(q) || i.partnerName.toLowerCase().includes(q));
  }
  if (options.status && options.status !== 'all') {
    items = items.filter(i => i.status === options.status);
  }

  const total = items.length;
  const start = (page - 1) * pageSize;
  const paginated = items.slice(start, start + pageSize);

  return {
    items: paginated as PartnerOfferSummary[],
    total,
  };
}

export function getPartnerOfferDetail(id: string): PartnerOfferRecord | null {
  return getPartnerOfferItems().find(i => i.id === id) ?? null;
}

export function getPartnerOfferKpis() {
  const items = getPartnerOfferItems();
  return {
    total: items.length,
    inbound: items.filter(i => i.status === 'inbound').length,
    review: items.filter(i => i.status === 'review').length,
    marketingReady: items.filter(i => i.status === 'marketing-ready').length,
    published: items.filter(i => i.status === 'published').length,
    rejected: items.filter(i => i.status === 'rejected').length,
  };
}

export function upsertPartnerOfferItem(item: Partial<PartnerOfferRecord>) {
  const current = getPartnerOfferItems();
  const nextId = item.id ?? `offer-${Date.now()}`;
  const existing = current.find(entry => entry.id === nextId);

  const nextEntry: PartnerOfferRecord = {
    id: nextId,
    title: item.title?.trim() || existing?.title || 'عرض شريك جديد',
    partnerName: item.partnerName?.trim() || existing?.partnerName || 'شريك غير معروف',
    storeId: item.storeId?.trim() || existing?.storeId || '',
    storeLabel: item.storeLabel?.trim() || existing?.storeLabel || '',
    productId: item.productId?.trim() || existing?.productId || '',
    productLabel: item.productLabel?.trim() || existing?.productLabel || '',
    category: item.category?.trim() || existing?.category || '',
    offerType: item.offerType || existing?.offerType || 'discount',
    status: item.status || existing?.status || 'inbound',
    source: item.source || existing?.source || 'partner',
    valueLabel: item.valueLabel?.trim() || existing?.valueLabel || '',
    eligibility: item.eligibility?.trim() || existing?.eligibility || '',
    displayBadge: item.displayBadge?.trim() || existing?.displayBadge || '',
    marginRiskNote: item.marginRiskNote !== undefined ? item.marginRiskNote : existing?.marginRiskNote,
    rejectionReason: item.rejectionReason !== undefined ? item.rejectionReason : existing?.rejectionReason,
    linkedCampaignId: item.linkedCampaignId !== undefined ? item.linkedCampaignId : existing?.linkedCampaignId,
    activeFromDate: item.activeFromDate !== undefined ? item.activeFromDate : existing?.activeFromDate,
    activeToDate: item.activeToDate !== undefined ? item.activeToDate : existing?.activeToDate,
  };

  const next = existing
    ? current.map(entry => (entry.id === nextEntry.id ? nextEntry : entry))
    : [nextEntry, ...current];

  setOfferMutableStore(next);
  return nextEntry;
}

export function togglePartnerOfferStatus(id: string) {
  const current = getPartnerOfferItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    const nextStatus: PartnerOfferStatus = item.status === 'published' ? 'paused' : 'published';
    return { ...item, status: nextStatus };
  });
  setOfferMutableStore(next);
}

export function approvePartnerOfferItem(id: string): void {
  const current = getPartnerOfferItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    return { ...item, status: 'marketing-ready' as PartnerOfferStatus };
  });
  setOfferMutableStore(next);
}

export function publishPartnerOfferItem(id: string): void {
  const current = getPartnerOfferItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    return { ...item, status: 'published' as PartnerOfferStatus };
  });
  setOfferMutableStore(next);
}

export function pausePartnerOfferItem(id: string): void {
  const current = getPartnerOfferItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    return { ...item, status: 'paused' as PartnerOfferStatus };
  });
  setOfferMutableStore(next);
}

export function rejectPartnerOfferItem(id: string, reason: string): void {
  const current = getPartnerOfferItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    return { ...item, status: 'rejected' as PartnerOfferStatus, rejectionReason: reason };
  });
  setOfferMutableStore(next);
}

export function archivePartnerOfferItem(id: string): void {
  const current = getPartnerOfferItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    return { ...item, status: 'archived' as PartnerOfferStatus };
  });
  setOfferMutableStore(next);
}

export function removePartnerOfferItem(id: string) {
  setOfferMutableStore(getPartnerOfferItems().filter(item => item.id !== id));
}

// -----------------------------------------------------------------------------
// Loyalty & Subscriptions
// -----------------------------------------------------------------------------
export type Entitlement = {
  id: string;
  name?: string;
  description?: string;
  status: 'active' | 'expired' | 'pending';
  type: 'subscription' | 'loyalty-tier' | 'loyalty-reward' | 'partner-benefit';
  referenceId: string;
  source: 'subscription' | 'loyalty' | 'promotion';
};

export type LoyaltyProgram = {
  id: string;
  name: string;
  pointsRate?: number;
  minPointsToRedeem?: number;
  description?: string;
};

export type LoyaltyReward = {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  pointsCost: number;
  status: string;
};

export type LoyaltyTier = {
  id: string;
  name: string;
  minPoints?: number;
  minimumPoints?: number;
  benefits?: any[];
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  price?: string;
  monthlyFee: number;
  periodMonths?: number;
  features: string[];
  status: 'draft' | 'active' | 'paused' | 'expired' | 'cancelled';
  tier?: 'weekly' | 'monthly' | 'family';
  weeklyFee?: number;
};

const seededEntitlements: Entitlement[] = [];
const seededLoyaltyPrograms: LoyaltyProgram[] = [];
const seededLoyaltyRewards: LoyaltyReward[] = [];
const seededLoyaltyTiers: LoyaltyTier[] = [];
const seededSubscriptionPlans: SubscriptionPlan[] = [];

export function getEntitlements(): Entitlement[] { return seededEntitlements; }
export function getLoyaltyPrograms(): LoyaltyProgram[] { return seededLoyaltyPrograms; }
export function getLoyaltyRewards(): LoyaltyReward[] { return seededLoyaltyRewards; }
export function getLoyaltyTiers(): LoyaltyTier[] { return seededLoyaltyTiers; }
export function getSubscriptionPlans(): SubscriptionPlan[] { return seededSubscriptionPlans; }

export function getLoyaltyKpis() {
  return {
    total: 0,
    active: 0,
    subscriptions: 0,
    points: 0,
    impressions: 0,
    clicks: 0,
  };
}
