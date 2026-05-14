import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'BThwani WebApp',
  description: 'Your unified logistics dashboard and service portal.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BThwani',
  },
};

export const viewport: Viewport = {
  themeColor: '#FF500D',
  width: 'device-width',
  initialScale: 1,
};

import type { ReactNode } from 'react';
import { WebRootLayout } from '@bthwani/ui-kit/next';
import { WebAppAppearanceProvider } from '../../shell/appearance';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <WebRootLayout appName="webapp" language="ar" themeMode="light">
      <WebAppAppearanceProvider>
        <div className={inter.className}>
          {children}
        </div>
      </WebAppAppearanceProvider>
    </WebRootLayout>
  );
}
