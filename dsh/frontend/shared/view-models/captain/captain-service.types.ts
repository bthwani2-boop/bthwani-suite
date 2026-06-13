export type CaptainServiceType = 'dsh' | 'amn';
export type CaptainAvailabilityStatus = 'available' | 'unavailable' | 'break' | 'planned-leave';
export type CaptainGpsStatus = 'ready' | 'limited' | 'offline' | 'disabled';
export type ActiveOrderPhase = 'pickup' | 'delivery';
export type CaptainAppMode = 'bthwani_captain_mode' | 'store_courier_mode';
export type StoreCourierStage =
  | 'ready_for_pickup'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivery_failed'
  | 'delivered';

export type CaptainSupportRoute =
  | 'chat-read-ack'
  | 'chat-send'
  | 'cod-liability'
  | 'order-accept'
  | 'order-deliver'
  | 'order-details'
  | 'order-get'
  | 'order-pickup'
  | 'orders-list'
  | 'orders-offers-list'
  | 'profile-get'
  | 'proof-upload'
  | 'tier-evaluate'
  | 'tier-info';

export type CompactOrderChatMessage = {
  id: string;
  sender: string;
  text: string;
  time: string;
  side: 'start' | 'end';
};
