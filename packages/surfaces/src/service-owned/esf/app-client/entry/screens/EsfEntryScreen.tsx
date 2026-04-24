import React from 'react';
import { ServiceHubShell, StateView } from '@bthwani/ui-kit';

export type EsfEntryScreenState = 'ready' | 'loading' | 'empty';

export type EsfEntryScreenProps = {
  state?: EsfEntryScreenState;
  onStartPress?: () => void;
  onBrowsePress?: () => void;
  onTrackOrdersPress?: () => void;
};

export function EsfEntryScreen({
  state = 'ready',
  onStartPress,
  onBrowsePress,
  onTrackOrdersPress,
}: EsfEntryScreenProps) {
  const isReady = state === 'ready';
  const sections = isReady
    ? [
        {
          id: 'primary',
          title: 'Service Workspace',
          subtitle: 'Canonical service entry tiles with a stable action path.',
          count: 3,
          headingOrder: 'title-first' as const,
          tiles: [
            {
              title: 'Start ESF',
              subtitle: 'Primary entry action',
              description: 'Open the main ESF workspace.',
              badgeLabel: 'Primary',
              onPress: onStartPress,
            },
            {
              title: 'Open Workspace',
              subtitle: 'Discovery and quick actions',
              description: 'Browse the active workspace cards and sections.',
              badgeLabel: 'Browse',
              onPress: onBrowsePress,
            },
            {
              title: 'Open Activity',
              subtitle: 'Review and tracking',
              description: 'Move to activity history and progress review.',
              badgeLabel: 'Track',
              onPress: onTrackOrdersPress,
            },
          ],
        },
      ]
    : [];

  const emptyState =
    state === 'loading'
      ? (
        <StateView stateId="loading" />
      )
      : (
        <StateView
          stateId="empty"
          title="No active ESF workspace"
          description="Keep one visible start point so operators can re-enter the ESF flow quickly."
          actionLabel="Start ESF"
          onActionPress={onStartPress}
        />
      );

  return (
    <ServiceHubShell
      title="ESF Entry"
      subtitle="Single-purpose entry for app-client escalation support and first action."
      sections={sections}
      emptyState={emptyState}
    />
  );
}
