'use client';

import React from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { Box, Button, Surface, Tabs, Text, TextField, useDirection } from '@bthwani/ui-kit';
import {
  getLoyaltyPrograms,
  getSubscriptionPlans,
  getLoyaltyTiers,
  getLoyaltyRewards,
  getEntitlements,
  type LoyaltyProgram,
  type LoyaltyTier,
  type LoyaltyReward,
  type SubscriptionPlan,
  type Entitlement,
} from '../../shared/loyalty-store';
import { mapStoreCommercialFeatures, CommercialParityPreview } from '../../shared/store-card-commercial-map';

type LoyaltyTab = 'programs' | 'tiers' | 'rewards' | 'subscriptions' | 'entitlements' | 'earning' | 'redemption';

export function LoyaltyCommandDeckScreen() {
  const { direction } = useDirection();
  const isRtl = direction === 'rtl';

  const [activeTab, setActiveTab] = React.useState<LoyaltyTab>('programs');

  const programs = React.useMemo(() => getLoyaltyPrograms(), []);
  const tiers = React.useMemo(() => getLoyaltyTiers(), []);
  const rewards = React.useMemo(() => getLoyaltyRewards(), []);
  const subscriptions = React.useMemo(() => getSubscriptionPlans(), []);
  const entitlements = React.useMemo(() => getEntitlements(), []);

  // KPIs Mock
  const kpis = {
    members: '15,240',
    subscribers: '2,840',
    rewards: rewards.length,
    entitlementsCount: entitlements.length,
    activationRate: '12%',
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'programs':
        return (
          <Box gap={3}>
            {programs.map(p => (
              <Surface key={p.id} tone="raised" style={styles.card}>
                <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>{p.name}</Text>
                <Text role="caption" tone="muted">{p.description} · العملة: {p.currencyLabel}</Text>
                <View style={[styles.badge, { alignSelf: isRtl ? 'flex-end' : 'flex-start', marginTop: 8 }]}>
                  <Text style={styles.badgeText}>نشط</Text>
                </View>
              </Surface>
            ))}
          </Box>
        );
      case 'tiers':
        return (
          <Box gap={3}>
            {tiers.map(t => (
              <Surface key={t.id} tone="raised" style={styles.card}>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
                  <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>المستوى: {t.name}</Text>
                  <Text role="bodyStrong" style={{ color: '#FF500D' }}>{t.minimumPoints} نقطة</Text>
                </View>
                <Text role="caption" tone="muted" style={{ marginTop: 4 }}>المزايا: {t.benefits.length ? t.benefits.join('، ') : 'لا يوجد مزايا إضافية'}</Text>
              </Surface>
            ))}
          </Box>
        );
      case 'rewards':
        return (
          <Box gap={3}>
            {rewards.map(r => (
              <Surface key={r.id} tone="raised" style={styles.card}>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
                  <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>{r.title}</Text>
                  <Text role="bodyStrong" style={{ color: '#FF500D' }}>{r.pointsCost} نقطة</Text>
                </View>
                <Text role="caption" tone="muted" style={{ marginTop: 4 }}>نوع المكافأة: كوبون خصم مباشر</Text>
                <Text role="caption" tone="muted">تنتهي بعد: 30 يوماً من الاسترداد</Text>
              </Surface>
            ))}
          </Box>
        );
      case 'subscriptions':
        return (
          <Box gap={3}>
            {subscriptions.map(s => (
              <Surface key={s.id} tone="raised" style={styles.card}>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
                  <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>{s.name}</Text>
                  <Text role="bodyStrong" style={{ color: '#16A34A' }}>{s.monthlyFee} ريال / شهرياً</Text>
                </View>
                <Text role="caption" tone="muted" style={{ marginTop: 4 }}>المزايا: {s.features.join('، ')}</Text>
                <View style={[styles.badge, { backgroundColor: '#DCFCE7', alignSelf: isRtl ? 'flex-end' : 'flex-start', marginTop: 8 }]}>
                  <Text style={[styles.badgeText, { color: '#16A34A' }]}>باقة فعالة</Text>
                </View>
              </Surface>
            ))}
          </Box>
        );
      case 'entitlements':
        return (
          <Box gap={3}>
            {entitlements.length === 0 ? (
              <Text role="caption" tone="muted" style={{ textAlign: 'center', padding: 20 }}>لا توجد استحقاقات مسجلة حالياً.</Text>
            ) : (
              entitlements.map(e => (
                <Surface key={e.id} tone="raised" style={styles.card}>
                  <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>استحقاق: {e.type}</Text>
                  <Text role="caption" tone="muted">الحالة: {e.status}</Text>
                </Surface>
              ))
            )}
          </Box>
        );
      case 'earning':
        return (
          <Surface tone="raised" style={styles.card}>
            <Text role="bodyStrong" style={{ color: '#0A2F5C', marginBottom: 8 }}>قواعد الكسب</Text>
            <ul style={{ paddingInlineStart: 20, color: '#475569', fontSize: 13, margin: 0, lineHeight: 1.8 }}>
              <li><strong>الطلبات:</strong> نقطة واحدة لكل ريال يتم إنفاقه.</li>
              <li><strong>مكافأة الفئة:</strong> مضاعف 1.5x لقسم المقاضي.</li>
              <li><strong>مكافأة الشريك:</strong> 100 نقطة إضافية عند الطلب من الشركاء المميزين.</li>
            </ul>
          </Surface>
        );
      case 'redemption':
        return (
          <Surface tone="raised" style={styles.card}>
            <Text role="bodyStrong" style={{ color: '#0A2F5C', marginBottom: 8 }}>قواعد الاسترداد</Text>
            <ul style={{ paddingInlineStart: 20, color: '#475569', fontSize: 13, margin: 0, lineHeight: 1.8 }}>
              <li><strong>مكافأة الكوبون:</strong> استبدال 1000 نقطة بخصم 10 ريال.</li>
              <li><strong>مكافأة التوصيل:</strong> استبدال 1500 نقطة بتوصيل مجاني لطلب واحد.</li>
              <li><strong>مكافأة الشريك:</strong> منتجات مختارة بأسعار مخفضة حصرياً بالنقاط.</li>
            </ul>
          </Surface>
        );
    }
  };

  const renderStoreCardPreview = () => {
    const mockContext = {
      storeId: 'store-preview',
      activeOffers: [],
      activeSubscriptions: subscriptions.filter(s => s.id === 'sub-pro'),
      activeEntitlements: entitlements,
      activeCampaigns: [],
    };
    const features = mapStoreCommercialFeatures(mockContext);

    return (
      <Box gap={2} style={styles.previewContainer}>
        <Text role="caption" tone="muted" style={{ fontWeight: '800' }}>محاكاة بطاقة المتجر</Text>
        <CommercialParityPreview features={features} />
      </Box>
    );
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <Box gap={4} style={{ padding: '24px' }}>
      {/* KPIs */}
      <View style={[styles.kpiRow, isRtl && styles.rowReverse]}>
        <View style={styles.kpiCard}>
          <Text role="caption" tone="muted">إجمالي الأعضاء</Text>
          <Text role="titleLg" style={{ color: '#0A2F5C' }}>{kpis.members}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" tone="muted">مشتركي برو</Text>
          <Text role="titleLg" style={{ color: '#FF500D' }}>{kpis.subscribers}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" tone="muted">المكافآت المتاحة</Text>
          <Text role="titleLg" style={{ color: '#D97706' }}>{kpis.rewards}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" tone="muted">معدل التفعيل</Text>
          <Text role="titleLg" style={{ color: '#16A34A' }}>{kpis.activationRate}</Text>
        </View>
      </View>

      <View style={[styles.mainLayout, isRtl && styles.rowReverse]}>
        {/* Main Panel */}
        <Surface tone="raised" style={styles.editorPanel}>
          <View style={[styles.editorHeader, isRtl && styles.rowReverse]}>
            <Text role="titleSm" style={{ color: '#0A2F5C' }}>إدارة الولاء والاشتراكات</Text>
          </View>

          <Tabs<LoyaltyTab>
            items={[
              { value: 'programs', label: 'البرامج' },
              { value: 'tiers', label: 'المستويات' },
              { value: 'rewards', label: 'المكافآت' },
              { value: 'subscriptions', label: 'الاشتراكات' },
              { value: 'entitlements', label: 'الاستحقاقات' },
              { value: 'earning', label: 'قواعد الكسب' },
              { value: 'redemption', label: 'قواعد الاسترداد' },
            ]}
            value={activeTab}
            onValueChange={setActiveTab}
            variant="line"
          />

          <ScrollView style={{ maxHeight: 500 }}>
            <Box gap={4} style={{ padding: 16 }}>
              {renderTabContent()}
            </Box>
          </ScrollView>
        </Surface>

        {/* Side Panel for Preview */}
        <Surface tone="raised" style={styles.sidePanel}>
          <View style={[styles.editorHeader, isRtl && styles.rowReverse]}>
            <Text role="titleSm" style={{ color: '#0A2F5C' }}>محاكاة التأثير</Text>
          </View>
          <Box gap={4} style={{ padding: 16 }}>
            {renderStoreCardPreview()}
            <Text role="caption" tone="muted" style={{ lineHeight: 20 }}>
              هذه المحاكاة تعرض الشارات والمزايا التي ترثها المتاجر المؤهلة بناءً على استحقاقات المستخدم أو قواعد الاشتراك الفعالة.
            </Text>
          </Box>
        </Surface>
      </View>
    </Box>
    </div>
  );
}

const styles = StyleSheet.create({
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  kpiCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(10,47,92,0.06)',
    alignItems: 'center',
  },
  mainLayout: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  editorPanel: {
    flex: 2,
    minWidth: 450,
    borderRadius: 20,
    borderColor: 'rgba(10,47,92,0.06)',
    borderWidth: 1,
    overflow: 'hidden',
  },
  sidePanel: {
    flex: 1,
    minWidth: 300,
    borderRadius: 20,
    borderColor: 'rgba(10,47,92,0.06)',
    borderWidth: 1,
    overflow: 'hidden',
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#fff',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  previewContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  }
});

export default LoyaltyCommandDeckScreen;
