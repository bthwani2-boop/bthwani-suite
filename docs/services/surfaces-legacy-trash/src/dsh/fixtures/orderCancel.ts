/**
 * Fixture for DSH order cancel (auto_dsh_order_cancel).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface DshOrderCancelInfo {
  id: string;
  restaurant: string;
  total: number;
  status: string;
  orderTime: string;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'dsh.app-client.mobile.auto_dsh_order_cancel';

export function buildDshOrderCancelMock(t: TFunction, orderId?: string): DshOrderCancelInfo {
  return {
    id: orderId ?? 'ORD-2024-001',
    restaurant: t(`${NS}.l46`),
    total: 130,
    status: 'preparing',
    orderTime: '2024-02-10 13:30',
  };
}

