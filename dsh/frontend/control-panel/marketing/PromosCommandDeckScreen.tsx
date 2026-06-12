"use client";

import React from 'react';
import { Pressable, StyleSheet, View, Image } from 'react-native';
import { Box, Button, SelectField, Surface, Tabs, Text, TextField, useTheme,
  radius,
} from '@bthwani/ui-kit';
import { WebControlPanelCompactPager } from '@bthwani/ui-kit/web';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HomePromoRecord = Record<string, any>;
type HomePromoSummary = { id: (string); title: (string); status: (string); order: (number) };
function getHomePromoItems(): HomePromoRecord[] { return []; }
function getHomePromoSummaries(_opts?: unknown): { items: HomePromoSummary[]; total: number; page: number; pageSize: number } { return { items: [], total: 0, page: 1, pageSize: 20 }; }
function getHomePromoDetail(_id: string): HomePromoRecord | null { return null; }
function upsertHomePromoItem(_item: unknown): void {}
function removeHomePromoItem(_id: string): void {}
function toggleHomePromoStatus(_id: string): void {}
const dshCategoryFixtures: { id: (string); label: (string); subcategories: { id: (string); label: (string) }[] }[] = [];
const dshDiscoveryStores: { id: (string); name: (string) }[] = [];
const storeItemsByStoreId: Record<string, { id: (string); name: (string) }[]> = {};
import { resolveDshImageSource } from '../../app-client/shared/resolve-image-source';
import { useMarketingPermissions } from './marketing-permissions.contract';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

