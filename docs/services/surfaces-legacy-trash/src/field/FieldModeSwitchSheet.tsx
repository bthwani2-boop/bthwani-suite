/**
 * Field Mode Switch Sheet
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

export type FieldType = 'dsh' | 'arb';

export interface FieldModeSwitchSheetProps {
  visible: boolean;
  currentType: FieldType | null;
  onSelect: (type: FieldType) => void;
  onClose: () => void;
}

export const FieldModeSwitchSheet: React.FC<FieldModeSwitchSheetProps> = ({
  visible,
  currentType,
  onSelect,
  onClose,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const ns = 'field.FieldModeSwitchSheet';
  const MODES = useMemo<Array<{ id: FieldType; label: string; description: string; icon: string }>>(() => [
    { id: 'dsh', label: t(`${ns}.labelDsh`), description: t(`${ns}.dshTasks`), icon: '🚚' },
    { id: 'arb', label: t(`${ns}.labelArb`), description: t(`${ns}.arbSupport`), icon: '📅' },
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
          <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.title}>{t('field.FieldHomeScreen.emptySubtitle')}</Text>
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
