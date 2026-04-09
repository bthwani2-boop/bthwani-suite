/**
 * SND Interest Mini Details Sheet
 * §UX-SUPREME-001: Compact request summary with one clear follow-up action
 *
 * Features:
 * - Compact details view
 * - Primary action: View Full
 * - Swipe-down to close
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SndBottomSheet } from './SndBottomSheet';
import { semanticRoles } from '@bthwani/ui-kit';
import { useDirection } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
  BTHWANI_BORDER,
} from '@bthwani/ui-kit';
import { typography } from '@bthwani/ui-kit';
import { sndScrollContentContainerStyle } from './_sndSheetLayout';
import {
  SND_INTERACTIVE_HIT_SLOP,
  SND_MIN_TOUCH_TARGET,
} from '../sndAccessibility';

const SND_NEUTRAL_SURFACE = '#f5f7fa';
const SND_NEUTRAL_BORDER = '#d8e3ef';

function getServiceMark(label?: string | null) {
  const normalized = label?.trim();
  return normalized ? normalized.charAt(0) : 'س';
}

export interface SndInterest {
  id: string;
  requestId: string;
  serviceType: string;
  serviceName: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  location?: string;
  preferredTime?: string;
  urgency?: 'low' | 'medium' | 'high';
  contactMethod?: 'phone' | 'whatsapp' | 'in_app';
  contactInfo?: string;
  budget?: string;
  timeline?: string;
  createdAt: string;
  updatedAt?: string;
}

interface SndInterestMiniDetailsSheetProps {
  visible: boolean;
  onClose: () => void;
  interest: SndInterest | null;
  onViewFull?: (interest: SndInterest) => void;
}

export const SndInterestMiniDetailsSheet: React.FC<
  SndInterestMiniDetailsSheetProps
> = ({ visible, onClose, interest, onViewFull }) => {
  const { textAlignStartStyle, t } = useDirection();
  if (!interest) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return semanticRoles.stateWarning.icon;
      case 'in_progress':
        return semanticRoles.stateInfo.icon;
      case 'completed':
        return semanticRoles.stateSuccess.icon;
      case 'cancelled':
        return semanticRoles.stateError.icon;
      default:
        return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          t('surfaces.snd.interestminidetailssheet.l65_ar_1') ||
          'قيد الانتظار (اهتمام)'
        );
      case 'in_progress':
        return (
          t('surfaces.snd.interestminidetailssheet.l66_ar_1') || 'جاري المعالجة'
        );
      case 'completed':
        return t('surfaces.snd.interestminidetailssheet.l67_ar_1') || 'مكتمل';
      case 'cancelled':
        return t('surfaces.snd.interestminidetailssheet.l68_ar_1') || 'ملغي';
      default:
        return status;
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'low':
        return semanticRoles.stateSuccess.icon;
      case 'medium':
        return semanticRoles.stateWarning.icon;
      case 'high':
        return semanticRoles.stateError.icon;
      default:
        return semanticRoles.textMuted;
    }
  };

  const getUrgencyText = (urgency?: string) => {
    switch (urgency) {
      case 'low':
        return 'منخفض';
      case 'medium':
        return 'متوسط';
      case 'high':
        return 'عالي';
      default:
        return t('surfaces.snd.interestminidetailssheet.l87_ar_1');
    }
  };

  const getContactMethodMeta = (
    contactMethod?: SndInterest['contactMethod']
  ) => {
    switch (contactMethod) {
      case 'in_app':
        return { icon: '💬', label: 'داخل التطبيق' };
      case 'whatsapp':
        return { icon: '📱', label: 'واتساب' };
      case 'phone':
        return { icon: '☎️', label: 'اتصال هاتفي' };
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
      if (diffMinutes < 1)
        return t('surfaces.snd.interestminidetailssheet.l97_ar_1');
      if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
      if (diffMinutes < 1440) return `منذ ${Math.floor(diffMinutes / 60)} ساعة`;
      return `منذ ${Math.floor(diffMinutes / 1440)} يوم`;
    } catch {
      return timestamp;
    }
  };

  return (
    <SndBottomSheet
      visible={visible}
      onClose={onClose}
      height='large'
      title={`طلب سند #${interest.requestId}`}
      showHandle={true}
      enableSwipeDown={true}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={sndScrollContentContainerStyle}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.statusSection,
            {
              backgroundColor: SND_NEUTRAL_SURFACE,
              borderColor: SND_NEUTRAL_BORDER,
            },
          ]}
        >
          <View style={styles.statusHeroRow}>
            <View
              style={[
                styles.statusHeroIconOrb,
                {
                  backgroundColor: '#ffffff',
                  borderColor: SND_NEUTRAL_BORDER,
                },
              ]}
            >
              <Text style={{ fontSize: 13, fontWeight: '700' }}>
                {getServiceMark(interest.serviceName || interest.serviceType)}
              </Text>
            </View>

            <View style={styles.statusHeroCopy}>
              <Text style={[styles.statusHeroEyebrow, textAlignStartStyle]}>
                ملخص الطلب
              </Text>
              <Text style={[styles.statusHeroTitle, textAlignStartStyle]}>
                {interest.serviceName || interest.serviceType}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(interest.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(interest.status)}
              </Text>
            </View>
          </View>
          <Text style={[styles.timestamp, textAlignStartStyle]}>
            آخر تحديث:{' '}
            {formatTimestamp(interest.updatedAt || interest.createdAt)}
          </Text>
        </View>

        {/* Service Type */}
        <View style={styles.section}>
          <Text style={[styles.label, textAlignStartStyle]}>
            {t('surfaces.snd.interestminidetailssheet.l126_ar_1')}
          </Text>
          <Text style={[styles.value, textAlignStartStyle]}>
            {interest.serviceName || interest.serviceType}
          </Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.label, textAlignStartStyle]}>
            {t('surfaces.snd.interestminidetailssheet.l132_ar_1')}
          </Text>
          <Text style={[styles.description, textAlignStartStyle]}>
            {interest.description}
          </Text>
        </View>

        {/* Location */}
        {interest.location && (
          <View style={styles.section}>
            <Text style={[styles.label, textAlignStartStyle]}>
              {t('surfaces.snd.interestminidetailssheet.l139_ar_1')}
            </Text>
            <Text style={[styles.value, textAlignStartStyle]}>
              {interest.location}
            </Text>
          </View>
        )}

        {/* Urgency */}
        {interest.urgency && (
          <View style={styles.section}>
            <Text style={[styles.label, textAlignStartStyle]}>
              {t('surfaces.snd.interestminidetailssheet.l147_ar_1')}
            </Text>
            <View
              style={[
                styles.urgencyBadge,
                { backgroundColor: getUrgencyColor(interest.urgency) },
              ]}
            >
              <Text style={styles.urgencyText}>
                {getUrgencyText(interest.urgency)}
              </Text>
            </View>
          </View>
        )}

        {/* Contact Info */}
        {interest.contactMethod && (
          <View style={styles.section}>
            {(() => {
              const contactMethodMeta = getContactMethodMeta(
                interest.contactMethod
              );

              if (!contactMethodMeta) {
                return null;
              }

              return (
                <>
                  <Text style={[styles.label, textAlignStartStyle]}>
                    {contactMethodMeta.icon} وسيلة التواصل
                  </Text>
                  <Text style={[styles.value, textAlignStartStyle]}>
                    {contactMethodMeta.label}
                    {interest.contactInfo && ` - ${interest.contactInfo}`}
                  </Text>
                </>
              );
            })()}
          </View>
        )}

        {/* Budget */}
        {interest.budget && (
          <View style={styles.section}>
            <Text style={[styles.label, textAlignStartStyle]}>
              {t('surfaces.snd.interestminidetailssheet.l170_ar_1')}
            </Text>
            <Text style={[styles.value, textAlignStartStyle]}>
              {interest.budget}
            </Text>
          </View>
        )}

        {/* Timeline */}
        {interest.timeline && (
          <View style={styles.section}>
            <Text style={[styles.label, textAlignStartStyle]}>
              {t('surfaces.snd.interestminidetailssheet.l178_ar_1')}
            </Text>
            <Text style={[styles.value, textAlignStartStyle]}>
              {interest.timeline}
            </Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {onViewFull && (
            <TouchableOpacity
              style={[styles.actionButton, styles.viewButton]}
              onPress={() => {
                onViewFull(interest);
                onClose();
              }}
              accessibilityRole='button'
              accessibilityLabel='فتح الطلب الكامل'
              accessibilityHint='ينقلك إلى شاشة التفاصيل الكاملة لهذا الطلب'
              hitSlop={SND_INTERACTIVE_HIT_SLOP}
              activeOpacity={0.7}
            >
              <Text style={styles.viewButtonText}>فتح الطلب الكامل</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SndBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusSection: {
    borderRadius: BTHWANI_RADIUS.xl,
    borderWidth: BTHWANI_BORDER.hairline,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
  },
  statusHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  statusHeroIconOrb: {
    width: 44,
    height: 44,
    borderRadius: BTHWANI_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: BTHWANI_BORDER.hairline,
  },
  statusHeroCopy: {
    flex: 1,
  },
  statusHeroEyebrow: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#47617c',
  },
  statusHeroTitle: {
    marginTop: 2,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: '#163760',
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
  },
  statusText: {
    color: semanticRoles.surface,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  timestamp: {
    marginTop: BTHWANI_SPACING.sm,
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
  },
  section: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  value: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: semanticRoles.text,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: semanticRoles.text,
    lineHeight: typography.lineHeightPx.md,
  },
  urgencyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  urgencyText: {
    color: semanticRoles.surface,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  actions: {
    marginTop: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.xl,
    gap: BTHWANI_SPACING.md,
  },
  actionButton: {
    borderRadius: BTHWANI_RADIUS.md,
    minHeight: SND_MIN_TOUCH_TARGET,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButton: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  viewButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
});
