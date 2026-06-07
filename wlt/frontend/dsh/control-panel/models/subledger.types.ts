/**
 * WLT DSH Subledger Matrix — types + data.
 * Each financial domain maps to a subledger + control account.
 * All subledger totals must match control accounts before daily close.
 * PREVIEW_ONLY — CONTRACT_SCAFFOLD_PREVIEW_ONLY
 */

import type { WltDshFinanceEventKind } from './dshFinance.types';
import type { WltSubledgerId } from './chartOfAccounts.types';

export type WltSubledgerEntry = {
  readonly id: WltSubledgerId;
  readonly label: string;
  readonly controlAccountCode: string;
  readonly controlAccountLabel: string;
  readonly eventKinds: ReadonlyArray<WltDshFinanceEventKind>;
  readonly closeGateRequired: boolean;
  readonly description: string;
  readonly isPreview: true;
};

export const WLT_SUBLEDGER_MATRIX: readonly WltSubledgerEntry[] = [
  { id: 'cod-captain-subledger', label: 'دفتر أستاذ مساعد — COD الكابتن', controlAccountCode: '1020', controlAccountLabel: 'ذمم COD مستحقة (كابتن)', eventKinds: ['captain-cod-liability', 'cash-on-delivery'], closeGateRequired: true, description: 'يسجّل كل حقيبة نقدية يجب إيداعها من الكابتن. يجب أن يكون الرصيد صفرًا أو مدعومًا بأدلة إيداع قبل إغلاق اليوم.', isPreview: true },
  { id: 'partner-settlement-subledger', label: 'دفتر أستاذ مساعد — تسوية الشريك', controlAccountCode: '2020', controlAccountLabel: 'مستحقات الشريك', eventKinds: ['partner-settlement', 'store-delivery-fee'], closeGateRequired: true, description: 'يسجّل مستحقات المتاجر الشركاء من التسويات الأسبوعية. يجب مطابقة مع مرجع الإيداع البنكي قبل الإغلاق.', isPreview: true },
  { id: 'refund-liability-subledger', label: 'دفتر أستاذ مساعد — الاستردادات', controlAccountCode: '2050', controlAccountLabel: 'التزام الاسترداد للعميل', eventKinds: ['refund-adjustment'], closeGateRequired: true, description: 'يسجّل كل طلبات الاسترداد المعتمدة والمعلقة. يجب أن تكون النزاعات مغلقة أو مبررة قبل الإغلاق.', isPreview: true },
  { id: 'wallet-liability-subledger', label: 'دفتر أستاذ مساعد — محفظة العميل', controlAccountCode: '2001', controlAccountLabel: 'رصيد محفظة العميل (التزام)', eventKinds: ['wallet-payment', 'client-payment'], closeGateRequired: false, description: 'يسجّل أرصدة محافظ العملاء. لا يحجب إغلاق اليوم ما لم يكن هناك تعارض.', isPreview: true },
  { id: 'captain-payable-subledger', label: 'دفتر أستاذ مساعد — مستحقات الكابتن', controlAccountCode: '2010', controlAccountLabel: 'مستحقات الكابتن', eventKinds: ['captain-earning', 'captain-eligibility-topup'], closeGateRequired: true, description: 'يسجّل أرباح الكابتن ورصيده الضامن. يجب مطابقة مع سجلات التوصيل قبل الإغلاق.', isPreview: true },
  { id: 'field-commission-subledger', label: 'دفتر أستاذ مساعد — عمولات الميداني', controlAccountCode: '2030', controlAccountLabel: 'مستحقات الميداني', eventKinds: ['field-commission', 'field-commission-pending', 'field-commission-rejected', 'field-payout'], closeGateRequired: true, description: 'يسجّل عمولات الاستقطاب الميداني المعتمدة والمعلقة.', isPreview: true },
  { id: 'store-courier-subledger', label: 'دفتر أستاذ مساعد — موصل المتجر', controlAccountCode: '2040', controlAccountLabel: 'مستحقات موصل المتجر', eventKinds: ['store-courier-compensation'], closeGateRequired: false, description: 'تعويض موصل المتجر الداخلي. ليس كابتن بثواني. لا يحجب إغلاق اليوم.', isPreview: true },
  { id: 'platform-revenue-subledger', label: 'دفتر أستاذ مساعد — إيرادات المنصة', controlAccountCode: '4001', controlAccountLabel: 'إيرادات عمولة المنصة', eventKinds: ['platform-commission', 'reconciliation-export'], closeGateRequired: true, description: 'يسجّل عمولات المنصة المعترف بها. يجب أن تكون إجماليات الدورة متطابقة مع الفواتير قبل الإغلاق.', isPreview: true },
] as const;

export function getWltSubledgerById(id: WltSubledgerId): WltSubledgerEntry | undefined {
  return WLT_SUBLEDGER_MATRIX.find((s) => s.id === id);
}

export function getWltCloseGateSubledgers(): readonly WltSubledgerEntry[] {
  return WLT_SUBLEDGER_MATRIX.filter((s) => s.closeGateRequired);
}

export function getWltSubledgerForEventKind(eventKind: WltDshFinanceEventKind): WltSubledgerEntry | undefined {
  return WLT_SUBLEDGER_MATRIX.find((s) => s.eventKinds.includes(eventKind));
}

export const WLT_SUBLEDGER_MATRIX_CONTRACT = {
  contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  owner: 'wlt',
  isPreview: true,
} as const;
