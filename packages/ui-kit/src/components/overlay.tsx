import React, { useEffect, type ReactNode } from 'react';
import { Modal as RNModal, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { radius, spacing } from '../foundation';
import { BthPortalLayer, useTheme } from '../providers';
import { BthButton } from './button';
import { BthBox, BthSurface, BthText } from '../primitives';

export type BthDialogAction = {
  label: string;
  onPress: () => void;
  tone?: React.ComponentProps<typeof BthButton>['tone'];
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
  children?: ReactNode;
};

export function BthDialog({ visible, title, description, tone = 'default', onClose, dismissible = true, primaryAction, secondaryAction, children }: BthDialogProps) {
  const { theme } = useTheme();
  const accentColor = { default: theme.brand, danger: theme.danger, warning: theme.warning, success: theme.success, info: theme.info }[tone];

  const overlayContent = (
    <Pressable onPress={dismissible ? onClose : undefined} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing[4], backgroundColor: theme.overlay }}>
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
              <View style={{ flexDirection: 'row', gap: spacing[2], justifyContent: 'flex-end' }}>
                {secondaryAction ? <BthButton label={secondaryAction.label} tone={secondaryAction.tone ?? 'secondary'} onPress={secondaryAction.onPress} /> : null}
                {primaryAction ? <BthButton label={primaryAction.label} tone={primaryAction.tone ?? 'primary'} onPress={primaryAction.onPress} /> : null}
              </View>
            ) : null}
          </BthBox>
        </BthSurface>
      </Pressable>
    </Pressable>
  );

  return overlayContent;
}

export type BthSheetFrameProps = {
  visible: boolean;
  title?: string;
  onClose: () => void;
  children?: ReactNode;
};

export function BthSheetFrame({ visible, title, onClose, children }: BthSheetFrameProps) {
  const { theme } = useTheme();

  const sheetContent = (
    <Pressable onPress={onClose} style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: theme.overlay }}>
      <Pressable>
        <BthBox background="surface" padding={4} gap={3} radiusToken="xl" style={{ borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
          {title ? <BthText role="titleSm">{title}</BthText> : null}
          <BthBox gap={3}>{children}</BthBox>
        </BthBox>
      </Pressable>
    </Pressable>
  );

  return (
    <BthPortalLayer
      active={visible}
      fallback={
        <RNModal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
          {sheetContent}
        </RNModal>
      }
    >
      {sheetContent}
    </BthPortalLayer>
  );
}

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

export function BthToast({ visible, title, description, tone = 'neutral', placement = 'bottom', durationMs = 3200, onDismiss, actionLabel, onActionPress }: BthToastProps) {
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
      <BthSurface tone={toneConfig.surfaceTone} padding={4} gap={3} elevationToken="floating" style={{ borderColor: toneConfig.accentColor }}>
        <BthBox gap={1}>
          <BthText role="bodyStrong" tone={toneConfig.textTone}>{title}</BthText>
          {description ? <BthText role="bodySm" tone={toneConfig.textTone}>{description}</BthText> : null}
        </BthBox>
        {actionLabel ? <BthButton label={actionLabel} tone={toneConfig.actionTone} size="sm" fullWidth={false} onPress={onActionPress} /> : null}
      </BthSurface>
    </View>
  );

  return (
    <BthPortalLayer
      active={visible}
      fallback={
        <RNModal transparent visible animationType="fade" onRequestClose={onDismiss}>
          {toastContent}
        </RNModal>
      }
    >
      {toastContent}
    </BthPortalLayer>
  );
}

export type BthModalProps = {
  visible: boolean;
  children: ReactNode;
  onClose?: () => void;
};

export function BthModal({ visible, children, onClose }: BthModalProps) {
  if (!visible) return null;
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.32)' }}>{children}</View>
    </RNModal>
  );
}

export type BthSheetProps = BthSheetFrameProps;

export function BthSheet(props: BthSheetProps) {
  return <BthSheetFrame {...props} />;
}