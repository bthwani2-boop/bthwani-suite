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

function createTestBannerDataUrl(): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="680" viewBox="0 0 1200 680">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#0D2F67" />
          <stop offset="52%" stop-color="#143B83" />
          <stop offset="100%" stop-color="#F97316" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="42%" r="52%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.26" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="680" rx="44" fill="url(#bg)" />
      <circle cx="980" cy="110" r="140" fill="#ffffff" fill-opacity="0.16" />
      <circle cx="280" cy="560" r="220" fill="#ffffff" fill-opacity="0.08" />
      <circle cx="600" cy="340" r="250" fill="url(#glow)" />
      <rect x="72" y="70" width="286" height="56" rx="28" fill="#ffffff" fill-opacity="0.14" />
      <text x="214" y="108" font-family="Arial, sans-serif" font-size="30" font-weight="700" text-anchor="middle" fill="#ffffff">صورة تجريبية</text>
      <rect x="76" y="168" width="520" height="14" rx="7" fill="#ffffff" fill-opacity="0.32" />
      <rect x="76" y="200" width="390" height="14" rx="7" fill="#ffffff" fill-opacity="0.24" />
      <rect x="76" y="274" width="420" height="252" rx="36" fill="#ffffff" fill-opacity="0.14" />
      <rect x="108" y="304" width="236" height="54" rx="27" fill="#ffffff" fill-opacity="0.18" />
      <text x="226" y="340" font-family="Arial, sans-serif" font-size="26" font-weight="700" text-anchor="middle" fill="#ffffff">إطار عرض حي</text>
      <rect x="108" y="388" width="296" height="16" rx="8" fill="#ffffff" fill-opacity="0.28" />
      <rect x="108" y="420" width="248" height="16" rx="8" fill="#ffffff" fill-opacity="0.20" />
      <rect x="108" y="464" width="180" height="64" rx="32" fill="#ffffff" fill-opacity="0.18" />
      <text x="198" y="506" font-family="Arial, sans-serif" font-size="22" font-weight="700" text-anchor="middle" fill="#ffffff">Preview</text>
      <rect x="644" y="126" width="476" height="430" rx="44" fill="#ffffff" fill-opacity="0.13" />
      <circle cx="884" cy="302" r="136" fill="#ffffff" fill-opacity="0.16" />
      <circle cx="884" cy="302" r="78" fill="#ffffff" fill-opacity="0.18" />
      <path d="M868 248 C885 230, 913 230, 930 248 C947 266, 947 294, 930 312 C913 330, 885 330, 868 312 C851 294, 851 266, 868 248 Z" fill="#F97316" />
      <path d="M826 362 H942" stroke="#ffffff" stroke-opacity="0.78" stroke-width="18" stroke-linecap="round" />
      <path d="M840 404 H928" stroke="#ffffff" stroke-opacity="0.56" stroke-width="14" stroke-linecap="round" />
      <path d="M856 438 H912" stroke="#ffffff" stroke-opacity="0.42" stroke-width="10" stroke-linecap="round" />
      <text x="884" y="566" font-family="Arial, sans-serif" font-size="28" font-weight="700" text-anchor="middle" fill="#ffffff">DSH Test Banner</text>
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
    mediaKey: 'dsh.banner.home.promo-1.v1',
    title: 'تخفيضات',
    subtitle: 'خصم 30% على أول طلب',
    icon: '🔥',
    imageUrl: createTestBannerDataUrl(),
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
    imageUrl: bannerImages[1],
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
    imageUrl: bannerImages[2],
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
    imageUrl: createBannerDataUrl('#0d2f67', '#2557c9', 'متجر مباشر', 'افتح واجهة المتجر'),
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
    imageUrl: createBannerDataUrl('#f54747', '#ff6a6a', 'منتج مباشر', 'انتقال مباشر إلى الطلب'),
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
    imageUrl: createBannerDataUrl('#15a26b', '#30c98a', 'قائمة المتاجر', 'انتقل إلى استكشاف المتاجر'),
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
    imageUrl: bannerImages[0],
    accentColor: '#7a4fff',
    actionType: 'subscription',
  },
];

export const dshHomeGetFixtureStores: DshHomeGetFixtureStore[] = [
  {
    id: 'store-1001',
    name: 'مطعم القلعة',
    address: 'شارع التحرير، صنعاء',
    categoryId: 'restaurants',
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
    rating: 4.3,
    mediaKey: 'dsh.store.hadda.cover.v1',

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
    categoryId: 'restaurants',
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
    rating: 3.3,
    mediaKey: 'dsh.store.hittin.cover.v1',

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
    categoryId: 'restaurants',
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
    rating: 4.6,
    mediaKey: 'dsh.store.malqa.cover.v1',

    imageUri: '',
    hasBthwaniPro: true,
    subscriptionPackageChips: ['توصيل سريع', 'أولوية'],
    hasCouponAvailable: false,
    hasNewProducts: true,
  },
  {
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



