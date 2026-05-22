'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  ControlPanelDshMarketingScreen as SmartSignalLayerScreen,
  type ControlPanelDshMarketingScreenProps as SmartSignalLayerScreenProps,
} from './SmartSignalLayerScreen';
import { BannersCommandDeckScreen } from './BannersCommandDeckScreen';
import { GrowthCommandDeckScreen } from './GrowthCommandDeckScreen';
import { VideosCommandDeckScreen } from './VideosCommandDeckScreen';
import { LoyaltyCommandDeckScreen } from './LoyaltyCommandDeckScreen';
import { PromosCommandDeckScreen } from './PromosCommandDeckScreen';
import { CampaignsCommandDeckScreen } from './CampaignsCommandDeckScreen';
import { PartnerOffersCommandDeckScreen } from './PartnerOffersCommandDeckScreen';
import { MarketingMediaReviewCommandDeckScreen } from './MarketingMediaReviewCommandDeckScreen';
import styles from '../shared/control-panel-surface.module.css';
import marketingStyles from './control-panel-marketing.module.css';
import {
  getMarketingTickerItems,
  upsertMarketingTickerItem,
  toggleMarketingTickerStatus,
  removeMarketingTickerItem,
  createMarketingTickerDraft,
  resolveMarketingTickerPreviewForItem,
  buildMarketingTickerPlan,
  resolveMarketingTickerSourceLabel,
  resolveMarketingTickerAudienceLabel,
  resolveMarketingTickerPriorityLabel,
  resolveMarketingTickerDeliveryLabel,
  resolveMarketingTickerPlanReasonLabel,
  resolveMarketingTickerStatusLabel,
  resolveMarketingTickerKindLabel,
  resolveMarketingTickerTargetLabel,
  pauseAllMarketingTickers,
  toggleMarketingTickerPinned,
  type MarketingNewsTickerItem,
  type MarketingNewsTickerAudience,
  type MarketingNewsTickerPriority,
  type MarketingNewsTickerSource,
  type MarketingNewsTickerStatus,
  type MarketingNewsTickerDeliveryMode,
  type MarketingNewsTickerKind,
} from '../../shared/news-ticker.preview-store';
import { dshPromotionCandidates } from '../../shared/workflow';
import { getDshControlPanelGovernanceEntry } from '../shared';
import {
  getCampaignItems,
  type CampaignAudience,
  type CampaignPlacement,
  type CampaignRecord,
  type CampaignStatus,
  type CampaignTargetType,
} from '../../shared/campaign.preview-store';
import {
  getPartnerOfferItems,
  type PartnerOfferRecord,
  type PartnerOfferStatus,
} from '../../shared/partner-offer.preview-store';
import {
  buildCommercialProjection,
  isClientVisibleStatus,
  type CommercialCampaign,
  type CommercialLifecycleStatus,
  type PartnerOffer,
} from '../../shared/commercial.preview-contract';
import {
  getCampaignVisibilityRecord,
  getPartnerOfferVisibilityRecord,
} from '../../shared/marketing-visibility.contract';
import {
  getDshPartnerActivationStateMetadata,
  type DshPartnerActivationStatus,
} from '../../shared/dsh-partner-activation.model';
import {
  getDshProductApprovalStateMetadata,
  type DshProductCategoryMappingStatus,
  type DshProductDuplicateStatus,
  type DshProductIdentityApprovalStatus,
} from '../../shared/dsh-product-identity.model';
import {
  resolveDshProductClientVisibility,
  resolveDshStoreClientVisibility,
} from '../../shared/dsh-client-visibility.model';
import {
  getDshSignalEventLabel,
  getDshSignalEventTone,
  getDshSignalSummaries,
} from '../../shared/dsh-signal-layer.model';

export type ControlPanelDshMarketingScreenProps = SmartSignalLayerScreenProps;

type MarketingControlView = 'visibility' | 'ticker' | 'banners' | 'promos' | 'video' | 'campaigns' | 'partners' | 'loyalty' | 'growth' | 'signals' | 'media-review';

type MarketingPartnerGateSeed = {
  id: string;
  title: string;
  status: DshPartnerActivationStatus;
  affectedSurface: 'app-partner' | 'app-client' | 'control-panel';
  routeTab: Extract<MarketingControlView, 'signals' | 'campaigns' | 'partners'>;
  routeLabel: string;
};

type MarketingProductGateSeed = {
  id: string;
  title: string;
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
  {
    id: 'partner-docs-missing',
    title: 'شريك ينتظر استكمال الوثائق قبل أي ظهور تسويقي',
    status: 'documents_missing',
    affectedSurface: 'app-partner',
    routeTab: 'signals',
    routeLabel: 'فتح الإشارات',
  },
  {
    id: 'partner-delivery-ready',
    title: 'شريك أكمل أوضاع التوصيل لكنه لم يصل بعد إلى client visibility',
    status: 'delivery_modes_ready',
    affectedSurface: 'control-panel',
    routeTab: 'signals',
    routeLabel: 'فتح handoff الإشارات',
  },
  {
    id: 'partner-client-visible',
    title: 'شريك جاهز للحملات لأنه ظاهر فعليًا في app-client',
    status: 'client_visible',
    affectedSurface: 'app-client',
    routeTab: 'campaigns',
    routeLabel: 'فتح الحملات',
  },
] as const;

