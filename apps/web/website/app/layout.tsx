export const metadata = {
  title: 'BThwani Website',
  description: 'Unified Next.js web surface',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, fontFamily: 'Inter, system-ui, sans-serif', background: '#0B1220', color: '#FFFFFF' }}>
        {children}
      </body>
    </html>
  );
}
