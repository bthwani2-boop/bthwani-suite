// Auto-generated screen for wlt_transfer_get
// Surface: app-client | Service: wlt
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { loadMockWalletTransfer, WalletTransfer } from '../../fixtures/transfer';

interface auto_wlt_transfer_getProps {
  
}

export const auto_wlt_transfer_get: React.FC<auto_wlt_transfer_getProps> = (props) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');
  const [transfer, setTransfer] = useState<WalletTransfer | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await loadMockWalletTransfer();
        setTransfer(result.transfer);
        setState(result.state);
      } catch {
        setTransfer(null);
        setState('error');
      }
    };

    void load();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTransfer(null);
    void (async () => {
      try {
        const result = await loadMockWalletTransfer();
        setTransfer(result.transfer);
        setState(result.state);
      } catch {
        setTransfer(null);
        setState('error');
      }
    })();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return colorTokens.warning['500'];
      case 'processing': return colorTokens.primary['500'];
      case 'completed': return colorTokens.success['600'];
      case 'failed': return colorTokens.error['500'];
      case 'cancelled': return colorTokens.neutral['500'];
      default: return BTHWANI_COLORS.onSurfaceMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'processing': return 'قيد المعالجة';
      case 'completed': return 'مكتمل';
      case 'failed': return 'فاشل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'incoming' ? '📈' : '📉';
  };

  const getTypeText = (type: string) => {
    return type === 'incoming' ? t('surfaces.وارد') : t('surfaces.صادر');
  };

  if (state === 'content' && transfer) {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <Text style={styles.title}>تفاصيل التحويل</Text>
          <Text style={styles.transferId}>{transfer.id}</Text>

          <View style={styles.amountCard}>
            <View style={[styles.amountHeader, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.amountIcon}>{getTypeIcon(transfer.type)}</Text>
              <Text style={styles.amountLabel}>{getTypeText(transfer.type)}</Text>
            </View>
            <Text style={styles.amountValue}>
              {transfer.type === 'incoming' ? '+' : '-'}
              {transfer.amount} {transfer.currency}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transfer.status) }]}>
              <Text style={styles.statusText}>{getStatusText(transfer.status)}</Text>
            </View>
          </View>

          <View style={styles.recipientCard}>
            <Text style={styles.sectionTitle}>المستلم</Text>
            <View style={styles.recipientInfo}>
              <Text style={styles.recipientName}>👤 {transfer.recipient.name}</Text>
              <Text style={styles.recipientPhone}>📞 {transfer.recipient.phone}</Text>
              <Text style={styles.recipientMethod}>💳 {transfer.recipient.method}</Text>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>تفاصيل التحويل</Text>
            <View style={[styles.detailRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.detailLabel}>المبلغ المرسل:</Text>
              <Text style={styles.detailValue}>
                {transfer.amount} {transfer.currency}
              </Text>
            </View>
            <View style={[styles.detailRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.detailLabel}>رسوم التحويل:</Text>
              <Text style={styles.detailValue}>
                {transfer.fees.transferFee === 0
                  ? 'مجاني'
                  : `${transfer.fees.transferFee} ${transfer.currency}`}
              </Text>
            </View>
            <View style={[styles.detailRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.detailLabel}>المبلغ المخصوم:</Text>
              <Text style={styles.detailValue}>
                {transfer.fees.totalDeducted} {transfer.currency}
              </Text>
            </View>
          </View>

          <View style={styles.timingCard}>
            <Text style={styles.sectionTitle}>التوقيت</Text>
            <View style={styles.timingRow}>
              <Text style={styles.timingLabel}>تم الطلب في:</Text>
              <Text style={styles.timingValue}>{transfer.timing.initiatedAt}</Text>
            </View>
            <View style={styles.timingRow}>
              <Text style={styles.timingLabel}>تم التنفيذ في:</Text>
              <Text style={styles.timingValue}>{transfer.timing.completedAt}</Text>
            </View>
            <View style={styles.timingRow}>
              <Text style={styles.timingLabel}>وقت المعالجة:</Text>
              <Text style={styles.timingValue}>{transfer.timing.processingTime}</Text>
            </View>
          </View>

          <View style={styles.referenceCard}>
            <Text style={styles.sectionTitle}>معلومات إضافية</Text>
            <View style={styles.referenceRow}>
              <Text style={styles.referenceLabel}>رقم المرجع:</Text>
              <Text style={styles.referenceValue}>{transfer.reference}</Text>
            </View>
            {transfer.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionLabel}>الوصف:</Text>
                <Text style={styles.descriptionText}>{transfer.description}</Text>
              </View>
            )}
          </View>

          <View style={[styles.securityBanner, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.securityIcon}>🔒</Text>
            <Text style={styles.securityText}>
              جميع التحويلات محمية بتشفير 256-bit ويمكن تتبعها
            </Text>
          </View>

          <TouchableOpacity style={styles.receiptButton}>
            <Text style={styles.receiptText}>تحميل الإيصال</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportText}>تواصل مع الدعم</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_تفاصيل_التحويل')}
      errorMessage={t('surfaces.فشل_في_تحميل_تفاصيل_التحويل')}
      onErrorAction={handleRetry}
      screenName="auto_wlt_transfer_get"
      operationName="wlt_transfer_get"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  transferId: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  amountCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  amountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  amountIcon: {
    fontSize: 24,
    marginEnd: BTHWANI_SPACING.sm,
  },
  amountLabel: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '700',
    color: BTHWANI_COLORS.primary,
    marginBottom: BTHWANI_SPACING.md,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  recipientCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  recipientInfo: {
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  recipientPhone: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  recipientMethod: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  detailsCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  },
  timingCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timingRow: {
    marginBottom: BTHWANI_SPACING.sm,
  },
  timingLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  timingValue: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    fontWeight: '500',
  },
  referenceCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  referenceRow: {
    marginBottom: BTHWANI_SPACING.md,
  },
  referenceLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  referenceValue: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurface,
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  descriptionContainer: {
    borderTopWidth: 1,
    borderTopColor: BTHWANI_COLORS.outline,
    paddingTop: BTHWANI_SPACING.md,
  },
  descriptionLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  descriptionText: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    lineHeight: 20,
  },
  securityBanner: {
    backgroundColor: colorTokens.primary['50'],
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colorTokens.primary['500'],
  },
  securityIcon: {
    fontSize: 20,
    marginEnd: BTHWANI_SPACING.md,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    color: colorTokens.primary['800'],
    fontWeight: '600',
  },
  receiptButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  receiptText: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  supportButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: BTHWANI_COLORS.primary,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  supportText: {
    color: BTHWANI_COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_wlt_transfer_get;

