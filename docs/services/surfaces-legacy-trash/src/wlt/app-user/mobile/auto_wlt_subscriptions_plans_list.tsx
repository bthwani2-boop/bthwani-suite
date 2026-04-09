// Auto-generated screen for wlt_subscriptions_plans_list
// Surface: app-client | Service: wlt
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { buildWltSubscriptionPlansListMock, type SubscriptionPlan } from '../../fixtures/subscriptionPlansList';

interface auto_wlt_subscriptions_plans_listProps {
  
}

export const auto_wlt_subscriptions_plans_list: React.FC<auto_wlt_subscriptions_plans_listProps> = (props) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');

  useEffect(() => {
    // Backend integration call
    const loadPlans = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate success (88% success rate)
        const mockSuccess = 0 > 0.12;

        if (!mockSuccess) {
          setState('error');
        } else {
          setState('content');
        }
      } catch (error) {
        setState('error');
      }
    };

    loadPlans();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };

  const plans = useMemo(() => buildWltSubscriptionPlansListMock(t), [t]);

  const renderPlanItem = ({ item }: { item: SubscriptionPlan }) => (
    <TouchableOpacity style={[styles.planCard, item.popular && styles.popularPlan]}>
      {item.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>{t('wlt.app-client.mobile.auto_wlt_subscriptions_plans_list.popularText')}</Text>
        </View>
      )}
      <View style={styles.planHeader}>
        <Text style={styles.planName}>{item.name}</Text>
        <View style={[styles.priceContainer, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.price}>{item.price}</Text>
          <Text style={styles.currency}>{item.currency}</Text>
        </View>
        <Text style={styles.period}>{item.period}</Text>
      </View>
      <View style={styles.featuresContainer}>
        {item.features.map((feature, index) => (
          <View key={index} style={[styles.featureRow, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.featureBullet}>✓</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={[styles.subscribeButton, item.popular && styles.popularButton]}>
        <Text style={[styles.subscribeText, item.popular && styles.popularButtonText]}>اشترك الآن</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={styles.title}>{t('wlt.app-client.mobile.auto_wlt_subscriptions_plans_list.title')}</Text>
          <Text style={styles.subtitle}>{t('wlt.app-client.mobile.auto_wlt_subscriptions_plans_list.subtitle')}</Text>
          <FlatList
            data={plans}
            keyExtractor={(item) => item.id}
            renderItem={renderPlanItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_خطط_الاشتراك')}
      errorMessage={t('surfaces.فشل_في_تحميل_خطط_الاشتراك')}
      onErrorAction={handleRetry}
      screenName="auto_wlt_subscriptions_plans_list"
      operationName="wlt_subscriptions_plans_list"
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
  listContainer: {
    padding: BTHWANI_SPACING.contentH,
  },
  planCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  popularPlan: {
    borderWidth: 2,
    borderColor: BTHWANI_COLORS.primary,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    end: 20,
    backgroundColor: colorTokens.warning['500'],
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
    zIndex: 1,
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  planName: {
    fontSize: 20,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: BTHWANI_SPACING.xs,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: BTHWANI_COLORS.primary,
  },
  currency: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginEnd: BTHWANI_SPACING.xs,
  },
  period: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  featuresContainer: {
    marginBottom: BTHWANI_SPACING.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  featureBullet: {
    color: colorTokens.success['600'],
    fontSize: 16,
    marginEnd: BTHWANI_SPACING.sm,
    fontWeight: '600',
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
  },
  subscribeButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  popularButton: {
    backgroundColor: BTHWANI_COLORS.primary,
  },
  subscribeText: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  popularButtonText: {
    color: BTHWANI_COLORS.onPrimary,
  },
});

export default auto_wlt_subscriptions_plans_list;

