'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  StateView,
  Box,
} from '@bthwani/ui-kit';
import {
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
  <Box padding={6} gap={4} alignItems="center" justifyContent="center" className={fStyles.compactPlaceholder}>
    <StateView
      stateId="empty"
      title={title}
      description="هذه اللوحة قيد التطوير حالياً لتقديم تجربة مالية متكاملة."
    />
  </Box>
);

const SCREEN_RENDERERS: Record<CanonicalFinanceGroupId, React.ComponentType<{ hubHref: string; subGroup?: string }>> = {
  overview: WltDshFinanceControlPanelContent,
  settlements: ControlPanelDshSettlementScreen,
  'cod-reconciliation': ControlPanelDshCodReconciliationScreen,
  refunds: ControlPanelDshRefundQueueScreen,
  ledger: () => <PlaceholderScreen title="دفتر الأستاذ العام" />,
  payouts: () => <PlaceholderScreen title="إدارة المدفوعات" />,
  'tax-compliance': () => <PlaceholderScreen title="الضرائب والامتثال" />,
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
      {/* 1. Header Area - Finance Command Deck */}
      <header className={fStyles.financeTopBar}>
        <div className={fStyles.financeTitleBlock}>
          <div className={fStyles.financeHeaderIcon}>
            <div className={fStyles.financeIconInner} />
          </div>
          <div>
            <div className={fStyles.financeTitleRow}>
              <h1 className={fStyles.financeTitle}>مالية DSH</h1>
              <span className={fStyles.financeBadge}>مراجعة مالية</span>
            </div>
            <p className={fStyles.financeSubtitle}>مراقبة التدفقات المالية والتسويات المركزية</p>
          </div>
        </div>

        <div className={fStyles.financeHeaderActions}>
          <WebControlPanelKpiStrip
            items={[
              { id: 'income', label: 'إجمالي الدخل', value: '١,٢٥٤,٠٠٠ ر.س', tone: 'success' },
              { id: 'pending', label: 'تسويات معلقة', value: '١٤', tone: 'warning' },
              { id: 'risk', label: 'خطر التدفق', value: 'منخفض', tone: 'success' }
            ]}
          />
        </div>
      </header>

      {/* 2. Finance Tabs - Main Navigation */}
      <div className={fStyles.financeNavWrapper}>
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
      </div>

      {/* 2b. Sub-Tabs - Granular Navigation */}
      {activeGroupMeta.subGroups && (
        <div className={fStyles.financeSubNavWrapper}>
          <WebControlPanelSubTabs
            items={activeGroupMeta.subGroups.map((sub) => ({
              id: sub.id,
              label: sub.label,
              active: (activeSubGroup ?? activeGroupMeta.subGroups?.[0]?.id) === sub.id,
            }))}
            onSelect={setActiveSubGroup}
            ariaLabel="تبويبات التمويل الفرعية"
          />
        </div>
      )}

      {/* 3. Main Active Area */}
      <main className={`${fStyles.financeMainPanel} ${fStyles.noScroll}`}>
        <div className={`${fStyles.financeInnerScroll} ${fStyles.noScroll}`}>
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
