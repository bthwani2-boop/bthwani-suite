'use client';

import React from 'react';
import { Box, Text, useTheme, Surface } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelRecommendation,
  WebControlPanelStatusTag,
} from '@bthwani/ui-kit/web';
import { PARTNER_FULFILLMENT_AGREEMENTS } from './workflow';

import { PARTNER_COMPLAINTS_DATA, type PartnerComplaint } from '../../data/partner.preview-data';

export function PartnerComplaintsWorkspace() {
  const { theme } = useTheme();
  const [complaints, setComplaints] = React.useState<PartnerComplaint[]>(PARTNER_COMPLAINTS_DATA);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const selectedComplaint = complaints.find((c) => c.id === selectedId);
  const partner = selectedComplaint ? PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === selectedComplaint.partnerId) : null;

  const handleStatusChange = (id: string, newStatus: 'investigating' | 'resolved') => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    if (newStatus === 'resolved') {
      setSelectedId(null);
    }
  };

  const openComplaintsCount = complaints.filter(c => c.status === 'open' || c.status === 'investigating').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start', direction: 'rtl' }}>
      {/* Complaints List */}
      <Surface tone="raised" padding={5} gap={4} style={{ borderRadius: '16px' }}>
        <Box layoutDirection="row" justify="space-between" align="center">
          <Text role="titleLg" style={{ fontWeight: '900', color: theme.brandHeaderBackground }}>
            Ø´ÙƒØ§ÙˆÙ‰ Ø§Ù„Ø´Ø±ÙƒØ§Ø¡
          </Text>
          <WebControlPanelStatusTag label={`${openComplaintsCount} Ø´ÙƒØ§ÙˆÙ‰ Ù†Ø´Ø·Ø©`} tone={openComplaintsCount > 0 ? 'danger' : 'neutral'} />
        </Box>

        <Box gap={3}>
          {complaints.length === 0 || openComplaintsCount === 0 ? (
            <Box padding={8} align="center" style={{ backgroundColor: theme.surfaceInset, borderRadius: '12px' }}>
              <Text tone="muted">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø´ÙƒØ§ÙˆÙ‰ Ù†Ø´Ø·Ø© Ø­Ø§Ù„ÙŠØ§Ù‹.</Text>
            </Box>
          ) : (
            complaints.filter(c => c.status !== 'resolved').map((cmp) => {
              const pInfo = PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === cmp.partnerId);
              return (
                <WebControlPanelDecisionRow
                  key={cmp.id}
                  entityId={cmp.id}
                  entityLabel={`${pInfo?.storeName ?? 'Ù…Ø¬Ù‡ÙˆÙ„'} Â· ${cmp.category}`}
                  status={cmp.status === 'open' ? 'Ø¬Ø¯ÙŠØ¯Ø©' : 'Ù‚ÙŠØ¯ Ø§Ù„ØªØ­Ù‚ÙŠÙ‚'}
                  statusTone={cmp.status === 'open' ? 'danger' : 'warning'}
                  risk={cmp.severity}
                  recommendation={cmp.description.substring(0, 60) + '...'}
                  reason={`ØªØ§Ø±ÙŠØ® Ø§Ù„Ø±ÙØ¹: ${cmp.submittedAt}`}
                  sla={cmp.severity === 'high' ? 'Ø§Ø³ØªØ¬Ø§Ø¨Ø© ÙÙˆØ±ÙŠØ© (SLA 1h)' : 'Ø§Ø³ØªØ¬Ø§Ø¨Ø© Ù‚ÙŠØ§Ø³ÙŠØ© (SLA 24h)'}
                  primaryAction={{
                    id: `investigate-${cmp.id}`,
                    label: selectedId === cmp.id ? 'Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„ØªØ°ÙƒØ±Ø©' : 'ÙØªØ­ Ø§Ù„Ø´ÙƒÙˆÙ‰',
                    onAction: () => setSelectedId(cmp.id),
                  }}
                />
              );
            })
          )}
        </Box>
      </Surface>

      {/* Complaint Inspector Panel */}
      <Box gap={4}>
        {selectedComplaint && partner ? (
          <Surface tone="inset" padding={4} gap={3} style={{ borderRadius: '12px' }}>
            <Box layoutDirection="row" justify="space-between" align="center">
              <Text role="titleSm" style={{ fontWeight: '800', color: theme.brand }}>
                ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø´ÙƒÙˆÙ‰
              </Text>
              <WebControlPanelStatusTag label={selectedComplaint.category} tone={selectedComplaint.severity === 'high' ? 'danger' : 'warning'} />
            </Box>

            <Box style={{ backgroundColor: theme.surface, padding: '12px', borderRadius: '8px', border: `1px solid ${theme.line}` }}>
              <Text role="caption" tone="muted">Ø§Ù„Ù…ØªØ¬Ø± Ø§Ù„Ù…Ø´ØªÙƒÙŠ:</Text>
              <Text role="bodySm" style={{ fontWeight: 800, marginBottom: '8px' }}>{partner.storeName}</Text>

              {selectedComplaint.relatedOrderId && (
                <>
                  <Text role="caption" tone="muted">Ø±Ù‚Ù… Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ù…Ø±ØªØ¨Ø·:</Text>
                  <Text role="bodySm" style={{ fontWeight: 800, marginBottom: '8px' }}>{selectedComplaint.relatedOrderId}</Text>
                </>
              )}

              <Text role="caption" tone="muted">Ø§Ù„ÙˆØµÙ:</Text>
              <Text role="bodySm" style={{ lineHeight: 1.5 }}>{selectedComplaint.description}</Text>
            </Box>

            <WebControlPanelRecommendation
              title="ØªÙˆØ¬ÙŠÙ‡ Ù…Ø¹Ø§Ù„Ø¬Ø© Ø§Ù„Ø´ÙƒÙˆÙ‰"
              reason={selectedComplaint.severity === 'high' ? 'ÙŠØªØ·Ù„Ø¨ Ø§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„ÙÙˆØ±ÙŠ Ù…Ø¹ Ø§Ù„Ø´Ø±ÙŠÙƒ ÙˆØ¹Ù…Ù„ÙŠØ© Ø§Ù„ØªØµØ¹ÙŠØ¯ Ù„Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„Ù…Ø±ÙƒØ²ÙŠØ©.' : 'Ø´ÙƒÙˆÙ‰ Ø¶Ù…Ù† Ø§Ù„Ø¥Ø·Ø§Ø± Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠ Ø§Ù„Ù…Ø¹ØªØ§Ø¯ØŒ ÙŠØ±Ø¬Ù‰ Ø§Ù„ØªÙˆØ¬ÙŠÙ‡ Ù„Ù„Ù‚Ø³Ù… Ø§Ù„Ù…Ø®ØªØµ.'}
              confidence="high"
              auditTag="UI_PREVIEW_ONLY"
            />

            <Box layoutDirection="row" gap={2} style={{ marginTop: '12px' }}>
              {selectedComplaint.status === 'open' && (
                <button
                  onClick={() => handleStatusChange(selectedComplaint.id, 'investigating')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px',
                    backgroundColor: theme.brand, color: theme.surface,
                    border: 'none', fontWeight: 700, cursor: 'pointer'
                  }}>
                  Ø¨Ø¯Ø¡ Ø§Ù„ØªØ­Ù‚ÙŠÙ‚
                </button>
              )}
              <button
                onClick={() => handleStatusChange(selectedComplaint.id, 'resolved')}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  backgroundColor: 'transparent', color: theme.success,
                  border: `1px solid ${theme.success}`, fontWeight: 700, cursor: 'pointer'
                }}>
                Ø¥ØºÙ„Ø§Ù‚ Ø§Ù„ØªØ°ÙƒØ±Ø©
              </button>
            </Box>
          </Surface>
        ) : (
          <WebControlPanelRecommendation
            title="Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø´ÙƒØ§ÙˆÙ‰"
            reason="Ø§Ø®ØªØ± Ø´ÙƒÙˆÙ‰ Ù…Ù† Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ù„Ø§Ø³ØªØ¹Ø±Ø§Ø¶ ØªÙØ§ØµÙŠÙ„Ù‡Ø§ ÙˆØ¥Ø¯Ø§Ø±ØªÙ‡Ø§ Ø¶Ù…Ù† Ù…Ø³Ø§Ø± Ø§Ù„Ø¯Ø¹Ù… Ø§Ù„Ù…ØªØ®ØµØµ Ù„Ù„Ø´Ø±ÙƒØ§Ø¡."
            confidence="high"
            auditTag="UI_PREVIEW_ONLY"
          />
        )}
      </Box>
    </div>
  );
}

export default PartnerComplaintsWorkspace;
