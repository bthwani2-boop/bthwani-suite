import React from 'react';
import { Box, Button, Text, ListItem, useTheme } from '@bthwani/ui-kit';
import { WebCompactSurfaceHeader, WebControlPanelCompactPager } from '@bthwani/ui-kit/web';
import {
  getCatalogAdoptionItems,
  adoptCatalogCentral,
  adoptCatalogException,
  activateClientVisible,
  returnToMarketing,
  rejectFromCatalog,
} from '../../../data/marketing.preview-data';
import { ApprovalRecord, ApprovalStage, translateStage, translateEntityType, translateOwner } from '../../../shared/workflow';

// UI_PREVIEW_ONLY: adoption queue actions — no backend/API binding.
// control-panel/catalogs is the ONLY surface that can adopt or activate catalog items.

type CatalogQueueAction = 'adopt-central' | 'adopt-exception' | 'visible' | 'reject' | 'fix';

type CatalogQueueActionResult = {
  itemId: string;
  displayCaption: string;
  action: CatalogQueueAction;
  label: string;
  nextStage: string;
  owner: string;
  note: string;
};

function resolveActionLabel(action: CatalogQueueAction): string {
  switch (action) {
    case 'adopt-central': return 'اعتماد مركزي';
    case 'adopt-exception': return 'استثناء شريك';
    case 'visible': return 'تفعيل للعميل';
    case 'reject': return 'رفض';
    case 'fix': return 'إعادة للتسويق';
  }
}

function resolveNextStage(action: CatalogQueueAction): string {
  switch (action) {
    case 'adopt-central': return 'catalog-adopted';
    case 'adopt-exception': return 'catalog-adopted';
    case 'visible': return 'client-visible';
    case 'reject': return 'rejected';
    case 'fix': return 'needs-fix';
  }
}

function resolveActionOwner(action: CatalogQueueAction): string {
  switch (action) {
    case 'adopt-central':
    case 'adopt-exception':
    case 'visible':
      return 'الكتالوج';
    case 'fix':
      return 'التسويق';
    case 'reject':
      return 'مرفوض';
  }
}

