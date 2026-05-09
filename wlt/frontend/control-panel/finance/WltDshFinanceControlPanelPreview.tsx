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
  StateView,
  Surface,
  Text,
} from '@bthwani/ui-kit';
import {
  getWltControlPanelFinancePreview,
  type WltDshFinancePreviewRecord,
} from '../../shared/finance/dshFinancePreview';
import styles from '../../../../dsh/frontend/control-panel/operations/dsh-surface.module.css';
import { OperationsSuggestionCard } from '../../../../dsh/frontend/control-panel/operations/operations.ui';

const PREVIEW_NOTICE =
  'هذا عرض تجريبي للهيكل المالي فقط — لا يمثّل بيانات حقيقية ولا تسويات فعلية ولا دفعات منفّذة. العقد: CONTRACT_TBD.';

function PreviewBanner() {
  return (
    <Surface tone="inset" padding={3} style={{ backgroundColor: '#FFFBEB', borderColor: '#FEF3C7', borderLeftWidth: 4, borderLeftColor: '#D97706', borderRadius: '8px' }}>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 10 }}>
        <Icon name="information-circle-outline" size={18} tone="muted" />
        <Text role="bodySm" tone="muted" style={{ flex: 1, textAlign: 'right', lineHeight: 20, color: '#92400E', fontWeight: '700' }}>
          {PREVIEW_NOTICE}
        </Text>
      </View>
    </Surface>
  );
}

function FinanceRecordCard({ record }: { record: WltDshFinancePreviewRecord }) {
  const statusClassName = record.statusTone === 'success' ? styles.liveOrdersStatusBest :
                         record.statusTone === 'warning' ? styles.liveOrdersStatusWarning :
                         record.statusTone === 'error' ? styles.liveOrdersStatusDanger : styles.liveOrdersStatusBrand;

  const cardClassName = [
    styles.liveOrdersOrderCard,
    record.statusTone === 'error' ? styles.liveOrdersOrderCardDanger : '',
    record.statusTone === 'warning' ? styles.liveOrdersOrderCardWarning : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClassName}>
      <div className={styles.liveOrdersOrderMeta}>
        <div className={styles.liveOrdersOrderTopRow}>
          <span className={styles.liveOrdersOrderId}>{record.id}</span>
          <span className={`${styles.liveOrdersOrderStatus} ${statusClassName}`}>{record.statusLabel}</span>
          <span className={styles.liveOrdersRingHint}>{record.timeLabel}</span>
        </div>
        <div className={styles.liveOrdersDestination}>{record.title}</div>
        <div className={styles.liveOrdersMetaText}>{record.subtitle}</div>
        <div className={styles.liveOrdersNoteText} style={{ fontWeight: 800, color: record.tone === 'positive' ? '#16A34A' : record.tone === 'negative' ? '#DC2626' : '#0A2F5C' }}>
          المبلغ: {record.amountLabel}
        </div>
      </div>

      <OperationsSuggestionCard
        label="توصية النظام: مطابقة المعاملة"
        reason="المعاملة تتوافق مع سجلات البوابة البنكية والطلبات المرتبطة."
        confidence="high"
        actions={(
          <div className={styles.liveOrdersActionGrid}>
            <button className={styles.liveOrdersActionPrimary}>تسوية فورية</button>
            <button className={styles.liveOrdersActionSecondary}>تدقيق يدوي</button>
          </div>
        )}
      >
        <span className={styles.liveOrdersSuggestionChip}>تم التحقق</span>
      </OperationsSuggestionCard>

      <div className={styles.liveOrdersOrderActions}>
        <div className={styles.liveOrdersTimelineTitle}>الحالة المالية</div>
        <div className={styles.liveOrdersTimelineList}>
          <div>• استلام الدفعة</div>
          <div>• بانتظار المقاصة</div>
        </div>
        <div className={styles.liveOrdersActionGrid} style={{ marginTop: 'auto' }}>
           <button className={styles.liveOrdersActionSecondary}>تفاصيل السجل</button>
        </div>
      </div>
    </div>
  );
}

