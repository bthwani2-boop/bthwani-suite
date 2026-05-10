'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  StateView,
} from '@bthwani/ui-kit';
import {
  WebControlPanelWorkspaceTabs,
  WebControlPanelSubTabs,
} from '@bthwani/ui-kit/web';
import {
  buildFinanceHref,
  getFinanceGroupMeta,
  FINANCE_CANONICAL_GROUPS,
} from './finance.registry';
import type { CanonicalFinanceGroupId, FinancePanelId, FinanceViewState } from './finance.types';
import {
  ControlPanelDshFinanceScreen,
  ControlPanelDshSettlementScreen,
  ControlPanelDshCodReconciliationScreen,
  ControlPanelDshRefundQueueScreen,
  ControlPanelDshRiskAuditScreen,
} from './closure-workspaces';

import fStyles from './finance-surface.module.css';

export type ControlPanelDshFinanceScreenProps = {
  group?: CanonicalFinanceGroupId;
  subGroup?: string;
  panel?: FinancePanelId;
  state?: FinanceViewState;
  fallbackHref?: string;
};

const SCREEN_RENDERERS: Record<CanonicalFinanceGroupId, React.ComponentType<{ hubHref: string; subGroup?: string }>> = {
  overview: ControlPanelDshFinanceScreen,
  settlements: ControlPanelDshSettlementScreen,
  'cod-reconciliation': ControlPanelDshCodReconciliationScreen,
  refunds: ControlPanelDshRefundQueueScreen,
  ledger: ControlPanelDshFinanceScreen,
  payouts: ControlPanelDshFinanceScreen,
  'tax-compliance': ControlPanelDshFinanceScreen,
  'risk-audit': ControlPanelDshRiskAuditScreen,
};

export function ControlPanelDshFinanceHubScreen({
  group = 'overview',
  subGroup,
  panel,
  state = 'ready',
  fallbackHref = '/finance',
}: ControlPanelDshFinanceScreenProps) {
  const router = useRouter();
  const [activeGroup, setActiveGroup] = React.useState<CanonicalFinanceGroupId>(group);
  const [activeSubGroup, setActiveSubGroup] = React.useState<string | undefined>(subGroup);

  React.useEffect(() => {
    setActiveGroup(group);
  }, [group]);

  React.useEffect(() => {
    setActiveSubGroup(subGroup);
  }, [subGroup]);

  const activeGroupMeta = getFinanceGroupMeta(activeGroup);
  const hubHref = buildFinanceHref(activeGroup, { panel });
  const ActiveScreen = SCREEN_RENDERERS[activeGroup] || SCREEN_RENDERERS.overview;

  if (state !== 'ready') {
    return (
      <div dir="rtl" className={`${fStyles.noScroll} ${fStyles.financeLoadingState}`}>
        <StateView
           stateId="loading"
           title="جاري تحميل البيانات المالية"
           description="يتم تجهيز غرفة القيادة المالية..."
           onActionPress={() => router.push(fallbackHref)}
        />
      </div>
    );
  }

  return (
    <div className={`${fStyles.financeCockpit} ${fStyles.financeShellOverrides}`} dir="rtl">
      <header className={fStyles.financeTopBar}>
        <div className={fStyles.financeTitleBlock}>
          <div className={fStyles.financeHeaderIcon} aria-hidden="true">
            <div className={fStyles.financeIconInner} />
          </div>
          <div>
            <div className={fStyles.financeTitleRow}>
              <h1 className={fStyles.financeTitle}>مالية DSH</h1>
              <span className={fStyles.financeBadge}>غرفة قيادة</span>
            </div>
            <p className={fStyles.financeSubtitle}>التسويات، مطابقة COD، الاستردادات، المدفوعات، والرقابة المالية في مساحة واحدة مضغوطة</p>
          </div>
        </div>

        <div className={fStyles.financeHeaderActions}>
          <div className={fStyles.financePulseCompact}>
            <div className={fStyles.financeKpi}>
              <span className={fStyles.financeKpiLabel}>إجمالي التدفقات</span>
              <span className={fStyles.financeKpiValue}>١,٢٥٤,٠٠٠ ر.س</span>
            </div>
            <div className={fStyles.financeKpi}>
              <span className={fStyles.financeKpiLabel}>عناصر معلقة</span>
              <span className={`${fStyles.financeKpiValue} ${fStyles.financeKpiWarning}`}>١٤</span>
            </div>
            <div className={fStyles.financeKpi}>
              <span className={fStyles.financeKpiLabel}>المخاطر المالية</span>
              <span className={`${fStyles.financeKpiValue} ${fStyles.financeKpiSuccess}`}>منخفض</span>
            </div>
          </div>
        </div>
      </header>

      <WebControlPanelWorkspaceTabs
        items={FINANCE_CANONICAL_GROUPS.map((item) => ({
          id: item.id,
          label: item.label,
          active: item.id === activeGroup,
        }))}
        onSelect={(id) => {
          const groupId = id as CanonicalFinanceGroupId;
          setActiveGroup(groupId);
          setActiveSubGroup(undefined);
          router.push(buildFinanceHref(groupId, { panel }));
        }}
        ariaLabel="أقسام المالية الرئيسية"
      />

      {activeGroupMeta.subGroups ? (
        <WebControlPanelSubTabs
          items={activeGroupMeta.subGroups.map((sub) => ({
            id: sub.id,
            label: sub.label,
            active: (activeSubGroup ?? activeGroupMeta.subGroups?.[0]?.id) === sub.id,
          }))}
          onSelect={setActiveSubGroup}
          ariaLabel="التبويبات الفرعية"
        />
      ) : null}

      <div className={fStyles.financeContextDock}>
        <span className={fStyles.financeContextLabel}>السطح الحالي</span>
        <span className={fStyles.financeContextValue}>{activeGroupMeta.label}</span>
        <span className={fStyles.financeContextDescription}>{activeGroupMeta.description}</span>
      </div>

      <main className={fStyles.financeMainPanel}>
        <div className={fStyles.financeInnerScroll}>
          <ActiveScreen hubHref={hubHref} subGroup={activeSubGroup} />
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshFinanceHubScreen;
