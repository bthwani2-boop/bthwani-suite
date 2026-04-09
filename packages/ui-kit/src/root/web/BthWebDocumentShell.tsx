// Web document shell for html/body, lang, dir, etc.
import { ReactNode } from 'react';
import { BthWebThemeStyle } from './BthWebThemeStyle';

export function BthWebDocumentShell({
  children,
  lang = 'ar',
  dir = 'rtl',
}: {
  children: ReactNode;
  lang?: string;
  dir?: 'ltr' | 'rtl';
}) {
  return (
    <html lang={lang} dir={dir}>
      <head>
        <BthWebThemeStyle />
      </head>
      {children}
    </html>
  );
}
