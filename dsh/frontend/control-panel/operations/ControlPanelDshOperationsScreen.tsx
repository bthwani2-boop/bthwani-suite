'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Badge,
  Box,
  Button,
  StateView,
  StatCard,
  Text,
  useDirection,
  useUiText,
} from '@bthwani/ui-kit';
import {
  WebCommandCenterFrame,
  WebControlActionCard,
  WebControlDisclosureItem,
  WebSectionCard,
} from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard } from '../shared';
import {
  buildOperationsHref,
  getOperationsGroupMeta,
  NON_OPERATIONS_SECTION_SHORTCUTS,
  OPERATIONS_CANONICAL_GROUPS,
} from './operations.registry';
import {
  OPERATIONS_OVERVIEW_ACTIONS,
  OPERATIONS_PULSE_METRICS,
  OPERATIONS_TOP_FILTERS,
} from './operations.fixtures';
import { resolveOperationsStateCopy, type OperationsViewState } from './operations.state';
import type { CanonicalOperationsGroupId, OperationsPanelId } from './operations.types';
import { useDshControlPanelText } from './shared';
import styles from './dsh-surface.module.css';
import { OrdersLane } from './lanes/OrdersLane';
import { DispatchFleetLane } from './lanes/DispatchFleetLane';
import { TrackingHandoffLane } from './lanes/TrackingHandoffLane';
import { ExceptionsSlaLane } from './lanes/ExceptionsSlaLane';
import { PartnerReadinessLane } from './lanes/PartnerReadinessLane';
import { ProxySheinAwnakLane } from './lanes/ProxySheinAwnakLane';
import { AuditEvidenceLane } from './lanes/AuditEvidenceLane';

export type ControlPanelDshOperationsScreenProps = {
  group?: CanonicalOperationsGroupId;
  orderId?: string;
  panel?: OperationsPanelId;
  state?: OperationsViewState;
  fallbackHref?: string;
};

function resolveTopFilterGroup(filterId: string): CanonicalOperationsGroupId {
  return OPERATIONS_TOP_FILTERS.find((item) => item.id === filterId)?.group ?? 'overview';
}

function renderLane(
  group: CanonicalOperationsGroupId,
  options: {
    hubHref: string;
    orderId?: string;
    panel?: OperationsPanelId;
    state?: OperationsViewState;
  },
) {
  switch (group) {
    case 'orders':
      return <OrdersLane state={options.state} hubHref={options.hubHref} orderId={options.orderId} panel={options.panel} />;
    case 'dispatch-fleet':
      return <DispatchFleetLane state={options.state} hubHref={options.hubHref} />;
    case 'tracking-handoff':
      return <TrackingHandoffLane state={options.state} hubHref={options.hubHref} />;
    case 'exceptions-sla':
      return <ExceptionsSlaLane state={options.state} hubHref={options.hubHref} />;
    case 'partner-readiness':
      return <PartnerReadinessLane state={options.state} hubHref={options.hubHref} />;
    case 'proxy-shein-awnak':
      return <ProxySheinAwnakLane state={options.state} hubHref={options.hubHref} />;
    case 'audit-evidence':
      return <AuditEvidenceLane state={options.state} hubHref={options.hubHref} />;
    case 'overview':
    default:
      return null;
  }
}

export function ControlPanelDshOperationsScreen({
  group = 'overview',
  orderId,
  panel,
  state = 'ready',
  fallbackHref = '/operations',
}: ControlPanelDshOperationsScreenProps) {
  const router = useRouter();
  const uiText = useUiText();
  const dshText = useDshControlPanelText();
  const { direction, language } = useDirection();
  const [activeGroup, setActiveGroup] = React.useState<CanonicalOperationsGroupId>(group);
  const [activeFilterId, setActiveFilterId] = React.useState<string>('pulse');
  const [refreshCount, setRefreshCount] = React.useState(1);
  const [alertCount, setAlertCount] = React.useState(3);

  React.useEffect(() => {
    setActiveGroup(group);
  }, [group]);

  const activeGroupMeta = getOperationsGroupMeta(activeGroup);
  const liveQueueStatus = orderId ? `Order ${orderId}` : 'Orders queue';
  const languageChip = language === 'en' ? dshText.common.enChip : dshText.common.arChip;
  const readyForSelection = state === 'ready';

  const handleGroupChange = React.useCallback((nextGroup: CanonicalOperationsGroupId) => {
    setActiveGroup(nextGroup);
    router.push(buildOperationsHref(nextGroup, { orderId, panel }));
  }, [orderId, panel, router]);

  if (state !== 'ready') {
    return (
      <div className={styles.stateContainer}>
        <StateView {...resolveOperationsStateCopy(dshText, state)} onActionPress={() => router.push(fallbackHref)} />
      </div>
    );
  }

  return (
    <div className={styles.opsWorkspace} dir={direction}>
      <div className={styles.metricsStrip}>
        {OPERATIONS_PULSE_METRICS.map((metric) => (
          <StatCard
            key={metric.id}
            label={metric.title}
            value={metric.value}
            deltaLabel={metric.description}
            tone={metric.tone}
          />
        ))}
      </div>

      <ControlPanelDshDecisionBoard
        title={dshText.hub.decisionBoardTitle ?? "قرار العمليات الحالي"}
        purpose={activeGroupMeta.description}
        primaryDecision={activeGroupMeta.label}
        nextAction={activeGroup === 'overview' ? 'اختر مسار العمليات التالي.' : `الاستمرار في ${activeGroupMeta.label}.`}
        blockers={activeGroup === 'audit-evidence' ? 'Visual/runtime proof is still pending.' : 'No separate workspace branching is allowed for this slice.'}
        ownerSurface="operations"
        evidenceHint={`Canonical group: ${activeGroupMeta.id}`}
        routeHint={buildOperationsHref(activeGroup, { orderId, panel })}
        decisionTone={activeGroup === 'exceptions-sla' ? 'danger' : activeGroup === 'orders' ? 'warning' : 'best'}
      />

      {activeGroup === 'overview' && (
        <WebSectionCard
          title="مسارات التشغيل"
          description="ملخص استراتيجي للنبض التشغيلي وحالة المسارات الحية."
        >
          <div className={styles.workbenchGrid}>
            {OPERATIONS_OVERVIEW_ACTIONS.map((item) => (
              <WebControlActionCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                footerLabel={item.footerLabel}
                href={item.href}
                tone={item.id === 'ops-orders' ? 'primary' : 'secondary'}
                onAction={() => router.push(item.href)}
              />
            ))}
          </div>
        </WebSectionCard>
      )}

      {activeGroup !== 'overview' ? renderLane(activeGroup, { hubHref: fallbackHref, orderId, panel, state }) : null}

      <details className={styles.disclosure}>
        <summary className={styles.disclosureSummary}>
          <span>روابط إضافية</span>
          <span className={styles.disclosureHint}>اختصارات الأقسام خارج العمليات</span>
        </summary>
        <Box gap={2} paddingTop={12}>
          {NON_OPERATIONS_SECTION_SHORTCUTS.map((item) => (
            <WebControlDisclosureItem
              key={item.id}
              id={item.id}
              label={item.label}
              description={item.description}
              href={item.href}
              badge="Section"
              onAction={() => router.push(item.href)}
            />
          ))}
        </Box>
      </details>
    </div>
  );
}

export function DshOperationsHubSurface(props: ControlPanelDshOperationsScreenProps = {}) {
  return <ControlPanelDshOperationsScreen {...props} />;
}

export default ControlPanelDshOperationsScreen;