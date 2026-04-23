import Script from 'next/script';
import { type ReactNode } from 'react';
import { BthRootProviders, type BthRootProvidersProps } from '../providers';
import { buildBthWebThemeStyleSheet, directionConfig, resolveDirectionFromLanguage, type ThemeMode } from '../foundation';

const webRootBodyCss = `
html {
  color-scheme: light;
}

body.bth-web-root-body {
  margin: 0;
  min-height: 100vh;
  background: #f8fafc;
  color: #0f172a;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
`;

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

export function BthWebThemeStyle() {
  return <style>{buildBthWebThemeStyleSheet()}</style>;
}

export type BthWebRootLayoutProps = BthRootProvidersProps & {
  children: ReactNode;
  appName?: string;
};

export function buildWebRootMetadata({ appName, lang = 'ar', dir = 'rtl' }: { appName?: string; lang?: string; dir?: 'ltr' | 'rtl'; }) {
  return {
    title: appName ? `${appName} | Bthwani` : 'Bthwani',
    appName,
    lang,
    dir,
  };
}

export function BthWebRootBody({
  children,
  appName,
  themeMode = 'light',
}: {
  children: ReactNode;
  appName?: string;
  themeMode?: ThemeMode;
}) {
  return (
    <body
      className="bth-web-root-body"
      data-bth-app={appName}
      data-bth-root="true"
      data-bth-theme={themeMode}
    >
      {children}
    </body>
  );
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
        <style>{webRootBodyCss}</style>
        <BthWebThemeStyle />
      </head>
      {children}
    </html>
  );
}

export function BthWebRootLayout({ children, appName, ...rootProps }: BthWebRootLayoutProps) {
  const webRootMetadata = buildWebRootMetadata({
    appName,
    lang: rootProps.language,
    dir: resolveDirectionFromLanguage(rootProps.language),
  });

  return (
    <BthWebDocumentShell lang={webRootMetadata.lang} dir={webRootMetadata.dir}>
      <BthWebRootBody appName={webRootMetadata.appName} themeMode={rootProps.themeMode}>
        <BthRootProviders {...rootProps}>{children}</BthRootProviders>
      </BthWebRootBody>
    </BthWebDocumentShell>
  );
}
