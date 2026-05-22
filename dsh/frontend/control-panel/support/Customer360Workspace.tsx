'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box } from '@bthwani/ui-kit';
import { WebControlPanelDecisionRow, WebControlPanelKpiStrip } from '@bthwani/ui-kit/web';
import {
  DSH_CUSTOMER_360_PREVIEW,
  getDshCustomer360ByContext,
  getDshCustomer360Record,
  type DshCustomer360OrderSummary,
  type DshCustomer360Record,
  type DshGlobalControlLink,
} from '../../shared';
import styles from '../shared/control-panel-surface.module.css';

export type Customer360WorkspaceRouteContext = {
  customerId: string;
  orderId?: string;
  ticketId?: string;
};

export type Customer360WorkspaceProps = {
  onOpenAssistedOrder?: (context: Customer360WorkspaceRouteContext) => void;
  onOpenOrderRescue?: (context: Customer360WorkspaceRouteContext) => void;
  onOpenCallIntake?: (context: Customer360WorkspaceRouteContext) => void;
};

const VERIFICATION_STATUS_META = {
  verified: { label: 'verified', tone: 'success' as const },
  required: { label: 'required', tone: 'warning' as const },
  blocked: { label: 'blocked', tone: 'danger' as const },
} as const;

const TICKET_STATUS_META = {
  open: { tone: 'warning' as const },
  resolved: { tone: 'success' as const },
  escalated: { tone: 'danger' as const },
} as const;

