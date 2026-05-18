export type DshCaptainOrderId = string;

/**
 * Distinguishes order service type so the captain UI can show correct labels/badges.
 * - 'standard': regular store delivery via bthwani captain
 * - 'awnak': local pickup/dropoff request (direct or scheduled) via bthwani captain
 * - 'shein-final-mile': SHEIN final-mile delivery ONLY — from bthwani sorting point to customer
 *   (captain is NOT responsible for purchasing or importing)
 *
 * All service types are bthwani_delivery. partner_delivery and pickup (client fulfillment modes)
 * are NEVER routed to the captain app — they have no captain assignment.
 */
export type DshCaptainOrderServiceType = 'standard' | 'awnak' | 'shein-final-mile';

export type DshCaptainOrderMode =
	| 'full'
	| 'inbox'
	| 'detail'
	| 'chat'
	| 'bell'
	| 'accept'
	| 'offer-reject'
	| 'pickup'
	| 'deliver'
	| 'proof'
	| 'orders-list'
	| 'orders-offers-list'
	| 'order-get'
	| 'order-details';

export type DshCaptainOrderStage = 'offer' | 'accepted' | 'pickup' | 'delivery' | 'proof' | 'closed';

export type DshCaptainOrderBellItem = {
	id: DshCaptainOrderId;
	serviceType: DshCaptainOrderServiceType;
	// Enforced literal: captain inbox only contains bthwani_delivery orders.
	// partner_delivery and pickup are never routed here.
	readonly fulfillmentMode: 'bthwani_delivery';
	title: string;
	subtitle: string;
	meta: string;
};

export type DshCaptainOrderMessage = {
	id: string;
	sender: string;
	text: string;
	time: string;
	side: 'start' | 'end';
};

export type DshCaptainOrderAction =
	| 'accept'
	| 'order-offer-reject'
	| 'pickup'
	| 'deliver'
	| 'proof-upload'
	| 'back-to-inbox'
	| 'next-order';

export type DshCaptainOrderProofStatus = 'idle' | 'pending' | 'uploaded' | 'verified' | 'failed';

// ML-027: added 'offer-accepting' and 'offer-accepted' confirmation states
export type DshCaptainOrdersScreenState = 'ready' | 'loading' | 'empty' | 'delivered' | 'error' | 'offer-accepting' | 'offer-accepted';
