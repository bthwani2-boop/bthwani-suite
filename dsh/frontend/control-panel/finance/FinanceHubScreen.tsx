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
  FINANCE_ACTIVE_GROUPS,
} from './finance.registry';
import { getDshControlPanelGovernanceEntry } from '../shared';
import type { CanonicalFinanceGroupId, FinancePanelId, FinanceViewState } from './finance.types';
import {
  ControlPanelDshFinanceScreen,
  ControlPanelDshPayoutsScreen,
  ControlPanelDshCaptainFinanceScreen,
  ControlPanelDshStoreDeliveryFinanceScreen,
} from './FinanceHubScreens';
import { PartnerSettlementWorkspace } from './PartnerSettlementWorkspace';
import { CaptainPayoutWorkspace } from './CaptainPayoutWorkspace';
import { RefundQueueWorkspace } from './RefundQueueWorkspace';
import { CommissionBreakdownWorkspace } from './CommissionBreakdownWorkspace';
import { PlatformFeeAuditWorkspace } from './PlatformFeeAuditWorkspace';
import { FieldCommissionWorkspace } from './FieldCommissionWorkspace';
import { getWltControlPanelFinancePreview } from '../../../../wlt/frontend/shared/finance/dshFinancePreview';

import styles from '../shared/control-panel-surface.module.css';

export type ControlPanelDshFinanceScreenProps = {
  group?: CanonicalFinanceGroupId;
  subGroup?: string;
  panel?: FinancePanelId;
  state?: FinanceViewState;
  fallbackHref?: string;
};

// WLT bridge adapters — read-only; no financial calculations inside DSH
function PartnerSettlementBridgePanel(_: { hubHref: string; subGroup?: string }) {
  return <PartnerSettlementWorkspace />;
}
function CaptainPayoutBridgePanel(_: { hubHref: string; subGroup?: string }) {
  return <CaptainPayoutWorkspace />;
}
function RefundQueueBridgePanel(_: { hubHref: string; subGroup?: string }) {
  return <RefundQueueWorkspace />;
}
function CommissionBreakdownBridgePanel(_: { hubHref: string; subGroup?: string }) {
  return <CommissionBreakdownWorkspace />;
}
function PlatformFeeAuditBridgePanel(_: { hubHref: string; subGroup?: string }) {
  return <PlatformFeeAuditWorkspace />;
}
function FieldCommissionBridgePanel(_: { hubHref: string; subGroup?: string }) {
  return <FieldCommissionWorkspace />;
}

