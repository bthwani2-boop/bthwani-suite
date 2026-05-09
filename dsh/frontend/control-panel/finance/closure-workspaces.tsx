import React from 'react';
import { Box } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelRecommendation,
  WebControlPanelActionCluster,
  WebControlPanelStatusTag,
} from '@bthwani/ui-kit/web';
import type { WebControlPanelDecisionRowRisk, WebControlPanelStatusTone } from '@bthwani/ui-kit/web';

type FinanceFlowItem = {
  id: string;
  amount: string;
  description: string;
  status: string;
  statusTone: WebControlPanelStatusTone;
  risk: WebControlPanelDecisionRowRisk;
  nextAction: string;
  reason: string;
  sla?: string;
};

function FinanceControlRoom({ items }: { items: FinanceFlowItem[] }) {
  return (
    <Box gap={4}>
      {items.map((item) => (
        <WebControlPanelDecisionRow
          key={item.id}
          entityId={item.amount}
          entityLabel={item.description}
          status={item.status}
          statusTone={item.statusTone}
          risk={item.risk}
          recommendation={item.nextAction}
          reason={item.reason}
          sla={item.sla}
          primaryAction={{ label: 'اعتماد', onAction: () => console.log('Approve', item.id) }}
          secondaryAction={{ label: 'مراجعة', onAction: () => console.log('Review', item.id) }}
          onInspect={() => console.log('Inspect', item.id)}
        />
      ))}
    </Box>
  );
}

export function ControlPanelDshSettlementScreen({ subGroup }: { subGroup?: string }) {
  const items: FinanceFlowItem[] = [
    {
      id: 'settle-1',
      amount: '٤,٥٠٠.٠٠ ر.س',
      description: 'تسوية كباتن - منطقة الرياض (الأسبوع ١٨)',
      status: 'جاهز للصرف',
      statusTone: 'success',
      risk: 'neutral',
      nextAction: 'تأكيد الحوالة البنكية',
      reason: 'تم مطابقة جميع سجلات التوصيل مع المحفظة',
      sla: 'خلال ٢٤ ساعة',
    },
    {
      id: 'settle-2',
      amount: '١٢,٣٠٠.٥٠ ر.س',
      description: 'تسوية متجر "الواحة" - عمولات COD',
      status: 'معلق للمراجعة',
      statusTone: 'warning',
      risk: 'warning',
      nextAction: 'مراجعة فوارق الجرد',
      reason: 'وجود نقص في المبالغ المحصلة مقارنة بالفواتير',
      sla: 'متأخر ٦ ساعات',
    }
  ];

  return (
    <Box gap={6}>
      <WebControlPanelRecommendation
        title="توصية النظام: أطلق دفعات الكباتن المعتمدة"
        reason="تم التحقق من ٩٥٪ من الرحلات آلياً، المخاطر المتبقية تقع ضمن الحدود المسموح بها."
        confidence="high"
        primaryAction={{ id: 'bulk-release', label: 'إطلاق الدفعات المختارة', onAction: () => {} }}
      />
      <FinanceControlRoom items={items} />
    </Box>
  );
}

export function ControlPanelDshCodReconciliationScreen({ hubHref, subGroup }: { hubHref: string; subGroup?: string }) {
  const items: FinanceFlowItem[] = [
    {
      id: 'cod-1',
      amount: '١,٢٠٠.٠٠ ر.س',
      description: 'تحصيل نقدي - كابتن فهد (ID: 992)',
      status: 'مكتمل',
      statusTone: 'success',
      risk: 'neutral',
      nextAction: 'أرشفة القيد',
      reason: 'تطابق المبلغ المودع مع سجلات الطلبات',
    },
    {
      id: 'cod-2',
      amount: '٨٥٠.٠٠ ر.س',
      description: 'تحصيل نقدي - كابتن عمر (ID: 104)',
      status: 'فارق نقدي',
      statusTone: 'danger',
      risk: 'danger',
      nextAction: 'فتح تحقيق مالي',
      reason: 'عجز في المبلغ المودع بقيمة ١٥٠ ر.س عن المسجل',
      sla: 'عاجل',
    }
  ];

  return <FinanceControlRoom items={items} />;
}

export function ControlPanelDshRefundQueueScreen({ hubHref, subGroup }: { hubHref: string; subGroup?: string }) {
  const items: FinanceFlowItem[] = [
    {
      id: 'ref-1',
      amount: '٣٤٠.٠٠ ر.س',
      description: 'استرداد طلب #8821 - إرجاع منتج',
      status: 'بانتظار التأكيد',
      statusTone: 'info',
      risk: 'neutral',
      nextAction: 'إرجاع للمحفظة',
      reason: 'تم استلام المنتج في المخزن بحالة جيدة',
    },
    {
      id: 'ref-2',
      amount: '٢,١٠٠.٠٠ ر.س',
      description: 'نزاع مالي - طلب #9012',
      status: 'تحت التدقيق',
      statusTone: 'warning',
      risk: 'warning',
      nextAction: 'التواصل مع الشريك',
      reason: 'ادعاء الشريك بعدم استلام المبلغ من الكابتن',
    }
  ];

  return <FinanceControlRoom items={items} />;
}

export function ControlPanelDshRiskAuditScreen({ hubHref, subGroup }: { hubHref: string; subGroup?: string }) {
  const items: FinanceFlowItem[] = [
    {
      id: 'audit-1',
      amount: '١٥,٠٠٠.٠٠ ر.س',
      description: 'نمط سحوبات غير معتاد - شريك X',
      status: 'اشتباه مرتفع',
      statusTone: 'danger',
      risk: 'danger',
      nextAction: 'إيقاف التسويات مؤقتاً',
      reason: 'زيادة مفاجئة في حجم المبيعات بنسبة ٤٠٠٪ في يوم واحد',
      sla: 'فوري',
    }
  ];

  return <FinanceControlRoom items={items} />;
}

export function ControlPanelDshFinanceScreen() {
  return <ControlPanelDshSettlementScreen />;
}

export default ControlPanelDshFinanceScreen;
