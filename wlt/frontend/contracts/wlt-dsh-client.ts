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

export interface WltDshTypedClientOptions {
	readonly baseUrl: string;
	readonly bearerToken?: string;
	readonly fetchImpl?: typeof fetch;
}

export interface WltDshTypedClient {
	getClientWalletSummary(clientId?: string): Promise<WalletSummary>;
	createClientPaymentSession(input: PaymentSessionRequest, idempotencyKey: string): Promise<PaymentSession>;
	getFinanceOverview(): Promise<FinanceOverview>;
	triggerReconciliationRun(idempotencyKey: string): Promise<ReconciliationRun>;
	createPayoutDecision(input: PayoutDecisionRequest, idempotencyKey: string): Promise<PayoutDecision>;
}

function trimBaseUrl(baseUrl: string): string {
	return baseUrl.replace(/\/$/, '');
}

async function readJson<T>(response: Response, label: string): Promise<T> {
	if (!response.ok) throw new Error(`${label}: ${response.status}`);
	return response.json() as Promise<T>;
}

export function createWltDshTypedClient(options: WltDshTypedClientOptions): WltDshTypedClient {
	const fetchImpl = options.fetchImpl ?? fetch;
	const baseUrl = trimBaseUrl(options.baseUrl);
	const authHeaders = options.bearerToken ? { Authorization: `Bearer ${options.bearerToken}` } : {};

	return {
		async getClientWalletSummary(clientId = 'client-demo') {
			const url = `${baseUrl}/wlt/dsh/client/wallet/summary?clientId=${encodeURIComponent(clientId)}`;
			return readJson<WalletSummary>(await fetchImpl(url, { headers: authHeaders }), 'WLT wallet summary');
		},
		async createClientPaymentSession(input, idempotencyKey) {
			return readJson<PaymentSession>(
				await fetchImpl(`${baseUrl}/wlt/dsh/client/payment-sessions`, {
					method: 'POST',
					headers: { ...authHeaders, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
					body: JSON.stringify(input),
				}),
				'WLT payment session',
			);
		},
		async getFinanceOverview() {
			return readJson<FinanceOverview>(
				await fetchImpl(`${baseUrl}/wlt/dsh/control-panel/finance/overview`, { headers: authHeaders }),
				'WLT DSH finance overview',
			);
		},
		async triggerReconciliationRun(idempotencyKey) {
			return readJson<ReconciliationRun>(
				await fetchImpl(`${baseUrl}/wlt/dsh/control-panel/reconciliation-runs`, {
					method: 'POST',
					headers: { ...authHeaders, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
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
