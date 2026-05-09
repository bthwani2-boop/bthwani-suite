/**
 * WLT-owned control-panel finance preview component.
 *
 * PREVIEW ONLY — no real ledger, no real payment, no API.
 * WltDshFinanceControlPanelContent: composable, no scroll wrapper — mount in web shell.
 * WltDshFinanceControlPanelPreview: full mobile-first screen with TopBar.
 * Contract state: CONTRACT_TBD — real finance flows blocked.
 */

import React from 'react';
import { View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Icon,
  KeyValueList,
  MobileScrollView,
  StateView,
  Surface,
  Text,
  TopBar,
} from '@bthwani/ui-kit';
import {
  getWltControlPanelFinancePreview,
  type WltDshFinancePreviewRecord,
} from '../../shared/finance/dshFinancePreview';

const PREVIEW_NOTICE =
  'هذا عرض تجريبي للهيكل المالي فقط — لا يمثّل بيانات حقيقية ولا تسويات فعلية ولا دفعات منفّذة. العقد: CONTRACT_TBD.';

function PreviewBanner() {
  return (
    <Surface tone="inset" padding={3}>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 10 }}>
        <Icon name="information-circle-outline" size={18} tone="muted" />
        <Text role="bodySm" tone="muted" style={{ flex: 1, textAlign: 'right', lineHeight: 20 }}>
          {PREVIEW_NOTICE}
        </Text>
      </View>
    </Surface>
  );
}

function RecordRow({ record }: { record: WltDshFinancePreviewRecord }) {
  const amountTone = record.tone === 'positive' ? 'success'
    : record.tone === 'negative' ? 'error'
    : 'info';

  return (
    <Surface tone="raised" padding={3} gap={2}>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1, gap: 3, alignItems: 'flex-end' }}>
          <Text role="bodyStrong" style={{ textAlign: 'right' }} numberOfLines={1}>
            {record.title}
          </Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }} numberOfLines={1}>
            {record.subtitle}
          </Text>
          <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
            {record.timeLabel}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-start', gap: 5, flexShrink: 0 }}>
          <Text role="bodyStrong" tone={amountTone} style={{ textAlign: 'left' }}>
            {record.amountLabel}
          </Text>
          <Badge label={record.statusLabel} tone={record.statusTone} />
        </View>
      </View>
    </Surface>
  );
}

