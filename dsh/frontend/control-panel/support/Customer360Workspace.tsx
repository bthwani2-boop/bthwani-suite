'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box } from '@bthwani/ui-kit';
import { WebControlPanelDecisionRow, WebControlPanelKpiStrip } from '@bthwani/ui-kit/web';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DshCustomer360OrderSummary = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DshCustomer360Record = Record<string, any>;
const DSH_CUSTOMER_360_PREVIEW: DshCustomer360Record[] = [];
function getDshCustomer360ByContext(_ctx: unknown): DshCustomer360Record | null { return null; }
function getDshCustomer360Record(_id: string): DshCustomer360Record | undefined { return undefined; }
import type { DshGlobalControlLink } from '../../shared/contracts/dsh-order.contract';
import styles from '../shared/control-panel-surface.module.css';
import { SUPPORT_VERIFICATION_STATUS_META, SUPPORT_TICKET_STATUS_META } from './support.types';

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

type SectionHeadingText = string;
type SectionNoteText = string;
type Customer360SectionProps = { title: SectionHeadingText; description?: SectionNoteText; children: React.ReactNode };

function Customer360Section({ title, description, children }: Customer360SectionProps) {
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
        label: 'موثقون',
        value: String(DSH_CUSTOMER_360_PREVIEW.filter((item) => item.verificationStatus === 'verified').length),
        tone: 'success' as const,
      },
      {
        id: 'escalated',
        label: 'تذاكر مصعّدة',
        value: String(
          DSH_CUSTOMER_360_PREVIEW.flatMap((item) => item.ticketsHistory).filter((ticket) => ticket.status === 'escalated').length,
        ),
        tone: 'warning' as const,
      },
      { id: 'wlt', label: 'المحفظة المالية WLT', value: 'قراءة فقط', tone: 'danger' as const },
    ],
    [],
  );

  if (!selectedRecord) {
    return null;
  }

  const selectedContext = buildCustomer360RouteContext(selectedRecord);
  const selectedVerificationMeta = SUPPORT_VERIFICATION_STATUS_META[selectedRecord.verificationStatus];
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
        <h2 className={styles.surfaceSectionTitle}>ملف العميل المتكامل</h2>
        <p className={styles.surfaceSectionSubtitle}>
          ملخص أولاً ثم تفاصيل عند الفتح: الفلاتر، آخر 5 طلبات، السجل التاريخي، رؤية المحفظة المالية WLT، الملاحظات، ثم الإجراءات السريعة إلى العمليات أو الدعم.
        </p>
      </div>

      <WebControlPanelKpiStrip items={kpis} />

      <div className={styles.surfaceSplitGrid}>
        <div className={styles.surfaceListColumn}>
          <Box gap={2}>
            {DSH_CUSTOMER_360_PREVIEW.map((item) => {
              const verificationMeta = SUPPORT_VERIFICATION_STATUS_META[item.verificationStatus];

              return (
                <WebControlPanelDecisionRow
                  key={item.customerId}
                  entityId={item.customerId}
                  entityLabel={`${item.customerName} · ${item.latestIssueSummary}`}
                  status={verificationMeta.label}
                  statusTone={verificationMeta.tone}
                  recommendation={item.wltVisibilitySummary}
                  reason={`${item.searchFilters.areaZoneLabel} · طلب=${item.activeOrderId ?? '—'} · تذكرة=${item.openTicketId ?? '—'}`}
                  sla={`فلتر=${item.searchFilters.dateRangeLabel} · ${item.searchFilters.wltVisibilityLabel}`}
                  primaryAction={{
                    id: `${item.customerId}-open`,
                    label: 'فتح سجل العميل',
                    onAction: () => setSelectedCustomerId(item.customerId),
                  }}
                  secondaryAction={{
                    id: `${item.customerId}-ops`,
                    label: 'فتح مساعدة الطلب',
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
              title="البحث والفلتر"
              description={`تاريخ=${selectedRecord.searchFilters.dateRangeLabel} · توصيل=${searchDeliveryModeLabel}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                {selectedRecord.searchFilters.lookupInputs.map((input) => (
                  <div key={input.key} className={styles.surfaceInspectorRow}>
                    <strong>{input.label}</strong>
                    <span>{input.value}</span>
                  </div>
                ))}
                <div className={styles.surfaceInspectorRow}>
                  <strong>حالة التذكرة</strong>
                  <span>{selectedRecord.searchFilters.ticketStatus}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>رؤية المحفظة المالية WLT</strong>
                  <span>{selectedRecord.searchFilters.wltVisibilityLabel}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>المنطقة / النطاق</strong>
                  <span>{selectedRecord.searchFilters.areaZoneLabel}</span>
                </div>
              </div>
            </Customer360Section>

            <Customer360Section
              title="رؤية المحفظة المالية WLT"
              description={`تصنيف=${selectedRecord.wltReadOnlyVisibility.placeholderClassification} · ${selectedRecord.wltReadOnlyVisibility.calculationTruthOwner}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>الدفع</strong>
                  <span>{selectedRecord.wltReadOnlyVisibility.paymentVisibility}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>الاسترداد</strong>
                  <span>{selectedRecord.wltReadOnlyVisibility.refundVisibility}</span>
                </div>
                {selectedRecord.wltReadOnlyVisibility.settlementVisibility ? (
                  <div className={styles.surfaceInspectorRow}>
                    <strong>التسوية</strong>
                    <span>{selectedRecord.wltReadOnlyVisibility.settlementVisibility}</span>
                  </div>
                ) : null}
                <div className={styles.surfaceInspectorRow}>
                  <strong>المسار</strong>
                  <span>{selectedRecord.wltReadOnlyVisibility.routeHint}</span>
                </div>
              </div>
              <p className={styles.surfaceFootnote}>للقراءة فقط — حقائق الدفع والاسترداد والتسوية تبقى مملوكة لـ WLT.</p>
            </Customer360Section>
          </div>

          <Customer360Section
            title="ملخص آخر 5 طلبات"
            description={`توثيق=${selectedVerificationMeta.label} · ${selectedRecord.onDemandPolicy}`}
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
                  reason={`استرداد=${order.refundVisibility} · آخر تذكرة=${order.latestTicket}`}
                  sla={`مسار=${order.primaryAction.routeId ?? order.primaryAction.routeHint}`}
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
              title="سجل التذاكر"
              description="مفتوحة / محلولة / مصعّدة مع مدة SLA وصاحب التذكرة وآخر ملاحظة."
            >
              <Box gap={2}>
                {selectedRecord.ticketsHistory.map((ticket) => (
                  <WebControlPanelDecisionRow
                    key={ticket.ticketId}
                    entityId={ticket.ticketId}
                    entityLabel={ticket.owner}
                    status={ticket.statusLabel}
                    statusTone={SUPPORT_TICKET_STATUS_META[ticket.status].tone}
                    recommendation={ticket.latestNote}
                    reason={`مسار=${ticket.routeHint}`}
                    sla={`مدة SLA: ${ticket.sla}`}
                    primaryAction={{
                      id: `${ticket.ticketId}-open`,
                      label: 'فتح التذكرة',
                      onAction: () => openRouteHint(ticket.routeHint),
                    }}
                  />
                ))}
              </Box>
            </Customer360Section>

            <Customer360Section
              title="العنوان والخدمة"
              description={`حالة=${selectedRecord.addressServiceability.serviceabilityStatus} · ${selectedRecord.addressServiceability.previewClassification}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>آخر عنوان</strong>
                  <span>{selectedRecord.addressServiceability.lastAddress}</span>
                </div>
                {selectedRecord.addressServiceability.outOfZoneReason ? (
                  <div className={styles.surfaceInspectorRow}>
                    <strong>سبب خارج النطاق</strong>
                    <span>{selectedRecord.addressServiceability.outOfZoneReason}</span>
                  </div>
                ) : null}
              </div>
            </Customer360Section>
          </div>

          <Customer360Section
            title="سجل الملاحظات"
            description="ملاحظة دعم / ملاحظة عمليات / ملاحظة تدقيق"
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
            title="الإجراءات السريعة"
            description={`إشارة=${selectedRecord.contextSignal.routeId} · أولوية=${selectedRecord.contextSignal.priorityLabel}`}
          >
            <Box gap={2}>
              {selectedRecord.quickActions.map((action) => (
                <WebControlPanelDecisionRow
                  key={action.actionId}
                  entityId={action.sectionId}
                  entityLabel={action.label}
                  status={action.surfaceId}
                  statusTone={action.readOnly ? 'warning' : 'neutral'}
                  recommendation={`${action.routeId ?? 'مسار'} · ${action.onDemandPolicy}`}
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
