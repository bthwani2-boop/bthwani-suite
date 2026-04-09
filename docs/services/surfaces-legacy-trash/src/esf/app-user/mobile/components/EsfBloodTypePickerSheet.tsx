/**
 * ESF Blood Type Picker Sheet
 * §UX-SUPREME-001: Quick selection, instant apply, auto-close
 * 
 * Features:
 * - 2×4 grid of blood types
 * - Single selection
 * - Instant apply on selection
 * - Auto-close after selection
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { EsfBottomSheet } from './EsfBottomSheet';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

interface EsfBloodTypePickerSheetProps {
  visible: boolean;
  onClose: () => void;
  selected?: BloodType;
  onSelect: (bloodType: BloodType) => void;
  title?: string;
}

export const EsfBloodTypePickerSheet: React.FC<EsfBloodTypePickerSheetProps> = ({
  visible,
  onClose,
  selected,
  onSelect,
  title: titleProp,
}) => {
  const { t, isRTL } = useI18n();
  const title = titleProp ?? t('esf.app-client.mobile.components.EsfBloodTypePickerSheet.chooseBloodType');
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const handleSelect = (bloodType: BloodType) => {
    onSelect(bloodType);
    // Auto-close after selection
    setTimeout(() => {
      onClose();
    }, 150);
  };

  return (
    <EsfBottomSheet
      visible={visible}
      onClose={onClose}
      height="compact"
      title={title}
      showHandle={true}
    >
      <View style={styles.container}>
        <View style={[styles.grid, { flexDirection: 'row', direction: layoutDirection }]}>
          {BLOOD_TYPES.map((bloodType) => {
            const isSelected = selected === bloodType;
            return (
              <TouchableOpacity
                key={bloodType}
                style={[
                  styles.bloodTypeButton,
                  isSelected && styles.bloodTypeButtonSelected,
                ]}
                onPress={() => handleSelect(bloodType)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.bloodTypeText,
                    isSelected && styles.bloodTypeTextSelected,
                  ]}
                >
                  {bloodType}
                </Text>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </EsfBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: BTHWANI_SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
  },
  bloodTypeButton: {
    width: '22%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 2,
    borderColor: semanticRoles.border,
    position: 'relative',
  },
  bloodTypeButtonSelected: {
    backgroundColor: semanticRoles.stateError.icon,
    borderColor: semanticRoles.stateError.icon,
  },
  bloodTypeText: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  bloodTypeTextSelected: {
    color: semanticRoles.surface,
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    end: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: semanticRoles.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 12,
    color: semanticRoles.stateError.icon,
    fontWeight: '700',
  },
});

