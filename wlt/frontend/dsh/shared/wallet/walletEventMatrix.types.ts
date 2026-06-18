import type { WalletActorType, WalletTransactionEventKind } from './wallet.types';

export type DeliveryMode =
  | 'bthwani_delivery'
  | 'store_delivery'
  | 'pickup';

export type PaymentMethodMode =
  | 'wallet_only'
  | 'cod_only'
  | 'card_only'
  | 'wallet_cod_split'
  | 'wallet_card_split';

export type WalletImpactDirection = 'debit' | 'credit' | 'hold' | 'release' | 'none';

export type WalletActorImpact = {
  actorType: WalletActorType;
  direction: WalletImpactDirection;
  amountBasis: 'order_total' | 'wallet_portion' | 'cod_portion' | 'commission' | 'fee' | 'refund' | 'zero';
  walletAffected: boolean;
  settlementAffected: boolean;
  ledgerEntry: WalletTransactionEventKind;
  displayLabel: string;
};

export type WalletEventMatrixRow = {
  scenarioId: string;
  scenarioLabel: string;
  deliveryMode: DeliveryMode;
  paymentMethod: PaymentMethodMode;
  cancelOrRefund?: 'cancel_before_acceptance' | 'cancel_after_dispatch' | 'cancel_after_delivery' | 'refund_full' | 'refund_partial';
  payer: WalletActorType;
  payee: WalletActorType;
  clientImpact: WalletActorImpact;
  partnerImpact: WalletActorImpact;
  captainImpact: WalletActorImpact;
  platformImpact: WalletActorImpact;
  fieldImpact?: WalletActorImpact;
  clientDisplay: string;
  partnerDisplay: string;
  captainDisplay: string;
  fieldDisplay?: string;
  controlPanelDisplay: string;
  accountingEntry: string;
};

const noImpact = (actorType: WalletActorType, label: string): WalletActorImpact => ({
  actorType,
  direction: 'none',
  amountBasis: 'zero',
  walletAffected: false,
  settlementAffected: false,
  ledgerEntry: 'client_payment_wallet',
  displayLabel: label,
});