function Customer360Section({
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

function buildCustomer360RouteContext(record: DshCustomer360Record): Customer360WorkspaceRouteContext {
  return {
    customerId: record.customerId,
    orderId: record.activeOrderId,
    ticketId: record.openTicketId,
  };
}

export function Customer360Workspace({
  onOpenAssistedOrder,
  onOpenOrderRescue,
  onOpenCallIntake,
}: Customer360WorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string>(DSH_CUSTOMER_360_PREVIEW[0]?.customerId ?? '');

  React.useEffect(() => {
    const matchedRecord = getDshCustomer360ByContext({
      customerId: searchParams.get('customerId'),
      orderId: searchParams.get('orderId'),
      ticketId: searchParams.get('ticketId'),
    });

    if (matchedRecord) {
      setSelectedCustomerId(matchedRecord.customerId);
    }
  }, [searchParams]);

  const selectedRecord = React.useMemo(
    () => getDshCustomer360Record(selectedCustomerId) ?? DSH_CUSTOMER_360_PREVIEW[0],
    [selectedCustomerId],
  );
  const kpis = React.useMemo(
    () => [
      { id: 'customers', label: 'سجلات 360', value: String(DSH_CUSTOMER_360_PREVIEW.length), tone: 'neutral' as const },
      {
        id: 'verified',
        label: 'verified',
        value: String(DSH_CUSTOMER_360_PREVIEW.filter((item) => item.verificationStatus === 'verified').length),
        tone: 'success' as const,
      },
      {
        id: 'escalated',
        label: 'tickets escalated',
        value: String(
          DSH_CUSTOMER_360_PREVIEW.flatMap((item) => item.ticketsHistory).filter((ticket) => ticket.status === 'escalated').length,
        ),
        tone: 'warning' as const,
      },
      { id: 'wlt', label: 'WLT', value: 'read-only', tone: 'danger' as const },
    ],
    [],
  );

  if (!selectedRecord) {
    return null;
  }

  const selectedContext = buildCustomer360RouteContext(selectedRecord);
  const selectedVerificationMeta = VERIFICATION_STATUS_META[selectedRecord.verificationStatus];
  const searchDeliveryModeLabel =
    selectedRecord.lastFiveOrdersSummary.find((order) => order.deliveryMode === selectedRecord.searchFilters.deliveryMode)?.deliveryModeLabel ??
    selectedRecord.searchFilters.deliveryMode;

  function openRouteHint(routeHint: string) {
    router.push(routeHint);
  }

  function openOrderSummaryAction(order: DshCustomer360OrderSummary) {
    openRouteHint(order.primaryAction.routeHint);
  }

  function openQuickAction(action: DshGlobalControlLink) {
    if (action.actionId === 'open-assisted-order') {
      if (onOpenAssistedOrder) {
        onOpenAssistedOrder(selectedContext);
        return;
      }

      openRouteHint(action.routeHint);
      return;
    }

    if (action.actionId === 'open-order-rescue') {
      if (onOpenOrderRescue) {
        onOpenOrderRescue(selectedContext);
        return;
      }

      openRouteHint(action.routeHint);
      return;
    }

    if (action.actionId === 'open-manual-call-intake') {
      if (onOpenCallIntake) {
        onOpenCallIntake(selectedContext);
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
        <h2 className={styles.surfaceSectionTitle}>Customer 360</h2>
        <p className={styles.surfaceSectionSubtitle}>
          summary first ثم details on open: filters، آخر 5 طلبات، history، WLT visibility، notes، ثم quick actions إلى العمليات أو الدعم.
        </p>
      </div>

      <WebControlPanelKpiStrip items={kpis} />

      <div className={styles.surfaceSplitGrid}>
        <div className={styles.surfaceListColumn}>
          <Box gap={2}>
            {DSH_CUSTOMER_360_PREVIEW.map((item) => {
              const verificationMeta = VERIFICATION_STATUS_META[item.verificationStatus];

              return (
                <WebControlPanelDecisionRow
                  key={item.customerId}
                  entityId={item.customerId}
                  entityLabel={`${item.customerName} · ${item.latestIssueSummary}`}
                  status={verificationMeta.label}
                  statusTone={verificationMeta.tone}
                  recommendation={item.wltVisibilitySummary}
                  reason={`${item.searchFilters.areaZoneLabel} · order=${item.activeOrderId ?? '—'} · ticket=${item.openTicketId ?? '—'}`}
                  sla={`filters=${item.searchFilters.dateRangeLabel} · ${item.searchFilters.wltVisibilityLabel}`}
                  primaryAction={{
                    id: `${item.customerId}-open`,
                    label: 'فتح customer',
                    onAction: () => setSelectedCustomerId(item.customerId),
                  }}
                  secondaryAction={{
                    id: `${item.customerId}-ops`,
                    label: 'فتح Assisted Order',
                    onAction: () =>
                      onOpenAssistedOrder
                        ? onOpenAssistedOrder({
                            customerId: item.customerId,
                            orderId: item.activeOrderId,
                            ticketId: item.openTicketId,
                          })
                        : openRouteHint(
                            `/operations?workspace=assisted-order-desk&customerId=${item.customerId}${
                              item.activeOrderId ? `&orderId=${item.activeOrderId}` : ''
                            }${item.openTicketId ? `&ticketId=${item.openTicketId}` : ''}`,
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
            <p className={styles.surfaceSectionSubtitle}>{selectedRecord.latestIssueSummary}</p>
          </div>

          <div className={styles.surfaceGridTwoCol}>
            <Customer360Section
              title="search / filter"
              description={`date=${selectedRecord.searchFilters.dateRangeLabel} · delivery=${searchDeliveryModeLabel}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                {selectedRecord.searchFilters.lookupInputs.map((input) => (
                  <div key={input.key} className={styles.surfaceInspectorRow}>
                    <strong>{input.label}</strong>
                    <span>{input.value}</span>
                  </div>
                ))}
                <div className={styles.surfaceInspectorRow}>
                  <strong>ticket status</strong>
                  <span>{selectedRecord.searchFilters.ticketStatus}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>WLT visibility</strong>
                  <span>{selectedRecord.searchFilters.wltVisibilityLabel}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>area / zone</strong>
                  <span>{selectedRecord.searchFilters.areaZoneLabel}</span>
                </div>
              </div>
            </Customer360Section>

            <Customer360Section
              title="WLT visibility"
              description={`classification=${selectedRecord.wltReadOnlyVisibility.placeholderClassification} · ${selectedRecord.wltReadOnlyVisibility.calculationTruthOwner}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>payment</strong>
                  <span>{selectedRecord.wltReadOnlyVisibility.paymentVisibility}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>refund</strong>
                  <span>{selectedRecord.wltReadOnlyVisibility.refundVisibility}</span>
                </div>
                {selectedRecord.wltReadOnlyVisibility.settlementVisibility ? (
                  <div className={styles.surfaceInspectorRow}>
                    <strong>settlement</strong>
                    <span>{selectedRecord.wltReadOnlyVisibility.settlementVisibility}</span>
                  </div>
                ) : null}
                <div className={styles.surfaceInspectorRow}>
                  <strong>route</strong>
                  <span>{selectedRecord.wltReadOnlyVisibility.routeHint}</span>
                </div>
              </div>
              <p className={styles.surfaceFootnote}>No mutation. Payment, refund, and settlement truth remain WLT-owned.</p>
            </Customer360Section>
          </div>

          <Customer360Section
            title="last 5 orders summary"
            description={`verification=${selectedVerificationMeta.label} · ${selectedRecord.onDemandPolicy}`}
          >
            <Box gap={2}>
              {selectedRecord.lastFiveOrdersSummary.map((order) => (
                <WebControlPanelDecisionRow
                  key={order.orderId}
                  entityId={order.orderId}
                  entityLabel={`${order.store} · ${order.deliveryModeLabel}`}
                  status={order.lifecycleStatus}
                  statusTone={order.refundVisibility.toLowerCase().includes('refund') ? 'warning' : 'neutral'}
                  recommendation={order.paymentVisibility}
                  reason={`refund=${order.refundVisibility} · latestTicket=${order.latestTicket}`}
                  sla={`route=${order.primaryAction.routeId ?? order.primaryAction.routeHint}`}
                  primaryAction={{
                    id: order.primaryAction.actionId,
                    label: order.primaryAction.label,
                    onAction: () => openOrderSummaryAction(order),
                  }}
                />
              ))}
            </Box>
          </Customer360Section>

          <div className={styles.surfaceGridTwoCol}>
            <Customer360Section
              title="tickets history"
              description="open / resolved / escalated مع SLA وowner وlatest note."
            >
              <Box gap={2}>
                {selectedRecord.ticketsHistory.map((ticket) => (
                  <WebControlPanelDecisionRow
                    key={ticket.ticketId}
                    entityId={ticket.ticketId}
                    entityLabel={ticket.owner}
                    status={ticket.statusLabel}
                    statusTone={TICKET_STATUS_META[ticket.status].tone}
                    recommendation={ticket.latestNote}
                    reason={`route=${ticket.routeHint}`}
                    sla={`SLA ${ticket.sla}`}
                    primaryAction={{
                      id: `${ticket.ticketId}-open`,
                      label: 'فتح ticket',
                      onAction: () => openRouteHint(ticket.routeHint),
                    }}
                  />
                ))}
              </Box>
            </Customer360Section>

            <Customer360Section
              title="address / serviceability"
              description={`status=${selectedRecord.addressServiceability.serviceabilityStatus} · ${selectedRecord.addressServiceability.previewClassification}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>last address</strong>
                  <span>{selectedRecord.addressServiceability.lastAddress}</span>
                </div>
                {selectedRecord.addressServiceability.outOfZoneReason ? (
                  <div className={styles.surfaceInspectorRow}>
                    <strong>out-of-zone reason</strong>
                    <span>{selectedRecord.addressServiceability.outOfZoneReason}</span>
                  </div>
                ) : null}
              </div>
            </Customer360Section>
          </div>

          <Customer360Section
            title="notes timeline"
            description="support note / ops note / audit note"
          >
            <Box gap={2}>
              {selectedRecord.notesTimeline.map((note) => (
                <div key={note.noteId} className={styles.surfaceInspectorMeta}>
                  <div className={styles.surfaceInspectorRow}>
                    <strong>{note.source}</strong>
                    <span>{note.timestampLabel}</span>
                  </div>
                  <p className={styles.surfaceFootnote}>{note.body}</p>
                </div>
              ))}
            </Box>
          </Customer360Section>

          <Customer360Section
            title="quick actions"
            description={`signal=${selectedRecord.contextSignal.routeId} · priority=${selectedRecord.contextSignal.priorityLabel}`}
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
                    id: `${selectedRecord.customerId}-${action.actionId}`,
                    label: 'فتح',
                    onAction: () => openQuickAction(action),
                  }}
                />
              ))}
            </Box>
          </Customer360Section>
        </aside>
      </div>
    </div>
  );
}

export default Customer360Workspace;
