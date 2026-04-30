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

type DshPeakModeTextSource = {
  fixtures: {
    peakMode: {
      summary: DshPeakModeSummary;
      policies: ReadonlyArray<DshPeakModePolicy>;
      lanes: ReadonlyArray<{
        zoneLabel: string;
        loadLabel: string;
        captainCapacityLabel: string;
        queueLabel: string;
        recommendationLabel: string;
        note: string;
        tone: string;
      }>;
    };
  };
};

export function getDshPeakModeSummary(text: DshPeakModeTextSource): DshPeakModeSummary {
  return text.fixtures.peakMode.summary;
}

export function getDshPeakModePolicies(text: DshPeakModeTextSource): ReadonlyArray<DshPeakModePolicy> {
  return text.fixtures.peakMode.policies;
}

export function getDshPeakModePressureLanes(text: DshPeakModeTextSource): ReadonlyArray<DshPeakModePressureLane> {
  return text.fixtures.peakMode.lanes as ReadonlyArray<DshPeakModePressureLane>;
}