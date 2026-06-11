'use client';

import React, { useMemo } from 'react';
import type { CatalogProductMaster } from './catalogs.data';
import type { CatalogPreviewProposal, CatalogWorkspaceState } from './catalogs.model';
import type { CatalogProductPreviewPatch } from './catalogs.adapters';

export type MicroAction = { id: string; label: string; isActive: boolean; onAction: () => void };

type UseCatalogMicroActionsParams = {
  activeTab: string;
  activeSubTab: string;
  filteredProducts: CatalogProductMaster[];
  workspaceState: CatalogWorkspaceState | null;
  setWorkspaceState: (state: CatalogWorkspaceState | null) => void;
  setActionMessage: (msg: string | null) => void;
  setProductPreviewPatches: React.Dispatch<React.SetStateAction<Record<string, CatalogProductPreviewPatch>>>;
  categoryControlOpen: boolean;
  setCategoryControlOpen: (fn: (v: boolean) => boolean) => void;
  addingMainCat: boolean;
  setAddingMainCat: (v: boolean) => void;
  pushPreviewProposal: (p: CatalogPreviewProposal) => void;
  handleResetCategoryPreview: () => void;
};

function makeProposal(partial: Omit<CatalogPreviewProposal, 'id' | 'owner' | 'status'>): CatalogPreviewProposal {
  return {
    id: `prop-${partial.type}-${Date.now()}`,
    status: 'ready-for-api',
    owner: 'control-panel-catalogs',
    ...partial,
  };
}

