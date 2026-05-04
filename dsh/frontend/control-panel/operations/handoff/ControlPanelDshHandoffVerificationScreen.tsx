'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Box, StateView, Text } from '@bthwani/ui-kit';
import { WebPageFrame, WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard, ControlPanelDshWorkspaceFrame } from '../../shared';
import { useDshControlPanelText, type DshWorkspaceScreenState, resolveWorkspaceStateCopy } from '../shared';
import { getDshHandoffPreview } from './handoff-fixtures';

export type ControlPanelDshHandoffVerificationScreenProps = {
  state?: DshWorkspaceScreenState;
  hubHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

export function ControlPanelDshHandoffVerificationScreen({
  state = 'ready',
  hubHref = '/operations',
  embedded = false,
  showHeader = true,
}: ControlPanelDshHandoffVerificationScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const preview = React.useMemo(() => getDshHandoffPreview(), []);

  if (state !== 'ready') {
    const stateCopy = resolveWorkspaceStateCopy(dshText, state);
    return (
      <WebPageFrame eyebrow='DSH / operations / handoff' title='Handoff verification' description='Preview-only handoff workspace.' maxWidth={1120} embedded={embedded} showHeader={showHeader}>
        <StateView {...stateCopy} onActionPress={() => router.push(hubHref)} />
      </WebPageFrame>
    );
  }

  return (
    <WebPageFrame eyebrow='DSH / operations / handoff' title='Handoff verification' description='Pickup reference, OTP, and captain handoff notes stay readable before the order moves forward.' maxWidth={1120} embedded={embedded} showHeader={showHeader}>
      <Box gap={4}>
        <ControlPanelDshDecisionBoard
          title='Handoff decision board'
          purpose='Keep pickup and dropoff verification visible before a captain or customer handoff is considered complete.'
          primaryDecision='Confirm pickup or route the case back to proof review.'
          nextAction='Open arrival bell when the handoff is physically near.'
          blockers='Failed verification and missing codes must stay explicit.'
          ownerSurface='operations'
          evidenceHint='pickup reference, code, OTP, and handoff notes'
          routeHint='/operations?workspace=handoff'
          decisionTone='brand'
        />

        <ControlPanelDshWorkspaceFrame
          eyebrow='Handoff preview'
          title='Handoff verification workspace'
          description='Local preview of pickup and dropoff verification with no runtime claims.'
          badges={['handoff', 'preview', 'operations']}
          metaItems={[
            `Pickup verified: ${preview.summary.pickupVerified}`,
            `Dropoff verified: ${preview.summary.dropoffVerified}`,
            `Failed verification: ${preview.summary.failedVerification}`,
            `Contactless allowed: ${preview.summary.contactlessAllowed}`,
          ]}
          primaryAction={{ label: 'Open dispatch', href: '/operations?workspace=dispatch' }}
          secondaryAction={{ label: 'Open proof review', href: '/operations?workspace=proof-review' }}
          signals={[
            { id: 'pickup-verified', title: 'Pickup verified', value: String(preview.summary.pickupVerified), description: 'Rows already cleared for pickup verification.', tone: 'best' },
            { id: 'dropoff-verified', title: 'Dropoff verified', value: String(preview.summary.dropoffVerified), description: 'Rows already cleared for dropoff verification.', tone: 'brand' },
            { id: 'failed-verification', title: 'Failed verification', value: String(preview.summary.failedVerification), description: 'Rows that still need manual review.', tone: 'danger' },
            { id: 'contactless-allowed', title: 'Contactless allowed', value: String(preview.summary.contactlessAllowed), description: 'Rows that can continue with contactless handoff.', tone: 'warning' },
          ]}
          actions={[
            { id: 'handoff-dispatch', label: 'Open dispatch', description: 'Return the case to dispatch if the handoff is not clear yet.', href: '/operations?workspace=dispatch', badge: 'Recovery' },
            { id: 'handoff-proof', label: 'Open proof review', description: 'Validate proof assets before finalizing the handoff.', href: '/operations?workspace=proof-review', badge: 'Proof' },
            { id: 'handoff-bell', label: 'Open arrival bell', description: 'Use arrival signals when the captain is at the doorstep.', href: '/operations?workspace=arrival-bell', badge: 'Ring' },
            { id: 'handoff-orders', label: 'Open orders', description: 'Return to the queue if the handoff is no longer current.', href: '/operations?workspace=orders', badge: 'Queue' },
          ]}
          disclosures={[
            { id: 'handoff-customer', label: 'Customer instructions', description: 'Handoff notes stay visible in the preview lane.', href: '/operations?workspace=handoff' },
            { id: 'handoff-partner', label: 'Partner instructions', description: 'Partner-facing instructions remain explicit.', href: '/operations?workspace=handoff' },
          ]}
        />

        <WebSectionCard title='Handoff lanes' description='Pickup verified, dropoff verified, and failed verification stay separated.'>
          <Box gap={2}>
            {preview.lanes.map((lane) => (
              <Box key={lane.id} padding={3} gap={1} border radiusToken='xl' background='surfaceRaised'>
                <Box layoutDirection='row' justify='space-between' align='center' style={{ gap: 12, flexWrap: 'wrap' }}>
                  <Text role='bodyStrong'>{lane.title}</Text>
                  <Badge label={lane.status} tone={lane.status === 'failed verification' ? 'danger' : lane.status === 'pickup verified' ? 'success' : 'brand'} />
                </Box>
                <Text role='bodySm' tone='muted'>{lane.notes}</Text>
                <Box layoutDirection='row' justify='space-between' align='center' style={{ gap: 12, flexWrap: 'wrap' }}>
                  <Text role='caption' tone='soft'>Pickup ref: {lane.pickupReference}</Text>
                  <Text role='caption' tone='soft'>Code: {lane.code} · OTP: {lane.otp}</Text>
                </Box>
                <Text role='caption' tone='muted'>Contactless: {lane.contactless}</Text>
              </Box>
            ))}
          </Box>
        </WebSectionCard>
      </Box>
    </WebPageFrame>
  );
}

export default ControlPanelDshHandoffVerificationScreen;