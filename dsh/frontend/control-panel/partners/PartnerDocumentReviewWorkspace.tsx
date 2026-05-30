'use client';

import React from 'react';
import { Box, Text, useTheme, Surface, KeyValueList } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelInspectorShell,
  WebControlPanelActionCluster,
  WebControlPanelRecommendation,
} from '@bthwani/ui-kit/web';
import { type DshPartnerActivationStatus } from '../../shared/dsh-partner-activation.model';
import {
  PARTNER_FULFILLMENT_AGREEMENTS,
  type DshPartnerDocumentVerification,
  getPartnerActivationStatus,
  updatePartnerActivationStatus,
  getAllPartnerActivationStatuses,
  getPartnerDocuments,
  updatePartnerDocumentStatus,
} from './workflow';

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
    setActionMessage(
      `تحديد الشريك: ${PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === id)?.storeName}`,
    );
  };

  const handleApproveDoc = (docId: string) => {
    updatePartnerDocumentStatus(selectedPartnerId, docId, 'verified');
    const updatedDocs = getPartnerDocuments(selectedPartnerId);
    setDocuments(updatedDocs);
    setActionMessage('تم اعتماد الوثيقة وربطها بدليل الميداني.');

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
                  <span
                    style={{
                      background: theme.warning,
                      color: theme.surface,
                      borderRadius: '99px',
                      padding: '2px 6px',
                      fontSize: '10px',
                      fontWeight: 900,
                    }}
                  >
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
              const tone =
                doc.status === 'verified'
                  ? 'success'
                  : doc.status === 'rejected'
                  ? 'danger'
                  : doc.status === 'uploaded'
                  ? 'warning'
                  : 'neutral';
              const statusText =
                doc.status === 'verified'
                  ? 'معتمد'
                  : doc.status === 'rejected'
                  ? 'مرفوض'
                  : doc.status === 'uploaded'
                  ? 'مرفوع للمراجعة'
                  : 'مفقود';

              return (
                <WebControlPanelDecisionRow
                  key={doc.id}
                  entityId={doc.id}
                  entityLabel={doc.label}
                  status={statusText}
                  statusTone={tone}
                  risk={doc.status === 'rejected' ? 'danger' : 'neutral'}
                  recommendation={
                    doc.status === 'uploaded'
                      ? 'الوثيقة جاهزة للتدقيق والاعتماد'
                      : doc.rejectionReason ?? 'الوثائق معتمدة ومطابقة لملف الميداني.'
                  }
                  reason={
                    doc.verifiedByFieldAgent
                      ? `تم التحقق ميدانياً بواسطة: ${doc.verifiedByFieldAgent}`
                      : 'لم يتم التحقق الميداني بعد.'
                  }
                  sla={
                    doc.kind === 'commercial_registration'
                      ? 'سجل تجاري'
                      : doc.kind === 'tax_certificate'
                      ? 'شهادة ضريبية'
                      : 'إثبات هوية'
                  }
                  primaryAction={{
                    id: `${doc.id}-select`,
                    label: isSelected ? 'قيد المراجعة' : 'تفاصيل ومراجعة',
                    onAction: () => {
                      setSelectedDocId(doc.id);
                      setActionMessage(`تفاصيل وثيقة: ${doc.label}`);
                    },
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
                    {
                      label: 'حالة التحقق',
                      value: selectedDoc.status,
                      tone: selectedDoc.status === 'verified' ? 'success' : 'danger',
                    },
                    {
                      label: 'تاريخ الرفع',
                      value: selectedDoc.uploadedAt
                        ? new Date(selectedDoc.uploadedAt).toLocaleDateString('ar-SA')
                        : 'غير متوفر',
                    },
                  ]}
                />

                {selectedDoc.verifiedByFieldAgent && (
                  <Surface tone="inset" padding={3} gap={2} style={{ borderRadius: '10px' }}>
                    <Text role="caption" tone="brand" style={{ fontWeight: '800' }}>
                      ✓ دليل التحقق الميداني (Field Onboarding Evidence)
                    </Text>
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

                {selectedDoc.status === 'rejected' && selectedDoc.rejectionReason && (
                  <Box
                    style={{
                      backgroundColor: theme.dangerSurface,
                      borderWidth: 1,
                      borderColor: theme.danger,
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    <Text role="bodySm" style={{ color: theme.danger, fontWeight: '700' }}>
                      ⚠ سبب الرفض:
                    </Text>
                    <Text role="caption" style={{ color: theme.danger }}>
                      {selectedDoc.rejectionReason}
                    </Text>
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
                      onAction: () =>
                        handleRejectDoc(selectedDoc.id, 'المستند غير واضح أو منتهي الصلاحية.'),
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
            <Box style={{ backgroundColor: theme.surfaceInset, padding: 10, borderRadius: 8 }}>
              <Text role="bodySm" tone={currentStatus === 'client_visible' ? 'success' : 'danger'}>
                {currentStatus === 'client_visible'
                  ? 'الشريك مفعّل ومستنداته مكتملة ويحق له إنشاء عروض ترويجية.'
                  : 'معطّل: يجب مراجعة واعتماد كافة وثائق الشريك قبل فتح مسار أهلية الترويج.'}
              </Text>
            </Box>
          </Surface>
        </Box>
      </div>
    </Box>
  );
}

export default ControlPanelDshPartnerDocumentReviewScreen;
