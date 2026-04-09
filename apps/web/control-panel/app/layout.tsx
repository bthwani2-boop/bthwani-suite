export const metadata = {
  title: 'BThwani Control Panel',
  description: 'Unified Next.js web surface',
};

import type { ReactNode } from 'react';
import { BthWebRootLayout } from '@bthwani/ui-kit/web';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <BthWebRootLayout appName="control-panel" language="ar" themeMode="light">
      {children}
    </BthWebRootLayout>
  );
}