function RecordList({ records }: { records: WltDshFinancePreviewRecord[] }) {
  if (records.length === 0) return null;
  return (
    <div className={styles.liveOrdersCardsStack}>
      {records.map((r) => <FinanceRecordCard key={r.id} record={r} />)}
    </div>
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
    <Box gap={3} style={{ marginBottom: '16px' }}>
      <Text role="label" style={{ textAlign: 'right', fontWeight: '900', color: '#0A2F5C', fontSize: '14px' }}>
        {title}
      </Text>
      {records.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
          <Text tone="muted">{emptyLabel}</Text>
        </div>
      ) : (
        <RecordList records={records} />
      )}
    </Box>
  );
}

function ClientPaymentBreakdown({ records }: { records: WltDshFinancePreviewRecord[] }) {
  const walletRecords = records.filter((r) => r.kind === 'wallet-payment');
  const codRecords = records.filter((r) => r.kind === 'cash-on-delivery');
  const directRecords = records.filter((r) => r.kind === 'client-payment');
  const refundRecords = records.filter((r) => r.kind === 'refund-adjustment');

  return (
    <Box gap={4} style={{ marginBottom: '16px' }}>
      <Text role="label" style={{ textAlign: 'right', fontWeight: '900', color: '#0A2F5C', fontSize: '14px' }}>
        مدفوعات العملاء — تفصيل
      </Text>
      {walletRecords.length > 0 && (
        <Box gap={2}>
          <Text role="caption" tone="info" style={{ textAlign: 'right', fontWeight: '800' }}>دفع بالمحفظة</Text>
          <RecordList records={walletRecords} />
        </Box>
      )}
      {codRecords.length > 0 && (
        <Box gap={2}>
          <Text role="caption" tone="muted" style={{ textAlign: 'right', fontWeight: '800' }}>دفع عند الاستلام (COD)</Text>
          <RecordList records={codRecords} />
        </Box>
      )}
      {directRecords.length > 0 && (
        <Box gap={2}>
          <Text role="caption" tone="muted" style={{ textAlign: 'right', fontWeight: '800' }}>مدفوعات مباشرة</Text>
          <RecordList records={directRecords} />
        </Box>
      )}
      {refundRecords.length > 0 && (
        <Box gap={2}>
          <Text role="caption" tone="warning" style={{ textAlign: 'right', fontWeight: '800' }}>استردادات</Text>
          <RecordList records={refundRecords} />
        </Box>
      )}
      {records.length === 0 && (
        <div style={{ padding: '24px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
           <Text tone="muted">لا توجد مدفوعات عملاء</Text>
        </div>
      )}
    </Box>
  );
}

function CaptainFinanceBreakdown({ records }: { records: WltDshFinancePreviewRecord[] }) {
  const codRecords = records.filter((r) => r.kind === 'cash-on-delivery');
  const earningRecords = records.filter((r) => r.kind === 'captain-earning');

  return (
    <Box gap={3} style={{ marginBottom: '16px' }}>
      <Text role="label" style={{ textAlign: 'right', fontWeight: '900', color: '#0A2F5C', fontSize: '14px' }}>
        مالية الكابتن — تفصيل
      </Text>
      {codRecords.length > 0 && (
        <Box gap={2}>
          <Text role="caption" tone="muted" style={{ textAlign: 'right', fontWeight: '800' }}>رصيد COD المحصّل</Text>
          <RecordList records={codRecords} />
        </Box>
      )}
      {earningRecords.length > 0 && (
        <Box gap={2}>
          <Text role="caption" tone="success" style={{ textAlign: 'right', fontWeight: '800' }}>أرباح التوصيل</Text>
          <RecordList records={earningRecords} />
        </Box>
      )}
      {records.length === 0 && (
        <div style={{ padding: '24px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
           <Text tone="muted">لا توجد بيانات كابتن</Text>
        </div>
      )}
    </Box>
  );
}

function FieldFinanceDetail({ records }: { records: WltDshFinancePreviewRecord[] }) {
  const commissionRecords = records.filter((r) => r.kind === 'field-commission');
  const payoutRecords = records.filter((r) => r.kind === 'field-payout');

  return (
    <Box gap={3} style={{ marginBottom: '16px' }}>
      <Text role="label" style={{ textAlign: 'right', fontWeight: '900', color: '#0A2F5C', fontSize: '14px' }}>
        مالية الميدانيين — تفصيل
      </Text>
      {commissionRecords.length > 0 && (
        <Box gap={2}>
          <Text role="caption" tone="success" style={{ textAlign: 'right', fontWeight: '800' }}>عمولات الاستقطاب</Text>
          <RecordList records={commissionRecords} />
        </Box>
      )}
      {payoutRecords.length > 0 && (
        <Box gap={2}>
          <Text role="caption" tone="muted" style={{ textAlign: 'right', fontWeight: '800' }}>سجل الصرف</Text>
          <RecordList records={payoutRecords} />
        </Box>
      )}
    </Box>
  );
}

export type WltDshFinanceControlPanelPreviewProps = {
  onBack?: () => void;
};

export function WltDshFinanceControlPanelContent({
  hideHeader = false
}: {
  hideHeader?: boolean
} = {}) {
  const preview = React.useMemo(() => getWltControlPanelFinancePreview(), []);
  const [showReconciliation, setShowReconciliation] = React.useState(false);

  const reconciliationRecords = preview.allRecords.filter(
    (r) => r.kind === 'reconciliation-export',
  );

  const content = (
    <Box style={{ padding: '16px', flex: 1 }} gap={4}>
      <PreviewBanner />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

        <Box gap={3} style={{ marginBottom: '16px' }}>
          <Text role="label" style={{ textAlign: 'right', fontWeight: '900', color: '#0A2F5C', fontSize: '14px' }}>
            مطابقة التسويات — Export Preview
          </Text>
          <div style={{ padding: '20px', backgroundColor: '#FFFBEB', borderRadius: '12px', border: '1px solid #FEF3C7' }}>
             <Text role="bodySm" style={{ color: '#92400E', fontWeight: '700', textAlign: 'right' }}>مطابقة التسويات — معطّلة: هذه الخاصية تحتاج ربطًا بـ API حقيقي لم يُعرَّف بعد.</Text>
          </div>
          <Button
            label={showReconciliation ? 'إخفاء سجلات المطابقة' : 'عرض سجلات المطابقة التجريبية'}
            tone="secondary"
            fullWidth={false}
            size="sm"
            onPress={() => setShowReconciliation((v) => !v)}
          />
          {showReconciliation && (
            <Box gap={2}>
              {reconciliationRecords.length === 0 ? (
                <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                  لا توجد سجلات مطابقة
                </Text>
              ) : (
                <div className={styles.liveOrdersCardsStack}>
                  {reconciliationRecords.map((r) => <FinanceRecordCard key={r.id} record={r} />)}
                </div>
              )}
            </Box>
          )}
        </Box>
      </div>
    </Box>
  );

  if (hideHeader) {
    return content;
  }

  return (
    <div className={styles.operationsCockpit} dir="rtl">
      {/* 1. Header Area - Finance Command Deck */}
      <header className={`${styles.operationsTopBar} ${styles.premiumGlass}`}>
        <div className={styles.operationsTitleBlock}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#0A2F5C',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            boxShadow: '0 4px 12px rgba(10, 47, 92, 0.2)'
          }}>
            💰
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>مالية DSH</h1>
              <span style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: '#FEF3C7', color: '#D97706', borderRadius: '4px', fontWeight: '800' }}>CONTRACT_TBD</span>
            </div>
            <p style={{ fontSize: '10px', fontWeight: 600 }}>مراقبة التدفقات المالية والتسويات المركزية</p>
          </div>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact}>
             <div className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>إجمالي الدخل</span>
                <span className={styles.commandKpiValue} style={{ color: '#16A34A' }}>{preview.totalInflowLabel}</span>
             </div>
             <div className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>إجمالي الصرف</span>
                <span className={styles.commandKpiValue} style={{ color: '#DC2626' }}>{preview.totalOutflowLabel}</span>
             </div>
             <div className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>الصافي</span>
                <span className={styles.commandKpiValue} style={{ color: '#0A2F5C' }}>{preview.netLabel}</span>
             </div>
          </div>
        </div>
      </header>

      {/* 2. Content Area */}
      <main className={styles.operationsMainPanel}>
        <div className={styles.operationsInnerScroll}>
          {content}
        </div>
      </main>
    </div>
  );
}

export function WltDshFinanceControlPanelPreview() {
  return <WltDshFinanceControlPanelContent />;
}

export default WltDshFinanceControlPanelPreview;
