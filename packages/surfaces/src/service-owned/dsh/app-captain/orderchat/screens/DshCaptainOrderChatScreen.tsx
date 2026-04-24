import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Badge,
  Box,
  Button,
  MobileScrollView,
  ScreenHeader,
  Surface,
  Text,
  TextField,
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
    <MobileScrollView fill padding={4} gap={4}>
      <ScreenHeader
        title="تواصل الطلب"
        subtitle="رسائل الطلب المختصرة تبقى مع نفس المهمة حتى الإغلاق."
        actionLabel={onBack ? 'عودة للتفاصيل' : undefined}
        onActionPress={onBack}
      />

      <Box gap={2}>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Badge label={`#${taskId}`} tone="brand" />
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
              <ComposerActionButton iconName="mic-outline" accessibilityLabel="رسالة صوتية" disabled={isReadOnly} />
              <ComposerActionButton iconName="camera-outline" accessibilityLabel="التقاط صورة" disabled={isReadOnly} />
              <ComposerActionButton iconName="videocam-outline" accessibilityLabel="التقاط فيديو" disabled={isReadOnly} />
            </Box>
            <Button
              label={isReadOnly ? 'مقفل' : 'إرسال'}
              tone={isReadOnly ? 'secondary' : 'primary'}
              size="sm"
              fullWidth={false}
              disabled={!canSend}
              onPress={handleSend}
            />
          </Box>
          <Text role="caption" tone="muted">
            {isReadOnly ? 'تم تسليم الطلب. التواصل هنا للقراءة فقط.' : 'الرسائل المختصرة فقط داخل هذا المسار.'}
          </Text>
        </Surface>
      </Surface>
    </MobileScrollView>
  );
}

export default DshCaptainOrderChatScreen;
