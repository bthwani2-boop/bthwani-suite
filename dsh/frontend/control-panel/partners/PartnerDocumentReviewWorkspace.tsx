'use client';

import React from 'react';
import { Box, Text, Surface, KeyValueList } from '@bthwani/ui-kit';
import { Pressable } from 'react-native';
import {
  WebControlPanelDecisionRow,
  WebControlPanelInspectorShell,
  WebControlPanelActionCluster,
  WebControlPanelRecommendation,
} from '@bthwani/ui-kit/web';
import { type DshPartnerActivationStatus } from '../../shared/stores/partner/dsh-partner-activation.model';
import {
  PARTNER_FULFILLMENT_AGREEMENTS,
  type DshPartnerDocumentVerification,
  getPartnerActivationStatus,
  updatePartnerActivationStatus,
  getAllPartnerActivationStatuses,
  getPartnerDocuments,
  updatePartnerDocumentStatus,
} from './workflow';
import styles from '../shared/control-panel-surface.module.css';

export function ControlPanelDshPartnerDocumentReviewScreen() {
  const [partnerStatuses, setPartnerStatuses] = React.useState<Record<string, DshPartnerActivationStatus>>({});
  const [documents, setDocuments] = React.useState<DshPartnerDocumentVerification[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = React.useState('partner-saha');
  const [selectedDocId, setSelectedDocId] = React.useState<string | null>(null);
  const [actionMessage, setActionMessage] = React.useState('حدد وثيقة شريك للبدء في مراجعتها واعتمادها.');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState('');

  React.useEffect(() => {
    setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
    setDocuments(getPartnerDocuments(selectedPartnerId));
  }, [selectedPartnerId]);

  const selectedDoc = documents.find(d => d.id === selectedDocId);
  const currentStatus = partnerStatuses[selectedPartnerId] ?? getPartnerActivationStatus(selectedPartnerId);

  const handlePartnerSelect = (id: string) => {
    setSelectedPartnerId(id);
    setSelectedDocId(null);
    setRejectReason('');
    setActionMessage(
      `تحديد الشريك: ${PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === id)?.storeName}`,
    );
  };

  const handleApproveDoc = (docId: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      updatePartnerDocumentStatus(selectedPartnerId, docId, 'verified');
      const updatedDocs = getPartnerDocuments(selectedPartnerId);
      setDocuments(updatedDocs);
      setActionMessage('تم اعتماد الوثيقة وربطها بدليل الميداني.');

      const allVerified = updatedDocs.every(d => d.status === 'verified');
      if (allVerified && currentStatus === 'submitted') {
        updatePartnerActivationStatus(selectedPartnerId, 'documents_verified');
        setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
      }
      setIsSubmitting(false);
    }, 600);
  };

  const handleRejectDoc = (docId: string, reason: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      updatePartnerDocumentStatus(selectedPartnerId, docId, 'rejected', reason);
      const updatedDocs = getPartnerDocuments(selectedPartnerId);
      setDocuments(updatedDocs);
      setActionMessage(`تم رفض الوثيقة. السبب: ${reason}`);

      updatePartnerActivationStatus(selectedPartnerId, 'documents_missing');
      setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
      setIsSubmitting(false);
      setRejectReason('');
    }, 600);
  };

  return (
    <Box gap={4}>
      {/* Partner selectors */}
      <Box gap={2}>
        <Text role="caption" tone="brand">اختر الشريك لمراجعة مستنداته</Text>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {PARTNER_FULFILLMENT_AGREEMENTS.map((partner) => {
            const docs = getPartnerDocuments(partner.partnerId);
            const pendingCount = docs.filter(d => d.status === 'uploaded').length;
            const isSelected = selectedPartnerId === partner.partnerId;

            return (
              <Pressable
                key={partner.partnerId}
                onPress={() => handlePartnerSelect(partner.partnerId)}
                style={{ cursor: 'pointer' }}
              >
                <Surface
                  padding={2}
                  radiusToken="sm"
                  border
                  borderTone={isSelected ? 'brand' : 'line'}
                  tone={isSelected ? 'brand' : 'default'}
                  layoutDirection="row"
                  align="center"
                  gap={2}
                >
                  <Text role="bodySm" tone={isSelected ? 'brand' : 'default'}>{partner.storeName}</Text>
                  {pendingCount > 0 && (
                    <Surface padding={1} radiusToken="pill" tone="warning" border={false}>
                      <Text role="caption" tone="inverse">
                        {pendingCount}
                      </Text>
                    </Surface>
                  )}
                </Surface>
              </Pressable>
            );
          })}
        </Box>
      </Box>

      <div className={styles.surfaceSplitGrid}>
        {/* Document list board */}
        <Surface tone="raised" padding={5} gap={4} radiusToken="lg">
          <Text role="titleLg" tone="brand">
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
                      setRejectReason('');
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
                  <Surface tone="inset" padding={3} gap={2} radiusToken="sm">
                    <Text role="caption" tone="brand">
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
                  <Surface tone="danger" padding={3} radiusToken="sm" border borderTone="danger">
                    <Text role="bodySm" tone="danger">
                      ⚠ سبب الرفض:
                    </Text>
                    <Text role="caption" tone="danger">
                      {selectedDoc.rejectionReason}
                    </Text>
                  </Surface>
                )}

                {selectedDoc.status === 'uploaded' && (
                  <Box gap={3}>
                    <Text role="caption" tone="muted">ملاحظة الرفض (إلزامية في حالة الرفض فقط)</Text>
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="اكتب سبب الرفض هنا..."
                      style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--bth-color-line)', width: '100%' }}
                      disabled={isSubmitting}
                    />
                    <WebControlPanelActionCluster
                      primary={isSubmitting ? undefined : {
                        id: 'btn-doc-approve',
                        label: 'اعتماد المستند',
                        onAction: () => handleApproveDoc(selectedDoc.id),
                      }}
                      secondary={(isSubmitting || rejectReason.trim() === '') ? undefined : {
                        id: 'btn-doc-reject',
                        label: 'رفض المستند',
                        onAction: () =>
                          handleRejectDoc(selectedDoc.id, rejectReason),
                      }}
                    />
                  </Box>
                )}
              </Box>
            </WebControlPanelInspectorShell>
          ) : (
            <WebControlPanelRecommendation
              title="توجيهات التدقيق"
              reason={actionMessage}
              confidence="high"
              auditTag="NEEDS_BINDING_LATER"
            />
          )}

          <Surface tone="raised" padding={4} gap={2} radiusToken="lg">
            <Text role="titleSm" tone="default">أهلية الترويج والتسويق</Text>
            <Surface tone="inset" padding={3} radiusToken="sm">
              <Text role="bodySm" tone={currentStatus === 'client_visible' ? 'success' : 'danger'}>
                {currentStatus === 'client_visible'
                  ? 'الشريك مفعّل ومستنداته مكتملة ويحق له إنشاء عروض ترويجية.'
                  : 'معطّل: يجب مراجعة واعتماد كافة وثائق الشريك قبل فتح مسار أهلية الترويج.'}
              </Text>
            </Surface>
          </Surface>
        </Box>
      </div>
    </Box>
  );
}

export default ControlPanelDshPartnerDocumentReviewScreen;
