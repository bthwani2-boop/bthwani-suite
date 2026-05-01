import React from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Icon,
  MobileScrollView,
  SearchField,
  SearchTopBar,
  SheetFrame,
  StateView,
  Surface,
  Text,
  TopBar,
  resolveRowDirection,
  useDirection,
} from '@bthwani/ui-kit';

/*
type PartnerOrderStatus =
  | 'new'
  | 'needs_accept'
  | 'preparing'
  | 'ready'
  | 'handoff'
  | 'delivering'
  | 'completed'
  | 'cancelled';

type PartnerOrderPriority = 'high' | 'normal' | 'low';

type OrderHubAction = 'accept' | 'details' | 'prepare' | 'ready' | 'handoff' | 'issue' | 'delivering';

export type PartnerOrdersHomeScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled' | 'partial';

export type PartnerOrderItem = {
  id: string;
  orderCode: string;
  customerName: string;
  branchLabel: string;
  status: PartnerOrderStatus;
  priority: PartnerOrderPriority;
  orderTypeLabel: 'Delivery' | 'Pickup';
  itemsCountLabel: string;
  amountLabel: string;
  createdAtLabel: string;
  elapsedLabel: string;
  nextActionLabel: string;
};

export type PartnerOrdersHomeScreenProps = {
  state?: PartnerOrdersHomeScreenState;
  items?: readonly PartnerOrderItem[];
  branchLabel?: string;
  quickAlert?: string;
  searchMode?: boolean;
  onCloseSearch?: () => void;
  onOpenOrderAction?: (actionId: OrderHubAction, orderId: string) => void;
  onOpenEntryPress?: () => void;
  onOpenMaintenancePress?: () => void;
  onOpenInventoryManagementPress?: () => void;
  onRetry?: () => void;
};

type StatusFilter = 'all' | PartnerOrderStatus;

const statusFilters: ReadonlyArray<{ id: StatusFilter; label: string }> = [
  { id: 'all', label: 'الكل' },
  { id: 'new', label: 'جديدة' },
  { id: 'needs_accept', label: 'تحتاج قبول' },
  { id: 'preparing', label: 'قيد التحضير' },
  { id: 'ready', label: 'جاهزة للتسليم' },
  { id: 'handoff', label: 'بانتظار الاستلام' },
  { id: 'delivering', label: 'في الطريق' },
  { id: 'completed', label: 'مكتملة' },
  { id: 'cancelled', label: 'ملغاة/مشكلة' },
];

const demoOrders: readonly PartnerOrderItem[] = [
  {
    id: 'ord-4401',
    orderCode: '#4401',
    customerName: 'نوف العتيبي',
    branchLabel: 'فرع الياسمين',
    status: 'needs_accept',
    priority: 'high',
    orderTypeLabel: 'Delivery',
    itemsCountLabel: '3 عناصر',
    amountLabel: 'SAR 92',
    createdAtLabel: '10:42 ص',
    elapsedLabel: 'منذ 2 دقيقة',
    nextActionLabel: 'قبول الطلب',
  },
  {
    id: 'ord-4398',
    orderCode: '#4398',
    customerName: 'خالد الزهراني',
    branchLabel: 'فرع الياسمين',
    status: 'preparing',
    priority: 'normal',
    orderTypeLabel: 'Pickup',
    itemsCountLabel: '5 عناصر',
    amountLabel: 'SAR 124',
    createdAtLabel: '10:33 ص',
    elapsedLabel: 'منذ 11 دقيقة',
    nextActionLabel: 'بدء/متابعة التحضير',
  },
  {
    id: 'ord-4391',
    orderCode: '#4391',
    customerName: 'ريم الشهراني',
    branchLabel: 'فرع الياسمين',
    status: 'ready',
    priority: 'high',
    orderTypeLabel: 'Delivery',
    itemsCountLabel: '2 عناصر',
    amountLabel: 'SAR 76',
    createdAtLabel: '10:21 ص',
    elapsedLabel: 'منذ 20 دقيقة',
    nextActionLabel: 'تأكيد جاهزية',
  },
  {
    id: 'ord-4385',
    orderCode: '#4385',
    customerName: 'محمد السالم',
    branchLabel: 'فرع الياسمين',
    status: 'handoff',
    priority: 'normal',
    orderTypeLabel: 'Delivery',
    itemsCountLabel: '4 عناصر',
    amountLabel: 'SAR 118',
    createdAtLabel: '10:10 ص',
    elapsedLabel: 'منذ 31 دقيقة',
    nextActionLabel: 'تأكيد التسليم للكابتن',
  },
  {
    id: 'ord-4372',
    orderCode: '#4372',
    customerName: 'سارة القحطاني',
    branchLabel: 'فرع الياسمين',
    status: 'delivering',
    priority: 'normal',
    orderTypeLabel: 'Delivery',
    itemsCountLabel: '1 عنصر',
    amountLabel: 'SAR 41',
    createdAtLabel: '09:54 ص',
    elapsedLabel: 'منذ 47 دقيقة',
    nextActionLabel: 'متابعة المسار',
  },
  {
    id: 'ord-4368',
    orderCode: '#4368',
    customerName: 'عبدالله المطيري',
    branchLabel: 'فرع الياسمين',
    status: 'completed',
    priority: 'low',
    orderTypeLabel: 'Pickup',
    itemsCountLabel: '2 عناصر',
    amountLabel: 'SAR 59',
    createdAtLabel: '09:40 ص',
    elapsedLabel: 'قبل 61 دقيقة',
    nextActionLabel: 'عرض التفاصيل',
  },
  {
    id: 'ord-4359',
    orderCode: '#4359',
    customerName: 'أحمد الدوسري',
    branchLabel: 'فرع الياسمين',
    status: 'cancelled',
    priority: 'low',
    orderTypeLabel: 'Delivery',
    itemsCountLabel: '3 عناصر',
    amountLabel: 'SAR 87',
    createdAtLabel: '09:28 ص',
    elapsedLabel: 'قبل 73 دقيقة',
    nextActionLabel: 'مراجعة السبب',
  },
];

function resolveStatusLabel(status: PartnerOrderStatus) {
  if (status === 'new') return 'جديدة';
  if (status === 'needs_accept') return 'تحتاج قبول';
  if (status === 'preparing') return 'قيد التحضير';
  if (status === 'ready') return 'جاهزة للتسليم';
  if (status === 'handoff') return 'بانتظار الاستلام';
  if (status === 'delivering') return 'في الطريق';
  if (status === 'completed') return 'مكتملة';
  return 'ملغاة/مشكلة';
}

function resolvePriorityLabel(priority: PartnerOrderPriority) {
  if (priority === 'high') return 'أولوية عالية';
  if (priority === 'normal') return 'أولوية متوسطة';
  return 'أولوية منخفضة';
}

function resolvePriorityTone(priority: PartnerOrderPriority): 'danger' | 'brand' | 'soft' {
  if (priority === 'high') return 'danger';
  if (priority === 'normal') return 'brand';
  return 'soft';
}

function resolveOrderAction(status: PartnerOrderStatus): OrderHubAction {
  if (status === 'needs_accept' || status === 'new') return 'accept';
  if (status === 'preparing') return 'prepare';
  if (status === 'ready') return 'ready';
  if (status === 'handoff') return 'handoff';
  if (status === 'delivering') return 'delivering';
  if (status === 'cancelled') return 'issue';
  return 'details';
}

function renderState(state: Exclude<PartnerOrdersHomeScreenState, 'ready'>, onRetry?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" title="جاري تحميل مركز الطلبات" description="نجهز الآن لوحة التشغيل الرئيسية للشريك." />;
  }

  if (state === 'empty') {
    return <StateView stateId="empty" title="لا توجد طلبات حالية" description="سيظهر أول طلب جديد هنا فور استقباله." actionLabel={onRetry ? 'تحديث' : undefined} onActionPress={onRetry} />;
  }

  if (state === 'offline') {
    return <StateView stateId="offline" title="انقطاع اتصال" description="تأكد من الاتصال ثم أعد تحميل لوحة الطلبات." actionLabel={onRetry ? 'إعادة المحاولة' : undefined} onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return <StateView kind="warning" title="لوحة الطلبات متوقفة مؤقتًا" description="تم تعطيل الوصول لحين إكمال التحقق التشغيلي." actionLabel={onRetry ? 'تحقق الآن' : undefined} onActionPress={onRetry} />;
  }

  if (state === 'partial') {
    return <StateView kind="warning" title="توفر جزئي" description="بعض البيانات متاحة الآن، ويمكن متابعة التشغيل مع الحذر." actionLabel={onRetry ? 'إعادة المزامنة' : undefined} onActionPress={onRetry} />;
  }

  return <StateView stateId="recoverableError" title="تعذر فتح مركز الطلبات" description="حدث خلل مؤقت. أعد المحاولة دون فقدان سياق التشغيل." actionLabel={onRetry ? 'إعادة المحاولة' : undefined} onActionPress={onRetry} />;
}

export function DshPartnerOrdersScreen(props: PartnerOrdersHomeScreenProps) {
  const {
    state = 'ready',
    items = demoOrders,
    branchLabel = 'الرياض، فرع الياسمين',
    quickAlert = 'توجد طلبات بحاجة إجراء فوري خلال الدقائق القادمة.',
    searchMode = false,
    onCloseSearch,
    onOpenOrderAction,
    onOpenMaintenancePress,
    onOpenInventoryManagementPress,
    onRetry,
  } = props;
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');
  const [query, setQuery] = React.useState('');
  const { theme } = useTheme();

  if (state !== 'ready') {
    return renderState(state, onRetry);
  }

  const normalizedQuery = query.trim().toLowerCase();

  const filteredItems = items.filter((item) => {
    const statusMatch = statusFilter === 'all' ? true : item.status === statusFilter;
    const textMatch =
      normalizedQuery.length === 0
        ? true
        : [item.orderCode, item.customerName, item.branchLabel, resolveStatusLabel(item.status)]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery);
    return statusMatch && textMatch;
  });

  const byStatus = {
    new: items.filter((item) => item.status === 'new').length,
    needsAccept: items.filter((item) => item.status === 'needs_accept').length,
    preparing: items.filter((item) => item.status === 'preparing').length,
    ready: items.filter((item) => item.status === 'ready').length,
    handoff: items.filter((item) => item.status === 'handoff').length,
    delivering: items.filter((item) => item.status === 'delivering').length,
    completed: items.filter((item) => item.status === 'completed').length,
    cancelled: items.filter((item) => item.status === 'cancelled').length,
  };

  const activeOrdersCount = byStatus.new + byStatus.needsAccept + byStatus.preparing + byStatus.ready + byStatus.handoff + byStatus.delivering;
  const urgentOrdersCount = items.filter((item) => item.priority === 'high').length;
  const pendingActionsCount = byStatus.needsAccept + byStatus.preparing + byStatus.ready + byStatus.handoff;

  return (
    <MobileScrollView padding={4} gap={4}>
      <Surface tone="brand" gap={3} style={{ borderColor: theme.accentBlue, borderWidth: 1 }}>
        <Box gap={1}>
          <Text role="titleLg" tone="inverse">مركز طلبات الشريك</Text>
          <Text role="bodySm" tone="inverse" style={{ opacity: 0.96 }}>{branchLabel}</Text>
          <Text role="caption" tone="inverse" style={{ opacity: 0.92 }}>{quickAlert}</Text>
        </Box>

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Surface tone="raised" style={{ flex: 1, minWidth: 132, borderWidth: 1, borderColor: theme.brand }}>
            <Text role="caption" tone="muted">طلبات نشطة</Text>
            <Text role="titleMd" style={{ color: theme.accentBlue }}>{String(activeOrdersCount)}</Text>
          </Surface>
          <Surface tone="raised" style={{ flex: 1, minWidth: 132, borderWidth: 1, borderColor: theme.brand }}>
            <Text role="caption" tone="muted">طلبات عاجلة</Text>
            <Text role="titleMd" style={{ color: theme.accentBlue }}>{String(urgentOrdersCount)}</Text>
          </Surface>
          <Surface tone="raised" style={{ flex: 1, minWidth: 132, borderWidth: 1, borderColor: theme.brand }}>
            <Text role="caption" tone="muted">إجراءات معلقة</Text>
            <Text role="titleMd" style={{ color: theme.accentBlue }}>{String(pendingActionsCount)}</Text>
          </Surface>
        </Box>
      </Surface>

      <Surface tone="raised" gap={3} style={{ borderColor: theme.accentBlue, borderWidth: 1 }}>
        <SectionHeader title="اختصارات الطلبات" subtitle="مدخلات تشغيلية مرتبطة بمسار الطلبات فقط." />
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label="مدخل التشغيل" onPress={props.onOpenEntryPress} />
          <Button label="صيانة الفرع" tone="secondary" onPress={onOpenMaintenancePress} />
          <Button label="إدارة المنتجات" tone="secondary" onPress={onOpenInventoryManagementPress} />
        </Box>
      </Surface>

      {searchMode ? (
        <SearchTopBar
          value={query}
          onChangeText={setQuery}
          onClose={onCloseSearch}
          placeholder="ابحث برقم الطلب أو اسم العميل أو الفرع"
          hint="أغلق البحث للعودة إلى بقية أدوات التصفية."
          autoFocus
        />
      ) : null}

      <Surface tone="raised" gap={3}>
        <SectionHeader
          title={searchMode ? 'فلاتر البحث' : 'تصفية الطلبات'}
          subtitle={searchMode ? 'ضيّق النتائج بالحالة من دون مغادرة البحث.' : 'فلترة ذكية بالحالة + بحث سريع.'}
        />
        {searchMode ? (
          <Text role="caption" tone="muted">
            البحث نشط الآن داخل مركز الطلبات ويمكنك استخدام الفلاتر لتقليل النتائج بسرعة.
          </Text>
        ) : (
          <TextField
            label="بحث"
            placeholder="رقم الطلب / العميل / الفرع"
            value={query}
            onChangeText={setQuery}
          />
        )}
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {statusFilters.map((filter) => (
            <Button
              key={filter.id}
              label={filter.label}
              fullWidth={false}
              tone={statusFilter === filter.id ? 'primary' : 'secondary'}
              style={{ minWidth: 112 }}
              onPress={() => setStatusFilter(filter.id)}
            />
          ))}
        </Box>
      </Surface>

      <Surface tone="default" gap={2}>
        <SectionHeader title="دورة الطلبات" subtitle="قبول → تحضير → جاهز → تسليم → مكتمل" />
        <Text role="caption" tone="muted">جديدة: {byStatus.new} | تحتاج قبول: {byStatus.needsAccept} | تحضير: {byStatus.preparing}</Text>
        <Text role="caption" tone="muted">جاهزة: {byStatus.ready} | handoff: {byStatus.handoff} | في الطريق: {byStatus.delivering}</Text>
        <Text role="caption" tone="muted">مكتملة: {byStatus.completed} | ملغاة/مشكلة: {byStatus.cancelled}</Text>
      </Surface>

      {filteredItems.length === 0 ? (
        <StateView
          stateId="empty"
          title="لا توجد طلبات بهذه الحالة"
          description="غيّر الفلتر أو البحث لاستعراض طلبات أخرى."
          actionLabel="إعادة الضبط"
          onActionPress={() => {
            setStatusFilter('all');
            setQuery('');
          }}
        />
      ) : (
        <Box gap={3}>
          {filteredItems.map((item) => {
            const nextAction = resolveOrderAction(item.status);
            return (
              <Card
                key={item.id}
                title={`${item.orderCode} - ${item.customerName}`}
                subtitle={`${resolveStatusLabel(item.status)} | ${item.orderTypeLabel} | ${item.branchLabel}`}
                footer={
                  <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                    <Button
                      label={item.nextActionLabel}
                      onPress={() => onOpenOrderAction?.(nextAction, item.id)}
                    />
                    <Button
                      label="عرض التفاصيل"
                      tone="secondary"
                      onPress={() => onOpenOrderAction?.('details', item.id)}
                    />
                  </Box>
                }
              >
                <Box gap={1}>
                  <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                    <Text role="caption" tone="muted">{item.createdAtLabel}</Text>
                    <Text role="caption" tone="muted">{item.elapsedLabel}</Text>
                    <Text role="caption" tone="muted">{item.itemsCountLabel}</Text>
                    <Text role="caption" tone="muted">{item.amountLabel}</Text>
                  </Box>
                  <Text role="caption" tone={resolvePriorityTone(item.priority)}>
                    {resolvePriorityLabel(item.priority)}
                  </Text>
                </Box>
              </Card>
            );
          })}
        </Box>
      )}

    </MobileScrollView>
  );
}

export { DshPartnerOrdersScreen as PartnerOrdersHomeScreen };

export default DshPartnerOrdersScreen;

export type PartnerOrdersInboxScreenState = PartnerOrdersHomeScreenState;
export type PartnerOrdersInboxListItem = PartnerOrderItem;
export type PartnerOrdersInboxScreenProps = {
  state?: PartnerOrdersInboxScreenState;
  items?: readonly PartnerOrdersInboxListItem[];
  searchMode?: boolean;
  onCloseSearch?: () => void;
  onOpenOrder?: (orderId: string) => void;
  onOpenNextOrder?: (orderId: string) => void;
  onRetry?: () => void;
};

export function PartnerOrdersInboxScreen({ state = 'ready', items, searchMode, onCloseSearch, onOpenOrder, onOpenNextOrder, onRetry }: PartnerOrdersInboxScreenProps) {
  return (
    <DshPartnerOrdersScreen
      state={state}
      items={items}
      searchMode={searchMode}
      onCloseSearch={onCloseSearch}
      onOpenOrderAction={(actionId, orderId) => {
        if (actionId === 'details') {
          onOpenOrder?.(orderId);
          return;
        }
        onOpenNextOrder?.(orderId);
      }}
      onRetry={onRetry}
    />
  );
}

export type PartnerOrderDetailScreenState = PartnerOrdersHomeScreenState;
export type PartnerOrderDetailSummary = {
  orderId: string;
  merchantName: string;
  customerName: string;
  serviceWindowLabel: string;
  nextActionLabel: string;
  readinessNote: string;
};
export type PartnerOrderDetailScreenProps = {
  state?: PartnerOrderDetailScreenState;
  summary?: PartnerOrderDetailSummary;
  disableReason?: string;
  onConfirmReady?: (orderId: string) => void;
  onOpenNextOrder?: () => void;
  onBackToInbox?: () => void;
  onRetry?: () => void;
};

export function PartnerOrderDetailScreen({ state = 'ready', summary, onConfirmReady, onRetry }: PartnerOrderDetailScreenProps) {
  const fallbackOrderId = summary?.orderId ?? 'ord-detail';
  return (
    <DshPartnerOrdersScreen
      state={state}
      items={summary ? [{
        id: fallbackOrderId,
        orderCode: summary.orderId,
        customerName: summary.customerName,
        branchLabel: summary.merchantName,
        status: 'ready',
        priority: 'normal',
        orderTypeLabel: 'Delivery',
        itemsCountLabel: '1 عنصر',
        amountLabel: 'SAR --',
        createdAtLabel: summary.serviceWindowLabel,
        elapsedLabel: summary.readinessNote,
        nextActionLabel: summary.nextActionLabel,
      }] : undefined}
      onOpenOrderAction={(actionId, orderId) => {
        if (actionId === 'ready' || actionId === 'handoff' || actionId === 'details') {
          onConfirmReady?.(orderId);
        }
      }}
      onRetry={onRetry}
    />
  );
}
*/

