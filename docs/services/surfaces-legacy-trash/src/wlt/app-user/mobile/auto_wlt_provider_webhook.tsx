// Auto-generated screen for wlt_provider_webhook
// Surface: app-client | Service: wlt
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildWebhookMock, type WebhookEndpoint, type WebhookEvent } from '../../fixtures/webhook';

interface auto_wlt_provider_webhookProps {
  
}

export const auto_wlt_provider_webhook: React.FC<auto_wlt_provider_webhookProps> = (props) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');
  const [endpoint, setEndpoint] = useState<WebhookEndpoint | null>(null);

  useEffect(() => {
    // Backend integration call
    const loadWebhookConfig = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockEndpoint = buildWebhookMock(t, process.env.WEBHOOK_HMAC_SECRET || '');

        setEndpoint(mockEndpoint);
        setState('content');
      } catch (error) {
        setState('error');
      }
    };

    loadWebhookConfig();
  }, []);

  const toggleEvent = (eventId: string) => {
    if (!endpoint) return;

    setEndpoint(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        events: prev.events.map(event =>
          event.id === eventId
            ? { ...event, enabled: !event.enabled }
            : event
        )
      };
    });
  };

  const toggleEndpoint = () => {
    if (!endpoint) return;

    setEndpoint(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        isActive: !prev.isActive
      };
    });
  };

  const renderEventItem = (event: WebhookEvent) => (
    <View key={event.id} style={[styles.eventItem, { flexDirection: 'row', direction: layoutDirection }]}>
      <View style={styles.eventInfo}>
        <Text style={styles.eventName}>{event.event}</Text>
        <Text style={styles.eventDescription}>{event.description}</Text>
        {event.lastTriggered && (
          <Text style={styles.eventLastTriggered}>
            آخر تشغيل: {new Date(event.lastTriggered).toLocaleString('ar-SA')}
          </Text>
        )}
      </View>
      <Switch
        value={event.enabled}
        onValueChange={() => toggleEvent(event.id)}
        trackColor={{ false: BTHWANI_COLORS.surfaceVariant, true: BTHWANI_COLORS.primary }}
        thumbColor={event.enabled ? BTHWANI_COLORS.onPrimary : BTHWANI_COLORS.onSurfaceMuted}
      />
    </View>
  );

  const renderContent = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>إعدادات Webhook</Text>
      <Text style={styles.subtitle}>{t('wlt.provider_webhook_subtitle')}</Text>

      {/* Endpoint Status */}
      <View style={styles.statusCard}>
        <View style={[styles.statusHeader, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.statusTitle}>حالة نقطة النهاية</Text>
          <View style={[styles.endpointBadge, { backgroundColor: endpoint?.isActive ? BTHWANI_COLORS.success : BTHWANI_COLORS.error }]}>
            <Text style={styles.endpointBadgeText}>
              {endpoint?.isActive ? 'نشط' : t('surfaces.معطل')}
            </Text>
          </View>
        </View>

        <View style={[styles.endpointToggle, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.endpointLabel}>تفعيل الـ Webhook</Text>
          <Switch
            value={endpoint?.isActive || false}
            onValueChange={toggleEndpoint}
            trackColor={{ false: BTHWANI_COLORS.surfaceVariant, true: BTHWANI_COLORS.primary }}
            thumbColor={endpoint?.isActive ? BTHWANI_COLORS.onPrimary : BTHWANI_COLORS.onSurfaceMuted}
          />
        </View>
      </View>

      {/* Endpoint Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>معلومات نقطة النهاية</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>الرابط:</Text>
          <Text style={styles.detailValue} numberOfLines={2}>{endpoint?.url}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>تاريخ الإنشاء:</Text>
          <Text style={styles.detailValue}>{endpoint?.createdAt}</Text>
        </View>

        {endpoint?.lastUsed && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>آخر استخدام:</Text>
            <Text style={styles.detailValue}>
              {new Date(endpoint.lastUsed).toLocaleString('ar-SA')}
            </Text>
          </View>
        )}
      </View>

      {/* Security Info */}
      <View style={styles.securityCard}>
        <Text style={styles.sectionTitle}>معلومات الأمان</Text>
        <Text style={styles.securityText}>
          سر الـ Webhook محمي ومشفر. يُستخدم للتحقق من صحة الإشعارات الواردة.
        </Text>
        <TouchableOpacity style={styles.secretButton}>
          <Text style={styles.secretButtonText}>عرض السر</Text>
        </TouchableOpacity>
      </View>

      {/* Events Configuration */}
      <View style={styles.eventsCard}>
        <Text style={styles.sectionTitle}>الأحداث المشترك بها</Text>

        {endpoint?.events.map(renderEventItem)}
      </View>

      {/* Test Section */}
      <View style={styles.testCard}>
        <Text style={styles.sectionTitle}>اختبار الـ Webhook</Text>
        <Text style={styles.testDescription}>
          أرسل إشعار اختبار للتأكد من عمل نقطة النهاية
        </Text>

        <TouchableOpacity style={styles.testButton}>
          <Text style={styles.testButtonText}>إرسال اختبار</Text>
        </TouchableOpacity>
      </View>

      {/* Logs */}
      <View style={styles.logsCard}>
        <Text style={styles.sectionTitle}>سجل الإشعارات الأخيرة</Text>

        <View style={[styles.logItem, { flexDirection: 'row', direction: layoutDirection }]}>
          <View style={styles.logInfo}>
            <Text style={styles.logEvent}>payment.succeeded</Text>
            <Text style={styles.logTime}>2024-01-15 10:30:00</Text>
          </View>
          <View style={styles.logStatus}>
            <Text style={styles.logStatusText}>نجح</Text>
          </View>
        </View>

        <View style={[styles.logItem, { flexDirection: 'row', direction: layoutDirection }]}>
          <View style={styles.logInfo}>
            <Text style={styles.logEvent}>payment.failed</Text>
            <Text style={styles.logTime}>2024-01-10 14:20:00</Text>
          </View>
          <View style={styles.logStatus}>
            <Text style={styles.logStatusText}>نجح</Text>
          </View>
        </View>
      </View>

      <View style={styles.warningNote}>
        <Text style={styles.warningNoteText}>
          ⚠️ تأكد من أن رابط الـ Webhook آمن ومُدار من قبل فريق التطوير
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
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  statusCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  endpointBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  endpointBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: BTHWANI_COLORS.onPrimary,
  },
  endpointToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  endpointLabel: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurface,
  },
  detailsCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  securityCard: {
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
  detailRow: {
    marginBottom: BTHWANI_SPACING.sm,
  },
  detailLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  detailValue: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    fontWeight: '500',
  },
  securityText: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.md,
    lineHeight: 20,
  },
  secretButton: {
    backgroundColor: BTHWANI_COLORS.secondary,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.sm,
    alignItems: 'center',
  },
  secretButtonText: {
    color: BTHWANI_COLORS.onSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  eventsCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: BTHWANI_COLORS.outline,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 14,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  eventDescription: {
    fontSize: 13,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  eventLastTriggered: {
    fontSize: 12,
    color: BTHWANI_COLORS.primary,
  },
  testCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  testDescription: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.md,
    lineHeight: 20,
  },
  testButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  testButtonText: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  logsCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: BTHWANI_COLORS.outline,
  },
  logInfo: {
    flex: 1,
  },
  logEvent: {
    fontSize: 14,
    fontWeight: '500',
    color: BTHWANI_COLORS.onSurface,
  },
  logTime: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  logStatus: {
    backgroundColor: BTHWANI_COLORS.success,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  logStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: BTHWANI_COLORS.onPrimary,
  },
  warningNote: {
    backgroundColor: BTHWANI_COLORS.warningContainer,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.xl,
  },
  warningNoteText: {
    fontSize: 14,
    color: BTHWANI_COLORS.onWarningContainer,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default auto_wlt_provider_webhook;

