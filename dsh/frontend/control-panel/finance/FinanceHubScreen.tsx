'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Text,
} from '@bthwani/ui-kit';
import {
  WebControlPanelWorkspaceTabs,
  WebControlPanelSubTabs,
} from '@bthwani/ui-kit/web';
import {
  buildFinanceHref,
  getFinanceGroupMeta,
  FINANCE_NAV_GROUPS,
} from './finance.registry';
import { getDshControlPanelGovernanceEntry } from '../shared';
import type { CanonicalFinanceGroupId, FinancePanelId, FinanceViewState } from './finance.types';
import {
  ControlPanelDshFinanceScreen,
  ControlPanelDshCodReconciliationScreen,
  ControlPanelDshCaptainEligibilityScreen,
  ControlPanelDshPayoutsScreen,
  ControlPanelDshRiskAuditScreen,
  ControlPanelDshLedgerScreen,
  ControlPanelDshCaptainFinanceScreen,
  ControlPanelDshStoreDeliveryFinanceScreen,
  ControlPanelDshSettlementScreen,
  ControlPanelDshRefundQueueScreen,
  DailyReconciliationWorkbench,
  FinancialCenterScreen,
  WltDshAccountStatement,
  WltDshRefundLedger,
  WltDshSettlementCalendar,
  WltDshStoreSettlementStatement,
} from '../../../../wlt/frontend/control-panel/dsh';
import { getWltControlPanelFinancePreview } from '../../../../wlt/frontend/control-panel/dsh/dshFinancePreview';

import styles from '../shared/control-panel-surface.module.css';

export type ControlPanelDshFinanceScreenProps = {
  group?: CanonicalFinanceGroupId;
  subGroup?: string;
  panel?: FinancePanelId;
  state?: FinanceViewState;
  fallbackHref?: string;
};

const DailyCloseBridge = (_: { hubHref: string; subGroup?: string; technicalAuditMode: boolean }) => (
  <DailyReconciliationWorkbench />
);

const AccountStatementBridge = (_: { hubHref: string; subGroup?: string; technicalAuditMode: boolean }) => (
  <WltDshAccountStatement />
);

const StoreSettlementBridge = (_: { hubHref: string; subGroup?: string; technicalAuditMode: boolean }) => (
  <WltDshStoreSettlementStatement />
);

const SettlementCalendarBridge = (_: { hubHref: string; subGroup?: string; technicalAuditMode: boolean }) => (
  <WltDshSettlementCalendar />
);

const RefundLedgerBridge = (_: { hubHref: string; subGroup?: string; technicalAuditMode: boolean }) => (
  <WltDshRefundLedger />
);

const SCREEN_RENDERERS: Record<
  CanonicalFinanceGroupId,
  React.ComponentType<{ hubHref: string; subGroup?: string; technicalAuditMode: boolean }>
> = {
  'financial-center': FinancialCenterScreen,
  'account-statements': AccountStatementBridge,
  'store-settlements': StoreSettlementBridge,
  'settlement-calendar': SettlementCalendarBridge,
  'refund-ledger': RefundLedgerBridge,
  'daily-close': DailyCloseBridge,
  variances: ControlPanelDshRiskAuditScreen,
  'cod-cash': ControlPanelDshCodReconciliationScreen,
  'settlements-payouts': ControlPanelDshSettlementScreen,
  ledger: ControlPanelDshLedgerScreen,
  refunds: ControlPanelDshRefundQueueScreen,

  // Backward compatibility mappings
  overview: ControlPanelDshFinanceScreen,
  settlements: ControlPanelDshSettlementScreen,
  'cod-reconciliation': ControlPanelDshCodReconciliationScreen,
  'captain-eligibility': ControlPanelDshCaptainEligibilityScreen,
  payouts: ControlPanelDshPayoutsScreen,
  'tax-compliance': ControlPanelDshFinanceScreen,
  'risk-audit': ControlPanelDshRiskAuditScreen,
  'captain-finance': ControlPanelDshCaptainFinanceScreen,
  'store-delivery-finance': ControlPanelDshStoreDeliveryFinanceScreen,
};

