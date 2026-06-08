import { createWltDshFinanceRuntime } from './runtime.ts';

function assert(condition: unknown, message: string): asserts condition {
	if (!condition) throw new Error(message);
}

const runtime = createWltDshFinanceRuntime({
	now: () => '2026-06-05T00:00:00.000Z',
});

const payment = runtime.createPaymentSession({
	orderId: 'DSH-ORDER-1',
	clientId: 'client-demo',
	partnerId: 'partner-1',
	captainId: 'captain-1',
	fieldAgentId: 'field-1',
	amountMinorUnits: 100000,
	currency: 'YER',
	paymentMethod: 'wallet',
	dshCheckoutIntentId: 'DSH-CHECKOUT-1',
}, 'idem-payment-1');

assert(payment.status === 'captured', 'payment should be captured');
assert(payment.dshCallbackEvent?.target === 'dsh.payment-callback', 'payment callback should target DSH payment callback');
assert(runtime.getClientWalletSummary('client-demo').balanceMinorUnits === 2400000, 'wallet should be debited by WLT runtime');

const refund = runtime.executeRefund({
	orderId: 'DSH-ORDER-1',
	clientId: 'client-demo',
	storeId: 'store-1',
	amountMinorUnits: 25000,
	currency: 'YER',
	reason: 'customer_cancelled_after_payment',
}, 'idem-refund-1');

assert(refund.status === 'confirmed', 'refund should be confirmed by WLT runtime');
assert(refund.callbackEvent?.target === 'dsh.refund-callback', 'refund callback should target DSH refund callback');
assert(runtime.listPartnerSettlementCycles('partner-1').length === 1, 'partner settlement should be created');
assert(runtime.listFieldCommissions('field-1').length === 1, 'field commission should be created');
assert(runtime.listLedgerEntries().length >= 4, 'ledger entries should be posted');

const reconciliation = runtime.triggerReconciliationRun('idem-reconciliation-1');
assert(reconciliation.status === 'passed', 'reconciliation should pass for posted ledger entries');

const close = runtime.submitDailyClose('2026-06-05');
assert(close.status === 'closed', 'finance close should close after passing reconciliation');

const snapshot = runtime.getSnapshot();
assert(snapshot.runtimeTruth === 'wlt_dsh_in_memory_core_only', 'snapshot should declare WLT DSH in-memory core only');
assert(snapshot.callbackEvents.length >= 2, 'snapshot should include DSH callback events');

console.log('WLT_DSH_RUNTIME_SMOKE: PASS');
