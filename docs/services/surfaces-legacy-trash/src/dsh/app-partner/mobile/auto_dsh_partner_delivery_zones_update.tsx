/**
 * DSH Partner Delivery Zones Update — dsh_partner_delivery_zones_update
 * Surface: app-partner | Service: dsh
 * Operation: POST /api/dsh/partner/store/zones
 *
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 * - Full states: Loading/Error/Success
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { safeGoBack } from '../../../shared/navigation/safeGoBack';
import {
  getDshPartnerDeliveryZoneConfigs,
  updateDshPartnerDeliveryZoneConfigs,
  type DshDeliveryZonePayload,
} from '@bthwani/api-clients/dsh/dsh-field-partner-api';

interface AutoDshPartnerDeliveryZonesUpdateProps {
  navigation?: any;
}

export const AutoDshPartnerDeliveryZonesUpdate: React.FC<AutoDshPartnerDeliveryZonesUpdateProps> = ({ navigation }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [zones, setZones] = useState<DshDeliveryZonePayload[]>([{ name: '' }]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const loadZones = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const zoneConfigs = await getDshPartnerDeliveryZoneConfigs();
      setZones(zoneConfigs.length > 0 ? zoneConfigs : [{ name: '' }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_delivery_zones_update.errorLoadZonesMessage'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadZones();
  }, [loadZones]);

  const handleAddZone = () => {
    setZones([...zones, { name: '' }]);
  };

  const handleRemoveZone = (index: number) => {
    if (zones.length > 1) {
      setZones(zones.filter((_, i) => i !== index));
    }
  };

  const handleZoneChange = (index: number, value: string) => {
    const newZones = [...zones];
    newZones[index] = { ...newZones[index], name: value };
    setZones(newZones);
  };

  const handleFeeChange = (index: number, value: string) => {
    const newZones = [...zones];
    const parsed = Number(value);
    newZones[index] = {
      ...newZones[index],
      deliveryFee: Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined,
    };
    setZones(newZones);
  };

  const handleSave = useCallback(async () => {
    const validZones = zones
      .map((zone) => ({
        ...zone,
        name: (zone.name ?? '').trim(),
      }))
      .filter((zone) => zone.name.length > 0);
    if (validZones.length === 0) {
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_delivery_zones_update.validationOneZoneRequired'), t('dsh.app-partner.mobile.auto_dsh_partner_delivery_zones_update.validationOneZoneRequired'));
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const ok = await updateDshPartnerDeliveryZoneConfigs(validZones);
      if (!ok) throw new Error('فشل في تحديث المناطق');

      setIsSuccess(true);
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_delivery_zones_update.successUpdateMessage'), t('dsh.app-partner.mobile.auto_dsh_partner_delivery_zones_update.successUpdateMessage'), [
        {
          text: t('dsh.app-partner.mobile.auto_dsh_partner_delivery_zones_update.okButton'),
          onPress: () => safeGoBack(navigation, 'dsh_partner_store_get')
        }
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_delivery_zones_update.errorUpdateMessage');
      setError(errorMessage);
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_delivery_zones_update.errorTitle'), errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [zones, navigation]);

  const getState = (): 'loading' | 'error' | 'success' | 'content' => {
    if (isLoading) return 'loading';
    if (isSuccess) return 'success';
    if (error) return 'error';
    return 'content';
  };

  return (
    <ScreenWrapper
      state={getState()}
      loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_delivery_zones_update.loadingMessage')}
      errorMessage={error || t('dsh.app-partner.mobile.auto_dsh_partner_delivery_zones_update.errorUnexpectedMessage')}
      errorActionText={t('dsh.app-partner.mobile.auto_dsh_partner_delivery_zones_update.retryButton')}
      onErrorAction={loadZones}
      successMessage={t('dsh.app-partner.mobile.auto_dsh_partner_delivery_zones_update.successUpdateTitle')}
      successActionText={t('dsh.app-partner.mobile.auto_dsh_partner_delivery_zones_update.backButton')}
      onSuccessAction={() => safeGoBack(navigation, 'dsh_partner_store_get')}
      screenName="auto_dsh_partner_delivery_zones_update"
      operationName="dsh_partner_delivery_zones_update"
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>مناطق التوصيل</Text>
          <Text style={styles.subtitle}>أدخل المناطق التي تقدم فيها التوصيل</Text>
        </View>

        {zones.map((zone, index) => (
          <View key={index} style={[styles.zoneRow, { flexDirection: 'row', direction: layoutDirection }]}>
            <TextInput
              style={styles.zoneInput}
              value={zone.name ?? ''}
              onChangeText={(value) => handleZoneChange(index, value)}
              placeholder={t('dsh.app-partner.mobile.auto_dsh_partner_delivery_zones_update.zoneNamePlaceholder')}
              placeholderTextColor={semanticRoles.textMuted}
            />
            <TextInput
              style={styles.feeInput}
              value={typeof zone.deliveryFee === 'number' ? String(zone.deliveryFee) : ''}
              onChangeText={(value) => handleFeeChange(index, value)}
              placeholder='رسوم'
              keyboardType='numeric'
              placeholderTextColor={semanticRoles.textMuted}
            />
            {zones.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveZone(index)}
              >
                <Text style={styles.removeButtonText}>حذف</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={handleAddZone}>
          <Text style={styles.addButtonText}>+ إضافة منطقة</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? t('dsh.app-partner.mobile.auto_dsh_partner_delivery_zones_update.saveZonesButton') : t('dsh.app-partner.mobile.auto_dsh_partner_delivery_zones_update.saveZonesButton')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  content: {
    padding: BTHWANI_SPACING.contentH,
  },
  header: {
    marginBottom: BTHWANI_SPACING.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  zoneRow: {
    flexDirection: 'row',
    marginBottom: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  zoneInput: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    color: semanticRoles.text,
    fontSize: 16,
  },
  feeInput: {
    width: 92,
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    paddingHorizontal: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    color: semanticRoles.text,
    fontSize: 14,
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: colorTokens.error['500'],
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: BTHWANI_COLORS.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: semanticRoles.primaryCTA,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AutoDshPartnerDeliveryZonesUpdate;

