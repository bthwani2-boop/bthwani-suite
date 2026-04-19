import React from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  BthBadge,
  BthBox,
  BthButton,
  BthCard,
  BthChip,
  BthKeyValueList,
  BthListItem,
  BthMobileScrollView,
  BthSearchField,
  BthSectionHeader,
  BthStatCard,
  BthTextField,
  BthSurface,
  BthText,
  spacing,
  useTheme,
} from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../patterns/screens/DshOperationScreen';

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

type OrderChatAttachmentKind = 'image' | 'video' | 'voice';

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
};

export type DshCreateOrderScreenProps = {
  screenId?: string;
  state?: DshOperationScreenState;
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
  onNext?: () => void;
};

export type DshTrackingScreenProps = {
  values?: CreateOrderValues;
  currentStatusLabel?: string;
  timeline?: DshTrackingTimelineItem[];
  onBell?: () => void;
  onSupport?: () => void;
  onRetry?: () => void;
  onNextAction?: () => void;
};

export type DshDeliveryManagementHubScreenProps = {
  onBack?: () => void;
};

const defaultCreateOrderValues: CreateOrderValues = {
  pickupAddress: 'رياض بارك، البوابة 2',
  dropoffAddress: 'العليا، طريق الملك فهد',
  contactName: 'أحمد',
  contactPhone: '0501234567',
  note: 'لا توجد ملاحظات',
};

const deliveryJourneySteps: JourneyStep[] = [
  { id: 'route', title: 'في الطريق', detail: 'الطلب متجه إلى العميل ويظهر المسار الآن.' },
  { id: 'arrived', title: 'وصل للعميل', detail: 'وصل الطلب إلى العميل وأصبح بانتظار الاستلام.' },
  { id: 'received', title: 'استلم العميل الطلب', detail: 'بعد الاستلام تظهر التقييمات في نفس الشاشة.' },
];

const orderChatAttachmentOptions: Record<OrderChatAttachmentKind, OrderChatAttachment> = {
  image: {
    kind: 'image',
    label: 'صورة',
    selectedLabel: 'صورة مرفقة',
    detail: 'أرفق صورة للمنتج أو الغلاف',
    tone: 'brand',
    iconName: 'image-outline',
  },
  video: {
    kind: 'video',
    label: 'فيديو',
    selectedLabel: 'فيديو مرفق',
    detail: 'أرفق فيديو قصير يوضح التفاصيل',
    tone: 'info',
    iconName: 'videocam-outline',
  },
  voice: {
    kind: 'voice',
    label: 'صوت',
    selectedLabel: 'رسالة صوتية',
    detail: 'سجل ملاحظة صوتية قصيرة',
    tone: 'warning',
    iconName: 'mic-outline',
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
    <BthBox gap={2}>
      {steps.map((step, index) => {
        const isDone = index < activeIndex;
        const isActive = index === activeIndex;
        const indicatorTone = isActive ? theme.brand : isDone ? theme.success : theme.line;

        return (
          <BthBox key={step.id} layoutDirection="row" gap={2} align="center" style={{ flexDirection: 'row-reverse' }}>
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
                {isDone ? <Ionicons name="checkmark" size={12} color={theme.brandContrast} /> : <BthText role="caption" style={{ color: isActive ? theme.brandContrast : theme.textStrong }}>{index + 1}</BthText>}
              </View>
              {index < steps.length - 1 ? (
                <View style={{ width: 2, flex: 1, minHeight: 28, marginTop: 4, marginBottom: -4, backgroundColor: isDone ? theme.success : theme.line }} />
              ) : null}
            </View>

            <BthSurface
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
              <BthText role="bodyStrong" style={{ textAlign: 'right' }}>{step.title}</BthText>
              <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{step.detail}</BthText>
            </BthSurface>
          </BthBox>
        );
      })}
    </BthBox>
  );
}

function OrdersListStatCard({ label, value, helperText }: { label: string; value: string; helperText: string }) {
  const { theme } = useTheme();

  return (
    <BthCard
      title={label}
      subtitle={helperText}
      style={{ flexBasis: '48%', flexGrow: 1, borderRadius: 18, borderWidth: 1, borderColor: theme.line }}
    >
      <BthText role="hero" style={{ color: theme.brand }}>{value}</BthText>
    </BthCard>
  );
}

