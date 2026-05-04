'use client';

import React from 'react';
import { Box, StateView, Text } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshSheinProxyScreen } from '../sheinproxy';
import { AWNAK_OPERATIONAL_NOTES } from '../operations.fixtures';
import { resolveOperationsStateCopy, type OperationsViewState } from '../operations.state';
import { useDshControlPanelText } from '../shared';

export type ProxySheinAwnakLaneProps = {
  state?: OperationsViewState;
  hubHref: string;
};

export function ProxySheinAwnakLane({ state = 'ready', hubHref }: ProxySheinAwnakLaneProps) {
  const text = useDshControlPanelText();

  if (state !== 'ready') {
    return <StateView {...resolveOperationsStateCopy(text, state)} />;
  }

  return (
    <Box gap={4}>
      <ControlPanelDshSheinProxyScreen hubHref={hubHref} operationsHref={hubHref} supportHref="/support" />
      <WebSectionCard
        title="Awnak operational track"
        description="Awnak stays inside the proxy lane instead of branching into a separate operations workspace."
      >
        <Box gap={2}>
          {AWNAK_OPERATIONAL_NOTES.map((note) => (
            <Text key={note} role="bodySm" tone="muted">{note}</Text>
          ))}
        </Box>
      </WebSectionCard>
    </Box>
  );
}

export default ProxySheinAwnakLane;