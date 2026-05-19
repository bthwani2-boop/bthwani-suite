import React from 'react';
import { Box, Button, Card, Chip, MobileScrollView, SearchField, SheetFrame, StateView, Surface, Text, resolveRowDirection, useDirection } from '@bthwani/ui-kit';
import type { DshPartnerOrderConversationMode } from '../data/partner-order-conversation.preview-data';

// ML-018: added preparation_started; ML-019: preparing + items_ready distinguish in-progress vs done
// ML-021: added captain_assigned / captain_arriving so partner can track handoff event
type PartnerOrderStatus = 'new' | 'needs_accept' | 'preparation_started' | 'preparing' | 'items_ready' | 'ready' | 'handoff' | 'captain_assigned' | 'captain_arriving' | 'delivering' | 'completed' | 'cancelled';
type PartnerOrderPriority = 'high' | 'normal' | 'low';
type OrderHubAction = 'accept' | 'details' | 'prepare' | 'ready' | 'handoff' | 'issue' | 'delivering';

export type OrderStageFilterId =
  | 'all'
  | 'acceptance'
  | 'preparation'
  | 'ready'
  | 'handoff'
  | 'delivering'
  | 'issues';

export type QuickFilterId =
  | 'urgent'
  | 'sla_risk'
  | 'unread'
  | 'pickup'
  | 'partner_delivery'
  | 'bthwani_delivery'
  | 'completed'
  | 'cancelled';

export type SortMode =
  | 'next_action'
  | 'newest'
  | 'priority'
  | 'sla';

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
  // Optional enrichment fields — safe to omit; callers that don't supply them get graceful fallback
  itemsSummaryLabel?: string;   // e.g. "برغر كلاسيك، بطاطس، مشروب"
  paymentLabel?: string;        // e.g. "نقد عند التسليم" | "محفظة" | "بطاقة"
  slaLabel?: string;            // e.g. "يتبقى 8 دقائق"
  nextOwnerLabel?: string;      // e.g. "موصل المتجر" | "كابتن بثواني" | "العميل"
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

const stageFilters: ReadonlyArray<{ id: OrderStageFilterId; label: string; tone: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' }> = [
  { id: 'all', label: 'الكل', tone: 'brand' },
  { id: 'acceptance', label: 'قبول', tone: 'warning' },
  { id: 'preparation', label: 'تجهيز', tone: 'info' },
  { id: 'ready', label: 'جاهز', tone: 'success' },
  { id: 'handoff', label: 'تسليم', tone: 'brand' },
  { id: 'delivering', label: 'في الطريق', tone: 'info' },
  { id: 'issues', label: 'مشاكل', tone: 'danger' },
];

const quickFilters: ReadonlyArray<{ id: QuickFilterId; label: string }> = [
  { id: 'urgent', label: 'عاجلة' },
  { id: 'sla_risk', label: 'SLA قريب' },
  { id: 'unread', label: 'غير مقروء' },
  { id: 'pickup', label: 'استلم بنفسك' },
  { id: 'partner_delivery', label: 'توصيل المتجر' },
  { id: 'bthwani_delivery', label: 'توصيل بثواني' },
  { id: 'completed', label: 'مكتملة' },
  { id: 'cancelled', label: 'ملغاة/مشكلة' },
];

const sortModes: ReadonlyArray<{ id: SortMode; label: string }> = [
  { id: 'next_action', label: 'الإجراء الأول' },
  { id: 'newest', label: 'الأحدث' },
  { id: 'priority', label: 'الأولوية العالية' },
  { id: 'sla', label: 'الأقرب لـ SLA' },
];