function OrderRow({ item, onOpenOrder }: { item: DshOrderListItem; onOpenOrder?: (orderId: string) => void }) {
  const { theme } = useTheme();

  return (
    <BthListItem
      title={item.title}
      subtitle={item.subtitle}
      meta={item.meta}
      badgeLabel={item.statusLabel}
      onPress={() => onOpenOrder?.(item.id)}
      rightAccessory={
        <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: theme.brandSurface, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="chevron-back" size={18} color={theme.brand} />
        </View>
      }
    />
  );
}

function RatingStars({ value, disabled, onChange }: { value: number; disabled?: boolean; onChange: (nextValue: number) => void }) {
  const { theme } = useTheme();

  return (
    <BthBox layoutDirection="row" gap={1} style={{ flexDirection: 'row-reverse', justifyContent: 'flex-end', opacity: disabled ? 0.62 : 1 }}>
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
    </BthBox>
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
      attachments: ['image', 'video', 'voice'],
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
    <BthSurface tone="raised" gap={3} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
      <BthSectionHeader
        title="الدردشة مع الكابتن"
        subtitle={isClosed ? 'الدردشة مقفلة بعد التسليم، والسجل فقط ما يزال ظاهرًا.' : 'صوت، كاميرا، وفيديو داخل نفس الصندوق دون ضوضاء إضافية.'}
      />

      <BthBox gap={1} style={{ alignItems: 'flex-end' }}>
        <BthBadge label={isClosed ? 'الدردشة مقفلة' : 'مرتبطة بهذا الطلب'} tone={isClosed ? 'warning' : 'brand'} />
        <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          {isClosed ? 'بعد التسليم يبقى السجل فقط.' : 'اكتب الرسالة وأرفق بسرعة من نفس الصندوق.'}
        </BthText>
      </BthBox>

      <BthBox gap={2}>
        {chatMessages.map((message) => {
          if (message.align === 'center') {
            return (
              <BthSurface
                key={message.id}
                tone="inset"
                padding={2}
                gap={1}
                style={{ borderRadius: 18, borderWidth: 1, borderColor: theme.line, backgroundColor: theme.surfaceRaised }}
              >
                <BthBadge label={message.senderLabel} tone={message.tone} />
                <BthText role="bodySm" style={{ textAlign: 'right' }}>{message.body}</BthText>
              </BthSurface>
            );
          }

          const isCustomer = message.align === 'end';

          return (
            <View key={message.id} style={{ alignSelf: isCustomer ? 'flex-end' : 'flex-start', width: '88%' }}>
              <BthSurface
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
                <BthBox layoutDirection="row" gap={2} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <BthBadge label={message.senderLabel} tone={message.tone} />
                  <BthText role="caption" tone="muted">{message.time}</BthText>
                </BthBox>

                <BthText role="bodySm" style={{ textAlign: 'right' }}>{message.body}</BthText>

                {message.attachments?.length ? (
                  <BthBox layoutDirection="row" gap={1} style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {message.attachments.map((attachmentKind) => {
                      const attachment = orderChatAttachmentOptions[attachmentKind];

                      return (
                        <BthBadge
                          key={`${message.id}-${attachment.kind}`}
                          label={attachment.selectedLabel}
                          tone={attachment.tone}
                        />
                      );
                    })}
                  </BthBox>
                ) : null}
              </BthSurface>
            </View>
          );
        })}
      </BthBox>

      {!isClosed ? (
        <BthSurface tone="raised" gap={2} padding={2} style={{ borderRadius: 18, borderWidth: 1, borderColor: theme.line }}>
          <BthBox layoutDirection="row" gap={1} style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {([
              { kind: 'voice', label: 'صوت', iconName: 'mic-outline' as const },
              { kind: 'image', label: 'كاميرا', iconName: 'camera-outline' as const },
              { kind: 'video', label: 'فيديو', iconName: 'videocam-outline' as const },
            ] as const).map((action) => {
              const isSelected = draftAttachments.includes(action.kind);

              return (
                <BthButton
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
          </BthBox>

          <BthTextField
            label="رسالة إلى الكابتن"
            value={draftMessage}
            onChangeText={setDraftMessage}
            placeholder="اكتب رسالتك هنا"
            multiline
            numberOfLines={4}
            style={{ minHeight: 96, textAlignVertical: 'top' }}
          />

          <BthButton label={canSend ? sendButtonLabel : 'أضف نصًا أو مرفقًا'} onPress={handleSendMessage} disabled={!canSend} />
        </BthSurface>
      ) : (
        <BthSurface tone="inset" gap={1} padding={2} style={{ borderRadius: 18, borderWidth: 1, borderColor: theme.line }}>
          <BthBadge label="الدردشة مقفلة" tone="warning" />
          <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            لا يمكن إرسال رسائل جديدة بعد التسليم. يبقى السجل هنا للمراجعة فقط.
          </BthText>
        </BthSurface>
      )}
    </BthSurface>
  );
}

function renderCheckoutGate(screenId?: string, state: DshOperationScreenState = 'ready', onPrimaryAction?: () => void, onSecondaryAction?: () => void, onRetry?: () => void) {
  const gateCopy = {
    title: 'بوابة الإرسال إلى الطلب',
    subtitle: 'راجع الجاهزية النهائية قبل تحويله إلى حالة المراجعة المباشرة.',
    primaryActionLabel: 'متابعة إلى المراجعة',
    secondaryActionLabel: 'العودة إلى الدعم',
    sectionTitle: 'ما الذي يثبت الآن؟',
    sectionSubtitle: 'كل ما تحتاجه لقرار الإرسال يبقى مرئيًا دون ضوضاء.',
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
        <BthSurface tone="raised" gap={3} padding={2}>
          <BthSectionHeader title={gateCopy.sectionTitle} subtitle={gateCopy.sectionSubtitle} />
          <BthKeyValueList
            items={[
              { label: 'المسار', value: screenId ?? 'checkout-gate', tone: 'brand' },
              { label: 'المرحلة التالية', value: 'قيد المراجعة' },
              { label: 'النتيجة المتوقعة', value: 'التتبع المباشر بعد القبول', tone: 'success' },
            ]}
          />
          <StageRail activeStepId="route" steps={deliveryJourneySteps} />
        </BthSurface>
      }
    />
  );
}

type CreateOrderJourneyScreenProps = {
  values: CreateOrderValues;
  timeline: DshTrackingTimelineItem[];
  onBack?: () => void;
  onBell?: () => void;
  initialPhase?: 'route' | 'received';
  currentStatusLabel?: string;
};

function CreateOrderJourneyScreen({ values, timeline, onBack, onBell, initialPhase = 'route', currentStatusLabel }: CreateOrderJourneyScreenProps) {
  const { theme } = useTheme();
  const [phase, setPhase] = React.useState<'route' | 'received'>(initialPhase);
  const [productRating, setProductRating] = React.useState(0);
  const [captainRating, setCaptainRating] = React.useState(0);
  const [ratingsSubmitted, setRatingsSubmitted] = React.useState(false);
  const progress = React.useRef(new Animated.Value(0)).current;
  const note = normalizeText(values.note).length ? values.note : 'لا توجد ملاحظات';
  const timelineItems = timeline.length > 0
    ? timeline
    : deliveryJourneySteps.map((step, index) => ({
      id: step.id,
      title: step.title,
      detail: step.detail,
      done: index === 0,
    }));

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: phase === 'received' ? 1 : 0,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [phase, progress]);

  const reviewOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.28] });
  const reviewTranslateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const trackingOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });
  const trackingTranslateY = progress.interpolate({ inputRange: [0, 1], outputRange: [8, 0] });
  const activeTimelineIndex = phase === 'route' ? 0 : 2;
  const deliveryStatusLabel = currentStatusLabel ?? 'في الطريق';
  const hasCustomerReceived = phase === 'received';
  const canSubmitRatings = hasCustomerReceived && productRating > 0 && captainRating > 0;
  const productRatingLabel = productRating > 0 ? `${productRating}/5` : 'غير محدد';
  const captainRatingLabel = captainRating > 0 ? `${captainRating}/5` : 'غير محدد';
  const productRatingDelta = productRating > 0 ? 'المنتج' : 'اختر التقييم';
  const orderReceiptItems = [
    { label: 'وصول الطلب', value: phase === 'route' ? deliveryStatusLabel : 'وصل للعميل', tone: 'brand' as const },
    { label: 'استلام العميل', value: phase === 'route' ? 'بانتظار الاستلام' : 'استلم العميل الطلب', tone: 'success' as const },
    {
      label: 'الخطوة التالية',
      value: phase === 'route'
        ? 'سوف تظهر التقييمات بعد الاستلام'
        : ratingsSubmitted
          ? 'تم إرسال التقييمين داخل نفس الصفحة'
          : 'اختر التقييمين ثم أرسل من نفس الصفحة',
      tone: 'warning' as const,
    },
    { label: 'الطلب نفسه', value: `${values.pickupAddress || 'غير محدد'} → ${values.dropoffAddress || 'غير محدد'}` },
  ];

  const primaryActionLabel = phase === 'route' ? 'وصل الطلب للعميل' : ratingsSubmitted ? 'تم إرسال التقييمين' : 'إرسال التقييمين';
  const primaryActionDisabled = phase === 'received' && (!canSubmitRatings || ratingsSubmitted);
  const productHelperText = phase === 'route'
    ? 'هذا الحقل سيصبح نشطًا بعد وصول الطلب للعميل.'
    : ratingsSubmitted
      ? 'تم إرسال التقييمين. أي تعديل جديد سيعيد فتح الإرسال.'
      : 'اختر تقييم المنتج من 1 إلى 5 ثم أرسل التقييمين بالأسفل.';
  const captainHelperText = phase === 'route'
    ? 'تقييم الكابتن يظهر بعد استلام العميل للطلب.'
    : ratingsSubmitted
      ? 'تم إرسال التقييمين. يمكنك تعديل الكابتن ثم إعادة الإرسال.'
      : 'اختر تقييم الكابتن من 1 إلى 5 ثم أرسل التقييمين بالأسفل.';

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
      setPhase('received');
      return;
    }

    if (!canSubmitRatings || ratingsSubmitted) {
      return;
    }

    setRatingsSubmitted(true);
  };

  return (
    <BthMobileScrollView padding={4} gap={3} contentContainerStyle={{ paddingBottom: spacing[4] }}>
      <BthSurface
        tone="brand"
        gap={2}
        padding={3}
        style={{ borderRadius: 24, borderWidth: 1, borderColor: theme.brand, backgroundColor: theme.brandSurface }}
      >
        <Animated.View style={{ opacity: reviewOpacity, transform: [{ translateY: reviewTranslateY }] }}>
          <BthBox gap={1} style={{ alignItems: 'flex-end' }}>
            <BthBadge label={phase === 'route' ? deliveryStatusLabel : 'تم الاستلام'} tone={phase === 'route' ? 'warning' : 'success'} />
            <BthText role="titleLg" style={{ textAlign: 'right' }}>{phase === 'route' ? 'الطلب في الطريق إلى العميل' : 'وصل الطلب للعميل واستلمه'}</BthText>
            <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              {phase === 'route'
                ? 'عند الوصول والاستلام ستظهر التقييمات هنا مباشرة في نفس الشاشة.'
                : ratingsSubmitted
                  ? 'تم حفظ تقييم المنتج وتقييم الكابتن داخل نفس الصفحة.'
                  : 'العميل استلم الطلب، والآن قيّم المنتج والكابتن دون مغادرة الصفحة.'}
            </BthText>
          </BthBox>
        </Animated.View>

        <Animated.View style={{ opacity: trackingOpacity, transform: [{ translateY: trackingTranslateY }] }}>
          <BthSurface tone="inset" gap={1} padding={2} style={{ borderRadius: 18, borderWidth: 1, borderColor: theme.line, backgroundColor: phase === 'received' ? theme.surfaceRaised : theme.surface }}>
            <BthBox layoutDirection="row" align="center" gap={2} style={{ flexDirection: 'row-reverse' }}>
              <View style={{ width: 28, alignItems: 'center' }}>
                <Ionicons name={phase === 'route' ? 'hourglass-outline' : 'checkmark-circle-outline'} size={18} color={phase === 'route' ? theme.warning : theme.success} />
              </View>
              <BthBox gap={0} style={{ flex: 1 }}>
                <BthText role="bodyStrong" style={{ textAlign: 'right' }}>{phase === 'route' ? 'المرحلة التالية: وصول الطلب واستلام العميل' : 'المرحلة الحالية: التقييم داخل نفس الصفحة'}</BthText>
                <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                  {phase === 'route' ? 'يظهر الاستلام ثم التقييم من دون أي انتقال إضافي.' : 'التقييمان يظهران بعد الاستلام وبنفس الشاشة.'}
                </BthText>
              </BthBox>
            </BthBox>
          </BthSurface>
        </Animated.View>
      </BthSurface>

      <BthSurface tone="raised" gap={3} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <BthSectionHeader title={phase === 'route' ? 'في الطريق إلى العميل' : 'استلم العميل الطلب'} subtitle={phase === 'route' ? 'الوصول والاستلام سيظهران هنا فور الانتقال من الطريق.' : 'الآن ظهرت التقييمات بعد الاستلام داخل نفس الشاشة.'} />
        <BthKeyValueList items={orderReceiptItems} />
      </BthSurface>

      <BthSurface tone="raised" gap={3} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <BthSectionHeader title="مسار الحالة" subtitle="في الطريق ثم وصول العميل ثم الاستلام في صفحة واحدة فقط." />
        <StageRail activeStepId={phase === 'route' ? 'route' : 'received'} steps={deliveryJourneySteps} />
      </BthSurface>

      <BthSurface tone="raised" gap={3} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <BthSectionHeader title="تفاصيل الطلب" subtitle="بيانات فعلية مستقاة من الطلب نفسه." />
        <BthKeyValueList
          items={[
            { label: 'عنوان الاستلام', value: values.pickupAddress || 'غير محدد', tone: 'brand' },
            { label: 'عنوان التسليم', value: values.dropoffAddress || 'غير محدد' },
            { label: 'جهة الاتصال', value: values.contactName || 'غير محدد' },
            { label: 'رقم الجوال', value: values.contactPhone || 'غير محدد' },
            { label: 'الملاحظات', value: note },
          ]}
        />
      </BthSurface>

      <OrderCaptainChatSection phase={phase} />

      <BthSurface tone="raised" gap={3} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <BthSectionHeader title="تقييم الطلب (المنتج)" subtitle="بعد استلام العميل، تقييم المنتج يظهر هنا دون مغادرة الصفحة." />
        <BthBox gap={2}>
          <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <BthStatCard label="التقييم الحالي" value={productRatingLabel} deltaLabel={productRatingDelta} tone={productRating > 0 ? 'warning' : 'info'} />
            <BthStatCard label="الوضع" value={phase === 'route' ? 'بانتظار الوصول' : ratingsSubmitted ? 'تم الإرسال' : 'جاهز الآن'} deltaLabel={phase === 'route' ? 'سيظهر بعد الاستلام' : ratingsSubmitted ? 'يمكن التعديل' : 'بعد استلام العميل'} tone={phase === 'route' ? 'info' : ratingsSubmitted ? 'success' : 'warning'} />
          </BthBox>
          <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{productHelperText}</BthText>
          <RatingStars value={productRating} disabled={!hasCustomerReceived} onChange={handleProductRatingChange} />
        </BthBox>
      </BthSurface>

      <BthSurface tone="raised" gap={3} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <BthSectionHeader title="تقييم الكابتن" subtitle="ومن نفس الصفحة أيضًا يمكنك تقييم الكابتن بعد الاستلام." />
        <BthBox gap={2}>
          <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <BthStatCard label="التقييم الحالي" value={captainRatingLabel} deltaLabel="الكابتن" tone={captainRating > 0 ? 'info' : 'brand'} />
            <BthStatCard label="الحالة" value={ratingsSubmitted ? 'تم الإرسال' : hasCustomerReceived ? 'جاهز الآن' : 'بانتظار الاستلام'} deltaLabel={hasCustomerReceived ? (ratingsSubmitted ? 'يمكن التعديل' : 'داخل نفس الصفحة') : 'سيظهر بعد الاستلام'} tone={ratingsSubmitted ? 'success' : hasCustomerReceived ? 'warning' : 'info'} />
          </BthBox>
          <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{captainHelperText}</BthText>
          <RatingStars value={captainRating} disabled={!hasCustomerReceived} onChange={handleCaptainRatingChange} />
        </BthBox>
      </BthSurface>

      {ratingsSubmitted ? (
        <BthSurface tone="brand" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.brand }}>
          <BthText role="bodyStrong" style={{ textAlign: 'right' }}>تم حفظ التقييمين</BthText>
          <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            تقييم الطلب وتقييم الكابتن بقيا في نفس الصفحة وتم اعتمادهما.
          </BthText>
        </BthSurface>
      ) : null}

      <BthSurface tone="raised" gap={3} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <BthSectionHeader title={phase === 'route' ? 'المسار الحي' : 'بعد الاستلام' } subtitle="لا توجد شاشة جديدة بين الوصول والاستلام والتقييم." />
        <BthBox gap={2}>
          {timelineItems.map((step, index) => {
            const isDone = index < activeTimelineIndex || (!hasCustomerReceived && index === 0);
            const isActive = index === activeTimelineIndex;
            const borderColor = isActive ? theme.brand : theme.line;
            const backgroundColor = isActive ? theme.brandSurface : isDone ? theme.successSurface : theme.surfaceRaised;
            const badgeTone = isActive ? 'brand' : isDone ? 'success' : 'default';

            return (
              <BthSurface
                key={step.id}
                tone={isActive ? 'brand' : 'raised'}
                gap={0}
                padding={2}
                style={{ borderRadius: 18, borderWidth: 1, borderColor, backgroundColor }}
              >
                <BthBox layoutDirection="row" align="center" gap={2} style={{ flexDirection: 'row-reverse' }}>
                  <View style={{ width: 28, alignItems: 'center' }}>
                    <Ionicons name={isDone ? 'checkmark' : isActive ? 'ellipse' : 'ellipse-outline'} size={18} color={isActive ? theme.brand : isDone ? theme.success : theme.textSoft} />
                  </View>

                  <BthBox gap={0} style={{ flex: 1 }}>
                    <BthText role="bodyStrong" style={{ textAlign: 'right' }}>{step.title}</BthText>
                    <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{step.detail}</BthText>
                  </BthBox>

                  <BthChip label={isDone ? 'تم' : isActive ? 'الآن' : 'قادم'} tone={badgeTone} />
                </BthBox>
              </BthSurface>
            );
          })}
        </BthBox>
      </BthSurface>

      <BthSurface tone="inset" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <BthText role="bodyStrong" style={{ textAlign: 'right' }}>الوصول والاستلام وتقييم المنتج والكابتن في صفحة واحدة</BthText>
        <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          لا يوجد انتقال إلى صفحة أخرى هنا. الطلب يصل للعميل، يستلمه، ثم يظهر تقييم المنتج وتقييم الكابتن داخل نفس الشاشة.
        </BthText>
      </BthSurface>

      <BthBox gap={2}>
        <BthButton label={primaryActionLabel} onPress={handlePrimaryAction} disabled={primaryActionDisabled} />
        {onBell && phase === 'route' ? <BthButton label="جرس الوصول" tone="secondary" onPress={onBell} /> : null}
        {onBack ? <BthButton label="تعديل الطلب" tone="secondary" onPress={onBack} /> : null}
      </BthBox>
    </BthMobileScrollView>
  );
}

