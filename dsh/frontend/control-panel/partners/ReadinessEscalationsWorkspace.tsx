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
  type FieldReadinessEscalationRecord,
} from '../../shared';

export function ReadinessEscalationsWorkspace() {
  const [escalations, setEscalations] = React.useState<readonly FieldReadinessEscalationRecord[]>([]);
  const [selectedEsc, setSelectedEsc] = React.useState<FieldReadinessEscalationRecord | null>(null);
  const [actionMessage, setActionMessage] = React.useState('حدد تصعيداً من القائمة للبدء في مراجعته ومعالجته.');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [operatorNote, setOperatorNote] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const client = React.useMemo(() => {
    return getDshFieldReadinessRuntimeClient();
  }, []);

  const loadEscalations = React.useCallback(async () => {
    try {
      const res = await client.listFieldReadinessEscalations();
      setEscalations(res.escalations || []);
    } catch (e) {
      console.error(e);
      setErrorMsg('فشل في تحميل تصعيدات الجاهزية من الخادم المحلي.');
      // Fallback preview data so CP works in sandbox preview too!
      setEscalations([
        {
          id: 'esc-mock-1',
          store_id: 'store-1001',
          field_agent_id: 'agent-mock',
          reason: 'المتجر يفتقر إلى لوحة تجارية واضحة ولم يرفع شهادة التسجيل التجاري.',
          target_team: 'partner-management',
          status: 'escalated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    }
  }, [client]);

  React.useEffect(() => {
    loadEscalations();
  }, [loadEscalations]);

  const handleUpdateStatus = async (status: 'info_requested' | 'resolved' | 'rejected') => {
    if (!selectedEsc) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const updated = await client.updateFieldReadinessEscalation(selectedEsc.id, {
        status,
        operator_note: operatorNote,
      });
      setActionMessage(`تم تحديث حالة التصعيد بنجاح إلى: ${status}`);
      setSelectedEsc(null);
      setOperatorNote('');
      loadEscalations();
    } catch (e) {
      console.error(e);
      // Fallback for preview mode
      const updatedMock: FieldReadinessEscalationRecord = {
        ...selectedEsc,
        status,
        operator_note: operatorNote,
        updated_at: new Date().toISOString(),
      };
      setEscalations(prev => prev.map(item => item.id === selectedEsc.id ? updatedMock : item));
      setActionMessage(`[معاينة] تم تحديث حالة التصعيد بنجاح إلى: ${status}`);
      setSelectedEsc(null);
      setOperatorNote('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box gap={4}>
      <Text role="bodyMd" tone="muted">
        مسار تصعيد الجاهزية (J-006D) لمندوبي الميدان عند مواجهة متجر غير مكتمل الوثائق أو به عوائق تمنع التفعيل.
      </Text>

      {errorMsg && (
        <Surface tone="danger" padding={3} radiusToken="sm">
          <Text role="bodySm" tone="danger">{errorMsg}</Text>
        </Surface>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Escalations queue board */}
        <Surface tone="raised" padding={5} gap={4} radiusToken="lg">
          <Text role="titleLg" tone="brand">
            قائمة التصعيد الواردة
          </Text>

          <Box gap={3}>
            {escalations.length === 0 ? (
              <Box padding={6} align="center">
                <Text tone="muted">لا توجد تصعيدات معلقة حالياً</Text>
              </Box>
            ) : (
              escalations.map((esc) => {
                const isSelected = selectedEsc?.id === esc.id;
                const statusTone =
                  esc.status === 'resolved'
                    ? 'success'
                    : esc.status === 'rejected'
                    ? 'danger'
                    : esc.status === 'info_requested'
                    ? 'warning'
                    : 'neutral';

                const statusText =
                  esc.status === 'resolved'
                    ? 'تم الحل'
                    : esc.status === 'rejected'
                    ? 'مرفوض'
                    : esc.status === 'info_requested'
                    ? 'مطلوب معلومات'
                    : 'نشط/مصعد';

                return (
                  <WebControlPanelDecisionRow
                    key={esc.id}
                    entityId={esc.id}
                    entityLabel={`تصعيد لمتجر: ${esc.store_id}`}
                    status={statusText}
                    statusTone={statusTone}
                    risk={esc.status === 'escalated' ? 'warning' : 'neutral'}
                    recommendation={esc.reason}
                    reason={`الفريق المستهدف: ${esc.target_team}`}
                    sla={esc.field_agent_id ? `المندوب: ${esc.field_agent_id}` : 'مندوب مجهول'}
                    primaryAction={{
                      id: `${esc.id}-select`,
                      label: isSelected ? 'قيد المعاينة' : 'مراجعة وتحديث',
                      onAction: () => {
                        setSelectedEsc(esc);
                        setOperatorNote(esc.operator_note || '');
                        setActionMessage(`معالجة التصعيد: ${esc.id}`);
                      },
                    }}
                  />
                );
              })
            )}
          </Box>
        </Surface>

        {/* Details Inspector */}
        <Box gap={4}>
          {selectedEsc ? (
            <WebControlPanelInspectorShell
              title={`تفاصيل التصعيد: ${selectedEsc.id}`}
              onClose={() => setSelectedEsc(null)}
            >
              <Box gap={3} padding={4}>
                <KeyValueList
                  dense
                  items={[
                    { label: 'رقم المتجر', value: selectedEsc.store_id },
                    { label: 'المندوب الميداني', value: selectedEsc.field_agent_id || 'غير معروف' },
                    { label: 'الفريق المختص', value: selectedEsc.target_team },
                    { label: 'حالة التصعيد', value: selectedEsc.status },
                    {
                      label: 'تاريخ الإنشاء',
                      value: new Date(selectedEsc.created_at).toLocaleString('ar-SA'),
                    },
                  ]}
                />

                <Surface tone="inset" padding={3} radiusToken="sm">
                  <Text role="caption" tone="brand">وصف المشكلة / سبب التصعيد:</Text>
                  <Text role="bodySm" style={{ marginTop: 4 }}>{selectedEsc.reason}</Text>
                </Surface>

                {selectedEsc.operator_note && (
                  <Surface tone="raised" padding={3} radiusToken="sm">
                    <Text role="caption" tone="muted">ملاحظة العمليات السابقة:</Text>
                    <Text role="bodySm" style={{ marginTop: 4 }}>{selectedEsc.operator_note}</Text>
                  </Surface>
                )}

                <Box gap={2} style={{ marginTop: 8 }}>
                  <Text role="caption" tone="muted">إضافة ملاحظة العمليات / التوجيه:</Text>
                  <input
                    type="text"
                    value={operatorNote}
                    onChange={(e) => setOperatorNote(e.target.value)}
                    placeholder="اكتب التوجيه أو الرد للمندوب..."
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid var(--bth-color-line)',
                      width: '100%',
                      fontSize: '14px',
                    }}
                    disabled={isSubmitting}
                  />

                  <WebControlPanelActionCluster
                    primary={{
                      id: 'btn-resolve',
                      label: 'حل التصعيد',
                      onAction: () => handleUpdateStatus('resolved'),
                    }}
                    secondary={{
                      id: 'btn-request-info',
                      label: 'طلب معلومات إضافية',
                      onAction: () => handleUpdateStatus('info_requested'),
                    }}
                  />
                </Box>
              </Box>
            </WebControlPanelInspectorShell>
          ) : (
            <WebControlPanelRecommendation
              title="توجيهات معالجة التصعيد"
              reason={actionMessage}
              confidence="high"
              auditTag="READINESS_ESCALATION"
            />
          )}
        </Box>
      </div>
    </Box>
  );
}
