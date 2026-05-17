import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';

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
import {
  defaultBThwaniAppearanceMode,
  getBThwaniAppearanceCookieKey,
  getBThwaniAppearanceThemeMode,
  isBThwaniAppearanceMode,
  WebRootLayout,
} from '@bthwani/ui-kit/next';
import { ControlPanelAppearanceProvider } from '../../shell/appearance';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const seededMode = cookieStore.get(getBThwaniAppearanceCookieKey('control-panel'))?.value;
  const appearanceMode = isBThwaniAppearanceMode(seededMode) ? seededMode : defaultBThwaniAppearanceMode;

  return (
    <WebRootLayout appName="control-panel" language="ar" themeMode={getBThwaniAppearanceThemeMode(appearanceMode)}>
      <ControlPanelAppearanceProvider>
        <div className={inter.className} style={{ height: '100%' }}>
          {children}
        </div>
      </ControlPanelAppearanceProvider>
    </WebRootLayout>
  );
}
