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
    <div className={styles.operationsCockpit} dir="rtl">
      <header className={styles.operationsTopBar}>
        <div className={styles.operationsTitleBlock}>
          <div className={styles.operationsHeaderIconBox} aria-hidden="true">
            <div style={{ width: 18, height: 18, border: '2px solid #FFFFFF', borderRadius: 4, position: 'relative' }}>
              <span style={{ position: 'absolute', top: '50%', left: '50%', width: 8, height: 2, backgroundColor: '#FFFFFF', transform: 'translate(-50%, -50%)' }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>مالية DSH</h1>
              <span style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: '#E0F2FE', color: '#0369A1', borderRadius: '4px', fontWeight: '800' }}>غرفة قيادة</span>
            </div>
            <p style={{ fontSize: '10px', fontWeight: 600 }}>التسويات، مطابقة COD، الاستردادات، المدفوعات، والرقابة المالية في مساحة واحدة مضغوطة</p>
          </div>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact}>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>إجمالي التدفقات</span>
              <span className={styles.commandKpiValue}>١,٢٥٤,٠٠٠ ر.س</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>عناصر معلقة</span>
              <span className={styles.commandKpiValue} style={{ color: '#D97706' }}>١٤</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>المخاطر المالية</span>
              <span className={styles.commandKpiValue} style={{ color: '#16A34A' }}>منخفض</span>
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

      <div className={styles.filterDock} style={{ backgroundColor: '#F8FAFC', padding: '4px 14px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B' }}>السطح الحالي</span>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#0A2F5C' }}>{activeGroupMeta.label}</span>
        <span style={{ fontSize: '11px', color: '#64748B' }}>{activeGroupMeta.description}</span>
      </div>

      <main className={styles.operationsMainPanel}>
        <div className={styles.operationsInnerScroll}>
          <ActiveScreen hubHref={hubHref} subGroup={activeSubGroup} />
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshFinanceHubScreen;
