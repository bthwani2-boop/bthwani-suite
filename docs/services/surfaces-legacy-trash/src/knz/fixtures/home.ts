import type { KnzHomeData } from '../app-client/mobile/auto_knz_home_get';
import { KNZ_CATEGORIES, KNZ_CATEGORY_MOCK_COUNTS } from '../shared/knz-constants';

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'knz.app-client.mobile.auto_knz_home_get';
const NS_COMMON = 'knz.app-client.mobile.common';

export function buildKnzHomeMockData(t: TFunction): KnzHomeData {
  return {
    total_listings: 1247,
    favorites_count: 12,
    my_listings: 5,
    banners: [
      {
        id: 'banner_1',
        title: t(`${NS}.heroTitle`),
        description: t(`${NS}.heroSubtitle`),
        image_url: undefined,
      },
      {
        id: 'banner_2',
        title: t(`${NS}.latestListings`),
        description: t(`${NS}.browseLatest`),
        image_url: undefined,
      },
      {
        id: 'banner_3',
        title: t(`${NS}.browseByCategory`),
        description: t(`${NS}.categoriesSubtitle`),
        image_url: undefined,
      },
    ],
    categories: [
      ...KNZ_CATEGORIES.slice(0, 5).map((cat, i) => ({
        id: cat.code,
        code: cat.code,
        name: t(
          `${
            NS_COMMON
          }.${
            (
              {
                vehicles: 'categoryVehicles',
                real_estate: 'categoryRealEstate',
                services: 'categoryServices',
                home_garden: 'categoryHomeGarden',
                electronics: 'categoryElectronics',
                jobs: 'categoryJobs',
                family_kids: 'categoryFamilyKids',
                sports: 'categorySports',
                animals: 'categoryAnimals',
                numbers_plates: 'categoryNumbersPlates',
                travel: 'categoryTravel',
                other: 'categoryOther',
              } as Record<string, string>
            )[cat.code] || 'categoryOther'
          }`,
        ),
        icon:
          (
            {
              vehicles: '🚗',
              real_estate: '🏠',
              services: '🛠️',
              home_garden: '🪑',
              electronics: '💻',
              jobs: '💼',
              family_kids: '👶',
              sports: '⚽',
              animals: '🐦',
              numbers_plates: '🔢',
              travel: '✈️',
              other: '📦',
            } as Record<string, string>
          )[cat.code] ?? '📦',
        screen: 'KnzListingsList' as const,
        params: { category: cat.code },
        isPopular: i < 3,
        count: KNZ_CATEGORY_MOCK_COUNTS[cat.code] ?? 0,
      })),
      {
        id: 'all',
        code: 'all',
        name: t(`${NS}.allCategories`),
        icon: '📂',
        screen: 'KnzCategoriesList' as const,
        params: {},
        count: undefined,
        isPopular: false,
      },
    ],
    featuredListings: [
      {
        id: '1',
        title: t(`${NS_COMMON}.mockListingTitle`),
        price: 3800,
        category: 'electronics',
        categoryLabelAr: t(`${NS_COMMON}.categoryElectronics`),
        location: t(`${NS_COMMON}.citySanaa`),
        condition: 'used',
        image_url: undefined,
        seller: { name: t(`${NS_COMMON}.mockSellerDisplay1`), verified: true },
        rating: 4.8,
        deliveryAvailableFromSeller: true,
        listingType: 'sale',
      },
      {
        id: '2',
        title: t(`${NS_COMMON}.mockListingTitle4`),
        price: 75000,
        category: 'vehicles',
        categoryLabelAr: t(`${NS_COMMON}.categoryVehicles`),
        location: t(`${NS_COMMON}.cityAden`),
        condition: 'used',
        image_url: undefined,
        seller: { name: t(`${NS_COMMON}.mockSellerDisplay3`), verified: true },
        rating: 4.9,
        deliveryAvailableFromSeller: true,
        listingType: 'sale',
      },
      {
        id: '3',
        title: t(`${NS_COMMON}.mockListingTitle5`),
        price: 1200000,
        category: 'real_estate',
        categoryLabelAr: t(`${NS_COMMON}.categoryRealEstate`),
        location: t(`${NS_COMMON}.citySanaa`),
        condition: 'new',
        image_url: undefined,
        seller: { name: t(`${NS_COMMON}.mockSellerDisplay4`), verified: true },
        rating: 5.0,
        deliveryAvailableFromSeller: false,
        listingType: 'rent',
      },
    ],
    recentListings: [
      {
        id: '4',
        title: t(`${NS_COMMON}.mockListingTitle6`),
        price: 3200,
        category: 'electronics',
        categoryLabelAr: t(`${NS_COMMON}.categoryElectronics`),
        location: t(`${NS_COMMON}.cityTaiz`),
        condition: 'used',
        image_url: undefined,
        seller: { name: t(`${NS_COMMON}.mockSellerDisplay5`), verified: true },
        rating: 4.7,
        deliveryAvailableFromSeller: true,
        listingType: 'sale',
      },
      {
        id: '5',
        title: t(`${NS_COMMON}.mockListingTitle7`),
        price: 1200,
        category: 'home_garden',
        categoryLabelAr: t(`${NS_COMMON}.categoryHomeGarden`),
        location: t(`${NS_COMMON}.citySanaa`),
        condition: 'used',
        image_url: undefined,
        seller: { name: t(`${NS_COMMON}.mockSellerDisplay6`), verified: false },
        rating: 4.5,
        deliveryAvailableFromSeller: true,
        listingType: 'sale',
      },
      {
        id: '6',
        title: t(`${NS_COMMON}.mockListingTitle3`),
        price: 8500,
        category: 'vehicles',
        categoryLabelAr: t(`${NS_COMMON}.categoryVehicles`),
        location: t(`${NS_COMMON}.cityAden`),
        condition: 'used',
        image_url: undefined,
        seller: { name: t(`${NS_COMMON}.mockSellerDisplay7`), verified: true },
        rating: 4.6,
        deliveryAvailableFromSeller: true,
        listingType: 'sale',
      },
    ],
  };
}


