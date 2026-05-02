"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Text, useUiText } from '@bthwani/ui-kit';
import {
  WebMissionHeroCard,
  WebSectionCard,
  WebSegmentedTabs,
  WebSignalCard,
} from '@bthwani/ui-kit/web';
import { useDshControlPanelText } from './operations/shared/dshControlPanelText';
import { ControlPanelDshBellScreen } from './operations/bell';
import { ControlPanelDshCatalogScreen } from './catalogs';
import { ControlPanelDshOrderChatScreen } from './operations/orderchat';
import { ControlPanelDshOrderDetailScreen, ControlPanelDshOrdersScreen } from './operations/orders';
import { ControlPanelDshPeakModeScreen } from './operations/peak-mode';
import { ControlPanelDshPartnerApprovalsScreen } from './partners';
import { ControlPanelDshReassignScreen } from './operations/reassign';
import { ControlPanelDshManualAssignmentScreen } from './operations/sheinproxy';
import { ControlPanelDshZoneSetScreen } from './operations/zone-set';
import { ControlPanelDshMarketingScreen } from './marketing';

type DshWorkspaceId = 'overview' | 'orders' | 'order-detail' | 'orderchat' | 'sheinproxy' | 'reassign' | 'peak-mode' | 'arrival-bell' | 'bell' | 'zone-set' | 'marketing' | 'catalogs' | 'partners';

type DshDockText = {
  dockEyebrow: string;
  dockTitle: string;
  dockDescription: string;
  liveSignalTitle: string;
  liveSignalDescription: string;
  plannedSignalTitle: string;
  plannedSignalDescription: string;
  entrySignalTitle: string;
  entrySignalDescription: string;
  liveRoutesTitle: string;
  liveRoutesDescription: string;
  plannedRoutesTitle: string;
  plannedRoutesDescription: string;
  overviewLabel: string;
  overviewDescription: string;
  ordersLabel: string;
  ordersDescription: string;
  reassignLabel: string;
  reassignDescription: string;
  peakModeLabel: string;
  peakModeDescription: string;
  arrivalBellLabel: string;
  arrivalBellDescription: string;
  zoneSetLabel: string;
  zoneSetDescription: string;
  sheinProxyLabel: string;
  sheinProxyDescription: string;
  openHubAction: string;
  openRouteAction: string;
  openOrdersAction: string;
  openReassignAction: string;
  openPeakModeAction: string;
  openArrivalBellAction: string;
  liveBadge: string;
  plannedBadge: string;
};

export type DshControlPanelSurfaceHostProps = {
  workspace?: DshWorkspaceId;
  orderId?: string;
  orderOverlayMode?: 'detail' | 'chat';
};

type DshDockRouteItem = {
  href?: string;
  label: string;
  description: string;
  statusLabel: string;
};

function buildOperationsHref(
  workspace: Exclude<DshWorkspaceId, 'order-detail' | 'orderchat' | 'arrival-bell'> = 'overview',
  options?: {
    orderId?: string;
    panel?: 'detail' | 'chat';
  },
) {
  const searchParams = new URLSearchParams();

  if (workspace !== 'overview') {
    searchParams.set('workspace', workspace);
  }

  if (options?.orderId) {
    searchParams.set('orderId', options.orderId);
  }

  if (options?.panel) {
    searchParams.set('panel', options.panel);
  }

  const query = searchParams.toString();
  return query ? `/operations?${query}` : '/operations';
}

const liveRouteHrefs = {
  overview: buildOperationsHref('overview'),
  orders: buildOperationsHref('orders'),
  partners: buildOperationsHref('partners'),
  catalogs: buildOperationsHref('catalogs'),
  sheinProxy: buildOperationsHref('sheinproxy'),
  reassign: buildOperationsHref('reassign'),
  peakMode: buildOperationsHref('peak-mode'),
  arrivalBell: buildOperationsHref('bell'),
  zoneSet: buildOperationsHref('zone-set'),
  marketing: buildOperationsHref('marketing'),
} as const;

