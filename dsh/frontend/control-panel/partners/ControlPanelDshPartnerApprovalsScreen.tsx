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
import type { DshPartnerActivationStatus } from '../../shared/dsh-partner-activation.model';
import { partnerCoveragePreviewZones } from '../../data/partner.preview-data';

const SUB_TAB_DEFINITIONS: Record<string, { id: string; label: string }[]> = {
  inbox: [
    { id: 'registration', label: 'طلبات التسجيل' },
    { id: 'modifications', label: 'تعديل البيانات' },
    { id: 'complaints', label: 'شكاوى الشركاء' },
  ],
  performance: [
    { id: 'performance', label: 'الأداء والسعة' },
    { id: 'disputes', label: 'النزاعات والاستئناف' },
    { id: 'visibility', label: 'الظهور والإيقاف' },
  ],
  eligibility: [
    { id: 'benefits', label: 'المزايا والعروض' },
  ],
};

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

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleActionWithDelay = (actionType: 'approve' | 'reject' | 'fix' | 'activate') => {
    setIsSubmitting(true);
    setTimeout(() => {
      onAction(item.id, actionType);
      setIsSubmitting(false);
    }, 600);
  };

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
  const currentPartner = PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === selectedPartnerId) || PARTNER_FULFILLMENT_AGREEMENTS[0];

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

  const pendingCount = React.useMemo(
    () => items.filter(i => ['partner-submitted', 'field-submitted', 'partner-review', 'marketing-review'].includes(i.stage)).length,
    [items],
  );
  const activePartnersCount = PARTNER_FULFILLMENT_AGREEMENTS.length;
  const activeZoneCount = partnerCoveragePreviewZones.filter(z => z.status === 'active').length;

  React.useEffect(() => {
    refresh();
  }, []);

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
    refresh();
  };

  const renderInboxWorkspace = () => {
    if (activeSubTab === 'registration') {
      return (
        <Box gap={3}>
          {items.length === 0 ? (
            <Surface padding={8} align="center" tone="raised" radiusToken="lg">
              <Text tone="muted">لا توجد طلبات واردة حالياً</Text>
            </Surface>
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
      <Surface padding={6} align="center" tone="raised" radiusToken="lg" gap={2}>
        <Box align="center" gap={1}>
          <Text role="titleSm" tone="brand">لا توجد قائمة مستقلة لهذا المسار الآن</Text>
          <Text tone="muted">يظهر هذا التبويب كحالة N/A واضحة إلى أن ينتج له queue مملوك داخل الشركاء، من دون خلق شاشة وهمية أو مسار مكرر.</Text>
        </Box>
      </Surface>
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

  const activeSubTabs = React.useMemo(
    () => (SUB_TAB_DEFINITIONS[activeTab] ?? []).map(t => ({ ...t, active: t.id === activeSubTab })),
    [activeTab, activeSubTab],
  );

  React.useEffect(() => {
    setActiveSubTab(SUB_TAB_DEFINITIONS[activeTab]?.[0]?.id ?? '');
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
        <WebControlPanelLaneTabs items={PRIMARY_TABS} onSelect={(id) => setActiveTab(id)} />
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
            {`handoff: ${marketingGovernance?.sectionLabel ?? 'Marketing'} للعروض، ${catalogsGovernance?.sectionLabel ?? 'Catalogs'} لاعتماد الكتالوج، ولا يوجد تفعيل نهائي من app-partner.`}
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
