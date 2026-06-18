import React, { useState } from 'react';
import { Box, Button, Surface, Text, SearchField, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelStatusTag } from '@bthwani/ui-kit/web';
import Image from 'next/image';
import { getActualPublicMediaPath, getMediaKeyFromPublicPath } from '../../shared/media/resolve-dsh-public-media-path';
import { resolveDshImageSource } from '../../shared/media/resolve-dsh-image-source';
import type { CatalogProductMaster, CatalogMainCategory } from './catalogs.data';

// --- FilterDropdown.tsx ---

export type FilterDropdownProps = {
  titleText: string;
  options: readonly string[];
  selected: readonly string[];
  onChange: (nextValues: string[]) => void;
  onClose: () => void;
  optionLabels?: Record<string, string>;
};

export const FilterDropdown = ({ titleText, options, selected, onChange, onClose, optionLabels }: FilterDropdownProps) => {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const filteredOptions = options.filter((option) => {
    const label = optionLabels?.[option] ?? option;
    return label.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Surface tone="raised" padding={2} gap={2} style={{ position: 'absolute', top: '100%', right: 0, zIndex: 50, width: 200, marginTop: 4 }}>
      <Box padding={1} style={{ borderBottomWidth: 1, borderBottomColor: theme.line }}>
        <SearchField
          placeholder={`بحث في ${titleText}...`}
          value={search}
          onChangeText={setSearch}
        />
      </Box>
      <Box style={{ maxHeight: 150 }}>
        {filteredOptions.length === 0 ? (
           <Box padding={2} align="center">
             <Text role="caption" tone="muted">لا توجد نتائج</Text>
           </Box>
        ) : filteredOptions.map((opt) => (
          <Box key={opt} layoutDirection="row" align="center" gap={2} paddingY={1}>
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={(e) => {
                if (e.target.checked) onChange([...selected, opt]);
                else onChange(selected.filter((selectedOption) => selectedOption !== opt));
              }}
              style={{ accentColor: theme.brandHeaderBackground }}
            />
            <Text role="caption" style={{ flex: 1, textAlign: 'right' }}>
              {optionLabels?.[opt] ?? opt}
            </Text>
          </Box>
        ))}
      </Box>
      <Box layoutDirection="row" justify="space-between" style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 8 }}>
         <Button label="تطبيق" tone="brand" size="sm" onPress={onClose} />
         <Button label="مسح" tone="secondary" size="sm" onPress={() => { onChange([]); onClose(); }} />
      </Box>
    </Surface>
  );
};

// --- InspectorTile.tsx ---

export function InspectorTile({ tileTitle, children, dashed = false, warning = false }: { tileTitle: string, children: React.ReactNode, dashed?: boolean, warning?: boolean }) {
  const { theme } = useTheme();
  return (
    <Box
      gap={2}
      style={{
        padding: 12,
        backgroundColor: warning ? theme.dangerSurface : dashed ? theme.surface : theme.surfaceInset,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: warning ? theme.danger : dashed ? theme.lineStrong : theme.line,
        borderStyle: dashed ? 'dashed' : 'solid',
      }}
    >
       <Text role="caption" weight="black" style={{ color: warning ? theme.danger : theme.brandHeaderBackground }}>{tileTitle}</Text>
       {children}
    </Box>
  );
}

// --- MiniInfoBox.tsx ---

export function MiniInfoBox({ label, value, valueColor, isBoldValue = false }: { label: string, value: string | React.ReactNode, valueColor?: string, isBoldValue?: boolean }) {
  const { theme } = useTheme();
  return (
    <Box gap={0}>
      <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>{label}</Text>
      <Text role="caption" weight={isBoldValue ? 'black' : 'semibold'} style={{ color: valueColor || theme.brandHeaderBackground, textAlign: 'right' }}>{value}</Text>
    </Box>
  );
}

// --- PolicyBadge.tsx ---

