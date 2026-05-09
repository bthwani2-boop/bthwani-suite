'use client';

import React from 'react';
import {
  WebCompactSurfaceHeader,
  WebControlPanelWorkspaceTabs,
  WebControlPanelStatusTag,
  WebControlPanelActionCluster,
} from '@bthwani/ui-kit/web';
import { dshCatalogCategories } from './catalog';

function resolveCategoryOwnerLabel(owner: string) {
  if (owner === 'partner') return 'الشركاء';
  if (owner === 'marketing') return 'التسويق';
  return 'الكتالوج';
}

export function ControlPanelDshCatalogCategoriesScreen() {
  const categoryNodes = dshCatalogCategories;
  const [activeCategoryId, setActiveCategoryId] = React.useState<string | null>(categoryNodes[0]?.id ?? null);
  const activeNode = categoryNodes.find((node) => node.id === activeCategoryId);

  return (
    <div dir="rtl" style={{ display: 'flex', flexDirection: 'column' }}>
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
        onSelect={(id) => setActiveCategoryId(id)}
        ariaLabel="فئات الكتالوج"
      />
      {activeNode && (
        <div style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 12px', backgroundColor: '#FFFFFF', border: '1px solid rgba(10,47,92,0.08)', borderRadius: '10px', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0A2F5C' }}>{activeNode.label}</span>
                <WebControlPanelStatusTag label="مفعلة بالكامل" tone="success" />
                <WebControlPanelStatusTag label={resolveCategoryOwnerLabel('catalog')} tone="neutral" />
              </div>
              {activeNode.subtitle && (
                <span style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.35 }}>{activeNode.subtitle}</span>
              )}
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748B' }}>
                {activeNode.subcategories.length > 0 ? `${activeNode.subcategories.length} فروع` : 'فئة رئيسية'}
                {' · '}حالة المزامنة: تم التحقق ✓
              </span>
            </div>
            <WebControlPanelActionCluster
              primary={{ id: 'approve-node', label: 'اعتماد العقدة' }}
              secondary={{ id: 'request-edit', label: 'طلب تعديل' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ControlPanelDshCatalogCategoriesScreen;
