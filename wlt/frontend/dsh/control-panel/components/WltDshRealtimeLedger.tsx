'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  loadWltDshFinanceRuntimeReadModel,
  type WltDshFinanceRuntimeResult,
  resolveWltDshRealtimeLedgerWsUrl,
  mapToRealtimeLedgerDisplayRow,
  extractSortedDisplayRows,
  type WltRealtimeLedgerDisplayRow,
  buildSimulatedLedgerDisplayRow,
} from '../../shared';
import styles from './wlt-dsh-realtime-ledger.module.css';


const STATUS_LABELS: Record<string, string> = {
  COMPLETED: 'مرحّل',
  posted: 'مرحّل',
  PENDING: 'قيد المراجعة',
  pending: 'قيد المراجعة',
  FAILED: 'حظر / فشل',
  failed: 'حظر / فشل',
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
    <Box gap={4} className={styles.root}>
      <Box padding={4} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <div className={styles.headerRow}>
          <div>
            <Text role="titleMd" weight="black">دفتر الأستاذ العام اللحظي (Real-time Ledger)</Text>
            <Text role="bodySm" tone="soft">
              {runtimeData
                ? `مرتبط بالمنفذ الحي لخدمة WLT: ${runtimeData.baseUrl}`
                : 'معاينة حالة دفتر الأستاذ دون اتصال بالخدمة الخلفية.'}
            </Text>
          </div>
          <div>
            <span className={styles.wsStatusBadge} data-ws={wsStatus}>
              <span className={styles.wsStatusDot} data-ws={wsStatus} />
              {wsStatus === 'connected' ? 'متصل (WebSocket)' : 'استعادة الاتصال (سحب دوري)'}
            </span>
          </div>
        </div>
      </Box>

      <div className={styles.kpiGrid}>
        <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" className={styles.kpiBoxInner}>
          <div>
            <Text role="caption" tone="muted">إجمالي القيود اللحظية</Text>
            <Text role="titleLg" weight="black" className={styles.kpiValue}>{entries.length}</Text>
          </div>
        </Box>
        <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" className={styles.kpiActionBox}>
          <button type="button" className={styles.simulateBtn} onClick={simulateLiveEntry}>
            ⚡ محاكاة قيد لحظي (Simulate Live Entry)
          </button>
        </Box>
      </div>

      {errorMsg && (
        <Box padding={3} background="surfaceInset" radiusToken="lg" className={styles.errorBox}>
          <Text tone="danger" role="bodySm">{errorMsg}</Text>
        </Box>
      )}

      <Box padding={3} background="surface" radiusToken="lg" border borderTone="line" gap={2}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHead}>
                {['المعرف', 'الطرف', 'نوع الحركة', 'المبلغ', 'المرجع', 'تاريخ الإنشاء', 'الحالة'].map((h) => (
                  <th key={h} className={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.tdEmpty}>
                    لا توجد قيود مالية مسجلة في الجلسة الحالية.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => {
                  const isHighlighted = highlightedId === entry.id;
                  return (
                    <tr
                      key={entry.id}
                      className={`${styles.tableRow}${isHighlighted ? ` ${styles.highlighted}` : ''}`}
                    >
                      <td className={styles.td}>
                        <code className={styles.entryId}>{entry.id}</code>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.entrySubject}>{entry.subject}</span>
                      </td>
                      <td className={styles.td}>
                        <span
                          className={styles.entryKindBadge}
                          data-credit={String(entry.isCredit)}
                        >
                          {entry.transactionKindLabel}
                        </span>
                      </td>
                      <td className={`${styles.td} ${styles.entryAmount}`}>
                        {entry.amountLabel}
                      </td>
                      <td className={styles.td}>
                        <code className={styles.entryRef}>{entry.referenceId}</code>
                      </td>
                      <td className={styles.tdMuted}>
                        {entry.createdAtDisplay}
                      </td>
                      <td className={styles.td}>
                        <span
                          className={styles.entryStatusBadge}
                          data-status={entry.status}
                        >
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