export function PolicyBadge({ mediaPolicy }: { mediaPolicy: string }) {
  const { theme } = useTheme();
  const isCentral = mediaPolicy === 'catalog-owned-media';
  return (
    <Text role="caption" numberOfLines={1} weight="bold" style={{ color: isCentral ? theme.success : theme.warning }}>
      {isCentral ? 'مركزي' : 'شريك'}
    </Text>
  );
}

// --- WatermarkedImage.tsx ---



function resolveWebImageSource(keyOrUri?: string | null): any {
  if (!keyOrUri) return null;

  let keyToResolve = keyOrUri;
  const extractedKey = getMediaKeyFromPublicPath(keyOrUri);
  if (extractedKey) {
    keyToResolve = extractedKey;
  }

  if (
    keyToResolve.startsWith('http://') ||
    keyToResolve.startsWith('https://') ||
    keyToResolve.startsWith('/') ||
    keyToResolve.startsWith('//')
  ) {
    return keyToResolve;
  }

  const resolved = resolveDshImageSource(keyToResolve);
  if (!resolved) return null;

  if (typeof resolved === 'object') {
    if ('uri' in resolved) {
      return resolved.uri;
    }
    if ('src' in resolved) {
      return resolved;
    }
    const resolvedAny = resolved as unknown as Record<string, unknown>;
    if (resolvedAny['default'] && typeof resolvedAny['default'] === 'object' && 'src' in (resolvedAny['default'] as object)) {
      return resolvedAny['default'] as typeof resolved;
    }
  }

  return resolved;
}

const WATERMARK_SRC = resolveWebImageSource('brand.logo.v1');

function getPremiumEmoji(name: string, fallback?: string): string {
  const n = name.toLowerCase();
  if (n.includes('تفاح')) return '🍎';
  if (n.includes('حليب')) return '🥛';
  if (n.includes('خبز') || n.includes('كرواسون')) return '🍞';
  if (n.includes('دجاج')) return '🍗';
  if (n.includes('برجر') || n.includes('برغر')) return '🍔';
  if (n.includes('باستا')) return '🍝';
  if (n.includes('شوكولاتة') || n.includes('شوكولاته') || n.includes('كيك') || n.includes('حلا') || n.includes('شريحة')) return '🍰';
  if (n.includes('عصير') || n.includes('ليمون') || n.includes('برتقال')) return '🍊';
  if (n.includes('تمر')) return '🌴';
  if (n.includes('عسل')) return '🍯';
  if (n.includes('ايفون') || n.includes('جوال') || n.includes('بروك ماكس')) return '📱';
  if (n.includes('شاحن')) return '🔌';
  if (n.includes('زيت')) return '🛢️';
  if (n.includes('بطارية')) return '🔋';
  return fallback || '📦';
}

