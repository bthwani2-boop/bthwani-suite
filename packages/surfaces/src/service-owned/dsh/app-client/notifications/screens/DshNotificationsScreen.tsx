import React from 'react';
import { Pressable } from 'react-native';
import { BthBadge, BthBox, BthButton, BthMobileScrollView, BthSurface, BthText } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../../patterns/screens/DshOperationScreen';
import { dshNotificationsFixtures } from '../fixtures/dshNotificationsFixtures';

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
    <BthBox
      background="warningSurface"
      border
      borderTone="brand"
      radiusToken="pill"
      align="center"
      justify="center"
      style={{ width: 48, height: 48, flexShrink: 0 }}
    >
      <BthBox background="brand" radiusToken="pill" style={{ width: 12, height: 12 }} />
    </BthBox>
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
    <BthSurface tone="raised" padding={4} gap={3} radiusToken="xl" elevationToken="raised" style={{ width: '100%' }}>
      <BthBox layoutDirection="row" justify="space-between" align="flex-start" gap={3}>
        <NotificationGlyph />
        <BthBox gap={2} style={{ flex: 1 }}>
          <BthText role="bodyStrong" align="start" numberOfLines={2}>
            {item.title}
          </BthText>
          <BthText role="bodySm" tone="muted" align="start" numberOfLines={3}>
            {item.subtitle}
          </BthText>
        </BthBox>
      </BthBox>
      <BthBox layoutDirection="row" justify="space-between" align="center" gap={3}>
        <BthBadge label={item.badgeLabel} tone={resolveBadgeTone(item.badgeLabel)} />
        <BthText role="caption" tone="soft" align="end">
          {item.meta}
        </BthText>
      </BthBox>
    </BthSurface>
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
    <BthBox gap={2}>
      <BthBox layoutDirection="row" justify="space-between" align="center" gap={3}>
        <BthBox gap={1} style={{ flex: 1, alignItems: 'flex-end' }}>
          <BthText role="titleSm">آخر التنبيهات</BthText>
          <BthText role="bodySm" tone="muted" align="start">
            كل بطاقة تختصر خطوة واحدة وتفتح مساراً واضحاً.
          </BthText>
        </BthBox>
        <BthBox
          background="brandSurface"
          border
          borderTone="brand"
          radiusToken="pill"
          align="center"
          justify="center"
          style={{ width: 42, height: 42, flexShrink: 0 }}
        >
          <BthText role="bodyStrong" tone="brand" align="center">
            {count}
          </BthText>
        </BthBox>
      </BthBox>
    </BthBox>
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
    <BthSurface tone="inset" padding={5} gap={3}>
      <BthText role="titleSm">لا توجد إشعارات حالياً</BthText>
      <BthText role="bodySm" tone="muted">
        عندما يصل تنبيه جديد سيظهر هنا بنفس البنية الواضحة والبسيطة.
      </BthText>
      <BthBox layoutDirection="row" gap={2}>
        {onOpenSearch ? <BthButton label="بحث DSH" tone="secondary" fullWidth={false} onPress={onOpenSearch} /> : null}
        {onBack ? <BthButton label="رجوع" tone="ghost" fullWidth={false} onPress={onBack} /> : null}
      </BthBox>
    </BthSurface>
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
    <BthMobileScrollView fill padding={4} gap={4}>
      <BthSurface tone="brand" padding={5} gap={4} radiusToken="xl" elevationToken="raised">
        <BthBox layoutDirection="row" justify="space-between" align="center" gap={3}>
          <BthButton label="رجوع" tone="ghost" size="sm" fullWidth={false} onPress={onBack} />
          <BthBox
            background="surface"
            border
            borderTone="brand"
            radiusToken="pill"
            paddingX={3}
            paddingY={1}
            style={{ alignSelf: 'flex-start' }}
          >
            <BthText role="label" tone="brand">
              DSH تنبيهات
            </BthText>
          </BthBox>
        </BthBox>

        <BthBox gap={2}>
          <BthText role="titleLg" align="center">
            الإشعارات
          </BthText>
          <BthText role="bodyMd" tone="muted" align="center">
            إشعارات DSH المرتبطة بمزامنة الاشتراك والطلب النشط، بواجهة أوضح وأخف.
          </BthText>
        </BthBox>
      </BthSurface>

      <DshNotificationsSectionHeader count={resolvedItems.length} />

      <BthBox gap={3}>
        {resolvedItems.length ? (
          resolvedItems.map((item) => <DshNotificationCard key={item.id} item={item} onPress={item.onPress} />)
        ) : (
          <DshNotificationsEmptyState onOpenSearch={onOpenSearch} onBack={onBack} />
        )}
      </BthBox>
    </BthMobileScrollView>
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