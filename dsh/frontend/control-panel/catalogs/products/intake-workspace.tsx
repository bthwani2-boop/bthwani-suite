'use client';

import React from 'react';
import { Button, Text, useTheme } from '@bthwani/ui-kit';
import { WorkspaceProductListItem, WorkspaceIntroBanner } from '../catalogs.parts';
import type { CatalogProductMaster } from '../catalogs.data';
import type { CatalogWorkspaceId } from '../catalogs.model';

export type IntakeWorkspaceViewProps = {
  activeSubTab: string;
  filteredProducts: CatalogProductMaster[];
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  openWorkspace: (ws: CatalogWorkspaceId, productId?: string, extra?: { partnerId?: string; partnerLabel?: string }) => void;
};

function resolveStoreLabel(storeId?: string): string {
  if (!storeId) return 'شريك غير محدد';
  switch (storeId) {
    case 'store-1001': return 'البيت (السوبر ماركت)';
    case 'store-1002': return 'مخبز النور';
    case 'store-1003': return 'شاورما وجريل';
    default: return `شريك ${storeId}`;
  }
}

export function IntakeWorkspaceView({
  activeSubTab,
  filteredProducts,
  selectedProductId,
  setSelectedProductId,
  openWorkspace,
}: IntakeWorkspaceViewProps) {
  const { theme } = useTheme();

  let title = '';
  let description = '';
  let ownerSurface = '';
  let nextOwner = '';
  let impactInfo = '';

  if (activeSubTab === 'quick') {
    title = 'بوابة الإدخال السريع (Direct Intake)';
    description = 'إدخال المنتجات والبيانات يدوياً بشكل مباشر في لوحة التحكم المركزية لتحديث الكتالوج فوراً.';
    ownerSurface = 'control-panel-catalog (لوحة التحكم)';
    nextOwner = 'marketing-review (مراجعة التسويق)';
    impactInfo = 'التحديث المباشر يؤثر على ظهور المنتج للعميل في app-client بعد النشر والاعتماد.';
  } else if (activeSubTab === 'partner') {
    title = 'بوابة الشركاء والمتاجر (Partner Portal Intake)';
    description = 'استيراد ومراجعة قوائم المنتجات المقترحة والمرفوعة من قبل الشركاء عبر تطبيق app-partner.';
    ownerSurface = 'app-partner / control-panel-partners';
    nextOwner = 'partner-review (مراجعة الجودة والشركاء)';
    impactInfo = 'المنتجات المعتمدة تنعكس في مخازن الشركاء وتتحكم في مبيعاتهم المباشرة.';
  } else if (activeSubTab === 'field') {
    title = 'بوابة المسح والجمع الميداني (Field Agent Intake)';
    description = 'استلام وتدقيق بيانات المنتجات التي يتم جمعها بواسطة المناديب والفرق الميدانية عبر تطبيق app-field.';
    ownerSurface = 'app-field (تطبيق المندوب الميداني)';
    nextOwner = 'catalog-review (تدقيق الكتالوج والأسعار)';
    impactInfo = 'البيانات المدخلة من الميدان تُراجع هنا لمنع تكرار الباركود وتطابق المنتجات المحلية.';
  }

  const selectedProduct = filteredProducts.find(p => p.id === selectedProductId);
  const resolvedPartnerId = selectedProduct?.partnerId ?? 'store-1001';
  const resolvedPartnerLabel = resolveStoreLabel(selectedProduct?.partnerId);

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
      <WorkspaceIntroBanner
        bannerTitle={title}
        description={description}
        ownerSurface={ownerSurface}
        nextOwner={nextOwner}
        impactInfo={impactInfo}
        nextActionLabel="تحديث بيانات المسار"
        extraActions={
          activeSubTab === 'partner' ? (
            <Button
              label={selectedProduct ? `▸ فتح workspace استلام الشريك (${resolvedPartnerLabel})` : "▸ فتح workspace استلام الشريك"}
              tone="secondary"
              size="sm"
              onPress={() => openWorkspace('partner-handoff', undefined, { partnerId: resolvedPartnerId, partnerLabel: resolvedPartnerLabel })}
            />
          ) : activeSubTab === 'field' ? (
            <Button
              label="▸ فتح workspace معالجة التكرارات"
              tone="secondary"
              size="sm"
              onPress={() => openWorkspace('duplicate-resolution')}
            />
          ) : null
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Text role="bodyStrong" style={{ fontSize: 13, color: theme.brandHeaderBackground }}>العناصر المستلمة في هذا المسار ({filteredProducts.length})</Text>
        {filteredProducts.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', backgroundColor: theme.surfaceInset, borderRadius: '8px', border: `1px dashed ${theme.line}` }}>
            <Text role="caption" tone="muted">لا توجد منتجات معلقة في هذا المسار حالياً.</Text>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredProducts.map(p => {
              const resolvedStage = p.approvalStage;
              let statusLabel = 'معلق';
              let statusTone: 'neutral' | 'warning' | 'danger' | 'success' = 'neutral';

              if (p.conflictReason) {
                statusLabel = 'تعارض / blocked';
                statusTone = 'danger';
              } else if (resolvedStage === 'client-visible' || resolvedStage === 'catalog-adopted') {
                statusLabel = 'جاهز / ready';
                statusTone = 'success';
              } else if (resolvedStage === 'marketing-review' || resolvedStage === 'partner-review') {
                statusLabel = 'مراجعة / review';
                statusTone = 'warning';
              } else {
                statusLabel = 'مسودة معلقة / pending';
                statusTone = 'neutral';
              }

              return (
                <WorkspaceProductListItem
                  key={p.id}
                  product={p}
                  isSelected={selectedProductId === p.id}
                  onSelect={() => setSelectedProductId(p.id)}
                  detailText={p.sku}
                  statusLabel={statusLabel}
                  statusTone={statusTone}
                  rightSide={
                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: theme.brandHeaderBackground }}>{p.price} ر.س</span>
                      <span style={{ fontSize: '9px', color: theme.textMuted }}>المصدر: {p.sourceSurface || 'الكتالوج'}</span>
                    </div>
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