const dshDockText: DshDockText = {
  dockEyebrow: 'DSH operations dock',
  dockTitle: 'DSH operations hub',
  dockDescription: 'Live routes open directly, while the next workbenches remain visible without pretending to be ready.',
  liveSignalTitle: 'Live',
  liveSignalDescription: 'Active workbenches that can open immediately.',
  plannedSignalTitle: 'Planned',
  plannedSignalDescription: 'Visible next-step routes that are preserved without early wiring.',
  entrySignalTitle: 'Quick access',
  entrySignalDescription: 'Open the live DSH routes directly when the next step is already known.',
  liveRoutesTitle: 'Live routes',
  liveRoutesDescription: 'Each live route keeps its own safe entry and still shows the route context clearly.',
  plannedRoutesTitle: 'Planned routes',
  plannedRoutesDescription: 'These routes stay visible so the next extension remains legible, but they do not behave like live links early.',
  overviewLabel: 'DSH overview',
  overviewDescription: 'A first read of the state and the safe transitions before entering any child route.',
  ordersLabel: 'Orders',
  ordersDescription: 'The central orders queue and its related detail surfaces.',
  reassignLabel: 'Reassign',
  reassignDescription: 'Re-route orders between available resources without breaking the active path.',
  peakModeLabel: 'Peak mode',
  peakModeDescription: 'A flexible capacity mode when traffic rises and extra room is needed.',
  arrivalBellLabel: 'Arrival bell',
  arrivalBellDescription: 'Arrival and live notification settings near handoff.',
  zoneSetLabel: 'Zone set',
  zoneSetDescription: 'Guard the delivery scope with clearer operational boundaries.',
  sheinProxyLabel: 'Manual assignment',
  sheinProxyDescription: 'A reusable manual assignment lane for platform-owned batches.',
  openHubAction: 'Open operations workspace',
  openRouteAction: 'Open route',
  openOrdersAction: 'Open orders',
  openReassignAction: 'Open reassign',
  openPeakModeAction: 'Open peak mode',
  openArrivalBellAction: 'Open arrival bell',
  liveBadge: 'Live',
  plannedBadge: 'Planned',
} as const;

