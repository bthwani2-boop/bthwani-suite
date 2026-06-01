import type React from 'react';
import type { Icon } from '@bthwani/ui-kit';
import type {
  WltDshFinancePreviewRecord,
  WltDshFinanceEventKind,
  WltDshFinanceStatusTone,
  WltDshFinanceTone,
} from '../../control-panel/dsh/dshFinancePreview';

export type WltDshPartnerTransactionTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

export type WltDshPartnerWalletTransaction = {
  id: string;
  title: string;
  subtitle: string;
  amountLabel: string;
  amountTone?: WltDshPartnerTransactionTone;
  statusLabel?: string;
  statusTone?: WltDshPartnerTransactionTone;
  timeLabel: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  hasDetails?: boolean;
  // PHASE 2 — حقول إضافية لشرح كل حركة مالية بوضوح
  kind?: WltDshFinanceEventKind;
  kindLabel?: string;
  sourceOrderLabel?: string;
  settlementCycleLabel?: string;
  includedInNetSettlementLabel?: string;
  sourceTruthLabel?: string;
  runtimeBindingLabel?: string;
  accountingWarningLabel?: string;
  fulfillmentModeLabel?: string;
  isStoreDeliveryFee?: boolean;
  isStoreCourierCompensation?: boolean;
  isCaptainPayout?: boolean;
  policyLabel?: string;
  previewNoticeLabel?: string;
};

function mapAmountTone(tone: WltDshFinanceTone): WltDshPartnerTransactionTone {
  if (tone === 'positive') {
    return 'success';
  }

  if (tone === 'negative') {
    return 'danger';
  }

  return 'info';
}

function mapStatusTone(tone: WltDshFinanceStatusTone): WltDshPartnerTransactionTone {
  if (tone === 'success') {
    return 'success';
  }

  if (tone === 'warning') {
    return 'warning';
  }

  if (tone === 'error') {
    return 'danger';
  }

  return 'info';
}

function resolveTransactionIcon(record: WltDshFinancePreviewRecord): React.ComponentProps<typeof Icon>['name'] {
  if (record.kind === 'partner-settlement') {
    return 'wallet-outline';
  }

  if (record.kind === 'store-delivery-fee') {
    return 'storefront-outline';
  }

  if (record.kind === 'store-courier-compensation') {
    return 'person-outline';
  }

  if (record.kind === 'captain-earning' || record.kind === 'captain-cod-liability') {
    return 'bicycle-outline';
  }

  if (record.kind === 'refund-adjustment') {
    return 'return-down-back-outline';
  }

  if (record.kind === 'platform-commission') {
    return 'pie-chart-outline';
  }

  if (record.kind === 'reconciliation-export') {
    return 'checkmark-circle-outline';
  }

  return 'swap-horizontal-outline';
}

/**
 * يحوّل WltDshFinanceEventKind إلى تسمية عربية واضحة بدون raw labels.
 * لا تعرض kind خامًا أبدًا.
 */
function resolveKindLabel(kind: WltDshFinanceEventKind): string {
  const map: Record<WltDshFinanceEventKind, string> = {
    'client-payment': 'دفع العميل',
    'wallet-payment': 'دفع بالمحفظة',
    'cash-on-delivery': 'دفع عند الاستلام',
    'partner-settlement': 'تسوية الشريك',
    'store-delivery-fee': 'رسوم توصيل المتجر',
    'store-courier-compensation': 'تعويض موصل المتجر',
    'captain-earning': 'أرباح كابتن بثواني',
    'captain-cod-liability': 'ذمة COD على الكابتن',
    'captain-eligibility-topup': 'شحن رصيد الضامن',
    'field-commission': 'عمولة ميداني',
    'field-commission-pending': 'عمولة ميداني — معلقة',
    'field-commission-rejected': 'عمولة ميداني — مرفوضة',
    'field-payout': 'صرف ميداني',
    'refund-adjustment': 'خصم / استرداد',
    'platform-commission': 'عمولة المنصة',
    'reconciliation-export': 'مطابقة / تصدير',
  };
  return map[kind] ?? 'حركة مالية';
}

/**
 * يحدد ما إذا كانت الحركة تدخل في صافي التسوية.
 */
