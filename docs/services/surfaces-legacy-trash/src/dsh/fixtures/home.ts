/**
 * Fixture for DSH home screen (auto_dsh_home_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 * Banners/restaurants/storesByCategory only; categories are built in the screen from getDshCategoriesSeed.
 */

import { getDshCategoriesSeed, DSH_CATEGORY_ICONS } from '../dshCategoriesSeed';

export interface DshBannerSeed {
  id: string;
  title?: string;
  description?: string;
  action_type?: string;
  action_target?: string;
  action_extra?: string;
}

export interface DshRestaurantSeed {
  id: string;
  name: string;
  cuisine: string;
  address?: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image_url?: string;
  isOpen: boolean;
  distance: string;
  isFavorite?: boolean;
  hasProDelivery?: boolean;
  followersCount?: number;
  hasNewProducts?: boolean;
  hasOffer?: boolean;
  offerText?: string;
  subscriptionPackageChips?: string[];
  pointsMultiplier?: number;
  hasCouponAvailable?: boolean;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'dsh.app-client.mobile.auto_dsh_home_get';

export function buildDshHomeBanners(t: TFunction): DshBannerSeed[] {
  return [
    {
      id: 'banner_2',
      title: t(`${NS}.categoryMainRestaurants`),
      description: t(`${NS}.openCategoryRestaurantsDsh`),
      action_type: 'main_category',
      action_target: 'restaurants',
    },
    {
      id: 'banner_3',
      title: t(`${NS}.categorySubVegetablesFruits`),
      description: t(`${NS}.categorySubUnderGroceries`),
      action_type: 'sub_category',
      action_target: 'grocery',
      action_extra: 'grocery_vegetables_fruits',
    },
    {
      id: 'banner_4',
      title: t(`${NS}.featuredStore`),
      description: t(`${NS}.openStoreCastleRestaurant`),
      action_type: 'store',
      action_target: '1',
    },
    {
      id: 'banner_5',
      title: t(`${NS}.somethingNew`),
      description: t(`${NS}.newLinkOrScreenControlledByDashboard`),
      action_type: 'external',
      action_target: 'DshStoresList',
    },
    {
      id: 'banner_6',
      title: t(`${NS}.inStoreCategoryBurger`),
      description: t(`${NS}.openStoreThenShowBurgerCategory`),
      action_type: 'store_category',
      action_target: '1',
      action_extra: t(`${NS}.burger`),
    },
    {
      id: 'banner_7',
      title: t(`${NS}.specificProduct`),
      description: t(`${NS}.openStoreAndProductDirect`),
      action_type: 'product',
      action_target: 'item_1',
      action_extra: '1',
    },
    {
      id: 'banner_8',
      title: t(`${NS}.subscriptionBundle`),
      description: t(`${NS}.subscribeExclusiveBenefits`),
      action_type: 'subscription',
    },
  ];
}

function rest(t: TFunction): DshRestaurantSeed[] {
  return [
    {
      id: '1',
      name: t(`${NS}.mockStore1Name`),
      cuisine: t(`${NS}.mockStore1Cuisine`),
      address: 'شارع التحرير، صنعاء',
      rating: 5.0,
      deliveryTime: t(`${NS}.mockStore1DeliveryTime`),
      deliveryFee: 5,
      isOpen: true,
      distance: t(`${NS}.mockStore1Distance`),
      isFavorite: true,
      hasProDelivery: true,
      followersCount: 15200,
      hasNewProducts: true,
      hasOffer: true,
      offerText: 'خصم 20%',
      subscriptionPackageChips: ['توصيل مجاني', 'أولوية'],
      pointsMultiplier: 2,
      hasCouponAvailable: false,
    },
    {
      id: '2',
      name: t(`${NS}.mockStore2Name`),
      cuisine: t(`${NS}.mockStore2Cuisine`),
      address: 'شارع حدة، جوار البنك',
      rating: 3.5,
      deliveryTime: t(`${NS}.mockStore2DeliveryTime`),
      deliveryFee: 3,
      isOpen: true,
      distance: t(`${NS}.mockStore2Distance`),
      isFavorite: false,
      hasProDelivery: false,
      followersCount: 8700,
      hasNewProducts: false,
      hasOffer: false,
      pointsMultiplier: undefined,
      hasCouponAvailable: true,
    },
    {
      id: '3',
      name: t(`${NS}.mockStore3Name`),
      cuisine: t(`${NS}.mockStore3Cuisine`),
      address: 'شارع الزبيري، أمام الجامعة',
      rating: 4.0,
      deliveryTime: t(`${NS}.mockStore3DeliveryTime`),
      deliveryFee: 7,
      isOpen: false,
      distance: t(`${NS}.mockStore3Distance`),
      isFavorite: true,
      hasProDelivery: true,
      followersCount: 23400,
      hasNewProducts: true,
      hasOffer: true,
      offerText: 'خصم 15%',
      subscriptionPackageChips: ['توصيل سريع'],
      pointsMultiplier: 3,
      hasCouponAvailable: false,
    },
    {
      id: '4',
      name: t(`${NS}.mockStore4Name`),
      cuisine: t(`${NS}.mockStore4Cuisine`),
      address: 'شارع الستين، جوار المول',
      rating: 2.5,
      deliveryTime: t(`${NS}.mockStore4DeliveryTime`),
      deliveryFee: 5,
      isOpen: true,
      distance: t(`${NS}.mockStore4Distance`),
      isFavorite: false,
      hasProDelivery: false,
      followersCount: 5100,
      hasNewProducts: false,
      hasOffer: true,
      offerText: 'وجبة مجانية',
      pointsMultiplier: undefined,
      hasCouponAvailable: true,
    },
    {
      id: '5',
      name: t(`${NS}.mockStore5Name`),
      cuisine: t(`${NS}.mockStore5Cuisine`),
      address: 'شارع المطار، صنعاء',
      rating: 1.5,
      deliveryTime: t(`${NS}.mockStore5DeliveryTime`),
      deliveryFee: 3,
      isOpen: true,
      distance: t(`${NS}.mockStore5Distance`),
      isFavorite: false,
      hasProDelivery: true,
      followersCount: 2300,
      hasNewProducts: true,
      hasOffer: false,
      subscriptionPackageChips: ['توصيل مجاني'],
      pointsMultiplier: 2,
      hasCouponAvailable: false,
    },
    {
      id: '6',
      name: t(`${NS}.mockStore6Name`),
      cuisine: t(`${NS}.mockStore6Cuisine`),
      address: 'شارع القيادة، المعلا',
      rating: 4.5,
      deliveryTime: t(`${NS}.mockStore6DeliveryTime`),
      deliveryFee: 7,
      isOpen: false,
      distance: t(`${NS}.mockStore6Distance`),
      isFavorite: true,
      hasProDelivery: false,
      followersCount: 45600,
      hasNewProducts: false,
      hasOffer: false,
      pointsMultiplier: undefined,
      hasCouponAvailable: true,
    },
  ];
}

export function buildDshHomeRestaurants(t: TFunction): DshRestaurantSeed[] {
  return rest(t);
}

export function buildDshHomeStoresByCategory(
  t: TFunction
): Record<string, DshRestaurantSeed[]> {
  const make = (list: DshRestaurantSeed[]) => list;
  return {
    grocery: make([
      {
        id: 'g1',
        name: t(`${NS}.bustanSupermarket`),
        cuisine: t(`${NS}.groceries`),
        address: 'شارع التحرير، صنعاء',
        rating: 4.6,
        deliveryTime: t(`${NS}.minutesFifteenTwentyFive`),
        deliveryFee: 3,
        isOpen: true,
        distance: t(`${NS}.distanceOneFiveKm`),
        isFavorite: false,
        hasProDelivery: true,
        followersCount: 12500,
        hasNewProducts: true,
        hasOffer: true,
        offerText: 'خصم 15%',
        subscriptionPackageChips: ['توصيل مجاني'],
        pointsMultiplier: 2,
        hasCouponAvailable: false,
      },
      {
        id: 'g2',
        name: t(`${NS}.oasisSupermarket`),
        cuisine: t(`${NS}.groceries`),
        address: 'شارع حدة، صنعاء',
        rating: 4.4,
        deliveryTime: t(`${NS}.minutesFifteenTwentyFive`),
        deliveryFee: 5,
        isOpen: true,
        distance: t(`${NS}.distanceTwoTwoKm`),
        isFavorite: false,
        hasProDelivery: false,
        followersCount: 8700,
        hasNewProducts: false,
        hasOffer: false,
        hasCouponAvailable: true,
      },
    ]),
    grocery_vegetables_fruits: make([
      {
        id: 'vf1',
        name: 'سوق الخضار المركزي',
        cuisine: 'خضروات وفواكه',
        address: 'سوق شميلة، صنعاء',
        rating: 4.8,
        deliveryTime: t(`${NS}.minutesFifteenTwentyFive`),
        deliveryFee: 2,
        isOpen: true,
        distance: '1.2',
        isFavorite: true,
        hasProDelivery: true,
        followersCount: 18500,
        hasNewProducts: true,
        hasOffer: true,
        offerText: 'عروض يومية',
        subscriptionPackageChips: ['توصيل مجاني', 'أولوية'],
        pointsMultiplier: 3,
        hasCouponAvailable: false,
      },
      {
        id: 'vf2',
        name: 'فواكه الموسم',
        cuisine: 'خضروات وفواكه',
        address: 'شارع الزبيري، صنعاء',
        rating: 4.5,
        deliveryTime: t(`${NS}.minutesFifteenTwentyFive`),
        deliveryFee: 3,
        isOpen: true,
        distance: '2.0',
        isFavorite: false,
        hasProDelivery: false,
        followersCount: 6200,
        hasNewProducts: false,
        hasOffer: false,
        hasCouponAvailable: true,
      },
      {
        id: 'vf3',
        name: 'خضروات طازجة',
        cuisine: 'خضروات وفواكه',
        address: 'شارع الستين، صنعاء',
        rating: 4.2,
        deliveryTime: t(`${NS}.minutesFifteenTwentyFive`),
        deliveryFee: 4,
        isOpen: false,
        distance: '3.5',
        isFavorite: false,
        hasProDelivery: true,
        followersCount: 4100,
        hasNewProducts: true,
        hasOffer: false,
      },
    ]),
    grocery_meat_fish_chicken: make([
      {
        id: 'm1',
        name: 'ملحمة اليمن',
        cuisine: 'لحوم',
        address: 'سوق الحصبة، صنعاء',
        rating: 4.9,
        deliveryTime: t(`${NS}.minutesTwentyThirtyFive`),
        deliveryFee: 5,
        isOpen: true,
        distance: '1.8',
        isFavorite: true,
        hasProDelivery: true,
        followersCount: 22000,
        hasNewProducts: false,
        hasOffer: true,
        offerText: 'كيلو مجاني',
        subscriptionPackageChips: ['توصيل مبرّد'],
        pointsMultiplier: 2,
        hasCouponAvailable: false,
      },
      {
        id: 'm2',
        name: 'ملحمة الأمانة',
        cuisine: 'لحوم',
        address: 'شارع المطار، صنعاء',
        rating: 4.6,
        deliveryTime: t(`${NS}.minutesTwentyThirtyFive`),
        deliveryFee: 4,
        isOpen: true,
        distance: '2.5',
        isFavorite: false,
        hasProDelivery: false,
        followersCount: 9800,
        hasNewProducts: true,
        hasOffer: false,
        hasCouponAvailable: true,
      },
      {
        id: 'po1',
        name: 'دجاج طازج',
        cuisine: 'دواجن',
        address: 'شارع الرقاص، صنعاء',
        rating: 4.7,
        deliveryTime: t(`${NS}.minutesFifteenTwentyFive`),
        deliveryFee: 3,
        isOpen: true,
        distance: '1.5',
        isFavorite: false,
        hasProDelivery: true,
        followersCount: 15600,
        hasNewProducts: true,
        hasOffer: true,
        offerText: 'خصم 20%',
        subscriptionPackageChips: ['توصيل سريع'],
        pointsMultiplier: undefined,
        hasCouponAvailable: false,
      },
      {
        id: 'f1',
        name: 'أسماك عدن',
        cuisine: 'أسماك',
        address: 'سوق السمك، صنعاء',
        rating: 4.8,
        deliveryTime: t(`${NS}.minutesTwentyThirtyFive`),
        deliveryFee: 6,
        isOpen: true,
        distance: '2.0',
        isFavorite: true,
        hasProDelivery: true,
        followersCount: 19200,
        hasNewProducts: true,
        hasOffer: true,
        offerText: 'سمك طازج',
        subscriptionPackageChips: ['توصيل مبرّد', 'أولوية'],
        pointsMultiplier: 3,
        hasCouponAvailable: false,
      },
    ]),
    grocery_roasted_spices: make([
      {
        id: 'rs1',
        name: 'محمصة اليمن',
        cuisine: 'بهارات ومحمصات',
        address: 'سوق الملح، صنعاء',
        rating: 4.9,
        deliveryTime: t(`${NS}.minutesFifteenTwentyFive`),
        deliveryFee: 2,
        isOpen: true,
        distance: '1.5',
        isFavorite: true,
        hasProDelivery: true,
        followersCount: 28000,
        hasNewProducts: true,
        hasOffer: true,
        offerText: 'بن مجاني',
        subscriptionPackageChips: ['توصيل سريع'],
        pointsMultiplier: 2,
        hasCouponAvailable: false,
      },
      {
        id: 'rs2',
        name: 'بهارات الشرق',
        cuisine: 'بهارات ومحمصات',
        address: 'شارع الزبيري، صنعاء',
        rating: 4.6,
        deliveryTime: t(`${NS}.minutesFifteenTwentyFive`),
        deliveryFee: 3,
        isOpen: true,
        distance: '2.2',
        isFavorite: false,
        hasProDelivery: false,
        followersCount: 12500,
        hasNewProducts: false,
        hasOffer: false,
        hasCouponAvailable: true,
      },
    ]),
    grocery_bakeries: make([
      {
        id: 'bk1',
        name: 'مخبز الفرن الذهبي',
        cuisine: 'مخابز',
        address: 'شارع التحرير، صنعاء',
        rating: 4.7,
        deliveryTime: t(`${NS}.minutesFifteenTwentyFive`),
        deliveryFee: 2,
        isOpen: true,
        distance: '0.8',
        isFavorite: true,
        hasProDelivery: true,
        followersCount: 35000,
        hasNewProducts: true,
        hasOffer: true,
        offerText: 'خبز طازج',
        subscriptionPackageChips: ['توصيل سريع', 'أولوية'],
        pointsMultiplier: 2,
        hasCouponAvailable: false,
      },
      {
        id: 'bk2',
        name: 'مخبز السعادة',
        cuisine: 'مخابز',
        address: 'شارع حدة، صنعاء',
        rating: 4.5,
        deliveryTime: t(`${NS}.minutesFifteenTwentyFive`),
        deliveryFee: 3,
        isOpen: true,
        distance: '1.5',
        isFavorite: false,
        hasProDelivery: false,
        followersCount: 18200,
        hasNewProducts: false,
        hasOffer: false,
        hasCouponAvailable: true,
      },
    ]),
    grocery_deals_bundle: make([
      {
        id: 'db1',
        name: 'عروض السوبر',
        cuisine: 'عروض وباقات',
        address: 'مول صنعاء، صنعاء',
        rating: 4.8,
        deliveryTime: t(`${NS}.minutesFifteenTwentyFive`),
        deliveryFee: 0,
        isOpen: true,
        distance: '2.0',
        isFavorite: true,
        hasProDelivery: true,
        followersCount: 42000,
        hasNewProducts: true,
        hasOffer: true,
        offerText: 'خصم 50%',
        subscriptionPackageChips: ['توصيل مجاني', 'أولوية', 'نقاط x3'],
        pointsMultiplier: 3,
        hasCouponAvailable: false,
      },
    ]),
    sweets_juices: make([
      {
        id: 's1',
        name: t(`${NS}.hikmaSweets`),
        cuisine: t(`${NS}.sweetsAndJuices`),
        address: 'شارع الجمهورية، صنعاء',
        rating: 4.8,
        deliveryTime: t(`${NS}.minutesFifteenTwentyFive`),
        deliveryFee: 2,
        isOpen: true,
        distance: t(`${NS}.distanceOneKm`),
        isFavorite: true,
        hasProDelivery: false,
        followersCount: 25600,
        hasNewProducts: true,
        hasOffer: true,
        offerText: 'عصير مجاني',
        pointsMultiplier: 2,
        hasCouponAvailable: false,
      },
      {
        id: 's2',
        name: t(`${NS}.bonCafeAndJuices`),
        cuisine: t(`${NS}.sweetsAndJuices`),
        address: 'شارع تعز، صنعاء',
        rating: 4.5,
        deliveryTime: t(`${NS}.minutesFifteenTwentyFive`),
        deliveryFee: 4,
        isOpen: true,
        distance: t(`${NS}.distanceTwoKm`),
        isFavorite: false,
        hasProDelivery: true,
        followersCount: 14200,
        hasNewProducts: false,
        hasOffer: false,
        subscriptionPackageChips: ['توصيل مجاني'],
        hasCouponAvailable: true,
      },
    ]),
    anaqati: make([
      {
        id: 'a1',
        name: t(`${NS}.anaqatiSanaa`),
        cuisine: t(`${NS}.anaqati`),
        address: 'مول صنعاء، صنعاء',
        rating: 4.7,
        deliveryTime: t(`${NS}.minutesTwentyFiveForty`),
        deliveryFee: 5,
        isOpen: true,
        distance: t(`${NS}.distanceTwoFiveKm`),
        isFavorite: false,
        hasProDelivery: false,
        followersCount: 31200,
        hasNewProducts: true,
        hasOffer: true,
        offerText: 'خصم 30%',
        pointsMultiplier: 3,
        hasCouponAvailable: false,
      },
      {
        id: 'a2',
        name: t(`${NS}.yemenPerfumes`),
        cuisine: t(`${NS}.anaqati`),
        address: 'شارع الزبيري، صنعاء',
        rating: 4.6,
        deliveryTime: t(`${NS}.minutesTwentyThirtyFive`),
        deliveryFee: 4,
        isOpen: true,
        distance: t(`${NS}.distanceTwoFiveKm`),
        isFavorite: false,
        hasProDelivery: true,
        followersCount: 18700,
        hasNewProducts: false,
        hasOffer: false,
        subscriptionPackageChips: ['توصيل مجاني'],
        hasCouponAvailable: true,
      },
    ]),
    bthwani_store: make([
      {
        id: 'b1',
        name: t(`${NS}.bithawaniStore`),
        cuisine: t(`${NS}.groceries`),
        address: 'شارع الستين، صنعاء',
        rating: 4.9,
        deliveryTime: t(`${NS}.minutesFifteenTwentyFive`),
        deliveryFee: 0,
        isOpen: true,
        distance: t(`${NS}.distanceZeroEightKm`),
        isFavorite: true,
        hasProDelivery: true,
        followersCount: 45000,
        hasNewProducts: true,
        hasOffer: true,
        offerText: 'توصيل مجاني',
        subscriptionPackageChips: ['توصيل مجاني', 'أولوية', 'نقاط x3'],
        pointsMultiplier: 3,
        hasCouponAvailable: false,
      },
    ]),
    home_projects: make([
      {
        id: 'h1',
        name: t(`${NS}.homeProjects`),
        cuisine: t(`${NS}.homeProjects`),
        address: 'حي السنينة، صنعاء',
        rating: 4.5,
        deliveryTime: t(`${NS}.minutesThirtyFortyFive`),
        deliveryFee: 7,
        isOpen: true,
        distance: t(`${NS}.distanceThreeKm`),
        isFavorite: false,
        hasProDelivery: false,
        followersCount: 8900,
        hasNewProducts: true,
        hasOffer: false,
        hasCouponAvailable: true,
      },
    ]),
    spare_parts: make([
      {
        id: 'p1',
        name: t(`${NS}.carSpareParts`),
        cuisine: t(`${NS}.spareParts`),
        address: 'شارع المقالح، صنعاء',
        rating: 4.4,
        deliveryTime: t(`${NS}.minutesTwentyThirtyFive`),
        deliveryFee: 6,
        isOpen: true,
        distance: t(`${NS}.distanceTwoEightKm`),
        isFavorite: false,
        hasProDelivery: false,
        followersCount: 12300,
        hasNewProducts: false,
        hasOffer: true,
        offerText: 'خصم 10%',
        hasCouponAvailable: false,
      },
    ]),
    honey_dates: make([
      {
        id: 'd1',
        name: t(`${NS}.yemenHoneyAndDates`),
        cuisine: t(`${NS}.honeyAndDates`),
        address: 'سوق الملح، صنعاء',
        rating: 4.9,
        deliveryTime: t(`${NS}.minutesTwentyThirtyFive`),
        deliveryFee: 4,
        isOpen: true,
        distance: t(`${NS}.distanceTwoFiveKm`),
        isFavorite: true,
        hasProDelivery: true,
        followersCount: 28500,
        hasNewProducts: true,
        hasOffer: true,
        offerText: 'عسل مجاني',
        subscriptionPackageChips: ['توصيل سريع', 'أولوية'],
        pointsMultiplier: 2,
        hasCouponAvailable: false,
      },
    ]),
    electronics: make([
      {
        id: 'e1',
        name: t(`${NS}.thawraElectronics`),
        cuisine: t(`${NS}.electronics`),
        address: 'شارع الثورة، صنعاء',
        rating: 4.6,
        deliveryTime: t(`${NS}.minutesTwentyThirtyFive`),
        deliveryFee: 5,
        isOpen: true,
        distance: t(`${NS}.distanceTwoEightKm`),
        isFavorite: false,
        hasProDelivery: false,
        followersCount: 21400,
        hasNewProducts: true,
        hasOffer: true,
        offerText: 'خصم 25%',
        pointsMultiplier: 2,
        hasCouponAvailable: false,
      },
      {
        id: 'e2',
        name: t(`${NS}.sanaaComputer`),
        cuisine: t(`${NS}.electronics`),
        address: 'شارع حدة، صنعاء',
        rating: 4.5,
        deliveryTime: t(`${NS}.minutesTwentyThirtyFive`),
        deliveryFee: 6,
        isOpen: true,
        distance: t(`${NS}.distanceThreeTwoKm`),
        isFavorite: false,
        hasProDelivery: false,
        followersCount: 16800,
        hasNewProducts: false,
        hasOffer: false,
        hasCouponAvailable: true,
      },
    ]),
    gas_refill: make([
      {
        id: 'gr1',
        name: t(`${NS}.gasRefillStation1`),
        cuisine: t(`${NS}.gasRefillStation1Type`),
        rating: 4.8,
        deliveryTime: t(`${NS}.gasRefillDeliveryTime`),
        deliveryFee: 8,
        isOpen: true,
        distance: t(`${NS}.gasRefillDistance1`),
        isFavorite: true,
        hasProDelivery: true,
      },
      {
        id: 'gr2',
        name: t(`${NS}.gasRefillStation2`),
        cuisine: t(`${NS}.gasRefillStation2Type`),
        rating: 4.6,
        deliveryTime: t(`${NS}.gasRefillDeliveryTime`),
        deliveryFee: 10,
        isOpen: true,
        distance: t(`${NS}.gasRefillDistance2`),
        isFavorite: false,
        hasProDelivery: false,
      },
      {
        id: 'gr3',
        name: t(`${NS}.gasRefillStation3`),
        cuisine: t(`${NS}.gasRefillStation3Type`),
        rating: 4.7,
        deliveryTime: t(`${NS}.gasRefillDeliveryTime`),
        deliveryFee: 7,
        isOpen: true,
        distance: t(`${NS}.gasRefillDistance3`),
        isFavorite: false,
        hasProDelivery: true,
      },
    ]),
  };
}

/** Category item for home (id, name, icon, screen, categoryId?, isPopular) */
export interface DshHomeCategorySeed {
  id: string;
  name: string;
  icon: string;
  screen: string;
  categoryId?: string;
  isPopular: boolean;
}

export type DshTickerKind = 'platform' | 'order' | 'promo';
export type DshTickerSeverity = 'info' | 'success' | 'warning' | 'danger';

export interface DshTickerMessage {
  id: string;
  kind: DshTickerKind;
  severity: DshTickerSeverity;
  message: string;
  starts_at?: string;
  ends_at?: string;
}

/** PromoBox — صندوق العرض الترويجي في صف الفئات (يُدار من CONTROL PANEL/Marketing) */
export type DshPromoBoxActionType =
  | 'screen'
  | 'url'
  | 'deeplink'
  | 'subscription';

export interface DshPromoBox {
  id: string;
  icon: string;
  badge: string;
  badge_color: string;
  title: string;
  subtitle: string;
  action_type: DshPromoBoxActionType;
  action_target: string;
  bg_color: string;
  text_color: string;
  is_active: boolean;
  priority: number;
  starts_at?: string;
  ends_at?: string;
}

export interface DshHomeDataMock {
  orders_today: number;
  bookings_active: number;
  revenue_today: number;
  banners: DshBannerSeed[];
  categories: DshHomeCategorySeed[];
  restaurants: DshRestaurantSeed[];
  storesByCategory: Record<string, DshRestaurantSeed[]>;
  activeOrder: {
    id: string;
    restaurantName: string;
    eta: string;
    status: string;
  };
  recentOrders: Array<{
    id: string;
    restaurantName: string;
    date: string;
    total: number;
  }>;
  defaultAddress: { id: string; label: string; description: string };
  /** رسائل الشريط الإخباري — منصة / طلب / عروض قصيرة العمر */
  tickerMessages: DshTickerMessage[];
  /** صناديق العروض الترويجية — تظهر في صف الفئات (يُدار من CONTROL PANEL) */
  promoBoxes: DshPromoBox[];
}

/** Build full home mock (banners/restaurants/storesByCategory are seeds; screen adds image_url via resolveDevMediaUrl). */
export function buildDshHomeDataMock(t?: TFunction): DshHomeDataMock {
  t = t ?? (((key: string) => String(key)) as TFunction);
  const allCats = getDshCategoriesSeed(t);
  const categories: DshHomeCategorySeed[] = [
    {
      id: 'all',
      name: t(`${NS}.allCategoriesLabel`),
      icon: '📂',
      screen: 'DshCategoriesList',
      isPopular: false,
    },
    ...allCats.map(c => ({
      id: c.id,
      name: c.name,
      icon: DSH_CATEGORY_ICONS[c.id] ?? '📦',
      screen: 'DshCategoryGet',
      categoryId: c.id,
      isPopular: c.id === 'restaurants',
    })),
  ];
  return {
    orders_today: 47,
    bookings_active: 3,
    revenue_today: 1251,
    banners: buildDshHomeBanners(t),
    categories,
    restaurants: buildDshHomeRestaurants(t),
    storesByCategory: buildDshHomeStoresByCategory(t),
    activeOrder: {
      id: 'ord_active_1',
      restaurantName: t(`${NS}.mockStore1Name`),
      eta: t(`${NS}.minutesFifteenTwentyFive`),
      status: t(`${NS}.onTheWay`),
    },
    recentOrders: [
      {
        id: 'ord_prev_1',
        restaurantName: t(`${NS}.mockStore2Name`),
        date: t(`${NS}.twoDaysAgo`),
        total: 2450,
      },
      {
        id: 'ord_prev_2',
        restaurantName: t(`${NS}.mockStore3Name`),
        date: t(`${NS}.oneWeekAgo`),
        total: 3200,
      },
      {
        id: 'ord_prev_3',
        restaurantName: t(`${NS}.mockStore4Name`),
        date: t(`${NS}.tenDaysAgo`),
        total: 1800,
      },
    ],
    defaultAddress: {
      id: 'addr_home',
      label: t(`${NS}.home`),
      description: t(`${NS}.addressSanaaTahrir`),
    },
    tickerMessages: [
      {
        id: 'platform_hours',
        kind: 'platform',
        severity: 'info',
        message: t(`${NS}.tickerPlatformHours`),
      },
      {
        id: 'promo_short',
        kind: 'promo',
        severity: 'success',
        message: t(`${NS}.tickerPromoShort`),
        starts_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'system_notice',
        kind: 'platform',
        severity: 'warning',
        message: t(`${NS}.tickerSystemNotice`),
      },
    ],
    promoBoxes: buildDshPromoBoxes(t),
  };
}

/**
 * إعلانات الصندوق الترويجي الدوار — صندوق واحد فقط يعرض إعلانات متعددة بالتناوب
 * يُدار من CONTROL PANEL/Marketing — الحد الأقصى 4 إعلانات نشطة تتبدل تلقائيًا
 * ملاحظة: يجب أن تتطابق هذه البيانات مع mockPromoBoxStore.ts في CONTROL PANEL
 */
export function buildDshPromoBoxes(t: TFunction): DshPromoBox[] {
  return [
    {
      id: 'promo_pro_delivery',
      icon: '👑',
      badge: t(`${NS}.promoBadge`),
      badge_color: '#FF500D',
      title: t(`${NS}.promoTitle`),
      subtitle: t(`${NS}.promoSubtitle`),
      action_type: 'subscription',
      action_target: 'DshSubscriptionGet',
      bg_color: '#0A2F5C',
      text_color: '#FFFFFF',
      is_active: true,
      priority: 1,
    },
    {
      id: 'promo_discounts',
      icon: '🔥',
      badge: t(`${NS}.promoDiscountBadge`),
      badge_color: '#EF4444',
      title: t(`${NS}.promoDiscountTitle`),
      subtitle: t(`${NS}.promoDiscountSubtitle`),
      action_type: 'screen',
      action_target: 'DshOffersGet',
      bg_color: '#EF4444',
      text_color: '#FFFFFF',
      is_active: true,
      priority: 2,
    },
    {
      id: 'promo_new_stores',
      icon: '🎉',
      badge: t(`${NS}.promoNewBadge`),
      badge_color: '#10B981',
      title: t(`${NS}.promoNewTitle`),
      subtitle: t(`${NS}.promoNewSubtitle`),
      action_type: 'screen',
      action_target: 'DshStoresList',
      bg_color: '#10B981',
      text_color: '#FFFFFF',
      is_active: false,
      priority: 3,
    },
    {
      id: 'promo_ramadan',
      icon: '🌙',
      badge: t(`${NS}.promoSeasonBadge`),
      badge_color: '#8B5CF6',
      title: t(`${NS}.promoSeasonTitle`),
      subtitle: t(`${NS}.promoSeasonSubtitle`),
      action_type: 'screen',
      action_target: 'DshOffersGet',
      bg_color: '#8B5CF6',
      text_color: '#FFFFFF',
      is_active: false,
      priority: 4,
      starts_at: '2026-03-10T00:00:00Z',
      ends_at: '2026-04-10T23:59:59Z',
    },
  ];
}

