/**
 * Fixture for UserProfileScreen (user + stats).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
}

export interface UserProfileStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export function buildUserProfileMock(t: TFunction): UserProfileData {
  return {
    name: t('surfaces.سارة_أحمد'),
    email: 'sara.ahmed@example.com',
    phone: '+965 1234 5678',
    avatar: null,
  };
}

export function buildUserProfileStatsMock(
  t: TFunction,
  ns: string,
  favoriteCount: number
): UserProfileStat[] {
  return [
    { label: t(`${ns}.totalOrders`), value: '24', icon: 'restaurant', color: '' },
    { label: t(`${ns}.points`), value: '1,250', icon: 'star', color: '' },
    { label: t(`${ns}.balance`), value: '2,450.75', icon: 'account-balance-wallet', color: '' },
    { label: t(`${ns}.favorites`), value: favoriteCount.toString(), icon: 'star', color: '' },
  ];
}
