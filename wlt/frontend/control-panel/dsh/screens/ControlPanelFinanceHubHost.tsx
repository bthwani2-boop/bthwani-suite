'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Text } from '@bthwani/ui-kit';
import { WebControlPanelWorkspaceTabs, WebControlPanelSubTabs } from '@bthwani/ui-kit/web';
import { buildFinanceHref, getFinanceGroupMeta, FINANCE_NAV_GROUPS } from '../constants/finance.registry';
import type { CanonicalFinanceGroupId, FinancePanelId, FinanceViewState } from '../models/financeRouting.types';
import { getDshControlPanelGovernanceEntry } from '../../../../../dsh/frontend/control-panel/shared';
import { getWltControlPanelFinancePreview } from '../financeContracts';

import { FinancialCenterScreen } from './FinancialCenterScreen';
import { LedgerScreen } from './LedgerScreen';
import { AuditCloseScreen } from './AuditCloseScreen';
import { DailyReconciliationWorkbench } from './DailyReconciliationWorkbench';
import {
  ControlPanelDshCodReconciliationScreen,
  ControlPanelDshSettlementScreen,
} from './FinanceHubScreens';
import { WltDshAccountStatement } from '../components/WltDshAccountStatement';
import { WltDshRefundLedger } from '../components/WltDshRefundLedger';
import { WltDshSettlementCalendar } from '../components/WltDshSettlementCalendar';
import { WltDshStoreSettlementStatement } from '../components/WltDshStoreSettlementStatement';

import styles from '../../../../../dsh/frontend/control-panel/shared/control-panel-surface.module.css';
import wltStyles from '../styles/wlt-dsh-finance.module.css';

export type ControlPanelDshFinanceScreenProps = {
  group?: CanonicalFinanceGroupId;
  subGroup?: string;
  panel?: FinancePanelId;
  state?: FinanceViewState;
  fallbackHref?: string;
};

const DailyCloseBridge = (_: { hubHref: string; subGroup?: string; technicalAuditMode: boolean }) => <DailyReconciliationWorkbench />;
const AccountStatementBridge = (_: { hubHref: string; subGroup?: string; technicalAuditMode: boolean }) => <WltDshAccountStatement />;
const StoreSettlementBridge = (props: { hubHref: string; subGroup?: string; technicalAuditMode: boolean }) => <WltDshStoreSettlementStatement technicalAuditMode={props.technicalAuditMode} />;
const SettlementCalendarBridge = (_: { hubHref: string; subGroup?: string; technicalAuditMode: boolean }) => <WltDshSettlementCalendar />;
const RefundLedgerBridge = (_: { hubHref: string; subGroup?: string; technicalAuditMode: boolean }) => <WltDshRefundLedger />;

const SCREEN_RENDERERS: Record<CanonicalFinanceGroupId, React.ComponentType<{ hubHref: string; subGroup?: string; technicalAuditMode: boolean }>> = {
  'financial-center': FinancialCenterScreen,
  'account-statements': AccountStatementBridge,
  'store-settlements': StoreSettlementBridge,
  'settlement-calendar': SettlementCalendarBridge,
  'refund-ledger': RefundLedgerBridge,
  'daily-close': AuditCloseScreen,
  'cod-cash': ControlPanelDshCodReconciliationScreen,
  'settlements-payouts': ControlPanelDshSettlementScreen,
  ledger: LedgerScreen,
};

