/**
 * Fixture for AMN trip get (auto_amn_trip_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'amn.app-client.mobile.auto_amn_trip_get';

export interface AmnTripDetail {
  id: string;
  status: string;
  pickupLocation: string;
  destination: string;
  driver: {
    name: string;
    phone: string;
    rating: number;
    vehicle: {
      model: string;
      color: string;
      plateNumber: string;
      image: string;
    };
  };
  pricing: {
    baseFare: number;
    distanceFare: number;
    waitingFare: number;
    total: number;
    currency: string;
  };
  timing: {
    requestedAt: string;
    acceptedAt: string;
    pickupETA: string;
    arrivalETA: string;
  };
  route: {
    distance: string;
    duration: string;
    stops: unknown[];
  };
}

export function buildAmnTripGetMock(t: TFunction, tripId?: string): AmnTripDetail {
  return {
    id: tripId ?? 'TRIP-2024-001',
    status: 'in_progress',
    pickupLocation: t(`${NS}.l82`),
    destination: t(`${NS}.l83`),
    driver: {
      name: t(`${NS}.l85`),
      phone: '+966501234567',
      rating: 4.8,
      vehicle: {
        model: t(`${NS}.l89`),
        color: t(`${NS}.l90`),
        plateNumber: 'ABC 123',
        image: '🚗',
      },
    },
    pricing: {
      baseFare: 15,
      distanceFare: 25,
      waitingFare: 5,
      total: 45,
      currency: t(`${NS}.l100`),
    },
    timing: {
      requestedAt: '2024-02-10 14:30',
      acceptedAt: '2024-02-10 14:32',
      pickupETA: t(`${NS}.l105`),
      arrivalETA: t(`${NS}.l106`),
    },
    route: {
      distance: t(`${NS}.l109`),
      duration: t(`${NS}.l110`),
      stops: [],
    },
  };
}

