'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box } from '@bthwani/ui-kit';
import { WebControlPanelDecisionRow, WebControlPanelKpiStrip } from '@bthwani/ui-kit/web';
import {
  DSH_CALL_INTAKE_PREVIEW,
  getDshCallIntakeByContext,
  getDshCallIntakePreview,
  type DshCallIntakePreview,
  type DshGlobalControlLink,
  type DshRouteHintedAction,
} from '../../shared';
import styles from '../shared/control-panel-surface.module.css';

export type ManualCallIntakeRouteContext = {
  intakeId: string;
  customerId: string;
  orderId?: string;
  ticketId?: string;
};

export type ManualCallIntakeWorkspaceProps = {
  onOpenCustomer360?: (context: ManualCallIntakeRouteContext) => void;
  onOpenAssistedOrder?: (context: ManualCallIntakeRouteContext) => void;
  onOpenOrderRescue?: (context: ManualCallIntakeRouteContext) => void;
  onOpenSupportEscalation?: (context: ManualCallIntakeRouteContext) => void;
};

const VERIFICATION_STATUS_META = {
  verified: { label: 'verified', tone: 'success' as const },
  required: { label: 'required', tone: 'warning' as const },
  blocked: { label: 'blocked', tone: 'danger' as const },
} as const;

function ManualCallSection({
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

function buildCallRouteContext(record: DshCallIntakePreview): ManualCallIntakeRouteContext {
  return {
    intakeId: record.intakeId,
    customerId: record.customerId,
    orderId: record.orderContext,
    ticketId: record.ticketContext,
  };
}

export function ManualCallIntakeWorkspace({
  onOpenCustomer360,
  onOpenAssistedOrder,
  onOpenOrderRescue,
  onOpenSupportEscalation,
}: ManualCallIntakeWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedIntakeId, setSelectedIntakeId] = React.useState<string>(DSH_CALL_INTAKE_PREVIEW[0]?.intakeId ?? '');

  React.useEffect(() => {
    const matchedRecord = getDshCallIntakeByContext({
      intakeId: searchParams.get('callId') ?? searchParams.get('intakeId'),
      customerId: searchParams.get('customerId'),
      orderId: searchParams.get('orderId'),
      ticketId: searchParams.get('ticketId'),
    });

    if (matchedRecord) {
      setSelectedIntakeId(matchedRecord.intakeId);
    }
  }, [searchParams]);

  const selectedRecord = React.useMemo(
    () => getDshCallIntakePreview(selectedIntakeId) ?? DSH_CALL_INTAKE_PREVIEW[0],
    [selectedIntakeId],
  );
  const kpis = React.useMemo(
    () => [
      { id: 'calls', label: 'manual calls', value: String(DSH_CALL_INTAKE_PREVIEW.length), tone: 'neutral' as const },
      {
        id: 'verified',
        label: 'verified',
        value: String(DSH_CALL_INTAKE_PREVIEW.filter((item) => item.identityVerificationResult.verificationStatus === 'verified').length),
        tone: 'success' as const,
      },
      {
        id: 'blocked',
        label: 'blocked identity',
        value: String(DSH_CALL_INTAKE_PREVIEW.filter((item) => item.closeCallOutcome.outcome === 'blocked_identity').length),
        tone: 'warning' as const,
      },
      { id: 'source', label: 'source', value: 'external_phone_manual', tone: 'danger' as const },
    ],
    [],
  );

  if (!selectedRecord) {
    return null;
  }

  const selectedContext = buildCallRouteContext(selectedRecord);
  const verificationMeta = VERIFICATION_STATUS_META[selectedRecord.identityVerificationResult.verificationStatus];

  function openRouteHint(routeHint: string) {
    router.push(routeHint);
  }

  function openTransferAction(action: DshRouteHintedAction) {
    if (action.actionId.includes('assisted-order')) {
      if (onOpenAssistedOrder) {
        onOpenAssistedOrder(selectedContext);
        return;
      }

      openRouteHint(action.routeHint);
      return;
    }

    if (action.actionId.includes('order-rescue')) {
      if (onOpenOrderRescue) {
        onOpenOrderRescue(selectedContext);
        return;
      }

      openRouteHint(action.routeHint);
      return;
    }

    if (action.actionId.includes('support-escalation')) {
      if (onOpenSupportEscalation) {
        onOpenSupportEscalation(selectedContext);
        return;
      }

      openRouteHint(action.routeHint);
      return;
    }

    openRouteHint(action.routeHint);
  }

  function openQuickAction(action: DshGlobalControlLink) {
    if (action.actionId === 'customer-360') {
      if (onOpenCustomer360) {
        onOpenCustomer360(selectedContext);
        return;
      }

      openRouteHint(action.routeHint);
      return;
    }

    if (action.actionId === 'assisted-order') {
      if (onOpenAssistedOrder) {
        onOpenAssistedOrder(selectedContext);
        return;
      }

      openRouteHint(action.routeHint);
      return;
    }

    openRouteHint(action.routeHint);
  }

  return (
    <div className={styles.surfaceCockpitContent}>
      <div className={styles.surfaceSectionHeader}>
        <h2 className={styles.surfaceSectionTitle}>Manual Call Intake</h2>
        <p className={styles.surfaceSectionSubtitle}>
          external_phone_manual فقط: lookup ثم reason ثم identity/ticket preview ثم transfer/close outcome، من دون أي call runtime أو mutation مالي.
        </p>
      </div>

      <WebControlPanelKpiStrip items={kpis} />

      <div className={styles.surfaceSplitGrid}>
        <div className={styles.surfaceListColumn}>
          <Box gap={2}>
            {DSH_CALL_INTAKE_PREVIEW.map((record) => {
              const recordVerificationMeta = VERIFICATION_STATUS_META[record.identityVerificationResult.verificationStatus];

              return (
                <WebControlPanelDecisionRow
                  key={record.intakeId}
                  entityId={record.intakeId}
                  entityLabel={`${record.customerName} · ${record.issueSummary}`}
                  status={recordVerificationMeta.label}
                  statusTone={recordVerificationMeta.tone}
                  recommendation={record.nextAction}
                  reason={`source=${record.source} · reason=${record.callReasonSelector.selectedReason}`}
                  sla={`ticket=${record.ticketPreview.ticketId} · outcome=${record.closeCallOutcome.outcome}`}
                  primaryAction={{
                    id: `${record.intakeId}-open`,
                    label: 'فتح المكالمة',
                    onAction: () => setSelectedIntakeId(record.intakeId),
                  }}
                  secondaryAction={{
                    id: `${record.intakeId}-customer360`,
                    label: 'فتح Customer 360',
                    onAction: () =>
                      onOpenCustomer360
                        ? onOpenCustomer360({
                            intakeId: record.intakeId,
                            customerId: record.customerId,
                            orderId: record.orderContext,
                            ticketId: record.ticketContext,
                          })
                        : openRouteHint(
                            `/support?workspace=customer-360&customerId=${record.customerId}${
                              record.orderContext ? `&orderId=${record.orderContext}` : ''
                            }${record.ticketContext ? `&ticketId=${record.ticketContext}` : ''}&callId=${record.intakeId}`,
                          ),
                  }}
                />
              );
            })}
          </Box>
        </div>

        <aside className={styles.surfaceInspectorPanel}>
          <div className={styles.surfaceSectionHeader}>
            <h3 className={styles.surfaceSectionTitle}>{selectedRecord.customerName}</h3>
            <p className={styles.surfaceSectionSubtitle}>{selectedRecord.issueSummary}</p>
          </div>

          <div className={styles.surfaceGridTwoCol}>
            <ManualCallSection
              title="lookup inputs"
              description={`source=${selectedRecord.source} · ${selectedRecord.onDemandPolicy}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                {selectedRecord.lookupPanel.inputs.map((input) => (
                  <div key={input.key} className={styles.surfaceInspectorRow}>
                    <strong>{input.label}</strong>
                    <span>{input.value}</span>
                  </div>
                ))}
              </div>
            </ManualCallSection>

            <ManualCallSection
              title="call reason selector"
              description={`selected=${selectedRecord.callReasonSelector.selectedReason} · ${selectedRecord.callReasonSelector.previewClassification}`}
            >
              <div className={styles.surfaceActionWrap}>
                {selectedRecord.callReasonSelector.options.map((reason) => (
                  <span key={reason} className={styles.surfaceMetaChip}>
                    {reason === selectedRecord.callReasonSelector.selectedReason ? 'selected' : 'available'} · {reason}
                  </span>
                ))}
              </div>
            </ManualCallSection>
          </div>

          <div className={styles.surfaceGridTwoCol}>
            <ManualCallSection
              title="identity verification result"
              description={`status=${verificationMeta.label} · ${selectedRecord.identityVerificationResult.previewClassification}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>verification</strong>
                  <span>{selectedRecord.identityVerificationResult.verificationStatus}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>locked</strong>
                  <span>{selectedRecord.identityVerificationResult.sensitiveFieldsLocked.join('، ')}</span>
                </div>
              </div>
              <div className={styles.surfaceActionWrap}>
                {selectedRecord.identityVerificationResult.verificationSteps.map((step) => (
                  <span key={step.stepId} className={styles.surfaceMetaChip}>
                    {step.completed ? '✓' : '…'} {step.label}
                  </span>
                ))}
              </div>
              <p className={styles.surfaceFootnote}>
                forbidden actions: {selectedRecord.forbiddenActions.join(' · ')}
              </p>
            </ManualCallSection>

            <ManualCallSection
              title="create / link ticket preview"
              description={`mode=${selectedRecord.ticketPreview.mode} · auditRequired=${String(selectedRecord.ticketPreview.auditRequired)}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>ticketId</strong>
                  <span>{selectedRecord.ticketPreview.ticketId}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>summary</strong>
                  <span>{selectedRecord.ticketPreview.summary}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>route</strong>
                  <span>{selectedRecord.ticketPreview.routeHint}</span>
                </div>
              </div>
            </ManualCallSection>
          </div>

          <ManualCallSection
            title="transfer context to operations"
            description="to assisted-order-desk / to order-rescue / to support escalation"
          >
            <Box gap={2}>
              {selectedRecord.transferContextToOperations.map((action) => (
                <WebControlPanelDecisionRow
                  key={action.actionId}
                  entityId={selectedRecord.ticketPreview.ticketId}
                  entityLabel={action.label}
                  status={action.routeId ?? 'routeHint'}
                  statusTone="neutral"
                  recommendation={`${action.onDemandPolicy} · audit=${String(action.auditRequired ?? false)}`}
                  reason={action.routeHint}
                  primaryAction={{
                    id: action.actionId,
                    label: 'فتح التحويل',
                    onAction: () => openTransferAction(action),
                  }}
                />
              ))}
            </Box>
          </ManualCallSection>

          <div className={styles.surfaceGridTwoCol}>
            <ManualCallSection
              title="close call outcome"
              description={`outcome=${selectedRecord.closeCallOutcome.outcome} · auditRequired=${String(selectedRecord.closeCallOutcome.auditRequired)}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>summary</strong>
                  <span>{selectedRecord.closeCallOutcome.summary}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>signal</strong>
                  <span>{selectedRecord.closeCallOutcome.signal.routeId}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>priority</strong>
                  <span>{selectedRecord.closeCallOutcome.signal.priorityLabel}</span>
                </div>
              </div>
            </ManualCallSection>

            <ManualCallSection
              title="audit + quick actions"
              description={`auditRequired=${String(selectedRecord.auditRequired)} · IDs/references first`}
            >
              <Box gap={2}>
                {selectedRecord.quickActions.map((action) => (
                  <WebControlPanelDecisionRow
                    key={action.actionId}
                    entityId={action.sectionId}
                    entityLabel={action.label}
                    status={action.surfaceId}
                    statusTone={action.readOnly ? 'warning' : 'neutral'}
                    recommendation={`${action.routeId ?? 'routeHint'} · ${action.onDemandPolicy}`}
                    reason={action.routeHint}
                    primaryAction={{
                      id: `${selectedRecord.intakeId}-${action.actionId}`,
                      label: 'فتح المرجع',
                      onAction: () => openQuickAction(action),
                    }}
                  />
                ))}
              </Box>
            </ManualCallSection>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ManualCallIntakeWorkspace;
