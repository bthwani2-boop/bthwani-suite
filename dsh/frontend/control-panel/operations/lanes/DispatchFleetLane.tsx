'use client';

import React from 'react';
import { Box, StateView } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshCaptainOperationsScreen } from '../closure-workspaces';
import { ControlPanelDshDispatchBoardScreen } from '../dispatch';
import { ControlPanelDshReassignScreen } from '../reassign';
import { ControlPanelDshPeakModeScreen } from '../peak-mode';
import { ControlPanelDshAreaCapacityMonitorScreen } from '../capacity';
import { resolveOperationsStateCopy, type OperationsViewState } from '../operations.state';
import { useDshControlPanelText } from '../shared';

export type DispatchFleetLaneProps = {
  state?: OperationsViewState;
  hubHref: string;
};

export function DispatchFleetLane({ state = 'ready', hubHref }: DispatchFleetLaneProps) {
  const text = useDshControlPanelText();

  if (state !== 'ready') {
    return <StateView {...resolveOperationsStateCopy(text, state)} />;
  }

  return (
    <Box gap={4}>
      <WebSectionCard
        title="Dispatch fleet lane"
        description="Dispatch, captains, reassign, capacity, and peak mode now operate in one compressed lane."
      />
      <ControlPanelDshDispatchBoardScreen embedded showHeader={false} hubHref={hubHref} />
      <ControlPanelDshCaptainOperationsScreen />
      <ControlPanelDshReassignScreen embedded showHeader={false} hubHref={hubHref} ordersHref="/operations?workspace=orders" />
      <ControlPanelDshPeakModeScreen embedded showHeader={false} hubHref={hubHref} ordersHref="/operations?workspace=orders" />
      <ControlPanelDshAreaCapacityMonitorScreen embedded showHeader={false} hubHref={hubHref} />
    </Box>
  );
}

export default DispatchFleetLane;