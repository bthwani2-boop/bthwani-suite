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
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Box style={{ flexGrow: 1, flexBasis: 220 }}>
            <WebSignalCard title="Primary decision" value={primaryDecision} description="What this screen should decide now." tone={decisionTone} />
          </Box>
          <Box style={{ flexGrow: 1, flexBasis: 220 }}>
            <WebSignalCard title="Next action" value={nextAction} description="The next operational move." tone="warning" />
          </Box>
          <Box style={{ flexGrow: 1, flexBasis: 220 }}>
            <WebSignalCard title="Blockers" value={blockers} description="What still blocks closure or execution." tone="danger" />
          </Box>
          <Box style={{ flexGrow: 1, flexBasis: 220 }}>
            <WebSignalCard title="Owner surface" value={ownerSurface} description="The owning DSH surface for the decision." tone="best" />
          </Box>
        </Box>

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised" style={{ flexGrow: 1, flexBasis: 220 }}>
            <Text role="caption" tone="muted">Evidence hint</Text>
            <Text role="bodySm">{evidenceHint}</Text>
          </Box>
          <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised" style={{ flexGrow: 1, flexBasis: 220 }}>
            <Text role="caption" tone="muted">Route hint</Text>
            <Text role="bodySm">{routeHint}</Text>
          </Box>
        </Box>
      </Box>
    </WebSectionCard>
  );
}

export default ControlPanelDshDecisionBoard;
