import React from 'react';
import { Box, Button, Divider, MobileScrollView, SectionHeader, StateView, Text, spacing } from '@bthwani/ui-kit';

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
  primaryActionDisabled?: boolean;
  primaryActionLoading?: boolean;
};

function renderNonReadyState(state: DshOperationScreenState, onRetry?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" />;
  }

  if (state === 'empty') {
    return <StateView stateId="empty" actionLabel="إعادة المحاولة" onActionPress={onRetry} />;
  }

  if (state === 'offline') {
    return <StateView stateId="offline" onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return <StateView stateId="warning" title="متوقف مؤقتًا" description="يبقى خيار إعادة المحاولة متاحًا عند إعادة تفعيل هذه الخطوة." actionLabel="إعادة المحاولة" onActionPress={onRetry} />;
  }

  return <StateView stateId="recoverableError" title="الشاشة غير متاحة" description="أعد المحاولة أولًا، وإذا استمرت المشكلة ارجع إلى الخطوة السابقة." actionLabel="إعادة المحاولة" onActionPress={onRetry} />;
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
  primaryActionDisabled,
  primaryActionLoading,
}: DshOperationScreenProps) {
  const hasActions = Boolean(primaryActionLabel || secondaryActionLabel || tertiaryActionLabel);

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

      {hasActions ? (
        <Box gap={3} style={{ marginTop: spacing[3] }}>
          <Divider />
          <SectionHeader title="الإجراء" subtitle="زر رئيسي واحد مع مسار رجوع صغير وواضح." />
          <Box gap={2}>
            {primaryActionLabel ? <Button label={primaryActionLabel} onPress={onPrimaryAction} disabled={primaryActionDisabled} loading={primaryActionLoading} /> : null}
            {secondaryActionLabel ? <Button label={secondaryActionLabel} tone="secondary" onPress={onSecondaryAction} /> : null}
            {tertiaryActionLabel ? <Button label={tertiaryActionLabel} tone="ghost" onPress={onTertiaryAction} /> : null}
          </Box>
        </Box>
      ) : null}
    </MobileScrollView>
  );
}
