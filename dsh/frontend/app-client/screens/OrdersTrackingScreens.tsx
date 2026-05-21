import React from 'react';
import { Dimensions, Platform, Pressable, View } from 'react-native';
// Removed Ionicons import
import {
  Badge,
  Box,
  Button,
  CompactStatusStepper,
  Icon,
  Card,
  Chip,
  DeferredReviewBlock,
  Divider,
  KeyValueDetails,
  KeyValueList,
  ListItem,
  MobileScrollView,
  OperationalStatusHero,
  OrderLinkedChat,
  SearchTopBar,
  SectionHeader,
  StatCard,
  StickyActionBar,
  TextField,
  Surface,
  Text,
  TopBar,
  radius,
  safeArea,
  spacing,
  ActionStrip,
  useTheme,
} from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../parts/OperationScreen';
import { CancelOrderSheet } from '../sheets/CancelOrderSheet';
import { getDshClientStateMeta, type DshClientState } from '../data/client-state.preview-data';
import type {
  DshClientAddressSnapshot,
  DshClientCreateOrderRequest,
  DshClientDeliveryLifecycleStatus,
  DshClientEventTimelineItem,
  DshClientExceptionReason,
  DshClientFulfillmentModeSnapshot,
  DshClientHandoffVerification,
  DshClientProofOfDeliveryVisibility,
  DshClientServiceabilityQuote,
  DshClientWalletImpactVisibility,
  DshFulfillmentDeliveryMode,
  getDshClientFlowPolicy,
} from '../contracts/dsh-client-binding.contracts';
import type { DshSmartProximityState, DshSmartTrackingSnapshot } from '../../shared/dsh-order-journey.model';
import { getDshFlowPolicySummary } from '../../shared/dsh-flow-registry';

function resolveClientPolicyChipLabel(policy: ReturnType<typeof getDshClientFlowPolicy>): string {
  if (policy === 'summary-only') {
    return 'ملخص أولًا';
  }

  if (policy === 'detail-on-open') {
    return 'تفاصيل عند الفتح';
  }

  if (policy === 'evidence-on-open') {
    return 'أدلة عند الفتح';
  }

  if (policy === 'chat-on-open') {
    return 'دردشة عند الفتح';
  }

  if (policy === 'finance-preview-only') {
    return 'مالي للقراءة فقط';
  }

  return 'سياسة غير محددة';
}

function resolveEscalationOwnerLabel(ownerSurface?: string): string {
  if (ownerSurface === 'control-panel') {
    return 'لوحة التحكم المركزية';
  }

  if (ownerSurface === 'app-field') {
    return 'الفريق الميداني';
  }

  if (ownerSurface === 'app-captain') {
    return 'فريق الكابتن';
  }

  if (ownerSurface === 'app-client') {
    return 'واجهة العميل';
  }

  return ownerSurface ?? 'غير محدد';
}

type CreateOrderValues = Pick<
  DshClientCreateOrderRequest,
  'fulfillmentMode' | 'pickupAddress' | 'dropoffAddress' | 'contactName' | 'contactPhone' | 'note'
>;

type DshOrderListItem = {
  id: string;
  orderNumber: string;
  title: string;
  statusLabel: string;
  timestamp: string;
  total?: string;
  isActive?: boolean;
  fulfillmentMode?: DshFulfillmentDeliveryMode;
  rawStatus?: DshClientState;
  summary?: string;
  location?: string;
};

type DshTrackingTimelineItem = {
  id: string;
  title: string;
  detail: string;
  done: boolean;
};

type JourneyStep = {
  id: string;
  title: string;
  detail: string;
};

type JourneyPhase = 'route' | 'arrived' | 'received';

type OrderChatAttachmentKind = 'voice' | 'camera' | 'video' | 'attachment';

type OrderChatAttachment = {
  kind: OrderChatAttachmentKind;
  label: string;
  selectedLabel: string;
  detail: string;
  tone: 'brand' | 'info' | 'warning';
  iconName: string;
};

type OrderChatMessage = {
  id: string;
  senderLabel: string;
  body: string;
  time: string;
  tone: 'brand' | 'info' | 'warning';
  align: 'start' | 'end' | 'center';
  attachments?: OrderChatAttachmentKind[];
};

export type DshOrdersListScreenProps = {
  items?: DshOrderListItem[];
  query?: string;
  onQueryChange?: (query: string) => void;
  onOpenOrder?: (orderId: string) => void;
  onReorder?: (orderId: string) => void;
  onBack?: () => void;
  onRetry?: () => void;
  onNextAction?: () => void;
};

export type DshTrackingScreenProps = {
  values?: CreateOrderValues;
  clientState?: DshClientState;
  currentStatusLabel?: string;
  fulfillmentMode?: DshFulfillmentDeliveryMode;
  timeline?: DshTrackingTimelineItem[];
  onSupport?: () => void;
  onRetry?: () => void;
  onNextAction?: () => void;
  onReorder?: () => void;
  onCancelOrder?: () => void;
};

type DshFlowHubScreenProps = {
  screenId?: string;
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export type DshIntakeHubScreenProps = DshFlowHubScreenProps;


const defaultCreateOrderValues: CreateOrderValues = {
  fulfillmentMode: 'bthwani_delivery',
  pickupAddress: 'رياض بارك، البوابة 2',
  dropoffAddress: 'العليا، طريق الملك فهد',
  contactName: 'أحمد',
  contactPhone: '770000000',
  note: 'لا توجد ملاحظات',
};

const FULL_JOURNEY_STEPS: JourneyStep[] = [
  { id: 'order_submitted', title: 'تم تقديم الطلب', detail: 'الطلب بانتظار مراجعة فريق العمليات.' },
  { id: 'operations_review', title: 'مراجعة العمليات', detail: 'يراجع فريق العمليات الطلب قبل التأكيد.' },
  { id: 'operations_approved', title: 'اعتماد العمليات', detail: 'تمت الموافقة على الطلب.' },
  { id: 'order_received', title: 'استلم المتجر', detail: 'استلم المتجر الطلب وبدأ التجهيز.' },
  { id: 'preparing', title: 'قيد التجهيز', detail: 'يجهّز المتجر الطلب.' },
  { id: 'ready_for_pickup', title: 'جاهز للاستلام', detail: 'الطلب جاهز في المتجر.' },
  { id: 'captain_assigned', title: 'تم تعيين الكابتن', detail: 'كابتن مكلّف وهو في طريقه للاستلام.' },
  { id: 'picked_up', title: 'استلم الكابتن الطلب', detail: 'الطلب مع الكابتن متجهًا نحوك.' },
  { id: 'enroute_to_customer', title: 'في الطريق إليك', detail: 'الطلب في الطريق. تحديث كل 3 دقائق بدون خريطة حية.' },
  { id: 'near_customer', title: 'الطلب قريب منك', detail: 'على مقربة من موقعك.' },
  { id: 'at_door', title: 'وصل إلى موقع التسليم', detail: 'وصل إلى موقع التسليم.' },
  { id: 'bell_rang', title: 'تم قرع الجرس', detail: 'أُرسل إشعار الوصول. استعد لاستلام طلبك.' },
  { id: 'delivered', title: 'تم التسليم', detail: 'استلمت طلبك. شكرًا لاستخدام بثواني.' },
];

function getStepModeOverride(stepId: string, mode: DshFulfillmentDeliveryMode): { title: string; detail: string } | null {
  if (mode === 'bthwani_delivery') {
    const overrides: Partial<Record<string, { title: string; detail: string }>> = {
      ready_for_pickup: { title: 'جاهز للاستلام', detail: 'الطلب جاهز، الكابتن في الطريق.' },
      captain_assigned: { title: 'تم تعيين الكابتن', detail: 'كابتن مكلّف وهو في طريقه للاستلام.' },
      picked_up: { title: 'استلم الكابتن الطلب', detail: 'الطلب مع الكابتن متجهًا نحوك.' },
      enroute_to_customer: { title: 'في الطريق إليك', detail: 'الطلب في الطريق مع الكابتن. تحديث كل 3 دقائق.' },
      near_customer: { title: 'الطلب قريب منك', detail: 'الكابتن على مقربة من موقعك.' },
      at_door: { title: 'الكابتن عند بابك', detail: 'وصل الكابتن إلى موقع التسليم.' },
      bell_rang: { title: 'تم قرع الجرس', detail: 'الكابتن أرسل إشعار وصوله. استعد لاستلام طلبك.' },
    };
    return overrides[stepId] ?? null;
  }
  if (mode === 'partner_delivery') {
    const overrides: Partial<Record<string, { title: string; detail: string }>> = {
      ready_for_pickup: { title: 'جاهز للاستلام', detail: 'الطلب جاهز، بانتظار موصل المتجر.' },
      captain_assigned: { title: 'تم تعيين موصل المتجر', detail: 'موصل المتجر مكلّف وهو في طريقه.' },
      picked_up: { title: 'استلم موصل المتجر الطلب', detail: 'الطلب مع موصل المتجر متجهًا نحوك.' },
      enroute_to_customer: { title: 'في الطريق إليك', detail: 'موصل المتجر في الطريق. تحديث كل 3 دقائق.' },
      near_customer: { title: 'الطلب قريب منك', detail: 'موصل المتجر على مقربة من موقعك.' },
      at_door: { title: 'موصل المتجر عند بابك', detail: 'وصل موصل المتجر إلى موقع التسليم.' },
      bell_rang: { title: 'تم قرع الجرس', detail: 'أُرسل إشعار الوصول. استعد لاستلام طلبك.' },
    };
    return overrides[stepId] ?? null;
  }
  if (mode === 'pickup') {
    const overrides: Partial<Record<string, { title: string; detail: string }>> = {
      ready_for_pickup: { title: 'الطلب جاهز للاستلام', detail: 'توجه إلى المتجر لاستلام طلبك.' },
      captain_assigned: { title: 'بانتظار استلامك', detail: 'الطلب محفوظ بانتظار وصولك للمتجر.' },
      picked_up: { title: 'تأكيد من المتجر', detail: 'المتجر جاهز لتسليمك الطلب.' },
      enroute_to_customer: { title: 'في الطريق إلى المتجر', detail: 'يرجى التوجه إلى المتجر مباشرة.' },
      near_customer: { title: 'على وشك الوصول', detail: 'يبدو أنك قريب من المتجر.' },
      at_door: { title: 'استلم طلبك', detail: 'أنت عند المتجر. أبرز رقم طلبك للاستلام.' },
      bell_rang: { title: 'تأكيد الاستلام', detail: 'انتظر تأكيد المتجر لاستلامك للطلب.' },
    };
    return overrides[stepId] ?? null;
  }
  return null;
}

function lifecycleToStepId(status: DshClientDeliveryLifecycleStatus): string {
  switch (status) {
    case 'quote':
    case 'created': return 'order_submitted';
    case 'confirmed': return 'operations_review';
    case 'operations_approved': return 'operations_approved';
    case 'order_received':
    case 'partner_accepted': return 'order_received';
    case 'preparing': return 'preparing';
    case 'ready_for_pickup': return 'ready_for_pickup';
    case 'captain_assigned':
    case 'enroute_to_pickup':
    case 'arrived_at_pickup': return 'captain_assigned';
    case 'picked_up': return 'picked_up';
    case 'enroute_to_dropoff': return 'enroute_to_customer';
    case 'near_customer': return 'near_customer';
    case 'at_door': return 'at_door';
    case 'bell_rang': return 'bell_rang';
    case 'arrived_at_dropoff':
    case 'delivered': return 'delivered';
    default: return 'order_submitted';
  }
}

const orderChatAttachmentOptions: Record<OrderChatAttachmentKind, OrderChatAttachment> = {
  camera: {
    kind: 'camera',
    label: 'كاميرا',
    selectedLabel: 'صورة مرفقة',
    detail: 'إرسال صورة مرتبطة مباشرة بالطلب الحالي.',
    tone: 'brand',
    iconName: 'camera-outline',
  },
  video: {
    kind: 'video',
    label: 'فيديو',
    selectedLabel: 'فيديو مرفق',
    detail: 'إرسال فيديو قصير يوضح حالة الطلب.',
    tone: 'info',
    iconName: 'videocam-outline',
  },
  voice: {
    kind: 'voice',
    label: 'صوت',
    selectedLabel: 'رسالة صوتية',
    detail: 'إرسال رسالة صوتية مرتبطة بنفس الطلب.',
    tone: 'warning',
    iconName: 'mic-outline',
  },
  attachment: {
    kind: 'attachment',
    label: 'مرفق',
    selectedLabel: 'مرفق مرتبط',
    detail: 'إضافة مرفق مرجعي داخل سياق الطلب.',
    tone: 'brand',
    iconName: 'attach-outline',
  },
};

const fallbackOrderListItems: DshOrderListItem[] = [
  {
    id: 'order-active',
    orderNumber: '3770281',
    title: 'شاورما هليل',
    statusLabel: 'جاري التوصيل',
    timestamp: '2026-05-17T22:15:30+03:00',
    isActive: true,
    fulfillmentMode: 'bthwani_delivery',
    rawStatus: 'tracking_active',
    total: '4,500 ر.ي',
    summary: '٢ وجبة شاورما هليل كلاسيك، ١ بطاطس عائلي، ١ عصير برتقال',
    location: 'المنزل',
  },
  {
    id: 'order-review',
    orderNumber: '3770198',
    title: 'مطعم القلعة',
    statusLabel: 'قيد المراجعة',
    timestamp: '2026-05-17T21:46:43+03:00',
    isActive: true,
    fulfillmentMode: 'partner_delivery',
    rawStatus: 'order_created',
    total: '12,000 ر.ي',
    summary: '١ كبسة لحم حاشي، ٢ كولا، ١ سلطة حارة',
    location: 'العمل',
  },
  {
    id: 'order-done',
    orderNumber: '3768910',
    title: 'شاورمر',
    statusLabel: 'تم التسليم',
    timestamp: '2026-05-16T19:30:00+03:00',
    isActive: false,
    fulfillmentMode: 'bthwani_delivery',
    rawStatus: 'delivered',
    total: '8,400 ر.ي',
    summary: '٣ وجبة شاورما عربي، ١ بطاطس تويستر كبير',
    location: 'المنزل',
  },
  {
    id: 'order-pickup-ready',
    orderNumber: '3768800',
    title: 'دانكن دونتس',
    statusLabel: 'جاهز للاستلام',
    timestamp: '2026-05-16T11:00:00+03:00',
    isActive: false,
    fulfillmentMode: 'pickup',
    rawStatus: 'delivered',
    total: '3,500 ر.ي',
    summary: '٦ حبات دونات مشكل، ١ قهوة باردة كبيرة',
    location: 'فرع التحرير',
  },
  {
    id: 'order-failed',
    orderNumber: '3765100',
    title: 'بارنز كافيه',
    statusLabel: 'فشل الدفع',
    timestamp: '2026-05-15T09:15:00+03:00',
    isActive: false,
    fulfillmentMode: 'bthwani_delivery',
    rawStatus: 'failed',
    total: '2,800 ر.ي',
    summary: '١ قهوة تركية، ١ دونات زعتر',
    location: 'العمل',
  },
];

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function normalizeClientFacingOrderState(clientState: DshClientState): DshClientState {
  if (
    clientState === 'quote'
    || clientState === 'serviceability'
    || clientState === 'checkout_ready'
    || clientState === 'payment_pending'
    || clientState === 'payment_failed'
    || clientState === 'item_unavailable'
    || clientState === 'area_unserviceable'
  ) {
    return 'order_created';
  }

  return clientState;
}

function StageRail({ activeStepId, steps }: { activeStepId: string; steps: JourneyStep[] }) {
  const { theme } = useTheme();
  const activeIndex = Math.max(0, steps.findIndex((step) => step.id === activeStepId));

  return (
    <Box gap={3}>
      {steps.map((step, index) => {
        const isDone = index < activeIndex;
        const isActive = index === activeIndex;
        const indicatorTone = isActive ? theme.brand : isDone ? theme.success : theme.line;

        return (
          <Box key={step.id} layoutDirection="row" gap={3} align="center" style={{ flexDirection: 'row-reverse' }}>
            <Box style={{ width: 32, alignItems: 'center' }}>
              <Surface
                tone={isActive ? 'brand' : isDone ? 'success' : 'default'}
                padding={0}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: indicatorTone,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: isActive ? 0.6 : 0,
                  shadowRadius: 6,
                  elevation: isActive ? 4 : 0,
                }}
              >
                {isDone ? (
                  <Icon name="checkmark-sharp" size={16} color={theme.brandContrast} />
                ) : (
                  <Text
                    role="bodyStrong"
                    style={{
                      color: isActive ? theme.brandContrast : theme.textSoft,
                      fontSize: 13,
                    }}
                  >
                    {index + 1}
                  </Text>
                )}
              </Surface>
              {index < steps.length - 1 ? (
                <View
                  style={{
                    width: 2,
                    flex: 1,
                    minHeight: 32,
                    marginTop: 6,
                    marginBottom: -6,
                    backgroundColor: isDone ? theme.success : theme.line,
                    opacity: isDone ? 1 : 0.4,
                  }}
                />
              ) : null}
            </Box>

            <Surface
              tone={isActive ? 'brand' : 'raised'}
              padding={3}
              radiusToken="xl"
              style={{
                flex: 1,
                borderWidth: isActive ? 1.5 : 1,
                borderColor: isActive ? theme.brand : theme.line,
                backgroundColor: isActive ? theme.brandSurface : theme.surfaceRaised,
                transform: [{ scale: isActive ? 1.02 : 1 }],
              }}
            >
              <Box layoutDirection="row" justify="space-between" align="center" style={{ flexDirection: 'row-reverse' }}>
                <Box gap={0} style={{ flex: 1 }}>
                  <Text role="titleSm" style={{ textAlign: 'right', color: isActive ? theme.brand : theme.text }}>
                    {step.title}
                  </Text>
                  <Text role="bodySm" tone={isActive ? 'default' : 'muted'} style={{ textAlign: 'right' }}>
                    {step.detail}
                  </Text>
                </Box>
                {isActive && (
                  <Box
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.brand,
                      marginLeft: 8,
                    }}
                  />
                )}
              </Box>
            </Surface>
          </Box>
        );
      })}
    </Box>
  );
}

