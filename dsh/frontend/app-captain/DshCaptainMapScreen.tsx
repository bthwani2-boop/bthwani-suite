'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelMapCanvas,
  WebControlPanelMapPin,
  WebControlPanelRouteLine,
  WebControlPanelStatusTag,
  WebControlPanelActionCluster,
} from '@bthwani/ui-kit/web';

import styles from './captain-map.module.css';

export function DshCaptainMapScreen() {
  const [taskStage, setTaskStage] = React.useState<'to-store' | 'to-customer' | 'proof'>('to-store');

  const taskData = {
    'to-store': {
      title: 'التوجه للمتجر',
      description: 'استلم الطلب من بيك إن بريستو (فرع التحلية)',
      pins: [
        { id: 'store', label: 'المتجر (نقطة الاستلام)', tone: 'brand' as const, pos: { top: '30%', right: '40%' } },
        { id: 'captain', label: 'موقعك الحالي', tone: 'info' as const, pos: { top: '70%', right: '60%' } },
      ],
      route: '60,70 50,50 40,30',
      action: 'تأكيد الوصول للمتجر',
    },
    'to-customer': {
      title: 'التوصيل للعميل',
      description: 'سلم الطلب في فيلا ١٢، شارع التحلية',
      pins: [
        { id: 'customer', label: 'العميل (نقطة التسليم)', tone: 'success' as const, pos: { top: '20%', right: '20%' } },
        { id: 'captain', label: 'موقعك الحالي', tone: 'info' as const, pos: { top: '30%', right: '40%' } },
      ],
      route: '40,30 30,25 20,20',
      action: 'تأكيد الوصول للعميل',
    },
    'proof': {
      title: 'إثبات التسليم',
      description: 'يرجى رفع صورة إثبات التسليم لإغلاق الطلب',
      pins: [
        { id: 'customer', label: 'موقع العميل', tone: 'success' as const, pos: { top: '20%', right: '20%' } },
        { id: 'captain', label: 'موقعك (عند العميل)', tone: 'info' as const, pos: { top: '22%', right: '22%' } },
      ],
      route: '',
      action: 'رفع الإثبات الآن',
    },
  };

  const currentTask = taskData[taskStage];

  return (
    <Box padding={4} className={styles.captainMapContainer}>
      <Box gap={1}>
        <Text role="titleLg">خريطة المهمة</Text>
        <Text role="bodySm" tone="muted">عرض المسار الحالي والوجهة القادمة.</Text>
      </Box>

      <div className={styles.captainMapCanvasWrapper}>
        <WebControlPanelMapCanvas
          legend={
            <Box gap={1} layoutDirection="row" wrap>
              <WebControlPanelStatusTag label="موقعك" tone="info" />
              <WebControlPanelStatusTag label="الوجهة" tone="brand" />
              <WebControlPanelStatusTag label="العميل" tone="success" />
            </Box>
          }
        >
          {currentTask.route && (
            <WebControlPanelRouteLine
              points={currentTask.route}
              tone="brand"
            />
          )}
          {currentTask.pins.map((pin) => (
            <WebControlPanelMapPin
              key={pin.id}
              label={pin.label}
              tone={pin.tone}
              position={pin.pos}
            />
          ))}
        </WebControlPanelMapCanvas>
      </div>

      <div className={styles.captainTaskInspector}>
        <Box layoutDirection="row" justifyContent="space-between" alignItems="center">
          <Text role="bodyStrong">{currentTask.title}</Text>
          <WebControlPanelStatusTag label="مهمة نشطة" tone="brand" />
        </Box>
        <Text role="bodySm" tone="muted">{currentTask.description}</Text>

        <WebControlPanelActionCluster
          primary={{
            id: 'next-stage',
            label: currentTask.action,
            onAction: () => {
              if (taskStage === 'to-store') setTaskStage('to-customer');
              else if (taskStage === 'to-customer') setTaskStage('proof');
              else setTaskStage('to-store');
            }
          }}
          secondary={{ id: 'contact', label: 'اتصال بالدعم' }}
        />
      </div>
    </Box>
  );
}

export default DshCaptainMapScreen;
