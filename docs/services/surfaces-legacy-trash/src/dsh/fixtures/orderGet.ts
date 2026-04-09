/**
 * Fixture for DSH order get (auto_dsh_order_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface OrderDetail {
  id: string;
  restaurant: {
    name: string;
    image: string;
    rating: number;
    deliveryTime: string;
  };
  status: string;
  orderTime: string;
  estimatedDelivery: string;
  deliveryAddress: string;
  items: OrderItem[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
    currency: string;
  };
  payment: {
    method: string;
    status: string;
  };
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'dsh.app-client.mobile.auto_dsh_order_get';

export function buildDshOrderGetMock(t: TFunction): OrderDetail {
  return {
    id: 'ORD-2024-001',
    restaurant: {
      name: t(`${NS}.l83`),
      image: '🍕',
      rating: 4.6,
      deliveryTime: t(`${NS}.l86`),
    },
    status: 'preparing',
    orderTime: '2024-02-10 13:30',
    estimatedDelivery: '2024-02-10 14:05',
    deliveryAddress: t(`${NS}.l91`),
    items: [
      { id: '1', name: t(`${NS}.l95`), quantity: 1, price: 45, specialInstructions: t(`${NS}.l98`) },
      { id: '2', name: t(`${NS}.l102`), quantity: 2, price: 25 },
      { id: '3', name: t(`${NS}.l108`), quantity: 2, price: 8 },
    ],
    pricing: {
      subtotal: 106,
      deliveryFee: 10,
      tax: 15.9,
      total: 131.9,
      currency: t(`${NS}.l118`),
    },
    payment: {
      method: t(`${NS}.l121`),
      status: 'paid',
    },
  };
}

