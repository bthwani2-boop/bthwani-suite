import React from 'react';
import { Box, Button, Card, ListItem, SearchField, SectionHeader, Surface, Text } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../parts/OperationScreen';

export type DshSearchResult = { id: string; title: string; subtitle: string; meta?: string };
export type DshSearchScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  query?: string;
  results: DshSearchResult[];
  onQueryChange?: (query: string) => void;
  onOpenResult?: (resultId: string) => void;
  onOpenCategories?: () => void;
  onOpenFavorites?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
};

export function DshSearchScreen({ state = 'ready', query = '', results, onQueryChange, onOpenResult, onOpenCategories, onOpenFavorites, onBack, onRetry }: DshSearchScreenProps) {
  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="البحث العام" subtitle="مدخل سريع للوصول إلى المتاجر والفئات والعناصر المحفوظة." onRetry={onRetry} />;
  }

  const hasQuery = query.trim().length > 0;

  return (
    <DshOperationScreen
      state="ready"
      title="البحث العام"
      subtitle="مدخل موحد وسريع داخل تطبيق العميل للوصول إلى المتاجر والمسارات المشتركة."
      content={
        <Surface tone="inset" gap={3}>
          <SearchField label="بحث" value={query} onChangeText={onQueryChange} hint="جرّب اسم متجر أو فئة أو عنصر محفوظ." />
          <SectionHeader
            title={hasQuery ? 'نتائج مطابقة' : 'استعراض المتاجر'}
            subtitle={hasQuery ? 'يتم تضييق النتائج مباشرة أثناء الكتابة.' : 'ابدأ بالكتابة لتصفية مجموعة الاكتشاف الحالية.'}
            count={results.length}
          />
          <Box layoutDirection="row" gap={2}>
            <Button label="الفئات" tone="secondary" onPress={onOpenCategories} />
            <Button label="المفضلة" tone="secondary" onPress={onOpenFavorites} />
          </Box>
          {results.length ? (
            <Box gap={2}>
              {results.map((result) => (
                <ListItem key={result.id} title={result.title} subtitle={result.subtitle} meta={result.meta} onPress={() => onOpenResult?.(result.id)} />
              ))}
            </Box>
          ) : (
            <Card
              title="لا توجد نتائج بعد"
              subtitle="جرّب تعديل عبارة البحث أو الانتقال إلى قسم آخر."
              footer={
                <Box layoutDirection="row" gap={2}>
                  <Button label="الفئات" tone="secondary" onPress={onOpenCategories} />
                  <Button label="المفضلة" tone="secondary" onPress={onOpenFavorites} />
                </Box>
              }
            />
          )}
          <Text role="caption" tone="muted">
            هذا المسار يمثل البحث العام المرتبط بزر البحث الرئيسي في تطبيق العميل، وليس بحثًا خاصًا بخدمة واحدة.
          </Text>
        </Surface>
      }
      primaryActionLabel="العودة"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
}
