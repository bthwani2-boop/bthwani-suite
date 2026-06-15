import React from 'react';
import { Pressable, View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Icon,
  Divider,
  KeyValueList,
  MobileScrollView,
  OrderLinkedChat,
  SectionHeader,
  TextField,
  Surface,
  Text,
  radius,
  spacing,
  ActionStrip,
  useTheme,
  TopBar,
  safeArea,
  OperationalStatusHero,
  Chip,
  DeferredReviewBlock,
  StickyActionBar,
  shadowPresets,
  typographyRoles,
} from '@bthwani/ui-kit';
import { DshOperationScreenState } from '../../parts/OperationScreen';
import { getDshClientStateMeta, type DshClientState } from '../../../shared/orders/orders.client-state';
import type { DshFulfillmentDeliveryMode, CreateOrderValues } from '../../../shared/checkout/dsh-client-binding.contracts';
import { getDshClientFlowPolicy } from '../../../shared/checkout/dsh-client-binding.contracts';
import { getDshFlowPolicySummary, resolveDshOnDemandPolicyLabel } from '../../../shared/runtime/dsh-flow-registry';
import type { DshSmartTrackingSnapshot } from '../../../shared/orders';
import {
  normalizeText,
  normalizeClientFacingOrderState,
  formatRelativeTime,
  buildDefaultLifecycleStatus,
  buildDefaultProofOfDelivery,
  buildDefaultWalletImpact,
  resolveEscalationOwnerLabel,
  getClientWalletVisibilityCopy,
  lifecycleToStepId,
  getMilestoneIndex,
  FULL_JOURNEY_STEPS,
  orderChatAttachmentOptions,
  useSmartTrackingHeartbeat,
} from '../../../shared/orders';

// ─── Re-export all non-UI from shared for backward compatibility ──────────────
export type { DshTrackingTimelineItem } from '../../../shared/orders';
export type { CreateOrderValues } from '../../../shared/checkout/dsh-client-binding.contracts';
export type { DshOrderListItem, JourneyStep, JourneyPhase, OrderChatAttachmentKind, OrderChatAttachment, OrderChatMessage } from '../../../shared/orders';
export { resolveEscalationOwnerLabel, normalizeText, normalizeClientFacingOrderState, getStepModeOverride, lifecycleToStepId, getMilestoneIndex, formatOrderTime, formatRelativeTime, formatDeliveryLifecycleStatus, formatExceptionReason, formatProofType, formatVerificationResult, formatFulfillmentMode, formatCapacityState, getDefaultExceptionReason, buildDefaultServiceabilityQuote, buildDefaultAddressSnapshot, buildDefaultFulfillmentModeSnapshot, buildDefaultLifecycleStatus, buildDefaultEventTimeline, buildDefaultProofOfDelivery, buildDefaultHandoffVerification, buildDefaultWalletImpact, getClientWalletVisibilityCopy, FULL_JOURNEY_STEPS, orderChatAttachmentOptions, defaultOrderListItems, defaultCreateOrderValues, SMART_TRACKING_SEQUENCE, useSmartTrackingHeartbeat, mapLiveOrderStatusToClientState } from '../../../shared/orders';

import type { DshOrderListItem, JourneyPhase, OrderChatAttachmentKind, OrderChatMessage, JourneyStep, DshTrackingTimelineItem } from '../../../shared/orders';

// ─── UI-only prop types ───────────────────────────────────────────────────────

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
  onCreateSupportEscalation?: (issueType: string, description: string) => Promise<void>;
};

