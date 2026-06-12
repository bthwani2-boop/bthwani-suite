import React from 'react';
import { View } from 'react-native';
import { Box, Button, SelectField, Surface, Tabs, Text, TextField } from '@bthwani/ui-kit';
import type { VideoDraft, EditorWorkspaceTab } from './video-types';
import { TARGET_TYPE_OPTIONS } from './video-types';
const dshCategoryFixtures: { id: (string); label: (string); subcategories: { id: (string); label: (string) }[] }[] = [];
const dshDiscoveryStores: { id: (string); name: (string) }[] = [];
const storeItemsByStoreId: Record<string, { id: (string); name: (string) }[]> = {};
type MarketingVideoStatus = 'published' | 'draft' | 'review' | 'paused';
type MarketingVideoAudience = 'all' | 'client' | 'operations';
type MarketingVideoSource = 'marketing' | 'partner';
type MarketingVideoTargetType = 'home' | 'stores' | 'store' | 'category' | 'subcategory' | 'product' | 'offer' | 'campaign' | 'search' | 'custom' | 'loyalty';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MarketingVideoRecord = Record<string, any>;
function upsertMarketingVideoItem(_item: unknown): void {}
import type { MarketingPermission } from './marketing-permissions.contract';

interface VideoEditorSectionProps {
  draft: VideoDraft;
  setDraft: React.Dispatch<React.SetStateAction<VideoDraft>>;
  activeEditorTab: EditorWorkspaceTab;
  setActiveEditorTab: (tab: EditorWorkspaceTab) => void;
  selected: MarketingVideoRecord | null;
  handleToggle: (item: MarketingVideoRecord) => void;
  handleDuplicate: (item: MarketingVideoRecord) => void;
  handleDelete: (item: MarketingVideoRecord) => void;
  deleteConfirmId: string | null;
  setDeleteConfirmId: (id: string | null) => void;
  handleSave: () => void;
  hasPermission: (perm: MarketingPermission) => boolean;
  hubHref?: string;
  operationsHref?: string;
  saveError: string | null;
  theme: any;
  styles: any;
  rtlText: any;
  refresh: () => void;
}

