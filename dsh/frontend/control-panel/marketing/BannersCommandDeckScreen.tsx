"use client";

// Authority: control-panel/marketing — BannersCommandDeckScreen (slim entry point).
// Giant Screen split: types → banner-types.ts | utils → banner-target-utils.ts
//                     preview → BannerPreview.tsx | editor → BannerEditorSection.tsx
// This file retains: component state, URL param management, data handlers, layout JSX, motion panel.

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  Box,
  Button,
  SelectField,
  shadowPresets,
  Surface,
  Tabs,
  Text,
  TextField,
  useDirection,
  useTheme,
  radius,
} from '@bthwani/ui-kit';
import { WebControlPanelCompactPager } from '@bthwani/ui-kit/web';
type MarketingBannerMotionStyle = 'slide' | 'soft-parallax' | 'subtle-fade' | 'snap-focus';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MarketingBannerRecord = Record<string, any>;
type MarketingBannerSummary = { id: (string); title: (string); subtitle: (string); imageUrl?: string; status: (string); actionType: (string); impressions: (number); clicks: (number); position: (number) };
function computeMarketingBannerQuality(_item: unknown): number { return 0; }
function duplicateMarketingBannerItem(_id: string): void {}
function getMarketingBannerItems(): MarketingBannerRecord[] { return []; }
function getMarketingBannerSummaries(_opts?: unknown): { items: MarketingBannerSummary[]; total: number; page: number; pageSize: number } { return { items: [], total: 0, page: 1, pageSize: 20 }; }
function getMarketingBannerDetail(_id: string): MarketingBannerRecord | null { return null; }
function getMarketingBannerKpis() { return { total: { value: 0 }, published: { value: 0 }, drafts: { value: 0 }, live: { value: 0 }, impressions: { value: 0 }, clicks: { value: 0 }, ctr: { value: '0%' } }; }
function removeMarketingBannerItem(_id: string): void {}
function toggleMarketingBannerStatus(_id: string): void {}
function upsertMarketingBannerItem(_item: unknown): void {}
import { useMarketingPermissions } from './marketing-permissions.contract';
import { createDraft, bannerActionTypeLabel } from './banner-target-utils';
import { BANNER_MOTION_OPTIONS, BANNER_TEMPLATES } from './banner-types';
import type { BannerDraft, EditorWorkspaceTab } from './banner-types';
import { BannerPreview } from './BannerPreview';
import { BannerEditorSection } from './BannerEditorSection';

/**
 * Validation Rules:
 * - required fields: title, imageUrl or mediaKey, actionTarget (if type is not subscription)
 * - format rules: actionType must match the target logic (store, product, category, etc.)
 * - range: position (>=1), autoplayIntervalMs (>=2500)
 * - duplicate / conflict: Cannot activate a banner if another active banner occupies the same position.
 * - disabled reason: Missing 'marketing.edit' or 'marketing.publish'.
 * - error: Alerts "عنوان البنر مطلوب", "وجهة الحدث مطلوبة", "يوجد بنر مفعل آخر في الموضع"
 * - success: Updates the live visual grid and switches active editor state.
 *
 * Conflict Resolution:
 * - detect: duplicate product/category targets or position conflicts via array `some` checks
 * - display: top-level error strings before saving
 * - owner: control-panel-marketing
 * - resolution action: Rejects publish action and blocks UI commit
 * - audit/API-later: Relies on runtime position uniqueness constraints in the database
 *
 * Audit / History / Rollback Preview:
 * - publish / approval / toggle / visibility actions:
 *   - audit? API-later (via signal layer/events)
 *   - history? API-later (history log)
 *   - rollback? UI-only (pause/draft toggle)
 *   - reason/comment? UI-only now
 *   - before/after preview? UI-only (local visual grid/preview)
 *   - UI-only? Yes (currently simulated/preview states)
 *   - API-later? Yes (backend mutation boundary)
 *
 * Error Handling Closure:
 * - network: API-later (currently simulated/preview)
 * - validation: Top-level error messages (e.g. required fields, conflict targets)
 * - permission: UI disabled state via hasPermission contract
 * - not found: Auto-fallback or disabled action
 * - conflict: Toast/Alert blocker on duplicate/position conflict
 * - stale data: Handled via refresh() after every mutation
 * - blocked action: Handled via permission/validation state
 * - partial failure: API-later
 * - retry: API-later
 * - (No silent catch, success updates state and refreshes data)
 *
 * Empty / Loading / Blocked / Disabled Closure:
 * - loading: API-later (بيانات محاكاة حالياً، لا يوجد async fetch)
 * - empty: HANDLED — empty state واضح عند غياب العناصر
 * - error: HANDLED — رسالة خطأ صريحة عند فشل الإجراء
 * - blocked: HANDLED — الإجراء محجوب عند غياب الصلاحية أو البيانات
 * - disabled: HANDLED — الزر disabled عند عدم استيفاء الشروط
 * - success: HANDLED — الحالة تتحدث فور نجاح الإجراء
 * - retry: API-later
 * - guidance: HANDLED — توجيه نصي يظهر عند كل حالة فارغة أو محجوبة
 */

