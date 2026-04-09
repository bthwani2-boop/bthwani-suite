'use client';

/**
 * CONTROL PANEL — إعدادات نسبة/رسوم لكل مزود (PF-1)
 * §ظ WLT_PROVIDER_FEE_AND_ABSORPTION_SPEC
 * Data: GET/PATCH /api/infra/provider-control/providers
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import {
  FEE_POLICY_TYPES,
  getFeePolicyLabels,
  PROVIDER_RUNTIME_MODES,
  type ProviderFeeConfig,
  type FeePolicyType,
  type ProviderRuntimeMode,
} from './wltProviderFeeConstants';
import { useI18n } from '@bthwani/ui-kit';

function apiBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
}

const MCPW_CONTROL_ACTOR = 'control-panel-provider-control';

function controlHeaders(json = false): HeadersInit {
  const h: Record<string, string> = { 'x-bth-updated-by': MCPW_CONTROL_ACTOR };
  if (json) h['Content-Type'] = 'application/json';
  return h;
}

type ApiProviderRow = {
  id: string;
  providerId: string;
  providerName: string;
  feePolicy: string;
  feePct: number;
  feeFixedMinYer: number;
  feeFixedMaxYer: number;
  enabled: boolean;
  mode?: string;
  updatedAt?: string;
};

function mapRow(r: ApiProviderRow): ProviderFeeConfig {
  const allowed = new Set<string>(Object.values(FEE_POLICY_TYPES));
  const policy = allowed.has(r.feePolicy) ? (r.feePolicy as FeePolicyType) : FEE_POLICY_TYPES.FIXED;
  const modes = new Set<string>([...PROVIDER_RUNTIME_MODES]);
  const mode = modes.has(r.mode || '') ? (r.mode as ProviderRuntimeMode) : 'local';
  return {
    id: r.id,
    providerId: r.providerId,
    providerName: r.providerName,
    feePolicy: policy,
    feePct: r.feePct,
    feeFixedMinYer: r.feeFixedMinYer,
    feeFixedMaxYer: r.feeFixedMaxYer,
    enabled: r.enabled,
    mode,
    updatedAt: r.updatedAt,
  };
}

export default function WLT_PROVIDER_FEES_CONFIG() {
  const { t } = useI18n();
  const feePolicyLabels = React.useMemo(() => getFeePolicyLabels(t), [t]);
  const base = useMemo(() => apiBase(), []);
  const [providers, setProviders] = useState<ProviderFeeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ProviderFeeConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyJson, setHistoryJson] = useState<string>('');

  const loadProviders = useCallback(async () => {
    if (!base) {
      setLoadError(t('surfaces.networkErrorCheckConnection'));
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`${base}/infra/provider-control/providers`, { credentials: 'include' });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as ApiProviderRow[];
      setProviders(Array.isArray(data) ? data.map(mapRow) : []);
    } catch {
      setLoadError(t('surfaces.networkErrorCheckConnection'));
      setProviders([]);
    } finally {
      setLoading(false);
    }
  }, [base, t]);

  useEffect(() => {
    void loadProviders();
  }, [loadProviders]);

  const handleEdit = useCallback((row: ProviderFeeConfig) => {
    setEditing({ ...row });
    setMessage(null);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditing(null);
    setMessage(null);
  }, []);

  const handleChangeEdit = useCallback(
    (field: keyof ProviderFeeConfig, value: string | number | boolean) => {
      if (!editing) return;
      setEditing((prev) => (prev ? { ...prev, [field]: value } : null));
    },
    [editing],
  );

  const handleSave = useCallback(async () => {
    if (!editing || !base) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${base}/infra/provider-control/providers/${editing.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: controlHeaders(true),
        body: JSON.stringify({
          providerName: editing.providerName,
          feePolicy: editing.feePolicy,
          feePct: editing.feePct,
          feeFixedMinYer: editing.feeFixedMinYer,
          feeFixedMaxYer: editing.feeFixedMaxYer,
          enabled: editing.enabled,
          mode: editing.mode,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      await loadProviders();
      setMessage({ type: 'success', text: t('common.success') });
      setEditing(null);
    } catch {
      setMessage({ type: 'error', text: t('surfaces.networkErrorCheckConnection') });
    } finally {
      setSaving(false);
    }
  }, [base, editing, loadProviders, t]);

  const runAction = useCallback(
    async (id: string, path: string) => {
      if (!base) return;
      setMessage(null);
      try {
        const res = await fetch(`${base}/infra/provider-control/providers/${id}/${path}`, {
          method: 'POST',
          credentials: 'include',
          headers: controlHeaders(false),
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as {
          ok?: boolean;
          detail?: string;
          adapterKind?: string;
          describe?: { notes?: string; ready?: boolean };
        };
        await loadProviders();
        if (path === 'test') {
          const line = [data.detail, data.adapterKind && `adapter=${data.adapterKind}`]
            .filter(Boolean)
            .join(' · ');
          setMessage({
            type: data.ok === false ? 'error' : 'success',
            text: line || t('common.success'),
          });
        } else {
          setMessage({ type: 'success', text: t('common.success') });
        }
      } catch {
        setMessage({ type: 'error', text: t('surfaces.networkErrorCheckConnection') });
      }
    },
    [base, loadProviders, t],
  );

  const loadHistory = useCallback(async () => {
    if (!base) return;
    try {
      const res = await fetch(`${base}/infra/provider-control/history`, { credentials: 'include' });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      setHistoryJson(JSON.stringify(data, null, 2));
      setHistoryOpen(true);
    } catch {
      setMessage({ type: 'error', text: t('surfaces.networkErrorCheckConnection') });
    }
  }, [base, t]);

  return (
    <div className="w-full max-w-5xl">
      <div className="mb-8 pb-6 border-b" style={{ borderColor: semanticRoles.border }}>
        <h1 className="text-[28px] font-bold mb-1" style={{ color: semanticRoles.text }}>
          {t('web.control panel.finance.McpwFinanceScreen.sectionProviderFees')}
        </h1>
        <p className="text-[15px]" style={{ color: semanticRoles.textMuted }}>
          {t('web.control panel.finance.McpwFinanceScreen.sectionProviderRules')}
        </p>
      </div>

      {message && (
        <p
          className="text-sm mb-4"
          style={{
            color: message.type === 'success' ? semanticRoles.stateSuccess?.icon : semanticRoles.stateError?.icon,
          }}
        >
          {message.text}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          className="text-sm px-3 py-1.5 rounded border"
          style={{ borderColor: semanticRoles.border, color: semanticRoles.text }}
          onClick={() => void loadProviders()}
        >
          {t('common.refresh')}
        </button>
        <button
          type="button"
          className="text-sm px-3 py-1.5 rounded border"
          style={{ borderColor: semanticRoles.border, color: semanticRoles.text }}
          onClick={() => void loadHistory()}
        >
          {t('control panel.userMenuActivityLog')}
        </button>
      </div>

      {loading ? (
        <p style={{ color: semanticRoles.textMuted }}>{t('common.loading')}</p>
      ) : loadError ? (
        <p style={{ color: semanticRoles.stateError?.icon }}>{loadError}</p>
      ) : (
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}>
          <table className="w-full text-right border-collapse">
            <thead>
              <tr style={{ backgroundColor: semanticRoles.surfaceSubtle, borderBottom: `1px solid ${semanticRoles.border}` }}>
                <th className="p-3 text-sm font-semibold" style={{ color: semanticRoles.text }}>
                  {t('web.control panel.finance.McpwFinanceScreen.sectionProviderFees')}
                </th>
                <th className="p-3 text-sm font-semibold" style={{ color: semanticRoles.text }}>
                  {t('common.info')}
                </th>
                <th className="p-3 text-sm font-semibold" style={{ color: semanticRoles.text }}>
                  {t('common.edit')}
                </th>
                <th className="p-3 text-sm font-semibold" style={{ color: semanticRoles.text }}>
                  mode
                </th>
                <th className="p-3 text-sm font-semibold" style={{ color: semanticRoles.text }}>
                  {t('control panel.apis_subtitle')}
                </th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${semanticRoles.border}` }}>
                  <td className="p-3 text-sm" style={{ color: semanticRoles.text }}>
                    {p.providerName}
                  </td>
                  <td className="p-3 text-sm" style={{ color: semanticRoles.textMuted }}>
                    {feePolicyLabels[p.feePolicy as FeePolicyType]} · {p.feePct}% · {p.feeFixedMinYer}/{p.feeFixedMaxYer || '—'}
                  </td>
                  <td className="p-3 text-sm font-mono" style={{ color: semanticRoles.textMuted }}>
                    {p.mode}
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(p)}
                      className="text-sm font-medium px-3 py-1.5 rounded"
                      style={{ color: semanticRoles.primaryCTA, backgroundColor: `${semanticRoles.primaryCTA}18` }}
                    >
                      {t('common.edit')}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 justify-end">
                      <button
                        type="button"
                        className="text-xs px-2 py-1 rounded border"
                        style={{ borderColor: semanticRoles.border, color: semanticRoles.text }}
                        onClick={() => void runAction(p.id, 'activate')}
                      >
                        {t('control panel.service_enabled_label')}
                      </button>
                      <button
                        type="button"
                        className="text-xs px-2 py-1 rounded border"
                        style={{ borderColor: semanticRoles.border, color: semanticRoles.text }}
                        onClick={() => void runAction(p.id, 'test')}
                      >
                        {t('control panel.tip.try_now')}
                      </button>
                      <button
                        type="button"
                        className="text-xs px-2 py-1 rounded border"
                        style={{ borderColor: semanticRoles.border, color: semanticRoles.text }}
                        onClick={() => void runAction(p.id, 'rollback')}
                      >
                        {t('preferences.reset_confirm_title')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: BTHWANI_COLORS?.overlay40 ?? 'rgba(0,0,0,0.4)' }}
        >
          <div className="rounded-xl border shadow-xl w-full max-w-md p-6" style={{ backgroundColor: semanticRoles.surface, borderColor: semanticRoles.border }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: semanticRoles.text }}>
              {t('common.edit')}
            </h2>
            <p className="text-sm mb-4" style={{ color: semanticRoles.textMuted }}>
              {editing.providerName}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: semanticRoles.text }}>
                  {t('common.info')}
                </label>
                <select
                  value={editing.feePolicy}
                  onChange={(e) => handleChangeEdit('feePolicy', e.target.value as FeePolicyType)}
                  className="w-full p-2 rounded border text-sm"
                  style={{ borderColor: semanticRoles.border, color: semanticRoles.text }}
                >
                  {(Object.keys(feePolicyLabels) as FeePolicyType[]).map((k) => (
                    <option key={k} value={k}>
                      {feePolicyLabels[k]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: semanticRoles.text }}>
                  mode
                </label>
                <select
                  value={editing.mode}
                  onChange={(e) => handleChangeEdit('mode', e.target.value as ProviderRuntimeMode)}
                  className="w-full p-2 rounded border text-sm"
                  style={{ borderColor: semanticRoles.border, color: semanticRoles.text }}
                >
                  {PROVIDER_RUNTIME_MODES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: semanticRoles.text }}>
                  %
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={editing.feePct}
                  onChange={(e) => handleChangeEdit('feePct', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 rounded border text-sm"
                  style={{ borderColor: semanticRoles.border, color: semanticRoles.text }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: semanticRoles.text }}>
                  min
                </label>
                <input
                  type="number"
                  min={0}
                  value={editing.feeFixedMinYer}
                  onChange={(e) => handleChangeEdit('feeFixedMinYer', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 rounded border text-sm"
                  style={{ borderColor: semanticRoles.border, color: semanticRoles.text }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: semanticRoles.text }}>
                  max
                </label>
                <input
                  type="number"
                  min={0}
                  value={editing.feeFixedMaxYer || ''}
                  onChange={(e) => handleChangeEdit('feeFixedMaxYer', parseFloat(e.target.value) || 0)}
                  placeholder={t('web.control panel.finance.WLT_PROVIDER_FEES_CONFIG.optionalLabel')}
                  className="w-full p-2 rounded border text-sm"
                  style={{ borderColor: semanticRoles.border, color: semanticRoles.text }}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editing.enabled} onChange={(e) => handleChangeEdit('enabled', e.target.checked)} />
                <span className="text-sm" style={{ color: semanticRoles.text }}>
                  {t('control panel.service_enabled_label')}
                </span>
              </label>
            </div>
            {message && (
              <p
                className="text-sm mt-3"
                style={{
                  color: message.type === 'success' ? semanticRoles.stateSuccess?.icon : semanticRoles.stateError?.icon,
                }}
              >
                {message.text}
              </p>
            )}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
                style={{ backgroundColor: semanticRoles.primaryCTA }}
              >
                {saving ? t('common.loading') : t('common.save')}
              </button>
              <button
                type="button"
                onClick={handleCloseEdit}
                className="px-4 py-2 rounded-lg text-sm font-medium border"
                style={{ borderColor: semanticRoles.border, color: semanticRoles.text }}
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {historyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-4 max-h-[80vh] overflow-auto">
            <div className="flex justify-between mb-2">
              <h2 className="font-bold">{t('control panel.userMenuActivityLog')}</h2>
              <button type="button" className="text-sm underline" onClick={() => setHistoryOpen(false)}>
                {t('common.close')}
              </button>
            </div>
            <pre className="text-xs whitespace-pre-wrap font-mono">{historyJson}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

