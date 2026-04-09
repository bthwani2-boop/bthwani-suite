/**
 * PartnerAccountStoreHero — storefront-style summary for partner Account hub + profile API screen
 * §86 SSoT in surfaces | RTL-safe | i18n: dsh.app-partner.mobile.auto_dsh_partner_profile_get.*
 * §UX-SUPREME-001: Single CTA "تعديل" — one tap to edit store (no duplicate entry points)
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  BTHWANI_COLORS,
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  semanticRoles,
  useDirection,
} from '@bthwani/ui-kit';
import type {
  PartnerProfileHeroFixture,
  PartnerProfileSubscriptionChipKey,
  PartnerProfileDeliveryModeKey,
} from '../../../dsh/fixtures/partnerStaff';

const COLORS = {
  white: '#FFFFFF',
  primary: BTHWANI_COLORS.primary,
  primaryLight: '#1A5FAC',
  success: BTHWANI_COLORS.successGreen,
  danger: BTHWANI_COLORS.danger,
  amber: BTHWANI_COLORS.amber,
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray500: '#6B7280',
  gray600: '#4B5563',
};

export const PARTNER_PROFILE_SCREEN_I18N_NS =
  'dsh.app-partner.mobile.auto_dsh_partner_profile_get';

function subscriptionLabel(
  key: PartnerProfileSubscriptionChipKey,
  t: (k: string, o?: Record<string, unknown>) => string
): string {
  const NS = PARTNER_PROFILE_SCREEN_I18N_NS;
  switch (key) {
    case 'pro':
      return t(`${NS}.subscriptionPro`);
    case 'free_delivery':
      return t(`${NS}.subscriptionFreeDelivery`);
    case 'priority':
      return t(`${NS}.subscriptionPriority`);
    default:
      return key;
  }
}

function deliveryModeLabel(
  key: PartnerProfileDeliveryModeKey,
  t: (k: string) => string
): string {
  const NS = PARTNER_PROFILE_SCREEN_I18N_NS;
  switch (key) {
    case 'pickup':
      return t(`${NS}.deliveryModePickup`);
    case 'inhouse':
      return t(`${NS}.deliveryModeInhouse`);
    case 'third_party':
      return t(`${NS}.deliveryModeThirdParty`);
    default:
      return key;
  }
}

export interface PartnerAccountStoreHeroProps {
  hero: PartnerProfileHeroFixture;
  /** Store/partner display name (SSoT — shown only here) */
  storeName?: string;
  /** Extra bottom margin (e.g. account hub uses tighter spacing) */
  marginBottom?: number;
  /** §UX-SUPREME-001: Single edit CTA — navigates to store update (dsh_partner_store_update) */
  onEditPress?: () => void;
}

