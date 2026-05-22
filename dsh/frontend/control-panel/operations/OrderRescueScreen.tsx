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
  DSH_OPS_INTERVENTION_PLAYBOOKS,
  DSH_ORDER_RESCUE_PREVIEW,
  getDshOrderRescueCase,
} from '../../shared';
import { buildOperationsHref } from './operations.registry';
import styles from '../shared/control-panel-surface.module.css';

export type OrderRescueScreenProps = {
  hubHref: string;
  subGroup?: string;
};

export function OrderRescueScreen({ hubHref: _hubHref, subGroup: _subGroup }: OrderRescueScreenProps) {
  const router = useRouter();
  const [selectedRescueId, setSelectedRescueId] = React.useState<string>(DSH_ORDER_RESCUE_PREVIEW[0]?.rescueId ?? '');
  const selectedCase = getDshOrderRescueCase(selectedRescueId) ?? DSH_ORDER_RESCUE_PREVIEW[0];
  const playbook = DSH_OPS_INTERVENTION_PLAYBOOKS.find((item) => item.triggerFlowIds.includes('order-rescue'));

  return (
    <div className={styles.surfaceCockpitContent}>
      <div className={styles.surfaceSectionHeader}>
        <h2 className={styles.surfaceSectionTitle}>Order Rescue</h2>
        <p className={styles.surfaceSectionSubtitle}>Blocker واحد واضح، owner واحد واضح، وWLT يبقى مرجعًا فقط عند الحاجة.</p>
      </div>

      <WebControlPanelKpiStrip
        items={[
          { id: 'total', label: 'حالات rescue', value: String(DSH_ORDER_RESCUE_PREVIEW.length), tone: 'neutral' },
          { id: 'critical', label: 'حرجة', value: String(DSH_ORDER_RESCUE_PREVIEW.filter((item) => item.severity === 'danger').length), tone: 'danger' },
          { id: 'wlt', label: 'WLT visibility', value: String(DSH_ORDER_RESCUE_PREVIEW.filter((item) => item.issueKind === 'payment_failure' || item.issueKind === 'wlt_visibility').length), tone: 'warning' },
          { id: 'support', label: 'handoff داعم', value: 'required', tone: 'success' },
        ]}
      />

      {playbook ? (
        <WebControlPanelRecommendation
          title={playbook.title}
          reason={`${playbook.checkpoints.join(' · ')} · ${playbook.nextDecision}`}
          confidence="high"
          auditTag={playbook.playbookId}
          primaryAction={{ id: 'open-exceptions', label: 'فتح الاستثناءات', onAction: () => router.push(buildOperationsHref('exceptions-escalations')) }}
          secondaryAction={{ id: 'open-assisted', label: 'فتح Assisted Order', onAction: () => router.push(buildOperationsHref('assisted-order-desk')) }}
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
                reason={item.wltBoundary}
                sla={item.allowedActions.join(' · ')}
                primaryAction={{ id: `${item.rescueId}-open`, label: 'فتح الحالة', onAction: () => setSelectedRescueId(item.rescueId) }}
                secondaryAction={{ id: `${item.rescueId}-command`, label: 'غرفة القيادة', onAction: () => router.push(buildOperationsHref('command-center')) }}
              />
            ))}
          </Box>
        </div>

        <aside className={styles.surfaceInspectorPanel}>
          {selectedCase ? (
            <>
              <div className={styles.surfaceSectionHeader}>
                <h3 className={styles.surfaceSectionTitle}>{selectedCase.orderId}</h3>
                <p className={styles.surfaceSectionSubtitle}>{selectedCase.blocker}</p>
              </div>

              <div className={styles.surfaceInspectorMeta}>
                <div className={styles.surfaceInspectorRow}>
                  <strong>issueKind</strong>
                  <span>{selectedCase.issueKind}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>severity</strong>
                  <span>{selectedCase.severity}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>policy</strong>
                  <span>{selectedCase.onDemandPolicy}</span>
                </div>
                <div className={styles.surfaceInspectorRow}>
                  <strong>WLT</strong>
                  <span>{selectedCase.wltBoundary}</span>
                </div>
              </div>

              <div className={styles.surfaceStackSmall}>
                <div className={styles.surfaceInfoCardTitle}>allowedActions</div>
                <div className={styles.surfaceActionWrap}>
                  {selectedCase.allowedActions.map((action) => (
                    <span key={action} className={styles.surfaceMetaChip}>{action}</span>
                  ))}
                </div>
              </div>

              <div className={styles.surfaceStackSmall}>
                <div className={styles.surfaceInfoCardTitle}>forbiddenActions</div>
                <div className={styles.surfaceActionWrap}>
                  {selectedCase.forbiddenActions.map((action) => (
                    <span key={action} className={styles.surfaceMetaChip}>{action}</span>
                  ))}
                </div>
              </div>

              <Box gap={2}>
                {selectedCase.crossSurfaceLinks.map((link) => (
                  <WebControlPanelDecisionRow
                    key={link.label}
                    entityId={link.sectionId}
                    entityLabel={link.label}
                    status={link.sectionId}
                    statusTone={link.surfaceId === 'wlt-finance' ? 'warning' : 'neutral'}
                    recommendation={`${link.surfaceId} · ${link.onDemandPolicy}`}
                    primaryAction={{ id: `${selectedCase.rescueId}-${link.label}`, label: 'فتح الرابط', onAction: () => router.push(link.routeHint) }}
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

export default OrderRescueScreen;
