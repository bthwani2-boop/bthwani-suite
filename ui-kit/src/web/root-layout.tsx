import { type ReactNode } from 'react';
import { RootProviders, type RootProvidersProps } from '../providers';
import { buildWebThemeStyleSheet, directionConfig, resolveDirectionFromLanguage, type ThemeMode } from '../foundation';

const webRootBodyCss = `
html {
  color-scheme: light;
  background: var(--bth-background);
  height: 100%;
  min-height: 100vh;
}

/* compatibility: accept both old and new root class names so styles continue to apply */
body.bth-web-root-body, body.ui-web-root-body, html, #__next {
  margin: 0;
  height: 100%;
  min-height: 100vh;
  background: var(--bth-background);
  color: var(--bth-text);
  font-family: var(--bth-font-family-latin), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow-x: hidden;
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
  const themeStyles = buildWebThemeStyleSheet('[data-ui-root="true"], [data-bth-root="true"]');
  const combined = `${webRootBodyCss}\n${themeStyles}`;

  return (
    <style
      id="ui-kit-theme-root"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: combined }}
    />
  );
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
  const themeStyles = buildWebThemeStyleSheet('[data-ui-root="true"], [data-bth-root="true"]');
  const combinedCss = `${webRootBodyCss}\n${themeStyles}`;

  // NOTE: We use dangerouslySetInnerHTML on the head tag to include the bootstrap script
  // and initial styles. This bypasses React 19's strict check for <script> tags inside
  // components while ensuring the script runs synchronously before the first paint.
  const headHtml = `
    <script id="language-bootstrap">${buildStoredLanguageBootstrapScript()}</script>
    <style id="ui-kit-theme-root">${combinedCss}</style>
  `.trim();

  return (
    <html suppressHydrationWarning lang={lang} dir={dir}>
      <head suppressHydrationWarning dangerouslySetInnerHTML={{ __html: headHtml }} />
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
