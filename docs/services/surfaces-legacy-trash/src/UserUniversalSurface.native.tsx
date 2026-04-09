// UserUniversalSurface.native.tsx - RN implementation
import React from 'react';
import { BTHWANI_COLORS } from '@bthwani/ui-kit';

import { View, Text, StyleSheet } from 'react-native';
import { useI18n } from '@bthwani/ui-kit';

export interface UserUniversalSurfaceProps {
  children?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  navigation?: any;
  platform?: 'mobile' | 'web' | 'control panel';
  theme?: any;
}

export const UserUniversalSurface: React.FC<UserUniversalSurfaceProps> = ({
  children,
  loading = false,
  error = null,
  onRetry,
  navigation,
  platform = 'mobile',
  theme
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  if (loading) {
    return (
      <View style={styles.loading}>
        <View style={styles.spinner}>
          <Text>{t('common.loading')}</Text>
        </View>
        <Text>{t('surfaces.universal_user.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.error}>
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>{t('surfaces.universal_user.error_title')}</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          {onRetry && (
            <Text style={styles.retryButton} onPress={onRetry}>
              {t('common.retry')}
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: platform === 'mobile' ? BTHWANI_COLORS.background : undefined }]}>
      {children || (
        <View style={styles.placeholder}>
          <View style={styles.placeholderCard}>
            <Text style={styles.surfaceTitle}>{t('surfaces.universal_user.title')}</Text>
            <Text style={styles.surfaceDescription}>
              {t('surfaces.universal_user.description', { platform })}
            </Text>
            <View style={[styles.navGrid, { flexDirection: 'row', direction: layoutDirection }]}>
              <View style={styles.navItem}><Text>{t('navigation.home')}</Text></View>
              <View style={styles.navItem}><Text>{t('navigation.profile')}</Text></View>
              <View style={styles.navItem}><Text>{t('navigation.orders')}</Text></View>
              <View style={styles.navItem}><Text>{t('navigation.settings')}</Text></View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  spinner: { width: 40, height: 40, marginBottom: 8 },
  error: { flex: 1, padding: 20 },
  errorCard: { borderWidth: 1, borderRadius: 8, padding: 16, backgroundColor: BTHWANI_COLORS.warningSubtle },
  errorTitle: { fontSize: 18, fontWeight: 'bold', color: BTHWANI_COLORS.danger, marginBottom: 8 },
  errorMessage: { fontSize: 14, marginBottom: 12 },
  retryButton: { backgroundColor: BTHWANI_COLORS.info, color: 'white', padding: 8, borderRadius: 6, textAlign: 'center' },
  placeholder: { flex: 1, padding: 32 },
  placeholderCard: { maxWidth: 600, padding: 32, borderWidth: 1, borderRadius: 8, alignItems: 'center' },
  surfaceTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  surfaceDescription: { fontSize: 14, marginBottom: 16 },
  navGrid: { flexWrap: 'wrap', gap: 8 },
  navItem: { padding: 16, borderWidth: 1, borderRadius: 6, minWidth: 120, alignItems: 'center' }
});

