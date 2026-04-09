/**
 * HeaderIconButton — BTHWANI Header Icons Spec
 * Rest: no frame, white monoline icon only. Press/Active: soft expanding background only.
 * ICON_BUTTON_SPEC: hit 44, bg 48 on press, radius 14, scale 1.08, 160ms, no bounce.
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  ViewStyle,
} from 'react-native';
import { BTHWANI_COLORS } from '@bthwani/ui-kit';

const HIT_AREA = 44;
const PRESS_BG_SIZE = 48;
const PRESS_RADIUS = 14;
const ICON_SIZE = 22;
const PRESS_SCALE = 1.08;
const DURATION_MS = 160;
const EASING = Easing.bezier(0.2, 0.8, 0.2, 1);

export interface HeaderIconButtonProps {
  onPress: () => void;
  accessibilityLabel: string;
  children: React.ReactNode;
  badgeCount?: number;
  badgeBackgroundColor?: string;
  badgeBorderColor?: string;
  active?: boolean;
  style?: ViewStyle;
}

export const HeaderIconButton: React.FC<HeaderIconButtonProps> = ({
  onPress,
  accessibilityLabel,
  children,
  badgeCount,
  badgeBackgroundColor,
  badgeBorderColor,
  active = false,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgOpacityAnim = useRef(new Animated.Value(0)).current;

  const showPressed = active;

  useEffect(() => {
    const toScale = showPressed ? PRESS_SCALE : 1;
    const toOpacity = showPressed ? 1 : 0;
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: toScale,
        duration: DURATION_MS,
        easing: EASING,
        useNativeDriver: true,
      }),
      Animated.timing(bgOpacityAnim, {
        toValue: toOpacity,
        duration: DURATION_MS,
        easing: EASING,
        useNativeDriver: true,
      }),
    ]).start();
  }, [showPressed, scaleAnim, bgOpacityAnim]);

  const onPressIn = () => {
    if (active) return;
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: PRESS_SCALE,
        duration: DURATION_MS,
        easing: EASING,
        useNativeDriver: true,
      }),
      Animated.timing(bgOpacityAnim, {
        toValue: 1,
        duration: DURATION_MS,
        easing: EASING,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onPressOut = () => {
    if (active) return;
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: DURATION_MS,
        easing: EASING,
        useNativeDriver: true,
      }),
      Animated.timing(bgOpacityAnim, {
        toValue: 0,
        duration: DURATION_MS,
        easing: EASING,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      style={[styles.hitArea, style]}
    >
      <Animated.View
        style={[
          styles.pressBg,
          {
            opacity: bgOpacityAnim,
          },
        ]}
      />
      <Animated.View
        style={[styles.iconWrap, { transform: [{ scale: scaleAnim }] }]}
      >
        {children}
      </Animated.View>
      {badgeCount != null && badgeCount > 0 && (
        <View
          style={[
            styles.badge,
            badgeBackgroundColor ? { backgroundColor: badgeBackgroundColor } : null,
            badgeBorderColor ? { borderColor: badgeBorderColor } : null,
          ]}
        >
          <Text style={styles.badgeText} numberOfLines={1}>
            {badgeCount > 99 ? '99+' : String(badgeCount)}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  hitArea: {
    minWidth: HIT_AREA,
    minHeight: HIT_AREA,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pressBg: {
    position: 'absolute',
    width: PRESS_BG_SIZE,
    height: PRESS_BG_SIZE,
    borderRadius: PRESS_RADIUS,
    backgroundColor: BTHWANI_COLORS.surfaceOverlay10,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.surfaceOverlay12,
  },
  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  badge: {
    position: 'absolute',
    top: 0,
    end: 0,
    backgroundColor: BTHWANI_COLORS.danger,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.surface,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 10,
    fontWeight: '700',
  },
});
