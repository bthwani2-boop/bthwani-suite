'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, StateView, Text } from '@bthwani/ui-kit';
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
import styles from '../shared/control-panel-surface.module.css';

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
    <div className={styles.surfaceCockpit} dir="rtl">
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.surfaceHeaderIconBox} aria-hidden="true">
            <div style={{ width: 18, height: 18, border: '2px solid #FFFFFF', borderRadius: 4, position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 10, height: 2, backgroundColor: '#FFFFFF', transform: 'translate(-50%, -50%)' }} />
            </div>
          </div>
          <Box gap={0}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', letterSpacing: '-0.01em', color: '#0A2F5C', fontWeight: 800 }}>عمليات DSH</h1>
              <Box paddingX={1.5} paddingY={0.5} background="brandAlt" radiusToken="xs">
                 <Text role="caption" style={{ color: '#FF500D', fontWeight: 800, fontSize: '9px' }}>غرفة قيادة</Text>
              </Box>
            </div>
            <p style={{ fontSize: '10px', fontWeight: 600, color: '#64748B' }}>مراقبة وتنفيذ الطلبات الحية</p>
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
          onSelect={(id) => {
            const groupId = id as CanonicalOperationsGroupId;
            setActiveGroup(groupId);
            setActiveSubGroup(undefined);
            router.push(buildOperationsHref(groupId, { orderId, panel }));
          }}
        />
      </nav>

      <div className={styles.filterDock} style={{ backgroundColor: '#F8FAFC' }}>
        {subTabItems && subTabItems.length > 0 && (
          <WebControlPanelSubTabs
            items={subTabItems}
            ariaLabel="تصفية فرعية"
            onSelect={(id) => setActiveSubGroup(id)}
          />
        )}
      </div>

      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <ActiveScreen hubHref={hubHref} subGroup={activeSubGroup} />
        </div>
      </main>
    </div>
  );
}

export function DshOperationsHubSurface(props: ControlPanelDshOperationsScreenProps = {}) {
  return <ControlPanelDshOperationsScreen {...props} />;
}

export default ControlPanelDshOperationsScreen;
