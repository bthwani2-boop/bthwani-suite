'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  WebControlPanelKpiStrip,
  WebControlPanelDecisionRow,
  WebControlPanelSplitPane,
  WebControlPanelQueue,
  WebControlPanelInspectorShell,
  WebControlPanelStatusTag,
} from '@bthwani/ui-kit/web';
import {
  EXCEPTIONS_ESCALATIONS_OPERATIONAL_PREVIEW,
  DSH_ORDER_RESCUE_PREVIEW,
} from '../../data/orders.preview-data';
import { EXCEPTION_TICKET_MAP } from '../../shared/dsh-order-preview.contract';
import { DSH_OPS_INTERVENTION_PLAYBOOKS } from '../../data/support.preview-data';
import { Box, KeyValueList } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';
import { buildOperationsHref } from './operations.registry';
import {
  getDshEscalationFlowsForSurface,
  getDshFinancePreviewFlows,
  getDshFlowPolicySummary,
  getDshRenderableFlowsForSurface,
  type DshFlowRegistryEntry,
} from '../../shared/dsh-flow-registry';
import { findDshControlPanelGovernanceSectionByFlowId } from '../shared/dsh-control-panel-governance.map';

export type ExceptionsEscalationsScreenProps = { hubHref: string; subGroup?: string; };

type WorkspaceFilterId = 'all' | 'mobile-owned' | 'finance-preview' | 'hidden-compat' | 'control-policy';
type SelectedItem =
  | { type: 'exception'; id: string }
  | { type: 'flow'; id: string }
  | { type: 'rescue'; id: string }
  | { type: 'playbook'; id: string }
  | null;

const TONE_MAP: Record<string, 'neutral' | 'success' | 'warning' | 'danger'> = {
  warning: 'warning',
  danger: 'danger',
  best: 'success',
  brand: 'neutral',
};

const WORKSPACE_FILTERS: ReadonlyArray<{ id: WorkspaceFilterId; label: string }> = [
  { id: 'all', label: 'الكل' },
  { id: 'mobile-owned', label: 'mobile-owned' },
  { id: 'finance-preview', label: 'finance-preview' },
  { id: 'hidden-compat', label: 'hidden-compat' },
  { id: 'control-policy', label: 'control-policy' },
];

const SURFACE_LABELS: Record<string, string> = {
  'app-client': 'العميل',
  'app-partner': 'الشريك',
  'app-captain': 'الكابتن',
  'app-field': 'الميداني',
  'control-panel': 'لوحة التحكم',
  'wlt-finance': 'WLT المالية',
};

const DOMAIN_LABELS: Record<string, string> = {
  'order-lifecycle': 'دورة الطلب',
  'cart-checkout': 'السلة والدفع',
  tracking: 'التتبع',
  'delivery-mode': 'وضع التنفيذ',
  'partner-operations': 'تشغيل الشريك',
  'captain-operations': 'تشغيل الكابتن',
  'field-onboarding': 'ضم المتاجر',
  'catalog-inventory': 'الكتالوج والمخزون',
  'support-escalation': 'الدعم والتصعيد',
  'chat-conversation': 'المحادثات',
  'cancellation-rejection': 'الإلغاء والرفض',
  'finance-preview': 'مالي للقراءة فقط',
  'control-policy': 'سياسة التحكم',
};

const VISIBILITY_LABELS: Record<string, string> = {
  primary: 'أساسي',
  contextual: 'سياقي',
  'escalation-only': 'تصعيد فقط',
  'hidden-compat': 'توافقي مخفي',
  internal: 'داخلي',
  disabled: 'معطل',
};

const POLICY_LABELS: Record<string, string> = {
  'summary-only': 'ملخص أولًا',
  'detail-on-open': 'تفاصيل عند الفتح',
  'evidence-on-open': 'أدلة عند الفتح',
  'chat-on-open': 'دردشة عند الفتح',
  'finance-preview-only': 'مالي للقراءة فقط',
};

function byWorkspacePriority(a: DshFlowRegistryEntry, b: DshFlowRegistryEntry) {
  const aHidden = a.hiddenCompat === true || a.visibility === 'hidden-compat' ? 1 : 0;
  const bHidden = b.hiddenCompat === true || b.visibility === 'hidden-compat' ? 1 : 0;
  if (aHidden !== bHidden) {
    return aHidden - bHidden;
  }

  const aOwner = a.ownerSurface === 'control-panel' ? 0 : 1;
  const bOwner = b.ownerSurface === 'control-panel' ? 0 : 1;
  if (aOwner !== bOwner) {
    return aOwner - bOwner;
  }

  return a.label.localeCompare(b.label, 'ar');
}

