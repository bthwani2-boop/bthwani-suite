// KNZ Auction Get — تفاصيل مزاد، وضع عرض، وعند الإغلاق: الفائز + تنبيه السياسة
// Surface: app-client | Service: knz
// مرجع: KNZ_POLICY §4 — تنبيه: إتمام الصفقة والدفع بينك وبين الطرف الآخر؛ المنصة لا تحجز ولا تضمن المبالغ

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { KnzPolicyDisclaimer } from './components/KnzPolicyDisclaimer';
import { buildKnzAuctionGetMock } from '../../hooks';

interface auto_knz_auction_getProps {
  auctionId?: string;
  onNavigate?: (screen: string, params?: Record<string, string>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, string>) => void; goBack?: () => void };
}

const NS = 'knz.app-client.mobile.auto_knz_auction_get';

export const auto_knz_auction_get: React.FC<auto_knz_auction_getProps> = ({
  auctionId,
  onNavigate,
  navigation,
}) => {
  const { t } = useI18n();
  const [state, setState] = useState<ScreenState>('loading');
  const [bidAmount, setBidAmount] = useState('');
  const aid = auctionId ?? 'A1';

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, string>) => {
      if (navigation?.navigate) navigation.navigate(screen, params);
      else if (onNavigate) onNavigate(screen, params);
    },
    [navigation, onNavigate]
  );

  useEffect(() => {
    const timer = setTimeout(() => setState('content'), 800);
    return () => clearTimeout(timer);
  }, []);

  const auction = useMemo(() => buildKnzAuctionGetMock(t, aid), [t, aid]);

  const handlePlaceBid = () => {
    if (!bidAmount.trim() || auction.status !== 'open') return;
    setState('loading');
    setTimeout(() => setState('content'), 1000);
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          {navigation?.goBack && (
            <TouchableOpacity style={styles.backRow} onPress={navigation.goBack}>
              <Text style={styles.backText}>← {t(`${NS}.back`)}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{auction.title}</Text>
          <View style={[styles.statusBadge, auction.status === 'open' ? styles.statusOpen : styles.statusClosed]}>
            <Text style={styles.statusText}>{auction.status === 'open' ? t(`${NS}.open`) : t(`${NS}.closed`)}</Text>
          </View>
          <View style={styles.priceCard}>
            <Text style={styles.priceLabel}>{t(`${NS}.currentPrice`)}</Text>
            <Text style={styles.price}>{auction.currentPrice.toLocaleString()} SAR</Text>
            <Text style={styles.bidsCount}>{t(`${NS}.bidsCount`, { count: auction.bidsCount })}</Text>
          </View>
          <View style={styles.detailsCard}>
            <Text style={styles.detailRow}>{t(`${NS}.seller`)}: {auction.sellerName}</Text>
            <Text style={styles.detailRow}>{t(`${NS}.endsAt`)}: {auction.endsAt}</Text>
          </View>

          {auction.status === 'open' && (
            <View style={styles.bidSection}>
              <Text style={styles.bidLabel}>{t(`${NS}.bidLabel`, { min: auction.minIncrement })}</Text>
              <TextInput
                style={styles.bidInput}
                value={bidAmount}
                onChangeText={setBidAmount}
                placeholder={t(`${NS}.enterAmount`)}
                placeholderTextColor={semanticRoles.textMuted}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[styles.bidButton, !bidAmount.trim() && styles.bidButtonDisabled]}
                onPress={handlePlaceBid}
                disabled={!bidAmount.trim()}
              >
                <Text style={styles.bidButtonText}>{t(`${NS}.placeBid`)}</Text>
              </TouchableOpacity>
            </View>
          )}

          {auction.status === 'closed' && auction.winnerName && (
            <>
              <View style={styles.winnerCard}>
                <Text style={styles.winnerLabel}>{t(`${NS}.winner`)}</Text>
                <Text style={styles.winnerName}>{auction.winnerName}</Text>
              </View>
              <KnzPolicyDisclaimer variant="auction" />
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => handleNavigate('KnzChatThreadList', { listingId: auction.id })}
              >
                <Text style={styles.contactButtonText}>{t(`${NS}.contactSeller`)}</Text>
              </TouchableOpacity>
              <Text style={styles.disclaimerSubtext}>{t(`${NS}.disclaimer`)}</Text>
            </>
          )}

          {auction.status === 'open' && (
            <KnzPolicyDisclaimer variant="auction" />
          )}
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t(NS + '.loadingMessage')}
      errorMessage={t(NS + '.errorMessage')}
      onErrorAction={() => setState('content')}
      screenName="auto_knz_auction_get"
      operationName="knz_auction_get"
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: semanticRoles.surfaceSubtle },
  content: { padding: BTHWANI_SPACING.contentH, paddingBottom: BTHWANI_SPACING.xl * 2 },
  backRow: { marginBottom: BTHWANI_SPACING.md },
  backText: { fontSize: 16, color: semanticRoles.primaryCTA },
  title: { fontSize: 20, fontWeight: '700', color: semanticRoles.text, marginBottom: BTHWANI_SPACING.sm },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  statusOpen: { backgroundColor: semanticRoles.success + '25' },
  statusClosed: { backgroundColor: semanticRoles.textMuted + '25' },
  statusText: { fontSize: 13, fontWeight: '600', color: semanticRoles.text },
  priceCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  priceLabel: { fontSize: 13, color: semanticRoles.textMuted, marginBottom: BTHWANI_SPACING.xs },
  price: { fontSize: 24, fontWeight: '700', color: semanticRoles.primaryCTA },
  bidsCount: { fontSize: 12, color: semanticRoles.textMuted, marginTop: BTHWANI_SPACING.xs },
  detailsCard: { marginBottom: BTHWANI_SPACING.lg },
  detailRow: { fontSize: 14, color: semanticRoles.text, marginBottom: BTHWANI_SPACING.xs },
  bidSection: { marginBottom: BTHWANI_SPACING.lg },
  bidLabel: { fontSize: 13, color: semanticRoles.textMuted, marginBottom: BTHWANI_SPACING.sm },
  bidInput: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    marginBottom: BTHWANI_SPACING.md,
  },
  bidButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  bidButtonDisabled: { opacity: 0.5 },
  bidButtonText: { color: semanticRoles.primaryCTAText ?? semanticRoles.surface, fontSize: 16, fontWeight: '600' },
  winnerCard: {
    backgroundColor: semanticRoles.success + '15',
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.success,
  },
  winnerLabel: { fontSize: 12, color: semanticRoles.textMuted, marginBottom: BTHWANI_SPACING.xs },
  winnerName: { fontSize: 18, fontWeight: '700', color: semanticRoles.text },
  disclaimerSubtext: { fontSize: 12, color: semanticRoles.textMuted, marginTop: BTHWANI_SPACING.sm },
  contactButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  contactButtonText: { color: semanticRoles.primaryCTAText ?? semanticRoles.surface, fontSize: 16, fontWeight: '600' },
});

export default auto_knz_auction_get;