function renderOrderSuccess(onNext?: () => void) {
  const { theme } = useTheme();

  return (
    <BthMobileScrollView padding={4} gap={3} contentContainerStyle={{ paddingBottom: spacing[4] }}>
      <BthSurface tone="brand" gap={2} padding={3} style={{ borderRadius: 24, borderWidth: 1, borderColor: theme.brand }}>
        <BthBox gap={1} style={{ alignItems: 'flex-end' }}>
          <BthBadge label="في الطريق" tone="warning" />
          <BthText role="titleLg" style={{ textAlign: 'right' }}>الطلب في الطريق إلى العميل</BthText>
          <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            ستظهر هنا لحظة الوصول ثم استلام العميل ثم التقييمان في نفس الشاشة.
          </BthText>
        </BthBox>
      </BthSurface>

      <BthSurface tone="raised" gap={3} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <BthSectionHeader title="المسار التالي" subtitle="في الطريق ثم الوصول ثم الاستلام من العميل." />
        <StageRail activeStepId="route" steps={deliveryJourneySteps} />
      </BthSurface>

      <BthButton label="عرض التتبع" onPress={onNext} />
    </BthMobileScrollView>
  );
}

function renderTracking(
  currentStatusLabel: string,
  timeline: DshTrackingTimelineItem[],
  onSupport?: () => void,
  onNextAction?: () => void,
) {
  const { theme } = useTheme();
  const activeTimelineIndex = Math.max(0, timeline.findIndex((item) => !item.done));
  const activeItem = timeline[activeTimelineIndex] ?? timeline[timeline.length - 1];

  return (
    <BthMobileScrollView padding={4} gap={3} contentContainerStyle={{ paddingBottom: spacing[4] }}>
      <BthSurface tone="brand" gap={2} padding={3} style={{ borderRadius: 24, borderWidth: 1, borderColor: theme.brand }}>
        <BthBox gap={1} style={{ alignItems: 'flex-end' }}>
          <BthBadge label={currentStatusLabel} tone="info" />
          <BthText role="titleLg" style={{ textAlign: 'right' }}>في الطريق</BthText>
          <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            التتبع الحي ظاهر الآن، ويمكنك متابعة المحطات حتى الوصول.
          </BthText>
        </BthBox>
      </BthSurface>

      <BthSurface tone="raised" gap={3} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <BthSectionHeader title="الحالة الحالية" subtitle="آخر محطة مرئية الآن في مسار التنفيذ." />
        <BthKeyValueList
          items={[
            { label: 'المرحلة الحالية', value: activeItem?.title ?? currentStatusLabel, tone: 'brand' },
            { label: 'الخطوة التالية', value: timeline[activeTimelineIndex + 1]?.title ?? 'التسليم', tone: 'success' },
            { label: 'آخر تحديث', value: activeItem?.detail ?? 'Live' },
          ]}
        />
      </BthSurface>

      <BthSurface tone="raised" gap={3} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <BthSectionHeader title="المسار المباشر" subtitle="يظهر كل انتقال بوضوح حتى يبقى السياق بسيطًا." />
        <BthBox gap={2}>
          {timeline.map((step, index) => {
            const isActive = !step.done && index === activeTimelineIndex;
            const isDone = step.done;
            const backgroundColor = isActive ? theme.brandSurface : isDone ? theme.successSurface : theme.surfaceRaised;
            const borderColor = isActive ? theme.brand : theme.line;
            const iconName = isDone ? 'checkmark' : isActive ? 'ellipse' : 'ellipse-outline';

            return (
              <BthSurface
                key={step.id}
                tone={isActive ? 'brand' : 'raised'}
                gap={0}
                padding={2}
                style={{ borderRadius: 18, borderWidth: 1, borderColor, backgroundColor }}
              >
                <BthBox layoutDirection="row" align="center" gap={2} style={{ flexDirection: 'row-reverse' }}>
                  <View style={{ width: 28, alignItems: 'center' }}>
                    <Ionicons name={iconName as any} size={18} color={isActive ? theme.brand : isDone ? theme.success : theme.textSoft} />
                  </View>

                  <BthBox gap={0} style={{ flex: 1 }}>
                    <BthText role="bodyStrong" style={{ textAlign: 'right' }}>{step.title}</BthText>
                    <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{step.detail}</BthText>
                  </BthBox>

                  <BthChip label={isDone ? 'تم' : isActive ? 'الآن' : 'قادم'} tone={isActive ? 'brand' : isDone ? 'success' : 'default'} />
                </BthBox>
              </BthSurface>
            );
          })}
        </BthBox>
      </BthSurface>

      <BthSurface tone="inset" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <BthText role="bodyStrong" style={{ textAlign: 'right' }}>الدعم والرجوع</BthText>
        <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          إذا احتجت مراجعة إضافية أو دعمًا سريعًا، يمكنك الانتقال من هنا دون كسر المسار.
        </BthText>
        <BthBox gap={2}>
          {onNextAction ? <BthButton label="العودة إلى الطلبات" onPress={onNextAction} /> : null}
          {onSupport ? <BthButton label="الدعم" tone="secondary" onPress={onSupport} /> : null}
        </BthBox>
      </BthSurface>
    </BthMobileScrollView>
  );
}

