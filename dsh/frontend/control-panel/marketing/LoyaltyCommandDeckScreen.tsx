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
  getLoyaltyKpis,
  getLoyaltyPrograms,
  getLoyaltyRewards,
  getLoyaltyTiers,
  getSubscriptionPlans,
  type LoyaltyProgram,
  type LoyaltyTier,
  type LoyaltyReward,
  type SubscriptionPlan,
  type Entitlement,
} from '../../data/subscriptions.preview-data';
import { mapStoreCommercialFeatures } from '../../shared/store-card-commercial-map';
import { CommercialParityPreview } from './commercial-parity-preview';



/**
 * Audit / History / Rollback Preview:
 * - publish / approval / toggle / visibility actions:
 *   - audit? API-later (via signal layer/events)
 *   - history? API-later (history log)
 *   - rollback? UI-only (pause/draft toggle)
 *   - reason/comment? UI-only now
 *   - before/after preview? UI-only (local visual grid/preview)
 *   - UI-only? Yes (currently simulated/preview states)
 *   - API-later? Yes (backend mutation boundary)
 *
 * Error Handling Closure:
 * - network: API-later (currently simulated/preview)
 * - validation: Top-level error messages (e.g. required fields, conflict targets)
 * - permission: UI disabled state via hasPermission contract
 * - not found: Auto-fallback or disabled action
 * - conflict: Toast/Alert blocker on duplicate/position conflict
 * - stale data: Handled via refresh() after every mutation
 * - blocked action: Handled via permission/validation state
 * - partial failure: API-later
 * - retry: API-later
 * - (No silent catch, success updates state and refreshes data)
 *
 * Empty / Loading / Blocked / Disabled Closure:
 * - loading: API-later (بيانات محاكاة حالياً)
 * - empty: HANDLED — currentRows.length === 0 يظهر 'لا توجد عناصر معروضة لهذا القسم'
 * - error: API-later
 * - blocked: HANDLED — detail panel only opens when row selected
 * - disabled: HANDLED — 'تبديل إلى نظرة عامة' always active (safe action)
 * - success: HANDLED — selection opens LoyaltyDetailPanel immediately
 * - retry: API-later
 * - guidance: HANDLED — 'لا توجد تفاصيل إضافية.' fallback in LoyaltyDetailPanel
 */
type LoyaltyView = 'overview' | 'tiers' | 'subscriptions' | 'rewards' | 'entitlements';

