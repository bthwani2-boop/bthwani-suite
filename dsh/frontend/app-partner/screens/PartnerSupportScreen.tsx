import React from 'react';
import { View } from 'react-native';
import {
  Box,
  BThwaniFilterRail,
  Button,
  Chip,
  Icon,
  KeyValueList,
  MobileCommandSummaryStrip,
  MobileScrollView,
  SectionHeader,
  StateView,
  Surface,
  Text,
  TopBar,
  useDirection,
  type BThwaniFilterRailItem,
} from '@bthwani/ui-kit';
import type {
  DshPartnerOperationalFlowId,
  DshPartnerSupportCommandFilterId,
  DshPartnerSupportIssueCategoryId,
  DshPartnerSupportRouteId,
} from '../dsh-partner.types';
import { getPartnerOrderIssueCategorySpec } from '../parts/PartnerOrderIssuePanel';
import { getOperationsSupportFlowPreview } from '../../shared/operations-support.preview';
// [REGISTRY Phase 1] — isDshHiddenCompatFlow guards hidden-compat flows (auction-status-update,
// order-rejection, order-alerts, order-sla-risk, partner-finance-bridge, etc.).
// Use getDshVisibleFlowsForSurface('app-partner') for any dynamic visible-flow list.
import { isDshHiddenCompatFlow } from '../../shared/dsh-flow-registry';

export type PartnerSupportRouteId = DshPartnerSupportRouteId;

type OperationsSupportCase = {
  id: string;
  orderRef: string;
  issueCategoryId: DshPartnerSupportIssueCategoryId;
  headline: string;
  summary: string;
  compactStatusLabel: string;
  compactStatusTone: 'brand' | 'warning' | 'danger' | 'info' | 'success';
  slaLabel: string;
  nextActionLabel: string;
  linkedFlowId?: DshPartnerOperationalFlowId;
  linkedSupportRoute?: DshPartnerSupportRouteId;
  filterIds: readonly Exclude<DshPartnerSupportCommandFilterId, 'all'>[];
  linkedParties: readonly string[];
  timeline: readonly string[];
  nextDecision: string;
  operationalNote: string;
  previewTags?: readonly string[];
  requiresProof?: boolean;
  requiresConversation?: boolean;
  allowRejectCancel?: boolean;
  hasSlaRisk?: boolean;
  requiresDecision?: boolean;
  activeOrder?: boolean;
};

const commandCenterFilterItems: BThwaniFilterRailItem[] = [
  { id: 'all', label: 'الكل', icon: <Icon name="grid-outline" size={16} /> },
  { id: 'active-orders', label: 'الطلبات النشطة', icon: <Icon name="receipt-outline" size={16} /> },
  { id: 'order-issues', label: 'مشاكل الطلبات', icon: <Icon name="alert-circle-outline" size={16} /> },
  { id: 'conversations', label: 'المحادثات', icon: <Icon name="chatbubble-ellipses-outline" size={16} /> },
  { id: 'inventory-branch', label: 'المخزون والفرع', icon: <Icon name="cube-outline" size={16} /> },
  { id: 'escalation', label: 'التصعيد', icon: <Icon name="arrow-up-circle-outline" size={16} /> },
];

