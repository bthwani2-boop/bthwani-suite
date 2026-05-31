'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelKpiStrip,
  WebControlPanelRecommendation,
} from '@bthwani/ui-kit/web';
import {
  DSH_ASSISTED_ORDER_PREVIEW,
  getDshAssistedOrderByContext,
  getDshAssistedOrderById,
} from '../../data/orders.preview-data';
import { DSH_OPS_INTERVENTION_PLAYBOOKS } from '../../data/support.preview-data';
import { buildOperationsHref } from './operations.registry';
import styles from '../shared/control-panel-surface.module.css';

export type AssistedOrderDeskScreenProps = {
  hubHref: string;
  subGroup?: string;
};

const IDENTITY_STATUS_META = {
  verified: { label: 'verified', tone: 'success' as const, risk: 'neutral' as const },
  required: { label: 'required', tone: 'warning' as const, risk: 'warning' as const },
  blocked: { label: 'blocked', tone: 'danger' as const, risk: 'danger' as const },
} as const;

const SERVICEABILITY_STATUS_META = {
  serviceable: { label: 'serviceable', tone: 'success' as const },
  blocked: { label: 'blocked', tone: 'danger' as const },
} as const;

function AssistedOrderSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.surfaceInfoCard}>
      <div className={styles.surfaceInfoCardTextBlock}>
        <div className={styles.surfaceInfoCardTitle}>{title}</div>
        {description ? <div className={styles.surfaceInfoCardDescription}>{description}</div> : null}
      </div>
      {children}
    </div>
  );
}

