/**
 * UserHomeScreen — §87 SSoT in packages/surfaces
 * All UI logic here; app-user shell imports and wires only.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colorTokens, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

export const UserHomeScreen: React.FC = () => {
  const { t } = useI18n();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 {t('home.title_user_app')}</Text>
      <Text style={styles.subtitle}>{t('home.welcome_user_app')}</Text>
      <Text style={styles.description}>
        {t('home.expo_success')} 🎉
      </Text>
      <View style={styles.info}>
        <Text style={styles.infoText}>✅ {t('home.rn_works')}</Text>
        <Text style={styles.infoText}>✅ {t('home.expo_works')}</Text>
        <Text style={styles.infoText}>✅ {t('home.nav_ready')}</Text>
        <Text style={styles.infoText}>✅ {t('home.redux_ready')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorTokens.surface.secondary,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colorTokens.primary['800'],
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colorTokens.text.tertiary,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colorTokens.text.secondary,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  info: {
    backgroundColor: BTHWANI_COLORS.surface,
    padding: 20,
    borderRadius: 10,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    color: colorTokens.success['600'],
    marginBottom: 8,
    fontWeight: '500',
  },
});
