'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import type { ControlPanelDshMarketingScreenProps as SmartSignalLayerScreenProps } from './SmartSignalLayerScreen';

const SmartSignalLayerScreen = React.lazy(() => import('./SmartSignalLayerScreen').then(m => ({ default: m.ControlPanelDshMarketingScreen })));
const BannersCommandDeckScreen = React.lazy(() => import('./BannersCommandDeckScreen').then(m => ({ default: m.BannersCommandDeckScreen })));
const GrowthCommandDeckScreen = React.lazy(() => import('./GrowthCommandDeckScreen').then(m => ({ default: m.GrowthCommandDeckScreen })));
const VideosCommandDeckScreen = React.lazy(() => import('./VideosCommandDeckScreen').then(m => ({ default: m.VideosCommandDeckScreen })));
const LoyaltyCommandDeckScreen = React.lazy(() => import('./LoyaltyCommandDeckScreen').then(m => ({ default: m.LoyaltyCommandDeckScreen })));
const PromosCommandDeckScreen = React.lazy(() => import('./PromosCommandDeckScreen').then(m => ({ default: m.PromosCommandDeckScreen })));
const CampaignsCommandDeckScreen = React.lazy(() => import('./CampaignsCommandDeckScreen').then(m => ({ default: m.CampaignsCommandDeckScreen })));
const PartnerOffersCommandDeckScreen = React.lazy(() => import('./PartnerOffersCommandDeckScreen').then(m => ({ default: m.PartnerOffersCommandDeckScreen })));
const MarketingMediaReviewCommandDeckScreen = React.lazy(() => import('./MarketingMediaReviewCommandDeckScreen').then(m => ({ default: m.MarketingMediaReviewCommandDeckScreen })));
const VisibilityCommandDeckScreen = React.lazy(() => import('./VisibilityCommandDeckScreen').then(m => ({ default: m.VisibilityCommandDeckScreen })));
const TickerCommandDeckScreen = React.lazy(() => import('./TickerCommandDeckScreen').then(m => ({ default: m.TickerCommandDeckScreen })));
const MarketingReviewQueueScreen = React.lazy(() => import('./MarketingReviewQueue').then(m => ({ default: m.MarketingReviewQueue })));
const MarketingApprovalScreen = React.lazy(() => import('./ControlPanelDshMarketingApprovalScreen').then(m => ({ default: m.ControlPanelDshMarketingApprovalScreen })));
const VideoReviewScreen = React.lazy(() => import('./ControlPanelDshVideoSubmissionsReviewScreen').then(m => ({ default: m.ControlPanelDshVideoSubmissionsReviewScreen })));

function WorkspaceSkeleton() {
  return (
    <Box padding={6} align="center" background="surfaceRaised" radiusToken="lg" gap={4} style={{ width: '100%', height: '100%' }}>
      <Text role="titleSm" tone="muted">جارٍ التحميل...</Text>
    </Box>
  );
}

import styles from '../shared/control-panel-surface.module.css';
import marketingStyles from './control-panel-marketing.module.css';
import { dshPromotionCandidates } from '../../shared/state-machines/workflow';
import { getDshControlPanelGovernanceEntry } from '../shared';
import type { MarketingControlView } from './types';



/**
 * Audit / History / Rollback Preview:
 * - publish / approval / toggle / visibility actions:
 *   - audit? API-later (via signal layer/events)
 *   - history? API-later (history log)
 *   - rollback? UI-only (pause/draft toggle)
 *   - reason/comment? UI-only now
 *   - before/after preview? UI-only (local visual grid/preview)
 *   - UI-only? Yes (currently simulated/preview states)
 *   - API-later? Yes (backend mutation boundary)
 *
 * Error Handling Closure:
 * - network: API-later (currently simulated/preview)
 * - validation: Top-level error messages (e.g. required fields, conflict targets)
 * - permission: UI disabled state via hasPermission contract
 * - not found: Auto-fallback or disabled action
 * - conflict: Toast/Alert blocker on duplicate/position conflict
 * - stale data: Handled via refresh() after every mutation
 * - blocked action: Handled via permission/validation state
 * - partial failure: API-later
 * - retry: API-later
 * - (No silent catch, success updates state and refreshes data)
 *
 * Empty / Loading / Blocked / Disabled Closure:
 * - loading: API-later (بيانات محاكاة حالياً، لا يوجد async fetch)
 * - empty: HANDLED — empty state واضح عند غياب العناصر
 * - error: HANDLED — رسالة خطأ صريحة عند فشل الإجراء
 * - blocked: HANDLED — الإجراء محجوب عند غياب الصلاحية أو البيانات
 * - disabled: HANDLED — الزر disabled عند عدم استيفاء الشروط
 * - success: HANDLED — الحالة تتحدث فور نجاح الإجراء
 * - retry: API-later
 * - guidance: HANDLED — توجيه نصي يظهر عند كل حالة فارغة أو محجوبة
 */
