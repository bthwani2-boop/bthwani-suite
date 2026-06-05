import type { paths } from './wlt-dsh-openapi.types';

type JsonBody<T> = T extends { content: { 'application/json': infer Body } } ? Body : never;
type JsonResponse<T, Status extends number> = T extends { responses: Record<Status, { content: { 'application/json': infer Body } }> } ? Body : never;

type WalletSummary = JsonResponse<paths['/wlt/dsh/client/wallet/summary']['get'], 200>;
type PaymentSessionRequest = JsonBody<NonNullable<paths['/wlt/dsh/client/payment-sessions']['post']['requestBody']>>;
type PaymentSession = JsonResponse<paths['/wlt/dsh/client/payment-sessions']['post'], 201>;
type FinanceOverview = JsonResponse<paths['/wlt/dsh/control-panel/finance/overview']['get'], 200>;
type ReconciliationRun = JsonResponse<paths['/wlt/dsh/control-panel/reconciliation-runs']['post'], 201>;
type PayoutDecisionRequest = JsonBody<NonNullable<paths['/wlt/dsh/control-panel/payout-decisions']['post']['requestBody']>>;
type PayoutDecision = JsonResponse<paths['/wlt/dsh/control-panel/payout-decisions']['post'], 201>;

export type WltDshFetch = typeof fetch;

export interface WltDshHealth {
	readonly status: 'ok' | string;
	readonly service: string;
	readonly persistence?: string;
	readonly db?: string;
	readonly runtimeTruth: string;
}

export interface WltDshLedgerEntry {
	readonly id: string;
	readonly kind: string;
	readonly orderId?: string;
	readonly actorId: string;
	readonly actorKind: 'client' | 'partner' | 'captain' | 'field' | 'platform' | string;
	readonly debitMinorUnits: number;
	readonly creditMinorUnits: number;
	readonly currency: string;
	readonly status: string;
	readonly createdAt: string;
	readonly referenceId?: string;
}

export interface WltDshRefundRequest {
	readonly orderId: string;
	readonly clientId: string;
	readonly storeId: string;
	readonly amountMinorUnits: number;
	readonly currency?: string;
	readonly reason: string;
}

export interface WltDshRefundCase {
	readonly refundRefId: string;
	readonly orderId: string;
	readonly clientId: string;
	readonly storeId: string;
	readonly amountMinorUnits: number;
	readonly currency: string;
	readonly status: string;
	readonly reason: string;
	readonly createdAt: string;
	readonly callbackEvent?: unknown;
}

export interface WltDshCodLiability {
	readonly id: string;
	readonly captainId: string;
	readonly orderId: string;
	readonly amountMinorUnits: number;
	readonly currency: string;
	readonly status: string;
	readonly createdAt: string;
}

export interface WltDshCaptainEligibility {
	readonly captainId: string;
	readonly eligible: boolean;
	readonly heldMinorUnits: number;
	readonly currency: string;
	readonly updatedAt: string;
}

export interface WltDshSettlementCycle {
	readonly id: string;
	readonly ownerId: string;
	readonly ownerKind: 'partner' | 'captain' | 'field' | string;
	readonly orderIds: readonly string[];
	readonly netPayableMinorUnits: number;
	readonly currency: string;
	readonly status: string;
	readonly createdAt: string;
}

export interface WltDshCloseStatus {
	readonly id: string;
	readonly businessDate?: string;
	readonly status: string;
}

export interface WltDshTypedClientOptions {
	readonly baseUrl?: string;
	readonly bearerToken?: string;
	readonly fetchImpl?: WltDshFetch;
}

