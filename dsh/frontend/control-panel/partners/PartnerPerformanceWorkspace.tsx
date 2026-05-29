'use client';

import React from 'react';
import { Box, Text, useTheme, Surface, KeyValueList } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelRecommendation,
  WebControlPanelStatusTag,
} from '@bthwani/ui-kit/web';
import { PARTNER_FULFILLMENT_AGREEMENTS } from './workflow';

export type PartnerPerformanceWorkspaceProps = {
  activeSubTab: string;
};

import { PARTNER_PERFORMANCE_METRICS, PARTNER_DISPUTES_DATA, PARTNER_VISIBILITY_TIMELINE_DATA } from '../../data/partner.preview-data';

export function PartnerPerformanceWorkspace({ activeSubTab }: PartnerPerformanceWorkspaceProps) {
  const { theme } = useTheme();
  const [selectedPartnerId, setSelectedPartnerId] = React.useState<string | null>(null);

  const renderPerformanceTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
      <Surface tone="raised" padding={5} gap={4} style={{ borderRadius: '16px' }}>
        <Text role="titleLg" style={{ fontWeight: '900', color: theme.brandHeaderBackground }}>
          Ø§Ù„Ø£Ø¯Ø§Ø¡ Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠ ÙˆØ§Ù„Ø³Ø¹Ø©
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
                statusTone={perf.capacity === 'Ù…Ø³ØªÙ‚Ø±' ? 'success' : 'danger'}
                risk={perf.compliance === 'high' ? 'neutral' : perf.compliance === 'medium' ? 'warning' : 'danger'}
                recommendation={`Ø§Ù„ØªØ³Ù„ÙŠÙ…: ${perf.kpis.onTime} Â· Ø§Ù„Ø¥Ù„ØºØ§Ø¡: ${perf.kpis.cancelRate}`}
                reason={`Ø§Ù„ØªÙ‚ÙŠÙŠÙ…: ${perf.kpis.rating}`}
                sla={`Ù†Ø²Ø§Ø¹Ø§Øª Ù…ÙØªÙˆØ­Ø©: ${perf.disputes}`}
                primaryAction={{
                  id: `view-${perf.id}`,
                  label: isSelected ? 'Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„Ø£Ø¯Ø§Ø¡' : 'Ø§Ù„ØªÙØ§ØµÙŠÙ„',
                  onAction: () => setSelectedPartnerId(perf.id),
                }}
              />
            );
          })}
        </Box>
      </Surface>

      <Box gap={4}>
        {selectedPartnerId ? (() => {
          const perf = PARTNER_PERFORMANCE_METRICS.find(p => p.id === selectedPartnerId);
          const partner = PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === selectedPartnerId);
          if (!perf || !partner) return null;

          return (
            <Surface tone="inset" padding={4} gap={3} style={{ borderRadius: '12px' }}>
              <Text role="titleSm" style={{ fontWeight: '800', color: theme.brand }}>Ù…Ø¤Ø´Ø±Ø§Øª: {partner.storeName}</Text>
              <KeyValueList
                dense
                items={[
                  { label: 'Ù†Ø³Ø¨Ø© Ø§Ù„ØªØ³Ù„ÙŠÙ… ÙÙŠ Ø§Ù„ÙˆÙ‚Øª', value: perf.kpis.onTime, tone: parseFloat(perf.kpis.onTime) >= 90 ? 'success' : 'danger' },
                  { label: 'Ù…Ø¹Ø¯Ù„ Ø§Ù„Ø¥Ù„ØºØ§Ø¡', value: perf.kpis.cancelRate, tone: parseFloat(perf.kpis.cancelRate) <= 1.0 ? 'success' : 'danger' },
                  { label: 'ØªÙ‚ÙŠÙŠÙ… Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡', value: perf.kpis.rating, tone: 'default' },
                  { label: 'Ø§Ù„Ø³Ø¹Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ©', value: perf.capacity, tone: perf.capacity === 'Ù…Ø³ØªÙ‚Ø±' ? 'success' : 'warning' },
                ]}
              />
              <WebControlPanelRecommendation
                title="ØªÙˆØ¬ÙŠÙ‡ Ø§Ù„Ø³Ø¹Ø©"
                reason={perf.capacity === 'Ù…Ø³ØªÙ‚Ø±' ? 'Ø£Ø¯Ø§Ø¡ Ø§Ù„Ø´Ø±ÙŠÙƒ Ù…Ø³ØªÙ‚Ø± ÙˆÙ„Ø§ ÙŠØªØ·Ù„Ø¨ ØªØ¯Ø®Ù„Ø§Ù‹.' : 'Ø§Ù„Ø¶ØºØ· Ù…Ø±ØªÙØ¹ØŒ ÙŠÙˆØµÙ‰ Ø¨Ø§Ù„Ø­Ø¯ Ù…Ù† ØªØ¯ÙÙ‚ Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ù…Ø¤Ù‚ØªØ§Ù‹.'}
                confidence="high"
                auditTag="UI_PREVIEW_ONLY"
              />
            </Surface>
          );
        })() : (
          <WebControlPanelRecommendation
            title="Ù…Ø±Ø§Ù‚Ø¨Ø© Ø§Ù„Ø³Ø¹Ø©"
            reason="Ø§Ø®ØªØ± Ø´Ø±ÙŠÙƒØ§Ù‹ Ù…Ù† Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ù„Ø¹Ø±Ø¶ ØªÙØ§ØµÙŠÙ„ Ù…Ø¤Ø´Ø±Ø§Øª Ø§Ù„Ø£Ø¯Ø§Ø¡ Ø§Ù„Ø®Ø§ØµØ© Ø¨Ù‡ ÙˆØ§ØªØ®Ø§Ø° Ø§Ù„Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª Ø§Ù„Ø§Ø³ØªØ¨Ø§Ù‚ÙŠØ©."
            confidence="high"
            auditTag="UI_PREVIEW_ONLY"
          />
        )}
      </Box>
    </div>
  );

  const renderDisputesTab = () => (
    <Box gap={4}>
      <Surface tone="raised" padding={5} gap={4} style={{ borderRadius: '16px' }}>
        <Box layoutDirection="row" justify="space-between" align="center">
          <Text role="titleLg" style={{ fontWeight: '900', color: theme.brandHeaderBackground }}>
            Ø§Ù„Ù†Ø²Ø§Ø¹Ø§Øª Ø§Ù„Ù…ÙØªÙˆØ­Ø© ÙˆØ§Ù„Ø§Ø³ØªØ¦Ù†Ø§Ù
          </Text>
          <WebControlPanelStatusTag label={`${PARTNER_DISPUTES_DATA.length} Ù†Ø²Ø§Ø¹Ø§Øª Ø­Ø§Ù„ÙŠØ©`} tone="warning" />
        </Box>
        <Box gap={3}>
          {PARTNER_DISPUTES_DATA.length === 0 ? (
            <Box padding={8} align="center" style={{ backgroundColor: theme.surfaceInset, borderRadius: '12px' }}>
              <Text tone="muted">Ù„Ø§ ØªÙˆØ¬Ø¯ Ù†Ø²Ø§Ø¹Ø§Øª Ù…ÙØªÙˆØ­Ø© Ø­Ø§Ù„ÙŠØ§Ù‹.</Text>
            </Box>
          ) : (
            PARTNER_DISPUTES_DATA.map((dispute) => {
              const partner = PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === dispute.partnerId);
              return (
                <WebControlPanelDecisionRow
                  key={dispute.id}
                  entityId={dispute.id}
                  entityLabel={`${partner?.storeName ?? 'ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ'} Â· ${dispute.type}`}
                  status={dispute.status}
                  statusTone={dispute.status === 'Ù…ÙØªÙˆØ­' ? 'danger' : 'warning'}
                  risk="danger"
                  recommendation={`ØªÙ… Ø§Ù„Ø±ÙØ¹: ${dispute.date}`}
                  reason={`ØªÙˆØ¬ÙŠÙ‡: ÙŠØ­ØªØ§Ø¬ Ø§Ø³ØªØ¬Ø§Ø¨Ø© Ù…Ù† Ù‚Ø³Ù… Ø§Ù„Ø´Ø±ÙƒØ§Ø¡ Ù„Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ø£Ø¯Ù„Ø©.`}
                  sla={dispute.sla}
                  primaryAction={{ id: `process-${dispute.id}`, label: 'ÙØªØ­ Ø§Ù„Ù†Ø²Ø§Ø¹ Ù„Ù…Ø¹Ø§Ù„Ø¬ØªÙ‡', onAction: () => {} }}
                />
              );
            })
          )}
        </Box>
      </Surface>
    </Box>
  );

  const renderVisibilityTab = () => {
    const timelineEvents = selectedPartnerId
      ? PARTNER_VISIBILITY_TIMELINE_DATA.filter(e => e.partnerId === selectedPartnerId)
      : [];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start', direction: 'rtl' }}>
        {/* Partners List */}
        <Surface tone="raised" padding={5} gap={4} style={{ borderRadius: '16px' }}>
          <Text role="titleLg" style={{ fontWeight: '900', color: theme.brandHeaderBackground }}>
            Ø§Ù„Ø¸Ù‡ÙˆØ± ÙˆØ§Ù„Ø¥ÙŠÙ‚Ø§Ù
          </Text>
          <Box gap={3}>
            {PARTNER_PERFORMANCE_METRICS.map((perf) => {
              const partner = PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === perf.id);
              if (!partner) return null;
              const isSelected = selectedPartnerId === perf.id;

              // Get the latest event for this partner to determine current status
              const partnerEvents = PARTNER_VISIBILITY_TIMELINE_DATA.filter(e => e.partnerId === perf.id);
              const latestEvent = partnerEvents[partnerEvents.length - 1];
              const isVisible = latestEvent?.eventType === 'activated';

              return (
                <WebControlPanelDecisionRow
                  key={perf.id}
                  entityId={perf.id}
                  entityLabel={partner.storeName}
                  status={isVisible ? 'Ø¸Ø§Ù‡Ø±' : 'Ù…Ø®ÙÙŠ'}
                  statusTone={isVisible ? 'success' : 'danger'}
                  risk={isVisible ? 'neutral' : 'warning'}
                  recommendation={latestEvent ? `Ø¢Ø®Ø± ØªØ­Ø¯ÙŠØ«: ${latestEvent.date}` : 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø³Ø¬Ù„'}
                  reason={latestEvent?.reason ?? 'â€”'}
                  sla="Ø³Ø¬Ù„ Ø§Ù„Ø¸Ù‡ÙˆØ±"
                  primaryAction={{
                    id: `timeline-${perf.id}`,
                    label: isSelected ? 'Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„Ø®Ø· Ø§Ù„Ø²Ù…Ù†ÙŠ' : 'Ø§Ù„Ø®Ø· Ø§Ù„Ø²Ù…Ù†ÙŠ',
                    onAction: () => setSelectedPartnerId(perf.id),
                  }}
                />
              );
            })}
          </Box>
        </Surface>

        {/* Timeline Panel */}
        <Box gap={4}>
          {selectedPartnerId ? (() => {
            const partner = PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === selectedPartnerId);
            if (!partner) return null;

            return (
              <Surface tone="inset" padding={4} gap={4} style={{ borderRadius: '12px' }}>
                <Box layoutDirection="row" justify="space-between" align="center">
                  <Text role="titleSm" style={{ fontWeight: '800', color: theme.brand }}>
                    ØªØ§Ø±ÙŠØ® Ø¸Ù‡ÙˆØ±: {partner.storeName}
                  </Text>
                  <WebControlPanelStatusTag label={`${timelineEvents.length} Ø£Ø­Ø¯Ø§Ø«`} tone="neutral" />
                </Box>

                {timelineEvents.length === 0 ? (
                  <Text tone="muted">Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø³Ø¬Ù„ Ø£Ø­Ø¯Ø§Ø« Ù…ØªØ§Ø­.</Text>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                    {/* Vertical Line */}
                    <div style={{ position: 'absolute', right: '11px', top: '10px', bottom: '10px', width: '2px', backgroundColor: theme.line, zIndex: 0 }} />

                    {timelineEvents.map((event, index) => {
                      const isActivation = event.eventType === 'activated';
                      const color = isActivation ? theme.success : theme.danger;

                      return (
                        <div key={event.id} style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 1 }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: isActivation ? theme.successSurface : theme.dangerSurface, border: `2px solid ${color}`, flexShrink: 0, marginTop: '2px' }} />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: theme.surface, padding: '12px', borderRadius: '8px', border: `1px solid ${theme.line}`, flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Text role="caption" style={{ fontWeight: 800, color }}>
                                {isActivation ? 'ØªÙØ¹ÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø±' : 'Ø¥ÙŠÙ‚Ø§Ù Ù…Ø¤Ù‚Øª'}
                              </Text>
                              <Text role="caption" tone="muted" style={{ direction: 'ltr' }}>{event.date}</Text>
                            </div>
                            <Text role="bodySm">{event.reason}</Text>
                            <Text role="caption" tone="muted" style={{ marginTop: '4px' }}>Ø¨ÙˆØ§Ø³Ø·Ø©: {event.actionBy}</Text>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <WebControlPanelRecommendation
                  title="Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø¸Ù‡ÙˆØ±"
                  reason="Ù‡Ø°Ø§ Ø§Ù„Ø³Ø¬Ù„ ÙŠÙ…Ø«Ù„ Ø§Ù„Ø£Ø­Ø¯Ø§Ø« Ø§Ù„ØªØ§Ø±ÙŠØ®ÙŠØ© Ù„Ø¥ÙŠÙ‚Ø§Ù ÙˆØªÙØ¹ÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø±. Ù„Ù…Ø²ÙŠØ¯ Ù…Ù† Ø§Ù„Ø¥Ø¬Ø±Ø§Ø¡Ø§ØªØŒ Ø§Ù†ØªÙ‚Ù„ Ù„Ù…Ø³Ø§Ø­Ø© Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„ØªÙØ¹ÙŠÙ„."
                  confidence="high"
                  auditTag="UI_PREVIEW_ONLY"
                />
              </Surface>
            );
          })() : (
            <WebControlPanelRecommendation
              title="Ø³Ø¬Ù„ Ø§Ù„Ø¸Ù‡ÙˆØ±"
              reason="Ø§Ø®ØªØ± Ø´Ø±ÙŠÙƒØ§Ù‹ Ù…Ù† Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø¬Ø§Ù†Ø¨ÙŠØ© Ù„Ø§Ø³ØªØ¹Ø±Ø§Ø¶ Ø§Ù„Ø®Ø· Ø§Ù„Ø²Ù…Ù†ÙŠ Ø§Ù„ØªØ§Ø±ÙŠØ®ÙŠ Ù„Ù„Ø¸Ù‡ÙˆØ± ÙˆØ§Ù„Ø¥Ø®ÙØ§Ø¡ Ø¹Ù„Ù‰ Ø§Ù„Ù…Ù†ØµØ©."
              confidence="high"
              auditTag="UI_PREVIEW_ONLY"
            />
          )}
        </Box>
      </div>
    );
  };

  switch (activeSubTab) {
    case 'performance':
      return renderPerformanceTab();
    case 'disputes':
      return renderDisputesTab();
    case 'visibility':
      return renderVisibilityTab();
    default:
      return renderPerformanceTab();
  }
}

export default PartnerPerformanceWorkspace;
