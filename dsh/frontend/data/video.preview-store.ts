/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source.
 */
export const videoStoreDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
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

const STORE_KEY = '__BTHWANI_DSH_MARKETING_VIDEO__';

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

function getGlobalStore(): typeof globalThis & { [STORE_KEY]?: MarketingVideoRecord[] } {
  return globalThis as typeof globalThis & { [STORE_KEY]?: MarketingVideoRecord[] };
}

function getMutableStore(): MarketingVideoRecord[] {
  const scope = getGlobalStore();
  if (!scope[STORE_KEY]) {
    scope[STORE_KEY] = seededVideoItems.map((item) => ({ ...item }));
  }
  return scope[STORE_KEY] ?? [];
}

function setMutableStore(next: MarketingVideoRecord[]) {
  getGlobalStore()[STORE_KEY] = next.map((item) => ({ ...item }));
}

export function getMarketingVideoItems(): MarketingVideoRecord[] {
  return [...getMutableStore()].sort((a, b) => a.order - b.order);
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
    total: items.length,
    live: live.length,
    draft: items.filter((item) => item.status === 'draft').length,
    review: items.filter((item) => item.status === 'review').length,
    impressions: live.reduce((sum, item) => sum + item.impressions, 0),
    clicks: live.reduce((sum, item) => sum + item.clicks, 0),
  };
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

  setMutableStore(next);
  return nextEntry;
}

export function toggleMarketingVideoStatus(id: string) {
  const current = getMarketingVideoItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    const nextStatus: MarketingVideoStatus = item.status === 'published' ? 'paused' : 'published';
    return { ...item, status: nextStatus };
  });
  setMutableStore(next);
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
  setMutableStore(getMarketingVideoItems().filter((item) => item.id !== id));
}
