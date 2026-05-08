import React from 'react';
import { Pressable } from 'react-native';
import { Badge, Box, Button, Icon, MobileScrollView, Surface, Text, TopBar } from '@bthwani/ui-kit';
import { DshOperationScreen } from './DshOperationScreen';
import { dshNotificationsFixtures } from './dshNotificationsFixtures';

export type DshNotificationActionTarget = 'benefits' | 'tracking' | 'orders-list' | 'search';

export type DshNotificationItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
  actionTarget: DshNotificationActionTarget;
  onPress?: () => void;
};

export type DshNotificationsScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  items?: DshNotificationItem[];
  onOpenBenefits?: () => void;
  onOpenTracking?: () => void;
  onOpenOrders?: () => void;
  onOpenSearch?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
};

function resolveBadgeTone(badgeLabel: string) {
  if (/اشتراك/i.test(badgeLabel)) {
    return 'brand' as const;
  }

  if (/مباشر|Live/i.test(badgeLabel)) {
    return 'warning' as const;
  }

  if (/طلب|Order/i.test(badgeLabel)) {
    return 'brand' as const;
  }

  if (/عرض|Offer/i.test(badgeLabel)) {
    return 'info' as const;
  }

  return 'default' as const;
}

function resolveNotificationPress(
  actionTarget: DshNotificationActionTarget,
  callbacks: {
    onOpenBenefits?: () => void;
    onOpenTracking?: () => void;
    onOpenOrders?: () => void;
    onOpenSearch?: () => void;
  },
) {
  if (actionTarget === 'benefits') {
    return callbacks.onOpenBenefits ?? callbacks.onOpenSearch;
  }

  if (actionTarget === 'tracking') {
    return callbacks.onOpenTracking ?? callbacks.onOpenOrders;
  }

  if (actionTarget === 'orders-list') {
    return callbacks.onOpenOrders ?? callbacks.onOpenTracking;
  }

  return callbacks.onOpenSearch ?? callbacks.onOpenBenefits;
}

function NotificationGlyph() {
  return (
    <Box
      background="warningSurface"
      border
      borderTone="brand"
      radiusToken="pill"
      align="center"
      justify="center"
      style={{ width: 48, height: 48, flexShrink: 0 }}
    >
      <Box background="brand" radiusToken="pill" style={{ width: 12, height: 12 }} />
    </Box>
  );
}

function DshNotificationCard({
  item,
  onPress,
}: {
  item: DshNotificationItem;
  onPress?: () => void;
}) {
  const card = (
    <Surface tone="raised" padding={4} gap={3} radiusToken="xl" elevationToken="raised" style={{ width: '100%' }}>
      <Box layoutDirection="row" justify="space-between" align="flex-start" gap={3}>
        <NotificationGlyph />
        <Box gap={2} style={{ flex: 1 }}>
          <Text role="bodyStrong" align="start" numberOfLines={2}>
            {item.title}
          </Text>
          <Text role="bodySm" tone="muted" align="start" numberOfLines={3}>
            {item.subtitle}
          </Text>
        </Box>
      </Box>
      <Box layoutDirection="row" justify="space-between" align="center" gap={3}>
        <Badge label={item.badgeLabel} tone={resolveBadgeTone(item.badgeLabel)} />
        <Text role="caption" tone="soft" align="end">
          {item.meta}
        </Text>
      </Box>
    </Surface>
  );

  if (!onPress) {
    return card;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: '100%',
          opacity: pressed ? 0.94 : 1,
        },
      ]}
    >
      {card}
    </Pressable>
  );
}

function DshNotificationsSectionHeader({ count }: { count: number }) {
  return (
    <Box gap={2}>
      <Box layoutDirection="row" justify="space-between" align="center" gap={3}>
        <Box gap={1} style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text role="titleSm">آخر التنبيهات</Text>
        </Box>
        <Box
          background="brandSurface"
          border
          borderTone="brand"
          radiusToken="pill"
          align="center"
          justify="center"
          style={{ width: 42, height: 42, flexShrink: 0 }}
        >
          <Text role="bodyStrong" tone="brand" align="center">
            {count}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

function DshNotificationsEmptyState({
  onOpenSearch,
  onBack,
}: {
  onOpenSearch?: () => void;
  onBack?: () => void;
}) {
  return (
    <Surface tone="inset" padding={5} gap={3}>
      <Text role="titleSm">لا توجد إشعارات حالياً</Text>
      <Text role="bodySm" tone="muted">
        عندما يصل تنبيه جديد سيظهر هنا بنفس البنية الواضحة والبسيطة.
      </Text>
      <Box layoutDirection="row" gap={2}>
        {onOpenSearch ? <Button label="بحث DSH" tone="secondary" fullWidth={false} onPress={onOpenSearch} /> : null}
        {onBack ? <Button label="رجوع" tone="ghost" fullWidth={false} onPress={onBack} /> : null}
      </Box>
    </Surface>
  );
}

function renderContent(
  items: DshNotificationItem[],
  onOpenBenefits?: () => void,
  onOpenTracking?: () => void,
  onOpenOrders?: () => void,
  onOpenSearch?: () => void,
  onBack?: () => void,
) {
  const resolvedItems = items.slice(0, 2).map((item) => ({
    ...item,
    onPress: item.onPress ?? resolveNotificationPress(item.actionTarget, { onOpenBenefits, onOpenTracking, onOpenOrders, onOpenSearch }),
  }));

  return (
    <Box flex={1}>
      <TopBar
        variant="surface"
        title="الإشعارات"
        trailingAction={
          onBack
            ? {
                id: 'back',
                icon: <Icon name="arrow-back" size={24} tone="brand" />,
                mirrorInRtl: true,
                accessibilityLabel: 'رجوع',
                onPress: onBack,
              }
            : undefined
        }
      />

      <MobileScrollView fill padding={4} gap={4}>
        <DshNotificationsSectionHeader count={resolvedItems.length} />

        <Box gap={3}>
          {resolvedItems.length ? (
            resolvedItems.map((item) => <DshNotificationCard key={item.id} item={item} onPress={item.onPress} />)
          ) : (
            <DshNotificationsEmptyState onOpenSearch={onOpenSearch} onBack={onBack} />
          )}
        </Box>
      </MobileScrollView>
    </Box>
  );
}

export function DshNotificationsScreen({
  state = 'ready',
  items = dshNotificationsFixtures,
  onOpenBenefits,
  onOpenTracking,
  onOpenOrders,
  onOpenSearch,
  onBack,
  onRetry,
}: DshNotificationsScreenProps) {
  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="الإشعارات" subtitle="تنبيهات DSH المخصصة" onRetry={onRetry} />;
  }

  return renderContent(items, onOpenBenefits, onOpenTracking, onOpenOrders, onOpenSearch, onBack);
}

export default DshNotificationsScreen;
