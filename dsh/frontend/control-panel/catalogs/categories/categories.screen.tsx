'use client';

import React from 'react';
import { Box, Button, useTheme } from '@bthwani/ui-kit';
import {
  WebCompactSurfaceHeader,
  WebControlPanelWorkspaceTabs,
  WebControlPanelStatusTag,
} from '@bthwani/ui-kit/web';
import { dshCatalogCategories } from '../catalog';

// UI_PREVIEW_ONLY: category governance actions â€” no backend/API binding.
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
  if (owner === 'partner') return 'Ø§Ù„Ø´Ø±ÙƒØ§Ø¡';
  if (owner === 'marketing') return 'Ø§Ù„ØªØ³ÙˆÙŠÙ‚';
  return 'Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬';
}

function resolveNextOwnerLabel(owner: 'control-panel-catalog' | 'control-panel-marketing') {
  if (owner === 'control-panel-marketing') return 'Ø§Ù„ØªØ³ÙˆÙŠÙ‚';
  return 'Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬';
}

export function CategoriesScreen() {
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
      label: 'Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„ÙØ¦Ø©',
      status: 'success',
      nextOwner: 'control-panel-catalog',
      note: 'UI_PREVIEW_ONLY â€” Ù„Ù… ÙŠÙØ­ÙØ¸ ÙÙŠ runtime/API',
    });
  }, [activeNode]);

  const handleRequestEdit = React.useCallback(() => {
    if (!activeNode) return;
    setLastActionResult({
      categoryId: activeNode.id,
      action: 'request-edit',
      label: 'Ø·Ù„Ø¨ ØªØ¹Ø¯ÙŠÙ„',
      status: 'blocked',
      nextOwner: 'control-panel-marketing',
      note: 'UI_PREVIEW_ONLY â€” ÙŠÙØ±Ø³Ù„ Ù„Ù„ØªØ³ÙˆÙŠÙ‚ Ø¹Ù†Ø¯ ØªÙØ¹ÙŠÙ„ API',
    });
  }, [activeNode]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <WebCompactSurfaceHeader
        title="Ø­ÙˆÙƒÙ…Ø© Ø§Ù„ÙØ¦Ø§Øª"
        description="Ù…Ø±Ø§Ø¬Ø¹Ø© Ø¹Ù‚Ø¯Ø© Ø§Ù„ÙØ¦Ø© ÙˆØ§Ù„Ù…ÙˆØ§ÙÙ‚Ø© Ø¹Ù„Ù‰ Ø§Ù„ØªØ¹Ø¯ÙŠÙ„Ø§Øª"
        metrics={[
          { id: 'total', title: 'Ø§Ù„ÙØ¦Ø§Øª', value: String(categoryNodes.length) },
          { id: 'verified', title: 'ØªÙ… Ø§Ù„ØªØ­Ù‚Ù‚', value: String(categoryNodes.length) },
        ]}
      />
      <WebControlPanelWorkspaceTabs
        items={categoryNodes.map((node) => ({
          id: node.id,
          label: `${node.emojiFallback} ${node.label}`,
          active: node.id === activeCategoryId,
        }))}
        onSelect={handleSelectCategory}
        ariaLabel="ÙØ¦Ø§Øª Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬"
      />
      {activeNode && (
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Category node card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 12px', backgroundColor: theme.surface, border: `1px solid ${theme.lineStrong}`, borderRadius: '10px', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: theme.brandHeaderBackground }}>{activeNode.label}</span>
                <WebControlPanelStatusTag label="Ù…ÙØ¹Ù„Ø© Ø¨Ø§Ù„ÙƒØ§Ù…Ù„" tone="success" />
                <WebControlPanelStatusTag label={resolveCategoryOwnerLabel('catalog')} tone="neutral" />
              </div>
              {activeNode.subtitle && (
                <span style={{ fontSize: '11px', color: theme.textMuted, lineHeight: 1.35 }}>{activeNode.subtitle}</span>
              )}
              <span style={{ fontSize: '10px', fontWeight: 800, color: theme.textMuted }}>
                {activeNode.subcategories.length > 0 ? `${activeNode.subcategories.length} ÙØ±ÙˆØ¹` : 'ÙØ¦Ø© Ø±Ø¦ÙŠØ³ÙŠØ©'}
                {' Â· '}Ø­Ø§Ù„Ø© Ø§Ù„Ù…Ø²Ø§Ù…Ù†Ø©: ØªÙ… Ø§Ù„ØªØ­Ù‚Ù‚ âœ“
              </span>
            </div>
            {/* Actions: replaced WebControlPanelActionCluster with explicit Button handlers */}
            <Box style={{ flexDirection: 'row', gap: 6, alignItems: 'center', flexShrink: 0 }}>
              <Button
                label="Ø·Ù„Ø¨ ØªØ¹Ø¯ÙŠÙ„"
                tone="secondary"
                size="sm"
                onPress={handleRequestEdit}
              />
              <Button
                label="Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„ÙØ¦Ø©"
                tone="primary"
                size="sm"
                onPress={handleApproveNode}
              />
            </Box>
          </div>

          {/* Action result banner â€” UI_PREVIEW_ONLY */}
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
                  {lastActionResult.status === 'success' ? 'âœ“' : 'â†©'} Ù†ØªÙŠØ¬Ø©: {lastActionResult.label}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: theme.textMuted }}>
                Ø§Ù„Ù…Ø§Ù„Ùƒ Ø§Ù„ØªØ§Ù„ÙŠ: {resolveNextOwnerLabel(lastActionResult.nextOwner)}
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

export default CategoriesScreen;
