export const metadata = {
  title: 'BThwani Website',
  description: 'Unified Next.js web surface',
};

import type { ReactNode } from 'react';
import { BthWebRootLayout } from '@bthwani/ui-kit/web';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <BthWebRootLayout appName="website" language="ar" themeMode="light">
      {children}
    </BthWebRootLayout>
  );
}
