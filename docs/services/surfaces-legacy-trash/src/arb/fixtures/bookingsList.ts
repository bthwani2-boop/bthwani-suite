/**
 * Fixture for ARB bookings list (auto_arb_bookings_list).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'arb.app-client.mobile.auto_arb_bookings_list';

export interface ArbBookingListItem {
  id: string;
  property: string;
  status: string;
  checkIn: string;
  checkOut: string;
  price: string;
  imageUrl: string;
}

export function buildArbBookingsListMock(
  t: TFunction,
  resolveDevMediaUrl?: (path: string) => string
): ArbBookingListItem[] {
  const baseUrl = typeof resolveDevMediaUrl === 'function' ? resolveDevMediaUrl : () => '';
  return [
    {
      id: '1',
      property: t(`${NS}.l72`),
      status: t(`${NS}.l73`),
      checkIn: '2026-03-01',
      checkOut: '2026-03-05',
      price: t(`${NS}.l76`),
      imageUrl: baseUrl('products/arb/prod_0001.jpg') || '',
    },
    {
      id: '2',
      property: t(`${NS}.l81`),
      status: t(`${NS}.l82`),
      checkIn: '2026-03-10',
      checkOut: '2026-03-15',
      price: t(`${NS}.l85`),
      imageUrl: baseUrl('products/general/prod_0002.jpg') || '',
    },
    {
      id: '3',
      property: t(`${NS}.l90`),
      status: t(`${NS}.l91`),
      checkIn: '2026-02-15',
      checkOut: '2026-02-20',
      price: t(`${NS}.l94`),
      imageUrl: baseUrl('products/arb/prod_0003.jpg') || '',
    },
  ];
}