function formatOrderTime(isoString: string) {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoString;
  }
}

function formatRelativeTime(isoString: string): string {
  try {
    const now = new Date('2026-05-17T22:26:43+03:00');
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;

    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) {
      if (diffHours === 1) return 'منذ ساعة';
      if (diffHours === 2) return 'منذ ساعتين';
      return `منذ ${diffHours} ساعات`;
    }
    if (diffDays === 1) return 'أمس';
    if (diffDays === 2) return 'قبل يومين';
    return d.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
  } catch {
    return isoString;
  }
}

function OrderRow({
  item,
  onOpenOrder,
  onReorder,
  isLast,
}: {
  item: DshOrderListItem;
  onOpenOrder?: (orderId: string) => void;
  onReorder?: (orderId: string) => void;
  isLast?: boolean;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const { theme } = useTheme();

  const resolvedMode: DshFulfillmentDeliveryMode = item.fulfillmentMode ?? 'bthwani_delivery';

  const getFulfillmentLabel = (mode?: string): string => {
    if (mode === 'bthwani_delivery') return 'توصيل بثواني';
    if (mode === 'partner_delivery') return 'توصيل المتجر';
    if (mode === 'pickup') return 'استلم بنفسك';
    return 'توصيل بثواني';
  };

  const formatAmount = (raw?: string): string => {
    if (!raw) return 'مبلغ غير محدد';
    const normalized = raw.replace('ر.س', 'ر.ي');
    return normalized.replace(/(\d+)\.00\s*(ر\.ي)/, '$1 $2');
  };

  const displayOrderNumber = item.orderNumber || item.id.replace('dsh-', '');

  const summaryText = item.summary
    ? `${item.summary} — ${item.title}`
    : (item.title || 'تفاصيل الطلب غير مكتملة');

  const metaLine = [
    formatAmount(item.total),
    getFulfillmentLabel(resolvedMode),
    item.location?.trim() || null,
  ].filter(Boolean).join(' • ');

  const actionBtnStyle = ({ pressed }: { pressed: boolean }) => ({
    flexDirection: 'row-reverse' as const,
    alignItems: 'center' as const,
    gap: 4,
    borderWidth: 1,
    borderColor: theme.brand,
    backgroundColor: pressed ? theme.brand : theme.brandSurface,
    borderRadius: radius.pill,
    height: 34,
    paddingHorizontal: spacing[3],
  });

  return (
    <ActionStrip
      icon={item.isActive ? 'bicycle-outline' : 'receipt-outline'}
      title={summaryText}
      subtitle={
        <View style={{ alignItems: 'flex-end', gap: spacing[1], marginTop: 2 }}>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {metaLine}
          </Text>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
            <Badge label={item.statusLabel} tone={item.isActive ? 'brand' : 'default'} />
            <Text role="bodySm" tone="muted" style={{ fontSize: 11 }}>#{displayOrderNumber} · {formatRelativeTime(item.timestamp)}</Text>
          </View>
        </View>
      }
      expanded={expanded}
      onPress={() => setExpanded(!expanded)}
      hideDivider={isLast}
    >
      <View style={{ flexDirection: 'row-reverse', gap: spacing[2] }}>
        <Button style={{ flex: 1 }} label={item.isActive ? 'تتبع الطلب' : 'تفاصيل الطلب'} tone={item.isActive ? 'brand' : 'secondary'} size="sm" onPress={() => onOpenOrder?.(item.id)} />
        {(!item.isActive && onReorder) && (
          <Button style={{ flex: 1 }} label="تكرار الطلب" tone="ghost" size="sm" onPress={() => onReorder(item.id)} />
        )}
      </View>
    </ActionStrip>
  );
}

function RatingStars({ value, disabled, onChange }: { value: number; disabled?: boolean; onChange: (nextValue: number) => void }) {
  const { theme } = useTheme();

  return (
    <Box layoutDirection="row" gap={1} style={{ flexDirection: 'row-reverse', justifyContent: 'flex-end', opacity: disabled ? 0.62 : 1 }}>
      {[5, 4, 3, 2, 1].map((score) => {
        const isSelected = score <= value;

        return (
          <Pressable
            key={score}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected, disabled }}
            onPress={() => {
              if (!disabled) {
                onChange(score);
              }
            }}
            style={{ padding: 2 }}
          >
            <Icon name={isSelected ? 'star' : 'star-outline'} size={24} color={isSelected ? theme.warning : theme.textSoft} />
          </Pressable>
        );
      })}
    </Box>
  );
}

