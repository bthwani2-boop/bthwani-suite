/**
 * Fixture for DSH reviews list (auto_dsh_reviews_list).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  itemName: string;
  restaurantName: string;
  helpful: number;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'dsh.app-client.mobile.auto_dsh_reviews_list';

export function buildDshReviewsListMock(t: TFunction): Review[] {
  return [
    { id: '1', userName: t(`${NS}.l72`), userAvatar: '👨', rating: 5, comment: t(`${NS}.l75`), date: '2024-02-10', itemName: t(`${NS}.l77`), restaurantName: t(`${NS}.l78`), helpful: 12 },
    { id: '2', userName: t(`${NS}.l83`), userAvatar: '👩', rating: 4, comment: t(`${NS}.l86`), date: '2024-02-09', itemName: t(`${NS}.l88`), restaurantName: t(`${NS}.l89`), helpful: 8 },
    { id: '3', userName: t(`${NS}.l94`), userAvatar: '👨‍💼', rating: 5, comment: t(`${NS}.l97`), date: '2024-02-08', itemName: t(`${NS}.l99`), restaurantName: t(`${NS}.l100`), helpful: 15 },
    { id: '4', userName: t(`${NS}.l105`), userAvatar: '👩‍🎓', rating: 3, comment: t(`${NS}.l108`), date: '2024-02-07', itemName: t(`${NS}.l110`), restaurantName: t(`${NS}.l111`), helpful: 3 },
    { id: '5', userName: t(`${NS}.l116`), userAvatar: '👨‍🔬', rating: 5, comment: t(`${NS}.l119`), date: '2024-02-06', itemName: t(`${NS}.l121`), restaurantName: t(`${NS}.l122`), helpful: 20 },
  ];
}