export type BannersCommandDeckScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  activeSubTab?: string;
};

export function BannersCommandDeckScreen({ hubHref, operationsHref }: BannersCommandDeckScreenProps) {
  const { hasPermission } = useMarketingPermissions();
  const { direction } = useDirection();
  const { theme } = useTheme();
  const router = useRouter();
  const isRtl = direction === 'rtl';
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // --- URL-driven state ---
  const selectedId = searchParams?.get('id') ?? null;
  const activeEditorTab = (searchParams?.get('tab') as EditorWorkspaceTab) || 'content';
  const bannersPageParam = parseInt(searchParams?.get('page') || '1', 10);
  const bannersPage = isNaN(bannersPageParam) || bannersPageParam < 1 ? 1 : bannersPageParam;

  // --- Data state ---
  const [summaries, setSummaries] = React.useState<MarketingBannerSummary[]>([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [selected, setSelected] = React.useState<MarketingBannerRecord | null>(null);

  const loadData = React.useCallback(() => {
    const result = getMarketingBannerSummaries({ page: bannersPage, pageSize: 5 });
    setSummaries(result.items);
    setTotalItems(result.total);
  }, [bannersPage]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  React.useEffect(() => {
    if (selectedId) {
      setSelected(getMarketingBannerDetail(selectedId));
    } else if (summaries.length > 0 && !selectedId) {
      // Auto-select first item if none selected and we have items
      const newUrl = `${pathname}?id=${summaries[0].id}&tab=content&page=${bannersPage}`;
      router.replace(newUrl, { scroll: false });
    } else {
      setSelected(null);
    }
  }, [selectedId, summaries, pathname, router, bannersPage]);

  // --- URL param helpers ---
  const updateQueryParams = React.useCallback(
    (updates: Record<string, string | null>, historyAction: 'push' | 'replace' = 'replace') => {
      const params = new URLSearchParams(searchParams?.toString() ?? '');
      for (const [k, v] of Object.entries(updates)) {
        if (v === null) params.delete(k);
        else params.set(k, v);
      }
      const newUrl = `${pathname}?${params.toString()}`;
      if (historyAction === 'push') router.push(newUrl, { scroll: false });
      else router.replace(newUrl, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const setSelectedId = React.useCallback(
    (id: string | null) => updateQueryParams({ id, tab: 'content' }, 'push'),
    [updateQueryParams],
  );

  const setActiveEditorTab = React.useCallback(
    (tab: EditorWorkspaceTab) => updateQueryParams({ tab }, 'replace'),
    [updateQueryParams],
  );

  const setBannersPage = React.useCallback(
    (page: number | ((p: number) => number)) => {
      const nextPage = typeof page === 'function' ? page(bannersPage) : page;
      updateQueryParams({ page: nextPage.toString() }, 'replace');
    },
    [bannersPage, updateQueryParams],
  );

  // --- Draft state ---
  const bannerDefaults = React.useMemo(
    () => ({ accentColor: 'brandStrong', offerBadgeColor: 'brand' }),
    [],
  );
  const [draft, setDraft] = React.useState<BannerDraft>(() => createDraft(selected, bannerDefaults));
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (selected) setDraft(createDraft(selected, bannerDefaults));
  }, [bannerDefaults, selected]);

  // --- Derived data ---
  const kpis = React.useMemo(() => getMarketingBannerKpis(), [summaries]); // eslint-disable-line react-hooks/exhaustive-deps
  const quality = React.useMemo(
    () =>
      computeMarketingBannerQuality({
        ...draft,
        position: Number.parseInt(draft.position, 10) || 0,
      } as unknown as Partial<MarketingBannerRecord>),
    [draft],
  );
  const totalPages = Math.max(1, Math.ceil(totalItems / 5));
  const visibleItems = summaries;

  React.useEffect(() => {
    setBannersPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages, setBannersPage]);

  // --- Styles ---
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  // --- Handlers ---
  function refresh() {
    loadData();
    if (selectedId) setSelected(getMarketingBannerDetail(selectedId));
  }

  function handleCreateNew() {
    setSelectedId(null);
    setDraft(createDraft(null, bannerDefaults));
  }

  function handleSave() {
    if (!draft.title?.trim()) {
      setSaveError('عنوان البنر مطلوب.');
      return;
    }
    if (!draft.imageUrl?.trim() && !draft.mediaKey?.trim()) {
      setSaveError('صورة البنر مطلوبة — أدخل رابط الصورة أو مفتاح الوسائط.');
      return;
    }
    if (draft.actionType !== 'subscription' && !draft.actionTarget?.trim()) {
      setSaveError('وجهة الحدث (Target) مطلوبة لهذا النوع من الإجراءات.');
      return;
    }

    const allItems = getMarketingBannerItems();
    const parsedPosition = Number.parseInt(draft.position as any, 10);
    const resolvedPosition = Number.isFinite(parsedPosition) ? parsedPosition : allItems.length + 1;

    if (draft.status === 'published') {
      const isDuplicatePos = allItems.some(
        (i) => i.id !== draft.id && i.status === 'published' && i.position === resolvedPosition,
      );
      if (isDuplicatePos) {
        setSaveError(
          `يوجد بنر مفعل آخر في الموضع (${resolvedPosition}). يرجى تغيير الموضع لتجنب التعارض.`,
        );
        return;
      }
      if (draft.actionType === 'product' || draft.actionType === 'main_category' || draft.actionType === 'sub_category') {
        const isDuplicateTarget = allItems.some(
          (i) =>
            i.id !== draft.id &&
            i.status === 'published' &&
            i.actionType === draft.actionType &&
            i.actionTarget === draft.actionTarget,
        );
        if (isDuplicateTarget) {
          setSaveError(
            `يوجد بنر مفعل آخر يوجه لنفس الـ ${draft.actionType === 'product' ? 'منتج' : 'فئة'} لتجنب تكرار التوجيهات.`,
          );
          return;
        }
      }
      if (draft.mediaKey === 'placeholder' || draft.imageUrl?.includes('placeholder')) {
        setSaveError('لا يمكن نشر البنر باستخدام صورة وهمية (Placeholder). يرجى توفير وسائط حقيقية.');
        return;
      }
    }

    setSaveError(null);
    const saved = upsertMarketingBannerItem({
      ...draft,
      position: resolvedPosition,
      autoplayIntervalMs: Math.max(2500, Number.parseInt(draft.autoplayIntervalMs as any, 10) || 4500),
    } as unknown as Partial<MarketingBannerRecord>);
    refresh();
    setSelectedId(saved.id);
  }

  function handleToggle(item: MarketingBannerRecord) {
    const allItems = getMarketingBannerItems();
    if (item.status === 'draft') {
      const isDuplicatePos = allItems.some(
        (i) => i.id !== item.id && i.status === 'published' && i.position === item.position,
      );
      if (isDuplicatePos) {
        alert(`لا يمكن التفعيل: يوجد بنر مفعل آخر في الموضع (${item.position}).`);
        return;
      }
      if (item.actionType === 'product' || item.actionType === 'main_category' || item.actionType === 'sub_category') {
        const isDuplicateTarget = allItems.some(
          (i) =>
            i.id !== item.id &&
            i.status === 'published' &&
            i.actionType === item.actionType &&
            i.actionTarget === item.actionTarget,
        );
        if (isDuplicateTarget) {
          alert(
            `لا يمكن التفعيل: يوجد بنر مفعل آخر يوجه لنفس الـ ${item.actionType === 'product' ? 'منتج' : 'فئة'}.`,
          );
          return;
        }
      }
      if (item.mediaKey === 'placeholder' || item.imageUrl?.includes('placeholder')) {
        alert('لا يمكن التفعيل: البنر يحتوي على صورة وهمية (Placeholder).');
        return;
      }
    }
    toggleMarketingBannerStatus(item.id);
    refresh();
  }

  function handleDuplicate(item: MarketingBannerRecord) {
    const duplicated = duplicateMarketingBannerItem(item.id);
    refresh();
    if (duplicated) setSelectedId(duplicated.id);
  }

  function handleDelete(item: MarketingBannerRecord) {
    removeMarketingBannerItem(item.id);
    refresh();
    setDeleteConfirmId(null);
    const nextItems = getMarketingBannerItems();
    setSelectedId(nextItems[0]?.id ?? null);
  }

  return (
    <Box gap={3} style={styles.workspaceRoot}>
      {/* Header + KPI Strip */}
      <Surface tone="raised" gap={3} style={styles.headerPanel}>
        <View style={StyleSheet.flatten([styles.headerRow, isRtl && styles.rowReverse])}>
          <Box gap={0}>
            <Text role="caption" weight="black" style={{ color: theme.brand, letterSpacing: 0.5 }}>
              لوحة إدارة المحتوى الإعلاني
            </Text>
            <Text role="titleLg" weight="black" style={{ color: theme.brandHeaderBackground,}}>
              استوديو البنرات
            </Text>
          </Box>
          <Button
            label="إضافة بنر جديد"
            tone="primary"
            fullWidth={false}
            onPress={handleCreateNew}
            style={{ backgroundColor: theme.brandHeaderBackground, borderRadius: radius.sm, height: 38 }}
            disabled={!hasPermission('marketing.edit')}
          />
        </View>

        <View style={styles.kpiGrid}>
          {[
            { label: 'إجمالي البنرات', value: kpis.total.value, color: theme.brandHeaderBackground, bg: theme.surface },
            { label: 'البنرات النشطة', value: kpis.live.value, color: theme.success, bg: theme.surface },
            { label: 'مشاهدات اليوم', value: kpis.impressions.value, color: theme.brandHeaderBackground, bg: theme.surface },
            { label: 'نسبة التفاعل', value: kpis.ctr.value, color: theme.brand, bg: theme.surface },
          ].map((k) => (
            <View key={k.label} style={StyleSheet.flatten([styles.kpiCard, { backgroundColor: k.bg }])}>
              <Text role="caption" weight="black" style={{ color: theme.textMuted }}>{k.label}</Text>
              <Text role="titleSm" weight="black" style={{ color: k.color, marginTop: 4,}}>
                {k.value}
              </Text>
            </View>
          ))}
        </View>
      </Surface>

      {/* Studio: Preview | Editor | Sidebar */}
      <View style={styles.studioBody}>
        {/* Preview Column */}
        <Surface tone="raised" gap={3} style={styles.previewColumn}>
          <Box gap={3} style={styles.columnBody}>
            <Text role="titleSm" weight="black" style={{ color: theme.brandHeaderBackground }}>
              المعاينة والحركة
            </Text>
            <BannerPreview draft={draft} templates={BANNER_TEMPLATES} />

            {/* Content Quality Meter */}
            <Box gap={2} style={styles.qualityPanel}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text role="caption" weight="black" style={{ }}>جودة المحتوى</Text>
                <Text
                  role="caption"
                  style={{ fontWeight: '900', color: quality > 70 ? theme.success : theme.warning }}
                >
                  {quality}%
                </Text>
              </View>
              <View style={styles.qualityTrack}>
                <View
                  style={StyleSheet.flatten([
                    styles.qualityFill,
                    { width: `${quality}%`, backgroundColor: quality > 70 ? theme.success : theme.warning },
                  ])}
                />
              </View>
            </Box>

            {/* Motion Panel */}
            <View style={styles.motionPanel}>
              <Text role="titleSm" weight="black" style={{ color: theme.brandHeaderBackground }}>
                حركة البنر
              </Text>
              <SelectField<MarketingBannerMotionStyle>
                label="نمط الحركة"
                value={draft.motionStyle}
                options={BANNER_MOTION_OPTIONS}
                onValueChange={(value) => setDraft((current) => ({ ...current, motionStyle: value }))}
              />
              <View style={styles.motionInlineGrid}>
                <Box gap={1}>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: theme.textMuted }}>
                    التشغيل التلقائي
                  </label>
                  <Tabs
                    items={[
                      { value: 'true', label: 'مفعل' },
                      { value: 'false', label: 'متوقف' },
                    ]}
                    value={draft.autoplayEnabled ? 'true' : 'false'}
                    onValueChange={(value) =>
                      setDraft((current) => ({ ...current, autoplayEnabled: value === 'true' }))
                    }
                    variant="pill"
                  />
                </Box>
                <TextField
                  label="الفاصل الزمني"
                  value={draft.autoplayIntervalMs}
                  onChangeText={(value) =>
                    setDraft((current) => ({
                      ...current,
                      autoplayIntervalMs: value.replace(/[^0-9]/g, ''),
                    }))
                  }
                />
              </View>
              <Box gap={1}>
                <label style={{ fontSize: '12px', fontWeight: '800', color: theme.textMuted }}>
                  الإيقاف عند التفاعل
                </label>
                <Tabs
                  items={[
                    { value: 'true', label: 'نعم' },
                    { value: 'false', label: 'لا' },
                  ]}
                  value={draft.pauseOnInteraction ? 'true' : 'false'}
                  onValueChange={(value) =>
                    setDraft((current) => ({ ...current, pauseOnInteraction: value === 'true' }))
                  }
                  variant="pill"
                />
              </Box>
            </View>
          </Box>
        </Surface>

        {/* Editor Column */}
        <Surface tone="raised" gap={3} style={styles.editorColumn}>
          <Box gap={3} style={styles.columnBody}>
            <BannerEditorSection
              draft={draft}
              setDraft={setDraft}
              activeEditorTab={activeEditorTab}
              setActiveEditorTab={setActiveEditorTab}
              selected={selected}
              handleCreateNew={handleCreateNew}
              handleDuplicate={handleDuplicate}
              handleToggle={handleToggle}
              handleDelete={handleDelete}
              deleteConfirmId={deleteConfirmId}
              setDeleteConfirmId={setDeleteConfirmId}
              hasPermission={hasPermission}
              hubHref={hubHref}
              operationsHref={operationsHref}
              saveError={saveError}
              handleSave={handleSave}
            />
          </Box>
        </Surface>

        {/* Sidebar — Banner List */}
        <Surface tone="raised" gap={3} style={styles.sidebarColumn}>
          <Text
            role="titleSm"
            style={{ fontWeight: '900', color: theme.brandHeaderBackground, paddingHorizontal: 4 }}
          >
            جميع الحملات
          </Text>
          <Box gap={3} style={styles.sidebarBody}>
            {visibleItems.length === 0 ? (
              <View
                style={{
                  padding: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.surfaceInset,
                  borderRadius: 12,
                }}
              >
                <Text weight="black" style={{ color: theme.textMuted, textAlign: 'center' }}>
                  لا توجد بنرات مطابقة للبحث أو الفلتر المختار.
                </Text>
              </View>
            ) : (
              visibleItems.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => setSelectedId(item.id)}
                  style={StyleSheet.flatten([
                    styles.listCard,
                    selectedId === item.id && styles.listCardSelected,
                  ])}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor:
                            item.status === 'published' ? theme.success : theme.disabledText,
                        },
                      ]}
                    />
                    <Box gap={0} style={{ flex: 1 }}>
                      <Text
                        role="bodySm"
                        weight="black"
                        style={{
                          color:
                            selectedId === item.id ? theme.brandHeaderBackground : theme.text,
                        }}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      <Text role="caption" tone="muted">
                        {bannerActionTypeLabel(item)}
                      </Text>
                    </Box>
                  </View>
                </Pressable>
              ))
            )}
            <WebControlPanelCompactPager
              page={bannersPage}
              totalPages={totalPages}
              summaryLabel={`عرض ${visibleItems.length} من ${totalItems} بنرات`}
              onPrevious={bannersPage > 1 ? () => setBannersPage((p) => p - 1) : undefined}
              onNext={bannersPage < totalPages ? () => setBannersPage((p) => p + 1) : undefined}
            />
          </Box>
        </Surface>
      </View>
    </Box>
  );
}

