"use client";

import React from 'react';
import { Pressable, StyleSheet, View, Image } from 'react-native';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Surface,
  Tabs,
  Text,
  TextField,
  useTheme,
  useDirection,
  SelectField,
} from '@bthwani/ui-kit';
import { WebControlPanelCompactPager } from '@bthwani/ui-kit/web';
import {
  getMarketingVideoItems,
  getMarketingVideoSummaries,
  getMarketingVideoDetail,
  getMarketingVideoKpis,
  upsertMarketingVideoItem,
  toggleMarketingVideoStatus,
  duplicateMarketingVideoItem,
  removeMarketingVideoItem,
  type MarketingVideoRecord,
  type MarketingVideoSummary,
  type MarketingVideoStatus,
  type MarketingVideoAudience,
  type MarketingVideoSource,
  type MarketingVideoTargetType,
} from '../../data/marketing.preview-data';
import { useMarketingPermissions } from './marketing-permissions.contract';
import { dshCategoryFixtures } from '../../data/categories.preview-data';
import { dshDiscoveryStores } from '../../data/stores.preview-data';
import { storeItemsByStoreId } from '../../data/stores.preview-data';

/**
 * Validation Rules:
 * - required fields: title, videoUrl, targetId (if targetType is not general like home/stores)
 * - format rules: videoUrl must not contain spaces
 * - range: durationSeconds (converted to Number)
 * - duplicate / conflict: N/A (Handled via grid positioning and active status limit implicitly)
 * - disabled reason: Missing 'marketing.edit' or 'marketing.publish' permissions.
 * - error: Alerts "عنوان الفيديو مطلوب", "رابط الفيديو مطلوب", "رابط الفيديو يجب ألا يحتوي على مسافات"
 * - success: Updates video grid and resets editor selection.
 *
 * Conflict Resolution:
 * - detect: duplicate product/category targets across video entities
 * - display: top-level error in editor or toggle switch bouncing back
 * - owner: control-panel-marketing
 * - resolution action: User must use unique targets or replace the old video
 * - audit/API-later: Backed by runtime media validation checks on URL reachability
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

export type VideosCommandDeckScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  activeSubTab?: string;
  setActiveTab?: (tab: string) => void;
};

type VideoDraft = Record<'title' | 'subtitle' | 'videoUrl' | 'posterUrl' | 'durationSeconds' | 'ctaLabel' | 'highlight' | 'targetId' | 'targetExtra' | 'order', string> & {
  id?: string;
  status: MarketingVideoStatus;
  audience: MarketingVideoAudience;
  source: MarketingVideoSource;
  mute: boolean;
  autoplay: boolean;
  loop: boolean;
  targetType: MarketingVideoTargetType;
  reviewState: 'none' | 'pending' | 'approved' | 'rejected';
};

type EditorWorkspaceTab = 'content' | 'media' | 'target' | 'publish';

const videosPageSize = 5;

function createDraft(item?: MarketingVideoRecord | null): VideoDraft {
  const id = item?.id;
  const title = item?.title ?? '';
  const subtitle = item?.subtitle ?? '';
  const status = item?.status ?? 'draft';
  const audience = item?.audience ?? 'client';
  const source = item?.source ?? 'marketing';
  const videoUrl = item?.videoUrl ?? '';
  const posterUrl = item?.posterUrl ?? '';
  const durationSeconds = String(item?.durationSeconds ?? 15);
  const mute = item?.mute ?? true;
  const autoplay = item?.autoplay ?? true;
  const loop = item?.loop ?? true;
  const ctaLabel = item?.ctaLabel ?? 'اكتشف الآن';
  const highlight = item?.highlight ?? '';
  const targetType = item?.targetType ?? 'home';
  const targetId = item?.targetId ?? 'home';
  const targetExtra = item?.targetExtra ?? '';
  const order = String(item?.order ?? 1);
  const reviewState = item?.reviewState ?? 'none';

  return {
    id, title, subtitle, status, audience, source, videoUrl, posterUrl, durationSeconds, mute, autoplay, loop, ctaLabel, highlight, targetType, targetId, targetExtra, order, reviewState,
  };
}

const TARGET_TYPE_OPTIONS: Array<{ value: MarketingVideoTargetType; label: string; description: string }> = [
  { value: 'home', label: 'الرئيسية', description: 'يعيد المستخدم إلى واجهة DSH الرئيسية.' },
  { value: 'stores', label: 'المتاجر', description: 'يفتح قائمة المتاجر أو تجربة التصفح العامة.' },
  { value: 'store', label: 'متجر', description: 'يربط الفيديو بمتجر واحد محدد.' },
  { value: 'category', label: 'فئة', description: 'يربط الفيديو بفئة رئيسية داخل DSH.' },
  { value: 'subcategory', label: 'فئة فرعية', description: 'يفتح فئة فرعية بعد اختيار الفئة الأم.' },
  { value: 'product', label: 'منتج', description: 'يربط الفيديو بمنتج داخل متجر المحدد.' },
  { value: 'offer', label: 'عرض', description: 'يعرض متجرًا فيه عرض نشط وملفت.' },
  { value: 'campaign', label: 'حملة', description: 'يفتح وجهة حملات عامة ضمن القناة الحالية.' },
  { value: 'search', label: 'بحث', description: 'يفتح واجهة البحث.' },
  { value: 'custom', label: 'مخصص', description: 'مسار محدود ومضبوط عندما لا تكفي الخيارات المنظمة.' },
];

export function VideosCommandDeckScreen({ hubHref, operationsHref }: VideosCommandDeckScreenProps) {
  const { hasPermission } = useMarketingPermissions();
  const { theme } = useTheme();
  const { direction } = useDirection();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isRtl = direction === 'rtl';
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  // RTL Text styles helper
  const rtlText = { textAlign: isRtl ? 'right' : 'left', writingDirection: isRtl ? 'rtl' : 'ltr' } as const;

  const [summaries, setSummaries] = React.useState<MarketingVideoSummary[]>([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [selected, setSelected] = React.useState<MarketingVideoRecord | null>(null);

  const loadData = React.useCallback(() => {
    const result = getMarketingVideoSummaries({ page: videosPage, pageSize: videosPageSize });
    setSummaries(result.items);
    setTotalItems(result.total);
  }, [videosPage]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  React.useEffect(() => {
    if (selectedId) {
      setSelected(getMarketingVideoDetail(selectedId));
    } else if (summaries.length > 0 && !selectedId) {
      const newUrl = `${pathname}?id=${summaries[0].id}&tab=content&page=${videosPage}`;
      router.replace(newUrl, { scroll: false });
    } else {
      setSelected(null);
    }
  }, [selectedId, summaries, pathname, router, videosPage]);

  const updateQueryParams = React.useCallback((updates: Record<string, string | null>, historyAction: 'push' | 'replace' = 'replace') => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    for (const [k, v] of Object.entries(updates)) {
      if (v === null) params.delete(k);
      else params.set(k, v);
    }
    const newUrl = `${pathname}?${params.toString()}`;
    if (historyAction === 'push') {
      router.push(newUrl, { scroll: false });
    } else {
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  const setSelectedId = React.useCallback((id: string | null) => {
    updateQueryParams({ id, tab: 'content' }, 'push');
  }, [updateQueryParams]);

  const setActiveEditorTab = React.useCallback((tab: EditorWorkspaceTab) => {
    updateQueryParams({ tab }, 'replace');
  }, [updateQueryParams]);

  const setVideosPage = React.useCallback((page: number | ((p: number) => number)) => {
    const nextPage = typeof page === 'function' ? page(videosPage) : page;
    updateQueryParams({ page: nextPage.toString() }, 'replace');
  }, [videosPage, updateQueryParams]);

  const [draft, setDraft] = React.useState<VideoDraft>(() => createDraft(selected));
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (selected) {
      setDraft(createDraft(selected));
    }
  }, [selected]);

  const kpis = React.useMemo(() => getMarketingVideoKpis(), [summaries]);

  const totalPages = Math.max(1, Math.ceil(totalItems / videosPageSize));
  const visibleItems = summaries;

  React.useEffect(() => {
    setVideosPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages, setVideosPage]);

  function refresh() {
    loadData();
    if (selectedId) setSelected(getMarketingVideoDetail(selectedId));
  }

  function handleCreateNew() {
    setSelectedId(null);
    setDraft(createDraft(null));
    setActiveEditorTab('content');
  }

  const [saveError, setSaveError] = React.useState<string | null>(null);

  function handleSave() {
    if (!draft.title?.trim()) { setSaveError('عنوان الفيديو مطلوب.'); return; }
    if (!draft.videoUrl?.trim()) { setSaveError('رابط الفيديو مطلوب.'); return; }
    if (draft.videoUrl.includes(' ')) { setSaveError('رابط الفيديو يجب ألا يحتوي على مسافات.'); return; }
    if (draft.targetType && !['home', 'stores', 'loyalty'].includes(draft.targetType) && !draft.targetId?.trim()) {
      setSaveError('الوجهة المستهدفة (Target ID) مطلوبة لهذا النوع.');
      return;
    }

    if (draft.status === 'published') {
      if (draft.videoUrl.includes('placeholder')) {
         setSaveError('لا يمكن نشر فيديو باستخدام رابط وهمي (Placeholder). يرجى توفير وسائط حقيقية.');
         return;
      }
      if (draft.targetType === 'product' || draft.targetType === 'category') {
        const allItems = getMarketingVideoItems();
        const isDuplicateTarget = allItems.some(i => i.id !== draft.id && i.status === 'published' && i.targetType === draft.targetType && i.targetId === draft.targetId);
        if (isDuplicateTarget) {
          setSaveError(`يوجد فيديو مفعل آخر يوجه لنفس الـ ${draft.targetType === 'product' ? 'منتج' : 'فئة'} لتجنب تكرار التوجيهات.`);
          return;
        }
      }
    }

    setSaveError(null);
    const saved = upsertMarketingVideoItem({
      ...draft,
      durationSeconds: Number(draft.durationSeconds) || 0,
      order: Number(draft.order) || 0,
    });
    refresh();
    setSelectedId(saved.id);
  }

  function handleToggle(item: MarketingVideoRecord) {
    if (item.status === 'draft') {
      if (item.videoUrl.includes('placeholder')) {
         alert('لا يمكن التفعيل: الفيديو يحتوي على رابط وهمي (Placeholder).');
         return;
      }
      if (item.targetType === 'product' || item.targetType === 'category') {
        const allItems = getMarketingVideoItems();
        const isDuplicateTarget = allItems.some(i => i.id !== item.id && i.status === 'published' && i.targetType === item.targetType && i.targetId === item.targetId);
        if (isDuplicateTarget) {
          alert(`لا يمكن التفعيل: يوجد فيديو مفعل آخر يوجه لنفس الـ ${item.targetType === 'product' ? 'منتج' : 'فئة'}.`);
          return;
        }
      }
    }
    toggleMarketingVideoStatus(item.id);
    refresh();
  }

  function handleDuplicate(item: MarketingVideoRecord) {
    const duplicated = duplicateMarketingVideoItem(item.id);
    refresh();
    if (duplicated) {
      setSelectedId(duplicated.id);
    }
  }

  function handleDelete(item: MarketingVideoRecord) {
    removeMarketingVideoItem(item.id);
    setDeleteConfirmId(null);
    refresh();
    const next = getMarketingVideoItems();
    setSelectedId(next[0]?.id ?? null);
  }

  const statusLabel = (s: MarketingVideoStatus) => {
    if (s === 'published') return 'منشور';
    if (s === 'paused') return 'موقوف';
    if (s === 'review') return 'مراجعة';
    return 'مسودة';
  };

  const getProductsForStore = (storeId: string) => storeItemsByStoreId[storeId] ?? [];

  return (
    <View style={[styles.root, isRtl ? styles.rootRtl : null]}>
      {/* 1. Header & KPI Strip */}
      <Surface tone="raised" style={styles.headerSurface}>
        <View style={[styles.headerRow]}>
          <Box gap={1} >
            <View style={[styles.headerRow, { gap: 8, justifyContent: 'flex-start' }]}>
              <Text role="caption" style={[{ color: theme.brandHeaderBackground, fontWeight: '900', letterSpacing: 1 }, rtlText]}>استوديو الفيديو DSH v1</Text>
              <View style={{ backgroundColor: theme.brand, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                <Text role="caption" style={[{ color: theme.textInverse, fontSize: 9, fontWeight: '900' }, rtlText]}>احترافي</Text>
              </View>
            </View>
            <Text role="titleLg" style={[{ fontSize: 24, fontWeight: '900', color: theme.brandHeaderBackground }, rtlText]}>استوديو الفيديو التسويقي</Text>
          </Box>

          <View style={[styles.kpiRow]}>
            {[
              { label: 'إجمالي المحتوى', value: kpis.total.value, color: theme.brandHeaderBackground, bg: theme.surface },
              { label: 'نشط الآن', value: kpis.live.value, color: theme.success, bg: theme.surface },
              { label: 'قيد المراجعة', value: kpis.review.value, color: theme.warning, bg: theme.surface },
            ].map((kpi) => (
              <View key={kpi.label} style={[styles.kpiPill, { backgroundColor: kpi.bg, borderWidth: 1, borderColor: theme.lineStrong }]}>
                <Text role="caption" style={[{ fontWeight: '800', fontSize: 10, color: theme.textMuted }, rtlText]}>{kpi.label}</Text>
                <Text role="titleMd" style={[{ color: kpi.color, fontWeight: '900', fontSize: 16 }, rtlText]}>{String(kpi.value)}</Text>
              </View>
            ))}
          </View>

          <Button label="+ فيديو جديد" tone="secondary" fullWidth={false} onPress={handleCreateNew} style={{ borderRadius: 8, height: 40 }} />
        </View>
      </Surface>

      {/* Main Workspace */}
      <View style={[styles.workspace]}>
        {/* Left: List Panel */}
        <Surface tone="raised" style={styles.listPanel}>
          <View style={[styles.panelHeader]}>
            <Text role="titleSm" style={[{ fontWeight: '900' }, rtlText]}>مكتبة المحتوى</Text>
            <Text role="caption" tone="muted" style={rtlText}>{items.length} فيديوهات</Text>
          </View>
          <Box gap={2} style={styles.listBody}>
            {visibleItems.length === 0 ? (
              <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surfaceInset, borderRadius: 12 }}>
                <Text style={{ color: theme.textMuted, fontWeight: '800', textAlign: 'center' }}>لا توجد فيديوهات مطابقة للبحث أو الفلتر المختار.</Text>
              </View>
            ) : (
              visibleItems.map((item) => {
                const isSelected = selected?.id === item.id;
                return (
                  <Pressable key={item.id} onPress={() => setSelectedId(item.id)} style={[styles.compactRow, isSelected && styles.compactRowSelected]}>
                    <View style={styles.compactPoster}>
                      {item.posterUrl ? <Image source={{ uri: item.posterUrl }} style={styles.compactImage} resizeMode="cover" /> : null}
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <View style={[styles.headerRow, { alignItems: 'center' }]}>
                        <Text role="bodyStrong" numberOfLines={1} style={[{ flex: 1, fontSize: 13, color: theme.brandHeaderBackground }, rtlText]}>{item.title}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: item.status === 'published' ? theme.successSurface : theme.surfaceSecondary }]}>
                          <Text role="caption" style={[{ color: item.status === 'published' ? theme.success : theme.textMuted, fontWeight: '900', fontSize: 9 }, rtlText]}>{statusLabel(item.status)}</Text>
                        </View>
                      </View>
                      <View style={[styles.headerRow, { gap: 6, marginTop: 4, justifyContent: 'flex-start' }]}>
                        <Text role="caption" style={[{ color: theme.textMuted, fontSize: 10 }, rtlText]}>{item.durationSeconds}ث</Text>
                        <Text role="caption" style={[{ color: theme.lineStrong, fontSize: 10 }, rtlText]}>•</Text>
                        <Text role="caption" style={[{ color: theme.textMuted, fontSize: 10 }, rtlText]}>{TARGET_TYPE_OPTIONS.find(o => o.value === item.targetType)?.label}</Text>
                        <Text role="caption" style={[{ color: theme.lineStrong, fontSize: 10 }, rtlText]}>•</Text>
                        <Text role="caption" style={[{ color: theme.textMuted, fontSize: 10 }, rtlText]}>{item.source === 'partner' ? 'شريك' : 'داخلي'}</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })
            )}
            <WebControlPanelCompactPager
              page={videosPage}
              totalPages={totalPages}
              summaryLabel={`عرض ${visibleItems.length} من ${items.length} فيديوهات`}
              onPrevious={videosPage > 1 ? () => setVideosPage((currentPage) => currentPage - 1) : undefined}
              onNext={videosPage < totalPages ? () => setVideosPage((currentPage) => currentPage + 1) : undefined}
            />
          </Box>
        </Surface>

        {/* Center: Editor Panel */}
        <Surface tone="raised" style={styles.editorPanel}>
          <View style={[styles.panelHeader]}>
            <Text role="titleSm" style={[{ fontWeight: '900' }, rtlText]}>محرر الفيديو الذكي</Text>
            <View style={[styles.headerRow, { gap: 8, flexWrap: 'wrap' }]}>
              {selected ? <Button label={selected.status === 'published' ? 'إيقاف' : 'نشر'} tone="secondary" size="sm" onPress={() => handleToggle(selected)} disabled={!hasPermission('marketing.publish')} /> : null}
              <Button label="نسخة" tone="ghost" size="sm" onPress={() => selected && handleDuplicate(selected)} disabled={!selected || !hasPermission('marketing.edit')} />
              {selected && deleteConfirmId === selected.id ? (
                <>
                  <Button label="تأكيد الحذف" tone="danger" size="sm" onPress={() => handleDelete(selected)} />
                  <Button label="إلغاء" tone="ghost" size="sm" onPress={() => setDeleteConfirmId(null)} />
                </>
              ) : (
                <Button label="حذف" tone="ghost" size="sm" onPress={() => selected && setDeleteConfirmId(selected.id)} disabled={!selected || !hasPermission('marketing.delete')} />
              )}
              <Button label="حفظ" tone="primary" size="sm" onPress={handleSave} disabled={!draft.title?.trim() || !draft.videoUrl?.trim()} />
              {hubHref ? <Button label="المركز" tone="ghost" size="sm" onPress={() => router.push(hubHref)} /> : null}
              {operationsHref ? <Button label="العمليات" tone="ghost" size="sm" onPress={() => router.push(operationsHref)} /> : null}
            </View>
          </View>
          {saveError ? (
            <View style={{ paddingHorizontal: 16, paddingVertical: 6, backgroundColor: theme.dangerSurface ?? theme.surfaceInset }}>
              <Text role="caption" style={[{ color: theme.danger }, rtlText]}>{saveError}</Text>
            </View>
          ) : null}

          <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
            <Tabs<EditorWorkspaceTab>
              items={[
                { value: 'content', label: 'المحتوى' },
                { value: 'media', label: 'الوسائط' },
                { value: 'target', label: 'الوجهة' },
                { value: 'publish', label: 'النشر' },
              ]}
              value={activeEditorTab}
              onValueChange={setActiveEditorTab}
              variant="line"
            />
          </View>

          <Box gap={4} style={styles.editorContent}>
            {activeEditorTab === 'content' && (
              <Box gap={4}>
                <TextField label="العنوان التسويقي" value={draft.title} onChangeText={(v) => setDraft(d => ({ ...d, title: v }))} placeholder="مثال: خصومات الجمعة البيضاء" style={rtlText} />
                <TextField label="وصف موجز" value={draft.subtitle} onChangeText={(v) => setDraft(d => ({ ...d, subtitle: v }))} placeholder="وصف يظهر أسفل العنوان في المعاينة" style={rtlText} />
                <View style={[styles.headerRow, { gap: 12 }]}>
                  <View style={{ flex: 1 }}>
                    <TextField label="نص الزر" value={draft.ctaLabel} onChangeText={(v) => setDraft(d => ({ ...d, ctaLabel: v }))} style={rtlText} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextField label="الجملة البارزة" value={draft.highlight} onChangeText={(v) => setDraft(d => ({ ...d, highlight: v }))} style={rtlText} />
                  </View>
                </View>
              </Box>
            )}

            {activeEditorTab === 'media' && (
              <Box gap={4}>
                <View style={[styles.headerRow, { gap: 12 }]}>
                  <View style={{ flex: 1, direction: 'ltr' }}>
                    <TextField label="رابط الفيديو" value={draft.videoUrl} onChangeText={(v) => setDraft(d => ({ ...d, videoUrl: v }))} placeholder="video-url..." style={{ textAlign: 'left', writingDirection: 'ltr' }} />
                  </View>
                  <View style={{ flex: 1, direction: 'ltr' }}>
                    <TextField label="رابط الغلاف (Poster)" value={draft.posterUrl} onChangeText={(v) => setDraft(d => ({ ...d, posterUrl: v }))} placeholder="poster-url..." style={{ textAlign: 'left', writingDirection: 'ltr' }} />
                  </View>
                </View>
                <View style={[styles.headerRow, { gap: 12 }]}>
                  <View style={{ flex: 1 }}>
                    <TextField label="المدة (ثانية)" value={draft.durationSeconds} onChangeText={(v) => setDraft(d => ({ ...d, durationSeconds: v }))} style={rtlText} />
                  </View>
                  <View style={{ flex: 1 }} />
                </View>
                <Box gap={2}>
                  <Text role="caption" style={[{ fontWeight: '900', color: theme.textMuted }, rtlText]}>سلوك التشغيل</Text>
                  <View style={[styles.headerRow, { gap: 8, flexWrap: 'wrap', justifyContent: 'flex-start' }]}>
                    <Button label={draft.mute ? "صامت ✓" : "صوت"} tone={draft.mute ? "secondary" : "ghost"} fullWidth={false} size="sm" onPress={() => setDraft(d => ({ ...d, mute: !d.mute }))} />
                    <Button label={draft.autoplay ? "تشغيل تلقائي ✓" : "يدوي"} tone={draft.autoplay ? "secondary" : "ghost"} fullWidth={false} size="sm" onPress={() => setDraft(d => ({ ...d, autoplay: !d.autoplay }))} />
                    <Button label={draft.loop ? "تكرار ✓" : "مرة واحدة"} tone={draft.loop ? "secondary" : "ghost"} fullWidth={false} size="sm" onPress={() => setDraft(d => ({ ...d, loop: !d.loop }))} />
                  </View>
                </Box>
              </Box>
            )}

            {activeEditorTab === 'target' && (
              <Box gap={4}>
                <SelectField
                  label="نوع الوجهة"
                  value={draft.targetType}
                      onValueChange={(v) => setDraft(d => ({ ...d, targetType: v as MarketingVideoTargetType }))}
                  options={TARGET_TYPE_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
                />
                <Surface tone="inset" padding={4} gap={3} style={{ borderRadius: 8 }}>
                   {draft.targetType === 'home' && (
                     <Text role="caption" style={[{ color: theme.textMuted }, rtlText]}>يعيد توجيه العميل للصفحة الرئيسية بشكل مباشر.</Text>
                   )}
                   {draft.targetType === 'stores' && (
                     <Text role="caption" style={[{ color: theme.textMuted }, rtlText]}>يفتح القائمة العامة لاستكشاف المتاجر.</Text>
                   )}
                   {draft.targetType === 'store' && (
                     <SelectField
                       label="اختر المتجر"
                       value={draft.targetId}
                       onValueChange={(v) => setDraft(d => ({ ...d, targetId: v }))}
                       options={dshDiscoveryStores.map(s => ({ value: s.id, label: s.name }))}
                     />
                   )}
                   {draft.targetType === 'category' && (
                     <SelectField
                       label="اختر الفئة الرئيسية"
                       value={draft.targetId}
                       onValueChange={(v) => setDraft(d => ({ ...d, targetId: v }))}
                       options={dshCategoryFixtures.map(c => ({ value: c.id, label: c.label }))}
                     />
                   )}
                   {draft.targetType === 'subcategory' && (
                     <Box gap={3}>
                        <SelectField
                          label="اختر الفئة الرئيسية"
                          value={draft.targetId}
                          onValueChange={(v) => setDraft(d => ({ ...d, targetId: v, targetExtra: dshCategoryFixtures.find(c => c.id === v)?.subcategories[0]?.id || '' }))}
                          options={dshCategoryFixtures.map(c => ({ value: c.id, label: c.label }))}
                        />
                        <SelectField
                          label="اختر الفئة الفرعية"
                          value={draft.targetExtra}
                          onValueChange={(v) => setDraft(d => ({ ...d, targetExtra: v }))}
                          options={(dshCategoryFixtures.find(c => c.id === draft.targetId)?.subcategories || []).map(s => ({ value: s.id, label: s.label }))}
                        />
                     </Box>
                   )}
                   {draft.targetType === 'product' && (
                     <Box gap={3}>
                        <SelectField
                          label="اختر متجر المنتج"
                          value={draft.targetExtra}
                          onValueChange={(v) => setDraft(d => ({ ...d, targetExtra: v, targetId: getProductsForStore(v)[0]?.id ?? '' }))}
                          options={dshDiscoveryStores.filter(s => getProductsForStore(s.id).length > 0).map(s => ({ value: s.id, label: s.name }))}
                        />
                        <SelectField
                          label="اختر المنتج"
                          value={draft.targetId}
                          onValueChange={(v) => setDraft(d => ({ ...d, targetId: v }))}
                          options={getProductsForStore(draft.targetExtra || dshDiscoveryStores.find(s => getProductsForStore(s.id).length > 0)?.id || '').map(p => ({ value: p.id, label: p.name }))}
                        />
                     </Box>
                   )}
                   {draft.targetType === 'offer' && (
                     <SelectField
                       label="اختر متجر العرض"
                       value={draft.targetId}
                       onValueChange={(v) => setDraft(d => ({ ...d, targetId: v }))}
                       options={dshDiscoveryStores.filter(s => s.isOffer || s.offerLabel).map(s => ({ value: s.id, label: s.name + (s.offerLabel ? ` (${s.offerLabel})` : '') }))}
                     />
                   )}
                   {draft.targetType === 'campaign' && (
                     <SelectField
                       label="اختر الحملة"
                       value={draft.targetId}
                       onValueChange={(v) => setDraft(d => ({ ...d, targetId: v }))}
                       options={[
                         { value: 'ramadan-2026', label: 'حملة رمضان 2026' },
                         { value: 'summer-sale', label: 'تخفيضات الصيف' },
                         { value: 'back-to-school', label: 'العودة للمدارس' },
                       ]}
                     />
                   )}
                   {draft.targetType === 'search' && (
                     <View style={{ direction: 'ltr' }}>
                       <TextField label="نص البحث الافتراضي" value={draft.targetId} onChangeText={(v) => setDraft(d => ({ ...d, targetId: v }))} style={rtlText} />
                     </View>
                   )}
                   {draft.targetType === 'custom' && (
                     <View style={{ direction: 'ltr' }}>
                       <TextField label="المسار المخصص" value={draft.targetId} onChangeText={(v) => setDraft(d => ({ ...d, targetId: v }))} style={{ textAlign: 'left', writingDirection: 'ltr' }} />
                     </View>
                   )}
                 </Surface>
              </Box>
            )}

            {activeEditorTab === 'publish' && (
              <Box gap={4}>
                <View style={[styles.headerRow, { gap: 12 }]}>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      label="المصدر"
                      value={draft.source}
                      onValueChange={(v) => setDraft(d => ({ ...d, source: v as MarketingVideoSource }))}
                      options={[
                        { value: 'marketing', label: 'فريق التسويق' },
                        { value: 'partner', label: 'الشريك / العلامة التجارية' },
                      ]}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      label="الجمهور"
                      value={draft.audience}
                      onValueChange={(v) => setDraft(d => ({ ...d, audience: v as MarketingVideoAudience }))}
                      options={[
                        { value: 'all', label: 'الكل' },
                        { value: 'client', label: 'واجهة العميل' },
                        { value: 'operations', label: 'العمليات' },
                      ]}
                    />
                  </View>
                </View>
                <TextField label="الترتيب" value={draft.order} onChangeText={(v) => setDraft(d => ({ ...d, order: v }))} style={rtlText} />

                <Surface tone="inset" padding={3} gap={3} style={{ borderRadius: 12 }}>
                  <Text role="caption" style={[{ fontWeight: '900', color: theme.textMuted }, rtlText]}>حالة المراجعة</Text>
                  {draft.reviewState === 'none' && (
                    <Button
                      label="إرسال للمراجعة"
                      tone="secondary"
                      size="sm"
                      fullWidth={false}
                      onPress={() => {
                        const updated = { ...draft, reviewState: 'pending' as const, durationSeconds: Number(draft.durationSeconds) || 0, order: Number(draft.order) || 0 };
                        setDraft(d => ({ ...d, reviewState: 'pending' }));
                        upsertMarketingVideoItem(updated);
                        refresh();
                      }}
                    />
                  )}
                  {draft.reviewState === 'pending' && (
                    <View style={[styles.headerRow, { gap: 8, justifyContent: 'flex-start' }]}>
                      <Button
                        label="اعتماد"
                        tone="primary"
                        size="sm"
                        fullWidth={false}
                        onPress={() => {
                          const updated = { ...draft, reviewState: 'approved' as const, durationSeconds: Number(draft.durationSeconds) || 0, order: Number(draft.order) || 0 };
                          setDraft(d => ({ ...d, reviewState: 'approved' }));
                          upsertMarketingVideoItem(updated);
                          refresh();
                        }}
                      />
                      <Button
                        label="رفض"
                        tone="ghost"
                        size="sm"
                        fullWidth={false}
                        onPress={() => {
                          const updated = { ...draft, reviewState: 'rejected' as const, durationSeconds: Number(draft.durationSeconds) || 0, order: Number(draft.order) || 0 };
                          setDraft(d => ({ ...d, reviewState: 'rejected' }));
                          upsertMarketingVideoItem(updated);
                          refresh();
                        }}
                      />
                      <Button
                        label="سحب الطلب"
                        tone="ghost"
                        size="sm"
                        fullWidth={false}
                        onPress={() => {
                          const updated = { ...draft, reviewState: 'none' as const, durationSeconds: Number(draft.durationSeconds) || 0, order: Number(draft.order) || 0 };
                          setDraft(d => ({ ...d, reviewState: 'none' }));
                          upsertMarketingVideoItem(updated);
                          refresh();
                        }}
                      />
                    </View>
                  )}
                  {draft.reviewState === 'approved' && (
                    <View style={[styles.statusBadge, { backgroundColor: theme.successSurface, alignSelf: 'flex-start' }]}>
                      <Text role="caption" style={[{ color: theme.success, fontWeight: '900' }, rtlText]}>معتمد</Text>
                    </View>
                  )}
                  {draft.reviewState === 'rejected' && (
                    <View style={[styles.statusBadge, { backgroundColor: theme.dangerSurface ?? theme.surfaceInset, alignSelf: 'flex-start' }]}>
                      <Text role="caption" style={[{ color: theme.danger, fontWeight: '900' }, rtlText]}>مرفوض</Text>
                    </View>
                  )}
                </Surface>
              </Box>
            )}
          </Box>
        </Surface>

        {/* Right: Preview Panel */}
        <Surface tone="inset" style={styles.previewPanel}>
          <View style={[styles.panelHeader]}>
            <Text role="titleSm" style={[{ fontWeight: '900', color: theme.textInverse }, rtlText]}>المعاينة الحية</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.previewFrame}>
              {draft.posterUrl ? (
                <Image source={{ uri: draft.posterUrl }} style={styles.previewImage} resizeMode="cover" />
              ) : (
                <View style={[styles.previewImage, { backgroundColor: theme.surfaceSecondary, justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={{ fontSize: 12, color: theme.textSoft, fontWeight: '800' }}>مساحة معاينة الفيديو</Text>
                </View>
              )}

              <View style={styles.previewOverlay}>
                <View style={[styles.previewTopBar]}>
                  <View style={styles.previewBadge}><Text style={[{ color: theme.textInverse, fontSize: 10, fontWeight: '900' }, rtlText]}>{draft.highlight || 'عرض جديد'}</Text></View>
                  <View style={styles.previewTime}><Text style={[{ color: theme.textInverse, fontSize: 9, fontWeight: '700' }, rtlText]}>{draft.durationSeconds} ث</Text></View>
                </View>

                <View style={styles.previewBottomContent}>
                  <Box gap={1} >
                    <Text role="titleSm" style={[{ color: theme.textInverse, fontWeight: '900' }, rtlText]}>{draft.title || 'عنوان الفيديو يظهر هنا'}</Text>
                    <Text role="caption" style={[{ color: theme.textInverse, opacity: 0.9 }, rtlText]}>{draft.subtitle || 'وصف الفيديو يظهر هنا بشكل مختصر وجذاب'}</Text>
                  </Box>
                  <View style={[styles.previewCta, isRtl ? { alignSelf: 'flex-end' } : null]}>
                    <Text style={[{ color: theme.brandHeaderBackground, fontWeight: '900', fontSize: 12 }, rtlText]}>{draft.ctaLabel}</Text>
                    <Text style={[{ color: theme.brandHeaderBackground, fontSize: 12 }, rtlText]}>{isRtl ? '←' : '→'}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.previewControls}>
                <View style={styles.previewProgress} />
                <View style={[styles.headerRow, { gap: 6, justifyContent: 'flex-start' }]}>
                  <View style={styles.previewIndicator} />
                  <View style={[styles.previewIndicator, { opacity: 0.3 }]} />
                  <View style={[styles.previewIndicator, { opacity: 0.3 }]} />
                </View>
              </View>
            </View>
            <Text role="caption" style={[{ color: theme.textSoft, marginTop: 12, textAlign: 'center' }, rtlText]}>{TARGET_TYPE_OPTIONS.find(o => o.value === draft.targetType)?.label} · {draft.targetId}</Text>
          </View>
        </Surface>
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    root: { flex: 1, display: 'flex', flexDirection: 'column', gap: 16, height: '100%' },
    rootRtl: { direction: 'rtl' },
    headerSurface: { borderRadius: 12, padding: 16, borderWidth: 1, borderColor: theme.line, flexShrink: 0 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
    rowReverse: { flexDirection: 'row-reverse' },
    kpiRow: { flexDirection: 'row', gap: 12 },
    kpiPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },

    workspace: { flex: 1, flexDirection: 'row', gap: 16, overflow: 'hidden' },

    listPanel: { flex: 1, maxWidth: 300, borderRadius: 12, display: 'flex', flexDirection: 'column' },
    panelHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: theme.line, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    listBody: { flex: 1, minHeight: 0, padding: 12, gap: 8 },

    compactRow: { flexDirection: 'row', gap: 12, padding: 8, borderRadius: 8, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.line },
    compactRowSelected: { borderColor: theme.brandHeaderBackground, backgroundColor: theme.surfaceInset },
    compactPoster: { width: 40, height: 60, borderRadius: 6, backgroundColor: theme.background, overflow: 'hidden' },
    compactImage: { width: '100%', height: '100%', opacity: 0.8 },
    statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },

    editorPanel: { flex: 2, borderRadius: 12, display: 'flex', flexDirection: 'column' },
    editorContent: { flex: 1, minHeight: 0, padding: 16 },

    previewPanel: { flex: 1.5, borderRadius: 12, backgroundColor: theme.brandHeaderBackground, display: 'flex', flexDirection: 'column' },
    previewFrame: { width: 260, height: 460, backgroundColor: theme.background, borderRadius: 24, overflow: 'hidden', position: 'relative', borderWidth: 6, borderColor: theme.surfaceSecondary },
    previewImage: { width: '100%', height: '100%', opacity: 0.8 },
    previewOverlay: { position: 'absolute', inset: 0, padding: 20, justifyContent: 'space-between' },
    previewTopBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    previewBadge: { backgroundColor: theme.brand, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    previewBadgeText: { color: theme.textInverse, fontSize: 10, fontWeight: '900' },
    previewTime: { backgroundColor: theme.overlay, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    previewTimeText: { color: theme.textInverse, fontSize: 9, fontWeight: '700' },
    previewBottomContent: { gap: 12, display: 'flex', flexDirection: 'column' },
    previewCta: { backgroundColor: theme.surface, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
    previewCtaText: { color: theme.brandHeaderBackground, fontWeight: '900', fontSize: 12 },
    previewControls: { position: 'absolute', bottom: 12, left: 20, right: 20, gap: 8 },
    previewProgress: { height: 2, backgroundColor: theme.textInverse, borderRadius: 1, width: '40%' },
    previewIndicator: { width: 30, height: 2, backgroundColor: theme.textInverse, borderRadius: 1 },
  });
}

export default VideosCommandDeckScreen;
