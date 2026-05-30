'use client';

import React from 'react';
import { Box, Button, KeyValueList, StateView, Surface, Text } from '@bthwani/ui-kit';
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
import { getMarketingReviewItems, approveMediaReviewItem, requestMediaFix, rejectMediaReviewItem, sendMediaToCatalog } from '../../data/marketing.preview-data';
import { ApprovalRecord, ApprovalStage, isPartnerOwnedException, resolveNextOwner, translateEntityType, translateOwner, translateStage } from '../../shared/workflow';
import { getMarketingPermissionResult } from '../../shared/dsh-role-permission.model';



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
 */
function getStageMeta(stage: ApprovalStage): { tone: string; label: string } {
  switch (stage) {
    case 'marketing-review': return { tone: 'warning', label: 'قيد المراجعة التسويقية' };
    case 'marketing-approved': return { tone: 'brand', label: 'معتمد تسويقياً' };
    case 'catalog-adopted': return { tone: 'success', label: 'أُرسل للكتالوج' };
    case 'needs-fix': return { tone: 'danger', label: 'يتطلب تعديل' };
    case 'rejected': return { tone: 'default', label: 'مرفوض' };
    default: return { tone: 'default', label: stage };
  }
}

function resolveTone(stage: ApprovalStage): 'warning' | 'success' | 'danger' | 'neutral' {
  const tone = getStageMeta(stage).tone;
  if (tone === 'warning') return 'warning';
  if (tone === 'success') return 'success';
  if (tone === 'danger') return 'danger';
  return 'neutral';
}

function resolveRisk(stage: ApprovalStage): 'danger' | 'warning' | 'neutral' {
  if (stage === 'needs-fix' || stage === 'rejected') return 'danger';
  if (stage === 'marketing-review') return 'warning';
  return 'neutral';
}

function resolvePolicyLabel(item: ApprovalRecord): string {
  return isPartnerOwnedException(item.stage, item.entityType) ? 'استثناء شريك' : 'وسائط كتالوج';
}

function resolveRecommendation(item: ApprovalRecord): string {
  if (item.stage === 'marketing-review') return 'راجع الملاءمة التسويقية ثم قرر الاعتماد أو طلب التعديل.';
  if (item.stage === 'marketing-approved') return 'العنصر جاهز للإرسال إلى الكتالوج لتثبيت الظهور النهائي.';
  if (item.stage === 'catalog-adopted') return 'تمت الاستفادة من العنصر في الكتالوج ويجب فقط مراقبة الاتساق.';
  if (item.stage === 'needs-fix') return 'العنصر يحتاج تعديلًا قبل دخوله مراجعة التسويق مرة أخرى.';
  return 'تم رفض العنصر ويحتاج قرارًا جديدًا من المصدر قبل إعادة التقديم.';
}

type StageTransition = { action: 'approve' | 'catalog' | 'fix' | 'reject'; labelTemplate: string } | null;

function getReviewQueuePrimaryTransition(stage: ApprovalStage): StageTransition {
  if (stage === 'marketing-review') return { action: 'approve', labelTemplate: 'اعتماد "{title}" وإنهاء مرحلة المراجعة التسويقية.' };
  if (stage === 'marketing-approved') return { action: 'catalog', labelTemplate: 'إرسال "{title}" إلى الكتالوج للتثبيت النهائي.' };
  return null;
}

function getReviewQueueSecondaryTransition(stage: ApprovalStage): StageTransition {
  if (stage === 'marketing-review' || stage === 'marketing-approved') return { action: 'fix', labelTemplate: 'إعادة "{title}" إلى مسار التعديل.' };
  return null;
}

function getReviewQueueRejectTransition(stage: ApprovalStage): StageTransition {
  if (stage === 'marketing-review') return { action: 'reject', labelTemplate: 'رفض "{title}" وإرجاعه إلى المصدر. لا يمكن التراجع.' };
  return null;
}

const CONFIRM_ACTION_MESSAGES: Record<string, string> = {
  approve: 'تم اعتماد العنصر داخل مراجعة التسويق.',
  catalog: 'تم إرسال العنصر إلى الكتالوج.',
  fix: 'تمت إعادة العنصر إلى مسار التعديل.',
  reject: 'تم رفض العنصر وإرجاعه إلى المصدر.',
};

