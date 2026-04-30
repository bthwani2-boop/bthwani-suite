// amn_captain_availability_update — تحديث توفر الكابتن (متاح / غير متاح)
// Surface: app-captain | Service: amn
// واجهة بسيطة لتحديث حالة التوفر مع حفظ ورجوع.

import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

type Availability = 'available' | 'unavailable';

interface AutoAmnCaptainAvailabilityUpdateProps {
  navigation?: { goBack: () => void };
  route?: { params?: { captainId?: string } };
}

export const AutoAmnCaptainAvailabilityUpdate: React.FC<AutoAmnCaptainAvailabilityUpdateProps> = ({
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [availability, setAvailability] = useState<Availability>('available');
  const [submitting, setSubmitting] = useState(false);

  const options: { value: Availability; label: string; icon: string }[] = [
    { value: 'available', label: t('surfaces.availability_available'), icon: '🟢' },
    { value: 'unavailable', label: t('surfaces.availability_unavailable'), icon: '⚫' },
  ];

  const handleSave = useCallback(() => {
    if (submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        t('amn.captain.availability.updated'),
        availability === 'available'
          ? t('amn.captain.availability.availableMessage')
          : t('amn.captain.availability.unavailableMessage'),
        [{ text: t('common.ok'), onPress: () => navigation?.goBack?.() }]
      );
    }, 1000);
  }, [availability, submitting, navigation]);

  return (
    <ScreenWrapper state="content">
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={[styles.title, textAlignStart]}>{t('amn.captain.availability.title')}</Text>
        <Text style={[styles.subtitle, textAlignStart]}>{t('amn.captain.availability.subtitle')}</Text>

        <View style={styles.options}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.option,
                availability === opt.value && styles.optionActive,
              ]}
              onPress={() => setAvailability(opt.value)}
              activeOpacity={0.8}
            >
              <Text style={styles.optionIcon}>{opt.icon}</Text>
              <Text
                style={[
                  styles.optionLabel,
                  availability === opt.value && styles.optionLabelActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={submitting}
        >
          <Text style={styles.saveButtonText}>
            {submitting ? t('amn.captain.availability.saving') : t('common.save')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backLink} onPress={() => navigation?.goBack?.()}>
          <Text style={styles.backLinkText}>← {t('common.back')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: semanticRoles.surfaceSubtle },
  content: { padding: BTHWANI_SPACING.contentH, paddingBottom: BTHWANI_SPACING.xl },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.lg,
  },
  options: { marginBottom: BTHWANI_SPACING.xl },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.sm,
    borderWidth: 2,
    borderColor: semanticRoles.border,
  },
  optionActive: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  optionIcon: { fontSize: 24, marginStart: BTHWANI_SPACING.md },
  optionLabel: { fontSize: 16, color: semanticRoles.text, flex: 1 },
  optionLabelActive: { fontWeight: '600', color: semanticRoles.primaryCTA },
  saveButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  saveButtonText: { color: semanticRoles.primaryCTAText ?? semanticRoles.surface, fontSize: 16, fontWeight: '600' },
  saveButtonDisabled: { opacity: 0.6 },
  backLink: { alignItems: 'center', padding: BTHWANI_SPACING.md },
  backLinkText: { fontSize: 14, color: semanticRoles.primaryCTA, fontWeight: '500' },
});

export default AutoAmnCaptainAvailabilityUpdate;