export function useCatalogMicroActions({
  activeTab, activeSubTab, filteredProducts,
  workspaceState, setWorkspaceState,
  setActionMessage, setProductPreviewPatches,
  categoryControlOpen, setCategoryControlOpen,
  addingMainCat, setAddingMainCat,
  pushPreviewProposal, handleResetCategoryPreview,
}: UseCatalogMicroActionsParams): MicroAction[] {
  return useMemo((): MicroAction[] => {
    const actions: MicroAction[] = [];

    if (activeTab === 'catalog') {
      actions.push(
        {
          id: 'ma-cat-add-item',
          label: '➕ إدخال سريع (مسودة)',
          isActive: workspaceState?.workspace === 'quick-entry-drafts',
          onAction: () => setWorkspaceState({ workspace: 'quick-entry-drafts', sourceSurface: 'catalogs', reason: 'add-product' }),
        },
        {
          id: 'ma-cat-toggle-policy',
          label: '🔄 تبديل سياسة صور المجموعة',
          isActive: false,
          onAction: () => {
            const proposal = makeProposal({ type: 'media-policy-change', label: 'تبديل سياسة صور المجموعة', note: 'محاكاة محلية | تبديل سياسة الصور للمنتجات المحددة في الجدول', productIds: filteredProducts.map(f => f.id) });
            pushPreviewProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        },
        {
          id: 'ma-cat-reset',
          label: '↺ إعادة ضبط الكتالوج',
          isActive: false,
          onAction: () => { setProductPreviewPatches({}); setActionMessage('تمت إعادة الكتالوج لحالة المصدر الأولية'); },
        }
      );
    } else if (activeTab === 'taxonomy') {
      actions.push({
        id: 'ma-taxonomy-governance',
        label: '🗂 حوكمة التصنيف والفئات',
        isActive: workspaceState?.workspace === 'taxonomy-governance',
        onAction: () => setWorkspaceState({ workspace: 'taxonomy-governance', sourceSurface: 'catalogs', reason: 'taxonomy-governance' }),
      });
    } else if (activeTab === 'intake') {
      actions.push({
        id: 'ma-intake-adopt-all',
        label: '✅ اعتماد مقترحات الشركاء',
        isActive: false,
        onAction: () => {
          const proposal = makeProposal({ type: 'bulk-approve', label: 'اعتماد مقترحات الشركاء', note: 'محاكاة محلية | اعتماد مقترحات الشركاء المحددة ونقلها لمرحلة الجاهزية', productIds: filteredProducts.filter(p => p.approvalStage === 'partner-proposed' || p.sourceSurface === 'partner').map(f => f.id) });
          pushPreviewProposal(proposal);
          setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
        },
      });
    } else if (activeTab === 'approvals') {
      if (activeSubTab === 'marketing') {
        actions.push(
          {
            id: 'ma-appr-marketing-approve-all', label: '📢 اعتماد كل مراجعات التسويق', isActive: false,
            onAction: () => {
              const proposal = makeProposal({ type: 'bulk-approve', label: 'اعتماد كل مراجعات التسويق', note: 'محاكاة محلية | اعتماد مراجعات التسويق المحددة بنجاح', productIds: filteredProducts.filter(p => p.approvalStage === 'marketing-review').map(f => f.id) });
              pushPreviewProposal(proposal); setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
            },
          },
          {
            id: 'ma-appr-open-adoption-queue',
            label: '✅ فتح طابور اعتماد الكتالوج الموحد',
            isActive: workspaceState?.workspace === 'adoption-queue',
            onAction: () => setWorkspaceState({ workspace: 'adoption-queue', sourceSurface: 'catalogs', reason: 'marketing-approved-items' }),
          }
        );
      } else if (activeSubTab === 'quality') {
        actions.push({
          id: 'ma-appr-quality-pass-all', label: '🛡️ تمرير جميع فحوصات الجودة', isActive: false,
          onAction: () => {
            const proposal = makeProposal({ type: 'bulk-approve', label: 'تمرير جميع فحوصات الجودة', note: 'محاكاة محلية | تمرير فحوصات الجودة لمنتجات الشركاء بنجاح', productIds: filteredProducts.filter(p => p.approvalStage === 'partner-review').map(f => f.id) });
            pushPreviewProposal(proposal); setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        });
      } else if (activeSubTab === 'pricing') {
        actions.push({
          id: 'ma-appr-pricing-resolve', label: '💸 تسوية تعارض الأسعار تلقائياً', isActive: false,
          onAction: () => {
            const proposal = makeProposal({ type: 'price-change', label: 'تسوية تعارض الأسعار تلقائياً', note: 'محاكاة محلية | خفض وتعديل الأسعار المرتفعة وتسوية تعارض التسعير', productIds: filteredProducts.filter(p => p.price > 100).map(f => f.id) });
            pushPreviewProposal(proposal); setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        });
      } else if (activeSubTab === 'media') {
        actions.push({
          id: 'ma-media-assign-central', label: '📸 تعيين صور مركزية معتمدة', isActive: false,
          onAction: () => {
            const proposal = makeProposal({ type: 'media-policy-change', label: 'تعيين صور مركزية معتمدة', note: 'محاكاة محلية | تعيين صورة مركزية افتراضية للمنتجات التي تنقصها صور', productIds: filteredProducts.filter(p => !p.mediaKey).map(f => f.id) });
            pushPreviewProposal(proposal); setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        });
      } else if (activeSubTab === 'barcode') {
        actions.push({
          id: 'ma-barcode-generate-gtin', label: '🏷️ حوكمة الهوية والباركود',
          isActive: workspaceState?.workspace === 'identity-governance',
          onAction: () => { setWorkspaceState({ workspace: 'identity-governance', sourceSurface: 'catalogs', reason: 'barcode-governance' }); setActionMessage('افتح Identity Governance Workspace لإدارة GTIN/SKU — لا توليد عشوائي'); },
        });
      }
    } else if (activeTab === 'mapping') {
      if (activeSubTab === 'categories') {
        actions.push(
          { id: 'ma-cat-manage', label: '🏷️ فتح/إغلاق لوحة الفئات', isActive: categoryControlOpen, onAction: () => setCategoryControlOpen((v) => !v) },
          { id: 'ma-cat-add-main', label: '➕ إضافة فئة رئيسية', isActive: addingMainCat, onAction: () => { setAddingMainCat(true); setCategoryControlOpen(() => true); } },
          { id: 'ma-cat-reset-all', label: '↺ إعادة ضبط شجرة الفئات', isActive: false, onAction: () => handleResetCategoryPreview() }
        );
      } else if (activeSubTab === 'duplicates') {
        actions.push({
          id: 'ma-dup-resolve-all', label: '🔗 دمج وحل جميع التكرارات', isActive: false,
          onAction: () => {
            const proposal = makeProposal({ type: 'conflict-resolution', label: 'دمج وحل جميع التكرارات', note: 'محاكاة محلية | دمج التكرارات وحل النزاعات للمنتجات المحددة', productIds: filteredProducts.map(f => f.id) });
            pushPreviewProposal(proposal); setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        });
      } else if (activeSubTab === 'gtin') {
        actions.push({
          id: 'ma-gtin-sync', label: '🔄 مزامنة الباركود مع المعرف', isActive: false,
          onAction: () => {
            const proposal = makeProposal({ type: 'edit-product', label: 'مزامنة الباركود مع المعرف', note: 'محاكاة محلية | تعيين GTIN بالاعتماد على SKU للمنتجات المحددة', productIds: filteredProducts.filter(p => !p.gtin).map(f => f.id) });
            pushPreviewProposal(proposal); setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        });
      } else if (activeSubTab === 'media') {
        actions.push({ id: 'ma-media-policy-strict', label: '📸 فرض سياسة الصور المركزية', isActive: false, onAction: () => setActionMessage('معاينة محلية فقط / preview-only: تم فرض سياسة الصور المركزية للمنتجات المؤهلة') });
      } else if (activeSubTab === 'substitutions') {
        actions.push({ id: 'ma-sub-set-strict', label: '🔒 تطبيق سياسة بدائل صارمة', isActive: false, onAction: () => setActionMessage('تم تطبيق سياسة بدائل صارمة بنجاح عبر الكتالوج') });
      } else if (activeSubTab === 'visibility-policy') {
        actions.push({
          id: 'ma-vis-toggle-client', label: '👁️ تبديل الظهور للمستهلكين', isActive: false,
          onAction: () => {
            const proposal = makeProposal({ type: 'visibility-change', label: 'تبديل الظهور للمستهلكين', note: 'محاكاة محلية | تعديل منصات العرض المتاحة للمنتجات المحددة', productIds: filteredProducts.map(f => f.id) });
            pushPreviewProposal(proposal); setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        });
      }
    } else if (activeTab === 'publishing') {
      actions.push(
        {
          id: 'ma-pub-adoption-queue',
          label: '✅ طابور اعتماد الكتالوج — اعتماد نهائي',
          isActive: workspaceState?.workspace === 'adoption-queue',
          onAction: () => setWorkspaceState({ workspace: 'adoption-queue', sourceSurface: 'catalogs', reason: 'final-adoption' }),
        },
        {
          id: 'ma-pub-readiness-matrix',
          label: '🚦 مصفوفة جاهزية النشر',
          isActive: workspaceState?.workspace === 'publication-readiness',
          onAction: () => setWorkspaceState({ workspace: 'publication-readiness', sourceSurface: 'catalogs', reason: 'readiness-check' }),
        },
        {
          id: 'ma-pub-publish-ready', label: '🚀 نشر جميع المنتجات الجاهزة للعميل', isActive: false,
          onAction: () => {
            const proposal = makeProposal({ type: 'visibility-change', label: 'نشر جميع المنتجات الجاهزة للعميل', note: 'محاكاة محلية | نشر جميع المنتجات الجاهزة بنجاح للعميل', productIds: filteredProducts.filter(p => p.approvalStage === 'catalog-adopted').map(f => f.id) });
            pushPreviewProposal(proposal); setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        },
        {
          id: 'ma-pub-hide-drafts', label: '🙈 إخفاء جميع المسودات والمقترحات', isActive: false,
          onAction: () => {
            const proposal = makeProposal({ type: 'visibility-change', label: 'إخفاء جميع المسودات والمقترحات', note: 'محاكاة محلية | التأكد من إخفاء جميع المسودات ومقترحات الشركاء', productIds: filteredProducts.filter(p => p.approvalStage === 'catalog-draft' || p.approvalStage === 'partner-proposed').map(f => f.id) });
            pushPreviewProposal(proposal); setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        }
      );
    }

    return actions;
  }, [activeTab, activeSubTab, filteredProducts, workspaceState, categoryControlOpen, addingMainCat, pushPreviewProposal, handleResetCategoryPreview, setWorkspaceState, setActionMessage, setProductPreviewPatches, setCategoryControlOpen, setAddingMainCat]);
}
