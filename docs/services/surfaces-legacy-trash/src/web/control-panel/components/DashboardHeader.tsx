'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@bthwani/ui-kit';

export function DashboardHeader() {
  const pathname = usePathname();

  return (
    <header className='bg-white shadow-sm border-b border-gray-200'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo and Brand */}
          <div className='flex items-center space-x-4 rtl:space-x-reverse'>
            <Link
              href='/'
              className='flex items-center space-x-2 rtl:space-x-reverse'
            >
              <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>BTH</span>
              </div>
              <span className='font-semibold text-gray-900'>لوحات التحكم</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className='hidden md:flex items-center space-x-6 rtl:space-x-reverse'>
            <Link
              href='/'
              className={cn(
                'text-sm font-medium transition-colors hover:text-blue-600',
                pathname === '/' ? 'text-blue-600' : 'text-gray-600'
              )}
            >
              الرئيسية
            </Link>
            <Link
              href='/(surfaces)/admin'
              className={cn(
                'text-sm font-medium transition-colors hover:text-blue-600',
                pathname?.startsWith('/(surfaces)')
                  ? 'text-blue-600'
                  : 'text-gray-600'
              )}
            >
              Surfaces
            </Link>
          </nav>

          {/* User Menu */}
          <div className='flex items-center space-x-4 rtl:space-x-reverse'>
            <div className='text-sm text-gray-600'>
              مرحباً بك في لوحات التحكم
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
