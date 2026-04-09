// Auto-generated screen for wlt_settlements_list
// Surface: app-client | Service: wlt
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildSettlementsListMock, type Settlement } from '../../fixtures/settlement';

interface auto_wlt_settlements_listProps {
  
}

export const auto_wlt_settlements_list: React.FC<auto_wlt_settlements_listProps> = (props) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    // Backend integration call
    const loadSettlements = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockSettlements = buildSettlementsListMock(t);

        setSettlements(mockSettlements);
        setState('content');
      } catch (error) {
        setState('error');
      }
    };

    loadSettlements();
  }, []);

  const filteredSettlements = settlements.filter(settlement => {
    if (filter === 'all') return true;
    return settlement.status === filter;
  });

  const getStatusColor = (status: Settlement['status']) => {
    switch (status) {
      case 'completed': return BTHWANI_COLORS.success;
      case 'pending': return BTHWANI_COLORS.warning;
      case 'failed': return BTHWANI_COLORS.error;
      default: return BTHWANI_COLORS.onSurfaceMuted;
    }
  };

  const getStatusText = (status: Settlement['status']) => {
    switch (status) {
      case 'completed': return 'مكتملة';
      case 'pending': return 'قيد الانتظار';
      case 'failed': return 'فاشلة';
      default: return status;
    }
  };

  const getTypeText = (type: Settlement['type']) => {
    switch (type) {
      case 'merchant': return 'تاجر';
      case 'provider': return 'مزود';
      case 'partner': return 'شريك';
      default: return type;
    }
  };

  const renderSettlementItem = ({ item }: { item: Settlement }) => (
    <TouchableOpacity style={styles.settlementCard}>
      <View style={[styles.settlementHeader, { flexDirection: 'row', direction: layoutDirection }]}>
        <Text style={styles.settlementReference}>{item.reference}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <Text style={styles.settlementDescription}>{item.description}</Text>

      <View style={styles.settlementDetails}>
        <View style={[styles.detailRow, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.detailLabel}>النوع:</Text>
          <Text style={styles.detailValue}>{getTypeText(item.type)}</Text>
        </View>
        <View style={[styles.detailRow, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.detailLabel}>التاريخ:</Text>
          <Text style={styles.detailValue}>{item.date}</Text>
        </View>
      </View>

      <View style={styles.settlementAmount}>
        <Text style={styles.amountText}>
          {item.amount.toLocaleString()} {item.currency}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFilterTabs = () => (
    <View style={[styles.filterContainer, { flexDirection: 'row', direction: layoutDirection }]}>
      {[
        { key: 'all', label: t('wlt.app-client.mobile.auto_wlt_settlements_list.all') },
        { key: 'completed', label: t('wlt.app-client.mobile.auto_wlt_settlements_list.completed') },
        { key: 'pending', label: t('wlt.app-client.mobile.auto_wlt_settlements_list.pending') }
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.filterTab, filter === tab.key && styles.filterTabActive]}
          onPress={() => setFilter(tab.key as typeof filter)}
        >
          <Text style={[styles.filterTabText, filter === tab.key && styles.filterTabTextActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContent = () => (
    <View style={styles.container}>
      <Text style={styles.title}>التسويات المالية</Text>
      <Text style={styles.subtitle}>سجل تسويات حسابك المالية</Text>

      {renderFilterTabs()}

      <FlatList
        data={filteredSettlements}
        keyExtractor={(item) => item.id}
        renderItem={renderSettlementItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>لا توجد تسويات</Text>
      <Text style={styles.emptySubtitle}>ستظهر تسوياتك المالية هنا عند توفرها</Text>
    </View>
  );

  return (
    <ScreenWrapper
      state={state}
      onErrorAction={() => {
        setState('loading');
        setTimeout(() => setState('content'), 1500);
      }}
    >
      {state === 'content' && (filteredSettlements.length > 0 ? renderContent() : renderEmpty())}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
    marginTop: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: BTHWANI_COLORS.surface,
    marginHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.xs,
    marginBottom: BTHWANI_SPACING.md,
  },
  filterTab: {
    flex: 1,
    paddingVertical: BTHWANI_SPACING.sm,
    alignItems: 'center',
    borderRadius: BTHWANI_RADIUS.md,
  },
  filterTabActive: {
    backgroundColor: BTHWANI_COLORS.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: BTHWANI_COLORS.onSurface,
  },
  filterTabTextActive: {
    color: BTHWANI_COLORS.onPrimary,
    fontWeight: '600',
  },
  listContainer: {
    padding: BTHWANI_SPACING.contentH,
  },
  settlementCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: BTHWANI_COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settlementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  settlementReference: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: BTHWANI_COLORS.onPrimary,
  },
  settlementDescription: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  settlementDetails: {
    marginBottom: BTHWANI_SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.xs,
  },
  detailLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  detailValue: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    fontWeight: '500',
  },
  settlementAmount: {
    borderTopWidth: 1,
    borderTopColor: BTHWANI_COLORS.outline,
    paddingTop: BTHWANI_SPACING.sm,
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
  },
});

export default auto_wlt_settlements_list;

