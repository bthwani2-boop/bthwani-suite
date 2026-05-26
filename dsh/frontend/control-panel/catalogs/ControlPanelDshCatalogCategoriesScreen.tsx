'use client';

import React from 'react';
import { Box, Button, useTheme } from '@bthwani/ui-kit';
import {
  WebCompactSurfaceHeader,
  WebControlPanelWorkspaceTabs,
  WebControlPanelStatusTag,
} from '@bthwani/ui-kit/web';
import { dshCatalogCategories } from './catalog';

// UI_PREVIEW_ONLY: category governance actions — no backend/API binding.
// control-panel/catalogs is the ONLY surface that can approve category nodes.

type CategoryGovernanceAction = 'approve-node' | 'request-edit';

type CategoryActionResult = {
  categoryId: string;
  action: CategoryGovernanceAction;
  label: string;
  status: 'success' | 'blocked';
  nextOwner: 'control-panel-catalog' | 'control-panel-marketing';
  note: string;
};

function resolveCategoryOwnerLabel(owner: string) {
  if (owner === 'partner') return 'الشركاء';
  if (owner === 'marketing') return 'التسويق';
  return 'الكتالوج';
}

function resolveNextOwnerLabel(owner: 'control-panel-catalog' | 'control-panel-marketing') {
  if (owner === 'control-panel-marketing') return 'التسويق';
  return 'الكتالوج';
}

export function ControlPanelDshCatalogCategoriesScreen() {
  const { theme } = useTheme();
  const categoryNodes = dshCatalogCategories;
  const [activeCategoryId, setActiveCategoryId] = React.useState<string | null>(categoryNodes[0]?.id ?? null);
  const [lastActionResult, setLastActionResult] = React.useState<CategoryActionResult | null>(null);

  // Reset result when category changes
  const handleSelectCategory = React.useCallback((id: string) => {
    setActiveCategoryId(id);
    setLastActionResult(null);
  }, []);

  const activeNode = categoryNodes.find((node) => node.id === activeCategoryId);

  const handleApproveNode = React.useCallback(() => {
    if (!activeNode) return;
    setLastActionResult({
      categoryId: activeNode.id,
      action: 'approve-node',
      label: 'اعتماد الفئة',
      status: 'success',
      nextOwner: 'control-panel-catalog',
      note: 'UI_PREVIEW_ONLY — لم يُحفظ في runtime/API',
    });
  }, [activeNode]);

  const handleRequestEdit = React.useCallback(() => {
    if (!activeNode) return;
    setLastActionResult({
      categoryId: activeNode.id,
      action: 'request-edit',
      label: 'طلب تعديل',
      status: 'blocked',
      nextOwner: 'control-panel-marketing',
      note: 'UI_PREVIEW_ONLY — يُرسل للتسويق عند تفعيل API',
    });
  }, [activeNode]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <WebCompactSurfaceHeader
        title="حوكمة الفئات"
        description="مراجعة عقدة الفئة والموافقة على التعديلات"
        metrics={[
          { id: 'total', title: 'الفئات', value: String(categoryNodes.length) },
          { id: 'verified', title: 'تم التحقق', value: String(categoryNodes.length) },
        ]}
      />
      <WebControlPanelWorkspaceTabs
        items={categoryNodes.map((node) => ({
          id: node.id,
          label: `${node.emojiFallback} ${node.label}`,
          active: node.id === activeCategoryId,
        }))}
        onSelect={handleSelectCategory}
        ariaLabel="فئات الكتالوج"
      />
      {activeNode && (
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Category node card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 12px', backgroundColor: theme.surface, border: `1px solid ${theme.lineStrong}`, borderRadius: '10px', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: theme.brandHeaderBackground }}>{activeNode.label}</span>
                <WebControlPanelStatusTag label="مفعلة بالكامل" tone="success" />
                <WebControlPanelStatusTag label={resolveCategoryOwnerLabel('catalog')} tone="neutral" />
              </div>
              {activeNode.subtitle && (
                <span style={{ fontSize: '11px', color: theme.textMuted, lineHeight: 1.35 }}>{activeNode.subtitle}</span>
              )}
              <span style={{ fontSize: '10px', fontWeight: 800, color: theme.textMuted }}>
                {activeNode.subcategories.length > 0 ? `${activeNode.subcategories.length} فروع` : 'فئة رئيسية'}
                {' · '}حالة المزامنة: تم التحقق ✓
              </span>
            </div>
            {/* Actions: replaced WebControlPanelActionCluster with explicit Button handlers */}
            <Box style={{ flexDirection: 'row', gap: 6, alignItems: 'center', flexShrink: 0 }}>
              <Button
                label="طلب تعديل"
                tone="secondary"
                size="sm"
                onPress={handleRequestEdit}
              />
              <Button
                label="اعتماد الفئة"
                tone="primary"
                size="sm"
                onPress={handleApproveNode}
              />
            </Box>
          </div>

          {/* Action result banner — UI_PREVIEW_ONLY */}
          {lastActionResult && (
            <div
              role="status"
              aria-live="polite"
              style={{
                padding: '10px 12px',
                backgroundColor: lastActionResult.status === 'success' ? theme.surfaceInset : theme.surfaceInset,
                border: `1px solid ${lastActionResult.status === 'success' ? theme.lineStrong : theme.lineStrong}`,
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: lastActionResult.status === 'success' ? theme.brandHeaderBackground : theme.textMuted }}>
                  {lastActionResult.status === 'success' ? '✓' : '↩'} نتيجة: {lastActionResult.label}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: theme.textMuted }}>
                المالك التالي: {resolveNextOwnerLabel(lastActionResult.nextOwner)}
              </span>
              <span style={{ fontSize: '10px', color: theme.textMuted }}>
                {lastActionResult.note}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ControlPanelDshCatalogCategoriesScreen;
