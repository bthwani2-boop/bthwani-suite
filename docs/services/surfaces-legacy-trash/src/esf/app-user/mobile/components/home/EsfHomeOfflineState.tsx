import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

interface EsfHomeOfflineStateProps {
  variant: 'loading' | 'general';
  networkError: string | null;
  onRetry: () => void;
}

export const EsfHomeOfflineState: React.FC<EsfHomeOfflineStateProps> = ({
  variant,
  networkError,
  onRetry,
}) => {
  const { t } = useI18n();

  const subtitleFallbackKey =
    variant === 'loading'
      ? 'esf.app-client.mobile.auto_esf_home_get.loadingRequestsMessage'
      : 'esf.app-client.mobile.auto_esf_home_get.offlineMessageAlt3';

  return (
    <ScreenWrapper state='error'>
      <View style={styles.emptyContainer}>
        <View style={styles.stateBadge}>
          <Text style={styles.stateBadgeText}>Offline</Text>
        </View>
        <Text style={styles.emptyTitle}>
          {t('esf.app-client.mobile.auto_esf_home_get.noConnectionTitle')}
        </Text>
        <Text style={styles.emptySubtitle}>
          {networkError || t(subtitleFallbackKey)}
        </Text>
        <TouchableOpacity style={styles.emptyButton} onPress={onRetry}>
          <Text style={styles.emptyButtonText}>
            {t('esf.app-client.mobile.auto_esf_home_get.retryBtn')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.xl,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  stateBadge: {
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.stateWarning.background,
    marginBottom: BTHWANI_SPACING.lg,
  },
  stateBadgeText: {
    color: semanticRoles.stateWarning.icon,
    fontSize: BTHWANI_SPACING.sm + 1,
    fontWeight: '800',
  },
  emptyTitle: {
    fontSize: BTHWANI_SPACING.lg,
    fontWeight: '800',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: BTHWANI_SPACING.md,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    lineHeight: BTHWANI_SPACING.lg,
  },
  emptyButton: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.primaryCTA,
  },
  emptyButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: BTHWANI_SPACING.md + BTHWANI_SPACING.xs,
    fontWeight: '700',
  },
});

