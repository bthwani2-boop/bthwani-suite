// Auto-generated screen for wlt_subscription_invoices_list
// Surface: app-client | Service: wlt
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildInvoicesMock, type Invoice } from '../../fixtures/invoices';

interface auto_wlt_subscription_invoices_listProps {
  
}

export const auto_wlt_subscription_invoices_list: React.FC<auto_wlt_subscription_invoices_listProps> = (props) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    // Backend integration call
    const loadInvoices = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockInvoices = buildInvoicesMock();

        setInvoices(mockInvoices);
        setState('content');
      } catch (error) {
        setState('error');
      }
    };

    loadInvoices();
  }, []);

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return BTHWANI_COLORS.success;
      case 'pending': return BTHWANI_COLORS.warning;
      case 'overdue': return BTHWANI_COLORS.error;
      default: return BTHWANI_COLORS.onSurfaceMuted;
    }
  };

  const getStatusText = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'مدفوع';
      case 'pending': return 'في الانتظار';
      case 'overdue': return t('surfaces.متأخر');
      default: return status;
    }
  };

  const renderInvoiceItem = ({ item }: { item: Invoice }) => (
    <TouchableOpacity style={styles.invoiceCard}>
      <View style={[styles.invoiceHeader, { flexDirection: 'row', direction: layoutDirection }]}>
        <Text style={styles.invoiceNumber}>{item.number}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <Text style={styles.invoiceDescription}>{item.description}</Text>

      <View style={[styles.invoiceFooter, { flexDirection: 'row', direction: layoutDirection }]}>
        <Text style={styles.invoiceDate}>{item.date}</Text>
        <Text style={styles.invoiceAmount}>
          {item.amount} {item.currency}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => (
    <View style={styles.container}>
      <Text style={styles.title}>فواتير الاشتراك</Text>
      <Text style={styles.subtitle}>سجل فواتير اشتراكك الشهرية</Text>

      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id}
        renderItem={renderInvoiceItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>لا توجد فواتير</Text>
      <Text style={styles.emptySubtitle}>ستظهر فواتير اشتراكك هنا عند إصدارها</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>فشل في تحميل الفواتير</Text>
      <Text style={styles.errorSubtitle}>يرجى المحاولة مرة أخرى لاحقاً</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => {
          setState('loading');
          setTimeout(() => setState('content'), 1500);
        }}
      >
        <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
      </TouchableOpacity>
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
      {state === 'content' && (invoices.length > 0 ? renderContent() : renderEmpty())}
      {state === 'error' && renderError()}
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
    marginBottom: BTHWANI_SPACING.xl,
  },
  listContainer: {
    padding: BTHWANI_SPACING.contentH,
  },
  invoiceCard: {
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
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  invoiceNumber: {
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
  invoiceDescription: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceDate: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  invoiceAmount: {
    fontSize: 16,
    fontWeight: '600',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: BTHWANI_COLORS.error,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  errorSubtitle: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  retryButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  retryButtonText: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_wlt_subscription_invoices_list;

