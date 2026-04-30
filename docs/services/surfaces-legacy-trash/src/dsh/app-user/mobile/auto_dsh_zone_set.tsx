// Auto-generated screen for dsh_zone_set
// Surface: app-client | Service: dsh | Operation: POST /api/dsh/zone/set
// §30 States: Loading / Error / Content — اختيار منطقة ثم نقر حفظ

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';
import { buildDshZoneSetMock, type Zone } from '../../hooks';

interface auto_dsh_zone_setProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_dsh_zone_set: React.FC<auto_dsh_zone_setProps> = ({ onNavigate, navigation }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('loading');
  const [selectedZone, setSelectedZone] = useState<string>('');

  useEffect(() => {
    setState('content');
  }, []);

  const [saving, setSaving] = useState(false);

  const handleRetry = () => {
    setState('content');
  };

  const handleSaveZone = async () => {
    if (!selectedZone) return;
    setSaving(true);
    try {
      const url = `${getBaseUrl()}/api/dsh/zone/set`;
      const res = await rawFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zoneId: selectedZone,
          zoneName: zones.find((z) => z.id === selectedZone)?.name ?? selectedZone,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في الحفظ');
      handleNavigate('DshHome');
    } catch {
      setState('error');
    } finally {
      setSaving(false);
    }
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) {
      navigation.navigate(screen);
    } else if (onNavigate) {
      onNavigate(screen);
    }
  };

  const zones = useMemo(() => buildDshZoneSetMock(t), [t]);

  const renderZone = ({ item }: { item: Zone }) => (
    <TouchableOpacity
      style={[
        styles.zoneCard,
        selectedZone === item.id && styles.selectedZoneCard,
        !item.isAvailable && styles.disabledZoneCard
      ]}
      onPress={() => item.isAvailable && setSelectedZone(item.id)}
      disabled={!item.isAvailable}
    >
      <View style={styles.zoneHeader}>
        <Text style={styles.zoneName}>{item.name}</Text>
        <Text style={styles.zoneCity}>{item.city}</Text>
      </View>

      <View style={styles.zoneDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>🚚 رسوم التوصيل:</Text>
          <Text style={styles.detailValue}>
            {item.deliveryFee === 0 ? t('dsh.app-client.mobile.auto_dsh_zone_set.freeLabel') : `${item.deliveryFee} ريال`}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>⏱️ وقت التوصيل:</Text>
          <Text style={styles.detailValue}>{item.estimatedTime}</Text>
        </View>
        {!item.isAvailable && (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>غير متاح حالياً</Text>
          </View>
        )}
      </View>

      {selectedZone === item.id && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.selectedText}>✓ محدد</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>اختر منطقتك</Text>
            <Text style={styles.subtitle}>حدد المنطقة للحصول على أفضل خدمة توصيل</Text>
          </View>

          <View style={styles.currentLocation}>
            <Text style={[styles.locationTitle, textAlignStart]}>موقعك الحالي</Text>
            <View style={styles.locationCard}>
              <Text style={styles.locationIcon}>📍</Text>
              <View style={styles.locationInfo}>
                <Text style={styles.locationText}>وسط الرياض، الرياض</Text>
                <Text style={styles.locationSubtext}>تم تحديد الموقع تلقائياً</Text>
              </View>
              <TouchableOpacity style={styles.changeLocationButton}>
                <Text style={styles.changeLocationText}>تغيير</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.zonesSection}>
            <Text style={[styles.sectionTitle, textAlignStart]}>المناطق المتاحة</Text>
            <FlatList
              data={zones}
              keyExtractor={(item) => item.id}
              renderItem={renderZone}
              contentContainerStyle={styles.zonesList}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, (!selectedZone || saving) && styles.disabledButton]}
            onPress={() => selectedZone && void handleSaveZone()}
            disabled={!selectedZone || saving}
          >
            <Text style={[styles.saveText, (!selectedZone || saving) && styles.disabledText]}>
              {saving ? t('dsh.app-client.mobile.auto_dsh_zone_set.savingLabel') : selectedZone ? 'حفظ المنطقة' : 'اختر منطقة أولاً'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={() => handleNavigate('DshHome')}>
            <Text style={styles.skipText}>تخطي واستمر</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('dsh.app-client.mobile.auto_dsh_zone_set.loadingMessage')}
      errorMessage={t('dsh.app-client.mobile.auto_dsh_zone_set.errorMessage')}
      onErrorAction={handleRetry}
      screenName="auto_dsh_zone_set"
      operationName="dsh_zone_set"
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
    color: semanticRoles.text,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  currentLocation: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationIcon: {
    fontSize: 24,
    marginEnd: BTHWANI_SPACING.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  locationSubtext: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  changeLocationButton: {
    padding: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
  },
  changeLocationText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 12,
    fontWeight: '600',
  },
  zonesSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  zonesList: {
    padding: BTHWANI_SPACING.contentH,
  },
  zoneCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedZoneCard: {
    borderColor: semanticRoles.primaryCTACTA,
    backgroundColor: semanticRoles.stateInfo.background,
  },
  disabledZoneCard: {
    opacity: 0.6,
  },
  zoneHeader: {
    marginBottom: BTHWANI_SPACING.md,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  zoneCity: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  zoneDetails: {
    marginBottom: BTHWANI_SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  detailLabel: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: semanticRoles.primaryCTACTA,
    fontWeight: '600',
  },
  unavailableBadge: {
    backgroundColor: semanticRoles.stateError.icon,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
    alignSelf: 'flex-start',
    marginTop: BTHWANI_SPACING.sm,
  },
  unavailableText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: BTHWANI_SPACING.md,
    start: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  selectedText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 12,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  saveText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '600',
  },
  disabledText: {
    color: semanticRoles.textMuted,
  },
  skipButton: {
    backgroundColor: 'transparent',
    padding: BTHWANI_SPACING.contentH,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  skipText: {
    color: semanticRoles.textMuted,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default auto_dsh_zone_set;

