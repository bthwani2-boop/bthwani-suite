// SCAFFOLD — API binding pending. Actions are local simulations until backend endpoint is live.
// Owner: control-panel/catalogs
// Purpose: Client visibility policy gateway — shows why a product is visible/hidden
//   and lists all prerequisites that must be satisfied.
//   Uses resolveDshProductClientVisibility from shared model.
//   No actual publish action. All CTAs are preview-only.

import React, { useState } from 'react';
import { Box, Button, Text, TextField, useTheme,
  radius,
} from '@bthwani/ui-kit';
import { WebCompactSurfaceHeader } from '@bthwani/ui-kit/web';
import type { CatalogProductMaster } from '../catalogs.data';
import type { DshPartnerActivationStatus } from '../../../shared/dsh-partner-activation.model';
import {
  resolveDshProductClientVisibility,
  resolveDshStoreClientVisibility,
  type DshClientVisibilityBlockedCode,
} from '../../../shared/dsh-client-visibility.model';
import type { DshProductCategoryMappingStatus, DshProductDuplicateStatus } from '../../../shared/dsh-product-identity.model';
import { SectionTitle, ResultBanner, type ActionResult } from '../catalogs.parts';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CatalogVisibilityPolicyWorkspaceProps = {
  product: CatalogProductMaster;
  partnerActivationStatus: DshPartnerActivationStatus;
  onClose: () => void;
};

const blockedCodeLabel: Record<DshClientVisibilityBlockedCode, string> = {
  'field_readiness_not_ready':   'الملف الميداني غير مكتمل',
  'documents_not_verified':      'الوثائق لم تُعتمد',
  'ops_not_approved':            'العمليات لم توافق',
  'partner_not_active':          'الشريك غير نشط',
  'catalog_not_published':       'الكتالوج لم يُنشر',
  'delivery_mode_not_available': 'وضع التوصيل غير متاح',
  'serviceability_not_available':'خارج نطاق الخدمة',
  'product_not_approved':        'المنتج لم يُعتمد',
  'category_not_mapped':         'الفئة غير مربوطة',
  'duplicate_detected':          'تكرار مكتشف',
  'media_policy_not_satisfied':  'سياسة الوسائط لم تُستوفَ',
  'publishing_not_ready':        'بوابة النشر غير مكتملة',
};

