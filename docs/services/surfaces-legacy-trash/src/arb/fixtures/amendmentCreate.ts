/**
 * Fixture for ARB amendment create (auto_arb_amendment_create).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export interface ArbAmendmentCreateBooking {
  id: string;
  property: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export function buildArbAmendmentCreateMock(
  t: TFunction,
  bookingId?: string
): ArbAmendmentCreateBooking {
  return {
    id: bookingId ?? 'BK-001',
    property: t('surfaces.arb_sample_2'),
    checkIn: '2024-02-15',
    checkOut: '2024-02-20',
    guests: 4,
  };
}
