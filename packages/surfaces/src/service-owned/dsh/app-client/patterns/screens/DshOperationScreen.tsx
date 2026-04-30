import React from 'react';
import { Box, Button, MobileScrollView, SectionHeader, StateView, Surface, Text } from '@bthwani/ui-kit';

export type DshOperationScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

export type DshOperationScreenProps = {
  state?: DshOperationScreenState;
  title: string;
  subtitle: string;
  content?: React.ReactNode;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  tertiaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onTertiaryAction?: () => void;
  onRetry?: () => void;
};

function renderNonReadyState(state: DshOperationScreenState, onRetry?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" />;
  }

  if (state === 'empty') {
    return <StateView stateId="empty" actionLabel="Retry" onActionPress={onRetry} />;
  }

  if (state === 'offline') {
    return <StateView stateId="offline" onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return <StateView stateId="warning" title="Temporarily paused" description="Retry remains available when this step is re-enabled." actionLabel="Retry" onActionPress={onRetry} />;
  }

  return <StateView stateId="recoverableError" title="Screen unavailable" description="Retry first. If the issue continues, return to the previous step." actionLabel="Retry" onActionPress={onRetry} />;
}

export function DshOperationScreen({
  state = 'ready',
  title,
  subtitle,
  content,
  primaryActionLabel,
  secondaryActionLabel,
  tertiaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  onTertiaryAction,
  onRetry,
}: DshOperationScreenProps) {
  if (state !== 'ready') {
    return renderNonReadyState(state, onRetry);
  }

  return (
    <MobileScrollView padding={4} gap={3}>
      <Box gap={2}>
        <Text role="titleLg">{title}</Text>
        <Text role="bodySm" tone="muted">{subtitle}</Text>
      </Box>

      {content}

      <Surface tone="inset" gap={3}>
        <SectionHeader title="الإجراء" subtitle="زر رئيسي واحد مع مسار رجوع صغير وواضح." />
        <Box gap={2}>
          {primaryActionLabel ? <Button label={primaryActionLabel} onPress={onPrimaryAction} /> : null}
          {secondaryActionLabel ? <Button label={secondaryActionLabel} tone="secondary" onPress={onSecondaryAction} /> : null}
          {tertiaryActionLabel ? <Button label={tertiaryActionLabel} tone="ghost" onPress={onTertiaryAction} /> : null}
        </Box>
      </Surface>
    </MobileScrollView>
  );
}