// Cross-surface contract:
// - app-client sees support only inside the order, never this partner command center.
// - app-captain sees handoff/delivery issues only in captain-owned flows.
// - app-field owns branch/catalog/readiness collection, not partner order command.
// - control-panel owns escalations and policies later; partner UI shows preview routing only.
// - WLT stays the only owner of refunds/settlements/commissions; finance-related cases remain preview-tagged.
const operationsSupportCases: readonly OperationsSupportCase[] = [
  {
    id: 'ops-case-4401',
    orderRef: 'ORD-4401',
    issueCategoryId: 'delayed-preparation',
    headline: 'طلب متأخر داخل الفرع',
    summary: 'التحضير تجاوز الحد المتوقع ويهدد وقت التسليم إذا لم يُتخذ قرار الآن.',
    compactStatusLabel: 'خطر SLA',
    compactStatusTone: 'danger',
    slaLabel: 'يتبقى 6 دقائق',
    nextActionLabel: 'ثبّت التحضير أو أعلن التأخير بوضوح',
    linkedFlowId: 'order-sla-risk', // [REGISTRY: hidden-compat — isDshHiddenCompatFlow('order-sla-risk')===true; do not navigate to it as a primary route]
    linkedSupportRoute: 'order-prepare',
    filterIds: ['active-orders', 'order-issues', 'escalation'],
    linkedParties: ['الفرع', 'الدعم', 'العميل'],
    timeline: ['10:42 ص وصل الطلب', '10:48 ص بدأ التحضير', '10:56 ص ظهرت إشارة تأخير'],
    nextDecision: 'إكمال التحضير الآن أو فتح تعويض زمني تشغيلي فقط.',
    operationalNote: 'لا تفتح استردادًا محليًا. المطلوب الآن قرار تشغيل ثم تحديث واضح داخل نفس السياق.',
    previewTags: ['order-alerts'], // [REGISTRY: hidden-compat — order-alerts is contextual tag only; isDshHiddenCompatFlow('order-alerts')===true]
    hasSlaRisk: true,
    requiresDecision: true,
    activeOrder: true,
  },
  {
    id: 'ops-case-4391',
    orderRef: 'ORD-4391',
    issueCategoryId: 'item-unavailable',
    headline: 'نقص صنف مؤثر على الطلب',
    summary: 'عنصر أساسي غير متاح ويحتاج تعديل مخزون أو بديل قبل تثبيت الطلب.',
    compactStatusLabel: 'مخزون',
    compactStatusTone: 'warning',
    slaLabel: 'خلال 4 دقائق',
    nextActionLabel: 'عدّل المخزون أو افتح بديلًا واضحًا',
    linkedFlowId: 'order-issue-required', // [REGISTRY: hidden-compat — isDshHiddenCompatFlow('order-issue-required')===true; use order-issue-queue for new flows]
    linkedSupportRoute: 'inventory-adjust',
    filterIds: ['active-orders', 'order-issues', 'inventory-branch'],
    linkedParties: ['الفرع', 'العميل', 'الدعم'],
    timeline: ['10:21 ص تم قبول الطلب', '10:24 ص اكتُشف نقص الصنف', '10:26 ص فُتح تنبيه المخزون'],
    nextDecision: 'هل يوجد بديل مقبول؟ وإن لم يوجد فهل نرفع الحالة لمسار الرفض؟',
    operationalNote: 'تعديل المخزون يجب أن يبقى مختصرًا ومربوطًا بالطلب المرجعي فقط.',
    previewTags: ['inventory'],
    requiresDecision: true,
    activeOrder: true,
  },
  {
    id: 'ops-case-4385',
    orderRef: 'ORD-4385',
    issueCategoryId: 'partner-reject-request',
    headline: 'طلب رفض مرفوع من الشريك',
    summary: 'الفرع يطلب رفض الطلب بسبب تعذّر التنفيذ ويحتاج سببًا تشغيليًا صريحًا.',
    compactStatusLabel: 'قرار',
    compactStatusTone: 'danger',
    slaLabel: 'يتطلب قرارًا الآن',
    nextActionLabel: 'راجع السبب ثم افتح مسار الرفض عند الضرورة فقط',
    linkedFlowId: 'order-reject',
    linkedSupportRoute: 'order-reject',
    filterIds: ['active-orders', 'order-issues', 'escalation'],
    linkedParties: ['الفرع', 'الدعم', 'العميل'],
    timeline: ['10:10 ص وصل الطلب', '10:15 ص تعذّر التنفيذ', '10:17 ص رُفع طلب الرفض'],
    nextDecision: 'إما تثبيت سبب رفض واضح أو إعادة الطلب إلى التحضير إذا زال العائق.',
    operationalNote: 'الرفض لا يصبح خطوة صامتة. يجب أن يبقى داخل مسار واضح مع سبب معلن.',
    previewTags: ['order-rejection hidden route'], // [REGISTRY: hidden-compat — isDshHiddenCompatFlow('order-rejection')===true; use order-reject flow instead]
    allowRejectCancel: true,
    requiresDecision: true,
    activeOrder: true,
  },
  {
    id: 'ops-case-4372',
    orderRef: 'ORD-4372',
    issueCategoryId: 'courier-not-arrived',
    headline: 'بانتظار الكابتن / الموصل',
    summary: 'الطلب جاهز لكن handoff لم يكتمل لأن جهة الالتقاط لم تصل بعد.',
    compactStatusLabel: 'handoff',
    compactStatusTone: 'brand',
    slaLabel: '12 دقيقة انتظار',
    nextActionLabel: 'راجع handoff واطلب إثبات الوصول',
    linkedFlowId: 'order-alerts', // [REGISTRY: hidden-compat — isDshHiddenCompatFlow('order-alerts')===true; contextual tag only, not a primary route]
    linkedSupportRoute: 'order-handoff',
    filterIds: ['active-orders', 'escalation'],
    linkedParties: ['الفرع', 'الكابتن', 'الدعم'],
    timeline: ['09:54 ص اكتمل التحضير', '10:02 ص أُعلن الجاهزية', '10:06 ص لم يصل الكابتن بعد'],
    nextDecision: 'هل نثبت وصولًا قريبًا أم نرفع الحالة لتدخل تشغيلي أوسع؟',
    operationalNote: 'هذه الحالة تخص handoff فقط؛ لا تجعلها شاشة عامة خارج سياق الطلب.',
    previewTags: ['handoff'],
    requiresProof: true,
    hasSlaRisk: true,
    activeOrder: true,
  },
  {
    id: 'ops-case-4366',
    orderRef: 'ORD-4366',
    issueCategoryId: 'customer-not-responding',
    headline: 'العميل غير متجاوب',
    summary: 'التواصل مطلوب لتأكيد العنوان أو وقت التسليم، لكن آخر المحاولات بلا رد.',
    compactStatusLabel: 'محادثة',
    compactStatusTone: 'info',
    slaLabel: 'محاولة أخيرة خلال 3 دقائق',
    nextActionLabel: 'افتح المحادثة واطلب إثبات محاولة التواصل',
    linkedFlowId: 'order-chat-send',
    linkedSupportRoute: 'chat-send',
    filterIds: ['active-orders', 'conversations', 'escalation'],
    linkedParties: ['العميل', 'الفرع', 'الدعم'],
    timeline: ['10:05 ص خرج الطلب للتوصيل', '10:18 ص أول محاولة اتصال', '10:21 ص ما زال بلا رد'],
    nextDecision: 'إما تأكيد وقت بديل أو تصعيد عدم التجاوب إلى الدعم.',
    operationalNote: 'العميل يرى دعمه من داخل طلبه فقط؛ هنا نحن ندير أثر عدم التجاوب على تنفيذ الشريك.',
    previewTags: ['chat'],
    requiresConversation: true,
    hasSlaRisk: true,
    activeOrder: true,
  },
  {
    id: 'ops-case-4358',
    orderRef: 'ORD-4358',
    issueCategoryId: 'handoff-mismatch',
    headline: 'handoff مطلوب أو غير مطابق',
    summary: 'هناك تضارب بين جهة الالتقاط وحالة الخروج، ويجب تثبيت handoff الصحيح قبل المتابعة.',
    compactStatusLabel: 'Mismatch',
    compactStatusTone: 'danger',
    slaLabel: 'تثبيت فوري',
    nextActionLabel: 'افتح handoff واطلب إثباتًا قصيرًا',
    linkedFlowId: 'order-handoff',
    linkedSupportRoute: 'order-handoff',
    filterIds: ['active-orders', 'order-issues', 'escalation'],
    linkedParties: ['الفرع', 'الكابتن', 'موصل المتجر'],
    timeline: ['09:58 ص تغيّر وضع التنفيذ', '10:03 ص لم يُثبت handoff', '10:09 ص ظهر التضارب'],
    nextDecision: 'اختر جهة الالتقاط الصحيحة ثم أعد المسار إلى الوضع السليم.',
    operationalNote: 'الكابتن يرى handoff من رحلته فقط؛ هذا المركز يجمع أثر handoff على تنفيذ الشريك.',
    previewTags: ['order-issue-required'],
    requiresProof: true,
    requiresDecision: true,
    activeOrder: true,
  },
  {
    id: 'ops-case-4351',
    orderRef: 'ORD-4351',
    issueCategoryId: 'wrong-item',
    headline: 'عنصر خاطئ يهدد الإرسال',
    summary: 'التحقق الأخير كشف عنصرًا غير مطابق ويجب إيقاف التسليم إلى حين المراجعة.',
    compactStatusLabel: 'مطابقة',
    compactStatusTone: 'warning',
    slaLabel: 'قبل handoff',
    nextActionLabel: 'راجع العنصر واطلب إثباتًا بصريًا',
    linkedFlowId: 'order-issue-queue',
    linkedSupportRoute: 'order-issue-queue',
    filterIds: ['order-issues', 'inventory-branch'],
    linkedParties: ['الفرع', 'الدعم'],
    timeline: ['09:43 ص انتهى التجهيز', '09:47 ص ظهرت المراجعة', '09:50 ص أُوقفت الجاهزية مؤقتًا'],
    nextDecision: 'هل نصحح العنصر الآن أم نعيد الطلب إلى التحضير؟',
    operationalNote: 'المشكلة تخص المطابقة داخل الفرع. لا تكرّر بيانات الطلب في state منفصلة.',
    previewTags: ['proof'],
    requiresProof: true,
    requiresDecision: true,
  },
  {
    id: 'ops-case-4348',
    orderRef: 'ORD-4348',
    issueCategoryId: 'customer-not-responding',
    headline: 'محادثة تحتاج ردًا سريعًا',
    summary: 'آخر تحديث من العميل أو الدعم يحتاج ردًا من الفرع لتثبيت القرار التالي.',
    compactStatusLabel: 'Reply',
    compactStatusTone: 'info',
    slaLabel: 'رد خلال دقيقتين',
    nextActionLabel: 'افتح المحادثة أو استخدم ردًا سريعًا',
    linkedFlowId: 'order-quick-reply-config',
    linkedSupportRoute: 'quick-reply-config',
    filterIds: ['conversations'],
    linkedParties: ['الفرع', 'الدعم', 'العميل'],
    timeline: ['09:32 ص وصل تعليق العميل', '09:34 ص طُلب رد من الفرع'],
    nextDecision: 'هل يكفي رد سريع أم يجب فتح محادثة كاملة الآن؟',
    operationalNote: 'المحادثة تبقى deferred/on-demand؛ لا نحمّل تاريخًا طويلًا هنا.',
    previewTags: ['quick-reply'],
    requiresConversation: true,
  },
  {
    id: 'ops-case-4339',
    orderRef: 'ORD-4339',
    issueCategoryId: 'payment-refund-review',
    headline: 'مراجعة دفع / استرداد Preview',
    summary: 'هناك أثر مالي محتمل على الطلب، لكن هذه الشاشة تعرض tag تشغيليًا فقط دون أي money mutation.',
    compactStatusLabel: 'WLT Preview',
    compactStatusTone: 'info',
    slaLabel: 'مراجعة bridge فقط',
    nextActionLabel: 'حوّل الحالة للقراءة فقط داخل bridge المالي',
    linkedFlowId: 'partner-finance-bridge', // [REGISTRY: hidden-compat, financialImpact=true, finance-preview-only — isDshHiddenCompatFlow('partner-finance-bridge')===true; NO mutation from DSH]
    filterIds: ['order-issues', 'escalation'],
    linkedParties: ['الدعم', 'WLT', 'الفرع'],
    timeline: ['09:21 ص أُبلغ عن أثر مالي', '09:24 ص وُسمت الحالة كـ preview review'],
    nextDecision: 'هل تحتاج الحالة تصعيدًا للدعم فقط أم مجرد tagging حتى يراجعها WLT؟',
    operationalNote: 'WLT هو المالك الوحيد للـ refund/settlement/commission. هنا نظهر الإشارة فقط.',
    previewTags: ['refund review', 'WLT bridge'],
    requiresDecision: true,
  },
] as const;

