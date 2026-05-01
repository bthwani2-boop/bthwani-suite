import { dshDiscoveryStores } from '../../stores/fixtures/discoveryFixtures';
import { colorPalette } from '@bthwani/ui-kit';
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

const defaultPromoAccentColors = [
  colorPalette.brand,
  colorPalette.infoStrong,
  colorPalette.success,
] as const;

function resolveDefaultPromoAccentColor(index: number) {
  return defaultPromoAccentColors[index] ?? colorPalette.success;
}

export const defaultCategories: DshHomeCategory[] = [
  ...dshCategoryFixtures.map((category) => ({
    id: category.id,
    label: category.label,
  })),
];

export const defaultPromos: DshHomePromo[] = [
  {
    id: 'promo-fast-delivery',
    title: 'نافذة توصيل سريعة',
    subtitle: 'ابدأ من متجر واحد وابقِ المسار مختصرًا.',
    accentColor: resolveDefaultPromoAccentColor(0),
  },
  {
    id: 'promo-confidence',
    title: 'تتبّع يسبق الثقة',
    subtitle: 'افتح الطلبات بسرعة عندما تحتاج إلى وضوح فوري.',
    accentColor: resolveDefaultPromoAccentColor(1),
  },
];

export const defaultStores: DshHomeStore[] = dshDiscoveryStores.map((store) => ({
  id: store.id,
  name: store.name,
  subtitle: store.subtitle,
  statusLabel: store.statusLabel,
  meta: `متوقع ${store.etaMinutes} دقيقة`,
  etaMinutes: store.etaMinutes,
  hasOffer: store.isOffer,
  isFavorite: store.isFavorite,
}));

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
    accentColor: promo.accentColor ?? resolveDefaultPromoAccentColor(index),
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
