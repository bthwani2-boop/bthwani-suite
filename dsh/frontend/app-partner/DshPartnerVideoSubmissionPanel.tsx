import React from 'react';
import { Button, SectionHeader, Surface, Text, TextField, Chip, Box } from '@bthwani/ui-kit';
import { ApprovalStage } from '../shared/workflow';
import type { DshPartnerOperationalFlowId } from './dshPartnerOperationalFlowIds';

export type DshPartnerVideoSubmissionPanelProps = {
  onSelectFlow?: (flowId: DshPartnerOperationalFlowId) => void;
};

export function DshPartnerVideoSubmissionPanel({ onSelectFlow }: DshPartnerVideoSubmissionPanelProps) {
  const [videoTitle, setVideoTitle] = React.useState('تجربة منتج الشريك');
  const [videoSummary, setVideoSummary] = React.useState('مراجعة سريعة لأداء المنتج في المطبخ.');
  const videoStage: ApprovalStage = 'partner-review';

  return (
    <Surface tone="raised" gap={3}>
      <Box style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <SectionHeader title="رفع فيديو الشريك" subtitle="يجهز مسار الفيديو بوضوح داخل تصنيف الفيديو فقط." />
        <Chip label="قيد المراجعة" tone="warning" />
      </Box>
      <TextField label="عنوان الفيديو" value={videoTitle} onChangeText={setVideoTitle} />
      <TextField label="ملخص الفيديو" value={videoSummary} onChangeText={setVideoSummary} multiline numberOfLines={3} />
      <Text role="bodySm" tone="muted">
        الفيديو ينتظر المرور التشغيلي المناسب لاحقًا. لا توجد عملية نشر أو اعتماد في هذا المكون.
      </Text>
      <Button label="فتح مسار رفع الفيديو" onPress={() => onSelectFlow?.('video-upload')} />
    </Surface>
  );
}

export default DshPartnerVideoSubmissionPanel;
