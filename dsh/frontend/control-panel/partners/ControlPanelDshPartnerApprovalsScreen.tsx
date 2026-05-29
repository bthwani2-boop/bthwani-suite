import React from 'react';
import { Box, Text, useTheme, Surface } from '@bthwani/ui-kit';
import {
  WebControlPanelLaneTabs,
  WebControlPanelSubTabs,
  WebControlPanelDecisionRow,
  WebControlPanelRecommendation,
} from '@bthwani/ui-kit/web';
import { getPartnerIntakeItems } from '../../shared/workflow';
import {
  ApprovalRecord,
  moveApprovalRecordToStage,
  translateStage,
  translateEntityType,
} from '../../shared/workflow';
import {
  mapApprovalStageToPartnerActivationStatus,
  resolveDshStoreClientVisibility,
} from '../../shared/dsh-client-visibility.model';
import { getDshControlPanelGovernanceEntry } from '../shared';
import styles from '../shared/control-panel-surface.module.css';
import { PartnerDeactivationWorkspace } from './PartnerDeactivationWorkspace';
import { PartnerFulfillmentLane } from './PartnerFulfillmentLane';
import { PartnerTopologyLane } from './PartnerTopologyLane';
import { DshPartnerPromotionEligibilityScreen } from './DshPartnerPromotionEligibilityScreen';
import { ControlPanelDshPartnerActivationScreen, ControlPanelDshPartnerDocumentReviewScreen } from './PartnerManagementScreens';
import { PartnerCatalogOverridesWorkspace } from './PartnerCatalogOverridesWorkspace';
import { PartnerPerformanceWorkspace } from './PartnerPerformanceWorkspace';
import { PartnerModificationsWorkspace } from './PartnerModificationsWorkspace';
import { PartnerComplaintsWorkspace } from './PartnerComplaintsWorkspace';
import {
  PARTNER_FULFILLMENT_AGREEMENTS,
  getPartnerActivationStatus,
  updatePartnerActivationStatus,
  getAllPartnerActivationStatuses,
} from './workflow';
import type { DshPartnerActivationStatus } from '../../shared/dsh-partner-activation.model';

// ML-001: approval action extended to include final ops activation step for marketing-approved records
function PartnerApprovalCard({ item, onAction }: { item: ApprovalRecord; onAction: (id: string, action: 'approve' | 'reject' | 'fix' | 'activate') => void }) {
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

  return (
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
        label: 'تفعيل الشريك',
        onAction: () => onAction(item.id, 'activate')
      } : isAwaitingReview ? {
        id: 'approve',
        label: 'قبول للمراجعة',
        onAction: () => onAction(item.id, 'approve')
      } : undefined}
      secondaryAction={isAwaitingReview ? {
        id: 'fix',
        label: 'طلب تعديل',
        onAction: () => onAction(item.id, 'fix')
      } : {
        id: 'reject',
        label: 'رفض',
        onAction: () => onAction(item.id, 'reject')
      }}
    />
  );
}



