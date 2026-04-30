// Auto-generated screen for wlt_transfers_list
// Surface: app-client | Service: wlt
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { buildWltTransfersListMock, type Transfer } from '../../fixtures/transfersList';

type FilterType = 'all' | 'outgoing' | 'incoming';

interface auto_wlt_transfers_listProps {
  route?: { params?: { filter?: FilterType } };
}

export const auto_wlt_transfers_list: React.FC<auto_wlt_transfers_listProps> = (props) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const initialFilter = (props.route?.params?.filter ?? 'all') as FilterType;
  const [state, setState] = useState<ScreenState>('loading');
  const [filter, setFilter] = useState<FilterType>(initialFilter);

  useEffect(() => {
    const loadTransfers = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setState('content');
      } catch (error) {
        setState('error');
      }
    };

    loadTransfers();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };

  const transfers = React.useMemo(() => buildWltTransfersListMock(t), [t]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colorTokens.success['600'];
      case 'pending': return colorTokens.warning['500'];
      case 'failed': return colorTokens.error['500'];
      default: return BTHWANI_COLORS.onSurfaceMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return t('wlt.app-client.mobile.auto_wlt_transfers_list.statusCompleted');
      case 'pending': return t('wlt.app-client.mobile.auto_wlt_transfers_list.statusPending');
      case 'failed': return t('wlt.app-client.mobile.auto_wlt_transfers_list.statusFailed');
      default: return status;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'incoming' ? '📈' : '📉';
  };

  const getTypeText = (type: string) => {
    return type === 'incoming' ? t('wlt.app-client.mobile.auto_wlt_transfers_list.typeIncoming') : t('wlt.app-client.mobile.auto_wlt_transfers_list.typeOutgoing');
  };

  const filteredTransfers = transfers.filter(transfer => {
    if (filter === 'all') return true;
    if (filter === 'outgoing') return transfer.type === 'outgoing';
    if (filter === 'incoming') return transfer.type === 'incoming';
    return true;
  });

  const renderTransferItem = ({ item }: { item: Transfer }) => (
    <TouchableOpacity style={styles.transferCard}>
      <View style={[styles.transferHeader, { flexDirection: 'row', direction: layoutDirection }]}>
        <View style={[styles.transferType, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.transferIcon}>{getTypeIcon(item.type)}</Text>
          <View style={styles.transferInfo}>
            <Text style={styles.transferRecipient}>{item.recipient}</Text>
            <Text style={styles.transferTypeText}>{getTypeText(item.type)}</Text>
          </View>
        </View>
        <View style={styles.transferAmount}>
          <Text style={[
            styles.amountText,
            item.type === 'incoming' && styles.incomingAmount,
            item.type === 'outgoing' && styles.outgoingAmount
          ]}>
            {item.type === 'incoming' ? '+' : '-'}{item.amount} {item.currency}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.transferFooter, { flexDirection: 'row', direction: layoutDirection }]}>
        <Text style={styles.transferDate}>{item.date} في {item.time}</Text>
        <Text style={styles.transferReference}>{item.reference}</Text>
      </View>
    </TouchableOpacity>
  );

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={styles.title}>{t('wlt.app-client.mobile.auto_wlt_transfers_list.title')}</Text>
          <Text style={styles.subtitle}>{t('wlt.app-client.mobile.auto_wlt_transfers_list.subtitle')}</Text>

          <View style={[styles.filterTabs, { flexDirection: 'row', direction: layoutDirection }]}>
            <TouchableOpacity
              style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
                {t('wlt.app-client.mobile.auto_wlt_transfers_list.filterAll', { count: transfers.length })}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, filter === 'outgoing' && styles.activeFilterTab]}
              onPress={() => setFilter('outgoing')}
            >
              <Text style={[styles.filterText, filter === 'outgoing' && styles.activeFilterText]}>
                {t('wlt.app-client.mobile.auto_wlt_transfers_list.filterOutgoing', { count: transfers.filter(x => x.type === 'outgoing').length })}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, filter === 'incoming' && styles.activeFilterTab]}
              onPress={() => setFilter('incoming')}
            >
              <Text style={[styles.filterText, filter === 'incoming' && styles.activeFilterText]}>
                {t('wlt.app-client.mobile.auto_wlt_transfers_list.filterIncoming', { count: transfers.filter(x => x.type === 'incoming').length })}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredTransfers}
            keyExtractor={(item) => item.id}
            renderItem={renderTransferItem}
            contentContainerStyle={styles.transfersList}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{t('wlt.app-client.mobile.auto_wlt_transfers_list.summaryTitle')}</Text>
            <View style={[styles.summaryRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.summaryLabel}>{t('wlt.app-client.mobile.auto_wlt_transfers_list.summaryLabelOutgoing')}</Text>
              <Text style={[styles.summaryValue, styles.outgoingAmount]}>
                -{transfers.filter(t => t.type === 'outgoing').reduce((sum, t) => sum + t.amount, 0)} ريال
              </Text>
            </View>
            <View style={[styles.summaryRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.summaryLabel}>{t('wlt.app-client.mobile.auto_wlt_transfers_list.summaryLabelIncoming')}</Text>
              <Text style={[styles.summaryValue, styles.incomingAmount]}>
                +{transfers.filter(t => t.type === 'incoming').reduce((sum, t) => sum + t.amount, 0)} ريال
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.netRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.netLabel}>{t('wlt.app-client.mobile.auto_wlt_transfers_list.netLabel')}</Text>
              <Text style={styles.netValue}>
                {transfers.filter(t => t.type === 'incoming').reduce((sum, t) => sum + t.amount, 0) -
                 transfers.filter(t => t.type === 'outgoing').reduce((sum, t) => sum + t.amount, 0)} ريال
              </Text>
            </View>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_التحويلات')}
      emptyMessage={t('surfaces.لا_توجد_تحويلات_حتى_الآن')}
      emptyActionText={t('surfaces.إجراء_تحويل')}
      onEmptyAction={() => setState('content')}
      errorMessage={t('surfaces.فشل_في_تحميل_التحويلات')}
      onErrorAction={handleRetry}
      screenName="auto_wlt_transfers_list"
      operationName="wlt_transfers_list"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  subtitle: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: BTHWANI_COLORS.surface,
    margin: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.xs,
  },
  filterTab: {
    flex: 1,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderRadius: BTHWANI_RADIUS.md,
  },
  activeFilterTab: {
    backgroundColor: BTHWANI_COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  activeFilterText: {
    color: BTHWANI_COLORS.onPrimary,
  },
  transfersList: {
    padding: BTHWANI_SPACING.contentH,
  },
  transferCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transferHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.md,
  },
  transferType: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transferIcon: {
    fontSize: 24,
    marginEnd: BTHWANI_SPACING.md,
  },
  transferInfo: {
    flex: 1,
  },
  transferRecipient: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  transferTypeText: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  transferAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: BTHWANI_SPACING.sm,
  },
  incomingAmount: {
    color: colorTokens.success['600'],
  },
  outgoingAmount: {
    color: colorTokens.error['500'],
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  transferFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transferDate: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  transferReference: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  summaryCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  netRow: {
    borderTopWidth: 1,
    borderTopColor: BTHWANI_COLORS.outline,
    paddingTop: BTHWANI_SPACING.md,
    marginTop: BTHWANI_SPACING.md,
  },
  netLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  netValue: {
    fontSize: 16,
    fontWeight: '700',
    color: BTHWANI_COLORS.primary,
  },
});

export default auto_wlt_transfers_list;

