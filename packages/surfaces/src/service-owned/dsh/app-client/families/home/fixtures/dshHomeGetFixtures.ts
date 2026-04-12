export type DshHomeGetFixturePromo = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  imageUrl?: string;
  accentColor?: string;
};

export type DshHomeGetFixtureStore = {
  id: string;
  name: string;
  address: string;
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
  imageUri?: string;
  hasBthwaniPro?: boolean;
  subscriptionPackageChips?: string[];
  hasCouponAvailable?: boolean;
  hasNewProducts?: boolean;
};

export const dshHomeGetFixtureTickerMessage = 'المساحة مخصصة للشريط الإخباري • اطلب إلى المنزل أو افتح الطلب النشط خلال خطوة واحدة';

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
      <rect x="68" y="68" width="310" height="58" rx="29" fill="${accent}" fill-opacity="0.92" />
      <text x="224" y="108" font-family="Arial, sans-serif" font-size="30" font-weight="700" text-anchor="middle" fill="#ffffff">${title}</text>
      <text x="78" y="230" font-family="Arial, sans-serif" font-size="64" font-weight="800" fill="#ffffff">${subtitle}</text>
      <rect x="78" y="292" width="390" height="14" rx="7" fill="#ffffff" fill-opacity="0.42" />
      <rect x="78" y="322" width="310" height="14" rx="7" fill="#ffffff" fill-opacity="0.3" />
      <rect x="78" y="392" width="208" height="72" rx="36" fill="#ffffff" fill-opacity="0.22" />
      <text x="182" y="439" font-family="Arial, sans-serif" font-size="28" font-weight="700" text-anchor="middle" fill="#ffffff">تجربة أسرع</text>
      <rect x="82" y="500" width="1020" height="96" rx="48" fill="#000000" fill-opacity="0.08" />
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const bannerImages = [
  createBannerDataUrl('#ff7a00', '#ff9b33', 'عروض اليوم', 'توصيل أسرع بلمسة واحدة'),
  createBannerDataUrl('#0d2f67', '#2557c9', 'مختارات DSH', 'أفضل المتاجر الأقرب لك'),
  createBannerDataUrl('#f54747', '#ff6a6a', 'خصومات مباشرة', 'تابع البنر وانتقل فورًا'),
];

export const dshHomeGetFixturePromos: DshHomeGetFixturePromo[] = [
  {
    id: 'promo-1',
    title: 'تخفيضات',
    subtitle: 'خصم 30% على أول طلب',
    icon: '🔥',
    imageUrl: bannerImages[0],
    accentColor: '#ff9b33',
  },
  {
    id: 'promo-2',
    title: 'تتبّع مباشر',
    subtitle: 'افتح الطلب النشط دون ضياع المسار',
    icon: '📍',
    imageUrl: bannerImages[1],
    accentColor: '#2557c9',
  },
  {
    id: 'promo-3',
    title: 'الفئات المختارة',
    subtitle: 'فئات قصيرة ومباشرة من نفس الواجهة',
    icon: '✨',
    imageUrl: bannerImages[2],
    accentColor: '#ff6a6a',
  },
];

export const dshHomeGetFixtureStores: DshHomeGetFixtureStore[] = [
  {
    id: 'store-1001',
    name: 'مطعم القلعة',
    address: 'شارع التحرير، صنعاء',
    statusLabel: 'مفتوح',
    statusTone: 'open',
    distanceLabel: '2.1 كم',
    deliveryLabel: 'توصيل مجاني',
    serviceLabel: 'توصيل برو',
    followerCount: 11000,
    multiplierLabel: 'x2',
    offerLabel: 'خصم 20%',
    isFavorite: true,
    isFollowing: false,
    hasOffer: true,
    rating: 5,
    imageUri: '',
    hasBthwaniPro: true,
    subscriptionPackageChips: ['توصيل مجاني', 'أولوية'],
    hasCouponAvailable: false,
    hasNewProducts: true,
  },
  {
    id: 'store-1002',
    name: 'مطاعم الأرض الخضراء',
    address: 'شارع حدة، جوار البنك',
    statusLabel: 'مفتوح',
    statusTone: 'open',
    distanceLabel: '1.8 كم',
    deliveryLabel: 'كوبون',
    serviceLabel: 'توصيل برو',
    followerCount: 9000,
    multiplierLabel: 'x1',
    isFavorite: false,
    isFollowing: false,
    hasOffer: false,
    rating: 4.8,
    imageUri: '',
    hasBthwaniPro: true,
    subscriptionPackageChips: ['كوبون', 'توصيل مجاني'],
    hasCouponAvailable: true,
    hasNewProducts: false,
  },
  {
    id: 'store-1003',
    name: 'مؤسسة الشيباني للمطاعم',
    address: 'شارع الزبيري، أمام الجامعة',
    statusLabel: 'مغلق',
    statusTone: 'closed',
    distanceLabel: '3.5 كم',
    deliveryLabel: 'توصيل سريع',
    serviceLabel: 'توصيل برو',
    followerCount: 9000,
    multiplierLabel: 'x3',
    offerLabel: 'خصم 15%',
    isFavorite: true,
    isFollowing: false,
    hasOffer: true,
    rating: 4.9,
    imageUri: '',
    hasBthwaniPro: true,
    subscriptionPackageChips: ['توصيل سريع', 'أولوية'],
    hasCouponAvailable: false,
    hasNewProducts: true,
  },
];