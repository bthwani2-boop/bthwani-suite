import React from 'react';

interface PartnerLayoutProps {
  children: React.ReactNode;
}

export default function PartnerLayout({ children }: PartnerLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Partner Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-auto"
                  src="/logo-bthwani.svg"
                  alt="BTHWANI"
                />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">
                  لوحة تحكم الشريك
                </h1>
                <p className="text-sm text-gray-500">
                  إدارة شاملة لأعمالك التجارية
                </p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">اسم الشريك</p>
                <p className="text-xs text-gray-500">شريك DSH</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">ش</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2026 BTHWANI. جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                الدعم الفني
              </a>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                الشروط والأحكام
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
