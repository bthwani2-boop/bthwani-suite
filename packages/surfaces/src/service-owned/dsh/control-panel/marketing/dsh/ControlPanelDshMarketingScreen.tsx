import React from 'react';
import { BthBox, BthSurface, BthText } from '@bthwani/ui-kit';
import { BthWebSegmentedTabs } from '@bthwani/ui-kit/web';
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
		title: 'النمو والفيديوهات والعروض',
		description: 'إدارة الفيديوهات القصيرة، البرامج، الاشتراكات، والحملات من سطح واحد واضح وسريع الاستيعاب.',
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

	return (
		<BthBox gap={4}>
			<BthWebSegmentedTabs
				ariaLabel="DSH marketing control view"
				items={[
					{ id: 'growth', label: 'الفيديوهات + العروض', metaLabel: 'تحكم موحد', active: activeView === 'growth' },
					{ id: 'banners', label: 'إدارة البنرات', metaLabel: 'نشر مباشر', active: activeView === 'banners' },
					{ id: 'loyalty', label: 'الولاء', metaLabel: 'قيمة العميل', active: activeView === 'loyalty' },
					{ id: 'signals', label: 'الإشارات الذكية', metaLabel: 'تفاعل حي', active: activeView === 'signals' },
				]}
				onSelect={(itemId) => setActiveView(itemId as MarketingControlView)}
			/>

			<BthSurface tone="inset" padding={4} gap={1}>
				<BthText role="caption" tone="muted">{activeMeta.title}</BthText>
				<BthText role="bodySm" tone="muted">{activeMeta.description}</BthText>
			</BthSurface>

			<BthSurface tone="raised" padding={4} gap={4}>
				{activeView === 'growth' ? <GrowthCommandDeckScreen hubHref={props.hubHref} operationsHref={props.operationsHref} /> : null}
				{activeView === 'banners' ? <BannersCommandDeckScreen hubHref={props.hubHref} operationsHref={props.operationsHref} /> : null}
				{activeView === 'signals' ? <SmartSignalLayerScreen hubHref={props.hubHref} operationsHref={props.operationsHref} /> : null}
				{activeView === 'loyalty' ? <LoyaltyCommandDeckScreen hubHref={props.hubHref} operationsHref={props.operationsHref} /> : null}
			</BthSurface>
		</BthBox>
	);
}

export default ControlPanelDshMarketingScreen;
