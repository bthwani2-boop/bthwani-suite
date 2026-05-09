"use client";

import React from 'react';
import { Pressable, ScrollView, StyleSheet, View, Image } from 'react-native';
import { Box, Button, SelectField, Surface, Text, TextField, useDirection } from '@bthwani/ui-kit';
import {
  getHomePromoItems,
  upsertHomePromoItem,
  removeHomePromoItem,
  toggleHomePromoStatus,
  type HomePromoRecord,
} from '../../shared/promo-store';
import { dshCategoryFixtures } from '../../app-client/dshCategoriesFixtures';
import { dshDiscoveryStores } from '../../app-client/discoveryFixtures';
import { storeItemsByStoreId } from '../../app-client/itemsFixtures';
import { resolveDshImageSource } from '../../app-client/resolve-image-source';

export function PromosCommandDeckScreen() {
  const { direction } = useDirection();
  const [items, setItems] = React.useState<HomePromoRecord[]>(() => getHomePromoItems());
  const [selectedId, setSelectedId] = React.useState<string | null>(() => getHomePromoItems()[0]?.id ?? null);
  const selected = React.useMemo(() => items.find(i => i.id === selectedId) ?? null, [items, selectedId]);
  const [draft, setDraft] = React.useState(createDraft(selected));

  React.useEffect(() => { setDraft(createDraft(selected)); }, [selected]);

  function createDraft(item?: HomePromoRecord | null) {
    return {
      id: item?.id,
      title: item?.title ?? '',
      subtitle: item?.subtitle ?? '',
      ctaText: item?.ctaText ?? 'افتح الآن',
      accentColor: item?.accentColor ?? '#0A2F5C',
      imageUrl: item?.imageUrl ?? '',
      thumbnail: item?.thumbnail ?? '',
      targetType: item?.targetType ?? 'store',
      targetId: item?.targetId ?? '',
      targetLabel: item?.targetLabel ?? '',
      status: item?.status ?? 'draft',
    };
  }

  function handleSave() {
    const saved = upsertHomePromoItem({ ...draft, order: 1 });
    const next = getHomePromoItems();
    setItems(next);
    setSelectedId(saved.id);
  }

  const getTargetOptions = () => {
    if (draft.targetType === 'store') return dshDiscoveryStores.map(s => ({ value: s.id, label: s.name }));
    if (draft.targetType === 'category') return dshCategoryFixtures.map(c => ({ value: c.id, label: c.label }));
    if (draft.targetType === 'product') return dshDiscoveryStores.slice(0,3).flatMap(s => (storeItemsByStoreId[s.id] ?? []).slice(0,3)).map(p => ({ value: p.id, label: p.name }));
    return [{ value: 'home', label: 'الرئيسية' }];
  };

  return (
    <Box style={{ padding: 12, height: 560, overflow: 'hidden' }}>
      {/* Header Bar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 8 }}>
         <Box gap={0}>
            <Text role="caption" style={{ color: '#0A2F5C', fontWeight: '900', letterSpacing: 0.5 }}>إدارة البروموهات والظهور</Text>
            <Text role="titleLg" style={{ fontWeight: '900', color: '#0A2F5C', fontSize: 18 }}>استوديو البروموهات</Text>
         </Box>
         <Button label="+ برومو جديد" onPress={() => { setSelectedId(null); setDraft(createDraft(null)); }} tone="secondary" size="sm" style={{ width: 120 }} />
      </View>

      <View style={{ flexDirection: 'row', gap: 16, flex: 1 }}>

        {/* Column 1: Selection Rail (Left) */}
        <Surface tone="raised" style={{ width: 180, borderRadius: 14, overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
           <View style={{ padding: 8, backgroundColor: '#F1F5F9' }}>
              <Text style={{ fontSize: 10, fontWeight: '900', color: '#64748B' }}>العروض النشطة</Text>
           </View>
           <ScrollView showsVerticalScrollIndicator={false}>
              {items.map(item => (
                <Pressable key={item.id} onPress={() => setSelectedId(item.id)} style={{
                  padding: 12,
                  backgroundColor: selectedId === item.id ? '#0A2F5C' : 'transparent',
                  borderBottomWidth: 1,
                  borderBottomColor: '#F1F5F9'
                }}>
                   <Text style={{ fontSize: 11, fontWeight: '800', color: selectedId === item.id ? '#fff' : '#1E293B' }} numberOfLines={1}>{item.title || 'بدون عنوان'}</Text>
                   <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: item.status === 'published' ? '#22C55E' : '#94A3B8' }} />
                      <Text style={{ fontSize: 9, color: selectedId === item.id ? 'rgba(255,255,255,0.6)' : '#64748B' }}>{item.status === 'published' ? 'منشور' : 'مسودة'}</Text>
                   </View>
                </Pressable>
              ))}
           </ScrollView>
        </Surface>

        {/* Column 2: Compact Form Studio (Center) */}
        <Box style={{ flex: 1 }} gap={12}>
           <Surface tone="raised" style={{ flex: 1, borderRadius: 16, padding: 16 }}>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
                 {/* Row 1: Identity */}
                 <Box gap={6}>
                    <Text style={{ fontSize: 11, fontWeight: '900', color: '#0A2F5C' }}>1. الهوية والمحتوى</Text>
                    <TextField label="العنوان الرئيسي" value={draft.title} onChangeText={t => setDraft(d => ({ ...d, title: t }))} />
                    <TextField label="الوصف الجذاب" value={draft.subtitle} onChangeText={t => setDraft(d => ({ ...d, subtitle: t }))} />
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                       <TextField style={{ flex: 1 }} label="نص الزر" value={draft.ctaText} onChangeText={t => setDraft(d => ({ ...d, ctaText: t }))} />
                       <TextField style={{ flex: 1 }} label="لون التمييز" value={draft.accentColor} onChangeText={t => setDraft(d => ({ ...d, accentColor: t }))} />
                    </View>
                 </Box>

                 {/* Row 2: Logic */}
                 <Box gap={6}>
                    <Text style={{ fontSize: 11, fontWeight: '900', color: '#0A2F5C' }}>2. قواعد الربط الذكي</Text>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                       <SelectField style={{ flex: 1 }} label="نوع الوجهة" value={draft.targetType} onValueChange={v => setDraft(d => ({ ...d, targetType: v }))} options={[{value:'store',label:'متجر'},{value:'category',label:'فئة'},{value:'product',label:'منتج'}]} />
                       <SelectField style={{ flex: 1 }} label="الوجهة المحددة" value={draft.targetId} onValueChange={(v,o) => setDraft(d => ({ ...d, targetId: v, targetLabel: o?.label??'' }))} options={getTargetOptions()} />
                    </View>
                 </Box>

                 {/* Row 3: Media */}
                 <Box gap={6}>
                    <Text style={{ fontSize: 11, fontWeight: '900', color: '#0A2F5C' }}>3. الوسائط</Text>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                       <TextField style={{ flex: 1 }} label="خلفية القالب" value={draft.imageUrl} onChangeText={t => setDraft(d => ({ ...d, imageUrl: t }))} />
                       <TextField style={{ flex: 1 }} label="أيقونة الشخصية" value={draft.thumbnail} onChangeText={t => setDraft(d => ({ ...d, thumbnail: t }))} />
                    </View>
                 </Box>
              </ScrollView>
           </Surface>

           {/* Sticky Actions Bar */}
           <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 4 }}>
              <Button label="حذف" onPress={() => { removeHomePromoItem(selectedId!); refresh(); }} tone="danger" style={{ flex: 0.3 }} />
              <Button label={draft.status === 'published' ? 'إيقاف النشر' : 'تفعيل ونشر'} onPress={() => setDraft(d => ({ ...d, status: d.status === 'published' ? 'draft' : 'published' }))} tone="secondary" style={{ flex: 0.7 }} />
              <Button label="حفظ التغييرات" onPress={handleSave} tone="primary" style={{ flex: 1 }} />
           </View>
        </Box>

        {/* Column 3: Insights & Preview (Right) */}
        <Box style={{ width: 240 }} gap={12}>
           <Surface tone="raised" style={{ borderRadius: 16, padding: 12, backgroundColor: '#0A2F5C' }}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '900', marginBottom: 12 }}>معاينة مباشرة</Text>
              <View style={{ height: 70, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 }}>
                 {draft.imageUrl && <Image source={resolveDshImageSource(draft.imageUrl)} style={{ ...StyleSheet.absoluteFillObject, opacity: 0.4 }} resizeMode="cover" />}
                 <View style={{ width: 40, height: 50, zIndex: 2 }}>
                    {draft.thumbnail ? <Image source={resolveDshImageSource(draft.thumbnail)} style={{ width: '100%', height: '100%' }} resizeMode="contain" /> : <View style={{ flex:1, backgroundColor:'#F1F5F9', borderRadius:6 }} />}
                 </View>
                 <Box style={{ flex:1, alignItems:'center', zIndex:2 }}>
                    <Text style={{ color:'#0A2F5C', fontSize:11, fontWeight:'900', textAlign:'center' }}>{draft.title || 'العنوان'}</Text>
                    <Text style={{ color:'#FF500D', fontSize:9, fontWeight:'800', textAlign:'center' }}>{draft.subtitle || 'الوصف'}</Text>
                 </Box>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, marginTop: 12, textAlign: 'center' }}>دقة العرض اللحظي: 100%</Text>
           </Surface>

            <Surface tone="raised" style={{ flex: 1, borderRadius: 16, padding: 16 }}>
               <Text style={{ fontWeight: '900', fontSize: 11, color: '#64748B', marginBottom: 12 }}>الرؤى</Text>
               <Box gap={8}>
                  <View style={{ gap: 4, padding: 8, borderRadius: 10, backgroundColor: '#F8FAFC' }}>
                     <Text style={{ fontSize: 9, color: '#64748B' }}>الوصول المتوقع</Text>
                     <Text style={{ fontSize: 14, fontWeight: '900', color: '#0A2F5C' }}>12,500 مستخدم</Text>
                  </View>
                  <View style={{ gap: 4, padding: 8, borderRadius: 10, backgroundColor: '#F8FAFC' }}>
                     <Text style={{ fontSize: 9, color: '#64748B' }}>جاهزية الربط</Text>
                     <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: draft.targetId ? '#16A34A' : '#EF4444' }} />
                        <Text style={{ fontSize: 10, fontWeight: '800' }}>{draft.targetId ? 'جاهز تقنياً' : 'مطلوب وجهة'}</Text>
                     </View>
                  </View>
               </Box>
               <Box style={{ marginTop: 'auto' }}>
                  <Text style={{ fontSize: 9, color: '#94A3B8', textAlign: 'center' }}>آخر مزامنة: الآن</Text>
               </Box>
            </Surface>
        </Box>
      </View>
    </Box>
  );
}

const styles = StyleSheet.create({});
