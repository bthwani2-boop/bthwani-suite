/**
 * Fixture for ARB amendments list (auto_arb_amendments_list).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'arb.app-client.mobile.auto_arb_amendments_list';

export interface AmendmentItem {
  id: string;
  bookingId: string;
  type: string;
  status: string;
  date: string;
}

export function buildArbAmendmentsListMock(t: TFunction): AmendmentItem[] {
  return [
    {
      id: 'AM-1',
      bookingId: 'BK-001',
      type: t(`${NS}.l26`),
      status: t(`${NS}.l26`),
      date: '2026-03-01',
    },
    {
      id: 'AM-2',
      bookingId: 'BK-002',
      type: t(`${NS}.l27`),
      status: t(`${NS}.l27`),
      date: '2026-02-28',
    },
  ];
}

