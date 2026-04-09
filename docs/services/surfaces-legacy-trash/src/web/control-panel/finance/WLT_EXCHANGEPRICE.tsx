'use client';

/**
 * CONTROL PANEL — أسعار الصرف والذهب ونصاب الزكاة
 * خدمة معلوماتية قراءة فقط؛ غير مربوطة بكود الأعمال أو عمليات WLT. للعرض فقط.
 * API: GET /api/exchangeprice
 */

import React, { useState, useEffect, useCallback } from 'react';
import { getApiConfig } from '../../../config';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface CurrencyRate {
  code: string;
  buy: number;
  sell: number;
}

interface GoldPrice {
  karat: number;
  price: number;
}

interface ExchangePriceData {
  updated_at: string;
  currencies: CurrencyRate[];
  gold: GoldPrice[];
  zakat: { nisab: number; rate: number };
}

function buildExchangepriceUrl(baseURL: string): string {
  if (baseURL.endsWith('/api')) return `${baseURL}/exchangeprice`;
  return `${baseURL.replace(/\/$/, '')}/api/exchangeprice`;
}

export default function WLT_EXCHANGEPRICE() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExchangePriceData | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { baseURL } = getApiConfig({ isWeb: true });
      const url = buildExchangepriceUrl(baseURL);
      const res = await rawFetch(url, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ExchangePriceData;
      if (!json.currencies || !json.gold || !json.zakat) throw new Error('Invalid response');
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('web.control panel.finance.WLT_EXCHANGEPRICE.errorLoadMessage'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !data) {
    return (
      <div className="w-full max-w-3xl p-6" style={{ color: semanticRoles.text }}>
        <p>جاري تحميل أسعار الصرف...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="w-full max-w-3xl p-6" style={{ color: semanticRoles.text }}>
        <p style={{ color: semanticRoles.error }}>{error}</p>
        <button
          type="button"
          onClick={load}
          className="mt-4 px-4 py-2 rounded"
          style={{ backgroundColor: semanticRoles.primary, color: semanticRoles.onPrimary }}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!data) return null;

  const updatedAt = data.updated_at ? new Date(data.updated_at).toLocaleString('ar-YE') : '—';

  return (
    <div className="w-full max-w-3xl" style={{ color: semanticRoles.text }}>
      <div className="mb-8 pb-6 border-b" style={{ borderColor: semanticRoles.border }}>
        <h1 className="text-[28px] font-bold mb-1">أسعار الصرف والذهب</h1>
        <p className="text-[15px]" style={{ color: semanticRoles.textMuted }}>
          آخر تحديث: {updatedAt}
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">العملات</h2>
        <div className="space-y-2">
          {data.currencies.map((c) => (
            <div
              key={c.code}
              className="flex justify-between items-center py-3 px-4 rounded-lg"
              style={{ backgroundColor: semanticRoles.surface }}
            >
              <span className="font-semibold">{c.code}</span>
              <span>شراء: {c.buy} ريال — بيع: {c.sell} ريال</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">الذهب</h2>
        <div className="space-y-2">
          {data.gold.map((g) => (
            <div
              key={g.karat}
              className="flex justify-between items-center py-3 px-4 rounded-lg"
              style={{ backgroundColor: semanticRoles.surface }}
            >
              <span>عيار {g.karat}</span>
              <span>{g.price.toLocaleString('ar-YE')} ريال</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">نصاب الزكاة</h2>
        <div className="space-y-2">
          <div
            className="flex justify-between items-center py-3 px-4 rounded-lg"
            style={{ backgroundColor: semanticRoles.surface }}
          >
            <span>النصاب (85 غرام ذهب عيار 24)</span>
            <span>{data.zakat.nisab.toLocaleString('ar-YE')} ريال</span>
          </div>
          <div
            className="flex justify-between items-center py-3 px-4 rounded-lg"
            style={{ backgroundColor: semanticRoles.surface }}
          >
            <span>معدل الزكاة</span>
            <span>{data.zakat.rate}%</span>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={load}
        className="px-4 py-2 rounded-lg"
        style={{ backgroundColor: semanticRoles.primary, color: semanticRoles.onPrimary }}
      >
        تحديث
      </button>
    </div>
  );
}