function OrderCaptainChatSection({ phase, captainLabel = 'الكابتن المكلّف' }: { phase: 'route' | 'received'; captainLabel?: string; }) {
  const { theme } = useTheme();
  const isClosed = phase === 'received';
  const [draftMessage, setDraftMessage] = React.useState('');
  const [draftAttachments, setDraftAttachments] = React.useState<OrderChatAttachmentKind[]>([]);
  const [chatMessages, setChatMessages] = React.useState<OrderChatMessage[]>(() => [
    {
      id: 'chat-system-1',
      senderLabel: 'نظام الطلب',
      body: 'الدردشة مرتبطة بهذا الطلب فقط وتُغلق بعد التسليم.',
      time: 'الآن',
      tone: 'warning',
      align: 'center',
    },
    {
      id: 'chat-captain-1',
      senderLabel: captainLabel,
      body: 'إذا احتجت صورة أو فيديو أو رسالة صوتية للمنتج، أرسلها هنا وسأرد داخل نفس الطلب.',
      time: 'قبل قليل',
      tone: 'info',
      align: 'start',
      attachments: ['camera', 'video', 'voice'],
    },
  ]);

  const selectedAttachmentCount = draftAttachments.length;
  const canSend = !isClosed && (draftMessage.trim().length > 0 || selectedAttachmentCount > 0);
  const sendButtonLabel = draftMessage.trim().length > 0 ? 'إرسال' : selectedAttachmentCount > 0 ? 'إرسال المرفقات' : 'أضف نصًا أو مرفقًا';

  const toggleAttachment = (kind: OrderChatAttachmentKind) => {
    if (isClosed) {
      return;
    }

    setDraftAttachments((current) => (
      current.includes(kind)
        ? current.filter((item) => item !== kind)
        : [...current, kind]
    ));
  };

  const handleSendMessage = () => {
    if (!canSend) {
      return;
    }

    const attachments = draftAttachments.slice();

    setChatMessages((current) => ([
      ...current,
      {
        id: `chat-client-${Date.now()}`,
        senderLabel: 'العميل',
        body: draftMessage.trim() || 'مرفقات مرتبطة بهذا الطلب',
        time: 'الآن',
        tone: 'brand',
        align: 'end',
        attachments,
      },
    ]));

    setDraftMessage('');
    setDraftAttachments([]);
  };

  return (
    <Surface tone="raised" gap={3} padding={2}>
      <SectionHeader
        title="الدردشة مع الكابتن"
        subtitle={isClosed ? 'الدردشة مقفلة بعد التسليم، والسجل فقط ما يزال ظاهرًا.' : 'صوت، كاميرا، وفيديو داخل نفس الصندوق دون ضوضاء إضافية.'}
      />

      <Box gap={1} style={{ alignItems: 'flex-end' }}>
        <Badge label={isClosed ? 'الدردشة مقفلة' : 'مرتبطة بهذا الطلب'} tone={isClosed ? 'warning' : 'brand'} />
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          {isClosed ? 'بعد التسليم يبقى السجل فقط.' : 'اكتب الرسالة وأرفق بسرعة من نفس الصندوق.'}
        </Text>
      </Box>

      <Box gap={2}>
        {chatMessages.map((message) => {
          if (message.align === 'center') {
            return (
              <Surface
                key={message.id}
                tone="inset"
                padding={2}
                gap={1}
                style={{ borderRadius: 18, borderWidth: 1, borderColor: theme.line, backgroundColor: theme.surfaceRaised }}
              >
                <Badge label={message.senderLabel} tone={message.tone} />
                <Text role="bodySm" style={{ textAlign: 'right' }}>{message.body}</Text>
              </Surface>
            );
          }

          const isClient = message.align === 'end';

          return (
            <View key={message.id} style={{ alignSelf: isClient ? 'flex-end' : 'flex-start', width: '88%' }}>
              <Surface
                tone={isClient ? 'brand' : 'raised'}
                padding={2}
                gap={1}
                style={{
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: isClient ? theme.brand : theme.line,
                  backgroundColor: isClient ? theme.brandSurface : theme.surfaceRaised,
                }}
              >
                <Box layoutDirection="row" gap={2} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Badge label={message.senderLabel} tone={message.tone} />
                  <Text role="caption" tone="muted">{message.time}</Text>
                </Box>

                <Text role="bodySm" style={{ textAlign: 'right' }}>{message.body}</Text>

                {message.attachments?.length ? (
                  <Box layoutDirection="row" gap={1} style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {message.attachments.map((attachmentKind) => {
                      const attachment = orderChatAttachmentOptions[attachmentKind];

                      return (
                        <Badge
                          key={`${message.id}-${attachment.kind}`}
                          label={attachment.selectedLabel}
                          tone={attachment.tone}
                        />
                      );
                    })}
                  </Box>
                ) : null}
              </Surface>
            </View>
          );
        })}
      </Box>

      {!isClosed ? (
        <Surface tone="raised" gap={2} padding={2}>
          <Box layoutDirection="row" gap={1} style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {([
              { kind: 'voice', label: 'صوت', iconName: 'mic-outline' as const },
              { kind: 'camera', label: 'كاميرا', iconName: 'camera-outline' as const },
              { kind: 'video', label: 'فيديو', iconName: 'videocam-outline' as const },
            ] as const).map((action) => {
              const isSelected = draftAttachments.includes(action.kind);

              return (
                <Button
                  key={action.kind}
                  label={action.label}
                  tone={isSelected ? 'primary' : 'secondary'}
                  size="sm"
                  fullWidth={false}
                  leadingAccessory={<Icon name={action.iconName as any} size={16} color={isSelected ? theme.brandContrast : theme.text} />}
                  onPress={() => toggleAttachment(action.kind)}
                  style={{ minWidth: 96 }}
                />
              );
            })}
          </Box>

          <TextField
            label="رسالة إلى الكابتن"
            value={draftMessage}
            onChangeText={setDraftMessage}
            placeholder="اكتب رسالتك هنا"
            multiline
            numberOfLines={4}
            style={{ minHeight: 96, textAlignVertical: 'top' }}
          />

          <Button label={canSend ? sendButtonLabel : 'أضف نصًا أو مرفقًا'} onPress={handleSendMessage} disabled={!canSend} />
        </Surface>
      ) : (
        <Surface tone="inset" gap={1} padding={2}>
          <Badge label="الدردشة مقفلة" tone="warning" />
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            لا يمكن إرسال رسائل جديدة بعد التسليم. يبقى السجل هنا للمراجعة فقط.
          </Text>
        </Surface>
      )}
    </Surface>
  );
}

function getClientWalletVisibilityCopy(clientStateMeta: ReturnType<typeof getDshClientStateMeta>) {
  if (clientStateMeta.visibility.walletRefundVisible) {
    return {
      title: 'وضع الاسترداد',
      description: clientStateMeta.state === 'refund_pending'
        ? 'الاسترداد قيد المعالجة حاليًا. لا يلزم أي إجراء مالي إضافي من العميل حتى يكتمل تحديث الحالة.'
        : clientStateMeta.state === 'refunded'
          ? 'تم تثبيت الاسترداد للعميل ويمكنه مراجعة الأثر المالي النهائي بوضوح.'
          : 'توجد معلومة استرداد ظاهرة مرتبطة بهذه الحالة ويجب إبقاؤها واضحة للعميل داخل نفس المسار.',
    };
  }

  if (clientStateMeta.visibility.walletCreditVisible) {
    return {
      title: 'وضع الرصيد',
      description: 'يوجد رصيد ظاهر للعميل داخل المحفظة. هذا العرض يوضح المعلومة فقط من دون تنفيذ أي ربط أو حركة مالية.',
    };
  }

  return null;
}

function formatDeliveryLifecycleStatus(status: DshClientDeliveryLifecycleStatus): string {
  const labels: Record<DshClientDeliveryLifecycleStatus, string> = {
    quote: 'التسعير والجاهزية',
    created: 'تم إنشاء الطلب',
    confirmed: 'قيد مراجعة العمليات',
    operations_approved: 'تمت الموافقة من العمليات',
    order_received: 'استلم المتجر الطلب',
    partner_accepted: 'قبول الشريك',
    preparing: 'قيد التجهيز',
    ready_for_pickup: 'جاهز للاستلام',
    captain_assigned: 'تم تعيين الكابتن',
    enroute_to_pickup: 'في الطريق إلى الاستلام',
    arrived_at_pickup: 'وصل إلى نقطة الاستلام',
    picked_up: 'تم الاستلام من المتجر',
    enroute_to_dropoff: 'في الطريق إلى العميل',
    near_customer: 'الطلب قريب منك',
    at_door: 'الطلب عند بابك',
    bell_rang: 'الكابتن ضغط زر الجرس',
    arrived_at_dropoff: 'وصل إلى العميل',
    delivered: 'تم التسليم',
    cancelled: 'تم الإلغاء',
    failed: 'فشل التنفيذ',
    returned: 'قيد الإرجاع / الاسترداد',
    refund_pending: 'الاسترداد قيد المعالجة',
    refunded: 'تم الاسترداد',
  };

  return labels[status];
}

function formatExceptionReason(reason: DshClientExceptionReason): string {
  const labels: Record<DshClientExceptionReason, string> = {
    store_closed: 'المتجر مغلق',
    item_unavailable: 'العنصر غير متاح',
    customer_unreachable: 'تعذر الوصول إلى العميل',
    address_not_found: 'تعذر العثور على العنوان',
    unable_to_access: 'تعذر الوصول إلى نقطة التسليم',
    captain_no_show: 'الكابتن لم يحضر',
    partner_delay: 'تأخر الشريك',
    payment_failed: 'فشل الدفع',
    system_outage: 'عطل بالنظام',
    area_unserviceable: 'المنطقة خارج التغطية',
    refund_required: 'استرداد مطلوب',
    return_required: 'إرجاع مطلوب',
    redispatch_required: 'إعادة إسناد مطلوبة',
  };

  return labels[reason];
}

function formatProofType(proofType: DshClientProofOfDeliveryVisibility['proof_type']): string {
  const labels: Record<DshClientProofOfDeliveryVisibility['proof_type'], string> = {
    none: 'لا يوجد',
    photo: 'صورة',
    signature: 'توقيع',
    otp: 'OTP',
    pin: 'PIN',
    qr: 'QR',
    barcode: 'Barcode',
  };

  return labels[proofType];
}

function formatVerificationResult(result: DshClientProofOfDeliveryVisibility['verification_result']): string {
  const labels: Record<DshClientProofOfDeliveryVisibility['verification_result'], string> = {
    not_required: 'غير مطلوب',
    pending: 'قيد الانتظار',
    verified: 'تم التحقق',
    failed: 'فشل التحقق',
  };

  return labels[result];
}

function formatFulfillmentMode(mode: DshClientFulfillmentModeSnapshot['mode']): string {
  const labels: Record<DshClientFulfillmentModeSnapshot['mode'], string> = {
    instant: 'فوري',
    scheduled: 'مجدول',
    pickup: 'استلام من المتجر',
    partner_delivery: 'توصيل المتجر',
    bthwani_delivery: 'توصيل بثواني',
  };

  return labels[mode];
}

function formatCapacityState(state: DshClientFulfillmentModeSnapshot['capacity_state']): string {
  const labels: Record<DshClientFulfillmentModeSnapshot['capacity_state'], string> = {
    available: 'متاح',
    limited: 'محدود',
    full: 'ممتلئ',
    paused: 'متوقف مؤقتًا',
  };

  return labels[state];
}

function getDefaultExceptionReason(clientState: DshClientState): DshClientExceptionReason | null {
  if (clientState === 'store_closed') return 'store_closed';
  if (clientState === 'area_unserviceable') return 'area_unserviceable';
  if (clientState === 'item_unavailable') return 'item_unavailable';
  if (clientState === 'payment_failed') return 'payment_failed';
  if (clientState === 'cancelled') return 'refund_required';
  if (clientState === 'failed') return 'redispatch_required';
  if (clientState === 'refund_pending' || clientState === 'refunded') return 'refund_required';
  return null;
}

function buildDefaultServiceabilityQuote(clientState: DshClientState): DshClientServiceabilityQuote {
  const unavailableReason = getDefaultExceptionReason(clientState);
  const insideCoverage = clientState !== 'area_unserviceable';
  const itemsAvailable = clientState !== 'item_unavailable';
  const storeOpen = clientState !== 'store_closed';

  return {
    address_valid: clientState !== 'area_unserviceable',
    inside_coverage: insideCoverage,
    store_open: storeOpen,
    items_available: itemsAvailable,
    delivery_fee: insideCoverage && storeOpen ? 22 : 0,
    eta_pickup: storeOpen ? '2026-05-01T20:05:00+03:00' : null,
    eta_dropoff: insideCoverage && itemsAvailable ? '2026-05-01T20:28:00+03:00' : null,
    quote_expires_at: '2026-05-01T20:15:00+03:00',
    unavailable_reason: unavailableReason,
    fallback_fulfillment_method: insideCoverage ? (itemsAvailable ? null : 'pickup') : 'scheduled',
  };
}