type PartnerOrderStatus =
  | 'new'
  | 'needs_accept'
  | 'preparing'
  | 'ready'
  | 'handoff'
  | 'delivering'
  | 'completed'
  | 'cancelled';

type PartnerOrderPriority = 'high' | 'normal' | 'low';

type OrderHubAction = 'accept' | 'details' | 'prepare' | 'ready' | 'handoff' | 'issue' | 'delivering';

export type PartnerOrdersHomeScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled' | 'partial';

export type PartnerOrderItem = {
  id: string;
  orderCode: string;
  customerName: string;
  branchLabel: string;
  status: PartnerOrderStatus;
  priority: PartnerOrderPriority;
  orderTypeLabel: 'توصيل' | 'استلام';
  itemsCountLabel: string;
  amountLabel: string;
  createdAtLabel: string;
  elapsedLabel: string;
  nextActionLabel: string;
};

export type PartnerOrdersHomeScreenProps = {
  state?: PartnerOrdersHomeScreenState;
  items?: readonly PartnerOrderItem[];
  branchLabel?: string;
  quickAlert?: string;
  searchMode?: boolean;
  onCloseSearch?: () => void;
  onOpenOrderAction?: (actionId: OrderHubAction, orderId: string) => void;
  onOpenEntryPress?: () => void;
  onOpenMaintenancePress?: () => void;
  onOpenInventoryManagementPress?: () => void;
  onRetry?: () => void;
};

