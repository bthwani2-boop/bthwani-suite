import React from 'react';
import { BthServiceHubShell, BthStateView } from '@bthwani/ui-kit';

export type WltEntryScreenState = 'ready' | 'loading' | 'empty';

export type WltEntryScreenProps = {
  state?: WltEntryScreenState;
  onStartPress?: () => void;
  onBrowsePress?: () => void;
  onTrackOrdersPress?: () => void;
};

export function WltEntryScreen({
  state = 'ready',
  onStartPress,
  onBrowsePress,
  onTrackOrdersPress,
}: WltEntryScreenProps) {
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
              title: 'Start WLT',
              subtitle: 'Primary entry action',
              description: 'Open the main WLT workspace.',
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
        <BthStateView stateId="loading" />
      )
      : (
        <BthStateView
          stateId="empty"
          title="No active WLT workspace"
          description="Keep one visible start point so operators can re-enter the WLT flow quickly."
          actionLabel="Start WLT"
          onActionPress={onStartPress}
        />
      );

  return (
    <BthServiceHubShell
      title="WLT Entry"
      subtitle="Single-purpose entry for app-client wallet operations and first action."
      sections={sections}
      emptyState={emptyState}
    />
  );
}