function buildDefaultAddressSnapshot(values: CreateOrderValues): DshClientAddressSnapshot {
  return {
    address_label: values.dropoffAddress || 'غير محدد',
    pin_adjustment: null,
    reverse_lookup_label: `${values.pickupAddress || 'الاستلام'} → ${values.dropoffAddress || 'التسليم'}`,
    delivery_notes: values.note || 'لا توجد ملاحظات',
    building: 'المدخل الرئيسي',
    floor: '1',
    apartment: 'A3',
    landmark: 'بجوار البوابة الرئيسية',
    geocode_confidence: 'medium',
    address_risk_flag: false,
  };
}

function buildDefaultFulfillmentModeSnapshot(clientState: DshClientState): DshClientFulfillmentModeSnapshot {
  return {
    mode: clientState === 'area_unserviceable' ? 'scheduled' : 'bthwani_delivery',
    available_windows: [
      { start_at: '2026-05-01T20:00:00+03:00', end_at: '2026-05-01T20:45:00+03:00', label: 'فوري' },
      { start_at: '2026-05-01T21:00:00+03:00', end_at: '2026-05-01T21:45:00+03:00', label: 'النافذة التالية' },
    ],
    capacity_state: clientState === 'payment_failed' ? 'limited' : clientState === 'area_unserviceable' ? 'paused' : 'available',
    slot_reserved_until: clientState === 'area_unserviceable' ? null : '2026-05-01T20:12:00+03:00',
    store_busy: clientState === 'item_unavailable',
    area_busy: clientState === 'area_unserviceable',
    captain_supply_low: clientState === 'payment_pending',
  };
}

function buildDefaultLifecycleStatus(clientState: DshClientState, phase: JourneyPhase = 'route'): DshClientDeliveryLifecycleStatus {
  if (clientState === 'quote' || clientState === 'serviceability' || clientState === 'area_unserviceable' || clientState === 'item_unavailable' || clientState === 'payment_failed' || clientState === 'checkout_ready' || clientState === 'payment_pending') {
    return 'quote';
  }

  if (clientState === 'order_created') return 'confirmed';
  if (clientState === 'order_confirmed') return 'operations_approved';
  if (clientState === 'cancelled') return 'cancelled';
  if (clientState === 'failed') return 'failed';
  if (clientState === 'refund_pending') return 'returned';
  if (clientState === 'refunded' || clientState === 'wallet_refund_visible') return 'refunded';
  if (clientState === 'delivered') return 'delivered';

  if (phase === 'received') return 'delivered';
  if (phase === 'arrived') return 'at_door';
  return 'enroute_to_dropoff';
}

function buildDefaultEventTimeline(clientState: DshClientState, timeline: DshTrackingTimelineItem[], phase: JourneyPhase = 'route'): DshClientEventTimelineItem[] {
  const fallbackLifecycle = buildDefaultLifecycleStatus(clientState, phase);
  const exceptionReason = getDefaultExceptionReason(clientState);

  if (!timeline.length) {
    return [{
      event_id: `event-${clientState}`,
      order_id: 'dsh-order-active',
      delivery_id: 'dsh-delivery-active',
      actor_id: 'system',
      actor_role: 'system',
      from_status: null,
      to_status: fallbackLifecycle,
      timestamp: '2026-05-01T20:20:00+03:00',
      source: 'system',
      reason_code: exceptionReason,
      notes: getDshClientStateMeta(clientState).description,
      evidence_attachment_optional: null,
    }];
  }

  const statusByStepId: Record<string, DshClientDeliveryLifecycleStatus> = {
    route: 'enroute_to_dropoff',
    arrived: 'at_door',
    received: 'delivered',
  };

  const fallbackStatuses: DshClientDeliveryLifecycleStatus[] = ['enroute_to_dropoff', 'at_door', 'delivered'];

  return timeline.map((item, index) => {
    const toStatus = statusByStepId[item.id] ?? fallbackStatuses[Math.min(index, fallbackStatuses.length - 1)] ?? fallbackLifecycle;
    const previousStatus = index === 0
      ? (clientState === 'tracking_active' || clientState === 'delivered' ? 'picked_up' : null)
      : (statusByStepId[timeline[index - 1]?.id] ?? fallbackStatuses[Math.min(index - 1, fallbackStatuses.length - 1)] ?? null);

    return {
      event_id: `event-${item.id}`,
      order_id: 'dsh-order-active',
      delivery_id: 'dsh-delivery-active',
      actor_id: item.id === 'received' ? 'client' : 'captain-01',
      actor_role: item.id === 'received' ? 'client' : 'captain',
      from_status: previousStatus,
      to_status: toStatus,
      timestamp: `2026-05-01T20:${10 + index * 8}:00+03:00`,
      source: 'system',
      reason_code: index === timeline.length - 1 ? exceptionReason : null,
      notes: item.detail,
      evidence_attachment_optional: item.id === 'received'
        ? {
            asset_id: 'proof-delivered-01',
            asset_type: 'image',
            note: 'إثبات مرتبط بتثبيت التسليم النهائي.',
          }
        : null,
    };
  });
}

function buildDefaultProofOfDelivery(clientState: DshClientState, phase: JourneyPhase = 'route'): DshClientProofOfDeliveryVisibility {
  if (clientState === 'delivered' || phase === 'received') {
    return {
      proof_type: 'none',
      is_required: false,
      captured_by: 'captain',
      captured_at: '2026-05-01T20:30:00+03:00',
      proof_asset_url: null,
      verification_result: 'verified',
      failure_reason: null,
      customer_visible: false,
    };
  }

  if (clientState === 'tracking_active' && phase === 'arrived') {
    return {
      proof_type: 'none',
      is_required: false,
      captured_by: null,
      captured_at: null,
      proof_asset_url: null,
      verification_result: 'not_required',
      failure_reason: null,
      customer_visible: false,
    };
  }

  return {
    proof_type: 'none',
    is_required: false,
    captured_by: null,
    captured_at: null,
    proof_asset_url: null,
    verification_result: 'not_required',
    failure_reason: null,
    customer_visible: false,
  };
}

function buildDefaultHandoffVerification(): DshClientHandoffVerification {
  return {
    pickup_reference: 'PK-DSH-2201',
    pickup_code_or_barcode: 'PICK-2201',
    dropoff_otp: null,
    contactless_allowed: true,
    customer_instructions: 'سلّم الطلب عند الباب واتصل قبل الوصول.',
    partner_instructions: 'ثبّت المطابقة قبل تسليم الكيس النهائي.',
    captain_handoff_notes: 'جرى تثبيت نقطة التسليم في المدخل الرئيسي.',
  };
}

function buildDefaultWalletImpact(clientState: DshClientState): DshClientWalletImpactVisibility | null {
  if (clientState === 'refund_pending') {
    return {
      paid_amount: 148,
      delivery_fee: 22,
      discount: 8,
      wallet_credit: 0,
      wallet_debit: 140,
      refund_pending: 140,
      refund_completed: 0,
      compensation: 12,
      note: 'الاسترداد قيد المعالجة مع تعويض انتظار ظاهر للعميل.',
    };
  }

  if (clientState === 'refunded' || clientState === 'wallet_refund_visible') {
    return {
      paid_amount: 148,
      delivery_fee: 22,
      discount: 8,
      wallet_credit: 140,
      wallet_debit: 140,
      refund_pending: 0,
      refund_completed: 140,
      compensation: 12,
      note: 'اكتمل الأثر المالي النهائي ويمكن للعميل مراجعته من نفس المسار.',
    };
  }

  if (clientState === 'wallet_credit_visible') {
    return {
      paid_amount: 0,
      delivery_fee: 0,
      discount: 0,
      wallet_credit: 45,
      wallet_debit: 0,
      refund_pending: 0,
      refund_completed: 0,
      compensation: 45,
      note: 'تعويض رصيد ظاهر في المحفظة بدون أي ربط تنفيذي إضافي.',
    };
  }

  return null;
}

const SMART_TRACKING_SEQUENCE: DshSmartProximityState[] = ['enroute', 'near_customer', 'at_door', 'bell_rang'];

function useSmartTrackingHeartbeat(phase: JourneyPhase): DshSmartTrackingSnapshot {
  const [state, setState] = React.useState<DshSmartTrackingSnapshot>({
    source: 'captain_heartbeat_demo',
    cadenceMinutes: 3,
    isLiveMap: false,
    lastUpdateMinutesAgo: 1,
    etaMinutes: 12,
    proximityState: 'enroute',
    bellRang: false,
  });

  React.useEffect(() => {
    if (phase === 'received') return;

    const HEARTBEAT_INTERVAL_MS = 3 * 60 * 1000;

    const timer = setInterval(() => {
      setState((prev) => {
        const currentIndex = SMART_TRACKING_SEQUENCE.indexOf(prev.proximityState);
        const nextIndex = phase === 'arrived'
          ? Math.min(currentIndex + 1, SMART_TRACKING_SEQUENCE.length - 1)
          : Math.min(currentIndex, 1);
        const nextProximity = SMART_TRACKING_SEQUENCE[nextIndex] ?? 'enroute';
        const etaDelta = prev.etaMinutes !== null ? Math.max(0, prev.etaMinutes - 3) : null;

        return {
          source: 'captain_heartbeat_demo',
          cadenceMinutes: 3,
          isLiveMap: false,
          lastUpdateMinutesAgo: 0,
          etaMinutes: etaDelta,
          proximityState: nextProximity,
          bellRang: nextProximity === 'bell_rang',
        };
      });
    }, HEARTBEAT_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [phase]);

  return state;
}

function SmartTrackingCard({ phase, smartTracking }: { phase: JourneyPhase; smartTracking: DshSmartTrackingSnapshot }) {
  const { theme } = useTheme();

  const proximityAlert = smartTracking.proximityState === 'bell_rang'
    ? { label: 'تم قرع الجرس — استعد للاستلام', tone: 'brand' as const, icon: 'notifications' as const }
    : smartTracking.proximityState === 'at_door'
      ? { label: 'الطلب عند بابك', tone: 'success' as const, icon: 'home-outline' as const }
      : smartTracking.proximityState === 'near_customer'
        ? { label: 'الطلب قريب منك', tone: 'warning' as const, icon: 'navigate-circle-outline' as const }
        : null;

  const etaText = phase === 'received'
    ? 'تم التسليم'
    : smartTracking.etaMinutes !== null && smartTracking.etaMinutes > 0
      ? `تقريباً ${smartTracking.etaMinutes} دقيقة`
      : smartTracking.etaMinutes === 0
        ? 'وصل الآن'
        : null;

  return (
    <Surface tone="raised" radiusToken="xl" gap={3} padding={3}>
      <Box layoutDirection="row" align="center" justify="space-between" gap={2} style={{ flexDirection: 'row-reverse' }}>
        <Box gap={0.5} style={{ alignItems: 'flex-end', flex: 1 }}>
          <Badge label="متابعة ذكية" tone="brand" />
          <Text role="bodyStrong" style={{ textAlign: 'right' }}>
            {phase === 'received' ? 'تم التسليم بنجاح' : 'متابعة حالة الطلب'}
          </Text>
        </Box>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: theme.brandSurface, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="pulse-outline" size={22} color={theme.brand} />
        </View>
      </Box>

      {proximityAlert ? (
        <Surface tone={proximityAlert.tone as any} gap={2} padding={2}>
          <Box layoutDirection="row" align="center" gap={2} style={{ flexDirection: 'row-reverse' }}>
            <Icon name={proximityAlert.icon} size={20} color={theme.brand} />
            <Text role="bodyStrong" style={{ textAlign: 'right', flex: 1 }}>
              {proximityAlert.label}
            </Text>
          </Box>
        </Surface>
      ) : null}

      <KeyValueList
        items={[
          ...(etaText ? [{ label: 'الوقت التقريبي للوصول', value: etaText, tone: 'success' as const }] : []),
          { label: 'آخر تحديث', value: smartTracking.lastUpdateMinutesAgo === 0 ? 'الآن' : `منذ ${smartTracking.lastUpdateMinutesAgo} دقيقة` },
          { label: 'آلية التحديث', value: 'كل 3 دقائق — بدون خريطة حية' },
        ]}
      />
    </Surface>
  );
}

function getMilestoneIndex(stepId: string): number {
  switch (stepId) {
    case 'order_submitted':
    case 'operations_review':
    case 'operations_approved':
      return 0; // تم الطلب
    case 'order_received':
    case 'preparing':
    case 'ready_for_pickup':
      return 1; // التجهيز
    case 'captain_assigned':
    case 'picked_up':
    case 'enroute_to_customer':
      return 2; // في الطريق
    case 'near_customer':
    case 'at_door':
    case 'bell_rang':
    case 'delivered':
      return 3; // التسليم
    default:
      return 0;
  }
}

function HorizontalMilestones({ activeStepId }: { activeStepId: string }) {
  const { theme } = useTheme();
  const currentMilestone = getMilestoneIndex(activeStepId);

  const milestones = [
    { label: 'تم الطلب', index: 0 },
    { label: 'التجهيز', index: 1 },
    { label: 'في الطريق', index: 2 },
    { label: 'التسليم', index: 3 },
  ];

  return (
    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, width: '100%', position: 'relative' }}>
      {/* Background line */}
      <View style={{ position: 'absolute', top: 22, left: '10%', right: '10%', height: 3, backgroundColor: theme.line, zIndex: 1 }} />
      {/* Progress fill line */}
      <View
        style={{
          position: 'absolute',
          top: 22,
          right: '10%',
          left: `${10 + (3 - currentMilestone) * 26.6}%`,
          height: 3,
          backgroundColor: theme.brand,
          zIndex: 1,
        }}
      />

      {milestones.map((milestone) => {
        const isDone = milestone.index < currentMilestone;
        const isActive = milestone.index === currentMilestone;
        const isPassedOrActive = milestone.index <= currentMilestone;
        const color = isActive ? theme.brand : isDone ? theme.success : theme.textSoft;
        const bulletColor = isActive ? theme.brand : isDone ? theme.success : theme.line;

        return (
          <Box key={milestone.index} align="center" style={{ flex: 1, zIndex: 2 }}>
            <View
              style={{
                width: isActive ? 20 : 14,
                height: isActive ? 20 : 14,
                borderRadius: isActive ? 10 : 7,
                backgroundColor: bulletColor,
                borderWidth: isActive ? 3 : 0,
                borderColor: theme.brandSurface,
                shadowColor: color,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isActive ? 0.4 : 0,
                shadowRadius: 4,
                elevation: isActive ? 3 : 0,
              }}
            />
            <Text
              role="bodySm"
              style={{
                textAlign: 'center',
                marginTop: 8,
                color: isActive ? theme.brand : isPassedOrActive ? theme.text : theme.textSoft,
                fontWeight: isActive ? '700' : '400',
                fontSize: 12,
              }}
            >
              {milestone.label}
            </Text>
          </Box>
        );
      })}
    </View>
  );
}

