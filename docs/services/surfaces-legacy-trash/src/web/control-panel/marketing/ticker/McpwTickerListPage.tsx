'use client';

import { useCallback, useMemo, useState } from 'react';
import { useI18n, semanticRoles } from '@bthwani/ui-kit';
import { SectionScreenTemplate } from '../../components/SectionScreenTemplate';
import type { DshTickerAdmin } from './types';
import { getTickers, updateTicker, removeTicker } from './mockTickerStore';
import { AlertTriangle, Bell, CheckCircle2, Info, Plus, Trash2, Zap } from 'lucide-react';

function severityIcon(severity: DshTickerAdmin['severity']) {
  switch (severity) {
    case 'success':
      return CheckCircle2;
    case 'warning':
      return AlertTriangle;
    case 'danger':
      return AlertTriangle;
    case 'info':
    default:
      return Info;
  }
}

export function McpwTickerListPage() {
  const { t } = useI18n();
  const [tickers, setTickers] = useState<DshTickerAdmin[]>(() => getTickers());

  const refresh = useCallback(() => {
    setTickers(getTickers());
  }, []);

  const handleToggleStatus = useCallback((ticker: DshTickerAdmin) => {
    const next: DshTickerAdmin = { ...ticker, status: ticker.status === 'published' ? 'draft' : 'published' };
    updateTicker(next);
    refresh();
  }, [refresh]);

  const handleDelete = useCallback((ticker: DshTickerAdmin) => {
    removeTicker(ticker.id);
    refresh();
  }, [refresh]);

  const { total, published, drafts } = useMemo(() => {
    const total = tickers.length;
    const published = tickers.filter(t => t.status === 'published').length;
    const drafts = total - published;
    return { total, published, drafts };
  }, [tickers]);

  return (
    <SectionScreenTemplate
      title={t('marketing.ticker_title')}
      subtitle={t('marketing.ticker_subtitle')}
      icon={Bell}
      primaryAction={
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          style={{ backgroundColor: semanticRoles.accent, color: '#fff' }}
        >
          <Plus className="h-4 w-4" />
          {t('marketing.ticker_add')}
        </button>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border p-4" style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}>
            <p className="text-xs" style={{ color: semanticRoles.textSecondary }}>{t('marketing.ticker_kpi_total')}</p>
            <p className="mt-2 text-2xl font-semibold" style={{ color: semanticRoles.text }}>{total}</p>
          </div>
          <div className="rounded-xl border p-4" style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}>
            <p className="text-xs" style={{ color: semanticRoles.textSecondary }}>{t('marketing.ticker_kpi_published')}</p>
            <p className="mt-2 text-2xl font-semibold" style={{ color: semanticRoles.text }}>{published}</p>
          </div>
          <div className="rounded-xl border p-4" style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}>
            <p className="text-xs" style={{ color: semanticRoles.textSecondary }}>{t('marketing.ticker_kpi_draft')}</p>
            <p className="mt-2 text-2xl font-semibold" style={{ color: semanticRoles.text }}>{drafts}</p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {tickers.map(ticker => {
            const Icon = severityIcon(ticker.severity);
            const isPublished = ticker.status === 'published';
            return (
              <article
                key={ticker.id}
                className="flex flex-col justify-between rounded-2xl border p-4"
                style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: semanticRoles.surfaceSubtle,
                      color: semanticRoles.text,
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className="rounded-full px-2 py-0.5"
                        style={{
                          backgroundColor: semanticRoles.surfaceSubtle,
                          color: semanticRoles.textSecondary,
                        }}
                      >
                        {ticker.kind === 'platform'
                          ? t('marketing.ticker_kind_platform')
                          : ticker.kind === 'order'
                          ? t('marketing.ticker_kind_order')
                          : t('marketing.ticker_kind_promo')}
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5"
                        style={{
                          backgroundColor: isPublished ? (semanticRoles.stateSuccess?.background ?? 'rgba(34,197,94,0.15)') : semanticRoles.surfaceSubtle,
                          color: isPublished ? (semanticRoles.stateSuccess?.text ?? '#16a34a') : semanticRoles.textSecondary,
                        }}
                      >
                        {isPublished ? t('marketing.banners_status_published') : t('marketing.banners_status_draft')}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: semanticRoles.text }}>
                      {ticker.message}
                    </p>
                    {(ticker.starts_at || ticker.ends_at) && (
                      <p className="text-[11px]" style={{ color: semanticRoles.textSecondary }}>
                        <Zap className="me-1 inline h-3 w-3" />
                        {ticker.starts_at ? new Date(ticker.starts_at).toLocaleString() : '—'} →{' '}
                        {ticker.ends_at ? new Date(ticker.ends_at).toLocaleString() : '—'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(ticker)}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white"
                    style={{ backgroundColor: isPublished ? '#64748B' : semanticRoles.accent }}
                  >
                    {isPublished ? t('marketing.ticker_action_pause') : t('marketing.ticker_action_publish')}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium"
                    style={{ borderColor: semanticRoles.border, color: semanticRoles.text, backgroundColor: semanticRoles.surface }}
                  >
                    {t('marketing.ticker_action_edit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(ticker)}
                    className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium"
                    style={{ borderColor: semanticRoles.stateError?.text ?? '#EF4444', color: semanticRoles.stateError?.text ?? '#EF4444' }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t('marketing.banners_delete')}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </SectionScreenTemplate>
  );
}

