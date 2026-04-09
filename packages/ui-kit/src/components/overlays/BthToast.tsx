import React, { useEffect } from 'react';
import { Modal, View } from 'react-native';
import { spacing } from '../../foundation/tokens';
import { useTheme } from '../../hooks';
import { BthSurface, BthText } from '../../primitives';
import { BthButton, type BthButtonTone } from '../actions';
import { BthBox } from '../../primitives/BthBox';
import { BthPortalLayer } from '../../root/core/BthPortalHost';

export type BthToastTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export type BthToastProps = {
  visible: boolean;
  title: string;
  description?: string;
  tone?: BthToastTone;
  placement?: 'top' | 'bottom';
  durationMs?: number;
  onDismiss?: () => void;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function BthToast({
  visible,
  title,
  description,
  tone = 'neutral',
  placement = 'bottom',
  durationMs = 3200,
  onDismiss,
  actionLabel,
  onActionPress
}: BthToastProps) {
  const { theme } = useTheme();

  useEffect(() => {
    if (!visible || !onDismiss || durationMs <= 0) {
      return undefined;
    }

    const timeoutId = setTimeout(() => onDismiss(), durationMs);
    return () => clearTimeout(timeoutId);
  }, [durationMs, onDismiss, visible]);

  if (!visible) {
    return null;
  }

  const toneConfig = {
    neutral: { surfaceTone: 'raised' as const, textTone: 'default' as const, actionTone: 'secondary' as const, accentColor: theme.lineStrong },
    info: { surfaceTone: 'info' as const, textTone: 'info' as const, actionTone: 'secondary' as const, accentColor: theme.info },
    success: { surfaceTone: 'success' as const, textTone: 'success' as const, actionTone: 'success' as const, accentColor: theme.success },
    warning: { surfaceTone: 'warning' as const, textTone: 'warning' as const, actionTone: 'secondary' as const, accentColor: theme.warning },
    danger: { surfaceTone: 'danger' as const, textTone: 'danger' as const, actionTone: 'danger' as const, accentColor: theme.danger }
  }[tone];

  const toastContent = (
    <View
      pointerEvents="box-none"
      style={{
        flex: 1,
        justifyContent: placement === 'top' ? 'flex-start' : 'flex-end',
        padding: spacing[4]
      }}
    >
      <BthSurface tone={toneConfig.surfaceTone} padding={4} gap={3} elevationToken="floating" style={{ borderColor: toneConfig.accentColor }}>
        <BthBox gap={1}>
          <BthText role="bodyStrong">{title}</BthText>
          {description ? <BthText role="bodySm" tone={toneConfig.textTone}>{description}</BthText> : null}
        </BthBox>
        {actionLabel && onActionPress ? (
          <BthButton label={actionLabel} tone={toneConfig.actionTone as BthButtonTone} onPress={onActionPress} fullWidth={false} />
        ) : null}
      </BthSurface>
    </View>
  );

  return (
    <BthPortalLayer
      active={visible}
      fallback={
        <Modal transparent visible animationType="fade" onRequestClose={onDismiss}>
          {toastContent}
        </Modal>
      }
    >
      {toastContent}
    </BthPortalLayer>
  );
}