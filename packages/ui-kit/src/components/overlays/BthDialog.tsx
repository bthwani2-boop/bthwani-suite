import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { radius, spacing } from '../../foundation/tokens';
import { useTheme } from '../../hooks';
import { BthBox, BthSurface, BthText } from '../../primitives';
import { BthButton, type BthButtonTone } from '../actions';
import { BthPortalLayer } from '../../root/core/BthPortalHost';

export type BthDialogAction = {
  label: string;
  onPress: () => void;
  tone?: BthButtonTone;
};

export type BthDialogTone = 'default' | 'danger' | 'warning' | 'success' | 'info';

export type BthDialogProps = {
  visible: boolean;
  title: string;
  description?: string;
  tone?: BthDialogTone;
  onClose: () => void;
  dismissible?: boolean;
  primaryAction?: BthDialogAction;
  secondaryAction?: BthDialogAction;
  children?: React.ReactNode;
};

export function BthDialog({
  visible,
  title,
  description,
  tone = 'default',
  onClose,
  dismissible = true,
  primaryAction,
  secondaryAction,
  children
}: BthDialogProps) {
  const { theme } = useTheme();

  const accentColor = {
    default: theme.brand,
    danger: theme.danger,
    warning: theme.warning,
    success: theme.success,
    info: theme.info
  }[tone];

  const overlayContent = (
    <Pressable
      onPress={dismissible ? onClose : undefined}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[4],
        backgroundColor: theme.overlay
      }}
    >
      <Pressable style={{ width: '100%', maxWidth: 520 }}>
        <BthSurface tone="raised" padding={0} gap={0} radiusToken="xl" style={{ overflow: 'hidden' }}>
          <View style={{ height: 5, backgroundColor: accentColor }} />
          <BthBox padding={5} gap={4} style={{ borderRadius: radius.xl }}>
            <BthBox gap={2}>
              <BthText role="titleMd">{title}</BthText>
              {description ? <BthText role="bodyMd" tone="muted">{description}</BthText> : null}
            </BthBox>
            {children ? <BthBox gap={3}>{children}</BthBox> : null}
            {primaryAction || secondaryAction ? (
              <BthBox gap={2}>
                {primaryAction ? (
                  <BthButton
                    label={primaryAction.label}
                    tone={primaryAction.tone ?? (tone === 'danger' ? 'danger' : tone === 'success' ? 'success' : 'primary')}
                    onPress={primaryAction.onPress}
                  />
                ) : null}
                {secondaryAction ? (
                  <BthButton
                    label={secondaryAction.label}
                    tone={secondaryAction.tone ?? 'secondary'}
                    onPress={secondaryAction.onPress}
                  />
                ) : null}
              </BthBox>
            ) : null}
          </BthBox>
        </BthSurface>
      </Pressable>
    </Pressable>
  );

  return (
    <BthPortalLayer
      active={visible}
      fallback={
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
          {overlayContent}
        </Modal>
      }
    >
      {overlayContent}
    </BthPortalLayer>
  );
}