type StatusFilter = 'all' | PartnerOrderStatus;

type MetricTileProps = {
  label: string;
  value: string;
  hint: string;
};

type OrderFactRowProps = {
  label: string;
  value: string;
};

const statusFilters: ReadonlyArray<{ id: StatusFilter; label: string; tone: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' }> = [
  { id: 'all', label: 'الكل', tone: 'brand' },
  { id: 'new', label: 'جديدة', tone: 'info' },
  { id: 'needs_accept', label: 'تحتاج قبول', tone: 'warning' },
  { id: 'preparing', label: 'قيد التحضير', tone: 'info' },
  { id: 'ready', label: 'جاهزة', tone: 'success' },
  { id: 'handoff', label: 'بانتظار الاستلام', tone: 'brand' },
  { id: 'delivering', label: 'في الطريق', tone: 'info' },
  { id: 'completed', label: 'مكتملة', tone: 'success' },
  { id: 'cancelled', label: 'ملغاة', tone: 'danger' },
];

const demoOrders: readonly PartnerOrderItem[] = [
  {
    id: 'ord-4401',
    orderCode: '#4401',
    customerName: 'نوف العتيبي',
    branchLabel: 'فرع الياسمين',
    status: 'needs_accept',
    priority: 'high',
    orderTypeLabel: 'توصيل',
    itemsCountLabel: '3 عناصر',
    amountLabel: '92 ر.س',
    createdAtLabel: '10:42 ص',
    elapsedLabel: 'منذ دقيقتين',
    nextActionLabel: 'قبول الطلب',
  },
  {
    id: 'ord-4398',
    orderCode: '#4398',
    customerName: 'خالد الزهراني',
    branchLabel: 'فرع الياسمين',
    status: 'preparing',
    priority: 'normal',
    orderTypeLabel: 'استلام',
    itemsCountLabel: '5 عناصر',
    amountLabel: '124 ر.س',
    createdAtLabel: '10:33 ص',
    elapsedLabel: 'منذ 11 دقيقة',
    nextActionLabel: 'متابعة التحضير',
  },
  {
    id: 'ord-4391',
    orderCode: '#4391',
    customerName: 'ريم الشهراني',
    branchLabel: 'فرع الياسمين',
    status: 'ready',
    priority: 'high',
    orderTypeLabel: 'توصيل',
    itemsCountLabel: '2 عنصر',
    amountLabel: '76 ر.س',
    createdAtLabel: '10:21 ص',
    elapsedLabel: 'منذ 20 دقيقة',
    nextActionLabel: 'تأكيد الجاهزية',
  },
  {
    id: 'ord-4385',
    orderCode: '#4385',
    customerName: 'محمد السالم',
    branchLabel: 'فرع الياسمين',
    status: 'handoff',
    priority: 'normal',
    orderTypeLabel: 'توصيل',
    itemsCountLabel: '4 عناصر',
    amountLabel: '118 ر.س',
    createdAtLabel: '10:10 ص',
    elapsedLabel: 'منذ 31 دقيقة',
    nextActionLabel: 'تسليم للكابتن',
  },
  {
    id: 'ord-4372',
    orderCode: '#4372',
    customerName: 'سارة القحطاني',
    branchLabel: 'فرع الياسمين',
    status: 'delivering',
    priority: 'normal',
    orderTypeLabel: 'توصيل',
    itemsCountLabel: '1 عنصر',
    amountLabel: '41 ر.س',
    createdAtLabel: '09:54 ص',
    elapsedLabel: 'منذ 47 دقيقة',
    nextActionLabel: 'متابعة التسليم',
  },
  {
    id: 'ord-4368',
    orderCode: '#4368',
    customerName: 'عبدالله المطيري',
    branchLabel: 'فرع الياسمين',
    status: 'completed',
    priority: 'low',
    orderTypeLabel: 'استلام',
    itemsCountLabel: '2 عنصر',
    amountLabel: '59 ر.س',
    createdAtLabel: '09:40 ص',
    elapsedLabel: 'قبل 61 دقيقة',
    nextActionLabel: 'مراجعة السجل',
  },
  {
    id: 'ord-4359',
    orderCode: '#4359',
    customerName: 'أحمد الدوسري',
    branchLabel: 'فرع الياسمين',
    status: 'cancelled',
    priority: 'low',
    orderTypeLabel: 'توصيل',
    itemsCountLabel: '3 عناصر',
    amountLabel: '87 ر.س',
    createdAtLabel: '09:28 ص',
    elapsedLabel: 'قبل 73 دقيقة',
    nextActionLabel: 'مراجعة المشكلة',
  },
];

