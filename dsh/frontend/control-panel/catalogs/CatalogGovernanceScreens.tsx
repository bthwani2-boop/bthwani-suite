import React from 'react';
import { ControlPanelDshWorkspaceFrame } from '../shared';

export function ControlPanelDshCatalogApprovalScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="اعتماد الكتالوج"
      title="اعتماد العناصر وصحة الأسعار"
      description="يبقى اعتماد العناصر، حالة الإدراج، شذوذ الأسعار، واعتماد المخزون ظاهرًا داخل المسار نفسه."
      badges={['الكتالوج', 'الاعتماد']}
      metaItems={['اعتماد العناصر', 'حالة الإدراج', 'شذوذ الأسعار', 'اعتماد المخزون']}
      decisionBoard={{
        title: 'لوحة قرار الكتالوج',
        purpose: 'تحافظ على الاعتمادات وصحة الإدراج وبوابة النشر في قراءة تشغيلية واحدة.',
        primaryDecision: 'اعتمد العنصر أو علّقه أو أعده للتصحيح.',
        nextAction: 'افتح حوكمة الإدراج لمراجعة التعارضات والتكرارات وشذوذ الأسعار.',
        blockers: 'الاعتمادات المعلقة وتعارضات المخزون ما زالت تمنع النشر.',
        ownerSurface: 'catalogs',
        evidenceHint: 'دليل اعتماد الكتالوج مع إشارات صحة الأسعار',
        routeHint: '/catalogs',
        decisionTone: 'warning',
      }}
      primaryAction={{ label: 'افتح حوكمة الإدراج', href: '/operations?workspace=issues' }}
      secondaryAction={{ label: 'افتح لوحة المتابعة', href: '/operations?workspace=dashboard' }}
      signals={[
        { id: 'item-approval', title: 'اعتماد العناصر', value: 'جاهز', description: 'صف الاعتماد ظاهر وواضح.', tone: 'brand' },
        { id: 'listing-status', title: 'حالة الإدراج', value: 'ظاهر', description: 'العناصر النشطة وغير النشطة مقروءة بوضوح.', tone: 'best' },
        { id: 'price-anomaly', title: 'شذوذ الأسعار', value: 'مراجع', description: 'إشارات الشذوذ ما زالت صريحة.', tone: 'warning' },
        { id: 'inventory-approval', title: 'اعتماد المخزون', value: 'مفتوح', description: 'صف اعتماد المخزون واضح على السطح.', tone: 'warning' },
      ]}
    />
  );
}

export function ControlPanelDshListingGovernanceScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="حوكمة الإدراج"
      title="حوكمة إدراج الكتالوج"
      description="تبقى حالة الإدراج النشط وغير النشط وصحة كتالوج المتجر وإشارات التكرار والتعارض ظاهرة."
      badges={['الحوكمة']}
      metaItems={['نشط', 'غير نشط', 'الصحة', 'التكرارات']}
      decisionBoard={{
        title: 'لوحة حوكمة الإدراج',
        purpose: 'تحافظ على بوابة النشر النهائية ظاهرة قبل خروج أي عنصر من مسار الكتالوج.',
        primaryDecision: 'أبقِ الإدراج أو ادمجه أو احجبه قبل النشر.',
        nextAction: 'افتح اعتماد الكتالوج للعنصر المحدد أو مجموعة التعارض.',
        blockers: 'التكرارات والتعارضات وفجوات الصحة ما زالت تحتاج مراجعة.',
        ownerSurface: 'catalogs',
        evidenceHint: 'دليل التكرار أو التعارض مع صحة كتالوج المتجر',
        routeHint: '/catalogs',
        decisionTone: 'brand',
      }}
      primaryAction={{ label: 'افتح اعتماد الكتالوج', href: '/catalogs' }}
      secondaryAction={{ label: 'افتح لوحة المتابعة', href: '/operations?workspace=dashboard' }}
      signals={[
        { id: 'active-listing', title: 'الإدراجات النشطة', value: 'ظاهر', description: 'العناصر النشطة ما زالت سهلة المسح.', tone: 'best' },
        { id: 'inactive-listing', title: 'الإدراجات غير النشطة', value: 'ظاهر', description: 'العناصر غير النشطة ما زالت مقروءة.', tone: 'warning' },
        { id: 'catalog-health', title: 'صحة كتالوج المتجر', value: 'مفحوصة', description: 'تبقى صحة الكتالوج على السطح مباشرة.', tone: 'brand' },
        { id: 'duplicate-conflict', title: 'التكرار والتعارض', value: 'مرصود', description: 'الإشارات ظاهرة للتصعيد عند الحاجة.', tone: 'warning' },
      ]}
    />
  );
}

export default ControlPanelDshCatalogApprovalScreen;
