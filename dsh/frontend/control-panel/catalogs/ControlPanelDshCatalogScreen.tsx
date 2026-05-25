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
  CatalogMediaPolicy,
  CatalogApprovalStage,
} from './catalog';
import { resolveDshImageSource } from '../../shared/resolve-dsh-image-source';
import styles from '../shared/control-panel-surface.module.css';

// Helper to recursively filter the Category & Classification Tree
function filterCategoryTree(categories: CatalogMainCategory[], query: string): CatalogMainCategory[] {
  if (!query) return categories;
  const q = query.toLowerCase().trim();
  return categories.map(cat => {
    const catMatches = cat.label.toLowerCase().includes(q) || (cat.subtitle?.toLowerCase().includes(q) ?? false);
    const filteredSubs = cat.subcategories.map(sub => {
      const subMatches = sub.label.toLowerCase().includes(q) || (sub.subtitle?.toLowerCase().includes(q) ?? false);
      const filteredMainClassifs = (sub.mainClassifications || []).map(mc => {
        const mcMatches = mc.label.toLowerCase().includes(q);
        const filteredSubClassifs = (mc.subClassifications || []).filter(sc => {
          return sc.label.toLowerCase().includes(q);
        });
        if (mcMatches || filteredSubClassifs.length > 0) {
          return { ...mc, subClassifications: filteredSubClassifs };
        }
        return null;
      }).filter(Boolean) as any[];

      if (subMatches || filteredMainClassifs.length > 0) {
        return { ...sub, mainClassifications: filteredMainClassifs };
      }
      return null;
    }).filter(Boolean) as any[];

    if (catMatches || filteredSubs.length > 0) {
      return { ...cat, subcategories: filteredSubs };
    }
    return null;
  }).filter(Boolean) as CatalogMainCategory[];
}

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

