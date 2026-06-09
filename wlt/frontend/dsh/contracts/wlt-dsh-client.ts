/**
 * WLT typed client — calls the real WLT backend (port 8083).
 *
 * Route mapping (WLT backend, wlt/backend/internal/http/):
 *   GET  /health
 *   GET  /wallets/{subject}/summary
 *   GET  /wallets/{subject}/transactions
 *   POST /payment/sessions
 *   GET  /payment/sessions/{id}
 *   GET  /refunds
 *   POST /refunds
 *   GET  /refunds/{id}
 *   GET  /settlements
 *   POST /settlements
 *   GET  /settlements/{id}
 */

declare const process: any;

// ─── Domain types (mirror wlt/domain/wallet.go JSON tags) ────────────────────

export interface WltWalletSummary {
	readonly subject: string;
	readonly actor_type: string;
	readonly balance: number;
	readonly currency: string;
	readonly total_credit: number;
	readonly total_debit: number;
	readonly pending_credit: number;
	readonly pending_debit: number;
	readonly transaction_count: number;
}

export interface WltLedgerEntry {
	readonly id: string;
	readonly wallet_id: string;
	readonly subject: string;
	readonly transaction_type: 'CREDIT' | 'DEBIT';
	readonly amount: number;
	readonly currency: string;
	readonly reference_type: string;
	readonly reference_id: string;
	readonly order_id?: string;
	readonly description: string;
	readonly status: string;
	readonly created_at: string;
	readonly completed_at?: string;
}

export interface WltListLedgerResponse {
	readonly entries: WltLedgerEntry[];
	readonly total: number;
}

export interface WltPaymentSession {
	readonly id: string;
	readonly checkout_intent_id: string;
	readonly client_id: string;
	readonly amount: number;
	readonly currency: string;
	readonly status: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'EXPIRED' | 'CANCELLED';
	readonly payment_method: string;
	readonly provider_ref?: string;
	readonly dsh_base_url: string;
	readonly idempotency_key: string;
	readonly failure_reason?: string;
	readonly created_at: string;
	readonly expires_at: string;
	readonly confirmed_at?: string;
	readonly failed_at?: string;
}

export interface WltCreatePaymentSessionRequest {
	readonly checkout_intent_id: string;
	readonly client_id: string;
	readonly amount: number;
	readonly currency?: string;
	readonly payment_method?: string;
	readonly dsh_base_url?: string;
	readonly idempotency_key: string;
}

export interface WltRefund {
	readonly id: string;
	readonly order_id: string;
	readonly payment_session_id: string;
	readonly client_id: string;
	readonly amount: number;
	readonly currency: string;
	readonly reason: string;
	readonly status: 'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'FAILED';
	readonly trigger_ref?: string;
	readonly dsh_base_url: string;
	readonly dsh_callback_sent_at?: string;
	readonly idempotency_key: string;
	readonly failure_reason?: string;
	readonly created_at: string;
	readonly updated_at: string;
	readonly completed_at?: string;
}

export interface WltCreateRefundRequest {
	readonly order_id: string;
	readonly payment_session_id?: string;
	readonly client_id: string;
	readonly amount: number;
	readonly currency?: string;
	readonly reason: string;
	readonly trigger_ref?: string;
	readonly dsh_base_url?: string;
	readonly idempotency_key: string;
}

export interface WltListRefundsResponse {
	readonly refunds: WltRefund[];
	readonly total: number;
}

export interface WltSettlement {
	readonly id: string;
	readonly order_id: string;
	readonly partner_id: string;
	readonly captain_id?: string;
	readonly gross_amount: number;
	readonly platform_fee: number;
	readonly partner_payout: number;
	readonly captain_payout: number;
	readonly currency: string;
	readonly status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
	readonly idempotency_key: string;
	readonly failure_reason?: string;
	readonly created_at: string;
	readonly updated_at: string;
	readonly completed_at?: string;
}

export interface WltListSettlementsResponse {
	readonly settlements: WltSettlement[];
	readonly total: number;
}

export interface WltHealth {
	readonly status: string;
	readonly service: string;
	readonly persistence?: string;
	readonly db?: string;
}

// ─── Legacy aliases kept for backward compat with existing screen consumers ──

