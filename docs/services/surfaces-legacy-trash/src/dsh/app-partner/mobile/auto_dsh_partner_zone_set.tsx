/**
 * DSH Partner Zone Set — dsh_zone_set
 * Surface: app-partner | Operation: POST /dsh/zone/set (via api-clients)
 * تعيين نطاق التوصيل (الشريك يحدد المناطق التي يخدمها المتجر).
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { setDshPartnerZone } from '@bthwani/api-clients/dsh/dsh-field-partner-api';
import { buildDshPartnerZoneSetMock, type Zone } from '../../hooks';
import { safeGoBack } from '../../../shared/navigation/safeGoBack';

interface AutoDshPartnerZoneSetProps {
  navigation?: { navigate: (name: string) => void; goBack?: () => void };
}

export const AutoDshPartnerZoneSet: React.FC<AutoDshPartnerZoneSetProps> = ({ navigation }) => {
  const { t } = useI18n();
  const zones = useMemo(() => buildDshPartnerZoneSetMock(t), [t]);
  const [state, setState] = useState<ScreenState>('content');
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setState('content');
  }, []);

  const handleSaveZone = async () => {
    if (!selectedZone) return;
    setSaving(true);
    try {
      const zoneName = zones.find((z) => z.id === selectedZone)?.name ?? selectedZone;
      const ok = await setDshPartnerZone(selectedZone, zoneName);
      if (!ok) {
        throw new Error('فشل في الحفظ');
      }
      safeGoBack(navigation, 'dsh_partner_store_get');
    } catch {
      setState('error');
    } finally {
      setSaving(false);
    }
  };

  const handleRetry = () => setState('content');

  const renderZone = ({ item }: { item: Zone }) => (
    <TouchableOpacity
      style={[
        styles.zoneCard,
        selectedZone === item.id && styles.selectedZoneCard,
        !item.isAvailable && styles.disabledZoneCard,
      ]}
      onPress={() => item.isAvailable && setSelectedZone(item.id)}
      disabled={!item.isAvailable}
    >
      <View style={styles.zoneHeader}>
        <Text style={styles.zoneName}>{item.name}</Text>
        <Text style={styles.zoneCity}>{item.city}</Text>
      </View>
      <View style={styles.zoneDetails}>
        <Text style={styles.detailValue}>
          {item.deliveryFee === 0 ? t('dsh.app-partner.mobile.auto_dsh_partner_zone_set.freeLabel') : `${item.deliveryFee} ريال`} — {item.estimatedTime}
        </Text>
      </View>
      {selectedZone === item.id && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.selectedText}>✓ محدد</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (state === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('dsh.app-partner.mobile.auto_dsh_partner_zone_set.errorSaveMessage')}
        onErrorAction={handleRetry}
        screenName="auto_dsh_partner_zone_set"
        operationName="dsh_zone_set"
      />
    );
  }

  return (
    <ScreenWrapper state="content" screenName="auto_dsh_partner_zone_set" operationName="dsh_zone_set">
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>نطاق التوصيل</Text>
          <Text style={styles.subtitle}>حدد المناطق التي يخدمها متجرك</Text>
        </View>
        <FlatList
          data={zones}
          keyExtractor={(item) => item.id}
          renderItem={renderZone}
          scrollEnabled={false}
          contentContainerStyle={styles.zonesList}
        />
        <TouchableOpacity
          style={[styles.saveButton, (!selectedZone || saving) && styles.disabledButton]}
          onPress={() => selectedZone && void handleSaveZone()}
          disabled={!selectedZone || saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? t('dsh.app-partner.mobile.auto_dsh_partner_zone_set.saveZoneButton') : selectedZone ? t('dsh.app-partner.mobile.auto_dsh_partner_zone_set.saveZoneButton') : 'اختر منطقة'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => safeGoBack(navigation, 'dsh_partner_store_get')}
        >
          <Text style={styles.backButtonText}>إلغاء</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: semanticRoles.surfaceSubtle },
  content: { padding: BTHWANI_SPACING.contentH },
  header: { marginBottom: BTHWANI_SPACING.xl },
  title: { fontSize: 24, fontWeight: '700', color: semanticRoles.onSurface, marginBottom: BTHWANI_SPACING.xs },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted },
  zonesList: { marginBottom: BTHWANI_SPACING.lg },
  zoneCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.sm,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  selectedZoneCard: { borderColor: semanticRoles.primaryCTA, borderWidth: 2 },
  disabledZoneCard: { opacity: 0.6 },
  zoneHeader: { marginBottom: BTHWANI_SPACING.xs },
  zoneName: { fontSize: 16, fontWeight: '600', color: semanticRoles.onSurface },
  zoneCity: { fontSize: 14, color: semanticRoles.onSurfaceMuted },
  zoneDetails: { marginTop: BTHWANI_SPACING.xs },
  detailValue: { fontSize: 14, color: semanticRoles.onSurfaceMuted },
  selectedIndicator: { marginTop: BTHWANI_SPACING.sm },
  selectedText: { fontSize: 14, fontWeight: '600', color: semanticRoles.primaryCTA },
  saveButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  disabledButton: { opacity: 0.5 },
  saveButtonText: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  backButton: { padding: BTHWANI_SPACING.md, alignItems: 'center' },
  backButtonText: { color: semanticRoles.onSurface, fontWeight: '600' },
});

export default AutoDshPartnerZoneSet;
