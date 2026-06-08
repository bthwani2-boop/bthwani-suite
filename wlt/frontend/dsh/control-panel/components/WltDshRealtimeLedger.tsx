'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { resolveWltDshApiBaseUrl, type WltLedgerEntry } from '../../contracts';
import { loadWltDshFinanceRuntimeReadModel, type WltDshFinanceRuntimeResult } from '../adapters/wltDshFinanceRuntime.adapter';
import { formatWltYer } from '../models/dshFinance.types';

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
  const [entries, setEntries] = React.useState<WltLedgerEntry[]>([]);
  const [wsStatus, setWsStatus] = React.useState<'connected' | 'reconnecting' | 'disconnected'>('disconnected');
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [runtimeFinance, setRuntimeFinance] = React.useState<WltDshFinanceRuntimeResult | null>(null);
  const [highlightedId, setHighlightedId] = React.useState<string | null>(null);

  // Load initial entries from database read model
  const loadInitialData = React.useCallback(async () => {
    try {
      const result = await loadWltDshFinanceRuntimeReadModel();
      setRuntimeFinance(result);
      if (result.state === 'runtime') {
        // Sort entries by created_at descending
        const sorted = [...result.data.ledgerEntries].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setEntries(sorted);
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

  // Establish WebSocket connection
  React.useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let active = true;

    const connectWs = () => {
      if (!active) return;
      const apiBase = resolveWltDshApiBaseUrl();
      const wsUrl = apiBase.replace(/^http/, 'ws') + '/payment/sessions/ledger/ws';

      setWsStatus('reconnecting');
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        if (!active) return;
        setWsStatus('connected');
        setErrorMsg(null);
      };

      ws.onmessage = (event) => {
        if (!active) return;
        try {
          const payload = JSON.parse(event.data);
          if (payload && payload.ledger_entry) {
            const newEntry: WltLedgerEntry = payload.ledger_entry;
            setEntries((prev) => {
              if (prev.some((e) => e.id === newEntry.id)) return prev;
              const next = [newEntry, ...prev];
              setHighlightedId(newEntry.id);
              setTimeout(() => setHighlightedId(null), 3000);
              return next;
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

    // Fallback polling for live updates every 7 seconds
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

  // Simulate a live transaction for verification/testing
  const simulateLiveEntry = () => {
    const id = `SIM-TX-${Date.now()}`;
    const simEntry: WltLedgerEntry = {
      id,
      wallet_id: 'WLT-WAL-0099',
      subject: Math.random() > 0.5 ? 'captain-demo' : 'partner-demo',
      transaction_type: Math.random() > 0.4 ? 'CREDIT' : 'DEBIT',
      amount: Math.floor(Math.random() * 15000) + 1000,
      currency: 'YER',
      reference_type: 'payment_session',
      reference_id: `REF-${Math.floor(Math.random() * 90000) + 10000}`,
      description: 'حركة مالية فورية محاكاة للتحقق E2E',
      status: 'COMPLETED',
      created_at: new Date().toISOString(),
    };

    setEntries((prev) => [simEntry, ...prev]);
    setHighlightedId(id);
    setTimeout(() => setHighlightedId(null), 3000);
  };

  const runtimeData = runtimeFinance?.state === 'runtime' ? runtimeFinance.data : null;

  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%', padding: '16px' }}>
      {/* Header & Status Indicator */}
      <Box padding={4} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Text role="titleMd" style={{ fontWeight: 800 }}>دفتر الأستاذ العام اللحظي (Real-time Ledger)</Text>
            <Text role="bodySm" tone="soft">
              {runtimeData
                ? `مرتبط بالمنفذ الحي لخدمة WLT: ${runtimeData.baseUrl}`
                : 'معاينة حالة دفتر الأستاذ دون اتصال بالخدمة الخلفية.'}
            </Text>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 12,
                color: wsStatus === 'connected' ? 'var(--bth-success-text)' : 'var(--bth-warning-text)',
                background: wsStatus === 'connected' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(241, 196, 15, 0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  background: wsStatus === 'connected' ? 'var(--bth-success-text)' : 'var(--bth-warning-text)',
                  animation: wsStatus === 'connected' ? 'pulse 2s infinite' : 'none',
                }}
              />
              {wsStatus === 'connected' ? 'متصل (WebSocket)' : 'استعادة الاتصال (سحب دوري)'}
            </span>
          </div>
        </div>
      </Box>

      {/* Interactive Controls & KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text role="caption" tone="muted">إجمالي القيود اللحظية</Text>
            <Text role="titleLg" style={{ fontWeight: 800, color: 'var(--bthwani-brand-primary)' }}>{entries.length}</Text>
          </div>
        </Box>
        <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            onClick={simulateLiveEntry}
            style={{
              background: 'linear-gradient(135deg, var(--bthwani-brand-primary) 0%, var(--bthwani-brand-secondary, var(--bthwani-brand-primary)) 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: 12,
              boxShadow: '0 4px 12px rgba(26, 188, 156, 0.2)',
              transition: 'all 0.2s ease',
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

      {/* Real-time Ledger entries table */}
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
                  const isCredit = entry.transaction_type === 'CREDIT';

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
                          color: isCredit ? 'var(--bth-success-text)' : 'var(--bth-danger-text)',
                          fontWeight: 700,
                          fontSize: 10,
                          background: isCredit ? 'color-mix(in srgb, var(--bth-success-text) 10%, transparent)' : 'color-mix(in srgb, var(--bth-danger-text) 10%, transparent)',
                          padding: '2px 8px',
                          borderRadius: 6
                        }}>
                          {isCredit ? 'إيداع / دائن' : 'سحب / مدين'}
                        </span>
                      </td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                        {formatWltYer(Math.round(entry.amount * 100))}
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <code style={{ fontSize: 9, background: 'rgba(0,0,0,0.04)', padding: '2px 6px', borderRadius: 3 }}>
                          {entry.reference_id || '—'}
                        </code>
                      </td>
                      <td style={{ padding: '8px 12px', color: 'var(--bthwani-control-panel-text-muted)' }}>
                        {new Date(entry.created_at).toLocaleString('ar-YE', { hour12: false })}
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: STATUS_COLOR[entry.status] ?? 'inherit',
                          background: `color-mix(in srgb, ${STATUS_COLOR[entry.status] ?? 'transparent'} 12%, transparent)`,
                          padding: '2px 6px',
                          borderRadius: 4
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
