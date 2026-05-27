// UI_PREVIEW_ONLY — no backend/API/DB binding.
// Owner: control-panel/catalogs
// Purpose: Duplicate resolution workspace — pair-by-pair comparison, merge preview,
//   keep canonical, reject duplicate, send to review.
//   All mutations are local state only. Audit note required for merge/reject.

import React, { useState } from 'react';
import { Box, Button, Text, TextField, useTheme } from '@bthwani/ui-kit';
import { WebCompactSurfaceHeader } from '@bthwani/ui-kit/web';
import type { CatalogProductMaster } from './catalog';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DuplicatePair = {
  sourceId: string;
  candidateId: string;
  reason: string;
  conflictFields: string[];
};

export type CatalogDuplicateResolutionWorkspaceProps = {
  duplicatePairs: DuplicatePair[];
  products: CatalogProductMaster[];
  onClose: () => void;
};

type PairResolution =
  | { decision: 'keep-canonical' }
  | { decision: 'merge-preview'; mergePreview: Partial<CatalogProductMaster> }
  | { decision: 'rejected'; auditNote: string }
  | { decision: 'sent-to-review' };

type PairState = {
  auditNote: string;
  resolution: PairResolution | null;
  mergeVisible: boolean;
};

type AllPairStates = Record<string, PairState>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildMergePreview(
  source: CatalogProductMaster,
  candidate: CatalogProductMaster,
): Partial<CatalogProductMaster> {
  return {
    id: source.id,
    name: source.name,
    sku: source.sku,
    gtin: source.gtin || candidate.gtin,
    barcode: source.barcode || candidate.barcode,
    mediaKey: source.mediaKey || candidate.mediaKey,
    categoryPath: source.categoryPath,
    price: source.price,
    mediaPolicy: source.mediaPolicy,
    approvalStage: 'catalog-draft',
  };
}

