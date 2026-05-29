'use client';

import React from 'react';
import { Box, Text, useTheme, Surface, KeyValueList } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelKpiStrip,
  WebControlPanelStatusTag,
  WebControlPanelInspectorShell,
  WebControlPanelActionCluster,
  WebControlPanelRecommendation,
} from '@bthwani/ui-kit/web';
import {
  type DshPartnerActivationStatus,
  getDshPartnerActivationStateMetadata,
  getDshPartnerReadinessChecklist,
  getDshPartnerVisibilityBadge,
  getDshPartnerVisibilityBadgeLabel,
  getDshPartnerVisibilityBadgeTone,
  getDshPartnerActivationStatusLabel,
} from '../../shared/dsh-partner-activation.model';
import {
  PARTNER_FULFILLMENT_AGREEMENTS,
  type DshPartnerDocumentVerification,
  getPartnerActivationStatus,
  updatePartnerActivationStatus,
  getAllPartnerActivationStatuses,
  getPartnerDocuments,
  updatePartnerDocumentStatus,
} from './workflow';
import { PartnerDeactivationWorkspace } from './PartnerDeactivationWorkspace';
import { PartnerFulfillmentLane } from './PartnerFulfillmentLane';

// Helper to check marketing promotion eligibility
function checkMarketingEligibility(status: DshPartnerActivationStatus): { eligible: boolean; label: string; tone: 'success' | 'danger' | 'warning' } {
  if (status === 'client_visible') {
    return { eligible: true, label: 'مؤهل بالكامل للمزايا والعروض التسويقية', tone: 'success' };
  }
  if (status === 'partner_active' || status === 'ops_approved') {
    return { eligible: false, label: 'مؤجل: الشريك نشط تشغيلياً لكن لم يظهر للعملاء بعد', tone: 'warning' };
  }
  return { eligible: false, label: 'محجوب: الشريك غير نشط وغير ظاهر للعملاء حالياً', tone: 'danger' };
}

