import React from 'react';
import { View } from 'react-native';
import { BthDashboardShell, BthListItem, BthSurface, BthText, spacing } from '@bthwani/ui-kit';

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
  summary = 'تجميع عام يضم الدخول السريع والعناصر العابرة لكل الخدمات',
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
  return (
    <BthDashboardShell
      title={headline}
      subtitle={summary}
      hero={
        <BthSurface tone="raised" padding={5} gap={3}>
          <BthText role="titleSm">ملخص عام</BthText>
          <View style={{ gap: spacing[2] }}>
            {highlights.map((item) => (
              <BthListItem key={item.label} title={item.label} meta={item.value} />
            ))}
          </View>
        </BthSurface>
      }
      sections={[
        {
          title: 'الاختصارات العامة',
          subtitle: 'مؤشرات أو انتقالات لا تملك بيانات خدمة',
          content: (
            <View style={{ gap: spacing[3] }}>
              {quickActions.length ? quickActions.map((action) => (
                <BthListItem key={action.title} title={action.title} subtitle={action.subtitle} onPress={action.onPress} />
              )) : (
                <BthText role="bodySm" tone="muted">لا توجد اختصارات مضافة بعد.</BthText>
              )}
            </View>
          ),
        },
        {
          title: 'الولاء والاشتراكات',
          subtitle: 'نقطة دخول رسمية إلى benefits والنقاط والكوبونات داخل DSH',
          content: (
            <View style={{ gap: spacing[3] }}>
              <View style={{ gap: spacing[2] }}>
                {loyaltyHighlights.map((item) => (
                  <BthListItem key={item.label} title={item.label} meta={item.value} />
                ))}
              </View>
              <View style={{ gap: spacing[2] }}>
                {loyaltyActions.length ? loyaltyActions.map((action) => (
                  <BthListItem key={action.title} title={action.title} subtitle={action.subtitle} onPress={action.onPress} />
                )) : (
                  <>
                    <BthListItem
                      title="فتح الولاء"
                      subtitle="عرض subscription, points, and coupon truth"
                      onPress={onOpenBenefits}
                    />
                    <BthListItem
                      title="فتح الدفع"
                      subtitle="مراجعة promo apply و pricing lane"
                      onPress={onOpenCheckout}
                    />
                    <BthListItem
                      title="مراجعة الاشتراك"
                      subtitle="عرض خطة الشريك ونقاط التزامن"
                      onPress={onOpenSubscriptionReview}
                    />
                  </>
                )}
              </View>
            </View>
          ),
        },
      ]}
    />
  );
}

export default ClientHubSurface;