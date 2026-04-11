export type DshArrivalBellLane = {
  orderId: string;
  actorLabel: string;
  statusLabel: string;
  etaLabel: string;
  ringLabel: string;
  actionHint: string;
  tone: 'brand' | 'success' | 'warning' | 'danger';
};

export type DshArrivalBellSummary = {
  activeArrivals: number;
  awaitingAcknowledgement: number;
  blockedRings: number;
  resolvedToday: number;
};

type DshArrivalBellTextSource = {
  fixtures: {
    arrivalBell: {
      summary: DshArrivalBellSummary;
      captainLane: ReadonlyArray<{
        orderId: string;
        actorLabel: string;
        statusLabel: string;
        etaLabel: string;
        ringLabel: string;
        actionHint: string;
        tone: string;
      }>;
      customerLane: ReadonlyArray<{
        orderId: string;
        actorLabel: string;
        statusLabel: string;
        etaLabel: string;
        ringLabel: string;
        actionHint: string;
        tone: string;
      }>;
    };
  };
};

export function getDshArrivalBellSummary(text: DshArrivalBellTextSource): DshArrivalBellSummary {
  return text.fixtures.arrivalBell.summary;
}

export function getDshArrivalBellCaptainLane(text: DshArrivalBellTextSource): ReadonlyArray<DshArrivalBellLane> {
  return text.fixtures.arrivalBell.captainLane as ReadonlyArray<DshArrivalBellLane>;
}

export function getDshArrivalBellCustomerLane(text: DshArrivalBellTextSource): ReadonlyArray<DshArrivalBellLane> {
  return text.fixtures.arrivalBell.customerLane as ReadonlyArray<DshArrivalBellLane>;
}