export function ControlPanelDshPartnerActivationScreen() {
  const { theme } = useTheme();
  const [partnerStatuses, setPartnerStatuses] = React.useState<Record<string, DshPartnerActivationStatus>>({});
  const [selectedPartnerId, setSelectedPartnerId] = React.useState('partner-saha');
  const [isDeactivating, setIsDeactivating] = React.useState(false);
  const [actionMessage, setActionMessage] = React.useState('اختر شريكاً لعرض تفاصيل التفعيل وجاهزيته.');

  React.useEffect(() => {
    setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
  }, []);

  const currentStatus = partnerStatuses[selectedPartnerId] ?? getPartnerActivationStatus(selectedPartnerId);
  const currentMeta = getDshPartnerActivationStateMetadata(currentStatus);
  const readinessChecklist = getDshPartnerReadinessChecklist(currentStatus);
  const allReady = readinessChecklist.every((item) => item.satisfied);
  const marketingElig = checkMarketingEligibility(currentStatus);

  const currentPartner = PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === selectedPartnerId) || PARTNER_FULFILLMENT_AGREEMENTS[0];

  const handlePartnerSelect = (id: string) => {
    setSelectedPartnerId(id);
    setIsDeactivating(false);
    setActionMessage(`تم تحديد الشريك: ${PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === id)?.storeName}`);
  };

  const handleActivate = () => {
    updatePartnerActivationStatus(selectedPartnerId, 'client_visible');
    setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
    setActionMessage('تم تفعيل الشريك بنجاح وهو الآن ظاهر لعملاء منصة بثواني.');
  };

  const handlePause = () => {
    updatePartnerActivationStatus(selectedPartnerId, 'client_hidden');
    setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
    setActionMessage('تم إيقاف الشريك مؤقتاً (مخفي من اكتشاف العملاء).');
  };

  const handleDeactivateConfirm = (partnerId: string, reason: string, note: string) => {
    updatePartnerActivationStatus(partnerId, 'partner_deactivated');
    setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
    setIsDeactivating(false);
    setActionMessage(`تم إلغاء تفعيل الشريك. السبب: ${reason} · الملاحظة: ${note}`);
  };

  return (
    <Box gap={4} style={{ direction: 'rtl' }}>
      {/* Partner selector chips */}
      <Box gap={2}>
        <Text role="caption" tone="brand" style={{ fontWeight: '800' }}>اختر الشريك للمعاينة والتفعيل</Text>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {PARTNER_FULFILLMENT_AGREEMENTS.map((partner) => {
            const status = partnerStatuses[partner.partnerId] ?? getPartnerActivationStatus(partner.partnerId);
            const isActive = selectedPartnerId === partner.partnerId;
            return (
              <button
                key={partner.partnerId}
                type="button"
                onClick={() => handlePartnerSelect(partner.partnerId)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: `1px solid ${isActive ? theme.brand : theme.line}`,
                  background: isActive ? theme.brandSurface : theme.surface,
                  color: isActive ? theme.brand : theme.text,
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {partner.storeName} ({getDshPartnerActivationStatusLabel(status)})
              </button>
            );
          })}
        </Box>
      </Box>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
        {/* Main Details and Checklist */}
        <Box gap={4}>
          {isDeactivating ? (
            <PartnerDeactivationWorkspace
              partnerId={selectedPartnerId}
              partnerName={currentPartner.storeName}
              auditRequired={currentMeta.auditRequired}
              onConfirmDeactivate={handleDeactivateConfirm}
              onClose={() => setIsDeactivating(false)}
            />
          ) : (
            <Surface tone="raised" padding={5} gap={4} style={{ borderRadius: '16px' }}>
              <Box layoutDirection="row" justify="space-between" align="center">
                <Box gap={1}>
                  <Text role="titleLg" style={{ fontWeight: '900', color: theme.brandHeaderBackground }}>
                    حالة الجاهزية والتفعيل
                  </Text>
                  <Text role="caption" tone="muted">
                    {currentPartner.storeName} · {currentPartner.categoryLabel}
                  </Text>
                </Box>
                <Box layoutDirection="row" gap={2}>
                  <WebControlPanelStatusTag
                    label={getDshPartnerActivationStatusLabel(currentStatus)}
                    tone={currentStatus === 'client_visible' ? 'success' : currentStatus === 'partner_deactivated' ? 'danger' : 'warning'}
                  />
                  <WebControlPanelStatusTag
                    label={getDshPartnerVisibilityBadgeLabel(getDshPartnerVisibilityBadge(currentStatus, true))}
                    tone={getDshPartnerVisibilityBadgeTone(getDshPartnerVisibilityBadge(currentStatus, true))}
                  />
                </Box>
              </Box>

              {/* Status explanation */}
              <Box style={{ background: theme.surfaceInset, padding: '12px', borderRadius: '10px', border: `1px solid ${theme.line}` }}>
                <KeyValueList
                  dense
                  items={[
                    { label: 'المسؤول الحالي', value: currentMeta.actorResponsible, tone: 'brand' },
                    { label: 'مالك الإجراء', value: currentMeta.ownerSurface, tone: 'default' },
                    { label: 'الخطوة القادمة', value: currentMeta.nextAction, tone: 'default' },
                  ]}
                />
              </Box>

              {/* Marketing Eligibility Banner */}
              <div style={{
                background: theme[`${marketingElig.tone}Surface`],
                border: `1px solid ${theme[marketingElig.tone]}`,
                padding: '12px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <Text role="bodySm" style={{ color: theme[marketingElig.tone], fontWeight: '800' }}>
                  {marketingElig.eligible ? '✓' : '⚠'} {marketingElig.label}
                </Text>
              </div>

              {/* Readiness Checklist */}
              <Box gap={3}>
                <Text role="titleSm" style={{ fontWeight: '800' }}>قائمة شروط التفعيل النهائي</Text>
                <Box gap={2}>
                  {readinessChecklist.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: item.satisfied ? theme.successSurface : theme.dangerSurface,
                        border: `1px solid ${item.satisfied ? theme.success : theme.danger}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: item.satisfied ? theme.success : theme.danger }}>
                          {item.label}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: item.satisfied ? theme.success : theme.danger }}>
                          {item.satisfied ? '✓ مكتمل' : '✗ غير مكتمل'}
                        </span>
                      </div>
                      {!item.satisfied && item.blockedReason && (
                        <span style={{ fontSize: '11px', color: theme.danger }}>
                          العائق: {item.blockedReason}
                        </span>
                      )}
                    </div>
                  ))}
                </Box>
              </Box>

              {/* Action Buttons */}
              <WebControlPanelActionCluster
                primary={allReady && currentStatus !== 'client_visible' ? {
                  id: 'btn-activate',
                  label: 'تفعيل للعملاء (Go Live)',
                  onAction: handleActivate,
                } : currentStatus === 'client_visible' ? {
                  id: 'btn-pause',
                  label: 'إيقاف مؤقت (إخفاء)',
                  onAction: handlePause,
                } : undefined}
                secondary={currentStatus !== 'partner_deactivated' ? {
                  id: 'btn-deactivate',
                  label: 'إلغاء التفعيل والتعطيل',
                  onAction: () => setIsDeactivating(true),
                } : undefined}
              />
            </Surface>
          )}

          <PartnerFulfillmentLane />
        </Box>

        {/* Sidebar Info */}
        <Box gap={4}>
          <WebControlPanelRecommendation
            title="تعليمات تفعيل الشريك"
            reason={actionMessage}
            confidence={allReady ? 'high' : 'low'}
            auditTag="UI_PREVIEW_ONLY"
          />

          <Surface tone="raised" padding={4} gap={2} style={{ borderRadius: '12px' }}>
            <Text role="titleSm" style={{ fontWeight: '800' }}>ملاحظة تشغيلية</Text>
            <Text role="bodySm" tone="muted">
              حسب سياسة الحوكمة في بثواني، لا يمكن تفعيل أي شريك للعملاء إلا بعد أن يتم مراجعة وثائقه بنسبة 100% واعتماد الكتالوج الخاص به.
            </Text>
          </Surface>
        </Box>
      </div>
    </Box>
  );
}

export function ControlPanelDshPartnerDocumentReviewScreen() {
  const { theme } = useTheme();
  const [partnerStatuses, setPartnerStatuses] = React.useState<Record<string, DshPartnerActivationStatus>>({});
  const [documents, setDocuments] = React.useState<DshPartnerDocumentVerification[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = React.useState('partner-saha');
  const [selectedDocId, setSelectedDocId] = React.useState<string | null>(null);
  const [actionMessage, setActionMessage] = React.useState('حدد وثيقة شريك للبدء في مراجعتها واعتمادها.');

  React.useEffect(() => {
    setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
    setDocuments(getPartnerDocuments(selectedPartnerId));
  }, [selectedPartnerId]);

  const selectedDoc = documents.find(d => d.id === selectedDocId);
  const currentStatus = partnerStatuses[selectedPartnerId] ?? getPartnerActivationStatus(selectedPartnerId);

  const handlePartnerSelect = (id: string) => {
    setSelectedPartnerId(id);
    setSelectedDocId(null);
    setActionMessage(`تحديد الشريك: ${PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === id)?.storeName}`);
  };

  const handleApproveDoc = (docId: string) => {
    updatePartnerDocumentStatus(selectedPartnerId, docId, 'verified');
    const updatedDocs = getPartnerDocuments(selectedPartnerId);
    setDocuments(updatedDocs);
    setActionMessage('تم اعتماد الوثيقة وربطها بدليل الميداني.');

    // If all docs are now verified, advance partner state to documents_verified
    const allVerified = updatedDocs.every(d => d.status === 'verified');
    if (allVerified && currentStatus === 'submitted') {
      updatePartnerActivationStatus(selectedPartnerId, 'documents_verified');
      setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
    }
  };

  const handleRejectDoc = (docId: string, reason: string) => {
    updatePartnerDocumentStatus(selectedPartnerId, docId, 'rejected', reason);
    const updatedDocs = getPartnerDocuments(selectedPartnerId);
    setDocuments(updatedDocs);
    setActionMessage(`تم رفض الوثيقة. السبب: ${reason}`);

    // If a doc is rejected, set partner state to documents_missing
    updatePartnerActivationStatus(selectedPartnerId, 'documents_missing');
    setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
  };

  return (
    <Box gap={4} style={{ direction: 'rtl' }}>
      {/* Partner selectors */}
      <Box gap={2}>
        <Text role="caption" tone="brand" style={{ fontWeight: '800' }}>اختر الشريك لمراجعة مستنداته</Text>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {PARTNER_FULFILLMENT_AGREEMENTS.map((partner) => {
            const docs = getPartnerDocuments(partner.partnerId);
            const pendingCount = docs.filter(d => d.status === 'uploaded').length;
            const isSelected = selectedPartnerId === partner.partnerId;

            return (
              <button
                key={partner.partnerId}
                type="button"
                onClick={() => handlePartnerSelect(partner.partnerId)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: `1px solid ${isSelected ? theme.brand : theme.line}`,
                  background: isSelected ? theme.brandSurface : theme.surface,
                  color: isSelected ? theme.brand : theme.text,
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{partner.storeName}</span>
                {pendingCount > 0 && (
                  <span style={{
                    background: theme.warning,
                    color: theme.surface,
                    borderRadius: '99px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 900
                  }}>
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </Box>
      </Box>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
        {/* Document list board */}
        <Surface tone="raised" padding={5} gap={4} style={{ borderRadius: '16px' }}>
          <Text role="titleLg" style={{ fontWeight: '900', color: theme.brandHeaderBackground }}>
            وثائق الشريك والمطابقة
          </Text>

          <Box gap={3}>
            {documents.map((doc) => {
              const isSelected = selectedDocId === doc.id;
              const tone = doc.status === 'verified' ? 'success' : doc.status === 'rejected' ? 'danger' : doc.status === 'uploaded' ? 'warning' : 'neutral';
              const statusText = doc.status === 'verified' ? 'معتمد' : doc.status === 'rejected' ? 'مرفوض' : doc.status === 'uploaded' ? 'مرفوع للمراجعة' : 'مفقود';

              return (
                <WebControlPanelDecisionRow
                  key={doc.id}
                  entityId={doc.id}
                  entityLabel={doc.label}
                  status={statusText}
                  statusTone={tone}
                  risk={doc.status === 'rejected' ? 'danger' : 'neutral'}
                  recommendation={doc.status === 'uploaded' ? 'الوثيقة جاهزة للتدقيق والاعتماد' : doc.rejectionReason ?? 'الوثائق معتمدة ومطابقة لملف الميداني.'}
                  reason={doc.verifiedByFieldAgent ? `تم التحقق ميدانياً بواسطة: ${doc.verifiedByFieldAgent}` : 'لم يتم التحقق الميداني بعد.'}
                  sla={doc.kind === 'commercial_registration' ? 'سجل تجاري' : doc.kind === 'tax_certificate' ? 'شهادة ضريبية' : 'إثبات هوية'}
                  primaryAction={{
                    id: `${doc.id}-select`,
                    label: isSelected ? 'قيد المراجعة' : 'تفاصيل ومراجعة',
                    onAction: () => {
                      setSelectedDocId(doc.id);
                      setActionMessage(`تفاصيل وثيقة: ${doc.label}`);
                    }
                  }}
                />
              );
            })}
          </Box>
        </Surface>

        {/* Document details review inspector */}
        <Box gap={4}>
          {selectedDoc ? (
            <WebControlPanelInspectorShell
              title={selectedDoc.label}
              onClose={() => setSelectedDocId(null)}
            >
              <Box gap={3} padding={4}>
                <KeyValueList
                  dense
                  items={[
                    { label: 'نوع المستند', value: selectedDoc.kind },
                    { label: 'حالة التحقق', value: selectedDoc.status, tone: selectedDoc.status === 'verified' ? 'success' : 'danger' },
                    { label: 'تاريخ الرفع', value: selectedDoc.uploadedAt ? new Date(selectedDoc.uploadedAt).toLocaleDateString('ar-SA') : 'غير متوفر' },
                  ]}
                />

                {/* Field evidence display */}
                {selectedDoc.verifiedByFieldAgent && (
                  <Surface tone="inset" padding={3} gap={2} style={{ borderRadius: '10px' }}>
                    <Text role="caption" tone="brand" style={{ fontWeight: '800' }}>✓ دليل التحقق الميداني (Field Onboarding Evidence)</Text>
                    <KeyValueList
                      dense
                      items={[
                        { label: 'المندوب الميداني', value: selectedDoc.verifiedByFieldAgent },
                        { label: 'تاريخ الزيارة', value: selectedDoc.fieldVisitDate ?? 'غير محدد' },
                        { label: 'الإحداثيات الجغرافية', value: selectedDoc.geoCoordinates ?? 'غير محدد' },
                        { label: 'صورة الدليل المرفوعة', value: selectedDoc.fieldEvidencePhoto ?? 'غير متوفر' },
                      ]}
                    />
                  </Surface>
                )}

                {/* Error / Rejection details */}
                {selectedDoc.status === 'rejected' && selectedDoc.rejectionReason && (
                  <Box style={{ background: theme.dangerSurface, border: `1px solid ${theme.danger}`, padding: '10px', borderRadius: '8px' }}>
                    <Text role="bodySm" style={{ color: theme.danger, fontWeight: '700' }}>⚠ سبب الرفض:</Text>
                    <Text role="caption" style={{ color: theme.danger }}>{selectedDoc.rejectionReason}</Text>
                  </Box>
                )}

                {selectedDoc.status === 'uploaded' && (
                  <WebControlPanelActionCluster
                    primary={{
                      id: 'btn-doc-approve',
                      label: 'اعتماد المستند',
                      onAction: () => handleApproveDoc(selectedDoc.id),
                    }}
                    secondary={{
                      id: 'btn-doc-reject',
                      label: 'رفض المستند',
                      onAction: () => handleRejectDoc(selectedDoc.id, 'المستند غير واضح أو منتهي الصلاحية.'),
                    }}
                  />
                )}
              </Box>
            </WebControlPanelInspectorShell>
          ) : (
            <WebControlPanelRecommendation
              title="توجيهات التدقيق"
              reason={actionMessage}
              confidence="high"
              auditTag="UI_PREVIEW_ONLY"
            />
          )}

          <Surface tone="raised" padding={4} gap={2} style={{ borderRadius: '12px' }}>
            <Text role="titleSm" style={{ fontWeight: '800' }}>أهلية الترويج والتسويق</Text>
            <Box style={{ background: theme.surfaceInset, padding: '10px', borderRadius: '8px' }}>
              <Text role="bodySm" tone={currentStatus === 'client_visible' ? 'success' : 'danger'}>
                {currentStatus === 'client_visible'
                  ? 'الشريك مفعّل ومستنداته مكتملة ويحق له إنشاء عروض ترويجية.'
                  : 'معطّل: يجب مراجعة واعتماد كافة وثائق الشريك قبل فتح مسار أهلية الترويج.'
                }
              </Text>
            </Box>
          </Surface>
        </Box>
      </div>
    </Box>
  );
}

export default ControlPanelDshPartnerActivationScreen;
