import React from 'react';
import { Box, Button, ListItem, SectionHeader, Surface, Text } from '@bthwani/ui-kit';
import type { DshPartnerOperationalFlowId } from '../../shared';

type OrderActionFlowId =
  | 'order-accept'
  | 'order-prepare'
  | 'order-ready'
  | 'order-handoff'
  | 'order-out-for-delivery'
  | 'order-store-delivered';

const ORDER_ACTION_ITEMS: Array<{
  id: OrderActionFlowId;
  title: string;
  subtitle: string;
  badgeLabel: string;
}> = [
  { id: 'order-accept', title: 'قبول الطلب', subtitle: 'ثبّت قبول الطلب ثم انقل الفريق إلى التحضير.', badgeLabel: 'قبول' },
  { id: 'order-prepare', title: 'تحضير الطلب', subtitle: 'تابع التجهيز قبل الانتقال إلى الجاهزية.', badgeLabel: 'تحضير' },
  { id: 'order-ready', title: 'تأكيد الجاهزية', subtitle: 'أعلن أن الطلب جاهز للتسليم من الفرع.', badgeLabel: 'جاهز' },
  { id: 'order-handoff', title: 'تسليم للمندوب', subtitle: 'ثبّت التسليم عند اكتمال التغليف والتحقق.', badgeLabel: 'تسليم' },
  { id: 'order-out-for-delivery', title: 'خرج للتوصيل', subtitle: 'تابع الحالة بعد مغادرة الطلب من الفرع.', badgeLabel: 'مسار' },
  { id: 'order-store-delivered', title: 'تسليم داخل المتجر', subtitle: 'أغلق حالة الاستلام عندما يكون الفرع هو نقطة التسليم.', badgeLabel: 'إغلاق' },
];

export type DshPartnerOrderActionPanelProps = {
  activeFlowId?: OrderActionFlowId;
  onSelectFlow?: (flowId: DshPartnerOperationalFlowId) => void;
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
            subtitle={item.subtitle}
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