const demoOrders: readonly PartnerOrderItem[] = [
  {
    id: 'ord-4401',
    orderCode: 'ORD-4401',
    customerName: 'نوف العتيبي',
    branchLabel: 'فرع الياسمين',
    status: 'needs_accept',
    priority: 'high',
    orderTypeLabel: 'توصيل المتجر',
    orderMode: 'partner_delivery',
    itemsCountLabel: '3 عناصر',
    itemsSummaryLabel: 'برغر كلاسيك، بطاطس كبيرة، مشروب غازي',
    amountLabel: '92 ر.ي',
    paymentLabel: 'نقد عند التسليم',
    createdAtLabel: '10:42 ص',
    elapsedLabel: 'منذ دقيقتين',
    slaLabel: 'يتبقى 6 دقائق',
    nextActionLabel: 'قبول الطلب',
    nextOwnerLabel: 'موصل المتجر',
    urgent: true,
    slaRisk: true,
    unread: true,
  },
  {
    id: 'ord-4398',
    orderCode: 'ORD-4398',
    customerName: 'خالد الزهراني',
    branchLabel: 'فرع الياسمين',
    status: 'preparing',
    priority: 'normal',
    orderTypeLabel: 'استلم بنفسك',
    orderMode: 'pickup',
    itemsCountLabel: '5 عناصر',
    itemsSummaryLabel: 'وجبة عائلية + خيارات إضافية',
    amountLabel: '124 ر.ي',
    paymentLabel: 'محفظة بثواني',
    createdAtLabel: '10:33 ص',
    elapsedLabel: 'منذ 11 دقيقة',
    nextActionLabel: 'متابعة التحضير',
    nextOwnerLabel: 'العميل',
    unread: true,
  },
  {
    id: 'ord-4391',
    orderCode: 'ORD-4391',
    customerName: 'ريم الشهراني',
    branchLabel: 'فرع الياسمين',
    status: 'ready',
    priority: 'high',
    orderTypeLabel: 'توصيل المتجر',
    orderMode: 'partner_delivery',
    itemsCountLabel: '2 عنصر',
    itemsSummaryLabel: 'بيتزا مارغريتا، عصير طبيعي',
    amountLabel: '76 ر.ي',
    paymentLabel: 'بطاقة ائتمانية',
    createdAtLabel: '10:21 ص',
    elapsedLabel: 'منذ 20 دقيقة',
    nextActionLabel: 'تأكيد الجاهزية',
    nextOwnerLabel: 'موصل المتجر',
    urgent: true,
  },
  {
    id: 'ord-4385',
    orderCode: 'ORD-4385',
    customerName: 'محمد السالم',
    branchLabel: 'فرع الياسمين',
    status: 'handoff',
    priority: 'normal',
    orderTypeLabel: 'توصيل المتجر',
    orderMode: 'partner_delivery',
    itemsCountLabel: '4 عناصر',
    itemsSummaryLabel: 'شاورما دجاج × 2، بطاطس، مشروب',
    amountLabel: '118 ر.ي',
    paymentLabel: 'نقد عند التسليم',
    createdAtLabel: '10:10 ص',
    elapsedLabel: 'منذ 31 دقيقة',
    nextActionLabel: 'تسليم لموصل الشريك',
    nextOwnerLabel: 'موصل المتجر',
  },
  {
    id: 'ord-4372',
    orderCode: 'ORD-4372',
    customerName: 'سارة القحطاني',
    branchLabel: 'فرع الياسمين',
    status: 'delivering',
    priority: 'normal',
    orderTypeLabel: 'توصيل بثواني',
    orderMode: 'bthwani_delivery',
    itemsCountLabel: '1 عنصر',
    itemsSummaryLabel: 'سلطة خضراء كبيرة',
    amountLabel: '41 ر.ي',
    paymentLabel: 'محفظة بثواني',
    createdAtLabel: '09:54 ص',
    elapsedLabel: 'منذ 47 دقيقة',
    slaLabel: 'يتبقى 3 دقائق',
    nextActionLabel: 'متابعة التسليم',
    nextOwnerLabel: 'كابتن بثواني',
    slaRisk: true,
  },
  {
    id: 'ord-4368',
    orderCode: 'ORD-4368',
    customerName: 'عبدالله المطيري',
    branchLabel: 'فرع الياسمين',
    status: 'completed',
    priority: 'low',
    orderTypeLabel: 'استلم بنفسك',
    orderMode: 'pickup',
    itemsCountLabel: '2 عنصر',
    itemsSummaryLabel: 'قهوة سوداء، كيكة جوز',
    amountLabel: '59 ر.ي',
    paymentLabel: 'نقد',
    createdAtLabel: '09:40 ص',
    elapsedLabel: 'قبل 61 دقيقة',
    nextActionLabel: 'مراجعة السجل',
  },
  {
    id: 'ord-4359',
    orderCode: 'ORD-4359',
    customerName: 'أحمد الدوسري',
    branchLabel: 'فرع الياسمين',
    status: 'cancelled',
    priority: 'low',
    orderTypeLabel: 'توصيل المتجر',
    orderMode: 'partner_delivery',
    itemsCountLabel: '3 عناصر',
    itemsSummaryLabel: 'طلب مختلط — يحتاج مراجعة',
    amountLabel: '87 ر.ي',
    paymentLabel: 'نقد عند التسليم',
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
  if (status === 'items_ready') return 'العناصر جاهزة';
  if (status === 'ready') return 'جاهزة';
  if (status === 'handoff') return 'تسليم للمندوب';
  if (status === 'captain_assigned') return 'تم تعيين المندوب';
  if (status === 'captain_arriving') return 'المندوب في الطريق';
  if (status === 'delivering') return 'في الطريق';
  if (status === 'completed') return 'مكتملة';
  return 'مشكلة';
}

function resolveStatusTone(status: PartnerOrderStatus): 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' {
  if (status === 'needs_accept' || status === 'new') return 'warning';
  if (status === 'preparation_started' || status === 'preparing' || status === 'items_ready' || status === 'delivering') return 'info';
  if (status === 'ready' || status === 'completed') return 'success';
  if (status === 'handoff' || status === 'captain_assigned' || status === 'captain_arriving') return 'brand';
  return 'danger';
}

