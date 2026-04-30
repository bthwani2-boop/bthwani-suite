/**
 * KWD Bottom Sheet - Reusable Bottom Sheet Component
 * Design: Simple, flexible, smart - for developing economy (Yemen)
 * §UX-SUPREME-001: Full-screen optimized, smooth animations, gesture support
 * 
 * Features:
 * - Smooth slide-up animation
 * - Backdrop with tap-to-dismiss
 * - Configurable height (compact/medium/large/full)
 * - Gesture support for swipe-down
 * - Safe area handling
 */

import React, { useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { motion, elevation } from '@bthwani/ui-kit';
import { useKwdLayoutDimensions, OVERLAY_MAX_HEIGHT_RATIO } from './_kwdBottomSheetLayout';

export type KwdBottomSheetHeight = 'compact' | 'medium' | 'large' | 'full';

interface KwdBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  height?: KwdBottomSheetHeight;
  title?: string;
  children: React.ReactNode;
  showHandle?: boolean;
  enableSwipeDown?: boolean;
}

const ANIM_DURATION = motion.duration.fast;

export const KwdBottomSheet: React.FC<KwdBottomSheetProps> = ({
  visible,
  onClose,
  height = 'medium',
  title,
  children,
  showHandle = true,
  enableSwipeDown = true,
}) => {
  const { isRTL, t } = useI18n();
  const layoutDirection = useMemo(() => (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr', [isRTL]);
  const { height: layoutHeight } = useKwdLayoutDimensions();
  const HEIGHT_MAP = useMemo<Record<KwdBottomSheetHeight, number>>(
    () => ({
      compact: 200,
      medium: layoutHeight * 0.5,
      large: layoutHeight * 0.75,
      full: layoutHeight * OVERLAY_MAX_HEIGHT_RATIO,
    }),
    [layoutHeight]
  );
  const sheetHeight = HEIGHT_MAP[height];
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const slideAnim = useRef(new Animated.Value(sheetHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return enableSwipeDown && gestureState.dy > 0 && evt.nativeEvent.pageY < 150;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return enableSwipeDown && gestureState.dy > 10 && Math.abs(gestureState.dx) < Math.abs(gestureState.dy);
      },
      onPanResponderGrant: () => {
        panY.setOffset((panY as any)._value);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        panY.flattenOffset();
        if (gestureState.dy > 80 || gestureState.vy > 0.4) {
          Animated.timing(panY, {
            toValue: sheetHeight,
            duration: ANIM_DURATION,
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          Animated.spring(panY, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      panY.setValue(0);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: sheetHeight,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, sheetHeight, slideAnim, backdropOpacity, panY]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
            accessibilityLabel={t('common.close')}
            accessibilityRole="button"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            {
              height: sheetHeight,
              transform: [
                {
                  translateY: Animated.add(slideAnim, panY),
                },
              ],
            },
          ]}
          {...(enableSwipeDown ? panResponder.panHandlers : {})}
        >
          <SafeAreaView edges={['bottom']} style={styles.safeArea}>
            {showHandle && (
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>
            )}

            {title && (
              <View style={[styles.header, { direction: layoutDirection }]}>
                <Text style={[styles.title, textAlignStart]}>{title}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, [isRTL ? 'right' : 'left']: 10, [isRTL ? 'left' : 'right']: 10 }}
                  accessibilityLabel={t('common.close')}
                  accessibilityRole="button"
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.content}>{children}</View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BTHWANI_COLORS.overlay,
  },
  sheet: {
    backgroundColor: semanticRoles.surface,
    borderTopLeftRadius: BTHWANI_RADIUS.xl,
    borderTopRightRadius: BTHWANI_RADIUS.xl,
    ...elevation.xl,
  },
  safeArea: {
    flex: 1,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: BTHWANI_SPACING.sm,
    paddingBottom: BTHWANI_SPACING.xs,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: BTHWANI_RADIUS.xs,
    backgroundColor: semanticRoles.textMuted,
    opacity: 0.3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderBlockEndWidth: 1,
    borderBlockEndColor: semanticRoles.outline || semanticRoles.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: semanticRoles.text,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
});
