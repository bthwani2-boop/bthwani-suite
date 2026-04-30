/**
 * CaptainCenterActionButton — Dynamic Center Action Button for Bottom Nav
 * §UX-SUPREME-001: Action-first, 1-handed operation
 * 
 * Features:
 * - Changes label + icon based on trip stage
 * - Smooth animations (120ms micro)
 * - Variants: primary, success, warning, danger
 * - Large, easy-to-tap button
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { ServiceIcon } from '../../components';

export type CenterActionVariant = 'primary' | 'success' | 'warning' | 'danger';
export type TripStage = 'idle' | 'going_to_pickup' | 'arrived' | 'picked' | 'dropped' | 'delivered';

interface CaptainCenterActionButtonProps {
  label: string;
  icon: string;
  onPress: () => void;
  variant?: CenterActionVariant;
  disabled?: boolean;
}

const VARIANT_STYLES: Record<CenterActionVariant, { bg: string; text: string; icon: string }> = {
  primary: {
    bg: semanticRoles.primaryCTA,
    text: semanticRoles.primaryCTAText,
    icon: semanticRoles.primaryCTAText,
  },
  success: {
    bg: semanticRoles.stateSuccess.icon,
    text: semanticRoles.primaryCTAText,
    icon: semanticRoles.primaryCTAText,
  },
  warning: {
    bg: semanticRoles.stateWarning.icon,
    text: semanticRoles.primaryCTAText,
    icon: semanticRoles.primaryCTAText,
  },
  danger: {
    bg: semanticRoles.stateError.icon,
    text: semanticRoles.primaryCTAText,
    icon: semanticRoles.primaryCTAText,
  },
};

export const CaptainCenterActionButton: React.FC<CaptainCenterActionButtonProps> = ({
  label,
  icon,
  onPress,
  variant = 'primary',
  disabled = false,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const variantStyle = VARIANT_STYLES[variant];

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: disabled ? semanticRoles.primaryCTADisabled : variantStyle.bg,
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <ServiceIcon name={icon} size={20} color={variantStyle.icon} />
        <Text style={[styles.label, { color: variantStyle.text }]} numberOfLines={1}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    padding: BTHWANI_SPACING.sm,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: BTHWANI_SPACING.xs / 2,
    textAlign: 'center',
  },
});
