// UI_PREVIEW_ONLY — no backend/API/DB binding.
// Owner: control-panel/catalogs
// Purpose: Bridge from control-panel/partners and app-partner into catalog onboarding.
//   Shows partner activation status, readiness checklist, incoming items, and handoff result.
//   app-partner cannot approve or publish.
//   All actions are preview-only.

import React, { useState } from 'react';
import { Box, Button, Text, useTheme } from '@bthwani/ui-kit';
import { WebCompactSurfaceHeader } from '@bthwani/ui-kit/web';
import type { CatalogProductMaster, CatalogApprovalStage } from './catalog';
import {
  type DshPartnerActivationStatus,
  getDshPartnerActivationStateMetadata,
  getDshPartnerReadinessChecklist,
  getDshPartnerVisibilityBadge,
  getDshPartnerVisibilityBadgeLabel,
} from '../../shared/dsh-partner-activation.model';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CatalogPartnerHandoffWorkspaceProps = {
  partnerId: string;
  partnerLabel: string;
  activationStatus: DshPartnerActivationStatus;
  incomingItems: Pick<CatalogProductMaster, 'id' | 'name' | 'approvalStage'>[];
  onClose: () => void;
};

type ActionResult = { type: 'success' | 'blocked' | 'info'; message: string } | null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const approvalStageLabel: Record<CatalogApprovalStage, string> = {
  'catalog-draft':    'مسودة الكتالوج',
  'catalog-approved': 'معتمد في الكتالوج',
  'partner-proposed': 'مقترح من الشريك',
  'partner-review':   'مراجعة الشركاء',
  'marketing-review': 'مراجعة التسويق',
  'catalog-adopted':  'مُعتمد ومُدمج',
  'client-visible':   'ظاهر للعميل',
};

const PARTNER_CAN_EDIT = [
  'تحديث المخزون (stock)',
  'تعديل التوفر (available)',
  'تعديل سعر الشريك (price override)',
  'إضافة ملاحظة تحضير (preparation note)',
  'إضافة ملاحظة داخلية (internal note)',
];

const PARTNER_CANNOT_DO = [
  'اعتماد المنتجات (Approval) — مملوك لـ control-panel/catalogs',
  'نشر الكتالوج (Publish) — مملوك لـ control-panel/catalogs',
  'تحديد client-visible — مملوك لـ control-panel/catalogs',
  'تعديل الهوية المركزية (SKU/GTIN/barcode)',
  'تعديل الفئة أو التصنيف',
  'اعتماد الوسائط (media approval)',
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: string }) {
  const { theme } = useTheme();
  return (
    <Text role="label" style={{ fontWeight: '800', color: theme.brandHeaderBackground, marginBottom: 4 }}>
      {children}
    </Text>
  );
}

function ChecklistRow({ label, satisfied, blockedReason }: {
  label: string;
  satisfied: boolean;
  blockedReason?: string;
}) {
  const { theme } = useTheme();
  return (
    <Box gap={1} style={{ paddingVertical: 3 }}>
      <Box layoutDirection="row" gap={8} style={{ alignItems: 'center' }}>
        <Text role="caption" style={{ fontSize: 14, color: satisfied ? theme.success : theme.danger }}>
          {satisfied ? '✓' : '✗'}
        </Text>
        <Text role="caption" style={{ fontWeight: '700', color: satisfied ? theme.text : theme.danger, flexShrink: 1 }}>
          {label}
        </Text>
      </Box>
      {!satisfied && blockedReason && (
        <Box style={{ backgroundColor: theme.dangerSurface, borderRadius: 4, padding: 6, marginRight: 22 }}>
          <Text role="caption" style={{ color: theme.danger, fontSize: 11 }}>{blockedReason}</Text>
        </Box>
      )}
    </Box>
  );
}

function ResultBanner({ result }: { result: ActionResult }) {
  const { theme } = useTheme();
  if (!result) return null;
  const bg = result.type === 'success' ? theme.successSurface
    : result.type === 'blocked' ? theme.dangerSurface
    : theme.surfaceInset;
  const color = result.type === 'success' ? theme.success
    : result.type === 'blocked' ? theme.danger
    : theme.text;
  return (
    <Box style={{ backgroundColor: bg, borderRadius: 8, padding: 10, marginTop: 8 }}>
      <Text role="caption" style={{ color, fontWeight: '700' }}>{result.message}</Text>
    </Box>
  );
}

// ─── Main workspace ───────────────────────────────────────────────────────────

