import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { radius, spacing } from '../../foundation/tokens';
import { useTheme } from '../../hooks';
import { BthText } from '../../primitives';

export type BthSheetFrameProps = {
  visible: boolean;
  title?: string;
  onClose: () => void;
  children?: React.ReactNode;
};

export function BthSheetFrame({ visible, title, onClose, children }: BthSheetFrameProps) {
  const { theme } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' }}>
        <Pressable style={{ backgroundColor: theme.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing[4], gap: spacing[3] }}>
          {title ? <BthText role="titleSm">{title}</BthText> : null}
          <View style={{ gap: spacing[3] }}>{children}</View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
