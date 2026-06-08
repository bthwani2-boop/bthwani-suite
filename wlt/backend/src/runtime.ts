import type {
	PaymentIntentRequest,
	PaymentIntentResponse,
	WalletBalance,
	WltDshCallbackEvent,
	WltDshCodLiability,
	WltDshFinanceClose,
	WltDshFinanceSnapshot,
	WltDshLedgerEntry,
	WltDshPayoutDecision,
	WltDshReconciliationRun,
	WltDshRefundCase,
	WltDshRefundRequest,
	WltDshSettlementCycle,
} from './contracts';

type RuntimeClock = () => string;

export interface WltDshRuntimeSeed {
	readonly wallets?: readonly (WalletBalance & { readonly clientId: string })[];
	readonly now?: RuntimeClock;
}

export interface WltDshRequestLike {
	readonly method: 'GET' | 'POST';
	readonly path: string;
	readonly headers?: Readonly<Record<string, string | undefined>>;
	readonly query?: Readonly<Record<string, string | undefined>>;
	readonly body?: unknown;
}

export interface WltDshResponseLike {
	readonly status: number;
	readonly body: unknown;
}

type RuntimeWallet = WalletBalance & { readonly clientId: string };

const DEFAULT_CURRENCY = 'YER';

function id(prefix: string, value: number): string {
	return `${prefix}-${String(value).padStart(6, '0')}`;
}

function normalizeIdempotencyKey(headers: WltDshRequestLike['headers']): string {
	return headers?.['Idempotency-Key'] ?? headers?.['idempotency-key'] ?? '';
}

export class WltDshFinanceRuntime {
	private readonly now: RuntimeClock;
	private sequence = 1;
	private readonly wallets = new Map<string, RuntimeWallet>();
	private readonly idempotency = new Map<string, PaymentIntentResponse | WltDshPayoutDecision | WltDshReconciliationRun>();
	private readonly payments = new Map<string, PaymentIntentResponse>();
	private readonly refunds = new Map<string, WltDshRefundCase>();
	private readonly settlements = new Map<string, WltDshSettlementCycle>();
	private readonly codLiabilities = new Map<string, WltDshCodLiability>();
	private readonly payouts = new Map<string, WltDshPayoutDecision>();
	private readonly ledgerEntries: WltDshLedgerEntry[] = [];
	private readonly reconciliationRuns: WltDshReconciliationRun[] = [];
	private readonly callbackEvents: WltDshCallbackEvent[] = [];
	private closeStatus: WltDshFinanceClose;

	constructor(seed: WltDshRuntimeSeed = {}) {
		this.now = seed.now ?? (() => new Date().toISOString());
		for (const wallet of seed.wallets ?? []) {
			this.wallets.set(wallet.clientId, wallet);
		}
		if (!this.wallets.has('client-demo')) {
			this.wallets.set('client-demo', {
				clientId: 'client-demo',
				balanceMinorUnits: 2500000,
				currency: DEFAULT_CURRENCY,
				linked: true,
				frozenMinorUnits: 0,
				updatedAt: this.now(),
			});
		}
		this.closeStatus = {
			id: id('WLT-DSH-CLOSE', 0),
			businessDate: this.now().slice(0, 10),
			status: 'blocked',
			blockingReasons: ['no_reconciliation_run'],
			createdAt: this.now(),
		};
	}

	getClientWalletSummary(clientId = 'client-demo'): WalletBalance {
		const wallet = this.wallets.get(clientId);
		if (!wallet) {
			return {
				balanceMinorUnits: 0,
				currency: DEFAULT_CURRENCY,
				linked: false,
				frozenMinorUnits: 0,
				updatedAt: this.now(),
			};
		}
		const { clientId: _clientId, ...summary } = wallet;
		return summary;
	}

