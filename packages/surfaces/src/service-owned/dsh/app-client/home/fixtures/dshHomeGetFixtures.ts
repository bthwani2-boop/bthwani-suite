import { dshDiscoveryStores, type DshDiscoveryStore } from '../../stores/fixtures/discoveryFixtures';

export type DshHomeGetFixtureProduct = {
  id: string;
  name: string;
  mediaKey: string;
};
export type DshHomeGetFixturePromo = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  actionType?: 'main_category' | 'sub_category' | 'store' | 'external' | 'store_category' | 'product' | 'subscription';
  actionTarget?: string;
  actionExtra?: string;
  imageUrl?: string;
  accentColor?: string;
};

export type DshHomeGetFixtureStore = {
  id: string;
  name: string;
  address: string;
  categoryId?: string;
  statusLabel: string;
  statusTone: 'open' | 'closed';
  distanceLabel: string;
  deliveryLabel: string;
  serviceLabel: string;
  followerCount: number;
  multiplierLabel: string;
  offerLabel?: string;
  isFavorite: boolean;
  isFollowing: boolean;
  hasOffer?: boolean;
  rating?: number;
  mediaKey?: string;

  imageUri?: string;
  hasBthwaniPro?: boolean;
  subscriptionPackageChips?: string[];
  hasCouponAvailable?: boolean;
  hasNewProducts?: boolean;
};

function formatDistanceLabel(distanceKm: number) {
  return `${distanceKm.toFixed(1).replace(/\.0$/, '')} كم`;
}

function toDshHomeGetFixtureStore(store: DshDiscoveryStore): DshHomeGetFixtureStore {
  return {
    id: store.id,
    name: store.name,
    address: store.subtitle,
    categoryId: 'restaurants',
    statusLabel: store.statusLabel,
    statusTone: store.statusLabel === 'مفتوح' ? 'open' : 'closed',
    distanceLabel: formatDistanceLabel(store.distanceKm),
    deliveryLabel: store.deliveryLabel,
    serviceLabel: store.serviceLabel,
    followerCount: store.followerCount,
    multiplierLabel: store.multiplierLabel,
    offerLabel: store.offerLabel,
    isFavorite: store.isFavorite,
    isFollowing: store.isFollowing,
    hasOffer: store.isOffer,
    rating: store.rating,
    mediaKey: store.mediaKey,
    imageUri: store.imageUri,
    hasBthwaniPro: store.hasBthwaniPro,
    subscriptionPackageChips: store.subscriptionPackageChips,
    hasCouponAvailable: store.hasCouponAvailable,
    hasNewProducts: store.hasNewProducts,
  };
}

export type DshHomeGetFixtureTickerBanner = {
  id: string;
  openHour: number;
  closeHour: number;
  openStatusLabel: string;
  closedStatusLabel: string;
  openMessage: string;
  closedMessage: string;
};

export const dshHomeGetFixtureTickerBanner: DshHomeGetFixtureTickerBanner = {
  id: 'dsh-home-ticker-banner',
  openHour: 8,
  closeHour: 23,
  openStatusLabel: 'مباشر',
  closedStatusLabel: 'مغلق',
  openMessage: 'المساحة مخصصة للشريط الإخباري • اطلب إلى المنزل أو افتح الطلب النشط خلال خطوة واحدة',
  closedMessage: 'خارج الدوام تظهر المساحة مغلقة مع بقاء المسارات محفوظة للعودة لاحقًا',
};

