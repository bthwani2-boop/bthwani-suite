// SHEIN Proxy Request Review Screen – App Client Mobile
// Surface: app-client | Service: dsh
// Customer screen to review their proxy request status and details

import React, { useState, useEffect } from 'react';
import { rawFetch } from '@bthwani/api-clients';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { ScreenWrapper } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING } from '@bthwani/ui-kit';

interface SheinProxyRequest {
  requestId: string;
  status: string;
  createdAt: string;
  productUrl: string;
  quantity: number;
  sizeColor?: string;
  notes?: string;
  images?: string[];
  offer?: {
    offerId: string;
    productTitle: string;
    finalPrice: number;
    shippingCost: number;
    serviceFee: number;
    currency: string;
    offerNotes: string;
    attachments: string[];
    createdAt: string;
  };
}

interface Props {
  route?: { params?: { requestId?: string } };
  navigation?: { navigate: (screen: string, params?: any) => void };
}

export const SheinRequestReviewScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [state, setState] = useState<'loading' | 'content' | 'error'>(
    'loading'
  );
  const [request, setRequest] = useState<SheinProxyRequest | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const requestId = route?.params?.requestId || 'SR-001';

  useEffect(() => {
    loadRequest();
  }, [requestId]);

  const loadRequest = async () => {
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
      const req: SheinProxyRequest = {
        requestId: d.requestId,
        status: d.status,
        createdAt: d.createdAt,
        productUrl: d.productUrl,
        quantity: d.quantity,
        sizeColor: d.sizeColor,
        notes: d.notes,
        images: d.images,
        offer: d.offer
          ? {
              offerId: '',
              productTitle: d.offer.productTitle || '',
              finalPrice: d.offer.finalPrice ?? 0,
              shippingCost: d.pricing?.shippingCost ?? 0,
              serviceFee: d.pricing?.serviceFee ?? 0,
              currency: d.offer.currency || 'USD',
              offerNotes: d.offer.offerNotes || '',
              attachments: d.offer.attachments || [],
              createdAt: d.updatedAt || d.createdAt,
            }
          : undefined,
      };
      setRequest(req);
      setState('content');
    } catch (error) {
      console.error('Failed to load request:', error);
      setState('error');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequest();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UNDER_REVIEW':
        return BTHWANI_COLORS.warning;
      case 'PRICE_ESTIMATED':
        return BTHWANI_COLORS.info;
      case 'OFFER_SENT':
        return BTHWANI_COLORS.primary;
      case 'WAITING_CUSTOMER_APPROVAL':
        return BTHWANI_COLORS.primaryMuted;
      case 'APPROVED':
        return BTHWANI_COLORS.success;
      case 'SCHEDULED_PICKUP':
        return BTHWANI_COLORS.successMuted;
      case 'DELIVERED':
        return BTHWANI_COLORS.success;
      case 'CANCELLED':
        return BTHWANI_COLORS.danger;
      default:
        return BTHWANI_COLORS.onSurfaceMuted;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      UNDER_REVIEW: t(
        'dsh.app-client.mobile.auto_dsh_proxy_request_review.statusUnderReview'
      ),
      PRICE_ESTIMATED: t(
        'dsh.app-client.mobile.auto_dsh_proxy_request_review.statusPriceEstimated'
      ),
      OFFER_SENT: t(
        'dsh.app-client.mobile.auto_dsh_proxy_request_review.statusOfferSent'
      ),
      WAITING_CUSTOMER_APPROVAL: t(
        'dsh.app-client.mobile.auto_dsh_proxy_request_review.statusAwaitingApproval'
      ),
      APPROVED: t(
        'dsh.app-client.mobile.auto_dsh_proxy_request_review.statusApproved'
      ),
      SCHEDULED_PICKUP: t(
        'dsh.app-client.mobile.auto_dsh_proxy_request_review.statusPickupScheduled'
      ),
      DELIVERED: t(
        'dsh.app-client.mobile.auto_dsh_proxy_request_review.statusReceived'
      ),
      CANCELLED: t(
        'dsh.app-client.mobile.auto_dsh_proxy_request_review.statusCancelled'
      ),
    };
    return statusMap[status] || status;
  };

  const [rejecting, setRejecting] = useState(false);

  const handleApproveOffer = () => {
    navigation?.navigate('auto_dsh_proxy_request_approve', { requestId });
  };

  const handleRejectOffer = async () => {
    setRejecting(true);
    try {
      let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
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
      navigation?.navigate('auto_dsh_proxy_request_tracking', { requestId });
    } catch (e) {
      console.error(e);
      setRejecting(false);
      alert(
        t(
          'dsh.app-client.mobile.auto_dsh_proxy_request_review.errorRejectMessage'
        )
      );
    }
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper
        state='loading'
        screenName='SheinRequestReviewScreen'
        loadingMessage={t(
          'dsh.app-client.mobile.auto_dsh_proxy_request_review.loadingMessage'
        )}
      />
    );
  }

  if (state === 'error' || !request) {
    return (
      <ScreenWrapper
        state='error'
        screenName='SheinRequestReviewScreen'
        errorMessage={t(
          'dsh.app-client.mobile.auto_dsh_proxy_request_review.errorMessage'
        )}
        onErrorAction={loadRequest}
      />
    );
  }

  return (
    <ScreenWrapper state='content' screenName='SheinRequestReviewScreen'>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>طلبك رقم {request.requestId}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(request.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusText(request.status)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>تفاصيل الطلب</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>رابط المنتج:</Text>
            <Text style={styles.value} numberOfLines={2}>
              {request.productUrl}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>الكمية:</Text>
            <Text style={styles.value}>{request.quantity}</Text>
          </View>
          {request.sizeColor && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>المقاس/اللون:</Text>
              <Text style={styles.value}>{request.sizeColor}</Text>
            </View>
          )}
          {request.notes && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>ملاحظات:</Text>
              <Text style={styles.value}>{request.notes}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.label}>تاريخ الطلب:</Text>
            <Text style={styles.value}>
              {new Date(request.createdAt).toLocaleString('ar-SA')}
            </Text>
          </View>
        </View>

        {request.offer && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>العرض المقدم</Text>
            <View style={styles.offerCard}>
              <Text style={styles.productTitle}>
                {request.offer.productTitle}
              </Text>

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
                      request.offer.finalPrice -
                      request.offer.shippingCost -
                      request.offer.serviceFee
                    ).toFixed(2)}{' '}
                    {request.offer.currency}
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
                    {request.offer.shippingCost.toFixed(2)}{' '}
                    {request.offer.currency}
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
                    {request.offer.serviceFee.toFixed(2)}{' '}
                    {request.offer.currency}
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
                    {request.offer.finalPrice.toFixed(2)}{' '}
                    {request.offer.currency}
                  </Text>
                </View>
              </View>

              <Text style={styles.offerNotes}>{request.offer.offerNotes}</Text>

              {request.offer.attachments &&
                request.offer.attachments.length > 0 && (
                  <View style={styles.attachments}>
                    <Text style={styles.attachmentsLabel}>المرفقات:</Text>
                    {request.offer.attachments.map((attachment, index) => (
                      <Text key={index} style={styles.attachment}>
                        • {attachment}
                      </Text>
                    ))}
                  </View>
                )}
            </View>
          </View>
        )}

        {request.status === 'OFFER_SENT' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={handleApproveOffer}
            >
              <Text style={styles.approveText}>موافقة على العرض</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rejectButton}
              onPress={handleRejectOffer}
              disabled={rejecting}
            >
              <Text style={styles.rejectText}>
                {rejecting
                  ? t(
                      'dsh.app-client.mobile.auto_dsh_proxy_request_review.processingMessage'
                    )
                  : t(
                      'dsh.app-client.mobile.auto_dsh_proxy_request_review.rejectOffer'
                    )}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {request.status === 'WAITING_CUSTOMER_APPROVAL' && (
          <View style={styles.waitingMessage}>
            <Text style={styles.waitingText}>
              تم استلام موافقتك. سيتم التواصل معك قريباً لتحديد موعد الاستلام.
            </Text>
          </View>
        )}
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
    fontSize: 20,
    fontWeight: '700',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  section: {
    backgroundColor: BTHWANI_COLORS.surface,
    margin: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.md,
    borderRadius: 8,
    padding: BTHWANI_SPACING.contentH,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  infoRow: {
    marginBottom: BTHWANI_SPACING.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  value: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    lineHeight: 20,
  },
  offerCard: {
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    borderRadius: 8,
    padding: BTHWANI_SPACING.contentH,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  priceBreakdown: {
    marginBottom: BTHWANI_SPACING.md,
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
  offerNotes: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    lineHeight: 20,
    marginBottom: BTHWANI_SPACING.md,
  },
  attachments: {
    borderTopWidth: 1,
    borderTopColor: BTHWANI_COLORS.borderSubtle,
    paddingTop: BTHWANI_SPACING.md,
  },
  attachmentsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  attachment: {
    fontSize: 14,
    color: BTHWANI_COLORS.primary,
    marginBottom: BTHWANI_SPACING.xs,
  },
  actions: {
    padding: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.md,
  },
  approveButton: {
    backgroundColor: BTHWANI_COLORS.success,
    borderRadius: 8,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  approveText: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSuccess,
  },
  rejectButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.danger,
  },
  rejectText: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.danger,
  },
  waitingMessage: {
    backgroundColor: BTHWANI_COLORS.infoSubtle,
    margin: BTHWANI_SPACING.lg,
    borderRadius: 8,
    padding: BTHWANI_SPACING.contentH,
  },
  waitingText: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

const auto_dsh_proxy_request_review = SheinRequestReviewScreen;
export default auto_dsh_proxy_request_review;

