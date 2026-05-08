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
		<Box gap={4} dir="rtl">
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

			<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
				<WebSignalCard title="إجمالي الوصول" value="1.2M" description="معدل وصول الحملات النشطة" tone="best" />
				<WebSignalCard title="معدل التحويل" value="4.8%" description="متوسط التحويل اليومي" tone="best" />
				<WebSignalCard title="النقرات النشطة" value="45K" description="نقرات على البنرات الذكية" />
				<WebSignalCard title="صحة الحملات" value="98%" description="مؤشر استقرار العروض" tone="neutral" />
			</Box>

			<Surface tone="raised" padding={6} gap={3} style={{ borderRadius: 16, alignItems: 'center', justifyContent: 'center', minHeight: 240, border: '1px dashed rgba(10,47,92,0.1)' }}>
				<Text role="titleSm" tone="muted" style={{ textAlign: 'center' }}>مساحة الرسوم البيانية والتحليلات المتقدمة</Text>
				<Text role="bodySm" tone="muted" style={{ textAlign: 'center', maxWidth: 450 }}>
					هذه المساحة مخصصة لعرض أداء البنرات، عروض الشركاء، والشريط الذكي بدلاً من تكرار أدوات التحرير المخصصة لها.
				</Text>
				<Box style={{ backgroundColor: '#F8FAFC', padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
					<Text role="caption" tone="muted" style={{ fontWeight: '800' }}>الحالة: جاهز للربط مع BI Service Layer</Text>
				</Box>
			</Surface>
		</Box>
	);
}

export default ControlPanelDshMarketingScreen;
