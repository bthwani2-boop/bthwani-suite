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
  settlements: PartnerSettlementBridgePanel,
  'cod-reconciliation': ControlPanelDshCodReconciliationScreen,
  'captain-eligibility': ControlPanelDshCaptainEligibilityScreen,
  refunds: RefundQueueBridgePanel,
  ledger: ControlPanelDshLedgerScreen,
  payouts: ControlPanelDshPayoutsScreen,
  'tax-compliance': ControlPanelDshFinanceScreen,
  'risk-audit': ControlPanelDshRiskAuditScreen,
  'captain-finance': ControlPanelDshCaptainFinanceScreen,
  'store-delivery-finance': ControlPanelDshStoreDeliveryFinanceScreen,
};

// ==========================================
// Custom Beautiful Visual State Components
// ==========================================

function FinanceSkeletonLoader() {
  return (
    <div className={styles.surfaceCockpit} style={{ opacity: 0.85, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Warning strip skeleton */}
      <div className={styles.warningStripSkeleton}>
        <div className={styles.skeletonBlock} style={{ width: 140, height: 12 }} />
        <span className={styles.warningStripSep}>•</span>
        <div className={styles.skeletonBlock} style={{ width: 80, height: 12 }} />
        <span className={styles.warningStripSep}>•</span>
        <div className={styles.skeletonBlock} style={{ width: 180, height: 12 }} />
      </div>

      {/* Header skeleton */}
      <header className={styles.surfaceTopBar} style={{ padding: '16px 20px' }}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.skeletonBlock} style={{ width: 40, height: 40, borderRadius: 10 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: 'row-reverse' }}>
              <div className={styles.skeletonBlock} style={{ width: 160, height: 24 }} />
              <div className={styles.skeletonBlock} style={{ width: 100, height: 16 }} />
            </div>
            <div className={styles.skeletonBlock} style={{ width: 280, height: 12 }} />
          </div>
        </div>

        {/* Signal bar skeleton */}
        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact} style={{ gap: 8 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.commandKpi} style={{ padding: '6px 12px', minWidth: 110 }}>
                <div className={styles.skeletonBlock} style={{ width: 70, height: 10, marginBottom: 4 }} />
                <div className={styles.skeletonBlock} style={{ width: 90, height: 18 }} />
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Navigation Dock Skeleton */}
      <div className={styles.navigationDock} style={{ padding: '8px 20px', gap: 8 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={styles.skeletonBlock} style={{ width: 90, height: 28, borderRadius: 8 }} />
        ))}
      </div>

      {/* Workbench main panel skeleton */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 16, padding: 16, direction: 'rtl', flex: 1 }}>
        {/* Right side list skeleton (70%) */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className={styles.skeletonBlock} style={{ width: '100%', height: 36, borderRadius: 8 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--bthwani-control-panel-border)', borderRadius: 10, overflow: 'hidden' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.skeletonTableRow} style={{ background: 'var(--bthwani-control-panel-surface)', justifyContent: 'space-between', padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'row-reverse' }}>
                  <div className={styles.skeletonBlock} style={{ width: 32, height: 32, borderRadius: 8 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div className={styles.skeletonBlock} style={{ width: 120, height: 14 }} />
                    <div className={styles.skeletonBlock} style={{ width: 80, height: 10 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexDirection: 'row-reverse' }}>
                  <div className={styles.skeletonBlock} style={{ width: 90, height: 16 }} />
                  <div className={styles.skeletonBlock} style={{ width: 60, height: 20, borderRadius: 12 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Left side inspector skeleton (30%) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className={styles.skeletonBlock} style={{ width: '100%', height: 120, borderRadius: 10 }} />
          <div className={styles.skeletonBlock} style={{ width: '100%', height: 120, borderRadius: 10 }} />
          <div className={styles.skeletonBlock} style={{ width: '100%', height: 100, borderRadius: 10 }} />
        </div>
      </div>
    </div>
  );
}

function FinanceEmptyState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={styles.emptyStateContainer}>
      <div className={styles.emptyStateIconBox}>
        📂
      </div>
      <h3 className={styles.emptyStateTitle}>
        لا توجد سجلات لهذا الفلتر
      </h3>
      <p className={styles.emptyStateDesc}>
        لا توجد حركات، قيود، أو تسويات مالية معلقة مطابقة لهذا القسم أو الفلتر المختار حاليًا في قاعدة بيانات المعاينة WLT.
      </p>
      <button className={styles.emptyStateButton} onClick={onRetry}>
        تحديث ومزامنة البيانات
      </button>
    </div>
  );
}

function FinanceErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={styles.errorStateContainer}>
      <div className={styles.errorStateTitleRow}>
        <span style={{ fontSize: 24 }}>⚠️</span>
        <h3 className={styles.errorStateTitle}>
          فشل تحميل العقد المالي والربط المركزي
        </h3>
      </div>
      <p className={styles.errorStateDesc}>
        حدث خطأ أثناء الاتصال بمحرك WLT المالي أو استرداد بيانات المعاينة. لم نتمكن من تدقيق العقد النشط أو مزامنة التبويبات الفرعية.
      </p>

      <div className={styles.errorStateDiagnostics}>
        <div className={styles.errorStateDiagnosticsHeader}>
          [بيئة معاينة — لا بيانات runtime حقيقية]
        </div>
        <div>السبب: لم يتم ربط WLT API بعد (CONTRACT_TBD)</div>
        <div>المصدر: bيانات معاينة ثابتة فقط — لا اتصال بخادم مالي</div>
      </div>

      <div className={styles.stateActionsRow}>
        <button className={styles.errorStateButton} onClick={onRetry}>
          إعادة محاولة الاتصال
        </button>
      </div>
    </div>
  );
}

