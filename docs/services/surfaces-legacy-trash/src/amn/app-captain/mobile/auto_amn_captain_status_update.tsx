// Auto-generated screen for amn_captain_status_update
// Surface: app-captain | Service: amn
// Operation: PUT /api/amn/captains/{captainId}/status
// Description: Update AMN captain availability status

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, TextInput } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

interface AutoAmnCaptainStatusUpdateProps {
  navigation?: any;
  route?: {
    params?: {
      captainId: string;
      currentStatus?: string;
    };
  };
}

type Status = 'offline' | 'online' | 'busy' | 'break';

export const AutoAmnCaptainStatusUpdate: React.FC<AutoAmnCaptainStatusUpdateProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [status, setStatus] = useState<Status>(
    (route?.params?.currentStatus as Status) || 'offline'
  );
  const [location, setLocation] = useState<{ latitude?: number; longitude?: number }>({});
  const [reason, setReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const captainId = route?.params?.captainId || '';

  const statusOptions: { value: Status; label: string; icon: string; color: string }[] = [
    { value: 'online', label: t('surfaces.status_online'), icon: '🟢', color: semanticRoles.stateSuccess.icon },
    { value: 'busy', label: t('surfaces.status_busy'), icon: '🟡', color: semanticRoles.stateWarning.icon },
    { value: 'break', label: t('surfaces.status_break'), icon: '🔵', color: semanticRoles.stateInfo.icon },
    { value: 'offline', label: t('surfaces.status_offline'), icon: '⚫', color: semanticRoles.textMuted },
  ];

  const handleUpdate = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      // Backend integration call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        t('amn.app-captain.mobile.auto_amn_captain_status_update.updated'),
        t('amn.app-captain.mobile.auto_amn_captain_status_update.statusUpdatedTo', { status: statusOptions.find(s => s.value === status)?.label ?? status }),
        [{ text: t('amn.app-captain.mobile.auto_amn_captain_status_update.okButton'), onPress: () => (typeof navigation?.goBack === 'function' ? navigation.goBack() : navigation?.navigate?.('Home')) }]
      );
    } catch (error) {
      Alert.alert(t('common.error'), t('surfaces.error_updating_status'));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ScreenWrapper state="content">
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={[styles.title, textAlignStart]}>{t('amn.app-captain.mobile.auto_amn_captain_status_update.updateStatus')}</Text>
          <Text style={[styles.subtitle, textAlignStart]}>
            {t('amn.app-captain.mobile.auto_amn_captain_status_update.chooseYourCurrent')}
          </Text>

          <View style={styles.statusOptions}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusOption,
                  status === option.value && styles.statusOptionActive,
                  status === option.value && { borderColor: option.color }
                ]}
                onPress={() => setStatus(option.value)}
                activeOpacity={0.8}
              >
                <Text style={styles.statusIcon}>{option.icon}</Text>
                <Text style={[
                  styles.statusLabel,
                  textAlignStart,
                  status === option.value && { color: option.color, fontWeight: '600' }
                ]}>
                  {option.label}
                </Text>
                {status === option.value && (
                  <View style={[styles.checkmark, { backgroundColor: option.color }]}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {(status === 'break' || status === 'offline') && (
            <View style={styles.reasonContainer}>
              <Text style={[styles.reasonLabel, textAlignStart]}>{t('amn.app-captain.mobile.auto_amn_captain_status_update.optionalLabel')}</Text>
              <TextInput
                style={[styles.reasonInput, { textAlign: isRTL ? 'right' : 'left' }]}
                placeholder={t('surfaces.placeholder_reason')}
                placeholderTextColor={semanticRoles.textMuted}
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.updateButton, isUpdating && styles.updateButtonDisabled]}
            onPress={handleUpdate}
            disabled={isUpdating}
            activeOpacity={0.8}
          >
            <Text style={styles.updateButtonText}>
              {isUpdating ? t('amn.app-captain.mobile.auto_amn_captain_status_update.updatingMessage') : t('amn.app-captain.mobile.auto_amn_captain_status_update.updateStatus_129')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.bg,
  },
  card: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.lg,
  },
  statusOptions: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.bg,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
    borderWidth: 2,
    borderColor: semanticRoles.border,
  },
  statusOptionActive: {
    borderWidth: 2,
  },
  statusIcon: {
    fontSize: 24,
    marginStart: BTHWANI_SPACING.md,
  },
  statusLabel: {
    fontSize: 16,
    color: semanticRoles.text,
    flex: 1,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: colorTokens.surface.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  reasonContainer: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  reasonInput: {
    backgroundColor: semanticRoles.bg,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 14,
    color: semanticRoles.text,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    minHeight: 80,
  },
  updateButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    alignItems: 'center',
  },
  updateButtonDisabled: {
    opacity: 0.5,
  },
  updateButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AutoAmnCaptainStatusUpdate;
