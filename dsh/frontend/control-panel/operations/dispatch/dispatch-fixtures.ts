export type DshDispatchLane = {
  id: string;
  title: string;
  subtitle: string;
  captain: string;
  distance: string;
  pickupEta: string;
  dropoffEta: string;
  confidence: string;
  blocker: string;
  readyForPickup: string;
};

export type DshDispatchSummary = {
  waitingAssignment: number;
  availableCaptains: number;
  readyForPickup: number;
  dispatchBlockers: number;
};

const dispatchSummary: DshDispatchSummary = {
  waitingAssignment: 6,
  availableCaptains: 4,
  readyForPickup: 3,
  dispatchBlockers: 2,
};

const dispatchLanes: readonly DshDispatchLane[] = [
  {
    id: 'DSP-401',
    title: 'Orders waiting assignment',
    subtitle: 'Queue pressure is visible and still needs a captain decision.',
    captain: 'Captain Ayman',
    distance: '2.1 km',
    pickupEta: '8 min',
    dropoffEta: '24 min',
    confidence: '92%',
    blocker: 'No blocker',
    readyForPickup: 'Ready in pickup lane',
  },
  {
    id: 'DSP-402',
    title: 'High confidence dispatch',
    subtitle: 'A nearby captain can absorb the order without widening the delay.',
    captain: 'Captain Nour',
    distance: '1.3 km',
    pickupEta: '5 min',
    dropoffEta: '19 min',
    confidence: '88%',
    blocker: 'Route pending',
    readyForPickup: 'Partner ready_for_pickup',
  },
  {
    id: 'DSP-403',
    title: 'Fallback dispatch',
    subtitle: 'Manual decision lane stays visible if the preferred captain stalls.',
    captain: 'Captain Omar',
    distance: '3.6 km',
    pickupEta: '11 min',
    dropoffEta: '31 min',
    confidence: '74%',
    blocker: 'Pickup confirmation missing',
    readyForPickup: 'Hold in dispatch blockers',
  },
];

export function getDshDispatchPreview() {
  return {
    summary: dispatchSummary,
    lanes: dispatchLanes,
  };
}