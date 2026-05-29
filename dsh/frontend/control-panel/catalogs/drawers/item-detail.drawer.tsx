// UI_PREVIEW_ONLY — no backend/API/DB binding.
// Owner: control-panel/catalogs
// Purpose: Detail view for a single catalog product — identity, approval stage,
//   client visibility gate, linked surfaces summary, and action result banner.
// All CTAs are preview-only and produce result banners or are disabled with reason.

import React, { useState } from 'react';
import { Box, Button, Text, useTheme } from '@bthwani/ui-kit';
import { WebCompactSurfaceHeader } from '@bthwani/ui-kit/web';
import type { CatalogProductMaster } from '../catalogs.data';
import {
  resolveDshProductClientVisibility,
  type DshClientVisibilityBlockedCode,
} from '../../../shared/dsh-client-visibility.model';
import {
  mapApprovalStageToPartnerActivationStatus,
} from '../../../shared/dsh-client-visibility.model';
import { SectionTitle, ResultBanner, type ActionResult } from '../catalogs.parts';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CatalogItemDetailWorkspaceProps = {
  product: Pick<
    CatalogProductMaster,
    'id' | 'name' | 'sku' | 'gtin' | 'barcode' | 'mediaKey' | 'imageUri' |
    'approvalStage' | 'mediaPolicy' | 'categoryPath' | 'price' | 'sourceSurface' |
    'emojiFallback' | 'conflictReason'
  >;
  onClose: () => void;
};



// ─── Helpers ──────────────────────────────────────────────────────────────────

const mediaPolicyLabel: Record<string, string> = {
  'catalog-owned-media':           'مركزي (الكتالوج)',
  'partner-owned-exception':       'استثناء شريك',
  'partner-proposed-review':       'مقترح للمراجعة',
  'marketing-enhancement-required':'يحتاج تسويق',
};

const catalogApprovalStageLabel: Record<CatalogProductMaster['approvalStage'], string> = {
  'catalog-draft': 'مسودة الكتالوج',
  'catalog-approved': 'معتمد في الكتالوج',
  'partner-proposed': 'مقترح من الشريك',
  'partner-review': 'مراجعة الشركاء',
  'marketing-review': 'مراجعة التسويق',
  'catalog-adopted': 'مُعتمد ومُدمج',
  'client-visible': 'ظاهر للعميل',
};

const blockedCodeLabel: Record<DshClientVisibilityBlockedCode, string> = {
  'field_readiness_not_ready':   'الملف الميداني غير مكتمل',
  'documents_not_verified':      'الوثائق لم تُعتمد',
  'ops_not_approved':            'العمليات لم توافق',
  'partner_not_active':          'الشريك غير نشط',
  'catalog_not_published':       'الكتالوج لم يُنشر',
  'delivery_mode_not_available': 'وضع التوصيل غير متاح',
  'serviceability_not_available':'خارج نطاق الخدمة',
  'product_not_approved':        'المنتج لم يُعتمد بعد',
  'category_not_mapped':         'الفئة غير مربوطة',
  'duplicate_detected':          'تكرار مكتشف',
  'media_policy_not_satisfied':  'سياسة الوسائط لم تُستوفَ',
  'publishing_not_ready':        'بوابة النشر غير مكتملة',
};

