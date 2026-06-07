import {
	createWltDshTypedClient,
	resolveWltDshApiBaseUrl,
	type WltCloseStatus,
	type WltLedgerEntry as RuntimeLedgerEntry,
	type WltListSettlementsResponse,
	type WltRefund,
	type WltDshTypedClient,
} from '../../../contracts';
import { formatWltYer } from '../models/dshFinance.types';
import type {
	WltAccountPositionLine,
	WltFinancialCenter,
	WltFinancialCenterSection,
	WltLedgerEntry,
	WltLedgerEntryKind,
	WltLedgerEntryStatus,
} from '../models/financialCenter.types';

export type WltDshFinanceRuntimeReadModel = {
	readonly baseUrl: string;
	readonly overview: WltListSettlementsResponse;
	readonly ledgerEntries: readonly RuntimeLedgerEntry[];
	readonly refunds: readonly WltRefund[];
	readonly closeStatus: WltCloseStatus;
	readonly fetchedAt: string;
};

export type WltDshFinanceRuntimeResult =
	| { readonly state: 'runtime'; readonly data: WltDshFinanceRuntimeReadModel }
	| { readonly state: 'blocked'; readonly error: string; readonly baseUrl: string };

function getClient(): WltDshTypedClient {
	return createWltDshTypedClient({});
}

export async function loadWltDshFinanceRuntimeReadModel(): Promise<WltDshFinanceRuntimeResult> {
	const baseUrl = resolveWltDshApiBaseUrl();
	const client = getClient();

	try {
		const [overview, ledgerResp, refundsResp, closeStatus] = await Promise.all([
			client.listSettlements(),
			client.listAllLedgerEntries(),
			client.listRefundQueue(),
			client.getReconciliationCloseStatus(),
		]);

		return {
			state: 'runtime',
			data: {
				baseUrl,
				overview,
				ledgerEntries: ledgerResp.entries,
				refunds: refundsResp.refunds,
				closeStatus,
				fetchedAt: new Date().toISOString(),
			},
		};
	} catch (error) {
		return {
			state: 'blocked',
			baseUrl,
			error: error instanceof Error ? error.message : 'wlt_runtime_unavailable',
		};
	}
}

function mapEntryKind(referenceType: string): WltLedgerEntryKind {
	if (referenceType === 'payment_session') return 'wallet-movement';
	if (referenceType === 'refund') return 'refund';
	if (referenceType === 'settlement') return 'partner-settlement';
	return 'other';
}

function mapEntryStatus(status: string): WltLedgerEntryStatus {
	if (status === 'COMPLETED') return 'posted';
	if (status === 'FAILED') return 'blocked';
	if (status === 'REVERSED') return 'disputed';
	return 'pending';
}

function accountForDebit(referenceType: string): { code: string; label: string; type: WltFinancialCenterSection['sectionType'] } {
	if (referenceType === 'refund') return { code: '5001', label: 'مصروف الاسترداد', type: 'expense' };
	if (referenceType === 'settlement') return { code: '1030', label: 'مقاصة التسوية', type: 'asset' };
	return { code: '1010', label: 'رصيد المقاصة البنكية', type: 'asset' };
}

function accountForCredit(referenceType: string): { code: string; label: string; type: WltFinancialCenterSection['sectionType'] } {
	if (referenceType === 'payment_session') return { code: '2001', label: 'رصيد محفظة العميل', type: 'liability' };
	if (referenceType === 'settlement') return { code: '2020', label: 'مستحقات الشريك', type: 'liability' };
	if (referenceType === 'refund') return { code: '2050', label: 'التزام الاسترداد للعميل', type: 'liability' };
	return { code: '4001', label: 'إيرادات WLT', type: 'revenue' };
}

function accountTypeByCode(code: string): WltFinancialCenterSection['sectionType'] {
	if (code.startsWith('1')) return 'asset';
	if (code.startsWith('2')) return 'liability';
	if (code.startsWith('4')) return 'revenue';
	if (code.startsWith('5')) return 'expense';
	return 'asset';
}

function partyLabel(entry: RuntimeLedgerEntry): string {
	// subject encodes actor identity (e.g. "client-001", "captain-demo")
	if (entry.subject.startsWith('captain')) return `كابتن · ${entry.subject}`;
	if (entry.subject.startsWith('partner')) return `شريك · ${entry.subject}`;
	if (entry.subject.startsWith('field')) return `ميداني · ${entry.subject}`;
	if (entry.subject.startsWith('client')) return `عميل · ${entry.subject}`;
	return 'WLT';
}

function partyKind(entry: RuntimeLedgerEntry): WltLedgerEntry['partyKind'] {
	if (entry.subject.startsWith('captain')) return 'captain';
	if (entry.subject.startsWith('partner')) return 'partner';
	if (entry.subject.startsWith('field')) return 'field';
	if (entry.subject.startsWith('client')) return 'client';
	return 'platform';
}

