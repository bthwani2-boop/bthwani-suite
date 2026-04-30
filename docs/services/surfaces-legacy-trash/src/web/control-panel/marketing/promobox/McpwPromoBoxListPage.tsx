'use client';

/**
 * CONTROL PANEL — إدارة صندوق العروض الترويجي الدوار في DSH.
 * صندوق واحد يعرض حتى 4 إعلانات بالتناوب تلقائيًا.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import { SectionScreenTemplate } from '../../components/SectionScreenTemplate';
import { ConfirmDeleteModal } from '../banners/components/ConfirmDeleteModal';
import { PromoBoxDrawer, type PromoBoxDrawerMode } from './components/PromoBoxDrawer';
import type { DshPromoBoxAdmin } from './types';
import { MAX_ACTIVE_PROMO_BOXES } from './types';
import {
  getPromoBoxes,
  removePromoBox,
  updatePromoBox,
  getActivePromoBoxCount,
} from './mockPromoBoxStore';
import {
  Sparkles,
  Plus,
  Pencil,
  Copy,
  Trash2,
  BarChart3,
  Search,
  Zap,
  Eye,
  MousePointerClick,
  AlertCircle,
} from 'lucide-react';

export function McpwPromoBoxListPage() {
  const { t } = useI18n();
  const [promoBoxes, setPromoBoxes] = useState<DshPromoBoxAdmin[]>(() => getPromoBoxes());
  const refreshPromoBoxes = useCallback(() => setPromoBoxes(getPromoBoxes()), []);
  useEffect(() => refreshPromoBoxes(), [refreshPromoBoxes]);

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; promo: DshPromoBoxAdmin | null }>({
    open: false,
    promo: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [drawer, setDrawer] = useState<{
    open: boolean;
    mode: PromoBoxDrawerMode;
    editPromo: DshPromoBoxAdmin | null;
  }>({
    open: false,
    mode: 'create',
    editPromo: null,
  });
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'published' | 'draft'>('all');

  const handleDeleteClick = useCallback((promo: DshPromoBoxAdmin) => {
    setDeleteModal({ open: true, promo });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteModal.promo) return;
    setDeleting(true);
    setTimeout(() => {
      removePromoBox(deleteModal.promo!.id);
      setPromoBoxes(getPromoBoxes());
      setDeleteModal({ open: false, promo: null });
      setDeleting(false);
    }, 300);
  }, [deleteModal.promo]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModal({ open: false, promo: null });
  }, []);

  const handleToggleActive = useCallback((promo: DshPromoBoxAdmin) => {
    const activeCount = getActivePromoBoxCount();
    if (!promo.is_active && activeCount >= MAX_ACTIVE_PROMO_BOXES) {
      alert(`الحد الأقصى للإعلانات النشطة هو ${MAX_ACTIVE_PROMO_BOXES}. قم بإلغاء تفعيل إعلان آخر أولاً.`);
      return;
    }
    updatePromoBox({ ...promo, is_active: !promo.is_active });
    setPromoBoxes(getPromoBoxes());
  }, []);

  const handleTogglePublish = useCallback((promo: DshPromoBoxAdmin) => {
    const nextStatus = promo.status === 'published' ? 'draft' : 'published';
    updatePromoBox({ ...promo, status: nextStatus });
    setPromoBoxes(getPromoBoxes());
  }, []);

  const openCreateDrawer = useCallback(() => {
    setDrawer({ open: true, mode: 'create', editPromo: null });
  }, []);

  const openDuplicateDrawer = useCallback((promo: DshPromoBoxAdmin) => {
    setDrawer({ open: true, mode: 'create', editPromo: promo });
  }, []);

  const openEditDrawer = useCallback((promo: DshPromoBoxAdmin) => {
    setDrawer({ open: true, mode: 'edit', editPromo: promo });
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawer((d) => ({ ...d, open: false }));
  }, []);

  const sorted = useMemo(
    () => [...promoBoxes].sort((a, b) => a.priority - b.priority),
    [promoBoxes]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((p) => {
      if (q) {
        const hay = `${p.title} ${p.subtitle} ${p.badge} ${p.action_target}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filter === 'active') return p.is_active && p.status === 'published';
      if (filter === 'published') return p.status === 'published';
      if (filter === 'draft') return p.status === 'draft';
      return true;
    });
  }, [sorted, query, filter]);

  const kpis = useMemo(() => {
    const total = promoBoxes.length;
    const active = promoBoxes.filter((p) => p.is_active && p.status === 'published').length;
    const published = promoBoxes.filter((p) => p.status === 'published').length;
    const drafts = promoBoxes.filter((p) => p.status === 'draft').length;
    const totalClicks = promoBoxes.reduce((sum, p) => sum + (p.click_count ?? 0), 0);
    const totalViews = promoBoxes.reduce((sum, p) => sum + (p.view_count ?? 0), 0);
    return { total, active, published, drafts, totalClicks, totalViews };
  }, [promoBoxes]);

  const activeCount = getActivePromoBoxCount();
  const canAddMore = activeCount < MAX_ACTIVE_PROMO_BOXES;

  return (
    <>
      <SectionScreenTemplate
        title={t('marketing.promobox_title') || 'صندوق العروض الدوار'}
        subtitle={t('marketing.promobox_subtitle') || 'إدارة الإعلانات الترويجية في صف الفئات'}
        icon={Sparkles}
        primaryAction={
          <button
            type="button"
            onClick={openCreateDrawer}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            style={{
              backgroundColor: semanticRoles.accent,
              color: '#fff',
            }}
          >
            <Plus className="h-4 w-4" />
            {t('marketing.promobox_add') || 'إضافة إعلان'}
          </button>
        }
      >
        {/* تنبيه الحد الأقصى */}
        {!canAddMore && (
          <div
            className="mb-4 flex items-center gap-3 rounded-xl border p-4"
            style={{
              borderColor: semanticRoles.stateWarning?.border ?? '#F59E0B',
              backgroundColor: semanticRoles.stateWarning?.background ?? 'rgba(245,158,11,0.1)',
            }}
          >
            <AlertCircle className="h-5 w-5" style={{ color: semanticRoles.stateWarning?.text ?? '#D97706' }} />
            <p className="text-sm" style={{ color: semanticRoles.stateWarning?.text ?? '#D97706' }}>
              تم الوصول للحد الأقصى ({MAX_ACTIVE_PROMO_BOXES} إعلانات نشطة). لإضافة إعلان جديد، قم بإلغاء تفعيل إعلان آخر.
            </p>
          </div>
        )}

        {promoBoxes.length === 0 ? (
          <div
            className="rounded-lg border p-8 text-center"
            style={{
              backgroundColor: semanticRoles.surfaceSubtle,
              borderColor: semanticRoles.border,
            }}
          >
            <Sparkles
              className="mx-auto h-12 w-12 opacity-60"
              style={{ color: semanticRoles.textSecondary }}
            />
            <h3 className="mt-4 text-lg font-semibold" style={{ color: semanticRoles.text }}>
              لا توجد إعلانات
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: semanticRoles.textSecondary }}>
              أضف إعلانات ترويجية لتظهر في صندوق العروض الدوار على الصفحة الرئيسية.
            </p>
            <button
              type="button"
              onClick={openCreateDrawer}
              className="mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: semanticRoles.accent }}
            >
              <Plus className="h-4 w-4" />
              إضافة إعلان
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* KPIs */}
            <div className="grid gap-3 md:grid-cols-4">
              <div
                className="rounded-xl border p-4"
                style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}
              >
                <p className="text-xs" style={{ color: semanticRoles.textSecondary }}>
                  إجمالي الإعلانات
                </p>
                <p className="mt-2 text-2xl font-semibold" style={{ color: semanticRoles.text }}>
                  {kpis.total}
                </p>
              </div>
              <div
                className="rounded-xl border p-4"
                style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}
              >
                <p className="text-xs" style={{ color: semanticRoles.textSecondary }}>
                  نشط الآن
                </p>
                <p className="mt-2 text-2xl font-semibold" style={{ color: semanticRoles.accent }}>
                  {kpis.active}/{MAX_ACTIVE_PROMO_BOXES}
                </p>
              </div>
              <div
                className="rounded-xl border p-4"
                style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}
              >
                <p className="text-xs" style={{ color: semanticRoles.textSecondary }}>
                  إجمالي النقرات
                </p>
                <p className="mt-2 text-2xl font-semibold" style={{ color: semanticRoles.text }}>
                  {kpis.totalClicks.toLocaleString()}
                </p>
              </div>
              <div
                className="rounded-xl border p-4"
                style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}
              >
                <p className="text-xs" style={{ color: semanticRoles.textSecondary }}>
                  إجمالي المشاهدات
                </p>
                <p className="mt-2 text-2xl font-semibold" style={{ color: semanticRoles.text }}>
                  {kpis.totalViews.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Search & Filter */}
            <div
              className="rounded-xl border p-3"
              style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-sm">
                  <Search
                    className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2"
                    style={{ color: semanticRoles.textMuted }}
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ابحث بالعنوان أو الشارة..."
                    className="w-full rounded-lg border py-2 pe-3 ps-9 text-sm focus:outline-none focus:ring-2"
                    style={{
                      borderColor: semanticRoles.border,
                      color: semanticRoles.text,
                      backgroundColor: semanticRoles.surface,
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'الكل' },
                    { id: 'active', label: 'نشط الآن' },
                    { id: 'published', label: 'منشور' },
                    { id: 'draft', label: 'مسودة' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilter(f.id as typeof filter)}
                      className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                      style={{
                        borderColor: semanticRoles.border,
                        color: filter === f.id ? '#fff' : semanticRoles.textSecondary,
                        backgroundColor: filter === f.id ? semanticRoles.accent : semanticRoles.surface,
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PromoBox Cards */}
            <div className="grid gap-4 lg:grid-cols-2">
              {filtered.map((promo) => {
                const isActiveNow = promo.is_active && promo.status === 'published';
                return (
                  <article
                    key={promo.id}
                    className="overflow-hidden rounded-2xl border"
                    style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}
                  >
                    {/* Preview */}
                    <div
                      className="relative flex items-center gap-4 p-4"
                      style={{ backgroundColor: promo.bg_color }}
                    >
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-full"
                        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                      >
                        <span className="text-3xl">{promo.icon}</span>
                      </div>
                      <div className="flex-1">
                        <span
                          className="inline-block rounded px-2 py-0.5 text-xs font-bold text-white"
                          style={{ backgroundColor: promo.badge_color }}
                        >
                          {promo.badge}
                        </span>
                        <p
                          className="mt-1 text-base font-bold"
                          style={{ color: promo.text_color }}
                        >
                          {promo.title}
                        </p>
                        <p
                          className="text-sm opacity-80"
                          style={{ color: promo.text_color }}
                        >
                          {promo.subtitle}
                        </p>
                      </div>
                      <span className="absolute top-2 end-2 rounded-full bg-black/30 px-2 py-0.5 text-xs text-white">
                        #{promo.priority}
                      </span>
                    </div>

                    {/* Info & Actions */}
                    <div className="space-y-3 p-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className="rounded-full px-2 py-0.5 font-medium"
                          style={{
                            backgroundColor:
                              promo.status === 'published'
                                ? semanticRoles.stateSuccess?.background ?? 'rgba(34,197,94,0.15)'
                                : semanticRoles.surfaceSubtle,
                            color:
                              promo.status === 'published'
                                ? semanticRoles.stateSuccess?.text ?? '#16a34a'
                                : semanticRoles.textSecondary,
                          }}
                        >
                          {promo.status === 'published' ? 'منشور' : 'مسودة'}
                        </span>
                        {isActiveNow && (
                          <span
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium"
                            style={{ backgroundColor: 'rgba(59,130,246,0.12)', color: '#2563EB' }}
                          >
                            <Zap className="h-3.5 w-3.5" />
                            نشط الآن
                          </span>
                        )}
                        <span
                          className="rounded-full px-2 py-0.5"
                          style={{
                            backgroundColor: semanticRoles.surfaceSubtle,
                            color: semanticRoles.textSecondary,
                          }}
                        >
                          {promo.action_type === 'subscription'
                            ? 'اشتراك'
                            : promo.action_type === 'screen'
                              ? 'شاشة'
                              : promo.action_type === 'url'
                                ? 'رابط'
                                : 'ديب لينك'}
                        </span>
                      </div>

                      <div
                        className="flex items-center gap-4 text-xs"
                        style={{ color: semanticRoles.textSecondary }}
                      >
                        <span className="inline-flex items-center gap-1">
                          <MousePointerClick className="h-3.5 w-3.5" />
                          {promo.click_count ?? 0}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {promo.view_count ?? 0}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <BarChart3 className="h-3.5 w-3.5" />
                          {promo.click_count && promo.view_count
                            ? `${((promo.click_count / promo.view_count) * 100).toFixed(1)}%`
                            : '—'}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(promo)}
                          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white"
                          style={{
                            backgroundColor: promo.is_active ? '#64748B' : semanticRoles.accent,
                          }}
                        >
                          {promo.is_active ? 'إلغاء التفعيل' : 'تفعيل'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(promo)}
                          className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium"
                          style={{
                            borderColor: semanticRoles.border,
                            color: semanticRoles.text,
                            backgroundColor: semanticRoles.surface,
                          }}
                        >
                          {promo.status === 'published' ? 'إيقاف النشر' : 'نشر'}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditDrawer(promo)}
                          className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium"
                          style={{
                            borderColor: semanticRoles.border,
                            color: semanticRoles.text,
                            backgroundColor: semanticRoles.surface,
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          تعديل
                        </button>
                        <button
                          type="button"
                          onClick={() => openDuplicateDrawer(promo)}
                          className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium"
                          style={{
                            borderColor: semanticRoles.border,
                            color: semanticRoles.text,
                            backgroundColor: semanticRoles.surface,
                          }}
                        >
                          <Copy className="h-3.5 w-3.5" />
                          نسخ
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(promo)}
                          className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium"
                          style={{
                            borderColor: semanticRoles.stateError?.text ?? '#EF4444',
                            color: semanticRoles.stateError?.text ?? '#EF4444',
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          حذف
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </SectionScreenTemplate>

      <PromoBoxDrawer
        open={drawer.open}
        onClose={closeDrawer}
        mode={drawer.mode}
        editPromo={drawer.editPromo}
        onSaved={refreshPromoBoxes}
      />

      <ConfirmDeleteModal
        open={deleteModal.open}
        title="حذف الإعلان"
        message="هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="نعم، احذف"
        cancelLabel="إلغاء"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleting}
      />
    </>
  );
}

