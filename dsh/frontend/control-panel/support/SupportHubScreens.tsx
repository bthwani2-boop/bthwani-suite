import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Surface, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelActionCluster,
  WebControlPanelDecisionRow,
  WebControlPanelInspectorShell,
  WebControlPanelRecommendation,
  WebControlPanelKpiStrip,
  WebControlPanelSubTabs,
  WebControlPanelWorkspaceTabs,
  WebControlPanelStatusTag,
} from '@bthwani/ui-kit/web';
import styles from '../shared/control-panel-surface.module.css';
import type { DshFulfillmentDeliveryMode } from '../../app-client/contracts/dsh-client-binding.contracts';
import { DSH_CALL_INTAKE_PREVIEW, DSH_CUSTOMER_360_PREVIEW, getDshFlowPolicySummary } from '../../shared';
import { SupportEscalationQueueScreen } from './SupportEscalationQueueScreen';
import { SupportSlaDashboardScreen } from './SupportSlaDashboardScreen';
import { SupportTicketDetailWorkspace } from './SupportTicketDetailWorkspace';
import { Customer360Workspace } from './Customer360Workspace';
import { ManualCallIntakeWorkspace } from './ManualCallIntakeWorkspace';
import { OpsClientMessagingWorkspace } from './OpsClientMessagingWorkspace';
import { OpsPartnerMessagingWorkspace } from './OpsPartnerMessagingWorkspace';
import { OpsCaptainMessagingWorkspace } from './OpsCaptainMessagingWorkspace';
import {
  getOperationsSupportFlowPreview,
  type DshOperationsSupportFlowId,
} from '../../shared/operations-support.preview';
import {
  findDshControlPanelGovernanceSectionByFlowId,
  getDshControlPanelGovernanceEntry,
  resolveDshControlPanelSectionLabel,
} from '../shared';

type SupportTab = 'queue' | 'customer-360' | 'call-intake' | 'disputes' | 'feedback' | 'escalation' | 'sla-risk' | 'messaging';
type SupportLane = 'الطلبات' | 'الشركاء' | 'الكباتن' | 'الميدان';
type SupportFulfillmentMode = DshFulfillmentDeliveryMode;

type SupportRow = {
  id: string;
  flowId: DshOperationsSupportFlowId;
  registryFlowId?: string;
  surface: string;
  title: string;
  status: string;
  severity: 'danger' | 'warning' | 'success';
  slaAge: string;
  owner: string;
  fulfillmentMode: SupportFulfillmentMode;
  fulfillmentLabel: string;
  responsibleActor: string;
  blocker: string;
  evidence: string;
  nextAction: string;
  recommendation: string;
  governanceSectionLabel: string;
  policyLabel: string;
  forbiddenPreview: string;
  financeReference?: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
};

type SupportRowSeed = {
  id: string;
  flowId: DshOperationsSupportFlowId;
  surface: string;
  status: string;
  slaAge: string;
  fulfillmentMode: SupportFulfillmentMode;
  fulfillmentLabel: string;
  responsibleActor: string;
  evidence: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
};

function resolveSupportModeBadge(mode: SupportFulfillmentMode) {
  if (mode === 'bthwani_delivery') return 'توصيل بثواني';
  if (mode === 'partner_delivery') return 'توصيل المتجر';
  return 'استلام بنفسي';
}

function resolveCommitmentLabel() {
  return 'خطر الالتزام';
}

function resolveSupportPolicyLabel(policy?: string): string {
  if (policy === 'evidence-on-open') {
    return 'أدلة عند الفتح';
  }

  if (policy === 'detail-on-open') {
    return 'تفاصيل عند الفتح';
  }

  if (policy === 'chat-on-open') {
    return 'محادثة عند الفتح';
  }

  if (policy === 'finance-preview-only') {
    return 'مالي للقراءة فقط';
  }

  if (policy === 'summary-only') {
    return 'ملخص أولًا';
  }

  return 'سياسة مرتبطة بالسجل';
}

const SUPPORT_GOVERNANCE = getDshControlPanelGovernanceEntry('support');
const FINANCE_GOVERNANCE = getDshControlPanelGovernanceEntry('finance');

const SUPPORT_REGISTRY_FLOW_MAP: Partial<Record<DshOperationsSupportFlowId, string>> = {
  'delivery-failed': 'client-order-issue',
  'payment-refund-review': 'partner-finance-bridge',
  'courier-not-arrived': 'captain-order-pickup',
  'branch-readiness-escalation': 'field-readiness-escalation',
  'customer-360-review': 'customer-360',
  'manual-call-intake': 'manual-call-intake',
  'assisted-order-desk': 'assisted-order-desk',
  'order-rescue': 'order-rescue',
};

