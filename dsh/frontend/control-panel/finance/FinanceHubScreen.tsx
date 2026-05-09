'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { StateView, Box } from '@bthwani/ui-kit';
import { WebControlPanelSubTabs } from '@bthwani/ui-kit/web';
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
import fStyles from './finance-surface.module.css';

export type ControlPanelDshFinanceScreenProps = {
  group?: CanonicalFinanceGroupId;
  subGroup?: string;
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

const SCREEN_RENDERERS: Record<CanonicalFinanceGroupId, React.ComponentType<{ hubHref: string; subGroup?: string }>> = {
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
    <div className={`${styles.operationsCockpit} ${fStyles.financeCockpit} ${fStyles.noScroll}`} dir="rtl">
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>مالية DSH</h1>
              <span style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: '#FEF3C7', color: '#D97706', borderRadius: '4px', fontWeight: '800' }}>مراجعة مالية</span>
            </div>
            <p style={{ fontSize: '10px', fontWeight: 600 }}>مراقبة التدفقات المالية والتسويات المركزية</p>
          </div>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact}>
            {[
              { label: 'إجمالي الدخل', value: '١,٢٥٤,٠٠٠ ر.س', tone: 'success' },
              { label: 'تسويات معلقة', value: '١٤' },
              { label: 'خطر التدفق', value: 'منخفض', tone: 'success' }
            ].map((m) => (
              <div key={m.label} className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>{m.label}</span>
                <span className={styles.commandKpiValue} style={m.tone === 'success' ? { color: '#16A34A' } : {}}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Finance Tabs - Main Navigation */}
      <nav className={`${styles.navigationCockpit} ${fStyles.noScroll}`}>
        {FINANCE_CANONICAL_GROUPS.map((item) => {
          const isSelected = item.id === activeGroup;
          return (
            <button
              key={item.id}
              className={`${styles.operationsTab} ${isSelected ? styles.operationsTabActive : ''}`}
              onClick={() => {
                setActiveGroup(item.id);
                setActiveSubGroup(undefined);
                router.push(buildFinanceHref(item.id, { panel }));
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* 2b. Sub-Tabs - Granular Navigation */}
      {activeGroupMeta.subGroups && (
        <WebControlPanelSubTabs
          items={activeGroupMeta.subGroups.map((sub) => ({
            id: sub.id,
            label: sub.label,
            active: (activeSubGroup ?? activeGroupMeta.subGroups?.[0]?.id) === sub.id,
          }))}
          onSelect={setActiveSubGroup}
          ariaLabel="تبويبات التمويل الفرعية"
        />
      )}

      {/* 3. Main Active Area */}
      <main className={`${styles.operationsMainPanel} ${fStyles.financeMainPanel} ${fStyles.noScroll}`}>
        <div className={`${styles.operationsInnerScroll} ${fStyles.financeInnerScroll} ${fStyles.noScroll}`}>
          {activeGroup === 'overview' ? (
            <WltDshFinanceControlPanelContent hideHeader />
          ) : (
            <ActiveScreen hubHref={hubHref} subGroup={activeSubGroup} />
          )}
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshFinanceHubScreen;
