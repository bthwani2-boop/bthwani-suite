'use client';

import React from 'react';
import { Box, Text, Surface } from '@bthwani/ui-kit';
import {
  WebControlPanelKpiStrip,
  WebControlPanelActionCluster,
  WebControlPanelRecommendation,
  WebControlPanelDecisionRow
} from '@bthwani/ui-kit/web';
import { PARTNER_FULFILLMENT_AGREEMENTS } from './workflow';
import type { DshPartnerModeAgreement } from './workflow';
import styles from '../shared/control-panel-surface.module.css';

export type PartnerFulfillmentLaneProps = {
  state?: 'ready' | 'loading' | 'error';
  onRetry?: () => void;
};

function readinessLabel(readiness: DshPartnerModeAgreement['operationalReadiness']): string {
  if (readiness === 'ready') return 'جاهز للعمليات';
  if (readiness === 'pending') return 'قيد التفعيل';
  return 'غير مفعّل';
}

function ModeAgreementRow({ agreement }: { agreement: DshPartnerModeAgreement }) {
  const isEnabled = agreement.enabled;

  return (
    <WebControlPanelDecisionRow
      entityId={agreement.mode}
      entityLabel={agreement.modeLabel}
      status={isEnabled ? 'مفعّل ومباشر' : 'معطّل'}
      statusTone={isEnabled ? 'success' : 'neutral'}
      risk={agreement.operationalReadiness === 'pending' ? 'warning' : 'neutral'}
      recommendation={`أساس التسوية: ${agreement.settlementBasis}`}
      reason={agreement.negotiationNote || 'تُدار الاتفاقية المالية بشكل مركزي ومؤتمت عبر محرك WLT.'}
      sla={`العمولة المرجعية: ${agreement.commissionRatePreview}`}
    />
  );
}

export function PartnerFulfillmentLane({ state = 'ready', onRetry }: PartnerFulfillmentLaneProps) {
  if (state === 'loading') {
    return (
      <Box padding={10} align="center">
        <Text role="titleSm">جارٍ تحميل اتفاقيات التنفيذ...</Text>
      </Box>
    );
  }

  if (state === 'error') {
    return (
      <Box padding={10} align="center" gap={4}>
        <Text role="titleSm" tone="danger">تعذر تحميل اتفاقيات التنفيذ</Text>
        <WebControlPanelActionCluster
          secondary={{
            id: 'retry',
            label: 'إعادة المحاولة',
            onAction: onRetry,
          }}
        />
      </Box>
    );
  }

  const totalEnabled = PARTNER_FULFILLMENT_AGREEMENTS.flatMap((p) => p.modes).filter((m) => m.enabled).length;
  const totalPending = PARTNER_FULFILLMENT_AGREEMENTS.flatMap((p) => p.modes).filter((m) => m.operationalReadiness === 'pending').length;
  const totalDisabled = PARTNER_FULFILLMENT_AGREEMENTS.flatMap((p) => p.modes).filter((m) => !m.enabled).length;

  return (
    <Box gap={6}>
      <WebControlPanelRecommendation
        title="مرجع الأرقام التشغيلية والمالية"
        reason="أرقام العمولة والتسوية المعروضة هنا مخصصة للوضوح التشغيلي فقط. نظام WLT المالي هو المالك الحقيقي والمرجع النهائي لجميع أرقام العمولات والتسويات، ولا توجد سلطة إدارية لتعديلها من هذه الشاشة."
        confidence="high"
        auditTag="UI_PREVIEW_ONLY"
      />

      <Surface tone="raised" padding={5} gap={5} radiusToken="lg">
        <Box gap={1}>
          <Text role="titleLg" tone="brand">الأوضاع والعمولات — لكل شريك</Text>
          <Text role="caption" tone="muted">اتفاقيات أوضاع التنفيذ وإدارة مسارات التوصيل والاستلام</Text>
        </Box>

        <WebControlPanelKpiStrip items={[
          { id: 'enabled', label: 'أوضاع مفعّلة', value: String(totalEnabled), tone: 'success' },
          { id: 'pending', label: 'قيد المراجعة', value: String(totalPending), tone: 'warning' },
          { id: 'disabled', label: 'معطّلة', value: String(totalDisabled), tone: 'danger' },
          { id: 'partners', label: 'إجمالي الشركاء', value: String(PARTNER_FULFILLMENT_AGREEMENTS.length), tone: 'neutral' },
        ]} />

        <Box gap={5}>
          {PARTNER_FULFILLMENT_AGREEMENTS.map((partner) => (
            <Surface key={partner.partnerId} radiusToken="lg" border borderTone="line">
              <Surface tone="inset" padding={4} border borderTone="line" layoutDirection="row" align="center" style={{ justifyContent: 'space-between' }}>
                <Box gap={1}>
                  <Text role="titleSm" tone="default">{partner.storeName}</Text>
                  <Text role="caption" tone="muted">{partner.categoryLabel}</Text>
                </Box>
                <Surface padding={2} radiusToken="sm" border borderTone="line">
                  <Text role="caption" tone="muted">{partner.partnerId}</Text>
                </Surface>
              </Surface>
              <Box padding={4} gap={3}>
                {partner.modes.map((mode) => (
                  <ModeAgreementRow key={mode.mode} agreement={mode} />
                ))}
              </Box>
            </Surface>
          ))}
        </Box>
      </Surface>
    </Box>
  );
}

export default PartnerFulfillmentLane;
