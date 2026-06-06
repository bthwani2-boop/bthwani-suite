import { PlatformVarsRegistry } from './platform/PlatformVarsProvider';

export type DshOrderRecord = {
  readonly id: string;
  readonly store_id: string;
  readonly client_id: string;
  readonly status: 'CREATED' | 'ACCEPTED' | 'READY_FOR_PICKUP' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED' | 'ACCEPTED_BY_CAPTAIN' | 'PICKED_UP' | 'EN_ROUTE' | 'ARRIVED' | 'FAILED_DELIVERY' | 'RETURNING_TO_STORE' | 'RETURNED';
  readonly total_price: number;
  readonly wlt_payment_ref_id?: string;
  readonly wlt_refund_ref_id?: string;
  readonly refund_amount?: number;
  readonly captain_id?: string;
  readonly captain_latitude?: number;
  readonly captain_longitude?: number;
  readonly captain_lifecycle_status?: string;
  // pod_media_key: set when order reaches DELIVERED state (DSH-SLICE-005E).
  // DSH stores a media key reference only — never raw binary.
  // WLT payout is NOT triggered by DSH; payout is WLT responsibility.
  readonly pod_media_key?: string;
  // DSH-SLICE-005F: delivery failure fields.
  // WLT BOUNDARY: wlt_refund_trigger_ref is a bridge reference only; DSH does NOT execute refunds.
  readonly delivery_failure_reason?: string;
  readonly wlt_refund_trigger_ref?: string;
  readonly created_at: string;
  readonly updated_at: string;
};

export type WalletBalance = {
  readonly balanceMinorUnits: number;
  readonly currency: string;
  readonly linked: boolean;
  readonly frozenMinorUnits?: number;
  readonly updatedAt: string;
};

export type DshOrderItemRecord = {
  readonly id: string;
  readonly order_id: string;
  readonly product_id: string;
  readonly quantity: number;
  readonly price: number;
};

export type DshOrderStatusEventRecord = {
  readonly id: string;
  readonly order_id: string;
  readonly actor: 'client' | 'partner' | 'captain' | 'operator' | 'system';
  readonly from_status: string;
  readonly to_status: string;
  readonly note?: string;
  readonly created_at: string;
};

export type DshSupportEscalationRecord = {
  readonly id: string;
  readonly order_id: string;
  readonly actor: 'client' | 'partner';
  readonly issue_type: 'delayed_delivery' | 'wrong_items' | 'missing_items' | 'payment_issue' | 'other';
  readonly description: string;
  readonly status: 'open' | 'in-review' | 'resolved';
  readonly created_at: string;
  readonly resolved_at?: string;
};

export type DshOrderItemInput = {
  readonly product_id: string;
  readonly quantity: number;
  readonly price: number;
};

// DeliverOrderRequest (DSH-SLICE-005E — Proof of Delivery).
// pod_media_key is a media key reference; DSH never stores raw binaries.
// WLT BOUNDARY: DSH does not trigger payout here. Payout is WLT responsibility.
export type DshDeliverOrderRequest = {
  readonly captain_id: string;
  readonly pod_media_key?: string;
};

// FailDeliveryRequest (DSH-SLICE-005F — Delivery Failure).
// DSH records failure_reason and wlt_refund_trigger_ref (bridge ref only).
// WLT BOUNDARY: DSH does NOT execute refunds. WLT (004E) owns refund execution.
export type DshFailDeliveryRequest = {
  readonly captain_id: string;
  readonly failure_reason: string;
  readonly wlt_refund_trigger_ref?: string; // bridge ref for WLT; DSH stores only
  readonly return_required?: boolean;       // true → RETURNING_TO_STORE path
};

// ConfirmReturnRequest (DSH-SLICE-005F — Return Confirmation).
// WLT BOUNDARY: no financial mutation.
export type DshConfirmReturnRequest = {
  readonly captain_id: string;
  readonly note?: string;
};

export type DshCreateOrderRequest = {
  readonly store_id: string;
  readonly client_id: string;
  readonly total_price: number;
  readonly wlt_payment_ref_id?: string;
  readonly items: readonly DshOrderItemInput[];
};

export type DshCreateOrderResponse = {
  readonly order: {
    readonly id: string;
    readonly store_id: string;
    readonly client_id: string;
    readonly status: string;
    readonly total_price: number;
    readonly wlt_payment_ref_id?: string;
    readonly created_at: string;
    readonly updated_at: string;
    readonly items: readonly DshOrderItemRecord[];
  };
};

export type DshUpdateOrderStatusRequest = {
  readonly actor: 'client' | 'partner' | 'captain' | 'operator' | 'system';
  readonly status: 'CREATED' | 'ACCEPTED' | 'READY_FOR_PICKUP' | 'DELIVERED' | 'CANCELLED';
  readonly note?: string;
};

