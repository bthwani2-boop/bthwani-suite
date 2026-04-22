import React, { type ReactNode } from 'react';

export type BthWebPageFrameProps = {
  title?: string;
  children: ReactNode;
};

export function BthWebPageFrame({ title, children }: BthWebPageFrameProps) {
  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh', padding: 24 }}>
      {title ? <h1 style={{ color: '#0f172a', margin: '0 0 16px' }}>{title}</h1> : null}
      {children}
    </main>
  );
}
