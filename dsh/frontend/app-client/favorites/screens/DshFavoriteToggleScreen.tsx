import React from 'react';
import { Card, SectionHeader, StateView, Surface, Text } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../../patterns/screens/DshOperationScreen';

export type DshFavoriteToggleScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  itemLabel?: string;
  currentFavorite?: boolean;
  onToggleFavorite?: () => void | Promise<void>;
  onOpenFavorites?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

export function DshFavoriteToggleScreen({ state = 'ready', itemLabel = 'العنصر المحدد', currentFavorite = false, onToggleFavorite, onOpenFavorites, onBack, onRetry, onSupport }: DshFavoriteToggleScreenProps) {
  const [isFavorite, setIsFavorite] = React.useState(currentFavorite);
  const [phase, setPhase] = React.useState<'ready' | 'loading' | 'success'>('ready');

  const submit = React.useCallback(async () => {
    setPhase('loading');
    try {
      await Promise.resolve(onToggleFavorite?.());
      setIsFavorite((current) => !current);
      setPhase('success');
    } catch {
      setPhase('ready');
    }
  }, [onToggleFavorite]);

  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="تبديل المفضلة" subtitle="أضف أو أزل المفضلة دون فقدان سياق المسار." onRetry={onRetry} />;
  }

  if (phase === 'loading') return <StateView stateId="loading" />;

  if (phase === 'success') {
    return (
      <DshOperationScreen
        state="ready"
        title="تم تحديث المفضلة"
        subtitle="أصبحت الحالة المحفوظة جاهزة للعرض داخل قائمة المفضلة."
        content={
          <Surface tone="success" gap={3}>
            <SectionHeader title="نتيجة التبديل" subtitle="أبقِ النتيجة واضحة مع خطوة تالية صريحة." />
            <Card title={itemLabel} subtitle={isFavorite ? 'تمت الإضافة إلى المفضلة' : 'تمت الإزالة من المفضلة'} />
          </Surface>
        }
        primaryActionLabel="فتح المفضلة"
        onPrimaryAction={onOpenFavorites}
        secondaryActionLabel="رجوع"
        onSecondaryAction={onBack}
        tertiaryActionLabel="Support"
        onTertiaryAction={onSupport}
        onRetry={onRetry}
      />
    );
  }

  return (
    <DshOperationScreen
      state="ready"
      title="تبديل المفضلة"
      subtitle="أضف أو أزل المفضلة دون فقدان سياق المسار."
      content={
        <Surface tone="raised" gap={3}>
          <SectionHeader title="العنصر الحالي" subtitle="يبقى العنصر ظاهرًا أثناء تعديل حالة الحفظ." />
          <Card title={itemLabel} subtitle={isFavorite ? 'موجود حاليًا في المفضلة' : 'غير موجود حاليًا في المفضلة'} />
          <Text role="caption" tone="muted">استخدم الحفظ لتسريع الوصول في الزيارات القادمة.</Text>
        </Surface>
      }
      primaryActionLabel={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
      onPrimaryAction={() => void submit()}
      secondaryActionLabel="فتح المفضلة"
      onSecondaryAction={onOpenFavorites}
      tertiaryActionLabel="Support"
      onTertiaryAction={onSupport}
      onRetry={onRetry}
    />
  );
}