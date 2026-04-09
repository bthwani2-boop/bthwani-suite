// Dev/demo fixtures for DSH captain order screens. Isolated per RULE_DEV_DATA_ENV_AND_LEAK.

export interface OrderAccept {
  id: string;
  customer_name: string;
  customer_phone: string;
  pickup_location: string;
  delivery_location: string;
  total_amount: number;
  distance_km: number;
  items_count: number;
  estimated_delivery: string;
}

export interface OrderDeliver {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_location: string;
  total_amount: number;
  payment_method: 'cash' | 'card' | 'wallet';
  customer_id?: string | null;
  delivery_lat?: number | null;
  delivery_lng?: number | null;
}

export interface OrderPickup {
  id: string;
  customer_name: string;
  customer_phone: string;
  pickup_location: string;
  delivery_location: string;
  total_amount: number;
  items_count: number;
  restaurant_name?: string;
}

type TFunction = (key: string) => string;

export function buildOrderAcceptMock(t: TFunction): OrderAccept {
  return {
    id: 'dsh_order_001',
    customer_name: t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.mockCustomerName'),
    customer_phone: '+966501234567',
    pickup_location: t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.mockStoreAddress'),
    delivery_location: t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.mockDeliveryAddress'),
    total_amount: 25.5,
    distance_km: 3.2,
    items_count: 2,
    estimated_delivery: '2026-02-11T14:30:00Z',
  };
}

export function buildOrderDeliverMock(t: TFunction): OrderDeliver {
  return {
    id: 'dsh_order_001',
    customer_name: t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.mockCustomerName'),
    customer_phone: '+966501234567',
    delivery_location: t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.15'),
    total_amount: 25.5,
    payment_method: 'cash',
  };
}

export function buildOrderPickupFallback(t: TFunction, orderId: string): OrderPickup {
  return {
    id: orderId || 'dsh_order_001',
    customer_name: t('dsh.app-captain.mobile.auto_dsh_captain_order_pickup.mockCustomerName'),
    customer_phone: '+966501234567',
    pickup_location: t('dsh.app-captain.mobile.auto_dsh_captain_order_pickup.mockStoreAddress'),
    delivery_location: t('dsh.app-captain.mobile.auto_dsh_captain_order_pickup.mockDeliveryAddress'),
    total_amount: 25.5,
    items_count: 2,
    restaurant_name: t('dsh.app-captain.mobile.auto_dsh_captain_order_pickup.mockStoreName'),
  };
}
