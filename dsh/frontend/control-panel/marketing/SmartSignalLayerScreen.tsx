'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Surface, Text, useTheme } from '@bthwani/ui-kit';
import { WebSignalCard } from '@bthwani/ui-kit/web';
import { getDshSignalSummaries, getDshSignalUnreadCount } from '../../shared/dsh-signal-layer.model';

export type ControlPanelDshMarketingScreenProps = {
	hubHref?: string;
	operationsHref?: string;
};

export function ControlPanelDshMarketingScreen({
	hubHref = '/',
	operationsHref = '/operations',
}: ControlPanelDshMarketingScreenProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const navigateTo = React.useCallback((href: string) => {
		router.push(href);
	}, [router]);

	// Catalog signals for marketing surface (summaries only — details on explicit open)
	const catalogSignals = getDshSignalSummaries('control-panel', 'ops').filter(
		(s) => s.entityType === 'catalog',
	);
	const catalogUnreadCount = getDshSignalUnreadCount('control-panel', 'ops');

	return (
		<Box gap={4}>
			{/* Header Dashboard Banner */}
			<Surface tone="raised" padding={4} gap={3} style={{ borderRadius: 16, borderWidth: 1, borderColor: theme.lineStrong }}>
				<Box gap={1}>
					<Text role="caption" tone="muted" style={{ fontWeight: '900' }}>غرفة قيادة الإشارات الذكية</Text>
					<Text role="titleMd" style={{ color: theme.brandHeaderBackground, fontWeight: '900' }}>لوحة الإشارات التسويقية ومنظومة المفضلة المشتركة</Text>
					<Text role="bodySm" tone="muted">طبقة مضغوطة لمراقبة نية الشراء، والطلب الكامن، وأداء الحملات التلقائية الموجهة بالمفضلة.</Text>
				</Box>

				<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
					<Surface tone="inset" padding={2} style={{ borderRadius: 10 }}>
						<Text role="caption" tone="muted" style={{ fontWeight: '800' }}>حالة الربط</Text>
						<Text role="bodySm" style={{ color: theme.success, fontWeight: '900' }}>معاينة تشغيلية (Preview-Only)</Text>
					</Surface>
					<Surface tone="inset" padding={2} style={{ borderRadius: 10 }}>
						<Text role="caption" tone="muted" style={{ fontWeight: '800' }}>محرك التوصيات</Text>
						<Text role="bodySm" style={{ color: theme.brandHeaderBackground, fontWeight: '900' }}>نشط ومحدث محلياً</Text>
					</Surface>
				</Box>

				<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
					<Button label="العمليات" tone="primary" size="sm" onPress={() => navigateTo(operationsHref)} />
					<Button label="لوحة القيادة" tone="secondary" size="sm" onPress={() => navigateTo(hubHref)} />
				</Box>
			</Surface>

			{/* Executive KPIs — signal-driven counts + static marketing KPIs */}
			<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
				<WebSignalCard title="إجمالي الوصول" value="1.2M" description="معدل وصول الحملات النشطة" tone="best" />
				<WebSignalCard title="إشارات الاهتمام (المفضلة)" value="12.4K" description="إشارات نية الشراء التراكمية" tone="best" />
				<WebSignalCard title="إشارات الكتالوج النشطة" value={String(catalogSignals.length)} description="نشر وإعتماد منتجات في طبقة الإشارات" />
				<WebSignalCard title="إشارات غير مقروءة" value={String(catalogUnreadCount)} description="إشارات تستلزم مراجعة أو إجراء" tone="neutral" />
			</Box>

			{/* Comprehensive Multi-Surface Favorites Engine Analytics */}
			<Surface tone="raised" padding={4} gap={4} style={{ borderRadius: 16, borderWidth: 1, borderColor: theme.lineStrong }}>
				<Box gap={1}>
					<Text role="titleMd" style={{ color: theme.brandHeaderBackground, fontWeight: '900' }}>تحليلات منظومة المفضلة الذكية (DSH Favorites Engine)</Text>
					<Text role="bodySm" tone="muted">تحليل تفصيلي لدور المفضلة كإشارة نية شراء ومحرك نمو متعدد الأبعاد وليس مجرد صفحة عميل مستقلة.</Text>
				</Box>

				<Box gap={3}>
					{/* Dimension 1: Purchase Intent */}
					<Surface tone="inset" padding={3} gap={1} style={{ borderRadius: 12 }}>
						<Box layoutDirection="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
							<Text role="bodyStrong" style={{ color: theme.brandHeaderBackground }}>1. إشارات الاهتمام ونية الشراء (Purchase Intent)</Text>
							<Surface tone="raised" padding={1} style={{ borderRadius: 6 }}><Text role="caption" style={{ color: theme.success }}>عالية الدقة</Text></Surface>
						</Box>
						<Text role="bodySm" tone="muted">
							• تفاح رويال غالا: تمت إضافته بواسطة 1,850 مستخدماً هذا الأسبوع (نية شراء مرتفعة للسلع الطازجة).{"\n"}
							• مطعم القلعة: 3,240 مستخدماً أضافوه للمفضلة كوجهة مفضلة رئيسية.
						</Text>
					</Surface>

					{/* Dimension 2: Partner Growth */}
					<Surface tone="inset" padding={3} gap={1} style={{ borderRadius: 12 }}>
						<Box layoutDirection="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
							<Text role="bodyStrong" style={{ color: theme.brandHeaderBackground }}>2. مؤشر نمو الشريك وأهليته (Partner Growth Index)</Text>
							<Surface tone="raised" padding={1} style={{ borderRadius: 6 }}><Text role="caption" style={{ color: theme.info }}>بثواني برو</Text></Surface>
						</Box>
						<Text role="bodySm" tone="muted">
							• تأهيل المتاجر: رفع أهلية الشريك تلقائياً للاشتراك في باقات "بثواني برو" بناءً على تجاوز عتبة 500 مفضلة نشطة.{"\n"}
							• الاحتفاظ بالعملاء: يسجل الشركاء ذوو التفضيل العالي معدل تكرار طلبات أعلى بنسبة 42% مقارنة بالمتاجر الأخرى.
						</Text>
					</Surface>

					{/* Dimension 3: Marketing Trigger */}
					<Surface tone="inset" padding={3} gap={1} style={{ borderRadius: 12 }}>
						<Box layoutDirection="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
							<Text role="bodyStrong" style={{ color: theme.brandHeaderBackground }}>3. المدخل التسويقي للحملات والعروض (Marketing Input Trigger)</Text>
							<Surface tone="raised" padding={1} style={{ borderRadius: 6 }}><Text role="caption" style={{ color: theme.warning }}>تلقائي ذكي</Text></Surface>
						</Box>
						<Text role="bodySm" tone="muted">
							• كوبونات مستهدفة: تم توليد حملة كوبونات آلية بخصم 15% لـ 1,200 مستخدم يفضلون "مطعم القلعة".{"\n"}
							• العروض الكامنة: تنبيه بوجود عروض غير مفعلة تسويقياً لدى متاجر مدرجة في قائمة مفضلة نشطة لدى العملاء.
						</Text>
					</Surface>

					{/* Dimension 4: Operational Latent Demand */}
					<Surface tone="inset" padding={3} gap={1} style={{ borderRadius: 12 }}>
						<Box layoutDirection="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
							<Text role="bodyStrong" style={{ color: theme.brandHeaderBackground }}>4. مؤشر الطلب الكامن والضغط التشغيلي (Latent Demand & Operational Pressure)</Text>
							<Surface tone="raised" padding={1} style={{ borderRadius: 6 }}><Text role="caption" style={{ color: theme.danger }}>مراقبة جغرافية</Text></Surface>
						</Box>
						<Text role="bodySm" tone="muted">
							• المنطقة الغربية: رصد ضغط طلب كامن متزايد (820 مفضلة نشطة لمنتجات تبعد مسافة أطول من 5 كم عن العميل).{"\n"}
							• فرصة التوسع: 1,500 منتج محفوظ خارج النطاق الفعلي للتغطية السريعة - مؤشر جغرافي مهم لتوجيه الشركاء الجدد.
						</Text>
					</Surface>
				</Box>
			</Surface>

			{/* Bottom Policy & Diagnostics Panel */}
			<Surface tone="raised" padding={4} gap={3} style={{ borderRadius: 16, borderWidth: 1, borderColor: theme.lineStrong }}>
				<Text role="titleSm" style={{ color: theme.brandHeaderBackground, fontWeight: '900' }}>ملاحظة فنية وهيكلية</Text>
				<Text role="bodySm" tone="muted">جميع قراءات وإشارات المفضلة في هذا السطح هي محاكاة تفاعلية (Preview-only) ولا تتطلب ربطاً برمجياً بالـ Backend أو قواعد البيانات حالياً لضمان خفة واستقرار منظومة DSH الموزعة.</Text>

				<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
					<Surface tone="inset" padding={3} style={{ borderRadius: 12, flex: 1, minWidth: 180 }}>
						<Text role="caption" tone="muted" style={{ fontWeight: '800' }}>قنوات إطلاق الإشارات</Text>
						<Text role="bodySm" style={{ color: theme.brandHeaderBackground, fontWeight: '900' }}>عبر التفضيل المباشر من HomeScreen و FavoriteToggle</Text>
					</Surface>
					<Surface tone="inset" padding={3} style={{ borderRadius: 12, flex: 1, minWidth: 180 }}>
						<Text role="caption" tone="muted" style={{ fontWeight: '800' }}>الأثر التسويقي</Text>
						<Text role="bodySm" style={{ color: theme.brandHeaderBackground, fontWeight: '900' }}>رفع معدل التحويل العضوي بنسبة متوقعة تصل إلى 15%</Text>
					</Surface>
				</Box>
			</Surface>
		</Box>
	);
}

export default ControlPanelDshMarketingScreen;