function FinanceOfflineState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={styles.offlineStateContainer}>
      <div className={styles.offlineStateTitleRow}>
        <span style={{ fontSize: 24 }}>🛜</span>
        <h3 className={styles.offlineStateTitle}>
          غير متصل بالشبكة (العمل في وضع المعاينة المحلية)
        </h3>
      </div>
      <p className={styles.offlineStateDesc}>
        تعذر تحديث المؤشرات المالية الحية من خادم WLT المركزي. يتم حاليًا عرض نسخة المعاينة المحلية المخزنة مؤقتًا لتسهيل المراجعة التشغيلية.
      </p>

      <div className={styles.offlineStateInfo}>
        <strong>حالة المزامنة:</strong> غير متصل · <strong>المصدر النشط:</strong> بيانات معاينة محلية فقط (لا runtime)
      </div>

      <div className={styles.stateActionsRow}>
        <button className={styles.offlineStateButton} onClick={onRetry}>
          إعادة الاتصال بالإنترنت ومزامنة WLT
        </button>
      </div>
    </div>
  );
}

function FinanceDisabledState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={styles.disabledStateContainer}>
      <div className={styles.disabledStateTitleRow}>
        <span style={{ fontSize: 24 }}>🔒</span>
        <h3 className={styles.disabledStateTitle}>
          تم قفل الوصول بقرار من السياسة الأمنية
        </h3>
      </div>
      <p className={styles.disabledStateDesc}>
        حسابك الحالي لا يملك الصلاحيات الكافية للوصول إلى غرفة العمليات والقيادة المالية المشتقة من WLT Ledger. تم حظر العرض تلقائيًا.
      </p>

      {/* Audit Reason & Policy Status */}
      <div className={styles.disabledStateInfo}>
        <div className={styles.disabledStatePolicyHeader}>
          🛡️ تفاصيل قرار الرقابة الأمنية (Security Policy Decision):
        </div>
        <div className={styles.disabledStatePolicyRow}><strong>معرف السياسة:</strong> POLICY_FIN_01_ADMIN_ONLY (قصر الوصول على المحاسبين المعتمدين)</div>
        <div className={styles.disabledStatePolicyRow}><strong>الصلاحيات المطلوبة:</strong> READ_FINANCIAL_COCKPIT & VIEW_WLT_LEDGER</div>
        <div><strong>حالة الطلب:</strong> تم حظر الوصول التلقائي · <strong>رمز الأثر:</strong> AUTH_DISABLED_FOR_ROLE_OPERATOR</div>
      </div>

      <div className={styles.stateActionsRow}>
        <button className={styles.disabledStateButton} onClick={onRetry}>
          طلب صلاحيات المحاسب
        </button>
      </div>
    </div>
  );
}

