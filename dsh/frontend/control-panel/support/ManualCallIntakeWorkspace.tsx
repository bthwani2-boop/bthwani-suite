import React from 'react';
import { Box } from '@bthwani/ui-kit';
import { WebControlPanelDecisionRow, WebControlPanelKpiStrip } from '@bthwani/ui-kit/web';
import { DSH_CALL_INTAKE_PREVIEW, getDshCallIntakePreview } from '../../shared';
import styles from '../shared/control-panel-surface.module.css';

export type ManualCallIntakeWorkspaceProps = {
  onOpenCustomer360?: (customerId: string) => void;
  onOpenAssistedOrder?: (customerId: string) => void;
};

export function ManualCallIntakeWorkspace({
  onOpenCustomer360,
  onOpenAssistedOrder,
}: ManualCallIntakeWorkspaceProps) {
  const [selectedIntakeId, setSelectedIntakeId] = React.useState<string>(DSH_CALL_INTAKE_PREVIEW[0]?.intakeId ?? '');
  const selectedRecord = getDshCallIntakePreview(selectedIntakeId) ?? DSH_CALL_INTAKE_PREVIEW[0];

  return (
    <div className={styles.surfaceCockpitContent}>
      <div className={styles.surfaceSectionHeader}>
        <h2 className={styles.surfaceSectionTitle}>Manual Call Intake</h2>
        <p className={styles.surfaceSectionSubtitle}>المصدر ثابت = external_phone_manual، والحقول الحساسة تبقى محجوبة حتى يكتمل التحقق.</p>
      </div>

      <WebControlPanelKpiStrip
        items={[
          { id: 'calls', label: 'مكالمات مفتوحة', value: String(DSH_CALL_INTAKE_PREVIEW.length), tone: 'neutral' },
          { id: 'verified', label: 'خطوات مكتملة', value: String(DSH_CALL_INTAKE_PREVIEW.flatMap((item) => item.verificationSteps).filter((step) => step.completed).length), tone: 'success' },
          { id: 'locked', label: 'حقول محجوبة', value: String(DSH_CALL_INTAKE_PREVIEW.reduce((sum, item) => sum + item.sensitiveFieldsLocked.length, 0)), tone: 'warning' },
          { id: 'source', label: 'المصدر', value: 'external_phone_manual', tone: 'danger' },
        ]}
      />

      <div className={styles.surfaceSplitGrid}>
        <div className={styles.surfaceListColumn}>
          <Box gap={2}>
            {DSH_CALL_INTAKE_PREVIEW.map((record) => (
              <WebControlPanelDecisionRow
                key={record.intakeId}
                entityId={record.intakeId}
                entityLabel={`${record.customerName} · ${record.issueSummary}`}
                status={record.verificationSteps.every((step) => step.completed) ? 'مكتمل' : 'قيد التحقق'}
                statusTone={record.verificationSteps.every((step) => step.completed) ? 'success' : 'warning'}
                recommendation={record.nextAction}
                reason={`source=${record.source} · locked=${record.sensitiveFieldsLocked.join('، ')}`}
                primaryAction={{ id: `${record.intakeId}-open`, label: 'فتح المكالمة', onAction: () => setSelectedIntakeId(record.intakeId) }}
                secondaryAction={{ id: `${record.intakeId}-360`, label: 'Customer 360', onAction: () => onOpenCustomer360?.(record.customerId) }}
              />
            ))}
          </Box>
        </div>

        <aside className={styles.surfaceInspectorPanel}>
          {selectedRecord ? (
            <>
              <div className={styles.surfaceSectionHeader}>
                <h3 className={styles.surfaceSectionTitle}>{selectedRecord.customerName}</h3>
                <p className={styles.surfaceSectionSubtitle}>{selectedRecord.issueSummary}</p>
              </div>

              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>source</strong>
                  <span>{selectedRecord.source}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>maskedPhone</strong>
                  <span>{selectedRecord.maskedPhone}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>locked</strong>
                  <span>{selectedRecord.sensitiveFieldsLocked.join('، ')}</span>
                </div>
              </div>

              <div className={styles.surfaceStackSmall}>
                <div className={styles.surfaceInfoCardTitle}>verificationSteps</div>
                <div className={styles.surfaceActionWrap}>
                  {selectedRecord.verificationSteps.map((step) => (
                    <span key={step.stepId} className={styles.surfaceMetaChip}>
                      {step.completed ? '✓' : '…'} {step.label}
                    </span>
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
                <WebControlPanelDecisionRow
                  entityId={selectedRecord.customerId}
                  entityLabel="Assisted Order handoff"
                  status={selectedRecord.onDemandPolicy}
                  statusTone="neutral"
                  recommendation={selectedRecord.nextAction}
                  primaryAction={{ id: `${selectedRecord.intakeId}-assist`, label: 'فتح Assisted Order', onAction: () => onOpenAssistedOrder?.(selectedRecord.customerId) }}
                />
              </Box>
            </>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

export default ManualCallIntakeWorkspace;