export function WatermarkedImage({ src, mediaKey, fallback, size = 32, productName = '' }: { src?: string, mediaKey?: string, fallback?: string, size?: number, productName?: string }) {
  const { theme } = useTheme();

  const keyToResolve = mediaKey || src || '';
  const resolvedSrc = resolveWebImageSource(keyToResolve);

  const hasValidRealImage = !!resolvedSrc;
  const emoji = getPremiumEmoji(productName || '', fallback);

  return (
    <Surface
      tone="inset"
      padding={0}
      border
      radiusToken="xs"
      style={{
        width: size,
        height: size,
        position: 'relative',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        backgroundColor: theme.surfaceInset,
      }}
    >
      {hasValidRealImage && resolvedSrc ? (
        <Image src={resolvedSrc} fill style={{ objectFit: 'cover' }} alt="صورة المنتج" />
      ) : (
        <span style={{ fontSize: `${size * 0.55}px`, lineHeight: 1, userSelect: 'none', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>
          {emoji}
        </span>
      )}
      <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', alignItems: 'center', justifyContent: 'center', opacity: 0.12 }}>
        {WATERMARK_SRC ? (
          <Image src={WATERMARK_SRC} width={size * 0.8} height={size * 0.8} style={{ objectFit: 'contain' }} alt="شعار المنصة" />
        ) : null}
      </Box>
    </Surface>
  );
}

// --- Drawer Parts ---

export function SectionTitle({ children }: { children: string }) {
  const { theme } = useTheme();
  return (
    <Text role="label" weight="black" style={{ color: theme.brandHeaderBackground, marginBottom: 4 }}>
      {children}
    </Text>
  );
}

export type ActionResult = { type: 'success' | 'blocked' | 'info'; message: string } | null;

export function ResultBanner({ result }: { result: ActionResult }) {
  const { theme } = useTheme();
  if (!result) return null;
  const bg = result.type === 'success' ? theme.successSurface
    : result.type === 'blocked' ? theme.dangerSurface
    : theme.infoSurface ?? theme.surfaceInset;
  const color = result.type === 'success' ? theme.success
    : result.type === 'blocked' ? theme.danger
    : theme.text;
  return (
    <Box style={{ backgroundColor: bg, borderRadius: 8, padding: 10, marginTop: 8 }}>
      <Text role="caption" weight="bold" style={{ color }}>{result.message}</Text>
    </Box>
  );
}

export function WorkspacePreviewNotice({ bannerTitle, subtitle }: { bannerTitle: string; subtitle: string | React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <Surface
      tone="inset"
      padding={3}
      gap={1}
      style={{ borderRadius: 8, borderWidth: 1, borderColor: theme.warning, borderStyle: 'dashed' }}
    >
      <Text role="caption" weight="bold" style={{ color: theme.warning }}>
        {bannerTitle}
      </Text>
      <Text role="caption" tone="muted">
        {subtitle}
      </Text>
    </Surface>
  );
}

export function WorkspaceSuccessBanner({ bannerTitle, subtitle, note }: { bannerTitle: string; subtitle?: string; note?: string }) {
  const { theme } = useTheme();
  return (
    <Surface
      tone="inset"
      padding={3}
      gap={1}
      style={{ borderRadius: 8, borderWidth: 1, borderColor: theme.success, borderStyle: 'solid' }}
    >
      <Text role="caption" weight="black" style={{ color: theme.success }}>
        {bannerTitle}
      </Text>
      {subtitle && (
        <Text role="caption" weight="bold" style={{ color: theme.brandHeaderBackground }}>
          {subtitle}
        </Text>
      )}
      {note && (
        <Text role="caption" tone="muted">
          {note}
        </Text>
      )}
    </Surface>
  );
}

export function WorkspaceIntroBanner({
  bannerTitle,
  description,
  whyItMatters,
  affectedSurfaces,
  ownerSurface,
  nextOwner,
  impactInfo,
  nextActionLabel,
  extraActions,
}: {
  bannerTitle: string;
  description: string;
  nextActionLabel: string;
  whyItMatters?: string;
  affectedSurfaces?: string[];
  ownerSurface?: string;
  nextOwner?: string;
  impactInfo?: string;
  extraActions?: React.ReactNode;
}) {
  const { theme } = useTheme();
  return (
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
          <Text role="bodyStrong" weight="black" style={{ fontSize: 16, color: theme.brandHeaderBackground }}>{bannerTitle}</Text>
          <Text role="caption" tone="muted" style={{ fontSize: 11, marginTop: 4 }}>{description}</Text>
        </div>
        <span style={{ fontSize: '9px', color: theme.success, fontWeight: '700', backgroundColor: theme.brandSurface, padding: '2px 8px', borderRadius: '4px' }}>
          معاينة محلية فقط
        </span>
      </div>

      {whyItMatters && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: `1px solid ${theme.line}`, paddingTop: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: theme.brandHeaderBackground }}>💡 الأهمية والهدف:</span>
          <Text role="caption" style={{ fontSize: 10, color: theme.textMuted }}>{whyItMatters}</Text>
        </div>
      )}

      {affectedSurfaces && affectedSurfaces.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: theme.surfaceInset, padding: '10px 12px', borderRadius: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 'bold', color: theme.brand, marginBottom: '2px' }}>🔄 الأسطح المتأثرة (Affected Surfaces):</span>
          {affectedSurfaces.map((surface, idx) => (
            <span key={idx} style={{ fontSize: '10px', color: theme.brandHeaderBackground, display: 'block' }}>
              • {surface}
            </span>
          ))}
        </div>
      )}

      {(ownerSurface || nextOwner) && (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', borderTop: `1px solid ${theme.line}`, paddingTop: '10px' }}>
          {ownerSurface && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '10px', color: theme.textMuted }}>الجهة المالكة / المصدر:</span>
              <span style={{ fontSize: '11px', color: theme.brand, fontWeight: '700' }}>{ownerSurface}</span>
            </div>
          )}
          {nextOwner && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '10px', color: theme.textMuted }}>المراجع التالي للمسار:</span>
              <span style={{ fontSize: '11px', color: theme.brand, fontWeight: '700' }}>{nextOwner}</span>
            </div>
          )}
        </div>
      )}

      {impactInfo && (
        <div style={{ backgroundColor: theme.surfaceInset, padding: '8px 12px', borderRadius: '6px', borderRight: `3px solid ${theme.brand}` }}>
          <Text role="caption" style={{ fontSize: 10, color: theme.brandHeaderBackground }}>
            ℹ️ <strong>أثر السطح:</strong> {impactInfo}
          </Text>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          label={nextActionLabel}
          tone="secondary"
          size="sm"
          disabled
          accessibilityLabel={`${nextActionLabel} (معاينة محلية فقط)`}
          onPress={() => {}}
        />
        <span style={{ fontSize: '10px', color: theme.textMuted, alignSelf: 'center' }}>
          (الإجراء معطل: معاينة محلية فقط)
        </span>
        {extraActions}
      </div>
    </div>
  );
}

