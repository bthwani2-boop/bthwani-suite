/**
 * KWD Swipeable Card Component
 * Design: Simple, flexible, smart - for developing economy (Yemen)
 *
 * Features:
 * - Tap to open details (Bottom Sheet)
 * - Simple card design with essential info
 * - Visual feedback
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens, elevation } from '@bthwani/ui-kit';

export interface KwdJob {
  id: string;
  title: string;
  company?: string;
  location?: string;
  /** المسافة بالكيلومتر عند توفر الموقع (من الـ API أو حسابات قريب مني) */
  distance?: number;
  /** تقييم 0–5 (صاحب العمل أو الإعلان) من الـ API */
  rating?: number;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  jobType?: string;
  postedDate?: string;
  timestamp?: string;
  category?: string;
  description?: string;
}

interface KwdSwipeableCardProps {
  job: KwdJob;
  onPress: () => void;
  isProcessing?: boolean;
  onApply?: () => void;
  /** عرض زر المفضلة — نقرة لا تفتح التفاصيل */
  isFavorite?: boolean;
  onFavoritePress?: () => void;
}

export const KwdSwipeableCard: React.FC<KwdSwipeableCardProps> = ({
  job,
  onPress,
  isProcessing = false,
  onApply,
  isFavorite = false,
  onFavoritePress,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );
  const layoutDirection = useMemo(() => (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr', [isRTL]);
  const formatWage = (salary?: {
    min?: number;
    max?: number;
    currency?: string;
  }): string => {
    if (!salary) return t('surfaces.unspecified');
    const currency = salary.currency || 'SAR';
    if (salary.min && salary.max) {
      return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${currency}`;
    }
    if (salary.min) {
      return t('surfaces.من_الراتب', { min: salary.min.toLocaleString(), currency });
    }
    if (salary.max) {
      return t('surfaces.salaryTo', { max: salary.max.toLocaleString(), currency });
    }
    return t('surfaces.unspecified');
  };

  const jobTypeKeys: Record<string, string> = {
    full_time: 'surfaces.jobTypeFullTime',
    part_time: 'surfaces.jobTypePartTime',
    contract: 'surfaces.jobTypeContract',
    freelance: 'surfaces.jobTypeFreelance',
    daily: 'surfaces.jobTypeDaily',
    one_time: 'surfaces.jobTypeOneTime',
    recurring: 'surfaces.jobTypeRecurring',
    permanent: 'surfaces.jobTypePermanent',
  };
  const formatJobType = (type?: string): string => {
    if (!type) return t('surfaces.unspecified');
    const key = jobTypeKeys[type];
    return key ? t(key) : type;
  };

  const getJobTypeIcon = (type?: string): string => {
    const iconMap: Record<string, string> = {
      daily: '💰',
      one_time: '🔧',
      recurring: '🔄',
      contract: '📝',
      permanent: '💼',
      full_time: '💼',
      part_time: '⏰',
    };
    return iconMap[type || ''] || '📋';
  };

  return (
    <TouchableOpacity
      style={[styles.card, isProcessing && styles.cardProcessing]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isProcessing}
      accessibilityLabel={job.title}
      accessibilityRole="button"
    >
      {/* Header: نوع العمل + الوقت + المفضلة */}
      <View style={[styles.cardHeader, { direction: layoutDirection }]}>
        <View style={[styles.jobTypeContainer, { direction: layoutDirection }]}>
          <Text style={styles.jobTypeIcon}>{getJobTypeIcon(job.jobType)}</Text>
          <Text style={styles.jobTypeText}>{formatJobType(job.jobType)}</Text>
        </View>
        <View style={[styles.cardHeaderRight, { direction: layoutDirection }]}>
          {job.timestamp && (
            <Text style={styles.timestamp}>{job.timestamp}</Text>
          )}
          {onFavoritePress != null && (
            <TouchableOpacity
              hitSlop={{
                top: 8,
                bottom: 8,
                [isRTL ? 'right' : 'left']: 8,
                [isRTL ? 'left' : 'right']: 8,
              }}
              onPress={e => {
                e.stopPropagation();
                onFavoritePress();
              }}
              style={styles.favoriteButton}
              accessibilityLabel={isFavorite ? t('surfaces.removeFromFavorites', { default: 'إزالة من المفضلة' }) : t('surfaces.addToFavorites', { default: 'إضافة إلى المفضلة' })}
              accessibilityRole="button"
            >
              <Text style={styles.favoriteIcon}>
                {isFavorite ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* العنوان — أبرز عنصر */}
      <Text style={[styles.jobTitle, textAlignStart]} numberOfLines={2}>
        {job.title}
      </Text>

      {/* التقييم (نجومات) عند توفرها */}
      {job.rating != null && (
        <View style={[styles.ratingRow, { direction: layoutDirection }]}>
          <Text style={styles.ratingStars}>
            {'★'.repeat(Math.min(5, Math.round(job.rating)))}
            {'☆'.repeat(5 - Math.min(5, Math.round(job.rating)))}
          </Text>
          <Text style={styles.ratingValue}>
            {Number(job.rating).toFixed(1)}
          </Text>
        </View>
      )}

      {/* الموقع والمسافة — سطر مستقل لتفادي التداخل مع المبلغ */}
      <View style={[styles.locationRow, { direction: layoutDirection }]}>
        <Text style={styles.essentialIcon}>📍</Text>
        <Text style={[styles.locationText, textAlignStart]} numberOfLines={1}>
          {job.location || t('surfaces.unspecified')}
          {job.distance != null && (
            <Text style={styles.distanceText}>
              {' · '}
              {job.distance < 1
                ? t('surfaces.distanceNearKm', { km: (job.distance || 0).toFixed(1) })
                : t('surfaces.distanceKm', { km: String(Math.round(job.distance)) })}
            </Text>
          )}
        </Text>
      </View>
      {/* الأجر — سطر مستقل */}
      <View style={[styles.salaryRow, { direction: layoutDirection }]}>
        <Text style={styles.salaryLabel}>💰</Text>
        <Text style={[styles.salaryAmount, textAlignStart]} numberOfLines={1}>
          {formatWage(job.salary)}
        </Text>
      </View>

      {/* زر التقديم السريع — بارز جداً */}
      {onApply && (
        <TouchableOpacity
          style={[
            styles.quickApplyButton,
            isProcessing && styles.quickApplyButtonDisabled,
            { direction: layoutDirection },
          ]}
          onPress={event => {
            event.stopPropagation();
            if (!isProcessing) {
              onApply();
            }
          }}
          activeOpacity={0.8}
          disabled={isProcessing}
          accessibilityLabel={isProcessing ? t('surfaces.applyingLabel') : t('surfaces.quickApplyLabel')}
          accessibilityRole="button"
        >
          <Text style={styles.quickApplyIcon}>⚡</Text>
          <Text style={styles.quickApplyText}>
            {isProcessing ? t('surfaces.applyingLabel') : t('surfaces.quickApplyLabel')}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.xl,
    padding: BTHWANI_SPACING.contentH,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    ...elevation.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  cardProcessing: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  jobTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
    gap: BTHWANI_SPACING.xs,
  },
  jobTypeIcon: {
    fontSize: 16,
  },
  jobTypeText: {
    fontSize: 11,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
  },
  timestamp: {
    fontSize: 11,
    color: semanticRoles.textMuted,
    fontWeight: '500',
  },
  favoriteButton: {
    padding: BTHWANI_SPACING.xs,
  },
  favoriteIcon: {
    fontSize: 18,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
    lineHeight: 28,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
    marginBottom: BTHWANI_SPACING.sm,
    alignSelf: 'flex-end',
  },
  ratingStars: {
    fontSize: 14,
    color: semanticRoles.warning || colorTokens.warning?.[500],
    letterSpacing: 1,
  },
  ratingValue: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.textMuted,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
    paddingVertical: BTHWANI_SPACING.xs,
    borderBlockStartWidth: 1,
    borderColor: semanticRoles.border,
    minHeight: 0,
  },
  essentialIcon: {
    fontSize: 16,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  distanceText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    fontWeight: '400',
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    backgroundColor: semanticRoles.primaryCTA + '15',
    borderRadius: BTHWANI_RADIUS.md,
    borderBlockEndWidth: 1,
    borderColor: semanticRoles.border,
  },
  salaryLabel: {
    fontSize: 16,
  },
  salaryAmount: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  quickApplyButton: {
    backgroundColor: semanticRoles.primaryCTA,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    gap: BTHWANI_SPACING.sm,
  },
  quickApplyButtonDisabled: {
    opacity: 0.6,
  },
  quickApplyIcon: {
    fontSize: 18,
  },
  quickApplyText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '700',
  },
});
