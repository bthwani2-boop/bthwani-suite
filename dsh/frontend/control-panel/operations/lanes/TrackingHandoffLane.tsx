'use client';

import React from 'react';
import { Box, StateView } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshArrivalBellScreen } from '../arrival-bell';
import { ControlPanelDshLiveTrackingTimelineScreen } from '../live-tracking';
import { ControlPanelDshHandoffVerificationScreen } from '../handoff';
import { ControlPanelDshProofReviewScreen } from '../proof-review';
import { resolveOperationsStateCopy, type OperationsViewState } from '../operations.state';
import { useDshControlPanelText } from '../shared';

export type TrackingHandoffLaneProps = {
  state?: OperationsViewState;
  hubHref: string;
};

export function TrackingHandoffLane({ state = 'ready', hubHref }: TrackingHandoffLaneProps) {
  const text = useDshControlPanelText();

  if (state !== 'ready') {
    return <StateView {...resolveOperationsStateCopy(text, state)} />;
  }

  return (
    <Box gap={4}>
      <WebSectionCard
        title="Tracking handoff lane"
        description="Live tracking, arrival bell, handoff verification, and proof review stay together as one end-to-end execution lane."
      />
      <ControlPanelDshLiveTrackingTimelineScreen embedded showHeader={false} hubHref={hubHref} />
      <ControlPanelDshArrivalBellScreen embedded showHeader={false} hubHref={hubHref} ordersHref="/operations?workspace=orders" />
      <ControlPanelDshHandoffVerificationScreen embedded showHeader={false} hubHref={hubHref} />
      <ControlPanelDshProofReviewScreen embedded showHeader={false} hubHref={hubHref} />
    </Box>
  );
}

export default TrackingHandoffLane;