export function WorkspaceProductListItem({
  product,
  isSelected,
  onSelect,
  detailText,
  statusLabel,
  statusTone,
  rightSide,
}: {
  product: CatalogProductMaster;
  isSelected: boolean;
  onSelect: () => void;
  detailText: React.ReactNode;
  statusLabel: string;
  statusTone: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  rightSide?: React.ReactNode;
}) {
  const { theme } = useTheme();
  return (
    <div
      onClick={onSelect}
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
        boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <WatermarkedImage src={product.imageUri} mediaKey={product.mediaKey} fallback={product.emojiFallback} size={36} productName={product.name} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Text role="bodyStrong" style={{ fontSize: 12, color: theme.brandHeaderBackground }}>{product.name}</Text>
          <span style={{ fontSize: '10px', color: theme.textMuted, fontFamily: typeof detailText === 'string' && detailText.match(/^[a-zA-Z0-9-]*$/) ? 'monospace' : undefined, direction: typeof detailText === 'string' && detailText.match(/^[a-zA-Z0-9-]*$/) ? 'ltr' : undefined }}>{detailText}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {rightSide}
        <WebControlPanelStatusTag label={statusLabel} tone={statusTone === 'neutral' ? 'info' : statusTone} />
      </div>
    </div>
  );
}

export type WorkspaceCategoryPickerProps = {
  categories: CatalogMainCategory[];
  value: {
    mainCat: string;
    subCat: string;
    mainClassif: string;
    subClassif: string;
  };
  onChange: (value: {
    mainCat: string;
    subCat: string;
    mainClassif: string;
    subClassif: string;
  }) => void;
  layout?: 'vertical' | 'horizontal';
  hideClassifications?: boolean;
};

