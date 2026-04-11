import React from 'react';
import { BthBox, BthButton, BthMobileScrollView, BthSectionHeader, BthStateView, BthSurface, BthText } from '@bthwani/ui-kit';

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
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return <BthStateView stateId="empty" actionLabel="Retry" onActionPress={onRetry} />;
  }

  if (state === 'offline') {
    return <BthStateView stateId="offline" onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return <BthStateView stateId="warning" title="Temporarily paused" description="Retry remains available when this step is re-enabled." actionLabel="Retry" onActionPress={onRetry} />;
  }

  return <BthStateView stateId="recoverableError" title="Screen unavailable" description="Retry first. If the issue continues, return to the previous step." actionLabel="Retry" onActionPress={onRetry} />;
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
    <BthMobileScrollView padding={4} gap={3}>
      <BthBox gap={2}>
        <BthText role="titleLg">{title}</BthText>
        <BthText role="bodySm" tone="muted">{subtitle}</BthText>
      </BthBox>

      {content}

      <BthSurface tone="inset" gap={3}>
        <BthSectionHeader title="Action" subtitle="Keep one dominant CTA and a small recovery lane." />
        <BthBox gap={2}>
          {primaryActionLabel ? <BthButton label={primaryActionLabel} onPress={onPrimaryAction} /> : null}
          {secondaryActionLabel ? <BthButton label={secondaryActionLabel} tone="secondary" onPress={onSecondaryAction} /> : null}
          {tertiaryActionLabel ? <BthButton label={tertiaryActionLabel} tone="ghost" onPress={onTertiaryAction} /> : null}
        </BthBox>
      </BthSurface>
    </BthMobileScrollView>
  );
}