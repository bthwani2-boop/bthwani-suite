/**
 * MRF Bottom Sheet - Reusable Bottom Sheet Component
 * Based on ESF Bottom Sheet design
 * §UX-SUPREME-001: Full-screen optimized, smooth animations, gesture support
 * 
 * Features:
 * - Smooth slide-up animation
 * - Backdrop with tap-to-dismiss
 * - Configurable height (compact/full)
 * - Gesture support for swipe-down
 * - Safe area handling
 */

import React, { useEffect, useRef } from 'react';
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
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_TYPOGRAPHY } from '@bthwani/ui-kit';
import { useMrfAdaptiveLayout } from './_mrfAdaptive';

export type MrfBottomSheetHeight = 'compact' | 'medium' | 'large' | 'full';

interface MrfBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  height?: MrfBottomSheetHeight;
  title?: string;
  children: React.ReactNode;
  showHandle?: boolean;
  enableSwipeDown?: boolean;
}

function getHeightMap(layoutHeight: number): Record<MrfBottomSheetHeight, number> {
  return {
    compact: 200,
    medium: layoutHeight * 0.5,
    large: layoutHeight * 0.75,
    full: layoutHeight * 0.9,
  };
}

export const MrfBottomSheet: React.FC<MrfBottomSheetProps> = ({
  visible,
  onClose,
  height = 'medium',
  title,
  children,
  showHandle = true,
  enableSwipeDown = true,
}) => {
  const { isRTL } = useI18n();
  const { height: layoutHeight } = useMrfAdaptiveLayout();
  const HEIGHT_MAP = getHeightMap(layoutHeight);
  const sheetHeight = HEIGHT_MAP[height];
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
            duration: 200,
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
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: sheetHeight,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
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
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            {
              height: sheetHeight,
              transform: [
                { translateY: Animated.add(slideAnim, panY) },
              ],
            },
          ]}
          {...(enableSwipeDown ? panResponder.panHandlers : {})}
        >
          <SafeAreaView edges={['bottom']} style={styles.sheetContent}>
            {showHandle && (
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>
            )}

            {title && (
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, [isRTL ? 'right' : 'left']: 10, [isRTL ? 'left' : 'right']: 10 }}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.content}>
              {children}
            </View>
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
    backgroundColor: semanticRoles.overlay,
  },
  sheet: {
    backgroundColor: semanticRoles.surface,
    borderTopLeftRadius: BTHWANI_RADIUS.xl,
    borderTopRightRadius: BTHWANI_RADIUS.xl,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  sheetContent: {
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
    backgroundColor: semanticRoles.border,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.md,
    borderBlockEndWidth: 1,
    borderBlockEndColor: semanticRoles.border,
  },
  title: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xl,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
    color: semanticRoles.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  closeButtonText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.lg,
    color: semanticRoles.text,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  content: {
    flex: 1,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.md,
  },
});
