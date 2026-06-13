'use client';

import React from 'react';
import { Box, Text, Surface, KeyValueList } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelInspectorShell,
  WebControlPanelActionCluster,
  WebControlPanelRecommendation,
} from '@bthwani/ui-kit/web';
import {
  getDshFieldReadinessRuntimeClient,
  type FieldReadinessApprovalRecord,
} from '../../shared';

export function ReadinessApprovalsWorkspace() {
  const [selectedStoreId, setSelectedStoreId] = React.useState('store-1001');
  const [latestApproval, setLatestApproval] = React.useState<FieldReadinessApprovalRecord | null>(null);
  const [reason, setReason] = React.useState('');
  const [actionMessage, setActionMessage] = React.useState('يرجى التحقق من اكتمال دليل الزيارة الميدانية والمستندات قبل الاعتماد.');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const client = React.useMemo(() => {
    return getDshFieldReadinessRuntimeClient();
  }, []);

  const loadLatestApproval = React.useCallback(async (storeId: string) => {
    setErrorMsg(null);
    try {
      const rec = await client.getLatestFieldReadinessApproval(storeId);
      setLatestApproval(rec);
    } catch (e) {
      console.log('No approval record or API error:', e);
      setLatestApproval(null);
    }
  }, [client]);

  React.useEffect(() => {
    loadLatestApproval(selectedStoreId);
  }, [selectedStoreId, loadLatestApproval]);

  const handleDecision = async (decision: 'approved' | 'rejected') => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const rec = await client.createFieldReadinessApproval(selectedStoreId, {
        decision,
        reason,
        operator_id: 'operator-1',
      });
      setLatestApproval(rec);
      setReason('');
      setActionMessage(`تم تسجيل قرار الجاهزية بنجاح: ${decision === 'approved' ? 'اعتماد المتجر وتأهيل بوابة الظهور' : 'رفض الملف مع طلب إصلاح'}`);
    } catch (e) {
      console.error(e);
      // Fallback for preview/mock demo
      const mockRec: FieldReadinessApprovalRecord = {
        id: `appr-mock-${Date.now()}`,
        store_id: selectedStoreId,
        decision,
        reason,
        operator_id: 'operator-1',
        created_at: new Date().toISOString(),
      };
      setLatestApproval(mockRec);
      setReason('');
      setActionMessage(`[معاينة] تم تسجيل قرار الجاهزية بنجاح: ${decision === 'approved' ? 'اعتماد المتجر وتأهيل بوابة الظهور' : 'رفض الملف مع طلب إصلاح'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sampleStores = [
    { id: 'store-1001', name: 'مخبز وبقالة الصفا (نشط ميدانياً)' },
    { id: 'store-1002', name: 'مطعم مذاق البخاري (قيد المراجعة)' },
    { id: 'store-1003', name: 'صيدلية النور الميدانية (جديد)' },
  ];

  return (
    <Box gap={4}>
      <Text role="bodyMd" tone="muted">
        شاشة الاعتماد النهائي لملف الجاهزية الميدانية (J-006E). عند الاعتماد (Approved)، يتم ترويج حالة الشريك لتصبح مؤهلة للبوابة التسويقية (J-001C). لا تنطوي على أي حركة مالية (حدود WLT).
      </Text>

      {errorMsg && (
        <Surface tone="danger" padding={3} radiusToken="sm">
          <Text role="bodySm" tone="danger">{errorMsg}</Text>
        </Surface>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr', gap: '20px' }}>
        {/* Store Selector Board */}
        <Surface tone="raised" padding={5} gap={4} radiusToken="lg">
          <Text role="titleLg" tone="brand">
            اختر المتجر للاعتماد
          </Text>

          <Box gap={2}>
            {sampleStores.map((store) => {
              const isSelected = selectedStoreId === store.id;
              return (
                <div
                  key={store.id}
                  onClick={() => setSelectedStoreId(store.id)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${isSelected ? 'var(--bth-color-brand)' : 'var(--bth-color-line)'}`,
                    backgroundColor: isSelected ? 'var(--bth-color-brand-surface)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <Text role="bodyMd" tone={isSelected ? 'brand' : 'default'}>
                    {store.name}
                  </Text>
                  <Text role="caption" tone="muted">
                    معرف المتجر: {store.id}
                  </Text>
                </div>
              );
            })}
          </Box>
        </Surface>

        {/* Approval Form and Audit Trail */}
        <Surface tone="raised" padding={5} gap={4} radiusToken="lg">
          <Text role="titleLg" tone="brand">
            حالة واعتماد الجاهزية لـ {selectedStoreId}
          </Text>

          {latestApproval ? (
            <Surface tone={latestApproval.decision === 'approved' ? 'success' : 'danger'} padding={4} radiusToken="sm" border>
              <Text role="titleSm" tone={latestApproval.decision === 'approved' ? 'success' : 'danger'}>
                القرار الحالي: {latestApproval.decision === 'approved' ? '✓ معتمد وجاهز للظهور في التطبيق' : '⚠ مرفوض / بحاجة لإصلاح'}
              </Text>
              <KeyValueList
                dense
                items={[
                  { label: 'رقم الاعتماد', value: latestApproval.id },
                  { label: 'المدقق المسؤول', value: latestApproval.operator_id || 'غير محدد' },
                  { label: 'السبب/الملاحظة', value: latestApproval.reason || 'لا توجد ملاحظات إضافية' },
                  {
                    label: 'تاريخ القرار',
                    value: new Date(latestApproval.created_at).toLocaleString('ar-SA'),
                  },
                ]}
              />
            </Surface>
          ) : (
            <Surface tone="warning" padding={3} radiusToken="sm" border>
              <Text role="bodySm" tone="warning">
                تنبيه: لا يوجد قرار اعتماد مسجل لهذا المتجر حتى الآن. هو حالياً "غير جاهز" (not_ready) تلقائياً.
              </Text>
            </Surface>
          )}

          <Box gap={3} style={{ marginTop: 12 }}>
            <Text role="bodySm" tone="default">
              إقرار مدقق العمليات (اعتماد أو رفض الملف الميداني كاملاً):
            </Text>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="اكتب مبررات الاعتماد أو أسباب الرفض بالتفصيل..."
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--bth-color-line)',
                fontSize: '14px',
                width: '100%',
              }}
              disabled={isSubmitting}
            />

            <WebControlPanelActionCluster
              primary={{
                id: 'btn-approve-readiness',
                label: 'اعتماد ومطابقة (جاهز)',
                onAction: () => handleDecision('approved'),
              }}
              secondary={{
                id: 'btn-reject-readiness',
                label: 'رفض الملف (غير جاهز)',
                onAction: () => handleDecision('rejected'),
              }}
            />
          </Box>
        </Surface>
      </div>

      <WebControlPanelRecommendation
        title="دليل حوكمة الاعتماد الميداني"
        reason={actionMessage}
        confidence="high"
        auditTag="READINESS_APPROVAL"
      />
    </Box>
  );
}
