import '../../../../tamagui.generated.css';
export const metadata = {
  title: 'BThwani Control Panel',
  description: 'Unified Next.js web surface',
};

import type { ReactNode } from 'react';
import { WebRootLayout } from '@bthwani/ui-kit/next';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <WebRootLayout appName="control-panel" language="ar" themeMode="light">
      {children}
    </WebRootLayout>
  );
}
