'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Box, Button, Surface, Text, SearchField, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelCompactPager, WebControlPanelStatusTag } from '@bthwani/ui-kit/web';
import {
  dshCatalogCategories,
  dshCatalogProducts,
  CatalogProductMaster,
  CatalogMainCategory,
  CatalogSubCategory,
} from './catalog';
import { resolveDshImageSource } from '../../shared/resolve-dsh-image-source';
import styles from '../shared/control-panel-surface.module.css';

// --- Types ---
export type ControlPanelDshCatalogScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  partnersHref?: string;
  marketingHref?: string;
};

type WorkspaceMode =
  | 'catalog'
  | 'quick-entry'
  | 'partner-entry'
  | 'field-intake'
  | 'duplicate-resolution'
  | 'category-mapping'
  | 'media-governance'
  | 'marketing-approvals';

type FilterType = 'all' | 'active' | 'review' | 'conflict' | 'master' | 'partner' | 'needs-link' | 'needs-image';

type CatalogFilterColumnId = keyof typeof initialColumnFilters;

const catalogPageSize = 5;

type FilterDropdownProps = {
  title: string;
  options: readonly string[];
  selected: readonly string[];
  onChange: (nextValues: string[]) => void;
  onClose: () => void;
};

const initialColumnFilters = {
  name: [],
  category: [],
  classification: [],
  sku: [],
  price: [],
  policy: [],
  status: [],
  source: [],
  categoryMode: [],
} satisfies Record<string, string[]>;

// --- Shared Components ---

function FilterToken({ label, onRemove }: { label: string, onRemove: () => void }) {
  return (
    <Surface tone="raised" paddingX={2} paddingY={1} radiusToken="pill" layoutDirection="row" align="center" gap={1}>
      <Text role="caption" style={{ fontWeight: 700 }}>{label}</Text>
      <Button label="✕" accessibilityLabel="إزالة" tone="secondary" size="sm" onPress={onRemove} style={{ minWidth: 0, padding: 0, backgroundColor: 'transparent', borderWidth: 0 }} />
    </Surface>
  );
}

function PolicyBadge({ mediaPolicy }: { mediaPolicy: string }) {
  const { theme } = useTheme();
  const isCentral = mediaPolicy === 'catalog-owned-media';
  return (
    <Text role="caption" numberOfLines={1} style={{ fontWeight: '700', color: isCentral ? theme.success : theme.warning }}>
      {isCentral ? 'مركزي' : 'شريك'}
    </Text>
  );
}

function InspectorTile({ title, children, dashed = false, warning = false }: { title: string, children: React.ReactNode, dashed?: boolean, warning?: boolean }) {
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
       <Text role="caption" style={{ fontWeight: '800', color: warning ? theme.danger : theme.brandHeaderBackground }}>{title}</Text>
       {children}
    </Box>
  );
}

function MiniInfoBox({ label, value, valueColor, isBoldValue = false }: { label: string, value: string | React.ReactNode, valueColor?: string, isBoldValue?: boolean }) {
  const { theme } = useTheme();
  return (
    <Box gap={0}>
      <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>{label}</Text>
      <Text role="caption" style={{ color: valueColor || theme.brandHeaderBackground, fontWeight: isBoldValue ? '800' : '600', textAlign: 'right' }}>{value}</Text>
    </Box>
  );
}

const WATERMARK_URL = '/dsh/media-fixtures/assets/seed/dsh/logo.png';

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

