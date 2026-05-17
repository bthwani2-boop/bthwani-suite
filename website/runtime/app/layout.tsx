import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

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
import {
  defaultBThwaniAppearanceMode,
  getBThwaniAppearanceCookieKey,
  getBThwaniAppearanceThemeMode,
  isBThwaniAppearanceMode,
  WebRootLayout,
} from '@bthwani/ui-kit/next';
import { WebsiteAppearanceProvider } from '../../shell/appearance';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const seededMode = cookieStore.get(getBThwaniAppearanceCookieKey('website'))?.value;
  const appearanceMode = isBThwaniAppearanceMode(seededMode) ? seededMode : defaultBThwaniAppearanceMode;

  return (
    <WebRootLayout appName="website" language="ar" themeMode={getBThwaniAppearanceThemeMode(appearanceMode)}>
      <WebsiteAppearanceProvider>
        <div className={inter.className}>
          {children}
        </div>
      </WebsiteAppearanceProvider>
    </WebRootLayout>
  );
}
