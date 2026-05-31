'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Surface, Text, useTheme } from '@bthwani/ui-kit';
import { getDshSignalSummaries, getDshSignalUnreadCount } from '../../shared/dsh-signal-layer.model';
import styles from '../shared/control-panel-surface.module.css';

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

	// Marketing + catalog review signals for this surface (summaries only — details on explicit open)
	const catalogSignals = getDshSignalSummaries('control-panel', 'ops').filter(
		(s) => s.entityType === 'catalog' || s.entityType === 'marketing',
	);
	const catalogUnreadCount = getDshSignalUnreadCount('control-panel', 'ops');

	return (
		<Box gap={4}>
			{/* Sleek DSH Header (Unified Style) */}
			<div className={styles.surfaceTopBar} style={{ padding: '12px 16px', border: `1px solid var(--bthwani-control-panel-border)`, borderRadius: '16px', backgroundColor: 'var(--bthwani-control-panel-surface)' }}>
				<Box gap={0} style={{ flex: 1 }}>
					<Text role="caption" tone="muted" style={{ fontWeight: '800' }}>غرفة قيادة الإشارات الذكية</Text>
					<h2 className={styles.surfaceHeaderTitle} style={{ margin: '4px 0 0 0', fontSize: '18px', color: 'var(--bthwani-control-panel-text)' }}>لوحة الإشارات التسويقية ومنظومة المفضلة المشتركة</h2>
					<p className={styles.surfaceHeaderSubtitle} style={{ marginTop: '2px', fontSize: '11px' }}>طبقة مضغوطة لمراقبة نية الشراء، والطلب الكامن، وأداء الحملات التلقائية الموجهة بالمفضلة.</p>
				</Box>
				<div className={styles.surfaceHeaderActions}>
					<div className={styles.surfacePulseCompact} style={{ gap: '8px' }}>
						<div className={styles.commandKpi} style={{ padding: '4px 8px', minWidth: '90px' }}>
							<span className={styles.commandKpiLabel}>حالة الربط</span>
							<span className={styles.commandKpiValue} style={{ fontSize: '12px', color: 'var(--bthwani-success)' }}>معاينة تشغيلية</span>
						</div>
						<div className={styles.commandKpi} style={{ padding: '4px 8px', minWidth: '90px' }}>
							<span className={styles.commandKpiLabel}>محرك التوصيات</span>
							<span className={styles.commandKpiValue} style={{ fontSize: '12px', color: 'var(--bthwani-brand)' }}>نشط ومحدّث</span>
						</div>
						<Button label="العمليات" tone="primary" size="sm" onPress={() => navigateTo(operationsHref)} />
						<Button label="لوحة القيادة" tone="secondary" size="sm" onPress={() => navigateTo(hubHref)} />
					</div>
				</div>
			</div>

			{/* Executive KPIs in Sleek Row */}
			<div className={styles.surfacePulseCompact} style={{ flexWrap: 'wrap', gap: '12px' }}>
				<div className={styles.commandKpi} style={{ flex: 1, minWidth: '180px' }}>
					<span className={styles.commandKpiLabel}>إجمالي الوصول</span>
					<span className={`${styles.commandKpiValue} ${styles.commandKpiValueSuccess}`}>1.2M</span>
					<span className={styles.surfaceHeaderSubtitle} style={{ marginTop: '4px' }}>تقدير معاينة · UI_PREVIEW_ONLY</span>
				</div>
				<div className={styles.commandKpi} style={{ flex: 1, minWidth: '180px' }}>
					<span className={styles.commandKpiLabel}>إشارات الاهتمام (المفضلة)</span>
					<span className={`${styles.commandKpiValue} ${styles.commandKpiValueSuccess}`}>12.4K</span>
					<span className={styles.surfaceHeaderSubtitle} style={{ marginTop: '4px' }}>تقدير معاينة · UI_PREVIEW_ONLY</span>
				</div>
				<div className={styles.commandKpi} style={{ flex: 1, minWidth: '180px' }}>
					<span className={styles.commandKpiLabel}>إشارات التسويق والكتالوج</span>
					<span className={`${styles.commandKpiValue} ${styles.commandKpiValueAlert}`}>{catalogSignals.length}</span>
					<span className={styles.surfaceHeaderSubtitle} style={{ marginTop: '4px' }}>اعتماد ورفض وتسليم المحتوى التجاري</span>
				</div>
				<div className={styles.commandKpi} style={{ flex: 1, minWidth: '180px' }}>
					<span className={styles.commandKpiLabel}>إشارات غير مقروءة</span>
					<span className={styles.commandKpiValue}>{catalogUnreadCount}</span>
					<span className={styles.surfaceHeaderSubtitle} style={{ marginTop: '4px' }}>إشارات تستلزم مراجعة أو إجراء</span>
				</div>
			</div>

			{/* Signals empty state */}
			{catalogSignals.length === 0 && (
				<div className={styles.surfaceCompactPanel} style={{ alignItems: 'center', padding: '24px', gap: '8px' }}>
					<Text style={{ fontSize: 28 }}>◎</Text>
					<Text role="bodyStrong" style={{ textAlign: 'center', color: 'var(--bthwani-control-panel-text)' }}>لا توجد إشارات تسويقية حالياً</Text>
					<Text role="bodySm" tone="muted" style={{ textAlign: 'center' }}>ستظهر إشارات الكتالوج والتسويق هنا عند تفعيل جسر البيانات.</Text>
				</div>
			)}

			{/* Comprehensive Multi-Surface Favorites Engine Analytics (Sleek Panel) */}
			<div className={styles.surfaceCompactPanel} style={{ gap: '16px' }}>
				<div className={styles.surfaceSectionHeader}>
					<h3 className={styles.surfacePanelTitle}>تحليلات منظومة المفضلة الذكية (DSH Favorites Engine)</h3>
					<p className={styles.surfaceHeaderSubtitle}>تحليل تفصيلي لدور المفضلة كإشارة نية شراء ومحرك نمو متعدد الأبعاد وليس مجرد صفحة عميل مستقلة.</p>
				</div>

				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
					{/* Dimension 1: Purchase Intent */}
					<div className={styles.surfaceInfoCard} style={{ flexDirection: 'column', alignItems: 'stretch', padding: '12px', gap: '6px' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<span className={styles.surfaceInfoCardTitle}>1. إشارات الاهتمام ونية الشراء (Purchase Intent)</span>
							<span className={styles.surfaceMetaChip} style={{ margin: 0, color: 'var(--bthwani-success)' }}>عالية الدقة</span>
						</div>
						<p className={styles.surfaceInfoCardDescription} style={{ margin: 0, fontSize: '11px', lineHeight: '1.5' }}>
							• تفاح رويال غالا: تمت إضافته بواسطة 1,850 مستخدماً هذا الأسبوع (نية شراء مرتفعة للسلع الطازجة).<br />
							• مطعم القلعة: 3,240 مستخدماً أضافوه للمفضلة كوجهة مفضلة رئيسية.
						</p>
					</div>

					{/* Dimension 2: Partner Growth */}
					<div className={styles.surfaceInfoCard} style={{ flexDirection: 'column', alignItems: 'stretch', padding: '12px', gap: '6px' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<span className={styles.surfaceInfoCardTitle}>2. مؤشر نمو الشريك وأهليته (Partner Growth Index)</span>
							<span className={styles.surfaceMetaChip} style={{ margin: 0, color: 'var(--bthwani-brand)' }}>بثواني برو</span>
						</div>
						<p className={styles.surfaceInfoCardDescription} style={{ margin: 0, fontSize: '11px', lineHeight: '1.5' }}>
							• تأهيل المتاجر: رفع أهلية الشريك تلقائياً للاشتراك في باقات "بثواني برو" بناءً على تجاوز عتبة 500 مفضلة نشطة.<br />
							• الاحتفاظ بالعملاء: يسجل الشركاء ذوو التفضيل العالي معدل تكرار طلبات أعلى بنسبة 42% مقارنة بالمتاجر الأخرى.
						</p>
					</div>

					{/* Dimension 3: Marketing Trigger */}
					<div className={styles.surfaceInfoCard} style={{ flexDirection: 'column', alignItems: 'stretch', padding: '12px', gap: '6px' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<span className={styles.surfaceInfoCardTitle}>3. المدخل التسويقي للحملات والعروض (Marketing Input Trigger)</span>
							<span className={styles.surfaceMetaChip} style={{ margin: 0, color: 'var(--bthwani-warning)' }}>تلقائي ذكي</span>
						</div>
						<p className={styles.surfaceInfoCardDescription} style={{ margin: 0, fontSize: '11px', lineHeight: '1.5' }}>
							• كوبونات مستهدفة: تم توليد حملة كوبونات آلية بخصم 15% لـ 1,200 مستخدم يفضلون "مطعم القلعة".<br />
							• العروض الكامنة: تنبيه بوجود عروض غير مفعلة تسويقياً لدى متاجر مدرجة في قائمة مفضلة نشطة لدى العملاء.
						</p>
					</div>

					{/* Dimension 4: Operational Latent Demand */}
					<div className={styles.surfaceInfoCard} style={{ flexDirection: 'column', alignItems: 'stretch', padding: '12px', gap: '6px' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<span className={styles.surfaceInfoCardTitle}>4. مؤشر الطلب الكامن والضغط التشغيلي (Latent Demand)</span>
							<span className={styles.surfaceMetaChip} style={{ margin: 0, color: 'var(--bthwani-danger)' }}>مراقبة جغرافية</span>
						</div>
						<p className={styles.surfaceInfoCardDescription} style={{ margin: 0, fontSize: '11px', lineHeight: '1.5' }}>
							• المنطقة الغربية: رصد ضغط طلب كامن متزايد (820 مفضلة نشطة لمنتجات تبعد مسافة أطول من 5 كم عن العميل).<br />
							• فرصة التوسع: 1,500 منتج محفوظ خارج النطاق الفعلي للتغطية السريعة - مؤشر جغرافي مهم لتوجيه الشركاء الجدد.
						</p>
					</div>
				</div>
			</div>

			{/* Bottom Policy & Diagnostics Panel (Sleek Panel) */}
			<div className={styles.surfaceCompactPanel} style={{ gap: '12px' }}>
				<h3 className={styles.surfacePanelTitle} style={{ fontSize: '13px' }}>ملاحظة فنية وهيكلية</h3>
				<p className={styles.surfaceHeaderSubtitle} style={{ fontSize: '11px', margin: 0 }}>
					جميع قراءات وإشارات المفضلة في هذا السطح هي محاكاة تفاعلية (Preview-only) ولا تتطلب ربطاً برمجياً بالـ Backend أو قواعد البيانات حالياً لضمان خفة واستقرار منظومة DSH الموزعة.
				</p>

				<div className={styles.surfaceMetaWrap} style={{ justifyContent: 'flex-start', gap: '8px' }}>
					<span className={styles.surfaceMetaChip}>
						{`قنوات إطلاق الإشارات: عبر التفضيل المباشر من HomeScreen و FavoriteToggle`}
					</span>
					<span className={styles.surfaceMetaChip}>
						{`الأثر التسويقي: رفع معدل التحويل العضوي بنسبة متوقعة تصل إلى 15%`}
					</span>
				</div>
			</div>
		</Box>
	);
}

export default ControlPanelDshMarketingScreen;