export function VideoEditorSection({
  draft,
  setDraft,
  activeEditorTab,
  setActiveEditorTab,
  selected,
  handleToggle,
  handleDuplicate,
  handleDelete,
  deleteConfirmId,
  setDeleteConfirmId,
  handleSave,
  hasPermission,
  hubHref,
  operationsHref,
  saveError,
  theme,
  styles,
  rtlText,
  refresh,
}: VideoEditorSectionProps) {
  const getProductsForStore = (storeId: string) => storeItemsByStoreId[storeId] ?? [];

  return (
    <Surface tone="raised" style={styles.editorPanel}>
      <View style={[styles.panelHeader]}>
        <Text role="titleSm" weight="black" style={[{ }, rtlText]}>محرر الفيديو الذكي</Text>
        <View style={[styles.headerRow, { gap: 8, flexWrap: 'wrap' }]}>
          {selected ? (
            <Button
              label={selected.status === 'published' ? 'إيقاف' : 'نشر'}
              tone="secondary"
              size="sm"
              onPress={() => handleToggle(selected)}
              disabled={!hasPermission('marketing.publish')}
            />
          ) : null}
          <Button
            label="نسخة"
            tone="ghost"
            size="sm"
            onPress={() => selected && handleDuplicate(selected)}
            disabled={!selected || !hasPermission('marketing.edit')}
          />
          {selected && deleteConfirmId === selected.id ? (
            <>
              <Button label="تأكيد الحذف" tone="danger" size="sm" onPress={() => handleDelete(selected)} />
              <Button label="إلغاء" tone="ghost" size="sm" onPress={() => setDeleteConfirmId(null)} />
            </>
          ) : (
            <Button
              label="حذف"
              tone="ghost"
              size="sm"
              onPress={() => selected && setDeleteConfirmId(selected.id)}
              disabled={!selected || !hasPermission('marketing.delete')}
            />
          )}
          <Button
            label="حفظ"
            tone="primary"
            size="sm"
            onPress={handleSave}
            disabled={!draft.title?.trim() || !draft.videoUrl?.trim()}
          />
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
            <TextField
              label="العنوان التسويقي"
              value={draft.title}
              onChangeText={(v) => setDraft(d => ({ ...d, title: v }))}
              placeholder="مثال: خصومات الجمعة البيضاء"
              style={rtlText}
            />
            <TextField
              label="وصف موجز"
              value={draft.subtitle}
              onChangeText={(v) => setDraft(d => ({ ...d, subtitle: v }))}
              placeholder="وصف يظهر أسفل العنوان في المعاينة"
              style={rtlText}
            />
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
                <TextField
                  label="رابط الفيديو"
                  value={draft.videoUrl}
                  onChangeText={(v) => setDraft(d => ({ ...d, videoUrl: v }))}
                  placeholder="video-url..."
                  style={{ textAlign: 'left', writingDirection: 'ltr' }}
                />
              </View>
              <View style={{ flex: 1, direction: 'ltr' }}>
                <TextField
                  label="رابط الغلاف"
                  value={draft.posterUrl}
                  onChangeText={(v) => setDraft(d => ({ ...d, posterUrl: v }))}
                  placeholder="poster-url..."
                  style={{ textAlign: 'left', writingDirection: 'ltr' }}
                />
              </View>
            </View>
            <View style={[styles.headerRow, { gap: 12 }]}>
              <View style={{ flex: 1 }}>
                <TextField label="المدة (ثانية)" value={draft.durationSeconds} onChangeText={(v) => setDraft(d => ({ ...d, durationSeconds: v }))} style={rtlText} />
              </View>
              <View style={{ flex: 1 }} />
            </View>
            <Box gap={2}>
              <Text role="caption" weight="black" style={[{ color: theme.textMuted }, rtlText]}>سلوك التشغيل</Text>
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
              <Text role="caption" weight="black" style={[{ color: theme.textMuted }, rtlText]}>حالة المراجعة</Text>
              {draft.reviewState === 'none' && (
                <Button
                  label="إرسال للمراجعة"
                  tone="secondary"
                  size="sm"
                  fullWidth={false}
                  onPress={() => {
                    const updated = {
                      ...draft,
                      reviewState: 'pending' as const,
                      durationSeconds: Number(draft.durationSeconds) || 0,
                      order: Number(draft.order) || 0,
                    };
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
                      const updated = {
                        ...draft,
                        reviewState: 'approved' as const,
                        durationSeconds: Number(draft.durationSeconds) || 0,
                        order: Number(draft.order) || 0,
                      };
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
                      const updated = {
                        ...draft,
                        reviewState: 'rejected' as const,
                        durationSeconds: Number(draft.durationSeconds) || 0,
                        order: Number(draft.order) || 0,
                      };
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
                      const updated = {
                        ...draft,
                        reviewState: 'none' as const,
                        durationSeconds: Number(draft.durationSeconds) || 0,
                        order: Number(draft.order) || 0,
                      };
                      setDraft(d => ({ ...d, reviewState: 'none' }));
                      upsertMarketingVideoItem(updated);
                      refresh();
                    }}
                  />
                </View>
              )}
              {draft.reviewState === 'approved' && (
                <View style={[styles.statusBadge, { backgroundColor: theme.successSurface, alignSelf: 'flex-start' }]}>
                  <Text role="caption" weight="black" style={[{ color: theme.success }, rtlText]}>معتمد</Text>
                </View>
              )}
              {draft.reviewState === 'rejected' && (
                <View style={[styles.statusBadge, { backgroundColor: theme.dangerSurface ?? theme.surfaceInset, alignSelf: 'flex-start' }]}>
                  <Text role="caption" weight="black" style={[{ color: theme.danger }, rtlText]}>مرفوض</Text>
                </View>
              )}
            </Surface>
          </Box>
        )}
      </Box>
    </Surface>
  );
}