export function MarketingReviewQueue() {
  const [items, setItems] = React.useState<ApprovalRecord[]>([]);
  const [selectedId, setSelectedId] = React.useState('');
  const [actionMessage, setActionMessage] = React.useState('اختر عنصرًا من الصف لمراجعة قرار التسويق الحالي.');
  const [confirmPending, setConfirmPending] = React.useState<{ action: 'approve' | 'reject' | 'fix' | 'catalog'; label: string } | null>(null);

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

  const filteredItems = items.filter((item) => ['marketing-review', 'marketing-approved', 'needs-fix', 'rejected', 'catalog-adopted'].includes(item.stage));
  const reviewCount = filteredItems.filter((item) => item.stage === 'marketing-review').length;
  const approvedCount = filteredItems.filter((item) => item.stage === 'marketing-approved').length;
  const catalogCount = filteredItems.filter((item) => item.stage === 'catalog-adopted').length;

  const executeConfirm = () => {
    if (!confirmPending || !selectedItem) { setConfirmPending(null); return; }
    handleAction(selectedItem.id, confirmPending.action);
    setActionMessage(CONFIRM_ACTION_MESSAGES[confirmPending.action] ?? 'تم تنفيذ الإجراء.');
    setConfirmPending(null);
  };

  const cancelConfirm = () => setConfirmPending(null);

  const mediaApprovePerm = getMarketingPermissionResult('marketing-media-approve');
  const catalogSendPerm = getMarketingPermissionResult('marketing-catalog-send');

  const handlePrimaryAction = () => {
    if (!selectedItem) return;
    const transition = getReviewQueuePrimaryTransition(selectedItem.stage);
    if (transition) {
      const requiredSection = transition.action === 'catalog' ? 'marketing-catalog-send' : 'marketing-media-approve';
      const perm = requiredSection === 'marketing-catalog-send' ? catalogSendPerm : mediaApprovePerm;
      if (!perm.allowed) { setActionMessage(perm.reason); return; }
      setConfirmPending({ action: transition.action, label: transition.labelTemplate.replace('{title}', selectedItem.title) });
      return;
    }
    setActionMessage('لا توجد نقلة تلقائية إضافية لهذا العنصر من هذه المرحلة.');
  };

  const handleSecondaryAction = () => {
    if (!selectedItem) return;
    const transition = getReviewQueueSecondaryTransition(selectedItem.stage);
    if (transition) {
      if (!mediaApprovePerm.allowed) { setActionMessage(mediaApprovePerm.reason); return; }
      setConfirmPending({ action: transition.action, label: transition.labelTemplate.replace('{title}', selectedItem.title) });
      return;
    }
    setActionMessage('المتابعة هنا للعرض فقط؛ لا يوجد إجراء ثانوي متاح لهذه المرحلة.');
  };

  const handleRejectAction = () => {
    if (!selectedItem) return;
    const transition = getReviewQueueRejectTransition(selectedItem.stage);
    if (transition) {
      if (!mediaApprovePerm.allowed) { setActionMessage(mediaApprovePerm.reason); return; }
      setConfirmPending({ action: transition.action, label: transition.labelTemplate.replace('{title}', selectedItem.title) });
      return;
    }
    setActionMessage('الرفض متاح فقط أثناء مرحلة المراجعة التسويقية.');
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

            {confirmPending ? (
              <Surface tone="inset" padding={3} gap={2}>
                <Text role="bodyStrong">{confirmPending.label}</Text>
                <Box layoutDirection="row" gap={2}>
                  <Button label="تأكيد" tone="danger" size="sm" fullWidth={false} onPress={executeConfirm} />
                  <Button label="إلغاء" tone="ghost" size="sm" fullWidth={false} onPress={cancelConfirm} />
                </Box>
              </Surface>
            ) : (
              <WebControlPanelActionCluster
                primary={{ id: 'marketing-primary', label: selectedItem?.stage === 'marketing-review' ? 'اعتماد' : selectedItem?.stage === 'marketing-approved' ? 'إرسال للكتالوج' : 'تثبيت المتابعة', onAction: handlePrimaryAction }}
                secondary={{ id: 'marketing-secondary', label: selectedItem?.stage === 'marketing-review' ? 'رفض' : selectedItem?.stage === 'marketing-approved' ? 'طلب تعديل' : 'لا إجراء', onAction: selectedItem?.stage === 'marketing-review' ? handleRejectAction : handleSecondaryAction }}
              />
            )}

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
