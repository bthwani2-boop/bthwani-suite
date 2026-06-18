'use client';

import React from 'react';
import { Box, Text, Surface } from '@bthwani/ui-kit';
import { Pressable } from 'react-native';
import {
  WebControlPanelLaneTabs,
  WebControlPanelSubTabs,
  WebControlPanelDecisionRow,
  WebControlPanelRecommendation,
  WebControlPanelActionCluster,
} from '@bthwani/ui-kit/web';
import {
  getPartnerIntakeItems,
  type ApprovalRecord,
  moveApprovalRecordToStage,
  translateStage,
  translateEntityType,
  translateOwner,
} from '../../shared/stores/partner/partner.workflow';
import {
  PlatformVarsRegistry,
  getPartnerStoreOnboardingRuntimeClient,
  type PartnerStoreDetail,
} from '../../shared';
import {
  mapApprovalStageToPartnerActivationStatus,
  resolveDshStoreClientVisibility,
} from '../../shared/stores/dsh-client-visibility.model';
import { getDshControlPanelGovernanceEntry } from '../shared';
import styles from '../shared/control-panel-surface.module.css';
const PartnerDeactivationWorkspace = React.lazy(() => import('./PartnerDeactivationWorkspace'));
const PartnerFulfillmentLane = React.lazy(() => import('./PartnerFulfillmentLane'));
const PartnerTopologyLane = React.lazy(() => import('./PartnerTopologyLane'));
const DshPartnerPromotionEligibilityScreen = React.lazy(() => import('./DshPartnerPromotionEligibilityScreen'));
const ControlPanelDshPartnerActivationScreen = React.lazy(() => import('./PartnerActivationWorkspace'));
const ControlPanelDshPartnerDocumentReviewScreen = React.lazy(() => import('./PartnerDocumentReviewWorkspace'));
const PartnerCatalogOverridesWorkspace = React.lazy(() => import('./PartnerCatalogOverridesWorkspace'));
const PartnerPerformanceWorkspace = React.lazy(() => import('./PartnerPerformanceWorkspace'));
const PartnerModificationsWorkspace = React.lazy(() => import('./PartnerModificationsWorkspace'));
const PartnerComplaintsWorkspace = React.lazy(() => import('./PartnerComplaintsWorkspace'));
const ReadinessEscalationsWorkspace = React.lazy(() => import('./ReadinessEscalationsWorkspace').then(m => ({ default: m.ReadinessEscalationsWorkspace })));
const ReadinessApprovalsWorkspace = React.lazy(() => import('./ReadinessApprovalsWorkspace').then(m => ({ default: m.ReadinessApprovalsWorkspace })));

function WorkspaceSkeleton() {
  return (
    <Surface padding={6} align="center" tone="raised" radiusToken="lg" gap={4}>
      <Text role="titleSm" tone="muted">جارٍ التحميل...</Text>
    </Surface>
  );
}
import {
  PARTNER_FULFILLMENT_AGREEMENTS,
  getPartnerActivationStatus,
  updatePartnerActivationStatus,
  getAllPartnerActivationStatuses,
} from './workflow';
import {
  PARTNER_PRIMARY_TABS,
  PARTNER_SUB_TAB_DEFINITIONS,
  type PartnerWorkspaceTabId,
} from './partners.types';
import type { DshPartnerActivationStatus } from '../../shared/stores/partner/dsh-partner-activation.model';
const partnerCoveragePreviewZones: { status: string }[] = [];

function formatStoreDateTime(value: string | undefined): string {
  if (!value) return 'غير محدد';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString('ar', { dateStyle: 'medium', timeStyle: 'short' });
}

function showStoreValue(value: unknown, fallback = 'غير مرسل بعد'): string {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'boolean') return value ? 'نعم' : 'لا';
  const text = String(value).trim();
  return text.length > 0 ? text : fallback;
}

function InfoCard({ label, value, filled = true }: { label: string; value: string; filled?: boolean }) {
  return (
    <Surface
      padding={3}
      tone={filled ? 'inset' : 'default'}
      radiusToken="sm"
      border
      borderTone={filled ? 'line' : 'line'}
      gap={1}
      style={{ minWidth: 110, opacity: filled ? 1 : 0.65 }}
    >
      <Text role="caption" tone="muted">{label}</Text>
      <Text role="bodySm" tone={filled ? 'brand' : 'muted'} style={{ fontStyle: filled ? 'normal' : 'italic' }}>
        {value}
      </Text>
    </Surface>
  );
}

