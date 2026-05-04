'use client';

import React from 'react';
import { Box, StateView } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshIssueQueueScreen, ControlPanelDshServiceabilityScreen } from '../closure-workspaces';
import { ControlPanelDshExceptionCommandQueueScreen } from '../exceptions';
import { ControlPanelDshSlaDelayMonitorScreen } from '../sla';
import { ControlPanelDshZoneSetScreen } from '../zone-set';
import { resolveOperationsStateCopy, type OperationsViewState } from '../operations.state';
import { useDshControlPanelText } from '../shared';

export type ExceptionsSlaLaneProps = {
  state?: OperationsViewState;
  hubHref: string;
};

export function ExceptionsSlaLane({ state = 'ready', hubHref }: ExceptionsSlaLaneProps) {
  const text = useDshControlPanelText();

  if (state !== 'ready') {
    return <StateView {...resolveOperationsStateCopy(text, state)} />;
  }

  return (
    <Box gap={4}>
      <WebSectionCard
        title="Exceptions SLA lane"
        description="Exceptions, issues, serviceability, zone set, and SLA recovery are compressed into one risk lane."
      />
      <ControlPanelDshExceptionCommandQueueScreen embedded showHeader={false} hubHref={hubHref} />
      <ControlPanelDshIssueQueueScreen />
      <ControlPanelDshSlaDelayMonitorScreen embedded showHeader={false} hubHref={hubHref} />
      <ControlPanelDshServiceabilityScreen />
      <ControlPanelDshZoneSetScreen embedded showHeader={false} hubHref={hubHref} ordersHref="/operations?workspace=orders" />
    </Box>
  );
}

export default ExceptionsSlaLane;