import type {
  DshHomeCategory,
  DshHomeGetPromo,
  DshHomeGetStore,
  DshHomeRecentOrder,
} from './DshHomeGetScreen';
import { dshCategoryFixtures } from '../../categories/fixtures/dshCategoriesFixtures';

export type DshHomeScreenState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'offline'
  | 'error';

export type DshHomeStore = {
  id: string;
  name: string;
  subtitle: string;
  statusLabel: string;
  meta: string;
  etaMinutes: number;
  hasOffer?: boolean;
  isFavorite?: boolean;
};

export type DshHomePromo = {
  id: string;
  title: string;
  subtitle: string;
  actionType?: 'main_category' | 'sub_category' | 'store' | 'external' | 'store_category' | 'product' | 'subscription';
  actionTarget?: string;
  actionExtra?: string;
  accentColor?: string;
};

export const defaultCategories: DshHomeCategory[] = [
  { id: dshCategoryFixtures[0]?.id ?? 'restaurants', label: dshCategoryFixtures[0]?.label ?? 'Restaurants' },
  { id: dshCategoryFixtures[1]?.id ?? 'grocery', label: dshCategoryFixtures[1]?.label ?? 'Grocery' },
  { id: dshCategoryFixtures[2]?.id ?? 'sweets_juices', label: dshCategoryFixtures[2]?.label ?? 'Sweets & Juices' },
  { id: dshCategoryFixtures[3]?.id ?? 'anaqati', label: dshCategoryFixtures[3]?.label ?? 'Anaqati' },
];

export const defaultPromos: DshHomePromo[] = [
  {
    id: 'promo-fast-delivery',
    title: 'Fast delivery window',
    subtitle: 'Start from one store and keep the flow compact.',
    accentColor: '#FF6A00',
  },
  {
    id: 'promo-confidence',
    title: 'Confidence-first tracking',
    subtitle: 'Open orders quickly whenever confidence is needed.',
    accentColor: '#0D2F67',
  },
];

export const defaultStores: DshHomeStore[] = [
  {
    id: 'store-1001',
    name: 'Olaya Fresh Market',
    subtitle: 'Groceries and daily essentials',
    statusLabel: 'Open',
    meta: 'ETA 18 min',
    etaMinutes: 18,
    hasOffer: true,
    isFavorite: true,
  },
  {
    id: 'store-1002',
    name: 'Hittin Bakery',
    subtitle: 'Bread and pastries',
    statusLabel: 'Open',
    meta: 'ETA 25 min',
    etaMinutes: 25,
    hasOffer: false,
    isFavorite: false,
  },
  {
    id: 'store-1003',
    name: 'Malqa Kitchen',
    subtitle: 'Prepared meals',
    statusLabel: 'Busy',
    meta: 'ETA 32 min',
    etaMinutes: 32,
    hasOffer: true,
    isFavorite: false,
  },
];

export function toRecentOrders(featuredStores: DshHomeStore[]): DshHomeRecentOrder[] {
  return featuredStores.slice(0, 3).map((store, index) => ({
    id: `recent-${store.id}`,
    storeId: store.id,
    title: index === 0 ? 'آخر طلب مكتمل' : 'إعادة الطلب بسرعة',
    subtitle: store.name,
    meta: `${store.meta} · ${store.etaMinutes} دقيقة`,
    statusLabel: store.hasOffer ? 'متاح الآن' : 'جاهز للطلب',
  }));
}

export function toDiscoveryPromos(promos: DshHomePromo[]): DshHomeGetPromo[] {
  return promos.map((promo, index) => ({
    id: promo.id,
    title: index === 0 ? 'تخفيضات' : index === 1 ? 'تتبّع مباشر' : promo.title,
    subtitle:
      index === 0
        ? 'خصم 30% على أول طلب'
        : index === 1
          ? 'خطوة واحدة إلى الطلب النشط'
          : promo.subtitle,
    icon: index === 0 ? '🔥' : index === 1 ? '📍' : '✨',
    actionType: promo.actionType,
    actionTarget: promo.actionTarget,
    actionExtra: promo.actionExtra,
    accentColor: promo.accentColor ?? (index === 0 ? '#FF6A00' : index === 1 ? '#0D2F67' : '#15A26B'),
  }));
}

export function toDiscoveryStores(featuredStores: DshHomeStore[]): DshHomeGetStore[] {
  return featuredStores.map((store, index) => ({
    id: store.id,
    name: store.name,
    address: store.subtitle,
    statusLabel: store.statusLabel === 'Open' ? 'مفتوح' : store.statusLabel === 'Busy' ? 'مشغول' : store.statusLabel,
    statusTone: store.statusLabel === 'Open' ? 'open' : 'closed',
    distanceLabel: index === 0 ? '2.1 كم' : index === 1 ? '1.8 كم' : '3.5 كم',
    deliveryLabel: index === 1 ? 'كوبون' : index === 2 ? 'توصيل سريع' : 'توصيل مجاني',
    serviceLabel: index === 1 ? 'استلم بنفسك' : 'بثواني برو',
    followerCount: index === 0 ? 11000 : 9000,
    multiplierLabel: index === 0 ? 'x2' : index === 1 ? 'x1' : 'x3',
    offerLabel: store.hasOffer ? (index === 2 ? 'خصم 15%' : 'خصم 20%') : undefined,
    isFavorite: Boolean(store.isFavorite),
    isFollowing: false,
    hasOffer: store.hasOffer,
  }));
}