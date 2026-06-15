'use client';

import React from 'react';
import { Box, Text, Surface, KeyValueList } from '@bthwani/ui-kit';
import {
  WebControlPanelActionCluster,
  WebControlPanelRecommendation,
} from '@bthwani/ui-kit/web';
import {
  getDshFieldReadinessRuntimeClient,
  type FieldReadinessApprovalRecord,
} from '../../shared';
import styles from './readiness-approvals.module.css';

export function ReadinessApprovalsWorkspace() {
  const [selectedStoreId, setSelectedStoreId] = React.useState('store-1001');
  const [latestApproval, setLatestApproval] = React.useState<FieldReadinessApprovalRecord | null>(null);
  const [approvalLoadState, setApprovalLoadState] = React.useState<'idle' | 'loading' | 'not-found' | 'error'>('idle');
  const [reason, setReason] = React.useState('');
  const [actionMessage, setActionMessage] = React.useState('يرجى التحقق من اكتمال دليل الزيارة الميدانية والمستندات قبل الاعتماد.');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const client = React.useMemo(() => getDshFieldReadinessRuntimeClient(), []);

  const loadLatestApproval = React.useCallback(async (storeId: string) => {
    setErrorMsg(null);
    setApprovalLoadState('loading');
    try {
      const rec = await client.getLatestFieldReadinessApproval(storeId);
      setLatestApproval(rec);
      setApprovalLoadState('idle');
    } catch (e: unknown) {
      const status = (e as { status?: number })?.status;
      if (status === 404 || (e instanceof Error && /not.found|no.record/i.test(e.message))) {
        setLatestApproval(null);
        setApprovalLoadState('not-found');
      } else {
        console.error('Failed to load readiness approval:', e);
        setApprovalLoadState('error');
      }
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
      setErrorMsg('فشل تسجيل القرار. تحقق من الاتصال وأعد المحاولة.');
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

      <div className={styles.splitGrid}>
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
                  className={`${styles.storeCard}${isSelected ? ` ${styles.storeCardSelected}` : ''}`}
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

          {approvalLoadState === 'loading' && (
            <Surface tone="raised" padding={3} radiusToken="sm">
              <Text role="bodySm" tone="muted">جارٍ تحميل سجل الاعتماد...</Text>
            </Surface>
          )}
          {approvalLoadState === 'error' && (
            <Surface tone="danger" padding={3} radiusToken="sm" border>
              <Text role="bodySm" tone="danger">تعذّر تحميل سجل الاعتماد. تحقق من الاتصال وأعد تحديد المتجر.</Text>
            </Surface>
          )}
          {approvalLoadState !== 'loading' && approvalLoadState !== 'error' && latestApproval && (
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
                  { label: 'تاريخ القرار', value: new Date(latestApproval.created_at).toLocaleString('ar-SA') },
                ]}
              />
            </Surface>
          )}
          {(approvalLoadState === 'not-found' || (approvalLoadState === 'idle' && !latestApproval)) && (
            <Surface tone="warning" padding={3} radiusToken="sm" border>
              <Text role="bodySm" tone="warning">
                تنبيه: لا يوجد قرار اعتماد مسجل لهذا المتجر حتى الآن. هو حالياً "غير جاهز" (not_ready) تلقائياً.
              </Text>
            </Surface>
          )}

          <Box gap={3} className={styles.formBox}>
            <Text role="bodySm" tone="default">
              إقرار مدقق العمليات (اعتماد أو رفض الملف الميداني كاملاً):
            </Text>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="اكتب مبررات الاعتماد أو أسباب الرفض بالتفصيل..."
              className={styles.reasonInput}
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
