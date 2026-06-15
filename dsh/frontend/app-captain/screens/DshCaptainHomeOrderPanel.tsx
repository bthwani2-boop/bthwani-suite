import React from 'react';
import { Badge, Box, Button, MobileScrollView, shadowPresets, Surface, Text, TextField } from '@bthwani/ui-kit';
import type { CompactOrderChatMessage } from '../../shared';
import { CompactOrderChatBubble } from '../parts/CompactOrderChatBubble';

type InboxState = 'ready' | 'loading' | 'empty' | 'error' | 'delivered' | 'offer-accepting' | 'offer-accepted' | 'partial' | 'offline' | 'disabled';
type OrderPhase = 'pickup' | 'delivery';

type ActiveOrderSummary = {
  orderId: string;
  pickupLabel: string;
  dropoffLabel: string;
  etaLabel: string;
  currentStageLabel: string;
  nextActionLabel: string;
};

type Props = {
  isAvailable: boolean;
  availabilityLabel: string;
  availabilityDescription: string;
  availabilityChipTone: 'success' | 'warning' | 'default';
  orderBadgeLabel: string;
  inboxState: InboxState;
  activeOrderDisplayId: string;
  activeSummary: ActiveOrderSummary;
  activeOrderPhase: OrderPhase;
  activeOrderExpanded: boolean;
  activeOrderMessages: readonly CompactOrderChatMessage[];
  activeOrderDraft: string;
  onSetActiveOrderDraft: (value: string) => void;
  onCycleAvailability: () => void;
  onOpenInbox: () => void;
  onRetryInbox: () => void;
  onExpandOrder: () => void;
  onCollapseOrder: () => void;
  onConfirmPickup: () => void;
  onConfirmDelivery: () => void;
  onOpenMap: () => void;
  onSendMessage: () => void;
};

