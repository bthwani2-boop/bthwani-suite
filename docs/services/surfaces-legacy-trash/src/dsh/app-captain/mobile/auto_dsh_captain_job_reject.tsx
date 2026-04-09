// Auto-generated screen for dsh_captain_job_reject
// Surface: app-captain | Service: dsh
// Operation: POST /api/dsh/captain/jobs/{jobId}/reject
// Description: Reject job from job board

import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { rejectDshCaptainJob } from '@bthwani/api-clients/dsh/dsh-captain-api';

interface AutoDshCaptainJobRejectProps {
  navigation?: any;
  route?: {
    params?: {
      jobId: string;
      job?: {
        id: string;
        customer_name: string;
        pickup_location: string;
        delivery_location: string;
      };
    };
  };
}

export const AutoDshCaptainJobReject: React.FC<AutoDshCaptainJobRejectProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const jobId = route?.params?.jobId || '';
  const job = route?.params?.job;

  const handleReject = async () => {
    if (isProcessing) return;

    if (!reason.trim()) {
      Alert.alert(t('dsh.app-captain.mobile.auto_dsh_captain_job_reject.confirmRejectTitle'), t('dsh.app-captain.mobile.auto_dsh_captain_job_reject.confirmRejectTitle'));
      return;
    }

    setIsProcessing(true);
    try {
      const ok = await rejectDshCaptainJob(jobId, reason);
      if (!ok) throw new Error('فشل في الرفض');
      Alert.alert(
        t('dsh.app-captain.mobile.auto_dsh_captain_job_reject.alertTitle'),
        t('dsh.app-captain.mobile.auto_dsh_captain_job_reject.alertMessage'),
        [{ text: t('dsh.app-captain.mobile.auto_dsh_captain_job_reject.alertButtonBack'), onPress: () => (typeof navigation?.goBack === 'function' ? navigation.goBack() : navigation?.navigate?.('Home')) }]
      );
    } catch (error) {
      Alert.alert(t('dsh.app-captain.mobile.auto_dsh_captain_job_reject.errorTitle'), t('dsh.app-captain.mobile.auto_dsh_captain_job_reject.errorTitle'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScreenWrapper state="content">
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={[styles.title, textAlignStart]}>{t('dsh.app-captain.mobile.auto_dsh_captain_job_reject.title')}</Text>
          <Text style={[styles.subtitle, textAlignStart]}>
            {t('dsh.app-captain.mobile.auto_dsh_captain_job_reject.subtitle')}
          </Text>

          {job && (
            <View style={styles.jobInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_job_reject.infoLabelCustomer')}</Text>
                <Text style={[styles.infoValue, textAlignStart]}>{job.customer_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_job_reject.infoLabelFrom')}</Text>
                <Text style={[styles.infoValue, textAlignStart]}>{job.pickup_location}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_job_reject.infoLabelTo')}</Text>
                <Text style={[styles.infoValue, textAlignStart]}>{job.delivery_location}</Text>
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, textAlignStart]}>{t('dsh.app-captain.mobile.auto_dsh_captain_job_reject.inputLabel')}</Text>
            <TextInput
              style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={t('dsh.app-captain.mobile.auto_dsh_captain_job_reject.placeholderReason')}
              placeholderTextColor={semanticRoles.textMuted}
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={[styles.charCount, textAlignStart]}>
              {reason.length} / 200
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => (typeof navigation?.goBack === 'function' ? navigation.goBack() : navigation?.navigate?.('Home'))}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>{t('dsh.app-captain.mobile.auto_dsh_captain_job_reject.cancelButtonText')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.rejectButton, (!reason.trim() || isProcessing) && styles.rejectButtonDisabled]}
              onPress={handleReject}
              disabled={!reason.trim() || isProcessing}
              activeOpacity={0.8}
            >
              <Text style={styles.rejectButtonText}>
                {isProcessing ? t('dsh.app-captain.mobile.auto_dsh_captain_job_reject.submitButtonProcessing') : t('dsh.app-captain.mobile.auto_dsh_captain_job_reject.submitButtonProcessing')}
              </Text>
            </TouchableOpacity>
          </View>
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
  jobInfo: {
    backgroundColor: semanticRoles.bg,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.xs,
  },
  infoLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    flex: 1,
    marginStart: BTHWANI_SPACING.sm,
  },
  inputContainer: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  input: {
    backgroundColor: semanticRoles.bg,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.text,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    paddingVertical: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  cancelButtonText: {
    color: semanticRoles.text,
    fontSize: 16,
    fontWeight: '600',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: semanticRoles.stateError.icon,
    borderRadius: BTHWANI_RADIUS.md,
    paddingVertical: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  rejectButtonDisabled: {
    opacity: 0.5,
  },
  rejectButtonText: {
    color: colorTokens.surface.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AutoDshCaptainJobReject;

