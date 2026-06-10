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
} from '../../data/support.preview-data';
import type {
  DshGlobalControlLink,
  DshRouteHintedAction,
} from '../../shared/dsh-order-preview.contract';
import styles from '../shared/control-panel-surface.module.css';
import { SUPPORT_VERIFICATION_STATUS_META } from './support.types';

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

type ManualSectionHeading = string;
type ManualSectionNote = string;
type ManualCallSectionProps = { title: ManualSectionHeading; description?: ManualSectionNote; children: React.ReactNode };

function ManualCallSection({ title, description, children }: ManualCallSectionProps) {
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
      { id: 'calls', label: 'مكالمات يدوية', value: String(DSH_CALL_INTAKE_PREVIEW.length), tone: 'neutral' as const },
      {
        id: 'verified',
        label: 'هويات موثقة',
        value: String(DSH_CALL_INTAKE_PREVIEW.filter((item) => item.identityVerificationResult.verificationStatus === 'verified').length),
        tone: 'success' as const,
      },
      {
        id: 'blocked',
        label: 'هويات محظورة',
        value: String(DSH_CALL_INTAKE_PREVIEW.filter((item) => item.closeCallOutcome.outcome === 'blocked_identity').length),
        tone: 'warning' as const,
      },
      { id: 'source', label: 'المصدر', value: 'هاتفي يدوي', tone: 'danger' as const },
    ],
    [],
  );

  if (!selectedRecord) {
    return null;
  }

  const selectedContext = buildCallRouteContext(selectedRecord);
  const verificationMeta = SUPPORT_VERIFICATION_STATUS_META[selectedRecord.identityVerificationResult.verificationStatus];

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
        <h2 className={styles.surfaceSectionTitle}>استقبال المكالمات اليدوية</h2>
        <p className={styles.surfaceSectionSubtitle}>
          هاتفي يدوي فقط: بحث العميل، ثم سبب المكالمة، ثم معاينة الهوية والتذكرة، ثم التحويل أو الإغلاق — بدون أي وقت تشغيل للمكالمة أو تعديل مالي.
        </p>
      </div>

      <WebControlPanelKpiStrip items={kpis} />

      <div className={styles.surfaceSplitGrid}>
        <div className={styles.surfaceListColumn}>
          <Box gap={2}>
            {DSH_CALL_INTAKE_PREVIEW.map((record) => {
              const recordVerificationMeta = SUPPORT_VERIFICATION_STATUS_META[record.identityVerificationResult.verificationStatus];

              return (
                <WebControlPanelDecisionRow
                  key={record.intakeId}
                  entityId={record.intakeId}
                  entityLabel={`${record.customerName} · ${record.issueSummary}`}
                  status={recordVerificationMeta.label}
                  statusTone={recordVerificationMeta.tone}
                  recommendation={record.nextAction}
                  reason={`مصدر=${record.source} · سبب=${record.callReasonSelector.selectedReason}`}
                  sla={`تذكرة=${record.ticketPreview.ticketId} · نتيجة=${record.closeCallOutcome.outcome}`}
                  primaryAction={{
                    id: `${record.intakeId}-open`,
                    label: 'فتح المكالمة',
                    onAction: () => setSelectedIntakeId(record.intakeId),
                  }}
                  secondaryAction={{
                    id: `${record.intakeId}-customer360`,
                    label: 'فتح ملف العميل',
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
              title="بيانات البحث"
              description={`مصدر=${selectedRecord.source} · ${selectedRecord.onDemandPolicy}`}
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
              title="سبب المكالمة"
              description={`محدد=${selectedRecord.callReasonSelector.selectedReason} · ${selectedRecord.callReasonSelector.previewClassification}`}
            >
              <div className={styles.surfaceActionWrap}>
                {selectedRecord.callReasonSelector.options.map((reason) => (
                  <span key={reason} className={styles.surfaceMetaChip}>
                    {reason === selectedRecord.callReasonSelector.selectedReason ? 'محدد' : 'متاح'} · {reason}
                  </span>
                ))}
              </div>
            </ManualCallSection>
          </div>

          <div className={styles.surfaceGridTwoCol}>
            <ManualCallSection
              title="نتيجة التحقق من الهوية"
              description={`حالة=${verificationMeta.label} · ${selectedRecord.identityVerificationResult.previewClassification}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>التحقق</strong>
                  <span>{selectedRecord.identityVerificationResult.verificationStatus}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>الحقول المحظورة</strong>
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
                الإجراءات المحظورة: {selectedRecord.forbiddenActions.join(' · ')}
              </p>
            </ManualCallSection>

            <ManualCallSection
              title="إنشاء / ربط تذكرة"
              description={`وضع=${selectedRecord.ticketPreview.mode} · تدقيق=${String(selectedRecord.ticketPreview.auditRequired)}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>رقم التذكرة</strong>
                  <span>{selectedRecord.ticketPreview.ticketId}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>الملخص</strong>
                  <span>{selectedRecord.ticketPreview.summary}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>المسار</strong>
                  <span>{selectedRecord.ticketPreview.routeHint}</span>
                </div>
              </div>
            </ManualCallSection>
          </div>

          <ManualCallSection
            title="تحويل السياق إلى العمليات"
            description="مساعدة الطلب / إنقاذ الطلب / تصعيد الدعم"
          >
            <Box gap={2}>
              {selectedRecord.transferContextToOperations.map((action) => (
                <WebControlPanelDecisionRow
                  key={action.actionId}
                  entityId={selectedRecord.ticketPreview.ticketId}
                  entityLabel={action.label}
                  status={action.routeId ?? 'مسار'}
                  statusTone="neutral"
                  recommendation={`${action.onDemandPolicy} · تدقيق=${String(action.auditRequired ?? false)}`}
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
              title="نتيجة إغلاق المكالمة"
              description={`نتيجة=${selectedRecord.closeCallOutcome.outcome} · تدقيق=${String(selectedRecord.closeCallOutcome.auditRequired)}`}
            >
              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>الملخص</strong>
                  <span>{selectedRecord.closeCallOutcome.summary}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>الإشارة</strong>
                  <span>{selectedRecord.closeCallOutcome.signal.routeId}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>الأولوية</strong>
                  <span>{selectedRecord.closeCallOutcome.signal.priorityLabel}</span>
                </div>
              </div>
            </ManualCallSection>

            <ManualCallSection
              title="التدقيق والإجراءات السريعة"
              description={`تدقيق=${String(selectedRecord.auditRequired)} · المعرّفات أولاً`}
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
