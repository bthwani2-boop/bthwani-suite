/**
 * Fixture for DSH search (auto_dsh_search).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface Restaurant {
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

const NS = 'dsh.app-client.mobile.auto_dsh_search';

export function buildDshSearchMock(t: TFunction): Restaurant[] {
  return [
    { id: '1', name: t(`${NS}.l97`), cuisine: t(`${NS}.l98`), rating: 4.6, deliveryTime: t(`${NS}.l100`), deliveryFee: 5, image: '🍕', isOpen: true, distance: t(`${NS}.l104`) },
    { id: '2', name: t(`${NS}.l108`), cuisine: t(`${NS}.l109`), rating: 4.3, deliveryTime: t(`${NS}.l111`), deliveryFee: 3, image: '🍔', isOpen: true, distance: t(`${NS}.l115`) },
    { id: '3', name: t(`${NS}.l119`), cuisine: t(`${NS}.l120`), rating: 4.8, deliveryTime: t(`${NS}.l122`), deliveryFee: 7, image: '🍱', isOpen: false, distance: t(`${NS}.l126`) },
  ];
}

