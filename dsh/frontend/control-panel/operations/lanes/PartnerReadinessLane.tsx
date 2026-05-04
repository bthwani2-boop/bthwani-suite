'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, StateView } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshFieldOperationsScreen } from '../closure-workspaces';
import { ControlPanelDshPartnerPrepMonitorScreen } from '../partner-prep';
import { resolveOperationsStateCopy, type OperationsViewState } from '../operations.state';
import { useDshControlPanelText } from '../shared';

export type PartnerReadinessLaneProps = {
  state?: OperationsViewState;
  hubHref: string;
};

export function PartnerReadinessLane({ state = 'ready', hubHref }: PartnerReadinessLaneProps) {
  const router = useRouter();
  const text = useDshControlPanelText();

  if (state !== 'ready') {
    return <StateView {...resolveOperationsStateCopy(text, state)} />;
  }

  return (
    <Box gap={4}>
      <WebSectionCard
        title="Partner readiness lane"
        description="Partner prep, field ops, and readiness blockers stay in one lane. Broad partner management remains in the partners section."
      >
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label="Open partners section" tone="secondary" fullWidth={false} onPress={() => router.push('/partners')} />
          <Button label="Back to operations" tone="ghost" fullWidth={false} onPress={() => router.push(hubHref)} />
        </Box>
      </WebSectionCard>
      <ControlPanelDshPartnerPrepMonitorScreen embedded showHeader={false} hubHref={hubHref} />
      <ControlPanelDshFieldOperationsScreen />
    </Box>
  );
}

export default PartnerReadinessLane;