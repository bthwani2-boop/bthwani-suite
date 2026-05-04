'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, StateView, StatCard, Text, useDirection } from '@bthwani/ui-kit';
import { WebControlActionCard, WebControlDisclosureItem, WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard } from '../shared';
import {
  buildOperationsHref,
  getOperationsGroupMeta,
  NON_OPERATIONS_SECTION_SHORTCUTS,
  OPERATIONS_CANONICAL_GROUPS,
} from './operations.registry';
import { OPERATIONS_PULSE_METRICS } from './operations.fixtures';
import { resolveOperationsStateCopy, type OperationsViewState } from './operations.state';
import type { CanonicalOperationsGroupId, OperationsPanelId } from './operations.types';
import { CommandCenterScreen } from './command-center/CommandCenterScreen';
import { LiveOrdersScreen } from './live-orders/LiveOrdersScreen';
import { DispatchAssignmentScreen } from './dispatch-assignment/DispatchAssignmentScreen';
import { CaptainOperationsScreen } from './captain-operations/CaptainOperationsScreen';
import { PartnerStoresScreen } from './partner-stores/PartnerStoresScreen';
import { AreaCapacityScreen } from './area-capacity/AreaCapacityScreen';
import { ExceptionsEscalationsScreen } from './exceptions-escalations/ExceptionsEscalationsScreen';
import { AuditSupportSlaScreen } from './audit-support-sla/AuditSupportSlaScreen';

export type ControlPanelDshOperationsScreenProps = {
  group?: CanonicalOperationsGroupId;
  orderId?: string;
  panel?: OperationsPanelId;
  state?: OperationsViewState;
  fallbackHref?: string;
};

const SCREEN_RENDERERS: Record<CanonicalOperationsGroupId, React.ComponentType<{ hubHref: string }>> = {
  'command-center': CommandCenterScreen,
  'live-orders': LiveOrdersScreen,
  'dispatch-assignment': DispatchAssignmentScreen,
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
  const { direction } = useDirection();
  const [activeGroup, setActiveGroup] = React.useState<CanonicalOperationsGroupId>(group);

  React.useEffect(() => {
    setActiveGroup(group);
  }, [group]);

  const activeGroupMeta = getOperationsGroupMeta(activeGroup);
  const hubHref = buildOperationsHref(activeGroup, { orderId, panel });
  const ActiveScreen = SCREEN_RENDERERS[activeGroup];

  if (state !== 'ready') {
    return (
      <div style={{ padding: 24 }} dir={direction}>
        <StateView {...resolveOperationsStateCopy(state)} onActionPress={() => router.push(fallbackHref)} />
      </div>
    );
  }

  return (
    <div dir={direction} style={{ padding: 24 }}>
      <Box gap={4}>
        <Box gap={2}>
          <Text role="bodyStrong">Operations control room</Text>
          <Text role="bodySm" tone="muted">
            Choose the canonical screen that owns the current operational decision, then keep the active workspace in view.
          </Text>
        </Box>

        <Box gap={2} layoutDirection="row" style={{ flexWrap: 'wrap' }}>
          {OPERATIONS_PULSE_METRICS.map((metric) => (
            <div key={metric.id} style={{ flexGrow: 1, flexBasis: 180 }}>
                <StatCard
                  label={metric.title}
                  value={metric.value}
                  deltaLabel={metric.description}
                  tone={metric.tone === 'best' ? 'success' : metric.tone}
                />
            </div>
          ))}
        </Box>

        <ControlPanelDshDecisionBoard
          title="Operations hub decision board"
          purpose={activeGroupMeta.description}
          primaryDecision={activeGroupMeta.label}
          nextAction={activeGroup === 'command-center' ? 'Open one of the canonical operational screens.' : `Continue in ${activeGroupMeta.label}.`}
          blockers={activeGroup === 'audit-support-sla' ? 'Evidence and SLA closure still need proof.' : 'The canonical screen map now replaces the legacy lane model.'}
          ownerSurface="operations"
          evidenceHint={`Canonical group: ${activeGroupMeta.id}`}
          routeHint={hubHref}
          decisionTone={activeGroup === 'exceptions-escalations' ? 'danger' : activeGroup === 'area-capacity' ? 'warning' : 'brand'}
        />

        <WebSectionCard title="Screen selector" description="Switch between the eight canonical surfaces. Operations is always one click away.">
          <Box gap={2} layoutDirection="row" style={{ flexWrap: 'wrap' }}>
            {OPERATIONS_CANONICAL_GROUPS.map((item) => (
              <div key={item.id} style={{ flexGrow: 1, flexBasis: 250 }}>
                <WebControlActionCard
                  id={item.id}
                  title={item.label}
                  description={item.description}
                  footerLabel={item.badge}
                  href={buildOperationsHref(item.id)}
                  tone={item.id === activeGroup ? 'primary' : 'secondary'}
                  onAction={() => {
                    setActiveGroup(item.id);
                    router.push(buildOperationsHref(item.id, { orderId, panel }));
                  }}
                />
              </div>
            ))}
          </Box>
        </WebSectionCard>

        <ActiveScreen hubHref={hubHref} />

        <WebSectionCard title="Secondary shortcuts" description="Non-operations sections remain visible as lightweight exits.">
          <Box gap={2}>
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
        </WebSectionCard>
      </Box>
    </div>
  );
}

export function DshOperationsHubSurface(props: ControlPanelDshOperationsScreenProps = {}) {
  return <ControlPanelDshOperationsScreen {...props} />;
}

export default ControlPanelDshOperationsScreen;