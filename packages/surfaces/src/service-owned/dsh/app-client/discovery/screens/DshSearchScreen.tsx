import React from 'react';
import { BthBox, BthButton, BthCard, BthListItem, BthMobileScrollView, BthSearchField, BthSectionHeader, BthSurface, BthText } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../../patterns/screens/DshOperationScreen';

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
        <BthSurface tone="inset" gap={3}>
          <BthSearchField label="بحث" value={query} onChangeText={onQueryChange} hint="جرّب اسم متجر أو فئة أو عنصر محفوظ." />
          <BthSectionHeader
            title={hasQuery ? 'نتائج مطابقة' : 'استعراض المتاجر'}
            subtitle={hasQuery ? 'يتم تضييق النتائج مباشرة أثناء الكتابة.' : 'ابدأ بالكتابة لتصفية مجموعة الاكتشاف الحالية.'}
            count={results.length}
          />
          <BthBox layoutDirection="row" gap={2}>
            <BthButton label="الفئات" tone="secondary" onPress={onOpenCategories} />
            <BthButton label="المفضلة" tone="secondary" onPress={onOpenFavorites} />
          </BthBox>
          {results.length ? (
            <BthBox gap={2}>
              {results.map((result) => (
                <BthListItem key={result.id} title={result.title} subtitle={result.subtitle} meta={result.meta} onPress={() => onOpenResult?.(result.id)} />
              ))}
            </BthBox>
          ) : (
            <BthCard title="لا توجد نتائج بعد" subtitle="جرّب تعديل عبارة البحث أو الانتقال إلى قسم آخر.">
              <BthBox layoutDirection="row" gap={2}>
                <BthButton label="الفئات" tone="secondary" onPress={onOpenCategories} />
                <BthButton label="المفضلة" tone="secondary" onPress={onOpenFavorites} />
              </BthBox>
            </BthCard>
          )}
          <BthText role="caption" tone="muted">
            هذا المسار يمثل البحث العام المرتبط بزر البحث الرئيسي في تطبيق العميل، وليس بحثًا خاصًا بخدمة واحدة.
          </BthText>
        </BthSurface>
      }
      primaryActionLabel="العودة"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
}
