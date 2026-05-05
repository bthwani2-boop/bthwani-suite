// NOTE (example-only): UI text and layout placeholders may include governance tokens for documentation; these are not runtime secrets. See kdt/merge-run/.../proposed/PROTECTED_TOKENS_ALLOWLIST.md.
export const metadata = {
  title: 'لوحة التحكم',
  description: 'Unified operating room',
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
