import type {
  CanonicalFinanceGroupId,
  FinanceGroupMeta,
  FinanceNormalizationResult,
  FinancePanelId,
  FinanceWorkspaceInput,
} from '../models/financeRouting.types';

export const FINANCE_CANONICAL_GROUPS: readonly FinanceGroupMeta[] = [
  { id: 'financial-center', label: 'المركز المالي', description: 'المشهد المالي الكامل: الحسابات، الأرصدة، الذمم، المستحقات، دفتر الأستاذ.', badge: 'Main', subGroups: [{ id: 'position', label: 'المركز المالي' }, { id: 'ledger', label: 'دفتر الأستاذ' }, { id: 'audit-close', label: 'التدقيق والإغلاق' }] },
  { id: 'account-statements', label: 'كشوف الحساب', description: 'كشوف حساب WLT لكل طرف: متجر، كابتن، ميداني، محفظة عميل، ومنصة.', badge: 'WLT' },
  { id: 'store-settlements', label: 'تسويات المتاجر', description: 'كشف تسوية المتجر، الطلبات المرتبطة، الصافي، الحجوزات، والدفعات.', badge: 'WLT' },
  { id: 'settlement-calendar', label: 'تقويم التسويات', description: 'دورات القطع والدفع والحجز لكل أسبوعين أو حسب سياسة الطرف.', badge: 'WLT' },
  { id: 'cod-cash', label: 'COD والذمم', description: 'مطابقة النقد المحصل من الكباتن ومراقبة الذمم المالية والأهلية.', badge: 'Cash', subGroups: [{ id: 'pending', label: 'قيد التحصيل' }, { id: 'collected', label: 'تم التحصيل' }, { id: 'mismatch', label: 'فوارق COD' }, { id: 'captain-eligibility', label: 'أهلية الكباتن' }, { id: 'captain-finance', label: 'مالية الكباتن' }] },
  { id: 'settlements-payouts', label: 'المستحقات والدفعات', description: 'إدارة دورات تسوية مستحقات الشركاء، الكباتن، الميدانيين وتوصيل المتاجر.', badge: 'Ops', subGroups: [{ id: 'partners', label: 'تسويات المتاجر' }, { id: 'captains', label: 'تسويات الكباتن' }, { id: 'field', label: 'تسويات الميدانيين' }, { id: 'store-delivery', label: 'توصيل المتاجر' }] },
  { id: 'refund-ledger', label: 'الاستردادات والنزاعات', description: 'الاستردادات والنزاعات مع أثر ledger والمحفظة والتسوية كمعاينة.', badge: 'WLT' },
  { id: 'ledger', label: 'دفتر الأستاذ', description: 'دفتر الأستاذ العام وحركات القيود المعتمدة.', badge: 'Book', subGroups: [{ id: 'journal', label: 'قيود اليومية' }, { id: 'trial-balance', label: 'ميزان المراجعة' }] },
  { id: 'daily-close', label: 'التدقيق والإغلاق', description: 'طبقة رقابة داخل المركز المالي بعد الحسابات والكشوف والقيود.', badge: 'Audit', subGroups: [{ id: 'summary', label: 'ملخص اليوم' }, { id: 'inflow', label: 'الدخل' }, { id: 'outflow', label: 'الصرف' }, { id: 'net', label: 'الصافي' }] },
];

export const FINANCE_CANONICAL_GROUP_IDS = FINANCE_CANONICAL_GROUPS.map((group) => group.id) as readonly CanonicalFinanceGroupId[];

export const FINANCE_ACTIVE_GROUPS = FINANCE_CANONICAL_GROUPS;

export const FINANCE_NAV_GROUPS = FINANCE_CANONICAL_GROUPS;

export function normalizeFinanceLocation(workspace?: string, panel?: string): FinanceNormalizationResult {
  const resolvedPanel = panel as FinancePanelId | undefined;
  const typedWorkspace = workspace as FinanceWorkspaceInput | undefined;

  if (!typedWorkspace || typedWorkspace === 'financial-center') {
    return { kind: 'group', group: 'financial-center', sourceWorkspace: workspace, panel: resolvedPanel };
  }
  if (typedWorkspace === 'account-statements') return { kind: 'group', group: 'account-statements', sourceWorkspace: workspace, panel: resolvedPanel };
  if (typedWorkspace === 'store-settlements') return { kind: 'group', group: 'store-settlements', sourceWorkspace: workspace, panel: resolvedPanel };
  if (typedWorkspace === 'settlement-calendar') return { kind: 'group', group: 'settlement-calendar', sourceWorkspace: workspace, panel: resolvedPanel };
  if (typedWorkspace === 'refund-ledger') return { kind: 'group', group: 'refund-ledger', sourceWorkspace: workspace, panel: resolvedPanel };
  if (typedWorkspace === 'overview' || typedWorkspace === 'daily-close') return { kind: 'group', group: 'daily-close', sourceWorkspace: workspace, panel: resolvedPanel };
  if (typedWorkspace === 'risk-audit' || typedWorkspace === 'variances') return { kind: 'group', group: 'financial-center', sourceWorkspace: workspace, panel: resolvedPanel };
  if (typedWorkspace === 'cod-reconciliation' || typedWorkspace === 'cod-cash') return { kind: 'group', group: 'cod-cash', sourceWorkspace: workspace, panel: resolvedPanel };
  if (typedWorkspace === 'settlements' || typedWorkspace === 'payouts' || typedWorkspace === 'settlements-payouts') return { kind: 'group', group: 'settlements-payouts', sourceWorkspace: workspace, panel: resolvedPanel };
  if (typedWorkspace === 'ledger') return { kind: 'group', group: 'ledger', sourceWorkspace: workspace, panel: resolvedPanel };
  if (typedWorkspace === 'refunds') return { kind: 'group', group: 'refund-ledger', sourceWorkspace: workspace, panel: resolvedPanel };
  if (typedWorkspace === 'captain-eligibility' || typedWorkspace === 'captain-finance') return { kind: 'group', group: 'cod-cash', sourceWorkspace: workspace, panel: resolvedPanel };
  if (typedWorkspace === 'store-delivery-finance') return { kind: 'group', group: 'settlements-payouts', sourceWorkspace: workspace, panel: resolvedPanel };

  return { kind: 'group', group: 'financial-center', sourceWorkspace: workspace, panel: resolvedPanel };
}

export function buildFinanceHref(group: CanonicalFinanceGroupId = 'financial-center', options?: { panel?: FinancePanelId }) {
  const searchParams = new URLSearchParams();
  if (group !== 'financial-center') searchParams.set('workspace', group);
  if (options?.panel) searchParams.set('panel', options.panel);
  const query = searchParams.toString();
  return query ? `/finance?${query}` : '/finance';
}

export function getFinanceGroupMeta(groupId: CanonicalFinanceGroupId) {
  return FINANCE_CANONICAL_GROUPS.find((group) => group.id === groupId) ?? FINANCE_CANONICAL_GROUPS[0];
}
