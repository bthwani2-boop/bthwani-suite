// P0-05: Catalog publishing gate — control-panel/catalogs is the ONLY surface that can publish.
// All prerequisites must be satisfied before the publish CTA is enabled.
// Prerequisites: partner active + all items approved + delivery modes ready + category mapped + no duplicates.
// Audit note is shown when the gate record flags auditRequired = true.
// SCAFFOLD: gate actions produce visible result state but no backend/API binding yet.
import React from 'react';
import { Box, Button, Chip, KeyValueList, Text, useTheme } from '@bthwani/ui-kit';
import { WebCompactSurfaceHeader } from '@bthwani/ui-kit/web';
import { resolveDshProductClientVisibility } from '../../shared/stores/dsh-client-visibility.model';
import type {
  DshProductIdentityApprovalStatus,
  DshProductCategoryMappingStatus,
  DshProductDuplicateStatus,
  DshPartnerActivationStatus,
} from '../../shared';

type PublishGateStatus = 'not-started' | 'in-review' | 'approved' | 'rejected' | 'published';
type CatalogPublishGateRecord = {
  id: string;
  catalogLabel: string;
  partnerLabel: string;
  status: PublishGateStatus;
  itemCount: number;
  approvedItemCount: number;
  auditRequired: boolean;
  approvalStatus?: DshProductIdentityApprovalStatus;
  partnerActivationStatus?: DshPartnerActivationStatus;
  deliveryModesReady?: boolean;
  serviceabilityAvailable?: boolean;
  catalogPublished?: boolean;
  categoryMappingStatus?: DshProductCategoryMappingStatus;
  duplicateStatus?: DshProductDuplicateStatus;
  mediaPolicySatisfied?: boolean;
};


