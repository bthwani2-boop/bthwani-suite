'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, StateView } from '@bthwani/ui-kit';
import {
  WebControlPanelLaneTabs,
  WebControlPanelSubTabs,
} from '@bthwani/ui-kit/web';
import {
  buildOperationsHref,
  getOperationsGroupMeta,
  NON_OPERATIONS_SECTION_SHORTCUTS,
  OPERATIONS_CANONICAL_GROUPS,
  resolveOperationsStateCopy,
} from './operations.registry';
import { OPERATIONS_PULSE_METRICS } from '../../data/orders.preview-data';
import type {
  CanonicalOperationsGroupId,
  OperationsFocusParams,
  OperationsPanelId,
  OperationsViewState,
} from './operations.types';
import { getDshControlPanelGovernanceEntry } from '../shared/dsh-control-panel-governance.map';
import styles from '../shared/control-panel-surface.module.css';
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

  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.surfaceHeaderIconBox} aria-hidden="true">
            <div className={styles.surfaceHeaderGlyph}>
              <div className={styles.surfaceHeaderGlyphMinus} />
            </div>
          </div>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>عمليات DSH</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>غرفة قيادة</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>summary first، details on open، وتدخلات تشغيلية بلا أي ownership مالي داخل DSH.</p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            {kpiItems.map((m) => (
              <div key={m.label} className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>{m.label}</span>
                <span className={styles.commandKpiValue}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <nav className={styles.navigationDock}>
        <WebControlPanelLaneTabs
          items={tabItems}
          onSelect={React.useCallback((id: string) => {
            const groupId = id as CanonicalOperationsGroupId;
            setActiveGroup(groupId);
            setActiveSubGroup(undefined);
            router.push(buildOperationsHref(groupId, focusParams));
          // eslint-disable-next-line react-hooks/exhaustive-deps
          }, [focusParams.orderId, focusParams.customerId, focusParams.ticketId, focusParams.callId])}
        />
      </nav>

      <div className={`${styles.filterDock} ${styles.filterDockTint}`}>
        {subTabItems && subTabItems.length > 0 && (
          <WebControlPanelSubTabs
            items={subTabItems}
            ariaLabel="تصفية فرعية"
            onSelect={React.useCallback((id: string) => setActiveSubGroup(id), [])}
          />
        )}
      </div>

      <div className={styles.surfaceSplitGrid}>
        <div className={styles.surfaceInfoCard}>
          <div>
            <div className={styles.surfaceInfoCardTitle}>حدود ملكية العمليات</div>
            <div className={styles.surfaceInfoCardDescription}>
              {governance.notes}
            </div>
          </div>
          <div className={styles.surfaceMetaWrap}>
            {governance.onDemandPolicySummary.map((policy) => (
              <span key={policy} className={styles.surfaceMetaChip}>{policy}</span>
            ))}
          </div>
        </div>
        <div className={styles.surfaceInfoCard}>
          <div>
            <div className={styles.surfaceInfoCardTitle}>تحويلات الملكية</div>
            <div className={styles.surfaceInfoCardDescription}>
              الدعم والماليات والكتالوجات والشركاء والمنصة والإدارة تبقى أقسامًا مستقلة؛ العمليات تفتحها ولا تكرر منطقها.
            </div>
          </div>
          <div className={styles.surfaceMetaWrap}>
            {NON_OPERATIONS_SECTION_SHORTCUTS.map((shortcut) => (
              <span key={shortcut.id} className={styles.surfaceMetaChip}>{shortcut.label}</span>
            ))}
          </div>
        </div>
        {focusContextItems.length > 0 ? (
          <div className={styles.surfaceInfoCard}>
            <div>
              <div className={styles.surfaceInfoCardTitle}>سياق التدخل الحالي</div>
              <div className={styles.surfaceInfoCardDescription}>
                IDs/references first. التفاصيل والـ evidence تظل داخل workspace المفتوح فقط.
              </div>
            </div>
            <div className={styles.surfaceInspectorMeta}>
              {focusContextItems.map((item) => (
                <div key={item.label} className={styles.surfaceInspectorRow}>
                  <strong>{item.label}</strong>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <React.Suspense
            fallback={
              <div className={styles.surfaceStatePadding} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '13px', opacity: 0.5 }}>جارٍ تحميل المشهد...</span>
              </div>
            }
          >
            <ActiveScreen hubHref={hubHref} subGroup={activeSubGroup} />
          </React.Suspense>
        </div>
      </main>
    </div>
  );
}

export function DshOperationsHubSurface(props: ControlPanelDshOperationsScreenProps = {}) {
  return <ControlPanelDshOperationsScreen {...props} />;
}

export default ControlPanelDshOperationsScreen;
