import React from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  MobileScrollView,
  SearchField,
  SearchTopBar,
  SheetFrame,
  StateView,
  Surface,
  Text,
  resolveRowDirection,
  useDirection,
} from '@bthwani/ui-kit';
import { DshPartnerOrderAlertsPanel } from '../parts/PartnerOrderAlertsPanel';
import { DshPartnerOrderConversationPanel } from '../parts/PartnerOrderConversationPanel';
import type { DshPartnerOrderConversationMode } from '../data/partner-order-conversation.preview-data';

// ML-018: added preparation_started; ML-019: preparing already present — distinguishing start vs in-progress
type PartnerOrderStatus = 'new' | 'needs_accept' | 'preparation_started' | 'preparing' | 'ready' | 'handoff' | 'delivering' | 'completed' | 'cancelled';
type PartnerOrderPriority = 'high' | 'normal' | 'low';
type OrderHubAction = 'accept' | 'details' | 'prepare' | 'ready' | 'handoff' | 'issue' | 'delivering';
type SmartFilterId = 'all' | 'needs_accept' | 'preparing' | 'ready' | 'handoff' | 'delivering' | 'issues' | 'completed';
type QuickFilterId = 'urgent' | 'sla_risk' | 'pickup' | 'store_delivery' | 'platform_delivery' | 'unread';
type SortMode = 'newest' | 'priority' | 'sla';

export type PartnerOrdersHomeScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled' | 'partial';

export type PartnerOrderItem = {
  id: string;
  orderCode: string;
  customerName: string;
  branchLabel: string;
  status: PartnerOrderStatus;
  priority: PartnerOrderPriority;
  orderTypeLabel: 'استلم بنفسك' | 'توصيل المتجر' | 'توصيل بثواني';
  orderMode: DshPartnerOrderConversationMode;
  itemsCountLabel: string;
  amountLabel: string;
  createdAtLabel: string;
  elapsedLabel: string;
  nextActionLabel: string;
  urgent?: boolean;
  slaRisk?: boolean;
  unread?: boolean;
  issueRequired?: boolean;
};

export type PartnerOrdersHomeScreenProps = {
  state?: PartnerOrdersHomeScreenState;
  items?: readonly PartnerOrderItem[];
  branchLabel?: string;
  quickAlert?: string;
  searchMode?: boolean;
  orderMode?: DshPartnerOrderConversationMode;
  showOrderConversation?: boolean;
  showOrderAlerts?: boolean;
  onCloseSearch?: () => void;
  onOpenOrderAction?: (actionId: OrderHubAction, orderId: string) => void;
  onOpenEntryPress?: () => void;
  onOpenMaintenancePress?: () => void;
  onOpenInventoryManagementPress?: () => void;
  onRetry?: () => void;
};

const smartFilters: ReadonlyArray<{ id: SmartFilterId; label: string; tone: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' }> = [
  { id: 'all', label: 'الكل', tone: 'brand' },
  { id: 'needs_accept', label: 'تحتاج قبول', tone: 'warning' },
  { id: 'preparing', label: 'قيد التحضير', tone: 'info' },
  { id: 'ready', label: 'جاهزة', tone: 'success' },
  { id: 'handoff', label: 'تسليم للكابتن', tone: 'brand' },
  { id: 'delivering', label: 'في الطريق', tone: 'info' },
  { id: 'issues', label: 'مشاكل', tone: 'danger' },
  { id: 'completed', label: 'مكتملة', tone: 'success' },
];

const quickFilters: ReadonlyArray<{ id: QuickFilterId; label: string }> = [
  { id: 'urgent', label: 'عاجلة' },
  { id: 'sla_risk', label: 'SLA قريب' },
  { id: 'pickup', label: 'استلم بنفسك' },
  { id: 'store_delivery', label: 'توصيل المتجر' },
  { id: 'platform_delivery', label: 'توصيل بثواني' },
  { id: 'unread', label: 'غير مقروء' },
];

const sortModes: ReadonlyArray<{ id: SortMode; label: string }> = [
  { id: 'newest', label: 'الأحدث' },
  { id: 'priority', label: 'الأعلى أولوية' },
  { id: 'sla', label: 'الأقرب لـ SLA' },
];

