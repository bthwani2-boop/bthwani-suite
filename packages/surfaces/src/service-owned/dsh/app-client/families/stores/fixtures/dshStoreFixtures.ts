export type DshDiscoveryStore = {
  id: string;
  name: string;
  subtitle: string;
  statusLabel: string;
  meta: string;
  etaMinutes: number;
  distanceKm: number;
  rating: number;
  isOffer: boolean;
  isFavorite: boolean;
  isFollowing: boolean;
  imageUri: string;
  deliveryLabel: string;
  serviceLabel: string;
  followerCount: number;
  multiplierLabel: string;
  subscriptionPackageChips: string[];
  offerLabel?: string;
  hasBthwaniPro: boolean;
  hasNewProducts: boolean;
  hasCouponAvailable: boolean;
  supportsPickup: boolean;
  supportsPartnerDelivery: boolean;
};

export type DshStoreFixtureItem = {
  id: string;
  name: string;
  subtitle: string;
  priceLabel: string;
  oldPriceLabel?: string;
  discountLabel?: string;
  measurementType?: 'piece' | 'weight' | 'portion';
  measurementOptions?: string[];
  categoryId: string;
  categoryLabel: string;
  statusLabel?: string;
  isAvailable?: boolean;
  hasOptions?: boolean;
  preparationTime?: string;
  imageUri?: string;
};

function createFixtureImageUrl(background: string, foreground: string, label: string) {
  const bg = background.replace('#', '');
  const fg = foreground.replace('#', '');
  return `https://placehold.co/900x700/${bg}/${fg}.png?text=${encodeURIComponent(label)}`;
}

export const dshDiscoveryStores: DshDiscoveryStore[] = [
  {
    id: 'store-1001',
    name: 'أسواق العليا الطازجة',
    subtitle: 'حي العليا • الرياض',
    statusLabel: 'مفتوح',
    meta: '18 دقيقة',
    etaMinutes: 18,
    distanceKm: 2.1,
    rating: 5,
    isOffer: true,
    isFavorite: true,
    isFollowing: false,
    imageUri: createFixtureImageUrl('#F97316', '#FFFFFF', 'OLAYA'),
    deliveryLabel: 'توصيل مجاني',
    serviceLabel: 'توصيل برو',
    followerCount: 11000,
    multiplierLabel: 'x2',
    subscriptionPackageChips: ['توصيل مجاني', 'أولوية'],
    offerLabel: 'خصم 20%',
    hasBthwaniPro: true,
    hasNewProducts: true,
    hasCouponAvailable: false,
    supportsPickup: true,
    supportsPartnerDelivery: true,
  },
  {
    id: 'store-1002',
    name: 'مخبز حطين',
    subtitle: 'حي حطين • الرياض',
    statusLabel: 'مفتوح',
    meta: '25 دقيقة',
    etaMinutes: 25,
    distanceKm: 1.8,
    rating: 4.8,
    isOffer: false,
    isFavorite: false,
    isFollowing: false,
    imageUri: createFixtureImageUrl('#D97706', '#FFFFFF', 'HITTIN'),
    deliveryLabel: 'كوبون',
    serviceLabel: 'توصيل برو',
    followerCount: 9000,
    multiplierLabel: 'x1',
    subscriptionPackageChips: ['كوبون', 'توصيل مجاني'],
    hasBthwaniPro: true,
    hasNewProducts: false,
    hasCouponAvailable: true,
    supportsPickup: true,
    supportsPartnerDelivery: true,
  },
  {
    id: 'store-1003',
    name: 'مطبخ الملقا',
    subtitle: 'حي الملقا • الرياض',
    statusLabel: 'مشغول',
    meta: '32 دقيقة',
    etaMinutes: 32,
    distanceKm: 3.5,
    rating: 4.9,
    isOffer: true,
    isFavorite: false,
    isFollowing: false,
    imageUri: createFixtureImageUrl('#0F172A', '#FFFFFF', 'MALQA'),
    deliveryLabel: 'توصيل سريع',
    serviceLabel: 'توصيل برو',
    followerCount: 23400,
    multiplierLabel: 'x3',
    subscriptionPackageChips: ['توصيل سريع', 'أولوية'],
    offerLabel: 'خصم 15%',
    hasBthwaniPro: true,
    hasNewProducts: true,
    hasCouponAvailable: false,
    supportsPickup: true,
    supportsPartnerDelivery: true,
  },
];

