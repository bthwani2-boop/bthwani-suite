'use client';

/**
 * CONTROL PANEL Runtime Variables Surface — wired to api-host /api/infra/runtime-vars
 * Primary view: /effective (catalog + persisted). Edit uses PUT on stored value.
 */

import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useI18n } from '@bthwani/ui-kit';

type EffectiveRuntimeVarRow = {
  key: string;
  effectiveValue: unknown;
  valueType: string;
  source: string;
  catalogDefault?: string;
  description?: string;
  environmentScope?: string;
  updatedAt: string | null;
};

function apiBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
}

const MCPW_RUNTIME_VARS_ACTOR = 'control-panel-runtime-vars';

function serializeForEdit(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

export function RuntimeVarsSurface() {
  const { t } = useI18n();
  const base = useMemo(() => apiBase(), []);
  const [rows, setRows] = useState<EffectiveRuntimeVarRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ key: string; valueType: string } | null>(null);
  const [draftValue, setDraftValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [auditJson, setAuditJson] = useState('');

  const load = useCallback(async () => {
    if (!base) {
      setError(t('surfaces.networkErrorCheckConnection'));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${base}/infra/runtime-vars/effective`, { credentials: 'include' });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as EffectiveRuntimeVarRow[];
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setError(t('surfaces.networkErrorCheckConnection'));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [base, t]);

  const loadAudit = useCallback(async () => {
    if (!base) return;
    try {
      const res = await fetch(`${base}/infra/runtime-vars/audit`, { credentials: 'include' });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      setAuditJson(JSON.stringify(data, null, 2));
      setAuditOpen(true);
    } catch {
      setError(t('surfaces.networkErrorCheckConnection'));
    }
  }, [base, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const openEdit = useCallback((row: EffectiveRuntimeVarRow) => {
    setEditing({ key: row.key, valueType: row.valueType || 'string' });
    setDraftValue(serializeForEdit(row.effectiveValue));
  }, []);

  const closeEdit = useCallback(() => {
    setEditing(null);
    setDraftValue('');
  }, []);

  const save = useCallback(async () => {
    if (!editing || !base) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${base}/infra/runtime-vars/${encodeURIComponent(editing.key)}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-bth-updated-by': MCPW_RUNTIME_VARS_ACTOR,
        },
        body: JSON.stringify({
          value: draftValue,
          valueType: editing.valueType || 'string',
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      await load();
      closeEdit();
    } catch {
      setError(t('surfaces.networkErrorCheckConnection'));
    } finally {
      setSaving(false);
    }
  }, [base, closeEdit, draftValue, editing, load, t]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('control panel.nav.runtime_vars')}</h1>
          <p className="text-gray-600 mb-2">{t('control panel.apis_subtitle')}</p>
          <p className="text-xs text-gray-500 mb-6">
            Effective view: catalog defaults + database overrides (source column). Edit persists to Postgres.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">{t('control panel.nav.service_catalog')}</h3>
            <p className="text-sm text-green-700 mb-3">{t('control panel.modules_subtitle')}</p>
            <Link
              href="/service-catalog/services"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              {t('control panel.nav.service_catalog')}
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-600">{t('common.loading')}</p>
          ) : error ? (
            <p className="text-red-600 text-sm">{error}</p>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="text-sm px-3 py-1.5 rounded border border-gray-300 text-gray-800"
                  onClick={() => void loadAudit()}
                >
                  Audit log
                </button>
              </div>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-sm text-right">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 font-semibold">
                        {t('web.control panel.governance.McpwGovernanceScreen.variables')}
                      </th>
                      <th className="p-2 font-semibold">effective</th>
                      <th className="p-2 font-semibold">source</th>
                      <th className="p-2 font-semibold">{t('common.edit')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.key} className="border-t">
                        <td className="p-2 font-mono text-xs break-all align-top">{r.key}</td>
                        <td className="p-2 break-all align-top text-xs">
                          <div>{serializeForEdit(r.effectiveValue)}</div>
                          {r.description ? (
                            <div className="text-gray-500 mt-1">{r.description}</div>
                          ) : null}
                        </td>
                        <td className="p-2 align-top text-xs font-mono text-gray-600">{r.source}</td>
                        <td className="p-2 align-top">
                          <button
                            type="button"
                            className="text-blue-600 hover:underline"
                            onClick={() => openEdit(r)}
                          >
                            {t('common.edit')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              className="px-3 py-1.5 rounded border text-sm"
              onClick={() => void load()}
            >
              {t('common.refresh')}
            </button>
          </div>
        </div>
      </div>

      {auditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-4 max-h-[80vh] overflow-auto">
            <div className="flex justify-between mb-2">
              <h2 className="font-bold">Runtime vars audit</h2>
              <button type="button" className="text-sm underline" onClick={() => setAuditOpen(false)}>
                {t('common.close')}
              </button>
            </div>
            <pre className="text-xs whitespace-pre-wrap font-mono">{auditJson}</pre>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h2 className="text-lg font-bold mb-2">{t('common.edit')}</h2>
            <p className="text-xs font-mono break-all mb-2">{editing.key}</p>
            <textarea
              className="w-full border rounded p-2 text-sm min-h-[120px]"
              value={draftValue}
              onChange={(e) => setDraftValue(e.target.value)}
            />
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
                disabled={saving}
                onClick={() => void save()}
              >
                {t('common.save')}
              </button>
              <button type="button" className="px-4 py-2 border rounded text-sm" onClick={closeEdit}>
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

