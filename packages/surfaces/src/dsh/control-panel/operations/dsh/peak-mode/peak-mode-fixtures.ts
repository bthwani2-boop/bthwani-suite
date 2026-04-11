import type { DshControlPanelText } from '@bthwani/ui-kit';

export type DshPeakModePressureLane = {
  zoneLabel: string;
  loadLabel: string;
  captainCapacityLabel: string;
  queueLabel: string;
  recommendationLabel: string;
  note: string;
  tone: 'brand' | 'success' | 'warning' | 'danger';
};

export type DshPeakModePolicy = {
  label: string;
  statusLabel: string;
  description: string;
};

export type DshPeakModeSummary = {
  activeZones: number;
  pressureZones: number;
  flexCaptains: number;
  protectedQueues: number;
};

export function getDshPeakModeSummary(text: DshControlPanelText): DshPeakModeSummary {
  return text.fixtures.peakMode.summary;
}

export function getDshPeakModePolicies(text: DshControlPanelText): ReadonlyArray<DshPeakModePolicy> {
  return text.fixtures.peakMode.policies;
}

export function getDshPeakModePressureLanes(text: DshControlPanelText): ReadonlyArray<DshPeakModePressureLane> {
  return text.fixtures.peakMode.lanes;
}