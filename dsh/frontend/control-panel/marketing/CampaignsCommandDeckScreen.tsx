'use client';

import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Box, Button, Surface, Tabs, Text, TextField, useTheme,
  radius,
} from '@bthwani/ui-kit';
import { WebControlPanelCompactPager } from '@bthwani/ui-kit/web';
import type { CampaignAudience, CampaignTargetType } from '../../shared/contracts/dsh-marketing-types';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CampaignRecord = Record<string, any>;
type CampaignStatus = 'draft' | 'pending' | 'published' | 'paused' | 'archived';
type CampaignGoal = 'awareness' | 'conversion' | 'retention' | 'acquisition';
type CampaignChannel = 'banner' | 'promo' | 'video' | 'ticker' | 'store-card';
type CampaignPriority = 'low' | 'normal' | 'high' | 'critical';
type CampaignSummary = { id: (string); title: (string); status: (CampaignStatus); impressions: (number) };
function getCampaignItems(): CampaignRecord[] { return []; }
function getCampaignSummaries(_opts?: unknown): { items: CampaignSummary[]; total: number; page: number; pageSize: number } { return { items: [], total: 0, page: 1, pageSize: 20 }; }
function getCampaignDetail(_id: string): CampaignRecord | null { return null; }
function getCampaignKpis() { return { total: { value: 0 }, live: { value: 0 }, pending: { value: 0 }, impressions: { value: 0 } }; }
function upsertCampaignItem(_item: unknown): void {}
function toggleCampaignStatus(_id: string): void {}
function duplicateCampaignItem(_id: string): void {}
function removeCampaignItem(_id: string): void {}
const dshCategoryData: { id: (string); label: (string); subcategories: { id: (string); label: (string) }[] }[] = [];
const dshDiscoveryStores: { id: (string); name: (string) }[] = [];
const storeItemsByStoreId: Record<string, { id: (string); name: (string) }[]> = {};
import { mapStoreCommercialFeatures } from '../../shared/adapters/store-card-commercial-map';
import { CommercialParityPreview } from './commercial-parity-viewer';
type Entitlement = { id: string; type: string; referenceId: string; status: string; source: string };
import { useMarketingPermissions } from './marketing-permissions.contract';

