'use client';

import React from 'react';
import {
  useRouter } from 'next/navigation';
import { Box,
  Button,
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
    <WebSectionCard title={title} description={description}>
      <div className={styles.laneGrid}>
        {lanes.map((lane) => (
          <Box key={`${title}-${lane.orderId}`} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
            <Box layoutDirection="row" justify="space-between" align="center">
              <Text role="bodyStrong">{lane.orderId}</Text>
              <Text role="caption" tone={lane.tone}>{lane.statusLabel}</Text>
            </Box>
            <Text role="bodySm">{lane.actorLabel}</Text>
            <Text role="caption" tone="soft">{lane.etaLabel} · {lane.ringLabel}</Text>
            <Text role="bodySm" tone="muted">{lane.actionHint}</Text>
          </Box>
        ))}
      </div>
    </WebSectionCard>
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
  hubHref = '/operations',
  ordersHref = '/operations?workspace=orders',
  supportHref = '/support',
  embedded = false,
  showHeader = true,
}: ControlPanelDshArrivalBellScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const summary = React.useMemo(() => getDshArrivalBellSummary(dshText), [dshText]);
  const captainLane = React.useMemo(() => getDshArrivalBellCaptainLane(dshText), [dshText]);
  const customerLane = React.useMemo(() => getDshArrivalBellCustomerLane(dshText), [dshText]);
  const [selectedLane, setSelectedLane] = React.useState<'captain' | 'customer'>('captain');
  const [localNote, setLocalNote] = React.useState('جاهز للاعتراف بالموجة الحالية');

  if (state !== 'ready') {
    const stateCopy = resolveStateCopy(dshText, state);

    return (
      <WebPageFrame
        eyebrow={dshText.arrivalBell.pageEyebrow}
        title={dshText.arrivalBell.pageTitle}
        description={dshText.arrivalBell.unavailableDescription}
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
      eyebrow={dshText.arrivalBell.pageEyebrow}
      title={dshText.arrivalBell.pageTitle}
      description={dshText.arrivalBell.pageDescription}
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <div className={styles.stack}>
        <ControlPanelDshDecisionBoard
          title="Arrival bell board"
          purpose="Keep arrival and ring states tied to the notification decision."
          primaryDecision={summary.awaitingAcknowledgement > 0 ? 'Resolve acknowledgement' : 'No pending arrival bell cases'}
          nextAction={summary.awaitingAcknowledgement > 0 ? `Acknowledge the ${selectedLane} lane locally` : 'Return to operations overview'}
          blockers={summary.blockedRings > 0 ? 'Blocked rings still need attention.' : 'No active blocker in the bell lane.'}
          ownerSurface="operations"
          evidenceHint="arrival counts, ring timeline, and acknowledgement state"
          routeHint={hubHref}
          decisionTone={summary.blockedRings > 0 ? 'danger' : 'best'}
        />

        <WebSectionCard title="Bell actions" description="Select a lane, acknowledge it locally, or jump to the linked workspace.">
          <Box gap={2}>
            <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              <Button label="Captain lane" tone={selectedLane === 'captain' ? 'primary' : 'secondary'} fullWidth={false} onPress={() => setSelectedLane('captain')} />
              <Button label="Customer lane" tone={selectedLane === 'customer' ? 'primary' : 'secondary'} fullWidth={false} onPress={() => setSelectedLane('customer')} />
              <Button label="Acknowledge locally" tone="primary" fullWidth={false} onPress={() => setLocalNote(`Acknowledged ${selectedLane} lane locally`)} />
              <Button label="Open blocker" tone="secondary" fullWidth={false} onPress={() => setLocalNote(`Open blocker for ${selectedLane} lane`)} />
              <Button label="Open orders" tone="ghost" fullWidth={false} onPress={() => router.push(ordersHref)} />
              <Button label="Open support" tone="ghost" fullWidth={false} onPress={() => router.push(supportHref)} />
            </Box>
            <Text role="bodySm" tone="muted">{localNote}</Text>
          </Box>
        </WebSectionCard>

        <WebMissionHeroCard
          badges={['/operations?workspace=bell', dshText.common.live, `${dshText.arrivalBell.signals.activeArrivals}: ${summary.activeArrivals}`]}
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
          <WebSignalCard title={dshText.arrivalBell.signals.activeArrivals} value={String(summary.activeArrivals)} description={dshText.arrivalBell.signals.activeArrivalsDescription} tone="best" />
          <WebSignalCard title={dshText.arrivalBell.signals.awaitingAcknowledgement} value={String(summary.awaitingAcknowledgement)} description={dshText.arrivalBell.signals.awaitingAcknowledgementDescription} />
          <WebSignalCard title={dshText.arrivalBell.signals.blockedRings} value={String(summary.blockedRings)} description={dshText.arrivalBell.signals.blockedRingsDescription} />
          <WebSignalCard title={dshText.arrivalBell.signals.resolvedToday} value={String(summary.resolvedToday)} description={dshText.arrivalBell.signals.resolvedTodayDescription} />
        </div>

        {renderLaneBlock(dshText.arrivalBell.captainLaneTitle, dshText.arrivalBell.captainLaneDescription, captainLane)}
        {renderLaneBlock(dshText.arrivalBell.customerLaneTitle, dshText.arrivalBell.customerLaneDescription, customerLane)}
      </div>
    </WebPageFrame>
  );
}

export default ControlPanelDshArrivalBellScreen;
