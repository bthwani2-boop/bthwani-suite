import type { DshControlPanelText } from '@bthwani/ui-kit';

export type DshZoneSetLane = {
  zoneLabel: string;
  feeLabel: string;
  etaLabel: string;
  statusLabel: string;
  recommendationLabel: string;
  note: string;
  tone: 'brand' | 'success' | 'warning' | 'danger';
};

export type DshZoneSetPolicy = {
  label: string;
  statusLabel: string;
  description: string;
};

export type DshZoneSetSummary = {
  configuredZones: number;
  protectedZones: number;
  freeDeliveryZones: number;
  reviewZones: number;
};

export function getDshZoneSetSummary(text: DshControlPanelText): DshZoneSetSummary {
  return text.fixtures.zoneSet.summary;
}

export function getDshZoneSetPolicies(text: DshControlPanelText): ReadonlyArray<DshZoneSetPolicy> {
  return text.fixtures.zoneSet.policies;
}

export function getDshZoneSetLanes(text: DshControlPanelText): ReadonlyArray<DshZoneSetLane> {
  return text.fixtures.zoneSet.lanes;
}