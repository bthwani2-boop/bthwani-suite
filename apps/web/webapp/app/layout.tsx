export const metadata = {
  title: 'BThwani WebApp',
  description: 'Unified Next.js web surface',
};

import type { ReactNode } from 'react';
import { BthWebRootLayout } from '@bthwani/ui-kit/web';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <BthWebRootLayout appName="webapp" language="ar" themeMode="light">
      {children}
    </BthWebRootLayout>
  );
}
