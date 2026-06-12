'use client';

import React from 'react';
import { Text } from '@bthwani/ui-kit';
import marketingStyles from './control-panel-marketing.module.css';
import styles from '../shared/control-panel-surface.module.css';
import { dshPromotionCandidates } from '../../shared/workflow';
import type {
  CampaignAudience,
  CampaignPlacement,
  CampaignRecord,
  CampaignStatus,
  CampaignTargetType,
} from '../../shared/dsh-marketing-types';
import type {
  PartnerOfferRecord,
  PartnerOfferStatus,
} from '../../shared/dsh-partner-offer-types';
import {
  buildCommercialProjection,
  evaluateCommercialConflicts,
  type CommercialCampaign,
  type CommercialConflict,
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
    title: 'شريك أكمل أوضاع التوصيل لكنه لم يصل بعد إلى ظهور العميل',
    status: 'delivery_modes_ready',
    affectedSurface: 'control-panel',
    routeTab: 'signals',
    routeLabel: 'فتح إشارات التسليم',
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
    title: 'منتج بانتظار اعتماد التسويق للنشر',
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

function translateStatus(status: string): string {
  switch (status) {
    case 'documents_missing': return 'وثائق ناقصة';
    case 'delivery_modes_ready': return 'أنماط التوصيل جاهزة';
    case 'client_visible': return 'مرئي للعميل';
    case 'catalog_ready': return 'الكتالوج جاهز';
    case 'partner_active': return 'نشط';
    default: return status;
  }
}

function translateAffectedSurface(surface: string): string {
  switch (surface) {
    case 'app-partner': return 'تطبيق الشريك';
    case 'app-client': return 'تطبيق العميل';
    case 'control-panel': return 'لوحة التحكم';
    default: return surface;
  }
}

function resolveToneClass(tone: 'brand' | 'success' | 'warning' | 'danger' | 'default') {
  if (tone === 'success') return marketingStyles.statusChipSuccess;
  if (tone === 'warning') return marketingStyles.statusChipWarning;
  if (tone === 'danger') return marketingStyles.statusChipDanger;
  if (tone === 'brand') return marketingStyles.statusChipBrand;
  return marketingStyles.statusChipNeutral;
}

export interface VisibilityCommandDeckScreenProps {
  activeSubTab: string;
  setActiveTab: (tab: string) => void;
  marketingHeaderMetrics: readonly {
    label: string;
    value: string;
    trend: string;
    trendTone: string;
  }[];
  partnerGates: any[];
  setPartnerGates: React.Dispatch<React.SetStateAction<any[]>>;
  productGates: any[];
  setProductGates: React.Dispatch<React.SetStateAction<any[]>>;
}

export function VisibilityCommandDeckScreen({
  activeSubTab,
  setActiveTab,
  marketingHeaderMetrics,
  partnerGates,
  setPartnerGates,
  productGates,
  setProductGates,
}: VisibilityCommandDeckScreenProps) {
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
    const metadata = getDshPartnerActivationStateMetadata(effectiveStatus);
    const visibility = resolveDshStoreClientVisibility({
      activationStatus: effectiveStatus,
      catalogPublished: effectiveStatus === 'client_visible' || effectiveStatus === 'partner_active',
      deliveryModesReady: effectiveStatus === 'delivery_modes_ready' || effectiveStatus === 'partner_active' || effectiveStatus === 'client_visible',
      serviceabilityAvailable: effectiveStatus === 'client_visible',
      storeOpen: true,
    });
    return {
      ...gate,
      clientVisible: visibility.visible,
      owner: gate.bypassed ? 'تجاوز المشرف (نظام التسويق)' : metadata.actorResponsible,
      nextAction: gate.bypassed ? 'تم التجاوز بنجاح' : metadata.nextAction,
      blockedReason: gate.bypassed ? undefined : (visibility.blockedReason ?? metadata.blockedReason),
      auditRequired: gate.bypassed ? false : metadata.auditRequired,
      tone: visibility.visible ? 'success' as const : (visibility.blockedReason ?? metadata.blockedReason) ? 'warning' as const : 'brand' as const,
    };
  });
  const productGateRows = productGates.map((product) => {
    const effectiveApprovalStatus = product.bypassed ? 'client_visible' : product.approvalStatus;
    const effectivePartnerStatus = product.bypassed ? 'client_visible' : product.partnerStatus;
    const effectiveCategoryMappingStatus = product.bypassed ? 'mapped' : product.categoryMappingStatus;
    const effectiveDuplicateStatus = product.bypassed ? 'clean' : product.duplicateStatus;
    const effectiveDeliveryModesReady = product.bypassed ? true : product.deliveryModesReady;
    const effectiveMediaPolicySatisfied = product.bypassed ? true : product.mediaPolicySatisfied;

    const approvalMeta = getDshProductApprovalStateMetadata(effectiveApprovalStatus);
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
    const blockers = productVisibility.publishingPrerequisites.filter((item) => !item.satisfied);
    const publishingBlocked = !productVisibility.visible;

    return {
      ...product,
      approvalLabel: product.bypassed ? 'معتمد تلقائياً' : approvalMeta.label,
      blockers: product.bypassed ? [] : blockers,
      publishingBlocked: product.bypassed ? false : publishingBlocked,
      blockedReason: product.bypassed ? undefined : productVisibility.blockedReason,
      tone: product.bypassed || (effectiveApprovalStatus === 'client_visible' && blockers.length === 0)
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

  const visibleOffers = partnerOfferRows.filter(({ offer, visibility }) => offer.status === 'published' && !visibility.blockedReason);
  const blockedOffers = partnerOfferRows.filter(({ offer, visibility }) => offer.status !== 'published' || Boolean(visibility.blockedReason));
  const visibleCampaigns = campaignRows.filter(({ campaign, visibility }) => campaign.status === 'published' && !visibility.blockedReason);
  const blockedCampaigns = campaignRows.filter(({ campaign, visibility }) => campaign.status !== 'published' || Boolean(visibility.blockedReason));
  const commercialConflicts: CommercialConflict[] = evaluateCommercialConflicts(commercialProjection.sourceMap ?? {});

  const visibilityGovernanceRows = [
    {
      id: 'eligibility',
      title: 'أهلية الظهور',
      visible: `${visibleOffers.length + visibleCampaigns.length}`,
      note: 'التحقق من توافق معايير الحملات والشركاء مع سياسات النشر دون تجاوز ضوابط التفعيل.',
    },
    {
      id: 'suppression',
      title: 'الكبت والمنع',
      visible: `${blockedOffers.length + blockedCampaigns.length}`,
      note: 'حصر العناصر الموقوفة أو المحجوبة وتحديد الجهة المسؤولة عن قرار الحجب لتسهيل المعالجة.',
    },
    {
      id: 'audit',
      title: 'سجل التدقيق',
      visible: `${marketingSignalRows.length}`,
      note: 'متابعة تدفق إشارات النشر والاعتماد لضمان تزامن الحوكمة والقرارات التشغيلية.',
    },
    {
      id: 'segments',
      title: 'ملخص الشرائح',
      visible: `${commercialProjection.badges.length}`,
      note: 'عرض توزيعات الجمهور والشرائح المستهدفة للعروض والتوزيعات النشطة للعملاء.',
    },
  ].filter((row) => activeSubTab === '' || activeSubTab === row.id);

  return (
    <div className={marketingStyles.marketingStack}>
      <div className={marketingStyles.surfaceCard}>
        <div className={marketingStyles.cardHeaderRow}>
          <Text role="labelLg" tone="brand">بوابات الظهور عبر الأسطح</Text>
          <div className={marketingStyles.actionRow}>
            <button type="button" onClick={() => setActiveTab('partners')} className={`${marketingStyles.actionButton} ${marketingStyles.actionButtonPrimary}`}>
              عروض الشركاء
            </button>
            <button type="button" onClick={() => setActiveTab('campaigns')} className={marketingStyles.actionButton}>
              الحملات
            </button>
            <button type="button" onClick={() => setActiveTab('media-review')} className={marketingStyles.actionButton}>
              مراجعة الميديا
            </button>
            <button type="button" onClick={() => setActiveTab('signals')} className={marketingStyles.actionButton}>
              الإشارات
            </button>
          </div>
        </div>
        <div className={marketingStyles.metaWrap}>
          <span>بوابة تفعيل الشركاء تتحقق من جاهزية المتجر قبل إطلاق أي عروض تسويقية.</span>
          <span>بوابة نشر المنتجات تضمن سلامة مواصفات وصور المنتج قبل النشر.</span>
          <span>توقعات الظهور التجاري تقتصر على محاكاة العناصر المرئية للعملاء.</span>
          <span>قنوات إشارات التنسيق تعمل على تزامن القرارات لحظياً وبدون تداخل.</span>
        </div>
      </div>

      <div className={marketingStyles.surfaceCard}>
        <h3 className={marketingStyles.surfaceCardTitle}>أهلية الظهور / موانع النشر / سجلات التدقيق والشرائح</h3>
        <div className={marketingStyles.listStack}>
          {visibilityGovernanceRows.map((row) => (
            <div key={row.id} className={marketingStyles.tickerRow}>
              <div className={marketingStyles.tickerRowBody}>
                <p className={marketingStyles.messageText}>{row.title}</p>
                <div className={marketingStyles.tickerMetaLine}>
                  <span className={`${marketingStyles.statusChip} ${resolveToneClass(row.id === 'suppression' ? 'warning' : 'brand')}`}>
                    {row.visible}
                  </span>
                  <div className={marketingStyles.metaChipRow}>
                    <span>{row.id}</span>
                    <span className={marketingStyles.metaSeparator}>|</span>
                    <span>ملخص الحوكمة</span>
                  </div>
                </div>
                <div className={marketingStyles.planNote}>{row.note}</div>
              </div>
            </div>
          ))}
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
                        <span>{`السطح المتأثر: ${translateAffectedSurface(row.affectedSurface)}`}</span>
                        <span className={marketingStyles.metaSeparator}>|</span>
                        <span>{row.auditRequired ? 'يتطلب تدقيقاً' : 'بدون تدقيق إضافي'}</span>
                      </div>
                    </div>
                    <div className={marketingStyles.planNote}>
                      {row.blockedReason || `الإجراء التالي: ${row.nextAction}`}
                    </div>
                  </div>
                  <div className={marketingStyles.tickerActions}>
                    <button type="button" onClick={() => setActiveTab(row.routeTab)} className={marketingStyles.actionButton}>
                      {row.routeLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPartnerGates(prev => prev.map(g => g.id === row.id ? { ...g, bypassed: !g.bypassed } : g));
                      }}
                      className={`${marketingStyles.actionButton} ${row.bypassed ? marketingStyles.actionButtonDanger : marketingStyles.actionButtonSuccess}`}
                    >
                      {row.bypassed ? 'تفعيل القيود' : 'تجاوز البوابة'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={marketingStyles.surfaceCard}>
            <h3 className={marketingStyles.surfaceCardTitle}>بوابة نشر المنتج</h3>
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
                        <span>{`الموانع: ${row.blockers.length}`}</span>
                        <span className={marketingStyles.metaSeparator}>|</span>
                        <span>{row.publishingBlocked ? 'النشر محجوب' : 'جاهز للحملة'}</span>
                        <span className={marketingStyles.metaSeparator}>|</span>
                        <span>{`بوابة الشريك: ${translateStatus(row.partnerStatus)}`}</span>
                      </div>
                    </div>
                    <div className={marketingStyles.planNote}>
                      {row.blockers.length > 0
                        ? row.blockers.map((blocker: any) => blocker.blockedReason ?? blocker.label).join(' · ')
                        : 'جميع متطلبات النشر مستوفاة ويمكن تمرير المنتج إلى الحملات أو التوزيعات التسويقية.'}
                    </div>
                  </div>
                  <div className={marketingStyles.tickerActions}>
                    <button type="button" onClick={() => setActiveTab(row.routeTab)} className={marketingStyles.actionButton}>
                      {row.routeLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProductGates(prev => prev.map(p => p.id === row.id ? { ...p, bypassed: !p.bypassed } : p));
                      }}
                      className={`${marketingStyles.actionButton} ${row.bypassed ? marketingStyles.actionButtonDanger : marketingStyles.actionButtonSuccess}`}
                    >
                      {row.bypassed ? 'تفعيل القيود' : 'تجاوز الموانع'}
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
                  title: 'الحملات والتوزيعات التسويقية',
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
                        <span>{`الشارات المرئية: ${commercialProjection.badges.length}`}</span>
                      </div>
                    </div>
                    <div className={marketingStyles.planNote}>{row.note}</div>
                  </div>
                  <div className={marketingStyles.tickerActions}>
                    <button type="button" onClick={() => setActiveTab(row.routeTab)} className={marketingStyles.actionButton}>
                      {row.actionLabel}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {commercialConflicts.length > 0 && (
            <div className={marketingStyles.surfaceCard}>
              <h3 className={marketingStyles.surfaceCardTitle}>تعارضات ملكية النشر ({commercialConflicts.length})</h3>
              <div className={marketingStyles.listStack}>
                {commercialConflicts.map((conflict) => (
                  <div key={conflict.conflictId} className={marketingStyles.tickerRow}>
                    <div className={marketingStyles.tickerRowBody}>
                      <p className={marketingStyles.messageText}>{conflict.reason}</p>
                      <div className={marketingStyles.tickerMetaLine}>
                        <span className={`${marketingStyles.statusChip} ${resolveToneClass(conflict.severity === 'blocker' ? 'danger' : 'warning')}`}>
                          {conflict.severity === 'blocker' ? 'حاجب' : 'تحذير'}
                        </span>
                        <div className={marketingStyles.metaChipRow}>
                          <span>{conflict.sourceA ?? conflict.conflictId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                    <button type="button" onClick={() => setActiveTab('signals')} className={marketingStyles.actionButton}>
                      فتح الإشارات
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