const linkedSurfaces = [
  { id: 'app-partner', label: 'تطبيق الشريك', description: 'تعديلات محلية فقط: مخزون، سعر، توفر، ملاحظة تحضير.' },
  { id: 'app-client', label: 'تطبيق العميل', description: 'يظهر فقط عند stage = client-visible.' },
  { id: 'app-field', label: 'تطبيق الميداني', description: 'مصدر/أدلة فقط — لا اعتماد.' },
  { id: 'marketing', label: 'بوابة التسويق', description: 'مراجعة وسائط/محتوى — لا نشر كتالوج.' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  const { theme } = useTheme();
  return (
    <Box layoutDirection="row" gap={6} style={{ justifyContent: 'space-between', paddingVertical: 2 }}>
      <Text role="caption" tone="muted" style={{ fontSize: 12 }}>{label}</Text>
      <Text role="caption" style={{ fontWeight: '700', color: valueColor || theme.text, textAlign: 'right', flexShrink: 1 }}>{value}</Text>
    </Box>
  );
}

// ─── Main workspace ───────────────────────────────────────────────────────────

export function CatalogItemDetailWorkspace({ product, onClose }: CatalogItemDetailWorkspaceProps) {
  const { theme } = useTheme();
  const [actionResult, setActionResult] = useState<ActionResult>(null);

  // Map catalog approval stage to partner activation status for visibility resolver
  const partnerActivationStatus = mapApprovalStageToPartnerActivationStatus(
    product.approvalStage
  );
  const visibility = resolveDshProductClientVisibility({
    activationStatus: partnerActivationStatus,
    approvalStatus: product.approvalStage === 'client-visible' ? 'client_visible'
      : product.approvalStage === 'catalog-adopted' ? 'catalog_adopted'
      : product.approvalStage === 'marketing-review' ? 'marketing_review'
      : 'partner_submitted',
  });

  const isClientVisible = product.approvalStage === 'client-visible';

  function handleRequestFix() {
    setActionResult({ type: 'info', message: 'UI_PREVIEW_ONLY — طلب التعديل سُجّل محلياً. الإجراء الفعلي يتطلب ربط API.' });
  }
  function handleSendToMarketing() {
    if (product.mediaPolicy !== 'marketing-enhancement-required' && product.mediaPolicy !== 'partner-proposed-review') {
      setActionResult({ type: 'blocked', message: `محظور — سياسة الوسائط الحالية (${mediaPolicyLabel[product.mediaPolicy] || product.mediaPolicy}) لا تستلزم التحويل للتسويق.` });
      return;
    }
    setActionResult({ type: 'success', message: 'UI_PREVIEW_ONLY — تم تحويل المنتج لمراجعة التسويق (محاكاة محلية).' });
  }

  return (
    <Box
      gap={0}
      style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0,
        width: '100%',
        maxWidth: 560,
        backgroundColor: theme.surface,
        borderLeftWidth: 1,
        borderLeftColor: theme.line,
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <WebCompactSurfaceHeader
        title={product.name}
        subtitle="تفاصيل عنصر الكتالوج — UI_PREVIEW_ONLY"
        onBack={onClose}
      />

      <Box gap={4} style={{ padding: 16 }}>

        {/* Owner notice */}
        <Box style={{ backgroundColor: theme.surfaceInset, borderRadius: 6, padding: 8 }}>
          <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
            المالك: control-panel/catalogs · كل CTAs محاكاة محلية فقط
          </Text>
        </Box>

        {/* ── Section 1: Identity ────────────────────────────────────────── */}
        <Box gap={2} style={{ backgroundColor: theme.surfaceInset, borderRadius: 8, padding: 12 }}>
          <SectionTitle>الهوية</SectionTitle>
          {product.mediaKey || product.imageUri ? (
            <Box style={{
              width: 56, height: 56, borderRadius: 8,
              backgroundColor: theme.surface, borderWidth: 1,
              borderColor: theme.line, alignItems: 'center', justifyContent: 'center',
            }}>
              <Text role="bodyMd" style={{ fontSize: 28 }}>{product.emojiFallback || '📦'}</Text>
            </Box>
          ) : null}
          <InfoRow label="الاسم" value={product.name} />
          <InfoRow label="SKU" value={product.sku} />
          <InfoRow label="GTIN / Barcode" value={product.gtin || product.barcode || '—'} />
          <InfoRow label="mediaKey" value={product.mediaKey || '—'} valueColor={product.mediaKey ? theme.success : theme.danger} />
          <InfoRow label="السعر" value={`${product.price} ر.س`} />
        </Box>

        {/* ── Section 2: Category ────────────────────────────────────────── */}
        <Box gap={2} style={{ backgroundColor: theme.surfaceInset, borderRadius: 8, padding: 12 }}>
          <SectionTitle>مسار الفئة</SectionTitle>
          <InfoRow label="الفئة الرئيسية" value={product.categoryPath.main} />
          {product.categoryPath.sub && <InfoRow label="الفئة الفرعية" value={product.categoryPath.sub} />}
        </Box>

        {/* ── Section 3: Media Policy ────────────────────────────────────── */}
        <Box gap={2} style={{ backgroundColor: theme.surfaceInset, borderRadius: 8, padding: 12 }}>
          <SectionTitle>سياسة الوسائط</SectionTitle>
          <InfoRow
            label="السياسة الحالية"
            value={mediaPolicyLabel[product.mediaPolicy] || product.mediaPolicy}
            valueColor={
              product.mediaPolicy === 'catalog-owned-media' ? theme.success
              : product.mediaPolicy === 'marketing-enhancement-required' ? theme.warning
              : theme.text
            }
          />
        </Box>

        {/* ── Section 4: Approval Stage ──────────────────────────────────── */}
        <Box gap={2} style={{ backgroundColor: theme.surfaceInset, borderRadius: 8, padding: 12 }}>
          <SectionTitle>مرحلة الاعتماد</SectionTitle>
          <InfoRow
            label="المرحلة"
            value={catalogApprovalStageLabel[product.approvalStage]}
            valueColor={isClientVisible ? theme.success : theme.warning}
          />
          {product.conflictReason && (
            <InfoRow label="سبب التعارض" value={product.conflictReason} valueColor={theme.danger} />
          )}
        </Box>

        {/* ── Section 5: Client Visibility ───────────────────────────────── */}
        <Box
          gap={2}
          style={{
            backgroundColor: visibility.visible ? theme.successSurface : theme.dangerSurface,
            borderRadius: 8, padding: 12,
          }}
        >
          <SectionTitle>ظهور العميل</SectionTitle>
          <InfoRow
            label="الحالة"
            value={visibility.visible ? 'ظاهر للعميل ✓' : 'محجوب عن العميل ✗'}
            valueColor={visibility.visible ? theme.success : theme.danger}
          />
          {!visibility.visible && visibility.blockedCode && (
            <InfoRow
              label="سبب الحجب"
              value={blockedCodeLabel[visibility.blockedCode] || visibility.blockedCode}
              valueColor={theme.danger}
            />
          )}
          {!visibility.visible && visibility.blockedReason && (
            <Box style={{ backgroundColor: theme.dangerSurface, borderRadius: 6, padding: 8, marginTop: 4 }}>
              <Text role="caption" style={{ color: theme.danger, fontSize: 11 }}>{visibility.blockedReason}</Text>
            </Box>
          )}
        </Box>

        {/* ── Section 6: Audit Summary ───────────────────────────────────── */}
        <Box gap={2} style={{ backgroundColor: theme.surfaceInset, borderRadius: 8, padding: 12 }}>
          <SectionTitle>ملخص سجل التدقيق</SectionTitle>
          <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
            UI_PREVIEW_ONLY — سجل التدقيق الفعلي يُربط من audit trail API.
          </Text>
          <InfoRow label="المصدر" value={product.sourceSurface} />
          <InfoRow label="المالك الحالي" value="control-panel/catalogs" />
          <InfoRow label="المالك التالي" value={
            product.approvalStage === 'catalog-draft' ? 'الكتالوج (مراجعة)'
            : product.approvalStage === 'partner-proposed' ? 'الكتالوج (قبول)'
            : product.approvalStage === 'marketing-review' ? 'التسويق'
            : product.approvalStage === 'catalog-adopted' ? 'الكتالوج (نشر)'
            : product.approvalStage === 'client-visible' ? 'نشط'
            : 'غير محدد'
          } />
        </Box>

        {/* ── Section 7: Linked Surfaces ─────────────────────────────────── */}
        <Box gap={2} style={{ backgroundColor: theme.surfaceInset, borderRadius: 8, padding: 12 }}>
          <SectionTitle>الأسطح المرتبطة</SectionTitle>
          {linkedSurfaces.map((s) => (
            <Box key={s.id} layoutDirection="row" gap={8} style={{ alignItems: 'flex-start', paddingVertical: 3 }}>
              <Text role="caption" style={{ fontWeight: '700', color: theme.brand, minWidth: 120 }}>{s.label}</Text>
              <Text role="caption" tone="muted" style={{ fontSize: 11, flexShrink: 1 }}>{s.description}</Text>
            </Box>
          ))}
        </Box>

        {/* ── Section 8: Actions ─────────────────────────────────────────── */}
        <Box gap={2}>
          <SectionTitle>الإجراءات</SectionTitle>
          <Box layoutDirection="row" gap={8} style={{ flexWrap: 'wrap' }}>
            <Button
              label="طلب تعديل"
              tone="secondary"
              size="sm"
              onPress={handleRequestFix}
            />
            <Button
              label="إرسال للتسويق"
              tone="secondary"
              size="sm"
              onPress={handleSendToMarketing}
              disabled={product.approvalStage === 'client-visible'}
              accessibilityHint={
                product.approvalStage === 'client-visible'
                  ? 'المنتج منشور بالفعل — لا يحتاج تحويلًا للتسويق'
                  : undefined
              }
            />
          </Box>
          <Text role="caption" tone="muted" style={{ fontSize: 10, marginTop: 4 }}>
            جميع الإجراءات محاكاة محلية — UI_PREVIEW_ONLY
          </Text>
        </Box>

        <ResultBanner result={actionResult} />

        {/* Close */}
        <Button label="إغلاق" tone="ghost" size="sm" onPress={onClose} style={{ marginTop: 8 }} />
      </Box>
    </Box>
  );
}
