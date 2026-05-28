// UI_PREVIEW_ONLY — no backend/API/DB binding.
// Owner: control-panel/catalogs
// Purpose: SKU / GTIN / Barcode governance workspace.
//   Consolidates mapping/gtin and approvals/barcode subtabs into one operational workspace.
//   All actions produce result banners or are disabled with reason. No barcode generation. No backend.

import React, { useState } from 'react';
import { Box, Button, Text, useTheme } from '@bthwani/ui-kit';
import { WebCompactSurfaceHeader } from '@bthwani/ui-kit/web';
import type { CatalogProductMaster } from './catalogs.data';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CatalogIdentityGovernanceWorkspaceProps = {
  items: Pick<CatalogProductMaster, 'id' | 'name' | 'sku' | 'gtin' | 'barcode'>[];
  onClose: () => void;
};

type IdentityState = 'missing' | 'generated' | 'reserved' | 'manual' | 'conflict';

type ItemActionResult = { type: 'success' | 'blocked' | 'info'; message: string };

type ItemActionResults = Record<string, ItemActionResult | undefined>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveIdentityState(
  item: Pick<CatalogProductMaster, 'id' | 'gtin' | 'barcode'>,
): IdentityState {
  if (!item.gtin && !item.barcode) return 'missing';
  if (item.gtin && item.barcode && item.gtin !== item.barcode) return 'conflict';
  const val = item.gtin || item.barcode || '';
  if (val.startsWith('GEN-')) return 'generated';
  if (val.startsWith('RSV-')) return 'reserved';
  return 'manual';
}

const identityStateLabel: Record<IdentityState, string> = {
  missing:   'مفقود',
  generated: 'مولّد',
  reserved:  'محجوز',
  manual:    'يدوي',
  conflict:  'تعارض',
};

const identityStateTone: Record<IdentityState, string> = {
  missing:   'danger',
  generated: 'success',
  reserved:  'warning',
  manual:    'success',
  conflict:  'danger',
};

