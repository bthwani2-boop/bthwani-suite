'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { getWltControlPanelFinancePreview } from '../financeContracts';
import { buildWltFinancialCenter } from '../selectors/buildFinancialCenter';
import { LedgerEntriesTable } from '../components/LedgerEntriesTable';
import { TrialBalancePanel } from '../components/TrialBalancePanel';

export function LedgerScreen({ hubHref: _hubHref, subGroup: _subGroup }: { hubHref: string; subGroup?: string }) {
  const preview = React.useMemo(() => getWltControlPanelFinancePreview(), []);
  const businessDate = new Date().toISOString().split('T')[0]!;
  const center = React.useMemo(() => buildWltFinancialCenter(businessDate, preview.allRecords), [preview, businessDate]);

  const [activeView, setActiveView] = React.useState<'journal' | 'trial-balance'>('journal');

  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%' }}>
      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={1}>
        <Text role="titleMd" style={{ fontWeight: 700 }}>دفتر الأستاذ</Text>
        <Text role="bodySm" tone="soft">
          قيود اليومية + ميزان المراجعة. معاينة تشغيلية — يتطلب ربط مالي للترحيل الفعلي.
        </Text>
        <Text role="caption" tone="muted">
          {`معاينة تشغيلية · ${businessDate}`}
        </Text>
      </Box>

      {/* Sub-view tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        {(['journal', 'trial-balance'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setActiveView(v)}
            style={{
              padding: '6px 14px', borderRadius: 6, border: '1px solid var(--bthwani-control-panel-border)',
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
