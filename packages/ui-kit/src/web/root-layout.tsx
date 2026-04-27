import Script from 'next/script';
import { type ReactNode } from 'react';
import { RootProviders, type RootProvidersProps } from '../providers';
import { buildWebThemeStyleSheet, directionConfig, resolveDirectionFromLanguage, type ThemeMode } from '../foundation';

const webRootBodyCss = `
html {
  color-scheme: light;
}

/* compatibility: accept both old and new root class names so styles continue to apply */
body.bth-web-root-body, body.ui-web-root-body {
  margin: 0;
  min-height: 100vh;
  background: var(--bth-background);
  color: var(--bth-text);
  font-family: var(--bth-font-family-latin), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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

export function WebThemeStyle() {
  // Target both the new `data-ui-root` and the legacy `data-bth-root` during staged migration.
  return <style>{buildWebThemeStyleSheet('[data-ui-root="true"], [data-bth-root="true"]')}</style>;
}

export type WebRootLayoutProps = RootProvidersProps & {
  children: ReactNode;
  appName?: string;
};

export function buildWebRootMetadata({ appName, lang = 'ar', dir = 'rtl' }: { appName?: string; lang?: string; dir?: 'ltr' | 'rtl'; }) {
  return {
    title: appName ? appName : 'Control Panel',
    appName,
    lang,
    dir,
  };
}

export function WebRootBody({
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
      className="ui-web-root-body"
      data-ui-app={appName}
      data-ui-root="true"
      data-ui-theme={themeMode}
    >
      {children}
    </body>
  );
}

export function WebDocumentShell({
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
        <script
          id="language-bootstrap"
          dangerouslySetInnerHTML={{ __html: buildStoredLanguageBootstrapScript() }}
        />
        <style>{webRootBodyCss}</style>
        <WebThemeStyle />
      </head>
      {children}
    </html>
  );
}

export function WebRootLayout({ children, appName, ...rootProps }: WebRootLayoutProps) {
  const webRootMetadata = buildWebRootMetadata({
    appName,
    lang: rootProps.language,
    dir: resolveDirectionFromLanguage(rootProps.language),
  });

  return (
    <WebDocumentShell lang={webRootMetadata.lang} dir={webRootMetadata.dir}>
      <WebRootBody appName={webRootMetadata.appName} themeMode={rootProps.themeMode}>
        <RootProviders {...rootProps}>{children}</RootProviders>
      </WebRootBody>
    </WebDocumentShell>
  );
}
