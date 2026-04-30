/**
 * Field Partner Draft Submit — field_partner_draft_submit
 * Surface: app-field | Service: field
 * Operation: POST /api/field/partners/drafts/{draft_id}/submit
 * 
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

interface AutoFieldPartnerDraftSubmitProps {
  navigation?: any;
  route?: any;
}

const NS = 'field.app-field.mobile.auto_field_partner_draft_submit';

const AutoFieldPartnerDraftSubmit: React.FC<AutoFieldPartnerDraftSubmitProps> = ({ navigation, route }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const draftId = route?.params?.draftId || 'unknown';
  const [draftInfo, setDraftInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmations, setConfirmations] = useState({
    dataComplete: false,
    evidenceAttached: false,
    locationSet: false,
    hoursSet: false,
  });

  useEffect(() => {
    loadDraftInfo();
  }, [draftId]);

  const loadDraftInfo = async () => {
    try {
      setIsLoading(true);
      
      // const info = await getFieldPartnerDraft(draftId);
      await new Promise(resolve => setTimeout(resolve, 600));
      setDraftInfo({
        partnerName: t(`${NS}.mockPartnerName`),
        status: 'draft',
        hasEvidence: true,
        hasLocation: true,
        hasHours: false,
      });
    } catch (err) {
      Alert.alert(t(`${NS}.error`), t(`${NS}.loadDraftFailed`));
    } finally {
      setIsLoading(false);
    }
  };

  const allConfirmed = Object.values(confirmations).every(v => v);

  const handleSubmit = async () => {
    if (!allConfirmed) {
      Alert.alert(t(`${NS}.warning`), t(`${NS}.confirmAllItems`));
      return;
    }

    Alert.alert(
      t(`${NS}.confirmSubmitTitle`),
      t(`${NS}.confirmSubmitMessage`),
      [
        { text: t(`${NS}.cancel`), style: 'cancel' },
        {
          text: t(`${NS}.submit`),
          onPress: async () => {
            setIsSubmitting(true);
            try {
              // await submitFieldPartnerDraft(draftId);
              await new Promise(resolve => setTimeout(resolve, 1000));
              Alert.alert(t(`${NS}.success`), t(`${NS}.submitSuccess`), [
                { text: t(`${NS}.ok`), onPress: () => navigation?.navigate('field_partner_draft_create') },
              ]);
            } catch (err) {
              Alert.alert(t(`${NS}.error`), t(`${NS}.submitFailed`));
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t(`${NS}.loadingMessage`)}
        screenName="field_partner_draft_submit"
        operationName="field_partner_draft_submit"
      />
    );
  }

  return (
    <ScreenWrapper
      state="content"
      screenName="field_partner_draft_submit"
      operationName="field_partner_draft_submit"
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>📤 {t(`${NS}.title`)}</Text>
          <Text style={styles.subtitle}>{t(`${NS}.subtitle`)}</Text>
        </View>

        {draftInfo && (
          <View style={styles.draftCard}>
            <Text style={styles.draftName}>{draftInfo.partnerName}</Text>
            <Text style={styles.draftId}>{t(`${NS}.draftIdLabel`, { id: draftId })}</Text>
          </View>
        )}

        <View style={styles.checklist}>
          <Text style={styles.checklistTitle}>{t(`${NS}.checklistTitle`)}</Text>
          
          <TouchableOpacity
            style={[styles.checklistItem, { flexDirection: 'row', direction: layoutDirection }]}
            onPress={() => setConfirmations(prev => ({ ...prev, dataComplete: !prev.dataComplete }))}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, confirmations.dataComplete && styles.checkboxChecked]}>
              {confirmations.dataComplete && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.checklistItemContent}>
              <Text style={styles.checklistItemLabel}>{t(`${NS}.dataCompleteLabel`)}</Text>
              <Text style={styles.checklistItemDesc}>{t(`${NS}.dataCompleteDesc`)}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.checklistItem, { flexDirection: 'row', direction: layoutDirection }]}
            onPress={() => setConfirmations(prev => ({ ...prev, evidenceAttached: !prev.evidenceAttached }))}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, confirmations.evidenceAttached && styles.checkboxChecked]}>
              {confirmations.evidenceAttached && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.checklistItemContent}>
              <Text style={styles.checklistItemLabel}>{t(`${NS}.evidenceLabel`)}</Text>
              <Text style={styles.checklistItemDesc}>
                {t(`${NS}.evidenceDesc`, { status: draftInfo?.hasEvidence ? t(`${NS}.available`) : t(`${NS}.notAvailable`) })}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.checklistItem, { flexDirection: 'row', direction: layoutDirection }]}
            onPress={() => setConfirmations(prev => ({ ...prev, locationSet: !prev.locationSet }))}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, confirmations.locationSet && styles.checkboxChecked]}>
              {confirmations.locationSet && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.checklistItemContent}>
              <Text style={styles.checklistItemLabel}>{t(`${NS}.locationLabel`)}</Text>
              <Text style={styles.checklistItemDesc}>
                {t(`${NS}.locationDesc`, { status: draftInfo?.hasLocation ? t(`${NS}.available`) : t(`${NS}.notAvailable`) })}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.checklistItem, { flexDirection: 'row', direction: layoutDirection }]}
            onPress={() => setConfirmations(prev => ({ ...prev, hoursSet: !prev.hoursSet }))}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, confirmations.hoursSet && styles.checkboxChecked]}>
              {confirmations.hoursSet && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.checklistItemContent}>
              <Text style={styles.checklistItemLabel}>{t(`${NS}.hoursLabel`)}</Text>
              <Text style={styles.checklistItemDesc}>
                {t(`${NS}.hoursDesc`, { status: draftInfo?.hasHours ? t(`${NS}.available`) : t(`${NS}.notAvailable`) })}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>⚠️ {t(`${NS}.warningTitle`)}</Text>
          <Text style={styles.warningDesc}>{t(`${NS}.warningDesc`)}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.submitButton, !allConfirmed && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!allConfirmed || isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? t(`${NS}.submitInProgress`) : `📤 ${t(`${NS}.submitButton`)}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => navigation?.goBack()}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>{t(`${NS}.cancel`)}</Text>
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
  content: {
    padding: BTHWANI_SPACING.md,
    paddingBottom: BTHWANI_SPACING.xl,
  },
  header: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
  },
  draftCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
  },
  draftName: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  draftId: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  checklist: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  checklistTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BTHWANI_RADIUS.sm,
    borderWidth: 2,
    borderColor: semanticRoles.border,
    marginEnd: BTHWANI_SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  checkmark: {
    color: semanticRoles.primaryCTAText,
    fontSize: 14,
    fontWeight: 'bold',
  },
  checklistItemContent: {
    flex: 1,
  },
  checklistItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  checklistItemDesc: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  warningBox: {
    backgroundColor: colorTokens.warning['100'],
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
    borderWidth: 1,
    borderColor: colorTokens.warning['300'],
  },
  warningText: {
    fontSize: 16,
    fontWeight: '600',
    color: colorTokens.warning['800'],
    marginBottom: BTHWANI_SPACING.xs,
  },
  warningDesc: {
    fontSize: 14,
    color: colorTokens.warning['800'],
    lineHeight: 20,
  },
  actions: {
    gap: BTHWANI_SPACING.md,
  },
  actionButton: {
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  disabledButton: {
    backgroundColor: semanticRoles.textMuted,
    opacity: 0.5,
  },
  cancelButton: {
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  submitButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: semanticRoles.text,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AutoFieldPartnerDraftSubmit;
