/**
 * DSH Partner Hours Update — dsh_partner_hours_update
 * Surface: app-partner | Service: dsh
 * Operation: POST /api/dsh/partner/store/hours
 *
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 * - Full states: Loading/Error/Success
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import {
  BTHWANI_COLORS,
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { safeGoBack } from '../../../shared/navigation/safeGoBack';
import {
  getDshPartnerStoreHours,
  updateDshPartnerStoreHours,
} from '@bthwani/api-clients/dsh/dsh-field-partner-api';

const NS = 'dsh.app-partner.mobile.auto_dsh_partner_hours_update';
const DAY_KEYS = [
  `${NS}.k27`,
  `${NS}.k28`,
  'surfaces.الثلاثاء',
  'surfaces.الأربعاء',
  'surfaces.الخميس',
  'surfaces.الجمعة',
  'surfaces.السبت',
] as const;

interface AutoDshPartnerHoursUpdateProps {
  navigation?: any;
}

interface DayHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export const AutoDshPartnerHoursUpdate: React.FC<
  AutoDshPartnerHoursUpdateProps
> = ({ navigation }) => {
  const { t, isRTL } = useI18n();
  const DAYS = useMemo(() => DAY_KEYS.map(key => t(key)), [t]);
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [hours, setHours] = useState<DayHours[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const loadHours = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const list = await getDshPartnerStoreHours();
      const defaultHours: DayHours[] = DAYS.map(day => ({
        day,
        isOpen: true,
        openTime: '09:00',
        closeTime: '22:00',
      }));
      if (list.length > 0) {
        const merged = DAYS.map(day => {
          const found = list.find((h: { day?: string }) => h.day === day);
          return found
            ? {
                day,
                isOpen: found.isOpen !== false,
                openTime: found.openTime ?? '09:00',
                closeTime: found.closeTime ?? '22:00',
              }
            : { day, isOpen: true, openTime: '09:00', closeTime: '22:00' };
        });
        setHours(merged);
      } else {
        setHours(defaultHours);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t(`${NS}.k65`));
    } finally {
      setIsLoading(false);
    }
  }, [DAYS, t]);

  useEffect(() => {
    loadHours();
  }, [loadHours]);

  const toggleDay = (index: number) => {
    const newHours = [...hours];
    newHours[index].isOpen = !newHours[index].isOpen;
    setHours(newHours);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      setError(null);

      const payload = hours.map(h => ({
        day: h.day,
        isOpen: h.isOpen,
        openTime: h.openTime,
        closeTime: h.closeTime,
      }));
      const ok = await updateDshPartnerStoreHours(payload);
      if (!ok) throw new Error(t(`${NS}.updateFail`));

      setIsSuccess(true);
      Alert.alert(t(`${NS}.k97`), t(`${NS}.k97`), [
        {
          text: t(`${NS}.k99`),
          onPress: () => safeGoBack(navigation, 'dsh_partner_store_get'),
        },
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t(`${NS}.k104`);
      setError(errorMessage);
      Alert.alert(t(`${NS}.k106`), errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [hours, navigation, t]);

  const getState = (): 'loading' | 'error' | 'success' | 'content' => {
    if (isLoading) return 'loading';
    if (isSuccess) return 'success';
    if (error) return 'error';
    return 'content';
  };

  return (
    <ScreenWrapper
      state={getState()}
      loadingMessage={t(
        'dsh.app-partner.mobile.auto_dsh_partner_hours_update.loadingMessage'
      )}
      errorMessage={
        error || t('dsh.app-partner.mobile.auto_dsh_partner_hours_update.errorMessage')
      }
      errorActionText={t(
        'dsh.app-partner.mobile.auto_dsh_partner_hours_update.retryButton'
      )}
      onErrorAction={loadHours}
      successMessage={t(
        'dsh.app-partner.mobile.auto_dsh_partner_hours_update.successUpdateTitle'
      )}
      successActionText={t(
        'dsh.app-partner.mobile.auto_dsh_partner_hours_update.backButton'
      )}
      onSuccessAction={() => safeGoBack(navigation, 'dsh_partner_store_get')}
      screenName='auto_dsh_partner_hours_update'
      operationName='dsh_partner_hours_update'
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('dsh.app-partner.mobile.auto_dsh_partner_hours_update.title')}</Text>
        </View>

        {hours.map((dayHours, index) => (
          <View key={index} style={styles.dayCard}>
            <View style={[styles.dayHeader, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.dayName}>{dayHours.day}</Text>
              <TouchableOpacity
                style={[styles.toggle, dayHours.isOpen && styles.toggleActive]}
                onPress={() => toggleDay(index)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    dayHours.isOpen && styles.toggleTextActive,
                  ]}
                >
                  {dayHours.isOpen
                    ? t(
                        'dsh.app-partner.mobile.auto_dsh_partner_hours_update.closedLabel'
                      )
                    : t(
                        'dsh.app-partner.mobile.auto_dsh_partner_hours_update.closedLabel'
                      )}
                </Text>
              </TouchableOpacity>
            </View>
            {dayHours.isOpen && (
              <View style={[styles.timeRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.timeLabel}>من:</Text>
                <Text style={styles.timeValue}>{dayHours.openTime}</Text>
                <Text style={styles.timeLabel}>إلى:</Text>
                <Text style={styles.timeValue}>{dayHours.closeTime}</Text>
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving
              ? t('dsh.app-partner.mobile.auto_dsh_partner_hours_update.saveButtonText')
              : t('dsh.app-partner.mobile.auto_dsh_partner_hours_update.saveButtonText')}
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
  },
  dayCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  toggle: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  toggleActive: {
    backgroundColor: colorTokens.success['600'],
    borderColor: colorTokens.success['600'],
  },
  toggleText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: 'white',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  timeLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  timeValue: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '600',
    marginEnd: BTHWANI_SPACING.md,
  },
  saveButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.md,
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

export default AutoDshPartnerHoursUpdate;
