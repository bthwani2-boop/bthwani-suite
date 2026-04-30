/**
 * Fixture for DSH checkout gate order summary (auto_dsh_checkout_gate).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface CheckoutOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface CheckoutOrderSummary {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  items: CheckoutOrderItem[];
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'dsh.app-client.mobile.auto_dsh_checkout_gate';

export function buildDshCheckoutGateOrderSummaryMock(t: TFunction): CheckoutOrderSummary {
  return {
    subtotal: 105,
    deliveryFee: 10,
    tax: 15.75,
    total: 130.75,
    items: [
      { name: t(`${NS}.l75`), quantity: 2, price: 35 },
      { name: t(`${NS}.l76`), quantity: 1, price: 45 },
      { name: t(`${NS}.l77`), quantity: 1, price: 25 },
    ],
  };
}