function nextStepLabel(state: IdentityState): string {
  switch (state) {
    case 'missing':   return 'إضافة GTIN';
    case 'conflict':  return 'حل التعارض';
    case 'generated': return 'اعتماد';
    case 'reserved':  return 'تحويل لتسويق';
    case 'manual':    return 'اعتماد';
  }
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

function ResultBanner({ result }: { result: ItemActionResult | undefined }) {
  const { theme } = useTheme();
  if (!result) return null;
  const bg = result.type === 'success' ? theme.successSurface
    : result.type === 'blocked' ? theme.dangerSurface
    : theme.surface;
  const color = result.type === 'success' ? theme.success
    : result.type === 'blocked' ? theme.danger
    : theme.text;
  return (
    <Box style={{ backgroundColor: bg, borderRadius: 6, padding: 8, marginTop: 4 }}>
      <Text role="caption" style={{ color, fontWeight: '700', fontSize: 11 }}>{result.message}</Text>
    </Box>
  );
}

// ─── Main workspace ───────────────────────────────────────────────────────────

export function CatalogIdentityGovernanceWorkspace({
  items,
  onClose,
}: CatalogIdentityGovernanceWorkspaceProps) {
  const { theme } = useTheme();
  const [actionResults, setActionResults] = useState<ItemActionResults>({});

  function setResult(id: string, result: ItemActionResult) {
    setActionResults((prev) => ({ ...prev, [id]: result }));
  }

  function handleApprove(item: Pick<CatalogProductMaster, 'id' | 'name' | 'gtin' | 'barcode'>, state: IdentityState) {
    if (state === 'missing') {
      setResult(item.id, { type: 'blocked', message: `محظور — GTIN مفقود للمنتج "${item.name}". أضف GTIN أولًا قبل الاعتماد.` });
      return;
    }
    if (state === 'conflict') {
      setResult(item.id, { type: 'blocked', message: `محظور — يوجد تعارض بين GTIN (${item.gtin}) والباركود (${item.barcode}). حل التعارض أولًا.` });
      return;
    }
    setResult(item.id, { type: 'success', message: `UI_PREVIEW_ONLY — تم اعتماد هوية "${item.name}" محلياً. الإجراء الفعلي يتطلب ربط API.` });
  }

  function handleNeedsFix(item: Pick<CatalogProductMaster, 'id' | 'name'>) {
    setResult(item.id, { type: 'info', message: `UI_PREVIEW_ONLY — تم تحديد "${item.name}" كـ needs-fix محلياً.` });
  }

  function handleSendToMarketing(item: Pick<CatalogProductMaster, 'id' | 'name'>, state: IdentityState) {
    if (state !== 'reserved' && state !== 'conflict') {
      setResult(item.id, { type: 'blocked', message: `محظور — "${item.name}" لا يحتاج مراجعة تسويق في حالته الحالية.` });
      return;
    }
    setResult(item.id, { type: 'success', message: `UI_PREVIEW_ONLY — تم إرسال "${item.name}" لمراجعة التسويق محلياً.` });
  }

  const missingCount = items.filter((i) => !i.gtin && !i.barcode).length;
  const conflictCount = items.filter((i) => i.gtin && i.barcode && i.gtin !== i.barcode).length;

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
        title="حوكمة الهوية — SKU / GTIN / Barcode"
        subtitle="UI_PREVIEW_ONLY · المالك: control-panel/catalogs"
        onBack={onClose}
      />

      <Box gap={4} style={{ padding: 16 }}>

        {/* Summary metrics */}
        <Box layoutDirection="row" gap={8} style={{ flexWrap: 'wrap' }}>
          <Box style={{ backgroundColor: theme.surfaceInset, borderRadius: 8, padding: 10, flex: 1, minWidth: 100 }}>
            <Text role="caption" tone="muted" style={{ fontSize: 10 }}>إجمالي العناصر</Text>
            <Text role="label" style={{ fontWeight: '800', color: theme.brandHeaderBackground }}>{items.length}</Text>
          </Box>
          <Box style={{ backgroundColor: missingCount > 0 ? theme.dangerSurface : theme.successSurface, borderRadius: 8, padding: 10, flex: 1, minWidth: 100 }}>
            <Text role="caption" tone="muted" style={{ fontSize: 10 }}>GTIN مفقود</Text>
            <Text role="label" style={{ fontWeight: '800', color: missingCount > 0 ? theme.danger : theme.success }}>{missingCount}</Text>
          </Box>
          <Box style={{ backgroundColor: conflictCount > 0 ? theme.dangerSurface : theme.successSurface, borderRadius: 8, padding: 10, flex: 1, minWidth: 100 }}>
            <Text role="caption" tone="muted" style={{ fontSize: 10 }}>تعارضات</Text>
            <Text role="label" style={{ fontWeight: '800', color: conflictCount > 0 ? theme.danger : theme.success }}>{conflictCount}</Text>
          </Box>
        </Box>

        {/* Owner notice */}
        <Box style={{ backgroundColor: theme.surfaceInset, borderRadius: 6, padding: 8 }}>
          <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
            المالك: control-panel/catalogs · لا توليد باركود فعلي · لا backend
          </Text>
        </Box>

        {/* Items table */}
        <SectionTitle>عناصر الهوية</SectionTitle>
        {items.length === 0 && (
          <Text role="caption" tone="muted">لا توجد عناصر.</Text>
        )}

        {items.map((item) => {
          const state = deriveIdentityState(item);
          const toneColor = identityStateTone[state] === 'danger' ? theme.danger
            : identityStateTone[state] === 'warning' ? theme.warning
            : theme.success;
          const result = actionResults[item.id];

          return (
            <Box
              key={item.id}
              gap={2}
              style={{
                backgroundColor: theme.surfaceInset,
                borderRadius: 8, padding: 12,
                borderLeftWidth: 3,
                borderLeftColor: toneColor,
              }}
            >
              {/* Row header */}
              <Box layoutDirection="row" gap={8} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Text role="label" style={{ fontWeight: '700', color: theme.text, flexShrink: 1 }}>{item.name}</Text>
                <Box style={{ backgroundColor: toneColor + '22', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                  <Text role="caption" style={{ fontSize: 10, fontWeight: '800', color: toneColor }}>
                    {identityStateLabel[state]}
                  </Text>
                </Box>
              </Box>

              {/* Identity fields */}
              <Box layoutDirection="row" gap={12} style={{ flexWrap: 'wrap' }}>
                <Box gap={0}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10 }}>SKU</Text>
                  <Text role="caption" style={{ fontWeight: '600', fontSize: 12 }}>{item.sku}</Text>
                </Box>
                <Box gap={0}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10 }}>GTIN</Text>
                  <Text role="caption" style={{ fontWeight: '600', fontSize: 12, color: item.gtin ? theme.text : theme.danger }}>
                    {item.gtin || '—'}
                  </Text>
                </Box>
                <Box gap={0}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10 }}>Barcode</Text>
                  <Text role="caption" style={{ fontWeight: '600', fontSize: 12, color: item.barcode ? theme.text : theme.danger }}>
                    {item.barcode || '—'}
                  </Text>
                </Box>
              </Box>

              {/* Conflict reason */}
              {state === 'conflict' && (
                <Box style={{ backgroundColor: theme.dangerSurface, borderRadius: 4, padding: 6 }}>
                  <Text role="caption" style={{ color: theme.danger, fontSize: 11 }}>
                    تعارض: GTIN ({item.gtin}) ≠ Barcode ({item.barcode})
                  </Text>
                </Box>
              )}

              {/* Next step */}
              <Box layoutDirection="row" gap={6} style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <Text role="caption" tone="muted" style={{ fontSize: 11 }}>الخطوة التالية: {nextStepLabel(state)}</Text>
              </Box>

              {/* Actions */}
              <Box layoutDirection="row" gap={6} style={{ flexWrap: 'wrap' }}>
                <Button
                  label="اعتماد"
                  tone="primary"
                  size="sm"
                  onPress={() => handleApprove(item, state)}
                  disabled={state === 'missing' || state === 'conflict'}
                  accessibilityHint={
                    state === 'missing' ? 'أضف GTIN أولًا'
                    : state === 'conflict' ? 'حل التعارض أولًا'
                    : undefined
                  }
                />
                <Button
                  label="يحتاج تعديل"
                  tone="secondary"
                  size="sm"
                  onPress={() => handleNeedsFix(item)}
                />
                <Button
                  label="إرسال للتسويق"
                  tone="secondary"
                  size="sm"
                  onPress={() => handleSendToMarketing(item, state)}
                  disabled={state !== 'reserved' && state !== 'conflict'}
                  accessibilityHint="متاح فقط للحالات المحجوزة أو المتعارضة"
                />
              </Box>

              <ResultBanner result={result} />
            </Box>
          );
        })}

        <Button label="إغلاق" tone="ghost" size="sm" onPress={onClose} style={{ marginTop: 8 }} />
      </Box>
    </Box>
  );
}
