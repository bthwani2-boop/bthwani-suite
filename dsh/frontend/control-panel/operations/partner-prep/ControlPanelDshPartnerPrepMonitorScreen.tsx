'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Box, StateView, Text } from '@bthwani/ui-kit';
import { WebPageFrame, WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard, ControlPanelDshWorkspaceFrame } from '../../shared';
import { useDshControlPanelText, type DshWorkspaceScreenState, resolveWorkspaceStateCopy } from '../shared';
import { getDshPartnerPrepPreview } from './partner-prep-fixtures';

export type ControlPanelDshPartnerPrepMonitorScreenProps = {
  state?: DshWorkspaceScreenState;
  hubHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

export function ControlPanelDshPartnerPrepMonitorScreen({
  state = 'ready',
  hubHref = '/operations',
  embedded = false,
  showHeader = true,
}: ControlPanelDshPartnerPrepMonitorScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const preview = React.useMemo(() => getDshPartnerPrepPreview(), []);

  if (state !== 'ready') {
    const stateCopy = resolveWorkspaceStateCopy(dshText, state);
    return (
      <WebPageFrame eyebrow='DSH / operations / partner-prep' title='Partner prep monitor' description='Preview-only partner prep monitor.' maxWidth={1120} embedded={embedded} showHeader={showHeader}>
        <StateView {...stateCopy} onActionPress={() => router.push(hubHref)} />
      </WebPageFrame>
    );
  }

  return (
    <WebPageFrame eyebrow='DSH / operations / partner-prep' title='Partner prep monitor' description='A read on partner readiness, prep time, and handoff pressure before pickup.' maxWidth={1120} embedded={embedded} showHeader={showHeader}>
      <Box gap={4}>
        <ControlPanelDshDecisionBoard
          title='Partner prep decision board'
          purpose='Keep store prep, pickup readiness, and handoff pressure visible before the captain arrives.'
          primaryDecision='Open partner prep or dispatch based on the store readiness signal.'
          nextAction='Escalate to SLA if the prep window is already at risk.'
          blockers='Store busy mode and partial fulfillment remain explicit.'
          ownerSurface='operations'
          evidenceHint='incoming orders, prep time, and ready-for-pickup signal'
          routeHint='/operations?workspace=partner-prep'
          decisionTone='brand'
        />

        <ControlPanelDshWorkspaceFrame
          eyebrow='Partner prep preview'
          title='Partner prep monitor workspace'
          description='Local preview of the partner control room without runtime truth claims.'
          badges={['partner-prep', 'preview', 'operations']}
          metaItems={[
            `Incoming orders: ${preview.summary.incomingOrders}`,
            `Ready for pickup: ${preview.summary.readyForPickup}`,
            `Paused stores: ${preview.summary.pausedStores}`,
            `Busy mode: ${preview.summary.busyMode}`,
          ]}
          primaryAction={{ label: 'Open dispatch', href: '/operations?workspace=dispatch' }}
          secondaryAction={{ label: 'Open SLA', href: '/operations?workspace=sla' }}
          signals={[
            { id: 'incoming', title: 'Incoming orders', value: String(preview.summary.incomingOrders), description: 'Orders arriving into the partner prep lane.', tone: 'brand' },
            { id: 'ready', title: 'Ready for pickup', value: String(preview.summary.readyForPickup), description: 'Orders already ready for captain handoff.', tone: 'best' },
            { id: 'paused', title: 'Paused stores', value: String(preview.summary.pausedStores), description: 'Stores temporarily paused for a manual reason.', tone: 'warning' },
            { id: 'busy', title: 'Busy mode', value: String(preview.summary.busyMode), description: 'Stores in busy mode or partial fulfillment.', tone: 'danger' },
          ]}
          actions={[
            { id: 'prep-dispatch', label: 'Open dispatch', description: 'Assign the next captain after partner readiness is clear.', href: '/operations?workspace=dispatch', badge: 'Dispatch' },
            { id: 'prep-sla', label: 'Open SLA', description: 'Check whether prep delay is already at risk.', href: '/operations?workspace=sla', badge: 'Delay' },
            { id: 'prep-handoff', label: 'Open handoff', description: 'Move into the captain pickup verification step.', href: '/operations?workspace=handoff', badge: 'Handoff' },
            { id: 'prep-partners', label: 'Open partners', description: 'Return to partner management for a broader review.', href: '/partners', badge: 'Partner' },
          ]}
          disclosures={[
            { id: 'prep-finance', label: 'Partner finance impact', description: 'Handoffs and prep delays can change the partner financial view.', href: '/finance' },
            { id: 'prep-pause', label: 'Pause orders', description: 'Visible when the store must stop incoming work for now.', href: '/operations?workspace=partner-prep' },
          ]}
        />

        <WebSectionCard title='Partner prep lanes' description='Rows keep the prep state, handoff state, and finance impact visible.'>
          <Box gap={2}>
            {preview.lanes.map((lane) => (
              <Box key={lane.id} padding={3} gap={1} border radiusToken='xl' background='surfaceRaised'>
                <Box layoutDirection='row' justify='space-between' align='center' style={{ gap: 12, flexWrap: 'wrap' }}>
                  <Text role='bodyStrong'>{lane.title}</Text>
                  <Badge label={lane.prepTime} tone={lane.prepTime.includes('18') ? 'danger' : lane.prepTime.includes('12') ? 'warning' : 'success'} />
                </Box>
                <Text role='bodySm' tone='muted'>{lane.status}</Text>
                <Box layoutDirection='row' justify='space-between' align='center' style={{ gap: 12, flexWrap: 'wrap' }}>
                  <Text role='caption' tone='soft'>{lane.handoff}</Text>
                  <Text role='caption' tone='soft'>{lane.impact}</Text>
                </Box>
              </Box>
            ))}
          </Box>
        </WebSectionCard>
      </Box>
    </WebPageFrame>
  );
}

export default ControlPanelDshPartnerPrepMonitorScreen;