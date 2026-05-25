'use client';

import React from 'react';
import { Box, KeyValueList, StateView, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelActionCluster,
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
import { getMarketingReviewItems, approveMediaReviewItem, requestMediaFix, rejectMediaReviewItem, sendMediaToCatalog } from '../../data/marketing-review.preview-store';
import { ApprovalRecord, ApprovalStage, isPartnerOwnedException, resolveNextOwner, translateEntityType, translateOwner, translateStage } from '../../shared/workflow';

export function MarketingReviewQueue() {
  const [items, setItems] = React.useState<ApprovalRecord[]>([]);
  const [selectedId, setSelectedId] = React.useState('');
  const [actionMessage, setActionMessage] = React.useState('اختر عنصرًا من الصف لمراجعة قرار التسويق الحالي.');

  const refresh = () => setItems(getMarketingReviewItems());

  React.useEffect(() => {
    refresh();
  }, []);

  React.useEffect(() => {
    if (!items.some((item) => item.id === selectedId)) {
      setSelectedId(items[0]?.id ?? '');
    }
  }, [items, selectedId]);

  const handleAction = (id: string, action: 'approve' | 'reject' | 'fix' | 'catalog') => {
    if (action === 'approve') {
      approveMediaReviewItem(id);
    } else if (action === 'reject') {
      rejectMediaReviewItem(id);
    } else if (action === 'fix') {
      requestMediaFix(id);
    } else if (action === 'catalog') {
      sendMediaToCatalog(id);
    }
    refresh();
  };

  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];

  const getStageMeta = (stage: ApprovalStage) => {
    switch (stage) {
      case 'marketing-review': return { tone: 'warning', label: 'قيد المراجعة التسويقية' };
      case 'marketing-approved': return { tone: 'brand', label: 'معتمد تسويقياً' };
      case 'catalog-adopted': return { tone: 'success', label: 'أُرسل للكتالوج' };
      case 'needs-fix': return { tone: 'danger', label: 'يتطلب تعديل' };
      case 'rejected': return { tone: 'default', label: 'مرفوض' };
      default: return { tone: 'default', label: stage };
    }
  };

  const filteredItems = items.filter((item) => ['marketing-review', 'marketing-approved', 'needs-fix', 'rejected', 'catalog-adopted'].includes(item.stage));
  const reviewCount = filteredItems.filter((item) => item.stage === 'marketing-review').length;
  const approvedCount = filteredItems.filter((item) => item.stage === 'marketing-approved').length;
  const catalogCount = filteredItems.filter((item) => item.stage === 'catalog-adopted').length;

  const resolveTone = (stage: ApprovalStage) => {
    const tone = getStageMeta(stage).tone;
    if (tone === 'warning') return 'warning' as const;
    if (tone === 'success') return 'success' as const;
    if (tone === 'danger') return 'danger' as const;
    return 'neutral' as const;
  };

  const resolveRisk = (stage: ApprovalStage) => {
    if (stage === 'needs-fix' || stage === 'rejected') {
      return 'danger' as const;
    }

    if (stage === 'marketing-review') {
      return 'warning' as const;
    }

    return 'neutral' as const;
  };

  const resolvePolicyLabel = (item: ApprovalRecord) => {
    return isPartnerOwnedException(item.stage, item.entityType) ? 'استثناء شريك' : 'وسائط كتالوج';
  };

  const resolveRecommendation = (item: ApprovalRecord) => {
    if (item.stage === 'marketing-review') {
      return 'راجع الملاءمة التسويقية ثم قرر الاعتماد أو طلب التعديل.';
    }

    if (item.stage === 'marketing-approved') {
      return 'العنصر جاهز للإرسال إلى الكتالوج لتثبيت الظهور النهائي.';
    }

    if (item.stage === 'catalog-adopted') {
      return 'تمت الاستفادة من العنصر في الكتالوج ويجب فقط مراقبة الاتساق.';
    }

    if (item.stage === 'needs-fix') {
      return 'العنصر يحتاج تعديلًا قبل دخوله مراجعة التسويق مرة أخرى.';
    }

    return 'تم رفض العنصر ويحتاج قرارًا جديدًا من المصدر قبل إعادة التقديم.';
  };

  const handlePrimaryAction = () => {
    if (!selectedItem) {
      return;
    }

    if (selectedItem.stage === 'marketing-review') {
      handleAction(selectedItem.id, 'approve');
      setActionMessage('تم اعتماد العنصر داخل مراجعة التسويق.');
      return;
    }

    if (selectedItem.stage === 'marketing-approved') {
      handleAction(selectedItem.id, 'catalog');
      setActionMessage('تم إرسال العنصر إلى الكتالوج.');
      return;
    }

    setActionMessage('لا توجد نقلة تلقائية إضافية لهذا العنصر من هذه المرحلة.');
  };

  const handleSecondaryAction = () => {
    if (!selectedItem) {
      return;
    }

    if (selectedItem.stage === 'marketing-review' || selectedItem.stage === 'marketing-approved') {
      handleAction(selectedItem.id, 'fix');
      setActionMessage('تمت إعادة العنصر إلى مسار التعديل.');
      return;
    }

    setActionMessage('المتابعة هنا للعرض فقط؛ لا يوجد إجراء ثانوي متاح لهذه المرحلة.');
  };

  const handleRejectAction = () => {
    if (!selectedItem || selectedItem.stage !== 'marketing-review') {
      setActionMessage('الرفض متاح فقط أثناء مرحلة المراجعة التسويقية.');
      return;
    }

    handleAction(selectedItem.id, 'reject');
    setActionMessage('تم رفض العنصر وإرجاعه إلى المصدر.');
  };

  return (
    <WebControlPanelWorkbench
      header={
        <WebControlPanelDenseHeader
          eyebrow="التسويق"
          title="صف مراجعة التسويق"
          description="مراجعة العروض والصور والنصوص قبل اعتمادها أو تمريرها إلى الكتالوج النهائي."
          metrics={[
            { id: 'review-count', label: 'قيد المراجعة', value: String(reviewCount) },
            { id: 'approved-count', label: 'معتمد تسويقياً', value: String(approvedCount) },
            { id: 'catalog-count', label: 'مرسل للكتالوج', value: String(catalogCount) },
          ]}
        />
      }
      main={
        <Box gap={3}>
          <Box gap={2} layoutDirection="row" style={{ flexWrap: 'wrap' }}>
            <WebControlPanelStatusTag label={getStageMeta(selectedItem?.stage ?? 'marketing-review').label} tone={resolveTone(selectedItem?.stage ?? 'marketing-review')} />
            <WebControlPanelStatusTag label={selectedItem ? translateEntityType(selectedItem.entityType) : 'غير محدد'} tone="info" />
            <WebControlPanelStatusTag label={selectedItem ? resolvePolicyLabel(selectedItem) : 'سياسة غير محددة'} tone="neutral" />
            <WebControlPanelStatusTag label={translateDshRuntimeBindingStatus('UI_PREVIEW_ONLY')} tone="neutral" />
          </Box>

          <WebControlPanelQueue
            title="العناصر المعروضة للمراجعة"
            meta="كل صف يحتفظ بقرار واحد واضح: اعتماد، تعديل، أو متابعة حتى الكتالوج."
            pager={<WebControlPanelCompactPager page={1} totalPages={1} summaryLabel="كل عناصر الصف الحالية" />}
          >
            {filteredItems.map((item) => (
              <WebControlPanelDecisionRow
                key={item.id}
                entityId={item.id}
                entityLabel={`${item.title} · ${translateEntityType(item.entityType)}`}
                status={getStageMeta(item.stage).label}
                statusTone={resolveTone(item.stage)}
                risk={resolveRisk(item.stage)}
                recommendation={resolveRecommendation(item)}
                reason={`المصدر ${translateOwner(item.source)} · السياسة ${resolvePolicyLabel(item)}.`}
                sla={`المالك التالي: ${translateOwner(resolveNextOwner(item.stage))}`}
                primaryAction={{ id: `${item.id}-pin`, label: 'تثبيت العنصر', onAction: () => setSelectedId(item.id) }}
                secondaryAction={{ id: `${item.id}-inspect`, label: 'عرض القرار', onAction: () => setSelectedId(item.id) }}
                onInspect={() => setSelectedId(item.id)}
              />
            ))}
          </WebControlPanelQueue>
        </Box>
      }
      inspector={
        <WebControlPanelInspectorShell
          title={selectedItem ? `تفاصيل ${selectedItem.title}` : 'تفاصيل المراجعة'}
          onClose={() => setSelectedId(filteredItems[0]?.id ?? '')}
        >
          <Box gap={2}>
            <KeyValueList
              dense
              items={[
                { label: 'المعرف', value: selectedItem?.id ?? 'غير محدد', tone: 'brand' },
                { label: 'نوع العنصر', value: selectedItem ? translateEntityType(selectedItem.entityType) : 'غير محدد', tone: 'default' },
                { label: 'المرحلة', value: selectedItem ? translateStage(selectedItem.stage) : 'غير محدد', tone: getStageMeta(selectedItem?.stage ?? 'marketing-review').tone === 'danger' ? 'danger' : getStageMeta(selectedItem?.stage ?? 'marketing-review').tone === 'warning' ? 'warning' : getStageMeta(selectedItem?.stage ?? 'marketing-review').tone === 'success' ? 'success' : 'default' },
                { label: 'المصدر', value: selectedItem ? translateOwner(selectedItem.source) : 'غير محدد', tone: 'default' },
                { label: 'المالك التالي', value: selectedItem ? translateOwner(resolveNextOwner(selectedItem.stage)) : 'غير محدد', tone: 'default' },
                { label: 'السياسة', value: selectedItem ? resolvePolicyLabel(selectedItem) : 'غير محددة', tone: 'default' },
              ]}
            />

            <WebControlPanelRecommendation
              title="القرار الحالي"
              reason={selectedItem ? resolveRecommendation(selectedItem) : 'اختر عنصرًا من الصف لعرض القرار.'}
              confidence={selectedItem?.stage === 'marketing-approved' || selectedItem?.stage === 'catalog-adopted' ? 'high' : selectedItem?.stage === 'marketing-review' ? 'medium' : 'low'}
              auditTag="UI_PREVIEW_ONLY"
              primaryAction={selectedItem ? { id: `${selectedItem.id}-primary`, label: selectedItem.stage === 'marketing-review' ? 'اعتماد' : selectedItem.stage === 'marketing-approved' ? 'إرسال للكتالوج' : 'تثبيت المتابعة', onAction: handlePrimaryAction } : undefined}
              secondaryAction={selectedItem ? { id: `${selectedItem.id}-secondary`, label: selectedItem.stage === 'marketing-review' || selectedItem.stage === 'marketing-approved' ? 'طلب تعديل' : 'لا إجراء', onAction: handleSecondaryAction } : undefined}
            />

            <WebControlPanelActionCluster
              primary={{ id: 'marketing-primary', label: selectedItem?.stage === 'marketing-review' ? 'اعتماد' : selectedItem?.stage === 'marketing-approved' ? 'إرسال للكتالوج' : 'تثبيت المتابعة', onAction: handlePrimaryAction }}
              secondary={{ id: 'marketing-secondary', label: selectedItem?.stage === 'marketing-review' ? 'رفض' : selectedItem?.stage === 'marketing-approved' ? 'طلب تعديل' : 'لا إجراء', onAction: selectedItem?.stage === 'marketing-review' ? handleRejectAction : handleSecondaryAction }}
            />

            <Box gap={1}>
              <WebControlPanelStatusTag label={selectedItem ? translateOwner(selectedItem.source) : 'غير محدد'} tone="info" />
              <WebControlPanelStatusTag label={selectedItem ? resolvePolicyLabel(selectedItem) : 'غير محددة'} tone="neutral" />
              <WebControlPanelStatusTag label={selectedItem ? translateStage(selectedItem.stage) : 'غير محدد'} tone={resolveTone(selectedItem?.stage ?? 'marketing-review')} />
            </Box>

            <Text role="bodySm" tone="muted">{actionMessage}</Text>
          </Box>
        </WebControlPanelInspectorShell>
      }
    />
  );
}