/** @deprecated Use WltWalletSummary */
export type WltDshWalletSummary = WltWalletSummary;
/** @deprecated Use WltPaymentSession */
export type WltDshPaymentSession = WltPaymentSession;
/** @deprecated Use WltCreatePaymentSessionRequest */
export type WltDshPaymentSessionRequest = WltCreatePaymentSessionRequest;
/** @deprecated Use WltRefund */
export type WltDshRefundCase = WltRefund;
/** @deprecated Use WltCreateRefundRequest */
export type WltDshRefundRequest = WltCreateRefundRequest;
/** @deprecated Use WltSettlement */
export type WltDshSettlementCycle = WltSettlement;
/** @deprecated Use WltHealth */
export type WltDshHealth = WltHealth;
/** @deprecated Use WltLedgerEntry */
export type WltDshLedgerEntry = WltLedgerEntry;
/** @deprecated Use WltPayoutDecision */
export type WltDshPayoutDecisionResponse = WltPayoutDecision;
/** @deprecated Use WltReconciliationRun */
export type WltDshReconciliationRunResponse = WltReconciliationRun;
/** @deprecated Replaced by WltCloseStatus */
export type WltDshCloseStatus = WltCloseStatus;
/** @deprecated No direct equivalent — WLT finance overview is now listSettlements + wallets */
export type WltDshFinanceOverview = WltListSettlementsResponse;

// ─── Stubs for operator-only control-panel features not yet in WLT backend ───

export interface WltReconciliationRun {
	readonly id: string;
	readonly status: string;
	readonly created_at: string;
}

export interface WltPayoutDecisionRequest {
	readonly subject: string;
	readonly amount: number;
	readonly currency?: string;
	readonly reference?: string;
}

export interface WltPayoutDecision {
	readonly id: string;
	readonly subject: string;
	readonly amount: number;
	readonly currency: string;
	readonly status: string;
	readonly created_at: string;
}

export interface WltCloseStatus {
	readonly id: string;
	readonly business_date?: string;
	readonly status: 'open' | 'closed' | 'failed';
	readonly reconciliation_run_id?: string;
	readonly closed_at?: string;
}

export interface WltAuditEvent {
	readonly event_id: string;
	readonly target: string;
	readonly payload: Record<string, unknown>;
	readonly created_at: string;
}

export interface WltDailyCloseResult {
	readonly id: string;
	readonly business_date: string;
	readonly status: 'closed' | 'failed';
	readonly reconciliation_run_id?: string;
	readonly closed_at?: string;
}

// ─── Client interface ─────────────────────────────────────────────────────────

export type WltDshFetch = typeof fetch;

export interface WltDshTypedClientOptions {
	readonly baseUrl?: string;
	readonly bearerToken?: string;
	readonly devClientId?: string;
	readonly fetchImpl?: WltDshFetch;
}

export interface WltDshTypedClient {
	// Health
	getHealth(): Promise<WltHealth>;

	// Wallet (own subject or operator any subject)
	getClientWalletSummary(subject?: string): Promise<WltWalletSummary>;
	listLedgerEntries(subject?: string, limit?: number, offset?: number): Promise<WltListLedgerResponse>;
	// Operator-only: all ledger entries across all subjects (GET /ledger)
	listAllLedgerEntries(subject?: string, limit?: number, offset?: number): Promise<WltListLedgerResponse>;

	// Payment sessions
	createClientPaymentSession(input: WltCreatePaymentSessionRequest): Promise<WltPaymentSession>;
	getClientPaymentSession(id: string): Promise<WltPaymentSession>;
	confirmPaymentSession(id: string, providerRef: string): Promise<WltPaymentSession>;
	subscribePaymentSession(id: string, onUpdate: (status: string) => void): () => void;

	// Refunds (operator: full list; client: own only)
	listRefundQueue(clientId?: string, status?: string): Promise<WltListRefundsResponse>;
	createRefund(input: WltCreateRefundRequest): Promise<WltRefund>;
	getRefund(id: string): Promise<WltRefund>;

	// Settlements (operator only)
	listSettlements(partnerId?: string, captainId?: string, status?: string): Promise<WltListSettlementsResponse>;
	getSettlement(id: string): Promise<WltSettlement>;

	// Captain convenience (reads from wallet + transactions)
	getCaptainWalletSummary(captainId?: string): Promise<WltWalletSummary>;
	listCaptainEarnings(captainId?: string, limit?: number): Promise<WltListLedgerResponse>;

	// Partner convenience
	getPartnerWalletSummary(partnerId?: string): Promise<WltWalletSummary>;
	listPartnerSettlements(partnerId?: string): Promise<WltListSettlementsResponse>;