const demoOrders: readonly PartnerOrderItem[] = [
  {
    id: 'ord-4401',
    orderCode: '#4401',
    customerName: 'نوف العتيبي',
    branchLabel: 'فرع الياسمين',
    status: 'needs_accept',
    priority: 'high',
    orderTypeLabel: 'توصيل المتجر',
    orderMode: 'store_delivery',
    itemsCountLabel: '3 عناصر',
    amountLabel: '92 ر.س',
    createdAtLabel: '10:42 ص',
    elapsedLabel: 'منذ دقيقتين',
    nextActionLabel: 'قبول الطلب',
    urgent: true,
    slaRisk: true,
    unread: true,
  },
  {
    id: 'ord-4398',
    orderCode: '#4398',
    customerName: 'خالد الزهراني',
    branchLabel: 'فرع الياسمين',
    status: 'preparing',
    priority: 'normal',
    orderTypeLabel: 'استلم بنفسك',
    orderMode: 'pickup',
    itemsCountLabel: '5 عناصر',
    amountLabel: '124 ر.س',
    createdAtLabel: '10:33 ص',
    elapsedLabel: 'منذ 11 دقيقة',
    nextActionLabel: 'متابعة التحضير',
    unread: true,
  },
  {
    id: 'ord-4391',
    orderCode: '#4391',
    customerName: 'ريم الشهراني',
    branchLabel: 'فرع الياسمين',
    status: 'ready',
    priority: 'high',
    orderTypeLabel: 'توصيل المتجر',
    orderMode: 'store_delivery',
    itemsCountLabel: '2 عنصر',
    amountLabel: '76 ر.س',
    createdAtLabel: '10:21 ص',
    elapsedLabel: 'منذ 20 دقيقة',
    nextActionLabel: 'تأكيد الجاهزية',
    urgent: true,
  },
  {
    id: 'ord-4385',
    orderCode: '#4385',
    customerName: 'محمد السالم',
    branchLabel: 'فرع الياسمين',
    status: 'handoff',
    priority: 'normal',
    orderTypeLabel: 'توصيل المتجر',
    orderMode: 'store_delivery',
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
    orderTypeLabel: 'توصيل بثواني',
    orderMode: 'platform_delivery',
    itemsCountLabel: '1 عنصر',
    amountLabel: '41 ر.س',
    createdAtLabel: '09:54 ص',
    elapsedLabel: 'منذ 47 دقيقة',
    nextActionLabel: 'متابعة التسليم',
    slaRisk: true,
  },
  {
    id: 'ord-4368',
    orderCode: '#4368',
    customerName: 'عبدالله المطيري',
    branchLabel: 'فرع الياسمين',
    status: 'completed',
    priority: 'low',
    orderTypeLabel: 'استلم بنفسك',
    orderMode: 'pickup',
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
    orderTypeLabel: 'توصيل المتجر',
    orderMode: 'store_delivery',
    itemsCountLabel: '3 عناصر',
    amountLabel: '87 ر.س',
    createdAtLabel: '09:28 ص',
    elapsedLabel: 'قبل 73 دقيقة',
    nextActionLabel: 'مراجعة المشكلة',
    issueRequired: true,
    unread: true,
  },
];

function resolveStatusLabel(status: PartnerOrderStatus) {
  if (status === 'new') return 'جديدة';
  if (status === 'needs_accept') return 'تحتاج قبول';
  if (status === 'preparation_started') return 'بدأ التحضير';
  if (status === 'preparing') return 'قيد التحضير';
  if (status === 'ready') return 'جاهزة';
  if (status === 'handoff') return 'تسليم للكابتن';
  if (status === 'delivering') return 'في الطريق';
  if (status === 'completed') return 'مكتملة';
  return 'مشكلة';
}

function resolveStatusTone(status: PartnerOrderStatus): 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' {
  if (status === 'needs_accept' || status === 'new') return 'warning';
  if (status === 'preparation_started' || status === 'preparing' || status === 'delivering') return 'info';
  if (status === 'ready' || status === 'completed') return 'success';
  if (status === 'handoff') return 'brand';
  return 'danger';
}

