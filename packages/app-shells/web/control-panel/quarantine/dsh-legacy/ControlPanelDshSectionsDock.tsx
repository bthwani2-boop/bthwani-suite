"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { BthBox, BthButton, BthText, useUiText } from '@bthwani/ui-kit';
import { BthWebMissionHeroCard, BthWebSectionCard } from '@bthwani/ui-kit/web';

type ControlPanelSectionId =
  | 'dashboard'
  | 'operations'
  | 'finance'
  | 'catalogs'
  | 'support'
  | 'partners'
  | 'marketing'
  | 'control';

type ControlPanelSubSectionId = 'platform' | 'administration' | 'governance' | 'hr';

type SectionRouteItem = {
  id: ControlPanelSectionId | ControlPanelSubSectionId;
  href: string;
  label: string;
  description: string;
  active: boolean;
  badge?: string;
};

export type ControlPanelDshSectionsDockProps = {
  activeSection: ControlPanelSectionId;
  activeSubSection?: ControlPanelSubSectionId;
};

type DshSectionsDockText = {
  eyebrow: string;
  title: string;
  description: string;
  metaSectionsLabel: string;
  metaSubSectionsLabel: string;
  metaLayerLabel: string;
  mainTitle: string;
  mainDescription: string;
  openSectionAction: string;
  openSubSectionAction: string;
  subSectionBadge: string;
};

export function ControlPanelDshSectionsDock({ activeSection, activeSubSection }: ControlPanelDshSectionsDockProps) {
  const router = useRouter();
  const uiText = useUiText();
  const panelText = uiText.controlPanel;
  const dshText = (panelText.ui as typeof panelText.ui & { dsh: { sectionsDock: DshSectionsDockText; openHubAction: string } }).dsh;
  const sectionsText = dshText.sectionsDock;

  const sectionItems: ReadonlyArray<SectionRouteItem> = [
    {
      id: 'dashboard',
      href: '/dashboard',
      label: panelText.surfaceTitles.dashboard,
      description: panelText.surfaceDescriptions.dashboard,
      active: activeSection === 'dashboard',
      badge: panelText.ui.openServiceSpace,
    },
    {
      id: 'operations',
      href: '/operations',
      label: panelText.surfaceTitles.operations,
      description: panelText.surfaceDescriptions.operations,
      active: activeSection === 'operations',
      badge: 'DSH',
    },
    {
      id: 'finance',
      href: '/finance',
      label: panelText.surfaceTitles.finance,
      description: panelText.surfaceDescriptions.finance,
      active: activeSection === 'finance',
    },
    {
      id: 'catalogs',
      href: '/catalogs',
      label: panelText.surfaceTitles.catalogs,
      description: panelText.surfaceDescriptions.catalogs,
      active: activeSection === 'catalogs',
    },
    {
      id: 'support',
      href: '/support',
      label: panelText.surfaceTitles.support,
      description: panelText.surfaceDescriptions.support,
      active: activeSection === 'support',
    },
    {
      id: 'partners',
      href: '/partners',
      label: panelText.surfaceTitles.partners,
      description: panelText.surfaceDescriptions.partners,
      active: activeSection === 'partners',
    },
    {
      id: 'marketing',
      href: '/marketing',
      label: panelText.surfaceTitles.marketing,
      description: panelText.surfaceDescriptions.marketing,
      active: activeSection === 'marketing',
    },
    {
      id: 'control',
      href: '/control',
      label: panelText.surfaceTitles.control,
      description: panelText.surfaceDescriptions.control,
      active: activeSection === 'control',
    },
  ];

  const controlSectionItems: ReadonlyArray<SectionRouteItem> = [
    {
      id: 'platform',
      href: '/control/platform',
      label: panelText.subSections.platform,
      description: panelText.subSectionDescriptions.platform,
      active: activeSection === 'control' && activeSubSection === 'platform',
    },
    {
      id: 'administration',
      href: '/control/administration',
      label: panelText.subSections.administration,
      description: panelText.subSectionDescriptions.administration,
      active: activeSection === 'control' && activeSubSection === 'administration',
    },
    {
      id: 'governance',
      href: '/control/governance',
      label: panelText.subSections.governance,
      description: panelText.subSectionDescriptions.governance,
      active: activeSection === 'control' && activeSubSection === 'governance',
    },
    {
      id: 'hr',
      href: '/control/hr',
      label: panelText.subSections.hr,
      description: panelText.subSectionDescriptions.hr,
      active: activeSection === 'control' && activeSubSection === 'hr',
    },
  ];

  return (
    <BthBox gap={4}>
      <BthWebMissionHeroCard
        badges={[panelText.brandLabel, 'DSH']}
        eyebrow={sectionsText.eyebrow}
        title={sectionsText.title}
        description={sectionsText.description}
        metaItems={[
          `${sectionsText.metaSectionsLabel}: ${sectionItems.length}`,
          `${sectionsText.metaSubSectionsLabel}: ${controlSectionItems.length}`,
          sectionsText.metaLayerLabel,
        ]}
        primaryAction={{ label: panelText.ui.openServiceSpace, href: '/dashboard' }}
        secondaryAction={{ label: dshText.openHubAction, href: '/operations' }}
      />

      <BthWebSectionCard title={sectionsText.mainTitle} description={sectionsText.mainDescription}>
        <BthBox gap={2}>
          {sectionItems.map((item) => (
            <BthBox key={item.id} padding={3} gap={1} border radiusToken="xl" background={item.active ? 'surfaceRaised' : 'surface'}>
              <BthBox layoutDirection="row" justify="space-between" align="center">
                <BthText role="bodyStrong">{item.label}</BthText>
                {item.badge ? <BthText role="caption" tone="brand">{item.badge}</BthText> : null}
              </BthBox>
              <BthText role="bodySm" tone="muted">{item.description}</BthText>
              <BthButton label={sectionsText.openSectionAction} tone="secondary" fullWidth={false} onPress={() => router.push(item.href)} />
            </BthBox>
          ))}
        </BthBox>
      </BthWebSectionCard>

      <BthWebSectionCard title={panelText.ui.subsectionTitle} description={panelText.ui.subsectionDescription}>
        <BthBox gap={2}>
          {controlSectionItems.map((item) => (
            <BthBox key={item.id} padding={3} gap={1} border radiusToken="xl" background={item.active ? 'surfaceRaised' : 'surface'}>
              <BthBox layoutDirection="row" justify="space-between" align="center">
                <BthText role="bodyStrong">{item.label}</BthText>
                <BthText role="caption" tone="soft">{sectionsText.subSectionBadge}</BthText>
              </BthBox>
              <BthText role="bodySm" tone="muted">{item.description}</BthText>
              <BthButton label={sectionsText.openSubSectionAction} tone="secondary" fullWidth={false} onPress={() => router.push(item.href)} />
            </BthBox>
          ))}
        </BthBox>
      </BthWebSectionCard>
    </BthBox>
  );
}

export default ControlPanelDshSectionsDock;