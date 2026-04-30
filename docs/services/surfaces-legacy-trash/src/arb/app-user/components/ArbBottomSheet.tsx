// ARB UX Design System — ArbBottomSheet
// لوحة منزلقة من الأسفل لعرض تفاصيل مختصرة + CTA دون مغادرة الشاشة
// ARB_UX_DESIGN_SYSTEM §4.5

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';

import { useI18n } from '@bthwani/ui-kit';
export interface ArbBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const ArbBottomSheet: React.FC<ArbBottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet} onStartShouldSetResponder={() => true}>
              <View style={styles.handle} />
              {title ? (
                <View style={styles.header}>
                  <Text style={[styles.title, textAlignStart]}>{title}</Text>
                  <TouchableOpacity
                    onPress={onClose}
                    hitSlop={{ top: 12, bottom: 12, [isRTL ? 'right' : 'left']: 12, [isRTL ? 'left' : 'right']: 12 }}
                    accessibilityRole="button"
                    accessibilityLabel={t('common.close')}
                  >
                    <Text style={styles.closeText}>{t('common.close')}</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              <View style={styles.content}>{children}</View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'BTHWANI_COLORS.overlay40',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: semanticRoles.surface,
    borderTopLeftRadius: BTHWANI_RADIUS.xl,
    borderTopRightRadius: BTHWANI_RADIUS.xl,
    paddingTop: BTHWANI_SPACING.md,
    paddingBottom: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    maxHeight: Dimensions.get('window').height * 0.85,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: semanticRoles.border,
    alignSelf: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.onSurface,
  },
  closeText: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  content: {
    paddingBottom: BTHWANI_SPACING.xxxl ?? 32,
  },
});

export default ArbBottomSheet;
