// ARB UX Design System — ArbPrimaryCTA
// زر إجراء أساسي واحد لكل سياق (حجز الآن، تأكيد ودفع العربون، إلخ)
// ARB_UX_DESIGN_SYSTEM §4.4

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';

const MIN_HEIGHT = 44;

export interface ArbPrimaryCTAProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const ArbPrimaryCTA: React.FC<ArbPrimaryCTAProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = true,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        fullWidth && styles.buttonFullWidth,
        (disabled || loading) && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={semanticRoles.primaryCTAText ?? semanticRoles.textInverse} />
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: MIN_HEIGHT,
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  title: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ArbPrimaryCTA;