import type {
  CampaignAudience,
  CampaignPlacement,
  CampaignRecord,
  CampaignStatus,
  CampaignTargetType,
} from '../../shared/contracts/dsh-marketing-types';
import type {
  PartnerOfferRecord,
  PartnerOfferStatus,
} from '../../shared/contracts/dsh-partner-offer-types';
import {
  buildCommercialProjection,
  type CommercialCampaign,
  type CommercialLifecycleStatus,
  type PartnerOffer,
} from '../../shared/contracts/commercial-contract';
import {
  getCampaignVisibilityRecord,
  getPartnerOfferVisibilityRecord,
} from '../../shared/contracts/marketing-visibility.contract';
import {
  getDshPartnerActivationStateMetadata,
  type DshPartnerActivationStatus,
} from '../../shared/contracts/dsh-partner-activation.model';
import {
  getDshProductApprovalStateMetadata,
  type DshProductCategoryMappingStatus,
  type DshProductDuplicateStatus,
  type DshProductIdentityApprovalStatus,
} from '../../shared/contracts/dsh-product-identity.model';
import {
  resolveDshProductClientVisibility,
  resolveDshStoreClientVisibility,
} from '../../shared/contracts/dsh-client-visibility.model';
import {
  getDshSignalSummaries,
} from '../../shared/contracts/dsh-signal-layer.model';

export type ControlPanelDshMarketingScreenProps = SmartSignalLayerScreenProps;

type MarketingPartnerGateSeed = Record<'id' | 'title', string> & {
  status: DshPartnerActivationStatus;
  affectedSurface: 'app-partner' | 'app-client' | 'control-panel';
  routeTab: Extract<MarketingControlView, 'signals' | 'campaigns' | 'partners'>;
  routeLabel: string;
};

type MarketingProductGateSeed = Record<'id' | 'title', string> & {
  approvalStatus: DshProductIdentityApprovalStatus;
  partnerStatus: DshPartnerActivationStatus;
  categoryMappingStatus: DshProductCategoryMappingStatus;
  duplicateStatus: DshProductDuplicateStatus;
  deliveryModesReady: boolean;
  mediaPolicySatisfied: boolean;
  routeTab: Extract<MarketingControlView, 'media-review' | 'campaigns' | 'signals'>;
  routeLabel: string;
};

const PARTNER_GATE_PREVIEW: readonly MarketingPartnerGateSeed[] = [
  { id: 'partner-docs-missing', title: 'شريك ينتظر استكمال الوثائق قبل أي ظهور تسويقي', status: 'documents_missing', affectedSurface: 'app-partner', routeTab: 'signals', routeLabel: 'فتح الإشارات' },
  { id: 'partner-delivery-ready', title: 'شريك أكمل أوضاع التوصيل لكنه لم يصل بعد إلى ظهور العميل', status: 'delivery_modes_ready', affectedSurface: 'control-panel', routeTab: 'signals', routeLabel: 'فتح إشارات التسليم' },
  { id: 'partner-client-visible', title: 'شريك جاهز للحملات لأنه ظاهر فعليًا في app-client', status: 'client_visible', affectedSurface: 'app-client', routeTab: 'campaigns', routeLabel: 'فتح الحملات' },
];

const PRODUCT_GATE_PREVIEW: readonly MarketingProductGateSeed[] = [
  { id: 'product-marketing-review', title: 'منتج بانتظار اعتماد التسويق للنشر', approvalStatus: 'marketing_review', partnerStatus: 'delivery_modes_ready', categoryMappingStatus: 'mapped', duplicateStatus: 'clean', deliveryModesReady: true, mediaPolicySatisfied: false, routeTab: 'media-review', routeLabel: 'فتح مراجعة الميديا' },
  { id: 'product-ready-for-campaign', title: 'منتج اجتاز بوابات النشر وأصبح صالحًا للحملة', approvalStatus: 'client_visible', partnerStatus: 'client_visible', categoryMappingStatus: 'mapped', duplicateStatus: 'clean', deliveryModesReady: true, mediaPolicySatisfied: true, routeTab: 'campaigns', routeLabel: 'فتح الحملات' },
  { id: 'product-needs-fix', title: 'منتج محجوب عن الظهور بسبب publish blockers متعددة', approvalStatus: 'needs_fix', partnerStatus: 'catalog_ready', categoryMappingStatus: 'unmapped', duplicateStatus: 'possible_duplicate', deliveryModesReady: false, mediaPolicySatisfied: false, routeTab: 'media-review', routeLabel: 'فتح مسار التصحيح' },
];

