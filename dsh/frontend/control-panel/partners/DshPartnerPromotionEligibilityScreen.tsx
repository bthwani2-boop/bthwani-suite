'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, KeyValueList, StateView, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelCompactPager,
  WebControlPanelDecisionRow,
  WebControlPanelDenseHeader,
  WebControlPanelInspectorShell,
  WebControlPanelQueue,
  WebControlPanelRecommendation,
  WebControlPanelStatusTag,
  WebControlPanelWorkbench,
} from '@bthwani/ui-kit/web';
import { translateDshRuntimeBindingStatus } from '../shared';

import { dshPromotionCandidates, type DshPromotionCandidate } from '../../shared/workflow';

type PromotionEligibilityState = 'ready' | 'empty' | 'pending' | 'blocked' | 'loading';

export type DshPartnerPromotionEligibilityScreenProps = {
  marketingHref?: string;
  catalogHref?: string;
  state?: PromotionEligibilityState;
};

function resolveApprovalTone(state: DshPromotionCandidate['status']) {
  if (state === 'marketing-ready') return 'success';
  if (state === 'partner-review' || state === 'draft') return 'warning';
  return 'danger';
}

function resolveEligibilityTone(state: DshPromotionCandidate['eligibility']) {
  if (state === 'eligible') return 'success';
  if (state === 'review') return 'warning';
  return 'danger';
}

function resolveStatusLabel(state: DshPromotionCandidate['status']) {
  if (state === 'draft') return 'وارد من الشريك';
  if (state === 'partner-review') return 'تحت مراجعة الشركاء';
  if (state === 'marketing-ready') return 'جاهز للتسويق';
  return 'مرفوض';
}

function resolveEligibilityLabel(state: DshPromotionCandidate['eligibility']) {
  if (state === 'eligible') return 'مؤهل للتسويق';
  if (state === 'review') return 'يتطلب مراجعة';
  return 'محجوب';
}

function resolveRowTone(candidate: DshPromotionCandidate) {
  if (candidate.eligibility === 'blocked' || candidate.status === 'marketing-rejected') {
    return 'danger' as const;
  }

  if (candidate.eligibility === 'review' || candidate.status === 'partner-review') {
    return 'warning' as const;
  }

  return 'success' as const;
}

function resolveRiskTone(candidate: DshPromotionCandidate) {
  if (candidate.eligibility === 'blocked') {
    return 'danger' as const;
  }

  if (candidate.eligibility === 'review') {
    return 'warning' as const;
  }

  return 'neutral' as const;
}

function resolvePrimaryActionLabel(candidate: DshPromotionCandidate) {
  if (candidate.status === 'marketing-ready') {
    return 'فتح التسويق';
  }

  if (candidate.eligibility === 'eligible') {
    return 'إرسال للتسويق';
  }

  return 'فتح الكتالوج';
}

function resolveActionMessage(candidate: DshPromotionCandidate) {
  if (candidate.status === 'marketing-ready') {
    return 'العنصر موجود أصلًا داخل مسار التسويق الجاهز للجدولة.';
  }

  if (candidate.eligibility === 'eligible') {
    return 'العنصر مؤهل ويمكن تمريره إلى التسويق بعد تثبيت النية الحالية.';
  }

  return 'العنصر يحتاج ضبطًا في الكتالوج أو الجاهزية قبل أي تمرير تسويقي.';
}

