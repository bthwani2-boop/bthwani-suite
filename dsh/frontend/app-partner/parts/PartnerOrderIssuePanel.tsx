import React from 'react';
import { Box, Button, ListItem, SectionHeader, Surface, TextField } from '@bthwani/ui-kit';

export type PartnerOrderIssueFlowId = 'order-issue-queue' | 'order-reject';

const ORDER_ISSUE_ITEMS: Array<{
  id: PartnerOrderIssueFlowId;
  title: string;
  subtitle: string;
  badgeLabel: string;
}> = [
  { id: 'order-issue-queue', title: 'طابور مشاكل الطلبات', subtitle: 'اعرض الطلبات التي تحتاج قرارًا تشغيليًا سريعًا.', badgeLabel: 'مشكلة' },
  { id: 'order-reject', title: 'رفض الطلب', subtitle: 'استخدمه فقط عند وجود سبب تشغيلي صريح ومعلن.', badgeLabel: 'استثنائي' },
];

export type DshPartnerOrderIssuePanelProps = {
  activeFlowId?: PartnerOrderIssueFlowId;
  onSelectFlow?: (flowId: PartnerOrderIssueFlowId) => void;
};

export function DshPartnerOrderIssuePanel({ activeFlowId, onSelectFlow }: DshPartnerOrderIssuePanelProps) {
  const [issueNote, setIssueNote] = React.useState('');

  return (
    <Surface tone="raised" gap={3}>
      <SectionHeader title="معالجة الاستثناءات" subtitle="المشاكل تبقى داخل نفس سياق الطلب ولا تتحول إلى شاشة عامة منفصلة." />
      <Box gap={2}>
        {ORDER_ISSUE_ITEMS.map((item) => (
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
      <TextField
        label="ملاحظة تشغيلية مختصرة"
        value={issueNote}
        onChangeText={setIssueNote}
        hint="اكتب السبب التشغيلي أو الإجراء المطلوب دون إدخال أي منطق خارجي."
      />
      <Button label="تأكيد المتابعة" tone="secondary" onPress={activeFlowId ? () => onSelectFlow?.(activeFlowId) : undefined} />
    </Surface>
  );
}

export default DshPartnerOrderIssuePanel;
