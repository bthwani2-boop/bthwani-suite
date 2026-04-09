/**
 * Captain Mode Switch Sheet
 *
 * §UX-SUPREME-001: Quick sheet for switching between DSH/AMN modes.
 * Captain types = DSH and AMN only (no KNZ per policy).
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import type { CaptainType } from './captainTypes';

export type { CaptainType };

export interface CaptainModeSwitchSheetProps {
  visible: boolean;
  currentType: CaptainType | null;
  onSelect: (type: CaptainType) => void;
  onClose: () => void;
}

export const CaptainModeSwitchSheet: React.FC<CaptainModeSwitchSheetProps> = ({
  visible,
  currentType,
  onSelect,
  onClose,
}) => {
  const { t } = useI18n();
  const MODES = useMemo(() => [
    { id: 'dsh' as CaptainType, label: t('surfaces.captain_type_delivery'), description: t('surfaces.captain_mode_delivery_desc'), icon: '🚚' },
    { id: 'amn' as CaptainType, label: t('surfaces.captain_type_ride'), description: t('surfaces.captain_mode_ride_desc'), icon: '🚕' },
  ], [t]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('surfaces.captain_mode_sheet_title')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {MODES.map((mode) => {
              const isSelected = currentType === mode.id;
              return (
                <TouchableOpacity
                  key={mode.id}
                  style={[
                    styles.modeButton,
                    isSelected && styles.modeButtonSelected
                  ]}
                  onPress={() => {
                    onSelect(mode.id);
                    onClose();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modeIcon}>{mode.icon}</Text>
                  <View style={styles.modeTextContainer}>
                    <Text style={[
                      styles.modeLabel,
                      isSelected && styles.modeLabelSelected
                    ]}>
                      {mode.label}
                    </Text>
                    <Text style={[
                      styles.modeDescription,
                      isSelected && styles.modeDescriptionSelected
                    ]}>
                      {mode.description}
                    </Text>
                  </View>
                  {isSelected && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: semanticRoles.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: semanticRoles.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.divider,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: semanticRoles.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  closeButtonText: {
    fontSize: 18,
    color: semanticRoles.text,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  modeButtonSelected: {
    backgroundColor: semanticRoles.accentHover,
    borderColor: semanticRoles.accent,
  },
  modeIcon: {
    fontSize: 32,
    marginEnd: 16,
  },
  modeTextContainer: {
    flex: 1,
  },
  modeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: 4,
  },
  modeLabelSelected: {
    color: semanticRoles.text,
  },
  modeDescription: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  modeDescriptionSelected: {
    color: semanticRoles.text,
  },
  checkmark: {
    fontSize: 20,
    color: semanticRoles.accent,
    fontWeight: 'bold',
  },
});
