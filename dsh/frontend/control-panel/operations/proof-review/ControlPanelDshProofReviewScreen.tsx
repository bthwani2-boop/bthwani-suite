'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Box, StateView, Text } from '@bthwani/ui-kit';
import { WebPageFrame, WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard, ControlPanelDshWorkspaceFrame } from '../../shared';
import { useDshControlPanelText, type DshWorkspaceScreenState, resolveWorkspaceStateCopy } from '../shared';
import { getDshProofReviewPreview } from './proof-review-fixtures';

export type ControlPanelDshProofReviewScreenProps = {
  state?: DshWorkspaceScreenState;
  hubHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

function verificationTone(result: string): 'brand' | 'best' | 'warning' | 'danger' {
  if (result === 'rejected') return 'danger';
  if (result === 'needs-review') return 'warning';
  if (result === 'accepted') return 'best';
  return 'brand';
}

export function ControlPanelDshProofReviewScreen({
  state = 'ready',
  hubHref = '/operations',
  embedded = false,
  showHeader = true,
}: ControlPanelDshProofReviewScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const preview = React.useMemo(() => getDshProofReviewPreview(), []);

  if (state !== 'ready') {
    const stateCopy = resolveWorkspaceStateCopy(dshText, state);
    return (
      <WebPageFrame eyebrow='DSH / operations / proof-review' title='Proof review' description='Preview-only proof review workspace.' maxWidth={1120} embedded={embedded} showHeader={showHeader}>
        <StateView {...stateCopy} onActionPress={() => router.push(hubHref)} />
      </WebPageFrame>
    );
  }

  return (
    <WebPageFrame eyebrow='DSH / operations / proof-review' title='Proof review' description='A dedicated lane for proof assets, verification results, and refund or payout impact.' maxWidth={1120} embedded={embedded} showHeader={showHeader}>
      <Box gap={4}>
        <ControlPanelDshDecisionBoard
          title='Proof review decision board'
          purpose='Keep proof acceptance, rejection, and review requests visible before the handoff closes.'
          primaryDecision='Accept the proof or send it back for manual review.'
          nextAction='Open handoff or exceptions if the proof affects the next step.'
          blockers='Rejected proof and refund/payout impact remain explicit.'
          ownerSurface='operations'
          evidenceHint='proof type, asset url, verification result, and failure reason'
          routeHint='/operations?workspace=proof-review'
          decisionTone='brand'
        />

        <ControlPanelDshWorkspaceFrame
          eyebrow='Proof preview'
          title='Proof of delivery review workspace'
          description='Local preview of the proof command room without runtime truth claims.'
          badges={['proof-review', 'preview', 'operations']}
          metaItems={[
            `Accepted: ${preview.summary.accepted}`,
            `Needs review: ${preview.summary.needsReview}`,
            `Rejected: ${preview.summary.rejected}`,
            `Proof required: ${preview.summary.proofRequired}`,
          ]}
          primaryAction={{ label: 'Open handoff', href: '/operations?workspace=handoff' }}
          secondaryAction={{ label: 'Open exceptions', href: '/operations?workspace=exceptions' }}
          signals={[
            { id: 'proof-accepted', title: 'Accepted', value: String(preview.summary.accepted), description: 'Proof assets already accepted in the preview.', tone: 'best' },
            { id: 'proof-review', title: 'Needs review', value: String(preview.summary.needsReview), description: 'Proof assets that should stay open for manual review.', tone: 'warning' },
            { id: 'proof-rejected', title: 'Rejected', value: String(preview.summary.rejected), description: 'Proof assets that should not close the lane yet.', tone: 'danger' },
            { id: 'proof-required', title: 'Proof required', value: String(preview.summary.proofRequired), description: 'Orders that cannot close without proof.', tone: 'brand' },
          ]}
          actions={[
            { id: 'proof-handoff', label: 'Open handoff', description: 'Return to pickup or dropoff verification.', href: '/operations?workspace=handoff', badge: 'Handoff' },
            { id: 'proof-exceptions', label: 'Open exceptions', description: 'Route rejected proof into the exception queue.', href: '/operations?workspace=exceptions', badge: 'Escalation' },
            { id: 'proof-refunds', label: 'Open refunds', description: 'Move into refund handling when proof fails.', href: '/operations?workspace=refunds', badge: 'Finance' },
            { id: 'proof-audit', label: 'Open audit', description: 'Check the manual trail linked to the proof decision.', href: '/operations?workspace=audit', badge: 'Trace' },
          ]}
          disclosures={[
            { id: 'proof-asset', label: 'Proof asset url', description: 'Preview-only asset links keep the review lane explicit.', href: '/operations?workspace=proof-review' },
            { id: 'proof-impact', label: 'Refund / payout impact', description: 'The financial impact stays visible but unmutated.', href: '/operations?workspace=proof-review' },
          ]}
        />

        <WebSectionCard title='Proof review lanes' description='Accepted, needs review, and rejected lanes stay separate.'>
          <Box gap={2}>
            {preview.lanes.map((lane) => (
              <Box key={lane.id} padding={3} gap={1} border radiusToken='xl' background='surfaceRaised'>
                <Box layoutDirection='row' justify='space-between' align='center' style={{ gap: 12, flexWrap: 'wrap' }}>
                  <Text role='bodyStrong'>{lane.id}</Text>
                  <Badge label={lane.verificationResult} tone={verificationTone(lane.verificationResult)} />
                </Box>
                <Text role='bodySm' tone='muted'>{lane.proofType} · required: {lane.required ? 'yes' : 'no'} · captured by: {lane.capturedBy}</Text>
                <Text role='caption' tone='soft'>{lane.capturedAt} · {lane.assetUrl}</Text>
                <Text role='caption' tone='muted'>{lane.failureReason} · {lane.impact}</Text>
              </Box>
            ))}
          </Box>
        </WebSectionCard>
      </Box>
    </WebPageFrame>
  );
}

export default ControlPanelDshProofReviewScreen;