type CreateOrderJourneyScreenProps = {
  values: CreateOrderValues;
  timeline: DshTrackingTimelineItem[];
  clientState?: DshClientState;
  fulfillmentMode?: DshFulfillmentDeliveryMode;
  onPrimaryAction?: () => void;
  onBack?: () => void;
  onSupport?: () => void;
  onNextAction?: () => void;
  onReorder?: () => void;
  onCancelOrder?: () => void;
  initialPhase?: JourneyPhase;
  currentStatusLabel?: string;
};

function CreateOrderJourneyScreen({ values, timeline, clientState = 'tracking_active', fulfillmentMode, onPrimaryAction, onBack, onSupport, onNextAction, onReorder, onCancelOrder, initialPhase = 'route', currentStatusLabel }: CreateOrderJourneyScreenProps) {
  const { theme } = useTheme();
  const [phase, setPhase] = React.useState<JourneyPhase>(initialPhase);
  const resolvedMode: DshFulfillmentDeliveryMode = fulfillmentMode ?? values.fulfillmentMode ?? 'bthwani_delivery';
  const isBthwaniDelivery = resolvedMode === 'bthwani_delivery';
  const isPartnerDelivery = resolvedMode === 'partner_delivery';
  const isPickup = resolvedMode === 'pickup';
  const deliveryActorLabel = isBthwaniDelivery ? 'الكابتن' : isPartnerDelivery ? 'موصل المتجر' : '';
  const pickupLocationValue = normalizeText(values.pickupAddress).length ? values.pickupAddress : 'موقع المتجر غير محدد';
  const dropoffLocationValue = normalizeText(values.dropoffAddress).length ? values.dropoffAddress : 'غير محدد';
  const journeyRouteValue = `${pickupLocationValue} ← ${dropoffLocationValue}`;
  const [productRating, setProductRating] = React.useState(0);
  const [captainRating, setCaptainRating] = React.useState(0);
  const [ratingsSubmitted, setRatingsSubmitted] = React.useState(false);
  const [draftMessage, setDraftMessage] = React.useState('');
  const [draftAttachments, setDraftAttachments] = React.useState<OrderChatAttachmentKind[]>([]);
  const [isSupportExpanded, setIsSupportExpanded] = React.useState(false);
  const [selectedIssue, setSelectedIssue] = React.useState<string | null>(null);
  const [supportDetailsText, setSupportDetailsText] = React.useState('');
  const [isSupportSubmitted, setIsSupportSubmitted] = React.useState(false);
  const [actionBarHeight, setActionBarHeight] = React.useState(0);
  const [isChatExpanded, setIsChatExpanded] = React.useState(false);
  const [isFinancialDetailsExpanded, setIsFinancialDetailsExpanded] = React.useState(false);
  const [hasAlertedCaptain, setHasAlertedCaptain] = React.useState(false);
  const [supportAttachment, setSupportAttachment] = React.useState<string | null>(null);

  const issueTypes = [
    { id: 'not_received', label: 'لم أستلم الطلب' },
    ...(isBthwaniDelivery
      ? [{ id: 'captain_not_arrived', label: 'الكابتن لم يصل' }]
      : isPartnerDelivery
        ? [{ id: 'courier_not_arrived', label: 'موصل المتجر لم يصل' }]
        : [{ id: 'store_not_ready', label: 'الطلب غير جاهز في المتجر' }]),
    { id: 'missing_items', label: 'الطلب ناقص' },
    { id: 'damaged_product', label: 'المنتج تالف' },
    { id: 'huge_delay', label: 'تأخر كبير' },
    { id: 'payment_issue', label: 'مشكلة دفع' },
    { id: 'other', label: 'أخرى' },
  ];

  const effectiveClientState = normalizeClientFacingOrderState(clientState);

  React.useEffect(() => {
    if (effectiveClientState === 'delivered') {
      setPhase('received');
    }
  }, [effectiveClientState]);

  const smartTracking = useSmartTrackingHeartbeat(phase);
  const [lastChatMessage, setLastChatMessage] = React.useState<OrderChatMessage>({
    id: 'chat-actor-1',
    senderLabel: isBthwaniDelivery ? 'الكابتن المكلّف' : isPartnerDelivery ? 'موصل المتجر' : 'المتجر',
    body: 'إذا احتجت صورة أو فيديو أو رسالة صوتية للمنتج فأرسلها هنا ضمن نفس الطلب.',
    time: 'قبل قليل',
    tone: 'info',
    align: 'start',
    attachments: ['camera', 'video', 'voice'],
  });

  const clientStateMeta = getDshClientStateMeta(effectiveClientState);
  const orderCreatedMeta = getDshClientStateMeta('order_created');
  const orderConfirmedMeta = getDshClientStateMeta('order_confirmed');
  const isDeliveredState = effectiveClientState === 'delivered';
  const isTrackingJourneyState = effectiveClientState === 'tracking_active' || isDeliveredState;
  const isOrderCreationState = effectiveClientState === 'order_created' || effectiveClientState === 'order_confirmed';
  const note = normalizeText(values.note).length ? values.note : 'لا توجد ملاحظات';

  const journeyTopBarTitle = isTrackingJourneyState ? 'متابعة الطلب' : clientStateMeta.title;

  const heroTitle = isTrackingJourneyState
    ? phase === 'route'
      ? isBthwaniDelivery
        ? 'الكابتن في الطريق إليك'
        : isPartnerDelivery
          ? 'الطلب في الطريق مع موصل المتجر'
          : 'طلبك جاهز في المتجر'
      : phase === 'arrived'
        ? isBthwaniDelivery
          ? 'الكابتن وصل إلى موقع التسليم'
          : isPartnerDelivery
            ? 'موصل المتجر وصل إلى موقعك'
            : 'طلبك جاهز للاستلام الآن'
        : isPickup
          ? 'تم استلام الطلب'
          : 'تم تسليم الطلب'
    : clientStateMeta.title;

  const heroSummary = isTrackingJourneyState
    ? phase === 'route'
      ? isBthwaniDelivery
        ? 'طلبك في الطريق مع الكابتن. يمكنك متابعة الوقت التقريبي للوصول بالأسفل.'
        : isPartnerDelivery
          ? 'الطلب في الطريق مع موصل المتجر. يمكنك متابعة الوقت التقريبي بالأسفل.'
          : 'توجه إلى المتجر لاستلام طلبك مباشرة.'
      : phase === 'arrived'
        ? isBthwaniDelivery
          ? 'الكابتن وصل إلى موقع التسليم وهو بانتظارك لتسليم الطلب.'
          : isPartnerDelivery
            ? 'موصل المتجر وصل. استعد لاستلام طلبك.'
            : 'أنت على وشك الاستلام. أبرز رقم طلبك للمتجر.'
        : isPickup
          ? 'تم استلام طلبك من المتجر بنجاح. يمكنك تقييم التجربة أو طلب الدعم إذا واجهت أي مشكلة.'
          : 'تم تسليم الطلب بنجاح. شكراً لك! يمكنك تقييم الخدمة أو طلب الدعم إذا واجهت أي مشكلة.'
    : clientStateMeta.description;

  const lifecycleStatusForSteps = buildDefaultLifecycleStatus(effectiveClientState, phase);
  const activeStepId = lifecycleToStepId(lifecycleStatusForSteps);
  const activeStepIndex = Math.max(0, FULL_JOURNEY_STEPS.findIndex((s) => s.id === activeStepId));
  const journeySteps = isTrackingJourneyState
    ? FULL_JOURNEY_STEPS.map((step, index) => ({
        id: step.id,
        title: step.title,
        state: index < activeStepIndex ? 'done' : index === activeStepIndex ? 'current' : 'next',
      }))
    : [
        { id: 'order-created', title: orderCreatedMeta.label, state: effectiveClientState === 'order_created' ? 'current' as const : 'done' as const },
        { id: 'order-confirmed', title: orderConfirmedMeta.label, state: effectiveClientState === 'order_confirmed' ? 'current' as const : 'next' as const },
      ];

  const nextStepValue = isTrackingJourneyState
    ? phase === 'route'
      ? isBthwaniDelivery
        ? 'انتظر وصول الكابتن لموقعك'
        : isPartnerDelivery
          ? 'انتظر وصول موصل المتجر'
          : 'توجه إلى المتجر لاستلام طلبك'
      : phase === 'arrived'
        ? isBthwaniDelivery
          ? 'استلم طلبك من الكابتن'
          : isPartnerDelivery
            ? 'استلم طلبك من موصل المتجر'
            : 'استلم طلبك من المتجر'
        : isPickup
          ? 'تم استلام طلبك من المتجر'
          : 'طلبك مكتمل بنجاح'
    : clientStateMeta.description;

  const hasClientReceived = phase === 'received' || effectiveClientState === 'delivered';
  const canSubmitRatings = hasClientReceived && (productRating > 0 || captainRating > 0);
  const productRatingLabel = productRating > 0 ? `${productRating}/5` : 'غير محدد';
  const captainRatingLabel = captainRating > 0 ? `${captainRating}/5` : 'غير محدد';
  const proofVisibility = React.useMemo(() => buildDefaultProofOfDelivery(effectiveClientState, phase), [effectiveClientState, phase]);
  const walletImpactVisibility = React.useMemo(() => buildDefaultWalletImpact(effectiveClientState), [effectiveClientState]);
  const trackingFlowPolicy = getDshClientFlowPolicy('client-order-tracking');
  const trackingFlowSummary = getDshFlowPolicySummary('client-order-tracking');
  const issueFlowPolicy = getDshClientFlowPolicy('client-order-issue');
  const issueFlowSummary = getDshFlowPolicySummary('client-order-issue');
  const proofPreviewLabel = proofVisibility.customer_visible && proofVisibility.proof_type !== 'none'
    ? 'متاح من داخل الطلب عند فتحه'
    : 'غير ظاهر تلقائيًا';

  const canSendMessage = phase !== 'received' && (draftMessage.trim().length > 0 || draftAttachments.length > 0);
  const chatSendLabel = draftMessage.trim().length > 0 ? 'إرسال الرسالة' : draftAttachments.length > 0 ? 'إرسال المرفقات' : 'أضف نصًا أو مرفقًا';

  const quickActions = (['camera', 'video', 'voice'] as OrderChatAttachmentKind[]).map((kind) => {
    const opt = orderChatAttachmentOptions[kind];
    const isSelected = draftAttachments.includes(kind);
    return {
      id: kind,
      label: opt.label,
      selected: isSelected,
      disabled: phase === 'received',
      icon: <Icon name={opt.iconName} size={18} color={isSelected ? theme.brandContrast : theme.brand} />,
      onPress: () => {
        if (isSelected) {
          setDraftAttachments(draftAttachments.filter((k) => k !== kind));
        } else {
          setDraftAttachments([...draftAttachments, kind]);
        }
      },
    };
  });

  const productHelperText = phase === 'route'
    ? 'سيظهر تقييم المنتج بعد الاستلام.'
    : phase === 'arrived'
      ? 'سيفتح التقييم بعد تثبيت استلام العميل للطلب.'
    : ratingsSubmitted
      ? 'تم إرسال التقييمين. أي تعديل جديد سيعيد فتح الإرسال.'
      : 'اختر تقييم المنتج من 1 إلى 5 ثم أرسل التقييم بالأسفل.';

  const deliveryActorRatingLabel = isBthwaniDelivery ? 'الكابتن' : isPartnerDelivery ? 'موصل المتجر' : 'المتجر';
  const communicationSummary = isBthwaniDelivery
    ? 'يمكنك مراسلة الكابتن مباشرة داخل الطلب، أو تنبيهه، أو طلب الدعم والمساعدة عند وجود مشكلة.'
    : isPartnerDelivery
      ? 'يمكنك متابعة حالة التوصيل أو مراسلة موصل المتجر أو طلب الدعم عند وجود مشكلة.'
      : 'توجه إلى المتجر لاستلام طلبك، ويمكنك طلب الدعم أو الإبلاغ عن مشكلة عند الحاجة.';
  const chatActionLabel = isBthwaniDelivery ? 'مراسلة الكابتن' : 'مراسلة موصل المتجر';
  const chatTitle = isBthwaniDelivery ? 'الدردشة مع الكابتن' : 'الدردشة مع موصل المتجر';
  const chatInputLabel = isBthwaniDelivery ? 'رسالة إلى الكابتن' : 'رسالة إلى موصل المتجر';
  const heroDetailItems = [
    ...(isPickup
      ? [{ label: 'موقع الاستلام', value: pickupLocationValue }]
      : [{ label: 'المسار', value: journeyRouteValue }]),
    ...(isTrackingJourneyState && phase !== 'received' && !isPickup && smartTracking.etaMinutes !== null
      ? [{ label: 'الوقت التقريبي للوصول', value: smartTracking.etaMinutes > 0 ? `تقريباً ${smartTracking.etaMinutes} دقيقة` : 'وصل الآن', tone: 'success' as const }]
      : []
    ),
    ...(isTrackingJourneyState && phase !== 'received'
      ? [{ label: 'آخر تحديث', value: smartTracking.lastUpdateMinutesAgo === 0 ? 'الآن' : `منذ ${smartTracking.lastUpdateMinutesAgo} دقيقة` }]
      : []
    ),
    { label: 'الإجراء التالي', value: nextStepValue, tone: 'brand' as const },
  ];
  const captainHelperText = phase === 'route'
    ? `سيظهر تقييم ${deliveryActorRatingLabel} بعد الاستلام.`
    : phase === 'arrived'
      ? `سيبقى تقييم ${deliveryActorRatingLabel} مؤجلًا حتى تثبيت الاستلام.`
    : ratingsSubmitted
      ? `تم إرسال التقييمين. يمكنك تعديل ${deliveryActorRatingLabel} ثم إعادة الإرسال.`
      : `اختر تقييم ${deliveryActorRatingLabel} من 1 إلى 5 ثم أرسل التقييم بالأسفل.`;

  const handleProductRatingChange = (nextValue: number) => {
    setProductRating(nextValue);
    if (ratingsSubmitted) {
      setRatingsSubmitted(false);
    }
  };

  const handleCaptainRatingChange = (nextValue: number) => {
    setCaptainRating(nextValue);
    if (ratingsSubmitted) {
      setRatingsSubmitted(false);
    }
  };

  const handlePrimaryAction = () => {
    if (isOrderCreationState) {
      onPrimaryAction?.();
      return;
    }

    if (hasClientReceived) {
      if (ratingsSubmitted) {
        return;
      }
      if (productRating > 0 || captainRating > 0) {
        setRatingsSubmitted(true);
      } else {
        if (onNextAction) onNextAction();
        else if (onBack) onBack();
      }
      return;
    }
  };

  const handleSendMessage = () => {
    if (!canSendMessage) {
      return;
    }

    const body = draftMessage.trim().length
      ? draftMessage.trim()
      : draftAttachments.map((kind) => orderChatAttachmentOptions[kind].selectedLabel).join(' • ');

    setLastChatMessage({
      id: `chat-client-${Date.now()}`,
      senderLabel: 'العميل',
      body,
      time: 'الآن',
      tone: 'brand',
      align: 'end',
      attachments: draftAttachments,
    });
    setDraftMessage('');
    setDraftAttachments([]);
  };

  let primaryAction: { label: string; onPress: () => void; disabled?: boolean } | undefined = undefined;
  let secondaryAction: { label: string; onPress: () => void; tone?: 'secondary' | 'ghost' | 'primary' } | undefined = undefined;
  let stickyNote = '';

  if (isOrderCreationState) {
    primaryAction = {
      label: effectiveClientState === 'order_created' ? 'عرض نجاح الطلب' : 'فتح التتبع',
      onPress: () => {
        onPrimaryAction?.();
      },
    };
    secondaryAction = onBack ? { label: 'العودة إلى السلة', onPress: onBack, tone: 'secondary' } : undefined;
    stickyNote = effectiveClientState === 'order_created'
      ? 'تم إنشاء الطلب. هذه الشاشة مختصرة للتأكيد قبل النجاح ثم التتبع.'
      : 'تم تأكيد الطلب. الإجراء الرئيسي ينقلك إلى التتبع مباشرة.';
  } else if (phase === 'route') {
    primaryAction = undefined;
    secondaryAction = onCancelOrder ? { label: 'إلغاء الطلب', onPress: onCancelOrder, tone: 'secondary' as const } : undefined;
    stickyNote = '';
  } else if (phase === 'arrived') {
    primaryAction = undefined;
    secondaryAction = undefined;
    stickyNote = '';
  } else if (phase === 'received') {
    if (ratingsSubmitted) {
      primaryAction = {
        label: 'تم إرسال التقييم',
        onPress: () => {},
        disabled: true,
      };
    } else if (productRating > 0 || captainRating > 0) {
      primaryAction = {
        label: 'إرسال التقييم',
        onPress: handlePrimaryAction,
      };
    } else {
      primaryAction = {
        label: 'تقييم لاحقًا',
        onPress: handlePrimaryAction,
      };
    }

    secondaryAction = onReorder
      ? { label: 'إعادة الطلب', onPress: onReorder, tone: 'secondary' }
      : {
          label: isSupportExpanded ? 'إغلاق الدعم' : 'الدعم أو الإبلاغ عن مشكلة',
          onPress: () => setIsSupportExpanded(!isSupportExpanded),
          tone: 'secondary',
        };

    stickyNote = ratingsSubmitted
      ? 'تم حفظ التقييم بنجاح. شكراً لك!'
      : `يمكنك تقييم المنتج و${deliveryActorRatingLabel} أو التخطي بالضغط على تقييم لاحقاً.`;
  }

  const reviewStateLabel = phase === 'received' ? (ratingsSubmitted ? 'تم الإرسال' : 'جاهز الآن') : 'مؤجل حتى الاستلام';
  const runtimeBottomInset = Platform.OS === 'android'
    ? safeArea.compact
    : safeArea.comfortable;
  const hasStickyBar = !!(primaryAction || secondaryAction || stickyNote);
  const contentBottomPadding = (hasStickyBar && actionBarHeight > 0 ? actionBarHeight : (hasStickyBar ? spacing[16] : spacing[4])) + runtimeBottomInset + safeArea.comfortable;

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title={journeyTopBarTitle}
      />

      <MobileScrollView fill padding={4} gap={3} contentContainerStyle={{ paddingBottom: contentBottomPadding }}>

        {/* 1. Single Main Status Card */}
        <Surface tone="raised" padding={4} radiusToken="xl" gap={3}>
          <Box layoutDirection="row" align="center" justify="space-between" gap={2} style={{ flexDirection: 'row-reverse' }}>
            <Box gap={1} style={{ alignItems: 'flex-end', flex: 1 }}>
              <Text role="titleLg" style={{ textAlign: 'right', fontWeight: '700', color: theme.brand }}>
                {heroTitle}
              </Text>
              <Text role="bodyMd" style={{ textAlign: 'right', color: theme.textSoft }}>
                {heroSummary}
              </Text>
            </Box>
          </Box>

          {isTrackingJourneyState && phase !== 'received' && !isPickup && (
            <Box layoutDirection="row" justify="flex-end" gap={2} style={{ flexDirection: 'row-reverse' }}>
              {smartTracking.proximityState === 'near_customer' && (
                <Chip label={`${deliveryActorLabel} قريب`} tone="warning" />
              )}
              {(smartTracking.proximityState === 'at_door' || smartTracking.proximityState === 'bell_rang' || phase === 'arrived') && (
                <Chip label={`${deliveryActorLabel} وصل`} tone="success" />
              )}
            </Box>
          )}

          <View style={{ height: 1, backgroundColor: theme.line }} />

          <KeyValueList
            items={heroDetailItems}
          />
        </Surface>

        <Surface tone="inset" padding={3} radiusToken="xl" gap={2}>
            <Box layoutDirection="row" align="center" justify="space-between" gap={2} style={{ flexDirection: 'row-reverse' }}>
              <Box gap={1} style={{ alignItems: 'flex-end', flex: 1 }}>
                <Text role="bodyStrong" style={{ textAlign: 'right' }}>سياسة المتابعة داخل الطلب</Text>
                <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                  {trackingFlowSummary?.nextPolicyActionPreview ?? 'هذا العرض يبدأ بملخص التنفيذ، ويفتح التفصيل فقط عند الحاجة.'}
                </Text>
              </Box>
              <Chip label={resolveClientPolicyChipLabel(trackingFlowPolicy)} tone="info" />
            </Box>
            <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
              {`إثبات التسليم: ${proofPreviewLabel}`}
            </Text>
          </Surface>

        {/* 2. 4-Stage Progress Bar */}
        <Surface tone="raised" padding={3} radiusToken="xl">
          <HorizontalMilestones activeStepId={activeStepId} />
        </Surface>

        {/* 3. Quick Actions Card */}
        <Surface tone="raised" padding={4} radiusToken="xl" gap={3}>
          <Text role="titleMd" style={{ textAlign: 'right', fontWeight: '700' }}>التواصل والمساعدة</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {communicationSummary}
          </Text>

          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap', justifyContent: 'flex-end', flexDirection: 'row-reverse' }}>
            {!isPickup && (
              <Button
                label={isChatExpanded ? 'إغلاق المراسلة' : chatActionLabel}
                tone={isChatExpanded ? 'brand' : 'secondary'}
                leadingAccessory={<Icon name="chatbox-ellipses-outline" size={18} color={isChatExpanded ? theme.brandContrast : theme.brand} />}
                onPress={() => setIsChatExpanded(!isChatExpanded)}
                style={{ flex: 1, minWidth: 120 }}
              />
            )}
            {isBthwaniDelivery && !hasClientReceived && (
              <Button
                label={hasAlertedCaptain ? 'تم تنبيه الكابتن' : 'تنبيه الكابتن'}
                tone={hasAlertedCaptain ? 'ghost' : 'secondary'}
                disabled={hasAlertedCaptain}
                leadingAccessory={<Icon name="notifications-outline" size={18} color={hasAlertedCaptain ? theme.textSoft : theme.brand} />}
                onPress={() => setHasAlertedCaptain(true)}
                style={{ flex: 1, minWidth: 120 }}
              />
            )}
            <Button
              label={isSupportExpanded ? 'إغلاق الدعم' : 'الدعم أو الإبلاغ عن مشكلة'}
              tone={isSupportExpanded ? 'brand' : 'secondary'}
              leadingAccessory={<Icon name="help-circle-outline" size={18} color={isSupportExpanded ? theme.brandContrast : theme.brand} />}
              onPress={() => setIsSupportExpanded(!isSupportExpanded)}
              style={{ flex: 1, minWidth: 120 }}
            />
          </Box>

          {isBthwaniDelivery && hasAlertedCaptain && !hasClientReceived && (
            <Box layoutDirection="row-reverse" align="center" gap={2} style={{ marginTop: 4 }}>
              <Icon name="checkmark-circle-outline" size={16} color={theme.success} />
              <Text role="bodySm" style={{ color: theme.success, textAlign: 'right' }}>
                أرسلنا تنبيهًا للكابتن داخل هذا الطلب.
              </Text>
            </Box>
          )}
        </Surface>

        {/* Inline Chat toggled by Message Button */}
        {isChatExpanded && !isPickup && (
          <OrderLinkedChat
            title={chatTitle}
            subtitle={phase === 'received' ? 'السجل ظاهر للمراجعة فقط بعد الاستلام.' : 'آخر رسالة ومرفقات سريعة داخل نفس الصندوق.'}
            statusLabel={phase === 'received' ? 'الدردشة مقفلة' : 'مرتبطة بهذا الطلب'}
            statusTone={phase === 'received' ? 'warning' : 'brand'}
            helperText={phase === 'received' ? 'لا يمكن إرسال رسائل جديدة بعد الاستلام.' : 'اكتب رسالة واحدة واضحة أو أرسل مرفقًا سريعًا دون فتح واجهات إضافية.'}
            message={{
              senderLabel: lastChatMessage.senderLabel,
              body: lastChatMessage.body,
              meta: lastChatMessage.time,
              tone: lastChatMessage.tone,
            }}
            quickActions={quickActions}
            inputLabel={chatInputLabel}
            inputPlaceholder="اكتب رسالتك هنا"
            value={draftMessage}
            onChangeText={setDraftMessage}
            sendLabel={chatSendLabel}
            onSend={handleSendMessage}
            sendDisabled={!canSendMessage}
            disabledReason={phase === 'received' ? 'الدردشة أغلقت بعد استلام العميل للطلب.' : !canSendMessage ? 'أضف نصًا أو اختر مرفقًا واحدًا على الأقل.' : undefined}
          />
        )}

        {/* Inline Support toggled by Support Button */}
        {isSupportExpanded && (
          <Surface tone="raised" padding={4} radiusToken="xl" gap={3}>
            <Surface tone="inset" padding={3} radiusToken="lg" gap={2}>
              <Box layoutDirection="row" align="center" justify="space-between" gap={2} style={{ flexDirection: 'row-reverse' }}>
                <Box gap={1} style={{ alignItems: 'flex-end', flex: 1 }}>
                  <Text role="bodyStrong" style={{ textAlign: 'right' }}>الدعم يبقى داخل هذا الطلب</Text>
                  <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                    {issueFlowSummary?.nextPolicyActionPreview ?? 'الأدلة لا تُفتح أو تُرفق إلا عند الحاجة ومن داخل نفس الطلب.'}
                  </Text>
                </Box>
                <Chip label={resolveClientPolicyChipLabel(issueFlowPolicy)} tone="warning" />
              </Box>
              <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
                {`مالك قرار التصعيد: ${resolveEscalationOwnerLabel(issueFlowSummary?.escalationOwner)} · الأفعال الممنوعة: ${issueFlowSummary?.forbiddenActions.join('، ') ?? 'غير محدد'}`}
              </Text>
            </Surface>

            {isSupportSubmitted ? (
              <Box gap={3} align="center" style={{ paddingVertical: 10 }}>
                <Box
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: theme.brandSurface,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}
                >
                  <Icon name="checkmark-circle" size={40} color={theme.brand} />
                </Box>
                <Text role="titleMd" style={{ textAlign: 'center', fontWeight: '700' }}>تم إرسال بلاغك بنجاح</Text>
                <Text role="bodySm" tone="muted" style={{ textAlign: 'center', paddingHorizontal: 16 }}>
                  تلقينا تفاصيل مشكلتك وسيقوم فريق الدعم والمساعدة بمراجعة طلبك والتواصل معك في أقرب وقت ممكن.
                </Text>
                <KeyValueList
                  dense
                  items={[
                    { label: 'نوع المشكلة', value: issueTypes.find(i => i.id === selectedIssue)?.label ?? '' },
                    { label: 'تفاصيل إضافية', value: supportDetailsText.trim() || 'لا يوجد تفاصيل إضافية' },
                    ...(supportAttachment ? [{ label: 'الملف المرفق', value: supportAttachment }] : []),
                  ]}
                />
                <Button
                  label="موافق"
                  onPress={() => {
                    setIsSupportExpanded(false);
                    setIsSupportSubmitted(false);
                    setSelectedIssue(null);
                    setSupportDetailsText('');
                    setSupportAttachment(null);
                  }}
                  style={{ width: '100%', marginTop: 8 }}
                />
              </Box>
            ) : (
              <Box gap={3}>
                <Box gap={1} style={{ alignItems: 'flex-end' }}>
                  <Text role="titleMd" style={{ textAlign: 'right', fontWeight: '700' }}>الدعم والمساعدة</Text>
                  <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                    اختر نوع المشكلة في طلبك لمتابعتها مع الدعم الفني فوراً.
                  </Text>
                </Box>

                <Box layoutDirection="row" gap={1} style={{ flexWrap: 'wrap', justifyContent: 'flex-end', flexDirection: 'row-reverse' }}>
                  {issueTypes.map((issue) => {
                    const isSelected = selectedIssue === issue.id;
                    return (
                      <Chip
                        key={issue.id}
                        label={issue.label}
                        tone={isSelected ? 'brand' : 'default'}
                        onPress={() => setSelectedIssue(selectedIssue === issue.id ? null : issue.id)}
                      />
                    );
                  })}
                </Box>

                <TextField
                  label="تفاصيل إضافية"
                  value={supportDetailsText}
                  placeholder="اكتب ملاحظة قصيرة تساعد فريق الدعم"
                  onChangeText={setSupportDetailsText}
                  style={{ textAlign: 'right' }}
                />

                {supportAttachment === null ? (
                  <Pressable
                    onPress={() => setSupportAttachment('dsh_support_proof.jpg')}
                    style={({ pressed }) => ({
                      flexDirection: 'row-reverse',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      gap: spacing[2],
                      padding: spacing[3],
                      borderRadius: 12,
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      borderColor: theme.brand,
                      backgroundColor: pressed ? theme.brandSurface : theme.surface,
                      marginTop: spacing[2],
                    })}
                  >
                    <Icon name="camera-outline" size={20} color={theme.brand} />
                    <Text role="bodySm" style={{ color: theme.brand, fontWeight: '500' }}>
                      إرفاق صورة أو مستند داعم (اختياري)
                    </Text>
                  </Pressable>
                ) : (
                  <Surface
                    tone="success"
                    padding={3}
                    radiusToken="lg"
                    style={{
                      flexDirection: 'row-reverse',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: spacing[2],
                      borderWidth: 1,
                      borderColor: theme.success,
                    }}
                  >
                    <Box layoutDirection="row-reverse" align="center" gap={2} style={{ flexDirection: 'row-reverse' }}>
                      <Icon name="checkmark-circle-outline" size={20} color={theme.success} />
                      <Text role="bodySm" style={{ color: theme.success, fontWeight: '600' }}>
                        تم إرفاق صورة الإثبات بنجاح ({supportAttachment})
                      </Text>
                    </Box>
                    <Pressable
                      onPress={() => setSupportAttachment(null)}
                      style={({ pressed }) => ({
                        padding: spacing[1],
                        opacity: pressed ? 0.7 : 1,
                      })}
                    >
                      <Icon name="trash-outline" size={18} color={theme.brand} />
                    </Pressable>
                  </Surface>
                )}

                <Button
                  label={selectedIssue ? 'إرسال البلاغ' : 'اختر نوع المشكلة أولاً'}
                  disabled={!selectedIssue}
                  onPress={() => setIsSupportSubmitted(true)}
                  style={{ marginTop: 8 }}
                />
              </Box>
            )}
          </Surface>
        )}

        {/* 4. Post-Delivery Section Only */}
        {hasClientReceived && (
          <Surface tone="raised" padding={4} radiusToken="xl" gap={3}>
            <Text role="titleMd" style={{ textAlign: 'right', fontWeight: '700', color: theme.success }}>
              {isPickup ? 'تقييم التجربة بعد الاستلام' : 'تقييم الخدمة وما بعد التسليم'}
            </Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              {isPickup ? 'يسعدنا معرفة رأيك في جودة المنتج وتجربة الاستلام من المتجر.' : `يسعدنا معرفة رأيك في جودة المنتج وتجربتك مع ${deliveryActorRatingLabel}.`}
            </Text>

            <DeferredReviewBlock
              title="تقييم المنتج"
              subtitle="ما هو رأيك في جودة ومطابقة المنتجات المستلمة؟"
              enabled={true}
              placeholderText="يرجى تقييم المنتج"
              currentValueLabel={productRatingLabel}
              stateLabel={reviewStateLabel}
              helperText={productHelperText}
              value={productRating}
              onChange={handleProductRatingChange}
              submitted={ratingsSubmitted}
            />

            <DeferredReviewBlock
              title={`تقييم ${deliveryActorRatingLabel}`}
              subtitle={`كيف كانت تجربة ${isBthwaniDelivery ? 'التواصل وسرعة التوصيل مع الكابتن' : isPartnerDelivery ? 'التوصيل مع موصل المتجر' : 'الاستلام من المتجر'}؟`}
              enabled={true}
              placeholderText={`يرجى تقييم ${deliveryActorRatingLabel}`}
              currentValueLabel={captainRatingLabel}
              stateLabel={reviewStateLabel}
              helperText={captainHelperText}
              value={captainRating}
              onChange={handleCaptainRatingChange}
              submitted={ratingsSubmitted}
              placeholderTone="brand"
            />

            <View style={{ height: 1, backgroundColor: theme.line }} />

            <Box gap={2}>
              {onReorder && <Button label="إعادة الطلب" onPress={onReorder} />}
              <Button
                label={isSupportExpanded ? "إغلاق الدعم" : "الدعم أو الإبلاغ عن مشكلة"}
                tone="secondary"
                onPress={() => setIsSupportExpanded(!isSupportExpanded)}
              />
            </Box>
          </Surface>
        )}

        {/* Wallet/refund detail remains on-demand even when summary is visible. */}
        {walletImpactVisibility ? (
          <Surface tone="inset" gap={2} padding={3} radiusToken="xl">
            <Box layoutDirection="row" align="center" justify="space-between" gap={2} style={{ flexDirection: 'row-reverse' }}>
              <Box gap={1} style={{ alignItems: 'flex-end', flex: 1 }}>
                <Text role="bodyStrong" style={{ textAlign: 'right' }}>الأثر المالي داخل الطلب</Text>
                <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                  {trackingFlowSummary?.nextPolicyActionPreview ?? 'يبقى هذا الجزء مختصرًا حتى تفتح التفاصيل عند الحاجة.'}
                </Text>
              </Box>
              <Button
                label={isFinancialDetailsExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                tone={isFinancialDetailsExpanded ? 'secondary' : 'ghost'}
                size="sm"
                fullWidth={false}
                onPress={() => setIsFinancialDetailsExpanded((current) => !current)}
              />
            </Box>
            {isFinancialDetailsExpanded ? (
              <>
                <KeyValueList
                  items={[
                    { label: 'المبلغ المدفوع', value: `${walletImpactVisibility.paid_amount} ر.ي` },
                    { label: 'رسوم التوصيل', value: `${walletImpactVisibility.delivery_fee} ر.ي` },
                    { label: 'الخصم', value: `${walletImpactVisibility.discount} ر.ي` },
                    { label: 'رصيد المحفظة', value: `${walletImpactVisibility.wallet_credit} ر.ي` },
                    { label: 'المسترد المكتمل', value: `${walletImpactVisibility.refund_completed} ر.ي`, tone: 'success' },
                    { label: 'الاسترداد المعلق', value: `${walletImpactVisibility.refund_pending} ر.ي`, tone: walletImpactVisibility.refund_pending > 0 ? 'warning' : 'default' },
                  ]}
                />
                {walletImpactVisibility.note ? <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{walletImpactVisibility.note}</Text> : null}
              </>
            ) : (
              <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
                افتح هذا الجزء فقط عند الحاجة لمراجعة رصيد المحفظة أو حالة الاسترداد.
              </Text>
            )}
          </Surface>
        ) : null}

        <View style={{ height: spacing[1] }} />
      </MobileScrollView>

      {hasStickyBar ? (
        <StickyActionBar
          primaryAction={primaryAction}
          secondaryAction={secondaryAction}
          note={stickyNote}
          onHeightChange={setActionBarHeight}
        />
      ) : null}
    </View>
  );
}

