import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Icon,
  KeyValueList,
  ListItem,
  MobileScrollView,
  SectionHeader,
  StateView,
  Surface,
  Text,
  TextField,
  useTheme,
} from '@bthwani/ui-kit';
import type {
  DshCaptainOrderAction,
  DshCaptainOrderBellItem,
  DshCaptainOrderId,
  DshCaptainOrderMessage,
  DshCaptainOrderMode,
  DshCaptainOrderProofStatus,
  DshCaptainOrderStage,
  DshCaptainOrdersScreenState,
} from './captain-orders.preview-data';

export type DshCaptainOrderDetailSummary = {
  orderId: DshCaptainOrderId;
  pickupLabel: string;
  dropoffLabel: string;
  etaLabel: string;
  currentStageLabel: string;
  nextActionLabel: string;
};

export type DshCaptainOrdersScreenProps = {
  section?: DshCaptainOrderMode;
  state?: DshCaptainOrdersScreenState;
  items?: DshCaptainOrderBellItem[];
  summary?: DshCaptainOrderDetailSummary;
  messages?: DshCaptainOrderMessage[];
  proofStatus?: DshCaptainOrderProofStatus;
  onOpenOrder?: (orderId: DshCaptainOrderId) => void;
  onOpenNextOrder?: (orderId: DshCaptainOrderId) => void;
  onBackToInbox?: () => void;
  onRetry?: () => void;
  onActionPress?: (action: DshCaptainOrderAction) => void;
};

const demoSummary: DshCaptainOrderDetailSummary = {
  orderId: 'captain-order-9021',
  pickupLabel: 'Burger Lab - فرع حطين',
  dropoffLabel: 'حي العليا، طريق الملك فهد',
  etaLabel: 'مدة الوصول إلى الاستلام: 8 دقائق',
  currentStageLabel: 'في الطريق إلى الاستلام',
  nextActionLabel: 'أكد الاستلام بعد التقاط الطلب',
};

const demoBellItems: DshCaptainOrderBellItem[] = [
  {
    id: 'captain-order-9021',
    title: 'طلب جديد #9021',
    subtitle: 'Burger Lab بانتظار كابتن يقبل المسار.',
    meta: 'التالي: مراجعة ثم قبول',
    badgeLabel: 'جديد',
    tone: 'warning',
  },
  {
    id: 'captain-order-9024',
    title: 'طلب جديد #9024',
    subtitle: 'Green Bowl تحتاج مراجعة فورية قبل أن يكبر الصف.',
    meta: 'التالي: فتح تفاصيل الطلب',
    badgeLabel: 'عاجل',
    tone: 'brand',
  },
];

const demoMessages: DshCaptainOrderMessage[] = [
  {
    id: 'msg-1',
    sender: 'العميل',
    text: 'أبقي التحديثات قصيرة لو سمحت، وأنا جاهز عند الوصول.',
    time: '09:12',
    side: 'start',
  },
  {
    id: 'msg-2',
    sender: 'الكابتن',
    text: 'تم تأكيد الاستلام، والطلب الآن في الطريق.',
    time: '09:13',
    side: 'end',
  },
  {
    id: 'msg-3',
    sender: 'العميل',
    text: 'ممتاز، أخبرني قبل دقيقة من الوصول.',
    time: '09:14',
    side: 'start',
  },
];

const demoState: DshCaptainOrdersScreenState = 'ready';

