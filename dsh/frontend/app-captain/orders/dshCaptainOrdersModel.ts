export type DshCaptainOrderId = string;

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
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
  tone?: 'brand' | 'success' | 'warning' | 'info';
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

export type DshCaptainOrdersScreenState = 'ready' | 'loading' | 'empty' | 'delivered' | 'error';