export const PartnerAccountStoreHero = memo(function PartnerAccountStoreHero(
  props: PartnerAccountStoreHeroProps
) {
  const { hero, storeName, marginBottom } = props;
  const onEdit = props.onEditPress;
  const {
    alignItemsStart,
    alignItemsStartStyle,
    rowStyle,
    t,
    textAlignStartStyle,
  } = useDirection();
  const NS = PARTNER_PROFILE_SCREEN_I18N_NS;
  const mb = marginBottom !== undefined ? marginBottom : BTHWANI_SPACING.lg;

  return (
    <View style={[styles.heroCard, { marginBottom: mb }]}>
      <View style={[styles.storeMetaRow, rowStyle]}>
        <View style={styles.storeLogoAndEdit}>
          <View style={styles.storeLogoBox}>
            {hero.avatarUrl ? (
              <Image
                source={{ uri: hero.avatarUrl }}
                style={styles.storeLogoImage}
                resizeMode='cover'
                accessibilityLabel={t(`${NS}.heroAvatarA11y`)}
              />
            ) : (
              <Text style={styles.storeLogoFallback}>🏬</Text>
            )}
          </View>
          {typeof onEdit === 'function' ? (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={onEdit}
              activeOpacity={0.7}
              accessibilityLabel={t(`${NS}.heroEditA11y`)}
            >
              <Ionicons name='pencil' size={18} color={COLORS.primary} />
              <Text style={styles.editBtnText}>{t(`${NS}.heroEditLabel`)}</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.storeMetaContent}>
          {storeName ? (
            <Text style={styles.storeName} numberOfLines={1}>
              {storeName}
            </Text>
          ) : null}
          <View style={[styles.storeMetaLine, rowStyle]}>
            <View style={[styles.ratingInline, rowStyle]}>
              <Ionicons name='star' size={14} color={COLORS.amber} />
              <Text style={styles.ratingValue}>{hero.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCountInline}>
                {t(`${NS}.heroReviewsInline`, {
                  count: hero.reviewCount.toLocaleString(),
                })}
              </Text>
            </View>

            <View
              style={[
                styles.statusPill,
                hero.isOpen ? styles.statusOpen : styles.statusClosed,
              ]}
            >
              <Text
                style={[
                  styles.statusPillText,
                  !hero.isOpen && styles.statusPillTextClosed,
                ]}
              >
                {hero.isOpen
                  ? t(`${NS}.heroStatusOpen`)
                  : t(`${NS}.heroStatusClosed`)}
              </Text>
            </View>

            <View style={[styles.deliveryTimeInfo, rowStyle]}>
              <Ionicons name='time-outline' size={16} color={COLORS.gray500} />
              <Text style={styles.deliveryTimeText}>
                {t(`${NS}.heroDeliveryEta`, {
                  min: hero.deliveryMinutesMin,
                  max: hero.deliveryMinutesMax,
                })}
              </Text>
            </View>

            {hero.showPriceMatch ? (
              <View style={styles.priceMatchBadge}>
                <Text style={styles.priceMatchText}>
                  {t(`${NS}.heroPriceMatch`)}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={[styles.storeMetaLine, styles.followersRow, rowStyle]}>
            <Ionicons name='people-outline' size={14} color={COLORS.gray500} />
            <Text style={styles.followersText}>
              {t(`${NS}.heroFollowers`, {
                count: hero.followersCount.toLocaleString(),
              })}
            </Text>
          </View>

          {hero.workingHoursSummary ? (
            <View style={[styles.storeMetaLine, styles.extraMetaRow, rowStyle]}>
              <Ionicons name='time' size={14} color={COLORS.gray500} />
              <Text style={styles.extraMetaText}>
                {t(`${NS}.heroWorkingHoursLabel`)}: {hero.workingHoursSummary}
              </Text>
            </View>
          ) : null}

          {hero.deliveryModeKeys && hero.deliveryModeKeys.length > 0 ? (
            <View style={[styles.storeMetaLine, styles.extraMetaRow, rowStyle]}>
              <Ionicons name='car-outline' size={14} color={COLORS.gray500} />
              <Text style={styles.extraMetaText} numberOfLines={2}>
                {t(`${NS}.heroDeliveryModesLabel`)}:{' '}
                {hero.deliveryModeKeys
                  .map(k => deliveryModeLabel(k, t))
                  .join(' · ')}
              </Text>
            </View>
          ) : null}

          {hero.subscriptionChipKeys.length > 0 ? (
            <View style={[styles.subscriptionSection, alignItemsStartStyle]}>
              <Text
                style={[
                  styles.subscriptionSectionTitle,
                  textAlignStartStyle,
                  { alignSelf: alignItemsStart },
                ]}
              >
                {t(`${NS}.heroSubscriptionsTitle`)}
              </Text>
              <View style={[styles.subscriptionChipsRow, rowStyle]}>
                {hero.subscriptionChipKeys.map(chipKey => (
                  <View
                    key={chipKey}
                    style={
                      chipKey === 'pro'
                        ? styles.proBadge
                        : styles.subscriptionChip
                    }
                  >
                    <Text
                      style={
                        chipKey === 'pro'
                          ? styles.proBadgeText
                          : styles.subscriptionChipText
                      }
                    >
                      {subscriptionLabel(chipKey, t)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: BTHWANI_RADIUS.lg,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  storeMetaRow: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  storeLogoAndEdit: {
    alignItems: 'center',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: BTHWANI_SPACING.sm,
    paddingVertical: 6,
    paddingHorizontal: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: 'rgba(26, 95, 172, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  storeLogoBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.gray100,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeLogoImage: {
    width: '100%',
    height: '100%',
  },
  storeLogoFallback: {
    fontSize: 26,
  },
  storeMetaContent: {
    flex: 1,
    marginHorizontal: BTHWANI_SPACING.md,
    minWidth: 0,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  storeMetaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    rowGap: BTHWANI_SPACING.xs,
    columnGap: BTHWANI_SPACING.sm,
  },
  ratingInline: {
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  reviewCountInline: {
    fontSize: 12,
    color: COLORS.gray500,
    fontWeight: '500',
  },
  statusPill: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 5,
    borderRadius: BTHWANI_RADIUS.full,
  },
  statusOpen: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  statusClosed: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
  },
  statusPillTextClosed: {
    color: COLORS.danger,
  },
  deliveryTimeInfo: {
    alignItems: 'center',
    gap: 4,
  },
  deliveryTimeText: {
    fontSize: 12,
    color: COLORS.gray500,
    flexShrink: 1,
  },
  priceMatchBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 4,
    borderRadius: BTHWANI_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  priceMatchText: {
    fontSize: 11,
    color: COLORS.gray600,
  },
  followersRow: {
    marginTop: BTHWANI_SPACING.xs,
  },
  extraMetaRow: {
    marginTop: BTHWANI_SPACING.xs,
  },
  extraMetaText: {
    fontSize: 12,
    color: COLORS.gray600,
    marginStart: 4,
    flexShrink: 1,
  },
  followersText: {
    fontSize: 12,
    color: COLORS.gray600,
    marginStart: 4,
    flexShrink: 1,
  },
  subscriptionSection: {
    marginTop: BTHWANI_SPACING.sm,
    width: '100%',
  },
  subscriptionSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray600,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subscriptionChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  subscriptionChip: {
    backgroundColor: COLORS.gray100,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 4,
    borderRadius: BTHWANI_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  subscriptionChipText: {
    fontSize: 11,
    color: COLORS.gray600,
    fontWeight: '500',
  },
  proBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 4,
    borderRadius: BTHWANI_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  proBadgeText: {
    fontSize: 11,
    color: COLORS.white,
    fontWeight: '600',
  },
});
