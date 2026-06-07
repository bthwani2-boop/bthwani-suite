// Compatibility transport for WLT-DSH runtime calls.
// Runtime ownership lives in wlt/frontend/contracts/wlt-dsh-client.ts.

export {
	createWltDshTypedClient,
	resolveWltDshApiBaseUrl,
	type WltDshCloseStatus,
	type WltDshFinanceOverview,
	type WltDshHealth,
	type WltDshLedgerEntry,
	type WltDshPaymentSession,
	type WltDshPaymentSessionRequest,
	type WltDshPayoutDecisionRequest,
	type WltDshPayoutDecisionResponse,
	type WltDshReconciliationRunResponse,
	type WltDshRefundCase,
	type WltDshRefundRequest,
	type WltDshTypedClient,
	type WltDshTypedClientOptions,
	type WltDshWalletSummary,
} from '../contracts';

export const WLT_CURRENCY = 'YER';

export function wltFormatYer(minorUnits: number): string {
	return `${(minorUnits / 100).toLocaleString('ar-YE')} ر.ي`;
}
