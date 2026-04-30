import '../../../../tamagui.generated.css';
export const metadata = {
  title: 'BThwani Website',
  description: 'Unified Next.js web surface',
};

import type { ReactNode } from 'react';
import { WebRootLayout } from '@bthwani/ui-kit/next';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <WebRootLayout appName="website" language="ar" themeMode="light">
      {children}
    </WebRootLayout>
  );
}
