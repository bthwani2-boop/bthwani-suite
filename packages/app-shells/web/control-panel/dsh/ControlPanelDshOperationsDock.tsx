"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { BthBox, BthButton, BthText, useUiText } from '@bthwani/ui-kit';
import {
  BthWebMissionHeroCard,
  BthWebSectionCard,
  BthWebSignalCard,
} from '@bthwani/ui-kit/web';

type DshDockRouteItem = {
  href?: string;
  label: string;
  description: string;
  statusLabel: string;
};

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

const liveRouteHrefs = {
  overview: '/operations',
  orders: '/operations/dsh/orders',
  reassign: '/operations/dsh/reassign',
  peakMode: '/operations/dsh/peak-mode',
  arrivalBell: '/operations/dsh/arrival-bell',
} as const;

const plannedRouteItems = ['zoneSet', 'sheinProxy'] as const;

export function ControlPanelDshOperationsDock() {
  const router = useRouter();
  const uiText = useUiText();
  const dshText = (uiText.controlPanel.ui as typeof uiText.controlPanel.ui & { dsh: DshDockText }).dsh;

  const liveRouteItems: ReadonlyArray<DshDockRouteItem> = [
    {
      href: liveRouteHrefs.overview,
      label: dshText.overviewLabel,
      description: dshText.overviewDescription,
      statusLabel: dshText.liveBadge,
    },
    {
      href: liveRouteHrefs.orders,
      label: dshText.ordersLabel,
      description: dshText.ordersDescription,
      statusLabel: dshText.liveBadge,
    },
    {
      href: liveRouteHrefs.reassign,
      label: dshText.reassignLabel,
      description: dshText.reassignDescription,
      statusLabel: dshText.liveBadge,
    },
    {
      href: liveRouteHrefs.peakMode,
      label: dshText.peakModeLabel,
      description: dshText.peakModeDescription,
      statusLabel: dshText.liveBadge,
    },
    {
      href: liveRouteHrefs.arrivalBell,
      label: dshText.arrivalBellLabel,
      description: dshText.arrivalBellDescription,
      statusLabel: dshText.liveBadge,
    },
  ];

  const plannedRouteItemsView: ReadonlyArray<DshDockRouteItem> = [
    {
      label: dshText.zoneSetLabel,
      description: dshText.zoneSetDescription,
      statusLabel: dshText.plannedBadge,
    },
    {
      label: dshText.sheinProxyLabel,
      description: dshText.sheinProxyDescription,
      statusLabel: dshText.plannedBadge,
    },
  ];

  return (
    <BthBox gap={4}>
      <BthWebMissionHeroCard
        badges={[dshText.liveBadge, dshText.plannedBadge, 'DSH']}
        eyebrow={dshText.dockEyebrow}
        title={dshText.dockTitle}
        description={dshText.dockDescription}
        metaItems={[
          `${dshText.liveRoutesTitle}: ${liveRouteItems.length}`,
          `${dshText.plannedRoutesTitle}: ${plannedRouteItems.length}`,
          dshText.openHubAction,
        ]}
        primaryAction={{ label: dshText.openOrdersAction, href: liveRouteHrefs.orders }}
        secondaryAction={{ label: dshText.openReassignAction, href: liveRouteHrefs.reassign }}
      />

      <BthBox gap={2}>
        <BthWebSignalCard
          title={dshText.liveSignalTitle}
          value={String(liveRouteItems.length)}
          description={dshText.liveSignalDescription}
          tone="best"
        />
        <BthWebSignalCard
          title={dshText.plannedSignalTitle}
          value={String(plannedRouteItemsView.length)}
          description={dshText.plannedSignalDescription}
        />
        <BthWebSignalCard
          title={dshText.entrySignalTitle}
          value="3"
          description={dshText.entrySignalDescription}
        />
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

      <BthWebSectionCard title={dshText.plannedRoutesTitle} description={dshText.plannedRoutesDescription}>
        <BthBox gap={2}>
          {plannedRouteItemsView.map((item) => (
            <BthBox key={item.label} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthBox layoutDirection="row" justify="space-between" align="center">
                <BthText role="bodyStrong">{item.label}</BthText>
                <BthText role="caption" tone="soft">
                  {item.statusLabel}
                </BthText>
              </BthBox>
              <BthText role="bodySm" tone="muted">
                {item.description}
              </BthText>
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

export default ControlPanelDshOperationsDock;