	createPaymentSession(request: PaymentIntentRequest, idempotencyKey: string): PaymentIntentResponse {
		if (!idempotencyKey) throw new Error('Idempotency-Key is required for WLT payment sessions.');
		const cached = this.idempotency.get(idempotencyKey);
		if (cached && 'orderId' in cached) return cached;

		const clientId = request.clientId ?? 'client-demo';
		const wallet = this.wallets.get(clientId);
		const paymentMethod = request.paymentMethod ?? 'wallet';
		const hasBalance = paymentMethod !== 'wallet' || Boolean(wallet?.linked && wallet.balanceMinorUnits >= request.amountMinorUnits);
		const status: PaymentIntentResponse['status'] = hasBalance ? 'captured' : 'failed';
		const sessionId = id('WLT-DSH-PAY', this.sequence++);
		const callback = this.createCallback('dsh.payment-callback', idempotencyKey, {
			intent_id: request.dshCheckoutIntentId ?? request.orderId,
			wlt_payment_ref_id: sessionId,
			status: status === 'captured' ? 'confirmed' : 'failed',
			failure_reason: status === 'failed' ? 'insufficient_balance' : undefined,
		});
		const response: PaymentIntentResponse = {
			id: sessionId,
			orderId: request.orderId,
			amountMinorUnits: request.amountMinorUnits,
			currency: request.currency,
			status,
			wltPaymentRefId: sessionId,
			dshCallbackEvent: callback,
		};

		if (status === 'captured' && wallet && paymentMethod === 'wallet') {
			this.wallets.set(clientId, {
				...wallet,
				balanceMinorUnits: wallet.balanceMinorUnits - request.amountMinorUnits,
				updatedAt: this.now(),
			});
			this.postLedger('wallet_payment', request.orderId, clientId, 'client', request.amountMinorUnits, 0, request.currency, sessionId);
		}
		if (status === 'captured' && request.partnerId) {
			this.upsertSettlement(request.partnerId, 'partner', request.orderId, request.amountMinorUnits, request.currency);
			this.postLedger('partner_settlement', request.orderId, request.partnerId, 'partner', 0, request.amountMinorUnits, request.currency, sessionId);
		}
		if (status === 'captured' && paymentMethod === 'cod' && request.captainId) {
			this.createCodLiability(request.captainId, request.orderId, request.amountMinorUnits, request.currency);
		}
		if (status === 'captured' && request.fieldAgentId) {
			const commission = Math.round(request.amountMinorUnits * 0.02);
			this.upsertSettlement(request.fieldAgentId, 'field', request.orderId, commission, request.currency);
			this.postLedger('field_commission', request.orderId, request.fieldAgentId, 'field', 0, commission, request.currency, sessionId);
		}

		this.payments.set(sessionId, response);
		this.idempotency.set(idempotencyKey, response);
		return response;
	}

	getPaymentSession(sessionId: string): PaymentIntentResponse | undefined {
		return this.payments.get(sessionId);
	}

	executeRefund(request: WltDshRefundRequest, idempotencyKey: string): WltDshRefundCase {
		if (!idempotencyKey) throw new Error('Idempotency-Key is required for WLT refunds.');
		const refundRefId = id('WLT-DSH-REF', this.sequence++);
		const callback = this.createCallback('dsh.refund-callback', idempotencyKey, {
			refund_ref_id: refundRefId,
			order_id: request.orderId,
			amount: request.amountMinorUnits,
			status: 'CONFIRMED',
		});
		const refund: WltDshRefundCase = {
			refundRefId,
			orderId: request.orderId,
			clientId: request.clientId,
			storeId: request.storeId,
			amountMinorUnits: request.amountMinorUnits,
			currency: request.currency,
			status: 'confirmed',
			reason: request.reason,
			createdAt: this.now(),
			callbackEvent: callback,
		};
		this.refunds.set(refundRefId, refund);
		this.postLedger('refund', request.orderId, request.clientId, 'client', 0, request.amountMinorUnits, request.currency, refundRefId);
		return refund;
	}

	listCodLiabilities(captainId?: string): readonly WltDshCodLiability[] {
		return [...this.codLiabilities.values()].filter((item) => !captainId || item.captainId === captainId);
	}

	listPartnerSettlementCycles(ownerId?: string): readonly WltDshSettlementCycle[] {
		return [...this.settlements.values()].filter((item) => item.ownerKind === 'partner' && (!ownerId || item.ownerId === ownerId));
	}

	listFieldCommissions(ownerId?: string): readonly WltDshSettlementCycle[] {
		return [...this.settlements.values()].filter((item) => item.ownerKind === 'field' && (!ownerId || item.ownerId === ownerId));
	}

	createPayoutDecision(ownerId: string, ownerKind: WltDshPayoutDecision['ownerKind'], settlementCycleId: string, amountMinorUnits: number, idempotencyKey: string): WltDshPayoutDecision {
		if (!idempotencyKey) throw new Error('Idempotency-Key is required for WLT payout decisions.');
		const cached = this.idempotency.get(idempotencyKey);
		if (cached && 'settlementCycleId' in cached) return cached;
		const payout: WltDshPayoutDecision = {
			id: id('WLT-DSH-PO', this.sequence++),
			ownerId,
			ownerKind,
			settlementCycleId,
			amountMinorUnits,
			currency: DEFAULT_CURRENCY,
			status: 'prepared',
			createdAt: this.now(),
		};
		this.payouts.set(payout.id, payout);
		this.idempotency.set(idempotencyKey, payout);
		this.postLedger('captain_payout', undefined, ownerId, ownerKind === 'field' ? 'field' : ownerKind, amountMinorUnits, 0, DEFAULT_CURRENCY, payout.id);
		return payout;
	}

