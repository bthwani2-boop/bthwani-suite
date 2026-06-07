import { createWltDshTypedClient, type WltLedgerEntry } from '../contracts';
import {
	formatWltYer,
	getWltCaptainFinanceSnapshot,
	type WltCaptainFinanceSection,
	type WltCaptainFinanceSnapshot,
	type WltDshFinancePreviewRecord,
} from '../control-panel/financeContracts';

const DEFAULT_CAPTAIN_ID = 'captain-demo';

function getClient(bearerToken?: string | null, devClientId?: string | null) {
	return createWltDshTypedClient({
		bearerToken: bearerToken || undefined,
		devClientId: devClientId || undefined,
	});
}

function earningRecord(entry: WltLedgerEntry): WltDshFinancePreviewRecord {
	const amount = Math.round(entry.amount * 100);
	return {
		id: entry.id,
		actor: 'captain',
		kind: 'captain-earning',
		currencyCode: entry.currency,
		amountMinorUnits: amount,
		amountLabel: formatWltYer(amount),
		tone: entry.transaction_type === 'CREDIT' ? 'positive' : 'negative',
		title: `Ø£Ø±Ø¨Ø§Ø­ ÙƒØ§Ø¨ØªÙ† Â· ${entry.subject}`,
		subtitle: `WLT runtime Â· ${entry.reference_type}`,
		statusLabel: entry.status,
		statusTone: entry.status === 'COMPLETED' ? 'success' : 'warning',
		timeLabel: entry.created_at,
		sourceOrderId: entry.order_id,
		sourceCaptainId: entry.subject,
		isPreview: false,
	};
}

export async function getSnapshot(captainId?: string | null, bearerToken?: string | null): Promise<WltCaptainFinanceSnapshot> {
	const activeCaptainId = captainId || DEFAULT_CAPTAIN_ID;
	const [walletSummary, earningsResponse] = await Promise.all([
		getClient(bearerToken, activeCaptainId).getCaptainWalletSummary(activeCaptainId),
		getClient(bearerToken, activeCaptainId).listCaptainEarnings(activeCaptainId),
	]);
	const previewFallback = getWltCaptainFinanceSnapshot();
	const earningsMinorUnits = earningsResponse.entries
		.filter((e) => e.transaction_type === 'CREDIT')
		.reduce((sum, e) => sum + Math.round(e.amount * 100), 0);
	const balanceMinorUnits = Math.round(walletSummary.balance * 100);

	return {
		...previewFallback,
		// COD liability concept is tracked by WLT internally; captain surface shows balance instead.
		codLiabilityMinorUnits: 0,
		codLiabilityLabel: formatWltYer(0),
		earningsMinorUnits,
		earningsLabel: formatWltYer(earningsMinorUnits),
		pendingPayoutMinorUnits: balanceMinorUnits,
		pendingPayoutLabel: formatWltYer(balanceMinorUnits),
		eligibilityBalanceMinorUnits: balanceMinorUnits,
		eligibilityBalanceLabel: formatWltYer(balanceMinorUnits),
		isEligible: walletSummary.balance >= 0,
		eligibilityShortfallMinorUnits: 0,
		eligibilityShortfallLabel: formatWltYer(0),
		hasEligibilityBlock: false,
		eligibilityBlockReason: '',
		contractState: 'CONTRACT_TBD',
		isPreview: false,
	};
}

export async function getRecords(captainId?: string | null, bearerToken?: string | null): Promise<WltDshFinancePreviewRecord[]> {
	const activeCaptainId = captainId || DEFAULT_CAPTAIN_ID;
	const { entries } = await getClient(bearerToken, activeCaptainId).listCaptainEarnings(activeCaptainId);
	return entries.map(earningRecord);
}

export function getSections() {
	return ['eligibility', 'cod-liability', 'earnings', 'settlement'] as const satisfies readonly WltCaptainFinanceSection[];
}

export async function getRecordsForSection(section: WltCaptainFinanceSection, captainId?: string | null, bearerToken?: string | null): Promise<WltDshFinancePreviewRecord[]> {
	const records = await getRecords(captainId, bearerToken);
	if (section === 'earnings') return records.filter((r) => r.kind === 'captain-earning');
	// cod-liability and settlement stubs â€” WLT COD tracking not yet surfaced via captain endpoint
	return [];
}

export async function topUp(amountMinorUnits?: number, captainId?: string | null, bearerToken?: string | null): Promise<{ success: boolean; error: string; snapshot: WltCaptainFinanceSnapshot }> {
	return {
		success: false,
		error: 'wlt_captain_top_up_out_of_scope_for_dsh_runtime_slice',
		snapshot: await getSnapshot(captainId, bearerToken),
	};
}

export async function requestSettlement(captainId?: string | null, bearerToken?: string | null): Promise<{ success: boolean; error: string; snapshot: WltCaptainFinanceSnapshot }> {
	return {
		success: false,
		error: 'wlt_payout_decision_requires_control_panel_wlt_operation',
		snapshot: await getSnapshot(captainId, bearerToken),
	};
}

export async function resetFinance(captainId?: string | null, bearerToken?: string | null): Promise<{ snapshot: WltCaptainFinanceSnapshot }> {
	return { snapshot: await getSnapshot(captainId, bearerToken) };
}

const WltDshCaptainAdapter = {
	getSnapshot,
	getRecords,
	getSections,
	getRecordsForSection,
	topUp,
	requestSettlement,
	resetFinance,
};

export default WltDshCaptainAdapter;