export function DshCaptainHomeOrderPanel({
  isAvailable,
  availabilityLabel,
  availabilityDescription,
  availabilityChipTone,
  orderBadgeLabel,
  inboxState,
  activeOrderDisplayId,
  activeSummary,
  activeOrderPhase,
  activeOrderExpanded,
  activeOrderMessages,
  activeOrderDraft,
  onSetActiveOrderDraft,
  onCycleAvailability,
  onOpenInbox,
  onRetryInbox,
  onExpandOrder,
  onCollapseOrder,
  onConfirmPickup,
  onConfirmDelivery,
  onOpenMap,
  onSendMessage,
}: Props) {
  const panelPadding = activeOrderExpanded ? 3 : 2;
  const panelMinHeightStyle = !activeOrderExpanded ? { minHeight: 72 } : {};
  const activeOrderCompactRouteLabel = 'Burger Lab → العميل';
  const activeOrderStageLabel = activeOrderPhase === 'pickup' ? activeSummary.currentStageLabel : 'في الطريق إلى التسليم';
  const activeOrderNextActionLabel = activeOrderPhase === 'pickup' ? activeSummary.nextActionLabel : 'أكد التسليم بعد الوصول إلى العميل';

  if (!isAvailable) {
    return (
      <Surface tone="raised" padding={panelPadding} gap={3} radiusToken="xl" style={{ ...shadowPresets.overlay, ...panelMinHeightStyle }}>
        <Badge label={availabilityLabel} tone={availabilityChipTone} />
        <Box gap={1}>
          <Text role="bodyStrong">الواجهة متوقفة حتى يعود الكابتن للتوفر</Text>
          <Text role="bodySm" tone="muted">{availabilityDescription}</Text>
        </Box>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button size="sm" fullWidth={false} tone="success" label="تبديل الحالة" onPress={onCycleAvailability} />
          <Button size="sm" fullWidth={false} tone="ghost" label="فتح الطلبات" onPress={onOpenInbox} />
        </Box>
      </Surface>
    );
  }

  if (inboxState === 'loading') {
    return (
      <Surface tone="raised" padding={3} gap={3} radiusToken="xl" style={shadowPresets.overlay}>
        <Badge label="تحميل" tone="info" />
        <Box gap={1}>
          <Text role="bodyStrong">الخريطة قيد التحضير</Text>
          <Text role="bodySm" tone="muted">سيظهر الطلب النشط هنا عندما تكتمل بيانات التشغيل المحلية.</Text>
        </Box>
      </Surface>
    );
  }

  if (inboxState === 'error') {
    return (
      <Surface tone="raised" padding={3} gap={3} radiusToken="xl" style={shadowPresets.overlay}>
        <Badge label="تنبيه" tone="danger" />
        <Box gap={1}>
          <Text role="bodyStrong">تعذر تحميل الطلب النشط</Text>
          <Text role="bodySm" tone="muted">أعد المحاولة من نفس البطاقة أو افتح صندوق الطلبات لمراجعة الصف الحالي.</Text>
        </Box>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button size="sm" fullWidth={false} label="إعادة المحاولة" onPress={onRetryInbox} />
          <Button size="sm" fullWidth={false} tone="ghost" label="صندوق الطلبات" onPress={onOpenInbox} />
        </Box>
      </Surface>
    );
  }

  if (inboxState === 'empty') {
    return (
      <Surface tone="raised" padding={3} gap={3} radiusToken="xl" style={shadowPresets.overlay}>
        <Badge label="انتظار" tone="warning" />
        <Box gap={1}>
          <Text role="bodyStrong">لا يوجد طلب نشط</Text>
          <Text role="bodySm" tone="muted">ابقَ على الخريطة حتى تصل الحركة التالية.</Text>
        </Box>
        <Button size="sm" fullWidth={false} label="فتح الطلبات" onPress={onOpenInbox} />
      </Surface>
    );
  }

  if (inboxState === 'delivered') {
    return (
      <Surface tone="raised" padding={3} gap={2} radiusToken="xl" style={shadowPresets.overlay}>
        <Badge label="مغلق" tone="default" />
        <Box gap={1}>
          <Text role="bodyStrong">لا يوجد طلب نشط</Text>
          <Text role="bodySm" tone="muted">تم إغلاق الطلب. التاريخ والحساب يظهران كملخص read-only.</Text>
        </Box>
        <Button size="sm" fullWidth={false} tone="ghost" label="عرض صندوق الطلبات" onPress={onOpenInbox} />
      </Surface>
    );
  }

  if (activeOrderExpanded) {
    return (
      <Surface tone="raised" padding={panelPadding} gap={3} radiusToken="xl" style={{ ...shadowPresets.overlay, ...panelMinHeightStyle }}>
        <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
          <Box gap={1} style={{ flex: 1 }}>
            <Text role="caption" tone="muted">الطلب النشط</Text>
            <Box layoutDirection="row" align="center" gap={2}>
              <Badge label={orderBadgeLabel} tone={availabilityChipTone} />
              <Text role="bodyStrong">#{activeOrderDisplayId}</Text>
            </Box>
          </Box>
          <Button size="sm" fullWidth={false} tone="ghost" label="طي" onPress={onCollapseOrder} />
        </Box>

        <Box gap={2}>
          <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
            <Text role="caption" tone="muted">الاستلام</Text>
            <Text role="bodySm" align="end" numberOfLines={1} style={{ flex: 1 }}>{activeSummary.pickupLabel}</Text>
          </Box>
          <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
            <Text role="caption" tone="muted">التسليم</Text>
            <Text role="bodySm" align="end" numberOfLines={1} style={{ flex: 1 }}>{activeSummary.dropoffLabel}</Text>
          </Box>
          <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
            <Text role="caption" tone="muted">المرحلة</Text>
            <Text role="bodySm" align="end" numberOfLines={1} style={{ flex: 1 }}>{activeOrderStageLabel}</Text>
          </Box>
          <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
            <Text role="caption" tone="muted">الخطوة التالية</Text>
            <Text role="bodySm" align="end" numberOfLines={1} style={{ flex: 1 }}>{activeOrderNextActionLabel}</Text>
          </Box>
        </Box>

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {activeOrderPhase === 'pickup' ? (
            <Button size="sm" fullWidth={false} tone="success" label="تأكيد الاستلام" onPress={onConfirmPickup} />
          ) : (
            <Button size="sm" fullWidth={false} tone="primary" label="تأكيد التسليم" onPress={onConfirmDelivery} />
          )}
          <Button size="sm" fullWidth={false} tone="ghost" label="خريطة المهمة" onPress={onOpenMap} />
        </Box>

        <Surface tone="inset" padding={2} gap={2} radiusToken="lg">
          <Box gap={1}>
            <Text role="caption" tone="muted">مراسلة مختصرة</Text>
            <Text role="bodySm" tone="muted">رسائل قصيرة فقط، مباشرة داخل نفس البطاقة.</Text>
          </Box>
          <Box gap={2}>
            {activeOrderMessages.slice(-2).map((message) => (
              <CompactOrderChatBubble key={message.id} message={message} />
            ))}
          </Box>
          <Box gap={2}>
            <TextField
              value={activeOrderDraft}
              onChangeText={onSetActiveOrderDraft}
              placeholder="اكتب رسالة مختصرة..."
              multiline
              numberOfLines={2}
              style={{ minHeight: 68, textAlignVertical: 'top' }}
            />
            <Box layoutDirection="row" justify="space-between" align="center" gap={2} style={{ flexWrap: 'wrap' }}>
              <Text role="caption" tone="muted">الحوار يبقى compact داخل البطاقة.</Text>
              <Button size="sm" fullWidth={false} label="إرسال" onPress={onSendMessage} disabled={!activeOrderDraft.trim()} />
            </Box>
          </Box>
        </Surface>
      </Surface>
    );
  }

  return (
    <Surface tone="raised" padding={panelPadding} gap={2} radiusToken="xl" style={{ ...shadowPresets.overlay, ...panelMinHeightStyle }}>
      <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
        <Box gap={1} style={{ flex: 1 }}>
          <Text role="caption" tone="muted">الطلب النشط</Text>
          <Box layoutDirection="row" align="center" gap={2}>
            <Badge label="نشط" tone="success" />
            <Text role="bodyStrong">#{activeOrderDisplayId}</Text>
          </Box>
        </Box>
        <Button size="sm" fullWidth={false} tone="secondary" label="توسيع" onPress={onExpandOrder} />
      </Box>
      <Text role="bodySm" numberOfLines={1} tone="muted">{activeOrderCompactRouteLabel}</Text>
      <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
        <Text role="caption" tone="muted">{activeSummary.etaLabel}</Text>
      </Box>
    </Surface>
  );
}
