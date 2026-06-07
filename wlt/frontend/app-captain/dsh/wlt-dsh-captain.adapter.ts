import { createWltDshTypedClient, type WltLedgerEntry } from '../../contracts';
import {
	formatWltYer,
	getWltCaptainFinanceSnapshot,
	type WltCaptainFinanceSection,
	type WltCaptainFinanceSnapshot,
	type WltDshFinancePreviewRecord,
} from '../../control-panel/dsh/financeContracts';

const DEFAULT_CAPTAIN_ID = 'captain-demo';

function getClient() {
	return createWltDshTypedClient({});
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
		title: `أرباح كابتن · ${entry.subject}`,
		subtitle: `WLT runtime · ${entry.reference_type}`,
		statusLabel: entry.status,
		statusTone: entry.status === 'COMPLETED' ? 'success' : 'warning',
		timeLabel: entry.created_at,
		sourceOrderId: entry.order_id,
		sourceCaptainId: entry.subject,
		isPreview: false,
	};
}

export async function getSnapshot(captainId = DEFAULT_CAPTAIN_ID): Promise<WltCaptainFinanceSnapshot> {
	const [walletSummary, earningsResponse] = await Promise.all([
		getClient().getCaptainWalletSummary(captainId),
		getClient().listCaptainEarnings(captainId),
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

export async function getRecords(captainId = DEFAULT_CAPTAIN_ID): Promise<WltDshFinancePreviewRecord[]> {
	const { entries } = await getClient().listCaptainEarnings(captainId);
	return entries.map(earningRecord);
}

export function getSections() {
	return ['eligibility', 'cod-liability', 'earnings', 'settlement'] as const satisfies readonly WltCaptainFinanceSection[];
}

export async function getRecordsForSection(section: WltCaptainFinanceSection): Promise<WltDshFinancePreviewRecord[]> {
	const records = await getRecords();
	if (section === 'earnings') return records.filter((r) => r.kind === 'captain-earning');
	// cod-liability and settlement stubs — WLT COD tracking not yet surfaced via captain endpoint
	return [];
}

export async function topUp(): Promise<{ success: boolean; error: string; snapshot: WltCaptainFinanceSnapshot }> {
	return {
		success: false,
		error: 'wlt_captain_top_up_out_of_scope_for_dsh_runtime_slice',
		snapshot: await getSnapshot(),
	};
}

export async function requestSettlement(): Promise<{ success: boolean; error: string; snapshot: WltCaptainFinanceSnapshot }> {
	return {
		success: false,
		error: 'wlt_payout_decision_requires_control_panel_wlt_operation',
		snapshot: await getSnapshot(),
	};
}

export async function resetFinance(): Promise<{ snapshot: WltCaptainFinanceSnapshot }> {
	return { snapshot: await getSnapshot() };
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
