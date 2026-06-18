"use client";

// Authority: control-panel/marketing — VideosCommandDeckScreen (slim entry point).
// Giant Screen split: types → video-types.ts | utils → video-target-utils.ts
//                     preview → VideoViewer.tsx | editor → VideoEditorSection.tsx
// This file retains: component state, URL param management, data handlers, layout JSX.

import React from 'react';
import { Pressable, StyleSheet, View, Image } from 'react-native';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Box,
  Button,
  Surface,
  Text,
  useTheme,
  useDirection,
  radius,
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
} from '../../shared/marketing';
import type { MarketingVideoRecord, MarketingVideoStatus, MarketingVideoSummary } from '../../shared/marketing';
import { useMarketingPermissions } from './marketing-permissions.contract';
import type { VideoDraft, EditorWorkspaceTab } from './video-types';
import { createDraft } from './video-target-utils';
import { VideoViewer } from './VideoViewer';
import { VideoEditorSection } from './VideoEditorSection';

export type VideosCommandDeckScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  activeSubTab?: string;
  setActiveTab?: (tab: string) => void;
};

export function VideosCommandDeckScreen({ hubHref, operationsHref }: VideosCommandDeckScreenProps) {
  const { hasPermission } = useMarketingPermissions();
  const { theme } = useTheme();
  const { direction } = useDirection();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // --- URL-driven state ---
  const selectedId = searchParams?.get('id') ?? null;
  const activeEditorTab = (searchParams?.get('tab') as EditorWorkspaceTab) || 'content';
  const videosPageParam = parseInt(searchParams?.get('page') || '1', 10);
  const videosPage = isNaN(videosPageParam) || videosPageParam < 1 ? 1 : videosPageParam;

  const isRtl = direction === 'rtl';
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  // RTL Text styles helper
  const rtlText = { textAlign: isRtl ? 'right' : 'left', writingDirection: isRtl ? 'rtl' : 'ltr' } as const;

  const [summaries, setSummaries] = React.useState<MarketingVideoSummary[]>([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [selected, setSelected] = React.useState<MarketingVideoRecord | null>(null);

  const loadData = React.useCallback(() => {
    const result = getMarketingVideoSummaries({ page: videosPage, pageSize: 5 });
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
  const [saveError, setSaveError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (selected) {
      setDraft(createDraft(selected));
    }
  }, [selected]);

  const kpis = React.useMemo(() => getMarketingVideoKpis(), [summaries]); // eslint-disable-line react-hooks/exhaustive-deps
  const totalPages = Math.max(1, Math.ceil(totalItems / 5));
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
  }

  function handleSave() {
    if (!draft.title?.trim()) {
      setSaveError('عنوان الفيديو مطلوب.');
      return;
    }
    if (!draft.videoUrl?.trim()) {
      setSaveError('رابط الفيديو مطلوب.');
      return;
    }

    setSaveError(null);
    const saved = upsertMarketingVideoItem({
      ...draft,
      durationSeconds: Number(draft.durationSeconds) || 0,
      order: Number(draft.order) || 0,
    } as unknown as Partial<MarketingVideoRecord>);
    refresh();
    setSelectedId(saved.id);
  }

  function handleToggle(item: MarketingVideoRecord) {
    toggleMarketingVideoStatus(item.id);
    refresh();
  }

  function handleDuplicate(item: MarketingVideoRecord) {
    const saved = duplicateMarketingVideoItem(item.id);
    refresh();
    if (saved) setSelectedId(saved.id);
  }

  function handleDelete(item: MarketingVideoRecord) {
    removeMarketingVideoItem(item.id);
    setDeleteConfirmId(null);
    setSelectedId(null);
    const next = getMarketingVideoItems();
    setSelectedId(next[0]?.id ?? null);
  }

  const statusLabel = (s: MarketingVideoStatus) => {
    if (s === 'published') return 'منشور';
    if (s === 'paused') return 'موقوف';
    if (s === 'review') return 'مراجعة';
    return 'مسودة';
  };

  return (
    <View style={[styles.root, isRtl ? styles.rootRtl : null]}>
      {/* 1. Header & KPI Strip */}
      <Surface tone="raised" style={styles.headerSurface}>
        <View style={[styles.headerRow, isRtl ? styles.rowReverse : null]}>
          <Box gap={1} >
            <View style={[styles.headerRow, { gap: 8, justifyContent: 'flex-start' }]}>
              <Text role="caption" weight="black" style={[{ color: theme.brand, letterSpacing: 1 }, rtlText]}>استوديو الفيديو DSH v1</Text>
              <View style={{ backgroundColor: theme.brand, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                <Text role="caption" weight="black" style={[{ color: theme.textInverse, fontSize: 9 }, rtlText]}>احترافي</Text>
              </View>
            </View>
            <Text role="titleLg" weight="black" style={[{ color: theme.brandHeaderBackground }, rtlText]}>استوديو الفيديو التسويقي</Text>
          </Box>

          <View style={[styles.kpiRow]}>
            {[
              { label: 'إجمالي المحتوى', value: kpis.total.value, color: theme.brandHeaderBackground, bg: theme.surface },
              { label: 'نشط الآن', value: kpis.live.value, color: theme.success, bg: theme.surface },
              { label: 'قيد المراجعة', value: kpis.review.value, color: theme.warning, bg: theme.surface },
            ].map((kpi) => (
              <View key={kpi.label} style={[styles.kpiPill, { backgroundColor: kpi.bg, borderWidth: 1, borderColor: theme.lineStrong }]}>
                <Text role="caption" weight="black" style={[{ fontSize: 10, color: theme.textMuted }, rtlText]}>{kpi.label}</Text>
                <Text role="titleMd" weight="black" style={[{ color: kpi.color, fontSize: 16 }, rtlText]}>{String(kpi.value)}</Text>
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
            <Text role="titleSm" weight="black" style={[{ }, rtlText]}>مكتبة المحتوى</Text>
            <Text role="caption" tone="muted" style={rtlText}>{totalItems} فيديوهات</Text>
          </View>
          <Box gap={2} style={styles.listBody}>
            {visibleItems.length === 0 ? (
              <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surfaceInset, borderRadius: 12 }}>
                <Text weight="black" style={{ color: theme.textMuted, textAlign: 'center' }}>لا توجد فيديوهات مطابقة للبحث أو الفلتر المختار.</Text>
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
                          <Text role="caption" weight="black" style={[{ color: item.status === 'published' ? theme.success : theme.textMuted, fontSize: 9 }, rtlText]}>{statusLabel(item.status)}</Text>
                        </View>
                      </View>
                      <View style={[styles.headerRow, { gap: 6, marginTop: 4, justifyContent: 'flex-start' }]}>
                        <Text role="caption" style={[{ color: theme.textMuted, fontSize: 10 }, rtlText]}>{item.durationSeconds}ث</Text>
                        <Text role="caption" style={[{ color: theme.lineStrong, fontSize: 10 }, rtlText]}>•</Text>
                        <Text role="caption" style={[{ color: theme.textMuted, fontSize: 10 }, rtlText]}>{item.targetType}</Text>
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
              summaryLabel={`عرض ${visibleItems.length} من ${totalItems} فيديوهات`}
              onPrevious={videosPage > 1 ? () => setVideosPage((currentPage) => currentPage - 1) : undefined}
              onNext={videosPage < totalPages ? () => setVideosPage((currentPage) => currentPage + 1) : undefined}
            />
          </Box>
        </Surface>

        {/* Center: Editor Panel */}
        <VideoEditorSection
          draft={draft}
          setDraft={setDraft}
          activeEditorTab={activeEditorTab}
          setActiveEditorTab={setActiveEditorTab}
          selected={selected}
          handleToggle={handleToggle}
          handleDuplicate={handleDuplicate}
          handleDelete={handleDelete}
          deleteConfirmId={deleteConfirmId}
          setDeleteConfirmId={setDeleteConfirmId}
          handleSave={handleSave}
          hasPermission={hasPermission}
          hubHref={hubHref}
          operationsHref={operationsHref}
          saveError={saveError}
          theme={theme}
          styles={styles}
          rtlText={rtlText}
          refresh={refresh}
        />

        {/* Right: Preview Panel */}
        <VideoViewer
          draft={draft}
          theme={theme}
          styles={styles}
          isRtl={isRtl}
          rtlText={rtlText}
        />
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
    compactPoster: { width: 40, height: 60, borderRadius: radius.xs, backgroundColor: theme.background, overflow: 'hidden' },
    compactImage: { width: '100%', height: '100%', opacity: 0.8 },
    statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },

    editorPanel: { flex: 2, borderRadius: 12, display: 'flex', flexDirection: 'column' },
    editorContent: { flex: 1, minHeight: 0, padding: 16 },

    previewPanel: { flex: 1.5, borderRadius: 12, backgroundColor: theme.brandHeaderBackground, display: 'flex', flexDirection: 'column' },
    previewFrame: { width: 260, height: 460, backgroundColor: theme.background, borderRadius: radius.xl, overflow: 'hidden', position: 'relative', borderWidth: 6, borderColor: theme.surfaceSecondary },
    previewImage: { width: '100%', height: '100%', opacity: 0.8 },
    previewOverlay: { position: 'absolute', inset: 0, padding: 20, justifyContent: 'space-between' },
    previewTopBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    previewBadge: { backgroundColor: theme.brand, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.xs },
    previewBadgeText: { color: theme.textInverse, fontSize: 10, fontWeight: '900' },
    previewTime: { backgroundColor: theme.overlay, paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.xs },
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
