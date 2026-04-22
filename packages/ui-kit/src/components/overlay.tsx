import React, { type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';
import { bthColors, bthRadius, bthSpacing } from '../foundation';
import { BthButton } from './button';

export type BthModalProps = {
  visible: boolean;
  title: string;
  children: ReactNode;
  onClose: (event?: GestureResponderEvent) => void;
};

export function BthModal({ visible, title, children, onClose }: BthModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => onClose()}>
      <View style={styles.backdrop}>
        <View style={styles.panel}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <BthButton size="sm" tone="muted" onPress={onClose}>إغلاق</BthButton>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

export const BthDialog = BthModal;
export const BthSheet = BthModal;
export const BthSheetFrame = View;

export type BthToastProps = {
  message: string;
  actionLabel?: string;
  onActionPress?: (event: GestureResponderEvent) => void;
};

export function BthToast({ message, actionLabel, onActionPress }: BthToastProps) {
  return (
    <View style={styles.toast}>
      <Text style={styles.toastText}>{message}</Text>
      {actionLabel ? <Pressable onPress={onActionPress}><Text style={styles.toastAction}>{actionLabel}</Text></Pressable> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(15, 23, 42, 0.42)',
    flex: 1,
    justifyContent: 'flex-end',
    padding: bthSpacing.lg,
  },
  panel: {
    backgroundColor: bthColors.surface.card,
    borderRadius: bthRadius.xl,
    gap: bthSpacing.md,
    padding: bthSpacing.lg,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: bthColors.text.strong,
    fontSize: 18,
    fontWeight: '800',
  },
  toast: {
    alignItems: 'center',
    backgroundColor: bthColors.brand.navy,
    borderRadius: bthRadius.lg,
    flexDirection: 'row',
    gap: bthSpacing.md,
    padding: bthSpacing.md,
  },
  toastText: {
    color: bthColors.brand.white,
    flex: 1,
    fontSize: 14,
  },
  toastAction: {
    color: bthColors.brand.orange,
    fontSize: 14,
    fontWeight: '800',
  },
});
