import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'لوحة التحكم | BThwani',
  description: 'Unified operational command center for BThwani platform.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'BThwani Control Panel',
    description: 'Unified operational command center.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import type { ReactNode } from 'react';
import { WebRootLayout } from '@bthwani/ui-kit/next';
import { ControlPanelAppearanceProvider } from '../../shell/appearance';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <WebRootLayout appName="control-panel" language="ar" themeMode="light">
      <ControlPanelAppearanceProvider>
        <div className={inter.className} style={{ height: '100%' }}>
          {children}
        </div>
      </ControlPanelAppearanceProvider>
    </WebRootLayout>
  );
}
