/**
 * §87 — في وضع التطوير: اختيار نوع الكابتن (DSH / AMN) قبل الدخول لتطبيق الكابتن. لا KNZ حسب السياسة.
 * §UX-SUPREME-001: Unified Design - Same Tokens for all types
 */
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCaptainType } from './CaptainTypeContext';
import type { CaptainType } from '@bthwani/surfaces/captain';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

const NS = 'mobile.app-captain.CaptainTypeSelectScreen';

export function CaptainTypeSelectScreen({ navigation }: { navigation: any }) {
  const { t } = useI18n();
  const { setCaptainType } = useCaptainType();
  const TYPES = useMemo(
    () => [
      { id: 'dsh' as CaptainType, label: t(`${NS}.deliveryDsh`), short: t(`${NS}.shortDsh`) },
      { id: 'amn' as CaptainType, label: t(`${NS}.transportAmn`), short: t(`${NS}.shortAmn`) },
    ],
    [t]
  );

  const onSelect = async (id: CaptainType) => {
    await setCaptainType(id);
    // Navigation will be handled by CaptainMobileSurface useEffect
    if (navigation?.navigate) {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t(`${NS}.title`)}</Text>
      <Text style={styles.subtitle}>{t(`${NS}.subtitle`)}</Text>
      {TYPES.map(({ id, label, short }) => (
        <TouchableOpacity key={id} style={styles.button} onPress={() => onSelect(id)} activeOpacity={0.8}>
          <Text style={styles.buttonLabel}>{label}</Text>
          <Text style={styles.buttonShort}>{short}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: semanticRoles.bg,
    padding: 24
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: 32,
    textAlign: 'center'
  },
  button: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.primaryCTAText,
    textAlign: 'center'
  },
  buttonShort: {
    fontSize: 12,
    color: semanticRoles.primaryCTAText + 'CC', // 80% opacity
    textAlign: 'center',
    marginTop: 4
  },
});