function resolveSettlementImpact(kind: WltDshFinanceEventKind): string {
  if (kind === 'partner-settlement') return 'تدخل في التسوية — صرف مباشر';
  if (kind === 'store-delivery-fee') return 'تدخل في صافي التسوية — حسب السياسة';
  if (kind === 'store-courier-compensation') return 'لا تدخل — دفع داخلي من المتجر';
  if (kind === 'platform-commission') return 'تُخصم من صافي التسوية';
  if (kind === 'refund-adjustment') return 'تُخصم من صافي التسوية';
  if (kind === 'captain-earning') return 'لا تنطبق — يخص كابتن بثواني فقط';
  if (kind === 'captain-cod-liability') return 'لا تنطبق — ذمة كابتن فقط';
  if (kind === 'reconciliation-export') return 'للمطابقة فقط — ليست دفعة';
  return 'حسب عقد WLT';
}

function resolvePolicyLabel(kind: WltDshFinanceEventKind): string {
  if (kind === 'store-delivery-fee') return 'رسوم توصيل المتجر — تذهب للشريك حسب السياسة';
  if (kind === 'store-courier-compensation') {
    return 'تعويض موصل المتجر — يُدفع من المتجر لموصله الداخلي. ليس تسوية كابتن بثواني.';
  }
  if (kind === 'captain-earning') return 'أرباح كابتن بثواني — ضمن WLT captain payout. لا تُخلط مع تسويات المتجر.';
  if (kind === 'captain-cod-liability') return 'ذمة COD — الكابتن مسؤول عن إيداعها. لا تتعلق بالشريك.';
  if (kind === 'partner-settlement') return 'تسوية الشريك — صافي المبيعات مطروحًا منها العمولة والخصومات.';
  if (kind === 'platform-commission') return 'عمولة المنصة — تُخصم تلقائيًا من تسوية الشريك.';
  return 'حسب سياسة WLT';
}

function sanitizeLabel(text: string | undefined): string {
  if (!text) return '';
  let result = text;
  result = result.replace(/partner_delivery/g, 'توصيل المتجر');
  result = result.replace(/bthwani_delivery/g, 'توصيل بثواني');
  result = result.replace(/pickup/g, 'استلام ذاتي');
  result = result.replace(/UI_PREVIEW_ONLY/g, 'خاضع لسياسة المحفظة');
  result = result.replace(/CONTRACT_TBD/g, 'قيد المراجعة');
  result = result.replace(/store_courier_mode/g, 'توصيل المتجر');
  result = result.replace(/bthwani_captain_mode/g, 'كابتن بثواني');
  return result;
}

export function mapWltDshPartnerPreviewTransactions(
  records: readonly WltDshFinancePreviewRecord[],
): readonly WltDshPartnerWalletTransaction[] {
  return records.map((record) => ({
    id: record.id,
    title: sanitizeLabel(record.title),
    subtitle: sanitizeLabel(record.subtitle),
    amountLabel: sanitizeLabel(record.amountLabel),
    amountTone: mapAmountTone(record.tone),
    statusLabel: sanitizeLabel(record.statusLabel),
    statusTone: mapStatusTone(record.statusTone),
    timeLabel: sanitizeLabel(record.timeLabel),
    icon: resolveTransactionIcon(record),
    hasDetails: true,
    // PHASE 2 — حقول الشرح المالي
    kind: record.kind,
    kindLabel: resolveKindLabel(record.kind),
    sourceOrderLabel: record.sourceOrderId
      ? `طلب #${record.sourceOrderId}`
      : record.settlementCycleId
      ? `دورة #${record.settlementCycleId}`
      : record.sourceStoreId
      ? `متجر #${record.sourceStoreId}`
      : undefined,
    settlementCycleLabel: record.settlementCycleId
      ? `دورة #${record.settlementCycleId}`
      : undefined,
    includedInNetSettlementLabel: resolveSettlementImpact(record.kind),
    sourceTruthLabel: 'WLT',
    runtimeBindingLabel: 'runtime غير مربوط',
    accountingWarningLabel: 'معاينة فقط — لا تمثل تسوية فعلية',
    isStoreDeliveryFee: record.kind === 'store-delivery-fee',
    isStoreCourierCompensation: record.kind === 'store-courier-compensation',
    isCaptainPayout: record.kind === 'captain-earning' || record.kind === 'captain-cod-liability',
    policyLabel: resolvePolicyLabel(record.kind),
    previewNoticeLabel: 'بيانات تجريبية — لا تمثل تسويات فعلية',
  }));
}
