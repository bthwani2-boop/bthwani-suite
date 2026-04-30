/**
 * §87 — Partner Type Selection Screen (Development Only)
 * §UX-SUPREME-001: Unified Design - Same Tokens for all types
 * 
 * SSoT in packages/surfaces - Shell component for app-partner
 * Used in __DEV__ mode only for selecting partner type (dsh/arb)
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { usePartnerType, type PartnerType } from '../mobile/app-partner/PartnerTypeContext';
import { colorTokens } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

export type PartnerTypeSelectType = 'dsh' | 'arb';

export interface PartnerTypeSelectScreenProps {
  navigation?: any;
}

export const PartnerTypeSelectScreen: React.FC<PartnerTypeSelectScreenProps> = ({
  navigation
}) => {
  const { t } = useI18n();
  const { setPartnerType, clearPartnerType } = usePartnerType();
  const TYPES: { id: PartnerTypeSelectType; label: string; short: string }[] = React.useMemo(
    () => [
      { id: 'dsh', label: t('partner.PartnerTypeSelectScreen.dshDeliveryPartner'), short: t('partner.PartnerTypeSelectScreen.deliveryStoreManagement') },
      { id: 'arb', label: t('partner.PartnerTypeSelectScreen.deliveryStoreManagement'), short: t('partner.PartnerTypeSelectScreen.bookingsStoreManagement') },
    ],
    [t]
  );
  
  const onSelect = async (id: PartnerType) => {
    await setPartnerType(id);
    if (navigation) {
      navigation.replace('Home');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 Development Mode</Text>
      <Text style={styles.subtitle}>{t('partner.PartnerTypeSelectScreen.chooseType')}</Text>
      {TYPES.map(({ id, label, short }) => (
        <TouchableOpacity 
          key={id} 
          style={[styles.button, id === 'dsh' ? styles.dshButton : styles.arbButton]} 
          onPress={() => onSelect(id)} 
          activeOpacity={0.8}
        >
          <Text style={styles.buttonLabel}>{label}</Text>
          <Text style={styles.buttonShort}>{short}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={async () => {
          await clearPartnerType();
          if (navigation) {
            navigation.replace('Home');
          }
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.resetButtonText}>{t('partner.PartnerTypeSelectScreen.resetType')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: semanticRoles.bg,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 280,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dshButton: {
    backgroundColor: colorTokens.bthwani.orange,
  },
  arbButton: {
    backgroundColor: colorTokens.warning['500'],
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  buttonShort: {
    fontSize: 12,
    color: 'BTHWANI_COLORS.surfaceOverlay',
    textAlign: 'center',
    marginTop: 4,
  },
  resetButton: {
    backgroundColor: BTHWANI_COLORS.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    marginTop: BTHWANI_SPACING.xl,
    width: '80%',
    maxWidth: 280,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  resetButtonText: {
    color: BTHWANI_COLORS.onSurfaceMuted,
    fontSize: 14,
    fontWeight: '500',
  },
});
