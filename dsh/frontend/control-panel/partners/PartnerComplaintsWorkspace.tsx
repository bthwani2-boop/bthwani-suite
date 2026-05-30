'use client';

import React from 'react';
import { Box, Text, Surface } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelRecommendation,
  WebControlPanelStatusTag,
  WebControlPanelActionCluster,
} from '@bthwani/ui-kit/web';
import { PARTNER_FULFILLMENT_AGREEMENTS } from './workflow';
import { PARTNER_COMPLAINTS_DATA, type PartnerComplaint } from '../../data/partner.preview-data';
import styles from '../shared/control-panel-surface.module.css';

export function PartnerComplaintsWorkspace() {
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
            <Surface padding={8} align="center" background="surfaceInset" radiusToken="lg">
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

            <Surface background="surface" padding={3} radiusToken="sm" border borderTone="line">
              <Box gap={1} marginY={2}>
                <Text role="caption" tone="muted">المتجر المشتكي:</Text>
                <Text role="titleSm" tone="base">{partner.storeName}</Text>
              </Box>

              {selectedComplaint.relatedOrderId && (
                <Box gap={1} marginY={2}>
                  <Text role="caption" tone="muted">رقم الطلب المرتبط:</Text>
                  <Text role="titleSm" tone="base">{selectedComplaint.relatedOrderId}</Text>
                </Box>
              )}

              <Box gap={1} marginY={2}>
                <Text role="caption" tone="muted">الوصف:</Text>
                <Text role="bodySm" tone="base">{selectedComplaint.description}</Text>
              </Box>
            </Surface>

            <WebControlPanelRecommendation
              title="توجيه معالجة الشكوى"
              reason={selectedComplaint.severity === 'high' ? 'يتطلب التواصل الفوري مع الشريك وعملية التصعيد للعمليات المركزية.' : 'شكوى ضمن الإطار التشغيلي المعتاد، يرجى التوجيه للقسم المختص.'}
              confidence="high"
              auditTag="UI_PREVIEW_ONLY"
            />

            <Box marginY={3}>
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
            auditTag="UI_PREVIEW_ONLY"
          />
        )}
      </Box>
    </div>
  );
}

export default PartnerComplaintsWorkspace;