export function DshOrdersListScreen({ items = fallbackOrderListItems, query = '', onQueryChange, onOpenOrder, onBack, onRetry }: DshOrdersListScreenProps) {
  const { theme } = useTheme();
  const normalizedQuery = normalizeText(query);
  const visibleItems = normalizedQuery
    ? items.filter((item) => normalizeText(`${item.title} ${item.subtitle} ${item.statusLabel} ${item.meta}`).includes(normalizedQuery))
    : items;

  return (
    <BthMobileScrollView padding={4} gap={3} contentContainerStyle={{ paddingBottom: spacing[4] }}>
      <BthBox gap={1}>
        <BthText role="titleLg">الطلبات</BthText>
        <BthText role="bodySm" tone="muted">قائمة مختصرة للطلبات الحديثة مع حالة واضحة في كل صف.</BthText>
      </BthBox>

      <BthSurface tone="brand" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.brand }}>
        <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <OrdersListStatCard label="الكل" value={String(items.length)} helperText="كل الطلبات المرئية" />
          <OrdersListStatCard label="المطابق للبحث" value={String(visibleItems.length)} helperText="النتائج الحالية" />
        </BthBox>
      </BthSurface>

      <BthSurface tone="raised" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <BthSearchField label="بحث في الطلبات" value={query} onChangeText={onQueryChange} hint="جرّب عنوانًا أو حالة أو ملاحظة." />
        <BthSectionHeader title="الصفوف الحالية" subtitle="اضغط على أي طلب لفتح تتبعه مباشرة." count={visibleItems.length} />

        <BthBox gap={2}>
          {visibleItems.length ? visibleItems.map((item) => <OrderRow key={item.id} item={item} onOpenOrder={onOpenOrder} />) : (
            <BthCard title="لا توجد نتائج" subtitle="جرّب كلمة مختلفة أو أعد عرض الكل.">
              <BthBox gap={2}>
                {onQueryChange ? <BthButton label="إظهار الكل" onPress={() => onQueryChange('')} /> : null}
                {onBack ? <BthButton label="العودة" tone="secondary" onPress={onBack} /> : null}
                {onRetry ? <BthButton label="إعادة المحاولة" tone="ghost" onPress={onRetry} /> : null}
              </BthBox>
            </BthCard>
          )}
        </BthBox>
      </BthSurface>

      <BthSurface tone="inset" gap={2} padding={2} style={{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }}>
        <BthText role="bodyStrong" style={{ textAlign: 'right' }}>الخطوة التالية</BthText>
        <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          اذهب إلى التتبع لعرض الحالة الحية أو استخدم العودة للخروج من هذا المسار.
        </BthText>
        <BthBox gap={2}>
          {onNextAction ? <BthButton label="التتبع" onPress={onNextAction} /> : null}
          {onBack ? <BthButton label="العودة" tone="secondary" onPress={onBack} /> : null}
        </BthBox>
      </BthSurface>
    </BthMobileScrollView>
  );
}