const PRODUCT_GATE_PREVIEW: readonly MarketingProductGateSeed[] = [
  {
    id: 'product-marketing-review',
    title: 'منتج بانتظار اعتماد التسويق قبل أي placement',
    approvalStatus: 'marketing_review',
    partnerStatus: 'delivery_modes_ready',
    categoryMappingStatus: 'mapped',
    duplicateStatus: 'clean',
    deliveryModesReady: true,
    mediaPolicySatisfied: false,
    routeTab: 'media-review',
    routeLabel: 'فتح مراجعة الميديا',
  },
  {
    id: 'product-ready-for-campaign',
    title: 'منتج اجتاز بوابات النشر وأصبح صالحًا للحملة',
    approvalStatus: 'client_visible',
    partnerStatus: 'client_visible',
    categoryMappingStatus: 'mapped',
    duplicateStatus: 'clean',
    deliveryModesReady: true,
    mediaPolicySatisfied: true,
    routeTab: 'campaigns',
    routeLabel: 'فتح الحملات',
  },
  {
    id: 'product-needs-fix',
    title: 'منتج محجوب عن الظهور بسبب publish blockers متعددة',
    approvalStatus: 'needs_fix',
    partnerStatus: 'catalog_ready',
    categoryMappingStatus: 'unmapped',
    duplicateStatus: 'possible_duplicate',
    deliveryModesReady: false,
    mediaPolicySatisfied: false,
    routeTab: 'media-review',
    routeLabel: 'فتح مسار التصحيح',
  },
] as const;

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

function resolveToneClass(tone: 'brand' | 'success' | 'warning' | 'danger' | 'default') {
  if (tone === 'success') return marketingStyles.statusChipSuccess;
  if (tone === 'warning') return marketingStyles.statusChipWarning;
  if (tone === 'danger') return marketingStyles.statusChipDanger;
  if (tone === 'brand') return marketingStyles.statusChipBrand;
  return marketingStyles.statusChipNeutral;
}

