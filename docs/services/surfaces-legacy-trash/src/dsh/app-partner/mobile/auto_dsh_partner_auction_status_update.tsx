/**
 * DSH Partner Auction Status Update — dsh_auction_status_update
 * Surface: app-partner | Service: dsh
 * Operation: PUT /api/dsh/auctions/{auctionId}/status
 * الشريك يحدّث حالة المزاد (مجدول / نشط / منتهي).
 * أهليّة المزاد تُحدَّد من CONTROL PANEL — إدارة المنتجات/الكتالوج (فئات أو منتجات مسموح لها بالمزاد).
 */

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { updateDshPartnerAuctionStatus } from '@bthwani/api-clients/dsh/dsh-field-partner-api';

interface Props {
  navigation?: { navigate: (screen: string) => void };
  route?: { params?: { auctionId?: string } };
}

const STATUS_OPTIONS: Array<'scheduled' | 'active' | 'ended'> = ['scheduled', 'active', 'ended'];

export const AutoDshPartnerAuctionStatusUpdate: React.FC<Props> = ({ navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [auctionId, setAuctionId] = useState(() => (route?.params?.auctionId ?? ''));
  const [status, setStatus] = useState<'scheduled' | 'active' | 'ended'>('active');
  const [reason, setReason] = useState('');
  const [submitState, setSubmitState] = useState<ScreenState>('content');
  const [lastResult, setLastResult] = useState<{ auctionId: string; status: string } | null>(null);

  const submit = useCallback(async () => {
    const id = (auctionId || (route?.params?.auctionId ?? '')).trim();
    if (!id) {
      setSubmitState('error');
      return;
    }
    setSubmitState('loading');
    try {
      const success = await updateDshPartnerAuctionStatus(id, status, reason);
      if (!success) throw new Error('Update failed');
      setLastResult({ auctionId: id, status });
      setSubmitState('content');
    } catch {
      setSubmitState('error');
    }
  }, [auctionId, route?.params?.auctionId, status, reason]);

  const handleRetry = () => {
    setSubmitState('content');
    void submit();
  };

  if (submitState === 'loading') {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_auction_status_update.loadingMessage')}
        screenName="auto_dsh_partner_auction_status_update"
        operationName="dsh_auction_status_update"
      />
    );
  }

  if (submitState === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('dsh.app-partner.mobile.auto_dsh_partner_auction_status_update.errorMessage')}
        onErrorAction={handleRetry}
        screenName="auto_dsh_partner_auction_status_update"
        operationName="dsh_auction_status_update"
      />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>{t('dsh.app-partner.mobile.auto_dsh_partner_auction_status_update.title')}</Text>
        <Text style={[styles.subtitle, textAlignStart]}>{t('dsh.app-partner.mobile.auto_dsh_partner_auction_status_update.subtitle')}</Text>
        <TextInput
          style={[styles.input, textAlignStart]}
          value={auctionId}
          onChangeText={setAuctionId}
          placeholder={t('dsh.app-partner.mobile.auto_dsh_partner_auction_status_update.auctionIdPlaceholder')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <View style={styles.statusRow}>
          <Text style={[styles.label, textAlignStart]}>{t('dsh.app-partner.mobile.auto_dsh_partner_auction_status_update.labelStatus')}</Text>
          {STATUS_OPTIONS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.statusBtn, status === s && styles.statusBtnActive]}
              onPress={() => setStatus(s)}
            >
              <Text style={[styles.statusBtnText, status === s && styles.statusBtnTextActive]}>
                {s === 'scheduled' ? t('dsh.app-partner.mobile.auto_dsh_partner_auction_status_update.statusActiveLabel') : s === 'active' ? t('dsh.app-partner.mobile.auto_dsh_partner_auction_status_update.statusActiveLabel') : t('dsh.app-partner.mobile.auto_dsh_partner_auction_status_update.statusEnded')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={[styles.input, textAlignStart, styles.reasonInput]}
          value={reason}
          onChangeText={setReason}
          placeholder={t('dsh.app-partner.mobile.auto_dsh_partner_auction_status_update.reasonOptionalPlaceholder')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={() => void submit()} disabled={!auctionId.trim()}>
          <Text style={styles.primaryButtonText}>{t('dsh.app-partner.mobile.auto_dsh_partner_auction_status_update.primaryButtonText')}</Text>
        </TouchableOpacity>
        {lastResult && (
          <View style={styles.result}>
            <Text style={[styles.resultText, textAlignStart]}>{t('dsh.app-partner.mobile.auto_dsh_partner_auction_status_update.resultUpdatedTemplate', { auctionId: lastResult.auctionId, status: lastResult.status })}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.navigate('dsh_partner_store_get')}>
          <Text style={styles.backText}>{t('dsh.app-partner.mobile.auto_dsh_partner_auction_status_update.backText')}</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  reasonInput: { marginBottom: BTHWANI_SPACING.sm },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.lg,
  },
  statusBtn: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  statusBtnActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  statusBtnText: { fontSize: 14, color: semanticRoles.onSurface },
  statusBtnTextActive: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  primaryButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  result: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.lg,
  },
  resultText: { fontSize: 14, color: semanticRoles.onSurface, },
  backButton: {
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  backText: { fontSize: 16, fontWeight: '600', color: semanticRoles.onSurface },
});

export default AutoDshPartnerAuctionStatusUpdate;


