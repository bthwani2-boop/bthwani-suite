import { MobileRoot } from '@bthwani/ui-kit/mobile';
import { AppPartnerAppearanceProvider, useAppPartnerAppearance } from '../shell/appearance';
import PartnerSurfaceHost from '../shell/mobile-entry';

function AppPartnerRuntimeRoot() {
	const { mode } = useAppPartnerAppearance();

	return (
		<MobileRoot language="ar" themeMode="light" appearanceMode={mode}>
			<PartnerSurfaceHost />
		</MobileRoot>
	);
}

export default function App() {
	return (
		<AppPartnerAppearanceProvider>
			<AppPartnerRuntimeRoot />
		</AppPartnerAppearanceProvider>
	);
}
