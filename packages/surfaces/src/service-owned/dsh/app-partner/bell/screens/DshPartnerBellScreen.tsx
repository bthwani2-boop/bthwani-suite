import React from 'react';
import { Pressable, View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Icon,
  MobileScrollView,
  MobileWorkspaceHeader,
  StateView,
  StatCard,
  Surface,
  Text,
  useDirection,
  useTheme,
} from '@bthwani/ui-kit';

type DshPartnerBellScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
type DshPartnerNotificationFilter = 'all' | 'orders' | 'operations' | 'inventory' | 'finance' | 'system';
type DshPartnerNotificationCategory = Exclude<DshPartnerNotificationFilter, 'all'>;
type DshPartnerNotificationStatus = 'unread' | 'read';

export type DshPartnerNotificationItem = {
  id: string;
  category: DshPartnerNotificationCategory;
  title: string;
  body: string;
  timeLabel: string;
  status: DshPartnerNotificationStatus;
  urgent?: boolean;
  icon: React.ComponentProps<typeof Icon>['name'];
  actionLabel?: string;
};

type BellStateCopy = {
  stateId?: 'loading' | 'empty' | 'recoverableError' | 'offline';
  kind?: 'warning';
  title: string;
  description: string;
  actionLabel?: string;
};

const defaultItems: DshPartnerNotificationItem[] = [
  {
    id: 'partner-notification-1',
    category: 'orders',
    title: 'طلب جديد يحتاج قبول الفرع',
    body: 'الطلب 1042 دخل الآن إلى الفرع ويحتاج قرار قبول سريع قبل بدء التجهيز.',
    timeLabel: 'منذ دقيقتين',
    status: 'unread',
    urgent: true,
    icon: 'receipt-outline',
    actionLabel: 'فتح الطلب',
  },
  {
    id: 'partner-notification-2',
    category: 'orders',
    title: 'طلب اقترب من حد SLA',
    body: 'الطلب 1048 بقي له هامش قصير قبل التأخير ويحتاج مراجعة فورية من الفريق.',
    timeLabel: 'منذ 8 دقائق',
    status: 'unread',
    icon: 'alert-circle-outline',
    actionLabel: 'فتح الطلب',
  },
  {
    id: 'partner-notification-3',
    category: 'inventory',
    title: 'منتج منخفض المخزون',
    body: 'زيت الزيتون البكر وصل إلى حد منخفض ويحتاج تحديث الكمية قبل اختفاء الظهور.',
    timeLabel: 'منذ 19 دقيقة',
    status: 'unread',
    icon: 'cube-outline',
  },
  {
    id: 'partner-notification-4',
    category: 'finance',
    title: 'تسوية مالية جاهزة للمراجعة',
    body: 'دفعة الأمس أصبحت جاهزة للمراجعة داخل الملخص المالي للشريك.',
    timeLabel: 'اليوم 09:20',
    status: 'read',
    icon: 'wallet-outline',
  },
  {
    id: 'partner-notification-5',
    category: 'operations',
    title: 'الفرع خارج ساعات العمل المجدولة',
    body: 'هناك عدم تطابق بين ساعات العمل الحالية وحالة الظهور ويحتاج فحصًا من الإعدادات.',
    timeLabel: 'اليوم 08:10',
    status: 'read',
    icon: 'time-outline',
  },
  {
    id: 'partner-notification-6',
    category: 'system',
    title: 'توثيق الهوية يحتاج مراجعة',
    body: 'ملف الهوية القانوني يحتاج مراجعة أخيرة قبل اكتمال صلاحيات المتجر.',
    timeLabel: 'أمس 07:45',
    status: 'read',
    icon: 'shield-checkmark-outline',
  },
  {
    id: 'partner-notification-7',
    category: 'operations',
    title: 'خطة تشغيل مختصرة لوردية المساء',
    body: 'تم تحديث توصية التشغيل لوردية المساء لتقليل وقت الاستجابة في الطلبات السريعة.',
    timeLabel: 'أمس 06:30',
    status: 'read',
    icon: 'sparkles-outline',
  },
];

function resolveStateCopy(state: Exclude<DshPartnerBellScreenState, 'ready'>): BellStateCopy {
  if (state === 'loading') {
    return {
      stateId: 'loading',
      title: 'جار تجهيز مركز الإشعارات',
      description: 'نعيد بناء تنبيهات الطلبات والتشغيل والمخزون والحساب داخل نفس المسار.',
      actionLabel: 'إعادة المحاولة',
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty',
      title: 'لا توجد إشعارات الآن',
      description: 'عندما يصل طلب جديد أو يظهر تنبيه تشغيلي أو مالي ستجده هنا مباشرة.',
      actionLabel: 'العودة',
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline',
      title: 'مركز الإشعارات غير متصل',
      description: 'أعد الاتصال لاسترجاع آخر التنبيهات بدون مغادرة مساحة الشريك.',
      actionLabel: 'إعادة المحاولة',
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning',
      title: 'الإشعارات متوقفة حاليًا',
      description: 'المسار ظاهر لكن التنبيهات معلقة مؤقتًا حتى تعود إعدادات الشريك للعمل.',
      actionLabel: 'العودة',
    };
  }

  return {
    stateId: 'recoverableError',
    title: 'تعذر تحميل الإشعارات',
    description: 'أعد المحاولة من نفس المسار للحفاظ على سياق الطلبات والتشغيل.',
    actionLabel: 'إعادة المحاولة',
  };
}

