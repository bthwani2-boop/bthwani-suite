import React from 'react';
import { Box, Button, Text, useTheme } from '@bthwani/ui-kit';
import { WebCompactSurfaceHeader, WebControlPanelStatusTag } from '@bthwani/ui-kit/web';
import { FilterDropdown } from './catalogs.parts';
import {
  type DshProductIdentityApprovalStatus,
  getDshProductApprovalStatusTone,
} from '../../shared/dsh-product-identity.model';
import {
  getAllApprovalRecords,
  moveApprovalRecordToStage,
  upsertApprovalRecord,
  type ApprovalRecord,
  type ApprovalStage,
} from '../../shared/workflow';
import { createDshProductApiHttpClient, resolveDshProductApiBaseUrl } from '../../shared/dsh-product-api.transport';

type ItemApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs-revision';

type CatalogItemApprovalRecord = {
  id: string;
  displayCaption: string;
  partnerLabel: string;
  category: string;
  submittedAt: string;
  status: ItemApprovalStatus;
  /** Approval stage in the canonical pipeline — used for tone and label resolution */
  approvalStatus?: DshProductIdentityApprovalStatus;
  /** Note from the reviewer — required when status is 'rejected' or 'needs-revision' */
  approvalNote?: string;
  /** Whether this item requires an audit trail entry on transition */
  auditRequired?: boolean;
};

const statusLabel: Record<ItemApprovalStatus, string> = {
  pending: 'بانتظار المراجعة',
  approved: 'معتمد',
  rejected: 'مرفوض',
  'needs-revision': 'يحتاج تعديل',
};

const statusTone: Record<ItemApprovalStatus, 'default' | 'success' | 'warning' | 'danger'> = {
  pending: 'default',
  approved: 'success',
  rejected: 'danger',
  'needs-revision': 'warning',
};

function mapWorkflowStageToIdentityStatus(stage: ApprovalStage): DshProductIdentityApprovalStatus {
  switch (stage) {
    case 'partner-submitted':
      return 'partner_submitted';
    case 'partner-review':
      return 'partner_review';
    case 'partner-approved':
      return 'partner_approved';
    case 'marketing-review':
      return 'marketing_review';
    case 'marketing-approved':
      return 'marketing_approved';
    case 'catalog-adopted':
      return 'catalog_adopted';
    case 'client-visible':
      return 'client_visible';
    case 'needs-fix':
      return 'needs_fix';
    case 'rejected':
      return 'rejected';
    case 'field-submitted':
    default:
      return 'field_draft';
  }
}

export type ItemApprovalScreenProps = {
  items?: CatalogItemApprovalRecord[];
  activeSubTab?: string;
  onApprove?: (id: string) => void;
  onReject?: (id: string, evidenceNote: string) => void;
  onRequestRevision?: (id: string, evidenceNote: string) => void;
};