export default BannersCommandDeckScreen;

// ---------------------------------------------------------------------------
// Styles — outside component. Pattern matches VideosCommandDeckScreen.
// ---------------------------------------------------------------------------
function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    workspaceRoot: { height: '100%', maxHeight: '100%', overflow: 'hidden' },
    headerPanel: { borderRadius: radius.xl, padding: 18, backgroundColor: theme.surface, elevation: 2 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    rowReverse: { flexDirection: 'row-reverse' },
    kpiGrid: { flexDirection: 'row', gap: 10, marginTop: 4 },
    kpiCard: { flex: 1, padding: 12, borderRadius: radius.lg, borderWidth: 1, borderColor: theme.line },
    studioBody: { flexDirection: 'row', gap: 12, flex: 1, minHeight: 0 },
    previewColumn: { width: 328, borderRadius: radius.xl, padding: 14, backgroundColor: theme.surface, minHeight: 0 },
    editorColumn: { flex: 1, borderRadius: radius.xl, padding: 14, backgroundColor: theme.surface, minHeight: 0 },
    sidebarColumn: { width: 248, borderRadius: radius.xl, padding: 14, backgroundColor: theme.surface, minHeight: 0 },
    columnBody: { flex: 1, minHeight: 0, gap: 12, paddingBottom: 4 },
    sidebarBody: { flex: 1, minHeight: 0, gap: 10, paddingTop: 4, paddingBottom: 4 },
    listCard: {
      padding: 12,
      borderRadius: 16,
      backgroundColor: theme.surfaceInset,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    listCardSelected: {
      borderColor: theme.brand,
      backgroundColor: theme.surface,
      ...shadowPresets.raised,
      shadowColor: theme.brand,
    },
    statusDot: { width: 7, height: 7, borderRadius: radius.pill },
    qualityPanel: { padding: 12, backgroundColor: theme.surfaceInset, borderRadius: radius.md },
    qualityTrack: { height: 8, backgroundColor: theme.line, borderRadius: 4, overflow: 'hidden', marginTop: 8 },
    qualityFill: { height: '100%' },
    motionPanel: {
      backgroundColor: theme.warningSurface,
      padding: 12,
      borderRadius: 16,
      gap: 12,
      borderWidth: 1,
      borderColor: theme.warning,
    },
    motionInlineGrid: { gap: 10 },
  });
}