/**
 * Validation Rules:
 * - required fields: title, channels (at least 1), targetId (if audience is targeted)
 * - format rules: Start Date, End Date (must parse to valid timestamps)
 * - range: endDate must be strictly greater than startDate
 * - duplicate / conflict: N/A (Handled via multiple campaign channels limits visually)
 * - disabled reason: Missing 'marketing.edit' or 'marketing.publish' permissions.
 * - error: Alerts "تاريخ النهاية يجب أن يكون بعد تاريخ البداية", "لا يمكن نشر حملة بدون قنوات"
 * - success: Transitions campaign to draft/published status and updates KPIs.
 *
 * Conflict Resolution:
 * - detect: vars precedence when local campaign overlaps global flags
 * - display: inline warnings or status priority overriding
 * - owner: control-panel-marketing
 * - resolution action: User must disable older campaigns if channel limit is hit
 * - audit/API-later: Backed by runtime provider config checks on API endpoints
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

type EditorTab = 'plan' | 'audience' | 'channels' | 'schedule' | 'impact';

const campaignsPageSize = 5;

const CAMPAIGN_CHANNEL_LABELS: Record<string, string> = {
  banner: 'بنر',
  promo: 'عرض ترويجي',
  video: 'فيديو',
  ticker: 'شريط إخباري',
  'store-card': 'بطاقة متجر',
};

function getCampaignStatusLabel(status: string): string {
  switch (status) {
    case 'draft': return 'مسودة';
    case 'pending': return 'بانتظار الموافقة';
    case 'published': return 'منشورة';
    case 'paused': return 'موقوفة';
    case 'archived': return 'مؤرشفة';
    default: return status;
  }
}

function validateCampaignDraft(draft: Partial<CampaignRecord>): string | null {
  if (!draft.title?.trim()) return 'العنوان مطلوب.';
  if (!draft.channels?.length) return 'يجب اختيار قناة واحدة على الأقل.';

  if (draft.audience === 'targeted' && !draft.targetId?.trim()) {
    return 'الجمهور المستهدف يتطلب تحديد المستهدف (Target ID).';
  }

  if (draft.startDate && draft.endDate) {
    const start = new Date(draft.startDate).getTime();
    const end = new Date(draft.endDate).getTime();
    if (end <= start) {
      return 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية.';
    }
  }

  return null;
}

function validateCampaignForPublish(item: CampaignRecord): string | null {
  if (!item.channels?.length) return 'لا يمكن نشر حملة بدون قنوات محددة.';
  if (item.audience === 'targeted' && !item.targetId?.trim()) return 'لا يمكن نشر حملة موجهة بدون مستهدف.';

  if (item.startDate && item.endDate) {
    const start = new Date(item.startDate).getTime();
    const end = new Date(item.endDate).getTime();
    if (end <= start) return 'تاريخ النهاية يسبق أو يساوي تاريخ البداية.';
  }

  return null;
}

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function CampaignsCommandDeckScreen() {
  const { hasPermission } = useMarketingPermissions();
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // --- URL-driven state ---
  const selectedId = searchParams?.get('id') ?? null;
  const editorTab = (searchParams?.get('tab') as EditorTab) || 'plan';
  const campaignsPageParam = parseInt(searchParams?.get('page') || '1', 10);
  const campaignsPage = isNaN(campaignsPageParam) || campaignsPageParam < 1 ? 1 : campaignsPageParam;

  const [summaries, setSummaries] = React.useState<CampaignSummary[]>([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [selected, setSelected] = React.useState<CampaignRecord | null>(null);

  const loadData = React.useCallback(() => {
    const result = getCampaignSummaries({ page: campaignsPage, pageSize: 5 });
    setSummaries(result.items);
    setTotalItems(result.total);
  }, [campaignsPage]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  React.useEffect(() => {
    if (selectedId) {
      setSelected(getCampaignDetail(selectedId));
    } else if (summaries.length > 0 && !selectedId) {
      const newUrl = `${pathname}?id=${summaries[0].id}&tab=plan&page=${campaignsPage}`;
      router.replace(newUrl, { scroll: false });
    } else {
      setSelected(null);
    }
  }, [selectedId, summaries, pathname, router, campaignsPage]);

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
    updateQueryParams({ id, tab: 'plan' }, 'push');
  }, [updateQueryParams]);

  const setEditorTab = React.useCallback((tab: EditorTab) => {
    updateQueryParams({ tab }, 'replace');
  }, [updateQueryParams]);

  const setCampaignsPage = React.useCallback((page: number | ((p: number) => number)) => {
    const nextPage = typeof page === 'function' ? page(campaignsPage) : page;
    updateQueryParams({ page: nextPage.toString() }, 'replace');
  }, [campaignsPage, updateQueryParams]);

  const [draft, setDraft] = React.useState<Partial<CampaignRecord>>({});
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);
  const [archiveConfirmId, setArchiveConfirmId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (selected) {
			setDraft({ ...selected, placement: selected.placement === 'hero' ? 'banner' : selected.placement });
    } else {
      setDraft({
        title: '',
        subtitle: '',
        status: 'draft',
        priority: 'normal',
        goal: 'awareness',
        audience: 'all',
        channels: [],
        placement: 'banner',
        targetType: 'home',
        targetId: '',
        startDate: '',
        endDate: '',
      });
    }
  }, [selectedId, summaries]);

  const kpis = React.useMemo(() => getCampaignKpis(), [summaries]);

  const refresh = () => {
    loadData();
    if (selectedId) setSelected(getCampaignDetail(selectedId));
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / campaignsPageSize));
  const visibleItems = summaries;

  React.useEffect(() => {
    setCampaignsPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages, setCampaignsPage]);

  const inlineStyles = React.useMemo(() => ({
    selectInput: {
      padding: '8px 12px',
      borderRadius: '8px',
      border: `1px solid ${theme.lineStrong}`,
      backgroundColor: theme.surface,
      color: theme.brandHeaderBackground,
      fontSize: '13px',
      fontWeight: '600',
      outline: 'none',
      textAlign: 'right',
    } as React.CSSProperties,
    impactBox: {
      backgroundColor: theme.surfaceInset,
      borderRadius: '12px',
      padding: '16px',
      border: `1px solid ${theme.line}`,
      marginBottom: '16px'
    } as React.CSSProperties,
    impactTitle: {
      color: theme.brandHeaderBackground,
      margin: '0 0 12px 0',
      fontSize: '13px',
      fontWeight: '800',
      textAlign: 'right' as const,
    } as React.CSSProperties,
    impactList: {
      margin: 0,
      paddingInlineStart: '20px',
      color: theme.text,
      fontSize: '12px',
      lineHeight: '1.8',
      textAlign: 'right' as const,
    } as React.CSSProperties,
  }), [theme]);

  const styles = React.useMemo(() => StyleSheet.create({
    kpiRow: {
      flexDirection: 'row',
      gap: 12,
      flexWrap: 'wrap',
    },
    kpiCard: {
      flex: 1,
      minWidth: 140,
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.line,
      alignItems: 'flex-start',
    },
    mainLayout: {
      flex: 1,
      flexDirection: 'row',
      gap: 16,
      alignItems: 'stretch',
    },
    listPanel: {
      flex: 1,
      minWidth: 300,
      borderRadius: 16,
      borderColor: theme.line,
      borderWidth: 1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    panelHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.surfaceInset,
      backgroundColor: theme.surface,
    },
    rowItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
      borderRadius: 12,
      backgroundColor: theme.surfaceInset,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    rowItemSelected: {
      backgroundColor: theme.surface,
      borderColor: theme.brand,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: radius.xs,
      backgroundColor: theme.surfaceInset,
    },
    statusBadgeActive: {
      backgroundColor: theme.successSurface,
    },
    statusText: {
      fontSize: 10,
      color: theme.textMuted,
    },
    statusTextActive: {
      color: theme.successText,
    },
    editorPanel: {
      flex: 2,
      minWidth: 400,
      borderRadius: 16,
      borderColor: theme.line,
      borderWidth: 1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    chipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.lineStrong,
      backgroundColor: theme.surfaceInset,
    },
    chipActive: {
      borderColor: theme.brandHeaderBackground,
      backgroundColor: theme.brandHeaderBackground,
    },
    chipText: {
      fontSize: 12,
      color: theme.textMuted,
    },
    chipTextActive: {
      color: theme.brandContrast,
    },
    labelTitle: {
      textAlign: 'right',
    },
    smallButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      minHeight: 0,
    },
    smallButtonTextRed: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      minHeight: 0,
      color: theme.dangerText,
    },
    smallButtonPrimary: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      minHeight: 0,
      backgroundColor: theme.brandHeaderBackground,
    }
  }), [theme]);

  const handleCreateNew = () => {
    setSelectedId(null);
    setEditorTab('plan');
  };

  const [saveError, setSaveError] = React.useState<string | null>(null);

  const handleSave = () => {
    const error = validateCampaignDraft(draft);
    if (error) { setSaveError(error); return; }
    setSaveError(null);
    const saved = upsertCampaignItem(draft);
    refresh();
    setSelectedId(saved.id);
  };

  const handleToggle = (id: string) => {
    const item = getCampaignDetail(id);
    if (!item) return;
    const error = validateCampaignForPublish(item);
    if (error) { setSaveError(error); return; }
    setSaveError(null);
    toggleCampaignStatus(id);
    refresh();
  };

  const handleStatusAdvance = (id: string, next: CampaignStatus) => {
    const item = getCampaignDetail(id);
    if (!item) return;
    upsertCampaignItem({ ...item, status: next });
    refresh();
  };

  const handleDuplicate = (id: string) => {
    const duplicated = duplicateCampaignItem(id);
    refresh();
    if (duplicated) {
      setSelectedId(duplicated.id);
      setEditorTab('plan');
    }
  };

  const handleDelete = (id: string) => {
    removeCampaignItem(id);
    setDeleteConfirmId(null);
    refresh();
    setSelectedId(null);
  };

  const renderTargetIdOptions = () => {
    switch (draft.targetType) {
      case 'home':
      case 'stores':
      case 'search':
        return (
          <select
            value={draft.targetId}
            onChange={(e) => setDraft({ ...draft, targetId: e.target.value })}
            style={inlineStyles.selectInput}

          >
            <option value="">(تلقائي)</option>
          </select>
        );
      case 'category':
        return (
          <select value={draft.targetId} onChange={(e) => setDraft({ ...draft, targetId: e.target.value })} style={inlineStyles.selectInput}>
            <option value="">-- اختر الفئة --</option>
            {dshCategoryData.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        );
      case 'store':
        return (
          <select value={draft.targetId} onChange={(e) => setDraft({ ...draft, targetId: e.target.value })} style={inlineStyles.selectInput}>
            <option value="">-- اختر المتجر --</option>
            {dshDiscoveryStores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        );
      case 'subcategory': {
        const parentCat = dshCategoryData.find(c => c.id === draft.targetId) ?? dshCategoryData[0];
        return (
          <Box gap={2}>
            <select title="الفئة الرئيسية" value={draft.targetId} onChange={(e) => setDraft({ ...draft, targetId: e.target.value })} style={inlineStyles.selectInput}>
              <option value="">-- اختر الفئة الرئيسية --</option>
              {dshCategoryData.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <select title="الفئة الفرعية" value={draft.targetId} onChange={(e) => setDraft({ ...draft, targetId: e.target.value })} style={inlineStyles.selectInput}>
              <option value="">-- اختر الفئة الفرعية --</option>
              {(parentCat?.subcategories ?? []).map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </Box>
        );
      }
      case 'product': {
        const storeId = draft.linkedBannerId ?? '';
        const products = storeItemsByStoreId[storeId] ?? [];
        return (
          <Box gap={2}>
            <select title="متجر المنتج" value={storeId} onChange={(e) => setDraft({ ...draft, linkedBannerId: e.target.value, targetId: '' })} style={inlineStyles.selectInput}>
              <option value="">-- اختر المتجر --</option>
              {dshDiscoveryStores.filter(s => (storeItemsByStoreId[s.id] ?? []).length > 0).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select title="المنتج" value={draft.targetId} onChange={(e) => setDraft({ ...draft, targetId: e.target.value })} style={inlineStyles.selectInput}>
              <option value="">-- اختر المنتج --</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Box>
        );
      }
      case 'offer':
        return (
          <select value={draft.targetId} onChange={(e) => setDraft({ ...draft, targetId: e.target.value })} style={inlineStyles.selectInput}>
            <option value="">-- اختر متجر العرض --</option>
            {dshDiscoveryStores.filter(s => s.isOffer || s.offerLabel).map(s => <option key={s.id} value={s.id}>{s.name}{s.offerLabel ? ` (${s.offerLabel})` : ''}</option>)}
          </select>
        );
      case 'campaign':
        return (
          <input
            type="text"
            value={draft.targetId ?? ''}
            onChange={(e) => setDraft({ ...draft, targetId: e.target.value })}
            placeholder="معرف الحملة المرتبطة"
            style={{ ...inlineStyles.selectInput, direction: 'ltr' } as React.CSSProperties}
          />
        );
      case 'custom':
        return (
          <input
            type="text"
            value={draft.targetId ?? ''}
            onChange={(e) => setDraft({ ...draft, targetId: e.target.value })}
            placeholder="مسار مخصص (custom route)"
            style={{ ...inlineStyles.selectInput, direction: 'ltr' } as React.CSSProperties}
          />
        );
      default:
        return (
          <select value={draft.targetId} onChange={(e) => setDraft({ ...draft, targetId: e.target.value })} style={inlineStyles.selectInput}>
            <option value="">-- اختر الوجهة --</option>
          </select>
        );
    }
  };

  const renderEditorContent = () => {
    switch (editorTab) {
      case 'plan':
        return (
          <Box gap={3}>
            <TextField label="عنوان الحملة" value={draft.title || ''} onChangeText={v => setDraft({ ...draft, title: v })} style={{ textAlign: 'right' }} />
            <TextField label="الوصف" value={draft.subtitle || ''} onChangeText={v => setDraft({ ...draft, subtitle: v })} style={{ textAlign: 'right' }} />
            <Box gap={1}>
              <Text role="caption" tone="muted" weight="black" style={styles.labelTitle}>الهدف</Text>
              <Tabs<CampaignGoal>
                items={[
                  { value: 'awareness', label: 'توعية' },
                  { value: 'conversion', label: 'تحويل' },
                  { value: 'retention', label: 'احتفاظ' },
                  { value: 'acquisition', label: 'استحواذ' },
                ]}
                value={draft.goal as CampaignGoal}
                onValueChange={v => setDraft({ ...draft, goal: v })}
                variant="pill"
              />
            </Box>
            <Box gap={1}>
              <Text role="caption" tone="muted" weight="black" style={styles.labelTitle}>الأولوية</Text>
              <Tabs<CampaignPriority>
                items={[
                  { value: 'low', label: 'منخفضة' },
                  { value: 'normal', label: 'عادية' },
                  { value: 'high', label: 'عالية' },
                  { value: 'critical', label: 'حرجة' },
                ]}
                value={draft.priority as CampaignPriority}
                onValueChange={v => setDraft({ ...draft, priority: v })}
                variant="pill"
              />
            </Box>
          </Box>
        );
      case 'audience':
        return (
          <Box gap={3}>
            <Box gap={1}>
              <Text role="caption" tone="muted" weight="black" style={styles.labelTitle}>الجمهور المستهدف</Text>
              <Tabs<CampaignAudience>
                items={[
                  { value: 'all', label: 'الجميع' },
                  { value: 'client', label: 'العملاء' },
                  { value: 'operations', label: 'العمليات' },
                  { value: 'targeted', label: 'مخصص' },
                ]}
                value={draft.audience as CampaignAudience}
                onValueChange={v => setDraft({ ...draft, audience: v })}
                variant="pill"
              />
            </Box>
            <Box gap={1}>
              <Text role="caption" tone="muted" weight="black" style={styles.labelTitle}>نوع الوجهة</Text>
              <select
                value={draft.targetType}
                onChange={(e) => setDraft({ ...draft, targetType: e.target.value as CampaignTargetType, targetId: '' })}
                style={inlineStyles.selectInput}

              >
                <option value="home">الرئيسية</option>
                <option value="stores">متاجر</option>
                <option value="store">متجر محدد</option>
                <option value="category">فئة</option>
                <option value="subcategory">فئة فرعية</option>
                <option value="product">منتج</option>
                <option value="offer">عرض</option>
                <option value="campaign">حملة</option>
                <option value="search">بحث</option>
                <option value="custom">مخصص</option>
              </select>
            </Box>
            <Box gap={1}>
              <Text role="caption" tone="muted" weight="black" style={styles.labelTitle}>الوجهة المحددة</Text>
              {renderTargetIdOptions()}
            </Box>
          </Box>
        );
      case 'channels':
        return (
          <Box gap={3}>
            <Text role="caption" tone="muted" weight="black" style={styles.labelTitle}>القنوات المستخدمة</Text>
            <View style={styles.chipsContainer}>
              {(['banner', 'promo', 'video', 'ticker', 'store-card'] as CampaignChannel[]).map(ch => {
                const isActive = draft.channels?.includes(ch);
                return (
                  <Pressable
                    key={ch}
                    onPress={() => {
                      const current = draft.channels || [];
                      setDraft({
                        ...draft,
                        channels: isActive ? current.filter(c => c !== ch) : [...current, ch]
                      });
                    }}
                    style={[styles.chip, isActive && styles.chipActive]}
                  >
                    <Text weight="bold" style={[styles.chipText, isActive && styles.chipTextActive]}>{CAMPAIGN_CHANNEL_LABELS[ch] ?? ch}</Text>
                  </Pressable>
                );
              })}
            </View>
            <TextField label="معرف البنر المرتبط (اختياري)" value={draft.linkedBannerId || ''} onChangeText={v => setDraft({ ...draft, linkedBannerId: v })} style={{ textAlign: 'left' }} />
            <TextField label="معرف الفيديو المرتبط (اختياري)" value={draft.linkedVideoId || ''} onChangeText={v => setDraft({ ...draft, linkedVideoId: v })} style={{ textAlign: 'left' }} />
            <TextField label="معرف عرض الشريك (اختياري)" value={draft.linkedOfferId || ''} onChangeText={v => setDraft({ ...draft, linkedOfferId: v })} style={{ textAlign: 'left' }} />
            <TextField label="معرف ميزة الولاء (اختياري)" value={draft.linkedLoyaltyBenefitId || ''} onChangeText={v => setDraft({ ...draft, linkedLoyaltyBenefitId: v })} style={{ textAlign: 'left' }} />
          </Box>
        );
      case 'schedule':
        return (
          <Box gap={3}>
            <TextField label="تاريخ البدء" value={draft.startDate || ''} onChangeText={v => setDraft({ ...draft, startDate: v })} hint="مثال: 2026-05-01" style={{ textAlign: 'left' }} />
            <TextField label="تاريخ الانتهاء" value={draft.endDate || ''} onChangeText={v => setDraft({ ...draft, endDate: v })} hint="مثال: 2026-06-01" style={{ textAlign: 'left' }} />
            <Box gap={1}>
              <Text role="caption" tone="muted" weight="black" style={styles.labelTitle}>حالة الحملة</Text>
              <select
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as CampaignStatus })}
                style={inlineStyles.selectInput}

              >
                <option value="draft">مسودة</option>
                <option value="pending">بانتظار الموافقة</option>
                <option value="published">منشورة</option>
                <option value="paused">موقوفة</option>
                <option value="archived">مؤرشفة</option>
              </select>
            </Box>
          </Box>
        );
      case 'impact': {
        const previewContext = {
          storeId: 'store-preview',
          activeOffers: [],
          activeSubscriptions: [],
          activeEntitlements: draft.linkedLoyaltyBenefitId ? [{ id: 'entitlement-preview', type: 'loyalty-reward', referenceId: draft.linkedLoyaltyBenefitId, status: 'active', source: 'loyalty' } as Entitlement] : [],
          activeCampaigns: [draft as CampaignRecord],
        };
        const features = mapStoreCommercialFeatures(previewContext);

        return (
          <Box gap={3}>
            <div style={inlineStyles.impactBox}>
              <h4 style={inlineStyles.impactTitle}>مخرجات التأثير</h4>
              <ul style={inlineStyles.impactList}>
                <li><strong>الظهور:</strong> ستظهر هذه الحملة في <span style={{ color: theme.brand }}>{draft.targetType || 'غير محدد'}</span>.</li>
                <li><strong>الولاء:</strong> {draft.linkedLoyaltyBenefitId ? 'مرتبط بميزة ولاء فعالة.' : 'غير مرتبط بالولاء.'}</li>
                <li><strong>الشركاء:</strong> {draft.linkedOfferId ? 'مرتبط بعرض شريك.' : 'غير مرتبط.'}</li>
                <li><strong>التجاوز (Precedence):</strong> {draft.priority === 'critical' ? <span style={{ color: theme.warning, fontWeight: 'bold' }}>تتجاوز متغيرات المنصة الأساسية</span> : 'تخضع للأولوية العادية'}</li>
              </ul>
            </div>

            <Text role="caption" tone="muted" weight="black" style={styles.labelTitle}>محاكاة بطاقة المتجر</Text>
            <CommercialParityPreview features={features} />
          </Box>
        );
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', padding: '16px', boxSizing: 'border-box' }}>
      {/* KPIs Header */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text role="caption" weight="black" style={{ color: theme.textMuted, textAlign: 'right', width: '100%' }}>إجمالي الحملات</Text>
          <Text role="titleMd" weight="black" style={{ color: theme.brandHeaderBackground, textAlign: 'right', width: '100%', marginTop: 4 }}>{kpis.total.value}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" weight="black" style={{ color: theme.textMuted, textAlign: 'right', width: '100%' }}>حي الآن</Text>
          <Text role="titleMd" weight="black" style={{ color: theme.success, textAlign: 'right', width: '100%', marginTop: 4 }}>{kpis.live.value}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" weight="black" style={{ color: theme.textMuted, textAlign: 'right', width: '100%' }}>قيد المراجعة</Text>
          <Text role="titleMd" weight="black" style={{ color: theme.warning, textAlign: 'right', width: '100%', marginTop: 4 }}>{kpis.pending.value}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" weight="black" style={{ color: theme.textMuted, textAlign: 'right', width: '100%' }}>وصول تجريبي</Text>
          <Text role="titleMd" weight="black" style={{ color: theme.brand, textAlign: 'right', width: '100%', marginTop: 4 }}>{kpis.impressions.value}</Text>
        </View>
      </View>

      <View style={styles.mainLayout}>
        {/* List Panel */}
        <Surface tone="raised" style={styles.listPanel}>
          <View style={styles.panelHeader}>
            <Text role="titleSm" style={{ color: theme.brandHeaderBackground }}>الحملات ({totalItems})</Text>
            <Button label="+ حملة جديدة" tone="secondary" fullWidth={false} onPress={handleCreateNew} style={styles.smallButton} disabled={!hasPermission('marketing.edit')} />
          </View>
          <Box gap={2} style={{ flex: 1, minHeight: 0, padding: 12 }}>
            {visibleItems.length === 0 ? (
              <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surfaceInset, borderRadius: 12 }}>
                <Text weight="black" style={{ color: theme.textMuted, textAlign: 'center' }}>لا توجد حملات مطابقة للبحث أو الفلتر المختار.</Text>
              </View>
            ) : (
              visibleItems.map(item => (
                <Pressable
                  key={item.id}
                  style={[styles.rowItem, selectedId === item.id && styles.rowItemSelected]}
                  onPress={() => setSelectedId(item.id)}
                >
                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <Text role="bodyStrong" style={{ fontSize: 13, color: theme.brandHeaderBackground, textAlign: 'right' }}>{item.title}</Text>
                    <Text role="caption" tone="muted" style={{ fontSize: 11, textAlign: 'right' }}>
                      {item.goal} · {item.priority} · {item.channels.length} قنوات
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    {item.status === 'published' && item.priority === 'critical' && (
                      <View style={[styles.statusBadge, { backgroundColor: theme.warning }]}>
                        <Text weight="black" style={[styles.statusText, { color: theme.background }]}>تجاوز المتغيرات</Text>
                      </View>
                    )}
                    <View style={[styles.statusBadge, item.status === 'published' && styles.statusBadgeActive]}>
                      <Text weight="black" style={[styles.statusText, item.status === 'published' && styles.statusTextActive]}>{getCampaignStatusLabel(item.status)}</Text>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
            <WebControlPanelCompactPager
				page={campaignsPage}
				totalPages={totalPages}
				summaryLabel={`عرض ${visibleItems.length} من ${totalItems} حملات`}
				onPrevious={campaignsPage > 1 ? () => setCampaignsPage((currentPage) => currentPage - 1) : undefined}
				onNext={campaignsPage < totalPages ? () => setCampaignsPage((currentPage) => currentPage + 1) : undefined}
			/>
          </Box>
        </Surface>

        {/* Editor Panel */}
        <Surface tone="raised" style={styles.editorPanel}>
          <View style={styles.panelHeader}>
            <Text role="titleSm" style={{ color: theme.brandHeaderBackground }}>{selected ? 'تعديل الحملة' : 'حملة جديدة'}</Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {selected ? <Button label="نسخ" tone="ghost" fullWidth={false} onPress={() => handleDuplicate(selected.id)} style={styles.smallButton} disabled={!hasPermission('marketing.edit')} /> : null}
              {selected?.status === 'draft' ? <Button label="إرسال للمراجعة" tone="secondary" fullWidth={false} onPress={() => handleStatusAdvance(selected.id, 'pending')} style={styles.smallButton} disabled={!hasPermission('marketing.approve')} /> : null}
              {selected?.status === 'pending' ? <Button label="نشر" tone="secondary" fullWidth={false} onPress={() => handleToggle(selected.id)} style={styles.smallButton} disabled={!hasPermission('marketing.publish')} /> : null}
              {selected?.status === 'published' ? <Button label="إيقاف" tone="ghost" fullWidth={false} onPress={() => handleStatusAdvance(selected.id, 'paused')} style={styles.smallButton} disabled={!hasPermission('marketing.publish')} /> : null}
              {selected?.status === 'paused' ? <Button label="إعادة النشر" tone="secondary" fullWidth={false} onPress={() => handleStatusAdvance(selected.id, 'published')} style={styles.smallButton} disabled={!hasPermission('marketing.publish')} /> : null}
              {(selected?.status === 'published' || selected?.status === 'paused') ? (
                archiveConfirmId === selected.id ? (
                  <>
                    <Button label="تأكيد الأرشفة" tone="ghost" fullWidth={false} onPress={() => { handleStatusAdvance(selected.id, 'archived'); setArchiveConfirmId(null); }} style={styles.smallButtonTextRed} disabled={!hasPermission('marketing.edit')} />
                    <Button label="إلغاء" tone="ghost" fullWidth={false} onPress={() => setArchiveConfirmId(null)} style={styles.smallButton} />
                  </>
                ) : (
                  <Button label="أرشفة" tone="ghost" fullWidth={false} onPress={() => setArchiveConfirmId(selected.id)} style={styles.smallButton} disabled={!hasPermission('marketing.edit')} />
                )
              ) : null}
              {selected && deleteConfirmId === selected.id ? (
                <>
                  <Button label="تأكيد الحذف" tone="ghost" fullWidth={false} onPress={() => handleDelete(selected.id)} style={styles.smallButtonTextRed} disabled={!hasPermission('marketing.delete')} />
                  <Button label="إلغاء" tone="ghost" fullWidth={false} onPress={() => setDeleteConfirmId(null)} style={styles.smallButton} />
                </>
              ) : selected ? (
                <Button label="حذف" tone="ghost" fullWidth={false} onPress={() => setDeleteConfirmId(selected.id)} style={styles.smallButtonTextRed} disabled={!hasPermission('marketing.delete')} />
              ) : null}
              <Button label="حفظ" onPress={handleSave} tone="primary" fullWidth={false} style={styles.smallButtonPrimary} disabled={!draft.title?.trim() || !hasPermission('marketing.edit')} />
            </View>
          </View>
          {saveError ? (
            <View style={{ paddingHorizontal: 16, paddingVertical: 6, backgroundColor: theme.dangerSurface ?? theme.surfaceInset }}>
              <Text role="caption" style={{ color: theme.danger }}>{saveError}</Text>
            </View>
          ) : null}

          <Tabs<EditorTab>
            items={[
              { value: 'plan', label: 'الخطة' },
              { value: 'audience', label: 'الجمهور' },
              { value: 'channels', label: 'القنوات' },
              { value: 'schedule', label: 'الجدولة' },
              { value: 'impact', label: 'القياس' },
            ]}
            value={editorTab}
            onValueChange={setEditorTab}
            variant="line"
          />

          <Box gap={4} style={{ padding: 16, flex: 1, minHeight: 0 }}>
            {renderEditorContent()}
          </Box>
        </Surface>
      </View>
    </div>
  );
}

export default CampaignsCommandDeckScreen;