function resolvePriorityTone(priority: PartnerOrderPriority): 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' {
  if (priority === 'high') return 'danger';
  if (priority === 'normal') return 'brand';
  return 'default';
}

function resolveOrderAction(status: PartnerOrderStatus): OrderHubAction {
  if (status === 'new' || status === 'needs_accept') return 'accept';
  if (status === 'preparation_started' || status === 'preparing' || status === 'items_ready') return 'prepare';
  if (status === 'ready') return 'ready';
  if (status === 'handoff' || status === 'captain_assigned' || status === 'captain_arriving') return 'handoff';
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

// ─── Order Card ────────────────────────────────────────────────────────────────
function OrderCard({
  item,
  direction,
  onPrimaryAction,
  onViewDetails,
  onQuickView,
}: {
  item: PartnerOrderItem;
  direction: 'ltr' | 'rtl';
  onPrimaryAction: () => void;
  onViewDetails: () => void;
  onQuickView: () => void;
}) {
  const rowDir = resolveRowDirection(direction);
  const statusLabel = resolveStatusLabel(item.status);
  const statusTone = resolveStatusTone(item.status);

  return (
    <Card
      padding={4}
      gap={0}
      footer={
        // ─── Zone 5: Actions ───────────────────────────────────────────────
        <Box style={{ flexDirection: rowDir, flexWrap: 'wrap' }} gap={2} paddingTop={2}>
          <Button label={item.nextActionLabel} size="sm" fullWidth={false} onPress={onPrimaryAction} />
          <Button label="عرض التفاصيل" size="sm" tone="secondary" fullWidth={false} onPress={onViewDetails} />
          <Chip label="معاينة ×" tone="info" onPress={onQuickView} />
        </Box>
      }
    >
      <Box gap={3}>
        {/* ─── Zone 1: Header ───────────────────────────────────────────── */}
        <Box gap={1}>
          <Box style={{ flexDirection: rowDir, alignItems: 'center', flexWrap: 'wrap' }} gap={2}>
            <Text role="titleSm">{item.customerName}</Text>
            <Text role="bodySm" tone="muted">· {item.orderCode}</Text>
          </Box>
          <Box style={{ flexDirection: rowDir, flexWrap: 'wrap' }} gap={2}>
            <Chip label={statusLabel} tone={statusTone} selected />
            {item.priority === 'high' ? <Chip label="أولوية عالية" tone="danger" /> : null}
            {item.urgent && item.priority !== 'high' ? <Chip label="عاجل" tone="warning" /> : null}
            {item.unread ? <Chip label="غير مقروء" tone="warning" /> : null}
            {item.issueRequired ? <Chip label="يحتاج معالجة" tone="danger" /> : null}
          </Box>
        </Box>

        {/* ─── Zone 2: Context row ──────────────────────────────────────── */}
        <Box gap={1}>
          <Box style={{ flexDirection: rowDir, flexWrap: 'wrap', alignItems: 'center' }} gap={2}>
            <Text role="bodySm" tone="muted">{item.branchLabel}</Text>
            <Text role="bodySm" tone="muted">·</Text>
            <Chip label={item.orderTypeLabel} tone="brand" />
            <Text role="bodySm" tone="muted">{item.elapsedLabel}</Text>
            {item.slaRisk && item.slaLabel ? (
              <Chip label={item.slaLabel} tone="danger" />
            ) : item.slaRisk ? (
              <Chip label="SLA قريب" tone="danger" />
            ) : null}
          </Box>
        </Box>

        {/* ─── Zone 3: Items summary ────────────────────────────────────── */}
        <Box gap={1}>
          <Text role="bodySm" tone="muted">
            {item.itemsSummaryLabel
              ? `${item.itemsCountLabel}: ${item.itemsSummaryLabel}`
              : item.itemsCountLabel}
          </Text>
        </Box>

        {/* ─── Zone 4: Finance + next owner ────────────────────────────── */}
        <Box style={{ flexDirection: rowDir, flexWrap: 'wrap', alignItems: 'center' }} gap={2}>
          <Text role="bodyStrong">{item.amountLabel}</Text>
          {item.paymentLabel ? <Text role="bodySm" tone="muted">· {item.paymentLabel}</Text> : null}
          {item.nextOwnerLabel ? (
            <Text role="bodySm" tone="muted">· الجهة التالية: {item.nextOwnerLabel}</Text>
          ) : null}
        </Box>

        {/* ─── Operational note: next action ───────────────────────────── */}
        <Text role="caption" tone={statusTone}>
          الإجراء التالي: {item.nextActionLabel}
        </Text>
      </Box>
    </Card>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────
export function DshPartnerOrdersScreen(props: PartnerOrdersHomeScreenProps) {
  const {
    state = 'ready',
    items = demoOrders,
    searchMode = false,
    onCloseSearch,
    onOpenOrderAction,
    onRetry,
  } = props;
  const { direction } = useDirection();
  const [selectedStage, setSelectedStage] = React.useState<OrderStageFilterId>('all');
  const [selectedQuickFilters, setSelectedQuickFilters] = React.useState<readonly QuickFilterId[]>([]);
  const [sortMode, setSortMode] = React.useState<SortMode>('next_action');
  const [query, setQuery] = React.useState('');
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(items[0]?.id ?? null);
  const [detailsVisible, setDetailsVisible] = React.useState(false);
  // ML-016: acceptance timer sheet — shown when partner presses accept on a needs_accept order
  const [acceptSheetVisible, setAcceptSheetVisible] = React.useState(false);
  const [acceptingOrderId, setAcceptingOrderId] = React.useState<string | null>(null);
  const [advancedPanelVisible, setAdvancedPanelVisible] = React.useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  const summary = React.useMemo(() => ({
    active: items.filter((item) => item.status !== 'completed' && item.status !== 'cancelled').length,
    urgent: items.filter((item) => item.urgent || item.priority === 'high').length,
    needsAction: items.filter((item) => item.status === 'needs_accept' || item.status === 'preparation_started' || item.status === 'preparing' || item.status === 'items_ready' || item.status === 'ready' || item.status === 'handoff' || item.status === 'captain_assigned' || item.status === 'captain_arriving').length,
    issues: items.filter((item) => item.issueRequired || item.status === 'cancelled').length,
  }), [items]);

  // Per-stage counts for chip labels
  const stageCounts = React.useMemo(() => {
    const counts: Partial<Record<OrderStageFilterId, number>> = {};
    for (const item of items) {
      if (item.status === 'new' || item.status === 'needs_accept') counts.acceptance = (counts.acceptance ?? 0) + 1;
      else if (item.status === 'preparation_started' || item.status === 'preparing' || item.status === 'items_ready') counts.preparation = (counts.preparation ?? 0) + 1;
      else if (item.status === 'ready') counts.ready = (counts.ready ?? 0) + 1;
      else if (item.status === 'handoff' || item.status === 'captain_assigned' || item.status === 'captain_arriving') counts.handoff = (counts.handoff ?? 0) + 1;
      else if (item.status === 'delivering') counts.delivering = (counts.delivering ?? 0) + 1;
      else if (item.status === 'cancelled') counts.issues = (counts.issues ?? 0) + 1;
      if (item.issueRequired) counts.issues = (counts.issues ?? 0) + 1;
    }
    return counts;
  }, [items]);

  const filteredItems = React.useMemo(() => {
    const scoped = items.filter((item) => {
      const stageMatch =
        selectedStage === 'all'
          ? true
          : selectedStage === 'acceptance'
            ? item.status === 'new' || item.status === 'needs_accept'
            : selectedStage === 'preparation'
              ? item.status === 'preparation_started' || item.status === 'preparing' || item.status === 'items_ready'
              : selectedStage === 'ready'
                ? item.status === 'ready'
                : selectedStage === 'handoff'
                  ? item.status === 'handoff' || item.status === 'captain_assigned' || item.status === 'captain_arriving'
                  : selectedStage === 'delivering'
                    ? item.status === 'delivering'
                    : selectedStage === 'issues'
                      ? item.status === 'cancelled' || Boolean(item.issueRequired)
                      : true;

      const quickMatch = selectedQuickFilters.length === 0
        ? true
        : selectedQuickFilters.every((qf) => {
            if (qf === 'urgent') return Boolean(item.urgent || item.priority === 'high');
            if (qf === 'sla_risk') return Boolean(item.slaRisk);
            if (qf === 'unread') return Boolean(item.unread);
            if (qf === 'pickup') return item.orderMode === 'pickup';
            if (qf === 'partner_delivery') return item.orderMode === 'partner_delivery';
            if (qf === 'bthwani_delivery') return item.orderMode === 'bthwani_delivery';
            if (qf === 'completed') return item.status === 'completed';
            if (qf === 'cancelled') return item.status === 'cancelled' || Boolean(item.issueRequired);
            return true;
          });

      const textMatch =
        normalizedQuery.length === 0
          ? true
          : [item.orderCode, item.customerName, item.branchLabel, resolveStatusLabel(item.status), item.itemsSummaryLabel ?? '']
              .join(' ')
              .toLowerCase()
              .includes(normalizedQuery);

      return stageMatch && quickMatch && textMatch;
    });

    return [...scoped].sort((left, right) => {
      if (sortMode === 'next_action') {
        const leftNeeds = left.status === 'new' || left.status === 'needs_accept' || left.status === 'preparation_started' || left.status === 'preparing' || left.status === 'items_ready' || left.status === 'ready' || left.status === 'handoff' || left.status === 'captain_assigned' || left.status === 'captain_arriving';
        const rightNeeds = right.status === 'new' || right.status === 'needs_accept' || right.status === 'preparation_started' || right.status === 'preparing' || right.status === 'items_ready' || right.status === 'ready' || right.status === 'handoff' || right.status === 'captain_assigned' || right.status === 'captain_arriving';
        if (leftNeeds !== rightNeeds) return leftNeeds ? -1 : 1;

        const leftSla = left.slaRisk ? 1 : 0;
        const rightSla = right.slaRisk ? 1 : 0;
        if (leftSla !== rightSla) return rightSla - leftSla;

        return right.createdAtLabel.localeCompare(left.createdAtLabel, 'ar');
      }

      if (sortMode === 'priority') {
        const leftScore = left.priority === 'high' ? 3 : left.priority === 'normal' ? 2 : 1;
        const rightScore = right.priority === 'high' ? 3 : right.priority === 'normal' ? 2 : 1;
        return rightScore - leftScore;
      }

      if (sortMode === 'sla') {
        const leftScore = left.slaRisk ? 1 : 0;
        const rightScore = right.slaRisk ? 1 : 0;
        if (leftScore !== rightScore) return rightScore - leftScore;
        return right.createdAtLabel.localeCompare(left.createdAtLabel, 'ar');
      }

      return right.createdAtLabel.localeCompare(left.createdAtLabel, 'ar');
    });
  }, [items, normalizedQuery, selectedQuickFilters, selectedStage, sortMode]);

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

  const handleClearFilters = React.useCallback(() => {
    setQuery('');
    setSelectedStage('all');
    setSelectedQuickFilters([]);
    setSortMode('next_action');
  }, []);

  const hasActiveFilters = query.trim().length > 0 || selectedStage !== 'all' || selectedQuickFilters.length > 0 || sortMode !== 'next_action';
  const activeFiltersCount = selectedQuickFilters.length + (selectedStage !== 'all' ? 1 : 0) + (sortMode !== 'next_action' ? 1 : 0);

  const renderActiveTokens = () => {
    const tokens: Array<{ id: string; label: string; onRemove: () => void }> = [];

    if (selectedStage !== 'all') {
      const label = stageFilters.find((s) => s.id === selectedStage)?.label ?? '';
      tokens.push({
        id: `stage-${selectedStage}`,
        label: `مرحلة: ${label}`,
        onRemove: () => setSelectedStage('all'),
      });
    }

    selectedQuickFilters.forEach((qf) => {
      const label = quickFilters.find((f) => f.id === qf)?.label ?? '';
      tokens.push({
        id: `qf-${qf}`,
        label,
        onRemove: () => setSelectedQuickFilters((current) => current.filter((x) => x !== qf)),
      });
    });

    if (sortMode !== 'next_action') {
      const label = sortModes.find((s) => s.id === sortMode)?.label ?? '';
      tokens.push({
        id: `sort-${sortMode}`,
        label: `ترتيب: ${label}`,
        onRemove: () => setSortMode('next_action'),
      });
    }

    if (tokens.length === 0) return null;

    return (
      <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap', alignItems: 'center' }} gap={2} paddingVertical={2}>
        {tokens.map((token) => (
          <Chip
            key={token.id}
            label={`${token.label} ×`}
            onPress={token.onRemove}
            selected
            tone="brand"
          />
        ))}
        {tokens.length > 1 || query.trim().length > 0 ? (
          <Button
            label="مسح الكل"
            size="sm"
            tone="ghost"
            fullWidth={false}
            onPress={handleClearFilters}
          />
        ) : null}
      </Box>
    );
  };

  if (state !== 'ready') {
    return renderState(state, onRetry);
  }

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
    const action = resolveOrderAction(item.status);
    if (action === 'accept') {
      setAcceptingOrderId(item.id);
      setAcceptSheetVisible(true);
      return;
    }
    onOpenOrderAction?.(action, item.id);
  }

  return (
    <>
      <MobileScrollView fill padding={4} gap={3} contentContainerStyle={{ paddingBottom: 112 }}>

        {/* ─── Summary chips strip ─────────────────────────────── */}
        <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2} paddingVertical={2}>
          <Chip label={`${summary.active} نشطة`} tone="brand" selected />
          <Chip label={`${summary.urgent} عاجلة`} tone="warning" />
          <Chip label={`${summary.needsAction} تحتاج إجراء`} tone="info" />
          {summary.issues > 0 ? <Chip label={`${summary.issues} مشاكل`} tone="danger" /> : null}
        </Box>

        {/* ─── Search + filter header ──────────────────────────── */}
        <Surface tone="raised" padding={3} gap={2}>
          <Box layoutDirection="row" justify="space-between" align="center" style={{ flexDirection: resolveRowDirection(direction) }}>
            <Box style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center' }} gap={2}>
              {searchMode && (
                <Button
                  label="←"
                  size="sm"
                  tone="ghost"
                  fullWidth={false}
                  onPress={onCloseSearch}
                />
              )}
              <Text role="label">بحث الطلبات</Text>
            </Box>
            {hasActiveFilters && (
              <Button
                label="مسح"
                size="sm"
                tone="ghost"
                fullWidth={false}
                onPress={handleClearFilters}
              />
            )}
          </Box>
          <Box layoutDirection="row" gap={2} style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center' }}>
            <Box style={{ flex: 1 }}>
              <SearchField
                label=""
                value={query}
                onChangeText={setQuery}
                placeholder="رقم الطلب، العميل، الفرع، الحالة"
              />
            </Box>
            <Button
              label={`فلترة${activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}`}
              tone={activeFiltersCount > 0 ? 'primary' : 'secondary'}
              size="md"
              fullWidth={false}
              onPress={() => setAdvancedPanelVisible(true)}
            />
          </Box>
          {renderActiveTokens()}
        </Surface>

        {/* ─── Stage chip rail — with per-stage count ───────────── */}
        <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2} paddingHorizontal={1} paddingVertical={1}>
          {stageFilters.map((filter) => {
            const count = filter.id === 'all' ? items.length : (stageCounts[filter.id] ?? 0);
            const label = filter.id === 'all' ? `الكل ${count}` : count > 0 ? `${filter.label} ${count}` : filter.label;
            return (
              <Chip
                key={filter.id}
                label={label}
                selected={selectedStage === filter.id}
                tone={filter.tone}
                onPress={() => setSelectedStage(filter.id)}
              />
            );
          })}
        </Box>

        {/* ─── Order list ──────────────────────────────────────── */}
        <Surface tone="default" padding={3} gap={3}>
          <Text role="bodySm" tone="muted">
            {filteredItems.length === 0
              ? 'لا توجد نتائج مطابقة.'
              : `${filteredItems.length} طلبات ضمن الفلاتر الحالية`}
          </Text>

          {filteredItems.length === 0 ? (
            <StateView
              stateId="empty"
              title="لا توجد طلبات مطابقة"
              description="غيّر المرحلة أو امسح الفلاتر النشطة لترى طلبات أخرى."
              actionLabel="مسح الفلاتر"
              onActionPress={handleClearFilters}
            />
          ) : (
            <Box gap={3}>
              {filteredItems.map((item) => (
                <OrderCard
                  key={item.id}
                  item={item}
                  direction={direction}
                  onPrimaryAction={() => openPrimaryAction(item)}
                  onViewDetails={() => openOrderDetail(item.id)}
                  onQuickView={() => openQuickView(item.id)}
                />
              ))}
            </Box>
          )}
        </Surface>

      </MobileScrollView>

      {/* ─── Quick view sheet ─────────────────────────────────── */}
      <SheetFrame visible={detailsVisible} title={selectedOrder ? `معاينة ${selectedOrder.orderCode}` : 'معاينة الطلب'} onClose={() => setDetailsVisible(false)}>
        {selectedOrder ? (
          <Box gap={3}>
            <Box gap={1}>
              <Text role="titleSm">{selectedOrder.customerName}</Text>
              <Text role="bodySm" tone="muted">{selectedOrder.branchLabel} · {selectedOrder.orderTypeLabel}</Text>
            </Box>
            <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
              <Chip label={resolveStatusLabel(selectedOrder.status)} tone={resolveStatusTone(selectedOrder.status)} selected />
              <Chip label={selectedOrder.amountLabel} tone="success" />
              {selectedOrder.priority === 'high' ? <Chip label="أولوية عالية" tone="danger" /> : null}
              {selectedOrder.slaRisk ? <Chip label={selectedOrder.slaLabel ?? 'SLA قريب'} tone="danger" /> : null}
            </Box>
            {selectedOrder.itemsSummaryLabel ? (
              <Text role="bodySm" tone="muted">{selectedOrder.itemsCountLabel}: {selectedOrder.itemsSummaryLabel}</Text>
            ) : (
              <Text role="bodySm" tone="muted">{selectedOrder.itemsCountLabel}</Text>
            )}
            {selectedOrder.paymentLabel ? (
              <Text role="bodySm" tone="muted">الدفع: {selectedOrder.paymentLabel}</Text>
            ) : null}
            <Text role="bodySm" tone="muted">الإجراء التالي: {selectedOrder.nextActionLabel}</Text>
            <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
              <Button label={selectedOrder.nextActionLabel} fullWidth={false} onPress={() => openPrimaryAction(selectedOrder)} />
              <Button label="فتح التفاصيل" tone="secondary" fullWidth={false} onPress={() => openOrderDetail(selectedOrder.id)} />
            </Box>
          </Box>
        ) : null}
      </SheetFrame>

      {/* ─── Advanced filters sheet ───────────────────────────── */}
      <SheetFrame
        visible={advancedPanelVisible}
        title="الفلاتر المتقدمة والترتيب"
        onClose={() => setAdvancedPanelVisible(false)}
      >
        <Box gap={4}>
          <Box gap={2}>
            <Text role="titleSm">تصفية حسب الخصائص</Text>
            <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
              {quickFilters.map((filter) => {
                const isSelected = selectedQuickFilters.includes(filter.id);
                return (
                  <Chip
                    key={filter.id}
                    label={filter.label}
                    selected={isSelected}
                    tone="brand"
                    onPress={() => {
                      setSelectedQuickFilters((current) =>
                        isSelected
                          ? current.filter((x) => x !== filter.id)
                          : [...current, filter.id]
                      );
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          <Box gap={2}>
            <Text role="titleSm">الترتيب</Text>
            <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
              {sortModes.map((item) => (
                <Chip
                  key={item.id}
                  label={item.label}
                  selected={sortMode === item.id}
                  tone="brand"
                  onPress={() => setSortMode(item.id)}
                />
              ))}
            </Box>
          </Box>

          <Box layoutDirection="row" gap={2} style={{ flexDirection: resolveRowDirection(direction), marginTop: 8 }}>
            <Button
              label="تطبيق"
              style={{ flex: 1 }}
              onPress={() => setAdvancedPanelVisible(false)}
            />
            {hasActiveFilters && (
              <Button
                label="مسح الكل"
                tone="secondary"
                style={{ flex: 1 }}
                onPress={() => {
                  handleClearFilters();
                  setAdvancedPanelVisible(false);
                }}
              />
            )}
          </Box>
        </Box>
      </SheetFrame>

      {/* ML-016: AcceptanceTimerSheet — confirms acceptance before calling onOpenOrderAction */}
      <AcceptanceTimerSheet
        visible={acceptSheetVisible}
        orderCode={filteredItems.find((o) => o.id === acceptingOrderId)?.orderCode ?? ''}
        onConfirm={() => {
          setAcceptSheetVisible(false);
          if (acceptingOrderId) onOpenOrderAction?.('accept', acceptingOrderId);
          setAcceptingOrderId(null);
        }}
        onDecline={() => {
          setAcceptSheetVisible(false);
          setAcceptingOrderId(null);
        }}
      />
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
        orderMode: 'partner_delivery',
        itemsCountLabel: '1 عنصر',
        amountLabel: '—',
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

export type OrderDetailScreenProps = PartnerOrderDetailScreenProps;
export { PartnerOrderDetailScreen as OrderDetailScreen };

// ML-016: AcceptanceTimerSheet — partner confirms order acceptance before SLA timer expires
export function AcceptanceTimerSheet({ visible, orderCode, onConfirm, onDecline }: { visible: boolean; orderCode: string; onConfirm: () => void; onDecline: () => void }) {
  if (!visible) return null;
  return (
    <SheetFrame visible={visible} title="قبول الطلب" onClose={onDecline}>
      <Box gap={3}>
        <Box gap={1}>
          <Text role="titleSm">الطلب: {orderCode}</Text>
          <Text role="bodySm" tone="muted">يُرجى تأكيد الاستلام قبل انتهاء مهلة القبول. الرفض يُعيد الطلب للتوزيع.</Text>
        </Box>
        <Box gap={2}>
          <Button label="قبول الطلب" onPress={onConfirm} />
          <Button label="رفض" tone="secondary" onPress={onDecline} />
        </Box>
      </Box>
    </SheetFrame>
  );
}

export type OrdersInboxScreenProps = PartnerOrdersInboxScreenProps;

export function OrdersInboxScreen(props: OrdersInboxScreenProps) {
  return <PartnerOrdersInboxScreen {...props} />;
}

export default OrdersInboxScreen;
