'use client';

import React from 'react';
import { Box, Text, useTheme, Surface, KeyValueList } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelRecommendation,
  WebControlPanelStatusTag,
} from '@bthwani/ui-kit/web';
import { PARTNER_FULFILLMENT_AGREEMENTS } from './workflow';

import { PARTNER_MODIFICATION_REQUESTS, type PartnerModificationRequest } from '../../data/partner.preview-data';

export function PartnerModificationsWorkspace() {
  const { theme } = useTheme();
  const [requests, setRequests] = React.useState<PartnerModificationRequest[]>(PARTNER_MODIFICATION_REQUESTS);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const selectedRequest = requests.find((r) => r.id === selectedId);
  const partner = selectedRequest ? PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === selectedRequest.partnerId) : null;

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    setSelectedId(null);
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    setSelectedId(null);
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start', direction: 'rtl' }}>
      {/* Modification Requests List */}
      <Surface tone="raised" padding={5} gap={4} style={{ borderRadius: '16px' }}>
        <Box layoutDirection="row" justify="space-between" align="center">
          <Text role="titleLg" style={{ fontWeight: '900', color: theme.brandHeaderBackground }}>
            طلبات تعديل البيانات
          </Text>
          <WebControlPanelStatusTag label={`${pendingCount} طلبات معلقة`} tone={pendingCount > 0 ? 'warning' : 'neutral'} />
        </Box>

        <Box gap={3}>
          {requests.length === 0 || pendingCount === 0 ? (
            <Box padding={8} align="center" style={{ backgroundColor: theme.surfaceInset, borderRadius: '12px' }}>
              <Text tone="muted">لا توجد طلبات تعديل بيانات معلقة.</Text>
            </Box>
          ) : (
            requests.filter(r => r.status === 'pending').map((req) => {
              const pInfo = PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === req.partnerId);
              return (
                <WebControlPanelDecisionRow
                  key={req.id}
                  entityId={req.id}
                  entityLabel={`${pInfo?.storeName ?? 'مجهول'} · ${req.type}`}
                  status="بانتظار المراجعة"
                  statusTone="warning"
                  risk={req.risk}
                  recommendation={req.reason}
                  reason={`تاريخ الطلب: ${req.submittedAt}`}
                  sla={req.risk === 'danger' ? 'مراجعة دقيقة' : 'إجراء اعتيادي'}
                  primaryAction={{
                    id: `view-${req.id}`,
                    label: selectedId === req.id ? 'قيد المراجعة' : 'مراجعة وتدقيق',
                    onAction: () => setSelectedId(req.id),
                  }}
                />
              );
            })
          )}
        </Box>
      </Surface>

      {/* Review Inspector panel */}
      <Box gap={4}>
        {selectedRequest && partner ? (
          <Surface tone="inset" padding={4} gap={3} style={{ borderRadius: '12px' }}>
            <Box layoutDirection="row" justify="space-between" align="center">
              <Text role="titleSm" style={{ fontWeight: '800', color: theme.brand }}>
                مراجعة: {partner.storeName}
              </Text>
              <WebControlPanelStatusTag label={selectedRequest.type} tone={selectedRequest.risk} />
            </Box>

            <Text role="bodySm" tone="muted">
              يرجى مقارنة البيانات المطلوبة قبل الموافقة لاعتمادها بشكل نهائي في ملف الشريك.
            </Text>

            <Box gap={2} style={{ marginTop: 8 }}>
              <Text role="caption" tone="brand" style={{ fontWeight: '800' }}>التغييرات المطلوبة:</Text>
              {selectedRequest.changes.map((change, idx) => (
                <div key={idx} style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.line}`,
                  borderRadius: '8px',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <Text role="caption" style={{ fontWeight: 800 }}>{change.field}</Text>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: theme.danger, textDecoration: 'line-through' }}>
                      {change.old}
                    </span>
                    <span style={{ fontSize: '11px', color: theme.success, fontWeight: 700 }}>
                      {change.new}
                    </span>
                  </div>
                </div>
              ))}
            </Box>

            <WebControlPanelRecommendation
              title="توجيه أمني/عملياتي"
              reason={selectedRequest.reason}
              confidence={selectedRequest.risk === 'danger' ? 'medium' : 'high'}
              auditTag="UI_PREVIEW_ONLY"
            />

            <Box layoutDirection="row" gap={2} style={{ marginTop: 12 }}>
              <button
                onClick={() => handleApprove(selectedRequest.id)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  backgroundColor: theme.success, color: theme.surface,
                  border: 'none', fontWeight: 700, cursor: 'pointer'
                }}>
                اعتماد التعديلات
              </button>
              <button
                onClick={() => handleReject(selectedRequest.id)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  backgroundColor: 'transparent', color: theme.danger,
                  border: `1px solid ${theme.danger}`, fontWeight: 700, cursor: 'pointer'
                }}>
                رفض
              </button>
            </Box>
          </Surface>
        ) : (
          <WebControlPanelRecommendation
            title="مراجعة التعديلات"
            reason="اختر طلب تعديل من القائمة الجانبية لمراجعة التغييرات المطلوب إجراؤها على ملف الشريك والموافقة عليها."
            confidence="high"
            auditTag="UI_PREVIEW_ONLY"
          />
        )}
      </Box>
    </div>
  );
}

export default PartnerModificationsWorkspace;
