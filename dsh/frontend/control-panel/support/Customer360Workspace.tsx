import React from 'react';
import { Box } from '@bthwani/ui-kit';
import { WebControlPanelDecisionRow, WebControlPanelKpiStrip } from '@bthwani/ui-kit/web';
import { DSH_CUSTOMER_360_PREVIEW, getDshCustomer360Record, getDshCustomer360SectionOwnerLabel } from '../../shared';
import styles from '../shared/control-panel-surface.module.css';

export type Customer360WorkspaceProps = {
  onOpenAssistedOrder?: (customerId: string) => void;
  onOpenOrderRescue?: (orderId?: string) => void;
  onOpenCallIntake?: (customerId: string) => void;
};

export function Customer360Workspace({
  onOpenAssistedOrder,
  onOpenOrderRescue,
  onOpenCallIntake,
}: Customer360WorkspaceProps) {
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string>(DSH_CUSTOMER_360_PREVIEW[0]?.customerId ?? '');
  const selectedRecord = getDshCustomer360Record(selectedCustomerId) ?? DSH_CUSTOMER_360_PREVIEW[0];

  return (
    <div className={styles.surfaceCockpitContent}>
      <div className={styles.surfaceSectionHeader}>
        <h2 className={styles.surfaceSectionTitle}>Customer 360</h2>
        <p className={styles.surfaceSectionSubtitle}>سياق واحد للعميل يربط الطلب والتذكرة وWLT visibility وquick actions إلى العمليات.</p>
      </div>

      <WebControlPanelKpiStrip
        items={[
          { id: 'customers', label: 'عملاء مفتوحون', value: String(DSH_CUSTOMER_360_PREVIEW.length), tone: 'neutral' },
          { id: 'verified', label: 'متحققون', value: String(DSH_CUSTOMER_360_PREVIEW.filter((item) => item.verificationStatus === 'verified').length), tone: 'success' },
          { id: 'blocked', label: 'قيود حساسة', value: String(DSH_CUSTOMER_360_PREVIEW.filter((item) => item.verificationStatus !== 'verified').length), tone: 'warning' },
          { id: 'wlt', label: 'WLT', value: 'read-only', tone: 'danger' },
        ]}
      />

      <div className={styles.surfaceSplitGrid}>
        <div className={styles.surfaceListColumn}>
          <Box gap={2}>
            {DSH_CUSTOMER_360_PREVIEW.map((item) => (
              <WebControlPanelDecisionRow
                key={item.customerId}
                entityId={item.customerId}
                entityLabel={`${item.customerName} · ${item.latestIssueSummary}`}
                status={item.verificationStatus === 'verified' ? 'متحقق' : item.verificationStatus === 'required' ? 'يتطلب تحقق' : 'محجوب'}
                statusTone={item.verificationStatus === 'verified' ? 'success' : item.verificationStatus === 'required' ? 'warning' : 'danger'}
                recommendation={item.wltVisibilitySummary}
                reason={`المدينة: ${item.cityLabel} · order=${item.activeOrderId ?? '—'} · ticket=${item.openTicketId ?? '—'}`}
                primaryAction={{ id: `${item.customerId}-open`, label: 'فتح العميل', onAction: () => setSelectedCustomerId(item.customerId) }}
                secondaryAction={{
                  id: `${item.customerId}-assist`,
                  label: 'Assisted Order',
                  onAction: () => onOpenAssistedOrder?.(item.customerId),
                }}
              />
            ))}
          </Box>
        </div>

        <aside className={styles.surfaceInspectorPanel}>
          {selectedRecord ? (
            <>
              <div className={styles.surfaceSectionHeader}>
                <h3 className={styles.surfaceSectionTitle}>{selectedRecord.customerName}</h3>
                <p className={styles.surfaceSectionSubtitle}>{selectedRecord.latestIssueSummary}</p>
              </div>

              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>maskedPhone</strong>
                  <span>{selectedRecord.maskedPhone}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>verification</strong>
                  <span>{selectedRecord.verificationStatus}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>owner</strong>
                  <span>{getDshCustomer360SectionOwnerLabel('support')}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>WLT</strong>
                  <span>{selectedRecord.wltVisibilitySummary}</span>
                </div>
              </div>

              <div className={styles.surfaceStackSmall}>
                <div className={styles.surfaceInfoCardTitle}>allowedActions</div>
                <div className={styles.surfaceActionWrap}>
                  {selectedRecord.allowedActions.map((action) => (
                    <span key={action} className={styles.surfaceMetaChip}>{action}</span>
                  ))}
                </div>
              </div>

              <div className={styles.surfaceStackSmall}>
                <div className={styles.surfaceInfoCardTitle}>forbiddenActions</div>
                <div className={styles.surfaceActionWrap}>
                  {selectedRecord.forbiddenActions.map((action) => (
                    <span key={action} className={styles.surfaceMetaChip}>{action}</span>
                  ))}
                </div>
              </div>

              <Box gap={2}>
                {selectedRecord.quickActions.map((action) => (
                  <WebControlPanelDecisionRow
                    key={action.label}
                    entityId={action.sectionId}
                    entityLabel={action.label}
                    status={action.surfaceId}
                    statusTone={action.surfaceId === 'wlt-finance' ? 'warning' : 'neutral'}
                    recommendation={action.routeHint}
                    primaryAction={{
                      id: `${selectedRecord.customerId}-${action.label}`,
                      label: 'فتح',
                      onAction: () => {
                        if (action.label.includes('Call Intake')) {
                          onOpenCallIntake?.(selectedRecord.customerId);
                        } else if (action.label.includes('Rescue')) {
                          onOpenOrderRescue?.(selectedRecord.activeOrderId);
                        } else {
                          onOpenAssistedOrder?.(selectedRecord.customerId);
                        }
                      },
                    }}
                  />
                ))}
              </Box>
            </>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

export default Customer360Workspace;
