import { createWltDshTypedClient, type WltDshSettlementCycle } from '../../contracts';
import {
	formatWltYer,
	getWltFieldFinanceSnapshot,
	type WltDshFinancePreviewRecord,
	type WltFieldFinanceSnapshot,
} from '../../control-panel/dsh/financeContracts';

const DEFAULT_FIELD_AGENT_ID = 'field-demo';

function commissionRecord(cycle: WltDshSettlementCycle): WltDshFinancePreviewRecord {
	return {
		id: cycle.id,
		actor: 'field',
		kind: cycle.status === 'ready_for_payout' || cycle.status === 'paid' ? 'field-commission' : 'field-commission-pending',
		currencyCode: cycle.currency,
		amountMinorUnits: cycle.netPayableMinorUnits,
		amountLabel: formatWltYer(cycle.netPayableMinorUnits),
		tone: 'positive',
		title: `عمولة ميداني · ${cycle.ownerId}`,
		subtitle: `WLT runtime · ${cycle.status}`,
		statusLabel: cycle.status,
		statusTone: cycle.status === 'ready_for_payout' || cycle.status === 'paid' ? 'success' : 'warning',
		timeLabel: cycle.createdAt,
		sourceFieldAgentId: cycle.ownerId,
		settlementCycleId: cycle.id,
		isPreview: false,
	};
}

export async function getSnapshot(fieldAgentId = DEFAULT_FIELD_AGENT_ID): Promise<WltFieldFinanceSnapshot> {
	const cycles = await createWltDshTypedClient({}).listFieldCommissions(fieldAgentId);
	const records = cycles.map(commissionRecord);
	const fallback = getWltFieldFinanceSnapshot();
	const totalCommissionMinorUnits = records
		.filter((record) => record.kind === 'field-commission')
		.reduce((sum, record) => sum + record.amountMinorUnits, 0);
	const pendingCommissionsMinorUnits = records
		.filter((record) => record.kind === 'field-commission-pending')
		.reduce((sum, record) => sum + record.amountMinorUnits, 0);

	return {
		...fallback,
		records,
		commissionRecords: records.filter((record) => record.kind === 'field-commission'),
		pendingRecords: records.filter((record) => record.kind === 'field-commission-pending'),
		rejectedRecords: [],
		payoutRecords: records.filter((record) => record.kind === 'field-payout'),
		totalCommissionMinorUnits,
		totalCommissionLabel: formatWltYer(totalCommissionMinorUnits),
		pendingCommissionsMinorUnits,
		pendingCommissionsLabel: formatWltYer(pendingCommissionsMinorUnits),
		rejectedCommissionsMinorUnits: 0,
		rejectedCommissionsLabel: formatWltYer(0),
		eligibleFilesCount: records.length,
		lastPayoutMinorUnits: totalCommissionMinorUnits,
		lastPayoutLabel: formatWltYer(totalCommissionMinorUnits),
		contractState: 'CONTRACT_TBD',
		isPreview: false,
	};
}

export async function getRecords(fieldAgentId?: string): Promise<WltDshFinancePreviewRecord[]> {
	return (await getSnapshot(fieldAgentId)).records;
}

export async function getCommissionRecords(fieldAgentId?: string): Promise<WltDshFinancePreviewRecord[]> {
	return (await getSnapshot(fieldAgentId)).commissionRecords;
}

export async function getPendingCommissionRecords(fieldAgentId?: string): Promise<WltDshFinancePreviewRecord[]> {
	return (await getSnapshot(fieldAgentId)).pendingRecords;
}

export async function getRejectedCommissionRecords(fieldAgentId?: string): Promise<WltDshFinancePreviewRecord[]> {
	return (await getSnapshot(fieldAgentId)).rejectedRecords;
}

export async function getPayoutRecords(fieldAgentId?: string): Promise<WltDshFinancePreviewRecord[]> {
	return (await getSnapshot(fieldAgentId)).payoutRecords;
}

const WltDshFieldAdapter = {
	getSnapshot,
	getRecords,
	getCommissionRecords,
	getPendingCommissionRecords,
	getRejectedCommissionRecords,
	getPayoutRecords,
};

export default WltDshFieldAdapter;
