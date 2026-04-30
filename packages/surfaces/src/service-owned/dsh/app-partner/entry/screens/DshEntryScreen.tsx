import React from 'react';
import {
  Box,
  Button,
  Card,
  Icon,
  MobileScrollView,
  StateView,
  Surface,
  Text,
  TopBar,
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
    return <StateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <StateView
        stateId="empty"
        title="No partner orders waiting"
        description="Keep the orders board entry visible so branch operators can restart queue triage without leaving the service shell."
        actionLabel="Open orders board"
        onActionPress={onOpenOrdersBoardPress}
      />
    );
  }

  return (
    <Card
      title="Partner operations entry"
      subtitle="One focused start point for order triage, workspace actions, store maintenance, and issue review."
      footer={<Button label="Open orders board" onPress={onOpenOrdersBoardPress} />}
    />
  );
}

function renderOrdersSection(
  onOpenOrdersBoardPress?: () => void,
  onOpenOrderWorkspacePress?: () => void,
) {
  return (
    <Box gap={3}>
      <Card
        title="Review partner queue"
        subtitle="Start from the orders board so the next branch decision stays obvious within seconds."
        footer={<Button label="View orders board" tone="secondary" onPress={onOpenOrdersBoardPress} />}
      />
      <Card
        title="Open order workspace"
        subtitle="Release, packaging, and handoff actions stay grouped in one order workspace pattern."
        footer={<Button label="Open workspace" tone="ghost" onPress={onOpenOrderWorkspacePress} />}
      />
    </Box>
  );
}

function renderSupportSection(
  onOpenMaintenancePress?: () => void,
  onOpenIssueQueuePress?: () => void,
) {
  return (
    <Box gap={3}>
      <Card
        title="Store maintenance workspace"
        subtitle="Availability and branch maintenance stay reachable without displacing the main order flow."
        footer={<Button label="Open maintenance" tone="secondary" onPress={onOpenMaintenancePress} />}
      />
      <Card
        title="Order issue queue"
        subtitle="Escalations and problem orders remain visible as a contained companion queue."
        footer={<Button label="Open issue queue" tone="ghost" onPress={onOpenIssueQueuePress} />}
      />
    </Box>
  );
}

export function DshEntryScreen({
  state = 'ready',
  onOpenOrdersBoardPress,
  onOpenOrderWorkspacePress,
  onOpenMaintenancePress,
  onOpenIssueQueuePress,
}: DshEntryScreenProps) {
  const backAction = onOpenOrdersBoardPress;

  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 112 }}>
      <TopBar
        variant="secondary"
        title="Partner Entry"
        style={{ marginHorizontal: -16, marginTop: -16 }}
        trailingAction={backAction ? {
          id: 'back',
          icon: <Icon name="arrow-back" size={24} tone="brand" />,
          mirrorInRtl: true,
          accessibilityLabel: 'رجوع',
          onPress: backAction,
        } : undefined}
      />

      {renderHero(state, onOpenOrdersBoardPress)}

      {state === 'ready' ? (
        <>
          <Surface tone="raised" padding={3} gap={3}>
            <Text role="label" tone="muted">
              Orders and Workspace
            </Text>
            <Text role="bodySm" tone="muted">
              Orders board entry and workspace handoff pattern.
            </Text>
            {renderOrdersSection(onOpenOrdersBoardPress, onOpenOrderWorkspacePress)}
          </Surface>

          <Surface tone="raised" padding={3} gap={3}>
            <Text role="label" tone="muted">
              Maintenance and Issues
            </Text>
            <Text role="bodySm" tone="muted">
              Maintenance workspace and issue-queue companion pattern.
            </Text>
            {renderSupportSection(onOpenMaintenancePress, onOpenIssueQueuePress)}
          </Surface>
        </>
      ) : (
        <Surface tone="raised" padding={3} gap={2}>
          <Text role="bodyMd" tone="muted">
            Entry state is active. No business logic or network requests are executed here.
          </Text>
        </Surface>
      )}
    </MobileScrollView>
  );
}


