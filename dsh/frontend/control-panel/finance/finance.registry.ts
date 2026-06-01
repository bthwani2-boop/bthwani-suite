import type {
  CanonicalFinanceGroupId,
  FinanceGroupMeta,
  FinanceNormalizationResult,
  FinancePanelId,
} from './finance.types';

export const FINANCE_CANONICAL_GROUPS: readonly FinanceGroupMeta[] = [
  {
    id: 'financial-center',
    label: 'المركز المالي',
    description: 'المشهد المالي الكامل: الحسابات، الأرصدة، الذمم، المستحقات، دفتر الأستاذ. المطابقة والإغلاق طبقة لاحقة.',
    badge: 'Main',
    subGroups: [
      { id: 'position', label: 'المركز المالي' },
      { id: 'ledger', label: 'دفتر الأستاذ' },
      { id: 'variances', label: 'الفوارق' },
      { id: 'audit-close', label: 'التدقيق والإغلاق' },
    ],
  },
  {
    id: 'account-statements',
    label: 'كشوف الحساب',
    description: 'كشوف حساب WLT لكل طرف: متجر، كابتن، ميداني، محفظة عميل، ومنصة.',
    badge: 'WLT',
  },
  {
    id: 'store-settlements',
    label: 'تسويات المتاجر',
    description: 'كشف تسوية المتجر، الطلبات المرتبطة، الصافي، الحجوزات، والدفعات.',
    badge: 'WLT',
  },
  {
    id: 'settlement-calendar',
    label: 'تقويم التسويات',
    description: 'دورات القطع والدفع والحجز لكل أسبوعين أو حسب سياسة الطرف.',
    badge: 'WLT',
  },
  {
    id: 'refund-ledger',
    label: 'سجل الاستردادات',
    description: 'الاستردادات والنزاعات مع أثر ledger والمحفظة والتسوية كمعاينة.',
    badge: 'WLT',
  },
  {
    id: 'daily-close',
    label: 'التدقيق والإغلاق',
    description: 'طبقة رقابة داخل المركز المالي بعد الحسابات والكشوف والقيود، وليست محور النظام.',
    badge: 'Audit',
    subGroups: [
      { id: 'summary', label: 'ملخص اليوم' },
      { id: 'inflow', label: 'الدخل' },
      { id: 'outflow', label: 'الصرف' },
      { id: 'net', label: 'الصافي' },
    ],
  },
  {
    id: 'variances',
    label: 'الفروقات',
    description: 'مراجعة وحل الفوارق المالية والعمليات المشبوهة.',
    badge: 'Audit',
    subGroups: [
      { id: 'all', label: 'الكل' },
      { id: 'suspicious', label: 'عمليات مشبوهة' },
      { id: 'audit-logs', label: 'سجلات التدقيق' },
    ],
  },
  {
    id: 'cod-cash',
    label: 'COD والكاش',
    description: 'مطابقة النقد المحصل من الكباتن ومراقبة الذمم المالية والأهلية.',
    badge: 'Cash',
    subGroups: [
      { id: 'pending', label: 'قيد التحصيل' },
      { id: 'collected', label: 'تم التحصيل' },
      { id: 'mismatch', label: 'فوارق COD' },
      { id: 'captain-eligibility', label: 'أهلية الكباتن' },
      { id: 'captain-finance', label: 'مالية الكباتن' },
    ],
  },
  {
    id: 'settlements-payouts',
    label: 'التسويات والمدفوعات',
    description: 'إدارة دورات تسوية مستحقات الشركاء، الكباتن، الميدانيين وتوصيل المتاجر.',
    badge: 'Ops',
    subGroups: [
      { id: 'partners', label: 'تسويات المتاجر' },
      { id: 'captains', label: 'تسويات الكباتن' },
      { id: 'field', label: 'تسويات الميدانيين' },
      { id: 'store-delivery', label: 'توصيل المتاجر' },
    ],
  },
  {
    id: 'ledger',
    label: 'دفتر الأستاذ',
    description: 'دفتر الأستاذ العام وحركات القيود المعتمدة.',
    badge: 'Book',
    subGroups: [
      { id: 'journal', label: 'قيود اليومية' },
      { id: 'trial-balance', label: 'ميزان المراجعة' },
    ],
  },
  {
    id: 'refunds',
    label: 'الاستردادات',
    description: 'إدارة طلبات استرجاع المبالغ للعملاء وحل النزاعات.',
    badge: 'Risk',
    subGroups: [
      { id: 'pending', label: 'طلبات جديدة' },
      { id: 'processed', label: 'تمت المعالجة' },
      { id: 'rejected', label: 'مرفوضة' },
    ],
  },
];

