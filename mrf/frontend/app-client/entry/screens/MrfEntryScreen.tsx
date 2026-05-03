import React from 'react';
import { ServiceHubShell, StateView } from '@bthwani/ui-kit';

export type MrfEntryScreenState = 'ready' | 'loading' | 'empty';

export type MrfEntryScreenProps = {
  state?: MrfEntryScreenState;
  onStartPress?: () => void;
  onBrowsePress?: () => void;
  onTrackOrdersPress?: () => void;
};

export function MrfEntryScreen({
  state = 'ready',
  onStartPress,
  onBrowsePress,
  onTrackOrdersPress,
}: MrfEntryScreenProps) {
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
              title: 'Start MRF',
              subtitle: 'Primary entry action',
              description: 'Open the main MRF workspace.',
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
          title="No active MRF workspace"
          description="Keep one visible start point so operators can re-enter the MRF flow quickly."
          actionLabel="Start MRF"
          onActionPress={onStartPress}
        />
      );

  return (
    <ServiceHubShell
      title="MRF Entry"
      subtitle="Single-purpose entry for app-client merchant referrals and first action."
      sections={sections}
      emptyState={emptyState}
    />
  );
}
