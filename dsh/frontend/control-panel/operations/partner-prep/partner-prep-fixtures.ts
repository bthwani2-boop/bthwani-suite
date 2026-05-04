export type DshPartnerPrepLane = {
  id: string;
  title: string;
  prepTime: string;
  status: string;
  handoff: string;
  impact: string;
};

export type DshPartnerPrepSummary = {
  incomingOrders: number;
  readyForPickup: number;
  pausedStores: number;
  busyMode: number;
};

const partnerPrepSummary: DshPartnerPrepSummary = {
  incomingOrders: 7,
  readyForPickup: 4,
  pausedStores: 2,
  busyMode: 3,
};

const partnerPrepLanes: readonly DshPartnerPrepLane[] = [
  { id: 'PP-801', title: 'incoming_orders', prepTime: '12 min', status: 'accept_reject pending', handoff: 'handoff_to_captain waiting', impact: 'Partner finance impact visible' },
  { id: 'PP-802', title: 'prep_time', prepTime: '18 min', status: 'store_busy_mode', handoff: 'ready_for_pickup in progress', impact: 'May delay pickup by 5 min' },
  { id: 'PP-803', title: 'item_unavailable', prepTime: '9 min', status: 'partial_fulfillment', handoff: 'pause_orders suggested', impact: 'Refund or redispatch may be needed' },
  { id: 'PP-804', title: 'ready_for_pickup', prepTime: '3 min', status: 'handoff ready', handoff: 'captain pickup now', impact: 'Low finance friction' },
];

export function getDshPartnerPrepPreview() {
  return {
    summary: partnerPrepSummary,
    lanes: partnerPrepLanes,
  };
}