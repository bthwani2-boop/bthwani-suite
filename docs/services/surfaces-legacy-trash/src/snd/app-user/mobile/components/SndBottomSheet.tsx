/**
 * SND Bottom Sheet - Reusable Bottom Sheet Component
 * Based on MRF Bottom Sheet design
 * §UX-SUPREME-001: Full-screen optimized, smooth animations, gesture support
 *
 * Features:
 * - Smooth slide-up animation
 * - Backdrop with tap-to-dismiss
 * - Configurable height (compact/full)
 * - Gesture support for swipe-down
 * - Safe area handling
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  PanResponder,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  semanticRoles,
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
  BTHWANI_BORDER,
  typography,
  motion,
} from '@bthwani/ui-kit';
import {
  useSndLayoutDimensions,
  OVERLAY_MAX_HEIGHT_RATIO,
} from './_sndSheetLayout';
import { useDirection } from '@bthwani/ui-kit';

export type SndBottomSheetHeight = 'compact' | 'medium' | 'large' | 'full';

const ANIM_DURATION = motion.duration.fast;
const HEADER_ANIM_DURATION = motion.duration.normal;
const CONTENT_ANIM_DURATION = motion.duration.slow;

interface SndBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  height?: SndBottomSheetHeight;
  title?: string;
  children: React.ReactNode;
  showHandle?: boolean;
  enableSwipeDown?: boolean;
}

export const SndBottomSheet: React.FC<SndBottomSheetProps> = ({
  visible,
  onClose,
  height = 'medium',
  title,
  children,
  showHandle = true,
  enableSwipeDown = true,
}) => {
  const { rowStyle, t } = useDirection();
  const { height: layoutHeight } = useSndLayoutDimensions();
  const HEIGHT_MAP = useMemo<Record<SndBottomSheetHeight, number>>(
    () => ({
      compact: 200,
      medium: layoutHeight * 0.5,
      large: layoutHeight * 0.75,
      full: layoutHeight * OVERLAY_MAX_HEIGHT_RATIO,
    }),
    [layoutHeight]
  );
  // Single declaration only; if Babel reports "already declared", run: npx expo start --clear
  const sheetHeight = HEIGHT_MAP[height];
  const [isMounted, setIsMounted] = useState(visible);
  const slideAnim = useRef(new Animated.Value(sheetHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(14)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(22)).current;
  const isClosingRef = useRef(false);

  const resetAnimationState = useCallback(() => {
    slideAnim.setValue(sheetHeight);
    backdropOpacity.setValue(0);
    panY.setValue(0);
    headerOpacity.setValue(0);
    headerTranslateY.setValue(14);
    contentOpacity.setValue(0);
    contentTranslateY.setValue(22);
  }, [
    backdropOpacity,
    contentOpacity,
    contentTranslateY,
    headerOpacity,
    headerTranslateY,
    panY,
    sheetHeight,
    slideAnim,
  ]);

  const animateIn = useCallback(() => {
    isClosingRef.current = false;
    resetAnimationState();
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 92,
        friction: 11,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: ANIM_DURATION,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: HEADER_ANIM_DURATION,
        delay: 50,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: HEADER_ANIM_DURATION,
        delay: 50,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: CONTENT_ANIM_DURATION,
        delay: 110,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: CONTENT_ANIM_DURATION,
        delay: 110,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    backdropOpacity,
    contentOpacity,
    contentTranslateY,
    headerOpacity,
    headerTranslateY,
    resetAnimationState,
    slideAnim,
  ]);

  const animateOut = useCallback(
    (onComplete?: () => void) => {
      if (isClosingRef.current) {
        return;
      }

      isClosingRef.current = true;
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: motion.duration.fast,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 18,
          duration: motion.duration.fast,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(headerOpacity, {
          toValue: 0,
          duration: motion.duration.instant,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: ANIM_DURATION,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: sheetHeight,
          duration: ANIM_DURATION,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        panY.setValue(0);
        isClosingRef.current = false;
        onComplete?.();
      });
    },
    [
      backdropOpacity,
      contentOpacity,
      contentTranslateY,
      headerOpacity,
      panY,
      sheetHeight,
      slideAnim,
    ]
  );

  const requestClose = useCallback(() => {
    animateOut(() => {
      setIsMounted(false);
      onClose();
    });
  }, [animateOut, onClose]);

  const completeGestureDismiss = useCallback(() => {
    if (isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: motion.duration.fast,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(panY, {
        toValue: sheetHeight,
        duration: ANIM_DURATION,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      panY.setValue(0);
      isClosingRef.current = false;
      setIsMounted(false);
      onClose();
    });
  }, [
    ANIM_DURATION,
    backdropOpacity,
    contentOpacity,
    onClose,
    panY,
    sheetHeight,
  ]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return (
          enableSwipeDown && gestureState.dy > 0 && evt.nativeEvent.pageY < 150
        );
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return (
          enableSwipeDown &&
          gestureState.dy > 10 &&
          Math.abs(gestureState.dx) < Math.abs(gestureState.dy)
        );
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
          completeGestureDismiss();
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
      setIsMounted(true);
    }
  }, [visible]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    if (visible) {
      animateIn();
      return;
    }

    animateOut(() => {
      setIsMounted(false);
    });
  }, [animateIn, animateOut, isMounted, visible]);

  if (!isMounted) return null;

  return (
    <Modal
      visible={isMounted}
      transparent
      animationType='none'
      onRequestClose={requestClose}
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
            onPress={requestClose}
            accessibilityLabel={t('surfaces.snd.closeSheet')}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            {
              height: sheetHeight,
              transform: [{ translateY: Animated.add(slideAnim, panY) }],
            },
          ]}
          {...(enableSwipeDown ? panResponder.panHandlers : {})}
        >
          <SafeAreaView edges={['bottom']} style={styles.sheetContent}>
            <Animated.View
              style={{
                opacity: headerOpacity,
                transform: [{ translateY: headerTranslateY }],
              }}
            >
              {showHandle && (
                <View style={styles.handleContainer}>
                  <View style={styles.handle} />
                </View>
              )}

              {title && (
                <View style={[styles.sheetHeader, rowStyle]}>
                  <Text style={styles.sheetHeaderTitle} numberOfLines={2}>
                    {title}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={requestClose}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityLabel={t('surfaces.snd.closeSheet')}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>

            <Animated.View
              style={[
                styles.content,
                {
                  opacity: contentOpacity,
                  transform: [{ translateY: contentTranslateY }],
                },
              ]}
            >
              {children}
            </Animated.View>
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
    shadowOffset: { width: 0, height: -BTHWANI_SPACING.xs },
    shadowOpacity: 0.3,
    shadowRadius: BTHWANI_SPACING.md,
    elevation: BTHWANI_SPACING.md,
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
    borderRadius: BTHWANI_RADIUS.xs,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.md,
    borderBlockEndWidth: BTHWANI_BORDER.hairline,
    borderBlockEndColor: semanticRoles.border,
  },
  sheetHeaderTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.md,
    borderBlockEndWidth: BTHWANI_BORDER.hairline,
    borderBlockEndColor: semanticRoles.border,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
  },
  closeButton: {
    width: BTHWANI_SPACING.xxxl,
    height: BTHWANI_SPACING.xxxl,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  closeButtonText: {
    fontSize: typography.fontSize.lg,
    color: semanticRoles.text,
    fontWeight: typography.fontWeight.semibold,
  },
  content: {
    flex: 1,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.md,
  },
});
