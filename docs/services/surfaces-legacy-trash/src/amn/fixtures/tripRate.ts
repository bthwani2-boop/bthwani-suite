type TFunction = (key: string, options?: Record<string, unknown>) => string;

export function buildAmnTripRateMock(t: TFunction, tripId?: string) {
  return {
    id: tripId ?? 'TRIP-001',
    driverName: t('amn.app-client.mobile.auto_amn_trip_rate.mockPassengerName'),
    pickupLocation: t('amn.app-client.mobile.auto_amn_trip_rate.mockAddressPickup'),
    destination: t('amn.app-client.mobile.auto_amn_trip_rate.mockAddressDropoff'),
    date: '2024-02-10',
  };
}


