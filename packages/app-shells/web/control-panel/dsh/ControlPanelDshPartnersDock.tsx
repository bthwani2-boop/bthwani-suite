"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { BthBox, BthButton, BthText, useUiText } from '@bthwani/ui-kit';
import { BthWebMissionHeroCard, BthWebSectionCard, BthWebSignalCard } from '@bthwani/ui-kit/web';

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
  partnersDock: {
    cards: {
      activationLabel: string;
      activationDescription: string;
      reviewLabel: string;
      reviewDescription: string;
      escalationLabel: string;
      escalationDescription: string;
    };
    title: string;
    description: string;
    layerLabel: string;
    decisionsTitle: string;
    decisionsDescription: string;
    bridgeTitle: string;
    bridgeDescription: string;
    readinessTitle: string;
    readinessDescription: string;
    returnLabel: string;
  };
};

export function ControlPanelDshPartnersDock() {
  const router = useRouter();
  const uiText = useUiText();
  const dshText = (uiText.controlPanel.ui as typeof uiText.controlPanel.ui & { dsh: DshDockText }).dsh;
  const partnerCards = [
    { label: dshText.partnersDock.cards.activationLabel, value: '6', description: dshText.partnersDock.cards.activationDescription },
    { label: dshText.partnersDock.cards.reviewLabel, value: '2', description: dshText.partnersDock.cards.reviewDescription },
    { label: dshText.partnersDock.cards.escalationLabel, value: '1', description: dshText.partnersDock.cards.escalationDescription },
  ] as const;

  return (
    <BthBox gap={4}>
      <BthWebMissionHeroCard
        badges={[dshText.liveBadge, uiText.controlPanel.surfaceTitles.partners]}
        eyebrow="DSH / partners"
        title={dshText.partnersDock.title}
        description={dshText.partnersDock.description}
        metaItems={[
          `${dshText.liveRoutesTitle}: ${partnerCards.length}`,
          dshText.openHubAction,
          dshText.partnersDock.layerLabel,
        ]}
        primaryAction={{ label: dshText.openHubAction, href: '/operations' }}
        secondaryAction={{ label: dshText.partnersDock.returnLabel, href: '/operations' }}
      />

      <BthBox gap={2}>
        {partnerCards.map((card) => (
          <BthWebSignalCard key={card.label} title={card.label} value={card.value} description={card.description} tone="neutral" />
        ))}
      </BthBox>

      <BthWebSectionCard title={dshText.partnersDock.decisionsTitle} description={dshText.partnersDock.decisionsDescription}>
        <BthBox gap={2}>
          <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
            <BthText role="bodyStrong">{dshText.partnersDock.bridgeTitle}</BthText>
            <BthText role="bodySm" tone="muted">{dshText.partnersDock.bridgeDescription}</BthText>
          </BthBox>
          <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
            <BthText role="bodyStrong">{dshText.partnersDock.readinessTitle}</BthText>
            <BthText role="bodySm" tone="muted">{dshText.partnersDock.readinessDescription}</BthText>
          </BthBox>
          <BthButton label={dshText.openHubAction} onPress={() => router.push('/operations')} />
        </BthBox>
      </BthWebSectionCard>
    </BthBox>
  );
}

export default ControlPanelDshPartnersDock;