function pairKey(pair: DuplicatePair) {
  return `${pair.sourceId}__${pair.candidateId}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: string }) {
  const { theme } = useTheme();
  return (
    <Text role="label" style={{ fontWeight: '800', color: theme.brandHeaderBackground, marginBottom: 4 }}>
      {children}
    </Text>
  );
}

function ProductCard({
  product,
  label,
}: {
  product: CatalogProductMaster | undefined;
  label: string;
}) {
  const { theme } = useTheme();
  if (!product) {
    return (
      <Box style={{ backgroundColor: theme.dangerSurface, borderRadius: 8, padding: 12, flex: 1 }}>
        <Text role="caption" style={{ color: theme.danger }}>منتج غير موجود (id not in products list)</Text>
      </Box>
    );
  }
  return (
    <Box style={{ backgroundColor: theme.surfaceInset, borderRadius: 8, padding: 12, flex: 1 }} gap={2}>
      <Text role="caption" style={{ fontWeight: '800', color: theme.brandHeaderBackground, fontSize: 11 }}>{label}</Text>
      <Text role="bodyMd" style={{ fontWeight: '700' }}>{product.name}</Text>
      <Box layoutDirection="row" gap={4} style={{ flexWrap: 'wrap' }}>
        <Text role="caption" tone="muted" style={{ fontSize: 11 }}>SKU: {product.sku}</Text>
        <Text role="caption" tone="muted" style={{ fontSize: 11 }}>GTIN: {product.gtin || '—'}</Text>
        <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
          mediaKey: {product.mediaKey || '—'}
        </Text>
        <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
          فئة: {product.categoryPath.main}
        </Text>
        <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
          سعر: {product.price} ر.س
        </Text>
      </Box>
    </Box>
  );
}

function MergePreviewCard({ merged }: { merged: Partial<CatalogProductMaster> }) {
  const { theme } = useTheme();
  return (
    <Box style={{ backgroundColor: theme.successSurface, borderRadius: 8, padding: 12 }} gap={2}>
      <Text role="caption" style={{ fontWeight: '800', color: theme.success, fontSize: 11 }}>
        معاينة الدمج (محلية فقط)
      </Text>
      <Text role="bodyMd" style={{ fontWeight: '700' }}>{merged.name}</Text>
      <Box layoutDirection="row" gap={4} style={{ flexWrap: 'wrap' }}>
        <Text role="caption" tone="muted" style={{ fontSize: 11 }}>SKU: {merged.sku}</Text>
        <Text role="caption" tone="muted" style={{ fontSize: 11 }}>GTIN: {merged.gtin || '—'}</Text>
        <Text role="caption" tone="muted" style={{ fontSize: 11 }}>mediaKey: {merged.mediaKey || '—'}</Text>
        <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
          مرحلة الاعتماد: catalog-draft (سيحتاج إعادة اعتماد)
        </Text>
      </Box>
    </Box>
  );
}

function ResolutionBanner({ resolution }: { resolution: PairResolution | null }) {
  const { theme } = useTheme();
  if (!resolution) return null;
  const label =
    resolution.decision === 'keep-canonical' ? '✓ تم الاحتفاظ بالنسخة الأصلية (محاكاة محلية)'
    : resolution.decision === 'merge-preview' ? '✓ معاينة الدمج جاهزة (محلية فقط — UI_PREVIEW_ONLY)'
    : resolution.decision === 'rejected' ? `✓ تم رفض التكرار (محاكاة محلية) · ملاحظة: ${resolution.auditNote}`
    : '✓ تم الإرسال للمراجعة (محاكاة محلية)';
  const tone = resolution.decision === 'rejected' ? theme.dangerSurface : theme.successSurface;
  const textColor = resolution.decision === 'rejected' ? theme.danger : theme.success;
  return (
    <Box style={{ backgroundColor: tone, borderRadius: 6, padding: 8, marginTop: 4 }}>
      <Text role="caption" style={{ color: textColor, fontWeight: '700', fontSize: 11 }}>{label}</Text>
    </Box>
  );
}

// ─── Main workspace ───────────────────────────────────────────────────────────

export function CatalogDuplicateResolutionWorkspace({
  duplicatePairs,
  products,
  onClose,
}: CatalogDuplicateResolutionWorkspaceProps) {
  const { theme } = useTheme();

  const initialState: AllPairStates = {};
  duplicatePairs.forEach((pair) => {
    initialState[pairKey(pair)] = { auditNote: '', resolution: null, mergeVisible: false };
  });
  const [pairStates, setPairStates] = useState<AllPairStates>(initialState);

  function updatePairState(pair: DuplicatePair, update: Partial<PairState>) {
    setPairStates((prev) => ({
      ...prev,
      [pairKey(pair)]: { ...prev[pairKey(pair)], ...update },
    }));
  }

  function handleKeepCanonical(pair: DuplicatePair) {
    updatePairState(pair, { resolution: { decision: 'keep-canonical' }, mergeVisible: false });
  }

  function handleMergePreview(
    pair: DuplicatePair,
    source: CatalogProductMaster | undefined,
    candidate: CatalogProductMaster | undefined,
  ) {
    if (!source || !candidate) {
      updatePairState(pair, {
        resolution: null,
        mergeVisible: false,
      });
      return;
    }
    const merged = buildMergePreview(source, candidate);
    updatePairState(pair, {
      resolution: { decision: 'merge-preview', mergePreview: merged },
      mergeVisible: true,
    });
  }

  function handleReject(pair: DuplicatePair, state: PairState) {
    const note = state.auditNote.trim();
    if (note.length < 10) {
      updatePairState(pair, {
        resolution: null,
      });
      // Use a transient message approach via a flag
      alert('ملاحظة التدقيق مطلوبة (10 أحرف على الأقل) — UI_PREVIEW_ONLY');
      return;
    }
    updatePairState(pair, {
      resolution: { decision: 'rejected', auditNote: note },
      mergeVisible: false,
    });
  }

  function handleSendToReview(pair: DuplicatePair) {
    updatePairState(pair, {
      resolution: { decision: 'sent-to-review' },
      mergeVisible: false,
    });
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  return (
    <Box
      gap={0}
      style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0,
        width: '100%',
        maxWidth: 680,
        backgroundColor: theme.surface,
        borderLeftWidth: 1,
        borderLeftColor: theme.line,
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      <WebCompactSurfaceHeader
        title="حل التكرارات"
        subtitle="UI_PREVIEW_ONLY · المالك: control-panel/catalogs"
        onBack={onClose}
      />

      <Box gap={4} style={{ padding: 16 }}>

        {/* Owner notice */}
        <Box style={{ backgroundColor: theme.surfaceInset, borderRadius: 6, padding: 8 }}>
          <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
            المالك: control-panel/catalogs · كل القرارات محاكاة محلية · ملاحظة التدقيق مطلوبة للرفض والدمج
          </Text>
        </Box>

        {/* Summary */}
        <Box layoutDirection="row" gap={8}>
          <Box style={{ backgroundColor: theme.surfaceInset, borderRadius: 8, padding: 10, flex: 1 }}>
            <Text role="caption" tone="muted" style={{ fontSize: 10 }}>أزواج التكرار</Text>
            <Text role="label" style={{ fontWeight: '800', color: theme.brandHeaderBackground }}>{duplicatePairs.length}</Text>
          </Box>
          <Box style={{
            backgroundColor: duplicatePairs.some((p) => pairStates[pairKey(p)]?.resolution == null) ? theme.warningSurface ?? theme.surface : theme.successSurface,
            borderRadius: 8, padding: 10, flex: 1
          }}>
            <Text role="caption" tone="muted" style={{ fontSize: 10 }}>تمت معالجته</Text>
            <Text role="label" style={{ fontWeight: '800', color: theme.success }}>
              {duplicatePairs.filter((p) => pairStates[pairKey(p)]?.resolution != null).length} / {duplicatePairs.length}
            </Text>
          </Box>
        </Box>

        {duplicatePairs.length === 0 && (
          <Box style={{ backgroundColor: theme.successSurface, borderRadius: 8, padding: 12 }}>
            <Text role="bodyMd" style={{ color: theme.success, fontWeight: '700' }}>لا توجد تكرارات مكتشفة ✓</Text>
          </Box>
        )}

        {/* Pairs */}
        {duplicatePairs.map((pair) => {
          const key = pairKey(pair);
          const state = pairStates[key] || { auditNote: '', resolution: null, mergeVisible: false };
          const source = productMap.get(pair.sourceId);
          const candidate = productMap.get(pair.candidateId);
          const isResolved = state.resolution != null;

          return (
            <Box
              key={key}
              gap={3}
              style={{
                backgroundColor: isResolved ? theme.successSurface : theme.surfaceInset,
                borderRadius: 10,
                padding: 14,
                borderWidth: 1,
                borderColor: isResolved ? theme.success : theme.line,
              }}
            >
              {/* Reason header */}
              <Box layoutDirection="row" gap={8} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Text role="label" style={{ fontWeight: '800', color: theme.danger, fontSize: 13 }}>
                  سبب التكرار: {pair.reason}
                </Text>
                {isResolved && (
                  <Text role="caption" style={{ color: theme.success, fontWeight: '700', fontSize: 11 }}>✓ تمت المعالجة</Text>
                )}
              </Box>

              {/* Conflict fields */}
              <Box layoutDirection="row" gap={4} style={{ flexWrap: 'wrap' }}>
                {pair.conflictFields.map((f) => (
                  <Box key={f} style={{ backgroundColor: theme.dangerSurface, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                    <Text role="caption" style={{ color: theme.danger, fontSize: 10, fontWeight: '700' }}>{f}</Text>
                  </Box>
                ))}
              </Box>

              {/* Side-by-side cards */}
              <Box layoutDirection="row" gap={8} style={{ flexWrap: 'wrap' }}>
                <ProductCard product={source} label="النسخة الأصلية" />
                <ProductCard product={candidate} label="المكرر المكتشف" />
              </Box>

              {/* Merge preview */}
              {state.mergeVisible && state.resolution?.decision === 'merge-preview' && (
                <MergePreviewCard merged={state.resolution.mergePreview} />
              )}

              {/* Audit note */}
              {!isResolved && (
                <Box gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
                    ملاحظة التدقيق (مطلوبة للرفض والدمج — 10 أحرف على الأقل):
                  </Text>
                  <TextField
                    label=""
                    value={state.auditNote}
                    onChangeText={(val) => updatePairState(pair, { auditNote: val })}
                    placeholder="اكتب ملاحظة التدقيق هنا..."
                  />
                </Box>
              )}

              {/* Actions */}
              {!isResolved && (
                <Box layoutDirection="row" gap={6} style={{ flexWrap: 'wrap' }}>
                  <Button
                    label="احتفظ بالأصلي"
                    tone="primary"
                    size="sm"
                    onPress={() => handleKeepCanonical(pair)}
                  />
                  <Button
                    label="معاينة الدمج"
                    tone="secondary"
                    size="sm"
                    onPress={() => handleMergePreview(pair, source, candidate)}
                  />
                  <Button
                    label="رفض التكرار"
                    tone="danger"
                    size="sm"
                    onPress={() => handleReject(pair, state)}
                    disabled={state.auditNote.trim().length < 10}
                    accessibilityHint="ملاحظة التدقيق مطلوبة (10 أحرف على الأقل)"
                  />
                  <Button
                    label="إرسال للمراجعة"
                    tone="secondary"
                    size="sm"
                    onPress={() => handleSendToReview(pair)}
                  />
                </Box>
              )}

              <ResolutionBanner resolution={state.resolution} />
            </Box>
          );
        })}

        <Text role="caption" tone="muted" style={{ fontSize: 10, marginTop: 4 }}>
          UI_PREVIEW_ONLY — جميع القرارات محاكاة محلية. لا mutation خارج الحالة المحلية.
        </Text>

        <Button label="إغلاق" tone="ghost" size="sm" onPress={onClose} style={{ marginTop: 8 }} />
      </Box>
    </Box>
  );
}
