/**
 * ESF Swipeable Card Component
 * §UX-SUPREME-001: Swipe-right to accept, with undo
 *
 * Features:
 * - Swipe right = Accept
 * - Visual feedback during swipe
 * - Undo snackbar after accept
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import type { EsfRequest } from '../../../uiTypes';

interface EsfSwipeableCardProps {
  request: EsfRequest;
  onPress: () => void;
  onAccept: (request: EsfRequest) => void;
  canAccept: boolean;
  isProcessing: boolean;
  getUrgencyColor: (urgency: string) => string;
  getUrgencyText: (urgency: string) => string;
  children: React.ReactNode;
}

const SWIPE_THRESHOLD = 100;
const SWIPE_VELOCITY_THRESHOLD = 0.5;

export const EsfSwipeableCard: React.FC<EsfSwipeableCardProps> = ({
  request,
  onPress,
  onAccept,
  canAccept,
  isProcessing,
  getUrgencyColor,
  getUrgencyText,
  children,
}) => {
  const { t } = useI18n();
  const pan = useRef(new Animated.ValueXY()).current;
  const swipeOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => canAccept && !isProcessing,
      onMoveShouldSetPanResponder: () => canAccept && !isProcessing,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: 0,
        });
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow right swipe
        if (gestureState.dx > 0) {
          pan.x.setValue(gestureState.dx);
          // Fade in accept indicator
          const opacity = Math.min(gestureState.dx / SWIPE_THRESHOLD, 1);
          swipeOpacity.setValue(opacity);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();

        if (
          gestureState.dx > SWIPE_THRESHOLD ||
          (gestureState.dx > 50 && gestureState.vx > SWIPE_VELOCITY_THRESHOLD)
        ) {
          // Swipe completed - accept
          Animated.parallel([
            Animated.timing(pan.x, {
              toValue: 300,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(swipeOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onAccept(request);
            // Reset position
            pan.setValue({ x: 0, y: 0 });
          });
        } else {
          // Snap back
          Animated.parallel([
            Animated.spring(pan.x, {
              toValue: 0,
              useNativeDriver: true,
            }),
            Animated.timing(swipeOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Accept Indicator (behind card) */}
      <Animated.View
        style={[
          styles.acceptIndicator,
          {
            opacity: swipeOpacity,
            backgroundColor: semanticRoles.stateSuccess.icon,
          },
        ]}
      >
        <Text style={styles.acceptIndicatorText}>
          {t('esf.app-client.mobile.components.EsfSwipeableCard.acceptCta')}
        </Text>
      </Animated.View>

      {/* Card */}
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ translateX: pan.x }],
          },
        ]}
        {...(canAccept && !isProcessing ? panResponder.panHandlers : {})}
      >
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          disabled={isProcessing}
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
  acceptIndicator: {
    position: 'absolute',
    start: 0,
    end: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingEnd: BTHWANI_SPACING.xl,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  acceptIndicatorText: {
    color: semanticRoles.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
});

