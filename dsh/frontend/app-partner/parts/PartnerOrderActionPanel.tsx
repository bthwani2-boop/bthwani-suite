import React from 'react';
import { Box, Button, ListItem, SectionHeader, Surface, Text } from '@bthwani/ui-kit';

export type PartnerOrderActionFlowId =
  | 'order-accept'
  | 'order-get'
  | 'order-prepare'
  | 'order-ready'
  | 'order-handoff'
  | 'order-out-for-delivery'
  | 'order-store-delivered';

const ORDER_ACTION_ITEMS: Array<{
  id: PartnerOrderActionFlowId;
  title: string;
  subtitle: string;
  badgeLabel: string;
  lifecycleStatus: string;
}> = [
  { id: 'order-accept', title: 'قبول الطلب', subtitle: 'ثبّت قبول الطلب ثم انقل الفريق إلى التحضير.', badgeLabel: 'قبول', lifecycleStatus: 'partner_accepted' },
  { id: 'order-get', title: 'استلام الطلب', subtitle: 'أكد استلام الطلب داخل الفرع قبل نقله إلى handoff أو المسار التالي.', badgeLabel: 'استلام', lifecycleStatus: 'partner_accepted' },
  { id: 'order-prepare', title: 'تحضير الطلب', subtitle: 'تابع التجهيز قبل الانتقال إلى الجاهزية.', badgeLabel: 'تحضير', lifecycleStatus: 'preparing' },
  { id: 'order-ready', title: 'تأكيد الجاهزية', subtitle: 'أعلن أن الطلب جاهز للتسليم من الفرع.', badgeLabel: 'جاهز', lifecycleStatus: 'ready_for_pickup' },
  { id: 'order-handoff', title: 'تسليم للمندوب', subtitle: 'ثبّت التسليم عند اكتمال التغليف والتحقق.', badgeLabel: 'تسليم', lifecycleStatus: 'picked_up' },
  { id: 'order-out-for-delivery', title: 'خرج للتوصيل', subtitle: 'تابع الحالة بعد مغادرة الطلب من الفرع.', badgeLabel: 'مسار', lifecycleStatus: 'enroute_to_dropoff' },
  { id: 'order-store-delivered', title: 'تسليم داخل المتجر', subtitle: 'أغلق حالة الاستلام عندما يكون الفرع هو نقطة التسليم.', badgeLabel: 'إغلاق', lifecycleStatus: 'delivered' },
];

export type DshPartnerOrderActionPanelProps = {
  activeFlowId?: PartnerOrderActionFlowId;
  onSelectFlow?: (flowId: PartnerOrderActionFlowId) => void;
};

export function DshPartnerOrderActionPanel({ activeFlowId, onSelectFlow }: DshPartnerOrderActionPanelProps) {
  return (
    <Surface tone="raised" gap={3}>
      <SectionHeader
        title="مسارات تنفيذ الطلب"
        subtitle="إجراءات الطلب تبقى قصيرة وواضحة من القبول حتى الإغلاق دون أي منطق خلفي."
      />
      <Box gap={2}>
        {ORDER_ACTION_ITEMS.map((item) => (
          <ListItem
            key={item.id}
            title={item.title}
            subtitle={`${item.subtitle} — الحالة: ${item.lifecycleStatus}`}
            badgeLabel={item.badgeLabel}
            meta={activeFlowId === item.id ? 'المسار النشط' : 'افتح المسار'}
            onPress={() => onSelectFlow?.(item.id)}
          />
        ))}
      </Box>
      <Text role="bodySm" tone="muted">
        كل مسار هنا تشغيلي فقط ومحدد ضمن دورة الطلب.
      </Text>
      <Button label="متابعة من داخل الطلب" tone="secondary" onPress={activeFlowId ? () => onSelectFlow?.(activeFlowId) : undefined} />
    </Surface>
  );
}

export default DshPartnerOrderActionPanel;
