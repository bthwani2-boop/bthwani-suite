/**
 * MRF Swipeable Card Component
 * Based on ESF SwipeableCard design
 * §UX-SUPREME-001: Swipe-right to claim/respond, with undo
 * 
 * Features:
 * - Swipe right = Claim/Respond
 * - Visual feedback during swipe
 * - Undo snackbar after action
 */

import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, PanResponder } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_TYPOGRAPHY } from '@bthwani/ui-kit';

export interface MrfReport {
  id: string;
  title: string;
  reportType: 'missing' | 'found';
  status: 'active' | 'resolved' | 'closed';
  location: string;
  timestamp: string;
  urgency: 'low' | 'medium' | 'high';
  distance?: number;
  category?: string;
  attachments?: Array<{
    attachmentId?: string;
    url?: string;
    type?: string;
  }>;
}

interface MrfSwipeableCardProps {
  report: MrfReport;
  onPress: () => void;
  onClaim?: (report: MrfReport) => void;
  onRespond?: (report: MrfReport) => void;
  canClaim?: boolean;
  canRespond?: boolean;
  isProcessing?: boolean;
  getUrgencyColor: (urgency: string) => string;
  getUrgencyText: (urgency: string) => string;
  children: React.ReactNode;
}

const SWIPE_THRESHOLD = 100;
const SWIPE_VELOCITY_THRESHOLD = 0.5;

export const MrfSwipeableCard: React.FC<MrfSwipeableCardProps> = ({
  report,
  onPress,
  onClaim,
  onRespond,
  canClaim = false,
  canRespond = false,
  isProcessing = false,
  getUrgencyColor,
  getUrgencyText,
  children,
}) => {
  const { t } = useI18n();
  const pan = useRef(new Animated.ValueXY()).current;
  const swipeOpacity = useRef(new Animated.Value(0)).current;

  const canSwipe = (canClaim || canRespond) && !isProcessing;
  const actionText = canClaim ? 'مطالبة' : canRespond ? t('surfaces.رد') : '';

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => canSwipe,
      onMoveShouldSetPanResponder: () => canSwipe,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: 0,
        });
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          pan.x.setValue(gestureState.dx);
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
            if (canClaim && onClaim) {
              onClaim(report);
            } else if (canRespond && onRespond) {
              onRespond(report);
            }
            pan.setValue({ x: 0, y: 0 });
          });
        } else {
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
      <Animated.View
        style={[
          styles.swipeIndicator,
          {
            opacity: swipeOpacity,
            transform: [{ translateX: pan.x }],
          },
        ]}
      >
        <Text style={styles.swipeIndicatorText}>{actionText}</Text>
      </Animated.View>
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
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    overflow: 'hidden',
  },
  swipeIndicator: {
    position: 'absolute',
    start: 0,
    top: 0,
    bottom: 0,
    end: 0,
    backgroundColor: semanticRoles.stateSuccess.icon,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingEnd: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  swipeIndicatorText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.lg,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
  },
});
