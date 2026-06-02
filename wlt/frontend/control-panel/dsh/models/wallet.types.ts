export type WalletActorType =
  | 'client'
  | 'partner'
  | 'captain'
  | 'field'
  | 'platform'
  | 'store_courier';

export type WalletTransactionStatus =
  | 'posted'
  | 'pending'
  | 'held'
  | 'reserved'
  | 'failed'
  | 'reversed'
  | 'disputed';

export type WalletTransactionEventKind =
  | 'client_payment_wallet'
  | 'client_payment_cod'
  | 'client_payment_card'
  | 'client_payment_split'
  | 'client_refund'
  | 'client_topup'
  | 'partner_settlement_payout'
  | 'partner_commission_deduction'
  | 'partner_refund_deduction'
  | 'captain_earning_delivery'
  | 'captain_earning_bonus'
  | 'captain_cod_collection'
  | 'captain_cod_deposit'
  | 'captain_eligibility_reserve'
  | 'captain_eligibility_release'
  | 'field_commission_earn'
  | 'field_commission_payout'
  | 'field_commission_hold'
  | 'platform_commission_deduct'
  | 'promo_platform_funded'
  | 'promo_partner_funded'
  | 'store_delivery_fee'
  | 'store_courier_compensation'
  | 'wallet_hold'
  | 'wallet_hold_release'
  | 'failed_payment'
  | 'refund_full'
  | 'refund_partial'
  | 'cancel_before_acceptance'
  | 'cancel_after_dispatch'
  | 'cancel_after_delivery';

export type WalletBalanceBucket = {
  availableMinorUnits: number;
  pendingMinorUnits: number;
  heldMinorUnits: number;
  reservedMinorUnits: number;
  settledMinorUnits: number;
};

export type WalletTransactionLine = {
  transactionId: string;
  eventKind: WalletTransactionEventKind;
  businessDate: string;
  deliveryMode: 'bthwani_delivery' | 'store_delivery' | 'pickup' | 'unknown';
  paymentMethod: 'wallet' | 'cod' | 'card' | 'wallet_cod_split' | 'wallet_card_split' | 'unknown';
  sourceOrderId?: string;
  sourceSettlementCycleId?: string;
  sourceRefundId?: string;
  sourceCashBagId?: string;
  sourceLedgerEntryId?: string;
  debitMinorUnits: number;
  creditMinorUnits: number;
  runningAvailableBalance: number;
  runningHeldBalance: number;
  status: WalletTransactionStatus;
  evidenceRef?: string;
  nextAction?: string;
  holdReason?: string;
  description: string;
};

export type WalletAccount = {
  walletId: string;
  actorType: WalletActorType;
  actorId: string;
  currencyCode: 'YER';
  balance: WalletBalanceBucket;
  lifetimeInflowMinorUnits: number;
  lifetimeOutflowMinorUnits: number;
  lastMovementAt: string;
  statementLines: readonly WalletTransactionLine[];
};

export type WalletStatement = {
  walletId: string;
  actorType: WalletActorType;
  actorId: string;
  actorLabel: string;
  periodStart: string;
  periodEnd: string;
  openingBalanceMinorUnits: number;
  closingBalanceMinorUnits: number;
  totalInflowMinorUnits: number;
  totalOutflowMinorUnits: number;
  totalHeldMinorUnits: number;
  lines: readonly WalletTransactionLine[];
  failedPayments: readonly WalletTransactionLine[];
  pendingRefunds: readonly WalletTransactionLine[];
  codLiability?: number;
  nextPayoutDate?: string;
  nextAction?: string;
};

export type WalletCashBag = {
  bagId: string;
  captainId: string;
  collectedAmountMinorUnits: number;
  collectedAmountLabel: string;
  orderIds: readonly string[];
  collectionDate: string;
  depositStatus: 'not_deposited' | 'deposited' | 'partially_deposited' | 'disputed';
  depositReceiptId?: string;
  depositDate?: string;
  varianceMinorUnits: number;
  varianceReason?: string;
  nextAction: string;
};

export type WalletDepositProof = {
  proofId: string;
  captainId: string;
  bagId: string;
  bankReference: string;
  depositedAmountMinorUnits: number;
  depositedAt: string;
  verifiedAt?: string;
  status: 'pending_verification' | 'verified' | 'rejected';
};

export type WalletRefundImpact = {
  refundId: string;
  orderId: string;
  actorType: WalletActorType;
  actorId: string;
  originalAmountMinorUnits: number;
  refundedAmountMinorUnits: number;
  refundMethod: 'wallet_credit' | 'cod_return' | 'card_reversal';
  walletImpactMinorUnits: number;
  partnerDeductionMinorUnits: number;
  platformAbsorbedMinorUnits: number;
  status: 'pending' | 'processed' | 'failed';
  processedAt?: string;
};

export type WalletPaymentSplit = {
  orderId: string;
  totalMinorUnits: number;
  walletAmountMinorUnits: number;
  codAmountMinorUnits: number;
  cardAmountMinorUnits: number;
  walletBalanceBefore: number;
  walletBalanceAfter: number;
  codCollected: boolean;
  splitDescription: string;
};
