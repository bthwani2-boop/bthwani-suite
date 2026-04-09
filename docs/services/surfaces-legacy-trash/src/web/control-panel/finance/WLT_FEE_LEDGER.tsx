'use client';

/**
 * CONTROL PANEL — سجل العمولة المحسوبة ومصدر الاستقطاع (PF-3)
 * §ظ WLT_PROVIDER_FEE_AND_ABSORPTION_SPEC
 */

import React, { useState, useEffect, useMemo } from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { getAbsorptionRuleLabels, type AbsorptionRuleCode } from './wltProviderFeeConstants';

interface FeeLedgerRow {
  id: string;
  txId: string;
  amountYer: number;
  providerId: string;
  providerName: string;
  feeComputedYer: number;
  feePct: number;
  absorptionSource: AbsorptionRuleCode;
  createdAt: string;
}

const MOCK_ROWS: FeeLedgerRow[] = [
  { id: '1', txId: 'TXN-2024-001', amountYer: 1000, providerId: 'haisib', providerName: 'حاسب', feeComputedYer: 20, feePct: 2, absorptionSource: 'PLATFORM', createdAt: '2024-02-10 14:30' },
  { id: '2', txId: 'TXN-2024-002', amountYer: 500, providerId: 'jawal', providerName: 'جوالي', feeComputedYer: 7.5, feePct: 1.5, absorptionSource: 'PLATFORM', createdAt: '2024-02-10 12:15' },
  { id: '3', txId: 'TXN-2024-003', amountYer: 200, providerId: 'jeeb', providerName: 'جيب', feeComputedYer: 7, feePct: 1, absorptionSource: 'DELIVERY_COST', createdAt: '2024-02-09 16:00' },
];

export default function WLT_FEE_LEDGER() {
  const { t } = useI18n();
  const absorptionRuleLabels = useMemo(() => getAbsorptionRuleLabels(t), [t]);
  const [rows, setRows] = useState<FeeLedgerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder: في الإنتاج GET /api/wlt/fee-ledger أو من دفتر المعاملات مع فلتر عمولة
    const load = async () => {
      await new Promise((r) => setTimeout(r, 400));
      setRows([...MOCK_ROWS]);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="w-full max-w-5xl">
      <div className="mb-8 pb-6 border-b" style={{ borderColor: semanticRoles.border }}>
        <h1 className="text-[28px] font-bold mb-1" style={{ color: semanticRoles.text }}>
          سجل العمولة
        </h1>
        <p className="text-[15px]" style={{ color: semanticRoles.textMuted }}>
          معاملات شحن/دفع عبر المزودين مع العمولة المحسوبة ومصدر الاستقطاع (للمراجعة والمطابقة).
        </p>
      </div>

      {loading ? (
        <div className="rounded-lg border p-8 text-center" style={{ borderColor: semanticRoles.border, color: semanticRoles.textMuted }}>
          جاري تحميل السجل...
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}>
          <table className="w-full text-right border-collapse">
            <thead>
              <tr style={{ backgroundColor: semanticRoles.surfaceSubtle, borderBottom: `1px solid ${semanticRoles.border}` }}>
                <th className="p-3 text-sm font-semibold" style={{ color: semanticRoles.text }}>رقم المعاملة</th>
                <th className="p-3 text-sm font-semibold" style={{ color: semanticRoles.text }}>المبلغ (ر.ي)</th>
                <th className="p-3 text-sm font-semibold" style={{ color: semanticRoles.text }}>المزود</th>
                <th className="p-3 text-sm font-semibold" style={{ color: semanticRoles.text }}>العمولة (ر.ي)</th>
                <th className="p-3 text-sm font-semibold" style={{ color: semanticRoles.text }}>النسبة %</th>
                <th className="p-3 text-sm font-semibold" style={{ color: semanticRoles.text }}>مصدر الاستقطاع</th>
                <th className="p-3 text-sm font-semibold" style={{ color: semanticRoles.text }}>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ borderBottom: `1px solid ${semanticRoles.border}` }}>
                  <td className="p-3 text-sm font-medium" style={{ color: semanticRoles.text }}>{r.txId}</td>
                  <td className="p-3 text-sm" style={{ color: semanticRoles.text }}>{r.amountYer.toLocaleString()}</td>
                  <td className="p-3 text-sm" style={{ color: semanticRoles.text }}>{r.providerName}</td>
                  <td className="p-3 text-sm" style={{ color: semanticRoles.stateWarning?.icon }}>{r.feeComputedYer.toLocaleString()}</td>
                  <td className="p-3 text-sm" style={{ color: semanticRoles.textMuted }}>{r.feePct}%</td>
                  <td className="p-3 text-sm" style={{ color: semanticRoles.text }}>{absorptionRuleLabels[r.absorptionSource]}</td>
                  <td className="p-3 text-sm" style={{ color: semanticRoles.textMuted }}>{r.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="p-8 text-center text-sm" style={{ color: semanticRoles.textMuted }}>
              لا توجد سجلات عمولة لعرضها.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