export interface WltDshTypedClient {
	getHealth(): Promise<WltDshHealth>;
	getClientWalletSummary(clientId?: string): Promise<WalletSummary>;
	createClientPaymentSession(input: PaymentSessionRequest, idempotencyKey?: string): Promise<PaymentSession>;
	getClientPaymentSession(id: string): Promise<PaymentSession>;
	getFinanceOverview(): Promise<FinanceOverview>;
	listRefundQueue(): Promise<WltDshRefundCase[]>;
	createRefund(input: WltDshRefundRequest, idempotencyKey?: string): Promise<WltDshRefundCase>;
	listCaptainCodLiabilities(captainId?: string): Promise<WltDshCodLiability[]>;
	getCaptainEligibility(captainId?: string): Promise<WltDshCaptainEligibility>;
	listCaptainEarnings(captainId?: string): Promise<WltDshLedgerEntry[]>;
	listPartnerSettlementCycles(partnerId?: string): Promise<WltDshSettlementCycle[]>;
	listFieldCommissions(fieldAgentId?: string): Promise<WltDshSettlementCycle[]>;
	listReconciliationRuns(): Promise<ReconciliationRun[]>;
	triggerReconciliationRun(idempotencyKey: string): Promise<ReconciliationRun>;
	createPayoutDecision(input: PayoutDecisionRequest, idempotencyKey: string): Promise<PayoutDecision>;
	listLedgerEntries(): Promise<WltDshLedgerEntry[]>;
	getReconciliationCloseStatus(): Promise<WltDshCloseStatus>;
}

function trimBaseUrl(baseUrl: string): string {
	return baseUrl.replace(/\/$/, '');
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

	return 'http://localhost:8090';
}

function idempotencyHeaders(idempotencyKey?: string): Record<string, string> {
	return idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {};
}

async function readJson<T>(response: Response, label: string): Promise<T> {
	if (!response.ok) {
		const body = await response.text().catch(() => '');
		throw new Error(`${label}: ${response.status}${body ? ` ${body}` : ''}`);
	}
	return response.json() as Promise<T>;
}

