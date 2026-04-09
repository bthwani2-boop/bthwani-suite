/**
 * Fixture for DSH category get (auto_dsh_category_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  restaurant: string;
  rating: number;
  preparationTime: string;
}

export interface CategoryHeader {
  name: string;
  icon: string;
  description: string;
  totalItems: number;
  restaurants: number;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'dsh.app-client.mobile.auto_dsh_category_get';

export function buildDshCategoryGetMock(t: TFunction): { category: CategoryHeader; items: CategoryItem[] } {
  return {
    category: {
      name: t(`${NS}.l90`),
      icon: '🍖',
      description: t(`${NS}.l92`),
      totalItems: 45,
      restaurants: 12,
    },
    items: [
      { id: '1', name: t(`${NS}.l100`), description: t(`${NS}.l101`), price: 35, image: '🍗', restaurant: t(`${NS}.l104`), rating: 4.8, preparationTime: t(`${NS}.l106`) },
      { id: '2', name: t(`${NS}.l110`), description: t(`${NS}.l111`), price: 45, image: '🍖', restaurant: t(`${NS}.l114`), rating: 4.6, preparationTime: t(`${NS}.l116`) },
      { id: '3', name: t(`${NS}.l120`), description: t(`${NS}.l121`), price: 38, image: '🍚', restaurant: t(`${NS}.l124`), rating: 4.7, preparationTime: t(`${NS}.l126`) },
      { id: '4', name: t(`${NS}.l130`), description: t(`${NS}.l131`), price: 28, image: '🌯', restaurant: t(`${NS}.l134`), rating: 4.5, preparationTime: t(`${NS}.l136`) },
      { id: '5', name: t(`${NS}.l140`), description: t(`${NS}.l141`), price: 32, image: '🧆', restaurant: t(`${NS}.l144`), rating: 4.4, preparationTime: t(`${NS}.l146`) },
      { id: '6', name: t(`${NS}.l150`), description: t(`${NS}.l151`), price: 18, image: '🫘', restaurant: t(`${NS}.l154`), rating: 4.3, preparationTime: t(`${NS}.l156`) },
    ],
  };
}