function toFinancialCenterEntry(entry: RuntimeLedgerEntry): WltLedgerEntry {
	const debit = accountForDebit(entry.reference_type);
	const credit = accountForCredit(entry.reference_type);
	// WLT amounts are float YER; convert to minor units for display layer
	const amount = Math.round(entry.amount * 100);
	const status = mapEntryStatus(entry.status);

	return {
		id: entry.id,
		debitAccountCode: debit.code,
		debitAccountLabel: debit.label,
		creditAccountCode: credit.code,
		creditAccountLabel: credit.label,
		amountMinorUnits: amount,
		amountLabel: formatWltYer(amount),
		entryKind: mapEntryKind(entry.reference_type),
		party: partyLabel(entry),
		partyKind: partyKind(entry),
		sourceRef: entry.reference_id ?? entry.order_id ?? entry.id,
		statusLabel: status === 'posted' ? 'مرحّل من WLT' : 'يتطلب مراجعة WLT',
		status,
		isPending: status !== 'posted',
		needsReconciliation: status !== 'posted',
		isPreview: false,
	};
}

export function buildWltRuntimeFinancialCenter(
	businessDate: string,
	runtime: WltDshFinanceRuntimeReadModel,
): WltFinancialCenter {
	const allEntries = runtime.ledgerEntries.map(toFinancialCenterEntry);
	const accountLines = new Map<string, {
		readonly type: WltFinancialCenterSection['sectionType'];
		readonly label: string;
		total: number;
		entries: WltLedgerEntry[];
	}>();

	for (const entry of allEntries) {
		for (const account of [
			{ code: entry.debitAccountCode, label: entry.debitAccountLabel, type: accountTypeByCode(entry.debitAccountCode) },
			{ code: entry.creditAccountCode, label: entry.creditAccountLabel, type: accountTypeByCode(entry.creditAccountCode) },
		]) {
			const existing = accountLines.get(account.code);
			if (existing) {
				existing.total += entry.amountMinorUnits;
				existing.entries.push(entry);
			} else {
				accountLines.set(account.code, {
					type: account.type,
					label: account.label,
					total: entry.amountMinorUnits,
					entries: [entry],
				});
			}
		}
	}

	const section = (type: WltFinancialCenterSection['sectionType'], sectionLabel: string): WltFinancialCenterSection => {
		const lines: WltAccountPositionLine[] = [];
		for (const [accountCode, account] of accountLines) {
			if (account.type !== type) continue;
			lines.push({
				accountCode,
				accountLabel: account.label,
				accountType: type,
				totalMinorUnits: account.total,
				totalLabel: formatWltYer(account.total),
				entryCount: account.entries.length,
				pendingCount: account.entries.filter((e) => e.isPending).length,
				entries: account.entries,
				isPreview: false,
			});
		}

		const totalMinorUnits = lines.reduce((sum, line) => sum + line.totalMinorUnits, 0);
		return { sectionType: type, sectionLabel, totalMinorUnits, totalLabel: formatWltYer(totalMinorUnits), lines };
	};

	const assetSection = section('asset', 'الأصول');
	const liabilitySection = section('liability', 'الالتزامات');
	const revenueSection = section('revenue', 'الإيرادات');
	const expenseSection = section('expense', 'المصروفات');
	const netPosition = assetSection.totalMinorUnits - liabilitySection.totalMinorUnits;
	const blockingVariances = allEntries
		.filter((entry) => entry.needsReconciliation)
		.map((entry) => ({
			entryId: entry.id,
			description: `${entry.party} — ${entry.sourceRef}`,
			varianceMinorUnits: entry.amountMinorUnits,
			varianceLabel: entry.amountLabel,
			partyKind: entry.partyKind,
			reason: entry.statusLabel,
		}));

	return {
		businessDate,
		sections: [assetSection, liabilitySection, revenueSection, expenseSection],
		allEntries,
		totalAssets: assetSection.totalMinorUnits,
		totalAssetsLabel: assetSection.totalLabel,
		totalLiabilities: liabilitySection.totalMinorUnits,
		totalLiabilitiesLabel: liabilitySection.totalLabel,
		totalRevenue: revenueSection.totalMinorUnits,
		totalRevenueLabel: revenueSection.totalLabel,
		totalExpenses: expenseSection.totalMinorUnits,
		totalExpensesLabel: expenseSection.totalLabel,
		netPosition,
		netPositionLabel: formatWltYer(Math.abs(netPosition)),
		blockingVariances,
		canClose: blockingVariances.length === 0 && runtime.closeStatus.status !== 'blocked',
		contractState: 'WLT_DSH_RUNTIME_BOUND',
		openingBalanceSource: runtime.baseUrl,
		closingBalanceSource: runtime.closeStatus.id ?? '',
		isPreview: false,
	};
}
