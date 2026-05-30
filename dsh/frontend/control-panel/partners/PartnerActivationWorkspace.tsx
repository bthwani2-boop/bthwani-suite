'use client';

import React from 'react';
import { Box, Text, useTheme, Surface, KeyValueList } from '@bthwani/ui-kit';
import {
  WebControlPanelStatusTag,
  WebControlPanelActionCluster,
  WebControlPanelRecommendation,
} from '@bthwani/ui-kit/web';
import {
  type DshPartnerActivationStatus,
  getDshPartnerActivationStateMetadata,
  getDshPartnerReadinessChecklist,
  getDshPartnerVisibilityBadge,
  getDshPartnerVisibilityBadgeLabel,
  getDshPartnerVisibilityBadgeTone,
  getDshPartnerActivationStatusLabel,
} from '../../shared/dsh-partner-activation.model';
import {
  PARTNER_FULFILLMENT_AGREEMENTS,
  getPartnerActivationStatus,
  updatePartnerActivationStatus,
  getAllPartnerActivationStatuses,
} from './workflow';
import { PartnerDeactivationWorkspace } from './PartnerDeactivationWorkspace';
import { PartnerFulfillmentLane } from './PartnerFulfillmentLane';

function checkMarketingEligibility(status: DshPartnerActivationStatus): {
  eligible: boolean;
  label: string;
  tone: 'success' | 'danger' | 'warning';
} {
  if (status === 'client_visible') {
    return { eligible: true, label: 'مؤهل بالكامل للمزايا والعروض التسويقية', tone: 'success' };
  }
  if (status === 'partner_active' || status === 'ops_approved') {
    return { eligible: false, label: 'مؤجل: الشريك نشط تشغيلياً لكن لم يظهر للعملاء بعد', tone: 'warning' };
  }
  return { eligible: false, label: 'محجوب: الشريك غير نشط وغير ظاهر للعملاء حالياً', tone: 'danger' };
}