function FinanceBlockedState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={styles.blockedStateContainer}>
      <div className={styles.blockedStateTitleRow}>
        <span style={{ fontSize: 24 }}>🚫</span>
        <h3 className={styles.blockedStateTitle}>
          العقد المالي غير نشط أو معلق (WLT Central Contract Blocked)
        </h3>
      </div>
      <p className={styles.blockedStateDesc}>
        تم إغلاق الأنشطة المالية لأن محرك العقود WLT Central Contract غير مفعل لهذه المؤسسة أو معلق بسبب عدم اكتمال التوثيق المالي. جميع الحركات والقيود مصنفة حاليًا تحت حالة <strong>CONTRACT_TBD</strong> لحماية الحسابات.
      </p>

      {/* Status Strip & Audit info */}
      <div className={styles.blockedStateInfo}>
        <strong>حالة العقد:</strong> معلق (CONTRACT_TBD) · <strong>السبب القانوني:</strong> عدم تفعيل توثيق المؤسسة · <strong>أثر الإجراء:</strong> منع كافة التسويات التلقائية وحركات الكباتن حتى التفعيل.
      </div>

      <div className={styles.stateActionsRow}>
        <button className={styles.blockedStateButton} onClick={onRetry}>
          طلب تفعيل العقد التجريبي (معاينة)
        </button>
      </div>
    </div>
  );
}

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
  // P6: Derive pending count from WLT preview records instead of hardcoding
  const pendingCount = React.useMemo(
    () => financePreview.allRecords.filter((r) => r.statusTone === 'error' || r.statusTone === 'warning').length,
    [financePreview],
  );
  const activeGroupMeta = getFinanceGroupMeta(activeGroup);
  const hubHref = buildFinanceHref(activeGroup, { panel });
  const ActiveScreen = SCREEN_RENDERERS[activeGroup] || SCREEN_RENDERERS.overview;

  if (state === 'loading') {
    return <FinanceSkeletonLoader />;
  }

  return (
    <div className={styles.surfaceCockpit}>
      <div className={styles.warningStrip}>
        <span className={styles.warningStripAlert}>🚨 بيئة معاينة مالية فقط (PREVIEW_ONLY)</span>
        <span className={styles.warningStripSep}>•</span>
        <span className={styles.warningStripAlert}>عقد معلق [CONTRACT_TBD]</span>
        <span className={styles.warningStripSep}>•</span>
        <span className={styles.warningStripDanger}>لا توجد حركات مالية حقيقية (NO REAL MONEY MOVEMENT)</span>
      </div>
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
              <Box paddingX={2} paddingY={1} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText} style={{ fontWeight: '700' }}>WLT SSoT Mapped</span>
              </Box>
              <Box paddingX={2} paddingY={1} background="warningSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText} style={{ color: 'var(--bth-warning-text)', fontWeight: '700' }}>{financePreview.contractState}</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle} style={{ marginTop: 4 }}>
              العملة: <strong>ر.ي (ريال يمني)</strong> · آخر مزامنة: <strong>مباشر (معاينة فقط)</strong> · المالك المالي: <strong>WLT Engine</strong>
            </p>
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
              <span className={styles.commandKpiLabel}>عناصر معلقة [معاينة]</span>
              <span className={`${styles.commandKpiValue} ${pendingCount > 0 ? styles.commandKpiValueAlert : ''}`}>
                {pendingCount.toLocaleString('ar-YE')}
              </span>
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
          {state === 'empty' && <FinanceEmptyState onRetry={() => router.push(fallbackHref)} />}
          {state === 'error' && <FinanceErrorState onRetry={() => router.push(fallbackHref)} />}
          {state === 'offline' && <FinanceOfflineState onRetry={() => router.push(fallbackHref)} />}
          {state === 'disabled' && <FinanceDisabledState onRetry={() => router.push(fallbackHref)} />}
          {state === 'blocked' && <FinanceBlockedState onRetry={() => router.push(fallbackHref)} />}
          {state === 'ready' && <ActiveScreen hubHref={hubHref} subGroup={activeSubGroup} />}
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshFinanceHubScreen;
