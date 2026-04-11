export type SheinProxyRequestStatus =
  | 'under-review'
  | 'estimated'
  | 'offered'
  | 'scheduled'
  | 'approved'
  | 'cancelled';

export type SheinProxyRequest = {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  status: SheinProxyRequestStatus;
  amount: string;
  shipping: string;
  fee: string;
  total: string;
  updated: string;
  note: string;
};

const SHEIN_PROXY_REQUESTS: readonly SheinProxyRequest[] = [
  {
    id: 'SPX-2048',
    customer: 'Noura Al-Fahad',
    product: 'Lightweight trench coat',
    quantity: 2,
    status: 'under-review',
    amount: 'SAR 1,280',
    shipping: 'SAR 96',
    fee: 'SAR 110',
    total: 'SAR 1,486',
    updated: '10 min ago',
    note: 'Awaiting the first estimate review from the proxy desk.'
  },
  {
    id: 'SPX-2051',
    customer: 'Mariam Khalid',
    product: 'Structured tote bag',
    quantity: 1,
    status: 'estimated',
    amount: 'SAR 840',
    shipping: 'SAR 62',
    fee: 'SAR 88',
    total: 'SAR 990',
    updated: '18 min ago',
    note: 'Estimate is ready and can move to the offer step.'
  },
  {
    id: 'SPX-2064',
    customer: 'Saeed Hassan',
    product: 'Training sneakers',
    quantity: 3,
    status: 'offered',
    amount: 'SAR 1,620',
    shipping: 'SAR 74',
    fee: 'SAR 125',
    total: 'SAR 1,819',
    updated: '32 min ago',
    note: 'Offer is out and waiting on a customer response.'
  },
  {
    id: 'SPX-2072',
    customer: 'Dana Saleh',
    product: 'Seasonal knit set',
    quantity: 2,
    status: 'scheduled',
    amount: 'SAR 1,010',
    shipping: 'SAR 55',
    fee: 'SAR 94',
    total: 'SAR 1,159',
    updated: '1 hour ago',
    note: 'Pickup window has been assigned for the next batch.'
  },
  {
    id: 'SPX-2078',
    customer: 'Lama Nasser',
    product: 'Premium sunglass set',
    quantity: 1,
    status: 'approved',
    amount: 'SAR 690',
    shipping: 'SAR 45',
    fee: 'SAR 77',
    total: 'SAR 812',
    updated: '2 hours ago',
    note: 'Request is approved and ready for handoff.'
  },
  {
    id: 'SPX-2083',
    customer: 'Abdullah Omar',
    product: 'Travel organizer kit',
    quantity: 4,
    status: 'cancelled',
    amount: 'SAR 560',
    shipping: 'SAR 41',
    fee: 'SAR 58',
    total: 'SAR 659',
    updated: '3 hours ago',
    note: 'Request was cancelled after a pricing mismatch.'
  }
] as const;

export function getSheinProxyRequests(): readonly SheinProxyRequest[] {
  return SHEIN_PROXY_REQUESTS;
}

export function getSheinProxyRequestById(requestId: string): SheinProxyRequest | undefined {
  return SHEIN_PROXY_REQUESTS.find((request) => request.id === requestId);
}