function renderOrdersState(state: DshCaptainOrdersScreenState, onRetry?: () => void) {
  if (state === 'loading') {
    return (
      <StateView
        stateId="loading"
        title="جارٍ تحميل صندوق الكابتن"
        description="أبقِ الطلب التالي ظاهرًا فور توفر بيانات الصف."
      />
    );
  }

  if (state === 'empty') {
    return (
      <StateView
        stateId="empty"
        title="لا توجد طلبات الآن"
        description="ابقَ جاهزًا. الطلبات الجديدة ستصل هنا أولًا."
        actionLabel={onRetry ? 'تحديث الطلبات' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'delivered') {
    return (
      <StateView
        kind="success"
        title="تم تسليم كل الطلبات"
        description="أداء ممتاز. حدّث الشاشة لالتقاط المهمة التالية."
        actionLabel={onRetry ? 'التحقق من طلبات جديدة' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'error') {
    return (
      <StateView
        stateId="recoverableError"
        title="صندوق الطلبات غير متاح"
        description="أعد المحاولة وواصل من الطلب التالي من دون تغيير المسار."
        actionLabel="إعادة المحاولة"
        onActionPress={onRetry}
      />
    );
  }

  return null;
}

function OrderInboxSection({
  items = demoBellItems,
  onOpenOrder,
  onOpenNextOrder,
  onRetry,
}: Pick<DshCaptainOrdersScreenProps, 'items' | 'onOpenOrder' | 'onOpenNextOrder' | 'onRetry'>) {
  const nextOrder = items[0];

  const handleOpenNextOrder = () => {
    if (!nextOrder) {
      onRetry?.();
      return;
    }

    if (onOpenNextOrder) {
      onOpenNextOrder(nextOrder.id);
      return;
    }

    onOpenOrder?.(nextOrder.id);
  };

  if (!nextOrder) {
    return renderOrdersState('empty', onRetry);
  }

  return (
    <MobileScrollView padding={4} gap={3}>
      <Box gap={2}>
        <Text role="titleLg">صندوق طلبات الكابتن</Text>
        <Text role="bodySm" tone="muted">
          مسار الصندوق أولًا يبقي الطلب الفوري واضحًا ويزيل ضجيج اللوحة.
        </Text>
      </Box>

      <Surface tone="brand" gap={3}>
        <SectionHeader title="الطلب التالي" subtitle="إجراء واحد واضح قبل مسح بقية الصف." />
        <Box gap={1}>
          <Text role="bodyStrong">{nextOrder.title}</Text>
          <Text role="bodySm" tone="muted">
            {nextOrder.subtitle}
          </Text>
          <Text role="caption" tone="soft">
            {nextOrder.meta}
          </Text>
        </Box>
        <Button label="فتح الطلب التالي" onPress={handleOpenNextOrder} />
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader title="الطلبات في الصف" subtitle="الحد الأدنى للقائمة: الاستلام والتسليم والوقت والخطوة التالية." />
        <Box gap={2}>
          {items.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              meta={`${item.meta}`}
              badgeLabel={item.badgeLabel}
              onPress={() => onOpenOrder?.(item.id)}
            />
          ))}
        </Box>
      </Surface>
    </MobileScrollView>
  );
}

function OrderDetailSection({
  summary = demoSummary,
  onConfirmPickup,
  onConfirmDelivery,
  onOpenNextOrder,
  onBackToInbox,
  onRetry,
}: {
  summary?: DshCaptainOrderDetailSummary;
  onConfirmPickup?: () => void;
  onConfirmDelivery?: () => void;
  onOpenNextOrder?: () => void;
  onBackToInbox?: () => void;
  onRetry?: () => void;
}) {
  return (
    <MobileScrollView padding={4} gap={4}>
      <Surface tone="brand" gap={3}>
        <Box gap={1} style={{ alignItems: 'flex-end' }}>
          <Badge label="طلب الكابتن" tone="warning" />
          <Text role="titleLg" style={{ textAlign: 'right' }}>{summary.orderId}</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {summary.currentStageLabel}
          </Text>
        </Box>

        <KeyValueList
          items={[
            { label: 'الاستلام', value: summary.pickupLabel, tone: 'brand' },
            { label: 'التسليم', value: summary.dropoffLabel },
            { label: 'الوقت المتوقع', value: summary.etaLabel, tone: 'warning' },
            { label: 'الخطوة التالية', value: summary.nextActionLabel, tone: 'success' },
          ]}
        />
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader title="إجراءات الطلب" subtitle="أكد الخطوة التالية من دون مغادرة سطح تفاصيل الطلب." />
        <Box gap={2}>
          {onConfirmPickup ? <Button label="تأكيد الاستلام" onPress={onConfirmPickup} /> : null}
          {onConfirmDelivery ? <Button label="تأكيد التسليم" tone="secondary" onPress={onConfirmDelivery} /> : null}
          {onOpenNextOrder ? <Button label="فتح الطلب التالي" tone="secondary" onPress={onOpenNextOrder} /> : null}
          {onBackToInbox ? <Button label="العودة إلى الصندوق" tone="ghost" onPress={onBackToInbox} /> : null}
          {onRetry ? <Button label="إعادة المحاولة" tone="ghost" onPress={onRetry} /> : null}
        </Box>
      </Surface>
    </MobileScrollView>
  );
}

function ComposerActionButton({
  iconName,
  accessibilityLabel,
  disabled = false,
  onPress,
}: {
  iconName: React.ComponentProps<typeof Icon>['name'];
  accessibilityLabel: string;
  disabled?: boolean;
  onPress?: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => ({
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: disabled ? theme.disabledSurface : pressed ? theme.surfaceInset : theme.surface,
        borderWidth: 1,
        borderColor: disabled ? theme.line : theme.lineStrong,
        opacity: disabled ? 0.55 : 1,
      })}
    >
      <Icon name={iconName} size={18} tone={disabled ? 'soft' : 'brand'} />
    </Pressable>
  );
}

function OrderChatBubble({ message }: { message: DshCaptainOrderMessage }) {
  const isOutbound = message.side === 'end';

  return (
    <Box style={{ alignSelf: isOutbound ? 'flex-end' : 'flex-start', width: '100%', maxWidth: '86%' }}>
      <Surface tone={isOutbound ? 'brand' : 'raised'} padding={3} gap={2} radiusToken="xl" border={false}>
        <Box layoutDirection="row" justify="space-between" align="center" gap={2}>
          <Badge label={message.sender} tone={isOutbound ? 'brand' : 'default'} />
          <Text role="caption" tone={isOutbound ? 'inverse' : 'soft'}>{message.time}</Text>
        </Box>
        <Text role="bodySm" tone={isOutbound ? 'inverse' : 'default'}>
          {message.text}
        </Text>
      </Surface>
    </Box>
  );
}

function OrderChatSection({
  orderId = demoSummary.orderId,
  pickupLabel = demoSummary.pickupLabel,
  dropoffLabel = demoSummary.dropoffLabel,
  state = 'active',
}: {
  orderId?: DshCaptainOrderId;
  pickupLabel?: string;
  dropoffLabel?: string;
  state?: 'active' | 'readOnly';
}) {
  const isReadOnly = state === 'readOnly';
  const [draft, setDraft] = React.useState('');
  const [attachments, setAttachments] = React.useState<Array<'voice' | 'camera' | 'video' | 'attachment'>>([]);
  const [isSending, setIsSending] = React.useState(false);
  const [composerState, setComposerState] = React.useState<'idle' | 'typing' | 'with-attachment' | 'sending' | 'success' | 'error' | 'disabled'>(isReadOnly ? 'disabled' : 'idle');
  const [messages, setMessages] = React.useState<DshCaptainOrderMessage[]>(demoMessages);

  const canSend = !isReadOnly && !isSending && (draft.trim().length > 0 || attachments.length > 0);

  React.useEffect(() => {
    if (isReadOnly) {
      setComposerState('disabled');
      return;
    }

    if (isSending) {
      setComposerState('sending');
      return;
    }

    if (draft.trim().length > 0) {
      setComposerState('typing');
      return;
    }

    if (attachments.length > 0) {
      setComposerState('with-attachment');
      return;
    }

    setComposerState('idle');
  }, [attachments.length, draft, isReadOnly, isSending]);

  const toggleAttachment = (kind: 'voice' | 'camera' | 'video' | 'attachment') => {
    if (isReadOnly || isSending) {
      return;
    }

    setAttachments((current) => (current.includes(kind)
      ? current.filter((item) => item !== kind)
      : [...current, kind]));
  };

  const handleSend = () => {
    if (!canSend) {
      return;
    }

    const text = draft.trim();
    const attachmentsLabel = attachments.length ? ` [مرفقات: ${attachments.join('، ')}]` : '';

    setIsSending(true);
    setComposerState('sending');

    Promise.resolve()
      .then(async () => {
        await new Promise((resolve) => setTimeout(resolve, 220));
        setMessages((current) => [
          ...current,
          {
            id: `msg-${current.length + 1}`,
            sender: 'الكابتن',
            text: `${text || 'تم إرسال مرفقات مرتبطة بالطلب'}${attachmentsLabel}`,
            time: 'الآن',
            side: 'end',
          },
        ]);
        setDraft('');
        setAttachments([]);
        setComposerState('success');
      })
      .catch(() => {
        setComposerState('error');
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const composerHint = isReadOnly
    ? 'تم تسليم الطلب. التواصل هنا للقراءة فقط.'
    : composerState === 'sending'
      ? 'جاري الإرسال...'
      : composerState === 'success'
        ? 'تم الإرسال بنجاح.'
        : composerState === 'error'
          ? 'تعذر الإرسال. حاول مرة أخرى.'
          : composerState === 'with-attachment'
            ? 'المرفقات جاهزة، أضف نصًا اختياريًا ثم أرسل.'
            : 'الرسائل المختصرة فقط داخل هذا المسار.';

  return (
    <MobileScrollView fill padding={4} gap={4}>
      <Box gap={2}>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Badge label={`#${orderId}`} tone="brand" />
          <Badge label={isReadOnly ? 'مقروء فقط' : 'نشط'} tone={isReadOnly ? 'success' : 'warning'} />
        </Box>
        <Text role="bodySm" tone="muted">
          {pickupLabel} · {dropoffLabel}
        </Text>
      </Box>

      <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
        <Box gap={1}>
          <Text role="titleSm">سجل تواصل الطلب</Text>
          <Text role="bodySm" tone="muted">
            تحديثات قصيرة، مرفقات خفيفة، ومتابعة مباشرة من نفس الطلب.
          </Text>
        </Box>

        <ScrollView style={{ maxHeight: 380 }} contentContainerStyle={{ gap: 12 }} showsVerticalScrollIndicator={false}>
          {messages.map((message) => (
            <OrderChatBubble key={message.id} message={message} />
          ))}
        </ScrollView>

        <Surface tone={isReadOnly ? 'inset' : 'default'} padding={3} gap={2} radiusToken="lg">
          <TextField
            value={draft}
            onChangeText={setDraft}
            editable={!isReadOnly}
            placeholder={isReadOnly ? 'الطلب مغلق الآن' : 'اكتب رسالة مختصرة...'}
            multiline
            numberOfLines={3}
            style={{ minHeight: 92, textAlignVertical: 'top' }}
          />
          <Box layoutDirection="row" justify="space-between" align="center" style={{ gap: 12, flexWrap: 'wrap' }}>
            <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              <ComposerActionButton iconName="mic-outline" accessibilityLabel="رسالة صوتية" disabled={isReadOnly || isSending} onPress={() => toggleAttachment('voice')} />
              <ComposerActionButton iconName="camera-outline" accessibilityLabel="التقاط صورة" disabled={isReadOnly || isSending} onPress={() => toggleAttachment('camera')} />
              <ComposerActionButton iconName="videocam-outline" accessibilityLabel="التقاط فيديو" disabled={isReadOnly || isSending} onPress={() => toggleAttachment('video')} />
              <ComposerActionButton iconName="attach-outline" accessibilityLabel="إرفاق ملف" disabled={isReadOnly || isSending} onPress={() => toggleAttachment('attachment')} />
            </Box>
            <Button
              label={isReadOnly ? 'مقفل' : isSending ? 'جاري الإرسال' : 'إرسال'}
              tone={isReadOnly ? 'secondary' : 'primary'}
              size="sm"
              fullWidth={false}
              disabled={!canSend}
              loading={isSending}
              onPress={handleSend}
            />
          </Box>
          <Text role="caption" tone="muted">
            {composerHint}
          </Text>
        </Surface>
      </Surface>
    </MobileScrollView>
  );
}

function OrderBellSection({
  items = demoBellItems,
  onOpenInbox,
  onOpenNextOrder,
  onRetry,
  onBack,
}: {
  items?: DshCaptainOrderBellItem[];
  onOpenInbox?: () => void;
  onOpenNextOrder?: () => void;
  onRetry?: () => void;
  onBack?: () => void;
}) {
  const summary = {
    inboxLabel: 'صندوق طلبات الكابتن',
    approvalLabel: 'بحاجة إلى موافقة',
    urgentLabel: 'رنات الطلبات العاجلة',
    nextActionLabel: 'رنّة الطلب الجديدة يجب أن تدفع الكابتن إلى الموافقة أو الصندوق مباشرة من دون ضوضاء إضافية.',
  };

  return (
    <MobileScrollView padding={4} gap={4}>
      <Surface tone="brand" gap={3}>
        <Box gap={1} style={{ alignItems: 'flex-end' }}>
          <Badge label="طلبات جديدة" tone="warning" />
          <Text role="titleLg" style={{ textAlign: 'right' }}>جرس الطلبات الجديدة للكابتن</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            هذا الجرس يلفت الانتباه فقط عند وصول طلب جديد أو عند الحاجة إلى موافقة سريعة من الكابتن.
          </Text>
        </Box>

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Surface tone="default" padding={3} gap={1} radiusToken="lg">
            <Text role="caption" tone="muted">طلبات جديدة</Text>
            <Text role="titleSm">{String(items.length)}</Text>
          </Surface>
          <Surface tone="default" padding={3} gap={1} radiusToken="lg">
            <Text role="caption" tone="muted">بحاجة إلى موافقة</Text>
            <Text role="titleSm">2</Text>
          </Surface>
          <Surface tone="default" padding={3} gap={1} radiusToken="lg">
            <Text role="caption" tone="muted">رنات عاجلة</Text>
            <Text role="titleSm">1</Text>
          </Surface>
        </Box>
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader title={summary.inboxLabel} subtitle="افتح الصندوق أو انتقل إلى أول طلب من نفس الجرس." />
        <KeyValueList
          items={[
            { label: 'الحالة', value: summary.approvalLabel, tone: 'brand' },
            { label: 'الأولوية', value: summary.urgentLabel, tone: 'warning' },
            { label: 'الخطوة التالية', value: 'فتح الطلب والقبول أو الرفض السريع', tone: 'success' },
          ]}
        />
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader title="الرنات الحالية" subtitle="كل صف يوضح الطلب القادم من دون ضوضاء إضافية." />
        <Box gap={2}>
          {items.map((item) => (
            <ListItem key={item.id} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
          ))}
        </Box>
      </Surface>

      <Surface tone="inset" gap={2}>
        <Text role="bodyStrong" style={{ textAlign: 'right' }}>{summary.nextActionLabel}</Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          هذا الجرس لا يضيف ضوضاء. هو مجرد دفعة واضحة نحو صندوق الطلبات أو أول طلب يحتاج قرارًا.
        </Text>
      </Surface>

      <Box gap={2}>
        {onOpenNextOrder ? <Button label="فتح أول طلب" onPress={onOpenNextOrder} /> : null}
        {onOpenInbox ? <Button label="صندوق الطلبات" tone="secondary" onPress={onOpenInbox} /> : null}
        {onBack ? <Button label="العودة" tone="ghost" onPress={onBack} /> : null}
        {onRetry ? <Button label="إعادة المحاولة" tone="ghost" onPress={onRetry} /> : null}
      </Box>
    </MobileScrollView>
  );
}

function OrderActionSection({
  action,
  summary = demoSummary,
  onActionPress,
  onBackToInbox,
}: {
  action: Exclude<DshCaptainOrderAction, 'proof-upload' | 'back-to-inbox' | 'next-order'>;
  summary?: DshCaptainOrderDetailSummary;
  onActionPress?: (action: DshCaptainOrderAction) => void;
  onBackToInbox?: () => void;
}) {
  const actionCopy: Record<typeof action, { title: string; subtitle: string; primaryLabel: string; secondaryLabel?: string; kind: DshCaptainOrderStage }> = {
    accept: {
      title: 'قبول الطلب',
      subtitle: 'أكد أن الكابتن قبل الطلب والتزم بالاستلام.',
      primaryLabel: 'قبول الطلب',
      secondaryLabel: 'العودة إلى دليل الدعم',
      kind: 'accepted',
    },
    'order-offer-reject': {
      title: 'رفض العرض',
      subtitle: 'ارفض العرض مع سبب تشغيلي ظاهر.',
      primaryLabel: 'رفض الطلب',
      secondaryLabel: 'العودة إلى دليل الدعم',
      kind: 'offer',
    },
    pickup: {
      title: 'استلام الطلب',
      subtitle: 'أكد استلام الفرع قبل بدء مرحلة التوصيل.',
      primaryLabel: 'تأكيد الاستلام',
      secondaryLabel: 'العودة إلى دليل الدعم',
      kind: 'pickup',
    },
    deliver: {
      title: 'تسليم الطلب',
      subtitle: 'أغلق المسار مع تأكيد التسليم النهائي.',
      primaryLabel: 'تأكيد التسليم',
      secondaryLabel: 'العودة إلى دليل الدعم',
      kind: 'delivery',
    },
  };

  const copy = actionCopy[action];

  return (
    <MobileScrollView padding={4} gap={4}>
      <Surface tone="brand" gap={3}>
        <SectionHeader title={copy.title} subtitle={copy.subtitle} />
        <KeyValueList
          items={[
            { label: 'الطلب', value: summary.orderId, tone: 'brand' },
            { label: 'الاستلام', value: summary.pickupLabel },
            { label: 'التسليم', value: summary.dropoffLabel },
            { label: 'المرحلة', value: copy.kind, tone: 'warning' },
          ]}
        />
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader title="الإجراء التالي" subtitle="حافظ على الخطوة التشغلية واحدة واضحة." />
        <Box gap={2}>
          <Button label={copy.primaryLabel} onPress={() => onActionPress?.(action)} />
          {copy.secondaryLabel ? <Button label={copy.secondaryLabel} tone="ghost" onPress={onBackToInbox} /> : null}
        </Box>
      </Surface>
    </MobileScrollView>
  );
}

function OrderProofSection({
  summary = demoSummary,
  status = 'idle',
  onActionPress,
  onBackToInbox,
}: {
  summary?: DshCaptainOrderDetailSummary;
  status?: DshCaptainOrderProofStatus;
  onActionPress?: (action: DshCaptainOrderAction) => void;
  onBackToInbox?: () => void;
}) {
  const [draft, setDraft] = React.useState('');

  return (
    <MobileScrollView padding={4} gap={4}>
      <Surface tone="brand" gap={3}>
        <SectionHeader title="رفع الإثبات" subtitle="التقط الإثبات عندما يحتاج تأكيد التسليم النهائي إلى دعم وسائط." />
        <KeyValueList
          items={[
            { label: 'الطلب', value: summary.orderId, tone: 'brand' },
            { label: 'الصيغة المطلوبة', value: 'صورة أو تأكيد موقّع' },
            { label: 'الحالة الحالية', value: status, tone: 'warning' },
            { label: 'المتابعة', value: 'أغلق المسار بعد الإثبات' },
          ]}
        />
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader title="إدخال الإثبات" subtitle="أرفق أو اكتب وصفًا قصيرًا قبل الإرسال." />
        <TextField value={draft} onChangeText={setDraft} placeholder="وصف الإثبات..." multiline numberOfLines={3} />
        <Box gap={2}>
          <Button label="رفع الإثبات" onPress={() => onActionPress?.('proof-upload')} />
          {onBackToInbox ? <Button label="العودة إلى الصندوق" tone="ghost" onPress={onBackToInbox} /> : null}
        </Box>
      </Surface>
    </MobileScrollView>
  );
}

function renderSection({
  section,
  state,
  items,
  summary,
  proofStatus,
  onOpenOrder,
  onOpenNextOrder,
  onBackToInbox,
  onRetry,
  onActionPress,
}: DshCaptainOrdersScreenProps) {
  if (state && state !== 'ready') {
    return renderOrdersState(state, onRetry);
  }

  const resolvedSection = section ?? 'full';

  if (resolvedSection === 'inbox') {
    return <OrderInboxSection items={items} onOpenOrder={onOpenOrder} onOpenNextOrder={onOpenNextOrder} onRetry={onRetry} />;
  }

  if (resolvedSection === 'detail' || resolvedSection === 'order-details' || resolvedSection === 'order-get') {
    return (
      <OrderDetailSection
        summary={summary}
        onConfirmPickup={() => onActionPress?.('pickup')}
        onConfirmDelivery={() => onActionPress?.('deliver')}
        onOpenNextOrder={() => onOpenNextOrder?.(summary?.orderId ?? demoSummary.orderId)}
        onBackToInbox={onBackToInbox}
        onRetry={onRetry}
      />
    );
  }

  if (resolvedSection === 'chat') {
    return (
      <OrderChatSection
        orderId={summary?.orderId ?? demoSummary.orderId}
        pickupLabel={summary?.pickupLabel}
        dropoffLabel={summary?.dropoffLabel}
      />
    );
  }

  if (resolvedSection === 'bell') {
    return <OrderBellSection items={items} onOpenInbox={onBackToInbox} onOpenNextOrder={() => onOpenNextOrder?.(summary?.orderId ?? demoSummary.orderId)} onRetry={onRetry} />;
  }

  if (resolvedSection === 'accept') {
    return <OrderActionSection action="accept" summary={summary} onActionPress={onActionPress} onBackToInbox={onBackToInbox} />;
  }

  if (resolvedSection === 'offer-reject') {
    return <OrderActionSection action="order-offer-reject" summary={summary} onActionPress={onActionPress} onBackToInbox={onBackToInbox} />;
  }

  if (resolvedSection === 'pickup') {
    return <OrderActionSection action="pickup" summary={summary} onActionPress={onActionPress} onBackToInbox={onBackToInbox} />;
  }

  if (resolvedSection === 'deliver') {
    return <OrderActionSection action="deliver" summary={summary} onActionPress={onActionPress} onBackToInbox={onBackToInbox} />;
  }

  if (resolvedSection === 'proof') {
    return <OrderProofSection summary={summary} status={proofStatus} onActionPress={onActionPress} onBackToInbox={onBackToInbox} />;
  }

  if (resolvedSection === 'orders-list') {
    return <OrderInboxSection items={items} onOpenOrder={onOpenOrder} onOpenNextOrder={onOpenNextOrder} onRetry={onRetry} />;
  }

  if (resolvedSection === 'orders-offers-list') {
    return <OrderBellSection items={items} onOpenInbox={onBackToInbox} onOpenNextOrder={() => onOpenNextOrder?.(summary?.orderId ?? demoSummary.orderId)} onRetry={onRetry} />;
  }

  return (
    <MobileScrollView padding={4} gap={4}>
      <OrderInboxSection items={items} onOpenOrder={onOpenOrder} onOpenNextOrder={onOpenNextOrder} onRetry={onRetry} />
      <OrderDetailSection summary={summary} onConfirmPickup={() => onActionPress?.('pickup')} onConfirmDelivery={() => onActionPress?.('deliver')} onOpenNextOrder={() => onOpenNextOrder?.(summary?.orderId ?? demoSummary.orderId)} onBackToInbox={onBackToInbox} onRetry={onRetry} />
      <OrderChatSection orderId={summary?.orderId ?? demoSummary.orderId} pickupLabel={summary?.pickupLabel} dropoffLabel={summary?.dropoffLabel} />
      <OrderBellSection items={items} onOpenInbox={onBackToInbox} onOpenNextOrder={() => onOpenNextOrder?.(summary?.orderId ?? demoSummary.orderId)} onRetry={onRetry} />
      <OrderActionSection action="accept" summary={summary} onActionPress={onActionPress} onBackToInbox={onBackToInbox} />
      <OrderProofSection summary={summary} status={proofStatus} onActionPress={onActionPress} onBackToInbox={onBackToInbox} />
    </MobileScrollView>
  );
}

export function DshCaptainOrdersScreen(props: DshCaptainOrdersScreenProps = {}) {
  return renderSection({
    section: props.section ?? 'full',
    state: props.state ?? demoState,
    items: props.items ?? demoBellItems,
    summary: props.summary ?? demoSummary,
    proofStatus: props.proofStatus ?? 'idle',
    onOpenOrder: props.onOpenOrder,
    onOpenNextOrder: props.onOpenNextOrder,
    onBackToInbox: props.onBackToInbox,
    onRetry: props.onRetry,
    onActionPress: props.onActionPress,
  });
}

export function CaptainOrdersInboxScreen(props: Pick<DshCaptainOrdersScreenProps, 'state' | 'items' | 'onOpenOrder' | 'onOpenNextOrder' | 'onRetry'> = {}) {
  return <DshCaptainOrdersScreen {...props} section="inbox" />;
}

export function CaptainOrderDetailScreen({
  summary = demoSummary,
  onConfirmPickup,
  onConfirmDelivery,
  onOpenNextOrder,
  onBackToInbox,
  onRetry,
}: {
  summary?: DshCaptainOrderDetailSummary;
  onConfirmPickup?: () => void;
  onConfirmDelivery?: () => void;
  onOpenNextOrder?: () => void;
  onBackToInbox?: () => void;
  onRetry?: () => void;
}) {
  return (
    <OrderDetailSection
      summary={summary}
      onConfirmPickup={onConfirmPickup}
      onConfirmDelivery={onConfirmDelivery}
      onOpenNextOrder={onOpenNextOrder}
      onBackToInbox={onBackToInbox}
      onRetry={onRetry}
    />
  );
}

export function CaptainPickupConfirmSheet({ visible, orderTitle, onConfirm, onCancel }: { visible: boolean; orderTitle: string; onConfirm: () => void; onCancel: () => void; }) {
  if (!visible) {
    return null;
  }

  return (
    <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
      <SectionHeader title="تأكيد الاستلام" subtitle="أقر باستلام الطلب قبل نقله إلى المرحلة التالية." />
      <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{orderTitle}</Text>
      <Box gap={2}>
        <Button label="تأكيد الاستلام" onPress={onConfirm} />
        <Button label="إلغاء" tone="ghost" onPress={onCancel} />
      </Box>
    </Surface>
  );
}

export function CaptainDeliveryConfirmSheet({ visible, orderTitle, onConfirm, onCancel }: { visible: boolean; orderTitle: string; onConfirm: () => void; onCancel: () => void; }) {
  if (!visible) {
    return null;
  }

  return (
    <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
      <SectionHeader title="تأكيد التسليم" subtitle="أغلق الطلب بعد استلام العميل له." />
      <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{orderTitle}</Text>
      <Box gap={2}>
        <Button label="تأكيد التسليم" onPress={onConfirm} />
        <Button label="إلغاء" tone="ghost" onPress={onCancel} />
      </Box>
    </Surface>
  );
}

export function DshCaptainOrderChatScreen({
  orderId,
  pickupLabel,
  dropoffLabel,
  state = 'active',
}: {
  orderId: string;
  pickupLabel: string;
  dropoffLabel: string;
  state?: 'active' | 'readOnly';
}) {
  return <OrderChatSection orderId={orderId} pickupLabel={pickupLabel} dropoffLabel={dropoffLabel} state={state} />;
}

export function DshCaptainBellScreen({
  state,
  summary,
  items,
  onOpenInbox,
  onOpenNextOrder,
  onRetry,
  onBack,
}: {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  summary?: {
    inboxLabel: string;
    approvalLabel: string;
    urgentLabel: string;
    nextActionLabel: string;
  };
  items?: DshCaptainOrderBellItem[];
  onOpenInbox?: () => void;
  onOpenNextOrder?: () => void;
  onRetry?: () => void;
  onBack?: () => void;
}) {
  if (state && state !== 'ready') {
    const stateCopy = {
      loading: { stateId: 'loading' as const, title: 'جارٍ تجهيز جرس الكابتن', description: 'ستظهر رنّة الطلب التالية بمجرد وصول بيانات الصف.', actionLabel: 'إعادة المحاولة' },
      empty: { stateId: 'empty' as const, title: 'لا توجد رنات طلب جديدة', description: 'يبقى الجرس هادئًا حتى يصل طلب جديد إلى الصف.', actionLabel: 'فتح الصندوق' },
      offline: { stateId: 'offline' as const, title: 'جرس الكابتن غير متصل', description: 'أعد الاتصال لاسترجاع مسار التنبيه المباشر للطلبات الجديدة.', actionLabel: 'إعادة المحاولة' },
      disabled: { kind: 'warning' as const, title: 'جرس الكابتن متوقف', description: 'يمكن إبقاء الجرس للقراءة فقط حتى يعاد تفعيل صف DSH.', actionLabel: 'فتح الصندوق' },
      error: { stateId: 'recoverableError' as const, title: 'تعذر تحميل جرس الكابتن', description: 'أعد تحميل المسار نفسه مع إبقاء صف التنبيه ظاهرًا.', actionLabel: 'إعادة المحاولة' },
      ready: null,
    }[state];

    if (!stateCopy) {
      return null;
    }

    return (
      <MobileScrollView padding={4} gap={4}>
        <StateView {...stateCopy} onActionPress={onRetry ?? onOpenInbox ?? onBack} />
      </MobileScrollView>
    );
  }

  return (
    <OrderBellSection
      items={items}
      onOpenInbox={onOpenInbox}
      onOpenNextOrder={onOpenNextOrder}
      onRetry={onRetry}
      onBack={onBack}
    />
  );
}

function SimpleSupportScreen({
  title,
  subtitle,
  heroTitle,
  heroDescription,
  primaryLabel,
  secondaryLabel,
  keyValues,
  listItems,
  inputLabel,
  inputHint,
  onPrimaryAction,
  onSecondaryAction,
  onBack,
  onRetry,
}: {
  title: string;
  subtitle: string;
  heroTitle: string;
  heroDescription: string;
  primaryLabel: string;
  secondaryLabel?: string;
  keyValues?: Array<{ label: string; value: string; tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' }>;
  listItems?: Array<{ title: string; subtitle: string; meta: string; badgeLabel?: string }>;
  inputLabel?: string;
  inputHint?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
}) {
  const [draftValue, setDraftValue] = React.useState('');

  return (
    <MobileScrollView padding={4} gap={4}>
      <Box gap={2}>
        <Text role="titleLg">{title}</Text>
        <Text role="bodyMd" tone="muted">{subtitle}</Text>
      </Box>

      <Surface tone="brand" gap={3}>
        <SectionHeader title={heroTitle} subtitle={heroDescription} />
      </Surface>

      {keyValues?.length ? (
        <Surface tone="raised" gap={3}>
          <SectionHeader title="تفاصيل المسار" subtitle="تبقى فقط التفاصيل اللازمة لإجراء الكابتن الفوري ظاهرة." />
          <KeyValueList items={keyValues} />
        </Surface>
      ) : null}

      {listItems?.length ? (
        <Surface tone="default" gap={3}>
          <SectionHeader title="الصف الحالي" subtitle="كل عنصر يحافظ على قرار المسار التالي واضحًا." />
          <Box gap={2}>
            {listItems.map((item) => (
              <ListItem key={`${title}-${item.title}`} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
            ))}
          </Box>
        </Surface>
      ) : null}

      {inputLabel ? (
        <Surface tone="raised" gap={3}>
          <SectionHeader title="إدخال المسودة" subtitle="إدخال واحد موجز من الكابتن يبقي المسار مركزًا." />
          <TextField
            label={inputLabel}
            value={draftValue}
            onChangeText={setDraftValue}
            hint={inputHint}
          />
        </Surface>
      ) : null}

      <Button label={primaryLabel} onPress={onPrimaryAction} />
      {secondaryLabel ? <Button label={secondaryLabel} tone="secondary" onPress={onSecondaryAction ?? onBack} /> : null}
      {onRetry ? <Button label="إعادة المحاولة" tone="ghost" onPress={onRetry} /> : null}
    </MobileScrollView>
  );
}

export function DshCaptainOrderGetScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
  return (
    <SimpleSupportScreen
      title="عرض الطلب"
      subtitle="افتح العرض المقروء المدمج للمسار المخصص."
      heroTitle="عرض المسار المخصص"
      heroDescription="يمكن للكابتن إعادة تحميل سياق المسار من دون إعادة فتح الصندوق."
      primaryLabel="تحديث لقطة المسار"
      secondaryLabel="العودة إلى دليل الدعم"
      keyValues={[
        { label: 'الطلب', value: '#9021' },
        { label: 'الوقت المتوقع الحالي', value: '8 دقائق' },
        { label: 'أثر الازدحام', value: 'متوسط', tone: 'warning' },
      ]}
      onBack={props.onBack}
      onSecondaryAction={props.onSecondaryAction}
    />
  );
}

export function DshCaptainOrderDetailsScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
  return (
    <SimpleSupportScreen
      title="تفاصيل الطلب"
      subtitle="راجع لقطة المسار الموجهة للكابتن."
      heroTitle="لقطة طلب الكابتن"
      heroDescription="لا ينبغي أن تبقى ظاهرة هنا إلا الاستلام والتسليم والتوقيت والمرحلة الحالية."
      primaryLabel="تحديث تفاصيل الطلب"
      secondaryLabel="العودة إلى دليل الدعم"
      keyValues={[
        { label: 'الاستلام', value: 'Burger Lab - فرع حطين' },
        { label: 'التسليم', value: 'حي العليا' },
        { label: 'المرحلة', value: 'متجه إلى الاستلام', tone: 'brand' },
      ]}
      onBack={props.onBack}
      onSecondaryAction={props.onSecondaryAction}
    />
  );
}

export function DshCaptainOrdersListScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
  return (
    <SimpleSupportScreen
      title="قائمة الطلبات"
      subtitle="تصفح كل طلبات الكابتن من شاشة صف مركزة واحدة."
      heroTitle="صف مسار الكابتن"
      heroDescription="تكمّل هذه القائمة صندوق الطلبات برؤية أوسع لكنها ما زالت موجهة للطلبات."
      primaryLabel="تحديث قائمة الطلبات"
      secondaryLabel="العودة إلى دليل الدعم"
      listItems={[
        { title: 'الطلب #9021', subtitle: 'Burger Lab إلى العليا', meta: 'الاستلام خلال 8 دقائق', badgeLabel: 'التالي' },
        { title: 'الطلب #9024', subtitle: 'Green Bowl إلى طريق الملك فهد', meta: 'الاستلام خلال 15 دقيقة', badgeLabel: 'في الصف' },
      ]}
      onBack={props.onBack}
      onSecondaryAction={props.onSecondaryAction}
    />
  );
}

export function DshCaptainOrdersOffersListScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
  return (
    <SimpleSupportScreen
      title="قائمة عروض الطلبات"
      subtitle="راجع عروض الطلبات المفتوحة التي لم تقبل بعد."
      heroTitle="عروض الطلبات المتاحة"
      heroDescription="يبقى مراجعة العروض منفصلة عن الطلبات المقبولة حتى يعرف الكابتن مستوى الالتزام دائمًا."
      primaryLabel="تحديث العروض"
      secondaryLabel="العودة إلى دليل الدعم"
      listItems={[
        { title: 'عرض #440', subtitle: 'Bean House إلى النخيل', meta: 'الدفع المتوقع 22 SAR', badgeLabel: 'مفتوح' },
        { title: 'عرض #441', subtitle: 'Green Bowl إلى العليا', meta: 'الدفع المتوقع 19 SAR', badgeLabel: 'مفتوح' },
      ]}
      onBack={props.onBack}
      onSecondaryAction={props.onSecondaryAction}
    />
  );
}

export function DshCaptainOrderAcceptScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
  return (
    <OrderActionSection
      action="accept"
      onActionPress={() => props.onSecondaryAction?.()}
      onBackToInbox={props.onBack}
    />
  );
}

export function DshCaptainOrderOfferRejectScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
  return (
    <OrderActionSection
      action="order-offer-reject"
      onActionPress={() => props.onSecondaryAction?.()}
      onBackToInbox={props.onBack}
    />
  );
}

export function DshCaptainOrderPickupScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
  return (
    <OrderActionSection
      action="pickup"
      onActionPress={() => props.onSecondaryAction?.()}
      onBackToInbox={props.onBack}
    />
  );
}

export function DshCaptainOrderDeliverScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
  return (
    <OrderActionSection
      action="deliver"
      onActionPress={() => props.onSecondaryAction?.()}
      onBackToInbox={props.onBack}
    />
  );
}

export function DshCaptainProofUploadScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
  return (
    <OrderProofSection
      onActionPress={() => props.onSecondaryAction?.()}
      onBackToInbox={props.onBack}
    />
  );
}

export function DshCaptainJobRejectScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
  return <DshCaptainOrderOfferRejectScreen {...props} />;
}

export { DshCaptainOrdersScreen as default };
