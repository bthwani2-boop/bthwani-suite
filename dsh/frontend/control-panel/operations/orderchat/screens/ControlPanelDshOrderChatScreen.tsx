"use client";

import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import { useRouter } from 'next/navigation';
import {
  Badge,
  Box,
  Button,
  Surface,
  Text,
  TextField,
  useTheme,
} from '@bthwani/ui-kit';
import {
  WebMissionHeroCard,
  WebPageFrame,
  WebSectionCard,
} from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard } from '../../../shared';
import { getSampleDshOrder } from '../../orders/order-fixtures';
import { useDshControlPanelText } from '../../shared/dshControlPanelText';

type ChatSide = 'start' | 'end';
type ComposerAttachmentKind = 'voice' | 'camera' | 'video' | 'attachment';

type OrderChatMessage = {
  id: string;
  sender: string;
  text: string;
  time: string;
  side: ChatSide;
};

const initialMessages: OrderChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'العمليات',
    text: 'الطلب تحت المراجعة. أبقِ التحديثات مختصرة حتى لا يضيع المسار.',
    time: '09:04',
    side: 'end',
  },
  {
    id: 'msg-2',
    sender: 'الكابتن',
    text: 'تم الوصول إلى نقطة الاستلام وأنتظر الإشارة التالية.',
    time: '09:06',
    side: 'start',
  },
  {
    id: 'msg-3',
    sender: 'العميل',
    text: 'أنا جاهز عند الباب عند الوصول.',
    time: '09:08',
    side: 'start',
  },
];

type ComposerActionButtonProps = {
  symbol: string;
  accessibilityLabel: string;
  disabled?: boolean;
  onPress?: () => void;
};

function ComposerActionButton({ symbol, accessibilityLabel, disabled = false, onPress }: ComposerActionButtonProps) {
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
      <Text role="label" tone={disabled ? 'soft' : 'brand'}>
        {symbol}
      </Text>
    </Pressable>
  );
}

function OrderChatBubble({ message }: { message: OrderChatMessage }) {
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

export type ControlPanelDshOrderChatScreenProps = {
  orderId: string;
  ordersHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

export function ControlPanelDshOrderChatScreen({
  orderId,
  ordersHref = '/operations?workspace=orders',
  embedded = false,
  showHeader = true,
}: ControlPanelDshOrderChatScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const order = getSampleDshOrder(dshText, orderId);
  const resolvedOrder = order ?? {
    id: orderId,
    customer: 'طلب غير متاح',
    route: 'تفاصيل الطريق غير متوفرة',
    amount: '--',
    eta: '--',
    statusLabel: 'غير متاح',
    statusTone: 'warning' as const,
    createdLabel: '--',
    destinationLabel: '--',
    captainLabel: '--',
    notes: '--',
  };
  const isReadOnly = resolvedOrder.statusTone === 'success';
  const [draft, setDraft] = React.useState('');
  const [attachments, setAttachments] = React.useState<ComposerAttachmentKind[]>([]);
  const [isSending, setIsSending] = React.useState(false);
  const [composerState, setComposerState] = React.useState<'idle' | 'typing' | 'with-attachment' | 'sending' | 'success' | 'error' | 'disabled'>(isReadOnly ? 'disabled' : 'idle');
  const [messages, setMessages] = React.useState<OrderChatMessage[]>(() => initialMessages);

  const canSend = !isReadOnly && !isSending && (draft.trim().length > 0 || attachments.length > 0);
  const orderDetailHref = `${ordersHref}/${resolvedOrder.id}`;

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

  const toggleAttachment = React.useCallback((kind: ComposerAttachmentKind) => {
    if (isReadOnly || isSending) {
      return;
    }

    setAttachments((current) => (
      current.includes(kind)
        ? current.filter((item) => item !== kind)
        : [...current, kind]
    ));
  }, [isReadOnly, isSending]);

  const handleSend = React.useCallback(() => {
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
            sender: 'العمليات',
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
  }, [attachments, canSend, draft]);

  const composerHint = isReadOnly
    ? 'تم التسليم. التواصل هنا للقراءة فقط.'
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
    <WebPageFrame
      eyebrow="تواصل الطلب"
      title="تواصل الطلب"
      description="الطلب نفسه يملك قناة مختصرة بين العمليات والكابتن حتى الإغلاق."
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <Box gap={4}>
        <ControlPanelDshDecisionBoard
          title="Order chat board"
          purpose="Keep the chat context, resolution state, and next escalation step visible."
          primaryDecision={isReadOnly ? 'Review only' : 'Send the next operational update'}
          nextAction={isReadOnly ? 'Return to the order detail screen' : 'Send reply or attachment now'}
          blockers={isReadOnly ? 'Chat is read-only after delivery.' : composerHint}
          ownerSurface="operations"
          evidenceHint={`${resolvedOrder.id} · ${resolvedOrder.statusLabel} · ${resolvedOrder.captainLabel}`}
          routeHint={orderDetailHref}
          decisionTone={isReadOnly ? 'best' : composerState === 'error' ? 'danger' : 'warning'}
        />

        <WebMissionHeroCard
          badges={[resolvedOrder.id, resolvedOrder.statusLabel, isReadOnly ? 'مقروء فقط' : 'Live']}
            eyebrow="قناة التواصل"
          title={resolvedOrder.customer}
          description={resolvedOrder.route}
          metaItems={[
            `الكابتن: ${resolvedOrder.captainLabel}`,
            `ETA: ${resolvedOrder.eta}`,
            `الوجهة: ${resolvedOrder.destinationLabel}`,
          ]}
          primaryAction={{ label: 'العودة للتفاصيل', href: orderDetailHref }}
          secondaryAction={{ label: 'العودة إلى الطلبات', href: ordersHref }}
        />

        <WebSectionCard title="سجل الرسائل" description="الردود المختصرة تبقى مرتبطة بنفس الطلب، والمحادثة تتحول إلى القراءة فقط بعد التسليم.">
          <Box gap={4}>
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
                placeholder={isReadOnly ? 'الطلب مغلق الآن' : 'اكتب ردًا مختصرًا...'}
                multiline
                numberOfLines={3}
                style={{ minHeight: 92, textAlignVertical: 'top' }}
              />
              <Box layoutDirection="row" justify="space-between" align="center" style={{ gap: 12, flexWrap: 'wrap' }}>
                <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                    <ComposerActionButton symbol="🎙" accessibilityLabel="رسالة صوتية" disabled={isReadOnly || isSending} onPress={() => toggleAttachment('voice')} />
                    <ComposerActionButton symbol="📷" accessibilityLabel="التقاط صورة" disabled={isReadOnly || isSending} onPress={() => toggleAttachment('camera')} />
                    <ComposerActionButton symbol="🎥" accessibilityLabel="التقاط فيديو" disabled={isReadOnly || isSending} onPress={() => toggleAttachment('video')} />
                    <ComposerActionButton symbol="📎" accessibilityLabel="إرفاق ملف" disabled={isReadOnly || isSending} onPress={() => toggleAttachment('attachment')} />
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
          </Box>
        </WebSectionCard>
      </Box>
    </WebPageFrame>
  );
}

export default ControlPanelDshOrderChatScreen;
