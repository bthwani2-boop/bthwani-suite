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

export type DshCreateOrderScreenProps = {
  screenId?: string;
  state?: DshOperationScreenState;
  clientState?: DshClientState;
  values?: CreateOrderValues;
  timeline?: DshTrackingTimelineItem[];
  onChange?: (field: keyof CreateOrderValues, value: string) => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onContinue?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
};

export type DshOrderSuccessStateProps = {
  clientState?: DshClientState;
  onNext?: () => void;
};

export type DshTrackingScreenProps = {
  values?: CreateOrderValues;
  clientState?: DshClientState;
  currentStatusLabel?: string;
  timeline?: DshTrackingTimelineItem[];
  onBell?: () => void;
  onSupport?: () => void;
  onRetry?: () => void;
  onNextAction?: () => void;
};

export type DshFlowHubScreenProps = {
  screenId?: string;
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export type DshIntakeHubScreenProps = DshFlowHubScreenProps;
export type DshDeliveryManagementHubScreenProps = DshFlowHubScreenProps;


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
  { id: 'order-route', title: 'طلب في الطريق', subtitle: 'تم التعيين ويظهر المسار الحي الآن', statusLabel: 'في الطريق', meta: 'Live' },
  { id: 'order-done', title: 'طلب مكتمل', subtitle: 'تم التسليم ويمكن الرجوع إليه لاحقًا', statusLabel: 'تم التسليم', meta: 'أرشيف' },
];

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function StageRail({ activeStepId, steps }: { activeStepId: string; steps: JourneyStep[] }) {
  const { theme } = useTheme();
  const activeIndex = Math.max(0, steps.findIndex((step) => step.id === activeStepId));

  return (
    <Box gap={2}>
      {steps.map((step, index) => {
        const isDone = index < activeIndex;
        const isActive = index === activeIndex;
        const indicatorTone = isActive ? theme.brand : isDone ? theme.success : theme.line;

        return (
          <Box key={step.id} layoutDirection="row" gap={2} align="center" style={{ flexDirection: 'row-reverse' }}>
            <View style={{ width: 24, alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: indicatorTone,
                }}
              >
                {isDone ? <Ionicons name="checkmark" size={12} color={theme.brandContrast} /> : <Text role="caption" style={{ color: isActive ? theme.brandContrast : theme.text }}>{index + 1}</Text>}
              </View>
              {index < steps.length - 1 ? (
                <View style={{ width: 2, flex: 1, minHeight: 28, marginTop: 4, marginBottom: -4, backgroundColor: isDone ? theme.success : theme.line }} />
              ) : null}
            </View>

            <Surface
              tone={isActive ? 'brand' : 'raised'}
              padding={2}
              gap={0}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: isActive ? theme.brand : theme.line,
                backgroundColor: isActive ? theme.brandSurface : theme.surfaceRaised,
              }}
            >
              <Text role="bodyStrong" style={{ textAlign: 'right' }}>{step.title}</Text>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{step.detail}</Text>
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
        id: `chat-customer-${Date.now()}`,
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

          const isCustomer = message.align === 'end';

          return (
            <View key={message.id} style={{ alignSelf: isCustomer ? 'flex-end' : 'flex-start', width: '88%' }}>
              <Surface
                tone={isCustomer ? 'brand' : 'raised'}
                padding={2}
                gap={1}
                style={{
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: isCustomer ? theme.brand : theme.line,
                  backgroundColor: isCustomer ? theme.brandSurface : theme.surfaceRaised,
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

function renderCheckoutGate(
  screenId?: string,
  state: DshOperationScreenState = 'ready',
  clientState: DshClientState = 'checkout_ready',
  onPrimaryAction?: () => void,
  onSecondaryAction?: () => void,
  onRetry?: () => void,
) {
  const { theme } = useTheme();
  const checkoutStateMeta = getDshClientStateMeta(clientState);
  const paymentPendingMeta = getDshClientStateMeta('payment_pending');
  const orderCreatedMeta = getDshClientStateMeta('order_created');
  const walletVisibilityCopy = getClientWalletVisibilityCopy(checkoutStateMeta);
  const gateCopy = {
    title: checkoutStateMeta.title,
    subtitle: checkoutStateMeta.description,
    primaryActionLabel: 'متابعة إلى المراجعة',
    secondaryActionLabel: 'العودة إلى الدعم',
    sectionTitle: 'ما الذي يثبت الآن؟',
    sectionSubtitle: 'تسلسل الجاهزية والدفع وإنشاء الطلب يبقى ظاهرًا داخل نفس المسار.',
  };

  return (
    <DshOperationScreen
      state={state}
      title={gateCopy.title}
      subtitle={gateCopy.subtitle}
      primaryActionLabel={gateCopy.primaryActionLabel}
      secondaryActionLabel={gateCopy.secondaryActionLabel}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      content={
        <Box gap={3}>
          <OperationalStatusHero
            statusLabel={checkoutStateMeta.label}
            statusTone={clientState === 'payment_pending' ? 'warning' : 'brand'}
            title={gateCopy.title}
            summary={gateCopy.subtitle}
            routeLabel="المسار"
            routeValue={screenId ?? 'checkout-gate'}
            nextStepLabel="النتيجة المتوقعة"
            nextStepValue={paymentPendingMeta.label}
          />
          <CompactStatusStepper
            title="المسار المختصر"
            subtitle="الجاهزية تسبق الدفع ثم ينتقل الطلب إلى الإنشاء المؤكد."
            steps={[
              { id: 'checkout-ready', title: checkoutStateMeta.label, state: 'current' as const },
              { id: 'payment-pending', title: paymentPendingMeta.label, state: 'next' as const },
              { id: 'order-created', title: orderCreatedMeta.label, state: 'next' as const },
            ]}
          />
          <KeyValueDetails
            title={gateCopy.sectionTitle}
            subtitle={gateCopy.sectionSubtitle}
            items={[
              { label: 'المسار', value: screenId ?? 'checkout-gate', tone: 'brand' },
              { label: 'المرحلة الحالية', value: checkoutStateMeta.label, tone: 'brand' },
              { label: 'المرحلة التالية', value: paymentPendingMeta.label },
              { label: 'النتيجة المتوقعة', value: orderCreatedMeta.label, tone: 'success' },
            ]}
          />
          {checkoutStateMeta.isException ? (
            <Surface tone="inset" gap={1} padding={2} style={{ borderRadius: 18, borderWidth: 1, borderColor: theme.line }}>
              <Text role="bodyStrong" style={{ textAlign: 'right' }}>متابعة الدعم</Text>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                هذه الحالة تتطلب متابعة دعم واضحة قبل استكمال أي خطوة لاحقة داخل هذا المسار.
              </Text>
            </Surface>
          ) : null}
          {walletVisibilityCopy ? (
            <Surface tone="inset" gap={1} padding={2} style={{ borderRadius: 18, borderWidth: 1, borderColor: theme.line }}>
              <Text role="bodyStrong" style={{ textAlign: 'right' }}>{walletVisibilityCopy.title}</Text>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                {walletVisibilityCopy.description}
              </Text>
            </Surface>
          ) : null}
        </Box>
      }
    />
  );
}

type CreateOrderJourneyScreenProps = {
  values: CreateOrderValues;
  timeline: DshTrackingTimelineItem[];
  clientState?: DshClientState;
  onBack?: () => void;
  onBell?: () => void;
  onSupport?: () => void;
  onNextAction?: () => void;
  initialPhase?: JourneyPhase;
  currentStatusLabel?: string;
};

function CreateOrderJourneyScreen({ values, timeline, clientState = 'tracking_active', onBack, onBell, onSupport, onNextAction, initialPhase = 'route', currentStatusLabel }: CreateOrderJourneyScreenProps) {
  const { theme } = useTheme();
  const [phase, setPhase] = React.useState<JourneyPhase>(initialPhase);
  const [productRating, setProductRating] = React.useState(0);
  const [captainRating, setCaptainRating] = React.useState(0);
  const [ratingsSubmitted, setRatingsSubmitted] = React.useState(false);
  const [draftMessage, setDraftMessage] = React.useState('');
  const [draftAttachments, setDraftAttachments] = React.useState<OrderChatAttachmentKind[]>([]);
  const [actionBarHeight, setActionBarHeight] = React.useState(0);
  const [lastChatMessage, setLastChatMessage] = React.useState<OrderChatMessage>({
    id: 'chat-captain-1',
    senderLabel: 'الكابتن المكلّف',
    body: 'إذا احتجت صورة أو فيديو أو رسالة صوتية للمنتج فأرسلها هنا ضمن نفس الطلب.',
    time: 'قبل قليل',
    tone: 'info',
    align: 'start',
    attachments: ['camera', 'video', 'voice'],
  });
  const clientStateMeta = getDshClientStateMeta(clientState);
  const paymentPendingMeta = getDshClientStateMeta('payment_pending');
  const orderCreatedMeta = getDshClientStateMeta('order_created');
  const orderConfirmedMeta = getDshClientStateMeta('order_confirmed');
  const isDeliveredState = clientState === 'delivered';
  const isTrackingJourneyState = clientState === 'tracking_active' || isDeliveredState;
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
        { id: 'checkout-ready', title: clientStateMeta.label, state: 'current' as const },
        { id: 'payment-pending', title: paymentPendingMeta.label, state: 'next' as const },
        { id: 'order-created', title: orderCreatedMeta.label, state: 'next' as const },
        { id: 'order-confirmed', title: orderConfirmedMeta.label, state: 'next' as const },
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
    : clientState === 'checkout_ready'
      ? `${paymentPendingMeta.label} ثم ${orderCreatedMeta.label}`
      : clientState === 'payment_pending'
        ? orderCreatedMeta.label
        : clientState === 'order_created'
          ? orderConfirmedMeta.label
          : clientState === 'order_confirmed'
            ? 'افتح صفحة التتبع لمتابعة التنفيذ.'
            : clientStateMeta.description;
  const hasCustomerReceived = phase === 'received';
  const canSubmitRatings = hasCustomerReceived && productRating > 0 && captainRating > 0;
  const productRatingLabel = productRating > 0 ? `${productRating}/5` : 'غير محدد';
  const captainRatingLabel = captainRating > 0 ? `${captainRating}/5` : 'غير محدد';
  const compactSteps = journeySteps as Array<{ id: string; title: string; state: 'done' | 'current' | 'next' }>;
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

  const primaryActionLabel = phase === 'route'
    ? 'وصل الطلب للعميل'
    : phase === 'arrived'
      ? 'استلم العميل الطلب'
      : ratingsSubmitted
        ? 'تم إرسال التقييمين'
        : 'إرسال التقييمين';
  const primaryActionDisabled = phase === 'received' && (!canSubmitRatings || ratingsSubmitted);
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
  const stickyNote = phase === 'route'
    ? 'يمكنك تثبيت الوصول من الزر الرئيسي عند وصول الطلب.'
    : phase === 'arrived'
      ? 'ثبّت الاستلام لتظهر التقييمات داخل نفس الصفحة.'
      : ratingsSubmitted
        ? 'تم حفظ التقييمين ولا توجد خطوة إضافية مطلوبة.'
        : 'لن يتفعّل الإرسال حتى تختار تقييم المنتج والكابتن.';
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
      id: `chat-customer-${Date.now()}`,
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

  const secondaryAction = phase === 'route' && onBell
    ? { label: 'جرس الوصول', onPress: onBell, tone: 'secondary' as const }
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

        <CompactStatusStepper
          title="المسار الحي"
          subtitle="ثلاث مراحل واضحة دون بطاقات ضخمة أو نصوص مكررة."
          steps={compactSteps}
        />

        <KeyValueDetails
          title="تفاصيل الطلب"
          subtitle="المعلومات المهمة فقط، بشكل مضغوط وقابل للقراءة."
          items={orderDetailsItems}
        />

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
          enabled={hasCustomerReceived}
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
          enabled={hasCustomerReceived}
          placeholderText="سيظهر تقييم الكابتن بعد الاستلام."
          currentValueLabel={captainRatingLabel}
          stateLabel={reviewStateLabel}
          helperText={captainHelperText}
          value={captainRating}
          onChange={handleCaptainRatingChange}
          submitted={ratingsSubmitted}
          placeholderTone="brand"
        />

        {hasCustomerReceived && (onSupport || onNextAction) ? (
          <Surface tone="inset" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
            <Text role="bodyStrong" style={{ textAlign: 'right' }}>ما بعد التسليم</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              بعد اكتمال التسليم يمكنك الإبلاغ عن مشكلة أو الانتقال إلى الإجراء التالي المتاح من دون مغادرة هذا المسار.
            </Text>
            <Box gap={2}>
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

function renderOrderSuccess(clientState: DshClientState = 'order_confirmed', onNext?: () => void) {
  const successStateMeta = getDshClientStateMeta(clientState);
  const checkoutReadyMeta = getDshClientStateMeta('checkout_ready');
  const orderCreatedMeta = getDshClientStateMeta('order_created');
  const trackingStateMeta = getDshClientStateMeta('tracking_active');

  return (
    <MobileScrollView padding={4} gap={3} contentContainerStyle={{ paddingBottom: spacing[4] }}>
      <OperationalStatusHero
        statusLabel={successStateMeta.label}
        statusTone={clientState === 'order_confirmed' ? 'success' : 'brand'}
        title={successStateMeta.title}
        summary={successStateMeta.description}
        nextStepLabel="الإجراء التالي"
        nextStepValue={trackingStateMeta.label}
      />

      <CompactStatusStepper
        title="المسار التالي"
        subtitle="الطلب خرج من الجاهزية إلى الإنشاء ثم أصبح جاهزًا للتتبع."
        steps={[
          { id: 'checkout-ready', title: checkoutReadyMeta.label, state: 'done' as const },
          { id: 'order-created', title: orderCreatedMeta.label, state: clientState === 'order_created' ? 'current' as const : 'done' as const },
          { id: 'tracking-active', title: trackingStateMeta.label, state: 'next' as const },
        ]}
      />

      <Button label="عرض التتبع" disabled={!onNext} onPress={() => onNext?.()} />
    </MobileScrollView>
  );
}

function renderTracking(
  clientState: DshClientState,
  currentStatusLabel: string,
  timeline: DshTrackingTimelineItem[],
  onSupport?: () => void,
  onNextAction?: () => void,
) {
  const { theme } = useTheme();
  const trackingStateMeta = getDshClientStateMeta(clientState);
  const activeTimelineIndex = Math.max(0, timeline.findIndex((item) => !item.done));
  const activeItem = timeline[activeTimelineIndex] ?? timeline[timeline.length - 1];
  const walletVisibilityCopy = getClientWalletVisibilityCopy(trackingStateMeta);
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
            { label: 'آخر تحديث', value: activeItem?.detail ?? 'Live' },
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

      {walletVisibilityCopy ? (
        <Surface tone="inset" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
          <Text role="bodyStrong" style={{ textAlign: 'right' }}>{walletVisibilityCopy.title}</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {walletVisibilityCopy.description}
          </Text>
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

export function DshCreateOrderScreen({
  screenId,
  state = 'ready',
  clientState = 'checkout_ready',
  values = defaultCreateOrderValues,
  timeline = [],
  onPrimaryAction,
  onSecondaryAction,
  onContinue,
  onBack,
  onRetry,
}: DshCreateOrderScreenProps) {
  if (screenId) {
    return renderCheckoutGate(screenId, state, clientState, onPrimaryAction, onSecondaryAction, onRetry);
  }

  return <CreateOrderJourneyScreen values={values} timeline={timeline} clientState={clientState} initialPhase="route" onBack={onBack ?? onSecondaryAction} />;
}

export function DshIntakeHubScreen({ state = 'ready', screenId = 'intake-workspace', onPrimaryAction, onSecondaryAction, onRetry }: DshIntakeHubScreenProps) {
  return (
    <DshOperationScreen
      state={state}
      title="Intake workspace"
      subtitle="Unified workspace for preparing external, manual, and estimate-based delivery requests before order creation."
      content={
        <Surface tone="inset" gap={2}>
          <Text role="bodyStrong">Current flow</Text>
          <Text role="bodySm" tone="muted">{screenId}</Text>
          <Text role="bodySm" tone="muted">This is an active flow screen with executable state coverage.</Text>
        </Surface>
      }
      primaryActionLabel="Continue order creation"
      secondaryActionLabel="Back to operations"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction ?? onRetry}
      onRetry={onRetry}
    />
  );
}


export function DshOrderSuccessState({ clientState = 'order_confirmed', onNext }: DshOrderSuccessStateProps) {
  return renderOrderSuccess(clientState, onNext);
}

export function DshTrackingScreen({ values = defaultCreateOrderValues, clientState = 'tracking_active', currentStatusLabel, timeline = [], onBell, onSupport, onRetry, onNextAction }: DshTrackingScreenProps) {
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
        onBack={onNextAction ?? onRetry}
      />
    );
  }

  if (clientState !== 'tracking_active') {
    return renderTracking(clientState, currentStatusLabel ?? trackingStateMeta.label, fallbackTimeline, onSupport, onNextAction);
  }

  return (
    <CreateOrderJourneyScreen
      values={values}
      timeline={fallbackTimeline}
      clientState={clientState}
      initialPhase="route"
      currentStatusLabel={currentStatusLabel ?? trackingStateMeta.label}
      onBell={onBell}
      onSupport={onSupport}
      onNextAction={onNextAction}
      onBack={onSupport ?? onNextAction ?? onRetry}
    />
  );
}

export function DshDeliveryManagementHubScreen({ state = 'ready', screenId = 'delivery-management-workspace', onPrimaryAction, onSecondaryAction, onRetry }: DshDeliveryManagementHubScreenProps) {
  return (
    <DshOperationScreen
      state={state}
      title="Delivery management"
      subtitle="Workspace for delivery attempts, reassignment, closing, and customer-facing tracking decisions."
      content={
        <Surface tone="inset" gap={2}>
          <Text role="bodyStrong">Current flow</Text>
          <Text role="bodySm" tone="muted">{screenId}</Text>
          <Text role="bodySm" tone="muted">This is an active flow screen with executable state coverage.</Text>
        </Surface>
      }
      primaryActionLabel="Open tracking"
      secondaryActionLabel="Back to operations"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction ?? onRetry}
      onRetry={onRetry}
    />
  );
}


export default {};
