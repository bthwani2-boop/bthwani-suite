import React from 'react';
import { WebCommandCenterFrame, WebSegmentedTabs, type WebCommandCenterNavItem, type WebSegmentedTabItem } from '@bthwani/ui-kit';

type Props = {
  activeServiceType: 'dsh' | 'arb';
  onOpenOrdersBoard: () => void;
  onOpenInventoryManagement: () => void;
  onOpenEntry: () => void;
  openStoreScope: () => void;
  onOpenWalletHub?: () => void;
  onOpenAccountHub?: () => void;
  onOpenSupportDirectory?: () => void;
};

export function PartnerDshConsoleScreen({ 
  activeServiceType, 
  onOpenOrdersBoard, 
  onOpenInventoryManagement, 
  onOpenEntry, 
  openStoreScope,
  onOpenWalletHub,
  onOpenAccountHub,
  onOpenSupportDirectory 
}: Props) {
  const [activeTab, setActiveTab] = React.useState('overview');

  const railItems: readonly WebCommandCenterNavItem[] = React.useMemo(() => {
    if (activeServiceType === 'dsh') {
      return [
        {
          id: 'orders',
          label: 'لوحة الطلبات',
          description: 'عرض وإدارة الطلبات الحالية',
          badge: '12',
          active: true,
        },
        {
          id: 'inventory',
          label: 'إدارة المنتجات',
          description: 'تحديث المخزون والمنتجات',
        },
        {
          id: 'schedule',
          label: 'ساعات العمل',
          description: 'تعديل أوقات العمل والمتاحة',
        },
        {
          id: 'assignments',
          label: 'الإسناد اليدوي',
          description: 'إسناد الطلبات للمندوبين يدوياً',
          badge: 'جديد',
        },
      ] as const;
    }

    return [
      {
        id: 'fleet',
        label: 'قائمة عرب',
        description: 'عرض حالة المركبات',
        badge: '7 متاح',
      },
      {
        id: 'routes',
        label: 'جدولة المسارات',
        description: 'تخطيط وتتبع مسارات التوزيع',
      },
      {
        id: 'tracking',
        label: 'تتبع التوزيع',
        description: 'متابعة عمليات التسليم الحية',
      },
    ] as const;
  }, [activeServiceType]);

  const overviewTabs: readonly WebSegmentedTabItem[] = [
    { id: 'overview', label: 'نظرة عامة', metaLabel: 'تشغيل', active: activeTab === 'overview' },
    { id: 'operations', label: 'غرفة العمليات', metaLabel: '37 نشط' },
    { id: 'assignments', label: 'الإسناد اليدوي', metaLabel: '5 بانتظار' },
    { id: 'reports', label: 'التقارير', metaLabel: 'يومي' },
    { id: 'settings', label: 'الإعدادات' },
  ] as const;

  const handleRailItemSelect = React.useCallback((itemId: string) => {
    switch (itemId) {
      case 'orders':
        onOpenOrdersBoard();
        break;
      case 'inventory':
        onOpenInventoryManagement();
        break;
      case 'assignments':
        setActiveTab('assignments');
        break;
      default:
        break;
    }
  }, [onOpenOrdersBoard, onOpenInventoryManagement]);

  return (
    <WebCommandCenterFrame
      brandLabel={activeServiceType === 'dsh' ? 'لوحة الشريك' : 'لوحة الشريك - ARB'}
      surfaceTitle={activeServiceType === 'dsh' ? 'مركز تشغيل الشريك' : 'مركز تشغيل ARB'}
      surfaceSubtitle={
        activeServiceType === 'dsh'
          ? 'نقطة التحكم المركزية لجميع عمليات المتجر ومتابعة الطلبات وإدارة الفريق.'
          : 'مركز التحكم التشغيلي لعمليات التوزيع وتتبع المركبات والمسارات.'
      }
      railTitle="الوحدات التشغيلية"
      railStatusLabel="متصل الآن"
      railItems={railItems}
      onRailItemSelect={handleRailItemSelect}
      onBrandClick={onOpenEntry}
      onRefreshClick={() => {}}
    >
      <WebSegmentedTabs
        items={overviewTabs}
        ariaLabel="أقسام لوحة التحكم"
        onSelect={setActiveTab}
      />

      <div style={{ marginTop: '24px', display: 'grid', gap: '20px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px'
        }}>
          <div style={{
            padding: '16px 20px',
            borderRadius: '16px',
            border: '1px solid rgba(10, 47, 92, 0.1)',
            background: '#ffffff',
          }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#0A2F5C' }}>37</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>طلب نشط</div>
          </div>
          <div style={{
            padding: '16px 20px',
            borderRadius: '16px',
            border: '1px solid rgba(10, 47, 92, 0.1)',
            background: '#ffffff',
          }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#FF500D' }}>5</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>بانتظار الإسناد</div>
          </div>
          <div style={{
            padding: '16px 20px',
            borderRadius: '16px',
            border: '1px solid rgba(10, 47, 92, 0.1)',
            background: '#ffffff',
          }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#0A2F5C' }}>94%</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>معدل الاكمال</div>
          </div>
          <div style={{
            padding: '16px 20px',
            borderRadius: '16px',
            border: '1px solid rgba(10, 47, 92, 0.1)',
            background: '#ffffff',
          }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#0A2F5C' }}>12:02</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>متوسط وقت التسليم</div>
          </div>
        </div>

        <div style={{
          padding: '20px',
          borderRadius: '20px',
          border: '1px solid rgba(10, 47, 92, 0.1)',
          background: 'linear-gradient(135deg, #0A2F5C 0%, #133e75 100%)',
          color: '#ffffff',
          display: 'grid',
          gap: '12px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.6px', opacity: 0.7 }}>نقطة البداية الرسمية</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>
            {activeServiceType === 'dsh' ? 'تشغيل المتجر من لوحة التحكم المركزية' : 'تشغيل عمليات التوزيع من مركز التحكم'}
          </div>
          <div style={{ fontSize: '15px', lineHeight: 1.6, opacity: 0.85 }}>
            {activeServiceType === 'dsh'
              ? 'هذه هي نقطة البداية الرسمية لفريق التشغيل. من هنا يمكنك إدارة جميع عمليات المتجر واتخاذ القرارات التشغيلية.'
              : 'من هنا يمكنك مراقبة وتوجيه عمليات التوزيع والتحكم في جميع مراحل عمليات التوصيل.'}
          </div>
        </div>
      </div>
    </WebCommandCenterFrame>
  );
}

export default PartnerDshConsoleScreen;
