import React, { type CSSProperties, type ReactNode } from 'react';

const shellStyle: CSSProperties = {
  background: '#f8fafc',
  color: '#0f172a',
  minHeight: '100vh',
};

const commandStyle: CSSProperties = {
  alignItems: 'center',
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 20,
  display: 'flex',
  gap: 12,
  justifyContent: 'space-between',
  padding: 16,
};

export type BthWebCommandStripFilter = {
  key: string;
  label: string;
};

export type BthWebCommandStripProps = {
  title: string;
  subtitle?: string;
  filters?: ReadonlyArray<BthWebCommandStripFilter>;
};

export function BthWebCommandStrip({ title, subtitle, filters = [] }: BthWebCommandStripProps) {
  return (
    <section style={commandStyle}>
      <div>
        <strong>{title}</strong>
        {subtitle ? <p style={{ color: '#64748b', margin: '4px 0 0' }}>{subtitle}</p> : null}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {filters.map((filter) => (
          <span key={filter.key} style={{ background: '#fff7ed', borderRadius: 999, color: '#f97316', padding: '6px 10px' }}>
            {filter.label}
          </span>
        ))}
      </div>
    </section>
  );
}

export type BthWebCommandCenterFrameProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function BthWebCommandCenterFrame({ title, subtitle, children }: BthWebCommandCenterFrameProps) {
  return (
    <main style={{ ...shellStyle, padding: 24 }}>
      <BthWebCommandStrip title={title} subtitle={subtitle} />
      <div style={{ marginTop: 24 }}>{children}</div>
    </main>
  );
}
