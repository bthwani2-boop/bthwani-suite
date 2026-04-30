// KNZ Listing Report — نموذج إبلاغ عن إعلان ثم نجاح وعودة
// Surface: app-client | Service: knz
// §30 States: Content / Loading / Error / Success

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

const REPORT_REASON_IDS = ['spam', 'fraud', 'inappropriate', 'wrong_category', 'other'] as const;
const NS = 'knz.app-client.mobile.auto_knz_listing_report';

interface auto_knz_listing_reportProps {
  listingId?: string;
  onNavigate?: (screen: string, params?: Record<string, string>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, string>) => void; goBack?: () => void };
}

export const auto_knz_listing_report: React.FC<auto_knz_listing_reportProps> = ({
  listingId,
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const reasonKeyMap: Record<string, string> = {
    spam: 'reasonSpam',
    fraud: 'reasonFraud',
    inappropriate: 'reasonInappropriate',
    wrong_category: 'reasonWrongCategory',
    other: 'reasonOther',
  };
  const reportReasons = useMemo(() => REPORT_REASON_IDS.map((id) => ({
    id,
    label: t(`${NS}.${reasonKeyMap[id]}`),
  })), [t]);
  const [state, setState] = useState<ScreenState>('content');
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = useCallback(() => {
    if (!reason) return;
    setState('loading');
    setTimeout(() => setState('success'), 1500);
  }, [reason]);

  const handleSuccessAction = useCallback(() => {
    if (navigation?.goBack) navigation.goBack();
    else if (onNavigate) {
      if (listingId) onNavigate('KnzListingGet', { listingId });
      else onNavigate('KnzListingsList');
    }
  }, [navigation, listingId, onNavigate]);

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <Text style={[styles.title, textAlignStart]}>{t(`${NS}.title`)}</Text>
          <Text style={[styles.subtitle, textAlignStart]}>{t(`${NS}.subtitle`)}</Text>

          <View style={styles.disclaimerBanner}>
            <Text style={[styles.disclaimerText, textAlignStart]}>{t(`${NS}.disclaimer`)}</Text>
          </View>

          <Text style={styles.label}>{t(`${NS}.reasonLabel`)}</Text>
          <View style={styles.reasons}>
            {reportReasons.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={[styles.reasonChip, reason === r.id && styles.reasonChipSelected]}
                onPress={() => setReason(r.id)}
              >
                <Text style={[styles.reasonText, textAlignStart, reason === r.id && styles.reasonTextSelected]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{t(`${NS}.detailsLabel`)}</Text>
          <TextInput
            style={styles.input}
            placeholder={t(`${NS}.detailsPlaceholder`)}
            placeholderTextColor={semanticRoles.textMuted}
            value={details}
            onChangeText={setDetails}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            style={[styles.submitButton, !reason && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!reason}
          >
            <Text style={styles.submitText}>{t(`${NS}.submitButton`)}</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('knz.app-client.mobile.auto_knz_listing_report.loadingMessage')}
      errorMessage={t('knz.app-client.mobile.auto_knz_listing_report.errorMessage')}
      successMessage={t('knz.app-client.mobile.auto_knz_listing_report.successMessage')}
      successActionText={t('knz.app-client.mobile.auto_knz_listing_report.successActionText')}
      onSuccessAction={handleSuccessAction}
      screenName="auto_knz_listing_report"
      operationName="knz_listing_report"
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: semanticRoles.surfaceSubtle },
  content: { padding: BTHWANI_SPACING.contentH, paddingBottom: BTHWANI_SPACING.xl * 2 },
  title: { fontSize: 22, fontWeight: '700', color: semanticRoles.text, marginBottom: BTHWANI_SPACING.xs },
  subtitle: { fontSize: 14, color: semanticRoles.textMuted, marginBottom: BTHWANI_SPACING.lg },
  disclaimerBanner: {
    backgroundColor: semanticRoles.warning + '18',
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
    borderLeftWidth: 3,
    borderLeftColor: semanticRoles.warning,
  },
  disclaimerText: {
    fontSize: 13,
    color: semanticRoles.text,
  },
  label: { fontSize: 14, fontWeight: '600', color: semanticRoles.text, marginBottom: BTHWANI_SPACING.sm },
  reasons: { marginBottom: BTHWANI_SPACING.lg },
  reasonChip: {
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    backgroundColor: semanticRoles.surface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  reasonChipSelected: { borderColor: semanticRoles.primaryCTA, backgroundColor: semanticRoles.primaryCTA + '15' },
  reasonText: { fontSize: 15, color: semanticRoles.text, },
  reasonTextSelected: { color: semanticRoles.primaryCTA, fontWeight: '600' },
  input: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.text,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: BTHWANI_SPACING.lg,
  },
  submitButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitText: { color: semanticRoles.primaryCTAText ?? semanticRoles.surface, fontSize: 16, fontWeight: '600' },
});

export default auto_knz_listing_report;