const PRIMARY_TABS: ReadonlyArray<{ id: SupportTab; label: string }> = [
  { id: 'queue', label: 'صفوف الدعم' },
  { id: 'customer-360', label: 'Customer 360' },
  { id: 'call-intake', label: 'Call Intake' },
  { id: 'disputes', label: 'النزاعات' },
  { id: 'feedback', label: 'الآراء' },
  { id: 'escalation', label: 'التصعيد' },
  { id: 'sla-risk', label: resolveCommitmentLabel() },
  { id: 'messaging', label: 'الرسائل' },
];

const SECONDARY_TABS: Record<SupportTab, ReadonlyArray<{ id: string; label: string }>> = {
  queue: [
    { id: 'الكل', label: 'الكل' },
    { id: 'الطلبات', label: 'الطلبات' },
    { id: 'الشركاء', label: 'الشركاء' },
    { id: 'الكباتن', label: 'الكباتن' },
    { id: 'الميدان', label: 'الميدان' },
  ],
  'customer-360': [{ id: 'overview', label: 'نظرة عامة' }],
  'call-intake': [{ id: 'manual', label: 'المكالمات اليدوية' }],
  disputes: [{ id: 'الكل', label: 'الكل' }],
  feedback: [{ id: 'الكل', label: 'الكل' }],
  escalation: [{ id: 'الكل', label: 'الكل' }],
  'sla-risk': [{ id: 'الكل', label: 'الكل' }],
  messaging: [
    { id: 'client', label: 'العملاء' },
    { id: 'partner', label: 'الشركاء' },
    { id: 'captain', label: 'الكباتن' },
  ],
};

function buildSupportRow(seed: SupportRowSeed): SupportRow {
  const preview = getOperationsSupportFlowPreview(seed.flowId);
  const registryFlowId = SUPPORT_REGISTRY_FLOW_MAP[seed.flowId];
  const flowSummary = registryFlowId ? getDshFlowPolicySummary(registryFlowId) : undefined;
  const governanceEntry = registryFlowId ? findDshControlPanelGovernanceSectionByFlowId(registryFlowId) : SUPPORT_GOVERNANCE;
  const governanceSectionLabel = governanceEntry?.sectionLabel ?? resolveDshControlPanelSectionLabel('support');
  const financeReference = flowSummary?.financialImpact ? FINANCE_GOVERNANCE?.financeReference ?? 'wlt-finance' : undefined;
  const forbiddenPreview = (flowSummary?.forbiddenActions ?? preview.forbiddenActions).slice(0, 2).join('، ');

  return {
    id: seed.id,
    flowId: seed.flowId,
    registryFlowId,
    surface: seed.surface,
    title: preview.title,
    status: seed.status,
    severity:
      preview.severity === 'danger'
        ? 'danger'
        : preview.severity === 'warning'
          ? 'warning'
          : 'warning',
    slaAge: seed.slaAge,
    owner: preview.ownerLabel,
    fulfillmentMode: seed.fulfillmentMode,
    fulfillmentLabel: seed.fulfillmentLabel,
    responsibleActor: seed.responsibleActor,
    blocker: preview.description,
    evidence: seed.evidence,
    nextAction: preview.nextAction,
    recommendation: `قسم المتابعة: ${governanceSectionLabel}`,
    governanceSectionLabel,
    policyLabel: resolveSupportPolicyLabel(flowSummary?.onDemandPolicy),
    forbiddenPreview,
    financeReference,
    primaryActionLabel: seed.primaryActionLabel,
    secondaryActionLabel: seed.secondaryActionLabel,
  };
}

