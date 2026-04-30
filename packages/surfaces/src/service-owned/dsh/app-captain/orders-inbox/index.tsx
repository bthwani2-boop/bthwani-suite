import React from 'react';
import { Box, Button, ListItem, MobileScrollView, SectionHeader, StateView, Surface, Text } from '@bthwani/ui-kit';

export type CaptainOrdersInboxScreenState =
  | 'active'
  | 'noOrders'
  | 'delivered'
  | 'loading'
  | 'error';

export type CaptainOrderInboxItem = {
  id: string;
  title: string;
  pickupLabel: string;
  dropoffLabel: string;
  timingLabel: string;
  nextActionLabel: string;
  statusLabel: string;
};

export type CaptainOrdersInboxScreenProps = {
  state?: CaptainOrdersInboxScreenState;
  items?: CaptainOrderInboxItem[];
  onOpenOrder?: (orderId: string) => void;
  onOpenNextOrder?: (orderId: string) => void;
  onRetry?: () => void;
};

const demoActiveOrders: CaptainOrderInboxItem[] = [
  {
    id: 'captain-order-9021',
    title: 'الطلب #9021',
    pickupLabel: 'الاستلام: Burger Lab',
    dropoffLabel: 'التسليم: حي العليا',
    timingLabel: 'الاستلام خلال 8 دقائق',
    nextActionLabel: 'الوصول إلى نقطة الاستلام وتأكيد الجمع',
    statusLabel: 'التالي',
  },
  {
    id: 'captain-order-9024',
    title: 'الطلب #9024',
    pickupLabel: 'الاستلام: Green Bowl',
    dropoffLabel: 'التسليم: طريق الملك فهد',
    timingLabel: 'الاستلام خلال 15 دقيقة',
    nextActionLabel: 'بدء الطريق إلى نقطة الاستلام',
    statusLabel: 'في الصف',
  },
];

function renderLoadingState() {
  return (
    <StateView
      stateId="loading"
      title="جارٍ تحميل صندوق الكابتن"
      description="أبقِ الطلب التالي ظاهرًا فور توفر بيانات الصف."
    />
  );
}

function renderNoOrdersState(onRetry?: () => void) {
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

function renderDeliveredState(onRetry?: () => void) {
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

function renderErrorState(onRetry?: () => void) {
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

export function CaptainOrdersInboxScreen({
  state = 'active',
  items = demoActiveOrders,
  onOpenOrder,
  onOpenNextOrder,
  onRetry,
}: CaptainOrdersInboxScreenProps) {
  if (state === 'loading') {
    return renderLoadingState();
  }

  if (state === 'error') {
    return renderErrorState(onRetry);
  }

  if (state === 'noOrders') {
    return renderNoOrdersState(onRetry);
  }

  if (state === 'delivered') {
    return renderDeliveredState(onRetry);
  }

  if (items.length === 0) {
    return renderNoOrdersState(onRetry);
  }

  const nextOrder = items[0];

  const handleOpenNextOrder = () => {
    if (onOpenNextOrder) {
      onOpenNextOrder(nextOrder.id);
      return;
    }

    onOpenOrder?.(nextOrder.id);
  };

  return (
    <MobileScrollView padding={4} gap={3}>
      <Box gap={2}>
        <Text role="titleLg">صندوق طلبات الكابتن</Text>
        <Text role="bodySm" tone="muted">
          مسار الصندوق أولًا يبقي الطلب الفوري واضحًا ويزيل ضجيج اللوحة.
        </Text>
      </Box>

      <Surface tone="brand" gap={3}>
        <SectionHeader
          title="الطلب التالي"
          subtitle="إجراء واحد واضح قبل مسح بقية الصف."
        />
        <Box gap={1}>
          <Text role="bodyStrong">{nextOrder.title}</Text>
          <Text role="bodySm" tone="muted">
            {nextOrder.pickupLabel} | {nextOrder.dropoffLabel}
          </Text>
          <Text role="caption" tone="soft">
            {nextOrder.timingLabel} | التالي: {nextOrder.nextActionLabel}
          </Text>
        </Box>
        <Button label="فتح الطلب التالي" onPress={handleOpenNextOrder} />
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader
          title="الطلبات في الصف"
          subtitle="الحد الأدنى للقائمة: الاستلام والتسليم والوقت والخطوة التالية."
        />
        <Box gap={2}>
          {items.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              subtitle={`${item.pickupLabel} | ${item.dropoffLabel}`}
              meta={`${item.timingLabel} | التالي: ${item.nextActionLabel}`}
              badgeLabel={item.statusLabel}
              onPress={() => onOpenOrder?.(item.id)}
            />
          ))}
        </Box>
      </Surface>
    </MobileScrollView>
  );
}

export default CaptainOrdersInboxScreen;
