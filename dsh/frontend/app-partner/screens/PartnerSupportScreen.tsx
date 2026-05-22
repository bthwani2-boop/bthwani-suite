import React from 'react';
import { ScrollView, View } from 'react-native';
import {
  Box,
  Button,
  Chip,
  Divider,
  Icon,
  KeyValueList,
  MobileScrollView,
  SearchField,
  SectionHeader,
  StateView,
  Surface,
  Tabs,
  Text,
  TopBar,
  useDirection,
} from '@bthwani/ui-kit';
import type {
  DshPartnerOperationalFlowId,
  DshPartnerSupportCommandFilterId,
  DshPartnerSupportIssueCategoryId,
  DshPartnerSupportRouteId,
} from '../dsh-partner.types';
import { getPartnerOrderIssueCategorySpec } from '../parts/PartnerOrderIssuePanel';
import { getOperationsSupportFlowPreview } from '../../shared/operations-support.preview';
import { isDshHiddenCompatFlow } from '../../shared/dsh-flow-registry';
import { resolveDshControlPanelSectionLabel } from '../../shared';

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

const commandCenterFilterItems = [
  { value: 'all', label: 'الكل' },
  { value: 'active-orders', label: 'الطلبات النشطة' },
  { value: 'order-issues', label: 'مشاكل الطلبات' },
  { value: 'conversations', label: 'المحادثات' },
  { value: 'inventory-branch', label: 'المخزون والفرع' },
  { value: 'escalation', label: 'التصعيد' },
] as const;

function resolvePartnerCaseOwnerLabel(item: OperationsSupportCase): string {
  if (item.issueCategoryId === 'payment-refund-review') {
    return resolveDshControlPanelSectionLabel('finance');
  }

  if (item.issueCategoryId === 'item-unavailable' || item.issueCategoryId === 'wrong-item') {
    return resolveDshControlPanelSectionLabel('catalogs');
  }

  return resolveDshControlPanelSectionLabel('support');
}

function resolvePartnerCaseOwnerNote(item: OperationsSupportCase): string {
  if (item.issueCategoryId === 'payment-refund-review') {
    return 'الأثر المالي يراجع من finance/WLT فقط. هذه المساحة تعرض preview tagging بلا أي refund أو settlement mutation.';
  }

  if (item.issueCategoryId === 'item-unavailable' || item.issueCategoryId === 'wrong-item') {
    return 'تعديل السعر والمخزون يبقى محليًا للشريك، لكن الباركود والهوية والنشر وتعارضات الميديا يملكها قسم الكتالوج.';
  }

  return 'متابعة التذكرة والتصعيد يملكها support داخل لوحة التحكم، بينما العميل يرى دعمه داخل الطلب فقط والكابتن يرى handoff أو delivery فقط.';
}

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

/**
 * Registry-enforced guard: resolves the workspace route to navigate to for a support case.
 * Returns null when no safe route exists, or when the case is linked only to a
 * hidden-compat flow (partner-finance-bridge, order-alerts, etc.) with no explicit support
 * route — preventing hidden-compat flows from opening as primary workspace routes.
 * Uses isDshHiddenCompatFlow from the shared registry for the runtime check.
 */
