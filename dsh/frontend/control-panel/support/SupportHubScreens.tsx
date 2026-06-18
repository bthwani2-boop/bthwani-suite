'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Surface, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelActionCluster,
  WebControlPanelDecisionRow,
  WebControlPanelRecommendation,
  WebControlPanelKpiStrip,
  WebControlPanelSubTabs,
  WebControlPanelWorkspaceTabs,
} from '@bthwani/ui-kit/web';
import styles from '../shared/control-panel-surface.module.css';
import type { DshFulfillmentDeliveryMode } from '../../shared/delivery/delivery.contract';
import { getDshFlowPolicySummary, resolveDshOnDemandPolicyLabel } from '../../shared/runtime/dsh-flow-registry';
// SSoT: delivery mode labels come from dsh-delivery-mode.model, not inline strings.
import { getDshDeliveryModeDefinition } from '../../shared';
import { buildOperationsHref } from '../operations/operations.registry';
import { SupportEscalationQueueScreen } from './SupportEscalationQueueScreen';
import { SupportSlaDashboardScreen } from './SupportSlaDashboardScreen';
import { SupportTicketDetailWorkspace } from './SupportTicketDetailWorkspace';
import { Customer360Workspace } from './Customer360Workspace';
import { ManualCallIntakeWorkspace } from './ManualCallIntakeWorkspace';
import { OpsClientMessagingWorkspace } from './OpsClientMessagingWorkspace';
import { OpsPartnerMessagingWorkspace } from './OpsPartnerMessagingWorkspace';
import { OpsCaptainMessagingWorkspace } from './OpsCaptainMessagingWorkspace';
import {
  findDshControlPanelGovernanceSectionByFlowId,
  getDshControlPanelGovernanceEntry,
  resolveDshControlPanelSectionLabel,
} from '../shared';
import {
  SUPPORT_PRIMARY_TABS,
  SUPPORT_SECONDARY_TABS,
  SUPPORT_TAB_WORKSPACE_MAP,
  getOperationsSupportFlowSpec,
  type DshOperationsSupportFlowId,
  type SupportTab,
} from './support.types';

type DshControlPanelSupportRow = {
  id: string;
  flowId: DshOperationsSupportFlowId;
  surface: string;
  status: string;
  slaAge: string;
  fulfillmentMode: DshFulfillmentDeliveryMode;
  fulfillmentLabel: string;
  responsibleActor: string;
  evidence: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
};
const DSH_CALL_INTAKE_STUBS: unknown[] = [];
const DSH_CONTROL_PANEL_SUPPORT_ROW_SEEDS: DshControlPanelSupportRow[] = [];
const DSH_CUSTOMER_360_STUBS: unknown[] = [];

type SupportFulfillmentMode = DshFulfillmentDeliveryMode;

type SupportRouteContext = {
  customerId?: string;
  orderId?: string;
  ticketId?: string;
  callId?: string;
};

type SupportRowKey = string;
type SupportRowDisplay = string;

