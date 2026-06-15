'use client';

import React from 'react';
import { Box, Text,
  radius,
} from '@bthwani/ui-kit';
import {
  loadWltDshFinanceRuntimeReadModel,
  type WltDshFinanceRuntimeResult,
  resolveWltDshRealtimeLedgerWsUrl,
  mapToRealtimeLedgerDisplayRow,
  extractSortedDisplayRows,
  buildSimulatedLedgerDisplayRow,
  type WltRealtimeLedgerDisplayRow,
} from '../../shared';

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: 'مرحّل',
  posted: 'مرحّل',
  PENDING: 'قيد المراجعة',
  pending: 'قيد المراجعة',
  FAILED: 'حظر / فشل',
  failed: 'حظر / فشل',
};

const STATUS_COLOR: Record<string, string> = {
  COMPLETED: 'var(--bth-success-text)',
  posted: 'var(--bth-success-text)',
  PENDING: 'var(--bth-warning-text)',
  pending: 'var(--bth-warning-text)',
  FAILED: 'var(--bth-danger-text)',
  failed: 'var(--bth-danger-text)',
};

export function WltDshRealtimeLedger() {
  const [entries, setEntries] = React.useState<WltRealtimeLedgerDisplayRow[]>([]);
  const [wsStatus, setWsStatus] = React.useState<'connected' | 'reconnecting' | 'disconnected'>('disconnected');
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [runtimeFinance, setRuntimeFinance] = React.useState<WltDshFinanceRuntimeResult | null>(null);
  const [highlightedId, setHighlightedId] = React.useState<string | null>(null);

  const loadInitialData = React.useCallback(async () => {
    try {
      const result = await loadWltDshFinanceRuntimeReadModel();
      setRuntimeFinance(result);
      if (result.state === 'runtime') {
        setEntries(extractSortedDisplayRows(result));
        setErrorMsg(null);
      } else {
        setErrorMsg(result.error);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'failed_to_load_ledger');
    }
  }, []);

  React.useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  React.useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let active = true;

    const connectWs = () => {
      if (!active) return;
      setWsStatus('reconnecting');
      ws = new WebSocket(resolveWltDshRealtimeLedgerWsUrl());

      ws.onopen = () => {
        if (!active) return;
        setWsStatus('connected');
        setErrorMsg(null);
      };

      ws.onmessage = (event) => {
        if (!active) return;
        try {
          const payload = JSON.parse(event.data);
          if (payload?.ledger_entry) {
            const displayRow = mapToRealtimeLedgerDisplayRow(payload.ledger_entry);
            setEntries((prev) => {
              if (prev.some((e) => e.id === displayRow.id)) return prev;
              setHighlightedId(displayRow.id);
              setTimeout(() => setHighlightedId(null), 3000);
              return [displayRow, ...prev];
            });
          }
        } catch (err) {
          console.warn('[WLT-REALTIME-WS] Failed to parse websocket message:', err);
        }
      };

      ws.onerror = () => {
        if (!active) return;
        setWsStatus('disconnected');
      };

      ws.onclose = () => {
        if (!active) return;
        setWsStatus('disconnected');
        reconnectTimeout = setTimeout(connectWs, 5000);
      };
    };

    connectWs();

    const interval = setInterval(() => {
      if (wsStatus !== 'connected') {
        loadInitialData();
      }
    }, 7000);

    return () => {
      active = false;
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      clearInterval(interval);
    };
  }, [loadInitialData, wsStatus]);

  const simulateLiveEntry = () => {
    const displayRow = buildSimulatedLedgerDisplayRow();
    setEntries((prev) => [displayRow, ...prev]);
    setHighlightedId(displayRow.id);
    setTimeout(() => setHighlightedId(null), 3000);
  };

  const runtimeData = runtimeFinance?.state === 'runtime' ? runtimeFinance.data : null;

  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%', padding: '16px' }}>
      <Box padding={4} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Text role="titleMd" weight="black">دفتر الأستاذ العام اللحظي (Real-time Ledger)</Text>
            <Text role="bodySm" tone="soft">
              {runtimeData
                ? `مرتبط بالمنفذ الحي لخدمة WLT: ${runtimeData.baseUrl}`
                : 'معاينة حالة دفتر الأستاذ دون اتصال بالخدمة الخلفية.'}
            </Text>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span
              style={{
                fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 12,
                color: wsStatus === 'connected' ? 'var(--bth-success-text)' : 'var(--bth-warning-text)',
                background: wsStatus === 'connected' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(241, 196, 15, 0.15)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: 3, background: wsStatus === 'connected' ? 'var(--bth-success-text)' : 'var(--bth-warning-text)' }} />
              {wsStatus === 'connected' ? 'متصل (WebSocket)' : 'استعادة الاتصال (سحب دوري)'}
            </span>
          </div>
        </div>
      </Box>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text role="caption" tone="muted">إجمالي القيود اللحظية</Text>
            <Text role="titleLg" weight="black" style={{ color: 'var(--bthwani-brand-primary)' }}>{entries.length}</Text>
          </div>
        </Box>
        <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            onClick={simulateLiveEntry}
            style={{
              background: 'linear-gradient(135deg, var(--bthwani-brand-primary) 0%, var(--bthwani-brand-secondary, var(--bthwani-brand-primary)) 100%)',
              color: 'var(--bthwani-brand-contrast)', border: 'none', borderRadius: 8, padding: '10px 20px',
              fontWeight: 700, cursor: 'pointer', fontSize: 12, boxShadow: '0 4px 12px rgba(26, 188, 156, 0.2)',
            }}
          >
            ⚡ محاكاة قيد لحظي (Simulate Live Entry)
          </button>
        </Box>
      </div>

      {errorMsg && (
        <Box padding={3} background="surfaceInset" radiusToken="lg" style={{ border: '1px solid var(--bth-danger-text)', background: 'rgba(231, 76, 60, 0.1)' }}>
          <Text tone="danger" role="bodySm">{errorMsg}</Text>
        </Box>
      )}

      <Box padding={3} background="surface" radiusToken="lg" border borderTone="line" gap={2}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: 'var(--bthwani-control-panel-surface-raised)', borderBottom: '2px solid var(--bthwani-control-panel-border)' }}>
                {['المعرف', 'الطرف', 'نوع الحركة', 'المبلغ', 'المرجع', 'تاريخ الإنشاء', 'الحالة'].map((h) => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--bthwani-control-panel-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'var(--bthwani-control-panel-text-muted)' }}>
                    لا توجد قيود مالية مسجلة في الجلسة الحالية.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => {
                  const isHighlighted = highlightedId === entry.id;
                  return (
                    <tr
                      key={entry.id}
                      style={{
                        background: isHighlighted ? 'color-mix(in srgb, var(--bth-success-text) 15%, transparent)' : 'transparent',
                        borderBottom: '1px solid var(--bthwani-control-panel-border)',
                        transition: 'background-color 1.5s ease',
                      }}
                    >
                      <td style={{ padding: '8px 12px' }}>
                        <code style={{ fontSize: 10, fontWeight: 700 }}>{entry.id}</code>
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{ fontWeight: 600 }}>{entry.subject}</span>
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{
                          color: entry.isCredit ? 'var(--bth-success-text)' : 'var(--bth-danger-text)',
                          fontWeight: 700, fontSize: 10,
                          background: entry.isCredit ? 'color-mix(in srgb, var(--bth-success-text) 10%, transparent)' : 'color-mix(in srgb, var(--bth-danger-text) 10%, transparent)',
                          padding: '2px 8px', borderRadius: radius.xs,
                        }}>
                          {entry.transactionKindLabel}
                        </span>
                      </td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                        {entry.amountLabel}
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <code style={{ fontSize: 9, background: 'rgba(0,0,0,0.04)', padding: '2px 6px', borderRadius: 3 }}>
                          {entry.referenceId}
                        </code>
                      </td>
                      <td style={{ padding: '8px 12px', color: 'var(--bthwani-control-panel-text-muted)' }}>
                        {entry.createdAtDisplay}
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{
                          fontSize: 9, fontWeight: 700,
                          color: STATUS_COLOR[entry.status] ?? 'inherit',
                          background: `color-mix(in srgb, ${STATUS_COLOR[entry.status] ?? 'transparent'} 12%, transparent)`,
                          padding: '2px 6px', borderRadius: 4,
                        }}>
                          {STATUS_LABELS[entry.status] ?? entry.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Box>
    </Box>
  );
}

export default WltDshRealtimeLedger;