	triggerReconciliationRun(idempotencyKey: string): WltDshReconciliationRun {
		if (!idempotencyKey) throw new Error('Idempotency-Key is required for WLT reconciliation runs.');
		const cached = this.idempotency.get(idempotencyKey);
		if (cached && 'checkedLedgerRows' in cached) return cached;
		const unmatchedRows = this.ledgerEntries.filter((entry) => entry.status !== 'posted').length;
		const run: WltDshReconciliationRun = {
			id: id('WLT-DSH-REC', this.sequence++),
			status: unmatchedRows === 0 ? 'passed' : 'failed',
			checkedLedgerRows: this.ledgerEntries.length,
			unmatchedRows,
			createdAt: this.now(),
		};
		this.reconciliationRuns.push(run);
		this.idempotency.set(idempotencyKey, run);
		this.postLedger('reconciliation', undefined, 'platform', 'platform', 0, 0, DEFAULT_CURRENCY, run.id);
		return run;
	}

	submitDailyClose(businessDate: string): WltDshFinanceClose {
		const latestRun = this.reconciliationRuns.at(-1);
		const blockingReasons = latestRun?.status === 'passed' ? [] : ['reconciliation_not_passed'];
		this.closeStatus = {
			id: id('WLT-DSH-CLOSE', this.sequence++),
			businessDate,
			status: blockingReasons.length === 0 ? 'closed' : 'blocked',
			blockingReasons,
			createdAt: this.now(),
		};
		this.postLedger('finance_close', undefined, 'platform', 'platform', 0, 0, DEFAULT_CURRENCY, this.closeStatus.id);
		return this.closeStatus;
	}

	listLedgerEntries(): readonly WltDshLedgerEntry[] {
		return [...this.ledgerEntries];
	}

	listRefunds(): readonly WltDshRefundCase[] {
		return [...this.refunds.values()];
	}

	listReconciliationRuns(): readonly WltDshReconciliationRun[] {
		return [...this.reconciliationRuns];
	}

	getSnapshot(): WltDshFinanceSnapshot {
		return {
			wallets: [...this.wallets.values()].map(({ clientId: _clientId, ...wallet }) => wallet),
			paymentSessions: [...this.payments.values()],
			refunds: this.listRefunds(),
			settlements: [...this.settlements.values()],
			codLiabilities: this.listCodLiabilities(),
			payouts: [...this.payouts.values()],
			ledgerEntries: this.listLedgerEntries(),
			reconciliationRuns: this.listReconciliationRuns(),
			closeStatus: this.closeStatus,
			callbackEvents: [...this.callbackEvents],
			runtimeTruth: 'wlt_dsh_in_memory_core_only',
		};
	}

	handle(request: WltDshRequestLike): WltDshResponseLike {
		try {
			return this.handleUnsafe(request);
		} catch (error) {
			return {
				status: 400,
				body: {
					code: 'WLT_RUNTIME_UNAVAILABLE',
					message: error instanceof Error ? error.message : 'Unknown WLT runtime error',
				},
			};
		}
	}

