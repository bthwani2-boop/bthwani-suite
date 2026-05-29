'use client';

import React from 'react';
import { Box, Text, useTheme, Surface, KeyValueList } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelRecommendation,
  WebControlPanelStatusTag,
} from '@bthwani/ui-kit/web';
import { PARTNER_FULFILLMENT_AGREEMENTS } from './workflow';

import { PARTNER_MODIFICATION_REQUESTS, type PartnerModificationRequest } from '../../data/partner.preview-data';

export function PartnerModificationsWorkspace() {
  const { theme } = useTheme();
  const [requests, setRequests] = React.useState<PartnerModificationRequest[]>(PARTNER_MODIFICATION_REQUESTS);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const selectedRequest = requests.find((r) => r.id === selectedId);
  const partner = selectedRequest ? PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === selectedRequest.partnerId) : null;

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    setSelectedId(null);
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    setSelectedId(null);
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start', direction: 'rtl' }}>
      {/* Modification Requests List */}
      <Surface tone="raised" padding={5} gap={4} style={{ borderRadius: '16px' }}>
        <Box layoutDirection="row" justify="space-between" align="center">
          <Text role="titleLg" style={{ fontWeight: '900', color: theme.brandHeaderBackground }}>
            Ø·Ù„Ø¨Ø§Øª ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª
          </Text>
          <WebControlPanelStatusTag label={`${pendingCount} Ø·Ù„Ø¨Ø§Øª Ù…Ø¹Ù„Ù‚Ø©`} tone={pendingCount > 0 ? 'warning' : 'neutral'} />
        </Box>

        <Box gap={3}>
          {requests.length === 0 || pendingCount === 0 ? (
            <Box padding={8} align="center" style={{ backgroundColor: theme.surfaceInset, borderRadius: '12px' }}>
              <Text tone="muted">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø·Ù„Ø¨Ø§Øª ØªØ¹Ø¯ÙŠÙ„ Ø¨ÙŠØ§Ù†Ø§Øª Ù…Ø¹Ù„Ù‚Ø©.</Text>
            </Box>
          ) : (
            requests.filter(r => r.status === 'pending').map((req) => {
              const pInfo = PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === req.partnerId);
              return (
                <WebControlPanelDecisionRow
                  key={req.id}
                  entityId={req.id}
                  entityLabel={`${pInfo?.storeName ?? 'Ù…Ø¬Ù‡ÙˆÙ„'} Â· ${req.type}`}
                  status="Ø¨Ø§Ù†ØªØ¸Ø§Ø± Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©"
                  statusTone="warning"
                  risk={req.risk}
                  recommendation={req.reason}
                  reason={`ØªØ§Ø±ÙŠØ® Ø§Ù„Ø·Ù„Ø¨: ${req.submittedAt}`}
                  sla={req.risk === 'danger' ? 'Ù…Ø±Ø§Ø¬Ø¹Ø© Ø¯Ù‚ÙŠÙ‚Ø©' : 'Ø¥Ø¬Ø±Ø§Ø¡ Ø§Ø¹ØªÙŠØ§Ø¯ÙŠ'}
                  primaryAction={{
                    id: `view-${req.id}`,
                    label: selectedId === req.id ? 'Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©' : 'Ù…Ø±Ø§Ø¬Ø¹Ø© ÙˆØªØ¯Ù‚ÙŠÙ‚',
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
          <Surface tone="inset" padding={4} gap={3} style={{ borderRadius: '12px' }}>
            <Box layoutDirection="row" justify="space-between" align="center">
              <Text role="titleSm" style={{ fontWeight: '800', color: theme.brand }}>
                Ù…Ø±Ø§Ø¬Ø¹Ø©: {partner.storeName}
              </Text>
              <WebControlPanelStatusTag label={selectedRequest.type} tone={selectedRequest.risk} />
            </Box>

            <Text role="bodySm" tone="muted">
              ÙŠØ±Ø¬Ù‰ Ù…Ù‚Ø§Ø±Ù†Ø© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø© Ù‚Ø¨Ù„ Ø§Ù„Ù…ÙˆØ§ÙÙ‚Ø© Ù„Ø§Ø¹ØªÙ…Ø§Ø¯Ù‡Ø§ Ø¨Ø´ÙƒÙ„ Ù†Ù‡Ø§Ø¦ÙŠ ÙÙŠ Ù…Ù„Ù Ø§Ù„Ø´Ø±ÙŠÙƒ.
            </Text>

            <Box gap={2} style={{ marginTop: '8px' }}>
              <Text role="caption" tone="brand" style={{ fontWeight: '800' }}>Ø§Ù„ØªØºÙŠÙŠØ±Ø§Øª Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©:</Text>
              {selectedRequest.changes.map((change, idx) => (
                <div key={idx} style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.line}`,
                  borderRadius: '8px',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <Text role="caption" style={{ fontWeight: 800 }}>{change.field}</Text>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: theme.danger, textDecoration: 'line-through' }}>
                      {change.old}
                    </span>
                    <span style={{ fontSize: '11px', color: theme.success, fontWeight: 700 }}>
                      {change.new}
                    </span>
                  </div>
                </div>
              ))}
            </Box>

            <WebControlPanelRecommendation
              title="ØªÙˆØ¬ÙŠÙ‡ Ø£Ù…Ù†ÙŠ/Ø¹Ù…Ù„ÙŠØ§ØªÙŠ"
              reason={selectedRequest.reason}
              confidence={selectedRequest.risk === 'danger' ? 'medium' : 'high'}
              auditTag="UI_PREVIEW_ONLY"
            />

            <Box layoutDirection="row" gap={2} style={{ marginTop: '12px' }}>
              <button
                onClick={() => handleApprove(selectedRequest.id)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  backgroundColor: theme.success, color: theme.surface,
                  border: 'none', fontWeight: 700, cursor: 'pointer'
                }}>
                Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„ØªØ¹Ø¯ÙŠÙ„Ø§Øª
              </button>
              <button
                onClick={() => handleReject(selectedRequest.id)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  backgroundColor: 'transparent', color: theme.danger,
                  border: `1px solid ${theme.danger}`, fontWeight: 700, cursor: 'pointer'
                }}>
                Ø±ÙØ¶
              </button>
            </Box>
          </Surface>
        ) : (
          <WebControlPanelRecommendation
            title="Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„ØªØ¹Ø¯ÙŠÙ„Ø§Øª"
            reason="Ø§Ø®ØªØ± Ø·Ù„Ø¨ ØªØ¹Ø¯ÙŠÙ„ Ù…Ù† Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø¬Ø§Ù†Ø¨ÙŠØ© Ù„Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„ØªØºÙŠÙŠØ±Ø§Øª Ø§Ù„Ù…Ø·Ù„ÙˆØ¨ Ø¥Ø¬Ø±Ø§Ø¤Ù‡Ø§ Ø¹Ù„Ù‰ Ù…Ù„Ù Ø§Ù„Ø´Ø±ÙŠÙƒ ÙˆØ§Ù„Ù…ÙˆØ§ÙÙ‚Ø© Ø¹Ù„ÙŠÙ‡Ø§."
            confidence="high"
            auditTag="UI_PREVIEW_ONLY"
          />
        )}
      </Box>
    </div>
  );
}

export default PartnerModificationsWorkspace;