function resolveFilterLabel(filter: DshPartnerNotificationFilter) {
  if (filter === 'orders') {
    return 'الطلبات';
  }

  if (filter === 'operations') {
    return 'التشغيل';
  }

  if (filter === 'inventory') {
    return 'المخزون';
  }

  if (filter === 'finance') {
    return 'المالية';
  }

  if (filter === 'system') {
    return 'النظام';
  }

  return 'الكل';
}

function cloneNotificationItems(items: readonly DshPartnerNotificationItem[]) {
  return items.map((item) => ({ ...item }));
}

function NotificationRow({
  item,
  expanded,
  onToggle,
  onAction,
  onHide,
}: {
  item: DshPartnerNotificationItem;
  expanded: boolean;
  onToggle: (itemId: string) => void;
  onAction: (item: DshPartnerNotificationItem) => void;
  onHide: (itemId: string) => void;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const rowDirection = direction === 'rtl' ? 'row-reverse' : 'row';
  const textAlign = direction === 'rtl' ? 'right' : 'left';

  return (
    <Pressable onPress={() => onToggle(item.id)} style={({ pressed }) => [{ opacity: pressed ? 0.98 : 1 }]}>
      <Surface
        tone="raised"
        padding={3}
        gap={3}
        style={{
          borderWidth: 1,
          borderColor: item.status === 'unread' ? theme.brand : theme.line,
        }}
      >
        <View style={{ flexDirection: rowDirection, alignItems: 'flex-start', gap: 12 }}>
          <View style={{ flex: 1, flexDirection: rowDirection, alignItems: 'flex-start', gap: 12, minWidth: 0 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.surfaceInset,
                borderWidth: 1,
                borderColor: item.urgent ? theme.warning : item.status === 'unread' ? theme.brand : theme.line,
                flexShrink: 0,
              }}
            >
              <Icon name={item.icon} size={20} tone={item.urgent ? 'warning' : item.status === 'unread' ? 'brand' : 'info'} />
            </View>

            <View style={{ flex: 1, minWidth: 0, gap: 6, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
              <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Text role="bodyStrong" numberOfLines={expanded ? 2 : 1} style={{ textAlign }}>
                  {item.title}
                </Text>
                {item.urgent ? <Badge label="عاجل" tone="warning" /> : null}
              </View>

              <Text role="bodySm" tone="muted" numberOfLines={expanded ? 4 : 2} style={{ textAlign }}>
                {item.body}
              </Text>

              <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Badge label={resolveFilterLabel(item.category)} tone={item.category === 'finance' ? 'success' : item.category === 'inventory' ? 'info' : item.category === 'operations' ? 'brand' : 'warning'} />
                <Badge label={item.status === 'unread' ? 'غير مقروءة' : 'مقروءة'} tone={item.status === 'unread' ? 'warning' : 'success'} />
                <Text role="caption" tone="soft" style={{ textAlign }}>
                  {item.timeLabel}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {expanded ? (
          <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {item.actionLabel ? <Button label={item.actionLabel} tone="secondary" fullWidth={false} onPress={() => onAction(item)} /> : null}
            <Button label="إخفاء" tone="ghost" fullWidth={false} onPress={() => onHide(item.id)} />
          </View>
        ) : null}
      </Surface>
    </Pressable>
  );
}

export type DshPartnerBellScreenProps = {
  state?: DshPartnerBellScreenState;
  items?: readonly DshPartnerNotificationItem[];
  onOpenInbox?: () => void;
  onOpenNextOrder?: () => void;
  onRetry?: () => void;
  onBack?: () => void;
};

export function DshPartnerBellScreen({
  state = 'ready',
  items = defaultItems,
  onOpenInbox,
  onOpenNextOrder,
  onRetry,
  onBack,
}: DshPartnerBellScreenProps) {
  const { direction } = useDirection();
  const textAlign = direction === 'rtl' ? 'right' : 'left';
  const [activeFilter, setActiveFilter] = React.useState<DshPartnerNotificationFilter>('all');
  const [expandedNotificationId, setExpandedNotificationId] = React.useState<string | null>(null);
  const [screenItems, setScreenItems] = React.useState<DshPartnerNotificationItem[]>(() => cloneNotificationItems(items));

  React.useEffect(() => {
    setScreenItems(cloneNotificationItems(items));
  }, [items]);

  const visibleItems = React.useMemo(() => screenItems, [screenItems]);
  const filteredItems = React.useMemo(() => {
    if (activeFilter === 'all') {
      return visibleItems;
    }

    return visibleItems.filter((item) => item.category === activeFilter);
  }, [activeFilter, visibleItems]);

  const unreadCount = React.useMemo(() => visibleItems.filter((item) => item.status === 'unread').length, [visibleItems]);
  const urgentCount = React.useMemo(() => visibleItems.filter((item) => item.urgent).length, [visibleItems]);
  const operationalCount = React.useMemo(() => visibleItems.filter((item) => item.category === 'operations').length, [visibleItems]);
  const filters: readonly DshPartnerNotificationFilter[] = ['all', 'orders', 'operations', 'inventory', 'finance', 'system'];

  function markNotificationRead(itemId: string) {
    setScreenItems((current) => current.map((item) => (item.id === itemId ? { ...item, status: 'read' } : item)));
  }

  function handleToggleNotification(itemId: string) {
    markNotificationRead(itemId);
    setExpandedNotificationId((current) => (current === itemId ? null : itemId));
  }

  function handleHideNotification(itemId: string) {
    setScreenItems((current) => current.filter((item) => item.id !== itemId));
    setExpandedNotificationId((current) => (current === itemId ? null : current));
  }

  function handleOpenNotification(item: DshPartnerNotificationItem) {
    markNotificationRead(item.id);

    if (item.category === 'orders') {
      onOpenNextOrder?.();
      return;
    }

    setExpandedNotificationId(item.id);
  }

  function handleMarkAllRead() {
    setScreenItems((current) => current.map((item) => ({ ...item, status: 'read' })));
  }

  if (state !== 'ready') {
    const stateCopy = resolveStateCopy(state);

    return (
      <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 112 }}>
        <MobileWorkspaceHeader
          title="الإشعارات"
          description="تنبيهات الطلبات، التشغيل، المخزون، والحساب."
          icon="notifications-outline"
          onBack={onBack}
        />
        <StateView {...stateCopy} onActionPress={onRetry ?? onOpenInbox ?? onBack} />
      </MobileScrollView>
    );
  }

  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 112 }}>
      <MobileWorkspaceHeader
        title="الإشعارات"
        description="تنبيهات الطلبات، التشغيل، المخزون، والحساب."
        icon="notifications-outline"
        onBack={onBack}
      />

      <Surface tone="raised" padding={3} gap={3}>
        <Box gap={1} style={{ alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
          <Badge label={unreadCount > 0 ? `${unreadCount} غير مقروءة` : 'كلها مقروءة'} tone={unreadCount > 0 ? 'warning' : 'success'} />
          <Text role="bodySm" tone="muted" style={{ textAlign }}>
            المركز هنا موحّد: الطلبات، التشغيل، المخزون، المالية، والنظام في مسار واحد فقط.
          </Text>
        </Box>

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <StatCard label="غير مقروءة" value={String(unreadCount)} deltaLabel="تحتاج مراجعة" tone={unreadCount > 0 ? 'warning' : 'default'} />
          <StatCard label="عاجلة" value={String(urgentCount)} deltaLabel="أولوية فورية" tone={urgentCount > 0 ? 'warning' : 'default'} />
          <StatCard label="تشغيلية" value={String(operationalCount)} deltaLabel="مرتبطة بالوردية" tone={operationalCount > 0 ? 'brand' : 'default'} />
        </Box>

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label="تعليم الكل كمقروء" tone="secondary" fullWidth={false} disabled={unreadCount === 0} onPress={handleMarkAllRead} />
          {onOpenInbox ? <Button label="لوحة الطلبات" tone="ghost" fullWidth={false} onPress={onOpenInbox} /> : null}
        </Box>
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted">
          الفلاتر
        </Text>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {filters.map((filter) => (
            <Button
              key={filter}
              label={resolveFilterLabel(filter)}
              tone={filter === activeFilter ? 'secondary' : 'ghost'}
              fullWidth={false}
              onPress={() => setActiveFilter(filter)}
            />
          ))}
        </Box>
      </Surface>

      {visibleItems.length === 0 ? (
        <StateView
          stateId="empty"
          title="لا توجد إشعارات الآن"
          description="ستظهر هنا تنبيهات الطلبات والتشغيل والمخزون والحساب عندما تصل فعليًا إلى الشريك."
          actionLabel={onBack ? 'العودة' : undefined}
          onActionPress={onBack}
        />
      ) : filteredItems.length === 0 ? (
        <StateView
          stateId="empty"
          title="لا توجد إشعارات ضمن هذا الفلتر"
          description="جرّب عرض الكل أو اختر نوعًا آخر لتستعيد قائمة التنبيهات الحالية."
          actionLabel="عرض الكل"
          onActionPress={() => setActiveFilter('all')}
        />
      ) : (
        <Box gap={3}>
          {filteredItems.map((item) => (
            <NotificationRow
              key={item.id}
              item={item}
              expanded={expandedNotificationId === item.id}
              onToggle={handleToggleNotification}
              onAction={handleOpenNotification}
              onHide={handleHideNotification}
            />
          ))}
        </Box>
      )}
    </MobileScrollView>
  );
}

export default DshPartnerBellScreen;