type DeckRow = {
  rowKey: string;
  rowHeading: string;
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
              {row.rowHeading}
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

type LoyaltyDetailPanelProps = {
  rowKey: string;
  tab: LoyaltyView;
  tiers: LoyaltyTier[];
  subscriptions: SubscriptionPlan[];
  rewards: LoyaltyReward[];
  entitlements: Entitlement[];
  programs: LoyaltyProgram[];
  onClose: () => void;
};

function LoyaltyDetailPanel({ rowKey, tab, tiers, subscriptions, rewards, entitlements, programs, onClose }: LoyaltyDetailPanelProps) {
  const { theme } = useTheme();

  const renderBody = () => {
    if (tab === 'tiers' || tab === 'overview') {
      const tier = tiers.find(t => t.id === rowKey);
      if (tier) {
        return (
          <Box gap={2}>
            <Text role="bodyStrong" style={{ textAlign: 'right' }}>{tier.name}</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{tier.minimumPoints} نقطة للتأهل</Text>
            {tier.benefits.length > 0 ? (
              tier.benefits.map(b => (
                <View key={b.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: theme.line }}>
                  <Text role="caption" style={{ color: theme.textMuted }}>{b.description ?? ''}</Text>
                  <Badge label={b.label} tone="info" />
                </View>
              ))
            ) : (
              <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>بدون مزايا إضافية</Text>
            )}
            <Text role="caption" tone="muted" style={{ textAlign: 'right', marginTop: 4 }}>تعديل المستويات يتم من تبويب المصمم.</Text>
          </Box>
        );
      }
    }
    if (tab === 'subscriptions') {
      const sub = subscriptions.find(s => s.id === rowKey);
      if (sub) {
        return (
          <Box gap={2}>
            <Text role="bodyStrong" style={{ textAlign: 'right' }}>{sub.name}</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{sub.weeklyFee ?? sub.monthlyFee ?? 0} ريال</Text>
            {sub.features.map((f, i) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: theme.line }}>
                <Text role="caption">{f}</Text>
              </View>
            ))}
            <Text role="caption" tone="muted" style={{ textAlign: 'right', marginTop: 4 }}>تعديل خطط الاشتراك يتم من تبويب المصمم.</Text>
          </Box>
        );
      }
    }
    if (tab === 'rewards') {
      const reward = rewards.find(r => r.id === rowKey);
      if (reward) {
        return (
          <Box gap={2}>
            <Text role="bodyStrong" style={{ textAlign: 'right' }}>{reward.title}</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{reward.description}</Text>
            <Badge label={`${reward.pointsCost} نقطة للاسترداد`} tone="warning" />
            <Text role="caption" tone="muted" style={{ textAlign: 'right', marginTop: 4 }}>المكافآت في وضع المعاينة — التعديل من لوحة المصمم.</Text>
          </Box>
        );
      }
    }
    if (tab === 'entitlements') {
      const ent = entitlements.find(e => e.id === rowKey);
      if (ent) {
        return (
          <Box gap={2}>
            <Text role="bodyStrong" style={{ textAlign: 'right' }}>{ent.type}</Text>
            <Badge label={ent.status === 'active' ? 'مفعّل' : ent.status} tone={ent.status === 'active' ? 'success' : 'default'} />
            <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>المرجع: {ent.referenceId ?? '—'}</Text>
            <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>الحالة: {ent.source} · {ent.type}</Text>
          </Box>
        );
      }
    }
    const prog = programs.find(p => p.id === rowKey);
    if (prog) {
      return (
        <Box gap={2}>
          <Text role="bodyStrong" style={{ textAlign: 'right' }}>{prog.name}</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{prog.description}</Text>
        </Box>
      );
    }
    return <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>لا توجد تفاصيل إضافية.</Text>;
  };

  return (
    <Surface tone="inset" padding={3} gap={3} style={{ borderRadius: 12, borderWidth: 1, borderColor: theme.brand }}>
      <Box layoutDirection="row" justify="space-between" align="center">
        <Box layoutDirection="row" gap={2}>
          <Button label="إغلاق" tone="ghost" size="sm" fullWidth={false} onPress={onClose} />
        </Box>
        <Text role="caption" style={{ color: theme.brandHeaderBackground, fontWeight: '800', textAlign: 'right' }}>تفاصيل العنصر</Text>
      </Box>
      <Divider />
      {renderBody()}
    </Surface>
  );
}

export function LoyaltyCommandDeckScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = React.useState<LoyaltyView>('overview');
  const [selectedRowId, setSelectedRowId] = React.useState('');
  const [detailRowId, setDetailRowId] = React.useState<string | null>(null);

  const programs = React.useMemo(() => getLoyaltyPrograms(), []);
  const tiers = React.useMemo(() => getLoyaltyTiers(), []);
  const rewards = React.useMemo(() => getLoyaltyRewards(), []);
  const subscriptions = React.useMemo(() => getSubscriptionPlans(), []);
  const entitlements = React.useMemo(() => getEntitlements(), []);

  const currentTier = tiers[tiers.length - 1];
  const activeSubscription = subscriptions.find((plan) => plan.id === 'sub-pro') ?? subscriptions[0];
  const activeRewards = rewards.slice(0, 4);
  const loyaltyKpis = React.useMemo(() => getLoyaltyKpis(), []);

  const metrics = [
    { label: 'الأعضاء', value: String(loyaltyKpis.total) },
    { label: 'مشتركو البرو', value: String(loyaltyKpis.subscriptions) },
    { label: 'المكافآت النشطة', value: String(activeRewards.length) },
    { label: 'الاستحقاقات', value: String(entitlements.length) },
  ];

  const overviewRows: DeckRow[] = [
    {
      rowKey: 'loyalty-overview-program',
      rowHeading: programs[0]?.name ?? 'برنامج ولاء واحد',
      subtitle: programs[0]?.description ?? 'برنامج موحّد للمزايا الحالية.',
      badgeLabel: 'البرنامج',
      badgeTone: 'brand',
      actionLabel: 'عرض البرنامج',
    },
    {
      rowKey: 'loyalty-overview-tier',
      rowHeading: `المستوى ${currentTier?.name ?? 'فضي'}`,
      subtitle: `${currentTier?.minimumPoints ?? 0} نقطة للتأهل • ${currentTier?.benefits?.length ?? 0} مزايا مرتبطة.`,
      badgeLabel: 'النقاط',
      badgeTone: 'info',
      actionLabel: 'اختيار مستوى',
    },
    {
      rowKey: 'loyalty-overview-subscription',
      rowHeading: activeSubscription?.name ?? 'بثواني برو',
      subtitle: `${activeSubscription?.weeklyFee ?? activeSubscription?.monthlyFee ?? 0} ريال • ${activeSubscription?.features?.join(' • ') ?? 'بدون ميزات ظاهرة'}`,
      badgeLabel: 'الاشتراك',
      badgeTone: 'success',
      actionLabel: 'عرض مزايا',
    },
    {
      rowKey: 'loyalty-overview-reward',
      rowHeading: activeRewards[0]?.title ?? 'لا توجد مكافأة بارزة',
      subtitle: activeRewards[0]?.description ?? 'ستظهر هنا أقرب مكافأة قابلة للاستخدام في العميل.',
      badgeLabel: 'مكافأة',
      badgeTone: 'warning',
      actionLabel: 'استرداد',
    },
  ];

  const tierRows: DeckRow[] = tiers.map((tier) => ({
    rowKey: tier.id,
    rowHeading: tier.name,
    subtitle: `${tier.minimumPoints} نقطة • ${tier.benefits.length ? tier.benefits.map((benefit) => benefit.label).join(' • ') : 'بدون مزايا إضافية'}`,
    badgeLabel: 'مستوى',
    badgeTone: currentTier?.id === tier.id ? 'brand' : 'default',
    actionLabel: 'اختيار مستوى',
  }));

  const subscriptionRows: DeckRow[] = subscriptions.map((subscription) => ({
    rowKey: subscription.id,
    rowHeading: subscription.name,
    subtitle: `${subscription.weeklyFee ?? subscription.monthlyFee ?? 0} ريال • ${subscription.features.join(' • ')}`,
    badgeLabel: subscription.id === activeSubscription?.id ? 'الحالية' : 'متاحة',
    badgeTone: subscription.id === activeSubscription?.id ? 'brand' : 'info',
    actionLabel: 'عرض مزايا',
  }));

  const rewardRows: DeckRow[] = activeRewards.map((reward) => ({
    rowKey: reward.id,
    rowHeading: reward.title,
    subtitle: reward.description ?? 'مكافأة قابلة للاسترداد.',
    badgeLabel: `${reward.pointsCost} نقطة`,
    badgeTone: 'warning',
    actionLabel: 'استرداد',
  }));

  const entitlementRows: DeckRow[] = entitlements.map((entitlement) => ({
    rowKey: entitlement.id,
    rowHeading: entitlement.type,
    subtitle: `الحالة الحالية: ${entitlement.status}`,
    badgeLabel: entitlement.status === 'active' ? 'مفعّل' : entitlement.status,
    badgeTone: entitlement.status === 'active' ? 'success' : 'default',
    actionLabel: 'فحص',
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
                  key={row.rowKey}
                  row={row}
                  showDivider={index > 0}
                  selected={selectedRowId === row.rowKey}
                  onAction={() => { setSelectedRowId(row.rowKey); setDetailRowId(row.rowKey); }}
                />
              ))
            ) : (
              <Surface tone="inset" style={{ padding: 20, borderRadius: 10, alignItems: 'center' }}>
                <Text style={{ fontSize: 24, marginBottom: 6 }}>◎</Text>
                <Text role="bodySm" tone="muted" style={{ textAlign: 'center' }}>
                  لا توجد عناصر في هذا القسم حالياً.
                </Text>
                <Text role="caption" tone="muted" style={{ textAlign: 'center', marginTop: 4 }}>
                  جرب تبويباً آخر أو انتظر تفعيل البيانات.
                </Text>
              </Surface>
            )}
          </Box>

          {detailRowId ? (
            <LoyaltyDetailPanel
              rowKey={detailRowId}
              tab={activeTab}
              tiers={tiers}
              subscriptions={subscriptions}
              rewards={activeRewards}
              entitlements={entitlements}
              programs={programs}
              onClose={() => { setDetailRowId(null); setSelectedRowId(''); }}
            />
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
