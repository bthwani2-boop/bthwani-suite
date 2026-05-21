// P0-05: Catalog publishing gate — control-panel/catalogs is the ONLY surface that can publish.
// All prerequisites must be satisfied before the publish CTA is enabled.
// Prerequisites: partner active + all items approved + delivery modes ready + category mapped + no duplicates.
// Audit note is shown when the gate record flags auditRequired = true.
import React from 'react';
import { Box, Button, Chip, KeyValueList, Text } from '@bthwani/ui-kit';
import { WebCompactSurfaceHeader } from '@bthwani/ui-kit/web';
import {
  getDshProductPublishingPrerequisites,
  type DshProductIdentityApprovalStatus,
  type DshProductCategoryMappingStatus,
  type DshProductDuplicateStatus,
} from '../../shared/dsh-product-identity.model';

type PublishGateStatus = 'not-started' | 'in-review' | 'approved' | 'rejected' | 'published';

const gateStatusLabel: Record<PublishGateStatus, string> = {
  'not-started': 'لم تبدأ المراجعة',
  'in-review': 'قيد المراجعة',
  'approved': 'معتمد — جاهز للنشر',
  'rejected': 'مرفوض',
  'published': 'منشور',
};

const gateStatusTone: Record<PublishGateStatus, 'default' | 'success' | 'danger' | 'warning' | 'brand'> = {
  'not-started': 'default',
  'in-review': 'warning',
  'approved': 'brand',
  'rejected': 'danger',
  'published': 'success',
};

type CatalogPublishGateRecord = {
  id: string;
  catalogName: string;
  partnerName: string;
  itemCount: number;
  approvedItemCount: number;
  status: PublishGateStatus;
  /** Canonical approval status for prerequisite evaluation */
  approvalStatus?: DshProductIdentityApprovalStatus;
  /** Whether the partner owning this catalog is currently client-visible */
  partnerActivationClientVisible?: boolean;
  /** Whether at least one delivery mode is active for this store */
  deliveryModesReady?: boolean;
  /** Category mapping status for prerequisite evaluation */
  categoryMappingStatus?: DshProductCategoryMappingStatus;
  /** Duplicate status for prerequisite evaluation */
  duplicateStatus?: DshProductDuplicateStatus;
  /** Whether media policy is satisfied */
  mediaPolicySatisfied?: boolean;
  /** Whether an audit trail is required for this gate transition */
  auditRequired?: boolean;
};

const demoRecord: CatalogPublishGateRecord = {
  id: 'catalog-001',
  catalogName: 'قائمة الطعام الرئيسية — الموسم الصيفي',
  partnerName: 'مطعم النجوم',
  itemCount: 42,
  approvedItemCount: 38,
  status: 'in-review',
  approvalStatus: 'catalog_adopted',
  partnerActivationClientVisible: true,
  deliveryModesReady: true,
  categoryMappingStatus: 'mapped',
  duplicateStatus: 'clean',
  mediaPolicySatisfied: false, // still pending — demonstrates blocked gate
  auditRequired: false,
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

  // Resolve publishing prerequisites using the shared SSoT helper.
  // All prerequisites must be satisfied before the publish CTA is enabled.
  const prerequisites = getDshProductPublishingPrerequisites({
    approvalStatus: record.approvalStatus ?? 'partner_submitted',
    partnerActivationClientVisible: record.partnerActivationClientVisible ?? false,
    deliveryModesReady: record.deliveryModesReady ?? false,
    categoryMappingStatus: record.categoryMappingStatus ?? 'unmapped',
    duplicateStatus: record.duplicateStatus ?? 'clean',
    mediaPolicySatisfied: record.mediaPolicySatisfied ?? false,
  });

  const allPrerequisitesMet = prerequisites.every((p) => p.satisfied);
  const isReadyToPublish = record.status === 'approved' && allPrerequisitesMet;

  return (
    <Box gap={4} padding={4}>
      <WebCompactSurfaceHeader
        title="بوابة نشر الكتالوج"
        description="يجب على الفريق التشغيلي الموافقة قبل أي نشر. هذه البوابة تضمن الجودة والامتثال."
        metrics={[
          { id: 'readiness', title: 'نسبة الجاهزية', value: `${readinessPercent}%` },
          { id: 'items', title: 'العناصر المعتمدة', value: `${record.approvedItemCount} / ${record.itemCount}` },
        ]}
      />

      <Box gap={3}>
        <Box gap={1}>
          <Text role="titleSm">{record.catalogName}</Text>
          <Text role="bodySm" tone="muted">{record.partnerName}</Text>
          <Chip
            label={gateStatusLabel[record.status]}
            tone={gateStatusTone[record.status]}
          />
        </Box>

        <KeyValueList
          items={[
            { label: 'حالة البوابة', value: gateStatusLabel[record.status] },
            { label: 'العناصر الكلية', value: String(record.itemCount) },
            { label: 'المعتمدة', value: String(record.approvedItemCount) },
            { label: 'غير المعتمدة', value: String(record.itemCount - record.approvedItemCount) },
          ]}
        />

        {/* Publishing prerequisites checklist — all must be satisfied before publish */}
        <Box gap={2}>
          <Text role="label" tone="muted">شروط بوابة النشر</Text>
          {prerequisites.map((prereq) => (
            <Box key={prereq.id} gap={1}>
              <Box style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <Text role="bodySm" tone={prereq.satisfied ? 'success' : 'danger'}>
                  {prereq.satisfied ? '✓' : '✗'}
                </Text>
                <Box style={{ flex: 1, gap: 2 }}>
                  <Text role="bodySm" tone={prereq.satisfied ? 'default' : 'danger'}>
                    {prereq.label}
                  </Text>
                  {!prereq.satisfied && prereq.blockedReason ? (
                    <Text role="caption" tone="muted">{prereq.blockedReason}</Text>
                  ) : null}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Audit notice */}
        {record.auditRequired ? (
          <Box gap={1}>
            <Text role="bodySm" tone="warning">⚠ هذا النشر يستلزم مراجعة من فريق التدقيق بعد التنفيذ.</Text>
          </Box>
        ) : null}

        {/* Gate actions */}
        {(record.status === 'in-review' || record.status === 'not-started' || record.status === 'approved') ? (
          <Box gap={2}>
            {!allPrerequisitesMet ? (
              <Text role="caption" tone="danger">
                {`${prerequisites.filter((p) => !p.satisfied).length} شرط غير مستوفٍ — أكمل المتطلبات لتفعيل النشر.`}
              </Text>
            ) : null}
            <Box style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <Button
                label="الموافقة على النشر"
                tone="primary"
                disabled={!isReadyToPublish}
                onPress={isReadyToPublish ? () => onApproveForPublish?.(record.id) : undefined}
              />
              <Button
                label="طلب مراجعة"
                tone="secondary"
                onPress={() => onRequestRevision?.(record.id)}
              />
              <Button
                label="رفض"
                tone="danger"
                onPress={() => onReject?.(record.id)}
              />
            </Box>
          </Box>
        ) : null}

        {record.status === 'published' ? (
          <Text role="bodySm" tone="success">تم النشر بنجاح — الكتالوج مرئي للعملاء.</Text>
        ) : null}
      </Box>
    </Box>
  );
}

export default CatalogPublishingGateSection;
