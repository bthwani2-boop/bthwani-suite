import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useI18n, semanticRoles } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import type { EsfUserProfile } from '../../../../uiTypes';

interface EsfHomeEmptyStateProps {
  viewerRole?: 'donor' | 'requester';
  isAvailableNow: boolean;
  userProfile: EsfUserProfile;
  onEnableAvailability: () => void;
  disableEnableAvailabilityAction?: boolean;
  fallbackHint?: string | null;
}

// ESF_RUNTIME_STABILITY_LOCK: empty state must not crash and must not encourage failing mutations in fallback mode.
export const EsfHomeEmptyState: React.FC<EsfHomeEmptyStateProps> = ({
  viewerRole = 'donor',
  isAvailableNow,
  userProfile,
  onEnableAvailability,
  disableEnableAvailabilityAction = false,
  fallbackHint = null,
}) => {
  const { t } = useI18n();

  if (!isAvailableNow) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.stateBadge}>
          <Text style={styles.stateBadgeText}>جاهزية</Text>
        </View>
        <Text style={styles.emptyTitle}>
          {t('esf.app-client.mobile.auto_esf_home_get.emptyYouUnavailable')}
        </Text>
        <Text style={styles.emptySubtitle}>
          {fallbackHint ||
            t('esf.app-client.mobile.auto_esf_home_get.enableAvailabilityHint', {
              availableLabel: t(
                'esf.app-client.mobile.auto_esf_home_get.availableNowLabel'
              ),
            })}
        </Text>

        {!disableEnableAvailabilityAction ? (
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={onEnableAvailability}
          >
            <Text style={styles.emptyButtonText}>
              {t('esf.app-client.mobile.auto_esf_home_get.enableAvailabilityBtn')}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyPill}>
            <Text style={styles.emptyPillText}>
              {fallbackHint ||
                'الواجهة في وضع عرض محلي مؤقت لحين عودة الاتصال.'}
            </Text>
          </View>
        )}
      </View>
    );
  }

  if (viewerRole === 'requester') {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.stateBadge}>
          <Text style={styles.stateBadgeText}>طلب</Text>
        </View>
        <Text style={styles.emptyTitle}>
          {t('esf.app-client.mobile.auto_esf_home_get.emptyTitleRequester')}
        </Text>
        <Text style={styles.emptySubtitle}>
          {t('esf.app-client.mobile.auto_esf_home_get.emptySubtitleRequester')}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.stateBadge}>
        <Text style={styles.stateBadgeText}>ESF</Text>
      </View>
      <Text style={styles.emptyTitle}>
        {t('esf.app-client.mobile.auto_esf_home_get.emptyTitle')}
      </Text>
      <Text style={styles.emptySubtitle}>
        {t('esf.app-client.mobile.auto_esf_home_get.emptySubtitle', {
          bloodType: userProfile.bloodType,
          maxDistance: userProfile.maxDistance,
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.xl,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  stateBadge: {
    minWidth: 80,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.stateInfo.background,
    marginBottom: BTHWANI_SPACING.lg,
  },
  stateBadgeText: {
    fontSize: BTHWANI_SPACING.sm + 1,
    fontWeight: '800',
    color: semanticRoles.stateInfo.icon,
    textAlign: 'center',
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
  emptyPill: {
    maxWidth: 320,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceRaised,
    paddingHorizontal: BTHWANI_SPACING.lg,
    paddingVertical: BTHWANI_SPACING.md,
  },
  emptyPillText: {
    color: semanticRoles.textMuted,
    textAlign: 'center',
    fontSize: BTHWANI_SPACING.md,
    lineHeight: BTHWANI_SPACING.lg,
  },
});

