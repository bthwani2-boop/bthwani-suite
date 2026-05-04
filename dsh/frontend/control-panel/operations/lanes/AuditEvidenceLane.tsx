'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, StateView } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshManualActionAuditScreen } from '../audit';
import { resolveOperationsStateCopy, type OperationsViewState } from '../operations.state';
import { useDshControlPanelText } from '../shared';

export type AuditEvidenceLaneProps = {
  state?: OperationsViewState;
  hubHref: string;
};

export function AuditEvidenceLane({ state = 'ready', hubHref }: AuditEvidenceLaneProps) {
  const router = useRouter();
  const text = useDshControlPanelText();

  if (state !== 'ready') {
    return <StateView {...resolveOperationsStateCopy(text, state)} />;
  }

  return (
    <Box gap={4}>
      <WebSectionCard
        title="Audit evidence lane"
        description="Manual action audit, guard status, evidence routing, and closure notes are compressed into one proof lane."
      >
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label="Guard status" tone="secondary" fullWidth={false} onPress={() => router.push('/control')} />
          <Button label="Evidence root" tone="ghost" fullWidth={false} onPress={() => router.push(hubHref)} />
        </Box>
      </WebSectionCard>
      <ControlPanelDshManualActionAuditScreen embedded showHeader={false} hubHref={hubHref} />
    </Box>
  );
}

export default AuditEvidenceLane;