import type { DshControlPanelText } from '@bthwani/ui-kit';

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

export function getDshArrivalBellSummary(text: DshControlPanelText): DshArrivalBellSummary {
  return text.fixtures.arrivalBell.summary;
}

export function getDshArrivalBellCaptainLane(text: DshControlPanelText): ReadonlyArray<DshArrivalBellLane> {
  return text.fixtures.arrivalBell.captainLane;
}

export function getDshArrivalBellCustomerLane(text: DshControlPanelText): ReadonlyArray<DshArrivalBellLane> {
  return text.fixtures.arrivalBell.customerLane;
}