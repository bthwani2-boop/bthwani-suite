/**
 * MRF Critical Report Popup
 * Based on ESF CriticalRequestPopup design
 * §UX-SUPREME-001: Shows only for critical reports (<2km + high urgency)
 * 
 * Features:
 * - Appears only once per report
 * - Easy to dismiss
 * - Quick claim action
 * - Non-intrusive design
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_TYPOGRAPHY } from '@bthwani/ui-kit';
import { useMrfAdaptiveLayout } from './_mrfAdaptive';
import type { MrfReport } from './MrfSwipeableCard';

interface MrfCriticalReportPopupProps {
  visible: boolean;
  report: MrfReport | null;
  onClaim: (report: MrfReport) => void;
  onDismiss: () => void;
}

export const MrfCriticalReportPopup: React.FC<MrfCriticalReportPopupProps> = ({
  visible,
  report,
  onClaim,
  onDismiss,
}) => {
  const { isRTL } = useI18n();
  const { width: screenWidth } = useMrfAdaptiveLayout();
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && report) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenWidth,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, report, screenWidth, slideAnim, opacityAnim]);

  if (!visible || !report) return null;

  const handleClaim = () => {
    onClaim(report);
    onDismiss();
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

  return (
    <Animated.View
      style={[
        styles.backdrop,
        {
          opacity: opacityAnim,
        },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <Animated.View
        style={[
          styles.popup,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.reportTypeBadge, { backgroundColor: semanticRoles.stateError.icon }]}>
              <Text style={styles.reportTypeIcon}>{getReportTypeIcon(report.reportType)}</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.title}>بلاغ عاجل قريب منك!</Text>
              <Text style={styles.subtitle}>
                {getReportTypeText(report.reportType)} • {report.distance?.toFixed(1)} كم
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onDismiss}
              hitSlop={{ top: 10, bottom: 10, [isRTL ? 'right' : 'left']: 10, [isRTL ? 'left' : 'right']: 10 }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.details}>
            <Text style={styles.reportTitle}>{report.title}</Text>
            <Text style={styles.reportLocation}>📍 {report.location}</Text>
            <Text style={styles.reportTime}>{report.timestamp}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={onDismiss}
            >
              <Text style={styles.dismissButtonText}>تجاهل</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.claimButton}
              onPress={handleClaim}
            >
              <Text style={styles.claimButtonText}>✓ مطالبة الآن</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    bottom: 0,
    backgroundColor: 'BTHWANI_COLORS.overlayLight',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: semanticRoles.surface,
    borderTopLeftRadius: BTHWANI_RADIUS.xl,
    borderTopRightRadius: BTHWANI_RADIUS.xl,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.xl * 2,
  },
  content: {
    padding: BTHWANI_SPACING.contentH,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.md,
  },
  reportTypeBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  title: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.lg,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  closeButtonText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.lg,
    color: semanticRoles.text,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  details: {
    marginBottom: BTHWANI_SPACING.md,
    paddingTop: BTHWANI_SPACING.md,
    borderBlockStartWidth: 1,
    borderBlockStartColor: semanticRoles.border,
  },
  reportTitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  reportLocation: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  reportTime: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    color: semanticRoles.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
    marginTop: BTHWANI_SPACING.md,
  },
  dismissButton: {
    flex: 1,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissButtonText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
  },
  claimButton: {
    flex: 2,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.stateSuccess.icon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimButtonText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
    color: semanticRoles.surface,
  },
});