function resolvePriorityLabel(priority: PartnerOrderPriority) {
  if (priority === 'high') return 'أولوية عالية';
  if (priority === 'normal') return 'أولوية متوسطة';
  return 'أولوية منخفضة';
}

function resolvePriorityTone(priority: PartnerOrderPriority): 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' {
  if (priority === 'high') return 'danger';
  if (priority === 'normal') return 'brand';
  return 'default';
}

function resolveOrderAction(status: PartnerOrderStatus): OrderHubAction {
  if (status === 'new' || status === 'needs_accept') return 'accept';
  if (status === 'preparation_started' || status === 'preparing') return 'prepare';
  if (status === 'ready') return 'ready';
  if (status === 'handoff') return 'handoff';
  if (status === 'delivering') return 'delivering';
  if (status === 'cancelled') return 'issue';
  return 'details';
}

function renderState(state: Exclude<PartnerOrdersHomeScreenState, 'ready'>, onRetry?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" title="جارٍ تجهيز لوحة عمليات الطلب" description="نرتب أحدث الطلبات والمسارات المرتبطة بها الآن." />;
  }

  if (state === 'empty') {
    return <StateView stateId="empty" title="لا توجد طلبات الآن" description="ستظهر الطلبات الجديدة هنا فور وصولها." actionLabel={onRetry ? 'تحديث' : undefined} onActionPress={onRetry} />;
  }

  if (state === 'offline') {
    return <StateView stateId="offline" title="الاتصال غير متاح" description="تحقق من الشبكة ثم أعد فتح لوحة الطلبات." actionLabel={onRetry ? 'إعادة المحاولة' : undefined} onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return <StateView kind="warning" title="لوحة عمليات الطلب متوقفة مؤقتًا" description="الوصول متوقف حتى يكتمل التحقق التشغيلي." actionLabel={onRetry ? 'تحقق الآن' : undefined} onActionPress={onRetry} />;
  }

  if (state === 'partial') {
    return <StateView kind="warning" title="توفر جزئي" description="بعض البيانات متاحة الآن مع متابعة المزامنة." actionLabel={onRetry ? 'إعادة المزامنة' : undefined} onActionPress={onRetry} />;
  }

  return <StateView stateId="recoverableError" title="تعذر فتح لوحة عمليات الطلب" description="حدث خلل مؤقت. أعد المحاولة من دون فقدان السياق." actionLabel={onRetry ? 'إعادة المحاولة' : undefined} onActionPress={onRetry} />;
}

function resolveEmptyStateDescription(filterLabel: string) {
  return `لا توجد طلبات ضمن فلتر ${filterLabel} الآن. غيّر الفلتر أو البحث لرؤية طلبات أخرى.`;
}

