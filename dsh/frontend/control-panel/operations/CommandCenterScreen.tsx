'use client';

// P0-10: Command Center — monitoring cockpit only.
// Reads summaries from lifecycle, signal, and service-health models.
// No full order details loaded here — details open on explicit action only.
// WLT finance alerts are read-only display; no mutation inside DSH.

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelKpiStrip,
  WebControlPanelRecommendation,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import { getDshControlPanelGovernanceEntry } from '../shared/dsh-control-panel-governance.map';
import {
  OPERATIONS_PULSE_METRICS,
  DSH_SERVICE_HEALTH_PREVIEW,
  DSH_WLT_FINANCE_ALERTS_PREVIEW,
} from './operations.preview-data';
import { buildOperationsHref } from './operations.registry';
import styles from '../shared/control-panel-surface.module.css';
import { getDshSignalSummaries, getDshSignalEventLabel, getDshSignalEventTone } from '../../shared/dsh-signal-layer.model';

export type CommandCenterScreenProps = { hubHref: string; subGroup?: string; };

// Cockpit tone map — maps preview-data tone strings to ui-kit allowed values
const PULSE_TONE_MAP: Record<string, 'neutral' | 'success' | 'warning' | 'danger'> = {
  brand:   'neutral',
  best:    'success',
  warning: 'warning',
  danger:  'danger',
  neutral: 'neutral',
  success: 'success',
};

// Top system recommendations — cockpit summary refs, not new source-of-truth.
// Each href routes to the owning workspace via buildOperationsHref.
const TOP_SUGGESTIONS = [
  {
    id: 'sug-1',
    label: 'تكدس شمال الرياض — فعّل الحافز فورًا',
    reason: '45 طلب بدون كابتن في منطقة الشمال',
    confidence: 'high' as const,
    action: 'فتح المناطق',
    workspace: 'area-capacity' as const,
    risk: 'critical' as const,
  },
  {
    id: 'sug-2',
    label: '32 طلب بدون إسناد — تدخّل الآن',
    reason: 'قائمة الإسناد تتراكم وكباتن متاحون غير مستغلين',
    confidence: 'high' as const,
    action: 'فتح الإسناد',
    workspace: 'dispatch-assignment' as const,
    risk: 'high' as const,
  },
  {
    id: 'sug-3',
    label: '12 استثناء مفتوح — راجع قائمة الإسناد',
    reason: 'استثناءات بدون مالك تزيد من خطر خرق SLA',
    confidence: 'medium' as const,
    action: 'فتح الاستثناءات',
    workspace: 'exceptions-escalations' as const,
    risk: 'medium' as const,
  },
] as const;

// Quick actions — direct workspace shortcuts with explicit route via buildOperationsHref.
const QUICK_ACTIONS = [
  { id: 'QA-1', label: 'إعادة إسناد 12 طلب متأخر', time: 'منذ 5 دقائق', workspace: 'dispatch-assignment' as const },
  { id: 'QA-2', label: 'تواصل مع المتجر رقم 402', time: 'منذ 12 دقيقة', workspace: 'partner-stores' as const },
  { id: 'QA-3', label: 'تصعيد شكوى عميل (تأخير)', time: 'منذ 18 دقيقة', workspace: 'audit-support-sla' as const },
] as const;

// Signal summaries — lean, loaded once at module level.
// Details open only on explicit action via routeId → onDemandDetailPolicy.
const OPS_SIGNAL_SUMMARIES = getDshSignalSummaries('control-panel', 'ops');
const OPS_URGENT_SIGNALS = OPS_SIGNAL_SUMMARIES
  .filter((s) => s.priority === 'urgent' && s.readState === 'unread')
  .slice(0, 3);

