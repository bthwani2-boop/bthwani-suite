'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Box, StateView, Text } from '@bthwani/ui-kit';
import { WebPageFrame, WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard, ControlPanelDshWorkspaceFrame } from '../../shared';
import { useDshControlPanelText, type DshWorkspaceScreenState, resolveWorkspaceStateCopy } from '../shared';
import { getDshExceptionPreview } from './exceptions-fixtures';

export type ControlPanelDshExceptionCommandQueueScreenProps = {
  state?: DshWorkspaceScreenState;
  hubHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

function severityTone(severity: string): 'brand' | 'success' | 'warning' | 'danger' {
  if (severity === 'critical') return 'danger';
  if (severity === 'high') return 'warning';
  if (severity === 'medium') return 'brand';
  return 'success';
}

export function ControlPanelDshExceptionCommandQueueScreen({
  state = 'ready',
  hubHref = '/operations',
  embedded = false,
  showHeader = true,
}: ControlPanelDshExceptionCommandQueueScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const preview = React.useMemo(() => getDshExceptionPreview(), []);

  if (state !== 'ready') {
    const stateCopy = resolveWorkspaceStateCopy(dshText, state);
    return (
      <WebPageFrame eyebrow='DSH / operations / exceptions' title='Exception command queue' description='Preview-only exception management.' maxWidth={1120} embedded={embedded} showHeader={showHeader}>
        <StateView {...stateCopy} onActionPress={() => router.push(hubHref)} />
      </WebPageFrame>
    );
  }

  return (
    <WebPageFrame eyebrow='DSH / operations / exceptions' title='Exception command queue' description='A unified queue for operational exceptions, refund hints, and audit-required decisions.' maxWidth={1120} embedded={embedded} showHeader={showHeader}>
      <Box gap={4}>
        <ControlPanelDshDecisionBoard
          title='Exception decision board'
          purpose='Keep the exception lane readable before anything is approved, refunded, or redispatched.'
          primaryDecision='Choose the next exception owner and the required follow-up.'
          nextAction='Open audit when the change is risky or manual.'
          blockers='Refund, return, and redispatch edges stay explicit.'
          ownerSurface='operations'
          evidenceHint='exception type, affected order, and next decision hint'
          routeHint='/operations?workspace=exceptions'
          decisionTone='danger'
        />

        <ControlPanelDshWorkspaceFrame
          eyebrow='Exception preview'
          title='Exception command queue workspace'
          description='Local preview of unified exception handling without runtime truth claims.'
          badges={['exceptions', 'preview', 'operations']}
          metaItems={[
            `Open: ${preview.summary.open}`,
            `Audit required: ${preview.summary.auditRequired}`,
            `Refund ready: ${preview.summary.refundReady}`,
            `Redispatch needed: ${preview.summary.redispatchNeeded}`,
          ]}
          primaryAction={{ label: 'Open audit', href: '/operations?workspace=audit' }}
          secondaryAction={{ label: 'Open dispatch', href: '/operations?workspace=dispatch' }}
          signals={[
            { id: 'open', title: 'Open exceptions', value: String(preview.summary.open), description: 'Unified exception lanes still waiting for a decision.', tone: 'danger' },
            { id: 'audit', title: 'Audit required', value: String(preview.summary.auditRequired), description: 'Manual actions that need a trace before closure.', tone: 'warning' },
            { id: 'refund', title: 'Refund ready', value: String(preview.summary.refundReady), description: 'Cases where a refund path is already obvious.', tone: 'brand' },
            { id: 'redispatch', title: 'Redispatch needed', value: String(preview.summary.redispatchNeeded), description: 'Cases that should return to dispatch instead of closing.', tone: 'best' },
          ]}
          actions={[
            { id: 'exceptions-audit', label: 'Open audit', description: 'Check the manual action trail before approving the move.', href: '/operations?workspace=audit', badge: 'Trace' },
            { id: 'exceptions-orders', label: 'Open orders', description: 'Compare the exception against the active order queue.', href: '/operations?workspace=orders', badge: 'Queue' },
            { id: 'exceptions-refunds', label: 'Open refunds', description: 'Jump into the refund queue when compensation is required.', href: '/finance', badge: 'Finance' },
            { id: 'exceptions-dispatch', label: 'Open dispatch', description: 'Return redispatch cases back to the assignment board.', href: '/operations?workspace=dispatch', badge: 'Recovery' },
          ]}
          disclosures={[
            { id: 'exceptions-evidence', label: 'Evidence lane', description: 'Preview-only lanes for manual review and escalation proof.', href: '/operations?workspace=evidence' },
            { id: 'exceptions-command', label: 'Exception command', description: 'The queue is visible, but mutation remains out of scope.', href: '/operations?workspace=exceptions' },
          ]}
        />

        <WebSectionCard title='Exception lanes' description='Each row carries severity, owner role, next decision, and audit requirement.'>
          <Box gap={2}>
            {preview.lanes.map((lane) => (
              <Box key={lane.id} padding={3} gap={1} border radiusToken='xl' background='surfaceRaised'>
                <Box layoutDirection='row' justify='space-between' align='center' style={{ gap: 12, flexWrap: 'wrap' }}>
                  <Text role='bodyStrong'>{lane.title}</Text>
                  <Badge label={lane.severity} tone={severityTone(lane.severity)} />
                </Box>
                <Text role='bodySm' tone='muted'>{lane.hint}</Text>
                <Box layoutDirection='row' justify='space-between' align='center' style={{ gap: 12, flexWrap: 'wrap' }}>
                  <Text role='caption' tone='soft'>Affected order: {lane.affectedOrder}</Text>
                  <Text role='caption' tone='soft'>Owner role: {lane.ownerRole}</Text>
                </Box>
                <Text role='caption' tone='muted'>Next decision: {lane.nextDecision} · Audit required: {lane.auditRequired ? 'yes' : 'no'}</Text>
              </Box>
            ))}
          </Box>
        </WebSectionCard>
      </Box>
    </WebPageFrame>
  );
}

export default ControlPanelDshExceptionCommandQueueScreen;