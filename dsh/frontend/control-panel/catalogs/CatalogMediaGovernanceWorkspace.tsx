// UI_PREVIEW_ONLY — no backend/API/DB binding.
// Owner: control-panel/catalogs
// Purpose: Media ownership governance workspace — separates catalog-owned media from
//   partner-exception and marketing-review items.
//   No file transfer. No image upload. No payload copy.
//   All actions produce result banners or are disabled with reason.

import React, { useState } from 'react';
import { Box, Button, Text, useTheme } from '@bthwani/ui-kit';
import { WebCompactSurfaceHeader } from '@bthwani/ui-kit/web';
import type { CatalogProductMaster, CatalogMediaPolicy } from './catalog';
import { catalogMediaPolicyOptions } from './catalogs.model';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CatalogMediaGovernanceWorkspaceProps = {
  items: Pick<CatalogProductMaster, 'id' | 'name' | 'mediaKey' | 'mediaPolicy' | 'imageUri'>[];
  onClose: () => void;
};

type ItemActionResult = { type: 'success' | 'blocked' | 'info'; message: string };
type ItemActionResults = Record<string, ItemActionResult | undefined>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mediaPolicyConfig: Record<CatalogMediaPolicy, {
  label: string;
  description: string;
  owner: string;
  toneKey: 'success' | 'warning' | 'danger' | 'info';
}> = {
  'catalog-owned-media': {
    label: 'مركزي',
    description: 'الكتالوج مالك الوسيط — صورة معتمدة مركزياً.',
    owner: 'control-panel/catalogs',
    toneKey: 'success',
  },
  'partner-owned-exception': {
    label: 'استثناء شريك',
    description: 'الشريك مالك الصورة باستثناء معتمد من الكتالوج.',
    owner: 'control-panel/catalogs (استثناء)',
    toneKey: 'info',
  },
  'partner-proposed-review': {
    label: 'مقترح للمراجعة',
    description: 'الشريك اقترح صورة — تحتاج مراجعة الكتالوج أو التسويق.',
    owner: 'control-panel/catalogs → marketing',
    toneKey: 'warning',
  },
  'marketing-enhancement-required': {
    label: 'يحتاج تسويق',
    description: 'الصورة الحالية غير كافية — التسويق يجب أن يوفر بديلاً.',
    owner: 'control-panel/marketing',
    toneKey: 'danger',
  },
};

function getToneColor(
  tone: 'success' | 'warning' | 'danger' | 'info',
  theme: {
    success: string;
    warning: string;
    danger: string;
    info?: string;
    brand: string;
  },
): string {
  if (tone === 'success') return theme.success;
  if (tone === 'warning') return theme.warning;
  if (tone === 'danger') return theme.danger;
  return theme.info ?? theme.brand;
}