export function ControlPanelDshFinanceHubScreen({
  group = 'financial-center',
  subGroup,
  panel,
  state = 'ready',
  fallbackHref = '/finance',
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
      <div className={styles.surfaceCockpit} style={{ opacity: 0.85, height: '100vh', display: 'flex', flexDirection: 'column', padding: 20 }}>
        <Text role="titleLg" style={{ textAlign: 'right' }}>جاري تحميل البيانات المالية...</Text>
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
            <div className={styles.surfaceHeaderTextRow} style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: 8 }}>
              <h1 className={styles.surfaceHeaderTitle}>غرفة القيادة المالية</h1>

              {technicalAuditMode ? (
                <>
                  <Box paddingX={2} paddingY={1} background="brandSurface" radiusToken="xs">
                    <span className={styles.surfaceHeaderBadgeText} style={{ fontWeight: '700' }}>WLT SSoT Mapped</span>
                  </Box>
                  <Box paddingX={2} paddingY={1} background="warningSurface" radiusToken="xs">
                    <span className={styles.surfaceHeaderBadgeText} style={{ color: 'var(--bth-warning-text)', fontWeight: '700' }}>{financePreview.contractState}</span>
                  </Box>
                </>
              ) : (
                <>
                  <Box paddingX={2} paddingY={1} background="brandSurface" radiusToken="xs">
                    <span className={styles.surfaceHeaderBadgeText} style={{ fontWeight: '700' }}>مصدر الحقيقة: WLT</span>
                  </Box>
                  <Box paddingX={2} paddingY={1} background="warningSurface" radiusToken="xs">
                    <span className={styles.surfaceHeaderBadgeText} style={{ color: 'var(--bth-warning-text)', fontWeight: '700' }}>معاينة تشغيلية</span>
                  </Box>
                </>
              )}
            </div>

            <p className={styles.surfaceHeaderSubtitle} style={{ marginTop: 4 }}>
              العملة: <strong>ر.ي (ريال يمني)</strong> · آخر مزامنة: <strong>مباشر (معاينة فقط)</strong> · المالك المالي: <strong>WLT Engine</strong>
            </p>
          </Box>
        </div>

        {/* View Mode Toggle Switch & Cockpit Metrics */}
        <div className={styles.surfaceHeaderActions} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexDirection: 'row-reverse', background: 'var(--bthwani-control-panel-border)', padding: '4px 10px', borderRadius: 8 }}>
            <span style={{ fontSize: 11, fontWeight: '700', color: 'var(--bthwani-control-panel-text-muted)' }}>وضع التدقيق التقني</span>
            <button
              onClick={() => setTechnicalAuditMode(!technicalAuditMode)}
              aria-label="تغيير وضع العرض"
              style={{
                background: technicalAuditMode ? 'var(--bthwani-brand-primary)' : 'var(--bthwani-control-panel-border)',
                border: 'none',
                width: 36,
                height: 20,
                borderRadius: 10,
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.25s',
              }}
            >
              <div
                style={{
                  background: 'var(--bthwani-text-inverse)',
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  position: 'absolute',
                  top: 2,
                  left: technicalAuditMode ? 18 : 2,
                  transition: 'left 0.25s',
                }}
              />
            </button>
          </div>

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
              <span className={styles.commandKpiLabel}>عناصر معلقة</span>
              <span className={`${styles.commandKpiValue} ${pendingCount > 0 ? styles.commandKpiValueAlert : ''}`}>
                {pendingCount.toLocaleString('ar-YE')}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Dock */}
      <nav className={styles.navigationDock}>
        <WebControlPanelWorkspaceTabs
          items={FINANCE_NAV_GROUPS.map((item) => ({
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

      {/* Low-noise Governance Status Strip */}
      <div style={{ borderBottom: '1px solid var(--bthwani-control-panel-border)', background: 'var(--bthwani-control-panel-surface-raised)', padding: '8px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', direction: 'rtl' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, color: 'var(--bthwani-control-panel-text-muted)' }}>
              🛡️ <strong>مصدر الحقيقة:</strong> WLT · DSH عرض وتحضير فقط · لا تحويل مالي من هذه الشاشة · <strong>الحالة:</strong> معاينة
            </span>
          </div>
          <button
            onClick={() => setIsGovInspectorOpen(!isGovInspectorOpen)}
            style={{
              background: 'transparent',
              border: '1px solid var(--bthwani-control-panel-border)',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: 12,
              cursor: 'pointer',
              color: 'var(--bthwani-brand-primary)',
              fontWeight: '700',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            تفاصيل الحوكمة ↗
          </button>
        </div>
      </div>

      {/* Pop-up slide-over modal/drawer for Governance Inspector Details */}
      {isGovInspectorOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(3px)',
          }}
          onClick={() => setIsGovInspectorOpen(false)}
        >
          <div
            style={{
              background: 'var(--bthwani-control-panel-surface)',
              border: '1px solid var(--bthwani-control-panel-border)',
              borderRadius: 12,
              padding: 24,
              maxWidth: 800,
              width: '90%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              direction: 'rtl',
              textAlign: 'right',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text role="titleLg" style={{ fontWeight: '700' }}>مبادئ الحوكمة والملكيات المالية</Text>
              <button
                onClick={() => setIsGovInspectorOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: 'var(--bthwani-control-panel-text-muted)',
                }}
              >
                ×
              </button>
            </div>

            <Box style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line">
                <Text role="titleSm">ملكية المالية</Text>
                <Text role="bodySm" tone="soft" style={{ marginTop: 4, lineHeight: 1.6 }}>
                  {financeGovernance?.notes ?? 'المالية داخل control-panel تراجع الأثر المالي، بينما ledger والتسويات الفعلية تبقى مملوكة لـ WLT.'}
                </Text>
                <Text role="caption" tone="muted" style={{ marginTop: 4 }}>
                  {`المرجع المالي: ${financeGovernance?.financeReference ?? 'wlt-finance'} · الأفعال الممنوعة: ${(financeGovernance?.forbiddenActions ?? []).join('، ')}`}
                </Text>
              </Box>

              <Box padding={3} background="surfaceRaised" radiusToken="lg" border borderTone="line">
                <Text role="titleSm">ربط السياسات</Text>
                <Text role="bodySm" tone="soft" style={{ marginTop: 4, lineHeight: 1.6 }}>
                  {platformGovernance?.notes ?? 'Vars وprovider controls تبقى مرجعًا للسياسات فقط في هذه المرحلة.'}
                </Text>
                <Text role="caption" tone="muted" style={{ marginTop: 4 }}>
                  {platformGovernance?.onDemandPolicySummary ?? 'افتح ملخص السياسة فقط عند الطلب، دون أي env أو backend mutation.'}
                </Text>
              </Box>

              <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line">
                <Text role="titleSm">WLT visibility consumers</Text>
                <Text role="bodySm" tone="soft" style={{ marginTop: 4, lineHeight: 1.6 }}>
                  Customer 360 وManual Call Intake وAssisted Order وOrder Rescue تستهلك هذه اللوحة كرؤية مرجعية فقط.
                </Text>
                <Text role="caption" tone="muted" style={{ marginTop: 4 }}>
                  لا يوجد هنا refund/settlement/payout/ledger mutation. أي owner مالي يبقى WLT-only مهما كان مصدر الطلب.
                </Text>
              </Box>
            </Box>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 20 }}>
              <button
                onClick={() => setIsGovInspectorOpen(false)}
                style={{
                  background: 'var(--bthwani-brand-primary)',
                  color: 'var(--bthwani-text-inverse)',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Panel */}
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          {state === 'ready' && (
            <ActiveScreen
              hubHref={hubHref}
              subGroup={activeSubGroup}
              technicalAuditMode={technicalAuditMode}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshFinanceHubScreen;
