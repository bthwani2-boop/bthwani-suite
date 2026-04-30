/**
 * Fixture for DSH favorites list screen (auto_dsh_favorites_list).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface FavoriteRestaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  isOpen: boolean;
  distance: string;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'dsh.app-client.mobile.auto_dsh_favorites_list';

export function buildDshFavoritesListMock(t: TFunction): FavoriteRestaurant[] {
  return [
    {
      id: '1',
      name: t(`${NS}.l73`),
      cuisine: t(`${NS}.l74`),
      rating: 4.7,
      deliveryTime: t(`${NS}.l76`),
      deliveryFee: 5,
      image: '🍖',
      isOpen: true,
      distance: t(`${NS}.l80`),
    },
    {
      id: '2',
      name: t(`${NS}.l84`),
      cuisine: t(`${NS}.l85`),
      rating: 4.5,
      deliveryTime: t(`${NS}.l87`),
      deliveryFee: 7,
      image: '🍕',
      isOpen: true,
      distance: t(`${NS}.l91`),
    },
    {
      id: '3',
      name: t(`${NS}.l95`),
      cuisine: t(`${NS}.l96`),
      rating: 4.8,
      deliveryTime: t(`${NS}.l98`),
      deliveryFee: 10,
      image: '🍱',
      isOpen: false,
      distance: t(`${NS}.l102`),
    },
    {
      id: '4',
      name: t(`${NS}.l106`),
      cuisine: t(`${NS}.l107`),
      rating: 4.3,
      deliveryTime: t(`${NS}.l109`),
      deliveryFee: 3,
      image: '🍔',
      isOpen: true,
      distance: t(`${NS}.l113`),
    },
  ];
}