function getToneBg(
  tone: 'success' | 'warning' | 'danger' | 'info',
  theme: {
    successSurface: string;
    warningSurface?: string;
    dangerSurface: string;
    infoSurface?: string;
    surface: string;
    surfaceInset: string;
  },
): string {
  if (tone === 'success') return theme.successSurface;
  if (tone === 'warning') return theme.warningSurface ?? theme.surface;
  if (tone === 'danger') return theme.dangerSurface;
  return theme.infoSurface ?? theme.surfaceInset;
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

function PolicyBadge({ policy }: { policy: CatalogMediaPolicy }) {
  const { theme } = useTheme();
  const config = mediaPolicyConfig[policy];
  const color = getToneColor(config.toneKey, theme);
  return (
    <Box
      style={{
        backgroundColor: color + '22',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
      }}
    >
      <Text role="caption" style={{ fontSize: 11, fontWeight: '800', color }}>
        {config.label}
      </Text>
    </Box>
  );
}

function ResultBanner({ result }: { result: ItemActionResult | undefined }) {
  const { theme } = useTheme();
  if (!result) return null;
  const bg = result.type === 'success' ? theme.successSurface
    : result.type === 'blocked' ? theme.dangerSurface
    : theme.surfaceInset;
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

export function CatalogMediaGovernanceWorkspace({
  items,
  onClose,
}: CatalogMediaGovernanceWorkspaceProps) {
  const { theme } = useTheme();
  const [actionResults, setActionResults] = useState<ItemActionResults>({});

  function setResult(id: string, result: ItemActionResult) {
    setActionResults((prev) => ({ ...prev, [id]: result }));
  }

  function handleSendToMarketing(item: Pick<CatalogProductMaster, 'id' | 'name' | 'mediaPolicy'>) {
    if (
      item.mediaPolicy !== 'partner-proposed-review' &&
      item.mediaPolicy !== 'marketing-enhancement-required'
    ) {
      setResult(item.id, {
        type: 'blocked',
        message: `محظور — "${item.name}" يملك سياسة "${mediaPolicyConfig[item.mediaPolicy].label}" — لا يحتاج تحويلاً للتسويق.`,
      });
      return;
    }
    setResult(item.id, {
      type: 'success',
      message: `UI_PREVIEW_ONLY — تم تحويل "${item.name}" لمراجعة التسويق محلياً. الإجراء الفعلي يتطلب ربط API.`,
    });
  }

  function handleApproveException(item: Pick<CatalogProductMaster, 'id' | 'name' | 'mediaPolicy'>) {
    if (item.mediaPolicy !== 'partner-owned-exception') {
      setResult(item.id, {
        type: 'blocked',
        message: `محظور — "${item.name}" ليس في حالة "استثناء شريك". التحويل للاستثناء غير ملائم.`,
      });
      return;
    }
    setResult(item.id, {
      type: 'success',
      message: `UI_PREVIEW_ONLY — تم اعتماد استثناء الشريك لـ "${item.name}" محلياً.`,
    });
  }

  function handleMarkCatalogOwned(item: Pick<CatalogProductMaster, 'id' | 'name'>) {
    setResult(item.id, {
      type: 'info',
      message: `UI_PREVIEW_ONLY — تم تمييز "${item.name}" كمركزي (catalog-owned-media) محلياً.`,
    });
  }

  const missingMedia = items.filter((i) => !i.mediaKey && !i.imageUri);
  const policyGroups = catalogMediaPolicyOptions.map((policy) => ({
    policy,
    items: items.filter((i) => i.mediaPolicy === policy),
  }));

  return (
    <Box
      gap={0}
      style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0,
        width: '100%',
        maxWidth: 640,
        backgroundColor: theme.surface,
        borderLeftWidth: 1,
        borderLeftColor: theme.line,
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      <WebCompactSurfaceHeader
        title="حوكمة الوسائط"
        subtitle="UI_PREVIEW_ONLY · المالك: control-panel/catalogs"
        onBack={onClose}
      />

      <Box gap={4} style={{ padding: 16 }}>

        {/* Owner notice */}
        <Box style={{ backgroundColor: theme.surfaceInset, borderRadius: 6, padding: 8 }}>
          <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
            المالك: control-panel/catalogs · لا نقل ملفات وسائط · لا صور · لا payload كامل
          </Text>
        </Box>

        {/* Summary metrics */}
        <Box layoutDirection="row" gap={6} style={{ flexWrap: 'wrap' }}>
          <Box style={{ backgroundColor: theme.surfaceInset, borderRadius: 8, padding: 10, flex: 1, minWidth: 80 }}>
            <Text role="caption" tone="muted" style={{ fontSize: 10 }}>إجمالي</Text>
            <Text role="label" style={{ fontWeight: '800', color: theme.brandHeaderBackground }}>{items.length}</Text>
          </Box>
          <Box style={{ backgroundColor: missingMedia.length > 0 ? theme.dangerSurface : theme.successSurface, borderRadius: 8, padding: 10, flex: 1, minWidth: 80 }}>
            <Text role="caption" tone="muted" style={{ fontSize: 10 }}>بدون وسائط</Text>
            <Text role="label" style={{ fontWeight: '800', color: missingMedia.length > 0 ? theme.danger : theme.success }}>{missingMedia.length}</Text>
          </Box>
          {policyGroups.map(({ policy, items: groupItems }) => (
            <Box
              key={policy}
              style={{
                backgroundColor: getToneBg(mediaPolicyConfig[policy].toneKey, theme),
                borderRadius: 8, padding: 10, flex: 1, minWidth: 80,
              }}
            >
              <Text role="caption" tone="muted" style={{ fontSize: 10 }}>{mediaPolicyConfig[policy].label}</Text>
              <Text role="label" style={{
                fontWeight: '800',
                color: getToneColor(mediaPolicyConfig[policy].toneKey, theme),
              }}>
                {groupItems.length}
              </Text>
            </Box>
          ))}
        </Box>

        {/* Missing media section */}
        {missingMedia.length > 0 && (
          <Box gap={2} style={{ backgroundColor: theme.dangerSurface, borderRadius: 8, padding: 12 }}>
            <SectionTitle>بدون وسائط ({missingMedia.length})</SectionTitle>
            {missingMedia.map((item) => (
              <Box key={item.id} layoutDirection="row" gap={8} style={{ alignItems: 'center', paddingVertical: 2 }}>
                <Text role="caption" style={{ color: theme.danger, flexShrink: 1 }}>✗ {item.name}</Text>
                <PolicyBadge policy={item.mediaPolicy} />
              </Box>
            ))}
          </Box>
        )}

        {/* Watermark/brand policy note */}
        <Box style={{ backgroundColor: theme.surfaceInset, borderRadius: 8, padding: 12 }}>
          <Text role="caption" style={{ fontWeight: '700', color: theme.brandHeaderBackground, marginBottom: 4, fontSize: 12 }}>
            ملاحظة سياسة العلامة التجارية
          </Text>
          <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
            جميع الصور الموافق عليها تخضع لسياسة العلامة التجارية المركزية (watermark/brand policy).{'\n'}
            الصور الإضافية من الشريك تمر على مراجعة تسويقية قبل الإقرار النهائي.{'\n'}
            لا يمكن رفع أو نقل ملفات وسائط مباشرة من هذه الواجهة — UI_PREVIEW_ONLY.
          </Text>
        </Box>

        {/* Policy groups */}
        {policyGroups.map(({ policy, items: groupItems }) => {
          if (groupItems.length === 0) return null;
          const config = mediaPolicyConfig[policy];
          const toneColor = getToneColor(config.toneKey, theme);
          return (
            <Box key={policy} gap={3} style={{ backgroundColor: theme.surfaceInset, borderRadius: 8, padding: 12 }}>
              <Box layoutDirection="row" gap={8} style={{ alignItems: 'center' }}>
                <SectionTitle>{config.label} ({groupItems.length})</SectionTitle>
                <Text role="caption" style={{ color: toneColor, fontSize: 11 }}>{config.description}</Text>
              </Box>
              <Text role="caption" tone="muted" style={{ fontSize: 11 }}>المالك: {config.owner}</Text>

              {groupItems.map((item) => {
                const result = actionResults[item.id];
                return (
                  <Box
                    key={item.id}
                    gap={2}
                    style={{
                      backgroundColor: theme.surface,
                      borderRadius: 8, padding: 10,
                      borderLeftWidth: 3,
                      borderLeftColor: toneColor,
                    }}
                  >
                    <Box layoutDirection="row" gap={8} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text role="caption" style={{ fontWeight: '700', flexShrink: 1 }}>{item.name}</Text>
                      <PolicyBadge policy={item.mediaPolicy} />
                    </Box>

                    <Box layoutDirection="row" gap={4}>
                      <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
                        mediaKey: {item.mediaKey || '—'}
                      </Text>
                    </Box>

                    <Box layoutDirection="row" gap={6} style={{ flexWrap: 'wrap' }}>
                      {policy === 'partner-proposed-review' || policy === 'marketing-enhancement-required' ? (
                        <Button
                          label="إرسال للتسويق"
                          tone="primary"
                          size="sm"
                          onPress={() => handleSendToMarketing(item)}
                        />
                      ) : null}
                      {policy === 'partner-owned-exception' ? (
                        <Button
                          label="اعتماد الاستثناء"
                          tone="secondary"
                          size="sm"
                          onPress={() => handleApproveException(item)}
                        />
                      ) : null}
                      {policy !== 'catalog-owned-media' ? (
                        <Button
                          label="تمييز كمركزي"
                          tone="ghost"
                          size="sm"
                          onPress={() => handleMarkCatalogOwned(item)}
                        />
                      ) : null}
                    </Box>

                    <ResultBanner result={result} />
                  </Box>
                );
              })}
            </Box>
          );
        })}

        <Text role="caption" tone="muted" style={{ fontSize: 10, marginTop: 4 }}>
          UI_PREVIEW_ONLY — لا نقل وسائط · لا صور · لا payload كامل · جميع الإجراءات محاكاة محلية
        </Text>

        <Button label="إغلاق" tone="ghost" size="sm" onPress={onClose} style={{ marginTop: 8 }} />
      </Box>
    </Box>
  );
}
