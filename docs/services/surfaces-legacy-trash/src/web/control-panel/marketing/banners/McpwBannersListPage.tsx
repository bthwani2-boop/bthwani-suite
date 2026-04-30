'use client';

/**
 * CONTROL PANEL Banners List — Modern Clean Design
 * 
 * REDESIGNED: Clean cards, better hierarchy, simpler actions
 */

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { SectionScreenTemplate } from '../../components/SectionScreenTemplate';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { BannerDrawer, type BannerDrawerMode } from './components/BannerDrawer';
import type { DshBannerAdmin } from './types';
import { getBanners, removeBanner, updateBanner } from './mockBannersStore';
import { 
  ImagePlus, 
  Plus, 
  Pencil, 
  Copy, 
  Trash2, 
  Search, 
  Zap,
  Eye,
  MousePointerClick,
  MoreHorizontal,
  Calendar,
} from 'lucide-react';

export function McpwBannersListPage() {
  const { t, isRTL } = useI18n();
  const [banners, setBanners] = useState<DshBannerAdmin[]>(() => getBanners());
  const refreshBanners = useCallback(() => setBanners(getBanners()), []);
  useEffect(() => refreshBanners(), [refreshBanners]);
  
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; banner: DshBannerAdmin | null }>({
    open: false,
    banner: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [drawer, setDrawer] = useState<{ open: boolean; mode: BannerDrawerMode; editBanner: DshBannerAdmin | null }>({
    open: false,
    mode: 'create',
    editBanner: null,
  });
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'active'>('all');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleDeleteClick = useCallback((banner: DshBannerAdmin) => {
    setDeleteModal({ open: true, banner });
    setOpenMenu(null);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteModal.banner) return;
    setDeleting(true);
    setTimeout(() => {
      removeBanner(deleteModal.banner!.id);
      setBanners(getBanners());
      setDeleteModal({ open: false, banner: null });
      setDeleting(false);
    }, 300);
  }, [deleteModal.banner]);

  const isActiveNow = useCallback((b: DshBannerAdmin) => {
    if (b.status !== 'published') return false;
    if (b.schedule_type !== 'scheduled') return true;
    const now = new Date();
    if (b.schedule_start && now < new Date(b.schedule_start)) return false;
    if (b.schedule_end && now > new Date(b.schedule_end)) return false;
    return true;
  }, []);

  const handleTogglePublish = useCallback((banner: DshBannerAdmin) => {
    const nextStatus = banner.status === 'published' ? 'draft' : 'published';
    updateBanner({ ...banner, status: nextStatus });
    setBanners(getBanners());
    setOpenMenu(null);
  }, []);

  const openCreateDrawer = useCallback(() => setDrawer({ open: true, mode: 'create', editBanner: null }), []);
  const openDuplicateDrawer = useCallback((banner: DshBannerAdmin) => {
    setDrawer({ open: true, mode: 'create', editBanner: banner });
    setOpenMenu(null);
  }, []);
  const openEditDrawer = useCallback((banner: DshBannerAdmin) => {
    setDrawer({ open: true, mode: 'edit', editBanner: banner });
    setOpenMenu(null);
  }, []);
  const closeDrawer = useCallback(() => setDrawer((d) => ({ ...d, open: false })), []);

  const filteredBanners = useMemo(() => {
    const q = query.trim().toLowerCase();
    return banners
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .filter((b) => {
        if (q && !`${b.title ?? ''} ${b.partner_name ?? ''}`.toLowerCase().includes(q)) return false;
        if (filter === 'published') return b.status === 'published';
        if (filter === 'draft') return (b.status ?? 'draft') === 'draft';
        if (filter === 'active') return isActiveNow(b);
        return true;
      });
  }, [banners, query, filter, isActiveNow]);

  const kpis = useMemo(() => ({
    total: banners.length,
    published: banners.filter((b) => b.status === 'published').length,
    drafts: banners.filter((b) => (b.status ?? 'draft') === 'draft').length,
    active: banners.filter(isActiveNow).length,
  }), [banners, isActiveNow]);

  const filters = ['all', 'active', 'published', 'draft'] as const;
  const filterLabels = { all: 'الكل', active: 'فعّال', published: 'منشور', draft: 'مسودة' };

  return (
    <>
      <SectionScreenTemplate
        title="قائمة البنرات"
        subtitle="إدارة بنرات الصفحة الرئيسية DSH وعرضها في تطبيق العميل"
        icon={ImagePlus}
        primaryAction={
          <button
            onClick={openCreateDrawer}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              backgroundColor: '#F97316',
              color: '#FFF',
              borderRadius: 10,
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
            }}
          >
            <Plus size={18} />
            إضافة بنر
          </button>
        }
      >
        {banners.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FAFAFA',
              borderRadius: 20,
              padding: 60,
              textAlign: 'center',
              border: '2px dashed #E5E5E5',
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: '#FFF7ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <ImagePlus size={32} color="#F97316" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1A1A1A', margin: '0 0 8px' }}>
              لا توجد بنرات
            </h3>
            <p style={{ fontSize: 14, color: '#666', margin: '0 0 24px' }}>
              أضف أول بنر لعرضه في تطبيق العميل
            </p>
            <button
              onClick={openCreateDrawer}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                backgroundColor: '#F97316',
                color: '#FFF',
                borderRadius: 10,
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Plus size={18} />
              إضافة بنر جديد
            </button>
          </div>
        ) : (
          <div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'إجمالي البنرات', value: kpis.total, color: '#3B82F6' },
                { label: 'منشور', value: kpis.published, color: '#22C55E' },
                { label: 'مسودة', value: kpis.drafts, color: '#64748B' },
                { label: 'فعّال الآن', value: kpis.active, color: '#F97316' },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#FFF',
                    borderRadius: 16,
                    padding: 20,
                    border: '1px solid #E5E5E5',
                  }}
                >
                  <p style={{ fontSize: 13, color: '#666', margin: 0 }}>{stat.label}</p>
                  <p style={{ fontSize: 28, fontWeight: 700, color: stat.color, margin: '8px 0 0' }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Search & Filter */}
            <div
              style={{
                backgroundColor: '#FFF',
                borderRadius: 16,
                padding: 16,
                border: '1px solid #E5E5E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                marginBottom: 24,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 300 }}>
                <Search size={18} style={{ position: 'absolute', top: 10, insetInlineStart: 12, color: '#999' }} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="بحث..."
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    paddingInlineStart: 40,
                    paddingInlineEnd: 12,
                    borderRadius: 10,
                    border: '1px solid #E5E5E5',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 20,
                      border: 'none',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      backgroundColor: filter === f ? '#F97316' : '#F5F5F5',
                      color: filter === f ? '#FFF' : '#666',
                    }}
                  >
                    {filterLabels[f]}
                  </button>
                ))}
              </div>
            </div>

            {/* Banner Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
              {filteredBanners.map((banner) => {
                const active = isActiveNow(banner);
                return (
                  <div
                    key={banner.id}
                    style={{
                      backgroundColor: '#FFF',
                      borderRadius: 20,
                      border: '1px solid #E5E5E5',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative', height: 160, backgroundColor: '#F5F5F5' }}>
                      {banner.image_url ? (
                        <img src={banner.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                          <ImagePlus size={32} color="#CCC" />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 12,
                          insetInlineEnd: 12,
                          insetInlineStart: 12,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '6px 12px',
                          borderRadius: 20,
                          backgroundColor: active ? '#22C55E' : banner.status === 'published' ? '#3B82F6' : '#64748B',
                          color: '#FFF',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {active && <Zap size={14} />}
                        {active ? 'فعّال' : banner.status === 'published' ? 'منشور' : 'مسودة'}
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
                          {banner.title || 'بدون عنوان'}
                        </h3>
                        <span style={{ fontSize: 12, color: '#999', backgroundColor: '#F5F5F5', padding: '4px 10px', borderRadius: 6 }}>
                          #{banner.position ?? 0}
                        </span>
                      </div>

                      {/* Stats */}
                      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666' }}>
                          <MousePointerClick size={16} color="#F97316" />
                          <span>{banner.click_count ?? 0} نقرة</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666' }}>
                          <Eye size={16} color="#3B82F6" />
                          <span>{banner.view_count ?? 0} مشاهدة</span>
                        </div>
                      </div>

                      {/* Schedule */}
                      {banner.schedule_type === 'scheduled' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888', marginBottom: 16 }}>
                          <Calendar size={14} />
                          <span>
                            {banner.schedule_start ? new Date(banner.schedule_start).toLocaleDateString('ar') : '—'}
                            {' → '}
                            {banner.schedule_end ? new Date(banner.schedule_end).toLocaleDateString('ar') : 'دائم'}
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleTogglePublish(banner)}
                          style={{
                            flex: 1,
                            padding: '10px 16px',
                            borderRadius: 10,
                            border: 'none',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            backgroundColor: banner.status === 'published' ? '#F5F5F5' : '#F97316',
                            color: banner.status === 'published' ? '#666' : '#FFF',
                          }}
                        >
                          {banner.status === 'published' ? 'إيقاف' : 'نشر'}
                        </button>
                        <button
                          onClick={() => openEditDrawer(banner)}
                          style={{
                            padding: '10px 16px',
                            borderRadius: 10,
                            border: '1px solid #E5E5E5',
                            backgroundColor: '#FFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 13,
                            color: '#666',
                          }}
                        >
                          <Pencil size={16} />
                          تعديل
                        </button>
                        <div style={{ position: 'relative' }}>
                          <button
                            onClick={() => setOpenMenu(openMenu === banner.id ? null : banner.id)}
                            style={{
                              padding: '10px 12px',
                              borderRadius: 10,
                              border: '1px solid #E5E5E5',
                              backgroundColor: '#FFF',
                              cursor: 'pointer',
                              color: '#666',
                            }}
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {openMenu === banner.id && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '100%',
                                insetInlineEnd: 0,
                                insetInlineStart: 0,
                                marginTop: 8,
                                backgroundColor: '#FFF',
                                borderRadius: 12,
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                border: '1px solid #E5E5E5',
                                zIndex: 10,
                                minWidth: 150,
                                overflow: 'hidden',
                              }}
                            >
                              <button
                                onClick={() => openDuplicateDrawer(banner)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10,
                                  width: '100%',
                                  padding: '12px 16px',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  cursor: 'pointer',
                                  fontSize: 13,
                                  color: '#444',
                                  textAlign: isRTL ? 'right' : 'left',
                                }}
                              >
                                <Copy size={16} />
                                نسخ
                              </button>
                              <button
                                onClick={() => handleDeleteClick(banner)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10,
                                  width: '100%',
                                  padding: '12px 16px',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  cursor: 'pointer',
                                  fontSize: 13,
                                  color: '#EF4444',
                                  textAlign: isRTL ? 'right' : 'left',
                                }}
                              >
                                <Trash2 size={16} />
                                حذف
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </SectionScreenTemplate>

      <BannerDrawer
        open={drawer.open}
        onClose={closeDrawer}
        mode={drawer.mode}
        editBanner={drawer.editBanner}
        onSaved={refreshBanners}
      />

      <ConfirmDeleteModal
        open={deleteModal.open}
        title="حذف البنر"
        message="هل أنت متأكد من حذف هذا البنر؟ لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, banner: null })}
        loading={deleting}
      />
    </>
  );
}