function GateCard({ label, value, pass }: { label: string; value: string; pass: boolean }) {
  return (
    <Surface
      padding={3}
      radiusToken="sm"
      border
      borderTone={pass ? 'line' : 'line'}
      gap={1}
      style={{
        minWidth: 120,
        backgroundColor: pass ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.06)',
        borderColor: pass ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.25)',
      }}
    >
      <Text role="caption" tone="muted">{label}</Text>
      <Box layoutDirection="row" align="center" gap={1}>
        <Text role="bodySm" style={{ color: pass ? '#16a34a' : '#dc2626', fontWeight: '600' }}>
          {pass ? '✓' : '✗'}
        </Text>
        <Text role="bodySm" style={{ color: pass ? '#16a34a' : '#dc2626' }}>{value}</Text>
      </Box>
    </Surface>
  );
}

function ContactFieldRow({ label, value, icon }: { label: string; value: string | undefined; icon: string }) {
  const filled = !!value?.trim();
  return (
    <Box
      layoutDirection="row"
      align="center"
      gap={3}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: filled ? 'rgba(251,146,60,0.06)' : 'rgba(0,0,0,0.03)',
        borderWidth: 1,
        borderColor: filled ? 'rgba(251,146,60,0.2)' : 'rgba(0,0,0,0.08)',
      }}
    >
      <Text style={{ fontSize: 16, width: 22, textAlign: 'center' }}>{icon}</Text>
      <Box gap={0} style={{ flex: 1 }}>
        <Text role="caption" tone="muted">{label}</Text>
        <Text role="bodySm" tone={filled ? 'default' : 'muted'} style={{ fontStyle: filled ? 'normal' : 'italic' }}>
          {filled ? value : 'لم يُرسل بعد من التطبيق الميداني'}
        </Text>
      </Box>
      <Text style={{ fontSize: 13, color: filled ? '#fb923c' : '#9ca3af' }}>
        {filled ? '✓' : '—'}
      </Text>
    </Box>
  );
}

