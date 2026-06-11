'use client';

import React from 'react';
import { Box, Text,
  radius,
} from '@bthwani/ui-kit';
import { buildWltFinancialCenter } from '../selectors/buildFinancialCenter';
import {
  buildWltRuntimeFinancialCenter,
  loadWltDshFinanceRuntimeReadModel,
  type WltDshFinanceRuntimeResult,
} from '../adapters/wltDshFinanceRuntime.adapter';
import { getFallbackControlPanelFinancePreview } from '../adapters/wltDshFinanceFallback.adapter';
import { LedgerEntriesTable } from '../components/LedgerEntriesTable';
import { TrialBalancePanel } from '../components/TrialBalancePanel';

export function LedgerScreen({ hubHref: _hubHref, subGroup: _subGroup }: { hubHref: string; subGroup?: string }) {
  const preview = React.useMemo(() => getFallbackControlPanelFinancePreview(), []);
  const businessDate = new Date().toISOString().split('T')[0]!;
  const [runtimeFinance, setRuntimeFinance] = React.useState<WltDshFinanceRuntimeResult | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    void loadWltDshFinanceRuntimeReadModel().then((result) => {
      if (!cancelled) setRuntimeFinance(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const center = React.useMemo(() => {
    if (runtimeFinance?.state === 'runtime') {
      return buildWltRuntimeFinancialCenter(businessDate, runtimeFinance.data);
    }
    return buildWltFinancialCenter(businessDate, preview.allRecords);
  }, [preview, businessDate, runtimeFinance]);

  const [activeView, setActiveView] = React.useState<'journal' | 'trial-balance'>('journal');

  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%' }}>
      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={1}>
        <Text role="titleMd" weight="bold">دفتر الأستاذ</Text>
        <Text role="bodySm" tone="soft">
          قيود اليومية + ميزان المراجعة. {runtimeFinance?.state === 'runtime' ? 'مرتبطة بـ WLT runtime read model.' : 'Fallback preview عند تعذر WLT runtime.'}
        </Text>
        <Text role="caption" tone="muted">
          {runtimeFinance?.state === 'runtime'
            ? `WLT runtime · ${runtimeFinance.data.baseUrl} · ${businessDate}`
            : `preview fallback · ${businessDate}`}
        </Text>
      </Box>

      {/* Sub-view tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        {(['journal', 'trial-balance'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setActiveView(v)}
            style={{
              padding: '6px 14px', borderRadius: radius.xs, border: '1px solid var(--bthwani-control-panel-border)',
              background: activeView === v ? 'var(--bthwani-brand-primary)' : 'var(--bthwani-control-panel-surface)',
              color: activeView === v ? 'var(--bthwani-text-inverse)' : 'var(--bthwani-control-panel-text)',
              fontWeight: 700, fontSize: 12, cursor: 'pointer',
            }}
          >
            {v === 'journal' ? 'قيود اليومية' : 'ميزان المراجعة'}
          </button>
        ))}
      </div>

      {activeView === 'journal' ? (
        <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line">
          <LedgerEntriesTable entries={center.allEntries} pageSize={12} />
        </Box>
      ) : (
        <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line">
          <TrialBalancePanel entries={center.allEntries} businessDate={businessDate} />
        </Box>
      )}
    </Box>
  );
}
