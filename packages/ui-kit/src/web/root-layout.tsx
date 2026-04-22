import React, { type ReactNode } from 'react';

export type BthWebRootLayoutProps = {
  children: ReactNode;
};

export function BthWebRootLayout({ children }: BthWebRootLayoutProps) {
  return <div style={{ background: '#f8fafc', color: '#0f172a', minHeight: '100vh' }}>{children}</div>;
}

export type BthWebDocumentShellProps = {
  children: ReactNode;
  lang?: 'ar' | 'en';
  dir?: 'rtl' | 'ltr';
};

export function BthWebDocumentShell({ children, lang = 'ar', dir = 'rtl' }: BthWebDocumentShellProps) {
  return (
    <html lang={lang} dir={dir}>
      <body>{children}</body>
    </html>
  );
}