function ReadinessProgressBar({ total, passed }: { total: number; passed: number }) {
  const pct = total === 0 ? 0 : Math.round((passed / total) * 100);
  return (
    <Box gap={1}>
      <Box layoutDirection="row" justify="space-between">
        <Text role="caption" tone="muted">تقدم الجاهزية</Text>
        <Text role="caption" tone={pct === 100 ? 'brand' : 'muted'}>{passed}/{total} معايير</Text>
      </Box>
      <Box
        style={{
          height: 6,
          backgroundColor: 'rgba(0,0,0,0.08)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box
          style={{
            height: 6,
            width: `${pct}%`,
            backgroundColor: pct === 100 ? '#16a34a' : pct >= 60 ? '#fb923c' : '#ef4444',
            borderRadius: 3,
          }}
        />
      </Box>
    </Box>
  );
}

function PartnerStoreIntakeDetailsPanel({
  item,
  detail,
  loading,
  error,
}: {
  item: ApprovalRecord;
  detail: PartnerStoreDetail | null;
  loading: boolean;
  error: string | null;
}) {
  const address = detail?.address ?? item.metadata?.address;
  const categoryId = detail?.category_id ?? item.metadata?.categoryId;
  const publishStage = detail?.publish_stage ?? item.metadata?.publishStage ?? 'pending_review';

  const gates = [
    { key: 'contact', label: 'رقم التواصل', pass: !!detail?.contact_number },
    { key: 'hours', label: 'ساعات العمل', pass: !!detail?.opening_hours },
    { key: 'catalog_summary', label: 'ملخص الكتالوج', pass: !!detail?.catalog_summary },
    { key: 'readiness', label: 'جاهزية الشريك', pass: detail?.partner_readiness_status === 'ready' },
    { key: 'quality', label: 'جودة الكتالوج', pass: detail?.catalog_quality_status === 'approved' },
    { key: 'pricing', label: 'التسعير', pass: detail?.catalog_pricing_status === 'approved' },
    { key: 'marketing', label: 'الظهور التسويقي', pass: detail?.marketing_visibility_status === 'active' },
  ];
  const passedCount = gates.filter(g => g.pass).length;

  const stageColor = item.stage === 'field-submitted' || item.stage === 'partner-submitted'
    ? '#f59e0b' : item.stage === 'needs-fix' ? '#ef4444' : '#3b82f6';

  return (
    <Surface padding={5} tone="raised" radiusToken="lg" border borderTone="brand" gap={5}>

      {/* ── Header ─────────────────────────────────────────── */}
      <Box layoutDirection="row" justify="space-between" align="flex-start" style={{ flexWrap: 'wrap', gap: 12 }}>
        <Box gap={2} style={{ flex: 1, minWidth: 200 }}>
          <Text role="caption" tone="muted">ملف الانضمام</Text>
          <Text role="titleLg">{item.title}</Text>
          <Text role="code" tone="muted" style={{ fontSize: 11 }}>
            {item.id}
          </Text>
          <Box layoutDirection="row" gap={2} align="center">
            <Box
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 20,
                backgroundColor: 'rgba(251,146,60,0.12)',
                borderWidth: 1,
                borderColor: 'rgba(251,146,60,0.3)',
              }}
            >
              <Text style={{ fontSize: 11, color: '#9a3412' }}>{translateEntityType(item.entityType)}</Text>
            </Box>
            <Box
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 20,
                backgroundColor: 'rgba(59,130,246,0.08)',
                borderWidth: 1,
                borderColor: 'rgba(59,130,246,0.2)',
              }}
            >
              <Text style={{ fontSize: 11, color: '#1d4ed8' }}>{translateOwner(item.source)}</Text>
            </Box>
          </Box>
        </Box>
        <Box
          style={{
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 10,
            backgroundColor: `${stageColor}14`,
            borderWidth: 1.5,
            borderColor: `${stageColor}40`,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 10, color: stageColor, marginBottom: 2 }}>المرحلة الحالية</Text>
          <Text style={{ fontSize: 14, fontWeight: '700', color: stageColor }}>{translateStage(item.stage)}</Text>
        </Box>
      </Box>

      {loading ? (
        <Surface padding={3} tone="inset" radiusToken="sm">
          <Text role="bodySm" tone="muted">⏳ جارٍ تحميل تفاصيل المتجر...</Text>
        </Surface>
      ) : null}

      {error ? (
        <Surface padding={3} tone="inset" radiusToken="sm" style={{ borderColor: 'rgba(239,68,68,0.3)', borderWidth: 1 }}>
          <Text role="bodySm" tone="danger">⚠ {error}</Text>
        </Surface>
      ) : null}

      {/* ── Section 1: Basic store data ─────────────────────── */}
      <Box gap={2}>
        <Text role="caption" tone="muted" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>بيانات المتجر الأساسية</Text>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <InfoCard label="العنوان" value={showStoreValue(address)} filled={!!address} />
          <InfoCard label="التصنيف" value={showStoreValue(categoryId)} filled={!!categoryId} />
          <InfoCard label="مرحلة النشر" value={showStoreValue(publishStage)} filled />
          <InfoCard label="وقت الإرسال" value={formatStoreDateTime(detail?.created_at ?? item.submittedAt)} filled />
          <InfoCard label="استلام من المتجر" value={showStoreValue(detail?.supports_pickup ?? item.metadata?.supportsPickup)} filled />
          <InfoCard label="توصيل المتجر" value={showStoreValue(detail?.supports_partner_delivery ?? item.metadata?.supportsPartnerDelivery)} filled />
        </Box>
      </Box>

      {/* ── Section 2: Field contact data ───────────────────── */}
      <Box gap={2}>
        <Text role="caption" tone="muted" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>بيانات التواصل والعمل</Text>
        <Box gap={2}>
          <ContactFieldRow icon="📞" label="رقم التواصل" value={detail?.contact_number} />
          <ContactFieldRow icon="🕐" label="ساعات العمل" value={detail?.opening_hours} />
          <ContactFieldRow icon="📋" label="ملخص الكتالوج" value={detail?.catalog_summary} />
        </Box>
      </Box>

      {/* ── Section 3: Readiness gates ──────────────────────── */}
      <Box gap={3}>
        <Box layoutDirection="row" justify="space-between" align="center">
          <Text role="caption" tone="muted" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>بوابات الجاهزية</Text>
          <Text role="caption" tone={passedCount === gates.length ? 'brand' : 'muted'}>
            {passedCount === gates.length ? '✓ جاهز للاعتماد' : `${gates.length - passedCount} نواقص`}
          </Text>
        </Box>
        <ReadinessProgressBar total={gates.length} passed={passedCount} />
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <GateCard
            label="جاهزية الشريك"
            value={showStoreValue(detail?.partner_readiness_status, 'غير جاهز')}
            pass={detail?.partner_readiness_status === 'ready'}
          />
          <GateCard
            label="جودة الكتالوج"
            value={showStoreValue(detail?.catalog_quality_status, 'غير معتمد')}
            pass={detail?.catalog_quality_status === 'approved'}
          />
          <GateCard
            label="تسعير الكتالوج"
            value={showStoreValue(detail?.catalog_pricing_status, 'غير معتمد')}
            pass={detail?.catalog_pricing_status === 'approved'}
          />
          <GateCard
            label="الظهور التسويقي"
            value={showStoreValue(detail?.marketing_visibility_status, 'غير نشط')}
            pass={detail?.marketing_visibility_status === 'active'}
          />
        </Box>
      </Box>

      {/* ── Section 4: Operational read ─────────────────────── */}
      <Surface
        padding={4}
        tone="inset"
        radiusToken="md"
        gap={3}
        style={{ borderWidth: 1, borderColor: 'rgba(251,146,60,0.15)' }}
      >
        <Box layoutDirection="row" justify="space-between" align="center">
          <Text role="titleSm" tone="brand">قراءة تشغيلية</Text>
          <Text role="caption" tone="muted">
            {passedCount}/{gates.length} معايير مكتملة
          </Text>
        </Box>
        <Text role="bodySm" tone="muted">
          هذا المتجر وصل من تطبيق الميداني وتم حفظه كطلب مراجعة. يبقى مخفياً عن العميل حتى اكتمال الجاهزية، اعتماد الكتالوج، التسعير، والتفعيل التسويقي.
        </Text>
        <Box gap={1}>
          {gates.map(gate => (
            <Box key={gate.key} layoutDirection="row" align="center" gap={2}>
              <Text style={{ fontSize: 13, color: gate.pass ? '#16a34a' : '#ef4444', width: 16 }}>
                {gate.pass ? '✓' : '✗'}
              </Text>
              <Text role="bodySm" tone={gate.pass ? 'muted' : 'default'} style={{ color: gate.pass ? '#6b7280' : '#374151' }}>
                {gate.label}
                {gate.pass ? '' : ' — ناقص'}
              </Text>
            </Box>
          ))}
        </Box>
      </Surface>

    </Surface>
  );
}

