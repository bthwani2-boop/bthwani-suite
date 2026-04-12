'use client';

import React from 'react';
import {
  useRouter } from 'next/navigation';
import { BthBox,
  BthStateView,
  BthText
} from '@bthwani/ui-kit';
import {
  BthWebMissionHeroCard,
  BthWebPageFrame,
  BthWebSectionCard,
  BthWebSignalCard,
} from '@bthwani/ui-kit/web';
import { useDshControlPanelText } from '../shared/dshControlPanelText';
import {
  getDshArrivalBellCaptainLane,
  getDshArrivalBellCustomerLane,
  getDshArrivalBellSummary,
  type DshArrivalBellLane,
} from './arrival-bell-fixtures';
import styles from '../dsh-surface.module.css';

type ControlPanelDshArrivalBellScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

function resolveStateCopy(text: ReturnType<typeof useDshControlPanelText>, state: Exclude<ControlPanelDshArrivalBellScreenState, 'ready'>) {
  if (state === 'loading') {
    return {
      stateId: 'loading' as const,
      title: text.arrivalBell.stateLoadingTitle,
      description: text.arrivalBell.stateLoadingDescription,
      actionLabel: text.common.backToHub,
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty' as const,
      title: text.arrivalBell.stateEmptyTitle,
      description: text.arrivalBell.stateEmptyDescription,
      actionLabel: text.common.backToHub,
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline' as const,
      title: text.arrivalBell.stateOfflineTitle,
      description: text.arrivalBell.stateOfflineDescription,
      actionLabel: text.common.backToHub,
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning' as const,
      title: text.arrivalBell.stateDisabledTitle,
      description: text.arrivalBell.stateDisabledDescription,
      actionLabel: text.common.backToHub,
    };
  }

  return {
    stateId: 'recoverableError' as const,
    title: text.arrivalBell.stateErrorTitle,
    description: text.arrivalBell.stateErrorDescription,
    actionLabel: text.common.backToHub,
  };
}

function renderLaneBlock(title: string, description: string, lanes: ReadonlyArray<DshArrivalBellLane>) {
  return (
    <BthWebSectionCard title={title} description={description}>
      <div className={styles.laneGrid}>
        {lanes.map((lane) => (
          <BthBox key={`${title}-${lane.orderId}`} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
            <BthBox layoutDirection="row" justify="space-between" align="center">
              <BthText role="bodyStrong">{lane.orderId}</BthText>
              <BthText role="caption" tone={lane.tone}>{lane.statusLabel}</BthText>
            </BthBox>
            <BthText role="bodySm">{lane.actorLabel}</BthText>
            <BthText role="caption" tone="soft">{lane.etaLabel} · {lane.ringLabel}</BthText>
            <BthText role="bodySm" tone="muted">{lane.actionHint}</BthText>
          </BthBox>
        ))}
      </div>
    </BthWebSectionCard>
  );
}

export type ControlPanelDshArrivalBellScreenProps = {
  state?: ControlPanelDshArrivalBellScreenState;
  hubHref?: string;
  ordersHref?: string;
  supportHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

export function ControlPanelDshArrivalBellScreen({
  state = 'ready',
  hubHref = '/operations/dsh',
  ordersHref = '/operations/dsh/orders',
  supportHref = '/support',
  embedded = false,
  showHeader = true,
}: ControlPanelDshArrivalBellScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const summary = React.useMemo(() => getDshArrivalBellSummary(dshText), [dshText]);
  const captainLane = React.useMemo(() => getDshArrivalBellCaptainLane(dshText), [dshText]);
  const customerLane = React.useMemo(() => getDshArrivalBellCustomerLane(dshText), [dshText]);

  if (state !== 'ready') {
    const stateCopy = resolveStateCopy(dshText, state);

    return (
      <BthWebPageFrame
        eyebrow={dshText.arrivalBell.pageEyebrow}
        title={dshText.arrivalBell.pageTitle}
        description={dshText.arrivalBell.unavailableDescription}
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
      eyebrow={dshText.arrivalBell.pageEyebrow}
      title={dshText.arrivalBell.pageTitle}
      description={dshText.arrivalBell.pageDescription}
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <div className={styles.stack}>
        <BthWebMissionHeroCard
          badges={['/operations/dsh/arrival-bell', dshText.common.live, `${dshText.arrivalBell.signals.activeArrivals}: ${summary.activeArrivals}`]}
          eyebrow={dshText.arrivalBell.heroEyebrow}
          title={dshText.arrivalBell.heroTitle}
          description={dshText.arrivalBell.heroDescription}
          metaItems={[
            `${dshText.arrivalBell.signals.awaitingAcknowledgement}: ${summary.awaitingAcknowledgement}`,
            `${dshText.arrivalBell.signals.blockedRings}: ${summary.blockedRings}`,
            `${dshText.arrivalBell.signals.resolvedToday}: ${summary.resolvedToday}`,
          ]}
          primaryAction={{ label: dshText.common.openOperationsWorkspace, href: hubHref }}
          secondaryAction={{ label: dshText.common.openOrders, href: ordersHref }}
        />

        <div className={styles.signalGrid}>
          <BthWebSignalCard title={dshText.arrivalBell.signals.activeArrivals} value={String(summary.activeArrivals)} description={dshText.arrivalBell.signals.activeArrivalsDescription} tone="best" />
          <BthWebSignalCard title={dshText.arrivalBell.signals.awaitingAcknowledgement} value={String(summary.awaitingAcknowledgement)} description={dshText.arrivalBell.signals.awaitingAcknowledgementDescription} />
          <BthWebSignalCard title={dshText.arrivalBell.signals.blockedRings} value={String(summary.blockedRings)} description={dshText.arrivalBell.signals.blockedRingsDescription} />
          <BthWebSignalCard title={dshText.arrivalBell.signals.resolvedToday} value={String(summary.resolvedToday)} description={dshText.arrivalBell.signals.resolvedTodayDescription} />
        </div>

        {renderLaneBlock(dshText.arrivalBell.captainLaneTitle, dshText.arrivalBell.captainLaneDescription, captainLane)}
        {renderLaneBlock(dshText.arrivalBell.customerLaneTitle, dshText.arrivalBell.customerLaneDescription, customerLane)}
      </div>
    </BthWebPageFrame>
  );
}

export default ControlPanelDshArrivalBellScreen;