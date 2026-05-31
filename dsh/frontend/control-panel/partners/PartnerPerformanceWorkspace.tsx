'use client';

import React from 'react';
import { Box, Text, useTheme, Surface, KeyValueList, TextField } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelRecommendation,
  WebControlPanelStatusTag,
  WebControlPanelActionCluster,
} from '@bthwani/ui-kit/web';
import { PARTNER_FULFILLMENT_AGREEMENTS, getPartnerDisputes, updatePartnerDisputeStatus } from './workflow';
import {
  PARTNER_PERFORMANCE_METRICS,
  PARTNER_VISIBILITY_TIMELINE_DATA,
  type PartnerDispute,
} from '../../data/partner.preview-data';
import styles from '../shared/control-panel-surface.module.css';

function parseKpiPercent(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

export type PartnerPerformanceWorkspaceProps = {
  activeSubTab: string;
};

// ─── Sub-screen 1: الأداء التشغيلي والسعة ────────────────────────────────────

function PartnerOperationalPerformanceTab() {
  const [selectedPartnerId, setSelectedPartnerId] = React.useState<string | null>(null);

  const selectedPerf = selectedPartnerId
    ? PARTNER_PERFORMANCE_METRICS.find(p => p.id === selectedPartnerId)
    : null;
  const selectedPartner = selectedPartnerId
    ? PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === selectedPartnerId)
    : null;

  return (
    <div className={styles.surfaceSplitGrid}>
      <Surface tone="raised" padding={5} gap={4} radiusToken="lg">
        <Text role="titleLg" tone="brand">
          الأداء التشغيلي والسعة
        </Text>
        <Box gap={3}>
          {PARTNER_PERFORMANCE_METRICS.map((perf) => {
            const partner = PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === perf.id);
            if (!partner) return null;
            const isSelected = selectedPartnerId === perf.id;

            return (
              <WebControlPanelDecisionRow
                key={perf.id}
                entityId={perf.id}
                entityLabel={partner.storeName}
                status={perf.capacity}
                statusTone={perf.capacity === 'مستقر' ? 'success' : 'danger'}
                risk={perf.compliance === 'high' ? 'neutral' : perf.compliance === 'medium' ? 'warning' : 'danger'}
                recommendation={`التسليم: ${perf.kpis.onTime} · الإلغاء: ${perf.kpis.cancelRate}`}
                reason={`التقييم: ${perf.kpis.rating}`}
                sla={`نزاعات مفتوحة: ${perf.disputes}`}
                primaryAction={{
                  id: `view-${perf.id}`,
                  label: isSelected ? 'معاينة الأداء' : 'التفاصيل',
                  onAction: () => setSelectedPartnerId(perf.id),
                }}
              />
            );
          })}
        </Box>
      </Surface>

      <Box gap={4}>
        {selectedPerf && selectedPartner ? (
          <Surface tone="inset" padding={4} gap={3} radiusToken="md">
            <Text role="titleSm" tone="brand">
              مؤشرات: {selectedPartner.storeName}
            </Text>
            <KeyValueList
              dense
              items={[
                {
                  label: 'نسبة التسليم في الوقت',
                  value: selectedPerf.kpis.onTime,
                  tone: parseKpiPercent(selectedPerf.kpis.onTime) >= 90 ? 'success' : 'danger',
                },
                {
                  label: 'معدل الإلغاء',
                  value: selectedPerf.kpis.cancelRate,
                  tone: parseKpiPercent(selectedPerf.kpis.cancelRate) <= 1.0 ? 'success' : 'danger',
                },
                { label: 'تقييم العملاء', value: selectedPerf.kpis.rating, tone: 'default' },
                {
                  label: 'السعة الحالية',
                  value: selectedPerf.capacity,
                  tone: selectedPerf.capacity === 'مستقر' ? 'success' : 'warning',
                },
              ]}
            />
            <WebControlPanelRecommendation
              title="توجيه السعة"
              reason={
                selectedPerf.capacity === 'مستقر'
                  ? 'أداء الشريك مستقر ولا يتطلب تدخلاً.'
                  : 'الضغط مرتفع، يوصى بالحد من تدفق الطلبات مؤقتاً.'
              }
              confidence="high"
              auditTag="UI_PREVIEW_ONLY"
            />
          </Surface>
        ) : (
          <WebControlPanelRecommendation
            title="مراقبة السعة"
            reason="اختر شريكاً من القائمة لعرض تفاصيل مؤشرات الأداء الخاصة به واتخاذ الإجراءات الاستباقية."
            confidence="high"
            auditTag="UI_PREVIEW_ONLY"
          />
        )}
      </Box>
    </div>
  );
}

// ─── Sub-screen 2: النزاعات المفتوحة والاستئناف ───────────────────────────────