function resolveStatusLabel(status: PartnerOrderStatus) {
  switch (status) {
    case 'new':
      return 'جديدة';
    case 'needs_accept':
      return 'تحتاج قبول';
    case 'preparing':
      return 'قيد التحضير';
    case 'ready':
      return 'جاهزة';
    case 'handoff':
      return 'بانتظار الاستلام';
    case 'delivering':
      return 'في الطريق';
    case 'completed':
      return 'مكتملة';
    default:
      return 'ملغاة';
  }
}

function resolveStatusTone(status: PartnerOrderStatus): 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'needs_accept':
      return 'warning';
    case 'preparing':
      return 'info';
    case 'ready':
    case 'completed':
      return 'success';
    case 'handoff':
      return 'brand';
    case 'delivering':
      return 'info';
    case 'cancelled':
      return 'danger';
    default:
      return 'default';
  }
}

function resolvePriorityLabel(priority: PartnerOrderPriority) {
  switch (priority) {
    case 'high':
      return 'أولوية عالية';
    case 'normal':
      return 'أولوية متوسطة';
    default:
      return 'أولوية منخفضة';
  }
}

function resolvePriorityTone(priority: PartnerOrderPriority): 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' {
  switch (priority) {
    case 'high':
      return 'danger';
    case 'normal':
      return 'brand';
    default:
      return 'default';
  }
}