export function ControlPanelFinanceHubHost({
  group = 'financial-center',
  subGroup,
  panel,
  state = 'ready',
}: ControlPanelDshFinanceScreenProps) {
  const router = useRouter();
  const [activeGroup, setActiveGroup] = React.useState<CanonicalFinanceGroupId>(group);
  const [activeSubGroup, setActiveSubGroup] = React.useState<string | undefined>(subGroup);
  const [technicalAuditMode, setTechnicalAuditMode] = React.useState(false);
  const [isGovInspectorOpen, setIsGovInspectorOpen] = React.useState(false);

  React.useEffect(() => { setActiveGroup(group); }, [group]);
  React.useEffect(() => { setActiveSubGroup(subGroup); }, [subGroup]);

  const financePreview = React.useMemo(() => getWltControlPanelFinancePreview(), []);
  const financeGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('finance'), []);
  const platformGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('platform'), []);

  const pendingCount = React.useMemo(
    () => financePreview.allRecords.filter((r) => r.statusTone === 'error' || r.statusTone === 'warning').length,
    [financePreview],
  );

  const activeGroupMeta = getFinanceGroupMeta(activeGroup);
  const hubHref = buildFinanceHref(activeGroup, { panel });
  const ActiveScreen = SCREEN_RENDERERS[activeGroup] || SCREEN_RENDERERS['financial-center'];

  if (state === 'loading') {
    return (
      <div className={`${styles.surfaceCockpit} ${wltStyles.loadingWrapper}`}>
        <Text role="titleLg" className={wltStyles.loadingText}>جاري تحميل البيانات المالية...</Text>
      </div>
    );
  }

  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.surfaceHeaderIconBox} aria-hidden="true">
            <div className={styles.surfaceHeaderGlyph}><span className={styles.surfaceHeaderGlyphDot} /></div>
          </div>
          <Box gap={0}>
            <div className={`${styles.surfaceHeaderTextRow} ${wltStyles.headerTextRow}`}>
              <h1 className={styles.surfaceHeaderTitle}>غرفة القيادة المالية</h1>
              {technicalAuditMode ? (
                <>
                  <Box paddingX={2} paddingY={1} background="brandSurface" radiusToken="xs"><span className={`${styles.surfaceHeaderBadgeText} ${wltStyles.fontWeight700}`}>WLT SSoT Mapped</span></Box>
                  <Box paddingX={2} paddingY={1} background="warningSurface" radiusToken="xs"><span className={`${styles.surfaceHeaderBadgeText} ${wltStyles.colorWarning} ${wltStyles.fontWeight700}`}>{financePreview.contractState}</span></Box>
                </>
              ) : (
                <>
                  <Box paddingX={2} paddingY={1} background="brandSurface" radiusToken="xs"><span className={`${styles.surfaceHeaderBadgeText} ${wltStyles.fontWeight700}`}>مصدر الحقيقة: WLT</span></Box>
                  <Box paddingX={2} paddingY={1} background="warningSurface" radiusToken="xs"><span className={`${styles.surfaceHeaderBadgeText} ${wltStyles.colorWarning} ${wltStyles.fontWeight700}`}>معاينة تشغيلية</span></Box>
                </>
              )}
            </div>
            <p className={`${styles.surfaceHeaderSubtitle} ${wltStyles.headerSubtitle}`}>
              العملة: <strong>ر.ي (ريال يمني)</strong> · المالك المالي: <strong>WLT Engine</strong>
            </p>
          </Box>
        </div>

        <div className={`${styles.surfaceHeaderActions} ${wltStyles.headerActionsArea}`}>
          <div className={wltStyles.technicalToggleContainer}>
            <span className={wltStyles.technicalToggleLabel}>وضع التدقيق التقني</span>
            <button onClick={() => setTechnicalAuditMode(!technicalAuditMode)} aria-label="تغيير وضع العرض" className={wltStyles.technicalToggleButton} style={{ background: technicalAuditMode ? 'var(--bth-brand-primary)' : 'var(--bth-control-panel-border)' }}>
              <div className={wltStyles.technicalToggleKnob} style={{ left: technicalAuditMode ? 18 : 2 }} />
            </button>
          </div>
          <div className={styles.surfacePulseCompact}>
            <div className={styles.commandKpi}><span className={styles.commandKpiLabel}>إجمالي التدفقات</span><span className={styles.commandKpiValue}>{financePreview.totalInflowLabel}</span></div>
            <div className={styles.commandKpi}><span className={styles.commandKpiLabel}>إجمالي المصروفات</span><span className={styles.commandKpiValue}>{financePreview.totalOutflowLabel}</span></div>
            <div className={styles.commandKpi}><span className={styles.commandKpiLabel}>عناصر معلقة</span><span className={`${styles.commandKpiValue} ${pendingCount > 0 ? styles.commandKpiValueAlert : ''}`}>{pendingCount.toLocaleString('ar-YE')}</span></div>
          </div>
        </div>
      </header>

      <nav className={styles.navigationDock}>
        <WebControlPanelWorkspaceTabs
          items={FINANCE_NAV_GROUPS.map((item) => ({ id: item.id, label: item.label, active: item.id === activeGroup }))}
          onSelect={(id) => { const groupId = id as CanonicalFinanceGroupId; setActiveGroup(groupId); setActiveSubGroup(undefined); router.push(buildFinanceHref(groupId, { panel })); }}
          ariaLabel="أقسام المالية الرئيسية"
        />
      </nav>

      {activeGroupMeta.subGroups && activeGroupMeta.subGroups.length > 0 ? (
        <div className={`${styles.filterDock} ${styles.filterDockTint}`}>
          <WebControlPanelSubTabs
            items={activeGroupMeta.subGroups.map((sub) => ({ id: sub.id, label: sub.label, active: (activeSubGroup ?? activeGroupMeta.subGroups?.[0]?.id) === sub.id }))}
            onSelect={setActiveSubGroup}
            ariaLabel="التبويبات الفرعية"
          />
        </div>
      ) : null}

      <div className={wltStyles.govBannerWrap}>
        <div className={wltStyles.govBannerFlex}>
          <span className={wltStyles.govBannerText}>
            🛡️ <strong>مصدر الحقيقة:</strong> WLT · DSH عرض وتحضير فقط · <strong>الحالة:</strong> معاينة
          </span>
          <button onClick={() => setIsGovInspectorOpen(!isGovInspectorOpen)} className={wltStyles.govBannerButton}>
            تفاصيل الحوكمة ↗
          </button>
        </div>
      </div>

      {isGovInspectorOpen && (
        <div className={wltStyles.govModalOverlay} onClick={() => setIsGovInspectorOpen(false)}>
          <div className={wltStyles.govModalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={wltStyles.govModalHeader}>
              <Text role="titleLg" className={wltStyles.fontWeight700}>مبادئ الحوكمة والملكيات المالية</Text>
              <button onClick={() => setIsGovInspectorOpen(false)} className={wltStyles.govModalCloseBtn}>×</button>
            </div>
            <Box className={wltStyles.govModalContentGap}>
              <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line">
                <Text role="titleSm">ملكية المالية</Text>
                <Text role="bodySm" tone="soft" className={wltStyles.headerSubtitle} style={{ lineHeight: 1.6 }}>{financeGovernance?.notes ?? 'المالية داخل control-panel تراجع الأثر المالي، بينما ledger والتسويات الفعلية تبقى مملوكة لـ WLT.'}</Text>
              </Box>
              <Box padding={3} background="surfaceRaised" radiusToken="lg" border borderTone="line">
                <Text role="titleSm">ربط السياسات</Text>
                <Text role="bodySm" tone="soft" className={wltStyles.headerSubtitle} style={{ lineHeight: 1.6 }}>{platformGovernance?.notes ?? 'Vars وprovider controls تبقى مرجعًا للسياسات فقط.'}</Text>
              </Box>
            </Box>
            <div className={wltStyles.govModalFooter}>
              <button onClick={() => setIsGovInspectorOpen(false)} className={wltStyles.govModalActionBtn}>إغلاق</button>
            </div>
          </div>
        </div>
      )}

      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          {state === 'ready' && <ActiveScreen hubHref={hubHref} subGroup={activeSubGroup} technicalAuditMode={technicalAuditMode} />}
        </div>
      </main>
    </div>
  );
}

export { ControlPanelFinanceHubHost as ControlPanelDshFinanceHubScreen };
export default ControlPanelFinanceHubHost;
