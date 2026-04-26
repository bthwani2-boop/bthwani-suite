import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Chip,
  KeyValueList,
  OptionRow,
  SectionHeader,
  Surface,
  Text,
  useTheme,
} from '@bthwani/ui-kit';
import {
  dshMySpaceOrdersFixture,
  dshMySpaceQuickActions,
  type DshMySpaceOrder,
  type DshMySpaceQuickAction,
  type DshMySpaceQuickActionKind,
} from '../fixtures/dshMySpaceOrdersFixture';

export type DshMySpaceOrdersScreenProps = {
  onOpenTracking?: () => void;
  onRepeatOrder?: () => void;
  onOpenOrders?: () => void;
};

function resolveOrderIconName(order: DshMySpaceOrder): React.ComponentProps<typeof Ionicons>['name'] {
  if (order.statusId === 'active') {
    return 'bicycle-outline';
  }

  if (order.fulfillmentId === 'pickup') {
    return 'storefront-outline';
  }

  return order.statusId === 'completed' ? 'checkmark-circle-outline' : 'time-outline';
}

function resolvePrimaryActionLabel(order: DshMySpaceOrder) {
  return order.statusId === 'active' ? 'تتبع الطلب' : 'تكرار الطلب';
}

function resolveSecondaryActionLabel(order: DshMySpaceOrder) {
  return order.statusId === 'active' ? 'تكرار الطلب' : 'التتبع';
}

function resolveStatusTone(order: DshMySpaceOrder): 'brand' | 'success' | 'warning' | 'danger' {
  return order.statusTone;
}

function resolvePrimaryOrder(orders: DshMySpaceOrder[]) {
  return orders.find((order) => order.statusId === 'active') ?? orders[0];
}

function resolveRepeatReadyOrders(orders: DshMySpaceOrder[]) {
  return orders.filter((order) => order.statusId === 'completed' || order.statusId === 'ready');
}

function resolvePendingReviewOrders(orders: DshMySpaceOrder[]) {
  return orders.filter((order) => order.needsReview);
}

function OrderCard({
  order,
  featured,
  onOpenTracking,
  onRepeatOrder,
  onOpenOrders,
}: {
  order: DshMySpaceOrder;
  featured?: boolean;
  onOpenTracking?: () => void;
  onRepeatOrder?: () => void;
  onOpenOrders?: () => void;
}) {
  const { theme } = useTheme();
  const iconName = resolveOrderIconName(order);
  const primaryLabel = resolvePrimaryActionLabel(order);
  const secondaryLabel = resolveSecondaryActionLabel(order);
  const trackingAction = onOpenTracking ?? onOpenOrders ?? onRepeatOrder;
  const repeatAction = onRepeatOrder ?? onOpenOrders ?? onOpenTracking;
  const primaryAction = order.statusId === 'active' ? trackingAction : repeatAction;
  const secondaryAction = order.statusId === 'active' ? repeatAction : trackingAction;

  return (
    <Surface
      tone={featured ? 'inset' : 'raised'}
      padding={2}
      gap={2}
      style={{
        borderRadius: 20,
        borderWidth: 1,
        borderColor: featured ? theme.brand : theme.line,
        backgroundColor: featured ? theme.brandSurface : theme.surfaceRaised,
        shadowColor: featured ? theme.brand : '#020617',
        shadowOpacity: featured ? 0.1 : 0.05,
        shadowRadius: featured ? 14 : 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: featured ? 3 : 1,
      }}
    >
      <Box layoutDirection="row" align="center" gap={2}>
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: featured ? theme.brand : theme.line,
            backgroundColor: featured ? theme.brand : theme.brandSurface,
          }}
        >
          <Ionicons name={iconName} size={20} color={featured ? theme.brandContrast : theme.brand} />
        </View>

        <Box gap={0} style={{ flex: 1 }}>
          <Text role="bodyStrong">{order.title}</Text>
          <Text role="bodySm" tone="muted" numberOfLines={2}>
            {order.summary}
          </Text>
        </Box>

        <Box gap={1} style={{ alignItems: 'flex-end' }}>
          <Badge label={order.statusLabel} tone={resolveStatusTone(order)} />
          <Chip label={order.fulfillmentLabel} selected />
        </Box>
      </Box>

      <KeyValueList
        dense
        items={[
          { label: 'رقم الطلب', value: order.orderNumber },
          { label: 'الوقت', value: order.placedAt },
          { label: 'الإجمالي', value: order.totalLabel, tone: 'brand' },
          { label: 'آخر حالة', value: order.statusTrailLabel },
        ]}
      />

      <Box layoutDirection="row" gap={2}>
        {primaryAction ? <Button label={primaryLabel} onPress={primaryAction} fullWidth={false} style={{ flex: 1 }} /> : null}
        {secondaryAction ? (
          <Button label={secondaryLabel} tone="secondary" onPress={secondaryAction} fullWidth={false} style={{ flex: 1 }} />
        ) : null}
      </Box>
    </Surface>
  );
}