function resolveOrderAction(status: PartnerOrderStatus): OrderHubAction {
  switch (status) {
    case 'new':
    case 'needs_accept':
      return 'accept';
    case 'preparing':
      return 'prepare';
    case 'ready':
      return 'ready';
    case 'handoff':
      return 'handoff';
    case 'delivering':
      return 'delivering';
    case 'cancelled':
      return 'issue';
    default:
      return 'details';
  }
}

function renderState(state: Exclude<PartnerOrdersHomeScreenState, 'ready'>, onRetry?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" title="جارٍ تجهيز طابور الطلبات" description="نرتب أحدث الطلبات الجاهزة للمعالجة الآن." />;
  }

  if (state === 'empty') {
    return <StateView stateId="empty" title="لا توجد طلبات الآن" description="ستظهر الطلبات الجديدة هنا فور وصولها." actionLabel={onRetry ? 'تحديث' : undefined} onActionPress={onRetry} />;
  }

  if (state === 'offline') {
    return <StateView stateId="offline" title="الاتصال غير متاح" description="تحقق من الشبكة ثم أعد فتح الطابور." actionLabel={onRetry ? 'إعادة المحاولة' : undefined} onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return <StateView kind="warning" title="طابور الطلبات متوقف مؤقتًا" description="الوصول متوقف حتى يكتمل التحقق التشغيلي." actionLabel={onRetry ? 'تحقق الآن' : undefined} onActionPress={onRetry} />;
  }

  if (state === 'partial') {
    return <StateView kind="warning" title="توفر جزئي" description="بعض البيانات متاحة الآن مع متابعة المزامنة." actionLabel={onRetry ? 'إعادة المزامنة' : undefined} onActionPress={onRetry} />;
  }

  return <StateView stateId="recoverableError" title="تعذر فتح طابور الطلبات" description="حدث خلل مؤقت. أعد المحاولة من دون فقدان السياق." actionLabel={onRetry ? 'إعادة المحاولة' : undefined} onActionPress={onRetry} />;
}

