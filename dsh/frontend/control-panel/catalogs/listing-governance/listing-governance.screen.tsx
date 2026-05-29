// P0-05: Catalog publishing gate — control-panel/catalogs is the ONLY surface that can publish.
// All prerequisites must be satisfied before the publish CTA is enabled.
// Prerequisites: partner active + all items approved + delivery modes ready + category mapped + no duplicates.
// Audit note is shown when the gate record flags auditRequired = true.
// UI_PREVIEW_ONLY: gate actions produce visible result state but no backend/API binding.
import React from 'react';
import { Box, Button, Chip, KeyValueList, Text, useTheme } from '@bthwani/ui-kit';
import { WebCompactSurfaceHeader } from '@bthwani/ui-kit/web';
import {
  type DshProductIdentityApprovalStatus,
  type DshProductCategoryMappingStatus,
  type DshProductDuplicateStatus,
} from '../../../shared/dsh-product-identity.model';
import type { DshPartnerActivationStatus } from '../../../shared/dsh-partner-activation.model';
import { resolveDshProductClientVisibility } from '../../../shared/dsh-client-visibility.model';

import { PublishGateStatus, CatalogPublishGateRecord, demoPublishGateRecord } from '../../../data/publishing-gates.preview-data';



// Gate action result — UI_PREVIEW_ONLY
type GateActionResult = {
  action: 'publish' | 'request-revision' | 'reject';
  label: string;
  status: 'sent' | 'preview-only';
  owner: 'control-panel-catalog' | 'control-panel-marketing' | 'control-panel-operations';
  note: string;
} | null;

const gateStatusLabel: Record<PublishGateStatus, string> = {
  'not-started': 'لم يبدأ',
  'in-review': 'قيد المراجعة',
  'approved': 'معتمد',
  'rejected': 'مرفوض',
  'published': 'منشور',
};

const gateStatusTone: Record<PublishGateStatus, 'default' | 'success' | 'warning' | 'danger'> = {
  'not-started': 'default',
  'in-review': 'warning',
  'approved': 'success',
  'rejected': 'danger',
  'published': 'success',
};

function resolveGateOwnerLabel(owner: 'control-panel-catalog' | 'control-panel-marketing' | 'control-panel-operations'): string {
  switch (owner) {
    case 'control-panel-catalog': return 'الكتالوج';
    case 'control-panel-marketing': return 'التسويق';
    case 'control-panel-operations': return 'العمليات';
  }
}

export type ListingGovernanceScreenProps = {
  record?: CatalogPublishGateRecord;
  onApproveForPublish?: (id: string) => void;
  onReject?: (id: string) => void;
  onRequestRevision?: (id: string) => void;
};