// Gate action result — SCAFFOLD
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
  record,
  onApproveForPublish,
  onReject,
  onRequestRevision,
}: ListingGovernanceScreenProps) {
  const { theme } = useTheme();
  const [gateActionResult, setGateActionResult] = React.useState<GateActionResult>(null);

  if (!record) {
    return null;
  }

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
        note: 'محاكاة محلية — لا يعني نشرًا فعليًا في runtime/API',
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
      note: onRequestRevision ? 'تم الإرسال للمالك' : 'محاكاة محلية — الربط قيد التنفيذ',
    });
  }, [record.id, onRequestRevision]);

  const handleReject = React.useCallback(() => {
    onReject?.(record.id);
    setGateActionResult({
      action: 'reject',
      label: 'تم الرفض',
      status: onReject ? 'sent' : 'preview-only',
      owner: 'control-panel-operations',
      note: onReject ? 'تم الإرسال للمالك' : 'محاكاة محلية — الربط قيد التنفيذ',
    });
  }, [record.id, onReject]);

  return (
    <Box gap={4} padding={4} style={{ alignItems: 'center', width: '100%' }}>
      <Box style={{ width: '100%', maxWidth: 640 }}>
        <WebCompactSurfaceHeader
          title="بوابة نشر الكتالوج"
          description="يجب على الفريق التشغيلي الموافقة قبل أي نشر. هذه البوابة تضمن الجودة والامتثال."
          metrics={[
            { id: 'readiness', title: 'نسبة الجاهزية', value: `${readinessPercent}%` },
            { id: 'items', title: 'العناصر المعتمدة', value: `${record.approvedItemCount} / ${record.itemCount}` },
          ]}
        />
      </Box>

      <Box
        gap={3}
        style={{
          width: '100%',
          maxWidth: 640,
          backgroundColor: theme.surface,
          borderRadius: '12px',
          borderWidth: 1,
          borderColor: theme.lineStrong,
          padding: 24,
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        }}
      >
        <Box style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: theme.line, paddingBottom: 16, marginBottom: 8 }}>
          <Box gap={1}>
            <Text role="titleSm" weight="bold" style={{ }}>{record.catalogLabel}</Text>
            <Text role="bodySm" tone="muted">{record.partnerLabel}</Text>
          </Box>
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
          <Box style={{ backgroundColor: 'rgba(239, 83, 80, 0.05)', padding: 12, borderRadius: 8, marginTop: 4 }}>
            <Text role="caption" tone="danger">{productVisibility.blockedReason}</Text>
          </Box>
        ) : null}

        {/* Publishing prerequisites checklist — styled as a premium grid of cards */}
        <Box gap={2} style={{ backgroundColor: theme.surfaceInset, padding: 16, borderRadius: 8, marginTop: 8 }}>
          <Text role="label" tone="muted" weight="bold" style={{ }}>شروط بوابة النشر</Text>
          <Box style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
            {prerequisites.map((prereq) => (
              <Box
                key={prereq.id}
                style={{
                  flex: 1,
                  minWidth: 250,
                  backgroundColor: theme.surface,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: prereq.satisfied ? theme.line : theme.lineStrong,
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Box
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: prereq.satisfied ? 'rgba(46, 125, 50, 0.08)' : 'rgba(198, 40, 40, 0.08)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    role="bodySm"
                    tone={prereq.satisfied ? 'success' : 'danger'}
                    style={{ fontWeight: 'bold', fontSize: 13 }}
                  >
                    {prereq.satisfied ? '✓' : '✗'}
                  </Text>
                </Box>
                <Box style={{ flex: 1, gap: 2 }}>
                  <Text role="bodySm" tone={prereq.satisfied ? 'default' : 'danger'} weight="medium" style={{ }}>
                    {prereq.label}
                  </Text>
                  {!prereq.satisfied && prereq.blockedReason ? (
                    <Text role="caption" tone="muted" style={{ fontSize: 11 }}>{prereq.blockedReason}</Text>
                  ) : null}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Audit notice */}
        {record.auditRequired ? (
          <Box style={{ backgroundColor: 'rgba(255, 152, 0, 0.05)', padding: 12, borderRadius: 8, marginTop: 4 }}>
            <Text role="bodySm" tone="warning">⚠ هذا النشر يستلزم مراجعة من فريق التدقيق بعد التنفيذ.</Text>
          </Box>
        ) : null}

        {/* Gate actions */}
        {(record.status === 'in-review' || record.status === 'not-started' || record.status === 'approved') ? (
          <Box gap={2} style={{ marginTop: 12 }}>
            {!allPrerequisitesMet ? (
              <Box gap={1} style={{ paddingHorizontal: 4 }}>
                <Text role="caption" tone="danger">
                  {`${unsatisfiedPrereqs.length} شرط غير مستوفٍ — أكمل المتطلبات لتفعيل النشر.`}
                </Text>
                {firstBlockedReason ? (
                  <Text role="caption" tone="muted">{`أول مانع: ${firstBlockedReason}`}</Text>
                ) : null}
              </Box>
            ) : null}
            <Box style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-start', flexWrap: 'wrap', marginTop: 8 }}>
              <Button
                label="الموافقة على النشر"
                tone="primary"
                disabled={!isReadyToPublish}
                onPress={isReadyToPublish ? handleApproveForPublish : undefined}
                style={{ flex: 1, minWidth: 140 }}
              />
              <Button
                label="طلب مراجعة"
                tone="secondary"
                onPress={handleRequestRevision}
                style={{ flex: 1, minWidth: 120 }}
              />
              <Button
                label="رفض"
                tone="danger"
                onPress={handleReject}
                style={{ flex: 1, minWidth: 100 }}
              />
            </Box>

            {/* Gate action result banner — SCAFFOLD */}
            {gateActionResult ? (
              <div
                role="status"
                aria-live="polite"
                style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 12, backgroundColor: theme.surfaceInset, borderRadius: 8, marginTop: 12, borderRightWidth: 3, borderRightColor: theme.brand }}
              >
                <Text role="bodySm" weight="bold" style={{ }}>{gateActionResult.label}</Text>
                <Text role="caption" tone="muted">
                  {`المالك: ${resolveGateOwnerLabel(gateActionResult.owner)} · ${gateActionResult.note}`}
                </Text>
              </div>
            ) : null}
          </Box>
        ) : null}

        {record.status === 'published' ? (
          <Box style={{ backgroundColor: 'rgba(46, 125, 50, 0.08)', padding: 16, borderRadius: 8, marginTop: 12 }}>
            <Text role="bodySm" tone="success" weight="bold" style={{ }}>تم النشر بنجاح — الكتالوج مرئي للعملاء.</Text>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

export default ListingGovernanceScreen;
