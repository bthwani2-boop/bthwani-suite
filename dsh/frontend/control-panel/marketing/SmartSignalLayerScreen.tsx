'use client';

import React from 'react';
import { Box, Button, Surface, Text, useTheme } from '@bthwani/ui-kit';
import { WebSignalCard } from '@bthwani/ui-kit/web';

export type ControlPanelDshMarketingScreenProps = {
	hubHref?: string;
	operationsHref?: string;
};

export function ControlPanelDshMarketingScreen({
	hubHref = '/',
	operationsHref = '/operations',
}: ControlPanelDshMarketingScreenProps) {
  const { theme } = useTheme();
  const navigateTo = React.useCallback((href: string) => {
		if (typeof window !== 'undefined') {
			window.location.assign(href);
		}
	}, []);

	return (
		<Box gap={4}>
			<Surface tone="raised" padding={4} gap={3} style={{ borderRadius: 16, borderWidth: 1, borderColor: theme.lineStrong }}>
				<Box gap={1}>
					<Text role="caption" tone="muted" style={{ fontWeight: '900' }}>غرفة قيادة الإشارات الذكية</Text>
					<Text role="titleMd" style={{ color: theme.brandHeaderBackground, fontWeight: '900' }}>لوحة الإشارات التسويقية</Text>
					<Text role="bodySm" tone="muted">طبقة مضغوطة لمراقبة الوصول والتحويل وصحة الحملات من دون بطاقات هبوط أو hero تسويقية.</Text>
				</Box>

				<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
					<Surface tone="inset" padding={2} style={{ borderRadius: 10 }}>
						<Text role="caption" tone="muted" style={{ fontWeight: '800' }}>التحديث</Text>
						<Text role="bodySm" style={{ color: theme.brandHeaderBackground, fontWeight: '900' }}>محلي داخل سطح التحكم</Text>
					</Surface>
					<Surface tone="inset" padding={2} style={{ borderRadius: 10 }}>
						<Text role="caption" tone="muted" style={{ fontWeight: '800' }}>التركيز الحالي</Text>
						<Text role="bodySm" style={{ color: theme.brandHeaderBackground, fontWeight: '900' }}>إشارات الأداء والتوصيات</Text>
					</Surface>
				</Box>

				<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
					<Button label="العمليات" tone="primary" size="sm" onPress={() => navigateTo(operationsHref)} />
					<Button label="لوحة القيادة" tone="secondary" size="sm" onPress={() => navigateTo(hubHref)} />
				</Box>
			</Surface>

			<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
				<WebSignalCard title="إجمالي الوصول" value="1.2M" description="معدل وصول الحملات النشطة" tone="best" />
				<WebSignalCard title="معدل التحويل" value="4.8%" description="متوسط التحويل اليومي" tone="best" />
				<WebSignalCard title="النقرات النشطة" value="45K" description="نقرات على البنرات الذكية" />
				<WebSignalCard title="صحة الحملات" value="98%" description="مؤشر استقرار العروض" tone="neutral" />
			</Box>

			<Surface tone="raised" padding={4} gap={3} style={{ borderRadius: 16, borderWidth: 1, borderColor: theme.lineStrong }}>
				<Text role="titleSm" style={{ color: theme.brandHeaderBackground, fontWeight: '900' }}>ملخص التحليلات والتوصيات</Text>
				<Text role="bodySm" tone="muted">هذه الطبقة تعرض القراءة التشغيلية المجمعة للبنرات، عروض الشركاء، والشريط الذكي من دون تكرار شاشات التحرير نفسها.</Text>

				<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
					<Surface tone="inset" padding={3} style={{ borderRadius: 12, minWidth: 180 }}>
						<Text role="caption" tone="muted" style={{ fontWeight: '800' }}>الأثر المتوقع</Text>
						<Text role="bodySm" style={{ color: theme.brandHeaderBackground, fontWeight: '900' }}>تركيز قرارات التسويق على الإشارات الأعلى تأثيرًا</Text>
					</Surface>
					<Surface tone="inset" padding={3} style={{ borderRadius: 12, minWidth: 180 }}>
						<Text role="caption" tone="muted" style={{ fontWeight: '800' }}>الخطوة التالية</Text>
						<Text role="bodySm" style={{ color: theme.brandHeaderBackground, fontWeight: '900' }}>راجع الحملة أو العرض الذي يحتاج قرارًا فوريًا</Text>
					</Surface>
				</Box>
			</Surface>
		</Box>
	);
}

export default ControlPanelDshMarketingScreen;