function WatermarkedImage({ src, mediaKey, fallback, size = 32, productName = '' }: { src?: string, mediaKey?: string, fallback?: string, size?: number, productName?: string }) {
  const { theme } = useTheme();

  // Resolve image using the unified resolver for seed assets or custom URIs
  const resolved = resolveDshImageSource(mediaKey || src);
  const imagePath = resolved && typeof resolved === 'object' && 'src' in resolved
    ? (resolved as any).src
    : (resolved && typeof resolved === 'object' && 'uri' in resolved
        ? (resolved as any).uri
        : typeof resolved === 'string'
          ? resolved
          : undefined);

  const hasValidRealImage = !!imagePath;
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
      {hasValidRealImage && imagePath ? (
        <Image src={imagePath} fill style={{ objectFit: 'cover' }} alt="صورة المنتج" />
      ) : (
        <span style={{ fontSize: `${size * 0.55}px`, lineHeight: 1, userSelect: 'none', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>
          {emoji}
        </span>
      )}
      <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', alignItems: 'center', justifyContent: 'center', opacity: 0.12 }}>
        <Image src={WATERMARK_URL} width={size * 0.8} height={size * 0.8} style={{ objectFit: 'contain' }} alt="شعار المنصة" />
      </Box>
    </Surface>
  );
}

const FilterDropdown = ({ title, options, selected, onChange, onClose }: FilterDropdownProps) => {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const filteredOptions = options.filter((option) => option.toLowerCase().includes(search.toLowerCase()));

  return (
    <Surface tone="raised" padding={2} gap={2} style={{ position: 'absolute', top: '100%', right: 0, zIndex: 50, width: 200, marginTop: 4 }}>
      <Box padding={1} style={{ borderBottomWidth: 1, borderBottomColor: theme.line }}>
        <SearchField
          placeholder={`بحث في ${title}...`}
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
            <Text role="caption" style={{ flex: 1, textAlign: 'right' }}>{opt}</Text>
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

import { CatalogAdoptionQueue } from './CatalogAdoptionQueue';
import { ItemApprovalSection } from './ItemApprovalSection';
import { CatalogPublishingGateSection } from './CatalogPublishingGateSection';

// --- Main Screen Component ---

export function ControlPanelDshCatalogScreen({
  hubHref = '/operations',
  operationsHref = '/operations',
  partnersHref = '/partners',
  marketingHref = '/marketing',
}: ControlPanelDshCatalogScreenProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [activeSubTab, setActiveSubTab] = useState<string>('');
  const [showBulkOps, setShowBulkOps] = useState(false);
  const [activeMainCategory, setActiveMainCategory] = useState<CatalogMainCategory | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<CatalogSubCategory | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [catalogPage, setCatalogPage] = useState(1);
  // Preview-only approval stage overrides — no backend
  const [previewApprovalStages, setPreviewApprovalStages] = useState<Record<string, string>>({});

  // ── Category Control Room State (Preview-Only) ────────────────────
  const [previewCategories, setPreviewCategories] = useState<CatalogMainCategory[]>(
    () => dshCatalogCategories.map((c) => ({ ...c, subcategories: [...c.subcategories] }))
  );
  const [hiddenCategoryIds, setHiddenCategoryIds] = useState<ReadonlySet<string>>(new Set());
  const [categoryControlOpen, setCategoryControlOpen] = useState(false);
  const [addingMainCat, setAddingMainCat] = useState(false);
  const [addingSubUnder, setAddingSubUnder] = useState<string | null>(null);
  const [formLabel, setFormLabel] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [catError, setCatError] = useState<string | null>(null);
  type CatEditEntry = { type: 'main' | 'sub'; mainId: string; subId?: string };
  const [editingEntry, setEditingEntry] = useState<CatEditEntry | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');

  const PRIMARY_TABS = [
    { id: 'all', label: 'الكل' },
    { id: 'catalog', label: 'السجل الرئيسي' },
    { id: 'intake', label: 'الاستلام والإدخال' },
    { id: 'approvals', label: 'الاعتمادات والجودة' },
    { id: 'mapping', label: 'الربط والحوكمة' },
    { id: 'publishing', label: 'النشر والرؤية' },
  ];

  const SECONDARY_TABS: Record<string, { id: string; label: string }[]> = {
    all: [],
    catalog: [
      { id: 'all', label: 'الكل' },
      { id: 'master', label: 'مركزي' },
      { id: 'exceptions', label: 'استثناءات شريك' },
    ],
    intake: [
      { id: 'quick', label: 'إدخال سريع' },
      { id: 'partner', label: 'بوابة الشريك' },
      { id: 'field', label: 'المسح الميداني' },
    ],
    approvals: [
      { id: 'marketing', label: 'تسويق' },
      { id: 'quality', label: 'جودة' },
      { id: 'pricing', label: 'تعارض أسعار' },
      { id: 'media', label: 'صور' },
      { id: 'barcode', label: 'باركود' },
    ],
    mapping: [
      { id: 'categories', label: 'ربط الفئات' },
      { id: 'duplicates', label: 'التكرارات' },
      { id: 'gtin', label: 'GTIN' },
      { id: 'substitutions', label: 'البدائل' },
      { id: 'visibility-policy', label: 'سياسة الظهور' },
    ],
    publishing: [
      { id: 'ready', label: 'جاهز للنشر' },
      { id: 'client-visible', label: 'ظاهر للعميل' },
      { id: 'hidden', label: 'مخفي' },
      { id: 'needs-review', label: 'يحتاج مراجعة' },
    ],
  };

  React.useEffect(() => {
    if (SECONDARY_TABS[activeTab]?.length > 0) {
      setActiveSubTab(SECONDARY_TABS[activeTab][0].id);
    } else {
      setActiveSubTab('');
    }
  }, [activeTab]);

  const workspaceMode = activeTab; // Bridge for existing logic

  // Column Filters
  const [colFilters, setColFilters] = useState<Record<CatalogFilterColumnId, string[]>>(initialColumnFilters);
  const [openFilterCol, setOpenFilterCol] = useState<CatalogFilterColumnId | null>(null);

  // Handlers
  const handleMainCategorySelect = (cat: CatalogMainCategory | null) => {
    setActiveMainCategory(cat);
    setActiveSubCategory(null);
    setSelectedProductId(null);
  };

  // ── Category Control Room Handlers (Preview-Only) ────────────────
  const effectiveCategories = useMemo(
    () => previewCategories.filter((c) => !hiddenCategoryIds.has(c.id)),
    [previewCategories, hiddenCategoryIds]
  );

  const getProductCountForCategory = React.useCallback(
    (mainId: string, subId?: string): number =>
      dshCatalogProducts.filter(
        (p) => p.categoryPath.main === mainId && (subId ? p.categoryPath.sub === subId : true)
      ).length,
    []
  );

  const handleAddMainCategory = React.useCallback(() => {
    const label = formLabel.trim();
    if (!label) { setCatError('الاسم مطلوب'); return; }
    if (previewCategories.some((c) => c.label.trim() === label)) { setCatError('هذا الاسم موجود مسبقاً'); return; }
    const id = `cat-preview-${label.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
    const emoji = label[0] ?? '📦';
    const newCat: CatalogMainCategory = {
      id, label, subtitle: formSubtitle.trim(),
      subcategories: [], emojiFallback: emoji,
      defaultMediaPolicy: 'catalog-owned-media', categoryMode: 'catalog-based',
    };
    setPreviewCategories((prev) => [...prev, newCat]);
    setFormLabel(''); setFormSubtitle(''); setAddingMainCat(false); setCatError(null);
  }, [formLabel, formSubtitle, previewCategories]);

  const handleAddSubCategory = React.useCallback((parentId: string) => {
    const label = formLabel.trim();
    if (!label) { setCatError('الاسم مطلوب'); return; }
    let hasError = false;
    setPreviewCategories((prev) => prev.map((cat) => {
      if (cat.id !== parentId) return cat;
      if (cat.subcategories.some((s) => s.label.trim() === label)) {
        hasError = true; return cat;
      }
      const id = `subcat-preview-${label.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
      return { ...cat, subcategories: [...cat.subcategories, { id, label, subtitle: formSubtitle.trim() }] };
    }));
    if (hasError) { setCatError('اسم مكرر في هذه الفئة'); return; }
    setFormLabel(''); setFormSubtitle(''); setAddingSubUnder(null); setCatError(null);
  }, [formLabel, formSubtitle]);

  const handleToggleCategoryHide = React.useCallback((id: string) => {
    setHiddenCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next as ReadonlySet<string>;
    });
  }, []);

  const handleResetCategoryPreview = React.useCallback(() => {
    setPreviewCategories(dshCatalogCategories.map((c) => ({ ...c, subcategories: [...c.subcategories] })));
    setHiddenCategoryIds(new Set());
    setAddingMainCat(false); setAddingSubUnder(null);
    setFormLabel(''); setFormSubtitle(''); setCatError(null); setEditingEntry(null);
  }, []);

  const handleStartCatEdit = React.useCallback((type: 'main' | 'sub', mainId: string, subId?: string) => {
    const cat = previewCategories.find((c) => c.id === mainId);
    if (!cat) return;
    if (type === 'main') { setEditLabel(cat.label); setEditSubtitle(cat.subtitle); }
    else {
      const sub = cat.subcategories.find((s) => s.id === subId);
      if (!sub) return;
      setEditLabel(sub.label); setEditSubtitle(sub.subtitle);
    }
    setEditingEntry({ type, mainId, subId }); setCatError(null);
    setAddingMainCat(false); setAddingSubUnder(null);
  }, [previewCategories]);

  const handleApplyCatEdit = React.useCallback(() => {
    if (!editingEntry) return;
    const label = editLabel.trim();
    if (!label) { setCatError('الاسم مطلوب'); return; }
    setPreviewCategories((prev) => {
      if (editingEntry.type === 'main') {
        if (prev.some((c) => c.id !== editingEntry.mainId && c.label.trim() === label)) {
          setCatError('هذا الاسم موجود مسبقاً'); return prev;
        }
        return prev.map((c) => c.id === editingEntry.mainId ? { ...c, label, subtitle: editSubtitle.trim() } : c);
      } else {
        return prev.map((cat) => {
          if (cat.id !== editingEntry.mainId) return cat;
          return {
            ...cat, subcategories: cat.subcategories.map((s) =>
              s.id === editingEntry.subId ? { ...s, label, subtitle: editSubtitle.trim() } : s
            ),
          };
        });
      }
    });
    setEditingEntry(null); setEditLabel(''); setEditSubtitle(''); setCatError(null);
  }, [editingEntry, editLabel, editSubtitle]);

  const selectedProduct = useMemo(() => dshCatalogProducts.find(p => p.id === selectedProductId) ?? null, [selectedProductId]);
  const isManualOrderCategory = activeMainCategory?.categoryMode === 'manual-order';

  const { filteredProducts, counts, filterOptions } = useMemo(() => {
    // 1. Base set: filter by Category and Manual Order mode
    if (isManualOrderCategory) {
      return {
        filteredProducts: [] as CatalogProductMaster[],
        counts: {
          'all': 0, 'active': 0, 'review': 0, 'conflict': 0, 'master': 0, 'partner': 0, 'needs-link': 0, 'needs-image': 0
        },
        filterOptions: {
          ...initialColumnFilters
        }
      };
    }

    // 2. Initial filter by category and search
    let products = dshCatalogProducts.filter(p => {
      if (activeMainCategory && p.categoryPath.main !== activeMainCategory.id) return false;
      if (activeSubCategory && p.categoryPath.sub !== activeSubCategory.id) return false;

      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower) ||
        (p.gtin && p.gtin.includes(searchLower)) ||
        (p.barcode && p.barcode.includes(searchLower));

      return matchesSearch;
    });

    // Filter based on Layer 1 and Layer 2 (contextual)
    if (activeTab === 'catalog') {
      if (activeSubTab === 'master') {
        products = products.filter(p => p.mediaPolicy === 'catalog-owned-media');
      } else if (activeSubTab === 'exceptions') {
        products = products.filter(p => p.mediaPolicy === 'partner-owned-exception');
      }
    } else if (activeTab === 'intake') {
      if (activeSubTab === 'quick') {
        products = products.filter(p => p.sourceSurface === 'catalog' || p.sourceSurface === 'client');
      } else if (activeSubTab === 'partner') {
        products = products.filter(p => p.sourceSurface === 'partner');
      } else if (activeSubTab === 'field') {
        products = products.filter(p => p.sourceSurface === 'field');
      }
    } else if (activeTab === 'approvals') {
      if (activeSubTab === 'marketing') {
        products = products.filter(p => p.approvalStage === 'marketing-review');
      } else if (activeSubTab === 'quality') {
        products = products.filter(p => p.approvalStage === 'partner-review');
      } else if (activeSubTab === 'pricing') {
        products = products.filter(p => p.price > 100);
      } else if (activeSubTab === 'media') {
        products = products.filter(p => p.mediaPolicy === 'partner-proposed-review' || p.mediaPolicy === 'marketing-enhancement-required' || !p.mediaKey);
      } else if (activeSubTab === 'barcode') {
        products = products.filter(p => !p.gtin || !!p.conflictReason);
      }
    } else if (activeTab === 'mapping') {
      if (activeSubTab === 'duplicates') {
        products = products.filter(p => !!p.conflictReason);
      } else if (activeSubTab === 'gtin') {
        products = products.filter(p => !p.gtin);
      } else if (activeSubTab === 'categories') {
        products = products.filter(p => !!p.categoryPath.main);
      } else if (activeSubTab === 'substitutions') {
        products = products.filter(p => p.categoryPath.main === 'restaurants'); // meals can have substitution policies
      } else if (activeSubTab === 'visibility-policy') {
        products = products.filter(p => p.surfaces.includes('client'));
      }
    } else if (activeTab === 'publishing') {
      if (activeSubTab === 'ready') {
        products = products.filter(p => p.approvalStage === 'catalog-adopted');
      } else if (activeSubTab === 'client-visible') {
        products = products.filter(p => p.approvalStage === 'client-visible');
      } else if (activeSubTab === 'hidden') {
        products = products.filter(p => p.approvalStage === 'catalog-draft' || p.approvalStage === 'partner-proposed');
      } else if (activeSubTab === 'needs-review') {
        products = products.filter(p => p.approvalStage === 'marketing-review' || p.approvalStage === 'partner-review');
      }
    }

    // 3. Dynamic counts for quick filters (based on current category/search)
    const dynamicCounts = {
      'all': products.length,
      'active': products.filter(p => p.approvalStage === 'client-visible').length,
      'review': products.filter(p => p.approvalStage === 'marketing-review' || p.approvalStage === 'partner-review').length,
      'conflict': products.filter(p => !!p.conflictReason).length,
      'master': products.filter(p => p.mediaPolicy === 'catalog-owned-media').length,
      'partner': products.filter(p => p.mediaPolicy === 'partner-owned-exception').length,
      'needs-link': products.filter(p => !p.gtin).length,
      'needs-image': products.filter(p => !p.imageUri || p.imageUri.includes('placeholder')).length,
    };

    // 4. Apply Layer 3 Smart Filters
    if (activeFilter === 'active') {
      products = products.filter(p => p.approvalStage === 'client-visible');
    } else if (activeFilter === 'review') {
      products = products.filter(p => p.approvalStage === 'marketing-review' || p.approvalStage === 'partner-review');
    } else if (activeFilter === 'conflict') {
      products = products.filter(p => !!p.conflictReason);
    } else if (activeFilter === 'master') {
      products = products.filter(p => p.mediaPolicy === 'catalog-owned-media');
    } else if (activeFilter === 'partner') {
      products = products.filter(p => p.mediaPolicy === 'partner-owned-exception');
    } else if (activeFilter === 'needs-link') {
      products = products.filter(p => !p.gtin);
    } else if (activeFilter === 'needs-image') {
      products = products.filter(p => !p.imageUri || p.imageUri.includes('placeholder'));
    }

    // 5. Apply Column Filters
    const getCatName = (id: string) => dshCatalogCategories.find(c => c.id === id)?.label || 'غير معروف';
    const getClassifName = (p: CatalogProductMaster) => {
       if(!p.categoryPath.mainClassification) return 'عام';
       const mainCat = dshCatalogCategories.find(c => c.id === p.categoryPath.main);
       const sub = mainCat?.subcategories?.find(s => s.id === p.categoryPath.sub);
       const classif = sub?.mainClassifications?.find(c => c.id === p.categoryPath.mainClassification);
       return classif?.label || p.categoryPath.mainClassification;
    };

    if (colFilters.name.length > 0) products = products.filter(p => colFilters.name.includes(p.name));
    if (colFilters.category.length > 0) products = products.filter(p => colFilters.category.includes(getCatName(p.categoryPath.main)));
    if (colFilters.classification.length > 0) products = products.filter(p => colFilters.classification.includes(getClassifName(p)));
    if (colFilters.sku.length > 0) products = products.filter(p => colFilters.sku.includes(p.sku));
    if (colFilters.price.length > 0) products = products.filter(p => colFilters.price.includes(p.price.toString()));
    if (colFilters.policy.length > 0) products = products.filter(p => colFilters.policy.includes(p.mediaPolicy));
    if (colFilters.status.length > 0) products = products.filter(p => colFilters.status.includes(p.conflictReason ? 'تعارض' : p.approvalStage === 'client-visible' ? 'نشط' : 'مراجعة'));
    if (colFilters.source.length > 0) products = products.filter(p => colFilters.source.includes(p.sourceSurface || 'catalog'));

    // 6. Generate options for column filters from the CURRENT product set
    const filterOptions = {
       name: Array.from(new Set(products.map(p => p.name))),
       category: Array.from(new Set(products.map(p => getCatName(p.categoryPath.main)))),
       classification: Array.from(new Set(products.map(p => getClassifName(p)))),
       sku: Array.from(new Set(products.map(p => p.sku))),
       price: Array.from(new Set(products.map(p => p.price.toString()))),
       policy: Array.from(new Set(products.map(p => p.mediaPolicy))),
       status: Array.from(new Set(products.map(p => p.conflictReason ? 'تعارض' : p.approvalStage === 'client-visible' ? 'نشط' : 'مراجعة'))),
       source: Array.from(new Set(products.map(p => p.sourceSurface || 'catalog'))),
       categoryMode: ['catalog-based', 'manual-order']
    };

    return { filteredProducts: products, counts: dynamicCounts, filterOptions };
  }, [isManualOrderCategory, activeMainCategory, activeSubCategory, searchQuery, activeFilter, colFilters]);

  // Handle click outside to close dropdowns
  React.useEffect(() => {
    const handleClick = () => setOpenFilterCol(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const activeColFiltersCount = Object.values(colFilters).flat().length;
  const catalogTotalPages = Math.max(1, Math.ceil(filteredProducts.length / catalogPageSize));
  const visibleProducts = useMemo(() => {
    const startIndex = (catalogPage - 1) * catalogPageSize;
    return filteredProducts.slice(startIndex, startIndex + catalogPageSize);
  }, [catalogPage, filteredProducts]);

  React.useEffect(() => {
    setCatalogPage(1);
  }, [activeMainCategory, activeSubCategory, activeFilter, activeTab, activeSubTab, searchQuery, colFilters]);

  React.useEffect(() => {
    setCatalogPage((currentPage) => Math.min(currentPage, catalogTotalPages));
  }, [catalogTotalPages]);

  // ── Contextual Micro Action Strip ────────────────────────────────────
  // Computed from activeTab + activeSubTab. Each action must change state and
  // reflect active state visually. No action may repeat the tab label itself.
  type MicroAction = { id: string; label: string; isActive: boolean; onAction: () => void };
  const microActions = useMemo((): MicroAction[] => {
    const actions: MicroAction[] = [];

    if (activeTab === 'mapping') {
      if (activeSubTab === 'gtin') {
        actions.push(
          { id: 'ma-gtin-conflict', label: 'حل تعارض GTIN', isActive: activeFilter === 'conflict', onAction: () => setActiveFilter('conflict') },
          { id: 'ma-gtin-missing', label: 'عرض ناقصي الباركود', isActive: activeFilter === 'needs-link', onAction: () => setActiveFilter('needs-link') },
        );
      } else if (activeSubTab === 'duplicates') {
        actions.push(
          { id: 'ma-dup-conflicts', label: 'عرض التكرارات', isActive: activeFilter === 'conflict', onAction: () => setActiveFilter('conflict') },
          { id: 'ma-dup-review', label: 'مراجعة التشابه', isActive: activeFilter === 'review', onAction: () => setActiveFilter('review') },
          { id: 'ma-dup-batch', label: 'إجراءات جماعية', isActive: showBulkOps, onAction: () => setShowBulkOps((v) => !v) },
        );
      } else if (activeSubTab === 'categories') {
        actions.push(
          { id: 'ma-cat-manage', label: 'إدارة الفئات', isActive: categoryControlOpen, onAction: () => setCategoryControlOpen((v) => !v) },
          { id: 'ma-cat-unclassified', label: 'عرض غير المصنف', isActive: activeFilter === 'needs-link', onAction: () => setActiveFilter('needs-link') },
          { id: 'ma-cat-all', label: 'كل المصنف', isActive: activeFilter === 'all', onAction: () => setActiveFilter('all') },
          { id: 'ma-cat-batch', label: 'ربط المحدد بفئة', isActive: showBulkOps, onAction: () => setShowBulkOps((v) => !v) },
        );
      } else if (activeSubTab === 'substitutions') {
        actions.push(
          { id: 'ma-sub-candidates', label: 'عرض المرشحين', isActive: activeFilter === 'all', onAction: () => setActiveFilter('all') },
          { id: 'ma-sub-conflict', label: 'عرض التعارضات', isActive: activeFilter === 'conflict', onAction: () => setActiveFilter('conflict') },
        );
      } else if (activeSubTab === 'visibility-policy') {
        actions.push(
          { id: 'ma-vis-active', label: 'ظاهر للعميل', isActive: activeFilter === 'active', onAction: () => setActiveFilter('active') },
          { id: 'ma-vis-hidden', label: 'عرض المخفي', isActive: activeFilter === 'review', onAction: () => setActiveFilter('review') },
        );
      }
    } else if (activeTab === 'publishing') {
      actions.push(
        { id: 'ma-pub-ready', label: 'الجاهز للنشر', isActive: activeSubTab === 'ready', onAction: () => setActiveSubTab('ready') },
        { id: 'ma-pub-visible', label: 'ظاهر للعميل', isActive: activeSubTab === 'client-visible', onAction: () => setActiveSubTab('client-visible') },
        { id: 'ma-pub-hidden', label: 'المخفي', isActive: activeSubTab === 'hidden', onAction: () => setActiveSubTab('hidden') },
        { id: 'ma-pub-approve', label: 'اعتماد الجاهز', isActive: showBulkOps && activeSubTab === 'ready', onAction: () => { setActiveSubTab('ready'); setShowBulkOps(true); } },
      );
    } else if (activeTab === 'approvals') {
      if (activeSubTab === 'marketing') {
        actions.push(
          { id: 'ma-appr-batch', label: 'اعتماد الدفعة', isActive: showBulkOps, onAction: () => setShowBulkOps((v) => !v) },
          { id: 'ma-appr-partner', label: 'عرض استثناءات الشريك', isActive: activeFilter === 'partner', onAction: () => setActiveFilter('partner') },
        );
      } else if (activeSubTab === 'quality') {
        actions.push(
          { id: 'ma-qa-images', label: 'مراجعة الصور', isActive: activeFilter === 'needs-image', onAction: () => setActiveFilter('needs-image') },
          { id: 'ma-qa-review', label: 'بانتظار الجودة', isActive: activeFilter === 'review', onAction: () => setActiveFilter('review') },
        );
      } else if (activeSubTab === 'barcode') {
        actions.push(
          { id: 'ma-bc-conflict', label: 'حل تعارض الباركود', isActive: activeFilter === 'conflict', onAction: () => setActiveFilter('conflict') },
          { id: 'ma-bc-match', label: 'مطابقة بالمعرف', isActive: activeFilter === 'needs-link', onAction: () => setActiveFilter('needs-link') },
        );
      } else if (activeSubTab === 'media') {
        actions.push(
          { id: 'ma-media-missing', label: 'يحتاج صورة', isActive: activeFilter === 'needs-image', onAction: () => setActiveFilter('needs-image') },
          { id: 'ma-media-partner', label: 'صور الشريك', isActive: activeFilter === 'partner', onAction: () => setActiveFilter('partner') },
        );
      } else if (activeSubTab === 'pricing') {
        actions.push(
          { id: 'ma-price-conflict', label: 'تعارض السعر', isActive: activeFilter === 'conflict', onAction: () => setActiveFilter('conflict') },
          { id: 'ma-price-partner', label: 'استثناءات التسعير', isActive: activeFilter === 'partner', onAction: () => setActiveFilter('partner') },
        );
      }
    } else if (activeTab === 'catalog') {
      actions.push(
        { id: 'ma-cat-master', label: 'عرض المركزي', isActive: activeFilter === 'master', onAction: () => setActiveFilter('master') },
        { id: 'ma-cat-exceptions', label: 'عرض الاستثناءات', isActive: activeFilter === 'partner', onAction: () => setActiveFilter('partner') },
        { id: 'ma-cat-needs-review', label: 'يحتاج مراجعة', isActive: activeFilter === 'review', onAction: () => setActiveFilter('review') },
      );
    } else if (activeTab === 'intake') {
      actions.push(
        { id: 'ma-intake-quick', label: 'إدخال سريع', isActive: activeSubTab === 'quick', onAction: () => setActiveSubTab('quick') },
        { id: 'ma-intake-partner', label: 'مقترح الشريك', isActive: activeSubTab === 'partner', onAction: () => setActiveSubTab('partner') },
        { id: 'ma-intake-field', label: 'المسح الميداني', isActive: activeSubTab === 'field', onAction: () => setActiveSubTab('field') },
      );
    }
    return actions;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, activeSubTab, activeFilter, showBulkOps]);

  const renderColHeader = (colId: CatalogFilterColumnId, title: string, width?: string) => (
    <th style={{ padding: '6px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right', width, position: 'relative' }}>
       <button
          type="button"
          style={{ appearance: 'none', border: 'none', background: 'transparent', padding: 0, font: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '4px', cursor: 'pointer' }}
          onClick={(e) => { e.stopPropagation(); setOpenFilterCol(openFilterCol === colId ? null : colId); }}
       >
          <span style={{ color: theme.textMuted }}>{title}</span>
          <span style={{ color: colFilters[colId]?.length > 0 ? theme.brand : theme.lineStrong, fontSize: 10 }}>▼</span>
       </button>
       {openFilterCol === colId && (
         <FilterDropdown
            title={title}
            options={filterOptions[colId as keyof typeof filterOptions] || []}
            selected={colFilters[colId]}
          onChange={(val) => setColFilters(prev => ({ ...prev, [colId]: val }))}
            onClose={() => setOpenFilterCol(null)}
         />
       )}
    </th>
  );

  return (
    <div className={styles.surfaceCockpit}>
      {/* 1. Header Area - Catalog Command Deck */}
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box
            radiusToken="sm"
            elevationToken="raised"
            align="center"
            justify="center"
            style={{ width: 32, height: 32, backgroundColor: theme.brandHeaderBackground }}
          >
            <Text style={{ color: theme.textInverse, fontSize: 16 }}>⌗</Text>
          </Box>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle} style={{ letterSpacing: -0.18 }}>كتالوج DSH</h1>
              <Box paddingX={1} paddingY={1} background="brandSurface" radiusToken="xs">
                 <span className={styles.surfaceHeaderBadgeText}>حوكمة الماستر</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>إدارة المنتجات والفئات ومخاطر التبني عبر الأسطح</p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            {[
              { label: 'إجمالي المنتجات', value: '١٤,٥٨٢' },
              { label: 'بانتظار اعتماد', value: '١٢٤' },
              { label: 'تعارضات النشاط', value: '٨', tone: 'danger' }
            ].map((m) => (
              <div key={m.label} className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>{m.label}</span>
                <span className={m.tone === 'danger' ? `${styles.commandKpiValue} ${styles.commandKpiValueAlert}` : styles.commandKpiValue}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Three-Layer Unified Compact Control Strip */}
      <Surface
        tone="inset"
        padding={2}
        gap={2}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: theme.line,
          backgroundColor: theme.surface,
          flexShrink: 0,
        }}
      >
        {/* Layer 1: Primary Compact Tabs */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {PRIMARY_TABS.map((tab) => {
            const isSelected = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedProductId(null);
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? theme.brandHeaderBackground : theme.surfaceInset,
                  color: isSelected ? theme.textInverse : theme.textMuted,
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Layer 2: Context Sub-tabs */}
        {SECONDARY_TABS[activeTab] && SECONDARY_TABS[activeTab].length > 0 && (
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none', msOverflowStyle: 'none', borderTop: `1px solid ${theme.line}`, paddingTop: '6px' }}>
            {SECONDARY_TABS[activeTab].map((sub) => {
              const isSelected = sub.id === activeSubTab;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubTab(sub.id)}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 600,
                    border: `1px solid ${isSelected ? theme.brand : 'transparent'}`,
                    cursor: 'pointer',
                    backgroundColor: isSelected ? theme.brandSurface : 'transparent',
                    color: isSelected ? theme.brand : theme.textMuted,
                    transition: 'all 0.12s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Layer 3: Smart Filters, Search, Category Selector & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: `1px solid ${theme.line}`, paddingTop: '6px' }}>
          {/* Sub-row 1: Search & Category selector */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', flex: 1 }}>
              <div style={{ width: '220px' }}>
                <SearchField placeholder="بحث شامل بالمنتج أو الباركود..." value={searchQuery} onChangeText={setSearchQuery} />
              </div>
              {(activeTab === 'all' || activeTab === 'catalog') && (
                <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', alignItems: 'center' }}>
                  <Text role="caption" numberOfLines={1} style={{ fontSize: 10, fontWeight: 800, color: theme.textMuted }}>الفئة:</Text>
                  <button
                    onClick={() => handleMainCategorySelect(null)}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: 600,
                      border: `1px solid ${!activeMainCategory ? theme.brand : theme.lineStrong}`,
                      cursor: 'pointer',
                      backgroundColor: !activeMainCategory ? theme.brandSurface : theme.surface,
                      color: !activeMainCategory ? theme.brand : theme.textMuted,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    الكل
                  </button>
                  {effectiveCategories.map(cat => {
                    const isSelected = activeMainCategory?.id === cat.id;
                    const isHidden = hiddenCategoryIds.has(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleMainCategorySelect(cat)}
                        title={isHidden ? 'مخفي (معاينة)' : undefined}
                        style={{
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '10px',
                          fontWeight: 600,
                          border: `1px solid ${isSelected ? theme.brand : theme.lineStrong}`,
                          cursor: 'pointer',
                          backgroundColor: isSelected ? theme.brandSurface : theme.surface,
                          color: isSelected ? theme.brand : theme.textMuted,
                          whiteSpace: 'nowrap',
                          opacity: isHidden ? 0.5 : 1,
                        }}
                      >
                        {cat.emojiFallback} {cat.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <Button
                label={showBulkOps ? "إغلاق الإجراءات" : "إجراءات جماعية"}
                tone={showBulkOps ? "brand" : "secondary"}
                size="sm"
                onPress={() => setShowBulkOps(!showBulkOps)}
                style={{ paddingVertical: 2, paddingHorizontal: 8 }}
              />
            </div>
          </div>

          {/* Sub-row 2: Smart Filters chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            <Text role="caption" numberOfLines={1} style={{ fontSize: 10, fontWeight: 800, color: theme.textMuted }}>تصفية ذكية:</Text>
            {[
              { id: 'all', label: 'الكل' },
              { id: 'active', label: 'نشط' },
              { id: 'review', label: 'مراجعة' },
              { id: 'conflict', label: 'تعارض' },
              { id: 'master', label: 'مركزي' },
              { id: 'partner', label: 'شريك' },
              { id: 'needs-link', label: 'يحتاج ربط' },
              { id: 'needs-image', label: 'يحتاج صورة' },
            ].map(f => {
              const isSelected = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as FilterType)}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: 600,
                    border: `1px solid ${isSelected ? theme.brand : theme.lineStrong}`,
                    cursor: 'pointer',
                    backgroundColor: isSelected ? theme.brandSurface : theme.surface,
                    color: isSelected ? theme.brand : theme.textMuted,
                    transition: 'all 0.12s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Sub-row 3: Contextual Micro Action Strip — no tab label repetition */}
          {microActions.length > 0 && (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap', borderTop: `1px solid ${theme.line}`, paddingTop: '6px' }}>
              <Text role="caption" numberOfLines={1} style={{ fontSize: 10, fontWeight: 800, color: theme.textMuted }}>إجراء:</Text>
              {microActions.map((action) => {
                const isActive = action.isActive;
                return (
                  <button
                    key={action.id}
                    onClick={action.onAction}
                    aria-label={action.label}
                    style={{
                      padding: '2px 10px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 700,
                      border: `1px solid ${isActive ? theme.brand : theme.line}`,
                      cursor: 'pointer',
                      backgroundColor: isActive ? theme.brandSurface : theme.surfaceInset,
                      color: isActive ? theme.brand : theme.brandHeaderBackground,
                      transition: 'all 0.12s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Surface>

      {/* Current Context Crumb Box */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', backgroundColor: theme.surfaceInset, borderBottom: `1px solid ${theme.line}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Text role="caption" tone="muted" style={{ fontSize: 10 }}>الكتالوج</Text>
          <Text role="caption" tone="muted" style={{ fontSize: 10 }}>›</Text>
          <Text role="caption" style={{ fontSize: 10, color: theme.brand, fontWeight: 700 }}>{PRIMARY_TABS.find(t => t.id === activeTab)?.label}</Text>
          {SECONDARY_TABS[activeTab]?.find(s => s.id === activeSubTab)?.label && (
            <>
              <Text role="caption" tone="muted" style={{ fontSize: 10 }}>›</Text>
              <Text role="caption" style={{ fontSize: 10, color: theme.brand, fontWeight: 700 }}>{SECONDARY_TABS[activeTab].find(s => s.id === activeSubTab)?.label}</Text>
            </>
          )}
          {activeFilter !== 'all' && (
            <>
              <Text role="caption" tone="muted" style={{ fontSize: 10 }}>›</Text>
              <Text role="caption" style={{ fontSize: 10, color: theme.brand, fontWeight: 700 }}>
                {
                  ([
                    { id: 'all', label: 'الكل' },
                    { id: 'active', label: 'نشط' },
                    { id: 'review', label: 'مراجعة' },
                    { id: 'conflict', label: 'تعارض' },
                    { id: 'master', label: 'مركزي' },
                    { id: 'partner', label: 'شريك' },
                    { id: 'needs-link', label: 'يحتاج ربط' },
                    { id: 'needs-image', label: 'يحتاج صورة' },
                  ].find(f => f.id === activeFilter)?.label)
                }
              </Text>
            </>
          )}
          <Text role="caption" tone="muted" style={{ fontSize: 10, marginRight: 8 }}>
            ({filteredProducts.length} منتج)
          </Text>
        </div>

        {/* Clear Filters indicator & trigger */}
        {(activeFilter !== 'all' || searchQuery !== '' || activeColFiltersCount > 0 || activeMainCategory !== null || activeSubCategory !== null) && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Text role="caption" style={{ fontSize: 10, color: theme.brand }}>
              {`نشط: ${activeColFiltersCount + (activeFilter !== 'all' ? 1 : 0) + (searchQuery !== '' ? 1 : 0) + (activeMainCategory ? 1 : 0)} فلتر`}
            </Text>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
                setColFilters(initialColumnFilters);
                setActiveMainCategory(null);
                setActiveSubCategory(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: theme.danger,
                fontSize: '10px',
                fontWeight: 800,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              ✕ مسح الفلاتر
            </button>
          </div>
        )}
      </div>


      {/* Category Control Room — preview-only, shows when mapping/categories */}
      {activeTab === 'mapping' && activeSubTab === 'categories' && (
        <div style={{
          backgroundColor: theme.surface,
          borderBottom: `1px solid ${theme.line}`,
          flexShrink: 0,
        }}>
          {/* Toggle header */}
          <button
            onClick={() => setCategoryControlOpen((v) => !v)}
            aria-label="تبديل وضع إدارة الفئات"
            style={{
              width: '100%', appearance: 'none', border: 'none',
              backgroundColor: categoryControlOpen ? theme.brandSurface : theme.surfaceInset,
              borderBottom: categoryControlOpen ? `1px solid ${theme.brand}` : 'none',
              padding: '5px 14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: categoryControlOpen ? theme.brand : theme.textMuted }}>
                🏷️ إدارة الفئات
              </span>
              <span style={{ fontSize: '9px', color: theme.warning, fontWeight: 700 }}>
                • معاينة فقط — لا حفظ دائم
              </span>
              <span style={{ fontSize: '9px', color: theme.textMuted }}>
                ({previewCategories.length} فئة • {hiddenCategoryIds.size > 0 ? `${hiddenCategoryIds.size} مخفي` : 'لا مخفي'})
              </span>
            </div>
            <span style={{ fontSize: '9px', color: theme.textMuted }}>{categoryControlOpen ? '▲' : '▼'}</span>
          </button>

          {/* Expanded panel */}
          {categoryControlOpen && (
            <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>

              {/* Error banner */}
              {catError && (
                <div style={{
                  padding: '4px 10px', borderRadius: '4px', backgroundColor: theme.dangerSurface ?? theme.surfaceInset,
                  border: `1px solid ${theme.danger}`, fontSize: '10px', color: theme.danger, fontWeight: 700,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span>{catError}</span>
                  <button onClick={() => setCatError(null)} style={{ appearance: 'none', border: 'none', background: 'none', color: theme.danger, cursor: 'pointer', fontSize: '10px', fontWeight: 900 }}>×</button>
                </div>
              )}

              {/* Action header row */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => { setAddingMainCat(true); setAddingSubUnder(null); setEditingEntry(null); setFormLabel(''); setFormSubtitle(''); setCatError(null); }}
                  aria-label="إضافة فئة رئيسية"
                  style={{
                    padding: '3px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                    border: `1px solid ${theme.brand}`, cursor: 'pointer',
                    backgroundColor: theme.brandSurface, color: theme.brand,
                  }}
                >
                  + فئة رئيسية
                </button>
                <button
                  onClick={handleResetCategoryPreview}
                  aria-label="إعادة ضبط المعاينة"
                  style={{
                    padding: '3px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                    border: `1px solid ${theme.danger}`, cursor: 'pointer',
                    backgroundColor: 'transparent', color: theme.danger,
                  }}
                >
                  ↺ إعادة ضبط المعاينة
                </button>
              </div>

              {/* Add main category form */}
              {addingMainCat && (
                <div style={{
                  padding: '8px 10px', borderRadius: '6px', backgroundColor: theme.surfaceInset,
                  border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '6px',
                }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: theme.brand }}>إضافة فئة رئيسية جديدة</span>
                  <input
                    type="text" placeholder="اسم الفئة *" value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddMainCategory(); if (e.key === 'Escape') { setAddingMainCat(false); setCatError(null); } }}
                    autoFocus
                    style={{
                      padding: '4px 8px', borderRadius: '4px', fontSize: '11px', direction: 'rtl', textAlign: 'right',
                      border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none',
                    }}
                  />
                  <input
                    type="text" placeholder="وصف مختصر (اختياري)" value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    style={{
                      padding: '4px 8px', borderRadius: '4px', fontSize: '11px', direction: 'rtl', textAlign: 'right',
                      border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={handleAddMainCategory} style={{ padding: '3px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: `1px solid ${theme.brand}`, backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>تأكيد</button>
                    <button onClick={() => { setAddingMainCat(false); setFormLabel(''); setFormSubtitle(''); setCatError(null); }} style={{ padding: '3px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                  </div>
                </div>
              )}

              {/* Categories list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {previewCategories.map((cat) => {
                  const isHidden = hiddenCategoryIds.has(cat.id);
                  const isSelectedMain = activeMainCategory?.id === cat.id;
                  const productCount = getProductCountForCategory(cat.id);
                  const isEditingThis = editingEntry?.type === 'main' && editingEntry.mainId === cat.id;

                  return (
                    <div key={cat.id} style={{
                      borderRadius: '6px', border: `1px solid ${isSelectedMain ? theme.brand : theme.line}`,
                      backgroundColor: isHidden ? theme.surfaceInset : (isSelectedMain ? theme.brandSurface : theme.surface),
                      opacity: isHidden ? 0.6 : 1, overflow: 'hidden',
                    }}>
                      {/* Main category row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', gap: '6px' }}>
                        {isEditingThis ? (
                          <div style={{ display: 'flex', flex: 1, gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input
                              type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleApplyCatEdit(); if (e.key === 'Escape') { setEditingEntry(null); setCatError(null); } }}
                              autoFocus
                              style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '11px', direction: 'rtl', border: `1px solid ${theme.brand}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1, minWidth: '80px' }}
                            />
                            <input
                              type="text" value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)} placeholder="وصف"
                              style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '11px', direction: 'rtl', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1, minWidth: '80px' }}
                            />
                            <button onClick={handleApplyCatEdit} style={{ padding: '2px 8px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
                            <button onClick={() => { setEditingEntry(null); setCatError(null); }} style={{ padding: '2px 8px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleMainCategorySelect(isSelectedMain ? null : cat)}
                              style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', flex: 1, textAlign: 'right' }}
                            >
                              <span style={{ fontSize: '13px' }}>{cat.emojiFallback}</span>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: isSelectedMain ? theme.brand : theme.brandHeaderBackground }}>{cat.label}</span>
                                {cat.subtitle && <span style={{ fontSize: '9px', color: theme.textMuted }}>{cat.subtitle}</span>}
                              </div>
                              <span style={{ fontSize: '9px', color: theme.textMuted, marginRight: 'auto', paddingRight: '4px' }}>{productCount} منتج</span>
                            </button>
                            <div style={{ display: 'flex', gap: '3px', alignItems: 'center', flexShrink: 0 }}>
                              <button
                                onClick={() => { setAddingSubUnder(addingSubUnder === cat.id ? null : cat.id); setFormLabel(''); setFormSubtitle(''); setCatError(null); setEditingEntry(null); setAddingMainCat(false); }}
                                aria-label="إضافة فئة فرعية"
                                style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: addingSubUnder === cat.id ? theme.brandSurface : 'transparent', color: addingSubUnder === cat.id ? theme.brand : theme.textMuted }}
                              >+ فرعية</button>
                              <button
                                onClick={() => handleStartCatEdit('main', cat.id)}
                                aria-label="تعديل اسم الفئة"
                                style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}
                              >تعديل</button>
                              <button
                                onClick={() => handleToggleCategoryHide(cat.id)}
                                aria-label={isHidden ? 'استعادة الفئة' : 'إخفاء الفئة'}
                                style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${isHidden ? theme.success : theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: isHidden ? theme.success : theme.textMuted }}
                              >{isHidden ? 'استعادة' : 'إخفاء'}</button>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Add subcategory form */}
                      {addingSubUnder === cat.id && (
                        <div style={{ margin: '0 8px 6px 8px', padding: '6px 8px', borderRadius: '4px', backgroundColor: theme.surfaceInset, border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <span style={{ fontSize: '9px', fontWeight: 800, color: theme.brand }}>إضافة فئة فرعية تحت: {cat.label}</span>
                          <input type="text" placeholder="اسم الفئة الفرعية *" value={formLabel} onChange={(e) => setFormLabel(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubCategory(cat.id); if (e.key === 'Escape') { setAddingSubUnder(null); setCatError(null); } }}
                            autoFocus
                            style={{ padding: '3px 7px', borderRadius: '3px', fontSize: '10px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
                          />
                          <input type="text" placeholder="وصف (اختياري)" value={formSubtitle} onChange={(e) => setFormSubtitle(e.target.value)}
                            style={{ padding: '3px 7px', borderRadius: '3px', fontSize: '10px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
                          />
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button onClick={() => handleAddSubCategory(cat.id)} style={{ padding: '2px 10px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>إضافة</button>
                            <button onClick={() => { setAddingSubUnder(null); setFormLabel(''); setFormSubtitle(''); setCatError(null); }} style={{ padding: '2px 10px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                          </div>
                        </div>
                      )}

                      {/* Subcategories */}
                      {cat.subcategories.length > 0 && (
                        <div style={{ margin: '0 8px 6px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {cat.subcategories.map((sub) => {
                            const subCount = getProductCountForCategory(cat.id, sub.id);
                            const isSelectedSub = activeSubCategory?.id === sub.id;
                            const isEditingThisSub = editingEntry?.type === 'sub' && editingEntry.mainId === cat.id && editingEntry.subId === sub.id;
                            return (
                              <div key={sub.id} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '3px 8px', borderRadius: '4px', gap: '6px',
                                backgroundColor: isSelectedSub ? theme.brandSurface : theme.surfaceInset,
                                border: `1px solid ${isSelectedSub ? theme.brand : 'transparent'}`,
                              }}>
                                {isEditingThisSub ? (
                                  <div style={{ display: 'flex', flex: 1, gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <input type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                                      onKeyDown={(e) => { if (e.key === 'Enter') handleApplyCatEdit(); if (e.key === 'Escape') { setEditingEntry(null); setCatError(null); } }}
                                      autoFocus
                                      style={{ padding: '2px 5px', borderRadius: '3px', fontSize: '10px', direction: 'rtl', border: `1px solid ${theme.brand}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1, minWidth: '60px' }}
                                    />
                                    <input type="text" value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)} placeholder="وصف"
                                      style={{ padding: '2px 5px', borderRadius: '3px', fontSize: '10px', direction: 'rtl', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1, minWidth: '60px' }}
                                    />
                                    <button onClick={handleApplyCatEdit} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
                                    <button onClick={() => { setEditingEntry(null); setCatError(null); }} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                  </div>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => { setActiveSubCategory(isSelectedSub ? null : sub); if (!isSelectedSub) handleMainCategorySelect(cat); }}
                                      style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', flex: 1, textAlign: 'right' }}
                                    >
                                      <span style={{ fontSize: '9px', color: theme.textMuted }}>└</span>
                                      <span style={{ fontSize: '10px', fontWeight: isSelectedSub ? 700 : 500, color: isSelectedSub ? theme.brand : theme.textMuted }}>{sub.label}</span>
                                      <span style={{ fontSize: '9px', color: theme.textMuted, marginRight: 'auto' }}>{subCount}</span>
                                    </button>
                                    <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                                      <button onClick={() => handleStartCatEdit('sub', cat.id, sub.id)} aria-label="تعديل الفئة الفرعية" style={{ padding: '1px 5px', borderRadius: '3px', fontSize: '9px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}>تعديل</button>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. MAIN CONTENT AREA */}
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', height: '100%' }}>
            {activeTab === 'approvals' && activeSubTab === 'marketing' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: theme.surface, overflow: 'hidden', minHeight: 0 }}>
                <CatalogAdoptionQueue />
              </div>
            )}

            {activeTab === 'approvals' && activeSubTab === 'quality' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: theme.surface, overflow: 'hidden', minHeight: 0 }}>
                <ItemApprovalSection />
              </div>
            )}

            {activeTab === 'approvals' && activeSubTab === 'pricing' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: theme.surface, overflow: 'auto', minHeight: 0 }}>
                <CatalogPublishingGateSection />
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'catalog' || activeTab === 'intake' || activeTab === 'mapping' || activeTab === 'publishing' || (activeTab === 'approvals' && (activeSubTab === 'media' || activeSubTab === 'barcode'))) && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: theme.surface, minWidth: 0 }}>
                <div style={{ flex: 1, minHeight: 0, backgroundColor: theme.surface }}>
                   {isManualOrderCategory ? (
                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '48px', opacity: 0.7 }}>
                       <Text role="titleMd" style={{ color: theme.brandHeaderBackground }}>فئة الطلب اليدوي</Text>
                       <Text role="bodySm" tone="muted" style={{ textAlign: 'center', maxWidth: 400, marginTop: 8 }}>
                         المنتجات في هذه الفئة (مثل شي إن، عونك) تُعامل كطلبات مرنة ولا تحتوي على منتجات كتالوج قياسية محددة مسبقاً.
                       </Text>
                     </div>
                   ) : (
                     <div style={{ overflow: 'auto', height: '100%' }}>
                       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ backgroundColor: theme.surfaceInset, borderBottom: `1px solid ${theme.line}` }}>
                              {showBulkOps && <th style={{ width: '36px' }}></th>}
                              <th style={{ width: '48px' }}>صورة</th>
                              {renderColHeader('name', 'المنتج', '20%')}
                              {renderColHeader('category', 'الفئة', '12%')}
                              {renderColHeader('classification', 'التصنيف', '10%')}
                              {renderColHeader('sku', 'المعرف / الباركود', '15%')}
                              {renderColHeader('price', 'السعر', '8%')}
                              {renderColHeader('policy', 'السياسة', '10%')}
                              {renderColHeader('status', 'الحالة', '10%')}
                            </tr>
                          </thead>
                          <tbody>
                            {visibleProducts.map(p => {
                              const cat = previewCategories.find(c => c.id === p.categoryPath.main) ?? dshCatalogCategories.find(c => c.id === p.categoryPath.main);
                              const sub = cat?.subcategories.find(s => s.id === p.categoryPath.sub);
                              const classif = sub?.mainClassifications?.find(c => c.id === p.categoryPath.mainClassification);
                              const resolvedStage = previewApprovalStages[p.id] ?? p.approvalStage;
                              return (
                                <tr
                                  key={p.id}
                                  onClick={() => setSelectedProductId(p.id)}
                                  style={{ borderBottom: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: selectedProductId === p.id ? theme.overlaySoft : 'transparent' }}
                                >
                                  {showBulkOps && (
                                    <td onClick={e => e.stopPropagation()} style={{ padding: '8px' }}>
                                      <input type="checkbox" style={{ accentColor: theme.brandHeaderBackground }} />
                                    </td>
                                  )}
                                  <td style={{ padding: '8px' }}>
                                     <WatermarkedImage src={p.imageUri} mediaKey={p.mediaKey} fallback={p.emojiFallback} size={32} productName={p.name} />
                                  </td>
                                  <td style={{ padding: '8px' }}>
                                     <Text role="caption" style={{ fontWeight: 800, color: theme.brandHeaderBackground }}>{p.name}</Text>
                                  </td>
                                  <td style={{ padding: '8px' }}>
                                    <Text role="caption" tone="muted" style={{ fontSize: 10 }}>{cat?.label}</Text>
                                  </td>
                                  <td style={{ padding: '8px' }}>
                                    <Text role="caption" tone="muted" style={{ fontSize: 10 }}>{classif?.label || 'عام'}</Text>
                                  </td>
                                  <td style={{ padding: '8px' }}>
                                    <Text role="caption" tone="muted" style={{ fontFamily: 'monospace', fontSize: 10 }}>{p.sku}</Text>
                                  </td>
                                  <td style={{ padding: '8px' }}>
                                    <Text role="caption" style={{ color: theme.brandHeaderBackground, fontWeight: 700 }}>{p.price}</Text>
                                  </td>
                                  <td style={{ padding: '8px' }}>
                                    <PolicyBadge mediaPolicy={p.mediaPolicy} />
                                  </td>
                                  <td style={{ padding: '8px' }}>
                                     <WebControlPanelStatusTag
                                       label={p.conflictReason ? 'تعارض' : resolvedStage === 'client-visible' ? 'نشط' : resolvedStage === 'catalog-approved' ? 'معتمد' : resolvedStage === 'marketing-review' ? 'تسويق' : 'مراجعة'}
                                       tone={p.conflictReason ? 'danger' : resolvedStage === 'client-visible' ? 'success' : resolvedStage === 'catalog-approved' ? 'success' : resolvedStage === 'marketing-review' ? 'warning' : 'warning'}
                                     />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                       </table>
                     </div>
                   )}
                </div>

                {!isManualOrderCategory ? (
                  <div style={{ padding: '10px 16px 12px', borderTop: `1px solid ${theme.line}`, backgroundColor: theme.surface }}>
                    <WebControlPanelCompactPager
                      page={catalogPage}
                      totalPages={catalogTotalPages}
                      onPrevious={() => setCatalogPage(p => Math.max(1, p - 1))}
                      onNext={() => setCatalogPage(p => Math.min(catalogTotalPages, p + 1))}
                    />
                  </div>
                ) : null}
              </div>
            )}

            {/* Inspector Panel */}
            {(activeTab === 'all' || activeTab === 'catalog' || activeTab === 'intake' || activeTab === 'mapping' || activeTab === 'publishing' || (activeTab === 'approvals' && (activeSubTab === 'media' || activeSubTab === 'barcode'))) && selectedProductId && selectedProduct && (
              <div style={{ width: 320, borderRight: `1px solid ${theme.line}`, backgroundColor: theme.surfaceInset, display: 'flex', flexDirection: 'column' }}>
                 <Box padding={3} background="surfaceRaised" style={{ borderBottomWidth: 1, borderBottomColor: theme.line }} layoutDirection="row" justify="space-between" align="center">
                    <Text role="bodyStrong" style={{ fontSize: 14 }}>تفاصيل المنتج</Text>
                    <Button label="✕" accessibilityLabel="إغلاق" tone="secondary" size="sm" onPress={() => setSelectedProductId(null)} />
                 </Box>
                 <Box gap={3} padding={3} style={{ flex: 1 }}>
                    {/* Image + name header */}
                    <Box layoutDirection="row" gap={3} align="center">
                       <WatermarkedImage src={selectedProduct.imageUri} mediaKey={selectedProduct.mediaKey} productName={selectedProduct.name} size={48} />
                       <Box style={{ flex: 1 }} gap={0}>
                          <Text role="bodyStrong" style={{ fontSize: 13 }}>{selectedProduct.name}</Text>
                          <Text role="caption" tone="muted" style={{ fontSize: 10 }}>المعرف: {selectedProduct.sku}</Text>
                       </Box>
                    </Box>

                    <InspectorTile title="تسلسل الفئة (Path)">
                       <Text role="caption" style={{ fontSize: 10, color: theme.textMuted, lineHeight: 14, textAlign: 'right' }}>
                         {(previewCategories.find(c => c.id === selectedProduct.categoryPath.main) ?? dshCatalogCategories.find(c => c.id === selectedProduct.categoryPath.main))?.label || 'غير معروف'}
                         {selectedProduct.categoryPath.sub && ` > ${(previewCategories.find(c => c.id === selectedProduct.categoryPath.main) ?? dshCatalogCategories.find(c => c.id === selectedProduct.categoryPath.main))?.subcategories.find(s => s.id === selectedProduct.categoryPath.sub)?.label}`}
                       </Text>
                    </InspectorTile>

                    <InspectorTile title="الحالة">
                       <div style={{  gridTemplateColumns: '1fr', gap: '4px' }}>
                          <MiniInfoBox label="العميل" value={selectedProduct.approvalStage === 'client-visible' ? 'مرئي' : 'مخفي'} valueColor={selectedProduct.approvalStage === 'client-visible' ? theme.success : theme.textMuted} isBoldValue />
                          <MiniInfoBox label="الشريك" value="متاح" />
                       </div>
                    </InspectorTile>

                    {selectedProduct.conflictReason && (
                       <InspectorTile title="تعارض" warning>
                          <Text role="caption" style={{ color: theme.danger, fontSize: 10 }}>{selectedProduct.conflictReason}</Text>
                       </InspectorTile>
                    )}

                    <Box gap={2} style={{ marginTop: 'auto' }}>
                       <Button label="معاينة الاعتماد" tone="primary" size="sm" fullWidth />
                       <Button label="معاينة إحالة للتسويق" tone="secondary" size="sm" fullWidth />
                    </Box>
                 </Box>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshCatalogScreen;
