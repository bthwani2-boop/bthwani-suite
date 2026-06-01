import type {
  CanonicalFinanceGroupId,
  FinanceGroupMeta,
  FinanceNormalizationResult,
  FinancePanelId,
} from './finance.types';

export const FINANCE_CANONICAL_GROUPS: readonly FinanceGroupMeta[] = [
  {
    id: 'overview',
    label: 'النظرة العامة',
    description: 'نظرة شاملة على التدفقات المالية والسيولة. العملة: ر.ي',
    badge: 'Core',
    subGroups: [
      { id: 'all', label: 'الكل' },
      { id: 'inflow', label: 'الدخل' },
      { id: 'outflow', label: 'الصرف' },
      { id: 'net', label: 'الصافي' },
    ],
  },
  {
    id: 'settlements',
    label: 'التسويات',
    description: 'إدارة تسويات الشركاء والكباتن والميدانيين.',
    badge: 'Ops',
    subGroups: [
      { id: 'summary', label: 'ملخص' },
      { id: 'captains', label: 'كباتن' },
      { id: 'partners', label: 'متاجر' },
      { id: 'field', label: 'ميدانيين' },
    ],
  },
  {
    id: 'cod-reconciliation',
    label: 'تحصيل COD',
    description: 'مطابقة النقد المحصّل مع الطلبات المنفذة. COD ذمة على الكابتن حتى الإيداع.',
    badge: 'Cash',
    subGroups: [
      { id: 'pending', label: 'قيد التحصيل' },
      { id: 'collected', label: 'تم التحصيل' },
      { id: 'mismatch', label: 'فوارق' },
    ],
  },
  {
    id: 'captain-eligibility',
    label: 'أهلية الكابتن',
    description: 'مراقبة رصيد الكابتن الضامن — من مؤهل ومن يحتاج شحن رصيد.',
    badge: 'Cap',
    subGroups: [
      { id: 'eligible', label: 'مؤهلون' },
      { id: 'needs-topup', label: 'يحتاج شحن' },
      { id: 'blocked', label: 'محظورون' },
    ],
  },
  {
    id: 'refunds',
    label: 'الاستردادات',
    description: 'إدارة طلبات استرجاع المبالغ والنزاعات.',
    badge: 'Risk',
    subGroups: [
      { id: 'pending', label: 'طلبات جديدة' },
      { id: 'processed', label: 'تمت المعالجة' },
      { id: 'rejected', label: 'مرفوضة' },
      { id: 'disputes', label: 'النزاعات والاعتراضات (Chargebacks)' },
    ],
  },
  {
    id: 'payouts',
    label: 'المدفوعات',
    description: 'تحويل الأموال وتتبع الحوالات البنكية لجميع الأطراف.',
    badge: 'Bank',
    subGroups: [
      { id: 'partner-payouts', label: 'مستحقات الشركاء' },
      { id: 'captain-payouts', label: 'مستحقات الكباتن' },
      { id: 'field-payouts', label: 'مستحقات الميدانيين' },
    ],
  },
  {
    id: 'ledger',
    label: 'السجلات المالية',
    description: 'دفتر الأستاذ العام وحركات القيود.',
    badge: 'Book',
    subGroups: [
      { id: 'journal', label: 'قيود اليومية' },
      { id: 'trial-balance', label: 'ميزان المراجعة' },
      { id: 'audit-trail', label: 'سجل التدقيق المالي (Audit Trail)' },
      { id: 'invoices', label: 'الفواتير والإيصالات' },
    ],
  },
  {
    id: 'risk-audit',
    label: 'المخاطر والتدقيق',
    description: 'مراجعة العمليات المشبوهة والتدقيق المالي.',
    badge: 'Audit',
    subGroups: [
      { id: 'suspicious', label: 'عمليات مشبوهة' },
      { id: 'holds', label: 'حجز الأموال والمخاطر (Holds)' },
      { id: 'audit-logs', label: 'سجلات التدقيق' },
    ],
  },
  {
    id: 'captain-finance',
    label: 'مالية الكباتن',
    description: 'مراقبة وتدقيق الحركات والذمم المالية الخاصة بكباتن بثواني.',
    badge: 'Cap',
    subGroups: [
      { id: 'all', label: 'الكل' },
      { id: 'cod-pending', label: 'COD معلّق' },
      { id: 'payouts', label: 'مستحقات معتمدة' },
    ],
  },
  {
    id: 'store-delivery-finance',
    label: 'مالية توصيل المتجر',
    description: 'تدقيق ومراقبة حركات وعمولات توصيل المتاجر (توصيل المتجر الداخلي).',
    badge: 'Store',
    subGroups: [
      { id: 'all', label: 'الكل' },
      { id: 'compensation', label: 'مستحقات الموصلين' },
      { id: 'retained-fees', label: 'رسوم محتفظة للمتجر' },
    ],
  },
  // tax-compliance مخفي من القيادة النشطة — لا سياسة ضريبية يمنية مثبتة بعد
  {
    id: 'tax-compliance',
    label: 'الضرائب — غير مفعلة',
    description: 'لا سياسة ضريبية أو زكوية مثبتة في DSH حتى الآن، لذلك يبقى هذا القسم read-only وغير نشط.',
    badge: 'مؤجل',
    subGroups: [],
  },
] as const;

export const FINANCE_CANONICAL_GROUP_IDS = FINANCE_CANONICAL_GROUPS.map((group) => group.id) as readonly CanonicalFinanceGroupId[];

// القسم النشط فعليًا — يستثني tax-compliance حتى تثبت السياسة
export const FINANCE_ACTIVE_GROUPS = FINANCE_CANONICAL_GROUPS.filter(
  (g) => g.id !== 'tax-compliance',
);

export function normalizeFinanceLocation(
  workspace?: string,
  panel?: string,
): FinanceNormalizationResult {
  const resolvedPanel = panel as FinancePanelId | undefined;

  if (!workspace || workspace === 'overview') {
    return { kind: 'group', group: 'overview', sourceWorkspace: workspace, panel: resolvedPanel };
  }

  const directCanonical = FINANCE_CANONICAL_GROUP_IDS.find((groupId) => groupId === workspace);
  if (directCanonical) {
    return { kind: 'group', group: directCanonical, sourceWorkspace: directCanonical, panel: resolvedPanel };
  }

  return { kind: 'group', group: 'overview', sourceWorkspace: workspace, panel: resolvedPanel };
}

export function buildFinanceHref(
  group: CanonicalFinanceGroupId = 'overview',
  options?: { panel?: FinancePanelId },
) {
  const searchParams = new URLSearchParams();
  if (group !== 'overview') searchParams.set('workspace', group);
  if (options?.panel) searchParams.set('panel', options.panel);
  const query = searchParams.toString();
  return query ? `/finance?${query}` : '/finance';
}

export function getFinanceGroupMeta(groupId: CanonicalFinanceGroupId) {
  return FINANCE_CANONICAL_GROUPS.find((group) => group.id === groupId) ?? FINANCE_CANONICAL_GROUPS[0];
}
