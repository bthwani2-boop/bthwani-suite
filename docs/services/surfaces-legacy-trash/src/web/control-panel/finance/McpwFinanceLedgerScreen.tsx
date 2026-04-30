'use client';

import { SkeletonScreen } from '../components/SkeletonScreen';
import { BookOpen } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';

/** CONTROL PANEL الدفتر المحاسبي — واجهة عرض فقط؛ الربط بعمليات wlt_journal / partner_ledger لاحقاً. */
export default function McpwFinanceLedgerScreen() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('web.control panel.finance.McpwFinanceLedgerScreen.ledger')}
      subtitle={t('web.control panel.finance.McpwFinanceLedgerScreen.wltHoldsAndMovementsView')}
      icon={BookOpen}
      showComingSoon={true}
    />
  );
}

