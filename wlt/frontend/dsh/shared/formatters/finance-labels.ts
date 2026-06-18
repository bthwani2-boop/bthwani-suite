import type { WltDshFinanceEventKind } from '../boundary/dsh-finance-read-model.types';

export function resolveKindLabel(kind: WltDshFinanceEventKind): string {
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

export function resolveSettlementImpact(kind: WltDshFinanceEventKind): string {
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

export function resolvePolicyLabel(kind: WltDshFinanceEventKind): string {
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

export function sanitizeFinanceLabel(text: string | undefined): string {
  if (!text) return '';
  return text
    .replace(/partner_delivery/g, 'توصيل المتجر')
    .replace(/bthwani_delivery/g, 'توصيل بثواني')
    .replace(/pickup/g, 'استلام ذاتي')
    .replace(/CONTRACT_TBD/g, 'قيد المراجعة')
    .replace(/store_courier_mode/g, 'توصيل المتجر')
    .replace(/bthwani_captain_mode/g, 'كابتن بثواني');
}