export type DshFlowHubScreenProps = {
  screenId?: string;
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export type CreateOrderJourneyScreenProps = {
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
  onCreateSupportEscalation?: (issueType: string, description: string) => Promise<void>;
  initialPhase?: JourneyPhase;
  currentStatusLabel?: string;
};

// ─── UI Components ────────────────────────────────────────────────────────────

export const StageRail = React.memo(function StageRail({ activeStepId, steps }: { activeStepId: string; steps: JourneyStep[] }) {
  const { theme } = useTheme();
  const activeIndex = Math.max(0, steps.findIndex((step) => step.id === activeStepId));

  return (
    <Box gap={3}>
      {steps.map((step, index) => {
        const isDone = index < activeIndex;
        const isActive = index === activeIndex;

        return (
          <Box key={step.id} layoutDirection="row" gap={3} align="center" style={{ flexDirection: 'row-reverse' }}>
            <Box style={{ width: 32, alignItems: 'center' }}>
              <Surface
                tone={isActive ? 'brand' : (isDone ? 'success' : 'default')}
                padding={0}
                style={{ width: 28, height: 28, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', ...(isActive ? shadowPresets.raised : {}) }}
              >
                {isDone ? (
                  <Icon name="checkmark-sharp" size={16} color={theme.brandContrast} />
                ) : (
                  <Text role="bodyStrong" style={{ color: isActive ? theme.brandContrast : theme.textSoft, fontSize: typographyRoles.label.fontSize }}>
                    {index + 1}
                  </Text>
                )}
              </Surface>
              {index < steps.length - 1 ? (
                <View style={{ width: 2, flex: 1, minHeight: 32, marginTop: 6, marginBottom: -6, backgroundColor: isDone ? theme.success : theme.line, opacity: isDone ? 1 : 0.4 }} />
              ) : null}
            </Box>

            <Surface
              tone={isActive ? 'brand' : 'raised'}
              padding={3}
              radiusToken="xl"
              style={{ flex: 1, borderWidth: isActive ? 1.5 : 1, borderColor: isActive ? theme.brand : theme.line, backgroundColor: isActive ? theme.brandSurface : theme.surfaceRaised, transform: [{ scale: isActive ? 1.02 : 1 }] }}
            >
              <Box layoutDirection="row" justify="space-between" align="center" style={{ flexDirection: 'row-reverse' }}>
                <Box gap={0} style={{ flex: 1 }}>
                  <Text role="titleSm" style={{ textAlign: 'right', color: isActive ? theme.brand : theme.text }}>{step.title}</Text>
                  <Text role="bodySm" tone={isActive ? 'default' : 'muted'} style={{ textAlign: 'right' }}>{step.detail}</Text>
                </Box>
                {isActive && <Box style={{ width: 8, height: 8, borderRadius: radius.xxs, backgroundColor: theme.brand, marginLeft: spacing[2] }} />}
              </Box>
            </Surface>
          </Box>
        );
      })}
    </Box>
  );
});

export const OrderRow = React.memo(function OrderRow({ item, onOpenOrder, onReorder, isLast }: { item: DshOrderListItem; onOpenOrder?: (orderId: string) => void; onReorder?: (orderId: string) => void; isLast?: boolean }) {
  const [expanded, setExpanded] = React.useState(false);

  const resolvedMode: DshFulfillmentDeliveryMode = item.fulfillmentMode ?? 'bthwani_delivery';

  const getFulfillmentLabel = (mode?: string): string => {
    if (mode === 'bthwani_delivery') return 'توصيل بثواني';
    if (mode === 'partner_delivery') return 'توصيل المتجر';
    if (mode === 'pickup') return 'استلم بنفسك';
    return 'توصيل بثواني';
  };

  const formatAmount = (raw?: string): string => {
    if (!raw) return 'مبلغ غير محدد';
    return raw.replace('ر.س', 'ر.ي').replace(/(\d+)\.00\s*(ر\.ي)/, '$1 $2');
  };

  const displayOrderNumber = item.orderNumber || item.id.replace('dsh-', '');
  const summaryText = item.summary ? `${item.summary} — ${item.title}` : (item.title || 'تفاصيل الطلب غير مكتملة');
  const metaLine = [formatAmount(item.total), getFulfillmentLabel(resolvedMode), item.location?.trim() || null].filter(Boolean).join(' • ');

  return (
    <ActionStrip
      icon={item.isActive ? 'bicycle-outline' : 'receipt-outline'}
      title={summaryText}
      subtitle={
        <View style={{ alignItems: 'flex-end', gap: spacing[1], marginTop: 2 }}>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{metaLine}</Text>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
            <Badge label={item.statusLabel} tone={item.isActive ? 'brand' : 'default'} />
            <Text role="bodySm" tone="muted" style={{ fontSize: typographyRoles.overline.fontSize }}>#{displayOrderNumber} · {formatRelativeTime(item.timestamp)}</Text>
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
});

export const RatingStars = React.memo(function RatingStars({ value, disabled, onChange }: { value: number; disabled?: boolean; onChange: (nextValue: number) => void }) {
  const { theme } = useTheme();

  return (
    <Box layoutDirection="row" gap={1} style={{ flexDirection: 'row-reverse', justifyContent: 'flex-end', opacity: disabled ? 0.62 : 1 }}>
      {[5, 4, 3, 2, 1].map((score) => {
        const isSelected = score <= value;
        return (
          <Pressable key={score} accessibilityRole="button" accessibilityState={{ selected: isSelected, disabled }} onPress={() => { if (!disabled) onChange(score); }} style={{ padding: 2 }}>
            <Icon name={isSelected ? 'star' : 'star-outline'} size={24} color={isSelected ? theme.warning : theme.textSoft} />
          </Pressable>
        );
      })}
    </Box>
  );
});

export const OrderCaptainChatSection = React.memo(function OrderCaptainChatSection({ phase, captainLabel = 'الكابتن المكلّف' }: { phase: 'route' | 'received'; captainLabel?: string }) {
  const { theme } = useTheme();
  const isClosed = phase === 'received';
  const [draftMessage, setDraftMessage] = React.useState('');
  const [draftAttachments, setDraftAttachments] = React.useState<OrderChatAttachmentKind[]>([]);
  const [chatMessages, setChatMessages] = React.useState<OrderChatMessage[]>(() => [
    { id: 'chat-system-1', senderLabel: 'نظام الطلب', body: 'الدردشة مرتبطة بهذا الطلب فقط وتُغلق بعد التسليم.', time: 'الآن', tone: 'warning', align: 'center' },
    { id: 'chat-captain-1', senderLabel: captainLabel, body: 'إذا احتجت صورة أو فيديو أو رسالة صوتية للمنتج، أرسلها هنا وسأرد داخل نفس الطلب.', time: 'قبل قليل', tone: 'info', align: 'start', attachments: ['camera', 'video', 'voice'] },
  ]);

  const selectedAttachmentCount = draftAttachments.length;
  const canSend = !isClosed && (draftMessage.trim().length > 0 || selectedAttachmentCount > 0);
  const sendButtonLabel = draftMessage.trim().length > 0 ? 'إرسال' : selectedAttachmentCount > 0 ? 'إرسال المرفقات' : 'أضف نصًا أو مرفقًا';

  const toggleAttachment = (kind: OrderChatAttachmentKind) => {
    if (isClosed) return;
    setDraftAttachments((current) => current.includes(kind) ? current.filter((item) => item !== kind) : [...current, kind]);
  };

  const handleSendMessage = () => {
    if (!canSend) return;
    const attachments = draftAttachments.slice();
    setChatMessages((current) => ([...current, { id: `chat-client-${Date.now()}`, senderLabel: 'العميل', body: draftMessage.trim() || 'مرفقات مرتبطة بهذا الطلب', time: 'الآن', tone: 'brand', align: 'end', attachments }]));
    setDraftMessage('');
    setDraftAttachments([]);
  };

  return (
    <Surface tone="raised" gap={3} padding={2}>
      <SectionHeader title="الدردشة مع الكابتن" subtitle={isClosed ? 'الدردشة مقفلة بعد التسليم، والسجل فقط ما يزال ظاهرًا.' : 'صوت، كاميرا، وفيديو داخل نفس الصندوق دون ضوضاء إضافية.'} />

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
              <Surface key={message.id} tone="inset" padding={2} gap={1} style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: theme.line, backgroundColor: theme.surfaceRaised }}>
                <Badge label={message.senderLabel} tone={message.tone} />
                <Text role="bodySm" style={{ textAlign: 'right' }}>{message.body}</Text>
              </Surface>
            );
          }
          const isClient = message.align === 'end';
          return (
            <View key={message.id} style={{ alignSelf: isClient ? 'flex-end' : 'flex-start', width: '88%' }}>
              <Surface tone={isClient ? 'brand' : 'raised'} padding={2} gap={1} style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: isClient ? theme.brand : theme.line, backgroundColor: isClient ? theme.brandSurface : theme.surfaceRaised }}>
                <Box layoutDirection="row" gap={2} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Badge label={message.senderLabel} tone={message.tone} />
                  <Text role="caption" tone="muted">{message.time}</Text>
                </Box>
                <Text role="bodySm" style={{ textAlign: 'right' }}>{message.body}</Text>
                {message.attachments?.length ? (
                  <Box layoutDirection="row" gap={1} style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {message.attachments.map((attachmentKind: OrderChatAttachmentKind) => {
                      const attachment = orderChatAttachmentOptions[attachmentKind];
                      return <Badge key={`${message.id}-${attachment.kind}`} label={attachment.selectedLabel} tone={attachment.tone} />;
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
            {(['voice', 'camera', 'video'] as const).map((kind) => {
              const opt = orderChatAttachmentOptions[kind];
              const isSelected = draftAttachments.includes(kind);
              return (
                <Button key={kind} label={opt.label} tone={isSelected ? 'primary' : 'secondary'} size="sm" fullWidth={false}
                  leadingAccessory={<Icon name={opt.iconName as any} size={16} color={isSelected ? theme.brandContrast : theme.text} />}
                  onPress={() => toggleAttachment(kind)} style={{ minWidth: 96 }} />
              );
            })}
          </Box>
          <TextField label="رسالة إلى الكابتن" value={draftMessage} onChangeText={setDraftMessage} placeholder="اكتب رسالتك هنا" multiline numberOfLines={4} style={{ minHeight: 96, textAlignVertical: 'top' }} />
          <Button label={canSend ? sendButtonLabel : 'أضف نصًا أو مرفقًا'} onPress={handleSendMessage} disabled={!canSend} />
        </Surface>
      ) : (
        <Surface tone="inset" gap={1} padding={2}>
          <Badge label="الدردشة مقفلة" tone="warning" />
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>لا يمكن إرسال رسائل جديدة بعد التسليم. يبقى السجل هنا للمراجعة فقط.</Text>
        </Surface>
      )}
    </Surface>
  );
});

export const SmartTrackingCard = React.memo(function SmartTrackingCard({ phase, smartTracking }: { phase: JourneyPhase; smartTracking: DshSmartTrackingSnapshot }) {
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
      : smartTracking.etaMinutes === 0 ? 'وصل الآن' : null;

  return (
    <Surface tone="raised" radiusToken="xl" gap={3} padding={3}>
      <Box layoutDirection="row" align="center" justify="space-between" gap={2} style={{ flexDirection: 'row-reverse' }}>
        <Box gap={1} style={{ alignItems: 'flex-end', flex: 1 }}>
          <Badge label="متابعة ذكية" tone="brand" />
          <Text role="bodyStrong" style={{ textAlign: 'right' }}>{phase === 'received' ? 'تم التسليم بنجاح' : 'متابعة حالة الطلب'}</Text>
        </Box>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: theme.brandSurface, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="pulse-outline" size={22} color={theme.brand} />
        </View>
      </Box>

      {proximityAlert ? (
        <Surface tone={proximityAlert.tone as any} gap={2} padding={2}>
          <Box layoutDirection="row" align="center" gap={2} style={{ flexDirection: 'row-reverse' }}>
            <Icon name={proximityAlert.icon} size={20} color={theme.brand} />
            <Text role="bodyStrong" style={{ textAlign: 'right', flex: 1 }}>{proximityAlert.label}</Text>
          </Box>
        </Surface>
      ) : null}

      <KeyValueList
        items={[
          ...(etaText ? [{ label: 'الوقت التقريبي للوصول', value: etaText, tone: 'success' as const }] : []),
          { label: 'آخر تحديث', value: smartTracking.source === 'runtime_unbound' ? 'بانتظار heartbeat حي من DSH' : smartTracking.lastUpdateMinutesAgo === 0 ? 'الآن' : `منذ ${smartTracking.lastUpdateMinutesAgo} دقيقة` },
          { label: 'آلية التحديث', value: smartTracking.source === 'runtime_unbound' ? 'الربط الحي غير مفعّل بعد' : 'كل 3 دقائق — بدون خريطة حية' },
        ]}
      />
    </Surface>
  );
});

export const HorizontalMilestones = React.memo(function HorizontalMilestones({ activeStepId }: { activeStepId: string }) {
  const { theme } = useTheme();
  const currentMilestone = getMilestoneIndex(activeStepId);

  const milestones = [
    { label: 'تم الطلب', index: 0 },
    { label: 'التجهيز', index: 1 },
    { label: 'في الطريق', index: 2 },
    { label: 'التسليم', index: 3 },
  ];

  return (
    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing[3], width: '100%', position: 'relative' }}>
      <View style={{ position: 'absolute', top: 22, left: '10%', right: '10%', height: 3, backgroundColor: theme.line, zIndex: 1 }} />
      <View style={{ position: 'absolute', top: 22, right: '10%', left: `${10 + (3 - currentMilestone) * 26.6}%`, height: 3, backgroundColor: theme.brand, zIndex: 1 }} />
      {milestones.map((milestone) => {
        const isDone = milestone.index < currentMilestone;
        const isActive = milestone.index === currentMilestone;
        const isPassedOrActive = milestone.index <= currentMilestone;
        const bulletColor = isActive ? theme.brand : isDone ? theme.success : theme.line;
        return (
          <Box key={milestone.index} align="center" style={{ flex: 1, zIndex: 2 }}>
            <View style={{ width: isActive ? 20 : 14, height: isActive ? 20 : 14, borderRadius: isActive ? 10 : 7, backgroundColor: bulletColor, borderWidth: isActive ? 3 : 0, borderColor: theme.brandSurface, ...(isActive ? shadowPresets.raised : {}) }} />
            <Text role="bodySm" weight={isActive ? 'bold' : 'regular'} style={{ textAlign: 'center', marginTop: spacing[2], color: isActive ? theme.brand : isPassedOrActive ? theme.text : theme.textSoft }}>
              {milestone.label}
            </Text>
          </Box>
        );
      })}
    </View>
  );
});

export function CreateOrderJourneyScreen({ values, timeline, clientState = 'tracking_active', fulfillmentMode, onPrimaryAction: _onPrimaryAction, onBack, onSupport: _onSupport, onNextAction, onReorder, onCancelOrder: _onCancelOrder, onCreateSupportEscalation, initialPhase = 'route', currentStatusLabel }: CreateOrderJourneyScreenProps) {
  const { theme } = useTheme();
  const [phase, setPhase] = React.useState<JourneyPhase>(initialPhase);
  const resolvedMode: DshFulfillmentDeliveryMode = fulfillmentMode ?? values.fulfillmentMode ?? 'bthwani_delivery';
  const isBthwaniDelivery = resolvedMode === 'bthwani_delivery';
  const isPartnerDelivery = resolvedMode === 'partner_delivery';
  const isPickup = resolvedMode === 'pickup';
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
    if (effectiveClientState === 'delivered') setPhase('received');
  }, [effectiveClientState]);

  const smartTracking = useSmartTrackingHeartbeat(phase);
  const [lastChatMessage, setLastChatMessage] = React.useState<OrderChatMessage>({
    id: 'chat-actor-1',
    senderLabel: isBthwaniDelivery ? 'الكابتن المكلّف' : isPartnerDelivery ? 'موصل المتجر' : 'المتجر',
    body: 'إذا احتجت صورة أو فيديو أو رسالة صوتية للمنتج فأرسلها هنا ضمن نفس الطلب.',
    time: 'قبل قليل', tone: 'info', align: 'start', attachments: ['camera', 'video', 'voice'],
  });

  const clientStateMeta = getDshClientStateMeta(effectiveClientState);
  const orderCreatedMeta = getDshClientStateMeta('order_created');
  const orderConfirmedMeta = getDshClientStateMeta('order_confirmed');
  const isDeliveredState = effectiveClientState === 'delivered';
  const isTrackingJourneyState = effectiveClientState === 'tracking_active' || isDeliveredState;
  const isOrderCreationState = effectiveClientState === 'order_created' || effectiveClientState === 'order_confirmed';

  const journeyTopBarTitle = isTrackingJourneyState ? 'متابعة الطلب' : clientStateMeta.title;

  const heroTitle = isTrackingJourneyState
    ? phase === 'route'
      ? isBthwaniDelivery ? 'الكابتن في الطريق إليك' : isPartnerDelivery ? 'الطلب في الطريق مع موصل المتجر' : 'طلبك جاهز في المتجر'
      : phase === 'arrived'
        ? isBthwaniDelivery ? 'الكابتن وصل إلى موقع التسليم' : isPartnerDelivery ? 'موصل المتجر وصل إلى موقعك' : 'طلبك جاهز للاستلام الآن'
        : isPickup ? 'تم استلام الطلب' : 'تم تسليم الطلب'
    : clientStateMeta.title;

  const heroSummary = isTrackingJourneyState
    ? phase === 'route'
      ? isBthwaniDelivery ? 'طلبك في الطريق مع الكابتن. يمكنك متابعة الوقت التقريبي للوصول بالأسفل.' : isPartnerDelivery ? 'الطلب في الطريق مع موصل المتجر. يمكنك متابعة الوقت التقريبي بالأسفل.' : 'توجه إلى المتجر لاستلام طلبك مباشرة.'
      : phase === 'arrived'
        ? isBthwaniDelivery ? 'الكابتن وصل إلى موقع التسليم وهو بانتظارك لتسليم الطلب.' : isPartnerDelivery ? 'موصل المتجر وصل. استعد لاستلام طلبك.' : 'أنت على وشك الاستلام. أبرز رقم طلبك للمتجر.'
        : isPickup ? 'تم استلام طلبك من المتجر بنجاح. يمكنك تقييم التجربة أو طلب الدعم إذا واجهت أي مشكلة.' : 'تم تسليم الطلب بنجاح. شكراً لك! يمكنك تقييم الخدمة أو طلب الدعم إذا واجهت أي مشكلة.'
    : clientStateMeta.description;

  const lifecycleStatusForSteps = buildDefaultLifecycleStatus(effectiveClientState, phase);
  const activeStepId = lifecycleToStepId(lifecycleStatusForSteps);
  const activeStepIndex = Math.max(0, FULL_JOURNEY_STEPS.findIndex((s: JourneyStep) => s.id === activeStepId));

  const nextStepValue = isTrackingJourneyState
    ? phase === 'route'
      ? isBthwaniDelivery ? 'انتظر وصول الكابتن لموقعك' : isPartnerDelivery ? 'انتظر وصول موصل المتجر' : 'توجه إلى المتجر لاستلام طلبك'
      : phase === 'arrived'
        ? isBthwaniDelivery ? 'استلم طلبك من الكابتن' : isPartnerDelivery ? 'استلم طلبك من موصل المتجر' : 'استلم طلبك من المتجر'
        : isPickup ? 'تم استلام طلبك من المتجر' : 'طلبك مكتمل بنجاح'
    : clientStateMeta.description;

  const hasClientReceived = phase === 'received' || effectiveClientState === 'delivered';
  const productRatingLabel = productRating > 0 ? `${productRating}/5` : 'غير محدد';
  const captainRatingLabel = captainRating > 0 ? `${captainRating}/5` : 'غير محدد';
  const walletImpactVisibility = React.useMemo(() => buildDefaultWalletImpact(effectiveClientState), [effectiveClientState]);
  const trackingFlowSummary = getDshFlowPolicySummary('client-order-tracking');
  const issueFlowPolicy = getDshClientFlowPolicy('client-order-issue');
  const issueFlowSummary = getDshFlowPolicySummary('client-order-issue');

  const canSendMessage = phase !== 'received' && (draftMessage.trim().length > 0 || draftAttachments.length > 0);
  const chatSendLabel = draftMessage.trim().length > 0 ? 'إرسال الرسالة' : draftAttachments.length > 0 ? 'إرسال المرفقات' : 'أضف نصًا أو مرفقًا';

  const quickActions = (['camera', 'video', 'voice'] as OrderChatAttachmentKind[]).map((kind) => {
    const opt = orderChatAttachmentOptions[kind];
    const isSelected = draftAttachments.includes(kind);
    return {
      id: kind, label: opt.label, selected: isSelected, disabled: phase === 'received',
      icon: <Icon name={opt.iconName} size={18} color={isSelected ? theme.brandContrast : theme.brand} />,
      onPress: () => {
        if (isSelected) setDraftAttachments(draftAttachments.filter((k) => k !== kind));
        else setDraftAttachments([...draftAttachments, kind]);
      },
    };
  });

  const productHelperText = phase === 'route'
    ? 'سيظهر تقييم المنتج بعد الاستلام.'
    : phase === 'arrived'
      ? 'سيفتح التقييم بعد تثبيت استلام العميل للطلب.'
      : ratingsSubmitted ? 'تم إرسال التقييمين. أي تعديل جديد سيعيد فتح الإرسال.' : 'اختر تقييم المنتج من 1 إلى 5 ثم أرسل التقييم بالأسفل.';

  const deliveryActorRatingLabel = isBthwaniDelivery ? 'الكابتن' : isPartnerDelivery ? 'موصل المتجر' : 'المتجر';
  const communicationSummary = isBthwaniDelivery
    ? 'يمكنك مراسلة الكابتن مباشرة داخل الطلب، أو تنبيهه، أو طلب الدعم والمساعدة عند وجود مشكلة.'
    : isPartnerDelivery
      ? 'يمكنك متابعة حالة التوصيل أو مراسلة موصل المتجر أو طلب الدعم عند وجود مشكلة.'
      : 'توجه إلى المتجر لاستلام طلبك، ويمكنك طلب الدعم أو الإبلاغ عن مشكلة عند الحاجة.';
  const chatTitle = isBthwaniDelivery ? 'الدردشة مع الكابتن' : 'الدردشة مع موصل المتجر';
  const chatInputLabel = isBthwaniDelivery ? 'رسالة إلى الكابتن' : 'رسالة إلى موصل المتجر';

  const heroDetailItems = [
    ...(isPickup ? [{ label: 'موقع الاستلام', value: pickupLocationValue }] : [{ label: 'المسار', value: journeyRouteValue }]),
    ...(isTrackingJourneyState && phase !== 'received' && !isPickup && smartTracking.etaMinutes !== null
      ? [{ label: 'الوقت التقريبي للوصول', value: smartTracking.etaMinutes > 0 ? `تقريباً ${smartTracking.etaMinutes} دقيقة` : 'وصل الآن', tone: 'success' as const }]
      : []),
    ...(isTrackingJourneyState && phase !== 'received'
      ? [{ label: 'آخر تحديث', value: smartTracking.lastUpdateMinutesAgo === 0 ? 'الآن' : `منذ ${smartTracking.lastUpdateMinutesAgo} دقيقة` }]
      : []),
    { label: 'الإجراء التالي', value: nextStepValue, tone: 'brand' as const },
  ];

  const captainHelperText = phase === 'route'
    ? `سيظهر تقييم ${deliveryActorRatingLabel} بعد الاستلام.`
    : phase === 'arrived'
      ? `سيبقى تقييم ${deliveryActorRatingLabel} مؤجلًا حتى تثبيت الاستلام.`
      : ratingsSubmitted ? `تم إرسال التقييمين. يمكنك تعديل ${deliveryActorRatingLabel} ثم إعادة الإرسال.` : `اختر تقييم ${deliveryActorRatingLabel} من 1 إلى 5 ثم أرسل التقييم بالأسفل.`;

  const handleProductRatingChange = (nextValue: number) => { setProductRating(nextValue); if (ratingsSubmitted) setRatingsSubmitted(false); };
  const handleCaptainRatingChange = (nextValue: number) => { setCaptainRating(nextValue); if (ratingsSubmitted) setRatingsSubmitted(false); };

  const handleSendMessage = () => {
    if (!canSendMessage) return;
    setLastChatMessage({ id: `chat-client-${Date.now()}`, senderLabel: 'العميل', body: draftMessage.trim() || 'أرسل مرفقات سريعة للمنتج', time: 'الآن', tone: 'brand', align: 'end', attachments: draftAttachments.slice() });
    setDraftMessage('');
    setDraftAttachments([]);
  };

  const reviewStateLabel = ratingsSubmitted ? 'مكتمل ومثبّت' : hasClientReceived ? 'جاهز للاستلام والتقييم' : 'مؤجل حتى اكتمال الطلب';

  const stickyNote = hasClientReceived ? undefined : isOrderCreationState ? 'الطلب قيد المعالجة الإدارية. يمكنك الرجوع للطلبات لمتابعة المراجعة.' : isPickup ? 'بانتظار استلام العميل للطلب في المتجر.' : isBthwaniDelivery ? 'الكابتن مكلّف حالياً بتوصيل طلبك.' : 'موصل المتجر مكلّف بتوصيل طلبك.';

  const primaryAction = isTrackingJourneyState
    ? phase === 'route'
      ? isPickup ? { label: 'استلمت الطلب', onPress: () => setPhase('received') } : isBthwaniDelivery ? { label: 'تنبيه الكابتن بالاقتراب', onPress: () => setHasAlertedCaptain(true) } : undefined
      : phase === 'arrived' ? { label: 'تأكيد استلام الطلب', onPress: () => setPhase('received') } : undefined
    : undefined;

  const secondaryAction = isTrackingJourneyState
    ? phase !== 'received' ? { label: 'العودة للطلبات', onPress: onNextAction } : undefined
    : { label: 'العودة للطلبات', onPress: onNextAction };

  const hasStickyBar = !!stickyNote || !!primaryAction || !!secondaryAction;

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar variant="surface" title={journeyTopBarTitle} actions={onBack ? [{ id: 'back', icon: <Icon name="chevron-back" mirrored size={18} />, accessibilityLabel: 'العودة', onPress: onBack }] : []} />

      <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: safeArea.comfortable + (hasStickyBar ? actionBarHeight + spacing[6] : spacing[12]) }}>
        <OperationalStatusHero statusLabel={currentStatusLabel ?? clientStateMeta.label} title={heroTitle} summary={heroSummary} items={heroDetailItems} statusTone={isDeliveredState || phase === 'received' ? 'success' : 'brand'} />

        <Surface tone="raised" radiusToken="xl" gap={2} padding={3}>
          <SectionHeader title="خطوات تقدم الطلب" subtitle="مراحل رحلتك حتى وصول الطلب النهائي." />
          <HorizontalMilestones activeStepId={activeStepId} />
        </Surface>

        <Surface tone="raised" radiusToken="xl" gap={3} padding={3}>
          <SectionHeader title="جدول التتبع المرئي" subtitle="جدول الخطوات التي تم إكمالها والمتبقية للتوصيل." />
          <StageRail activeStepId={activeStepId} steps={timeline} />
        </Surface>

        {isTrackingJourneyState && <SmartTrackingCard phase={phase} smartTracking={smartTracking} />}

        <Surface tone="raised" padding={4} radiusToken="xl" gap={3}>
          <Text role="titleMd" weight="bold" style={{ textAlign: 'right' }}>متابعة الطلب والدعم</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{communicationSummary}</Text>

          <Box layoutDirection="row" gap={2} style={{ flexDirection: 'row-reverse' }}>
            {!isPickup && (
              <Button label={isChatExpanded ? 'إغلاق الدردشة' : chatTitle} leadingAccessory={<Icon name="chatbubbles-outline" size={18} color={isChatExpanded ? theme.brandContrast : theme.brand} />} onPress={() => setIsChatExpanded(!isChatExpanded)} style={{ flex: 1, minWidth: 120 }} />
            )}
            <Button label={isSupportExpanded ? 'إغلاق الدعم' : 'الدعم أو الإبلاغ عن مشكلة'} tone={isSupportExpanded ? 'brand' : 'secondary'} leadingAccessory={<Icon name="help-circle-outline" size={18} color={isSupportExpanded ? theme.brandContrast : theme.brand} />} onPress={() => setIsSupportExpanded(!isSupportExpanded)} style={{ flex: 1, minWidth: 120 }} />
          </Box>

          {isBthwaniDelivery && hasAlertedCaptain && !hasClientReceived && (
            <Box layoutDirection="row" align="center" gap={2} style={{ marginTop: spacing[1] }}>
              <Icon name="checkmark-circle-outline" size={16} color={theme.success} />
              <Text role="bodySm" style={{ color: theme.success, textAlign: 'right' }}>أرسلنا تنبيهًا للكابتن داخل هذا الطلب.</Text>
            </Box>
          )}
        </Surface>

        {isChatExpanded && !isPickup && (
          <OrderLinkedChat
            title={chatTitle}
            subtitle={phase === 'received' ? 'السجل ظاهر للمراجعة فقط بعد الاستلام.' : 'آخر رسالة ومرفقات سريعة داخل نفس الصندوق.'}
            statusLabel={phase === 'received' ? 'الدردشة مقفلة' : 'مرتبطة بهذا الطلب'}
            statusTone={phase === 'received' ? 'warning' : 'brand'}
            helperText={phase === 'received' ? 'لا يمكن إرسال رسائل جديدة بعد الاستلام.' : 'اكتب رسالة واحدة واضحة أو أرسل مرفقًا سريعًا دون فتح واجهات إضافية.'}
            message={{ senderLabel: lastChatMessage.senderLabel, body: lastChatMessage.body, meta: lastChatMessage.time, tone: lastChatMessage.tone }}
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
                <Chip label={resolveDshOnDemandPolicyLabel(issueFlowPolicy)} tone="warning" />
              </Box>
              <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
                {`مالك قرار التصعيد: ${resolveEscalationOwnerLabel(issueFlowSummary?.escalationOwner)} · الأفعال الممنوعة: ${issueFlowSummary?.forbiddenActions.join('، ') ?? 'غير محدد'}`}
              </Text>
            </Surface>

            {isSupportSubmitted ? (
              <Box gap={3} align="center" style={{ paddingVertical: 10 }}>
                <Box style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: theme.brandSurface, alignItems: 'center', justifyContent: 'center', marginBottom: spacing[2] }}>
                  <Icon name="checkmark-circle" size={40} color={theme.brand} />
                </Box>
                <Text role="titleMd" weight="bold" style={{ textAlign: 'center' }}>تم إرسال بلاغك بنجاح</Text>
                <Text role="bodySm" tone="muted" style={{ textAlign: 'center', paddingHorizontal: spacing[4] }}>
                  تلقينا تفاصيل مشكلتك وسيقوم فريق الدعم والمساعدة بمراجعة طلبك والتواصل معك في أقرب وقت ممكن.
                </Text>
                <KeyValueList dense items={[{ label: 'نوع المشكلة', value: issueTypes.find(i => i.id === selectedIssue)?.label ?? '' }, { label: 'تفاصيل إضافية', value: supportDetailsText.trim() || 'لا يوجد تفاصيل إضافية' }]} />
                <Button label="موافق" onPress={() => { setIsSupportExpanded(false); setIsSupportSubmitted(false); setSelectedIssue(null); setSupportDetailsText(''); }} style={{ width: '100%', marginTop: spacing[2] }} />
              </Box>
            ) : (
              <Box gap={3}>
                <Box gap={1} style={{ alignItems: 'flex-end' }}>
                  <Text role="titleMd" weight="bold" style={{ textAlign: 'right' }}>الدعم والمساعدة</Text>
                  <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>اختر نوع المشكلة في طلبك لمتابعتها مع الدعم الفني فوراً.</Text>
                </Box>
                <Box layoutDirection="row" gap={1} style={{ flexWrap: 'wrap', justifyContent: 'flex-end', flexDirection: 'row-reverse' }}>
                  {issueTypes.map((issue) => (
                    <Chip key={issue.id} label={issue.label} tone={selectedIssue === issue.id ? 'brand' : 'default'} onPress={() => setSelectedIssue(selectedIssue === issue.id ? null : issue.id)} />
                  ))}
                </Box>
                <TextField label="تفاصيل إضافية" value={supportDetailsText} placeholder="اكتب ملاحظة قصيرة تساعد فريق الدعم" onChangeText={setSupportDetailsText} style={{ textAlign: 'right' }} />
                <Surface tone="inset" padding={3} radiusToken="lg" gap={2} style={{ marginTop: spacing[2] }}>
                  <Box layoutDirection="row" align="center" gap={2} style={{ flexDirection: 'row-reverse' }}>
                    <Icon name="camera-outline" size={18} color={theme.warning} />
                    <Text role="bodyStrong" style={{ textAlign: 'right', flex: 1 }}>إرفاق الإثبات سيُفعّل بعد ربط رفع الوسائط الحي</Text>
                  </Box>
                  <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>لا يتم إنشاء أي ملف تجريبي داخل هذا الطلب. عند اكتمال الربط سيُرفع الإثبات إلى DSH API ثم MinIO/S3.</Text>
                </Surface>
                <Button
                  label={selectedIssue ? 'إرسال البلاغ' : 'اختر نوع المشكلة أولاً'}
                  disabled={!selectedIssue}
                  onPress={async () => {
                    if (onCreateSupportEscalation && selectedIssue) {
                      try { await onCreateSupportEscalation(selectedIssue, supportDetailsText); setIsSupportSubmitted(true); }
                      catch (err) { console.error('Failed to submit support escalation:', err); }
                    } else { setIsSupportSubmitted(true); }
                  }}
                  style={{ marginTop: spacing[2] }}
                />
              </Box>
            )}
          </Surface>
        )}

        {hasClientReceived && (
          <Surface tone="raised" padding={4} radiusToken="xl" gap={3}>
            <Text role="titleMd" weight="bold" style={{ textAlign: 'right', color: theme.success }}>
              {isPickup ? 'تقييم التجربة بعد الاستلام' : 'تقييم الخدمة وما بعد التسليم'}
            </Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              {isPickup ? 'يسعدنا معرفة رأيك في جودة المنتج وتجربة الاستلام من المتجر.' : `يسعدنا معرفة رأيك في جودة المنتج وتجربتك مع ${deliveryActorRatingLabel}.`}
            </Text>
            <DeferredReviewBlock title="تقييم المنتج" subtitle="ما هو رأيك في جودة ومطابقة المنتجات المستلمة؟" enabled={true} placeholderText="يرجى تقييم المنتج" currentValueLabel={productRatingLabel} stateLabel={reviewStateLabel} helperText={productHelperText} value={productRating} onChange={handleProductRatingChange} submitted={ratingsSubmitted} />
            <DeferredReviewBlock title={`تقييم ${deliveryActorRatingLabel}`} subtitle={`كيف كانت تجربة ${isBthwaniDelivery ? 'التواصل وسرعة التوصيل مع الكابتن' : isPartnerDelivery ? 'التوصيل مع موصل المتجر' : 'الاستلام من المتجر'}؟`} enabled={true} placeholderText={`يرجى تقييم ${deliveryActorRatingLabel}`} currentValueLabel={captainRatingLabel} stateLabel={reviewStateLabel} helperText={captainHelperText} value={captainRating} onChange={handleCaptainRatingChange} submitted={ratingsSubmitted} placeholderTone="brand" />
            <Divider />
            <Box gap={2}>
              {onReorder && <Button label="إعادة الطلب" onPress={onReorder} />}
              <Button label={isSupportExpanded ? 'إغلاق الدعم' : 'الدعم أو الإبلاغ عن مشكلة'} tone="secondary" onPress={() => setIsSupportExpanded(!isSupportExpanded)} />
            </Box>
          </Surface>
        )}

        {walletImpactVisibility ? (
          <Surface tone="inset" gap={2} padding={3} radiusToken="xl">
            <Box layoutDirection="row" align="center" justify="space-between" gap={2} style={{ flexDirection: 'row-reverse' }}>
              <Box gap={1} style={{ alignItems: 'flex-end', flex: 1 }}>
                <Text role="bodyStrong" style={{ textAlign: 'right' }}>الأثر المالي داخل الطلب</Text>
                <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                  {trackingFlowSummary?.nextPolicyActionPreview ?? 'يبقى هذا الجزء مختصرًا حتى تفتح التفاصيل عند الحاجة.'}
                </Text>
              </Box>
              <Button label={isFinancialDetailsExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'} tone={isFinancialDetailsExpanded ? 'secondary' : 'ghost'} size="sm" fullWidth={false} onPress={() => setIsFinancialDetailsExpanded((current) => !current)} />
            </Box>
            {isFinancialDetailsExpanded ? (
              <>
                <KeyValueList items={[
                  { label: 'المبلغ المدفوع', value: `${walletImpactVisibility.paid_amount} ر.ي` },
                  { label: 'رسوم التوصيل', value: `${walletImpactVisibility.delivery_fee} ر.ي` },
                  { label: 'الخصم', value: `${walletImpactVisibility.discount} ر.ي` },
                  { label: 'رصيد المحفظة', value: `${walletImpactVisibility.wallet_credit} ر.ي` },
                  { label: 'المسترد المكتمل', value: `${walletImpactVisibility.refund_completed} ر.ي`, tone: 'success' },
                  { label: 'الاسترداد المعلق', value: `${walletImpactVisibility.refund_pending} ر.ي`, tone: walletImpactVisibility.refund_pending > 0 ? 'warning' : 'default' },
                ]} />
                {walletImpactVisibility.note ? <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{walletImpactVisibility.note}</Text> : null}
              </>
            ) : (
              <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>افتح هذا الجزء فقط عند الحاجة لمراجعة رصيد المحفظة أو حالة الاسترداد.</Text>
            )}
          </Surface>
        ) : null}

        <View style={{ height: spacing[1] }} />
      </MobileScrollView>

      {hasStickyBar ? (
        <StickyActionBar primaryAction={primaryAction} secondaryAction={secondaryAction} note={stickyNote} onHeightChange={setActionBarHeight} />
      ) : null}
    </View>
  );
}

