"use client";
import React, { useEffect, type ReactNode } from 'react';
import { Modal as RNModal, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { colorPalette, radius, spacing, withAlpha } from '../foundation';
import { PortalLayer, useTheme } from '../providers';
import { Button } from './button';
import { Box, Surface, Text } from '../primitives';

export type DialogAction = {
  label: string;
  onPress: () => void;
  tone?: React.ComponentProps<typeof Button>['tone'];
};

export type DialogTone = 'default' | 'danger' | 'warning' | 'success' | 'info';

export type DialogProps = {
  visible: boolean;
  title: string;
  description?: string;
  tone?: DialogTone;
  onClose: () => void;
  dismissible?: boolean;
  primaryAction?: DialogAction;
  secondaryAction?: DialogAction;
  children?: ReactNode;
};

export function Dialog({ visible, title, description, tone = 'default', onClose, dismissible = true, primaryAction, secondaryAction, children }: DialogProps) {
  const { theme } = useTheme();
  const accentColor = { default: theme.brand, danger: theme.danger, warning: theme.warning, success: theme.success, info: theme.info }[tone];

  const overlayContent = (
    <Pressable onPress={dismissible ? onClose : undefined} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing[4], backgroundColor: theme.overlay }}>
      <Pressable style={{ width: '100%', maxWidth: 520 }}>
        <Surface tone="raised" padding={0} gap={0} radiusToken="xl" style={{ overflow: 'hidden' }}>
          <View style={{ height: 5, backgroundColor: accentColor }} />
          <Box padding={5} gap={4} style={{ borderRadius: radius.xl }}>
            <Box gap={2}>
              <Text role="titleMd">{title}</Text>
              {description ? <Text role="bodyMd" tone="muted">{description}</Text> : null}
            </Box>
            {children ? <Box gap={3}>{children}</Box> : null}
            {primaryAction || secondaryAction ? (
              <View style={{ flexDirection: 'row', gap: spacing[2], justifyContent: 'flex-end' }}>
                {secondaryAction ? <Button label={secondaryAction.label} tone={secondaryAction.tone ?? 'secondary'} onPress={secondaryAction.onPress} /> : null}
                {primaryAction ? <Button label={primaryAction.label} tone={primaryAction.tone ?? 'primary'} onPress={primaryAction.onPress} /> : null}
              </View>
            ) : null}
          </Box>
        </Surface>
      </Pressable>
    </Pressable>
  );

  return overlayContent;
}

export type SheetFrameProps = {
  visible: boolean;
  title?: string;
  onClose: () => void;
  children?: ReactNode;
};

export function SheetFrame({ visible, title, onClose, children }: SheetFrameProps) {
  const { theme } = useTheme();

  const sheetContent = (
    <Pressable onPress={onClose} style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: theme.overlay }}>
      <Pressable>
        <Box background="surface" padding={4} gap={3} radiusToken="xl" style={{ borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
          {title ? <Text role="titleSm">{title}</Text> : null}
          <Box gap={3}>{children}</Box>
        </Box>
      </Pressable>
    </Pressable>
  );

  return (
    <PortalLayer
      active={visible}
      fallback={
        <RNModal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
          {sheetContent}
        </RNModal>
      }
    >
      {sheetContent}
    </PortalLayer>
  );
}

export type ToastTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export type ToastProps = {
  visible: boolean;
  title: string;
  description?: string;
  tone?: ToastTone;
  placement?: 'top' | 'bottom';
  durationMs?: number;
  onDismiss?: () => void;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function Toast({ visible, title, description, tone = 'neutral', placement = 'bottom', durationMs = 3200, onDismiss, actionLabel, onActionPress }: ToastProps) {
  const { theme } = useTheme();

  useEffect(() => {
    if (!visible || !onDismiss || durationMs <= 0) return undefined;
    const timeoutId = setTimeout(() => onDismiss(), durationMs);
    return () => clearTimeout(timeoutId);
  }, [durationMs, onDismiss, visible]);

  if (!visible) return null;

  const toneConfig = {
    neutral: { surfaceTone: 'raised' as const, textTone: 'default' as const, actionTone: 'secondary' as const, accentColor: theme.lineStrong },
    info: { surfaceTone: 'info' as const, textTone: 'info' as const, actionTone: 'secondary' as const, accentColor: theme.info },
    success: { surfaceTone: 'success' as const, textTone: 'success' as const, actionTone: 'success' as const, accentColor: theme.success },
    warning: { surfaceTone: 'warning' as const, textTone: 'warning' as const, actionTone: 'secondary' as const, accentColor: theme.warning },
    danger: { surfaceTone: 'danger' as const, textTone: 'danger' as const, actionTone: 'danger' as const, accentColor: theme.danger },
  }[tone];

  const toastContent = (
    <View pointerEvents="box-none" style={{ flex: 1, justifyContent: placement === 'top' ? 'flex-start' : 'flex-end', padding: spacing[4] }}>
      <Surface tone={toneConfig.surfaceTone} padding={4} gap={3} elevationToken="floating" style={{ borderColor: toneConfig.accentColor }}>
        <Box gap={1}>
          <Text role="bodyStrong" tone={toneConfig.textTone}>{title}</Text>
          {description ? <Text role="bodySm" tone={toneConfig.textTone}>{description}</Text> : null}
        </Box>
        {actionLabel ? <Button label={actionLabel} tone={toneConfig.actionTone} size="sm" fullWidth={false} onPress={onActionPress} /> : null}
      </Surface>
    </View>
  );

  return (
    <PortalLayer
      active={visible}
      fallback={
        <RNModal transparent visible animationType="fade" onRequestClose={onDismiss}>
          {toastContent}
        </RNModal>
      }
    >
      {toastContent}
    </PortalLayer>
  );
}

export type ModalProps = {
  visible: boolean;
  children: ReactNode;
  onClose?: () => void;
};

export function Modal({ visible, children, onClose }: ModalProps) {
  if (!visible) return null;
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: withAlpha(colorPalette.black, 0.32) }}>{children}</View>
    </RNModal>
  );
}

export type SheetProps = SheetFrameProps;

export function Sheet(props: SheetProps) {
  return <SheetFrame {...props} />;
}