function renderTracking(
  clientState: DshClientState,
  currentStatusLabel: string,
  timeline: DshTrackingTimelineItem[],
  onSupport?: () => void,
  onNextAction?: () => void,
  onReorder?: () => void,
) {
  const { theme } = useTheme();
  const trackingStateMeta = getDshClientStateMeta(clientState);
  const activeTimelineIndex = Math.max(0, timeline.findIndex((item) => !item.done));
  const activeItem = timeline[activeTimelineIndex] ?? timeline[timeline.length - 1];
  const walletVisibilityCopy = getClientWalletVisibilityCopy(trackingStateMeta);
  const walletImpactVisibility = buildDefaultWalletImpact(clientState);
  const trackingFlowPolicy = getDshClientFlowPolicy('client-order-tracking');
  const trackingFlowSummary = getDshFlowPolicySummary('client-order-tracking');
  const issueFlowSummary = getDshFlowPolicySummary('client-order-issue');
  const supportTitle = trackingStateMeta.isException ? 'الدعم مطلوب الآن' : 'الدعم والرجوع';
  const supportDescription = trackingStateMeta.isException
    ? 'هذه الحالة تحتاج متابعة دعم واضحة قبل أي خطوة لاحقة. استخدم زر الدعم الآن لشرح المشكلة ومتابعة الحل.'
    : 'إذا احتجت مراجعة إضافية أو دعمًا سريعًا، يمكنك الانتقال من هنا دون كسر المسار.';
  const supportButtonLabel = trackingStateMeta.isException ? 'طلب الدعم الآن' : 'الدعم';

  return (
    <MobileScrollView padding={4} gap={3} contentContainerStyle={{ paddingBottom: spacing[4] }}>
      <Surface tone="brand" gap={2} padding={3}>
        <Box gap={1} style={{ alignItems: 'flex-end' }}>
          <Badge label={currentStatusLabel} tone="info" />
          <Text role="titleLg" style={{ textAlign: 'right' }}>{trackingStateMeta.title}</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {trackingStateMeta.description}
          </Text>
        </Box>
      </Surface>

      <Surface tone="raised" gap={3} padding={2}>
        <SectionHeader title="الحالة الحالية" subtitle="آخر محطة مرئية الآن في مسار التنفيذ." />
        <KeyValueList
          items={[
            { label: 'المرحلة الحالية', value: activeItem?.title ?? currentStatusLabel, tone: 'brand' },
            { label: 'الخطوة التالية', value: timeline[activeTimelineIndex + 1]?.title ?? trackingStateMeta.label, tone: 'success' },
            { label: 'آخر تحديث', value: activeItem?.detail ?? 'مباشر' },
          ]}
        />
      </Surface>

      <Surface tone="inset" gap={2} padding={2}>
        <Text role="bodyStrong" style={{ textAlign: 'right' }}>سياسة العرض داخل الطلب</Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          {trackingFlowSummary?.nextPolicyActionPreview ?? 'يبدأ هذا المسار بملخص الحالة، ويفتح التفصيل فقط عند الطلب.'}
        </Text>
        <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
          {`النمط الحالي: ${resolveClientPolicyChipLabel(trackingFlowPolicy)}`}
        </Text>
      </Surface>

      {walletVisibilityCopy ? (
        <Surface tone="inset" gap={2} padding={2}>
          <Text role="bodyStrong" style={{ textAlign: 'right' }}>{walletVisibilityCopy.title}</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {walletVisibilityCopy.description}
          </Text>
        </Surface>
      ) : null}

      {walletImpactVisibility ? (
        <Surface tone="inset" gap={2} padding={2}>
          <SectionHeader title="الأثر المالي الظاهر" subtitle="يبقى مختصرًا هنا، وتفتح التفاصيل فقط عند مراجعتها من داخل الطلب." />
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {walletImpactVisibility.note ?? 'إذا احتجت تفاصيل المبالغ أو الاسترداد، افتح الدعم أو شاشة المراجعة من داخل الطلب.'}
          </Text>
        </Surface>
      ) : null}

      <Surface tone="inset" gap={2} padding={2}>
        <Text role="bodyStrong" style={{ textAlign: 'right' }}>{supportTitle}</Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          {supportDescription}
        </Text>
        <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
          {`الدعم contextual داخل الطلب فقط · مالك التصعيد: ${resolveEscalationOwnerLabel(issueFlowSummary?.escalationOwner)}`}
        </Text>
        {trackingStateMeta.isException && !onSupport ? (
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            لا يوجد مسار دعم موصول حاليًا داخل هذا العرض.
          </Text>
        ) : null}
        <Box gap={2}>
          {clientState === 'delivered' && onReorder ? <Button label="إعادة الطلب" onPress={onReorder} /> : null}
          {onNextAction ? <Button label="العودة إلى الطلبات" onPress={onNextAction} /> : null}
          {onSupport ? <Button label={supportButtonLabel} tone="secondary" onPress={onSupport} /> : null}
        </Box>
      </Surface>
    </MobileScrollView>
  );
}


