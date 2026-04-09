/**
 * CaptainProfileScreen — Full Profile Screen for Captain
 * §UX-SUPREME-001: Complete profile management
 * 
 * Features:
 * - Profile picture/name/rating
 * - Availability status
 * - Vehicle info
 * - Documents
 * - Settings
 * - Help
 */

import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { ServiceIcon } from '../mobile/components/ServiceIcon';
import { useCaptainType } from '../mobile/app-captain/CaptainTypeContext';
import { useCaptainProfileDisplay } from '../mobile/app-captain/CaptainProfileDisplayContext';

interface CaptainProfileScreenProps {
  navigation?: any;
}

export const CaptainProfileScreen: React.FC<CaptainProfileScreenProps> = ({ navigation }) => {
  const { t } = useI18n();
  const { captainType } = useCaptainType();
  const { displayName, rating, tierLabel } = useCaptainProfileDisplay();

  const profileSections = useMemo(() => [
    {
      title: t('surfaces.captain_section_account'),
      items: [
        { label: t('surfaces.captain_profile'), icon: 'person', screen: 'platform_captain_profile_get' },
        { label: t('surfaces.captain_documents'), icon: 'description', screen: 'platform_captain_documents_get' },
        { label: t('surfaces.captain_settings'), icon: 'settings', screen: 'platform_captain_settings' },
        { label: t('surfaces.captain_map'), icon: 'map', screen: 'CaptainMap' },
        { label: t('surfaces.captain_select_type_menu'), icon: 'swap-horiz', screen: 'CaptainTypeSelect' },
      ],
    },
    {
      title: t('surfaces.captain_section_my_tier'),
      items:
        captainType === 'amn'
          ? [
              { label: t('surfaces.captain_tier_info'), icon: 'military-tech' as const, screen: 'amn_captain_tier_info' },
              { label: t('surfaces.captain_tier_evaluate'), icon: 'star' as const, screen: 'amn_captain_tier_evaluate' },
            ]
          : [
              { label: t('surfaces.captain_tier_info'), icon: 'military-tech' as const, screen: 'platform_captain_tier_info' },
              { label: t('surfaces.captain_tier_evaluate'), icon: 'star' as const, screen: 'platform_captain_tier_evaluate' },
            ],
    },
    {
      title: t('surfaces.captain_section_help'),
      items: [
        { label: t('surfaces.captain_support'), icon: 'help', screen: 'platform_captain_support' },
        { label: t('surfaces.captain_reports'), icon: 'assessment', screen: 'platform_captain_incidents_list' },
      ],
    },
  ], [t, captainType]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
          {/* Profile Header — captain name in profile icon */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <ServiceIcon name="person" size={64} color={semanticRoles.primaryCTA} />
            </View>
            <Text style={styles.name}>{displayName?.trim() ? displayName.trim() : t('surfaces.captain_name_fallback')}</Text>
            {rating != null && (
              <View style={styles.ratingRow}>
                <Text style={styles.rating}>⭐ {rating.toFixed(1)}</Text>
              </View>
            )}
          </View>

          {/* Tier and rating encouragement */}
          <View style={styles.encouragementSection}>
            <View style={styles.encouragementCard}>
              <Text style={styles.encouragementTitle}>{t('surfaces.captain_encouragement_title')}</Text>
              <View style={styles.encouragementRow}>
                {tierLabel ? (
                  <Text style={styles.encouragementTier}>{t('surfaces.captain_encouragement_tier', { tier: tierLabel })}</Text>
                ) : (
                  <Text style={styles.encouragementTier}>{t('surfaces.captain_encouragement_tier_default')}</Text>
                )}
              </View>
              {rating != null && (
                <Text style={styles.encouragementRating}>{t('surfaces.captain_encouragement_rating', { rating: rating.toFixed(1) })}</Text>
              )}
              <Text style={styles.encouragementMessage}>{t('surfaces.captain_encouragement_message')}</Text>
            </View>
          </View>

          {/* Profile Sections — each section in a card */}
          {profileSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionCard}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[
                      styles.menuItem,
                      itemIndex < section.items.length - 1 && styles.menuItemBorder,
                    ]}
                    onPress={() => navigation?.navigate(item.screen)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={styles.menuItemIcon}>
                        <ServiceIcon name={item.icon} size={22} color={semanticRoles.primaryCTA} />
                      </View>
                      <Text style={styles.menuItemLabel}>{item.label}</Text>
                    </View>
                    <ServiceIcon name="chevron-left" size={20} color={semanticRoles.textMuted} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: BTHWANI_SPACING.xl * 2,
  },
  header: {
    backgroundColor: semanticRoles.surface,
    paddingVertical: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 3,
    borderColor: semanticRoles.primaryCTA,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  ratingRow: {
    marginTop: 2,
  },
  rating: {
    fontSize: 17,
    color: semanticRoles.textMuted,
  },
  encouragementSection: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginTop: BTHWANI_SPACING.lg,
  },
  encouragementCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  encouragementTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  encouragementRow: {
    marginBottom: 4,
  },
  encouragementTier: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  encouragementRating: {
    fontSize: 16,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  encouragementMessage: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  section: {
    marginTop: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    flex: 1,
  },
});

export default CaptainProfileScreen;