const prerequisiteIdLabel: Record<string, string> = {
  'partner_activation':    'تفعيل الشريك',
  'product_approval':      'اعتماد المنتج',
  'category_mapping':      'ربط الفئة',
  'duplicate_clean':       'لا تكرارات',
  'media_policy':          'سياسة الوسائط',
  'delivery_modes':        'أوضاع التوصيل',
  'serviceability':        'نطاق الخدمة',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChecklistRow({
  label,
  satisfied,
  blockedReason,
}: {
  label: string;
  satisfied: boolean;
  blockedReason?: string;
}) {
  const { theme } = useTheme();
  return (
    <Box gap={1} style={{ paddingVertical: 4 }}>
      <Box layoutDirection="row" gap={8} style={{ alignItems: 'center' }}>
        <Text role="caption" style={{ fontSize: 14, color: satisfied ? theme.success : theme.danger }}>
          {satisfied ? '✓' : '✗'}
        </Text>
        <Text role="caption" weight="bold" style={{ color: satisfied ? theme.text : theme.danger, flexShrink: 1 }}>
          {label}
        </Text>
      </Box>
      {!satisfied && blockedReason && (
        <Box style={{ backgroundColor: theme.dangerSurface, borderRadius: 4, padding: 6, marginRight: 22 }}>
          <Text role="caption" style={{ color: theme.danger, fontSize: 11 }}>{blockedReason}</Text>
        </Box>
      )}
    </Box>
  );
}

// ─── Main workspace ───────────────────────────────────────────────────────────

export function CatalogVisibilityPolicyWorkspace({
  product,
  partnerActivationStatus,
  onClose,
}: CatalogVisibilityPolicyWorkspaceProps) {
  const { theme } = useTheme();
  const [actionResult, setActionResult] = useState<ActionResult>(null);
  const [fixNote, setFixNote] = useState('');
  const [showFixForm, setShowFixForm] = useState(false);
  const [localStage, setLocalStage] = useState(product.approvalStage);

  // Map catalog approval stage to product identity approval status
  const approvalStatus =
    localStage === 'client-visible' ? 'client_visible'
    : localStage === 'catalog-adopted' ? 'catalog_adopted'
    : localStage === 'marketing-review' ? 'marketing_review'
    : localStage === 'partner-review' ? 'partner_review'
    : 'partner_submitted';

  // Infer category/duplicate/media states from product fields
  const categoryMappingStatus: DshProductCategoryMappingStatus =
    product.categoryPath.main ? 'mapped' : 'unmapped';
  const duplicateStatus: DshProductDuplicateStatus =
    product.conflictReason ? 'possible_duplicate' : 'clean';
  const mediaPolicySatisfied =
    product.mediaPolicy === 'catalog-owned-media' || product.mediaPolicy === 'partner-owned-exception';

  const storeVisibility = resolveDshStoreClientVisibility({
    activationStatus: partnerActivationStatus,
  });

  const productVisibility = resolveDshProductClientVisibility({
    activationStatus: partnerActivationStatus,
    approvalStatus,
    categoryMappingStatus,
    duplicateStatus,
    mediaPolicySatisfied,
  });

  function handleRequestFix() {
    setShowFixForm(true);
    setActionResult(null);
  }

  function handleSubmitFix() {
    if (fixNote.trim().length < 5) {
      setActionResult({ type: 'blocked', message: 'ملاحظة التعديل قصيرة جداً (5 أحرف على الأقل).' });
      return;
    }
    setShowFixForm(false);
    setActionResult({ type: 'info', message: `طلب التعديل مُسجّل محلياً: "${fixNote.trim()}"` });
    setFixNote('');
  }

  function handleMarkReady() {
    if (productVisibility.visible) {
      setActionResult({ type: 'info', message: 'المنتج بالفعل ظاهر للعميل — لا إجراء مطلوب.' });
      return;
    }
    const hasBlocker = productVisibility.publishingPrerequisites.some((p) => !p.satisfied);
    if (hasBlocker) {
      const first = productVisibility.publishingPrerequisites.find((p) => !p.satisfied);
      setActionResult({
        type: 'blocked',
        message: `محظور — ${first?.blockedReason || 'يوجد متطلب غير مستوفٍ قبل تمييز المنتج كجاهز.'}`,
      });
      return;
    }
    // Local state transition preview
    setLocalStage('catalog-adopted');
    setActionResult({ type: 'success', message: 'تم تمييز المنتج كـ "جاهز للنشر" محلياً (catalog-adopted). الإجراء الفعلي يتطلب ربط API.' });
  }

  return (
    <Box
      gap={0}
      style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0,
        width: '100%',
        maxWidth: 600,
        backgroundColor: theme.surface,
        borderLeftWidth: 1,
        borderLeftColor: theme.line,
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      <WebCompactSurfaceHeader
        title="سياسة ظهور العميل"
        subtitle={`${product.name} — ربط API قيد التنفيذ`}
        onBack={onClose}
      />

      <Box gap={4} style={{ padding: 16 }}>

        {/* Owner notice */}
        <Box style={{ backgroundColor: theme.surfaceInset, borderRadius: radius.xs, padding: 8 }}>
          <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
            المالك: control-panel/catalogs · لا نشر فعلي · جميع الإجراءات محاكاة محلية
          </Text>
        </Box>

        {/* ── Store visibility ─────────────────────────────────────────────── */}
        <Box
          gap={3}
          style={{
            backgroundColor: storeVisibility.visible ? theme.successSurface : theme.dangerSurface,
            borderRadius: 8, padding: 12,
          }}
        >
          <SectionTitle>ظهور المتجر</SectionTitle>
          <Box layoutDirection="row" gap={8} style={{ alignItems: 'center' }}>
            <Text role="titleSm" style={{}}>
              {storeVisibility.visible ? '✅' : '❌'}
            </Text>
            <Text role="bodyMd" weight="bold" style={{
              color:storeVisibility.visible ? theme.success : theme.danger,
            }}>
              {storeVisibility.visible ? 'المتجر ظاهر للعميل' : 'المتجر محجوب عن العميل'}
            </Text>
          </Box>
          {storeVisibility.blockedCode && (
            <Text role="caption" style={{ color: theme.danger,}}>
              {blockedCodeLabel[storeVisibility.blockedCode]}
            </Text>
          )}
          {storeVisibility.blockedReason && (
            <Text role="caption" style={{ color: theme.danger, fontSize: 11 }}>
              {storeVisibility.blockedReason}
            </Text>
          )}
        </Box>

        {/* ── Product visibility ───────────────────────────────────────────── */}
        <Box
          gap={3}
          style={{
            backgroundColor: productVisibility.visible ? theme.successSurface : theme.dangerSurface,
            borderRadius: 8, padding: 12,
          }}
        >
          <SectionTitle>ظهور المنتج</SectionTitle>
          <Box layoutDirection="row" gap={8} style={{ alignItems: 'center' }}>
            <Text role="titleSm" style={{}}>
              {productVisibility.visible ? '✅' : '❌'}
            </Text>
            <Text role="bodyMd" weight="bold" style={{
              color:productVisibility.visible ? theme.success : theme.danger,
            }}>
              {productVisibility.visible ? 'المنتج ظاهر للعميل' : 'المنتج محجوب عن العميل'}
            </Text>
          </Box>
          {productVisibility.blockedCode && (
            <Text role="caption" style={{ color: theme.danger,}}>
              كود الحجب: {blockedCodeLabel[productVisibility.blockedCode]}
            </Text>
          )}
          {productVisibility.blockedReason && !productVisibility.storeVisibility.blockedReason && (
            <Text role="caption" style={{ color: theme.danger, fontSize: 11 }}>
              {productVisibility.blockedReason}
            </Text>
          )}
          <Box layoutDirection="row" gap={6} style={{ flexWrap: 'wrap', marginTop: 4 }}>
            <Box style={{ backgroundColor: theme.surface, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text role="caption" style={{ fontSize: 11 }}>
                حالة الاعتماد: {productVisibility.approvalStatus}
              </Text>
            </Box>
            <Box style={{ backgroundColor: theme.surface, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text role="caption" style={{ fontSize: 11 }}>
                حالة النشر: {productVisibility.publishingStatus}
              </Text>
            </Box>
            <Box style={{ backgroundColor: theme.surface, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text role="caption" style={{ fontSize: 11 }}>
                ظهور العميل: {productVisibility.clientVisibilityStatus}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* ── Prerequisites checklist ──────────────────────────────────────── */}
        <Box gap={2} style={{ backgroundColor: theme.surfaceInset, borderRadius: 8, padding: 12 }}>
          <SectionTitle>متطلبات النشر</SectionTitle>
          {productVisibility.publishingPrerequisites.map((prereq) => (
            <ChecklistRow
              key={prereq.id}
              label={prerequisiteIdLabel[prereq.id] || prereq.label}
              satisfied={prereq.satisfied}
              blockedReason={prereq.blockedReason}
            />
          ))}
          {/* Store readiness items */}
          {storeVisibility.checklist.map((item) => (
            <ChecklistRow
              key={item.id}
              label={item.label}
              satisfied={item.satisfied}
              blockedReason={item.blockedReason}
            />
          ))}
          <Box style={{ marginTop: 8, backgroundColor: theme.surface, borderRadius: radius.xs, padding: 8 }}>
            <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
              المرحلة المطلوبة للنشر الفعلي: <Text role="caption" weight="black" style={{ color: theme.success }}>client-visible</Text>
            </Text>
          </Box>
        </Box>

        {/* ── Actions ──────────────────────────────────────────────────────── */}
        <Box gap={2}>
          <SectionTitle>الإجراءات (محاكاة محلية)</SectionTitle>

          <Box layoutDirection="row" gap={8} style={{ flexWrap: 'wrap' }}>
            <Button
              label="طلب تعديل"
              tone="secondary"
              size="sm"
              onPress={handleRequestFix}
            />
            <Button
              label="تمييز كجاهز (معاينة)"
              tone="primary"
              size="sm"
              onPress={handleMarkReady}
              disabled={productVisibility.visible}
              accessibilityHint={productVisibility.visible ? 'المنتج منشور بالفعل' : 'يتطلب استيفاء جميع المتطلبات'}
            />
          </Box>

          <Box style={{ backgroundColor: theme.dangerSurface, borderRadius: radius.xs, padding: 8 }}>
            <Text role="caption" weight="bold" style={{ color: theme.danger, fontSize: 11 }}>
              ممنوع: لا يوجد زر نشر فعلي — النشر يتطلب ربط API واستيفاء جميع المتطلبات أعلاه.
            </Text>
          </Box>

          {/* Fix note form */}
          {showFixForm && (
            <Box gap={2} style={{ backgroundColor: theme.surfaceInset, borderRadius: 8, padding: 12 }}>
              <Text role="caption" tone="muted" style={{ fontSize: 11 }}>ملاحظة طلب التعديل:</Text>
              <TextField
                label=""
                value={fixNote}
                onChangeText={setFixNote}
                placeholder="اكتب ملاحظة التعديل..."
              />
              <Box layoutDirection="row" gap={6}>
                <Button label="إرسال" tone="primary" size="sm" onPress={handleSubmitFix} disabled={fixNote.trim().length < 5} />
                <Button label="إلغاء" tone="ghost" size="sm" onPress={() => { setShowFixForm(false); setFixNote(''); }} />
              </Box>
            </Box>
          )}
        </Box>

        <ResultBanner result={actionResult} />

        <Button label="إغلاق" tone="ghost" size="sm" onPress={onClose} style={{ marginTop: 8 }} />
      </Box>
    </Box>
  );
}
