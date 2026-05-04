export type DshSlaLane = {
  id: string;
  label: string;
  value: string;
  owner: string;
  reason: string;
};

export type DshSlaSummary = {
  breached: number;
  atRisk: number;
  healthy: number;
  escalated: number;
};

const slaSummary: DshSlaSummary = {
  breached: 2,
  atRisk: 4,
  healthy: 9,
  escalated: 3,
};

const slaLanes: readonly DshSlaLane[] = [
  { id: 'SLA-601', label: 'partner_accept_delay', value: '6 min', owner: 'partner', reason: 'Store has not accepted yet.' },
  { id: 'SLA-602', label: 'prep_delay', value: '11 min', owner: 'partner', reason: 'Prep is behind the normal window.' },
  { id: 'SLA-603', label: 'captain_assignment_delay', value: '4 min', owner: 'operations', reason: 'Captain not assigned fast enough.' },
  { id: 'SLA-604', label: 'ETA breach', value: '1 order', owner: 'support', reason: 'Delivery time is already beyond threshold.' },
];

export function getDshSlaPreview() {
  return {
    summary: slaSummary,
    lanes: slaLanes,
  };
}