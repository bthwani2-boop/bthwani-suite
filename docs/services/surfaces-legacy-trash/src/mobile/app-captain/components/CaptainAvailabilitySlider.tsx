/**
 * CaptainAvailabilitySlider — single row: Available + GPS toggles.
 * §UX-SUPREME-001: Single row, available on/off + GPS on/off (opens location settings).
 * WAVE 7: Central i18n only; labels via t(captain.CaptainAvailabilitySlider.*); no hardcoded UI strings.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Switch, Linking } from 'react-native';
import {
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  semanticRoles,
  useDirection,
} from '@bthwani/ui-kit';

export type AvailabilityValue = 'available' | 'unavailable';

export interface CaptainAvailabilitySliderProps {
  value: AvailabilityValue;
  onValueChange: (value: AvailabilityValue) => void;
  disabled?: boolean;
  /** عند التشغيل يفتح إعدادات التطبيق/الموقع. إن لم يُمرَّر يُستخدم Linking.openSettings() */
  onOpenGpsSettings?: () => void;
}

export const CaptainAvailabilitySlider: React.FC<
  CaptainAvailabilitySliderProps
> = ({ value, onValueChange, disabled = false, onOpenGpsSettings }) => {
  const { rowStyle, t } = useDirection();
  const [gpsSwitchOn, setGpsSwitchOn] = useState(false);
  const ns = 'captain.CaptainAvailabilitySlider';

  const handleAvailabilitySwitch = useCallback(
    (on: boolean) => {
      if (disabled) return;
      onValueChange(on ? 'available' : 'unavailable');
    },
    [disabled, onValueChange]
  );

  const handleGpsSwitch = useCallback(
    (on: boolean) => {
      setGpsSwitchOn(on);
      if (on) {
        const openSettings =
          onOpenGpsSettings ?? (() => Linking.openSettings());
        openSettings();
      }
    },
    [onOpenGpsSettings]
  );

  return (
    <View style={[styles.row, disabled && styles.rowDisabled, rowStyle]}>
      {/* متوفر + مفتاح */}
      <View style={[styles.block, rowStyle]}>
        <Text style={styles.label}>{t(`${ns}.labelAvailable`)}</Text>
        <Switch
          value={value === 'available'}
          onValueChange={handleAvailabilitySwitch}
          disabled={disabled}
          trackColor={{
            false: semanticRoles.surfaceSubtle,
            true: semanticRoles.stateSuccess.background,
          }}
          thumbColor={
            value === 'available'
              ? semanticRoles.stateSuccess.icon
              : semanticRoles.textMuted
          }
        />
      </View>

      {/* GPS + مفتاح */}
      <View style={[styles.block, styles.blockGps, rowStyle]}>
        <Text style={styles.label}>{t(`${ns}.labelGps`)}</Text>
        <Switch
          value={gpsSwitchOn}
          onValueChange={handleGpsSwitch}
          disabled={disabled}
          trackColor={{
            false: semanticRoles.surfaceSubtle,
            true: semanticRoles.primaryCTA + '99',
          }}
          thumbColor={
            gpsSwitchOn ? semanticRoles.primaryCTA : semanticRoles.textMuted
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.lg,
  },
  rowDisabled: {
    opacity: 0.6,
  },
  block: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blockGps: {
    borderStartWidth: 1,
    borderStartColor: semanticRoles.border,
    paddingStart: BTHWANI_SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
  },
});
