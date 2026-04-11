import type { DshControlPanelText } from '@bthwani/ui-kit';

export type DshOrderRow = {
  id: string;
  customer: string;
  route: string;
  amount: string;
  eta: string;
  statusLabel: string;
  statusTone: 'brand' | 'success' | 'warning' | 'danger';
  createdLabel: string;
  destinationLabel: string;
  captainLabel: string;
  notes: string;
};

export type DshOrderArrivalTimeline = {
  arrived: boolean;
  arrivedLabel: string;
  ringCount: number;
  lastRingLabel: string;
  acknowledged: boolean;
  acknowledgedLabel: string;
  cooldownLabel: string;
  blockReason: string;
};

export type DshOrderActionPlan = {
  primaryLabel: string;
  primaryDescription: string;
  secondaryLabel: string;
  secondaryDescription: string;
  supportLabel: string;
  supportDescription: string;
};

export function getSampleDshOrders(text: DshControlPanelText): ReadonlyArray<DshOrderRow> {
  return text.fixtures.orders.rows;
}

export function getSampleDshOrder(text: DshControlPanelText, orderId: string) {
  return getSampleDshOrders(text).find((order) => order.id === orderId);
}

export function getSampleDshOrderArrivalTimeline(text: DshControlPanelText, orderId: string) {
  return text.fixtures.orders.arrivalTimelines[orderId as keyof typeof text.fixtures.orders.arrivalTimelines];
}

export function getSampleDshOrderActionPlan(text: DshControlPanelText, orderId: string): DshOrderActionPlan {
  const order = getSampleDshOrder(text, orderId);

  if (order?.statusTone === 'brand') {
    return text.fixtures.orders.actionPlans.brand;
  }

  if (order?.statusTone === 'warning') {
    return text.fixtures.orders.actionPlans.warning;
  }

  if (order?.statusTone === 'danger') {
    return text.fixtures.orders.actionPlans.danger;
  }

  return text.fixtures.orders.actionPlans.defaultPlan;
}