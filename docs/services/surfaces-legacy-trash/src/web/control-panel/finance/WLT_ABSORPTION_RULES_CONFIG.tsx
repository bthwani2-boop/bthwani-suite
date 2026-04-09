'use client';

/**
 * CONTROL PANEL — قواعد استقطاع عمولة المزودين (PF-2)
 * §ظ WLT_PROVIDER_FEE_AND_ABSORPTION_SPEC
 */

import React, { useState, useCallback, useMemo } from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import {
  ABSORPTION_RULE_CODES,
  getAbsorptionRuleLabels,
  type AbsorptionRuleCode,
  type AbsorptionRuleConfig,
} from './wltProviderFeeConstants';

const DEFAULT_CONFIG: AbsorptionRuleConfig = {
  primaryRule: ABSORPTION_RULE_CODES.PLATFORM,
  splitDeliveryPct: 0,
  splitProductPct: 0,
  splitPlatformPct: 100,
  splitCustomerPct: 0,
};

export default function WLT_ABSORPTION_RULES_CONFIG() {
  const { t } = useI18n();
  const [config, setConfig] = useState<AbsorptionRuleConfig>(() => ({
    ...DEFAULT_CONFIG,
  }));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const absorptionRuleLabels = useMemo(() => getAbsorptionRuleLabels(t), [t]);

  const update = useCallback(
    (field: keyof AbsorptionRuleConfig, value: AbsorptionRuleCode | number) => {
      setConfig(prev => ({ ...prev, [field]: value }));
      setMessage(null);
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (config.primaryRule === ABSORPTION_RULE_CODES.SPLIT) {
      const total =
        config.splitDeliveryPct +
        config.splitProductPct +
        config.splitPlatformPct +
        config.splitCustomerPct;
      if (Math.abs(total - 100) > 0.01) {
        setMessage({
          type: 'error',
          text: 'مجموع نسب التوزيع يجب أن يكون 100%.',
        });
        return;
      }
    }
    setSaving(true);
    setMessage(null);
    try {
      // Placeholder: في الإنتاج PUT /api/wlt/config/absorption-rules
      await new Promise(r => setTimeout(r, 500));
      setMessage({ type: 'success', text: 'تم حفظ قواعد الاستقطاع بنجاح.' });
    } catch {
      setMessage({ type: 'error', text: 'فشل الحفظ. حاول مرة أخرى.' });
    } finally {
      setSaving(false);
    }
  }, [config]);

  const showSplit = config.primaryRule === ABSORPTION_RULE_CODES.SPLIT;

  return (
    <div className='w-full max-w-2xl'>
      <div
        className='mb-8 pb-6 border-b'
        style={{ borderColor: semanticRoles.border }}
      >
        <h1
          className='text-[28px] font-bold mb-1'
          style={{ color: semanticRoles.text }}
        >
          قواعد استقطاع العمولة
        </h1>
        <p className='text-[15px]' style={{ color: semanticRoles.textMuted }}>
          حدد من أين تُستقطع عمولة مزودي الدفع: من تكلفة التوصيل، سعر المنتج،
          حصة المنصة، أو توزيع بين أطراف.
        </p>
      </div>

      <div
        className='rounded-lg border p-6'
        style={{
          borderColor: semanticRoles.border,
          backgroundColor: semanticRoles.surface,
        }}
      >
        <div className='space-y-6'>
          <div>
            <label
              className='block text-sm font-semibold mb-2'
              style={{ color: semanticRoles.text }}
            >
              مصدر الاستقطاع الأساسي
            </label>
            <select
              value={config.primaryRule}
              onChange={e =>
                update('primaryRule', e.target.value as AbsorptionRuleCode)
              }
              className='w-full p-3 rounded-lg border text-sm'
              style={{
                borderColor: semanticRoles.border,
                color: semanticRoles.text,
              }}
            >
              {(
                Object.entries(absorptionRuleLabels) as [
                  AbsorptionRuleCode,
                  string,
                ][]
              ).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {showSplit && (
            <div
              className='pt-4 border-t'
              style={{ borderColor: semanticRoles.border }}
            >
              <h3
                className='text-sm font-semibold mb-3'
                style={{ color: semanticRoles.text }}
              >
                نسب التوزيع % (المجموع = 100)
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label
                    className='block text-xs font-medium mb-1'
                    style={{ color: semanticRoles.textMuted }}
                  >
                    من تكلفة التوصيل
                  </label>
                  <input
                    type='number'
                    min={0}
                    max={100}
                    value={config.splitDeliveryPct}
                    onChange={e =>
                      update(
                        'splitDeliveryPct',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className='w-full p-2 rounded border text-sm'
                    style={{
                      borderColor: semanticRoles.border,
                      color: semanticRoles.text,
                    }}
                  />
                </div>
                <div>
                  <label
                    className='block text-xs font-medium mb-1'
                    style={{ color: semanticRoles.textMuted }}
                  >
                    من سعر المنتج
                  </label>
                  <input
                    type='number'
                    min={0}
                    max={100}
                    value={config.splitProductPct}
                    onChange={e =>
                      update('splitProductPct', parseFloat(e.target.value) || 0)
                    }
                    className='w-full p-2 rounded border text-sm'
                    style={{
                      borderColor: semanticRoles.border,
                      color: semanticRoles.text,
                    }}
                  />
                </div>
                <div>
                  <label
                    className='block text-xs font-medium mb-1'
                    style={{ color: semanticRoles.textMuted }}
                  >
                    من حصة المنصة
                  </label>
                  <input
                    type='number'
                    min={0}
                    max={100}
                    value={config.splitPlatformPct}
                    onChange={e =>
                      update(
                        'splitPlatformPct',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className='w-full p-2 rounded border text-sm'
                    style={{
                      borderColor: semanticRoles.border,
                      color: semanticRoles.text,
                    }}
                  />
                </div>
                <div>
                  <label
                    className='block text-xs font-medium mb-1'
                    style={{ color: semanticRoles.textMuted }}
                  >
                    من العميل
                  </label>
                  <input
                    type='number'
                    min={0}
                    max={100}
                    value={config.splitCustomerPct}
                    onChange={e =>
                      update(
                        'splitCustomerPct',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className='w-full p-2 rounded border text-sm'
                    style={{
                      borderColor: semanticRoles.border,
                      color: semanticRoles.text,
                    }}
                  />
                </div>
              </div>
              <p
                className='text-xs mt-2'
                style={{ color: semanticRoles.textMuted }}
              >
                المجموع:{' '}
                {config.splitDeliveryPct +
                  config.splitProductPct +
                  config.splitPlatformPct +
                  config.splitCustomerPct}
                %
              </p>
            </div>
          )}

          {message && (
            <p
              style={{
                color:
                  message.type === 'success'
                    ? semanticRoles.stateSuccess?.icon
                    : semanticRoles.stateError?.icon,
              }}
              className='text-sm'
            >
              {message.text}
            </p>
          )}

          <button
            type='button'
            onClick={handleSave}
            disabled={saving}
            className='px-5 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-60'
            style={{ backgroundColor: semanticRoles.primaryCTA }}
          >
            {saving ? 'جاري الحفظ...' : 'حفظ قواعد الاستقطاع'}
          </button>
        </div>
      </div>
    </div>
  );
}

