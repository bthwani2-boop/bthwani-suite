/**
 * Fixture for AMN trips list (auto_amn_trips_list).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'amn.app-client.mobile.auto_amn_trips_list';

export interface AmnTripListItem {
  id: string;
  destination: string;
  status: string;
  date: string;
}

export function buildAmnTripsListMock(t: TFunction): AmnTripListItem[] {
  return [
    { id: '1', destination: t(`${NS}.l86`), status: t(`${NS}.l86`), date: '2026-02-10' },
    { id: '2', destination: t(`${NS}.l87`), status: t(`${NS}.l87`), date: '2026-02-11' },
    { id: '3', destination: t(`${NS}.l88`), status: t(`${NS}.l88`), date: '2026-02-09' },
  ];
}