export function ExceptionsEscalationsScreen({
  hubHref: _hubHref,
  subGroup: _subGroup,
}: ExceptionsEscalationsScreenProps) {
  const router = useRouter();
  const preview = EXCEPTIONS_ESCALATIONS_OPERATIONAL_PREVIEW;
  const [filterId, setFilterId] = React.useState<WorkspaceFilterId>('all');
  const [selectedItemId, setSelectedItemId] = React.useState<SelectedItem>(null);

  const escalationWorkspaceFlows = React.useMemo(
    () => [...getDshEscalationFlowsForSurface('control-panel')].sort(byWorkspacePriority),
    [],
  );
  const renderableControlFlows = React.useMemo(
    () => getDshRenderableFlowsForSurface('control-panel'),
    [],
  );
  const financePreviewFlowIds = React.useMemo(
    () => new Set(getDshFinancePreviewFlows().map((flow) => flow.id)),
    [],
  );
  const filteredFlows = React.useMemo(() => {
    if (filterId === 'mobile-owned') {
      return escalationWorkspaceFlows.filter((flow) => (
        flow.ownerSurface === 'app-client' || flow.ownerSurface === 'app-captain' || flow.ownerSurface === 'app-field'
      ));
    }

    if (filterId === 'finance-preview') {
      return escalationWorkspaceFlows.filter((flow) => financePreviewFlowIds.has(flow.id));
    }

    if (filterId === 'hidden-compat') {
      return escalationWorkspaceFlows.filter((flow) => flow.hiddenCompat === true || flow.visibility === 'hidden-compat');
    }

    if (filterId === 'control-policy') {
      return escalationWorkspaceFlows.filter((flow) => flow.ownerSurface === 'control-panel' || flow.domain === 'control-policy');
    }

    return escalationWorkspaceFlows;
  }, [escalationWorkspaceFlows, filterId, financePreviewFlowIds]);

  const summaryKpi = [
    { id: 'open', label: 'مفتوحة', value: String(preview.summary.open), tone: 'danger' as const },
    { id: 'escalate', label: 'تصعيد', value: String(preview.summary.escalate), tone: 'warning' as const },
    { id: 'resolve', label: 'حل', value: String(preview.summary.resolve), tone: 'neutral' as const },
    { id: 'close', label: 'إغلاق', value: String(preview.summary.close), tone: 'success' as const },
  ];

  // Selected details lookup
  let inspectorContent: React.ReactNode = null;
  if (selectedItemId) {
    if (selectedItemId.type === 'exception') {
      const exc = preview.exceptions.find((e) => e.id === selectedItemId.id);
      if (exc) {
        const linkage = EXCEPTION_TICKET_MAP[exc.id];
        const supportTicketId = linkage?.supportTicketId ?? `UNPROVEN-${exc.id}`;
        const auditEntryId = linkage?.auditEntryId;
        const statusTone = TONE_MAP[exc.statusTone] ?? 'neutral';

        inspectorContent = (
          <WebControlPanelInspectorShell
            title={`تفاصيل الاستثناء — ${exc.id}`}
            onClose={() => setSelectedItemId(null)}
          >
            <Box gap={3} padding={2} style={{ overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800 }}>الخطورة:</span>
                <WebControlPanelStatusTag label={exc.severity} tone={statusTone} />
              </div>

              <KeyValueList
                items={[
                  { label: 'النوع', value: exc.type },
                  { label: 'السطح المتأثر', value: SURFACE_LABELS[exc.affectedSurface] ?? exc.affectedSurface },
                  { label: 'طابور المالك', value: exc.ownerQueue },
                  { label: 'المالك الحالي', value: exc.currentOwner },
                  { label: 'وقت البدء', value: exc.startTime },
                  { label: 'الإجراء الأخير', value: exc.lastAction },
                  { label: 'الإجراء المقترح', value: exc.suggestedAction },
                  { label: 'تذكرة الدعم المرتبطة', value: supportTicketId },
                  { label: 'سجل التدقيق المرتبط', value: auditEntryId ?? 'غير مربوط' },
                ]}
              />

              <div style={{ background: 'var(--bthwani-control-panel-surface-inset)', padding: '8px 12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', color: 'var(--bthwani-control-panel-text-muted)' }}>ملاحظة العمليات:</div>
                <div style={{ fontSize: '12px', color: 'var(--bthwani-control-panel-text)', marginTop: '2px' }}>{exc.note}</div>
              </div>

              <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: 'var(--bthwani-control-panel-brand)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '11px',
                  }}
                  onClick={() => router.push(exc.routeHint)}
                >
                  {exc.resolutionPath === 'حل' ? 'حل الاستثناء' : 'تصعيد'}
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: 'transparent',
                    border: '1px solid var(--bthwani-control-panel-border-strong)',
                    color: 'var(--bthwani-control-panel-text)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '11px',
                  }}
                  onClick={() =>
                    router.push(
                      auditEntryId
                        ? buildOperationsHref('audit-support-sla', { orderId: auditEntryId })
                        : buildOperationsHref('audit-support-sla', { orderId: supportTicketId })
                    )
                  }
                >
                  {auditEntryId ? 'فتح التدقيق' : 'فتح تذكرة الدعم'}
                </button>
              </div>
            </Box>
          </WebControlPanelInspectorShell>
        );
      }
    } else if (selectedItemId.type === 'flow') {
      const flow = escalationWorkspaceFlows.find((f) => f.id === selectedItemId.id);
      if (flow) {
        const summary = getDshFlowPolicySummary(flow.id);
        const governance = findDshControlPanelGovernanceSectionByFlowId(flow.id);

        inspectorContent = (
          <WebControlPanelInspectorShell
            title={`سياسة التدفق — ${flow.id}`}
            onClose={() => setSelectedItemId(null)}
          >
            <Box gap={3} padding={2} style={{ overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800 }}>الظهور:</span>
                <WebControlPanelStatusTag label={VISIBILITY_LABELS[flow.visibility]} tone="neutral" />
              </div>

              <KeyValueList
                items={[
                  { label: 'التدفق', value: flow.label },
                  { label: 'السطح المالك', value: SURFACE_LABELS[flow.ownerSurface] ?? flow.ownerSurface },
                  { label: 'القسم المالك (حوكمة)', value: governance?.sectionLabel ?? 'عمليات / دعم حسب السياق' },
                  { label: 'المجال', value: DOMAIN_LABELS[flow.domain] ?? flow.domain },
                  { label: 'سياسة المعاينة', value: POLICY_LABELS[flow.onDemandPolicy] ?? flow.onDemandPolicy },
                  { label: 'الأثر المالي', value: flow.financialImpact ? 'نعم (عرض فقط)' : 'لا يوجد' },
                ]}
              />

              {summary && (
                <>
                  <div style={{ background: 'var(--bthwani-control-panel-surface-inset)', padding: '8px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--bthwani-control-panel-text-muted)' }}>الإجراءات المسموحة:</div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {summary.allowedActions.map((act) => (
                        <span key={act} style={{ fontSize: '10px', background: 'var(--bthwani-success-surface)', color: 'var(--bthwani-success-text)', padding: '2px 6px', borderRadius: '4px' }}>{act}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bthwani-control-panel-surface-inset)', padding: '8px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--bthwani-control-panel-text-muted)' }}>الإجراءات الممنوعة:</div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {summary.forbiddenActions.map((act) => (
                        <span key={act} style={{ fontSize: '10px', background: 'var(--bthwani-danger-surface)', color: 'var(--bthwani-danger-text)', padding: '2px 6px', borderRadius: '4px' }}>{act}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bthwani-control-panel-surface-inset)', padding: '8px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--bthwani-control-panel-text-muted)' }}>معاينة السياسة:</div>
                    <div style={{ fontSize: '11px', color: 'var(--bthwani-control-panel-text)', marginTop: '2px', fontWeight: 600 }}>{summary.nextPolicyActionPreview}</div>
                  </div>
                </>
              )}

              {governance && (
                <div style={{ background: 'var(--bthwani-control-panel-surface-inset)', padding: '8px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--bthwani-control-panel-text-muted)' }}>تعليمات الحوكمة:</div>
                  <div style={{ fontSize: '11px', color: 'var(--bthwani-control-panel-text)', marginTop: '2px' }}>{governance.notes}</div>
                </div>
              )}
            </Box>
          </WebControlPanelInspectorShell>
        );
      }
    } else if (selectedItemId.type === 'rescue') {
      const item = DSH_ORDER_RESCUE_PREVIEW.find((r) => r.rescueId === selectedItemId.id);
      if (item) {
        inspectorContent = (
          <WebControlPanelInspectorShell
            title={`تفاصيل Order Rescue — ${item.orderId}`}
            onClose={() => setSelectedItemId(null)}
          >
            <Box gap={3} padding={2} style={{ overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800 }}>حالة المشكلة:</span>
                <WebControlPanelStatusTag label={item.issueKind} tone={item.severity === 'danger' ? 'danger' : 'warning'} />
              </div>

              <KeyValueList
                items={[
                  { label: 'رقم الطلب', value: item.orderId },
                  { label: 'العميل', value: item.customerName },
                  { label: 'العائق التشغيلي', value: item.blocker },
                  { label: 'الإجراء المالي المقترح', value: item.wltBoundary },
                  { label: 'الإجراء المقترح التالي', value: item.nextBestAction },
                ]}
              />

              <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: 'var(--bthwani-control-panel-brand)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '11px',
                  }}
                  onClick={() => router.push(buildOperationsHref('order-rescue', { orderId: item.orderId }))}
                >
                  فتح Order Rescue
                </button>
              </div>
            </Box>
          </WebControlPanelInspectorShell>
        );
      }
    } else if (selectedItemId.type === 'playbook') {
      const playbook = DSH_OPS_INTERVENTION_PLAYBOOKS.find((p) => p.playbookId === selectedItemId.id);
      if (playbook) {
        inspectorContent = (
          <WebControlPanelInspectorShell
            title={`Playbook — ${playbook.playbookId}`}
            onClose={() => setSelectedItemId(null)}
          >
            <Box gap={3} padding={2} style={{ overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800 }}>القسم المالك:</span>
                <WebControlPanelStatusTag label={playbook.ownerSection} tone={playbook.severity === 'danger' ? 'danger' : 'warning'} />
              </div>

              <KeyValueList
                items={[
                  { label: 'عنوان الدليل', value: playbook.title },
                  { label: 'القرار المقترح التالي', value: playbook.nextDecision },
                  { label: 'المساحات المدعومة', value: playbook.supportedWorkspaces.join(' · ') },
                ]}
              />

              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--bthwani-control-panel-text)', marginBottom: '4px' }}>النقاط المرجعية للتحقق (Checkpoints):</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {playbook.checkpoints.map((item, index) => (
                    <div key={index} style={{ fontSize: '11px', padding: '4px 6px', background: 'var(--bthwani-control-panel-surface-inset)', borderRadius: '4px' }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: 'var(--bthwani-control-panel-brand)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '11px',
                  }}
                  onClick={() =>
                    router.push(
                      buildOperationsHref(
                        playbook.supportedWorkspaces.includes('order-rescue') ? 'order-rescue' : 'assisted-order-desk'
                      )
                    )
                  }
                >
                  {playbook.supportedWorkspaces.includes('order-rescue') ? 'فتح Order Rescue' : 'فتح Assisted Order'}
                </button>
              </div>
            </Box>
          </WebControlPanelInspectorShell>
        );
      }
    }
  }

  return (
    <div className={styles.surfaceCockpitContent} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <WebControlPanelKpiStrip items={summaryKpi} />

      <WebControlPanelSplitPane
        primary={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', paddingRight: '2px', height: '100%' }}>
            {/* 1. Active Exceptions & Escalations Queue */}
            <WebControlPanelQueue
              title="الاستثناءات النشطة"
              meta={`${preview.exceptions.length} استثناءات مفتوحة`}
            >
              {preview.exceptions.map((exc) => {
                const statusTone = TONE_MAP[exc.statusTone] ?? 'neutral';
                return (
                  <WebControlPanelDecisionRow
                    key={exc.id}
                    entityId={exc.id}
                    entityLabel={`${exc.type} | السطح المتأثر: ${SURFACE_LABELS[exc.affectedSurface] ?? exc.affectedSurface}`}
                    status={exc.severity}
                    statusTone={statusTone}
                    risk={exc.statusTone === 'danger' ? 'danger' : exc.statusTone === 'warning' ? 'warning' : 'neutral'}
                    recommendation={exc.suggestedAction}
                    sla={`البداية: ${exc.startTime} | المالك الحالي: ${exc.currentOwner}`}
                    onInspect={() => setSelectedItemId({ type: 'exception', id: exc.id })}
                    primaryAction={{
                      id: `${exc.id}-action`,
                      label: exc.resolutionPath === 'حل' ? 'حل الاستثناء' : 'تصعيد',
                      onAction: () => router.push(exc.routeHint),
                    }}
                  />
                );
              })}
            </WebControlPanelQueue>

            {/* 2. Playbooks & Rescue Queue */}
            <WebControlPanelQueue title="Playbooks وOrder Rescue" meta="توجيه الإجراء السريع">
              {DSH_ORDER_RESCUE_PREVIEW.map((item) => (
                <WebControlPanelDecisionRow
                  key={item.rescueId}
                  entityId={item.orderId}
                  entityLabel={`Order Rescue | العميل: ${item.customerName} | العائق: ${item.blocker}`}
                  status={item.issueKind}
                  statusTone={item.severity === 'danger' ? 'danger' : 'warning'}
                  sla={item.wltBoundary}
                  onInspect={() => setSelectedItemId({ type: 'rescue', id: item.rescueId })}
                  primaryAction={{
                    id: `${item.rescueId}-open`,
                    label: 'فتح Rescue',
                    onAction: () => router.push(buildOperationsHref('order-rescue', { orderId: item.orderId })),
                  }}
                />
              ))}

              {DSH_OPS_INTERVENTION_PLAYBOOKS.map((playbook) => (
                <WebControlPanelDecisionRow
                  key={playbook.playbookId}
                  entityId={playbook.playbookId}
                  entityLabel={`Playbook | ${playbook.title}`}
                  status={playbook.ownerSection}
                  statusTone={playbook.severity === 'danger' ? 'danger' : 'warning'}
                  sla={playbook.nextDecision}
                  onInspect={() => setSelectedItemId({ type: 'playbook', id: playbook.playbookId })}
                  primaryAction={{
                    id: `${playbook.playbookId}-open`,
                    label: playbook.supportedWorkspaces.includes('order-rescue') ? 'فتح Rescue' : 'فتح Assisted',
                    onAction: () => router.push(buildOperationsHref(
                      playbook.supportedWorkspaces.includes('order-rescue') ? 'order-rescue' : 'assisted-order-desk',
                    )),
                  }}
                />
              ))}
            </WebControlPanelQueue>

            {/* 3. Escalation Policy workspace */}
            <WebControlPanelQueue title="سياسات التصعيد والتدفقات" meta="معاينة السياسة المعتمدة">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div className={`${styles.filterDock} ${styles.filterDockTint}`} style={{ padding: '6px 10px', borderRadius: '6px' }}>
                  {WORKSPACE_FILTERS.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      className={`${styles.surfaceTab} ${filterId === filter.id ? styles.surfaceTabActive : ''}`}
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                      onClick={() => setFilterId(filter.id)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {filteredFlows.map((flow) => {
                  const summary = getDshFlowPolicySummary(flow.id);
                  return (
                    <WebControlPanelDecisionRow
                      key={flow.id}
                      entityId={flow.id}
                      entityLabel={flow.label}
                      status={VISIBILITY_LABELS[flow.visibility]}
                      statusTone="neutral"
                      recommendation={summary?.nextPolicyActionPreview}
                      sla={`${SURFACE_LABELS[flow.ownerSurface] ?? flow.ownerSurface} · ${DOMAIN_LABELS[flow.domain] ?? flow.domain}`}
                      onInspect={() => setSelectedItemId({ type: 'flow', id: flow.id })}
                    />
                  );
                })}
              </div>
            </WebControlPanelQueue>

            {/* 4. Central Registry display */}
            <WebControlPanelQueue title="أثر السجل المركزي للتصعيد" meta={`${escalationWorkspaceFlows.length} تدفقًا`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className={styles.escalationCatalogRow} style={{ fontWeight: 800, background: 'var(--bthwani-control-panel-surface-inset)', border: 0 }}>
                  <span className={styles.escalationCatalogId}>مُعرف التدفق</span>
                  <span className={styles.escalationCatalogMeta}>السطح المالك</span>
                  <span className={styles.escalationCatalogDomain}>المجال</span>
                  <span className={styles.escalationCatalogVisibility}>الظهور</span>
                  <span className={styles.escalationCatalogPolicy}>سياسة الطلب</span>
                </div>
                {escalationWorkspaceFlows.map((flow) => (
                  <div key={flow.id} className={styles.escalationCatalogRow}>
                    <span className={styles.escalationCatalogId}>{flow.id}</span>
                    <span className={styles.escalationCatalogMeta}>{SURFACE_LABELS[flow.ownerSurface] ?? flow.ownerSurface}</span>
                    <span className={styles.escalationCatalogDomain}>{DOMAIN_LABELS[flow.domain] ?? flow.domain}</span>
                    <span className={styles.escalationCatalogVisibility}>{VISIBILITY_LABELS[flow.visibility] ?? flow.visibility}</span>
                    <span className={styles.escalationCatalogPolicy}>{POLICY_LABELS[flow.onDemandPolicy] ?? flow.onDemandPolicy}</span>
                    {flow.financialImpact === true && (
                      <span className={styles.escalationCatalogBadgeFinance}>مالي</span>
                    )}
                  </div>
                ))}
              </div>
            </WebControlPanelQueue>
          </div>
        }
        secondary={inspectorContent}
        secondaryWidth="wide"
      />
    </div>
  );
}

export default ExceptionsEscalationsScreen;
