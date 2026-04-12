import React from 'react';
import { BthServiceHubShell, BthStateView } from '@bthwani/ui-kit';

export type KnzEntryScreenState = 'ready' | 'loading' | 'empty';

export type KnzEntryScreenProps = {
  state?: KnzEntryScreenState;
  onStartPress?: () => void;
  onBrowsePress?: () => void;
  onTrackOrdersPress?: () => void;
};

export function KnzEntryScreen({
  state = 'ready',
  onStartPress,
  onBrowsePress,
  onTrackOrdersPress,
}: KnzEntryScreenProps) {
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
              title: 'Start KNZ',
              subtitle: 'Primary entry action',
              description: 'Open the main KNZ workspace.',
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
          title="No active KNZ workspace"
          description="Keep one visible start point so operators can re-enter the KNZ flow quickly."
          actionLabel="Start KNZ"
          onActionPress={onStartPress}
        />
      );

  return (
    <BthServiceHubShell
      title="KNZ Entry"
      subtitle="Single-purpose entry for app-client knowledge zone and first action."
      sections={sections}
      emptyState={emptyState}
    />
  );
}
