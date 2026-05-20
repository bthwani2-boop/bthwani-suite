import React from 'react';
import {
  Box,
  Text,
} from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelRecommendation,
} from '@bthwani/ui-kit/web';
import {
  getWltControlPanelFinancePreview,
  getWltCaptainFinanceSnapshot,
  getWltDshStoreDeliveryFinancePreview,
  type WltDshFinancePreviewRecord,
} from '../../shared/finance/dshFinancePreview';
import styles from './wlt-finance-control-panel.module.css';

const PREVIEW_NOTICE =
  'هذا عرض تجريبي للهيكل المالي فقط — لا يمثل بيانات حقيقية ولا تسويات فعلية ولا دفعات منفذة. العملة: ر.ي. العقد: CONTRACT_TBD.';

function FinanceRecordCard({ record }: { record: WltDshFinancePreviewRecord }) {
  return (
    <WebControlPanelDecisionRow
      entityId={record.id}
      entityLabel={`${record.title} · ${record.amountLabel}`}
      status={record.statusLabel}
      statusTone={
        record.statusTone === 'success' ? 'success'
          : record.statusTone === 'warning' ? 'warning'
          : record.statusTone === 'error' ? 'danger'
          : 'neutral'
      }
      risk={
        record.statusTone === 'error' ? 'danger'
          : record.statusTone === 'warning' ? 'warning'
          : 'neutral'
      }
      recommendation={`مطابقة المعاملة — ${record.subtitle}`}
      reason={`الجهة: ${record.actor} · المصدر: ${record.sourceOrderId ?? record.sourceStoreId ?? record.sourceCaptainId ?? record.sourceFieldAgentId ?? '—'}`}
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
  return (
    <Box gap={3}>
      <Text role="label" className={styles.sectionTitle}>
        {title}
      </Text>
      {records.length === 0 ? (
        <div className={styles.emptyBlock}>
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

function StoreDeliveryFinanceSection() {
  const storeDelivery = React.useMemo(() => getWltDshStoreDeliveryFinancePreview(), []);
  return (
    <Box gap={3}>
      <Text role="label" className={styles.sectionTitle}>
        مالية توصيل المتجر (partner_delivery)
      </Text>
      <WebControlPanelRecommendation
        title="فصل مالي: توصيل المتجر ≠ تسوية كابتن بثواني"
        reason={storeDelivery.separationNote}
        confidence="high"
        auditTag="CONTRACT_TBD"
      />
      <SectionBlock
        title="رسوم توصيل المتجر (من العميل)"
        records={storeDelivery.feeRecords}
        emptyLabel="لا توجد رسوم توصيل متجر"
      />
      <SectionBlock
        title="تعويض موصل المتجر (من المتجر لموصله الداخلي)"
        records={storeDelivery.compensationRecords}
        emptyLabel="لا يوجد تعويض مسجّل"
      />
    </Box>
  );
}

function CaptainEligibilitySection() {
  const snapshot = React.useMemo(() => getWltCaptainFinanceSnapshot(), []);

  return (
    <Box gap={3}>
      <Text role="label" className={styles.sectionTitle}>
        أهلية الكابتن — الرصيد الضامن
      </Text>
      <WebControlPanelDecisionRow
        entityId="CAP-ELIGIBILITY-PREVIEW"
        entityLabel={`الرصيد الضامن: ${snapshot.eligibilityBalanceLabel} · الحد الأدنى: ${snapshot.minimumEligibilityLabel}`}
        status={snapshot.isEligible ? 'مؤهل' : 'غير مؤهل'}
        statusTone={snapshot.isEligible ? 'success' : 'warning'}
        risk={snapshot.hasEligibilityBlock ? 'warning' : 'neutral'}
        recommendation={snapshot.eligibilityBlockReason}
        reason={`النقص: ${snapshot.eligibilityShortfallLabel} · CONTRACT_TBD`}
        sla="مراجعة فورية"
        primaryAction={{ label: 'إشعار الكابتن بالشحن', onAction: () => {} }}
        secondaryAction={{ label: 'فتح ملف الكابتن', onAction: () => {} }}
      />
    </Box>
  );
}

function FinanceKpiBar({
  totalInflowLabel,
  totalOutflowLabel,
  netLabel,
}: {
  totalInflowLabel: string;
  totalOutflowLabel: string;
  netLabel: string;
}) {
  return (
    <div className={styles.kpiBar}>
      <div className={styles.kpiItem}>
        <div className={styles.kpiLabel}>إجمالي التدفقات</div>
        <div className={`${styles.kpiValue} ${styles.kpiValueInflow}`}>{totalInflowLabel}</div>
      </div>
      <div className={styles.kpiItem}>
        <div className={styles.kpiLabel}>إجمالي المصروفات</div>
        <div className={`${styles.kpiValue} ${styles.kpiValueOutflow}`}>{totalOutflowLabel}</div>
      </div>
      <div className={styles.kpiItem}>
        <div className={styles.kpiLabel}>الصافي</div>
        <div className={`${styles.kpiValue} ${styles.kpiValueNet}`}>{netLabel}</div>
      </div>
    </div>
  );
}

export function WltDshFinanceControlPanelContent({
  hideHeader = false,
}: {
  hideHeader?: boolean;
} = {}) {
  const preview = React.useMemo(() => getWltControlPanelFinancePreview(), []);

  return (
    <Box className={styles.financePreviewWrap} gap={6}>
      <WebControlPanelRecommendation
        title="تنبيه: الهيكل المالي التجريبي — ر.ي"
        reason={PREVIEW_NOTICE}
        confidence="high"
        auditTag="CONTRACT_TBD"
      />

      <FinanceKpiBar
        totalInflowLabel={preview.totalInflowLabel}
        totalOutflowLabel={preview.totalOutflowLabel}
        netLabel={preview.netLabel}
      />

      <Box gap={6}>
        {/* مدفوعات العملاء */}
        <Box gap={4}>
          <Text role="label" className={styles.sectionTitle}>
            مدفوعات العملاء
          </Text>
          <SectionBlock
            title="دفع بالمحفظة (WLT)"
            records={preview.clientRecords.filter((r) => r.kind === 'wallet-payment')}
            emptyLabel="لا توجد مدفوعات بالمحفظة"
          />
          <SectionBlock
            title="استردادات العملاء"
            records={preview.clientRecords.filter((r) => r.kind === 'refund-adjustment')}
            emptyLabel="لا توجد استردادات"
          />
        </Box>

        {/* أهلية الكابتن */}
        <CaptainEligibilitySection />

        {/* مالية الكابتن */}
        <Box gap={4}>
          <Text role="label" className={styles.sectionTitle}>
            مالية الكابتن
          </Text>
          <SectionBlock
            title="ذمة COD — تحصيل نقدي مستحق"
            records={preview.captainRecords.filter((r) => r.kind === 'captain-cod-liability')}
            emptyLabel="لا توجد ذمة COD مفتوحة"
          />
          <SectionBlock
            title="أرباح التوصيل"
            records={preview.captainRecords.filter((r) => r.kind === 'captain-earning')}
            emptyLabel="لا توجد أرباح"
          />
        </Box>

        {/* تسويات الشركاء */}
        <SectionBlock
          title="تسويات الشركاء"
          records={preview.partnerRecords.filter((r) => r.kind === 'partner-settlement')}
          emptyLabel="لا توجد تسويات شركاء"
        />

        {/* مالية توصيل المتجر — مفصول تمامًا عن تسوية الكابتن */}
        <StoreDeliveryFinanceSection />

        {/* مالية الميدانيين */}
        <Box gap={4}>
          <Text role="label" className={styles.sectionTitle}>
            مالية الميدانيين
          </Text>
          <SectionBlock
            title="عمولات معتمدة"
            records={preview.fieldRecords.filter((r) => r.kind === 'field-commission')}
            emptyLabel="لا توجد عمولات معتمدة"
          />
          <SectionBlock
            title="عمولات معلقة"
            records={preview.fieldRecords.filter((r) => r.kind === 'field-commission-pending')}
            emptyLabel="لا توجد عمولات معلقة"
          />
          <SectionBlock
            title="عمولات مرفوضة"
            records={preview.fieldRecords.filter((r) => r.kind === 'field-commission-rejected')}
            emptyLabel="لا توجد عمولات مرفوضة"
          />
          <SectionBlock
            title="صرف الميدانيين"
            records={preview.fieldRecords.filter((r) => r.kind === 'field-payout')}
            emptyLabel="لا توجد صرفيات"
          />
        </Box>

        {/* عمولة المنصة والمطابقة */}
        <SectionBlock
          title="عمولة المنصة"
          records={preview.platformRecords.filter((r) => r.kind === 'platform-commission')}
          emptyLabel="لا توجد بيانات عمولة"
        />
        <SectionBlock
          title="تسوية المطابقة"
          records={preview.platformRecords.filter((r) => r.kind === 'reconciliation-export')}
          emptyLabel="لا توجد تسويات مطابقة"
        />
      </Box>
    </Box>
  );
}

export function WltDshFinanceControlPanelPreview() {
  return <WltDshFinanceControlPanelContent />;
}

export default WltDshFinanceControlPanelPreview;
