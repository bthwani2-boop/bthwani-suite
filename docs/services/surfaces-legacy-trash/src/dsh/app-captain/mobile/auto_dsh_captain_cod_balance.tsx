// Auto-generated screen for dsh_captain_cod_balance
// Surface: app-captain | Service: dsh
// Operation: GET /api/dsh/captain/cod-balance
// Description: Get captain COD balance - Required for cash management

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { getDshCaptainCodBalance } from '@bthwani/api-clients/dsh/dsh-captain-api';

interface CodBalance {
  total_balance: number;
  available_balance: number;
  pending_balance: number;
  currency: string;
  last_updated: string;
}

interface AutoDshCaptainCodBalanceProps {
  navigation?: any;
}

export const AutoDshCaptainCodBalance: React.FC<AutoDshCaptainCodBalanceProps> = ({
  navigation
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [balance, setBalance] = useState<CodBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBalance = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const data = await getDshCaptainCodBalance();
      if (!data) throw new Error(t('dsh.captain.cod.fetchError'));
      setBalance({
        total_balance: data?.total_balance ?? 0,
        available_balance: data?.available_balance ?? 0,
        pending_balance: data?.pending_balance ?? 0,
        currency: data?.currency ?? 'SAR',
        last_updated: data?.last_updated ?? new Date().toISOString(),
      });
    } catch (err) {
      setError(t('dsh.app-captain.mobile.auto_dsh_captain_cod_balance.errorLoadMessage'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  if (isLoading) {
    return <ScreenWrapper state="loading" loadingMessage={t('dsh.captain.cod.loading')} />;
  }

  if (error) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={error}
        onErrorAction={() => loadBalance()}
      />
    );
  }

  if (!balance) {
    return <ScreenWrapper state="empty" emptyMessage={t('dsh.app-captain.mobile.auto_dsh_captain_cod_balance.noBalanceData')} />;
  }

  return (
    <ScreenWrapper state="content">
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => loadBalance(true)} />
        }
      >
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>{t('dsh.captain.cod.totalBalance')}</Text>
          <Text style={styles.headerAmount}>
            {balance.total_balance.toFixed(2)} {balance.currency}
          </Text>
        </View>

        <View style={[styles.cardsContainer, { flexDirection: 'row', direction: layoutDirection }]}>
          <View style={styles.balanceCard}>
            <Text style={styles.cardLabel}>{t('dsh.captain.cod.availableBalance')}</Text>
            <Text style={[styles.cardAmount, { color: semanticRoles.stateSuccess.icon }]}>
              {balance.available_balance.toFixed(2)} {balance.currency}
            </Text>
            <Text style={styles.cardDescription}>{t('dsh.captain.cod.availableDescription')}</Text>
          </View>

          <View style={styles.balanceCard}>
            <Text style={styles.cardLabel}>{t('dsh.captain.cod.pendingBalance')}</Text>
            <Text style={[styles.cardAmount, { color: semanticRoles.stateWarning.icon }]}>
              {balance.pending_balance.toFixed(2)} {balance.currency}
            </Text>
            <Text style={styles.cardDescription}>{t('dsh.captain.cod.pendingDescription')}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            {t('dsh.captain.cod.lastUpdated')}: {new Date(balance.last_updated).toLocaleString('ar-SA')}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={() => {
            // Navigate to withdrawal screen if exists
            navigation?.navigate('captain_wallet');
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.withdrawButtonText}>{t('dsh.captain.cod.withdraw')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.bg,
  },
  headerCard: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    color: semanticRoles.primaryCTAText,
    marginBottom: BTHWANI_SPACING.xs,
  },
  headerAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: semanticRoles.primaryCTAText,
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.md,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: BTHWANI_SPACING.xs,
  },
  cardDescription: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  infoCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  withdrawButton: {
    backgroundColor: semanticRoles.primaryCTA,
    margin: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  withdrawButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AutoDshCaptainCodBalance;

