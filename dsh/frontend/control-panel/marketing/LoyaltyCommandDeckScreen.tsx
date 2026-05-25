'use client';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Divider,
  Surface,
  Tabs,
  Text,
  useTheme,
} from '@bthwani/ui-kit';
import {
  getEntitlements,
  getLoyaltyPrograms,
  getLoyaltyRewards,
  getLoyaltyTiers,
  getSubscriptionPlans,
} from '../../data/subscriptions.preview-data';
import { mapStoreCommercialFeatures } from '../../shared/store-card-commercial-map';
import { CommercialParityPreview } from './commercial-parity-preview';

type LoyaltyView = 'overview' | 'tiers' | 'subscriptions' | 'rewards' | 'entitlements';

type DeckRow = {
  id: string;
  title: string;
  subtitle: string;
  badgeLabel?: string;
  badgeTone?: 'default' | 'success' | 'warning' | 'danger' | 'brand' | 'info';
  actionLabel?: string;
};

function CompactDeckRow({
  row,
  showDivider = false,
  selected,
  onAction,
}: {
  row: DeckRow;
  showDivider?: boolean;
  selected: boolean;
  onAction?: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Box
      style={{
        borderTopWidth: showDivider ? 1 : 0,
        borderTopColor: theme.line,
        paddingTop: showDivider ? 12 : 0,
        marginTop: showDivider ? 12 : 0,
      }}
    >
      <Box layoutDirection="row" align="flex-start" justify="space-between" style={{ gap: 12 }}>
        <Box gap={1} style={{ flex: 1, alignItems: 'flex-end' }}>
          <Box layoutDirection="row" style={{ gap: 8, flexWrap: 'wrap', justifyContent: 'flex-start', width: '100%' }}>
            {row.badgeLabel ? <Badge label={row.badgeLabel} tone={row.badgeTone ?? 'default'} /> : null}
            <Text role="bodyStrong" style={{ textAlign: 'right' }}>
              {row.title}
            </Text>
          </Box>
          <Text role="bodySm" tone="muted" numberOfLines={2} style={{ textAlign: 'right', width: '100%' }}>
            {row.subtitle}
          </Text>
        </Box>
        {row.actionLabel && onAction ? (
          <Button
            label={selected ? 'محدد' : row.actionLabel}
            tone={selected ? 'brand' : 'secondary'}
            size="sm"
            fullWidth={false}
            onPress={onAction}
          />
        ) : null}
      </Box>
    </Box>
  );
}

export function LoyaltyCommandDeckScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = React.useState<LoyaltyView>('overview');
  const [selectedRowId, setSelectedRowId] = React.useState('');

  const programs = React.useMemo(() => getLoyaltyPrograms(), []);
  const tiers = React.useMemo(() => getLoyaltyTiers(), []);
  const rewards = React.useMemo(() => getLoyaltyRewards(), []);
  const subscriptions = React.useMemo(() => getSubscriptionPlans(), []);
  const entitlements = React.useMemo(() => getEntitlements(), []);

  const currentTier = tiers[tiers.length - 1];
  const activeSubscription = subscriptions.find((plan) => plan.id === 'sub-pro') ?? subscriptions[0];
  const activeRewards = rewards.slice(0, 4);

  const metrics = [
    { label: 'الأعضاء', value: '15,240' },
    { label: 'مشتركو البرو', value: '2,840' },
    { label: 'المكافآت النشطة', value: String(activeRewards.length) },
    { label: 'الاستحقاقات', value: String(entitlements.length) },
  ];

  const overviewRows: DeckRow[] = [
    {
      id: 'program',
      title: programs[0]?.name ?? 'برنامج ولاء واحد',
      subtitle: programs[0]?.description ?? 'برنامج موحّد للمزايا الحالية.',
      badgeLabel: 'البرنامج',
      badgeTone: 'brand',
      actionLabel: 'عرض',
    },
    {
      id: 'tier',
      title: `المستوى ${currentTier?.name ?? 'فضي'}`,
      subtitle: `${currentTier?.minimumPoints ?? 0} نقطة للتأهل • ${currentTier?.benefits?.length ?? 0} مزايا مرتبطة.`,
      badgeLabel: 'النقاط',
      badgeTone: 'info',
      actionLabel: 'عرض',
    },
    {
      id: 'subscription',
      title: activeSubscription?.name ?? 'بثواني برو',
      subtitle: `${activeSubscription?.weeklyFee ?? activeSubscription?.monthlyFee ?? 0} ريال • ${activeSubscription?.features?.join(' • ') ?? 'بدون ميزات ظاهرة'}`,
      badgeLabel: 'الاشتراك',
      badgeTone: 'success',
      actionLabel: 'عرض',
    },
    {
      id: 'reward',
      title: activeRewards[0]?.title ?? 'لا توجد مكافأة بارزة',
      subtitle: activeRewards[0]?.description ?? 'ستظهر هنا أقرب مكافأة قابلة للاستخدام في العميل.',
      badgeLabel: 'مكافأة',
      badgeTone: 'warning',
      actionLabel: 'عرض',
    },
  ];

  const tierRows: DeckRow[] = tiers.map((tier) => ({
    id: tier.id,
    title: tier.name,
    subtitle: `${tier.minimumPoints} نقطة • ${tier.benefits.length ? tier.benefits.map((benefit) => benefit.label).join(' • ') : 'بدون مزايا إضافية'}`,
    badgeLabel: 'مستوى',
    badgeTone: currentTier?.id === tier.id ? 'brand' : 'default',
    actionLabel: 'عرض',
  }));

  const subscriptionRows: DeckRow[] = subscriptions.map((subscription) => ({
    id: subscription.id,
    title: subscription.name,
    subtitle: `${subscription.weeklyFee ?? subscription.monthlyFee ?? 0} ريال • ${subscription.features.join(' • ')}`,
    badgeLabel: subscription.id === activeSubscription?.id ? 'الحالية' : 'متاحة',
    badgeTone: subscription.id === activeSubscription?.id ? 'brand' : 'info',
    actionLabel: 'عرض',
  }));

  const rewardRows: DeckRow[] = activeRewards.map((reward) => ({
    id: reward.id,
    title: reward.title,
    subtitle: reward.description ?? 'مكافأة قابلة للاسترداد.',
    badgeLabel: `${reward.pointsCost} نقطة`,
    badgeTone: 'warning',
    actionLabel: 'عرض',
  }));

  const entitlementRows: DeckRow[] = entitlements.map((entitlement) => ({
    id: entitlement.id,
    title: entitlement.type,
    subtitle: `الحالة الحالية: ${entitlement.status}`,
    badgeLabel: entitlement.status === 'active' ? 'مفعّل' : entitlement.status,
    badgeTone: entitlement.status === 'active' ? 'success' : 'default',
    actionLabel: 'عرض',
  }));

  const previewFeatures = mapStoreCommercialFeatures({
    storeId: 'benefits-preview',
    activeOffers: [],
    activeSubscriptions: activeSubscription ? [activeSubscription] : [],
    activeEntitlements: entitlements,
    activeCampaigns: [],
  });

  const styles = React.useMemo(
    () => StyleSheet.create({
      metricRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
      },
      metricCard: {
        flexGrow: 1,
        minWidth: 120,
        borderWidth: 1,
        borderColor: theme.line,
        backgroundColor: theme.surface,
        borderRadius: 14,
        padding: 12,
      },
      layout: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'stretch',
      },
      primaryPanel: {
        flex: 1.8,
        minWidth: 420,
        borderWidth: 1,
        borderColor: theme.line,
        borderRadius: 18,
      },
      sidePanel: {
        flex: 1,
        minWidth: 280,
        borderWidth: 1,
        borderColor: theme.line,
        borderRadius: 18,
      },
    }),
    [theme],
  );

  const rowsByTab: Record<LoyaltyView, DeckRow[]> = {
    overview: overviewRows,
    tiers: tierRows,
    subscriptions: subscriptionRows,
    rewards: rewardRows,
    entitlements: entitlementRows,
  };

  const currentRows = rowsByTab[activeTab];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16, boxSizing: 'border-box', height: '100%' }}>
      <View style={styles.metricRow}>
        {metrics.map((metric) => (
          <View key={metric.label} style={styles.metricCard}>
            <Text role="caption" tone="muted" style={{ textAlign: 'right', width: '100%' }}>
              {metric.label}
            </Text>
            <Text role="titleLg" style={{ textAlign: 'right', width: '100%' }}>
              {metric.value}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.layout}>
        <Surface tone="raised" padding={3} gap={3} style={styles.primaryPanel}>
          <Box gap={1} style={{ alignItems: 'flex-end' }}>
            <Text role="titleSm" style={{ textAlign: 'right' }}>
              مزايا العميل
            </Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              لوحة مختصرة لمكونات الولاء والاشتراك التي تغذي تجربة العميل بدل توزيعها على مسارات كثيرة.
            </Text>
          </Box>

          <Tabs<LoyaltyView>
            items={[
              { value: 'overview', label: 'نظرة عامة' },
              { value: 'tiers', label: 'المستويات' },
              { value: 'subscriptions', label: 'الاشتراك' },
              { value: 'rewards', label: 'المكافآت' },
              { value: 'entitlements', label: 'الاستحقاقات' },
            ]}
            value={activeTab}
            onValueChange={setActiveTab}
            variant="pill"
            scrollable
          />

          <Divider />

          <Box gap={2}>
            {currentRows.length > 0 ? (
              currentRows.map((row, index) => (
                <CompactDeckRow
                  key={row.id}
                  row={row}
                  showDivider={index > 0}
                  selected={selectedRowId === row.id}
                  onAction={() => setSelectedRowId(row.id)}
                />
              ))
            ) : (
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                لا توجد عناصر معروضة لهذا القسم حاليًا.
              </Text>
            )}
          </Box>

          {selectedRowId ? (
            <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
              تم تثبيت صف واحد للمراجعة داخل هذه اللوحة لتقليل الضجيج أثناء اتخاذ القرار.
            </Text>
          ) : null}
        </Surface>

        <Surface tone="raised" padding={3} gap={3} style={styles.sidePanel}>
          <Box gap={1} style={{ alignItems: 'flex-end' }}>
            <Text role="titleSm" style={{ textAlign: 'right' }}>
              محاكاة التأثير
            </Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              كيف ستظهر الشارات والمزايا على بطاقة المتجر داخل تجربة العميل.
            </Text>
          </Box>

          <Box gap={2} padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line">
            <CommercialParityPreview features={previewFeatures} />
          </Box>

          <Button
            label="تبديل إلى نظرة عامة"
            tone="secondary"
            size="sm"
            fullWidth={false}
            onPress={() => setActiveTab('overview')}
          />
        </Surface>
      </View>
    </div>
  );
}

export default LoyaltyCommandDeckScreen;
