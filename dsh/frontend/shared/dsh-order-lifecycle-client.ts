// TypeScript API client for DSH Order Lifecycle & Support (J-003D / J-004)
// WLT boundary: read-only reference, zero financial mutation in client.

export type DshOrderRecord = {
  readonly id: string;
  readonly store_id: string;
  readonly client_id: string;
  readonly status: 'CREATED' | 'ACCEPTED' | 'READY_FOR_PICKUP' | 'DELIVERED' | 'CANCELLED';
  readonly total_price: number;
  readonly wlt_payment_ref_id?: string;
  readonly created_at: string;
  readonly updated_at: string;
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
  if (typeof process === 'undefined') return null;
  const env = (process as { env?: Record<string, string | undefined> }).env;
  const raw = env?.EXPO_PUBLIC_DSH_API_BASE_URL ?? env?.NEXT_PUBLIC_DSH_API_BASE_URL;
  return raw?.trim() || null;
}

export interface DshOrderLifecycleClient {
  createOrder(req: DshCreateOrderRequest): Promise<DshCreateOrderResponse>;
  getOrder(orderId: string): Promise<DshOrderDetailsResponse>;
  updateOrderStatus(orderId: string, req: DshUpdateOrderStatusRequest): Promise<DshOrderRecord>;
  cancelOrder(orderId: string, req?: { actor?: string; note?: string }): Promise<DshOrderRecord>;
  createSupportEscalation(req: DshCreateSupportEscalationRequest): Promise<DshSupportEscalationRecord>;
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
  };
}