export const dshHomeGetFixturePromos: DshHomeGetFixturePromo[] = [
  {
    id: 'promo-1',
    mediaKey: 'dsh.banner.home.promo-1.v1',
    title: 'تخفيضات',
    subtitle: 'خصم 30% على أول طلب',
    icon: '🔥',
    accentColor: '#ff9b33',
    actionType: 'main_category',
    actionTarget: 'restaurants',
  },
  {
    id: 'promo-2',
    mediaKey: 'dsh.banner.home.promo-2.v1',
    title: 'تتبّع مباشر',
    subtitle: 'افتح الطلب النشط دون ضياع المسار',
    icon: '📍',
    accentColor: '#2557c9',
    actionType: 'store',
    actionTarget: 'store-1001',
  },
  {
    id: 'promo-3',
    mediaKey: 'dsh.banner.home.promo-3.v1',
    title: 'الفئات المختارة',
    subtitle: 'فئات قصيرة ومباشرة من نفس الواجهة',
    icon: '✨',
    accentColor: '#ff6a6a',
    actionType: 'sub_category',
    actionTarget: 'grocery',
    actionExtra: 'grocery_vegetables_fruits',
  },
  {
    id: 'promo-4',
    mediaKey: 'dsh.banner.home.promo-4.v1',
    title: 'متجر مباشر',
    subtitle: 'افتح المتجر ثم تابع إلى القائمة',
    icon: '🏪',
    accentColor: '#0d2f67',
    actionType: 'store',
    actionTarget: 'store-1002',
  },
  {
    id: 'promo-5',
    mediaKey: 'dsh.banner.home.promo-5.v1',
    title: 'منتج مباشر',
    subtitle: 'افتح المنتج الجاهز للتفاعل',
    icon: '📦',
    accentColor: '#f54747',
    actionType: 'product',
    actionTarget: 'item-apple-1',
    actionExtra: 'store-1001',
  },
  {
    id: 'promo-6',
    mediaKey: 'dsh.banner.home.promo-6.v1',
    title: 'قائمة المتاجر',
    subtitle: 'واجهة تجمع كل المتاجر القريبة',
    icon: '🛍️',
    accentColor: '#15a26b',
    actionType: 'external',
    actionTarget: 'DshStoresList',
  },
  {
    id: 'promo-7',
    mediaKey: 'dsh.banner.home.promo-7.v1',
    title: 'اشتراك مميز',
    subtitle: 'اعرض فوائد الاشتراك مباشرة',
    icon: '⭐',
    accentColor: '#7a4fff',
    actionType: 'subscription',
  },
];

export const dshHomeGetFixtureProducts: DshHomeGetFixtureProduct[] = [
  {
    id: 'home-product-1',
    name: 'apple',
    mediaKey: 'dsh.product.apple.v1',
  },
  {
    id: 'home-product-2',
    name: 'bread',
    mediaKey: 'dsh.product.bread.v1',
  },
  {
    id: 'home-product-3',
    name: 'chicken',
    mediaKey: 'dsh.product.chicken.v1',
  },
  {
    id: 'home-product-4',
    name: 'choco',
    mediaKey: 'dsh.product.choco.v1',
  },
  {
    id: 'home-product-5',
    name: 'croissant',
    mediaKey: 'dsh.product.croissant.v1',
  },
  {
    id: 'home-product-6',
    name: 'milk',
    mediaKey: 'dsh.product.milk.v1',
  },
  {
    id: 'home-product-7',
    name: 'pasta',
    mediaKey: 'dsh.product.pasta.v1',
  },
  {
    id: 'home-product-8',
    name: 'roll',
    mediaKey: 'dsh.product.roll.v1',
  },
  {
    id: 'home-product-9',
    name: 'salad',
    mediaKey: 'dsh.product.salad.v1',
  },
  {
    id: 'home-product-10',
    name: 'yogurt',
    mediaKey: 'dsh.product.yogurt.v1',
  },
];

