import React from 'react';
import { View } from 'react-native';
import { CancelOrderSheet } from '../sheets/CancelOrderSheet';
import { getDshClientStateMeta } from 'state-machines/client-state';
import {
  defaultCreateOrderValues,
  FULL_JOURNEY_STEPS,
  CreateOrderJourneyScreen,
  renderTracking,
  type DshTrackingScreenProps,
  type DshTrackingTimelineItem,
} from './parts/OrdersTrackingHelpers';

export function DshTrackingScreen({
  values = defaultCreateOrderValues,
  clientState = 'tracking_active',
  currentStatusLabel,
  fulfillmentMode,
  timeline = [],
  onSupport,
  onRetry,
  onNextAction,
  onReorder,
  onCancelOrder,
  onCreateSupportEscalation,
}: DshTrackingScreenProps) {
  const [cancelSheetVisible, setCancelSheetVisible] = React.useState(false);
  const trackingStateMeta = getDshClientStateMeta(clientState);
  const resolvedTimeline: DshTrackingTimelineItem[] = timeline.length
    ? timeline
    : clientState === 'tracking_active'
      ? FULL_JOURNEY_STEPS.map((step, index) => ({ id: step.id, title: step.title, detail: step.detail, done: index === 0 }))
      : [{ id: clientState, title: trackingStateMeta.title, detail: trackingStateMeta.description, done: false }];

  if (clientState === 'delivered') {
    return (
      <CreateOrderJourneyScreen
        values={values}
        timeline={resolvedTimeline}
        clientState={clientState}
        fulfillmentMode={fulfillmentMode}
        initialPhase="received"
        currentStatusLabel={currentStatusLabel ?? trackingStateMeta.label}
        onSupport={onSupport}
        onNextAction={onNextAction}
        onReorder={onReorder}
        onCreateSupportEscalation={onCreateSupportEscalation}
        onBack={onNextAction ?? onRetry}
      />
    );
  }

  if (clientState !== 'tracking_active') {
    return renderTracking(clientState, currentStatusLabel ?? trackingStateMeta.label, resolvedTimeline, onSupport, onNextAction, onReorder);
  }

  return (
    <View style={{ flex: 1 }}>
      <CreateOrderJourneyScreen
        values={values}
        timeline={resolvedTimeline}
        clientState={clientState}
        fulfillmentMode={fulfillmentMode}
        initialPhase="route"
        currentStatusLabel={currentStatusLabel ?? trackingStateMeta.label}
        onSupport={onSupport}
        onNextAction={onNextAction}
        onReorder={onReorder}
        onCancelOrder={onCancelOrder ? () => setCancelSheetVisible(true) : undefined}
        onCreateSupportEscalation={onCreateSupportEscalation}
        onBack={onSupport ?? onNextAction ?? onRetry}
      />
      <CancelOrderSheet
        visible={cancelSheetVisible}
        onConfirm={() => { setCancelSheetVisible(false); onCancelOrder?.(); }}
        onCancel={() => setCancelSheetVisible(false)}
      />
    </View>
  );
}

export default DshTrackingScreen;
