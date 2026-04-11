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
  catalogsDock: {
    cards: {
      serviceRecordsLabel: string;
      serviceRecordsDescription: string;
      policyLabel: string;
      policyDescription: string;
      nextExtensionLabel: string;
      nextExtensionDescription: string;
    };
    title: string;
    description: string;
    layerLabel: string;
    itemsTitle: string;
    itemsDescription: string;
    liveRecordTitle: string;
    liveRecordDescription: string;
    plannedRecordTitle: string;
    plannedRecordDescription: string;
    returnLabel: string;
  };
};

export function ControlPanelDshCatalogsDock() {
  const router = useRouter();
  const uiText = useUiText();
  const dshText = (uiText.controlPanel.ui as typeof uiText.controlPanel.ui & { dsh: DshDockText }).dsh;
  const catalogCards = [
    { label: dshText.catalogsDock.cards.serviceRecordsLabel, value: '9', description: dshText.catalogsDock.cards.serviceRecordsDescription },
    { label: dshText.catalogsDock.cards.policyLabel, value: '4', description: dshText.catalogsDock.cards.policyDescription },
    { label: dshText.catalogsDock.cards.nextExtensionLabel, value: '2', description: dshText.catalogsDock.cards.nextExtensionDescription },
  ] as const;

  return (
    <BthBox gap={4}>
      <BthWebMissionHeroCard
        badges={[dshText.plannedBadge, uiText.controlPanel.surfaceTitles.catalogs]}
        eyebrow="DSH / catalogs"
        title={dshText.catalogsDock.title}
        description={dshText.catalogsDock.description}
        metaItems={[
          `${dshText.plannedRoutesTitle}: ${catalogCards.length}`,
          dshText.openHubAction,
          dshText.catalogsDock.layerLabel,
        ]}
        primaryAction={{ label: dshText.openHubAction, href: '/operations' }}
        secondaryAction={{ label: dshText.catalogsDock.returnLabel, href: '/catalogs' }}
      />

      <BthBox gap={2}>
        {catalogCards.map((card) => (
          <BthWebSignalCard key={card.label} title={card.label} value={card.value} description={card.description} tone="neutral" />
        ))}
      </BthBox>

      <BthWebSectionCard title={dshText.catalogsDock.itemsTitle} description={dshText.catalogsDock.itemsDescription}>
        <BthBox gap={2}>
          <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
            <BthText role="bodyStrong">{dshText.catalogsDock.liveRecordTitle}</BthText>
            <BthText role="bodySm" tone="muted">{dshText.catalogsDock.liveRecordDescription}</BthText>
          </BthBox>
          <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
            <BthText role="bodyStrong">{dshText.catalogsDock.plannedRecordTitle}</BthText>
            <BthText role="bodySm" tone="muted">{dshText.catalogsDock.plannedRecordDescription}</BthText>
          </BthBox>
          <BthButton label={dshText.openHubAction} onPress={() => router.push('/operations')} />
        </BthBox>
      </BthWebSectionCard>
    </BthBox>
  );
}

export default ControlPanelDshCatalogsDock;