export function DshCreateOrderScreen({
  screenId,
  state = 'ready',
  values = defaultCreateOrderValues,
  timeline = [],
  onPrimaryAction,
  onSecondaryAction,
  onContinue,
  onBack,
  onRetry,
}: DshCreateOrderScreenProps) {
  if (screenId) {
    return renderCheckoutGate(screenId, state, onPrimaryAction, onSecondaryAction, onRetry);
  }

  return <CreateOrderJourneyScreen values={values} timeline={timeline} initialPhase="route" onBack={onBack ?? onSecondaryAction} />;
}

export function DshIntakeHubScreen() {
  return <BthSurface tone="inset"><BthText>Intake hub (legacy placeholder)</BthText></BthSurface>;
}

export function DshOrderSuccessState({ onNext }: DshOrderSuccessStateProps) {
  return renderOrderSuccess(onNext);
}

export function DshTrackingScreen({ values = defaultCreateOrderValues, currentStatusLabel = 'في الطريق', timeline = [], onBell, onSupport, onRetry, onNextAction }: DshTrackingScreenProps) {
  const fallbackTimeline: DshTrackingTimelineItem[] = timeline.length
    ? timeline
    : deliveryJourneySteps.map((step, index) => ({ id: step.id, title: step.title, detail: step.detail, done: index === 0 }));

  return (
    <CreateOrderJourneyScreen
      values={values}
      timeline={fallbackTimeline}
      initialPhase="route"
      currentStatusLabel={currentStatusLabel}
      onBell={onBell}
      onBack={onSupport ?? onNextAction ?? onRetry}
    />
  );
}

export function DshDeliveryManagementHubScreen() {
  return <BthSurface tone="inset"><BthText>Delivery management hub (legacy placeholder)</BthText></BthSurface>;
}

export default {};
