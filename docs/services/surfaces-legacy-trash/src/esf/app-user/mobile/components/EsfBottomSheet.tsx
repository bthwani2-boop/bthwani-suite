/**
 * ESF Bottom Sheet - Reusable Bottom Sheet Component
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
  Dimensions,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type EsfBottomSheetHeight = 'compact' | 'medium' | 'large' | 'full';

interface EsfBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  height?: EsfBottomSheetHeight;
  title?: string;
  children: React.ReactNode;
  showHandle?: boolean;
  enableSwipeDown?: boolean;
}

const HEIGHT_MAP: Record<EsfBottomSheetHeight, number> = {
  compact: 200,
  medium: SCREEN_HEIGHT * 0.5,
  large: SCREEN_HEIGHT * 0.75,
  full: SCREEN_HEIGHT * 0.9,
};

export const EsfBottomSheet: React.FC<EsfBottomSheetProps> = ({
  visible,
  onClose,
  height = 'medium',
  title,
  children,
  showHandle = true,
  enableSwipeDown = true,
}) => {
  const { isRTL } = useI18n();
  const slideAnim = useRef(new Animated.Value(HEIGHT_MAP[height])).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;

  const sheetHeight = HEIGHT_MAP[height];

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to vertical swipes from the top area (handle/header)
        return enableSwipeDown && gestureState.dy > 0 && evt.nativeEvent.pageY < 150;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond if swiping down significantly
        return enableSwipeDown && gestureState.dy > 10 && Math.abs(gestureState.dx) < Math.abs(gestureState.dy);
      },
      onPanResponderGrant: () => {
        panY.setOffset((panY as unknown as { _value: number })._value);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow downward movement
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        panY.flattenOffset();
        // Lower threshold for easier dismissal
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
      // Faster animation with optimized spring config
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100, // Increased from 65 for faster animation
          friction: 8, // Decreased from 11 for smoother animation
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200, // Reduced from 300 for faster fade
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: sheetHeight,
          duration: 200, // Reduced from 250 for faster close
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200, // Reduced from 250 for faster fade
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, sheetHeight]);

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
        {/* Backdrop */}
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

        {/* Bottom Sheet */}
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
            {/* Handle */}
            {showHandle && (
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>
            )}

            {/* Title */}
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

            {/* Content */}
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
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
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
    fontSize: 18,
    color: semanticRoles.text,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.md,
  },
});
