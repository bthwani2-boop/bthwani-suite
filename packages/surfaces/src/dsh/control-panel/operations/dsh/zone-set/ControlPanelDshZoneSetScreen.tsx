'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BthBox, BthStateView, BthText, useDshControlPanelText } from '@bthwani/ui-kit';
import {
  BthWebMissionHeroCard,
  BthWebPageFrame,
  BthWebSectionCard,
  BthWebSignalCard,
} from '@bthwani/ui-kit/web';
import {
  getDshZoneSetLanes,
  getDshZoneSetPolicies,
  getDshZoneSetSummary,
} from './zone-set-fixtures';
import styles from '../dsh-surface.module.css';

type ControlPanelDshZoneSetScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

function resolveStateCopy(text: ReturnType<typeof useDshControlPanelText>, state: Exclude<ControlPanelDshZoneSetScreenState, 'ready'>) {
  if (state === 'loading') {
    return {
      stateId: 'loading' as const,
      title: text.zoneSet.stateLoadingTitle,
      description: text.zoneSet.stateLoadingDescription,
      actionLabel: text.common.backToHub,
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty' as const,
      title: text.zoneSet.stateEmptyTitle,
      description: text.zoneSet.stateEmptyDescription,
      actionLabel: text.common.backToHub,
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline' as const,
      title: text.zoneSet.stateOfflineTitle,
      description: text.zoneSet.stateOfflineDescription,
      actionLabel: text.common.backToHub,
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning' as const,
      title: text.zoneSet.stateDisabledTitle,
      description: text.zoneSet.stateDisabledDescription,
      actionLabel: text.common.backToHub,
    };
  }

  return {
    stateId: 'recoverableError' as const,
    title: text.zoneSet.stateErrorTitle,
    description: text.zoneSet.stateErrorDescription,
    actionLabel: text.common.backToHub,
  };
}

export type ControlPanelDshZoneSetScreenProps = {
  state?: ControlPanelDshZoneSetScreenState;
  hubHref?: string;
  ordersHref?: string;
  supportHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

export function ControlPanelDshZoneSetScreen({
  state = 'ready',
  hubHref = '/operations/dsh',
  ordersHref = '/operations/dsh/orders',
  supportHref = '/support',
  embedded = false,
  showHeader = true,
}: ControlPanelDshZoneSetScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const summary = React.useMemo(() => getDshZoneSetSummary(dshText), [dshText]);
  const policies = React.useMemo(() => getDshZoneSetPolicies(dshText), [dshText]);
  const lanes = React.useMemo(() => getDshZoneSetLanes(dshText), [dshText]);

  if (state !== 'ready') {
    const stateCopy = resolveStateCopy(dshText, state);

    return (
      <BthWebPageFrame
        eyebrow={dshText.zoneSet.pageEyebrow}
        title={dshText.zoneSet.pageTitle}
        description={dshText.zoneSet.unavailableDescription}
        maxWidth={1120}
        embedded={embedded}
        showHeader={showHeader}
      >
        <BthStateView {...stateCopy} onActionPress={() => router.push(hubHref)} />
      </BthWebPageFrame>
    );
  }

  return (
    <BthWebPageFrame
      eyebrow={dshText.zoneSet.pageEyebrow}
      title={dshText.zoneSet.pageTitle}
      description={dshText.zoneSet.pageDescription}
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <div className={styles.stack}>
        <BthWebMissionHeroCard
          badges={['/operations/dsh/zone-set', dshText.common.live, `${dshText.zoneSet.signals.reviewZones}: ${summary.reviewZones}`]}
          eyebrow={dshText.zoneSet.heroEyebrow}
          title={dshText.zoneSet.heroTitle}
          description={dshText.zoneSet.heroDescription}
          metaItems={[
            `${dshText.zoneSet.signals.configuredZones}: ${summary.configuredZones}`,
            `${dshText.zoneSet.signals.protectedZones}: ${summary.protectedZones}`,
            `${dshText.zoneSet.signals.freeDeliveryZones}: ${summary.freeDeliveryZones}`,
          ]}
          primaryAction={{ label: dshText.common.openOperationsWorkspace, href: hubHref }}
          secondaryAction={{ label: dshText.common.openOrders, href: ordersHref }}
        />

        <div className={styles.signalGrid}>
          <BthWebSignalCard title={dshText.zoneSet.signals.configuredZones} value={String(summary.configuredZones)} description={dshText.zoneSet.signals.configuredZonesDescription} tone="best" />
          <BthWebSignalCard title={dshText.zoneSet.signals.protectedZones} value={String(summary.protectedZones)} description={dshText.zoneSet.signals.protectedZonesDescription} />
          <BthWebSignalCard title={dshText.zoneSet.signals.freeDeliveryZones} value={String(summary.freeDeliveryZones)} description={dshText.zoneSet.signals.freeDeliveryZonesDescription} />
          <BthWebSignalCard title={dshText.zoneSet.signals.reviewZones} value={String(summary.reviewZones)} description={dshText.zoneSet.signals.reviewZonesDescription} />
        </div>

        <BthWebSectionCard title={dshText.zoneSet.policiesTitle} description={dshText.zoneSet.policiesDescription}>
          <div className={styles.cardGrid}>
            {policies.map((policy) => (
              <BthBox key={policy.label} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
                <BthBox layoutDirection="row" justify="space-between" align="center">
                  <BthText role="bodyStrong">{policy.label}</BthText>
                  <BthText role="caption" tone="brand">{policy.statusLabel}</BthText>
                </BthBox>
                <BthText role="bodySm" tone="muted">{policy.description}</BthText>
              </BthBox>
            ))}
          </div>
        </BthWebSectionCard>

        <BthWebSectionCard title={dshText.zoneSet.lanesTitle} description={dshText.zoneSet.lanesDescription}>
          <div className={styles.cardGrid}>
            {lanes.map((lane) => (
              <BthBox key={lane.zoneLabel} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
                <BthBox layoutDirection="row" justify="space-between" align="center">
                  <BthText role="bodyStrong">{lane.zoneLabel}</BthText>
                  <BthText role="caption" tone={lane.tone}>{lane.recommendationLabel}</BthText>
                </BthBox>
                <BthText role="bodySm">{lane.statusLabel}</BthText>
                <BthText role="caption" tone="soft">{lane.feeLabel} · {lane.etaLabel}</BthText>
                <BthText role="bodySm" tone="muted">{lane.note}</BthText>
              </BthBox>
            ))}
          </div>
        </BthWebSectionCard>
      </div>
    </BthWebPageFrame>
  );
}

export default ControlPanelDshZoneSetScreen;