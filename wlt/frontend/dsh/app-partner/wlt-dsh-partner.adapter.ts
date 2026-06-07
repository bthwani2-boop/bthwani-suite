import type React from 'react';
import type { Icon } from '@bthwani/ui-kit';
import type {
  WltDshFinancePreviewRecord,
  WltDshFinanceEventKind,
  WltDshFinanceStatusTone,
  WltDshFinanceTone,
} from '../control-panel/financeContracts';

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
  kind?: WltDshFinanceEventKind;
  kindLabel?: string;
  sourceOrderLabel?: string;
  settlementCycleLabel?: string;
  includedInNetSettlementLabel?: string;
  fulfillmentModeLabel?: string;
  isStoreDeliveryFee?: boolean;
  isStoreCourierCompensation?: boolean;
  isCaptainPayout?: boolean;
  policyLabel?: string;
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
 * ÙŠØ­ÙˆÙ‘Ù„ WltDshFinanceEventKind Ø¥Ù„Ù‰ ØªØ³Ù…ÙŠØ© Ø¹Ø±Ø¨ÙŠØ© ÙˆØ§Ø¶Ø­Ø© Ø¨Ø¯ÙˆÙ† raw labels.
 * Ù„Ø§ ØªØ¹Ø±Ø¶ kind Ø®Ø§Ù…Ù‹Ø§ Ø£Ø¨Ø¯Ù‹Ø§.
 */
function resolveKindLabel(kind: WltDshFinanceEventKind): string {
  const map: Record<WltDshFinanceEventKind, string> = {
    'client-payment': 'Ø¯ÙØ¹ Ø§Ù„Ø¹Ù…ÙŠÙ„',
    'wallet-payment': 'Ø¯ÙØ¹ Ø¨Ø§Ù„Ù…Ø­ÙØ¸Ø©',
    'cash-on-delivery': 'Ø¯ÙØ¹ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…',
    'partner-settlement': 'ØªØ³ÙˆÙŠØ© Ø§Ù„Ø´Ø±ÙŠÙƒ',
    'store-delivery-fee': 'Ø±Ø³ÙˆÙ… ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø±',
    'store-courier-compensation': 'ØªØ¹ÙˆÙŠØ¶ Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø±',
    'captain-earning': 'Ø£Ø±Ø¨Ø§Ø­ ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ',
    'captain-cod-liability': 'Ø°Ù…Ø© COD Ø¹Ù„Ù‰ Ø§Ù„ÙƒØ§Ø¨ØªÙ†',
    'captain-eligibility-topup': 'Ø´Ø­Ù† Ø±ØµÙŠØ¯ Ø§Ù„Ø¶Ø§Ù…Ù†',
    'field-commission': 'Ø¹Ù…ÙˆÙ„Ø© Ù…ÙŠØ¯Ø§Ù†ÙŠ',
    'field-commission-pending': 'Ø¹Ù…ÙˆÙ„Ø© Ù…ÙŠØ¯Ø§Ù†ÙŠ â€” Ù…Ø¹Ù„Ù‚Ø©',
    'field-commission-rejected': 'Ø¹Ù…ÙˆÙ„Ø© Ù…ÙŠØ¯Ø§Ù†ÙŠ â€” Ù…Ø±ÙÙˆØ¶Ø©',
    'field-payout': 'ØµØ±Ù Ù…ÙŠØ¯Ø§Ù†ÙŠ',
    'refund-adjustment': 'Ø®ØµÙ… / Ø§Ø³ØªØ±Ø¯Ø§Ø¯',
    'platform-commission': 'Ø¹Ù…ÙˆÙ„Ø© Ø§Ù„Ù…Ù†ØµØ©',
    'reconciliation-export': 'Ù…Ø·Ø§Ø¨Ù‚Ø© / ØªØµØ¯ÙŠØ±',
  };
  return map[kind] ?? 'Ø­Ø±ÙƒØ© Ù…Ø§Ù„ÙŠØ©';
}

/**
 * ÙŠØ­Ø¯Ø¯ Ù…Ø§ Ø¥Ø°Ø§ ÙƒØ§Ù†Øª Ø§Ù„Ø­Ø±ÙƒØ© ØªØ¯Ø®Ù„ ÙÙŠ ØµØ§ÙÙŠ Ø§Ù„ØªØ³ÙˆÙŠØ©.
 */
function resolveSettlementImpact(kind: WltDshFinanceEventKind): string {
  if (kind === 'partner-settlement') return 'ØªØ¯Ø®Ù„ ÙÙŠ Ø§Ù„ØªØ³ÙˆÙŠØ© â€” ØµØ±Ù Ù…Ø¨Ø§Ø´Ø±';
  if (kind === 'store-delivery-fee') return 'ØªØ¯Ø®Ù„ ÙÙŠ ØµØ§ÙÙŠ Ø§Ù„ØªØ³ÙˆÙŠØ© â€” Ø­Ø³Ø¨ Ø§Ù„Ø³ÙŠØ§Ø³Ø©';
  if (kind === 'store-courier-compensation') return 'Ù„Ø§ ØªØ¯Ø®Ù„ â€” Ø¯ÙØ¹ Ø¯Ø§Ø®Ù„ÙŠ Ù…Ù† Ø§Ù„Ù…ØªØ¬Ø±';
  if (kind === 'platform-commission') return 'ØªÙØ®ØµÙ… Ù…Ù† ØµØ§ÙÙŠ Ø§Ù„ØªØ³ÙˆÙŠØ©';
  if (kind === 'refund-adjustment') return 'ØªÙØ®ØµÙ… Ù…Ù† ØµØ§ÙÙŠ Ø§Ù„ØªØ³ÙˆÙŠØ©';
  if (kind === 'captain-earning') return 'Ù„Ø§ ØªÙ†Ø·Ø¨Ù‚ â€” ÙŠØ®Øµ ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ ÙÙ‚Ø·';
  if (kind === 'captain-cod-liability') return 'Ù„Ø§ ØªÙ†Ø·Ø¨Ù‚ â€” Ø°Ù…Ø© ÙƒØ§Ø¨ØªÙ† ÙÙ‚Ø·';
  if (kind === 'reconciliation-export') return 'Ù„Ù„Ù…Ø·Ø§Ø¨Ù‚Ø© ÙÙ‚Ø· â€” Ù„ÙŠØ³Øª Ø¯ÙØ¹Ø©';
  return 'Ø­Ø³Ø¨ Ø¹Ù‚Ø¯ WLT';
}