function MetricTile({ label, value, hint }: MetricTileProps) {
  return (
    <Surface tone="inset" padding={3} gap={1} style={{ flex: 1, minWidth: 92 }}>
      <Text role="caption" tone="muted">
        {label}
      </Text>
      <Text role="titleMd">{value}</Text>
      <Text role="caption" tone="muted">
        {hint}
      </Text>
    </Surface>
  );
}

function OrderFactRow({ label, value }: OrderFactRowProps) {
  return (
    <Box gap={1} style={{ flex: 1, minWidth: 128 }}>
      <Text role="caption" tone="muted">
        {label}
      </Text>
      <Text role="bodyMd">{value}</Text>
    </Box>
  );
}

export function PartnerOrdersHomeScreen(props: PartnerOrdersHomeScreenProps) {
  const {
    state = 'ready',
    items = demoOrders,
    branchLabel = 'الرياض، فرع الياسمين',
    quickAlert = 'هناك طلبان يحتاجان إجراء سريع خلال الدقائق القادمة.',
    searchMode = false,
    onCloseSearch,
    onOpenOrderAction,
    onRetry,
  } = props;
  const { direction } = useDirection();
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');
  const [query, setQuery] = React.useState('');
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);
  const [detailsVisible, setDetailsVisible] = React.useState(false);

  if (state !== 'ready') {
    return renderState(state, onRetry);
  }

  const normalizedQuery = query.trim().toLowerCase();

  const summary = React.useMemo(() => {
    const activeOrdersCount = items.filter((item) => item.status !== 'completed' && item.status !== 'cancelled').length;
    const urgentOrdersCount = items.filter((item) => item.priority === 'high').length;
    const pendingActionsCount = items.filter(
      (item) =>
        item.status === 'new' ||
        item.status === 'needs_accept' ||
        item.status === 'preparing' ||
        item.status === 'ready' ||
        item.status === 'handoff',
    ).length;

    return {
      activeOrdersCount,
      urgentOrdersCount,
      pendingActionsCount,
    };
  }, [items]);

  const filteredItems = React.useMemo(
    () =>
      items.filter((item) => {
        const statusMatch = statusFilter === 'all' ? true : item.status === statusFilter;
        const textMatch =
          normalizedQuery.length === 0
            ? true
            : [item.orderCode, item.customerName, item.branchLabel, resolveStatusLabel(item.status), item.orderTypeLabel]
                .join(' ')
                .toLowerCase()
                .includes(normalizedQuery);

        return statusMatch && textMatch;
      }),
    [items, normalizedQuery, statusFilter],
  );

  const selectedOrder = React.useMemo(
    () => items.find((item) => item.id === selectedOrderId) ?? null,
    [items, selectedOrderId],
  );

  const openQuickView = React.useCallback((orderId: string) => {
    setSelectedOrderId(orderId);
    setDetailsVisible(true);
  }, []);

  const closeQuickView = React.useCallback(() => {
    setDetailsVisible(false);
  }, []);

  const openDetailRoute = React.useCallback(
    (orderId: string) => {
      setDetailsVisible(false);
      onOpenOrderAction?.('details', orderId);
    },
    [onOpenOrderAction],
  );

  const openPrimaryAction = React.useCallback(
    (item: PartnerOrderItem) => {
      onOpenOrderAction?.(resolveOrderAction(item.status), item.id);
    },
    [onOpenOrderAction],
  );

  return (
    <>
      <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 112 }}>
        <Surface tone="raised" padding={3} gap={3}>
          <Box gap={1}>
            <Text role="label" tone="muted">
              ملخص سريع
            </Text>
            <Text role="bodySm" tone="muted">
              {quickAlert}
            </Text>
          </Box>

          <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
            <Chip label={`${summary.activeOrdersCount} نشطة`} tone="brand" selected />
            <Chip label={`${summary.urgentOrdersCount} عاجلة`} tone="warning" />
            <Chip label={`${summary.pendingActionsCount} تحتاج إجراء`} tone="info" />
          </Box>
        </Surface>

        <Surface tone="raised" padding={4} gap={3}>
          <Box gap={1}>
            <Text role="label">مؤشرات سريعة</Text>
            <Text role="bodySm" tone="muted">
              نظرة قصيرة قبل الدخول إلى الطابور الحالي.
            </Text>
          </Box>

          <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
            <MetricTile label="نشطة" value={String(summary.activeOrdersCount)} hint="في الطابور الآن" />
            <MetricTile label="عاجلة" value={String(summary.urgentOrdersCount)} hint="تحتاج انتباهًا" />
            <MetricTile label="إجراء" value={String(summary.pendingActionsCount)} hint="على الفريق الآن" />
          </Box>
        </Surface>

        <Surface tone="raised" padding={4} gap={3}>
          <Box gap={1}>
            <Text role="label">بحث وتصفية</Text>
            <Text role="bodySm" tone="muted">
              ابحث ثم اختر الحالة من دون مغادرة الصفحة.
            </Text>
          </Box>

          {searchMode ? (
            <SearchTopBar
              variant="surface"
              value={query}
              onChangeText={setQuery}
              onClose={() => onCloseSearch?.()}
              placeholder="رقم الطلب أو اسم العميل أو الفرع"
              hint="أغلق البحث للعودة إلى بقية الفلاتر."
              autoFocus
            />
          ) : (
            <SearchField
              label="بحث الطلبات"
              value={query}
              onChangeText={setQuery}
              placeholder="رقم الطلب أو اسم العميل أو الفرع"
              hint="الكتابة تضيق الطابور مباشرة."
            />
          )}

          <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
            {statusFilters.map((filter) => (
              <Chip
                key={filter.id}
                label={filter.label}
                selected={statusFilter === filter.id}
                tone={filter.tone}
                onPress={() => setStatusFilter(filter.id)}
              />
            ))}
          </Box>
        </Surface>

        <Surface tone="default" padding={4} gap={3}>
          <Box gap={1}>
            <Text role="label">الطابور الحالي</Text>
            <Text role="bodySm" tone="muted">
              {filteredItems.length === 0 ? 'لا توجد نتائج مطابقة الآن.' : `تظهر ${filteredItems.length} طلبات حسب الفلتر الحالي.`}
            </Text>
          </Box>

          {filteredItems.length === 0 ? (
            <StateView
              stateId="empty"
              title="لا توجد طلبات بهذه الحالة"
              description="جرّب تغيير الحالة أو إعادة ضبط البحث لرؤية طلبات أخرى."
              actionLabel="إعادة الضبط"
              onActionPress={() => {
                setStatusFilter('all');
                setQuery('');
              }}
            />
          ) : (
            <Box gap={3}>
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  title={`${item.orderCode} · ${item.customerName}`}
                  subtitle={`${item.branchLabel} · ${resolveStatusLabel(item.status)} · ${item.orderTypeLabel}`}
                  padding={4}
                  gap={3}
                  footer={
                    <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
                      <Button label={item.nextActionLabel} size="sm" fullWidth={false} onPress={() => openPrimaryAction(item)} />
                      <Button label="عرض التفاصيل" size="sm" tone="secondary" fullWidth={false} onPress={() => openDetailRoute(item.id)} />
                      <Chip label="معاينة سريعة" tone="info" onPress={() => openQuickView(item.id)} />
                    </Box>
                  }
                >
                  <Box gap={2}>
                    <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
                      <Chip label={resolvePriorityLabel(item.priority)} tone={resolvePriorityTone(item.priority)} selected />
                      <Chip label={item.orderTypeLabel} tone="brand" />
                      <Chip label={item.itemsCountLabel} />
                      <Chip label={item.amountLabel} tone="success" />
                    </Box>

                    <Box gap={1}>
                      <Text role="bodySm" tone="muted">
                        {item.createdAtLabel} · {item.elapsedLabel}
                      </Text>
                      <Text role="caption" tone={resolveStatusTone(item.status) === 'danger' ? 'danger' : 'muted'}>
                        الإجراء التالي: {item.nextActionLabel}
                      </Text>
                    </Box>

                    {item.status === 'cancelled' ? (
                      <Surface tone="inset" padding={3} gap={1}>
                        <Text role="caption" tone="warning">
                          الطلب يحتاج مراجعة السبب قبل أي متابعة.
                        </Text>
                      </Surface>
                    ) : null}
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </Surface>
      </MobileScrollView>

      <SheetFrame visible={detailsVisible} title={selectedOrder ? `معاينة ${selectedOrder.orderCode}` : 'معاينة الطلب'} onClose={closeQuickView}>
        {selectedOrder ? (
          <Box gap={3}>
            <Box gap={1}>
              <Text role="titleSm">{selectedOrder.customerName}</Text>
              <Text role="bodySm" tone="muted">
                {selectedOrder.branchLabel}
              </Text>
            </Box>

            <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
              <Chip label={resolveStatusLabel(selectedOrder.status)} tone={resolveStatusTone(selectedOrder.status)} selected />
              <Chip label={selectedOrder.orderTypeLabel} tone="brand" />
              <Chip label={selectedOrder.amountLabel} tone="success" />
            </Box>

            <Surface tone="inset" padding={3} gap={2}>
              <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
                <OrderFactRow label="رقم الطلب" value={selectedOrder.orderCode} />
                <OrderFactRow label="العناصر" value={selectedOrder.itemsCountLabel} />
                <OrderFactRow label="الوقت" value={selectedOrder.createdAtLabel} />
                <OrderFactRow label="المدة" value={selectedOrder.elapsedLabel} />
              </Box>
              <OrderFactRow label="الإجراء التالي" value={selectedOrder.nextActionLabel} />
            </Surface>

            <Text role="bodySm" tone="muted">
              هذه المعاينة السريعة تمنحك قرارًا أسرع قبل فتح المسار الكامل أو العودة للطابور.
            </Text>

            <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
              <Button
                label="تنفيذ الإجراء"
                size="sm"
                fullWidth={false}
                onPress={() => {
                  setDetailsVisible(false);
                  onOpenOrderAction?.(resolveOrderAction(selectedOrder.status), selectedOrder.id);
                }}
              />
              <Button label="عرض التفاصيل" size="sm" tone="secondary" fullWidth={false} onPress={() => openDetailRoute(selectedOrder.id)} />
              <Button label="إغلاق" size="sm" tone="ghost" fullWidth={false} onPress={closeQuickView} />
            </Box>
          </Box>
        ) : (
          <StateView
            stateId="empty"
            title="لا توجد معاينة متاحة"
            description="اختر طلبًا من الطابور لفتح المعاينة السريعة."
            actionLabel="إغلاق"
            onActionPress={closeQuickView}
          />
        )}
      </SheetFrame>
    </>
  );
}

