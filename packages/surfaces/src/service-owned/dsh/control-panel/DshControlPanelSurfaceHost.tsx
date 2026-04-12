"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { BthBox, BthButton, BthText, useUiText } from '@bthwani/ui-kit';
import {
  BthWebMissionHeroCard,
  BthWebSectionCard,
  BthWebSegmentedTabs,
  BthWebSignalCard,
} from '@bthwani/ui-kit/web';
import { ControlPanelDshArrivalBellScreen } from './operations/dsh/arrival-bell';
import { ControlPanelDshOrderDetailScreen, ControlPanelDshOrdersScreen } from './operations/dsh/orders';
import { ControlPanelDshPeakModeScreen } from './operations/dsh/peak-mode';
import { ControlPanelDshReassignScreen } from './operations/dsh/reassign';
import { ControlPanelDshSheinProxyScreen } from './operations/dsh/sheinproxy';
import { ControlPanelDshZoneSetScreen } from './operations/dsh/zone-set';

const liveRouteHrefs = {
  overview: '/operations',
  orders: '/operations/dsh/orders',
  sheinProxy: '/operations/dsh/sheinproxy',
  reassign: '/operations/dsh/reassign',
  peakMode: '/operations/dsh/peak-mode',
  arrivalBell: '/operations/dsh/arrival-bell',
  zoneSet: '/operations/dsh/zone-set',
} as const;

type DshWorkspaceId = 'overview' | 'orders' | 'order-detail' | 'sheinproxy' | 'reassign' | 'peak-mode' | 'arrival-bell' | 'zone-set';

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
};

type DshDockRouteItem = {
  href?: string;
  label: string;
  description: string;
  statusLabel: string;
};

function ControlPanelDshOperationsDock() {
  const router = useRouter();
  const uiText = useUiText();
  const dshText = (uiText.controlPanel.ui as typeof uiText.controlPanel.ui & { dsh: DshDockText }).dsh;

  const liveRouteItems: ReadonlyArray<DshDockRouteItem> = [
    { href: liveRouteHrefs.overview, label: dshText.overviewLabel, description: dshText.overviewDescription, statusLabel: dshText.liveBadge },
    { href: liveRouteHrefs.orders, label: dshText.ordersLabel, description: dshText.ordersDescription, statusLabel: dshText.liveBadge },
    { href: liveRouteHrefs.sheinProxy, label: dshText.sheinProxyLabel, description: dshText.sheinProxyDescription, statusLabel: dshText.liveBadge },
    { href: liveRouteHrefs.reassign, label: dshText.reassignLabel, description: dshText.reassignDescription, statusLabel: dshText.liveBadge },
    { href: liveRouteHrefs.peakMode, label: dshText.peakModeLabel, description: dshText.peakModeDescription, statusLabel: dshText.liveBadge },
    { href: liveRouteHrefs.arrivalBell, label: dshText.arrivalBellLabel, description: dshText.arrivalBellDescription, statusLabel: dshText.liveBadge },
    { href: liveRouteHrefs.zoneSet, label: dshText.zoneSetLabel, description: dshText.zoneSetDescription, statusLabel: dshText.liveBadge },
  ];
  const plannedRoutesCount = 0;

  return (
    <BthBox gap={4}>
      <BthWebMissionHeroCard
        badges={[dshText.liveBadge, dshText.plannedBadge, 'DSH']}
        eyebrow={dshText.dockEyebrow}
        title={dshText.dockTitle}
        description={dshText.dockDescription}
        metaItems={[
          `${dshText.liveRoutesTitle}: ${liveRouteItems.length}`,
          `${dshText.plannedRoutesTitle}: ${plannedRoutesCount}`,
          dshText.openHubAction,
        ]}
        primaryAction={{ label: dshText.openOrdersAction, href: liveRouteHrefs.orders }}
        secondaryAction={{ label: dshText.openReassignAction, href: liveRouteHrefs.reassign }}
      />

      <BthBox gap={2}>
        <BthWebSignalCard title={dshText.liveSignalTitle} value={String(liveRouteItems.length)} description={dshText.liveSignalDescription} tone="best" />
        <BthWebSignalCard title={dshText.plannedSignalTitle} value={String(plannedRoutesCount)} description={dshText.plannedSignalDescription} />
        <BthWebSignalCard title={dshText.entrySignalTitle} value="3" description={dshText.entrySignalDescription} />
      </BthBox>

      <BthWebSectionCard title={dshText.liveRoutesTitle} description={dshText.liveRoutesDescription}>
        <BthBox gap={2}>
          {liveRouteItems.map((item) => (
            <BthBox key={item.label} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthBox layoutDirection="row" justify="space-between" align="center">
                <BthText role="bodyStrong">{item.label}</BthText>
                <BthText role="caption" tone="success">
                  {item.statusLabel}
                </BthText>
              </BthBox>
              <BthText role="bodySm" tone="muted">
                {item.description}
              </BthText>
              <BthButton
                label={dshText.openRouteAction}
                tone="secondary"
                fullWidth={false}
                onPress={() => {
                  if (item.href) {
                    router.push(item.href);
                  }
                }}
              />
            </BthBox>
          ))}
        </BthBox>
      </BthWebSectionCard>

      <BthWebSectionCard title={dshText.entrySignalTitle} description={dshText.entrySignalDescription}>
        <BthBox gap={2}>
          <BthButton label={dshText.openOrdersAction} onPress={() => router.push(liveRouteHrefs.orders)} />
          <BthButton label={dshText.openReassignAction} tone="secondary" onPress={() => router.push(liveRouteHrefs.reassign)} />
          <BthButton label={dshText.openPeakModeAction} tone="secondary" onPress={() => router.push(liveRouteHrefs.peakMode)} />
          <BthButton label={dshText.openArrivalBellAction} tone="secondary" onPress={() => router.push(liveRouteHrefs.arrivalBell)} />
        </BthBox>
      </BthWebSectionCard>
    </BthBox>
  );
}

