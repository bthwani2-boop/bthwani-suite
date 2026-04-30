import React from 'react';
import { View } from 'react-native';
import {
  Badge,
  Button,
  DashboardShell,
  ListItem,
  SearchField,
  Surface,
  Text,
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
    <DashboardShell
      title="البحث العام"
      subtitle="مدخل موحد للوصول السريع إلى الخدمات والمسارات المشتركة"
      hero={
        <Surface tone="brand" padding={5} gap={4}>
          <View style={{ gap: spacing[2] }}>
            <Badge label="عالمي · سريع" tone="default" />
            <Text role="titleSm" tone="inverse">
              ابحث مرة واحدة
            </Text>
            <Text role="bodyMd" tone="inverse">
              خدمة، إعداد، إشعار، أو مسار عام. كل شيء يمر من هنا بدون تشتيت.
            </Text>
          </View>

          <SearchField
            label="بحث"
            value={queryValue}
            onChangeText={onChangeQuery}
            hint="جرّب: توصيل، إعدادات، إشعارات، دعم"
          />

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
            {onBack ? <Button label="العودة" tone="ghost" onPress={onBack} fullWidth={false} /> : null}
            {onClearQuery ? <Button label="مسح" tone="secondary" onPress={onClearQuery} fullWidth={false} /> : null}
          </View>
        </Surface>
      }
      sections={[
        {
          title: 'نتائج البحث',
          subtitle: results.length ? `${results.length} نتيجة متاحة` : 'لا توجد نتيجة مطابقة حاليًا',
          content: (
            <Surface tone="raised" padding={3} gap={2}>
              {results.length ? (
                results.map((item) => (
                  <ListItem
                    key={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                    badgeLabel={item.badgeLabel ?? 'عام'}
                    onPress={item.onPress}
                  />
                ))
              ) : (
                <Text role="bodySm" tone="muted">
                  لا توجد نتائج مطابقة. جرّب اسم خدمة أو مسار عام مختلف.
                </Text>
              )}
            </Surface>
          ),
        },
      ]}
    />
  );
}

export default ClientSearchSurface;