export function DshPartnerOrdersScreen(props: PartnerOrdersHomeScreenProps) {
  const {
    state = 'ready',
    items = demoOrders,
    branchLabel = 'الرياض، فرع الياسمين',
    quickAlert = 'هناك طلبات تحتاج قبولًا أو متابعة سريعة خلال الدقائق القادمة.',
    searchMode = false,
    orderMode,
    showOrderConversation = true,
    showOrderAlerts = true,
    onCloseSearch,
    onOpenOrderAction,
    onOpenEntryPress,
    onOpenMaintenancePress,
    onOpenInventoryManagementPress,
    onRetry,
  } = props;
  const { direction } = useDirection();
  const [smartFilter, setSmartFilter] = React.useState<SmartFilterId>('all');
  const [quickFilter, setQuickFilter] = React.useState<QuickFilterId | null>(null);
  const [sortMode, setSortMode] = React.useState<SortMode>('newest');
  const [query, setQuery] = React.useState('');
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(items[0]?.id ?? null);
  const [detailsVisible, setDetailsVisible] = React.useState(false);

  if (state !== 'ready') {
    return renderState(state, onRetry);
  }

  const normalizedQuery = query.trim().toLowerCase();
  const summary = React.useMemo(() => ({
    active: items.filter((item) => item.status !== 'completed' && item.status !== 'cancelled').length,
    urgent: items.filter((item) => item.urgent || item.priority === 'high').length,
    needsAction: items.filter((item) => item.status === 'needs_accept' || item.status === 'preparation_started' || item.status === 'preparing' || item.status === 'ready' || item.status === 'handoff').length,
    issues: items.filter((item) => item.issueRequired || item.status === 'cancelled').length,
  }), [items]);

  const filteredItems = React.useMemo(() => {
    const scoped = items.filter((item) => {
      const smartMatch =
        smartFilter === 'all'
          ? true
          : smartFilter === 'issues'
            ? Boolean(item.issueRequired || item.status === 'cancelled')
            : smartFilter === 'completed'
              ? item.status === 'completed'
              : item.status === smartFilter;

      const quickMatch =
        quickFilter === null
          ? true
          : quickFilter === 'urgent'
            ? Boolean(item.urgent || item.priority === 'high')
            : quickFilter === 'sla_risk'
              ? Boolean(item.slaRisk)
              : quickFilter === 'pickup'
                ? item.orderMode === 'pickup'
                : quickFilter === 'store_delivery'
                  ? item.orderMode === 'store_delivery'
                  : quickFilter === 'platform_delivery'
                    ? item.orderMode === 'platform_delivery'
                    : Boolean(item.unread);

      const textMatch =
        normalizedQuery.length === 0
          ? true
          : [item.orderCode, item.customerName, item.branchLabel, resolveStatusLabel(item.status)]
              .join(' ')
              .toLowerCase()
              .includes(normalizedQuery);

      return smartMatch && quickMatch && textMatch;
    });

    return [...scoped].sort((left, right) => {
      if (sortMode === 'priority') {
        const leftScore = left.priority === 'high' ? 3 : left.priority === 'normal' ? 2 : 1;
        const rightScore = right.priority === 'high' ? 3 : right.priority === 'normal' ? 2 : 1;
        return rightScore - leftScore;
      }

      if (sortMode === 'sla') {
        const leftScore = left.slaRisk ? 1 : 0;
        const rightScore = right.slaRisk ? 1 : 0;
        return rightScore - leftScore;
      }

      return right.createdAtLabel.localeCompare(left.createdAtLabel, 'ar');
    });
  }, [items, normalizedQuery, quickFilter, smartFilter, sortMode]);

  const selectedOrder = React.useMemo(
    () => filteredItems.find((item) => item.id === selectedOrderId) ?? filteredItems[0] ?? null,
    [filteredItems, selectedOrderId]
  );

  React.useEffect(() => {
    if (filteredItems.length === 0) {
      if (selectedOrderId !== null) {
        setSelectedOrderId(null);
      }
      return;
    }

    if (!filteredItems.some((item) => item.id === selectedOrderId)) {
      setSelectedOrderId(filteredItems[0].id);
    }
  }, [filteredItems, selectedOrderId]);

  const selectedOrderMode = orderMode ?? selectedOrder?.orderMode ?? 'pickup';
  const activeFilterLabel = smartFilters.find((item) => item.id === smartFilter)?.label ?? 'الكل';

  function openQuickView(orderId: string) {
    setSelectedOrderId(orderId);
    setDetailsVisible(true);
  }

  function openOrderDetail(orderId: string) {
    setSelectedOrderId(orderId);
    onOpenOrderAction?.('details', orderId);
  }

  function openPrimaryAction(item: PartnerOrderItem) {
    setSelectedOrderId(item.id);
    onOpenOrderAction?.(resolveOrderAction(item.status), item.id);
  }

  return (
    <>
      <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 112 }}>
        <Surface tone="raised" padding={3} gap={3}>
          <Box gap={1}>
            <Text role="label">لوحة عمليات الطلب</Text>
            <Text role="bodySm" tone="muted">{branchLabel}</Text>
            <Text role="bodySm" tone="muted">{quickAlert}</Text>
          </Box>
          <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
            <Chip label={`${summary.active} نشطة`} tone="brand" selected />
            <Chip label={`${summary.urgent} عاجلة`} tone="warning" />
            <Chip label={`${summary.needsAction} تحتاج إجراء`} tone="info" />
            <Chip label={`${summary.issues} مشاكل`} tone="danger" />
          </Box>
        </Surface>

        <Surface tone="raised" padding={3} gap={3}>
          <Box gap={1}>
            <Text role="label">اختصارات التشغيل</Text>
            <Text role="bodySm" tone="muted">مدخلات مرتبطة بلوحة الطلبات فقط من دون مغادرة السياق.</Text>
          </Box>
          <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
            <Button label="مدخل التشغيل" fullWidth={false} onPress={onOpenEntryPress} />
            <Button label="صيانة الفرع" tone="secondary" fullWidth={false} onPress={onOpenMaintenancePress} />
            <Button label="إدارة المنتجات" tone="secondary" fullWidth={false} onPress={onOpenInventoryManagementPress} />
          </Box>
        </Surface>

        <Surface tone="raised" padding={3} gap={3}>
          <Box gap={1}>
            <Text role="label">البحث والفلترة</Text>
            <Text role="bodySm" tone="muted">ابحث برقم الطلب أو اسم العميل أو الفرع أو الحالة، ثم ضيق النتائج بفلتر ذكي وسريع.</Text>
          </Box>
          {searchMode ? (
            <SearchTopBar
              variant="surface"
              value={query}
              onChangeText={setQuery}
              onClose={() => onCloseSearch?.()}
              placeholder="رقم الطلب أو اسم العميل أو الفرع أو الحالة"
              hint="يمكنك متابعة الفلاتر من نفس الصفحة."
              autoFocus
            />
          ) : (
            <SearchField
              label="بحث الطلبات"
              value={query}
              onChangeText={setQuery}
              placeholder="رقم الطلب أو اسم العميل أو الفرع أو الحالة"
              hint="الكتابة تضيق النتائج فورًا."
            />
          )}
          <Box gap={2}>
            <Text role="caption" tone="muted">الفلاتر الذكية</Text>
            <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
              {smartFilters.map((filter) => (
                <Chip key={filter.id} label={filter.label} selected={smartFilter === filter.id} tone={filter.tone} onPress={() => setSmartFilter(filter.id)} />
              ))}
            </Box>
          </Box>
          <Box gap={2}>
            <Text role="caption" tone="muted">الفلاتر السريعة</Text>
            <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
              {quickFilters.map((filter) => (
                <Chip key={filter.id} label={filter.label} selected={quickFilter === filter.id} onPress={() => setQuickFilter((current) => (current === filter.id ? null : filter.id))} />
              ))}
            </Box>
          </Box>
          <Box gap={2}>
            <Text role="caption" tone="muted">الترتيب</Text>
            <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
              {sortModes.map((item) => (
                <Chip key={item.id} label={item.label} selected={sortMode === item.id} tone="brand" onPress={() => setSortMode(item.id)} />
              ))}
            </Box>
          </Box>
        </Surface>

        <Surface tone="default" padding={3} gap={3}>
          <Box gap={1}>
            <Text role="label">الطابور الحالي</Text>
            <Text role="bodySm" tone="muted">{filteredItems.length === 0 ? 'لا توجد نتائج مطابقة الآن.' : `تظهر ${filteredItems.length} طلبات ضمن الفلاتر الحالية.`}</Text>
          </Box>

          {filteredItems.length === 0 ? (
            <StateView
              stateId="empty"
              title={`لا توجد طلبات ضمن ${activeFilterLabel}`}
              description={resolveEmptyStateDescription(activeFilterLabel)}
              actionLabel="إعادة الضبط"
              onActionPress={() => {
                setSmartFilter('all');
                setQuickFilter(null);
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
                      <Button label="عرض التفاصيل" size="sm" tone="secondary" fullWidth={false} onPress={() => openOrderDetail(item.id)} />
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
                      {item.unread ? <Chip label="غير مقروء" tone="warning" /> : null}
                      {item.slaRisk ? <Chip label="SLA قريب" tone="danger" /> : null}
                    </Box>
                    <Text role="bodySm" tone="muted">{item.createdAtLabel} · {item.elapsedLabel}</Text>
                    <Text role="caption" tone={resolveStatusTone(item.status)}>
                      الإجراء التالي: {item.nextActionLabel}
                    </Text>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </Surface>

        {selectedOrder ? (
          <Surface tone="raised" padding={3} gap={3}>
            <Box gap={1}>
              <Text role="label">سياق الطلب المحدد</Text>
              <Text role="bodySm" tone="muted">{selectedOrder.orderCode} · {selectedOrder.customerName} · {selectedOrder.orderTypeLabel}</Text>
            </Box>
            {showOrderAlerts ? (
              <DshPartnerOrderAlertsPanel
                activeOrderId={selectedOrder.id}
                onOpenOrder={(orderId) => setSelectedOrderId(orderId)}
                onOpenFlow={() => onOpenOrderAction?.('details', selectedOrder.id)}
              />
            ) : null}
            {showOrderConversation ? (
              <DshPartnerOrderConversationPanel
                enabledForOrderMode={selectedOrderMode}
                onOpenFlow={(flowId) => {
                  if (flowId === 'order-chat-read-ack' || flowId === 'order-chat-send') {
                    onOpenOrderAction?.('details', selectedOrder.id);
                  }
                }}
              />
            ) : null}
          </Surface>
        ) : null}
      </MobileScrollView>

      <SheetFrame visible={detailsVisible} title={selectedOrder ? `معاينة ${selectedOrder.orderCode}` : 'معاينة الطلب'} onClose={() => setDetailsVisible(false)}>
        {selectedOrder ? (
          <Box gap={3}>
            <Box gap={1}>
              <Text role="titleSm">{selectedOrder.customerName}</Text>
              <Text role="bodySm" tone="muted">{selectedOrder.branchLabel}</Text>
            </Box>
            <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
              <Chip label={resolveStatusLabel(selectedOrder.status)} tone={resolveStatusTone(selectedOrder.status)} selected />
              <Chip label={selectedOrder.orderTypeLabel} tone="brand" />
              <Chip label={selectedOrder.amountLabel} tone="success" />
            </Box>
            <Text role="bodySm" tone="muted">الإجراء التالي: {selectedOrder.nextActionLabel}</Text>
            <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
              <Button label={selectedOrder.nextActionLabel} fullWidth={false} onPress={() => openPrimaryAction(selectedOrder)} />
              <Button label="فتح التفاصيل" tone="secondary" fullWidth={false} onPress={() => openOrderDetail(selectedOrder.id)} />
            </Box>
          </Box>
        ) : null}
      </SheetFrame>
    </>
  );
}

export { DshPartnerOrdersScreen as PartnerOrdersHomeScreen };

export type PartnerOrdersInboxScreenState = PartnerOrdersHomeScreenState;
export type PartnerOrdersInboxListItem = PartnerOrderItem;
export type PartnerOrdersInboxScreenProps = {
  state?: PartnerOrdersInboxScreenState;
  items?: readonly PartnerOrdersInboxListItem[];
  searchMode?: boolean;
  onCloseSearch?: () => void;
  onOpenOrder?: (orderId: string) => void;
  onOpenNextOrder?: (orderId: string) => void;
  // ML-020: explicit mark-ready callback — triggered when partner confirms order ready for pickup
  onMarkReady?: (orderId: string) => void;
  onRetry?: () => void;
};

export function PartnerOrdersInboxScreen({ state = 'ready', items, searchMode, onCloseSearch, onOpenOrder, onOpenNextOrder, onMarkReady, onRetry }: PartnerOrdersInboxScreenProps) {
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
        if (actionId === 'ready') {
          onMarkReady?.(orderId);
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
        orderTypeLabel: 'توصيل المتجر',
        orderMode: 'store_delivery',
        itemsCountLabel: '1 عنصر',
        amountLabel: '—',
        createdAtLabel: summary.serviceWindowLabel,
        elapsedLabel: summary.readinessNote,
        nextActionLabel: summary.nextActionLabel,
      }] : undefined}
      showOrderAlerts
      showOrderConversation
      onOpenOrderAction={(actionId, orderId) => {
        if (actionId === 'ready' || actionId === 'handoff' || actionId === 'details') {
          onConfirmReady?.(orderId);
        }
      }}
      onRetry={onRetry}
    />
  );
}

export type OrderDetailScreenProps = PartnerOrderDetailScreenProps;
export { PartnerOrderDetailScreen as OrderDetailScreen };

export type OrdersInboxScreenProps = PartnerOrdersInboxScreenProps;

export function OrdersInboxScreen(props: OrdersInboxScreenProps) {
  return <PartnerOrdersInboxScreen {...props} />;
}

export default OrdersInboxScreen;