export default PartnerOrdersHomeScreen;

export type PartnerOrdersInboxScreenState = PartnerOrdersHomeScreenState;
export type PartnerOrdersInboxListItem = PartnerOrderItem;
export type PartnerOrdersInboxScreenProps = {
  state?: PartnerOrdersInboxScreenState;
  items?: readonly PartnerOrdersInboxListItem[];
  searchMode?: boolean;
  onCloseSearch?: () => void;
  onOpenOrder?: (orderId: string) => void;
  onOpenNextOrder?: (orderId: string) => void;
  onRetry?: () => void;
};

export function PartnerOrdersInboxScreen({ state = 'ready', items, searchMode, onCloseSearch, onOpenOrder, onOpenNextOrder, onRetry }: PartnerOrdersInboxScreenProps) {
  return (
    <PartnerOrdersHomeScreen
      state={state}
      items={items}
      searchMode={searchMode}
      onCloseSearch={onCloseSearch}
      onOpenOrderAction={(actionId, orderId) => {
        if (actionId === 'details') {
          onOpenOrder?.(orderId);
          return;
        }
        onOpenNextOrder?.(orderId);
      }}
      onRetry={onRetry}
    />
  );
}

export type PartnerOrderDetailScreenState = PartnerOrdersHomeScreenState;
export type PartnerOrderDetailSummary = {
  orderId: string;
  merchantName: string;
  customerName: string;
  serviceWindowLabel: string;
  nextActionLabel: string;
  readinessNote: string;
};
export type PartnerOrderDetailScreenProps = {
  state?: PartnerOrderDetailScreenState;
  summary?: PartnerOrderDetailSummary;
  disableReason?: string;
  onConfirmReady?: (orderId: string) => void;
  onOpenNextOrder?: () => void;
  onBackToInbox?: () => void;
  onRetry?: () => void;
};

