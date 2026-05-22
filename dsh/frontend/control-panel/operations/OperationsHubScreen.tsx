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
  NON_OPERATIONS_SECTION_SHORTCUTS,
  OPERATIONS_CANONICAL_GROUPS,
  resolveOperationsStateCopy,
} from './operations.registry';
import { OPERATIONS_PULSE_METRICS } from './operations.preview-data';
import type { CanonicalOperationsGroupId, OperationsPanelId, OperationsViewState } from './operations.types';
import { CommandCenterScreen } from './CommandCenterScreen';
import { LiveOrdersScreen } from './LiveOrdersScreen';
import { AssistedOrderDeskScreen } from './AssistedOrderDeskScreen';
import { OrderRescueScreen } from './OrderRescueScreen';
import { DispatchAssignmentScreen } from './DispatchAssignmentScreen';
import { GeoHeatmapScreen } from './GeoHeatmapScreen';
import { ControlPanelDshSheinProxyScreen } from './ControlPanelDshSheinProxyScreen';
import { AwnakScreen } from './AwnakScreen';
import { CaptainOperationsScreen } from './CaptainOperationsScreen';
import { PartnerStoresScreen } from './PartnerStoresScreen';
import { AreaCapacityScreen } from './AreaCapacityScreen';
import { ExceptionsEscalationsScreen } from './ExceptionsEscalationsScreen';
import { AuditSupportSlaScreen } from './AuditSupportSlaScreen';
import { getDshControlPanelGovernanceEntry } from '../shared/dsh-control-panel-governance.map';
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
  const [activeGroup, setActiveGroup] = React.useState<CanonicalOperationsGroupId>(group);
  const [activeSubGroup, setActiveSubGroup] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    setActiveGroup(group);
  }, [group]);

  const activeGroupMeta = getOperationsGroupMeta(activeGroup);
  const hubHref = buildOperationsHref(activeGroup, { orderId, panel });
  const ActiveScreen = SCREEN_RENDERERS[activeGroup];
  const governance = getDshControlPanelGovernanceEntry('operations');

  if (state !== 'ready') {
    return (
      <div className={styles.surfaceStatePadding}>
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
            <p className={styles.surfaceHeaderSubtitle}>مراقبة وتنفيذ الطلبات الحية</p>
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

      <div className={`${styles.filterDock} ${styles.filterDockTint}`}>
        {subTabItems && subTabItems.length > 0 && (
          <WebControlPanelSubTabs
            items={subTabItems}
            ariaLabel="تصفية فرعية"
            onSelect={(id) => setActiveSubGroup(id)}
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