export function DshPartnerPromotionEligibilityScreen({
  marketingHref = '/marketing',
  catalogHref = '/catalogs',
  state = 'ready',
}: DshPartnerPromotionEligibilityScreenProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = React.useState(dshPromotionCandidates[0]?.id ?? '');
  const [actionMessage, setActionMessage] = React.useState('المراجعة الحالية تحدد جاهزية العنصر ليظهر ضمن منظومة المزايا والعروض.');

  const selectedItem = dshPromotionCandidates.find((item) => item.id === selectedId) ?? dshPromotionCandidates[0];
  const eligibleCount = dshPromotionCandidates.filter((item) => item.eligibility === 'eligible').length;
  const reviewCount = dshPromotionCandidates.filter((item) => item.eligibility === 'review').length;
  const readyForMarketingCount = dshPromotionCandidates.filter((item) => item.status === 'marketing-ready').length;

  React.useEffect(() => {
    if (!dshPromotionCandidates.some((item) => item.id === selectedId)) {
      setSelectedId(dshPromotionCandidates[0]?.id ?? '');
    }
  }, [selectedId]);

  React.useEffect(() => {
    if (selectedItem) {
      setActionMessage(resolveActionMessage(selectedItem));
    }
  }, [selectedItem]);

  if (state === 'loading') {
    return <StateView stateId="loading" title="جارٍ فحص الأهلية" description="نراجع أهلية الشريك والمتجر قبل تمرير أي ميزة أو عرض إلى التسويق." />;
  }

  if (state === 'empty') {
    return <StateView stateId="empty" title="لا توجد عناصر مؤهلة الآن" description="أضف متجرًا أو منتجًا جاهزًا ثم أعد فتح مسار الأهلية." actionLabel="فتح التسويق" onActionPress={() => router.push(marketingHref)} />;
  }

  if (state === 'pending') {
    return <StateView stateId="loading" title="الأهلية قيد المراجعة" description="هذه مجرد معاينة محلية لحالة pending قبل اعتماد الظهور." />;
  }

  if (state === 'blocked') {
    return <StateView stateId="blockingError" title="الأهلية محجوبة" description="أكمل الجاهزية التشغيلية والوثائق قبل طلب الظهور." actionLabel="فتح الكتالوج" onActionPress={() => router.push(catalogHref)} />;
  }

  const handlePrimaryAction = () => {
    if (!selectedItem) {
      return;
    }

    if (selectedItem.status === 'marketing-ready' || selectedItem.eligibility === 'eligible') {
      setActionMessage(selectedItem.status === 'marketing-ready' ? 'تم فتح مسار التسويق لهذا العنصر.' : 'تم تمرير النية إلى التسويق لمتابعة مسار المزايا والعروض.');
      router.push(marketingHref);
      return;
    }

    setActionMessage('أُعيدت النية إلى الكتالوج لاستكمال الجاهزية المطلوبة.');
    router.push(catalogHref);
  };

  const handleSecondaryAction = () => {
    if (!selectedItem) {
      return;
    }

    setActionMessage('تمت إعادة النية إلى مسار الكتالوج لاستكمال التعديلات قبل الترويج.');
    router.push(catalogHref);
  };

  return (
    <WebControlPanelWorkbench
      header={
        <WebControlPanelDenseHeader
          eyebrow="الشركاء"
          title="جاهزية المزايا والعروض"
          description="مراجعة ما يرسله الشركاء من عروض ومزايا، وتحديد ما إذا كان جاهزًا للتمرير إلى التسويق أو يحتاج تصحيحًا داخل الكتالوج."
          metrics={[
            { id: 'eligible-count', label: 'مؤهل للظهور', value: String(eligibleCount) },
            { id: 'review-count', label: 'قيد المراجعة', value: String(reviewCount) },
            { id: 'marketing-ready-count', label: 'جاهز للتسويق', value: String(readyForMarketingCount) },
          ]}
        />
      }
      main={
        <Box gap={3}>
          <Box gap={2} layoutDirection="row" style={{ flexWrap: 'wrap' }}>
            <WebControlPanelStatusTag label={resolveStatusLabel(selectedItem?.status ?? 'draft')} tone={resolveApprovalTone(selectedItem?.status ?? 'draft')} />
            <WebControlPanelStatusTag label={selectedItem?.kind === 'product' ? 'منتج' : 'متجر'} tone="info" />
            <WebControlPanelStatusTag label={resolveEligibilityLabel(selectedItem?.eligibility ?? 'review')} tone={resolveEligibilityTone(selectedItem?.eligibility ?? 'review')} />
            <WebControlPanelStatusTag label={translateDshRuntimeBindingStatus('UI_PREVIEW_ONLY')} tone="neutral" />
          </Box>

          <WebControlPanelQueue
            title="طابور نوايا المزايا"
            meta="راجع العناصر المؤهلة وأبقِ قرار تمريرها إلى التسويق أو إرجاعها إلى الكتالوج واضحًا داخل صف واحد."
            pager={<WebControlPanelCompactPager page={1} totalPages={1} summaryLabel="كل العناصر الحالية" />}
          >
            {dshPromotionCandidates.map((item) => (
              <WebControlPanelDecisionRow
                key={item.id}
                entityId={item.id}
                entityLabel={`${item.title} · ${item.kind === 'product' ? 'منتج' : 'متجر'}`}
                status={item.availability}
                statusTone={resolveRowTone(item)}
                risk={resolveRiskTone(item)}
                recommendation={item.offerHint}
                reason={`الاعتماد ${resolveStatusLabel(item.status)} · الأهلية ${resolveEligibilityLabel(item.eligibility)}.`}
                sla={`التوفر الحالي: ${item.availability}`}
                primaryAction={{ id: `${item.id}-primary`, label: resolvePrimaryActionLabel(item), onAction: () => setSelectedId(item.id) }}
                secondaryAction={{ id: `${item.id}-inspect`, label: 'عرض التفاصيل', onAction: () => setSelectedId(item.id) }}
                onInspect={() => setSelectedId(item.id)}
              />
            ))}
          </WebControlPanelQueue>
        </Box>
      }
      inspector={
        <WebControlPanelInspectorShell
          title={selectedItem ? `تفاصيل ${selectedItem.title}` : 'تفاصيل الأهلية'}
          onClose={() => setSelectedId(dshPromotionCandidates[0]?.id ?? '')}
        >
          <Box gap={2}>
            <KeyValueList
              dense
              items={[
                { label: 'العنصر', value: selectedItem?.title ?? 'غير محدد', tone: 'brand' },
                { label: 'النوع', value: selectedItem?.kind === 'product' ? 'منتج' : 'متجر', tone: 'default' },
                { label: 'حالة الاعتماد', value: resolveStatusLabel(selectedItem?.status ?? 'draft'), tone: resolveApprovalTone(selectedItem?.status ?? 'draft') },
                { label: 'الجاهزية', value: resolveEligibilityLabel(selectedItem?.eligibility ?? 'review'), tone: resolveEligibilityTone(selectedItem?.eligibility ?? 'review') },
                { label: 'التوفر', value: selectedItem?.availability ?? 'غير محدد', tone: 'default' },
                { label: 'ملاحظة الترويج', value: selectedItem?.offerHint ?? '', tone: 'default' },
              ]}
            />

            <WebControlPanelRecommendation
              title="قرار الأهلية الحالي"
              reason={selectedItem ? `حالة الاعتماد ${resolveStatusLabel(selectedItem.status)} · ${selectedItem.offerHint}` : 'اختر عنصرًا لعرض قرار أهلية الميزة أو العرض.'}
              confidence={selectedItem?.eligibility === 'eligible' ? 'high' : selectedItem?.eligibility === 'review' ? 'medium' : 'low'}
              auditTag="UI_PREVIEW_ONLY"
              primaryAction={selectedItem ? { id: `${selectedItem.id}-route-primary`, label: resolvePrimaryActionLabel(selectedItem), onAction: handlePrimaryAction } : undefined}
              secondaryAction={selectedItem ? { id: `${selectedItem.id}-route-secondary`, label: 'فتح الكتالوج', onAction: handleSecondaryAction } : undefined}
            />

            <Text role="bodySm" tone="muted">{actionMessage}</Text>
          </Box>
        </WebControlPanelInspectorShell>
      }
    />
  );
}

export default DshPartnerPromotionEligibilityScreen;