// Removed duplicate sub-page imports for unified main table rendering

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

  // Real interactive products list state initialized from mock data
  const [products, setProducts] = useState<CatalogProductMaster[]>(() => dshCatalogProducts);

  // Modals state for Add / Edit Product
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalForm, setModalForm] = useState<{
    id: string;
    name: string;
    sku: string;
    gtin: string;
    price: number;
    mainCat: string;
    subCat: string;
    mainClassif: string;
    subClassif: string;
    mediaPolicy: CatalogMediaPolicy;
    approvalStage: CatalogApprovalStage;
    imageUri: string;
    mediaKey: string;
  }>({
    id: '',
    name: '',
    sku: '',
    gtin: '',
    price: 10,
    mainCat: 'grocery',
    subCat: '',
    mainClassif: '',
    subClassif: '',
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'catalog-draft',
    imageUri: '',
    mediaKey: '',
  });

  // ── Category Control Room State (Preview-Only) ────────────────────
  const [previewCategories, setPreviewCategories] = useState<CatalogMainCategory[]>(
    () => dshCatalogCategories.map((c) => ({
      ...c,
      subcategories: c.subcategories.map(sub => ({
        ...sub,
        mainClassifications: sub.mainClassifications ? sub.mainClassifications.map(mc => ({
          ...mc,
          subClassifications: mc.subClassifications ? [...mc.subClassifications] : []
        })) : []
      }))
    }))
  );

  const [hiddenCategoryIds, setHiddenCategoryIds] = useState<ReadonlySet<string>>(new Set());
  const [hiddenSubCategoryIds, setHiddenSubCategoryIds] = useState<ReadonlySet<string>>(new Set());
  const [categoryControlOpen, setCategoryControlOpen] = useState(false);
  const [addingMainCat, setAddingMainCat] = useState(false);
  const [addingSubUnder, setAddingSubUnder] = useState<string | null>(null);
  const [addingMainClassifUnder, setAddingMainClassifUnder] = useState<{ mainId: string; subId: string } | null>(null);
  const [addingSubClassifUnder, setAddingSubClassifUnder] = useState<{ mainId: string; subId: string; mainClassifId: string } | null>(null);

  const [formLabel, setFormLabel] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [catError, setCatError] = useState<string | null>(null);

  type CatEditEntry = {
    type: 'main' | 'sub' | 'mainClassif' | 'subClassif';
    mainId: string;
    subId?: string;
    mainClassifId?: string;
    subClassifId?: string;
  };
  const [editingEntry, setEditingEntry] = useState<CatEditEntry | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');

  // Classification filters on main view
  const [activeMainClassifId, setActiveMainClassifId] = useState<string | null>(null);
  const [activeSubClassifId, setActiveSubClassifId] = useState<string | null>(null);

  const [selectedTaxonomyNode, setSelectedTaxonomyNode] = useState<{
    type: 'main' | 'sub' | 'mainClassif' | 'subClassif';
    mainId: string;
    subId?: string;
    mainClassifId?: string;
    subClassifId?: string;
  } | null>(null);

  // Collapse/Expand state for central taxonomy tree
  const [expandedMainCategoryIds, setExpandedMainCategoryIds] = useState<ReadonlySet<string>>(new Set());
  const [expandedSubCategoryIds, setExpandedSubCategoryIds] = useState<ReadonlySet<string>>(new Set());
  const [expandedMainClassifIds, setExpandedMainClassifIds] = useState<ReadonlySet<string>>(new Set());

  // Search filter for taxonomy tree
  const [treeSearchQuery, setTreeSearchQuery] = useState('');

  // Hover state to eliminate action button clutter
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    return filterCategoryTree(previewCategories, treeSearchQuery);
  }, [previewCategories, treeSearchQuery]);

  const toggleMainCategoryExpand = (id: string) => {
    setExpandedMainCategoryIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSubCategoryExpand = (id: string) => {
    setExpandedSubCategoryIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleMainClassifExpand = (id: string) => {
    setExpandedMainClassifIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const PRIMARY_TABS = [
    { id: 'all', label: 'الكل' },
    { id: 'catalog', label: 'السجل الرئيسي' },
    { id: 'taxonomy', label: 'شجرة الفئات والتصنيفات' },
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
    taxonomy: [],
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
    setActiveMainClassifId(null);
    setActiveSubClassifId(null);
    setSelectedProductId(null);
  };

  const handleSubCategorySelect = (sub: CatalogSubCategory | null) => {
    setActiveSubCategory(sub);
    setActiveMainClassifId(null);
    setActiveSubClassifId(null);
    setSelectedProductId(null);
  };

  // ── Category Control Room Handlers (Preview-Only) ────────────────
  const effectiveCategories = useMemo(
    () => previewCategories.filter((c) => !hiddenCategoryIds.has(c.id)),
    [previewCategories, hiddenCategoryIds]
  );

  const getProductCountForCategory = React.useCallback(
    (mainId: string, subId?: string): number =>
      products.filter(
        (p) => p.categoryPath.main === mainId && (subId ? p.categoryPath.sub === subId : true)
      ).length,
      [products]
  );

  const checkDuplicateName = (label: string, list: { label: string }[]) => {
    return list.some((item) => item.label.trim().toLowerCase() === label.trim().toLowerCase());
  };

  const handleAddMainCategory = React.useCallback(() => {
    const label = formLabel.trim();
    if (!label) { setCatError('الاسم مطلوب'); return; }
    if (checkDuplicateName(label, previewCategories)) { setCatError('هذا الاسم موجود مسبقاً'); return; }
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
    const parentCat = previewCategories.find(c => c.id === parentId);
    if (parentCat && checkDuplicateName(label, parentCat.subcategories)) {
      setCatError('اسم مكرر في هذه الفئة الفرعية'); return;
    }
    setPreviewCategories((prev) => prev.map((cat) => {
      if (cat.id !== parentId) return cat;
      const id = `subcat-preview-${label.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
      return { ...cat, subcategories: [...cat.subcategories, { id, label, subtitle: formSubtitle.trim(), mainClassifications: [] }] };
    }));
    setFormLabel(''); setFormSubtitle(''); setAddingSubUnder(null); setCatError(null);
  }, [formLabel, formSubtitle, previewCategories]);

  const handleAddMainClassification = React.useCallback((mainId: string, subId: string) => {
    const label = formLabel.trim();
    if (!label) { setCatError('الاسم مطلوب'); return; }
    const parentCat = previewCategories.find(c => c.id === mainId);
    const parentSub = parentCat?.subcategories.find(s => s.id === subId);
    if (parentSub && checkDuplicateName(label, parentSub.mainClassifications || [])) {
      setCatError('اسم تصنيف رئيسي مكرر في هذه الفئة الفرعية'); return;
    }
    setPreviewCategories((prev) => prev.map((cat) => {
      if (cat.id !== mainId) return cat;
      return {
        ...cat,
        subcategories: cat.subcategories.map(sub => {
          if (sub.id !== subId) return sub;
          const id = `classif-main-${subId}-${Date.now()}`;
          return {
            ...sub,
            mainClassifications: [...(sub.mainClassifications || []), { id, label, subClassifications: [] }]
          };
        })
      };
    }));
    setFormLabel(''); setFormSubtitle(''); setAddingMainClassifUnder(null); setCatError(null);
  }, [formLabel, previewCategories]);

  const handleAddSubClassification = React.useCallback((mainId: string, subId: string, mainClassifId: string) => {
    const label = formLabel.trim();
    if (!label) { setCatError('الاسم مطلوب'); return; }
    const parentCat = previewCategories.find(c => c.id === mainId);
    const parentSub = parentCat?.subcategories.find(s => s.id === subId);
    const parentClassif = parentSub?.mainClassifications?.find(c => c.id === mainClassifId);
    if (parentClassif && checkDuplicateName(label, parentClassif.subClassifications || [])) {
      setCatError('اسم تصنيف فرعي مكرر في هذا التصنيف الرئيسي'); return;
    }
    setPreviewCategories((prev) => prev.map((cat) => {
      if (cat.id !== mainId) return cat;
      return {
        ...cat,
        subcategories: cat.subcategories.map(sub => {
          if (sub.id !== subId) return sub;
          return {
            ...sub,
            mainClassifications: (sub.mainClassifications || []).map(mc => {
              if (mc.id !== mainClassifId) return mc;
              const id = `classif-sub-${mainClassifId}-${Date.now()}`;
              return {
                ...mc,
                subClassifications: [...(mc.subClassifications || []), { id, label }]
              };
            })
          };
        })
      };
    }));
    setFormLabel(''); setFormSubtitle(''); setAddingSubClassifUnder(null); setCatError(null);
  }, [formLabel, previewCategories]);

  const handleToggleCategoryHide = React.useCallback((id: string) => {
    setHiddenCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next as ReadonlySet<string>;
    });
  }, []);

  const handleToggleSubCategoryHide = React.useCallback((id: string) => {
    setHiddenSubCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next as ReadonlySet<string>;
    });
  }, []);

  const handleDeleteNode = React.useCallback((
    type: 'main' | 'sub' | 'mainClassif' | 'subClassif',
    mainId: string,
    subId?: string,
    mainClassifId?: string,
    subClassifId?: string
  ) => {
    setPreviewCategories((prev) => {
      if (type === 'main') {
        return prev.filter(c => c.id !== mainId);
      } else if (type === 'sub') {
        return prev.map(c => c.id === mainId ? { ...c, subcategories: c.subcategories.filter(s => s.id !== subId) } : c);
      } else if (type === 'mainClassif') {
        return prev.map(c => c.id === mainId ? {
          ...c,
          subcategories: c.subcategories.map(sub => sub.id === subId ? {
            ...sub,
            mainClassifications: (sub.mainClassifications || []).filter(mc => mc.id !== mainClassifId)
          } : sub)
        } : c);
      } else {
        return prev.map(c => c.id === mainId ? {
          ...c,
          subcategories: c.subcategories.map(sub => sub.id === subId ? {
            ...sub,
            mainClassifications: (sub.mainClassifications || []).map(mc => mc.id === mainClassifId ? {
              ...mc,
              subClassifications: (mc.subClassifications || []).filter(sc => sc.id !== subClassifId)
            } : mc)
          } : sub)
        } : c);
      }
    });

    // Clean up product links to deleted items
    setProducts((prevProducts) => prevProducts.map((p) => {
      const path = { ...p.categoryPath };
      let updated = false;

      if (type === 'main' && path.main === mainId) {
        path.main = 'grocery';
        path.sub = undefined;
        path.mainClassification = undefined;
        path.subClassification = undefined;
        updated = true;
      } else if (type === 'sub' && path.main === mainId && path.sub === subId) {
        path.sub = undefined;
        path.mainClassification = undefined;
        path.subClassification = undefined;
        updated = true;
      } else if (type === 'mainClassif' && path.mainClassification === mainClassifId) {
        path.mainClassification = undefined;
        path.subClassification = undefined;
        updated = true;
      } else if (type === 'subClassif' && path.subClassification === subClassifId) {
        path.subClassification = undefined;
        updated = true;
      }

      return updated ? { ...p, categoryPath: path } : p;
    }));

    // Reset filtering selectors if currently filtered by deleted items
    if (type === 'main' && activeMainCategory?.id === mainId) {
      setActiveMainCategory(null);
      setActiveSubCategory(null);
      setActiveMainClassifId(null);
      setActiveSubClassifId(null);
    } else if (type === 'sub' && activeSubCategory?.id === subId) {
      setActiveSubCategory(null);
      setActiveMainClassifId(null);
      setActiveSubClassifId(null);
    } else if (type === 'mainClassif' && activeMainClassifId === mainClassifId) {
      setActiveMainClassifId(null);
      setActiveSubClassifId(null);
    } else if (type === 'subClassif' && activeSubClassifId === subClassifId) {
      setActiveSubClassifId(null);
    }

    setEditingEntry(null);
    setCatError(null);
  }, [activeMainCategory, activeSubCategory, activeMainClassifId, activeSubClassifId]);

  const handleResetCategoryPreview = React.useCallback(() => {
    setPreviewCategories(
      dshCatalogCategories.map((c) => ({
        ...c,
        subcategories: c.subcategories.map(sub => ({
          ...sub,
          mainClassifications: sub.mainClassifications ? sub.mainClassifications.map(mc => ({
            ...mc,
            subClassifications: mc.subClassifications ? [...mc.subClassifications] : []
          })) : []
        }))
      }))
    );
    setHiddenCategoryIds(new Set());
    setHiddenSubCategoryIds(new Set());
    setAddingMainCat(false);
    setAddingSubUnder(null);
    setAddingMainClassifUnder(null);
    setAddingSubClassifUnder(null);
    setFormLabel('');
    setFormSubtitle('');
    setCatError(null);
    setEditingEntry(null);
    setActiveMainClassifId(null);
    setActiveSubClassifId(null);
  }, []);

  const handleStartCatEdit = React.useCallback((
    type: 'main' | 'sub' | 'mainClassif' | 'subClassif',
    mainId: string,
    subId?: string,
    mainClassifId?: string,
    subClassifId?: string
  ) => {
    const cat = previewCategories.find((c) => c.id === mainId);
    if (!cat) return;
    if (type === 'main') {
      setEditLabel(cat.label);
      setEditSubtitle(cat.subtitle);
    } else if (type === 'sub') {
      const sub = cat.subcategories.find((s) => s.id === subId);
      if (!sub) return;
      setEditLabel(sub.label);
      setEditSubtitle(sub.subtitle);
    } else if (type === 'mainClassif') {
      const sub = cat.subcategories.find((s) => s.id === subId);
      const classif = sub?.mainClassifications?.find(c => c.id === mainClassifId);
      if (!classif) return;
      setEditLabel(classif.label);
      setEditSubtitle('');
    } else {
      const sub = cat.subcategories.find((s) => s.id === subId);
      const classif = sub?.mainClassifications?.find(c => c.id === mainClassifId);
      const subc = classif?.subClassifications?.find(s => s.id === subClassifId);
      if (!subc) return;
      setEditLabel(subc.label);
      setEditSubtitle('');
    }
    setEditingEntry({ type, mainId, subId, mainClassifId, subClassifId });
    setCatError(null);
    setAddingMainCat(false);
    setAddingSubUnder(null);
    setAddingMainClassifUnder(null);
    setAddingSubClassifUnder(null);
  }, [previewCategories]);

  const handleApplyCatEdit = React.useCallback(() => {
    if (!editingEntry) return;
    const label = editLabel.trim();
    if (!label) { setCatError('الاسم مطلوب'); return; }

    let clashing = false;

    setPreviewCategories((prev) => {
      if (editingEntry.type === 'main') {
        if (prev.some((c) => c.id !== editingEntry.mainId && c.label.trim().toLowerCase() === label.toLowerCase())) {
          clashing = true; return prev;
        }
        return prev.map((c) => c.id === editingEntry.mainId ? { ...c, label, subtitle: editSubtitle.trim() } : c);
      } else if (editingEntry.type === 'sub') {
        return prev.map((cat) => {
          if (cat.id !== editingEntry.mainId) return cat;
          if (cat.subcategories.some((s) => s.id !== editingEntry.subId && s.label.trim().toLowerCase() === label.toLowerCase())) {
            clashing = true; return cat;
          }
          return {
            ...cat,
            subcategories: cat.subcategories.map((s) =>
              s.id === editingEntry.subId ? { ...s, label, subtitle: editSubtitle.trim() } : s
            ),
          };
        });
      } else if (editingEntry.type === 'mainClassif') {
        return prev.map((cat) => {
          if (cat.id !== editingEntry.mainId) return cat;
          return {
            ...cat,
            subcategories: cat.subcategories.map(sub => {
              if (sub.id !== editingEntry.subId) return sub;
              if ((sub.mainClassifications || []).some(mc => mc.id !== editingEntry.mainClassifId && mc.label.trim().toLowerCase() === label.toLowerCase())) {
                clashing = true; return sub;
              }
              return {
                ...sub,
                mainClassifications: (sub.mainClassifications || []).map(mc =>
                  mc.id === editingEntry.mainClassifId ? { ...mc, label } : mc
                )
              };
            })
          };
        });
      } else {
        return prev.map((cat) => {
          if (cat.id !== editingEntry.mainId) return cat;
          return {
            ...cat,
            subcategories: cat.subcategories.map(sub => {
              if (sub.id !== editingEntry.subId) return sub;
              return {
                ...sub,
                mainClassifications: (sub.mainClassifications || []).map(mc => {
                  if (mc.id !== editingEntry.mainClassifId) return mc;
                  if ((mc.subClassifications || []).some(sc => sc.id !== editingEntry.subClassifId && sc.label.trim().toLowerCase() === label.toLowerCase())) {
                    clashing = true; return mc;
                  }
                  return {
                    ...mc,
                    subClassifications: (mc.subClassifications || []).map(sc =>
                      sc.id === editingEntry.subClassifId ? { ...sc, label } : sc
                    )
                  };
                })
              };
            })
          };
        });
      }
    });

    if (clashing) {
      setCatError('الاسم المكتوب مكرر في هذا المستوى');
      return;
    }

    setEditingEntry(null); setEditLabel(''); setEditSubtitle(''); setCatError(null);
  }, [editingEntry, editLabel, editSubtitle]);

  const selectedProduct = useMemo(() => products.find(p => p.id === selectedProductId) ?? null, [selectedProductId, products]);
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
    let productsList = products.filter(p => {
      // Hide products from hidden categories unless in Category Mapping Categories manager
      if (hiddenCategoryIds.has(p.categoryPath.main) && !(activeTab === 'mapping' && activeSubTab === 'categories')) {
        return false;
      }
      if (p.categoryPath.sub && hiddenSubCategoryIds.has(p.categoryPath.sub) && !(activeTab === 'mapping' && activeSubTab === 'categories')) {
        return false;
      }
      if (activeMainCategory && p.categoryPath.main !== activeMainCategory.id) return false;
      if (activeSubCategory && p.categoryPath.sub !== activeSubCategory.id) return false;
      if (activeMainClassifId && p.categoryPath.mainClassification !== activeMainClassifId) return false;
      if (activeSubClassifId && p.categoryPath.subClassification !== activeSubClassifId) return false;

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
        productsList = productsList.filter(p => p.mediaPolicy === 'catalog-owned-media');
      } else if (activeSubTab === 'exceptions') {
        productsList = productsList.filter(p => p.mediaPolicy === 'partner-owned-exception');
      }
    } else if (activeTab === 'intake') {
      if (activeSubTab === 'quick') {
        productsList = productsList.filter(p => p.sourceSurface === 'catalog' || p.sourceSurface === 'client');
      } else if (activeSubTab === 'partner') {
        productsList = productsList.filter(p => p.sourceSurface === 'partner');
      } else if (activeSubTab === 'field') {
        productsList = productsList.filter(p => p.sourceSurface === 'field');
      }
    } else if (activeTab === 'approvals') {
      if (activeSubTab === 'marketing') {
        productsList = productsList.filter(p => p.approvalStage === 'marketing-review');
      } else if (activeSubTab === 'quality') {
        productsList = productsList.filter(p => p.approvalStage === 'partner-review');
      } else if (activeSubTab === 'pricing') {
        productsList = productsList.filter(p => p.price > 100);
      } else if (activeSubTab === 'media') {
        productsList = productsList.filter(p => p.mediaPolicy === 'partner-proposed-review' || p.mediaPolicy === 'marketing-enhancement-required' || !p.mediaKey);
      } else if (activeSubTab === 'barcode') {
        productsList = productsList.filter(p => !p.gtin || !!p.conflictReason);
      }
    } else if (activeTab === 'mapping') {
      if (activeSubTab === 'duplicates') {
        productsList = productsList.filter(p => !!p.conflictReason);
      } else if (activeSubTab === 'gtin') {
        productsList = productsList.filter(p => !p.gtin);
      } else if (activeSubTab === 'categories') {
        productsList = productsList.filter(p => !!p.categoryPath.main);
      } else if (activeSubTab === 'substitutions') {
        productsList = productsList.filter(p => p.categoryPath.main === 'restaurants'); // meals can have substitution policies
      } else if (activeSubTab === 'visibility-policy') {
        productsList = productsList.filter(p => p.surfaces.includes('client'));
      }
    } else if (activeTab === 'publishing') {
      if (activeSubTab === 'ready') {
        productsList = productsList.filter(p => p.approvalStage === 'catalog-adopted');
      } else if (activeSubTab === 'client-visible') {
        productsList = productsList.filter(p => p.approvalStage === 'client-visible');
      } else if (activeSubTab === 'hidden') {
        productsList = productsList.filter(p => p.approvalStage === 'catalog-draft' || p.approvalStage === 'partner-proposed');
      } else if (activeSubTab === 'needs-review') {
        productsList = productsList.filter(p => p.approvalStage === 'marketing-review' || p.approvalStage === 'partner-review');
      }
    }

    // 3. Dynamic counts for quick filters (based on current category/search/tab selection)
    const dynamicCounts = {
      'all': productsList.length,
      'active': productsList.filter(p => p.approvalStage === 'client-visible').length,
      'review': productsList.filter(p => p.approvalStage === 'marketing-review' || p.approvalStage === 'partner-review').length,
      'conflict': productsList.filter(p => !!p.conflictReason).length,
      'master': productsList.filter(p => p.mediaPolicy === 'catalog-owned-media').length,
      'partner': productsList.filter(p => p.mediaPolicy === 'partner-owned-exception').length,
      'needs-link': productsList.filter(p => !p.gtin).length,
      'needs-image': productsList.filter(p => !p.mediaKey).length,
    };

    // 4. Apply Layer 3 Smart Filters
    if (activeFilter === 'active') {
      productsList = productsList.filter(p => p.approvalStage === 'client-visible');
    } else if (activeFilter === 'review') {
      productsList = productsList.filter(p => p.approvalStage === 'marketing-review' || p.approvalStage === 'partner-review');
    } else if (activeFilter === 'conflict') {
      productsList = productsList.filter(p => !!p.conflictReason);
    } else if (activeFilter === 'master') {
      productsList = productsList.filter(p => p.mediaPolicy === 'catalog-owned-media');
    } else if (activeFilter === 'partner') {
      productsList = productsList.filter(p => p.mediaPolicy === 'partner-owned-exception');
    } else if (activeFilter === 'needs-link') {
      productsList = productsList.filter(p => !p.gtin);
    } else if (activeFilter === 'needs-image') {
      productsList = productsList.filter(p => !p.mediaKey);
    }

    // 5. Apply Column Filters
    const getCatName = (id: string) => previewCategories.find(c => c.id === id)?.label || dshCatalogCategories.find(c => c.id === id)?.label || 'غير معروف';
    const getClassifName = (p: CatalogProductMaster) => {
       if(!p.categoryPath.mainClassification) return 'عام';
       const mainCat = previewCategories.find(c => c.id === p.categoryPath.main);
       const sub = mainCat?.subcategories?.find(s => s.id === p.categoryPath.sub);
       const classif = sub?.mainClassifications?.find(c => c.id === p.categoryPath.mainClassification);
       return classif?.label || p.categoryPath.mainClassification;
    };

    if (colFilters.name.length > 0) productsList = productsList.filter(p => colFilters.name.includes(p.name));
    if (colFilters.category.length > 0) productsList = productsList.filter(p => colFilters.category.includes(getCatName(p.categoryPath.main)));
    if (colFilters.classification.length > 0) productsList = productsList.filter(p => colFilters.classification.includes(getClassifName(p)));
    if (colFilters.sku.length > 0) productsList = productsList.filter(p => colFilters.sku.includes(p.sku));
    if (colFilters.price.length > 0) productsList = productsList.filter(p => colFilters.price.includes(p.price.toString()));
    if (colFilters.policy.length > 0) productsList = productsList.filter(p => colFilters.policy.includes(p.mediaPolicy));
    if (colFilters.status.length > 0) productsList = productsList.filter(p => colFilters.status.includes(p.conflictReason ? 'تعارض' : p.approvalStage === 'client-visible' ? 'نشط' : 'مراجعة'));
    if (colFilters.source.length > 0) productsList = productsList.filter(p => colFilters.source.includes(p.sourceSurface || 'catalog'));

    // 6. Generate options for column filters from the CURRENT product set
    const filterOptions = {
       name: Array.from(new Set(productsList.map(p => p.name))),
       category: Array.from(new Set(productsList.map(p => getCatName(p.categoryPath.main)))),
       classification: Array.from(new Set(productsList.map(p => getClassifName(p)))),
       sku: Array.from(new Set(productsList.map(p => p.sku))),
       price: Array.from(new Set(productsList.map(p => p.price.toString()))),
       policy: Array.from(new Set(productsList.map(p => p.mediaPolicy))),
       status: Array.from(new Set(productsList.map(p => p.conflictReason ? 'تعارض' : p.approvalStage === 'client-visible' ? 'نشط' : 'مراجعة'))),
       source: Array.from(new Set(productsList.map(p => p.sourceSurface || 'catalog'))),
       categoryMode: ['catalog-based', 'manual-order']
    };

    return { filteredProducts: productsList, counts: dynamicCounts, filterOptions };
  }, [products, isManualOrderCategory, activeMainCategory, activeSubCategory, searchQuery, activeFilter, colFilters, hiddenCategoryIds, hiddenSubCategoryIds, activeTab, activeSubTab, activeMainClassifId, activeSubClassifId, previewCategories]);

  // Handle click outside to close dropdowns
  React.useEffect(() => {
    const handleClick = () => setOpenFilterCol(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const activeColFiltersCount = Object.values(colFilters).flat().length;
  const isCategoryMapped = useMemo(() => products.every(p => !!p.categoryPath.main), [products]);
  const isDuplicatesClean = useMemo(() => products.every(p => !p.conflictReason), [products]);
  const isMediaSatisfied = useMemo(() => products.every(p => !!p.mediaKey), [products]);
  const approvedCount = useMemo(() => products.filter(p => p.approvalStage === 'catalog-adopted' || p.approvalStage === 'client-visible').length, [products]);
  const totalCount = products.length;
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

    if (activeTab === 'catalog') {
      actions.push(
        {
          id: 'ma-cat-add-item',
          label: '➕ إضافة منتج جديد',
          isActive: showProductModal && modalMode === 'add',
          onAction: () => {
            setModalMode('add');
            setModalForm({
              id: '',
              name: '',
              sku: `BTH-NEW-${Date.now().toString().slice(-4)}`,
              gtin: '',
              price: 15,
              mainCat: activeMainCategory?.id || 'grocery',
              subCat: activeSubCategory?.id || '',
              mainClassif: activeMainClassifId || '',
              subClassif: activeSubClassifId || '',
              mediaPolicy: 'catalog-owned-media',
              approvalStage: 'catalog-draft',
              imageUri: '',
              mediaKey: '',
            });
            setShowProductModal(true);
          }
        },
        {
          id: 'ma-cat-toggle-policy',
          label: '🔄 تبديل سياسة صور المجموعة',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.map(f => f.id);
            setProducts(prev => prev.map(p => {
              if (productIds.includes(p.id)) {
                return {
                  ...p,
                  mediaPolicy: p.mediaPolicy === 'catalog-owned-media' ? 'partner-owned-exception' : 'catalog-owned-media'
                };
              }
              return p;
            }));
            alert('تم تبديل سياسة الصور للمنتجات المحددة في الجدول');
          }
        },
        {
          id: 'ma-cat-reset',
          label: '↺ إعادة ضبط الكتالوج',
          isActive: false,
          onAction: () => {
            setProducts(dshCatalogProducts);
            setPreviewApprovalStages({});
            alert('تمت إعادة الكتالوج لحالة المصدر الأولية');
          }
        }
      );
    } else if (activeTab === 'intake') {
      actions.push(
        {
          id: 'ma-intake-adopt-all',
          label: '✅ اعتماد مقترحات الشركاء',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.map(f => f.id);
            setProducts(prev => prev.map(p => {
              if (productIds.includes(p.id) && (p.approvalStage === 'partner-proposed' || p.sourceSurface === 'partner')) {
                return { ...p, approvalStage: 'catalog-adopted' };
              }
              return p;
            }));
            alert('تم اعتماد مقترحات الشركاء المحددة ونقلها لمرحلة الجاهزية');
          }
        }
      );
    } else if (activeTab === 'approvals') {
      if (activeSubTab === 'marketing') {
        actions.push({
          id: 'ma-appr-marketing-approve-all',
          label: '📢 اعتماد كل مراجعات التسويق',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.map(f => f.id);
            setProducts(prev => prev.map(p => {
              if (productIds.includes(p.id) && p.approvalStage === 'marketing-review') {
                return { ...p, approvalStage: 'catalog-adopted' };
              }
              return p;
            }));
            alert('تم اعتماد مراجعات التسويق المحددة بنجاح');
          }
        });
      } else if (activeSubTab === 'quality') {
        actions.push({
          id: 'ma-appr-quality-pass-all',
          label: '🛡️ تمرير جميع فحوصات الجودة',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.map(f => f.id);
            setProducts(prev => prev.map(p => {
              if (productIds.includes(p.id) && p.approvalStage === 'partner-review') {
                return { ...p, approvalStage: 'catalog-approved' };
              }
              return p;
            }));
            alert('تم تمرير فحوصات الجودة لمنتجات الشركاء بنجاح');
          }
        });
      } else if (activeSubTab === 'pricing') {
        actions.push({
          id: 'ma-appr-pricing-resolve',
          label: '💸 تسوية تعارض الأسعار تلقائياً',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.map(f => f.id);
            setProducts(prev => prev.map(p => {
              if (productIds.includes(p.id) && p.price > 100) {
                return { ...p, price: 45.00, conflictReason: undefined };
              }
              return p;
            }));
            alert('تم خفض وتعديل الأسعار المرتفعة وتسوية تعارض التسعير');
          }
        });
      } else if (activeSubTab === 'media') {
        actions.push({
          id: 'ma-media-assign-central',
          label: '📸 تعيين صور مركزية معتمدة',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.map(f => f.id);
            setProducts(prev => prev.map(p => {
              if (productIds.includes(p.id) && !p.mediaKey) {
                return { ...p, mediaPolicy: 'catalog-owned-media', mediaKey: 'dsh.product.roll.v1' };
              }
              return p;
            }));
            alert('تم تعيين صورة مركزية افتراضية للمنتجات التي تنقصها صور');
          }
        });
      } else if (activeSubTab === 'barcode') {
        actions.push({
          id: 'ma-barcode-generate-gtin',
          label: '🏷️ توليد باركود GTIN تلقائي',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.map(f => f.id);
            setProducts(prev => prev.map(p => {
              if (productIds.includes(p.id) && !p.gtin) {
                return { ...p, gtin: `628${Math.floor(1000000000 + Math.random() * 9000000000)}`, conflictReason: undefined };
              }
              return p;
            }));
            alert('تم توليد أرقام باركود GTIN عشوائية لجميع المنتجات المحددة');
          }
        });
      }
    } else if (activeTab === 'mapping') {
      if (activeSubTab === 'categories') {
        actions.push(
          { id: 'ma-cat-manage', label: '🏷️ فتح/إغلاق لوحة الفئات', isActive: categoryControlOpen, onAction: () => setCategoryControlOpen((v) => !v) },
          { id: 'ma-cat-add-main', label: '➕ إضافة فئة رئيسية', isActive: addingMainCat, onAction: () => { setAddingMainCat(true); setCategoryControlOpen(true); } },
          { id: 'ma-cat-reset-all', label: '↺ إعادة ضبط شجرة الفئات', isActive: false, onAction: () => handleResetCategoryPreview() }
        );
      } else if (activeSubTab === 'duplicates') {
        actions.push({
          id: 'ma-dup-resolve-all',
          label: '🔗 دمج وحل جميع التكرارات',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.map(f => f.id);
            setProducts(prev => prev.map(p => {
              if (productIds.includes(p.id)) {
                return { ...p, conflictReason: undefined };
              }
              return p;
            }));
            alert('تم دمج التكرارات وحل النزاعات للمنتجات المحددة');
          }
        });
      } else if (activeSubTab === 'gtin') {
        actions.push({
          id: 'ma-gtin-sync',
          label: '🔄 مزامنة الباركود مع المعرف',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.map(f => f.id);
            setProducts(prev => prev.map(p => {
              if (productIds.includes(p.id) && !p.gtin) {
                return { ...p, gtin: p.sku.replace('BTH-', '628') };
              }
              return p;
            }));
            alert('تم تعيين GTIN بالاعتماد على SKU للمنتجات المحددة');
          }
        });
      } else if (activeSubTab === 'substitutions') {
        actions.push({
          id: 'ma-sub-set-strict',
          label: '🔒 تطبيق سياسة بدائل صارمة',
          isActive: false,
          onAction: () => {
            alert('تم تطبيق سياسة بدائل صارمة بنجاح عبر الكتالوج');
          }
        });
      } else if (activeSubTab === 'visibility-policy') {
        actions.push({
          id: 'ma-vis-toggle-client',
          label: '👁️ تبديل الظهور للمستهلكين',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.map(f => f.id);
            setProducts(prev => prev.map(p => {
              if (productIds.includes(p.id)) {
                const hasClient = p.surfaces.includes('client');
                return {
                  ...p,
                  surfaces: hasClient ? p.surfaces.filter(s => s !== 'client') : [...p.surfaces, 'client' as any]
                };
              }
              return p;
            }));
            alert('تم تعديل منصات العرض المتاحة للمنتجات المحددة');
          }
        });
      }
    } else if (activeTab === 'publishing') {
      actions.push(
        {
          id: 'ma-pub-publish-ready',
          label: '🚀 نشر جميع المنتجات الجاهزة للعميل',
          isActive: false,
          onAction: () => {
            setProducts(prev => prev.map(p => {
              if (p.approvalStage === 'catalog-adopted') {
                return { ...p, approvalStage: 'client-visible' };
              }
              return p;
            }));
            alert('تم نشر جميع المنتجات الجاهزة بنجاح للعميل');
          }
        },
        {
          id: 'ma-pub-hide-drafts',
          label: '🙈 إخفاء جميع المسودات والمقترحات',
          isActive: false,
          onAction: () => {
            setProducts(prev => prev.map(p => {
              if (p.approvalStage === 'catalog-draft' || p.approvalStage === 'partner-proposed') {
                return { ...p, approvalStage: 'catalog-draft' }; // ensure they stay as draft/hidden
              }
              return p;
            }));
            alert('تم التأكد من إخفاء جميع المسودات ومقترحات الشركاء');
          }
        }
      );
    }
    return actions;
  }, [activeTab, activeSubTab, activeFilter, showBulkOps, filteredProducts, previewCategories, activeMainCategory, categoryControlOpen, addingMainCat, showProductModal, modalMode]);

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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                  {activeMainCategory && activeMainCategory.subcategories.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', alignItems: 'center', paddingRight: '12px' }}>
                      <Text role="caption" numberOfLines={1} style={{ fontSize: 9, fontWeight: 800, color: theme.textMuted }}>└ الفرعية:</Text>
                      <button
                        onClick={() => handleSubCategorySelect(null)}
                        style={{
                          padding: '1px 6px',
                          borderRadius: '8px',
                          fontSize: '9px',
                          fontWeight: 600,
                          border: `1px solid ${!activeSubCategory ? theme.brand : theme.lineStrong}`,
                          cursor: 'pointer',
                          backgroundColor: !activeSubCategory ? theme.brandSurface : theme.surface,
                          color: !activeSubCategory ? theme.brand : theme.textMuted,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        الكل
                      </button>
                      {activeMainCategory.subcategories.map(sub => {
                        const isSubSelected = activeSubCategory?.id === sub.id;
                        const isSubHidden = hiddenSubCategoryIds.has(sub.id);
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSubCategorySelect(sub)}
                            title={isSubHidden ? 'مخفي (معاينة)' : undefined}
                            style={{
                              padding: '1px 6px',
                              borderRadius: '8px',
                              fontSize: '9px',
                              fontWeight: 600,
                              border: `1px solid ${isSubSelected ? theme.brand : theme.lineStrong}`,
                              cursor: 'pointer',
                              backgroundColor: isSubSelected ? theme.brandSurface : theme.surface,
                              color: isSubSelected ? theme.brand : theme.textMuted,
                              whiteSpace: 'nowrap',
                              opacity: isSubHidden ? 0.5 : 1,
                            }}
                          >
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {/* Classification chips */}
                  {activeMainCategory && activeSubCategory && activeSubCategory.mainClassifications && activeSubCategory.mainClassifications.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', alignItems: 'center', paddingRight: '24px' }}>
                      <Text role="caption" numberOfLines={1} style={{ fontSize: 8, fontWeight: 800, color: theme.textMuted }}>└─ الرئيسي:</Text>
                      <button
                        onClick={() => { setActiveMainClassifId(null); setActiveSubClassifId(null); }}
                        style={{
                          padding: '1px 5px',
                          borderRadius: '6px',
                          fontSize: '8px',
                          fontWeight: 600,
                          border: `1px solid ${!activeMainClassifId ? theme.brand : theme.lineStrong}`,
                          cursor: 'pointer',
                          backgroundColor: !activeMainClassifId ? theme.brandSurface : theme.surface,
                          color: !activeMainClassifId ? theme.brand : theme.textMuted,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        الكل
                      </button>
                      {activeSubCategory.mainClassifications.map(mc => {
                        const isSelected = activeMainClassifId === mc.id;
                        return (
                          <button
                            key={mc.id}
                            onClick={() => { setActiveMainClassifId(isSelected ? null : mc.id); setActiveSubClassifId(null); }}
                            style={{
                              padding: '1px 5px',
                              borderRadius: '6px',
                              fontSize: '8px',
                              fontWeight: 600,
                              border: `1px solid ${isSelected ? theme.brand : theme.lineStrong}`,
                              cursor: 'pointer',
                              backgroundColor: isSelected ? theme.brandSurface : theme.surface,
                              color: isSelected ? theme.brand : theme.textMuted,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            🔹 {mc.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Sub-Classification chips */}
                  {activeMainCategory && activeSubCategory && activeMainClassifId && (() => {
                    const currentMC = activeSubCategory.mainClassifications?.find(c => c.id === activeMainClassifId);
                    if (!currentMC || !currentMC.subClassifications || currentMC.subClassifications.length === 0) return null;
                    return (
                      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', alignItems: 'center', paddingRight: '36px' }}>
                        <Text role="caption" numberOfLines={1} style={{ fontSize: 8, fontWeight: 800, color: theme.textMuted }}>└─ الفرعي:</Text>
                        <button
                          onClick={() => setActiveSubClassifId(null)}
                          style={{
                            padding: '1px 4px',
                            borderRadius: '5px',
                            fontSize: '8px',
                            fontWeight: 600,
                            border: `1px solid ${!activeSubClassifId ? theme.brand : theme.lineStrong}`,
                            cursor: 'pointer',
                            backgroundColor: !activeSubClassifId ? theme.brandSurface : theme.surface,
                            color: !activeSubClassifId ? theme.brand : theme.textMuted,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          الكل
                        </button>
                        {currentMC.subClassifications.map(sc => {
                          const isSelected = activeSubClassifId === sc.id;
                          return (
                            <button
                              key={sc.id}
                              onClick={() => setActiveSubClassifId(isSelected ? null : sc.id)}
                              style={{
                                padding: '1px 4px',
                                borderRadius: '5px',
                                fontSize: '8px',
                                fontWeight: 600,
                                border: `1px solid ${isSelected ? theme.brand : theme.lineStrong}`,
                                cursor: 'pointer',
                                backgroundColor: isSelected ? theme.brandSurface : theme.surface,
                                color: isSelected ? theme.brand : theme.textMuted,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              🔸 {sc.label}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
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
        {(activeFilter !== 'all' || searchQuery !== '' || activeColFiltersCount > 0 || activeMainCategory !== null || activeSubCategory !== null || activeMainClassifId !== null || activeSubClassifId !== null) && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Text role="caption" style={{ fontSize: 10, color: theme.brand }}>
              {`نشط: ${activeColFiltersCount + (activeFilter !== 'all' ? 1 : 0) + (searchQuery !== '' ? 1 : 0) + (activeMainCategory ? 1 : 0) + (activeMainClassifId ? 1 : 0) + (activeSubClassifId ? 1 : 0)} فلتر`}
            </Text>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
                setColFilters(initialColumnFilters);
                setActiveMainCategory(null);
                setActiveSubCategory(null);
                setActiveMainClassifId(null);
                setActiveSubClassifId(null);
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
                                onClick={() => { setAddingSubUnder(addingSubUnder === cat.id ? null : cat.id); setFormLabel(''); setFormSubtitle(''); setCatError(null); setEditingEntry(null); setAddingMainCat(false); setAddingMainClassifUnder(null); setAddingSubClassifUnder(null); }}
                                style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: addingSubUnder === cat.id ? theme.brandSurface : 'transparent', color: addingSubUnder === cat.id ? theme.brand : theme.textMuted }}
                              >+ فرعية</button>
                              <button
                                onClick={() => handleStartCatEdit('main', cat.id)}
                                style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}
                              >تعديل</button>
                              <button
                                onClick={() => handleToggleCategoryHide(cat.id)}
                                style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${isHidden ? theme.success : theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: isHidden ? theme.success : theme.textMuted }}
                              >{isHidden ? 'استعادة' : 'إخفاء'}</button>
                              <button
                                onClick={() => { if (confirm('هل أنت متأكد من حذف هذه الفئة وجميع فئاتها وتصنيفاتها الفرعية؟')) handleDeleteNode('main', cat.id); }}
                                style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}
                              >حذف</button>
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

                      {/* Subcategories list */}
                      {cat.subcategories.length > 0 && (
                        <div style={{ margin: '0 8px 6px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {cat.subcategories.map((sub) => {
                            const subCount = getProductCountForCategory(cat.id, sub.id);
                            const isSelectedSub = activeSubCategory?.id === sub.id;
                            const isSubHidden = hiddenSubCategoryIds.has(sub.id);
                            const isEditingThisSub = editingEntry?.type === 'sub' && editingEntry.mainId === cat.id && editingEntry.subId === sub.id;
                            const isAddingClassifThisSub = addingMainClassifUnder?.mainId === cat.id && addingMainClassifUnder?.subId === sub.id;

                            return (
                              <div key={sub.id} style={{
                                borderRadius: '4px', border: `1px solid ${isSelectedSub ? theme.brand : 'transparent'}`,
                                backgroundColor: isSubHidden ? theme.surfaceInset : (isSelectedSub ? theme.brandSurface : theme.surfaceInset),
                                opacity: isSubHidden ? 0.6 : 1, overflow: 'hidden', padding: '4px'
                              }}>
                                {/* Subcategory row */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
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
                                        onClick={() => { handleSubCategorySelect(isSelectedSub ? null : sub); if (!isSelectedSub) handleMainCategorySelect(cat); }}
                                        style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', flex: 1, textAlign: 'right' }}
                                      >
                                        <span style={{ fontSize: '10px', color: theme.textMuted }}>└── 📂</span>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                          <span style={{ fontSize: '10px', fontWeight: isSelectedSub ? 700 : 600, color: isSelectedSub ? theme.brand : theme.brandHeaderBackground }}>{sub.label}</span>
                                          {sub.subtitle && <span style={{ fontSize: '8px', color: theme.textMuted }}>{sub.subtitle}</span>}
                                        </div>
                                        <span style={{ fontSize: '9px', color: theme.textMuted, marginRight: 'auto' }}>{subCount}</span>
                                      </button>
                                      <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                                        <button
                                          onClick={() => { setAddingMainClassifUnder(isAddingClassifThisSub ? null : { mainId: cat.id, subId: sub.id }); setFormLabel(''); setFormSubtitle(''); setCatError(null); setEditingEntry(null); setAddingMainCat(false); setAddingSubUnder(null); setAddingSubClassifUnder(null); }}
                                          style={{ padding: '1px 4px', borderRadius: '3px', fontSize: '8px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: isAddingClassifThisSub ? theme.brandSurface : 'transparent', color: isAddingClassifThisSub ? theme.brand : theme.textMuted }}
                                        >+ تصنيف رئيسي</button>
                                        <button onClick={() => handleStartCatEdit('sub', cat.id, sub.id)} style={{ padding: '1px 4px', borderRadius: '3px', fontSize: '8px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}>تعديل</button>
                                        <button onClick={() => handleToggleSubCategoryHide(sub.id)} style={{ padding: '1px 4px', borderRadius: '3px', fontSize: '8px', border: `1px solid ${isSubHidden ? theme.success : theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: isSubHidden ? theme.success : theme.textMuted }}>{isSubHidden ? 'استعادة' : 'إخفاء'}</button>
                                        <button onClick={() => { if (confirm('هل أنت متأكد من حذف هذه الفئة الفرعية وتصنيفاتها؟')) handleDeleteNode('sub', cat.id, sub.id); }} style={{ padding: '1px 4px', borderRadius: '3px', fontSize: '8px', border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}>حذف</button>
                                      </div>
                                    </>
                                  )}
                                </div>

                                {/* Add main classification form */}
                                {isAddingClassifThisSub && (
                                  <div style={{ margin: '4px 12px 4px 4px', padding: '5px', borderRadius: '3px', backgroundColor: theme.surface, border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '8px', fontWeight: 800, color: theme.brand }}>إضافة تصنيف رئيسي جديد تحت: {sub.label}</span>
                                    <input type="text" placeholder="اسم التصنيف الرئيسي *" value={formLabel} onChange={(e) => setFormLabel(e.target.value)}
                                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddMainClassification(cat.id, sub.id); if (e.key === 'Escape') { setAddingMainClassifUnder(null); setCatError(null); } }}
                                      autoFocus
                                      style={{ padding: '2px 5px', borderRadius: '2px', fontSize: '9px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
                                    />
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                      <button onClick={() => handleAddMainClassification(cat.id, sub.id)} style={{ padding: '1px 8px', borderRadius: '2px', fontSize: '8px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>إضافة</button>
                                      <button onClick={() => { setAddingMainClassifUnder(null); setFormLabel(''); setCatError(null); }} style={{ padding: '1px 8px', borderRadius: '2px', fontSize: '8px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                    </div>
                                  </div>
                                )}

                                {/* Main Classifications */}
                                {sub.mainClassifications && sub.mainClassifications.length > 0 && (
                                  <div style={{ margin: '4px 4px 2px 16px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    {sub.mainClassifications.map((classif) => {
                                      const isEditingThisClassif = editingEntry?.type === 'mainClassif' && editingEntry.mainId === cat.id && editingEntry.subId === sub.id && editingEntry.mainClassifId === classif.id;
                                      const isAddingSubClassif = addingSubClassifUnder?.mainId === cat.id && addingSubClassifUnder?.subId === sub.id && addingSubClassifUnder?.mainClassifId === classif.id;

                                      return (
                                        <div key={classif.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px', backgroundColor: theme.surface, borderRadius: '3px', padding: '3px' }}>
                                          {/* Main Classification Row */}
                                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                                            {isEditingThisClassif ? (
                                              <div style={{ display: 'flex', flex: 1, gap: '4px', alignItems: 'center' }}>
                                                <input type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                                                  onKeyDown={(e) => { if (e.key === 'Enter') handleApplyCatEdit(); if (e.key === 'Escape') { setEditingEntry(null); setCatError(null); } }}
                                                  autoFocus
                                                  style={{ padding: '1px 4px', borderRadius: '2px', fontSize: '9px', direction: 'rtl', border: `1px solid ${theme.brand}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1 }}
                                                />
                                                <button onClick={handleApplyCatEdit} style={{ padding: '1px 5px', borderRadius: '2px', fontSize: '8px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
                                                <button onClick={() => { setEditingEntry(null); setCatError(null); }} style={{ padding: '1px 5px', borderRadius: '2px', fontSize: '8px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                              </div>
                                            ) : (
                                              <>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, textAlign: 'right' }}>
                                                  <span style={{ fontSize: '9px', color: theme.textMuted }}>├── 🔹</span>
                                                  <span style={{ fontSize: '9.5px', fontWeight: 600, color: theme.brandHeaderBackground }}>{classif.label}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                                                  <button
                                                    onClick={() => { setAddingSubClassifUnder(isAddingSubClassif ? null : { mainId: cat.id, subId: sub.id, mainClassifId: classif.id }); setFormLabel(''); setCatError(null); setEditingEntry(null); setAddingMainCat(false); setAddingSubUnder(null); setAddingMainClassifUnder(null); }}
                                                    style={{ padding: '1px 3px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: isAddingSubClassif ? theme.brandSurface : 'transparent', color: isAddingSubClassif ? theme.brand : theme.textMuted }}
                                                  >+ تصنيف فرعي</button>
                                                  <button onClick={() => handleStartCatEdit('mainClassif', cat.id, sub.id, classif.id)} style={{ padding: '1px 3px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}>تعديل</button>
                                                  <button onClick={() => { if (confirm('هل أنت متأكد من حذف هذا التصنيف الرئيسي وتصنيفاته الفرعية؟')) handleDeleteNode('mainClassif', cat.id, sub.id, classif.id); }} style={{ padding: '1px 3px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}>حذف</button>
                                                </div>
                                              </>
                                            )}
                                          </div>

                                          {/* Add sub classification form */}
                                          {isAddingSubClassif && (
                                            <div style={{ margin: '3px 16px 3px 3px', padding: '4px', borderRadius: '2px', backgroundColor: theme.surfaceInset, border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                              <span style={{ fontSize: '7.5px', fontWeight: 800, color: theme.brand }}>إضافة تصنيف فرعي جديد تحت: {classif.label}</span>
                                              <input type="text" placeholder="اسم التصنيف الفرعي *" value={formLabel} onChange={(e) => setFormLabel(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubClassification(cat.id, sub.id, classif.id); if (e.key === 'Escape') { setAddingSubClassifUnder(null); setCatError(null); } }}
                                                autoFocus
                                                style={{ padding: '1px 4px', borderRadius: '2px', fontSize: '8.5px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
                                              />
                                              <div style={{ display: 'flex', gap: '3px' }}>
                                                <button onClick={() => handleAddSubClassification(cat.id, sub.id, classif.id)} style={{ padding: '1px 6px', borderRadius: '2px', fontSize: '7.5px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>إضافة</button>
                                                <button onClick={() => { setAddingSubClassifUnder(null); setFormLabel(''); setCatError(null); }} style={{ padding: '1px 6px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                              </div>
                                            </div>
                                          )}

                                          {/* Sub-Classifications */}
                                          {classif.subClassifications && classif.subClassifications.length > 0 && (
                                            <div style={{ margin: '2px 2px 2px 20px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                              {classif.subClassifications.map((subc) => {
                                                const isEditingThisSubClassif = editingEntry?.type === 'subClassif' && editingEntry.mainId === cat.id && editingEntry.subId === sub.id && editingEntry.mainClassifId === classif.id && editingEntry.subClassifId === subc.id;

                                                return (
                                                  <div key={subc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', backgroundColor: theme.surfaceInset, borderRadius: '2px', padding: '2px' }}>
                                                    {isEditingThisSubClassif ? (
                                                      <div style={{ display: 'flex', flex: 1, gap: '3px', alignItems: 'center' }}>
                                                        <input type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                                                          onKeyDown={(e) => { if (e.key === 'Enter') handleApplyCatEdit(); if (e.key === 'Escape') { setEditingEntry(null); setCatError(null); } }}
                                                          autoFocus
                                                          style={{ padding: '1px 3px', borderRadius: '2px', fontSize: '8px', direction: 'rtl', border: `1px solid ${theme.brand}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1 }}
                                                        />
                                                        <button onClick={handleApplyCatEdit} style={{ padding: '1px 4px', borderRadius: '2px', fontSize: '7.5px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
                                                        <button onClick={() => { setEditingEntry(null); setCatError(null); }} style={{ padding: '1px 4px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                                      </div>
                                                    ) : (
                                                      <>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, textAlign: 'right' }}>
                                                          <span style={{ fontSize: '8px', color: theme.textMuted }}>└── 🔸</span>
                                                          <span style={{ fontSize: '8.5px', color: theme.brandHeaderBackground }}>{subc.label}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                                                          <button onClick={() => handleStartCatEdit('subClassif', cat.id, sub.id, classif.id, subc.id)} style={{ padding: '0 2px', borderRadius: '2px', fontSize: '7px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}>تعديل</button>
                                                          <button onClick={() => { if (confirm('هل أنت متأكد من حذف هذا التصنيف الفرعي؟')) handleDeleteNode('subClassif', cat.id, sub.id, classif.id, subc.id); }} style={{ padding: '0 2px', borderRadius: '2px', fontSize: '7px', border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}>حذف</button>
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
            {activeTab !== 'taxonomy' ? (
              <>
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
                          {activeTab === 'publishing' && (
                            <Box
                              padding={3}
                              gap={2}
                              style={{
                                backgroundColor: theme.surfaceInset,
                                borderBottomWidth: 1,
                                borderBottomColor: theme.line,
                                margin: 12,
                                borderRadius: 8,
                              }}
                            >
                              <Text role="bodyStrong" style={{ color: theme.brandHeaderBackground, fontWeight: '700', textAlign: 'right' }}>بوابة النشر النهائية (Publishing Gate Checklist)</Text>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', margin: '8px 0' }}>
                                <Box layoutDirection="row" align="center" gap={2} style={{ justifyContent: 'flex-end' }}>
                                  <Text role="caption" tone={isCategoryMapped ? 'default' : 'danger'} style={{ fontSize: 11, textAlign: 'right' }}>ربط الفئات (Category Mapping)</Text>
                                  <Text style={{ color: isCategoryMapped ? theme.success : theme.danger, fontWeight: 'bold', fontSize: 14 }}>
                                    {isCategoryMapped ? '✓' : '✗'}
                                  </Text>
                                </Box>
                                <Box layoutDirection="row" align="center" gap={2} style={{ justifyContent: 'flex-end' }}>
                                  <Text role="caption" tone={isDuplicatesClean ? 'default' : 'danger'} style={{ fontSize: 11, textAlign: 'right' }}>خلو الكتالوج من التكرارات (No Duplicates)</Text>
                                  <Text style={{ color: isDuplicatesClean ? theme.success : theme.danger, fontWeight: 'bold', fontSize: 14 }}>
                                    {isDuplicatesClean ? '✓' : '✗'}
                                  </Text>
                                </Box>
                                <Box layoutDirection="row" align="center" gap={2} style={{ justifyContent: 'flex-end' }}>
                                  <Text role="caption" tone={isMediaSatisfied ? 'default' : 'danger'} style={{ fontSize: 11, textAlign: 'right' }}>اعتماد الصور والسياسة (Media Satisfied)</Text>
                                  <Text style={{ color: isMediaSatisfied ? theme.success : theme.danger, fontWeight: 'bold', fontSize: 14 }}>
                                    {isMediaSatisfied ? '✓' : '✗'}
                                  </Text>
                                </Box>
                              </div>
                              <Box layoutDirection="row" justify="space-between" align="center" style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 8, marginTop: 4 }}>
                                <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
                                  {approvedCount} من {totalCount} منتجات معتمدة وجاهزة للنشر.
                                </Text>
                                <Button
                                  label="🚀 نشر الكتالوج بالكامل للعميل"
                                  tone="brand"
                                  size="sm"
                                  disabled={!(isCategoryMapped && isDuplicatesClean && isMediaSatisfied && approvedCount > 0)}
                                  onPress={() => {
                                    setProducts(prev => prev.map(p => {
                                      if (p.approvalStage === 'catalog-adopted') {
                                        return { ...p, approvalStage: 'client-visible' };
                                      }
                                      return p;
                                    }));
                                    alert('تم نشر جميع المنتجات الجاهزة بنجاح وأصبحت مرئية للعميل!');
                                  }}
                                />
                              </Box>
                            </Box>
                          )}
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
                                         tone={p.conflictReason ? 'danger' : resolvedStage === 'client-visible' ? 'success' : resolvedStage === 'catalog-approved' ? 'success' : 'warning'}
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

              {/* Inspector Panel */}
              {selectedProductId && selectedProduct && (
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

                       <InspectorTile title="ربط الفئة (Category Mapping)">
                          <Box gap={1}>
                            <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>الفئة الرئيسية:</Text>
                            <select
                              value={selectedProduct.categoryPath.main}
                              onChange={(e) => {
                                const newMain = e.target.value;
                                setProducts(prev => prev.map(p => p.id === selectedProduct.id ? {
                                  ...p,
                                  categoryPath: { ...p.categoryPath, main: newMain, sub: undefined, mainClassification: undefined, subClassification: undefined }
                                } : p));
                              }}
                              style={{
                                padding: '4px 6px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                backgroundColor: theme.surface,
                                color: theme.brandHeaderBackground,
                                border: `1px solid ${theme.lineStrong}`,
                                direction: 'rtl',
                                width: '100%'
                              }}
                            >
                              {previewCategories.map(c => (
                                <option key={c.id} value={c.id}>{c.label}</option>
                              ))}
                            </select>

                            <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right', marginTop: 4 }}>الفئة الفرعية:</Text>
                            <select
                              value={selectedProduct.categoryPath.sub || ''}
                              onChange={(e) => {
                                const newSub = e.target.value || undefined;
                                setProducts(prev => prev.map(p => p.id === selectedProduct.id ? {
                                  ...p,
                                  categoryPath: { ...p.categoryPath, sub: newSub, mainClassification: undefined, subClassification: undefined }
                                } : p));
                              }}
                              style={{
                                padding: '4px 6px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                backgroundColor: theme.surface,
                                color: theme.brandHeaderBackground,
                                border: `1px solid ${theme.lineStrong}`,
                                direction: 'rtl',
                                width: '100%'
                              }}
                            >
                              <option value="">لا يوجد (عام)</option>
                              {(previewCategories.find(c => c.id === selectedProduct.categoryPath.main)?.subcategories || []).map(s => (
                                <option key={s.id} value={s.id}>{s.label}</option>
                              ))}
                            </select>

                            {(() => {
                              const mainCat = previewCategories.find(c => c.id === selectedProduct.categoryPath.main);
                              const subCat = mainCat?.subcategories.find(s => s.id === selectedProduct.categoryPath.sub);
                              const mainClassifs = subCat?.mainClassifications || [];
                              if (!subCat || mainClassifs.length === 0) return null;
                              return (
                                <>
                                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right', marginTop: 4 }}>التصنيف الرئيسي:</Text>
                                  <select
                                    value={selectedProduct.categoryPath.mainClassification || ''}
                                    onChange={(e) => {
                                      const newMainClassif = e.target.value || undefined;
                                      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? {
                                        ...p,
                                        categoryPath: { ...p.categoryPath, mainClassification: newMainClassif, subClassification: undefined }
                                      } : p));
                                    }}
                                    style={{
                                      padding: '4px 6px',
                                      borderRadius: '4px',
                                      fontSize: '11px',
                                      backgroundColor: theme.surface,
                                      color: theme.brandHeaderBackground,
                                      border: `1px solid ${theme.lineStrong}`,
                                      direction: 'rtl',
                                      width: '100%'
                                    }}
                                  >
                                    <option value="">لا يوجد (عام)</option>
                                    {mainClassifs.map(mc => (
                                      <option key={mc.id} value={mc.id}>{mc.label}</option>
                                    ))}
                                  </select>

                                  {(() => {
                                    const selMainClassif = mainClassifs.find(mc => mc.id === selectedProduct.categoryPath.mainClassification);
                                    const subClassifs = selMainClassif?.subClassifications || [];
                                    if (!selMainClassif || subClassifs.length === 0) return null;
                                    return (
                                      <>
                                        <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right', marginTop: 4 }}>التصنيف الفرعي:</Text>
                                        <select
                                          value={selectedProduct.categoryPath.subClassification || ''}
                                          onChange={(e) => {
                                            const newSubClassif = e.target.value || undefined;
                                            setProducts(prev => prev.map(p => p.id === selectedProduct.id ? {
                                              ...p,
                                              categoryPath: { ...p.categoryPath, subClassification: newSubClassif }
                                            } : p));
                                          }}
                                          style={{
                                            padding: '4px 6px',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            backgroundColor: theme.surface,
                                            color: theme.brandHeaderBackground,
                                            border: `1px solid ${theme.lineStrong}`,
                                            direction: 'rtl',
                                            width: '100%'
                                          }}
                                        >
                                          <option value="">لا يوجد (عام)</option>
                                          {subClassifs.map(sc => (
                                            <option key={sc.id} value={sc.id}>{sc.label}</option>
                                          ))}
                                        </select>
                                      </>
                                    );
                                  })()}
                                </>
                              );
                            })()}
                          </Box>
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

                       {/* Governance & Approvals Action Section */}
                       <InspectorTile title="حوكمة واعتماد المنتج">
                          <Box gap={2}>
                            {selectedProduct.approvalStage === 'marketing-review' && (
                              <Box gap={1}>
                                <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>مراجعة التسويق معلقة:</Text>
                                <Box layoutDirection="row" gap={1}>
                                  <Button
                                    label="اعتماد مركزي"
                                    tone="primary"
                                    size="sm"
                                    style={{ flex: 1 }}
                                    onPress={() => {
                                      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, approvalStage: 'catalog-adopted', mediaPolicy: 'catalog-owned-media' } : p));
                                      alert('تم الاعتماد كمنتج مركزي');
                                    }}
                                  />
                                  <Button
                                    label="استثناء شريك"
                                    tone="secondary"
                                    size="sm"
                                    style={{ flex: 1 }}
                                    onPress={() => {
                                      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, approvalStage: 'catalog-adopted', mediaPolicy: 'partner-owned-exception' } : p));
                                      alert('تم الاعتماد كاستثناء شريك');
                                    }}
                                  />
                                </Box>
                                <Box layoutDirection="row" gap={1}>
                                  <Button
                                    label="طلب تعديل"
                                    tone="danger"
                                    size="sm"
                                    style={{ flex: 1 }}
                                    onPress={() => {
                                      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, approvalStage: 'catalog-draft' } : p));
                                      alert('تمت الإعادة لمسودة الكتالوج لتصحيح البيانات');
                                    }}
                                  />
                                </Box>
                              </Box>
                            )}

                            {selectedProduct.approvalStage === 'partner-review' && (
                              <Box gap={1}>
                                <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>مراجعة الجودة معلقة:</Text>
                                <Box layoutDirection="row" gap={1}>
                                  <Button
                                    label="تمرير الجودة"
                                    tone="primary"
                                    size="sm"
                                    style={{ flex: 1 }}
                                    onPress={() => {
                                      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, approvalStage: 'catalog-adopted' } : p));
                                      alert('تم تمرير فحص الجودة بنجاح');
                                    }}
                                  />
                                  <Button
                                    label="طلب تعديل"
                                    tone="secondary"
                                    size="sm"
                                    style={{ flex: 1 }}
                                    onPress={() => {
                                      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, approvalStage: 'catalog-draft' } : p));
                                      alert('تم إرجاع المنتج للمسودة للتعديل');
                                    }}
                                  />
                                </Box>
                              </Box>
                            )}

                            {selectedProduct.approvalStage === 'catalog-adopted' && (
                              <Box gap={1}>
                                <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>العنصر جاهز ومعتمد:</Text>
                                <Button
                                  label="نشر مباشر للعميل"
                                  tone="brand"
                                  size="sm"
                                  onPress={() => {
                                    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, approvalStage: 'client-visible' } : p));
                                    alert('تم النشر والظهور الفوري للعميل');
                                  }}
                                />
                              </Box>
                            )}

                            {selectedProduct.conflictReason && (
                              <Box gap={1}>
                                <Text role="caption" tone="danger" style={{ fontSize: 10, textAlign: 'right' }}>حل التعارض:</Text>
                                <Button
                                  label="دمج وحل التعارض"
                                  tone="primary"
                                  size="sm"
                                  onPress={() => {
                                    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, conflictReason: undefined } : p));
                                    alert('تم حل التعارض والدمج بنجاح');
                                  }}
                                />
                              </Box>
                            )}
                            {!selectedProduct.gtin && (
                              <Box gap={1}>
                                <Text role="caption" tone="warning" style={{ fontSize: 10, textAlign: 'right' }}>باركود مفقود:</Text>
                                <Button
                                  label="توليد باركود GTIN"
                                  tone="secondary"
                                  size="sm"
                                  onPress={() => {
                                    const barcode = `628${Math.floor(1000000000 + Math.random() * 9000000000)}`;
                                    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, gtin: barcode } : p));
                                    alert(`تم توليد باركود: ${barcode}`);
                                  }}
                                />
                              </Box>
                            )}

                            {selectedProduct.price > 100 && (
                              <Box gap={1}>
                                <Text role="caption" tone="warning" style={{ fontSize: 10, textAlign: 'right' }}>شذوذ في السعر (&gt; 100):</Text>
                                <Button
                                  label="تسوية السعر إلى 45.00"
                                  tone="secondary"
                                  size="sm"
                                  onPress={() => {
                                    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, price: 45.00 } : p));
                                    alert('تمت تسوية سعر المنتج');
                                  }}
                                />
                              </Box>
                            )}

                            <Box style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 4, marginTop: 4 }}>
                              <MiniInfoBox
                                label="حالة الاعتماد في الكتالوج"
                                value={selectedProduct.approvalStage}
                                valueColor={theme.brand}
                              />
                            </Box>
                          </Box>
                       </InspectorTile>

                      <Box gap={2} style={{ marginTop: 'auto' }}>
                          <Button
                            label="تعديل بيانات المنتج"
                            tone="primary"
                            size="sm"
                            fullWidth
                            onPress={() => {
                              setModalMode('edit');
                              setModalForm({
                                id: selectedProduct.id,
                                name: selectedProduct.name,
                                sku: selectedProduct.sku,
                                gtin: selectedProduct.gtin || '',
                                price: selectedProduct.price,
                                mainCat: selectedProduct.categoryPath.main,
                                subCat: selectedProduct.categoryPath.sub || '',
                                mainClassif: selectedProduct.categoryPath.mainClassification || '',
                                subClassif: selectedProduct.categoryPath.subClassification || '',
                                mediaPolicy: selectedProduct.mediaPolicy,
                                approvalStage: selectedProduct.approvalStage,
                                imageUri: selectedProduct.imageUri || '',
                                mediaKey: selectedProduct.mediaKey || '',
                              });
                              setShowProductModal(true);
                            }}
                          />
                         <Button label="معاينة إحالة للتسويق" tone="secondary" size="sm" fullWidth />
                      </Box>
                   </Box>
                </div>
              )}
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', height: '100%' }}>
                 {/* Right Panel: Modern Tree View (RTL) */}
                 <div style={{ flex: 1.3, borderLeft: '1px solid ' + theme.line, display: 'flex', flexDirection: 'column', backgroundColor: theme.surface, overflowY: 'auto', padding: '20px' }}>
                    <Box layoutDirection="row" justify="space-between" align="center" style={{ borderBottomWidth: 1, borderBottomColor: theme.line, paddingBottom: 12, marginBottom: 16 }}>
                       <Box gap={1}>
                          <Text role="bodyStrong" style={{ fontSize: 16, color: theme.brandHeaderBackground }}>هيكل الفئات والتصنيفات المركزية</Text>
                          <Text role="caption" tone="muted" style={{ fontSize: 11 }}>تصفح شجرة الفئات والتصنيفات، واضغط على أي عنصر لمراجعته وتعديل صورته</Text>
                       </Box>
                       <div style={{ flexShrink: 0, minWidth: 'fit-content', marginLeft: '8px' }}>
                          <Button
                            label="➕ فئة رئيسية جديدة"
                            tone="brand"
                            size="sm"
                            onPress={() => {
                              setAddingMainCat(true);
                              setAddingSubUnder(null);
                              setAddingMainClassifUnder(null);
                              setAddingSubClassifUnder(null);
                              setEditingEntry(null);
                              setFormLabel('');
                              setFormSubtitle('');
                              setCatError(null);
                            }}
                          />
                       </div>
                    </Box>

                    {catError && (
                      <div style={{
                        padding: '8px 12px', borderRadius: '6px', backgroundColor: theme.dangerSurface ?? theme.surfaceInset,
                        border: '1px solid ' + theme.danger, fontSize: '11px', color: theme.danger, fontWeight: 700,
                        marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}>
                        <span>{catError}</span>
                        <button onClick={() => setCatError(null)} style={{ appearance: 'none', border: 'none', background: 'none', color: theme.danger, cursor: 'pointer', fontSize: '12px', fontWeight: 950 }}>×</button>
                      </div>
                    )}

                    {/* Add main category inline form */}
                    {addingMainCat && (
                      <div style={{
                        padding: '12px', borderRadius: '8px', backgroundColor: theme.surfaceInset,
                        border: '1px solid ' + theme.brand, display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 16
                      }}>
                        <Text role="caption" style={{ fontWeight: 800, color: theme.brand }}>إضافة فئة رئيسية جديدة</Text>
                        <input
                          type="text" placeholder="اسم الفئة *" value={formLabel}
                          onChange={(e) => setFormLabel(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleAddMainCategory(); if (e.key === 'Escape') setAddingMainCat(false); }}
                          autoFocus
                          style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '12px', direction: 'rtl', border: '1px solid ' + theme.lineStrong, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
                        />
                        <input
                          type="text" placeholder="وصف الفئة" value={formSubtitle}
                          onChange={(e) => setFormSubtitle(e.target.value)}
                          style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '12px', direction: 'rtl', border: '1px solid ' + theme.lineStrong, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
                        />
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={handleAddMainCategory} style={{ padding: '4px 16px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>تأكيد</button>
                           <button onClick={() => { setAddingMainCat(false); setFormLabel(''); setFormSubtitle(''); }} style={{ padding: '4px 16px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, border: '1px solid ' + theme.lineStrong, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                        </div>
                      </div>
                    )}

                    {/* Search filter for taxonomy tree */}
                    <div style={{ marginBottom: 16 }}>
                       <SearchField
                          placeholder="ابحث عن فئة أو تصنيف..."
                          value={treeSearchQuery}
                          onChangeText={setTreeSearchQuery}
                       />
                    </div>

                    {/* Taxonomy Tree List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                       {filteredCategories.map(cat => {
                         const isCatExpanded = treeSearchQuery.trim() !== '' || expandedMainCategoryIds.has(cat.id);
                         const isSelected = selectedTaxonomyNode?.type === 'main' && selectedTaxonomyNode.mainId === cat.id;
                         const isHidden = hiddenCategoryIds.has(cat.id);
                         const pCount = getProductCountForCategory(cat.id);
                         const showActions = hoveredNodeId === cat.id || isSelected;

                         return (
                           <div
                             key={cat.id}
                             onMouseEnter={() => setHoveredNodeId(cat.id)}
                             onMouseLeave={() => setHoveredNodeId(null)}
                             style={{ borderRadius: '8px', border: '1px solid ' + (isSelected ? theme.brand : theme.line), backgroundColor: isHidden ? theme.surfaceInset : (isSelected ? theme.brandSurface : theme.surface), overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                           >
                             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}>
                                <button
                                  onClick={() => setSelectedTaxonomyNode({ type: 'main', mainId: cat.id })}
                                  style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', flex: 1, textAlign: 'right' }}
                                >
                                   {cat.subcategories.length > 0 ? (
                                     <span
                                       onClick={(e) => {
                                         e.stopPropagation();
                                         toggleMainCategoryExpand(cat.id);
                                       }}
                                       style={{
                                         fontSize: '11px',
                                         color: theme.textMuted,
                                         padding: '4px',
                                         cursor: 'pointer',
                                         display: 'inline-flex',
                                         alignItems: 'center',
                                         justifyContent: 'center',
                                         width: '18px',
                                         height: '18px'
                                       }}
                                     >
                                       {isCatExpanded ? '▼' : '◀'}
                                     </span>
                                   ) : (
                                     <span style={{ width: '18px', display: 'inline-block' }} />
                                   )}
                                   <WatermarkedImage src={cat.imageUri} mediaKey={cat.mediaKey} fallback={cat.emojiFallback} size={36} productName={cat.label} />
                                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                      <span style={{ fontSize: '13px', fontWeight: 700, color: theme.brandHeaderBackground }}>{cat.label}</span>
                                      {cat.subtitle && <span style={{ fontSize: '10.5px', color: theme.textMuted }}>{cat.subtitle}</span>}
                                   </div>
                                   <span style={{ fontSize: '10.5px', color: theme.textMuted, marginRight: 'auto', paddingLeft: '8px' }}>{pCount} منتج</span>
                                </button>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', opacity: showActions ? 1 : 0, pointerEvents: showActions ? 'auto' : 'none', transition: 'opacity 0.2s ease' }}>
                                   <button
                                     onClick={() => {
                                       setAddingSubUnder(cat.id);
                                       setSelectedTaxonomyNode({ type: 'main', mainId: cat.id });
                                       setFormLabel(''); setFormSubtitle('');
                                     }}
                                     style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, border: '1px solid ' + theme.line, cursor: 'pointer', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                                   >
                                     + فرعية
                                   </button>
                                   <button
                                     onClick={() => handleToggleCategoryHide(cat.id)}
                                     style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, border: '1px solid ' + theme.line, cursor: 'pointer', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                                   >
                                     {isHidden ? 'إظهار' : 'إخفاء'}
                                   </button>
                                   <button
                                     onClick={() => { if (confirm('هل أنت متأكد من حذف هذه الفئة بالكامل؟')) { handleDeleteNode('main', cat.id); setSelectedTaxonomyNode(null); } }}
                                     style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, border: '1px solid ' + theme.danger, cursor: 'pointer', backgroundColor: theme.surface, color: theme.danger }}
                                   >
                                     حذف
                                   </button>
                                </div>
                             </div>

                             {/* Add subcategory inline form */}
                             {addingSubUnder === cat.id && (
                               <div style={{ margin: '0 14px 12px 14px', padding: '10px', borderRadius: '6px', backgroundColor: theme.surfaceInset, border: '1px solid ' + theme.brand, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                 <span style={{ fontSize: '10px', fontWeight: 800, color: theme.brand }}>إضافة فئة فرعية تحت: {cat.label}</span>
                                 <input type="text" placeholder="اسم الفئة الفرعية *" value={formLabel} onChange={e => setFormLabel(e.target.value)}
                                   onKeyDown={e => { if (e.key === 'Enter') handleAddSubCategory(cat.id); }}
                                   autoFocus
                                   style={{ padding: '6px 10px', borderRadius: '4px', fontSize: '11px', direction: 'rtl', border: '1px solid ' + theme.lineStrong, backgroundColor: theme.surface, outline: 'none' }}
                                 />
                                 <input type="text" placeholder="وصف الفئة الفرعية" value={formSubtitle} onChange={e => setFormSubtitle(e.target.value)}
                                   style={{ padding: '6px 10px', borderRadius: '4px', fontSize: '11px', direction: 'rtl', border: '1px solid ' + theme.lineStrong, backgroundColor: theme.surface, outline: 'none' }}
                                 />
                                 <div style={{ display: 'flex', gap: '4px' }}>
                                   <button onClick={() => handleAddSubCategory(cat.id)} style={{ padding: '3px 12px', borderRadius: '3px', fontSize: '10.5px', fontWeight: 700, backgroundColor: theme.brand, color: theme.textInverse, border: 'none', cursor: 'pointer' }}>تأكيد</button>
                                   <button onClick={() => setAddingSubUnder(null)} style={{ padding: '3px 12px', borderRadius: '3px', fontSize: '10.5px', border: '1px solid ' + theme.lineStrong, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                 </div>
                               </div>
                             )}

                             {/* Subcategories list */}
                             {isCatExpanded && cat.subcategories.length > 0 && (
                               <div style={{ margin: '0 14px 12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {cat.subcategories.map(sub => {
                                    const isSubExpanded = treeSearchQuery.trim() !== '' || expandedSubCategoryIds.has(sub.id);
                                    const isSubSelected = selectedTaxonomyNode?.type === 'sub' && selectedTaxonomyNode.mainId === cat.id && selectedTaxonomyNode.subId === sub.id;
                                    const isSubHidden = hiddenSubCategoryIds.has(sub.id);
                                    const subCount = getProductCountForCategory(cat.id, sub.id);
                                    const showSubActions = hoveredNodeId === sub.id || isSubSelected;

                                    return (
                                      <div
                                        key={sub.id}
                                        onMouseEnter={() => setHoveredNodeId(sub.id)}
                                        onMouseLeave={() => setHoveredNodeId(null)}
                                        style={{
                                          borderRadius: '6px',
                                          border: '1px solid ' + (isSubSelected ? theme.brand : 'transparent'),
                                          backgroundColor: isSubHidden ? theme.surfaceInset : (isSubSelected ? theme.brandSurface : theme.surfaceInset),
                                          padding: '8px',
                                          overflow: 'hidden',
                                          marginRight: '20px' // Indentation replacing connect symbols
                                        }}
                                      >
                                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <button
                                              onClick={() => setSelectedTaxonomyNode({ type: 'sub', mainId: cat.id, subId: sub.id })}
                                              style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', flex: 1, textAlign: 'right' }}
                                            >
                                               {(sub.mainClassifications && sub.mainClassifications.length > 0) ? (
                                                 <span
                                                   onClick={(e) => {
                                                     e.stopPropagation();
                                                     toggleSubCategoryExpand(sub.id);
                                                   }}
                                                   style={{
                                                     fontSize: '10px',
                                                     color: theme.textMuted,
                                                     padding: '3px',
                                                     cursor: 'pointer',
                                                     display: 'inline-flex',
                                                     alignItems: 'center',
                                                     justifyContent: 'center',
                                                     width: '16px',
                                                     height: '16px'
                                                   }}
                                                 >
                                                   {isSubExpanded ? '▼' : '◀'}
                                                 </span>
                                               ) : (
                                                 <span style={{ width: '16px', display: 'inline-block' }} />
                                               )}
                                               <WatermarkedImage src={sub.imageUri} mediaKey={sub.mediaKey} fallback={sub.emojiFallback || '📂'} size={28} productName={sub.label} />
                                               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                  <span style={{ fontSize: '12px', fontWeight: 700, color: theme.brandHeaderBackground }}>{sub.label}</span>
                                                  {sub.subtitle && <span style={{ fontSize: '9.5px', color: theme.textMuted }}>{sub.subtitle}</span>}
                                               </div>
                                               <span style={{ fontSize: '9.5px', color: theme.textMuted, marginRight: 'auto', paddingLeft: '8px' }}>{subCount}</span>
                                            </button>
                                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', opacity: showSubActions ? 1 : 0, pointerEvents: showSubActions ? 'auto' : 'none', transition: 'opacity 0.2s ease' }}>
                                               <button
                                                 onClick={() => {
                                                   setAddingMainClassifUnder({ mainId: cat.id, subId: sub.id });
                                                   setSelectedTaxonomyNode({ type: 'sub', mainId: cat.id, subId: sub.id });
                                                   setFormLabel('');
                                                 }}
                                                 style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9.5px', border: '1px solid ' + theme.line, cursor: 'pointer', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                                               >
                                                 + تصنيف
                                               </button>
                                               <button onClick={() => handleToggleSubCategoryHide(sub.id)} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9.5px', border: '1px solid ' + theme.line, cursor: 'pointer', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}>
                                                 {isSubHidden ? 'إظهار' : 'إخفاء'}
                                               </button>
                                               <button onClick={() => { if (confirm('هل أنت متأكد من حذف هذه الفئة الفرعية بالكامل؟')) { handleDeleteNode('sub', cat.id, sub.id); setSelectedTaxonomyNode(null); } }} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9.5px', border: '1px solid ' + theme.danger, cursor: 'pointer', backgroundColor: theme.surface, color: theme.danger }}>
                                                 حذف
                                               </button>
                                            </div>
                                         </div>

                                         {/* Add main classification inline form */}
                                         {addingMainClassifUnder?.mainId === cat.id && addingMainClassifUnder?.subId === sub.id && (
                                           <div style={{ margin: '6px 12px 6px 4px', padding: '8px', borderRadius: '4px', backgroundColor: theme.surface, border: '1px solid ' + theme.brand, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                             <span style={{ fontSize: '9.5px', fontWeight: 800, color: theme.brand }}>إضافة تصنيف رئيسي جديد تحت: {sub.label}</span>
                                             <input type="text" placeholder="اسم التصنيف *" value={formLabel} onChange={e => setFormLabel(e.target.value)}
                                               onKeyDown={e => { if (e.key === 'Enter') handleAddMainClassification(cat.id, sub.id); }}
                                               autoFocus
                                               style={{ padding: '4px 8px', borderRadius: '3px', fontSize: '10.5px', direction: 'rtl', border: '1px solid ' + theme.lineStrong, backgroundColor: theme.surface, outline: 'none' }}
                                             />
                                             <div style={{ display: 'flex', gap: '4px' }}>
                                               <button onClick={() => handleAddMainClassification(cat.id, sub.id)} style={{ padding: '2px 10px', borderRadius: '3px', fontSize: '9.5px', fontWeight: 700, backgroundColor: theme.brand, color: theme.textInverse, border: 'none', cursor: 'pointer' }}>تأكيد</button>
                                               <button onClick={() => setAddingMainClassifUnder(null)} style={{ padding: '2px 10px', borderRadius: '3px', fontSize: '9.5px', border: '1px solid ' + theme.lineStrong, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                             </div>
                                           </div>
                                         )}

                                         {/* Main Classifications */}
                                         {isSubExpanded && sub.mainClassifications && sub.mainClassifications.length > 0 && (
                                           <div style={{ margin: '6px 4px 2px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                              {sub.mainClassifications.map(classif => {
                                                const isClassifExpanded = treeSearchQuery.trim() !== '' || expandedMainClassifIds.has(classif.id);
                                                const isClassifSelected = selectedTaxonomyNode?.type === 'mainClassif' && selectedTaxonomyNode.mainId === cat.id && selectedTaxonomyNode.subId === sub.id && selectedTaxonomyNode.mainClassifId === classif.id;
                                                const showClassifActions = hoveredNodeId === classif.id || isClassifSelected;

                                                return (
                                                  <div
                                                    key={classif.id}
                                                    onMouseEnter={() => setHoveredNodeId(classif.id)}
                                                    onMouseLeave={() => setHoveredNodeId(null)}
                                                    style={{
                                                      display: 'flex',
                                                      flexDirection: 'column',
                                                      gap: '4px',
                                                      backgroundColor: theme.surface,
                                                      borderRadius: '4px',
                                                      border: '1px solid ' + (isClassifSelected ? theme.brand : theme.line),
                                                      padding: '6px',
                                                      marginRight: '20px' // Indentation replacing connect symbols
                                                    }}
                                                  >
                                                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <button
                                                          onClick={() => setSelectedTaxonomyNode({ type: 'mainClassif', mainId: cat.id, subId: sub.id, mainClassifId: classif.id })}
                                                          style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flex: 1, textAlign: 'right' }}
                                                        >
                                                           {(classif.subClassifications && classif.subClassifications.length > 0) ? (
                                                             <span
                                                               onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 toggleMainClassifExpand(classif.id);
                                                               }}
                                                               style={{
                                                                 fontSize: '9px',
                                                                 color: theme.textMuted,
                                                                 padding: '2px',
                                                                 cursor: 'pointer',
                                                                 display: 'inline-flex',
                                                                 alignItems: 'center',
                                                                 justifyContent: 'center',
                                                                 width: '14px',
                                                                 height: '14px'
                                                               }}
                                                             >
                                                               {isClassifExpanded ? '▼' : '◀'}
                                                             </span>
                                                           ) : (
                                                             <span style={{ width: '14px', display: 'inline-block' }} />
                                                           )}
                                                           <WatermarkedImage src={classif.imageUri} mediaKey={classif.mediaKey} fallback={classif.emojiFallback || '🔹'} size={24} productName={classif.label} />
                                                           <span style={{ fontSize: '11px', fontWeight: 600, color: theme.brandHeaderBackground }}>{classif.label}</span>
                                                        </button>
                                                        <div style={{ display: 'flex', gap: '3px', alignItems: 'center', opacity: showClassifActions ? 1 : 0, pointerEvents: showClassifActions ? 'auto' : 'none', transition: 'opacity 0.2s ease' }}>
                                                           <button
                                                             onClick={() => {
                                                               setAddingSubClassifUnder({ mainId: cat.id, subId: sub.id, mainClassifId: classif.id });
                                                               setSelectedTaxonomyNode({ type: 'mainClassif', mainId: cat.id, subId: sub.id, mainClassifId: classif.id });
                                                               setFormLabel('');
                                                             }}
                                                             style={{ padding: '1px 5px', borderRadius: '3px', fontSize: '8.5px', border: '1px solid ' + theme.line, cursor: 'pointer', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                                                           >
                                                             + فرعي
                                                           </button>
                                                           <button onClick={() => { if (confirm('هل أنت متأكد من حذف هذا التصنيف الرئيسي بالكامل؟')) { handleDeleteNode('mainClassif', cat.id, sub.id, classif.id); setSelectedTaxonomyNode(null); } }} style={{ padding: '1px 5px', borderRadius: '3px', fontSize: '8.5px', border: '1px solid ' + theme.danger, cursor: 'pointer', backgroundColor: theme.surface, color: theme.danger }}>
                                                             حذف
                                                           </button>
                                                        </div>
                                                     </div>

                                                      {/* Add sub classification inline form */}
                                                      {addingSubClassifUnder?.mainId === cat.id && addingSubClassifUnder?.subId === sub.id && addingSubClassifUnder?.mainClassifId === classif.id && (
                                                        <div style={{ margin: '4px 12px 4px 4px', padding: '6px', borderRadius: '3px', backgroundColor: theme.surfaceInset, border: '1px solid ' + theme.brand, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                          <span style={{ fontSize: '8.5px', fontWeight: 800, color: theme.brand }}>إضافة تصنيف فرعي جديد تحت: {classif.label}</span>
                                                          <input type="text" placeholder="اسم التصنيف الفرعي *" value={formLabel} onChange={e => setFormLabel(e.target.value)}
                                                            onKeyDown={e => { if (e.key === 'Enter') handleAddSubClassification(cat.id, sub.id, classif.id); }}
                                                            autoFocus
                                                            style={{ padding: '3px 6px', borderRadius: '2px', fontSize: '9.5px', direction: 'rtl', border: '1px solid ' + theme.lineStrong, backgroundColor: theme.surface, outline: 'none' }}
                                                          />
                                                          <div style={{ display: 'flex', gap: '3px' }}>
                                                            <button onClick={() => handleAddSubClassification(cat.id, sub.id, classif.id)} style={{ padding: '1px 8px', borderRadius: '2px', fontSize: '8.5px', fontWeight: 700, backgroundColor: theme.brand, color: theme.textInverse, border: 'none', cursor: 'pointer' }}>تأكيد</button>
                                                            <button onClick={() => setAddingSubClassifUnder(null)} style={{ padding: '1px 8px', borderRadius: '2px', fontSize: '8.5px', border: '1px solid ' + theme.lineStrong, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                                          </div>
                                                        </div>
                                                      )}

                                                      {/* Sub classifications list */}
                                                      {isClassifExpanded && classif.subClassifications && classif.subClassifications.length > 0 && (
                                                        <div style={{ margin: '3px 2px 2px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                           {classif.subClassifications.map(subc => {
                                                             const isSubcSelected = selectedTaxonomyNode?.type === 'subClassif' && selectedTaxonomyNode.mainId === cat.id && selectedTaxonomyNode.subId === sub.id && selectedTaxonomyNode.mainClassifId === classif.id && selectedTaxonomyNode.subClassifId === subc.id;
                                                             const showSubcActions = hoveredNodeId === subc.id || isSubcSelected;

                                                             return (
                                                               <div
                                                                 key={subc.id}
                                                                 onMouseEnter={() => setHoveredNodeId(subc.id)}
                                                                 onMouseLeave={() => setHoveredNodeId(null)}
                                                                 style={{
                                                                   display: 'flex',
                                                                   alignItems: 'center',
                                                                   justifyContent: 'space-between',
                                                                   backgroundColor: theme.surfaceInset,
                                                                   borderRadius: '4px',
                                                                   border: '1px solid ' + (isSubcSelected ? theme.brand : 'transparent'),
                                                                   padding: '3px 8px',
                                                                   marginRight: '20px'
                                                                 }}
                                                               >
                                                                  <button
                                                                    onClick={() => setSelectedTaxonomyNode({ type: 'subClassif', mainId: cat.id, subId: sub.id, mainClassifId: classif.id, subClassifId: subc.id })}
                                                                    style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flex: 1, textAlign: 'right' }}
                                                                  >
                                                                     <WatermarkedImage src={subc.imageUri} mediaKey={subc.mediaKey} fallback={subc.emojiFallback || '🔸'} size={20} productName={subc.label} />
                                                                     <span style={{ fontSize: '10px', color: theme.brandHeaderBackground }}>{subc.label}</span>
                                                                  </button>
                                                                  <button
                                                                    onClick={() => { if (confirm('هل أنت متأكد من حذف هذا التصنيف الفرعي؟')) { handleDeleteNode('subClassif', cat.id, sub.id, classif.id, subc.id); setSelectedTaxonomyNode(null); } }}
                                                                    style={{
                                                                      padding: '1px 5px',
                                                                      borderRadius: '2px',
                                                                      fontSize: '8px',
                                                                      border: '1px solid ' + theme.danger,
                                                                      cursor: 'pointer',
                                                                      backgroundColor: 'transparent',
                                                                      color: theme.danger,
                                                                      opacity: showSubcActions ? 1 : 0,
                                                                      pointerEvents: showSubcActions ? 'auto' : 'none',
                                                                      transition: 'opacity 0.2s ease'
                                                                    }}
                                                                  >
                                                                    حذف
                                                                  </button>
                                                               </div>
                                                             );
                                                           })}
                                                        </div>
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
                              )}
                           </div>
                         );
                       })}
                    </div>
                 </div>

                 {/* Left Panel: Selected Node Inspector & Details Editor */}
                 <div style={{ width: '380px', display: 'flex', flexDirection: 'column', backgroundColor: theme.surfaceInset, padding: '20px', overflowY: 'auto', borderRight: '1px solid ' + theme.line }}>
                    {selectedTaxonomyNode ? (() => {
                       const mainCat = previewCategories.find(c => c.id === selectedTaxonomyNode.mainId);
                       const subCat = mainCat?.subcategories.find(s => s.id === selectedTaxonomyNode.subId);
                       const mainClassif = subCat?.mainClassifications?.find(mc => mc.id === selectedTaxonomyNode.mainClassifId);
                       const subClassif = mainClassif?.subClassifications?.find(sc => sc.id === selectedTaxonomyNode.subClassifId);

                       const updateNodeField = (fields: Partial<{ label: string; subtitle: string; emojiFallback: string; imageUri: string; mediaKey: string }>) => {
                         setPreviewCategories(prev => {
                           return prev.map(c => {
                             if (selectedTaxonomyNode.type === 'main' && c.id === selectedTaxonomyNode.mainId) {
                               return { ...c, ...fields };
                             }
                             if (c.id === selectedTaxonomyNode.mainId) {
                               return {
                                 ...c,
                                 subcategories: c.subcategories.map(s => {
                                   if (selectedTaxonomyNode.type === 'sub' && s.id === selectedTaxonomyNode.subId) {
                                     return { ...s, ...fields };
                                   }
                                   if (s.id === selectedTaxonomyNode.subId) {
                                     return {
                                       ...s,
                                       mainClassifications: (s.mainClassifications || []).map(mc => {
                                         if (selectedTaxonomyNode.type === 'mainClassif' && mc.id === selectedTaxonomyNode.mainClassifId) {
                                           return { ...mc, ...fields };
                                         }
                                         if (mc.id === selectedTaxonomyNode.mainClassifId) {
                                           return {
                                             ...mc,
                                             subClassifications: (mc.subClassifications || []).map(sc => {
                                               if (selectedTaxonomyNode.type === 'subClassif' && sc.id === selectedTaxonomyNode.subClassifId) {
                                                 return { ...sc, ...fields };
                                               }
                                               return sc;
                                             })
                                           };
                                         }
                                         return mc;
                                       })
                                     };
                                   }
                                   return s;
                                 })
                               };
                             }
                             return c;
                           });
                         });
                       };

                       let nodeLabel = '';
                       let nodeSubtitle = '';
                       let nodeEmoji = '';
                       let nodeImageUri = '';
                       let nodeMediaKey = '';
                       let nodeTypeLabel = '';

                       if (selectedTaxonomyNode.type === 'main' && mainCat) {
                         nodeLabel = mainCat.label;
                         nodeSubtitle = mainCat.subtitle;
                         nodeEmoji = mainCat.emojiFallback || '';
                         nodeImageUri = mainCat.imageUri || '';
                         nodeMediaKey = mainCat.mediaKey || '';
                         nodeTypeLabel = 'فئة رئيسية';
                       } else if (selectedTaxonomyNode.type === 'sub' && subCat) {
                         nodeLabel = subCat.label;
                         nodeSubtitle = subCat.subtitle;
                         nodeEmoji = subCat.emojiFallback || '';
                         nodeImageUri = subCat.imageUri || '';
                         nodeMediaKey = subCat.mediaKey || '';
                         nodeTypeLabel = 'فئة فرعية';
                       } else if (selectedTaxonomyNode.type === 'mainClassif' && mainClassif) {
                         nodeLabel = mainClassif.label;
                         nodeEmoji = mainClassif.emojiFallback || '';
                         nodeImageUri = mainClassif.imageUri || '';
                         nodeMediaKey = mainClassif.mediaKey || '';
                         nodeTypeLabel = 'تصنيف رئيسي';
                       } else if (selectedTaxonomyNode.type === 'subClassif' && subClassif) {
                         nodeLabel = subClassif.label;
                         nodeEmoji = subClassif.emojiFallback || '';
                         nodeImageUri = subClassif.imageUri || '';
                         nodeMediaKey = subClassif.mediaKey || '';
                         nodeTypeLabel = 'تصنيف فرعي';
                       } else {
                         return (
                           <Box align="center" justify="center" style={{ flex: 1 }}>
                              <Text role="caption" tone="muted">العنصر المختار لم يعد موجوداً في الشجرة.</Text>
                           </Box>
                         );
                       }

                        const bindedProducts = products.filter(p => {
                          if (selectedTaxonomyNode.type === 'main') return p.categoryPath.main === selectedTaxonomyNode.mainId;
                          if (selectedTaxonomyNode.type === 'sub') return p.categoryPath.main === selectedTaxonomyNode.mainId && p.categoryPath.sub === selectedTaxonomyNode.subId;
                          if (selectedTaxonomyNode.type === 'mainClassif') return p.categoryPath.mainClassification === selectedTaxonomyNode.mainClassifId;
                          return p.categoryPath.subClassification === selectedTaxonomyNode.subClassifId;
                        });

                        return (
                          <Box gap={4} style={{ flex: 1 }}>
                             <Box layoutDirection="row" justify="space-between" align="center" style={{ borderBottomWidth: 1, borderBottomColor: theme.line, paddingBottom: 10 }}>
                                <Box gap={1}>
                                   <Text role="bodyStrong" style={{ fontSize: 14, color: theme.brandHeaderBackground }}>مراجعة وتعديل: {nodeTypeLabel}</Text>
                                   <Text role="caption" tone="muted" style={{ fontSize: 10 }}>معرف النظام: {selectedTaxonomyNode.subClassifId || selectedTaxonomyNode.mainClassifId || selectedTaxonomyNode.subId || selectedTaxonomyNode.mainId}</Text>
                                </Box>
                                <Button label="✕ إغلاق" tone="secondary" size="sm" onPress={() => setSelectedTaxonomyNode(null)} />
                             </Box>

                             {/* Visual Preview Card */}
                             <Surface tone="raised" padding={4} style={{ borderRadius: '12px', borderWidth: 1, borderStyle: 'solid', borderColor: theme.lineStrong, backgroundColor: theme.surface, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} align="center" gap={2}>
                                {nodeMediaKey || nodeImageUri ? (
                                  <WatermarkedImage src={nodeImageUri} mediaKey={nodeMediaKey} fallback={nodeEmoji || '📦'} size={64} productName={nodeLabel} />
                                ) : (
                                  <div style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: theme.brandSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                     <span style={{ fontSize: '36px' }}>{nodeEmoji || '📦'}</span>
                                  </div>
                                )}
                                <Text role="bodyStrong" style={{ fontSize: 14, marginTop: 6, color: theme.brandHeaderBackground }}>{nodeLabel}</Text>
                                {nodeSubtitle ? <Text role="caption" tone="muted" style={{ fontSize: 11, textAlign: 'center', marginTop: 2 }}>{nodeSubtitle}</Text> : null}
                             </Surface>

                             {/* Editing Fields */}
                             <Box gap={3}>
                                <Box gap={1}>
                                   <Text role="caption" tone="muted" style={{ fontSize: 11, fontWeight: 700, textAlign: 'right' }}>اسم العنصر *</Text>
                                   <input
                                     type="text"
                                     value={nodeLabel}
                                     onChange={e => {
                                       updateNodeField({ label: e.target.value });
                                     }}
                                     style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '12px' }}
                                   />
                                </Box>

                                {(selectedTaxonomyNode.type === 'main' || selectedTaxonomyNode.type === 'sub') && (
                                  <Box gap={1}>
                                     <Text role="caption" tone="muted" style={{ fontSize: 11, fontWeight: 700, textAlign: 'right' }}>الوصف أو الترجمة الفرعية</Text>
                                     <input
                                       type="text"
                                       value={nodeSubtitle}
                                       onChange={e => {
                                         updateNodeField({ subtitle: e.target.value });
                                       }}
                                       style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '12px' }}
                                     />
                                  </Box>
                                )}

                               {/* Image & Icon Section */}
                               <Box gap={2} style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 12, marginTop: 4 }}>
                                  <Text role="caption" style={{ fontWeight: 800, color: theme.brandHeaderBackground, textAlign: 'right', fontSize: 11 }}>إدارة وصورة الفئة (Category Image & Icon)</Text>

                                  <Box layoutDirection="row" gap={2}>
                                     <Box style={{ flex: 1 }} gap={1}>
                                        <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>أيقونة تعبيرية (Emoji)</Text>
                                        <input
                                          type="text"
                                          value={nodeEmoji}
                                          placeholder="أدخل الرمز التعبيري هنا..."
                                          onChange={e => {
                                            updateNodeField({ emojiFallback: e.target.value });
                                          }}
                                          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '11px' }}
                                        />
                                     </Box>

                                     <Box style={{ flex: 1 }} gap={1}>
                                        <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>قالب جاهز (Template)</Text>
                                        <select
                                          value={nodeMediaKey}
                                          onChange={e => {
                                            const key = e.target.value;
                                            let uri = '';
                                            if (key === 'dsh.product.apple.v1') uri = '/dsh/media-fixtures/products/apple.v1.png';
                                            else if (key === 'dsh.product.milk.v1') uri = '/dsh/media-fixtures/products/milk.v1.png';
                                            else if (key === 'dsh.product.bread.v1') uri = '/dsh/media-fixtures/products/bread.v1.png';
                                            else if (key === 'dsh.product.chicken.v1') uri = '/dsh/media-fixtures/restaurants/chicken.v1.png';
                                            else if (key === 'dsh.product.pasta.v1') uri = '/dsh/media-fixtures/products/pasta.v1.png';
                                            else if (key === 'dsh.product.choco.v1') uri = '/dsh/media-fixtures/sweets/choco.v1.png';
                                            else if (key === 'dsh.product.roll.v1') uri = '/dsh/media-fixtures/dates/lead-5.dates-box.v1.png';
                                            else if (key === 'dsh.product.lead-5.dates-box.v1') uri = 'dsh.product.lead-5.dates-box.v1';

                                            updateNodeField({ mediaKey: key, imageUri: uri });
                                          }}
                                          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '11px' }}
                                        >
                                           <option value="">اختر قالب جاهز...</option>
                                           <option value="dsh.product.apple.v1">🍎 تفاح</option>
                                           <option value="dsh.product.milk.v1">🥛 حليب</option>
                                           <option value="dsh.product.bread.v1">🍞 خبز</option>
                                           <option value="dsh.product.chicken.v1">🍗 دجاج</option>
                                           <option value="dsh.product.pasta.v1">🍝 باستا</option>
                                           <option value="dsh.product.choco.v1">🍰 كيكة</option>
                                           <option value="dsh.product.lead-5.dates-box.v1">🌴 تمر فاخر</option>
                                        </select>
                                     </Box>
                                  </Box>

                                  <Box gap={1}>
                                     <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>أو رابط صورة مخصص (URL / Local Path)</Text>
                                     <input
                                       type="text"
                                       value={nodeImageUri && !nodeImageUri.startsWith('data:') ? nodeImageUri : ''}
                                       placeholder="أدخل مسار الصورة أو الرابط المباشر..."
                                       onChange={e => {
                                         updateNodeField({ mediaKey: '', imageUri: e.target.value });
                                       }}
                                       style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid ' + theme.lineStrong, direction: 'ltr', textAlign: 'left', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '11px' }}
                                     />
                                  </Box>

                                  <Box gap={1}>
                                     <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>أو تحميل ملف صورة مباشرة (Upload Image)</Text>
                                     <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                       <label style={{
                                         flex: 1,
                                         display: 'flex',
                                         alignItems: 'center',
                                         justifyContent: 'center',
                                         gap: '6px',
                                         padding: '8px 12px',
                                         borderRadius: '6px',
                                         border: '1px dashed ' + theme.brand,
                                         backgroundColor: theme.brandSurface,
                                         color: theme.brand,
                                         cursor: 'pointer',
                                         fontSize: '11px',
                                         fontWeight: 'bold',
                                         transition: 'all 0.15s ease',
                                       }}>
                                         📁 اختر صورة من جهازك
                                         <input
                                           type="file"
                                           accept="image/*"
                                           style={{ display: 'none' }}
                                           onChange={e => {
                                             const file = e.target.files?.[0];
                                             if (file) {
                                               const reader = new FileReader();
                                               reader.onload = (event) => {
                                                 const base64 = event.target?.result as string;
                                                 updateNodeField({ mediaKey: '', imageUri: base64 });
                                               };
                                               reader.readAsDataURL(file);
                                             }
                                           }}
                                         />
                                       </label>

                                       {(nodeImageUri || nodeMediaKey) && (
                                         <button
                                           onClick={() => updateNodeField({ mediaKey: '', imageUri: '' })}
                                           style={{
                                             padding: '8px 12px',
                                             borderRadius: '6px',
                                             border: '1px solid ' + theme.danger,
                                             backgroundColor: 'transparent',
                                             color: theme.danger,
                                             fontSize: '11px',
                                             fontWeight: 'bold',
                                             cursor: 'pointer',
                                           }}
                                         >
                                           🗑️ إزالة الصورة
                                         </button>
                                       )}
                                     </div>
                                  </Box>
                               </Box>
                           </Box>

                           {/* Products Linked Table Preview */}
                           <Box gap={1} style={{ flex: 1, minHeight: 0, marginTop: 12 }}>
                              <Text role="caption" style={{ fontWeight: 800, color: theme.brandHeaderBackground, textAlign: 'right', fontSize: 11 }}>المنتجات المرتبطة ({bindedProducts.length} )</Text>
                              <div style={{ flex: 1, overflowY: 'auto', border: '1px solid ' + theme.line, borderRadius: '6px', backgroundColor: theme.surface }}>
                                 {bindedProducts.length === 0 ? (
                                   <Box align="center" justify="center" style={{ padding: 24 }}>
                                      <Text role="caption" tone="muted" style={{ fontSize: 11 }}>لا توجد منتجات مرتبطة بهذا المستوى.</Text>
                                   </Box>
                                 ) : (
                                   <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                      <tbody>
                                         {bindedProducts.map(p => (
                                           <tr key={p.id} style={{ borderBottom: '1px solid ' + theme.line }}>
                                              <td style={{ padding: '8px' }}>
                                                 <WatermarkedImage src={p.imageUri} mediaKey={p.mediaKey} fallback={p.emojiFallback} size={28} productName={p.name} />
                                              </td>
                                              <td style={{ padding: '8px', textAlign: 'right' }}>
                                                 <Text role="caption" style={{ fontWeight: 700, fontSize: 11, color: theme.brandHeaderBackground }}>{p.name}</Text>
                                              </td>
                                              <td style={{ padding: '8px', textAlign: 'left' }}>
                                                 <Text role="caption" tone="muted" style={{ fontSize: 10 }}>{p.sku}</Text>
                                              </td>
                                           </tr>
                                         ))}
                                      </tbody>
                                   </table>
                                 )}
                              </div>
                           </Box>
                        </Box>
                      );
                    })() : (
                      <Box align="center" justify="center" style={{ flex: 1, opacity: 0.6 }} gap={2}>
                         <span style={{ fontSize: '56px' }}>📂</span>
                         <Text role="bodyStrong" style={{ textAlign: 'center', fontSize: 14, color: theme.brandHeaderBackground }}>يرجى تحديد عنصر لبدء المراجعة</Text>
                         <Text role="caption" tone="muted" style={{ textAlign: 'center', fontSize: 11, maxWidth: 280, lineHeight: 1.4 }}>اضغط على أي فئة رئيسية، فئة فرعية، تصنيف رئيسي أو تصنيف فرعي لمعاينة تفاصيله، تعديل بياناته، أو تغيير صورته وأيقونته فوراً.</Text>
                      </Box>
                    )}
                 </div>
              </div>
            )}

          </div>
        </div>
      </main>
      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <Surface tone="raised" padding={4} gap={3} style={{ width: 420, maxWidth: '90%', maxHeight: '90%', overflowY: 'auto' } as any}>
            <Box layoutDirection="row" justify="space-between" align="center" style={{ borderBottomWidth: 1, borderBottomColor: theme.line, paddingBottom: 8 }}>
              <Text role="bodyStrong" style={{ fontSize: 16 }}>{modalMode === 'add' ? 'إضافة منتج جديد' : 'تعديل منتج الكتالوج'}</Text>
              <Button label="✕" accessibilityLabel="إغلاق" tone="secondary" size="sm" onPress={() => setShowProductModal(false)} />
            </Box>

            <Box gap={2}>
              <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>اسم المنتج *</Text>
              <input
                type="text"
                value={modalForm.name}
                onChange={e => setModalForm(prev => ({ ...prev, name: e.target.value }))}
                style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
              />

              <Box layoutDirection="row" gap={2}>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>المعرف (SKU) *</Text>
                  <input
                    type="text"
                    value={modalForm.sku}
                    onChange={e => setModalForm(prev => ({ ...prev, sku: e.target.value }))}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  />
                </Box>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>الباركود (GTIN)</Text>
                  <input
                    type="text"
                    value={modalForm.gtin}
                    onChange={e => setModalForm(prev => ({ ...prev, gtin: e.target.value }))}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  />
                </Box>
              </Box>

              <Box layoutDirection="row" gap={2}>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>السعر *</Text>
                  <input
                    type="number"
                    value={modalForm.price}
                    onChange={e => setModalForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  />
                </Box>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>مفتاح الصورة (Media Key)</Text>
                  <select
                    value={modalForm.mediaKey}
                    onChange={e => {
                      const key = e.target.value;
                      let uri = '';
                      if (key === 'dsh.product.apple.v1') uri = '/dsh/media-fixtures/products/apple.v1.png';
                      else if (key === 'dsh.product.milk.v1') uri = '/dsh/media-fixtures/products/milk.v1.png';
                      else if (key === 'dsh.product.bread.v1') uri = '/dsh/media-fixtures/products/bread.v1.png';
                      else if (key === 'dsh.product.chicken.v1') uri = '/dsh/media-fixtures/restaurants/chicken.v1.png';
                      else if (key === 'dsh.product.pasta.v1') uri = '/dsh/media-fixtures/products/pasta.v1.png';
                      else if (key === 'dsh.product.choco.v1') uri = '/dsh/media-fixtures/sweets/choco.v1.png';
                      else if (key === 'dsh.product.roll.v1') uri = '/dsh/media-fixtures/dates/lead-5.dates-box.v1.png';
                      else if (key === 'dsh.product.lead-5.dates-box.v1') uri = 'dsh.product.lead-5.dates-box.v1';
                      setModalForm(prev => ({ ...prev, mediaKey: key, imageUri: uri }));
                    }}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  >
                    <option value="">بدون (أيقونة تعبيرية)</option>
                    <option value="dsh.product.apple.v1">🍎 تفاح</option>
                    <option value="dsh.product.milk.v1">🥛 حليب</option>
                    <option value="dsh.product.bread.v1">🍞 خبز</option>
                    <option value="dsh.product.chicken.v1">🍗 دجاج</option>
                    <option value="dsh.product.pasta.v1">🍝 باستا</option>
                    <option value="dsh.product.choco.v1">🍰 كيكة</option>
                    <option value="dsh.product.roll.v1">🌴 تمر (مؤقت)</option>
                    <option value="dsh.product.lead-5.dates-box.v1">🌴 علبة التمر الفاخرة</option>
                  </select>
                </Box>
              </Box>

              <Box layoutDirection="row" gap={2}>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>الفئة الرئيسية *</Text>
                  <select
                    value={modalForm.mainCat}
                    onChange={e => setModalForm(prev => ({ ...prev, mainCat: e.target.value, subCat: '', mainClassif: '', subClassif: '' }))}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  >
                    {previewCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </Box>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>الفئة الفرعية</Text>
                  <select
                    value={modalForm.subCat}
                    onChange={e => setModalForm(prev => ({ ...prev, subCat: e.target.value, mainClassif: '', subClassif: '' }))}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  >
                    <option value="">لا يوجد (عام)</option>
                    {(previewCategories.find(c => c.id === modalForm.mainCat)?.subcategories || []).map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </Box>
              </Box>

              <Box layoutDirection="row" gap={2}>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>التصنيف الرئيسي</Text>
                  <select
                    value={modalForm.mainClassif}
                    onChange={e => setModalForm(prev => ({ ...prev, mainClassif: e.target.value, subClassif: '' }))}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  >
                    <option value="">لا يوجد (عام)</option>
                    {(() => {
                      const mCat = previewCategories.find(c => c.id === modalForm.mainCat);
                      const sCat = mCat?.subcategories.find(s => s.id === modalForm.subCat);
                      return (sCat?.mainClassifications || []).map(mc => (
                        <option key={mc.id} value={mc.id}>{mc.label}</option>
                      ));
                    })()}
                  </select>
                </Box>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>التصنيف الفرعي</Text>
                  <select
                    value={modalForm.subClassif}
                    onChange={e => setModalForm(prev => ({ ...prev, subClassif: e.target.value }))}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  >
                    <option value="">لا يوجد (عام)</option>
                    {(() => {
                      const mCat = previewCategories.find(c => c.id === modalForm.mainCat);
                      const sCat = mCat?.subcategories.find(s => s.id === modalForm.subCat);
                      const mClassif = sCat?.mainClassifications?.find(mc => mc.id === modalForm.mainClassif);
                      return (mClassif?.subClassifications || []).map(sc => (
                        <option key={sc.id} value={sc.id}>{sc.label}</option>
                      ));
                    })()}
                  </select>
                </Box>
              </Box>

              <Box layoutDirection="row" gap={2}>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>السياسة *</Text>
                  <select
                    value={modalForm.mediaPolicy}
                    onChange={e => setModalForm(prev => ({ ...prev, mediaPolicy: e.target.value as any }))}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  >
                    <option value="catalog-owned-media">مركزي</option>
                    <option value="partner-owned-exception">استثناء شريك</option>
                    <option value="partner-proposed-review">مقترح مراجعة</option>
                    <option value="marketing-enhancement-required">تسويق مطلوب</option>
                  </select>
                </Box>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>حالة الاعتماد *</Text>
                  <select
                    value={modalForm.approvalStage}
                    onChange={e => setModalForm(prev => ({ ...prev, approvalStage: e.target.value as any }))}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  >
                    <option value="catalog-draft">مسودة</option>
                    <option value="marketing-review">مراجعة تسويق</option>
                    <option value="partner-review">مراجعة جودة</option>
                    <option value="catalog-adopted">معتمد وجاهز</option>
                    <option value="client-visible">نشط ومرئي</option>
                  </select>
                </Box>
              </Box>
            </Box>

            <Box layoutDirection="row" justify="space-between" style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 12, marginTop: 12 }}>
              <Button
                label={modalMode === 'add' ? 'إضافة المنتج' : 'حفظ التعديلات'}
                tone="brand"
                onPress={() => {
                  if (!modalForm.name || !modalForm.sku) {
                    alert('الاسم والمعرف مطلوبان');
                    return;
                  }
                  if (modalMode === 'add') {
                    const newProd: CatalogProductMaster = {
                      id: `prd-custom-${Date.now()}`,
                      name: modalForm.name,
                      sku: modalForm.sku,
                      gtin: modalForm.gtin || undefined,
                      price: modalForm.price,
                      categoryPath: {
                        main: modalForm.mainCat,
                        sub: modalForm.subCat || undefined,
                        mainClassification: modalForm.mainClassif || undefined,
                        subClassification: modalForm.subClassif || undefined,
                      },
                      mediaPolicy: modalForm.mediaPolicy,
                      approvalStage: modalForm.approvalStage,
                      sourceSurface: 'catalog',
                      surfaces: ['client', 'partner'],
                      imageUri: modalForm.imageUri || undefined,
                      mediaKey: modalForm.mediaKey || undefined,
                      emojiFallback: modalForm.name[0],
                    };
                    setProducts(prev => [...prev, newProd]);
                  } else {
                    setProducts(prev => prev.map(p => p.id === modalForm.id ? {
                      ...p,
                      name: modalForm.name,
                      sku: modalForm.sku,
                      gtin: modalForm.gtin || undefined,
                      price: modalForm.price,
                      categoryPath: {
                        main: modalForm.mainCat,
                        sub: modalForm.subCat || undefined,
                        mainClassification: modalForm.mainClassif || undefined,
                        subClassification: modalForm.subClassif || undefined,
                      },
                      mediaPolicy: modalForm.mediaPolicy,
                      approvalStage: modalForm.approvalStage,
                      imageUri: modalForm.imageUri || undefined,
                      mediaKey: modalForm.mediaKey || undefined,
                    } : p));
                  }
                  setShowProductModal(false);
                }}
              />
              <Button label="إلغاء" tone="secondary" onPress={() => setShowProductModal(false)} />
            </Box>
          </Surface>
        </div>
      )}
    </div>
  );
}

export default ControlPanelDshCatalogScreen;
