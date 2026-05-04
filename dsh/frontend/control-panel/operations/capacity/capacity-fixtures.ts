export type DshCapacityLane = {
  id: string;
  areaBusy: string;
  captainSupplyLow: string;
  capacityState: string;
  availableWindows: string;
  reservedUntil: string;
  modePressure: string;
};

export type DshCapacitySummary = {
  busyAreas: number;
  lowSupply: number;
  reservedWindows: number;
  pressureModes: number;
};

const capacitySummary: DshCapacitySummary = {
  busyAreas: 4,
  lowSupply: 3,
  reservedWindows: 6,
  pressureModes: 5,
};

const capacityLanes: readonly DshCapacityLane[] = [
  { id: 'CP-1201', areaBusy: 'area_busy', captainSupplyLow: 'yes', capacityState: 'tight', availableWindows: '2 windows', reservedUntil: '11:30', modePressure: 'instant' },
  { id: 'CP-1202', areaBusy: 'area_busy', captainSupplyLow: 'no', capacityState: 'steady', availableWindows: '4 windows', reservedUntil: '12:00', modePressure: 'scheduled' },
  { id: 'CP-1203', areaBusy: 'area_busy', captainSupplyLow: 'yes', capacityState: 'high pressure', availableWindows: '1 window', reservedUntil: '11:15', modePressure: 'pickup' },
  { id: 'CP-1204', areaBusy: 'area_busy', captainSupplyLow: 'no', capacityState: 'buffered', availableWindows: '3 windows', reservedUntil: '12:40', modePressure: 'partner_delivery' },
];

export function getDshCapacityPreview() {
  return {
    summary: capacitySummary,
    lanes: capacityLanes,
  };
}