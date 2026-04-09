// SHEIN Proxy Request Approve Screen – App Client Mobile
// Surface: app-client | Service: dsh
// Customer screen to approve or reject the offer

import React, { useState, useEffect } from 'react';
import { rawFetch } from '@bthwani/api-clients';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ScreenWrapper } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING } from '@bthwani/ui-kit';

interface Offer {
  offerId: string;
  productTitle: string;
  finalPrice: number;
  shippingCost: number;
  serviceFee: number;
  currency: string;
  offerNotes: string;
  attachments: string[];
  createdAt: string;
}

interface Props {
  route?: { params?: { requestId: string } };
  navigation?: { goBack: () => void; navigate: (screen: string) => void };
}

export const SheinApprovalScreen: React.FC<Props> = ({ route, navigation }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [state, setState] = useState<'loading' | 'content' | 'error'>(
    'loading'
  );
  const [offer, setOffer] = useState<Offer | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const requestId = route?.params?.requestId || 'SR-001';

  useEffect(() => {
    loadOffer();
  }, [requestId]);

  const loadOffer = async () => {
    try {
      setState('loading');
      let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
      if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
      const url = `${baseUrl}/api/dsh/proxy-request/${encodeURIComponent(requestId)}`;
      const response = await rawFetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      if (!json?.success || !json?.data)
        throw new Error(json?.error || 'Failed to load');
      const d = json.data;
      if (!d.offer && !d.pricing)
        throw new Error('لم يتم إرسال عرض لهذا الطلب بعد');
      const off: Offer = {
        offerId: '',
        productTitle: d.offer?.productTitle || '',
        finalPrice: d.offer?.finalPrice ?? d.pricing?.finalPrice ?? 0,
        shippingCost: d.pricing?.shippingCost ?? 0,
        serviceFee: d.pricing?.serviceFee ?? 0,
        currency: d.offer?.currency ?? d.pricing?.currency ?? 'USD',
        offerNotes: d.offer?.offerNotes || '',
        attachments: d.offer?.attachments || [],
        createdAt: d.updatedAt || d.createdAt,
      };
      setOffer(off);
      setState('content');
    } catch (error) {
      console.error('Failed to load offer:', error);
      setState('error');
    }
  };

  const handleApprove = async () => {
    Alert.alert(
      t(
        'dsh.app-client.mobile.auto_dsh_proxy_request_approve.confirmApproveTitle'
      ),
      t(
        'dsh.app-client.mobile.auto_dsh_proxy_request_approve.confirmApproveMessage'
      ),
      [
        {
          text: t(
            'dsh.app-client.mobile.auto_dsh_proxy_request_approve.cancelButton'
          ),
          style: 'cancel',
        },
        {
          text: t(
            'dsh.app-client.mobile.auto_dsh_proxy_request_approve.okButton'
          ),
          onPress: async () => {
            setSubmitting(true);
            try {
              let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(
                /\/+$/,
                ''
              );
              if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
              const res = await rawFetch(
                `${baseUrl}/api/dsh/proxy-request/${encodeURIComponent(requestId)}/approve`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                }
              );
              const data = await res.json();
              if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
              Alert.alert(
                t(
                  'dsh.app-client.mobile.auto_dsh_proxy_request_approve.successTitle'
                ),
                t(
                  'dsh.app-client.mobile.auto_dsh_proxy_request_approve.approveSuccess'
                ),
                [
                  {
                    text: t(
                      'dsh.app-client.mobile.auto_dsh_proxy_request_approve.okButtonAlt'
                    ),
                    onPress: () =>
                      (
                        navigation?.navigate as (s: string, p?: object) => void
                      )?.('auto_dsh_proxy_request_tracking', { requestId }),
                  },
                ]
              );
            } catch (error) {
              Alert.alert(
                t('common.error'),
                t(
                  'dsh.app-client.mobile.auto_dsh_proxy_request_approve.approveFailed'
                )
              );
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    Alert.alert(
      t(
        'dsh.app-client.mobile.auto_dsh_proxy_request_approve.confirmRejectTitle'
      ),
      t(
        'dsh.app-client.mobile.auto_dsh_proxy_request_approve.confirmRejectMessage'
      ),
      [
        {
          text: t(
            'dsh.app-client.mobile.auto_dsh_proxy_request_approve.cancelButtonAlt'
          ),
          style: 'cancel',
        },
        {
          text: t(
            'dsh.app-client.mobile.auto_dsh_proxy_request_approve.rejectButton'
          ),
          onPress: async () => {
            setSubmitting(true);
            try {
              let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(
                /\/+$/,
                ''
              );
              if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
              const res = await rawFetch(
                `${baseUrl}/api/dsh/proxy-request/${encodeURIComponent(requestId)}/reject`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                }
              );
              const data = await res.json();
              if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
              Alert.alert(
                t(
                  'dsh.app-client.mobile.auto_dsh_proxy_request_approve.doneTitle'
                ),
                t(
                  'dsh.app-client.mobile.auto_dsh_proxy_request_approve.rejectSuccess'
                ),
                [
                  {
                    text: t(
                      'dsh.app-client.mobile.auto_dsh_proxy_request_approve.okButtonDone'
                    ),
                    onPress: () => navigation?.goBack(),
                  },
                ]
              );
            } catch (error) {
              Alert.alert(
                t('common.error'),
                t(
                  'dsh.app-client.mobile.auto_dsh_proxy_request_approve.rejectFailed'
                )
              );
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper
        state='loading'
        screenName='SheinApprovalScreen'
        loadingMessage={t(
          'dsh.app-client.mobile.auto_dsh_proxy_request_approve.loadingMessage'
        )}
      />
    );
  }

  if (state === 'error' || !offer) {
    return (
      <ScreenWrapper
        state='error'
        screenName='SheinApprovalScreen'
        errorMessage={t(
          'dsh.app-client.mobile.auto_dsh_proxy_request_approve.errorMessage'
        )}
        onErrorAction={loadOffer}
      />
    );
  }

  return (
    <ScreenWrapper state='content' screenName='SheinApprovalScreen'>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>مراجعة العرض</Text>
          <Text style={styles.subtitle}>
            يرجى مراجعة تفاصيل العرض بعناية قبل اتخاذ قرارك
          </Text>
        </View>

        <View style={styles.offerCard}>
          <Text style={styles.productTitle}>{offer.productTitle}</Text>

          <View style={styles.priceBreakdown}>
            <View
              style={[
                styles.priceRow,
                { flexDirection: 'row', direction: layoutDirection },
              ]}
            >
              <Text style={styles.priceLabel}>سعر المنتج:</Text>
              <Text style={styles.priceValue}>
                {(
                  offer.finalPrice -
                  offer.shippingCost -
                  offer.serviceFee
                ).toFixed(2)}{' '}
                {offer.currency}
              </Text>
            </View>
            <View
              style={[
                styles.priceRow,
                { flexDirection: 'row', direction: layoutDirection },
              ]}
            >
              <Text style={styles.priceLabel}>الشحن:</Text>
              <Text style={styles.priceValue}>
                {offer.shippingCost.toFixed(2)} {offer.currency}
              </Text>
            </View>
            <View
              style={[
                styles.priceRow,
                { flexDirection: 'row', direction: layoutDirection },
              ]}
            >
              <Text style={styles.priceLabel}>رسوم الخدمة:</Text>
              <Text style={styles.priceValue}>
                {offer.serviceFee.toFixed(2)} {offer.currency}
              </Text>
            </View>
            <View
              style={[
                styles.priceRow,
                styles.totalRow,
                { flexDirection: 'row', direction: layoutDirection },
              ]}
            >
              <Text style={styles.totalLabel}>الإجمالي:</Text>
              <Text style={styles.totalValue}>
                {offer.finalPrice.toFixed(2)} {offer.currency}
              </Text>
            </View>
          </View>

          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>تفاصيل العرض:</Text>
            <Text style={styles.notesText}>{offer.offerNotes}</Text>
          </View>

          {offer.attachments && offer.attachments.length > 0 && (
            <View style={styles.attachmentsSection}>
              <Text style={styles.attachmentsLabel}>المرفقات:</Text>
              {offer.attachments.map((attachment, index) => (
                <TouchableOpacity key={index} style={styles.attachment}>
                  <Text style={styles.attachmentText}>📎 {attachment}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.dateSection}>
            <Text style={styles.dateText}>
              تاريخ العرض: {new Date(offer.createdAt).toLocaleString('ar-SA')}
            </Text>
          </View>
        </View>

        <View style={styles.importantNotes}>
          <Text style={styles.importantTitle}>معلومات مهمة:</Text>
          <Text style={styles.importantText}>
            • بالموافقة على هذا العرض، سنبدأ بشراء المنتج وشحنه فوراً • سيتم خصم
            المبلغ من حسابك عند استلام المنتج • في حالة وجود مشاكل، يمكنك
            التواصل مع خدمة العملاء • الوقت المتوقع للتسليم: 15-20 يوم
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.approveButton, submitting && styles.buttonDisabled]}
            onPress={handleApprove}
            disabled={submitting}
          >
            <Text style={styles.approveText}>
              {submitting
                ? t(
                    'dsh.app-client.mobile.auto_dsh_proxy_request_approve.processingMessage'
                  )
                : 'موافقة على العرض'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rejectButton, submitting && styles.buttonDisabled]}
            onPress={handleReject}
            disabled={submitting}
          >
            <Text style={styles.rejectText}>رفض العرض</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  header: {
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: BTHWANI_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: BTHWANI_COLORS.borderSubtle,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
  },
  offerCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    margin: BTHWANI_SPACING.lg,
    borderRadius: 8,
    padding: BTHWANI_SPACING.contentH,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.lg,
  },
  priceBreakdown: {
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    borderRadius: 6,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.xs,
  },
  priceLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  priceValue: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: BTHWANI_COLORS.borderSubtle,
    paddingTop: BTHWANI_SPACING.sm,
    marginTop: BTHWANI_SPACING.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.success,
  },
  notesSection: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  notesText: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    lineHeight: 20,
  },
  attachmentsSection: {
    borderTopWidth: 1,
    borderTopColor: BTHWANI_COLORS.borderSubtle,
    paddingTop: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
  },
  attachmentsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  attachment: {
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    borderRadius: 6,
    padding: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.xs,
  },
  attachmentText: {
    fontSize: 14,
    color: BTHWANI_COLORS.primary,
  },
  dateSection: {
    borderTopWidth: 1,
    borderTopColor: BTHWANI_COLORS.borderSubtle,
    paddingTop: BTHWANI_SPACING.md,
  },
  dateText: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  importantNotes: {
    backgroundColor: BTHWANI_COLORS.infoSubtle,
    margin: BTHWANI_SPACING.lg,
    borderRadius: 8,
    padding: BTHWANI_SPACING.contentH,
  },
  importantTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  importantText: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    lineHeight: 20,
  },
  actions: {
    padding: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.md,
    paddingBottom: BTHWANI_SPACING.xl,
  },
  approveButton: {
    backgroundColor: BTHWANI_COLORS.success,
    borderRadius: 8,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.danger,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  approveText: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSuccess,
  },
  rejectText: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.danger,
  },
});

const auto_dsh_proxy_request_approve = SheinApprovalScreen;
export default auto_dsh_proxy_request_approve;