type SupportRow = {
  id: SupportRowKey;
  flowId: DshOperationsSupportFlowId;
  registryFlowId?: string;
  surface: string;
  title: SupportRowDisplay;
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

// SSoT: mode labels from dsh-delivery-mode.model — no inline strings.
function resolveSupportModeBadge(mode: SupportFulfillmentMode) {
  return getDshDeliveryModeDefinition(mode as DshFulfillmentDeliveryMode).label;
}

function resolveCommitmentLabel() {
  return 'خطر الالتزام';
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

function resolveSupportTabFromWorkspace(workspace?: string | null): SupportTab {
  if (workspace === 'customer-360') {
    return 'customer-360';
  }

  if (workspace === 'call-intake') {
    return 'call-intake';
  }

  if (workspace === 'escalation') {
    return 'escalation';
  }

  if (workspace === 'sla-risk') {
    return 'sla-risk';
  }

  if (workspace === 'messaging') {
    return 'messaging';
  }

  return 'queue';
}

function buildSupportHref(tab: SupportTab, context?: SupportRouteContext) {
  const searchParams = new globalThis.URLSearchParams();
  const workspace = SUPPORT_TAB_WORKSPACE_MAP[tab];

  if (workspace && workspace !== 'queue') {
    searchParams.set('workspace', workspace);
  } else if (workspace === 'queue') {
    searchParams.set('workspace', 'queue');
  }

  if (context?.customerId) {
    searchParams.set('customerId', context.customerId);
  }

  if (context?.orderId) {
    searchParams.set('orderId', context.orderId);
  }

  if (context?.ticketId) {
    searchParams.set('ticketId', context.ticketId);
  }

  if (context?.callId) {
    searchParams.set('callId', context.callId);
  }

  return `/support?${searchParams.toString()}`;
}

function buildSupportRow(rowData: DshControlPanelSupportRow): SupportRow {
  const flowEntry = getOperationsSupportFlowSpec(rowData.flowId);
  const registryFlowId = SUPPORT_REGISTRY_FLOW_MAP[rowData.flowId];
  const flowSummary = registryFlowId ? getDshFlowPolicySummary(registryFlowId) : undefined;
  const governanceEntry = registryFlowId ? findDshControlPanelGovernanceSectionByFlowId(registryFlowId) : SUPPORT_GOVERNANCE;
  const governanceSectionLabel = governanceEntry?.sectionLabel ?? resolveDshControlPanelSectionLabel('support');
  const financeReference = flowSummary?.financialImpact ? FINANCE_GOVERNANCE?.financeReference ?? 'wlt-finance' : undefined;
  const forbiddenPreview = (flowSummary?.forbiddenActions ?? flowEntry.forbiddenActions).slice(0, 2).join('، ');

  return {
    id: rowData.id,
    flowId: rowData.flowId,
    registryFlowId,
    surface: rowData.surface,
    title: flowEntry.title,
    status: rowData.status,
    severity:
      flowEntry.severity === 'danger'
        ? 'danger'
        : flowEntry.severity === 'warning'
          ? 'warning'
          : flowEntry.severity === 'success'
            ? 'success'
            : 'warning',
    slaAge: rowData.slaAge,
    owner: flowEntry.ownerLabel,
    fulfillmentMode: rowData.fulfillmentMode,
    fulfillmentLabel: rowData.fulfillmentLabel,
    responsibleActor: rowData.responsibleActor,
    blocker: flowEntry.description,
    evidence: rowData.evidence,
    nextAction: flowEntry.nextAction,
    recommendation: `قسم المتابعة: ${governanceSectionLabel}`,
    governanceSectionLabel,
    policyLabel: resolveDshOnDemandPolicyLabel(flowSummary?.onDemandPolicy),
    forbiddenPreview,
    financeReference,
    primaryActionLabel: rowData.primaryActionLabel,
    secondaryActionLabel: rowData.secondaryActionLabel,
  };
}

const SUPPORT_ROWS: ReadonlyArray<SupportRow> = DSH_CONTROL_PANEL_SUPPORT_ROW_SEEDS.map(buildSupportRow);

function filterRows(tab: SupportTab, lane: string) {
  if (tab !== 'queue') {
    return [];
  }

  return SUPPORT_ROWS.filter((row) => {
    if (lane === 'الكل') {
      return true;
    }

    if (lane === 'النزاعات والاعتراضات') {
      return row.status.includes('مراجعة') || row.status.includes('تحتاج');
    }

    if (lane === 'الآراء والتقييمات') {
      return row.surface === 'الطلبات' || row.surface === 'الشركاء';
    }

    return row.surface === lane;
  });
}

export function ControlPanelDshSupportHubScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = React.useState<SupportTab>('queue');
  const [activeSubTab, setActiveSubTab] = React.useState<string>('الكل');
  const [selectedId, setSelectedId] = React.useState<string>(SUPPORT_ROWS[0]?.id ?? '');

  React.useEffect(() => {
    const resolvedTab = resolveSupportTabFromWorkspace(searchParams.get('workspace'));
    setActiveTab(resolvedTab);
    setActiveSubTab(SUPPORT_SECONDARY_TABS[resolvedTab][0]?.id ?? 'الكل');

    const ticketId = searchParams.get('ticketId');
    if (ticketId) {
      setSelectedId(ticketId);
    }
  }, [searchParams]);

  React.useEffect(() => {
    setActiveSubTab(SUPPORT_SECONDARY_TABS[activeTab][0]?.id ?? 'الكل');
  }, [activeTab]);

  const rows = filterRows(activeTab, activeSubTab);
  const selectedRow = rows.find((row) => row.id === selectedId) ?? rows[0] ?? SUPPORT_ROWS[0];
  const selectedFlowSpec = selectedRow ? getOperationsSupportFlowSpec(selectedRow.flowId) : null;
  const selectedRegistrySummary = selectedRow?.registryFlowId ? getDshFlowPolicySummary(selectedRow.registryFlowId) : undefined;
  const selectedFinanceReference = selectedRegistrySummary?.financialImpact ? FINANCE_GOVERNANCE?.financeReference ?? 'wlt-finance' : undefined;
  const primaryMetricValue = activeTab === 'customer-360'
    ? DSH_CUSTOMER_360_STUBS.length
    : activeTab === 'call-intake'
      ? DSH_CALL_INTAKE_STUBS.length
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
          items={SUPPORT_PRIMARY_TABS.map((tab) => ({ id: tab.id, label: tab.label, active: tab.id === activeTab }))}
          ariaLabel="صفوف الدعم"
          onSelect={(id) => {
            const nextTab = id as SupportTab;
            setActiveTab(nextTab);
            router.push(
              buildSupportHref(nextTab, {
                customerId: searchParams.get('customerId') ?? undefined,
                orderId: searchParams.get('orderId') ?? undefined,
                ticketId: searchParams.get('ticketId') ?? undefined,
                callId: searchParams.get('callId') ?? undefined,
              }),
            );
          }}
        />
      </nav>

      <div className={`${styles.filterDock} ${styles.filterDockTint}`}>
        <WebControlPanelSubTabs
          items={SUPPORT_SECONDARY_TABS[activeTab].map((tab) => ({ id: tab.id, label: tab.label, active: tab.id === activeSubTab }))}
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
              onOpenAssistedOrder={(context) =>
                router.push(
                  buildOperationsHref('assisted-order-desk', {
                    customerId: context.customerId,
                    orderId: context.orderId,
                    ticketId: context.ticketId,
                  }),
                )
              }
              onOpenOrderRescue={(context) =>
                router.push(
                  buildOperationsHref('order-rescue', {
                    customerId: context.customerId,
                    orderId: context.orderId,
                    ticketId: context.ticketId,
                  }),
                )
              }
              onOpenCallIntake={(context) =>
                router.push(
                  buildSupportHref('call-intake', {
                    customerId: context.customerId,
                    orderId: context.orderId,
                    ticketId: context.ticketId,
                  }),
                )
              }
            />
          </div>
        ) : activeTab === 'call-intake' ? (
          <div className={styles.surfaceInnerScroll}>
            <ManualCallIntakeWorkspace
              onOpenCustomer360={(context) =>
                router.push(
                  buildSupportHref('customer-360', {
                    customerId: context.customerId,
                    orderId: context.orderId,
                    ticketId: context.ticketId,
                    callId: context.intakeId,
                  }),
                )
              }
              onOpenAssistedOrder={(context) =>
                router.push(
                  buildOperationsHref('assisted-order-desk', {
                    customerId: context.customerId,
                    orderId: context.orderId,
                    ticketId: context.ticketId,
                    callId: context.intakeId,
                  }),
                )
              }
              onOpenOrderRescue={(context) =>
                router.push(
                  buildOperationsHref('order-rescue', {
                    customerId: context.customerId,
                    orderId: context.orderId,
                    ticketId: context.ticketId,
                    callId: context.intakeId,
                  }),
                )
              }
              onOpenSupportEscalation={(context) =>
                router.push(
                  buildSupportHref('escalation', {
                    customerId: context.customerId,
                    orderId: context.orderId,
                    ticketId: context.ticketId,
                    callId: context.intakeId,
                  }),
                )
              }
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
                {rows.length === 0 ? (
                  <Box padding={4} background="surfaceInset" radiusToken="xl" border borderTone="line">
                    <Text role="bodySm" tone="muted" align="center">لا توجد عناصر في هذا الفلتر. اختر فلترًا آخر أو تحقق لاحقًا.</Text>
                  </Box>
                ) : null}
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
                    <Text role="caption" tone="muted">مالك التصعيد: {selectedFlowSpec?.escalationOwnerLabel ?? '—'}</Text>
                    <Text role="caption" tone="muted">سياسة العرض: {selectedRow?.policyLabel ?? '—'}</Text>
                    <Text role="caption" tone="muted">وضع التنفيذ: {selectedRow?.fulfillmentLabel}</Text>
                    <Text role="caption" tone="muted">المسؤول الحالي: {selectedRow?.responsibleActor}</Text>
                    <Text role="caption" tone="muted">العائق: {selectedRow?.blocker}</Text>
                    <Text role="caption" tone="muted">الدليل: {selectedRow?.evidence}</Text>
                    <Text role="caption" tone="muted">الإجراء التالي: {selectedRow?.nextAction}</Text>
                    <Text role="caption" tone="muted">الممنوع: {selectedRow?.forbiddenPreview ?? 'غير محدد'}</Text>
                    {selectedFlowSpec?.financialImpactRef ? (
                      <Text role="caption" tone="muted">WLT Preview: {selectedFlowSpec.financialImpactRef}</Text>
                    ) : null}
                    {selectedFinanceReference ? (
                      <Text role="caption" tone="muted">مرجع ledger: {selectedFinanceReference}</Text>
                    ) : null}
                  </div>
                  <WebControlPanelRecommendation
                    title="توصية الدعم"
                    reason={selectedRow ? `لماذا؟ ${selectedRow.recommendation} · ما السياسة؟ ${selectedRow.policyLabel} · ما الدليل؟ ${selectedRow.evidence} · ما القرار التالي؟ ${selectedRegistrySummary?.nextPolicyActionPreview ?? selectedRow.nextAction}` : 'اختر صفًا.'}
                    confidence="high"
                    auditTag={selectedRow?.registryFlowId ?? selectedFlowSpec?.flowId ?? selectedRow?.owner ?? 'support'}
                    primaryAction={
                      selectedRow
                        ? {
                            id: `${selectedRow.id}-a`,
                            label: selectedRow.primaryActionLabel,
                            onAction: () => setSelectedId(selectedRow.id),
                          }
                        : undefined
                    }
                    secondaryAction={
                      selectedRow
                        ? {
                            id: `${selectedRow.id}-b`,
                            label: selectedRow.secondaryActionLabel,
                            onAction: () =>
                              router.push(
                                buildSupportHref('escalation', {
                                  ticketId: selectedRow.id,
                                  customerId: searchParams.get('customerId') ?? undefined,
                                  orderId: searchParams.get('orderId') ?? undefined,
                                  callId: searchParams.get('callId') ?? undefined,
                                }),
                              ),
                          }
                        : undefined
                    }
                  />
                  <WebControlPanelActionCluster
                    primary={{
                      id: 'open-queue',
                      label: 'فتح التذكرة',
                      onAction: () => setSelectedId(selectedRow?.id ?? SUPPORT_ROWS[0]?.id ?? ''),
                    }}
                    secondary={{
                      id: 'open-evidence',
                      label: 'فتح الأدلة عند الطلب',
                      onAction: () =>
                        router.push(
                          buildSupportHref('escalation', {
                            ticketId: selectedRow?.id,
                            customerId: searchParams.get('customerId') ?? undefined,
                            orderId: searchParams.get('orderId') ?? undefined,
                            callId: searchParams.get('callId') ?? undefined,
                          }),
                        ),
                    }}
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
