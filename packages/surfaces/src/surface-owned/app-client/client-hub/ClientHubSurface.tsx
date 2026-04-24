import React from 'react';
import { View } from 'react-native';
import { Button, DashboardShell, KeyValueList, ListItem, Surface, Text, spacing } from '@bthwani/ui-kit';

export type ClientHubSurfaceProps = {
  headline?: string;
  summary?: string;
  quickActions?: Array<{ title: string; subtitle: string; onPress?: () => void }>;
  highlights?: Array<{ label: string; value: string }>;
  loyaltyActions?: Array<{ title: string; subtitle: string; onPress?: () => void }>;
  loyaltyHighlights?: Array<{ label: string; value: string }>;
  onOpenBenefits?: () => void;
  onOpenCheckout?: () => void;
  onOpenSubscriptionReview?: () => void;
};

export function ClientHubSurface({
  headline = 'الصفحة الرئيسية العامة',
  summary = 'بوابة عامة موحدة تجمع الاختصارات والعناصر العابرة لكل الخدمات',
  quickActions = [],
  highlights = [
    { label: 'الحالة', value: 'جاهز' },
    { label: 'اللغة', value: 'العربية' },
    { label: 'الوضع', value: 'عام' },
  ],
  loyaltyActions = [],
  loyaltyHighlights = [
    { label: 'الاشتراك', value: 'Pro Plus' },
    { label: 'النقاط', value: '2,840 pts' },
    { label: 'الكوبونات', value: 'مرئية في الدفع' },
  ],
  onOpenBenefits,
  onOpenCheckout,
  onOpenSubscriptionReview,
}: ClientHubSurfaceProps) {
  const primaryActions = [
    onOpenBenefits ? { label: 'فتح المنافع العامة', onPress: onOpenBenefits, tone: 'secondary' as const } : null,
    onOpenCheckout ? { label: 'مراجعة الدفع', onPress: onOpenCheckout, tone: 'ghost' as const } : null,
    onOpenSubscriptionReview ? { label: 'مراجعة الاشتراك', onPress: onOpenSubscriptionReview, tone: 'ghost' as const } : null,
  ].filter((action): action is { label: string; onPress: () => void; tone: 'secondary' | 'ghost' } => Boolean(action));

  return (
    <DashboardShell
      title={headline}
      subtitle={summary}
      hero={
        <Surface tone="brand" padding={5} gap={4}>
          <View style={{ gap: spacing[2] }}>
            <Text role="titleSm" tone="inverse">
              نقطة عبور موحدة
            </Text>
            <Text role="bodyMd" tone="inverse">
              اختصارات عامة، إشارات حالة، ومسارات مشتركة تظهر في مكان واحد فقط.
            </Text>
          </View>

          <KeyValueList items={highlights} />

          <View style={{ gap: spacing[2], flexDirection: 'row', flexWrap: 'wrap' }}>
            {primaryActions.map((action) => (
              <Button key={action.label} label={action.label} onPress={action.onPress} tone={action.tone} />
            ))}
          </View>
        </Surface>
      }
      sections={[
        {
          title: 'الاختصارات العامة',
          subtitle: 'مؤشرات أو انتقالات لا تملك بيانات خدمة',
          content: (
            <Surface tone="raised" padding={3} gap={2}>
              {quickActions.length ? quickActions.map((action) => (
                <ListItem
                  key={action.title}
                  title={action.title}
                  subtitle={action.subtitle}
                  onPress={action.onPress}
                  badgeLabel="عام"
                />
              )) : (
                <Text role="bodySm" tone="muted">
                  لا توجد اختصارات مضافة بعد.
                </Text>
              )}
            </Surface>
          ),
        },
        {
          title: 'المسارات المشتركة',
          subtitle: 'نقطة دخول رسمية إلى البرامج العامة والاشتراكات والمزايا',
          content: (
            <Surface tone="raised" padding={3} gap={3}>
              <View style={{ gap: spacing[2] }}>
                {loyaltyHighlights.map((item) => (
                  <ListItem key={item.label} title={item.label} meta={item.value} badgeLabel="عام" />
                ))}
              </View>
              <View style={{ gap: spacing[2] }}>
                {loyaltyActions.length ? loyaltyActions.map((action) => (
                  <ListItem
                    key={action.title}
                    title={action.title}
                    subtitle={action.subtitle}
                    onPress={action.onPress}
                    badgeLabel="عام"
                  />
                )) : (
                  <>
                    <ListItem
                      title="فتح المنافع العامة"
                      subtitle="عرض المسارات المشتركة، النقاط، والعروض"
                      onPress={onOpenBenefits}
                      badgeLabel="عام"
                    />
                    <ListItem
                      title="فتح الدفع"
                      subtitle="مراجعة العروض والأسعار قبل الإكمال"
                      onPress={onOpenCheckout}
                      badgeLabel="عام"
                    />
                    <ListItem
                      title="مراجعة الاشتراك"
                      subtitle="عرض الخطة العامة ومؤشرات التزامن"
                      onPress={onOpenSubscriptionReview}
                      badgeLabel="عام"
                    />
                  </>
                )}
              </View>
            </Surface>
          ),
        },
      ]}
    />
  );
}

export default ClientHubSurface;