function resolveQuickActionHandler(
  kind: DshMySpaceQuickActionKind,
  callbacks: {
    onOpenTracking?: () => void;
    onRepeatOrder?: () => void;
    onOpenOrders?: () => void;
  },
) {
  if (kind === 'tracking') {
    return callbacks.onOpenTracking ?? callbacks.onOpenOrders ?? callbacks.onRepeatOrder;
  }

  if (kind === 'repeat') {
    return callbacks.onRepeatOrder ?? callbacks.onOpenOrders ?? callbacks.onOpenTracking;
  }

  return callbacks.onOpenOrders ?? callbacks.onRepeatOrder ?? callbacks.onOpenTracking;
}

function QuickActionPanel({
  quickActions,
  onOpenOrders,
  onOpenTracking,
  onRepeatOrder,
}: {
  quickActions: DshMySpaceQuickAction[];
  onOpenTracking?: () => void;
  onRepeatOrder?: () => void;
  onOpenOrders?: () => void;
}) {
  return (
    <Surface tone="raised" padding={2} gap={2}>
      <SectionHeader title="مسارات سريعة" subtitle="فتح الطلبات الحديثة أو الانتقال إلى التتبع دون ضياع المسار." />

      <Box gap={2}>
        {quickActions.map((action) => (
          <OptionRow
            key={action.id}
            title={action.label}
            subtitle={action.summary}
            actionLabel={action.actionLabel}
            onAction={resolveQuickActionHandler(action.kind, { onOpenOrders, onOpenTracking, onRepeatOrder })}
          />
        ))}
      </Box>
    </Surface>
  );
}

