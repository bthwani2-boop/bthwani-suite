'use client';

import React from 'react';
import { Box, Text, useTheme, Surface } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelRecommendation,
  WebControlPanelStatusTag,
} from '@bthwani/ui-kit/web';
import { PARTNER_FULFILLMENT_AGREEMENTS } from './workflow';

import { PARTNER_COMPLAINTS_DATA, type PartnerComplaint } from '../../data/partner.preview-data';

export function PartnerComplaintsWorkspace() {
  const { theme } = useTheme();
  const [complaints, setComplaints] = React.useState<PartnerComplaint[]>(PARTNER_COMPLAINTS_DATA);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const selectedComplaint = complaints.find((c) => c.id === selectedId);
  const partner = selectedComplaint ? PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === selectedComplaint.partnerId) : null;

  const handleStatusChange = (id: string, newStatus: 'investigating' | 'resolved') => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    if (newStatus === 'resolved') {
      setSelectedId(null);
    }
  };

  const openComplaintsCount = complaints.filter(c => c.status === 'open' || c.status === 'investigating').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start', direction: 'rtl' }}>
      {/* Complaints List */}
      <Surface tone="raised" padding={5} gap={4} style={{ borderRadius: '16px' }}>
        <Box layoutDirection="row" justify="space-between" align="center">
          <Text role="titleLg" style={{ fontWeight: '900', color: theme.brandHeaderBackground }}>
            شكاوى الشركاء
          </Text>
          <WebControlPanelStatusTag label={`${openComplaintsCount} شكاوى نشطة`} tone={openComplaintsCount > 0 ? 'danger' : 'neutral'} />
        </Box>

        <Box gap={3}>
          {complaints.length === 0 || openComplaintsCount === 0 ? (
            <Box padding={8} align="center" style={{ backgroundColor: theme.surfaceInset, borderRadius: '12px' }}>
              <Text tone="muted">لا توجد شكاوى نشطة حالياً.</Text>
            </Box>
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
          <Surface tone="inset" padding={4} gap={3} style={{ borderRadius: '12px' }}>
            <Box layoutDirection="row" justify="space-between" align="center">
              <Text role="titleSm" style={{ fontWeight: '800', color: theme.brand }}>
                تفاصيل الشكوى
              </Text>
              <WebControlPanelStatusTag label={selectedComplaint.category} tone={selectedComplaint.severity === 'high' ? 'danger' : 'warning'} />
            </Box>

            <Box style={{ backgroundColor: theme.surface, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: theme.line }}>
              <Text role="caption" tone="muted">المتجر المشتكي:</Text>
              <Text role="bodySm" style={{ fontWeight: 800, marginBottom: 8 }}>{partner.storeName}</Text>

              {selectedComplaint.relatedOrderId && (
                <>
                  <Text role="caption" tone="muted">رقم الطلب المرتبط:</Text>
                  <Text role="bodySm" style={{ fontWeight: 800, marginBottom: 8 }}>{selectedComplaint.relatedOrderId}</Text>
                </>
              )}

              <Text role="caption" tone="muted">الوصف:</Text>
              <Text role="bodySm" style={{ lineHeight: 1.5 }}>{selectedComplaint.description}</Text>
            </Box>

            <WebControlPanelRecommendation
              title="توجيه معالجة الشكوى"
              reason={selectedComplaint.severity === 'high' ? 'يتطلب التواصل الفوري مع الشريك وعملية التصعيد للعمليات المركزية.' : 'شكوى ضمن الإطار التشغيلي المعتاد، يرجى التوجيه للقسم المختص.'}
              confidence="high"
              auditTag="UI_PREVIEW_ONLY"
            />

            <Box layoutDirection="row" gap={2} style={{ marginTop: 12 }}>
              {selectedComplaint.status === 'open' && (
                <button
                  onClick={() => handleStatusChange(selectedComplaint.id, 'investigating')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px',
                    backgroundColor: theme.brand, color: theme.surface,
                    border: 'none', fontWeight: 700, cursor: 'pointer'
                  }}>
                  بدء التحقيق
                </button>
              )}
              <button
                onClick={() => handleStatusChange(selectedComplaint.id, 'resolved')}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  backgroundColor: 'transparent', color: theme.success,
                  border: `1px solid ${theme.success}`, fontWeight: 700, cursor: 'pointer'
                }}>
                إغلاق التذكرة
              </button>
            </Box>
          </Surface>
        ) : (
          <WebControlPanelRecommendation
            title="متابعة الشكاوى"
            reason="اختر شكوى من القائمة لاستعراض تفاصيلها وإدارتها ضمن مسار الدعم المتخصص للشركاء."
            confidence="high"
            auditTag="UI_PREVIEW_ONLY"
          />
        )}
      </Box>
    </div>
  );
}

export default PartnerComplaintsWorkspace;
