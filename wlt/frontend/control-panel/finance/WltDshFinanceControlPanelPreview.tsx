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

function RecordRow({ record }: { record: WltDshFinancePreviewRecord }) {
  const amountTone = record.tone === 'positive' ? 'success'
    : record.tone === 'negative' ? 'error'
    : 'info';

  return (
    <Surface tone="raised" padding={3} gap={2} style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '10px' }}>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1, gap: 3, alignItems: 'flex-end' }}>
          <Text role="bodyStrong" style={{ textAlign: 'right', color: '#0A2F5C' }} numberOfLines={1}>
            {record.title}
          </Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }} numberOfLines={1}>
            {record.subtitle}
          </Text>
          <Text role="caption" tone="soft" style={{ textAlign: 'right', fontSize: '9px' }}>
            {record.timeLabel}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-start', gap: 5, flexShrink: 0 }}>
          <Text role="bodyStrong" tone={amountTone} style={{ textAlign: 'left', fontWeight: '900' }}>
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
    <Surface tone="raised" padding={4} gap={3} style={{ borderRadius: '12px', border: '1px solid rgba(10,47,92,0.06)' }}>
      <Text role="label" tone="muted" style={{ textAlign: 'right', fontWeight: '900', color: '#0A2F5C' }}>
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
    <Surface tone="raised" padding={4} gap={3} style={{ borderRadius: '12px', border: '1px solid rgba(10,47,92,0.06)' }}>
      <Text role="label" tone="muted" style={{ textAlign: 'right', fontWeight: '900', color: '#0A2F5C' }}>
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
        <StateView stateId="empty" title="لا توجد مدفوعات عملاء" description="" />
      )}
    </Surface>
  );
}

function CaptainFinanceBreakdown({ records }: { records: WltDshFinancePreviewRecord[] }) {
  const codRecords = records.filter((r) => r.kind === 'cash-on-delivery');
  const earningRecords = records.filter((r) => r.kind === 'captain-earning');

  return (
    <Surface tone="raised" padding={4} gap={3} style={{ borderRadius: '12px', border: '1px solid rgba(10,47,92,0.06)' }}>
      <Text role="label" tone="muted" style={{ textAlign: 'right', fontWeight: '900', color: '#0A2F5C' }}>
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
        <StateView stateId="empty" title="لا توجد بيانات كابتن" description="" />
      )}
    </Surface>
  );
}

function FieldFinanceDetail({ records }: { records: WltDshFinancePreviewRecord[] }) {
  const commissionRecords = records.filter((r) => r.kind === 'field-commission');
  const payoutRecords = records.filter((r) => r.kind === 'field-payout');

  return (
    <Surface tone="raised" padding={4} gap={3} style={{ borderRadius: '12px', border: '1px solid rgba(10,47,92,0.06)' }}>
      <Text role="label" tone="muted" style={{ textAlign: 'right', fontWeight: '900', color: '#0A2F5C' }}>
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
    </Surface>
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

  return (
    <div className={styles.operationsCockpit} dir="rtl">
      {/* 1. Header Area - Finance Command Deck */}
      {!hideHeader && (
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
      )}

      {/* 2. Content Area */}
      <main className={hideHeader ? '' : styles.operationsMainPanel}>
        <div className={hideHeader ? '' : styles.operationsInnerScroll}>
          <Box style={{ padding: '16px', flex: 1 }} gap={4}>
            <PreviewBanner />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
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

              <Surface tone="raised" padding={4} gap={3} style={{ borderRadius: '12px', border: '1px solid rgba(10,47,92,0.06)' }}>
                <Text role="label" tone="muted" style={{ textAlign: 'right', fontWeight: '900', color: '#0A2F5C' }}>
                  مطابقة التسويات — Export Preview
                </Text>
                <StateView
                  kind="warning"
                  title="مطابقة التسويات — معطّلة"
                  description="هذه الخاصية تحتاج ربطًا بـ API حقيقي لم يُعرَّف بعد."
                />
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
                      reconciliationRecords.map((r) => <RecordRow key={r.id} record={r} />)
                    )}
                  </Box>
                )}
              </Surface>
            </div>
          </Box>
        </div>
      </main>
    </div>
  );
}

export function WltDshFinanceControlPanelPreview() {
  return <WltDshFinanceControlPanelContent />;
}

export default WltDshFinanceControlPanelPreview;
