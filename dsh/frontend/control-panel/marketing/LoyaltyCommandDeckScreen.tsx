'use client';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Box, Surface, Tabs, Text } from '@bthwani/ui-kit';
import {
  getLoyaltyPrograms,
  getSubscriptionPlans,
  getLoyaltyTiers,
  getLoyaltyRewards,
  getEntitlements,
} from '../../shared/loyalty.preview-store';
import { mapStoreCommercialFeatures, CommercialParityPreview } from '../../shared/store-card-commercial-map';

type LoyaltyTab = 'programs' | 'tiers' | 'rewards' | 'subscriptions' | 'entitlements' | 'earning' | 'redemption';

export function LoyaltyCommandDeckScreen() {
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
                <Text role="bodyStrong" style={{ color: '#0A2F5C', textAlign: 'right' }}>{p.name}</Text>
                <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>{p.description} · العملة: {p.currencyLabel}</Text>
                <View style={[styles.badge, { alignSelf: 'flex-start', marginTop: 8 }]}>
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>المستوى: {t.name}</Text>
                  <Text role="bodyStrong" style={{ color: '#FF500D' }}>{t.minimumPoints} نقطة</Text>
                </View>
                <Text role="caption" tone="muted" style={{ marginTop: 4, textAlign: 'right' }}>المزايا: {t.benefits.length ? t.benefits.join('، ') : 'لا يوجد مزايا إضافية'}</Text>
              </Surface>
            ))}
          </Box>
        );
      case 'rewards':
        return (
          <Box gap={3}>
            {rewards.map(r => (
              <Surface key={r.id} tone="raised" style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>{r.title}</Text>
                  <Text role="bodyStrong" style={{ color: '#FF500D' }}>{r.pointsCost} نقطة</Text>
                </View>
                <Text role="caption" tone="muted" style={{ marginTop: 4, textAlign: 'right' }}>نوع المكافأة: كوبون خصم مباشر</Text>
                <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>تنتهي بعد: 30 يوماً من الاسترداد</Text>
              </Surface>
            ))}
          </Box>
        );
      case 'subscriptions':
        return (
          <Box gap={3}>
            {subscriptions.map(s => (
              <Surface key={s.id} tone="raised" style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>{s.name}</Text>
                  <Text role="bodyStrong" style={{ color: '#16A34A' }}>{s.monthlyFee} ريال / شهرياً</Text>
                </View>
                <Text role="caption" tone="muted" style={{ marginTop: 4, textAlign: 'right' }}>المزايا: {s.features.join('، ')}</Text>
                <View style={[styles.badge, { backgroundColor: '#DCFCE7', alignSelf: 'flex-start', marginTop: 8 }]}>
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
                  <Text role="bodyStrong" style={{ color: '#0A2F5C', textAlign: 'right' }}>استحقاق: {e.type}</Text>
                  <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>الحالة: {e.status}</Text>
                </Surface>
              ))
            )}
          </Box>
        );
      case 'earning':
        return (
          <Surface tone="raised" style={styles.card}>
            <Text role="bodyStrong" style={{ color: '#0A2F5C', marginBottom: 8, textAlign: 'right' }}>قواعد الكسب</Text>
            <ul style={{ paddingInlineStart: 20, color: '#475569', fontSize: 13, margin: 0, lineHeight: 1.8, textAlign: 'right' }}>
              <li><strong>الطلبات:</strong> نقطة واحدة لكل ريال يتم إنفاقه.</li>
              <li><strong>مكافأة الفئة:</strong> مضاعف 1.5x لقسم المقاضي.</li>
              <li><strong>مكافأة الشريك:</strong> 100 نقطة إضافية عند الطلب من الشركاء المميزين.</li>
            </ul>
          </Surface>
        );
      case 'redemption':
        return (
          <Surface tone="raised" style={styles.card}>
            <Text role="bodyStrong" style={{ color: '#0A2F5C', marginBottom: 8, textAlign: 'right' }}>قواعد الاسترداد</Text>
            <ul style={{ paddingInlineStart: 20, color: '#475569', fontSize: 13, margin: 0, lineHeight: 1.8, textAlign: 'right' }}>
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
        <Text role="caption" tone="muted" style={{ fontWeight: '800', textAlign: 'right' }}>محاكاة بطاقة المتجر</Text>
        <CommercialParityPreview features={features} />
      </Box>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', padding: '16px', boxSizing: 'border-box' }}>
      {/* KPIs */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text role="caption" style={{ fontWeight: '800', color: '#64748B', textAlign: 'right', width: '100%' }}>إجمالي الأعضاء</Text>
          <Text role="titleLg" style={{ color: '#0A2F5C', textAlign: 'right', width: '100%', fontSize: 20, fontWeight: '900', marginTop: 4 }}>{kpis.members}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" style={{ fontWeight: '800', color: '#64748B', textAlign: 'right', width: '100%' }}>مشتركي برو</Text>
          <Text role="titleLg" style={{ color: '#FF500D', textAlign: 'right', width: '100%', fontSize: 20, fontWeight: '900', marginTop: 4 }}>{kpis.subscribers}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" style={{ fontWeight: '800', color: '#64748B', textAlign: 'right', width: '100%' }}>المكافآت المتاحة</Text>
          <Text role="titleLg" style={{ color: '#D97706', textAlign: 'right', width: '100%', fontSize: 20, fontWeight: '900', marginTop: 4 }}>{kpis.rewards}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" style={{ fontWeight: '800', color: '#64748B', textAlign: 'right', width: '100%' }}>معدل التفعيل</Text>
          <Text role="titleLg" style={{ color: '#16A34A', textAlign: 'right', width: '100%', fontSize: 20, fontWeight: '900', marginTop: 4 }}>{kpis.activationRate}</Text>
        </View>
      </View>

      <View style={styles.mainLayout}>
        {/* Main Panel */}
        <Surface tone="raised" style={styles.editorPanel}>
          <View style={styles.editorHeader}>
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

          <Box gap={4} style={styles.panelBody}>
            {renderTabContent()}
          </Box>
        </Surface>

        {/* Side Panel for Preview */}
        <Surface tone="raised" style={styles.sidePanel}>
          <View style={styles.editorHeader}>
            <Text role="titleSm" style={{ color: '#0A2F5C' }}>محاكاة التأثير</Text>
          </View>
          <Box gap={4} style={styles.panelBody}>
            {renderStoreCardPreview()}
            <Text role="caption" tone="muted" style={{ lineHeight: 20, textAlign: 'right' }}>
              هذه المحاكاة تعرض الشارات والمزايا التي ترثها المتاجر المؤهلة بناءً على استحقاقات المستخدم أو قواعد الاشتراك الفعالة.
            </Text>
          </Box>
        </Surface>
      </View>
    </div>
  );
}

const styles = StyleSheet.create({
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  kpiCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(10,47,92,0.06)',
    alignItems: 'flex-start',
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'stretch',
  },
  editorPanel: {
    flex: 2,
    minWidth: 400,
    borderRadius: 16,
    borderColor: 'rgba(10,47,92,0.06)',
    borderWidth: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  sidePanel: {
    flex: 1,
    minWidth: 280,
    borderRadius: 16,
    borderColor: 'rgba(10,47,92,0.06)',
    borderWidth: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
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
  panelBody: {
    flex: 1,
    minHeight: 0,
    padding: 16,
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
