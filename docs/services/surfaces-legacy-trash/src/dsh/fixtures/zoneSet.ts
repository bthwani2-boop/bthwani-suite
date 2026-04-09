/**
 * Fixture for DSH zone set (auto_dsh_zone_set) — app-client.
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface Zone {
  id: string;
  name: string;
  city: string;
  deliveryFee: number;
  estimatedTime: string;
  isAvailable: boolean;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'dsh.app-client.mobile.auto_dsh_zone_set';

export function buildDshZoneSetMock(t: TFunction): Zone[] {
  return [
    { id: '1', name: t(`${NS}.l83`), city: t(`${NS}.l84`), deliveryFee: 0, estimatedTime: t(`${NS}.l86`), isAvailable: true },
    { id: '2', name: t(`${NS}.l91`), city: t(`${NS}.l92`), deliveryFee: 5, estimatedTime: t(`${NS}.l94`), isAvailable: true },
    { id: '3', name: t(`${NS}.l99`), city: t(`${NS}.l100`), deliveryFee: 8, estimatedTime: t(`${NS}.l102`), isAvailable: true },
    { id: '4', name: t(`${NS}.l107`), city: t(`${NS}.l108`), deliveryFee: 6, estimatedTime: t(`${NS}.l110`), isAvailable: true },
    { id: '5', name: t(`${NS}.l115`), city: t(`${NS}.l116`), deliveryFee: 7, estimatedTime: t(`${NS}.l118`), isAvailable: false },
  ];
}

