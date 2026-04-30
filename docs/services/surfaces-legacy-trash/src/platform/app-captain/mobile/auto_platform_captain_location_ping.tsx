// Auto-generated screen for platform_captain_location_ping
// Surface: app-captain | Service: platform
// Operation: POST /api/platform/captain/location/ping
// Description: Unified location ping screen - works across DSH, AMN captain types (no KNZ per policy)
// Tracking policy (both DSH & AMN):
// - On-trip: ping every 30s (or on major events)
// - Idle (no active trip): ping every 60s
// - No real-time streaming; periodic HTTP pings only

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildPlatformCaptainLocationPingMock, type LocationData } from '../../fixtures/captainLocationPing';

interface AutoPlatformCaptainLocationPingProps {
  navigation?: any;
  route?: {
    params?: {
      service_mode?: 'DSH' | 'AMN';
    };
  };
}

export const AutoPlatformCaptainLocationPing: React.FC<AutoPlatformCaptainLocationPingProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [serviceMode, setServiceMode] = useState<'DSH' | 'AMN'>('DSH');

  useEffect(() => {
    // Get service mode from route params or determine from captain type
    const mode = route?.params?.service_mode || 'DSH';
    setServiceMode(mode);

    // Start location updates
    startLocationUpdates();
  }, [route]);

  const startLocationUpdates = useCallback(() => {
    setLocation(buildPlatformCaptainLocationPingMock(serviceMode));
  }, [serviceMode]);

  const sendLocationPing = useCallback(async () => {
    if (!location) return;

    try {
      setIsUpdating(true);

      // Mock API call to platform_captain_location_ping
      const response = await new Promise<{ success: boolean; last_ping: string }>((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            last_ping: new Date().toISOString()
          });
        }, 1000);
      });

      if (response.success) {
        setLastUpdate(response.last_ping);
        Alert.alert(
          t('surfaces.تم_التحديث'),
          t('platform.app-captain.mobile.auto_platform_captain_location_ping.locationUpdatedTemplate', { serviceMode }),
          [{ text: 'موافق' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'خطأ',
        t('surfaces.فشل_في_تحديث_الموقع_يرجى_المحاولة_مر'),
        [{ text: 'موافق' }]
      );
    } finally {
      setIsUpdating(false);
    }
  }, [location, serviceMode, t]);

  const getServiceDisplayName = (mode: string) => {
    switch (mode) {
      case 'DSH': return '🚚 توصيل وتسوق';
      case 'AMN': return t('surfaces.تاكسي_للنساء');
      default: return mode;
    }
  };

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>تحديث الموقع</Text>
          <Text style={styles.subtitle}>{getServiceDisplayName(serviceMode)}</Text>
        </View>

        <View style={styles.locationCard}>
          <Text style={styles.cardTitle}>معلومات الموقع الحالي</Text>

          {location ? (
            <View style={styles.locationInfo}>
              <View style={[styles.infoRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.label}>خط العرض:</Text>
                <Text style={styles.value}>{location.latitude.toFixed(6)}</Text>
              </View>
              <View style={[styles.infoRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.label}>خط الطول:</Text>
                <Text style={styles.value}>{location.longitude.toFixed(6)}</Text>
              </View>
              <View style={[styles.infoRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.label}>الدقة:</Text>
                <Text style={styles.value}>{location.accuracy} متر</Text>
              </View>
              <View style={[styles.infoRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.label}>آخر تحديث:</Text>
                <Text style={styles.value}>
                  {new Date(location.timestamp).toLocaleTimeString('ar-SA')}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.loadingText}>{t('platform.app-captain.mobile.auto_platform_captain_location_ping.loadingLocation')}</Text>
          )}
        </View>

        {lastUpdate && (
          <View style={styles.lastUpdateCard}>
            <Text style={styles.lastUpdateText}>
              آخر إرسال: {new Date(lastUpdate).toLocaleString('ar-SA')}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.updateButton, isUpdating && styles.disabledButton]}
          onPress={sendLocationPing}
          disabled={isUpdating || !location}
        >
          <Text style={[styles.updateButtonText, isUpdating && styles.disabledText]}>
            {isUpdating ? t('surfaces.جاري_التحديث') : t('surfaces.تحديث_الموقع_الآن')}
          </Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          سياسة التتبع للكابتن (DSH و AMN): أثناء الرحلة يتم إرسال موقعك كل 30 ثانية، وخارج الرحلة كل 60 ثانية،
          بدون بث لحظي أو اشتراك خارجي، فقط تحديثات دورية لتحسين الخدمة وضمان السلامة.
        </Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: BTHWANI_SPACING.md,
    backgroundColor: BTHWANI_COLORS.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  locationCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: BTHWANI_COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  locationInfo: {
    gap: BTHWANI_SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    color: BTHWANI_COLORS.onSurfaceMuted,
    fontSize: 16,
  },
  lastUpdateCard: {
    backgroundColor: BTHWANI_COLORS.successSubtle,
    borderRadius: BTHWANI_RADIUS.sm,
    padding: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.md,
  },
  lastUpdateText: {
    color: BTHWANI_COLORS.success,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  updateButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  disabledButton: {
    backgroundColor: BTHWANI_COLORS.disabled,
  },
  updateButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: BTHWANI_COLORS.textDisabled,
  },
  note: {
    fontSize: 12,
    color: BTHWANI_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default AutoPlatformCaptainLocationPing;