function resolveCaseMatchesFilter(
  item: OperationsSupportCase,
  filterId: DshPartnerSupportCommandFilterId
): boolean {
  if (filterId === 'all') {
    return true;
  }

  return item.filterIds.includes(filterId);
}

function resolveCaseSupportRoute(
  item: OperationsSupportCase
): DshPartnerSupportRouteId | undefined {
  return item.linkedSupportRoute;
}

function findBestCaseIdForSelection({
  filterId,
  caseId,
  supportRouteId,
  issueCategoryId,
}: {
  filterId: DshPartnerSupportCommandFilterId;
  caseId?: string | null;
  supportRouteId?: DshPartnerSupportRouteId | null;
  issueCategoryId?: DshPartnerSupportIssueCategoryId | null;
}): string | null {
  const visibleItems = operationsSupportCases.filter((item) => resolveCaseMatchesFilter(item, filterId));

  if (caseId && visibleItems.some((item) => item.id === caseId)) {
    return caseId;
  }

  if (supportRouteId) {
    const match = visibleItems.find((item) => item.linkedSupportRoute === supportRouteId);
    if (match) {
      return match.id;
    }
  }

  if (issueCategoryId) {
    const match = visibleItems.find((item) => item.issueCategoryId === issueCategoryId);
    if (match) {
      return match.id;
    }
  }

  return visibleItems[0]?.id ?? null;
}

