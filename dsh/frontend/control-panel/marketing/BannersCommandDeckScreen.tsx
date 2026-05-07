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

  const templates = [
    { id: 'restaurant', label: 'مطعم', accent: '#E11D48', badge: 'خصم 20%', cta: 'اطلب الآن', icon: '🍔' },
    { id: 'fashion', label: 'متجر أزياء', accent: '#2563EB', badge: 'وصل حديثاً', cta: 'تسوق الآن', icon: '👗' },
    { id: 'tech', label: 'إلكترونيات', accent: '#0F172A', badge: 'الأكثر مبيعاً', cta: 'اشترِ الآن', icon: '📱' },
    { id: 'pro', label: 'اشتراك برو', accent: '#7C3AED', badge: 'شهر مجاني', cta: 'اشترك الآن', icon: '💎' },
  ];

  const applyTemplate = (tpl: typeof templates[0]) => {
    setDraft(c => ({
      ...c,
      templateId: tpl.id,
      accentColor: tpl.accent,
      offerBadgeText: tpl.badge,
      ctaLabel: tpl.cta,
      title: `عرض ${tpl.label}`,
      subtitle: `استمتع بأفضل تجربة مع ${tpl.label} بأسعار حصرية.`,
    }));
  };

  const BannerPreview = () => (
    <View style={styles.previewContainer}>
      <View style={StyleSheet.flatten([styles.bannerBase, { backgroundColor: draft.accentColor || '#0A2F5C' }])}>
        {draft.imageUrl ? (
          <Image
            source={{ uri: draft.imageUrl }}
            style={StyleSheet.flatten([styles.bannerImage, { resizeMode: draft.imageFit }])}
          />
        ) : (
          <View style={[styles.bannerImage, { backgroundColor: draft.accentColor || '#0A2F5C', justifyContent: 'center', alignItems: 'center' }]}>
             <Text style={{ fontSize: 40 }}>{templates.find(t => t.id === draft.templateId)?.icon || '✨'}</Text>
          </View>
        )}
        <View style={[styles.bannerOverlay, { backgroundColor: `${draft.accentColor}44` }]} />

        {/* Content Layout */}
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
          <View style={StyleSheet.flatten([styles.bannerBadge, { backgroundColor: draft.offerBadgeTone || '#FF500D' }, draft.partnerLogoPosition.includes('left') ? { right: 12 } : { left: 12 }])}>
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
      <Text role="caption" tone="muted" style={{ marginTop: 12, textAlign: 'center', fontWeight: '800' }}>معاينة حية (نسبة 4:5)</Text>
    </View>
  );

  const EditorSection = () => (
    <Surface tone="raised" gap={4} style={{ borderRadius: 28, padding: 24, borderLeftWidth: 8, borderLeftColor: draft.accentColor }}>
      <Box gap={6}>
        <View style={styles.editorGrid}>
          <Box gap={5} style={{ flex: 1 }}>
            <Box gap={2}>
               <Text role="titleSm" style={{ fontWeight: '900', color: '#0A2F5C' }}>1. القالب الذكي</Text>
               <View style={styles.templateRow}>
                  {templates.map(tpl => (
                    <Pressable
                      key={tpl.id}
                      onPress={() => applyTemplate(tpl)}
                      style={[styles.templateBtn, draft.templateId === tpl.id && { borderColor: tpl.accent, backgroundColor: `${tpl.accent}11` }]}
                    >
                      <Text style={{ fontSize: 20 }}>{tpl.icon}</Text>
                      <Text style={[styles.templateBtnText, draft.templateId === tpl.id && { color: tpl.accent }]}>{tpl.label}</Text>
                    </Pressable>
                  ))}
               </View>
            </Box>

            <Box gap={4}>
               <Text role="titleSm" style={{ fontWeight: '900', color: '#0A2F5C' }}>2. المحتوى والنصوص</Text>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                 <TextField label="العنوان الرئيسي" value={draft.title} onChangeText={(v) => setDraft(c => ({ ...c, title: v }))} />
                 <TextField label="اسم العلامة التجارية" value={draft.partnerName} onChangeText={(v) => setDraft(c => ({ ...c, partnerName: v }))} />
               </div>
               <TextField label="الوصف الترويجي" value={draft.subtitle} onChangeText={(v) => setDraft(c => ({ ...c, subtitle: v }))} multiline numberOfLines={2} />
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                 <TextField label="نص زر الإجراء" value={draft.ctaLabel} onChangeText={(v) => setDraft(c => ({ ...c, ctaLabel: v }))} />
                 <TextField label="لون الهوية (HEX)" value={draft.accentColor} onChangeText={(v) => setDraft(c => ({ ...c, accentColor: v }))} />
                 <TextField label="ترتيب الظهور" value={draft.position} onChangeText={(v) => setDraft(c => ({ ...c, position: v }))} />
               </div>
            </Box>
          </Box>

          <Box gap={4} style={{ width: 340 }}>
            <Text role="titleSm" style={{ fontWeight: '900', color: '#0A2F5C' }}>معاينة التصميم</Text>
            <BannerPreview />
            <Box gap={2} style={{ padding: 16, backgroundColor: '#F1F5F9', borderRadius: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text role="caption" style={{ fontWeight: '900' }}>مؤشر جودة المحتوى</Text>
                <Text role="caption" style={{ fontWeight: '900', color: quality > 70 ? '#16A34A' : '#F97316' }}>{quality}%</Text>
              </View>
              <View style={styles.qualityTrack}><View style={StyleSheet.flatten([styles.qualityFill, { width: `${quality}%`, backgroundColor: quality > 70 ? '#16A34A' : '#F97316' }])} /></View>
              <Text role="caption" tone="muted" style={{ fontSize: 10 }}>يتم احتساب الجودة بناءً على طول النصوص، وجود الوسائط، ووضوح الإجراء.</Text>
            </Box>
          </Box>
        </View>

        <View style={styles.divider} />

        <Box gap={4}>
          <Text role="titleSm" style={{ fontWeight: '900', color: '#0A2F5C' }}>3. الوسائط المتقدمة</Text>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <TextField label="رابط صورة الخلفية (أو اترك فارغاً للقالب)" value={draft.imageUrl} onChangeText={(v) => setDraft(c => ({ ...c, imageUrl: v }))} />
            <Box gap={1}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>احتواء الصورة</label>
              <Tabs<any> items={[{ value: 'cover', label: 'كامل' }, { value: 'contain', label: 'مناسب' }]} value={draft.imageFit} onValueChange={(v) => setDraft(c => ({ ...c, imageFit: v }))} variant="pill" />
            </Box>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <TextField label="رابط شعار الشريك" value={draft.partnerLogoUrl} onChangeText={(v) => setDraft(c => ({ ...c, partnerLogoUrl: v }))} />
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <TextField label="نص الشارة العلوية" value={draft.offerBadgeText} onChangeText={(v) => setDraft(c => ({ ...c, offerBadgeText: v }))} />
            <TextField label="لون الشارة" value={draft.offerBadgeTone} onChangeText={(v) => setDraft(c => ({ ...c, offerBadgeTone: v }))} />
          </div>
        </Box>

        <View style={styles.divider} />

        <Box gap={4}>
          <Text role="titleSm" style={{ fontWeight: '900', color: '#0A2F5C' }}>4. توجيه الجمهور</Text>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Box gap={1}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>نطاق العرض</label>
              <Tabs<MarketingBannerAudience>
                items={[{ value: 'all', label: 'الجميع' }, { value: 'home', label: 'الرئيسية' }, { value: 'stores', label: 'المتاجر' }]}
                value={draft.audience}
                onValueChange={(v) => setDraft(c => ({ ...c, audience: v }))}
                variant="pill"
              />
            </Box>
            <Box gap={1}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>نوع الوجهة</label>
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
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <TextField label="معرّف الهدف (ID)" value={draft.actionTarget} onChangeText={(v) => setDraft(c => ({ ...c, actionTarget: v }))} />
            <TextField label="بيانات إضافية" value={draft.actionExtra} onChangeText={(v) => setDraft(c => ({ ...c, actionExtra: v }))} />
          </div>
        </Box>

        <View style={styles.divider} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 20 }}>
          <Box gap={1}>
            <Text role="bodySm" style={{ fontWeight: '900' }}>حالة النشر الحالية</Text>
            <Tabs<MarketingBannerStatus>
              items={[{ value: 'draft', label: 'مسودة (داخلي)' }, { value: 'published', label: 'منشور (عام)' }]}
              value={draft.status}
              onValueChange={(v) => setDraft(c => ({ ...c, status: v }))}
              variant="pill"
            />
          </Box>
          <div style={{ display: 'flex', gap: 12 }}>
             <Button label="حذف البنر" tone="ghost" fullWidth={false} onPress={() => handleDelete(selected!)} style={{ color: '#DC2626' }} />
             <Button label="تكرار" tone="secondary" fullWidth={false} onPress={() => handleDuplicate(selected!)} />
             <Button label="حفظ البنر" fullWidth={false} onPress={handleSave} style={{ backgroundColor: '#0A2F5C', paddingHorizontal: 32 }} />
          </div>
        </div>
      </Box>
    </Surface>
  );

  return (
    <Box gap={6}>
      <Surface tone="raised" gap={4} style={{ borderRadius: 28, padding: 24, backgroundColor: '#fff', elevation: 2 }}>
        <View style={StyleSheet.flatten([styles.headerRow, isRtl && styles.rowReverse])}>
          <Box gap={0}>
            <Text role="caption" style={{ color: colorPalette.brand, fontWeight: '900', letterSpacing: 1 }}>MARKETING OPS CONTROL</Text>
            <Text role="titleLg" style={{ fontWeight: '900', color: '#0A2F5C', fontSize: 32 }}>استوديو البنرات <Text style={{ color: colorPalette.brand }}>2027</Text></Text>
          </Box>
          <Button label="بنر جديد +" tone="primary" fullWidth={false} onPress={handleCreateNew} style={{ backgroundColor: colorPalette.brandStrong, borderRadius: 16, height: 48 }} />
        </View>

        <View style={styles.kpiGrid}>
          {[
            { label: 'إجمالي البنرات', value: kpis.total, color: '#1E40AF', bg: '#EFF6FF', icon: '📁' },
            { label: 'البنرات النشطة', value: kpis.live, color: '#166534', bg: '#F0FDF4', icon: '📡' },
            { label: 'مشاهدات اليوم', value: kpis.impressions, color: '#5B21B6', bg: '#F5F3FF', icon: '👁️' },
            { label: 'نسبة التفاعل', value: `${((kpis.clicks / (kpis.impressions || 1)) * 100).toFixed(1)}%`, color: '#991B1B', bg: '#FEF2F2', icon: '📈' },
          ].map(k => (
            <View key={k.label} style={StyleSheet.flatten([styles.kpiCard, { backgroundColor: k.bg }])}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text role="caption" style={{ fontWeight: '800', color: '#64748B' }}>{k.label}</Text>
                <Text>{k.icon}</Text>
              </View>
              <Text role="titleLg" style={{ color: k.color, fontWeight: '900', marginTop: 8 }}>{k.value}</Text>
            </View>
          ))}
        </View>
      </Surface>

      <View style={styles.studioBody}>
        <View style={styles.sidebar}>
          <Surface tone="raised" gap={4} style={{ borderRadius: 28, padding: 16, backgroundColor: '#fff' }}>
            <Text role="titleSm" style={{ fontWeight: '900', color: '#0A2F5C', paddingHorizontal: 8 }}>جميع الحملات</Text>
            <Box gap={3}>
              {items.map(item => (
                <Pressable
                  key={item.id}
                  onPress={() => setSelectedId(item.id)}
                  style={StyleSheet.flatten([styles.listCard, selectedId === item.id && styles.listCardSelected])}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={[styles.statusDot, { backgroundColor: item.status === 'published' ? '#16A34A' : '#94A3B8' }]} />
                    <Box gap={0} style={{ flex: 1 }}>
                      <Text role="bodySm" style={{ fontWeight: '900', color: selectedId === item.id ? colorPalette.brandStrong : '#1E293B' }} numberOfLines={1}>{item.title}</Text>
                      <Text role="caption" tone="muted">{bannerActionTypeLabel(item.actionType)}</Text>
                    </Box>
                  </View>
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
    gap: 16,
    marginTop: 8,
  },
  kpiCard: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  studioBody: {
    flexDirection: 'row',
    gap: 20,
  },
  sidebar: {
    width: 300,
  },
  mainEditor: {
    flex: 1,
  },
  listCard: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  listCardSelected: {
    borderColor: colorPalette.brand,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: colorPalette.brand,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  editorGrid: {
    flexDirection: 'row',
    gap: 32,
  },
  templateRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  templateBtn: {
    flex: 1,
    minWidth: 100,
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
  },
  templateBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748B',
  },
  previewContainer: {
    width: 280,
    alignSelf: 'center',
  },
  bannerBase: {
    width: 280,
    height: 350,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  bannerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-end',
  },
  bannerPartner: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  bannerCta: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    elevation: 4,
  },
  bannerCtaText: {
    fontSize: 11,
    fontWeight: '900',
  },
  bannerBadge: {
    position: 'absolute',
    top: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    elevation: 5,
  },
  bannerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  partnerLogoWrap: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    padding: 6,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  partnerLogo: {
    width: '100%',
    height: '100%',
  },
  qualityTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  qualityFill: {
    height: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
});

export default BannersCommandDeckScreen;