const SCREEN_RENDERERS: Record<CanonicalFinanceGroupId, React.ComponentType<{ hubHref: string; subGroup?: string }>> = {
  overview: ControlPanelDshFinanceScreen,
  settlements: PartnerSettlementBridgePanel,         // partner settlement — WLT bridge, view-only
  'cod-reconciliation': CommissionBreakdownBridgePanel, // per-order commission breakdown — WLT bridge, view-only
  'captain-eligibility': CaptainPayoutBridgePanel,  // captain payout — WLT bridge, view-only
  refunds: RefundQueueBridgePanel,                   // refund queue — WLT bridge, view-only
  ledger: FieldCommissionBridgePanel,                // field agent commission — WLT bridge, view-only
  payouts: ControlPanelDshPayoutsScreen,
  'tax-compliance': ControlPanelDshFinanceScreen,
  'risk-audit': PlatformFeeAuditBridgePanel,         // platform fee audit — WLT bridge, view-only
  'captain-finance': ControlPanelDshCaptainFinanceScreen,
  'store-delivery-finance': ControlPanelDshStoreDeliveryFinanceScreen,
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

  React.useEffect(() => { setActiveGroup(group); }, [group]);
  React.useEffect(() => { setActiveSubGroup(subGroup); }, [subGroup]);

  const financePreview = React.useMemo(() => getWltControlPanelFinancePreview(), []);
  const financeGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('finance'), []);
  const platformGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('platform'), []);
  const activeGroupMeta = getFinanceGroupMeta(activeGroup);
  const hubHref = buildFinanceHref(activeGroup, { panel });
  const ActiveScreen = SCREEN_RENDERERS[activeGroup] || SCREEN_RENDERERS.overview;

  if (state !== 'ready') {
    return (
      <div className={`${styles.surfaceMainPanel} ${styles.surfaceStatePadding}`}>
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
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.surfaceHeaderIconBox} aria-hidden="true">
            <div className={styles.surfaceHeaderGlyph}>
              <span className={styles.surfaceHeaderGlyphDot} />
            </div>
          </div>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>مالية DSH</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>غرفة قيادة</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>WLT — قراءة فقط / معاينة / runtime غير مربوط · التسويات، مطابقة COD، أهلية الكابتن، الاستردادات، والرقابة المالية — ر.ي</p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>إجمالي التدفقات</span>
              <span className={styles.commandKpiValue}>{financePreview.totalInflowLabel}</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>إجمالي المصروفات</span>
              <span className={styles.commandKpiValue}>{financePreview.totalOutflowLabel}</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>عناصر معلقة (معاينة)</span>
              <span className={`${styles.commandKpiValue} ${styles.commandKpiValueAlert}`}>١٤</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>حالة المخاطر (معاينة)</span>
              <span className={`${styles.commandKpiValue} ${styles.commandKpiValueSuccess}`}>{financePreview.contractState === 'CONTRACT_TBD' ? 'معاينة — غير مربوط' : 'منخفض'}</span>
            </div>
          </div>
        </div>
      </header>

      <nav className={styles.navigationDock}>
        <WebControlPanelWorkspaceTabs
          items={FINANCE_ACTIVE_GROUPS.map((item) => ({
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

      {activeGroupMeta.subGroups && activeGroupMeta.subGroups.length > 0 ? (
        <div className={`${styles.filterDock} ${styles.filterDockTint}`}>
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

      <Box paddingX={4} paddingY={2}>
        <Box style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" style={{ flexGrow: 1, minWidth: 280 }}>
            <Text role="titleSm">ملكية المالية</Text>
            <Text role="bodySm" tone="muted">
              {financeGovernance?.notes ?? 'المالية داخل control-panel تراجع الأثر المالي، بينما ledger والتسويات الفعلية تبقى مملوكة لـ WLT.'}
            </Text>
            <Text role="caption" tone="muted">
              {`المرجع المالي: ${financeGovernance?.financeReference ?? 'wlt-finance'} · الأفعال الممنوعة: ${(financeGovernance?.forbiddenActions ?? []).join('، ')}`}
            </Text>
          </Box>
          <Box padding={3} background="surfaceRaised" radiusToken="lg" border borderTone="line" style={{ flexGrow: 1, minWidth: 280 }}>
            <Text role="titleSm">ربط السياسات</Text>
            <Text role="bodySm" tone="muted">
              {platformGovernance?.notes ?? 'Vars وprovider controls تبقى مرجعًا للسياسات فقط في هذه المرحلة.'}
            </Text>
            <Text role="caption" tone="muted">
              {platformGovernance?.onDemandPolicySummary ?? 'افتح ملخص السياسة فقط عند الطلب، دون أي env أو backend mutation.'}
            </Text>
          </Box>
          <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" style={{ flexGrow: 1, minWidth: 280 }}>
            <Text role="titleSm">WLT visibility consumers</Text>
            <Text role="bodySm" tone="muted">
              Customer 360 وManual Call Intake وAssisted Order وOrder Rescue تستهلك هذه اللوحة كرؤية مرجعية فقط.
            </Text>
            <Text role="caption" tone="muted">
              لا يوجد هنا refund/settlement/payout/ledger mutation. أي owner مالي يبقى WLT-only مهما كان مصدر الطلب.
            </Text>
          </Box>
        </Box>
      </Box>

      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <ActiveScreen hubHref={hubHref} subGroup={activeSubGroup} />
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshFinanceHubScreen;
