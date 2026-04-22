// Web document shell for html/body, lang, dir, etc.
import Script from 'next/script';
import { ReactNode } from 'react';
import { directionConfig, resolveDirectionFromLanguage } from './foundation';
import { BthWebThemeStyle } from './BthWebThemeStyle';

function buildStoredLanguageBootstrapScript() {
  return `
(function () {
  try {
    var key = '${directionConfig.languageStorageKey}';
    var stored = window.localStorage ? window.localStorage.getItem(key) : null;
    if (stored !== 'ar' && stored !== 'en') {
      return;
    }
    document.documentElement.lang = stored;
    document.documentElement.dir = stored === 'ar' ? 'rtl' : 'ltr';
  } catch (error) {}
})();
`.trim();
}

export function BthWebDocumentShell({
  children,
  lang = directionConfig.defaultLanguage,
  dir = resolveDirectionFromLanguage(directionConfig.defaultLanguage),
}: {
  children: ReactNode;
  lang?: string;
  dir?: 'ltr' | 'rtl';
}) {
  return (
    <html suppressHydrationWarning lang={lang} dir={dir}>
      <head>
        <Script
          id="bth-language-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: buildStoredLanguageBootstrapScript() }}
        />
        <BthWebThemeStyle />
      </head>
      {children}
    </html>
  );
}