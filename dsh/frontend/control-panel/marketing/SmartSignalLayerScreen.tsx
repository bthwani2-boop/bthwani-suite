'use client';

import React from 'react';
import { Box, Surface, Text, useUiText } from '@bthwani/ui-kit';
import { WebMissionHeroCard, WebSignalCard } from '@bthwani/ui-kit/web';

export type ControlPanelDshMarketingScreenProps = {
	hubHref?: string;
	operationsHref?: string;
};

export function ControlPanelDshMarketingScreen({
	hubHref = '/',
	operationsHref = '/operations',
}: ControlPanelDshMarketingScreenProps) {
	const { locale } = useUiText();

	return (
		<Box gap={4}>
			<WebMissionHeroCard
				dense
				badges={['مباشر', 'تحليل الأداء']}
				eyebrow={locale === 'en' ? 'Marketing signal command' : 'غرفة قيادة الإشارات الذكية'}
				title={locale === 'en' ? 'Smart-signal command center' : 'غرفة قيادة الإشارات الذكية'}
				metaItems={[
					'تحديث حي للبيانات',
					'جاهزية النظام: 100%',
				]}
				primaryAction={{ label: 'العمليات', href: operationsHref }}
				secondaryAction={{ label: 'لوحة القيادة', href: hubHref }}
			/>

			<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
				<WebSignalCard title="إجمالي الوصول" value="1.2M" description="معدل وصول الحملات النشطة" tone="best" />
				<WebSignalCard title="معدل التحويل" value="4.8%" description="متوسط التحويل اليومي" tone="best" />
				<WebSignalCard title="النقرات النشطة" value="45K" description="نقرات على البنرات الذكية" />
				<WebSignalCard title="صحة الحملات" value="98%" description="مؤشر استقرار العروض" tone="neutral" />
			</Box>

			<Surface tone="raised" padding={6} gap={3} style={{ borderRadius: 16, alignItems: 'center', justifyContent: 'center', minHeight: 200, border: '1px dashed rgba(10,47,92,0.1)' }}>
				<Text role="titleSm" tone="muted">مساحة الرسوم البيانية والتحليلات المتقدمة (Planned for Next Phase)</Text>
				<Text role="bodySm" tone="muted" style={{ textAlign: 'center', maxWidth: 400 }}>
					هذه المساحة مخصصة لعرض أداء البنرات، عروض الشركاء، والشريط الذكي بدلاً من تكرار أدوات التحرير المخصصة لها. لا تشمل هذه المساحة أي تبويبات داخلية لمنع التشظي أو تكرار الوظائف.
				</Text>
			</Surface>
		</Box>
	);
}

export default ControlPanelDshMarketingScreen;
