/**
 * Partner Mode Switch Sheet
 * 
 * §UX-SUPREME-001: Quick sheet for switching between DSH/ARB modes
 * - Max 2 options (DSH and ARB)
 * - Does NOT navigate to "new app"
 * - Same design for all modes (unified)
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

export type PartnerType = 'dsh' | 'arb';

export interface PartnerModeSwitchSheetProps {
  visible: boolean;
  currentType: PartnerType | null;
  onSelect: (type: PartnerType) => void;
  onClose: () => void;
}

export const PartnerModeSwitchSheet: React.FC<PartnerModeSwitchSheetProps> = ({
  visible,
  currentType,
  onSelect,
  onClose,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const MODES = useMemo<Array<{ id: PartnerType; label: string; description: string; icon: string }>>(
    () => [
      { id: 'dsh', label: t('partner.PartnerModeSwitchSheet.deliveryPartnerDsh'), description: t('partner.PartnerModeSwitchSheet.deliveryPartnerDsh'), icon: '🚚' },
      { id: 'arb', label: t('partner.PartnerModeSwitchSheet.bookingsStore'), description: t('partner.PartnerModeSwitchSheet.bookingsStore'), icon: '📅' },
    ],
    [t]
  );
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.title}>{t('partner.PartnerModeSwitchSheet.title')}</Text>
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
    borderTopLeftRadius: BTHWANI_RADIUS.xl,
    borderTopRightRadius: BTHWANI_RADIUS.xl,
    paddingTop: BTHWANI_SPACING.lg,
    paddingBottom: BTHWANI_SPACING.xl * 2,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
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
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.lg,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.lg,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.md,
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
    marginEnd: BTHWANI_SPACING.lg,
  },
  modeTextContainer: {
    flex: 1,
  },
  modeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs / 2,
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
