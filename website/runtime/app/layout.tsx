import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'BThwani | الحلول اللوجستية المتكاملة',
  description: 'منصة BThwani توفر حلولاً لوجستية متكاملة لخدمة الشركاء والكباتن في المنطقة.',
  keywords: 'BThwani, لوجستيات, توصيل, شركاء, كباتن',
  openGraph: {
    title: 'BThwani - الحلول اللوجستية المتكاملة',
    description: 'منصة BThwani لخدمة الشركاء والكباتن.',
    url: 'https://bthwani.com',
    siteName: 'BThwani',
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BThwani',
    description: 'الحلول اللوجستية المتكاملة',
  },
};

import type { ReactNode } from 'react';
import { WebRootLayout } from '@bthwani/ui-kit/next';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <WebRootLayout appName="website" language="ar" themeMode="light">
      <div className={inter.className}>
        {children}
      </div>
    </WebRootLayout>
  );
}
