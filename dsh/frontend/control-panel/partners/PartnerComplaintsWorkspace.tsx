'use client';

import React from 'react';
import { Box, Text, Surface, TextField } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelRecommendation,
  WebControlPanelStatusTag,
  WebControlPanelActionCluster,
} from '@bthwani/ui-kit/web';
import { PARTNER_FULFILLMENT_AGREEMENTS, getPartnerComplaints, updatePartnerComplaintStatus } from './workflow';
import type { PartnerComplaint } from '../../shared/state-machines/workflow';
import styles from '../shared/control-panel-surface.module.css';


export function PartnerComplaintsWorkspace() {
  const [complaints, setComplaints] = React.useState<PartnerComplaint[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = React.useState('');

  React.useEffect(() => {
    setComplaints(getPartnerComplaints());
  }, []);

  const selectedComplaint = complaints.find((c) => c.id === selectedId);
  const partner = selectedComplaint ? PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === selectedComplaint.partnerId) : null;

  const handleStatusChange = (id: string, newStatus: 'investigating' | 'resolved') => {
    updatePartnerComplaintStatus(id, newStatus, resolutionNote.trim() || undefined);
    setComplaints(getPartnerComplaints());
    setResolutionNote('');
    if (newStatus === 'resolved') {
      setSelectedId(null);
    }
  };


  const openComplaintsCount = complaints.filter(c => c.status === 'open' || c.status === 'investigating').length;

  return (
    <div className={styles.surfaceSplitGrid} dir="rtl">
      {/* Complaints List */}
      <Surface tone="raised" padding={5} gap={4} radiusToken="lg">
        <Box layoutDirection="row" justify="space-between" align="center">
          <Text role="titleLg" tone="brand">
            شكاوى الشركاء
          </Text>
          <WebControlPanelStatusTag label={`${openComplaintsCount} شكاوى نشطة`} tone={openComplaintsCount > 0 ? 'danger' : 'neutral'} />
        </Box>

        <Box gap={3}>
          {complaints.length === 0 || openComplaintsCount === 0 ? (
            <Surface padding={8} align="center" tone="inset" radiusToken="lg">
              <Text tone="muted">لا توجد شكاوى نشطة حالياً.</Text>
            </Surface>
          ) : (
            complaints.filter(c => c.status !== 'resolved').map((cmp) => {
              const pInfo = PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === cmp.partnerId);
              return (
                <WebControlPanelDecisionRow
                  key={cmp.id}
                  entityId={cmp.id}
                  entityLabel={`${pInfo?.storeName ?? 'مجهول'} · ${cmp.category}`}
                  status={cmp.status === 'open' ? 'جديدة' : 'قيد التحقيق'}
                  statusTone={cmp.status === 'open' ? 'danger' : 'warning'}
                  risk={cmp.severity === 'high' ? 'danger' : 'warning'}
                  recommendation={cmp.description.substring(0, 60) + '...'}
                  reason={`تاريخ الرفع: ${cmp.submittedAt}`}
                  sla={cmp.severity === 'high' ? 'استجابة فورية (SLA 1h)' : 'استجابة قياسية (SLA 24h)'}
                  primaryAction={{
                    id: `investigate-${cmp.id}`,
                    label: selectedId === cmp.id ? 'معاينة التذكرة' : 'فتح الشكوى',
                    onAction: () => setSelectedId(cmp.id),
                  }}
                />
              );
            })
          )}
        </Box>
      </Surface>

      {/* Complaint Inspector Panel */}
      <Box gap={4}>
        {selectedComplaint && partner ? (
          <Surface tone="inset" padding={4} gap={3} radiusToken="lg">
            <Box layoutDirection="row" justify="space-between" align="center">
              <Text role="titleSm" tone="brand">
                تفاصيل الشكوى
              </Text>
              <WebControlPanelStatusTag label={selectedComplaint.category} tone={selectedComplaint.severity === 'high' ? 'danger' : 'warning'} />
            </Box>

            <Surface tone="default" padding={3} radiusToken="sm" border borderTone="line">
              <Box gap={1} style={{ marginVertical: 8 }}>
                <Text role="caption" tone="muted">المتجر المشتكي:</Text>
                <Text role="titleSm" tone="default">{partner.storeName}</Text>
              </Box>

              {selectedComplaint.relatedOrderId && (
                <Box gap={1} style={{ marginVertical: 8 }}>
                  <Text role="caption" tone="muted">رقم الطلب المرتبط:</Text>
                  <Text role="titleSm" tone="default">{selectedComplaint.relatedOrderId}</Text>
                </Box>
              )}

              <Box gap={1} style={{ marginVertical: 8 }}>
                <Text role="caption" tone="muted">الوصف:</Text>
                <Text role="bodySm" tone="default">{selectedComplaint.description}</Text>
              </Box>
            </Surface>

            <Box gap={2} style={{ marginVertical: 8 }}>
              <TextField
                label="ملاحظات وتوجيهات الحل (تُحفظ في سجل التدقيق)"
                value={resolutionNote}
                onChangeText={setResolutionNote}
                placeholder="اكتب الإجراء المتخذ لحل المشكلة هنا..."
              />
            </Box>

            <WebControlPanelRecommendation
              title="توجيه معالجة الشكوى"
              reason={selectedComplaint.severity === 'high' ? 'يتطلب التواصل الفوري مع الشريك وعملية التصعيد للعمليات المركزية.' : 'شكوى ضمن الإطار التشغيلي المعتاد، يرجى التوجيه للقسم المختص.'}
              confidence="high"
              auditTag="NEEDS_BINDING_LATER"
            />

            <Box style={{ marginVertical: 12 }}>
              <WebControlPanelActionCluster
                primary={
                  selectedComplaint.status === 'open'
                    ? {
                        id: 'start-investigation',
                        label: 'بدء التحقيق',
                        onAction: () => handleStatusChange(selectedComplaint.id, 'investigating'),
                      }
                    : undefined
                }
                secondary={{
                  id: 'close-ticket',
                  label: 'إغلاق التذكرة',
                  onAction: () => handleStatusChange(selectedComplaint.id, 'resolved'),
                }}
              />
            </Box>
          </Surface>
        ) : (
          <WebControlPanelRecommendation
            title="متابعة الشكاوى"
            reason="اختر شكوى من القائمة لاستعراض تفاصيلها وإدارتها ضمن مسار الدعم المتخصص للشركاء."
            confidence="high"
            auditTag="NEEDS_BINDING_LATER"
          />
        )}
      </Box>
    </div>
  );
}

export default PartnerComplaintsWorkspace;
