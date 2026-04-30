/**
 * ScreenTransition - Unified Screen Transition System
 * §UX-SUPREME-001: Smooth, Professional Animations
 * 
 * Features:
 * - Slide transitions (left/right)
 * - Fade transitions
 * - Scale transitions
 * - Configurable duration and easing
 * - Platform-aware (React Native Animated API)
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

export type TransitionType = 'slide-left' | 'slide-right' | 'fade' | 'scale';

export interface ScreenTransitionProps {
  children: React.ReactNode;
  type?: TransitionType;
  duration?: number;
  visible?: boolean;
  style?: ViewStyle;
}

export const ScreenTransition: React.FC<ScreenTransitionProps> = ({
  children,
  type = 'fade',
  duration = 300,
  visible = true,
  style,
}) => {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(visible ? 1 : 0.95)).current;

  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [];

    // Opacity animation (for fade and all transitions)
    animations.push(
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration,
        useNativeDriver: true,
      })
    );

    // Slide animations
    if (type === 'slide-left' || type === 'slide-right') {
      const toValue = visible ? 0 : (type === 'slide-left' ? -50 : 50);
      animations.push(
        Animated.timing(translateX, {
          toValue,
          duration,
          useNativeDriver: true,
        })
      );
    }

    // Scale animation
    if (type === 'scale') {
      animations.push(
        Animated.timing(scale, {
          toValue: visible ? 1 : 0.95,
          duration,
          useNativeDriver: true,
        })
      );
    }

    // Run all animations in parallel
    Animated.parallel(animations).start();

    // Reset values when not visible
    if (!visible) {
      setTimeout(() => {
        translateX.setValue(0);
        scale.setValue(0.95);
      }, duration);
    }
  }, [visible, type, duration, opacity, translateX, scale]);

  const animatedStyle: any = {
    opacity,
  };

  if (type === 'slide-left' || type === 'slide-right') {
    animatedStyle.transform = [{ translateX }];
  } else if (type === 'scale') {
    animatedStyle.transform = [{ scale }];
  }

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

/**
 * Hook for screen transitions
 */
export const useScreenTransition = (
  visible: boolean,
  type: TransitionType = 'fade',
  duration: number = 300
) => {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(visible ? 1 : 0.95)).current;

  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [];

    animations.push(
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration,
        useNativeDriver: true,
      })
    );

    if (type === 'slide-left' || type === 'slide-right') {
      const toValue = visible ? 0 : (type === 'slide-left' ? -50 : 50);
      animations.push(
        Animated.timing(translateX, {
          toValue,
          duration,
          useNativeDriver: true,
        })
      );
    }

    if (type === 'scale') {
      animations.push(
        Animated.timing(scale, {
          toValue: visible ? 1 : 0.95,
          duration,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start();

    if (!visible) {
      setTimeout(() => {
        translateX.setValue(0);
        scale.setValue(0.95);
      }, duration);
    }
  }, [visible, type, duration, opacity, translateX, scale]);

  const animatedStyle: any = {
    opacity,
  };

  if (type === 'slide-left' || type === 'slide-right') {
    animatedStyle.transform = [{ translateX }];
  } else if (type === 'scale') {
    animatedStyle.transform = [{ scale }];
  }

  return animatedStyle;
};
