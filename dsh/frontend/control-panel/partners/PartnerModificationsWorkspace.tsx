'use client';

import React from 'react';
import { Box, Text, Surface } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelRecommendation,
  WebControlPanelStatusTag,
  WebControlPanelActionCluster,
} from '@bthwani/ui-kit/web';
import { PARTNER_FULFILLMENT_AGREEMENTS, getPartnerModifications, updatePartnerModificationStatus } from './workflow';
import type { PartnerModificationRequest } from '../../data/partner.preview-data';
import styles from '../shared/control-panel-surface.module.css';

export function PartnerModificationsWorkspace() {
  const [requests, setRequests] = React.useState<PartnerModificationRequest[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setRequests(getPartnerModifications());
  }, []);

  const selectedRequest = requests.find((r) => r.id === selectedId);
  const partner = selectedRequest ? PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === selectedRequest.partnerId) : null;

  const handleApprove = (id: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      updatePartnerModificationStatus(id, 'approved');
      setRequests(getPartnerModifications());
      setSelectedId(null);
      setIsSubmitting(false);
    }, 600);
  };

  const handleReject = (id: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      updatePartnerModificationStatus(id, 'rejected');
      setRequests(getPartnerModifications());
      setSelectedId(null);
      setIsSubmitting(false);
    }, 600);
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;


  return (
    <div className={styles.surfaceSplitGrid} dir="rtl">
      {/* Modification Requests List */}
      <Surface tone="raised" padding={5} gap={4} radiusToken="lg">
        <Box layoutDirection="row" justify="space-between" align="center">
          <Text role="titleLg" tone="brand">
            طلبات تعديل البيانات
          </Text>
          <WebControlPanelStatusTag label={`${pendingCount} طلبات معلقة`} tone={pendingCount > 0 ? 'warning' : 'neutral'} />
        </Box>

        <Box gap={3}>
          {requests.length === 0 || pendingCount === 0 ? (
            <Surface padding={8} align="center" tone="inset" radiusToken="lg">
              <Text tone="muted">لا توجد طلبات تعديل بيانات معلقة.</Text>
            </Surface>
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
          <Surface tone="inset" padding={4} gap={3} radiusToken="lg">
            <Box layoutDirection="row" justify="space-between" align="center">
              <Text role="titleSm" tone="brand">
                مراجعة: {partner.storeName}
              </Text>
              <WebControlPanelStatusTag label={selectedRequest.type} tone={selectedRequest.risk} />
            </Box>

            <Text role="bodySm" tone="muted">
              يرجى مقارنة البيانات المطلوبة قبل الموافقة لاعتمادها بشكل نهائي في ملف الشريك.
            </Text>

            <Box gap={2} style={{ marginVertical: 8 }}>
              <Text role="caption" tone="brand">التغييرات المطلوبة:</Text>
              {selectedRequest.changes.map((change, idx) => (
                <Surface key={idx} tone="default" padding={3} radiusToken="sm" border borderTone="line" gap={2}>
                  <Text role="caption" tone="default">{change.field}</Text>
                  <Box layoutDirection="row" justify="space-between">
                    <Text role="caption" tone="danger">
                      {change.old}
                    </Text>
                    <Text role="caption" tone="success">
                      {change.new}
                    </Text>
                  </Box>
                </Surface>
              ))}
            </Box>

            <WebControlPanelRecommendation
              title="توجيه أمني/عملياتي"
              reason={selectedRequest.reason}
              confidence={selectedRequest.risk === 'danger' ? 'medium' : 'high'}
              auditTag="NEEDS_BINDING_LATER"
            />

            <Box style={{ marginVertical: 8 }}>
              <WebControlPanelActionCluster
                primary={isSubmitting ? undefined : {
                  id: 'approve',
                  label: 'اعتماد التعديلات',
                  onAction: () => handleApprove(selectedRequest.id)
                }}
                secondary={isSubmitting ? undefined : {
                  id: 'reject',
                  label: 'رفض',
                  onAction: () => handleReject(selectedRequest.id)
                }}
              />
            </Box>
          </Surface>
        ) : (
          <WebControlPanelRecommendation
            title="مراجعة التعديلات"
            reason="اختر طلب تعديل من القائمة الجانبية لمراجعة التغييرات المطلوب إجراؤها على ملف الشريك والموافقة عليها."
            confidence="high"
            auditTag="NEEDS_BINDING_LATER"
          />
        )}
      </Box>
    </div>
  );
}

export default PartnerModificationsWorkspace;
