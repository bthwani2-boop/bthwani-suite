'use client';

import React from 'react';
import { Box, Text, Surface, KeyValueList } from '@bthwani/ui-kit';
import { Pressable } from 'react-native';
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
} from '../../shared/partner/dsh-partner-activation.model';
import {
  PARTNER_FULFILLMENT_AGREEMENTS,
  getPartnerActivationStatus,
  updatePartnerActivationStatus,
  getAllPartnerActivationStatuses,
} from './workflow';
import { PartnerDeactivationWorkspace } from './PartnerDeactivationWorkspace';
import { PartnerFulfillmentLane } from './PartnerFulfillmentLane';
import styles from '../shared/control-panel-surface.module.css';

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
    PARTNER_FULFILLMENT_AGREEMENTS[0] ||
    { partnerId: selectedPartnerId, storeName: 'شريك غير معروف', categoryLabel: '', modes: [] };

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

  const handleOpsActivate = () => {
    updatePartnerActivationStatus(selectedPartnerId, 'partner_active');
    setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
    setActionMessage('تم تنشيط الشريك تشغيلياً وهو جاهز للتفعيل للعملاء.');
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
    <Box gap={4}>
      {/* Partner selector chips */}
      <Box gap={2}>
        <Text role="caption" tone="brand">اختر الشريك للمعاينة والتفعيل</Text>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {PARTNER_FULFILLMENT_AGREEMENTS.map((partner) => {
            const status = partnerStatuses[partner.partnerId] ?? getPartnerActivationStatus(partner.partnerId);
            const isActive = selectedPartnerId === partner.partnerId;
            return (
              <Pressable
                key={partner.partnerId}
                onPress={() => handlePartnerSelect(partner.partnerId)}
                style={{ cursor: 'pointer' }}
              >
                <Surface
                  padding={2}
                  radiusToken="sm"
                  border
                  borderTone={isActive ? 'brand' : 'line'}
                  tone={isActive ? 'brand' : 'default'}
                  layoutDirection="row"
                  align="center"
                >
                  <Text role="bodySm" tone={isActive ? 'brand' : 'default'}>
                    {partner.storeName} ({getDshPartnerActivationStatusLabel(status)})
                  </Text>
                </Surface>
              </Pressable>
            );
          })}
        </Box>
      </Box>

      <div className={styles.surfaceSplitGrid}>
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
            <Surface tone="raised" padding={5} gap={4} radiusToken="lg">
              <Box layoutDirection="row" justify="space-between" align="center">
                <Box gap={1}>
                  <Text role="titleLg" tone="brand">
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

              <Surface tone="inset" padding={3} radiusToken="sm" border borderTone="line">
                <KeyValueList
                  dense
                  items={[
                    { label: 'المسؤول الحالي', value: currentMeta.actorResponsible, tone: 'brand' },
                    { label: 'مالك الإجراء', value: currentMeta.ownerSurface, tone: 'default' },
                    { label: 'الخطوة القادمة', value: currentMeta.nextAction, tone: 'default' },
                  ]}
                />
              </Surface>

              {/* Marketing Eligibility Banner */}
              <Surface
                tone={marketingElig.tone}
                padding={3}
                radiusToken="sm"
                layoutDirection="row"
                align="center"
                gap={2}
              >
                <Text role="titleSm" tone={marketingElig.tone}>
                  {marketingElig.eligible ? '✓' : '⚠'} {marketingElig.label}
                </Text>
              </Surface>

              {/* Readiness Checklist */}
              <Box gap={3}>
                <Text role="titleSm" tone="default">قائمة شروط التفعيل النهائي</Text>
                <Box gap={2}>
                  {readinessChecklist.map((item) => (
                    <Surface
                      key={item.id}
                      padding={3}
                      radiusToken="sm"
                      tone={item.satisfied ? 'success' : 'danger'}
                      gap={1}
                    >
                      <Box layoutDirection="row" justify="space-between" align="center">
                        <Text
                          role="titleSm"
                          tone={item.satisfied ? 'success' : 'danger'}
                        >
                          {item.label}
                        </Text>
                        <Text
                          role="titleSm"
                          tone={item.satisfied ? 'success' : 'danger'}
                        >
                          {item.satisfied ? '✓ مكتمل' : '✗ غير مكتمل'}
                        </Text>
                      </Box>
                      {!item.satisfied && item.blockedReason && (
                        <Text role="caption" tone="danger">
                          العائق: {item.blockedReason}
                        </Text>
                      )}
                    </Surface>
                  ))}
                </Box>
              </Box>

              <WebControlPanelActionCluster
                primary={
                  currentStatus === 'ops_approved'
                    ? { id: 'btn-ops-activate', label: 'تنشيط الشريك تشغيلياً', onAction: handleOpsActivate }
                    : allReady && currentStatus !== 'client_visible'
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
            auditTag="NEEDS_BINDING_LATER"
          />
          <Surface tone="raised" padding={4} gap={2} radiusToken="lg">
            <Text role="titleSm" tone="default">ملاحظة تشغيلية</Text>
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
