/**
 * Fixture for UserAddressesListScreen (addresses).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export interface Address {
  id: string;
  label: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  district: string;
  building: string;
  floor: string;
  apartment: string;
  additionalNotes?: string;
  isDefault: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export function buildAddressesListMock(t: TFunction, ns: string = 'mobile.app-user.UserAddressesListScreen'): Address[] {
  return [
    {
      id: '1',
      label: t(`${ns}.home`),
      type: 'home',
      street: t('surfaces.شارع_الملك_فهد'),
      city: t('surfaces.الرياض'),
      district: t('surfaces.الملز'),
      building: t('surfaces.مجمع_الرياض'),
      floor: '5',
      apartment: '12',
      additionalNotes: t('surfaces.جرس_رقم_3'),
      isDefault: true,
    },
  ];
}
