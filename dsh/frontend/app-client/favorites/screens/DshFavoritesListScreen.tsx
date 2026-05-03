import React from 'react';
import { Box, ListItem, Surface, Text } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../../patterns/screens/DshOperationScreen';

export type DshFavoritesListItem = { id: string; name: string; subtitle: string; meta: string; };
export type DshFavoritesListScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  items: DshFavoritesListItem[];
  onOpenItem?: (itemId: string) => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

export function DshFavoritesListScreen({ state = 'ready', items, onOpenItem, onBack, onRetry, onSupport }: DshFavoritesListScreenProps) {
  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="قائمة المفضلة" subtitle="افتح عنصرًا محفوظًا أو ارجع إلى الاكتشاف." onRetry={onRetry} />;
  }

  if (!items.length) {
    return <DshOperationScreen state="empty" title="قائمة المفضلة" subtitle="لا توجد عناصر محفوظة حتى الآن. ارجع للاكتشاف أو أعد المحاولة." onRetry={onRetry} />;
  }

  return (
    <DshOperationScreen
      state="ready"
      title="قائمة المفضلة"
      subtitle="افتح العنصر المحفوظ بأقصر مسار ممكن."
      content={
        <Surface tone="raised" gap={3}>
          <Box gap={2}>
            {items.map((item) => (
              <ListItem key={item.id} title={item.name} subtitle={item.subtitle} meta={item.meta} onPress={() => onOpenItem?.(item.id)} />
            ))}
          </Box>
          <Text role="caption" tone="muted">العناصر المحفوظة تبقى على بُعد نقرة واحدة من الاكتشاف النشط.</Text>
        </Surface>
      }
      primaryActionLabel="رجوع"
      onPrimaryAction={onBack}
      secondaryActionLabel="Support"
      onSecondaryAction={onSupport}
      onRetry={onRetry}
    />
  );
}