export function ControlPanelDshMarketingScreen(props: ControlPanelDshMarketingScreenProps) {
  const marketingGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('marketing'), []);
  const catalogsGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('catalogs'), []);
  const partnersGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('partners'), []);
  const supportGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('support'), []);
  const [activeTab, setActiveTab] = React.useState<MarketingControlView>('visibility');
  const [activeSubTab, setActiveSubTab] = React.useState<string>('');
  const [tickers, setTickers] = React.useState<ReadonlyArray<MarketingNewsTickerItem>>([]);
  const [editingTickerId, setEditingTickerId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setTickers(getMarketingTickerItems());
  }, []);

  const refreshTickers = () => setTickers(getMarketingTickerItems());

  const editingTicker = editingTickerId ? tickers.find(t => t.id === editingTickerId) : null;

  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const tickerPlan = React.useMemo(() => buildMarketingTickerPlan(now, 'client', tickers), [now, tickers]);
  const partnerOfferRecords = getPartnerOfferItems();
  const campaignRecords = getCampaignItems();
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
  const partnerGateRows = PARTNER_GATE_PREVIEW.map((gate) => {
    const metadata = getDshPartnerActivationStateMetadata(gate.status);
    const visibility = resolveDshStoreClientVisibility({
      activationStatus: gate.status,
      catalogPublished: gate.status === 'client_visible' || gate.status === 'partner_active',
      deliveryModesReady: gate.status === 'delivery_modes_ready' || gate.status === 'partner_active' || gate.status === 'client_visible',
      serviceabilityAvailable: gate.status === 'client_visible',
      storeOpen: true,
    });
    return {
      ...gate,
      clientVisible: visibility.visible,
      owner: metadata.actorResponsible,
      nextAction: metadata.nextAction,
      blockedReason: visibility.blockedReason ?? metadata.blockedReason,
      auditRequired: metadata.auditRequired,
      tone: visibility.visible ? 'success' as const : (visibility.blockedReason ?? metadata.blockedReason) ? 'warning' as const : 'brand' as const,
    };
  });
  const productGateRows = PRODUCT_GATE_PREVIEW.map((product) => {
    const approvalMeta = getDshProductApprovalStateMetadata(product.approvalStatus);
    const productVisibility = resolveDshProductClientVisibility({
      approvalStatus: product.approvalStatus,
      activationStatus: product.partnerStatus,
      catalogPublished: product.partnerStatus === 'client_visible',
      deliveryModesReady: product.deliveryModesReady,
      serviceabilityAvailable: product.partnerStatus === 'client_visible',
      categoryMappingStatus: product.categoryMappingStatus,
      duplicateStatus: product.duplicateStatus,
      mediaPolicySatisfied: product.mediaPolicySatisfied,
    });
    const blockers = productVisibility.publishingPrerequisites.filter((item) => !item.satisfied);
    const publishingBlocked = !productVisibility.visible;

    return {
      ...product,
      approvalLabel: approvalMeta.label,
      blockers,
      publishingBlocked,
      blockedReason: productVisibility.blockedReason,
      tone: product.approvalStatus === 'client_visible' && blockers.length === 0
        ? 'success' as const
        : blockers.length > 0
          ? 'warning' as const
          : 'brand' as const,
    };
  });
  const marketingSignalRows = getDshSignalSummaries('control-panel', 'ops').filter((signal) => (
    signal.kind === 'partner_submitted'
    || signal.kind === 'partner_docs_missing'
    || signal.kind === 'catalog_item_rejected'
    || signal.kind === 'catalog_published'
    || signal.kind === 'marketing_content_approved'
    || signal.kind === 'marketing_content_rejected'
    || signal.kind === 'marketing_content_needs_fix'
  ));
  const marketingHeaderMetrics = [
    {
      label: 'بوابات الشركاء',
      value: String(partnerGateRows.filter((row) => row.clientVisible).length),
      trend: `${partnerGateRows.length} مسارات`,
      trendTone: partnerGateRows.some((row) => !row.clientVisible) ? 'warning' : 'success',
    },
    {
      label: 'منتجات محجوبة',
      value: String(productGateRows.filter((row) => row.publishingBlocked).length),
      trend: `${productGateRows.reduce((sum, row) => sum + row.blockers.length, 0)} موانع`,
      trendTone: productGateRows.some((row) => row.publishingBlocked) ? 'warning' : 'success',
    },
    {
      label: 'ظهور تجاري',
      value: String(commercialProjection.badges.length),
      trend: commercialProjection.isClientVisible ? 'جاهز' : 'محجوب',
      trendTone: commercialProjection.isClientVisible ? 'success' : 'warning',
    },
    {
      label: 'إشارات غير مقروءة',
      value: String(marketingSignalRows.filter((signal) => signal.readState === 'unread').length),
      trend: `${dshPromotionCandidates.filter((candidate) => candidate.eligibility === 'eligible').length} مرشح`,
      trendTone: marketingSignalRows.some((signal) => signal.priority === 'urgent') ? 'warning' : 'success',
    },
  ] as const;

  const localizeTarget = (target: string) => resolveMarketingTickerTargetLabel('ar', target);
  const localizeStatus = (status: MarketingNewsTickerStatus) => resolveMarketingTickerStatusLabel('ar', status);
  const localizeKind = (kind: MarketingNewsTickerKind) => resolveMarketingTickerKindLabel('ar', kind);

  const coerceTickerKind = (value: string): MarketingNewsTickerKind => (value === 'platform' || value === 'order' || value === 'promo' || value === 'partner' ? value : 'platform');
  const coerceTickerStatus = (value: string): MarketingNewsTickerStatus => (value === 'draft' || value === 'published' || value === 'paused' || value === 'scheduled' ? value : 'draft');
  const coerceTickerSource = (value: string): MarketingNewsTickerSource => (value === 'marketing' || value === 'operations' || value === 'system' || value === 'customer' || value === 'partner' ? value : 'marketing');
  const coerceTickerAudience = (value: string): MarketingNewsTickerAudience => (value === 'all' || value === 'home' || value === 'order' || value === 'client' || value === 'stores' || value === 'operations' ? value : 'all');
  const coerceTickerPriority = (value: string): MarketingNewsTickerPriority => (value === 'low' || value === 'normal' || value === 'high' || value === 'critical' ? value : 'normal');
  const coerceTickerDelivery = (value: string): MarketingNewsTickerDeliveryMode => (value === 'auto' || value === 'manual' || value === 'pinned' ? value : 'auto');

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
  ] as const;

  const SECONDARY_TABS: Record<MarketingControlView, { id: string; label: string }[]> = {
    visibility: [],
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
  };


  // Set default sub-tab when primary tab changes
  React.useEffect(() => {
    if (SECONDARY_TABS[activeTab].length > 0) {
      setActiveSubTab(SECONDARY_TABS[activeTab][0].id);
    } else {
      setActiveSubTab('');
    }
  }, [activeTab]);

  const renderActiveLane = () => {
    switch (activeTab) {
      case 'visibility': {
        const visibleOffers = partnerOfferRows.filter(({ offer, visibility }) => offer.status === 'published' && !visibility.blockedReason);
        const blockedOffers = partnerOfferRows.filter(({ offer, visibility }) => offer.status !== 'published' || Boolean(visibility.blockedReason));
        const visibleCampaigns = campaignRows.filter(({ campaign, visibility }) => campaign.status === 'published' && !visibility.blockedReason);
        const blockedCampaigns = campaignRows.filter(({ campaign, visibility }) => campaign.status !== 'published' || Boolean(visibility.blockedReason));

        return (
          <div className={marketingStyles.marketingStack}>
            <div className={marketingStyles.surfaceCard}>
              <div className={marketingStyles.cardHeaderRow}>
                <Text role="labelLg" tone="brand">بوابات الظهور عبر الأسطح</Text>
                <div className={marketingStyles.actionRow}>
                  <button onClick={() => setActiveTab('partners')} className={`${marketingStyles.actionButton} ${marketingStyles.actionButtonPrimary}`}>
                    عروض الشركاء
                  </button>
                  <button onClick={() => setActiveTab('campaigns')} className={marketingStyles.actionButton}>
                    الحملات
                  </button>
                  <button onClick={() => setActiveTab('media-review')} className={marketingStyles.actionButton}>
                    مراجعة الميديا
                  </button>
                  <button onClick={() => setActiveTab('signals')} className={marketingStyles.actionButton}>
                    الإشارات
                  </button>
                </div>
              </div>
              <div className={marketingStyles.metaWrap}>
                <span>partner activation gate يسبق أي commercial placement.</span>
                <span>product publishing gate يسبق أي banner أو promo.</span>
                <span>commercial projection يقرأ فقط العناصر client-visible.</span>
                <span>signal layer تبقى handoff queue منخفضة الضجيج.</span>
              </div>
            </div>

            <div className={`${marketingStyles.editorGrid} ${marketingStyles.editorGridWithSidebar}`}>
              <div className={marketingStyles.listStack}>
                <div className={marketingStyles.surfaceCard}>
                  <h3 className={marketingStyles.surfaceCardTitle}>بوابة تفعيل الشريك إلى الظهور</h3>
                  <div className={marketingStyles.listStack}>
                    {partnerGateRows.map((row) => (
                      <div key={row.id} className={marketingStyles.tickerRow}>
                        <div className={marketingStyles.tickerRowBody}>
                          <p className={marketingStyles.messageText}>{row.title}</p>
                          <div className={marketingStyles.tickerMetaLine}>
                            <span className={`${marketingStyles.statusChip} ${resolveToneClass(row.tone)}`}>
                              {row.clientVisible ? 'ظاهر للعميل' : row.nextAction}
                            </span>
                            <div className={marketingStyles.metaChipRow}>
                              <span>{`المالك: ${row.owner}`}</span>
                              <span className={marketingStyles.metaSeparator}>|</span>
                              <span>{`السطح المتأثر: ${row.affectedSurface}`}</span>
                              <span className={marketingStyles.metaSeparator}>|</span>
                              <span>{row.auditRequired ? 'يتطلب audit' : 'بدون audit إضافي'}</span>
                            </div>
                          </div>
                          <div className={marketingStyles.planNote}>
                            {row.blockedReason || `الإجراء التالي: ${row.nextAction}`}
                          </div>
                        </div>
                        <div className={marketingStyles.tickerActions}>
                          <button onClick={() => setActiveTab(row.routeTab)} className={marketingStyles.actionButton}>
                            {row.routeLabel}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={marketingStyles.surfaceCard}>
                  <h3 className={marketingStyles.surfaceCardTitle}>بوابة نشر المنتج قبل placement</h3>
                  <div className={marketingStyles.listStack}>
                    {productGateRows.map((row) => (
                      <div key={row.id} className={marketingStyles.tickerRow}>
                        <div className={marketingStyles.tickerRowBody}>
                          <p className={marketingStyles.messageText}>{row.title}</p>
                          <div className={marketingStyles.tickerMetaLine}>
                            <span className={`${marketingStyles.statusChip} ${resolveToneClass(row.tone)}`}>
                              {row.approvalLabel}
                            </span>
                            <div className={marketingStyles.metaChipRow}>
                              <span>{`blockers: ${row.blockers.length}`}</span>
                              <span className={marketingStyles.metaSeparator}>|</span>
                              <span>{row.publishingBlocked ? 'publishing blocked' : 'ready for campaign'}</span>
                              <span className={marketingStyles.metaSeparator}>|</span>
                              <span>{`partner gate: ${row.partnerStatus}`}</span>
                            </div>
                          </div>
                          <div className={marketingStyles.planNote}>
                            {row.blockers.length > 0
                              ? row.blockers.map((blocker) => blocker.blockedReason ?? blocker.label).join(' · ')
                              : 'جميع متطلبات النشر مستوفاة ويمكن تمرير المنتج إلى الحملات أو الـ placements العميلية.'}
                          </div>
                        </div>
                        <div className={marketingStyles.tickerActions}>
                          <button onClick={() => setActiveTab(row.routeTab)} className={marketingStyles.actionButton}>
                            {row.routeLabel}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={marketingStyles.surfaceCard}>
                  <h3 className={marketingStyles.surfaceCardTitle}>ظهور العروض والحملات في العميل</h3>
                  <div className={marketingStyles.listStack}>
                    {[
                      {
                        id: 'offers-lane',
                        title: 'عروض الشركاء',
                        tone: visibleOffers.length > 0 ? 'success' as const : 'warning' as const,
                        statusLabel: `${visibleOffers.length} مرئي / ${blockedOffers.length} محجوب`,
                        note: visibleOffers.length > 0
                          ? `أول عرض ظاهر: ${visibleOffers[0]?.offer.displayBadge ?? '—'}`
                          : 'لا يوجد عرض منشور حاليًا يصل إلى العميل.',
                        actionLabel: 'فتح عروض الشركاء',
                        routeTab: 'partners' as const,
                      },
                      {
                        id: 'campaigns-lane',
                        title: 'الحملات والـ placements',
                        tone: commercialProjection.isClientVisible ? 'success' as const : 'warning' as const,
                        statusLabel: `${visibleCampaigns.length} فعّالة / ${blockedCampaigns.length} خارج gate`,
                        note: commercialProjection.isClientVisible
                          ? `البادجات الظاهرة: ${commercialProjection.badges.map((badge) => badge.label).join(' · ') || 'لا توجد بادجات'}`
                          : 'لا يوجد projection client-visible لأن العناصر التجارية لم تصل كلها إلى حالة العرض.',
                        actionLabel: 'فتح الحملات',
                        routeTab: 'campaigns' as const,
                      },
                    ].map((row) => (
                      <div key={row.id} className={marketingStyles.tickerRow}>
                        <div className={marketingStyles.tickerRowBody}>
                          <p className={marketingStyles.messageText}>{row.title}</p>
                          <div className={marketingStyles.tickerMetaLine}>
                            <span className={`${marketingStyles.statusChip} ${resolveToneClass(row.tone)}`}>
                              {row.statusLabel}
                            </span>
                            <div className={marketingStyles.metaChipRow}>
                              <span>{`مرشحو الترويج: ${dshPromotionCandidates.length}`}</span>
                              <span className={marketingStyles.metaSeparator}>|</span>
                              <span>{`visible badges: ${commercialProjection.badges.length}`}</span>
                            </div>
                          </div>
                          <div className={marketingStyles.planNote}>{row.note}</div>
                        </div>
                        <div className={marketingStyles.tickerActions}>
                          <button onClick={() => setActiveTab(row.routeTab)} className={marketingStyles.actionButton}>
                            {row.actionLabel}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={marketingStyles.listStack}>
                <div className={marketingStyles.surfaceCard}>
                  <h3 className={marketingStyles.surfaceCardTitle}>لوحة القرار السريع</h3>
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

                <div className={marketingStyles.surfaceCard}>
                  <h3 className={marketingStyles.surfaceCardTitle}>إشارات التسليم إلى التسويق</h3>
                  <div className={marketingStyles.listStack}>
                    {marketingSignalRows.map((signal) => (
                      <div key={signal.eventId} className={marketingStyles.tickerRow}>
                        <div className={marketingStyles.tickerRowBody}>
                          <p className={marketingStyles.messageText}>{signal.title}</p>
                          <div className={marketingStyles.tickerMetaLine}>
                            <span className={`${marketingStyles.statusChip} ${resolveToneClass(getDshSignalEventTone(signal.kind))}`}>
                              {getDshSignalEventLabel(signal.kind)}
                            </span>
                            <div className={marketingStyles.metaChipRow}>
                              <span>{signal.entityId}</span>
                              <span className={marketingStyles.metaSeparator}>|</span>
                              <span>{signal.routeId}</span>
                              <span className={marketingStyles.metaSeparator}>|</span>
                              <span>{signal.emittedAt}</span>
                            </div>
                          </div>
                        </div>
                        <div className={marketingStyles.tickerActions}>
                          <button onClick={() => setActiveTab('signals')} className={marketingStyles.actionButton}>
                            فتح الإشارات
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={marketingStyles.surfaceCard}>
                  <h3 className={marketingStyles.surfaceCardTitleCompact}>حواجز الحوكمة</h3>
                  <div className={marketingStyles.chipRow}>
                    <span className={marketingStyles.ruleChip}>{marketingGovernance?.sectionLabel ?? 'Marketing'}</span>
                    <span className={marketingStyles.ruleChip}>{catalogsGovernance?.sectionLabel ?? 'Catalogs'}</span>
                    <span className={marketingStyles.ruleChip}>{partnersGovernance?.sectionLabel ?? 'Partners'}</span>
                    <span className={`${marketingStyles.ruleChip} ${marketingStyles.ruleChipDanger}`}>WLT read-only finance</span>
                  </div>
                  <div className={marketingStyles.planNote}>
                    الظهور التجاري هنا لا يتجاوز بوابة الشريك، ولا يلتف على publishing gate، ولا يحوّل التسويق إلى owner للمال أو التفعيل التشغيلي.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'ticker': {
        const previewItem = editingTicker || tickerPlan.activeItem;
        const preview = previewItem ? resolveMarketingTickerPreviewForItem(now, previewItem, 'ar') : null;
        const selectedTicker = editingTickerId ? tickers.find((item) => item.id === editingTickerId) : undefined;
        const canPublishSelected = Boolean(selectedTicker && selectedTicker.status !== 'published');

        return (
          <div className={marketingStyles.marketingStack}>
            <div className={marketingStyles.surfaceCard}>
              <div className={marketingStyles.cardHeaderRow}>
                <Text role="labelLg" tone="brand">الرسالة النشطة الآن</Text>
                <div className={marketingStyles.actionRow}>
                  <button
                    onClick={() => {
                      const draft = createMarketingTickerDraft();
                      upsertMarketingTickerItem(draft);
                      setEditingTickerId(draft.id);
                      refreshTickers();
                    }}
                    className={`${marketingStyles.actionButton} ${marketingStyles.actionButtonPrimary}`}
                  >
                    + إضافة رسالة
                  </button>
                  <button
                    onClick={() => {
                      pauseAllMarketingTickers();
                      refreshTickers();
                    }}
                    className={`${marketingStyles.actionButton} ${marketingStyles.actionButtonDanger}`}
                  >
                    إيقاف الكل
                  </button>
                  <button
                    onClick={() => {
                      if (selectedTicker && selectedTicker.status !== 'published') {
                        upsertMarketingTickerItem({ ...selectedTicker, status: 'published' });
                          refreshTickers();
                      }
                    }}
                    disabled={!canPublishSelected}
                    className={`${marketingStyles.actionButton} ${canPublishSelected ? marketingStyles.actionButtonSuccess : marketingStyles.actionButtonDisabled}`}
                  >
                    تفعيل المحددة
                  </button>
                  <div className={marketingStyles.statusNote}>
                    تم الحفظ تلقائياً
                  </div>
                </div>
              </div>
              {tickerPlan.activeEntry ? (
                <div className={marketingStyles.activeTickerCard}>
                  <div className={marketingStyles.cardMetaRow}>
                    <span className={marketingStyles.liveBadge}>مباشر</span>
                  </div>
                  <p className={marketingStyles.messageText}>{tickerPlan.activeItem?.message}</p>
                  <div className={marketingStyles.metaWrap}>
                    <span>المصدر: {resolveMarketingTickerSourceLabel('ar', tickerPlan.activeItem!.source)}</span>
                    <span>الجمهور: {resolveMarketingTickerAudienceLabel('ar', tickerPlan.activeItem!.audience)}</span>
                    <span>الأولوية: {resolveMarketingTickerPriorityLabel('ar', tickerPlan.activeItem!.priority)}</span>
                    <span>النافذة: {tickerPlan.activeItem!.openHour}:00 - {tickerPlan.activeItem!.closeHour}:00</span>
                    <span>الوجهة: {localizeTarget(tickerPlan.activeItem!.actionTarget)}</span>
                  </div>
                  <div className={marketingStyles.planNote}>
                    الخطة: {resolveMarketingTickerDeliveryLabel('ar', tickerPlan.activeItem!.deliveryMode)} — مفعلة بنجاح (السبب: {resolveMarketingTickerPlanReasonLabel('ar', tickerPlan.activeEntry.reason)})
                  </div>
                </div>
              ) : (
                <div className={marketingStyles.emptyState}>
                  <p className={marketingStyles.emptyStateText}>لا توجد رسالة نشطة الآن.</p>
                </div>
              )}
            </div>

            <div className={marketingStyles.surfaceCard}>
              <h3 className={marketingStyles.surfaceCardTitle}>معاينة مباشرة</h3>
              {preview ? (
                <div className={marketingStyles.previewBanner}>
                  <span className={marketingStyles.previewStatus}>
                    {preview.statusLabel}
                  </span>
                  <div className={marketingStyles.previewContent}>
                    <p className={marketingStyles.previewMessage}>
                      {preview.message}
                    </p>
                  </div>
                  <span className={marketingStyles.previewTarget}>← {localizeTarget(previewItem!.actionTarget)}</span>
                </div>
              ) : (
                <div className={marketingStyles.previewPlaceholder}>
                   <p className={marketingStyles.previewPlaceholderText}>
                     {tickerPlan.suppressedEntries.find(e => e.item.id === (editingTickerId || ''))?.reason
                        ? `السبب: ${resolveMarketingTickerPlanReasonLabel('ar', tickerPlan.suppressedEntries.find(e => e.item.id === (editingTickerId || ''))?.reason)}`
                        : 'لا توجد معاينة متاحة أو الرسالة غير مؤهلة للعرض'}
                   </p>
                </div>
              )}
            </div>

            <div className={`${marketingStyles.editorGrid} ${editingTicker ? marketingStyles.editorGridWithSidebar : ''}`}>
              <div className={marketingStyles.surfaceCard}>
                <h3 className={marketingStyles.surfaceCardTitle}>قائمة الرسائل</h3>
                <div className={marketingStyles.listStack}>
                  {tickers.map(ticker => {
                    const isPublished = ticker.status === 'published';
                    const planEntry = tickerPlan.automaticEntries.find(e => e.item.id === ticker.id)
                                   || tickerPlan.manualEntries.find(e => e.item.id === ticker.id)
                                   || tickerPlan.suppressedEntries.find(e => e.item.id === ticker.id)
                                   || (tickerPlan.activeEntry?.item.id === ticker.id ? tickerPlan.activeEntry : undefined);
                    const isSuppressed = planEntry?.state === 'suppressed';

                    return (
                      <div key={ticker.id} className={`${marketingStyles.tickerRow} ${editingTickerId === ticker.id ? marketingStyles.tickerRowActive : ''}`}>
                        <div className={marketingStyles.tickerRowBody}>
                          <p className={marketingStyles.messageText}>{ticker.message}</p>
                          <div className={marketingStyles.tickerMetaLine}>
                            <span className={`${marketingStyles.statusChip} ${isPublished ? marketingStyles.statusChipSuccess : marketingStyles.statusChipNeutral}`}>
                              {localizeStatus(ticker.status)}
                            </span>
                            <div className={marketingStyles.metaChipRow}>
                              <span>#{ticker.id}</span>
                              <span className={marketingStyles.metaSeparator}>|</span>
                              <span>{resolveMarketingTickerSourceLabel('ar', ticker.source)}</span>
                              <span className={marketingStyles.metaSeparator}>|</span>
                              <span>{resolveMarketingTickerAudienceLabel('ar', ticker.audience)}</span>
                              <span className={marketingStyles.metaSeparator}>|</span>
                              <span>{resolveMarketingTickerPriorityLabel('ar', ticker.priority)}</span>
                              <span className={marketingStyles.metaSeparator}>|</span>
                              <span>{ticker.openHour}:00-{ticker.closeHour}:00</span>
                              <span className={marketingStyles.metaSeparator}>|</span>
                              <span>{localizeTarget(ticker.actionTarget)}</span>
                            </div>
                            {isSuppressed && (
                              <span className={marketingStyles.suppressedChip}>
                                الكبت: {resolveMarketingTickerPlanReasonLabel('ar', planEntry?.reason)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={marketingStyles.tickerActions}>
                          <button onClick={() => {
                              toggleMarketingTickerStatus(ticker.id);
                              refreshTickers();
                            }} className={marketingStyles.actionButton}>
                            {isPublished ? 'إيقاف' : 'تفعيل'}
                          </button>
                          <button onClick={() => setEditingTickerId(ticker.id)} className={marketingStyles.actionButton}>
                            تعديل
                          </button>
                          <button onClick={() => {
                              toggleMarketingTickerPinned(ticker.id);
                              refreshTickers();
                            }} className={marketingStyles.actionButton}>
                            {ticker.deliveryMode === 'pinned' ? 'إلغاء التثبيت' : 'تثبيت'}
                          </button>
                          <button onClick={() => {
                              if (window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
                                removeMarketingTickerItem(ticker.id);
                                if (editingTickerId === ticker.id) setEditingTickerId(null);
                                refreshTickers();
                              }
                            }} className={`${marketingStyles.actionButton} ${marketingStyles.actionButtonDanger}`}>
                            حذف
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {editingTicker && (
                <div className={`${marketingStyles.surfaceCard} ${marketingStyles.editorCardAccent}`}>
                  <div className={marketingStyles.editorHeader}>
                    <h4 className={marketingStyles.editorTitle}>محرر الرسالة</h4>
                    <button onClick={() => setEditingTickerId(null)} className={marketingStyles.closeButton}>إغلاق</button>
                  </div>
                  <div className={marketingStyles.formStack}>
                    <Box gap={1}>
                      <label className={`${marketingStyles.fieldLabel} ${marketingStyles.fieldLabelLarge}`}>نص الرسالة</label>
                      <textarea
                        aria-label="نص الرسالة"
                        title="نص الرسالة"
                        value={editingTicker.message}
                        onChange={(e) => {
                          upsertMarketingTickerItem({ ...editingTicker, message: e.target.value });
                          refreshTickers();
                        }}
                        className={`${marketingStyles.fieldControl} ${marketingStyles.fieldTextarea}`}
                      />
                      {editingTicker.message.trim() === '' && <span className={marketingStyles.fieldError}>يجب ألا يكون النص فارغاً</span>}
                    </Box>
                    <div className={marketingStyles.formGrid}>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>النوع</label>
                        <select aria-label="نوع الرسالة" title="نوع الرسالة" value={editingTicker.kind} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, kind: coerceTickerKind(e.target.value) }); refreshTickers(); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                          <option value="platform">{localizeKind('platform')}</option>
                          <option value="order">{localizeKind('order')}</option>
                          <option value="promo">{localizeKind('promo')}</option>
                          <option value="partner">{localizeKind('partner')}</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>الحالة</label>
                        <select aria-label="حالة الرسالة" title="حالة الرسالة" value={editingTicker.status} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, status: coerceTickerStatus(e.target.value) }); refreshTickers(); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                          <option value="draft">{localizeStatus('draft')}</option>
                          <option value="published">{localizeStatus('published')}</option>
                          <option value="paused">{localizeStatus('paused')}</option>
                          <option value="scheduled">{localizeStatus('scheduled')}</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>المصدر</label>
                        <select aria-label="مصدر الرسالة" title="مصدر الرسالة" value={editingTicker.source} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, source: coerceTickerSource(e.target.value) }); refreshTickers(); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                          <option value="marketing">{resolveMarketingTickerSourceLabel('ar', 'marketing')}</option>
                          <option value="operations">{resolveMarketingTickerSourceLabel('ar', 'operations')}</option>
                          <option value="system">{resolveMarketingTickerSourceLabel('ar', 'system')}</option>
                          <option value="customer">{resolveMarketingTickerSourceLabel('ar', 'customer')}</option>
                          <option value="partner">{resolveMarketingTickerSourceLabel('ar', 'partner')}</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>الجمهور</label>
                        <select aria-label="الجمهور" title="الجمهور" value={editingTicker.audience} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, audience: coerceTickerAudience(e.target.value) }); refreshTickers(); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                          <option value="all">{resolveMarketingTickerAudienceLabel('ar', 'all')}</option>
                          <option value="home">{resolveMarketingTickerAudienceLabel('ar', 'home')}</option>
                          <option value="order">{resolveMarketingTickerAudienceLabel('ar', 'order')}</option>
                          <option value="client">{resolveMarketingTickerAudienceLabel('ar', 'client')}</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>الأولوية</label>
                        <select aria-label="الأولوية" title="الأولوية" value={editingTicker.priority} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, priority: coerceTickerPriority(e.target.value) }); refreshTickers(); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                          <option value="low">{resolveMarketingTickerPriorityLabel('ar', 'low')}</option>
                          <option value="normal">{resolveMarketingTickerPriorityLabel('ar', 'normal')}</option>
                          <option value="high">{resolveMarketingTickerPriorityLabel('ar', 'high')}</option>
                          <option value="critical">{resolveMarketingTickerPriorityLabel('ar', 'critical')}</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>نمط التسليم</label>
                        <select aria-label="نمط التسليم" title="نمط التسليم" value={editingTicker.deliveryMode} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, deliveryMode: coerceTickerDelivery(e.target.value) }); refreshTickers(); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                          <option value="auto">{resolveMarketingTickerDeliveryLabel('ar', 'auto')}</option>
                          <option value="manual">{resolveMarketingTickerDeliveryLabel('ar', 'manual')}</option>
                          <option value="pinned">{resolveMarketingTickerDeliveryLabel('ar', 'pinned')}</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>بدء العرض</label>
                        <input
                          aria-label="بدء العرض"
                          title="بدء العرض"
                          type="number"
                          min="0"
                          max="23"
                          value={editingTicker.openHour}
                          onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, openHour: Number(e.target.value) }); refreshTickers(); }}
                          className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}
                        />
                        {(editingTicker.openHour < 0 || editingTicker.openHour > 23) && <span className={`${marketingStyles.fieldError} ${marketingStyles.fieldErrorSmall}`}>بين 0-23</span>}
                      </Box>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>نهاية العرض</label>
                        <input
                          aria-label="نهاية العرض"
                          title="نهاية العرض"
                          type="number"
                          min="0"
                          max="23"
                          value={editingTicker.closeHour}
                          onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, closeHour: Number(e.target.value) }); refreshTickers(); }}
                          className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}
                        />
                        {(editingTicker.closeHour < 0 || editingTicker.closeHour > 23) && <span className={`${marketingStyles.fieldError} ${marketingStyles.fieldErrorSmall}`}>بين 0-23</span>}
                      </Box>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>التهدئة (دقيقة)</label>
                        <input
                          aria-label="التهدئة بالدقائق"
                          title="التهدئة بالدقائق"
                          type="number"
                          min="0"
                          value={editingTicker.cooldownMinutes}
                          onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, cooldownMinutes: Number(e.target.value) }); refreshTickers(); }}
                          className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}
                        />
                        {editingTicker.cooldownMinutes < 0 && <span className={`${marketingStyles.fieldError} ${marketingStyles.fieldErrorSmall}`}>لا يمكن أن يكون سالباً</span>}
                      </Box>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>فجوة التكرار</label>
                        <input
                          aria-label="فجوة التكرار بالدقائق"
                          title="فجوة التكرار بالدقائق"
                          type="number"
                          min="0"
                          value={editingTicker.repeatGapMinutes}
                          onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, repeatGapMinutes: Number(e.target.value) }); refreshTickers(); }}
                          className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}
                        />
                        {editingTicker.repeatGapMinutes < 0 && <span className={`${marketingStyles.fieldError} ${marketingStyles.fieldErrorSmall}`}>لا يمكن أن يكون سالباً</span>}
                      </Box>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>وجهة الضغط</label>
                        <select aria-label="وجهة الضغط" title="وجهة الضغط" value={editingTicker.actionTarget} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, actionTarget: e.target.value }); refreshTickers(); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                          <option value="home">{localizeTarget('home')}</option>
                          <option value="orders">{localizeTarget('orders')}</option>
                          <option value="tracking">{localizeTarget('tracking')}</option>
                          <option value="promo">{localizeTarget('promo')}</option>
                        </select>
                      </Box>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={marketingStyles.surfaceCard}>
              <h3 className={marketingStyles.surfaceCardTitleCompact}>قواعد التشغيل</h3>
              <div className={marketingStyles.chipRow}>
                <span className={marketingStyles.ruleChip}>مثبت في الأعلى</span>
                <span className={`${marketingStyles.ruleChip} ${marketingStyles.ruleChipDanger}`}>حرج في الأعلى</span>
                <span className={marketingStyles.ruleChip}>الجمهور غير مطابق</span>
                <span className={marketingStyles.ruleChip}>خارج نافذة العرض</span>
                <span className={marketingStyles.ruleChip}>ضمن فترة التهدئة</span>
                <span className={marketingStyles.ruleChip}>مكرر</span>
              </div>
            </div>

            <div className={marketingStyles.surfaceCard}>
              <h3 className={marketingStyles.surfaceCardTitleCompact}>ربط الطلبات (Mapping)</h3>
              <div className={marketingStyles.chipRow}>
                <span className={`${marketingStyles.ruleChip} ${marketingStyles.mappingChip}`}>تم الاستلام ← التتبع</span>
                <span className={`${marketingStyles.ruleChip} ${marketingStyles.mappingChip}`}>قيد التحضير ← التتبع / الطلبات</span>
                <span className={`${marketingStyles.ruleChip} ${marketingStyles.mappingChip}`}>في الطريق ← التتبع</span>
                <span className={`${marketingStyles.ruleChip} ${marketingStyles.mappingChip}`}>تم التسليم ← الطلبات / الرئيسية</span>
              </div>
            </div>
          </div>
        );
      }
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
      default:
        return null;
    }
  };

  return (
    <div className={styles.surfaceCockpit}>
      {/* 1. Header Area - Marketing Command Deck */}
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

      {/* 2. Primary Tabs - Navigation Cockpit */}
      <nav className={styles.navigationDock}>
        {PRIMARY_TABS.map((tab) => {
          const isSelected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              className={`${styles.surfaceTab} ${isSelected ? styles.surfaceTabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* 3. Secondary Tabs - Sub-Navigation Dock */}
      {SECONDARY_TABS[activeTab] && SECONDARY_TABS[activeTab].length > 0 && (
        <div className={`${styles.filterDock} ${styles.filterDockTint} ${marketingStyles.subTabDock}`}>
          {SECONDARY_TABS[activeTab].map((sub) => {
            const isSelected = sub.id === activeSubTab;
            return (
              <button
                key={sub.id}
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
        <div className={marketingStyles.governanceBridgeRow}>
          <div className={marketingStyles.governanceBridgeCard}>
            <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line">
              <Text role="titleSm">ملكية التسويق</Text>
              <Text role="bodySm" tone="muted">
                {marketingGovernance?.notes ?? 'التسويق يملك المحتوى والحملات والعروض، وليس تفعيل الشريك أو نشر الكتالوج النهائي.'}
              </Text>
              <Text role="caption" tone="muted">
                {marketingGovernance?.onDemandPolicySummary ?? 'المحتوى الثقيل والمعاينات تبقى on-demand فقط.'}
              </Text>
            </Box>
          </div>
          <div className={marketingStyles.governanceBridgeCard}>
            <Box padding={3} background="surfaceRaised" radiusToken="lg" border borderTone="line">
              <Text role="titleSm">الجسور المعتمدة</Text>
              <Text role="bodySm" tone="muted">
                {`النشر النهائي للمنتجات عبر ${catalogsGovernance?.sectionLabel ?? 'Catalogs'} · أهلية الشريك عبر ${partnersGovernance?.sectionLabel ?? 'Partners'} · الحوادث التشغيلية عبر ${supportGovernance?.sectionLabel ?? 'Support'}.`}
              </Text>
              <Text role="caption" tone="muted">
                لا تتحول هذه المساحة إلى نسخة من الموبايل، بل تبقى مركز اعتماد ومراجعة كثيف ومنخفض الضجيج.
              </Text>
            </Box>
          </div>
        </div>
      </Box>

      {/* 4. Content Area */}
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          {renderActiveLane()}
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshMarketingScreen;
