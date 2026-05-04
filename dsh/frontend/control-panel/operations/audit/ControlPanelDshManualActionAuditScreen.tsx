'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Box, StateView, Text } from '@bthwani/ui-kit';
import { WebPageFrame, WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard, ControlPanelDshWorkspaceFrame } from '../../shared';
import { useDshControlPanelText, type DshWorkspaceScreenState, resolveWorkspaceStateCopy } from '../shared';
import { getDshAuditPreview } from './audit-fixtures';

export type ControlPanelDshManualActionAuditScreenProps = {
  state?: DshWorkspaceScreenState;
  hubHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

function riskTone(risk: string): 'brand' | 'success' | 'warning' | 'danger' {
  if (risk === 'critical') return 'danger';
  if (risk === 'high') return 'warning';
  if (risk === 'medium') return 'brand';
  return 'success';
}

export function ControlPanelDshManualActionAuditScreen({
  state = 'ready',
  hubHref = '/operations',
  embedded = false,
  showHeader = true,
}: ControlPanelDshManualActionAuditScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const preview = React.useMemo(() => getDshAuditPreview(), []);

  if (state !== 'ready') {
    const stateCopy = resolveWorkspaceStateCopy(dshText, state);
    return (
      <WebPageFrame eyebrow='DSH / operations / audit' title='Manual action audit' description='Preview-only audit trail.' maxWidth={1120} embedded={embedded} showHeader={showHeader}>
        <StateView {...stateCopy} onActionPress={() => router.push(hubHref)} />
      </WebPageFrame>
    );
  }

  return (
    <WebPageFrame eyebrow='DSH / operations / audit' title='Manual action audit' description='A compact trace of manual changes so risky decisions stay audit-first.' maxWidth={1120} embedded={embedded} showHeader={showHeader}>
      <Box gap={4}>
        <ControlPanelDshDecisionBoard
          title='Audit decision board'
          purpose='Every manual intervention needs a readable trail before the workspace can pretend closure.'
          primaryDecision='Review the latest manual action and confirm the risk level.'
          nextAction='Open exceptions or reassign if the manual change came from recovery.'
          blockers='Approval-required actions cannot disappear from the audit lane.'
          ownerSurface='operations'
          evidenceHint='action id, actor, target, and evidence attachment'
          routeHint='/operations?workspace=audit'
          decisionTone='warning'
        />

        <ControlPanelDshWorkspaceFrame
          eyebrow='Audit preview'
          title='Manual action audit workspace'
          description='Local preview of audit-first control room behavior without runtime claims.'
          badges={['audit', 'preview', 'operations']}
          metaItems={[
            `Actions: ${preview.summary.actions}`,
            `Approval required: ${preview.summary.approvalRequired}`,
            `High risk: ${preview.summary.highRisk}`,
            `Evidence linked: ${preview.summary.evidenceLinked}`,
          ]}
          primaryAction={{ label: 'Open exceptions', href: '/operations?workspace=exceptions' }}
          secondaryAction={{ label: 'Open reassign', href: '/operations?workspace=reassign' }}
          signals={[
            { id: 'audit-actions', title: 'Manual actions', value: String(preview.summary.actions), description: 'Total previewed manual actions in the audit lane.', tone: 'brand' },
            { id: 'audit-approval', title: 'Approval required', value: String(preview.summary.approvalRequired), description: 'Rows that need an explicit approval step.', tone: 'warning' },
            { id: 'audit-risk', title: 'High risk', value: String(preview.summary.highRisk), description: 'Rows that should not close without review.', tone: 'danger' },
            { id: 'audit-evidence', title: 'Evidence linked', value: String(preview.summary.evidenceLinked), description: 'Rows already connected to evidence or proof.', tone: 'best' },
          ]}
          actions={[
            { id: 'audit-exceptions', label: 'Open exceptions', description: 'Review the exception lane that triggered the manual step.', href: '/operations?workspace=exceptions', badge: 'Escalation' },
            { id: 'audit-reassign', label: 'Open reassign', description: 'Jump back to the recovery board if the action was dispatch-driven.', href: '/operations?workspace=reassign', badge: 'Recovery' },
            { id: 'audit-orders', label: 'Open orders', description: 'Compare the manual action against the live queue.', href: '/operations?workspace=orders', badge: 'Queue' },
            { id: 'audit-evidence', label: 'Open evidence', description: 'Inspect proof and attachments before approval lands.', href: '/operations?workspace=evidence', badge: 'Proof' },
          ]}
          disclosures={[
            { id: 'audit-approval-link', label: 'Approval lane', description: 'Pending approvals stay visible until they are verified.', href: '/operations?workspace=audit' },
            { id: 'audit-risk-lane', label: 'Risk lane', description: 'High-risk manual changes are kept separate from low-risk ones.', href: '/operations?workspace=audit' },
          ]}
        />

        <WebSectionCard title='Manual actions' description='Each row shows the action identity, actor, target, value delta, and risk.'>
          <Box gap={2}>
            {preview.entries.map((entry) => (
              <Box key={entry.id} padding={3} gap={1} border radiusToken='xl' background='surfaceRaised'>
                <Box layoutDirection='row' justify='space-between' align='center' style={{ gap: 12, flexWrap: 'wrap' }}>
                  <Text role='bodyStrong'>{entry.actionId}</Text>
                  <Badge label={entry.risk} tone={riskTone(entry.risk)} />
                </Box>
                <Text role='bodySm' tone='muted'>{entry.actorRole} · {entry.actorId} · {entry.reasonCode}</Text>
                <Text role='caption' tone='soft'>{entry.targetType} {entry.targetId}</Text>
                <Text role='caption' tone='muted'>{entry.previousValue} → {entry.nextValue} · evidence: {entry.evidence} · approved by: {entry.approvedBy}</Text>
              </Box>
            ))}
          </Box>
        </WebSectionCard>
      </Box>
    </WebPageFrame>
  );
}

export default ControlPanelDshManualActionAuditScreen;
