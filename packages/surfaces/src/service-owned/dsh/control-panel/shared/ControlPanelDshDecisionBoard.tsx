import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { WebSectionCard, WebSignalCard } from '@bthwani/ui-kit/web';

export type ControlPanelDshDecisionBoardProps = {
  title: string;
  purpose: string;
  primaryDecision: string;
  nextAction: string;
  blockers: string;
  ownerSurface: string;
  evidenceHint: string;
  routeHint: string;
  decisionTone?: React.ComponentProps<typeof WebSignalCard>['tone'];
};

export function ControlPanelDshDecisionBoard({
  title,
  purpose,
  primaryDecision,
  nextAction,
  blockers,
  ownerSurface,
  evidenceHint,
  routeHint,
  decisionTone = 'brand',
}: ControlPanelDshDecisionBoardProps) {
  return (
    <WebSectionCard title={title} description={purpose}>
      <Box gap={2}>
        <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <WebSignalCard title="Primary decision" value={primaryDecision} description="What this screen should decide now." tone={decisionTone} />
          <WebSignalCard title="Next action" value={nextAction} description="The next operational move." tone="warning" />
          <WebSignalCard title="Blockers" value={blockers} description="What still blocks closure or execution." tone="danger" />
          <WebSignalCard title="Owner surface" value={ownerSurface} description="The owning DSH surface for the decision." tone="best" />
        </Box>

        <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
            <Text role="caption" tone="muted">Evidence hint</Text>
            <Text role="bodySm">{evidenceHint}</Text>
          </Box>
          <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
            <Text role="caption" tone="muted">Route hint</Text>
            <Text role="bodySm">{routeHint}</Text>
          </Box>
        </Box>
      </Box>
    </WebSectionCard>
  );
}

export default ControlPanelDshDecisionBoard;