export function WorkspaceCategoryPicker({ categories, value, onChange, layout = 'vertical', hideClassifications = false }: WorkspaceCategoryPickerProps) {
  const { theme } = useTheme();

  const selectStyle = {
    padding: '6px 10px',
    borderRadius: '6px',
    border: `1px solid ${theme.lineStrong}`,
    direction: 'rtl' as const,
    backgroundColor: theme.surface,
    color: theme.brandHeaderBackground,
    width: '100%',
    fontSize: '11px',
    outline: 'none'
  };

  const labelStyle = { fontSize: 10, textAlign: 'right' as const, marginBottom: 4 };

  const handleMainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ mainCat: e.target.value, subCat: '', mainClassif: '', subClassif: '' });
  };
  const handleSubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, subCat: e.target.value, mainClassif: '', subClassif: '' });
  };
  const handleMainClassifChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, mainClassif: e.target.value, subClassif: '' });
  };
  const handleSubClassifChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, subClassif: e.target.value });
  };

  const selectedMain = categories.find(c => c.id === value.mainCat);
  const selectedSub = selectedMain?.subcategories.find(s => s.id === value.subCat);
  const mainClassifs = selectedSub?.mainClassifications || [];
  const selectedMainClassif = mainClassifs.find(mc => mc.id === value.mainClassif);
  const subClassifs = selectedMainClassif?.subClassifications || [];

  const mainSelect = (
    <Box style={{ flex: 1 }} gap={1}>
      <Text role="caption" tone="muted" style={labelStyle}>الفئة الرئيسية *</Text>
      <select aria-label="الفئة الرئيسية" value={value.mainCat} onChange={handleMainChange} style={selectStyle}>
        <option value="">اختر فئة رئيسية...</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
      </select>
    </Box>
  );

  const subSelect = (
    <Box style={{ flex: 1 }} gap={1}>
      <Text role="caption" tone="muted" style={labelStyle}>الفئة الفرعية</Text>
      <select aria-label="الفئة الفرعية" value={value.subCat} onChange={handleSubChange} style={selectStyle}>
        <option value="">لا يوجد (عام)</option>
        {(selectedMain?.subcategories || []).map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
      </select>
    </Box>
  );

  const mainClassifSelect = !hideClassifications && mainClassifs.length > 0 ? (
    <Box style={{ flex: 1 }} gap={1}>
      <Text role="caption" tone="muted" style={labelStyle}>التصنيف الرئيسي</Text>
      <select aria-label="التصنيف الرئيسي" value={value.mainClassif} onChange={handleMainClassifChange} style={selectStyle}>
        <option value="">لا يوجد (عام)</option>
        {mainClassifs.map(mc => <option key={mc.id} value={mc.id}>{mc.label}</option>)}
      </select>
    </Box>
  ) : null;

  const subClassifSelect = !hideClassifications && subClassifs.length > 0 ? (
    <Box style={{ flex: 1 }} gap={1}>
      <Text role="caption" tone="muted" style={labelStyle}>التصنيف الفرعي</Text>
      <select aria-label="التصنيف الفرعي" value={value.subClassif} onChange={handleSubClassifChange} style={selectStyle}>
        <option value="">لا يوجد (عام)</option>
        {subClassifs.map(sc => <option key={sc.id} value={sc.id}>{sc.label}</option>)}
      </select>
    </Box>
  ) : null;

  if (layout === 'horizontal') {
    return (
      <Box gap={2}>
        <Box layoutDirection="row" gap={2}>
          {mainSelect}
          {subSelect}
        </Box>
        {(mainClassifSelect || subClassifSelect) && (
          <Box layoutDirection="row" gap={2}>
            {mainClassifSelect || <Box style={{ flex: 1 }} />}
            {subClassifSelect || <Box style={{ flex: 1 }} />}
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box gap={1}>
      {mainSelect}
      {subSelect}
      {mainClassifSelect}
      {subClassifSelect}
    </Box>
  );
}
