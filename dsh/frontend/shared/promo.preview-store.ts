
import { MarketingBannerActionType } from './banner.preview-store';

/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source.
 */
export const promoStoreDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
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

const STORE_KEY = '__BTHWANI_DSH_HOME_PROMOS__';

const seededPromos: HomePromoRecord[] = [
  {
    id: 'promo-pro-subs',
    title: 'توصيل برو',
    subtitle: 'توصيل شبه مجاني لكل طلباتك!',
    badgeText: '',
    ctaText: 'اشترك الآن!',
    accentColor: '#FFFFFF',
    imageUrl: 'dsh.mascot.robot.v1',
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
    accentColor: '#FFFFFF',
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

function getGlobalStore(): typeof globalThis & { [STORE_KEY]?: HomePromoRecord[] } {
  return globalThis as typeof globalThis & { [STORE_KEY]?: HomePromoRecord[] };
}

function getMutableStore(): HomePromoRecord[] {
  const scope = getGlobalStore();
  if (!Array.isArray(scope[STORE_KEY]) || scope[STORE_KEY]?.length === 0) {
    scope[STORE_KEY] = seededPromos.map((item) => ({ ...item }));
  }
  return scope[STORE_KEY] ?? [];
}

function setMutableStore(next: HomePromoRecord[]) {
  getGlobalStore()[STORE_KEY] = next;
}

export function getHomePromoItems(): HomePromoRecord[] {
  return [...getMutableStore()].sort((left, right) => left.order - right.order);
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
    accentColor: item.accentColor || existing?.accentColor || '#0A2F5C',
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
    setMutableStore(current.map((entry) => (entry.id === nextEntry.id ? nextEntry : entry)));
  } else {
    setMutableStore([...current, nextEntry]);
  }
  return nextEntry;
}

export function removeHomePromoItem(id: string) {
  setMutableStore(getHomePromoItems().filter((item) => item.id !== id));
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
  setMutableStore(next);
}