export const WALLET_EVENT_MATRIX: readonly WalletEventMatrixRow[] = [
  {
    scenarioId: 'BD_WALLET',
    scenarioLabel: 'توصيل بثواني — دفع بالمحفظة',
    deliveryMode: 'bthwani_delivery',
    paymentMethod: 'wallet_only',
    payer: 'client',
    payee: 'platform',
    clientImpact: { actorType: 'client', direction: 'debit', amountBasis: 'order_total', walletAffected: true, settlementAffected: false, ledgerEntry: 'client_payment_wallet', displayLabel: 'خصم من رصيد المحفظة' },
    partnerImpact: { actorType: 'partner', direction: 'credit', amountBasis: 'order_total', walletAffected: false, settlementAffected: true, ledgerEntry: 'partner_settlement_payout', displayLabel: 'إضافة للتسوية بعد خصم العمولة' },
    captainImpact: { actorType: 'captain', direction: 'credit', amountBasis: 'commission', walletAffected: false, settlementAffected: true, ledgerEntry: 'captain_earning_delivery', displayLabel: 'أرباح توصيل' },
    platformImpact: { actorType: 'platform', direction: 'credit', amountBasis: 'commission', walletAffected: false, settlementAffected: false, ledgerEntry: 'platform_commission_deduct', displayLabel: 'عمولة المنصة' },
    clientDisplay: 'خصم من المحفظة · الرصيد المتاح يتناقص',
    partnerDisplay: 'مبيعات معتمدة · ستُسوّى في الدورة القادمة',
    captainDisplay: 'أرباح معتمدة · تُصرف في موعد الدفع',
    controlPanelDisplay: 'دفع بالمحفظة · خصم عميل + تسوية شريك + أرباح كابتن',
    accountingEntry: 'Dr. محفظة العميل / Cr. إيرادات المنصة + مستحقات شريك + مستحقات كابتن',
  },
  {
    scenarioId: 'BD_COD',
    scenarioLabel: 'توصيل بثواني — دفع عند الاستلام',
    deliveryMode: 'bthwani_delivery',
    paymentMethod: 'cod_only',
    payer: 'client',
    payee: 'captain',
    clientImpact: { actorType: 'client', direction: 'none', amountBasis: 'zero', walletAffected: false, settlementAffected: false, ledgerEntry: 'client_payment_cod', displayLabel: 'لا يوجد خصم من المحفظة — نقدي عند الاستلام' },
    partnerImpact: { actorType: 'partner', direction: 'credit', amountBasis: 'order_total', walletAffected: false, settlementAffected: true, ledgerEntry: 'partner_settlement_payout', displayLabel: 'تسوية بعد تأكيد إيداع الكابتن' },
    captainImpact: { actorType: 'captain', direction: 'hold', amountBasis: 'cod_portion', walletAffected: false, settlementAffected: false, ledgerEntry: 'captain_cod_collection', displayLabel: 'ذمة COD مستحقة للإيداع' },
    platformImpact: { actorType: 'platform', direction: 'credit', amountBasis: 'commission', walletAffected: false, settlementAffected: false, ledgerEntry: 'platform_commission_deduct', displayLabel: 'عمولة المنصة' },
    clientDisplay: 'ادفع نقداً للكابتن عند الاستلام',
    partnerDisplay: 'مبيعات معلقة — تنتظر تأكيد إيداع الكابتن',
    captainDisplay: 'ذمة COD · يجب إيداع المبلغ قبل موعد التسوية',
    controlPanelDisplay: 'COD · ذمة كابتن + تسوية شريك معلقة حتى الإيداع',
    accountingEntry: 'Dr. ذمم COD كابتن / Cr. مستحقات شريك (معلق)',
  },
  {
    scenarioId: 'BD_SPLIT',
    scenarioLabel: 'توصيل بثواني — دفع مختلط (محفظة + COD)',
    deliveryMode: 'bthwani_delivery',
    paymentMethod: 'wallet_cod_split',
    payer: 'client',
    payee: 'platform',
    clientImpact: { actorType: 'client', direction: 'debit', amountBasis: 'wallet_portion', walletAffected: true, settlementAffected: false, ledgerEntry: 'client_payment_split', displayLabel: 'خصم جزء من المحفظة + باقي نقدي' },
    partnerImpact: { actorType: 'partner', direction: 'credit', amountBasis: 'order_total', walletAffected: false, settlementAffected: true, ledgerEntry: 'partner_settlement_payout', displayLabel: 'تسوية بعد إيداع الكابتن' },
    captainImpact: { actorType: 'captain', direction: 'hold', amountBasis: 'cod_portion', walletAffected: false, settlementAffected: false, ledgerEntry: 'captain_cod_collection', displayLabel: 'ذمة COD بالمبلغ المتبقي فقط' },
    platformImpact: { actorType: 'platform', direction: 'credit', amountBasis: 'commission', walletAffected: false, settlementAffected: false, ledgerEntry: 'platform_commission_deduct', displayLabel: 'عمولة المنصة' },
    clientDisplay: 'خصم X من المحفظة · ادفع Y للكابتن نقداً',
    partnerDisplay: 'مبيعات معلقة جزئياً — تنتظر إيداع COD',
    captainDisplay: 'ذمة COD بالمبلغ المتبقي · يجب الإيداع',
    controlPanelDisplay: 'دفع مختلط · خصم محفظة + ذمة COD',
    accountingEntry: 'Dr. محفظة العميل + Dr. ذمم COD / Cr. مستحقات شريك',
  },
  {
    scenarioId: 'BD_CARD',
    scenarioLabel: 'توصيل بثواني — دفع بالبطاقة',
    deliveryMode: 'bthwani_delivery',
    paymentMethod: 'card_only',
    payer: 'client',
    payee: 'platform',
    clientImpact: { actorType: 'client', direction: 'none', amountBasis: 'zero', walletAffected: false, settlementAffected: false, ledgerEntry: 'client_payment_card', displayLabel: 'لا تأثير على المحفظة — خصم من البطاقة' },
    partnerImpact: { actorType: 'partner', direction: 'credit', amountBasis: 'order_total', walletAffected: false, settlementAffected: true, ledgerEntry: 'partner_settlement_payout', displayLabel: 'إضافة للتسوية' },
    captainImpact: { actorType: 'captain', direction: 'credit', amountBasis: 'commission', walletAffected: false, settlementAffected: true, ledgerEntry: 'captain_earning_delivery', displayLabel: 'أرباح توصيل' },
    platformImpact: { actorType: 'platform', direction: 'credit', amountBasis: 'commission', walletAffected: false, settlementAffected: false, ledgerEntry: 'platform_commission_deduct', displayLabel: 'عمولة المنصة' },
    clientDisplay: 'دفع بالبطاقة · لا تأثير على رصيد المحفظة',
    partnerDisplay: 'مبيعات معتمدة · تُسوّى في الدورة',
    captainDisplay: 'أرباح توصيل معتمدة',
    controlPanelDisplay: 'دفع بطاقة · تسوية شريك + أرباح كابتن',
    accountingEntry: 'Dr. بوابة الدفع / Cr. إيرادات + مستحقات شريك + مستحقات كابتن',
  },
  {
    scenarioId: 'SD_WALLET',
    scenarioLabel: 'توصيل المتجر — دفع بالمحفظة',
    deliveryMode: 'store_delivery',
    paymentMethod: 'wallet_only',
    payer: 'client',
    payee: 'partner',
    clientImpact: { actorType: 'client', direction: 'debit', amountBasis: 'order_total', walletAffected: true, settlementAffected: false, ledgerEntry: 'client_payment_wallet', displayLabel: 'خصم من المحفظة' },
    partnerImpact: { actorType: 'partner', direction: 'credit', amountBasis: 'order_total', walletAffected: false, settlementAffected: true, ledgerEntry: 'partner_settlement_payout', displayLabel: 'تسوية شاملة + رسوم التوصيل' },
    captainImpact: noImpact('captain', 'لا ينطبق — توصيل المتجر'),
    platformImpact: { actorType: 'platform', direction: 'credit', amountBasis: 'commission', walletAffected: false, settlementAffected: false, ledgerEntry: 'platform_commission_deduct', displayLabel: 'عمولة المنصة' },
    clientDisplay: 'خصم من المحفظة',
    partnerDisplay: 'إيرادات الطلب + رسوم التوصيل ضمن التسوية',
    captainDisplay: 'لا ينطبق',
    controlPanelDisplay: 'توصيل متجر + دفع محفظة',
    accountingEntry: 'Dr. محفظة العميل / Cr. مستحقات شريك + عمولة المنصة',
  },
  {
    scenarioId: 'SD_COD',
    scenarioLabel: 'توصيل المتجر — دفع عند الاستلام',
    deliveryMode: 'store_delivery',
    paymentMethod: 'cod_only',
    payer: 'client',
    payee: 'store_courier',
    clientImpact: noImpact('client', 'نقدي للموصل — لا تأثير على المحفظة'),
    partnerImpact: { actorType: 'partner', direction: 'credit', amountBasis: 'order_total', walletAffected: false, settlementAffected: true, ledgerEntry: 'store_delivery_fee', displayLabel: 'تسوية بعد تأكيد التحصيل' },
    captainImpact: noImpact('captain', 'لا ينطبق'),
    platformImpact: { actorType: 'platform', direction: 'credit', amountBasis: 'commission', walletAffected: false, settlementAffected: false, ledgerEntry: 'platform_commission_deduct', displayLabel: 'عمولة المنصة' },
    clientDisplay: 'ادفع نقداً لموصل المتجر',
    partnerDisplay: 'مبيعات معلقة — تنتظر تأكيد التحصيل',
    captainDisplay: 'لا ينطبق',
    controlPanelDisplay: 'توصيل متجر + COD',
    accountingEntry: 'Dr. ذمم موصل متجر / Cr. مستحقات شريك',
  },
  {
    scenarioId: 'PICKUP_WALLET',
    scenarioLabel: 'استلام ذاتي — دفع بالمحفظة',
    deliveryMode: 'pickup',
    paymentMethod: 'wallet_only',
    payer: 'client',
    payee: 'partner',
    clientImpact: { actorType: 'client', direction: 'debit', amountBasis: 'order_total', walletAffected: true, settlementAffected: false, ledgerEntry: 'client_payment_wallet', displayLabel: 'خصم من المحفظة' },
    partnerImpact: { actorType: 'partner', direction: 'credit', amountBasis: 'order_total', walletAffected: false, settlementAffected: true, ledgerEntry: 'partner_settlement_payout', displayLabel: 'تسوية بدون رسوم توصيل' },
    captainImpact: noImpact('captain', 'لا ينطبق — استلام ذاتي'),
    platformImpact: { actorType: 'platform', direction: 'credit', amountBasis: 'commission', walletAffected: false, settlementAffected: false, ledgerEntry: 'platform_commission_deduct', displayLabel: 'عمولة المنصة' },
    clientDisplay: 'خصم من المحفظة',
    partnerDisplay: 'إيرادات الطلب ضمن التسوية — بدون رسوم توصيل',
    captainDisplay: 'لا ينطبق',
    controlPanelDisplay: 'استلام ذاتي + دفع محفظة',
    accountingEntry: 'Dr. محفظة العميل / Cr. مستحقات شريك + عمولة المنصة',
  },
  {
    scenarioId: 'REFUND_FULL',
    scenarioLabel: 'استرداد كامل',
    deliveryMode: 'bthwani_delivery',
    paymentMethod: 'wallet_only',
    cancelOrRefund: 'refund_full',
    payer: 'platform',
    payee: 'client',
    clientImpact: { actorType: 'client', direction: 'credit', amountBasis: 'order_total', walletAffected: true, settlementAffected: false, ledgerEntry: 'client_refund', displayLabel: 'إضافة للمحفظة' },
    partnerImpact: { actorType: 'partner', direction: 'debit', amountBasis: 'order_total', walletAffected: false, settlementAffected: true, ledgerEntry: 'partner_refund_deduction', displayLabel: 'خصم من التسوية' },
    captainImpact: noImpact('captain', 'أرباح التوصيل محجوزة حتى القرار'),
    platformImpact: { actorType: 'platform', direction: 'debit', amountBasis: 'commission', walletAffected: false, settlementAffected: false, ledgerEntry: 'platform_commission_deduct', displayLabel: 'استرداد عمولة المنصة' },
    clientDisplay: 'استرداد كامل للمحفظة',
    partnerDisplay: 'خصم كامل من التسوية',
    captainDisplay: 'أرباح التوصيل محجوزة',
    controlPanelDisplay: 'استرداد كامل · إضافة محفظة عميل + خصم تسوية شريك',
    accountingEntry: 'Dr. مستحقات شريك / Cr. محفظة العميل',
  },
  {
    scenarioId: 'REFUND_PARTIAL',
    scenarioLabel: 'استرداد جزئي',
    deliveryMode: 'bthwani_delivery',
    paymentMethod: 'wallet_only',
    cancelOrRefund: 'refund_partial',
    payer: 'platform',
    payee: 'client',
    clientImpact: { actorType: 'client', direction: 'credit', amountBasis: 'refund', walletAffected: true, settlementAffected: false, ledgerEntry: 'client_refund', displayLabel: 'إضافة جزئية للمحفظة' },
    partnerImpact: { actorType: 'partner', direction: 'debit', amountBasis: 'refund', walletAffected: false, settlementAffected: true, ledgerEntry: 'partner_refund_deduction', displayLabel: 'خصم جزئي من التسوية' },
    captainImpact: { actorType: 'captain', direction: 'credit', amountBasis: 'commission', walletAffected: false, settlementAffected: true, ledgerEntry: 'captain_earning_delivery', displayLabel: 'أرباح التوصيل محفوظة' },
    platformImpact: noImpact('platform', 'عمولة المنصة محفوظة'),
    clientDisplay: 'استرداد جزئي للمحفظة',
    partnerDisplay: 'خصم جزئي من التسوية',
    captainDisplay: 'أرباح التوصيل محفوظة',
    controlPanelDisplay: 'استرداد جزئي · خصم جزئي من تسوية الشريك',
    accountingEntry: 'Dr. مستحقات شريك (جزئي) / Cr. محفظة العميل',
  },
  {
    scenarioId: 'FAILED_PAYMENT',
    scenarioLabel: 'فشل الدفع',
    deliveryMode: 'bthwani_delivery',
    paymentMethod: 'wallet_only',
    payer: 'client',
    payee: 'platform',
    clientImpact: { actorType: 'client', direction: 'none', amountBasis: 'zero', walletAffected: false, settlementAffected: false, ledgerEntry: 'failed_payment', displayLabel: 'فشل الخصم — رصيد غير كافٍ' },
    partnerImpact: noImpact('partner', 'الطلب معلق — لا تسوية'),
    captainImpact: noImpact('captain', 'لا أرباح حتى إتمام الدفع'),
    platformImpact: noImpact('platform', 'لا عمولة حتى إتمام الدفع'),
    clientDisplay: 'فشل الدفع · رصيد غير كافٍ · يرجى الشحن أو تغيير طريقة الدفع',
    partnerDisplay: 'طلب معلق — لا تسوية حتى إتمام الدفع',
    captainDisplay: 'لا أرباح — الطلب لم يكتمل',
    controlPanelDisplay: 'فشل دفع · الطلب معلق',
    accountingEntry: 'لا قيد — الطلب لم يُنفَّذ',
  },
  {
    scenarioId: 'CANCEL_BEFORE',
    scenarioLabel: 'إلغاء قبل القبول',
    deliveryMode: 'bthwani_delivery',
    paymentMethod: 'wallet_only',
    cancelOrRefund: 'cancel_before_acceptance',
    payer: 'platform',
    payee: 'client',
    clientImpact: { actorType: 'client', direction: 'credit', amountBasis: 'order_total', walletAffected: true, settlementAffected: false, ledgerEntry: 'client_refund', displayLabel: 'استرداد كامل فوري للمحفظة' },
    partnerImpact: noImpact('partner', 'لا تسوية — الطلب ألغي قبل القبول'),
    captainImpact: noImpact('captain', 'لا أرباح'),
    platformImpact: noImpact('platform', 'لا عمولة'),
    clientDisplay: 'استرداد كامل فوري للمحفظة',
    partnerDisplay: 'لا تسوية — الإلغاء قبل القبول',
    captainDisplay: 'لا أرباح',
    controlPanelDisplay: 'إلغاء قبل القبول · استرداد كامل',
    accountingEntry: 'Dr. إيرادات مؤقتة / Cr. محفظة العميل',
  },
];

export function getWalletEventMatrixRow(scenarioId: string): WalletEventMatrixRow | undefined {
  return WALLET_EVENT_MATRIX.find((row) => row.scenarioId === scenarioId);
}

export function getWalletEventMatrixForDeliveryMode(mode: DeliveryMode): readonly WalletEventMatrixRow[] {
  return WALLET_EVENT_MATRIX.filter((row) => row.deliveryMode === mode);
}

export function getWalletEventMatrixForPaymentMethod(method: PaymentMethodMode): readonly WalletEventMatrixRow[] {
  return WALLET_EVENT_MATRIX.filter((row) => row.paymentMethod === method);
}