function ControlPanelDshOperationsDock() {
  const router = useRouter();
  const uiText = useUiText();
  const dshText = useDshControlPanelText();
  const marketingTitle = uiText.controlPanel.surfaceTitles.marketing;
  const marketingDescription = uiText.controlPanel.surfaceDescriptions.marketing;

  const dockText: DshDockText = {
    ...dshDockText,
    dockEyebrow: dshText.hub.rootEyebrow,
    dockTitle: dshText.hub.rootTitle,
    dockDescription: dshText.hub.workbenchesDescription,
    liveSignalDescription: dshText.hub.quickActionsDescription,
    plannedSignalDescription: dshText.hub.plannedRoutesDescription,
    entrySignalTitle: dshText.hub.quickActionsTitle,
    entrySignalDescription: dshText.hub.quickActionsDescription,
    liveRoutesTitle: dshText.hub.workbenchesTitle,
    liveRoutesDescription: dshText.hub.workbenchesDescription,
    plannedRoutesTitle: dshText.hub.plannedRoutesTitle,
    plannedRoutesDescription: dshText.hub.plannedRoutesDescription,
    overviewLabel: dshText.hub.workbenches.overview.label,
    overviewDescription: dshText.hub.workbenches.overview.description,
    ordersLabel: dshText.hub.workbenches.orders.label,
    ordersDescription: dshText.hub.workbenches.orders.description,
    reassignLabel: dshText.hub.workbenches.reassign.label,
    reassignDescription: dshText.hub.workbenches.reassign.description,
    peakModeLabel: dshText.hub.workbenches.peakMode.label,
    peakModeDescription: dshText.hub.workbenches.peakMode.description,
    arrivalBellLabel: dshText.hub.workbenches.arrivalBell.label,
    arrivalBellDescription: dshText.hub.workbenches.arrivalBell.description,
    zoneSetLabel: dshText.hub.workbenches.zoneSet.label,
    zoneSetDescription: dshText.hub.workbenches.zoneSet.description,
    sheinProxyLabel: dshText.hub.workbenches.sheinProxy.label,
    sheinProxyDescription: dshText.hub.workbenches.sheinProxy.description,
    openHubAction: dshText.common.openGeneralOperations,
    openRouteAction: dshText.common.openOperationsWorkspace,
    openOrdersAction: dshText.hub.actions.openOrders,
    openReassignAction: dshText.hub.actions.openReassign,
    openPeakModeAction: dshText.hub.actions.openPeakMode,
    openArrivalBellAction: dshText.hub.actions.openArrivalBell,
    liveBadge: dshText.common.live,
    plannedBadge: dshText.common.planned,
  };

  const liveRouteItems: ReadonlyArray<DshDockRouteItem> = [
    { href: liveRouteHrefs.overview, label: dockText.overviewLabel, description: dockText.overviewDescription, statusLabel: dockText.liveBadge },
    { href: liveRouteHrefs.orders, label: dockText.ordersLabel, description: dockText.ordersDescription, statusLabel: dockText.liveBadge },
    { href: liveRouteHrefs.partners, label: 'Partners approvals', description: 'Initial product review queue before marketing.', statusLabel: dockText.liveBadge },
    { href: liveRouteHrefs.catalogs, label: 'Catalog governance', description: 'The sovereign catalog for main and sub categories.', statusLabel: dockText.liveBadge },
    { href: liveRouteHrefs.marketing, label: marketingTitle, description: marketingDescription, statusLabel: dockText.liveBadge },
    { href: liveRouteHrefs.sheinProxy, label: dockText.sheinProxyLabel, description: dockText.sheinProxyDescription, statusLabel: dockText.liveBadge },
    { href: liveRouteHrefs.reassign, label: dockText.reassignLabel, description: dockText.reassignDescription, statusLabel: dockText.liveBadge },
    { href: liveRouteHrefs.peakMode, label: dockText.peakModeLabel, description: dockText.peakModeDescription, statusLabel: dockText.liveBadge },
    { href: liveRouteHrefs.arrivalBell, label: dockText.arrivalBellLabel, description: dockText.arrivalBellDescription, statusLabel: dockText.liveBadge },
    { href: liveRouteHrefs.zoneSet, label: dockText.zoneSetLabel, description: dockText.zoneSetDescription, statusLabel: dockText.liveBadge },
  ];
  const plannedRoutesCount = 0;

  return (
    <Box gap={4}>
      <WebMissionHeroCard
        badges={[dockText.liveBadge, dockText.plannedBadge, 'DSH']}
        eyebrow={dockText.dockEyebrow}
        title={dockText.dockTitle}
        description={dockText.dockDescription}
        metaItems={[
          `${dockText.liveRoutesTitle}: ${liveRouteItems.length}`,
          `${dockText.plannedRoutesTitle}: ${plannedRoutesCount}`,
          dockText.openHubAction,
        ]}
        primaryAction={{ label: dockText.openOrdersAction, href: liveRouteHrefs.orders }}
        secondaryAction={{ label: dockText.openReassignAction, href: liveRouteHrefs.reassign }}
      />

      <Box gap={2}>
        <WebSignalCard title={dockText.liveSignalTitle} value={String(liveRouteItems.length)} description={dockText.liveSignalDescription} tone="best" />
        <WebSignalCard title={dockText.plannedSignalTitle} value={String(plannedRoutesCount)} description={dockText.plannedSignalDescription} />
        <WebSignalCard title={dockText.entrySignalTitle} value="3" description={dockText.entrySignalDescription} />
      </Box>

      <WebSectionCard title={dockText.liveRoutesTitle} description={dockText.liveRoutesDescription}>
        <Box gap={2}>
          {liveRouteItems.map((item) => (
            <Box key={item.label} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Box layoutDirection="row" justify="space-between" align="center">
                <Text role="bodyStrong">{item.label}</Text>
                <Text role="caption" tone="success">
                  {item.statusLabel}
                </Text>
              </Box>
              <Text role="bodySm" tone="muted">
                {item.description}
              </Text>
              <Button
                label={dockText.openRouteAction}
                tone="secondary"
                fullWidth={false}
                onPress={() => {
                  if (item.href) {
                    router.push(item.href);
                  }
                }}
              />
            </Box>
          ))}
        </Box>
      </WebSectionCard>

      <WebSectionCard title={dockText.entrySignalTitle} description={dockText.entrySignalDescription}>
        <Box gap={2}>
          <Button label={dockText.openOrdersAction} onPress={() => router.push(liveRouteHrefs.orders)} />
          <Button label={dockText.openReassignAction} tone="secondary" onPress={() => router.push(liveRouteHrefs.reassign)} />
          <Button label={dockText.openPeakModeAction} tone="secondary" onPress={() => router.push(liveRouteHrefs.peakMode)} />
          <Button label={dockText.openArrivalBellAction} tone="secondary" onPress={() => router.push(liveRouteHrefs.arrivalBell)} />
        </Box>
      </WebSectionCard>

      <WebSectionCard title={marketingTitle} description={marketingDescription}>
        <Box gap={2}>
          <Text role="bodySm" tone="muted">
            {marketingDescription}
          </Text>
          <Button
            label={marketingTitle}
            tone="secondary"
            onPress={() => router.push(liveRouteHrefs.marketing)}
          />
        </Box>
      </WebSectionCard>
    </Box>
  );
}