function resolveCaseWorkspaceTarget(
  item: OperationsSupportCase
): DshPartnerSupportRouteId | null {
  const supportRoute = resolveCaseSupportRoute(item);
  if (supportRoute) {
    // A valid support route is always the safe navigation target.
    return supportRoute;
  }
  // No support route — if the linked flow is hidden-compat, navigation is suppressed.
  // Hidden-compat flows are preview/tag-only; they must not open primary workspace routes.
  if (item.linkedFlowId && isDshHiddenCompatFlow(item.linkedFlowId)) {
    return null;
  }
  return null;
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
    <Box gap={1} style={{ width: '100%' }}>
      <Box paddingY={2}>
        <View style={{ flexDirection: rowDirection, alignItems: 'flex-start', gap: 12 }}>
          <Icon
            name={
              item.requiresProof
                ? 'document-text-outline'
                : item.requiresConversation
                  ? 'chatbubble-ellipses-outline'
                  : item.issueCategoryId === 'item-unavailable' || item.issueCategoryId === 'wrong-item'
                    ? 'cube-outline'
                    : item.issueCategoryId === 'payment-refund-review'
                      ? 'wallet-outline'
                      : 'warning-outline'
            }
            size={22}
            tone="brand"
            style={{ marginTop: 2, flexShrink: 0 }}
          />

          <View style={{ flex: 1, minWidth: 0, gap: 3, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
            <View style={{ width: '100%', flexDirection: rowDirection, alignItems: 'center', gap: 8 }}>
              <Text role="bodyStrong" style={{ textAlign }}>
                {item.headline}
              </Text>
              <Chip label={item.compactStatusLabel} tone={item.compactStatusTone} selected={expanded} size="sm" />
            </View>

            <Text role="bodySm" tone="muted" style={{ textAlign }}>
              {`${item.orderRef} · ${category.title} · ${flowPreview.ownerLabel}`}
            </Text>

            <Text role="bodySm" style={{ textAlign }}>
              {item.summary}
            </Text>

            <View style={{ width: '100%', flexDirection: rowDirection, alignItems: 'center', flexWrap: 'wrap', gap: 4, marginVertical: 2 }}>
              <Chip label={item.slaLabel} tone={item.hasSlaRisk ? 'danger' : 'warning'} size="sm" />
              {flowPreview.financialImpactPreview ? (
                <Chip label="أثر مالي" tone="info" size="sm" />
              ) : null}
              {item.previewTags?.slice(0, 2).map((tag) => (
                <Chip key={tag} label={tag} tone="info" size="sm" />
              ))}
            </View>

            <Text role="caption" tone="soft" style={{ textAlign, marginBottom: 4 }}>
              {`الإجراء التالي: ${item.nextActionLabel}`}
            </Text>

            <View style={{ width: '100%', flexDirection: rowDirection, alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <Button label="معالجة" size="sm" fullWidth={false} onPress={onOpenWorkspace} />
              <Button label="فتح" size="sm" fullWidth={false} tone="secondary" onPress={onOpenPreview} />
              <Button label="تصعيد" size="sm" fullWidth={false} tone="ghost" onPress={onEscalate} />
            </View>
          </View>
        </View>
      </Box>

      {expanded ? (
        <Box paddingY={2} paddingX={1} gap={3} style={{ backgroundColor: 'transparent' }}>
          <KeyValueList
            dense
            items={[
              { label: 'القرار التالي', value: item.nextDecision, tone: 'brand' },
              { label: 'المالك المركزي', value: `${resolvePartnerCaseOwnerLabel(item)} - ${resolvePartnerCaseOwnerNote(item)}` },
              { label: 'ملاحظة تشغيلية', value: item.operationalNote },
            ]}
          />

          <View style={{ gap: 4 }}>
            <Text role="bodyStrong" style={{ textAlign }}>الأطراف المرتبطة</Text>
            <View style={{ flexDirection: rowDirection, flexWrap: 'wrap', gap: 6 }}>
              {item.linkedParties.map((party) => (
                <Chip key={party} label={party} tone="brand" size="sm" />
              ))}
            </View>
          </View>

          <View style={{ gap: 4 }}>
            <Text role="bodyStrong" style={{ textAlign }}>آخر سجل مختصر</Text>
            <View style={{ gap: 2 }}>
              {item.timeline.map((event) => (
                <Text key={event} role="caption" tone="muted" style={{ textAlign }}>
                  {`• ${event}`}
                </Text>
              ))}
            </View>
          </View>

          {actionFeedback ? (
            <Text role="caption" tone="success" style={{ textAlign, marginVertical: 4 }}>
              {actionFeedback}
            </Text>
          ) : null}

          <View style={{ flexDirection: rowDirection, alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            <Button label="تأكيد معالجة" size="sm" fullWidth={false} onPress={onConfirmHandling} />
            <Button label="طلب إثبات" size="sm" fullWidth={false} tone="secondary" onPress={onRequestProof} />
            <Button label="فتح محادثة" size="sm" fullWidth={false} tone="secondary" onPress={onOpenChat} />
            <Button label="تصعيد للدعم" size="sm" fullWidth={false} tone="ghost" onPress={onEscalate} />
            {item.allowRejectCancel ? (
              <Button label="رفض / إلغاء" size="sm" fullWidth={false} tone="danger" onPress={onRejectOrCancel} />
            ) : null}
            <Button label="إغلاق التفاصيل" size="sm" fullWidth={false} tone="ghost" onPress={onCollapse} />
          </View>
        </Box>
      ) : null}

      <Divider />
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
  const { direction } = useDirection();
  const rowDirection = direction === 'rtl' ? 'row-reverse' : 'row';
  const textAlign = direction === 'rtl' ? 'right' : 'left';

  const [selectedFilterId, setSelectedFilterId] = React.useState<DshPartnerSupportCommandFilterId>(initialFilterId);
  const [supportQuery, setSupportQuery] = React.useState('');
  const [activeKpiFilter, setActiveKpiFilter] = React.useState<'all' | 'sla-risk' | 'needs-decision' | 'conversations' | 'order-issues'>(() => {
    if (initialFilterId === 'conversations') return 'conversations';
    if (initialFilterId === 'order-issues') return 'order-issues';
    return 'all';
  });
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
    setActiveKpiFilter(
      initialFilterId === 'conversations'
        ? 'conversations'
        : initialFilterId === 'order-issues'
          ? 'order-issues'
          : 'all'
    );
    setExpandedCaseId(
      findBestCaseIdForSelection({
        filterId: initialFilterId,
        caseId: initialCaseId,
        supportRouteId: initialSupportRouteId,
        issueCategoryId: initialIssueCategoryId,
      }),
    );
  }, [initialCaseId, initialFilterId, initialIssueCategoryId, initialSupportRouteId]);

  const visibleItems = React.useMemo(() => {
    let filterPassed = operationsSupportCases.filter((item) =>
      resolveCaseMatchesFilter(item, selectedFilterId),
    );

    if (activeKpiFilter === 'sla-risk') {
      filterPassed = filterPassed.filter((item) => item.hasSlaRisk);
    } else if (activeKpiFilter === 'needs-decision') {
      filterPassed = filterPassed.filter((item) => item.requiresDecision);
    } else if (activeKpiFilter === 'conversations') {
      filterPassed = filterPassed.filter((item) => item.filterIds.includes('conversations'));
    } else if (activeKpiFilter === 'order-issues') {
      filterPassed = filterPassed.filter((item) => item.filterIds.includes('order-issues'));
    }

    const query = supportQuery.trim().toLowerCase();
    if (!query) {
      return filterPassed;
    }

    return filterPassed.filter((item) => {
      const parties = item.linkedParties.join(' ').toLowerCase();
      const tags = (item.previewTags ?? []).join(' ').toLowerCase();
      return (
        item.orderRef.toLowerCase().includes(query) ||
        item.headline.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.compactStatusLabel.toLowerCase().includes(query) ||
        item.slaLabel.toLowerCase().includes(query) ||
        item.nextActionLabel.toLowerCase().includes(query) ||
        parties.includes(query) ||
        tags.includes(query)
      );
    });
  }, [selectedFilterId, activeKpiFilter, supportQuery]);

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
    const workspaceRoute = resolveCaseWorkspaceTarget(item);

    if (workspaceRoute) {
      onOpenScreen?.(workspaceRoute);
      return;
    }

    setCaseFeedback(item.id, 'هذه الحالة Preview فقط وتحتاج bridge للقراءة دون أي mutation محلي.');
  }

  function handleEscalate(item: OperationsSupportCase) {
    setSelectedFilterId('escalation');
    setExpandedCaseId(item.id);
    setCaseFeedback(item.id, `تم تمييز الحالة للتصعيد التشغيلي فقط. المالك الفعلي للمتابعة الآن هو ${resolvePartnerCaseOwnerLabel(item)}.`);
  }

  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 48 }}>
      <TopBar
        variant="secondary"
        title="العمليات والدعم"
        subtitle="Partner Command Desk"
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

      <Box gap={1} paddingY={1}>
        <Text role="titleSm" style={{ textAlign }}>Partner Command Desk</Text>
        <Text role="bodySm" tone="soft" style={{ textAlign }}>
          المتابعة والتحكم الفوري في الطلبات والاستثناءات والدعم بصف أولوية موحد.
        </Text>
      </Box>

      <Divider />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: rowDirection,
          gap: 8,
          paddingVertical: 4,
        }}
      >
        <Chip
          label={`الكل (${operationsSupportCases.length})`}
          selected={activeKpiFilter === 'all'}
          onPress={() => {
            setActiveKpiFilter('all');
            setSelectedFilterId('all');
          }}
        />
        <Chip
          label={`خطر SLA (${summary.slaRisk})`}
          selected={activeKpiFilter === 'sla-risk'}
          onPress={() => {
            setActiveKpiFilter('sla-risk');
            setSelectedFilterId('all');
          }}
        />
        <Chip
          label={`تحتاج قرار (${summary.needsDecision})`}
          selected={activeKpiFilter === 'needs-decision'}
          onPress={() => {
            setActiveKpiFilter('needs-decision');
            setSelectedFilterId('all');
          }}
        />
        <Chip
          label={`المحادثات (${summary.pendingConversations})`}
          selected={activeKpiFilter === 'conversations'}
          onPress={() => {
            setActiveKpiFilter('conversations');
            setSelectedFilterId('conversations');
          }}
        />
        <Chip
          label={`المشاكل (${summary.openIssues})`}
          selected={activeKpiFilter === 'order-issues'}
          onPress={() => {
            setActiveKpiFilter('order-issues');
            setSelectedFilterId('order-issues');
          }}
        />
      </ScrollView>

      <Divider />

      <Box gap={3} paddingY={1}>
        <SearchField
          value={supportQuery}
          onChangeText={setSupportQuery}
          placeholder="البحث عن ORD، حالة، أو أطراف..."
        />

        <Tabs
          items={commandCenterFilterItems}
          value={selectedFilterId}
          onValueChange={(id) => {
            setSelectedFilterId(id as DshPartnerSupportCommandFilterId);
            if (id === 'conversations') {
              setActiveKpiFilter('conversations');
            } else if (id === 'order-issues') {
              setActiveKpiFilter('order-issues');
            } else {
              setActiveKpiFilter('all');
            }
          }}
          variant="pill"
          scrollable
        />
      </Box>

      <Divider />

      <Box gap={3} paddingY={2}>
        <SectionHeader
          title="صف الأولوية"
          subtitle="حالات تشغيلية ذكية مرتبة حسب الأولوية ومربوطة بالمسار التالي مباشرة."
        />

        {visibleItems.length === 0 ? (
          <StateView
            stateId="empty"
            title="لا توجد نتائج مطابقة"
            description="غيّر معايير البحث أو الفلتر للمتابعة."
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
      </Box>
    </MobileScrollView>
  );
}

export default PartnerSupportScreen;
