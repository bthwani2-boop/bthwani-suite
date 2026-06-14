/**
 * WLT DSH Posting Rules — types + data.
 * Each event kind maps to a double-entry posting.
 * debitAccountCode !== creditAccountCode always.
 * PREVIEW_ONLY — CONTRACT_SCAFFOLD_PREVIEW_ONLY
 */

import type { WltDshFinanceEventKind } from './dshFinance.types';

export type WltPostingRule = {
  readonly eventKind: WltDshFinanceEventKind;
  readonly label: string;
  readonly debitAccountCode: string;
  readonly debitAccountLabel: string;
  readonly creditAccountCode: string;
  readonly creditAccountLabel: string;
  readonly subledgerId?: string;
  readonly requiresIdempotencyKey: boolean;
  readonly requiresMakerApproval: boolean;
  readonly requiresCheckerApproval: boolean;
  readonly requiresEvidence: boolean;
  readonly closeGateBlocker: boolean;
  readonly isPreview: true;
};

export const WLT_POSTING_RULES: readonly WltPostingRule[] = [
  { eventKind: 'client-payment', label: 'دفع العميل — تحصيل قيمة الطلب', debitAccountCode: '1010', debitAccountLabel: 'رصيد المقاصة البنكية', creditAccountCode: '2001', creditAccountLabel: 'رصيد محفظة العميل (التزام)', subledgerId: 'wallet-liability-subledger', requiresIdempotencyKey: true, requiresMakerApproval: false, requiresCheckerApproval: false, requiresEvidence: true, closeGateBlocker: false, isPreview: true },
  { eventKind: 'wallet-payment', label: 'دفع بالمحفظة — خصم رصيد WLT', debitAccountCode: '2001', debitAccountLabel: 'رصيد محفظة العميل (التزام)', creditAccountCode: '4010', creditAccountLabel: 'إيرادات رسوم التوصيل', subledgerId: 'wallet-liability-subledger', requiresIdempotencyKey: true, requiresMakerApproval: false, requiresCheckerApproval: false, requiresEvidence: true, closeGateBlocker: false, isPreview: true },
  { eventKind: 'cash-on-delivery', label: 'COD — تسجيل الكاش المحصّل', debitAccountCode: '1001', debitAccountLabel: 'النقدية بالصندوق', creditAccountCode: '1020', creditAccountLabel: 'ذمم COD مستحقة (كابتن)', subledgerId: 'cod-captain-subledger', requiresIdempotencyKey: true, requiresMakerApproval: true, requiresCheckerApproval: true, requiresEvidence: true, closeGateBlocker: true, isPreview: true },
  { eventKind: 'captain-cod-liability', label: 'ذمة COD الكابتن — تسجيل الالتزام', debitAccountCode: '1020', debitAccountLabel: 'ذمم COD مستحقة (كابتن)', creditAccountCode: '2010', creditAccountLabel: 'مستحقات الكابتن', subledgerId: 'cod-captain-subledger', requiresIdempotencyKey: true, requiresMakerApproval: true, requiresCheckerApproval: true, requiresEvidence: true, closeGateBlocker: true, isPreview: true },
  { eventKind: 'captain-earning', label: 'أرباح الكابتن — تسجيل المستحق', debitAccountCode: '4010', debitAccountLabel: 'إيرادات رسوم التوصيل', creditAccountCode: '2010', creditAccountLabel: 'مستحقات الكابتن', subledgerId: 'captain-payable-subledger', requiresIdempotencyKey: false, requiresMakerApproval: false, requiresCheckerApproval: false, requiresEvidence: true, closeGateBlocker: true, isPreview: true },
  { eventKind: 'captain-eligibility-topup', label: 'شحن الرصيد الضامن للكابتن', debitAccountCode: '1010', debitAccountLabel: 'رصيد المقاصة البنكية', creditAccountCode: '2010', creditAccountLabel: 'مستحقات الكابتن', subledgerId: 'captain-payable-subledger', requiresIdempotencyKey: true, requiresMakerApproval: true, requiresCheckerApproval: false, requiresEvidence: true, closeGateBlocker: false, isPreview: true },
  { eventKind: 'partner-settlement', label: 'تسوية الشريك — اعتراف بالمستحق', debitAccountCode: '1030', debitAccountLabel: 'مقاصة التسوية', creditAccountCode: '2020', creditAccountLabel: 'مستحقات الشريك', subledgerId: 'partner-settlement-subledger', requiresIdempotencyKey: true, requiresMakerApproval: true, requiresCheckerApproval: true, requiresEvidence: true, closeGateBlocker: true, isPreview: true },
  { eventKind: 'store-delivery-fee', label: 'رسوم توصيل المتجر', debitAccountCode: '1010', debitAccountLabel: 'رصيد المقاصة البنكية', creditAccountCode: '2020', creditAccountLabel: 'مستحقات الشريك', subledgerId: 'partner-settlement-subledger', requiresIdempotencyKey: false, requiresMakerApproval: false, requiresCheckerApproval: false, requiresEvidence: true, closeGateBlocker: false, isPreview: true },
  { eventKind: 'store-courier-compensation', label: 'تعويض موصل المتجر — داخل المتجر فقط', debitAccountCode: '2020', debitAccountLabel: 'مستحقات الشريك', creditAccountCode: '2040', creditAccountLabel: 'مستحقات موصل المتجر', subledgerId: 'store-courier-subledger', requiresIdempotencyKey: false, requiresMakerApproval: false, requiresCheckerApproval: false, requiresEvidence: false, closeGateBlocker: false, isPreview: true },
  { eventKind: 'field-commission', label: 'عمولة الميداني — معتمدة', debitAccountCode: '5010', debitAccountLabel: 'مصروف الترويج والخصومات', creditAccountCode: '2030', creditAccountLabel: 'مستحقات الميداني', subledgerId: 'field-commission-subledger', requiresIdempotencyKey: false, requiresMakerApproval: true, requiresCheckerApproval: false, requiresEvidence: true, closeGateBlocker: true, isPreview: true },
  { eventKind: 'field-commission-pending', label: 'عمولة الميداني — معلقة', debitAccountCode: '5010', debitAccountLabel: 'مصروف الترويج والخصومات', creditAccountCode: '2030', creditAccountLabel: 'مستحقات الميداني', subledgerId: 'field-commission-subledger', requiresIdempotencyKey: false, requiresMakerApproval: true, requiresCheckerApproval: true, requiresEvidence: true, closeGateBlocker: true, isPreview: true },
  { eventKind: 'field-commission-rejected', label: 'عمولة الميداني — مرفوضة (لا قيد)', debitAccountCode: '5010', debitAccountLabel: 'مصروف الترويج والخصومات', creditAccountCode: '2030', creditAccountLabel: 'مستحقات الميداني', subledgerId: 'field-commission-subledger', requiresIdempotencyKey: false, requiresMakerApproval: false, requiresCheckerApproval: false, requiresEvidence: false, closeGateBlocker: false, isPreview: true },
  { eventKind: 'field-payout', label: 'صرف للميداني — تحويل فعلي', debitAccountCode: '2030', debitAccountLabel: 'مستحقات الميداني', creditAccountCode: '1010', creditAccountLabel: 'رصيد المقاصة البنكية', subledgerId: 'field-commission-subledger', requiresIdempotencyKey: true, requiresMakerApproval: true, requiresCheckerApproval: true, requiresEvidence: true, closeGateBlocker: true, isPreview: true },
  { eventKind: 'refund-adjustment', label: 'استرداد للعميل — تسجيل الالتزام', debitAccountCode: '5001', debitAccountLabel: 'مصروف الاسترداد', creditAccountCode: '2050', creditAccountLabel: 'التزام الاسترداد للعميل', subledgerId: 'refund-liability-subledger', requiresIdempotencyKey: true, requiresMakerApproval: true, requiresCheckerApproval: true, requiresEvidence: true, closeGateBlocker: true, isPreview: true },
  { eventKind: 'platform-commission', label: 'عمولة المنصة — اعتراف بالإيراد', debitAccountCode: '1030', debitAccountLabel: 'مقاصة التسوية', creditAccountCode: '4001', creditAccountLabel: 'إيرادات عمولة المنصة', subledgerId: 'platform-revenue-subledger', requiresIdempotencyKey: false, requiresMakerApproval: false, requiresCheckerApproval: false, requiresEvidence: true, closeGateBlocker: true, isPreview: true },
  { eventKind: 'reconciliation-export', label: 'تصدير المطابقة — إغلاق الدورة', debitAccountCode: '1030', debitAccountLabel: 'مقاصة التسوية', creditAccountCode: '4001', creditAccountLabel: 'إيرادات عمولة المنصة', subledgerId: 'platform-revenue-subledger', requiresIdempotencyKey: true, requiresMakerApproval: true, requiresCheckerApproval: true, requiresEvidence: true, closeGateBlocker: true, isPreview: true },
] as const;

export function getWltPostingRuleForEvent(eventKind: WltDshFinanceEventKind): WltPostingRule | undefined {
  return WLT_POSTING_RULES.find((r) => r.eventKind === eventKind);
}

export function getWltCloseGateBlockingRules(): readonly WltPostingRule[] {
  return WLT_POSTING_RULES.filter((r) => r.closeGateBlocker);
}

export const WLT_POSTING_RULES_CONTRACT = {
  contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  owner: 'wlt',
  principle: 'double-entry: debitAccountCode !== creditAccountCode; money moves, never appears',
  isPreview: true,
} as const;