export function AssistedOrderDeskScreen({ hubHref: _hubHref, subGroup: _subGroup }: AssistedOrderDeskScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDeskId, setSelectedDeskId] = React.useState<string>(DSH_ASSISTED_ORDER_PREVIEW[0]?.deskId ?? '');

  React.useEffect(() => {
    const matchedDesk = getDshAssistedOrderByContext({
      deskId: searchParams.get('deskId'),
      orderId: searchParams.get('orderId'),
      customerId: searchParams.get('customerId'),
      ticketId: searchParams.get('ticketId'),
    });

    if (matchedDesk) {
      setSelectedDeskId(matchedDesk.deskId);
    }
  }, [searchParams]);

  const selectedDesk = React.useMemo(
    () => getDshAssistedOrderById(selectedDeskId) ?? DSH_ASSISTED_ORDER_PREVIEW[0],
    [selectedDeskId],
  );
  const relevantPlaybook = React.useMemo(
    () => DSH_OPS_INTERVENTION_PLAYBOOKS.find((playbook) => playbook.triggerFlowIds.includes('assisted-order-desk')),
    [],
  );
  const kpis = React.useMemo(
    () => [
      { id: 'desk', label: 'حالات المساعدة', value: String(DSH_ASSISTED_ORDER_PREVIEW.length), tone: 'neutral' as const },
      {
        id: 'verified',
        label: 'هوية verified',
        value: String(DSH_ASSISTED_ORDER_PREVIEW.filter((item) => item.identityVerification.verificationStatus === 'verified').length),
        tone: 'success' as const,
      },
      {
        id: 'blocked',
        label: 'serviceability blocked',
        value: String(DSH_ASSISTED_ORDER_PREVIEW.filter((item) => item.serviceabilitySummary.serviceabilityStatus === 'blocked').length),
        tone: 'warning' as const,
      },
      { id: 'wlt', label: 'WLT', value: 'read-only', tone: 'danger' as const },
    ],
    [],
  );

  if (!selectedDesk) {
    return null;
  }
  const serviceabilityMeta = SERVICEABILITY_STATUS_META[selectedDesk.serviceabilitySummary.serviceabilityStatus];

  return (
    <div className={styles.surfaceCockpitContent} style={{ overflowY: 'auto', paddingInlineEnd: '4px' }}>
      <div className={styles.surfaceSectionHeader}>
        <h2 className={styles.surfaceSectionTitle}>Assisted Order Desk</h2>
        <p className={styles.surfaceSectionSubtitle}>
          lookup ثم verification ثم cart/delivery/serviceability ثم WLT read-only ثم audit/submit preview.
        </p>
      </div>

      <WebControlPanelKpiStrip items={kpis} />

      {relevantPlaybook ? (
        <WebControlPanelRecommendation
          title={relevantPlaybook.title}
          reason={`${relevantPlaybook.checkpoints.join(' · ')} · القرار التالي: ${selectedDesk.submitDraftPreview.nextAction}`}
          confidence={relevantPlaybook.severity === 'danger' ? 'high' : 'medium'}
          auditTag={relevantPlaybook.playbookId}
          primaryAction={{
            id: 'open-rescue',
            label: 'فتح Order Rescue',
            onAction: () =>
              router.push(
                buildOperationsHref('order-rescue', {
                  orderId: selectedDesk.orderId,
                  customerId: selectedDesk.customerId,
                  ticketId: selectedDesk.ticketId,
                }),
              ),
          }}
          secondaryAction={{
            id: 'open-command',
            label: 'غرفة القيادة',
            onAction: () => router.push(buildOperationsHref('command-center', { orderId: selectedDesk.orderId })),
          }}
        />
      ) : null}

      <div className={styles.surfaceSplitGrid}>
        <div className={styles.surfaceListColumn}>
          <Box gap={2}>
            {DSH_ASSISTED_ORDER_PREVIEW.map((desk) => {
              const deskIdentity = IDENTITY_STATUS_META[desk.identityVerification.verificationStatus];
              return (
                <WebControlPanelDecisionRow
                  key={desk.deskId}
                  entityId={desk.orderId ?? desk.customerId}
                  entityLabel={`${desk.customerName} · ${desk.basketSummary}`}
                  status={deskIdentity.label}
                  statusTone={deskIdentity.tone}
                  risk={deskIdentity.risk}
                  recommendation={desk.submitDraftPreview.nextAction}
                  reason={`${desk.deliveryModeSelector.selectedMode} · ${desk.serviceabilitySummary.zoneLabel}`}
                  sla={`${desk.auditFlags.join(' · ')} · signal=${desk.submitDraftPreview.signal.routeId}`}
                  primaryAction={{ id: `${desk.deskId}-open`, label: 'فتح workspace', onAction: () => setSelectedDeskId(desk.deskId) }}
                  secondaryAction={{
                    id: `${desk.deskId}-rescue`,
                    label: 'فتح الإنقاذ',
                    onAction: () =>
                      router.push(
                        buildOperationsHref('order-rescue', {
                          orderId: desk.orderId,
                          customerId: desk.customerId,
                          ticketId: desk.ticketId,
                        }),
                      ),
                  }}
                />
              );
            })}
          </Box>
        </div>

        <aside className={styles.surfaceInspectorPanel}>
          <div className={styles.surfaceSectionHeader}>
            <h3 className={styles.surfaceSectionTitle}>{selectedDesk.customerName}</h3>
            <p className={styles.surfaceSectionSubtitle}>{selectedDesk.nextAction}</p>
          </div>

          <div className={styles.surfaceGridTwoCol}>
            <AssistedOrderSection title="customer lookup panel" description="summary first: IDs/references only.">
              <div className={styles.surfaceInspectorMeta}>
                {selectedDesk.lookupPanel.inputs.map((input) => (
                  <div key={input.key} className={styles.surfaceInspectorRow}>
                    <strong>{input.label}</strong>
                    <span>{input.value}</span>
                  </div>
                ))}
              </div>
            </AssistedOrderSection>

            <AssistedOrderSection
              title="identity verification"
              description={`status=${selectedDesk.identityVerification.verificationStatus} · classification=${selectedDesk.identityVerification.previewClassification}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>verificationStatus</strong>
                  <span>{selectedDesk.identityVerification.verificationStatus}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>sensitiveFieldsLocked</strong>
                  <span>{selectedDesk.identityVerification.sensitiveFieldsLocked.join('، ')}</span>
                </div>
              </div>
              <div className={styles.surfaceActionWrap}>
                {selectedDesk.identityVerification.verificationSteps.map((step) => (
                  <span key={step.stepId} className={styles.surfaceMetaChip}>
                    {step.completed ? '✓' : '…'} {step.label}
                  </span>
                ))}
              </div>
              <p className={styles.surfaceFootnote}>
                forbidden before verification: {selectedDesk.identityVerification.forbiddenActionsBeforeVerification.join(' · ')}
              </p>
            </AssistedOrderSection>
          </div>

          <div className={styles.surfaceGridTwoCol}>
            <AssistedOrderSection
              title="cart builder preview"
              description={`published products only · ${selectedDesk.cartBuilderPreview.previewClassification}`}
            >
              <Box gap={2}>
                {selectedDesk.cartBuilderPreview.items.map((item) => (
                  <div key={item.sku} className={styles.surfaceInspectorMeta}>
                    <div className={styles.surfaceInspectorRow}>
                      <strong>{item.name}</strong>
                      <span>{`qty=${item.quantity} · ${item.status}`}</span>
                    </div>
                    <p className={styles.surfaceFootnote}>{item.note}</p>
                  </div>
                ))}
              </Box>
              <div className={styles.surfaceActionWrap}>
                <span className={styles.surfaceMetaChip}>add item</span>
                <span className={styles.surfaceMetaChip}>remove item</span>
                <span className={styles.surfaceMetaChip}>replace item</span>
                <span className={styles.surfaceMetaChip}>substitute item</span>
              </div>
              <p className={styles.surfaceFootnote}>{selectedDesk.cartBuilderPreview.unavailableItemHandling}</p>
            </AssistedOrderSection>

            <AssistedOrderSection
              title="delivery mode selector"
              description={`${selectedDesk.deliveryModeSelector.selectedMode} · ${selectedDesk.deliveryModeSelector.previewClassification}`}
            >
              <div className={styles.surfaceActionWrap}>
                {selectedDesk.deliveryModeSelector.options.map((option) => (
                  <span key={option.modeId} className={styles.surfaceMetaChip}>
                    {option.modeId === selectedDesk.deliveryModeSelector.selectedMode ? 'selected' : 'available'} · {option.label}
                  </span>
                ))}
              </div>
              <p className={styles.surfaceFootnote}>{selectedDesk.deliveryModeSelector.selectedModeSummary}</p>
              <p className={styles.surfaceFootnote}>
                forbidden lifecycle states: {selectedDesk.deliveryModeSelector.forbiddenLifecycleStates.join(' · ')}
              </p>
            </AssistedOrderSection>
          </div>

          <div className={styles.surfaceGridTwoCol}>
            <AssistedOrderSection
              title="serviceability summary"
              description={`${serviceabilityMeta.label} · zone=${selectedDesk.serviceabilitySummary.zoneLabel}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>zone</strong>
                  <span>{selectedDesk.serviceabilitySummary.zoneLabel}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>status</strong>
                  <span>{serviceabilityMeta.label}</span>
                </div>
                {selectedDesk.serviceabilitySummary.blockedReason ? (
                  <div className={styles.surfaceInspectorRow}>
                    <strong>blockedReason</strong>
                    <span>{selectedDesk.serviceabilitySummary.blockedReason}</span>
                  </div>
                ) : null}
              </div>
              <p className={styles.surfaceFootnote}>{selectedDesk.serviceabilitySummary.fallbackAction}</p>
            </AssistedOrderSection>

            <AssistedOrderSection
              title="WLT read-only handoff"
              description={`classification=${selectedDesk.wltReadOnlyHandoff.placeholderClassification} · ${selectedDesk.wltReadOnlyHandoff.calculationTruthOwner}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>payment visibility</strong>
                  <span>{selectedDesk.wltReadOnlyHandoff.paymentVisibility}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>refund visibility</strong>
                  <span>{selectedDesk.wltReadOnlyHandoff.refundVisibility}</span>
                </div>
                {selectedDesk.wltReadOnlyHandoff.settlementVisibility ? (
                  <div className={styles.surfaceInspectorRow}>
                    <strong>settlement visibility</strong>
                    <span>{selectedDesk.wltReadOnlyHandoff.settlementVisibility}</span>
                  </div>
                ) : null}
                <div className={styles.surfaceInspectorRow}>
                  <strong>route</strong>
                  <span>{selectedDesk.wltReadOnlyHandoff.routeHint}</span>
                </div>
              </div>
              <p className={styles.surfaceFootnote}>No mutation. No calculation truth inside DSH.</p>
            </AssistedOrderSection>
          </div>

          <div className={styles.surfaceGridTwoCol}>
            <AssistedOrderSection
              title="audit reason"
              description={`reasonRequired=${String(selectedDesk.auditReason.reasonRequired)} · auditRequired=${String(selectedDesk.auditReason.auditRequired)}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>reason</strong>
                  <span>{selectedDesk.auditReason.reasonLabel}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>operator note</strong>
                  <span>{selectedDesk.auditReason.operatorNote}</span>
                </div>
              </div>
            </AssistedOrderSection>

            <AssistedOrderSection
              title="submit draft preview"
              description={`previewState=${selectedDesk.submitDraftPreview.previewState} · signal=${selectedDesk.submitDraftPreview.signal.routeId}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>backend</strong>
                  <span>no backend call</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>creation claim</strong>
                  <span>no order creation claim</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>next action</strong>
                  <span>{selectedDesk.submitDraftPreview.nextAction}</span>
                </div>
              </div>
              <p className={styles.surfaceFootnote}>
                signal route: {selectedDesk.submitDraftPreview.signal.routeId} · priority: {selectedDesk.submitDraftPreview.signal.priorityLabel}
              </p>
            </AssistedOrderSection>
          </div>

          <Box gap={2}>
            {selectedDesk.crossSurfaceLinks.map((link) => (
              <WebControlPanelDecisionRow
                key={link.actionId}
                entityId={link.sectionId}
                entityLabel={link.label}
                status={link.surfaceId}
                statusTone={link.readOnly ? 'warning' : 'neutral'}
                recommendation={`${link.routeId ?? 'routeHint'} · ${link.onDemandPolicy}`}
                reason={link.routeHint}
                primaryAction={{ id: link.actionId, label: 'فتح الرابط', onAction: () => router.push(link.routeHint) }}
              />
            ))}
          </Box>
        </aside>
      </div>
    </div>
  );
}

export default AssistedOrderDeskScreen;
