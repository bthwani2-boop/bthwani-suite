import React from 'react';
import {
  Box,
  Button,
  Card,
  MobileScrollView,
  SearchTopBar,
  SectionHeader,
  StateView,
  Surface,
  Text,
  TextField,
} from '@bthwani/ui-kit';

const BTH_DEEP_BLUE = '#0A2F5C';
const BTH_ORANGE = '#FF500D';
const BTH_WHITE = '#FFFFFF';

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

export function PartnerOrdersHomeScreen({
  state = 'ready',
  items = demoOrders,
  branchLabel = 'الرياض، فرع الياسمين',
  quickAlert = 'توجد طلبات بحاجة إجراء فوري خلال الدقائق القادمة.',
  searchMode = false,
  onCloseSearch,
  onOpenOrderAction,
  onOpenEntryPress,
  onOpenMaintenancePress,
  onOpenInventoryManagementPress,
  onRetry,
}: PartnerOrdersHomeScreenProps) {
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');
  const [query, setQuery] = React.useState('');

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
      <Surface tone="brand" gap={3} style={{ borderColor: BTH_DEEP_BLUE, borderWidth: 1 }}>
        <Box gap={1}>
          <Text role="titleLg" tone="inverse">مركز طلبات الشريك</Text>
          <Text role="bodySm" tone="inverse" style={{ opacity: 0.96 }}>{branchLabel}</Text>
          <Text role="caption" tone="inverse" style={{ opacity: 0.92 }}>{quickAlert}</Text>
        </Box>

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Surface tone="raised" style={{ flex: 1, minWidth: 132, borderWidth: 1, borderColor: BTH_ORANGE }}>
            <Text role="caption" tone="muted">طلبات نشطة</Text>
            <Text role="titleMd" style={{ color: BTH_DEEP_BLUE }}>{String(activeOrdersCount)}</Text>
          </Surface>
          <Surface tone="raised" style={{ flex: 1, minWidth: 132, borderWidth: 1, borderColor: BTH_ORANGE }}>
            <Text role="caption" tone="muted">طلبات عاجلة</Text>
            <Text role="titleMd" style={{ color: BTH_DEEP_BLUE }}>{String(urgentOrdersCount)}</Text>
          </Surface>
          <Surface tone="raised" style={{ flex: 1, minWidth: 132, borderWidth: 1, borderColor: BTH_ORANGE }}>
            <Text role="caption" tone="muted">إجراءات معلقة</Text>
            <Text role="titleMd" style={{ color: BTH_DEEP_BLUE }}>{String(pendingActionsCount)}</Text>
          </Surface>
        </Box>
      </Surface>

      <Surface tone="raised" gap={3} style={{ borderColor: BTH_DEEP_BLUE, borderWidth: 1 }}>
        <SectionHeader title="اختصارات الطلبات" subtitle="مدخلات تشغيلية مرتبطة بمسار الطلبات فقط." />
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label="مدخل التشغيل" onPress={onOpenEntryPress} />
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

      <Surface tone="raised" gap={1} style={{ borderColor: BTH_ORANGE, borderWidth: 1 }}>
        <Text role="caption" style={{ color: BTH_DEEP_BLUE }}>
          BThwani DNA: {BTH_DEEP_BLUE} / {BTH_ORANGE} / {BTH_WHITE}
        </Text>
      </Surface>
    </MobileScrollView>
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

export function PartnerOrderDetailScreen({ state = 'ready', summary, onConfirmReady, onRetry }: PartnerOrderDetailScreenProps) {
  const fallbackOrderId = summary?.orderId ?? 'ord-detail';
  return (
    <PartnerOrdersHomeScreen
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