const supportRowSeeds = [
  {
    id: 'SUP-401',
    flowId: 'delivery-failed',
    surface: 'الطلبات',
    status: 'نشط',
    slaAge: '15 دقيقة',
    fulfillmentMode: 'bthwani_delivery',
    fulfillmentLabel: 'توصيل بثواني',
    responsibleActor: 'الكابتن',
    evidence: 'سجل رنين + صورة الاستلام',
    primaryActionLabel: 'فتح الطلب',
    secondaryActionLabel: 'فتح الأدلة',
  },
  {
    id: 'SUP-402',
    flowId: 'payment-refund-review',
    surface: 'الشركاء',
    status: 'تحت المراجعة',
    slaAge: '32 دقيقة',
    fulfillmentMode: 'partner_delivery',
    fulfillmentLabel: 'توصيل المتجر',
    responsibleActor: 'موصل الشريك / المتجر',
    evidence: 'نسخة الفاتورة + سجل التحصيل + محضر تسليم موصل الشريك',
    primaryActionLabel: 'مراجعة الشريك',
    secondaryActionLabel: 'فتح الأدلة',
  },
  {
    id: 'SUP-403',
    flowId: 'courier-not-arrived',
    surface: 'الكباتن',
    status: 'تحتاج حل',
    slaAge: '5 دقائق',
    fulfillmentMode: 'bthwani_delivery',
    fulfillmentLabel: 'توصيل بثواني',
    responsibleActor: 'الكابتن',
    evidence: 'مراسلات الدعم + سجل الجهاز',
    primaryActionLabel: 'إسناد بديل',
    secondaryActionLabel: 'فتح التصعيد',
  },
  {
    id: 'SUP-404',
    flowId: 'branch-readiness-escalation',
    surface: 'الميدان',
    status: 'مراقبة',
    slaAge: '47 دقيقة',
    fulfillmentMode: 'pickup',
    fulfillmentLabel: 'استلام بنفسي',
    responsibleActor: 'العميل / المتجر',
    evidence: 'إثبات الموعد + سجل الحضور + تأكيد الجاهزية',
    primaryActionLabel: 'تثبيت الموعد',
    secondaryActionLabel: 'فتح الأدلة',
  },
] satisfies readonly SupportRowSeed[];

const SUPPORT_ROWS: ReadonlyArray<SupportRow> = supportRowSeeds.map(buildSupportRow);

function filterRows(tab: SupportTab, lane: string) {
  if (tab === 'escalation' || tab === 'sla-risk' || tab === 'messaging' || tab === 'customer-360' || tab === 'call-intake') {
    return [];
  }

  return SUPPORT_ROWS.filter((row) => {
    if (tab === 'queue') {
      return lane === 'الكل' || row.surface === lane;
    }

    if (tab === 'disputes') {
      return row.status.includes('مراجعة') || row.status.includes('تحتاج');
    }

    if (tab === 'feedback') {
      return row.surface === 'الطلبات' || row.surface === 'الشركاء';
    }

    return false;
  });
}

export function ControlPanelDshSupportHubScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<SupportTab>('queue');
  const [activeSubTab, setActiveSubTab] = React.useState<string>('الكل');
  const [selectedId, setSelectedId] = React.useState<string>(SUPPORT_ROWS[0]?.id ?? '');

  React.useEffect(() => {
    setActiveSubTab(SECONDARY_TABS[activeTab][0]?.id ?? 'الكل');
  }, [activeTab]);

  const rows = filterRows(activeTab, activeSubTab);
  const selectedRow = rows.find((row) => row.id === selectedId) ?? rows[0] ?? SUPPORT_ROWS[0];
  const selectedFlowPreview = selectedRow ? getOperationsSupportFlowPreview(selectedRow.flowId) : null;
  const selectedRegistrySummary = selectedRow?.registryFlowId ? getDshFlowPolicySummary(selectedRow.registryFlowId) : undefined;
  const selectedFinanceReference = selectedRegistrySummary?.financialImpact ? FINANCE_GOVERNANCE?.financeReference ?? 'wlt-finance' : undefined;
  const primaryMetricValue = activeTab === 'customer-360'
    ? DSH_CUSTOMER_360_PREVIEW.length
    : activeTab === 'call-intake'
      ? DSH_CALL_INTAKE_PREVIEW.length
      : rows.length;

  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.surfaceHeaderIconBox} aria-hidden="true">
            <div className={styles.surfaceHeaderGlyph}>
              <div className={styles.surfaceHeaderGlyphMinus} />
            </div>
          </div>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>دعم DSH</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeTextInverse}>غرفة قيادة</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>صفوف دعم، نزاعات، تصعيد، وخطر الالتزام</p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>صفوف مفتوحة</span>
              <span className={styles.commandKpiValue}>١٧</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>نزاعات</span>
              <span className={`${styles.commandKpiValue} ${styles.commandKpiValueAlert}`}>٩</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>{resolveCommitmentLabel()}</span>
              <span className={`${styles.commandKpiValue} ${styles.commandKpiValueDanger}`}>٣</span>
            </div>
          </div>
        </div>
      </header>

      <WebControlPanelKpiStrip
        items={[
          { id: 'queue', label: activeTab === 'customer-360' ? 'عملاء 360' : activeTab === 'call-intake' ? 'المكالمات اليدوية' : 'صفوف الدعم', value: String(primaryMetricValue), tone: 'neutral' },
          { id: 'selected', label: 'المحدد', value: selectedRow?.id ?? '—', tone: 'warning' },
          { id: 'owner', label: 'قسم الملكية', value: selectedRow?.governanceSectionLabel ?? resolveDshControlPanelSectionLabel('support'), tone: 'success' },
        ]}
      />

      <nav className={styles.navigationDock}>
        <WebControlPanelWorkspaceTabs
          items={PRIMARY_TABS.map((tab) => ({ id: tab.id, label: tab.label, active: tab.id === activeTab }))}
          ariaLabel="صفوف الدعم"
          onSelect={(id) => setActiveTab(id as SupportTab)}
        />
      </nav>

      <div className={`${styles.filterDock} ${styles.filterDockTint}`}>
        <WebControlPanelSubTabs
          items={SECONDARY_TABS[activeTab].map((tab) => ({ id: tab.id, label: tab.label, active: tab.id === activeSubTab }))}
          ariaLabel="فلاتر الدعم"
          onSelect={(id) => setActiveSubTab(id)}
        />
      </div>

      <Box paddingX={4} paddingY={2}>
        <Box style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <Surface tone="inset" padding={3} gap={1} style={{ flexGrow: 1, minWidth: 280 }}>
            <Text role="titleSm">ملكية قسم الدعم</Text>
            <Text role="bodySm" tone="muted">
              {SUPPORT_GOVERNANCE?.notes ?? 'الدعم يملك التذاكر والمحادثات ومتابعة التصعيد عبر نفس الصف.'}
            </Text>
            <Text role="caption" tone="muted">
              {SUPPORT_GOVERNANCE?.onDemandPolicySummary ?? 'IDs وملخصات أولًا، ثم تفاصيل أو أدلة أو محادثات عند الفتح فقط.'}
            </Text>
          </Surface>
          <Surface tone="default" padding={3} gap={1} style={{ flexGrow: 1, minWidth: 280 }}>
            <Text role="titleSm">الصف المحدد</Text>
            <Text role="bodySm" tone="muted">
              {`القسم: ${selectedRow?.governanceSectionLabel ?? 'الدعم'} · السياسة: ${selectedRow?.policyLabel ?? '—'}`}
            </Text>
            <Text role="caption" tone="muted">
              {`الممنوع: ${selectedRow?.forbiddenPreview ?? 'غير محدد'}${selectedFinanceReference ? ` · المرجع المالي: ${selectedFinanceReference}` : ''}`}
            </Text>
          </Surface>
        </Box>
      </Box>

      <main className={styles.surfaceMainPanel}>
        {activeTab === 'customer-360' ? (
          <div className={styles.surfaceInnerScroll}>
            <Customer360Workspace
              onOpenAssistedOrder={() => router.push('/operations?workspace=assisted-order-desk')}
              onOpenOrderRescue={(orderId) => router.push(orderId ? `/operations?workspace=order-rescue&orderId=${orderId}` : '/operations?workspace=order-rescue')}
              onOpenCallIntake={() => setActiveTab('call-intake')}
            />
          </div>
        ) : activeTab === 'call-intake' ? (
          <div className={styles.surfaceInnerScroll}>
            <ManualCallIntakeWorkspace
              onOpenCustomer360={() => setActiveTab('customer-360')}
              onOpenAssistedOrder={() => router.push('/operations?workspace=assisted-order-desk')}
            />
          </div>
        ) : activeTab === 'sla-risk' ? (
          <SupportSlaDashboardScreen />
        ) : activeTab === 'escalation' ? (
          <div className={styles.surfaceInnerScroll}>
            <div className={styles.surfaceSplitGrid}>
              <div className={styles.surfaceListColumn}>
                <SupportEscalationQueueScreen onOpenTicket={(id) => setSelectedId(id)} />
              </div>
              <div className={styles.surfaceInspectorPanel}>
                <SupportTicketDetailWorkspace ticketId={selectedId || undefined} />
              </div>
            </div>
          </div>
        ) : activeTab === 'messaging' ? (
          <div className={styles.surfaceInnerScroll}>
            {activeSubTab === 'partner' ? (
              <OpsPartnerMessagingWorkspace />
            ) : activeSubTab === 'captain' ? (
              <OpsCaptainMessagingWorkspace />
            ) : (
              <OpsClientMessagingWorkspace />
            )}
          </div>
        ) : (
          <div className={styles.surfaceInnerScroll}>
            <div className={styles.surfaceSplitGrid}>
              <div className={styles.surfaceListColumn}>
                <Text role="titleSm">صفوف {activeTab === 'queue' ? 'الدعم' : activeTab === 'disputes' ? 'النزاعات' : 'الآراء'}</Text>
                <Box gap={2}>
                  {rows.map((row) => (
                    <WebControlPanelDecisionRow
                      key={row.id}
                      entityId={row.id}
                      entityLabel={`${row.surface} · ${row.title}`}
                      status={row.status}
                      statusTone={row.severity === 'danger' ? 'danger' : row.severity === 'warning' ? 'warning' : 'success'}
                      risk={row.severity === 'danger' ? 'danger' : row.severity === 'warning' ? 'warning' : 'neutral'}
                      recommendation={row.recommendation}
                      reason={row.blocker}
                      sla={`زمن الالتزام ${row.slaAge} · المالك ${row.owner} · ${resolveSupportModeBadge(row.fulfillmentMode)} · المسؤول ${row.responsibleActor}`}
                      primaryAction={{ id: `${row.id}-primary`, label: row.primaryActionLabel, onAction: () => setSelectedId(row.id) }}
                      secondaryAction={{ id: `${row.id}-secondary`, label: row.secondaryActionLabel, onAction: () => setSelectedId(row.id) }}
                      onInspect={() => setSelectedId(row.id)}
                    />
                  ))}
                </Box>
              </div>

              <div className={styles.surfaceInspectorPanel}>
                <Text role="titleSm">تفاصيل {selectedRow?.id ?? ''}</Text>
                <Box gap={2}>
                  <div className={styles.surfaceInspectorMeta}>
                    <Text role="caption" tone="muted">السطح: {selectedRow?.surface}</Text>
                    <Text role="caption" tone="muted">المالك: {selectedRow?.owner}</Text>
                    <Text role="caption" tone="muted">قسم الحوكمة: {selectedRow?.governanceSectionLabel ?? 'الدعم'}</Text>
                    <Text role="caption" tone="muted">مالك التصعيد: {selectedFlowPreview?.escalationOwnerLabel ?? '—'}</Text>
                    <Text role="caption" tone="muted">سياسة العرض: {selectedRow?.policyLabel ?? '—'}</Text>
                    <Text role="caption" tone="muted">وضع التنفيذ: {selectedRow?.fulfillmentLabel}</Text>
                    <Text role="caption" tone="muted">المسؤول الحالي: {selectedRow?.responsibleActor}</Text>
                    <Text role="caption" tone="muted">العائق: {selectedRow?.blocker}</Text>
                    <Text role="caption" tone="muted">الدليل: {selectedRow?.evidence}</Text>
                    <Text role="caption" tone="muted">الإجراء التالي: {selectedRow?.nextAction}</Text>
                    <Text role="caption" tone="muted">الممنوع: {selectedRow?.forbiddenPreview ?? 'غير محدد'}</Text>
                    {selectedFlowPreview?.financialImpactPreview ? (
                      <Text role="caption" tone="muted">WLT Preview: {selectedFlowPreview.financialImpactPreview}</Text>
                    ) : null}
                    {selectedFinanceReference ? (
                      <Text role="caption" tone="muted">مرجع ledger: {selectedFinanceReference}</Text>
                    ) : null}
                  </div>
                  <WebControlPanelRecommendation
                    title="توصية الدعم"
                    reason={selectedRow ? `لماذا؟ ${selectedRow.recommendation} · ما السياسة؟ ${selectedRow.policyLabel} · ما الدليل؟ ${selectedRow.evidence} · ما القرار التالي؟ ${selectedRegistrySummary?.nextPolicyActionPreview ?? selectedRow.nextAction}` : 'اختر صفًا.'}
                    confidence="high"
                    auditTag={selectedRow?.registryFlowId ?? selectedFlowPreview?.flowId ?? selectedRow?.owner ?? 'support'}
                    primaryAction={selectedRow ? { id: `${selectedRow.id}-a`, label: selectedRow.primaryActionLabel } : undefined}
                    secondaryAction={selectedRow ? { id: `${selectedRow.id}-b`, label: selectedRow.secondaryActionLabel } : undefined}
                  />
                  <WebControlPanelActionCluster
                    primary={{ id: 'open-queue', label: 'فتح التذكرة' }}
                    secondary={{ id: 'open-evidence', label: 'فتح الأدلة عند الطلب' }}
                  />
                </Box>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export function ControlPanelDshSupportQueueScreen() {
  return <ControlPanelDshSupportHubScreen />;
}

export function ControlPanelDshDisputeResolutionScreen() {
  return <ControlPanelDshSupportHubScreen />;
}

export default ControlPanelDshSupportQueueScreen;