export type DshCreateSupportEscalationRequest = {
  readonly order_id: string;
  readonly actor: 'client' | 'partner';
  readonly issue_type: 'delayed_delivery' | 'wrong_items' | 'missing_items' | 'payment_issue' | 'other';
  readonly description: string;
};

export type DshOrderDetailsResponse = {
  readonly order: DshOrderRecord;
  readonly items: readonly DshOrderItemRecord[];
  readonly status_events: readonly DshOrderStatusEventRecord[];
  readonly support_tickets: readonly DshSupportEscalationRecord[];
};

export type DshListOrdersQuery = {
  readonly status?: string;
  readonly limit?: number;
  readonly offset?: number;
};

export type DshListOrdersResponse = {
  readonly orders: readonly DshOrderRecord[];
  readonly total: number;
};

export type DshOrderFetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export type DshOrderApiOfflineError = { readonly kind: 'offline' };
export type DshOrderApiHttpError = {
  readonly kind: 'http';
  readonly status: number;
  readonly body: string;
};
export type DshOrderApiError = DshOrderApiOfflineError | DshOrderApiHttpError;

export function isDshOrderApiOfflineError(err: unknown): err is DshOrderApiOfflineError {
  return typeof err === 'object' && err !== null && (err as { kind?: unknown }).kind === 'offline';
}

export function resolveDshOrderApiBaseUrl(): string | null {
  return PlatformVarsRegistry.get('dshApiBaseUrl');
}

export interface DshOrderLifecycleClient {
  listOrders(query?: DshListOrdersQuery): Promise<DshListOrdersResponse>;
  createOrder(req: DshCreateOrderRequest): Promise<DshCreateOrderResponse>;
  getOrder(orderId: string): Promise<DshOrderDetailsResponse>;
  updateOrderStatus(orderId: string, req: DshUpdateOrderStatusRequest): Promise<DshOrderRecord>;
  cancelOrder(orderId: string, req?: { actor?: string; note?: string }): Promise<DshOrderRecord>;
  createSupportEscalation(req: DshCreateSupportEscalationRequest): Promise<DshSupportEscalationRecord>;
  assignCaptain(orderId: string, req: { captain_id: string }): Promise<DshOrderRecord>;
  acceptTask(orderId: string, req: { captain_id: string }): Promise<DshOrderRecord>;
  declineTask(orderId: string, req: { captain_id: string; reason: string }): Promise<DshOrderRecord>;
  confirmPickup(orderId: string, req: { captain_id: string }): Promise<DshOrderRecord>;
  pushLocation(
    orderId: string,
    req: {
      captain_id: string;
      latitude: number;
      longitude: number;
      lifecycle_status: string;
      order_status?: 'EN_ROUTE' | 'ARRIVED';
    }
  ): Promise<DshOrderRecord>;
  getCaptainLocation(
    orderId: string
  ): Promise<{
    latitude: number;
    longitude: number;
    lifecycle_status: string;
    order_status: string;
  }>;
  // deliverOrder (DSH-SLICE-005E): submit proof-of-delivery; transitions ARRIVED → DELIVERED.
  // WLT BOUNDARY: no financial mutation; payout is WLT responsibility after DELIVERED event.
  deliverOrder(orderId: string, req: DshDeliverOrderRequest): Promise<DshOrderRecord>;
  // failDelivery (DSH-SLICE-005F): report delivery failure; transitions ARRIVED → FAILED_DELIVERY or RETURNING_TO_STORE.
  // WLT BOUNDARY: wlt_refund_trigger_ref is bridge ref only; DSH does NOT execute refunds.
  failDelivery(orderId: string, req: DshFailDeliveryRequest): Promise<DshOrderRecord>;
  // confirmReturn (DSH-SLICE-005F): captain confirms item returned to store; transitions RETURNING_TO_STORE → RETURNED.
  // WLT BOUNDARY: no financial mutation.
  confirmReturn(orderId: string, req: DshConfirmReturnRequest): Promise<DshOrderRecord>;
  // refundCallback (DSH-SLICE-004E): WLT invokes callback to confirm/fail refund.
  // WLT BOUNDARY: wlt_refund_ref_id and refund_amount are stored. DSH is read-only.
  refundCallback(
    orderId: string,
    req: {
      refund_ref_id: string;
      amount: number;
      status: 'CONFIRMED' | 'FAILED';
    }
  ): Promise<DshOrderRecord>;
  getWltWalletSummary(): Promise<WalletBalance>;
  submitSettlementCandidates(orderIds: string[]): Promise<DshOrderRecord[]>;
  postWltSettlementCallback(req: {
    settlement_ref_id: string;
    order_ids: string[];
    amount: number;
    status: 'CONFIRMED' | 'FAILED';
  }): Promise<DshOrderRecord[]>;
  getSettlements(): Promise<DshOrderRecord[]>;
}

