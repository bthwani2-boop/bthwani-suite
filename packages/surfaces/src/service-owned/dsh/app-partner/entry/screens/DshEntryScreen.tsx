import React from 'react';
import {
  BthBox,
  BthButton,
  BthCard,
  BthDashboardShell,
  BthStateView,
  BthText,
} from '@bthwani/ui-kit';

export type DshEntryScreenState = 'ready' | 'loading' | 'empty';

export type DshEntryScreenProps = {
  state?: DshEntryScreenState;
  onOpenOrdersBoardPress?: () => void;
  onOpenOrderWorkspacePress?: () => void;
  onOpenMaintenancePress?: () => void;
  onOpenIssueQueuePress?: () => void;
};

function renderHero(state: DshEntryScreenState, onOpenOrdersBoardPress?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="No partner orders waiting"
        description="Keep the orders board entry visible so branch operators can restart queue triage without leaving the service shell."
        actionLabel="Open orders board"
        onActionPress={onOpenOrdersBoardPress}
      />
    );
  }

  return (
    <BthCard
      title="Partner operations entry"
      subtitle="One focused start point for order triage, workspace actions, store maintenance, and issue review."
      footer={<BthButton label="Open orders board" onPress={onOpenOrdersBoardPress} />}
    />
  );
}

function renderOrdersSection(
  onOpenOrdersBoardPress?: () => void,
  onOpenOrderWorkspacePress?: () => void,
) {
  return (
    <BthBox gap={3}>
      <BthCard
        title="Review partner queue"
        subtitle="Start from the orders board so the next branch decision stays obvious within seconds."
        footer={<BthButton label="View orders board" tone="secondary" onPress={onOpenOrdersBoardPress} />}
      />
      <BthCard
        title="Open order workspace"
        subtitle="Release, packaging, and handoff actions stay grouped in one order workspace pattern."
        footer={<BthButton label="Open workspace" tone="ghost" onPress={onOpenOrderWorkspacePress} />}
      />
    </BthBox>
  );
}

function renderSupportSection(
  onOpenMaintenancePress?: () => void,
  onOpenIssueQueuePress?: () => void,
) {
  return (
    <BthBox gap={3}>
      <BthCard
        title="Store maintenance workspace"
        subtitle="Availability and branch maintenance stay reachable without displacing the main order flow."
        footer={<BthButton label="Open maintenance" tone="secondary" onPress={onOpenMaintenancePress} />}
      />
      <BthCard
        title="Order issue queue"
        subtitle="Escalations and problem orders remain visible as a contained companion queue."
        footer={<BthButton label="Open issue queue" tone="ghost" onPress={onOpenIssueQueuePress} />}
      />
    </BthBox>
  );
}

export function DshEntryScreen({
  state = 'ready',
  onOpenOrdersBoardPress,
  onOpenOrderWorkspacePress,
  onOpenMaintenancePress,
  onOpenIssueQueuePress,
}: DshEntryScreenProps) {
  return (
    <BthDashboardShell
      title="Partner Entry"
      subtitle="Single-purpose entry for app-partner delivery operations and first order action."
      hero={renderHero(state, onOpenOrdersBoardPress)}
      sections={
        state === 'ready'
          ? [
              {
                title: 'Orders and Workspace',
                subtitle: 'Orders board entry and workspace handoff pattern.',
                content: renderOrdersSection(onOpenOrdersBoardPress, onOpenOrderWorkspacePress),
              },
              {
                title: 'Maintenance and Issues',
                subtitle: 'Maintenance workspace and issue-queue companion pattern.',
                content: renderSupportSection(onOpenMaintenancePress, onOpenIssueQueuePress),
              },
            ]
          : [
              {
                title: 'Entry State',
                subtitle: 'The screen keeps one clear partner purpose while handling base states.',
                content: (
                  <BthBox>
                    <BthText role="bodyMd" tone="muted">
                      Entry state is active. No business logic or network requests are executed here.
                    </BthText>
                  </BthBox>
                ),
              },
            ]
      }
    />
  );
}