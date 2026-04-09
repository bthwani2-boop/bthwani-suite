// Auto-generated screen for dsh_subscription_sync
// Surface: app-client | Service: dsh | Operation: POST /api/dsh/subscriptions/sync
// §30 States: Loading / Error / Content — نقر واحد للمزامنة

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';
import { buildDshSubscriptionSyncMock, type Subscription } from '../../hooks';

interface auto_dsh_subscription_syncProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_dsh_subscription_sync: React.FC<auto_dsh_subscription_syncProps> = ({ onNavigate, navigation }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('content');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const handleRetry = () => {
    setState('content');
    setSyncStatus('idle');
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) {
      navigation.navigate(screen);
    } else if (onNavigate) {
      onNavigate(screen);
    }
  };

  const handleSync = async () => {
    setSyncStatus('syncing');
    try {
      const url = `${getBaseUrl()}/api/dsh/subscriptions/sync`;
      const res = await rawFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'app' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في المزامنة');
      setLastSyncedAt(json?.data?.syncedAt ?? new Date().toISOString());
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2500);
    } catch {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 2500);
    }
  };

  // بثواني برو فقط — أسماء من المواصفة الموحّدة (لا Prime/برايم؛ family = bundle تحت pro)
  const mockSubscriptions: Subscription[] = [
    {
      id: '1',
      name: t('dsh.app-client.mobile.auto_dsh_subscription_sync.tierNamePro'),
      status: 'active',
      lastSync: '2024-02-10 14:30',
      nextBilling: '2024-03-10',
      amount: 49.99
    },
    {
      id: '2',
      name: t('dsh.app-client.mobile.auto_dsh_subscription_sync.tierNameProAlt'),
      status: 'active',
      lastSync: '2024-02-10 12:15',
      nextBilling: '2024-03-10',
      amount: 29.99
    },
    {
      id: '3',
      name: t('dsh.app-client.mobile.auto_dsh_subscription_sync.tierNameProShort'),
      status: 'inactive',
      lastSync: '2024-01-15 09:45',
      nextBilling: t('dsh.app-client.mobile.auto_dsh_subscription_sync.statusUnknown'),
      amount: 99.99
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return semanticRoles.stateSuccess.icon;
      case 'inactive': return semanticRoles.stateWarning.icon;
      case 'expired': return semanticRoles.stateError.icon;
      default: return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('dsh.app-client.mobile.auto_dsh_subscription_sync.statusActive');
      case 'inactive': return t('dsh.app-client.mobile.auto_dsh_subscription_sync.statusInactive');
      case 'expired': return t('dsh.app-client.mobile.auto_dsh_subscription_sync.statusExpired');
      default: return status;
    }
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>مزامنة الاشتراكات</Text>
            <Text style={styles.subtitle}>حافظ على تحديث اشتراكاتك وبياناتك</Text>
          </View>

          <View style={styles.syncCard}>
            <View style={styles.syncHeader}>
              <Text style={styles.syncTitle}>حالة المزامنة</Text>
              <View style={[
                styles.statusIndicator,
                syncStatus === 'syncing' && styles.syncingStatus,
                syncStatus === 'success' && styles.successStatus,
                syncStatus === 'error' && styles.errorStatus
              ]}>
                <Text style={[
                  styles.statusText,
                  syncStatus === 'syncing' && styles.syncingText,
                  syncStatus === 'success' && styles.successText,
                  syncStatus === 'error' && styles.errorText
                ]}>
                  {syncStatus === 'idle' ? t('dsh.app-client.mobile.auto_dsh_subscription_sync.statusReady') :
                   syncStatus === 'syncing' ? t('dsh.app-client.mobile.auto_dsh_subscription_sync.syncingMessage') :
                   syncStatus === 'success' ? t('dsh.app-client.mobile.auto_dsh_subscription_sync.successTitle') :
                   t('dsh.app-client.mobile.auto_dsh_subscription_sync.errorSyncMessage')}
                </Text>
              </View>
            </View>

            <Text style={styles.syncDescription}>
              آخر مزامنة: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString('ar-SA') : '—'}
            </Text>

            <TouchableOpacity
              style={[
                styles.syncButton,
                syncStatus === 'syncing' && styles.disabledButton
              ]}
              onPress={handleSync}
              disabled={syncStatus === 'syncing'}
            >
              <Text style={[
                styles.syncButtonText,
                syncStatus === 'syncing' && styles.disabledText
              ]}>
                {syncStatus === 'syncing' ? t('dsh.app-client.mobile.auto_dsh_subscription_sync.loadingMessage') : '🔄 مزامنة الآن'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.subscriptionsSection}>
            <Text style={[styles.sectionTitle, textAlignStart]}>اشتراكاتك الحالية</Text>

            {mockSubscriptions.map((subscription) => (
              <View key={subscription.id} style={styles.subscriptionCard}>
                <View style={styles.subscriptionHeader}>
                  <Text style={styles.subscriptionName}>{subscription.name}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(subscription.status) }
                  ]}>
                    <Text style={styles.statusBadgeText}>
                      {getStatusText(subscription.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.subscriptionDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>آخر مزامنة:</Text>
                    <Text style={styles.detailValue}>{subscription.lastSync}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>التجديد التالي:</Text>
                    <Text style={styles.detailValue}>{subscription.nextBilling}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>المبلغ:</Text>
                    <Text style={styles.detailValue}>{subscription.amount} ريال</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 نصائح للمزامنة</Text>
            <Text style={styles.infoText}>
              • يُنصح بإجراء المزامنة مرة واحدة يومياً على الأقل
              {'\n'}
              • تأكد من وجود اتصال إنترنت مستقر أثناء المزامنة
              {'\n'}
              • في حالة فشل المزامنة، تحقق من إعدادات الشبكة وحاول مرة أخرى
            </Text>
          </View>

          <TouchableOpacity style={styles.backButton} onPress={() => handleNavigate('DshHome')}>
            <Text style={styles.backText}>العودة للرئيسية</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('dsh.app-client.mobile.auto_dsh_subscription_sync.loadingSubscriptionMessage')}
      errorMessage={t('dsh.app-client.mobile.auto_dsh_subscription_sync.errorLoadSubscriptionMessage')}
      onErrorAction={handleRetry}
      screenName="auto_dsh_subscription_sync"
      operationName="dsh_subscription_sync"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    padding: BTHWANI_SPACING.contentH,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.onSurfaceMuted,
    textAlign: 'center',
  },
  syncCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  syncHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  syncTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  statusIndicator: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  syncingStatus: {
    backgroundColor: semanticRoles.stateInfo.icon,
  },
  successStatus: {
    backgroundColor: semanticRoles.stateSuccess.icon,
  },
  errorStatus: {
    backgroundColor: semanticRoles.stateError.icon,
  },
  statusText: {
    color: semanticRoles.onSurface,
    fontSize: 12,
    fontWeight: '600',
  },
  syncingText: {
    color: 'white',
  },
  successText: {
    color: 'white',
  },
  errorText: {
    color: 'white',
  },
  syncDescription: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.lg,
  },
  syncButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  syncButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: semanticRoles.onSurfaceMuted,
  },
  subscriptionsSection: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  subscriptionCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  subscriptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  subscriptionDetails: {
    marginTop: BTHWANI_SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.xs,
  },
  detailLabel: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
  },
  detailValue: {
    fontSize: 14,
    color: semanticRoles.onSurface,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  infoText: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  backText: {
    color: semanticRoles.onSurface,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_dsh_subscription_sync;

