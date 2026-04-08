// Utility to build web root metadata (title, lang, dir, etc.)
export function buildWebRootMetadata({ appName, lang = 'ar', dir = 'rtl' }: { appName?: string; lang?: string; dir?: 'ltr' | 'rtl'; }) {
  return {
    title: appName ? `${appName} | Bthwani` : 'Bthwani',
    appName,
    lang,
    dir,
  };
}
