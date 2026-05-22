'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelKpiStrip,
  WebControlPanelRecommendation,
} from '@bthwani/ui-kit/web';
import {
  DSH_ASSISTED_ORDER_PREVIEW,
  DSH_OPS_INTERVENTION_PLAYBOOKS,
  getDshAssistedOrderById,
} from '../../shared';
import { buildOperationsHref } from './operations.registry';
import styles from '../shared/control-panel-surface.module.css';

export type AssistedOrderDeskScreenProps = {
  hubHref: string;
  subGroup?: string;
};

export function AssistedOrderDeskScreen({ hubHref: _hubHref, subGroup: _subGroup }: AssistedOrderDeskScreenProps) {
  const router = useRouter();
  const [selectedDeskId, setSelectedDeskId] = React.useState<string>(DSH_ASSISTED_ORDER_PREVIEW[0]?.deskId ?? '');
  const selectedDesk = getDshAssistedOrderById(selectedDeskId) ?? DSH_ASSISTED_ORDER_PREVIEW[0];
  const relevantPlaybook = DSH_OPS_INTERVENTION_PLAYBOOKS.find((playbook) => playbook.triggerFlowIds.includes('assisted-order-desk'));

  const kpis = [
    { id: 'desk', label: 'حالات المساعدة', value: String(DSH_ASSISTED_ORDER_PREVIEW.length), tone: 'neutral' as const },
    { id: 'verified', label: 'هوية مكتملة', value: String(DSH_ASSISTED_ORDER_PREVIEW.filter((item) => item.identityStatus === 'verified').length), tone: 'success' as const },
    { id: 'blocked', label: 'حقول محجوبة', value: String(DSH_ASSISTED_ORDER_PREVIEW.filter((item) => item.identityStatus !== 'verified').length), tone: 'warning' as const },
    { id: 'wlt', label: 'WLT مرجعي', value: 'read-only', tone: 'danger' as const },
  ];

  return (
    <div className={styles.surfaceCockpitContent}>
      <div className={styles.surfaceSectionHeader}>
        <h2 className={styles.surfaceSectionTitle}>Assisted Order Desk</h2>
        <p className={styles.surfaceSectionSubtitle}>تجميع السلة والهوية والبدائل داخل العمليات دون تجاوز WLT أو support ownership.</p>
      </div>

      <WebControlPanelKpiStrip items={kpis} />

      {relevantPlaybook ? (
        <WebControlPanelRecommendation
          title={relevantPlaybook.title}
          reason={`${relevantPlaybook.checkpoints.join(' · ')} · القرار التالي: ${relevantPlaybook.nextDecision}`}
          confidence={relevantPlaybook.severity === 'danger' ? 'high' : 'medium'}
          auditTag={relevantPlaybook.playbookId}
          primaryAction={{ id: 'open-rescue', label: 'فتح Order Rescue', onAction: () => router.push(buildOperationsHref('order-rescue')) }}
          secondaryAction={{ id: 'open-command', label: 'غرفة القيادة', onAction: () => router.push(buildOperationsHref('command-center')) }}
        />
      ) : null}

      <div className={styles.surfaceSplitGrid}>
        <div className={styles.surfaceListColumn}>
          <Box gap={2}>
            {DSH_ASSISTED_ORDER_PREVIEW.map((desk) => (
              <WebControlPanelDecisionRow
                key={desk.deskId}
                entityId={desk.orderId ?? desk.customerId}
                entityLabel={`${desk.customerName} · ${desk.basketSummary}`}
                status={desk.identityStatus === 'verified' ? 'الهوية مكتملة' : desk.identityStatus === 'pending' ? 'بانتظار تحقق' : 'محجوب'}
                statusTone={desk.identityStatus === 'verified' ? 'success' : desk.identityStatus === 'pending' ? 'warning' : 'danger'}
                risk={desk.identityStatus === 'blocked' ? 'danger' : 'warning'}
                recommendation={desk.nextAction}
                reason={`${desk.source} · ${desk.wltBoundary}`}
                sla={desk.auditFlags.join(' · ')}
                primaryAction={{ id: `${desk.deskId}-open`, label: 'فتح الحالة', onAction: () => setSelectedDeskId(desk.deskId) }}
                secondaryAction={{
                  id: `${desk.deskId}-rescue`,
                  label: 'فتح الإنقاذ',
                  onAction: () => router.push(buildOperationsHref('order-rescue', { orderId: desk.orderId })),
                }}
              />
            ))}
          </Box>
        </div>

        <aside className={styles.surfaceInspectorPanel}>
          {selectedDesk ? (
            <>
              <div className={styles.surfaceSectionHeader}>
                <h3 className={styles.surfaceSectionTitle}>{selectedDesk.customerName}</h3>
                <p className={styles.surfaceSectionSubtitle}>{selectedDesk.basketSummary}</p>
              </div>

              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>source</strong>
                  <span>{selectedDesk.source}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>maskedPhone</strong>
                  <span>{selectedDesk.maskedPhone}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>identity</strong>
                  <span>{selectedDesk.identityStatus}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>stage</strong>
                  <span>{selectedDesk.activeStage}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>WLT</strong>
                  <span>{selectedDesk.wltBoundary}</span>
                </div>
              </div>

              <div className={styles.surfaceStackSmall}>
                <div className={styles.surfaceInfoCardTitle}>allowedActions</div>
                <div className={styles.surfaceActionWrap}>
                  {selectedDesk.allowedActions.map((action) => (
                    <span key={action} className={styles.surfaceMetaChip}>{action}</span>
                  ))}
                </div>
              </div>

              <div className={styles.surfaceStackSmall}>
                <div className={styles.surfaceInfoCardTitle}>forbiddenActions</div>
                <div className={styles.surfaceActionWrap}>
                  {selectedDesk.forbiddenActions.map((action) => (
                    <span key={action} className={styles.surfaceMetaChip}>{action}</span>
                  ))}
                </div>
              </div>

              <Box gap={2}>
                {selectedDesk.crossSurfaceLinks.map((link) => (
                  <WebControlPanelDecisionRow
                    key={link.label}
                    entityId={link.sectionId}
                    entityLabel={link.label}
                    status={link.sectionId}
                    statusTone={link.surfaceId === 'wlt-finance' ? 'warning' : 'neutral'}
                    recommendation={`${link.surfaceId} · ${link.onDemandPolicy}`}
                    primaryAction={{ id: `${selectedDesk.deskId}-${link.label}`, label: 'فتح الرابط', onAction: () => router.push(link.routeHint) }}
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

export default AssistedOrderDeskScreen;