export function PartnerOrderDetailScreen({ state = 'ready', summary, disableReason, onConfirmReady, onOpenNextOrder, onBackToInbox, onRetry }: PartnerOrderDetailScreenProps) {
  const { direction } = useDirection();

  if (state !== 'ready') {
    return renderState(state, onRetry);
  }

  if (!summary) {
    return (
      <StateView
        stateId="empty"
        title="لا توجد تفاصيل للعرض"
        description="ارجع إلى الطابور لاختيار طلب آخر."
        actionLabel={onBackToInbox ? 'العودة إلى الطابور' : undefined}
        onActionPress={onBackToInbox}
      />
    );
  }

  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 112 }}>
      <TopBar
        variant="secondary"
        title="تفاصيل الطلب"
        subtitle={`${summary.customerName} · ${summary.merchantName}`}
        style={{ marginHorizontal: -16, marginTop: -16 }}
        trailingAction={onBackToInbox ? {
          id: 'back',
          icon: <Icon name="arrow-back" size={24} tone="brand" />,
          mirrorInRtl: true,
          accessibilityLabel: 'رجوع',
          onPress: onBackToInbox,
        } : undefined}
      />

      <Card title="الملخص التشغيلي" subtitle={summary.readinessNote} padding={4} gap={3}>
        <Box gap={3}>
          <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
            <Chip label={`العميل: ${summary.customerName}`} tone="info" />
            <Chip label={summary.nextActionLabel} tone="brand" />
            <Chip label={summary.serviceWindowLabel} tone="success" />
          </Box>

          {disableReason ? (
            <Surface tone="inset" padding={3} gap={1}>
              <Text role="caption" tone="warning">
                سبب التوقف: {disableReason}
              </Text>
            </Surface>
          ) : null}

          <Surface tone="inset" padding={3} gap={2}>
            <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
              <OrderFactRow label="المتجر" value={summary.merchantName} />
              <OrderFactRow label="رقم الطلب" value={summary.orderId} />
            </Box>
            <OrderFactRow label="جاهزية الطلب" value={summary.readinessNote} />
          </Surface>

          <Text role="bodySm" tone="muted">
            هذا المسار المختصر يحافظ على السياق ويعيدك للطابور بسرعة بعد اتخاذ القرار.
          </Text>

          <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
            <Button label="تأكيد الجاهزية" size="sm" fullWidth={false} onPress={() => onConfirmReady?.(summary.orderId)} />
            <Button label="الطلب التالي" size="sm" tone="secondary" fullWidth={false} onPress={onOpenNextOrder} />
            <Button label="العودة إلى الطابور" size="sm" tone="ghost" fullWidth={false} onPress={onBackToInbox} />
          </Box>
        </Box>
      </Card>
    </MobileScrollView>
  );
}



