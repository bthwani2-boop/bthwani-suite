import React from 'react';
import {
  Box,
  Text,
  useTheme,
} from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelRecommendation,
} from '@bthwani/ui-kit/web';
import {
  getWltControlPanelFinancePreview,
  type WltDshFinancePreviewRecord,
} from '../../shared/finance/dshFinancePreview';

const PREVIEW_NOTICE =
  'هذا عرض تجريبي للهيكل المالي فقط — لا يمثل بيانات حقيقية ولا تسويات فعلية ولا دفعات منفذة. العقد: CONTRACT_TBD.';

function FinanceRecordCard({ record }: { record: WltDshFinancePreviewRecord }) {
  return (
    <WebControlPanelDecisionRow
      entityId={record.id}
      entityLabel={record.title}
      status={record.statusLabel}
      statusTone={record.statusTone === 'success' ? 'success' : record.statusTone === 'warning' ? 'warning' : record.statusTone === 'error' ? 'danger' : 'neutral'}
      risk={record.statusTone === 'error' ? 'danger' : record.statusTone === 'warning' ? 'warning' : 'neutral'}
      recommendation="مطابقة المعاملة"
      reason="المعاملة تتوافق مع سجلات البوابة البنكية والطلبات المرتبطة."
      sla={record.timeLabel}
      primaryAction={{ label: 'تسوية فورية', onAction: () => {} }}
      secondaryAction={{ label: 'تفاصيل السجل', onAction: () => {} }}
    />
  );
}

function SectionBlock({
  title,
  records,
  emptyLabel,
}: {
  title: string;
  records: WltDshFinancePreviewRecord[];
  emptyLabel: string;
}) {
  const { theme } = useTheme();

  return (
    <Box gap={3}>
      <Text role="label" style={{ textAlign: 'right', fontWeight: '900', color: theme.text, fontSize: '14px' }}>
        {title}
      </Text>
      {records.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', backgroundColor: theme.surface, borderRadius: '12px', border: `1px solid ${theme.line}` }}>
          <Text tone="muted">{emptyLabel}</Text>
        </div>
      ) : (
        <Box gap={2}>
          {records.map((r) => <FinanceRecordCard key={r.id} record={r} />)}
        </Box>
      )}
    </Box>
  );
}

function BreakdownSection({ title, label, records }: { title: string; label: string; records: WltDshFinancePreviewRecord[] }) {
  const { theme } = useTheme();
  if (records.length === 0) return null;
  return (
    <Box gap={2}>
      <Text role="caption" style={{ textAlign: 'right', fontWeight: '800', color: theme.textMuted }}>{label}</Text>
      <Box gap={2}>
        {records.map((r) => <FinanceRecordCard key={r.id} record={r} />)}
      </Box>
    </Box>
  );
}

export function WltDshFinanceControlPanelContent({
  hideHeader = false
}: {
  hideHeader?: boolean
} = {}) {
  const { theme } = useTheme();
  const preview = React.useMemo(() => getWltControlPanelFinancePreview(), []);

  const content = (
    <Box style={{ padding: '16px' }} gap={6}>
      <WebControlPanelRecommendation
        title="تنبيه: الهيكل المالي التجريبي"
        reason={PREVIEW_NOTICE}
        confidence="high"
        auditTag="CONTRACT_TBD"
      />

      <Box gap={6}>
        <Box gap={4}>
          <Text role="label" style={{ textAlign: 'right', fontWeight: '900', color: theme.text, fontSize: '14px' }}>
            مدفوعات العملاء — تفصيل
          </Text>
          <BreakdownSection title="مدفوعات العملاء" label="دفع بالمحفظة" records={preview.clientRecords.filter(r => r.kind === 'wallet-payment')} />
          <BreakdownSection title="مدفوعات العملاء" label="دفع عند الاستلام (COD)" records={preview.clientRecords.filter(r => r.kind === 'cash-on-delivery')} />
        </Box>

        <SectionBlock
          title="تسويات الشركاء"
          records={preview.partnerRecords}
          emptyLabel="لا توجد تسويات شركاء"
        />

        <Box gap={4}>
          <Text role="label" style={{ textAlign: 'right', fontWeight: '900', color: theme.text, fontSize: '14px' }}>
            مالية الكابتن — تفصيل
          </Text>
          <BreakdownSection title="مالية الكابتن" label="أرباح التوصيل" records={preview.captainRecords.filter(r => r.kind === 'captain-earning')} />
        </Box>

        <SectionBlock
          title="عمولة المنصة والاسترداد"
          records={preview.platformRecords.filter((r) => r.kind !== 'reconciliation-export')}
          emptyLabel="لا توجد بيانات"
        />
      </Box>
    </Box>
  );

  return content;
}

export function WltDshFinanceControlPanelPreview() {
  return <WltDshFinanceControlPanelContent />;
}

export default WltDshFinanceControlPanelPreview;
