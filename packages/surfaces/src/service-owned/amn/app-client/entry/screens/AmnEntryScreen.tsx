import React from 'react';
import { ServiceHubShell, StateView } from '@bthwani/ui-kit';

export type AmnEntryScreenState = 'ready' | 'loading' | 'empty';

export type AmnEntryScreenProps = {
  state?: AmnEntryScreenState;
  onStartPress?: () => void;
  onBrowsePress?: () => void;
  onTrackOrdersPress?: () => void;
};

export function AmnEntryScreen({
  state = 'ready',
  onStartPress,
  onBrowsePress,
  onTrackOrdersPress,
}: AmnEntryScreenProps) {
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
              title: 'Start AMN',
              subtitle: 'Primary entry action',
              description: 'Open the main AMN workspace.',
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
          title="No active AMN workspace"
          description="Keep one visible start point so operators can re-enter the AMN flow quickly."
          actionLabel="Start AMN"
          onActionPress={onStartPress}
        />
      );

  return (
    <ServiceHubShell
      title="AMN Entry"
      subtitle="Single-purpose entry for app-client account management and first action."
      sections={sections}
      emptyState={emptyState}
    />
  );
}
