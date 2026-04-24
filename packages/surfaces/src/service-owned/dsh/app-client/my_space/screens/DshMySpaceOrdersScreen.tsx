import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Card,
  Chip,
  KeyValueList,
  OptionRow,
  SectionHeader,
  Surface,
  Text,
  useTheme,
} from '@bthwani/ui-kit';
import {
  dshMySpaceOrderFilters,
  dshMySpaceOrderMetrics,
  dshMySpaceOrdersFixture,
  dshMySpaceQuickActions,
  type DshMySpaceOrder,
  type DshMySpaceQuickAction,
  type DshMySpaceQuickActionKind,
  type DshMySpaceOrderFilterId,
  type DshMySpaceOrderMetric,
} from '../fixtures/dshMySpaceOrdersFixture';

export type DshMySpaceOrdersScreenProps = {
  onOpenTracking?: () => void;
  onRepeatOrder?: () => void;
  onOpenOrders?: () => void;
};

function OrderMetricCard({ metric }: { metric: DshMySpaceOrderMetric }) {
  const { theme } = useTheme();
  const accent = {
    brand: theme.brand,
    info: theme.info,
    warning: theme.warning,
    success: theme.success,
  }[metric.tone];

  return (
    <Card
      title={metric.label}
      subtitle={metric.helperText}
      style={{
        flexBasis: '48%',
        flexGrow: 1,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: theme.line,
      }}
    >
      <Text role="hero" style={{ color: accent }}>
        {metric.value}
      </Text>
    </Card>
  );
}

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

function resolveFilterOrders(filterId: DshMySpaceOrderFilterId, orders: DshMySpaceOrder[]) {
  if (filterId === 'all') {
    return orders;
  }

  if (filterId === 'active') {
    return orders.filter((order) => order.statusId === 'active');
  }

  if (filterId === 'pickup') {
    return orders.filter((order) => order.fulfillmentId === 'pickup');
  }

  return orders.filter((order) => order.fulfillmentId === 'delivery');
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
  const [selectedFilterId, setSelectedFilterId] = React.useState<DshMySpaceOrderFilterId>('all');

  const visibleOrders = resolveFilterOrders(selectedFilterId, dshMySpaceOrdersFixture);

  return (
    <Box gap={2}>
      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader
          title="لمحة سريعة"
          subtitle="الطلبات النشطة والسابقة ظاهرة هنا مع تكرار مباشر وتتبّع واضح في خطوة واحدة."
        />

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {dshMySpaceOrderMetrics.map((metric) => (
            <OrderMetricCard key={metric.label} metric={metric} />
          ))}
        </Box>
      </Surface>

      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader title="الفلترة" subtitle="اختر نوع الطلب الذي تريد أن يبقى في الواجهة." />

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {dshMySpaceOrderFilters.map((filter) => (
            <Chip key={filter.id} label={filter.label} selected={selectedFilterId === filter.id} onPress={() => setSelectedFilterId(filter.id)} />
          ))}
        </Box>
      </Surface>

      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader title="الطلبات المعروضة" subtitle={`${visibleOrders.length} طلبات ظاهرة الآن مع مسار حالة واضح لكل بطاقة.`} />

        <Box gap={2}>
          {visibleOrders.length > 0 ? (
            visibleOrders.map((order, index) => (
              <OrderCard
                key={order.id}
                order={order}
                featured={index === 0}
                onOpenTracking={onOpenTracking}
                onRepeatOrder={onRepeatOrder}
                onOpenOrders={onOpenOrders}
              />
            ))
          ) : (
            <Surface tone="inset" padding={2} gap={1}>
              <Text role="bodyStrong">لا توجد طلبات مطابقة لهذا الفلتر.</Text>
              <Text role="bodySm" tone="muted">
                جرّب إظهار الكل أو العودة إلى التتبع المباشر.
              </Text>
              <Box layoutDirection="row" gap={2}>
                <Button label="إظهار الكل" onPress={() => setSelectedFilterId('all')} fullWidth={false} />
                {onOpenTracking ? <Button label="التتبع" tone="secondary" onPress={onOpenTracking} fullWidth={false} /> : null}
              </Box>
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
    </Box>
  );
}

export default DshMySpaceOrdersScreen;