export function DshOrdersListScreen({ items = fallbackOrderListItems, query = '', onQueryChange, onOpenOrder, onReorder, onBack, onRetry, onNextAction }: DshOrdersListScreenProps) {
  const { theme } = useTheme();
  const [isSearchVisible, setIsSearchVisible] = React.useState(false);
  const normalizedQuery = normalizeText(query);
  const visibleItems = normalizedQuery
    ? items.filter((item) => normalizeText(`${item.title} ${item.orderNumber} ${item.statusLabel} ${item.summary || ''}`).includes(normalizedQuery))
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
            {sortedItems.map((item, index) => <OrderRow key={item.id} item={item} onOpenOrder={onOpenOrder} onReorder={onReorder} isLast={index === sortedItems.length - 1} />)}
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

export function DshIntakeHubScreen({ state = 'ready', screenId = 'intake-workspace', onPrimaryAction, onSecondaryAction, onRetry }: DshIntakeHubScreenProps) {
  return (
    <DshOperationScreen
      state={state}
      title="قدرة مدمجة داخل تأكيد الطلب"
      subtitle="التجهيز والتقدير ومراجعة الجاهزية تظهر داخل شاشة تأكيد الطلب أو إنشاء الطلب، وليست صفحة عميل مستقلة."
      content={
        <Surface tone="inset" gap={2}>
          <Text role="bodyStrong">{screenId}</Text>
          <Text role="bodySm" tone="muted">أي تفاصيل تخص التقدير أو بوابة الإكمال أو العروض الترويجية يجب أن تظهر داخل رحلة تأكيد الطلب القانونية فقط.</Text>
        </Surface>
      }
      primaryActionLabel="فتح تأكيد الطلب"
      secondaryActionLabel="العودة"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction ?? onRetry}
      onRetry={onRetry}
    />
  );
}

