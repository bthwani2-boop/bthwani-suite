// Auto-generated screen for wlt_refund_get
// Surface: app-client | Service: wlt
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildRefundMock, type RefundDetail } from '../../fixtures/refund';

interface auto_wlt_refund_getProps {
  refundId?: string;
  
}

export const auto_wlt_refund_get: React.FC<auto_wlt_refund_getProps> = (props) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('loading');
  const [refund, setRefund] = useState<RefundDetail | null>(null);

  useEffect(() => {
    // Backend integration call
    const loadRefund = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockRefund = buildRefundMock(t);

        setRefund(mockRefund);
        setState('content');
      } catch (error) {
        setState('error');
      }
    };

    loadRefund();
  }, []);

  const getStatusColor = (status: RefundDetail['status']) => {
    switch (status) {
      case 'completed': return BTHWANI_COLORS.success;
      case 'processing': return BTHWANI_COLORS.warning;
      case 'pending': return BTHWANI_COLORS.info;
      case 'failed': return BTHWANI_COLORS.error;
      default: return BTHWANI_COLORS.onSurfaceMuted;
    }
  };

  const getStatusText = (status: RefundDetail['status']) => {
    switch (status) {
      case 'completed': return t('surfaces.مكتملة');
      case 'processing': return t('surfaces.قيد_المعالجة');
      case 'pending': return 'في الانتظار';
      case 'failed': return t('surfaces.فاشلة');
      default: return status;
    }
  };

  const renderContent = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>تفاصيل الاسترداد</Text>

      {/* Refund Overview */}
      <View style={styles.overviewCard}>
        <View style={styles.headerRow}>
          <Text style={styles.reference}>{refund?.reference}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(refund!.status) }]}>
            <Text style={styles.statusText}>{getStatusText(refund!.status)}</Text>
          </View>
        </View>

        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>مبلغ الاسترداد</Text>
          <Text style={styles.amountValue}>
            {refund?.amount.toLocaleString()} {refund?.currency}
          </Text>
        </View>

        <Text style={styles.reasonLabel}>سبب الاسترداد:</Text>
        <Text style={styles.reasonText}>{refund?.reason}</Text>
      </View>

      {/* Original Transaction */}
      <View style={styles.transactionCard}>
        <Text style={styles.sectionTitle}>المعاملة الأصلية</Text>

        <View style={styles.transactionInfo}>
          <Text style={styles.transactionId}>رقم المعاملة: {refund?.originalTransaction.id}</Text>
          <Text style={styles.transactionDescription}>{refund?.originalTransaction.description}</Text>
          <Text style={styles.transactionDate}>
            التاريخ: {new Date(refund?.originalTransaction.date || '').toLocaleString('ar-SA')}
          </Text>
          <Text style={styles.transactionAmount}>
            المبلغ: {refund?.originalTransaction.amount.toLocaleString()} {refund?.currency}
          </Text>
        </View>
      </View>

      {/* Refund Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>تفاصيل الاسترداد</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>تاريخ الطلب:</Text>
          <Text style={[styles.detailValue, textAlignStart]}>
            {new Date(refund?.requestedAt || '').toLocaleString('ar-SA')}
          </Text>
        </View>

        {refund?.processedAt && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>تاريخ المعالجة:</Text>
            <Text style={[styles.detailValue, textAlignStart]}>
              {new Date(refund.processedAt).toLocaleString('ar-SA')}
            </Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>طريقة الاسترداد:</Text>
          <Text style={[styles.detailValue, textAlignStart]}>{refund?.refundMethod}</Text>
        </View>

        {refund?.estimatedCompletion && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>الانتهاء المتوقع:</Text>
            <Text style={[styles.detailValue, textAlignStart]}>
              {new Date(refund.estimatedCompletion).toLocaleString('ar-SA')}
            </Text>
          </View>
        )}
      </View>

      {/* Notes */}
      {refund?.notes && (
        <View style={styles.notesCard}>
          <Text style={styles.sectionTitle}>ملاحظات</Text>
          <Text style={styles.notesText}>{refund.notes}</Text>
        </View>
      )}

      {/* Timeline */}
      <View style={styles.timelineCard}>
        <Text style={styles.sectionTitle}>الوقت الزمني</Text>

        <View style={styles.timelineItem}>
          <View style={styles.timelineDot} />
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>تم طلب الاسترداد</Text>
            <Text style={styles.timelineTime}>
              {new Date(refund?.requestedAt || '').toLocaleString('ar-SA')}
            </Text>
          </View>
        </View>

        {refund?.processedAt && (
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotCompleted]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>تمت المعالجة</Text>
              <Text style={styles.timelineTime}>
                {new Date(refund.processedAt).toLocaleString('ar-SA')}
              </Text>
            </View>
          </View>
        )}

        {refund?.status === 'completed' && (
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotCompleted]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>تم إكمال الاسترداد</Text>
              <Text style={styles.timelineTime}>
                المبلغ متاح في المحفظة
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Actions */}
      {refund?.status === 'completed' && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.downloadButton}>
            <Text style={styles.downloadButtonText}>تحميل إيصال الاسترداد</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>تواصل مع الدعم</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.policyNote}>
        <Text style={styles.policyNoteText}>
          📋 جميع الاستردادات تخضع لسياسة الاسترداد والشروط والأحكام
        </Text>
      </View>
    </ScrollView>
  );

  return (
    <ScreenWrapper
      state={state}
      onErrorAction={() => {
        setState('loading');
        setTimeout(() => setState('content'), 1500);
      }}
    >
      {renderContent()}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
    marginTop: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.lg,
  },
  overviewCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: BTHWANI_COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  reference: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: BTHWANI_COLORS.onPrimary,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  amountLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.success,
  },
  reasonLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  reasonText: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurface,
    fontWeight: '500',
  },
  transactionCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  transactionInfo: {
    backgroundColor: BTHWANI_COLORS.surfaceVariant,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
  },
  transactionId: {
    fontSize: 14,
    fontWeight: '500',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  transactionDescription: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  transactionDate: {
    fontSize: 13,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.primary,
  },
  detailsCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  detailLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  detailValue: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    fontWeight: '500',
    flex: 1,
    marginStart: BTHWANI_SPACING.md,
  },
  notesCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  notesText: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    lineHeight: 20,
  },
  timelineCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: BTHWANI_COLORS.outline,
    marginEnd: BTHWANI_SPACING.md,
    marginTop: 4,
  },
  timelineDotCompleted: {
    backgroundColor: BTHWANI_COLORS.success,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  timelineTime: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  actionsContainer: {
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  downloadButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  contactButton: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.outline,
  },
  contactButtonText: {
    color: BTHWANI_COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  policyNote: {
    backgroundColor: BTHWANI_COLORS.infoContainer,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.xl,
  },
  policyNoteText: {
    fontSize: 14,
    color: BTHWANI_COLORS.onInfoContainer,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default auto_wlt_refund_get;

