import React from 'react';
import { Modal, Pressable } from 'react-native';
import { radius } from '../../foundation/tokens';
import { useTheme } from '../../hooks';
import { BthBox, BthText } from '../../primitives';
import { BthPortalLayer } from '../../root/core/BthPortalHost';

export type BthSheetFrameProps = {
  visible: boolean;
  title?: string;
  onClose: () => void;
  children?: React.ReactNode;
};

export function BthSheetFrame({ visible, title, onClose, children }: BthSheetFrameProps) {
  const { theme } = useTheme();

  const sheetContent = (
    <Pressable onPress={onClose} style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: theme.overlay }}>
      <Pressable>
        <BthBox
          background="surface"
          padding={4}
          gap={3}
          radiusToken="xl"
          style={{ borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        >
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
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
          {sheetContent}
        </Modal>
      }
    >
      {sheetContent}
    </BthPortalLayer>
  );
}
