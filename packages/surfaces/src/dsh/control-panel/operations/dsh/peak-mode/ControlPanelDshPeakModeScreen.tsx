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
  getDshPeakModePolicies,
  getDshPeakModePressureLanes,
  getDshPeakModeSummary,
} from './peak-mode-fixtures';
import styles from '../dsh-surface.module.css';

type ControlPanelDshPeakModeScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

function resolveStateCopy(text: ReturnType<typeof useDshControlPanelText>, state: Exclude<ControlPanelDshPeakModeScreenState, 'ready'>) {
  if (state === 'loading') {
    return {
      stateId: 'loading' as const,
      title: text.peakMode.stateLoadingTitle,
      description: text.peakMode.stateLoadingDescription,
      actionLabel: text.common.backToHub,
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty' as const,
      title: text.peakMode.stateEmptyTitle,
      description: text.peakMode.stateEmptyDescription,
      actionLabel: text.common.backToHub,
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline' as const,
      title: text.peakMode.stateOfflineTitle,
      description: text.peakMode.stateOfflineDescription,
      actionLabel: text.common.backToHub,
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning' as const,
      title: text.peakMode.stateDisabledTitle,
      description: text.peakMode.stateDisabledDescription,
      actionLabel: text.common.backToHub,
    };
  }

  return {
    stateId: 'recoverableError' as const,
    title: text.peakMode.stateErrorTitle,
    description: text.peakMode.stateErrorDescription,
    actionLabel: text.common.backToHub,
  };
}

export type ControlPanelDshPeakModeScreenProps = {
  state?: ControlPanelDshPeakModeScreenState;
  hubHref?: string;
  ordersHref?: string;
  supportHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

export function ControlPanelDshPeakModeScreen({
  state = 'ready',
  hubHref = '/operations/dsh',
  ordersHref = '/operations/dsh/orders',
  supportHref = '/support',
  embedded = false,
  showHeader = true,
}: ControlPanelDshPeakModeScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const summary = React.useMemo(() => getDshPeakModeSummary(dshText), [dshText]);
  const policies = React.useMemo(() => getDshPeakModePolicies(dshText), [dshText]);
  const lanes = React.useMemo(() => getDshPeakModePressureLanes(dshText), [dshText]);

  if (state !== 'ready') {
    const stateCopy = resolveStateCopy(dshText, state);

    return (
      <BthWebPageFrame
        eyebrow={dshText.peakMode.pageEyebrow}
        title={dshText.peakMode.pageTitle}
        description={dshText.peakMode.unavailableDescription}
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
      eyebrow={dshText.peakMode.pageEyebrow}
      title={dshText.peakMode.pageTitle}
      description={dshText.peakMode.pageDescription}
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <div className={styles.stack}>
        <BthWebMissionHeroCard
          badges={['/operations/dsh/peak-mode', dshText.common.live, `${dshText.peakMode.signals.pressureZones}: ${summary.pressureZones}`]}
          eyebrow={dshText.peakMode.heroEyebrow}
          title={dshText.peakMode.heroTitle}
          description={dshText.peakMode.heroDescription}
          metaItems={[
            `${dshText.peakMode.signals.activeZones}: ${summary.activeZones}`,
            `${dshText.peakMode.signals.flexCaptains}: ${summary.flexCaptains}`,
            `${dshText.peakMode.signals.protectedQueues}: ${summary.protectedQueues}`,
          ]}
          primaryAction={{ label: dshText.common.openOperationsWorkspace, href: hubHref }}
          secondaryAction={{ label: dshText.common.openOrders, href: ordersHref }}
        />

        <div className={styles.signalGrid}>
          <BthWebSignalCard title={dshText.peakMode.signals.activeZones} value={String(summary.activeZones)} description={dshText.peakMode.signals.activeZonesDescription} tone="best" />
          <BthWebSignalCard title={dshText.peakMode.signals.pressureZones} value={String(summary.pressureZones)} description={dshText.peakMode.signals.pressureZonesDescription} />
          <BthWebSignalCard title={dshText.peakMode.signals.flexCaptains} value={String(summary.flexCaptains)} description={dshText.peakMode.signals.flexCaptainsDescription} />
          <BthWebSignalCard title={dshText.peakMode.signals.protectedQueues} value={String(summary.protectedQueues)} description={dshText.peakMode.signals.protectedQueuesDescription} />
        </div>

        <BthWebSectionCard title={dshText.peakMode.policiesTitle} description={dshText.peakMode.policiesDescription}>
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

        <BthWebSectionCard title={dshText.peakMode.lanesTitle} description={dshText.peakMode.lanesDescription}>
          <div className={styles.cardGrid}>
            {lanes.map((lane) => (
              <BthBox key={lane.zoneLabel} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
                <BthBox layoutDirection="row" justify="space-between" align="center">
                  <BthText role="bodyStrong">{lane.zoneLabel}</BthText>
                  <BthText role="caption" tone={lane.tone}>{lane.recommendationLabel}</BthText>
                </BthBox>
                <BthText role="bodySm">{lane.loadLabel}</BthText>
                <BthText role="caption" tone="soft">{lane.captainCapacityLabel} · {lane.queueLabel}</BthText>
                <BthText role="bodySm" tone="muted">{lane.note}</BthText>
              </BthBox>
            ))}
          </div>
        </BthWebSectionCard>
      </div>
    </BthWebPageFrame>
  );
}

export default ControlPanelDshPeakModeScreen;