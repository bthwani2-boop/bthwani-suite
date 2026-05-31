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
  DSH_ORDER_RESCUE_PREVIEW,
  getDshOrderRescueByContext,
  getDshOrderRescueCase,
} from '../../data/orders.preview-data';
import { DSH_OPS_INTERVENTION_PLAYBOOKS } from '../../data/support.preview-data';
import { buildOperationsHref } from './operations.registry';
import styles from '../shared/control-panel-surface.module.css';

export type OrderRescueScreenProps = {
  hubHref: string;
  subGroup?: string;
};

const OWNER_LABELS = {
  support: 'support',
  operations: 'operations',
  partner: 'partner',
  captain: 'captain',
  wlt_reference_only: 'WLT reference only',
} as const;

const ACTION_LABELS = {
  replace_item: 'replace item',
  remove_item: 'remove item',
  wait_customer: 'wait customer',
  change_delivery_mode: 'change delivery mode',
  reassign_captain: 'reassign captain',
  convert_to_support_exception: 'convert to support_exception',
  create_follow_up_task: 'create follow-up task',
  open_wlt_visibility: 'open WLT visibility',
} as const;

function OrderRescueSection({
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

export function OrderRescueScreen({ hubHref: _hubHref, subGroup: _subGroup }: OrderRescueScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRescueId, setSelectedRescueId] = React.useState<string>(DSH_ORDER_RESCUE_PREVIEW[0]?.rescueId ?? '');

  React.useEffect(() => {
    const matchedCase = getDshOrderRescueByContext({
      rescueId: searchParams.get('rescueId'),
      orderId: searchParams.get('orderId'),
      customerId: searchParams.get('customerId'),
    });

    if (matchedCase) {
      setSelectedRescueId(matchedCase.rescueId);
    }
  }, [searchParams]);

  const selectedCase = React.useMemo(
    () => getDshOrderRescueCase(selectedRescueId) ?? DSH_ORDER_RESCUE_PREVIEW[0],
    [selectedRescueId],
  );
  const playbook = React.useMemo(
    () => DSH_OPS_INTERVENTION_PLAYBOOKS.find((item) => item.triggerFlowIds.includes('order-rescue')),
    [],
  );
  const kpis = React.useMemo(
    () => [
      { id: 'total', label: 'rescue cases', value: String(DSH_ORDER_RESCUE_PREVIEW.length), tone: 'neutral' as const },
      {
        id: 'critical',
        label: 'critical',
        value: String(DSH_ORDER_RESCUE_PREVIEW.filter((item) => item.severity === 'danger').length),
        tone: 'danger' as const,
      },
      {
        id: 'wlt',
        label: 'WLT reference',
        value: String(
          DSH_ORDER_RESCUE_PREVIEW.filter(
            (item) =>
              item.issueKind === 'payment_failure' ||
              item.issueKind === 'wlt_visibility' ||
              item.ownerSelection.selectedOwner === 'wlt_reference_only',
          ).length,
        ),
        tone: 'warning' as const,
      },
      { id: 'audit', label: 'audit required', value: 'yes', tone: 'success' as const },
    ],
    [],
  );

  if (!selectedCase) {
    return null;
  }

  function openRouteHint(routeHint: string) {
    router.push(routeHint);
  }

  return (
    <div className={styles.surfaceCockpitContent} style={{ overflowY: 'auto', paddingInlineEnd: '4px' }}>
      <div className={styles.surfaceSectionHeader}>
        <h2 className={styles.surfaceSectionTitle}>Order Rescue</h2>
        <p className={styles.surfaceSectionSubtitle}>
          reason ثم owner ثم next action ثم evidence/support handoff ثم WLT visibility read-only فقط.
        </p>
      </div>

      <WebControlPanelKpiStrip items={kpis} />

      {playbook ? (
        <WebControlPanelRecommendation
          title={playbook.title}
          reason={`${playbook.checkpoints.join(' · ')} · القرار التالي: ${selectedCase.nextBestAction}`}
          confidence={playbook.severity === 'danger' ? 'high' : 'medium'}
          auditTag={playbook.playbookId}
          primaryAction={{
            id: 'open-exceptions',
            label: 'فتح الاستثناءات',
            onAction: () =>
              router.push(
                buildOperationsHref('exceptions-escalations', {
                  orderId: selectedCase.orderId,
                  customerId: selectedCase.customerId,
                }),
              ),
          }}
          secondaryAction={{
            id: 'open-assisted',
            label: 'فتح Assisted Order',
            onAction: () =>
              router.push(
                buildOperationsHref('assisted-order-desk', {
                  orderId: selectedCase.orderId,
                  customerId: selectedCase.customerId,
                }),
              ),
          }}
        />
      ) : null}

      <div className={styles.surfaceSplitGrid}>
        <div className={styles.surfaceListColumn}>
          <Box gap={2}>
            {DSH_ORDER_RESCUE_PREVIEW.map((item) => (
              <WebControlPanelDecisionRow
                key={item.rescueId}
                entityId={item.orderId}
                entityLabel={`${item.customerName} · ${item.blocker}`}
                status={item.issueKind}
                statusTone={item.severity === 'danger' ? 'danger' : 'warning'}
                risk={item.severity === 'danger' ? 'danger' : 'warning'}
                recommendation={item.nextBestAction}
                reason={`${OWNER_LABELS[item.ownerSelection.selectedOwner]} · ${ACTION_LABELS[item.nextActionSelector.selectedAction]}`}
                sla={`${item.supportHandoff.ticketLink} · ${item.supportHandoff.sla}`}
                primaryAction={{
                  id: `${item.rescueId}-open`,
                  label: 'فتح الحالة',
                  onAction: () => setSelectedRescueId(item.rescueId),
                }}
                secondaryAction={{
                  id: `${item.rescueId}-command`,
                  label: 'غرفة القيادة',
                  onAction: () =>
                    router.push(
                      buildOperationsHref('command-center', {
                        orderId: item.orderId,
                        customerId: item.customerId,
                      }),
                    ),
                }}
              />
            ))}
          </Box>
        </div>

        <aside className={styles.surfaceInspectorPanel}>
          <div className={styles.surfaceSectionHeader}>
            <h3 className={styles.surfaceSectionTitle}>{selectedCase.orderId}</h3>
            <p className={styles.surfaceSectionSubtitle}>{selectedCase.blocker}</p>
          </div>

          <div className={styles.surfaceGridTwoCol}>
            <OrderRescueSection
              title="rescue reason selector"
              description={`selected=${selectedCase.rescueReasonSelector.selectedReason} · ${selectedCase.rescueReasonSelector.previewClassification}`}
            >
              <div className={styles.surfaceActionWrap}>
                {selectedCase.rescueReasonSelector.options.map((reason) => (
                  <span key={reason} className={styles.surfaceMetaChip}>
                    {reason === selectedCase.rescueReasonSelector.selectedReason ? 'selected' : 'available'} · {reason}
                  </span>
                ))}
              </div>
            </OrderRescueSection>

            <OrderRescueSection
              title="owner selection"
              description={`owner=${OWNER_LABELS[selectedCase.ownerSelection.selectedOwner]} · ${selectedCase.ownerSelection.previewClassification}`}
            >
              <div className={styles.surfaceActionWrap}>
                {selectedCase.ownerSelection.options.map((owner) => (
                  <span key={owner} className={styles.surfaceMetaChip}>
                    {owner === selectedCase.ownerSelection.selectedOwner ? 'selected' : 'available'} · {OWNER_LABELS[owner]}
                  </span>
                ))}
              </div>
            </OrderRescueSection>
          </div>

          <div className={styles.surfaceGridTwoCol}>
            <OrderRescueSection
              title="next action selector"
              description={`action=${ACTION_LABELS[selectedCase.nextActionSelector.selectedAction]} · ${selectedCase.nextActionSelector.previewClassification}`}
            >
              <div className={styles.surfaceActionWrap}>
                {selectedCase.nextActionSelector.options.map((action) => (
                  <span key={action} className={styles.surfaceMetaChip}>
                    {action === selectedCase.nextActionSelector.selectedAction ? 'selected' : 'available'} · {ACTION_LABELS[action]}
                  </span>
                ))}
              </div>
              <p className={styles.surfaceFootnote}>{selectedCase.nextBestAction}</p>
            </OrderRescueSection>

            <OrderRescueSection
              title="required evidence"
              description={`auditRequired=${String(selectedCase.requiredEvidence.auditRequired)} · reasonRequired=${String(selectedCase.requiredEvidence.reasonRequired)}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>reason</strong>
                  <span>{selectedCase.requiredEvidence.reason}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>operator note</strong>
                  <span>{selectedCase.requiredEvidence.operatorNote}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>affected entity</strong>
                  <span>{selectedCase.requiredEvidence.affectedEntity}</span>
                </div>
              </div>
            </OrderRescueSection>
          </div>

          <div className={styles.surfaceGridTwoCol}>
            <OrderRescueSection
              title="forbidden actions"
              description="no refund / settlement mutation, no invalid delivery-mode change, no item mutation بلا visibility note."
            >
              <div className={styles.surfaceActionWrap}>
                {selectedCase.forbiddenActions.map((action) => (
                  <span key={action} className={styles.surfaceMetaChip}>{action}</span>
                ))}
              </div>
            </OrderRescueSection>

            <OrderRescueSection
              title="support handoff"
              description={`owner=${selectedCase.supportHandoff.escalationOwner} · ${selectedCase.supportHandoff.previewClassification}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>ticket link</strong>
                  <span>{selectedCase.supportHandoff.ticketLink}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>SLA</strong>
                  <span>{selectedCase.supportHandoff.sla}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>route</strong>
                  <span>{selectedCase.supportHandoff.routeHint}</span>
                </div>
              </div>
            </OrderRescueSection>
          </div>

          <div className={styles.surfaceGridTwoCol}>
            <OrderRescueSection
              title="WLT impact visibility"
              description={`classification=${selectedCase.wltImpactVisibility.placeholderClassification} · ${selectedCase.wltImpactVisibility.calculationTruthOwner}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>payment</strong>
                  <span>{selectedCase.wltImpactVisibility.paymentVisibility}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>refund</strong>
                  <span>{selectedCase.wltImpactVisibility.refundVisibility}</span>
                </div>
                {selectedCase.wltImpactVisibility.settlementVisibility ? (
                  <div className={styles.surfaceInspectorRow}>
                    <strong>settlement</strong>
                    <span>{selectedCase.wltImpactVisibility.settlementVisibility}</span>
                  </div>
                ) : null}
                <div className={styles.surfaceInspectorRow}>
                  <strong>route</strong>
                  <span>{selectedCase.wltImpactVisibility.routeHint}</span>
                </div>
              </div>
            </OrderRescueSection>

            <OrderRescueSection
              title="decision signal"
              description={`routeId=${selectedCase.decisionSignal.routeId} · auditRequired=${String(selectedCase.decisionSignal.auditRequired)}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>signal kind</strong>
                  <span>{selectedCase.decisionSignal.signalKind}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>priority</strong>
                  <span>{selectedCase.decisionSignal.priorityLabel}</span>
                </div>
              </div>
            </OrderRescueSection>
          </div>

          <OrderRescueSection
            title="cross-surface links"
            description={`allowed=${selectedCase.allowedActions.join(' · ')}`}
          >
            <Box gap={2}>
              {selectedCase.crossSurfaceLinks.map((link) => (
                <WebControlPanelDecisionRow
                  key={link.actionId}
                  entityId={link.sectionId}
                  entityLabel={link.label}
                  status={link.surfaceId}
                  statusTone={link.readOnly ? 'warning' : 'neutral'}
                  recommendation={`${link.routeId ?? 'routeHint'} · ${link.onDemandPolicy}`}
                  reason={link.routeHint}
                  primaryAction={{
                    id: link.actionId,
                    label: 'فتح الرابط',
                    onAction: () => openRouteHint(link.routeHint),
                  }}
                />
              ))}
            </Box>
          </OrderRescueSection>
        </aside>
      </div>
    </div>
  );
}

export default OrderRescueScreen;
