import React from 'react';
import { Pressable, View } from 'react-native';
import { Box, Button, Divider, MobileScrollView, Text, TopBar } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../parts/OperationScreen';
import type { DshFulfillmentDeliveryMode } from '../contracts/dsh-client-binding.contracts';
import { dshNotificationsFixtures } from '../../data/support.preview-data';

export type DshNotificationActionTarget = 'benefits' | 'tracking' | 'orders-list' | 'search' | 'none';

export type DshNotificationCategory = 'order' | 'bell' | 'support' | 'offer' | 'subscription' | 'wallet' | 'system';

export type DshNotificationItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string; // ISO or preview timestamp (display as relative)
  badgeLabel: string;
  category: DshNotificationCategory;
  readState?: 'unread' | 'read';
  priority?: 'normal' | 'important' | 'urgent';
  actionTarget: DshNotificationActionTarget;
  relativeTime?: string;
  timeGroup?: 'now' | 'today' | 'yesterday' | 'earlier';
  retentionPolicy?: { days?: number; hours?: number; note?: string };
  fulfillmentMode?: DshFulfillmentDeliveryMode;
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

// Internal retention policy preview-only mapping
const RETENTION_POLICY_MAP: Record<DshNotificationCategory, string> = {
  order: 'حتى انتهاء الطلب + 24 ساعة',
  bell: 'حتى تغير حالة الطلب أو 6 ساعات',
  support: 'حتى إغلاق البلاغ + 72 ساعة',
  offer: 'حتى انتهاء العرض أو 7 أيام',
  subscription: '30 يومًا',
  wallet: '30 يومًا',
  system: '7 أيام',
};

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

  if (actionTarget === 'search') {
    return callbacks.onOpenSearch ?? callbacks.onOpenBenefits;
  }

  return undefined;
}

function relativeTimeFrom(meta: string) {
  try {
    const t = Date.parse(meta);
    if (Number.isNaN(t)) return meta;
    const diff = Date.now() - t;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  } catch {
    return meta;
  }
}

function resolveFulfillmentModeLabel(mode?: DshFulfillmentDeliveryMode) {
  if (mode === 'bthwani_delivery') return 'توصيل بثواني';
  if (mode === 'partner_delivery') return 'توصيل المتجر';
  if (mode === 'pickup') return 'استلام بنفسي';
  return null;
}

function DshNotificationRow({ item, onPress }: { item: DshNotificationItem; onPress?: () => void }) {
  const timeText = item.relativeTime ?? relativeTimeFrom(item.meta);
  const retentionNote = RETENTION_POLICY_MAP[item.category] || '';
  const fulfillmentModeLabel = resolveFulfillmentModeLabel(item.fulfillmentMode);
  const metaSegments = [
    timeText,
    item.badgeLabel,
    fulfillmentModeLabel,
  ].filter(Boolean);
  const metaText = `${metaSegments.join(' · ')}${retentionNote ? ` (صلاحية: ${retentionNote})` : ''}`;

  const isUnread = item.readState === 'unread';
  const isUrgent = item.priority === 'urgent' && isUnread;
  const isImportant = item.priority === 'important' && isUnread;

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        {
          backgroundColor: 'transparent',
          opacity: onPress && pressed ? 0.75 : 1,
        },
      ]}
    >
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'flex-start',
          paddingVertical: 12,
          paddingHorizontal: 16,
          minHeight: 58,
        }}
      >
        {/* Right side: Orange unread dot or minimal space (in row-reverse first child is rightmost) */}
        <View style={{ width: 14, alignItems: 'center', justifyContent: 'flex-start', marginTop: 6 }}>
          {isUnread && (
            <Box
              background="brand"
              radiusToken="pill"
              style={{ width: 6, height: 6 }}
            />
          )}
        </View>

        {/* Text Area (Align right, RTL style) */}
        <View style={{ flex: 1, alignItems: 'flex-end', paddingHorizontal: 4 }}>
          <Text
            role="bodyStrong"
            align="end"
            numberOfLines={1}
            style={{ textAlign: 'right', writingDirection: 'rtl' }}
          >
            {item.title}
          </Text>
          <Text
            role="bodySm"
            tone="muted"
            align="end"
            numberOfLines={1}
            style={{ textAlign: 'right', writingDirection: 'rtl', marginTop: 2 }}
          >
            {item.subtitle}
          </Text>
          <Text
            role="caption"
            tone="soft"
            align="end"
            numberOfLines={1}
            style={{ textAlign: 'right', writingDirection: 'rtl', marginTop: 3 }}
          >
            {metaText}
          </Text>
        </View>

        {/* Left side: Accent badge if urgent or important (placed leftmost in row-reverse since it's the last child) */}
        {(isUrgent || isImportant) && (
          <Box
            background={isUrgent ? 'dangerSurface' : 'brandSurface'}
            radiusToken="xs"
            style={{
              paddingHorizontal: 6,
              paddingVertical: 2,
              marginLeft: 8,
              alignSelf: 'flex-start',
            }}
          >
            <Text
              role="caption"
              tone={isUrgent ? 'danger' : 'brand'}
              style={{ textAlign: 'right', fontWeight: 'bold' }}
            >
              {isUrgent ? 'عاجل' : 'هام'}
            </Text>
          </Box>
        )}
      </View>
    </Pressable>
  );
}

