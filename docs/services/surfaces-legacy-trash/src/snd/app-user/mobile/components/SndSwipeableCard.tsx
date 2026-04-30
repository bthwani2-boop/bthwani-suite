/**
 * SND Swipeable Card Component
 * §UX-SUPREME-001: Swipe-left for details
 *
 * Features:
 * - Swipe left = View Details
 * - Visual feedback during swipe
 */

import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useDirection } from '@bthwani/ui-kit';
import { typography } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
  BTHWANI_BORDER,
} from '@bthwani/ui-kit';
import type { SndInterest } from './SndInterestMiniDetailsSheet';
import {
  SND_INTERACTIVE_HIT_SLOP,
  SND_MIN_TOUCH_TARGET,
} from '../sndAccessibility';

interface SndSwipeableCardProps {
  interest: SndInterest;
  onPress: () => void;
  onSwipeLeft?: (interest: SndInterest) => void;
  children: React.ReactNode;
}

const SWIPE_THRESHOLD = 80;
const SWIPE_VELOCITY_THRESHOLD = 0.3;

export const SndSwipeableCard: React.FC<SndSwipeableCardProps> = ({
  interest,
  onPress,
  onSwipeLeft,
  children,
}) => {
  const { t } = useDirection();
  const pan = useRef(new Animated.ValueXY()).current;
  const leftOpacity = useRef(new Animated.Value(0)).current;
  const handleOpenDetails = useCallback(() => {
    if (onSwipeLeft) {
      onSwipeLeft(interest);
      return;
    }

    onPress();
  }, [interest, onPress, onSwipeLeft]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
        Math.abs(gestureState.dx) > 8,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: 0,
        });
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0 && onSwipeLeft) {
          pan.x.setValue(gestureState.dx);
          const opacityLeft = Math.min(
            Math.abs(gestureState.dx) / SWIPE_THRESHOLD,
            1
          );
          leftOpacity.setValue(opacityLeft);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();

        // Left swipe completed
        if (
          gestureState.dx < -SWIPE_THRESHOLD ||
          (gestureState.dx < -50 && gestureState.vx < -SWIPE_VELOCITY_THRESHOLD)
        ) {
          if (onSwipeLeft) {
            Animated.parallel([
              Animated.timing(pan.x, {
                toValue: -300,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(leftOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start(() => {
              onSwipeLeft(interest);
              pan.setValue({ x: 0, y: 0 });
            });
            return;
          }
        }

        // Snap back
        Animated.parallel([
          Animated.spring(pan.x, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.timing(leftOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Left Indicator (View Details) */}
      {onSwipeLeft && (
        <Animated.View
          style={[
            styles.indicator,
            styles.leftIndicator,
            {
              opacity: leftOpacity,
              backgroundColor: semanticRoles.primaryCTA,
            },
          ]}
        >
          <Text style={styles.indicatorText}>
            {t('surfaces.snd.swipeablecard.l147_ar_1')}
          </Text>
        </Animated.View>
      )}

      {/* Card */}
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ translateX: pan.x }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          accessible={true}
          accessibilityRole='button'
          accessibilityLabel={t('surfaces.snd.viewRequest')}
          accessibilityHint='يفتح تفاصيل الطلب، ويمكنك أيضًا السحب لليسار للوصول السريع'
          accessibilityActions={
            onSwipeLeft
              ? [
                  { name: 'activate', label: 'فتح الطلب' },
                  { name: 'openDetails', label: 'فتح التفاصيل مباشرة' },
                ]
              : [{ name: 'activate', label: 'فتح الطلب' }]
          }
          onAccessibilityAction={event => {
            if (event.nativeEvent.actionName === 'openDetails') {
              handleOpenDetails();
              return;
            }

            onPress();
          }}
          hitSlop={SND_INTERACTIVE_HIT_SLOP}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: BTHWANI_SPACING.md,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    minHeight: SND_MIN_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BTHWANI_RADIUS.lg,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    zIndex: 0,
  },
  leftIndicator: {
    start: 0,
    end: '50%',
  },
  indicatorText: {
    color: semanticRoles.surface,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    minHeight: SND_MIN_TOUCH_TARGET,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: BTHWANI_BORDER.emphasis },
    shadowOpacity: 0.1,
    shadowRadius: BTHWANI_SPACING.xs,
    elevation: 3,
    zIndex: 1,
  },
});
