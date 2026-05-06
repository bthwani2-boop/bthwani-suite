import React from 'react';
import { Dimensions, Platform, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Badge,
  Box,
  Button,
  CompactStatusStepper,
  Icon,
  Card,
  Chip,
  DeferredReviewBlock,
  KeyValueDetails,
  KeyValueList,
  ListItem,
  MobileScrollView,
  OperationalStatusHero,
  OrderLinkedChat,
  SearchField,
  SectionHeader,
  StatCard,
  StickyActionBar,
  TextField,
  Surface,
  Text,
  TopBar,
  safeArea,
  spacing,
  useTheme,
} from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../patterns/screens/DshOperationScreen';
import { getDshClientStateMeta, type DshClientState } from '../../shared/dshClientStateModel';
import type {
  DshClientAddressSnapshot,
  DshClientDeliveryLifecycleStatus,
  DshClientEventTimelineItem,
  DshClientExceptionReason,
  DshClientFulfillmentModeSnapshot,
  DshClientHandoffVerification,
  DshClientProofOfDeliveryVisibility,
  DshClientServiceabilityQuote,
  DshClientWalletImpactVisibility,
} from '../../shared/dshClientBinding.contracts';

type CreateOrderValues = {
  pickupAddress: string;
  dropoffAddress: string;
  contactName: string;
  contactPhone: string;
  note: string;
};

type DshOrderListItem = {
  id: string;
  title: string;
  subtitle: string;
  statusLabel: string;
  meta: string;
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
  iconName: React.ComponentProps<typeof Ionicons>['name'];
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
  onBack?: () => void;
  onRetry?: () => void;
  onNextAction?: () => void;
};

export type DshTrackingScreenProps = {
  values?: CreateOrderValues;
  clientState?: DshClientState;
  currentStatusLabel?: string;
  timeline?: DshTrackingTimelineItem[];
  onSupport?: () => void;
  onRetry?: () => void;
  onNextAction?: () => void;
  onReorder?: () => void;
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
  pickupAddress: 'رياض بارك، البوابة 2',
  dropoffAddress: 'العليا، طريق الملك فهد',
  contactName: 'أحمد',
  contactPhone: '770000000',
  note: 'لا توجد ملاحظات',
};

const deliveryJourneySteps: JourneyStep[] = [
  { id: 'route', title: 'في الطريق', detail: 'الطلب متجه إلى العميل ويظهر المسار الآن.' },
  { id: 'arrived', title: 'وصل للعميل', detail: 'وصل الطلب إلى العميل وأصبح بانتظار الاستلام.' },
  { id: 'received', title: 'استلم العميل الطلب', detail: 'بعد الاستلام تظهر التقييمات في نفس الشاشة.' },
];

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
  { id: 'order-review', title: 'طلب قيد المراجعة', subtitle: 'العنوان والتواصل تحت التدقيق قبل التحريك', statusLabel: 'قيد المراجعة', meta: 'جاهز للتتبع' },
  { id: 'order-route', title: 'طلب في الطريق', subtitle: 'تم التعيين ويظهر المسار الحي الآن', statusLabel: 'في الطريق', meta: 'مباشر' },
  { id: 'order-done', title: 'طلب مكتمل', subtitle: 'تم التسليم ويمكن الرجوع إليه لاحقًا', statusLabel: 'تم التسليم', meta: 'أرشيف' },
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
                  <Ionicons name="checkmark-sharp" size={16} color={theme.brandContrast} />
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

function OrdersListStatCard({ label, value, helperText }: { label: string; value: string; helperText: string }) {
  const { theme } = useTheme();

  return (
    <Card
      title={label}
      subtitle={helperText}
      style={{ flexBasis: '48%', flexGrow: 1, borderRadius: 18, borderWidth: 1, borderColor: theme.line }}
    >
      <Text role="hero" style={{ color: theme.brand }}>{value}</Text>
    </Card>
  );
}