function renderContent(
  items: DshNotificationItem[],
  onOpenBenefits?: () => void,
  onOpenTracking?: () => void,
  onOpenOrders?: () => void,
  onOpenSearch?: () => void,
  _onBack?: () => void,
) {
  // Smart sorting: unread first, priority, category order, newest first
  const resolvedItems = items
    .map((item) => ({
      ...item,
      onPress: item.onPress ?? resolveNotificationPress(item.actionTarget, { onOpenBenefits, onOpenTracking, onOpenOrders, onOpenSearch }),
    }))
    .sort((a, b) => {
      // 1. readState: unread first
      const ra = a.readState === 'unread' ? 1 : 0;
      const rb = b.readState === 'unread' ? 1 : 0;
      if (ra !== rb) return rb - ra;

      // 2. priority: urgent (3) > important (2) > normal (1)
      const priorityScore = (p?: string) => (p === 'urgent' ? 3 : p === 'important' ? 2 : 1);
      const pa = priorityScore(a.priority);
      const pb = priorityScore(b.priority);
      if (pa !== pb) return pb - pa;

      // 3. category order: order/bell/support before offer/subscription/wallet/system
      const categoryOrder: Record<DshNotificationCategory, number> = {
        order: 0,
        bell: 1,
        support: 2,
        offer: 3,
        subscription: 4,
        wallet: 5,
        system: 6,
      };
      const ca = categoryOrder[a.category] ?? 99;
      const cb = categoryOrder[b.category] ?? 99;
      if (ca !== cb) return ca - cb;

      // 4. time: newest first
      const ta = Date.parse(a.meta) || 0;
      const tb = Date.parse(b.meta) || 0;
      return tb - ta;
    });

  // Find single urgent/important unread to show as top attention row
  const topAttention = resolvedItems.find((it) => it.readState === 'unread' && (it.priority === 'urgent' || it.priority === 'important'));
  const otherItems = resolvedItems.filter((it) => !topAttention || it.id !== topAttention.id);

  const todayAll = otherItems.filter((item) => item.timeGroup === 'now' || item.timeGroup === 'today');
  const earlierAll = otherItems.filter((item) => item.timeGroup === 'yesterday' || item.timeGroup === 'earlier');

  const todayItems = todayAll.slice(0, 3);
  const earlierItems = earlierAll.slice(0, 2);

  const hasMoreItems = todayAll.length > 3 || earlierAll.length > 2;

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        variant="surface"
        title="الإشعارات"
      />

      <MobileScrollView fill padding={3} gap={3}>
        {topAttention ? (
          <View style={{ gap: 2 }}>
            <Text role="titleSm" align="end" style={{ textAlign: 'right', paddingHorizontal: 12, marginTop: 4 }}>
              يحتاج انتباهك الآن
            </Text>
            <Box background="surface" border borderTone="line" radiusToken="lg" style={{ overflow: 'hidden' }}>
              <DshNotificationRow item={topAttention} onPress={topAttention.onPress} />
            </Box>
          </View>
        ) : null}

        <View style={{ gap: 2 }}>
          <Text role="titleSm" align="end" style={{ textAlign: 'right', paddingHorizontal: 12 }}>
            اليوم
          </Text>
          <Box background="surface" border borderTone="line" radiusToken="lg" style={{ overflow: 'hidden' }}>
            {todayItems.length ? (
              todayItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <Divider style={{ opacity: 0.15 }} />}
                  <DshNotificationRow item={item} onPress={item.onPress} />
                </React.Fragment>
              ))
            ) : (
              <View style={{ padding: 16 }}>
                <Text role="bodySm" tone="soft" align="end" style={{ textAlign: 'right' }}>
                  لا توجد تنبيهات اليوم
                </Text>
              </View>
            )}
          </Box>
        </View>

        <View style={{ gap: 2 }}>
          <Text role="titleSm" align="end" style={{ textAlign: 'right', paddingHorizontal: 12 }}>
            سابقًا
          </Text>
          <Box background="surface" border borderTone="line" radiusToken="lg" style={{ overflow: 'hidden' }}>
            {earlierItems.length ? (
              earlierItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <Divider style={{ opacity: 0.15 }} />}
                  <DshNotificationRow item={item} onPress={item.onPress} />
                </React.Fragment>
              ))
            ) : (
              <View style={{ padding: 16 }}>
                <Text role="bodySm" tone="soft" align="end" style={{ textAlign: 'right' }}>
                  لا توجد تنبيهات سابقة
                </Text>
              </View>
            )}
          </Box>
        </View>

        {hasMoreItems && onOpenSearch ? (
          <View style={{ alignItems: 'flex-end', marginTop: 12, paddingHorizontal: 12 }}>
            <Button
              label="عرض الأقدم"
              tone="secondary"
              fullWidth={false}
              onPress={onOpenSearch}
              size="sm"
            />
          </View>
        ) : null}
      </MobileScrollView>
    </View>
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
