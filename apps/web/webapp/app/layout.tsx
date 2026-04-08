
export const metadata = {
  title: 'BThwani WebApp',
  description: 'Unified Next.js web surface',
};

import { UiKitProvider, ThemeProvider, DirectionProvider } from 'packages/ui-kit/src/providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, fontFamily: 'Inter, system-ui, sans-serif', background: '#0B1220', color: '#FFFFFF' }}>
        <UiKitProvider>
          <ThemeProvider>
            <DirectionProvider>
              {children}
            </DirectionProvider>
          </ThemeProvider>
        </UiKitProvider>
      </body>
    </html>
  );
}