function PartnerDisputesTab() {
  const [disputes, setDisputes] = React.useState<PartnerDispute[]>([]);
  const [selectedDisputeId, setSelectedDisputeId] = React.useState<string | null>(null);
  const [disputeNote, setDisputeNote] = React.useState('');

  React.useEffect(() => {
    setDisputes(getPartnerDisputes());
  }, []);

  const selectedDispute = disputes.find(d => d.id === selectedDisputeId);
  const selectedDisputePartner = selectedDispute
    ? PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === selectedDispute.partnerId)
    : null;

  const openCount = disputes.filter(d => d.status === 'مفتوح' || d.status === 'قيد المراجعة').length;

  const handleDisputeAction = (id: string, newStatus: string) => {
    updatePartnerDisputeStatus(id, newStatus, disputeNote.trim() || undefined);
    setDisputes(getPartnerDisputes());
    setDisputeNote('');
    if (newStatus !== 'قيد المراجعة') {
      setSelectedDisputeId(null);
    }
  };


  return (
    <div className={styles.surfaceSplitGrid}>
      <Surface tone="raised" padding={5} gap={4} radiusToken="lg">
        <Box layoutDirection="row" justify="space-between" align="center">
          <Text role="titleLg" tone="brand">
            النزاعات المفتوحة والاستئناف
          </Text>
          <WebControlPanelStatusTag
            label={`${openCount} نزاعات حالية`}
            tone={openCount > 0 ? 'warning' : 'neutral'}
          />
        </Box>
        <Box gap={3}>
          {openCount === 0 ? (
            <Surface padding={8} align="center" tone="inset" radiusToken="md">
              <Text tone="muted">لا توجد نزاعات مفتوحة حالياً.</Text>
            </Surface>
          ) : (
            disputes.filter(d => d.status !== 'مغلق').map((dispute) => {
              const partner = PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === dispute.partnerId);
              const isSelected = selectedDisputeId === dispute.id;
              return (
                <WebControlPanelDecisionRow
                  key={dispute.id}
                  entityId={dispute.id}
                  entityLabel={`${partner?.storeName ?? 'غير معروف'} · ${dispute.type}`}
                  status={dispute.status}
                  statusTone={dispute.status === 'مفتوح' ? 'danger' : 'warning'}
                  risk="danger"
                  recommendation={`تم الرفع: ${dispute.date}`}
                  reason="توجيه: يحتاج استجابة من قسم الشركاء للتحقق من الأدلة."
                  sla={dispute.sla}
                  primaryAction={{
                    id: `process-${dispute.id}`,
                    label: isSelected ? 'قيد المعالجة' : 'فتح النزاع لمعالجته',
                    onAction: () => {
                      setSelectedDisputeId(dispute.id);
                      if (dispute.status === 'مفتوح') {
                        handleDisputeAction(dispute.id, 'قيد المراجعة');
                      }
                    },
                  }}
                />
              );
            })
          )}
        </Box>
      </Surface>

      <Box gap={4}>
        {selectedDispute && selectedDisputePartner ? (
          <Surface tone="inset" padding={4} gap={3} radiusToken="md">
            <Box layoutDirection="row" justify="space-between" align="center">
              <Text role="titleSm" tone="brand">
                تفاصيل النزاع
              </Text>
              <WebControlPanelStatusTag
                label={selectedDispute.type}
                tone={selectedDispute.status === 'مفتوح' ? 'danger' : 'warning'}
              />
            </Box>

            <Surface padding={3} tone="default" radiusToken="sm" border borderTone="line">
              <Text role="caption" tone="muted">الشريك:</Text>
              <Text role="bodySm" tone="default">
                {selectedDisputePartner.storeName}
              </Text>
              <Box style={{ marginVertical: 8 }} />
              <Text role="caption" tone="muted">تاريخ الرفع:</Text>
              <Text role="bodySm" tone="default">
                {selectedDispute.date}
              </Text>
              <Box style={{ marginVertical: 8 }} />
              <Text role="caption" tone="muted">SLA:</Text>
              <Text role="bodySm" tone="warning">
                {selectedDispute.sla}
              </Text>
            </Surface>

            <Box gap={2} style={{ marginVertical: 8 }}>
              <TextField
                label="ملاحظات وتوجيهات حل النزاع (تُحفظ في سجل التدقيق)"
                value={disputeNote}
                onChangeText={setDisputeNote}
                placeholder="اكتب تفاصيل القرار وأدلة التسوية هنا..."
              />
            </Box>

            <WebControlPanelRecommendation
              title="توجيه معالجة النزاع"
              reason="يحتاج استجابة من قسم الشركاء للتحقق من الأدلة والتواصل مع الطرفين قبل إغلاق النزاع."
              confidence="high"
              auditTag="UI_PREVIEW_ONLY"
            />

            <Box style={{ marginVertical: 8 }}>
              <WebControlPanelActionCluster
                primary={{
                  id: 'close-dispute',
                  label: 'إغلاق النزاع',
                  onAction: () => handleDisputeAction(selectedDispute.id, 'مغلق')
                }}
              />
            </Box>
          </Surface>
        ) : (
          <WebControlPanelRecommendation
            title="معالجة النزاعات"
            reason="اختر نزاعاً من القائمة لاستعراض تفاصيله وإدارة مساره ضمن مسار الامتثال المتخصص للشركاء."
            confidence="high"
            auditTag="UI_PREVIEW_ONLY"
          />
        )}
      </Box>
    </div>
  );
}