	// Field agent convenience
	getFieldWalletSummary(fieldAgentId?: string): Promise<WltWalletSummary>;
	listFieldEarnings(fieldAgentId?: string, limit?: number): Promise<WltListLedgerResponse>;

	// Operator control-panel stubs (not yet implemented in WLT backend)
	listReconciliationRuns(): Promise<WltReconciliationRun[]>;
	triggerReconciliationRun(idempotencyKey: string): Promise<WltReconciliationRun>;
	createPayoutDecision(input: WltPayoutDecisionRequest, idempotencyKey: string): Promise<WltPayoutDecision>;
	getReconciliationCloseStatus(): Promise<WltCloseStatus>;
	listAuditEvents(): Promise<WltAuditEvent[]>;
	submitDailyClose(businessDate?: string): Promise<WltDailyCloseResult>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function trimBaseUrl(url: string): string {
	return url.replace(/\/$/, '');
}

export function resolveWltDshApiBaseUrl(): string {
	if (typeof process !== 'undefined') {
		const env = (process as { env?: Record<string, string | undefined> }).env;
		const raw =
			env?.NEXT_PUBLIC_WLT_DSH_API_BASE_URL ??
			env?.EXPO_PUBLIC_WLT_DSH_API_BASE_URL;
		const trimmed = raw?.trim();
		if (trimmed) return trimBaseUrl(trimmed);
	}
	return 'http://localhost:8083';
}

async function readJson<T>(response: Response, label: string): Promise<T> {
	if (!response.ok) {
		const body = await response.text().catch(() => '');
		throw new Error(`${label}: ${response.status}${body ? ` — ${body}` : ''}`);
	}
	return response.json() as Promise<T>;
}

function authHeaders(bearerToken?: string, devClientId?: string): Record<string, string> {
	if (bearerToken) return { Authorization: `Bearer ${bearerToken}` };
	if (devClientId) return { 'X-Client-Id': devClientId };
	return {};
}

function idempotencyHeader(key?: string): Record<string, string> {
	return key ? { 'Idempotency-Key': key } : {};
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createWltDshTypedClient(options: WltDshTypedClientOptions): WltDshTypedClient {
	const fetchImpl = options.fetchImpl ?? fetch;
	const base = trimBaseUrl(options.baseUrl ?? resolveWltDshApiBaseUrl());
	const hdrs = authHeaders(options.bearerToken, options.devClientId);

	async function get<T>(path: string, label: string): Promise<T> {
		const res = await fetchImpl(`${base}${path}`, { headers: hdrs });
		return readJson<T>(res, label);
	}

	async function post<T>(path: string, body: unknown, label: string, idempKey?: string): Promise<T> {
		const res = await fetchImpl(`${base}${path}`, {
			method: 'POST',
			headers: { ...hdrs, ...idempotencyHeader(idempKey), 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		return readJson<T>(res, label);
	}

	return {
		getHealth() {
			return get<WltHealth>('/health', 'WLT health');
		},

		getClientWalletSummary(subject = 'me') {
			return get<WltWalletSummary>(`/wallets/${encodeURIComponent(subject)}/summary`, 'WLT wallet summary');
		},

		listLedgerEntries(subject = 'me', limit = 50, offset = 0) {
			const q = new URLSearchParams({ limit: String(limit), offset: String(offset) });
			return get<WltListLedgerResponse>(`/wallets/${encodeURIComponent(subject)}/transactions?${q}`, 'WLT ledger entries');
		},

		listAllLedgerEntries(subject, limit = 100, offset = 0) {
			const q = new URLSearchParams({ limit: String(limit), offset: String(offset) });
			if (subject) q.set('subject', subject);
			return get<WltListLedgerResponse>('/ledger?' + q.toString(), 'WLT ledger all');
		},

		createClientPaymentSession(input) {
			return post<WltPaymentSession>('/payment/sessions', input, 'WLT payment session', input.idempotency_key);
		},

		getClientPaymentSession(id) {
			return get<WltPaymentSession>(`/payment/sessions/${encodeURIComponent(id)}`, 'WLT payment session lookup');
		},

		confirmPaymentSession(id, providerRef) {
			return post<WltPaymentSession>(`/payment/sessions/${encodeURIComponent(id)}/confirm`, { provider_ref: providerRef }, 'WLT payment session confirm');
		},

		subscribePaymentSession(id, onUpdate) {
			const wsUrl = base.replace(/^http/, 'ws') + `/payment/sessions/${encodeURIComponent(id)}/ws`;
			let closed = false;
			let ws: WebSocket | null = null;
			let reconnectTimer: any = null;

			function connect() {
				if (closed) return;
				ws = new WebSocket(wsUrl);
				ws.onmessage = (event) => {
					try {
						const data = JSON.parse(event.data);
						if (data && typeof data.status === 'string') {
							onUpdate(data.status);
						}
					} catch (err) {
						console.error('Failed to parse WebSocket message:', err);
					}
				};
				ws.onclose = () => {
					if (!closed) {
						reconnectTimer = setTimeout(connect, 2000);
					}
				};
				ws.onerror = (err) => {
					console.error('WebSocket error for session:', id, err);
				};
			}

			connect();

			return () => {
				closed = true;
				if (reconnectTimer) clearTimeout(reconnectTimer);
				if (ws) ws.close();
			};
		},

		listRefundQueue(clientId, status) {
			const q = new URLSearchParams();
			if (clientId) q.set('client_id', clientId);
			if (status) q.set('status', status);
			const qs = q.toString();
			return get<WltListRefundsResponse>('/refunds' + (qs ? '?' + qs : ''), 'WLT refund queue');
		},

		createRefund(input) {
			return post<WltRefund>('/refunds', input, 'WLT refund create', input.idempotency_key);
		},

		getRefund(id) {
			return get<WltRefund>(`/refunds/${encodeURIComponent(id)}`, 'WLT refund lookup');
		},

		listSettlements(partnerId, captainId, status) {
			const q = new URLSearchParams();
			if (partnerId) q.set('partner_id', partnerId);
			if (captainId) q.set('captain_id', captainId);
			if (status) q.set('status', status);
			const qs = q.toString();
			return get<WltListSettlementsResponse>('/settlements' + (qs ? '?' + qs : ''), 'WLT settlements');
		},

		getSettlement(id) {
			return get<WltSettlement>(`/settlements/${encodeURIComponent(id)}`, 'WLT settlement lookup');
		},

		getCaptainWalletSummary(captainId = 'me') {
			return get<WltWalletSummary>(`/wallets/${encodeURIComponent(captainId)}/summary`, 'WLT captain wallet');
		},

		listCaptainEarnings(captainId = 'me', limit = 50) {
			const q = new URLSearchParams({ limit: String(limit) });
			return get<WltListLedgerResponse>(`/wallets/${encodeURIComponent(captainId)}/transactions?${q}`, 'WLT captain earnings');
		},

		getPartnerWalletSummary(partnerId = 'me') {
			return get<WltWalletSummary>(`/wallets/${encodeURIComponent(partnerId)}/summary`, 'WLT partner wallet');
		},

		listPartnerSettlements(partnerId) {
			const q = new URLSearchParams();
			if (partnerId) q.set('partner_id', partnerId);
			const qs = q.toString();
			return get<WltListSettlementsResponse>('/settlements' + (qs ? '?' + qs : ''), 'WLT partner settlements');
		},

		getFieldWalletSummary(fieldAgentId = 'me') {
			return get<WltWalletSummary>(`/wallets/${encodeURIComponent(fieldAgentId)}/summary`, 'WLT field wallet');
		},

		listFieldEarnings(fieldAgentId = 'me', limit = 50) {
			const q = new URLSearchParams({ limit: String(limit) });
			return get<WltListLedgerResponse>(`/wallets/${encodeURIComponent(fieldAgentId)}/transactions?${q}`, 'WLT field earnings');
		},

		// ── Operator control-panel endpoints ────────────────────────

		listReconciliationRuns() {
			return get<WltReconciliationRun[]>('/control-panel/reconciliation-runs', 'WLT reconciliation runs list');
		},

		triggerReconciliationRun(idempotencyKey) {
			return post<WltReconciliationRun>('/control-panel/reconciliation-runs', {}, 'WLT reconciliation run trigger', idempotencyKey);
		},

		createPayoutDecision(input, idempotencyKey) {
			return post<WltPayoutDecision>('/control-panel/payout-decisions', input, 'WLT payout decision create', idempotencyKey);
		},

		getReconciliationCloseStatus() {
			return get<WltCloseStatus>('/control-panel/reconciliation-close-status', 'WLT close status');
		},

		listAuditEvents() {
			return get<WltAuditEvent[]>('/control-panel/audit-events', 'WLT audit events');
		},

		submitDailyClose(businessDate) {
			return post<WltDailyCloseResult>('/control-panel/daily-close', { businessDate }, 'WLT daily close submit');
		},
	};
}
