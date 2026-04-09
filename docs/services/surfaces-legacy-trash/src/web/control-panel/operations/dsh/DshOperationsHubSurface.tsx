/**
 * CONTROL PANEL DSH Operations Hub Surface
 *
 * Architecture Rule: §86 SSoT - Screen logic in packages/surfaces only
 * This surface is used by apps/web/control panel/app/operations/dsh/page.tsx as a thin wrapper
 */

import Link from 'next/link';
import {
  AdminDshStoreItemsListScreen,
  DshCartItemAddScreen as OrdersDshCartItemAddScreen,
} from '@bthwani/surfaces/control panel/operations';

export function DshOperationsHubSurface() {
  return (
    <div className='min-h-screen'>
      <div className='container py-12'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            عمليات DSH - إدارة الطلبات والمتاجر
          </h1>
          <p className='text-xl text-gray-600 mb-8'>
            شاشات العمليات الخاصة بخدمة التوصيل والتسوق
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          {/* Store Items List */}
          <div className='card'>
            <div className='card-body'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <svg
                    className='h-8 w-8 text-blue-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                    />
                  </svg>
                </div>
                <div className='mr-5'>
                  <h3 className='text-lg font-medium text-gray-900'>
                    قائمة منتجات المتاجر
                  </h3>
                  <p className='text-sm text-gray-600'>
                    عرض وإدارة منتجات المتاجر
                  </p>
                </div>
              </div>
              <div className='mt-6'>
                <Link
                  href='/operations/dsh/store-items'
                  className='btn btn-primary w-full'
                >
                  عرض المنتجات
                </Link>
              </div>
            </div>
          </div>

          {/* Cart Item Add */}
          <div className='card'>
            <div className='card-body'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <svg
                    className='h-8 w-8 text-green-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3'
                    />
                  </svg>
                </div>
                <div className='mr-5'>
                  <h3 className='text-lg font-medium text-gray-900'>
                    إضافة عنصر للسلة
                  </h3>
                  <p className='text-sm text-gray-600'>
                    إدارة عناصر سلة التسوق
                  </p>
                </div>
              </div>
              <div className='mt-6'>
                <Link
                  href='/operations/dsh/cart-item-add'
                  className='btn btn-success w-full'
                >
                  إضافة عنصر
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className='flex gap-4'>
          <Link href='/operations' className='btn btn-outline'>
            ← العودة للعمليات
          </Link>
          <Link href='/' className='btn btn-outline'>
            العودة للوحة التحكم الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

