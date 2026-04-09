import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING } from '@bthwani/ui-kit';

interface EsfHomeDisabledStateProps {
  serviceFlagsError: string | null;
}

export const EsfHomeDisabledState: React.FC<EsfHomeDisabledStateProps> = ({
  serviceFlagsError,
}) => {
  const { t } = useI18n();

  return (
    <ScreenWrapper state='error'>
      <View style={styles.emptyContainer}>
        <View style={styles.stateBadge}>
          <Text style={styles.stateBadgeText}>متوقف</Text>
        </View>
        <Text style={styles.emptyTitle}>
          {t('esf.app-client.mobile.auto_esf_home_get.serviceDisabledTitle')}
        </Text>
        <Text style={styles.emptySubtitle}>
          {serviceFlagsError ||
            t('esf.app-client.mobile.auto_esf_home_get.mockLocation14')}
        </Text>
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
    borderRadius: BTHWANI_SPACING.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  stateBadge: {
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_SPACING.xl,
    backgroundColor: semanticRoles.stateError.background,
    marginBottom: BTHWANI_SPACING.lg,
  },
  stateBadgeText: {
    color: semanticRoles.stateError.icon,
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
    lineHeight: BTHWANI_SPACING.lg,
  },
});

