"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { BthBox, BthButton, BthText, useUiText } from '@bthwani/ui-kit';
import {
  BthWebMissionHeroCard,
  BthWebSectionCard,
  BthWebSignalCard,
} from '@bthwani/ui-kit/web';
import { controlPanelRuntimeData } from '../runtime.data';

type ControlPanelOverviewDockText = {
  title: string;
  description: string;
  liveServicesBadge: string;
  sectionsBadge: string;
  routeActionLabel: string;
  relatedSurfacesTitle: string;
  relatedSurfacesDescription: string;
};

const relatedSurfaceLinks = [
  { href: '/dashboard', surfaceId: 'dashboard' },
  { href: '/operations', surfaceId: 'operations' },
  { href: '/finance', surfaceId: 'finance' },
  { href: '/support', surfaceId: 'support' },
] as const;

export function ControlPanelOperationsOverviewDock() {
  const router = useRouter();
  const uiText = useUiText();
  const panelText = uiText.controlPanel;
  const dshText = (panelText.ui as typeof panelText.ui & { dsh: { overviewDock: ControlPanelOverviewDockText; openOrdersAction: string; openReassignAction: string } }).dsh;
  const overviewText = dshText.overviewDock;
  const dshActionText = dshText;
  const liveServiceCount = controlPanelRuntimeData.services.filter((service) => service.statusKind === 'live').length;
  const totalServiceCount = controlPanelRuntimeData.services.length;
  const sectionCount = controlPanelRuntimeData.sections.length;

  const signalCards = [
    {
      title: panelText.signals.bestPath.title,
      value: String(liveServiceCount),
      description: `${panelText.signals.bestPath.description} ${panelText.surfaceTitles.operations}.`,
      tone: 'best' as const,
    },
    {
      title: panelText.signals.pressure.title,
      value: String(sectionCount),
      description: panelText.surfaceDescriptions.operations,
      tone: 'danger' as const,
    },
    {
      title: panelText.signals.liveRefresh.title,
      value: String(totalServiceCount),
      description: panelText.signals.liveRefresh.description,
      tone: 'neutral' as const,
    },
  ];

  return (
    <BthBox gap={4}>
      <BthWebMissionHeroCard
        dense
        badges={[
          panelText.surfaceTitles.operations,
          `${liveServiceCount}/${totalServiceCount} ${overviewText.liveServicesBadge}`,
          `${sectionCount} ${overviewText.sectionsBadge}`,
        ]}
        eyebrow={panelText.brandLabel}
        title={overviewText.title}
        description={overviewText.description}
        metaItems={[
          `${panelText.ui.serviceLabel}: ${liveServiceCount}/${totalServiceCount}`,
          `${panelText.ui.sectionsBadge} ${sectionCount}`,
          dshActionText.openOrdersAction,
        ]}
        primaryAction={{ label: dshActionText.openOrdersAction, href: '/operations/dsh/orders' }}
        secondaryAction={{ label: dshActionText.openReassignAction, href: '/operations/dsh/reassign' }}
      />

      <BthBox gap={2}>
        {signalCards.map((signal) => (
          <BthWebSignalCard
            key={signal.title}
            title={signal.title}
            value={signal.value}
            description={signal.description}
            tone={signal.tone}
          />
        ))}
      </BthBox>

      <BthWebSectionCard
        title={overviewText.relatedSurfacesTitle}
        description={overviewText.relatedSurfacesDescription}
      >
        <BthBox gap={2}>
          {relatedSurfaceLinks.map((item) => {
            const label = panelText.surfaceTitles[item.surfaceId as keyof typeof panelText.surfaceTitles];
            const description = panelText.surfaceDescriptions[item.surfaceId as keyof typeof panelText.surfaceDescriptions];

            return (
              <BthBox key={item.href} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
                <BthBox layoutDirection="row" justify="space-between" align="center">
                  <BthText role="bodyStrong">{label}</BthText>
                  <BthText role="caption" tone={item.surfaceId === 'operations' ? 'success' : 'muted'}>
                    {item.surfaceId === 'operations' ? overviewText.routeActionLabel : panelText.ui.openServiceSpace}
                  </BthText>
                </BthBox>
                <BthText role="bodySm" tone="muted">
                  {description}
                </BthText>
                <BthButton
                  label={item.surfaceId === 'operations' ? overviewText.routeActionLabel : panelText.ui.openServiceSpace}
                  tone={item.surfaceId === 'operations' ? 'primary' : 'secondary'}
                  fullWidth={false}
                  onPress={() => router.push(item.href)}
                />
              </BthBox>
            );
          })}
        </BthBox>
      </BthWebSectionCard>
    </BthBox>
  );
}

export default ControlPanelOperationsOverviewDock;
