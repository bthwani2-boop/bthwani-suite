import {
	createWltDshTypedClient,
	resolveWltDshApiBaseUrl,
	type WltDshCloseStatus,
	type WltDshFinanceOverview,
	type WltDshLedgerEntry as RuntimeLedgerEntry,
	type WltDshRefundCase,
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
	readonly overview: WltDshFinanceOverview;
	readonly ledgerEntries: readonly RuntimeLedgerEntry[];
	readonly refunds: readonly WltDshRefundCase[];
	readonly closeStatus: WltDshCloseStatus;
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
		const [overview, ledgerEntries, refunds, closeStatus] = await Promise.all([
			client.getFinanceOverview(),
			client.listLedgerEntries(),
			client.listRefundQueue(),
			client.getReconciliationCloseStatus(),
		]);

		return {
			state: 'runtime',
			data: {
				baseUrl,
				overview,
				ledgerEntries,
				refunds,
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

function mapEntryKind(kind: string): WltLedgerEntryKind {
	if (kind === 'wallet_payment') return 'wallet-movement';
	if (kind === 'cod_liability') return 'cod-collection';
	if (kind === 'partner_settlement') return 'partner-settlement';
	if (kind === 'captain_payout') return 'captain-earning';
	if (kind === 'field_commission') return 'field-commission';
	if (kind === 'refund') return 'refund';
	if (kind === 'reconciliation') return 'platform-commission';
	return 'other';
}

function mapEntryStatus(status: string): WltLedgerEntryStatus {
	if (status === 'posted') return 'posted';
	if (status === 'pending') return 'pending';
	if (status === 'failed') return 'blocked';
	if (status === 'reversed') return 'disputed';
	return 'pending';
}

function accountForDebit(kind: string): { code: string; label: string; type: WltFinancialCenterSection['sectionType'] } {
	if (kind === 'refund') return { code: '5001', label: 'مصروف الاسترداد', type: 'expense' };
	if (kind === 'captain_payout' || kind === 'field_commission') return { code: '2010', label: 'مستحقات تشغيلية', type: 'liability' };
	if (kind === 'partner_settlement') return { code: '1030', label: 'مقاصة التسوية', type: 'asset' };
	return { code: '1010', label: 'رصيد المقاصة البنكية', type: 'asset' };
}

function accountForCredit(kind: string): { code: string; label: string; type: WltFinancialCenterSection['sectionType'] } {
	if (kind === 'wallet_payment') return { code: '2001', label: 'رصيد محفظة العميل', type: 'liability' };
	if (kind === 'partner_settlement') return { code: '2020', label: 'مستحقات الشريك', type: 'liability' };
	if (kind === 'captain_payout') return { code: '1010', label: 'رصيد المقاصة البنكية', type: 'asset' };
	if (kind === 'field_commission') return { code: '2030', label: 'مستحقات الميداني', type: 'liability' };
	if (kind === 'refund') return { code: '2050', label: 'التزام الاسترداد للعميل', type: 'liability' };
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
	if (entry.actorKind === 'captain') return `كابتن · ${entry.actorId}`;
	if (entry.actorKind === 'partner') return `شريك · ${entry.actorId}`;
	if (entry.actorKind === 'field') return `ميداني · ${entry.actorId}`;
	if (entry.actorKind === 'client') return `عميل · ${entry.actorId}`;
	return 'WLT';
}

function toFinancialCenterEntry(entry: RuntimeLedgerEntry): WltLedgerEntry {
	const debit = accountForDebit(entry.kind);
	const credit = accountForCredit(entry.kind);
	const amount = Math.max(entry.debitMinorUnits, entry.creditMinorUnits);
	const status = mapEntryStatus(entry.status);

	return {
		id: entry.id,
		debitAccountCode: debit.code,
		debitAccountLabel: debit.label,
		creditAccountCode: credit.code,
		creditAccountLabel: credit.label,
		amountMinorUnits: amount,
		amountLabel: formatWltYer(amount),
		entryKind: mapEntryKind(entry.kind),
		party: partyLabel(entry),
		partyKind: entry.actorKind === 'control-panel' ? 'platform' : (entry.actorKind as WltLedgerEntry['partyKind']),
		sourceRef: entry.referenceId ?? entry.orderId ?? entry.id,
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
				pendingCount: account.entries.filter((entry) => entry.isPending).length,
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
		closingBalanceSource: runtime.closeStatus.id,
		isPreview: false,
	};
}
