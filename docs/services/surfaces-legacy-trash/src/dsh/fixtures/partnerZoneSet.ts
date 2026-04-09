/**
 * Fixture for DSH partner zone set (auto_dsh_partner_zone_set) — app-partner.
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

const NS = 'dsh.app-partner.mobile.auto_dsh_partner_zone_set';

export function buildDshPartnerZoneSetMock(t: TFunction): Zone[] {
  return [
    { id: '1', name: t(`${NS}.l32`), city: t(`${NS}.l32`), deliveryFee: 0, estimatedTime: '20-30 دقيقة', isAvailable: true },
    { id: '2', name: t(`${NS}.l33`), city: t(`${NS}.l33`), deliveryFee: 5, estimatedTime: '25-40 دقيقة', isAvailable: true },
    { id: '3', name: t(`${NS}.l34`), city: t(`${NS}.l34`), deliveryFee: 8, estimatedTime: '30-45 دقيقة', isAvailable: true },
    { id: '4', name: t(`${NS}.l35`), city: t(`${NS}.l35`), deliveryFee: 6, estimatedTime: '25-35 دقيقة', isAvailable: true },
    { id: '5', name: t(`${NS}.l36`), city: t(`${NS}.l36`), deliveryFee: 7, estimatedTime: '28-42 دقيقة', isAvailable: false },
  ];
}