export function ControlPanelDshPartnerActivationScreen() {
  const { theme } = useTheme();
  const [partnerStatuses, setPartnerStatuses] = React.useState<Record<string, DshPartnerActivationStatus>>({});
  const [selectedPartnerId, setSelectedPartnerId] = React.useState('partner-saha');
  const [isDeactivating, setIsDeactivating] = React.useState(false);
  const [actionMessage, setActionMessage] = React.useState('اختر شريكاً لعرض تفاصيل التفعيل وجاهزيته.');

  React.useEffect(() => {
    setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
  }, []);

  const currentStatus = partnerStatuses[selectedPartnerId] ?? getPartnerActivationStatus(selectedPartnerId);
  const currentMeta = getDshPartnerActivationStateMetadata(currentStatus);
  const readinessChecklist = getDshPartnerReadinessChecklist(currentStatus);
  const allReady = readinessChecklist.every((item) => item.satisfied);
  const marketingElig = checkMarketingEligibility(currentStatus);

  const currentPartner =
    PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === selectedPartnerId) ||
    PARTNER_FULFILLMENT_AGREEMENTS[0];

  const handlePartnerSelect = (id: string) => {
    setSelectedPartnerId(id);
    setIsDeactivating(false);
    setActionMessage(
      `تم تحديد الشريك: ${PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === id)?.storeName}`,
    );
  };

  const handleActivate = () => {
    updatePartnerActivationStatus(selectedPartnerId, 'client_visible');
    setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
    setActionMessage('تم تفعيل الشريك بنجاح وهو الآن ظاهر لعملاء منصة بثواني.');
  };

  const handlePause = () => {
    updatePartnerActivationStatus(selectedPartnerId, 'client_hidden');
    setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
    setActionMessage('تم إيقاف الشريك مؤقتاً (مخفي من اكتشاف العملاء).');
  };

  const handleDeactivateConfirm = (partnerId: string, reason: string, note: string) => {
    updatePartnerActivationStatus(partnerId, 'partner_deactivated');
    setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
    setIsDeactivating(false);
    setActionMessage(`تم إلغاء تفعيل الشريك. السبب: ${reason} · الملاحظة: ${note}`);
  };

  return (
    <Box gap={4} style={{ direction: 'rtl' }}>
      {/* Partner selector chips */}
      <Box gap={2}>
        <Text role="caption" tone="brand" style={{ fontWeight: '800' }}>اختر الشريك للمعاينة والتفعيل</Text>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {PARTNER_FULFILLMENT_AGREEMENTS.map((partner) => {
            const status = partnerStatuses[partner.partnerId] ?? getPartnerActivationStatus(partner.partnerId);
            const isActive = selectedPartnerId === partner.partnerId;
            return (
              <button
                key={partner.partnerId}
                type="button"
                onClick={() => handlePartnerSelect(partner.partnerId)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: `1px solid ${isActive ? theme.brand : theme.line}`,
                  background: isActive ? theme.brandSurface : theme.surface,
                  color: isActive ? theme.brand : theme.text,
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {partner.storeName} ({getDshPartnerActivationStatusLabel(status)})
              </button>
            );
          })}
        </Box>
      </Box>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
        <Box gap={4}>
          {isDeactivating ? (
            <PartnerDeactivationWorkspace
              partnerId={selectedPartnerId}
              partnerName={currentPartner.storeName}
              auditRequired={currentMeta.auditRequired}
              onConfirmDeactivate={handleDeactivateConfirm}
              onClose={() => setIsDeactivating(false)}
            />
          ) : (
            <Surface tone="raised" padding={5} gap={4} style={{ borderRadius: '16px' }}>
              <Box layoutDirection="row" justify="space-between" align="center">
                <Box gap={1}>
                  <Text role="titleLg" style={{ fontWeight: '900', color: theme.brandHeaderBackground }}>
                    حالة الجاهزية والتفعيل
                  </Text>
                  <Text role="caption" tone="muted">
                    {currentPartner.storeName} · {currentPartner.categoryLabel}
                  </Text>
                </Box>
                <Box layoutDirection="row" gap={2}>
                  <WebControlPanelStatusTag
                    label={getDshPartnerActivationStatusLabel(currentStatus)}
                    tone={
                      currentStatus === 'client_visible'
                        ? 'success'
                        : currentStatus === 'partner_deactivated'
                        ? 'danger'
                        : 'warning'
                    }
                  />
                  <WebControlPanelStatusTag
                    label={getDshPartnerVisibilityBadgeLabel(
                      getDshPartnerVisibilityBadge(currentStatus, true),
                    )}
                    tone={
                      getDshPartnerVisibilityBadgeTone(
                        getDshPartnerVisibilityBadge(currentStatus, true),
                      ) as 'success' | 'warning' | 'danger' | 'neutral'
                    }
                  />
                </Box>
              </Box>

              <Box
                style={{
                  backgroundColor: theme.surfaceInset,
                  padding: 12,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: theme.line,
                }}
              >
                <KeyValueList
                  dense
                  items={[
                    { label: 'المسؤول الحالي', value: currentMeta.actorResponsible, tone: 'brand' },
                    { label: 'مالك الإجراء', value: currentMeta.ownerSurface, tone: 'default' },
                    { label: 'الخطوة القادمة', value: currentMeta.nextAction, tone: 'default' },
                  ]}
                />
              </Box>

              {/* Marketing Eligibility Banner */}
              <div
                style={{
                  background: theme[`${marketingElig.tone}Surface`],
                  border: `1px solid ${theme[marketingElig.tone]}`,
                  padding: '12px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Text role="bodySm" style={{ color: theme[marketingElig.tone], fontWeight: '800' }}>
                  {marketingElig.eligible ? '✓' : '⚠'} {marketingElig.label}
                </Text>
              </div>

              {/* Readiness Checklist */}
              <Box gap={3}>
                <Text role="titleSm" style={{ fontWeight: '800' }}>قائمة شروط التفعيل النهائي</Text>
                <Box gap={2}>
                  {readinessChecklist.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: item.satisfied ? theme.successSurface : theme.dangerSurface,
                        border: `1px solid ${item.satisfied ? theme.success : theme.danger}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 800,
                            color: item.satisfied ? theme.success : theme.danger,
                          }}
                        >
                          {item.label}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: item.satisfied ? theme.success : theme.danger,
                          }}
                        >
                          {item.satisfied ? '✓ مكتمل' : '✗ غير مكتمل'}
                        </span>
                      </div>
                      {!item.satisfied && item.blockedReason && (
                        <span style={{ fontSize: '11px', color: theme.danger }}>
                          العائق: {item.blockedReason}
                        </span>
                      )}
                    </div>
                  ))}
                </Box>
              </Box>

              <WebControlPanelActionCluster
                primary={
                  allReady && currentStatus !== 'client_visible'
                    ? { id: 'btn-activate', label: 'تفعيل للعملاء (Go Live)', onAction: handleActivate }
                    : currentStatus === 'client_visible'
                    ? { id: 'btn-pause', label: 'إيقاف مؤقت (إخفاء)', onAction: handlePause }
                    : undefined
                }
                secondary={
                  currentStatus !== 'partner_deactivated'
                    ? { id: 'btn-deactivate', label: 'إلغاء التفعيل والتعطيل', onAction: () => setIsDeactivating(true) }
                    : undefined
                }
              />
            </Surface>
          )}

          <PartnerFulfillmentLane />
        </Box>

        {/* Sidebar */}
        <Box gap={4}>
          <WebControlPanelRecommendation
            title="تعليمات تفعيل الشريك"
            reason={actionMessage}
            confidence={allReady ? 'high' : 'low'}
            auditTag="UI_PREVIEW_ONLY"
          />
          <Surface tone="raised" padding={4} gap={2} style={{ borderRadius: '12px' }}>
            <Text role="titleSm" style={{ fontWeight: '800' }}>ملاحظة تشغيلية</Text>
            <Text role="bodySm" tone="muted">
              حسب سياسة الحوكمة في بثواني، لا يمكن تفعيل أي شريك للعملاء إلا بعد أن يتم مراجعة وثائقه بنسبة 100%
              واعتماد الكتالوج الخاص به.
            </Text>
          </Surface>
        </Box>
      </div>
    </Box>
  );
}

export default ControlPanelDshPartnerActivationScreen;
