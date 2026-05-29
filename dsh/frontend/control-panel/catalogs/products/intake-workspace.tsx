'use client';

import React from 'react';
import { Button, Text, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelStatusTag } from '@bthwani/ui-kit/web';
import { WatermarkedImage } from '../catalogs.parts';
import type { CatalogProductMaster } from '../catalogs.data';
import type { CatalogWorkspaceId } from '../catalogs.model';

export type IntakeWorkspaceViewProps = {
  activeSubTab: string;
  filteredProducts: CatalogProductMaster[];
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  openWorkspace: (ws: CatalogWorkspaceId, productId?: string) => void;
};

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

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
      <div style={{
        background: `linear-gradient(135deg, ${theme.surfaceInset} 0%, ${theme.surface} 100%)`,
        border: `1px solid ${theme.lineStrong}`,
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <Text role="bodyStrong" style={{ fontSize: 16, color: theme.brandHeaderBackground, fontWeight: '800' }}>{title}</Text>
            <Text role="caption" tone="muted" style={{ fontSize: 11, marginTop: 4 }}>{description}</Text>
          </div>
          <span style={{ fontSize: '9px', color: theme.warning, fontWeight: '700', backgroundColor: theme.brandSurface, padding: '2px 8px', borderRadius: '4px' }}>
            معاينة محلية فقط
          </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', borderTop: `1px solid ${theme.line}`, paddingTop: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', color: theme.textMuted }}>الجهة المالكة / المصدر:</span>
            <span style={{ fontSize: '11px', color: theme.brand, fontWeight: '700' }}>{ownerSurface}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', color: theme.textMuted }}>المراجع التالي للمسار:</span>
            <span style={{ fontSize: '11px', color: theme.brand, fontWeight: '700' }}>{nextOwner}</span>
          </div>
        </div>

        <div style={{ backgroundColor: theme.surfaceInset, padding: '8px 12px', borderRadius: '6px', borderRight: `3px solid ${theme.brand}` }}>
          <Text role="caption" style={{ fontSize: 10, color: theme.brandHeaderBackground }}>
            ℹ️ <strong>أثر السطح:</strong> {impactInfo}
          </Text>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <Button
            label="تحديث بيانات المسار"
            tone="brand"
            size="sm"
            disabled
            accessibilityLabel="تحديث المسار (معاينة محلية فقط)"
            onPress={() => {}}
          />
          <span style={{ fontSize: '10px', color: theme.textMuted, alignSelf: 'center' }}>
            (الإجراء معطل: معاينة محلية فقط)
          </span>
          {activeSubTab === 'partner' && (
            <Button
              label="▸ فتح workspace استلام الشريك"
              tone="secondary"
              size="sm"
              onPress={() => openWorkspace('partner-handoff')}
            />
          )}
        </div>
      </div>

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

              const isSelected = selectedProductId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProductId(p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${isSelected ? theme.brand : theme.line}`,
                    backgroundColor: isSelected ? theme.brandSurface : theme.surface,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <WatermarkedImage src={p.imageUri} mediaKey={p.mediaKey} fallback={p.emojiFallback} size={36} productName={p.name} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Text role="bodyStrong" style={{ fontSize: 12, color: theme.brandHeaderBackground }}>{p.name}</Text>
                      <span style={{ fontFamily: 'monospace', fontSize: '10px', color: theme.textMuted, direction: 'ltr' }}>{p.sku}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: theme.brandHeaderBackground }}>{p.price} ر.س</span>
                      <span style={{ fontSize: '9px', color: theme.textMuted }}>المصدر: {p.sourceSurface || 'الكتالوج'}</span>
                    </div>
                    <WebControlPanelStatusTag
                      label={statusLabel}
                      tone={statusTone === 'neutral' ? 'info' : statusTone}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
