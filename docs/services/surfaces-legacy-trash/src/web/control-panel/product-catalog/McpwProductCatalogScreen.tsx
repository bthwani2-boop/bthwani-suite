'use client';

/**
 * McpwProductCatalogScreen — Modern Clean Hub Design
 * Uses McpwDesignSystem for unified, smooth, smart UX.
 */

import Link from 'next/link';
import { useI18n } from '@bthwani/ui-kit';
import {
  Box,
  Package,
  FolderOpen,
  Layers,
  Database,
  Tag,
  Plus,
} from 'lucide-react';
import {
  RestoredHubCompactGrid,
  RestoredHubCompactLink,
  RestoredHubHeader,
  RestoredHubSectionIntro,
} from '../components/RestoredHubPrimitives';

export default function McpwProductCatalogScreen() {
  const { isRTL } = useI18n();

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <RestoredHubHeader
        title="كتالوج المنتجات"
        subtitle="إدارة المنتجات والتصنيفات والمخزون"
        icon={<Box size={28} color="#FFF" />}
        gradientFrom="#3B82F6"
        gradientTo="#2563EB"
        shadowColor="rgba(59, 130, 246, 0.3)"
        action={
          <Link
            href="/product-catalog/products/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 16px',
              backgroundColor: '#F97316',
              color: '#FFF',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 10px 20px rgba(249, 115, 22, 0.18)',
            }}
          >
            <Plus size={18} />
            منتج جديد
          </Link>
        }
      />

      <RestoredHubSectionIntro
        title="أقسام الكتالوج"
        description="إدارة المنتجات والتصنيفات"
        icon={<Box size={20} color="#3B82F6" />}
        accentColor="#3B82F6"
      />

      <RestoredHubCompactGrid>
        <RestoredHubCompactLink
          title="المنتجات"
          description="عرض وإدارة جميع المنتجات المتاحة"
          href="/product-catalog/products"
          icon={<Package size={22} color="#3B82F6" />}
          color="#3B82F6"
          badge="156"
        />
        <RestoredHubCompactLink
          title="التصنيفات"
          description="تنظيم المنتجات في فئات وتصنيفات"
          href="/product-catalog/categories"
          icon={<FolderOpen size={22} color="#8B5CF6" />}
          color="#8B5CF6"
          badge="24"
        />
        <RestoredHubCompactLink
          title="الوحدات"
          description="إدارة وحدات القياس والتعبئة"
          href="/product-catalog/units"
          icon={<Layers size={22} color="#10B981" />}
          color="#10B981"
          badge="12"
        />
        <RestoredHubCompactLink
          title="المخزون"
          description="متابعة المخزون والكميات المتاحة"
          href="/product-catalog/inventory"
          icon={<Database size={22} color="#F59E0B" />}
          color="#F59E0B"
          badge="89"
        />
        <RestoredHubCompactLink
          title="العلامات"
          description="إدارة العلامات والتصنيفات الفرعية"
          href="/product-catalog/tags"
          icon={<Tag size={22} color="#EC4899" />}
          color="#EC4899"
          badge="45"
        />
      </RestoredHubCompactGrid>
    </div>
  );
}