function resolvePolicyLabel(kind: WltDshFinanceEventKind): string {
  if (kind === 'store-delivery-fee') return 'Ø±Ø³ÙˆÙ… ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø± â€” ØªØ°Ù‡Ø¨ Ù„Ù„Ø´Ø±ÙŠÙƒ Ø­Ø³Ø¨ Ø§Ù„Ø³ÙŠØ§Ø³Ø©';
  if (kind === 'store-courier-compensation') {
    return 'ØªØ¹ÙˆÙŠØ¶ Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø± â€” ÙŠÙØ¯ÙØ¹ Ù…Ù† Ø§Ù„Ù…ØªØ¬Ø± Ù„Ù…ÙˆØµÙ„Ù‡ Ø§Ù„Ø¯Ø§Ø®Ù„ÙŠ. Ù„ÙŠØ³ ØªØ³ÙˆÙŠØ© ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ.';
  }
  if (kind === 'captain-earning') return 'Ø£Ø±Ø¨Ø§Ø­ ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ â€” Ø¶Ù…Ù† WLT captain payout. Ù„Ø§ ØªÙØ®Ù„Ø· Ù…Ø¹ ØªØ³ÙˆÙŠØ§Øª Ø§Ù„Ù…ØªØ¬Ø±.';
  if (kind === 'captain-cod-liability') return 'Ø°Ù…Ø© COD â€” Ø§Ù„ÙƒØ§Ø¨ØªÙ† Ù…Ø³Ø¤ÙˆÙ„ Ø¹Ù† Ø¥ÙŠØ¯Ø§Ø¹Ù‡Ø§. Ù„Ø§ ØªØªØ¹Ù„Ù‚ Ø¨Ø§Ù„Ø´Ø±ÙŠÙƒ.';
  if (kind === 'partner-settlement') return 'ØªØ³ÙˆÙŠØ© Ø§Ù„Ø´Ø±ÙŠÙƒ â€” ØµØ§ÙÙŠ Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª Ù…Ø·Ø±ÙˆØ­Ù‹Ø§ Ù…Ù†Ù‡Ø§ Ø§Ù„Ø¹Ù…ÙˆÙ„Ø© ÙˆØ§Ù„Ø®ØµÙˆÙ…Ø§Øª.';
  if (kind === 'platform-commission') return 'Ø¹Ù…ÙˆÙ„Ø© Ø§Ù„Ù…Ù†ØµØ© â€” ØªÙØ®ØµÙ… ØªÙ„Ù‚Ø§Ø¦ÙŠÙ‹Ø§ Ù…Ù† ØªØ³ÙˆÙŠØ© Ø§Ù„Ø´Ø±ÙŠÙƒ.';
  return 'Ø­Ø³Ø¨ Ø³ÙŠØ§Ø³Ø© WLT';
}

function sanitizeLabel(text: string | undefined): string {
  if (!text) return '';
  let result = text;
  result = result.replace(/partner_delivery/g, 'ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø±');
  result = result.replace(/bthwani_delivery/g, 'ØªÙˆØµÙŠÙ„ Ø¨Ø«ÙˆØ§Ù†ÙŠ');
  result = result.replace(/pickup/g, 'Ø§Ø³ØªÙ„Ø§Ù… Ø°Ø§ØªÙŠ');
  result = result.replace(/CONTRACT_TBD/g, 'Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©');
  result = result.replace(/store_courier_mode/g, 'ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø±');
  result = result.replace(/bthwani_captain_mode/g, 'ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ');
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
    kind: record.kind,
    kindLabel: resolveKindLabel(record.kind),
    sourceOrderLabel: record.sourceOrderId
      ? `Ø·Ù„Ø¨ #${record.sourceOrderId}`
      : record.settlementCycleId
      ? `Ø¯ÙˆØ±Ø© #${record.settlementCycleId}`
      : record.sourceStoreId
      ? `Ù…ØªØ¬Ø± #${record.sourceStoreId}`
      : undefined,
    settlementCycleLabel: record.settlementCycleId
      ? `Ø¯ÙˆØ±Ø© #${record.settlementCycleId}`
      : undefined,
    includedInNetSettlementLabel: resolveSettlementImpact(record.kind),
    isStoreDeliveryFee: record.kind === 'store-delivery-fee',
    isStoreCourierCompensation: record.kind === 'store-courier-compensation',
    isCaptainPayout: record.kind === 'captain-earning' || record.kind === 'captain-cod-liability',
    policyLabel: resolvePolicyLabel(record.kind),
  }));
}
