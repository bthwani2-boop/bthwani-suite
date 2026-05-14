"use client";

import React from 'react';
import { Pressable, StyleSheet, View, Image } from 'react-native';
import {
  Box,
  Button,
  Surface,
  Tabs,
  Text,
  TextField,
  useDirection,
  SelectField,
} from '@bthwani/ui-kit';
import { WebControlPanelCompactPager } from '@bthwani/ui-kit/web';
import {
  getMarketingVideoItems,
  getMarketingVideoKpis,
  upsertMarketingVideoItem,
  toggleMarketingVideoStatus,
  duplicateMarketingVideoItem,
  removeMarketingVideoItem,
  type MarketingVideoRecord,
  type MarketingVideoStatus,
  type MarketingVideoAudience,
  type MarketingVideoSource,
  type MarketingVideoTargetType,
} from '../../shared/video.preview-store';
import { dshCategoryFixtures } from '../../app-client/data/categories.preview-data';
import { dshDiscoveryStores } from '../../app-client/data/discovery.preview-data';
import { storeItemsByStoreId } from '../../app-client/data/items.preview-data';

export type VideosCommandDeckScreenProps = {
  hubHref?: string;
  operationsHref?: string;
};

type VideoDraft = {
  id?: string;
  title: string;
  subtitle: string;
  status: MarketingVideoStatus;
  audience: MarketingVideoAudience;
  source: MarketingVideoSource;
  videoUrl: string;
  posterUrl: string;
  durationSeconds: string;
  mute: boolean;
  autoplay: boolean;
  loop: boolean;
  ctaLabel: string;
  highlight: string;
  targetType: MarketingVideoTargetType;
  targetId: string;
  targetExtra: string;
  order: string;
  reviewState: 'none' | 'pending' | 'approved' | 'rejected';
};

type EditorWorkspaceTab = 'content' | 'media' | 'target' | 'publish';

const videosPageSize = 5;

function createDraft(item?: MarketingVideoRecord | null): VideoDraft {
  return {
    id: item?.id,
    title: item?.title ?? '',
    subtitle: item?.subtitle ?? '',
    status: item?.status ?? 'draft',
    audience: item?.audience ?? 'client',
    source: item?.source ?? 'marketing',
    videoUrl: item?.videoUrl ?? '',
    posterUrl: item?.posterUrl ?? '',
    durationSeconds: String(item?.durationSeconds ?? 15),
    mute: item?.mute ?? true,
    autoplay: item?.autoplay ?? true,
    loop: item?.loop ?? true,
    ctaLabel: item?.ctaLabel ?? 'اكتشف الآن',
    highlight: item?.highlight ?? '',
    targetType: item?.targetType ?? 'home',
    targetId: item?.targetId ?? 'home',
    targetExtra: item?.targetExtra ?? '',
    order: String(item?.order ?? 1),
    reviewState: item?.reviewState ?? 'none',
  };
}

const TARGET_TYPE_OPTIONS: Array<{ value: MarketingVideoTargetType; label: string; description: string }> = [
  { value: 'home', label: 'الرئيسية', description: 'يعيد المستخدم إلى واجهة DSH الرئيسية.' },
  { value: 'stores', label: 'المتاجر', description: 'يفتح قائمة المتاجر أو تجربة التصفح العامة.' },
  { value: 'store', label: 'متجر', description: 'يربط الفيديو بمتجر واحد محدد.' },
  { value: 'category', label: 'فئة', description: 'يربط الفيديو بفئة رئيسية داخل DSH.' },
  { value: 'subcategory', label: 'فئة فرعية', description: 'يفتح فئة فرعية بعد اختيار الفئة الأم.' },
  { value: 'product', label: 'منتج', description: 'يربط الفيديو بمنتج داخل متجر محدد.' },
  { value: 'offer', label: 'عرض', description: 'يعرض متجرًا فيه عرض نشط وملفت.' },
  { value: 'campaign', label: 'حملة', description: 'يفتح وجهة حملات عامة ضمن القناة الحالية.' },
  { value: 'search', label: 'بحث', description: 'يفتح واجهة البحث.' },
  { value: 'custom', label: 'مخصص', description: 'مسار محدود ومضبوط عندما لا تكفي الخيارات المنظمة.' },
];

