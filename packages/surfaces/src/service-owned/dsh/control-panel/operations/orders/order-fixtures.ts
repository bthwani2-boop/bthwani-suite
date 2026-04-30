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

type DshOrdersTextSource = {
  fixtures: {
    orders: {
      rows: ReadonlyArray<{
        id: string;
        customer: string;
        route: string;
        amount: string;
        eta: string;
        statusLabel: string;
        statusTone: string;
        createdLabel: string;
        destinationLabel: string;
        captainLabel: string;
        notes: string;
      }>;
      arrivalTimelines: Record<string, DshOrderArrivalTimeline>;
      actionPlans: {
        brand: DshOrderActionPlan;
        warning: DshOrderActionPlan;
        danger: DshOrderActionPlan;
        defaultPlan: DshOrderActionPlan;
      };
    };
  };
};

export function getSampleDshOrders(text: DshOrdersTextSource): ReadonlyArray<DshOrderRow> {
  return text.fixtures.orders.rows as ReadonlyArray<DshOrderRow>;
}

export function getSampleDshOrder(text: DshOrdersTextSource, orderId: string) {
  return getSampleDshOrders(text).find((order) => order.id === orderId);
}

export function getSampleDshOrderArrivalTimeline(text: DshOrdersTextSource, orderId: string) {
  return text.fixtures.orders.arrivalTimelines[orderId as keyof typeof text.fixtures.orders.arrivalTimelines] as DshOrderArrivalTimeline | undefined;
}

export function getSampleDshOrderActionPlan(text: DshOrdersTextSource, orderId: string): DshOrderActionPlan {
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