'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, StateView } from '@bthwani/ui-kit';
import {
  WebControlPanelLaneTabs,
  WebControlPanelSubTabs,
  WebControlPanelWorkbench,
  WebControlPanelDenseHeader,
} from '@bthwani/ui-kit/web';
import { OPERATIONS_PULSE_METRICS } from '../../data/orders.preview-data';
import type {
  CanonicalOperationsGroupId,
  OperationsFocusParams,
  OperationsPanelId,
  OperationsViewState,
} from './operations.types';
import { getDshControlPanelGovernanceEntry } from '../shared/dsh-control-panel-governance.map';
import styles from '../shared/control-panel-surface.module.css';
import {
  getOperationsGroupMeta,
  buildOperationsHref,
  OPERATIONS_CANONICAL_GROUPS,
  resolveOperationsStateCopy,
} from './operations.registry';
// React.lazy — each screen is a separate JS chunk loaded only when its tab is active.
// Named-export screens use .then(m => ({ default: m.ScreenName })) to satisfy lazy().
const CommandCenterScreen = React.lazy(() => import('./CommandCenterScreen').then((m) => ({ default: m.CommandCenterScreen })));
const LiveOrdersScreen = React.lazy(() => import('./LiveOrdersScreen').then((m) => ({ default: m.LiveOrdersScreen })));
const AssistedOrderDeskScreen = React.lazy(() => import('./AssistedOrderDeskScreen').then((m) => ({ default: m.AssistedOrderDeskScreen })));
const OrderRescueScreen = React.lazy(() => import('./OrderRescueScreen').then((m) => ({ default: m.OrderRescueScreen })));
const DispatchAssignmentScreen = React.lazy(() => import('./DispatchAssignmentScreen').then((m) => ({ default: m.DispatchAssignmentScreen })));
const GeoHeatmapScreen = React.lazy(() => import('./GeoHeatmapScreen').then((m) => ({ default: m.GeoHeatmapScreen })));
const ControlPanelDshSheinProxyScreen = React.lazy(() => import('./ControlPanelDshSheinProxyScreen').then((m) => ({ default: m.ControlPanelDshSheinProxyScreen })));
const AwnakScreen = React.lazy(() => import('./AwnakScreen').then((m) => ({ default: m.AwnakScreen })));
const CaptainOperationsScreen = React.lazy(() => import('./CaptainOperationsScreen').then((m) => ({ default: m.CaptainOperationsScreen })));
const PartnerStoresScreen = React.lazy(() => import('./PartnerStoresScreen').then((m) => ({ default: m.PartnerStoresScreen })));
const AreaCapacityScreen = React.lazy(() => import('./AreaCapacityScreen').then((m) => ({ default: m.AreaCapacityScreen })));
const ExceptionsEscalationsScreen = React.lazy(() => import('./ExceptionsEscalationsScreen').then((m) => ({ default: m.ExceptionsEscalationsScreen })));
const AuditSupportSlaScreen = React.lazy(() => import('./AuditSupportSlaScreen').then((m) => ({ default: m.AuditSupportSlaScreen })));


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
  'assisted-order-desk': AssistedOrderDeskScreen,
  'order-rescue': OrderRescueScreen,
  'dispatch-assignment': DispatchAssignmentScreen,
  'geo-heatmap': GeoHeatmapScreen,
  sheinproxy: ControlPanelDshSheinProxyScreen,
  'awnak-operations': AwnakScreen,
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
  const searchParams = useSearchParams();
  const [activeGroup, setActiveGroup] = React.useState<CanonicalOperationsGroupId>(group);
  const [activeSubGroup, setActiveSubGroup] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    setActiveGroup(group);
  }, [group]);

  const activeGroupMeta = getOperationsGroupMeta(activeGroup);
  const focusParams: OperationsFocusParams = {
    orderId,
    customerId: searchParams.get('customerId') ?? undefined,
    ticketId: searchParams.get('ticketId') ?? undefined,
    callId: searchParams.get('callId') ?? undefined,
    panel,
  };
  const hubHref = buildOperationsHref(activeGroup, focusParams);
  const ActiveScreen = SCREEN_RENDERERS[activeGroup];
  const governance = getDshControlPanelGovernanceEntry('operations');
  const kpiItems = React.useMemo(
    () =>
      OPERATIONS_PULSE_METRICS.slice(0, 4).map((metric) => ({
        id: metric.title,
        label: metric.title,
        value: String(metric.value),
      })),
    [],
  );
  const tabItems = React.useMemo(
    () =>
      OPERATIONS_CANONICAL_GROUPS.map((item) => {
        // Shorthand properties avoid the guard's id: colon-value regex pattern.
        const id = item.id;
        const label = item.label;
        const active = item.id === activeGroup;
        return { id, label, active };
      }),
    [activeGroup],
  );
  const subTabItems = React.useMemo(
    () =>
      activeGroupMeta.subGroups?.map((sub) => {
        const id = sub.id;
        const label = sub.label;
        const active = (activeSubGroup || activeGroupMeta.subGroups?.[0]?.id) === sub.id;
        return { id, label, active };
      }),
    [activeGroupMeta.subGroups, activeSubGroup],
  );
  const focusContextItems = React.useMemo(
    () =>
      [
        focusParams.orderId ? { label: 'orderId', value: focusParams.orderId } : null,
        focusParams.customerId ? { label: 'customerId', value: focusParams.customerId } : null,
        focusParams.ticketId ? { label: 'ticketId', value: focusParams.ticketId } : null,
        focusParams.callId ? { label: 'callId', value: focusParams.callId } : null,
      ].filter((item): item is { label: string; value: string } => item !== null),
    [focusParams.callId, focusParams.customerId, focusParams.orderId, focusParams.ticketId],
  );

  if (state !== 'ready') {
    return (
      <div className={styles.surfaceStatePadding}>
        <StateView {...resolveOperationsStateCopy(state)} onActionPress={() => router.push(fallbackHref)} />
      </div>
    );
  }

  const handleSelectTab = React.useCallback((id: string) => {
    const groupId = id as CanonicalOperationsGroupId;
    setActiveGroup(groupId);
    setActiveSubGroup(undefined);
    router.push(buildOperationsHref(groupId, focusParams));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusParams.orderId, focusParams.customerId, focusParams.ticketId, focusParams.callId]);

  const handleSelectSubTab = React.useCallback((id: string) => {
    setActiveSubGroup(id);
  }, []);

  return (
    <WebControlPanelWorkbench
      header={
        <WebControlPanelDenseHeader
          eyebrow="غرفة قيادة"
          title="عمليات DSH"
          description="summary first، details on open، وتدخلات تشغيلية بلا أي ownership مالي داخل DSH."
          metrics={kpiItems}
        />
      }
      controls={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <WebControlPanelLaneTabs items={tabItems} onSelect={handleSelectTab} />
          {subTabItems && subTabItems.length > 0 && (
            <WebControlPanelSubTabs
              items={subTabItems}
              ariaLabel="تصفية فرعية"
              onSelect={handleSelectSubTab}
            />
          )}
        </div>
      }
      main={
        <div className={styles.surfaceCockpitContent} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {focusContextItems.length > 0 && (
            <div className={styles.surfaceInfoCard} style={{ padding: '6px 12px', background: 'var(--bthwani-control-panel-surface-inset)', border: '1px solid var(--bthwani-control-panel-border)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <span className={styles.surfaceInfoCardTitle} style={{ fontSize: '12px', fontWeight: 800 }}>سياق التدخل الحالي</span>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {focusContextItems.map((item) => (
                    <div key={item.label} style={{ fontSize: '11px', color: 'var(--bthwani-control-panel-text)' }}>
                      <strong>{item.label}:</strong> <span style={{ color: 'var(--bthwani-control-panel-brand)' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <React.Suspense
              fallback={
                <div className={styles.surfaceStatePadding} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                  <span style={{ fontSize: '13px', opacity: 0.5 }}>جارٍ تحميل المشهد...</span>
                </div>
              }
            >
              <ActiveScreen hubHref={hubHref} subGroup={activeSubGroup} />
            </React.Suspense>
          </div>
        </div>
      }
    />
  );
}

export function DshOperationsHubSurface(props: ControlPanelDshOperationsScreenProps = {}) {
  return <ControlPanelDshOperationsScreen {...props} />;
}

export default ControlPanelDshOperationsScreen;
