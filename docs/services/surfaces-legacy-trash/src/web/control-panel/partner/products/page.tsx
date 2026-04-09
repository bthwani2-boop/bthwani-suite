'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import type { Product } from '../fixtures/products';

interface PartnerProductsProps {}

export default function PartnerProducts({}: PartnerProductsProps) {
  const { t } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories] = useState([t('surfaces.مقبلات'), t('surfaces.أطباق_رئيسية'), 'حلويات', t('surfaces.مشروبات'), 'سلطات']);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setProducts([]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      if (editingProduct) {
        // Update existing product
        // await api.put(`/api/partners/current/products/${editingProduct.id}`, productData);
        setProducts(prev => prev.map(p =>
          p.id === editingProduct.id ? { ...p, ...productData } : p
        ));
      } else {
        // Add new product
        const newProduct = { ...productData, id: `prod_${Date.now()}` };
        // await api.post('/api/partners/current/products', newProduct);
        setProducts(prev => [...prev, newProduct]);
      }

      setShowAddModal(false);
      setEditingProduct(null);
      alert(editingProduct ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح');
    } catch (error) {
      alert('فشل في حفظ المنتج');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm(t('surfaces.هل_أنت_متأكد_من_حذف_هذا_المنتج؟'))) return;

    try {
      // await api.delete(`/api/partners/current/products/${productId}`);
      setProducts(prev => prev.filter(p => p.id !== productId));
      alert('تم حذف المنتج بنجاح');
    } catch (error) {
      alert('فشل في حذف المنتج');
    }
  };

  const toggleProductAvailability = async (productId: string, isAvailable: boolean) => {
    try {
      // await api.patch(`/api/partners/current/products/${productId}`, { isAvailable });
      setProducts(prev => prev.map(p =>
        p.id === productId ? { ...p, isAvailable } : p
      ));
    } catch (error) {
      }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">جاري تحميل المنتجات...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة المنتجات</h1>
            <p className="text-gray-600 mt-1">إضافة وتعديل وحذف منتجات القائمة</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            إضافة منتج جديد
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Product Image */}
            <div className="h-48 bg-gray-200 relative">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-4xl">📷</span>
                </div>
              )}

              {/* Availability Toggle */}
              <div className="absolute top-2 left-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={product.isAvailable}
                    onChange={(e) => toggleProductAvailability(product.id, e.target.checked)}
                  />
                  <div className={`relative inline-block w-8 h-4 rounded-full transition-colors ${
                    product.isAvailable ? 'bg-green-600' : 'bg-gray-300'
                  }`}>
                    <span className={`absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
                      product.isAvailable ? 'translate-x-4' : 'translate-x-0'
                    }`}></span>
                  </div>
                </label>
              </div>

              {/* Badges */}
              <div className="absolute top-2 right-2 flex space-x-1">
                {product.isVegetarian && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    نباتي
                  </span>
                )}
                {product.isSpicy && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                    حار
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <span className="text-lg font-bold text-blue-600">
                  {product.price} ريال
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{product.category}</span>
                <span>{product.preparationTime} دقيقة</span>
              </div>

              {/* Allergens */}
              {product.allergens.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">تحتوي على:</div>
                  <div className="flex flex-wrap gap-1">
                    {product.allergens.map(allergen => (
                      <span key={allergen} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
          <p className="text-gray-600 mb-6">ابدأ بإضافة منتجاتك الأولى</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            إضافة منتج جديد
          </button>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

// Product Modal Component
interface ProductModalProps {
  product: Product | null;
  categories: string[];
  onSave: (product: Omit<Product, 'id'>) => void;
  onClose: () => void;
}

function ProductModal({ product, categories, onSave, onClose }: ProductModalProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || categories[0],
    imageUrl: product?.imageUrl || '',
    isAvailable: product?.isAvailable ?? true,
    isVegetarian: product?.isVegetarian || false,
    isSpicy: product?.isSpicy || false,
    preparationTime: product?.preparationTime || 15,
    allergens: product?.allergens || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addAllergen = (allergen: string) => {
    if (allergen && !formData.allergens.includes(allergen)) {
      setFormData(prev => ({
        ...prev,
        allergens: [...prev.allergens, allergen]
      }));
    }
  };

  const removeAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.filter(a => a !== allergen)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {product ? t('surfaces.تعديل_المنتج') : t('surfaces.إضافة_منتج_جديد')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المنتج *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر (ريال) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.5"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وقت التحضير (دقيقة) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.preparationTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رابط الصورة
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Options */}
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">متوفر</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isVegetarian}
                    onChange={(e) => setFormData(prev => ({ ...prev, isVegetarian: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">نباتي</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isSpicy}
                    onChange={(e) => setFormData(prev => ({ ...prev, isSpicy: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">حار</span>
                </label>
              </div>
            </div>

            {/* Allergens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المواد المسببة للحساسية
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.allergens.map(allergen => (
                  <span key={allergen} className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                    {allergen}
                    <button
                      type="button"
                      onClick={() => removeAllergen(allergen)}
                      className="ml-1 text-yellow-600 hover:text-yellow-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('web.control panel.partner.products.page.addAllergen')}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAllergen(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input.value) {
                      addAllergen(input.value);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  إضافة
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {product ? t('surfaces.تحديث_المنتج') : t('surfaces.إضافة_المنتج')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

