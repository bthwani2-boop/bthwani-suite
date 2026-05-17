// ML-054: Catalog publishing gate section — ops must sign off before catalog goes live
// BLOCKED_BY_CONTRACT: catalog publish API not proven
import React from 'react';
import { Box, Button, KeyValueList, Text } from '@bthwani/ui-kit';
import { WebCompactSurfaceHeader } from '@bthwani/ui-kit/web';

type PublishGateStatus = 'not-started' | 'in-review' | 'approved' | 'rejected' | 'published';

type CatalogPublishGateRecord = {
  id: string;
  catalogName: string;
  partnerName: string;
  itemCount: number;
  approvedItemCount: number;
  status: PublishGateStatus;
};

const gateStatusLabel: Record<PublishGateStatus, string> = {
  'not-started': 'لم تبدأ المراجعة',
  'in-review': 'قيد المراجعة',
  'approved': 'معتمد — جاهز للنشر',
  'rejected': 'مرفوض',
  'published': 'منشور',
};

const demoRecord: CatalogPublishGateRecord = {
  id: 'catalog-001',
  catalogName: 'قائمة الطعام الرئيسية — الموسم الصيفي',
  partnerName: 'مطعم النجوم',
  itemCount: 42,
  approvedItemCount: 38,
  status: 'in-review',
};

export type CatalogPublishingGateSectionProps = {
  record?: CatalogPublishGateRecord;
  onApproveForPublish?: (id: string) => void;
  onReject?: (id: string) => void;
  onRequestRevision?: (id: string) => void;
};

export function CatalogPublishingGateSection({
  record = demoRecord,
  onApproveForPublish,
  onReject,
  onRequestRevision,
}: CatalogPublishingGateSectionProps) {
  const readinessPercent = Math.round((record.approvedItemCount / record.itemCount) * 100);
  const isReadyToPublish = record.status === 'approved';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      <WebCompactSurfaceHeader
        title="بوابة نشر الكتالوج"
        description="يجب على الفريق التشغيلي الموافقة قبل أي نشر. هذه البوابة تضمن الجودة والامتثال."
        metrics={[
          { id: 'readiness', title: 'نسبة الجاهزية', value: `${readinessPercent}%` },
          { id: 'items', title: 'العناصر المعتمدة', value: `${record.approvedItemCount} / ${record.itemCount}` },
        ]}
      />
      <Box gap={4} padding={4} background="surfaceRaised" radiusToken="lg">
        <Text role="titleSm">{record.catalogName}</Text>
        <Text role="bodySm" tone="muted">{record.partnerName}</Text>
        <KeyValueList
          items={[
            { label: 'حالة البوابة', value: gateStatusLabel[record.status] },
            { label: 'العناصر الكلية', value: String(record.itemCount) },
            { label: 'المعتمدة', value: String(record.approvedItemCount) },
            { label: 'غير المعتمدة', value: String(record.itemCount - record.approvedItemCount) },
          ]}
        />
        {(record.status === 'in-review' || record.status === 'not-started') && (
          <Box style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              label="الموافقة على النشر"
              tone="primary"
              disabled={!isReadyToPublish}
              onPress={() => onApproveForPublish?.(record.id)}
            />
            <Button label="طلب مراجعة" tone="secondary" onPress={() => onRequestRevision?.(record.id)} />
            <Button label="رفض" tone="danger" onPress={() => onReject?.(record.id)} />
          </Box>
        )}
        {record.status === 'published' && (
          <Text role="bodySm" tone="success">تم النشر بنجاح — الكتالوج مرئي للعملاء.</Text>
        )}
      </Box>
    </div>
  );
}

export default CatalogPublishingGateSection;
