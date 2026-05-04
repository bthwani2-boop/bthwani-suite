'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Box, StateView, Text } from '@bthwani/ui-kit';
import { WebPageFrame, WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard, ControlPanelDshWorkspaceFrame } from '../../shared';
import { useDshControlPanelText, type DshWorkspaceScreenState, resolveWorkspaceStateCopy } from '../shared';
import { getDshLiveTrackingPreview } from './live-tracking-fixtures';

export type ControlPanelDshLiveTrackingTimelineScreenProps = {
  state?: DshWorkspaceScreenState;
  hubHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

function statusTone(status: string): 'brand' | 'success' | 'warning' | 'danger' {
  if (status === 'cancelled' || status === 'failed') return 'danger';
  if (status === 'delivered' || status === 'refunded') return 'success';
  if (status === 'returned') return 'warning';
  return 'brand';
}

export function ControlPanelDshLiveTrackingTimelineScreen({
  state = 'ready',
  hubHref = '/operations',
  embedded = false,
  showHeader = true,
}: ControlPanelDshLiveTrackingTimelineScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const preview = React.useMemo(() => getDshLiveTrackingPreview(), []);

  if (state !== 'ready') {
    const stateCopy = resolveWorkspaceStateCopy(dshText, state);
    return (
      <WebPageFrame eyebrow='DSH / operations / live-tracking' title='Live tracking timeline' description='Preview-only event timeline.' maxWidth={1120} embedded={embedded} showHeader={showHeader}>
        <StateView {...stateCopy} onActionPress={() => router.push(hubHref)} />
      </WebPageFrame>
    );
  }

  return (
    <WebPageFrame eyebrow='DSH / operations / live-tracking' title='Live tracking timeline' description='A unified event trail across the order lifecycle so runtime status does not disappear in the queue.' maxWidth={1120} embedded={embedded} showHeader={showHeader}>
      <Box gap={4}>
        <ControlPanelDshDecisionBoard
          title='Tracking decision board'
          purpose='Keep event transitions, reason codes, and evidence attachments readable as the order moves.'
          primaryDecision='Review the latest event and decide whether the order needs escalation.'
          nextAction='Open proof review or audit if the event looks risky.'
          blockers='Cancelled, failed, and returned events stay visible on purpose.'
          ownerSurface='operations'
          evidenceHint='event id, status transition, source, and notes'
          routeHint='/operations?workspace=live-tracking'
          decisionTone='brand'
        />

        <ControlPanelDshWorkspaceFrame
          eyebrow='Timeline preview'
          title='Live tracking event timeline workspace'
          description='Local preview of the event trail without any claim of runtime truth.'
          badges={['live-tracking', 'preview', 'operations']}
          metaItems={[
            `Events: ${preview.summary.events}`,
            `In flight: ${preview.summary.inFlight}`,
            `Cancelled: ${preview.summary.cancelled}`,
            `Returned: ${preview.summary.returned}`,
          ]}
          primaryAction={{ label: 'Open orders', href: '/operations?workspace=orders' }}
          secondaryAction={{ label: 'Open dispatch', href: '/operations?workspace=dispatch' }}
          signals={[
            { id: 'timeline-events', title: 'Events', value: String(preview.summary.events), description: 'Event count in the current preview timeline.', tone: 'brand' },
            { id: 'timeline-flight', title: 'In flight', value: String(preview.summary.inFlight), description: 'Orders currently moving through the timeline.', tone: 'best' },
            { id: 'timeline-cancelled', title: 'Cancelled', value: String(preview.summary.cancelled), description: 'Cases stopped before final delivery.', tone: 'danger' },
            { id: 'timeline-returned', title: 'Returned', value: String(preview.summary.returned), description: 'Cases that looped back after a failed handoff.', tone: 'warning' },
          ]}
          actions={[
            { id: 'timeline-orders', label: 'Open orders', description: 'Return to the live queue attached to the timeline.', href: '/operations?workspace=orders', badge: 'Queue' },
            { id: 'timeline-dispatch', label: 'Open dispatch', description: 'Watch the assignment decision behind the event flow.', href: '/operations?workspace=dispatch', badge: 'Decision' },
            { id: 'timeline-proof', label: 'Open proof review', description: 'Review proofs linked from the event trail.', href: '/operations?workspace=proof-review', badge: 'Proof' },
            { id: 'timeline-audit', label: 'Open audit', description: 'Inspect the manual action trail tied to the event.', href: '/operations?workspace=audit', badge: 'Trace' },
          ]}
          disclosures={[
            { id: 'timeline-statuses', label: 'Status group timeline', description: preview.statuses.join(' · '), href: '/operations?workspace=live-tracking' },
            { id: 'timeline-source', label: 'Source and evidence', description: 'Webhook, app, and manual sources stay explicit in the preview.', href: '/operations?workspace=live-tracking' },
          ]}
        />

        <WebSectionCard title='Event timeline' description='Rows show the transition, timestamp, actor, and evidence reference.'>
          <Box gap={2}>
            {preview.events.map((event) => (
              <Box key={event.id} padding={3} gap={1} border radiusToken='xl' background='surfaceRaised'>
                <Box layoutDirection='row' justify='space-between' align='center' style={{ gap: 12, flexWrap: 'wrap' }}>
                  <Text role='bodyStrong'>{event.id}</Text>
                  <Badge label={event.toStatus} tone={statusTone(event.toStatus)} />
                </Box>
                <Text role='bodySm' tone='muted'>{event.orderId} · {event.deliveryId} · {event.actorRole} ({event.actorId})</Text>
                <Text role='caption' tone='soft'>{event.fromStatus} → {event.toStatus} · {event.timestamp} · {event.location}</Text>
                <Text role='caption' tone='muted'>{event.source} · {event.reasonCode} · {event.notes} · evidence: {event.evidence}</Text>
              </Box>
            ))}
          </Box>
        </WebSectionCard>
      </Box>
    </WebPageFrame>
  );
}

export default ControlPanelDshLiveTrackingTimelineScreen;