export function ListingGovernanceScreen({
  record = demoPublishGateRecord,
  onApproveForPublish,
  onReject,
  onRequestRevision,
}: ListingGovernanceScreenProps) {
  const { theme } = useTheme();
  const [gateActionResult, setGateActionResult] = React.useState<GateActionResult>(null);

  const readinessPercent = Math.round((record.approvedItemCount / record.itemCount) * 100);

  const productVisibility = resolveDshProductClientVisibility({
    approvalStatus: record.approvalStatus ?? 'partner_submitted',
    activationStatus: record.partnerActivationStatus ?? 'catalog_ready',
    deliveryModesReady: record.deliveryModesReady ?? false,
    serviceabilityAvailable: record.serviceabilityAvailable ?? false,
    catalogPublished: record.catalogPublished ?? false,
    categoryMappingStatus: record.categoryMappingStatus ?? 'unmapped',
    duplicateStatus: record.duplicateStatus ?? 'clean',
    mediaPolicySatisfied: record.mediaPolicySatisfied ?? false,
  });
  const prerequisites = productVisibility.publishingPrerequisites;

  const allPrerequisitesMet = prerequisites.every((p) => p.satisfied);
  const isReadyToPublish = (record.status === 'approved' || productVisibility.publishingStatus === 'publishing_ready') && allPrerequisitesMet;

  const unsatisfiedPrereqs = prerequisites.filter((p) => !p.satisfied);
  const firstBlockedReason = unsatisfiedPrereqs[0]?.blockedReason ?? null;

  const handleApproveForPublish = React.useCallback(() => {
    if (onApproveForPublish) {
      onApproveForPublish(record.id);
      setGateActionResult({
        action: 'publish',
        label: 'تمت الموافقة على النشر',
        status: 'sent',
        owner: 'control-panel-catalog',
        note: 'تم إرسال الطلب للمالك',
      });
    } else {
      setGateActionResult({
        action: 'publish',
        label: 'معاينة النشر',
        status: 'preview-only',
        owner: 'control-panel-catalog',
        note: 'UI_PREVIEW_ONLY — لا يعني نشرًا فعليًا في runtime/API',
      });
    }
  }, [record.id, onApproveForPublish]);

  const handleRequestRevision = React.useCallback(() => {
    onRequestRevision?.(record.id);
    setGateActionResult({
      action: 'request-revision',
      label: 'تم طلب المراجعة',
      status: onRequestRevision ? 'sent' : 'preview-only',
      owner: 'control-panel-marketing',
      note: onRequestRevision ? 'تم الإرسال للمالك' : 'UI_PREVIEW_ONLY — لا يعني إرسالًا فعليًا',
    });
  }, [record.id, onRequestRevision]);

  const handleReject = React.useCallback(() => {
    onReject?.(record.id);
    setGateActionResult({
      action: 'reject',
      label: 'تم الرفض',
      status: onReject ? 'sent' : 'preview-only',
      owner: 'control-panel-operations',
      note: onReject ? 'تم الإرسال للمالك' : 'UI_PREVIEW_ONLY — لا يعني رفضًا فعليًا',
    });
  }, [record.id, onReject]);

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
          <Text role="titleSm">{record.catalogLabel}</Text>
          <Text role="bodySm" tone="muted">{record.partnerLabel}</Text>
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
            { label: 'قرار ظهور المتجر', value: productVisibility.storeVisibility.visible ? 'مفتوح للعميل' : 'محجوب', tone: productVisibility.storeVisibility.visible ? 'success' : 'warning' },
            { label: 'قرار ظهور المنتج', value: productVisibility.visible ? 'صالح للعميل' : 'غير صالح بعد', tone: productVisibility.visible ? 'success' : 'warning' },
          ]}
        />

        {productVisibility.blockedReason ? (
          <Text role="caption" tone="muted">{productVisibility.blockedReason}</Text>
        ) : null}

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
              <Box gap={1}>
                <Text role="caption" tone="danger">
                  {`${unsatisfiedPrereqs.length} شرط غير مستوفٍ — أكمل المتطلبات لتفعيل النشر.`}
                </Text>
                {firstBlockedReason ? (
                  <Text role="caption" tone="muted">{`أول مانع: ${firstBlockedReason}`}</Text>
                ) : null}
              </Box>
            ) : null}
            <Box style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <Button
                label="الموافقة على النشر"
                tone="primary"
                disabled={!isReadyToPublish}
                onPress={isReadyToPublish ? handleApproveForPublish : undefined}
              />
              <Button
                label="طلب مراجعة"
                tone="secondary"
                onPress={handleRequestRevision}
              />
              <Button
                label="رفض"
                tone="danger"
                onPress={handleReject}
              />
            </Box>

            {/* Gate action result banner — UI_PREVIEW_ONLY */}
            {gateActionResult ? (
              <div
                role="status"
                aria-live="polite"
                style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 10, backgroundColor: theme.surfaceInset, borderRadius: 8 }}
              >
                <Text role="bodySm">{gateActionResult.label}</Text>
                <Text role="caption" tone="muted">
                  {`المالك: ${resolveGateOwnerLabel(gateActionResult.owner)} · ${gateActionResult.note}`}
                </Text>
              </div>
            ) : null}
          </Box>
        ) : null}

        {record.status === 'published' ? (
          <Text role="bodySm" tone="success">تم النشر بنجاح — الكتالوج مرئي للعملاء.</Text>
        ) : null}
      </Box>
    </Box>
  );
}

export default ListingGovernanceScreen;