function ControlPanelDshPartnerDeactivationTab() {
  const { theme } = useTheme();
  const [partnerStatuses, setPartnerStatuses] = React.useState<Record<string, DshPartnerActivationStatus>>({});
  const [selectedPartnerId, setSelectedPartnerId] = React.useState('partner-saha');
  const [actionMessage, setActionMessage] = React.useState('اختر شريكاً لإلغاء تفعيله أو مراجعة سبب إيقافه.');

  React.useEffect(() => {
    setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
  }, []);

  const currentStatus = partnerStatuses[selectedPartnerId] ?? getPartnerActivationStatus(selectedPartnerId);
  const currentPartner = PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === selectedPartnerId) || PARTNER_FULFILLMENT_AGREEMENTS[0];

  const handleDeactivateConfirm = (partnerId: string, reason: string, note: string) => {
    updatePartnerActivationStatus(partnerId, 'partner_deactivated');
    setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
    setActionMessage(`تم إلغاء تفعيل الشريك بنجاح. السبب: ${reason} · الملاحظة: ${note}`);
  };

  const isDeactivated = currentStatus === 'partner_deactivated';

  return (
    <Box gap={4} style={{ direction: 'rtl' }}>
      {/* Partner selector chips */}
      <Box gap={2}>
        <Text role="caption" tone="brand" style={{ fontWeight: '800' }}>اختر الشريك لإجراءات إلغاء التفعيل</Text>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {PARTNER_FULFILLMENT_AGREEMENTS.map((partner) => {
            const status = partnerStatuses[partner.partnerId] ?? getPartnerActivationStatus(partner.partnerId);
            const isActive = selectedPartnerId === partner.partnerId;
            return (
              <button
                key={partner.partnerId}
                type="button"
                onClick={() => {
                  setSelectedPartnerId(partner.partnerId);
                  setActionMessage(`تم تحديد الشريك: ${partner.storeName}`);
                }}
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
                {partner.storeName} ({status === 'partner_deactivated' ? 'ملغى التفعيل' : 'نشط/جاهز'})
              </button>
            );
          })}
        </Box>
      </Box>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
        <Box gap={4}>
          {isDeactivated ? (
            <Surface tone="raised" padding={5} gap={3} style={{ borderRadius: '16px' }}>
              <Text role="titleLg" style={{ fontWeight: '900', color: theme.danger }}>الشريك ملغى التفعيل</Text>
              <Text role="bodyMd" tone="muted">
                تم إلغاء تفعيل متجر <strong>{currentPartner.storeName}</strong> بالكامل من لوحة التحكم ولا يمكنه استقبال طلبات العملاء.
              </Text>
              <Box style={{ background: theme.surfaceInset, padding: '12px', borderRadius: '10px', border: `1px solid ${theme.line}` }}>
                <Text role="caption" tone="brand">الملاحظة التشغيلية الحالية:</Text>
                <Text role="bodySm" style={{ marginTop: '4px' }}>
                  الشريك في حالة تعطيل بسبب خلل في الامتثال أو بطلب مباشر. يجب إعادة مراجعة المستندات لإعادة التفعيل.
                </Text>
              </Box>
              <button
                type="button"
                onClick={() => {
                  updatePartnerActivationStatus(selectedPartnerId, 'submitted');
                  setPartnerStatuses({ ...getAllPartnerActivationStatuses() });
                  setActionMessage('تم إعادة تعيين حالة الشريك إلى التقديم الأولي.');
                }}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  background: theme.brand,
                  color: theme.surface,
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                إعادة تعيين إلى التقديم الأولي (Reset to Submitted)
              </button>
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
            auditTag="UI_PREVIEW_ONLY"
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
  const [activeTab, setActiveTab] = React.useState<string>('inbox');
  const [activeSubTab, setActiveSubTab] = React.useState<string>('registration');
  const [items, setItems] = React.useState<ApprovalRecord[]>([]);

  const refresh = () => setItems(getPartnerIntakeItems());

  React.useEffect(() => {
    refresh();
  }, []);

  const handleAction = (id: string, action: 'approve' | 'reject' | 'fix' | 'activate') => {
    if (action === 'approve') {
      moveApprovalRecordToStage(id, 'marketing-review', 'control-panel-partners', 'قبول للمراجعة التسويقية');
    } else if (action === 'activate') {
      // ML-001: final ops activation — transitions marketing-approved partner to catalog-adopted (store goes live)
      moveApprovalRecordToStage(id, 'catalog-adopted', 'control-panel-partners', 'تفعيل الشريك');
    } else if (action === 'reject') {
      moveApprovalRecordToStage(id, 'rejected', 'control-panel-partners', 'رفض');
    } else if (action === 'fix') {
      moveApprovalRecordToStage(id, 'needs-fix', 'control-panel-partners', 'طلب تعديل');
    }
    refresh();
  };

  const renderInboxWorkspace = () => {
    if (activeSubTab === 'registration') {
      return (
        <Box gap={3}>
          {items.length === 0 ? (
            <Box padding={8} align="center" background="surfaceRaised" radiusToken="lg">
              <Text tone="muted">لا توجد طلبات واردة حالياً</Text>
            </Box>
          ) : (
            items.map((item) => (
              <PartnerApprovalCard key={item.id} item={item} onAction={handleAction} />
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
      <Box padding={6} align="center" background="surfaceRaised" radiusToken="lg" gap={2}>
        <Box align="center" gap={1}>
          <Text role="titleSm" tone="brand" style={{ fontWeight: '800' }}>لا توجد قائمة مستقلة لهذا المسار الآن</Text>
          <Text tone="muted">يظهر هذا التبويب كحالة N/A واضحة إلى أن ينتج له queue مملوك داخل الشركاء، من دون خلق شاشة وهمية أو مسار مكرر.</Text>
        </Box>
      </Box>
    );
  };

  const PRIMARY_TABS = [
    { id: 'inbox', label: 'الوارد الجديد', active: activeTab === 'inbox' },
    { id: 'activation', label: 'تفعيل الشريك', active: activeTab === 'activation' },
    { id: 'documents', label: 'وثائق الشركاء', active: activeTab === 'documents' },
    { id: 'overrides', label: 'تجاوزات الكتالوج', active: activeTab === 'overrides' },
    { id: 'performance', label: 'الأداء والامتثال', active: activeTab === 'performance' },
    { id: 'eligibility', label: 'أهلية الترويج', active: activeTab === 'eligibility' },
    { id: 'topology', label: 'مسارات الخدمة', active: activeTab === 'topology' },
    { id: 'contracts', label: 'إدارة العقود والامتثال', active: activeTab === 'contracts' },
    { id: 'deactivation', label: 'إلغاء التفعيل', active: activeTab === 'deactivation' },
  ];

  const SECONDARY_TABS: Record<string, { id: string; label: string; active?: boolean }[]> = {
    inbox: [
      { id: 'registration', label: 'طلبات التسجيل', active: activeSubTab === 'registration' },
      { id: 'modifications', label: 'تعديل البيانات', active: activeSubTab === 'modifications' },
      { id: 'complaints', label: 'شكاوى الشركاء', active: activeSubTab === 'complaints' },
    ],
    performance: [
      { id: 'performance', label: 'الأداء والسعة', active: activeSubTab === 'performance' },
      { id: 'disputes', label: 'النزاعات والاستئناف', active: activeSubTab === 'disputes' },
      { id: 'visibility', label: 'الظهور والإيقاف', active: activeSubTab === 'visibility' },
    ],
    eligibility: [
      { id: 'benefits', label: 'المزايا والعروض', active: activeSubTab === 'benefits' },
    ],
  };

  React.useEffect(() => {
    if (SECONDARY_TABS[activeTab]?.length > 0) {
      setActiveSubTab(SECONDARY_TABS[activeTab][0].id);
    } else {
      setActiveSubTab('');
    }
  }, [activeTab]);

  return (
    <div className={styles.surfaceCockpit}>
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
              <span className={styles.commandKpiValue}>١,٢٥٤</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>طلبات معلقة</span>
              <span className={`${styles.commandKpiValue} ${styles.commandKpiValueAlert}`}>٢٨</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>تغطية المناطق</span>
              <span className={`${styles.commandKpiValue} ${styles.commandKpiValueSuccess}`}>٨٤٪</span>
            </div>
          </div>
        </div>
      </header>

      <nav className={styles.navigationDock}>
        <WebControlPanelLaneTabs items={PRIMARY_TABS} onSelect={(id) => setActiveTab(id)} />
      </nav>

      <div className={styles.filterDock}>
        {SECONDARY_TABS[activeTab] && (
          <WebControlPanelSubTabs
            items={SECONDARY_TABS[activeTab]}
            onSelect={(id) => setActiveSubTab(id)}
          />
        )}
      </div>

      <Box padding={4} gap={3}>
        <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line">
          <Text role="titleSm">ملكية دورة حياة الشريك</Text>
          <Text role="bodySm" tone="muted">
            {partnersGovernance?.notes ?? 'قسم الشركاء يملك onboarding والاعتماد والجاهزية والتعطيل، بينما الشريك والميدان يجمعان البيانات فقط.'}
          </Text>
          <Text role="caption" tone="muted">
            {`handoff: ${marketingGovernance?.sectionLabel ?? 'Marketing'} للعروض، ${catalogsGovernance?.sectionLabel ?? 'Catalogs'} لاعتماد الكتالوج، ولا يوجد تفعيل نهائي من app-partner.`}
          </Text>
        </Box>
      </Box>

      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box padding={4} gap={4}>
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
            ) : activeTab === 'overrides' ? (
              <PartnerCatalogOverridesWorkspace />
            ) : activeTab === 'inbox' && activeSubTab === 'registration' ? (
              renderInboxWorkspace()
            ) : activeTab === 'inbox' ? (
              renderInboxWorkspace()
            ) : (
              <Box padding={6} align="center" background="surfaceRaised" radiusToken="lg" gap={2}>
                <Box align="center" gap={1}>
                  <Text role="titleSm" tone="brand" style={{ fontWeight: '800' }}>المسار معروض كحالة واضحة وليس كفراغ</Text>
                  <Text tone="muted">عند غياب queue مملوك لهذا التبويب نعرض N/A صريحة بدل شاشة عامة أو placeholder مكرر.</Text>
                </Box>
              </Box>
            )}

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