export function CatalogAdoptionQueueWorkspace() {
  const { theme } = useTheme();
  const [items, setItems] = React.useState<ApprovalRecord[]>([]);
  const [page, setPage] = React.useState(1);
  const [lastActionResult, setLastActionResult] = React.useState<CatalogQueueActionResult | null>(null);

  const pageSize = 5;

  const refresh = () => setItems(getCatalogAdoptionItems());

  React.useEffect(() => {
    refresh();
  }, []);

  const eligibleItems = React.useMemo(
    () => items.filter((item) => ['marketing-approved', 'catalog-adopted', 'client-visible', 'needs-fix', 'rejected'].includes(item.stage)),
    [items],
  );
  const totalPages = Math.max(1, Math.ceil(eligibleItems.length / pageSize));
  const visibleItems = React.useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return eligibleItems.slice(startIndex, startIndex + pageSize);
  }, [eligibleItems, page]);

  React.useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  const handleAction = (id: string, action: CatalogQueueAction) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    switch (action) {
      case 'adopt-central':
        adoptCatalogCentral(id);
        break;
      case 'adopt-exception':
        adoptCatalogException(id);
        break;
      case 'visible':
        activateClientVisible(id);
        break;
      case 'fix':
        returnToMarketing(id);
        break;
      case 'reject':
        rejectFromCatalog(id);
        break;
    }

    setLastActionResult({
      itemId: id,
      displayCaption: item.title,
      action,
      label: resolveActionLabel(action),
      nextStage: resolveNextStage(action),
      owner: resolveActionOwner(action),
      note: 'UI_PREVIEW_ONLY — لا يعني حفظًا فعليًا في runtime/API',
    });

    refresh();
  };

  const getStageStyle = (stage: ApprovalStage) => {
    const label = translateStage(stage);
    switch (stage) {
      case 'marketing-approved': return { tone: 'default' as const, label };
      case 'catalog-adopted': return { tone: 'brand' as const, label };
      case 'client-visible': return { tone: 'success' as const, label };
      case 'needs-fix': return { tone: 'danger' as const, label };
      case 'rejected': return { tone: 'default' as const, label };
      default: return { tone: 'default' as const, label };
    }
  };

  const pendingCount = items.filter(i => i.stage === 'marketing-approved').length;
  const badgeToneMap: Record<'default' | 'brand' | 'success' | 'danger', 'default' | 'success' | 'warning' | 'danger'> = {
    default: 'default',
    brand: 'default',
    success: 'success',
    danger: 'danger',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <WebCompactSurfaceHeader
        title="اعتماد الكتالوج الموحد"
        description="اعتماد العناصر النهائية لتصبح جزءًا من الكتالوج. لا يظهر للعميل إلا بعد التفعيل النهائي."
        metrics={[{ id: 'pending', title: 'بانتظار الاعتماد', value: String(pendingCount) }]}
      />

      {/* Last action result banner — shown after any queue action */}
      {lastActionResult && (
        <Box
          role="status"
          aria-live="polite"
          style={{ margin: '0 14px 8px 14px', padding: 10, backgroundColor: theme.surfaceInset, borderRadius: 8, gap: 2 }}
        >
          <Text role="bodySm">
            آخر إجراء: {lastActionResult.label} — {lastActionResult.displayCaption}
          </Text>
          <Text role="caption" tone="muted">
            المرحلة التالية: {lastActionResult.nextStage} · المالك: {lastActionResult.owner}
          </Text>
          <Text role="caption" tone="muted">
            {lastActionResult.note}
          </Text>
        </Box>
      )}

      <Box gap={2} style={{ flex: 1, minHeight: 0, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: theme.surfaceInset }}>
        {/* Empty state — no pager shown */}
        {eligibleItems.length === 0 ? (
          <Box padding={6} align="center" gap={2}>
            <Text tone="muted">لا توجد عناصر مؤهلة لاعتماد الكتالوج الآن.</Text>
            <Text role="caption" tone="muted">
              كل العناصر إمّا لم تصل بعد من التسويق أو أصبحت ظاهرة للعميل.
            </Text>
          </Box>
        ) : (
          <>
            {visibleItems.map(item => {
              const sStyle = getStageStyle(item.stage);

              // Terminal state labels (no CTA)
              const terminalMeta = (() => {
                if (item.stage === 'needs-fix') {
                  return (
                    <Box style={{ alignItems: 'flex-end' }}>
                      <Text role="caption" tone="warning">يحتاج تعديل — المالك: التسويق</Text>
                    </Box>
                  );
                }
                if (item.stage === 'rejected') {
                  return (
                    <Box style={{ alignItems: 'flex-end' }}>
                      <Text role="caption" tone="danger">مرفوض نهائيًا</Text>
                    </Box>
                  );
                }
                if (item.stage === 'client-visible') {
                  return (
                    <Box style={{ alignItems: 'flex-end' }}>
                      <Text role="caption" tone="muted">ظاهر للعميل — لا إجراء مطلوب</Text>
                    </Box>
                  );
                }
                return null;
              })();

              const actionMeta = (() => {
                if (item.stage === 'marketing-approved') {
                  return (
                    <Box style={{ alignItems: 'flex-end', gap: 8 }}>
                      <Box style={{ flexDirection: 'row', gap: '4px' }}>
                        <Button label="اعتماد مركزي" tone="primary" size="sm" onPress={() => handleAction(item.id, 'adopt-central')} />
                        <Button label="استثناء شريك" tone="secondary" size="sm" onPress={() => handleAction(item.id, 'adopt-exception')} />
                        <Button label="إعادة" tone="danger" size="sm" onPress={() => handleAction(item.id, 'fix')} />
                      </Box>
                    </Box>
                  );
                }
                if (item.stage === 'catalog-adopted') {
                  return (
                    <Box style={{ alignItems: 'flex-end', gap: 8 }}>
                      <Box style={{ flexDirection: 'row', gap: '4px' }}>
                        <Button label="تفعيل للعميل" tone="brand" size="sm" onPress={() => handleAction(item.id, 'visible')} />
                        <Button label="إعادة" tone="danger" size="sm" onPress={() => handleAction(item.id, 'fix')} />
                      </Box>
                    </Box>
                  );
                }
                return terminalMeta;
              })();

              return (
                <ListItem
                  key={item.id}
                  title={item.title}
                  subtitle={`${translateEntityType(item.entityType)} · المصدر: ${translateOwner(item.source)}`}
                  badgeLabel={sStyle.label}
                  badgeTone={badgeToneMap[sStyle.tone]}
                  meta={actionMeta}
                />
              );
            })}

            <WebControlPanelCompactPager
              page={page}
              totalPages={totalPages}
              summaryLabel={`عرض ${visibleItems.length} من ${eligibleItems.length} عناصر`}
              onPrevious={page > 1 ? () => setPage((currentPage) => currentPage - 1) : undefined}
              onNext={page < totalPages ? () => setPage((currentPage) => currentPage + 1) : undefined}
            />
          </>
        )}
      </Box>
    </div>
  );
}
