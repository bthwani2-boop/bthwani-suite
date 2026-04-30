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

type DshZoneSetTextSource = {
  fixtures: {
    zoneSet: {
      summary: DshZoneSetSummary;
      policies: ReadonlyArray<DshZoneSetPolicy>;
      lanes: ReadonlyArray<{
        zoneLabel: string;
        feeLabel: string;
        etaLabel: string;
        statusLabel: string;
        recommendationLabel: string;
        note: string;
        tone: string;
      }>;
    };
  };
};

export function getDshZoneSetSummary(text: DshZoneSetTextSource): DshZoneSetSummary {
  return text.fixtures.zoneSet.summary;
}

export function getDshZoneSetPolicies(text: DshZoneSetTextSource): ReadonlyArray<DshZoneSetPolicy> {
  return text.fixtures.zoneSet.policies;
}

export function getDshZoneSetLanes(text: DshZoneSetTextSource): ReadonlyArray<DshZoneSetLane> {
  return text.fixtures.zoneSet.lanes as ReadonlyArray<DshZoneSetLane>;
}