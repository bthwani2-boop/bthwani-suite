import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelLaneTabs,
  WebControlPanelSubTabs,
  WebControlPanelDecisionRow,
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

function PartnerControlWorkspace() {
  const controlRows = [
    {
      id: 'perf',
      label: 'مراجعة الأداء والتغطية',
      status: 'مراجعة',
      reason: 'تجميع الأداء، السعة، وتباطؤ الجاهزية ضمن مساحة الشركاء بدل تفريغه في operations.',
      action: 'فتح مسارات الخدمة',
    },
    {
      id: 'pause',
      label: 'إغلاق أو pause مؤقت',
      status: 'منضبط',
      reason: 'الإيقاف المؤقت يوضح أثره على الظهور والمسارات النشطة قبل أي قرار نهائي.',
      action: 'مراجعة الإيقاف',
    },
    {
      id: 'appeal',
      label: 'نزاعات واستئناف',
      status: 'يتطلب owner',
      reason: 'الاستئناف يبقى مملوكًا للشركاء مع handoff واضح إلى الدعم أو الكتالوج عند الحاجة.',
      action: 'فتح النزاع',
    },
    {
      id: 'capacity',
      label: 'سعة الشريك والضغط',
      status: 'مرئي',
      reason: 'ضغط الفرع والسعة يحددان هل المشكلة تشغيلية أم شريكًا قبل أي تصعيد.',
      action: 'فحص السعة',
    },
    {
      id: 'visibility',
      label: 'الخط الزمني للظهور',
      status: 'client gate',
      reason: 'التسلسل من الوثائق إلى الجاهزية إلى client visibility يظهر هنا بوضوح واحد.',
      action: 'فتح timeline',
    },
  ] as const;

  return (
    <Box gap={3}>
      {controlRows.map((row) => (
        <WebControlPanelDecisionRow
          key={row.id}
          entityId={row.id}
          entityLabel={row.label}
          status={row.status}
          statusTone={row.status === 'يتطلب owner' ? 'warning' : 'neutral'}
          recommendation={row.reason}
          primaryAction={{ id: `${row.id}-open`, label: row.action }}
        />
      ))}
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
              <PartnerDeactivationWorkspace />
            ) : activeTab === 'performance' ? (
              <PartnerControlWorkspace />
            ) : activeTab === 'eligibility' ? (
              <DshPartnerPromotionEligibilityScreen />
            ) : activeTab === 'topology' ? (
              <PartnerTopologyLane />
            ) : activeTab === 'contracts' ? (
              <PartnerFulfillmentLane />
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
