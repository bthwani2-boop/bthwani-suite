"use client";

import React from 'react';
import { Pressable, StyleSheet, View, Image } from 'react-native';
import { Box, Button, SelectField, Surface, Tabs, Text, TextField, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelCompactPager } from '@bthwani/ui-kit/web';
import {
  getHomePromoItems,
  upsertHomePromoItem,
  removeHomePromoItem,
  toggleHomePromoStatus,
  type HomePromoRecord,
} from '../../data/promo.preview-store';
import { dshCategoryFixtures } from '../../data/categories.preview-data';
import { dshDiscoveryStores } from '../../data/discovery.preview-data';
import { storeItemsByStoreId } from '../../data/items.preview-data';
import { resolveDshImageSource } from '../../app-client/shared/resolve-image-source';

type PromoEditorSection = 'identity' | 'logic' | 'media';

const promoPageSize = 5;

export function PromosCommandDeckScreen() {
  const { theme } = useTheme();
  const createDraft = React.useCallback((item?: HomePromoRecord | null) => {
    return {
      id: item?.id,
      title: item?.title ?? '',
      subtitle: item?.subtitle ?? '',
      ctaText: item?.ctaText ?? 'افتح الآن',
      accentColor: item?.accentColor ?? theme.brandHeaderBackground,
      imageUrl: item?.imageUrl ?? '',
      thumbnail: item?.thumbnail ?? '',
      targetType: item?.targetType ?? 'store',
      targetId: item?.targetId ?? '',
      targetLabel: item?.targetLabel ?? '',
      status: item?.status ?? 'draft',
    };
  }, [theme.brandHeaderBackground]);
  const [items, setItems] = React.useState<HomePromoRecord[]>(() => getHomePromoItems());
  const [selectedId, setSelectedId] = React.useState<string | null>(() => getHomePromoItems()[0]?.id ?? null);
  const selected = React.useMemo(() => items.find(i => i.id === selectedId) ?? null, [items, selectedId]);
  const [draft, setDraft] = React.useState(createDraft(selected));
   const [promoPage, setPromoPage] = React.useState(1);
   const [editorSection, setEditorSection] = React.useState<PromoEditorSection>('identity');

  React.useEffect(() => { setDraft(createDraft(selected)); }, [createDraft, selected]);

   const refresh = React.useCallback(() => {
      setItems(getHomePromoItems());
   }, []);

  function handleSave() {
    const saved = upsertHomePromoItem({ ...draft, order: 1 });
    const next = getHomePromoItems();
    setItems(next);
    setSelectedId(saved.id);
      setEditorSection('identity');
  }

   const totalPages = Math.max(1, Math.ceil(items.length / promoPageSize));
   const visibleItems = React.useMemo(() => {
      const startIndex = (promoPage - 1) * promoPageSize;
      return items.slice(startIndex, startIndex + promoPageSize);
   }, [items, promoPage]);

   React.useEffect(() => {
      setPromoPage((currentPage) => Math.min(currentPage, totalPages));
   }, [totalPages]);

   React.useEffect(() => {
      if (items.length === 0) {
         setSelectedId(null);
         return;
      }

      if (selectedId && items.some((item) => item.id === selectedId)) {
         return;
      }

      setSelectedId(items[0].id);
   }, [items, selectedId]);

  const getTargetOptions = () => {
    if (draft.targetType === 'store') return dshDiscoveryStores.map(s => ({ value: s.id, label: s.name }));
    if (draft.targetType === 'category') return dshCategoryFixtures.map(c => ({ value: c.id, label: c.label }));
    if (draft.targetType === 'product') return dshDiscoveryStores.slice(0,3).flatMap(s => (storeItemsByStoreId[s.id] ?? []).slice(0,3)).map(p => ({ value: p.id, label: p.name }));
    return [{ value: 'home', label: 'الرئيسية' }];
  };

   const renderEditorSection = () => {
      if (editorSection === 'identity') {
         return (
            <Box gap={6}>
               <Text style={{ fontSize: 11, fontWeight: '900', color: theme.brandHeaderBackground }}>1. الهوية والمحتوى</Text>
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
               <Text style={{ fontSize: 11, fontWeight: '900', color: theme.brandHeaderBackground }}>2. قواعد الربط الذكي</Text>
               <View style={{ flexDirection: 'row', gap: 12 }}>
                  <SelectField style={{ flex: 1 }} label="نوع الوجهة" value={draft.targetType} onValueChange={v => setDraft(d => ({ ...d, targetType: v }))} options={[{value:'store',label:'متجر'},{value:'category',label:'فئة'},{value:'product',label:'منتج'}]} />
                  <SelectField style={{ flex: 1 }} label="الوجهة المحددة" value={draft.targetId} onValueChange={v => setDraft(d => ({ ...d, targetId: v, targetLabel: getTargetOptions().find(o => o.value === v)?.label ?? '' }))} options={getTargetOptions()} />
               </View>
            </Box>
         );
      }

      return (
         <Box gap={6}>
            <Text style={{ fontSize: 11, fontWeight: '900', color: theme.brandHeaderBackground }}>3. الوسائط</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
               <TextField style={{ flex: 1 }} label="خلفية القالب" value={draft.imageUrl} onChangeText={t => setDraft(d => ({ ...d, imageUrl: t }))} />
               <TextField style={{ flex: 1 }} label="أيقونة الشخصية" value={draft.thumbnail} onChangeText={t => setDraft(d => ({ ...d, thumbnail: t }))} />
            </View>
         </Box>
      );
   };

  return (
      <Box style={{ padding: 12, height: '100%', overflow: 'hidden' }}>
      {/* Header Bar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: theme.line, paddingBottom: 8 }}>
         <Box gap={0}>
            <Text role="caption" style={{ color: theme.brandHeaderBackground, fontWeight: '900', letterSpacing: 0.5 }}>إدارة البروموهات والظهور</Text>
            <Text role="titleLg" style={{ fontWeight: '900', color: theme.brandHeaderBackground, fontSize: 18 }}>استوديو البروموهات</Text>
         </Box>
             <Button label="+ برومو جديد" onPress={() => { setSelectedId(null); setDraft(createDraft(null)); setEditorSection('identity'); }} tone="secondary" size="sm" style={{ width: 120 }} />
      </View>

      <View style={{ flexDirection: 'row', gap: 16, flex: 1 }}>

        {/* Column 1: Selection Rail (Left) */}
        <Surface tone="raised" style={{ width: 180, borderRadius: 14, overflow: 'hidden', backgroundColor: theme.surfaceInset }}>
           <View style={{ padding: 8, backgroundColor: theme.surfaceSecondary }}>
              <Text style={{ fontSize: 10, fontWeight: '900', color: theme.textMuted }}>العروض النشطة</Text>
           </View>
           <Box style={{ flex: 1, minHeight: 0 }}>
              {visibleItems.map(item => (
                <Pressable key={item.id} onPress={() => setSelectedId(item.id)} style={{
                  padding: 12,
                  backgroundColor: selectedId === item.id ? theme.brandHeaderBackground : 'transparent',
                  borderBottomWidth: 1,
                  borderBottomColor: theme.line
                }}>
                   <Text style={{ fontSize: 11, fontWeight: '800', color: selectedId === item.id ? theme.textInverse : theme.text }} numberOfLines={1}>{item.title || 'بدون عنوان'}</Text>
                   <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: item.status === 'published' ? theme.success : theme.textSoft }} />
                      <Text style={{ fontSize: 9, color: selectedId === item.id ? theme.brandHeaderSurfaceStrong : theme.textMuted }}>{item.status === 'published' ? 'منشور' : 'مسودة'}</Text>
                   </View>
                </Pressable>
              ))}
              <Box padding={2}>
                <WebControlPanelCompactPager
                  page={promoPage}
                  totalPages={totalPages}
                  summaryLabel={`عرض ${visibleItems.length} من ${items.length}`}
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
                    <Text style={{ fontSize: 11, fontWeight: '900', color: theme.textMuted }}>استوديو التحرير</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <Button label="حذف" onPress={() => { if (!selectedId) return; removeHomePromoItem(selectedId); refresh(); }} tone="danger" size="sm" />
                      <Button label={draft.status === 'published' ? 'إيقاف' : 'نشر'} onPress={() => setDraft(d => ({ ...d, status: d.status === 'published' ? 'draft' : 'published' }))} tone="secondary" size="sm" />
                      <Button label="حفظ" onPress={handleSave} tone="primary" size="sm" />
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

                 <Box gap={16} style={{ flex: 1, minHeight: 0 }}>
                    {renderEditorSection()}
                 </Box>
              </Box>
           </Surface>
        </Box>

        {/* Column 3: Insights & Preview (Right) */}
        <Box style={{ width: 240 }} gap={12}>
           <Surface tone="raised" style={{ borderRadius: 16, padding: 12, backgroundColor: theme.brandHeaderBackground }}>
              <Text style={{ color: theme.textInverse, fontSize: 11, fontWeight: '900', marginBottom: 12 }}>معاينة مباشرة</Text>
              <View style={{ height: 70, backgroundColor: theme.surface, borderRadius: 12, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 }}>
                 {draft.imageUrl && <Image source={resolveDshImageSource(draft.imageUrl)} style={{ ...StyleSheet.absoluteFillObject, opacity: 0.4 }} resizeMode="cover" />}
                 <View style={{ width: 40, height: 50, zIndex: 2 }}>
                    {draft.thumbnail ? <Image source={resolveDshImageSource(draft.thumbnail)} style={{ width: '100%', height: '100%' }} resizeMode="contain" /> : <View style={{ flex:1, backgroundColor: theme.surfaceSecondary, borderRadius:6 }} />}
                 </View>
                 <Box style={{ flex:1, alignItems:'center', zIndex:2 }}>
                    <Text style={{ color: theme.brandHeaderBackground, fontSize:11, fontWeight:'900', textAlign:'center' }}>{draft.title || 'العنوان'}</Text>
                    <Text style={{ color: theme.brand, fontSize:9, fontWeight:'800', textAlign:'center' }}>{draft.subtitle || 'الوصف'}</Text>
                 </Box>
              </View>
              <Text style={{ color: theme.brandHeaderSurfaceStrong, fontSize: 9, marginTop: 12, textAlign: 'center' }}>معاينة محلية داخل غرفة التحكم</Text>
           </Surface>

            <Surface tone="raised" style={{ flex: 1, borderRadius: 16, padding: 16 }}>
               <Text style={{ fontWeight: '900', fontSize: 11, color: theme.textMuted, marginBottom: 12 }}>الرؤى</Text>
               <Box gap={8}>
                  <View style={{ gap: 4, padding: 8, borderRadius: 10, backgroundColor: theme.surfaceInset }}>
                     <Text style={{ fontSize: 9, color: theme.textMuted }}>الوصول المتوقع</Text>
                     <Text style={{ fontSize: 14, fontWeight: '900', color: theme.brandHeaderBackground }}>12,500 مستخدم</Text>
                  </View>
                  <View style={{ gap: 4, padding: 8, borderRadius: 10, backgroundColor: theme.surfaceInset }}>
                     <Text style={{ fontSize: 9, color: theme.textMuted }}>جاهزية الربط</Text>
                     <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: draft.targetId ? theme.success : theme.danger }} />
                        <Text style={{ fontSize: 10, fontWeight: '800' }}>{draft.targetId ? 'جاهز تقنياً' : 'مطلوب وجهة'}</Text>
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
