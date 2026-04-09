/**
 * Fixture for UserProfileUpdateScreen (profileData).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | '';
}

export function buildProfileDataMock(t: TFunction): ProfileData {
  return {
    firstName: t('surfaces.أحمد'),
    lastName: t('surfaces.محمد'),
    email: 'ahmed.mohamed@example.com',
    phone: '+966501234567',
    dateOfBirth: '1990-05-15',
    gender: 'male',
  };
}
