export type DshLiveTrackingEvent = {
  id: string;
  orderId: string;
  deliveryId: string;
  actorId: string;
  actorRole: string;
  fromStatus: string;
  toStatus: string;
  timestamp: string;
  location: string;
  source: string;
  reasonCode: string;
  notes: string;
  evidence: string;
};

export type DshLiveTrackingSummary = {
  events: number;
  inFlight: number;
  cancelled: number;
  returned: number;
};

const liveTrackingSummary: DshLiveTrackingSummary = {
  events: 16,
  inFlight: 6,
  cancelled: 2,
  returned: 1,
};

const liveTrackingEvents: readonly DshLiveTrackingEvent[] = [
  { id: 'LT-901', orderId: 'ORD-24018', deliveryId: 'DEL-8102', actorId: 'OPS-12', actorRole: 'operations', fromStatus: 'created', toStatus: 'partner_accepted', timestamp: '10:14', location: 'North hub', source: 'control-panel', reasonCode: 'dispatch_update', notes: 'Order entered the live timeline.', evidence: 'dispatch note' },
  { id: 'LT-902', orderId: 'ORD-24019', deliveryId: 'DEL-8103', actorId: 'P-04', actorRole: 'partner', fromStatus: 'preparing', toStatus: 'ready_for_pickup', timestamp: '10:28', location: 'Store 44', source: 'webhook', reasonCode: 'prep_complete', notes: 'Partner confirmed readiness.', evidence: 'store photo' },
  { id: 'LT-903', orderId: 'ORD-24020', deliveryId: 'DEL-8104', actorId: 'C-08', actorRole: 'captain', fromStatus: 'captain_assigned', toStatus: 'enroute_to_pickup', timestamp: '10:31', location: 'Route A', source: 'app', reasonCode: 'captain_departed', notes: 'Captain started moving.', evidence: 'gps trail' },
  { id: 'LT-904', orderId: 'ORD-24021', deliveryId: 'DEL-8105', actorId: 'SUP-03', actorRole: 'support', fromStatus: 'arrived_at_dropoff', toStatus: 'refunded', timestamp: '10:44', location: 'Support desk', source: 'manual', reasonCode: 'refund_required', notes: 'Refund completed after failure.', evidence: 'refund trace' },
];

const timelineStatuses = [
  'created',
  'confirmed',
  'partner_accepted',
  'preparing',
  'ready_for_pickup',
  'captain_assigned',
  'enroute_to_pickup',
  'arrived_at_pickup',
  'picked_up',
  'enroute_to_dropoff',
  'arrived_at_dropoff',
  'delivered',
  'cancelled',
  'failed',
  'returned',
  'refunded',
] as const;

export function getDshLiveTrackingPreview() {
  return {
    summary: liveTrackingSummary,
    events: liveTrackingEvents,
    statuses: timelineStatuses,
  };
}