function RecordList({ records }: { records: WltDshFinancePreviewRecord[] }) {
  if (records.length === 0) return null;
  return (
    <Box gap={2}>
      {records.map((r) => <RecordRow key={r.id} record={r} />)}
    </Box>
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
  return (
    <Surface tone="raised" padding={3} gap={3}>
      <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
        {title}
      </Text>
      {records.length === 0 ? (
        <StateView stateId="empty" title={emptyLabel} description="" />
      ) : (
        <RecordList records={records} />
      )}
    </Surface>
  );
}

function ClientPaymentBreakdown({ records }: { records: WltDshFinancePreviewRecord[] }) {
  const walletRecords = records.filter((r) => r.kind === 'wallet-payment');
  const codRecords = records.filter((r) => r.kind === 'cash-on-delivery');
  const directRecords = records.filter((r) => r.kind === 'client-payment');
  const refundRecords = records.filter((r) => r.kind === 'refund-adjustment');

  return (
    <Surface tone="raised" padding={3} gap={3}>
      <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
        مدفوعات العملاء — تفصيل
      </Text>
      {walletRecords.length > 0 && (
        <Box gap={2}>
          <Text role="caption" tone="info" style={{ textAlign: 'right' }}>دفع بالمحفظة</Text>
          <RecordList records={walletRecords} />
        </Box>
      )}
      {codRecords.length > 0 && (
        <Box gap={2}>
          <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>دفع عند الاستلام (COD)</Text>
          <RecordList records={codRecords} />
        </Box>
      )}
      {directRecords.length > 0 && (
        <Box gap={2}>
          <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>مدفوعات مباشرة</Text>
          <RecordList records={directRecords} />
        </Box>
      )}
      {refundRecords.length > 0 && (
        <Box gap={2}>
          <Text role="caption" tone="warning" style={{ textAlign: 'right' }}>استردادات</Text>
          <RecordList records={refundRecords} />
        </Box>
      )}
      {records.length === 0 && (
        <StateView stateId="empty" title="لا توجد مدفوعات عملاء" description="" />
      )}
    </Surface>
  );
}

function CaptainFinanceBreakdown({ records }: { records: WltDshFinancePreviewRecord[] }) {
  const codRecords = records.filter((r) => r.kind === 'cash-on-delivery');
  const earningRecords = records.filter((r) => r.kind === 'captain-earning');

  return (
    <Surface tone="raised" padding={3} gap={3}>
      <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
        مالية الكابتن — تفصيل
      </Text>
      {codRecords.length > 0 && (
        <Box gap={2}>
          <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>رصيد COD المحصّل</Text>
          <RecordList records={codRecords} />
        </Box>
      )}
      {earningRecords.length > 0 && (
        <Box gap={2}>
          <Text role="caption" tone="success" style={{ textAlign: 'right' }}>أرباح التوصيل</Text>
          <RecordList records={earningRecords} />
        </Box>
      )}
      {records.length === 0 && (
        <StateView stateId="empty" title="لا توجد بيانات كابتن" description="" />
      )}
      <StateView
        kind="warning"
        title="تسوية الكابتن مقفلة — CONTRACT_TBD"
        description="لا يمكن تحويل COD أو صرف أرباح حتى يُربط الـ API المالي."
      />
    </Surface>
  );
}

function FieldFinanceDetail({ records }: { records: WltDshFinancePreviewRecord[] }) {
  const commissionRecords = records.filter((r) => r.kind === 'field-commission');
  const payoutRecords = records.filter((r) => r.kind === 'field-payout');

  return (
    <Surface tone="raised" padding={3} gap={3}>
      <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
        مالية الميدانيين — تفصيل
      </Text>
      {commissionRecords.length > 0 && (
        <Box gap={2}>
          <Text role="caption" tone="success" style={{ textAlign: 'right' }}>عمولات الاستقطاب</Text>
          <RecordList records={commissionRecords} />
        </Box>
      )}
      {payoutRecords.length > 0 && (
        <Box gap={2}>
          <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>سجل الصرف</Text>
          <RecordList records={payoutRecords} />
        </Box>
      )}
      {records.length === 0 && (
        <StateView stateId="empty" title="لا توجد بيانات ميدانيين" description="" />
      )}
      <StateView
        kind="warning"
        title="صرف الميداني مقفل — CONTRACT_TBD"
        description="لا يمكن إجراء صرف عمولة حتى يُربط الـ API المالي."
      />
    </Surface>
  );
}

export type WltDshFinanceControlPanelPreviewProps = {
  onBack?: () => void;
};

export function WltDshFinanceControlPanelContent() {
  const preview = React.useMemo(() => getWltControlPanelFinancePreview(), []);
  const [showReconciliation, setShowReconciliation] = React.useState(false);

  const reconciliationRecords = preview.allRecords.filter(
    (r) => r.kind === 'reconciliation-export',
  );

  return (
    <Box gap={4}>
      <PreviewBanner />

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
          الملخص المالي الإجمالي
        </Text>
        <KeyValueList
          dense
          items={[
            { label: 'إجمالي الدخل', value: preview.totalInflowLabel, tone: 'success' },
            { label: 'إجمالي الصرف', value: preview.totalOutflowLabel, tone: 'error' },
            { label: 'الصافي', value: preview.netLabel, tone: 'info' },
            { label: 'حالة العقد', value: preview.contractState, tone: 'warning' },
          ]}
        />
        <StateView
          kind="warning"
          title="الإجراءات المالية الحقيقية مقفلة"
          description="جميع الأرقام أعلاه تجريبية. لا يمكن إجراء أي عملية مالية حقيقية حتى يُرفع وضع CONTRACT_TBD."
        />
      </Surface>

      <ClientPaymentBreakdown records={preview.clientRecords} />

      <SectionBlock
        title="تسويات الشركاء"
        records={preview.partnerRecords}
        emptyLabel="لا توجد تسويات شركاء"
      />

      <CaptainFinanceBreakdown records={preview.captainRecords} />

      <FieldFinanceDetail records={preview.fieldRecords} />

      <SectionBlock
        title="عمولة المنصة والاسترداد"
        records={preview.platformRecords.filter((r) => r.kind !== 'reconciliation-export')}
        emptyLabel="لا توجد بيانات"
      />

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
          مطابقة التسويات — Export Preview
        </Text>
        <StateView
          kind="warning"
          title="مطابقة التسويات — معطّلة"
          description="هذه الخاصية تحتاج ربطًا بـ API حقيقي لم يُعرَّف بعد. يبقى العقد CONTRACT_TBD."
        />
        <Button
          label={showReconciliation ? 'إخفاء سجلات المطابقة' : 'عرض سجلات المطابقة التجريبية'}
          tone="ghost"
          fullWidth={false}
          onPress={() => setShowReconciliation((v) => !v)}
        />
        {showReconciliation && (
          <Box gap={2}>
            {reconciliationRecords.length === 0 ? (
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                لا توجد سجلات مطابقة
              </Text>
            ) : (
              reconciliationRecords.map((r) => <RecordRow key={r.id} record={r} />)
            )}
          </Box>
        )}
      </Surface>

      <PreviewBanner />
    </Box>
  );
}

export function WltDshFinanceControlPanelPreview({
  onBack,
}: WltDshFinanceControlPanelPreviewProps) {
  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 120 }}>
      <TopBar
        variant="secondary"
        title="لوحة المالية — DSH × WLT"
        style={{ marginHorizontal: -16, marginTop: -16 }}
        trailingAction={
          onBack
            ? {
                id: 'back',
                icon: <Icon name="arrow-back" size={24} tone="brand" />,
                mirrorInRtl: true,
                accessibilityLabel: 'رجوع',
                onPress: onBack,
              }
            : undefined
        }
      />
      <WltDshFinanceControlPanelContent />
    </MobileScrollView>
  );
}

export default WltDshFinanceControlPanelPreview;