export function VideosCommandDeckScreen(_: VideosCommandDeckScreenProps) {
  const { direction } = useDirection();
  const isRtl = direction === 'rtl';

  // RTL Text styles helper
  const rtlText = { textAlign: isRtl ? 'right' : 'left', writingDirection: isRtl ? 'rtl' : 'ltr' } as const;

  const [items, setItems] = React.useState<MarketingVideoRecord[]>(() => getMarketingVideoItems());
  const [selectedId, setSelectedId] = React.useState<string | null>(() => getMarketingVideoItems()[0]?.id ?? null);
  const selected = React.useMemo(() => (selectedId ? (items.find((item) => item.id === selectedId) ?? null) : null), [items, selectedId]);
  const [draft, setDraft] = React.useState<VideoDraft>(() => createDraft(selected));
  const [activeEditorTab, setActiveEditorTab] = React.useState<EditorWorkspaceTab>('content');
  const [videosPage, setVideosPage] = React.useState(1);

  React.useEffect(() => {
    if (selected) {
      setDraft(createDraft(selected));
    }
  }, [selected]);

  const kpis = React.useMemo(() => getMarketingVideoKpis(), [items]);

  const totalPages = Math.max(1, Math.ceil(items.length / videosPageSize));
  const visibleItems = React.useMemo(() => {
    const startIndex = (videosPage - 1) * videosPageSize;
    return items.slice(startIndex, startIndex + videosPageSize);
  }, [items, videosPage]);

  React.useEffect(() => {
    setVideosPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  React.useEffect(() => {
    if (!selectedId) {
      return;
    }

    const selectedIndex = items.findIndex((item) => item.id === selectedId);
    if (selectedIndex < 0) {
      return;
    }

    setVideosPage(Math.floor(selectedIndex / videosPageSize) + 1);
  }, [items, selectedId]);

  function refresh() {
    setItems(getMarketingVideoItems());
  }

  function handleCreateNew() {
    setSelectedId(null);
    setDraft(createDraft(null));
    setActiveEditorTab('content');
  }

  function handleSave() {
    const saved = upsertMarketingVideoItem({
      ...draft,
      durationSeconds: Number(draft.durationSeconds) || 0,
      order: Number(draft.order) || 0,
    });
    refresh();
    setSelectedId(saved.id);
  }

  function handleToggle(item: MarketingVideoRecord) {
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
    if (!confirm('هل أنت متأكد من حذف هذا الفيديو؟')) return;
    removeMarketingVideoItem(item.id);
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
              <Text role="caption" style={[{ color: '#0A2F5C', fontWeight: '900', letterSpacing: 1 }, rtlText]}>استوديو الفيديو DSH v1</Text>
              <View style={{ backgroundColor: '#FF500D', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                <Text role="caption" style={[{ color: '#fff', fontSize: 9, fontWeight: '900' }, rtlText]}>احترافي</Text>
              </View>
            </View>
            <Text role="titleLg" style={[{ fontSize: 24, fontWeight: '900', color: '#0A2F5C' }, rtlText]}>استوديو الفيديو التسويقي</Text>
          </Box>

          <View style={[styles.kpiRow]}>
            {[
              { label: 'إجمالي المحتوى', value: kpis.total, color: '#0A2F5C', bg: '#fff' },
              { label: 'نشط الآن', value: kpis.live, color: '#16A34A', bg: '#fff' },
              { label: 'قيد المراجعة', value: kpis.review, color: '#D97706', bg: '#fff' },
            ].map((kpi) => (
              <View key={kpi.label} style={[styles.kpiPill, { backgroundColor: kpi.bg, borderWidth: 1, borderColor: 'rgba(10,47,92,0.08)' }]}>
                <Text role="caption" style={[{ fontWeight: '800', fontSize: 10, color: '#64748B' }, rtlText]}>{kpi.label}</Text>
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
            {visibleItems.map((item) => {
              const isSelected = selected?.id === item.id;
              return (
                <Pressable key={item.id} onPress={() => setSelectedId(item.id)} style={[styles.compactRow, isSelected && styles.compactRowSelected]}>
                  <View style={styles.compactPoster}>
                    {item.posterUrl ? <Image source={{ uri: item.posterUrl }} style={styles.compactImage} resizeMode="cover" /> : null}
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={[styles.headerRow, { alignItems: 'center' }]}>
                      <Text role="bodyStrong" numberOfLines={1} style={[{ flex: 1, fontSize: 13, color: '#0A2F5C' }, rtlText]}>{item.title}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: item.status === 'published' ? '#DCFCE7' : '#F1F5F9' }]}>
                        <Text role="caption" style={[{ color: item.status === 'published' ? '#16A34A' : '#64748B', fontWeight: '900', fontSize: 9 }, rtlText]}>{statusLabel(item.status)}</Text>
                      </View>
                    </View>
                    <View style={[styles.headerRow, { gap: 6, marginTop: 4, justifyContent: 'flex-start' }]}>
                      <Text role="caption" style={[{ color: '#64748B', fontSize: 10 }, rtlText]}>{item.durationSeconds}ث</Text>
                      <Text role="caption" style={[{ color: '#CBD5E1', fontSize: 10 }, rtlText]}>•</Text>
                      <Text role="caption" style={[{ color: '#64748B', fontSize: 10 }, rtlText]}>{TARGET_TYPE_OPTIONS.find(o => o.value === item.targetType)?.label}</Text>
                      <Text role="caption" style={[{ color: '#CBD5E1', fontSize: 10 }, rtlText]}>•</Text>
                      <Text role="caption" style={[{ color: '#64748B', fontSize: 10 }, rtlText]}>{item.source === 'partner' ? 'شريك' : 'داخلي'}</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
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
            <View style={[styles.headerRow, { gap: 8 }]}>
              {selected ? <Button label={selected.status === 'published' ? 'إيقاف' : 'نشر'} tone="secondary" size="sm" onPress={() => handleToggle(selected)} /> : null}
              <Button label="نسخة" tone="ghost" size="sm" onPress={() => selected && handleDuplicate(selected)} disabled={!selected} />
              <Button label="حذف" tone="ghost" size="sm" onPress={() => selected && handleDelete(selected)} disabled={!selected} />
              <Button label="حفظ" tone="primary" size="sm" onPress={handleSave} />
            </View>
          </View>

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
                    <TextField label="رابط الفيديو" value={draft.videoUrl} onChangeText={(v) => setDraft(d => ({ ...d, videoUrl: v }))} placeholder="https://..." style={{ textAlign: 'left', writingDirection: 'ltr' }} />
                  </View>
                  <View style={{ flex: 1, direction: 'ltr' }}>
                    <TextField label="رابط الغلاف (Poster)" value={draft.posterUrl} onChangeText={(v) => setDraft(d => ({ ...d, posterUrl: v }))} placeholder="https://..." style={{ textAlign: 'left', writingDirection: 'ltr' }} />
                  </View>
                </View>
                <View style={[styles.headerRow, { gap: 12 }]}>
                  <View style={{ flex: 1 }}>
                    <TextField label="المدة (ثانية)" value={draft.durationSeconds} onChangeText={(v) => setDraft(d => ({ ...d, durationSeconds: v }))} style={rtlText} />
                  </View>
                  <View style={{ flex: 1 }} />
                </View>
                <Box gap={2}>
                  <Text role="caption" style={[{ fontWeight: '900', color: '#64748B' }, rtlText]}>سلوك التشغيل</Text>
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
                     <Text role="caption" style={[{ color: '#64748B' }, rtlText]}>يعيد توجيه العميل للصفحة الرئيسية بشكل مباشر.</Text>
                   )}
                   {draft.targetType === 'stores' && (
                     <Text role="caption" style={[{ color: '#64748B' }, rtlText]}>يفتح القائمة العامة لاستكشاف المتاجر.</Text>
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
              </Box>
            )}
          </Box>
        </Surface>

        {/* Right: Preview Panel */}
        <Surface tone="inset" style={styles.previewPanel}>
          <View style={[styles.panelHeader]}>
            <Text role="titleSm" style={[{ fontWeight: '900', color: '#fff' }, rtlText]}>المعاينة الحية</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.previewFrame}>
              {draft.posterUrl ? (
                <Image source={{ uri: draft.posterUrl }} style={styles.previewImage} resizeMode="cover" />
              ) : (
                <View style={[styles.previewImage, { backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '800' }}>مساحة معاينة الفيديو</Text>
                </View>
              )}

              <View style={styles.previewOverlay}>
                <View style={[styles.previewTopBar]}>
                  <View style={styles.previewBadge}><Text style={[{ color: '#fff', fontSize: 10, fontWeight: '900' }, rtlText]}>{draft.highlight || 'عرض جديد'}</Text></View>
                  <View style={styles.previewTime}><Text style={[{ color: '#fff', fontSize: 9, fontWeight: '700' }, rtlText]}>{draft.durationSeconds} ث</Text></View>
                </View>

                <View style={styles.previewBottomContent}>
                  <Box gap={1} >
                    <Text role="titleSm" style={[{ color: '#fff', fontWeight: '900' }, rtlText]}>{draft.title || 'عنوان الفيديو يظهر هنا'}</Text>
                    <Text role="caption" style={[{ color: '#fff', opacity: 0.9 }, rtlText]}>{draft.subtitle || 'وصف الفيديو يظهر هنا بشكل مختصر وجذاب'}</Text>
                  </Box>
                  <View style={[styles.previewCta, isRtl ? { alignSelf: 'flex-end' } : null]}>
                    <Text style={[{ color: '#0A2F5C', fontWeight: '900', fontSize: 12 }, rtlText]}>{draft.ctaLabel}</Text>
                    <Text style={[{ color: '#0A2F5C', fontSize: 12 }, rtlText]}>{isRtl ? '←' : '→'}</Text>
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
            <Text role="caption" style={[{ color: '#94A3B8', marginTop: 12, textAlign: 'center' }, rtlText]}>{TARGET_TYPE_OPTIONS.find(o => o.value === draft.targetType)?.label} · {draft.targetId}</Text>
          </View>
        </Surface>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, display: 'flex', flexDirection: 'column', gap: 16, height: '100%' },
  rootRtl: { direction: 'rtl' },
  headerSurface: { borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(10,47,92,0.05)', flexShrink: 0 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  rowReverse: { flexDirection: 'row-reverse' },
  kpiRow: { flexDirection: 'row', gap: 12 },
  kpiPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },

  workspace: { flex: 1, flexDirection: 'row', gap: 16, overflow: 'hidden' },

  listPanel: { flex: 1, maxWidth: 300, borderRadius: 12, display: 'flex', flexDirection: 'column' },
  panelHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listBody: { flex: 1, minHeight: 0, padding: 12, gap: 8 },

  compactRow: { flexDirection: 'row', gap: 12, padding: 8, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#F1F5F9' },
  compactRowSelected: { borderColor: '#0A2F5C', backgroundColor: '#F8FAFC' },
  compactPoster: { width: 40, height: 60, borderRadius: 6, backgroundColor: '#000', overflow: 'hidden' },
  compactImage: { width: '100%', height: '100%', opacity: 0.8 },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },

  editorPanel: { flex: 2, borderRadius: 12, display: 'flex', flexDirection: 'column' },
  editorContent: { flex: 1, minHeight: 0, padding: 16 },

  previewPanel: { flex: 1.5, borderRadius: 12, backgroundColor: '#0A2F5C', display: 'flex', flexDirection: 'column' },
  previewFrame: { width: 260, height: 460, backgroundColor: '#000', borderRadius: 24, overflow: 'hidden', position: 'relative', borderWidth: 6, borderColor: '#1E293B' },
  previewImage: { width: '100%', height: '100%', opacity: 0.8 },
  previewOverlay: { position: 'absolute', inset: 0, padding: 20, justifyContent: 'space-between' },
  previewTopBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  previewBadge: { backgroundColor: '#FF500D', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  previewBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  previewTime: { backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  previewTimeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  previewBottomContent: { gap: 12, display: 'flex', flexDirection: 'column' },
  previewCta: { backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  previewCtaText: { color: '#0A2F5C', fontWeight: '900', fontSize: 12 },
  previewControls: { position: 'absolute', bottom: 12, left: 20, right: 20, gap: 8 },
  previewProgress: { height: 2, backgroundColor: '#fff', borderRadius: 1, width: '40%' },
  previewIndicator: { width: 30, height: 2, backgroundColor: '#fff', borderRadius: 1 },
});

export default VideosCommandDeckScreen;
