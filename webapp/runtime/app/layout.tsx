import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';

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
import {
  defaultBThwaniAppearanceMode,
  getBThwaniAppearanceCookieKey,
  getBThwaniAppearanceThemeMode,
  isBThwaniAppearanceMode,
  WebRootLayout,
} from '@bthwani/ui-kit/next';
import { WebAppAppearanceProvider } from '../../shell/appearance';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const seededMode = cookieStore.get(getBThwaniAppearanceCookieKey('webapp'))?.value;
  const appearanceMode = isBThwaniAppearanceMode(seededMode) ? seededMode : defaultBThwaniAppearanceMode;

  return (
    <WebRootLayout appName="webapp" language="ar" themeMode={getBThwaniAppearanceThemeMode(appearanceMode)}>
      <WebAppAppearanceProvider>
        <div className={inter.className}>
          {children}
        </div>
      </WebAppAppearanceProvider>
    </WebRootLayout>
  );
}