export const dshHomeGetFixtureStores: DshHomeGetFixtureStore[] = dshDiscoveryStores.map(toDshHomeGetFixtureStore);
    id: 'store-2001',
    name: 'سوبر ماركت النور',
    address: 'حي النصر، شارع الستين',
    categoryId: 'grocery',
    statusLabel: 'مفتوح',
    statusTone: 'open',
    distanceLabel: '2.9 كم',
    deliveryLabel: 'توصيل سريع',
    serviceLabel: 'توصيل برو',
    followerCount: 7600,
    multiplierLabel: 'x2',
    offerLabel: 'خصم 10%',
    isFavorite: false,
    isFollowing: true,
    hasOffer: true,
    rating: 2.8,
    mediaKey: 'dsh.store.hadda.cover.v1',

    imageUri: '',
    hasBthwaniPro: true,
    subscriptionPackageChips: ['توصيل سريع', 'عروض يومية'],
    hasCouponAvailable: true,
    hasNewProducts: true,
  },
  {
    id: 'store-2002',
    name: 'خيرات المدينة',
    address: 'شارع الجامعة، باب اليمن',
    categoryId: 'grocery',
    statusLabel: 'مفتوح',
    statusTone: 'open',
    distanceLabel: '1.6 كم',
    deliveryLabel: 'توصيل مجاني',
    serviceLabel: 'توصيل برو',
    followerCount: 5400,
    multiplierLabel: 'x1',
    isFavorite: true,
    isFollowing: false,
    hasOffer: false,
    rating: 3.9,
    mediaKey: 'dsh.store.hittin.cover.v1',

    imageUri: '',
    hasBthwaniPro: true,
    subscriptionPackageChips: ['توصيل مجاني', 'مقاضي يومية'],
    hasCouponAvailable: false,
    hasNewProducts: false,
  },
  {
    id: 'store-2101',
    name: 'عصائر الساحة',
    address: 'حي الحصبة، شارع الأربعين',
    categoryId: 'sweets_juices',
    statusLabel: 'مفتوح',
    statusTone: 'open',
    distanceLabel: '2.2 كم',
    deliveryLabel: 'توصيل سريع',
    serviceLabel: 'توصيل برو',
    followerCount: 3200,
    multiplierLabel: 'x1',
    offerLabel: 'عرض 15%',
    isFavorite: false,
    isFollowing: false,
    hasOffer: true,
    rating: 4.1,
    mediaKey: 'dsh.store.malqa.cover.v1',

    imageUri: '',
    hasBthwaniPro: false,
    subscriptionPackageChips: ['عصائر طازجة', 'حلويات'],
    hasCouponAvailable: true,
    hasNewProducts: true,
  },
  {
    id: 'store-2102',
    name: 'حلويات البلدة',
    address: 'شارع الستين الجنوبي',
    categoryId: 'sweets_juices',
    statusLabel: 'مفتوح',
    statusTone: 'open',
    distanceLabel: '3.1 كم',
    deliveryLabel: 'توصيل مجاني',
    serviceLabel: 'توصيل برو',
    followerCount: 4100,
    multiplierLabel: 'x2',
    isFavorite: true,
    isFollowing: true,
    hasOffer: false,
    rating: 3.6,
    mediaKey: 'dsh.store.hadda.cover.v1',

    imageUri: '',
    hasBthwaniPro: true,
    subscriptionPackageChips: ['حلويات', 'آيسكريم'],
    hasCouponAvailable: false,
    hasNewProducts: false,
  },
  {
    id: 'store-2201',
    name: 'أناقتي بوتيك',
    address: 'شارع بغداد، قرب المجمع',
    categoryId: 'anaqati',
    statusLabel: 'مفتوح',
    statusTone: 'open',
    distanceLabel: '4.0 كم',
    deliveryLabel: 'توصيل سريع',
    serviceLabel: 'توصيل برو',
    followerCount: 2800,
    multiplierLabel: 'x1',
    offerLabel: 'عرض موسمي',
    isFavorite: false,
    isFollowing: true,
    hasOffer: true,
    rating: 2.7,
    mediaKey: 'dsh.store.hittin.cover.v1',

    imageUri: '',
    hasBthwaniPro: false,
    subscriptionPackageChips: ['عطور', 'ملابس'],
    hasCouponAvailable: true,
    hasNewProducts: true,
  },
  {
    id: 'store-2202',
    name: 'جمال الورد',
    address: 'حي الشهداء، أمام الحدائق',
    categoryId: 'anaqati',
    statusLabel: 'مغلق',
    statusTone: 'closed',
    distanceLabel: '5.1 كم',
    deliveryLabel: 'توصيل مجاني',
    serviceLabel: 'توصيل برو',
    followerCount: 2500,
    multiplierLabel: 'x1',
    isFavorite: true,
    isFollowing: false,
    hasOffer: false,
    rating: 4.0,
    mediaKey: 'dsh.store.malqa.cover.v1',

    imageUri: '',
    hasBthwaniPro: true,
    subscriptionPackageChips: ['إكسسوارات', 'تجميل'],
    hasCouponAvailable: false,
    hasNewProducts: false,
  },
  {
    id: 'store-2301',
    name: 'بثواني ستور',
    address: 'المركز الرئيسي، شارع الستين',
    categoryId: 'bthwani_store',
    statusLabel: 'مفتوح',
    statusTone: 'open',
    distanceLabel: '1.2 كم',
    deliveryLabel: 'توصيل مجاني',
    serviceLabel: 'توصيل برو',
    followerCount: 9800,
    multiplierLabel: 'x3',
    offerLabel: 'أولوية',
    isFavorite: true,
    isFollowing: true,
    hasOffer: true,
    rating: 5,
    mediaKey: 'dsh.store.hadda.cover.v1',

    imageUri: '',
    hasBthwaniPro: true,
    subscriptionPackageChips: ['منتجات مختارة', 'أولوية'],
    hasCouponAvailable: true,
    hasNewProducts: true,
  },
  {
    id: 'store-2401',
    name: 'مشاريع البيت',
    address: 'حي الصافية، شارع الحرية',
    categoryId: 'home_projects',
    statusLabel: 'مفتوح',
    statusTone: 'open',
    distanceLabel: '6.4 كم',
    deliveryLabel: 'توصيل سريع',
    serviceLabel: 'توصيل برو',
    followerCount: 1500,
    multiplierLabel: 'x1',
    isFavorite: false,
    isFollowing: false,
    hasOffer: false,
    rating: 3.1,
    mediaKey: 'dsh.store.hittin.cover.v1',

    imageUri: '',
    hasBthwaniPro: false,
    subscriptionPackageChips: ['أسر منتجة', 'منتجات منزلية'],
    hasCouponAvailable: false,
    hasNewProducts: true,
  },
  {
    id: 'store-2501',
    name: 'تعبئة الأمان',
    address: 'جولة الستين، مقابل المحطة',
    categoryId: 'gas_refill',
    statusLabel: 'مفتوح',
    statusTone: 'open',
    distanceLabel: '3.8 كم',
    deliveryLabel: 'خدمة ميدانية',
    serviceLabel: 'توصيل برو',
    followerCount: 1900,
    multiplierLabel: 'x1',
    offerLabel: 'زيارة اليوم',
    isFavorite: false,
    isFollowing: true,
    hasOffer: true,
    rating: 4.2,
    mediaKey: 'dsh.store.malqa.cover.v1',

    imageUri: '',
    hasBthwaniPro: false,
    subscriptionPackageChips: ['تعبئة', 'إصلاح'],
    hasCouponAvailable: false,
    hasNewProducts: false,
  },
  {
    id: 'store-2601',
    name: 'قطع الغيار السريعة',
    address: 'شارع الجزائر، الصناعية',
    categoryId: 'spare_parts',
    statusLabel: 'مفتوح',
    statusTone: 'open',
    distanceLabel: '5.0 كم',
    deliveryLabel: 'توصيل سريع',
    serviceLabel: 'توصيل برو',
    followerCount: 2400,
    multiplierLabel: 'x2',
    isFavorite: false,
    isFollowing: false,
    hasOffer: false,
    rating: 3.0,
    mediaKey: 'dsh.store.hadda.cover.v1',

    imageUri: '',
    hasBthwaniPro: true,
    subscriptionPackageChips: ['قطع غيار', 'إكسسوارات'],
    hasCouponAvailable: false,
    hasNewProducts: true,
  },
  {
    id: 'store-2701',
    name: 'العسل والتمر الأصيلة',
    address: 'حي شعوب، شارع الأربعين',
    categoryId: 'honey_dates',
    statusLabel: 'مفتوح',
    statusTone: 'open',
    distanceLabel: '4.7 كم',
    deliveryLabel: 'توصيل مجاني',
    serviceLabel: 'توصيل برو',
    followerCount: 3100,
    multiplierLabel: 'x1',
    offerLabel: 'صنف مميز',
    isFavorite: true,
    isFollowing: true,
    hasOffer: true,
    rating: 4.4,
    mediaKey: 'dsh.store.hittin.cover.v1',

    imageUri: '',
    hasBthwaniPro: true,
    subscriptionPackageChips: ['عسل', 'تمور'],
    hasCouponAvailable: true,
    hasNewProducts: false,
  },
  {
    id: 'store-2801',
    name: 'تقنية 24',
    address: 'شارع خولان، بجانب الجامعة',
    categoryId: 'electronics',
    statusLabel: 'مغلق',
    statusTone: 'closed',
    distanceLabel: '7.2 كم',
    deliveryLabel: 'توصيل سريع',
    serviceLabel: 'توصيل برو',
    followerCount: 2700,
    multiplierLabel: 'x2',
    isFavorite: false,
    isFollowing: false,
    hasOffer: false,
    rating: 2.5,
    mediaKey: 'dsh.store.malqa.cover.v1',

    imageUri: '',
    hasBthwaniPro: false,
    subscriptionPackageChips: ['إلكترونيات', 'إكسسوارات'],
    hasCouponAvailable: false,
    hasNewProducts: true,
  },
];


