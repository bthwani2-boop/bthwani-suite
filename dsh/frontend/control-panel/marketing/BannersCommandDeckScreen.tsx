"use client";

import React from 'react';
import { Pressable, StyleSheet, View, Image } from 'react-native';
import { Box, Button, Surface, Tabs, Text, TextField, useDirection, colorPalette } from '@bthwani/ui-kit';
import {
  computeMarketingBannerQuality,
  duplicateMarketingBannerItem,
  getMarketingBannerItems,
  getMarketingBannerKpis,
  removeMarketingBannerItem,
  toggleMarketingBannerStatus,
  upsertMarketingBannerItem,
  type MarketingBannerActionType,
  type MarketingBannerAudience,
  type MarketingBannerRecord,
  type MarketingBannerStatus,
} from '../../shared/banner-store';

export type BannersCommandDeckScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  activeSubTab?: string;
};

type BannerDraft = {
  id?: string;
  title: string;
  subtitle: string;
  mediaKey: string;
  accentColor: string;
  audience: MarketingBannerAudience;
  status: MarketingBannerStatus;
  actionType: MarketingBannerActionType;
  actionTarget: string;
  actionExtra: string;
  ctaLabel: string;
  partnerName: string;
  imageUrl: string;
  position: string;
  // Template fields
  templateId: string;
  offerBadgeText: string;
  offerBadgeTone: string;
  partnerLogoUrl: string;
  partnerLogoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  overlayImageUrl: string;
  overlayPosition: 'center' | 'bottom' | 'top';
  textPlacement: 'top' | 'center' | 'bottom';
  imageFit: 'cover' | 'contain';
};

function createDraft(item?: MarketingBannerRecord | null): BannerDraft {
  return {
    id: item?.id,
    title: item?.title ?? '',
    subtitle: item?.subtitle ?? '',
    mediaKey: item?.mediaKey ?? '',
    accentColor: item?.accentColor ?? '#0A2F5C',
    audience: item?.audience ?? 'all',
    status: item?.status ?? 'draft',
    actionType: item?.actionType ?? 'external',
    actionTarget: item?.actionTarget ?? 'DshStoresList',
    actionExtra: item?.actionExtra ?? '',
    ctaLabel: item?.ctaLabel ?? 'اكتشف الآن',
    partnerName: item?.partnerName ?? '',
    imageUrl: item?.imageUrl ?? '',
    position: String(item?.position ?? ''),
    templateId: item?.templateId ?? 'default',
    offerBadgeText: item?.offerBadgeText ?? '',
    offerBadgeTone: item?.offerBadgeTone ?? '#FF500D',
    partnerLogoUrl: item?.partnerLogoUrl ?? '',
    partnerLogoPosition: item?.partnerLogoPosition ?? 'top-left',
    overlayImageUrl: item?.overlayImageUrl ?? '',
    overlayPosition: item?.overlayPosition ?? 'center',
    textPlacement: item?.textPlacement ?? 'bottom',
    imageFit: item?.imageFit ?? 'cover',
  };
}

function bannerActionTypeLabel(actionType: MarketingBannerActionType) {
  if (actionType === 'main_category') return 'فئة رئيسية';
  if (actionType === 'sub_category') return 'فئة فرعية';
  if (actionType === 'store') return 'متجر';
  if (actionType === 'store_category') return 'قسم داخل متجر';
  if (actionType === 'product') return 'منتج محدد';
  if (actionType === 'external') return 'وجهة عامة';
  return 'اشتراك';
}

