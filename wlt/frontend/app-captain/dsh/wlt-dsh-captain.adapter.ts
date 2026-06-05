import {
	createWltDshTypedClient,
	type WltDshCodLiability,
	type WltDshLedgerEntry,
} from '../../contracts';
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

function liabilityRecord(item: WltDshCodLiability): WltDshFinancePreviewRecord {
	return {
		id: item.id,
		actor: 'captain',
		kind: 'captain-cod-liability',
		currencyCode: item.currency,
		amountMinorUnits: item.amountMinorUnits,
		amountLabel: formatWltYer(item.amountMinorUnits),
		tone: 'negative',
		title: `ذمة COD · ${item.orderId}`,
		subtitle: `WLT runtime · ${item.status}`,
		statusLabel: item.status,
		statusTone: item.status === 'outstanding' ? 'warning' : 'success',
		timeLabel: item.createdAt,
		sourceOrderId: item.orderId,
		sourceCaptainId: item.captainId,
		isPreview: false,
	};
}

function earningRecord(item: WltDshLedgerEntry): WltDshFinancePreviewRecord {
	const amount = Math.max(item.debitMinorUnits, item.creditMinorUnits);
	return {
		id: item.id,
		actor: 'captain',
		kind: 'captain-earning',
		currencyCode: item.currency,
		amountMinorUnits: amount,
		amountLabel: formatWltYer(amount),
		tone: 'positive',
		title: `أرباح كابتن · ${item.actorId}`,
		subtitle: `WLT runtime · ${item.kind}`,
		statusLabel: item.status,
		statusTone: item.status === 'posted' ? 'success' : 'warning',
		timeLabel: item.createdAt,
		sourceOrderId: item.orderId,
		sourceCaptainId: item.actorId,
		isPreview: false,
	};
}

export async function getSnapshot(captainId = DEFAULT_CAPTAIN_ID): Promise<WltCaptainFinanceSnapshot> {
	const [eligibility, liabilities, earnings] = await Promise.all([
		getClient().getCaptainEligibility(captainId),
		getClient().listCaptainCodLiabilities(captainId),
		getClient().listCaptainEarnings(captainId),
	]);
	const previewFallback = getWltCaptainFinanceSnapshot();
	const codMinorUnits = liabilities.reduce((sum, item) => sum + item.amountMinorUnits, 0);
	const earningsMinorUnits = earnings.reduce((sum, item) => sum + Math.max(item.debitMinorUnits, item.creditMinorUnits), 0);

	return {
		...previewFallback,
		codLiabilityMinorUnits: codMinorUnits,
		codLiabilityLabel: formatWltYer(codMinorUnits),
		earningsMinorUnits,
		earningsLabel: formatWltYer(earningsMinorUnits),
		pendingPayoutMinorUnits: earningsMinorUnits,
		pendingPayoutLabel: formatWltYer(earningsMinorUnits),
		eligibilityBalanceMinorUnits: Math.max(previewFallback.minimumEligibilityMinorUnits - eligibility.heldMinorUnits, 0),
		eligibilityBalanceLabel: formatWltYer(Math.max(previewFallback.minimumEligibilityMinorUnits - eligibility.heldMinorUnits, 0)),
		isEligible: eligibility.eligible,
		eligibilityShortfallMinorUnits: eligibility.eligible ? 0 : eligibility.heldMinorUnits,
		eligibilityShortfallLabel: formatWltYer(eligibility.eligible ? 0 : eligibility.heldMinorUnits),
		hasEligibilityBlock: !eligibility.eligible,
		eligibilityBlockReason: eligibility.eligible ? '' : 'WLT runtime حجب الأهلية بسبب ذمم COD معلقة.',
		contractState: 'CONTRACT_TBD',
		isPreview: false,
	};
}

export async function getRecords(captainId = DEFAULT_CAPTAIN_ID): Promise<WltDshFinancePreviewRecord[]> {
	const [liabilities, earnings] = await Promise.all([
		getClient().listCaptainCodLiabilities(captainId),
		getClient().listCaptainEarnings(captainId),
	]);
	return [...liabilities.map(liabilityRecord), ...earnings.map(earningRecord)];
}

export function getSections() {
	return ['eligibility', 'cod-liability', 'earnings', 'settlement'] as const satisfies readonly WltCaptainFinanceSection[];
}

export async function getRecordsForSection(section: WltCaptainFinanceSection): Promise<WltDshFinancePreviewRecord[]> {
	const records = await getRecords();
	if (section === 'cod-liability') return records.filter((record) => record.kind === 'captain-cod-liability');
	if (section === 'earnings') return records.filter((record) => record.kind === 'captain-earning');
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