export const FINANCE_CANONICAL_GROUP_IDS = FINANCE_CANONICAL_GROUPS.map((group) => group.id) as readonly CanonicalFinanceGroupId[];

export const FINANCE_ACTIVE_GROUPS = FINANCE_CANONICAL_GROUPS;

export const FINANCE_NAV_GROUPS = FINANCE_CANONICAL_GROUPS.filter((group) => group.id !== 'daily-close');

export function normalizeFinanceLocation(
  workspace?: string,
  panel?: string,
): FinanceNormalizationResult {
  const resolvedPanel = panel as FinancePanelId | undefined;

  if (!workspace || workspace === 'financial-center') {
    return { kind: 'group', group: 'financial-center', sourceWorkspace: workspace, panel: resolvedPanel };
  }

  if (workspace === 'account-statements') {
    return { kind: 'group', group: 'account-statements', sourceWorkspace: workspace, panel: resolvedPanel };
  }

  if (workspace === 'store-settlements') {
    return { kind: 'group', group: 'store-settlements', sourceWorkspace: workspace, panel: resolvedPanel };
  }

  if (workspace === 'settlement-calendar') {
    return { kind: 'group', group: 'settlement-calendar', sourceWorkspace: workspace, panel: resolvedPanel };
  }

  if (workspace === 'refund-ledger') {
    return { kind: 'group', group: 'refund-ledger', sourceWorkspace: workspace, panel: resolvedPanel };
  }

  if (workspace === 'overview' || workspace === 'daily-close') {
    return { kind: 'group', group: 'daily-close', sourceWorkspace: workspace, panel: resolvedPanel };
  }

  if (workspace === 'risk-audit' || workspace === 'variances') {
    return { kind: 'group', group: 'variances', sourceWorkspace: workspace, panel: resolvedPanel };
  }

  if (workspace === 'cod-reconciliation' || workspace === 'cod-cash') {
    return { kind: 'group', group: 'cod-cash', sourceWorkspace: workspace, panel: resolvedPanel };
  }

  if (workspace === 'settlements' || workspace === 'payouts' || workspace === 'settlements-payouts') {
    return { kind: 'group', group: 'settlements-payouts', sourceWorkspace: workspace, panel: resolvedPanel };
  }

  if (workspace === 'ledger') {
    return { kind: 'group', group: 'ledger', sourceWorkspace: workspace, panel: resolvedPanel };
  }

  if (workspace === 'refunds') {
    return { kind: 'group', group: 'refunds', sourceWorkspace: workspace, panel: resolvedPanel };
  }

  if (workspace === 'captain-eligibility' || workspace === 'captain-finance') {
    return { kind: 'group', group: 'cod-cash', sourceWorkspace: workspace, panel: resolvedPanel };
  }

  if (workspace === 'store-delivery-finance') {
    return { kind: 'group', group: 'settlements-payouts', sourceWorkspace: workspace, panel: resolvedPanel };
  }

  return { kind: 'group', group: 'financial-center', sourceWorkspace: workspace, panel: resolvedPanel };
}

export function buildFinanceHref(
  group: CanonicalFinanceGroupId = 'financial-center',
  options?: { panel?: FinancePanelId },
) {
  const searchParams = new URLSearchParams();
  if (group !== 'financial-center') searchParams.set('workspace', group);
  if (options?.panel) searchParams.set('panel', options.panel);
  const query = searchParams.toString();
  return query ? `/finance?${query}` : '/finance';
}

export function getFinanceGroupMeta(groupId: CanonicalFinanceGroupId) {
  return FINANCE_CANONICAL_GROUPS.find((group) => group.id === groupId) ?? FINANCE_CANONICAL_GROUPS[0];
}
