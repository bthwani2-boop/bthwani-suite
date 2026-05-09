import type {
  CanonicalFinanceGroupId,
  FinanceGroupMeta,
  FinanceNormalizationResult,
  FinancePanelId,
} from './finance.types';

export const FINANCE_CANONICAL_GROUPS: readonly FinanceGroupMeta[] = [
  { id: 'overview', label: 'النظرة العامة', description: 'نظرة شاملة على التدفقات المالية والسيولة.', badge: 'Core' },
  { id: 'settlements', label: 'التسويات', description: 'إدارة تسويات الشركاء والكباتن.', badge: 'Ops' },
  { id: 'cod-reconciliation', label: 'تحصيل COD', description: 'مطابقة النقد المحصل مع الطلبات المنفذة.', badge: 'Cash' },
  { id: 'refunds', label: 'الاستردادات', description: 'إدارة طلبات استرجاع المبالغ والنزاعات.', badge: 'Risk' },
  { id: 'ledger', label: 'السجلات المالية', description: 'دفتر الأستاذ العام وحركات القيود.', badge: 'Book' },
  { id: 'payouts', label: 'المدفوعات', description: 'تحويل الأموال وتتبع الحوالات البنكية.', badge: 'Bank' },
  { id: 'tax-compliance', label: 'الضرائب والامتثال', description: 'تقارير الضريبة المضافة والامتثال الزكوي.', badge: 'Tax' },
  { id: 'risk-audit', label: 'المخاطر والتدقيق', description: 'مراجعة العمليات المشبوهة والتدقيق المالي.', badge: 'Audit' },
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
