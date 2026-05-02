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
import { ControlPanelDshDecisionBoard } from '../../shared';
import { useDshControlPanelText } from '../shared/dshControlPanelText';
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
  hubHref = '/operations',
  ordersHref = '/operations?workspace=orders',
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
      <WebPageFrame
        eyebrow={dshText.zoneSet.pageEyebrow}
        title={dshText.zoneSet.pageTitle}
        description={dshText.zoneSet.unavailableDescription}
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
      eyebrow={dshText.zoneSet.pageEyebrow}
      title={dshText.zoneSet.pageTitle}
      description={dshText.zoneSet.pageDescription}
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <div className={styles.stack}>
        <ControlPanelDshDecisionBoard
          title="Zone set board"
          purpose="Keep zone policy, fee policy, and coverage constraints readable for route decisions."
          primaryDecision={summary.reviewZones > 0 ? 'Review the zone set' : 'Keep the current zone policy'}
          nextAction={summary.reviewZones > 0 ? 'Open policies or support for a route exception' : 'Continue with the current zone map'}
          blockers={summary.protectedZones > 0 ? 'Protected zones still require review.' : 'No active blocker in zone-set.'}
          ownerSurface="operations"
          evidenceHint="zone policy, fee policy, and review counts"
          routeHint={hubHref}
          decisionTone={summary.reviewZones > 0 ? 'warning' : 'best'}
        />

        <WebMissionHeroCard
          badges={['/operations?workspace=zone-set', dshText.common.live, `${dshText.zoneSet.signals.reviewZones}: ${summary.reviewZones}`]}
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
          <WebSignalCard title={dshText.zoneSet.signals.configuredZones} value={String(summary.configuredZones)} description={dshText.zoneSet.signals.configuredZonesDescription} tone="best" />
          <WebSignalCard title={dshText.zoneSet.signals.protectedZones} value={String(summary.protectedZones)} description={dshText.zoneSet.signals.protectedZonesDescription} />
          <WebSignalCard title={dshText.zoneSet.signals.freeDeliveryZones} value={String(summary.freeDeliveryZones)} description={dshText.zoneSet.signals.freeDeliveryZonesDescription} />
          <WebSignalCard title={dshText.zoneSet.signals.reviewZones} value={String(summary.reviewZones)} description={dshText.zoneSet.signals.reviewZonesDescription} />
        </div>

        <WebSectionCard title={dshText.zoneSet.policiesTitle} description={dshText.zoneSet.policiesDescription}>
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

        <WebSectionCard title={dshText.zoneSet.lanesTitle} description={dshText.zoneSet.lanesDescription}>
          <div className={styles.cardGrid}>
            {lanes.map((lane) => (
              <Box key={lane.zoneLabel} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
                <Box layoutDirection="row" justify="space-between" align="center">
                  <Text role="bodyStrong">{lane.zoneLabel}</Text>
                  <Text role="caption" tone={lane.tone}>{lane.recommendationLabel}</Text>
                </Box>
                <Text role="bodySm">{lane.statusLabel}</Text>
                <Text role="caption" tone="soft">{lane.feeLabel} · {lane.etaLabel}</Text>
                <Text role="bodySm" tone="muted">{lane.note}</Text>
              </Box>
            ))}
          </div>
        </WebSectionCard>
      </div>
    </WebPageFrame>
  );
}

export default ControlPanelDshZoneSetScreen;