function mapPartnerOfferStatusToCommercial(status: PartnerOfferStatus): CommercialLifecycleStatus {
  if (status === 'inbound') return 'inbound';
  if (status === 'review') return 'review';
  if (status === 'marketing-ready') return 'marketing-ready';
  if (status === 'published') return 'published';
  if (status === 'paused') return 'paused';
  if (status === 'archived') return 'archived';
  return 'rejected';
}

function mapCampaignStatusToCommercial(status: CampaignStatus): CommercialLifecycleStatus {
  if (status === 'draft') return 'draft';
  if (status === 'pending') return 'review';
  if (status === 'published') return 'published';
  if (status === 'paused') return 'paused';
  return 'archived';
}

function mapCampaignAudienceToCommercial(audience: CampaignAudience): CommercialCampaign['audience'] {
  if (audience === 'client' || audience === 'targeted') return 'customer';
  if (audience === 'operations') return 'operations';
  return 'all';
}

function mapCampaignPlacementToCommercial(placement: CampaignPlacement): CommercialCampaign['placements'] {
  if (placement === 'hero') return ['home-hero'];
  if (placement === 'feed') return ['home-feed'];
  if (placement === 'floating') return ['banner'];
  return ['banner'];
}

function mapCampaignTargetTypeToCommercial(targetType: CampaignTargetType): CommercialCampaign['targetType'] {
  if (targetType === 'campaign' || targetType === 'custom') return 'home';
  return targetType;
}

function mapPartnerOfferRecordToCommercial(record: PartnerOfferRecord): PartnerOffer {
  return {
    id: record.id,
    title: record.title,
    partnerName: record.partnerName,
    storeId: record.storeId,
    storeLabel: record.storeLabel,
    productId: record.productId || undefined,
    productLabel: record.productLabel || undefined,
    category: record.category,
    offerKind: record.offerType,
    status: mapPartnerOfferStatusToCommercial(record.status),
    source: record.source,
    target: record.productId ? 'product' : record.storeId ? 'store' : 'category',
    valueLabel: record.valueLabel,
    displayBadge: record.displayBadge,
    rejectionReason: record.rejectionReason,
    linkedCampaignId: record.linkedCampaignId,
    activeFromDate: record.activeFromDate,
    activeToDate: record.activeToDate,
    marginRiskNote: record.marginRiskNote,
    placement: 'store-card',
    measurement: { impressions: 0, clicks: 0 },
  };
}

function mapCampaignRecordToCommercial(record: CampaignRecord): CommercialCampaign {
  return {
    id: record.id,
    title: record.title,
    subtitle: record.subtitle,
    status: mapCampaignStatusToCommercial(record.status),
    priority: record.priority,
    goal: record.goal,
    audience: mapCampaignAudienceToCommercial(record.audience),
    placements: mapCampaignPlacementToCommercial(record.placement),
    channels: record.channels,
    targetType: mapCampaignTargetTypeToCommercial(record.targetType),
    targetId: record.targetId || undefined,
    linkedOfferId: record.linkedOfferId,
    linkedBannerId: record.linkedBannerId,
    linkedVideoId: record.linkedVideoId,
    linkedLoyaltyBenefitId: record.linkedLoyaltyBenefitId,
    startDate: record.startDate,
    endDate: record.endDate,
    measurement: {
      impressions: record.impressions,
      clicks: record.clicks,
    },
  };
}