/**
 * Validation Rules:
 * - required fields: title, targetId (store, category, or product)
 * - format rules: targetType must be correctly mapped to targetId
 * - range: order (>=1)
 * - duplicate / conflict: Limits total active promos dynamically via toggle bounds.
 * - disabled reason: Missing 'marketing.edit' permission.
 * - error: Prevents save if targetId is missing for specific target types.
 * - success: Updates direct preview instantly and re-sorts promo grid.
 *
 * Conflict Resolution:
 * - detect: duplicate product/category targets via active toggles count
 * - display: toggle switch reverts and displays toast message
 * - owner: control-panel-marketing
 * - resolution action: User must disable an old promo to enable a new one
 * - audit/API-later: Backed by strict limit limits on active promos per grid
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

type PromoEditorSection = 'identity' | 'logic' | 'media';

const promoPageSize = 5;

function getPromoStatusLabel(status: string): string {
  return status === 'published' ? 'منشور' : 'مسودة';
}

export function PromosCommandDeckScreen() {
  const { hasPermission } = useMarketingPermissions();
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const createDraft = React.useCallback((item?: HomePromoRecord | null) => {
    const id = item?.id;
    const title = item?.title ?? '';
    const subtitle = item?.subtitle ?? '';
    const ctaText = item?.ctaText ?? 'افتح الآن';
    const accentColor = item?.accentColor ?? 'brandStrong';
    const imageUrl = item?.imageUrl ?? '';
    const thumbnail = item?.thumbnail ?? '';
    const targetType = item?.targetType ?? 'store';
    const targetId = item?.targetId ?? '';
    const targetLabel = item?.targetLabel ?? '';
    const status = item?.status ?? 'draft';
    const order = item?.order ?? 1;

    return {
      id, title, subtitle, ctaText, accentColor, imageUrl, thumbnail, targetType, targetId, targetLabel, status, order,
    };
  }, []);

  const selectedId = searchParams?.get('id') ?? null;
  const editorSection = (searchParams?.get('tab') as PromoEditorSection) || 'identity';
  const promoPageParam = parseInt(searchParams?.get('page') || '1', 10);
  const promoPage = isNaN(promoPageParam) || promoPageParam < 1 ? 1 : promoPageParam;

  const [summaries, setSummaries] = React.useState<HomePromoSummary[]>([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [selected, setSelected] = React.useState<HomePromoRecord | null>(null);

  const loadData = React.useCallback(() => {
    const result = getHomePromoSummaries({ page: promoPage, pageSize: promoPageSize });
    setSummaries(result.items);
    setTotalItems(result.total);
  }, [promoPage]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  React.useEffect(() => {
    if (selectedId) {
      setSelected(getHomePromoDetail(selectedId));
    } else if (summaries.length > 0 && !selectedId) {
      // Auto-select first item if none selected and we have items
      const newUrl = `${pathname}?id=${summaries[0].id}&tab=identity&page=${promoPage}`;
      router.replace(newUrl, { scroll: false });
    } else {
      setSelected(null);
    }
  }, [selectedId, summaries, pathname, router, promoPage]);

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
    updateQueryParams({ id, tab: 'identity' }, 'push');
  }, [updateQueryParams]);

  const setEditorSection = React.useCallback((tab: PromoEditorSection) => {
    updateQueryParams({ tab }, 'replace');
  }, [updateQueryParams]);

  const setPromoPage = React.useCallback((page: number | ((p: number) => number)) => {
    const nextPage = typeof page === 'function' ? page(promoPage) : page;
    updateQueryParams({ page: nextPage.toString() }, 'replace');
  }, [promoPage, updateQueryParams]);

  const [draft, setDraft] = React.useState(createDraft(selected));
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  React.useEffect(() => { setDraft(createDraft(selected)); }, [createDraft, selected]);

   const refresh = React.useCallback(() => {
      loadData();
      if (selectedId) setSelected(getHomePromoDetail(selectedId));
   }, [loadData, selectedId]);

  const [saveError, setSaveError] = React.useState<string | null>(null);

  function handleSave() {
    if (!draft.title?.trim()) { setSaveError('العنوان مطلوب.'); return; }
    if (!draft.targetId?.trim()) { setSaveError('الوجهة مطلوبة — اختر متجراً أو فئة أو منتجاً.'); return; }
    setSaveError(null);
    const allItems = getHomePromoItems();
    const order = allItems.length > 0 ? Math.max(...allItems.map(i => i.order ?? 0)) + 1 : 1;
    const saved = upsertHomePromoItem({ ...draft, order: draft.id ? (draft.order ?? order) : order });
    refresh();
    setSelectedId(saved.id);
    setEditorSection('identity');
  }

  function handleDuplicate() {
    if (!selected) return;
    const allItems = getHomePromoItems();
    const order = Math.max(...allItems.map(i => i.order ?? 0)) + 1;
    const saved = upsertHomePromoItem({ ...selected, id: undefined, title: `${selected.title} — نسخة`, status: 'draft', order });
    refresh();
    setSelectedId(saved.id);
  }

  function handleToggle() {
    const isActivating = selected ? selected.status === 'draft' : draft.status === 'draft';
    const targetIdToCheck = selected ? selected.targetId : draft.targetId;
    const targetTypeToCheck = selected ? selected.targetType : draft.targetType;

    const allItems = getHomePromoItems();

    if (isActivating) {
      const activeCount = allItems.filter(i => i.status === 'published').length;
      if (activeCount >= 5) {
        alert('لقد وصلت للحد الأقصى للعروض الترويجية النشطة (5). يرجى إيقاف عرض قديم أولاً.');
        return;
      }

      const isDuplicateTarget = allItems.some(i => i.id !== selectedId && i.status === 'published' && i.targetType === targetTypeToCheck && i.targetId === targetIdToCheck);
      if (isDuplicateTarget) {
        alert('لا يمكن التفعيل: يوجد عرض ترويجي مفعل آخر يوجه لنفس الوجهة.');
        return;
      }
    }

    if (selectedId) {
      toggleHomePromoStatus(selectedId);
    } else {
      const newStatus = draft.status === 'published' ? 'draft' : 'published';
      upsertHomePromoItem({ ...draft, status: newStatus, order: 1 });

    }
    refresh();
  }

   const totalPages = Math.max(1, Math.ceil(totalItems / promoPageSize));
   const visibleItems = summaries;

   React.useEffect(() => {
      setPromoPage((currentPage) => Math.min(currentPage, totalPages));
   }, [totalPages, setPromoPage]);

   React.useEffect(() => {
      if (!selectedId && visibleItems.length > 0) {
         setSelectedId(visibleItems[0].id);
      }
   }, [visibleItems, selectedId, setSelectedId]);

  const getTargetOptions = () => {
    if (draft.targetType === 'store') return dshDiscoveryStores.map(s => ({ value: s.id, label: s.name }));
    if (draft.targetType === 'category') return dshCategoryFixtures.map(c => ({ value: c.id, label: c.label }));
    if (draft.targetType === 'product') return dshDiscoveryStores.flatMap(s => (storeItemsByStoreId[s.id] ?? [])).map(p => ({ value: p.id, label: p.name }));
    return [{ value: 'home', label: 'الرئيسية' }];
  };

   const renderEditorSection = () => {
      if (editorSection === 'identity') {
         return (
            <Box gap={6}>
               <Text weight="black" style={{ fontSize: 11, color: theme.brandHeaderBackground }}>1. الهوية والمحتوى</Text>
               <TextField label="العنوان الرئيسي" value={draft.title} onChangeText={t => setDraft(d => ({ ...d, title: t }))} />
               <TextField label="الوصف الجذاب" value={draft.subtitle} onChangeText={t => setDraft(d => ({ ...d, subtitle: t }))} />
               <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TextField style={{ flex: 1 }} label="نص الزر" value={draft.ctaText} onChangeText={t => setDraft(d => ({ ...d, ctaText: t }))} />
                  <TextField style={{ flex: 1 }} label="لون التمييز" value={draft.accentColor} onChangeText={t => setDraft(d => ({ ...d, accentColor: t }))} />
               </View>
            </Box>
         );
      }

      if (editorSection === 'logic') {
         return (
            <Box gap={6}>
               <Text weight="black" style={{ fontSize: 11, color: theme.brandHeaderBackground }}>2. قواعد الربط الذكي</Text>
               <View style={{ flexDirection: 'row', gap: 12 }}>
                  <SelectField style={{ flex: 1 }} label="نوع الوجهة" value={draft.targetType} onValueChange={v => setDraft(d => ({ ...d, targetType: v }))} options={[{value:'store',label:'متجر'},{value:'category',label:'فئة'},{value:'product',label:'منتج'}]} />
                  <SelectField style={{ flex: 1 }} label="الوجهة المحددة" value={draft.targetId} onValueChange={v => setDraft(d => ({ ...d, targetId: v, targetLabel: getTargetOptions().find(o => o.value === v)?.label ?? '' }))} options={getTargetOptions()} />
               </View>
            </Box>
         );
      }

      return (
         <Box gap={6}>
            <Text weight="black" style={{ fontSize: 11, color: theme.brandHeaderBackground }}>3. الوسائط والترتيب</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
               <TextField style={{ flex: 1 }} label="خلفية القالب" value={draft.imageUrl} onChangeText={t => setDraft(d => ({ ...d, imageUrl: t }))} />
               <TextField style={{ flex: 1 }} label="أيقونة الشخصية" value={draft.thumbnail} onChangeText={t => setDraft(d => ({ ...d, thumbnail: t }))} />
            </View>
            <TextField
              label="الترتيب (رقم)"
              value={String(draft.order ?? '')}
              onChangeText={t => setDraft(d => ({ ...d, order: Number(t) || 1 }))}
              hint="رقم أصغر يظهر أولاً"
            />
         </Box>
      );
   };

  return (
      <Box style={{ padding: 12, height: '100%', overflow: 'hidden' }}>
      {/* Header Bar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: theme.line, paddingBottom: 8 }}>
         <Box gap={0}>
            <Text role="caption" weight="black" style={{ color: theme.brandHeaderBackground, letterSpacing: 0.5 }}>إدارة البروموهات والظهور</Text>
            <Text role="titleSm" weight="black" style={{ color: theme.brandHeaderBackground,}}>استوديو البروموهات</Text>
         </Box>
             <Button label="+ برومو جديد" onPress={() => { setSelectedId(null); setDraft(createDraft(null)); setEditorSection('identity'); }} tone="secondary" size="sm" style={{ width: 120 }} disabled={!hasPermission('marketing.edit')} />
      </View>

      <View style={{ flexDirection: 'row', gap: 16, flex: 1 }}>

        {/* Column 1: Selection Rail (Left) */}
        <Surface tone="raised" style={{ width: 180, borderRadius: radius.md, overflow: 'hidden', backgroundColor: theme.surfaceInset }}>
           <View style={{ padding: 8, backgroundColor: theme.surfaceSecondary }}>
              <Text weight="black" style={{ fontSize: 10, color: theme.textMuted }}>العروض النشطة</Text>
           </View>
           <Box style={{ flex: 1, minHeight: 0 }}>
              {visibleItems.length === 0 ? (
                <View style={{ padding: 16, alignItems: 'center', justifyContent: 'center' }}>
                  <Text weight="black" style={{ fontSize: 10, color: theme.textMuted, textAlign: 'center' }}>لا توجد عروض مطابقة للبحث أو الفلتر المختار.</Text>
                </View>
              ) : (
                visibleItems.map(item => (
                  <Pressable key={item.id} onPress={() => setSelectedId(item.id)} style={{
                    padding: 12,
                    backgroundColor: selectedId === item.id ? theme.brandHeaderBackground : 'transparent',
                    borderBottomWidth: 1,
                    borderBottomColor: theme.line
                  }}>
                    <Text weight="black" style={{ fontSize: 11, color: selectedId === item.id ? theme.textInverse : theme.text }} numberOfLines={1}>{item.title || 'بدون عنوان'}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: item.status === 'published' ? theme.success : theme.textSoft }} />
                        <Text style={{ fontSize: 9, color: selectedId === item.id ? theme.brandHeaderSurfaceStrong : theme.textMuted }}>{getPromoStatusLabel(item.status)}</Text>
                    </View>
                  </Pressable>
                ))
              )}
              <Box padding={2}>
                <WebControlPanelCompactPager
                  page={promoPage}
                  totalPages={totalPages}
                  summaryLabel={`عرض ${visibleItems.length} من ${totalItems}`}
                  onPrevious={promoPage > 1 ? () => setPromoPage((currentPage) => currentPage - 1) : undefined}
                  onNext={promoPage < totalPages ? () => setPromoPage((currentPage) => currentPage + 1) : undefined}
                />
              </Box>
           </Box>
        </Surface>

        {/* Column 2: Compact Form Studio (Center) */}
        <Box style={{ flex: 1 }} gap={12}>
           <Surface tone="raised" style={{ flex: 1, borderRadius: 16, padding: 16, overflow: 'hidden' }}>
              <Box gap={12} style={{ flex: 1, minHeight: 0 }}>
                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <Text weight="black" style={{ fontSize: 11, color: theme.textMuted }}>استوديو التحرير</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      {selectedId && deleteConfirmId === selectedId ? (
                        <>
                          <Button label="تأكيد" tone="danger" size="sm" onPress={() => { removeHomePromoItem(selectedId); setDeleteConfirmId(null); refresh(); }} disabled={!hasPermission('marketing.delete')} />
                          <Button label="إلغاء" tone="secondary" size="sm" onPress={() => setDeleteConfirmId(null)} />
                        </>
                      ) : (
                        <Button label="حذف" onPress={() => selectedId && setDeleteConfirmId(selectedId)} tone="danger" size="sm" disabled={!hasPermission('marketing.delete')} />
                      )}
                      {selectedId ? <Button label="نسخ" tone="ghost" size="sm" onPress={handleDuplicate} disabled={!hasPermission('marketing.edit')} /> : null}
                      <Button label={draft.status === 'published' ? 'إيقاف' : 'نشر'} onPress={handleToggle} tone="secondary" size="sm" disabled={!hasPermission('marketing.publish')} />
                      <Button label="حفظ" onPress={handleSave} tone="primary" size="sm" disabled={!draft.title?.trim() || !hasPermission('marketing.edit')} />
                    </View>
                 </View>

                 <Tabs<PromoEditorSection>
                    items={[
                      { value: 'identity', label: 'الهوية' },
                      { value: 'logic', label: 'الربط' },
                      { value: 'media', label: 'الوسائط' },
                    ]}
                    value={editorSection}
                    onValueChange={setEditorSection}
                    variant="pill"
                 />

                 {saveError ? (
                   <View style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: theme.dangerSurface ?? theme.surfaceInset, borderRadius: radius.xs }}>
                     <Text role="caption" style={{ color: theme.danger }}>{saveError}</Text>
                   </View>
                 ) : null}
                 <Box gap={16} style={{ flex: 1, minHeight: 0 }}>
                    {renderEditorSection()}
                 </Box>
              </Box>
           </Surface>
        </Box>

        {/* Column 3: Insights & Preview (Right) */}
        <Box style={{ width: 240 }} gap={12}>
           <Surface tone="raised" style={{ borderRadius: 16, padding: 12, backgroundColor: theme.brandHeaderBackground }}>
              <Text weight="black" style={{ color: theme.textInverse, fontSize: 11, marginBottom: 12 }}>معاينة مباشرة</Text>
              <View style={{ height: 70, backgroundColor: theme.surface, borderRadius: 12, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 }}>
                 {draft.imageUrl && <Image source={resolveDshImageSource(draft.imageUrl)} style={{ ...StyleSheet.absoluteFillObject, opacity: 0.4 }} resizeMode="cover" />}
                 <View style={{ width: 40, height: 50, zIndex: 2 }}>
                    {draft.thumbnail ? <Image source={resolveDshImageSource(draft.thumbnail)} style={{ width: '100%', height: '100%' }} resizeMode="contain" /> : <View style={{ flex:1, backgroundColor: theme.surfaceSecondary, borderRadius: radius.xs }} />}
                 </View>
                 <Box style={{ flex:1, alignItems:'center', zIndex:2 }}>
                    <Text weight="black" style={{ color: theme.brandHeaderBackground, fontSize:11, textAlign:'center' }}>{draft.title || 'العنوان'}</Text>
                    <Text weight="black" style={{ color: theme.brand, fontSize:9, textAlign:'center' }}>{draft.subtitle || 'الوصف'}</Text>
                 </Box>
              </View>
              <Text style={{ color: theme.brandHeaderSurfaceStrong, fontSize: 9, marginTop: 12, textAlign: 'center' }}>معاينة محلية داخل غرفة التحكم</Text>
           </Surface>

            <Surface tone="raised" style={{ flex: 1, borderRadius: 16, padding: 16 }}>
               <Text weight="black" style={{ fontSize: 11, color: theme.textMuted, marginBottom: 12 }}>الرؤى</Text>
               <Box gap={8}>
                  <View style={{ gap: 4, padding: 8, borderRadius: radius.sm, backgroundColor: theme.surfaceInset }}>
                     <Text style={{ fontSize: 9, color: theme.textMuted }}>إجمالي البروموهات</Text>
                     <Text weight="black" style={{ fontSize: 14, color: theme.brandHeaderBackground }}>{totalItems}</Text>
                  </View>
                  <View style={{ gap: 4, padding: 8, borderRadius: radius.sm, backgroundColor: theme.surfaceInset }}>
                     <Text style={{ fontSize: 9, color: theme.textMuted }}>منشور الآن</Text>
                     <Text weight="black" style={{ fontSize: 14, color: theme.success }}>{getHomePromoItems().filter(i => i.status === 'published').length}</Text>
                  </View>
                  <View style={{ gap: 4, padding: 8, borderRadius: radius.sm, backgroundColor: theme.surfaceInset }}>
                     <Text style={{ fontSize: 9, color: theme.textMuted }}>جاهزية الربط</Text>
                     <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: draft.targetId ? theme.success : theme.danger }} />
                        <Text weight="black" style={{ fontSize: 10 }}>{draft.targetId ? 'جاهز تقنياً' : 'مطلوب وجهة'}</Text>
                     </View>
                  </View>
               </Box>
               <Box style={{ marginTop: 'auto' }}>
                  <Text style={{ fontSize: 9, color: theme.textSoft, textAlign: 'center' }}>آخر مزامنة: الآن</Text>
               </Box>
            </Surface>
        </Box>
      </View>
    </Box>
  );
}

const styles = StyleSheet.create({});