export function createWltDshTypedClient(options: WltDshTypedClientOptions): WltDshTypedClient {
	const fetchImpl = options.fetchImpl ?? fetch;
	const baseUrl = trimBaseUrl(options.baseUrl ?? resolveWltDshApiBaseUrl());
	const authHeaders: Record<string, string> = options.bearerToken
		? { Authorization: `Bearer ${options.bearerToken}` }
		: {};

	return {
		async getHealth() {
			return readJson<WltDshHealth>(
				await fetchImpl(`${baseUrl}/wlt/health`, { headers: authHeaders }),
				'WLT health',
			);
		},
		async getClientWalletSummary(clientId = 'client-demo') {
			const url = `${baseUrl}/wlt/dsh/client/wallet/summary?clientId=${encodeURIComponent(clientId)}`;
			return readJson<WalletSummary>(await fetchImpl(url, { headers: authHeaders }), 'WLT wallet summary');
		},
		async createClientPaymentSession(input, idempotencyKey) {
			return readJson<PaymentSession>(
				await fetchImpl(`${baseUrl}/wlt/dsh/client/payment-sessions`, {
					method: 'POST',
					headers: { ...authHeaders, ...idempotencyHeaders(idempotencyKey), 'Content-Type': 'application/json' },
					body: JSON.stringify(input),
				}),
				'WLT payment session',
			);
		},
		async getClientPaymentSession(id) {
			return readJson<PaymentSession>(
				await fetchImpl(`${baseUrl}/wlt/dsh/client/payment-sessions/${encodeURIComponent(id)}`, { headers: authHeaders }),
				'WLT payment session lookup',
			);
		},
		async getFinanceOverview() {
			return readJson<FinanceOverview>(
				await fetchImpl(`${baseUrl}/wlt/dsh/control-panel/finance/overview`, { headers: authHeaders }),
				'WLT DSH finance overview',
			);
		},
		async listRefundQueue() {
			return readJson<WltDshRefundCase[]>(
				await fetchImpl(`${baseUrl}/wlt/dsh/control-panel/refund-queue`, { headers: authHeaders }),
				'WLT refund queue',
			);
		},
		async createRefund(input, idempotencyKey) {
			return readJson<WltDshRefundCase>(
				await fetchImpl(`${baseUrl}/wlt/dsh/control-panel/refund-queue`, {
					method: 'POST',
					headers: { ...authHeaders, ...idempotencyHeaders(idempotencyKey), 'Content-Type': 'application/json' },
					body: JSON.stringify(input),
				}),
				'WLT refund request',
			);
		},
		async listCaptainCodLiabilities(captainId = 'captain-demo') {
			return readJson<WltDshCodLiability[]>(
				await fetchImpl(`${baseUrl}/wlt/dsh/captain/cod-liabilities?captainId=${encodeURIComponent(captainId)}`, { headers: authHeaders }),
				'WLT captain COD liabilities',
			);
		},
		async getCaptainEligibility(captainId = 'captain-demo') {
			return readJson<WltDshCaptainEligibility>(
				await fetchImpl(`${baseUrl}/wlt/dsh/captain/eligibility?captainId=${encodeURIComponent(captainId)}`, { headers: authHeaders }),
				'WLT captain eligibility',
			);
		},
		async listCaptainEarnings(captainId = 'captain-demo') {
			return readJson<WltDshLedgerEntry[]>(
				await fetchImpl(`${baseUrl}/wlt/dsh/captain/earnings?captainId=${encodeURIComponent(captainId)}`, { headers: authHeaders }),
				'WLT captain earnings',
			);
		},
		async listPartnerSettlementCycles(partnerId = 'partner-demo') {
			return readJson<WltDshSettlementCycle[]>(
				await fetchImpl(`${baseUrl}/wlt/dsh/partner/settlement-cycles?partnerId=${encodeURIComponent(partnerId)}`, { headers: authHeaders }),
				'WLT partner settlement cycles',
			);
		},
		async listFieldCommissions(fieldAgentId = 'field-demo') {
			return readJson<WltDshSettlementCycle[]>(
				await fetchImpl(`${baseUrl}/wlt/dsh/field/commissions?fieldAgentId=${encodeURIComponent(fieldAgentId)}`, { headers: authHeaders }),
				'WLT field commissions',
			);
		},
		async listReconciliationRuns() {
			return readJson<ReconciliationRun[]>(
				await fetchImpl(`${baseUrl}/wlt/dsh/control-panel/reconciliation-runs`, { headers: authHeaders }),
				'WLT reconciliation runs',
			);
		},
		async triggerReconciliationRun(idempotencyKey) {
			return readJson<ReconciliationRun>(
				await fetchImpl(`${baseUrl}/wlt/dsh/control-panel/reconciliation-runs`, {
					method: 'POST',
					headers: { ...authHeaders, ...idempotencyHeaders(idempotencyKey), 'Content-Type': 'application/json' },
					body: JSON.stringify({}),
				}),
				'WLT reconciliation run',
			);
		},
		async createPayoutDecision(input, idempotencyKey) {
			return readJson<PayoutDecision>(
				await fetchImpl(`${baseUrl}/wlt/dsh/control-panel/payout-decisions`, {
					method: 'POST',
					headers: { ...authHeaders, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
					body: JSON.stringify(input),
				}),
				'WLT payout decision',
			);
		},
		async listLedgerEntries() {
			return readJson<WltDshLedgerEntry[]>(
				await fetchImpl(`${baseUrl}/wlt/dsh/control-panel/ledger-entries`, { headers: authHeaders }),
				'WLT ledger entries',
			);
		},
		async getReconciliationCloseStatus() {
			return readJson<WltDshCloseStatus>(
				await fetchImpl(`${baseUrl}/wlt/dsh/control-panel/reconciliation-close-status`, { headers: authHeaders }),
				'WLT reconciliation close status',
			);
		},
	};
}

export type {
	FinanceOverview as WltDshFinanceOverview,
	PaymentSession as WltDshPaymentSession,
	PaymentSessionRequest as WltDshPaymentSessionRequest,
	PayoutDecision as WltDshPayoutDecisionResponse,
	PayoutDecisionRequest as WltDshPayoutDecisionRequest,
	ReconciliationRun as WltDshReconciliationRunResponse,
	WalletSummary as WltDshWalletSummary,
};