export const storeItemsByStoreId: Record<string, DshStoreFixtureItem[]> = {
  'store-1001': [
    {
      id: 'item-apple-1',
      name: 'تفاح رويال غالا',
      subtitle: 'صندوق طازج 1 كجم',
      priceLabel: '18 ر.س',
      oldPriceLabel: '24 ر.س',
      discountLabel: 'خصم 25%',
      measurementType: 'weight',
      measurementOptions: ['250 جرام', '500 جرام', '1 كجم'],
      categoryId: 'fresh',
      categoryLabel: 'طازج',
      statusLabel: 'الأكثر طلبًا',
      isAvailable: true,
      hasOptions: false,
      preparationTime: '10-15 دقيقة',
      imageUri: createFixtureImageUrl('#ECFCCB', '#365314', 'APPLE'),
    },
    {
      id: 'item-milk-1',
      name: 'حليب عضوي',
      subtitle: 'عبوة مبردة 1.5 لتر',
      priceLabel: '11 ر.س',
      oldPriceLabel: '14 ر.س',
      discountLabel: 'خصم 21%',
      measurementType: 'piece',
      measurementOptions: ['حبة', '2 حبة', '4 حبات'],
      categoryId: 'dairy',
      categoryLabel: 'ألبان',
      isAvailable: true,
      hasOptions: false,
      preparationTime: '5-10 دقائق',
      imageUri: createFixtureImageUrl('#F5F3FF', '#4C1D95', 'MILK'),
    },
    {
      id: 'item-bread-1',
      name: 'خبز قمح كامل',
      subtitle: 'مخبوز يومي طازج',
      priceLabel: '7 ر.س',
      oldPriceLabel: '9 ر.س',
      discountLabel: 'خصم 22%',
      measurementType: 'piece',
      measurementOptions: ['حبة', '2 حبة', '6 حبات'],
      categoryId: 'bakery',
      categoryLabel: 'مخبوزات',
      isAvailable: true,
      hasOptions: false,
      preparationTime: '10-20 دقيقة',
      imageUri: createFixtureImageUrl('#FEF3C7', '#92400E', 'BREAD'),
    },
    {
      id: 'item-yogurt-1',
      name: 'زبادي يوناني',
      subtitle: 'عبوة بروتين خفيفة',
      priceLabel: '8 ر.س',
      oldPriceLabel: '10 ر.س',
      discountLabel: 'خصم 20%',
      categoryId: 'dairy',
      categoryLabel: 'ألبان',
      statusLabel: 'جديد اليوم',
      isAvailable: true,
      hasOptions: false,
      preparationTime: '5-8 دقائق',
      imageUri: createFixtureImageUrl('#E0F2FE', '#075985', 'YOGURT'),
    },
  ],
  'store-1002': [
    {
      id: 'item-croissant-1',
      name: 'كرواسون زبدة',
      subtitle: 'يخبز طازجًا كل صباح',
      priceLabel: '9 ر.س',
      categoryId: 'bakery',
      categoryLabel: 'مخبوزات',
      statusLabel: 'الأكثر مبيعًا',
      isAvailable: true,
      hasOptions: false,
      preparationTime: '8-12 دقيقة',
      imageUri: createFixtureImageUrl('#FFF7ED', '#9A3412', 'CROISSANT'),
    },
    {
      id: 'item-cake-1',
      name: 'شريحة شوكولاتة',
      subtitle: 'حصة فردية جاهزة',
      priceLabel: '14 ر.س',
      categoryId: 'sweets',
      categoryLabel: 'حلويات',
      isAvailable: true,
      hasOptions: true,
      preparationTime: '12-18 دقيقة',
      imageUri: createFixtureImageUrl('#FDF2F8', '#9D174D', 'CHOCO'),
    },
    {
      id: 'item-cheese-roll-1',
      name: 'لفافة جبن ساخنة',
      subtitle: 'مخبوزة ذهبية بطبقات خفيفة',
      priceLabel: '10 ر.س',
      categoryId: 'bakery',
      categoryLabel: 'مخبوزات',
      isAvailable: true,
      hasOptions: false,
      preparationTime: '10-14 دقيقة',
      imageUri: createFixtureImageUrl('#FEF3C7', '#78350F', 'ROLL'),
    },
  ],
  'store-1003': [
    {
      id: 'item-pasta-1',
      name: 'باستا كريمية',
      subtitle: 'وجبة جاهزة للإرسال',
      priceLabel: '29 ر.س',
      categoryId: 'meals',
      categoryLabel: 'وجبات',
      statusLabel: 'اختيار الشيف',
      isAvailable: true,
      hasOptions: true,
      preparationTime: '20-25 دقيقة',
      imageUri: createFixtureImageUrl('#F3E8FF', '#6B21A8', 'PASTA'),
    },
    {
      id: 'item-salad-1',
      name: 'سلطة جاردن',
      subtitle: 'طبق خفيف وطازج',
      priceLabel: '21 ر.س',
      categoryId: 'healthy',
      categoryLabel: 'صحي',
      isAvailable: true,
      hasOptions: false,
      preparationTime: '10-15 دقيقة',
      imageUri: createFixtureImageUrl('#DCFCE7', '#166534', 'SALAD'),
    },
    {
      id: 'item-chicken-1',
      name: 'دجاج مشوي',
      subtitle: 'تتبيلة منزلية مع أرز',
      priceLabel: '34 ر.س',
      categoryId: 'meals',
      categoryLabel: 'وجبات',
      statusLabel: 'جاهز الآن',
      isAvailable: true,
      hasOptions: true,
      preparationTime: '18-22 دقيقة',
      imageUri: createFixtureImageUrl('#FEF2F2', '#991B1B', 'CHICKEN'),
    },
  ],
};

export function buildStoreCategories(items: DshStoreFixtureItem[]) {
  const uniqueCategories = Array.from(new Map(items.map((item) => [item.categoryId, item.categoryLabel])).entries());

  return uniqueCategories.map(([id, label], index) => ({
    id,
    label,
    itemCount: items.filter((item) => item.categoryId === id).length,
    isPopular: index === 0,
  }));
}

export function buildStoreDeliveryModes(meta: string) {
  return [
    {
      id: 'delivery' as const,
      name: 'توصيل بثواني',
      isAvailable: true,
      estimatedTime: meta,
      fee: 12,
    },
    {
      id: 'pickup' as const,
      name: 'استلم بنفسك',
      isAvailable: true,
      estimatedTime: '15 دقيقة',
      fee: 0,
    },
  ];
}

export function buildStoreTags(store: DshDiscoveryStore) {
  return [
    store.hasBthwaniPro ? 'بثواني برو' : null,
    store.isOffer ? 'عرض مباشر' : null,
    store.distanceKm != null ? `${store.distanceKm} كم` : null,
    store.supportsPickup ? 'استلم بنفسك' : null,
    store.supportsPartnerDelivery ? 'توصيل المتجر' : null,
  ].filter(Boolean) as string[];
}
