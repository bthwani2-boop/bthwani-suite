import React from 'react';
import { View } from 'react-native';
import {
  Icon,
  Divider,
  MobileScrollView,
  SearchTopBar,
  Surface,
  Text,
  TopBar,
  spacing,
  useTheme,
  Button,
} from '@bthwani/ui-kit';
import {
  fallbackOrderListItems,
  normalizeText,
  OrderRow,
  type DshOrdersListScreenProps,
} from './parts/OrdersTrackingHelpers';

export function DshOrdersListScreen({
  items = fallbackOrderListItems,
  query = '',
  onQueryChange,
  onOpenOrder,
  onReorder,
  onBack,
  onRetry,
}: DshOrdersListScreenProps) {
  const { theme } = useTheme();
  const [isSearchVisible, setIsSearchVisible] = React.useState(false);
  const normalizedQuery = normalizeText(query);
  const visibleItems = normalizedQuery
    ? items.filter((item) =>
        normalizeText(`${item.title} ${item.orderNumber} ${item.statusLabel} ${item.summary || ''}`).includes(normalizedQuery)
      )
    : items;

  const sortedItems = [...visibleItems].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      {isSearchVisible && onQueryChange ? (
        <SearchTopBar
          variant="surface"
          value={query}
          onChangeText={onQueryChange}
          onClose={() => {
            setIsSearchVisible(false);
            onQueryChange('');
          }}
          placeholder="ابحث برقم الطلب أو المتجر..."
          autoFocus
        />
      ) : (
        <TopBar
          variant="surface"
          title="طلباتي"
          layoutMode="balanced-secondary"
          actions={[
            onBack
              ? {
                  id: 'back',
                  icon: <Icon name="chevron-back" mirrored size={18} color={theme.text} />,
                  onPress: onBack,
                  accessibilityLabel: 'العودة',
                }
              : null,
            onQueryChange
              ? {
                  id: 'search',
                  icon: <Icon name="search-outline" size={20} color={theme.text} />,
                  onPress: () => setIsSearchVisible(true),
                  accessibilityLabel: 'البحث',
                }
              : null,
          ].filter(Boolean) as any}
        />
      )}
      <MobileScrollView fill contentContainerStyle={{ paddingBottom: spacing[8] }}>
        {sortedItems.length > 0 ? (
          <View style={{ paddingTop: spacing[2] }}>
            <Divider />
            {sortedItems.map((item, index) => (
              <OrderRow
                key={item.id}
                item={item}
                onOpenOrder={onOpenOrder}
                onReorder={onReorder}
                isLast={index === sortedItems.length - 1}
              />
            ))}
          </View>
        ) : (
          <View style={{ padding: spacing[4] }}>
            <Surface tone="raised" padding={4} radiusToken="xl" gap={2}>
              <Text role="titleMd" style={{ textAlign: 'center', fontWeight: '700' }}>لا توجد طلبات</Text>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'center' }}>لم نعثر على أي طلب يطابق بحثك.</Text>
              {onBack ? <Button label="العودة" tone="secondary" onPress={onBack} style={{ marginTop: spacing[2] }} /> : null}
              {onRetry ? <Button label="إعادة المحاولة" tone="ghost" onPress={onRetry} /> : null}
            </Surface>
          </View>
        )}
      </MobileScrollView>
    </View>
  );
}

export default DshOrdersListScreen;
