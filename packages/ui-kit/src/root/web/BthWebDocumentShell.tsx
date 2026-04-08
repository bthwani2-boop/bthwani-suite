// Web document shell for html/body, lang, dir, etc.
import { ReactNode } from 'react';

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
      {children}
    </html>
  );
}