export function DshMySpaceOrdersScreen({ onOpenOrders, onOpenTracking, onRepeatOrder }: DshMySpaceOrdersScreenProps) {
  const primaryOrder = resolvePrimaryOrder(dshMySpaceOrdersFixture);
  const repeatReadyOrders = resolveRepeatReadyOrders(dshMySpaceOrdersFixture).filter((order) => order.id !== primaryOrder?.id);
  const pendingReviewOrders = resolvePendingReviewOrders(dshMySpaceOrdersFixture).filter((order) => order.id !== primaryOrder?.id);

  return (
    <Box gap={2}>
      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader
          title="لوحة مساحتي"
          subtitle="الأولوية دائمًا: الطلب النشط ثم الجاهز للتكرار ثم المراجعات المعلقة ثم المسارات السريعة."
        />

        <KeyValueList
          dense
          items={[
            { label: 'الطلب النشط الآن', value: primaryOrder ? 'متاح' : 'لا يوجد', tone: primaryOrder ? 'brand' : 'warning' },
            { label: 'جاهز للتكرار', value: String(repeatReadyOrders.length), tone: repeatReadyOrders.length > 0 ? 'success' : 'warning' },
            { label: 'مراجعات معلقة', value: String(pendingReviewOrders.length), tone: pendingReviewOrders.length > 0 ? 'warning' : 'success' },
          ]}
        />
      </Surface>

      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader title="الطلب النشط" subtitle="هذا هو المسار الأعلى أولوية ويظهر أولًا مع إجراء واضح." />

        {primaryOrder ? (
          <OrderCard
            order={primaryOrder}
            featured
            onOpenTracking={onOpenTracking}
            onRepeatOrder={onRepeatOrder}
            onOpenOrders={onOpenOrders}
          />
        ) : (
          <Surface tone="inset" padding={2} gap={1}>
            <Text role="bodyStrong">لا يوجد طلب نشط الآن.</Text>
            <Text role="bodySm" tone="muted">
              يمكنك فتح سجل الطلبات أو بدء طلب جديد مباشرة.
            </Text>
            <Box layoutDirection="row" gap={2}>
              {onOpenOrders ? <Button label="فتح الطلبات" onPress={onOpenOrders} fullWidth={false} /> : null}
              {onRepeatOrder ? <Button label="تكرار سريع" tone="secondary" onPress={onRepeatOrder} fullWidth={false} /> : null}
            </Box>
          </Surface>
        )}
      </Surface>

      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader title="جاهز للتكرار" subtitle="طلبات مكتملة أو جاهزة للاستلام مع إعادة طلب مباشرة." />

        <Box gap={2}>
          {repeatReadyOrders.length > 0 ? (
            repeatReadyOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onOpenTracking={onOpenTracking}
                onRepeatOrder={onRepeatOrder}
                onOpenOrders={onOpenOrders}
              />
            ))
          ) : (
            <Surface tone="inset" padding={2} gap={1}>
              <Text role="bodyStrong">لا توجد طلبات مطابقة لهذا الفلتر.</Text>
              <Text role="bodySm" tone="muted">
                ستظهر هنا الطلبات الجاهزة لإعادة التنفيذ عند توفرها.
              </Text>
              <Box layoutDirection="row" gap={2}>
                {onOpenOrders ? <Button label="فتح الطلبات" onPress={onOpenOrders} fullWidth={false} /> : null}
                {onRepeatOrder ? <Button label="تكرار سريع" tone="secondary" onPress={onRepeatOrder} fullWidth={false} /> : null}
              </Box>
            </Surface>
          )}
        </Box>
      </Surface>

      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader title="مراجعات معلقة" subtitle="طلبات تحتاج تقييمًا أو مراجعة قبل إغلاق التجربة بالكامل." />

        <Box gap={2}>
          {pendingReviewOrders.length > 0 ? (
            pendingReviewOrders.map((order) => (
              <Surface key={order.id} tone="inset" padding={2} gap={2} style={{ borderRadius: 18 }}>
                <Box layoutDirection="row" align="center" gap={2}>
                  <Box gap={0} style={{ flex: 1 }}>
                    <Text role="bodyStrong">{order.title}</Text>
                    <Text role="bodySm" tone="muted">
                      {order.statusTrailLabel}
                    </Text>
                  </Box>
                  <Badge label="مراجعة مطلوبة" tone="warning" />
                </Box>

                <Text role="bodySm" tone="muted">
                  افتح الطلب ثم أكمل التقييم حتى ينتقل المسار من المراجعة إلى الإغلاق.
                </Text>

                <Box layoutDirection="row" gap={2}>
                  {onOpenOrders ? <Button label="فتح الطلب" onPress={onOpenOrders} fullWidth={false} /> : null}
                  {onOpenTracking ? <Button label="متابعة الحالة" tone="secondary" onPress={onOpenTracking} fullWidth={false} /> : null}
                </Box>
              </Surface>
            ))
          ) : (
            <Surface tone="inset" padding={2} gap={1}>
              <Text role="bodyStrong">لا توجد مراجعات معلقة.</Text>
              <Text role="bodySm" tone="muted">
                جميع الطلبات الحالية إما نشطة أو جاهزة للتكرار مباشرة.
              </Text>
            </Surface>
          )}
        </Box>
      </Surface>

      <QuickActionPanel
        quickActions={dshMySpaceQuickActions}
        onOpenOrders={onOpenOrders}
        onOpenTracking={onOpenTracking}
        onRepeatOrder={onRepeatOrder}
      />

      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader title="كل الطلبات الحديثة" subtitle={`${dshMySpaceOrdersFixture.length} بطاقات متاحة مع CTA حسب الحالة.`} />
        <Box gap={2}>
          {dshMySpaceOrdersFixture.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onOpenTracking={onOpenTracking}
              onRepeatOrder={onRepeatOrder}
              onOpenOrders={onOpenOrders}
            />
          ))}
        </Box>
      </Surface>
    </Box>
  );
}

export default DshMySpaceOrdersScreen;
