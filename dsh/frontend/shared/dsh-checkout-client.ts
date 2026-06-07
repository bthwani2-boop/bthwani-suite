// DSH Checkout API client — J-003A / 003B / 003C / 003E
// WLT boundary: DSH creates the operational session only.
// Financial decision (payment approve/reject) is WLT-owned.
// DSH stores wlt_payment_ref_id as reference only — no financial mutation.

export type DshCheckoutFetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export type DshCheckoutAuthContext = {
  readonly bearerToken?: string;
  readonly clientId?: string;
};

// ─── error shapes ─────────────────────────────────────────────────────────────

export type DshCheckoutOfflineError = { readonly kind: 'offline' };
export type DshCheckoutHttpError = {
  readonly kind: 'http';
  readonly status: number;
  readonly body: string;
};
export type DshCheckoutError = DshCheckoutOfflineError | DshCheckoutHttpError;

export function isDshCheckoutOfflineError(err: unknown): err is DshCheckoutOfflineError {
  return typeof err === 'object' && err !== null && (err as { kind?: unknown }).kind === 'offline';
}

// ─── response types ───────────────────────────────────────────────────────────

export type DshCartServiceabilityResponse = {
  readonly serviceable: boolean;
  readonly store_id: string;
  readonly reason_code?: 'store_closed' | 'delivery_zone_unavailable' | 'items_unavailable' | 'partner_not_ready';
  readonly unavailable_item_ids?: readonly string[];
};

export type DshCheckoutIntentItem = {
  readonly product_id: string;
  readonly quantity: number;
};

export type DshCheckoutIntentRequest = {
  readonly store_id: string;
  readonly items: readonly DshCheckoutIntentItem[];
  readonly delivery_address: string;
  readonly delivery_time_slot?: string;
  readonly client_note?: string;
};

export type DshCheckoutIntentResponse = {
  readonly intent_id: string;
  readonly session_token: string;
  readonly status: 'pending_payment' | 'payment_confirmed' | 'payment_failed' | 'cancelled' | 'expired';
  readonly expires_at: string;
  // Non-authoritative price snapshots. WLT owns financial truth.
  // 0 = backend could not compute (in-memory dev mode or legacy). Frontend must fall back.
  readonly items_subtotal_minor_units: number;
  readonly delivery_fee_minor_units: number;
  readonly total_amount_minor_units: number;
};

export type DshCancelCheckoutIntentResponse = {
  readonly intent_id: string;
  readonly status: 'cancelled';
  readonly cart_preserved: boolean;
};

// ─── client interface ─────────────────────────────────────────────────────────

export interface DshCheckoutClient {
  checkServiceability(
    storeId: string,
    itemIds?: string[],
    clientId?: string,
  ): Promise<DshCartServiceabilityResponse>;

  createCheckoutIntent(
    req: DshCheckoutIntentRequest,
    clientId: string,
  ): Promise<DshCheckoutIntentResponse>;

  cancelCheckoutIntent(
    intentId: string,
    clientId: string,
  ): Promise<DshCancelCheckoutIntentResponse>;
}

// ─── HTTP transport ───────────────────────────────────────────────────────────

function checkoutAuthHeaders(auth: DshCheckoutAuthContext, clientId = ''): Record<string, string> {
  const bearerToken = auth.bearerToken?.trim();
  if (bearerToken) return { Authorization: `Bearer ${bearerToken}` };

  const resolvedClientId = clientId.trim() || auth.clientId?.trim();
  return resolvedClientId ? { 'X-Client-Id': resolvedClientId } : {};
}

async function doFetch<T>(
  baseUrl: string,
  fetchFn: DshCheckoutFetchFn,
  method: string,
  path: string,
  body?: unknown,
  headers?: Record<string, string>,
): Promise<T> {
  const url = `${baseUrl.replace(/\/$/, '')}${path}`;
  let response: Response;

  try {
    response = await fetchFn(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    const err: DshCheckoutOfflineError = { kind: 'offline' };
    throw err;
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    const err: DshCheckoutHttpError = { kind: 'http', status: response.status, body: text };
    throw err;
  }

  return response.json() as Promise<T>;
}

export function createDshCheckoutHttpClient(
  baseUrl: string | null,
  fetchFn: DshCheckoutFetchFn = globalThis.fetch,
  auth: DshCheckoutAuthContext = {},
): DshCheckoutClient {
  return {
    checkServiceability: async (storeId, itemIds = [], clientId = '') => {
      if (!baseUrl) throw { kind: 'offline' } as DshCheckoutOfflineError;
      const params = new URLSearchParams({ store_id: storeId });
      for (const id of itemIds) params.append('item_ids', id);
      return doFetch<DshCartServiceabilityResponse>(
        baseUrl,
        fetchFn,
        'GET',
        `/cart/serviceability?${params.toString()}`,
        undefined,
        checkoutAuthHeaders(auth, clientId),
      );
    },

    createCheckoutIntent: async (req, clientId) => {
      if (!baseUrl) throw { kind: 'offline' } as DshCheckoutOfflineError;
      return doFetch<DshCheckoutIntentResponse>(
        baseUrl,
        fetchFn,
        'POST',
        '/checkout/intent',
        req,
        checkoutAuthHeaders(auth, clientId),
      );
    },

    cancelCheckoutIntent: async (intentId, clientId) => {
      if (!baseUrl) throw { kind: 'offline' } as DshCheckoutOfflineError;
      return doFetch<DshCancelCheckoutIntentResponse>(
        baseUrl,
        fetchFn,
        'DELETE',
        `/checkout/intent/${intentId}`,
        undefined,
        checkoutAuthHeaders(auth, clientId),
      );
    },
  };
}
