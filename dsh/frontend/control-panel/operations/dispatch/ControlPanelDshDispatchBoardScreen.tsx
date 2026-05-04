'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Box, StateView, Text } from '@bthwani/ui-kit';
import { WebPageFrame, WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard, ControlPanelDshWorkspaceFrame } from '../../shared';
import { useDshControlPanelText, type DshWorkspaceScreenState, resolveWorkspaceStateCopy } from '../shared';
import { getDshDispatchPreview } from './dispatch-fixtures';

export type ControlPanelDshDispatchBoardScreenProps = {
  state?: DshWorkspaceScreenState;
  hubHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

function rowTone(confidence: string): 'brand' | 'success' | 'warning' | 'danger' {
  const numericConfidence = Number(confidence.replace('%', ''));
  if (numericConfidence >= 90) return 'success';
  if (numericConfidence >= 80) return 'brand';
  if (numericConfidence >= 70) return 'warning';
  return 'danger';
}

export function ControlPanelDshDispatchBoardScreen({
  state = 'ready',
  hubHref = '/operations',
  embedded = false,
  showHeader = true,
}: ControlPanelDshDispatchBoardScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const preview = React.useMemo(() => getDshDispatchPreview(), []);

  if (state !== 'ready') {
    const stateCopy = resolveWorkspaceStateCopy(dshText, state);

    return (
      <WebPageFrame
        eyebrow='DSH / operations / dispatch'
        title='Dispatch board'
        description='Preview-only dispatch command center.'
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
      eyebrow='DSH / operations / dispatch'
      title='Dispatch board'
      description='A central queue for assignment, captain distance, and dispatch blockers.'
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <Box gap={4}>
        <ControlPanelDshDecisionBoard
          title='Dispatch decision board'
          purpose='Keep assignment, captain choice, and manual recovery in one readable lane.'
          primaryDecision='Assign the next order to the closest viable captain.'
          nextAction='Open orders or reassign if the preferred captain is blocked.'
          blockers='Dispatch blockers and manual override decisions stay visible.'
          ownerSurface='operations'
          evidenceHint='assignment queue, captain distance, and ready-for-pickup state'
          routeHint='/operations?workspace=dispatch'
          decisionTone='brand'
        />

        <ControlPanelDshWorkspaceFrame
          eyebrow='Dispatch preview'
          title='Dispatch board workspace'
          description='Local preview of the dispatch control room without runtime truth claims.'
          badges={['dispatch', 'preview', 'operations']}
          metaItems={[
            `Waiting assignment: ${preview.summary.waitingAssignment}`,
            `Available captains: ${preview.summary.availableCaptains}`,
            `Ready for pickup: ${preview.summary.readyForPickup}`,
            `Blockers: ${preview.summary.dispatchBlockers}`,
          ]}
          primaryAction={{ label: 'Open orders', href: '/operations?workspace=orders' }}
          secondaryAction={{ label: 'Open reassign', href: '/operations?workspace=reassign' }}
          signals={[
            { id: 'waiting', title: 'Waiting assignment', value: String(preview.summary.waitingAssignment), description: 'Orders still waiting for a captain decision.', tone: 'warning' },
            { id: 'captains', title: 'Available captains', value: String(preview.summary.availableCaptains), description: 'Captains currently visible in the dispatch lane.', tone: 'best' },
            { id: 'pickup', title: 'Ready for pickup', value: String(preview.summary.readyForPickup), description: 'Orders already close to the pickup handoff.', tone: 'brand' },
            { id: 'blockers', title: 'Dispatch blockers', value: String(preview.summary.dispatchBlockers), description: 'Orders needing a broader decision or override.', tone: 'danger' },
          ]}
          actions={[
            { id: 'dispatch-orders', label: 'Open orders', description: 'Review the live order queue before assignment.', href: '/operations?workspace=orders', badge: 'Queue' },
            { id: 'dispatch-reassign', label: 'Open reassign', description: 'Switch to a fallback captain when needed.', href: '/operations?workspace=reassign', badge: 'Recovery' },
            { id: 'dispatch-live-tracking', label: 'Open live tracking', description: 'Watch the handoff and event trail for the current lane.', href: '/operations?workspace=live-tracking', badge: 'Timeline' },
            { id: 'dispatch-exceptions', label: 'Open exceptions', description: 'Move into the unified exception command queue.', href: '/operations?workspace=exceptions', badge: 'Escalation' },
          ]}
          disclosures={[
            { id: 'dispatch-audit', label: 'Manual action audit', description: 'Every manual change should leave an audit trail.', href: '/operations?workspace=audit' },
            { id: 'dispatch-summary', label: 'Dispatch blockers', description: 'Preview-only blockers: no runtime mutation implied.', href: '/operations?workspace=dispatch' },
          ]}
        />

        <WebSectionCard title='Dispatch queue' description='Each row shows assignment pressure, captain readiness, and the current blocker.'>
          <Box gap={2}>
            {preview.lanes.map((lane) => (
              <Box key={lane.id} padding={3} gap={1} border radiusToken='xl' background='surfaceRaised'>
                <Box layoutDirection='row' justify='space-between' align='center' style={{ gap: 12, flexWrap: 'wrap' }}>
                  <Text role='bodyStrong'>{lane.title}</Text>
                  <Badge label={lane.confidence} tone={rowTone(lane.confidence)} />
                </Box>
                <Text role='bodySm' tone='muted'>{lane.subtitle}</Text>
                <Box layoutDirection='row' justify='space-between' align='center' style={{ gap: 12, flexWrap: 'wrap' }}>
                  <Text role='caption' tone='soft'>{lane.captain}</Text>
                  <Text role='caption' tone='soft'>{lane.distance} · pickup {lane.pickupEta} · dropoff {lane.dropoffEta}</Text>
                </Box>
                <Text role='caption' tone='muted'>{lane.readyForPickup} · {lane.blocker}</Text>
              </Box>
            ))}
          </Box>
        </WebSectionCard>
      </Box>
    </WebPageFrame>
  );
}

export default ControlPanelDshDispatchBoardScreen;
