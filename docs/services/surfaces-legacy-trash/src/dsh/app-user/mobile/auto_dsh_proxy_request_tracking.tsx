// SHEIN Proxy Request Tracking Screen – App Client Mobile
// Surface: app-client | Service: dsh
// Customer screen to track their proxy request progress

import React, { useState, useEffect } from 'react';
import { rawFetch } from '@bthwani/api-clients';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { ScreenWrapper } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING } from '@bthwani/ui-kit';

interface TrackingStep {
  id: string;
  title: string;
  description: string;
  timestamp?: string;
  status: 'completed' | 'current' | 'pending';
}

interface PickupInfo {
  etaDays: number;
  expectedPickupDate: string;
  expectedPickupWindow: string;
  scheduleNotes?: string;
}

interface Props {
  route?: { params?: { requestId?: string } };
  navigation?: { goBack: () => void; navigate: (screen: string, params?: { requestId: string }) => void };
}

export const SheinTrackingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [state, setState] = useState<'loading' | 'content' | 'error'>('loading');
  const [steps, setSteps] = useState<TrackingStep[]>([]);
  const [pickupInfo, setPickupInfo] = useState<PickupInfo | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [delivering, setDelivering] = useState(false);

  const requestId = route?.params?.requestId || 'SR-001';

  useEffect(() => {
    loadTrackingData();
  }, [requestId]);

  const statusOrder = ['UNDER_REVIEW', 'PRICE_ESTIMATED', 'OFFER_SENT', 'APPROVED', 'SCHEDULED_PICKUP', 'DELIVERED', 'CANCELLED'];
  const statusTitles: Record<string, string> = {
    UNDER_REVIEW: t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.statusUnderReview'),
    PRICE_ESTIMATED: t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.statusPriceEstimated'),
    OFFER_SENT: t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.statusOfferSent'),
    APPROVED: t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.statusApproved'),
    SCHEDULED_PICKUP: t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.statusPickupScheduled'),
    DELIVERED: t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.statusReceived'),
    CANCELLED: t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.statusCancelled'),
  };
  const statusDescriptions: Record<string, string> = {
    UNDER_REVIEW: t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.messageUnderReview'),
    PRICE_ESTIMATED: t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.messagePriceEstimated'),
    OFFER_SENT: t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.messageOfferSent'),
    APPROVED: t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.messageApproved'),
    SCHEDULED_PICKUP: t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.messagePickupScheduled'),
    DELIVERED: t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.messageReceived'),
    CANCELLED: t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.messageCancelled'),
  };

  const loadTrackingData = async () => {
    try {
      setState('loading');
      let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
      if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
      const url = `${baseUrl}/api/dsh/proxy-request/${encodeURIComponent(requestId)}`;
      const response = await rawFetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      if (!json?.success || !json?.data) throw new Error(json?.error || 'Failed to load');
      const d = json.data;
      const currentStatus = d.status;
      const idx = statusOrder.indexOf(currentStatus);
      const steps: TrackingStep[] = statusOrder
        .filter((s) => s !== 'CANCELLED')
        .map((s, i) => {
          const isCancelled = currentStatus === 'CANCELLED';
          const stepIdx = statusOrder.indexOf(s);
          let status: 'completed' | 'current' | 'pending' = 'pending';
          if (isCancelled && s !== 'CANCELLED') status = stepIdx < idx ? 'completed' : 'pending';
          else if (stepIdx < idx) status = 'completed';
          else if (stepIdx === idx && s !== 'CANCELLED') status = 'current';
          return {
            id: s,
            title: statusTitles[s] || s,
            description: statusDescriptions[s] || '',
            timestamp: stepIdx <= idx ? (d.updatedAt || d.createdAt) : undefined,
            status,
          };
        });
      if (currentStatus === 'CANCELLED') {
        steps.push({ id: 'CANCELLED', title: statusTitles.CANCELLED, description: statusDescriptions.CANCELLED, status: 'current' });
      }
      setCurrentStatus(currentStatus);
      setSteps(steps);
      setPickupInfo(
        d.pickup
          ? {
              etaDays: d.pickup.etaDays ?? 0,
              expectedPickupDate: d.pickup.expectedPickupDate || '',
              expectedPickupWindow: d.pickup.expectedPickupWindow || '',
              scheduleNotes: d.pickup.scheduleNotes,
            }
          : null,
      );
      setState('content');
    } catch (error) {
      console.error('Failed to load tracking data:', error);
      setState('error');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrackingData();
    setRefreshing(false);
  };

  const handleMarkDelivered = async () => {
    if (currentStatus !== 'SCHEDULED_PICKUP') return;
    setDelivering(true);
    try {
      let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
      if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
      const res = await rawFetch(`${baseUrl}/api/dsh/proxy-request/${encodeURIComponent(requestId)}/deliver`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' } });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      await loadTrackingData();
    } catch (e) {
      console.error(e);
      Alert.alert(t('common.error'), t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.deliverFailed'));
    } finally {
      setDelivering(false);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'current': return '🔄';
      case 'pending': return '⏳';
      default: return '○';
    }
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper
        state="loading"
        screenName="SheinTrackingScreen"
        loadingMessage={t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.loadingMessage')}
      />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper
        state="error"
        screenName="SheinTrackingScreen"
        errorMessage={t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.errorMessage')}
        onErrorAction={loadTrackingData}
      />
    );
  }

  return (
    <ScreenWrapper state="content" screenName="SheinTrackingScreen">
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.trackTitle', { requestId })}</Text>
          <Text style={styles.subtitle}>{t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.trackSubtitle')}</Text>
        </View>

        <View style={styles.timeline}>
          {steps.map((step, index) => (
            <View key={step.id} style={[styles.stepContainer, { flexDirection: 'row', direction: layoutDirection }]}>
              <View style={styles.stepConnector}>
                {index < steps.length - 1 && (
                  <View style={[styles.connectorLine, step.status === 'completed' && styles.connectorLineActive]} />
                )}
              </View>

              <View style={styles.stepContent}>
                <View style={[styles.stepHeader, { flexDirection: 'row', direction: layoutDirection }]}>
                  <Text style={styles.stepIcon}>{getStepIcon(step.status)}</Text>
                  <View style={styles.stepTextContainer}>
                    <Text style={[styles.stepTitle, step.status === 'current' && styles.stepTitleCurrent]}>
                      {step.title}
                    </Text>
                    <Text style={styles.stepDescription}>{step.description}</Text>
                    {step.timestamp && (
                      <Text style={styles.stepTimestamp}>
                        {new Date(step.timestamp).toLocaleString('ar-SA')}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {pickupInfo && (
          <View style={styles.pickupSection}>
            <Text style={styles.sectionTitle}>{t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.pickupSectionTitle')}</Text>

            <View style={styles.pickupCard}>
              <View style={[styles.pickupRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.pickupLabel}>الوقت المتوقع:</Text>
                <Text style={styles.pickupValue}>{pickupInfo.etaDays} أيام</Text>
              </View>

              <View style={[styles.pickupRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.pickupLabel}>تاريخ الاستلام:</Text>
                <Text style={styles.pickupValue}>
                  {new Date(pickupInfo.expectedPickupDate).toLocaleDateString('ar-SA')}
                </Text>
              </View>

              <View style={[styles.pickupRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.pickupLabel}>الفترة الزمنية:</Text>
                <Text style={styles.pickupValue}>{pickupInfo.expectedPickupWindow}</Text>
              </View>

              {pickupInfo.scheduleNotes && (
                <View style={[styles.pickupRow, { flexDirection: 'row', direction: layoutDirection }]}>
                  <Text style={styles.pickupLabel}>ملاحظات:</Text>
                  <Text style={styles.pickupValue}>{pickupInfo.scheduleNotes}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={styles.actions}>
          {currentStatus === 'OFFER_SENT' && (
            <TouchableOpacity
              style={styles.reviewOfferButton}
              onPress={() => (navigation as any)?.navigate?.('auto_dsh_proxy_request_review', { requestId })}
            >
              <Text style={styles.reviewOfferText}>{t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.reviewOffer')}</Text>
            </TouchableOpacity>
          )}
          {currentStatus === 'SCHEDULED_PICKUP' && (
            <TouchableOpacity style={styles.deliveredButton} onPress={handleMarkDelivered} disabled={delivering}>
              <Text style={styles.deliveredText}>{delivering ? t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.processingMessage') : t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.received')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactText}>{t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.contactSupport')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.refreshButton} onPress={loadTrackingData}>
            <Text style={styles.refreshText}>{t('dsh.app-client.mobile.auto_dsh_proxy_request_tracking.refreshStatus')}</Text>
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
    fontSize: 20,
    fontWeight: '700',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  timeline: {
    padding: BTHWANI_SPACING.contentH,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: BTHWANI_SPACING.lg,
  },
  stepConnector: {
    width: 40,
    alignItems: 'center',
    paddingTop: 8,
  },
  connectorLine: {
    width: 2,
    height: 60,
    backgroundColor: BTHWANI_COLORS.borderSubtle,
    position: 'absolute',
    top: 24,
  },
  connectorLineActive: {
    backgroundColor: BTHWANI_COLORS.primary,
  },
  stepContent: {
    flex: 1,
    marginStart: BTHWANI_SPACING.md,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIcon: {
    fontSize: 20,
    marginEnd: BTHWANI_SPACING.md,
    marginTop: 2,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  stepTitleCurrent: {
    color: BTHWANI_COLORS.primary,
  },
  stepDescription: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    lineHeight: 20,
    marginBottom: BTHWANI_SPACING.xs,
  },
  stepTimestamp: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  pickupSection: {
    backgroundColor: BTHWANI_COLORS.surface,
    margin: BTHWANI_SPACING.lg,
    marginTop: 0,
    borderRadius: 8,
    padding: BTHWANI_SPACING.contentH,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  pickupCard: {
    backgroundColor: BTHWANI_COLORS.successSubtle,
    borderRadius: 6,
    padding: BTHWANI_SPACING.md,
  },
  pickupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  pickupLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    fontWeight: '500',
  },
  pickupValue: {
    fontSize: 14,
    color: BTHWANI_COLORS.success,
    fontWeight: '600',
  },
  actions: {
    padding: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.md,
    paddingBottom: BTHWANI_SPACING.xl,
  },
  deliveredButton: {
    backgroundColor: BTHWANI_COLORS.success,
    borderRadius: 8,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  deliveredText: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSuccess,
  },
  reviewOfferButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    borderRadius: 8,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  reviewOfferText: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onPrimary,
  },
  contactButton: {
    backgroundColor: BTHWANI_COLORS.info,
    borderRadius: 8,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  contactText: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onInfo,
  },
  refreshButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.primary,
  },
  refreshText: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.primary,
  },
});

const auto_dsh_proxy_request_tracking = SheinTrackingScreen;
export default auto_dsh_proxy_request_tracking;