export function CommandCenterScreen({ hubHref, subGroup: _subGroup }: CommandCenterScreenProps) {
  const router = useRouter();
  const operationsGovernance = getDshControlPanelGovernanceEntry('operations');
  const supportGovernance = getDshControlPanelGovernanceEntry('support');
  const financeGovernance = getDshControlPanelGovernanceEntry('finance');

  const pulseKpiItems = OPERATIONS_PULSE_METRICS.map((m) => ({
    id: m.id,
    label: m.title,
    value: m.value,
    tone: PULSE_TONE_MAP[m.tone] ?? 'neutral' as const,
  }));

  return (
    <div className={styles.surfaceCockpitContent}>
      {/* ── Header ── */}
      <div className={styles.surfaceSectionHeader}>
        <h2 className={styles.surfaceSectionTitle}>نبض العمليات</h2>
        <p className={styles.surfaceSectionSubtitle}>مراقبة الأداء — التدخلات السريعة — توجيه القرار</p>
      </div>

      {/* ── Pulse KPI strip — aggregate metrics, no order detail ── */}
      <WebControlPanelKpiStrip items={pulseKpiItems} />

      <div className={styles.surfaceGridTwoCol}>

        {/* 1. Decision routing map — governance-sourced ownership boundaries */}
        <div className={styles.surfaceCompactPanel}>
          <h3 className={styles.surfacePanelTitle}>خريطة القرار السريع</h3>
          <div className={styles.surfaceStackSmall}>
            <WebControlPanelDecisionRow
              entityId="OPS"
              entityLabel="التنفيذ الحي"
              status="المالك"
              statusTone="neutral"
              recommendation="ابقَ داخل العمليات"
              reason={operationsGovernance.notes}
              sla="إسناد، ضغط، live orders"
              primaryAction={{
                id: 'go-live-orders',
                label: 'الطلبات الحية',
                onAction: () => router.push(buildOperationsHref('live-orders')),
              }}
            />
            <WebControlPanelDecisionRow
              entityId="SUP"
              entityLabel="التذاكر والتصعيد"
              status="حوّل"
              statusTone="warning"
              recommendation="حوّل إلى الدعم"
              reason={supportGovernance.notes}
              sla="tickets, messaging, follow-up"
              primaryAction={{ id: 'go-support', label: 'فتح الدعم', onAction: () => router.push('/support') }}
            />
            <WebControlPanelDecisionRow
              entityId="FIN"
              entityLabel="الأثر المالي"
              status="WLT"
              statusTone="warning"
              recommendation="حوّل إلى WLT — عرض فقط"
              reason={financeGovernance.notes}
              sla="preview-only — لا mutation داخل DSH"
              primaryAction={{ id: 'go-finance', label: 'فتح المالية', onAction: () => router.push('/finance') }}
            />
          </div>
        </div>

        {/* 2. Top system recommendations — cockpit refs to owning workspaces */}
        <div className={styles.surfaceCompactPanel}>
          <h3 className={styles.surfacePanelTitle}>أعلى توصيات النظام الآن</h3>
          <div className={styles.surfaceStackSmall}>
            {TOP_SUGGESTIONS.map((s) => (
              <WebControlPanelRecommendation
                key={s.id}
                title={s.label}
                reason={s.reason}
                confidence={s.confidence}
                auditTag={s.risk === 'critical' ? 'خطر حرج' : undefined}
                primaryAction={{
                  id: `action-${s.id}`,
                  label: s.action,
                  onAction: () => router.push(buildOperationsHref(s.workspace)),
                }}
              />
            ))}
          </div>
        </div>

        {/* 3. Urgent quick actions */}
        <div className={styles.surfaceCompactPanel}>
          <h3 className={styles.surfacePanelTitle}>تدخل سريع مطلوب</h3>
          <div className={styles.surfaceStackSmall}>
            {QUICK_ACTIONS.map((action) => (
              <WebControlPanelDecisionRow
                key={action.id}
                entityId={action.id}
                entityLabel={action.label}
                sla={action.time}
                status="مطلوب"
                statusTone="warning"
                primaryAction={{
                  id: `go-${action.id}`,
                  label: 'انتقل',
                  onAction: () => router.push(buildOperationsHref(action.workspace)),
                }}
              />
            ))}
          </div>
        </div>

        {/* 4. Signal layer — urgent ops signals, summaries only */}
        {OPS_URGENT_SIGNALS.length > 0 ? (
          <div className={styles.surfaceCompactPanel}>
            <h3 className={styles.surfacePanelTitle}>إشارات النظام العاجلة</h3>
            <div className={styles.surfaceStackSmall}>
              {OPS_URGENT_SIGNALS.map((signal) => {
                const tone = getDshSignalEventTone(signal.kind);
                const statusTone = tone === 'danger' ? 'danger' as const
                  : tone === 'warning' ? 'warning' as const
                  : 'neutral' as const;
                return (
                  <WebControlPanelDecisionRow
                    key={signal.eventId}
                    entityId={signal.entityId}
                    entityLabel={getDshSignalEventLabel(signal.kind)}
                    status={signal.title}
                    statusTone={statusTone}
                    risk="danger"
                    recommendation={`الكيان: ${signal.entityId} · ${signal.emittedAt}`}
                    sla={signal.emittedAt}
                    primaryAction={{
                      id: `sig-${signal.eventId}`,
                      label: 'فتح التفاصيل',
                      onAction: () => router.push(`${hubHref}/${signal.routeId}`),
                    }}
                  />
                );
              })}
            </div>
          </div>
        ) : null}

        {/* 5. Service health — partner readiness, catalog blockers, serviceability, SLA */}
        {/* Summaries only — each item routes to its owning workspace */}
        <div className={styles.surfaceCompactPanel}>
          <h3 className={styles.surfacePanelTitle}>حالة الخدمة</h3>
          <div className={styles.surfaceStackSmall}>
            {DSH_SERVICE_HEALTH_PREVIEW.map((item) => (
              <WebControlPanelDecisionRow
                key={item.entityId}
                entityId={item.entityId}
                entityLabel={item.entityLabel}
                status={item.status}
                statusTone={item.statusTone}
                risk={item.statusTone === 'danger' ? 'danger' : item.statusTone === 'warning' ? 'warning' : 'neutral'}
                recommendation={`الطابور: ${item.ownerQueue} · ${item.onDemandDetailPolicy}`}
                reason={`الحالة: ${item.lifecycleState} · السطح: ${item.affectedSurface}`}
                sla={item.evidenceNeeded ? 'يتطلب إثباتاً' : '—'}
                primaryAction={{
                  id: `sh-primary-${item.entityId}`,
                  label: item.primaryAction,
                  onAction: () => {
                    if (item.routeHint.startsWith('?')) {
                      router.push(`${hubHref}${item.routeHint}`);
                    } else {
                      router.push(item.routeHint);
                    }
                  },
                }}
                secondaryAction={item.secondaryAction ? {
                  id: `sh-secondary-${item.entityId}`,
                  label: item.secondaryAction,
                  onAction: () => router.push(buildOperationsHref('geo-heatmap')),
                } : undefined}
              />
            ))}
          </div>
        </div>

        {/* 6. WLT finance alerts — read-only display, no mutation */}
        <div className={styles.surfaceCompactPanel}>
          <h3 className={styles.surfacePanelTitle}>تنبيهات WLT المالية</h3>
          <Box gap={1} paddingX={2} paddingY={1}>
            <Text role="caption" tone="muted">
              عرض فقط — لا approve/pay/settle داخل DSH. WLT يملك الحقيقة المالية.
            </Text>
          </Box>
          <div className={styles.surfaceStackSmall}>
            {DSH_WLT_FINANCE_ALERTS_PREVIEW.map((alert) => (
              <WebControlPanelDecisionRow
                key={alert.alertId}
                entityId={alert.alertId}
                entityLabel={alert.label}
                status={String(alert.count)}
                statusTone={alert.statusTone}
                recommendation={alert.wltBridgeNote}
                reason="WLT — قراءة فقط"
                sla={`نطاق: ${alert.domain}`}
                primaryAction={{
                  id: `wlt-${alert.alertId}`,
                  label: 'فتح المالية',
                  onAction: () => router.push(alert.routeHint),
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default CommandCenterScreen;