async function doFetch<T>(
  baseUrl: string,
  fetchFn: DshOrderFetchFn,
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const url = `${baseUrl.replace(/\/$/, '')}${path}`;
  let response: Response;

  try {
    response = await fetchFn(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    const err: DshOrderApiOfflineError = { kind: 'offline' };
    throw err;
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    const err: DshOrderApiHttpError = {
      kind: 'http',
      status: response.status,
      body: text,
    };
    throw err;
  }

  return response.json() as Promise<T>;
}

export function createDshOrderLifecycleHttpClient(
  baseUrl: string | null,
  fetchFn: DshOrderFetchFn = globalThis.fetch,
): DshOrderLifecycleClient {
  return {
    listOrders: async (query = {}) => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      const params = new URLSearchParams();
      if (query.status) params.set('status', query.status);
      if (query.limit != null) params.set('limit', String(query.limit));
      if (query.offset != null) params.set('offset', String(query.offset));
      const qs = params.toString();
      return doFetch<DshListOrdersResponse>(baseUrl, fetchFn, 'GET', `/orders${qs ? `?${qs}` : ''}`);
    },
    createOrder: async (req) => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<DshCreateOrderResponse>(baseUrl, fetchFn, 'POST', '/orders', req);
    },
    getOrder: async (orderId) => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<DshOrderDetailsResponse>(baseUrl, fetchFn, 'GET', `/orders/${orderId}`);
    },
    updateOrderStatus: async (orderId, req) => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<DshOrderRecord>(baseUrl, fetchFn, 'PATCH', `/orders/${orderId}/status`, req);
    },
    cancelOrder: async (orderId, req = {}) => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<DshOrderRecord>(baseUrl, fetchFn, 'POST', `/orders/${orderId}/cancel`, req);
    },
    createSupportEscalation: async (req) => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<DshSupportEscalationRecord>(baseUrl, fetchFn, 'POST', '/support/escalations', req);
    },
    assignCaptain: async (orderId, req) => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<DshOrderRecord>(baseUrl, fetchFn, 'POST', `/orders/${orderId}/assign-captain`, req);
    },
    acceptTask: async (orderId, req) => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<DshOrderRecord>(baseUrl, fetchFn, 'POST', `/orders/${orderId}/accept-task`, req);
    },
    declineTask: async (orderId, req) => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<DshOrderRecord>(baseUrl, fetchFn, 'POST', `/orders/${orderId}/decline-task`, req);
    },
    confirmPickup: async (orderId, req) => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<DshOrderRecord>(baseUrl, fetchFn, 'POST', `/orders/${orderId}/pickup`, req);
    },
    pushLocation: async (orderId, req) => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<DshOrderRecord>(baseUrl, fetchFn, 'POST', `/orders/${orderId}/location`, req);
    },
    getCaptainLocation: async (orderId) => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<{
        latitude: number;
        longitude: number;
        lifecycle_status: string;
        order_status: string;
      }>(baseUrl, fetchFn, 'GET', `/orders/${orderId}/location`);
    },
    deliverOrder: async (orderId, req) => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<DshOrderRecord>(baseUrl, fetchFn, 'POST', `/orders/${orderId}/deliver`, req);
    },
    failDelivery: async (orderId, req) => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<DshOrderRecord>(baseUrl, fetchFn, 'POST', `/orders/${orderId}/fail-delivery`, req);
    },
    confirmReturn: async (orderId, req) => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<DshOrderRecord>(baseUrl, fetchFn, 'POST', `/orders/${orderId}/confirm-return`, req);
    },
    refundCallback: async (orderId, req) => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<DshOrderRecord>(baseUrl, fetchFn, 'POST', `/orders/${orderId}/refund-callback`, req);
    },
    getWltWalletSummary: async () => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<WalletBalance>(baseUrl, fetchFn, 'GET', '/wlt/wallet-summary');
    },
    submitSettlementCandidates: async (orderIds) => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<DshOrderRecord[]>(baseUrl, fetchFn, 'POST', '/settlement/candidates', { order_ids: orderIds });
    },
    postWltSettlementCallback: async (req) => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<DshOrderRecord[]>(baseUrl, fetchFn, 'POST', '/wlt/settlement-callback', req);
    },
    getSettlements: async () => {
      if (!baseUrl) throw { kind: 'offline' } as DshOrderApiOfflineError;
      return doFetch<DshOrderRecord[]>(baseUrl, fetchFn, 'GET', '/settlements');
    },
  };
}
