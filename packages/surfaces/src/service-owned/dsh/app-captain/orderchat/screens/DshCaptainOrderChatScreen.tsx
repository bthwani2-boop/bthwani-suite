import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  BthBadge,
  BthBox,
  BthButton,
  BthMobileScrollView,
  BthScreenHeader,
  BthSurface,
  BthText,
  BthTextField,
  useTheme,
} from '@bthwani/ui-kit';

type ChatSide = 'start' | 'end';

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

type ComposerActionButtonProps = {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  accessibilityLabel: string;
  disabled?: boolean;
  onPress?: () => void;
};

function ComposerActionButton({ iconName, accessibilityLabel, disabled = false, onPress }: ComposerActionButtonProps) {
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
      <Ionicons name={iconName} size={18} color={disabled ? theme.textSoft : theme.brand} />
    </Pressable>
  );
}

function OrderChatBubble({ message }: { message: OrderChatMessage }) {
  const isOutbound = message.side === 'end';

  return (
    <BthBox style={{ alignSelf: isOutbound ? 'flex-end' : 'flex-start', width: '100%', maxWidth: '86%' }}>
      <BthSurface tone={isOutbound ? 'brand' : 'raised'} padding={3} gap={2} radiusToken="xl" border={false}>
        <BthBox layoutDirection="row" justify="space-between" align="center" gap={2}>
          <BthBadge label={message.sender} tone={isOutbound ? 'brand' : 'default'} />
          <BthText role="caption" tone={isOutbound ? 'inverse' : 'soft'}>{message.time}</BthText>
        </BthBox>
        <BthText role="bodySm" tone={isOutbound ? 'inverse' : 'default'}>
          {message.text}
        </BthText>
      </BthSurface>
    </BthBox>
  );
}

export type DshCaptainOrderChatScreenState = 'active' | 'readOnly';

export type DshCaptainOrderChatScreenProps = {
  taskId: string;
  pickupLabel: string;
  dropoffLabel: string;
  state?: DshCaptainOrderChatScreenState;
  onBack?: () => void;
};

export function DshCaptainOrderChatScreen({
  taskId,
  pickupLabel,
  dropoffLabel,
  state = 'active',
  onBack,
}: DshCaptainOrderChatScreenProps) {
  const isReadOnly = state === 'readOnly';
  const [draft, setDraft] = React.useState('');
  const [messages, setMessages] = React.useState<OrderChatMessage[]>(() => initialMessages);

  const canSend = !isReadOnly && draft.trim().length > 0;

  const handleSend = React.useCallback(() => {
    if (!canSend) {
      return;
    }

    const text = draft.trim();

    setMessages((current) => [
      ...current,
      {
        id: `msg-${current.length + 1}`,
        sender: 'الكابتن',
        text,
        time: 'الآن',
        side: 'end',
      },
    ]);
    setDraft('');
  }, [canSend, draft]);

  return (
    <BthMobileScrollView fill padding={4} gap={4}>
      <BthScreenHeader
        title="تواصل الطلب"
        subtitle="رسائل الطلب المختصرة تبقى مع نفس المهمة حتى الإغلاق."
        actionLabel={onBack ? 'عودة للتفاصيل' : undefined}
        onActionPress={onBack}
      />

      <BthBox gap={2}>
        <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <BthBadge label={`#${taskId}`} tone="brand" />
          <BthBadge label={isReadOnly ? 'مقروء فقط' : 'نشط'} tone={isReadOnly ? 'success' : 'warning'} />
        </BthBox>
        <BthText role="bodySm" tone="muted">
          {pickupLabel} · {dropoffLabel}
        </BthText>
      </BthBox>

      <BthSurface tone="raised" padding={4} gap={3} radiusToken="xl">
        <BthBox gap={1}>
          <BthText role="titleSm">سجل تواصل الطلب</BthText>
          <BthText role="bodySm" tone="muted">
            تحديثات قصيرة، مرفقات خفيفة، ومتابعة مباشرة من نفس الطلب.
          </BthText>
        </BthBox>

        <ScrollView style={{ maxHeight: 380 }} contentContainerStyle={{ gap: 12 }} showsVerticalScrollIndicator={false}>
          {messages.map((message) => (
            <OrderChatBubble key={message.id} message={message} />
          ))}
        </ScrollView>

        <BthSurface tone={isReadOnly ? 'inset' : 'default'} padding={3} gap={2} radiusToken="lg">
          <BthTextField
            value={draft}
            onChangeText={setDraft}
            editable={!isReadOnly}
            placeholder={isReadOnly ? 'الطلب مغلق الآن' : 'اكتب رسالة مختصرة...'}
            multiline
            numberOfLines={3}
            style={{ minHeight: 92, textAlignVertical: 'top' }}
          />
          <BthBox layoutDirection="row" justify="space-between" align="center" style={{ gap: 12, flexWrap: 'wrap' }}>
            <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              <ComposerActionButton iconName="mic-outline" accessibilityLabel="رسالة صوتية" disabled={isReadOnly} />
              <ComposerActionButton iconName="camera-outline" accessibilityLabel="التقاط صورة" disabled={isReadOnly} />
              <ComposerActionButton iconName="videocam-outline" accessibilityLabel="التقاط فيديو" disabled={isReadOnly} />
            </BthBox>
            <BthButton
              label={isReadOnly ? 'مقفل' : 'إرسال'}
              tone={isReadOnly ? 'secondary' : 'primary'}
              size="sm"
              fullWidth={false}
              disabled={!canSend}
              onPress={handleSend}
            />
          </BthBox>
          <BthText role="caption" tone="muted">
            {isReadOnly ? 'تم تسليم الطلب. التواصل هنا للقراءة فقط.' : 'الرسائل المختصرة فقط داخل هذا المسار.'}
          </BthText>
        </BthSurface>
      </BthSurface>
    </BthMobileScrollView>
  );
}

export default DshCaptainOrderChatScreen;
