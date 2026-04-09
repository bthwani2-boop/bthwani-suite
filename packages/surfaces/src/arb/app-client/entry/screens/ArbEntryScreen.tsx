import React from 'react';
import { BthServiceHubShell, BthStateView } from '@bthwani/ui-kit';

export type ArbEntryScreenState = 'ready' | 'loading' | 'empty';

export type ArbEntryScreenProps = {
  state?: ArbEntryScreenState;
  onStartPress?: () => void;
  onBrowsePress?: () => void;
  onTrackOrdersPress?: () => void;
};

export function ArbEntryScreen({
  state = 'ready',
  onStartPress,
  onBrowsePress,
  onTrackOrdersPress,
}: ArbEntryScreenProps) {
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
              title: 'Start ARB',
              subtitle: 'Primary entry action',
              description: 'Open the main ARB workspace.',
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
          title="No active ARB workspace"
          description="Keep one visible start point so operators can re-enter the ARB flow quickly."
          actionLabel="Start ARB"
          onActionPress={onStartPress}
        />
      );

  return (
    <BthServiceHubShell
      title="ARB Entry"
      subtitle="Single-purpose entry for app-client arbitration and first action."
      sections={sections}
      emptyState={emptyState}
    />
  );
}