type CommandCenterCaseCardProps = {
  item: OperationsSupportCase;
  expanded: boolean;
  onOpenPreview: () => void;
  onOpenWorkspace: () => void;
  onEscalate: () => void;
  onOpenChat: () => void;
  onRequestProof: () => void;
  onConfirmHandling: () => void;
  onRejectOrCancel: () => void;
  onCollapse: () => void;
  actionFeedback?: string | null;
};

function CommandCenterCaseCard({
  item,
  expanded,
  onOpenPreview,
  onOpenWorkspace,
  onEscalate,
  onOpenChat,
  onRequestProof,
  onConfirmHandling,
  onRejectOrCancel,
  onCollapse,
  actionFeedback,
}: CommandCenterCaseCardProps) {
  const { direction } = useDirection();
  const flowPreview = getOperationsSupportFlowPreview(item.issueCategoryId);
  const category = getPartnerOrderIssueCategorySpec(item.issueCategoryId);
  const rowDirection = direction === 'rtl' ? 'row-reverse' : 'row';
  const textAlign = direction === 'rtl' ? 'right' : 'left';

  return (
    <Box gap={2}>
      <Surface
        tone={expanded ? 'default' : 'raised'}
        padding={3}
        gap={3}
      >
        <View style={{ flexDirection: rowDirection, alignItems: 'flex-start', gap: 12 }}>
          <Surface tone="inset" padding={2} radiusToken="lg" style={{ flexShrink: 0 }}>
            <Icon
              name={
                item.requiresConversation
                  ? 'chatbubble-ellipses-outline'
                  : item.issueCategoryId === 'item-unavailable' || item.issueCategoryId === 'wrong-item'
                    ? 'cube-outline'
                    : item.issueCategoryId === 'payment-refund-review'
                      ? 'wallet-outline'
                      : 'warning-outline'
              }
              size={18}
              tone="brand"
            />
          </Surface>

          <View style={{ flex: 1, minWidth: 0, gap: 6, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
            <View style={{ width: '100%', flexDirection: rowDirection, alignItems: 'flex-start', gap: 8 }}>
              <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                <Text role="bodyStrong" style={{ textAlign }}>
                  {item.headline}
                </Text>
                <Text role="bodySm" tone="muted" style={{ textAlign }}>
                  {`${item.orderRef} · ${category.title}`}
                </Text>
              </View>
              <Chip label={item.compactStatusLabel} tone={item.compactStatusTone} selected={expanded} />
            </View>

            <Text role="bodySm" tone="muted" style={{ textAlign }}>
              {item.summary}
            </Text>

            <View style={{ width: '100%', flexDirection: rowDirection, alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <Chip label={flowPreview.ownerLabel} tone="brand" />
              <Chip label={item.slaLabel} tone={item.hasSlaRisk ? 'danger' : 'warning'} />
              {flowPreview.financialImpactPreview ? (
                <Chip label="أثر مالي Preview" tone="info" />
              ) : null}
              {item.previewTags?.map((tag) => (
                <Chip key={tag} label={tag} tone="info" />
              ))}
            </View>

            <Text role="caption" tone="soft" style={{ textAlign }}>
              {`الإجراء التالي: ${item.nextActionLabel}`}
            </Text>

            <View style={{ width: '100%', flexDirection: rowDirection, alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <Button label="فتح" size="sm" fullWidth={false} tone="secondary" onPress={onOpenPreview} />
              <Button label="معالجة" size="sm" fullWidth={false} onPress={onOpenWorkspace} />
              <Button label="تصعيد" size="sm" fullWidth={false} tone="ghost" onPress={onEscalate} />
            </View>
          </View>
        </View>
      </Surface>

      {expanded ? (
        <Surface tone="inset" padding={3} gap={3}>
          <SectionHeader
            title={`تفاصيل ${item.orderRef}`}
            subtitle="تفاصيل on-demand فقط: ملخص، سبب، أطراف، سجل مختصر، وقرار التشغيل التالي."
          />

          <KeyValueList
            dense
            items={[
              { label: 'مرجع الطلب', value: item.orderRef, tone: 'brand' },
              { label: 'سبب المشكلة', value: category.title, tone: item.compactStatusTone },
              { label: 'الطرف المسؤول', value: flowPreview.ownerLabel },
              { label: 'القرار التالي', value: item.nextDecision, tone: 'brand' },
            ]}
          />

          {flowPreview.financialImpactPreview ? (
            <Surface tone="default" padding={3} gap={2}>
              <Text role="bodyStrong">الأثر المالي Preview</Text>
              <Text role="bodySm" tone="muted" style={{ textAlign }}>
                {flowPreview.financialImpactPreview}
              </Text>
            </Surface>
          ) : null}

          <Surface tone="default" padding={3} gap={2}>
            <Text role="bodyStrong">الأطراف المرتبطة</Text>
            <View style={{ flexDirection: rowDirection, flexWrap: 'wrap', gap: 8 }}>
              {item.linkedParties.map((party) => (
                <Chip key={party} label={party} tone="brand" />
              ))}
            </View>
          </Surface>

          <Surface tone="default" padding={3} gap={2}>
            <Text role="bodyStrong">سجل مختصر</Text>
            <Box gap={1}>
              {item.timeline.map((event) => (
                <Text key={event} role="caption" tone="muted" style={{ textAlign }}>
                  {`• ${event}`}
                </Text>
              ))}
            </Box>
          </Surface>

          <Surface tone="default" padding={3} gap={2}>
            <Text role="bodyStrong">ملاحظة تشغيلية</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign }}>
              {item.operationalNote}
            </Text>
          </Surface>

          {actionFeedback ? (
            <Text role="caption" tone="success" style={{ textAlign }}>
              {actionFeedback}
            </Text>
          ) : null}

          <View style={{ flexDirection: rowDirection, alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <Button label="تأكيد معالجة" size="sm" fullWidth={false} onPress={onConfirmHandling} />
            <Button label="طلب إثبات" size="sm" fullWidth={false} tone="secondary" onPress={onRequestProof} />
            <Button label="فتح محادثة" size="sm" fullWidth={false} tone="secondary" onPress={onOpenChat} />
            <Button label="تصعيد للدعم" size="sm" fullWidth={false} tone="ghost" onPress={onEscalate} />
            {item.allowRejectCancel ? (
              <Button label="رفض / إلغاء" size="sm" fullWidth={false} tone="danger" onPress={onRejectOrCancel} />
            ) : null}
            <Button label="رجوع" size="sm" fullWidth={false} tone="ghost" onPress={onCollapse} />
          </View>
        </Surface>
      ) : null}
    </Box>
  );
}

export type PartnerSupportScreenProps = {
  onBack?: () => void;
  onOpenScreen?: (screenId: DshPartnerSupportRouteId) => void;
  initialFilterId?: DshPartnerSupportCommandFilterId;
  initialCaseId?: string | null;
  initialIssueCategoryId?: DshPartnerSupportIssueCategoryId | null;
  initialSupportRouteId?: DshPartnerSupportRouteId | null;
};

export function PartnerSupportScreen({
  onBack,
  onOpenScreen,
  initialFilterId = 'all',
  initialCaseId = null,
  initialIssueCategoryId = null,
  initialSupportRouteId = null,
}: PartnerSupportScreenProps) {
  const [selectedFilterId, setSelectedFilterId] = React.useState<DshPartnerSupportCommandFilterId>(initialFilterId);
  const [expandedCaseId, setExpandedCaseId] = React.useState<string | null>(
    findBestCaseIdForSelection({
      filterId: initialFilterId,
      caseId: initialCaseId,
      supportRouteId: initialSupportRouteId,
      issueCategoryId: initialIssueCategoryId,
    }),
  );
  const [actionFeedbackByCaseId, setActionFeedbackByCaseId] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    setSelectedFilterId(initialFilterId);
    setExpandedCaseId(
      findBestCaseIdForSelection({
        filterId: initialFilterId,
        caseId: initialCaseId,
        supportRouteId: initialSupportRouteId,
        issueCategoryId: initialIssueCategoryId,
      }),
    );
  }, [initialCaseId, initialFilterId, initialIssueCategoryId, initialSupportRouteId]);

  const visibleItems = React.useMemo(
    () => operationsSupportCases.filter((item) => resolveCaseMatchesFilter(item, selectedFilterId)),
    [selectedFilterId],
  );

  React.useEffect(() => {
    if (!expandedCaseId) {
      return;
    }

    if (!visibleItems.some((item) => item.id === expandedCaseId)) {
      setExpandedCaseId(visibleItems[0]?.id ?? null);
    }
  }, [expandedCaseId, visibleItems]);

  const summary = React.useMemo(
    () => ({
      activeOrders: operationsSupportCases.filter((item) => item.activeOrder).length,
      slaRisk: operationsSupportCases.filter((item) => item.hasSlaRisk).length,
      needsDecision: operationsSupportCases.filter((item) => item.requiresDecision).length,
      openIssues: operationsSupportCases.filter((item) => item.filterIds.includes('order-issues')).length,
      pendingConversations: operationsSupportCases.filter((item) => item.requiresConversation).length,
    }),
    [],
  );

  function setCaseFeedback(caseId: string, message: string) {
    setActionFeedbackByCaseId((current) => ({
      ...current,
      [caseId]: message,
    }));
  }

  function handleOpenPreview(caseId: string) {
    setExpandedCaseId((current) => (current === caseId ? null : caseId));
  }

  function handleOpenWorkspace(item: OperationsSupportCase) {
    const supportRoute = resolveCaseSupportRoute(item);

    if (supportRoute) {
      onOpenScreen?.(supportRoute);
      return;
    }

    setCaseFeedback(item.id, 'هذه الحالة Preview فقط وتحتاج bridge للقراءة دون أي mutation محلي.');
  }

  function handleEscalate(item: OperationsSupportCase) {
    setSelectedFilterId('escalation');
    setExpandedCaseId(item.id);
    setCaseFeedback(item.id, 'تم تمييز الحالة للتصعيد التشغيلي فقط. المالك الفعلي للتصعيد والسياسات يبقى control-panel.');
  }

  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 32 }}>
      <TopBar
        variant="secondary"
        title="العمليات والدعم"
        subtitle="مركز تشغيل الطلبات والاستثناءات والدعم"
        style={{ marginHorizontal: -16, marginTop: -16 }}
        trailingAction={
          onBack
            ? {
                id: 'back',
                icon: <Icon name="arrow-back" size={24} tone="brand" />,
                mirrorInRtl: true,
                accessibilityLabel: 'رجوع',
                onPress: onBack,
              }
            : undefined
        }
      />

      <Surface tone="raised" padding={3} gap={2}>
        <Text role="titleSm">مركز تشغيل الطلبات والاستثناءات والدعم</Text>
        <Text role="bodySm" tone="muted">
          صف أولوية واحد يربط الطلبات النشطة، الاستثناءات، المحادثات، والمخزون دون تحويل الدعم إلى دليل عام منفصل.
        </Text>
      </Surface>

      <Box gap={2}>
        <MobileCommandSummaryStrip
          items={[
            { id: 'active-orders', label: 'طلبات نشطة', value: String(summary.activeOrders) },
            { id: 'sla-risk', label: 'خطر SLA', value: String(summary.slaRisk) },
            { id: 'needs-decision', label: 'تحتاج قرار', value: String(summary.needsDecision) },
          ]}
        />
        <MobileCommandSummaryStrip
          items={[
            { id: 'open-issues', label: 'مشاكل مفتوحة', value: String(summary.openIssues) },
            { id: 'pending-conversations', label: 'محادثات معلقة', value: String(summary.pendingConversations) },
          ]}
        />
      </Box>

      <Surface tone="raised" padding={3} gap={3}>
        <SectionHeader
          title="الفلاتر الذكية"
          subtitle="اعرض نفس queue بمنظور الطلبات أو المحادثات أو المخزون أو التصعيد، بدون تكرار بيانات route state."
        />
        <BThwaniFilterRail
          items={commandCenterFilterItems}
          selectedId={selectedFilterId}
          onSelectedIdChange={(id) => setSelectedFilterId(id as DshPartnerSupportCommandFilterId)}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        />
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <SectionHeader
          title="صف الأولوية"
          subtitle="بطاقات مختصرة تربط الحالة التشغيلية بالمسار التالي أو بالتفاصيل inline عند الحاجة."
        />

        {visibleItems.length === 0 ? (
          <StateView
            stateId="empty"
            title="لا توجد حالات في هذا الفلتر"
            description="غيّر الفلتر أو ارجع إلى الكل لمتابعة الحالات التشغيلية الأخرى."
          />
        ) : (
          <Box gap={3}>
            {visibleItems.map((item) => (
              <CommandCenterCaseCard
                key={item.id}
                item={item}
                expanded={expandedCaseId === item.id}
                onOpenPreview={() => handleOpenPreview(item.id)}
                onOpenWorkspace={() => handleOpenWorkspace(item)}
                onEscalate={() => handleEscalate(item)}
                onOpenChat={() => onOpenScreen?.('chat-send')}
                onRequestProof={() => onOpenScreen?.('video-upload')}
                onConfirmHandling={() =>
                  setCaseFeedback(item.id, `تم تثبيت المعالجة المحلية للحالة ${item.orderRef} داخل Preview command center.`)
                }
                onRejectOrCancel={() => onOpenScreen?.('order-reject')}
                onCollapse={() => setExpandedCaseId(null)}
                actionFeedback={actionFeedbackByCaseId[item.id] ?? null}
              />
            ))}
          </Box>
        )}
      </Surface>
    </MobileScrollView>
  );
}

export default PartnerSupportScreen;
