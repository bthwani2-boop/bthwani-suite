'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { StateView, Box } from '@bthwani/ui-kit';
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
  ControlPanelDshRefundQueueScreen
} from './closure-workspaces';
import { WltDshFinanceControlPanelContent } from '../../../../wlt/frontend/control-panel/finance/WltDshFinanceControlPanelPreview';
import styles from '../operations/dsh-surface.module.css';

export type ControlPanelDshFinanceScreenProps = {
  group?: CanonicalFinanceGroupId;
  panel?: FinancePanelId;
  state?: FinanceViewState;
  fallbackHref?: string;
};

const PlaceholderScreen = ({ title }: { title: string }) => (
  <Box padding={6} gap={4} alignItems="center" justifyContent="center" style={{ minHeight: '400px' }}>
    <StateView
      stateId="empty"
      title={title}
      description="هذه اللوحة قيد التطوير حالياً لتقديم تجربة مالية متكاملة."
    />
  </Box>
);

const SCREEN_RENDERERS: Record<CanonicalFinanceGroupId, React.ComponentType<{ hubHref: string }>> = {
  overview: WltDshFinanceControlPanelContent as any,
  settlements: ControlPanelDshSettlementScreen as any,
  'cod-reconciliation': ControlPanelDshCodReconciliationScreen as any,
  refunds: ControlPanelDshRefundQueueScreen as any,
  ledger: () => <PlaceholderScreen title="دفتر الأستاذ العام" />,
  payouts: () => <PlaceholderScreen title="إدارة المدفوعات" />,
  'tax-compliance': () => <PlaceholderScreen title="الضرائب والامتثال" />,
  'risk-audit': () => <PlaceholderScreen title="المخاطر والتدقيق المالي" />,
};

export function ControlPanelDshFinanceHubScreen({
  group = 'overview',
  panel,
  state = 'ready',
  fallbackHref = '/finance',
}: ControlPanelDshFinanceScreenProps) {
  const router = useRouter();
  const [activeGroup, setActiveGroup] = React.useState<CanonicalFinanceGroupId>(group);

  React.useEffect(() => {
    setActiveGroup(group);
  }, [group]);

  const activeGroupMeta = getFinanceGroupMeta(activeGroup);
  const hubHref = buildFinanceHref(activeGroup, { panel });
  const ActiveScreen = SCREEN_RENDERERS[activeGroup] || SCREEN_RENDERERS.overview;

  if (state !== 'ready') {
    return (
      <div style={{ padding: 24 }} dir="rtl">
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
      {/* 1. Header Area - Finance Command Deck */}
      <header className={`${styles.operationsTopBar} ${styles.premiumGlass}`}>
        <div className={styles.operationsTitleBlock}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#0A2F5C',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            boxShadow: '0 4px 12px rgba(10, 47, 92, 0.2)'
          }}>
            💰
          </div>
          <div>
            <h1 style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>مالية DSH</h1>
            <p style={{ fontSize: '10px', fontWeight: 600 }}>مراقبة التدفقات المالية والتسويات</p>
          </div>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact}>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>إجمالي الدخل</span>
              <span className={styles.commandKpiValue} style={{ color: '#16A34A' }}>٤,٩٨٢,٥٠ ر.س</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>إجمالي الصرف</span>
              <span className={styles.commandKpiValue} style={{ color: '#DC2626' }}>١,٤٣٥,٠٠ ر.س</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>الصافي</span>
              <span className={styles.commandKpiValue} style={{ color: '#0A2F5C' }}>٣,٥٤٧,٥٠ ر.س</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Finance Tabs - Navigation */}
      <nav className={styles.navigationCockpit}>
        {FINANCE_CANONICAL_GROUPS.map((item) => {
          const isSelected = item.id === activeGroup;
          return (
            <button
              key={item.id}
              className={`${styles.operationsTab} ${isSelected ? styles.operationsTabActive : ''}`}
              onClick={() => {
                setActiveGroup(item.id);
                router.push(buildFinanceHref(item.id, { panel }));
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* 3. Main Active Area */}
      <main className={styles.operationsMainPanel}>
        <div className={styles.operationsInnerScroll}>
          {activeGroup === 'overview' ? (
            <WltDshFinanceControlPanelContent hideHeader />
          ) : (
            <ActiveScreen hubHref={hubHref} />
          )}
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshFinanceHubScreen;
