'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Box, StateView, Text } from '@bthwani/ui-kit';
import { WebPageFrame, WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard, ControlPanelDshWorkspaceFrame } from '../../shared';
import { useDshControlPanelText, type DshWorkspaceScreenState, resolveWorkspaceStateCopy } from '../shared';
import { getDshSlaPreview } from './sla-fixtures';

export type ControlPanelDshSlaDelayMonitorScreenProps = {
  state?: DshWorkspaceScreenState;
  hubHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

function laneTone(label: string): 'brand' | 'success' | 'warning' | 'danger' {
  if (label.includes('breach')) return 'danger';
  if (label.includes('delay')) return 'warning';
  if (label.includes('risk')) return 'brand';
  return 'success';
}

export function ControlPanelDshSlaDelayMonitorScreen({
  state = 'ready',
  hubHref = '/operations',
  embedded = false,
  showHeader = true,
}: ControlPanelDshSlaDelayMonitorScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const preview = React.useMemo(() => getDshSlaPreview(), []);

  if (state !== 'ready') {
    const stateCopy = resolveWorkspaceStateCopy(dshText, state);
    return (
      <WebPageFrame eyebrow='DSH / operations / sla' title='SLA and delays monitor' description='Preview-only SLA monitor.' maxWidth={1120} embedded={embedded} showHeader={showHeader}>
        <StateView {...stateCopy} onActionPress={() => router.push(hubHref)} />
      </WebPageFrame>
    );
  }

  return (
    <WebPageFrame eyebrow='DSH / operations / sla' title='SLA and delays monitor' description='A unified read of delay, risk, and escalation lanes before a breach becomes hidden.' maxWidth={1120} embedded={embedded} showHeader={showHeader}>
      <Box gap={4}>
        <ControlPanelDshDecisionBoard
          title='SLA decision board'
          purpose='Keep the breach, risk, and healthy lanes separate so delay escalation stays readable.'
          primaryDecision='Escalate the breached lane or keep monitoring the at-risk lane.'
          nextAction='Open partner prep or dispatch based on the delay owner.'
          blockers='ETA breach and late-order reason must remain explicit.'
          ownerSurface='operations'
          evidenceHint='delay lane, escalation owner, and late-order reason'
          routeHint='/operations?workspace=sla'
          decisionTone='warning'
        />

        <ControlPanelDshWorkspaceFrame
          eyebrow='SLA preview'
          title='SLA and delays monitor workspace'
          description='Local preview of the delay command room without runtime truth claims.'
          badges={['sla', 'preview', 'operations']}
          metaItems={[
            `Breached: ${preview.summary.breached}`,
            `At risk: ${preview.summary.atRisk}`,
            `Healthy: ${preview.summary.healthy}`,
            `Escalated: ${preview.summary.escalated}`,
          ]}
          primaryAction={{ label: 'Open orders', href: '/operations?workspace=orders' }}
          secondaryAction={{ label: 'Open dispatch', href: '/operations?workspace=dispatch' }}
          signals={[
            { id: 'breached', title: 'Breached lanes', value: String(preview.summary.breached), description: 'Orders that already crossed the SLA threshold.', tone: 'danger' },
            { id: 'risk', title: 'At-risk lanes', value: String(preview.summary.atRisk), description: 'Orders that need attention before they breach.', tone: 'warning' },
            { id: 'healthy', title: 'Healthy lanes', value: String(preview.summary.healthy), description: 'Orders still comfortably inside the SLA window.', tone: 'best' },
            { id: 'escalated', title: 'Escalated lanes', value: String(preview.summary.escalated), description: 'Cases already sent to a wider ops decision.', tone: 'brand' },
          ]}
          actions={[
            { id: 'sla-orders', label: 'Open orders', description: 'Inspect the active queue before the delay widens.', href: '/operations?workspace=orders', badge: 'Queue' },
            { id: 'sla-dispatch', label: 'Open dispatch', description: 'Recover by reassigning or re-routing the order.', href: '/operations?workspace=dispatch', badge: 'Recovery' },
            { id: 'sla-exceptions', label: 'Open exceptions', description: 'Move the breached lane into exception handling.', href: '/operations?workspace=exceptions', badge: 'Escalation' },
            { id: 'sla-partner-prep', label: 'Open partner prep', description: 'Check whether the partner is the source of the delay.', href: '/operations?workspace=partner-prep', badge: 'Prep' },
          ]}
          disclosures={[
            { id: 'sla-eta', label: 'ETA breach', description: 'Preview-only delay lane for visual review.', href: '/operations?workspace=sla' },
            { id: 'sla-owner', label: 'Escalation owner', description: 'Support, partner, or operations can own the next move.', href: '/operations?workspace=sla' },
          ]}
        />

        <WebSectionCard title='Delay lanes' description='Breached, at-risk, and healthy lanes are kept separate for fast reading.'>
          <Box gap={2}>
            {preview.lanes.map((lane) => (
              <Box key={lane.id} padding={3} gap={1} border radiusToken='xl' background='surfaceRaised'>
                <Box layoutDirection='row' justify='space-between' align='center' style={{ gap: 12, flexWrap: 'wrap' }}>
                  <Text role='bodyStrong'>{lane.label}</Text>
                  <Badge label={lane.value} tone={laneTone(lane.label)} />
                </Box>
                <Text role='bodySm' tone='muted'>{lane.reason}</Text>
                <Box layoutDirection='row' justify='space-between' align='center' style={{ gap: 12, flexWrap: 'wrap' }}>
                  <Text role='caption' tone='soft'>Owner: {lane.owner}</Text>
                  <Text role='caption' tone='soft'>Action lane: {lane.label.includes('breach') ? 'breached' : lane.label.includes('risk') ? 'at risk' : 'healthy'}</Text>
                </Box>
              </Box>
            ))}
          </Box>
        </WebSectionCard>
      </Box>
    </WebPageFrame>
  );
}

export default ControlPanelDshSlaDelayMonitorScreen;
