/**
 * MicroInteractions - Unified Micro-interaction Components
 * §UX-SUPREME-001: Minimum Cognitive Load + Zero Ambiguity
 *
 * Features:
 * - Button press animations
 * - Card state animations
 * - Loading skeletons
 * - Haptic feedback (when available)
 * - Smooth transitions
 */

import React, { useRef, useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
  ActivityIndicator,
} from 'react-native';
import {
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  semanticRoles,
  useDirection,
} from '@bthwani/ui-kit';

/**
 * Animated Button with Press Effect
 */
export interface AnimatedButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  activeOpacity?: number;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onPress,
  style,
  disabled = false,
  activeOpacity = 0.7,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={activeOpacity}
      style={style}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

/**
 * Animated Card with Press State
 */
export interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  onPress,
  style,
  disabled = false,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.98,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacity, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const Component = onPress ? TouchableOpacity : View;
  const componentProps = onPress
    ? {
        onPress,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        disabled,
        activeOpacity: 1,
      }
    : {};

  return (
    <Component {...componentProps} style={style}>
      <Animated.View
        style={[styles.animatedCardInner, { transform: [{ scale }], opacity }]}
      >
        {children}
      </Animated.View>
    </Component>
  );
};

/**
 * Loading Skeleton Component
 */
export interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = BTHWANI_RADIUS.sm,
  style,
}) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as ViewStyle['width'],
          height,
          borderRadius,
          backgroundColor: semanticRoles.border,
          opacity,
        },
        style,
      ]}
    />
  );
};

/**
 * Loading Skeleton Card
 */
export interface LoadingSkeletonCardProps {
  lines?: number;
  showAvatar?: boolean;
  style?: ViewStyle;
}

export const LoadingSkeletonCard: React.FC<LoadingSkeletonCardProps> = ({
  lines = 3,
  showAvatar = false,
  style,
}) => {
  const { rowDirection } = useDirection();
  return (
    <View style={[styles.skeletonCard, style, { flexDirection: rowDirection }]}>
      {showAvatar && (
        <LoadingSkeleton
          width={48}
          height={48}
          borderRadius={24}
          style={styles.skeletonAvatar}
        />
      )}
      <View style={styles.skeletonContent}>
        {Array.from({ length: lines }).map((_, index) => (
          <LoadingSkeleton
            key={index}
            width={index === 0 ? '80%' : index === 1 ? '60%' : '40%'}
            height={16}
            style={styles.skeletonLine}
          />
        ))}
      </View>
    </View>
  );
};

/**
 * Loading Spinner with Custom Styling
 */
export interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = semanticRoles.primaryCTA,
  style,
}) => {
  return (
    <View style={[styles.spinnerContainer, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  animatedCardInner: {
    width: '100%',
    alignSelf: 'stretch',
  },
  skeletonCard: {
    flexDirection: 'row',
    padding: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.sm,
  },
  skeletonAvatar: {
    marginEnd: BTHWANI_SPACING.md,
  },
  skeletonContent: {
    flex: 1,
    justifyContent: 'center',
    gap: BTHWANI_SPACING.xs,
  },
  skeletonLine: {
    marginBottom: BTHWANI_SPACING.xs,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
});
