'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Text,
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

import styles from '../shared/control-panel-surface.module.css';

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
      <div dir="rtl" className={styles.surfaceMainPanel} style={{ padding: '24px' }}>
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
    <div className={styles.surfaceCockpit} dir="rtl">
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.surfaceHeaderIconBox} aria-hidden="true">
            <div style={{ width: 18, height: 18, border: '2px solid #FFFFFF', borderRadius: 4, position: 'relative' }}>
               <span style={{ position: 'absolute', top: 4, left: 4, width: 6, height: 6, backgroundColor: '#FFFFFF', borderRadius: 1 }} />
            </div>
          </div>
          <Box gap={0}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', letterSpacing: '-0.01em', color: '#0A2F5C', fontWeight: 800 }}>مالية DSH</h1>
              <Box paddingX={1.5} paddingY={0.5} background="brandAlt" radiusToken="xs">
                 <Text role="caption" style={{ color: '#FF500D', fontWeight: 800, fontSize: '9px' }}>غرفة قيادة</Text>
              </Box>
            </div>
            <p style={{ fontSize: '10px', fontWeight: 600, color: '#64748B' }}>التسويات، مطابقة COD، الاستردادات، والرقابة المالية</p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>إجمالي التدفقات</span>
              <span className={styles.commandKpiValue}>١,٢٥٤,٠٠٠ ر.س</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>عناصر معلقة</span>
              <span className={styles.commandKpiValue} style={{ color: '#FF500D' }}>١٤</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>المخاطر</span>
              <span className={styles.commandKpiValue} style={{ color: '#16A34A' }}>منخفض</span>
            </div>
          </div>
        </div>
      </header>

      <nav className={styles.navigationDock}>
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
      </nav>

      {activeGroupMeta.subGroups ? (
        <div className={styles.filterDock} style={{ backgroundColor: '#F8FAFC' }}>
          <WebControlPanelSubTabs
            items={activeGroupMeta.subGroups.map((sub) => ({
              id: sub.id,
              label: sub.label,
              active: (activeSubGroup ?? activeGroupMeta.subGroups?.[0]?.id) === sub.id,
            }))}
            onSelect={setActiveSubGroup}
            ariaLabel="التبويبات الفرعية"
          />
        </div>
      ) : null}

      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <ActiveScreen hubHref={hubHref} subGroup={activeSubGroup} />
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshFinanceHubScreen;
