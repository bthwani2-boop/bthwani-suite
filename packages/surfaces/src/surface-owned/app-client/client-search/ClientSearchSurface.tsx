import React from 'react';
import { View } from 'react-native';
import {
  BthBadge,
  BthButton,
  BthDashboardShell,
  BthListItem,
  BthSearchField,
  BthSurface,
  BthText,
  spacing,
} from '@bthwani/ui-kit';

export type ClientSearchResult = {
  id: string;
  title: string;
  subtitle: string;
  badgeLabel?: string;
  onPress?: () => void;
};

export type ClientSearchSurfaceProps = {
  queryValue: string;
  onChangeQuery: (value: string) => void;
  results: readonly ClientSearchResult[];
  onBack?: () => void;
  onClearQuery?: () => void;
};

export function ClientSearchSurface({
  queryValue,
  onChangeQuery,
  results,
  onBack,
  onClearQuery,
}: ClientSearchSurfaceProps) {
  return (
    <BthDashboardShell
      title="البحث العام"
      subtitle="مدخل موحد للوصول السريع إلى الخدمات والمسارات المشتركة"
      hero={
        <BthSurface tone="brand" padding={5} gap={4}>
          <View style={{ gap: spacing[2] }}>
            <BthBadge label="عالمي · سريع" tone="default" />
            <BthText role="titleSm" tone="inverse">
              ابحث مرة واحدة
            </BthText>
            <BthText role="bodyMd" tone="inverse">
              خدمة، إعداد، إشعار، أو مسار عام. كل شيء يمر من هنا بدون تشتيت.
            </BthText>
          </View>

          <BthSearchField
            label="بحث"
            value={queryValue}
            onChangeText={onChangeQuery}
            hint="جرّب: توصيل، إعدادات، إشعارات، دعم"
          />

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
            {onBack ? <BthButton label="العودة" tone="ghost" onPress={onBack} fullWidth={false} /> : null}
            {onClearQuery ? <BthButton label="مسح" tone="secondary" onPress={onClearQuery} fullWidth={false} /> : null}
          </View>
        </BthSurface>
      }
      sections={[
        {
          title: 'نتائج البحث',
          subtitle: results.length ? `${results.length} نتيجة متاحة` : 'لا توجد نتيجة مطابقة حاليًا',
          content: (
            <BthSurface tone="raised" padding={3} gap={2}>
              {results.length ? (
                results.map((item) => (
                  <BthListItem
                    key={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                    badgeLabel={item.badgeLabel ?? 'عام'}
                    onPress={item.onPress}
                  />
                ))
              ) : (
                <BthText role="bodySm" tone="muted">
                  لا توجد نتائج مطابقة. جرّب اسم خدمة أو مسار عام مختلف.
                </BthText>
              )}
            </BthSurface>
          ),
        },
      ]}
    />
  );
}

export default ClientSearchSurface;