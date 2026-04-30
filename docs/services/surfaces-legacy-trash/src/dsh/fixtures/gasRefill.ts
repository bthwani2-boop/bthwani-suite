/**
 * Fixture for DSH Gas Refill (تعبئة غاز / دبة غاز).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 * محطات تعبئة غاز، تقديرات، وطلبات تجريبية.
 */

export type GasRefillSubcategory = 'gas_refill_refill' | 'gas_refill_repair' | 'gas_refill_buy';

export interface GasRefillStation {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude?: number;
  longitude?: number;
  rating: number;
  refillFee: number;
  repairFee?: number;
  cylinderPrice?: number;
  deliveryFeeMultiplier: number; // 2 = ذهاب وإياب
  isOpen: boolean;
}

export interface GasRefillEstimate {
  subcategory: GasRefillSubcategory;
  stationId: string;
  customerAddress: string;
  refillFee: number;
  repairFee?: number;
  cylinderPrice?: number;
  deliveryFee: number;
  total: number;
  currency: string;
  estimatedMinutes: number;
}

export interface GasRefillOrderMock {
  id: string;
  subcategory: GasRefillSubcategory;
  stationId: string;
  stationName: string;
  customerAddress: string;
  status: 'NEW' | 'PARTNER_ACCEPTED' | 'CAPTAIN_PICKUP' | 'AT_STATION' | 'DELIVERING' | 'COMPLETED';
  refillFee: number;
  repairFee?: number;
  cylinderPrice?: number;
  deliveryFee: number;
  total: number;
  currency: string;
  createdAt: string;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'dsh.app-client.mobile.auto_dsh_home_get';

/** محطات تعبئة غاز تجريبية */
export function buildGasRefillStationsMock(t: TFunction): GasRefillStation[] {
  return [
    {
      id: 'gr1',
      name: t(`${NS}.gasRefillStation1`),
      type: t(`${NS}.gasRefillStation1Type`),
      address: 'صنعاء، شارع التحرير',
      latitude: 15.3694,
      longitude: 44.1910,
      rating: 4.8,
      refillFee: 25,
      repairFee: 15,
      cylinderPrice: 120,
      deliveryFeeMultiplier: 2,
      isOpen: true,
    },
    {
      id: 'gr2',
      name: t(`${NS}.gasRefillStation2`),
      type: t(`${NS}.gasRefillStation2Type`),
      address: 'صنعاء، حدة',
      latitude: 15.3522,
      longitude: 44.2065,
      rating: 4.6,
      refillFee: 28,
      repairFee: 20,
      cylinderPrice: 125,
      deliveryFeeMultiplier: 2,
      isOpen: true,
    },
    {
      id: 'gr3',
      name: t(`${NS}.gasRefillStation3`),
      type: t(`${NS}.gasRefillStation3Type`),
      address: 'عدن، المعلا',
      latitude: 12.7855,
      longitude: 44.9783,
      rating: 4.7,
      refillFee: 22,
      repairFee: 18,
      cylinderPrice: 115,
      deliveryFeeMultiplier: 2,
      isOpen: true,
    },
  ];
}

/** تقدير تجريبي لطلب تعبئة غاز */
export function buildGasRefillEstimateMock(
  t: TFunction,
  subcategory: GasRefillSubcategory,
  stationId: string,
  baseDeliveryFee: number = 8
): GasRefillEstimate {
  const stations = buildGasRefillStationsMock(t);
  const station = stations.find((s) => s.id === stationId) ?? stations[0];
  const deliveryFee = Math.round(baseDeliveryFee * station.deliveryFeeMultiplier);

  let refillFee = station.refillFee;
  let repairFee: number | undefined;
  let cylinderPrice: number | undefined;

  if (subcategory === 'gas_refill_repair') {
    repairFee = station.repairFee ?? 15;
  } else if (subcategory === 'gas_refill_buy') {
    cylinderPrice = station.cylinderPrice ?? 120;
  }

  const total = refillFee + (repairFee ?? 0) + (cylinderPrice ?? 0) + deliveryFee;

  return {
    subcategory,
    stationId: station.id,
    customerAddress: t(`${NS}.addressSanaaTahrir`),
    refillFee,
    repairFee,
    cylinderPrice,
    deliveryFee,
    total,
    currency: 'SAR',
    estimatedMinutes: 35,
  };
}

/** طلب تعبئة غاز تجريبي */
export function buildGasRefillOrderMock(
  t: TFunction,
  overrides?: Partial<GasRefillOrderMock>
): GasRefillOrderMock {
  const estimate = buildGasRefillEstimateMock(t, 'gas_refill_refill', 'gr1');
  const stations = buildGasRefillStationsMock(t);
  const station = stations[0];

  return {
    id: `GAS-${Date.now()}`,
    subcategory: 'gas_refill_refill',
    stationId: station.id,
    stationName: station.name,
    customerAddress: t(`${NS}.addressSanaaTahrir`),
    status: 'NEW',
    refillFee: estimate.refillFee,
    deliveryFee: estimate.deliveryFee,
    total: estimate.total,
    currency: 'SAR',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

