'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { StateView } from '@bthwani/ui-kit';
import {
  WebControlPanelWorkbench,
  WebControlPanelDenseHeader,
  WebControlPanelLaneTabs,
  WebControlPanelSubTabs,
} from '@bthwani/ui-kit/web';
import {
  buildOperationsHref,
  getOperationsGroupMeta,
  OPERATIONS_CANONICAL_GROUPS,
  resolveOperationsStateCopy,
} from './operations.registry';
import { OPERATIONS_PULSE_METRICS } from './operations.preview-data';
import type { CanonicalOperationsGroupId, OperationsPanelId, OperationsViewState } from './operations.types';
import { CommandCenterScreen } from './CommandCenterScreen';
import { LiveOrdersScreen } from './LiveOrdersScreen';
import { DispatchAssignmentScreen } from './DispatchAssignmentScreen';
import { GeoHeatmapScreen } from './GeoHeatmapScreen';
import { ControlPanelDshSheinProxyScreen } from './ControlPanelDshSheinProxyScreen';
import { AwnakScreen } from './AwnakScreen';
import { CaptainOperationsScreen } from './CaptainOperationsScreen';
import { PartnerStoresScreen } from './PartnerStoresScreen';
import { AreaCapacityScreen } from './AreaCapacityScreen';
import { ExceptionsEscalationsScreen } from './ExceptionsEscalationsScreen';
import { AuditSupportSlaScreen } from './AuditSupportSlaScreen';
import styles from './dsh-surface.module.css';

export type ControlPanelDshOperationsScreenProps = {
  group?: CanonicalOperationsGroupId;
  orderId?: string;
  panel?: OperationsPanelId;
  state?: OperationsViewState;
  fallbackHref?: string;
};

const SCREEN_RENDERERS: Record<CanonicalOperationsGroupId, React.ComponentType<{ hubHref: string; subGroup?: string }>> = {
  'command-center': CommandCenterScreen,
  'live-orders': LiveOrdersScreen,
  'dispatch-assignment': DispatchAssignmentScreen,
  'geo-heatmap': GeoHeatmapScreen,
  sheinproxy: ControlPanelDshSheinProxyScreen,
  'proxy-shein-awnak': AwnakScreen,
  'captain-operations': CaptainOperationsScreen,
  'partner-stores': PartnerStoresScreen,
  'area-capacity': AreaCapacityScreen,
  'exceptions-escalations': ExceptionsEscalationsScreen,
  'audit-support-sla': AuditSupportSlaScreen,
};

export function ControlPanelDshOperationsScreen({
  group = 'command-center',
  orderId,
  panel,
  state = 'ready',
  fallbackHref = '/operations',
}: ControlPanelDshOperationsScreenProps) {
  const router = useRouter();
  const [activeGroup, setActiveGroup] = React.useState<CanonicalOperationsGroupId>(group);
  const [activeSubGroup, setActiveSubGroup] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    setActiveGroup(group);
  }, [group]);

  const activeGroupMeta = getOperationsGroupMeta(activeGroup);
  const hubHref = buildOperationsHref(activeGroup, { orderId, panel });
  const ActiveScreen = SCREEN_RENDERERS[activeGroup];

  if (state !== 'ready') {
    return (
      <div style={{ padding: 24 }} dir="rtl">
        <StateView {...resolveOperationsStateCopy(state)} onActionPress={() => router.push(fallbackHref)} />
      </div>
    );
  }

  const kpiItems = OPERATIONS_PULSE_METRICS.slice(0, 4).map((metric) => ({
    label: metric.title,
    value: String(metric.value),
  }));

  const tabItems = OPERATIONS_CANONICAL_GROUPS.map((item) => ({
    id: item.id,
    label: item.label,
    active: item.id === activeGroup,
  }));

  const subTabItems = activeGroupMeta.subGroups?.map((sub) => ({
    id: sub.id,
    label: sub.label,
    active: (activeSubGroup || activeGroupMeta.subGroups?.[0]?.id) === sub.id,
  }));

  return (
    <WebControlPanelWorkbench className={styles.operationsCockpit}>
      <WebControlPanelDenseHeader
        title="عمليات DSH"
        description="مراقبة وتنفيذ الطلبات الحية"
        metrics={kpiItems}
      />

      <WebControlPanelLaneTabs
        items={tabItems}
        onSelect={(id) => {
          const groupId = id as CanonicalOperationsGroupId;
          setActiveGroup(groupId);
          setActiveSubGroup(undefined);
          router.push(buildOperationsHref(groupId, { orderId, panel }));
        }}
      />

      {subTabItems && subTabItems.length > 0 && (
        <WebControlPanelSubTabs
          items={subTabItems}
          ariaLabel="تصفية فرعية"
          onSelect={(id) => setActiveSubGroup(id)}
        />
      )}

      <main className={styles.operationsMainPanel}>
        <div className={styles.operationsInnerScroll}>
          <ActiveScreen hubHref={hubHref} subGroup={activeSubGroup} />
        </div>
      </main>
    </WebControlPanelWorkbench>
  );
}

export function DshOperationsHubSurface(props: ControlPanelDshOperationsScreenProps = {}) {
  return <ControlPanelDshOperationsScreen {...props} />;
}

export default ControlPanelDshOperationsScreen;