function PartnerApprovalCard({
  item,
  onAction,
  onInspect,
  selected,
}: {
  item: ApprovalRecord;
  onAction: (id: string, action: 'approve' | 'reject' | 'fix' | 'activate') => void;
  onInspect: (item: ApprovalRecord) => void;
  selected?: boolean;
}) {
  const activationStatus = mapApprovalStageToPartnerActivationStatus(item.stage);
  const visibility = resolveDshStoreClientVisibility({
    activationStatus,
    catalogPublished: item.stage === 'catalog-adopted' || item.stage === 'client-visible',
    deliveryModesReady: item.stage === 'marketing-approved' || item.stage === 'catalog-adopted' || item.stage === 'client-visible',
    serviceabilityAvailable: item.stage === 'client-visible',
    storeOpen: true,
  });
  const tone = (item.stage === 'marketing-review' || item.stage === 'marketing-approved') ? 'success' :
               (item.stage === 'needs-fix') ? 'danger' :
               (item.stage === 'partner-submitted' || item.stage === 'field-submitted') ? 'warning' : 'neutral';

  const isAwaitingActivation = item.stage === 'marketing-approved';
  const isAwaitingReview = ['partner-submitted', 'field-submitted', 'partner-review'].includes(item.stage);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleActionWithDelay = (actionType: 'approve' | 'reject' | 'fix' | 'activate') => {
    setIsSubmitting(true);
    setTimeout(() => {
      onAction(item.id, actionType);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <Surface padding={0} tone={selected ? 'inset' : 'raised'} radiusToken="lg" border borderTone={selected ? 'brand' : 'line'} gap={0}>
      <Pressable onPress={() => onInspect(item)} style={{ cursor: 'pointer' }}>
        <WebControlPanelDecisionRow
          entityId={item.id}
          entityLabel={item.title}
          status={translateStage(item.stage)}
          statusTone={tone === 'danger' ? 'danger' : tone === 'success' ? 'success' : tone === 'warning' ? 'warning' : 'neutral'}
          risk={tone === 'danger' ? 'danger' : tone === 'warning' ? 'warning' : 'neutral'}
          recommendation={visibility.visible ? 'جاهز للظهور المنطقي' : (visibility.blockedReason ?? (isAwaitingActivation ? 'جاهز للتفعيل النهائي' : 'مراجعة المستندات'))}
          reason={isAwaitingActivation
            ? `اجتاز الشريك مراحل التسجيل والمراجعة التسويقية. المتبقي: ${visibility.blockedReason ?? 'قرار التفعيل النهائي بيد قسم الشركاء.'}`
            : `حالة التفعيل الحالية: ${activationStatus} · ${visibility.blockedReason ?? 'البيانات المرفوعة مكتملة وتطابق المعايير الأولية لمنصة بثواني.'}`}
          sla={translateEntityType(item.entityType)}
          primaryAction={isAwaitingActivation ? {
            id: 'activate',
            label: isSubmitting ? 'جارٍ التفعيل...' : 'تفعيل الشريك',
            onAction: isSubmitting ? undefined : () => handleActionWithDelay('activate')
          } : isAwaitingReview ? {
            id: 'approve',
            label: isSubmitting ? 'جارٍ المعالجة...' : 'قبول للمراجعة',
            onAction: isSubmitting ? undefined : () => handleActionWithDelay('approve')
          } : undefined}
          secondaryAction={isAwaitingReview ? {
            id: 'fix',
            label: 'طلب تعديل',
            onAction: isSubmitting ? undefined : () => handleActionWithDelay('fix')
          } : {
            id: 'reject',
            label: 'رفض',
            onAction: isSubmitting ? undefined : () => handleActionWithDelay('reject')
          }}
        />
        <Box paddingX={3} style={{ paddingBottom: 8 }}>
          <Text role="caption" tone={selected ? 'brand' : 'muted'}>
            {selected ? 'التفاصيل معروضة بالأسفل' : 'انقر على البطاقة لعرض تفاصيل المتجر المرسلة من الميداني'}
          </Text>
        </Box>
      </Pressable>
    </Surface>
  );
}
function ControlPanelDshPartnerDeactivationTab() {
  const [partnerStatuses, setPartnerStatuses] = React.useState<Record<string, DshPartnerActivationStatus>>({});
  const [selectedPartnerId, setSelectedPartnerId] = React.useState('partner-saha');
  const [actionMessage, setActionMessage] = React.useState('اختر شريكاً لإلغاء تفعيله أو مراجعة سبب إيقافه.');

  React.useEffect(() => {
    setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
  }, []);

  const currentStatus = partnerStatuses[selectedPartnerId] ?? getPartnerActivationStatus(selectedPartnerId);
  const currentPartner = PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === selectedPartnerId) || PARTNER_FULFILLMENT_AGREEMENTS[0] || { partnerId: selectedPartnerId, storeName: 'شريك غير معروف', categoryLabel: '', modes: [] };

  const handleDeactivateConfirm = (partnerId: string, reason: string, note: string) => {
    updatePartnerActivationStatus(partnerId, 'partner_deactivated');
    setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
    setActionMessage(`تم إلغاء تفعيل الشريك بنجاح. السبب: ${reason} · الملاحظة: ${note}`);
  };

  const isDeactivated = currentStatus === 'partner_deactivated';

  return (
    <Box gap={4}>
      {/* Partner selector chips */}
      <Box gap={2}>
        <Text role="caption" tone="brand">اختر الشريك لإجراءات إلغاء التفعيل</Text>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {PARTNER_FULFILLMENT_AGREEMENTS.map((partner) => {
            const status = partnerStatuses[partner.partnerId] ?? getPartnerActivationStatus(partner.partnerId);
            const isActive = selectedPartnerId === partner.partnerId;
            return (
              <Pressable
                key={partner.partnerId}
                onPress={() => {
                  setSelectedPartnerId(partner.partnerId);
                  setActionMessage(`تم تحديد الشريك: ${partner.storeName}`);
                }}
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
                    {partner.storeName} ({status === 'partner_deactivated' ? 'ملغى التفعيل' : 'نشط/جاهز'})
                  </Text>
                </Surface>
              </Pressable>
            );
          })}
        </Box>
      </Box>

      <div className={styles.surfaceSplitGrid}>
        <Box gap={4}>
          {isDeactivated ? (
            <Surface tone="raised" padding={5} gap={3} radiusToken="lg">
              <Text role="titleLg" tone="danger">الشريك ملغى التفعيل</Text>
              <Text role="bodyMd" tone="muted">
                تم إلغاء تفعيل متجر <strong>{currentPartner.storeName}</strong> بالكامل من لوحة التحكم ولا يمكنه استقبال طلبات العملاء.
              </Text>
              <Surface tone="inset" padding={3} radiusToken="sm" border borderTone="line">
                <Text role="caption" tone="brand">الملاحظة التشغيلية الحالية:</Text>
                <Box style={{ marginVertical: 4 }}>
                  <Text role="bodySm" tone="default">
                    الشريك في حالة تعطيل بسبب خلل في الامتثال أو بطلب مباشر. يجب إعادة مراجعة المستندات لإعادة التفعيل.
                  </Text>
                </Box>
              </Surface>
              <Box style={{ marginVertical: 8 }}>
                <WebControlPanelActionCluster
                  primary={{
                    id: 'reset',
                    label: 'إعادة تعيين إلى التقديم الأولي',
                    onAction: () => {
                      updatePartnerActivationStatus(selectedPartnerId, 'submitted');
                      setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
                      setActionMessage('تم إعادة تعيين حالة الشريك إلى التقديم الأولي.');
                    }
                  }}
                />
              </Box>
            </Surface>
          ) : (
            <PartnerDeactivationWorkspace
              partnerId={selectedPartnerId}
              partnerName={currentPartner.storeName}
              auditRequired={true}
              onConfirmDeactivate={handleDeactivateConfirm}
            />
          )}
        </Box>

        <Box gap={4}>
          <WebControlPanelRecommendation
            title="إجراءات إلغاء التفعيل"
            reason={actionMessage}
            confidence="high"
            auditTag="NEEDS_BINDING_LATER"
          />
        </Box>
      </div>
    </Box>
  );
}

export function ControlPanelDshPartnerHubScreen() {
  const partnersGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('partners'), []);
  const marketingGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('marketing'), []);
  const catalogsGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('catalogs'), []);
  const [activeTab, setActiveTab] = React.useState<PartnerWorkspaceTabId>('inbox');
  const [activeSubTab, setActiveSubTab] = React.useState<string>('registration');
  const [items, setItems] = React.useState<ApprovalRecord[]>([]);
  const [selectedStoreId, setSelectedStoreId] = React.useState<string | null>(null);
  const [selectedStoreDetail, setSelectedStoreDetail] = React.useState<PartnerStoreDetail | null>(null);
  const [selectedStoreDetailLoading, setSelectedStoreDetailLoading] = React.useState(false);
  const [selectedStoreDetailError, setSelectedStoreDetailError] = React.useState<string | null>(null);
  const [intakeRefreshError, setIntakeRefreshError] = React.useState<string | null>(null);
  const [lastIntakeRefreshAt, setLastIntakeRefreshAt] = React.useState<string | null>(null);

  const refresh = React.useCallback(() => {
    const staticItems = getPartnerIntakeItems();
    const client = getPartnerStoreOnboardingRuntimeClient();

    return client.getPendingReviewStores()
      .then(data => {
        if (Array.isArray(data)) {
          const liveItems: ApprovalRecord[] = data.map(store => {
            const existing = staticItems.find(item => item.id === store.id);
            return {
              id: store.id,
              entityType: 'store',
              source: 'app-field',
              stage: existing ? existing.stage : 'field-submitted',
              title: store.name,
              submittedAt: store.created_at || new Date().toISOString(),
              auditTrail: existing ? existing.auditTrail : [],
              metadata: {
                address: store.address,
                categoryId: store.category_id,
                publishStage: store.publish_stage,
                supportsPickup: store.supports_pickup,
                supportsPartnerDelivery: store.supports_partner_delivery,
              }
            };
          });

          setItems(liveItems);
          setIntakeRefreshError(null);
          setLastIntakeRefreshAt(new Date().toISOString());
        }
      })
      .catch(err => {
        console.error('Failed to fetch pending review stores from backend:', err);
        setIntakeRefreshError('تعذر تحديث طلبات التسجيل من الباكيند. يتم عرض آخر بيانات ناجحة بدلاً من تفريغ القائمة.');
      });
  }, []);
  const pendingCount = React.useMemo(
    () => items.filter(i => ['partner-submitted', 'field-submitted', 'partner-review', 'marketing-review'].includes(i.stage)).length,
    [items],
  );
  const activePartnersCount = PARTNER_FULFILLMENT_AGREEMENTS.length;
  const activeZoneCount = partnerCoveragePreviewZones.filter(z => z.status === 'active').length;
  const selectedItem = React.useMemo(
    () => items.find(item => item.id === selectedStoreId) ?? null,
    [items, selectedStoreId],
  );

  React.useEffect(() => {
    void refresh();

    const handleFocus = () => {
      void refresh();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void refresh();
      }
    };

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void refresh();
      }
    }, 5000);

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refresh]);

  React.useEffect(() => {
    if (!selectedStoreId && items.length > 0) {
      setSelectedStoreId(items[0].id);
      return;
    }

    if (selectedStoreId && items.length > 0 && !items.some(item => item.id === selectedStoreId)) {
      setSelectedStoreId(items[0].id);
    }

    if (items.length === 0 && selectedStoreId) {
      setSelectedStoreId(null);
    }
  }, [items, selectedStoreId]);

  React.useEffect(() => {
    if (!selectedStoreId) {
      setSelectedStoreDetail(null);
      setSelectedStoreDetailError(null);
      return;
    }

    let active = true;
    const client = getPartnerStoreOnboardingRuntimeClient();

    setSelectedStoreDetailLoading(true);
    setSelectedStoreDetailError(null);

    client.getStoreDetail(selectedStoreId)
      .then(detail => {
        if (active) {
          setSelectedStoreDetail(detail);
        }
      })
      .catch(err => {
        console.error('Failed to fetch selected store detail from backend:', err);
        if (active) {
          setSelectedStoreDetail(null);
          setSelectedStoreDetailError('تعذر تحميل تفاصيل المتجر المحدد من الباكيند. يتم عرض ملخص البطاقة المتاح حالياً.');
        }
      })
      .finally(() => {
        if (active) {
          setSelectedStoreDetailLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedStoreId]);
  const handleAction = (id: string, action: 'approve' | 'reject' | 'fix' | 'activate') => {
    if (action === 'approve') {
      moveApprovalRecordToStage(id, 'marketing-review', 'control-panel-partners', 'قبول للمراجعة التسويقية');
    } else if (action === 'activate') {
      moveApprovalRecordToStage(id, 'catalog-adopted', 'control-panel-partners', 'تفعيل الشريك');
    } else if (action === 'reject') {
      moveApprovalRecordToStage(id, 'rejected', 'control-panel-partners', 'رفض');
    } else if (action === 'fix') {
      moveApprovalRecordToStage(id, 'needs-fix', 'control-panel-partners', 'طلب تعديل');
    }
    void refresh();
  };

  const renderInboxWorkspace = () => {
    if (activeSubTab === 'registration') {
      return (
        <Box gap={3}>
          {intakeRefreshError ? (
            <Surface padding={3} tone="inset" radiusToken="sm" border borderTone="line">
              <Text role="bodySm" tone="danger">{intakeRefreshError}</Text>
            </Surface>
          ) : null}
          {lastIntakeRefreshAt ? (
            <Text role="caption" tone="muted">
              آخر تحديث حي: {new Date(lastIntakeRefreshAt).toLocaleTimeString('ar')}
            </Text>
          ) : null}
          {selectedItem ? (
            <PartnerStoreIntakeDetailsPanel
              item={selectedItem}
              detail={selectedStoreDetail}
              loading={selectedStoreDetailLoading}
              error={selectedStoreDetailError}
            />
          ) : null}
          {items.length === 0 ? (
            <Surface padding={8} align="center" tone="raised" radiusToken="lg">
              <Text tone="muted">لا توجد طلبات واردة حالياً</Text>
            </Surface>
          ) : (
            items.map((item) => (
              <PartnerApprovalCard
                key={item.id}
                item={item}
                onAction={handleAction}
                onInspect={(nextItem) => setSelectedStoreId(nextItem.id)}
                selected={selectedStoreId === item.id}
              />
            ))
          )}
        </Box>
      );
    }

    if (activeSubTab === 'modifications') {
      return <PartnerModificationsWorkspace />;
    }

    if (activeSubTab === 'complaints') {
      return <PartnerComplaintsWorkspace />;
    }

    return (
      <Surface padding={6} align="center" tone="raised" radiusToken="lg" gap={2}>
        <Box align="center" gap={1}>
          <Text role="titleSm" tone="brand">لا توجد قائمة مستقلة لهذا المسار الآن</Text>
          <Text tone="muted">يظهر هذا التبويب كحالة N/A واضحة إلى أن ينتج له queue مملوك داخل الشركاء، من دون خلق شاشة وهمية أو مسار مكرر.</Text>
        </Box>
      </Surface>
    );
  };

  const primaryTabs = PARTNER_PRIMARY_TABS.map((tab) => ({ ...tab, active: activeTab === tab.id }));

  const activeSubTabs = React.useMemo(
    () => (PARTNER_SUB_TAB_DEFINITIONS[activeTab] ?? []).map(t => ({ ...t, active: t.id === activeSubTab })),
    [activeTab, activeSubTab],
  );

  React.useEffect(() => {
    setActiveSubTab(PARTNER_SUB_TAB_DEFINITIONS[activeTab]?.[0]?.id ?? '');
  }, [activeTab]);

  return (
    <div className={styles.surfaceCockpit} dir="rtl">
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.surfaceHeaderIconBox} aria-hidden="true">
            <div className={styles.surfaceHeaderGlyph}>
              <div className={styles.surfaceHeaderGlyphMinus} />
            </div>
          </div>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>شركاء DSH</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>مراجعة الشريك</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>حوكمة الشركاء، التغطية، وأهلية مسار المزايا والعروض</p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>شركاء نشطون</span>
              <span className={styles.commandKpiValue}>{activePartnersCount}</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>طلبات معلقة</span>
              <span className={`${styles.commandKpiValue} ${pendingCount > 0 ? styles.commandKpiValueAlert : ''}`}>{pendingCount}</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>مناطق نشطة</span>
              <span className={`${styles.commandKpiValue} ${styles.commandKpiValueSuccess}`}>{activeZoneCount}/{partnerCoveragePreviewZones.length}</span>
            </div>
          </div>
        </div>
      </header>

      <nav className={styles.navigationDock}>
        <WebControlPanelLaneTabs items={primaryTabs} onSelect={(id) => setActiveTab(id as PartnerWorkspaceTabId)} />
      </nav>

      <div className={styles.filterDock}>
        {activeSubTabs.length > 0 && (
          <WebControlPanelSubTabs
            items={activeSubTabs}
            onSelect={(id) => setActiveSubTab(id)}
          />
        )}
      </div>

      <Box padding={4} gap={3}>
        <Surface padding={3} tone="inset" radiusToken="lg" border borderTone="line">
          <Text role="titleSm">ملكية دورة حياة الشريك</Text>
          <Text role="bodySm" tone="muted">
            {partnersGovernance?.notes ?? 'قسم الشركاء يملك onboarding والاعتماد والجاهزية والتعطيل، بينما الشريك والميدان يجمعان البيانات فقط.'}
          </Text>
          <Text role="caption" tone="muted">
            {`تسليم: ${marketingGovernance?.sectionLabel ?? 'التسويق'} للعروض، ${catalogsGovernance?.sectionLabel ?? 'الكتالوجات'} لاعتماد الكتالوج، ولا يوجد تفعيل نهائي من app-partner.`}
          </Text>
        </Surface>
      </Box>

      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box padding={4} gap={4}>
            <React.Suspense fallback={<WorkspaceSkeleton />}>
              {activeTab === 'deactivation' ? (
                <ControlPanelDshPartnerDeactivationTab />
              ) : activeTab === 'performance' ? (
                <PartnerPerformanceWorkspace activeSubTab={activeSubTab} />
              ) : activeTab === 'eligibility' ? (
                <DshPartnerPromotionEligibilityScreen />
              ) : activeTab === 'topology' ? (
                <PartnerTopologyLane />
              ) : activeTab === 'contracts' ? (
                <PartnerFulfillmentLane />
              ) : activeTab === 'activation' ? (
                <ControlPanelDshPartnerActivationScreen />
              ) : activeTab === 'documents' ? (
                <ControlPanelDshPartnerDocumentReviewScreen />
              ) : activeTab === 'readiness_escalations' ? (
                <ReadinessEscalationsWorkspace />
              ) : activeTab === 'readiness_approvals' ? (
                <ReadinessApprovalsWorkspace />
              ) : activeTab === 'overrides' ? (
                <PartnerCatalogOverridesWorkspace />
              ) : activeTab === 'inbox' ? (
                renderInboxWorkspace()
              ) : (
                <Surface padding={6} align="center" tone="raised" radiusToken="lg" gap={2}>
                  <Box align="center" gap={1}>
                    <Text role="titleSm" tone="brand">المسار معروض كحالة واضحة وليس كفراغ</Text>
                    <Text tone="muted">عند غياب queue مملوك لهذا التبويب نعرض N/A صريحة بدل شاشة عامة أو placeholder مكرر.</Text>
                  </Box>
                </Surface>
              )}
            </React.Suspense>
          </Box>
        </div>
      </main>
    </div>
  );
}

export function ControlPanelDshPartnerApprovalsScreen() {
  return <ControlPanelDshPartnerHubScreen />;
}

export default ControlPanelDshPartnerApprovalsScreen;