export function ControlPanelDshMarketingScreen(props: ControlPanelDshMarketingScreenProps) {
  const marketingGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('marketing'), []);
  const catalogsGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('catalogs'), []);
  const partnersGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('partners'), []);
  const supportGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('support'), []);

  const [activeTab, setActiveTab] = React.useState<MarketingControlView>('visibility');
  const [activeSubTab, setActiveSubTab] = React.useState<string>('');

  const [partnerGates, setPartnerGates] = React.useState(() =>
    PARTNER_GATE_PREVIEW.map((gate) => ({ ...gate, bypassed: false }))
  );
  const [productGates, setProductGates] = React.useState(() =>
    PRODUCT_GATE_PREVIEW.map((product) => ({ ...product, bypassed: false }))
  );

  const partnerOfferRecords: PartnerOfferRecord[] = [];
  const campaignRecords: CampaignRecord[] = [];
  const partnerOfferRows = partnerOfferRecords.map((offer) => ({
    offer,
    visibility: getPartnerOfferVisibilityRecord(offer, { targetSurface: 'control-panel' }),
  }));
  const campaignRows = campaignRecords.map((campaign) => ({
    campaign,
    visibility: getCampaignVisibilityRecord(campaign, { targetSurface: 'control-panel' }),
  }));
  const commercialOffers = partnerOfferRows
    .filter((row) => !row.visibility.blockedReason && row.offer.status === 'published')
    .map((row) => mapPartnerOfferRecordToCommercial(row.offer));
  const commercialCampaigns = campaignRows
    .filter((row) => !row.visibility.blockedReason && row.campaign.status === 'published')
    .map((row) => mapCampaignRecordToCommercial(row.campaign));
  const commercialProjection = buildCommercialProjection({
    storeId: 'marketing-control-preview',
    partnerOffers: commercialOffers,
    campaigns: commercialCampaigns,
    sourceMap: {
      ...Object.fromEntries(partnerOfferRows.map(({ offer, visibility }) => [offer.id, {
        sourceOwner: 'partner-offer' as const,
        sourceRecordId: offer.id,
        lifecycleStatus: mapPartnerOfferStatusToCommercial(offer.status),
        conflictSeverity: visibility.blockedReason ? 'blocker' as const : offer.status === 'published' ? 'none' as const : 'warning' as const,
        conflictReason: visibility.blockedReason ?? (offer.status === 'published' ? undefined : `العرض ${offer.title} لم يصل بعد إلى حالة client-visible.`),
      }])),
      ...Object.fromEntries(campaignRows.map(({ campaign, visibility }) => [campaign.id, {
        sourceOwner: 'campaign' as const,
        sourceRecordId: campaign.id,
        lifecycleStatus: mapCampaignStatusToCommercial(campaign.status),
        conflictSeverity: visibility.blockedReason ? 'blocker' as const : campaign.status === 'published' ? 'none' as const : 'warning' as const,
        conflictReason: visibility.blockedReason ?? (campaign.status === 'published' ? undefined : `الحملة ${campaign.title} لا تزال خارج visibility gate.`),
      }])),
    },
  });

  const partnerGateRows = partnerGates.map((gate) => {
    const effectiveStatus = gate.bypassed ? 'client_visible' : gate.status;
    const visibility = resolveDshStoreClientVisibility({
      activationStatus: effectiveStatus,
      catalogPublished: effectiveStatus === 'client_visible' || effectiveStatus === 'partner_active',
      deliveryModesReady: effectiveStatus === 'delivery_modes_ready' || effectiveStatus === 'partner_active' || effectiveStatus === 'client_visible',
      serviceabilityAvailable: effectiveStatus === 'client_visible',
      storeOpen: true,
    });
    return { ...gate, clientVisible: visibility.visible };
  });

  const productGateRows = productGates.map((product) => {
    const effectiveApprovalStatus = product.bypassed ? 'client_visible' : product.approvalStatus;
    const effectivePartnerStatus = product.bypassed ? 'client_visible' : product.partnerStatus;
    const effectiveCategoryMappingStatus = product.bypassed ? 'mapped' : product.categoryMappingStatus;
    const effectiveDuplicateStatus = product.bypassed ? 'clean' : product.duplicateStatus;
    const effectiveDeliveryModesReady = product.bypassed ? true : product.deliveryModesReady;
    const effectiveMediaPolicySatisfied = product.bypassed ? true : product.mediaPolicySatisfied;

    const productVisibility = resolveDshProductClientVisibility({
      approvalStatus: effectiveApprovalStatus,
      activationStatus: effectivePartnerStatus,
      catalogPublished: effectivePartnerStatus === 'client_visible',
      deliveryModesReady: effectiveDeliveryModesReady,
      serviceabilityAvailable: effectivePartnerStatus === 'client_visible',
      categoryMappingStatus: effectiveCategoryMappingStatus,
      duplicateStatus: effectiveDuplicateStatus,
      mediaPolicySatisfied: effectiveMediaPolicySatisfied,
    });
    return { ...product, publishingBlocked: !productVisibility.visible, blockers: productVisibility.publishingPrerequisites.filter(i => !i.satisfied) };
  });

  const marketingSignalRows = getDshSignalSummaries('control-panel', 'ops').filter((signal) => (
    signal.kind === 'partner_submitted' || signal.kind === 'partner_docs_missing' || signal.kind === 'catalog_item_rejected' || signal.kind === 'catalog_published' || signal.kind === 'marketing_content_approved' || signal.kind === 'marketing_content_rejected' || signal.kind === 'marketing_content_needs_fix'
  ));

  const marketingHeaderMetrics = [
    {
      label: 'بوابات الشركاء',
      value: `${partnerGateRows.filter((row) => row.clientVisible).length} / ${partnerGateRows.length}`,
      trend: 'مسارات نشطة',
      trendTone: partnerGateRows.some((row) => !row.clientVisible) ? 'warning' : 'success',
    },
    {
      label: 'منتجات محجوبة',
      value: `${productGateRows.filter((row) => row.publishingBlocked).length} / ${productGateRows.length}`,
      trend: `${productGateRows.reduce((sum, row) => sum + row.blockers.length, 0)} موانع نشطة`,
      trendTone: productGateRows.some((row) => row.publishingBlocked) ? 'warning' : 'success',
    },
    {
      label: 'ظهور تجاري',
      value: String(commercialProjection.badges.length),
      trend: commercialProjection.isClientVisible ? 'جاهز للعملاء' : 'محجوب حالياً',
      trendTone: commercialProjection.isClientVisible ? 'success' : 'warning',
    },
    {
      label: 'إشارات غير مقروءة',
      value: String(marketingSignalRows.filter((signal) => signal.readState === 'unread').length),
      trend: `${dshPromotionCandidates.filter((candidate) => candidate.eligibility === 'eligible').length} مرشحين ترويج`,
      trendTone: marketingSignalRows.some((signal) => signal.priority === 'urgent') ? 'warning' : 'success',
    },
  ] as const;

  const PRIMARY_TABS = [
    { id: 'visibility', label: 'بوابات الظهور', icon: '' },
    { id: 'ticker', label: 'الشريط الذكي', icon: '' },
    { id: 'banners', label: 'البنرات والكارسول', icon: '' },
    { id: 'promos', label: 'بروموهات الرئيسية', icon: '' },
    { id: 'video', label: 'استوديو الفيديو', icon: '' },
    { id: 'campaigns', label: 'الحملات', icon: '' },
    { id: 'partners', label: 'عروض الشركاء', icon: '' },
    { id: 'media-review', label: 'مراجعة الصور والمنتجات', icon: '' },
    { id: 'loyalty', label: 'المزايا والاشتراك', icon: '' },
    { id: 'growth', label: 'النمو', icon: '' },
    { id: 'signals', label: 'الإشارات والقياس', icon: '' },
    { id: 'approval-queue', label: 'صف المراجعة', icon: '' },
    { id: 'video-review', label: 'مراجعة الفيديو', icon: '' },
  ] as const;

  const SECONDARY_TABS: Record<MarketingControlView, { id: string; label: string }[]> = {
    visibility: [
      { id: 'eligibility', label: 'الأهلية' },
      { id: 'suppression', label: 'الكبت' },
      { id: 'audit', label: 'التدقيق' },
      { id: 'segments', label: 'الشرائح' },
    ],
    ticker: [],
    banners: [],
    promos: [],
    video: [],
    campaigns: [],
    partners: [],
    'media-review': [],
    growth: [],
    signals: [
      { id: 'reach', label: 'الوصول' },
      { id: 'clicks', label: 'النقرات' },
      { id: 'conversion', label: 'التحويل' },
      { id: 'health', label: 'الصحة' },
    ],
    loyalty: [
      { id: 'overview', label: 'نظرة عامة' },
      { id: 'builder', label: 'المصمم' },
      { id: 'sync', label: 'المزامنة' },
    ],
    'approval-queue': [],
    'video-review': [],
  };

  React.useEffect(() => {
    if (SECONDARY_TABS[activeTab] && SECONDARY_TABS[activeTab].length > 0) {
      setActiveSubTab(SECONDARY_TABS[activeTab][0].id);
    } else {
      setActiveSubTab('');
    }
  }, [activeTab]);

  const renderActiveLane = () => {
    switch (activeTab) {
      case 'visibility':
        return (
          <VisibilityCommandDeckScreen
            activeSubTab={activeSubTab}
            setActiveTab={(tab: string) => setActiveTab(tab as MarketingControlView)}
            marketingHeaderMetrics={marketingHeaderMetrics}
            partnerGates={partnerGates}
            setPartnerGates={setPartnerGates}
            productGates={productGates}
            setProductGates={setProductGates}
          />
        );
      case 'ticker':
        return <TickerCommandDeckScreen />;
      case 'banners':
        return <BannersCommandDeckScreen activeSubTab={activeSubTab} hubHref={props.hubHref} operationsHref={props.operationsHref} />;
      case 'promos':
        return <PromosCommandDeckScreen />;
      case 'video':
        return <VideosCommandDeckScreen hubHref={props.hubHref} operationsHref={props.operationsHref} />;
      case 'campaigns':
        return <CampaignsCommandDeckScreen />;
      case 'media-review':
        return <MarketingMediaReviewCommandDeckScreen />;
      case 'partners':
        return <PartnerOffersCommandDeckScreen />;
      case 'growth':
        return <GrowthCommandDeckScreen hubHref={props.hubHref} operationsHref={props.operationsHref} setActiveTab={(tab) => setActiveTab(tab as MarketingControlView)} />;
      case 'signals':
        return <SmartSignalLayerScreen hubHref={props.hubHref} operationsHref={props.operationsHref} />;
      case 'loyalty':
        return <LoyaltyCommandDeckScreen />;
      case 'approval-queue':
        return <MarketingReviewQueueScreen />;
      case 'video-review':
        return <VideoReviewScreen />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.surfaceCockpit} dir="rtl">
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.surfaceHeaderIconBox} aria-hidden="true">
            <span className={marketingStyles.headerLetter}>ت</span>
          </div>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>تسويق DSH</h1>
              <Box paddingX={2} paddingY={1} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>اعتماد الأداء</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>حوكمة المحتوى التسويقي والنمو الاستراتيجي</p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            {marketingHeaderMetrics.map((metric) => (
              <div key={metric.label} className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>{metric.label}</span>
                <div className={styles.commandKpiTrend}>
                  <span className={styles.commandKpiValue}>{metric.value}</span>
                  <span className={`${styles.commandKpiTrendValue} ${metric.trendTone === 'success' ? marketingStyles.metricToneSuccess : marketingStyles.metricToneWarning}`}>
                    {metric.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <nav className={styles.navigationDock}>
        {PRIMARY_TABS.map((tab) => {
          const isSelected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              className={`${styles.surfaceTab} ${isSelected ? styles.surfaceTabActive : ''}`}
              onClick={() => setActiveTab(tab.id as MarketingControlView)}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {SECONDARY_TABS[activeTab] && SECONDARY_TABS[activeTab].length > 0 && (
        <div className={`${styles.filterDock} ${styles.filterDockTint} ${marketingStyles.subTabDock}`}>
          {SECONDARY_TABS[activeTab].map((sub) => {
            const isSelected = sub.id === activeSubTab;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setActiveSubTab(sub.id)}
                className={`${styles.surfaceTab} ${marketingStyles.subTabButton} ${isSelected ? marketingStyles.selectedSubTab : ''}`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      <Box paddingX={4} paddingY={2}>
        <div className={styles.surfacePulseCompact} style={{ justifyContent: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
          <span className={styles.commandKpiLabel} style={{ fontSize: '11px', alignSelf: 'center', margin: 0 }}>جسور الحوكمة التفاعلية:</span>
          <button
            type="button"
            onClick={() => setActiveTab('partners')}
            className={styles.surfaceMetaChip}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', border: `1px solid var(--bthwani-control-panel-border)` }}
          >
            <span>أهلية الشريك (Partners) ←</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media-review')}
            className={styles.surfaceMetaChip}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', border: `1px solid var(--bthwani-control-panel-border)` }}
          >
            <span>اعتماد الصور والكتالوج (Catalogs) ←</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signals')}
            className={styles.surfaceMetaChip}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', border: `1px solid var(--bthwani-control-panel-border)` }}
          >
            <span>إشارات الحوادث والتوصيات (Support) ←</span>
          </button>
        </div>
      </Box>

      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <React.Suspense fallback={<WorkspaceSkeleton />}>
            {renderActiveLane()}
          </React.Suspense>
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshMarketingScreen;