export function renderTracking(
  clientState: DshClientState,
  currentStatusLabel: string,
  timeline: DshTrackingTimelineItem[],
  onSupport?: () => void,
  onNextAction?: () => void,
  onReorder?: () => void,
) {
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
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{trackingStateMeta.description}</Text>
        </Box>
      </Surface>

      <Surface tone="raised" gap={3} padding={2}>
        <SectionHeader title="الحالة الحالية" subtitle="آخر محطة مرئية الآن في مسار التنفيذ." />
        <KeyValueList items={[
          { label: 'المرحلة الحالية', value: activeItem?.title ?? currentStatusLabel, tone: 'brand' },
          { label: 'الخطوة التالية', value: timeline[activeTimelineIndex + 1]?.title ?? trackingStateMeta.label, tone: 'success' },
          { label: 'آخر تحديث', value: activeItem?.detail ?? 'مباشر' },
        ]} />
      </Surface>

      <Surface tone="inset" gap={2} padding={2}>
        <Text role="bodyStrong" style={{ textAlign: 'right' }}>سياسة العرض داخل الطلب</Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          {trackingFlowSummary?.nextPolicyActionPreview ?? 'يبدأ المسار بملخص الحالة، ويفتح التفصيل فقط عند الطلب.'}
        </Text>
        <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
          {`النمط الحالي: ${resolveDshOnDemandPolicyLabel(trackingFlowPolicy)}`}
        </Text>
      </Surface>

      {walletVisibilityCopy ? (
        <Surface tone="inset" gap={2} padding={2}>
          <Text role="bodyStrong" style={{ textAlign: 'right' }}>{walletVisibilityCopy.title}</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{walletVisibilityCopy.description}</Text>
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
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{supportDescription}</Text>
        <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
          {`الدعم contextual داخل الطلب فقط · مالك التصعيد: ${resolveEscalationOwnerLabel(issueFlowSummary?.escalationOwner)}`}
        </Text>
        {trackingStateMeta.isException && !onSupport ? (
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>لا يوجد مسار دعم موصول حاليًا داخل هذا العرض.</Text>
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
