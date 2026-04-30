// MobileUserSurface.native.tsx - RN implementation
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Loading,
  BTHWANI_COLORS,
  useDirection,
  useI18n,
} from '@bthwani/ui-kit';

export interface MobileUserSurfaceProps {
  children?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const MobileUserSurface: React.FC<MobileUserSurfaceProps> = ({
  children,
  loading = false,
  error = null,
  onRetry,
}) => {
  const { t } = useI18n();
  useDirection();

  if (loading) {
    return (
      <View style={styles.loading}>
        <Loading size='lg' />
        <Text>{t('surfaces.mobile_user.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.error}>
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>
            {t('surfaces.mobile_user.error_title')}
          </Text>
          <Text style={styles.errorMessage}>{error}</Text>
          {onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              style={styles.retryButton}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('surfaces.mobile_user.header_title')}
        </Text>
      </View>
      <View style={styles.content}>
        {children || (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderTitle}>
              {t('surfaces.mobile_user.placeholder_title')}
            </Text>
            <Text style={styles.placeholderText}>
              {t('surfaces.mobile_user.placeholder_description')}
            </Text>
            <View style={styles.tabs}>
              <View style={styles.tab}>
                <Text>home</Text>
              </View>
              <View style={styles.tab}>
                <Text>search</Text>
              </View>
              <View style={styles.tab}>
                <Text>orders</Text>
              </View>
              <View style={styles.tab}>
                <Text>wallet</Text>
              </View>
              <View style={styles.tab}>
                <Text>profile</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { padding: 16 },
  errorCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: BTHWANI_COLORS.background,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 8,
  },
  errorMessage: { fontSize: 14, marginBottom: 16 },
  retryButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  header: { padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, padding: 16 },
  placeholder: { padding: 24, alignItems: 'center' },
  placeholderTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  placeholderText: { fontSize: 14, marginBottom: 16 },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tab: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
});