// ─── Sub-screen 3: الظهور والإيقاف ────────────────────────────────────────────

function PartnerVisibilityTab() {
  const [selectedPartnerId, setSelectedPartnerId] = React.useState<string | null>(null);

  const timelineEvents = selectedPartnerId
    ? PARTNER_VISIBILITY_TIMELINE_DATA.filter(e => e.partnerId === selectedPartnerId)
    : [];
  const selectedPartner = selectedPartnerId
    ? PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === selectedPartnerId)
    : null;

  return (
    <div className={styles.surfaceSplitGrid} dir="rtl">
      <Surface tone="raised" padding={5} gap={4} radiusToken="lg">
        <Text role="titleLg" tone="brand">
          الظهور والإيقاف
        </Text>
        <Box gap={3}>
          {PARTNER_PERFORMANCE_METRICS.map((perf) => {
            const partner = PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === perf.id);
            if (!partner) return null;
            const isSelected = selectedPartnerId === perf.id;

            const partnerEvents = PARTNER_VISIBILITY_TIMELINE_DATA.filter(e => e.partnerId === perf.id);
            const latestEvent = partnerEvents[partnerEvents.length - 1];
            const isVisible = latestEvent?.eventType === 'activated';

            return (
              <WebControlPanelDecisionRow
                key={perf.id}
                entityId={perf.id}
                entityLabel={partner.storeName}
                status={isVisible ? 'ظاهر' : 'مخفي'}
                statusTone={isVisible ? 'success' : 'danger'}
                risk={isVisible ? 'neutral' : 'warning'}
                recommendation={latestEvent ? `آخر تحديث: ${latestEvent.date}` : 'لا يوجد سجل'}
                reason={latestEvent?.reason ?? '—'}
                sla="سجل الظهور"
                primaryAction={{
                  id: `timeline-${perf.id}`,
                  label: isSelected ? 'معاينة الخط الزمني' : 'الخط الزمني',
                  onAction: () => setSelectedPartnerId(perf.id),
                }}
              />
            );
          })}
        </Box>
      </Surface>

      <Box gap={4}>
        {selectedPartner ? (
          <Surface tone="inset" padding={4} gap={4} radiusToken="md">
            <Box layoutDirection="row" justify="space-between" align="center">
              <Text role="titleSm" tone="brand">
                تاريخ ظهور: {selectedPartner.storeName}
              </Text>
              <WebControlPanelStatusTag label={`${timelineEvents.length} أحداث`} tone="neutral" />
            </Box>

            {timelineEvents.length === 0 ? (
              <Text tone="muted">لا يوجد سجل أحداث متاح.</Text>
            ) : (
              <Box gap={4}>
                {timelineEvents.map((event) => {
                  const isActivation = event.eventType === 'activated';
                  return (
                    <Box key={event.id} layoutDirection="row" gap={3}>
                      <Surface
                        tone={isActivation ? 'success' : 'danger'}
                        padding={3}
                        radiusToken="md"
                        gap={1}
                      >
                         <Box layoutDirection="row" justify="space-between">
                          <Text role="caption" tone={isActivation ? 'success' : 'danger'}>
                            {isActivation ? 'تفعيل المتجر' : 'إيقاف مؤقت'}
                          </Text>
                          <Text role="caption" tone="muted">
                            {event.date}
                          </Text>
                        </Box>
                        <Text role="bodySm">{event.reason}</Text>
                        <Box style={{ marginVertical: 4 }} />
                        <Text role="caption" tone="muted">
                          بواسطة: {event.actionBy}
                        </Text>
                      </Surface>
                    </Box>
                  );
                })}
              </Box>
            )}

            <WebControlPanelRecommendation
              title="متابعة الظهور"
              reason="هذا السجل يمثل الأحداث التاريخية لإيقاف وتفعيل المتجر. لمزيد من الإجراءات، انتقل لمساحة إدارة التفعيل."
              confidence="high"
              auditTag="UI_PREVIEW_ONLY"
            />
          </Surface>
        ) : (
          <WebControlPanelRecommendation
            title="سجل الظهور"
            reason="اختر شريكاً من القائمة الجانبية لاستعراض الخط الزمني التاريخي للظهور والإخفاء على المنصة."
            confidence="high"
            auditTag="UI_PREVIEW_ONLY"
          />
        )}
      </Box>
    </div>
  );
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

export function PartnerPerformanceWorkspace({ activeSubTab }: PartnerPerformanceWorkspaceProps) {
  switch (activeSubTab) {
    case 'performance':
      return <PartnerOperationalPerformanceTab />;
    case 'disputes':
      return <PartnerDisputesTab />;
    case 'visibility':
      return <PartnerVisibilityTab />;
    default:
      return <PartnerOperationalPerformanceTab />;
  }
}

export default PartnerPerformanceWorkspace;
