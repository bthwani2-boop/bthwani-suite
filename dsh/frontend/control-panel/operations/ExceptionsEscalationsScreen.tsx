'use client';

import React from 'react';
import {
  WebControlPanelKpiStrip,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import { EXCEPTIONS_ESCALATIONS_OPERATIONAL_PREVIEW } from './operations.preview-data';
import { Box } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';
import {
  getDshEscalationFlowsForSurface,
  getDshFinancePreviewFlows,
  getDshFlowPolicySummary,
  getDshRenderableFlowsForSurface,
  type DshFlowRegistryEntry,
} from '../../shared/dsh-flow-registry';

export type ExceptionsEscalationsScreenProps = { hubHref: string; subGroup?: string; };

type WorkspaceFilterId = 'all' | 'mobile-owned' | 'finance-preview' | 'hidden-compat' | 'control-policy';

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
  const preview = EXCEPTIONS_ESCALATIONS_OPERATIONAL_PREVIEW;
  const [filterId, setFilterId] = React.useState<WorkspaceFilterId>('all');
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
  const [selectedFlowId, setSelectedFlowId] = React.useState<string | null>(
    escalationWorkspaceFlows.find((flow) => flow.hiddenCompat !== true && flow.visibility !== 'hidden-compat')?.id
      ?? escalationWorkspaceFlows[0]?.id
      ?? null,
  );

  React.useEffect(() => {
    if (!filteredFlows.length) {
      setSelectedFlowId(null);
      return;
    }

    if (!selectedFlowId || !filteredFlows.some((flow) => flow.id === selectedFlowId)) {
      setSelectedFlowId(filteredFlows[0]?.id ?? null);
    }
  }, [filteredFlows, selectedFlowId]);

  const selectedFlow = filteredFlows.find((flow) => flow.id === selectedFlowId) ?? null;
  const selectedFlowSummary = selectedFlowId ? getDshFlowPolicySummary(selectedFlowId) : undefined;

  const summaryKpi = [
    { id: 'open', label: 'مفتوحة', value: String(preview.summary.open), tone: 'danger' as const },
    { id: 'escalate', label: 'تصعيد', value: String(preview.summary.escalate), tone: 'warning' as const },
    { id: 'resolve', label: 'حل', value: String(preview.summary.resolve), tone: 'neutral' as const },
    { id: 'close', label: 'إغلاق', value: String(preview.summary.close), tone: 'success' as const },
  ];

  return (
    <div className={styles.surfaceCockpitContent}>
      <div className={styles.surfaceSectionHeader}>
        <h2 className={styles.surfaceSectionTitle}>الاستثناءات والتصعيد</h2>
      </div>

      <WebControlPanelKpiStrip items={summaryKpi} />

      <Box gap={2} style={{}}>
        {preview.exceptions.map((exc) => (
          <WebControlPanelDecisionRow
            key={exc.id}
            entityId={exc.id}
            entityLabel={exc.type}
            status={exc.severity}
            statusTone={TONE_MAP[exc.statusTone] ?? 'neutral'}
            risk={exc.statusTone === 'danger' ? 'danger' : exc.statusTone === 'warning' ? 'warning' : 'neutral'}
            recommendation={exc.suggestedAction}
            reason={exc.note}
            sla={`البداية: ${exc.startTime} | المالك: ${exc.currentOwner}`}
            primaryAction={{
              id: 'resolve',
              label: exc.resolutionPath === 'حل' ? 'حل الاستثناء' : 'تصعيد',
              onAction: () => { /* resolve/escalate — wired to live queue in Phase 3 */ },
            }}
            secondaryAction={{
              id: 'close',
              label: 'إغلاق السجل',
              onAction: () => { /* close record — wired to live queue in Phase 3 */ },
            }}
          />
        ))}
      </Box>

      <div className={styles.surfaceSectionHeader}>
        <h3 className={styles.surfaceSectionTitle}>مساحة سياسات التصعيد</h3>
        <p className={styles.surfaceSectionSubtitle}>
          workspace قراءة فقط داخل لوحة التحكم: اختيار تدفق، مراجعة مالكه وسياساته، ومعاينة الإجراء التالي بدون أي mutation.
        </p>
      </div>

      <div className={styles.surfaceSplitGrid}>
        <div className={styles.surfaceListColumn}>
          <div className={`${styles.filterDock} ${styles.filterDockTint}`}>
            {WORKSPACE_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={`${styles.surfaceTab} ${filterId === filter.id ? styles.surfaceTabActive : ''}`}
                onClick={() => setFilterId(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className={styles.surfaceInfoCard}>
            <div>
              <div className={styles.surfaceInfoCardTitle}>مدى الوصول الحالي</div>
              <div className={styles.surfaceInfoCardDescription}>
                {`القابل للعرض مباشرة: ${renderableControlFlows.length} · تدفقات التصعيد في workspace: ${escalationWorkspaceFlows.length} · بعد الفلتر: ${filteredFlows.length}`}
              </div>
            </div>
          </div>

          {filteredFlows.map((flow) => {
            const summary = getDshFlowPolicySummary(flow.id);
            const isActive = flow.id === selectedFlowId;

            return (
              <button
                key={flow.id}
                type="button"
                className={`${styles.surfaceInfoCard} ${styles.surfaceInfoCardButton} ${isActive ? styles.surfaceInfoCardActive : ''}`}
                onClick={() => setSelectedFlowId(flow.id)}
              >
                <div className={styles.surfaceInfoCardTextBlock}>
                  <div className={styles.surfaceInfoCardTitle}>{flow.label}</div>
                  <div className={styles.surfaceInfoCardDescription}>
                    {summary?.nextPolicyActionPreview ?? 'لا توجد معاينة للسياسة.'}
                  </div>
                  <div className={styles.surfaceFootnote}>
                    {`${SURFACE_LABELS[flow.ownerSurface] ?? flow.ownerSurface} · ${DOMAIN_LABELS[flow.domain] ?? flow.domain}`}
                  </div>
                </div>
                <div className={styles.surfaceMetaWrap}>
                  <span className={styles.surfaceMetaChip}>{VISIBILITY_LABELS[flow.visibility] ?? flow.visibility}</span>
                  <span className={styles.surfaceMetaChip}>{POLICY_LABELS[flow.onDemandPolicy] ?? flow.onDemandPolicy}</span>
                  {flow.financialImpact === true ? (
                    <span className={styles.surfaceMetaChip}>finance-preview</span>
                  ) : null}
                  {flow.hiddenCompat === true ? (
                    <span className={styles.surfaceMetaChip}>hidden-compat</span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        <aside className={styles.surfaceInspectorPanel}>
          {selectedFlow && selectedFlowSummary ? (
            <>
              <div className={styles.surfaceSectionHeader}>
                <h4 className={styles.surfaceSectionTitle}>{selectedFlow.label}</h4>
                <p className={styles.surfaceSectionSubtitle}>
                  {selectedFlowSummary.nextPolicyActionPreview}
                </p>
              </div>

              <div className={styles.surfaceMetaWrap}>
                <span className={styles.surfaceMetaChip}>{selectedFlowSummary.flowId}</span>
                <span className={styles.surfaceMetaChip}>{VISIBILITY_LABELS[selectedFlowSummary.visibility] ?? selectedFlowSummary.visibility}</span>
                <span className={styles.surfaceMetaChip}>{POLICY_LABELS[selectedFlowSummary.onDemandPolicy] ?? selectedFlowSummary.onDemandPolicy}</span>
              </div>

              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>ownerSurface</strong>
                  <span>{SURFACE_LABELS[selectedFlowSummary.ownerSurface] ?? selectedFlowSummary.ownerSurface}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>visibleSurfaces</strong>
                  <span>{selectedFlowSummary.visibleSurfaces.map((surfaceId) => SURFACE_LABELS[surfaceId] ?? surfaceId).join('، ')}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>domain</strong>
                  <span>{DOMAIN_LABELS[selectedFlowSummary.domain] ?? selectedFlowSummary.domain}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>visibility</strong>
                  <span>{VISIBILITY_LABELS[selectedFlowSummary.visibility] ?? selectedFlowSummary.visibility}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>onDemandPolicy</strong>
                  <span>{POLICY_LABELS[selectedFlowSummary.onDemandPolicy] ?? selectedFlowSummary.onDemandPolicy}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>financialImpact</strong>
                  <span>{selectedFlowSummary.financialImpact ? 'finance-preview فقط' : 'لا يوجد'}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>escalationOwner</strong>
                  <span>{selectedFlowSummary.escalationOwner ? (SURFACE_LABELS[selectedFlowSummary.escalationOwner] ?? selectedFlowSummary.escalationOwner) : 'غير محدد'}</span>
                </div>
              </div>

              <div className={styles.surfaceStackSmall}>
                <div className={styles.surfaceInfoCardTitle}>allowedActions</div>
                <div className={styles.surfaceActionWrap}>
                  {selectedFlowSummary.allowedActions.map((action) => (
                    <span key={action} className={styles.surfaceMetaChip}>{action}</span>
                  ))}
                </div>
              </div>

              <div className={styles.surfaceStackSmall}>
                <div className={styles.surfaceInfoCardTitle}>forbiddenActions</div>
                <div className={styles.surfaceActionWrap}>
                  {selectedFlowSummary.forbiddenActions.map((action) => (
                    <span key={action} className={styles.surfaceMetaChip}>{action}</span>
                  ))}
                </div>
              </div>

              <div className={styles.surfaceInfoCard}>
                <div>
                  <div className={styles.surfaceInfoCardTitle}>next policy action preview</div>
                  <div className={styles.surfaceInfoCardDescription}>{selectedFlowSummary.nextPolicyActionPreview}</div>
                </div>
              </div>

              {selectedFlowSummary.financialImpact ? (
                <div className={styles.surfaceInfoCard}>
                  <div>
                    <div className={styles.surfaceInfoCardTitle}>finance-preview</div>
                    <div className={styles.surfaceInfoCardDescription}>
                      هذا التدفق يبقى read-only. لا توجد أي تسوية، استرداد، أو mutation مالية من هذه المساحة.
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedFlowSummary.hiddenCompat ? (
                <div className={styles.surfaceInfoCard}>
                  <div>
                    <div className={styles.surfaceInfoCardTitle}>hidden-compat</div>
                    <div className={styles.surfaceInfoCardDescription}>
                      هذا التدفق يبقى مرجعًا توافقيًا فقط ولا يُستخدم كمدخل أساسي في workspace.
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className={styles.surfaceInspectorMeta}>
              لا يوجد تدفق مطابق لهذا الفلتر حاليًا.
            </div>
          )}
        </aside>
      </div>

      <div className={styles.escalationCatalogSection}>
        <div className={styles.surfaceSectionHeader}>
          <h3 className={styles.surfaceSectionTitle}>
            {`أثر السجل المركزي (${escalationWorkspaceFlows.length})`}
          </h3>
        </div>
        <Box gap={1} style={{}}>
          {escalationWorkspaceFlows.map((flow) => (
            <div key={flow.id} className={styles.escalationCatalogRow}>
              <span className={styles.escalationCatalogId}>{flow.id}</span>
              <span className={styles.escalationCatalogMeta}>{flow.ownerSurface}</span>
              <span className={styles.escalationCatalogDomain}>{flow.domain}</span>
              <span className={styles.escalationCatalogVisibility}>{flow.visibility}</span>
              <span className={styles.escalationCatalogPolicy}>{flow.onDemandPolicy}</span>
              {flow.financialImpact === true && (
                <span className={styles.escalationCatalogBadgeFinance}>مالي</span>
              )}
            </div>
          ))}
        </Box>
      </div>
    </div>
  );
}

export default ExceptionsEscalationsScreen;