function OrderRow({ item, onOpenOrder }: { item: DshOrderListItem; onOpenOrder?: (orderId: string) => void }) {
  const { theme } = useTheme();

  return (
    <ListItem
      title={item.title}
      subtitle={item.subtitle}
      meta={item.meta}
      badgeLabel={item.statusLabel}
      onPress={() => onOpenOrder?.(item.id)}
    />
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
            <Ionicons name={isSelected ? 'star' : 'star-outline'} size={24} color={isSelected ? theme.warning : theme.textSoft} />
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
    <Surface tone="raised" gap={3} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
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
        <Surface tone="raised" gap={2} padding={2} style={{ borderRadius: 18, borderWidth: 1, borderColor: theme.line }}>
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
                  leadingAccessory={<Ionicons name={action.iconName} size={16} color={isSelected ? theme.brandContrast : theme.text} />}
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
        <Surface tone="inset" gap={1} padding={2} style={{ borderRadius: 18, borderWidth: 1, borderColor: theme.line }}>
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
    confirmed: 'تم تأكيد الطلب',
    partner_accepted: 'قبول الشريك',
    preparing: 'قيد التجهيز',
    ready_for_pickup: 'جاهز للاستلام',
    captain_assigned: 'تم تعيين الكابتن',
    enroute_to_pickup: 'في الطريق إلى الاستلام',
    arrived_at_pickup: 'وصل إلى نقطة الاستلام',
    picked_up: 'تم الاستلام من المتجر',
    enroute_to_dropoff: 'في الطريق إلى العميل',
    arrived_at_dropoff: 'وصل إلى العميل',
    delivered: 'تم التسليم',
    cancelled: 'تم الإلغاء',
    failed: 'فشل التنفيذ',
    returned: 'قيد الإرجاع / الاسترداد',
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
    partner_delivery: 'توصيل الشريك',
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

  if (clientState === 'order_created') return 'created';
  if (clientState === 'order_confirmed') return 'confirmed';
  if (clientState === 'cancelled') return 'cancelled';
  if (clientState === 'failed') return 'failed';
  if (clientState === 'refund_pending') return 'returned';
  if (clientState === 'refunded' || clientState === 'wallet_refund_visible') return 'refunded';
  if (clientState === 'delivered') return 'delivered';

  if (phase === 'received') return 'delivered';
  if (phase === 'arrived') return 'arrived_at_dropoff';
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
    arrived: 'arrived_at_dropoff',
    received: 'delivered',
  };

  const fallbackStatuses: DshClientDeliveryLifecycleStatus[] = ['enroute_to_dropoff', 'arrived_at_dropoff', 'delivered'];

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
      proof_type: 'otp',
      is_required: true,
      captured_by: 'captain',
      captured_at: '2026-05-01T20:30:00+03:00',
      proof_asset_url: 'https://example.invalid/dsh/proof/delivered',
      verification_result: 'verified',
      failure_reason: null,
      customer_visible: true,
    };
  }

  if (clientState === 'tracking_active' && phase === 'arrived') {
    return {
      proof_type: 'otp',
      is_required: true,
      captured_by: null,
      captured_at: null,
      proof_asset_url: null,
      verification_result: 'pending',
      failure_reason: null,
      customer_visible: true,
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
    dropoff_otp: '4821',
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

type CreateOrderJourneyScreenProps = {
  values: CreateOrderValues;
  timeline: DshTrackingTimelineItem[];
  clientState?: DshClientState;
  onPrimaryAction?: () => void;
  onBack?: () => void;
  onSupport?: () => void;
  onNextAction?: () => void;
  onReorder?: () => void;
  initialPhase?: JourneyPhase;
  currentStatusLabel?: string;
};

function CreateOrderJourneyScreen({ values, timeline, clientState = 'tracking_active', onPrimaryAction, onBack, onSupport, onNextAction, onReorder, initialPhase = 'route', currentStatusLabel }: CreateOrderJourneyScreenProps) {
  const { theme } = useTheme();
  const [phase, setPhase] = React.useState<JourneyPhase>(initialPhase);
  const [productRating, setProductRating] = React.useState(0);
  const [captainRating, setCaptainRating] = React.useState(0);
  const [ratingsSubmitted, setRatingsSubmitted] = React.useState(false);
  const [draftMessage, setDraftMessage] = React.useState('');
  const [draftAttachments, setDraftAttachments] = React.useState<OrderChatAttachmentKind[]>([]);
  const [actionBarHeight, setActionBarHeight] = React.useState(0);
  const effectiveClientState = normalizeClientFacingOrderState(clientState);
  const [lastChatMessage, setLastChatMessage] = React.useState<OrderChatMessage>({
    id: 'chat-captain-1',
    senderLabel: 'الكابتن المكلّف',
    body: 'إذا احتجت صورة أو فيديو أو رسالة صوتية للمنتج فأرسلها هنا ضمن نفس الطلب.',
    time: 'قبل قليل',
    tone: 'info',
    align: 'start',
    attachments: ['camera', 'video', 'voice'],
  });
  const clientStateMeta = getDshClientStateMeta(effectiveClientState);
  const paymentPendingMeta = getDshClientStateMeta('payment_pending');
  const orderCreatedMeta = getDshClientStateMeta('order_created');
  const orderConfirmedMeta = getDshClientStateMeta('order_confirmed');
  const isDeliveredState = effectiveClientState === 'delivered';
  const isTrackingJourneyState = effectiveClientState === 'tracking_active' || isDeliveredState;
  const isOrderCreationState = effectiveClientState === 'order_created' || effectiveClientState === 'order_confirmed';
  const isCheckoutSequenceState = !isTrackingJourneyState && !isOrderCreationState;
  const note = normalizeText(values.note).length ? values.note : 'لا توجد ملاحظات';
  const phaseIndex = phase === 'route' ? 0 : phase === 'arrived' ? 1 : 2;
  const deliveryStatusLabel = isTrackingJourneyState
    ? phase === 'route'
      ? currentStatusLabel ?? clientStateMeta.label
      : phase === 'arrived'
        ? 'وصل للعميل'
        : isDeliveredState
          ? 'تم التسليم'
          : 'استلم العميل الطلب'
    : currentStatusLabel ?? clientStateMeta.label;
  const journeyTopBarTitle = isTrackingJourneyState
    ? phase === 'route'
      ? 'الطلب في الطريق إلى العميل'
      : phase === 'arrived'
        ? 'وصل الطلب للعميل'
        : isDeliveredState
          ? 'تم التسليم'
          : 'استلم العميل الطلب'
    : clientStateMeta.title;
  const heroTitle = isTrackingJourneyState
    ? phase === 'route'
      ? 'في الطريق'
      : phase === 'arrived'
        ? 'وصل للعميل'
        : isDeliveredState
          ? 'تم التسليم'
          : 'تم الاستلام'
    : clientStateMeta.title;
  const heroSummary = isTrackingJourneyState
    ? phase === 'route'
      ? clientStateMeta.description
      : phase === 'arrived'
        ? 'الطلب وصل إلى العميل وهو الآن بانتظار تثبيت الاستلام.'
        : isDeliveredState
          ? 'اكتمل التسليم ويمكنك تقييم المنتج والكابتن أو طلب الدعم من نفس الشاشة.'
          : 'اكتمل الاستلام ويمكنك تقييم التجربة من نفس الصفحة.'
    : clientStateMeta.description;
  const journeySteps = isTrackingJourneyState
    ? deliveryJourneySteps.map((step, index) => ({
        id: step.id,
        title: step.title,
        state: index < phaseIndex ? 'done' : index === phaseIndex ? 'current' : 'next',
      }))
    : [
        { id: 'order-created', title: orderCreatedMeta.label, state: effectiveClientState === 'order_created' ? 'current' as const : 'done' as const },
        { id: 'order-confirmed', title: orderConfirmedMeta.label, state: effectiveClientState === 'order_confirmed' ? 'current' as const : 'next' as const },
      ];
  const nextStepValue = isTrackingJourneyState
    ? phase === 'route'
      ? 'ثبّت الوصول عند مقابلة العميل.'
      : phase === 'arrived'
        ? 'ثبّت الاستلام لتفعيل التقييمات.'
        : ratingsSubmitted
          ? 'تم حفظ التقييمين داخل نفس الصفحة.'
          : onSupport || onNextAction
            ? 'اختر التقييمين ثم أرسل، أو استخدم الدعم والإجراء التالي المتاح.'
            : 'اختر التقييمين ثم أرسل.'
    : isOrderCreationState
      ? effectiveClientState === 'order_created'
        ? orderConfirmedMeta.label
        : 'افتح صفحة التتبع لمتابعة التنفيذ.'
    : clientStateMeta.description;
  const hasClientReceived = phase === 'received';
  const canSubmitRatings = hasClientReceived && productRating > 0 && captainRating > 0;
  const productRatingLabel = productRating > 0 ? `${productRating}/5` : 'غير محدد';
  const captainRatingLabel = captainRating > 0 ? `${captainRating}/5` : 'غير محدد';
  const compactSteps = journeySteps as Array<{ id: string; title: string; state: 'done' | 'current' | 'next' }>;
  const lifecycleStatus = React.useMemo(() => buildDefaultLifecycleStatus(effectiveClientState, phase), [effectiveClientState, phase]);
  const eventTimeline = React.useMemo(() => buildDefaultEventTimeline(effectiveClientState, timeline, phase), [effectiveClientState, timeline, phase]);
  const proofVisibility = React.useMemo(() => buildDefaultProofOfDelivery(effectiveClientState, phase), [effectiveClientState, phase]);
  const handoffVerification = React.useMemo(() => buildDefaultHandoffVerification(), []);
  const walletImpactVisibility = React.useMemo(() => buildDefaultWalletImpact(effectiveClientState), [effectiveClientState]);
  const exceptionReason = React.useMemo(() => getDefaultExceptionReason(effectiveClientState), [effectiveClientState]);
  const orderDetailsItems = [
    { label: 'عنوان الاستلام', value: values.pickupAddress || 'غير محدد', tone: 'brand' as const },
    { label: 'عنوان التسليم', value: values.dropoffAddress || 'غير محدد' },
    { label: 'جهة الاتصال', value: values.contactName || 'غير محدد' },
    { label: 'رقم الجوال', value: values.contactPhone || 'غير محدد' },
    { label: 'الملاحظات', value: note },
  ];
  const canSendMessage = phase !== 'received' && (draftMessage.trim().length > 0 || draftAttachments.length > 0);
  const chatSendLabel = draftMessage.trim().length > 0 ? 'إرسال الرسالة' : draftAttachments.length > 0 ? 'إرسال المرفقات' : 'أضف نصًا أو مرفقًا';
  const quickActions = (['voice', 'camera', 'video', 'attachment'] as OrderChatAttachmentKind[]).map((kind) => {
    const option = orderChatAttachmentOptions[kind];
    const selected = draftAttachments.includes(kind);

    return {
      id: option.kind,
      label: option.label,
      selected,
      disabled: phase === 'received',
      icon: <Ionicons name={option.iconName} size={16} color={selected ? theme.brandContrast : theme.text} />,
      onPress: () => {
        if (phase === 'received') {
          return;
        }

        setDraftAttachments((current) => (
          current.includes(kind)
            ? current.filter((item) => item !== kind)
            : [...current, kind]
        ));
      },
    };
  });

  const primaryActionLabel = isOrderCreationState
      ? effectiveClientState === 'order_created'
        ? 'عرض نجاح الطلب'
        : 'فتح التتبع'
    : phase === 'route'
      ? 'وصل الطلب للعميل'
      : phase === 'arrived'
        ? 'استلم العميل الطلب'
        : ratingsSubmitted
          ? 'تم إرسال التقييمين'
          : 'إرسال التقييمين';
  const primaryActionDisabled = isOrderCreationState ? false : phase === 'received' && (!canSubmitRatings || ratingsSubmitted);
  const productHelperText = phase === 'route'
    ? 'سيظهر تقييم المنتج بعد الاستلام.'
    : phase === 'arrived'
      ? 'سيفتح التقييم بعد تثبيت استلام العميل للطلب.'
    : ratingsSubmitted
      ? 'تم إرسال التقييمين. أي تعديل جديد سيعيد فتح الإرسال.'
      : 'اختر تقييم المنتج من 1 إلى 5 ثم أرسل التقييمين بالأسفل.';
  const captainHelperText = phase === 'route'
    ? 'سيظهر تقييم الكابتن بعد الاستلام.'
    : phase === 'arrived'
      ? 'سيبقى تقييم الكابتن مؤجلًا حتى تثبيت الاستلام.'
    : ratingsSubmitted
      ? 'تم إرسال التقييمين. يمكنك تعديل الكابتن ثم إعادة الإرسال.'
      : 'اختر تقييم الكابتن من 1 إلى 5 ثم أرسل التقييمين بالأسفل.';
  const stickyNote = isOrderCreationState
      ? effectiveClientState === 'order_created'
        ? 'تم إنشاء الطلب. هذه الشاشة مختصرة للتأكيد قبل النجاح ثم التتبع.'
        : 'تم تأكيد الطلب. الإجراء الرئيسي ينقلك إلى التتبع مباشرة.'
    : phase === 'route'
      ? 'يمكنك تثبيت الوصول من الزر الرئيسي عند وصول الطلب.'
      : phase === 'arrived'
        ? 'ثبّت الاستلام لتظهر التقييمات داخل نفس الصفحة.'
        : ratingsSubmitted
          ? 'تم حفظ التقييمين ولا توجد خطوة إضافية مطلوبة.'
          : 'لن يتفعّل الإرسال حتى تختار تقييم المنتج والكابتن.';
  const arrivalBellSummary = isTrackingJourneyState && phase !== 'received'
    ? phase === 'route'
      ? 'أيقونة الجرس تبقى داخل الطلب نفسه أثناء الطريق، وتغطي رنة الاقتراب ثم رنة الوصول من دون فتح صفحة مستقلة.'
      : 'جرس الوصول مثبت داخل نفس شاشة الطلب، والمرحلة الحالية تشير إلى أن الكابتن وصل وبقي فقط تثبيت الاستلام.'
    : null;
  const bellStatusItems = isTrackingJourneyState && phase !== 'received'
    ? [
        { label: 'حالة الجرس', value: phase === 'route' ? 'اقتراب' : 'وصول', tone: phase === 'route' ? 'warning' as const : 'brand' as const },
        { label: 'الرنات الفعالة', value: phase === 'route' ? 'اقتراب + وصول' : 'وصول مثبت' },
        { label: 'الخطوة التالية', value: phase === 'route' ? 'انتظار وصول الكابتن' : 'تثبيت الاستلام ثم التقييم', tone: 'success' as const },
      ]
    : [];
  const runtimeBottomInset = Platform.OS === 'android'
    ? Math.max(safeArea.compact, Dimensions.get('screen').height - Dimensions.get('window').height)
    : safeArea.comfortable;
  const contentBottomPadding = (actionBarHeight > 0 ? actionBarHeight : spacing[16]) + runtimeBottomInset + safeArea.comfortable;
  const reviewStateLabel = phase === 'received' ? (ratingsSubmitted ? 'تم الإرسال' : 'جاهز الآن') : 'مؤجل حتى الاستلام';

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

    if (phase === 'route') {
      setPhase('arrived');
      return;
    }

    if (phase === 'arrived') {
      setPhase('received');
      return;
    }

    if (!canSubmitRatings || ratingsSubmitted) {
      return;
    }

    setRatingsSubmitted(true);
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

  const secondaryAction = isOrderCreationState
    ? onBack
      ? { label: 'العودة إلى السلة', onPress: onBack, tone: 'secondary' as const }
      : undefined
    : phase === 'received' && onSupport
        ? { label: 'الدعم أو الإبلاغ عن مشكلة', onPress: onSupport, tone: 'secondary' as const }
        : onBack
          ? { label: phase === 'route' ? 'تعديل الطلب' : 'العودة', onPress: onBack, tone: 'secondary' as const }
          : undefined;

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title={journeyTopBarTitle}
        trailingAction={onBack ? { id: 'back', icon: <Icon name="arrow-back" size={24} color={theme.brand} />, mirrorInRtl: true, accessibilityLabel: 'رجوع', onPress: onBack } : undefined}
      />

      <MobileScrollView fill padding={4} gap={3} contentContainerStyle={{ paddingBottom: contentBottomPadding }}>
        <Surface tone="brand" padding={3} radiusToken="xl" gap={2}>
          <Box layoutDirection="row" align="center" gap={2} style={{ flexDirection: 'row-reverse' }}>
            <Icon name="flash-outline" size={18} tone="inverse" />
            <Text role="bodyStrong" tone="inverse" style={{ textAlign: 'right', flex: 1 }}>
              {phase === 'route' ? 'أسرع طريق عبر الملك فهد متاح الآن' : 'تم تثبيت الوصول في المنطقة التشغيلية'}
            </Text>
          </Box>
        </Surface>

        <Surface tone="raised" radiusToken="xl" style={{ overflow: 'hidden', height: 220, borderWidth: 1, borderColor: theme.line }}>
          <View style={{ flex: 1, backgroundColor: theme.surfaceInset, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="map-outline" size={48} tone="soft" />
            <Text role="caption" tone="muted">خريطة المسار الحي (Premium 2026)</Text>
          </View>
          <Box
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              backgroundColor: theme.brand,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
            }}
          >
            <Text role="caption" tone="inverse">تتبع مباشر</Text>
          </Box>
        </Surface>

        <OperationalStatusHero
          statusLabel={deliveryStatusLabel}
          statusTone={phase === 'received' ? 'success' : phase === 'arrived' ? 'brand' : 'warning'}
          title={heroTitle}
          summary={heroSummary}
          routeLabel="المسار"
          routeValue={`${values.pickupAddress || 'غير محدد'} → ${values.dropoffAddress || 'غير محدد'}`}
          nextStepLabel="الإجراء التالي"
          nextStepValue={nextStepValue}
        />

        <Surface tone="raised" padding={4} radiusToken="xl" gap={4}>
          <SectionHeader
            title="المسار الحي"
            subtitle="نظام تتبع مباشر وفوري لجميع محطات الطلب."
          />
          <StageRail activeStepId={phase} steps={deliveryJourneySteps} />
        </Surface>

        <KeyValueDetails
          title="تفاصيل الطلب"
          subtitle="المعلومات المهمة فقط، بشكل مضغوط وقابل للقراءة."
          items={orderDetailsItems}
          radiusToken="xl"
          padding={4}
        />

        {arrivalBellSummary ? (
          <Surface tone="inset" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
            <Box layoutDirection="row" align="center" justify="space-between" gap={2} style={{ flexDirection: 'row-reverse' }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: phase === 'route' ? theme.warningSurface : theme.brandSurface }}>
                <Ionicons name="notifications-outline" size={20} color={phase === 'route' ? theme.warning : theme.brand} />
              </View>
              <Box gap={1} style={{ flex: 1, alignItems: 'flex-end' }}>
                <Badge label="جرس الوصول" tone={phase === 'route' ? 'warning' : 'brand'} />
                <Text role="bodyStrong" style={{ textAlign: 'right' }}>الجرس جزء من الطلب نفسه</Text>
                <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                  {arrivalBellSummary}
                </Text>
              </Box>
            </Box>
            <KeyValueList items={bellStatusItems} />
          </Surface>
        ) : null}

        {isOrderCreationState ? (
          <Surface tone="raised" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
            <SectionHeader title="تأكيد الطلب" subtitle="هذه شاشة إنشاء/تأكيد مختصرة فقط، من دون إعادة عرض التسعير أو فحص التغطية أو الدفع." />
            <KeyValueList
              items={[
                { label: 'الحالة الحالية', value: clientStateMeta.label, tone: 'brand' },
                { label: 'الخطوة التالية', value: effectiveClientState === 'order_created' ? 'عرض نجاح الطلب' : 'فتح التتبع' },
                { label: 'مرجع التنفيذ', value: `${values.pickupAddress || 'غير محدد'} → ${values.dropoffAddress || 'غير محدد'}` },
                { label: 'الدعم', value: onSupport ? 'متاح عند الحاجة' : 'غير موصول' },
              ]}
            />
          </Surface>
        ) : (
          <>
            <Surface tone="raised" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
              <SectionHeader title="دورة التنفيذ" subtitle="الحالة التشغيلية، سبب الاستثناء، وإثبات التسليم الظاهر في هذا المسار." />
              <KeyValueList
                items={[
                  { label: 'الحالة التشغيلية', value: formatDeliveryLifecycleStatus(lifecycleStatus), tone: 'brand' },
                  { label: 'نوع الإثبات', value: formatProofType(proofVisibility.proof_type) },
                  { label: 'نتيجة التحقق', value: formatVerificationResult(proofVisibility.verification_result) },
                  { label: 'إظهار الإثبات للعميل', value: proofVisibility.customer_visible ? 'نعم' : 'لا' },
                  { label: 'مرجع الاستلام', value: handoffVerification.pickup_reference ?? 'غير متوفر' },
                  { label: 'OTP التسليم', value: handoffVerification.dropoff_otp ?? 'غير متوفر' },
                ]}
              />
              {exceptionReason ? (
                <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                  سبب الحالة الحالية: {formatExceptionReason(exceptionReason)}
                </Text>
              ) : null}
            </Surface>

            <Surface tone="raised" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
              <SectionHeader title="سجل الأحداث" subtitle="آخر التحولات الزمنية المرتبطة بالطلب الحالي، بدون شاشة إضافية." />
              <Box gap={2}>
                {eventTimeline.map((eventItem) => (
                  <ListItem
                    key={eventItem.event_id}
                    title={formatDeliveryLifecycleStatus(eventItem.to_status)}
                    subtitle={eventItem.notes ?? 'لا توجد ملاحظات إضافية'}
                    meta={eventItem.timestamp}
                    badgeLabel={eventItem.reason_code ? formatExceptionReason(eventItem.reason_code) : eventItem.actor_role}
                  />
                ))}
              </Box>
            </Surface>

            <Surface tone="raised" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
              <SectionHeader title="التحقق والتسليم" subtitle="مرجع الاستلام، كود التحقق، وتعليمات التسليم/الاستلام تبقى في نفس العرض." />
              <KeyValueList
                items={[
                  { label: 'التقاط الإثبات', value: proofVisibility.captured_at ?? 'لم يُلتقط بعد' },
                  { label: 'التقطه', value: proofVisibility.captured_by ?? 'غير محدد' },
                  { label: 'تعليمات العميل', value: handoffVerification.customer_instructions ?? 'لا توجد' },
                  { label: 'تعليمات الشريك', value: handoffVerification.partner_instructions ?? 'لا توجد' },
                  { label: 'تسليم بدون تلامس', value: handoffVerification.contactless_allowed ? 'مسموح' : 'غير مسموح' },
                  { label: 'ملاحظات الكابتن', value: handoffVerification.captain_handoff_notes ?? 'لا توجد' },
                ]}
              />
            </Surface>

            {walletImpactVisibility ? (
              <Surface tone="inset" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
                <SectionHeader title="الأثر المالي الظاهر" subtitle="يعرض الرصيد/الاسترداد/التعويض فقط من دون أي تنفيذ مالي." />
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
              </Surface>
            ) : null}
          </>
        )}

        <OrderLinkedChat
          title="الدردشة مع الكابتن"
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
          inputLabel="رسالة إلى الكابتن"
          inputPlaceholder="اكتب رسالتك هنا"
          value={draftMessage}
          onChangeText={setDraftMessage}
          sendLabel={chatSendLabel}
          onSend={handleSendMessage}
          sendDisabled={!canSendMessage}
          disabledReason={phase === 'received' ? 'الدردشة أغلقت بعد استلام العميل للطلب.' : !canSendMessage ? 'أضف نصًا أو اختر مرفقًا واحدًا على الأقل.' : undefined}
        />

        <DeferredReviewBlock
          title="تقييم المنتج"
          subtitle="يظهر بعد استلام العميل للطلب، ويبقى مضغوطًا قبل ذلك."
          enabled={hasClientReceived}
          placeholderText="سيظهر تقييم المنتج بعد الاستلام."
          currentValueLabel={productRatingLabel}
          stateLabel={reviewStateLabel}
          helperText={productHelperText}
          value={productRating}
          onChange={handleProductRatingChange}
          submitted={ratingsSubmitted}
        />

        <DeferredReviewBlock
          title="تقييم الكابتن"
          subtitle="يبقى مؤجلًا حتى يكتمل الاستلام من العميل."
          enabled={hasClientReceived}
          placeholderText="سيظهر تقييم الكابتن بعد الاستلام."
          currentValueLabel={captainRatingLabel}
          stateLabel={reviewStateLabel}
          helperText={captainHelperText}
          value={captainRating}
          onChange={handleCaptainRatingChange}
          submitted={ratingsSubmitted}
          placeholderTone="brand"
        />

        {hasClientReceived && (onSupport || onNextAction || onReorder || proofVisibility.customer_visible) ? (
          <Surface tone="inset" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
            <Text role="bodyStrong" style={{ textAlign: 'right' }}>ما بعد التسليم</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              بعد اكتمال التسليم يمكنك الإبلاغ عن مشكلة أو الانتقال إلى الإجراء التالي المتاح من دون مغادرة هذا المسار.
            </Text>
            <KeyValueList
              items={[
                { label: 'نوع الإثبات الظاهر', value: formatProofType(proofVisibility.proof_type), tone: proofVisibility.customer_visible ? 'success' : 'default' },
                { label: 'نتيجة التحقق', value: formatVerificationResult(proofVisibility.verification_result) },
              ]}
            />
            <Box gap={2}>
              {onReorder ? <Button label="إعادة الطلب" onPress={onReorder} /> : null}
              {onSupport ? <Button label="الدعم أو الإبلاغ عن مشكلة" tone="secondary" onPress={onSupport} /> : null}
              {onNextAction ? <Button label="الانتقال إلى الطلبات" onPress={onNextAction} /> : null}
            </Box>
          </Surface>
        ) : null}

        <View style={{ height: spacing[1] }} />
      </MobileScrollView>

      <StickyActionBar
        primaryAction={{
          label: primaryActionLabel,
          onPress: handlePrimaryAction,
          disabled: primaryActionDisabled,
        }}
        secondaryAction={secondaryAction}
        note={stickyNote}
        onHeightChange={setActionBarHeight}
      />
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
  const lifecycleStatus = buildDefaultLifecycleStatus(clientState);
  const eventTimeline = buildDefaultEventTimeline(clientState, timeline);
  const proofVisibility = buildDefaultProofOfDelivery(clientState);
  const handoffVerification = buildDefaultHandoffVerification();
  const walletImpactVisibility = buildDefaultWalletImpact(clientState);
  const exceptionReason = getDefaultExceptionReason(clientState);
  const serviceabilityQuote = buildDefaultServiceabilityQuote(clientState);
  const fulfillmentModeSnapshot = buildDefaultFulfillmentModeSnapshot(clientState);
  const supportTitle = trackingStateMeta.isException ? 'الدعم مطلوب الآن' : 'الدعم والرجوع';
  const supportDescription = trackingStateMeta.isException
    ? 'هذه الحالة تحتاج متابعة دعم واضحة قبل أي خطوة لاحقة. استخدم زر الدعم الآن لشرح المشكلة ومتابعة الحل.'
    : 'إذا احتجت مراجعة إضافية أو دعمًا سريعًا، يمكنك الانتقال من هنا دون كسر المسار.';
  const supportButtonLabel = trackingStateMeta.isException ? 'طلب الدعم الآن' : 'الدعم';

  return (
    <MobileScrollView padding={4} gap={3} contentContainerStyle={{ paddingBottom: spacing[4] }}>
      <Surface tone="brand" gap={2} padding={3} style={{ borderRadius: 24, borderWidth: 1, borderColor: theme.brand }}>
        <Box gap={1} style={{ alignItems: 'flex-end' }}>
          <Badge label={currentStatusLabel} tone="info" />
          <Text role="titleLg" style={{ textAlign: 'right' }}>{trackingStateMeta.title}</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {trackingStateMeta.description}
          </Text>
        </Box>
      </Surface>

      <Surface tone="raised" gap={3} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <SectionHeader title="الحالة الحالية" subtitle="آخر محطة مرئية الآن في مسار التنفيذ." />
        <KeyValueList
          items={[
            { label: 'المرحلة الحالية', value: activeItem?.title ?? currentStatusLabel, tone: 'brand' },
            { label: 'الخطوة التالية', value: timeline[activeTimelineIndex + 1]?.title ?? trackingStateMeta.label, tone: 'success' },
            { label: 'آخر تحديث', value: activeItem?.detail ?? 'مباشر' },
          ]}
        />
      </Surface>

      <Surface tone="raised" gap={3} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <SectionHeader title="المسار المباشر" subtitle="يظهر كل انتقال بوضوح حتى يبقى السياق بسيطًا." />
        <Box gap={2}>
          {timeline.map((step, index) => {
            const isActive = !step.done && index === activeTimelineIndex;
            const isDone = step.done;
            const backgroundColor = isActive ? theme.brandSurface : isDone ? theme.successSurface : theme.surfaceRaised;
            const borderColor = isActive ? theme.brand : theme.line;
            const iconName = isDone ? 'checkmark' : isActive ? 'ellipse' : 'ellipse-outline';

            return (
              <Surface
                key={step.id}
                tone={isActive ? 'brand' : 'raised'}
                gap={0}
                padding={2}
                style={{ borderRadius: 18, borderWidth: 1, borderColor, backgroundColor }}
              >
                <Box layoutDirection="row" align="center" gap={2} style={{ flexDirection: 'row-reverse' }}>
                  <View style={{ width: 28, alignItems: 'center' }}>
                    <Ionicons name={iconName as any} size={18} color={isActive ? theme.brand : isDone ? theme.success : theme.textSoft} />
                  </View>

                  <Box gap={0} style={{ flex: 1 }}>
                    <Text role="bodyStrong" style={{ textAlign: 'right' }}>{step.title}</Text>
                    <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{step.detail}</Text>
                  </Box>

                  <Chip label={isDone ? 'تم' : isActive ? 'الآن' : 'قادم'} tone={isActive ? 'brand' : isDone ? 'success' : 'default'} />
                </Box>
              </Surface>
            );
          })}
        </Box>
      </Surface>

      <Surface tone="raised" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <SectionHeader title="التحقق والحالة التشغيلية" subtitle="سبب الاستثناء، إثبات التسليم، وتعليمات التسليم تبقى ضمن نفس شاشة التتبع." />
        <KeyValueList
          items={[
            { label: 'الحالة التشغيلية', value: formatDeliveryLifecycleStatus(lifecycleStatus), tone: 'brand' },
            { label: 'نوع الإثبات', value: formatProofType(proofVisibility.proof_type) },
            { label: 'نتيجة التحقق', value: formatVerificationResult(proofVisibility.verification_result) },
            { label: 'مرجع الاستلام', value: handoffVerification.pickup_reference ?? 'غير متوفر' },
            { label: 'OTP التسليم', value: handoffVerification.dropoff_otp ?? 'غير متوفر' },
            { label: 'ملاحظات الكابتن', value: handoffVerification.captain_handoff_notes ?? 'لا توجد' },
          ]}
        />
        {exceptionReason ? (
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            سبب الحالة الحالية: {formatExceptionReason(exceptionReason)}
          </Text>
        ) : null}
      </Surface>

      <Surface tone="raised" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <SectionHeader title="سجل الأحداث" subtitle="يربط كل محطة بالفاعل والوقت وسبب الاستثناء إن وجد." />
        <Box gap={2}>
          {eventTimeline.map((eventItem) => (
            <ListItem
              key={eventItem.event_id}
              title={formatDeliveryLifecycleStatus(eventItem.to_status)}
              subtitle={eventItem.notes ?? 'لا توجد ملاحظات إضافية'}
              meta={eventItem.timestamp}
              badgeLabel={eventItem.reason_code ? formatExceptionReason(eventItem.reason_code) : eventItem.actor_role}
            />
          ))}
        </Box>
      </Surface>

      {(clientState === 'payment_failed' || clientState === 'area_unserviceable' || clientState === 'item_unavailable') ? (
        <Surface tone="inset" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
          <SectionHeader title="سبب توقف الإكمال" subtitle="توضيح صريح لحالة التسعير/العنوان/توفر العناصر دون ربط backend إضافي." />
          <KeyValueList
            items={[
              { label: 'داخل التغطية', value: serviceabilityQuote.inside_coverage ? 'نعم' : 'لا' },
              { label: 'توفر العناصر', value: serviceabilityQuote.items_available ? 'متوفرة' : 'غير متوفرة' },
              { label: 'حالة المتجر', value: serviceabilityQuote.store_open ? 'مفتوح' : 'مغلق' },
              { label: 'نمط التنفيذ', value: formatFulfillmentMode(fulfillmentModeSnapshot.mode) },
              { label: 'السعة الحالية', value: formatCapacityState(fulfillmentModeSnapshot.capacity_state) },
            ]}
          />
        </Surface>
      ) : null}

      {walletVisibilityCopy ? (
        <Surface tone="inset" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
          <Text role="bodyStrong" style={{ textAlign: 'right' }}>{walletVisibilityCopy.title}</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {walletVisibilityCopy.description}
          </Text>
        </Surface>
      ) : null}

      {walletImpactVisibility ? (
        <Surface tone="inset" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
          <SectionHeader title="الأثر المالي الظاهر" subtitle="ملخص مالي توضيحي فقط دون أي تنفيذ wallet/runtime." />
          <KeyValueList
            items={[
              { label: 'المبلغ المدفوع', value: `${walletImpactVisibility.paid_amount} ر.ي` },
              { label: 'رسوم التوصيل', value: `${walletImpactVisibility.delivery_fee} ر.ي` },
              { label: 'الخصم', value: `${walletImpactVisibility.discount} ر.ي` },
              { label: 'تعويض ظاهر', value: `${walletImpactVisibility.compensation} ر.ي` },
              { label: 'استرداد معلق', value: `${walletImpactVisibility.refund_pending} ر.ي` },
              { label: 'استرداد مكتمل', value: `${walletImpactVisibility.refund_completed} ر.ي`, tone: 'success' },
            ]}
          />
          {walletImpactVisibility.note ? <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{walletImpactVisibility.note}</Text> : null}
        </Surface>
      ) : null}

      <Surface tone="inset" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <Text role="bodyStrong" style={{ textAlign: 'right' }}>{supportTitle}</Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          {supportDescription}
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

export function DshOrdersListScreen({ items = fallbackOrderListItems, query = '', onQueryChange, onOpenOrder, onBack, onRetry, onNextAction }: DshOrdersListScreenProps) {
  const { theme } = useTheme();
  const normalizedQuery = normalizeText(query);
  const visibleItems = normalizedQuery
    ? items.filter((item) => normalizeText(`${item.title} ${item.subtitle} ${item.statusLabel} ${item.meta}`).includes(normalizedQuery))
    : items;

  return (
    <MobileScrollView padding={4} gap={3} contentContainerStyle={{ paddingBottom: spacing[4] }}>
      <Box gap={1}>
        <Text role="titleLg">الطلبات</Text>
        <Text role="bodySm" tone="muted">قائمة مختصرة للطلبات الحديثة مع حالة واضحة في كل صف.</Text>
      </Box>

      <Surface tone="brand" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.brand }}>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <OrdersListStatCard label="الكل" value={String(items.length)} helperText="كل الطلبات المرئية" />
          <OrdersListStatCard label="المطابق للبحث" value={String(visibleItems.length)} helperText="النتائج الحالية" />
        </Box>
      </Surface>

      <Surface tone="raised" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <SearchField label="بحث في الطلبات" value={query} onChangeText={onQueryChange} hint="جرّب عنوانًا أو حالة أو ملاحظة." />
        <SectionHeader title="الصفوف الحالية" subtitle="اضغط على أي طلب لفتح تتبعه مباشرة." count={visibleItems.length} />

        <Box gap={2}>
          {visibleItems.length ? visibleItems.map((item) => <OrderRow key={item.id} item={item} onOpenOrder={onOpenOrder} />) : (
            <Card title="لا توجد نتائج" subtitle="جرّب كلمة مختلفة أو أعد عرض الكل.">
              <Box gap={2}>
                {onQueryChange ? <Button label="إظهار الكل" onPress={() => onQueryChange('')} /> : null}
                {onBack ? <Button label="العودة" tone="secondary" onPress={onBack} /> : null}
                {onRetry ? <Button label="إعادة المحاولة" tone="ghost" onPress={onRetry} /> : null}
              </Box>
            </Card>
          )}
        </Box>
      </Surface>

      <Surface tone="inset" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <Text role="bodyStrong" style={{ textAlign: 'right' }}>الخطوة التالية</Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          اذهب إلى التتبع لعرض الحالة الحية أو استخدم العودة للخروج من هذا المسار.
        </Text>
        <Box gap={2}>
          {onNextAction ? <Button label="التتبع" onPress={onNextAction} /> : null}
          {onBack ? <Button label="العودة" tone="secondary" onPress={onBack} /> : null}
        </Box>
      </Surface>
    </MobileScrollView>
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

export function DshTrackingScreen({ values = defaultCreateOrderValues, clientState = 'tracking_active', currentStatusLabel, timeline = [], onSupport, onRetry, onNextAction, onReorder }: DshTrackingScreenProps) {
  const trackingStateMeta = getDshClientStateMeta(clientState);
  const fallbackTimeline: DshTrackingTimelineItem[] = timeline.length
    ? timeline
    : clientState === 'tracking_active'
      ? deliveryJourneySteps.map((step, index) => ({ id: step.id, title: step.title, detail: step.detail, done: index === 0 }))
      : [{ id: clientState, title: trackingStateMeta.title, detail: trackingStateMeta.description, done: false }];

  if (clientState === 'delivered') {
    return (
      <CreateOrderJourneyScreen
        values={values}
        timeline={fallbackTimeline}
        clientState={clientState}
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
    <CreateOrderJourneyScreen
      values={values}
      timeline={fallbackTimeline}
      clientState={clientState}
      initialPhase="route"
      currentStatusLabel={currentStatusLabel ?? trackingStateMeta.label}
      onSupport={onSupport}
      onNextAction={onNextAction}
      onReorder={onReorder}
      onBack={onSupport ?? onNextAction ?? onRetry}
    />
  );
}

export default {};
