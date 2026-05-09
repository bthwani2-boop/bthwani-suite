'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  StateView,
} from '@bthwani/ui-kit';
import {
  WebControlSurfaceHeader,
  WebControlPanelKpiStrip,
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
import styles from '../operations/dsh-surface.module.css';
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
      <div style={{ padding: 24 }} dir="rtl" className={fStyles.noScroll}>
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
    <div className={`${fStyles.financeCockpit} ${fStyles.noScroll}`} dir="rtl">
      <WebControlSurfaceHeader
        chips={[{ label: 'مالية DSH', tone: 'brand' }, { label: 'غرفة قيادة', tone: 'accent' }]}
        title="مالية DSH"
        description="التسويات، مطابقة COD، الاستردادات، المدفوعات، والرقابة المالية في مساحة واحدة مضغوطة."
        actions={[
          { id: 'settlements', label: 'التسويات', tone: 'primary', onAction: () => router.push(buildFinanceHref('settlements', { panel })) },
          { id: 'audit', label: 'التدقيق', tone: 'secondary', onAction: () => router.push(buildFinanceHref('risk-audit', { panel })) },
        ]}
      />

      <WebControlPanelKpiStrip
        items={[
          { id: 'income', label: 'إجمالي التدفقات', value: '١,٢٥٤,٠٠٠ ر.س', tone: 'success' },
          { id: 'pending', label: 'عناصر معلقة', value: '١٤', tone: 'warning' },
          { id: 'risk', label: 'المخاطر المالية', value: 'منخفض', tone: 'success' },
        ]}
      />

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

      <main className={`${fStyles.financeMainPanel} ${fStyles.noScroll}`}>
        <div className={`${fStyles.financeInnerScroll} ${fStyles.noScroll}`}>
          <ActiveScreen hubHref={hubHref} subGroup={activeSubGroup} />
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshFinanceHubScreen;