export function DshTrackingScreen({ values = defaultCreateOrderValues, clientState = 'tracking_active', currentStatusLabel, fulfillmentMode, timeline = [], onSupport, onRetry, onNextAction, onReorder, onCancelOrder }: DshTrackingScreenProps) {
  const [cancelSheetVisible, setCancelSheetVisible] = React.useState(false);
  const trackingStateMeta = getDshClientStateMeta(clientState);
  const fallbackTimeline: DshTrackingTimelineItem[] = timeline.length
    ? timeline
    : clientState === 'tracking_active'
      ? FULL_JOURNEY_STEPS.map((step, index) => ({ id: step.id, title: step.title, detail: step.detail, done: index === 0 }))
      : [{ id: clientState, title: trackingStateMeta.title, detail: trackingStateMeta.description, done: false }];

  if (clientState === 'delivered') {
    return (
      <CreateOrderJourneyScreen
        values={values}
        timeline={fallbackTimeline}
        clientState={clientState}
        fulfillmentMode={fulfillmentMode}
        initialPhase="received"
        currentStatusLabel={currentStatusLabel ?? trackingStateMeta.label}
        onSupport={onSupport}
        onNextAction={onNextAction}
        onReorder={onReorder}
        onBack={onNextAction ?? onRetry}
      />
    );
  }

  if (clientState !== 'tracking_active') {
    return renderTracking(clientState, currentStatusLabel ?? trackingStateMeta.label, fallbackTimeline, onSupport, onNextAction, onReorder);
  }

  return (
    <View style={{ flex: 1 }}>
      <CreateOrderJourneyScreen
        values={values}
        timeline={fallbackTimeline}
        clientState={clientState}
        fulfillmentMode={fulfillmentMode}
        initialPhase="route"
        currentStatusLabel={currentStatusLabel ?? trackingStateMeta.label}
        onSupport={onSupport}
        onNextAction={onNextAction}
        onReorder={onReorder}
        onCancelOrder={onCancelOrder ? () => setCancelSheetVisible(true) : undefined}
        onBack={onSupport ?? onNextAction ?? onRetry}
      />
      <CancelOrderSheet
        visible={cancelSheetVisible}
        onConfirm={() => { setCancelSheetVisible(false); onCancelOrder?.(); }}
        onCancel={() => setCancelSheetVisible(false)}
      />
    </View>
  );
}

export default {};
