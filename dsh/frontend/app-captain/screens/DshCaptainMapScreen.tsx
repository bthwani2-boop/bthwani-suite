'use client';

import React from 'react';
import { Badge, Box, Button, KeyValueList, SectionHeader, Surface, Text } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../parts/OperationScreen';

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

	const advanceStage = () => {
		if (taskStage === 'to-store') {
			setTaskStage('to-customer');
			return;
		}

		if (taskStage === 'to-customer') {
			setTaskStage('proof');
			return;
		}

		setTaskStage('to-store');
	};

	return (
		<DshOperationScreen
			title="خريطة المهمة"
			subtitle="عرض مرحلي مبسط للمسار والوجهة القادمة بنفس نغمة العرض الميداني المعتمدة في تطبيق العميل."
			content={
				<Box gap={3}>
					<Surface tone="brand" gap={3}>
						<Box layoutDirection="row" justify="space-between" align="center" gap={2}>
							<Text role="bodyStrong">{currentTask.title}</Text>
							<Badge label="مهمة نشطة" tone="brand" />
						</Box>
						<Text role="bodySm" tone="muted">{currentTask.description}</Text>
						<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
							<Badge label="موقعك" tone="info" />
							<Badge label="الوجهة" tone="brand" />
							<Badge label="العميل" tone="success" />
						</Box>
					</Surface>

					<Surface tone="raised" gap={3}>
						<SectionHeader title="المسار الحالي" subtitle="يبقى المسار مختصرًا إلى نقاط قرار واضحة بدل واجهة تحكم مكتبية." />
						<KeyValueList
							items={currentTask.pins.map((pin, index) => ({
								label: index === 0 ? 'المحطة التالية' : `النقطة ${index + 1}`,
								value: pin.label,
								tone: pin.tone,
							}))}
						/>
						<Text role="caption" tone="muted">
							{currentTask.route ? `المسار التقريبي: ${currentTask.route}` : 'لا يوجد مسار مرسوم لأن المهمة في مرحلة إثبات التسليم.'}
						</Text>
					</Surface>

					<Surface tone="inset" gap={3}>
						<SectionHeader title="التنقل بين المراحل" subtitle="بدّل المرحلة من نفس الشاشة مع الحفاظ على نفس تراتبية العميل: محتوى أولًا ثم إجراء واضح." />
						<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
							<Button label="إلى المتجر" tone={taskStage === 'to-store' ? 'primary' : 'secondary'} fullWidth={false} onPress={() => setTaskStage('to-store')} />
							<Button label="إلى العميل" tone={taskStage === 'to-customer' ? 'primary' : 'secondary'} fullWidth={false} onPress={() => setTaskStage('to-customer')} />
							<Button label="الإثبات" tone={taskStage === 'proof' ? 'primary' : 'secondary'} fullWidth={false} onPress={() => setTaskStage('proof')} />
						</Box>
					</Surface>
				</Box>
			}
			primaryActionLabel={currentTask.action}
			secondaryActionLabel="المرحلة التالية"
			tertiaryActionLabel="إعادة ضبط المسار"
			onPrimaryAction={advanceStage}
			onSecondaryAction={advanceStage}
			onTertiaryAction={() => setTaskStage('to-store')}
		/>
	);
}

export default DshCaptainMapScreen;