export function BannersCommandDeckScreen(_props: BannersCommandDeckScreenProps) {
  const { direction } = useDirection();
  const isRtl = direction === 'rtl';
  const [items, setItems] = React.useState<MarketingBannerRecord[]>(() => getMarketingBannerItems());
  const [selectedId, setSelectedId] = React.useState<string | null>(() => getMarketingBannerItems()[0]?.id ?? null);
  const selected = React.useMemo(
    () => items.find((item) => item.id === selectedId) ?? items[0] ?? null,
    [items, selectedId],
  );
  const [draft, setDraft] = React.useState<BannerDraft>(() => createDraft(selected));

  React.useEffect(() => {
    if (selected) {
      setDraft(createDraft(selected));
    }
  }, [selected]);

  const kpis = React.useMemo(() => getMarketingBannerKpis(), [items]);
  const quality = React.useMemo(
    () => computeMarketingBannerQuality({ ...draft, position: Number.parseInt(draft.position, 10) || 0 }),
    [draft],
  );

  function refresh() {
    const nextItems = getMarketingBannerItems();
    setItems(nextItems);
  }

  function handleCreateNew() {
    setSelectedId(null);
    setDraft(createDraft(null));
  }

  function handleSave() {
    const saved = upsertMarketingBannerItem({
      ...draft,
      position: Number.parseInt(draft.position, 10) || undefined,
    });
    refresh();
    setSelectedId(saved.id);
  }

  function handleToggle(item: MarketingBannerRecord) {
    toggleMarketingBannerStatus(item.id);
    refresh();
  }

  function handleDuplicate(item: MarketingBannerRecord) {
    const duplicated = duplicateMarketingBannerItem(item.id);
    refresh();
    if (duplicated) {
      setSelectedId(duplicated.id);
    }
  }

  function handleDelete(item: MarketingBannerRecord) {
    if (!confirm('هل أنت متأكد من حذف هذا البنر؟')) return;
    removeMarketingBannerItem(item.id);
    refresh();
    const nextItems = getMarketingBannerItems();
    setSelectedId(nextItems[0]?.id ?? null);
  }

  const BannerPreview = () => (
    <View style={styles.previewContainer}>
      <View style={StyleSheet.flatten([styles.bannerBase, { backgroundColor: draft.accentColor || '#0A2F5C' }])}>
        {draft.imageUrl ? (
          <Image
            source={{ uri: draft.imageUrl }}
            style={StyleSheet.flatten([styles.bannerImage, { resizeMode: draft.imageFit }])}
          />
        ) : null}
        <View style={styles.bannerOverlay} />

        {/* Content Layout based on textPlacement */}
        <View style={StyleSheet.flatten([styles.bannerContent, draft.textPlacement === 'top' && { justifyContent: 'flex-start' }, draft.textPlacement === 'center' && { justifyContent: 'center' }])}>
          <Box gap={1}>
            {draft.partnerName ? <Text style={styles.bannerPartner}>{draft.partnerName}</Text> : null}
            <Text style={styles.bannerTitle} numberOfLines={1}>{draft.title || 'عنوان البنر'}</Text>
            <Text style={styles.bannerSubtitle} numberOfLines={2}>{draft.subtitle || 'أضف وصفاً جذاباً هنا'}</Text>
          </Box>

          <View style={StyleSheet.flatten([styles.bannerCta, { backgroundColor: '#fff' }])}>
            <Text style={StyleSheet.flatten([styles.bannerCtaText, { color: draft.accentColor || '#0A2F5C' }])}>{draft.ctaLabel}</Text>
          </View>
        </View>

        {/* Badge */}
        {draft.offerBadgeText ? (
          <View style={StyleSheet.flatten([styles.bannerBadge, { backgroundColor: draft.offerBadgeTone || '#FF500D' }])}>
            <Text style={styles.bannerBadgeText}>{draft.offerBadgeText}</Text>
          </View>
        ) : null}

        {/* Logo */}
        {draft.partnerLogoUrl ? (
          <View style={StyleSheet.flatten([styles.partnerLogoWrap,
            draft.partnerLogoPosition === 'top-left' && { top: 12, left: 12 },
            draft.partnerLogoPosition === 'top-right' && { top: 12, right: 12 },
            draft.partnerLogoPosition === 'bottom-left' && { bottom: 12, left: 12 },
            draft.partnerLogoPosition === 'bottom-right' && { bottom: 12, right: 12 },
          ])}>
            <Image source={{ uri: draft.partnerLogoUrl }} style={styles.partnerLogo} resizeMode="contain" />
          </View>
        ) : null}
      </View>
      <Text role="caption" tone="muted" style={{ marginTop: 8, textAlign: 'center' }}>معاينة مباشرة (مقاس 180px)</Text>
    </View>
  );

  const EditorSection = () => (
    <Surface tone="raised" gap={4} style={{ borderRadius: 24, padding: 20 }}>
      <Box gap={4}>
        <View style={styles.editorGrid}>
          <Box gap={4} style={{ flex: 1 }}>
            <Text role="titleSm" style={{ fontWeight: '900' }}>محتوى البنر</Text>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <TextField label="العنوان" value={draft.title} onChangeText={(v) => setDraft(c => ({ ...c, title: v }))} />
              <TextField label="اسم الشريك" value={draft.partnerName} onChangeText={(v) => setDraft(c => ({ ...c, partnerName: v }))} />
            </div>
            <TextField label="الوصف" value={draft.subtitle} onChangeText={(v) => setDraft(c => ({ ...c, subtitle: v }))} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <TextField label="نص الزر" value={draft.ctaLabel} onChangeText={(v) => setDraft(c => ({ ...c, ctaLabel: v }))} />
              <TextField label="لون الهوية" value={draft.accentColor} onChangeText={(v) => setDraft(c => ({ ...c, accentColor: v }))} />
              <TextField label="الترتيب" value={draft.position} onChangeText={(v) => setDraft(c => ({ ...c, position: v }))} />
            </div>
          </Box>

          <Box gap={4} style={{ width: 340 }}>
            <Text role="titleSm" style={{ fontWeight: '900' }}>المعاينة الذكية</Text>
            <BannerPreview />
            <Box gap={2} style={{ padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12 }}>
              <Text role="caption" style={{ fontWeight: '800' }}>مؤشر الجودة: {quality}%</Text>
              <View style={styles.qualityTrack}><View style={StyleSheet.flatten([styles.qualityFill, { width: `${quality}%`, backgroundColor: quality > 70 ? '#16A34A' : '#F97316' }])} /></View>
            </Box>
          </Box>
        </View>

        <View style={styles.divider} />

        <Box gap={3}>
          <Text role="titleSm" style={{ fontWeight: '900' }}>الوسائط والقالب</Text>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <TextField label="رابط صورة الخلفية" value={draft.imageUrl} onChangeText={(v) => setDraft(c => ({ ...c, imageUrl: v }))} />
            <Box gap={1}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>نمط الصورة</label>
              <Tabs<any> items={[{ value: 'cover', label: 'تغطية' }, { value: 'contain', label: 'احتواء' }]} value={draft.imageFit} onValueChange={(v) => setDraft(c => ({ ...c, imageFit: v }))} variant="pill" />
            </Box>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <TextField label="نص الشارة (خصم/عرض)" value={draft.offerBadgeText} onChangeText={(v) => setDraft(c => ({ ...c, offerBadgeText: v }))} />
            <TextField label="لون الشارة" value={draft.offerBadgeTone} onChangeText={(v) => setDraft(c => ({ ...c, offerBadgeTone: v }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <TextField label="رابط الشعار" value={draft.partnerLogoUrl} onChangeText={(v) => setDraft(c => ({ ...c, partnerLogoUrl: v }))} />
            <Box gap={1}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>موقع الشعار</label>
              <Tabs<any>
                items={[
                  { value: 'top-left', label: 'أعلى يسار' },
                  { value: 'top-right', label: 'أعلى يمين' },
                  { value: 'bottom-left', label: 'أسفل يسار' },
                  { value: 'bottom-right', label: 'أسفل يمين' },
                ]}
                value={draft.partnerLogoPosition}
                onValueChange={(v) => setDraft(c => ({ ...c, partnerLogoPosition: v }))}
                variant="pill"
              />
            </Box>
          </div>
        </Box>

        <View style={styles.divider} />

        <Box gap={3}>
          <Text role="titleSm" style={{ fontWeight: '900' }}>الجمهور والوجهة</Text>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Box gap={1}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>الاستهداف</label>
              <Tabs<MarketingBannerAudience>
                items={[{ value: 'all', label: 'الجميع' }, { value: 'home', label: 'الرئيسية' }, { value: 'stores', label: 'المتاجر' }]}
                value={draft.audience}
                onValueChange={(v) => setDraft(c => ({ ...c, audience: v }))}
                variant="pill"
              />
            </Box>
            <Box gap={1}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>نوع الإجراء</label>
              <Tabs<MarketingBannerActionType>
                items={[
                  { value: 'store', label: 'متجر' },
                  { value: 'product', label: 'منتج' },
                  { value: 'main_category', label: 'فئة' },
                  { value: 'subscription', label: 'اشتراك' },
                ]}
                value={draft.actionType}
                onValueChange={(v) => setDraft(c => ({ ...c, actionType: v }))}
                variant="pill"
              />
            </Box>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <TextField label="معرّف الوجهة الرئيسية" value={draft.actionTarget} onChangeText={(v) => setDraft(c => ({ ...c, actionTarget: v }))} />
            <TextField label="معرّف إضافي" value={draft.actionExtra} onChangeText={(v) => setDraft(c => ({ ...c, actionExtra: v }))} />
          </div>
        </Box>

        <View style={styles.divider} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box gap={1}>
            <Text role="bodySm" style={{ fontWeight: '800' }}>حالة البنر</Text>
            <Tabs<MarketingBannerStatus>
              items={[{ value: 'draft', label: 'مسودة' }, { value: 'published', label: 'منشور' }]}
              value={draft.status}
              onValueChange={(v) => setDraft(c => ({ ...c, status: v }))}
              variant="pill"
            />
          </Box>
          <div style={{ display: 'flex', gap: 12 }}>
             <Button label="حذف" tone="ghost" fullWidth={false} onPress={() => handleDelete(selected!)} style={{ color: '#DC2626' }} />
             <Button label="تكرار" tone="secondary" fullWidth={false} onPress={() => handleDuplicate(selected!)} />
             <Button label="حفظ التغييرات" fullWidth={false} onPress={handleSave} style={{ backgroundColor: '#0A2F5C' }} />
          </div>
        </div>
      </Box>
    </Surface>
  );

  return (
    <Box gap={4}>
      <Surface tone="raised" gap={4} style={{ borderRadius: 24, padding: 20 }}>
        <View style={StyleSheet.flatten([styles.headerRow, isRtl && styles.rowReverse])}>
          <Box gap={0}>
            <Text role="caption" style={{ color: '#FF500D', fontWeight: '800' }}>نظام إدارة المحتوى الإعلاني</Text>
            <Text role="titleLg" style={{ fontWeight: '900', color: '#0A2F5C' }}>استوديو البنرات</Text>
          </Box>
          <Button label="إضافة بنر جديد" tone="primary" fullWidth={false} onPress={handleCreateNew} style={{ backgroundColor: '#0A2F5C' }} />
        </View>

        <View style={styles.kpiGrid}>
          {[
            { label: 'الإجمالي', value: kpis.total, color: '#1E40AF', bg: '#EFF6FF' },
            { label: 'المنشور', value: kpis.live, color: '#166534', bg: '#F0FDF4' },
            { label: 'المشاهدات', value: kpis.impressions, color: '#5B21B6', bg: '#F5F3FF' },
            { label: 'النقرات', value: kpis.clicks, color: '#991B1B', bg: '#FEF2F2' },
          ].map(k => (
            <View key={k.label} style={StyleSheet.flatten([styles.kpiCard, { backgroundColor: k.bg }])}>
              <Text role="caption" style={{ fontWeight: '700' }}>{k.label}</Text>
              <Text role="titleLg" style={{ color: k.color, fontWeight: '900' }}>{k.value}</Text>
            </View>
          ))}
        </View>
      </Surface>

      <View style={styles.studioBody}>
        <View style={styles.sidebar}>
          <Surface tone="raised" gap={3} style={{ borderRadius: 20, padding: 12 }}>
            <Text role="titleSm" style={{ fontWeight: '800', marginBottom: 8 }}>قائمة البنرات</Text>
            <Box gap={2}>
              {items.map(item => (
                <Pressable
                  key={item.id}
                  onPress={() => setSelectedId(item.id)}
                  style={StyleSheet.flatten([styles.listCard, selectedId === item.id && styles.listCardSelected])}
                >
                  <Text role="bodySm" style={{ fontWeight: '800' }} numberOfLines={1}>{item.title}</Text>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <Text role="caption" tone="muted">{bannerActionTypeLabel(item.actionType)}</Text>
                    <Text role="caption" style={{ color: item.status === 'published' ? '#16A34A' : '#64748B', fontWeight: '800' }}>
                      {item.status === 'published' ? 'منشور' : 'مسودة'}
                    </Text>
                  </div>
                </Pressable>
              ))}
            </Box>
          </Surface>
        </View>

        <View style={styles.mainEditor}>
          <EditorSection />
        </View>
      </View>
    </Box>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  studioBody: {
    flexDirection: 'row',
    gap: 16,
  },
  sidebar: {
    width: 260,
  },
  mainEditor: {
    flex: 1,
  },
  listCard: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  listCardSelected: {
    borderColor: '#FF500D',
    backgroundColor: '#FFF7ED',
  },
  editorGrid: {
    flexDirection: 'row',
    gap: 24,
  },
  previewContainer: {
    width: 320,
    alignSelf: 'center',
  },
  bannerBase: {
    width: 320,
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  bannerContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  bannerPartner: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    opacity: 0.9,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  bannerSubtitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.9,
  },
  bannerCta: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  bannerCtaText: {
    fontSize: 10,
    fontWeight: '900',
  },
  bannerBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bannerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  partnerLogoWrap: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerLogo: {
    width: '100%',
    height: '100%',
  },
  qualityTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
  },
  qualityFill: {
    height: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
});

export default BannersCommandDeckScreen;