	private handleUnsafe(request: WltDshRequestLike): WltDshResponseLike {
		const path = request.path.replace(/\/$/, '');
		if (request.method === 'GET' && path === '/wlt/dsh/client/wallet/summary') {
			return { status: 200, body: this.getClientWalletSummary(request.query?.clientId) };
		}
		if (request.method === 'POST' && path === '/wlt/dsh/client/payment-sessions') {
			return { status: 201, body: this.createPaymentSession(request.body as PaymentIntentRequest, normalizeIdempotencyKey(request.headers)) };
		}
		const paymentMatch = path.match(/^\/wlt\/dsh\/client\/payment-sessions\/([^/]+)$/);
		if (request.method === 'GET' && paymentMatch?.[1]) {
			const session = this.getPaymentSession(paymentMatch[1]);
			return session ? { status: 200, body: session } : { status: 404, body: { code: 'POLICY_BLOCK', message: 'Payment session not found' } };
		}
		if (request.method === 'GET' && path === '/wlt/dsh/captain/cod-liabilities') return { status: 200, body: this.listCodLiabilities(request.query?.captainId) };
		if (request.method === 'GET' && path === '/wlt/dsh/captain/eligibility') {
			return {
				status: 200,
				body: {
					captainId: request.query?.captainId ?? 'captain-demo',
					eligible: this.listCodLiabilities(request.query?.captainId).length === 0,
					heldMinorUnits: this.listCodLiabilities(request.query?.captainId).reduce((sum, item) => sum + item.amountMinorUnits, 0),
					currency: DEFAULT_CURRENCY,
					updatedAt: this.now(),
				},
			};
		}
		if (request.method === 'GET' && path === '/wlt/dsh/captain/earnings') return { status: 200, body: this.listLedgerEntries().filter((entry) => entry.actorKind === 'captain') };
		if (request.method === 'GET' && path === '/wlt/dsh/partner/settlement-cycles') return { status: 200, body: this.listPartnerSettlementCycles(request.query?.partnerId) };
		if (request.method === 'GET' && path === '/wlt/dsh/field/commissions') return { status: 200, body: this.listFieldCommissions(request.query?.fieldAgentId) };
		if (request.method === 'GET' && path === '/wlt/dsh/control-panel/finance/overview') return { status: 200, body: this.getSnapshot() };
		if (request.method === 'GET' && path === '/wlt/dsh/control-panel/reconciliation-runs') return { status: 200, body: this.listReconciliationRuns() };
		if (request.method === 'POST' && path === '/wlt/dsh/control-panel/reconciliation-runs') return { status: 201, body: this.triggerReconciliationRun(normalizeIdempotencyKey(request.headers)) };
		if (request.method === 'POST' && path === '/wlt/dsh/control-panel/payout-decisions') {
			const body = request.body as { ownerId: string; ownerKind: WltDshPayoutDecision['ownerKind']; settlementCycleId: string; amountMinorUnits: number };
			return { status: 201, body: this.createPayoutDecision(body.ownerId, body.ownerKind, body.settlementCycleId, body.amountMinorUnits, normalizeIdempotencyKey(request.headers)) };
		}
		if (request.method === 'GET' && path === '/wlt/dsh/control-panel/audit-events') return { status: 200, body: this.callbackEvents };
		if (request.method === 'GET' && path === '/wlt/dsh/control-panel/refund-queue') return { status: 200, body: this.listRefunds() };
		if (request.method === 'POST' && path === '/wlt/dsh/control-panel/refund-queue') return { status: 201, body: this.executeRefund(request.body as WltDshRefundRequest, normalizeIdempotencyKey(request.headers)) };
		if (request.method === 'GET' && path === '/wlt/dsh/control-panel/ledger-entries') return { status: 200, body: this.listLedgerEntries() };
		if (request.method === 'GET' && path === '/wlt/dsh/control-panel/reconciliation-close-status') return { status: 200, body: this.closeStatus };
		if (request.method === 'POST' && path === '/wlt/dsh/control-panel/daily-close') {
			const body = request.body as { businessDate?: string };
			return { status: 201, body: this.submitDailyClose(body.businessDate ?? this.now().slice(0, 10)) };
		}
		return { status: 404, body: { code: 'POLICY_BLOCK', message: `Unsupported WLT-DSH runtime route: ${request.method} ${path}` } };
	}

	private createCallback(target: WltDshCallbackEvent['target'], idempotencyKey: string, payload: Record<string, unknown>): WltDshCallbackEvent {
		const event: WltDshCallbackEvent = {
			eventId: id('WLT-DSH-EVT', this.sequence++),
			idempotencyKey,
			target,
			payload,
			createdAt: this.now(),
		};
		this.callbackEvents.push(event);
		return event;
	}

	private createCodLiability(captainId: string, orderId: string, amountMinorUnits: number, currency: string): void {
		const liability: WltDshCodLiability = {
			id: id('WLT-DSH-COD', this.sequence++),
			captainId,
			orderId,
			amountMinorUnits,
			currency,
			status: 'outstanding',
			createdAt: this.now(),
		};
		this.codLiabilities.set(liability.id, liability);
		this.postLedger('cod_liability', orderId, captainId, 'captain', 0, amountMinorUnits, currency, liability.id);
	}

	private upsertSettlement(ownerId: string, ownerKind: WltDshSettlementCycle['ownerKind'], orderId: string, amountMinorUnits: number, currency: string): void {
		const key = `${ownerKind}:${ownerId}`;
		const current = this.settlements.get(key);
		this.settlements.set(key, {
			id: current?.id ?? id('WLT-DSH-SET', this.sequence++),
			ownerId,
			ownerKind,
			orderIds: [...(current?.orderIds ?? []), orderId],
			netPayableMinorUnits: (current?.netPayableMinorUnits ?? 0) + amountMinorUnits,
			currency,
			status: 'ready_for_payout',
			createdAt: current?.createdAt ?? this.now(),
		});
	}

	private postLedger(kind: WltDshLedgerEntry['kind'], orderId: string | undefined, actorId: string, actorKind: WltDshLedgerEntry['actorKind'], debitMinorUnits: number, creditMinorUnits: number, currency: string, referenceId: string): void {
		this.ledgerEntries.push({
			id: id('WLT-DSH-LED', this.sequence++),
			kind,
			orderId,
			actorId,
			actorKind,
			debitMinorUnits,
			creditMinorUnits,
			currency,
			status: 'posted',
			createdAt: this.now(),
			referenceId,
		});
	}
}

export function createWltDshFinanceRuntime(seed?: WltDshRuntimeSeed): WltDshFinanceRuntime {
	return new WltDshFinanceRuntime(seed);
}
