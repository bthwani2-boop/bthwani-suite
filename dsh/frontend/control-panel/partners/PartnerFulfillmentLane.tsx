'use client';

import React from 'react';
import { Box, Text, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelKpiStrip } from '@bthwani/ui-kit/web';
import { PARTNER_FULFILLMENT_AGREEMENTS } from './workflow';
import type { DshPartnerModeAgreement } from './workflow';

export type PartnerFulfillmentLaneProps = {
  state?: 'ready' | 'loading' | 'error';
  onRetry?: () => void;
};

function readinessLabel(readiness: DshPartnerModeAgreement['operationalReadiness']): string {
  if (readiness === 'ready') return 'جاهز';
  if (readiness === 'pending') return 'قيد التفعيل';
  return 'غير مفعّل';
}

function ModeAgreementRow({ agreement }: { agreement: DshPartnerModeAgreement }) {
  const { theme } = useTheme();
  const readinessColor = agreement.operationalReadiness === 'ready'
    ? theme.success
    : agreement.operationalReadiness === 'pending'
      ? theme.warning
      : theme.textMuted;
  const readinessBg = agreement.operationalReadiness === 'ready'
    ? theme.successSurface
    : agreement.operationalReadiness === 'pending'
      ? theme.warningSurface
      : theme.surfaceInset;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px', borderRadius: '10px',
      background: agreement.enabled ? theme.surfaceRaised : theme.surfaceInset,
      border: `1px solid ${agreement.enabled ? theme.line : theme.surfaceInset}`,
      gap: '8px', flexWrap: 'wrap', opacity: agreement.enabled ? 1 : 0.55,
      direction: 'rtl',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: '120px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: theme.text }}>{agreement.modeLabel}</span>
        {agreement.negotiationNote && (
          <span style={{ fontSize: '11px', color: theme.textMuted }}>{agreement.negotiationNote}</span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'center', minWidth: '80px' }}>
        <span style={{ fontSize: '10px', color: theme.textMuted }}>العمولة</span>
        <span style={{ fontSize: '11px', fontWeight: 700, color: theme.brand, background: theme.brandSurface, padding: '2px 8px', borderRadius: '6px' }}>
          {agreement.commissionRatePreview}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'center', minWidth: '80px' }}>
        <span style={{ fontSize: '10px', color: theme.textMuted }}>أساس التسوية</span>
        <span style={{ fontSize: '11px', color: theme.text }}>{agreement.settlementBasis}</span>
      </div>

      <span style={{
        fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px',
        color: readinessColor, background: readinessBg,
      }}>
        {readinessLabel(agreement.operationalReadiness)}
      </span>

      <span style={{
        fontSize: '11px', padding: '2px 8px', borderRadius: '6px',
        background: agreement.enabled ? theme.successSurface : theme.surfaceInset,
        color: agreement.enabled ? theme.success : theme.textMuted, fontWeight: 700,
      }}>
        {agreement.enabled ? 'مفعّل' : 'معطّل'}
      </span>
    </div>
  );
}

export function PartnerFulfillmentLane({ state = 'ready', onRetry }: PartnerFulfillmentLaneProps) {
  const { theme } = useTheme();

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
        <Text role="titleSm" style={{ color: theme.danger }}>تعذر تحميل اتفاقيات التنفيذ</Text>
        <button type="button" onClick={onRetry} style={{ padding: '8px 16px', borderRadius: '8px', border: `1px solid ${theme.danger}`, color: theme.danger, background: 'transparent', cursor: 'pointer' }}>
          إعادة المحاولة
        </button>
      </Box>
    );
  }

  const totalEnabled = PARTNER_FULFILLMENT_AGREEMENTS.flatMap((p) => p.modes).filter((m) => m.enabled).length;
  const totalPending = PARTNER_FULFILLMENT_AGREEMENTS.flatMap((p) => p.modes).filter((m) => m.operationalReadiness === 'pending').length;
  const totalDisabled = PARTNER_FULFILLMENT_AGREEMENTS.flatMap((p) => p.modes).filter((m) => !m.enabled).length;

  return (
    <Box gap={6} style={{ direction: 'rtl' }}>
      <Box layoutDirection="row" justify="space-between" align="center">
        <Box gap={1}>
          <Text role="caption" style={{ color: theme.brand, fontWeight: '800' }}>اتفاقيات أوضاع التنفيذ</Text>
          <Text role="titleLg" style={{ fontSize: 24, fontWeight: '900', color: theme.brandHeaderBackground }}>الأوضاع والعمولات — لكل شريك</Text>
        </Box>
      </Box>

      {/* UI_PREVIEW_ONLY watermark */}
      <div style={{ background: theme.warningSurface, border: `1px solid ${theme.warning}`, borderRadius: '10px', padding: '10px 14px', direction: 'rtl' }}>
        <Text role="caption" style={{ color: theme.warning, fontWeight: '700' }}>
          UI_PREVIEW_ONLY — أرقام العمولة والتسوية معروضة للوضوح التشغيلي فقط. WLT هو المالك الحقيقي لكل أرقام العمولات والتسويات.
        </Text>
      </div>

      <WebControlPanelKpiStrip items={[
        { id: 'enabled', label: 'أوضاع مفعّلة', value: String(totalEnabled), tone: 'success' },
        { id: 'pending', label: 'قيد التفعيل', value: String(totalPending), tone: 'warning' },
        { id: 'disabled', label: 'معطّلة', value: String(totalDisabled), tone: 'neutral' },
        { id: 'partners', label: 'الشركاء', value: String(PARTNER_FULFILLMENT_AGREEMENTS.length), tone: 'neutral' },
      ]} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {PARTNER_FULFILLMENT_AGREEMENTS.map((partner) => (
          <div key={partner.partnerId} style={{ border: `1px solid ${theme.line}`, borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ background: theme.surfaceInset, padding: '12px 16px', borderBottom: `1px solid ${theme.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: theme.text }}>{partner.storeName}</span>
                <span style={{ fontSize: '11px', color: theme.textMuted }}>{partner.categoryLabel}</span>
              </div>
              <span style={{ fontSize: '11px', color: theme.textMuted, background: theme.surface, padding: '2px 8px', borderRadius: '6px', fontFamily: 'monospace', direction: 'ltr' }}>{partner.partnerId}</span>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {partner.modes.map((mode) => (
                <ModeAgreementRow key={mode.mode} agreement={mode} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
}

export default PartnerFulfillmentLane;
