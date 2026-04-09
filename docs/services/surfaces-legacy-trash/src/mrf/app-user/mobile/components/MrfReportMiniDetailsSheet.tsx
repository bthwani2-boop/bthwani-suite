/**
 * MRF Report Mini Details Sheet
 * Based on ESF RequestMiniDetailsSheet design
 * §UX-SUPREME-001: Quick details view, 1-click claim
 * 
 * Features:
 * - Compact details view
 * - Primary action: Claim
 * - Secondary action: View Full
 * - Swipe-down to close
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { MrfBottomSheet } from './MrfBottomSheet';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_TYPOGRAPHY } from '@bthwani/ui-kit';
import type { MrfReport } from './MrfSwipeableCard';

interface MrfReportMiniDetailsSheetProps {
  visible: boolean;
  onClose: () => void;
  report: MrfReport | null;
  onClaim?: (report: MrfReport) => void;
  onViewFull?: (report: MrfReport) => void;
}

export const MrfReportMiniDetailsSheet: React.FC<MrfReportMiniDetailsSheetProps> = ({
  visible,
  onClose,
  report,
  onClaim,
  onViewFull,
}) => {
  const { isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);

  if (!report) return null;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return semanticRoles.stateSuccess.icon;
      case 'medium': return semanticRoles.stateWarning.icon;
      case 'high': return semanticRoles.stateError.icon;
      default: return semanticRoles.textMuted;
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'منخفض';
      case 'medium': return 'متوسط';
      case 'high': return 'عالي';
      default: return urgency;
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'missing': return '🔍';
      case 'found': return '✅';
      default: return '📋';
    }
  };

  const getReportTypeText = (type: string) => {
    switch (type) {
      case 'missing': return 'مفقود';
      case 'found': return 'تم العثور عليه';
      default: return type;
    }
  };

  const handleClaim = () => {
    if (onClaim) {
      onClaim(report);
      onClose();
    }
  };

  const handleViewFull = () => {
    if (onViewFull) {
      onViewFull(report);
      onClose();
    }
  };

  const handleDirections = () => {
    // Open maps with location (if coordinates available)
    // For now, just show alert
    // In production, use actual coordinates
  };

  return (
    <MrfBottomSheet
      visible={visible}
      onClose={onClose}
      height="medium"
      title={`بلاغ ${report.id}`}
      showHandle={true}
      enableSwipeDown={true}
    >
      <View style={styles.container}>
        {/* Report Type Badge */}
        <View style={styles.header}>
          <View
            style={[
              styles.reportTypeBadge,
              { backgroundColor: getUrgencyColor(report.urgency) },
            ]}
          >
            <Text style={styles.reportTypeIcon}>{getReportTypeIcon(report.reportType)}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.reportTitle}>{report.title}</Text>
            <View
              style={[
                styles.urgencyBadge,
                { backgroundColor: getUrgencyColor(report.urgency) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.urgencyText,
                  { color: getUrgencyColor(report.urgency) },
                ]}
              >
                {getUrgencyText(report.urgency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>النوع:</Text>
            <Text style={[styles.detailValue, textAlignStart]}>{getReportTypeText(report.reportType)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>الموقع:</Text>
            <Text style={[styles.detailValue, textAlignStart]}>{report.location}</Text>
          </View>
          {report.distance !== undefined && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>المسافة:</Text>
              <Text style={[styles.detailValue, textAlignStart]}>{report.distance.toFixed(1)} كم</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>الوقت:</Text>
            <Text style={[styles.detailValue, textAlignStart]}>{report.timestamp}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {onClaim && report.status === 'active' && (
            <TouchableOpacity
              style={styles.claimButton}
              onPress={handleClaim}
            >
              <Text style={styles.claimButtonText}>✓ مطالبة</Text>
            </TouchableOpacity>
          )}
          {onViewFull && (
            <TouchableOpacity
              style={styles.viewFullButton}
              onPress={handleViewFull}
            >
              <Text style={styles.viewFullButtonText}>عرض التفاصيل الكاملة</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </MrfBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.md,
  },
  reportTypeBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  reportTypeIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['2xl'],
  },
  headerInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.lg,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  urgencyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  urgencyText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
  },
  details: {
    marginBottom: BTHWANI_SPACING.md,
    paddingTop: BTHWANI_SPACING.md,
    borderBlockStartWidth: 1,
    borderBlockStartColor: semanticRoles.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  detailLabel: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  detailValue: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.text,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.medium,
    flex: 1,
  },
  actions: {
    gap: BTHWANI_SPACING.sm,
    marginTop: BTHWANI_SPACING.md,
  },
  claimButton: {
    backgroundColor: semanticRoles.stateSuccess.icon,
    borderRadius: BTHWANI_RADIUS.md,
    paddingVertical: BTHWANI_SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimButtonText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
  },
  viewFullButton: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    paddingVertical: BTHWANI_SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  viewFullButtonText: {
    color: semanticRoles.text,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
});
