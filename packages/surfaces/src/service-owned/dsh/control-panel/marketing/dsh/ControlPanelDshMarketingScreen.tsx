import React from 'react';
import { BthBox, BthSurface, BthText } from '@bthwani/ui-kit';
import { BthWebMissionHeroCard, BthWebSegmentedTabs, BthWebSignalCard } from '@bthwani/ui-kit/web';
import {
	ControlPanelDshMarketingScreen as SmartSignalLayerScreen,
	type ControlPanelDshMarketingScreenProps as SmartSignalLayerScreenProps,
} from './SmartSignalLayer';
import { BannersCommandDeckScreen } from './BannersCommandDeckScreen';
import { GrowthCommandDeckScreen } from './GrowthCommandDeckScreen';
import { LoyaltyCommandDeckScreen, type LoyaltyCommandDeckScreenProps } from './loyalty';

export type ControlPanelDshMarketingScreenProps = SmartSignalLayerScreenProps & LoyaltyCommandDeckScreenProps;

type MarketingControlView = 'banners' | 'growth' | 'loyalty' | 'signals';

const marketingViewMeta: Record<MarketingControlView, { title: string; description: string }> = {
	growth: {
		title: 'النمو والعروض',
		description: 'إدارة البرامج، الاشتراكات، والحملات من سطح واحد واضح وسريع الاستيعاب.',
	},
	banners: {
		title: 'إدارة البنرات',
		description: 'تحكم مباشر في الرسائل البصرية التي تظهر في تطبيق العميل مع نشر فوري وقياس أوضح.',
	},
	loyalty: {
		title: 'الولاء والاشتراكات',
		description: 'تحويل الولاء من عرض ضعيف إلى مسار تجاري حقيقي يضبط الخطة والمزايا والرسائل.',
	},
	signals: {
		title: 'الإشارات الذكية',
		description: 'تنظيم التنبيهات والرسائل الديناميكية وفق الأولوية والجمهور والتوقيت دون فوضى.',
	},
};

export function ControlPanelDshMarketingScreen(props: ControlPanelDshMarketingScreenProps) {
	const [activeView, setActiveView] = React.useState<MarketingControlView>('growth');
	const activeMeta = marketingViewMeta[activeView];
	const showOverviewShell = activeView === 'growth' || activeView === 'banners';

	return (
		<BthBox gap={4}>
			{showOverviewShell ? (
				<>
					<BthWebMissionHeroCard
						dense
						badges={['التسويق', 'تحكم حي', 'تجربة بريميم']}
						eyebrow="غرفة قيادة التسويق"
						title="تسويق حديث وفاخر يقدّم تحكمًا حقيقيًا"
						description="تمت إعادة تشكيل قسم التسويق ليكون واضحًا، تفاعليًا، وقابلًا للإدارة الفورية بدل الأسطح الضعيفة أو النصوص التطويرية غير المفيدة."
						metaItems={[
							'4 مسارات تشغيل مملوكة',
							`المسار الحالي: ${activeMeta.title}`,
							'نشر وتعديل ومراجعة من نفس المساحة',
						]}
						primaryAction={{ label: 'فتح العمليات', href: props.hubHref ?? '/operations/dsh' }}
						secondaryAction={{ label: 'العودة للوحة', href: props.operationsHref ?? '/operations' }}
					/>

					<BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
						<BthWebSignalCard title="العروض والنمو" value="موحد" description="الحملات والاشتراكات والبرومو من غرفة واحدة" tone="best" />
						<BthWebSignalCard title="البنرات" value="مباشر" description="إنشاء ونشر وقياس من نفس السطح" />
						<BthWebSignalCard title="الولاء" value="مملوك" description="اشتراك ونقاط وكوبونات تحت تحكم أوضح" />
						<BthWebSignalCard title="الإشارات" value="ذكي" description="توقيت وأولوية وجمهور دون ازدحام بصري" />
					</BthBox>

					<BthSurface tone="inset" padding={4} gap={1}>
						<BthText role="titleSm">{activeMeta.title}</BthText>
						<BthText role="bodySm" tone="muted">{activeMeta.description}</BthText>
					</BthSurface>
				</>
			) : null}

			<BthWebSegmentedTabs
				ariaLabel="DSH marketing control view"
				items={[
					{ id: 'growth', label: 'العروض + الاشتراكات', metaLabel: 'تحكم موحد', active: activeView === 'growth' },
					{ id: 'banners', label: 'إدارة البنرات', metaLabel: 'نشر مباشر', active: activeView === 'banners' },
					{ id: 'loyalty', label: 'الولاء', metaLabel: 'قيمة العميل', active: activeView === 'loyalty' },
					{ id: 'signals', label: 'الإشارات الذكية', metaLabel: 'تفاعل حي', active: activeView === 'signals' },
				]}
				onSelect={(itemId) => setActiveView(itemId as MarketingControlView)}
			/>

			{activeView === 'growth' ? <GrowthCommandDeckScreen hubHref={props.hubHref} operationsHref={props.operationsHref} /> : null}
			{activeView === 'banners' ? <BannersCommandDeckScreen hubHref={props.hubHref} operationsHref={props.operationsHref} /> : null}
			{activeView === 'signals' ? <SmartSignalLayerScreen hubHref={props.hubHref} operationsHref={props.operationsHref} /> : null}
			{activeView === 'loyalty' ? <LoyaltyCommandDeckScreen hubHref={props.hubHref} operationsHref={props.operationsHref} /> : null}
		</BthBox>
	);
}

export default ControlPanelDshMarketingScreen;