export function CatalogPartnerHandoffWorkspace({
  partnerId,
  partnerLabel,
  activationStatus,
  incomingItems,
  onClose,
}: CatalogPartnerHandoffWorkspaceProps) {
  const { theme } = useTheme();
  const [actionResult, setActionResult] = useState<ActionResult>(null);

  const metadata = getDshPartnerActivationStateMetadata(activationStatus);
  const checklist = getDshPartnerReadinessChecklist(activationStatus);
  const badge = getDshPartnerVisibilityBadge(activationStatus, true);
  const badgeLabel = getDshPartnerVisibilityBadgeLabel(badge);
  const allSatisfied = checklist.every((item) => item.satisfied);

  const pendingItems = incomingItems.filter(
    (i) => i.approvalStage !== 'client-visible' && i.approvalStage !== 'catalog-adopted'
  );
  const adoptedItems = incomingItems.filter(
    (i) => i.approvalStage === 'catalog-adopted' || i.approvalStage === 'client-visible'
  );

  function handleAcceptIntake() {
    if (!allSatisfied) {
      const blocked = checklist.find((i) => !i.satisfied);
      setActionResult({
        type: 'blocked',
        message: `محظور — ${blocked?.blockedReason || 'قائمة الجاهزية غير مكتملة. استوفِ جميع الشروط أولًا.'}`,
      });
      return;
    }
    if (pendingItems.length === 0) {
      setActionResult({ type: 'info', message: 'لا توجد عناصر معلقة من هذا الشريك.' });
      return;
    }
    setActionResult({
      type: 'success',
      message: `UI_PREVIEW_ONLY — تم استلام ${pendingItems.length} عنصر من "${partnerLabel}" وفتح ملف الاستلام محلياً. الإجراء الفعلي يتطلب ربط API.`,
    });
  }

  function handleEscalateToCatalog() {
    setActionResult({
      type: 'info',
      message: `UI_PREVIEW_ONLY — تم تصعيد الملف إلى فريق الكتالوج للمراجعة (محاكاة محلية).`,
    });
  }

  const badgeBg =
    badge === 'active' ? theme.successSurface
    : badge === 'catalog-not-ready' ? theme.dangerSurface
    : theme.surface;
  const badgeColor =
    badge === 'active' ? theme.success
    : badge === 'catalog-not-ready' ? theme.danger
    : theme.text;

  return (
    <Box
      gap={0}
      style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0,
        width: '100%',
        maxWidth: 600,
        backgroundColor: theme.surface,
        borderLeftWidth: 1,
        borderLeftColor: theme.line,
        zIndex: 100,
        overflow: 'auto',
      }}
    >
      <WebCompactSurfaceHeader
        title="استلام الشريك — الكتالوج"
        subtitle={`${partnerLabel} (${partnerId}) — UI_PREVIEW_ONLY`}
        onBack={onClose}
      />

      <Box gap={4} style={{ padding: 16 }}>

        {/* Owner notice */}
        <Box style={{ backgroundColor: theme.surfaceInset, borderRadius: 6, padding: 8 }}>
          <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
            المالك: control-panel/catalogs · الشريك لا يملك اعتماد/نشر · جميع الإجراءات محاكاة محلية
          </Text>
        </Box>

        {/* ── Partner status header ──────────────────────────────────────── */}
        <Box
          gap={3}
          style={{
            backgroundColor: badgeBg,
            borderRadius: 8, padding: 12,
          }}
        >
          <SectionTitle>حالة الشريك</SectionTitle>
          <Box layoutDirection="row" gap={8} style={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Box style={{ backgroundColor: badgeColor + '22', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text role="caption" style={{ fontWeight: '800', color: badgeColor }}>{badgeLabel}</Text>
            </Box>
            <Text role="caption" style={{ color: theme.text, fontSize: 12 }}>{activationStatus}</Text>
          </Box>
          <Box gap={1}>
            <Text role="caption" tone="muted" style={{ fontSize: 11 }}>المالك الحالي: {metadata.ownerSurface}</Text>
            <Text role="caption" tone="muted" style={{ fontSize: 11 }}>المسؤول: {metadata.actorResponsible}</Text>
            <Text role="caption" tone="muted" style={{ fontSize: 11 }}>الإجراء التالي: {metadata.nextAction}</Text>
            {metadata.blockedReason && (
              <Text role="caption" style={{ color: theme.danger, fontSize: 11 }}>
                سبب الحجب: {metadata.blockedReason}
              </Text>
            )}
          </Box>
        </Box>

        {/* ── Readiness checklist ────────────────────────────────────────── */}
        <Box gap={2} style={{ backgroundColor: theme.surfaceInset, borderRadius: 8, padding: 12 }}>
          <SectionTitle>قائمة الجاهزية</SectionTitle>
          {checklist.map((item) => (
            <ChecklistRow
              key={item.id}
              label={item.label}
              satisfied={item.satisfied}
              blockedReason={item.blockedReason}
            />
          ))}
        </Box>

        {/* ── Incoming items ─────────────────────────────────────────────── */}
        <Box gap={2} style={{ backgroundColor: theme.surfaceInset, borderRadius: 8, padding: 12 }}>
          <SectionTitle>العناصر الواردة</SectionTitle>
          {incomingItems.length === 0 && (
            <Text role="caption" tone="muted">لا توجد عناصر واردة من هذا الشريك.</Text>
          )}
          {pendingItems.length > 0 && (
            <Box gap={1}>
              <Text role="caption" style={{ fontWeight: '700', color: theme.warning, fontSize: 12 }}>
                معلق ({pendingItems.length})
              </Text>
              {pendingItems.map((item) => (
                <Box key={item.id} layoutDirection="row" gap={8} style={{ paddingVertical: 3, alignItems: 'center' }}>
                  <Text role="caption" style={{ color: theme.text, flexShrink: 1 }}>{item.name}</Text>
                  <Box style={{ backgroundColor: theme.warningOrange ?? theme.surface, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                    <Text role="caption" style={{ fontSize: 10, color: theme.text }}>
                      {approvalStageLabel[item.approvalStage as CatalogApprovalStage] || item.approvalStage}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
          {adoptedItems.length > 0 && (
            <Box gap={1}>
              <Text role="caption" style={{ fontWeight: '700', color: theme.success, fontSize: 12 }}>
                مُدمج / منشور ({adoptedItems.length})
              </Text>
              {adoptedItems.map((item) => (
                <Box key={item.id} layoutDirection="row" gap={8} style={{ paddingVertical: 3, alignItems: 'center' }}>
                  <Text role="caption" style={{ color: theme.success, flexShrink: 1 }}>✓ {item.name}</Text>
                  <Text role="caption" tone="muted" style={{ fontSize: 10 }}>
                    {approvalStageLabel[item.approvalStage as CatalogApprovalStage] || item.approvalStage}
                  </Text>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* ── Partner permissions summary ────────────────────────────────── */}
        <Box layoutDirection="row" gap={8} style={{ flexWrap: 'wrap' }}>
          <Box gap={2} style={{ backgroundColor: theme.successSurface, borderRadius: 8, padding: 12, flex: 1, minWidth: 200 }}>
            <Text role="caption" style={{ fontWeight: '800', color: theme.success, fontSize: 12 }}>✓ ما يملكه الشريك</Text>
            {PARTNER_CAN_EDIT.map((item) => (
              <Text key={item} role="caption" style={{ color: theme.text, fontSize: 11 }}>• {item}</Text>
            ))}
          </Box>
          <Box gap={2} style={{ backgroundColor: theme.dangerSurface, borderRadius: 8, padding: 12, flex: 1, minWidth: 200 }}>
            <Text role="caption" style={{ fontWeight: '800', color: theme.danger, fontSize: 12 }}>✗ ما لا يملكه الشريك</Text>
            {PARTNER_CANNOT_DO.map((item) => (
              <Text key={item} role="caption" style={{ color: theme.danger, fontSize: 11 }}>• {item}</Text>
            ))}
          </Box>
        </Box>

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <Box gap={2}>
          <SectionTitle>الإجراءات</SectionTitle>
          <Box layoutDirection="row" gap={8} style={{ flexWrap: 'wrap' }}>
            <Button
              label="استلام الإدخال"
              tone="primary"
              size="sm"
              onPress={handleAcceptIntake}
              disabled={!allSatisfied}
              accessibilityHint={allSatisfied ? undefined : 'قائمة الجاهزية غير مكتملة'}
            />
            <Button
              label="تصعيد للكتالوج"
              tone="secondary"
              size="sm"
              onPress={handleEscalateToCatalog}
            />
          </Box>
          <Text role="caption" tone="muted" style={{ fontSize: 10 }}>
            UI_PREVIEW_ONLY — جميع الإجراءات محاكاة محلية
          </Text>
        </Box>

        <ResultBanner result={actionResult} />

        <Button label="إغلاق" tone="ghost" size="sm" onPress={onClose} style={{ marginTop: 8 }} />
      </Box>
    </Box>
  );
}