export function DshControlPanelSurfaceHost({ workspace = 'overview', orderId, orderOverlayMode }: DshControlPanelSurfaceHostProps) {
  const router = useRouter();
  const uiText = useUiText();
  const dshText = useDshControlPanelText();

  const normalizedWorkspace = workspace === 'order-detail' || workspace === 'orderchat'
    ? 'orders'
    : workspace === 'arrival-bell'
      ? 'bell'
      : workspace;
  const initialOrdersOverlayMode = orderOverlayMode ?? (workspace === 'orderchat' ? 'chat' : workspace === 'order-detail' ? 'detail' : null);

  const tabs = [
    { id: 'overview', label: dshText.hub.workbenches.overview.label, active: normalizedWorkspace === 'overview' },
    { id: 'orders', label: dshText.hub.workbenches.orders.label, active: normalizedWorkspace === 'orders' },
    { id: 'partners', label: 'Partners', active: normalizedWorkspace === 'partners' },
    { id: 'catalogs', label: 'Catalogs', active: normalizedWorkspace === 'catalogs' },
    { id: 'marketing', label: uiText.controlPanel.surfaceTitles.marketing, active: normalizedWorkspace === 'marketing' },
    { id: 'sheinproxy', label: dshText.hub.workbenches.sheinProxy.label, active: normalizedWorkspace === 'sheinproxy' },
    { id: 'reassign', label: dshText.hub.workbenches.reassign.label, active: normalizedWorkspace === 'reassign' },
    { id: 'peak-mode', label: dshText.hub.workbenches.peakMode.label, active: normalizedWorkspace === 'peak-mode' },
    { id: 'bell', label: dshText.hub.workbenches.arrivalBell.label, active: normalizedWorkspace === 'bell' },
    { id: 'zone-set', label: dshText.hub.workbenches.zoneSet.label, active: normalizedWorkspace === 'zone-set' },
  ] as const;

  return (
    <Box gap={4}>
      {workspace === 'overview' ? <ControlPanelDshOperationsDock /> : null}
      {workspace === 'catalogs' ? <ControlPanelDshCatalogScreen hubHref={liveRouteHrefs.overview} operationsHref="/operations" partnersHref={liveRouteHrefs.partners} marketingHref={liveRouteHrefs.marketing} /> : null}
      {workspace === 'partners' ? <ControlPanelDshPartnerApprovalsScreen hubHref={liveRouteHrefs.overview} operationsHref="/operations" catalogHref={liveRouteHrefs.catalogs} marketingHref={liveRouteHrefs.marketing} /> : null}
      {workspace === 'marketing' ? <ControlPanelDshMarketingScreen hubHref={liveRouteHrefs.overview} operationsHref="/operations" /> : null}

      <Box style={{ overflow: 'hidden' }}>
        <WebSegmentedTabs
          ariaLabel={uiText.controlPanel.surfaceTitles.operations}
          items={tabs}
          onSelect={(workspaceId) => {
            if (workspaceId === 'overview') {
              router.push(liveRouteHrefs.overview);
              return;
            }

            if (workspaceId === 'marketing') {
              router.push(liveRouteHrefs.marketing);
              return;
            }

            if (workspaceId === 'partners') {
              router.push(liveRouteHrefs.partners);
              return;
            }

            if (workspaceId === 'catalogs') {
              router.push(liveRouteHrefs.catalogs);
              return;
            }

            if (workspaceId === 'reassign') {
              router.push(liveRouteHrefs.reassign);
              return;
            }

            if (workspaceId === 'peak-mode') {
              router.push(liveRouteHrefs.peakMode);
              return;
            }

            if (workspaceId === 'bell') {
              router.push(liveRouteHrefs.arrivalBell);
              return;
            }

            if (workspaceId === 'zone-set') {
              router.push(liveRouteHrefs.zoneSet);
              return;
            }

            if (workspaceId === 'sheinproxy') {
              router.push(liveRouteHrefs.sheinProxy);
              return;
            }

            router.push(liveRouteHrefs.orders);
          }}
        />
      </Box>

      {normalizedWorkspace === 'orders' ? (
        <ControlPanelDshOrdersScreen
          embedded
          showHeader={false}
          hubHref={liveRouteHrefs.overview}
          operationsHref="/operations"
          initialSelectedOrderId={orderId ?? null}
          initialOverlayMode={initialOrdersOverlayMode}
        />
      ) : null}
      {workspace === 'sheinproxy' ? (
        <ControlPanelDshManualAssignmentScreen
          requestId={orderId ?? 'shein-proxy-001'}
          stage="detail"
          hubHref={liveRouteHrefs.overview}
          operationsHref="/operations"
          supportHref="/support"
        />
      ) : null}
      {workspace === 'reassign' ? <ControlPanelDshReassignScreen embedded showHeader={false} hubHref={liveRouteHrefs.overview} ordersHref={liveRouteHrefs.orders} /> : null}
      {workspace === 'peak-mode' ? <ControlPanelDshPeakModeScreen embedded showHeader={false} hubHref={liveRouteHrefs.overview} ordersHref={liveRouteHrefs.orders} /> : null}
      {workspace === 'bell' || workspace === 'arrival-bell' ? <ControlPanelDshBellScreen embedded showHeader={false} hubHref={liveRouteHrefs.overview} ordersHref={liveRouteHrefs.orders} /> : null}
      {workspace === 'zone-set' ? <ControlPanelDshZoneSetScreen embedded showHeader={false} hubHref={liveRouteHrefs.overview} ordersHref={liveRouteHrefs.orders} /> : null}
    </Box>
  );
}

export default DshControlPanelSurfaceHost;
