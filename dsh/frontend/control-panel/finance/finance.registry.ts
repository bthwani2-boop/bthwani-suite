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
    description: 'نظرة شاملة على التدفقات المالية والسيولة.',
    badge: 'Core',
    subGroups: [
      { id: 'all', label: 'الكل' },
      { id: 'inflow', label: 'الدخل' },
      { id: 'outflow', label: 'الصرف' },
      { id: 'net', label: 'الصافي' },
    ]
  },
  {
    id: 'settlements',
    label: 'التسويات',
    description: 'إدارة تسويات الشركاء والكباتن.',
    badge: 'Ops',
    subGroups: [
      { id: 'summary', label: 'ملخص' },
      { id: 'captains', label: 'كباتن' },
      { id: 'partners', label: 'متاجر' },
      { id: 'field', label: 'ميدانيين' },
    ]
  },
  {
    id: 'cod-reconciliation',
    label: 'تحصيل COD',
    description: 'مطابقة النقد المحصل مع الطلبات المنفذة.',
    badge: 'Cash',
    subGroups: [
      { id: 'pending', label: 'قيد التحصيل' },
      { id: 'collected', label: 'تم التحصيل' },
      { id: 'mismatch', label: 'فوارق' },
    ]
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
    ]
  },
  {
    id: 'ledger',
    label: 'السجلات المالية',
    description: 'دفتر الأستاذ العام وحركات القيود.',
    badge: 'Book',
    subGroups: [
      { id: 'journal', label: 'قيود اليومية' },
      { id: 'trial-balance', label: 'ميزان المراجعة' },
    ]
  },
  {
    id: 'payouts',
    label: 'المدفوعات',
    description: 'تحويل الأموال وتتبع الحوالات البنكية.',
    badge: 'Bank',
    subGroups: [
      { id: 'scheduled', label: 'مجدولة' },
      { id: 'in-progress', label: 'جاري التحويل' },
      { id: 'completed', label: 'مكتملة' },
    ]
  },
  {
    id: 'tax-compliance',
    label: 'الضرائب والامتثال',
    description: 'تقارير الضريبة المضافة والامتثال الزكوي.',
    badge: 'Tax',
    subGroups: [
      { id: 'vat', label: 'الضريبة المضافة' },
      { id: 'zakat', label: 'الزكاة' },
    ]
  },
  {
    id: 'risk-audit',
    label: 'المخاطر والتدقيق',
    description: 'مراجعة العمليات المشبوهة والتدقيق المالي.',
    badge: 'Audit',
    subGroups: [
      { id: 'suspicious', label: 'عمليات مشبوهة' },
      { id: 'audit-logs', label: 'سجلات التدقيق' },
    ]
  },
] as const;

export const FINANCE_CANONICAL_GROUP_IDS = FINANCE_CANONICAL_GROUPS.map((group) => group.id) as readonly CanonicalFinanceGroupId[];

export function normalizeFinanceLocation(
  workspace?: string,
  panel?: string,
): FinanceNormalizationResult {
  const resolvedPanel = panel as FinancePanelId | undefined;

  if (!workspace || workspace === 'overview') {
    return {
      kind: 'group',
      group: 'overview',
      sourceWorkspace: workspace,
      panel: resolvedPanel,
    };
  }

  const directCanonical = FINANCE_CANONICAL_GROUP_IDS.find((groupId) => groupId === workspace);
  if (directCanonical) {
    return {
      kind: 'group',
      group: directCanonical,
      sourceWorkspace: directCanonical,
      panel: resolvedPanel,
    };
  }

  return {
    kind: 'group',
    group: 'overview',
    sourceWorkspace: workspace,
    panel: resolvedPanel,
  };
}

export function buildFinanceHref(
  group: CanonicalFinanceGroupId = 'overview',
  options?: {
    panel?: FinancePanelId;
  },
) {
  const searchParams = new URLSearchParams();

  if (group !== 'overview') {
    searchParams.set('workspace', group);
  }

  if (options?.panel) {
    searchParams.set('panel', options.panel);
  }

  const query = searchParams.toString();
  return query ? `/finance?${query}` : '/finance';
}

export function getFinanceGroupMeta(groupId: CanonicalFinanceGroupId) {
  return FINANCE_CANONICAL_GROUPS.find((group) => group.id === groupId) ?? FINANCE_CANONICAL_GROUPS[0];
}
