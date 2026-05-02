'use client';

import React from 'react';
import {
  useRouter } from 'next/navigation';
import { Box,
  StateView,
  Text
} from '@bthwani/ui-kit';
import {
  WebMissionHeroCard,
  WebPageFrame,
  WebSectionCard,
  WebSignalCard,
} from '@bthwani/ui-kit/web';
import { useDshControlPanelText } from '../shared/dshControlPanelText';
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
  hubHref = '/operations',
  ordersHref = '/operations?workspace=orders',
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
      <WebPageFrame
        eyebrow={dshText.peakMode.pageEyebrow}
        title={dshText.peakMode.pageTitle}
        description={dshText.peakMode.unavailableDescription}
        maxWidth={1120}
        embedded={embedded}
        showHeader={showHeader}
      >
        <StateView {...stateCopy} onActionPress={() => router.push(hubHref)} />
      </WebPageFrame>
    );
  }

  return (
    <WebPageFrame
      eyebrow={dshText.peakMode.pageEyebrow}
      title={dshText.peakMode.pageTitle}
      description={dshText.peakMode.pageDescription}
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <div className={styles.stack}>
        <WebMissionHeroCard
          badges={['/operations?workspace=peak-mode', dshText.common.live, `${dshText.peakMode.signals.pressureZones}: ${summary.pressureZones}`]}
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
          <WebSignalCard title={dshText.peakMode.signals.activeZones} value={String(summary.activeZones)} description={dshText.peakMode.signals.activeZonesDescription} tone="best" />
          <WebSignalCard title={dshText.peakMode.signals.pressureZones} value={String(summary.pressureZones)} description={dshText.peakMode.signals.pressureZonesDescription} />
          <WebSignalCard title={dshText.peakMode.signals.flexCaptains} value={String(summary.flexCaptains)} description={dshText.peakMode.signals.flexCaptainsDescription} />
          <WebSignalCard title={dshText.peakMode.signals.protectedQueues} value={String(summary.protectedQueues)} description={dshText.peakMode.signals.protectedQueuesDescription} />
        </div>

        <WebSectionCard title={dshText.peakMode.policiesTitle} description={dshText.peakMode.policiesDescription}>
          <div className={styles.cardGrid}>
            {policies.map((policy) => (
              <Box key={policy.label} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
                <Box layoutDirection="row" justify="space-between" align="center">
                  <Text role="bodyStrong">{policy.label}</Text>
                  <Text role="caption" tone="brand">{policy.statusLabel}</Text>
                </Box>
                <Text role="bodySm" tone="muted">{policy.description}</Text>
              </Box>
            ))}
          </div>
        </WebSectionCard>

        <WebSectionCard title={dshText.peakMode.lanesTitle} description={dshText.peakMode.lanesDescription}>
          <div className={styles.cardGrid}>
            {lanes.map((lane) => (
              <Box key={lane.zoneLabel} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
                <Box layoutDirection="row" justify="space-between" align="center">
                  <Text role="bodyStrong">{lane.zoneLabel}</Text>
                  <Text role="caption" tone={lane.tone}>{lane.recommendationLabel}</Text>
                </Box>
                <Text role="bodySm">{lane.loadLabel}</Text>
                <Text role="caption" tone="soft">{lane.captainCapacityLabel} · {lane.queueLabel}</Text>
                <Text role="bodySm" tone="muted">{lane.note}</Text>
              </Box>
            ))}
          </div>
        </WebSectionCard>
      </div>
    </WebPageFrame>
  );
}

export default ControlPanelDshPeakModeScreen;