export function DshControlPanelSurfaceHost({ workspace = 'overview', orderId }: DshControlPanelSurfaceHostProps) {
  const router = useRouter();
  const uiText = useUiText();
  const dshText = (uiText.controlPanel.ui as typeof uiText.controlPanel.ui & { dsh: {
    overviewLabel: string;
    ordersLabel: string;
    sheinProxyLabel: string;
    reassignLabel: string;
    peakModeLabel: string;
    arrivalBellLabel: string;
    zoneSetLabel: string;
  } }).dsh;

  const normalizedWorkspace = workspace === 'order-detail' ? 'orders' : workspace;

  const tabs = [
    { id: 'overview', label: dshText.overviewLabel, active: normalizedWorkspace === 'overview' },
    { id: 'orders', label: dshText.ordersLabel, active: normalizedWorkspace === 'orders' },
    { id: 'sheinproxy', label: dshText.sheinProxyLabel, active: normalizedWorkspace === 'sheinproxy' },
    { id: 'reassign', label: dshText.reassignLabel, active: normalizedWorkspace === 'reassign' },
    { id: 'peak-mode', label: dshText.peakModeLabel, active: normalizedWorkspace === 'peak-mode' },
    { id: 'arrival-bell', label: dshText.arrivalBellLabel, active: normalizedWorkspace === 'arrival-bell' },
    { id: 'zone-set', label: dshText.zoneSetLabel, active: normalizedWorkspace === 'zone-set' },
  ] as const;

  return (
    <BthBox gap={4}>
      {workspace === 'overview' ? <ControlPanelDshOperationsDock /> : null}

      {workspace !== 'overview' ? (
        <BthWebSegmentedTabs
          ariaLabel={uiText.controlPanel.surfaceTitles.operations}
          items={tabs}
          onSelect={(workspaceId) => {
            if (workspaceId === 'overview') {
              router.push('/operations');
              return;
            }

            router.push(`/operations/dsh/${workspaceId}`);
          }}
        />
      ) : null}

      {workspace === 'orders' ? <ControlPanelDshOrdersScreen embedded showHeader={false} hubHref="/operations" operationsHref="/operations" /> : null}
      {workspace === 'order-detail' && orderId ? <ControlPanelDshOrderDetailScreen embedded showHeader={false} orderId={orderId} hubHref="/operations" ordersHref="/operations/dsh/orders" /> : null}
      {workspace === 'sheinproxy' ? <ControlPanelDshSheinProxyScreen hubHref="/operations" operationsHref="/operations" supportHref="/support" /> : null}
      {workspace === 'reassign' ? <ControlPanelDshReassignScreen embedded showHeader={false} hubHref="/operations" ordersHref="/operations/dsh/orders" /> : null}
      {workspace === 'peak-mode' ? <ControlPanelDshPeakModeScreen embedded showHeader={false} hubHref="/operations" ordersHref="/operations/dsh/orders" /> : null}
      {workspace === 'arrival-bell' ? <ControlPanelDshArrivalBellScreen embedded showHeader={false} hubHref="/operations" ordersHref="/operations/dsh/orders" /> : null}
      {workspace === 'zone-set' ? <ControlPanelDshZoneSetScreen embedded showHeader={false} hubHref="/operations" ordersHref="/operations/dsh/orders" /> : null}
    </BthBox>
  );
}

export default DshControlPanelSurfaceHost;