export function ItemApprovalScreen({
  items: propsItems,
  activeSubTab = 'marketing',
  onApprove: propsOnApprove,
  onReject: propsOnReject,
  onRequestRevision: propsOnRequestRevision,
}: ItemApprovalScreenProps) {
  const { theme } = useTheme();
  const client = React.useMemo(() => createDshProductApiHttpClient(resolveDshProductApiBaseUrl()), []);

  // Connect to the shared global store if no props are provided
  const [records, setRecords] = React.useState<ApprovalRecord[]>([]);
  const refresh = React.useCallback(() => {
    setRecords(getAllApprovalRecords());
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const items = React.useMemo(() => {
    if (propsItems) return propsItems;

    // Filter records from the shared workflow SSoT based on sub-tab
    let filteredRecords = records.filter(
      (r) => r.entityType === 'product' || r.entityType === 'product-media' || r.entityType === 'category-suggestion'
    );

    if (activeSubTab === 'marketing') {
      filteredRecords = filteredRecords.filter((r) => r.stage === 'marketing-review' || r.stage === 'marketing-approved');
    } else if (activeSubTab === 'quality') {
      filteredRecords = filteredRecords.filter(
        (r) => r.stage === 'partner-review' || r.stage === 'partner-submitted' || r.stage === 'field-submitted' || r.stage === 'partner-approved'
      );
    } else if (activeSubTab === 'pricing') {
      filteredRecords = filteredRecords.filter(
        (r) => r.id.includes('price') || r.title.includes('تعارض سعر')
      );
    } else if (activeSubTab === 'barcode') {
      filteredRecords = filteredRecords.filter(
        (r) => r.id.includes('barcode') || r.title.includes('تعارض باركود')
      );
    } else if (activeSubTab === 'media') {
      filteredRecords = filteredRecords.filter(
        (r) => r.entityType === 'product-media' || r.id.includes('media')
      );
    }

    return filteredRecords.map((r) => {
      let status: ItemApprovalStatus = 'pending';
      if (r.stage === 'needs-fix') status = 'needs-revision';
      else if (r.stage === 'rejected') status = 'rejected';
      else if (['partner-approved', 'marketing-approved', 'catalog-adopted', 'client-visible'].includes(r.stage)) {
        status = 'approved';
      }

      return {
        id: r.id,
        displayCaption: r.title,
        partnerLabel: r.source === 'app-partner' ? 'تطبيق الشريك' : 'تطبيق الميداني',
        category: r.entityType === 'product' ? 'منتج كتالوج' : r.entityType === 'product-media' ? 'صورة منتج' : 'اقتراح فئة',
        submittedAt: r.submittedAt ? r.submittedAt.split('T')[0] : '2026-05-25',
        status,
        approvalStatus: mapWorkflowStageToIdentityStatus(r.stage),
        approvalNote: r.metadata?.requiredFix || r.metadata?.rejectionReason,
        auditRequired: false,
      } satisfies CatalogItemApprovalRecord;
    });
  }, [records, propsItems, activeSubTab]);

  const [crossSurfaceNotification, setCrossSurfaceNotification] = React.useState<{
    itemCaption: string;
    targetSurface: string;
    apiBoundary: string;
  } | null>(null);

  /** API error to surface to the user — cleared on next successful action */
  const [actionError, setActionError] = React.useState<string | null>(null);

  const onApprove = React.useCallback(async (id: string) => {
    setActionError(null);
    try {
      await client.updateCatalogApproval({
        item_id: id,
        action: 'approve',
        note: 'Approved via control-panel UI',
      });
      // Only update local state after confirmed API success
      if (propsOnApprove) {
        propsOnApprove(id);
        return;
      }
      const record = records.find((r) => r.id === id);
      moveApprovalRecordToStage(id, 'catalog-adopted', 'control-panel-catalog', 'اعتماد الكتالوج');
      refresh();
      setCrossSurfaceNotification({
        itemCaption: record?.title ?? id,
        targetSurface: 'control-panel/catalogs → طابور الاعتماد الموحد',
        apiBoundary: 'POST /catalog-approvals',
      });
    } catch (err) {
      console.error('Failed to approve catalog item:', err);
      setActionError(`فشل الاعتماد — ${err instanceof Error ? err.message : 'خطأ غير متوقع'}`);
    }
  }, [propsOnApprove, records, refresh, client]);

  const onReject = React.useCallback(async (id: string, evidenceNote: string) => {
    setActionError(null);
    try {
      await client.updateCatalogApproval({
        item_id: id,
        action: 'reject',
        note: evidenceNote,
      });
      // Only update local state after confirmed API success
      if (propsOnReject) {
        propsOnReject(id, evidenceNote);
        return;
      }
      moveApprovalRecordToStage(id, 'rejected', 'control-panel-catalog', 'رفض الكتالوج');
      upsertApprovalRecord({ id, metadata: { rejectionReason: evidenceNote } });
      refresh();
    } catch (err) {
      console.error('Failed to reject catalog item:', err);
      setActionError(`فشل الرفض — ${err instanceof Error ? err.message : 'خطأ غير متوقع'}`);
    }
  }, [propsOnReject, refresh, client]);

  const onRequestRevision = React.useCallback(async (id: string, evidenceNote: string) => {
    setActionError(null);
    try {
      await client.updateCatalogApproval({
        item_id: id,
        action: 'needs-fix',
        note: evidenceNote,
      });
      // Only update local state after confirmed API success
      if (propsOnRequestRevision) {
        propsOnRequestRevision(id, evidenceNote);
        return;
      }
      moveApprovalRecordToStage(id, 'needs-fix', 'control-panel-catalog', 'طلب تعديل الكتالوج');
      upsertApprovalRecord({ id, metadata: { requiredFix: evidenceNote } });
      refresh();
    } catch (err) {
      console.error('Failed to request revision for catalog item:', err);
      setActionError(`فشل طلب التعديل — ${err instanceof Error ? err.message : 'خطأ غير متوقع'}`);
    }
  }, [propsOnRequestRevision, refresh, client]);

  const pendingCount = items.filter((i) => i.status === 'pending').length;

  // Evidence notes keyed by item id — required for reject/revision actions
  const [evidenceNotes, setEvidenceNotes] = React.useState<Record<string, string>>({});

  // Filter states
  const [partnerFilter, setPartnerFilter] = React.useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = React.useState<string[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [openFilter, setOpenFilter] = React.useState<'partner' | 'category' | 'status' | null>(null);

  function getNote(id: string) {
    return evidenceNotes[id] ?? '';
  }

  function setNote(id: string, value: string) {
    setEvidenceNotes((prev) => ({ ...prev, [id]: value }));
  }

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      const matchPartner = partnerFilter.length === 0 || partnerFilter.includes(item.partnerLabel);
      const matchCategory = categoryFilter.length === 0 || categoryFilter.includes(item.category);
      const matchStatus = statusFilter.length === 0 || statusFilter.includes(item.status);
      return matchPartner && matchCategory && matchStatus;
    });
  }, [items, partnerFilter, categoryFilter, statusFilter]);

  return (
    <>
      <WebCompactSurfaceHeader
        title="اعتماد عناصر الكتالوج"
        description="مراجعة واعتماد العناصر المقدَّمة من الشركاء قبل نشرها. الرفض والتعديل يتطلبان ملاحظة إثبات."
        metrics={[{ id: 'pending', title: 'بانتظار الاعتماد', value: String(pendingCount) }]}
      />

      {/* API error banner — shown when any action fails, user must be aware */}
      {actionError && (
        <div
          role="alert"
          style={{
            margin: '0 16px 10px',
            padding: '10px 14px',
            borderRadius: 8,
            backgroundColor: `${theme.danger as string}10`,
            border: `1px solid ${theme.danger as string}40`,
            borderRight: `4px solid ${theme.danger as string}`,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: theme.danger as string, flex: 1 }}>
            ✗ {actionError}
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            style={{
              appearance: 'none', border: 'none', background: 'transparent',
              cursor: 'pointer', fontSize: 14, color: theme.textMuted,
              padding: '0 2px', lineHeight: 1, flexShrink: 0,
            }}
            aria-label="إغلاق رسالة الخطأ"
          >
            ×
          </button>
        </div>
      )}

      {/* GAP-L06: Cross-surface notification — appears after approve action */}
      {crossSurfaceNotification && (
        <div
          role="status" aria-live="polite"
          style={{
            margin: '0 16px 10px',
            padding: '10px 14px',
            borderRadius: 8,
            backgroundColor: `${theme.success as string}10`,
            border: `1px solid ${theme.success as string}40`,
            borderRight: `4px solid ${theme.success as string}`,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: theme.success as string }}>
              ✓ تم اعتماد العنصر وإرساله إلى الخطوة التالية
            </div>
            <div style={{ fontSize: 11, color: theme.brandHeaderBackground, fontWeight: 600 }}>
              {crossSurfaceNotification.itemCaption}
            </div>
            <div style={{ fontSize: 10, color: theme.textMuted }}>
              الوجهة: <strong>{crossSurfaceNotification.targetSurface}</strong>
            </div>
            <div style={{ fontSize: 9, color: theme.textMuted, direction: 'ltr', textAlign: 'right', marginTop: 2 }}>
              {crossSurfaceNotification.apiBoundary} — UI_PREVIEW_ONLY
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCrossSurfaceNotification(null)}
            style={{
              appearance: 'none', border: 'none', background: 'transparent',
              cursor: 'pointer', fontSize: 14, color: theme.textMuted,
              padding: '0 2px', lineHeight: 1, flexShrink: 0,
            }}
            aria-label="إغلاق الإشعار"
          >
            ×
          </button>
        </div>
      )}

      {/* Approval pipeline indicator — shows where catalog sits in the full flow */}

      <div style={{
        margin: '0 16px 12px',
        padding: '10px 14px',
        backgroundColor: theme.surfaceInset,
        borderRadius: 8,
        border: `1px solid ${theme.line}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        flexWrap: 'wrap',
      }}>
        {/* Stage flow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {[
            { id: 'partner', label: 'الشريك يُقدّم', icon: '▣', active: false, done: true },
            { id: 'catalog', label: 'اعتماد الكتالوج', icon: '⌗', active: true, done: false },
            { id: 'marketing', label: 'مراجعة التسويق', icon: '▤', active: false, done: false },
            { id: 'publish', label: 'نشر للعميل', icon: '✓', active: false, done: false },
          ].map((stage, i, arr) => (
            <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 11,
                  backgroundColor: stage.active
                    ? theme.brand
                    : stage.done
                      ? theme.successSurface ?? theme.surfaceInset
                      : theme.surfaceInset,
                  border: `2px solid ${stage.active ? theme.brand : stage.done ? (theme.success ?? theme.line) : theme.line}`,
                  color: stage.active ? theme.textInverse : stage.done ? (theme.success ?? theme.textMuted) : theme.textMuted,
                  fontWeight: stage.active ? 900 : 600,
                  boxShadow: stage.active ? `0 0 0 3px ${theme.brandSurface}` : 'none',
                  flexShrink: 0,
                }}>
                  {stage.icon}
                </div>
                <span style={{
                  fontSize: 9, fontWeight: stage.active ? 800 : 500,
                  color: stage.active ? theme.brand : theme.textMuted,
                  whiteSpace: 'nowrap',
                }}>
                  {stage.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div style={{
                  width: 20, height: 2, marginBottom: 14,
                  backgroundColor: stage.done ? (theme.success ?? theme.line) : theme.line,
                  borderRadius: 1, flexShrink: 0,
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Context note */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
          <span style={{ fontSize: 10, color: theme.textMuted, textAlign: 'right' }}>
            ✓ الاعتماد هنا يُحيل العنصر تلقائياً لمراجعة التسويق
          </span>
          <span style={{ fontSize: 9, color: theme.textMuted, textAlign: 'right', direction: 'ltr' }}>
            POST /catalog/marketing-review → owner: control-panel/marketing
          </span>
        </div>
      </div>

      <div style={{ backgroundColor: theme.surface, borderRadius: '12px', borderWidth: 1, borderColor: theme.lineStrong, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', margin: 16 }}>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: theme.surfaceInset, borderBottom: `1px solid ${theme.line}` }}>
              <th style={{ width: '48px', padding: '10px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right' }}>صورة</th>
              <th style={{ padding: '10px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right', width: '22%' }}>العنصر والمقترح</th>

              {/* Submitter Filter */}
              <th style={{ padding: '10px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right', width: '12%', position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setOpenFilter(openFilter === 'partner' ? null : 'partner')}
                  style={{ appearance: 'none', border: 'none', background: 'transparent', padding: 0, font: 'inherit', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                >
                  <span style={{ color: theme.textMuted }}>المرسل</span>
                  <span style={{ color: partnerFilter.length > 0 ? theme.brand : theme.lineStrong, fontSize: 10 }}>▼</span>
                </button>
                {openFilter === 'partner' && (
                  <FilterDropdown
                    titleText="المرسل"
                    options={Array.from(new Set(items.map((i) => i.partnerLabel)))}
                    selected={partnerFilter}
                    onChange={setPartnerFilter}
                    onClose={() => setOpenFilter(null)}
                  />
                )}
              </th>

              {/* Category Filter */}
              <th style={{ padding: '10px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right', width: '12%', position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setOpenFilter(openFilter === 'category' ? null : 'category')}
                  style={{ appearance: 'none', border: 'none', background: 'transparent', padding: 0, font: 'inherit', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                >
                  <span style={{ color: theme.textMuted }}>الفئة</span>
                  <span style={{ color: categoryFilter.length > 0 ? theme.brand : theme.lineStrong, fontSize: 10 }}>▼</span>
                </button>
                {openFilter === 'category' && (
                  <FilterDropdown
                    titleText="الفئة"
                    options={Array.from(new Set(items.map((i) => i.category)))}
                    selected={categoryFilter}
                    onChange={setCategoryFilter}
                    onClose={() => setOpenFilter(null)}
                  />
                )}
              </th>

              <th style={{ padding: '10px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right', width: '10%' }}>تاريخ التقديم</th>

              {/* Status Filter */}
              <th style={{ padding: '10px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right', width: '12%', position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setOpenFilter(openFilter === 'status' ? null : 'status')}
                  style={{ appearance: 'none', border: 'none', background: 'transparent', padding: 0, font: 'inherit', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                >
                  <span style={{ color: theme.textMuted }}>الحالة</span>
                  <span style={{ color: statusFilter.length > 0 ? theme.brand : theme.lineStrong, fontSize: 10 }}>▼</span>
                </button>
                {openFilter === 'status' && (
                  <FilterDropdown
                    titleText="الحالة"
                    options={Object.keys(statusLabel)}
                    selected={statusFilter}
                    onChange={setStatusFilter}
                    onClose={() => setOpenFilter(null)}
                    optionLabels={statusLabel}
                  />
                )}
              </th>

              <th style={{ padding: '10px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right', width: '20%' }}>ملاحظة الإثبات (مطلوبة للرفض/التعديل)</th>
              <th style={{ padding: '10px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right', width: '12%' }}>العمليات</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const note = getNote(item.id);
              const canRejectOrRevise = note.trim().length > 0;
              const approvalTone = item.approvalStatus
                ? getDshProductApprovalStatusTone(item.approvalStatus)
                : statusTone[item.status];

              return (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: `1px solid ${theme.line}`,
                    backgroundColor: theme.surface,
                    transition: 'background-color 0.12s ease'
                  }}
                >
                  <td style={{ padding: '12px' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: theme.surfaceInset, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 14 }}>📦</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Text role="caption" style={{ fontWeight: 800, color: theme.brandHeaderBackground }}>{item.displayCaption}</Text>
                      {item.approvalNote && (
                        <Text role="caption" tone="warning" style={{ fontSize: 9 }}>{`ملاحظة سابقة: ${item.approvalNote}`}</Text>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <Text role="caption" tone="muted">{item.partnerLabel}</Text>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <Text role="caption" tone="muted">{item.category}</Text>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <Text role="caption" tone="muted" style={{ fontSize: 10 }}>{item.submittedAt}</Text>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <WebControlPanelStatusTag label={statusLabel[item.status]} tone={(approvalTone === 'muted' || approvalTone === 'default') ? 'neutral' : approvalTone as 'success' | 'warning' | 'danger'} />
                  </td>
                  <td style={{ padding: '12px' }}>
                    {item.status === 'pending' ? (
                      <input
                        aria-label="ملاحظة الإثبات"
                        type="text"
                        value={note}
                        onChange={(e) => setNote(item.id, e.target.value)}
                        placeholder="وصف سبب الرفض أو التعديل..."
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          direction: 'rtl',
                          border: `1px solid ${theme.lineStrong}`,
                          backgroundColor: theme.surface,
                          color: theme.brandHeaderBackground,
                          outline: 'none'
                        }}
                      />
                    ) : (
                      <Text role="caption" tone="muted">—</Text>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {item.status === 'pending' ? (
                      <Box style={{ flexDirection: 'row', gap: 6, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                        <Button
                          label="اعتماد"
                          tone="primary"
                          size="sm"
                          onPress={() => onApprove?.(item.id)}
                        />
                        <Button
                          label="تعديل"
                          tone="secondary"
                          size="sm"
                          disabled={!canRejectOrRevise}
                          onPress={canRejectOrRevise ? () => onRequestRevision?.(item.id, note.trim()) : undefined}
                        />
                        <Button
                          label="رفض"
                          tone="danger"
                          size="sm"
                          disabled={!canRejectOrRevise}
                          onPress={canRejectOrRevise ? () => onReject?.(item.id, note.trim()) : undefined}
                        />
                      </Box>
                    ) : (
                      <Text
                        role="caption"
                        tone={statusTone[item.status] === 'success' ? 'success' : statusTone[item.status] === 'danger' ? 'danger' : 'warning'}
                      >
                        {item.status === 'approved' ? '✓ ' : ''}{statusLabel[item.status]}
                      </Text>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '32px', textAlign: 'center' }}>
                  <Text tone="muted">لا توجد عناصر مطابقة لخيارات التصفية.</Text>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ItemApprovalScreen;
